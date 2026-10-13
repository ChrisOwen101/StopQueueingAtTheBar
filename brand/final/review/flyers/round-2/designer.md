# Flyers, round 2: designer's notes

Reviewed 13 Oct 2026 against my Round 1 asks, `decision.md` and `brand/BRIEF.md`. Sizes are from the CSS in `scripts/build-flyers.mjs` (every length is `N × --mm`, so the A4 figure is exact and A5 is 0.705 of it), checked against the 150 dpi renders where it mattered (1 mm is 5.91 px at both sizes, so take measured figures as plus or minus 0.2 mm). The renders here are set in Inter and the final will be Avenir Next, so every x-height below is given for both. From the fonts' own tables, x-height is 0.546 em in Inter, 0.519 em in Liberation Sans (the Arial stand-in) and 0.468 em in Avenir Next, and cap height 0.727, 0.688 and 0.708. That 0.468 is the number that matters in this round, and it should be confirmed on the first Mac render by measuring an "x". The review was done on the regenerated renders with the real address (`dontqueueatthebar.co.uk`, one line, a 33-module code).

## The short version

The concept is settled and most of the sheet should be frozen. Face A is right: the stamp leads at a tenth, the clear space is clean, the dead band is gone, one roundel, a plain code with bigger modules. Face B's skeleton is right. The one real problem is that the decision's font sizes were worked out from Inter's x-height, and in Avenir Next the same point size gives 14% less x-height. So the floor the decision set (3.5 mm x-height at A4, 2.5 mm at A5) is missed by five elements on Face B and by the address on Face A, in the stand-in font marginally and in the final font clearly. Round 3 is a re-size of the small type, a re-set of the kicker and tag to the system, one hard line break, and a black cut mark.

## 1. The A5 test (the thing to fix)

At A5, the x-heights in the render and in the final font:

| Element | A4 size | A5 size | A5 x-height, Inter (render) | A5 x-height, Avenir Next (final) | 2.5 mm floor |
| --- | --- | --- | --- | --- | --- |
| Face A address (`.addr`, 600) | 6.4 mm | 4.51 mm | 2.46 mm | 2.11 mm | fail |
| Face B step bodies (`.d`, 600) | 6.2 mm | 4.37 mm | 2.39 mm | 2.05 mm | fail |
| Face B worked-example paragraph (`.ms`, 600) | 6.2 mm | 4.37 mm | 2.39 mm | 2.05 mm | fail |
| Face B kicker (`.small`, 500) | 6.0 mm | 4.23 mm | 2.31 mm | 1.98 mm | fail |
| Face B tag text (900) | 6.2 mm | 4.37 mm | 2.39 mm | 2.05 mm | fail |
| Face B "Think you're ready? Take the test." (900) | 8.0 mm | 5.64 mm | 3.08 mm | 2.64 mm | pass |
| Face A "Sign the petition." (900) | 8.0 mm | 5.64 mm | 3.08 mm | 2.64 mm | pass |
| Face B step heads (900) | 10.5 mm | 7.40 mm | 4.04 mm | 3.46 mm | pass |
| Face B "25 minutes. or six." | 13 mm | 9.17 mm | 5.0 mm | 4.3 mm | pass |
| Face A house line (600) | 11.5 mm | 8.11 mm | 4.43 mm | 3.80 mm | pass |

The arithmetic: 2.5 mm at A5 needs 6.5 mm type at A4 in Inter and 7.6 mm in Avenir Next. The script's comment that the address is "never under 3.5 mm x-height on A4" is true in Inter (3.49 mm) and not in the font the flyer will be printed in (3.0 mm).

**What to do, in mm at A4:**

- **Address: 7.6 mm, 600, one line.** Now that it is 23 characters it costs nothing: about 96 mm wide in Avenir Next Demi, and there is 126 mm between the roundel's clear space and the QR on Face A and 115 mm between the QR and the stamp's clear space on Face B. This is the one line that has to be read exactly; it is the cheapest fix and the least negotiable.
- **Kicker: re-set as a Mid line, 7.6 mm, 600, sentence case, no tracking:** "This bar does The Cluster. Here’s how." It is the pub's permission, the reason a sheet printed on its own still works (the decision), and it is currently the smallest and lightest thing on the page in a style that isn't in `DESIGN.md` (500, lowercase, 0.08 em: Small is 0.04 em, Label is 900 uppercase). As Mid it matches Face A's house line in voice, case and weight, which is right because it is the same line. About 150 mm wide. If the lead wants to keep it lowercase and tracked, then it has to be 7.6 mm anyway, and I would still argue for Mid.
- **Tag: the Stamp Rule.** The site's `.tag` is uppercase (`text-transform: uppercase`, 900, 0.08 em, `0.45em 1.1em`, 3px border, −3°); the flyer's is lowercase, `0.4em 1em`, 0.8 mm border. Set it uppercase at 6.4 mm (cap height 4.5 mm at A4, 3.2 mm at A5, which is what an uppercase label is read by), padding `0.45em 1.1em`, border 1.0 mm. That makes the pill about 88 × 16 mm, so it can't sit beside "25 minutes. or six." any more: see 3 below.
- **Step bodies and the paragraph: 7.0 mm, 600, line height 1.25.** This is 3.3 mm x-height at A4 and 2.3 mm at A5 in Avenir Next (3.8 and 2.7 in Inter), 0.2 mm under the floor at A5 in the final font. I have run the budget (section 3) and 7.6 mm does not fit on Face B with the decision's copy, which I don't want cut; 7.0 mm does. 7.0 mm Avenir Next Demi is 20 pt at A4 and 14 pt at A5, which is a generous book size, and these lines are read in the hand, not from the wall. So: hold the 2.5 mm floor for anything read on its own (the address, the kicker, the tag, the scan lines) and record 2.3 mm as the floor for running text in `DESIGN.md`'s flyer paragraph. If the lead would rather hold 2.5 mm everywhere, the cost is the second sentence of step 3 or the caveat's second sentence, and I'd rather have the words.

