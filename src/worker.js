import { Client } from 'pg';
// Imported as text (see "rules" in wrangler.jsonc). The security headers live in that file only.
import HEADERS_FILE from '../public/_headers';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Cloudflare applies public/_headers to everything served from public/, including what
// env.ASSETS.fetch returns below, but never to responses the Worker builds itself. So the
// API's JSON responses copy the /* block from that file here.
const SECURITY_HEADERS = {};
{
  let inAll = false;
  for (const line of HEADERS_FILE.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (!/^\s/.test(line)) {
      inAll = line.trim() === '/*';
      continue;
    }
    const i = line.indexOf(':');
    if (inAll && i > 0) SECURITY_HEADERS[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  // Fail at deploy (Cloudflare runs this on upload) rather than ship an API without headers.
  if (!SECURITY_HEADERS['Content-Security-Policy']) {
    throw new Error('public/_headers has no Content-Security-Policy in its /* block');
  }
}

const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...SECURITY_HEADERS,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...headers,
    },
  });

// One short-lived client per request; Hyperdrive does the real pooling.
async function withDb(env, ctx, fn) {
  const client = new Client({ connectionString: env.HYPERDRIVE.connectionString });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    ctx.waitUntil(client.end());
  }
}

async function handleSign(request, env, ctx) {
  // Only accept submissions from our own site.
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) {
    return json({ error: 'Forbidden' }, 403);
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  // Honeypot: bots fill hidden fields. Pretend success.
  if (data.website) return json({ ok: true });

  const name = String(data.name ?? '').trim();
  const email = String(data.email ?? '').trim();

  if (!name || name.length > 100) return json({ error: 'Please enter your name.' }, 400);
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json({ error: 'Please enter a valid email address.' }, 400);
  }
  if (data.consent !== true) return json({ error: 'Consent is required.' }, 400);

  // Duplicates are silently ignored so the endpoint doesn't reveal who has signed.
  await withDb(env, ctx, (db) =>
    db.query(
      `INSERT INTO signatures (name, email, consent)
       VALUES ($1, $2, TRUE)
       ON CONFLICT (lower(email)) DO NOTHING`,
      [name, email]
    )
  );

  return json({ ok: true }, 201);
}

async function handleCount(env, ctx) {
  const count = await withDb(env, ctx, async (db) => {
    const { rows } = await db.query('SELECT count(*)::int AS count FROM signatures');
    return rows[0].count;
  });
  return json({ count }, 200, { 'Cache-Control': 'public, max-age=60' });
}

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);

    try {
      if (pathname === '/api/sign') {
        if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, { Allow: 'POST' });
        return await handleSign(request, env, ctx);
      }
      if (pathname === '/api/count') {
        if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405, { Allow: 'GET' });
        return await handleCount(env, ctx);
      }
    } catch (err) {
      console.error('API error', err);
      return json({ error: 'Server error' }, 500);
    }

    // The home page gets absolute URLs in its social meta tags (og:image etc.),
    // built from whatever domain it is served on. Responses from env.ASSETS already carry
    // the public/_headers rules, and HTMLRewriter keeps them, so nothing is added here.
    if (pathname === '/' && request.method === 'GET') {
      const res = await env.ASSETS.fetch(request);
      if (!res.headers.get('Content-Type')?.includes('text/html')) return res;
      const origin = new URL(request.url).origin;
      const absolutise = (attr) => ({
        element(el) {
          el.setAttribute(attr, origin + el.getAttribute('data-abs'));
          el.removeAttribute('data-abs');
        },
      });
      return new HTMLRewriter()
        .on('meta[data-abs]', absolutise('content'))
        .on('link[data-abs]', absolutise('href'))
        .transform(res);
    }

    // Anything else (404s, unknown /api paths) falls through to the static site.
    return env.ASSETS.fetch(request);
  },
};
