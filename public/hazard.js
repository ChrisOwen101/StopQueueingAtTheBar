/* Hazard perception test player.
   A test page provides a pool of clips as .hpt-shot elements (CSS keyframe
   animations) plus the matching data, then calls HazardTest.init(root, config).
   Each run deals a few clips from the pool in random order. The player drives the
   keyframes with the Web Animations API so each clip stops exactly on its hazard,
   waits for an answer, plays the outcome, then waits for Next.
   All audio (narration and sound effects) is pre-recorded with ElevenLabs by
   scripts/generate-audio.mjs and listed in audio/manifest.json. */

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;

  const DEFAULT_DUR = 10000;
  const DEFAULT_CUE = 5000;
  const DEFAULT_PICK = 5;
  const LETTERS = 'ABCD';

  // How many clips one run deals from the pool.
  const handSize = (config) => Math.min(config.pick || DEFAULT_PICK, config.clips.length);

  const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // [minimum fraction correct, grade, line]
  const DEFAULT_GRADES = [
    [1, 'Full licence.', 'You may approach any bar in the land.'],
    [0.75, 'Pass.', 'Close enough. Keep your eyes up.'],
    [0.5, 'Provisional licence.', 'Practise on a quiet Tuesday.'],
    [0, 'Fail.', 'Back to the sticker.'],
  ];

  // Everything the player can say is built here, so scripts/generate-audio.mjs
  // pre-records exactly the strings the player will ask for.
  const START_LINE = 'Clip one. Watch for the hazard.';
  const gradeFor = (grades, score, n) => grades.find(([min]) => score / n >= min);
  const resultLine = (grades, score, n) => {
    const [, grade, line] = gradeFor(grades, score, n);
    return `You scored ${score} out of ${n}. ${grade} ${line}`;
  };

  function spokenLines(config) {
    const grades = config.grades || DEFAULT_GRADES;
    const n = handSize(config);
    const lines = [START_LINE];
    config.clips.forEach((c) => {
      lines.push(c.question);
      c.options.forEach((o) => lines.push(o.say));
    });
    for (let s = 0; s <= n; s++) lines.push(resultLine(grades, s, n));
    return [...new Set(lines.filter(Boolean))];
  }

  // Sounds the player itself plays, plus every sound cued in the clips.
  const PLAYER_SOUNDS = ['hazard', 'correct', 'wrong', 'fanfare', 'sad'];

  function soundNames(config) {
    const names = [...PLAYER_SOUNDS];
    if (config.ambience) names.push(config.ambience);
    config.clips.forEach((c) => (c.sounds || []).forEach(([, fx]) => names.push(fx)));
    return [...new Set(names)];
  }

  // The ambience bed's level under narration and sound effects (which play at 1),
  // and its fade in and out in seconds.
  const AMBIENCE_GAIN = 0.3;
  const AMBIENCE_FADE = 0.4;

  // Plays the ElevenLabs recordings listed in the manifest through one AudioContext.
  // Narration lines interrupt each other; sound effects overlap; the ambience (a
  // sound name, optional) loops quietly underneath while it's switched on. Anything
  // missing from the manifest stays silent and logs a warning (run `npm run audio:check`).
  function createSound(ambienceName) {
    const AC = window.AudioContext || window.webkitAudioContext;
    let ctx = null;
    let muted = false;
    try {
      muted = localStorage.getItem('hpt-muted') === '1';
    } catch {}

    let manifest = { lines: {}, sfx: {} };
    const buffers = new Map();
    const warned = new Set();
    let voice = null;
    let timer = 0;
    let seq = 0;
    let bedOn = false;
    let bed = null;
    let bedSeq = 0;

    const fileFor = (kind, key) => {
      const url = manifest[kind] && manifest[kind][key];
      if (!url && !warned.has(kind + key)) {
        warned.add(kind + key);
        console.warn(`HazardTest: no recording for ${kind === 'sfx' ? 'sound' : 'line'} "${key}". Run npm run audio:generate.`);
      }
      return url || null;
    };

    const decode = (data) => new Promise((resolve, reject) => ctx.decodeAudioData(data, resolve, reject));

    const loadBuffer = (url) => {
      if (!buffers.has(url)) {
        const p = fetch(url)
          .then((r) => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.arrayBuffer();
          })
          .then(decode);
        p.catch((err) => {
          buffers.delete(url);
          console.warn(`HazardTest: could not load ${url}: ${err.message}`);
        });
        buffers.set(url, p);
      }
      return buffers.get(url);
    };

    const start = (buf) => {
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start();
      return src;
    };

    const stopVoice = () => {
      seq += 1;
      clearTimeout(timer);
      if (voice) {
        try {
          voice.stop();
        } catch {}
        voice = null;
      }
    };

    const startBed = () => {
      if (bed || muted || !ctx || !ambienceName) return;
      const url = fileFor('sfx', ambienceName);
      if (!url) return;
      const token = ++bedSeq;
      loadBuffer(url).then(
        (buf) => {
          if (token !== bedSeq || !bedOn || muted || bed) return;
          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(AMBIENCE_GAIN, ctx.currentTime + AMBIENCE_FADE);
          gain.connect(ctx.destination);
          const src = ctx.createBufferSource();
          src.buffer = buf;
          src.loop = true;
          src.connect(gain);
          src.start();
          bed = { src, gain };
        },
        () => {}
      );
    };

    const stopBed = () => {
      bedSeq += 1;
      if (!bed) return;
      const { src, gain } = bed;
      bed = null;
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setTargetAtTime(0, ctx.currentTime, AMBIENCE_FADE / 4);
      try {
        src.stop(ctx.currentTime + AMBIENCE_FADE);
      } catch {}
    };

    return {
      get muted() { return muted; },
      hush: stopVoice,
      // Must be called from a click: browsers only allow audio after a user gesture.
      unlock() {
        if (!ctx && AC) ctx = new AC();
        if (ctx && ctx.state === 'suspended') ctx.resume();
      },
      // Always revalidate the manifest: it changes on every regenerate, while the
      // hashed mp3 names it points to never do, so those can stay cached.
      loadManifest(url) {
        return fetch(url, { cache: 'no-cache' })
          .then((r) => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.json();
          })
          .then((m) => {
            manifest = { lines: m.lines || {}, sfx: m.sfx || {} };
            return true;
          })
          .catch((err) => {
            console.warn(`HazardTest: no audio manifest at ${url} (${err.message}). The test will be silent.`);
            return false;
          });
      },
      // Fetch and decode this test's recordings ahead of time (needs unlock() first).
      preload(lines, sounds) {
        if (!ctx) return;
        lines.forEach((t) => manifest.lines[t] && loadBuffer(manifest.lines[t]).catch(() => {}));
        sounds.forEach((n) => manifest.sfx[n] && loadBuffer(manifest.sfx[n]).catch(() => {}));
      },
      play(name) {
        if (muted || !ctx) return;
        const url = fileFor('sfx', name);
        if (url) loadBuffer(url).then((buf) => !muted && start(buf), () => {});
      },
      say(text, delay = 0) {
        if (muted || !ctx || !text) return;
        stopVoice();
        const url = fileFor('lines', text);
        if (!url) return;
        const token = seq;
        const due = performance.now() + delay;
        loadBuffer(url).then(
          (buf) => {
            if (token !== seq || muted) return;
            timer = setTimeout(() => {
              if (token !== seq || muted) return;
              voice = start(buf);
            }, Math.max(0, due - performance.now()));
          },
          () => {}
        );
      },
      // Switch the ambience bed on or off. Mute silences it; unmute brings it back if it's on.
      ambience(on) {
        bedOn = on;
        if (on) startBed();
        else stopBed();
      },
      setMuted(m) {
        muted = m;
        if (m) {
          stopVoice();
          stopBed();
        } else if (bedOn) startBed();
        try {
          localStorage.setItem('hpt-muted', m ? '1' : '0');
        } catch {}
      },
    };
  }

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  const CONTROLS = `
    <button type="button" class="hpt-btn hpt-play" aria-label="Play">
      <svg class="i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>
      <svg class="i-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h4.5v16H6zM13.5 4H18v16h-4.5z"/></svg>
    </button>
    <div class="hpt-track" aria-hidden="true"><div class="hpt-fill"></div></div>
    <p class="hpt-time" aria-hidden="true">0:00<span class="tot"></span></p>
    <button type="button" class="hpt-btn hpt-mute" aria-label="Mute sound" aria-pressed="false">
      <svg class="i-on" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h4l5-4v14l-5-4H3z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      <svg class="i-off" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h4l5-4v14l-5-4H3z"/><path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    </button>`;

  const fmt = (ms) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };

  /* config:
     clips:  the pool: [{ dur?, cue?, label, sounds: [[ms, name]], question, options: [{ text, ok?, say }] }]
     pick:   clips dealt per run, in random order (optional, default 5)
     grades: [[minFraction, grade, line]] highest first (optional)
     links:  [{ href, text }] shown with "Take it again" at the end (optional)
     posterAt: ms into the pool's first clip shown behind the start button (optional)
     ambience: a sound looped quietly under the whole test, e.g. 'pub' (optional)
     audio:  narration manifest URL (optional, default audio/manifest.json)
     To review particular clips, add ?clips=3,7 (pool positions, from 1) to the page URL. */
  function init(root, config) {
    const pool = config.clips;
    const grades = config.grades || DEFAULT_GRADES;
    const shots = [...root.querySelectorAll('.hpt-shot')];
    if (shots.length !== pool.length) console.warn(`HazardTest: ${shots.length} .hpt-shot elements but ${pool.length} clips`);
    if (!('getAnimations' in Element.prototype)) return;

    const stage = root.querySelector('.hpt-stage');
    const panel = root.querySelector('.hpt-panel');
    const clipNo = root.querySelector('.hpt-clipno');
    const sound = createSound(config.ambience);
    const lines = spokenLines(config);
    const sounds = soundNames(config);
    const forced = (new URLSearchParams(location.search).get('clips') || '')
      .split(',')
      .map((s) => parseInt(s, 10) - 1)
      .filter((i) => i >= 0 && i < pool.length);

    // Player chrome: hazard badge and start cover on the stage, controls below it.
    const badge = el('p', 'hpt-badge', 'hazard');
    badge.setAttribute('aria-hidden', 'true');
    const cover = el('div', 'hpt-cover');
    const startBtn = el('button', 'hpt-start');
    startBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>Start the test';
    startBtn.type = 'button';
    cover.append(startBtn, el('p', 'hpt-note', 'Turn your sound on for the commentary.'));
    sound.loadManifest(config.audio || 'audio/manifest.json').then((ok) => {
      if (!ok) cover.querySelector('.hpt-note').textContent = location.protocol === 'file:'
        ? "Sound can't load from a file. Open the test through the website or npm run dev."
        : "Sound couldn't load. Try refreshing the page.";
    });
    stage.append(badge, cover);

    const controls = el('div', 'hpt-controls');
    controls.innerHTML = CONTROLS;
    stage.after(controls);

    const playBtn = controls.querySelector('.hpt-play');
    const muteBtn = controls.querySelector('.hpt-mute');
    const track = controls.querySelector('.hpt-track');
    const fill = controls.querySelector('.hpt-fill');
    const timeText = controls.querySelector('.hpt-time').firstChild;
    const totText = controls.querySelector('.hpt-time .tot');

    // This run's hand: which pool clips, in what order, and where they sit on the timeline.
    let hand = [];
    let clips = [];
    let durs = [];
    let cues = [];
    let starts = [];
    let total = 0;
    let marks = [];

    const deal = () => {
      hand = forced.length ? forced : shuffle(pool.map((_, i) => i)).slice(0, handSize(config));
      clips = hand.map((i) => pool[i]);
      durs = clips.map((c) => c.dur || DEFAULT_DUR);
      cues = clips.map((c) => c.cue || DEFAULT_CUE);
      starts = durs.map((_, i) => durs.slice(0, i).reduce((a, b) => a + b, 0));
      total = durs.reduce((a, b) => a + b, 0);
      totText.textContent = ` / ${fmt(total)}`;
      marks.forEach((m) => m.remove());
      marks = clips.map((_, i) => {
        const m = el('i', 'hpt-mark');
        m.style.left = `${((starts[i] + cues[i]) / total) * 100}%`;
        track.appendChild(m);
        return m;
      });
    };

    let state = 'idle';
    let clip = 0;
    let anims = [];
    let clock = null;
    let running = false;
    let autoPaused = false;
    let held = false;
    let inView = true;
    let lastT = 0;
    let score = 0;
    let raf = 0;

    // The ambience plays for the whole test, through questions, outcomes and the
    // hold before Next. It stops while the viewer has paused, while the player is
    // away (scrolled out of view or tab hidden) and on the result. Mute is handled
    // by createSound.
    const syncAmbience = () => {
      const away = document.hidden || !inView;
      sound.ambience(state !== 'idle' && state !== 'done' && !held && !away);
    };

    const setState = (s) => {
      state = s;
      root.dataset.state = s;
      playBtn.disabled = s === 'asking';
    };

    const setRunning = (r) => {
      running = r;
      root.toggleAttribute('data-running', r);
      playBtn.setAttribute('aria-label', r ? 'Pause' : 'Play');
    };

    const now = () => (clock ? Number(clock.currentTime) || 0 : 0);

    const progress = (t) => {
      const done = starts[clip] + Math.min(t, durs[clip]);
      fill.style.setProperty('--p', (done / total).toFixed(4));
      timeText.textContent = fmt(done);
    };

    // Sound cues whose time falls in (from, to].
    const fire = (from, to) => {
      (clips[clip].sounds || []).forEach(([at, fx]) => {
        if (at > from && at <= to) sound.play(fx);
      });
    };

    const seek = (t) => {
      anims.forEach((a) => (a.currentTime = t));
      lastT = t;
      progress(t);
    };

    const show = (shot, dur) => {
      shots.forEach((s) => s.classList.toggle('on', s === shot));
      shot.style.setProperty('--dur', `${dur}ms`);
      return shot.getAnimations({ subtree: true });
    };

    const load = (i) => {
      clip = i;
      const shot = shots[hand[i]];
      anims = show(shot, durs[i]);
      clock = shot.querySelector('.hpt-clock').getAnimations()[0] || null;
      anims.forEach((a) => a.pause());
      stage.setAttribute('aria-label', `Clip ${i + 1} of ${clips.length}: ${clips[i].label}`);
      if (clipNo) clipNo.textContent = `clip ${i + 1} / ${clips.length}`;
    };

    const halt = () => {
      anims.forEach((a) => a.pause());
      cancelAnimationFrame(raf);
    };

    const tick = () => {
      // Never let a sound from after the hazard leak out before the question.
      const t = state === 'lead' ? Math.min(now(), cues[clip]) : now();
      fire(lastT, t);
      lastT = t;
      progress(t);
      if (state === 'lead' && t >= cues[clip]) return ask();
      // The outcome holds on its last frame until Next.
      if (state === 'outcome' && t >= durs[clip]) return pause();
      raf = requestAnimationFrame(tick);
    };

    const run = () => {
      anims.forEach((a) => a.play());
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    const resume = () => {
      autoPaused = false;
      held = false;
      setRunning(true);
      syncAmbience();
      run();
    };

    const pause = () => {
      setRunning(false);
      halt();
    };

    const startClip = (i) => {
      load(i);
      seek(0);
      setState('lead');
      held = false;
      syncAmbience();
      delete panel.dataset.verdict;
      panel.replaceChildren(el('p', 'hpt-wait', `Clip ${i + 1} of ${clips.length}. Watch for the hazard.`));
      if (reduceMotion) return ask();
      resume();
    };

    const ask = () => {
      halt();
      seek(cues[clip]);
      setRunning(false);
      setState('asking');

      const c = clips[clip];
      sound.play('hazard');
      sound.say(c.question, 350);

      const opts = el('div', 'hpt-opts');
      opts.setAttribute('role', 'group');
      opts.setAttribute('aria-label', c.question);
      c.options.forEach((o, i) => {
        const b = el('button', 'hpt-opt');
        b.type = 'button';
        b.style.setProperty('--i', i);
        b.append(el('b', null, LETTERS[i]), el('span', null, o.text));
        b.addEventListener('click', () => answer(i));
        opts.append(b);
      });
      delete panel.dataset.verdict;
      panel.replaceChildren(el('p', 'hpt-q', c.question), opts);
      opts.firstChild.focus({ preventScroll: true });
    };

    const answer = (i) => {
      if (state !== 'asking') return;
      const c = clips[clip];
      const o = c.options[i];
      if (o.ok) score += 1;
      marks[clip].classList.add(o.ok ? 'ok' : 'bad');

      sound.unlock();
      sound.play(o.ok ? 'correct' : 'wrong');
      sound.say(o.say, 450);

      const kids = [
        el('p', 'tag hpt-verdict', o.ok ? '✓ correct' : '✗ not quite'),
        el('p', 'hpt-say', o.say.replace(/^Correct\. /, '')),
      ];
      if (!o.ok) {
        const right = c.options.find((x) => x.ok);
        kids.push(el('p', 'hpt-answer', `The answer: ${right.text.replace(/\.$/, '')}.`));
      }
      const nextBtn = el('button', 'hpt-again', clip + 1 < clips.length ? 'Next clip →' : 'See your result →');
      nextBtn.type = 'button';
      nextBtn.addEventListener('click', next);
      const row = el('div', 'hpt-actions');
      row.append(nextBtn);
      kids.push(row);

      panel.dataset.verdict = o.ok ? 'right' : 'wrong';
      panel.replaceChildren(...kids);
      nextBtn.focus({ preventScroll: true });
      setState('outcome');

      // The outcome shows the right way to do it, whatever the answer.
      if (reduceMotion) seek(durs[clip]);
      else resume();
    };

    const next = () => {
      halt();
      sound.hush();
      if (clip + 1 < clips.length) startClip(clip + 1);
      else finish();
    };

    const finish = () => {
      setRunning(false);
      setState('done');
      syncAmbience();
      const n = clips.length;
      const [, grade, line] = gradeFor(grades, score, n);

      sound.play(score / n >= 0.75 ? 'fanfare' : 'sad');
      sound.say(resultLine(grades, score, n), 700);

      cover.replaceChildren(
        el('p', 'small', 'your result'),
        el('p', 'hpt-score', `${score}/${n}`),
        el('p', 'hpt-grade', grade),
        el('p', 'hpt-note', line)
      );
      cover.hidden = false;

      const again = el('button', 'hpt-again', 'Take it again');
      again.type = 'button';
      again.addEventListener('click', start);
      const row = el('div', 'hpt-actions');
      row.append(again);
      (config.links || []).forEach(({ href, text }) => {
        const a = el('a', 'plain', text);
        a.href = href;
        row.append(a);
      });
      delete panel.dataset.verdict;
      panel.replaceChildren(
        el('p', 'hpt-intro', score === n
          ? 'Flawless. The landlord nods at you. Briefly.'
          : 'Each diamond on the timeline is a hazard. Green, you got it right. Red, you didn\'t.'),
        el('p', 'hpt-intro', 'Every go deals a fresh hand of clips.'),
        row
      );
      again.focus({ preventScroll: true });

      // The certificate on a perfect run, or a line saying how to earn it (hazard-badge.js).
      import('./hazard-badge.js')
        .then((badge) => badge.result({ root, panel, score, n }))
        .catch((err) => console.warn(`HazardTest: no certificate (${err.message})`));
    };

    function start() {
      // A retake gets a fresh hand; the first run uses the one on the timeline already.
      if (state === 'done') deal();
      sound.unlock();
      sound.say(START_LINE);
      sound.preload(lines, sounds);
      score = 0;
      marks.forEach((m) => m.classList.remove('ok', 'bad'));
      cover.hidden = true;
      startClip(0);
    }

    startBtn.addEventListener('click', start);

    playBtn.addEventListener('click', () => {
      if (state === 'idle' || state === 'done') return start();
      if (state === 'asking') return;
      if (running) {
        held = true;
        pause();
        return syncAmbience();
      }
      // At the end of an outcome, play watches it again.
      if (state === 'outcome' && lastT >= durs[clip]) seek(cues[clip]);
      resume();
    });

    const syncMute = () => {
      root.toggleAttribute('data-muted', sound.muted);
      muteBtn.setAttribute('aria-pressed', String(sound.muted));
    };
    muteBtn.addEventListener('click', () => {
      sound.unlock();
      sound.setMuted(!sound.muted);
      syncMute();
    });
    syncMute();

    root.addEventListener('keydown', (e) => {
      if (state !== 'asking' || e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;
      const k = e.key.toLowerCase();
      const i = Math.max('1234'.indexOf(k), 'abcd'.indexOf(k));
      if (i >= 0 && i < clips[clip].options.length) answer(i);
    });

    // Pause when the player scrolls away or the tab is hidden; pick up again on return.
    const checkAway = () => {
      const away = document.hidden || !inView;
      if (away && running) {
        pause();
        autoPaused = true;
      } else if (!away && autoPaused) {
        resume();
      }
      syncAmbience();
    };
    if (hasIO) {
      new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
          checkAway();
        },
        { threshold: 0.35 }
      ).observe(stage);
    }
    document.addEventListener('visibilitychange', checkAway);

    deal();
    if (clipNo) clipNo.textContent = `${clips.length} clips`;

    // Poster frame behind the start button: the first clip in the pool.
    const posterAt = config.posterAt ?? Math.round((pool[0].cue || DEFAULT_CUE) / 2);
    show(shots[0], pool[0].dur || DEFAULT_DUR).forEach((a) => {
      a.pause();
      a.currentTime = posterAt;
    });
  }

  window.HazardTest = { init, spokenLines, soundNames };
})();
