# Posters (notice family), round 2: designer's notes

Reviewed 14 Oct 2026 against my Round 1 asks, `../round-1/decision.md` and `brand/BRIEF.md`. Sizes are from the CSS in `scripts/build-posters.mjs` (every length is `N × --mm`; the A4 figure is exact and A5 is 0.705 of it), checked against the 150 dpi renders where it mattered. The renders are Inter and the final is Avenir Next (x-height 0.546 em against 0.468, cap height 0.727 against 0.708), so every x-height below is given for both. The Arial renders (`*-arial.png`, Liberation Sans standing in) are the metrics check: a wider font than either.

## The short version

The pair is right and most of both sheets can be frozen. The notice goes on ink. The instruction poster goes on green, with the subhead at 600. The monos are good enough to be the office versions, which was the condition for the family. One real fault: the polite ask on the notice broke into three lines with "the bar." alone on the second, because its first sentence is wider than the measure in every font we have. Round 3 is that one line, the subhead weight, and the final set.

## 1. The notice: ink, not red

Rendered on both fields at A4 and A5, plus the mono.

- **Ink wins on the tenth.** On ink the sheet has three reads at distance in order: the amber headline, the red ring, the white line. On red it has one: everything is white on red, and the headline, the sign and the house line arrive together. The red ring on ink is also the prohibition symbol as everyone knows it (the reference's exactly); a white ring on red is a prohibition sign by shape only.
- **Ink wins on the system.** Amber on ink is the maths screen's pairing and it is the One Amber on the sheet; the red is on the Single File's sign and nowhere else, which is the Red-Is-Wrong rule used precisely. A red field puts the Single File's colour on the house line and the roundel too.
- **Ink loses on ink**, 83% of the page against 73%, but both are far beyond what an office printer should be asked for, so the mono carries that job either way and the difference doesn't decide anything.
- **Headline at 25 mm:** 17.7 mm cap height in Inter (17.2 in Avenir Next; the "QUEUEING" reads from about ten metres). It is 167 mm wide in Inter and fills the whole 170 mm measure in Liberation Sans, so **25 mm is the ceiling**; Avenir Next Heavy is narrower than both and will sit at about 160 mm. If the Mac render shows it touching the content edges, drop to 24.
- **The sign at 104 mm:** ring outer 96 mm, stroke 7.8 mm, slash 7.8 mm; the lowest figure now 0.88 (15.2 mm wide, 15.6 mm tall), the highest 0.5 (8.8 mm). The column clears the ring's inside by 1.4 mm top and bottom, which is enough because the ring curves away from the column's corners. Reads at the tenth as "no line of people" on all three fields. Freeze.
- **The polite ask is the fault.** "We kindly ask that you spread out along the bar." is 186 mm in Inter Semibold at 7.6 mm, about 179 mm in Avenir Next Demi, in a 170 mm measure; with the hard break after "bar." it wraps to "…spread out along / the bar. / The bar staff…", an orphan in the middle of the ask. Round 3: **"We kindly ask that you spread out." / "The bar staff know who’s next."** Two sentences, two lines, 134 and 118 mm. "Along the bar" is said twice already on the sheet (the headline and the sign).
- The house line at 12 mm (6.6 mm x-height in Inter, 5.6 in Avenir Next; 4.0 at A5), the rule, the foot: as Round 1, clean. The stock code at 6 mm Label: 4.4 mm cap height at A4, 3.1 at A5. Freeze.
- **A5:** the polite line is 5.36 mm type, 2.51 mm x-height in Avenir Next, the floor; the address the same. The code is 25.4 mm with 0.62 mm modules, the same as the A5 flyer, which the flyer round judged "on the edge of what a phone reads from a photocopy"; on a colour print it is fine, on a mono-laser-then-photocopy it needs the real test. The mount is 5.6 mm, inside what I'd expect of any printer's unprintable edge (3 to 5 mm).
- **Mono:** 16% inked (the flyer's 12% plus the ring and the border). The 1 mm border on the mount's edge makes it a sign rather than a flyer, the black ring and slash hold, the figures hold at 8.8 mm. This is the sheet most pubs will print, and it is fine.

## 2. The instruction poster: green, 600

Rendered on green (500 and 600 subhead), on blue, and the "FIND / THE / GAP." alternate, plus the mono and A5 of the green.

- **Green.** The brand rule decides it: the instruction is the Cluster, the Cluster is green. Blue is handsome and arbitrary. White on Snug Green is also the calmer sheet of the two at the tenth, and the pair (ink notice, green poster) is a pair; a blue poster beside an ink notice is two posters.
- **Subhead at 600.** The 500 render reads at the tenth, just; the 600 reads. 600 is the system's Mid, the supporting line under a headline, and it is one fewer exception. The 500 was the reference's charm and I tried it; the sheet doesn't need it.
- **The foot in two columns works:** "Please don’t queue. Cheers." (7.6 mm, 600, 101 mm wide), the 40 mm rule, "Sign the petition." (8 mm, 900), the address (7.6 mm, 600): 34 mm tall against the code's 36, bottom-aligned, with 27 mm between the address and the code. No wrapping in Inter or Liberation Sans. Freeze.
- **The roundel at 96 mm:** right edge on the content edge, so 12 mm clear to the field's edge (its eighth is 12 mm: exact); 14 mm to the foot; 10 mm under the subhead's descenders at the nearest point, which is the clear space plus a little. The headline block, the subhead and the roundel sit in the top 230 mm and the foot on the bottom; the `margin: auto` slack above the roundel is 12 mm at A4 in Inter and will be a few millimetres more in Avenir Next (narrower caps don't change the height; the subhead's line-height does not either). Freeze.
- **"SPREAD / OUT." at 40 mm:** 29 mm cap height in Inter (28.3 in Avenir Next), 164 mm wide in Inter, 161 in Liberation Sans. Freeze.
- **The alternate, "FIND / THE / GAP."** at 32 mm with the roundel at 80 mm: fine as data, and its foot now fits ("Take the test." on one line). The roundel at 80 mm gives 10 mm clear (its eighth), exact. I'd keep it as the alternate headline for the taproom and not as a third poster; the team can switch the data.
- **Mono:** 17% inked; the roundel in black at 96 mm is the mark at its biggest anywhere and it is handsome. Freeze.
- **A5:** the subhead 7.76 mm (3.6 mm x-height in Avenir Next), the polite line and address at the 2.5 mm floor, the code 25.4 mm. The roundel at 67.7 mm, clear 8.5 mm.

## 3. The Arial check

`POSTER_FONT=Arial` puts Liberation Sans in front of the stack (bolder and wider than Avenir Next Heavy and Inter Black both). Every line on both leads breaks where it does in Inter: the headlines, the subhead's two lines, the polite ask (the same bad break, which the Round 3 copy removes), the foot. The only change is the notice headline filling its measure, noted above.

## 4. Ink figures for the download page

| Sheet | Inked | Mean darkness |
| --- | --- | --- |
| The notice, ink, colour | 83% | 71% |
| The notice, red, colour | 73% | 50% |
| The notice, mono | 16% | 16% |
| The instruction poster, green, colour | 72% | 51% |
| The instruction poster, blue, colour | 72% | 50% |
| The instruction poster, mono | 17% | 17% |
| (the flyers, for comparison) | 12% | 12% |

## Round 3: concrete changes (A4 mm; A5 is 0.705 of each)

1. The notice's polite ask: "We kindly ask that you spread out." / "The bar staff know who’s next." (hard break, two lines).
2. The instruction poster's subhead at 600.
3. Drop the red notice, the blue poster and the 500 render from the data; keep the alternate headline as data.
4. The final set, to `brand/final/review/posters/final/`: the notice (ink; colour and mono; A4 and A5), the instruction poster (green; colour and mono; A4 and A5), the alternate (green, A4, colour and mono), each with its 150 dpi PNG and tenth. The print check is the A4 at 150 dpi, the A5, and the tenth, as the flyers' final.
5. The brief: a "Posters (notice family)" section recording the exploration, the decisions, the rules the family adds, what's left for a Mac and what's left for the team.
