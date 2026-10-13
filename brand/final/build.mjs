// Builds the final mark family as static SVG files in this folder.
// Run: node brand/final/build.mjs
// Everything is pure #000 on transparent (or #fff on #000 for the reversed set).
// The mat back uses the qrcode dev dependency already in package.json.
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import QRCode from 'qrcode';

const dir = path.dirname(fileURLToPath(import.meta.url));
const out = (f, s) => writeFile(path.join(dir, f), s.trim() + '\n');

const SITE_URL = process.env.SITE_URL || 'https://dontqueueatthebar.co.uk/';
const DOMAIN = new URL(SITE_URL).hostname.replace(/^www\./, '');
const FONT = "'Avenir Next','Helvetica Neue','Segoe UI',Arial,sans-serif";

// ---------- The mark: three people spread along a bar, inside a ring ----------
// Geometry in a 400 x 400 box. Ring outer radius 185, stroke 30. Bar 64 tall,
// running the full width (the overhang is what makes it a roundel).
// Figures: head r 25, shoulders 68 wide, a 5 unit neck gap so the head reads
// as a head at 16px.
const FIG = `<g id="fig"><circle cx="0" cy="0" r="25"/><path d="M-34,78 V64 a34,34 0 0 1 68,0 V78 Z"/></g>`;
const markBody = (c) => `
  <circle cx="200" cy="200" r="170" fill="none" stroke="${c}" stroke-width="30"/>
  <g fill="${c}"><use href="#fig" x="108" y="136"/><use href="#fig" x="200" y="136"/><use href="#fig" x="292" y="136"/></g>
  <rect x="0" y="214" width="400" height="64" fill="${c}"/>`;

const mark = (c, bg) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-label="Don't Queue At The Bar: three people spread along a bar inside a ring">
  <defs>${FIG}</defs>${bg ? `\n  <rect width="400" height="400" fill="${bg}"/>` : ''}${markBody(c)}
</svg>`;

await out('mark.svg', mark('#000'));
await out('mark-reversed.svg', mark('#fff'));
await out('mark-on-black.svg', mark('#fff', '#000'));

// ---------- Word-ring badge (the mat front and the base of the seal) ----------
const badge = (c, bg) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-label="Don't Queue At The Bar. Spread along the bar.">
  <defs>
    <g id="sfig"><circle cx="0" cy="0" r="16"/><path d="M-22,52 V43 a22,22 0 0 1 44,0 V52 Z"/></g>
    <path id="top" d="M 58,200 A 142,142 0 0 1 342,200"/>
    <path id="bot" d="M 58,200 A 142,142 0 0 0 342,200"/>
  </defs>${bg ? `\n  <circle cx="200" cy="200" r="200" fill="${bg}"/>` : ''}
  <circle cx="200" cy="200" r="194" fill="none" stroke="${c}" stroke-width="8"/>
  <circle cx="200" cy="200" r="110" fill="none" stroke="${c}" stroke-width="20"/>
  <g fill="${c}"><use href="#sfig" x="132" y="164"/><use href="#sfig" x="200" y="164"/><use href="#sfig" x="268" y="164"/></g>
  <rect x="84" y="214" width="232" height="44" fill="${c}"/>
  <g font-family="${FONT}" font-weight="900" font-size="28" fill="${c}" text-anchor="middle" letter-spacing="2">
    <text><textPath href="#top" startOffset="50%">DON'T QUEUE AT THE BAR</textPath></text>
    <text><textPath href="#bot" startOffset="50%">SPREAD ALONG THE BAR</textPath></text>
  </g>
  <circle cx="44" cy="200" r="7" fill="${c}"/><circle cx="356" cy="200" r="7" fill="${c}"/>
</svg>`;
await out('badge-round.svg', badge('#000'));
await out('badge-round-reversed.svg', badge('#fff', '#000'));

// ---------- Lockups ----------
const TEXT = (c, x, y1, y2, size, anchor = 'start') => `
  <g font-family="${FONT}" font-weight="900" font-size="${size}" fill="${c}" letter-spacing="${-size * 0.04}" text-anchor="${anchor}">
    <text x="${x}" y="${y1}">don't queue</text>
    <text x="${x}" y="${y2}">at the bar.</text>
  </g>`;

const horizontal = (c, bg) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1420 400" role="img" aria-label="Don't queue at the bar.">
  <defs>${FIG}</defs>${bg ? `\n  <rect width="1420" height="400" fill="${bg}"/>` : ''}
  <g>${markBody(c)}</g>${TEXT(c, 452, 188, 336, 160)}
