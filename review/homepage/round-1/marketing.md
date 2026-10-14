# Homepage, round 1: marketing

Written 14 Oct 2026 against `public/index.html` as served at 1280×800 and 390×844 (positions measured in the browser, not estimated), `RESEARCH.md` (the register), `PRODUCT.md`, `IDEAS.md` and the flyers' marketing notes. Growth, conversion, SEO and PR only; the structure is the designer's and the words are the copywriter's.

**How figures are cited.** `[M]`, `[H1]`…`[H8]`, `[HW]` are the register's "On the page" rows. `[R: …]` is a row in its "Reserves" table, `[Bg]` its "Background: the queueing theory" table, `[Avoid: …]` its avoid list. Anything marked **assumption** is mine and is not in the register; nothing marked that way may go on a page.

**Two numbers to keep in mind.** The site has two success measures (`PRODUCT.md`): petition signatures, and pubs adopting The Cluster. The first has an instrument (`/api/count`). The second has none: nothing on the site counts a pub. That gap shapes most of what follows.

## 1. Audiences and jobs

| Audience | Arrives from | Arrives wanting | The one thing we want | What they need first (evidence or permission) |
|---|---|---|---|---|
| **The drinker** (primary in `PRODUCT.md`) | A mate's WhatsApp, a share of the test licence, the QR on a mat or poster, a press piece, a search | A laugh, and to have their grievance confirmed. A minority arrive to argue the other side (the Against voter) | **A signature.** The vote is the on-ramp (one tap, no details); the signature is the measure. The behaviour change (cluster next time) is the real goal but we can't count it | Proof it is slower (the side-by-side, `[M]`), then permission to step out of the line without looking like they're pushing in: the barperson knows who's next (`[H1]` Fox 1996; `[R: YouGov 2017]`, 91% would say someone else was next). The flyers' notes found the same: permission, instruction, reassurance, in that order |
| **The publican** (secondary) | A drinker who sent it ("look at this"), trade press, a search for a poster, our outreach to the spreadsheets' contacts | A way to say "spread out" that doesn't sound rude, and a reason to bother: idle staff, a blocked room, and (the feedback's point) the money | **Print the poster, then pledge.** The poster is adoption; the pledge is the count. Neither needs a product to exist | The arithmetic in their terms (orders an hour, staff idle, `[M]`), evidence customers will wear it (`[R: YouGov 2017]` 91% police the invisible queue themselves; `[R: Zonal/CGA]` 69/31 for the bar, shown beside `[H7]`'s 40/39 if used at all), and the sign being in the campaign's voice so the house borrows it (flyers' decision: the house line plus the stamp) |
| **Press and trade bodies** (tertiary: CAMRA, BBPA, UKHospitality, LBA, local papers) | A pitch, a search for the story (WSJ, New Statesman, The Week and LBC have all run it, `[R: Coverage]`), a link from someone else's piece | A dated fact, a number, a quote, a picture, a person to call | **A link** (to `/history`, where the dated story lives) and a mention of the petition | Sources they can check in a minute (the register's rows, visible on the page), a press contact (there is none yet: "Domain and contact details: none yet" in the open items), and a page that stays put so the link survives |

**Which audience the home page serves first, and why: the drinker.** The feedback says "more bar people". I agree that the pub is the audience that matters most *per head*, and disagree that the home page should be reordered for them:

- Both measures run through drinkers. Signatures are drinkers. Pubs adopt because customers ask, print or nudge: a landlord has to be sent the link before they can read it, and the sender is a drinker. The flyers' notes made the same call for print ("nobody prints a poster for a stranger's petition; they print a sign they wanted anyway"), and the sign is carried in by a drinker or found by a landlord who already had the itch.
- The publican population is small and reachable by other routes (trade press, outreach to the two spreadsheets, a mat on their own bar), so what the publican needs from the home page is a **door**, not the ordering: one quiet line in the hero ("Run a pub?") that jumps to the pub chapter, and a chapter that works as a landing page with its own URL (`/pubs`) so outreach never has to send a landlord through twelve screens of jokes.
- The press want the history page, not the home page. Give them `/history` and a contact.

So: drinker order on the home page, a hero door and a standalone landing for pubs, the dated page for the press. Minutes for drinkers, pounds for publicans, dates for the press.

## 2. The funnel as it stands and as it should be

### As it stands (measured)

Positions are the top of each block in viewports (vh) from the top of the page, desktop 1280×800 first, phone 390×844 second.

