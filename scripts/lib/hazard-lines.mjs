// Loads public/hazard.js and each public/hazard-*.js test in a sandbox and returns
// every line and sound the player can play, using the player's own
// HazardTest.spokenLines and HazardTest.soundNames, plus what role each line plays.
// Also how lines are directed (scripts/directions.json) and the ElevenLabs calls.

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const PUBLIC = path.join(ROOT, 'public');

// A stand-in for DOM objects: any property, call or iteration quietly does nothing,
// so test files that decorate their page at load time still run here.
function inert() {
  const proxy = new Proxy(function () {}, {
    get(_t, prop) {
      if (prop === Symbol.iterator) return function* () {};
      if (prop === Symbol.toPrimitive) return () => '';
      if (prop === 'length') return 0;
      if (prop === 'then') return undefined;
      return proxy;
    },
    apply: () => proxy,
    construct: () => proxy,
    set: () => true,
  });
  return proxy;
}

function sandbox() {
  const noop = () => 0;
  const ctx = {
    console: { ...console, log: noop, info: noop, warn: noop },
    window: { matchMedia: () => ({ matches: false }) },
    document: inert(),
    performance: { now: () => 0 },
    getComputedStyle: inert(),
    requestAnimationFrame: noop,
    cancelAnimationFrame: noop,
    setTimeout: noop,
    clearTimeout: noop,
    setInterval: noop,
    clearInterval: noop,
    Math,
  };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(PUBLIC, 'hazard.js'), 'utf8'), ctx, { filename: 'hazard.js' });
  const api = ctx.window.HazardTest;
  if (!api || !api.spokenLines || !api.soundNames) {
    throw new Error('public/hazard.js did not expose HazardTest.spokenLines and soundNames');
  }
  return ctx;
}

// What each line is, so the narrator can be directed by it: a question, a right or
// wrong answer, a result ("You scored N out of M…", with score as a fraction) or
// other narration (the start line, and anything else the player says).
function lineRoles(config, lines) {
  const roles = new Map();
  config.clips.forEach((c) => {
    roles.set(c.question, { role: 'question' });
    c.options.forEach((o) => roles.set(o.say, { role: o.ok ? 'correct' : 'wrong' }));
  });
  for (const text of lines) {
    if (roles.has(text)) continue;
    const m = text.match(/\b(\d+) out of (\d+)\b/);
    roles.set(text, m ? { role: 'result', score: Number(m[1]) / Number(m[2]) } : { role: 'narration' });
  }
  return roles;
}

// [{ test: 'customer', file: 'hazard-customer.js', lines: [...], sounds: [...], roles: Map(line → { role, score? }) }]
// A test is a public/hazard-*.js file that calls HazardTest.init (so not the clip preview).
export function loadTests() {
  const files = fs
    .readdirSync(PUBLIC)
    .filter((f) => /^hazard-[\w-]+\.js$/.test(f) && fs.readFileSync(path.join(PUBLIC, f), 'utf8').includes('HazardTest.init('))
    .sort();

  return files.map((file) => {
    const ctx = sandbox();
    const configs = [];
    ctx.HazardTest = { init: (_root, config) => configs.push(config) };
    vm.runInContext(fs.readFileSync(path.join(PUBLIC, file), 'utf8'), ctx, { filename: file });
    if (configs.length !== 1) throw new Error(`${file}: expected one HazardTest.init call, got ${configs.length}`);
    const lines = ctx.window.HazardTest.spokenLines(configs[0]);
    return {
      test: file.replace(/^hazard-|\.js$/g, ''),
      file,
      lines,
      sounds: ctx.window.HazardTest.soundNames(configs[0]),
      roles: lineRoles(configs[0], lines),
    };
  });
}

