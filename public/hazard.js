/* Hazard perception test player.
   A test page provides the clips as .hpt-shot elements (CSS keyframe animations)
   plus the matching data, then calls HazardTest.init(root, config).
   The player drives the keyframes with the Web Animations API so each clip stops
   exactly on its hazard, waits for an answer, then plays the outcome.
   All audio (narration and sound effects) is pre-recorded with ElevenLabs by
   scripts/generate-audio.mjs and listed in audio/manifest.json. */

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;

  const DEFAULT_DUR = 10000;
  const DEFAULT_CUE = 5000;
  const LETTERS = 'ABCD';

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
    const n = config.clips.length;
    const lines = [START_LINE];
    config.clips.forEach((c) => {
      lines.push(c.question);
      c.options.forEach((o) => lines.push(o.say));
    });
    for (let s = 0; s <= n; s++) lines.push(resultLine(grades, s, n));
    return [...new Set(lines.filter(Boolean))];
  }

  // Sounds the player itself plays, plus every sound named in the clips' events.
  const PLAYER_SOUNDS = ['hazard', 'correct', 'wrong', 'fanfare', 'sad'];

  function soundNames(config) {
    const names = [...PLAYER_SOUNDS];
    config.clips.forEach((c) => c.events.forEach(([, , fx]) => fx && names.push(fx)));
    return [...new Set(names)];
  }

  // Plays the ElevenLabs recordings listed in the manifest through one AudioContext.
  // Narration lines interrupt each other; sound effects overlap. Anything missing
  // from the manifest stays silent and logs a warning (run `npm run audio:check`).
  function createSound() {
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

    return {
      get muted() { return muted; },
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
      setMuted(m) {
        muted = m;
        if (m) stopVoice();
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
     clips:  [{ dur?, cue?, label, events: [[ms, caption|null, sound?]], question, options: [{ text, ok?, say }] }]
     grades: [[minFraction, grade, line]] highest first (optional)
     links:  [{ href, text }] shown with "Take it again" at the end (optional)
     posterAt: ms into clip 1 shown behind the start button (optional)
     audio:  narration manifest URL (optional, default audio/manifest.json) */
  function init(root, config) {
    const clips = config.clips;
    const grades = config.grades || DEFAULT_GRADES;
    const shots = [...root.querySelectorAll('.hpt-shot')];
    if (shots.length !== clips.length) console.warn(`HazardTest: ${shots.length} .hpt-shot elements but ${clips.length} clips`);
    if (!('getAnimations' in Element.prototype)) return;

    const stage = root.querySelector('.hpt-stage');
    const panel = root.querySelector('.hpt-panel');
    const clipNo = root.querySelector('.hpt-clipno');
    const sound = createSound();
    const lines = spokenLines(config);
    const sounds = soundNames(config);

    // Player chrome: hazard badge and start cover on the stage, captions and controls below it.
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

    const sub = el('p', 'hpt-sub');
    sub.setAttribute('aria-hidden', 'true');
    const controls = el('div', 'hpt-controls');
    controls.innerHTML = CONTROLS;
    stage.after(sub, controls);

    const playBtn = controls.querySelector('.hpt-play');
    const muteBtn = controls.querySelector('.hpt-mute');
    const track = controls.querySelector('.hpt-track');
    const fill = controls.querySelector('.hpt-fill');
    const timeText = controls.querySelector('.hpt-time').firstChild;

    const durs = clips.map((c) => c.dur || DEFAULT_DUR);
    const cues = clips.map((c) => c.cue || DEFAULT_CUE);
    const starts = durs.map((_, i) => durs.slice(0, i).reduce((a, b) => a + b, 0));
    const total = durs.reduce((a, b) => a + b, 0);
    controls.querySelector('.hpt-time .tot').textContent = ` / ${fmt(total)}`;

    const marks = clips.map((_, i) => {
      const m = el('i', 'hpt-mark');
      m.style.left = `${((starts[i] + cues[i]) / total) * 100}%`;
      track.appendChild(m);
      return m;
    });

    let state = 'idle';
    let clip = 0;
    let anims = [];
    let clock = null;
    let running = false;
    let autoPaused = false;
    let inView = true;
    let lastT = 0;
    let score = 0;
    let raf = 0;

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

    const showCaption = (t) => {
      let text = '';
      clips[clip].events.forEach(([at, cap]) => {
        if (at <= t && cap) text = cap;
      });
      sub.textContent = text;
    };

    // Captions and sound cues whose time falls in (from, to].
    const fire = (from, to) => {
      clips[clip].events.forEach(([at, cap, fx]) => {
        if (at > from && at <= to) {
          if (cap) sub.textContent = cap;
          if (fx) sound.play(fx);
        }
      });
    };

    const seek = (t) => {
      anims.forEach((a) => (a.currentTime = t));
      lastT = t;
      showCaption(t);
      progress(t);
    };

    const load = (i) => {
      clip = i;
      shots.forEach((s, j) => s.classList.toggle('on', j === i));
      const shot = shots[i];
      shot.style.setProperty('--dur', `${durs[i]}ms`);
      anims = shot.getAnimations({ subtree: true });
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
      // Never let a caption from after the hazard leak out before the question.
      const t = state === 'lead' ? Math.min(now(), cues[clip]) : now();
      fire(lastT, t);
      lastT = t;
      progress(t);
      if (state === 'lead' && t >= cues[clip]) return ask();
      if (state === 'outcome' && t >= durs[clip]) {
        halt();
        return next();
      }
      raf = requestAnimationFrame(tick);
    };

    const run = () => {
      anims.forEach((a) => a.play());
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    const resume = () => {
      autoPaused = false;
      setRunning(true);
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
      panel.dataset.verdict = o.ok ? 'right' : 'wrong';
      panel.replaceChildren(...kids);
      panel.focus({ preventScroll: true });
      setState('outcome');

      if (reduceMotion) {
        seek(durs[clip]);
        const btn = el('button', 'hpt-again', clip + 1 < clips.length ? 'Next clip →' : 'See your result →');
        btn.type = 'button';
        btn.addEventListener('click', next);
        const row = el('div', 'hpt-actions');
        row.append(btn);
        panel.append(row);
        return;
      }
      resume();
    };

    const next = () => {
      if (clip + 1 < clips.length) startClip(clip + 1);
      else finish();
    };

    const finish = () => {
      setRunning(false);
      setState('done');
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
      sub.textContent = '';

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
        row
      );
    };

    function start() {
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
      if (state === 'idle' || state === 'done') start();
      else if (state === 'asking') return;
      else if (running) pause();
      else resume();
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

    // Poster frame behind the start button.
    panel.tabIndex = -1;
    load(0);
    anims.forEach((a) => (a.currentTime = config.posterAt ?? Math.round(cues[0] / 2)));
    if (clipNo) clipNo.textContent = `${clips.length} clips`;
  }

  window.HazardTest = { init, spokenLines, soundNames };
})();
