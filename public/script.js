// Don't Queue At The Bar

document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasIO = 'IntersectionObserver' in window;

// Each part of the page runs on its own, so one that breaks (an old browser, a missing
// element) never takes the petition form down with it.
const guard = (label, fn) => {
  try {
    return fn();
  } catch (err) {
    console.error(`${label} failed`, err);
    return undefined;
  }
};

/* ---------- Reveal each screen as it scrolls into view ---------- */

const revealTargets = document.querySelectorAll('.reveal');

const revealAll = () => revealTargets.forEach((el) => el.classList.add('in'));

if (hasIO) {
  // A screen taller than the window (a phone on its side, text zoomed to 200%) can never be
  // 15% inside it, so also reveal once a good slice of the window shows the screen.
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const slice = entry.rootBounds ? entry.intersectionRect.height / entry.rootBounds.height : 0;
        if (entry.isIntersecting && (entry.intersectionRatio >= 0.15 || slice >= 0.2)) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: Array.from({ length: 21 }, (_, i) => i / 20), rootMargin: '0px 0px -8% 0px' }
  );
  revealTargets.forEach((el) => io.observe(el));
} else {
  revealAll();
}

// Printing or saving as PDF never scrolls, so show everything.
window.addEventListener('beforeprint', revealAll);

/* ---------- Days since: the "today" stop on the history strip ----------
   [data-since="YYYY-MM-DD"] gets the real figure written into the DOM at load, so screen
   readers, print and copy always get "1,911 days", never a count in progress. The count-up
   is visual only: an aria-hidden twin shows the running number while the real text is hidden
   visually, then the twin clears. Without JS the written fallback ("over five years") stays. */

guard('days since', () => {
  const DAY = 86400000;
  const fmt = (n) => `${n.toLocaleString('en-GB')} days`;

  document.querySelectorAll('[data-since]').forEach((el) => {
    const [y, m, d] = el.dataset.since.split('-').map(Number);
    const now = new Date();
    const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()); // ticks over at local midnight
    const days = Math.floor((today - Date.UTC(y, m - 1, d)) / DAY);
    if (!Number.isFinite(days) || days < 1) return; // keep the written fallback

    const txt = el.querySelector('.count-txt') || el;
    const twin = el.querySelector('.count-vis');
    txt.textContent = fmt(days);
    if (!twin || reduceMotion || !hasIO) return;

    const settle = () => {
      el.classList.remove('is-counting');
      twin.removeAttribute('data-shown');
    };
    const run = () => {
      const start = performance.now();
      el.classList.add('is-counting');
      const frame = (t) => {
        if (!el.classList.contains('is-counting')) return; // printing cut it short
        const p = Math.min((t - start) / 1400, 1);
        twin.dataset.shown = fmt(Math.round(days * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(frame);
        else settle();
      };
      requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      run();
    }, { threshold: 0.6 });
    io.observe(el);
    window.addEventListener('beforeprint', settle);
  });
});

/* ---------- History strip: buttons, arrow keys and the "3 of 8" counter ----------
   The strip is a native horizontal scroller with snap points, so swiping and the scrollbar
   already work. This adds step buttons, keyboard stepping and the counter. */

