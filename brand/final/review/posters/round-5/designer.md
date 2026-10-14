# Posters (notice family), round 5: designer's notes and the print check

Reviewed 14 Oct 2026 against `../round-4/decision.md`. The renders in this folder are the final data in `scripts/build-posters.mjs` (the five sheets of the set, colour and mono, A4 and A5 where the sheet ships at A5; the Arial check of the four that changed). `../final/` holds the same set built by the default run (`npm run build:posters`) plus the print check, below. Nothing in `round-1/` to `round-4/` was touched, and the script keeps every concept ever rendered with its rounds, so `--round N` rebuilds any of them.

## The three changes

1. **The stress device is scoped to the line.** An element that holds a stressed word gets `has-st`; the weight device acts on it alone. The notice's headline is back at 900 on two lines, the ask has its two bold words, the stock code is back on the sheet. The along poster's mono now reads "ALONG" 900 / "THE BAR." 500 / "NOT" 500 "AWAY" 900 / "FROM IT." 500, which is the stress without the colour, and nothing else on the sheet changes weight. Frozen.
2. **The two-pictogram notice** (`notice-along`): the headline white and three lines by design ("QUEUE / ALONG / THE BAR." at 25 mm, 69 mm tall), the amber on the tick and ALONG only, the ask plain on two lines. One amber meaning on the sheet. The roundel and the column at 74 mm with 16 mm between them; the labels 10 mm under the marks (the roundel's eighth is 9.25 mm). Frozen.
3. **The set with the user's two lines.** The notice's ask is "We kindly ask that you queue / along the bar, not away from it. / The bar staff know who’s next." (stressed words 900 inside the 600 line; the sign at 100 mm to pay for the third line). Every instruction poster's polite line is "Please don’t single-file queue. / Cheers." (the roundel at 90 on the green poster, 84 on the along poster, 72 on the alternate).

## Sizes, frozen (A4 mm; A5 is 0.705 of each)

As `../round-3/designer.md`, with: the notice's sign 100 mm (ring outer 92, the far figure 8.5 mm); the along poster's headline 30 mm uppercase on four lines (cap height 21.2 mm in Avenir Next, "NOT AWAY" 165 mm wide in Inter and about 156 in Avenir Next, so 30 is the ceiling) with the roundel at 84 mm (10.5 mm clear); the two-pictogram notice's headline 25 mm on three lines, pictograms 74 mm, labels 9 mm Labels (cap height 6.5 mm at A4, 4.6 at A5), the tick 9 mm; the polite line at the foot of the tap layout on two lines (111 mm and 19 mm wide in Inter at 7.6 mm), the foot 45 mm tall.

## The Arial check

`POSTER_FONT=Arial --tag arial` on the notice, the two-pictogram notice, the green poster and the along poster: every line breaks where it does in Inter, including the three-line ask, the four-line along headline and the two-line polite line (Liberation Sans Bold sets "Please don’t single-file queue." at about 118 mm against the 128 mm column). Liberation Sans has no 900, so its bold is 700 and the weight stress in the ask shows as 700 against 600; in Avenir Next it is Heavy against Demi.

## The print check (`../final/`)

Each final PDF rasterised with `pdftoppm -r 150` against the script's preview (mean absolute difference per channel over the page; the share of pixels off by more than 64, which are edges):

| Sheet | PDF raster | Preview | Mean diff | Pixels off by >64 |
| --- | --- | --- | --- | --- |
| notice-ink-a4, -mono | 1241 × 1754 | 1240 × 1754 | 1.9, 2.3 | 1.1%, 1.4% |
| notice-along-a4, -mono | 1241 × 1754 | 1240 × 1754 | 2.5, 2.8 | 1.4%, 1.5% |
| poster-green-a4, -mono | 1241 × 1754 | 1240 × 1754 | 1.6, 1.9 | 0.9%, 1.1% |
| poster-along-a4, -mono | 1241 × 1754 | 1240 × 1754 | 1.9, 2.1 | 1.1%, 1.2% |
| poster-gap-a4, -mono | 1241 × 1754 | 1240 × 1754 | 2.2, 2.6 | 1.3%, 1.4% |
| the eight A5s | 875 × 1241 | 874 × 1240 | 4.3 to 7.0 | 2.4% to 3.5% |

Antialiasing and the one-pixel rounding of the page, as before; page boxes exact. The PDF rasters of the four A4 leads (the two notices and the two posters, colour and mono) are kept as `*-print.png` with a `*-print-tenth.png` each. The old `final/` sheets this run replaced (the notice with "spread out", the posters with "Please don’t queue") still exist in `round-3/`.

Ink, final: the notice 83% / 71% (colour), 16% / 15% (mono); the two-pictogram notice 75% / 67% and 17% / 16%; the green poster 72% / 51% and 17% / 16%; the along poster 74% / 64% and 17% / 16%; the alternate 76% / 54% and 13% / 12%.

## At A5

The polite line and the address at the 2.5 mm x-height floor (Avenir Next); the ask the same; the labels on the two-pictogram notice 4.6 mm cap height; its column's far figure 4.4 mm, the limit, and its code 25.4 mm with 0.62 mm modules, like the rest. If an A5 is printed on a mono laser and photocopied, this is the sheet to scan first.

## What is left

- **The Mac.** Every render is Inter. Run `npm run build:posters` with Avenir Next; check "NO QUEUEING" and "NOT AWAY" against the content edges (drop a millimetre if either touches), the three-line ask and the four-line headline still breaking where they do, and commit `brand/final/review/posters/final/`.
- **Paper.** One A4 of each mono on a mono laser, through a photocopier, a phone scan of the code from the copy; one A4 of each colour sheet on an office inkjet; one A5 of the two-pictogram notice.
- **The team.** Which of the five to link from the home page (`../round-4/marketing.md` groups them: two notices, two posters and the alternate). Nothing here is linked from the site. The domain on every sheet isn't pointed at the Worker yet.
