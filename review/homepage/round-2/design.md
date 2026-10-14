# Homepage round 2: design

Design specialist, 14 Oct 2026, after reading `round-1/copy.md` and `round-1/marketing.md` in full. Measurements below were taken in Chromium at 1280×800, 1366×768 and 390×844 with the fallback font (Inter); Avenir Next sets about 5% wider, and every line break quoted has that much room.

## 1. Where the three of us already agree

- **The argument folds, the headlines state the idea, the names move to the kickers.** Copy's picks "Four staff. One working." (the problem) and "Spread out." (the solution), with "the single file" and "the cluster" as kickers; "Same pub. Same Thursday." becomes a caption. The side-by-side with live scores is the proof and arrives on the first argument screen (marketing's §2, my A).
- **"25 minutes. Or six." stays, folded in**, with the "worked example" stamp and copy's eight-word honesty line ("Arithmetic, not a stopwatch. Real pubs are messier."). The Friday line (90 and 48) leaves the comparison and goes to the pubs chapter as throughput (copy §4, marketing §4).
- **The vote is a fixed pill from screen 2, hidden on the hero and on any screen with its own ask; the stored values stay `cluster`/`single`.** Its state comes from the `GET /api/poll` the page already makes; the pill and the poll screen share one state; "Changed your mind?" stays on the screen; nothing scrolls on its own; a no-JS route exists.
- **No sticky banner.** Marketing and I made the same case (a strip of every viewport, a permanent second ask, sits on the lockup). Copy's banner strings survive as pill and poll-screen strings (§2.2).
- **Petition higher; the hero keeps one ask (the sticker).** The count stays on the petition screen in copy's wording.
- **`/history` is a vertical page** with copy's title ("Why do people queue in pubs now? · Don’t Queue At The Bar"), H1 "Blame 2020. Mostly.", standfirst, the eight stops plus the three new ones the register supports, marketing's questions section and JSON-LD, its own meta, and links to the test and the petition. The home page keeps a trailer led by the live counter (copy's pick 1, marketing §5). The home page loses the strip and its script.
- **The pubs chapter is a landing** (`#pubs`, later `/pubs`): the poster first and as the pledge ("The pledge is the poster." is copy's pick and marketing's decision), the money as "waiting to be poured", never "losing"; the mats "coming soon"; the calculator and the pledge table wait. "Stick us behind your bar." heads it.
- **How-to and the test teaser: untouched.** The sticker gains its apostrophe.
- **Register first.** Every new figure gets a row before it goes on a page; the prototypes are unlinked and `noindex`, so rows can land during Round 3, but before any merge.

## 2. Where I'd change their proposals

### 2.1 The headline pair fits the one-screen verdict (measured)

I rebuilt the verdict with copy's strings: kicker + headline over each sim (a column each), the caption under the pair, the two bars, the stamp and honesty line, 5vh padding, the paired sims capped at 40vh tall, side padding `max(6vw, 150px)` so the pill never sits on a sim. Headlines at `clamp(2.2rem, 4.5vw, 4rem)` (a step under `.big`: `.big` wraps "four staff. one working." to three lines in a 465px column).

| | 1280×800 | 1366×768 | 390×844 |
| --- | --- | --- | --- |
| Screen height | 1.0 vp (content 699px) | 1.0 vp (694px) | 1.21 vp |
| "four staff. one working." | 2 lines at 58px | 2 lines at 61px | 2 lines at 32px |
| "spread out." | 1 line | 1 line | 1 line |

So yes: copy's two-headline pair is the feedback's "a headline above each illustration" and it fits one laptop screen. One layout note for the build: with headlines of different line counts the sims sit at different heights; the grid gets a headline row aligned to the bottom and a sim row, so the two stages line up. Marketing's two-screen split (the pair on red, the arithmetic on green) is the contrasting alternative I'll build (§4), not the recommendation: it costs a second viewport to say what one says, and a Cluster sim on a red block is the one place the colour meanings wobble.

### 2.2 The pill: copy's words, marketing's states, one change to each

- **Words (copy):** "Stop the queue?" as the resting question, **Stop / Keep** as the buttons, "Stop 61% · Keep 39%" with a small "you" after a vote. All fit the 118px pill: the question on two lines at 0.8rem, the buttons on one, "Sign the petition" and "Take the test" on two at 0.78rem (drop the arrow in the pill; it wraps alone). The poll screen changes to match ("Stop it" / "Keep it", chart rows Stop / Keep, the quips). `script.js` and `pollWords` in `src/worker.js` change together at merge.
- **States (marketing):** off, vote, result, sign, test, signed, not counted. I take all seven. The post-vote pill carries the next step by side (sign → `#petition-section`; test → `/hazard`), which is the brief's "link the two" without a banner; copy's banner line "You voted. Now make it count." becomes the poll screen's lead-in to its own CTA, and "Make it count." is the phone pill's post-vote kicker. Signed → "Tell a mate" through the form's share routine.
- **Change one: no expand-on-tap on desktop.** Marketing's collapsed "Pick a side" that opens on tap makes the vote two taps and the resting pill a mystery. At 118px wide the question and both buttons fit at rest; it's one tap, as the feedback asked. The result state is the split plus the next step plus a plain "full result ↓" to `#poll`; the lead line stays on the screen (it is 45 characters and would be four lines in the pill).
- **Change two: the pill's amber is the kicker, never a filled button.** My Round 1 made the post-vote petition button amber; marketing's rail note is right that a fixed amber button fights each screen's one amber (the verdict's scores, the how-to's pint, the trailer's count). The pill keeps the rail's recipe: ink, cream text, cream outlines, the 0.62rem amber kicker ("VOTE", "NEXT", "SIGNED"), which is the amber the rail already puts on every screen.
- **Change three (mine): phones get a pill, not a bar.** My Round 1 bottom bar costs 56px of every screen, which is marketing's own argument against the banner. Phones get a collapsed ink pill bottom right, 48px tall, reading "Vote" (copy's word); a tap expands it in place to "Stop the queue?" with Stop / Keep and a × ("Hide this"); after a vote it reads "Sign the petition" or "Take the test" (ink, cream text; the amber kicker "Make it count."), and "Stop 61%" goes to the poll screen. Two taps to vote on a phone, zero viewport cost. The how-to's stage gets 60px of bottom clearance on phones so the pill never covers the end caption.

