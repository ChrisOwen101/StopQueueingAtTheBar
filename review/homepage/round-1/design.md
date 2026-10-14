# Homepage round 1: design

Design specialist's proposals, 14 Oct 2026, against `review/homepage/BRIEF.md`. Three page structures (A, B, C), one low-fi wireframe each (`wire-a.html`, `wire-b.html`, `wire-c.html`, rendered as `wire-*-1280.png`, `wire-*-390.png` and `wire-*-fold.png`), plus a states sheet for the always-on vote (`wire-vote-pill.html`, `wire-vote-pill.png`). The live page is in `current-1280-fold.png`, `current-1280-full.png`, `current-390-fold.png` and `current-390-full.png` (the full captures show empty colour blocks because `.reveal` never fires in a headless tab; the section-by-section shots I judged from were taken with the reveals forced). Headlines in the wireframes are placeholders in square brackets; the copywriter owns the words.

## 1. What the live page measures

Taken in Chromium at 1280×800 and 390×844 (viewports, "vp", are of that window).

| | 1280×800 | 390×844 |
| --- | --- | --- |
| Whole page | 19.2 vp (15,331 px) | 16.9 vp |
| Hero · problem · solution · versus · maths | 1.0 · 1.18 · 1.35 · 1.15 · 1.65 | 1 · 1 · 1 · 1 · 1.16 |
| Argument before the how-to starts | 6.3 vp | 5.2 vp |
| How-to (pinned) · test · history · poll · petition · mats · footer | 4.5 · 1.19 · 1.72 · 1.0 · 1.22 · 2.65 · 0.55 | 4.5 · 1 · 1.4 · 1 · 1 · 2.27 · 0.6 |
| First petition touch ("Sold? Sign the petition.") | 3.4 vp down | 2.85 vp |
| Poll screen | 13.7 vp down | 12.05 vp |
| Petition form | 14.7 vp down | 13.05 vp |

What the shots say that the numbers don't:

