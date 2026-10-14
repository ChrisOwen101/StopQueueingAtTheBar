# Homepage, round 2: copy

Copywriter, 14 Oct 2026, after `round-1/design.md`, `round-1/marketing.md`, the wireframes (`wire-a-1280.png`, `wire-a-390.png`, `wire-vote-pill.png`) and my own `round-1/copy.md`. Section 3 is the deck for the recommended structure (A’s verdict in B’s order), ready to paste. Register rows are cited as `[M]`, `[H1]`…`[H8]`, `[HW]`, `[R: …]`; anything the register doesn’t yet hold is written out as the row it needs.

## 1. Where I agree

- The order: hero → verdict → poll → how-to → test → petition → history trailer → pubs → footer. The poll straight after the proof is the natural reply, and from there the pill carries the petition, so the form can sit after the test without losing anyone.
- No sticky banner (both of them). The pill’s post-vote state does the banner’s job at no viewport cost. My Round 1 banner is withdrawn.
- The count in the hero as a fact plus a link, not a second ask (designer, 2.2); the threshold at 100 (marketing to confirm).
- The money is for publicans only, framed as what the staff could pour, never "losing" (marketing, §4). Drinkers get minutes.
- The poster is the pledge; the calculator and the pledge table wait (both).
- `/history` with a questions section (marketing, §5) and a static OG image (designer, 2.3).
- The sub-headlines over the sims are the columns' labels, not a second idea (designer, §3). My pair fits them; see below.

## 2. Where I push back

**The verdict’s three slots.** The designer asks for a problem headline in two lines, then six words over each sim: what is wrong, what we want. My pair "Four staff. One working." / "Four staff. Four working." doesn’t split that way: the second says what happens, not what to do. So: the headline is **Four staff. / One working.** (the problem, proven by the live score under it), the single-file sub-head is the cause, **One line. One spot on the bar.**, and the cluster sub-head is the instruction, **Spread out. All four working.** Problem, cause, fix, read top to bottom. "Same pub. Same Thursday." drops to the caption under the pair, where the designer put it. **The "Sold? Sign the petition." link goes** from this screen (marketing’s rule): the pill is asking for the vote here and the poll is the next screen; a petition link on the proof now sends people past the vote.

**For / Against versus Stop / Keep.** Both of them keep For / Against; I proposed Stop / Keep because a pill without its question in view makes "For" meaningless. The designer’s pill carries the question in every state except the 100px tablet variant, which drops it. So I concede the labels on one condition: **the question is never dropped.** At 118px it is "Stop the single file?" (the chips on the verdict have just taught the term); at 100px it is "Stop the queue?" on two short lines. That keeps the poll screen, the chart rows and the Worker’s no-JS page untouched, so section 4 is "none".

**The pill after the vote.** The designer’s layout (kicker, two tally rows, one amber button) with marketing’s logic: the button is **Sign the petition** for a For voter and **Take the test** for an Against voter, as the poll screen’s own next step already is. Asking someone who just voted Against to sign is a wasted ask and reads as not listening. The kicker says which way they voted ("you voted for"), because the designer’s "YOU VOTED" loses the one fact the voter cares about. Marketing’s expanded "result" state (lead line, percentages, "the full result ↓") is too much for 118px; the lead line stays on the poll screen, and the pill gets a small "full result ↓" link only if there is room. After signing: **Tell a mate** in cream, no amber (marketing); if the designer would rather the pill went, that is fine too, since the form shows the same button.

**£224 waiting versus £769 capacity.** £769 is 144 extra orders an hour at £5.34, which is only money if 192 orders an hour turn up, and the register’s busiest demand is 90 `[M]`. £224 is 42 orders an hour stood in a line on the register’s own Friday, priced. One sits inside the register’s arithmetic; the other needs demand the register doesn’t give. And marketing is right that a pound figure at Mega reads as a claim. So the tile’s big number is **192**, orders an hour, with 48 beside it, and the pound figure lives in one sentence with its caveat. Both rows are written out in section 3.

