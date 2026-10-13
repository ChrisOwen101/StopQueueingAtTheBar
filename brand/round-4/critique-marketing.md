# Round 4: marketing critique of the seven marks

13 Oct 2026. Read with `round-4.png`, `research-brand.md` (the designer ranks The Turn first), `research-landscape.md` section 5 (recommends "The Bar Is The Queue", says never lead with "don't", and that the pro-queue side owns the word "fair", so the identity must show order) and `research-marketing.md` (my shortlist: Queue Sideways, Queue Along The Bar, then the current name with a tagline fix).

The test I'm applying is the one the feedback set: a stranger in a pub, two seconds, has to get "stop the single file, not queueing". Scores are out of 5. "Alone" means the mark with no words. "With words" means the lockup line shown on the sheet.

## 1. The seven, scored

| # | Mark | Stranger gets it (alone / with words) | Catchy | Name and tagline | Beer mat | Total /20 (with words) |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | The Turn | 3 / 5 | 4 | 5 | 4 | 18 |
| 2 | The Corner | 4 / 5 | 4 | 5 | 3 | 17 |
| 3 | Shirt Numbers | 2 / 4 | 4 | 3 | 5 | 16 |
| 4 | They Know | 2 / 4 | 3 | 3 | 3 | 13 |
| 5 | Column vs Row | 5 / 5 | 2 | 2 | 3 | 12 |
| 6 | Not A Post Office | 1 / 3 | 3 | 2 | 3 | 11 |
| 7 | The Turn, with people | 3 / 4 | 3 | 4 | 4 | 15 |

**1. The Turn.** A line heading for the bar bends and runs along it. Alone, it's a road sign or the return key: "turn right, into what?" With "queue sideways." or "queue along the bar." beside it, the picture and the words say the same thing twice, which is what a lockup is for. It makes both names stronger, because the arrow is the verb. Catchy because it's three shapes and you could draw it on a napkin. On a mat it's clean and sign-like, which pubs like, and it holds in the QR tile on the back. Its weakness is the one the designer names: it doesn't show a person, so "it's still a queue" is in the words, not the picture.

**2. The Corner.** The queue itself turns: a column of heads becomes a row along the bar. This is the only mark that shows "there is a queue" and "it turns" in one shape, so alone it beats The Turn. It is the literal picture of "queue sideways". Two risks a marketer can't ignore. The dots and the triangle are media controls (a track list and a play button), and on a phone that's the first read. And it's the mark that dies smallest: at 32px it's a loading spinner, at 16px a smear, and in the QR tile on the mat back it's mush. On a mat the big version is fine, but a pub would put The Turn on a table before this; it's a diagram of a process, not a badge.

**3. Shirt Numbers.** The current roundel with 2, 1, 3 on the backs. The best joke on the sheet, and the best beer mat by a distance: it's a quiz under a pint ("why is 1 in the middle?") and the answer is the whole campaign. It's the one mark that shows order, which is the landscape researcher's point about "fair". But alone, below mat size, it is the current mark, so it fails the two-second test for the same reason the current mark does: three backs in a row is a crowd. It wants "they know who's next." as its line, which is a tagline, not a name, so it leaves the naming problem where it is. Right as a secondary piece (the mat, the barperson seal), wrong as the mark.

**4. They Know.** The barperson with the queue in a thought bubble. The best story and the clearest picture of the invisible queue, which is the thing the feedback asked for. But it needs a beat, it's soft, and it tells the stranger what the barperson is doing, not what the stranger should do. It doesn't say "single file" at all. A flyer illustration and the barperson licence seal, not a mark.

**5. Column vs Row.** The site's own diagram: stack with a slash, row with a tick. It passes the two-second test flat out, and that's the problem: it's a safety notice, not a brand. Nobody wears a safety notice. It drags every name towards the negative ("single file: no"), it contains a slash through a ring, which the landscape research rightly says means "banned", and in one colour it loses the red and green that make the site's version work. On a mat it would do the job as a notice. As the thing on the tab, the seal and the shirt, no.

