#!/usr/bin/env node
// Fails (exit 1) if any line or sound a hazard perception test can play has no
// recording in public/audio/manifest.json, or the recording file is missing.
//   npm run audio:check

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MANIFEST, PUBLIC, loadTests, readManifest } from './lib/hazard-lines.mjs';

export function checkAudio() {
  const manifest = readManifest();
  const problems = [];
  const has = (url) => url && fs.existsSync(path.join(PUBLIC, url));

  for (const { test, lines, sounds } of loadTests()) {
    for (const text of lines) {
      if (!has(manifest.lines[text])) problems.push(`${test}: line  "${text}"`);
    }
    for (const name of sounds) {
      if (!has(manifest.sfx[name])) problems.push(`${test}: sound "${name}"`);
    }
  }

  const where = path.relative(process.cwd(), MANIFEST);
  if (problems.length) {
    console.error(`Audio check failed: ${problems.length} without a recording in ${where}:`);
    problems.forEach((p) => console.error(`  ${p}`));
    console.error('Run npm run audio:generate (and add prompts to scripts/sfx.json for any unknown sounds).');
    return false;
  }
  console.log(`Audio check passed: every line and sound has a recording in ${where}.`);
  return true;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(checkAudio() ? 0 : 1);
