# Posters (notice family), round 3: designer's notes and the print check

Reviewed 14 Oct 2026 against `../round-2/designer.md` and `../round-2/marketing.md`. The renders in this folder are the final data in `scripts/build-posters.mjs` (the two leads at A4 and A5, colour and mono; the alternate at A4, colour and mono; the Arial check of the two leads). `../final/` holds the same set built by the default run (`npm run build:posters`) plus the print check, below.

## The two changes

1. **The notice's polite ask** is "We kindly ask that you spread out." / "The bar staff know who’s next.": two sentences, two lines, 134 and 118 mm in Inter, centred, no orphan. The sheet now has five reads from the door in order: the amber headline, the red sign, the white house line, the ask, the foot. Frozen.
2. **The instruction poster's subhead at 600.** It reads at the tenth where the 500 only just did, and it is the system's Mid. Frozen.

And the housekeeping: the red notice, the blue poster and the 500 render are out of the data (their renders are in `../round-2/`), the two-panel layout is out of the script (its render is in `../round-1/`), and the alternate headline gets its mono so it is a complete option.

## Sizes, frozen (A4 mm; A5 is 0.705 of each)

**Both sheets:** the mount 8 mm; the field 194 × 281; content 12 mm inside it (20 mm from the paper). Everything on a field is paper white; the monos are black on white with a 1 mm black line on the mount's edge. The code 36 mm, level H, four-module quiet zone, on a white panel (33 modules, 0.88 mm; A5 0.62 mm). The address 7.6 mm, 600 (x-height 3.6 mm in Avenir Next, 2.5 at A5). The cta 8 mm, 900.

**The notice:** headline 25 mm, 900, uppercase, −0.03 em, line-height 0.92 (cap height 17.2 mm in Avenir Next; the ceiling, it fills the measure in Liberation Sans); the sign 104 mm (ring outer 96, stroke 7.8, figures 15.2 to 8.8 mm wide); the house line 12 mm, 600; the ask 7.6 mm, 600, two lines; a 1 mm rule; the foot with the roundel at 18 mm (2.25 mm clear), the cta, the address, the stock code as a 6 mm Label (cap height 4.2 mm, 3.1 at A5).

**The instruction poster:** headline 40 mm, 900, uppercase (cap height 28.3 mm in Avenir Next; 164 mm wide in Inter, about 155 in Avenir Next); the subhead 11 mm, 600, two lines; the roundel 96 mm, its right edge on the content edge (12 mm clear, its eighth, exact), 14 mm above the foot; the foot in two columns, the polite line 7.6 mm, the 40 mm rule, the cta, the address at left, the code at right. The alternate: headline 32 mm, three lines; roundel 80 mm (10 mm clear, exact).

## The Arial check

`POSTER_FONT=Arial --tag arial` on both leads (`*-arial.png`): every line breaks where it does in Inter, including the new two-line ask. The notice headline fills its measure in Liberation Sans and nothing else moves.

## The print check (`../final/`)

The deliverable is the PDF, not the screenshot, so each final PDF was rasterised with `pdftoppm -r 150` and compared with the script's preview of the same sheet (mean absolute difference per channel, 0 to 255, over the page; and the share of pixels off by more than 64, which are edge pixels):

| Sheet | PDF raster | Preview | Mean diff | Pixels off by >64 |
| --- | --- | --- | --- | --- |
| notice-ink-a4 | 1241 × 1754 | 1240 × 1754 | 2.0 | 1.2% |
| notice-ink-mono-a4 | 1241 × 1754 | 1240 × 1754 | 2.5 | 1.4% |
| poster-green-a4 | 1241 × 1754 | 1240 × 1754 | 1.6 | 0.9% |
| poster-green-mono-a4 | 1241 × 1754 | 1240 × 1754 | 1.8 | 1.1% |
| poster-gap-a4, -mono | 1241 × 1754 | 1240 × 1754 | 2.1, 2.5 | 1.2%, 1.4% |
| the four A5s | 875 × 1241 | 874 × 1240 | 4.5 to 7.0 | 2.5% to 3.6% |

That is antialiasing at edges and a one-pixel rounding of the page (210 mm at 150 dpi is 1240.2 px), nothing in the layout. The page boxes are exactly 210 × 297 and 148 × 210 mm (pdf-lib sets them; Chrome's own come out 594.96 × 841.92 pt). poppler warns "Bad bounding box in Type 3 glyph" on every page: that is Chrome's embedding of the fallback font's glyphs as Type 3 and goes away with a real font on the Mac; the flyers' PDFs have the same. The PDF rasters of the four A4 leads are kept as `*-print.png` with a `*-print-tenth.png` each; at a tenth they read exactly as the previews did.

The ink figures, final: the notice 83% inked / 71% mean darkness (colour), 16% / 15% (mono); the instruction poster 72% / 51% (colour), 17% / 17% (mono); the alternate 76% / 54% and 13% / 13%.

## What is left

- **The Mac.** The fonts: every render here is Inter (the PDFs embed it as Type 3). Run `npm run build:posters` on a Mac with Avenir Next, look at "NO QUEUEING" against the content edges (drop to 24 mm if it touches), check the subhead and the ask still break where they do, and commit `brand/final/review/posters/final/`.
- **Paper.** One A4 of each mono on a mono laser, through a photocopier, and a phone scan of the code from the copy; one A4 of each colour sheet on an office inkjet to see the mount and the cockle for real; one A5 of the notice mono for the 0.62 mm modules.
- **The team.** Which to ship (see `../round-2/marketing.md`: the notice mono first, the notice colour, the instruction poster colour and mono; the alternate only if two instruction posters are wanted), and whether to link them from the home page's posters block. Nothing here is linked from the site.
- **The domain** on every sheet is `dontqueueatthebar.co.uk`, which isn't pointed at the Worker yet.