guard('history strip', () => {
  const wrap = document.querySelector('.strip-wrap');
  const foot = document.querySelector('.strip-foot');
  if (!wrap || !foot) return;
  const strip = wrap.querySelector('.strip');
  const stops = [...wrap.querySelectorAll('.stop')];
  const buttons = [...foot.querySelectorAll('.strip-btn')];
  const countN = foot.querySelector('.strip-count .n');
  const countT = foot.querySelector('.strip-count .t');
  if (!strip || stops.length < 2) return;
  if (countT) countT.textContent = String(stops.length); // the total comes from the DOM, not the copy

  // The snap line is the middle of the snapport: the strip minus its right scroll padding
  // (the gutter the next card peeks into). Positions come from rects, so they hold
  // whatever the offsetParent is.
  const gutter = () => parseFloat(getComputedStyle(strip).scrollPaddingRight) || 0;
  const snapLine = () => (strip.clientWidth - gutter()) / 2;
  const centreOf = (s) => {
    const r = s.getBoundingClientRect();
    return r.left - strip.getBoundingClientRect().left + strip.scrollLeft + r.width / 2;
  };
  const currentIndex = () => {
    const line = strip.scrollLeft + snapLine();
    let best = 0;
    let dist = Infinity;
    stops.forEach((s, i) => {
      const d = Math.abs(centreOf(s) - line);
      if (d < dist) { dist = d; best = i; }
    });
    return best;
  };

  let idx = -1;
  let pending = null; // where a button press is heading, so quick presses add up
  const update = () => {
    const i = currentIndex();
    if (pending === i) pending = null;
    if (i === idx) return;
    idx = i;
    stops.forEach((s, n) => s.classList.toggle('current', n === i));
    if (countN) countN.textContent = String(i + 1);
    buttons.forEach((b) => {
      const dir = Number(b.dataset.dir);
      const off = (dir < 0 && i === 0) || (dir > 0 && i === stops.length - 1);
      b.setAttribute('aria-disabled', String(off));
    });
  };

  const goTo = (i) => {
    const n = Math.max(0, Math.min(stops.length - 1, i));
    pending = n;
    strip.scrollTo({ left: centreOf(stops[n]) - snapLine(), behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  const step = (dir) => goTo((pending ?? currentIndex()) + dir);

  buttons.forEach((b) => b.addEventListener('click', () => {
    if (b.getAttribute('aria-disabled') === 'true') return;
    step(Number(b.dataset.dir));
  }));

  strip.addEventListener('keydown', (e) => {
    if (e.target !== strip) return; // links inside the cards keep their own keys
    const keys = { ArrowRight: 1, ArrowLeft: -1 };
    if (e.key in keys) { e.preventDefault(); step(keys[e.key]); }
    else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    else if (e.key === 'End') { e.preventDefault(); goTo(stops.length - 1); }
  });

  // A swipe or a wheel takes over from any button press still in flight.
  ['pointerdown', 'wheel', 'touchstart'].forEach((type) =>
    strip.addEventListener(type, () => { pending = null; }, { passive: true }));

  let ticking = false;
  strip.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; update(); });
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
});

/* ---------- Pub scenes ----------
   A tiny simulation of a bar. Same arrivals, same four staff, same service time.
   - single:  one queue, only one member of staff can reach the front
   - cluster: customers spread along the bar, whoever is nearest serves them */

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STAFF_X = [18, 39, 61, 82];
const SLOTS = Array.from({ length: 8 }, (_, i) => 10 + i * (80 / 7));
const SERVICE_TICKS = 3;
const TICK_MS = 800;
const DRINK_MS = 400;        // pint slides from staff to customer, then they walk off
const ARRIVAL_NONE = 0.12;   // chance nobody turns up this tick
const ARRIVAL_PAIR = 0.78;   // chance two turn up together (otherwise one)
const MAX_SINGLE = 8;
const QUEUE_X = 39;
const SERVE_Y = 24;          // where the front of the single file steps up to the bar
const BAR_ROW_Y = 28;        // cluster: front row
const BACK_ROW_Y = 38;       // cluster: second row, behind someone
const BACK_ROW_CHANCE = 0.3; // cluster: someone stands behind rather than finding a gap
const STAFF_REACH = 7;       // cluster: how far staff slide along the bar to serve

function buildScene(el) {
  const mode = el.dataset.mode;
  const arrivals = mulberry32(7);
  const choices = mulberry32(21);
  const sway = mulberry32(99);

  el.innerHTML = '<div class="scene-stage"><div class="scene-bar"></div></div>' +
    '<div class="scene-score">pints served<b>0</b></div>';
  const stage = el.querySelector('.scene-stage');
  const scoreEl = el.querySelector('.scene-score b');

  const place = (node, x, y) => {
    node.style.left = `${x}%`;
    node.style.top = `${y}%`;
  };

  const makeDot = (cls, x, y) => {
    const d = document.createElement('div');
    d.className = `dot ${cls}`;
    place(d, x, y);
    stage.appendChild(d);
    void d.offsetWidth; // commit the start position so the move animates
    return d;
  };

  const staff = STAFF_X.map((x, i) => ({
    i,
    x,
    curX: x,
    el: makeDot('staff', x, 8),
    target: null,
    doneAt: 0,
  }));

  let customers = [];
  let tick = 0;
  let score = 0;
  let nextColour = 0;

  const move = (c, x, y) => {
    c.x = x;
    c.y = y;
    place(c.el, x, y);
  };

  // Single file: everyone in one line. Whoever is at the front steps up to the bar.
  const layoutSingle = () => {
    customers.forEach((c, i) => {
      if (c.serving) move(c, QUEUE_X, SERVE_Y);
      else move(c, QUEUE_X + Math.sin(i * 1.1) * 5, 28 + i * 9.5);
    });
  };

  const arrive = () => {
    if (mode === 'single') {
      if (customers.length >= MAX_SINGLE) return;
      customers.push({ el: makeDot(`cust c${nextColour++ % 5}`, QUEUE_X, 108), x: QUEUE_X, y: 108, serving: false });
      layoutSingle();
      return;
    }

    // Cluster: most people find a gap along the bar. Some end up standing behind someone.
    const taken = (slot, row) => customers.some((c) => c.slot === slot && c.row === row);
    const all = SLOTS.map((_, i) => i);
    const front = all.filter((i) => !taken(i, 0));
    const back = all.filter((i) => taken(i, 0) && !taken(i, 1));
    let slot;
    let row;
    if (front.length && (!back.length || choices() > BACK_ROW_CHANCE)) {
      slot = front[Math.floor(choices() * front.length)];
      row = 0;
    } else if (back.length) {
      slot = back[Math.floor(choices() * back.length)];
      row = 1;
    } else {
      return;
    }
    const startX = Math.min(95, Math.max(5, SLOTS[slot] + (choices() * 12 - 6)));
    const c = { el: makeDot(`cust c${nextColour++ % 5}`, startX, 108), x: startX, y: 108, serving: false, slot, row };
    customers.push(c);
    move(c, SLOTS[slot], row ? BACK_ROW_Y : BAR_ROW_Y);
  };

  // Drink in hand: walk away from the bar and fade out.
  const leave = (c) => {
    c.el.classList.remove('serving');
    c.el.classList.add('leaving', 'has-drink');
    if (mode === 'single') move(c, -12, SERVE_Y + 2);
    else move(c, c.x + (c.x < 50 ? -9 : 9), 112);
    c.el.style.opacity = '0';
    setTimeout(() => c.el.remove(), 1600);
  };

  const finish = (c, s) => {
    customers = customers.filter((x) => x !== c);
    score += 1;
    scoreEl.textContent = score;

    if (mode === 'single') {
      layoutSingle(); // everyone shuffles up one
    } else {
      // Anyone standing behind steps into the gap.
      const next = customers.find((x) => x.slot === c.slot && x.row === 1);
      if (next) {
        next.row = 0;
        move(next, SLOTS[next.slot], BAR_ROW_Y);
      }
    }

    // The pint slides across the bar to the customer, who then takes it and goes.
    const pint = document.createElement('div');
    pint.className = 'pint';
    place(pint, s.curX, 16);
    stage.appendChild(pint);
    void pint.offsetWidth;
    place(pint, c.x, c.y - 4);
    setTimeout(() => {
      pint.remove();
      leave(c);
    }, DRINK_MS);
  };

  const choose = (s) => {
    if (mode === 'single') {
      // Only one member of staff can reach the front of the queue.
      if (s.i !== 1) return null;
      const front = customers[0];
      return front && !front.serving ? front : null;
    }
    // Only people at the bar itself can be served, not those standing behind.
    const waiting = customers.filter((c) => !c.serving && c.row === 0);
    if (!waiting.length) return null;
    waiting.sort((a, b) => Math.abs(SLOTS[a.slot] - s.x) - Math.abs(SLOTS[b.slot] - s.x));
    return waiting[0];
  };

  const step = () => {
    tick += 1;
    const r = arrivals();
    const arriving = r < ARRIVAL_NONE ? 0 : r > ARRIVAL_PAIR ? 2 : 1;
    for (let n = 0; n < arriving; n++) arrive();

    staff.forEach((s) => {
      if (s.target && tick >= s.doneAt) {
        finish(s.target, s);
        s.target = null;
      }
      if (!s.target) {
        const c = choose(s);
        if (c) {
          s.target = c;
          c.serving = true;
          c.el.classList.add('serving');
          s.doneAt = tick + SERVICE_TICKS;
          if (mode === 'single') move(c, QUEUE_X, SERVE_Y); // step up to the bar
        }
      }
      s.el.classList.toggle('busy', !!s.target);
      s.el.classList.toggle('idle', !s.target);

      // Busy staff in the cluster slide along the bar to their customer.
      // Idle staff sway a little from side to side.
      let x = s.x;
      if (!s.target) x = s.x + (sway() - 0.5) * 7;
      else if (mode === 'cluster') x = s.x + Math.max(-STAFF_REACH, Math.min(STAFF_REACH, (s.target.x - s.x) * 0.5));
      s.curX = x;
      s.el.style.left = `${x}%`;
    });
  };

  // Pre-roll so the scene isn't empty when it appears. With reduced motion the sim
  // never runs, so roll further and keep the score: the still frame must show the comparison.
  for (let i = 0; i < (reduceMotion ? 30 : 6); i++) step();
  if (!reduceMotion) {
    score = 0;
    scoreEl.textContent = '0';
  }

  let timer = null;
  return {
    start() {
      if (!timer && !reduceMotion) timer = setInterval(step, TICK_MS);
    },
    stop() {
      clearInterval(timer);
      timer = null;
    },
  };
}

const scenes = [...document.querySelectorAll('.scene')]
  .map((el) => guard('scene', () => ({ el, sim: buildScene(el), visible: !hasIO })))
  .filter(Boolean);

// A hidden tab has no use for four simulations.
document.addEventListener('visibilitychange', () => {
  scenes.forEach((s) => (document.hidden ? s.sim.stop() : s.visible && s.sim.start()));
});

if (hasIO) {
  const sceneIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const scene = scenes.find((s) => s.el === entry.target);
        if (!scene) return;
        scene.visible = entry.isIntersecting;
        if (entry.isIntersecting) scene.sim.start();
        else scene.sim.stop();
      });
    },
    { threshold: 0.3 }
  );
  scenes.forEach((s) => sceneIO.observe(s.el));
} else {
  scenes.forEach((s) => s.sim.start());
}

