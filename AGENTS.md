# Handover: "Don't Queue At The Bar"

A comedy campaign site against single-file queueing at the bar in UK pubs, bars and breweries.
Hosted on Cloudflare Workers, on the team's current Cloudflare account (set up by a co-worker). The first deploy was on a previous personal account at `dont-queue-at-the-bar.cowen19921.workers.dev`, which is no longer used. Add the live URL here once confirmed.

## The idea (read this first)

- **Background:** Since COVID (2020 social-distancing stickers, single-file lines), people queue in one long line to the bar. Pre-COVID, you spread out along the bar and the barperson or landlord knows who is next.
- **Problem:** The single file wastes room in the pub, blocks seating, leaves most of the bar and staff idle, and is unnatural.
- **Goal:** Get people to stop, in a funny way. The site is a petition plus a merch route (beer mats for pubs).
- **Name:** "Don't Queue At The Bar". It was earlier called "Stop Queueing at the Bar" and "Bar the Line / The Bar Party" (see the old notes at the bottom).
- **Name for the right behaviour:** **The Cluster**. The wrong behaviour is **The Single File**.
- **Tone:** Direct, dry British humour. Short, punchy lines. The format is mock-scientific (the "Bar Rule", rulings, alignment chart), copied from cuberule.com.
- **Gender-neutral language (always):** Never use gendered terms for pub staff or the people in the jokes. Say **barperson** (never barman, barmaid, bartender-as-"he"), **bar staff**, or **landlord** (neutral here). Refer to staff with **they/them/their**, never he/she/him/his/her. This applies to all copy: page text, meta/OG/Twitter tags, `site.webmanifest`, beer mats (`scripts/build-mats.mjs`), the petition and any new docs. Before finishing any copy change, grep `public/`, `scripts/` and `src/` for `barman|barmen|barmaid|\bhe\b|\bhis\b|\bhim\b|\bshe\b|\bher\b`.
- **Look:** Very bold. Huge lowercase type. One idea per full-screen colour block, scrolling down a long page. Simple diagrams with animation. No photos.

## Real facts the page uses

