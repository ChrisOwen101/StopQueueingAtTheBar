#!/usr/bin/env node
// Auditions directed narration before re-recording everything: renders a few lines
// (two wrong answers, a right one, a question, a low and a top result) with the
// current voice.json read and with each variant below, then writes
// .voice-samples/directions/index.html (gitignored) to compare them side by side.
//   npm run audio:compare               record what's missing (cached by what was sent)
//   npm run audio:compare -- --dry-run  show what would be sent and the characters
// The "now" column reuses the recordings in public/audio when they exist.

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { MANIFEST, PUBLIC, ROOT, apiText, loadTests, readDirections, readManifest, readVoice, requireKey, tts } from './lib/hazard-lines.mjs';

const OUT = path.join(ROOT, '.voice-samples', 'directions');
const dryRun = process.argv.includes('--dry-run');
const SEED = 1;

const voice = readVoice();
const directions = readDirections();
const v = (modelId, stability, extra = {}) => ({
  ...voice,
  modelId,
  seed: SEED,
  voiceSettings: { stability, similarity_boost: voice.voiceSettings.similarity_boost },
  ...extra,
});

// Columns. `roleOnly` ignores the hand-written lines, to hear how a new line sounds.
const VARIANTS = [
  { id: 'now', label: `Now: ${voice.modelId}, plain`, voice },
  { id: 'v3-natural', label: 'eleven_v3, directed, stability 0.5 (Natural)', voice: v('eleven_v3', 0.5) },
  { id: 'v3-creative', label: 'eleven_v3, directed, stability 0 (Creative)', voice: v('eleven_v3', 0) },
  { id: 'v4-0.5', label: 'eleven_v4, directed, stability 0.5', voice: v('eleven_v4', 0.5) },
  { id: 'v4-0.25', label: 'eleven_v4, directed, stability 0.25', voice: v('eleven_v4', 0.25) },
  { id: 'v4-role', label: 'eleven_v4, stability 0.5, role default only (how an undirected new line sounds)', voice: v('eleven_v4', 0.5), roleOnly: true, rows: 3 },
];

// Rows: picked by role and position, so this still works when the copy changes.
const all = [];
for (const t of loadTests()) for (const text of t.lines) if (!all.some((l) => l.text === text)) all.push({ text, test: t.test, ...t.roles.get(text) });
const pick = (role, test, n = 0, keep = () => true) => {
  const of = all.filter((l) => l.role === role && keep(l));
  return of.filter((l) => l.test === test)[n] || of[n] || of[0];
};
const rows = [
  pick('wrong', 'customer'),
  pick('correct', 'customer', 2),
  pick('question', 'customer'),
  pick('wrong', 'barperson', 3),
  pick('result', 'customer', 0, (l) => l.score > 0 && l.score < 0.5),
  pick('result', 'customer', 0, (l) => l.score === 1),
].filter(Boolean);

const hash = (parts) => crypto.createHash('sha1').update(JSON.stringify(parts)).digest('hex').slice(0, 12);
const manifest = readManifest();
const jobs = [];
const cells = rows.map((row) =>
  VARIANTS.map((variant) => {
    if (variant.rows && rows.indexOf(row) >= variant.rows) return null;
    const dirs = variant.roleOnly ? { ...directions, lines: {} } : directions;
    const sent = apiText(variant.voice, dirs, row.text, row);
    if (variant.id === 'now' && manifest.lines[row.text]) {
      return { src: path.relative(OUT, path.join(PUBLIC, manifest.lines[row.text])), sent };
    }
    const s = variant.voice;
    const file = `${variant.id}/${hash([s.voiceId, s.modelId, s.voiceSettings, s.seed, sent])}.mp3`;
    if (!fs.existsSync(path.join(OUT, file))) jobs.push({ variant, sent, file });
    return { src: file, sent };
  })
);

const chars = jobs.reduce((n, j) => n + j.sent.length, 0);
console.log(`${rows.length} lines × ${VARIANTS.length} variants. To record: ${jobs.length} samples, ${chars} characters.`);
if (dryRun) {
  jobs.forEach((j) => console.log(`  ${j.variant.id}: ${j.sent}`));
  process.exit(0);
}

const key = jobs.length ? requireKey() : null;
for (const [i, j] of jobs.entries()) {
  fs.mkdirSync(path.dirname(path.join(OUT, j.file)), { recursive: true });
  fs.writeFileSync(path.join(OUT, j.file), await tts(j.variant.voice, j.sent, key));
  console.log(`  [${i + 1}/${jobs.length}] ${j.variant.id}: ${j.sent.slice(0, 70)}`);
}

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Narration directions</title>
<style>
  :root { color-scheme: light dark; --bg: #fbf7ef; --fg: #1d1b18; --muted: #6b655c; --line: #e2dccf; --tag: #a4461c; }
  @media (prefers-color-scheme: dark) { :root { --bg: #171614; --fg: #f2eee6; --muted: #a39d92; --line: #34312c; --tag: #f0915f; } }
  body { margin: 0; padding: 24px 16px 64px; background: var(--bg); color: var(--fg); font: 15px/1.45 system-ui, sans-serif; }
  h1 { font-size: 28px; margin: 0 0 4px; }
  p.lede { color: var(--muted); margin: 0 0 24px; max-width: 70ch; }
  section { border-top: 2px solid var(--fg); padding: 16px 0 24px; }
  h2 { font-size: 18px; margin: 0 0 4px; }
  .role { display: inline-block; font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); margin-bottom: 12px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
  .cell { border: 1px solid var(--line); border-radius: 8px; padding: 10px 12px; }
  .cell h3 { font-size: 13px; margin: 0 0 8px; font-weight: 600; }
  audio { width: 100%; }
  .sent { font-size: 13px; color: var(--muted); margin: 8px 0 0; }
  .sent b { color: var(--tag); font-weight: 600; }
</style>
</head>
<body>
<h1>Narration directions</h1>
<p class="lede">Each row is one line from the hazard tests. "Now" is the recording on the site today. The others send the direction in scripts/directions.json (audio tags, pauses, CAPITALS) to a different model or stability. Same voice (${esc(voice.voiceName || voice.voiceId)}), same seed (${SEED}). Listen for: does the wrong answer sound let down, does the accent hold, are any tags read out loud?</p>
${rows
  .map(
    (row, r) => `<section>
<h2>${esc(row.text)}</h2>
<span class="role">${row.role}${row.role === 'result' ? `, ${Math.round(row.score * 100)}%` : ''} · ${row.test}</span>
<div class="grid">
${VARIANTS.map((variant, c) => {
  const cell = cells[r][c];
  if (!cell) return '';
  const sent = esc(cell.sent).replace(/\[[^\]]*\]/g, (t) => `<b>${t}</b>`);
  return `<div class="cell"><h3>${esc(variant.label)}</h3><audio controls preload="none" src="${esc(cell.src)}"></audio>${cell.sent !== row.text ? `<p class="sent">${sent}</p>` : ''}</div>`;
}).join('\n')}
</div>
</section>`
  )
  .join('\n')}
</body>
</html>
`;
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), html);
console.log(`Open ${path.relative(process.cwd(), path.join(OUT, 'index.html'))} to compare. (${path.relative(process.cwd(), MANIFEST)} is not touched.)`);
