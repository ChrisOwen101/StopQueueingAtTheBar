import { Client } from 'pg';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    // Anything else falls through to the static site.
    return env.ASSETS.fetch(request);
  },
};
