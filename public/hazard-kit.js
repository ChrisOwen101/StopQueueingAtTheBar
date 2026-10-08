/* Hazard test illustration kit ("Public Information Cartoon"). Styles: hazard-kit.css.
   HazardKit.build(root, clips) runs before HazardTest.init. For each .hpt-shot it wraps
   the set in a camera, turns .hk-person placeholders into inline SVG figures from the
   cast below, and compiles every data-act / data-on / data-pan script into @keyframes
   (percentages from the clip's dur), so the player can seek everything. Nothing runs
   after build: no timers, no rAF, no transitions. Authoring reference: AGENTS.md. */
(() => {
  const SKIN = { a: '#ffdbac', b: '#f1c27d', c: '#e0ac69', d: '#c68642', e: '#8d5524', f: '#5c3a21' };
  // Ink and dark hair sit a notch above the floor's ink, so a dark head reads from behind.
  const HAIR = { ink: '#2a2a38', dark: '#3e2a1a', brown: '#6b4423', red: '#a33b20', blond: '#d9b36c', grey: '#b9b4ac' };
  // Tops: never ink (lost on the floor) or bar wood (lost on the counter).
  const TOP = { pink: '#ff9ec1', sky: '#7f95ff', blue: '#2447f5', cream: '#fff4dc', yellow: '#ffd36a' };
  const INK = '#16161d', CREAM = '#fff4dc', AMBER = '#ffb627', WOOD = '#c98a3e', SKY = '#7f95ff', BLUE = '#2447f5';

  // The Regulars: the same look in every clip of both tests. Ids are neutral.
  const C = (skin, hair, cut, top, build, size, x = {}) => ({ skin, hair, cut, top, build, size, ...x });
  const CAST = {
    c1: C('c', 'brown', 'crop', 'pink', 'slim', 1), c2: C('e', 'ink', 'afro', 'sky', 'broad', 1.08),
    c3: C('a', 'blond', 'long', 'blue', 'slim', 1, { glasses: 1 }), c4: C('d', 'dark', 'curly', 'cream', 'broad', 0.92),
    c5: C('b', 'grey', 'side', 'sky', 'slim', 1.08), c6: C('f', 'ink', 'bun', 'pink', 'slim', 0.92),
    c7: C('a', 'red', 'quiff', 'pink', 'broad', 1, { beard: 1 }), c8: C('e', 'ink', 'hijab', 'blue', 'slim', 1, { scarf: CREAM }),
    c9: C('b', 'ink', 'crop', 'sky', 'slim', 1, { chair: 1 }), c10: C('d', 'grey', 'bald', 'cream', 'broad', 0.92),
    c11: C('c', 'red', 'curly', 'yellow', 'slim', 1.08), c12: C('f', 'dark', 'crop', 'blue', 'broad', 1),
    s1: C('c', 'ink', 'crop', 0, 'slim', 1, { staff: 1 }), s2: C('a', 'grey', 'bun', 0, 'broad', 0.92, { staff: 1 }),
    s3: C('f', 'dark', 'long', 0, 'slim', 1.08, { staff: 1 }), s4: C('b', 'red', 'quiff', 0, 'slim', 1, { staff: 1, glasses: 1 }),
  };
  // Stride period in ms: taller and broader regulars take longer strides, grey-haired ones slower.
  const pace = (c) => Math.min(560, Math.max(380, 400 + (c.size - 0.92) * 400 + (c.build === 'broad' ? 40 : 0) + (c.hair === 'grey' ? 80 : 0)));

  // Lanes per camera: [feet y % of the camera's box height, scale, z-index].
  // mirror: the room seen in the back-bar mirror (its box is 44% of the stage tall).
  // sc f: a colleague on your side of the counter, seen from behind, between you and the bar.
  // cc 2 and 3: nearer the camera than lane 1 (a queue running toward the camera).
  const LANES = {
    sc: { 0: [88, 1, 30], 1: [72, 0.8, 24], 2: [62, 0.62, 18], 3: [51, 0.48, 12], f: [112, 1.4, 45] },
    cc: { 0: [96, 1, 50], 1: [110, 1.2, 60], 2: [124, 1.4, 70], 3: [138, 1.6, 80], s: [54, 0.78, 20] },
    mirror: { 0: [101, 0.5, 30], 1: [89, 0.4, 24], 2: [77, 0.31, 18], 3: [67, 0.24, 12] },
  };
  const SH = 68.75; // stage height in cqw (16:11)
  const CAMH = { sc: SH, cc: SH, mirror: SH * 0.44 }; // each camera's box height in cqw
  const CAMW = { sc: 100, cc: 100, mirror: 52 }; // and width (the mirror box is 52% of the stage wide)
  const BASE_W = 19; // figure width in cqw at scale 1, before the cast member's height

  /* ---------- Drawing (viewBox 0 0 100 150; head centre 50,32 r30; feet at 150) ---------- */

  const R = (x, y, w, h, f, rx = 0, cls = '') => `<rect${cls ? ` class="${cls}"` : ''} x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}"/>`;
  const O = (x, y, r, f) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"/>`;
  const cap = (y) => { const h = Math.sqrt(900 - (32 - y) ** 2); return `<path d="M${(50 - h).toFixed(1)} ${y}A30 30 0 0 1 ${(50 + h).toFixed(1)} ${y}Z" fill="H"/>`; };
  const dome = O(50, 32, 30, 'H');
  const bumps = (pts) => pts.map(([x, y]) => O(x, y, 8, 'H')).join('');
  const mane = R(16, 20, 68, 62, 'H', 20);
  const scarf = O(50, 34, 35, 'C') + R(15, 34, 70, 46, 'C', 18);
  const bun = `<g class="hk-bounce">${O(50, 4, 9, 'H')}</g>`;
  const HAIRDO = {
    crop: { front: cap(20), back: dome },
    quiff: { front: cap(22) + `<ellipse cx="40" cy="8" rx="17" ry="9" fill="H"/>`, back: dome + `<ellipse cx="40" cy="8" rx="17" ry="9" fill="H"/>` },
    curly: { front: cap(24) + bumps([[24, 24], [33, 12], [50, 6], [67, 12], [76, 24]]), back: O(50, 32, 32, 'H') + bumps([[24, 24], [33, 12], [50, 6], [67, 12], [76, 24], [20, 40], [80, 40]]) },
    afro: { behind: O(50, 30, 40, 'H'), front: cap(26), back: O(50, 30, 40, 'H') },
    long: { behind: mane, front: cap(20), back: mane + dome },
    bun: { front: cap(20) + bun, back: dome + bun },
    side: { front: cap(23) + `<ellipse cx="36" cy="14" rx="19" ry="9" fill="H"/>`, back: dome },
    bald: { front: O(23, 34, 7, 'H') + O(77, 34, 7, 'H'), back: O(50, 32, 30, 'S') + R(20, 28, 60, 11, 'H', 5.5) },
    hijab: { behind: scarf, front: '', back: scarf, face: `<ellipse cx="50" cy="35" rx="24" ry="27" fill="S"/>` },
  };

  // Hand variants, drawn with the wrist at 0,0. Held props stay upright (see compilePerson).
  const glass = (f) => R(-8, -28, 16, 26, f, 2) + R(-8, -32, 16, 7, CREAM, 2);
  const HANDS = {
    mitten: (s) => O(0, 0, 8, s),
    point: (s) => O(0, 0, 8, s) + R(-3, 4, 6, 17, s, 3),
    open: (s) => O(0, 0, 9, s) + O(-7, -7, 3.5, s) + O(0, -10, 3.5, s) + O(7, -7, 3.5, s),
    pint: (s) => glass(AMBER) + O(0, -8, 8, s),
    stout: (s) => glass(INK) + O(0, -8, 8, s),
    gin: (s) => R(-7, -26, 14, 22, SKY, 2) + O(0, -6, 8, s),
    note: (s) => R(-19, -28, 38, 22, AMBER, 2) + `<text x="0" y="-11" text-anchor="middle" font-size="15" font-weight="900" fill="${INK}">10</text>` + O(0, -4, 8, s),
    card: (s) => R(-9, -16, 18, 12, SKY, 1.5) + R(-9, -13, 18, 3, INK) + O(0, -2, 8, s),
    phone: (s) => R(-6, -24, 12, 20, INK, 2) + R(-4, -22, 8, 14, CREAM, 1) + O(0, -4, 8, s),
    reader: (s) => R(-8, -28, 16, 26, INK, 2) + R(-6, -26, 12, 9, CREAM, 1) + O(0, -4, 8, s),
    cue: (s) => R(-1.6, -139, 3.2, 165, '#8a5a22', 1.6) + R(-1.6, -139, 3.2, 8, CREAM, 1.6) + O(0, 0, 8, s), // a pool cue, tip above the head
  };
  const PROP_HANDS = ['pint', 'stout', 'gin', 'note', 'card', 'phone', 'reader', 'cue'];

  // Joints: .hk-up / .hk-fore carry the pose; .hk-sw / .hk-fs inside them carry the walk swing.
  const arm = (S, x, top, skin, hands) =>
    `<g transform="translate(${x} 72)"><g class="hk-up hk-up${S}"><g class="hk-sw hk-sw${S}">${R(-6.5, -3, 13, 32, top, 6.5)}<g transform="translate(0 27)"><g class="hk-fore hk-fore${S}"><g class="hk-fs hk-fs${S}">${R(-6, -3, 12, 29, top, 6)}` +
    `<g transform="translate(0 25)"><g class="hk-hand hk-hand${S}">${hands.map((h) => `<g class="hk-hv" data-hv="${h}" opacity="${h === 'mitten' ? 1 : 0}">${HANDS[h](skin)}</g>`).join('')}</g></g></g></g></g></g></g></g>`;

  // One view of a figure (the contents of the root group). both=true stacks front and back
  // views so a clip can turn a figure round (turn-back / turn-front).
  function figure(c, view, hands, both) {
    if (both) return `<svg class="hk-fig" viewBox="0 0 100 150" aria-hidden="true"><g class="hk-root"><g class="hk-breath"><g class="hk-bob"><g class="hk-vf">${inner(c, 'front', hands)}</g><g class="hk-vb">${inner(c, 'back', hands)}</g></g></g></g></svg>`;
    return `<svg class="hk-fig" viewBox="0 0 100 150" aria-hidden="true"><g class="hk-root"><g class="hk-breath"><g class="hk-bob">${inner(c, view, hands)}</g></g></g></svg>`;
  }

  function inner(c, view, hands) {
    const skin = SKIN[c.skin], hair = HAIR[c.hair], top = c.staff ? INK : TOP[c.top];
    const fill = (s) => s.replace(/"H"/g, `"${hair}"`).replace(/"S"/g, `"${skin}"`).replace(/"C"/g, `"${c.scarf || SKY}"`);
    const bw = c.build === 'broad' ? 70 : 54, bx = 50 - bw / 2, h = HAIRDO[c.cut], back = view === 'back';
    const legs = `<g class="hk-legs"><g class="hk-legL">${R(33, 112, 14, 38, top, 7)}</g><g class="hk-legR">${R(53, 112, 14, 38, top, 7)}</g></g>`;
    const chair = c.chair ? R(bx - 2, 70, bw + 4, 60, CREAM, 6) + O(22, 128, 20, INK) + O(78, 128, 20, INK) + O(22, 128, 6, CREAM) + O(78, 128, 6, CREAM) : '';
    // Staff: a cream apron from the front; from behind just the ties and a bow.
    const apron = !c.staff ? '' : back ? R(bx - 1, 88, bw + 2, 5, WOOD, 2.5) + O(45, 92, 4, WOOD) + O(55, 92, 4, WOOD) : R(bx + 7, 86, bw - 14, 46, CREAM, 8) + R(bx - 1, 88, 9, 5, WOOD, 2.5) + R(bx + bw - 8, 88, 9, 5, WOOD, 2.5);
    const body = R(bx, 58, bw, 74, top, bw / 2) + apron;
    // Ears and a neck in skin tone, so a dark head still reads against the ink floor from behind.
    const ears = O(21, 35, 5.5, skin) + O(79, 35, 5.5, skin) + R(43, 54, 14, 8, skin);
    let head;
    if (back) head = ears + fill(h.back);
    else {
      const brow = (x) => R(x, 13.5, 18, 5, INK, 2.5);
      head = `${fill(h.behind || '')}${h.face ? '' : ears}${h.face ? fill(h.face) : O(50, 32, 30, skin)}<g class="hk-face"><g class="hk-lids">${O(38, 30, 9, CREAM)}${O(62, 30, 9, CREAM)}<g class="hk-pupils"><g class="hk-pup2">${O(38, 30, 4.5, INK)}${O(62, 30, 4.5, INK)}</g></g></g>` +
        `<g class="hk-browL">${brow(29)}</g><g class="hk-browR">${brow(53)}</g>` +
        (c.glasses ? `<g fill="none" stroke="${INK}" stroke-width="2.5"><circle cx="38" cy="30" r="10.5"/><circle cx="62" cy="30" r="10.5"/><path d="M48.5 29h3"/></g>` : '') +
        (c.beard ? `<path d="M23 38Q50 78 77 38Z" fill="${hair}"/>` : '') +
        `<g class="hk-mouth"><rect class="hk-m" data-m="line" x="43" y="47" width="14" height="4" rx="2" fill="${INK}"/><path class="hk-m" data-m="smile" d="M39 46Q50 57 61 46" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round" opacity="0"/><circle class="hk-m" data-m="o" cx="50" cy="50" r="5" fill="${INK}" opacity="0"/><rect class="hk-m" data-m="wide" x="40" y="45" width="20" height="9" rx="4.5" fill="${INK}" opacity="0"/></g></g>${fill(h.front)}`;
    }
    // Seen from behind, the arms sit behind the body, so arms on the counter tuck away.
    const arms = arm('L', bx + 4, top, skin, hands) + arm('R', 100 - bx - 4, top, skin, hands);
    return `${legs}${chair}${back ? fill(h.behind || '') + arms : ''}${body}<g class="hk-head"><g class="hk-nodder"><g class="hk-lag">${head}</g></g></g>${back ? '' : arms}`;
  }

  /* ---------- Poses: part values (arm angles in degrees, others transforms) ---------- */

  const UP = 'translate(0,-7px)', M = 'mitten';
  const BAR = { upL: 10, foreL: -85, upR: -10, foreR: 85, handL: M, handR: M };
  const POSES = {
    idle: { upL: 6, foreL: 0, upR: -6, foreR: 0, handL: M, handR: M, root: '', head: '', browL: '', browR: '', mouth: 'line' },
    bar: { ...BAR, root: '' }, lean: { ...BAR, root: 'translate(0,2px) scale(1.04)' },
    wave: { upR: -152, foreR: -18, handR: 'note' },
    'point-r': { upR: -92, foreR: 0, handR: 'point' }, 'point-l': { upL: 92, foreL: 0, handL: 'point' },
    'point-rl': { upR: 30, foreR: -118, handR: 'point' }, 'point-lr': { upL: -30, foreL: 118, handL: 'point' },
    'point-rd': { upR: -56, foreR: 0, handR: 'point' }, 'point-ld': { upL: 56, foreL: 0, handL: 'point' },
    phone: { head: 'translate(0,5px) rotate(4deg)', upR: -34, foreR: -108, handR: 'phone', pupils: 'translate(0,3px)' },
    carry: { upL: 10, foreL: -82, upR: -10, foreR: 82, handL: 'pint', handR: 'pint' },
    'hold-r': { upR: -8, foreR: 76, handR: 'pint' }, 'hold-l': { upL: 8, foreL: -76, handL: 'pint' },
    'cue-r': { upR: -24, foreR: 10, handR: 'cue' }, 'cue-l': { upL: 24, foreL: -10, handL: 'cue' }, // a pool cue held at the side, clear of the face
    sip: { upR: -30, foreR: -112, handR: 'pint', head: 'translate(0,2px) rotate(-3deg)' },
    pour: { upR: -82, foreR: 48, handR: M }, reader: { upR: -42, foreR: -58, handR: 'reader' }, card: { upR: -40, foreR: -62, handR: 'card' },
    tap: { upR: -135, foreR: -35, handR: 'card' }, // card held up and out to a reader (shows above the shoulder from behind)
    'open-r': { upR: -110, foreR: -30, handR: 'open' }, cup: { upR: -120, foreR: -75, handR: 'open' },
    shrug: { upL: 38, foreL: -112, upR: -38, foreR: 112, handL: 'open', handR: 'open', browL: UP, browR: UP },
    'brow-r': { browR: UP }, 'brow-l': { browL: UP }, brows: { browL: UP, browR: UP }, 'brows-0': { browL: '', browR: '' },
    frown: { browL: 'rotate(14deg) translate(0,-2px)', browR: 'rotate(-14deg) translate(0,-2px)' },
    smile: { mouth: 'smile' }, 'mouth-o': { mouth: 'o' }, 'mouth-line': { mouth: 'line' }, 'mouth-wide': { mouth: 'wide' },
    'look-l': { pupils: 'translate(-4px,0)', head: 'rotate(-3deg)' }, 'look-r': { pupils: 'translate(4px,0)', head: 'rotate(3deg)' },
    'look-ll': { pupils: 'translate(-5px,0)', head: 'rotate(-5deg)', face: 'translate(-7px,0)' }, 'look-rr': { pupils: 'translate(5px,0)', head: 'rotate(5deg)', face: 'translate(7px,0)' },
    'look-cam': { pupils: '', head: '', face: '' }, 'look-up': { pupils: 'translate(0,-3px)' }, 'look-down': { pupils: 'translate(0,3px)', head: 'translate(0,3px)' },
    'look-dl': { pupils: 'translate(-3px,3px)' }, 'look-dr': { pupils: 'translate(3px,3px)' },
    'face-l': { face: 'translate(-8px,0)' }, 'face-r': { face: 'translate(8px,0)' }, 'face-c': { face: '' },
    tilt: { head: 'rotate(4deg)' },
  };

  // Acting loops: [selector, keyframes, cycle ms, timing].
  const LOOPS = {
    nod: ['.hk-nodder', 'hk-nod', 900, 'ease-in-out'],
    wave: ['.hk-fsR', 'hk-wiggle', 440, 'ease-in-out'], hover: ['.hk-bob', 'hk-hover', 1400, 'ease-in-out'],
    glance: ['.hk-pup2', 'hk-hovergaze', 2200, 'ease-in-out'], drum: ['.hk-fsR', 'hk-drum', 320, 'ease-in-out'],
  };

  // Background life: small things a regular does when nothing else is asked of them.
  // [parts to change, length ms, needs a pint in hand?]
  const LIFE = [
    [{ pupils: 'translate(-4px,0)', head: 'rotate(-3deg)' }, 1000], [{ pupils: 'translate(4px,0)', head: 'rotate(3deg)' }, 1000],
    [{ pupils: 'translate(-5px,0)', head: 'rotate(-5deg)', face: 'translate(-7px,0)' }, 1300], [{ pupils: 'translate(5px,0)', head: 'rotate(5deg)', face: 'translate(7px,0)' }, 1300],
    [{ browR: UP }, 800], [{ pupils: 'translate(0,3px)', head: 'translate(0,3px)' }, 900], [{ head: 'rotate(4deg)' }, 900],
    [POSES.sip, 900, true],
  ];

  /* ---------- The compiler ---------- */

  let css = '', nKey = 0;
  const pct = (ms, dur) => `${Math.min(100, Math.max(0, (ms / dur) * 100)).toFixed(3)}%`;
  const SPRING = 'linear(0, 0.26 8%, 0.74 20%, 1.06 34%, 1.02 48%, 0.99 62%, 1)';
  const STEP = 'cubic-bezier(0.5, 0, 0.25, 1)'; // travel while the foot is up, stop as it lands

  // Each element's animations collect here and go out as one comma list, so a compiled
  // track and any loops on the same element stack. Loops fill none and are neutral at
  // 0% and 100%, so they only act while running and leave the part planted.
  const anims = new Map();
  const add = (el, name, dur, delay, count, timing, fill) => {
    if (!el) return;
    if (!anims.has(el)) anims.set(el, []);
    anims.get(el).push([name, dur, `${Math.round(delay)}ms`, String(count), timing, fill]);
  };
  // Lists are sorted by start time, so a loop that has finished (and holds its neutral end
  // frame) never sits after, and masks, one that is still running.
  const flush = () => {
    anims.forEach((list, el) => {
      list.sort((a, b) => parseFloat(a[2]) - parseFloat(b[2]));
      const col = (i) => list.map((a) => a[i]).join(',');
      Object.assign(el.style, { animationName: col(0), animationDuration: col(1), animationDelay: col(2), animationIterationCount: col(3), animationTimingFunction: col(4), animationFillMode: col(5) });
    });
    anims.clear();
  };
  // Loops fill forwards (not none) so a finished loop stays in getAnimations(): the player
  // re-shows the poster clip without re-creating its animations, and would otherwise lose them.
  const loop = (el, name, cycle, delay, n, timing, fill = 'forwards') => add(el, name, `${cycle}ms`, delay, n, timing, fill);

  // track: [[ms, declarations, timing?]]. Holds between changes; tr ms to make a change.
  function emit(el, track, dur, tr = 260) {
    if (!el || !track.length) return;
    track = [...track].sort((a, b) => a[0] - b[0]);
    if (track.every(([, d]) => d === track[0][1])) { el.style.cssText += track[0][1]; return; } // static, not animated
    const frames = [[0, track[0][1], null]];
    let last = frames[0];
    track.slice(1).forEach(([t, decl, ease]) => {
      // A repeated value is a hold frame; a change eases in over tr ms, never earlier than the hold.
      if (decl === last[1]) { if (t > last[0]) frames.push((last = [t, decl, null])); return; }
      const from = Math.max(last[0], t - tr);
      if (from > last[0]) frames.push([from, last[1], null]);
      frames.push((last = [t, decl, ease || null]));
    });
    if (last[0] < dur) frames.push([dur, last[1], null]);
    const name = `hk${++nKey}`;
    // A keyframe's timing function applies to the segment leaving it.
    css += `@keyframes ${name}{${frames.map(([t, d], i) => `${pct(t, dur)}{${d}${frames[i + 1]?.[2] ? `animation-timing-function:${frames[i + 1][2]};` : ''}}`).join('')}}`;
    add(el, name, 'var(--dur)', 0, 1, 'ease-in-out', 'both');
  }

  const parseActs = (s) => (s || '').split(';').map((e) => e.trim()).filter(Boolean).map((e) => {
    const [t, rest] = e.split(':');
    return { t: parseFloat(t), toks: (rest || '').match(/[\w-]+(?:\([^)]*\))?/g) || [] };
  }).sort((a, b) => a.t - b.t);
  const args = (tok) => (tok.match(/\(([^)]*)\)/) || [, ''])[1].split(',').map((a) => a.trim()).filter(Boolean);
  const base = (tok) => tok.replace(/\(.*$/, '');

  function compilePerson(el, dur, cue, cam, seed) {
    const c = CAST[el.dataset.cast] || CAST.c1, lanes = LANES[cam] || LANES.sc, view = el.dataset.view || 'front';
    const acts = parseActs(el.dataset.act);
    const hands = new Set([M]);
    let turns = false;
    acts.forEach(({ toks }) => toks.forEach((tok) => {
      const b = base(tok), p = POSES[b];
      if (p) { if (p.handL) hands.add(p.handL); if (p.handR) hands.add(p.handR); }
      if (b === 'hold-r' || b === 'hold-l') args(tok).forEach((h) => HANDS[h] && hands.add(h));
      if (b === 'turn-back' || b === 'turn-front') turns = true;
    }));
    el.innerHTML = figure(c, view, [...hands], turns) + el.innerHTML;
    const w = (parseFloat(el.style.getPropertyValue('--w')) || BASE_W) * c.size; // cqw at scale 1
    el.style.setProperty('--w', w.toFixed(2));
    if (el.dataset.you != null) el.insertAdjacentHTML('beforeend', '<i class="hk-you">you</i>');

    // data-pos="x,lane" is where the figure ends up; the wrapper's keyframes move it relative to there.
    const [fx, flane] = (el.dataset.pos || '50,0').split(',');
    const place = (x, l) => { const [y, s, z] = lanes[l] || lanes[0]; return { x: +x, y, s, z, l: String(l) }; };
    const fin = place(fx, flane);
    el.style.setProperty('--x', fx); el.style.setProperty('--y', fin.y); el.style.setProperty('--s', fin.s); el.style.zIndex = fin.z;
    const legsAt = (l) => (cam !== 'cc' && l !== '0' && l !== 'f' ? 1 : 0); // legs show in the room; the counter or the floor hides them elsewhere
    const camH = CAMH[cam] || SH, camW = CAMW[cam] || 100;
    let hidden = false;
    const wrap = (p, dip = 0) => `transform:translate(${(((p.x - fx) * camW) / 100).toFixed(2)}cqw,${(((p.y - fin.y) * camH) / 100 + dip).toFixed(2)}cqw) scale(${(p.s * (dip ? 0.97 : 1)).toFixed(3)});z-index:${p.z};opacity:${hidden ? 0 : 1};`;

    const q = (sel) => el.querySelector(sel), qa = (sel) => [...el.querySelectorAll(sel)];
    const state = { ...POSES.idle, pupils: '', face: '', legs: legsAt(fin.l), view };
    const T = { wrap: [], cs: [], root: [], head: [], face: [], pupils: [], browL: [], browR: [], upL: [], foreL: [], upR: [], foreR: [], legs: [], vf: [], vb: [] };
    const handT = { L: [], R: [] }, mouthT = [], loops = [], walks = [], hist = [], talks = [];
    let pos = fin, stride = pace(c);
    // Every wrapper keyframe also records the counter-scale the YOU pill and bubbles need.
    const pushWrap = (t, p, dip = 0, ease = null) => { T.wrap.push([t, wrap(p, dip), ease]); T.cs.push([t, `scale:${(1 / (p.s * (dip ? 0.97 : 1))).toFixed(3)};`]); };
    const snap = (t) => {
      hist.push([t, { ...state }]);
      pushWrap(t, pos);
      ['root', 'head', 'face', 'pupils', 'browL', 'browR'].forEach((k) => T[k].push([t, `transform:${state[k] || 'none'};`]));
      ['upL', 'foreL', 'upR', 'foreR'].forEach((k) => T[k].push([t, `transform:rotate(${state[k]}deg);`, SPRING]));
      ['L', 'R'].forEach((s) => handT[s].push([t, state['hand' + s], -(state['up' + s] + state['fore' + s])]));
      mouthT.push([t, state.mouth]);
      T.legs.push([t, `opacity:${state.legs};`]);
      T.vf.push([t, `opacity:${state.view === 'back' ? 0 : 1};`]);
      T.vb.push([t, `opacity:${state.view === 'back' ? 1 : 0};`]);
    };
    if (!acts.length || acts[0].t > 0) snap(0);
    acts.forEach(({ t, toks }, i) => {
      let go = null, turn = null;
      toks.forEach((tok) => {
        const b = base(tok), a = args(tok);
        // A name that is both a pose and a loop (wave) is the loop when it has a length: wave(900)
        // wiggles whatever hand is up, plain wave is the tenner pose.
        if (LOOPS[b] && a[0]) loops.push([b, t, +a[0]]);
        else if (POSES[b]) {
          Object.assign(state, POSES[b]);
          if ((b === 'hold-r' || b === 'hold-l') && a[0]) state[b === 'hold-r' ? 'handR' : 'handL'] = a[0]; // hold-r(card) etc.
        }
        else if (b === 'go') go = { to: place(a[0], a[1]), ms: +a[2] || 0 };
        else if (b === 'at') pos = place(a[0], a[1]);
        else if (b === 'pace') stride = +a[0] || stride;
        else if (b === 'hide') hidden = true;
        else if (b === 'show') hidden = false;
        else if (b === 'vanish' || b === 'appear') { pushWrap(t - 1, pos); hidden = b === 'vanish'; } // instant, no fade
        else if (b === 'legs') state.legs = 1;
        else if (b === 'nolegs') state.legs = 0;
        else if (b === 'turn-back' || b === 'turn-front') turn = b.slice(5);
        else if (b === 'talk') talks.push([t, +a[0] || 1000]);
        else if (LOOPS[b]) loops.push([b, t, +a[0] || 0]);
        else console.warn(`HazardKit: unknown act "${tok}"`);
      });
      if (turn && turn !== state.view) {
        // A three-quarter step (the face slides) 200ms before the views swap.
        const f = state.face;
        state.face = `translate(${turn === 'back' ? 8 : -8}px,0)`;
        snap(t - 200);
        state.face = f;
        state.view = turn;
      }
      if (!go) return snap(t);

      // A walk. Speed comes from the distance and the character's pace; an explicit ms is an
      // override. Either way it is a whole number of strides, so the walker ends planted.
      const from = pos, to = go.to;
      const dx = ((to.x - from.x) * camW) / 100, dy = ((to.y - from.y) * camH) / 100, dist = Math.hypot(dx, dy);
      const carry = PROP_HANDS.includes(state.handL) || PROP_HANDS.includes(state.handR);
      const side = Math.abs(dx) > Math.abs(dy) * 1.2;
      const strideLen = (carry ? 0.4 : 0.6) * 1.5 * w * ((from.s + to.s) / 2); // cqw per stride
      let n = Math.max(1, Math.round(dist / strideLen)), P = stride;
      if (go.ms) { n = Math.max(1, Math.round(go.ms / stride)); P = go.ms / n; }
      const ms = Math.round(n * P);
      if (t < cue && t + ms > cue) console.warn(`HazardKit: ${el.dataset.cast} is mid-stride at the cue (walk ${t} to ${t + ms}ms).`);
      if (t + ms > dur) console.warn(`HazardKit: ${el.dataset.cast} is still walking when the clip ends (walk ${t} to ${t + ms}ms).`);
      walks.push([t, t + ms]);
      // Anticipation dip, face the way they're going, then one eased keyframe per step so the
      // figure travels while a foot is up and stops as it lands. No sliding on a planted foot.
      pushWrap(t - 110, from, 0.5);
      state.legs = 1;
      const keep = { face: state.face, pupils: state.pupils };
      if (side) { state.face = `translate(${dx > 0 ? 8 : -8}px,0)`; state.pupils = `translate(${dx > 0 ? 4 : -4}px,0)`; }
      snap(t);
      for (let k = 1; k <= 2 * n; k++) {
        const f = k / (2 * n);
        pushWrap(t + (ms * k) / (2 * n), { x: from.x + dx * f, y: from.y + (to.y - from.y) * f, s: from.s + (to.s - from.s) * f, z: f < 0.5 ? from.z : to.z }, 0, STEP);
      }
      pos = to;
      state.legs = legsAt(to.l);
      snap(t + ms);
      // The face eases back once the walk ends, unless the next act is about to take over.
      const next = acts[i + 1] ? acts[i + 1].t : Infinity;
      Object.assign(state, keep);
      snap(next >= t + ms + 240 ? t + ms + 240 : t + ms);
      // Loops that can't be seen are left out: leg lifts when the legs are hidden for the whole
      // walk, forearm trails and the head lag on small (far) figures, arm swings on tiny ones.
      const gait = carry ? 'hk-gaitCarry' : side ? 'hk-gaitSide' : 'hk-gaitDepth';
      const sMean = (from.s + to.s) / 2;
      const parts = [['.hk-bob', gait, 0]];
      if (legsAt(from.l) || legsAt(to.l)) parts.push(['.hk-legL', 'hk-liftL', 0], ['.hk-legR', 'hk-liftR', 0]);
      if (sMean >= 0.6) parts.push(['.hk-lag', 'hk-lag', 70], ['.hk-bounce', 'hk-bounce', 100]);
      if (!carry && sMean >= 0.45) parts.push(['.hk-swL', 'hk-swingL', 0], ['.hk-swR', 'hk-swingR', 0]);
      if (!carry && sMean >= 0.6) parts.push(['.hk-fsL', 'hk-trailL', P * 0.12], ['.hk-fsR', 'hk-trailR', P * 0.12]);
      parts.forEach(([sel, kf, d]) => qa(sel).forEach((e) => loop(e, kf, P, t + d, n, 'ease-in-out')));
    });

    // talk(ms) is compiled into the mouth tracks: the base mouth and an "o" alternate every
    // 130 ms, then the base mouth returns. No loop, so a later mouth-o is never masked.
    // Talk frames go in front of the act frames, so an act at the same ms has the last word.
    talks.forEach(([t, ms]) => {
      const baseMouth = (hist.filter(([h]) => h <= t).pop() || [0, state])[1].mouth || 'line';
      const alt = baseMouth === 'o' ? 'wide' : 'o';
      const frames = [];
      for (let k = 0, tt = t; tt < t + ms; k++, tt += 130) frames.push([tt, k % 2 ? baseMouth : alt]);
      frames.push([t + ms, baseMouth]);
      mouthT.unshift(...frames);
    });

    // Background life, seeded per figure: glances, a raised brow, a sip, a turn to a friend.
    // Never inside the freeze, during a walk, or within 600ms of something the clip asked for.
    // Reflections in the mirror stay cheap: no life, no breathing, no blinking.
    // A life event only writes the parts it changes, starting from the state the figure was in
    // at that moment (position, legs and view are left alone).
    if (el.dataset.life !== '0' && view === 'front' && cam !== 'mirror') {
      let s = seed * 7919 + 104729;
      const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
      const busy = (a, b) => walks.some(([x, y]) => a < y + 600 && b > x - 600) || acts.some(({ t }) => t > 0 && a < t + 600 && b > t - 600) || (a < cue + 400 && b > cue - 900);
      const stateAt = (t) => hist.filter(([h]) => h <= t).pop()[1];
      const part = (t, st, keys) => keys.forEach((k) => {
        if (k === 'handR' || k === 'handL') return;
        if (['upL', 'foreL', 'upR', 'foreR'].includes(k)) T[k].push([t, `transform:rotate(${st[k]}deg);`, SPRING]);
        else T[k].push([t, `transform:${st[k] || 'none'};`]);
        if (k === 'upR' || k === 'foreR') handT.R.push([t, st.handR, -(st.upR + st.foreR)]);
        if (k === 'upL' || k === 'foreL') handT.L.push([t, st.handL, -(st.upL + st.foreL)]);
      });
      for (let t = 900 + rnd() * 1800; t < dur - 700; t += 2200 + rnd() * 2000) {
        const [delta, len, needPint] = LIFE[Math.floor(rnd() * LIFE.length)];
        const base = stateAt(t), keys = Object.keys(delta);
        if (busy(t, t + len) || (needPint && !PROP_HANDS.includes(base.handR)) || hidden) continue;
        part(t, { ...base, ...delta }, keys);
        part(t + len, base, keys);
      }
    }

    // Parts exist once per view (twice for a figure that turns), so tracks go to every match.
    emit(el, T.wrap, dur);
    [...el.querySelectorAll(':scope > .hk-you, :scope > .hk-bub')].forEach((e) => emit(e, T.cs, dur));
    emit(q('.hk-root'), T.root, dur);
    qa('.hk-head').forEach((e) => emit(e, T.head, dur, 320));
    emit(q('.hk-face'), T.face, dur, 320);
    emit(q('.hk-pupils'), T.pupils, dur, 180);
    emit(q('.hk-browL'), T.browL, dur, 160);
    emit(q('.hk-browR'), T.browR, dur, 160);
    ['upL', 'foreL', 'upR', 'foreR'].forEach((k) => qa('.hk-' + k).forEach((e) => emit(e, T[k], dur, 380)));
    qa('.hk-legs').forEach((e) => emit(e, T.legs, dur, 120));
    ['L', 'R'].forEach((s) => qa('.hk-hand' + s).forEach((hand) => {
      hand.querySelectorAll('.hk-hv').forEach((g) => emit(g, handT[s].map(([t, v]) => [t, `opacity:${g.dataset.hv === v ? 1 : 0};`]), dur, 1));
      emit(hand, handT[s].map(([t, v, deg]) => [t, `transform:rotate(${PROP_HANDS.includes(v) ? deg : 0}deg);`]), dur, 380); // held props stay upright
    }));
    qa('.hk-m').forEach((m) => emit(m, mouthT.map(([t, v]) => [t, `opacity:${m.dataset.m === v ? 1 : 0};`]), dur, 1));
    if (turns) { emit(q('.hk-vf'), T.vf, dur, 1); emit(q('.hk-vb'), T.vb, dur, 1); }

    // Breathing and blinking run for the whole clip, staggered per figure; other loops as scripted.
    const stag = (seed * 137) % 900;
    if (cam !== 'mirror') {
      loop(q('.hk-breath'), 'hk-breath', 2400 + (seed % 3) * 300, -stag, Math.ceil(dur / 2400) + 1, 'ease-in-out');
      // Blinks (at 92–97% of each cycle) never land on the cue frame or the last frame.
      const P = 3000 + (seed % 4) * 350;
      const bad = (t) => (t > cue - 380 && t < cue + 180) || t > dur - 520;
      let d = 400 + stag;
      for (let tries = 0; tries < 80; tries++, d += 97) {
        let ok = true;
        for (let k = 0; d + k * P < dur && ok; k++) { const b = d + (k + 0.92) * P; ok = !bad(b) && !bad(b + 0.05 * P); }
        if (ok) break;
      }
      loop(q('.hk-lids'), 'hk-blink', P, d, Math.ceil(dur / P) + 1, 'ease-in-out');
    }
    loops.forEach(([name, at, ms]) => {
      const [sel, kf, cycle, timing] = LOOPS[name];
      qa(sel).forEach((e) => loop(e, kf, cycle, at, name === 'nod' ? 1 : Math.max(1, Math.round((ms || cycle) / cycle)), timing));
    });
  }

  // data-on="a-b" shows an element from a to b (ms); "a" shows it from a. Bubbles pop, cuts
  // switch, your first-person arm reaches up into frame.
  function compileOn(el, dur) {
    const [a, b] = el.dataset.on.split('-').map((v) => (v === '' ? null : +v));
    const bub = el.classList.contains('hk-bub'), armed = el.classList.contains('hk-arm1p');
    const hide = bub ? 'opacity:0;transform:scale(0.6);' : armed ? 'opacity:0;transform:translateY(35%);' : 'opacity:0;';
    const show = bub ? 'opacity:1;transform:scale(1);' : armed ? 'opacity:1;transform:none;' : 'opacity:1;';
    const track = a > 0 ? [[0, hide]] : [];
    track.push([a || 0, show, bub ? SPRING : null]);
    if (b != null) track.push([b, hide]);
    emit(el, track, dur, el.classList.contains('hk-cut') ? 1 : armed ? 420 : 220);
  }

  // Props. Pouring: data-fill="ms" fills over data-fillms to --f of the glass; data-settle="ms"
  // turns a stout dark from the bottom over data-settlems (1400); data-top="ms" tops up to full;
  // data-head="ms" shows the head; data-fizz="ms" sends bubbles up a gin. Moving: data-move=
  // "t: x,y[,s]; …" slides the prop to stage x,y (and scale) by t. Reader: data-screen=
  // "1500:£11.40; 2400:spin; 7400:ok; 9000:off" switches what the card machine shows.
  function compileProp(p, dur) {
    const d = p.dataset;
    if (d.fill != null) loop(p.querySelector('.beer'), 'hk-fill', +d.fillms || 3000, +d.fill, 1, 'linear', 'both');
    if (d.top != null) { loop(p.querySelector('.beer'), 'hk-top', 600, +d.top, 1, 'ease-out', 'forwards'); loop(p.querySelector('.head'), 'hk-headup', 600, +d.top, 1, 'ease-out', 'forwards'); }
    if (d.settle != null) loop(p.querySelector('.dark'), 'hk-settle', +d.settlems || 1400, +d.settle, 1, 'ease-out', 'both');
    if (d.head != null) emit(p.querySelector('.head'), [[0, 'opacity:0;'], [+d.head, 'opacity:1;']], dur, 200);
    if (d.fizz != null) p.querySelectorAll('.fizz circle').forEach((b, i) => loop(b, 'hk-fizz', 900, +d.fizz + i * 300, 3, 'linear'));
    if (d.move) {
      const x0 = +p.style.getPropertyValue('--x') || 0, y0 = +p.style.getPropertyValue('--y') || 0;
      emit(p, [[0, 'transform:none;'], ...parseActs(d.move).map(({ t, toks }) => {
        const [x, y, s] = (toks.join(',')).split(',').map(Number);
        return [t, `transform:translate(${(x - x0).toFixed(2)}cqw,${(((y - y0) * SH) / 100).toFixed(2)}cqw) scale(${s || 1});`];
      })], dur, 500);
    }
    if (d.screen) {
      const states = d.screen.split(';').map((e) => e.trim()).filter(Boolean).map((e) => { const i = e.indexOf(':'); return [parseFloat(e.slice(0, i)), e.slice(i + 1).trim()]; }).sort((a, b) => a[0] - b[0]);
      const txt = states.find(([, v]) => !['spin', 'ok', 'off'].includes(v));
      if (txt) { const el = p.querySelector('.s-txt'); el.textContent = txt[1]; if (txt[1].length > 4) { el.setAttribute('textLength', '10.4'); el.setAttribute('lengthAdjust', 'spacingAndGlyphs'); } }
      const show = (cls, test) => emit(p.querySelector(cls), [[0, 'opacity:0;'], ...states.map(([t, v]) => [t, `opacity:${test(v) ? 1 : 0};`])], dur, 1);
      show('.s-txt', (v) => v === (txt || [])[1]);
      show('.s-spin', (v) => v === 'spin');
      show('.s-ok', (v) => v === 'ok');
      states.forEach(([t, v], i) => { if (v === 'spin') loop(p.querySelector('.s-spin'), 'hk-spin', 700, t, Math.max(1, Math.round(((states[i + 1] ? states[i + 1][0] : dur) - t) / 700)), 'linear'); });
    }
  }

  // Your arm, first person (the barperson test): --x where the hand is, --y its height, --skin,
  // data-hand="mitten|point|open", data-wave="a-b" for a beckon or a wave.
  const ARM1P = (skin, hand) => `<svg viewBox="0 0 40 120" preserveAspectRatio="xMidYMin slice" aria-hidden="true"><rect x="12" y="26" width="16" height="100" fill="${INK}"/><rect x="11" y="24" width="18" height="6" rx="2" fill="${CREAM}"/>` +
    (hand === 'point' ? `<rect x="17" y="-8" width="6" height="22" rx="3" fill="${skin}"/>` : hand === 'open' ? O(12, 8, 3.5, skin) + O(20, 5, 3.5, skin) + O(28, 8, 3.5, skin) : '') + O(20, 18, 10, skin) + '</svg>';

  // data-pan="t:offset; t:offset" slides a 200%-wide strip (offset in % of its own width).
  // Each turn starts at its t (put the whoosh there) and takes 650 ms.
  function compilePan(el, dur) {
    const track = [];
    let prev = 0;
    parseActs(el.dataset.pan).forEach(({ t, toks }) => {
      const off = +toks[0] || 0;
      if (t > 0) track.push([t, `transform:translateX(${prev}%);`]);
      track.push([t > 0 ? t + 650 : 0, `transform:translateX(${off}%);`]);
      prev = off;
    });
    emit(el, track, dur, 1);
  }

  // The pundit freeze: push in on data-at, dim everything outside a round hole at data-ring
  // (defaults to data-at), draw the amber ring, any sightlines and the stamp. Coordinates are
  // pre-push stage %, like everything else; the hole and lines are mapped to post-push space.
  // data-stamp-at puts the stamp in a corner the clip keeps clear: tl (default), tr, bl, br.
  function compileFreeze(shot, fz, dur, cue) {
    const [x, y] = (fz.dataset.at || '50,50').split(',').map(Number), zoom = +fz.dataset.zoom || 1.3, r = (+fz.dataset.r || 12) * 1.6;
    const cam = shot.querySelector('.hk-cam');
    cam.style.setProperty('--cx', x); cam.style.setProperty('--cy', y);
    emit(cam, [[0, 'transform:scale(1);'], [cue - 850, 'transform:scale(1);'], [cue, `transform:scale(${zoom});`], [cue + 60, `transform:scale(${zoom});`], [cue + 520, 'transform:scale(1);']], dur, 850);
    const post = (px, py) => [(x + (px - x) * zoom) * 1.6, (y + (py - y) * zoom) * 1.1]; // into the 160x110 viewBox
    const [X, Y] = post(...(fz.dataset.ring || fz.dataset.at || '50,50').split(',').map(Number));
    // Sightlines (eyes to eyes, with an arrowhead) and brackets (a measured gap, with end ticks).
    const lineOf = (s, cls, ends) => {
      const [a, b] = s.trim().split(/\s+/).map((p) => p.split(',').map(Number));
      const [x1, y1] = post(a[0], a[1]), [x2, y2] = post(b[0], b[1]);
      const len = Math.hypot(x2 - x1, y2 - y1).toFixed(1), ang = ((Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI).toFixed(1);
      return `<g transform="translate(${x1.toFixed(1)} ${y1.toFixed(1)}) rotate(${ang})"><g class="sightg"><line class="${cls}" x1="0" y1="0" x2="${len}" y2="0"/>${ends(len)}</g></g>`;
    };
    const sight = (fz.dataset.sight || '').split(';').filter(Boolean).map((s) => lineOf(s, 'sight', (len) => `<path class="sight" style="stroke-dasharray:none" d="M${len - 3} -2.4L${len} 0L${len - 3} 2.4"/>`)).join('') +
      (fz.dataset.bracket || '').split(';').filter(Boolean).map((s) => lineOf(s, 'bracket', (len) => `<path class="bracket" style="stroke-dasharray:none" d="M0 -2.6V2.6M${len} -2.6V2.6"/>`)).join('');
    fz.innerHTML = `<svg viewBox="0 0 160 110" aria-hidden="true"><circle class="scrim" cx="${X}" cy="${Y}" r="${r + 300}" stroke-width="600"/><circle class="ring" cx="${X}" cy="${Y}" r="${r}" pathLength="100" stroke-dasharray="100"/>${sight}</svg>` +
      (fz.dataset.stamp ? `<p class="hk-stamp at-${fz.dataset.stampAt || 'tl'}"><span>hazard:</span> ${fz.dataset.stamp}</p>` : '');
    // The hole only lines up once the push-in has mostly landed, so the scrim comes late.
    emit(fz, [[0, 'opacity:0;'], [cue - 560, 'opacity:0;'], [cue - 260, 'opacity:1;'], [cue + 40, 'opacity:1;'], [cue + 380, 'opacity:0;']], dur, 300);
    emit(fz.querySelector('.ring'), [[0, 'stroke-dashoffset:100;'], [cue - 520, 'stroke-dashoffset:100;'], [cue - 100, 'stroke-dashoffset:0;']], dur, 420);
    fz.querySelectorAll('.sightg').forEach((g) => emit(g, [[0, 'transform:scaleX(0);'], [cue - 420, 'transform:scaleX(0);'], [cue - 60, 'transform:scaleX(1);']], dur, 360));
    emit(fz.querySelector('.hk-stamp'), [[0, 'opacity:0;transform:scale(1.6);'], [cue - 340, 'opacity:0;transform:scale(1.6);'], [cue - 140, 'opacity:1;transform:scale(1);']], dur, 200);
  }

  /* ---------- Props and set pieces ---------- */

  const G = (body) => `<svg viewBox="0 0 20 30">${body}</svg>`;
  const YELLOW = '#ffd36a';
  // An empty glass that can be poured: the body fills (.beer) to --f, a stout settles dark (.dark)
  // to the same level, and a thin head (.head) sits on the liquid line, rising to the rim on a top-up.
  // The empty glass is a light-blue tint with a thick ink base, so it reads on cream, wood and ink.
  const pourable = (body, dark = '') => G(`<rect x="2" y="2" width="16" height="28" rx="2" fill="${SKY}" opacity="0.55"/><rect x="2" y="27" width="16" height="3" rx="1" fill="${INK}" opacity="0.7"/>` + R(2, 2, 16, 28, body, 2, 'beer') + (dark ? R(2, 2, 16, 28, dark, 2, 'dark') : '') + R(2, 2, 16, 3.5, CREAM, 1.5, 'head'));
  const PROPS = {
    pint: G(R(2, 6, 16, 24, AMBER, 2, 'beer') + R(2, 2, 16, 7, CREAM, 2)),
    stout: G(R(2, 6, 16, 24, INK, 2, 'beer') + R(2, 2, 16, 7, CREAM, 2)),
    cider: G(R(2, 6, 16, 24, YELLOW, 2, 'beer') + R(2, 2, 16, 7, CREAM, 2)),
    gin: G(R(3, 6, 14, 24, SKY, 2, 'beer') + R(3, 6, 14, 4, CREAM)),
    bottle: G(`<path d="M7 0h6v8l4 4v18H3V12l4-4z" fill="${BLUE}"/>` + R(3, 18, 14, 6, CREAM)),
    glass: pourable(AMBER),
    'glass-stout': pourable(WOOD, INK),
    'glass-gin': pourable(SKY).replace('</svg>', R(5, 9, 4, 4, CREAM, 1) + R(11, 16, 4, 4, CREAM, 1) + `<g class="fizz" fill="${CREAM}"><circle cx="6" cy="26" r="0.9"/><circle cx="10" cy="24" r="0.9"/><circle cx="14" cy="27" r="0.9"/></g></svg>`),
    'glass-cider': pourable(YELLOW),
    note: `<svg viewBox="0 0 30 16">${R(0, 1, 30, 14, AMBER, 1.5)}<text x="15" y="12" text-anchor="middle" font-size="10" font-weight="900" fill="${INK}">10</text></svg>`,
    card: `<svg viewBox="0 0 20 13">${R(0, 0, 20, 13, SKY, 1.5)}${R(0, 3, 20, 3, INK)}</svg>`,
    // The card machine: an ink screen that can show an amount, a spinner or a tick (data-screen).
    reader: `<svg viewBox="0 0 16 26">${R(0, 0, 16, 26, INK, 2)}${R(1.5, 1.5, 13, 10, CREAM, 1)}${R(2.5, 2.5, 11, 8, INK, 0.8)}<text class="s-txt" x="8" y="7.8" text-anchor="middle" font-size="3.2" font-weight="900" fill="${CREAM}" opacity="0"></text><g class="s-spin" opacity="0" style="transform-origin:8px 6.5px"><path d="M8 3.3A3.2 3.2 0 1 1 4.8 6.5" fill="none" stroke="${CREAM}" stroke-width="1.3" stroke-linecap="round"/></g><path class="s-ok" d="M5 6.6l2.2 2.2L11.2 4.6" fill="none" stroke="${CREAM}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity="0"/><g fill="${CREAM}">${[4, 8, 12].map((cx) => `<circle cx="${cx}" cy="16" r="1.2"/><circle cx="${cx}" cy="20" r="1.2"/>`).join('')}</g></svg>`,
  };

  const shelf = (x, hs) => `<div class="hk-shelf" style="--x:${x};--y:9;--w:26">${hs.map(([h, c]) => `<i style="--h:${h};--c:var(--${c})"></i>`).join('')}</div>`;
  const mats = (y, a, b) => `<i class="hk-mat" style="--x:${a};--y:${y};--c:var(--pink)"></i><i class="hk-mat" style="--x:${b};--y:${y};--c:var(--blue)"></i>`;
  const SETS = {
    room: `<div class="wall"></div><div class="floor"></div><i class="hk-door"></i><i class="hk-wc"></i><i class="hk-lamp" style="--x:30"></i><i class="hk-lamp" style="--x:70"></i>` +
      `<i class="hk-frame" style="--x:19;--y:9;--c:var(--cream)"></i><i class="hk-frame" style="--x:27;--y:7;--c:var(--pink)"></i><div class="hk-chalk"><i></i><i></i><i></i></div><i class="hk-dart"></i>` +
      `<i class="hk-pool" style="--x:58;--y:35;--w:24"><i style="--x:30;--y:50"></i><i style="--x:62;--y:42"></i></i><div class="counter"></div>${mats(79, 22, 78)}`,
    bar: `<div class="wall"></div><div class="floor"></div>${shelf(6, [[80, 'ink'], [95, 'blue'], [70, 'cream'], [88, 'sky'], [76, 'wood']])}${shelf(68, [[86, 'cream'], [74, 'ink'], [94, 'sky'], [70, 'blue'], [82, 'wood']])}` +
      `<div class="hk-mirror"></div><div class="counter"></div><div class="hk-taps" style="--x:50;--w:22"><i style="--c:var(--cream)"></i><i style="--c:var(--ink)"></i><i style="--c:var(--sky)"></i><i style="--c:var(--cream)"></i></div><div class="hk-till"></div>${mats(50, 18, 82)}`,
    // The back bar. Taps at stage x 35, 45, 55 and 65 (glasses go on the tray at y 80).
    // Put <div class="hk-mirror-room" data-cam="mirror">…figures…</div> inside the set for the reflection.
    back: `<div class="wall"></div>${shelf(2, [[80, 'ink'], [95, 'blue'], [70, 'cream'], [88, 'sky'], [76, 'wood']]).replace('--w:26', '--w:20').replace('--y:9', '--y:4')}${shelf(78, [[86, 'cream'], [74, 'ink'], [94, 'sky'], [70, 'blue'], [82, 'wood']]).replace('--w:26', '--w:20').replace('--y:9', '--y:4')}` +
      `<div class="hk-mirrorbb"><div class="hk-mirror-in"><div class="mwall"></div><div class="mfloor"></div><i class="mdoor"></i><i class="mlamp" style="--x:40"></i><i class="mlamp" style="--x:75"></i><div class="hk-mirror-room" data-cam="mirror"></div><div class="mcounter"></div></div><div class="tint"></div><div class="sheen"></div></div>` +
      `<div class="bcounter"></div><div class="hk-tray"></div><div class="hk-font"><i class="hk-tap" style="--x:16;--c:var(--cream)"></i><i class="hk-tap stout" style="--x:39;--c:var(--ink)"></i><i class="hk-tap" style="--x:61;--c:var(--sky)"></i><i class="hk-tap" style="--x:84;--c:var(--cream)"></i><b style="--x:16"></b><b style="--x:39"></b><b style="--x:61"></b><b style="--x:84"></b></div><div class="hk-till"></div>`,
  };

  /* ---------- Build ---------- */

  function build(root, clips) {
    let seed = 0;
    root.querySelectorAll('.hpt-shot').forEach((shot, i) => {
      if (!shot.querySelector('.hk-set, .hk-person, .hk-freeze')) return; // not a kit clip
      const clip = clips[i] || {}, dur = clip.dur || 10000, cue = clip.cue || 5000;
      shot.style.setProperty('--dur', `${dur}ms`);
      shot.classList.add('hk-shot');
      // Camera wrapper round everything but the clock and the freeze overlay.
      const cam = document.createElement('div');
      cam.className = 'hk-cam';
      const fz = shot.querySelector('.hk-freeze');
      [...shot.children].forEach((ch) => { if (!ch.classList.contains('hpt-clock') && ch !== fz) cam.appendChild(ch); });
      shot.appendChild(cam);
      if (fz) shot.appendChild(fz);
      shot.querySelectorAll('.hk-set[data-set]').forEach((s) => {
        // Figures the clip put inside a back set are the mirror's reflection: move them into the mirror room.
        const mine = s.dataset.set === 'back' ? [...s.children] : [];
        s.innerHTML = SETS[s.dataset.set] + (s.dataset.set === 'back' ? '' : s.innerHTML);
        s.classList.add('hk-' + s.dataset.set);
        const room = s.querySelector('.hk-mirror-room');
        mine.forEach((ch) => (room || s).appendChild(ch));
        // data-pull="tap:a-b; tap:a-b" on a back set pulls that tap handle (1 to 4) from a to b;
        // all of one tap's windows go into one track.
        const pulls = {};
        (s.dataset.pull || '').split(';').map((e) => e.trim()).filter(Boolean).forEach((e) => {
          const [n, range] = e.split(':');
          (pulls[n] = pulls[n] || []).push(range.split('-').map(Number));
        });
        Object.entries(pulls).forEach(([n, wins]) => {
          const tap = s.querySelectorAll('.hk-tap')[+n - 1];
          if (tap) emit(tap, [[0, 'transform:rotate(0deg);'], ...wins.flatMap(([a, b]) => [[a, 'transform:rotate(-34deg);'], [b, 'transform:rotate(0deg);']])], dur, 280);
        });
      });
      shot.querySelectorAll('.hk-arm1p').forEach((a) => {
        a.innerHTML = ARM1P(a.style.getPropertyValue('--skin') || SKIN.c, a.dataset.hand);
        if (a.dataset.wave) { const [w0, w1] = a.dataset.wave.split('-').map(Number); loop(a.firstChild, 'hk-wave1p', 520, w0, Math.max(1, Math.round((w1 - w0) / 520)), 'ease-in-out'); }
      });
      shot.querySelectorAll('.hk-prop[data-prop]').forEach((p) => { p.innerHTML = PROPS[p.dataset.prop] || ''; compileProp(p, dur); });
      shot.querySelectorAll('.hk-person').forEach((p) => compilePerson(p, dur, cue, (p.closest('[data-cam]') || shot).dataset.cam || 'sc', ++seed));
      shot.querySelectorAll('[data-on]').forEach((el) => compileOn(el, dur));
      shot.querySelectorAll('[data-pan]').forEach((el) => compilePan(el, dur));
      shot.querySelectorAll('[data-spin]').forEach((p) => loop(p, 'hk-spin', 700, +p.dataset.spin, +p.dataset.spinn || 8, 'linear'));
      if (fz) compileFreeze(shot, fz, dur, cue);
      shot.querySelectorAll('.hk-bub.me').forEach((b) => { const x = +(b.style.getPropertyValue('--x') || 50); if (x < 24) b.classList.add('edge-l'); if (x > 76) b.classList.add('edge-r'); });
    });
    flush();
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    css = '';
  }

  window.HazardKit = { build, pace, CAST, POSES, LOOPS, HANDS, PROPS, SETS, LANES, figure };
})();
