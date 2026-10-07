// Builds the beer mat artwork (one front, one back) as SVG.
// Run with: npm run build:mats
//
//   public/mats/mat-front.svg   front: the logo badge (from public/logo-side.svg)
//   public/mats/mat-back.svg    back: domain round the edge + big QR code
//
// Each file is a 107 mm round mat (400 x 400 viewBox, no bleed). The site shows
// these same files, so what you see on the page is what gets printed.
//
// Change the address in one place: SITE_URL below (or set SITE_URL in the env).
//
// PRINT NOTE: text uses the same font stack as the logo. Before sending to a
// printer, open the SVGs in Illustrator/Affinity/Inkscape and convert text to
// outlines, and add the printer's bleed around the circle.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import QRCode from 'qrcode';

const SITE_URL = process.env.SITE_URL || 'https://dontqueueatthebar.co.uk/';
const DOMAIN = new URL(SITE_URL).hostname.replace(/^www\./, '');

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const dir = path.join(root, 'mats');
await mkdir(dir, { recursive: true });

const INK = '#16161d';
const CREAM = '#fff4dc';
const AMBER = '#ffb627';
const FONT = "'Avenir Next','Helvetica Neue','Segoe UI',Arial,sans-serif";

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---------- Front: the logo badge, sized for print ----------

const logo = await readFile(path.join(root, 'logo-side.svg'), 'utf8');
const front = logo.replace(/<svg([^>]*?) width="400" height="400"/, '<svg$1 width="107mm" height="107mm"');

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

const PANEL = 232;
const QUIET = 3; // modules of cream around the code
const mod = PANEL / (qrSize + QUIET * 2);
const panelX = 200 - PANEL / 2;
const codeX = panelX + QUIET * mod;
const RING_R = 169; // radius of the text baseline
const ring = `M ${200 - RING_R},200 A ${RING_R},${RING_R} 0 1 1 ${200 + RING_R},200 A ${RING_R},${RING_R} 0 1 1 ${200 - RING_R},200`;
const circumference = 2 * Math.PI * RING_R;
const ringText = `${DOMAIN}   ●   ${DOMAIN}   ●   `;

const back = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="107mm" height="107mm" role="img" aria-label="Beer mat back: scan the code or visit ${esc(DOMAIN)}">
  <title>Beer mat back: scan the code or visit ${esc(DOMAIN)}</title>
  <defs>
    <path id="ring" d="${ring}"/>
  </defs>
  <circle cx="200" cy="200" r="198" fill="${INK}"/>
  <circle cx="200" cy="200" r="190" fill="none" stroke="${CREAM}" stroke-width="2"/>
  <circle cx="200" cy="200" r="162" fill="none" stroke="${CREAM}" stroke-width="2"/>
  <text font-family="${FONT}" font-size="23" font-weight="900" fill="${CREAM}" xml:space="preserve">
    <textPath href="#ring" textLength="${(circumference - 6).toFixed(1)}" lengthAdjust="spacing">${esc(ringText)}</textPath>
  </text>
  <rect x="${panelX}" y="${panelX}" width="${PANEL}" height="${PANEL}" rx="16" fill="${CREAM}"/>
  <path transform="translate(${codeX.toFixed(2)} ${codeX.toFixed(2)}) scale(${mod.toFixed(4)})" d="${qrD}" fill="${INK}" shape-rendering="crispEdges"/>
</svg>
`;

await writeFile(path.join(dir, 'mat-front.svg'), front);
await writeFile(path.join(dir, 'mat-back.svg'), back);

console.log(`Mats written to public/mats/ (QR -> ${SITE_URL}, ${qrSize}x${qrSize} modules)`);