### 2.3 One order: the petition at screen 3

Marketing puts the petition straight after the proof ("desire peaks at the proof; the Sold? link at 3.4 vh proved the moment") and makes the vote the pill's job; I put the poll screen straight after the proof. Marketing's case is the stronger one: signatures are the measure, a vote costs one tap wherever you are, a form needs a screen, and the pill makes the vote reachable from screen 2 anyway. I concede. With the one-screen verdict, marketing's "screen 4" is screen 3: the form is at about 2.05 vp (from 14.7). The "Sold? Sign the petition." link goes (the form is the next screen). The poll screen goes after the test teaser and before the history trailer: it is the results' home, the "Changed your mind?" flow and the no-JS vote, and from there the page is for people who have decided (readers, publicans). Two asks never share a screen: the pill hides on the petition and on the poll.

### 2.4 The money figure: £224, "waiting to be poured"

I proposed £769 an hour of capacity (144 × £5.34); copy and marketing both use 42 × £5.34 ≈ £224 an hour waiting. Theirs is the honest one: capacity reads as a promise, waiting is what the arithmetic can say. Picked: copy's line (b), the 42 waiting at the worked example's Friday, "about £224 an hour waiting to be poured", with copy's caveat ("Illustrative. The pint is the UK average (Morning Advertiser, Apr 2026). The Friday is made up. Your pub is yours."). The chapter's big number is marketing's "48 an hour. Or 192." (orders, not pounds; a pound figure at Mega reads as a claim); the £224 is a sentence under it.

The RESEARCH.md row, "On the page", location code P (the pubs chapter): "On the worked example’s Friday, 90 orders an hour, one spot on the bar serves 48. That leaves 42 an hour in a line. At the average pint, £5.34, that’s about £224 an hour waiting to be poured." | Derived: 90 − 48 = 42 (row M's Friday and 3,600 ÷ 75); 42 × £5.34 = £224.28; the price is the Reserves row "Average draught pint £5.34 (Apr 2026)", Morning Advertiser price survey, 21 May 2026, promoted to On the page with the same URL | derived + S | Medium-high (the price's grade) | stamped "worked example", caveat on the same screen, never "lost", "takings" or a named pub | [ ]. A second row for "48 an hour. Or 192." (3,600 ÷ 75; × 4), derived, High.

### 2.5 Smaller points

