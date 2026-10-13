// Builds the print-at-home campaign flyers as PDF, plus a PNG preview of each face.
// Run with: npm run build:flyers
//
//   public/flyers/flyer-a4.pdf          one page, Face A (the poster)
//   public/flyers/flyer-a4-double.pdf   two pages, Face A then Face B (the how-to)
//   public/flyers/flyer-a5.pdf          the same at A5
//   public/flyers/flyer-a5-double.pdf
//   public/flyers/flyer-a5-two-up.pdf   two A5 Face As on one A4 sheet, with a faint cut mark
//   public/flyers/preview-a.png         Face A for the web page
//   public/flyers/preview-b.png         Face B for the web page
//
// Each face is an HTML page at the exact paper size (A4 210 x 297 mm, A5 148 x 210 mm), no
// bleed, everything inside a safe margin because home printers can't print to the edge: 10 mm
// at A4, 7 mm at A5, because the A5 is the A4 layout scaled by 148/210 (every length in the CSS
// is a multiple of --mm). Nothing read on its own is under 2.5 mm x-height at A5 in Avenir Next
// (the address, the kicker, the tag, the scan lines); running text is 7 mm type at A4 (2.3 mm
// x-height at A5), the most the how-to's copy allows.
// Headless Chrome prints each page to PDF (vector, with a subset of the fonts it used), then
// pdf-lib joins the double-sided files and sets the title, author and language. The marks come
// from scripts/lib/brand.mjs; the rules for using them, and the design decisions behind these
// flyers, are in brand/BRIEF.md ("Flyers").
//
// FONT: the type is the site's stack (FONT in brand.mjs, Avenir Next first). Chrome embeds
// whatever the stack resolves to on the machine running this, so the PDFs are only right when
// built on a Mac with Avenir Next. Anywhere else the script still works, in the fallback font,
// and warns loudly. Rebuild on a Mac and commit public/flyers/ before the site is promoted.
//
// The QR codes are level H, like the beer mats. The poster's goes to the home page, the same
// address as the mats (SITE_URL in scripts/lib/site.mjs, dontqueueatthebar.co.uk; set SITE_URL
// in the env to override); the how-to's goes straight to the hazard perception test, /hazard,
// which is what its "Take the test" line promises. The written address under both is the bare
// domain. The domain must be pointed at the Worker before a flyer is printed, and the flyers
// must be rebuilt if the address ever changes.
//
// CHROME_PATH overrides the browser (any Chromium works). On a Mac the default is Google Chrome.
// For design reviews only: FLYER_FONT puts a family in front of the stack (FLYER_FONT=Arial
// checks the layout survives other metrics) and FLYER_OUT writes somewhere other than
// public/flyers/. Neither belongs in a real build.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import QRCode from 'qrcode';
import { PDFDocument } from 'pdf-lib';
import { FIG, FONT, markBody, stamp, qrPath } from './lib/brand.mjs';
import { SITE_URL, DOMAIN } from './lib/site.mjs';
const AUTHOR = 'Don’t Queue At The Bar';
const LANG = 'en-GB';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = process.env.FLYER_OUT ? path.resolve(process.env.FLYER_OUT) : path.join(root, 'public', 'flyers');
const STACK = process.env.FLYER_FONT ? `'${process.env.FLYER_FONT}',${FONT}` : FONT;
await mkdir(dir, { recursive: true });

// ---------- The browser ----------
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

const tmp = await mkdtemp(path.join(tmpdir(), 'dqatb-flyers-'));

// ---------- Which font will the stack give us? ----------
// A family is present when text set in it measures differently from the monospace fallback.
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
      '\n!!  Avenir Next is not installed here. The flyers are being set in the fallback\n' +
      `!!  (${fonts[0] ? `"${fonts[0]}" as this machine resolves it` : 'the system sans-serif'}). Run npm run build:flyers on a Mac with\n` +
      '!!  Avenir Next and commit public/flyers/ before the site is promoted.\n' +
      '!'.repeat(78) +
      '\n'
  );
}

