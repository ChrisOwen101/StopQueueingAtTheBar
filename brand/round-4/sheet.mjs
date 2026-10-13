// Round 4 contact sheet: renders every concept in concepts.mjs as SVG files in this
// folder, writes sheet.html (the mark at 220, 64, 32 and 16, reversed, in a lockup, on
// a mat back tile and as a browser tab), and screenshots it to round-4.png when a
// Chromium is given in CHROME_PATH. Run: node brand/round-4/sheet.mjs
import { writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { CONCEPTS, FONT } from './concepts.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const out = (f, s) => writeFile(path.join(dir, f), s.trim() + '\n');

const svg = (c, body, bg, label) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-label="${label}">${bg ? `\n  <rect width="400" height="400" fill="${bg}"/>` : ''}${body(c)}
</svg>`;

const wordmark = (c, lines, x, size, anchor = 'start') => {
  const lh = size * 0.92, y0 = 200 - ((lines.length - 1) * lh) / 2 + size * 0.36;
  return `
  <g font-family="${FONT}" font-weight="900" font-size="${size}" fill="${c}" letter-spacing="${-size * 0.04}" text-anchor="${anchor}">
    ${lines.map((l, i) => `<text x="${x}" y="${(y0 + i * lh).toFixed(0)}">${l}</text>`).join('\n    ')}
  </g>`;
};

let cells = '';
for (const k of CONCEPTS) {
  const id = k.id;
  await out(`${id}.svg`, svg('#000', k.body, null, k.title));
  await out(`${id}-reversed.svg`, svg('#fff', k.body, '#000', k.title));
  const longest = Math.max(...k.words.map((w) => w.length));
  const size = Math.min(160, Math.floor(1700 / longest));
  const lock = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1500 400" role="img" aria-label="${k.words.join(' ')}">
  <g>${k.body('#000')}</g>${wordmark('#000', k.words, 452, size)}
</svg>`;
  await out(`${id}-lockup.svg`, lock);
  cells += `
<div class="cell">
  <h2>${k.n}. ${k.title}</h2>
  <p class="idea">${k.idea}</p>
  <div class="row">
    <img src="${id}.svg" width="200">
    <div class="blk"><img src="${id}-reversed.svg" width="120"></div>
    <div class="sizes"><img src="${id}.svg" width="64"><img src="${id}.svg" width="32"><img src="${id}.svg" width="16"></div>
    <div class="tab"><img src="${id}.svg">${k.tab || k.words.join(' ')}</div>
  </div>
  <div class="row" style="margin-top:10px"><img src="${id}-lockup.svg" height="64"><img src="${id}-lockup.svg" height="40"></div>
  <small>${k.note || ''}</small>
</div>`;
}

await out('sheet.html', `<!doctype html><meta charset="utf-8"><title>Round 4</title>
<style>
body{margin:0;background:#fff;font-family:${FONT};padding:24px 28px;color:#000;width:1744px}
h1{font-size:20px;margin:0 0 12px;font-weight:900}
h2{font-size:14px;margin:0 0 4px;font-weight:800}
.idea{font-size:12px;margin:0 0 8px;color:#333}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.cell{border:1px solid #ddd;padding:10px 12px}
.row{display:flex;gap:14px;align-items:flex-end;flex-wrap:wrap}
.blk{background:#000;padding:10px}
.sizes{display:flex;gap:10px;align-items:flex-end}
.tab{display:flex;gap:6px;align-items:center;background:#f1f1f1;border-radius:6px;padding:4px 8px;font-size:12px}
.tab img{width:16px;height:16px}
small{font-size:10px;color:#555;display:block;margin-top:6px}
</style>
<h1>Round 4 · the mark must say "stop the single file", not "don't queue" · one colour, black on white, reversed, 64/32/16 and the lockup at 64 and 40px</h1>
<div class="grid">${cells}
</div>`);

if (process.env.CHROME_PATH) {
  execFileSync(process.env.CHROME_PATH, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', `--window-size=1800,${process.env.SHEET_H || 2400}`, `--screenshot=${path.join(dir, 'round-4.png')}`, `file://${path.join(dir, 'sheet.html')}`], { stdio: 'ignore' });
  console.log('round-4.png rendered');
}
console.log(`wrote ${CONCEPTS.length} concepts to ${dir}`);