/* ---------- How to do The Cluster: one sticky stage, four steps, driven by scroll ----------
   #howto is 4.5 viewports tall and its stage sticks to the top of the window. The scroll
   position through the section is cut into five equal slices (the intro, then steps 1 to 4).
   The stage gets the cumulative classes s1..s4, the block colour, and --k (0 to 1, how far
   through the current slice) so the dots can act each step out as the visitor scrolls. The
   markup ships the finished frame for visitors without JS; this resets it. */

const howto = document.getElementById('howto');

if (howto) guard('howto', () => {
  const stick = howto.querySelector('.howto-stick');
  const head = howto.querySelector('.howto-head');
  const steps = [...howto.querySelectorAll('.steps > .step')];
  const pills = [...howto.querySelectorAll('.step-nav li:not(.step-fill)')];
  const N = steps.length;
  if (!stick || !head || !N) return;
  const SLICES = N + 1;
  const BLOCK = (n) => (n === 0 ? 'c-cream' : n === N ? 'c-green' : 'c-blue');
  const SERVED_AT = 0.8; // how far through the last step the pint reaches you
  let current = -1;

  const travel = () => howto.offsetHeight - stick.offsetHeight;

  const setState = (n, k) => {
    stick.style.setProperty('--k', k.toFixed(3));
    stick.style.setProperty('--sp', (n === 0 ? 0 : Math.min(1, (n - 1 + k) / (N - 1))).toFixed(3));
    stick.classList.toggle('served', n === N && k >= SERVED_AT);
    if (n === current) return;
    current = n;
    for (let i = 1; i <= N; i++) stick.classList.toggle(`s${i}`, n >= i);
    ['c-cream', 'c-blue', 'c-green'].forEach((c) => stick.classList.toggle(c, c === BLOCK(n)));
    head.classList.toggle('active', n === 0);
    steps.forEach((li, i) => li.classList.toggle('active', i + 1 === n));
    pills.forEach((li, i) => {
      li.classList.toggle('done', i + 1 < n);
      const a = li.querySelector('a');
      if (i + 1 === n) a.setAttribute('aria-current', 'step');
      else a.removeAttribute('aria-current');
    });
  };

  const update = () => {
    const t = travel();
    const p = t > 0 ? -howto.getBoundingClientRect().top / t : 1;
    const x = Math.min(SLICES - 1e-6, Math.max(0, p * SLICES));
    const n = Math.floor(x);
    setState(n, p >= 1 ? 1 : x - n);
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      update();
    });
  }, { passive: true });
  window.addEventListener('resize', update);
  // Paper can't scroll: print the finished frame, then go back to where the reader was.
  window.addEventListener('beforeprint', () => setState(N, 1));
  window.addEventListener('afterprint', update);
  update();
});

