// Don't Queue At The Bar

document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasIO = 'IntersectionObserver' in window;

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

/* ---------- Count-up numbers ---------- */

function formatCount(el, value) {
  return `${el.dataset.prefix || ''}${value}${el.dataset.suffix || ''}`;
}

function runCount(el) {
  const to = Number(el.dataset.count);
  const start = performance.now();
  const duration = 1400;

  const frame = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = formatCount(el, Math.round(to * eased));
    if (p < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

const counters = document.querySelectorAll('[data-count]');

if (hasIO && !reduceMotion) {
  counters.forEach((el) => (el.textContent = formatCount(el, 0)));
  const countIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCount(entry.target);
          countIO.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => countIO.observe(el));
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
const ARRIVAL_CHANCE = 0.8;
const MAX_SINGLE = 8;
const QUEUE_X = 39;
const BAR_ROW_Y = 28;

function buildScene(el) {
  const mode = el.dataset.mode;
  const arrivals = mulberry32(7);
  const choices = mulberry32(21);

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
    el: makeDot('staff', x, 8),
    target: null,
    doneAt: 0,
  }));

  let customers = [];
  let tick = 0;
  let score = 0;
  let nextColour = 0;

  const layoutSingle = () => {
    customers.forEach((c, i) => place(c.el, QUEUE_X + Math.sin(i * 1.1) * 5, 28 + i * 9.5));
  };

  const arrive = () => {
    if (mode === 'single') {
      if (customers.length >= MAX_SINGLE) return;
      const c = { el: makeDot(`cust c${nextColour++ % 5}`, QUEUE_X, 108), serving: false, slot: null };
      customers.push(c);
      layoutSingle();
    } else {
      const free = SLOTS.map((_, i) => i).filter((i) => !customers.some((c) => c.slot === i));
      if (!free.length) return;
      const slot = free[Math.floor(choices() * free.length)];
      const startX = Math.min(95, Math.max(5, SLOTS[slot] + (choices() * 12 - 6)));
      const c = { el: makeDot(`cust c${nextColour++ % 5}`, startX, 108), serving: false, slot };
      customers.push(c);
      place(c.el, SLOTS[slot], BAR_ROW_Y);
    }
  };

  const finish = (c) => {
    customers = customers.filter((x) => x !== c);
    score += 1;
    scoreEl.textContent = score;
    c.el.style.opacity = '0';
    if (mode === 'single') {
      c.el.style.left = '-8%';
      layoutSingle();
    } else {
      c.el.style.top = '112%';
    }
    setTimeout(() => c.el.remove(), 800);
  };

  const choose = (s) => {
    if (mode === 'single') {
      // Only one member of staff can reach the front of the queue.
      if (s.i !== 1) return null;
      const front = customers[0];
      return front && !front.serving ? front : null;
    }
    const waiting = customers.filter((c) => !c.serving);
    if (!waiting.length) return null;
    waiting.sort((a, b) => Math.abs(SLOTS[a.slot] - s.x) - Math.abs(SLOTS[b.slot] - s.x));
    return waiting[0];
  };

  const step = () => {
    tick += 1;
    if (arrivals() < ARRIVAL_CHANCE) arrive();

    staff.forEach((s) => {
      if (s.target && tick >= s.doneAt) {
        finish(s.target);
        s.target = null;
      }
      if (!s.target) {
        const c = choose(s);
        if (c) {
          s.target = c;
          c.serving = true;
          c.el.classList.add('serving');
          s.doneAt = tick + SERVICE_TICKS;
        }
      }
      s.el.classList.toggle('busy', !!s.target);
      s.el.classList.toggle('idle', !s.target);
    });
  };

  // Pre-roll so the scene isn't empty when it appears.
  for (let i = 0; i < 6; i++) step();
  score = 0;
  scoreEl.textContent = '0';

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

const scenes = [...document.querySelectorAll('.scene')].map((el) => ({ el, sim: buildScene(el) }));

if (hasIO) {
  const sceneIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const scene = scenes.find((s) => s.el === entry.target);
        if (!scene) return;
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

  const show = (text, kind) => {
    msg.textContent = text;
    msg.className = `form-msg ${kind}`;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      show('Please add your name, a valid email, and tick the box.', 'error');
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
    } catch (err) {
      show(err.message && !err.message.startsWith('HTTP') ? err.message : 'Something went wrong. Please try again.', 'error');
    } finally {
      button.disabled = false;
    }
  });
}
