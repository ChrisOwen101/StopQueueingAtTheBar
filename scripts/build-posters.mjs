// Builds the campaign posters in the pub-notice idiom (a flat colour field, a huge headline, one
// big flat pictogram, a dry line, a polite ask, the mark small in a corner), as PDF plus a PNG
// preview and a tenth-size thumbnail of each. An exploration beside the print-at-home flyers in
// scripts/build-flyers.mjs, which it is modelled on; the notes and every round's renders are in
// brand/final/review/posters/, and the decisions in brand/BRIEF.md ("Posters (notice family)").
//
//   node scripts/build-posters.mjs                 the final set -> brand/final/review/posters/final/
//   node scripts/build-posters.mjs --round 4       a round's set -> brand/final/review/posters/round-4/
//   --size a4,a5     paper sizes (overrides each concept's `paper`; default a4)
//   --only a,b       just these concept ids
//   --mono           also render every concept's black-on-white version (ids get -mono)
//   --tag arial      append to every file name (the metrics check: POSTER_FONT=Arial --tag arial)
//   --out DIR        write somewhere else
//
// Every concept ever rendered is one entry in CONCEPTS below (copy, field colour, layout, scan
// reason) with the review rounds it was rendered in, and the final set is the entries marked
// `final`. Nothing is deleted when a concept is retired: `--round N` rebuilds that round's set
// (with the current layout code, so a rebuild can differ from the round folder's record where
// a later round changed a layout; the folders are the record). Four layouts: "notice" (centred,
// the compliance sign), "tap" (headline stacked top left, the pictogram lower right), "pair"
// (two pictograms side by side, along against away) and "split" (a red panel over a green one,
// Round 1 only).
//
// Paper and the mount: exact A4 (210 x 297 mm) and A5 (148 x 210 mm, the A4 layout at 148/210,
// every length a multiple of --mm). A home printer can't print to the edge, so a colour field
// bled to the page would come back with a ragged white border. Instead the field is drawn inset
// by FRAME (8 mm at A4, 5.6 mm at A5): a deliberate white mount that the printer's unprintable
// edge falls inside, so the frame prints even. Content keeps PAD inside the field, which puts
// it 20 mm from the paper's edge at A4, well inside the flyers' 10 mm safe margin.
//
// Colour: the fields are the site's palette (brand/BRIEF.md, DESIGN.md "Colors"): red means the
// Single File, green the Cluster, amber the one highlight. Everything on a field is knocked out
// to paper white (what Pub Cream becomes on a home printer) or set in black. The marks come from
// scripts/lib/brand.mjs and are never redrawn; the one new pictogram, the prohibition sign over
// a single-file queue, reuses the FIG glyph so the family matches, and always carries its slash
// and never a bar, so it can't be mistaken for the roundel.
//
// Stress: a word wrapped in asterisks in a headline or a polite line (*along*) is the stressed
// word. `stress` on the concept picks the device: "amber" (the word in Amber Pint, on ink only),
// "weight" (the rest of the line drops to 500 and the word keeps 900), "underline" (a thick
// rule under the word). The mono of an amber concept falls back to `monoStress` (weight).
//
// FONT: the site's stack (FONT in brand.mjs, Avenir Next first). Chrome embeds whatever the
// stack resolves to here, so the PDFs are only right when built on a Mac with Avenir Next; the
// script warns when it can't find it, like build-flyers.mjs. CHROME_PATH overrides the browser.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import QRCode from 'qrcode';
import { PDFDocument } from 'pdf-lib';
import { FIG, FONT, markBody, stamp, qrPath } from './lib/brand.mjs';
import { SITE_URL, DOMAIN } from './lib/site.mjs';

const AUTHOR = 'Don’t Queue At The Bar';
const LANG = 'en-GB';

// ---------- Arguments ----------
const argv = process.argv.slice(2);
const arg = (name, dflt) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : dflt;
};
const ROUND = arg('--round', null);
const SIZES_ARG = arg('--size', null);
const ONLY = arg('--only', '').split(',').filter(Boolean);
const MONO = argv.includes('--mono');
const TAG = arg('--tag', '');

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = arg('--out', null)
  ? path.resolve(arg('--out'))
  : path.join(root, 'brand', 'final', 'review', 'posters', ROUND ? `round-${ROUND}` : 'final');
await mkdir(dir, { recursive: true });

// ---------- Palette ----------
const PAPER = '#ffffff'; // paper white: what cream becomes on a home printer
const BLACK = '#000000';
const INK = '#16161d'; // Last Orders Ink, as a field
const RED = '#d62839'; // Pint Glass Red: the Single File
const GREEN = '#0f5b43'; // Snug Green: the Cluster
const AMBER = '#ffb627'; // Amber Pint: the one highlight
const BLUE = '#2447f5'; // Quiz Night Blue

// ---------- The browser (as build-flyers.mjs) ----------
function findChrome() {
  const names = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    'google-chrome',
    'google-chrome-stable',
    'chromium',
    'chromium-browser',
    '/opt/pw-browsers/chromium',
  ].filter(Boolean);
  for (const n of names) {
    if (n.includes('/')) {
      if (existsSync(n)) return n;
      continue;
    }
    try {
      return execFileSync('sh', ['-c', `command -v ${n}`], { encoding: 'utf8' }).trim();
    } catch {}
  }
  throw new Error('No Chrome or Chromium found. Set CHROME_PATH to one.');
}
const CHROME = findChrome();
const chrome = (args) =>
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-sandbox', ...args], {
    stdio: ['ignore', 'pipe', 'ignore'],
    encoding: 'utf8',
  });
