# Posters (notice family), round 4: designer's notes

Reviewed 14 Oct 2026 against `brand/BRIEF.md` ("Posters (notice family)"), `../round-3/designer.md` and the user's two asks: the polite line becomes "Please don’t single-file queue. Cheers." everywhere, and a new line, "please queue along the bar, not away from the bar", with the stress on *along* and *away*, is to be explored as a poster. Twenty sheets at A4 in this folder: the three of the set with the new line (and their monos), and seven treatments of the along/away line, each in colour and mono. Sizes are from the CSS in `scripts/build-posters.mjs`; x-heights are given for Inter (the render, 0.546 em) and Avenir Next (the final, 0.468 em). The script now keeps every concept ever rendered with the rounds it was in, so `--round N` rebuilds a round; this folder is the record of this one.

## 1. The new polite line

"Please don’t single-file queue. Cheers." at 7.6 mm, 600, is 154 mm in Inter Semibold and about 148 mm in Avenir Next Demi: wider than the foot's left column (128 mm beside the 36 mm code) at either size, so it can't sit on one line on the tap layout. It breaks after "queue.", never inside the phrase: "Please don’t single-file queue." (111 mm in Inter, about 105 in Avenir Next) over "Cheers.". The foot's left column is now five lines, 45 mm against the code's 36, so the roundel on the instruction poster gives up 6 mm (96 to 90; clear space 11.25 mm, inside the 12 mm padding) and the alternate's gives up 8 (80 to 72). At A5 the same breaks hold (every length scales). The Arial check comes in Round 5 with the final data; Liberation Sans Bold sets the first line at about 118 mm, still inside 128.

The notice doesn't carry this line (its ask is the "We kindly ask" register), so it is unchanged here, apart from the along/away treatment below.

## 2. The along/away line: copy

The options, written out:

1. "Please queue along the bar, not away from the bar." The user's phrasing. The repeated "the bar" is the stress pattern of speech; on a sheet the second "the bar" is the fourth and fifth words you don't need.
2. "Queue along the bar, not away from it." The tighter sentence. The right one for a polite ask and a subhead.
3. "Queue along it, not away from it." The tightest; "it" needs the bar named within a glance, so only under a headline or next to the pictogram.
4. "Along the bar. Not away from it." The fragment, as a headline: four lines on a stacked poster ("ALONG / THE BAR. / NOT AWAY / FROM IT.").
5. "Along. Not away." The two stressed words alone, with the sentence under them.

The pick: 4 for the poster headline, 2 for the ask and the subhead. "Please" stays off headlines (the family's headlines are instructions; the manners are in the small type) and on the polite line.

## 3. The seven treatments

**Weight (`along-weight`, green).** The four lines at 30 mm uppercase, the stressed words 900 and the rest 500. The stress is unmistakable and it costs the headline its shout: "THE BAR." and "FROM IT." at 500 look like another family's poster, and at a tenth the sheet reads as two bold words and two thin lines. The mono (where it is the only device left) is acceptable, no more.

**Amber on ink (`along-amber`).** The four lines at 30 mm, all 900, ALONG and AWAY in Amber Pint, the rest paper white, the roundel white at 84 mm. This is the one. It is the site's own device (The One Amber Rule: amber is the thing to look at), it keeps every word at the family's weight, and at a tenth the two amber words are the first read and the white words the second, which is exactly the stress the user asked for. Ink is the price: amber has no other field. 74% inked, 64% mean darkness. Headline block 110 mm; "NOT AWAY" is 165 mm wide in Inter (about 156 in Avenir Next), so 30 mm is the ceiling. The mono falls back to weight, which is the only honest device on white.

**Underline (`along-underline`, green).** Fails as rendered: at the family's line-height of 0.92 the underline under ALONG lands on the cap line of THE BAR. and reads as a strike-through of the next line. It would need a line-height of 1.1 or more, which loses the stacked shout, and a thinner rule, which loses the stress. Rejected, and recorded as the reason the family doesn't underline.

**The fragment (`along-fragment`, green).** "ALONG. / NOT AWAY." at 27 mm with "Queue along the bar, / not away from it." at 11 mm under it, the roundel at 96. The biggest read of the seven and the cleanest sheet, and it needs no stress device because the stressed words are the whole headline. But "ALONG." on its own means nothing from the door; the sense arrives with the subhead, which is the second read. A good alternate; not the pick, because the user's line is the sentence, and `along-amber` says the sentence from the door.

**The notice with the ask (`along-notice`, ink).** The ask becomes "We kindly ask that you queue / *along* the bar, not *away* from it. / The bar staff know who’s next.", three lines at 7.6 mm with the stressed words at 900 inside the 600 line, and the sign drops to 100 mm to pay for the third line. The ask reads well and the bold words carry the stress at small size. **But the render is broken:** my weight device was written on the page, not on the line, so the headline dropped to 500 too, set wider, wrapped to three lines ("NO / QUEUEING / AT THE BAR") and pushed the stock code off the sheet. The fix is to scope the device to the line that holds the stressed word; Round 5 carries it. Judged on the ask alone, this is the right change to the notice: the user's line is the pub's ask in the pub's register, and "spread out." was only ever the short form of it.

**The two pictograms (`along-pictos`, ink, the new "pair" layout).** The notice's structure with the roundel (the row along the bar) and the prohibition column (one behind another, leading away) side by side at 74 mm, "✓ ALONG" and "AWAY" as 9 mm Labels under them, the house line, the ask, the foot. It works: it is the only sheet where "along" and "away" are pictures, and the pair teaches the grammar (row, yes; column, no) without a word. Faults: three ambers (the headline, the label, the stressed words in the ask), where the rule allows one meaning per sheet; the headline "QUEUE ALONG / THE BAR." at 25 mm wrapped to three lines by itself ("QUEUE / ALONG / THE BAR."), which looks right and should be set that way on purpose; the labels sit 10 mm under the marks (the roundel's eighth is 9.25 mm: clean). At A5 the column's far figure would be 4.4 mm, the limit. Round 5: the headline white, the amber on the tick and ALONG only, the ask plain, three lines by design.