**The history trailer’s headline.** The designer’s trailer carries "Blame 2020. Mostly." at Mega and the counter big beneath it: two headlines, and the first is the H1 of the page one click away. The trailer should trail: the counter is the headline (it is live, it rewards a return visit, and it is the one thing the home page keeps), and "Blame 2020. Mostly." is the line that names the page. Both strings are below; the designer can build either, but not both at Mega.

**The hero door for pubs** (marketing): one quiet link, fine, but as a plain text link at the end of the count line, never a second sticker.

## 3. The deck, in page order

Headlines are written in sentence case; the CSS lowercases them. Capitals in body text and buttons stand: The Cluster, The Single File. "≈" marks a string the script writes with live numbers.

### Hero `#top`
- h1: Don’t Queue At The Bar
- strap (`.mid`): It’s a pub. Not a post office.
- count line (`.small`, ≥100 signatures, ≈): 12,345 have signed. Add your name ↓ (link to `#petition-section`)
- count line, under 100: Sign the petition ↓
- count line, one signature: One person has signed. Add your name ↓
- pub door (plain link after the count line, designer’s call): Run a pub? ↓ (link to `#pubs`)
- sticker: Get your pub-goer’s licence today / Do the hazard perception test →
- scroll hint aria-label: Scroll down

### The verdict `#verdict` (blue)
- kicker: the problem
- headline (two lines): Four staff. / One working.
- left chip: the single file
- left sub-head: One line. One spot on the bar.
- left sim aria-label: Animated pub bar, the single file: customers queue in one line to one spot, one barperson serves, three stand idle. The score counts pints served.
- right chip: the cluster
- right sub-head: Spread out. All four working.
- right sim aria-label: Animated pub bar, The Cluster: customers spread along the bar and all four staff serve. The score counts pints served.
- score label (both): pints served
- caption under the pair (`.small`): Same pub. Same Thursday. Same four staff. Keep an eye on the scores.
- bar 1 label: the single file, twenty orders · 25 min
- bar 2 label: the cluster, twenty orders · 6¼ min
- bars aria-label: Bar chart, twenty orders: the single file takes 25 minutes, The Cluster six and a quarter.
- stamp: worked example
- stamp line (`.small`): Twenty orders, 75 seconds each. One spot on the bar, or four staff along it. Arithmetic, not a stopwatch. `[M]`
- (no inline petition link on this screen)

### The poll `#poll` (cream): unchanged
- kicker: pick a side · headline: Stop the single file? · buttons: For / spread along the bar · Against / keep the orderly line · note: Vote to see what everyone else said. · small: One vote per browser. A cookie remembers your vote, and that’s all it knows. · lead lines, quips, total, next steps, "Changed your mind?", "Keep my vote": as now.

### The vote pill (desktop, 118px; about 20 characters a line)
1. hidden (hero, `#poll`, `#petition-section`, `#pubs`, print): nothing.
2. vote: kicker **vote** · question **Stop the single file?** (100px: **Stop the queue?**) · buttons **For** / **Against** · form legend (sr): Stop the single file? One vote per browser.
3. posting: kicker **one sec** · line **Counting…** · buttons dimmed.
4. voted For: kicker **you voted for** · rows **for 71%** / **against 29%** (≈) · button (amber) **Sign the petition** → `#petition-section` · optional link **full result ↓** → `#poll`
   voted Against: kicker **you voted against** · same rows · button (amber) **Take the test** → `/hazard`
   not counted (capped or missing): kicker **not counted** · same rows, no "you" · link **why? ↓** → `#poll` (the screen’s quip explains) · then the state on record.
   tally aria-live text (≈): For 71%, against 29%. You voted for.
5. signed: kicker **signed** · button (cream outline) **Tell a mate** → the share routine. Or the pill goes.
6. no JavaScript: as state 2, a plain form; the Worker’s results page answers as now.

### The vote bar (phones, 56px)
- vote: kicker **vote** · **Stop the single file?** · **For** / **Against**
- voted (≈): **For 71% · Against 29%** / **you voted for** · amber **Sign the petition** (Against: **Take the test**)
- hidden: hero, `#poll`, `#petition-section`, `#pubs`, signed, print.

### How to `#howto` and the test teaser `#test`: unchanged, every word.

