// Builds the square logo, favicons, app icons and social share images from
// public/logo-side.svg. Run with: npm run build:icons
//
// Needs Google Chrome (the badge uses <textPath>, which librsvg/sharp can't draw)
// and sharp (already installed via wrangler). Set CHROME_PATH to override Chrome.
//
// Outputs (all in public/):
//   logo-square.svg / favicon.svg   square logo, badge on amber, inside the maskable safe zone
//   favicon.ico, favicon-32.png     browser tabs
//   apple-touch-icon.png            180x180 (iOS)
//   icon-192.png, icon-512.png      web app manifest icons (also maskable-safe)
//   og-image.png                    1200x630 link preview (Facebook, X, LinkedIn, WhatsApp, Slack...)
//   og-image-square.png             1200x1200 for platforms that prefer square cards
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const pub = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const out = (f) => path.join(pub, f);

const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const INK = '#16161d';
const CREAM = '#fff4dc';
const AMBER = '#ffb627';
const FONT = "'Avenir Next','Helvetica Neue','Segoe UI',Arial,sans-serif";

const tmp = await mkdtemp(path.join(tmpdir(), 'dqatb-'));

// Render an SVG string to a PNG with headless Chrome at exactly w x h.
async function render(svg, w, h, file) {
  const html = path.join(tmp, 'page.html');
  await writeFile(
    html,
    `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:${AMBER}}svg{display:block;width:${w}px;height:${h}px}</style>${svg}`
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

// Pull the artwork out of the existing badge (drop the <svg> wrapper and <title>).
const source = await readFile(out('logo-side.svg'), 'utf8');
const badge = source
  .replace(/<svg[^>]*>/, '')
  .replace(/<\/svg>\s*$/, '')
  .replace(/<title[^>]*>.*?<\/title>/s, '');

// Badge is 400x400. In a 512 square, 400px gives a 200px radius, which sits inside
// the 80% "safe zone" circle (r = 204.8) used by maskable icons and round avatars.
const squareSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" role="img" aria-labelledby="t">
  <title id="t">Don't Queue At The Bar</title>
  <rect width="512" height="512" fill="${AMBER}"/>
  <g transform="translate(56 56)">${badge}</g>
</svg>
`;
await writeFile(out('logo-square.svg'), squareSvg);
await writeFile(out('favicon.svg'), squareSvg);

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

  // Social share images.
  const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="${AMBER}"/>
  <g transform="translate(60 75) scale(1.2)">${badge}</g>
  <g font-family="${FONT}" font-weight="900" fill="${INK}">
    <text x="590" y="270" font-size="92" letter-spacing="-2">don't queue</text>
    <text x="590" y="365" font-size="92" letter-spacing="-2">at the bar.</text>
    <text x="592" y="440" font-size="38" font-weight="700">a bar is not a post office.</text>
  </g>
  <rect x="590" y="480" width="540" height="64" rx="32" fill="${INK}"/>
  <text x="860" y="523" font-family="${FONT}" font-weight="800" font-size="27" fill="${CREAM}" text-anchor="middle">spread out · catch the eye</text>
</svg>`;
  await render(ogSvg, 1200, 630, out('og-image.png'));

  const ogSquareSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="1200" height="1200">
  <rect width="1200" height="1200" fill="${AMBER}"/>
  <g transform="translate(250 90) scale(1.75)">${badge}</g>
  <g font-family="${FONT}" font-weight="900" fill="${INK}" text-anchor="middle">
    <text x="600" y="940" font-size="96" letter-spacing="-2">don't queue at the bar.</text>
    <text x="600" y="1030" font-size="48" font-weight="700">a bar is not a post office.</text>
  </g>
</svg>`;
  await render(ogSquareSvg, 1200, 1200, out('og-image-square.png'));
} finally {
  await rm(tmp, { recursive: true, force: true });
}

console.log('Icons and share images written to public/');
