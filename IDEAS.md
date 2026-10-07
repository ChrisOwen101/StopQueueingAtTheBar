# Ideas: "Don't Queue At The Bar"

Things that could go on the project. Not a plan, just a pile. Roughly grouped, with a rough effort tag: **S** (an hour or two), **M** (a day), **L** (several days or needs outside help).

## Must-do before promoting (from the handover)

- **Rotate the Neon password** and use a limited role for `signatures`. **S**
- **Turnstile or WAF rate limit** on `/api/sign`. **S**
- **Privacy notice** and a "delete my signature" route (UK GDPR and PECR). **M**
- **Favicon, OG share image, Twitter card.** The logo SVGs already exist in `public/`. **S**
- **Custom domain.** **S**

## On the page

- **"Try it yourself" mini-game:** you are a punter at a bar, click a gap to move. Single-file mode lets you stand in a line; Cluster mode lets you catch the barperson's eye. Score = pints served. **M**
- **Live sim sliders:** let visitors change bar length, staff count and arrival rate and watch the two scenes diverge. **M**
- **Pub calculator:** enter bar length, staff and pint price; get a (very mock-scientific) estimate of extra weekly takings from The Cluster, using the +25% figure with a clear caveat. **M**
- **"Which are you?" quiz:** The Hoverer, The Phantom Queue, The Round Buyer, The Fiver Waver. Shareable result card. **M**
- **Bar Rule glossary page:** one URL per ruling (`/rulings/the-hoverer`) so each can be shared on its own. **M**
- **Dark mode / pub-at-night theme** for the colour blocks. **S**
- **Sound toggle:** optional ambient pub murmur, a till ching when a pint is served in the sim. Off by default. **S**
- **Easter eggs:** Konami code turns the page into a Post Office queue; a "ticket machine" number in the hero. **S**
- **Regional version of the YouGov stat:** a small map or bar chart (London 37%, Midlands/North/Wales 42%). **S**
- **FAQ block:** "But what about fairness?", "What about busy Friday nights?", "Isn't this just chaos?" Answered dryly. **S**
- **"Hear from the bar staff" section:** short quotes from bar staff (with permission). **M**

## Petition and community

- **Share buttons / "tell a mate"** after signing, with prefilled text. **S**
- **Thank-you page** with a "now do it in real life" checklist. **S**
- **Milestone banner:** "We've reached 1,000 signatures". **S**
- **Signature wall:** first names and town only, opt-in. **M**
- **Referral link** that shows how many people you brought in. **M**
- **Double opt-in email confirmation** (fits PECR well). **M**
- **Admin export** of signatures behind auth (there is already `scripts/export-signatures.sh`; a protected `/admin` route would replace it). **M**
- **Email updates** via Buttondown, Resend or Mailchimp for people who consented. **M**

## For pubs and venues

- **Pub pledge form:** venue name, postcode, "we welcome The Cluster". **M**
- **Map of pledged pubs** (Leaflet or MapLibre, no photos needed). **L**
- **Downloadable A4 / A5 poster** (PDF) for behind-the-bar walls: "Don't queue. Find a gap." **S**
- **Floor sticker designs** that mirror the 2020 stickers but say "Stand anywhere". **M**
- **Staff briefing card:** how to run a bar without a queue ("serve by eye contact, then by arrival"). **S**
- **"Cluster-friendly" badge** (SVG/embeddable) for pub websites and Google listings. **M**
- **Pub pack:** a short email template to send to landlords, plus a one-page case study from Hackney Church Brew Co. **S**

## Merch

- **Beer mat order route:** start with an email waitlist per design, then a shop (Stripe Payment Links, Printful or Shopify). **M**
- **Free printable beer mat PDFs** so pubs can print their own. **S**
- **Stickers, tote bags, T-shirts** ("I stand in clusters"). **M**
- **Bulk pack for pubs** at cost price. **L**

## Press and outreach

- **Press page** with logo downloads, key facts, quotes and contact. **S**
- **Press release** and a short pitch to local papers. **M**
- **Heads-up to Hackney Church Brew Co,** and possibly ask for a quote. **S**
- **Ally with @QueuesPub** and similar campaigns. **S**
- **Contact the trade bodies and breweries** from the earlier spreadsheets (CAMRA, BBPA, UKHospitality, London Brewers' Alliance). Remember PECR: role-based addresses only. **M**
- **Short videos:** a 15-second sim screen recording for TikTok, Reels, Shorts. **M**
- **Reddit / Twitter-style meme templates:** "This is a bar, not a post office". **S**
- **Nominate for a Parliament petition** (the real `petition.parliament.uk`, with the mock Parliament pledge as a joke). **M**

## Data and credibility

- **Citations page** listing every number, with a "this bit is a joke" marker next to the jokes. **S**
- **Run a real mini-experiment:** ask a few pubs to try The Cluster for a week and publish results with a caveat. **L**
- **Public poll:** a one-question widget, "How do you order at the bar?" with live results. **M**
- **Live counter** of signatures in the hero, not just the petition section. **S**
- **Privacy-friendly analytics** (Cloudflare Web Analytics or Plausible). **S**

## Technical polish

- **Accessibility pass:** contrast on colour blocks, focus states, `aria-live` for the sim totals, keyboard-friendly timeline rail. **M**
- **Performance pass:** Lighthouse, font loading, pause sims off-screen (already done) and on low-power mode. **S**
- **Social preview per section** (`og:image` for `#rule`, `#rulings`). **M**
- **Tests:** a few checks for `src/worker.js` (validation, honeypot, origin). **M**
- **Error and empty states** on the form, with friendly jokes. **S**
- **CSP and security headers** via `_headers` or the Worker. **S**
- **Staging environment** on a separate Worker and Hyperdrive config. **M**
- **Clean up the old personal Cloudflare account** (old Workers and `bar-petition` Hyperdrive). **S**
- **Add the live URL to `AGENTS.md`** once confirmed. **S**

## Wilder ideas

- **"Bar Day":** a national day for The Cluster, with a hashtag. **L**
- **Browser extension / bookmarklet** that replaces any queue photo with a gap. (Silly, but shareable.) **M**
- **"Report a queue" form:** people submit a pub with a single-file queue (kindly, no shaming), and the site sends the landlord a friendly nudge. **L**
- **Barperson badge:** staff sign up as supporters. **M**
- **A printed "pub queue bingo" card** to share. **S**
- **Collaboration with comedians or podcasters** who like a small, silly cause. **L**