Source: [East London Times, 29 Aug 2026](https://eastlondontimes.co.uk/local/hackney/hackney-church-brew-co-sales-spike-after-single-file-queue-ban-hackney-2026/), which reports Hamish Glenn (Broadsheet London), MyLondon and YouGov.

- Hackney Church Brew Co posted on 14 Aug 2026: "A BAR IS NOT A POST OFFICE". Their bar is about 20 ft with 4 staff.
- Like-for-like sales rose **25%** on the following Thursday (£3.50 pints) when people spread along the bar. Footfall was steady; spend per head rose.
- YouGov: **40%** prefer single-file, **39%** prefer along the bar. London: only 37% back single-file. Midlands, North and Wales: 42%. Ages 25 to 49 favour along the bar most.
- The site is **not affiliated** with Hackney Church Brew Co and says so in the footer. Consider telling them.
- Everything else (the animated sim scores, alignment chart, rulings) is jokes.

## Project layout

```
public/            Static site (served by Workers assets)
  _headers         Security headers (CSP and friends) for every response; never served itself
  index.html       All page copy and sections
  styles.css       Colour blocks, type, scenes, timeline, beer mats, form
  script.js        Reveal, count-ups, pub simulation, timeline rail, petition form
  hazard.html      Hazard perception hub: two buttons, customer test and barperson test
  hazard.js        Shared test player (HazardTest.init): playback, questions, scoring, sound, speech
  hazard.css       Test page chrome and layout, player controls, hub cards
  hazard-customer.{html,css,js}   Customer test: clip markup, keyframes, questions
  hazard-barperson.{html,css,js}  Barperson test (first person): clip markup, keyframes, questions
  audio/           Generated ElevenLabs narration and sound effects plus manifest.json (commit these)
scripts/voice.json, sfx.json      Narrator voice and sound effect prompts for npm run audio:generate
src/worker.js      Worker: POST /api/sign, GET /api/count; everything else -> static assets
schema.sql         Postgres table `signatures`
wrangler.jsonc     Worker, assets and Hyperdrive config
package.json       wrangler + pg; scripts: dev, deploy, check, db:init:local
.github/workflows/deploy.yml   Deploys to Cloudflare on push to main
README.md          Setup steps
```

No build step. Edit the files in `public/` and deploy.

**Social meta and icons:** `index.html` has Open Graph, Twitter card, icon and manifest tags. Tags marked `data-abs` get the real origin added by `src/worker.js` (HTMLRewriter on `/`), so no domain is hard-coded. The square logo, favicons, app icons and share images (`logo-square.svg`, `favicon.*`, `apple-touch-icon.png`, `icon-*.png`, `og-image*.png`) are generated from `public/logo-side.svg` by `npm run build:icons` (needs Google Chrome). Re-run it if the logo changes.

**Beer mats:** the page shows the real print artwork in `public/mats/` (a front that is the logo badge and a back with the domain round the edge and a QR code to the home page). They are generated by `npm run build:mats` (`scripts/build-mats.mjs`, uses the `qrcode` dev dependency). The address is the `SITE_URL` constant at the top of that script (currently `https://dontqueueatthebar.co.uk/`), or set the `SITE_URL` env var. The front is copied from `public/logo-side.svg`, so edit the logo, not the SVGs. Before printing, convert text to outlines and add the printer's bleed.

## Page structure (`public/index.html`)

1. Hero: the name and "It's a pub. Not a post office." with a bobbing scroll hint.
2. Story: "Stand on the sticker" (2020), "it ended" (`#after`), "20 feet of bar".
3. Evidence (`#hackney`): "A bar is not a post office", count-up **+25%**, YouGov bars.
4. The Bar Rule (`#rule`): ① The Single File (red), ② The Cluster (green), and a side-by-side "Same pub. Same Thursday." scoreboard.
5. How to do The Cluster (`#howto`): 4 steps (walk to the bar, pick a gap, catch an eye, trust the barperson).
6. Hazard Perception Test (`#test`): a teaser with a link out to `hazard.html`. The tests live on their own pages.
7. Additional Bar Rulings (`#rulings`): The Round, The Hoverer, The Phantom Queue, alignment chart, The Landlord.
8. Beer mats (`#mats`): the front (logo badge) and the back as SVG images, marked "coming soon". Nothing is for sale yet.
9. Petition (`#petition-section`): pledges for pubs, the public and Parliament (mock), plus the form.
10. Footer: sources, the non-affiliation line, and the beer fund line ("Made with 🍻 by people who just want a pint. Chip in to the beer fund. No queue."), a plain link to a Stripe Payment Link. It's a tip jar for a few people running a campaign, not a charity, so never call it a donation to charity or mention Gift Aid.

A **fixed timeline rail** sits on the left and tracks the 9 chapters above. Anchors it uses: `#covid`, `#after`, `#hackney`, `#rule`, `#howto`, `#test`, `#rulings`, `#mats`, `#petition-section`. If you add, rename or remove a chapter, update both the `<nav class="timeline">` list and the matching section `id`s.

## How the interactive bits work (`public/script.js`)

- **Reveal:** `.reveal` sections fade up via IntersectionObserver. The `js` class on `<html>` gates this, so the page works without JS.
- **Count-ups:** elements with `data-count` (plus optional `data-prefix` and `data-suffix`) animate when scrolled to.
- **Pub scenes:** `.scene[data-mode="single"|"cluster"]` run a small simulation (seeded random, same arrivals, 4 staff). In single mode only one member of staff can reach the queue front, so it serves far fewer pints. It starts and stops with visibility. Tunables are the constants near `STAFF_X`, `SERVICE_TICKS`, `ARRIVAL_CHANCE`.
- **Timeline rail:** computed from scroll position. It hides on the hero, fills dot to dot, marks the active chapter (`.active`) and passed ones (`.done`).
- **Petition form:** POSTs JSON to `/api/sign`, and shows the running total from `/api/count`.
- `prefers-reduced-motion` is respected throughout. Otherwise a fixed **pause animations** button (built in `script.js`, hidden for reduced-motion users) stops the sims, scroll hint and mat wobble (WCAG 2.2.2).
- **Tell a mate:** after a successful signature the form shows a share button (native share sheet, or copies the link).
- **Security headers:** the CSP, `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy` live in one place, the `/*` block of `public/_headers`. Cloudflare applies it to everything served from `public/` (pages, CSS, JS, audio, images, 404s), including the home page the Worker fetches through `env.ASSETS` and rewrites, because HTMLRewriter keeps the headers. Cloudflare reads the file and never serves it. `_headers` rules never reach responses the Worker builds itself, so `src/worker.js` imports the file as text (the `rules` entry in `wrangler.jsonc`) and copies the `/*` block onto its `/api` JSON. The Worker won't start, so a deploy fails, if that block loses its CSP. If you add an external script, stylesheet, font, image, audio file, iframe or analytics beacon, add its origin to the matching directive in `public/_headers` (`script-src`, `style-src`, `font-src`, `img-src`, `media-src`, `frame-src`, `connect-src`) or the browser will block it. Nothing else needs changing. Inline `<script>` and `on*` attributes are blocked. Inline `style` attributes are allowed. Plain outbound links need no change. After a deploy, check with `curl -sI <site>/hazard`.
- Design and product context live in `PRODUCT.md`, `DESIGN.md` and `.impeccable/design.json`.

## Hazard perception tests (`hazard*.html`)

- **Pages:** `hazard.html` is the hub, linked from the home page `#test` section. Each test page loads `styles.css`, then `hazard.css` and its own CSS, then `hazard.js` and its own JS (both `defer`).
- **Layout (`hazard.css`):** in landscape (desktop and landscape phones) the clip and playhead sit on the left and the questions on the right. In portrait the clip is at the top (sticky) and the questions sit underneath. The stage is sized to fit the viewport height in landscape. Short landscape phones get the compact overrides at the end of the file.
- **Clips:** each `.hpt-shot` in a test page is one clip, made of CSS keyframes. Everything in a shot inherits the clip's duration (`--dur`), and `hazard.js` plays, pauses and seeks them through the Web Animations API (`getAnimations`, `currentTime`), so each clip stops exactly on its hazard. Each shot needs an `<i class="hpt-clock">`.
- **Data:** `HazardTest.init(root, { clips, pick, grades, links, posterAt, ambience })`. `clips` is the pool (10 per test). Each run deals `pick` of them (default 5) in random order, and every retake deals again. A clip is `{ dur, cue, label, sounds: [[ms, name]], question, options: [{ text, ok, say }] }`. `dur` and `cue` default to 10s and 5s. There are no on-screen captions, so a clip tells its story with movement and speech bubbles. `label` is the stage's screen reader description. The outcome after the cue always shows the right behaviour and ends on a settled frame. Options are not shuffled, so vary which letter is right. Grades are fractions of the dealt clips. `ambience` is an optional sound name looped under the whole test (both tests use `'pub'`; see Audio). Keep the `.hpt-shot` elements in the same order and number as `clips`.
- **Reviewing a clip:** add `?clips=3,7` (pool positions, counting from 1) to a test URL to play just those clips, in that order.
- **Player chrome:** `hazard.js` adds the start cover, hazard badge and controls (play/pause, progress bar with a diamond per hazard, time, mute) itself.
- **Audio (all from ElevenLabs, no browser speech or synthesised tones):** the player plays narration and sound effects only from `public/audio/manifest.json`. A line or sound that's missing stays silent and logs a `console.warn`. `HazardTest.spokenLines()` and `soundNames()` list everything a test can play, and the scripts use the same functions. The voice and its settings are in `scripts/voice.json` (currently "Publican Yorkshire"), and the sound effect prompts are in `scripts/sfx.json`. **Ambience:** the config's `ambience` sound (the `pub` entry in `sfx.json`, a 20s murmur recorded with ElevenLabs' `loop: true`) loops at gain 0.3 (`AMBIENCE_GAIN` in `hazard.js`) under narration and effects at full level. It fades in when the test starts and keeps going through questions, outcomes and the hold before Next. It stops when the viewer pauses or mutes, when the player is away (scrolled out of view or tab hidden, even mid-question), and on the result screen, so the fanfare plays clean. It comes back on play, on return, on unmute and on Next. How each line is performed lives in `scripts/directions.json`: ElevenLabs audio tags, pauses and emphasis, keyed by the exact on-screen text, with a default tag per role (question, correct, wrong, result by score, narration) for lines without their own entry. Directions are only sent on `eleven_v3`/`eleven_v4` (v2 would read the tags aloud), and they must not change the words. `npm run audio:compare` renders a small before/after set into `.voice-samples/directions/`. After changing any copy, prompt or voice, run `npm run audio:generate`. It reads `ELEVENLABS_API_KEY` from `.env`, only re-records what changed, and fails if anything is left without audio. Commit the new files in `public/audio/`. `audio:dry` shows what would be recorded and the character count. `audio:check` checks for gaps. `audio:samples` renders candidate voices into `.voice-samples/`, which is gitignored. Mute is saved in `localStorage`.
- **Behaviour:** after an answer the verdict shows with a "Next clip" button. The outcome plays and holds on its last frame until the viewer presses it (play at that point replays the outcome). Next cuts off any narration still playing. The player pauses when scrolled out of view or the tab is hidden. With reduced motion it jumps straight to each question and straight to the end of each outcome. Answers can also be keyed with 1–4 or A–D.
- **Clip preview (`/hazard-preview`):** a staff page listing every clip in every test's pool, with its timing, label, question, options (right one in green) and a `?clips=N` link into the real player, plus "Play all N in order". It is unlinked and `noindex`, so don't link it or add it to a sitemap or `robots.txt`. It needs no upkeep: the tests come from the hub's `a.hz-door` links, in hub order, and the clips come from each test's config, read fresh on every load. For each test it fetches the page, then runs its `<script src>` list in order, minus `hazard.js`, in a blank hidden iframe whose stub `HazardTest.init` records the config. It warns when a page's `.hpt-shot` count doesn't match `clips.length`. The only rule: each test's scripts must still call `HazardTest.init` with the full config when loaded without a stage (no `#hpt`, no templates, nothing on screen).

## Backend

- **Database:** Neon Postgres (eu-west-2), table `signatures` (`id`, `name`, `email`, `consent`, `consent_at`, `created_at`). The unique index on `lower(email)` means duplicate emails are silently ignored, so the API doesn't reveal who has signed.
- **Hyperdrive:** id `88c5a2e2902f470995344cd16411c3fc` in the current Cloudflare account (the earlier account had `bar-petition`, id `7918ba51…`, which is no longer used). Use Neon's **direct** (non-`-pooler`) host. Hyperdrive does the pooling. It is bound as `HYPERDRIVE` in `wrangler.jsonc`.
- **Worker:** `src/worker.js` checks the Origin header, has a honeypot field `website`, validates name, email and consent, and caches `/api/count` for 60s. `/api/*` and `/` run the Worker first (`run_worker_first`), and so does any path with no matching file (it returns the 404 from `env.ASSETS`). Everything else is served straight from `public/`.
- **Secrets:** the connection string is stored in Hyperdrive only. It is not in the repo. Never commit it.

## Commands

```sh
npm install
npm run dev        # wrangler dev (needs local Postgres: createdb bar_petition && npm run db:init:local)
npm run deploy     # deploy to Cloudflare (also happens on push to main via GitHub Actions)
npm run check      # wrangler deploy --dry-run
```

- **CI:** `.github/workflows/deploy.yml` needs the repo secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
- **Cloudflare:** log in with `wrangler login` using the **current** account. Worker name `dont-queue-at-the-bar`, on the `workers.dev` subdomain.

## Gotchas

- **Hyperdrive error 10157 (config not found):** the id in `wrangler.jsonc` must exist in the account Wrangler is logged into. If `wrangler deploy` fails with 10157, you are probably logged into the wrong account (`npx wrangler whoami`), or the id changed. Check with `npx wrangler hyperdrive list`. `wrangler dev` may rewrite the id.
- **Old account leftovers:** the previous personal account may still host `dont-queue-at-the-bar` and the older `stop-queueing-at-the-bar` Workers, plus the `bar-petition` Hyperdrive config. They are unused. Clean them up there if you still have access.
- **Testing animations:** In an automated or hidden browser tab, scroll events and IntersectionObservers don't fire reliably. Force them by dispatching a `scroll` event or adding `in` to `.reveal` elements.
- **Count endpoint:** the first call after a deploy once returned a Cloudflare 1042 error, then worked. Watch for it.

## Open items

- **Rotate the Neon password.** It was pasted into chat during setup. Reset it in Neon (Roles -> `neondb_owner`), then run `npx wrangler hyperdrive update 88c5a2e2902f470995344cd16411c3fc --connection-string=...` (logged into the current account). The old personal-account Hyperdrive config also holds the password, so delete it or update it too. Better still, make a limited role that can only read and write `signatures`.
- **Spam protection:** add Cloudflare Turnstile or a WAF rate-limit rule before promoting the site.
- **Privacy:** add a privacy notice and a way to delete a signature on request (UK GDPR and PECR). The consent box covers the petition plus campaign and beer mat updates, so make sure the notice matches.
- **Beer fund link:** the footer links to a Stripe **test mode** Payment Link (`buy.stripe.com/test_…`, one place in `public/index.html`). Test links only take Stripe's test cards, so no real money arrives. Before promoting the site, create the live version in the Stripe Dashboard (switch off test mode, Payment Links -> New -> "Customers choose what to pay") and swap the href. It's a plain outbound link, so the CSP in `public/_headers` doesn't need changing.
- **Beer mats:** no ordering route yet. Options are an email sign-up only, or a shop (Shopify, Stripe, Printful).
- **Domain and contact details:** none yet. Custom domain goes under Workers & Pages -> the Worker -> Settings -> Domains & Routes. Earlier ideas: `bartheline.uk`, `thebarparty.uk`, `stoptheline.uk` (availability unchecked).
- **Hackney Church Brew Co:** the page quotes and names them. Consider giving them a heads-up.
- **Not done:** press release, logo, OG share image, favicon.
- **Possible extras:** an admin export of signatures, a "share" button, a pub-pledge form for venues.

## Earlier work (from the first, separate handover)

Before this site, a landing page for a mock political party, "Bar the Line / The Bar Party", was built in a Claude design artifact. Those files are **not** in this repo.

- **Artifact:** https://claude.ai/artifact/VQk6yjEdCu5YtDmXXsqKqb
- **Spreadsheets:**
  - `uk_pub_campaign_contacts.xlsx`: 17 trade body and pub group contacts.
  - `london_breweries_contacts.xlsx`: 84 London breweries, with only one confirmed brewery email (Five Points) plus London Brewers' Alliance `hi@` and `pr@londonbrewers.org`.
- **Script:** `find_brewery_emails.py`, a scraper that fills in the brewery emails. Untested on live sites. Set `YOUR_EMAIL_HERE` first.
- **Existing campaign:** @QueuesPub has run since 2023. Consider allying with them.
- **Legal:** PECR says sole traders and partnerships need consent before campaign emails. Include an opt-out and follow UK GDPR. Only role-based addresses were collected.
- **Sources caveat:** the Guardian, Sun and Reddit links were blocked at the time. Earlier figures (service about 3x slower, +25% sales) came from Metro and Broadsheet and are the brewery's own claims.
