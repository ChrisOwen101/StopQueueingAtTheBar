// Builds the beer mat artwork (three fronts and one back) as SVG.
// Run with: npm run build:mats
//
//   public/mats/mat-spread-out.svg        front 1
//   public/mats/mat-post-office.svg       front 2
//   public/mats/mat-they-know.svg         front 3
//   public/mats/mat-back.svg              back: domain round the edge + big QR code
//
// Each file is a 107 mm round mat (400 x 400 viewBox, no bleed). The site shows
// these same files, so what you see on the page is what gets printed.
//
// Change the address in one place: SITE_URL below (or set SITE_URL in the env).
//
// PRINT NOTE: text uses the same font stack as the logo. Before sending to a
// printer, open the SVGs in Illustrator/Affinity/Inkscape and convert text to
// outlines, and add the printer's bleed around the circle.
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import QRCode from 'qrcode';

const SITE_URL = process.env.SITE_URL || 'https://dontqueueatthebar.co.uk/';
const DOMAIN = new URL(SITE_URL).hostname.replace(/^www\./, '');

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'mats');
await mkdir(dir, { recursive: true });

const INK = '#16161d';
const CREAM = '#fff4dc';
const AMBER = '#ffb627';
const RED = '#e63946';
const BLUE = '#2447f5';
const GREEN = '#0f5b43';
const FONT = "'Avenir Next','Helvetica Neue','Segoe UI',Arial,sans-serif";

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const open = (label) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="107mm" height="107mm" role="img" aria-label="${esc(label)}">`;

// ---------- Fronts ----------

// lines: [text, font size] pairs, stacked and centred on the mat.
function front({ label, ring, top, lines, bottom }) {
  const CAP = 0.72; // cap height as a fraction of font size
  const GAP = 12;
  const total = lines.reduce((sum, [, size]) => sum + size * CAP, 0) + GAP * (lines.length - 1);
  let y = 200 - total / 2;
  const title = lines
    .map(([text, size]) => {
      y += size * CAP;
      const out = `<text x="200" y="${y.toFixed(1)}" font-size="${size}" font-weight="900" letter-spacing="${(-size * 0.02).toFixed(1)}">${esc(text.toUpperCase())}</text>`;
      y += GAP;
      return out;
    })
    .join('\n    ');
  const small = (text, yy) =>
    `<text x="200" y="${yy}" font-size="17" font-weight="700" letter-spacing="2" opacity="0.75">${esc(text.toUpperCase())}</text>`;

  return `${open(label)}
  <title>${esc(label)}</title>
  <circle cx="200" cy="200" r="200" fill="${ring}"/>
  <circle cx="200" cy="200" r="186" fill="${CREAM}"/>
  <circle cx="200" cy="200" r="178" fill="none" stroke="${INK}" stroke-width="3"/>
  <g font-family="${FONT}" fill="${INK}" text-anchor="middle">
    ${small(top, 104)}
    ${title}
    ${small(bottom[0], 300)}
    ${small(bottom[1], 324)}
  </g>
</svg>
`;
}

const fronts = {
  'mat-spread-out.svg': front({
    label: 'Beer mat: please spread out. Catch the eye. Trust the barperson.',
    ring: RED,
    top: 'please',
    lines: [['Spread', 62], ['out', 112]],
    bottom: ['catch the eye.', 'trust the barperson.'],
  }),
  'mat-post-office.svg': front({
    label: 'Beer mat: this is a bar, not a post office. You may stop queueing now.',
    ring: BLUE,
    top: 'this is a bar',
    lines: [['Not a post', 42], ['office', 70]],
    bottom: ['you may stop', 'queueing now.'],
  }),
  'mat-they-know.svg': front({
    label: "Beer mat: ask the barperson. They know who's next. They always know.",
    ring: GREEN,
    top: 'ask the barperson',
    lines: [['They', 84], ['know', 84]],
    bottom: ["who's next.", 'they always know.'],
  }),
};

// ---------- Back ----------

// Dark modules as one path, merging runs along each row.
function qrPath(qr) {
  const { size, data } = qr.modules;
  let d = '';
  for (let r = 0; r < size; r++) {
    let c = 0;
    while (c < size) {
      if (!data[r * size + c]) { c++; continue; }
      const start = c;
      while (c < size && data[r * size + c]) c++;
      d += `M${start} ${r}h${c - start}v1h-${c - start}z`;
    }
  }
  return { d, size };
}

const qr = QRCode.create(SITE_URL, { errorCorrectionLevel: 'M' });
const { d: qrD, size: qrSize } = qrPath(qr);

// Square panel sits inside the inner disc: its half-diagonal must stay under R_IN.
const PANEL = 232;
const QUIET = 3; // modules of cream around the code
const mod = PANEL / (qrSize + QUIET * 2);
const panelX = 200 - PANEL / 2;
const codeX = panelX + QUIET * mod;
const RING_R = 169; // radius of the text baseline
const ring = `M ${200 - RING_R},200 A ${RING_R},${RING_R} 0 1 1 ${200 + RING_R},200 A ${RING_R},${RING_R} 0 1 1 ${200 - RING_R},200`;
const circumference = 2 * Math.PI * RING_R;
const ringText = `${DOMAIN}   ●   ${DOMAIN}   ●   `;

const back = `${open(`Beer mat back: scan the code or visit ${DOMAIN}`)}
  <title>Beer mat back: scan the code or visit ${esc(DOMAIN)}</title>
  <defs>
    <path id="ring" d="${ring}"/>
  </defs>
  <circle cx="200" cy="200" r="200" fill="${INK}"/>
  <circle cx="200" cy="200" r="192" fill="none" stroke="${AMBER}" stroke-width="2"/>
  <circle cx="200" cy="200" r="162" fill="none" stroke="${AMBER}" stroke-width="2"/>
  <text font-family="${FONT}" font-size="23" font-weight="900" fill="${CREAM}" xml:space="preserve">
    <textPath href="#ring" textLength="${(circumference - 6).toFixed(1)}" lengthAdjust="spacing">${esc(ringText)}</textPath>
  </text>
  <rect x="${panelX}" y="${panelX}" width="${PANEL}" height="${PANEL}" rx="16" fill="${CREAM}"/>
  <path transform="translate(${codeX.toFixed(2)} ${codeX.toFixed(2)}) scale(${mod.toFixed(4)})" d="${qrD}" fill="${INK}" shape-rendering="crispEdges"/>
</svg>
`;

for (const [name, svg] of Object.entries(fronts)) await writeFile(path.join(dir, name), svg);
await writeFile(path.join(dir, 'mat-back.svg'), back);

console.log(`Mats written to public/mats/ (QR -> ${SITE_URL}, ${qrSize}x${qrSize} modules)`);
