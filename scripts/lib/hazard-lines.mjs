// Loads public/hazard.js and each public/hazard-*.js test in a sandbox and returns
// every line and sound the player can play, using the player's own
// HazardTest.spokenLines and HazardTest.soundNames. Also the ElevenLabs calls.

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

// [{ test: 'customer', file: 'hazard-customer.js', lines: [...], sounds: [...] }]
export function loadTests() {
  const files = fs
    .readdirSync(PUBLIC)
    .filter((f) => /^hazard-[\w-]+\.js$/.test(f))
    .sort();

  return files.map((file) => {
    const ctx = sandbox();
    const configs = [];
    ctx.HazardTest = { init: (_root, config) => configs.push(config) };
    vm.runInContext(fs.readFileSync(path.join(PUBLIC, file), 'utf8'), ctx, { filename: file });
    if (configs.length !== 1) throw new Error(`${file}: expected one HazardTest.init call, got ${configs.length}`);
    return {
      test: file.replace(/^hazard-|\.js$/g, ''),
      file,
      lines: ctx.window.HazardTest.spokenLines(configs[0]),
      sounds: ctx.window.HazardTest.soundNames(configs[0]),
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

export function readManifest() {
  if (!fs.existsSync(MANIFEST)) return { lines: {}, sfx: {} };
  const m = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  return { ...m, lines: m.lines || {}, sfx: m.sfx || {} };
}

// The exact text sent to ElevenLabs. Audio tags only work on eleven_v3, and they
// never change the manifest key, which is always the player's plain text.
export function apiText(voice, text) {
  const tag = voice.modelId === 'eleven_v3' && voice.v3Tag ? `${voice.v3Tag} ` : '';
  return tag + text;
}

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

export const tts = (voice, text, key) =>
  post(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice.voiceId)}?output_format=${voice.outputFormat}`,
    { text, model_id: voice.modelId, voice_settings: voice.voiceSettings },
    key
  );

export const soundEffect = ({ prompt, duration }, promptInfluence, key) =>
  post(
    'https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128',
    { text: prompt, duration_seconds: duration, prompt_influence: promptInfluence },
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