**6. Not A Post Office.** A rope-barrier post struck through. Alone it's "no barrier posts", or "no lollipops". It only works through the tagline, and the tagline is already doing that job better in words. It makes the tagline the name, which I dropped in the naming research: it says what the pub isn't, not what to do, and it invites the Horizon scandal into every reply. A prohibition sign for a campaign that has just been told it reads as a prohibition.

**7. The Turn, with people.** The Turn's arrow lands beside one figure already along the bar. It keeps the human equity and says "join the row". But the arrow pointing at one person reads as wayfinding ("go and stand by them") and a bit like a chat-up instruction, and it's busier than 1 for the same message. If the team can't let go of the figures, this is the compromise. Pick 1 or 7, not both.

## 2. The four names, each with its mark and exact lines

The lockup is two lowercase lines beside the mark, 11 characters or fewer per line to hold at 40px. The stamp is the words in a ring for the mat front and flyer, 48px and up. The mat-back ring currently repeats the domain twice with a dot between; `ringText` in `scripts/lib/brand.mjs` would take a second string instead of repeating the domain. Hero tagline is the `.mid` line under the h1.

### Queue Sideways

- **Mark:** 1, The Turn. The arrow is the word "sideways" drawn. Use 2, The Corner, nowhere; one drawing only.
- **Lockup:** `queue` / `sideways.`
- **Stamp:** `queue` / `sideways.` Two lines, so the type can go a step bigger than today's three-line stamp. If the ring wants three, `still a queue.` / `queue` / `sideways.` with the first line at the small size, but test it at 48px first.
- **Hero tagline:** They know who’s next. They always did.
- **Mat-back ring:** `queuesideways.co.uk ● they know who’s next ●`

### Queue Along The Bar

