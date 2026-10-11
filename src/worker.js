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

const MAX_BODY = 4096; // a signature is a few hundred bytes; anything bigger is not one
const MAX_NAME = 100;
const MAX_EMAIL = 254;

// A bare HTML page for visitors who post the form without JavaScript (the form's plain
// action). Same colour blocks and headers as the rest of the site, no scripts.
const htmlPage = (status, tone, title, text) =>
  new Response(
    `<!doctype html><html lang="en-GB"><head><meta charset="utf-8">` +
      `<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">` +
      `<title>${title} - Don't Queue At The Bar</title><link rel="stylesheet" href="/styles.css"></head>` +
      `<body><main><section class="screen ${tone}"><div class="inner"><h1 class="big">${title}</h1>` +
      `<p class="mid">${text}</p><a class="cta" href="/#petition-section">Back to the site</a>` +
      `</div></section></main></body></html>`,
    {
      status,
      headers: { ...SECURITY_HEADERS, 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    }
  );

// Tidy a name: NFC, control and bidi-override characters out, runs of whitespace to one space.
const cleanName = (s) =>
  s
    .normalize('NFC')
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ')
    .replace(/[\u202a-\u202e\u2066-\u2069\ufeff]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

async function handleSign(request, env, ctx) {
  const type = (request.headers.get('Content-Type') || '').toLowerCase();
  // The form posts as a form when JavaScript is off or has failed, and as JSON otherwise.
  const isForm = type.includes('application/x-www-form-urlencoded');

  const fail = (status, message) =>
    isForm ? htmlPage(status, 'c-red', 'That did not work', message) : json({ error: message }, status);
  const succeed = (status) =>
    isForm
      ? htmlPage(200, 'c-amber', 'Thank you.', 'You have signed. Now go and stand at the bar.')
      : json({ ok: true }, status);

  // Only accept submissions from our own site.
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) {
    return fail(403, 'Forbidden');
  }

  // Cap the body before parsing it (the header can be absent or wrong, so check the text too).
  if (Number(request.headers.get('Content-Length')) > MAX_BODY) return fail(413, 'That was too much to send.');
  const raw = await request.text();
  if (raw.length > MAX_BODY) return fail(413, 'That was too much to send.');

  let data;
  if (isForm) {
    data = Object.fromEntries(new URLSearchParams(raw));
    data.consent = data.consent === 'on' || data.consent === 'true';
  } else {
    try {
      data = JSON.parse(raw);
    } catch {
      return fail(400, 'Invalid JSON');
    }
  }
  // JSON can be null, an array or a number. Only an object has fields to read.
  if (!data || typeof data !== 'object' || Array.isArray(data)) return fail(400, 'Invalid request');

  // Honeypot: bots fill hidden fields. Pretend success.
  if (data.website) return succeed(200);

  // Fields must be strings. String({}) would otherwise store "[object Object]".
  if (typeof data.name !== 'string') return fail(400, 'Please enter your name.');
  if (typeof data.email !== 'string') return fail(400, 'Please enter a valid email address.');

  const name = cleanName(data.name);
  const email = data.email.trim();

  if (!name || name.length > MAX_NAME) return fail(400, 'Please enter your name, up to 100 characters.');
  // Length first, so the pattern never runs on a huge string.
  if (email.length > MAX_EMAIL || /[\u0000-\u001f\u007f-\u009f]/.test(email) || !EMAIL_RE.test(email)) {
    return fail(400, 'Please enter a valid email address.');
  }
  if (data.consent !== true) return fail(400, 'Consent is required.');

  // Duplicates are silently ignored so the endpoint doesn't reveal who has signed.
  try {
    await withDb(env, ctx, (db) =>
      db.query(
        `INSERT INTO signatures (name, email, consent)
         VALUES ($1, $2, TRUE)
         ON CONFLICT (lower(email)) DO NOTHING`,
        [name, email]
      )
    );
  } catch (err) {
    console.error('Sign error', err);
    return fail(500, 'Something went wrong on our side. Please try again in a minute.');
  }

  return succeed(201);
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
