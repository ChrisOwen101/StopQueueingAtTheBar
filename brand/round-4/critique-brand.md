# Round 4 critique: seven marks, one to ship

Brand critique, 13 Oct 2026. Covers the seven concepts in `round-4.png` (drawn in `concepts.mjs`), the shortlist in `research-marketing.md` and section 5 of `research-landscape.md`. Every edit below was rendered at 400, 128 (reversed), 64, 32 and 16 px before it was written down. The test renders are not in the repo.

## 1. Scores

Five criteria, 1 to 5 each, 25 is the ceiling.

| # | Concept | Single file, not queueing | Still an order | Catchy | 16 px | Flat style | Total |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | The Turn | 4 | 2 | 4 | 5 | 5 | 20 |
| 2 | The Corner | 5 | 4 | 4 | 3 | 5 | 21 |
| 3 | Shirt Numbers | 2 | 5 | 4 | 2 | 4 | 17 |
| 4 | They Know | 2 | 5 | 3 | 2 | 3 | 15 |
| 5 | Column vs Row | 5 | 2 | 2 | 2 | 3 | 14 |
| 6 | Not A Post Office | 3 | 1 | 3 | 2 | 2 | 11 |
| 7 | The Turn, with people | 3 | 2 | 2 | 3 | 4 | 14 |

One line on each.

1. **The Turn.** A line that bends says "sideways" in one stroke and holds at 16 px better than anything else. But a bare arrow has no people in it, so it says nothing about order, and the glyph is a known one: down-then-right is the "sub-item" arrow, and most people will call it a return key.
2. **The Corner.** The single file drawn as a column of heads, turning the corner into a row along the bar, with an arrow that says "and so on". It is the only mark that shows the wrong shape and the right shape in one object, with no slash. The heads are a sequence, so order is implied. The top head is fused into the ring and the dots are small, so it drops to a smudge at 16 px as drawn. Fixable, see below.
3. **Shirt Numbers.** The best joke and the clearest statement of the invisible queue. It still shows three identical backs in a row, the isotype for "a queue" that the landscape report warns about, and below 40 px it is the current mark, which is the one that failed.
4. **They Know.** Tells the whole story, but it is a cartoon panel, not a mark. A front-view figure is a new rule, the bubble crowds the ring (2 units clear at the top right), and it is two blobs at 16 px.
5. **Column vs Row.** Explains everything and stands for nothing. The slash through the ring means "banned" to everyone. Drop.
6. **Not A Post Office.** A prohibition sign that passes the test only if you know the tagline. Slash through a ring. Drop.
7. **The Turn, with people.** An arrow pointing at a person is the universal "sign in" icon. It also reads as "go and stand next to that one", which is the barging reading we are trying to kill. Drop.

Both research reports back the same reading. The landscape report asks for the bar as the main shape, order shown, a positive form and no slash. Only 2 does all four. The marketing report asks for a name that keeps "queue" and says the change of shape. 2 is that name drawn.

## 2. Refinements for the top three

### The Corner (2): fix, and ship

What is wrong as drawn: the top head at (118,76) r 22 is 171 units from the centre at its far edge, and the ring's inner edge is at 155, so it is buried 16 units into the ring. The heads are r 22 with 8 units between them, which is right for fusing at small sizes, but the whole L sits too far left and too high. The arrow base sits on the bar top, so arrow and bar merge into one blob at 16 px.

Exact edits in the 400 box (ring and bar unchanged: `circle r=170 stroke-width=30`, `rect y=214 height=64` full width):

- Heads r 21, pitch 52. Column at x 146: centres (146,86), (146,138), (146,190). Row at y 190: (146,190), (198,190), (250,190). The corner head is shared. The top head's far edge is now 147 from the centre, 8 units clear of the ring. The bottom row's lower edge is at 211, 3 units above the bar, so they stand at it without touching.
- Arrow: `polygon points="280,160 280,214 334,187"`. Base on the bar top, 9 units clear of the last head, tip 134 from the centre. Centre line y 187, 3 units above the heads' centre line, which nobody can see.
- Nothing else. No numerals, no figures from behind, no tick.

Why this works at 16 px: the 10 unit gaps between heads are 0.4 px, so the five heads fuse into a solid L with a point on the end, sitting on a bar, inside a ring. That L is the message. At 32 px the heads separate and it reads as a queue of dots turning the corner. At 64 px, the lockup size, it is fully legible. The reversed set needs no change.

Optional, not required: for the maskable app icon the landscape report's "mandatory disc" idea works here with no redrawing, a filled ink disc with the heads, arrow and bar knocked out in paper. Keep the ring version as the mark.

### The Turn (1): fix is cheap, but drop it for the Corner

The return-key read is real and the fix is not in the geometry, it is in the content: the only thing that stops a bent arrow being a glyph is making it out of the queue, and that is the Corner. So drop 1. For the record, the edits that make it as good as it gets:

