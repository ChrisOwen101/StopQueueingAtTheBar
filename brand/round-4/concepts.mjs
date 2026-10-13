// Round 4 concepts: each is a drawing in a 400 x 400 box, one colour `c`, plus the
// wordmark lines for its lockup. Shared primitives first, then the concepts.
export const FONT = "'Avenir Next','Helvetica Neue','Segoe UI',Arial,sans-serif";

// A person seen from behind: head r25 over 68-wide shoulders, a 5 unit neck gap. (x,y) is the head centre.
export const fig = (x, y, s = 1) => `<g transform="translate(${x},${y}) scale(${s})"><circle r="25"/><path d="M-34,78 V64 a34,34 0 0 1 68,0 V78 Z"/></g>`;
export const ring = (c, r = 170, w = 30) => `<circle cx="200" cy="200" r="${r}" fill="none" stroke="${c}" stroke-width="${w}"/>`;
export const bar = (c, y = 214, h = 64, x = 0, w = 400) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
export const num = (c, x, y, n, size = 44, bg) => `${bg ? `<circle cx="${x}" cy="${y - size * 0.36}" r="${size * 0.62}" fill="${bg}"/>` : ''}<text x="${x}" y="${y}" font-family="${FONT}" font-weight="900" font-size="${size}" fill="${c}" text-anchor="middle">${n}</text>`;
export const tick = (c, x, y, s = 1, w = 16) => `<path d="M${x - 22 * s},${y} l${14 * s},${14 * s} l${30 * s},-${30 * s}" fill="none" stroke="${c}" stroke-width="${w * s}" stroke-linecap="round" stroke-linejoin="round"/>`;
export const cross = (c, x, y, s = 1, w = 16) => `<path d="M${x - 18 * s},${y - 18 * s} l${36 * s},${36 * s} M${x + 18 * s},${y - 18 * s} l-${36 * s},${36 * s}" fill="none" stroke="${c}" stroke-width="${w * s}" stroke-linecap="round"/>`;

export const CONCEPTS = [];