</svg>`;
await out('lockup-horizontal.svg', horizontal('#000'));
await out('lockup-horizontal-reversed.svg', horizontal('#fff'));

const stacked = (c, bg) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 760" role="img" aria-label="Don't queue at the bar.">
  <defs>${FIG}</defs>${bg ? `\n  <rect width="960" height="760" fill="${bg}"/>` : ''}
  <g transform="translate(280,0)">${markBody(c)}</g>${TEXT(c, 480, 572, 712, 150, 'middle')}
</svg>`;
await out('lockup-stacked.svg', stacked('#000'));
await out('lockup-stacked-reversed.svg', stacked('#fff'));

// ---------- Square icon (Stripe, favicon, app icon) ----------
const square = (c, bg) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Don't Queue At The Bar">
  <defs>${FIG}</defs>
  <rect width="512" height="512" fill="${bg}"/>
  <g transform="translate(56,56)">${markBody(c)}</g>
</svg>`;
await out('icon-square.svg', square('#000', '#fff'));
await out('icon-square-reversed.svg', square('#fff', '#000'));

// ---------- Seal for the hazard licence certificates ----------
// A 48-tooth serrated disc, the roundel in the middle, the test name round it.
const teeth = 48, R = 200, r = 188;
let d = '';
for (let i = 0; i < teeth * 2; i++) {
  const a = (Math.PI * i) / teeth, rr = i % 2 ? r : R;
  d += `${i ? 'L' : 'M'}${(200 + rr * Math.cos(a)).toFixed(1)},${(200 + rr * Math.sin(a)).toFixed(1)}`;
}
d += 'Z';
const seal = (line1, line2, c, bg) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-label="${line1}. ${line2}.">
  <defs>
    <g id="sfig"><circle cx="0" cy="0" r="16"/><path d="M-22,52 V43 a22,22 0 0 1 44,0 V52 Z"/></g>
    <path id="top" d="M 62,200 A 138,138 0 0 1 338,200"/>
    <path id="bot" d="M 62,200 A 138,138 0 0 0 338,200"/>
  </defs>
  <path d="${d}" fill="${bg}"/>
  <circle cx="200" cy="200" r="172" fill="none" stroke="${c}" stroke-width="4"/>
  <circle cx="200" cy="200" r="106" fill="none" stroke="${c}" stroke-width="20"/>
  <g fill="${c}"><use href="#sfig" x="132" y="166"/><use href="#sfig" x="200" y="166"/><use href="#sfig" x="268" y="166"/></g>
  <rect x="88" y="216" width="224" height="42" fill="${c}"/>
  <g font-family="${FONT}" font-weight="900" font-size="24" fill="${c}" text-anchor="middle" letter-spacing="3">
    <text><textPath href="#top" startOffset="50%">${line1}</textPath></text>
    <text><textPath href="#bot" startOffset="50%">${line2}</textPath></text>
  </g>
  <circle cx="50" cy="200" r="6" fill="${c}"/><circle cx="350" cy="200" r="6" fill="${c}"/>
</svg>`;
await out('seal-customer.svg', seal("DON'T QUEUE AT THE BAR", 'FULL LICENCE', '#000', '#fff'));
await out('seal-barperson.svg', seal("DON'T QUEUE AT THE BAR", 'LANDLORD MATERIAL', '#000', '#fff'));
await out('seal-customer-reversed.svg', seal("DON'T QUEUE AT THE BAR", 'FULL LICENCE', '#fff', '#000'));

// ---------- The stamp (Round 2's 05a): the wordmark in a ring ----------
const stamp = (c, bg) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-label="don't queue at the bar.">${bg ? `\n  <circle cx="200" cy="200" r="200" fill="${bg}"/>` : ''}
  <circle cx="200" cy="200" r="184" fill="none" stroke="${c}" stroke-width="24"/>
  <g font-family="${FONT}" font-weight="900" fill="${c}" text-anchor="middle" letter-spacing="-3">
    <text x="200" y="158" font-size="86">don't</text>
    <text x="200" y="236" font-size="86">queue</text>
    <text x="200" y="292" font-size="46" letter-spacing="-1">at the bar.</text>
  </g>
