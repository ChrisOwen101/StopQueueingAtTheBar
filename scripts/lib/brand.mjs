// The brand marks as SVG strings: the Corner roundel (the queue turning to lie along the
// bar), the lockups, the type stamp, the square icon and the beer mat. One drawing, three writers:
//   brand/final/build.mjs     the brand folder (black on white, plus the reversed set)
//   scripts/build-icons.mjs   public/mark.svg, public/lockup-horizontal.svg and the icons
//   scripts/build-mats.mjs    public/mats/ (print artwork)
// The rules for using them (one colour, clear space, minimum sizes) are in brand/BRIEF.md.
// Apostrophes in any words are typographic (’), as DESIGN.md requires.

export const FONT = "'Avenir Next','Helvetica Neue','Segoe UI',Arial,sans-serif";

// ---------- The mark, "The Corner": a queue of six heads that turns to lie along the bar ----------
// Geometry in a 400 x 400 box. Ring outer radius 185, stroke 30. Bar 64 tall, running the
// full width (the overhang is what makes it a roundel). Heads r 21 at a pitch of 52: three
// down (the single file) and four along the bar (the fix), the corner head shared, the top
// head 2 units clear of the ring and the row 3 units above the bar. At 16px the heads fuse
// into one solid L against the bar, which is the message. Chosen in brand/round-4 (13).
export const HEADS = [[134, 86], [134, 138], [134, 190], [186, 190], [238, 190], [290, 190]];
// The six heads alone, scaled about the centre of the box (the badge and the seals use s 0.55).
export const heads = (c, s = 1) => `<g fill="${c}">${HEADS.map(([x, y]) => `<circle cx="${(200 + (x - 200) * s).toFixed(1)}" cy="${(200 + (y - 200) * s).toFixed(1)}" r="${(21 * s).toFixed(1)}"/>`).join('')}</g>`;
export const markBody = (c) => `
  <circle cx="200" cy="200" r="170" fill="none" stroke="${c}" stroke-width="30"/>
  ${heads(c)}
  <rect x="0" y="214" width="400" height="64" fill="${c}"/>`;

// A person seen from behind (head r 25, shoulders 68 wide, a 5 unit neck gap), kept for the
// seals and the badge; the mark itself no longer uses it.
export const FIG = `<g id="fig"><circle cx="0" cy="0" r="25"/><path d="M-34,78 V64 a34,34 0 0 1 68,0 V78 Z"/></g>`;

export const MARK_LABEL = 'Queue Sideways: a queue of people turning to run along a bar, inside a ring';
export const mark = (c, bg) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-label="${MARK_LABEL}">
  <defs>${FIG}</defs>${bg ? `\n  <rect width="400" height="400" fill="${bg}"/>` : ''}${markBody(c)}
</svg>`;

// ---------- Lockups ----------
const TEXT = (c, x, y1, y2, size, anchor = 'start') => `
  <g font-family="${FONT}" font-weight="900" font-size="${size}" fill="${c}" letter-spacing="${-size * 0.04}" text-anchor="${anchor}">
    <text x="${x}" y="${y1}">queue</text>
    <text x="${x}" y="${y2}">sideways.</text>
  </g>`;

export const horizontal = (c, bg) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1420 400" role="img" aria-label="Queue sideways.">
  <defs>${FIG}</defs>${bg ? `\n  <rect width="1420" height="400" fill="${bg}"/>` : ''}
  <g>${markBody(c)}</g>${TEXT(c, 452, 188, 336, 160)}
</svg>`;

export const stacked = (c, bg) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 760" role="img" aria-label="Queue sideways.">
  <defs>${FIG}</defs>${bg ? `\n  <rect width="960" height="760" fill="${bg}"/>` : ''}
  <g transform="translate(280,0)">${markBody(c)}</g>${TEXT(c, 480, 572, 712, 150, 'middle')}
</svg>`;

// ---------- Square icon (Stripe, favicon, app icon) ----------
// The 400 box sits 56 in from every side of the 512 square, which keeps the mark inside
// the 80% safe zone (r 204.8) that maskable icons and round avatars crop to.
export const square = (c, bg) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Queue Sideways">
  <defs>${FIG}</defs>
  <rect width="512" height="512" fill="${bg}"/>
  <g transform="translate(56,56)">${markBody(c)}</g>
</svg>`;

