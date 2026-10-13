// Builds the hazard licence certificate masters. Run with: npm run build:badges
//
//   public/badges/customer-square.svg    "full licence." on Pink Gin, for the customer test
//   public/badges/barperson-square.svg   "landlord material." on Quiz Night Blue, for the barperson test
//
// hazard-badge.js loads a master on a perfect run, fills the <text> fields (#f-name, #f-date,
// #f-number, #f-site) and animates #seal and #seal-burst, so those ids and the data-* sizing
// attributes are part of its contract. The masters must stay self-contained: no <image>,
// <foreignObject>, <use> or web fonts. The fixed words are outlined paths in
// scripts/lib/badge-words.mjs; the seal is drawn here, with the Cluster roundel from
// scripts/lib/brand.mjs. To add a certificate for a new test, add an entry to BADGES below
// (its key is the test page's file name without "hazard-" and ".html"), outline its title
// and line into badge-words.mjs, and add it to BADGES in public/hazard-badge.js.
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { markInline } from './lib/brand.mjs';
import { WORDS } from './lib/badge-words.mjs';

const INK = '#16161d';
const CREAM = '#fff4dc';
const FIELD_FONT = "'Avenir Next', 'Helvetica Neue', 'Segoe UI', system-ui, -apple-system, Arial, sans-serif";

const BADGES = {
  customer: {
    block: '#ff9ec1', // Pink Gin
    fg: INK,
    title: 'Full licence.',
    test: 'customer',
    defaultName: 'a regular',
    nameSize: 60,
  },
  barperson: {
    block: '#2447f5', // Quiz Night Blue
    fg: CREAM,
    title: 'Landlord material.',
    test: 'barperson',
    defaultName: 'whoever’s on tonight',
    nameSize: 44.7, // the default name is long, so the master ships it already shrunk to fit
  },
};

// A live field: hazard-badge.js sets its textContent, then shrinks it from data-max-size
// towards data-min-size until it fits data-max-width, and cuts it with an ellipsis after that.
const field = (id, x, y, size, fg, { max, min, width, dflt }, text) =>
  `<text id="${id}" x="${x}" y="${y}" font-family="${FIELD_FONT}" font-weight="800" font-size="${size}" fill="${fg}" text-anchor="start"` +
  ` data-max-size="${max}" data-min-size="${min}" data-max-width="${width}"${dflt ? ` data-default="${dflt}"` : ''}>${text}</text>`;

// The seal's scalloped edge: 44 lobes round a circle of radius 212, each a small arc.
const fmt = (n) => String(Math.round(n * 10) / 10);
function rosette(cx, cy, r = 212, lobes = 44, lobeR = 18.8) {
  const pt = (i) => {
    const a = -Math.PI / 2 + (i / lobes) * 2 * Math.PI;
    return `${fmt(cx + r * Math.cos(a))} ${fmt(cy + r * Math.sin(a))}`;
  };
  let d = `M${pt(0)}`;
  for (let i = 1; i <= lobes; i++) d += `A${lobeR} ${lobeR} 0 0 1 ${pt(i)}`;
  return d + 'Z';
}

// The seal: an ink rosette, two cream rings with the ring text between them, a dot either
// side, and the Cluster roundel in cream in the middle, the whole thing tilted like a stamp.
// The roundel is drawn at 0.55 of its 400 box, so the bar's corners (214.7 from its centre)
// land 118 from the seal's, inside the inner ring (r 136.7).
function seal(cx, cy, fg) {
  const S = 0.55;
  const t = cx - 200 * S;
  return `<g id="seal">
  <g transform="rotate(-8 ${cx} ${cy})">
    <path d="${rosette(cx, cy)}" fill="${INK}"/>
    <circle cx="${cx}" cy="${cy}" r="197.2" fill="none" stroke="${CREAM}" stroke-width="4.2"/>
    <circle cx="${cx}" cy="${cy}" r="136.7" fill="none" stroke="${CREAM}" stroke-width="4.2"/>
    <path d="${WORDS.ring}" fill="${CREAM}"/>
    <circle cx="${cx - 166.4}" cy="${cy}" r="6.8" fill="${CREAM}"/>
    <circle cx="${cx + 166.4}" cy="${cy}" r="6.8" fill="${CREAM}"/>
    <g transform="translate(${t} ${t}) scale(${S})" fill="${CREAM}">${markInline(CREAM)}</g>
  </g>
</g>
<circle id="seal-burst" cx="${cx}" cy="${cy}" r="220.5" fill="none" stroke="${fg}" stroke-width="8.5" opacity="0"/>`;
}

function master(key) {
  const b = BADGES[key];
  const words = WORDS[key];
  const fg = b.fg;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080" role="img" aria-labelledby="badge-title">
<title id="badge-title">${b.title} 5 out of 5 on the ${b.test} hazard perception test. Don’t Queue At The Bar. Not valid as ID.</title>
<rect id="block" width="1080" height="1080" fill="${b.block}"/>
<rect id="frame" x="36" y="36" width="1008" height="1008" rx="28" fill="none" stroke="${fg}" stroke-width="6"/>
<path id="title" d="${words.title}" fill="${fg}"/>
<path id="line" d="${words.line}" fill="${fg}"/>
<path id="labels" d="${WORDS.labels}" fill="${fg}"/>
<g id="stamp" transform="rotate(-3 243.4 894.6)"><rect x="88" y="868" width="310.8" height="53.3" rx="26.6" fill="none" stroke="${fg}" stroke-width="4.9"/><path d="${WORDS.stamp}" fill="${fg}"/></g>
${field('f-name', 88, 684, b.nameSize, fg, { max: 60, min: 32, width: 500, dflt: b.defaultName }, b.defaultName)}
${field('f-date', 88, 814, 36, fg, { max: 36, min: 24, width: 270 }, '8 Oct 2026')}
${field('f-number', 380, 814, 36, fg, { max: 36, min: 24, width: 200 }, 'DQ-4821')}
${field('f-site', 88, 1000, 30, fg, { max: 30, min: 22, width: 470 }, 'dontqueueatthebar.co.uk')}
${seal(836, 836, fg)}
</svg>
`;
}

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'badges');
await mkdir(dir, { recursive: true });
for (const key of Object.keys(BADGES)) {
  await writeFile(path.join(dir, `${key}-square.svg`), master(key));
}
console.log(`Certificate masters written to public/badges/ (${Object.keys(BADGES).join(', ')})`);
