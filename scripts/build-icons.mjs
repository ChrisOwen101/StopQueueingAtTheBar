// Builds the site's copies of the brand marks, the favicons and app icons, and (on a Mac)
// the social share images. Run with: npm run build:icons
//
// The marks are drawn by scripts/lib/brand.mjs (shared with brand/final/build.mjs and
// scripts/build-mats.mjs); the usage rules are in brand/BRIEF.md. The icons are the Cluster
// roundel in ink on a cream square, the only colours the mark takes on the site.
//
// Written first, with no browser needed (all in public/):
//   mark.svg                      the roundel in ink, the source of everything below
//   lockup-horizontal.svg         the roundel beside "don’t queue / at the bar." (the homepage, top left)
//   logo-square.svg / favicon.svg the roundel on a cream 512 square, inside the maskable safe zone
// Rendered with headless Chrome, then resized with sharp (installed via wrangler). Set
// CHROME_PATH to use another Chromium:
//   icon-512.png, icon-192.png    web app manifest icons (also maskable-safe)
//   apple-touch-icon.png          180x180 (iOS)
//   favicon-32.png, favicon.ico   browser tabs (the .ico holds 16, 32 and 48 px)
// Only with --og, and only on a Mac with Avenir Next installed, because they carry live text
// and any other machine renders it in a fallback font:
//   og-image.png                  1200x630 link preview (Facebook, X, LinkedIn, WhatsApp, Slack...)
//   og-image-square.png           1200x1200 for platforms that prefer square cards
// After rebuilding the share images, update the og:image:alt and twitter:image:alt text in
// public/index.html to describe them.
import { execFileSync } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import { FONT, mark, horizontal, stacked, square } from './lib/brand.mjs';

const pub = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const out = (f) => path.join(pub, f);
const write = (f, s) => writeFile(out(f), s.trim() + '\n');

const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const INK = '#16161d';
const CREAM = '#fff4dc';
const OG = process.argv.includes('--og');

// The marks the pages use.
await write('mark.svg', mark(INK));
await write('lockup-horizontal.svg', horizontal(INK));

// The square icon: the mark's 400 box sits 56 in from every side of the 512 square, so its
// ring stays inside the 80% safe zone (r 204.8) that maskable icons and round avatars crop to.
const squareSvg = square(INK, CREAM);
await write('logo-square.svg', squareSvg);
await write('favicon.svg', squareSvg);

const tmp = await mkdtemp(path.join(tmpdir(), 'dqatb-'));

// Render an SVG string to a PNG with headless Chrome at exactly w x h.
async function render(svg, w, h, file) {
  const html = path.join(tmp, 'page.html');
  await writeFile(
    html,
    `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:${CREAM}}svg{display:block;width:${w}px;height:${h}px}</style>${svg}`
  );
  execFileSync(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      `--window-size=${w},${h}`,
      `--screenshot=${file}`,
      `file://${html}`,
    ],
    { stdio: 'ignore' }
  );
}

try {
  await render(squareSvg, 512, 512, out('icon-512.png'));

  const resize = (size) =>
    sharp(out('icon-512.png')).resize(size, size, { kernel: 'lanczos3' }).png({ compressionLevel: 9 });
  await resize(192).toFile(out('icon-192.png'));
  await resize(180).toFile(out('apple-touch-icon.png'));
  await resize(32).toFile(out('favicon-32.png'));

  // favicon.ico: PNG-compressed 16, 32 and 48 px images in one ICO container.
  const sizes = [16, 32, 48];
  const images = await Promise.all(sizes.map((s) => resize(s).toBuffer()));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map((img, i) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(sizes[i], 0);
    e.writeUInt8(sizes[i], 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(img.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += img.length;
    return e;
  });
  await writeFile(out('favicon.ico'), Buffer.concat([header, ...entries, ...images]));

  if (OG) {
    // Social share images: the lockup in ink on cream, with the tagline under it.
    const inner = (svg) => svg.replace(/<svg[^>]*>|<\/svg>/g, '');
    const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="${CREAM}"/>
  <g transform="translate(90 96) scale(0.72)">${inner(horizontal(INK))}</g>
  <text x="600" y="500" font-family="${FONT}" font-weight="600" font-size="52" fill="${INK}" text-anchor="middle">It’s a pub. Not a post office.</text>
</svg>`;
    await render(ogSvg, 1200, 630, out('og-image.png'));

    const ogSquareSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="1200" height="1200">
  <rect width="1200" height="1200" fill="${CREAM}"/>
  <g transform="translate(120 150) scale(1)">${inner(stacked(INK))}</g>
  <text x="600" y="1040" font-family="${FONT}" font-weight="600" font-size="56" fill="${INK}" text-anchor="middle">It’s a pub. Not a post office.</text>
</svg>`;
    await render(ogSquareSvg, 1200, 1200, out('og-image-square.png'));
  }
} finally {
  await rm(tmp, { recursive: true, force: true });
}

console.log(`Marks and icons written to public/${OG ? ', with the share images' : ' (share images skipped: pass --og on a Mac with Avenir Next)'}`);