## 2. Face A: freeze it, with one line break

- **Stamp:** 120 mm box, ring outer 117.6 mm, centred on 105.0 mm, ring top 28.4 mm down. Clear space is 15 mm; the headline's ascenders start 20.9 mm below the ring and the ring is 36 mm from each side margin. Clean. Freeze.
- **Hierarchy at a tenth:** stamp, then "spread out.", then the house line (just), the foot invisible. That is the order the decision asked for. "spread out." at 30 mm has a 16.4 mm x-height in Inter (14.0 mm in Avenir Next), which is bigger than the stamp's "queue" (14.1 mm Inter). The ring still wins because it is a 118 mm shape, but 30 mm is the ceiling for the headline; don't go up. Freeze at 30.
- **Composition:** the group sits 18 mm under the top margin and 26 mm above the QR; the footer is on the bottom margin. No dead band. Freeze.
- **House line: force the break.** Inter breaks it "This bar does The Cluster. The / bar staff know who’s next." (an orphaned "The" and the break mid-sentence); Liberation Sans breaks it after "Cluster.", which is the right place. `text-wrap: balance` decides by width, so Avenir Next could go either way. Put a `<br>` after "Cluster.", drop `balance`, and let `max-width` be the full 190 mm: the second line is about 170 mm in Avenir Next Demi at 11.5 mm. If it passes 180 mm on the Mac render, drop the line to 11 mm (x-height still 3.6 mm at A5).
- **Footer:** roundel 20 mm box (ring 18.4 mm tall), 5 mm to the text against a 2.5 mm clear space; "Sign the petition." 8 mm/900; QR 36 mm with a 4-module quiet zone, 33 modules a side, so the modules are 0.878 mm at A4 and 0.619 mm at A5 (up from 0.735 and 0.518 with the old address: the shorter domain was worth two QR versions). Level H as decided. Freeze the sizes; only the address changes (section 1).
- **One optical thing, optional:** the QR's modules end 2.6 mm above the roundel's ring and the address baseline because its quiet zone is inside the 36 mm. The code reads as lifted. If it bothers anyone, pull the QR down by its quiet zone (3.5 mm) so the modules sit on the address baseline; the quiet zone then lies on the blank margin, 6.5 mm from the paper edge, which every home printer can leave white. Same on Face B. Not a must.

## 3. Face B: the budget for the re-size

Current vertical layout (A4): kicker 10 to 15.7, headline to 43.5, steps 51.8 to 189, rule at 196.6 (measured 1.86 mm thick, drawn as 2), tag 191 to 208, "25 minutes. or six." cap top 203, paragraph to 241, foot 251 to 287. Gaps between steps are 10 to 11 mm.

Two risks in the maths block today, before any re-size:

- **The tag and the headline will touch in Avenir Next.** The tag (71 mm wide, right edge on the margin at 199.7 mm, centred on the rule, bottom at about 207 mm) sits below the headline's cap line (203 mm); they miss only because the headline ends at 120 mm and the tag starts at 128.6 mm. Avenir Next Heavy sets about 5% wider, so the headline reaches about 126 mm, and the uppercase tag starts further left. Give the tag the room: `.maths` padding-top 10 mm (from 6), so the headline starts under the tag. The tag stays on the rule, right edge on the margin, −3°.
- **"four easy steps." has no room at 24 mm.** It is 179 mm wide in Inter and 190 mm is the page. At 22 mm it is about 182 mm in Avenir Next; set 22.

The budget at 7.0 mm bodies, from the top margin (10 mm):

| Block | Height | Ends at |
| --- | --- | --- |
| Kicker, 7.6 mm Mid, one line | 9.5 | 19.5 |
| "four easy steps." 22 mm, margin-top 1 | 21.2 | 40.7 |
| Steps: margin 3, four heads at 10 mm (line box 10 + 1.5), bodies 2+2+2+2 lines at 8.75 (step 3 fits two lines on a 168 mm measure), three gaps of 7, margin 3 | 142 | 182.7 |
| Rule 2, padding 10, headline 13 mm (12), gap 3, paragraph 3 lines at 8.75 on a 190 mm measure, margin-bottom 5 | 58.3 | 241 |
| Foot (QR 36) | 36 | 287 |

