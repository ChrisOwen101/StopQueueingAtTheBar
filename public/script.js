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