const tmp = await mkdtemp(path.join(tmpdir(), 'dqatb-posters-'));

async function fontReport() {
  const families = ['Avenir Next', 'Helvetica Neue', 'Segoe UI', 'Arial'];
  const probe = path.join(tmp, 'font.html');
  await writeFile(
    probe,
    `<!doctype html><meta charset="utf-8"><body><script>
      const t = 'don’t queue at the bar. the quick brown fox jumps over the lazy dog 0123456789';
      const w = (f) => { const s = document.createElement('span'); s.style.cssText = 'font: 900 40px ' + f + '; white-space: nowrap'; s.textContent = t; document.body.append(s); const r = s.getBoundingClientRect().width; s.remove(); return r; };
      const mono = w('monospace');
      const found = ${JSON.stringify(families)}.filter((f) => w("'" + f + "', monospace") !== mono);
      document.body.setAttribute('data-fonts', found.join('|'));
    </script></body>`
  );
  const dom = chrome(['--dump-dom', `file://${probe}`]);
  const m = dom.match(/data-fonts="([^"]*)"/);
  return m && m[1] ? m[1].split('|') : [];
}
const fonts = await fontReport();
const HAVE_AVENIR = fonts[0] === 'Avenir Next';
if (!HAVE_AVENIR) {
  console.warn(
    '\n' +
      '!'.repeat(78) +
      '\n!!  Avenir Next is not installed here. The posters are being set in the fallback\n' +
      `!!  (${fonts[0] ? `"${fonts[0]}" as this machine resolves it` : 'the system sans-serif'}). Judge layout, not letterforms; rebuild\n` +
      '!!  on a Mac with Avenir Next before any of these is published.\n' +
      '!'.repeat(78) +
      '\n'
  );
}

// ---------- Routes to the site ----------
const TEST_URL = new URL('hazard', SITE_URL).href;
const ROUTES = {
  home: { url: SITE_URL, text: DOMAIN, qr: QRCode.create(SITE_URL, { errorCorrectionLevel: 'H' }) },
  test: { url: TEST_URL, text: DOMAIN, qr: QRCode.create(TEST_URL, { errorCorrectionLevel: 'H' }) },
};
const QUIET = 4;
// A plain level-H code on a paper-white panel, so it reads the same on any field.
const qrSvg = ({ qr, text }) => {
  const { p, size } = qrPath(qr);
  const N = size + QUIET * 2;
  return `<svg class="qr" viewBox="0 0 ${N} ${N}" role="img" aria-label="QR code to ${text}"><rect width="${N}" height="${N}" fill="${PAPER}"/><path transform="translate(${QUIET} ${QUIET})" d="${p}" fill="${BLACK}" shape-rendering="crispEdges"/></svg>`;
};

// ---------- The marks and the pictograms ----------
const roundel = (c, cls = 'roundel') => `<svg class="${cls}" viewBox="0 0 400 400" aria-hidden="true"><defs>${FIG}</defs>${markBody(c)}</svg>`;
const stampSvg = (c) => stamp(c).replace('<svg ', '<svg class="stamp" ');