// ---------- The stamp: the wordmark in a ring, with the tagline's short form ----------
export const stamp = (c, bg) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-label="queue sideways. they know who’s next.">${bg ? `\n  <circle cx="200" cy="200" r="200" fill="${bg}"/>` : ''}
  <circle cx="200" cy="200" r="184" fill="none" stroke="${c}" stroke-width="24"/>
  <g font-family="${FONT}" font-weight="900" fill="${c}" text-anchor="middle" letter-spacing="-3">
    <text x="200" y="176" font-size="88">queue</text>
    <text x="200" y="236" font-size="56" letter-spacing="-2">sideways.</text>
    <text x="200" y="280" font-size="22" font-weight="700" letter-spacing="0">they know who’s next.</text>
  </g>
</svg>`;

// ---------- QR code: the dark modules as one path, merging runs along each row ----------
export function qrPath(qr) {
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

// ---------- Beer mat: two sides, 107 mm round, no bleed ----------
// Front: the stamp. Back: the roundel in the middle of a level-H QR code to the home
// page, the domain round the edge, reversed. `qr` is QRCode.create(url, { errorCorrectionLevel: 'H' }).
// `logo` is the mark's width in mat units and `quiet` the code's quiet zone in modules.
const MAT = 'viewBox="0 0 400 400" width="107mm" height="107mm"';

export const matFront = (c, bg) => stamp(c, bg).replace('viewBox="0 0 400 400"', MAT);

export function matBack(qr, domain, c, bg, { logo = 64, quiet = 2 } = {}) {
  const { p: qrD, size: qrSize } = qrPath(qr);
  const PANEL = 224, QUIET = quiet, mod = PANEL / (qrSize + QUIET * 2);
  const panelX = 200 - PANEL / 2, codeX = panelX + QUIET * mod;
  const RING_R = 168;
  const ring = `M ${200 - RING_R},200 A ${RING_R},${RING_R} 0 1 1 ${200 + RING_R},200 A ${RING_R},${RING_R} 0 1 1 ${200 - RING_R},200`;
  const circ = 2 * Math.PI * RING_R;
  const ringText = `${domain}   ●   they know who’s next   ●   `;
  // The mark in the middle of the code, on a tile of the paper colour with the mark's clear
  // space (an eighth of its width) round it. Level H can lose 30% of its codewords in theory,
  // but jsQR and zxing-cpp both stop reading this code once the tile covers about 18% of
  // it, so the default keeps the tile at 16% (a 64 unit mark is 17 mm on the mat). AGENTS.md
  // ("Beer mats") says how to re-test the decode after changing it.
  const LOGO = logo, TILE = LOGO + LOGO / 4;
  return `
<svg xmlns="http://www.w3.org/2000/svg" ${MAT} role="img" aria-label="Beer mat back: scan the code or visit ${domain}">
  <defs>${FIG}<path id="ring" d="${ring}"/></defs>
  <circle cx="200" cy="200" r="200" fill="${c}"/>
  <circle cx="200" cy="200" r="190" fill="none" stroke="${bg}" stroke-width="3"/>
  <text font-family="${FONT}" font-size="23" font-weight="900" fill="${bg}" xml:space="preserve"><textPath href="#ring" textLength="${(circ - 6).toFixed(1)}" lengthAdjust="spacing">${ringText}</textPath></text>
  <rect x="${panelX}" y="${panelX}" width="${PANEL}" height="${PANEL}" rx="14" fill="${bg}"/>
  <path transform="translate(${codeX} ${codeX}) scale(${mod})" d="${qrD}" fill="${c}" shape-rendering="crispEdges"/>
  <rect x="${200 - TILE / 2}" y="${200 - TILE / 2}" width="${TILE}" height="${TILE}" rx="10" fill="${bg}"/>
  <g transform="translate(${200 - LOGO / 2} ${200 - LOGO / 2}) scale(${LOGO / 400})">${markBody(c)}</g>
</svg>`;
}