// ---------- The artwork ----------
// The two destinations: the poster's code sends people to the home page (the petition), the
// how-to's straight to the test. The written address is the bare domain on both faces: it is
// the fallback, and the home page links to the test anyway, so it stays one short line.
const TEST_URL = new URL('hazard', SITE_URL).href;
const HOME = { url: SITE_URL, text: DOMAIN, qr: QRCode.create(SITE_URL, { errorCorrectionLevel: 'H' }) };
const TEST = { url: TEST_URL, text: DOMAIN, qr: QRCode.create(TEST_URL, { errorCorrectionLevel: 'H' }) };
const QUIET = 4; // modules of quiet zone, the spec's minimum
// A plain code (the mat back's roundel tile was tried and dropped: a mono laser plus a
// photocopy eats both the roundel and the error correction it costs).
const qrSvg = ({ qr, text }) => {
  const { p, size } = qrPath(qr);
  const N = size + QUIET * 2;
  return `<svg class="qr" viewBox="0 0 ${N} ${N}" role="img" aria-label="QR code to ${text}"><rect width="${N}" height="${N}" fill="#fff"/><path transform="translate(${QUIET} ${QUIET})" d="${p}" fill="#000" shape-rendering="crispEdges"/></svg>`;
};
const roundel = () => `<svg class="roundel" viewBox="0 0 400 400" aria-hidden="true"><defs>${FIG}</defs>${markBody('#000')}</svg>`;
const stampSvg = () => stamp('#000').replace('<svg ', '<svg class="stamp" ');

const STEPS = [
  ['Walk to the bar.', 'Not behind someone. To the bar. It’s the long wooden thing.'],
  ['Pick a gap.', 'Any gap. Leave some elbow room. This is not a cuddle.'],
  ['Catch an eye.', 'A nod. A raised eyebrow. A tenner held with quiet confidence. No waving. No clicking.'],
  ['Trust the barperson.', 'They know who’s next. They always know. It’s their entire job.'],
];

// Every length is N * var(--mm): 1mm on A4, 148/210 mm on A5, so one layout serves both.
const m = (n) => `calc(${n} * var(--mm))`;

const CSS = `
html, body { margin: 0; padding: 0; }
body { font-family: ${STACK}; color: #000; background: #fff; }
.sheet { position: relative; overflow: hidden; break-after: page; }
.sheet:last-child { break-after: auto; }
.page { position: absolute; inset: ${m(10)}; display: flex; flex-direction: column; }
p, h1, h2, ol, li { margin: 0; padding: 0; }
.mega { font-weight: 900; letter-spacing: -0.04em; line-height: 0.92; text-transform: lowercase; }
.mid { font-weight: 600; line-height: 1.25; }
.small { font-weight: 500; letter-spacing: 0.08em; text-transform: lowercase; }
.tag { display: inline-block; padding: 0.45em 1.1em; border: ${m(1)} solid #000; border-radius: 999px; font-weight: 900; letter-spacing: 0.08em; text-transform: uppercase; rotate: -3deg; font-size: ${m(6.4)}; line-height: 1; white-space: nowrap; }
.roundel, .stamp, .qr { display: block; flex: none; }
.foot { margin-top: auto; display: flex; align-items: flex-end; justify-content: space-between; gap: ${m(6)}; }
.scan { display: flex; align-items: flex-end; gap: ${m(5)}; }
.cta { font-weight: 900; font-size: ${m(8)}; letter-spacing: -0.02em; line-height: 1.05; }
.addr { font-weight: 600; font-size: ${m(7.6)}; line-height: 1.2; white-space: nowrap; margin-top: ${m(2)}; }
`;

// The address written out: the QR is the route, this is the fallback. 7.6 mm type at A4 so its
// x-height clears 2.5 mm at A5 in Avenir Next. One line; an address with a path would break
// after the slash, and a very long bare domain after its first dot.
const address = ({ text }) => {
  const slash = text.indexOf('/');
  if (slash > 0) return `${text.slice(0, slash + 1)}<br>${text.slice(slash + 1)}`;
  const dot = text.indexOf('.');
  return dot > 0 && text.length > 28 ? `${text.slice(0, dot + 1)}<br>${text.slice(dot + 1)}` : text;
};

// ---------- Face A: the poster ----------
// Read from across the room, in this order: the stamp (it leads, per the brief), "spread out."
// (the instruction), the house line (the pub's permission and the reassurance). One roundel,
// at the foot beside the petition line; the QR is plain so a mono laser and a photocopy keep it.
const faceA = () => `<div class="page face-a">
  <div class="top">
    ${stampSvg()}
    <h1 class="spread mega">spread out.</h1>
    <p class="house mid">This bar does The&nbsp;Cluster.<br>The bar staff know who’s&nbsp;next.<br>They always did.</p>
  </div>
  <div class="foot">
    <div class="who">${roundel()}<div><p class="cta">Sign the petition.</p><p class="addr">${address(HOME)}</p></div></div>
    ${qrSvg(HOME)}
  </div>
</div>`;
const CSS_A = `
.face-a .top { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding-bottom: ${m(6)}; }
.face-a .stamp { width: ${m(120)}; }
.face-a .spread { font-size: ${m(30)}; margin-top: ${m(17)}; }
.face-a .house { font-size: ${m(11)}; margin-top: ${m(7)}; white-space: nowrap; }
.face-a .qr { width: ${m(36)}; }
.face-a .roundel { width: ${m(20)}; }
.face-a .who { display: flex; align-items: center; gap: ${m(5)}; }
`;

