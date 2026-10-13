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

// Stroke numerals 1, 2, 3 drawn as paths (no font), about 32 tall, centred on x with baseline y.
export const numeral = (c, x, y, n, w = 8) => {
  const d = {
    1: `M${x - 9},${y - 23} L${x + 1},${y - 32} V${y}`,
    2: `M${x - 10},${y - 23} A10,10 0 1 1 ${x + 8},${y - 15} L${x - 11},${y} H${x + 11}`,
    3: `M${x - 10},${y - 27} A10,9 0 1 1 ${x + 1},${y - 15} A10,9 0 1 1 ${x - 10},${y - 4}`,
  }[n];
  return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
};

const paper = (c) => (c === '#000' ? '#fff' : '#000');

CONCEPTS.push(
  {
    n: 1, id: '01-the-turn', title: 'The Turn', words: ['queue along', 'the bar.'], tab: 'Queue Along The Bar',
    idea: 'The queue line comes down towards the bar and bends to run along it. Still a queue, just sideways.',
    body: (c) => `
  ${ring(c)}
  <path d="M150,62 V124 A44,44 0 0 0 194,168 H270" fill="none" stroke="${c}" stroke-width="44"/>
  <polygon points="262,114 262,214 340,166" fill="${c}"/>
  ${bar(c)}`,
    note: 'No figures. Three shapes, so it holds at 16px. Pair with "queue along the bar." or "queue sideways."',
  },
  {
    n: 2, id: '02-the-corner', title: 'The Corner', words: ['queue', 'sideways.'], tab: 'Queue Sideways',
    idea: 'The single file itself turns the corner: a column of heads bends into a row along the bar, last one with an arrow.',
    body: (c) => `
  ${ring(c)}
  <g fill="${c}">
    <circle cx="128" cy="84" r="24"/><circle cx="128" cy="136" r="24"/>
    <circle cx="128" cy="184" r="24"/><circle cx="184" cy="184" r="24"/><circle cx="240" cy="184" r="24"/>
    <polygon points="276,150 276,214 338,182" />
  </g>
  ${bar(c)}`,
    note: 'Heads only, plan view of the turn. The arrow says "and so on along the bar".',
  },
  {
    n: 3, id: '03-shirt-numbers', title: 'Shirt Numbers', words: ['they know', 'who’s next.'], tab: 'Don’t Queue At The Bar',
    idea: 'The current roundel with the arrival order on their backs, out of position on purpose: 2, 1, 3. The barperson knows.',
    body: (c) => `
  ${ring(c)}
  <g fill="${c}">${fig(108, 136)}${fig(200, 136)}${fig(292, 136)}</g>
  ${numeral(paper(c), 108, 208, 2)}${numeral(paper(c), 200, 208, 1)}${numeral(paper(c), 292, 208, 3)}
  ${bar(c)}`,
    note: 'Numerals are stroke paths, no font. Identical to the current mark below 40px.',
  },
  {
    n: 4, id: '04-they-know', title: 'They Know', words: ['they know', 'who’s next.'], tab: 'Don’t Queue At The Bar',
    idea: 'The barperson behind the bar, the queue held in a thought bubble. The order is in their head.',
    body: (c) => `
  ${ring(c)}
  <g fill="${c}">${fig(150, 165)}
    <circle cx="182" cy="140" r="6"/><circle cx="203" cy="128" r="9"/><circle cx="255" cy="112" r="50"/>
  </g>
  <g fill="${paper(c)}" transform="translate(226,99) scale(0.38)">${fig(0, 0)}${fig(76, 0)}${fig(152, 0)}</g>
  ${bar(c)}`,
    note: 'Front view, no face. Soft below 32px; best on the barperson seal and the flyer.',
  },
  {
    n: 5, id: '05-column-vs-row', title: 'Column vs Row', words: ['single file: no.', 'along the bar: yes.'], tab: 'No Single File',
    idea: 'The site’s dot diagram as a mark. The single file struck out, the spread along the bar ticked.',
    body: (c) => `
  ${ring(c)}
  <g fill="${c}">
    <circle cx="120" cy="100" r="18"/><circle cx="120" cy="146" r="18"/><circle cx="120" cy="192" r="18"/>
    <circle cx="224" cy="192" r="18"/><circle cx="270" cy="192" r="18"/><circle cx="316" cy="192" r="18"/>
  </g>
  <line x1="78" y1="196" x2="162" y2="96" stroke="${c}" stroke-width="22"/>
  <path d="M236,118 L258,142 L300,96" fill="none" stroke="${c}" stroke-width="20"/>
  ${bar(c)}`,
    note: 'A diagram more than a mark. Needs 32px.',
  },
  {
    n: 6, id: '06-not-a-post-office', title: 'Not A Post Office', words: ['it’s a pub.', 'not a post office.'], tab: 'Don’t Queue At The Bar',
    idea: 'A rope-barrier post, the single file’s own furniture, at the bar and struck through.',
    body: (c) => `
  ${ring(c)}
  <g fill="${c}"><ellipse cx="200" cy="212" rx="54" ry="12"/><circle cx="200" cy="72" r="18"/><rect x="190" y="80" width="20" height="140"/></g>
  <path d="M190,118 Q130,150 62,126" fill="none" stroke="${c}" stroke-width="16"/>
  <line x1="112" y1="66" x2="288" y2="200" stroke="${c}" stroke-width="24"/>
  ${bar(c)}`,
    note: 'A prohibition sign. Passes the test through the tagline, not by itself.',
  },
  {
    n: 7, id: '07-the-turn-with-heads', title: 'The Turn, with people', words: ['queue along', 'the bar.'], tab: 'Queue Along The Bar',
    idea: 'The bent arrow lands among the people already spread along the bar: the queue turns and joins the row.',
    body: (c) => `
  ${ring(c)}
  <path d="M118,58 V98 A40,40 0 0 0 158,138 H200" fill="none" stroke="${c}" stroke-width="30"/>
  <polygon points="196,104 196,172 246,138" fill="${c}"/>
  <g fill="${c}">${fig(292, 136)}</g>
  ${bar(c)}`,
    note: 'One figure keeps the “people” equity; the arrow is the message.',
  },
  {
    n: 8, id: '08-the-disc', title: 'The Disc (figure-ground)', words: ['the bar is', 'the queue.'], tab: 'The Bar Is The Queue',
    idea: 'A filled disc, the bar cut through it in paper, three paper heads along it with their order inside. Big, it reads order; small, a bar with three dots.',
    body: (c) => `
  <circle cx="200" cy="200" r="185" fill="${c}"/>
  <rect x="0" y="214" width="400" height="56" fill="${paper(c)}"/>
  <g fill="${paper(c)}"><circle cx="104" cy="166" r="30"/><circle cx="200" cy="166" r="30"/><circle cx="296" cy="166" r="30"/></g>
  ${numeral(c, 104, 182, 2, 9)}${numeral(c, 200, 182, 1, 9)}${numeral(c, 296, 182, 3, 9)}`,
    note: 'Mandatory-sign feel (do this), no slash. The numerals go at small sizes and nothing is lost.',
  },
  {
    n: 9, id: '09-shirt-numbers-spread', title: 'Shirt Numbers, spread', words: ['they know', 'who’s next.'], tab: 'Don’t Queue At The Bar',
    idea: 'Shirt Numbers with the figures spread unevenly, so it reads as people at a bar rather than a row.',
    body: (c) => `
  ${ring(c)}
  <g fill="${c}">${fig(96, 136)}${fig(176, 136)}${fig(300, 136)}</g>
  ${numeral(paper(c), 96, 208, 2)}${numeral(paper(c), 176, 208, 1)}${numeral(paper(c), 300, 208, 3)}
  ${bar(c)}`,
    note: 'The gap says "spread out". 3 arrived last and stood where there was room.',
  },
  {
    n: 10, id: '10-spread', title: 'Spread', words: ['spread along', 'the bar.'], tab: 'Spread Along The Bar',
    idea: 'One arrow comes down to the bar and forks both ways along it. The single file arrives and spreads out.',
    body: (c) => `
  ${ring(c)}
  <path d="M200,56 V158 M96,158 H304" fill="none" stroke="${c}" stroke-width="40"/>
  <polygon points="40,158 104,110 104,206" fill="${c}"/><polygon points="360,158 296,110 296,206" fill="${c}"/>
  ${bar(c)}`,
    note: 'Not a return key: a T with two heads. Holds at 16px.',
  },
  {
    n: 11, id: '11-spread-with-people', title: 'Spread, with people', words: ['spread along', 'the bar.'], tab: 'Spread Along The Bar',
    idea: 'The forked arrow over the heads of two people already at the bar, one each side. Join them, don’t line up behind them.',
    body: (c) => `
  ${ring(c)}
  <path d="M200,56 V128 M122,128 H278" fill="none" stroke="${c}" stroke-width="32"/>
  <polygon points="74,128 128,90 128,166" fill="${c}"/><polygon points="326,128 272,90 272,166" fill="${c}"/>
  <g fill="${c}">${fig(96, 150, 0.82)}${fig(304, 150, 0.82)}</g>
  ${bar(c)}`,
    note: 'Arrow plus the two bodies. Busier than 10.',
  },
  // ---------- Finalists, refined after the critiques ----------
  {
    n: 12, id: '12-the-corner-refined', title: 'The Corner, refined', words: ['queue', 'sideways.'], tab: 'Queue Sideways',
    idea: 'Five heads r21 at pitch 52, the L clear of the ring and 3 units above the bar, the arrow 9 units clear of the last head.',
    body: (c) => `
  ${ring(c)}
  <g fill="${c}">
    <circle cx="146" cy="86" r="21"/><circle cx="146" cy="138" r="21"/>
    <circle cx="146" cy="190" r="21"/><circle cx="198" cy="190" r="21"/><circle cx="250" cy="190" r="21"/>
    <polygon points="280,160 280,214 334,187"/>
  </g>
  ${bar(c)}`,
    note: 'Brand critique’s pick. Marketing critique: reads as media controls (dots and a play button).',
  },
  {
    n: 13, id: '13-the-corner-no-arrow', title: 'The Corner, no arrow', words: ['queue', 'sideways.'], tab: 'Queue Sideways',
    idea: 'The same L of heads with a sixth head instead of the arrow: the file comes down and lies along the bar. No play button.',
    body: (c) => `
  ${ring(c)}
  <g fill="${c}">
    <circle cx="134" cy="86" r="21"/><circle cx="134" cy="138" r="21"/>
    <circle cx="134" cy="190" r="21"/><circle cx="186" cy="190" r="21"/><circle cx="238" cy="190" r="21"/><circle cx="290" cy="190" r="21"/>
  </g>
  ${bar(c)}`,
    note: 'Six heads, one shape. Answers the media-controls read.',
  },
  {
    n: 14, id: '14-the-turn-refined', title: 'The Turn, refined', words: ['queue', 'sideways.'], tab: 'Queue Sideways',
    idea: 'The shaft enters from the ring edge, the head sits 10 units above the bar.',
    body: (c) => `
  ${ring(c)}
  <path d="M138,50 V116 A44,44 0 0 0 182,160 H262" fill="none" stroke="${c}" stroke-width="44"/>
  <polygon points="254,116 254,204 338,160" fill="${c}"/>
  ${bar(c)}`,
    note: 'Marketing critique’s pick. Brand critique: still a return key.',
  },
);
