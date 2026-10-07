// Don't Queue At The Bar — placeholder behaviour

document.documentElement.classList.add('js');

// Build the bar diagrams from data-pattern strings.
//   =  bar    o  person    s  seated person    B  the buyer (round)    .  empty
const CELL_CLASS = { '=': 'bar', o: 'person', s: 'seated', B: 'buyer', '.': 'empty' };

document.querySelectorAll('.diagram').forEach((el) => {
  const cols = Number(el.dataset.cols) || 7;
  el.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', 'Diagram of people at the bar');

  el.dataset.pattern.split('|').forEach((row) => {
    if (row[0] === '=') {
      // a single bar spanning the whole row
      const bar = document.createElement('div');
      bar.className = 'cell bar';
      bar.style.gridColumn = `1 / -1`;
      el.appendChild(bar);
      return;
    }
    [...row].forEach((ch) => {
      const cell = document.createElement('div');
      cell.className = `cell ${CELL_CLASS[ch] || 'empty'}`;
      el.appendChild(cell);
    });
  });
});

// Reveal each screen's content as it scrolls into view.
const revealTargets = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );
  revealTargets.forEach((el) => io.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('in'));
}

// Petition form -> Cloudflare Worker (/api/sign), stored in Postgres.
const form = document.getElementById('petition');

// Show the running signature total, if the API is available.
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

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      consent: true,
      website: form.website.value, // honeypot, should stay empty
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
      show('Thank you. No more queueing. 🍺', 'ok');
    } catch (err) {
      show(err.message && !err.message.startsWith('HTTP') ? err.message : 'Something went wrong. Please try again.', 'error');
    } finally {
      button.disabled = false;
    }
  });
}