// The prohibition sign over a single-file queue: four FIG glyphs one behind another in a
// column with gaps, the nearest at the bottom and biggest, under a 45-degree slash (upper left
// to lower right, as ISO 3864 draws it) and a ring. The roundel's row is horizontal (spread
// along the bar); the Single File is vertical (one behind another), and that is the whole
// grammar. Same 400 box, ring and stroke as the roundel so the two sit as a family; the slash
// is what says "no", there is never a bar, and the figures never touch, so it can't be read
// as the mark. Overlapping, receding figures were tried first and read as a stack of circles.
// `ring` is the ring-and-slash colour, `fig` the figures', `field` the colour of the knockout
// that keeps the slash clear of the figures when they are the same colour.
function prohibition({ ring, fig, field }) {
  const scales = [0.5, 0.6, 0.72, 0.88], GAP = 7;
  const height = scales.reduce((h, s) => h + 103 * s, 0) + GAP * (scales.length - 1);
  let y = 200 - height / 2;
  const col = scales
    .map((s) => {
      const cy = y + 25 * s;
      y += 103 * s + GAP;
      return `<g transform="translate(200 ${cy.toFixed(1)}) scale(${s})"><use href="#fig" fill="${fig}"/></g>`;
    })
    .join('');
  const d = 185 / Math.SQRT2;
  const slash = (c, w) => `<line x1="${(200 - d).toFixed(1)}" y1="${(200 - d).toFixed(1)}" x2="${(200 + d).toFixed(1)}" y2="${(200 + d).toFixed(1)}" stroke="${c}" stroke-width="${w}"/>`;
  return `<svg class="picto" viewBox="0 0 400 400" role="img" aria-label="No single-file queue"><defs>${FIG}</defs>
    ${col}
    ${ring === fig ? slash(field, 52) : ''}
    ${slash(ring, 30)}
    <circle cx="200" cy="200" r="170" fill="none" stroke="${ring}" stroke-width="30"/>
  </svg>`;
}
// A tick for the "pair" layout's label: the ring's stroke weight, in the label's colour.
const tick = () => `<svg class="tick" viewBox="0 0 100 100" aria-hidden="true"><path d="M16 54 L42 80 L86 26" fill="none" stroke="currentColor" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const br = (s) => s.replace(/\n/g, '<br>');
const em = (s) => s.replace(/\*([^*]+)\*/g, '<em class="st">$1</em>');
const txt = (s) => em(br(s));

// ---------- Copy ----------
const HOUSE = 'This bar does The&nbsp;Cluster.';
const POLITE_R1 = 'We kindly ask that you spread out along the bar. The bar staff know who’s&nbsp;next.';
const POLITE_R2 = 'We kindly ask that you spread out along the bar.\nThe bar staff know who’s&nbsp;next.';
// Two sentences, two lines: the first sentence with "along the bar" on the end is wider than
// the measure in every font, and the sheet says "at the bar" twice already.
const POLITE = 'We kindly ask that you spread out.\nThe bar staff know who’s&nbsp;next.';
// Round 4: the user's line, "queue along the bar, not away from the bar", as the ask.
const POLITE_ALONG = 'We kindly ask that you queue\n*along* the bar, not *away* from it.\nThe bar staff know who’s&nbsp;next.';
const CHEERS_R1 = 'Please don’t queue.\nCheers.';
const CHEERS_R2 = 'Please don’t queue. Cheers.';
// Round 4 (the user's words): it breaks after "queue.", never inside "single-file queue".
const CHEERS = 'Please don’t single-file queue.\nCheers.';
const CODE = 'DQ/POS/BAR-001'; // the stock-code gag, in the register of the point-of-sale notice

// ---------- The concepts ----------
// field: the block colour. fg: text and marks on it (paper white). ring: the prohibition
// ring's colour where the layout has one. head: the headline colour. layout: notice | tap |
// pair | split. upper: uppercase headline. sizes: {head, picto} in mm at A4. sub: the tap
// subhead (optional). subWeight: its weight. stress: amber | weight | underline (see above).
// monoStress: the device the mono falls back to when stress is amber. labels: the pair
// layout's two captions. scan: the reason beside the code. route: home (the petition) or test
// (the hazard perception test). paper: the sizes to render (default a4). mono: also render
// the black-on-white version. rounds: the review rounds it was rendered in. final: in the set.
const ALONG_4 = ['*ALONG*', 'THE BAR.', 'NOT *AWAY*', 'FROM IT.'];
const CONCEPTS = [
  // ----- Round 1: six concepts (round-1/designer.md, marketing.md, decision.md) -----
  {
    id: 'a-prohibition', rounds: [1],
    title: 'A. No queueing: the prohibition notice',
    layout: 'notice',
    field: RED, fg: PAPER, head: PAPER, ring: PAPER,
    headline: ['don’t queue', 'at the bar.'], upper: false,
    body: HOUSE, polite: POLITE_R1,
    scan: 'Sign the petition.', route: 'home',
  },
  {
    id: 'b-spread-out', rounds: [1],
    title: 'B. Spread out: the tap poster’s structure',
    layout: 'tap',
    field: BLUE, fg: PAPER, head: PAPER,
    headline: ['SPREAD', 'OUT.'], upper: true,
    sizes: { head: 40, picto: 96 },
    sub: 'The bar is long\nfor a reason.', subWeight: 500,
    polite: CHEERS_R1,
    scan: 'Sign the petition.', route: 'home',
  },
  {
    id: 'b2-spread-out-lower', rounds: [1],
    title: 'B2. Spread out, lowercase, the post office line',
    layout: 'tap',
    field: BLUE, fg: PAPER, head: PAPER,
    headline: ['spread', 'out.'], upper: false,
    sizes: { head: 44, picto: 96 },
    sub: 'It’s a pub.\nNot a post office.', subWeight: 500,
    polite: CHEERS_R1,
    scan: 'Sign the petition.', route: 'home',
  },
  {
    id: 'c-split', rounds: [1],
    title: 'C. Don’t / do: the two-panel notice',
    layout: 'split',
    fg: PAPER,
    headline: ['don’t queue.', 'spread out.'], upper: false,
    body: 'This bar does The&nbsp;Cluster.\nThe bar staff know who’s&nbsp;next.\nThey always did.',
    scan: 'Sign the petition.', route: 'home',
  },
  {
    id: 'd-no-queueing', rounds: [1],
    title: 'D. No queueing: the no-smoking structure',
    layout: 'notice',
    field: INK, fg: PAPER, head: AMBER, ring: RED,
    headline: ['NO QUEUEING', 'AT THE BAR'], upper: true,
    body: HOUSE, polite: POLITE_R1, code: CODE,
    scan: 'Sign the petition.', route: 'home',
  },
  {
    id: 'e-find-the-gap', rounds: [1],
    title: 'E. Find the gap: the instruction in green',
    layout: 'tap',
    field: GREEN, fg: PAPER, head: PAPER,
    headline: ['FIND', 'THE', 'GAP.'], upper: true,
    sizes: { head: 32, picto: 80 },
    sub: 'Any gap. The bar staff\nknow who’s next.', subWeight: 500,
    polite: CHEERS_R1,
    scan: 'Take the test.', route: 'test',
  },
  // ----- Round 2: the pair on both fields (round-2/designer.md, marketing.md) -----
  {
    id: 'notice-ink', rounds: [2],
    title: 'The notice, on ink',
    layout: 'notice',
    field: INK, fg: PAPER, head: AMBER, ring: RED,
    headline: ['NO QUEUEING', 'AT THE BAR'], upper: true,
    sizes: { head: 25 },
    body: HOUSE, polite: POLITE_R2, code: CODE,
    scan: 'Sign the petition.', route: 'home',
    paper: ['a4', 'a5'], mono: true,
  },
  {
    id: 'notice-red', rounds: [2],
    title: 'The notice, on red',
    layout: 'notice',
    field: RED, fg: PAPER, head: PAPER, ring: PAPER,
    headline: ['NO QUEUEING', 'AT THE BAR'], upper: true,
    sizes: { head: 25 },
    body: HOUSE, polite: POLITE_R2, code: CODE,
    scan: 'Sign the petition.', route: 'home',
    paper: ['a4', 'a5'],
  },
  {
    id: 'poster-green', rounds: [2],
    title: 'The instruction poster, on green',
    layout: 'tap',
    field: GREEN, fg: PAPER, head: PAPER,
    headline: ['SPREAD', 'OUT.'], upper: true,
    sizes: { head: 40, picto: 96 },
    sub: 'It’s a pub.\nNot a post office.', subWeight: 500,
    polite: CHEERS_R2,
    scan: 'Sign the petition.', route: 'home',
    paper: ['a4', 'a5'], mono: true,
  },
  {
    id: 'poster-green-600', rounds: [2],
    title: 'The instruction poster, on green, subhead at 600',
    layout: 'tap',
    field: GREEN, fg: PAPER, head: PAPER,
    headline: ['SPREAD', 'OUT.'], upper: true,
    sizes: { head: 40, picto: 96 },
    sub: 'It’s a pub.\nNot a post office.', subWeight: 600,
    polite: CHEERS_R2,
    scan: 'Sign the petition.', route: 'home',
  },
  {
    id: 'poster-blue', rounds: [2],
    title: 'The instruction poster, on blue (for comparison)',
    layout: 'tap',
    field: BLUE, fg: PAPER, head: PAPER,
    headline: ['SPREAD', 'OUT.'], upper: true,
    sizes: { head: 40, picto: 96 },
    sub: 'It’s a pub.\nNot a post office.', subWeight: 500,
    polite: CHEERS_R2,
    scan: 'Sign the petition.', route: 'home',
  },
  {
    id: 'poster-gap', rounds: [2],
    title: 'The instruction poster, "Find the gap" alternate',
    layout: 'tap',
    field: GREEN, fg: PAPER, head: PAPER,
    headline: ['FIND', 'THE', 'GAP.'], upper: true,
    sizes: { head: 32, picto: 80 },
    sub: 'Any gap.\nThe bar staff know who’s next.', subWeight: 500,
    polite: CHEERS_R2,
    scan: 'Take the test.', route: 'test',
  },
  // ----- Round 3: the polish (round-3/designer.md); the final set until Round 4 -----
  {
    id: 'notice-ink', rounds: [3],
    title: 'The notice',
    layout: 'notice',
    field: INK, fg: PAPER, head: AMBER, ring: RED,
    headline: ['NO QUEUEING', 'AT THE BAR'], upper: true,
    sizes: { head: 25 },
    body: HOUSE, polite: POLITE, code: CODE,
    scan: 'Sign the petition.', route: 'home',
    paper: ['a4', 'a5'], mono: true,
  },
  {
    id: 'poster-green', rounds: [3],
    title: 'The instruction poster',
    layout: 'tap',
    field: GREEN, fg: PAPER, head: PAPER,
    headline: ['SPREAD', 'OUT.'], upper: true,
    sizes: { head: 40, picto: 96 },
    sub: 'It’s a pub.\nNot a post office.', subWeight: 600,
    polite: CHEERS_R2,
    scan: 'Sign the petition.', route: 'home',
    paper: ['a4', 'a5'], mono: true,
  },
  {
    id: 'poster-gap', rounds: [3],
    title: 'The instruction poster, "Find the gap" alternate',
    layout: 'tap',
    field: GREEN, fg: PAPER, head: PAPER,
    headline: ['FIND', 'THE', 'GAP.'], upper: true,
    sizes: { head: 32, picto: 80 },
    sub: 'Any gap.\nThe bar staff know who’s next.', subWeight: 600,
    polite: CHEERS_R2,
    scan: 'Take the test.', route: 'test',
    mono: true,
  },
  // ----- Round 4: the new polite line on the set, and the along/away treatments -----
  // The set with "Please don’t single-file queue. Cheers." (two lines, so the roundel gives up
  // 6 mm), and the notice unchanged for comparison.
  {
    id: 'notice-ink', rounds: [4],
    title: 'The notice',
    layout: 'notice',
    field: INK, fg: PAPER, head: AMBER, ring: RED,
    headline: ['NO QUEUEING', 'AT THE BAR'], upper: true,
    sizes: { head: 25 },
    body: HOUSE, polite: POLITE, code: CODE,
    scan: 'Sign the petition.', route: 'home',
    mono: true,
  },
  {
    id: 'poster-green', rounds: [4],
    title: 'The instruction poster',
    layout: 'tap',
    field: GREEN, fg: PAPER, head: PAPER,
    headline: ['SPREAD', 'OUT.'], upper: true,
    sizes: { head: 40, picto: 90 },
    sub: 'It’s a pub.\nNot a post office.', subWeight: 600,
    polite: CHEERS,
    scan: 'Sign the petition.', route: 'home',
    paper: ['a4', 'a5'], mono: true,
  },
  {
    id: 'poster-gap', rounds: [4],
    title: 'The instruction poster, "Find the gap" alternate',
    layout: 'tap',
    field: GREEN, fg: PAPER, head: PAPER,
    headline: ['FIND', 'THE', 'GAP.'], upper: true,
    sizes: { head: 32, picto: 72 },
    sub: 'Any gap.\nThe bar staff know who’s next.', subWeight: 600,
    polite: CHEERS,
    scan: 'Take the test.', route: 'test',
    mono: true,
  },
  // "Queue along the bar, not away from the bar": seven treatments.
  {
    id: 'along-weight', rounds: [4],
    title: 'Along, not away: the headline, stressed by weight',
    layout: 'tap',
    field: GREEN, fg: PAPER, head: PAPER,
    headline: ALONG_4, upper: true, stress: 'weight',
    sizes: { head: 30, picto: 84 },
    polite: CHEERS,
    scan: 'Sign the petition.', route: 'home',
    mono: true,
  },
  {
    id: 'along-amber', rounds: [4],
    title: 'Along, not away: the headline, stressed in amber on ink',
    layout: 'tap',
    field: INK, fg: PAPER, head: PAPER,
    headline: ALONG_4, upper: true, stress: 'amber', monoStress: 'weight',
    sizes: { head: 30, picto: 84 },
    polite: CHEERS,
    scan: 'Sign the petition.', route: 'home',
    mono: true,
  },
  {
    id: 'along-underline', rounds: [4],
    title: 'Along, not away: the headline, stressed with an underline',
    layout: 'tap',
    field: GREEN, fg: PAPER, head: PAPER,
    headline: ALONG_4, upper: true, stress: 'underline',
    sizes: { head: 30, picto: 84 },
    polite: CHEERS,
    scan: 'Sign the petition.', route: 'home',
    mono: true,
  },
  {
    id: 'along-fragment', rounds: [4],
    title: 'Along, not away: the two stressed words as the headline, the sentence under',
    layout: 'tap',
    field: GREEN, fg: PAPER, head: PAPER,
    headline: ['ALONG.', 'NOT AWAY.'], upper: true,
    sizes: { head: 27, picto: 96 },
    sub: 'Queue along the bar,\nnot away from it.', subWeight: 600,
    polite: CHEERS,
    scan: 'Sign the petition.', route: 'home',
    mono: true,
  },
  {
    id: 'along-notice', rounds: [4],
    title: 'The notice with the along/away ask',
    layout: 'notice',
    field: INK, fg: PAPER, head: AMBER, ring: RED,
    headline: ['NO QUEUEING', 'AT THE BAR'], upper: true, stress: 'weight',
    sizes: { head: 25, picto: 100 },
    body: HOUSE, polite: POLITE_ALONG, code: CODE,
    scan: 'Sign the petition.', route: 'home',
    mono: true,
  },
  {
    id: 'along-pictos', rounds: [4],
    title: 'Along, not away: the two pictograms',
    layout: 'pair',
    field: INK, fg: PAPER, head: AMBER, ring: RED,
    headline: ['QUEUE ALONG', 'THE BAR.'], upper: true, stress: 'amber', monoStress: 'weight',
    sizes: { head: 25, picto: 74 },
    labels: ['Along', 'Away'],
    body: HOUSE, polite: 'We kindly ask that you queue *along* the bar, not *away* from it.',
    scan: 'Sign the petition.', route: 'home',
    mono: true,
  },
  {
    id: 'along-lower', rounds: [4],
    title: 'Along, not away: lowercase, sentence case, amber on ink',
    layout: 'tap',
    field: INK, fg: PAPER, head: PAPER,
    headline: ['*along*', 'the bar.', 'not *away*', 'from it.'], upper: false, stress: 'amber', monoStress: 'weight',
    sizes: { head: 32, picto: 80 },
    polite: CHEERS,
    scan: 'Sign the petition.', route: 'home',
    mono: true,
  },
];

// The black-on-white version of a concept for office printers: no field, black type and marks,
// a 1 mm black border where the field's edge was so it still reads as a sign. Amber stress has
// no colour to use, so it falls back to the concept's monoStress (weight by default).
const mono = (c) => ({
  ...c,
  id: `${c.id}-mono`,
  title: `${c.title} (mono)`,
  field: PAPER, fg: BLACK, head: BLACK, ring: BLACK,
  stress: c.stress === 'amber' ? c.monoStress || 'weight' : c.stress,
  isMono: true,
});

// ---------- Layout ----------
const FRAME = 8; // the white mount, mm at A4
const PAD = 12; // inside the field
const m = (n) => `calc(${n} * var(--mm))`;
const STACK = process.env.POSTER_FONT ? `'${process.env.POSTER_FONT}',${FONT}` : FONT;
const sz = (c, k, dflt) => m((c.sizes && c.sizes[k]) || dflt);
const stressClass = (c) => (c.stress ? ` st-${c.stress}` : '');

const CSS = `
html, body { margin: 0; padding: 0; }
body { font-family: ${STACK}; color: ${BLACK}; background: ${PAPER}; }
.sheet { position: relative; overflow: hidden; break-after: page; background: ${PAPER}; }
.sheet:last-child { break-after: auto; }
.field { position: absolute; inset: ${m(FRAME)}; background: var(--field); color: var(--fg); }
.field.mono { outline: ${m(1)} solid ${BLACK}; outline-offset: ${m(-1)}; }
.page { position: absolute; inset: ${m(PAD)}; display: flex; flex-direction: column; }
p, h1, h2, figure { margin: 0; padding: 0; }
em { font-style: normal; }
.mega { font-weight: 900; letter-spacing: -0.04em; line-height: 0.9; color: var(--head); }
.mega.upper { letter-spacing: -0.03em; line-height: 0.92; }
.mid { font-weight: 600; line-height: 1.25; }
.label { font-weight: 900; letter-spacing: 0.08em; text-transform: uppercase; line-height: 1; }
.picto, .roundel, .stamp, .qr { display: block; flex: none; }
.cta { font-weight: 900; font-size: ${m(8)}; letter-spacing: -0.02em; line-height: 1.05; }
.addr { font-weight: 600; font-size: ${m(7.6)}; line-height: 1.2; white-space: nowrap; }
.rule { border: 0; border-top: ${m(1)} solid var(--fg); margin: 0; }
.st-amber .st { color: ${AMBER}; }
.st-weight .mega { font-weight: 500; letter-spacing: -0.02em; }
.st-weight .mega .st { font-weight: 900; letter-spacing: -0.03em; }
.st-weight .polite .st { font-weight: 900; }
.st-underline .st { text-decoration: underline; text-decoration-thickness: 0.09em; text-underline-offset: 0.1em; }
`;

// The foot shared by the notice and the pair: a rule, then the roundel, the scan reason over
// the address (the flyer's foot) and the stock-code gag at left, the code at right.
const foot = (c, r) => `<hr class="rule">
  <div class="foot">
    <div class="who">${roundel(c.fg)}<div><p class="cta">${c.scan}</p><p class="addr">${r.text}</p>${c.code ? `<p class="code label">${c.code}</p>` : ''}</div></div>
    ${qrSvg(r)}
  </div>`;
const CSS_FOOT = `
.page > .rule { width: 100%; margin-top: auto; }
.foot { width: 100%; display: flex; align-items: flex-end; justify-content: space-between; margin-top: ${m(5)}; text-align: left; }
.who { display: flex; align-items: center; gap: ${m(5)}; }
.who .roundel { width: ${m(18)}; }
.who .addr { margin-top: ${m(1.5)}; }
.who .code { font-size: ${m(6)}; margin-top: ${m(2.5)}; }
.foot .qr { width: ${m(36)}; }
`;

// "notice": the compliance sign. Centred: headline, the prohibition sign, the house line, the
// polite ask, then the foot.
const notice = (c, r) => `<div class="page notice${stressClass(c)}" style="--head-size:${sz(c, 'head', c.upper ? 23 : 26)};--picto:${sz(c, 'picto', 104)}">
  <h1 class="mega${c.upper ? ' upper' : ''}">${c.headline.map(em).join('<br>')}</h1>
  ${prohibition({ ring: c.ring, fig: c.fg, field: c.field })}
  <p class="body mid">${c.body}</p>
  <p class="polite mid">${txt(c.polite)}</p>
  ${foot(c, r)}
