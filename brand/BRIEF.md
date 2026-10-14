# Brand identity brief

The campaign's identity is settled (12 Oct 2026). This file records the decisions and the rules, and it is the brief for rolling the identity out across the site. The design exploration behind it is in the "Don't Queue At The Bar: brand identity" Claude Doc (https://claude.ai/code/artifact/6b9a9d8d-1bdd-4761-ad0f-6e087745ee69) and in the contact sheets in `brand/round-1/`, `brand/round-2/` and `brand/final/`.

## The identity

- **Primary mark: the Cluster roundel** (`brand/final/mark.svg`, reversed in `mark-reversed.svg`). It shows three people seen from behind, spread along a bar that runs through a ring. It is one colour, with no words inside it. It shows the right behaviour rather than forbidding the wrong one.
- **Partner mark: the type stamp** (`brand/final/stamp.svg`, from Round 1's concept 05a). It is "don’t queue / at the bar." in a matching ring.
- **Lockups:**
  - `lockup-horizontal.svg` (homepage top left)
  - `lockup-stacked.svg`
  - `icon-square.svg` (Stripe, favicon, app icon)
  - `badge-round.svg` (the seal base)
  - `seal-customer.svg` and `seal-barperson.svg` (the hazard licences)
  - `flyer-a5.svg` (the first sketch of a flyer; superseded by the print-at-home flyers below, kept only because `sheet-applications.html` shows it)
  - a `-reversed` variant of each where one exists
- **Source:** `brand/final/build.mjs` writes every final SVG and renders `final-marks.png` and `final-applications.png`.

## Decisions

- **Black and white, one colour.** On the site the mark sits in ink (#16161d) or cream (#fff4dc) only.
- **Beer mat (double-sided):**
  - **Front:** the stamp (`brand/final/mat-front.svg`).
  - **Back:** the roundel in the middle of a level-H QR code to the home page, with the domain round the edge (`brand/final/mat-back.svg`).
  - **Rejected:** the alternative front, `badge-round.svg` with the name on both sides.
- **Who uses which mark:**
  - The roundel is the favicon, the app icon, the Stripe icon and the licence seal.
  - The horizontal lockup goes top left on the homepage, and in cream at the left of every hazard page's header.
  - The stamp leads on the mat front and on flyers.

## Usage rules

1. **One colour only.** Black on white is the master. The reversed set (white on black, or cream on ink) is the only other version. Never use a grey, a tint, an outline-only version or a drop shadow.
2. **Clear space** is one eighth of the mark's width on every side. That's 50 units of the 400 box, 8px at 64px, or 12 mm on a mat. Nothing enters it, including the words of a lockup other than the one supplied.
3. **Minimum sizes:**

   | Element | Minimum |
   | --- | --- |
   | The mark | 16px or 5 mm |
   | The horizontal lockup | 40px or 12 mm tall |
   | The stamp | 48px or 18 mm |
   | The badge and the seals | 80px or 25 mm (their ring text fails below that) |
4. **Don't redraw it.**
   - The bar always overhangs the ring.
   - There are always three figures.
   - The figures never get faces, hair, hands or a pint.
   - If a picture of a person is needed, use the hazard kit's cast, not the mark.
5. **Words stay outside the ring.** The stamp is the one exception, and it has no figures. The site's colour blocks stay whole (the Whole-Screen Rule in `DESIGN.md`).

## Before print

- **Outlines:** text in the SVGs is still live (Avenir Next). Convert it to outlines on a Mac or in Illustrator before sending anything to a printer, then add the printer's bleed. `mark.svg` and `icon-square.svg` have no text, so they need nothing.
- **Font licence:** the macOS licence for Avenir Next covers artwork made on the Mac, but not embedding the font.
- **Mat back:** the roundel covers about 20% of the QR code. Scan a printed proof of the back before a print run.
- **Flyers:** nothing to outline or bleed: they are for office printers and Chrome embeds the font. Rebuild them on a Mac (below), then print one A4 and one A5 of each face on a mono laser, photocopy them, and scan the code from the copy.

## Flyers (settled 13 Oct 2026)

Print-at-home posters a pub downloads from the site, prints on an office printer and puts up or leaves on the bar. Two faces: **Face A, the poster**, read from across the room, and **Face B, the how-to**, read in the hand. They are built by `scripts/build-flyers.mjs` (`npm run build:flyers`) into `public/flyers/` as `flyer-a4.pdf`, `flyer-a4-double.pdf` (A then B), `flyer-a5.pdf`, `flyer-a5-double.pdf` and `flyer-a5-two-up.pdf` (two A5 posters on one A4 landscape sheet with a cut mark), plus `preview-a.png` and `preview-b.png` for the web page. The marks come from `scripts/lib/brand.mjs`; nothing is redrawn. The design went through three rounds with a graphic designer and a marketing specialist; their notes and every round's renders are in `brand/final/review/flyers/` (`round-1/` has the three concepts, `decision.md` the merge, `round-2/` and `round-3/` the refinements, `final/` the print check at 150 dpi and the home page at 1280 and 390 wide).

### The decisions

- **Three concepts in Round 1:** "Stamp first" (the stamp huge and centred, one line under it, the campaign's voice), "House rule" (the pub's own notice, "this bar does the cluster.", the stamp as a letterhead) and "The bar" (a thick bar across the page with "spread out." along it). The designer picked the first (the only one where the stamp leads, as this brief says; lightest on ink; its faults were sizes, not the idea) and the marketing specialist picked a merge of the second and third (a landlord prints a house sign, not a campaign poster; a drinker needs permission, an instruction and reassurance, in that order). The merge is both: the stamp leads, then the instruction, then the house line.
- **Face A reads, from the door:** the stamp (120 mm on A4, centred, clear space kept), then **"spread out."** (the instruction, 30 mm type), then the house line **"This bar does The Cluster. / The bar staff know who’s next. / They always did."** (the pub's permission, the reassurance, and the one dry note; one sentence per line). At the foot: the roundel, "Sign the petition.", the address, and a plain QR code. "It’s a pub. Not a post office." was cut from the poster: it was always the fourth thing read, and nobody reads the fourth thing on a poster. The name on the stamp carries the prohibition.
- **The pub-facing line earns its place.** It turns the campaign poster into a house sign in the register pubs already use ("this bar is cashless"), gives the drinker the permission they need to leave the line, is positive (what the house does, not what the customer is doing wrong), and is the first pub pledge: a pub that prints it has joined. A pub that won't say it won't enforce it either, so there is no version without it.
- **Face B stays in the campaign's voice.** "The rules of this bar" was rejected because it put the jokes and the sum in the pub's mouth. The house line becomes the kicker ("This bar does The Cluster. Here’s how."), then "four easy steps." and the four steps verbatim from the home page (step 4 keeps the site's "barperson"; the poster says "bar staff", the pub's plural), one 2 mm rule with the uppercase "worked example" tag on it, "25 minutes. Or six." with the sum and its caveat on its own line ("Arithmetic, not a stopwatch. Real pubs are messier."), then the QR, "Think you’re ready? Take the test." and the address, and the stamp signing bottom right at 30 mm. Each face earns one scan: the petition on the poster, the test on the how-to, and the how-to's code goes straight to the test (`/hazard`), not the home page; the written address stays the bare domain on both faces. Face B carries no second ask.
- **One roundel per sheet, and a plain QR code.** The mat's roundel-in-the-code was tried and dropped: a mono laser plus a photocopy eats both the roundel and the error correction it costs. The codes stay level H, 36 mm, with a four-module quiet zone. The poster's goes to the home page like the mat back; the how-to's goes to the hazard perception test. The address under each is the bare domain, one line, 600 weight, the fallback rather than the route.
- **Off the flyers:** the YouGov split (a poster with "40% prefer the queue" on it argues against itself), the bar motif from Concept 3 (a redraw of the mark's bar without its ring), any figure that could be read as the pub's own waiting time on the poster, anything for sale, charity wording.

### The rules

- **Black on white only**, one ink, no tints: even the two-up's cut mark is black (0.2 mm, 2 mm dashes, 3 mm gaps), lighter by pattern, not grey. No solid fields bigger than the 2 mm rule; ink coverage is about 12% a face.
- **Sizes:** exact paper (A4 210 × 297 mm, A5 148 × 210 mm), no bleed, a safe margin of 10 mm at A4 and 7 mm at A5 (the A5 is the A4 layout at 148/210; every length is a multiple of the script's `--mm`). The stamp is 120 mm on the poster and 30 mm on the how-to (21 mm at A5, above the 18 mm minimum), the roundel 20 mm, the QR 36 mm. "spread out." at 30 mm is the ceiling: any bigger and it beats the stamp.
- **Type:** the site's stack (Avenir Next first), 900 lowercase headlines with tight tracking, 600 for everything else, typographic apostrophes. Nothing read on its own under 2.5 mm x-height at A5 in Avenir Next (the address, the kicker, the tag, the scan lines are 7.6 mm or more at A4); running text is 7 mm at A4, about 2.3 mm x-height at A5, the most the how-to's copy allows.
- **Copy** is the site's: if the steps or the maths change on the home page, change the script and rebuild. Gender-neutral throughout (barperson, bar staff, they/them).
- **The address** is `SITE_URL` in `scripts/lib/site.mjs`, shared with the mats (`https://dontqueueatthebar.co.uk/`; the how-to's `/hazard` is resolved against it). The flyers and the mats carry the same domain; point it at the site before a pub prints one, and rebuild both if it ever changes.
- **The layout doesn't depend on the font's metrics.** Round 2 was rendered with Arial in place of Avenir Next (`FLYER_FONT=Arial`, a review-only switch) and every line broke in the same place; the two lines that could move with a wider font (the house line, "four easy steps.") have a hard break and room to grow.

### What's left for a Mac

- `public/flyers/` was built on Linux, where the stack falls back to Inter. Run `npm run build:flyers` on a Mac with Avenir Next (the script warns when it can't find it) and commit the result before the site is promoted. On the first Mac render, check "four easy steps." still fits one line at 22 mm, the house line's second line stays under 180 mm (drop it to 11 mm if not), and the worked-example paragraph stays at three lines.
- Then the real test: one A4 and one A5 of each face on a mono laser, through a photocopier, and a phone scan of the code from the copy.

## Rollout task (for an agent)

Repo: ChrisOwen101/StopQueueingAtTheBar. Start from the latest `main`. The site is static and lives in `public/`. A Cloudflare Worker serves it, and there's no build step. **A push to `main` deploys to production, so never push to `main`.** Work on a new branch `brand-identity-rollout`, push it, and open a pull request against `main`.

Read these first:
- this file
- `AGENTS.md`: the project rules, layout, the beer mat and icon pipelines, the CSP in `public/_headers`, and the gender-neutral language rule with its grep
- `DESIGN.md`
- everything in `brand/final/`, especially `build.mjs`. Look at `final-marks.png` and `final-applications.png` to see the intended result.

### What to do

1. **Fix the apostrophe.** The stamp uses a straight apostrophe in "don't". DESIGN.md requires typographic ones in visible copy, so change it to ’. Fix it at the source in `brand/final/build.mjs`, then re-run it so every generated SVG has it: stamp, mat front, lockups, flyer, and anything else.
2. **Beer mats.** Change `scripts/build-mats.mjs` so `npm run build:mats` writes the new front and back into `public/mats/mat-front.svg` and `public/mats/mat-back.svg`:
   - Keep the `SITE_URL` constant and env var behaviour. Keep the `qrcode` dev dependency, and use error correction level H, because the roundel covers part of the code.
   - `build-mats.mjs` stays the one source of truth for `public/mats/`, so take the drawing code from `brand/final/build.mjs` into it, or share it, rather than copying files by hand.
   - Run it, and check the homepage `#mats` section still shows both sides.
   - Check the QR code still decodes with the roundel on it. Render the back to PNG and decode it, for example with `jsQR` or `zbarimg`, installed only in your sandbox and not added to `package.json` unless it's already a dev dependency. Report the result.
3. **Favicons and app icons.** Make the roundel the source of `favicon.svg`, `favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` and `logo-square.svg`. They're currently generated from `public/logo-side.svg` by `npm run build:icons` (`scripts/build-icons.mjs`, which uses headless Google Chrome).
   - Add the mark as `public/mark.svg` and point the icon script at it.
   - `mark.svg` has no text, so rendering it on Linux is fine. If Chrome isn't available, use any headless Chromium you can install in your sandbox, without adding it to `package.json`.
   - **Don't regenerate `og-image.png` or `og-image-square.png` without Avenir Next installed.** Their source has live text in that font, and without it the font comes out wrong. Leave those two images as they are and say so in the PR.
   - Update `site.webmanifest` if it needs it.
4. **Homepage badge, top left.** Add the horizontal lockup (`brand/final/lockup-horizontal.svg`, saved under `public/`) at the top left of the homepage hero in `public/index.html`, linking to `/`:
   - About 64px tall on desktop, and no smaller than 40px on phones. Ink on the cream hero, with the clear space from the usage rules.
   - It must not collide with the fixed timeline rail on the left (hidden on the hero, it fades in after) or the promo sticker (bottom right of the hero).
   - It needs accessible text ("Don’t Queue At The Bar, home").
   - Put the styles in `public/styles.css`, following DESIGN.md: flat, no shadows.
   - Check it at 1280 and 390 wide.
5. **Stripe icon.** Export `brand/final/icon-square.svg` as a 512x512 PNG at `brand/final/icon-square-512.png`. Someone will upload it to the Stripe Payment Link by hand, so note that in the PR. Don't change the Stripe link in `index.html`.
6. **Docs.** Update `AGENTS.md` and `DESIGN.md` to match:
   - the new mark and its files
   - the mat front and back
   - the icon source
   - the homepage badge
   - the "Look" and "Beer mats" sections
   Point both at this file for the usage rules, and keep them in their existing plain style.

### Out of scope

- The hazard licence certificate masters in `public/badges/`. Their generator isn't in this repo.
- The hazard test pages, the clips and the audio.
- Outlining text to paths. That needs Avenir Next, which only a Mac has.
- The flyer, beyond fixing its apostrophe.

### Rules

- CSP: no inline `<script>`, no `on*` attributes, no new external origins, no web fonts. Same-origin images and inline SVG are fine.
- Run the gender-neutral grep from AGENTS.md over `public/`, `scripts/` and `src/` before you finish.
- Run `node --check` on any JS you touch, and `npm run check` if Wrangler can run without Cloudflare credentials. Skip it if it can't.
- Commit messages are short imperative sentences, like the existing history.

### In the PR description, cover

- what changed
- screenshots or rendered PNGs of the homepage hero (1280 and 390 wide) and of both mat sides, committed under `brand/final/review/` if there's no other way to attach them
- the QR decode result
- anything left for a Mac: the OG images, text outlining, a printed proof scan of the mat back before a print run

## Posters (notice family), exploration 14 Oct 2026

A second family of print-at-home posters, in the idiom of the notices already on a pub's walls: a flat colour field, a huge uppercase headline, one flat pictogram, a dry line, a polite ask, the mark small. The two references were a restaurant's bright-blue "TURN THE TAP OFF" water poster (headline stacked top left, a quiet subhead, a huge tap lower right, "Please save water. Cheers." over a rule, a small round mark) and a pub group's black "NO SMOKING OR VAPING" compliance notice (amber headline, red prohibition roundel over a white pictogram, a body line, a polite line, the group's mark, a footer strip with the URL and a stock code). The flyers above are the campaign's voice on the pub's wall; these are the pub's voice, borrowed from the campaign. They are built by `scripts/build-posters.mjs` (`npm run build:posters`), modelled on the flyer script, into `brand/final/review/posters/final/` as PDF plus a 150 dpi PNG and a tenth-size thumbnail of each; the concepts are one data array in the script, so a change to the family is a change to that array. Three rounds with a graphic designer and a marketing specialist; the notes and every round's renders are in `brand/final/review/posters/` (`round-1/` has the six concepts and the decision, `round-2/` the two directions on both fields with A5, mono and the Arial check, `round-3/` the final polish and the print check, `final/` the set). **Nothing in this family is linked from the site or written to `public/`; that is the team's call.**

### What was explored

- **Round 1, six concepts:** A, the prohibition notice on red ("don’t queue / at the bar." lowercase, a crossed-out queue); B, the water poster's structure on blue ("SPREAD / OUT.", the roundel as the pictogram); B2, the same lowercase with "It’s a pub. Not a post office."; C, a two-panel don't/do (red over green, both pictograms); D, the no-smoking structure on ink ("NO QUEUEING / AT THE BAR" in amber, a red ring, a stock code); E, "FIND / THE / GAP." on green. The pictogram's first draft (figures overlapping and receding, as a queue really looks) read as a stack of circles and was redrawn as a column with gaps.
- **Round 2:** the pair, the notice (D) on ink and on red, the instruction poster (B) on green and on blue, the subhead at 500 and 600, the alternate headline, A5, the monos, and an Arial render of each lead to check the breaks survive wider metrics.
- **Round 3:** the polite ask re-set on two lines, the subhead at 600, the final set, and the print check: each PDF rasterised at 150 dpi and compared with its preview (they match to antialiasing; page boxes exact).

### The decisions

- **The family is a pair.** **The notice** (`notice-ink`): Last Orders Ink field, "NO QUEUEING / AT THE BAR" in Amber Pint at 25 mm, the prohibition sign at 104 mm with the ring and slash in Pint Glass Red over white figures, "This bar does The Cluster." at 12 mm, "We kindly ask that you spread out. / The bar staff know who’s next." at 7.6 mm, a rule, then the flyer's foot (the roundel at 18 mm, "Sign the petition.", the address, the code) with a stock code, "DQ/POS/BAR-001", as a 6 mm Label under the address. The landlord's sheet: it looks like the point-of-sale notice the brewery sent, which is the joke, and a pub can put it up without feeling it has joined a campaign. **The instruction poster** (`poster-green`): Snug Green field, "SPREAD / OUT." at 40 mm stacked top left, "It’s a pub. / Not a post office." at 11 mm and 600 under it, the roundel at 96 mm lower right as the pictogram and the mark at once, then "Please don’t queue. Cheers." over a 40 mm rule, "Sign the petition." and the address at left and the code at right. The taproom's sheet and the "do" half of the pair. The alternate headline for the same sheet, "FIND / THE / GAP." at 32 mm with "Any gap. / The bar staff know who’s next." and "Take the test." to `/hazard` (`poster-gap`), stays in the data for a pub that wants it.
- **Ink, not red, for the notice:** three reads at distance (amber, red ring, white) against one; the red ring on ink is the prohibition symbol as everyone knows it; amber on ink is the maths screen's pairing and the One Amber on the sheet; red stays on the Single File's sign alone. **Green, not blue, for the poster:** the instruction is the Cluster and the Cluster is green; blue is the reference's colour and means nothing here.
- **Uppercase headlines** on this family (`.mega.upper`'s licence): B against B2 showed the lowercase reads as the website and the uppercase as the sign. The stamp and the flyers keep the lowercase.
- **"It’s a pub. Not a post office." lives here**, as the second read under the instruction, where it has the context it lacked as the flyer's fourth read.
- **Dropped:** C (both ideas on one sheet, neither leads; the pair hung side by side is C with room), the red notice, the blue poster, the lowercase headline, the 500 subhead, the overlapping queue pictogram.
- **Every colour sheet has a mono** (black on white, a 1 mm black line on the mount's edge), because a solid field is 72 to 83% of the page inked (the flyers are 12%): a cartridge every few sheets on an inkjet, a grey banded page on a mono laser. The monos are 16 to 17%. The download page, if these ship, says: colour sheets for a colour printer or a print shop, the black-and-white ones for the office laser, and "hang them together".

### The rules this family adds

- **The mount.** A home printer can't print to the edge, so the field is never bled: it is inset 8 mm at A4 (5.6 mm at A5), a drawn white frame the printer's unprintable edge falls inside, so the frame prints even (if a driver shrinks the page to fit, the frame grows a little and nothing is lost). Content keeps 12 mm inside the field, 20 mm from the paper. The monos draw their 1 mm line on the same edge.
- **Fields and what goes on them.** The field is one palette colour (ink, red, green, amber or blue are the only candidates; red means the Single File, green the Cluster, amber is the one highlight and is only ever the headline on ink). Everything on a field is **paper white**, never cream (cream on a field is a printed tint in the knockouts), or black on the monos. A QR code sits on a white panel so it reads the same on any field. One scan reason per sheet, the code plain and level H at 36 mm, the address the bare domain at 7.6 mm (the 2.5 mm x-height floor at A5).
- **The prohibition pictogram** (new; drawn in `scripts/build-posters.mjs`, not in `brand.mjs`, because it is not a mark): the roundel's ring (r 170, stroke 30 in the 400 box) and a 45° slash from upper left to lower right (ISO 3864) over four `FIG` glyphs in a vertical column with gaps, the nearest at the bottom and biggest (scales 0.5 to 0.88). It always has its slash, never a bar, and the figures never touch, so it cannot be read as the roundel. Where the slash and the figures share a colour the slash carries a field-coloured knockout. The grammar it gives the family: **the Cluster is a horizontal row (the roundel); the Single File is a vertical column.** Minimum: the farthest figure is 8.8 mm at 104 mm; don't go under 80 mm.
- **One roundel per sheet.** On the notice it is the mark at the foot (18 mm, clear space kept); on the instruction poster it is the pictogram, 96 mm, its right edge on the content edge so its clear space (an eighth, 12 mm) is exactly the field's padding. The stamp is on neither: the name is in the headline. The brand rules above (one colour, no redraw, clear space, minimum sizes) all hold.
- **Uppercase for the headline, 900, −0.03 em, line-height 0.92**; sentence case, 600, for every other line; the stock code as a Label (900, uppercase, 0.08 em). Nothing read on its own under 7.6 mm type at A4. The notice headline's ceiling is 25 mm (it fills the measure in Liberation Sans); the poster's "SPREAD" is 40 mm.
- **Copy:** "NO QUEUEING" is the site's spelling. The house line, the polite "We kindly ask…", "Please don’t queue. Cheers." and the stock code are the family's register. Gender-neutral throughout (bar staff, who’s next, they); typographic apostrophes; no exclamation marks; no figure of any kind on a sheet (nothing here needs a `RESEARCH.md` row).
- **Review as the flyers were reviewed:** the 150 dpi A4, the A5, the tenth, an Arial render for the breaks, and the PDF rasterised and compared with the preview.

### What's left

- **For a Mac:** every render was made on Linux in Inter (the PDFs embed it as Type 3 glyphs, which poppler warns about). Run `npm run build:posters` with Avenir Next, check "NO QUEUEING" against the content edges (drop to 24 mm if it touches), the subhead and the ask still breaking where they do, and commit `brand/final/review/posters/final/`.
- **For paper:** one A4 of each mono on a mono laser, through a photocopier, and a phone scan of the code from the copy; one A4 of each colour sheet on an office inkjet to see the mount and the cockle for real; one A5 of the notice mono for its 0.62 mm modules.
- **For the team:** which to ship (`round-2/marketing.md`: the notice mono first, then the notice in colour, the instruction poster in colour and mono, the alternate only if two instruction posters are wanted); whether to link them from the home page's posters block beside the flyers, which would mean writing them to `public/` from the script, as the flyers are; and the domain, which every sheet carries and which isn't pointed at the Worker yet.
