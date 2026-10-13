# Round 4: the mark has to say "still a queue, just not that one"

Brand identity research, 13 Oct 2026. Branch `brand-identity-round-4`. This answers one piece of feedback: the Cluster roundel and the type stamp read as "don't queue at all" or "no queue, barge in". The campaign is against the single file. The Cluster is still a queue. The bar staff hold it in their heads and serve people in the order they arrived. The mark has to carry that.

Every concept below was sketched as SVG in the 400 box and rendered at 400, 128 (reversed), 64, 32 and 16 px during this research, so the coordinates are tested, not guessed. The sketches are not in the repo. The specs are complete enough to go straight into `scripts/lib/brand.mjs`.

## 1. Diagnosis

- The roundel shows three people at a bar. Nothing in it says "order". Three backs in a row is a crowd, not a queue. Next to the words "don't queue" it reads as a mob with permission.
- The stamp is worse, because it is the words alone: "don't queue / at the bar." There is no "single file" in it and no "instead".
- The forbidden thing never appears. You cannot read "not that queue" when the mark only ever shows one arrangement of people. Round 1 tried the contrast (03 Wrong / Right) and the prohibition (02 No single file) and dropped both for showing the wrong thing. That left a mark that shows nothing wrong and nothing ordered, which is where the feedback comes from.
- The one thing that fixes it is a trace of sequence or a trace of turning. A pass needs one of three things in the shape itself, not the caption:
  - (a) **the contrast**: the column and the row in one frame, with a judgement.
  - (b) **the invisible queue**: an order the viewer can see but the floor does not show (numbers, a sequence, the barperson's head).
  - (c) **the turn**: the queue still exists, it just lies along the bar instead of pointing at it. A line that bends 90 degrees says "queue, sideways" in one stroke.
- Whatever ships, the stamp's words change too. "don't queue / at the bar." on its own is the real culprit, and the stamp leads on the mat front and the flyer.

## 2. Six concepts

Common parts, so they slot into the favicon, QR tile, lockup and seal without touching those scripts. Box 400 x 400. Ring: `circle cx=200 cy=200 r=170 stroke-width=30` (outer radius 185). Bar: `rect x=0 y=214 width=400 height=64`, full width, so it overhangs the ring as now. `FIG` as in `brand.mjs`: head r 25 at the origin, shoulders 68 wide from y 30 to y 78, neck gap 5. "Ink" is the mark colour, "paper" the background. One colour throughout: everything is filled ink unless it says paper.

Strategies: (a) contrast, (b) invisible queue, (c) the turn.

### 01 The Turn (c)

- **Idea:** the queue line comes down towards the bar and bends to run along it.
- **At a glance:** an arrow that was heading for the bar and turned sideways. "Queue this way."
- **Spec:** ring and bar as above. Shaft: `path d="M150,62 V124 A44,44 0 0 0 194,168 H270" fill=none stroke=ink stroke-width=44 stroke-linecap=butt`. The shaft top sits at y 40, inside the ring stroke (the ring's inner edge is at y 53 at x 150), so the line comes in from the edge of the roundel. Head: `polygon points="262,114 262,214 340,166"` filled ink. The head's base sits on the bar top (y 214), so the arrow lands on the bar. Gap from the shaft underside (y 190) to the bar: 24 units. No figures.
- **At 16 px:** a hook on a bar inside a ring. It is the clearest of the six at 16 px, because there are only three shapes.
- **Risks:** on its own a bent arrow is a road sign or the return key. The bar underneath is what makes it a bar, so the overhang is not optional here. People may ask "turn right into what?", which the lockup line answers. The reversed version is identical in character.

### 02 The Invisible Line (c)

- **Idea:** the counter carries a dashed queue line along its length, like a taped line on a floor, except it runs along the bar, not up to it.
- **At a glance:** the current roundel with a dashed stripe in the bar. "The queue runs this way."
- **Spec:** ring, bar and the three figures exactly as now (`FIG` at (108,136), (200,136), (292,136)). Add `line x1=0 y1=246 x2=400 y2=246 stroke=paper stroke-width=14 stroke-dasharray="26 18" stroke-dashoffset=-5`, drawn after the bar so it cuts paper-coloured dashes out of the counter. Nine dashes across the width, running off both ends with the overhang.
- **At 16 px:** the current mark with a lighter bar. The dashes blur into a grey stripe at 16 and 32 px, and only resolve at 48 px and up.
- **Risks:** a dashed horizontal band is a road. Some will see a pedestrian crossing. It also keeps the three backs, which is the part that reads as a crowd, so it fixes the least of the six. Good as a secondary device (the mat edge, the flyer rule) rather than as the mark.

### 03 Shirt Numbers (b)

- **Idea:** the current roundel, with the arrival order on the figures' backs. Out of position on purpose: 2, 1, 3.
- **At a glance:** three people at the bar, numbered. The one in the middle got there first. The barperson knows.
- **Spec:** ring, bar and figures as now. Numerals cut out of the shoulders in paper: Avenir Next Heavy, `font-size=46`, `text-anchor=middle`, baseline y 210, at x 108 ("2"), 200 ("1"), 292 ("3"). The numeral sits between y 177 and 210, inside the shoulder shape (y 166 to 214), with at least 10 units of ink round it. Draw the three numerals as paths once, on a Mac, and paste the paths into `brand.mjs`; the mark must not carry live text, because the icon pipeline renders on Linux.
- **At 16 px:** identical to the current mark. The numerals go at 40 px and below (a numeral is 2 px tall at 16 px). At 64 px (the homepage lockup) they are 7 px tall and just legible.
- **Risks:** the favicon is unchanged, so the smallest sizes still fail the test. 2 1 3 can look like a mistake until the viewer gets it, which is also the joke. Numbers on backs read as a sports team, which is friendly. The numerals must be outlined paths, not text.

### 04 They Know (b)

- **Idea:** the barperson behind the bar, with the queue held in a thought bubble. The order is in their head.
- **At a glance:** a person behind the bar, thinking of three people in a row. "They know who's next."
- **Spec:** ring and bar as above. The barperson: `FIG` at (150,165), drawn before the bar so the counter hides the figure from the chest down (the bar is in front of them). Thought trail: `circle cx=182 cy=140 r=6` and `circle cx=203 cy=128 r=9`. Bubble: `circle cx=255 cy=112 r=50` (its edge comes within 2 units of the ring's inner edge at the top right). Inside the bubble, in paper: three `FIG` in a group `transform="translate(226,99) scale(0.38)"` at local x 0, 76 and 152, so heads of r 9.5 at stage x 226, 255 and 284, y 99, shoulders down to y 129. No face on anyone.
- **At 16 px:** two blobs over a bar: a head and a bubble. It still reads as "a person with a thought", which is more than the current mark says, but the three in the bubble are gone below 32 px.
- **Risks:** the softest of the six at small sizes. The barperson is seen from the front, which is a new rule (the current mark only shows backs); the brief would need to allow a front view with no face. It is the best storyteller, so it suits the barperson licence seal, the flyer and social, more than the browser tab.

### 05 Column vs Row (a)

- **Idea:** the site's own dot diagram as a mark. Plan view, the single file struck out, the spread along the bar ticked.
- **At a glance:** stack with a slash, row with a tick. "Not like that. Like this."
- **Spec:** ring and bar as above. Column (wrong): `circle r=18` at (120,100), (120,146), (120,192). Row (right): `circle r=18` at (224,192), (270,192), (316,192), all touching the bar top. Strike: `line x1=78 y1=196 x2=162 y2=96 stroke=ink stroke-width=22`, which passes through the centre of the middle dot. Tick: `path d="M236,118 L258,142 L300,96" fill=none stroke=ink stroke-width=20 stroke-linecap=butt`.
- **At 16 px:** a speckle over a bar. The slash survives as a dark stroke on the left and the row as a smear on the right. It needs 32 px to read.
- **Risks:** it is a diagram, not a mark: it explains rather than stands for. It shows the wrong behaviour, which Round 1 chose to avoid. The red and green of the page would improve it, and the mark is one colour by rule. Strong on a beer mat and in the "how to" chapter; weak as a favicon.

### 06 Not A Post Office (a)

- **Idea:** a rope-barrier post, the single file's own furniture, standing at the bar and struck through. The site's tagline as a picture.
- **At a glance:** no rope barriers here. "It's a pub. Not a post office."
- **Spec:** ring and bar as above. Post knob: `circle cx=200 cy=72 r=18`. Post: `rect x=190 y=80 width=20 height=140`. Base: `ellipse cx=200 cy=212 rx=54 ry=12`, drawn before the bar so the counter hides its lower half. Strap: `path d="M190,118 Q130,150 62,126" fill=none stroke=ink stroke-width=16`, sagging to the ring on the left; its end at x 62 is inside the ring stroke, so it reads as clipped to the ring. Strike: `line x1=112 y1=66 x2=288 y2=200 stroke=ink stroke-width=24`, top left to bottom right, the prohibition-sign convention, both ends inside the ring stroke.
- **At 16 px:** a slash and a stick on a bar. It reads as "no something" at 16 px and as "no barrier post" from 32 px.
- **Risks:** it is a prohibition sign, and the contrast is by reference only (the pub bar against the post office prop), so it passes the test through the tagline rather than by itself. It is also the only concept that could be read as "no queue barriers" rather than "no single file" by someone who has never queued at a post office.

## 3. Wordmark lines

Two lines, lowercase, in the site's voice. "Name change" says whether the concept needs the campaign to stop being called Don't Queue At The Bar. Another agent is working on the name; these are the lines each mark wants beside it.

| Concept | Lockup line | Name change |
| --- | --- | --- |
| 01 The Turn | "queue along / the bar." | Yes, ideally: "Queue Along The Bar". It also works under the current name with "don't queue at the bar. / queue along it." as the stamp. |
| 02 The Invisible Line | "still a queue. / just sideways." | No. |
| 03 Shirt Numbers | "they know / who's next." | No. The stamp becomes "don't queue at the bar. / they know who's next." |
| 04 They Know | "they know who's next. / don't queue at the bar." | No. |
| 05 Column vs Row | "single file: no. / along the bar: yes." | No, though "No Single File" fits it better than the current name. |
| 06 Not A Post Office | "it's a pub. / not a post office." | No. The tagline becomes the wordmark. |

## 4. Ranking

1. **01 The Turn. Ship this.** It is the only concept where the shape itself says both halves of the argument: the line keeps going (it is still a queue) and it bends away from the bar (not the single file). It needs no words, no numerals and no faces, so it is one colour and flat without compromise, and it is the best of the six at 16 px. It keeps the roundel and the overhanging bar, so the favicon, the QR tile on the mat back, the lockup and the seals change their centre and nothing else. It drops the three backs, which are the part that read as a crowd. Pair it with "queue along the bar." and the "turn right into what?" question answers itself.
2. **03 Shirt Numbers.** The right choice if the name must not change and the roundel's equity matters more than the favicon. It passes the test from 48 px up and is the funniest of the six. It fails at the tab size, where it is the current mark. If both the Turn and the numbers appeal, the numbers can live on the mat and the seals as a secondary piece, but the mark should stay one drawing.
3. **04 They Know.** The best story and the clearest statement of the invisible queue. Too soft below 32 px to be the mark. Keep it for the barperson licence seal, the flyer and social, where it has room.

Dropped: 02 fixes the least and still looks like a road; 05 explains rather than stands for anything; 06 depends on the tagline being read.

What changes if the Turn ships: `markBody` in `scripts/lib/brand.mjs` (the ring and bar stay, the figures go, the arrow comes in), the three writer scripts re-run, the stamp's words, the `aria-label` on every mark, and the "always three figures" and "never redraw" rules in `brand/BRIEF.md` and `DESIGN.md`. The mat back QR tile keeps the same 64 unit footprint, so the decode test only needs re-running, not re-tuning.
