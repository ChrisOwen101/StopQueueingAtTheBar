// Builds the alternative campaign posters in the pub-notice idiom (a flat colour field, a huge
// headline, one big flat pictogram, a dry line, a polite ask, the mark small in a corner), as
// PDF plus a PNG preview and a tenth-size thumbnail of each. An exploration beside the
// print-at-home flyers in scripts/build-flyers.mjs, which it is modelled on; the notes and every
// round's renders are in brand/final/review/posters/, and the decisions in brand/BRIEF.md
// ("Posters (notice family)").
//
//   node scripts/build-posters.mjs                 the final set -> brand/final/review/posters/final/
//   node scripts/build-posters.mjs --round 2       a round's set -> brand/final/review/posters/round-2/
//   --size a4,a5     paper sizes (default a4)
//   --only a,b       just these concept ids
//   --mono           also render each concept's black-on-white version (ids get -mono)
//   --out DIR        write somewhere else
//
// Each concept is one entry in CONCEPTS below (copy, field colour, layout, scan reason), so a
// round is a change to that array. Three layouts: "notice" (centred, the compliance sign),
// "tap" (headline stacked top left, the pictogram lower right), "split" (red panel over green).
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
const SIZES_ARG = arg('--size', null); // overrides every concept's `paper`
const ONLY = arg('--only', '').split(',').filter(Boolean);
const MONO = argv.includes('--mono'); // forces a mono of every concept
const TAG = arg('--tag', ''); // appended to every file name (the Arial check: POSTER_FONT=Arial --tag arial)

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
const br = (s) => s.replace(/\n/g, '<br>');

// ---------- Copy ----------
const HOUSE = 'This bar does The&nbsp;Cluster.';
const POLITE = 'We kindly ask that you spread out along the bar.\nThe bar staff know who’s&nbsp;next.';
const CODE = 'DQ/POS/BAR-001'; // the stock-code gag, in the register of the point-of-sale notice

// ---------- The concepts ----------
// Round 2 (14 Oct 2026): the family is a pair, the notice and the instruction poster; see
// brand/final/review/posters/round-1/decision.md. Round 1's six concepts are in that folder.
// field: the block colour. fg: text and marks on it (paper white). ring: the prohibition
// ring's colour where the layout has one. head: the headline colour. layout: notice | tap |
// split. upper: uppercase headline. sizes: {head, picto} in mm at A4. subWeight: the tap
// subhead's weight. scan: the reason beside the code. route: home (the petition) or test (the
// hazard perception test). paper: the sizes to render (default a4). mono: also render the
// black-on-white version.
const CONCEPTS = [
  {
    id: 'notice-ink',
    title: 'The notice, on ink',
    layout: 'notice',
    field: INK, fg: PAPER, head: AMBER, ring: RED,
    headline: ['NO QUEUEING', 'AT THE BAR'], upper: true,
    sizes: { head: 25 },
    body: HOUSE, polite: POLITE, code: CODE,
    scan: 'Sign the petition.', route: 'home',
    paper: ['a4', 'a5'], mono: true,
  },
  {
    id: 'notice-red',
    title: 'The notice, on red',
    layout: 'notice',
    field: RED, fg: PAPER, head: PAPER, ring: PAPER,
    headline: ['NO QUEUEING', 'AT THE BAR'], upper: true,
    sizes: { head: 25 },
    body: HOUSE, polite: POLITE, code: CODE,
    scan: 'Sign the petition.', route: 'home',
    paper: ['a4', 'a5'],
  },
  {
    id: 'poster-green',
    title: 'The instruction poster, on green',
    layout: 'tap',
    field: GREEN, fg: PAPER, head: PAPER,
    headline: ['SPREAD', 'OUT.'], upper: true,
    sizes: { head: 40 },
    sub: 'It’s a pub.\nNot a post office.', subWeight: 500,
    polite: 'Please don’t queue. Cheers.',
    scan: 'Sign the petition.', route: 'home',
    paper: ['a4', 'a5'], mono: true,
  },
  {
    id: 'poster-green-600',
    title: 'The instruction poster, on green, subhead at 600',
    layout: 'tap',
    field: GREEN, fg: PAPER, head: PAPER,
    headline: ['SPREAD', 'OUT.'], upper: true,
    sizes: { head: 40 },
    sub: 'It’s a pub.\nNot a post office.', subWeight: 600,
    polite: 'Please don’t queue. Cheers.',
    scan: 'Sign the petition.', route: 'home',
  },
  {
    id: 'poster-blue',
    title: 'The instruction poster, on blue (for comparison)',
    layout: 'tap',
    field: BLUE, fg: PAPER, head: PAPER,
    headline: ['SPREAD', 'OUT.'], upper: true,
    sizes: { head: 40 },
    sub: 'It’s a pub.\nNot a post office.', subWeight: 500,
    polite: 'Please don’t queue. Cheers.',
    scan: 'Sign the petition.', route: 'home',
  },
  {
    id: 'poster-gap',
    title: 'The instruction poster, "Find the gap" alternate',
    layout: 'tap',
    field: GREEN, fg: PAPER, head: PAPER,
    headline: ['FIND', 'THE', 'GAP.'], upper: true,
    sizes: { head: 32, picto: 80 },
    sub: 'Any gap.\nThe bar staff know who’s next.', subWeight: 500,
    polite: 'Please don’t queue. Cheers.',
    scan: 'Take the test.', route: 'test',
  },
];

