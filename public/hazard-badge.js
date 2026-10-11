/* Certification badge for a perfect hazard test.
   hazard.js imports this module when a test ends and calls result(). On a perfect run
   it reveals the test's certificate in the result panel: the badge, an optional name,
   and Share / Save the image / Copy link. Below a perfect run it adds one line saying
   what a perfect run earns.

   Everything stays on the device: the name is never sent anywhere or stored. The badge
   is the master SVG from badges/, filled in and placed inline (so the seal can stamp
   down). The PNG is a copy of it, drawn onto a canvas through a data: image.

   Adding a test: add one entry to BADGES, keyed by the test page's file name, and put
   its master in badges/. A master's <text> fields have the ids f-name, f-date, f-number
   and f-site, with data-max-width, data-max-size and data-min-size; f-name also has
   data-default, the words used when nobody types a name. */

const BADGES = {
  'hazard-customer': {
    name: 'full licence',
    master: 'badges/customer-square.svg',
    file: 'dont-queue-full-licence.png',
    share: 'Full licence. 5/5 on the bar hazard perception test. I may approach any bar in the land.',
    alt: "Certificate: full licence. You may approach any bar in the land. Holder: {name}. Issued {date}. Licence no. {number}. Stamped 5 out of 5, Don't Queue At The Bar hazard perception. Not valid as ID.",
  },
  'hazard-barperson': {
    name: 'landlord material',
    master: 'badges/barperson-square.svg',
    file: 'dont-queue-landlord-material.png',
    share: 'Landlord material. 5/5 on the barperson hazard perception test. Nobody queues on my watch.',
    alt: "Certificate: landlord material. You serve them in order. Nobody queues. Holder: {name}. Issued {date}. Licence no. {number}. Stamped 5 out of 5, Don't Queue At The Bar hazard perception. Not valid as ID.",
  },
};

// Below a perfect run, one line where the certificate would be.
const COUNT = ['none', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const nudge = (n) => `Get all ${COUNT[n] || n} and we'll put it in writing. With a stamp.`;

const MAX_NAME = 24;
const SIZE = 1080;
const ID_PREFIX = 'aw-'; // the badge's ids, prefixed so they can't clash with the page's
const FIELDS = ['f-name', 'f-date', 'f-number', 'f-site'];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// The test is named by its page: /hazard-customer.html, or /hazard-customer on Cloudflare.
const testKey = () => (location.pathname.split('/').filter(Boolean).pop() || '').replace(/\.html$/, '');

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};

const fill = (template, values) => template.replace(/\{(\w+)\}/g, (_, k) => values[k] ?? '');

// What someone types, made safe for an XML text node: no control characters, lone
// surrogates or non-characters (any of them makes the SVG invalid), single spaces, and a
// length cap. The markup characters (<, &, quotes) are escaped by XMLSerializer: the name
// only ever goes in through textContent, never into markup. With the u flag a proper
// surrogate pair is one character, so only lone surrogates match.
const NOT_XML = /[\x00-\x1F\x7F-\x9F\uD800-\uDFFF\u{FFFE}\u{FFFF}]/gu;
function cleanName(raw) {
  const s = String(raw || '').replace(NOT_XML, '').replace(/\s+/g, ' ').trim();
  return Array.from(s).slice(0, MAX_NAME).join('').trim();
}

const graphemes = (s) =>
  'Segmenter' in Intl
    ? Array.from(new Intl.Segmenter('en-GB', { granularity: 'grapheme' }).segment(s), (g) => g.segment)
    : Array.from(s);

// DQ-1000 to DQ-9999, once per award.
function licenceNumber() {
  const n = new Uint16Array(1);
  crypto.getRandomValues(n);
  return `DQ-${1000 + (n[0] % 9000)}`;
}

const today = () => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date());

// The domain on the badge: this site's, once it's on its own domain; otherwise the
// master's (on localhost, an IP, or the workers.dev preview host).
function siteHost() {
  const h = location.hostname.replace(/^www\./, '');
  if (!h || h === 'localhost' || /^[\d.:]+$/.test(h) || h.endsWith('.workers.dev')) return null;
  return h;
}

function loadStyles() {
  const href = new URL('hazard-badge.css', import.meta.url).href;
  if (document.querySelector(`link[href="${href}"]`)) return Promise.resolve();
  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = link.onerror = () => resolve();
    document.head.append(link);
  });
}

function loadMaster(path) {
  return fetch(new URL(path, import.meta.url))
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.text();
    })
    .then((text) => {
      const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
      const svg = doc.documentElement;
      if (doc.querySelector('parsererror') || svg.localName !== 'svg') throw new Error('not a valid SVG');
      return document.importNode(svg, true);
    });
}