</div>`;
const CSS_NOTICE = `
.notice { text-align: center; align-items: center; }
.notice .mega { font-size: var(--head-size); }
.notice .picto { width: var(--picto); margin: ${m(8)} 0 ${m(7)}; }
.notice .body { font-size: ${m(12)}; }
.notice .polite { font-size: ${m(7.6)}; max-width: ${m(156)}; margin-top: ${m(4)}; }
`;

// "tap": the water poster's structure. The headline stacked top left, one word a line, a quiet
// subhead, the roundel as the pictogram lower right (it shows the right behaviour, so it is the
// picture and the mark at once: one roundel per sheet), and at the foot two columns: the polite
// line over a short rule, then the scan reason and the address at left; the code alone at
// right, where the reference keeps its mark.
const tap = (c, r) => `<div class="page tap${stressClass(c)}" style="--head-size:${sz(c, 'head', c.upper ? 42 : 46)};--picto:${sz(c, 'picto', 90)};--sub-weight:${c.subWeight || 600}">
  <div class="top">
    <h1 class="mega${c.upper ? ' upper' : ''}">${c.headline.map(em).join('<br>')}</h1>
    ${c.sub ? `<p class="sub">${txt(c.sub)}</p>` : ''}
  </div>
  ${roundel(c.fg, 'picto')}
  <div class="foot">
    <div class="words"><p class="polite mid">${txt(c.polite)}</p><hr class="rule"><p class="cta">${c.scan}</p><p class="addr">${r.text}</p></div>
    ${qrSvg(r)}
  </div>
