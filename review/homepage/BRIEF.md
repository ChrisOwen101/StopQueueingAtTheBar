# Homepage iterations: the brief

Written 14 Oct 2026 from feedback by the campaign's marketing expert and copywriter after reading the live home page. This file is the shared brief for three specialists (design, copy, marketing) working in three rounds. Each round's notes sit in `round-1/`, `round-2/` and `round-3/`; the merge is in `DECISION.md`; the built alternatives are in `public/prototypes/`.

## The feedback, as given (lightly tidied, nothing added)

1. **Hero.** You land on it: great, awesome. But you obviously have to scroll first.
2. **The Problem (The Single File).** Looks great, cool, but you kind of just want to scroll immediately.
3. **The Cluster.** Again great, like it. But then the third screen shows the two side by side, and that would be more impactful, where you want someone to spend time and understand the problem.
4. **Copy on the comparison.** "Same pub. Same Thursday." as a headline, if it's the first thing you see, doesn't really work. It's "the problem is this" (the top one), then a headline above the second illustration that shows what Nirvana is, what you want people to be doing.
5. **The maths.** Do you need it? You could probably incorporate that maths bit into a calculation within that same screen. It's about removing as much scrolling as possible to make it as impactful as possible. Keep "25 minutes versus 6 if you do it properly", but do it faster and quicker, in a less cumbersome way.
6. **How to do it.** Quite nice, quite good. Wouldn't change too much.
7. **Hazard perception test.** Again, quite nice.
8. **History.** Really like it. Build it as its own page: it's baked into the home page at the moment, but as an actual page it will rank better and perform better anyway, and it's a whole thing to link to, and to build other content around and link other people to. Hard to do that baked into a homepage. On its own page it could scroll vertically rather than horizontally. Put some more stuff in.
9. **Voting.** You should be able to vote throughout. A little button on the side you can see and vote from. How many people are going to scroll that far? The whole point of the website is finding how much people hate this and how much of a problem it is.
10. **Petition.** Surface it higher, or make it an always-on sticky header banner. It could link with the voting thing, but don't make people do two things at once.
11. **Mats and posters.** "Get these for your bar", "order these for your pub". Who are the people you're trying to target? Yes the general public, but two, it's more bar people.
12. **Money.** Think about the time thing and how many more people you can serve in terms of the money a publican could make. You're trying to convince publicans: the fact that they can't serve as many people as fast means they're losing money. You know how much a pint is, how much could that be? That could be another angle of PR and content: "we know that in Neath the pints are this much, you're losing out on this much."

## What we take from it

- **Scroll economy.** The argument (problem, solution, proof) takes four full screens before anything is asked of the visitor. Fold it so one screen holds the problem and one holds the solution, with the comparison and the 25-versus-6 arithmetic inside those, not after them.
- **Headlines state the idea, not the staging.** "Same pub. Same Thursday." describes the experiment. The headline over the problem should say the problem; the headline over the solution should say what we want people to do.
- **Two asks, always reachable.** Vote and sign. Both live below the fold on a fifteen-viewport page. The vote should be one tap from anywhere; the petition should be visible from early on. But one ask per moment: never both at once.
- **Two audiences.** Drinkers (vote, sign, do The Cluster) and publicans (print the poster, get the mats, pledge). The money angle is for publicans and is a content and PR route, not just a screen.
- **History becomes a page.** A standalone `/history` (vertical, more stops, proper title and meta, internal links back to the test and the petition) that other content and other people can link to. The home page keeps a short trailer for it.
- **Keep what works.** How-to and the test teaser stay as they are, give or take a headline.

## Hard constraints (read these before proposing anything)

- **The design system is settled.** `DESIGN.md`: one idea per full-screen flat colour block, enormous lowercase type, cream and ink text only, red is The Single File and green is The Cluster and nothing else, one amber per screen, no photos, no gradients or soft shadows, no web fonts, the page works without JavaScript and respects reduced motion. The brand marks and their rules are in `brand/BRIEF.md`. A proposal may bend a rule with a reason; it may not ignore one.
- **Facts.** `RESEARCH.md` is the register. Nothing factual goes on a page without a row there. The 25-versus-6 arithmetic is a worked example and must stay labelled as one. The money angle may only use figures already in the register (the average draught pint, £5.34, Morning Advertiser price survey, Apr 2026, labelled illustrative) and arithmetic derived from the worked example; it must never read as a measurement of a real pub's takings. Hackney Church Brew Co stays unused. No invented testimonials, pledges or pub names.
- **Copy.** Direct, dry British humour. Short lines. Gender-neutral always: barperson, bar staff, landlord; they/them. Never "barman", "barmaid", "he", "she". Typographic apostrophes (’). Avoid copy that sounds machine-written: no "It's not X, it's Y" constructions, no "Let's", no exclamation marks, no three-adjective lists (see `TODO.md`). The fixed terms are **The Single File** (wrong) and **The Cluster** (right).
- **Engineering.** Static HTML, CSS and JS in `public/`, no build step, served by a Cloudflare Worker. The CSP in `public/_headers` blocks inline scripts and `on*` attributes; inline `style` attributes are fine. `public/script.js` finds things by id and class (`.scene[data-mode]`, `#howto`, `.strip`, `#poll`, `#petition`, `.timeline`), so a prototype that keeps those hooks gets the sims, the how-to stage, the poll and the form for free. The timeline rail's chapter list and the section ids must match.
- **Tone of the asks.** The poll is pseudonymous (a cookie), the petition takes a name and an email with consent. Neither should be made pushier than it is: no modals, no interstitials, nothing that moves the page on its own.

## What each round produces

- **Round 1 (proposals).** Design: three alternative page structures with low-fi wireframes. Copy: a copy deck with options for every changed screen and the new pieces. Marketing: audiences, funnel, priorities, the money model and the history page's case. Each in its own file under `round-1/`.
- **Round 2 (feedback).** Each specialist reads the other two Round 1 files and writes a critique and a revised position under `round-2/`. The orchestrator writes `DECISION.md`: which structure, which copy, which pieces get built.
- **Round 3 (build and review).** The design specialist builds the chosen alternatives as working pages in `public/prototypes/` (unlinked, `noindex`), the copywriter edits the words in place, the marketing specialist reviews the result against the funnel. Renders at 1280 and 390 wide go in `round-3/`.

## Where things are

- The live page: `public/index.html` (sections in order: hero, problem, solution, the blue comparison, maths, how-to, test teaser, history strip, poll, petition, mats and posters, footer), `public/styles.css`, `public/script.js`.
- The handover with every detail of how the page works: `AGENTS.md`.
- Earlier ideas (a pub calculator, a pub pledge form, a history page per ruling): `IDEAS.md`.
- Precedent for this process: the flyers went through three rounds in `brand/final/review/flyers/` (`round-1/designer.md`, `marketing.md`, `decision.md`).
