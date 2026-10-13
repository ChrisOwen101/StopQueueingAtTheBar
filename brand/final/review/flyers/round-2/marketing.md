# Flyers, round 2: marketing notes

Reviewed 13 Oct 2026 against the A4, A5, tenth-size and two-up renders in this folder, and the copy in `scripts/build-flyers.mjs`. Judged on message, order of reading and behaviour, not letterforms. Round 1 notes, the designer's notes and the merge decision are in `../round-1/`.

## The short version

The merge works. Face A is now a sign a pub would put up and Face B is a sheet a drinker would read with a pint in hand. Two things to fix, one to decide, one that's already right, then freeze:

1. **Face A's house line breaks in the wrong place.** "This bar does The Cluster. The / bar staff know who’s next." splits "The bar staff" across the lines on every render. Force the break after "Cluster." so each sentence has its own line. This is the one thing on the sheet I'd call a fault.
2. **Put "They always did." back,** as a third line of the house line. Reasons below. It is the only call in this round that is a judgement rather than a fix, so if the lead disagrees, at least fix the break.
3. **On Face B, give the caveat its own line.** "Arithmetic, not a stopwatch. Real pubs are messier." is the sentence that keeps the sum off the pub's record, and at the moment it is buried in the middle of a paragraph with "Real / pubs are messier." split over the last two lines.
4. **The address is now right.** Both faces say `dontqueueatthebar.co.uk`, one line, the same as the mats. The domain still has to be pointed at the site before anything is printed; until it is, the code and the address on every sheet go nowhere.

Everything else: freeze.

## Face A: permission, instruction, reassurance

**From the door (the tenth).** The stamp reads first, "spread out." second, and the house line is just legible at a tenth, which means it reads at three to four metres on a wall. The post office strap has gone and the sheet is better for it: three things, stepping down, nothing competing. The roundel, caption and QR are a grey band at the foot, which is right; nobody scans from the door.