- **The hero:** marketing's quiet "Run a pub?" door, not my count line (copy prefers the count on the petition screen; agreed) and not copy's vote line (a link to a pill that isn't on screen yet). The door is a 40px outline pill, top right, level with the lockup, "Run a pub? →" to `#pubs`; on phones 36px, still clear of the lockup at 390. It's navigation, not an ask, so the sticker stays the hero's one ask.
- **The trailer:** copy's pick 1 (the counter as the headline, the line with "eleven stops", "Read the history →"). I withdraw my sticker row: eleven linked stickers is an index the page can carry itself, and the trailer is one idea, the count. "Eleven" is written in the copy, so it changes if the Zonal or the 2018 stop goes in.
- **The pubs chapter:** marketing's order (poster, money, pledge-as-email, mats) and copy's heading. The art folds to one row as in my Round 1; the five downloads stay. The email pledge goes through the petition form's consent for now (marketing §6) or waits; I'll leave a slot, not build a second form.
- **`/history`:** both their section maps and mine agree; I add that the vertical timeline needs each stop as an `<article>` with an `id` from its date, and that the OG image is a Mac job, so the prototype reuses the home one.
- **Rail labels:** copy's words on my merged chapters: The Problem · Sign · How to · The Test · Pick a Side · History · For Pubs.

## 3. Revised structure: the recommended build

| # | id | Block | Headline slot and copy's strings | Pill |
| --- | --- | --- | --- | --- |
| 1 | `#top` | cream | As now; "Get your pub-goer’s licence today"; the "Run a pub? →" door top right | off |
| 2 | `#verdict` | blue | Left: kicker "the single file", "Four staff. One working.", the Single File sim, ✗ tag; right: kicker "the cluster", "Spread out.", the Cluster sim, ✓ tag; caption "Same pub, same four staff, same pints. Keep an eye on the scores."; bars "the single file · 25 min" / "the cluster · 6¼ min"; "worked example" + "Arithmetic, not a stopwatch. Real pubs are messier."; the name line "This is The Cluster. It had no name before because nobody needed one." as the right column's small line | vote |
| 3 | `#petition-section` | ink | "Sign the Petition"; "Stand along the bar. Make eye contact. Let the barperson decide."; count line "1,234 have signed. One more wouldn’t hurt." (hidden under 100); Sam Pint; the form as now | hidden |
| 4 | `#howto` | cream→blue→green, pinned | Unchanged, every word | vote / sign / test |
| 5 | `#test` | blue | Unchanged | hidden in the test state |
| 6 | `#poll` | cream | "pick a side" / "Stop the single file?"; "Stop it · spread along the bar" / "Keep it · stay in line"; chart rows Stop / Keep; lead lines and quips as copy's deck; next step by side | hidden |
| 7 | `#history` | pink | Counter headline "[1,913 days] since you were allowed back at the bar."; "Still queueing. The rules never said to. How it happened, in eleven stops."; "Read the history →" | vote / sign / test |
| 8 | `#pubs` | amber | "for pubs" / "Stick us behind your bar."; "Free posters now. Beer mats soon. And a sum about your Friday."; "Posters. Print your own." + downloads; "48 an hour. Or 192." tile with the £224 line, stamp and caveat; "The pledge is the poster."; mats coming soon | hidden |
| | footer | ink | Sources (worked example line; history sources move to `/history`), beer fund, back to top | off |

Measured from the wireframe heights: about 12.8 vp at 1280 (verdict at 1.0, form at 2.05, how-to at 3.15, test at 7.65, poll at 8.65, trailer at 9.65, pubs at 10.65). Rail: `#verdict`, `#petition-section`, `#howto`, `#test`, `#poll`, `#history`, `#pubs`.

**Phones (≤ 600px):** the verdict stacks (1.21 vp); the collapsed "Vote" pill bottom right from screen 2, hidden where the desktop pill hides; the door at 36px; the pubs art two by two.

**No JS, piece by piece:** the verdict is plain markup (both `.scene` stages show their pre-rolled frame via the existing CSS; the bars are full width); the pill's form is hidden and a fixed "Vote ↓" anchor to `#poll` shows instead on desktop (nothing on phones, where it would meet the sticker); the poll and petition forms keep `method`/`action` and the Worker's HTML answers (the no-JS results page says Stop/Keep once `pollWords` is merged); the trailer's counter says "over five years"; the pubs chapter and the door are plain links; `/history` is plain HTML with the counter's fallback. Reduced motion: no pill transitions, the bars full width, the sims still, as now.

## 4. Round 3 build plan

| File | Contents |
| --- | --- |
| `public/prototypes/home.html` | The recommended page, `noindex`. Loads `/styles.css`, `/prototypes/proto.css`, `/script.js` (defer) and `/prototypes/proto.js` (defer). Keeps every hook `script.js` reads: `.reveal`, `.scene[data-mode]`, `#howto` with its markup verbatim, `.timeline` with the new list, `#petition`/`#sig-count`, `[data-since]`. Drops `.strip`. The poll form gets the id `#poll-form-p` so `script.js`'s poll block stands down and `proto.js` owns the poll screen and the pill together |
| `public/prototypes/home-alt.html` | **Marketing's two-screen split, as the contrast:** red `#problem` (kicker, "Four staff. One working.", the pair side by side, the caption) then green `#solution` ("Spread out.", the supporting line, the name line, the bars, stamp, honesty line, no sim). Everything else identical. It gives the team the real choice: one blue screen with two headlines (one bend, 1 vp) against two whole-colour screens with one headline each (no bend, 2 vp, the Cluster sim on red). C's pinned stage is not built: it is the largest job and the only option that adds scroll; it stays the stretch if the plain verdict feels thin |
| `public/prototypes/history.html` | The vertical page: header (lockup at 40px, "← Home"), opening screen with the counter at the Stat scale, the timeline as `<article>`s with date ids (copy's eleven stops, sources linked), the questions section (copy to write; `FAQPage` + `Article` JSON-LD as a `type="application/ld+json"` block), trailers to the test and the petition, footer. The pill present. Meta relative; the OG image is the home one until a Mac builds its own |
| `public/prototypes/proto.css` | The verdict grid and sizes (§2.1); the pill, desktop and phone, all states, `html:not(.js)` and `prefers-reduced-motion` and print rules, forced colours; the hero door; the pubs tile and art row; the trailer; the history page's header, timeline, spine and stickers; the `--sx` widening above 900px |
| `public/prototypes/proto.js` | (1) The pill: markup already in the HTML; state from one `GET /api/poll`; `POST` with `source: 'pill'` (logged only, marketing's measurement); the seven states; hide rules from scroll position (the rail's own thresholds) and from `IntersectionObserver` on `#poll`, `#petition-section`, `#pubs`, `#test`. (2) The poll screen: a copy of `script.js`'s poll module with Stop/Keep words, sharing the pill's state object (one fetch, one cookie, one `last`), so a pill vote draws the chart and a screen vote updates the pill. (3) Signed: listens for the form's success (the `.share` box becoming visible) and sets the state and the `localStorage` flag. At merge, (2) folds back into `script.js` and the copy goes |

Nothing in `public/` outside `prototypes/` changes; `script.js` is reused as is. No inline scripts, no `on*` attributes, no new origins, so `_headers` is untouched. The things I can't do in a prototype and will list for the merge: `run_worker_first` and the `data-abs` rewrite for `/history` and `/pubs`, `pollWords` in the Worker, the register rows, the OG image.

**What I expect to finish:** `home.html` complete and working against the live API, `proto.css`, `proto.js` with the pill's vote, result, sign and test states, `history.html` with the eleven stops and the trailers, `home-alt.html` as the two-screen variant of the same files, renders at 1280 and 390 in `round-3/`. **At risk:** the questions section (needs copy's Q&As), the signed/"Tell a mate" state (needs the share routine reachable), the no-JS "Vote ↓" anchor polish. **Cut first, in order:** the JSON-LD, the "Tell a mate" state (the pill just goes after signing), the phone pill's expand animation (it can swap states instantly), the alt page's second screen polish.

## 5. Open questions for DECISION.md

1. **Order:** hero → verdict → petition → how-to → test → poll → history trailer → pubs. Confirm the form at screen 3 (2.05 vp) and the poll after the test.
2. **Stop / Keep** replaces For / Against everywhere (pill, poll screen, chart, quips, `pollWords`). Yes?
3. **The money:** "48 an hour. Or 192." as the tile and the £224 "waiting to be poured" sentence with copy's caveat; marketing adds the two register rows during Round 3. Yes?
4. **The hero's extra element:** the "Run a pub? →" door top right, and no count line and no vote line in the hero. Yes?
5. **The pill:** desktop shows both buttons at rest (one tap); phones get a collapsed "Vote" pill bottom right that expands in place (two taps), not a bottom bar; the pill's only amber is its kicker. Yes?
