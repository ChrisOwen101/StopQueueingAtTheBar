// Don't Queue At The Bar

document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasIO = 'IntersectionObserver' in window;
let animPaused = false; // set by the pause control below

/* ---------- Reveal each screen as it scrolls into view ---------- */

const revealTargets = document.querySelectorAll('.reveal');

if (hasIO) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );
  revealTargets.forEach((el) => io.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('in'));
}

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
      if (!timer && !reduceMotion && !animPaused) timer = setInterval(step, TICK_MS);
    },
    stop() {
      clearInterval(timer);
      timer = null;
    },
  };
}

const scenes = [...document.querySelectorAll('.scene')].map((el) => ({ el, sim: buildScene(el), visible: !hasIO }));

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

/* ---------- Pause control (WCAG 2.2.2) ----------
   The sims and the beer mats move on their own for more than five seconds, so
   offer a way to stop them. Not needed when the visitor already asked for reduced motion. */

if (!reduceMotion) {
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'motion-toggle';
  toggle.setAttribute('aria-pressed', 'false');
  toggle.setAttribute('aria-label', 'Pause animations');
  toggle.innerHTML =
    '<svg class="pause" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/></svg>' +
    '<svg class="play" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11a1 1 0 0 0 1.5.86l9-5.5a1 1 0 0 0 0-1.72l-9-5.5A1 1 0 0 0 4 2.5z"/></svg>' +
    '<span class="txt">pause animations</span>';
  const txt = toggle.querySelector('.txt');

  toggle.addEventListener('click', () => {
    animPaused = !animPaused;
    document.documentElement.classList.toggle('paused', animPaused);
    toggle.setAttribute('aria-pressed', String(animPaused));
    toggle.setAttribute('aria-label', animPaused ? 'Play animations' : 'Pause animations');
    txt.textContent = animPaused ? 'play animations' : 'pause animations';
    scenes.forEach((s) => (animPaused ? s.sim.stop() : s.visible && s.sim.start()));
  });

  document.body.appendChild(toggle);
}

/* ---------- Timeline rail: where am I in the story? ---------- */

const timeline = document.querySelector('.timeline');

if (timeline) {
  const items = [...timeline.querySelectorAll('li:not(.tl-fill)')];
  const links = items.map((li) => li.querySelector('a'));
  const chapters = links.map((a) => document.querySelector(a.getAttribute('href')));
  const hero = document.getElementById('top');

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
}

/* ---------- Petition -> Cloudflare Worker (/api/sign), stored in Postgres ---------- */

const form = document.getElementById('petition');
const countEl = document.getElementById('sig-count');

if (countEl) {
  fetch('/api/count')
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      if (d && d.count > 0) {
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

  const show = (text, kind) => {
    msg.textContent = text;
    msg.className = `form-msg ${kind}`;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      show('Please add your name, a valid email, and tick the box.', 'error');
      form.querySelector(':invalid')?.focus();
      return;
    }

    const fd = new FormData(form);
    const data = {
      name: String(fd.get('name') || '').trim(),
      email: String(fd.get('email') || '').trim(),
      consent: true,
      website: String(fd.get('website') || ''), // honeypot, should stay empty
    };

    button.disabled = true;
    button.textContent = 'Signing…';
    form.setAttribute('aria-busy', 'true');
    show('', '');
    try {
      const res = await fetch('/api/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      form.reset();
      show('Thank you. Now go and stand at the bar. 🍺', 'ok');
      if (shareBox) shareBox.hidden = false;
    } catch (err) {
      show(err.message && !err.message.startsWith('HTTP') ? err.message : 'Something went wrong. Please try again.', 'error');
    } finally {
      button.disabled = false;
      button.textContent = buttonLabel;
      form.removeAttribute('aria-busy');
    }
  });
}
