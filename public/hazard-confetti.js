/* Confetti for a perfect hazard test.
   hazard.js imports this on a 5/5 and calls burst(). Paper shoots up from the bottom of
   the screen in two fountains, then falls. One fixed canvas, removed when the last piece
   is gone. Skipped with reduced motion. Palette is the site's. */

const COLOURS = ['#ffb627', '#ff9ec1', '#2447f5', '#fff4dc', '#d62839', '#0f5b43'];
const PIECES = 140;
const GRAVITY = 1500; // px/s²
const DRAG = 0.9; // fraction of velocity kept after one second
const LIFE = 4200; // ms before a piece is dropped, wherever it is

const rand = (a, b) => a + Math.random() * (b - a);

export function burst() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:1000';
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0;
  let h = 0;
  const size = () => {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  };
  size();
  window.addEventListener('resize', size);
  document.body.append(canvas);

  const unit = Math.max(0.7, Math.min(w, 1000) / 1000);
  const pieces = Array.from({ length: PIECES }, (_, i) => {
    const left = i % 2 === 0; // two fountains, one each side, angled in
    const angle = ((left ? -72 : -108) + rand(-22, 22)) * (Math.PI / 180);
    const speed = rand(900, 1700) * Math.max(0.6, Math.min(h, 900) / 900);
    return {
      x: w * (left ? rand(0.04, 0.2) : rand(0.8, 0.96)),
      y: h + 12,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      w: rand(7, 13) * unit,
      h: rand(4, 8) * unit,
      rot: rand(0, Math.PI * 2),
      spin: rand(-12, 12),
      flip: rand(0, Math.PI * 2),
      flipSpeed: rand(5, 12),
      colour: COLOURS[(Math.random() * COLOURS.length) | 0],
      delay: rand(0, 350),
    };
  });

  const start = performance.now();
  let last = start;
  const frame = (now) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const age = now - start;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    let alive = 0;
    for (const p of pieces) {
      if (age < p.delay) {
        alive++;
        continue;
      }
      p.vx *= Math.pow(DRAG, dt);
      p.vy = p.vy * Math.pow(DRAG, dt) + GRAVITY * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.spin * dt;
      p.flip += p.flipSpeed * dt;
      if (p.y > h + 40 && p.vy > 0) continue; // fell back off the bottom
      if (age - p.delay > LIFE) continue;
      alive++;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, Math.cos(p.flip)); // tumbling paper
      ctx.fillStyle = p.colour;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    if (alive && document.body.contains(canvas)) requestAnimationFrame(frame);
    else done();
  };

  const done = () => {
    window.removeEventListener('resize', size);
    canvas.remove();
  };
  requestAnimationFrame(frame);
}
