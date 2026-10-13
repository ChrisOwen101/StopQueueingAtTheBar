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
  - `flyer-a5.svg`
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
- **Flyer:** print one A5 flyer on an office photocopier to check the neck gaps and the QR code survive.

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
