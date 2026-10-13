// Builds the final mark family as static SVG files in this folder.
// Run: node brand/final/build.mjs
// Everything is pure #000 on transparent (or #fff on #000 for the reversed set).
// The mark, lockups, stamp, square icon and beer mat are drawn by scripts/lib/brand.mjs,
// which scripts/build-icons.mjs and scripts/build-mats.mjs share, so the site and this
// folder can't drift apart. The mat back uses the qrcode dev dependency in package.json.
// final-marks.png and final-applications.png are screenshots of sheet-marks.html and
// sheet-applications.html, taken on a Mac so the text is in Avenir Next.
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import QRCode from 'qrcode';
import { FIG, FONT, heads, markBody, mark, horizontal, stacked, square, stamp, matFront, matBack, qrPath } from '../../scripts/lib/brand.mjs';

const NAME = 'QUEUE SIDEWAYS';

const dir = path.dirname(fileURLToPath(import.meta.url));
const out = (f, s) => writeFile(path.join(dir, f), s.trim() + '\n');

const SITE_URL = process.env.SITE_URL || 'https://dontqueueatthebar.co.uk/';
const DOMAIN = new URL(SITE_URL).hostname.replace(/^www\./, '');

// ---------- The mark ----------
await out('mark.svg', mark('#000'));
await out('mark-reversed.svg', mark('#fff'));
await out('mark-on-black.svg', mark('#fff', '#000'));

// ---------- Word-ring badge (the base of the seal; rejected as a mat front) ----------
const badge = (c, bg) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-label="Queue Sideways. They know who’s next.">
  <defs>
    <path id="top" d="M 58,200 A 142,142 0 0 1 342,200"/>
    <path id="bot" d="M 58,200 A 142,142 0 0 0 342,200"/>
  </defs>${bg ? `\n  <circle cx="200" cy="200" r="200" fill="${bg}"/>` : ''}
  <circle cx="200" cy="200" r="194" fill="none" stroke="${c}" stroke-width="8"/>
  <circle cx="200" cy="200" r="110" fill="none" stroke="${c}" stroke-width="20"/>
  ${heads(c, 0.55)}
  <rect x="84" y="214" width="232" height="44" fill="${c}"/>
  <g font-family="${FONT}" font-weight="900" font-size="28" fill="${c}" text-anchor="middle" letter-spacing="2">
    <text><textPath href="#top" startOffset="50%">${NAME}</textPath></text>
    <text><textPath href="#bot" startOffset="50%">THEY KNOW WHO’S NEXT</textPath></text>
  </g>
  <circle cx="44" cy="200" r="7" fill="${c}"/><circle cx="356" cy="200" r="7" fill="${c}"/>
</svg>`;
await out('badge-round.svg', badge('#000'));
await out('badge-round-reversed.svg', badge('#fff', '#000'));

// ---------- Lockups ----------
await out('lockup-horizontal.svg', horizontal('#000'));
await out('lockup-horizontal-reversed.svg', horizontal('#fff'));
await out('lockup-stacked.svg', stacked('#000'));
await out('lockup-stacked-reversed.svg', stacked('#fff'));

// ---------- Square icon (Stripe, favicon, app icon) ----------
await out('icon-square.svg', square('#000', '#fff'));
await out('icon-square-reversed.svg', square('#fff', '#000'));

// ---------- Seal for the hazard licence certificates ----------
// A 48-tooth serrated disc, the mark's heads and bar in the middle, the campaign name round it.
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
    <path id="top" d="M 62,200 A 138,138 0 0 1 338,200"/>
    <path id="bot" d="M 62,200 A 138,138 0 0 0 338,200"/>
  </defs>
  <path d="${d}" fill="${bg}"/>
  <circle cx="200" cy="200" r="172" fill="none" stroke="${c}" stroke-width="4"/>
  <circle cx="200" cy="200" r="106" fill="none" stroke="${c}" stroke-width="20"/>
  ${heads(c, 0.55)}
  <rect x="88" y="216" width="224" height="42" fill="${c}"/>
  <g font-family="${FONT}" font-weight="900" font-size="24" fill="${c}" text-anchor="middle" letter-spacing="3">
    <text><textPath href="#top" startOffset="50%">${line1}</textPath></text>
    <text><textPath href="#bot" startOffset="50%">${line2}</textPath></text>
  </g>
  <circle cx="50" cy="200" r="6" fill="${c}"/><circle cx="350" cy="200" r="6" fill="${c}"/>
</svg>`;
await out('seal-customer.svg', seal(NAME, 'FULL LICENCE', '#000', '#fff'));
await out('seal-barperson.svg', seal(NAME, 'LANDLORD MATERIAL', '#000', '#fff'));
await out('seal-customer-reversed.svg', seal(NAME, 'FULL LICENCE', '#fff', '#000'));

// ---------- The stamp: the wordmark in a ring ----------
await out('stamp.svg', stamp('#000'));
await out('stamp-reversed.svg', stamp('#fff', '#000'));

// ---------- Beer mat: two sides, 107 mm round, no bleed ----------
// Front: the stamp, black on white. Back: the roundel in the middle of the QR code, white on black.
// Level H tolerates 30% damage, so the mark can sit in the middle of the code.
const qr = QRCode.create(SITE_URL, { errorCorrectionLevel: 'H' });
await out('mat-front.svg', matFront('#000', '#fff'));
await out('mat-back.svg', matBack(qr, DOMAIN, '#000', '#fff'));

// ---------- A5 flyer, black on white, 148 x 210 mm ----------
const { p: qrD, size: qrSize } = qrPath(qr);
await out('flyer-a5.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1480 2100" width="148mm" height="210mm" role="img" aria-label="A5 flyer: queue sideways">
  <defs>${FIG}</defs>
  <rect width="1480" height="2100" fill="#fff"/>
  <g transform="translate(120,110) scale(0.9)">${markBody('#000')}</g>
  <g transform="translate(1000,120) rotate(-6) scale(0.85)">${stamp('#000').replace(/<svg[^>]*>|<\/svg>/g, '')}</g>
  <g font-family="${FONT}" font-weight="900" fill="#000" letter-spacing="-9">
    <text x="120" y="770" font-size="230">queue</text>
    <text x="120" y="975" font-size="230">sideways.</text>
    <text x="120" y="1180" font-size="90" letter-spacing="-3">still a queue. just not a line.</text>
  </g>
  <text x="120" y="1310" font-family="${FONT}" font-weight="600" font-size="60" fill="#000">They know who’s next. They always did.</text>
  <rect x="120" y="1370" width="1240" height="10" fill="#000"/>
  <g font-family="${FONT}" font-weight="900" font-size="54" fill="#000">
    <text x="120" y="1470">1. walk to the bar</text>
    <text x="120" y="1550">2. pick a gap</text>
    <text x="120" y="1630">3. catch an eye</text>
    <text x="120" y="1710">4. trust the barperson</text>
  </g>
  <text x="120" y="1800" font-family="${FONT}" font-weight="500" font-size="40" fill="#000">They know who’s next. They always did.</text>
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