</div>`;
const CSS_TAP = `
.tap .top { text-align: left; }
.tap .mega { font-size: var(--head-size); }
.tap .sub { font-size: ${m(11)}; margin-top: ${m(8)}; font-weight: var(--sub-weight); line-height: 1.2; }
.tap .picto { width: var(--picto); align-self: flex-end; margin: auto 0 ${m(14)}; }
.tap .foot { display: flex; align-items: flex-end; justify-content: space-between; gap: ${m(6)}; margin-top: 0; }
.tap .polite { font-size: ${m(7.6)}; white-space: nowrap; }
.tap .words .rule { width: ${m(40)}; margin: ${m(3)} 0; }
.tap .words .addr { margin-top: ${m(1.5)}; }
.tap .qr { width: ${m(36)}; }
`;

// "pair": the notice's structure with two pictograms side by side, the roundel (the row along
// the bar) labelled with a tick, and the prohibition column (one behind another, leading away)
// whose slash is its own "no". The roundel keeps its clear space: the label sits more than an
// eighth of its width below it.
const pair = (c, r) => `<div class="page pair${stressClass(c)}" style="--head-size:${sz(c, 'head', 25)};--picto:${sz(c, 'picto', 74)}">
  <h1 class="mega${c.upper ? ' upper' : ''}">${c.headline.map(em).join('<br>')}</h1>
  <div class="pictos">
    <figure class="do">${roundel(c.fg, 'picto')}<figcaption class="label st">${tick()}${c.labels[0]}</figcaption></figure>
    <figure class="dont">${prohibition({ ring: c.ring, fig: c.fg, field: c.field })}<figcaption class="label">${c.labels[1]}</figcaption></figure>
  </div>
  <p class="body mid">${c.body}</p>
  <p class="polite mid">${txt(c.polite)}</p>
  ${foot(c, r)}