**At the bar.** Stamp, "spread out.", "This bar does The Cluster.", "The bar staff know who’s next.", then the foot. That is the Round 1 order: the name (the prohibition, in the campaign's voice), the instruction, the permission, the reassurance, the ask.

Is permission in the right place, third rather than first? Yes. The fear of looking like you're pushing in only starts when you're close enough to leave the line, and that is where the house line is readable. From across the room the drinker needs to know what the sign is about, which the stamp and "spread out." do between them. Putting the house line above "spread out." would make the sign about the pub rather than about what to do, and the instruction would stop carrying at distance. Leave the order.

One note on "spread out." that isn't a problem but is worth saying once: those were the 2020 words too. Under "don’t queue at the bar." nobody will read them as distancing. If anything it reclaims the phrase.

### Does the house line read as the pub's own sign?

Yes, as long as the break is fixed. "This bar does The Cluster." is in the register of "this bar is cashless" and "last orders 10.45"; the capital letters on "The Cluster" make it a named thing the pub has adopted rather than a word the pub made up, and the stamp above it signs where the name came from. A landlord reads it as "we're joining that", not "we're telling people off". Good.

The current break undoes some of that. "This bar does The Cluster. The" is a line that ends on a hanging article, and "bar staff know who’s next." starts a line with the subject already gone. On a wall each line is read as a unit, so the sign currently has two lines that each read slightly wrong. Set it as one sentence per line.

### Is "The bar staff know who’s next." enough on its own?

Nearly. It does the reassurance: the drinker's question is "will I be forgotten?", and the line answers it. What it doesn't do is two smaller jobs that "They always did." was doing in Round 1:

- **It turns a promise into a fact.** On its own, "The bar staff know who’s next." is a claim the pub makes about tonight's staff. A landlord with a new starter on a Friday will feel that, and a drinker who gets missed once will point at it. "They always did." moves the sentence from a promise to a tradition: this is how bars have worked for as long as there have been bars, and the single file is the odd five years. That is the campaign's actual argument, and it is the argument that makes leaving the line feel normal rather than brave.
- **It is the only dry note left on the poster.** With the post office strap cut, the sheet is a notice: name, order, rule. The stamp is lowercase and a little cheeky, but nothing on the face is a line in the campaign's voice. "They always did." is three words, lands as a wink, and costs one short line in a sheet with over 40 mm of air above the foot at A4.

So: put it back, as the third line of the house line, one sentence per line:

```
This bar does The Cluster.
The bar staff know who’s next.
They always did.
```

If the lead wants the house line to stay two sentences, I won't fight it: the two-sentence version is a cleaner sign and the stamp plus "spread out." carry enough attitude from the door. But then fix the break, and don't try to get the wink back by restoring the post office strap. One or the other, never both.

### Is losing "It’s a pub. Not a post office." a loss?

A small one, and the right trade. The line is the campaign's best joke, but on a wall it was always going to be the fourth thing read, and nobody reads the fourth thing on a poster. The name on the stamp carries the prohibition, and the joke only explains the name; the hero, the OG image and the beer fund line keep it alive everywhere the campaign speaks in its own voice. The one thing the strap was doing that the poster now lacks is the dry sign-off, and "They always did." does that in fewer words and in the pub's voice, which is the voice this face is in. If "They always did." doesn't go back, the strap is the fallback, not an addition.

## Face B: in the hand

**Kicker.** "this bar does the cluster. here’s how." is the right join. It carries the pub's permission onto the sheet, hands over to the campaign for the steps ("here’s how" is the campaign talking), and it is the same words as Face A so a drinker who read the wall and then picks up the sheet gets one message, not two. It is the smallest type on the page, which the designer flagged, but the words are right. Freeze.

**Headline and steps.** "four easy steps." and the four steps are the site's lines, verbatim, with the site's step heads. Nothing to change. The teasing ("It’s the long wooden thing.", "This is not a cuddle.") is safely in the campaign's voice because the kicker handed over. Step 4 keeps "barperson" (singular, the site's line) while the poster says "bar staff" (plural, the pub's line); that is deliberate from Round 1 and still right. Freeze.

**The sum and its caveat.** "25 minutes. or six." under the rule with the tag on it is correct, and the tag is now big enough to be read as a label rather than a sticker. The paragraph is the problem. As set, the sum and the caveat run on as one paragraph of four sentences, and the line breaks fall as "...One spot on the bar, / or four staff along it. Arithmetic, not a stopwatch. Real / pubs are messier." The caveat is the sentence that stops a sheet left on the counter being read as this pub's waiting time, and it is the one sentence a skimmer won't see, because it starts mid-line and ends on a two-word orphan. Break it out:

```
Twenty orders, 75 seconds each. One spot on the bar, or four staff along it.
Arithmetic, not a stopwatch. Real pubs are messier.
```

Two lines for the sum, one for the caveat, or a short gap between them. Same words. With that, the tag, the sum and the caveat do the three jobs: label, number, disclaimer, in that order.

**The scan reason.** "Think you’re ready? / Take the test." is right, and the two-line setting makes the question and the dare read as a pair. It is the natural next line after four steps, and the test is the better lure than the petition for someone who has just been told how to hold a tenner. Freeze.

**Does a sheet printed alone ask for the petition?** No, and it shouldn't. Face B is never offered as a file on its own: it is page 2 of the "poster and how-to" PDFs, so it exists behind a poster that says "Sign the petition." and a drinker who turns it over finds the ask. Where a pub prints page 2 only and leaves it on the bar, the QR goes to the home page, and the home page asks for the petition twice. Each face earns one scan; adding "then sign the petition" to Face B would be a second ask on a sheet whose job is the steps. Leave it.

**The stamp bottom right** signs the sheet as the campaign's, which is what keeps the jokes and the sum off the pub. It's the right mark in the right corner.

## The footers

**Captions.** "Sign the petition." says what you get, not "scan me". "Think you’re ready? Take the test." likewise. Both right.

**Where the caption sits.** On Face B the caption is beside the code, as Round 1 asked. On Face A it is beside the roundel, with the code alone on the far right. Read left to right the foot is "roundel, Sign the petition., address, QR", which does read as one line at A4, and I understand why the roundel took the caption's side (one mark per sheet, the lead's decision). But the thing that gets you to the petition is the code, and on Face A it has no words next to it; a reader has to join it to a caption 150 mm away. I'd mirror Face B: QR and caption at the left, the roundel at the right where Face B keeps its stamp. One footer layout for both faces, the caption on the code, the mark signing the corner. This is a preference, not a blocker; if the designer has a layout reason for the current foot, keep it.

**The address.** `dontqueueatthebar.co.uk`, one line, lowercase, no scheme, under the caption: exactly what Round 1 asked for, and it now matches the mat back, so a pub that has both carries one address. It is the right length to read as a name rather than a URL, and at A5 and on the two-up it still holds under the caption. The code has dropped a version with the shorter string, which is a free gain for a photocopy. The only thing left is outside the copy: the domain has to be pointed at the site before anything is printed, since a sheet that sends a drinker to a parked page is worse than no sheet. Gate the download block on that, not on anything in this review.

**PDF titles.** The published files are titled "Don’t queue at the bar: A4 poster", "...: A4 poster and how-to" and so on, which is what a landlord sees in the tab and the print dialog. Right as they are.

