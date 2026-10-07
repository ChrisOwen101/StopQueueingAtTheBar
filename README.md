# Don't Queue At The Bar

Static site (`public/`) plus a Cloudflare Worker (`src/worker.js`) that stores petition signatures in Postgres through Hyperdrive.

| Route | Purpose |
|---|---|
| `POST /api/sign` | Validates and stores `{ name, email, consent }` |
| `GET /api/count` | Returns `{ count }` (cached for 60s) |
| everything else | Served from `public/` |

## Setup

```sh
npm install
npx wrangler login
```

### 1. Database

Use any Postgres reachable from Cloudflare (Neon, Supabase, RDS, your own). Create the table:

```sh
psql "$DATABASE_URL" -f schema.sql
```

### 2. Hyperdrive

```sh
npx wrangler hyperdrive create bar-petition --connection-string="postgres://USER:PASS@HOST:5432/DB"
```

Copy the returned `id` into `wrangler.jsonc` (`hyperdrive[0].id`).

### 3. Local development

```sh
createdb bar_petition && npm run db:init:local
npm run dev
```

`localConnectionString` in `wrangler.jsonc` points at local Postgres. Override it with
`CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE`.

### 4. Deploy

```sh
npm run deploy
```

Then add your custom domain under Workers & Pages → the Worker → Settings → Domains & Routes.

## Notes

- Duplicate emails are ignored silently (unique index on `lower(email)`), so the API doesn't reveal who has signed.
- Spam protection: same-origin check and a honeypot field. Add Cloudflare Turnstile and/or a rate-limiting rule (WAF) before launch.
- UK GDPR/PECR: add a privacy notice, and a way to delete a signature on request.