</div>`;
const CSS_PAIR = `
.pair { text-align: center; align-items: center; }
.pair .mega { font-size: var(--head-size); }
.pair .pictos { display: flex; gap: ${m(16)}; margin: ${m(8)} 0 ${m(7)}; }
.pair figure { display: flex; flex-direction: column; align-items: center; }
.pair .picto { width: var(--picto); }
.pair .label { margin-top: ${m(10)}; font-size: ${m(9)}; display: flex; align-items: center; gap: ${m(2.5)}; }
.pair .tick { width: ${m(9)}; height: ${m(9)}; display: block; }
.pair .body { font-size: ${m(12)}; }
.pair .polite { font-size: ${m(7.6)}; max-width: ${m(160)}; margin-top: ${m(4)}; }
`;

// "split": the wrong behaviour on red over the right one on green, each with its pictogram and
// a two-word headline, and the house line, the address and the code on the paper under them.
// Round 1's Concept C; dropped (both ideas on one sheet, neither leads).
const split = (c, r) => `<div class="page split">
  <div class="panel red" style="--field:${RED}">
    ${prohibition({ ring: PAPER, fig: PAPER, field: RED })}
    <h1 class="mega">${c.headline[0]}</h1>
  </div>
  <div class="panel green" style="--field:${GREEN}">
    ${roundel(PAPER, 'picto')}
    <h1 class="mega">${c.headline[1]}</h1>
  </div>
  <div class="foot">
    <div class="words"><p class="house mid">${br(c.body)}</p><p class="cta">${c.scan}</p><p class="addr">${r.text}</p></div>
    ${qrSvg(r)}
  </div>