### The petition `#petition-section` (ink)
- headline: Sign the Petition
- sub: Stand along the bar. Make eye contact. Let the barperson decide.
- count (`#sig-count`, ≈): 12,345 people have signed (one: One person has signed)
- labels: Your name · Email address · placeholders: Sam Pint · sam@example.com
- consent: as now.
- pub tick (new, optional field; needs a boolean column on `signatures` and a line in the privacy notice): I run a pub. Tell me when the mats are ready.
- button: Sign the petition · busy: Signing… · success: Thank you. Now go and stand at the bar. 🍺 · share: Tell a mate · copied: Link copied. Send it to someone who queues.
- errors: as now.

### The history trailer `#history` (pink)
- kicker: a short history
- headline (≈, the counter): 1,913 days since you were allowed back at the bar.
- line: Still queueing. The rules never said to. Blame 2020. Mostly.
- (designer’s alternative: headline Blame 2020. Mostly.; counter line 1,913 days since you were allowed back at the bar. Still queueing.; then the stickers. One of the two at Mega, never both.)
- stickers (dates only, each a link to its stop): before 2020 · 20 Mar 2020 · 4 Jul 2020 · 24 Sep 2020 · 19 Jul 2021 · Jul 2023 · 18 Sep 2025 · today. (Eight is the designer’s count; the page has eleven stops. If all eleven go on the trailer, add 30 Jul 2021 · 28 Jan 2022 · 23 Aug 2025 and the phone grid is 4+4+3.)
- sticker row aria-label: Stops on the history page
- no-JS counter text: over five years
- CTA: Read the whole history → (`/history`)

### For pubs `#pubs` (amber)
- kicker: run a pub?
- headline (two lines): Four staff. / Four pouring.
- stat tile, big number: 192 · tile line: orders an hour, four staff along the bar. One spot does 48. · stamp: worked example `[M]`
- money line (`.mid`, beside the tile): On a Friday at 90 orders an hour, one spot on the bar serves 48. The other 42 stand in a line holding about £224 of pints. Four staff along the bar pour the lot.
- honesty line (`.src`): Arithmetic, not an audit: 75 seconds an order, a pint an order, the average pint (£5.34, Morning Advertiser, Apr 2026). The Friday is made up. Your pub is yours.
- pledge line (Big): Print the poster. That’s the pledge.
- pledge sub: Behind the bar, facing the room, and this bar does The Cluster. No form, no fee, nobody from us turning up.
- art row alts: as now for the mats and the two faces.
- downloads line: Free. A4 or A5, any printer, black and white is fine. Where the back of the line can read it.
- download labels: as now (A4 poster · A4 poster and how-to · A5 poster · A5 poster and how-to · Two A5 posters on one A4, each with PDF and size).
- fine print: The how-to goes on the back. Hand it to anyone who asks "the what?"
- mats line: Mats coming soon. Sign the petition, tick "I run a pub", and you’ll hear first.
- never on this screen: lost, losing, revenue, takings, profit, a town, a pub’s name.

Register rows this screen needs before it ships (add to "On the page", location code **P**):
- P | £5.34, the average draught pint | Morning Advertiser price survey, Apr 2026 (published 21 May 2026) | S | Medium-high | promote from Reserves; add the URL to the checklist.
- P | 42 × £5.34 = £224.28, "about £224 of pints" | Derived: the worked example’s Friday (90 an hour) minus one spot’s 48 an hour `[M]`, at the average pint. Illustrative; labelled so on the page | derived | High.
- P | 48 × 4 = 192 orders an hour | Derived from `[M]` | derived | High.

### Footer
- sources line: Sources: the history’s are on the history page. The average pint, £5.34: Morning Advertiser price survey, Apr 2026. The pub sims, the queueing maths and the pub sum are worked examples, not measurements.
- beer fund line: as now.

### Meta (home)
- description: A campaign to end single-file queueing at the pub bar. Vote, sign the petition, print the poster. It’s a pub. Not a post office. (128)
- OG and Twitter description, share text: as now (A bar is not a post office. Spread out. Catch the eye. Trust the barperson.)