**Lowercase (`along-lower`, ink).** "along / the bar. / not away / from it." at 32 mm, amber stress. It is handsome and it is the website: the site's lowercase shout, and the family's uppercase rule is what makes these read as notices. At a tenth the uppercase at 30 mm (cap height 21.8 mm) still outreads the lowercase at 32 (x-height 17.5 mm). The rule survives: this line is a sentence, and the stressed words in amber carry it in caps as well as they do in lowercase. Kept as the record of the test, not shipped.

## 4. Decision

- **Stress rule for the family:** a stressed word is set in Amber Pint, which means the sheet is on ink; everything stays 900. In mono, and in a line of running text, the stressed word is 900 and the rest of that line keeps its weight (500 for a headline, 600 for a polite line). Never an underline (the stack's line-height has no room for one).
- **The along poster is `along-amber`,** renamed `poster-along` in the final data: ink, "ALONG / THE BAR. / NOT *AWAY* / FROM IT." with ALONG in amber too, the roundel at 84 mm, the new polite line, "Sign the petition." It joins the set beside the green "SPREAD OUT." poster: two instruction posters, one on the Cluster's green with the campaign's joke, one on ink with the user's line.
- **The notice takes the along/away ask** in place of "We kindly ask that you spread out.", with the bug fixed and the sign at 100 mm.
- **The two-pictogram sheet joins the set** as `notice-along`: the instruction notice beside the prohibition notice, for the pub that wants the picture of both.
- **Dropped:** weight as the colour device (kept only as the mono fallback), the underline, the fragment (recorded as an alternate headline, not shipped), the lowercase.

## 5. Round 5: concrete changes (A4 mm; A5 is 0.705 of each)

1. Scope the weight device to the line holding the stressed word (`has-st`), so the notice headline stays 900.
2. The notice: ask = "We kindly ask that you queue / along the bar, not away from it. / The bar staff know who’s next." (stressed words 900), sign 100 mm. Check the foot sits on the page.
3. `poster-along` as `along-amber` (30 mm, roundel 84, amber ALONG and AWAY).
4. `notice-along` as `along-pictos` with the headline white and three lines by design, the amber on the tick and ALONG only, the ask plain.
5. `poster-green` and `poster-gap` with the new polite line (roundel 90 and 72).
6. Render every final sheet at A4 and A5, colour and mono; the Arial check on the notice, the along poster and the green poster; the print check (PDF rasterised against the preview) on every new final sheet.
7. The brief: the new line, the stress rule, the along/away decision, what was dropped.