// The black-on-white version of a concept for office printers: no field, black type and marks,
// a 1 mm black border where the field's edge was so it still reads as a sign.
const mono = (c) => ({
  ...c,
  id: `${c.id}-mono`,
  title: `${c.title} (mono)`,
  field: PAPER, fg: BLACK, head: BLACK, ring: BLACK,
  mono: true,
});

// ---------- Layout ----------
const FRAME = 8; // the white mount, mm at A4
const PAD = 12; // inside the field
const m = (n) => `calc(${n} * var(--mm))`;
const STACK = process.env.POSTER_FONT ? `'${process.env.POSTER_FONT}',${FONT}` : FONT;

const CSS = `
html, body { margin: 0; padding: 0; }
body { font-family: ${STACK}; color: ${BLACK}; background: ${PAPER}; }
.sheet { position: relative; overflow: hidden; break-after: page; background: ${PAPER}; }
.sheet:last-child { break-after: auto; }
.field { position: absolute; inset: ${m(FRAME)}; background: var(--field); color: var(--fg); }
.field.mono { outline: ${m(1)} solid ${BLACK}; outline-offset: ${m(-1)}; }
.page { position: absolute; inset: ${m(PAD)}; display: flex; flex-direction: column; }
p, h1, h2 { margin: 0; padding: 0; }
.mega { font-weight: 900; letter-spacing: -0.04em; line-height: 0.9; color: var(--head); }
.mega.upper { letter-spacing: -0.03em; line-height: 0.92; }
.mid { font-weight: 600; line-height: 1.25; }
.light { font-weight: 500; line-height: 1.2; }
.label { font-weight: 900; letter-spacing: 0.08em; text-transform: uppercase; line-height: 1; }
.picto, .roundel, .stamp, .qr { display: block; flex: none; }
.cta { font-weight: 900; font-size: ${m(8)}; letter-spacing: -0.02em; line-height: 1.05; }
.addr { font-weight: 600; font-size: ${m(7.6)}; line-height: 1.2; white-space: nowrap; }
.rule { border: 0; border-top: ${m(1)} solid var(--fg); margin: 0; }
`;

// Per-concept size overrides (mm at A4) for the headline and the pictogram.
const sz = (c, k, dflt) => m((c.sizes && c.sizes[k]) || dflt);

// "notice": the compliance sign. Centred: headline, the prohibition sign, the house line, the
// polite ask, then a footer strip under a rule: the roundel, the scan reason over the address
// (the flyer's foot) at left, the code at right, and the stock-code gag under the address if
// the concept has one.
const notice = (c, r) => `<div class="page notice" style="--head-size:${sz(c, 'head', c.upper ? 23 : 26)};--picto:${sz(c, 'picto', 104)}">
  <h1 class="mega${c.upper ? ' upper' : ''}">${c.headline.join('<br>')}</h1>
  ${prohibition({ ring: c.ring, fig: c.fg, field: c.field })}
  <p class="body mid">${c.body}</p>
  <p class="polite mid">${br(c.polite)}</p>
  <hr class="rule">
  <div class="foot">
    <div class="who">${roundel(c.fg)}<div><p class="cta">${c.scan}</p><p class="addr">${r.text}</p>${c.code ? `<p class="code label">${c.code}</p>` : ''}</div></div>
    ${qrSvg(r)}
  </div>
</div>`;
const CSS_NOTICE = `
.notice { text-align: center; align-items: center; }
.notice .mega { font-size: var(--head-size); }
.notice .picto { width: var(--picto); margin: ${m(8)} 0 ${m(7)}; }
.notice .body { font-size: ${m(12)}; }
.notice .polite { font-size: ${m(7.6)}; max-width: ${m(156)}; margin-top: ${m(4)}; }
.notice .rule { width: 100%; margin-top: auto; }
.notice .foot { width: 100%; display: flex; align-items: flex-end; justify-content: space-between; margin-top: ${m(5)}; text-align: left; }
.notice .who { display: flex; align-items: center; gap: ${m(5)}; }
.notice .roundel { width: ${m(18)}; }
.notice .addr { margin-top: ${m(1.5)}; }
.notice .code { font-size: ${m(6)}; margin-top: ${m(2.5)}; }
.notice .qr { width: ${m(36)}; }
`;