### Rail labels
The Verdict · Pick a Side · How to · The Test · Sign · History · For Pubs (chapter kickers: The · Pick a · How to · Then · Now · Since 2020 · For pubs).

---

### `/history`

- title: Why do people queue in pubs now? · Don’t Queue At The Bar (57)
- meta description: The rules never said queue at the bar. Pubs shut in March 2020, England’s bar came back in July 2021, and the queue stayed. Eleven stops, with sources. (151)
- OG title: Why do people queue in pubs now? · OG description: the meta description
- OG image alt: Blame 2020. Mostly. A short history of the pub bar queue from Don’t Queue At The Bar, over a row of floor stickers dated from before 2020 to today.
- header: the lockup, home · pill: ← Home
- kicker: a short history
- H1: Blame 2020. Mostly.
- counter (≈): 1,913 days · since you were allowed back at the bar. Still queueing.
- standfirst (the snippet; first two sentences answer the question): Nobody told anyone to queue at the bar. The 2020 rules said not to gather at it, pubs reopened to stickers and table service, and the line outlasted the rules. Eleven stops from 1996 to today, each with a source, and still quicker than the queue.
- timeline aria-label: A short history of the bar queue, in eleven stops

Stops (`<h2>` the heading, the sticker the date; bodies and source lines as on the current cards unless written here):
1. before 2020 · **The invisible queue.** as now `[H1]`
2. 20 Mar 2020 · **Pubs shut.** as now `[H2]`
3. 4 Jul 2020 · **Pubs reopen. Carefully.** as now `[H3]`
4. 24 Sep 2020 · **Table service. By law.** as now `[H4]`
5. 19 Jul 2021 · **The bar is back.** as now `[H5]`
6. 30 Jul 2021 · **The habit sticks.** Eleven days after the rules go, YouGov asks how you’d rather order. From your table, 51%. At the bar, 25%. Table service isn’t a queue, but it is the habit of not walking to the bar. It stuck. · source: YouGov, 30 Jul 2021, 5,695 adults → https://yougov.com/en-gb/daily-results/20210730-a367c-2 `[R: YouGov 2021]` (confirm "GB" on the row)
7. 28 Jan 2022 · **Last orders for table service.** Wales drops table service, the last of the four nations to. 679 days after the pubs shut. Scotland and Northern Ireland went the week before. · source: Welsh Government, 28 Jan 2022 → https://www.gov.wales/wales-completes-move-alert-level-0 `[HW]`; 679 days is in the register’s derived figures; the Scotland and NI dates are in its wider timeline and need rows with links.
8. Jul 2023 · **Someone notices.** as now `[H6]`
9. 23 Aug 2025 · **America notices.** The Wall Street Journal calls the single-file queue ‘a mortal threat’ to British pub culture. Two years after Time Out. Same question, bigger newspaper. · source: The Wall Street Journal, 23 Aug 2025 `[R: Coverage]` (the register’s link is a syndicated copy; swap for the WSJ’s own page when ticked, and check the quoted words)
10. 18 Sep 2025 · **Britain splits.** as now, plus one sentence: One in four adults had seen a single-file bar queue that year. · source as now `[H7]`; the added figure links https://yougov.com/en-gb/daily-results/20250918-59cc2-2 `[R: YouGov 2025, 1 in 4]`
11. today · **[1,913 days] since you were allowed back at the bar.** as now `[H8]`
Optional, only directly after stop 10: Dec 2025 · **Or does it?** Three months on, a trade survey asks 5,000 people. Along the bar, 69%. A line, 31%. Ask it differently, get a different pub. Both are here. · source: Zonal and CGA by NIQ, GO Technology, Dec 2025, 5,000 consumers `[R: Zonal/CGA]` (no URL in the register; it needs one, and "eleven" becomes "twelve" everywhere)

