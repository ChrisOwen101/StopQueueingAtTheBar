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
// action). Same colour blocks and headers as the rest of the site, no scripts. `figure` is
// extra markup between the title and the text (the poll's chart).
const htmlPage = (status, tone, title, text, { back = '/#petition-section', label = 'Back to the site', figure = '' } = {}) =>
  new Response(
    `<!doctype html><html lang="en-GB"><head><meta charset="utf-8">` +
      `<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">` +
      `<title>${title} - Don't Queue At The Bar</title><link rel="stylesheet" href="/styles.css"></head>` +
      `<body><main><section class="screen ${tone}"><div class="inner"><h1 class="big">${title}</h1>${figure}` +
      (text ? `<p class="mid">${text}</p>` : '') +
      `<a class="cta" href="${back}">${label}</a>` +
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

/* ---------- Poll: stop the single file, for or against ----------
   Results only go to people who have voted: in the answer to a vote, or to a browser holding
   the voter cookie. What keeps the numbers honest:
   1. One vote per browser. The cookie holds a random voter id (UNIQUE in poll_votes). Voting
      again with it changes that vote, so it never adds one.
   2. Daily caps per network: an IPv4 address or an IPv6 /64, plus each IPv6 /48 (one person can
      hold a /48 and hop between its 65,536 /64s). A pub's wifi or a phone network can put many
      people behind one address, so the caps are generous, and a vote over them still gets to
      see the tally. Turnstile is the next step if scripts get through.
   3. The POLL_LIMITER binding (wrangler.jsonc) turns away bursts before the database.
   The Origin check only stops other websites posting votes on their visitors' behalf. */

const POLL_CHOICES = ['cluster', 'single']; // for stopping the single file, against it
const POLL_COOKIE = 'dq_poll';
const POLL_MAX_BODY = 256; // {"choice":"cluster"} is 20 bytes
const POLL_VOTES_PER_NETWORK_PER_DAY = 20; // per IPv4 address or IPv6 /64
const POLL_VOTES_PER_IPV6_48_PER_DAY = 200;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const POLL_COOKIE_RE = new RegExp(`(?:^|;\\s*)${POLL_COOKIE}=([^;]*)`);

const readVoter = (request) => {
  const m = (request.headers.get('Cookie') || '').match(POLL_COOKIE_RE);
  return m && UUID_RE.test(m[1]) ? m[1].toLowerCase() : null;
};

const voterCookie = (voter) =>
  `${POLL_COOKIE}=${voter}; Path=/api/poll; Max-Age=31536000; HttpOnly; Secure; SameSite=Strict`;

// The networks a request comes from, each with its daily allowance. The first one also keys
// the burst limiter.
function networksOf(ip) {
  if (!ip.includes(':')) return [[ip, POLL_VOTES_PER_NETWORK_PER_DAY]];
  if (ip.includes('.')) return [[ip.slice(ip.lastIndexOf(':') + 1), POLL_VOTES_PER_NETWORK_PER_DAY]]; // ::ffff:1.2.3.4
  const [head, tail] = ip.toLowerCase().split('::');
  const h = head ? head.split(':') : [];
  const t = tail ? tail.split(':') : [];
  const groups = tail === undefined ? h : [...h, ...Array(Math.max(0, 8 - h.length - t.length)).fill('0'), ...t];
  const hex = groups.map((g) => parseInt(g, 16).toString(16));
  return [
    [`${hex.slice(0, 4).join(':')}::/64`, POLL_VOTES_PER_NETWORK_PER_DAY],
    [`${hex.slice(0, 3).join(':')}::/48`, POLL_VOTES_PER_IPV6_48_PER_DAY],
  ];
}

// What poll_limits stores instead of the address: a hash of POLL_SECRET, the day and the
// network. The day in the hash means yesterday's rows can't be matched to today's.
async function networkKey(secret, day, network) {
  const bytes = new TextEncoder().encode(`${secret}|${day}|${network}`);
  const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  return Array.from(hash, (b) => b.toString(16).padStart(2, '0')).join('');
}

const tallyOf = (row) => ({ single: row.single, cluster: row.cluster });

const votesText = (n) => `${n.toLocaleString('en-GB')} ${n === 1 ? 'vote' : 'votes'}`;

// The words around the results. public/script.js has the same lines for the page itself;
// keep the two in step. `status` is how the vote went (see handlePoll).
function pollWords({ single, cluster }, choice, status) {
  const total = single + cluster;
  let lead = 'Dead heat. Over to the barperson.';
  if (total < 50) lead = 'Early days. The jury’s still at the bar.';
  else if (cluster > single) lead = 'The Cluster is winning.';
  else if (single > cluster) lead = 'The Single File is ahead. We have work to do.';
  const quip =
    status === 'capped'
      ? 'Your connection has had its fill of votes today, so this one didn’t count. Here’s the tally anyway.'
      : status === 'missing'
        ? 'We couldn’t find your first vote, so nothing changed.'
        : choice === 'cluster'
          ? 'You said for. Correct. Now make it official.'
          : 'You said against. Noted. Take the hazard perception test, then we’ll talk.';
  const next =
    choice === 'cluster'
      ? { back: '/#petition-section', label: 'Sign the petition' }
      : { back: '/hazard.html', label: 'Take the test →' };
  return { lead, quip, next, total: `${votesText(total)} so far. Self\u2011selecting and unscientific, like every pub argument.` };
}

// The results chart for the no-JavaScript page: the same markup as the one in
// public/index.html (filled in by script.js there), drawn here with the numbers in.
// `mine` is the side to stamp "your vote", if any.
function pollChart({ single, cluster }, mine) {
  const total = single + cluster;
  const forPc = total ? Math.round((cluster / total) * 100) : 0; // for stopping it; whole numbers that add up to 100
  const row = (key, label, pc, n) =>
    `<li class="poll-row" data-choice="${key}"><span class="poll-label">${label}` +
    (key === mine ? ' <span class="poll-you"><span class="sr-only">, </span>your vote</span>' : '') +
    `</span><span class="poll-plot" aria-hidden="true"><span class="poll-fill" style="--v:${pc / 100}"></span></span>` +
    `<span class="poll-fig"><b class="poll-pc">${pc}%</b> <span class="poll-n">${votesText(n)}</span></span></li>`;
  return (
    `<figure class="poll-chart"><ul class="poll-bars">` +
    row('cluster', 'For', forPc, cluster) +
    row('single', 'Against', total ? 100 - forPc : 0, single) +
    `</ul><div class="poll-axis" aria-hidden="true"><span>0%</span><span>50%</span><span>100%</span></div>` +
    `</figure>`
  );
}

// Totals counted the same way everywhere.
const TOTALS = `
  count(*) FILTER (WHERE choice = 'single')::int  AS single,
  count(*) FILTER (WHERE choice = 'cluster')::int AS cluster`;

// This voter's choice and the totals, or no row if they haven't voted. Hyperdrive caches read
// queries for up to a minute. Keyed on the voter, a cached answer always includes their own
// vote, and changing a vote gives the voter a new id, so it never shows the old one.
const VOTER_SQL = `
  SELECT v.choice, t.single, t.cluster
  FROM poll_votes v, (SELECT ${TOTALS} FROM poll_votes) t
  WHERE v.voter = $1`;

// Everyone's totals, for a vote that wasn't counted (cached for up to a minute, fine there).
const TOTALS_SQL = `SELECT ${TOTALS} FROM poll_votes`;

// Counts a vote against a network's daily allowance. Returns a row while there is room left.
const LIMIT_SQL = `
  INSERT INTO poll_limits (key, day, votes) VALUES ($1, $2, 1)
  ON CONFLICT (key) DO UPDATE SET votes = poll_limits.votes + 1
  WHERE poll_limits.votes < $3
  RETURNING votes`;

// Stores a vote and returns the totals including it. The WITH runs on the statement's snapshot,
// which can't see the new row, so it is added back from RETURNING.
const VOTE_SQL = `
  WITH ins AS (INSERT INTO poll_votes (choice, voter) VALUES ($1, $2) RETURNING choice)
  SELECT ${TOTALS} FROM (SELECT choice FROM poll_votes UNION ALL SELECT choice FROM ins) v`;

// Changes a vote (and its voter id) and returns the totals with the change. As above, the
// snapshot still has the old row, so it is swapped for the new one from RETURNING.
const CHANGE_SQL = `
  WITH upd AS (UPDATE poll_votes SET choice = $1, voter = $3 WHERE voter = $2 RETURNING choice)
  SELECT ${TOTALS}
  FROM (SELECT choice FROM poll_votes WHERE voter <> $2 UNION ALL SELECT choice FROM upd) v`;

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
    isForm
      ? htmlPage(status, 'c-red', 'That did not work', message, { back: '/#poll' })
      : json({ error: message }, status);

  // How a vote went: new, same (voted that way already), changed, or not counted: capped (over
  // a daily cap) or missing (a change with no vote on record).
  const TITLES = {
    new: 'Vote counted.',
    same: 'You’ve already voted.',
    changed: 'Vote changed.',
    capped: 'That one didn’t count.',
    missing: 'Nothing changed.',
  };

  const answer = ({ status, choice, results, id }) => {
    const counted = status !== 'capped' && status !== 'missing';
    let res;
    if (isForm) {
      const words = pollWords(results, choice, status);
      res = htmlPage(200, 'c-cream', TITLES[status], '', {
        ...words.next,
        figure:
          `<div class="poll-results"><p class="poll-head">${words.lead}</p>` +
          pollChart(results, counted ? choice : null) +
          `<p class="poll-total">${words.total}</p><p class="poll-quip">${words.quip}</p></div>`,
      });
    } else {
      res = json(
        counted ? { voted: true, choice, results } : { voted: false, [status]: true, choice, results },
        status === 'new' ? 201 : 200
      );
    }
    if (id) res.headers.append('Set-Cookie', voterCookie(id));
    return res;
  };

  // Only accept votes posted from our own site.
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return fail(403, 'Forbidden');

  if (Number(request.headers.get('Content-Length')) > POLL_MAX_BODY) return fail(413, 'That was too much to send.');
  const raw = await request.text();
  if (raw.length > POLL_MAX_BODY) return fail(413, 'That was too much to send.');

  let choice;
  let change = false; // sent from the "Changed your mind?" buttons
  if (isForm) {
    choice = new URLSearchParams(raw).get('choice');
  } else {
    try {
      const data = JSON.parse(raw);
      choice = data?.choice;
      change = data?.change === true;
    } catch {
      return fail(400, 'Invalid JSON');
    }
  }
  if (!POLL_CHOICES.includes(choice)) return fail(400, 'Pick for or against.');

  // Without the secret the stored hashes could be turned back into addresses, so no votes.
  if (!env.POLL_SECRET) {
    console.error('POLL_SECRET is not set: run `npx wrangler secret put POLL_SECRET` (see AGENTS.md)');
    return fail(503, 'The poll isn’t open yet. Try again later.');
  }

  const networks = networksOf(request.headers.get('CF-Connecting-IP') || '');
  if (env.POLL_LIMITER) {
    const { success } = await env.POLL_LIMITER.limit({ key: networks[0][0] });
    if (!success) return fail(429, 'Steady on. Lots of votes from your connection just now. Try again in a minute.');
  }

  const day = new Date().toISOString().slice(0, 10); // UTC, so every Worker agrees on the day

  let outcome;
  try {
    outcome = await withDb(env, ctx, async (db) => {
      // Voted before: the same answer just gets the results again; a new one changes the vote.
      // Neither touches the daily allowance, since neither adds a vote.
      if (voter) {
        const { rows } = await db.query(VOTER_SQL, [voter]);
        if (rows[0]?.choice === choice) return { status: 'same', choice, results: tallyOf(rows[0]) };
        if (rows[0]) {
          const id = crypto.randomUUID();
          const changed = await db.query(CHANGE_SQL, [choice, voter, id]);
          return { status: 'changed', choice, results: tallyOf(changed.rows[0]), id };
        }
      }
      // A change with no vote on record (cookies blocked, or the reply to an earlier change was
      // lost after the id rotated) must not quietly become a second vote.
      if (change) {
        const { rows } = await db.query(TOTALS_SQL);
        return { status: 'missing', choice, results: tallyOf(rows[0]) };
      }

      for (const [network, allowance] of networks) {
        const key = await networkKey(env.POLL_SECRET, day, network);
        const allowed = await db.query(LIMIT_SQL, [key, day, allowance]);
        if (!allowed.rowCount) {
          console.warn('Poll vote over the daily cap'); // a count of these says whether the caps bite
          const { rows } = await db.query(TOTALS_SQL);
          return { status: 'capped', choice, results: tallyOf(rows[0]) };
        }
      }

      const id = crypto.randomUUID();
      const { rows } = await db.query(VOTE_SQL, [choice, id]);
      return { status: 'new', choice, results: tallyOf(rows[0]), id };
    });
  } catch (err) {
    console.error('Poll error', err);
    return fail(500, 'Something went wrong on our side. Please try again in a minute.');
  }

  return answer(outcome);
}

// Daily (wrangler.jsonc "triggers"): past days' allowance counts can never match again, since
// the day is in the hash, so delete them rather than keep them.
async function purgePollLimits(env, ctx) {
  const day = new Date().toISOString().slice(0, 10);
  await withDb(env, ctx, (db) => db.query('DELETE FROM poll_limits WHERE day < $1', [day]));
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

  async scheduled(event, env, ctx) {
    await purgePollLimits(env, ctx);
  },
};
