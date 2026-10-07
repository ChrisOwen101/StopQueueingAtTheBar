#!/usr/bin/env node
// Auditions narrator voices: finds deep British male narrator voices (premade and
// the shared Voice Library), records the same short lines with each, and saves
// them to .voice-samples/ (gitignored) so you can listen and choose.
//   npm run audio:samples              5 candidates
//   npm run audio:samples -- --count 3
// Put the winner's voice_id in scripts/voice.json. Shared-library voices are added
// to your ElevenLabs account (one voice slot each) if text to speech needs that.

import fs from 'node:fs';
import path from 'node:path';
import { ROOT, readVoice, requireKey, tts } from './lib/hazard-lines.mjs';

const OUT = path.join(ROOT, '.voice-samples');
const API = 'https://api.elevenlabs.io';
const countArg = process.argv.indexOf('--count');
const COUNT = countArg > -1 ? Number(process.argv[countArg + 1]) : 5;

const LINES = [
  'No waving. No clicking. Bar staff are not spaniels.',
  'You scored 4 out of 4. Full licence. You may approach any bar in the land.',
];

// The brief: deep, British, baritone narrator; theatrical, pompous, deadpan.
const WANT = /\b(deep|baritone|bass|booming|rich|resonant|narrat|storytell|documentary|theatrical|dramatic|pompous|grand|authoritative|commanding|trailer|posh|aristocrat|eccentric|comedic|deadpan|dry|wry)/gi;
// Never pick anything sold as a specific real person.
const REAL_PERSON = /\b(celebrit|famous|impression|impersonat|parody|soundalike|sound[- ]alike|sounds like|inspired by|clone of|matt\s*berry|berry|attenborough|fry|cumberbatch|hopkins|caine|rickman|sean connery|morgan freeman)/i;

const key = requireKey();
const get = async (url) => {
  const res = await fetch(API + url, { headers: { 'xi-api-key': key } });
  if (res.status === 401) throw new Error('ElevenLabs rejected the API key (401). Check ELEVENLABS_API_KEY in .env.');
  if (!res.ok) throw new Error(`GET ${url} → ${res.status} ${(await res.text()).slice(0, 200)}`);
  return res.json();
};

const text = (v) => [v.name, v.description, v.descriptive, v.use_case, v.accent, v.age, ...Object.values(v.labels || {})].filter(Boolean).join(' ');
const score = (v) => (text(v).match(WANT) || []).length;

// Shared Voice Library: British male voices matching narrator-ish searches.
const shared = new Map();
for (const search of ['narrator', 'deep', 'baritone', 'theatrical', 'documentary', 'pompous']) {
  const q = new URLSearchParams({ page_size: '50', gender: 'male', accent: 'british', language: 'en', search });
  const { voices = [] } = await get(`/v1/shared-voices?${q}`);
  voices.forEach((v) => shared.set(v.voice_id, { ...v, source: 'library' }));
}

// Premade voices already on the account.
const { voices: own = [] } = await get('/v1/voices');
const premade = own
  .filter((v) => v.category === 'premade' && /british/i.test(v.labels?.accent || '') && /male/i.test(v.labels?.gender || '') && !/female/i.test(v.labels?.gender || ''))
  .map((v) => ({ ...v, source: 'premade' }));

const pool = [...premade, ...shared.values()].filter((v) => !REAL_PERSON.test(text(v)));
const rank = (list) => list.sort((a, b) => score(b) - score(a) || (b.cloned_by_count || 0) - (a.cloned_by_count || 0));
const premadePicks = rank(premade.filter((v) => pool.includes(v))).slice(0, 2);
const libraryPicks = rank([...shared.values()].filter((v) => pool.includes(v))).slice(0, Math.max(0, COUNT - premadePicks.length));
const candidates = [...premadePicks, ...libraryPicks].slice(0, COUNT);

console.log(`Found ${shared.size} library and ${premade.length} premade British male voices; auditioning ${candidates.length}.`);
fs.mkdirSync(OUT, { recursive: true });

const voice = readVoice();
const results = [];
for (const [i, v] of candidates.entries()) {
  const slug = `${i + 1}-${v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30)}`;
  const dir = path.join(OUT, slug);
  fs.mkdirSync(dir, { recursive: true });
  const as = { ...voice, voiceId: v.voice_id };

  const record = async () => {
    for (const [n, line] of LINES.entries()) fs.writeFileSync(path.join(dir, `line${n + 1}.mp3`), await tts(as, line, key));
  };
  let added = false;
  try {
    await record();
  } catch (err) {
    if (v.source !== 'library' || !/\b(400|404|422)\b/.test(err.message)) throw err;
    // Library voices may need adding to the account before text to speech accepts them.
    const res = await fetch(`${API}/v1/voices/add/${v.public_owner_id}/${v.voice_id}`, {
      method: 'POST',
      headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ new_name: v.name }),
    });
    if (!res.ok) throw new Error(`Adding ${v.name} to your voices failed: ${res.status} ${(await res.text()).slice(0, 200)}`);
    added = true;
    await record();
  }

  const info = {
    folder: path.relative(ROOT, dir),
    voice_id: v.voice_id,
    name: v.name,
    source: v.source,
    added_to_account: added,
    accent: v.accent || v.labels?.accent,
    age: v.age || v.labels?.age,
    descriptive: v.descriptive || v.labels?.description,
    use_case: v.use_case || v.labels?.use_case,
    description: v.description,
    cloned_by_count: v.cloned_by_count,
    match_score: score(v),
  };
  results.push(info);
  console.log(`\n${slug}  ${v.voice_id}  (${v.source}${added ? ', added to your voices' : ''})\n  ${[info.accent, info.age, info.descriptive, info.use_case].filter(Boolean).join(' · ')}\n  ${(v.description || '').replace(/\s+/g, ' ').slice(0, 160)}`);
}

fs.writeFileSync(path.join(OUT, 'candidates.json'), `${JSON.stringify(results, null, 2)}\n`);
console.log(`\nSamples in ${path.relative(process.cwd(), OUT)}/. Put your pick's voice_id in scripts/voice.json, then run npm run audio:generate.`);