- The problem and solution screens overflow a laptop. The sim is capped at 58vh, then a rule-title, a two-line `.mid` and a stamp follow it; at 1280×800 the "not recommended" stamp is below the fold on both. Each is one idea but not one screen.
- The blue comparison is the only screen where something is proven rather than stated: two scores, same seed, diverging. The feedback is right that this is where the visitor should stop. Its headline ("Same pub. Same Thursday.") is the caption of the experiment, not its finding.
- The maths screen is 1.65 vp of a number the sims never reach on their own (a visitor won't watch twenty orders go through). The 25-versus-6 line is the one hard figure the campaign has, it is already on the flyers, and it belongs on the same screen as the sims as a strip, not after them as a screen.
- The mats screen is 2.65 vp and talks to pubs with the same volume as the screens that talk to drinkers.
- Nothing fixed on the page asks for anything. The rail is navigation. The sticker asks for the test, on the hero only.

Where I disagree with the feedback, with reasons:

1. **"Do you need the maths?"** Yes, but not a screen of it. Without the arithmetic the claim is two cartoons. With it the claim is checkable (RESEARCH.md shows the sum). Fold it, don't cut it. All three structures keep "25 minutes. Or six." as a line or a strip with the worked-example stamp.
2. **A sticky header banner for the petition.** No. The design system has no persistent header; every block is a whole sheet of colour, and a banner is a cream or ink strip laid over all seven colours, on every screen, next to the lockup it would dwarf. The page's fixed-chrome budget is the rail on the left and, now, the vote on the right. The petition gets surfaced through the vote (the pill becomes the petition pill after a vote), through a count in the hero, and through an inline link on the first argument screen. That is three touches above the fold line of the poll without a bar across the page.
3. **"How many people are going to scroll that far?"** The honest answer from the numbers: the poll is 13.7 viewports down, so almost nobody. But the fix is not only a floating button; it is also where the poll screen sits. Two of the three structures move it to right after the argument, where "stop the single file?" is the natural reply to what you've just watched.

## 2. Pieces shared by all three structures

These are specified once here; each structure says where they sit and what differs.

### 2.1 The always-on vote: a pill on desktop, a bar on phones

The states are drawn in `wire-vote-pill.png`.

**Desktop and tablet (≥ 601px).** A fixed vertical pill at the right edge, vertically centred: the rail's mirror image, in the rail's recipe (ink at 90%, 2px cream border at 30%, `backdrop-filter: blur(6px)`, pill radius), so it is not a new kind of chrome. 118px wide (100px on tablets, where the question line is dropped and the kicker plus two buttons remain). `right: clamp(8px, 1.6vw, 22px)`, `top: 50%`, `z-index` level with the rail. Contents, top to bottom:

- Before a vote: an amber Label kicker ("VOTE"), the question in two short lines (0.8rem, 800, lowercase, cream), then two equal outline buttons stacked, "For" and "Against" (2px cream border, cream text, 0.85rem 900, 32px tall). No amber on the buttons, so the question stays fair, as on the poll screen; the kicker is the pill's one amber.
- Posting: both buttons at 60%, `cursor: wait`, `aria-busy`.
- After a vote (now, or on a past visit, which `GET /api/poll` already reports): the kicker says "YOU VOTED" in cream, two rows "for 71%" and "against 29%" each with a 6px cream bar on a 0–100 scale, then one amber button, "Sign the petition", an anchor to `#petition-section`. The One Amber Rule moves the amber from the kicker to the button. The bars are cream, not green and red: at 6px on ink, Snug Green is 2.2:1 and the labels carry the meaning anyway, which is the poll chart's own principle. "Changed your mind?" stays on the poll screen; the pill does one thing per state.
- After signing (the form's success handler, plus a `localStorage` flag for return visits, a per-viewer convenience only): the pill goes. Both asks are done; the page gets quieter.
- Hidden: on the hero (the rail's rule, `scrollY > hero height × 0.5`), while `#poll` is in view (the screen is the pill, expanded; two copies of one ask on screen is the thing the brief forbids), while `#petition-section` is in view, in print, and after signing. Opacity and visibility over 0.25s; no transition under reduced motion, and the vote-to-petition change swaps instantly.
- Shared state: the pill and the poll screen are one module in `script.js` with one fetch and one cookie. A vote from the pill calls the existing `showResults(data, true)`, so the poll screen shows the chart when the visitor reaches it; a vote on the screen updates the pill. A vote over the daily cap, or a change with no vote on record, shows the tally in the pill with no "you voted" (the existing `capped`/`missing` answers).
- Accessibility: a `<form method="post" action="/api/poll">` with a `<fieldset>` whose legend is the question; the tally row is `aria-live="polite"`; focus rings are 3px amber inside the pill and cream on the amber button; the pill sits in the DOM after the rail and before `<main>`, so it is two tab stops after the skip link. Forced colours: borders become `CanvasText`.
- No JavaScript: the same form, always shown (CSS only, no hero rule), posting to `/api/poll`, answered by the Worker's results page as now. On the hero without JS it sits centre right, clear of the sticker at bottom right.
- Room for it: at 1280 the pill's left edge is at 1140px and the content column (`min(1200px, 100%)` inside 6vw) ends at 1203px, so a full-width component such as the verdict's right-hand sim would run under it by about 60px. The rail has the same overlap on the left today, which is why its labels hide on `#maths` and `#history`. Fix it symmetrically: from 901px up, `.screen { --sx: max(6vw, 150px) }`, so at 1280 the column is 980px and nothing runs under either piece of chrome; at 1500 and up the 1200px cap and 6vw take over as now.

**Phones (≤ 600px).** The right edge is where the thumb isn't and 118px is a third of the screen, so the pill becomes a bar: fixed to the bottom, 56px plus `env(safe-area-inset-bottom)`, same ink-and-blur recipe with a 2px cream top border. Left: the amber kicker and the question on two lines (0.78rem). Right: "For" and "Against" as outline buttons, 40px tall with 44px touch targets. After a vote: "For 71% · Against 29% / you voted for" on the left, the amber "Sign the petition" on the right. Hidden in the same places as the pill (hero, `#poll`, `#petition-section`, signed, print), so it never meets the scroll hint or the sticker. Screens keep 12vh of bottom padding (101px at 844), so centred content clears it; the how-to's pinned stage, which has 4vh padding, gets `padding-bottom: calc(4vh + 56px)` on phones so the step pills don't sit under it. Short landscape phones (≤ 450px tall) get neither bar nor pill: the bar would take an eighth of the screen, and the poll screen is two to four viewports away in every structure. Without JS the bar is not shown on phones (it would cover the hero's hint with no way to hide it); the poll screen's form does the job.

**With the rail.** Rail left, vote right, both vertically centred, both the same recipe, so they read as a pair of handles. The rail's active label opens to the right of the rail and never reaches the pill (the label is about 265px from the left edge).

### 2.2 The petition count in the hero

Under "It's a pub. Not a post office.", a `.small` line: "12,345 have signed. Add yours ↓", the number live from `/api/count` (the same fetch that fills `#sig-count`), the link an anchor to `#petition-section`. It is a fact, not a second ask, so it doesn't fight the vote; the vote is hidden on the hero anyway. Below a threshold (marketing to set; I'd say 100) the number is left out and the line is a plain "Sign the petition ↓". Hidden without JS, so the no-JS hero is exactly today's. On phones it is one line above the sticker's reserved zone (the hero already reserves `--pf × 16 + 4rem` at the bottom).

### 2.3 The history page, `/history`, and what the home page keeps

**The page.** `public/history.html`, served at `/history` like `/hazard`. Section map:

1. **Header**, the hazard pages' `.hz-top` pattern on pink: the ink lockup at 40px linking home, a "← Home" pill. No rail on this page (it is one chapter); the vote pill is on it, because people will land here from links and the pill is the campaign's one tap from anywhere (after a vote it links to `/#petition-section`).
2. **Opening screen** (pink, 1 vp): kicker, "Blame 2020. Mostly." at Mega, and the days-since counter big: the digits at the Stat scale the system defines and nothing uses (`clamp(6rem, 30vw, 26rem)`, capped at 20vw here so "1,913" fits beside "days"), the rest of the sentence at Mid. `[data-since]` reused as is.
3. **The timeline** (pink, as long as it needs): vertical. A two-column grid from 720px: a 160px spine column carrying the floor tape (the strip's 4px dashed ink line at 45%, now vertical, drawn once on the list) and a sticker per stop, and a content column carrying the card. Cards as now (cream, 24px radius, ink text, the `.mini` stage, a lowercase heading, the line, the source pinned to the foot), but wider, so each stop can take two to four sentences and, where there is one, a pull quote (Fox, Time Out). The "today" card stays inverted with the live number. Each stop gets an `id` from its date (`#before-2020`, `#2020-03-20`, …, `#today`), so the home page's trailer, other sites and the press can deep-link to a stop. Stickers slap down on reveal, one `.reveal` per stop; no scroll snap, nothing sticky. On phones one column: the sticker sits on the spine at the left gutter, the card below it. Room for more stops: RESEARCH.md's reserves (Boak and Bailey 2018, the 2019 "lager lane", Wales's 28 January 2022, the 2026 BBPA closures as a "why now") are marketing's and copy's call; at roughly 520px a stop on desktop, eight to twelve stops are five to eight viewports, which is fine for a page people choose to read.
4. **Trailer to the test** (blue, 1 vp): one CTA, as the home page's `#test` screen.
5. **Trailer to the petition** (ink, 1 vp): "Still queueing?" and one CTA to `/#petition-section`.
6. **Footer**: this page's sources line; the home page's footer loses the history sources and keeps the worked-example line.

Head: a proper title and description, canonical `/history`, the same OG image and icon tags as the home page. The Worker's `data-abs` rewrite currently runs on `/` only; `/history` needs adding to the `run_worker_first` list and the rewrite in `src/worker.js` so its OG URLs are absolute. The rail's `#history` label-hiding rule and the strip's script go with the strip (A and C); the strip's CSS stays only in B.

**What the home page keeps.** A and C keep a one-viewport pink trailer: the headline, the days-since counter at Big-to-Stat size (the trailer's one amber on ink would be the number; on pink it stays ink), one line, then the eight stickers in a row, dates only, no cards, each sticker a link to its stop on `/history`, and one CTA. The stickers are the component's signature; losing them from the home page would make the trailer a plain poster, and as links they are the page's index. On phones they wrap into two rows of four at 64px. B keeps the strip, cut to four stops (before 2020, 4 July 2020, 19 July 2021, today) with its controls and a link to the page, so the orchestrator can see both options rendered.

### 2.4 The publican chapter

One amber screen, `#pubs` (renamed from `#mats`; the rail says "For pubs"), after the asks to the drinker, in this order: kicker ("run a pub?"), a headline to the publican, the money, the action, the artwork, the downloads, the mats line.

- **The money is a stat, not a calculator, on the home page.** One tile: a big number, the arithmetic in one line so anyone can check it, the "worked example" stamp and a source line. The figures allowed are the worked example (one spot on the bar does 48 orders an hour, four do 192) and the register's reserve pint price (£5.34, Morning Advertiser price survey, Apr 2026): 144 more pints an hour × £5.34 is £769 an hour of bar *capacity*, never takings, or, per the worked example, £107 of pints (20 × £5.34) that took 25 minutes through one spot and six through four. Copy and marketing choose which; whichever goes up needs its own derived row in RESEARCH.md first. A calculator invites a publican to type in their own bar and read the output as a measurement of their pub, which the brief forbids; it belongs on a page with room for the caveats (C's `/pubs`) and in the PR route ("in Neath a pint is…"), not on the home page.
- **The action is the poster**, and the poster is the pledge: a pub that prints "This bar does The Cluster" has joined. So the line after the money is "print the poster", and the pledge form from IDEAS.md (venue, postcode, a new table) is a Round 3 option only if the backend lands, as an optional one-field line under the downloads, never a second form on the page.
- **The artwork folds to one row**: mat front, mat back, poster face A, how-to face B, at 150–200px, tilted as now, with the flat offset shadow. Today the mats are 380px and the two flyer previews are full height; that is 2.65 vp for four pictures of the same mark. The five download pills stay (one row, wrapping), with the sizes. "Mats coming soon" stays one line. The screen is 1.6 vp on desktop. On phones the art is a two-by-two grid and the pills stack two a row, 1.65 vp.

### 2.5 The rail

The chapter list and the section ids change together (the rail already drops any dot whose section is missing). The `#maths` label rule goes in all three; the `#history` rule goes with the strip. Fewer dots means each dot spans more scroll; the fill is dot to dot, so nothing else changes. The chapter kickers ("Then", "Now", "Since 2020") are copy's.

## 3. Structure A: one screen says it all

**Thesis.** The whole argument is one blue screen: both sims side by side under a headline that states the problem, the live scores as the proof, the 25-versus-6 arithmetic as a strip beneath. Everything else keeps the current order, minus three screens, plus the trailer. The feedback's own suggestion, built literally.

**Screens.**

| # | Screen · id | Block | Headline slot (job, placeholder) | What's on it | Reuses | New |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Hero `#top` | cream | As now | Lockup, title, tagline, **the signature count line**, sticker, hint | all | count line |
| 2 | The verdict `#verdict` | blue | **States the problem** in two lines, e.g. "[one line, one barperson, three watching]"; two sub-headlines, one over each sim: what is wrong (six words) and **what we want people to do** (six words) | Kicker; headline; the pair: Single File sim and Cluster sim, each with a cream outline tag ("the single file", "the cluster") and its sub-headline; live scores; the two bars (red, cream) with "twenty orders: 25 min / 6¼ min"; one line with the worked-example stamp; "Sold? Sign the petition." | `.scene` ×2, `.bars`, `.tag`, `a.plain` | the layout; the bars on blue (cluster fill cream, since the two sims' scores are already the screen's amber) |
| 3 | How to `#howto` | cream → blue → green, pinned | As now | As now | the stage | none |
| 4 | Test teaser `#test` | blue | As now | As now | | none |
| 5 | History trailer `#history` | pink | As now ("Blame 2020. Mostly.") | Counter, one line, eight sticker links, CTA to `/history` | `[data-since]`, `.sticker` | the trailer |
| 6 | Poll `#poll` | cream | As now | As now | the poll | none |
| 7 | Petition `#petition-section` | ink | As now | As now | the form | none |
| 8 | For pubs `#pubs` | amber | To the publican | Money tile, poster line, art row, downloads, mats line | mats, flyers | the tile, the row |
| | Footer | ink | | Worked-example line, beer fund | | history sources move |

**The fold.** Four screens (6.3 vp at 1280) become one (1.05 vp). The one idea of the verdict screen is the comparison itself: same pub, two ways, one is four times faster. The headline states the problem; the cluster column's sub-headline states the instruction; "Same pub. Same Thursday." becomes the small caption under the pair, where a description of the experiment belongs. At 1280×800 the screen fits with `padding-block: 5vh` (the how-to stage's padding, not the screen default of 12vh), the paired sims capped at 40vh tall (`width: min(100%, calc(40vh × 16 / 11))`, 465px, so the dots are 24px, the same as the current side-by-side), the bars at 22px tracks. Measured in the wireframe: 1.05 vp. On phones the pair stacks and the screen is 1.3 vp, against four screens today.