</svg>`;
await out('stamp.svg', stamp('#000'));
await out('stamp-reversed.svg', stamp('#fff', '#000'));

// ---------- Beer mat: two sides, 107 mm round, no bleed ----------
// Front: the stamp, black on white. Back: the roundel in the middle of the QR code, white on black.
await out('mat-front.svg', stamp('#000', '#fff').replace('viewBox="0 0 400 400"', 'viewBox="0 0 400 400" width="107mm" height="107mm"'));

function qrPath(qr) {
  const { size, data } = qr.modules;
  let p = '';
  for (let y = 0; y < size; y++) {
    let x = 0;
    while (x < size) {
      if (!data[y * size + x]) { x++; continue; }
      const s = x;
      while (x < size && data[y * size + x]) x++;
      p += `M${s} ${y}h${x - s}v1h-${x - s}z`;
    }
  }
  return { p, size };
}
// Level H tolerates 30% damage, so the mark can sit in the middle of the code.
const { p: qrD, size: qrSize } = qrPath(QRCode.create(SITE_URL, { errorCorrectionLevel: 'H' }));
const PANEL = 224, QUIET = 2, mod = PANEL / (qrSize + QUIET * 2);
const panelX = 200 - PANEL / 2, codeX = panelX + QUIET * mod;
const RING_R = 168;
const ring = `M ${200 - RING_R},200 A ${RING_R},${RING_R} 0 1 1 ${200 + RING_R},200 A ${RING_R},${RING_R} 0 1 1 ${200 - RING_R},200`;
const circ = 2 * Math.PI * RING_R;
const ringText = `${DOMAIN}   ●   ${DOMAIN}   ●   `;
const LOGO = 84; // the mark in the middle of the code, on a white tile (20% of the code's area, under level H's 30%)
await out('mat-back.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="107mm" height="107mm" role="img" aria-label="Beer mat back: scan the code or visit ${DOMAIN}">
  <defs>${FIG}<path id="ring" d="${ring}"/></defs>
  <circle cx="200" cy="200" r="200" fill="#000"/>
  <circle cx="200" cy="200" r="190" fill="none" stroke="#fff" stroke-width="3"/>
  <text font-family="${FONT}" font-size="23" font-weight="900" fill="#fff" xml:space="preserve"><textPath href="#ring" textLength="${(circ - 6).toFixed(1)}" lengthAdjust="spacing">${ringText}</textPath></text>
  <rect x="${panelX}" y="${panelX}" width="${PANEL}" height="${PANEL}" rx="14" fill="#fff"/>
  <path transform="translate(${codeX} ${codeX}) scale(${mod})" d="${qrD}" fill="#000"/>
  <rect x="${200 - LOGO / 2 - 8}" y="${200 - LOGO / 2 - 8}" width="${LOGO + 16}" height="${LOGO + 16}" rx="10" fill="#fff"/>
  <g transform="translate(${200 - LOGO / 2} ${200 - LOGO / 2}) scale(${LOGO / 400})">${markBody('#000')}</g>
</svg>`);

// ---------- A5 flyer, black on white, 148 x 210 mm ----------
await out('flyer-a5.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1480 2100" width="148mm" height="210mm" role="img" aria-label="A5 flyer: don't queue at the bar">
  <defs>${FIG}<path id="ring" d="${ring}"/></defs>
  <rect width="1480" height="2100" fill="#fff"/>
  <g transform="translate(120,110) scale(0.9)">${markBody('#000')}</g>
  <g transform="translate(1000,120) rotate(-6) scale(0.85)">${stamp('#000').replace(/<svg[^>]*>|<\/svg>/g, '')}</g>
  <g font-family="${FONT}" font-weight="900" fill="#000" letter-spacing="-9">
    <text x="120" y="770" font-size="230">don't</text>
    <text x="120" y="975" font-size="230">queue</text>
    <text x="120" y="1180" font-size="230">at the bar.</text>
  </g>
  <text x="120" y="1310" font-family="${FONT}" font-weight="600" font-size="60" fill="#000">It's a pub. Not a post office.</text>
  <rect x="120" y="1370" width="1240" height="10" fill="#000"/>
  <g font-family="${FONT}" font-weight="900" font-size="54" fill="#000">
    <text x="120" y="1470">1. walk to the bar</text>
    <text x="120" y="1550">2. pick a gap</text>
    <text x="120" y="1630">3. catch an eye</text>
    <text x="120" y="1710">4. trust the barperson</text>
  </g>
  <text x="120" y="1800" font-family="${FONT}" font-weight="500" font-size="40" fill="#000">They know who's next. They always did.</text>
  <g transform="translate(1000,1420)">
    <path transform="scale(${300 / qrSize})" d="${qrD}" fill="#000"/>
    <rect x="${150 - 32}" y="${150 - 32}" width="64" height="64" rx="8" fill="#fff"/>
    <g transform="translate(${150 - 24} ${150 - 24}) scale(0.12)">${markBody('#000')}</g>
  </g>
  <text x="1150" y="1800" font-family="${FONT}" font-weight="900" font-size="38" fill="#000" text-anchor="middle">sign the petition</text>
  <rect x="0" y="1900" width="1480" height="200" fill="#000"/>
  <text x="740" y="2022" font-family="${FONT}" font-weight="900" font-size="72" fill="#fff" text-anchor="middle" letter-spacing="-2">${DOMAIN}</text>
</svg>`);

console.log('built final SVGs in', dir);