// Ready a master for the page: prefix its ids, and swap its built-in title for our label.
function adopt(svg) {
  svg.querySelectorAll('title, desc').forEach((n) => n.remove());
  svg.querySelectorAll('[id]').forEach((n) => (n.id = ID_PREFIX + n.id));
  svg.removeAttribute('aria-labelledby');
  svg.setAttribute('role', 'img');
  svg.setAttribute('focusable', 'false');
  return svg;
}

const field = (svg, id) => svg.querySelector(`#${ID_PREFIX}${id}`);

/* Fit one field, measured by the same SVG engine that draws it (the inline badge): start
   at data-max-size, shrink towards data-min-size until it fits data-max-width, then cut
   it with an ellipsis. Never squash, letter-space or change case. Returns the text as drawn. */
function fitText(node, text) {
  node.textContent = text;
  const max = parseFloat(node.getAttribute('data-max-width'));
  if (!max) return text;
  const base = parseFloat(node.getAttribute('data-max-size')) || parseFloat(node.getAttribute('font-size')) || 16;
  const min = Math.min(base, parseFloat(node.getAttribute('data-min-size')) || base);
  const setSize = (px) => node.setAttribute('font-size', String(px));
  const width = () => node.getComputedTextLength();
  setSize(base);

  let w = width();
  if (w <= max) return text;
  // Width scales with size (near enough), so jump straight there, then nudge down.
  let size = Math.max(min, Math.floor((base * max * 10) / w) / 10);
  setSize(size);
  w = width();
  while (w > max && size > min) {
    size = Math.max(min, Math.round((size - 0.5) * 10) / 10);
    setSize(size);
    w = width();
  }
  if (w <= max) return text;

  // Still too wide at the smallest size: keep as many characters as fit, then an ellipsis.
  const g = graphemes(text);
  const cut = (k) => `${g.slice(0, k).join('').trimEnd()}…`;
  let lo = 0;
  let hi = g.length - 1;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    node.textContent = cut(mid);
    if (width() <= max) lo = mid;
    else hi = mid - 1;
  }
  node.textContent = cut(lo);
  return node.textContent;
}