Questions section (kicker: **questions** · H2: **Asked and answered.** · each question an `<h3>`, the answer’s first sentence is the plain one):
- **Why do people queue at the bar now?** Nobody told them to. The 2020 guidance said not to gather at the bar at all; floor markings were for entrances and queues outside. Pubs reopened to stickers and table service, and the line outlasted the rules. 2020 normalised it; it didn’t invent it. · GOV.UK pub guidance, 2020 `[H3]`
- **When did table service end in pubs?** England, 19 July 2021. Scotland, 9 August 2021, and again on 24 January 2022 after Omicron. Wales, 7 August 2021, and again on 28 January 2022, the last of the four. Northern Ireland, 21 January 2022. · SI 2021/848 `[H5]`; Welsh Government `[HW]`; Scotland and NI from the register’s wider timeline, rows needed
- **Do most people prefer queueing at the bar?** Depends who asks. YouGov, September 2025: single file 40%, along the bar 39%, don’t know 21%. A trade survey for Zonal and CGA, December 2025: along the bar 69%, a line 31%. · `[H7]`, `[R: Zonal/CGA]`, shown together as the register requires
- **Is it rude to go to the bar when there’s a queue?** Not at a bar, which Kate Fox called the only place in Britain where anything is served without a queue. The invisible queue polices itself: in 2017, 91% told YouGov they’d point out that someone else was next if they were served out of turn. · `[H1]`, `[R: YouGov 2017]`
- **How much slower is the single file?** Twenty orders through one spot on the bar take 25 minutes at 75 seconds each. Across four staff, six. Arithmetic, not a stopwatch. · `[M]`
- **How do you order without queueing?** Walk to the bar. Pick a gap. Catch an eye. Trust the barperson. The four steps are on the home page, and there is a test. · links to `/#howto` and `/hazard`

Trailers:
- test (blue): kicker think you’re ready? · H2 The Hazard Perception Test · line Two tests. Which side of the bar are you on? · CTA Take the test → (`/hazard`)
- petition (ink): H2 Still queueing? · line Sign the petition. Then go and stand at the bar. · CTA Sign the petition (`/#petition-section`)
- footer sources line: Sources: Kate Fox, Passport to the Pub (1996) · GOV.UK, 20 Mar 2020 · GOV.UK pub guidance (2020) · SI 2020/1029 · SI 2021/848 · YouGov, 30 Jul 2021 · Welsh Government, 28 Jan 2022 · Time Out, Jul 2023 · The Wall Street Journal, 23 Aug 2025 · YouGov, 18 Sep 2025 (and Zonal and CGA, Dec 2025, if that stop is built). The days are counted from 19 Jul 2021, England.

## 4. Script and Worker strings

**None.** For / Against stays, so `leadFor`, the quips, the total line and `pollWords` in `src/worker.js` are unchanged, and so is the no-JS results page. New strings the script will write (not changes): the hero count line’s three forms, `#sig-count`'s two, the pill’s kickers (you voted for / you voted against / not counted / signed), the tally rows and their aria-live sentence, all in section 3. If the designer takes the `source` logging marketing suggests, it carries no words.

## 5. The word list

1. **The Single File**, **The Cluster** (capitals in body text and buttons; the CSS lowercases headlines) — never "the queue system", "the scrum", "the huddle", "chaos".
2. **barperson, bar staff, landlord; they, them, their** — never barman, barmaid, landlady, he, she, his, her.
3. **spread out, along the bar, a gap, catch an eye** — never "push in", "jostle", "elbow", "fight your way".
4. **the bar** is the counter; "the long wooden thing" is the how-to’s joke, used once.
5. **a sum, arithmetic, a worked example, illustrative, pints served** — never "study", "research shows", "data", "proves", "on average pubs".
6. **waiting, stood in a line, could be pouring** for money — never lost, losing, revenue, takings, profit, a town, a pub’s name.
7. **2020 normalised it; the rules never said queue at the bar** — never "COVID invented the queue", "the government told us to queue", "no queues before 2020".
8. **vote, sign, print, take the test**: one verb per block; **For / Against** for the poll everywhere — never "join the movement", "have your say", "Let’s", "!", "imagine", "we believe".
9. **pub, pint, round, Friday, the room** — never "venue", "hospitality setting", "beverage", "patron", "consumer", "guest" (unless quoting a source).
10. **England** when a law is quoted, **GB** when YouGov is, **UK** for the pub count and the average pint; "It’s a pub. Not a post office." is the one line allowed its shape, on the hero and the share card only.