- Shaft: `path d="M138,50 V116 A44,44 0 0 0 182,160 H262" stroke-width=44`. Starting at y 50 puts the shaft's top inside the ring stroke at that x (the inner edge is at y 58 there), so the line clearly comes in from the edge rather than stopping short of it as now.
- Head: `polygon points="254,116 254,204 338,160"`. 10 units above the bar, so the head and the bar separate at every size above 32 px, and the tip is 138 from the centre.
- Shaft centre line y 160, underside y 182, 32 units above the bar.

Rendered, this is cleaner than the current 1 and still a return key.

### Shirt Numbers (3): fix the numerals, keep as the fallback

- The stroke numerals at width 8 are 1.3 px at 64 px and gone at 40 px. Go to width 9 and 36 units tall (scale the three paths by 36/32 about their baselines) so they hold to 48 px. The "1" has a flag of 10 units; make it 12 so it is not a bare stroke.
- Leave the order as 2, 1, 3. That is the joke.
- The uneven spread is in section 3. It helps the "not a row" reading and hurts the numerals, and it does not fix 16 px, so this concept stays the fallback for a no-rename budget.

## 3. Two hybrids

### The Turn with a shaft of heads turning into a row of people

Not worth a spec. The shaft would be a plan view (heads as dots) and the row would be the behind view (`FIG` figures with shoulders). Two cameras in one 400 box, and the eye reads it as dots and tadpoles. Drawn in one view it collapses into the Corner: a column of heads turning into a row of heads is exactly concept 2, and the Corner already has the arrow to say "and so on". If the row must show people rather than dots, the honest version is the Corner with every head drawn as a dot, which it is. So the hybrid does not beat the Corner; it is the Corner.

### Shirt Numbers, spread unevenly

Specified for completeness, because it is the best "keep the name" mark, but it does not beat the Corner.

- Figures: `FIG` at (92,136), (172,136), (308,136). The gap between the second and third shoulders runs from x 206 to x 274, which is 68 units, one person wide. It reads as a space left for you.
- Numerals in paper, baseline y 208, width 9: "2" at x 92, "1" at x 172, "3" at x 308.
- Clearances: the left head's edge is at x 67 and the ring's inner edge at that height is x 59. The right shoulder's edge is at x 342 and the inner edge at the shoulder top is x 351. Both clear.

Rendered, the gap does read, and the mark no longer looks like a row. But at 16 px it is the current mark, and the out-of-order numerals plus a gap is two jokes in one frame, which is one too many. Score: 3, 5, 4, 2, 4, total 18. Still behind the Corner and the Turn.

## 4. The pick

**Ship The Corner (2), refined as in section 2. Name: Queue Sideways. Tagline: "They know who’s next. They always did."**

Why this reconciles the three reports:

- The brand report wanted a mark that says "still a queue, just not that one" in the shape itself. The Corner does it with no words: a queue of heads turns the corner and runs along the bar. No slash, no "don't", nobody barging.
- The marketing report shortlisted Queue Sideways first, because it keeps "queue", says the change of shape in one word, fits the 40 px lockup ("queue" / "sideways.", 5 and 9 characters) and is the only name bar staff can say out loud as a request. The Corner is that name drawn. The marketing report's other two, Queue Along The Bar and the kept name with "Along it. Not at it.", both fit the Corner too, but the first is plainer and the second still says "don't queue" on the mat front, which is where the misreading happens.
- The landscape report wanted the bar as the main shape, order shown, a positive form and no slash, and warned against "don't" as the first word. The Corner has the bar overhanging the ring, a sequence of heads with an arrow, a ring, no slash, and the name opens with "queue". Its own name candidate, The Bar Is The Queue, needs a beat that a name cannot ask for. It is the right heading for the Cluster chapter on the page, and it stays there.
- The tagline carries the half of the feedback the name does not. "Queue Sideways" settles "not queueing in general". "They know who’s next. They always did." settles the invisible queue and credits the barperson with it. One tagline everywhere: the hero, the mat front under the stamp and the OG description. Where the ring text on the mat is tight, the short form "They know who’s next." is enough.

What changes if this ships: `markBody` in `scripts/lib/brand.mjs` becomes the Corner (ring and bar stay; the three `FIG` figures go; five heads and the arrow come in), the stamp's words become "queue / sideways." in the ring, the lockup text follows, the `aria-label` on every mark is rewritten, `SITE_URL` in `scripts/build-mats.mjs` waits for the domain check in the marketing report (nothing is registered yet), and `brand/BRIEF.md` and `DESIGN.md` lose the "always three figures" and "from behind" rules. The mat back's QR tile keeps its 64 unit footprint, so the decode test re-runs as is. `FIG` stays in the module for the seals and any future figure work.