// ---------- Face B: the how-to ----------
// Read in the hand: the four steps, then the worked example with its caveat, then the test.
// The stamp signs it bottom right (30 mm here, 21 mm at A5, above the 18 mm minimum).
const faceB = () => `<div class="page face-b">
  <p class="kicker mid">This bar does The&nbsp;Cluster. Here’s how.</p>
  <h1 class="h mega">Four easy steps.</h1>
  <ol class="steps">${STEPS.map(([t, d], i) => `<li class="step"><span class="n">${i + 1}</span><div><p class="t">${t}</p><p class="d mid">${d}</p></div></li>`).join('')}</ol>
  <div class="maths">
    <p class="tag">worked example</p>
    <p class="mh mega">25 minutes. Or six.</p>
    <p class="ms mid">Twenty orders, 75&nbsp;seconds each. One spot on the bar, or four staff along it.</p>
    <p class="mc mid">Arithmetic, not a stopwatch. Real pubs are messier.</p>
  </div>
  <div class="foot">
    <div class="who">${qrSvg(TEST)}<div><p class="cta">Think you’re ready?<br>Take the test.</p><p class="addr">${address(TEST)}</p></div></div>
    ${stampSvg()}
  </div>
</div>`;
const CSS_B = `
.face-b .kicker { font-size: ${m(7.6)}; }
.face-b .h { font-size: ${m(22)}; margin-top: ${m(1)}; }
.face-b .steps { list-style: none; flex: 1; display: grid; align-content: space-evenly; gap: ${m(3)}; margin: ${m(3)} 0; }
.face-b .step { display: grid; grid-template-columns: ${m(22)} 1fr; align-items: baseline; }
.face-b .n { font-weight: 900; font-size: ${m(12)}; line-height: 1; letter-spacing: -0.04em; }
.face-b .t { font-weight: 900; font-size: ${m(10)}; letter-spacing: -0.04em; line-height: 1; text-transform: lowercase; }
.face-b .d { font-size: ${m(7)}; line-height: 1.25; margin-top: ${m(1.5)}; }
.face-b .maths { position: relative; padding-top: ${m(10)}; border-top: ${m(2)} solid #000; margin-bottom: ${m(5)}; }
.face-b .maths .tag { position: absolute; right: 0; top: ${m(-8)}; background: #fff; }
.face-b .mh { font-size: ${m(13)}; white-space: nowrap; }
.face-b .ms { font-size: ${m(7)}; line-height: 1.25; margin-top: ${m(3)}; }
.face-b .mc { font-size: ${m(7)}; line-height: 1.25; margin-top: ${m(2)}; }
.face-b .qr { width: ${m(36)}; }
.face-b .stamp { width: ${m(30)}; }
.face-b .who { display: flex; align-items: flex-end; gap: ${m(5)}; }
`;

// ---------- Sheets and documents ----------
const SIZES = { a4: [210, 297], a5: [148, 210] };
const sheet = (size, face) => {
  const [w, h] = SIZES[size];
  return `<div class="sheet" style="width:${w}mm;height:${h}mm;--mm:${(w / 210).toFixed(5)}mm">${face()}</div>`;
};
// Two A5 Face As side by side on an A4 landscape sheet, a faint cut mark between them: black
// (one ink, no tint), 0.2 mm, 2 mm dashes with 3 mm gaps, kept 10 mm off the top and bottom.
const twoUp = () => {
  const half = `<div class="half" style="width:148.5mm;height:210mm;--mm:${(148 / 210).toFixed(5)}mm">${faceA()}</div>`;
  return `<div class="sheet two-up" style="width:297mm;height:210mm">${half}${half}<div class="cut" aria-hidden="true"></div></div>`;
};
const CSS_TWO_UP = `
.two-up { display: flex; }
.two-up .half { position: relative; }
.two-up .cut { position: absolute; left: 148.4mm; top: 10mm; bottom: 10mm; width: 0.2mm; background: repeating-linear-gradient(to bottom, #000 0 2mm, transparent 2mm 5mm); }
`;

const doc = (title, [w, h], body) =>
  `<!doctype html><html lang="${LANG}"><head><meta charset="utf-8"><title>${title}</title><style>@page { size: ${w}mm ${h}mm; margin: 0; }${CSS}${CSS_A}${CSS_B}${CSS_TWO_UP}</style></head><body>${body}</body></html>`;