</div>`;
const CSS_SPLIT = `
.split { position: static; inset: auto; flex: 1; }
.split .panel { flex: 1; background: var(--field); color: ${PAPER}; display: flex; align-items: center; gap: ${m(10)}; padding: ${m(10)} ${m(12)}; }
.split .panel .picto { width: ${m(78)}; }
.split .panel .mega { font-size: ${m(26)}; color: ${PAPER}; }
.split .foot { display: flex; align-items: flex-end; justify-content: space-between; gap: ${m(6)}; padding-top: ${m(6)}; margin-top: 0; color: ${BLACK}; }
.split .words { flex: 1; min-width: 0; }
.split .house { font-size: ${m(8)}; }
.split .words .cta { margin-top: ${m(4)}; }
.split .words .addr { margin-top: ${m(1.5)}; }
.split .qr { width: ${m(36)}; }
`;

const LAYOUTS = { notice, tap, pair, split };

// ---------- Sheets and documents ----------
const SIZES = { a4: [210, 297], a5: [148, 210] };
const sheet = (size, c) => {
  const [w, h] = SIZES[size];
  const inner = LAYOUTS[c.layout](c, ROUTES[c.route]);
  const field = c.layout === 'split'
    ? `<div class="page split-wrap" style="position:absolute;inset:${m(FRAME)};display:flex;flex-direction:column">${inner}</div>`
    : `<div class="field${c.isMono ? ' mono' : ''}" style="--field:${c.field};--fg:${c.fg};--head:${c.head}">${inner}</div>`;
  return `<div class="sheet" style="width:${w}mm;height:${h}mm;--mm:${(w / 210).toFixed(5)}mm">${field}</div>`;
};

const doc = (title, [w, h], body) =>
  `<!doctype html><html lang="${LANG}"><head><meta charset="utf-8"><title>${title}</title><style>@page { size: ${w}mm ${h}mm; margin: 0; }${CSS}${CSS_FOOT}${CSS_NOTICE}${CSS_TAP}${CSS_PAIR}${CSS_SPLIT}</style></head><body>${body}</body></html>`;

async function printPdf(name, title, size, body) {
  const html = path.join(tmp, `${name}.html`);
  const pdf = path.join(tmp, `${name}.pdf`);
  await writeFile(html, doc(title, size, body));
  chrome(['--no-pdf-header-footer', `--print-to-pdf=${pdf}`, `file://${html}`]);
  return { pdf, size, html };
}

