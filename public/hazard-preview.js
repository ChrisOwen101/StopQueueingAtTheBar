/* Clip preview (hazard-preview.html): every clip each hazard test can deal, with its
   answer and a link that opens it in the real player (?clips=N). Unlinked and noindex.
   Nothing here is hard-coded. The tests are the a.hz-door links on the hub (hazard.html),
   in hub order. For each test page it reads the <script src> list and runs those scripts,
   minus the player (hazard.js), in a blank hidden iframe whose HazardTest.init only records
   the config. One iframe per test, one test at a time: tests can't clash, and a broken
   test shows its own error without blanking the rest. */

(() => {
  const HUB = 'hazard.html';
  const PLAYER = 'hazard.js';
  const DEFAULT_DUR = 10000; // the player's defaults (hazard.js)
  const DEFAULT_CUE = 5000;
  const LETTERS = 'ABCDEFGHIJ';
  const SCRIPT_TIMEOUT = 10000;

  const main = document.getElementById('hzp');

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  const link = (cls, text, href) => {
    const a = el('a', cls, text);
    a.href = href;
    return a;
  };

  const secs = (ms) => `${(ms / 1000).toFixed(1)} s`;
  const fileOf = (url) => new URL(url).pathname.split('/').pop();
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

  // A test page's link with ?clips= set, kept same-origin and relative to the site root.
  const clipsHref = (pageUrl, nums) => {
    const u = new URL(pageUrl);
    u.search = `?clips=${nums.join(',')}`;
    return u.pathname + u.search;
  };

  async function fetchDoc(url) {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`${fileOf(new URL(url, location.href).href)} returned HTTP ${res.status}.`);
    const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    return { doc, url: res.url || new URL(url, location.href).href };
  }

  // The tests, in hub order: every a.hz-door link on hazard.html.
  async function findTests() {
    const { doc, url } = await fetchDoc(HUB);
    const seen = new Set();
    return [...doc.querySelectorAll('a.hz-door[href]')]
      .map((a) => new URL(a.getAttribute('href'), url))
      .filter((u) => u.origin === location.origin && !seen.has(u.pathname) && seen.add(u.pathname))
      .map((u, i) => {
        u.search = '';
        u.hash = '';
        const slug = fileOf(u.href).replace(/\.html?$/, '').replace(/^hazard-/, '').replace(/[^a-z0-9-]/gi, '') || `test-${i + 1}`;
        return { url: u.href, slug, id: slug };
      });
  }

  // Run a test's scripts in a fresh blank iframe and return the config passed to HazardTest.init.
  async function captureConfig(scripts) {
    const frame = document.createElement('iframe');
    frame.hidden = true;
    frame.title = 'Clip reader';
    frame.setAttribute('aria-hidden', 'true');
    frame.tabIndex = -1;
    // A src-less iframe is ready at once in most browsers; wait for its load in case it isn't.
    const ready = new Promise((resolve) => {
      frame.addEventListener('load', resolve, { once: true });
      setTimeout(resolve, 1000);
    });
    document.body.append(frame);
    await ready;

    try {
      const win = frame.contentWindow;
      const doc = frame.contentDocument;
      const errors = [];
      let config = null;

      // The stub. If anything assigns window.HazardTest (a renamed player, a kit), keep this
      // init and take whatever else it brings, so helpers it adds still work.
      const stub = { init(root, cfg) { config = cfg; } };
      Object.defineProperty(win, 'HazardTest', {
        configurable: true,
        get: () => stub,
        set: (v) => {
          if (v && typeof v === 'object') Object.keys(v).forEach((k) => k !== 'init' && (stub[k] = v[k]));
        },
      });

      win.addEventListener('error', (e) => {
        e.preventDefault();
        errors.push((e.message || 'Script error.').replace(/^Uncaught /, ''));
      });
      win.addEventListener('unhandledrejection', (e) => {
        e.preventDefault();
        errors.push(String((e.reason && e.reason.message) || e.reason));
      });

      for (const s of scripts) {
        await new Promise((resolve, reject) => {
          const tag = doc.createElement('script');
          if (s.type) tag.type = s.type;
          const timer = setTimeout(() => reject(new Error(`${fileOf(s.src)} took too long to load.`)), SCRIPT_TIMEOUT);
          tag.onload = () => {
            clearTimeout(timer);
            resolve();
          };
          tag.onerror = () => {
            clearTimeout(timer);
            reject(new Error(`Couldn't load ${fileOf(s.src)}.`));
          };
          tag.src = s.src;
          doc.head.append(tag);
        });
      }

      // On the real page DOMContentLoaded follows the deferred scripts. Fire it for anything waiting on it.
      if (!config) {
        doc.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));
        win.dispatchEvent(new Event('load'));
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      if (!config) {
        throw new Error(errors.length
          ? `Its scripts failed before calling HazardTest.init: ${errors[0]}`
          : 'Its scripts ran but never called HazardTest.init.');
      }
      if (!Array.isArray(config.clips) || !config.clips.length) {
        throw new Error('HazardTest.init was called without any clips.');
      }

      // Read the clips out now, while the iframe still exists.
      const clips = config.clips.map((c) => ({
        dur: Number(c.dur) || DEFAULT_DUR,
        cue: Number(c.cue) || DEFAULT_CUE,
        label: String(c.label ?? ''),
        question: String(c.question ?? ''),
        options: (c.options || []).map((o) => ({ text: String(o.text ?? ''), ok: Boolean(o.ok) })),
      }));
      return { clips, errors };
    } finally {
      frame.remove();
    }
  }

  // A test page's name, its .hpt-shot count and its scripts in order, minus the player.
  async function readPage(test) {
    const { doc, url } = await fetchDoc(test.url);
    const name = doc.querySelector('.hpt-head .small')?.textContent.trim()
      || doc.title.split('·')[0].trim()
      || test.slug;
    const shots = doc.querySelectorAll('.hpt-shot').length;
    const scripts = [...doc.querySelectorAll('script[src]')]
      .filter((s) => !s.hasAttribute('nomodule') && /^(|text\/javascript|module)$/i.test(s.getAttribute('type') || ''))
      .map((s) => ({ src: new URL(s.getAttribute('src'), url).href, type: s.getAttribute('type') || '' }))
      .filter((s) => fileOf(s.src) !== PLAYER);
    return { name, shots, scripts };
  }

  // A section per test, shown at once with a status line, filled in when its pool is read.
  function section(test) {
    const sec = el('section', 'hzp-test');
    sec.id = test.id;
    sec.setAttribute('aria-labelledby', `${test.id}-h`);
    const head = el('div', 'hzp-head');
    const h = el('h2', 'hzp-h', test.slug);
    h.id = `${test.id}-h`;
    head.append(h);
    const status = el('p', 'hzp-status', 'Reading the pool…');
    status.setAttribute('role', 'status');
    sec.append(head, status);
    main.append(sec);
    return { sec, head, h, status };
  }

  function renderPool(test, parts, { name, shots, clips, errors }) {
    const n = clips.length;
    const nums = clips.map((_, i) => i + 1);
    parts.head.append(
      el('p', 'hzp-count', plural(n, 'clip', 'clips')),
      link('hzp-all', `Play all ${n} in order →`, clipsHref(test.url, nums))
    );

    const notes = [];
    if (shots !== n) {
      notes.push(`Markup and data disagree: the page has ${plural(shots, '.hpt-shot element', '.hpt-shot elements')} but its config has ${plural(n, 'clip', 'clips')}. The player needs exactly one shot per clip.`);
    }
    errors.forEach((msg) => notes.push(`Script error while reading: ${msg}`));
    notes.forEach((msg) => console.warn(`Clip preview, ${name}: ${msg}`));

    const list = el('ol', 'hzp-clips');
    clips.forEach((c, i) => {
      const item = el('li', 'hzp-clip');
      const meta = el('div', 'hzp-meta');
      meta.append(el('h3', 'hzp-no', `Clip ${i + 1}`), el('p', 'hzp-time', `${secs(c.dur)}, stops at ${secs(c.cue)}`));

      const opts = el('ol', 'hzp-opts');
      c.options.forEach((o, j) => {
        const li = el('li', o.ok ? 'ok' : null);
        const text = el('span', null, o.text);
        if (o.ok) text.append(' ', el('em', 'hzp-right', '✓ correct'));
        li.append(el('b', null, LETTERS[j] || String(j + 1)), text);
        opts.append(li);
      });

      item.append(
        meta,
        el('p', 'hzp-label', c.label),
        el('p', 'hzp-q', c.question),
        opts,
        link('hzp-go', 'Preview this clip →', clipsHref(test.url, [i + 1]))
      );
      list.append(item);
    });

    const warns = notes.map((msg) => {
      const p = el('p', 'hzp-warn', msg);
      p.setAttribute('role', 'note');
      return p;
    });
    parts.status.replaceWith(...warns, list);
  }

  function renderError(test, parts, err) {
    const p = el('p', 'hzp-error');
    p.setAttribute('role', 'alert');
    p.append(`Couldn't read this test. ${err.message} `, link('plain', 'Open the test page', new URL(test.url).pathname));
    parts.status.replaceWith(p);
    console.warn(`Clip preview: couldn't read ${fileOf(test.url)}.`, err);
  }

  async function run() {
    const nojs = main.querySelector('.hzp-nojs');
    if (nojs) nojs.remove();

    let tests;
    try {
      tests = await findTests();
      if (!tests.length) throw new Error(`Found no test links (a.hz-door) on ${HUB}.`);
    } catch (err) {
      const p = el('p', 'hzp-error', `Couldn't find the tests. ${err.message}`);
      p.setAttribute('role', 'alert');
      main.append(p);
      console.warn('Clip preview:', err);
      return;
    }

    // Jump links, then every section up front so the page settles its order at once.
    const jump = el('ul', 'hzp-jump');
    jump.setAttribute('aria-label', 'Tests on this page');
    main.querySelector('.hzp-intro').append(jump);
    const all = tests.map((test) => {
      const parts = section(test);
      const a = link(null, parts.h.textContent, `#${test.id}`);
      const li = el('li');
      li.append(a);
      jump.append(li);
      return { test, parts, a };
    });

    // One test at a time, each in its own iframe.
    for (const { test, parts, a } of all) {
      try {
        const page = await readPage(test);
        parts.h.textContent = page.name;
        a.textContent = page.name;
        if (!page.scripts.length) throw new Error('The page has no test scripts to read.');
        renderPool(test, parts, { ...page, ...(await captureConfig(page.scripts)) });
      } catch (err) {
        renderError(test, parts, err);
      }
    }
  }

  run();
})();