/* ---------- Timeline rail: where am I in the story? ---------- */

const timeline = document.querySelector('.timeline');

if (timeline) guard('timeline', () => {
  // Keep only the dots whose chapter exists, so a renamed section id can't break the rail.
  const pairs = [...timeline.querySelectorAll('li:not(.tl-fill)')]
    .map((li) => {
      const a = li.querySelector('a');
      const chapter = a && document.querySelector(a.getAttribute('href'));
      return chapter ? { li, a, chapter } : null;
    })
    .filter(Boolean);
  if (pairs.length < 2) return; // progress runs dot to dot, so it needs at least two
  const items = pairs.map((p) => p.li);
  const links = pairs.map((p) => p.a);
  const chapters = pairs.map((p) => p.chapter);
  const hero = document.getElementById('top') || chapters[0];

  const updateTimeline = () => {
    const y = window.scrollY;
    const mid = y + window.innerHeight * 0.5;
    const tops = chapters.map((el) => el.getBoundingClientRect().top + y);
    const last = tops.length - 1;

    let idx = -1;
    tops.forEach((t, i) => {
      if (mid >= t) idx = i;
    });

    // Progress runs dot to dot, so the fill always lines up with the marker.
    let p = 0;
    if (idx >= 0) {
      const frac = idx < last ? Math.min(1, Math.max(0, (mid - tops[idx]) / (tops[idx + 1] - tops[idx]))) : 0;
      p = (idx + frac) / last;
    }
    timeline.style.setProperty('--p', p.toFixed(4));

    items.forEach((li, i) => {
      li.classList.toggle('active', i === idx);
      li.classList.toggle('done', i < idx);
      if (i === idx) links[i].setAttribute('aria-current', 'location');
      else links[i].removeAttribute('aria-current');
    });

    timeline.classList.toggle('show', y > hero.offsetHeight * 0.5);
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      updateTimeline();
    });
  }, { passive: true });
  window.addEventListener('resize', updateTimeline);
  updateTimeline();
});

