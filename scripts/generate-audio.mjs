#!/usr/bin/env node
// Records all hazard perception audio with ElevenLabs: narration (text to speech)
// and sound effects (sound generation).
//   npm run audio:dry                 list everything, how each line is said, characters and seconds; nothing is fetched
//   npm run audio:generate            record whatever is missing, rewrite the manifest, then check
//   npm run audio:generate -- --force   re-record everything
//   npm run audio:generate -- --prune   also delete recordings the manifest no longer uses
//   npm run audio:generate -- --only customer   record only what that test needs
//   npm run audio:generate -- --sounds-only     record sound effects, no narration
// Narrator: scripts/voice.json. How each line is performed: scripts/directions.json.
// Sound prompts: scripts/sfx.json. Key: ELEVENLABS_API_KEY in .env.
// Files are named by a hash of what was sent, so an unchanged line is never paid for twice.

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { AUDIO, MANIFEST, direct, loadTests, readDirections, readSfx, readVoice, requireKey, sameWords, soundEffect, takesDirection, tts } from './lib/hazard-lines.mjs';
import { checkAudio } from './check-audio.mjs';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const force = args.has('--force');
const prune = args.has('--prune');
const onlyArg = process.argv.indexOf('--only');
const only = onlyArg > -1 ? process.argv[onlyArg + 1] : null;
const soundsOnly = args.has('--sounds-only');
const SFX_DIR = path.join(AUDIO, 'sfx');
const CONCURRENCY = 2;

const voice = readVoice();
const sfxConfig = readSfx();
const directions = readDirections();
const tests = loadTests();
if (only && !tests.some((t) => t.test === only)) {
  console.error(`No test called "${only}". Tests: ${tests.map((t) => t.test).join(', ')}`);
  process.exit(1);
}

const hash = (parts) => crypto.createHash('sha1').update(JSON.stringify(parts)).digest('hex').slice(0, 12);

// Narration: one recording per unique line, shared between tests, performed as
// scripts/directions.json says (on models that take direction).
const lineTests = new Map();
const lineRoles = new Map();
for (const { test, lines, roles } of tests) {
  for (const text of lines) {
    lineTests.set(text, [...(lineTests.get(text) || []), test]);
    if (!lineRoles.has(text)) lineRoles.set(text, roles.get(text));
  }
}
const lines = [...lineTests].map(([text, usedBy]) => {
  const role = lineRoles.get(text);
  const { spoken, source } = direct(directions, text, role);
  const sent = takesDirection(voice) ? spoken : text;
  const seed = voice.seed != null ? [voice.seed] : [];
  const file = `${hash([voice.voiceId, voice.modelId, voice.outputFormat, voice.voiceSettings, sent, ...seed])}.mp3`;
  return { kind: 'line', key: text, sent, spoken, source, role: role.role, usedBy, file, abs: path.join(AUDIO, file), url: `audio/${file}` };
});

// A direction may change how a line is said, never what is said.
const reworded = lines.filter((e) => !sameWords(e.key, e.spoken));
const unused = Object.keys(directions.lines || {}).filter((text) => !lineTests.has(text));

// Sound effects: every name the player or a clip event can play.
const soundTests = new Map();
for (const { test, sounds } of tests) {
  for (const name of sounds) soundTests.set(name, [...(soundTests.get(name) || []), test]);
}
const noPrompt = [...soundTests.keys()].filter((name) => !sfxConfig.sounds[name]);
const sounds = [...soundTests]
  .filter(([name]) => sfxConfig.sounds[name])
  .map(([name, usedBy]) => {
    const spec = sfxConfig.sounds[name];
    const file = `${hash(['sfx', spec.prompt, spec.duration, sfxConfig.promptInfluence])}.mp3`;
    return { kind: 'sfx', key: name, spec, usedBy, file, abs: path.join(SFX_DIR, file), url: `audio/sfx/${file}` };
  });

const todo = [...lines, ...sounds].filter((e) => (force || !fs.existsSync(e.abs)) && (!only || e.usedBy.includes(only)) && (!soundsOnly || e.kind === 'sfx'));
const chars = (list) => list.filter((e) => e.kind === 'line').reduce((n, e) => n + e.sent.length, 0);
const secs = (list) => list.filter((e) => e.kind === 'sfx').reduce((n, e) => n + e.spec.duration, 0);

