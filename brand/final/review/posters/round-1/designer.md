# Posters (notice family), round 1: designer's notes

Reviewed 14 Oct 2026 against `brand/BRIEF.md`, the "Brand marks", "Colors", "Typography" and "Do's and Don'ts" sections of `DESIGN.md`, the flyer rounds in `../flyers/`, and the two reference notices the user photographed (a bright-blue "TURN THE TAP OFF" water poster from a restaurant toilet: field, stacked white headline top left, one quiet subhead, one huge flat pictogram lower right, a polite footer line over a short rule, a small round mark bottom right; and a pub group's black "NO SMOKING OR VAPING" compliance notice: amber headline, red prohibition roundel over a white pictogram, body line, polite line, the group's mark and a footer strip with the URL and a stock code). Sizes below are from the CSS in `scripts/build-posters.mjs` (every length is `N × --mm`, so the A4 figure is exact and A5 is 0.705 of it), checked against the 150 dpi renders where it mattered (1 mm is 5.91 px). The renders are set in Inter, so I have judged layout, scale, spacing, the marks and the ink, not the letterforms; x-heights are given for Inter (0.546 em, the render) and Avenir Next (0.468 em, the final), cap heights 0.727 and 0.708.

## What all six share

- **The idiom works for us.** A flat field, one huge headline, one flat pictogram, one dry line, one polite ask, the mark small: that is the site's Whole-Screen Rule on paper, and every colour here is one of the site's blocks. These sit beside the home page in a way the black-on-white flyer never quite did.
- **The mount.** The field is inset 8 mm from the paper on every side (5.6 mm at A5), a deliberate white frame rather than a bleed, because no home printer prints to the edge and a bled field comes back with a ragged, uneven border. Both reference posters have exactly that accidental frame; ours is drawn, so it is even. Content keeps 12 mm inside the field, 20 mm from the paper, well inside the flyers' 10 mm safe margin. If a driver shrinks the page to its printable area the frame grows a millimetre or two on each side and nothing is lost. I'd keep this for the whole family; it also means the colour versions and the mono versions share one geometry (the mono draws a 1 mm black line where the field's edge was).
- **Ink.** Measured from the renders as the share of the page that gets any ink, then the mean darkness (what a mono laser sees): A 75% / 51%, B 72% / 50%, B2 73% / 51%, C 60% / 43%, D 83% / 71%, E 76% / 54%. The flyers are about 12%. A solid field is six times the ink of the flyer: on a home inkjet it is a cartridge every few sheets and a cockled page; on a mono laser it is a grey sheet with banding across the solid, and D comes out as a black page. So every concept the family ships needs its mono (black on white) version for office printers, and the colour version is for a laminated one-off, a print shop, or a pub with a decent colour printer. The download page should say so in one line.
- **Everything on a field is paper white, not cream.** Cream on a field would be printed as a pale tint in the knockouts, which is pointless on a home printer; white is the paper. On screen the marks are still ink or cream; in print "white on black" is the brief's own wording. The fields are the palette hexes as given.
- **Marks.** The roundel is `markBody` from `scripts/lib/brand.mjs` on every sheet, in paper white; clear space (an eighth) is kept on all six (18 mm roundel in the notice foot: 2.25 mm clear, clean; 96 mm in the tap layout: 12 mm, exactly the field padding, clean; 80 mm on E: 10 mm, clean; 78 mm in C's green panel: 9.75 mm, clean). The stamp is on none of them: with the roundel as the pictogram there is no room for a second ring, and the name is in the headline.
- **The new pictogram.** The prohibition sign is drawn fresh in the script: a 400 box, ring r 170 stroke 30 (the roundel's own), a 45° slash upper left to lower right as ISO 3864 draws it, over four `FIG` glyphs one above another with gaps, the nearest at the bottom and biggest (scales 0.5 to 0.86). The first draft had the figures overlapping and receding, as a queue really looks from behind, and it read as a stack of circles, a snowman; the knockouts between them left crescents. The column with gaps reads at once, and it gives the family a grammar: **the Cluster is a horizontal row (the roundel); the Single File is a vertical column.** It cannot be mistaken for the roundel: it has a slash, no bar, four figures, and they never touch. Where the slash and the figures are the same colour (A, C, the monos) the slash carries a field-coloured knockout 11 units each side so it stays a bar crossing people, not a merged shape. At 104 mm the nearest figure is 15 mm wide and the farthest 9 mm; at 78 mm (C) 11 and 6.6 mm. Fine at A4; at A5 the farthest figure on C is 4.7 mm, which is the limit.
- **QR codes:** plain, level H, 36 mm including a four-module quiet zone, on a paper-white panel so they read the same on any field. The home code is 33 modules (0.88 mm modules, 0.62 mm at A5); the test code (E) is 37 modules (0.8 mm, 0.56 mm at A5), on the edge of what a phone reads from a photocopy, as the flyer round found. The address under or beside each is the bare domain at 7.6 mm, 600 weight: 3.6 mm x-height at A4 in Avenir Next, 2.5 mm at A5, the floor, as the flyers settled.
- **Floors.** The polite line (7.6 mm, 600) and the address are at the floor at A5. The house line at 12 mm (notice) and 8 mm (C) clear it. The stock code on D is a 6 mm Label (900, uppercase, 0.08 em): 4.2 mm cap height at A4, 3 mm at A5; readable, and it isn't meant to be read.
- **Copy:** typographic apostrophes throughout (don’t, who’s, It’s). Gender-neutral throughout (bar staff, who’s next, they). No exclamation marks, no "It's not X, it's Y" (the post office line is "It’s a pub. Not a post office.", two sentences, which the site uses as is).

## Concept A, "No queueing: the prohibition notice" (red field)

Pint Glass Red field, everything on it white. Headline "don’t queue / at the bar." at 26 mm, lowercase, the site's own shout, 14.2 mm x-height in Inter (12.2 in Avenir Next), full measure. The prohibition sign at 104 mm, the house line "This bar does The Cluster." at 12 mm, the polite ask at 7.6 mm, a 1 mm rule, then the flyer's foot: roundel, "Sign the petition." over the address, the code at the right.

What works: it is the cleanest sheet of the six. One colour plus white, five elements, and at a tenth it reads in order: the headline, the sign, the house line. Red is the Single File's colour and this is a poster about the Single File, so the Red-Is-Wrong rule is honoured by the whole sheet. The white ring reads as a prohibition sign by its shape alone; it doesn't need to be red. The foot is the flyer's foot, which is proven.

Faults:

- **The headline is the brand's lowercase, and on a notice it looks like the website.** The two references shout in caps; every other notice on a pub wall does. Round 2 should set this one in uppercase too and let the stamp keep the lowercase.
- The polite ask is three lines centred at 140 mm measure; the third line is "who’s next." alone. Either widen the measure to 150 mm or hard-break it after "bar." so it is two balanced lines.
- The pictogram's column is thin against a 96 mm ring: a 15 mm figure at the bottom and a 9 mm one at the top. It reads, but a hair more presence (the lowest figure at 0.9) would help, if the column still clears the ring's inside.

## Concept B, "Spread out: the tap poster's structure" (blue field)

Quiz Night Blue field. "SPREAD / OUT." stacked top left at 40 mm, 900, uppercase: 29 mm cap height, 164 mm wide in Inter (about 155 mm in Avenir Next Heavy). The subhead "The bar is long / for a reason." at 11 mm, 500 weight (the reference's light subhead; our Small weight). The roundel at 96 mm lower right as the pictogram. The foot: "Please don’t queue. / Cheers." over a 40 mm rule and the address at left; "Sign the / petition." and the code at right.

What works: the biggest read of the six at a tenth, and the simplest: four elements. The roundel is the picture and the mark at once, so there is one roundel on the sheet and it is 96 mm, which is the best the mark has ever looked on paper. The reading order from the door is "SPREAD OUT." then the roundel, which is the instruction and then the picture of it: exactly right. The 500-weight subhead is a nice change of voice under a 900 headline; it holds at a tenth, just.

Faults:

- **The foot is too wide for one row.** Address (96 mm, nowrap) + the cta (46 mm) + the code (36 mm) + gaps is 189 mm in a 170 mm measure; the flex squeezes the cta into two lines ("Sign the / petition.") and on E into three. Round 2: the cta goes into the left column under the rule, the polite line back to one line, and the code sits alone at the right. Four lines on the left are 36 mm, the code's height.
- The subhead's 500 weight is 0.2 mm under what I'd like at a tenth; 600 would match the site's Mid. Try both in Round 2.
- Blue means nothing in the system. It is the reference's colour and the site has blue blocks, but the brand rule gives red and green meanings and leaves blue as a neutral. A poster of the right behaviour belongs on the Cluster's green (see E and the decision).

## Concept B2, "Spread out, lowercase, the post office line"

The same sheet with "spread / out." lowercase at 44 mm (24 mm x-height in Inter, 20.6 in Avenir Next; the "p" and "d" give it the height the caps have) and "It’s a pub. / Not a post office." as the subhead.

On the case: at a tenth B and B2 read at the same size, and B2 looks like the home page and B looks like a notice. That is the whole question, and for a thing stuck on a pub wall I'd pick the notice: uppercase for the headline, as the two references and every sign around it, and `DESIGN.md` allows `.mega.upper` for the occasional uppercase. The lowercase stays the site's and the stamp's.

On the line: "It’s a pub. Not a post office." is the better subhead. Under "spread out." it has the context it lacked as a fourth read on the flyer, and in a layout with four elements it is the second read, not the fourth. Marketing cut it from the flyer; this is where it lives.

## Concept C, "Don't / do: the two-panel notice"

The field split into a red panel (the prohibition sign at 78 mm and "don’t / queue.") over a green one (the roundel at 78 mm and "spread / out."), with the house line, "Sign the petition.", the address and the code on the paper under them.

What works: the red/green pair is the brand rule used exactly as meant, and the two pictograms side by side teach the grammar in one look (column, no; row, yes). It has the least ink of the colour sheets (60%).

Faults:

- **It is the busiest sheet.** Two headlines, two pictograms, a three-line house line, a cta, an address and a code; at a tenth the eye bounces between the two rings and neither leads.
- The foot on the paper reads as a caption under a picture, not as part of the sign; the sheet is three zones (red, green, white) and the white one looks unfinished. Putting the foot inside the green panel crowds the panel; giving it an ink band makes four colours.
- At A5 the far figure in the red panel's column is 4.7 mm; the limit.
- The idea survives as two sheets: the prohibition notice and the instruction poster, hung side by side, are this poster with room to breathe.

## Concept D, "No queueing: the no-smoking structure" (ink field)

Last Orders Ink field. "NO QUEUEING / AT THE BAR" in Amber Pint at 23 mm uppercase (16.7 mm cap height in Inter, 16.3 in Avenir Next), centred. The prohibition sign at 104 mm with the ring and slash in Pint Glass Red over white figures. "This bar does The Cluster." at 12 mm, the polite ask, the rule, the flyer's foot, and under the address a stock code, "DQ/POS/BAR-001", as a 6 mm Label.

What works: it is the compliance notice to the letter, which is the joke, and the joke is the best thing in the round: a campaign poster that looks like it came from the brewery's point-of-sale pack. The red ring on ink is the strongest single shape of the six at a tenth. Amber on ink is the site's own pairing (the maths screen) and it is the One Amber on the sheet. "NO QUEUEING" is the register of "NO SMOKING", and it says the thing without the brand's name, which the stamp and the roundel carry anyway. The stock code is a dry touch that only staff will notice; keep it, it costs nothing.

Faults:

- **Ink.** 83% of the page inked, 71% mean darkness: a black page. On a home inkjet this is the one that empties the cartridge. The colour version is for a print shop or a laminated one-off; the mono version (black ring, black type, white paper) has to be the office version and it has to be good, because this is the sheet most pubs would print.
- The headline is the smallest of the six (23 mm uppercase against B's 40 mm). It could go to 25 mm: "NO QUEUEING" is 155 mm wide in Inter at 23, about 165 at 25, inside the 170 mm measure in Inter and narrower in Avenir Next. Check it on the Mac.
- The polite ask's third line, as A.
- "QUEUEING": the site's own spelling (the home page's meta and the campaign name); the Time Out quote uses "queuing". Keep "queueing".

## Concept E, "Find the gap: the instruction in green"

Snug Green field. "FIND / THE / GAP." stacked at 32 mm uppercase (23 mm cap height), the Tube's cadence, which is the joke; the subhead "Any gap. The bar staff / know who’s next." (step 2's line and the reassurance); the roundel at 80 mm; the foot as B, with "Take the test." and the code to `/hazard`.

What works: green is the Cluster's colour, so the instruction poster is on the right field by the brand's own rule, and white on Snug Green is the calmest sheet of the six. "Find the gap." is a better pub line than "Spread out." (it is specific, and it is funny to anyone who has stood on a platform), though "spread out." is the settled instruction on the flyer and the site.

Faults:

- Three stacked lines at 32 mm take 88 mm, so the roundel drops to 80 mm, and at a tenth the words win by too much: the picture is a badge. Two lines ("FIND THE / GAP.") would give the roundel back its 96 mm, but the Tube cadence needs three. It is a copy alternate for the tap layout, not a layout of its own.
- "Take / the / test." breaks into three lines in the squeezed foot (see B).
- The test's 37-module code has 0.8 mm modules at A4 and 0.56 mm at A5; on the poster that goes on a wall, the home code's 0.88 mm is the safer scan. One scan reason per sheet is right; whether it is the petition or the test is marketing's call.

## Decision

**Take D and B forward, as a pair: the prohibition notice and the instruction poster, in uppercase, with mono versions.** Drop C (both ideas on one sheet, neither leads) and fold A into D (A is the same notice on a red field; Round 2 renders the notice on both fields and picks). Fold E's line into B as a copy alternate (the tap layout with "FIND / THE / GAP." is a change to the data, not a layout) and take E's green: the instruction poster goes on the Cluster's field, with blue rendered once more beside it for the decision.

Why D: it is the idiom done straight, the strongest tenth, the One Amber used as the system means it, and the joke of the family (the compliance notice). Why B: the fewest elements, the biggest read, the roundel at its best, and it says what to do. Why the pair: red/ink says "no", green says "yes", and the two hung together are concept C with room. Uppercase wins for a notice (B against B2); the stamp keeps the lowercase.

## Round 2: concrete changes (A4 mm; A5 is 0.705 of each)

**The notice (from D, with A's field as the alternative)**

1. "NO QUEUEING / AT THE BAR" at 25 mm if it fits the 170 mm measure in Avenir Next Heavy (it will; Inter is the wider), else 24. Amber on ink; white on red.
2. The sign at 104 mm, the lowest figure up to 0.9 if the column still clears the ring's inside (155 r). Ring and slash red on ink, white on red.
3. The polite ask on two lines: "We kindly ask that you spread out along the bar." / "The bar staff know who’s next." Measure 150 mm.
4. The foot as now. Keep the stock code on both fields.
5. Render ink and red at A4 and A5, and the mono (black on white, the 1 mm border). Pick the field on the tenth, the ink figures and the mono.

**The instruction poster (from B, on green, with blue for comparison)**

6. "SPREAD / OUT." at 40 mm uppercase. The subhead "It’s a pub. / Not a post office." at 11 mm; render 500 and 600 and pick.
7. The roundel at 96 mm, right edge on the content edge (12 mm clear to the field's edge).
8. The foot in two columns: left, "Please don’t queue. Cheers." on one line (7.6 mm, 600), the 40 mm rule, "Sign the petition." (8 mm, 900), the address (7.6 mm, 600); right, the code alone. 36 mm tall, the code's height.
9. "FIND / THE / GAP." as a data alternate at 32 mm with the roundel at 80 mm, rendered once on green for the record.
10. A5 and mono of the green one.

**Both**

11. Nothing read on its own under 7.6 mm type at A4 (2.5 mm x-height at A5 in Avenir Next).
12. Keep the 8 mm mount; say on the download page that colour sheets are for a colour printer or a print shop and the mono is for the office laser.
13. Render once with `POSTER_FONT=Arial` to check the line breaks survive wider metrics, as the flyer rounds did.
