# Homepage, round 3: the copy pass

Copywriter, 14 Oct 2026. Every visible string in `public/prototypes/home.html`, `home-alt.html`, `history.html` and `proto.js` was read against `round-2/copy.md` §3, `DECISION.md`, `round-3/design.md` and the register's rows M, P, H1–H8, HW, HP6, HP7, HP9, HP10 and HQ, with the renders in this folder open. The build follows the deck closely, so the pass is short: eight strings changed, none of them structural, nothing in `proto.js` or `proto.css`.

## 1. Strings changed

| File | Before | After | Why |
|---|---|---|---|
| `home.html`, `home-alt.html` (the single-file sim's `aria-label`) | Animated pub bar, the single file: customers queue in one line to one spot, one barperson serves, three stand idle. The score counts pints served. | Animated pub bar, The Single File: customers queue in one line to one spot on the bar. One barperson serves; three stand idle. The score counts pints served. | The name is capitalised in running text (the right-hand sim already said "The Cluster"), and the comma splice becomes two sentences so a screen reader pauses where a reader would. |
| `home.html`, `home-alt.html` (the bars' `aria-label`) | Bar chart, twenty orders: the single file takes 25 minutes, The Cluster six and a quarter. | Bar chart, twenty orders: The Single File takes 25 minutes, The Cluster six and a quarter. | Same rule, same sentence; the two names now match. |
| `home.html`, `home-alt.html` (footer sources line) | Sources: the history’s are on the history page. | The history’s sources are on the history page. | My own Round 2 line read as a possessive with no noun. The rest of the line (the pint price, the worked-example sentence) is unchanged. |
| `history.html` (question 5's `<h3>`) | How much slower is the single file? | How much slower is The Single File? | The capitalisation rule for body text and headings outside the lowercased display styles. |
| `history.html` (the matching `FAQPage` `name`) | How much slower is the single file? | How much slower is The Single File? | The JSON-LD must match the visible heading word for word; checked by script after the edit, all six pairs match. |

Eight edits in all (three strings in each home file, two in the history page). Diff stat: 8 lines changed across the three files.

## 2. Checked and left as built

- **The verdict:** kickers "the single file" / "the cluster", "Four staff. / One working.", "Spread out.", the tags, the caption in the decision's wording ("Same pub, same four staff, same pints. Keep an eye on the scores."), the bar labels, the stamp and "Twenty orders, 75 seconds each. One spot on the bar, or four staff along it. Arithmetic, not a stopwatch. Real pubs are messier." All as row M and the decision. The name line is not on the verdict (the decision's fit rule); it is on the alt's solution screen, where it belongs.
- **The alt's two screens:** "One line. One spot on the bar." under the problem; "This is The Cluster. It had no name before because nobody needed one." under the solution. Both as the decision.
- **The pill:** "Stop the queue?" at every width (the deck had "Stop the single file?" at 118px; at the built width that is three lines, "Stop the queue?" is two, and the poll screen carries the full question, so I accept it), Stop / Keep, "one sec" / "Counting…", "you voted stop" / "you voted keep", "make it count." on phones, "not counted" with "why? ↓", "full result ↓", "Hide this", the aria-live sentences ("Stop 71%, keep 29%. You voted stop." and "That vote wasn’t counted. Stop 71%, keep 29%."), the form's name "Poll: stop the queue at the bar? One vote per browser." All read as sentences.
- **The poll screen:** "Stop it · spread along the bar", "Keep it · stay in line", chart rows Stop / Keep, the four lead lines unchanged, the quips "You said stop. Correct. Now make it official." and "You said keep. Noted. Take the hazard perception test, then we’ll talk.", the change note "You’re down as stop. Pick again to switch."
- **Hero:** "Run a pub? →", "pub-goer’s", the count line "12,345 have signed. Add your name ↓" from 500 (the under-500 forms are not built, per the decision).
- **Pubs:** "Four staff. / Four pouring.", the tile "48 an hour. Or 192." with the designer's line, the money sentence and the honesty line word for word from row P, "Print the poster. That’s the pledge." and its sub, the downloads line, the fine print, the mats line.
- **History trailer:** the counter as the headline, "Still queueing. The rules never said to. How it happened, in eleven stops.", "Read the history →".
- **`/history`:** title (57), description (151), H1, the counter line, the standfirst (its first two sentences answer the question), eleven stops, "Asked and answered.", the two trailers, the sources line with YouGov 2017 added because question 4 cites it. Stop 7 ends at "679 days after the pubs shut." and question 2 reads "England, 19 July 2021. Wales was the last of the four, on 28 January 2022.", both the register's constraint, untouched.
- **Wrapping:** nothing wraps badly at 1280 or 390 in the renders; no shorter string was needed.

## 3. Left that I would still change, and why not here

- **Row P's wording column** says "192 orders an hour, four staff along the bar. One spot does 48. (the tile’s big number is 192)". The page, by the decision, says "48 an hour. Or 192." with "Orders through one spot on the bar, or four staff along it." Same two figures, same derivation, different words. The column should be updated to the page's words at merge; `RESEARCH.md` is outside this pass.
- **Question 3 cites Zonal and CGA (69/31), unlinked.** The stop was left out for want of a URL; the answer still uses the figure from the Reserves row, as my deck wrote it and the decision kept the answers "as written". It is shown beside YouGov's, as the register requires, but it is the one figure on the page without a row in "On the page". At merge, either promote the Reserves row to HQ with a URL or cut the second sentence of that answer and its source. Marketing's call; flagged, not changed.
- **The history page's `og:image:alt`** describes the home share image, which is the image the page uses for now, so it is right as built. When the Mac-built history image lands, the alt becomes the deck's: "Blame 2020. Mostly. A short history of the pub bar queue from Don’t Queue At The Bar, over a row of floor stickers dated from before 2020 to today."
- **The sims' on-stage labels** read "SINGLE FILE" and "THE CLUSTER" (from `data-label`, which `script.js` reads). "THE SINGLE FILE" would match, but the attribute is shared with the live page's script and I have no render of the change at 390; leave it for the merge with a render check.
- **HP6's source line** says "5,695 adults" and stays so until the row confirms "GB"; **HP9** links the syndicated copy until the WSJ's own page is found. Both are the register's conditions, not copy's.

## 4. The Worker strings at merge (`src/worker.js`)

`pollWords` and the no-JS results page take the Stop / Keep words. Everything not listed stays as it is.

```js
// pollWords: lead lines unchanged.
const quip =
  status === 'capped'
    ? 'Your connection has had its fill of votes today, so this one didn’t count. Here’s the tally anyway.'
    : status === 'missing'
      ? 'We couldn’t find your first vote, so nothing changed.'
      : choice === 'cluster'
        ? 'You said stop. Correct. Now make it official.'
        : 'You said keep. Noted. Take the hazard perception test, then we’ll talk.';
const next =
  choice === 'cluster'
    ? { back: '/#petition-section', label: 'Sign the petition' }
    : { back: '/hazard.html', label: 'Take the test →' };
// total line unchanged: `${votesText(total)} so far. Self‑selecting and unscientific, like every pub argument.`

// pollChart: the two row labels (lines 253–254 today).
row('cluster', 'Stop', forPc, cluster) +
row('single', 'Keep', total ? 100 - forPc : 0, single)
```

The status lines ("Vote counted.", "You’ve already voted.", "Vote changed.", "That one didn’t count.", "Nothing changed."), the "your vote" stamp, the sign-up thank-you ("Thank you." / "You have signed. Now go and stand at the bar.") and the 503 line ("The poll isn’t open yet. Try again later.") are unchanged. The poll screen's button words ("Stop it · spread along the bar", "Keep it · stay in line") and the change-screen note ("You’re down as stop. Pick again to switch.") live in the HTML and `script.js`, not the Worker; the no-JS page has no change screen.

## 5. Greps

Run after the edits, from the repository root:

- `grep -rniE 'barman|barmaid|\bhe\b|\bshe\b|\bhis\b|\bher\b|\bhim\b' public/prototypes/` → nothing.
- `grep -rnE "Let's|Let’s|!" public/prototypes/*.html`, ignoring `<!doctype`, comments and `!important` → nothing.
- `grep -rnE "[Ii]t[’']s not " public/prototypes/` → nothing (the hero strap is "It’s a pub. Not a post office.", the allowed shape).
- Straight apostrophes inside visible text in the three HTML files → none.
- The six `FAQPage` entries match the six `<h3>`s and their first paragraphs exactly (checked by script).