/* ---------- Poll: the single file, for or against (/api/poll) ----------
   Nobody sees the numbers until they've voted. The Worker sends them back with a vote, or to a
   browser that has voted before (it holds the voter cookie), so returning voters go straight
   to the results. Voting again from there changes the vote; it never adds one. */

const pollSection = document.getElementById('poll');
const poll = document.getElementById('poll-form');
const pollResults = document.querySelector('.poll-results');

if (pollSection && poll && pollResults) guard('poll', () => {
  const note = poll.querySelector('.poll-note');
  const NOTE = note.textContent;
  const buttons = [...poll.querySelectorAll('button[name="choice"]')];
  const again = pollResults.querySelector('.poll-again');
  const keep = poll.querySelector('.poll-keep');
  const POLL_TIMEOUT_MS = 15000;
  let last = null; // the results with this browser's vote on record, for "Keep my vote"
  let changing = false; // on the "Changed your mind?" screen

  const plural = (n) => `${n.toLocaleString('en-GB')} ${n === 1 ? 'vote' : 'votes'}`;

  // src/worker.js has the same lines for the no-JavaScript page; keep the two in step.
  // The lead line goes by the counts, not the rounded percentages (501 to 499 shows 50/50).
  const leadFor = (single, cluster) => {
    if (single + cluster < 50) return 'Early days. The jury’s still at the bar.';
    if (cluster > single) return 'The Cluster is winning.';
    if (single > cluster) return 'The Single File is ahead. We have work to do.';
    return 'Dead heat. Over to the barperson.';
  };
  const QUIPS = {
    single: 'You said for. Noted. Take the hazard perception test, then we’ll talk.',
    cluster: 'You said against. Correct. Now make it official.',
    capped: 'Your connection has had its fill of votes today, so this one didn’t count. Here’s the tally anyway.',
    missing: 'We couldn’t find your first vote, so nothing changed.',
  };

  // `data` is an answer from /api/poll. A vote over the daily cap (capped) or a change with no
  // vote on record (missing) wasn't counted: it shows the tally with no stamp.
  const showResults = (data, justVoted) => {
    const { choice, results } = data;
    const counted = !data.capped && !data.missing;
    if (counted) last = data;
    const single = Number(results?.single) || 0;
    const cluster = Number(results?.cluster) || 0;
    const total = single + cluster;
    // Whole percentages that always add up to 100.
    const forPc = total ? Math.round((single / total) * 100) : 0;
    const pc = { single: forPc, cluster: total ? 100 - forPc : 0 };
    const votes = { single, cluster };

    pollResults.querySelector('.poll-head').textContent = leadFor(single, cluster);
    pollResults.querySelectorAll('.poll-row').forEach((row) => {
      const key = row.dataset.choice;
      row.querySelector('.poll-pc').textContent = `${pc[key]}%`;
      row.querySelector('.poll-n').textContent = plural(votes[key]);
      row.querySelector('.poll-fill').style.setProperty('--v', pc[key] / 100);
      row.querySelector('.poll-you').hidden = !counted || key !== choice;
    });
    pollResults.querySelector('.poll-total').textContent =
      `${plural(total)} so far. Self\u2011selecting and unscientific, like every pub argument.`;
    pollResults.querySelector('.poll-quip').textContent =
      (data.capped && QUIPS.capped) || (data.missing && QUIPS.missing) || QUIPS[choice] || '';
    pollResults.querySelectorAll('.poll-next').forEach((a) => (a.hidden = a.dataset.for !== choice));
    again.hidden = !counted; // a vote that didn't count has nothing to change

    // Back from the change screen, if that's where they were.
    changing = false;
    keep.hidden = true;
    buttons.forEach((b) => (b.querySelector('.poll-you').hidden = true));
    note.textContent = NOTE;

    pollSection.classList.add('voted');
    poll.hidden = true;
    pollResults.hidden = false;
    // The button they pressed has gone, so take focus to the results.
    if (justVoted) pollResults.querySelector('.poll-head').focus();
  };

  fetch('/api/poll')
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      if (d?.voted) showResults(d, false);
    })
    .catch(() => {});

  // "Changed your mind?": back to the buttons, with the side on record stamped. The question
  // stays small (#poll keeps .voted), so it doesn't look like a first visit. The next vote
  // replaces the old one; "Keep my vote" goes back to the results.
  again.addEventListener('click', () => {
    if (!last) return;
    changing = true;
    pollResults.hidden = true;
    poll.hidden = false;
    buttons.forEach((b) => (b.querySelector('.poll-you').hidden = b.value !== last.choice));
    keep.hidden = false;
    note.textContent = `You\u2019re down as ${last.choice === 'cluster' ? 'against' : 'for'}. Pick again to switch.`;
    // Focus the note, not a vote button, so a held Enter can't vote by accident.
    note.focus();
  });

  keep.addEventListener('click', () => last && showResults(last, true));

  const explain = (status, body) => {
    if ([400, 429, 503].includes(status) && typeof body?.error === 'string' && body.error) return body.error;
    if (status === 403) return 'That was blocked. Reload the page and try again.';
    if (status >= 500) return 'That one is on us, not you. Try again in a minute.';
    return 'Something went wrong. Try again in a minute.';
  };

  let sending = false;

  poll.addEventListener('submit', async (event) => {
    const button = event.submitter;
    // A browser without event.submitter sends the plain form post and gets the results page.
    if (!button?.value) return;
    event.preventDefault();
    if (sending) return;

    sending = true;
    buttons.forEach((b) => (b.disabled = true));
    poll.setAttribute('aria-busy', 'true');
    note.textContent = 'Counting…';

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), POLL_TIMEOUT_MS);
    let shown = false;
    try {
      const res = await fetch('/api/poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changing ? { choice: button.value, change: true } : { choice: button.value }),
        signal: controller.signal,
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || !(body?.voted || body?.capped || body?.missing) || !body.results) {
        note.textContent = explain(res.ok ? 502 : res.status, body);
        return;
      }
      shown = true;
      showResults(body, true);
    } catch (err) {
      if (err.name === 'AbortError') note.textContent = 'That took too long. Try again in a moment.';
      else if (navigator.onLine === false) note.textContent = 'You look to be offline. Try again when you’re back.';
      else note.textContent = 'Couldn’t reach the server. Check your connection and try again.';
    } finally {
      clearTimeout(timer);
      sending = false;
      buttons.forEach((b) => (b.disabled = false));
      poll.removeAttribute('aria-busy');
      if (!shown) button.focus(); // disabling it dropped the focus
    }
  });
});

