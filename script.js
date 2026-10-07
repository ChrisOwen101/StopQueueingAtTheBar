// Stop Queueing at the Bar — placeholder behaviour

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
