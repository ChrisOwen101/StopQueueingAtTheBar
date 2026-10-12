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

// A bare HTML page for visitors who post a form without JavaScript (the form's plain
// action). Same colour blocks and headers as the rest of the site, no scripts.
const htmlPage = (status, tone, title, text, back = '/#petition-section') =>
  new Response(
    `<!doctype html><html lang="en-GB"><head><meta charset="utf-8">` +
      `<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">` +
      `<title>${title} - Don't Queue At The Bar</title><link rel="stylesheet" href="/styles.css"></head>` +
      `<body><main><section class="screen ${tone}"><div class="inner"><h1 class="big">${title}</h1>` +
      `<p class="mid">${text}</p><a class="cta" href="${back}">Back to the site</a>` +
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

/* ---------- Poll: the single file, for or against ----------
   Results only go to people who have voted: in the answer to a vote, or to a browser holding
   the voter cookie. Three layers keep the numbers honest:
   1. One vote per browser. The cookie holds a random voter id (UNIQUE in poll_votes).
   2. A daily cap per network (an IPv4 address or an IPv6 /64). A pub's wifi or a phone network
      can put many people behind one address, so the cap is generous.
   3. The POLL_LIMITER binding (wrangler.jsonc) turns away bursts before the database. */

const POLL_CHOICES = ['single', 'cluster']; // for the single file, against it
const POLL_COOKIE = 'dq_poll';
const POLL_MAX_BODY = 256; // {"choice":"cluster"} is 20 bytes
const POLL_VOTES_PER_NETWORK_PER_DAY = 20;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const POLL_COOKIE_RE = new RegExp(`(?:^|;\\s*)${POLL_COOKIE}=([^;]*)`);

const readVoter = (request) => {
  const m = (request.headers.get('Cookie') || '').match(POLL_COOKIE_RE);
  return m && UUID_RE.test(m[1]) ? m[1].toLowerCase() : null;
};

const voterCookie = (voter) =>
  `${POLL_COOKIE}=${voter}; Path=/api/poll; Max-Age=31536000; HttpOnly; Secure; SameSite=Strict`;

// The network a request comes from: an IPv4 address, or the /64 an IPv6 address sits in
// (one home or phone gets a whole /64 and can pick a new address in it at will).
function networkOf(ip) {
  if (!ip.includes(':')) return ip;
  if (ip.includes('.')) return ip.slice(ip.lastIndexOf(':') + 1); // IPv4-mapped, ::ffff:1.2.3.4
  const [head, tail] = ip.toLowerCase().split('::');
  const h = head ? head.split(':') : [];
  const t = tail ? tail.split(':') : [];
  const groups = tail === undefined ? h : [...h, ...Array(Math.max(0, 8 - h.length - t.length)).fill('0'), ...t];
  return `${groups.slice(0, 4).map((g) => parseInt(g, 16).toString(16)).join(':')}::/64`;
}

// What poll_limits stores instead of the address: a hash of the secret, the day and the network.
// The day in the hash means yesterday's rows can't be matched to today's.
async function networkKey(env, day, network) {
  const secret = env.POLL_SECRET || 'dont-queue-at-the-bar'; // set POLL_SECRET (see AGENTS.md)
  const bytes = new TextEncoder().encode(`${secret}|${day}|${network}`);
  const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  return Array.from(hash, (b) => b.toString(16).padStart(2, '0')).join('');
}

const tallyOf = (row) => ({ single: row.single, cluster: row.cluster });

// This voter's choice and the totals, or no row if they haven't voted. Hyperdrive caches read
// queries for up to a minute. Keyed on the voter, a cached answer always includes their own vote.
const VOTER_SQL = `
  SELECT v.choice, t.single, t.cluster
  FROM poll_votes v,
       (SELECT count(*) FILTER (WHERE choice = 'single')::int  AS single,
               count(*) FILTER (WHERE choice = 'cluster')::int AS cluster
        FROM poll_votes) t
  WHERE v.voter = $1`;

// Counts a vote against the network's daily allowance. Returns a row while there is room left.
const LIMIT_SQL = `
  INSERT INTO poll_limits (key, day, votes) VALUES ($1, $2, 1)
  ON CONFLICT (key) DO UPDATE SET votes = poll_limits.votes + 1
  WHERE poll_limits.votes < $3
  RETURNING votes`;

// Stores a vote and returns the totals including it. The WITH runs on the statement's snapshot,
// which can't see the new row, so it is added back from RETURNING.
const VOTE_SQL = `
  WITH ins AS (INSERT INTO poll_votes (choice, voter) VALUES ($1, $2) RETURNING choice)
  SELECT count(*) FILTER (WHERE choice = 'single')::int  AS single,
         count(*) FILTER (WHERE choice = 'cluster')::int AS cluster
  FROM (SELECT choice FROM poll_votes UNION ALL SELECT choice FROM ins) v`;

async function handlePoll(request, env, ctx) {
  const voter = readVoter(request);

  if (request.method === 'GET') {
    // No cookie, no vote, no numbers.
    if (!voter) return json({ voted: false });
    const row = await withDb(env, ctx, async (db) => (await db.query(VOTER_SQL, [voter])).rows[0]);
    return json(row ? { voted: true, choice: row.choice, results: tallyOf(row) } : { voted: false });
  }

  const type = (request.headers.get('Content-Type') || '').toLowerCase();
  // The buttons post as a form when JavaScript is off or has failed, and as JSON otherwise.
  const isForm = type.includes('application/x-www-form-urlencoded');

  const fail = (status, message) =>
    isForm ? htmlPage(status, 'c-red', 'That did not work', message, '/#poll') : json({ error: message }, status);

  const answer = (status, { choice, results, already }, cookie) => {
    let res;
    if (isForm) {
      const total = results.single + results.cluster;
      const forPc = total ? Math.round((results.single / total) * 100) : 0;
      res = htmlPage(
        200,
        'c-cream',
        already ? 'You’ve already voted.' : 'Vote counted.',
        `For the single file: ${forPc}%. Against: ${total ? 100 - forPc : 0}%.<br>` +
          `${total.toLocaleString('en-GB')} ${total === 1 ? 'vote' : 'votes'} so far.`,
        '/#poll'
      );
    } else {
      res = json({ voted: true, choice, results }, status);
    }
    if (cookie) res.headers.append('Set-Cookie', cookie);
    return res;
  };

  // Only accept votes from our own site.
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return fail(403, 'Forbidden');

  if (Number(request.headers.get('Content-Length')) > POLL_MAX_BODY) return fail(413, 'That was too much to send.');
  const raw = await request.text();
  if (raw.length > POLL_MAX_BODY) return fail(413, 'That was too much to send.');

  let choice;
  if (isForm) {
    choice = new URLSearchParams(raw).get('choice');
  } else {
    try {
      choice = JSON.parse(raw)?.choice;
    } catch {
      return fail(400, 'Invalid JSON');
    }
  }
  if (!POLL_CHOICES.includes(choice)) return fail(400, 'Pick for or against.');

  const network = networkOf(request.headers.get('CF-Connecting-IP') || '');
  if (env.POLL_LIMITER) {
    const { success } = await env.POLL_LIMITER.limit({ key: network });
    if (!success) return fail(429, 'Steady on. Try again in a minute.');
  }

  const day = new Date().toISOString().slice(0, 10); // UTC, so every Worker agrees on the day
  const key = await networkKey(env, day, network);

  let outcome;
  try {
    outcome = await withDb(env, ctx, async (db) => {
      // Voted before: their vote stands and they get the results again.
      if (voter) {
        const { rows } = await db.query(VOTER_SQL, [voter]);
        if (rows[0]) return { choice: rows[0].choice, results: tallyOf(rows[0]), already: true };
      }
      // Past days' keys can never match again (the day is in the hash), so clear them out.
      await db.query('DELETE FROM poll_limits WHERE day < $1', [day]);
      const allowed = await db.query(LIMIT_SQL, [key, day, POLL_VOTES_PER_NETWORK_PER_DAY]);
      if (!allowed.rowCount) return { capped: true };

      const id = crypto.randomUUID();
      const { rows } = await db.query(VOTE_SQL, [choice, id]);
      return { choice, results: tallyOf(rows[0]), id };
    });
  } catch (err) {
    console.error('Poll error', err);
    return fail(500, 'Something went wrong on our side. Please try again in a minute.');
  }

  if (outcome.capped) return fail(429, 'That’s plenty of votes from your connection today. Try again tomorrow.');
  return answer(outcome.already ? 200 : 201, outcome, outcome.id && voterCookie(outcome.id));
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
      if (pathname === '/api/poll') {
        if (request.method !== 'GET' && request.method !== 'POST') {
          return json({ error: 'Method not allowed' }, 405, { Allow: 'GET, POST' });
        }
        return await handlePoll(request, env, ctx);
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