// "tap": the water poster's structure. The headline stacked top left, one word a line, a quiet
// subhead, the roundel as the pictogram lower right (it shows the right behaviour, so it is the
// picture and the mark at once: one roundel per sheet), and at the foot two columns: the polite
// line over a short rule, then the scan reason and the address at left; the code alone at
// right, where the reference keeps its mark. Four lines at left are the code's 36 mm.
const tap = (c, r) => `<div class="page tap" style="--head-size:${sz(c, 'head', c.upper ? 42 : 46)};--picto:${sz(c, 'picto', 96)};--sub-weight:${c.subWeight || 500}">
  <div class="top">
    <h1 class="mega${c.upper ? ' upper' : ''}">${c.headline.join('<br>')}</h1>
    <p class="sub">${br(c.sub)}</p>
  </div>
  ${roundel(c.fg, 'picto')}
  <div class="foot">
    <div class="words"><p class="polite mid">${br(c.polite)}</p><hr class="rule"><p class="cta">${c.scan}</p><p class="addr">${r.text}</p></div>
    ${qrSvg(r)}
  </div>
</div>`;
const CSS_TAP = `
.tap .top { text-align: left; }
.tap .mega { font-size: var(--head-size); }
.tap .sub { font-size: ${m(11)}; margin-top: ${m(8)}; font-weight: var(--sub-weight); line-height: 1.2; }
.tap .picto { width: var(--picto); align-self: flex-end; margin: auto 0 ${m(14)}; }
.tap .foot { display: flex; align-items: flex-end; justify-content: space-between; gap: ${m(6)}; }
.tap .polite { font-size: ${m(7.6)}; white-space: nowrap; }
.tap .words .rule { width: ${m(40)}; margin: ${m(3)} 0; }
.tap .words .addr { margin-top: ${m(1.5)}; }
.tap .qr { width: ${m(36)}; }
`;

// "split": the wrong behaviour on red over the right one on green, each with its pictogram and
// a two-word headline, and the house line, the address and the code on the paper under them.
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
.split .panel { flex: 1; background: var(--field); color: ${PAPER}; display: flex; align-items: center; gap: ${m(10)}; padding: ${m(10)} ${m(12)}; }
.split .panel .picto { width: ${m(78)}; }
.split .panel .mega { font-size: ${m(26)}; color: ${PAPER}; }
.split .foot { display: flex; align-items: flex-end; justify-content: space-between; gap: ${m(6)}; padding-top: ${m(6)}; color: ${BLACK}; }
.split .words { flex: 1; min-width: 0; }
.split .house { font-size: ${m(8)}; }
.split .words .cta { margin-top: ${m(4)}; }
.split .words .addr { margin-top: ${m(1.5)}; }
.split .qr { width: ${m(36)}; }
`;

const LAYOUTS = { notice, tap, split };

// ---------- Sheets and documents ----------
const SIZES = { a4: [210, 297], a5: [148, 210] };
const sheet = (size, c) => {
  const [w, h] = SIZES[size];
  const r = ROUTES[c.route];
  const inner = LAYOUTS[c.layout](c, r);
  const field = c.layout === 'split'
    ? `<div class="page split-wrap" style="position:absolute;inset:${m(FRAME)};display:flex;flex-direction:column">${inner}</div>`
    : `<div class="field${c.mono ? ' mono' : ''}" style="--field:${c.field};--fg:${c.fg};--head:${c.head}">${inner}</div>`;
  return `<div class="sheet" style="width:${w}mm;height:${h}mm;--mm:${(w / 210).toFixed(5)}mm">${field}</div>`;
};
// The split layout owns its own frame: its panels fill the field and the foot sits on the paper.
const CSS_SPLIT_WRAP = `
.split-wrap .split { position: static; inset: auto; flex: 1; }
`;

const doc = (title, [w, h], body) =>
  `<!doctype html><html lang="${LANG}"><head><meta charset="utf-8"><title>${title}</title><style>@page { size: ${w}mm ${h}mm; margin: 0; }${CSS}${CSS_NOTICE}${CSS_TAP}${CSS_SPLIT}${CSS_SPLIT_WRAP}</style></head><body>${body}</body></html>`;

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
  let set = ONLY.length ? CONCEPTS.filter((c) => ONLY.includes(c.id)) : CONCEPTS;
  set = set.flatMap((c) => (c.layout !== 'split' && (MONO || c.mono) ? [c, mono(c)] : [c]));
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