**Vote.** The pill appears as the verdict scrolls in (0.5 vp) and stays the vote pill for the 7.6 viewports until the poll screen, which is the longest run of any structure; this is A's cost. After a vote it is the petition pill. The poll screen stays where it is.

**Petition.** Three touches before the form at 9.6 vp: the count in the hero (0.67 vp), "Sold? Sign the petition." on the verdict (1.92 vp), and the pill after a vote. Never two asks at once: the hero has the count (no pill), the verdict has the inline link while the pill asks for the vote (one is a fact-plus-link, one is a button; if the orchestrator wants it stricter, drop the inline link, since the pill carries the petition after the vote).

**Publican.** As 2.4, screen 8.

**History.** As 2.3; the trailer with stickers.

**Rail.** Seven chapters: `#verdict`, `#howto`, `#test`, `#history`, `#poll`, `#petition-section`, `#pubs`.

**Phone.** Verdict 1.3 vp (headline at 8.2vw, sims the full 286px column, bars, line); the bar at the bottom from the verdict on; the trailer's stickers in two rows; the pubs screen 1.65 vp. Whole page 13.0 vp.

**Risks and the rule it bends.** Two headlines on one block bends "one idea per block": defended because the idea is the pair and the sub-headlines are the columns' labels, and the block is neutral blue so neither red nor green is misapplied to a screen that holds both. I drew the sims' chips in red and green in the wireframe to show the option; I'd build them as cream outline tags (the sims' own labels and the bars already carry the colours, and the Whole-Screen Rule says colour belongs to screens, not chips). The problem loses its red screen and the solution its green; the bars and the tags keep the meanings on the blue. The pill's long run is the other risk.