/* ---------- Petition -> Cloudflare Worker (/api/sign), stored in Postgres ---------- */

const form = document.getElementById('petition');
const countEl = document.getElementById('sig-count');

if (countEl) {
  fetch('/api/count')
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      if (d && Number.isFinite(d.count) && d.count > 0) {
        countEl.textContent = `${d.count.toLocaleString('en-GB')} ${d.count === 1 ? 'person has' : 'people have'} signed`;
        countEl.hidden = false;
      }
    })
    .catch(() => {});
}

if (form) {
  const msg = form.querySelector('.form-msg');
  const button = form.querySelector('button');
  const buttonLabel = button.textContent;
  const shareBox = form.querySelector('.share');
  const shareBtn = document.getElementById('share-btn');
  const shareNote = form.querySelector('.share-note');

  // "Tell a mate": native share sheet where there is one, otherwise copy the link.
  shareBtn?.addEventListener('click', async () => {
    const url = `${location.origin}/`;
    const text = 'A bar is not a post office. Spread out. Catch the eye. Trust the barperson.';
    try {
      if (navigator.share) {
        await navigator.share({ title: "Don't Queue At The Bar", text, url });
      } else {
        await navigator.clipboard.writeText(url);
        shareNote.textContent = 'Link copied. Send it to someone who queues.';
      }
    } catch (err) {
      if (err.name !== 'AbortError') shareNote.textContent = `Copy this: ${url}`;
    }
  });

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // same shape the Worker checks
  const SUBMIT_TIMEOUT_MS = 15000;
  const fields = ['name', 'email', 'consent'].map((key) => ({
    input: form.querySelector(`[name="${key}"]`),
    err: document.getElementById(`err-${key}`),
  }));
  const STILL_HERE = 'Your details are still in the form.';

  const show = (text, kind) => {
    msg.textContent = text;
    msg.className = `form-msg ${kind}`;
  };

  // Inline error under a field, tied to it for screen readers; cleared as soon as they edit it.
  const setFieldError = ({ input, err }, text) => {
    if (!input || !err) return;
    err.textContent = text || '';
    err.hidden = !text;
    if (text) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  };
  const clearErrors = () => fields.forEach((f) => setFieldError(f, ''));
  fields.forEach((f) => {
    const clear = () => {
      if (f.input.getAttribute('aria-invalid')) setFieldError(f, '');
    };
    f.input?.addEventListener('input', clear);
    f.input?.addEventListener('change', clear);
  });

  // Returns the problems with what was typed, one per field, in page order.
  const validate = () => {
    const [name, email, consent] = fields;
    const problems = [];
    const nameValue = name.input.value.trim();
    const emailValue = email.input.value.trim();
    if (!nameValue) problems.push([name, 'Add your name.']);
    else if (nameValue.length > 100) problems.push([name, 'Keep your name to 100 characters.']);
    if (!emailValue) problems.push([email, 'Add your email address.']);
    else if (emailValue.length > 254 || !EMAIL_RE.test(emailValue)) {
      problems.push([email, 'That email address doesn\u2019t look right. Check it for typos.']);
    }
    if (!consent.input.checked) problems.push([consent, 'Tick the box so we can add you.']);
    return problems;
  };

  // Turn a failed request into something a person can act on.
  const explain = (status, body) => {
    if (status === 400 || status === 413 || status === 415) {
      return typeof body?.error === 'string' && body.error ? body.error : `That didn\u2019t go through. ${STILL_HERE}`;
    }
    if (status === 403) return `That was blocked. Reload the page and try again. ${STILL_HERE}`;
    if (status === 429) return `Lots of people are signing at once. Wait a minute, then try again. ${STILL_HERE}`;
    if (status >= 500) return `That one is on us, not you. Try again in a minute. ${STILL_HERE}`;
    return `Something went wrong. ${STILL_HERE}`;
  };

  let submitting = false;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitting) return; // a double tap or a held Enter must not sign twice

    clearErrors();
    const problems = validate();
    if (problems.length) {
      problems.forEach(([field, text]) => setFieldError(field, text));
      show('Nearly there. Fix the bits marked below.', 'error');
      problems[0][0].input.focus();
      return;
    }

    const fd = new FormData(form);
    const data = {
      name: String(fd.get('name') || '').trim(),
      email: String(fd.get('email') || '').trim(),
      consent: true,
      website: String(fd.get('website') || ''), // honeypot, should stay empty
    };

    submitting = true;
    button.disabled = true;
    button.textContent = 'Signing\u2026';
    form.setAttribute('aria-busy', 'true');
    show('', '');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);
    try {
      let res;
      try {
        res = await fetch('/api/sign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          signal: controller.signal,
        });
      } catch (err) {
        if (err.name === 'AbortError') show(`That took too long. Try again in a moment. ${STILL_HERE}`, 'error');
        else if (navigator.onLine === false) show(`You look to be offline. Try again when you\u2019re back. ${STILL_HERE}`, 'error');
        else show(`Couldn\u2019t reach the server. Check your connection and try again. ${STILL_HERE}`, 'error');
        return;
      }

      // An error page from Cloudflare or a hotel wifi login can come back as HTML, so the
      // body may not be JSON. A real success is JSON with ok: true.
      const body = await res.json().catch(() => null);
      if (!res.ok || body?.ok !== true) {
        show(explain(res.ok ? 502 : res.status, body), 'error');
        return;
      }

      form.reset();
      show('Thank you. Now go and stand at the bar. \uD83C\uDF7A', 'ok');
      if (shareBox) shareBox.hidden = false;
    } catch (err) {
      console.error('Sign failed', err);
      show(`Something went wrong. ${STILL_HERE}`, 'error');
    } finally {
      clearTimeout(timer);
      submitting = false;
      button.disabled = false;
      button.textContent = buttonLabel;
      form.removeAttribute('aria-busy');
    }
  });
}