## What a landlord would hesitate over

In order of likelihood:

1. **"The bar staff know who’s next."** as a bare promise, on a Friday, with a new starter. "They always did." softens it from a pledge to a truth about pubs. Without it, the landlord is signing a service guarantee in 11 mm type.
2. **The sum on the counter.** "25 minutes. or six." left on the bar can be read as this pub's times. The tag and the caveat handle it, provided the caveat is visible (the break above). The landlord's defence is that the sheet is signed by the campaign, bottom right, and nothing on it is in the pub's voice after the kicker.
3. **"The Cluster" as jargon.** A regular will ask "the what?" The answer is on the sheet behind the bar and on the back of the poster, and the asking is half the point. Not a problem.
4. **Printing cost.** Both faces are light on ink and the designer's numbers say a mono laser is fine. Say so on the download block so nobody wonders.
5. **A dead address.** Only if the sheet goes up before the domain is live. A landlord who scans their own poster and gets nothing takes it down and doesn't print the next one.

Nothing on either face teases the pub's customers in the pub's voice, nothing shames the pub, and nothing promises a time in the pub's name. That was the Round 1 test and it passes.

## Copy, line by line

Face A:

- Stamp: freeze.
- "spread out.": freeze.
- House line: one sentence per line, and add the third: "This bar does The Cluster." / "The bar staff know who’s next." / "They always did." (If kept to two sentences: fix the break only.)
- "Sign the petition.": freeze.
- Address "dontqueueatthebar.co.uk": freeze.

Face B:

- Kicker "this bar does the cluster. here’s how.": freeze.
- "four easy steps.": freeze.
- Steps 1 to 4, heads and bodies: freeze (the site's own lines; if the site changes, the sheet follows, never the other way).
- Tag "worked example": freeze.
- "25 minutes. or six.": freeze.
- Paragraph: same words, caveat on its own line.
- "Think you’re ready? Take the test.": freeze.
- Address: freeze.

Gender check: barperson, bar staff, they/them only, on both faces, the PDF titles and the download copy below. Typographic apostrophes throughout. Passed.

## The download block on the home page

It sits under the mats in the amber `#mats` section, so it inherits the "for pubs" kicker. Two short lines, five links, one line after. The links are PDFs; say so once, not on every label.

```
Posters. Print your own.
A4 or A5, any printer, black and white is fine.
Stick one behind the bar, facing the room.

A4 poster
A4 poster and how-to
A5 poster
A5 poster and how-to
Two A5 posters on one A4

The how-to goes on the back. Hand it to anyone who asks "the what?"
```

Notes:

- "Print your own." rather than "print at home", because the person printing is a pub, on the office printer, not at home.
- The labels name the size first because that is how a landlord picks: "what paper have I got?" then "poster or both?". "and how-to" is plainer than "double-sided" and matches the kicker's "here’s how".
- "Two A5 posters on one A4" is the clearest label for the two-up; "two-up" is a printer's word. If it needs to be shorter on a phone, "Two A5 on one A4".
- Mark the links as PDF once in the intro if the designer wants it: "Posters. Print your own (PDF)." I'd rather not; nobody has failed to open a PDF since 2010.
- If the mats are still "coming soon" when this goes live, put the posters above the mats, not under them: lead with the thing a pub can have today, and let the mats be the thing they're told about first when they sign. The task puts the block under the mats, which also works; but the order "coming soon" then "here you go" reads back to front.

### Should "Beer mats." and the rail label change?

Yes, both, because the section is no longer about one thing and the thing it's named for is the one you can't have yet.

- **Section heading:** "Posters and mats." The site's headings are two or three lowercase words that name the thing, and this names both, posters first because they exist. If the lead wants the pub addressed rather than the objects, "For your pub." works with the kicker, but the kicker already says "for pubs" and the heading would repeat it. Keep "A polite reminder, under a pint." as the mats' own line, moved to sit with the mat images rather than under the heading, since it describes a mat, not a poster.
- **Rail label:** "For pubs / Posters and Mats". It is the same length as "How We Got Here", so it fits the rail. "Posters & Mats" if it needs to be one word shorter; the ampersand is fine in a nav label, not in the heading.
- The `#mats` id and anchor can stay; nothing links to it by name except the rail, and renaming ids is how rails break.

## Freeze list

After the two fixes (house line break and third line, caveat on its own line) and the lead's call on the foot layout, freeze: both faces' words, the step copy's dependence on the site, the scan reasons, the captions, the address, the tag, the kicker. The download block goes live when the domain resolves, not before.
