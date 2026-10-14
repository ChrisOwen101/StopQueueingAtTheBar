# Homepage, round 2: marketing

Written 14 Oct 2026 after reading `round-1/design.md` (structures A, B, C, the vote pill sheet, the recommendation "A's verdict in B's order") and `round-1/copy.md` (the deck). Viewport figures ("vp") are the designer's wireframe measurements at 1280×800 unless marked as mine. Register citations as in my Round 1 file: `[M]`, `[H1]`…`[H8]`, `[HW]` are "On the page" rows; `[R: …]` Reserves; `[Bg]` the background table; `[Avoid: …]` the avoid list; **assumption** means mine, not the register's.

## 1. Where the three of us agree

Fold the argument into one proof screen and keep "25 minutes. Or six." with its stamp (`[M]`). No sticky header banner. One fixed vote element on the right, sharing one fetch and one cookie with the poll screen, a plain form without JS, hidden on the hero and on the poll and petition screens. `/history` as a vertical dated page with a source on every stop; the home page keeps the live count (`[H8]`). The money is "waiting", never "lost", tagged as a worked example, only from `[M]` and `[R: pint £5.34]`. The poster is the pledge; no calculator on the home page; no "order" anywhere because nothing is for sale. How-to and the test teaser untouched. The rail list changes with the ids.

## 2. The order

**Settled: hero → verdict → poll → petition → how-to → test → history trailer → for pubs → footer.** The designer's merge with one move: the petition comes straight after the poll, not after the test. Rail: `#verdict`, `#poll`, `#petition-section`, `#howto`, `#test`, `#history`, `#pubs`.