console.log(`Narrator: ${voice.voiceName || voice.voiceId} · ${voice.modelId}`);
const ownCount = lines.filter((e) => e.source === 'own').length;
console.log(
  takesDirection(voice)
    ? `Directions: ${ownCount} lines directed in scripts/directions.json, ${lines.length - ownCount} on their role's default.`
    : `Directions: not sent, ${voice.modelId} would read audio tags out loud. Lines go plain.`
);
for (const t of tests) console.log(`  ${t.test}: ${t.lines.length} lines, ${t.sounds.length} sounds`);
console.log(`Narration: ${lines.length} unique lines, ${chars(lines)} characters (to record: ${todo.filter((e) => e.kind === 'line').length}, ${chars(todo)} characters).`);
console.log(`Sound effects: ${sounds.length} sounds, ${secs(sounds).toFixed(1)}s (to record: ${todo.filter((e) => e.kind === 'sfx').length}, ${secs(todo).toFixed(1)}s).`);
if (noPrompt.length) {
  console.error(`No prompt in scripts/sfx.json for: ${noPrompt.map((n) => `${n} (${soundTests.get(n).join(', ')})`).join('; ')}`);
}
if (unused.length) {
  console.warn(`${unused.length} direction(s) in scripts/directions.json match no line (has the copy changed?):`);
  unused.forEach((text) => console.warn(`  ${text}`));
}
if (reworded.length) {
  console.error(`${reworded.length} direction(s) in scripts/directions.json change the words, not just the delivery:`);
  reworded.forEach((e) => console.error(`  line: ${e.key}\n  said: ${e.spoken}`));
}

if (dryRun) {
  for (const e of lines) {
    console.log(`${fs.existsSync(e.abs) ? '✓' : '·'} line  [${e.usedBy.join(', ')}] ${e.role}${e.source === 'own' ? '' : ' (role default)'}: ${e.key}`);
    if (e.spoken !== e.key) console.log(`        ${takesDirection(voice) ? 'said' : 'directed (not sent)'}: ${e.spoken}`);
  }
  for (const e of sounds) console.log(`${fs.existsSync(e.abs) ? '✓' : '·'} sound [${e.usedBy.join(', ')}] ${e.key} (${e.spec.duration}s): ${e.spec.prompt}`);
  process.exit(noPrompt.length || reworded.length ? 1 : 0);
}
if (reworded.length) process.exit(1);

const key = requireKey();
fs.mkdirSync(SFX_DIR, { recursive: true });

let done = 0;
let failed = null;
const queue = [...todo];
const worker = async () => {
  while (queue.length && !failed) {
    const e = queue.shift();
    try {
      const audio = e.kind === 'line' ? await tts(voice, e.sent, key) : await soundEffect(e.spec, sfxConfig.promptInfluence, key);
      fs.writeFileSync(e.abs, audio);
      done += 1;
      console.log(`  [${done}/${todo.length}] ${e.kind === 'line' ? 'line ' : 'sound'} ${e.key}`);
    } catch (err) {
      failed = err;
    }
  }
};
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

// Always rewrite the manifest so whatever was recorded gets used.
const manifest = {
  voice: { voiceId: voice.voiceId, voiceName: voice.voiceName, modelId: voice.modelId, voiceSettings: voice.voiceSettings },
  lines: Object.fromEntries(lines.filter((e) => fs.existsSync(e.abs)).map((e) => [e.key, e.url])),
  sfx: Object.fromEntries(sounds.filter((e) => fs.existsSync(e.abs)).map((e) => [e.key, e.url])),
};
fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);

if (prune) {
  let removed = 0;
  for (const [dir, keep] of [
    [AUDIO, new Set(lines.map((e) => e.file))],
    [SFX_DIR, new Set(sounds.map((e) => e.file))],
  ]) {
    for (const f of fs.readdirSync(dir)) {
      if (/^[0-9a-f]{12}\.mp3$/.test(f) && !keep.has(f)) {
        fs.unlinkSync(path.join(dir, f));
        removed += 1;
      }
    }
  }
  console.log(`Pruned ${removed} unused recording(s).`);
}

if (failed) console.error(`\n${failed.message}`);
const ok = checkAudio();
process.exit(failed || !ok ? 1 : 0);