## 4. Structure B: red, green, vote

**Thesis.** Keep the design system's strongest rule intact (one behaviour, one whole-colour screen, one sim) but make each screen fit a laptop, carry the comparison as a score rather than a second screen, put the arithmetic into the two headlines' lines, and answer the "nobody scrolls that far" complaint by moving the poll to right after the argument. Disagrees with the feedback on side by side, agrees on everything else.

**Screens.**

| # | Screen · id | Block | Headline slot | What's on it | Reuses | New |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Hero | cream | As now | As A | | count line |
| 2 | The problem `#problem` | red | **States the problem**, two lines (not the name "The Single File", which goes to the sim's label) | Kicker; headline; the Single File sim capped at 52vh so the screen fits; one line: "Twenty orders: 25 minutes." plus a dry line about the three idle staff; the worked-example stamp inline | `.scene`, `.tag` | the sim cap |
| 3 | The solution `#solution` | green | **Says what we want people to do**: spread out | Kicker; headline; the Cluster sim; **the scoreboard strip**: "single file, so far 4 · the cluster 17"; one line: "Twenty orders: six minutes. Sold? Sign the petition." | `.scene`, `a.plain` | the scoreboard strip |
| 4 | Poll `#poll` | cream | As now | As now | the poll | moved |
| 5 | How to | cream → blue → green | As now | As now | | |
| 6 | Test teaser | blue | As now | | | |
| 7 | History, kept short `#history` | pink | As now | The strip at four stops, controls, a link to `/history` | `.strip` | cut |
| 8 | Petition | ink | As now | | the form | |
| 9 | For pubs `#pubs` | amber | To the publican | As A, plus an optional pledge line | | |
| | Footer | ink | | | | |

**The fold.** Four screens become two whole ones (1 vp each, measured). The comparison is carried, not shown: the red screen's sim keeps running after it leaves the viewport (one change to `sceneIO`: a `data-keep` scene isn't paused when hidden, or its score is frozen at departure), and the green screen's strip shows both numbers, the Cluster's live. The joke writes itself ("while you were reading that: 4"). The maths folds into the two lines, "Twenty orders: 25 minutes." and "Twenty orders: six minutes.", one stamp, no bars; the bars appear nowhere on the home page in B (they stay on the flyers). The one idea of the red screen is the time the line costs; of the green, the time the cluster saves.