| # | Block | Top (desktop / phone) | Height | What it does for conversion | What it costs |
|---|---|---|---|---|---|
| 1 | Hero | 0 / 0 | 1.0 / 1.0 | Name, strap, one ask: the promo sticker to the test (the fun route in) | One viewport before any argument |
| 2 | The problem (red) | 1.0 / 1.0 | 1.18 / 1.0 | States the problem with a sim | One viewport; the feedback is that people scroll straight through it |
| 3 | The solution (green) | 2.18 / 2.0 | 1.35 / 1.0 | States the fix; carries the page's **first ask**, the plain link "Sold? Sign the petition." at **3.4 / 2.85 vh** | — |
| 4 | "Same pub. Same Thursday." (blue) | 3.52 / 3.0 | 1.15 / 1.0 | The proof (side by side, live scores). This is the screen that should convince; it arrives after the solution has already been asserted | A viewport |
| 5 | The maths (ink) | 4.68 / 4.0 | 1.65 / 1.16 | The one quotable number (`[M]`): the thing a publican or a journalist can repeat | 1.65 viewports on desktop for one sum |
| 6 | How to (sticky) | 6.33 / 5.16 | **4.5 / 4.5** | Behaviour change, the real goal; nothing is asked | 23% of the desktop page, 27% of the phone page, between the proof and every ask |
| 7 | Test teaser (blue) | 10.83 / 9.66 | 1.19 / 1.0 | Second route to the test | A viewport |
| 8 | History (pink) | 12.02 / 10.66 | 1.72 / 1.4 | Credibility and the best share line (the days-since count) | 1.7 viewports, and the strip hides seven of its eight stops behind a swipe |
| 9 | Poll (cream) | 13.74 / 12.05 | 1.0 / 1.0 | **The vote**, buttons at **14.5 / 12.6 vh** | The cheapest ask on the site is the second-last thing on it |
| 10 | Petition (ink) | 14.74 / 13.05 | 1.22 / 1.0 | **The measure**, form at **15.4 / 13.5 vh** | Fourteen viewports after the hero |
| 11 | Mats and posters (amber) | 15.96 / 14.05 | 2.65 / 2.27 | The pub route; poster downloads at **18.3 / 15.8 vh** | The only pub material is the last thing on a drinker page |
| 12 | Footer | 18.61 / 16.32 | 0.55 / 0.6 | Sources, beer fund | — |

Totals: **19.2 viewports** on desktop, **16.9** on a phone. Before a visitor can vote they scroll **13.7 / 12.1 viewports**; before they can sign, **14.7 / 13.0**, unless they take the plain link at screen 3. The argument (problem, solution, proof, maths) is four screens and 5.3 viewports before the how-to begins.

Two things the measurements say that the feedback didn't:

- The team already felt the pull to ask early: the "Sold? Sign the petition." link at 3.4 vh is a petition ask at the proof. The structure should make that the real petition, not a link to one eleven viewports away.
- The how-to is a quarter of the page and sits between the proof and both asks. The feedback says keep it (I agree: it is the behaviour), so the asks have to move around it, which is exactly what the pill does.

### As it should be