// Reads KEY=VALUE pairs from .env without overriding the real environment.
export function loadEnv(file = path.join(ROOT, '.env')) {
  if (!fs.existsSync(file)) return;
  for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = raw.match(/^\s*(?:export\s+)?([A-Za-z_][\w]*)\s*=\s*(.*)\s*$/);
    if (!m || process.env[m[1]] !== undefined) continue;
    process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}

export const AUDIO = path.join(PUBLIC, 'audio');
export const MANIFEST = path.join(AUDIO, 'manifest.json');

const readJson = (name) => JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', name), 'utf8'));
export const readVoice = () => readJson('voice.json');
export const readSfx = () => readJson('sfx.json');
export const readDirections = () => readJson('directions.json');

export function readManifest() {
  if (!fs.existsSync(MANIFEST)) return { lines: {}, sfx: {} };
  const m = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  return { ...m, lines: m.lines || {}, sfx: m.sfx || {} };
}

// Models that perform [audio tags], ellipses and CAPITALS. Older models would read
// the tags out loud, so they get the plain line.
export const takesDirection = (voice) => /^eleven_v[34]/.test(voice.modelId);

// How a line is directed (scripts/directions.json): its own entry in `lines` if it
// has one, otherwise its role's default tag in front of the plain line. A result's
// default is picked by score, like the grades: [[minimum fraction, tag], ...].
export function direct(directions, text, { role, score } = {}) {
  const own = directions.lines?.[text];
  if (own != null) return { spoken: own, source: 'own' };
  const d = directions.roles?.[role];
  const tag = Array.isArray(d) ? (d.find(([min]) => score >= min) || [])[1] : d;
  return { spoken: tag ? `${tag} ${text}` : text, source: tag ? 'role' : 'none' };
}

// The exact text sent to ElevenLabs. The manifest key is always the player's plain
// text, so directing a line never changes what the page looks up.
export const apiText = (voice, directions, text, role) =>
  takesDirection(voice) ? direct(directions, text, role).spoken : text;

// The words a line says, ignoring [tags], case and punctuation. A direction may
// change the delivery (tags, pauses, CAPITALS) but never the words on screen.
const words = (s) => (s.replace(/\[[^\]]*\]/g, ' ').toLowerCase().replace(/[‘’]/g, "'").match(/[\p{L}\p{N}£]+(?:'[\p{L}]+)*/gu) || []).join(' ');
export const sameWords = (plain, spoken) => words(plain) === words(spoken);

async function post(url, body, key) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify(body),
    });
    if (res.ok) return Buffer.from(await res.arrayBuffer());

    const text = await res.text().catch(() => '');
    if (res.status === 401) {
      throw new Error('ElevenLabs rejected the API key (401). Put a valid key in .env as ELEVENLABS_API_KEY=...');
    }
    if ((res.status === 429 || res.status >= 500) && attempt < 4) {
      await new Promise((r) => setTimeout(r, 2000 * attempt));
      continue;
    }
    throw new Error(`ElevenLabs ${res.status}: ${text.slice(0, 300)}`);
  }
}

// seed (optional in voice.json) makes ElevenLabs sample near-deterministically, so a
// re-recorded line keeps the same read unless its text or settings changed.
export const tts = (voice, text, key) =>
  post(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice.voiceId)}?output_format=${voice.outputFormat}`,
    { text, model_id: voice.modelId, voice_settings: voice.voiceSettings, ...(voice.seed != null && { seed: voice.seed }) },
    key
  );

// loop (optional) asks for a recording that repeats seamlessly, for ambience beds.
export const soundEffect = ({ prompt, duration, loop }, promptInfluence, key) =>
  post(
    'https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128',
    { text: prompt, duration_seconds: duration, prompt_influence: promptInfluence, ...(loop && { loop: true }) },
    key
  );

export function requireKey() {
  loadEnv();
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) {
    console.error('Missing ELEVENLABS_API_KEY. Add it to .env (gitignored): ELEVENLABS_API_KEY=your-key');
    process.exit(1);
  }
  return key;
}