**Vote.** The pill from 0.5 vp, but the poll screen is at 3 vp, so most visitors meet the question as a screen, not a pill, and from there down the pill is the petition pill for everyone who voted. The pill's job in B is the second half of the page.

**Petition.** The count in the hero, the inline link on the green screen (2.85 vp), the pill after the vote, the poll results' own "Sign the petition" CTA (existing) for For voters at 3 vp. The form itself is at 10.7 vp; the pill carries it.

**Publican.** As 2.4, with the optional pledge line (one field, "This bar does The Cluster", venue name) only if the backend lands.

**History.** The strip kept short, four stops, "1 of 4", a link to the page. The home page keeps the signature component in its real form at the cost of a second copy of four cards to maintain and a 1.2 vp screen. The rail's `#history` label rule stays.

**Rail.** Eight chapters: `#problem`, `#solution`, `#poll`, `#howto`, `#test`, `#history`, `#petition-section`, `#pubs`.

**Phone.** The two screens fit at 1 vp each (the sim at full column width is 197px tall; headline, line, strip below); the scoreboard strip wraps to two lines; the bar at the bottom from the red screen; the short strip swipes as now. Whole page 14.0 vp.

**Risks and the rule it bends.** Bends nothing in the design system. The risk is persuasive: the comparison is split across a scroll, and a number carried from a screen you've left is a weaker proof than two sims diverging in front of you (the feedback's point 3, which I think is right). The off-screen sim running is a small CPU cost and a change to the pause-on-hidden rule. The short strip duplicates content with `/history`.