// The export: a copy of the inline badge as a data: image (CSP allows data:, not blob:,
// in images), drawn at full size. Page CSS (the reveal) doesn't travel with it.
function toPng(svg) {
  const copy = svg.cloneNode(true);
  copy.setAttribute('width', SIZE);
  copy.setAttribute('height', SIZE);
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(copy))}`;
  return img.decode().then(() => {
    const canvas = document.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, SIZE, SIZE);
    return new Promise((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png')
    );
  });
}

// Share sheets that take image files: phones, mostly.
function canShareFiles() {
  if (!navigator.share || !navigator.canShare || typeof File !== 'function') return false;
  try {
    return navigator.canShare({ files: [new File([new Uint8Array(1)], 'x.png', { type: 'image/png' })] });
  } catch {
    return false;
  }
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function award(panel, badge, svg) {
  const row = panel.querySelector('.hpt-actions');
  if (!row || panel.querySelector('.hpt-award')) return;

  const shareText = `${badge.share} ${location.origin}${location.pathname}`;
  const date = today();
  const number = licenceNumber();
  const site = siteHost();
  adopt(svg);
  const nobody = field(svg, 'f-name')?.getAttribute('data-default') || 'a regular';

  const box = el('section', 'hpt-award');
  box.setAttribute('aria-label', `Your certificate: ${badge.name}`);
  const live = el('p', 'sr-only');
  live.setAttribute('role', 'status');
  const frame = el('div', 'hpt-award-badge');
  frame.append(svg);

  const nameField = el('div', 'hpt-award-field');
  const label = el('label', null, 'Name on the licence ');
  label.htmlFor = 'hpt-award-name';
  label.append(el('span', 'hpt-award-opt', '(optional)'));
  const input = el('input', 'hpt-award-input');
  Object.assign(input, {
    id: 'hpt-award-name',
    type: 'text',
    maxLength: MAX_NAME,
    autocomplete: 'off',
    spellcheck: false,
    placeholder: nobody,
  });
  input.setAttribute('autocapitalize', 'words');
  input.setAttribute('enterkeyhint', 'done');
  input.setAttribute('aria-describedby', 'hpt-award-hint');
  const hint = el('p', 'hpt-award-hint', 'It stays on this device.');
  hint.id = 'hpt-award-hint';
  nameField.append(label, input, hint);

  // One amber button: Share where the device can share the image, otherwise Save.
  const actions = el('div', 'hpt-award-actions');
  const button = (cls, text) => {
    const b = el('button', cls, text);
    b.type = 'button';
    return b;
  };
  const sharing = canShareFiles();
  const shareBtn = button('hpt-again', 'Share your licence');
  const saveBtn = button(sharing ? 'hpt-award-btn' : 'hpt-again', 'Save the image');
  const copyBtn = button('hpt-award-btn', 'Copy link');
  if (sharing) actions.append(shareBtn);
  actions.append(saveBtn, copyBtn);
  const primary = sharing ? shareBtn : saveBtn;

  const msg = el('p', 'hpt-award-msg');
  msg.setAttribute('role', 'status');

  box.append(live, frame, nameField, actions, msg);
  // Straight after "Flawless…", so "Every go deals a fresh hand" stays with "Take it again".
  const fresh = row.previousElementSibling;
  (fresh && fresh.classList.contains('hpt-intro') && fresh.previousElementSibling ? fresh : row).before(box);
  // The One Amber Rule: on a perfect run "Take it again" steps down to an outline.
  const again = row.querySelector('.hpt-again');
  again?.classList.add('hpt-award-quiet');

  // Filling in: the badge updates as you type; the PNG follows, so it's ready when Share
  // is pressed (a share sheet only opens straight from a tap).
  let current = { key: null, png: null, pending: null };
  let timer = 0;

  const refresh = () => {
    if (!box.isConnected) return current.pending;
    // Typed apostrophes are curled on the badge, to match the default ("whoever’s").
    const name = cleanName(input.value).replace(/'/g, '’') || nobody;
    const values = { 'f-name': name, 'f-date': date, 'f-number': number, 'f-site': site };
    const key = JSON.stringify(values);
    if (current.key === key) return current.pending;
    const shown = {};
    FIELDS.forEach((id) => {
      const node = field(svg, id);
      if (node && values[id] != null) shown[id] = fitText(node, values[id]);
    });
    svg.setAttribute('aria-label', fill(badge.alt, { name: shown['f-name'] || name, date, number }));
    const pending = toPng(svg).then((png) => {
      if (current.key === key) current.png = png;
      return png;
    });
    pending.catch((err) => console.warn(`HazardTest: could not draw the certificate (${err.message})`));
    current = { key, png: null, pending };
    return pending;
  };

  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(refresh, 120);
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') input.blur();
  });

  const say = (text) => {
    msg.textContent = '';
    requestAnimationFrame(() => (msg.textContent = text));
  };

  shareBtn.addEventListener('click', async () => {
    clearTimeout(timer);
    refresh();
    if (!current.png) {
      // Pressed mid-redraw: the share sheet needs a fresh tap once the PNG is ready.
      say('One moment. Stamping it.');
      try {
        await current.pending;
        say('Ready. Press Share again.');
      } catch {
        say("Couldn't make the image. Try Save the image.");
      }
      return;
    }
    const file = new File([current.png], badge.file, { type: 'image/png' });
    try {
      await navigator.share({ files: [file], title: "Don't Queue At The Bar", text: shareText });
      msg.textContent = '';
    } catch (err) {
      if (err.name !== 'AbortError') say("Couldn't open the share sheet. Try Save the image.");
    }
  });

  saveBtn.addEventListener('click', async () => {
    clearTimeout(timer);
    let blob;
    try {
      blob = await refresh();
    } catch {
      return say("Couldn't make the image. Try again.");
    }
    const url = URL.createObjectURL(blob);
    const a = el('a');
    a.href = url;
    a.download = badge.file;
    a.hidden = true;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    say('Saved. Frame it.');
  });

  copyBtn.addEventListener('click', async () => {
    say((await copyText(shareText)) ? 'Link copied. Send it to someone who queues.' : `Copy this: ${shareText}`);
  });

  refresh();
  // A beat after the region exists, or screen readers may miss it.
  setTimeout(() => (live.textContent = `Certificate awarded: ${badge.name}.`), 150);

  // The reveal plays once, the first time the badge is half on screen (in portrait it
  // lands below the clip). Until then it waits on its first frame, hidden.
  // Focus moves to the main action then, unless the visitor has already moved it.
  const reveal = () => {
    box.classList.remove('is-waiting');
    if (document.activeElement === again || document.activeElement === document.body) {
      primary.focus({ preventScroll: true });
    }
  };
  if (reduceMotion || !('IntersectionObserver' in window)) return reveal();
  box.classList.add('is-new', 'is-waiting');
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting) || !box.isConnected) return;
      io.disconnect();
      reveal();
    },
    { threshold: 0.5 }
  );
  io.observe(frame);
}

export function result({ root, panel, score, n }) {
  const badge = BADGES[testKey()];
  const row = panel.querySelector('.hpt-actions');
  if (!badge || !row || root.dataset.state !== 'done') return;

  if (score !== n || n === 0) {
    row.before(el('p', 'hpt-intro', nudge(n)));
    return;
  }

  // Never show a certificate on a run that a retake has already replaced.
  const still = () => root.dataset.state === 'done' && row.isConnected;
  Promise.all([loadStyles(), loadMaster(badge.master)])
    .then(([, svg]) => still() && award(panel, badge, svg))
    .catch((err) => console.warn(`HazardTest: no certificate for ${testKey()} (${err.message})`));
}