- **Mark:** 1, The Turn (the designer's own pairing). 7 if the figures must stay.
- **Lockup:** `queue along` / `the bar.`
- **Stamp:** `queue` / `along` / `the bar.` Three lines, the same shape as today's stamp.
- **Hero tagline:** It’s a pub. Not a post office.
- **Mat-back ring:** `queuealongthebar.co.uk ● they know who’s next ●`

### Don't Queue At The Bar (kept, fixed by the tagline)

- **Mark:** 3, Shirt Numbers. The roundel stays, so the favicon, seals and QR tile don't move, and the numbers add the order the name lacks. The Turn beside "don't queue" would read as "don't queue, go that way", which is the barging reading again.
- **Lockup:** `don’t queue` / `at the bar.` The lockup is the name; it can't be the tagline.
- **Stamp:** `don’t queue` / `at the bar.` / `along it.` Three lines, the third at the small size. This is the fix on the one object that has no room for a tagline.
- **Hero tagline:** Along it. Not at it.
- **Mat-back ring:** `dontqueueatthebar.co.uk ● along it, not at it ●`

### The Bar Is The Queue

- **Mark:** 3, Shirt Numbers. The name says the bar is a queue and the mark shows the bar with the order on it. 2, The Corner, is the other fit, but it dies at the sizes the seal and the tab need.
- **Lockup:** `the bar is` / `the queue.`
- **Stamp:** `the bar` / `is the` / `queue.` Three lines, the middle one small.
- **Hero tagline:** Stand along it. They know who’s next.
- **Mat-back ring:** `thebaristhequeue.co.uk ● they know who’s next ●`

## 3. What to ship

**Ship: Queue Sideways with The Turn.** Tagline on the hero: They know who’s next. They always did. Domain: queuesideways.co.uk and .uk (both unchecked; see research-marketing.md section 3).

Why this pairing and not another:

- The name keeps "queue", so we are plainly for queueing. The feedback dies on the first word.
- "Sideways" is the entire instruction. It's the only candidate a barperson can say as a request across a bar: "queue sideways, please." Behaviour spreads by being sayable, not by being read.
- The Turn is "sideways" as a shape. Word and picture agree, so the lockup teaches the name and the mark teaches itself. The Turn also holds at 16px, keeps the ring and the overhanging bar, and changes nothing in the icon, mat and seal pipelines except the centre of the drawing.
- It's funny without trying. "Sideways" is also what a night does. On a mat it's a line people will repeat.
- The virtual queue goes in the tagline, where it belongs, and the tagline is the truest thing the campaign says.

**Second: Queue Along The Bar with The Turn.** Same mark, same pipeline, same domain job, plainer name. Nobody can misread it and nobody will quote it either. It's the choice if the team wants the public's own phrase (YouGov's wording, Hackney's "use the whole bar", the petition's "queue around the bar") over a line of our own. Because the mark is the same, the mark decision is settled whichever of these two wins.

**On "The Bar Is The Queue", directly.** The landscape researcher is right about three things: it states the rule rather than the ban, it is the clearest five-word answer to the "fair" argument (it says the queue exists and the bar keeps it), and it already comes out of people's mouths. It is better than Queue Sideways as a *rule*. It is worse as a *name*, for four reasons.

1. It's a statement, not an instruction. A stranger hears it and needs a beat to work out what their body should do. "Queue sideways" tells them. The behaviour we need is a movement, and the name should be a verb.
2. It can be read as a complaint ("the bar is the queue, it's rammed"). Queue Sideways has no sour reading.
3. It's a sentence in a lockup. Four small words in a ring look like a caption. "queue / sideways." is a name.
4. It wants Shirt Numbers or The Corner as its mark, because it needs order drawn, and both fail at the small sizes. Queue Sideways gets The Turn, which works everywhere.

So: take the researcher's line and give it the job it's good at. "The bar is the queue." becomes the heading or the first line of the Cluster chapter, and the answer to the "fair" argument on the page. And if the team won't rename at all, the researcher's fallback is the right one: pair the old name with "the bar is the queue" wherever the lockup appears. That's a better rescue line than my "Along it. Not at it.", because it states the rule instead of correcting a preposition.

On "fair": both names have "queue" in them, and that's the word that wins the argument. The copy should use it on purpose: "Still a queue. Fair's fair. The barperson keeps it."

## 4. Copy that changes with the rename (Queue Sideways)

Typographic apostrophes in anything visible. "It’s a pub. Not a post office." moves to the problem chapter, where it describes the single file, which is what it was always about.

| Where | Now | New |
| --- | --- | --- |
| `index.html` `<title>` | Don't Queue At The Bar | Queue Sideways |
| `application-name` | Don't Queue At The Bar | Queue Sideways |
| `apple-mobile-web-app-title` | Don't Queue | Sideways |
| `meta description` | A bar is not a post office. A public campaign to end single-file queueing at the pub, and bring back The Cluster. | Still a queue. Just not a line. A campaign to end the single file at the pub bar. Spread along the bar, catch an eye, and trust the barperson. They know who’s next. |
| `og:site_name`, `og:title`, `twitter:title` | Don't Queue At The Bar | Queue Sideways |
| `og:description`, `twitter:description` | A bar is not a post office. Spread out. Catch the eye. Trust the barperson. | Still a queue. Just not a line. Spread along the bar. Catch an eye. Trust the barperson: they know who’s next. |
| `og:image:alt`, `twitter:image:alt` | (describes the retired badge) | Queue Sideways: a queue line turning to run along a bar, inside a ring, beside the words ‘they know who’s next’. (Only after the share images are regenerated on a Mac; the alt describes the image.) |
| Hero `a.brand` aria-label | Don’t Queue At The Bar, home | Queue Sideways, home |
| Hero `h1.mega` | Don’t Queue \<br\>At The Bar | Queue \<br\>Sideways |
| Hero `p.mid` | It’s a pub. Not a post office. | They know who’s next. They always did. |
| Problem chapter `p.mid` | Everyone queues in one line. One barperson works. The other three watch. It’s slow, and it gets in the way. | Everyone queues in one line. One barperson works. The other three watch. It’s a pub. Not a post office. |
| Solution chapter `h2.rule-title` | The Cluster | The Cluster (keep; the rail and the how-to use it) |
| Solution chapter `p.mid` | Spread out along the bar. Everyone gets a patch of bar, and everyone gets served quicker. | Spread out along the bar. The bar is the queue. The barperson keeps it, and everyone gets served quicker. |
| Timeline rail, chapter 2 label | The Cluster | Queue Sideways (optional; "The Cluster" is fine on the site) |
| Mats `img.m1` alt | The front of the beer mat: the words ‘don’t queue at the bar’ inside a thick ring, black on white. | The front of the beer mat: the words ‘queue sideways’ inside a thick ring, black on white. |
| Mats `img.m2` alt | …with the Don’t Queue At The Bar roundel in the middle, and the web address printed round the edge… | The back of the beer mat: a large QR code to the website with the Queue Sideways mark in the middle, and the web address and ‘they know who’s next’ printed round the edge, white on black. |
| Petition `h2.big` | Sign the Petition | Sign the Petition (keep; it's the action, not the brand) |
| Petition `p.mid.dim` | Stand along the bar. Make eye contact. Let the barperson decide. | Queue sideways. Catch an eye. Let the barperson decide. |
| Footer beer fund | Chip in to the beer fund. No queue. | Chip in to the beer fund. No single file. |
| `script.js` share title and text | "Don't Queue At The Bar" / A bar is not a post office. Spread out. Catch the eye. Trust the barperson. | "Queue Sideways" / Still a queue. Just not a line. Spread along the bar, catch an eye, trust the barperson. |
| `site.webmanifest` name, short_name, description | Don't Queue At The Bar / Don't Queue / A bar is not a post office… | Queue Sideways / Sideways / Still a queue. Just not a line. Spread along the bar. Catch an eye. Trust the barperson: they know who’s next. |
| `scripts/lib/brand.mjs` mark aria-label | Don’t Queue At The Bar: three people spread along a bar inside a ring | Queue Sideways: a queue line turning to run along a bar, inside a ring |
| `scripts/build-mats.mjs` `SITE_URL` | https://dontqueueatthebar.co.uk/ | https://queuesideways.co.uk/ (only once the domain is live) |
| `hazard.html`, `hazard-customer.html`, `hazard-barperson.html`, `hazard-preview.html` `<title>` suffix | · Don't Queue At The Bar | · Queue Sideways |
| `hazard.html` back link | ← Don’t Queue At The Bar | ← Queue Sideways |
| `src/worker.js` thank-you page `<title>` | … - Don't Queue At The Bar | … - Queue Sideways |
| `hazard-badge.js` share titles | Don't Queue At The Bar | Queue Sideways |
| `hazard-badge.js` landlord share line and alt | Nobody queues on my watch. / You serve them in order. Nobody queues. | Everyone queues sideways on my watch. / You serve them in order. The bar is the queue. ("Nobody queues" is the misfire in miniature, so fix it in the rename.) |
| `hazard-badge.js` copied-link message | Link copied. Send it to someone who queues. | Link copied. Send it to someone who queues in a line. |
| Seal ring text in `brand/final/build.mjs` | DON’T QUEUE AT THE BAR • FULL LICENCE | QUEUE SIDEWAYS • FULL LICENCE (and LANDLORD MATERIAL for the barperson seal) |
| Badge-round ring text (the rejected mat front) | DON’T QUEUE AT THE BAR • SPREAD ALONG THE BAR | QUEUE SIDEWAYS • THEY KNOW WHO’S NEXT |

Unchanged on purpose: the four how-to steps (step 4 already says "They know who’s next. They always know."), the test chapter, the consent text and the hazard clips. The certificate masters in `public/badges/` carry the old name in their outlined ring and live outside this repo; they need redoing with the seal text above. Audio needs no re-recording unless a narration line names the campaign; `npm run audio:dry` will say.

Before the copy goes in: run the gender-neutral grep from AGENTS.md over `public/`, `scripts/` and `src/`, and check `og:image` and `og:image:alt` change together.
