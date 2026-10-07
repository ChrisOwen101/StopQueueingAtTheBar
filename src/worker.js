import { Client } from 'pg';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The site is plain HTML, CSS and one script, all same-origin. Inline styles are
// needed for the --w custom property on the stat bars.
const SECURITY_HEADERS = {
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; " +
    "connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

const secure = (res) => {
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) out.headers.set(k, v);
  return out;
};

const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
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
    // built from whatever domain it is served on.
    if (pathname === '/' && request.method === 'GET') {
      const res = await env.ASSETS.fetch(request);
      if (!res.headers.get('Content-Type')?.includes('text/html')) return secure(res);
      const origin = new URL(request.url).origin;
      const absolutise = (attr) => ({
        element(el) {
          el.setAttribute(attr, origin + el.getAttribute('data-abs'));
          el.removeAttribute('data-abs');
        },
      });
      return secure(
        new HTMLRewriter()
          .on('meta[data-abs]', absolutise('content'))
          .on('link[data-abs]', absolutise('href'))
          .transform(res)
      );
    }

    // Anything else falls through to the static site.
    return secure(await env.ASSETS.fetch(request));
  },
};