## 5. Structure C: pinned pub, two audiences

**Thesis.** Spend the scroll where the feedback said the time should go: one pinned stage (the how-to's mechanics) holds both sims for three viewports while the headline and the block colour change from the problem (red) to the solution (green) to the arithmetic (ink), the sims never stopping and the scores diverging in front of the visitor. And treat the two audiences as two pages: the home page is the drinker's funnel; publicans get `/pubs` and history gets `/history`, each with a one-viewport trailer on the home page.

**Screens.**

| # | Screen · id | Block | Headline slot | What's on it | Reuses | New |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Hero | cream | As now | As A | | count line |
| 2 | The pinned pub `#verdict` | red → green → ink, pinned, 3 vp | Three headlines, one per slice: **the problem**; **what we want**; "25 minutes. Or six." | The pair of sims, pinned. Slice 1 (red): the Single File sim lit, the Cluster sim dimmed to 45%, scores start. Slice 2 (green): both lit, the scores have diverged. Slice 3 (ink): the two bars grow under the sims, the stamp, "Sold? Sign the petition." Three step pills as on the how-to | `.scene` ×2, `.bars`, the how-to's slice code, pills and colour transitions | the chapter |
| 3 | Poll | cream | As now | As now | | moved |
| 4 | How to | cream → blue → green | As now | | | |
| 5 | Test teaser | blue | | | | |
| 6 | Petition | ink | | | the form | |
| 7 | History trailer `#history` | pink | As now | As A's trailer | | |
| 8 | For pubs, trailer `#pubs` | amber | To the publican | The money tile, the mat and the poster as pictures, one CTA to `/pubs` | | the trailer, and the `/pubs` page: posters and downloads, mats, the money worked through (the calculator, with its caveats on the page), the pledge |
| | Footer | ink | | | | |

**The fold.** Four screens become one stage seen for three viewports of travel. Each state is a whole-colour screen with one idea, so the one-idea rule survives slice by slice; the headline changes with the colour (0.5s, as the how-to), the sims are the constant. Scroll distance is not reduced (3 vp against 6.3 today, but 2 more than A); what is reduced is the number of things to take in, and the time spent is on the proof. The markup ships the final frame (ink, both sims, bars) for no-JS and print, as the how-to does.

**Vote.** The pill from 0.5 vp; the poll screen at 4 vp, straight after the argument, as in B.

**Petition.** Count in the hero; the slice-3 inline link; the pill after a vote; the form at 10.5 vp.

**Publican.** A trailer on the home page and a page of its own, `/pubs`: the posters and their downloads, the mats, the money worked through with room for the caveats (this is the only place I'd put the calculator from IDEAS.md, because a page can carry "this is arithmetic, not your takings" above the inputs), the pledge, and a header like `/history`'s. The home page's trailer carries the stat and one CTA. The cost: the audience that prints things gets one more click to the PDFs, and a third page to maintain.

**History.** As 2.3; the trailer with stickers.

**Rail.** Seven chapters: `#verdict`, `#poll`, `#howto`, `#test`, `#petition-section`, `#history`, `#pubs`.

**Phone.** The pinned pair doesn't fit a portrait phone with the headline (two sims at 286px are 410px, plus a two-line Big headline and the bars: about 900px against 844 minus the bar). So at ≤ 600px portrait the chapter isn't pinned: it lays out as three plain screens (red with the Single File sim, green with the Cluster sim and the carried score, ink with the bars), which is B's phone layout plus a maths screen, 3 vp. Everything else as A. Whole page 14.05 vp.

**Risks and the rule it bends.** It bends the brief's own ask: it does not remove scrolling, it spends it; and two pinned chapters (3 vp and 4.5 vp) within 8.5 viewports of each other, with only the poll between them, is a lot of pinning. Dimming a running sim to 45% in slice 1 is an opacity, not a tint or a shadow, but it is the first time a sim is shown faded. The build is the largest: a second slice-driven stage, two new pages, the calculator and its register rows, and the `data-abs` rewrite for two more routes.

## 6. Comparison

Measured from the wireframes at 1280×800 (390×844 in brackets). "Pill reach" is the scroll from any point after the hero to a vote: zero everywhere once the pill exists, so the row shows the hero case.

| | Current | A · one screen | B · red, green, vote | C · pinned, two pages |
| --- | --- | --- | --- | --- |
| Whole page | 19.2 (16.9) vp | 12.8 (13.0) | 13.9 (14.0) | 14.1 (14.05) |
| Argument before the how-to | 6.3 vp, 4 screens | 1.05 vp, 1 screen | 2 vp, 2 screens (+ the poll) | 3 vp, 1 pinned stage |
| First petition touch | 3.4 vp | 0.67 (hero count), 1.9 (inline) | 0.67, 2.85 | 0.67, ~3.5 (slice 3) |
| Poll screen | 13.7 vp | 8.6 | 3.0 | 4.0 |
| Petition form | 14.7 vp | 9.6 | 10.7 | 10.5 |
| Vote from the hero | 13.7 vp | 0.5 (pill) | 0.5 | 0.5 |
| Side by side, live scores | yes, 3rd screen | yes, 1st screen | no (carried score) | yes, pinned |
| 25 vs 6 | a screen | a strip on the verdict | two lines, no bars | slice 3, bars |
| History on the home page | the strip | sticker trailer | strip at 4 stops | sticker trailer |
| Publican | 2.65 vp screen | 1.6 vp screen, stat | 1.6 vp screen, stat + pledge line | trailer + `/pubs` with the calculator |
| Rule bent | | two headlines on one block | none | the scroll ask; two pinned chapters |
| Build beyond the shared pieces | | the verdict layout | `data-keep` scenes, the strip cut | a second slice stage, `/pubs`, the calculator |
| What the feedback gets | | points 2–5, 8–12 literally; the poll stays late (9) | 5, 8–12; not 3; 9 by position | 3, 5, 8–12; not "less scrolling" |

## 7. Recommendation

Build **A's verdict screen in B's order**, with the shared pieces:

1. hero (with the count) → 2. the verdict (blue, both sims, the problem headline, the two sub-headlines, the bars strip, the stamp) → 3. the poll → 4. how to → 5. the test teaser → 6. the petition → 7. the history trailer with the sticker links → 8. for pubs (the stat, the poster, one row of art, the downloads) → footer. Rail: `#verdict`, `#poll`, `#howto`, `#test`, `#petition-section`, `#history`, `#pubs`. From the wireframe numbers that is about 12.8 vp, the poll at 2.05 vp, the form at about 8.5, the vote at 0.5 everywhere.

Why this merge:

- The side-by-side with live scores is the only moving proof the site has and the feedback's own ask; A is the one structure that delivers it in one screen that fits a laptop. B's carried score is honest but weaker, and on a phone the side-by-side is a stack anyway, so A costs phones nothing B doesn't.
- The poll straight after the verdict is the natural reply ("so, stop it?"). It makes the pill mostly the petition pill, which is the better use of a fixed element on a page that asks for two things: by the time the visitor is past the poll, one ask is done and the pill carries the other. A's poll at 8.6 vp leaves the pill asking the same question for seven viewports.
- The petition after the test and before the trailers: the test is a link out, the petition is the last thing we ask of a drinker, and the two trailers are for people who have already decided (readers, and publicans). Copy and marketing may want the petition before the test; the rail and the pill cope either way.
- Keep the publican chapter on the home page, not on `/pubs` yet. The people who print posters shouldn't need a second click to the PDFs, and `/pubs` earns its existence when the calculator and the pledge exist, with their caveats, which is a later round. The money angle goes up as one stat with its arithmetic shown, once it has a row in RESEARCH.md.
- Hold the pinned verdict (C) as the Round 3 stretch: if the plain verdict screen feels thin once the copy is on it, C's stage is the upgrade, and it reuses the how-to's slice code. Don't start there: it is the biggest build and the only option that adds scroll.
- `/history` as 2.3, with the sticker trailer on the home page. B's four-stop strip is the fallback if the team can't bear to lose the cards from the home page, but it is a second copy to maintain.

What I need from the other two: from copy, the verdict's three headline slots (the problem in two lines; six words over each sim), the pill's question and the "you voted" line at pill size (about 20 characters a line), the hero's count line, and the publican headline; from marketing, the count threshold, which money figure, the extra history stops, and whether the petition goes before or after the test.

## 8. Files

- `review/homepage/round-1/design.md` (this file)
- `review/homepage/round-1/wire-a.html`, `wire-b.html`, `wire-c.html`: the three structures, stacked at true heights (pinned chapters at their scroll height, the stage drawn in the first viewport), the rail and the vote pill drawn in place on every block in the state they'd have there, the vote bar in place at phone width
- `review/homepage/round-1/wire-vote-pill.html`: the pill's six states and the bar's three
- Renders: `wire-a-1280.png`, `wire-a-390.png`, `wire-a-fold.png`, and the same for `b` and `c`; `wire-vote-pill.png`
- The live page: `current-1280-fold.png`, `current-1280-full.png`, `current-390-fold.png`, `current-390-full.png`