Nine screens, about 14 viewports on desktop (**assumption**: the folded screens come in at the current screens' heights), with the vote one tap away from screen 2 onward and the petition at screen 4.

| # | Block | Approx. top (desktop) | Job | Ask on this screen |
|---|---|---|---|---|
| 1 | Hero | 0 | Name, strap, the test sticker, and a quiet **"Run a pub?"** door to `#pubs` | The test (sticker). The pill is hidden here: two stickers is two asks |
| 2 | The problem, with the comparison inside | 1.0 | "The problem is this": the headline says the problem; the side-by-side is the proof | The pill (vote) appears from here |
| 3 | The solution, with the arithmetic inside | 2.2 | The headline says what we want people to do; "25 minutes. Or six." sits under it with its stamp and its caveat | The pill |
| 4 | **Petition** | 3.4 | Desire peaks at the proof; ask there. The current "Sold?" link proves the moment | The form. The pill hides |
| 5 | How to (sticky, 4.5 vh) | 4.6 | The behaviour. Unchanged | The pill |
| 6 | Test teaser | 9.1 | The fun route | Its own CTA. The pill hides when its state is "test" |
| 7 | **History trailer** | 10.3 | Headline, the live days-since count, one line, "The whole story →" to `/history` | The pill |
| 8 | **Poll section** | 11 | The results' home, the "Changed your mind?" flow and the no-JS vote | The buttons. The pill hides |
| 9 | **For pubs** (`#pubs`, also served as `/pubs`) | 12 | The poster as a house sign, the money line, the pledge ask, the mats as "coming soon" | Print / pledge. The pill hides (a pub landing shouldn't ask a landlord to vote) |
| 10 | Footer | 13.5 | Sources, beer fund, privacy | The pill hides, or becomes "Tell a mate" |

Where the two asks go, and why:

- **The vote goes everywhere, as a fixed pill** (the feedback's point 9). It is the cheapest ask on the site (one tap, a cookie, no details), it pays the visitor back immediately (the tally), and it tells the campaign the thing the feedback calls "the whole point" (how much people hate this). It hides on the hero and on any screen that carries its own ask.
- **The petition goes to screen 4, not a sticky banner.** A banner costs a strip of every viewport (a 60px banner, **assumption**, is 7% of an 844px phone), sits on the lockup, and is a permanent second ask next to the pill, which is what the brief's one-ask rule forbids. The pill's post-vote state does the banner's job (the petition is always one tap away after a vote), costs no viewport, and only appears once the visitor has engaged. The section itself moves to where desire peaks.
- **The poll section stays**, lower down, as the results' home and the no-JS route. Most votes should come from the pill; the section is where "Changed your mind?" and the chart live.

### The trigger logic (one ask per moment)

The pill is one fixed element with these states. The state on load comes from the `GET /api/poll` the page already makes (`{ voted, choice, results }`), so a returning voter never sees the vote again.

| State | When | The pill reads (the copywriter has the words; this is the job) | Tap | Hidden on |
|---|---|---|---|---|
| **off** | Hero, footer | — | — | — |
| **vote** | No vote on record; from `#problem` on | The kicker, "Pick a side" (neutral: never a side) | Expands **in place** into the question and the two equal buttons, For then Against, same `name="choice"` values as the section. Nothing scrolls | `#poll`, `#petition-section`, `#pubs` |
| **result** | Just voted from the pill (this page load) | The expanded pill shows what the section's results show first: the lead line (`leadFor`), the two percentages, one next step by side, and "the full result ↓" to `#poll` | The next step collapses it to the matching state below | — |
| **sign** | Vote on record is `cluster` (For) | "Sign the petition" | Anchor to `#petition-section` (a visitor-initiated anchor scroll is allowed) | `#petition-section`, `#pubs` |
| **test** | Vote on record is `single` (Against) | "Take the test" | Link to `/hazard` | `#test`, `#pubs` |
| **signed** | The petition form succeeded (this load; a `localStorage` flag as a per-viewer convenience, never relied on) | "Tell a mate" | The existing share routine (`#share-btn`'s logic) | — |
| **not counted** | `capped` or `missing` from the Worker | The section's own line ("That one didn't count"), then collapses to **vote** or **sign/test** by what's on record | — | — |

Rules that make this honest and cheap:

- **One ask per moment:** the pill hides on every screen that has its own ask, and the "Sold? Sign the petition." link goes once the petition section follows the proof directly.
- **The section and the pill share one state.** A pill vote shows in the section (and vice versa) without a reload; the section already keeps `last` for "Keep my vote". "Changed your mind?" stays in the section only.
- **No JS:** the pill is an `<a href="#poll">` in the HTML and the forms keep `method`/`action`; the Worker's no-JS results page already carries the next step (`pollWords().next`).
- **Nothing moves the page.** The pill expands in place (`position: fixed`, no layout shift); the only scrolls are anchors the visitor taps.

### The test's place in the funnel (a note for later, not Round 3)

The test is the viral route (the licence is the thing people share, and its share text links home), but the result screen has no petition link: only the lockup, to `/`. A line on the result panel ("Now sign the petition") is the cheapest conversion fix outside the home page. The hazard pages are out of this round's scope, so I'm recording it, not proposing it.

### What to measure (with what the site has)

No analytics exist, and I'm not proposing a dependency this round. What there is:

| Signal | Where it comes from | What it tells you |
|---|---|---|
| Signatures | `/api/count` (cached 60s), or `SELECT count(*) FROM signatures` | The measure. Compare the week before and after merge |
| Votes, and the split | Vote once from a team browser and read the section, or `SELECT choice, count(*) FROM poll_votes GROUP BY 1` | Engagement, and the headline for PR |
| **Votes to signatures** | The two counts | The post-vote "sign" state's job. If votes climb and signatures don't, that state isn't working. **Assumption:** votes will outnumber signatures several times over; I'm not putting a ratio on it |
| Where votes came from | Add `source: 'pill' \| 'section' \| 'nojs'` to the vote body and `console.log` it in the Worker. **Log it, don't store it**: nothing personal, no schema change | Whether the pill is doing the work |
| Where signatures came from | Same field on `/api/sign`, logged only | Whether the early petition or the pill's "sign" state converts |
| Over-cap votes | The Worker's existing "Poll vote over the daily cap" warning | Whether the caps are biting real groups (see §7) |
| **Poster downloads** | Add `/flyers/*` to `run_worker_first` in `wrangler.jsonc` and have the Worker `console.log` the path before returning `env.ASSETS.fetch(request)`: one line, no script on the page, no personal data. (Cloudflare's own per-path analytics need the custom domain; on workers.dev there is no zone to report on) | The only pub-adoption proxy the site has today |
| `/history`, `/pubs`, `/hazard` views | The same Worker log line, with those paths in `run_worker_first` (`/history` and `/pubs` need to be there anyway for the `data-abs` rewrite, §5) | Whether the page and the door are being found |
| Search impressions and clicks for `/history` | Google Search Console, once the custom domain is live | Whether the SEO case in §5 is paying |
| Pledges | The pledge form in §6, once built | The second measure, finally counted |

Cloudflare Web Analytics (in `IDEAS.md`) is the next step if the team wants paths and referrers in one place; it needs `static.cloudflareinsights.com` in `script-src` and `connect-src` in `public/_headers`, and nothing else. Not for Round 3.

## 3. Priorities

Impact is on the two measures (signatures; pubs adopting). Effort is the designer's and the engineer's, not the copywriter's.

| # | Feedback point | Impact | Effort | Verdict | Why |
|---|---|---|---|---|---|
| 9 | Vote throughout (a pill) | **High**: the cheapest ask, from screen 2 instead of screen 9; feeds the petition through its post-vote state | Medium: one fixed element, five states, shared with the section, no-JS fallback | **Build** | The feedback's "whole point", and the fix that lets the asks move around the how-to |
| 10 | Petition higher | **High** on the measure: 15.4 vh to about 3.4 | Low: move a section; retire the "Sold?" link | **Build** (as "higher"; not as a sticky banner, see §2) | Desire peaks at the proof |
| 3, 2, 5, 4 | Fold the argument: the comparison inside the problem, the arithmetic inside the solution, headlines that state the idea | **High** together: 5.3 viewports of argument become about 2.4 (**assumption**: two screens at today's heights); the proof arrives on the first argument screen | Medium: two screens rebuilt; the sims and the bars already exist; the rail list and ids change | **Build**, as one job | Keep "25 minutes. Or six." and its stamp; the sum is the only number a publican or journalist can repeat (§4, §5) |
| 8 | History as its own page | **High** for acquisition (the only organic route the site would have) and for PR (a thing to link to); **medium** for the two measures directly | Medium-high: a page, a trailer, meta, an OG image, the Worker's `data-abs` path list | **Build** | §5 |
| 11, 12 | Pubs: who it's for; the money | **Medium-high** on the second measure, which currently has no instrument | Low for the copy, the money line and the email ask; medium for a calculator; medium for the pledge backend | **Build the chapter** (copy, hero door, money line, pledge ask as an email with its own consent); **wait** for the calculator and the pledge table | §4 and §6 |
| 1 | Hero: "you have to scroll" | Low | Low | Keep; add the pub door and let the pill appear on scroll | The hero's job is the name and the joke; the sticker is already an ask |
| 6, 7 | How-to and the test teaser | — | — | Keep | As the feedback says |
| 10b | Sticky header banner | Low, possibly negative | Low | **Don't** | Viewport cost on every screen and a permanent second ask |
| 12b | "In Neath the pints are £X, you're losing £Y" | Medium for local press, **negative** for the brand if done as stated | High: a register-grade price per town doesn't exist | **Wait**, and reframe (§4) | The one point I disagree with |

**The five for Round 3:** (1) the two-screen argument (points 2, 3, 4, 5), (2) the vote pill (9), (3) the petition at screen 4 with the pill's post-vote "sign" state (10), (4) `/history` with the home page trailer (8), (5) the pub chapter rewritten as a landing with the money line and an email pledge (11, 12 as copy).

**What waits:** the calculator, the pledge table and its map, the per-town PR, the press page, Web Analytics, the test's petition link, any change to the how-to.

**Where I disagree with the feedback.** Point 12's framing, "they're losing money… you're losing out on this much", and its local version. The register cannot support "losing": the arithmetic only shows orders *waiting*; whether a waiting order is ever lost is unknown (the one hint, `[R: Barclaycard 2016]`, 20% have left a bar because of waits, is a 2016 commissioned survey the register says to use lightly). A per-town figure has no register-grade source, and the brief forbids anything that reads as a measurement of a real pub's takings. And "Neath's pubs are losing £Y" names a place and shames its pubs, which the campaign never does. The money angle is right; the frame should be the pub's **gain** (what the staff could be pouring) and the figure should be labelled arithmetic, as §4 sets out. Smaller disagreements: the sticky banner (above), and "more bar people" as the home page's order (§1).

## 4. The money angle, modelled honestly

### The model

Everything here is derived from two register rows and nothing else: the worked example `[M]` (75 seconds an order; one spot on the bar does 3,600 ÷ 75 = 48 orders an hour; four staff along the bar do 192) and the average draught pint, **£5.34**, Apr 2026, Morning Advertiser price survey, 21 May 2026 (`[R: pint £5.34]`, type S, confidence medium-high, "label as illustrative"). The demand levels are the register's own illustrative ones: 36, 45 and 90 orders an hour (`[Bg]`; the page uses the 90, `[M]`).

The sum, for one hour where demand exceeds one serving point:

```
orders arriving          90 an hour        (illustrative Friday, [M])
one spot on the bar      48 an hour        (3,600 ÷ 75, [M])
not served that hour     90 − 48 = 42      (the line grows by 42 an hour, [M])
at £5.34 an order        42 × £5.34 = £224.28   →  "about £224 an hour on the bar, waiting"
four staff along the bar 192 an hour capacity, so all 90 served, 0 waiting
```

| Orders arriving an hour | One spot serves | Waiting, per hour | At £5.34 | Four along the bar | Two staff fed by the file |
|---|---|---|---|---|---|
| 36 (quiet, `[Bg]`) | 36 | 0 | £0 | 36 | 36 |
| 45 (steady, `[Bg]`) | 45 | 0 | £0 | 45 | 45 |
| 90 (Friday, `[M]`) | 48 | **42** | **£224** | 90 | 90 (96 capacity; the backlog doesn't grow, the waits are long: about 9 minutes average in the register's background model, which stays off the page) |

Sensitivities worth knowing, none of them for the page:

- **At the observed rate, not the generous one.** pubLAB's 2 min 23 s per customer (`[R: pubLAB]`, 2015, medium) makes one spot 25 an hour; against 90, 65 wait, which is £347 an hour. "75 seconds is generous to the single file" is already the register's line.
- **Per evening.** Three hours at 90 an hour: 126 orders, £673, "on paper". On paper is the point: a line 126 long doesn't happen, because people stop joining it. What becomes of those orders (ordered later, ordered less, ordered elsewhere) the register cannot say.
- **Never annualised.** "£X a year" is the DataSparQ trap (`[Avoid: "two months of your life"]`, marketing with no method). One hour, labelled, is as far as the arithmetic goes.

### What it is not (the caveats, in full)

1. **Not a measurement.** It is the worked example with a price on it. Nobody timed a bar.
2. **Not lost revenue.** It is orders waiting. People mostly wait; some order later; some leave. We have no register figure for the share that leaves.
3. **Not pints.** An order is often a round, so £5.34 an order probably understates the drinks' worth; we have no figure for round size, so the page says "an order, if it were one pint".
4. **Not every single file.** A file that feeds two staff doesn't fall behind at 90 an hour (table above). The page's source line already says the file "ends at one spot on the bar (they do)"; the money line must keep that condition visible.
5. **Not below 48 an hour.** At quiet and steady demand the arithmetic says one spot copes. The money story only exists on a busy night, and the line should say "Friday night".
6. **Not any real pub's takings.** The brief's hard rule. No pub name, no town, no "your pub loses".

### How the site should present it

For publicans only (the pub chapter and the pub pack). Drinkers get minutes, not pounds; a drinker who reads "£224 an hour" hears "the pub is ripping me off".

- **The line (Round 3).** One sentence under the chapter's headline, in the copywriter's words, carrying exactly: Friday, 90 orders an hour; one spot on the bar does 48; the other 42 are stood there holding about £224; four staff along the bar pour the lot. The **stamp**: "worked example", as on the maths screen. The **caveat**, one line, same screen: arithmetic, not an audit; 75 seconds an order, one pint an order, the average pint (Morning Advertiser, Apr 2026); your pub is messier. The **frame**: what the staff could be pouring, never what the pub is losing. Register work: move `[R: pint £5.34]` to "On the page" with a location code for the pub chapter, add a derived row for 42 × £5.34, and add the survey URL to the before-promoting checklist.
- **The stat (optional, same screen).** "48 an hour" against "192 an hour" is the pub's version of 25-versus-6: orders an hour, not minutes. If the designer wants one big number on the pub screen, that pair is the honest one. Not "£224" as a mega: a pound figure that big reads as a claim.
- **The calculator (wait).** Inputs: staff on (1 to 6, default 4), pint price (default £5.34, labelled "UK average, Apr 2026"), how busy (quiet 36 / steady 45 / Friday 90, from `[Bg]` and `[M]`, or a number). Outputs: one spot on the bar serves `min(demand, 48)`; along the bar serves `min(demand, 48 × staff)`; waiting an hour is the difference; "on the bar, waiting" is that times the price. Without JS it shows the worked line. The words it may never use: lost, losing, revenue, takings, profit. The point of the calculator for PR is that **the pub supplies the price**, so the figure is theirs, not ours, which is the only safe route to a local number (below).

### The PR and content version: "in Neath the pints are £X"

**How it would be produced.** The register has one pint price, and it is national (`[R: pint £5.34]`, Morning Advertiser's survey, Apr 2026). A town figure would need its own register row with a source of the same grade or better: a dated, published price survey by a named body with a stated sample (a CAMRA branch survey of n pubs in the town; a local paper that priced named pubs on a stated date; or ONS's national average price series for a pint of draught lager, which exists but is not in the register and is not local either). Crowd-sourced apps and sites are not register-grade. The honest local source is **the pub itself**: a landlord who tells us their price, or types it into the calculator, has given us a local figure we can quote with their permission.

**Risks.**

- "Neath's pubs are losing £Y" names a place and shames its pubs. The campaign teases behaviour, never pubs (`PRODUCT.md`, principle 5; the flyers' notes keep anything that reads as the pub's own waiting time off the wall for the same reason).
- Local papers will headline "losing" even if we write "waiting". The release has to make the honest frame the headline, or we accept the rewrite and the register row that shows what we actually said.
- A town's number differs from the national one only by the pint price (£224 at £5.34; £190 at £4.50): the story is the same everywhere, so the local angle is cosmetic, and cosmetic claims about money are where trust goes.
- A pub reading its town's "loss" in the paper is a pub that doesn't print the poster.

**The safer framing: the local pub's gain.** "A Friday single file leaves 42 orders an hour stood at the bar. At [town]'s £X a pint (source), that's about £Y an hour the bar staff could be pouring. Spread out, and they will." Then the local hook that costs nothing and shames nobody: the first pub in the town to say "This bar does The Cluster" (a real pledge, with permission), the poster download, and the offer of the mat pack when it exists. Gain, staff, permission; never loss, pub, blame. The campaign supplies the sum, the pub supplies the price, the paper supplies the town.

## 5. The history page

### The SEO case

The strip is the most credible thing on the site and the least findable: eight dated, sourced stops behind a horizontal swipe on a page whose title is the brand name. Search is the one acquisition route the site doesn't have, and this content is the one part of the site that matches how people search for it.

**Search intents it can rank for** (the questions, in the words people use; volumes are not known and I'm not inventing them):

- "why do people queue at the bar", "why do pubs have queues now", "single file queue pub", "queuing at the bar since covid": the question the page exists to answer, and one Time Out (`[H6]`), the WSJ, the New Statesman and The Week have all written up (`[R: Coverage]`), so there is demonstrated press demand and existing pages to be the better answer than.
- "when did table service end in pubs", "when could you order at the bar again", "pub rules 19 July 2021": dated-fact intents the page answers exactly (`[H5]`, `[HW]`, and the Scotland and NI dates in the register's wider timeline).
- "yougov pub queue", "do people prefer queuing at the bar": `[H7]` and `[R: Zonal/CGA]`.
- "is it rude to not queue at the bar", "pub bar etiquette queue": `[H1]` Fox and `[R: YouGov 2017]`, which also hands the reader to the how-to.

**URL.** `/history`, served from `public/history.html` the way `/hazard` is. It is short, it is the thing the campaign and the press will link, and it stays right as the page grows beyond the question (rulings, press). The question belongs in the title and the opening, not the slug; a question slug (`/why-do-people-queue-at-the-bar`) can be a later sub-page if the hub gets big. One page, one canonical.

**Title and H1 jobs** (the copywriter writes the words):

- `<title>`: the search question plus what the page is, under about 60 characters, e.g. the question and "a short history". The brand goes at the end or not at all.
- H1: can stay in the campaign's voice ("Blame 2020. Mostly.") provided the first paragraph answers the question in plain words in its first two sentences (that paragraph is the snippet candidate), and the H2s carry the dates.
- Meta description: the answer in one breath, with "sources" in it.

**The structured content it needs.**

- A vertical `<article>` of dated stops, each an `<h2>` with the date and the event, a `<time datetime>`, one dry line, and the source line linked (the strip's cards already have all of this).
- A **questions section** answering the search questions above in plain words, each a heading, each with its source: why the queue started (`[H3]`, with the nuance that the rules never said to queue at the bar and that COVID normalised it rather than invented it, both register rules); when table service ended, by nation (`[H5]`, `[HW]`, the wider timeline); whether most people prefer it (`[H7]` beside `[R: Zonal/CGA]`, both shown, as the register requires); whether stepping out of the line is rude (`[H1]`, `[R: YouGov 2017]`); how to order without queueing (link to the how-to and the test).
- `Article` and `FAQPage` JSON-LD, with `datePublished` and `dateModified`. A `<script type="application/ld+json">` block is data, not executed script, so the CSP's `script-src` doesn't block it; check the console after deploy.
- Internal links: in from the home trailer, the footer's sources line, the test hub and the petition thank-you; out to the test, the how-to (`/#howto`), the petition (`/#petition-section`) and `/pubs`.
- Open Graph and Twitter tags of its own with a **static** OG image (the count can't be live in a PNG; use the headline and the floor-sticker motif), built by the icons script on a Mac like the others. The Worker's `data-abs` rewrite only runs on `/` today (`run_worker_first: ["/api/*", "/"]`); add `/history` (and `/pubs`) to that list and to the Worker's path check, or the share tags won't get the origin.
- The same source rigour as the home page: every stop has its register row; the register's location codes gain an H-page set.

**Extra stops the register already supports** (each has a row; none needs new research):

- Before 2020: Boak and Bailey, Aug 2018, and the Edinburgh "lager lane", Morning Advertiser, Jun 2019 (the register's "wider timeline" nuances): the queue existed before the pandemic, which the page must say.
- Before 2020: YouGov, 24 Nov 2017, 91% would speak up for someone served out of turn (`[R: YouGov 2017]`): the invisible queue polices itself.
- 2013 and 2015, as "how the bar works" rather than dated news: Loth, Huth and de Ruiter (`[R: Frontiers 2013]`), pubLAB's 2 min 23 s (`[R: pubLAB]`).
- 2020–21, between the current stops: 23 Jun 2020 "one metre plus", 5 Nov 2020 and 6 Jan 2021 lockdowns, 12 Apr and 17 May 2021 reopenings with table service kept (the wider timeline); and the register's "also true" figures (222 days open indoors, about 140 under table service).
- The other nations' dates: Scotland 9 Aug 2021 and the Omicron return, Wales 28 Jan 2022 (`[HW]`), Northern Ireland 21 Jan 2022.
- 30 Jul 2021, YouGov: 51% preferred table service (`[R: YouGov 2021]`), framed with care because table service is not a bar queue.
- 2025: the WSJ, 23 Aug; the New Statesman, Sep; The Week, 26 Sep; LBC (`[R: Coverage]`); Tim Martin's "traditional anarchy of a non-queue" (`[R: Tim Martin]`); YouGov's 1 in 4 who saw a single file in the past year (`[R: YouGov 2025, 1 in 4]`).
- Dec 2025: Zonal/CGA 69/31 (`[R: Zonal/CGA]`), only beside `[H7]`.
- 2026: BBPA closures (`[R: BBPA]`) as a "why now" line, if the copywriter wants one, not as a stop.

Everything in the avoid list stays off: Hackney, the regional YouGov split, the East London Times, DataSparQ, "COVID invented the queue".

**How it becomes a hub.** `/history` is the parent for dated content. Each new dated thing becomes a stop (a new ruling, a new poll, a new piece of coverage), which updates `dateModified` and gives the page a reason to be re-crawled and re-linked. Siblings: one page per ruling (`/rulings/the-hoverer`, from `IDEAS.md`; the Additional Bar Rulings are in `PRODUCT.md`), each linking back; a press page (`/press`) with the key facts, the marks, a contact and a "coverage" list that starts with coverage of the issue (`[R: Coverage]`), clearly labelled as such because there is no coverage of this campaign yet and none may be invented. When a paper runs the campaign, its piece is a stop and a press-page entry the same day.

**What the home page keeps, and why.** A trailer: the headline, the live days-since count (`[H8]`, the one amber on that screen), one line, and "The whole story →". The count is the site's best share line and it rewards a return visit, so it stays on the page people land on; the eight stops move to where they can be read, linked and found. The home page loses about 1.7 viewports and the strip's script; the no-JS text ("over five years") and the `[data-since]` logic come with the trailer.

## 6. For pubs

**How the chapter sells.** It talks to a landlord who has been sent the link, and it should work as a landing page in its own right (`/pubs`, plus the `#pubs` chapter; the hero door points at it). The order of asks is the flyers' hierarchy with the money line added:

1. **The poster as a house sign** (decided for print, `brand/final/review/flyers/round-1/decision.md`): "This bar does The Cluster" in the campaign's voice. The chapter's first ask is to print it, with the existing download links and the one line that matters ("Stick it behind the bar, facing the room"). Printing is adoption; nothing else needs to exist.
2. **The money line** (§4): the reason for a landlord who doesn't yet feel the itch, framed as what the staff could pour. Below the poster, never above it.
3. **The pledge.** The mats are "coming soon" with no order route, so the chapter must not say "order" (there is nothing to order) and must not leave the landlord with nothing to do. Ask for the one thing we can take today: **an email and a pub name**, as a pledge: "This bar does The Cluster. Tell me when the mats are ready." The pledge's job is to turn a print into a count (the second measure's missing instrument), to build the list the mats will ship to, and to be the first thing a local paper can quote with permission. Until the pledge table exists, the same ask can go through the petition form with a "I run a pub" tick and its own consent line; `IDEAS.md` has the pledge form as an M.
4. **The mats** shown as they are, "coming soon", with the pledge as the way to be told first.

**The pledge wording's job** (the copywriter writes it): say what the pub is agreeing to (a way of serving, not a rule for customers), what we'll send (the mats when they exist, campaign news, nothing else), that we won't list the pub anywhere without asking, and how to withdraw. The house line from the poster is the pledge; the form just records who said it.

**A pub pack** (a download, one PDF or a zip; most of it exists): the poster PDFs (A4, A5, double-sided, two-up); the how-to face; a staff briefing card ("serve by eye contact, then by arrival", from `IDEAS.md`, with step 4's reassurance in the staff's voice); a till or window card with the house line; the worked example with the money line and its caveat, on one sheet, for the landlord not the wall; the mat previews marked "coming"; two social post lines; the campaign's email once it exists. No case study: there is no pub to cite (`[Avoid: Hackney]`), and no pledge may be shown that wasn't made.

**Legal rails.**

- **PECR:** a pledge email is marketing to a business contact; sole traders and partnerships need consent, so the pledge form takes consent for exactly what it says it will send, with an unsubscribe in every message. A "we got your pledge" reply is transactional and fine. Outreach to the spreadsheets stays to role-based addresses, as the earlier handover says.
- **UK GDPR:** pledges are personal data (a name, an email, a pub) and get the same storage rules as signatures (Hyperdrive, no connection string in the repo, a deletion route, the privacy notice). No pledge appears on a map or a list without a separate opt-in.
- **No shaming:** the chapter never names a pub that queues, never shows a "pubs that haven't pledged" anything, and the money line never attaches to a named pub.
- **No fake pledges:** no counter until there is a real count, no "join 200 pubs" until there are 200.

## 7. Risks and rails

| Risk | What changes it | The rail |
|---|---|---|
| **The poll's fairness.** A pill that leans makes the tally worthless as a PR number | The pill is on every screen and is the main voting route | The pill's label is the kicker, never a side. Expanded, the two buttons are equal in size, colour, weight and order (For first, as the section), ink on cream or cream on ink, no green or red before a vote, no default focus on either, the same `choice` values. The results keep their colour meanings only after the vote. The pill's colour must not fight each screen's one amber (the rail's ink and cream is the safe choice; the designer's call) |
| **Vote stuffing.** A vote one tap from anywhere | The API doesn't change: the same cookie (one per browser, a change replaces), the same 10-a-minute burst limiter per network and the daily caps (20 per IPv4 or /64, 200 per /48). The pill makes stuffing by script no easier (scripts never needed a button) and stuffing by hand no cheaper per vote | What the pill does change is **collisions among real people**: a pub's wifi or one phone network puts a table of mates behind one address, and a round of pill votes in a minute can trip the 10-a-minute limiter or the 20-a-day cap. Count the "over the daily cap" warnings in the Worker logs by hour; if they cluster at pub hours, raise the per-network cap before suspecting bots. Pill volume also brings "Poll at scale" (full-table counts on every vote) forward; the one-row running total in the open items is the fix. Turnstile stays the next step if stuffing appears |
| **The petition's privacy promises.** The form moves to screen 4; the pill carries a "sign" state | Nothing in the data path changes; the exposure does | The consent text stays on the form, unchanged; the pill links to the form and never prefills or submits; the "signed" state is a per-viewer `localStorage` convenience, not a record. A form at screen 4 is the page's biggest ask before any privacy line, so the privacy notice in the open items (petition, the `dq_poll` cookie, the hashed daily network counts, and now pledges) moves from "before promoting" to "with this merge" |
| **The no-JS page** | A pill, a folded argument, a trailer, a calculator | The pill is an anchor in the HTML; both forms keep `method` and `action` and the Worker's HTML answers; the folded screens keep `.scene[data-mode]`, the bars' markup and the ids the rail and `script.js` look for (or the rail list changes with them); the trailer keeps "over five years"; the calculator degrades to the worked line; `/history` is plain HTML |
| **"Worked example" honesty** when the arithmetic sits on a sim screen | The sims' scores are seeded and illustrative; the 25-versus-6 is deterministic arithmetic. Side by side, each can be read as the other's result | The stamp travels with the figures, on the same screen, with the source line's words ("Simple arithmetic, not a survey… Illustrative, like the sims"); the sims keep their own "pints served" labels and never show "25" or "6"; the footer's line about both being worked examples stays; the register's row `[M]` gets its new location code. The money line obeys the same rule on the pub screen |
| **The pub door and the pill on `/pubs`** | A landlord landing on `/pubs` sees a drinker's vote pill | The pill hides on `#pubs` and on `/pubs`; the pub landing asks one thing |
| **The hero's two stickers** | The pill appears on the hero | It doesn't; the promo sticker is the hero's one ask and the pill starts with the rail |
| **The register** | New figures on the page | Every new line gets a row before it ships: the pint price promoted from Reserves, the derived £224, the three demand levels if the calculator uses them, the history page's extra stops' location codes |

## 8. Recommendation

Build the two-screen argument first (it is where the other changes hang: the comparison and the arithmetic become the proof on screens 2 and 3), then the vote pill with its five states and the no-JS anchor, then move the petition to screen 4 and wire the pill's post-vote "sign" and "test" states to it and to `/hazard`, then `/history` with the questions section, its own meta and OG image, the Worker's `data-abs` path added, and the home page's trailer with the live count, and last the pub chapter rewritten as a landing (`/pubs`, the hero door, the poster first, the money line with its stamp and caveat, an email pledge with its own consent, the mats as coming). Log a `source` on votes and signatures (never stored) so the pill and the early petition can be judged. Success in the first month after merge, with the instruments the site has: signatures per week up against the four weeks before, with the votes-to-signatures ratio moving the right way after the pill (if votes climb and signatures don't, the post-vote state is the thing to fix); poster PDF downloads counted for the first time and a first real pledge recorded; `/history` indexed, with impressions in Search Console for the "why do people queue at the bar" family and at least one inbound link from a piece that already covers the queue; the Worker's over-cap warnings reviewed by hour and found to be rare or explained; and the privacy notice live before any of it is promoted.