async function printPdf(name, title, size, body) {
  const html = path.join(tmp, `${name}.html`);
  const pdf = path.join(tmp, `${name}.pdf`);
  await writeFile(html, doc(title, size, body));
  chrome(['--no-pdf-header-footer', `--print-to-pdf=${pdf}`, `file://${html}`]);
  return { pdf, size };
}

// Joins the given single-page PDFs into one file in public/flyers/ with the metadata set.
// Chrome rounds the page box to its own units (A4 comes out 594.96 x 841.92 pt, not 595.28 x
// 841.89), so each page is set to the exact paper size and its content scaled by the ratio.
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
  out.setSubject('A print-at-home flyer for pubs: don’t queue at the bar, do The Cluster.');
  out.setLanguage(LANG);
  out.setCreator('scripts/build-flyers.mjs');
  out.setProducer('Chromium and pdf-lib');
  const bytes = await out.save();
  await writeFile(path.join(dir, file), bytes);
  return { file, pages: out.getPageCount(), bytes: bytes.length };
}

// A preview PNG of one face: the A4 page screenshotted at 1.5x (1191 x 1684 px). Chrome's
// window-size includes space it keeps for its own frame, so the window is taller than the page
// and the shot is cropped to the page with sharp (installed with wrangler), which also puts the
// black-on-white page on a palette for a fraction of the size.
const SCALE = 1.5;
async function preview(name, face) {
  const html = path.join(tmp, `${name}.html`);
  const shot = path.join(tmp, `${name}.png`);
  const png = path.join(dir, `${name}.png`);
  const [w, h] = SIZES.a4.map((mm) => Math.round((mm / 25.4) * 96 * SCALE));
  await writeFile(html, doc(name, SIZES.a4, `<div class="sheet" style="width:210mm;height:297mm;--mm:1mm">${face()}</div>`));
  chrome([`--force-device-scale-factor=${SCALE}`, `--window-size=${Math.ceil(w / SCALE) + 1},${Math.ceil(h / SCALE) + 200}`, `--screenshot=${shot}`, `file://${html}`]);
  const sharp = (await import('sharp')).default;
  const buf = await sharp(shot).extract({ left: 0, top: 0, width: w, height: h }).png({ palette: true, colours: 32, compressionLevel: 9 }).toBuffer();
  await writeFile(png, buf);
  return png;
}

try {
  const a4a = await printPdf('a4-a', 'Don’t queue at the bar (A4 poster)', SIZES.a4, sheet('a4', faceA));
  const a4b = await printPdf('a4-b', 'How to do The Cluster (A4)', SIZES.a4, sheet('a4', faceB));
  const a5a = await printPdf('a5-a', 'Don’t queue at the bar (A5 poster)', SIZES.a5, sheet('a5', faceA));
  const a5b = await printPdf('a5-b', 'How to do The Cluster (A5)', SIZES.a5, sheet('a5', faceB));
  const two = await printPdf('a5-two-up', 'Don’t queue at the bar (two A5 posters on A4)', [297, 210], twoUp());

  const results = [
    await publish('flyer-a4.pdf', 'Don’t queue at the bar: A4 poster', [a4a]),
    await publish('flyer-a4-double.pdf', 'Don’t queue at the bar: A4 poster and how-to', [a4a, a4b]),
    await publish('flyer-a5.pdf', 'Don’t queue at the bar: A5 poster', [a5a]),
    await publish('flyer-a5-double.pdf', 'Don’t queue at the bar: A5 poster and how-to', [a5a, a5b]),
    await publish('flyer-a5-two-up.pdf', 'Don’t queue at the bar: two A5 posters on one A4 sheet', [two]),
  ];
  await preview('preview-a', faceA);
  await preview('preview-b', faceB);

  console.log(`Flyers written to ${path.relative(root, dir) || '.'}/ (QR codes, level H: poster -> ${HOME.url}, ${HOME.qr.modules.size} modules; how-to -> ${TEST.url}, ${TEST.qr.modules.size} modules)`);
  for (const r of results) console.log(`  ${r.file.padEnd(24)} ${r.pages} page${r.pages > 1 ? 's' : ''}  ${(r.bytes / 1024).toFixed(0)} KB`);
  for (const f of ['preview-a.png', 'preview-b.png']) console.log(`  ${f.padEnd(24)} ${((await stat(path.join(dir, f))).size / 1024).toFixed(0)} KB`);
  console.log(HAVE_AVENIR ? 'Font: Avenir Next.' : `Font: NOT Avenir Next (see the warning above). Rebuild on a Mac before promoting.`);
} finally {
  await rm(tmp, { recursive: true, force: true });
}