Derived from the wireframe heights (verdict 1.05, poll 1.0, petition about 1.1, how-to 4.5, test 1.0, trailer 1.0, pubs 1.6, footer 0.55): page about 12.8 vp; the poll screen at 2.05 vp (from 13.7 today); **the form at about 3.1 vp** (from 14.7 today, and from 8.5 in the designer's order); the how-to runs 4.2 to 8.7; the test at 8.7; the pubs chapter at 10.7.

Why this and not my Round 1 order (petition at screen 4, poll late): the designer is right that the vote is the natural reply to the proof, and the cheap ask should come first; a visitor who has just voted Stop is the likeliest signer on the page (**assumption**: a small commitment makes the larger one likelier; I'm not putting a rate on it). Why not the designer's petition-after-the-test: the measure is signatures, and 8.5 vp puts the form behind the pinned how-to, 4.5 vp that is a third of the page, which the feedback says people won't scroll. The poll's results screen already says "Now make it official. Sign the petition": with the form on the next screen that CTA is one scroll, not an anchor jump over the stage. And the form's success line, "Now go and stand at the bar", is followed by the screen that shows how. The pill then only carries the petition for people who scrolled past the form, and the test for Keep voters, which is the lighter job. Two ask screens in a row is not two asks at once; the rail that keeps it from feeling pushy is in §7 (no pill on either, the form as quiet as it is now, no count-up pressure). **Drop "Sold? Sign the petition." from the verdict**: it would sit beside the pill at the moment the pill appears, and the form is two screens away.

If only one alternative home is built, make it this order with the petition after the test (the designer's), everything else identical, so Round 3 compares the one open funnel question and nothing else. C's pinned verdict changes the proof, not the asks, and adds scroll; hold it.

**The hero count.** Show it, with a threshold of **500** signatures (**assumption**, a judgement: below a few hundred the number says "nobody" in a press screenshot and a number that hasn't moved between two visits says "dead"). From 500 the designer's line with the copywriter's words: "1,234 have signed. One more wouldn't hurt." Below 500, no number: the copywriter's "The petition is open. Be early.", a plain link to `#petition-section`. Hidden without JS, as the designer specified. The petition screen's own `#sig-count` keeps showing from one signature, as now, because there the reader is already at the act. In practice that means no number in the hero before launch, by the threshold rather than a switch, and nothing to remember to flip on promotion day. The hero's one ask stays the sticker (the test); the count line is a fact with a link, `.small`, the only other link on the hero besides the lockup.

## 3. The vote

**Labels: Stop / Keep** (the copywriter's). Fairness: neither pair is neutral, since the campaign's side is first and affirmative in both, and the lever that matters is the question, not the buttons. Stop / Keep are two verbs of equal length that each answer the question without it in view and survive as chart labels; For / Against is unequal in length and tone and needs the question on screen, which a pill can't promise. The pill asks **"Stop the queue?"** ("queue", plain, not our pejorative term, which the verdict's kicker teaches at the same moment the pill appears); the screen keeps **"Stop the single file?"** as its headline with Stop / Keep buttons and the copywriter's sub-lines. Two wordings, one choice: the stored values stay `cluster` / `single`, and `pollWords` in `src/worker.js` and `script.js` change together, so the no-JS results page agrees.

**After the vote: the tally plus one next step, by side.** Not the designer's "Sign the petition" for everyone (a Keep voter asked to sign a petition against what they just voted for is the pushiness the brief forbids, and the poll screen already splits by side), and not the copywriter's split-only pill with a separate banner (a banner is a second piece of fixed chrome on every screen; the pill has room, the designer drew it). **No banner exists.** The copywriter's banner words move into the pill at pill size.

**Already voted on a past visit:** the page's `GET /api/poll` returns `{ voted, choice, results }`; the pill loads straight into the voted state, no re-vote in the pill, "Changed your mind?" only on the screen. Signed (form success, or the `localStorage` flag): the pill is gone; both asks are done and the form's own "Tell a mate" carries the share. Optional, not required: a `dq_test` flag set by the hazard page lets a Keep voter's pill go too once they've taken the test.

| State | Trigger | The pill shows | Tap | Hidden on |
|---|---|---|---|---|
| off | — | nothing | — | hero, `#poll`, `#petition-section`, print, short landscape phones, after signing |
| vote | `voted: false` | kicker "vote" (the one amber), "Stop the queue?", **Stop** / **Keep** as two equal outline buttons, Stop first (the screen's order) | POST `choice` | as off |
| posting | submit | both buttons at 60%, `aria-busy`, "counting…" | — | — |
| voted: Stop | `choice: cluster` (now or on a past visit) | "you voted", Stop n% / Keep n% as cream bars with "you" on Stop, then one amber button **Sign the petition** (`#petition-section`); the kicker loses its amber | anchor | `#petition-section`, and as off |
| voted: Keep | `choice: single` | the same tally with "you" on Keep, then **Take the test →** (`/hazard`) | link | `#test`, and as off |
| not counted | `capped` or `missing` | the tally with no "you" and the copywriter's "That one didn't count" line, then the next step for the side pressed | — | as voted |
| no JS | always | the plain form on 601px and up, posting to `/api/poll`; nothing on phones, where the poll screen's form does the job | — | — |

The phone bar (≤ 600px, 56px plus the safe area) carries the same states in one row; "Stop 71% · Keep 29% / you voted stop" on the left, the one button on the right.

## 4. The money figure

**Pick: £224 an hour, "waiting to be poured" (42 × £5.34).** Not £769 (144 × £5.34): that prices the difference between two capacities, which only exists if 192 orders an hour turn up, a demand the register doesn't give, and a pound figure that size at Stat scale reads as a promise of takings, which the brief forbids. £224 is bounded by the register's own Friday (90 an hour, `[M]`), it is the smaller and more defensible number, and its unit is literally what the arithmetic shows. The tile's big number is orders, not pounds: the copywriter's **"48 an hour. Or 192."** (3,600 ÷ 75 = 48; × 4 = 192, derived from `[M]`); the £224 is the one money sentence under it. If the designer must have a £ in the tile, it is £224, never £769.

Rows for `RESEARCH.md` before the line ships (location code **P**, the pubs chapter):

| Where | Wording on the page | Source | Type | Conf. |
|---|---|---|---|---|
| P | "At the average pint, £5.34, that's about £224 an hour waiting to be poured." | Morning Advertiser price survey, 21 May 2026: average draught pint £5.34, Apr 2026 (moved up from Reserves; add the URL and a checklist line to open it) | S | Medium-high |
| P | "On the worked example's Friday, 90 orders an hour, one spot on the bar serves 48. That leaves 42 an hour in a line." 42 × £5.34 = £224.28 | Derived from row M (3,600 ÷ 75 = 48; 90 − 48 = 42) and the row above. Stamped "worked example" on the page | derived | High |
| P | "48 an hour. Or 192." | Derived: 3,600 ÷ 75 = 48; × 4 staff = 192 (add to "Derived figures") | derived | High |

Add to **Avoid**: any capacity difference priced as money (£769, £1,025); "losing £X" or "takings"; any town's pint price without a row of its own; any figure per night or per year.

**The exact honesty line** (the copywriter may tighten it, but these four facts survive: a sum, one pint an order, the national average with its source, the Friday is invented): **"Illustrative. 75 seconds an order, a pint an order, a line that ends at one spot on the bar. The pint is the UK average (Morning Advertiser, Apr 2026). The Friday is made up. Your pub is yours."**

**The local angle, as far as the register allows today.** The safest version has no town price in it: "A pint is £5.34 on average (Morning Advertiser, Apr 2026). On a Friday a single file leaves 42 orders an hour stood at the bar, about £224 waiting to be poured. The poster that fixes it is free, and the first pub in [town] to put it up has done The Cluster before anyone else." The town enters through the paper and the poster, not through a number, and the gain belongs to the staff ("could be pouring"), never the loss to the pub. To go further, "in Neath a pint is £X" needs its own register row: a dated, published survey by a named body with a sample (a CAMRA branch price survey; a local paper that priced n pubs on a stated date; ONS's national series as a type-P backstop), or a pledged pub's own price with written permission. Crowd-sourced apps are not register-grade. Even then the sentence stays "£Y an hour the bar staff could be pouring", a named pub's price is never printed without consent, and nothing is ever "losing".

## 5. `/history`

**URL confirmed: `/history`** (`public/history.html`, served like `/hazard`; add `/history` to `run_worker_first` and the `data-abs` rewrite). The copywriter's title "Why do people queue in pubs now? · Don't Queue At The Bar" is right as the search question; the phrase "queue at the bar" must also appear in the standfirst and the first paragraph (it does in the pick), because that is the query the brand owns. Stop ids by date, as the designer specified, so press and the trailer can deep-link.

**The stops, in date order** (the standfirst's count must match; this list is thirteen plus today):

| Date | Stop | Register row | Needs before it ships |
|---|---|---|---|
| 1996 | The invisible queue (Fox) | `[H1]` | — |
| 24 Nov 2017 | 91% would say someone else was next | `[R: YouGov 2017]` (P, high) | — |
| Aug 2018 / Jun 2019 | The queue before 2020 (Boak and Bailey; the Edinburgh "lager lane", Morning Advertiser): one stop, the honest "before" | the register's nuance note 2 under "The wider timeline" | a row each, with URLs |
| 20 Mar 2020 | Pubs shut | `[H2]` | — |
| 4 Jul 2020 | Pubs reopen, carefully | `[H3]` | the July 2020 guidance link (checklist) |
| 24 Sep 2020 | Table service by law | `[H4]` | — |
| 19 Jul 2021 | The bar is back | `[H5]` | — |
| 30 Jul 2021 | The habit sticks (51% table service) | `[R: YouGov 2021]` | confirm "GB" on the row |
| 28 Jan 2022 | Wales last; Scotland and NI the week before | `[HW]`; the wider timeline for Scotland and NI | rows with URLs for the Scotland and NI dates if they're written |
| Jul 2023 | Someone notices (Time Out) | `[H6]` | the headline checked word for word |
| 23 Aug 2025 | America notices (WSJ) | `[R: Coverage]` | the WSJ's own URL; the quoted words checked |
| 18 Sep 2025 | Britain splits, 40 / 39 / 21, and 1 in 4 saw a single file | `[H7]`, `[R: YouGov 2025, 1 in 4]` | — |
| Dec 2025 | Or does it? (69 / 31), only directly under the YouGov stop | `[R: Zonal/CGA]` | a URL, or leave it out |
| today | The live count | `[H8]` | — |

Not stops: pubLAB's 2 min 23 s (`[R: pubLAB]`), Loth 2013 (`[R: Frontiers 2013]`) and Tim Martin's "traditional anarchy" (`[R: Tim Martin]`) go in the questions section as answers and a pull quote; BBPA closures stay off the page.

**The questions section must answer, in plain words, each with its source:** why people queue at the bar now (`[H3]`, the two nuances: the rules never said queue at the bar; 2020 normalised it, the 2018/19 stop proves it didn't invent it); when table service ended, by nation (`[H5]`, `[HW]`, the wider timeline); whether the rules ever said to queue (no, `[H3]`); whether most people prefer the queue (`[H7]` beside `[R: Zonal/CGA]`, both shown); whether it's rude not to queue (`[H1]`, `[R: YouGov 2017]`, `[R: Frontiers 2013]`); how long it takes (`[M]`, `[R: pubLAB]`); how to order without queueing (the how-to); what The Cluster is. `Article` and `FAQPage` JSON-LD, which the CSP doesn't block because data blocks aren't executed; check the console after deploy.

**Internal links.** In: the home trailer (headline and each sticker to its stop id), the footer, the hazard hub, the pubs chapter ("why your customers queue"), the petition success message. Out: every stop's source; the foot, the copywriter's "That's how. Here's what to do about it." with **Sign the petition** (`/#petition-section`) and "or take the test first" (`/hazard`); the how-to (`/#howto`) and `/#pubs` from the questions. The vote pill lives on the page (a search visitor can vote), its voted state linking to `/#petition-section`.

## 6. Pubs

**Round 3 builds the home chapter only: `#pubs`, no `/pubs`, no form.** The designer's and copywriter's position stands, and mine was ahead of the backend: an email pledge needs a table, a consent text of its own and the privacy notice, none of which exist, and the prototype budget is three pages. The chapter: the copywriter's headline to the publican, the "48 an hour. Or 192." tile with the £224 line and its caveat, **"The pledge is the poster"** with the downloads (print it and your bar does The Cluster: the flyers' decision, said on the page), one row of art, "Mats coming soon" with the one route we have (the petition's consent already names beer mats). Never "order".

What this leaves open, recorded for the open items rather than built: the second measure still has no instrument. Until the pledge form lands (one field, an email, its own PECR consent, a deletion route, no public list without opt-in), the proxy is poster downloads, logged by the Worker with `/flyers/*` in `run_worker_first`. `/pubs` earns its URL when the calculator and the pledge exist with their caveats, as the designer said.

## 7. Round 3 acceptance criteria

- [ ] **Asks never doubled.** The pill (desktop) and bar (phone) are hidden on the hero, `#poll` and `#petition-section`, in print, after signing and on short landscape phones; "Sold? Sign the petition." is gone from the verdict; the hero has one ask (the sticker) and one factual line.
- [ ] **Order and rail.** Sections in the settled order (or the alternative's, petition after the test) with the rail list and ids matching; the rail hidden on the hero; the `#maths` label rule gone with the screen.
- [ ] **Equal vote buttons.** Stop and Keep identical in size, border, weight and colour, Stop first on both the pill and the screen, no amber on either, no autofocus; the kicker is the pill's only amber before a vote.
- [ ] **After the vote.** The tally with "you" on the side voted; one next step: Stop → Sign the petition (`#petition-section`), Keep → Take the test (`/hazard`); a capped or missing vote shows the tally with no "you" and never adds a vote; a returning voter loads into the voted state with no re-vote in the pill; "Changed your mind?" only on the screen; the signed flag removes the pill.
- [ ] **Data and words.** Stored values still `cluster` / `single`; `script.js` and `pollWords` in `src/worker.js` carry the same lead lines, quips, labels and next steps; the no-JS results page says Stop / Keep.
- [ ] **No JS.** The pill is a plain form on desktop and absent on phones; the poll screen and the petition form post and get the Worker's HTML; the hero shows no count; the how-to ships its finished frame; the trailer says "over five years"; `/history` reads top to bottom.
- [ ] **Worked-example labels.** The "worked example" stamp and the honesty line sit on the same screen as "25 min / 6¼ min"; the sims keep their own "pints served" labels and never show 25 or 6; the pubs chapter's £224 carries its stamp and the exact caveat in §4; the footer keeps "worked examples, not measurements".
- [ ] **Register.** The three rows in §4 and a row for every new history stop exist, with URLs, before a prototype is called done; the Zonal and WSJ stops have URLs or are left out.
- [ ] **No shaming, no takings.** No pub named, no town price, no "lost", "losing", "takings" or "revenue", no £769 or any capacity-priced figure, nothing per night or per year.
- [ ] **Privacy lines.** The consent text on the form unchanged; "One vote per browser. A cookie remembers your vote, and that's all it knows." on the poll screen; the pill's accessible name says it is a poll; no new storage beyond the signed (and optional test) `localStorage` flags.
- [ ] **Hero count.** Shown only from 500 via `/api/count`, else the no-number line; hidden without JS.
- [ ] **Phone (390×844).** The bar 56px plus safe area, Stop / Keep at 44px targets; nothing sits under it (the how-to's step pills, the form's submit, the download pills); the verdict stacks and fits about 1.3 vp; the page about 13 vp.
- [ ] **Desktop (1280×800).** The verdict fits one viewport with the stamp visible; the pill clears the content column (the `--sx` fix); the poll at about 2 vp and the form at about 3 vp in the settled order.
- [ ] **Reduced motion.** Pill states swap without animation; the sims hold a still frame; the stickers don't slap.
- [ ] **`/history`.** Title under 60 characters with the question, description under 155, canonical, OG tags absolute (`/history` in `run_worker_first`), stop ids by date, a source line on every stop, the questions in §5 answered, the foot CTAs, indexable; `/hazard-preview` stays unlinked.
- [ ] **Measurement hooks** (should, not must): `source` on vote and sign requests, logged and not stored; poster downloads logged.
- [ ] **Voice.** The gender and tone greps clean on every prototype (`barman|barmaid|\bhe\b|\bshe\b|\bhis\b|\bher\b|\bhim\b`; "Let's", "!", "It's not").