That leaves nothing spare, so: step heads go to 10 mm (x-height 4.7 mm Avenir at A4, 3.3 at A5), the numerals to 12 mm (cap 8.5 mm), the body measure to the full column (`max-width` 168 mm, from the 22 mm numeral column to the margin), the paragraph measure to 190 mm, and the step grid keeps `space-evenly` so whatever is left goes into the gaps. If the paragraph still makes four lines in Avenir Next, take the headline to 21 mm and the gaps to 6; never the bodies.

What is right on Face B and should be frozen: bare numerals in a 22 mm column (keep the column, change the size as above); the four heads verbatim and lowercase; one 2 mm rule; no box, no rules between steps; "25 minutes. or six." at 13 mm (x-height 6.1 mm Avenir at A4, 4.3 at A5); the stamp bottom right at 30 mm (ring 29.4 mm, 20.6 mm at A5, above the 18 mm minimum, 40 mm clear of the address); the QR 36 mm at the left with "Think you’re ready? / Take the test." at 8 mm/900 beside it; the campaign voice throughout. The copy is as decided, apostrophes typographic, nobody gendered.

## 4. The fallback render

Line for line the same as the Inter set: every step body breaks at the same word, the paragraph at the same words, the two-line scan line the same. The only differences are the house line's break (Liberation Sans gets it right, Inter wrong: section 2) and "four easy steps." sitting at 166 mm instead of 179 (section 3). So the layout doesn't depend on metrics, which was the point of the check. Freeze the structure; the two font-dependent lines above are the two to pin.

## 5. The two-up sheet

- Each half is 148.5 × 210 mm with the A5 layout centred in it (stamp centre at 74.25 mm from the half's left edge, both halves alike). A cut copy is 0.5 mm wider than A5 with 7.3 mm margins. Fine.
- **The cut mark is a tint.** It is `0.25mm dashed #999`, which renders as a 74% grey, 1.3 mm dash period, from 10 mm to 200 mm. A mono laser halftones it and an inkjet on draft loses it, and the sheet is otherwise one ink, as the brief wants everything. Make it black, 0.2 mm, with a 2 mm dash and 3 mm gap, same length. Lighter by pattern, not by grey. It must stay 10 mm off the top and bottom edges, where printers can't print anyway.

## 6. Margins and ink

- **The A5 margin is 7.05 mm, not 10.** `.page` is inset `10 × --mm`, so it scales with the sheet. 7 mm is comfortably above the 3 to 5 mm office printers need, and the two-up puts the halves' QR codes 7 mm from the cut and 7 mm from the paper edge, which is fine. Keep it, but write it down: the script's comment says "10 mm safe margin" and `DESIGN.md` says "10 mm safe margins"; both should say 10 mm at A4 and 7 mm at A5.
- **Ink:** Face A 12.6%, Face B 11.3% at A4 (12.5 and 11.1 at A5). The largest solid is the 2 mm rule. Nothing to change.
- **Marks:** both come from `scripts/lib/brand.mjs` through the script, so nothing is redrawn. The roundel's bar overhangs the ring, three figures, no faces. The stamp's apostrophe is typographic. On-brand.

## Round 3 list, in order

1. Address 7.6 mm, 600, one line, both faces.
2. Kicker re-set as Mid: 7.6 mm, 600, sentence case, no tracking, "This bar does The Cluster. Here’s how."
3. Tag to the Stamp Rule: uppercase, 6.4 mm, 900, 0.08 em, `0.45em 1.1em`, 1.0 mm border, −3°, on the rule with its right edge on the margin; `.maths` padding-top 10 mm so the headline clears it.
4. Step bodies and the paragraph 7.0 mm, line height 1.25; body measure 168 mm, paragraph measure 190 mm; step heads 10 mm, numerals 12 mm, "four easy steps." 22 mm; record 2.3 mm as the running-text floor at A5 in `DESIGN.md`.
5. House line: hard break after "Cluster.", no `balance`, full measure.
6. Cut mark black, 0.2 mm, 2 mm dash, 3 mm gap.
7. Comments: A4 margin 10 mm, A5 7 mm, in the script and `DESIGN.md`.
8. Optional: drop both QR codes by their quiet zone so the modules sit on the address baseline.

Then the real test, unchanged from Round 1: one A4 and one A5 of each face on a mono laser, through a photocopier, scan the code from the copy, and measure an "x" on the Mac render to confirm Avenir Next's 0.468.

Frozen: the stamp at 120 mm centred 28 mm down; "spread out." at 30 mm; the composition of Face A; the footers' marks and codes (roundel 20 mm, QR 36 mm level H, stamp 30 mm); Face B's skeleton, rule and copy; the two-up's halves.