const PT = 72 / 25.4;
async function publish(file, title, parts) {
  const out = await PDFDocument.create();
  for (const { pdf, size: [w, h] } of parts) {
    const src = await PDFDocument.load(await readFile(pdf));
    const pages = await out.copyPages(src, src.getPageIndices());
    for (const pg of pages) {
      const { width, height } = pg.getSize();
      pg.scaleContent((w * PT) / width, (h * PT) / height);
      pg.setSize(w * PT, h * PT);
      out.addPage(pg);
    }
  }
  out.setTitle(title);
  out.setAuthor(AUTHOR);
  out.setSubject('A pub notice: don’t queue at the bar, do The Cluster.');
  out.setLanguage(LANG);
  out.setCreator('scripts/build-posters.mjs');
  out.setProducer('Chromium and pdf-lib');
  const bytes = await out.save();
  await writeFile(path.join(dir, file), bytes);
  return { file, bytes: bytes.length };
}

// A 150 dpi PNG of the page (1240 x 1754 at A4, as the flyer reviews), a tenth-size thumbnail
// for the across-the-room read, and the ink figures: the share of the page that gets any ink
// (every pixel that isn't paper white) and the mean darkness, which is what a mono laser sees.
const DPI = 150;
async function preview(name, size, html) {
  const sharp = (await import('sharp')).default;
  const [wmm, hmm] = SIZES[size];
  const scale = DPI / 96;
  const [w, h] = [wmm, hmm].map((mm) => Math.round((mm / 25.4) * DPI));
  const shot = path.join(tmp, `${name}.png`);
  chrome([`--force-device-scale-factor=${scale}`, `--window-size=${Math.ceil(w / scale) + 1},${Math.ceil(h / scale) + 200}`, `--screenshot=${shot}`, `file://${html}`]);
  const page = sharp(shot).extract({ left: 0, top: 0, width: w, height: h });
  await page.clone().png({ palette: true, colours: 64, compressionLevel: 9 }).toFile(path.join(dir, `${name}.png`));
  await page.clone().resize({ width: Math.round(w / 10), height: Math.round(h / 10), fit: 'fill' }).png({ compressionLevel: 9 }).toFile(path.join(dir, `${name}-tenth.png`));
  const { data, info } = await page.clone().removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let inked = 0, dark = 0;
  const n = info.width * info.height;
  for (let i = 0; i < data.length; i += 3) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (r < 250 || g < 250 || b < 250) inked++;
    dark += 1 - (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }
  return { inked: inked / n, dark: dark / n };
}

try {
  let set = ROUND ? CONCEPTS.filter((c) => c.rounds.includes(Number(ROUND))) : CONCEPTS.filter((c) => c.final);
  if (ONLY.length) set = set.filter((c) => ONLY.includes(c.id));
  if (!set.length) throw new Error(ROUND ? `No concepts were rendered in round ${ROUND}.` : 'No concept is marked final.');
  set = set.flatMap((c) => (MONO || c.mono ? [c, mono(c)] : [c]));
  const rows = [];
  for (const c of set) {
    for (const size of SIZES_ARG ? SIZES_ARG.split(',') : c.paper || ['a4']) {
      const name = `${c.id}-${size}${TAG ? `-${TAG}` : ''}`;
      const part = await printPdf(name, `${c.title} (${size.toUpperCase()})`, SIZES[size], sheet(size, c));
      const { bytes } = await publish(`${name}.pdf`, `Don’t queue at the bar: ${c.title}`, [part]);
      const ink = await preview(name, size, part.html);
      rows.push({ name, bytes, ...ink });
    }
  }
  console.log(`Posters written to ${path.relative(root, dir)}/ (QR codes, level H: home -> ${ROUTES.home.url}, ${ROUTES.home.qr.modules.size} modules; test -> ${ROUTES.test.url}, ${ROUTES.test.qr.modules.size} modules)`);
  console.log(`  ${'file'.padEnd(30)} ${'pdf'.padStart(7)}  ${'inked'.padStart(6)}  ${'dark'.padStart(5)}`);
  for (const r of rows) console.log(`  ${(r.name + '.pdf').padEnd(30)} ${(r.bytes / 1024).toFixed(0).padStart(5)} KB  ${(r.inked * 100).toFixed(0).padStart(5)}%  ${(r.dark * 100).toFixed(0).padStart(4)}%`);
  console.log(HAVE_AVENIR ? 'Font: Avenir Next.' : 'Font: NOT Avenir Next (see the warning above). Judge layout, not letterforms.');
} finally {
  await rm(tmp, { recursive: true, force: true });
}
