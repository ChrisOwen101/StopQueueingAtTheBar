// Builds the beer mat artwork (one front, one back) as SVG.
// Run with: npm run build:mats
//
//   public/mats/mat-front.svg   front: the type stamp ("don’t queue / at the bar." in a ring)
//   public/mats/mat-back.svg    back: the Cluster roundel in the middle of a QR code to the
//                               home page, with the domain round the edge (reversed)
//
// Each file is a 107 mm round mat (400 x 400 viewBox, no bleed), black on white, as print
// artwork should be. The drawing is scripts/lib/brand.mjs, shared with brand/final/build.mjs,
// so this script is the one source of public/mats/. The usage rules are in brand/BRIEF.md.
// The site shows these same files, so what you see on the page is what gets printed.
//
// The QR code uses error correction level H (30% of it can be lost) because the roundel
// covers about a fifth of it. The address is SITE_URL in scripts/lib/site.mjs, shared with the
// flyers (or set SITE_URL in the env).
//
// PRINT NOTE: the text is live (Avenir Next). Before sending to a printer, convert it to
// outlines on a Mac, add the printer's bleed round the circle, and scan a printed proof of
// the back to check the code still reads.
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import QRCode from 'qrcode';
import { matFront, matBack } from './lib/brand.mjs';
import { SITE_URL, DOMAIN } from './lib/site.mjs';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'mats');
await mkdir(dir, { recursive: true });

const BLACK = '#000';
const WHITE = '#fff';

const qr = QRCode.create(SITE_URL, { errorCorrectionLevel: 'H' });
const out = (f, s) => writeFile(path.join(dir, f), s.trim() + '\n');

await out('mat-front.svg', matFront(BLACK, WHITE));
await out('mat-back.svg', matBack(qr, DOMAIN, BLACK, WHITE));

console.log(`Mats written to public/mats/ (QR -> ${SITE_URL}, ${qr.modules.size}x${qr.modules.size} modules, level H)`);
