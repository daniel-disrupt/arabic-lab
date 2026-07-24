#!/usr/bin/env node
/* ─────────────── PROVERB AUDIO GENERATOR ───────────────
   Offline dev tool — NOT shipped to the site (GitHub Pages only deploys app/, see
   .github/workflows/pages.yml). Run this locally whenever a proverb's arWords change
   or a new proverb is added to app/lessons/favorite-proverbs/data.json, and commit the
   resulting audio files + updated data.json together.

   Unlike scripts/generate-voiceover.js (one lesson-length track, global word index,
   ffmpeg concatenation), proverbs are independent standalone units — each gets its own
   short TTS clip and its own local {idx,t} word-timing array (idx 0..N-1 within that
   proverb). See app.js's "PROVERB AUDIO" comment for why this is a deliberately separate
   mechanism from the shared-track one. This is the template for that same pattern on any
   future lesson made of discrete short items (see .claude/skills/lesson-voice-karaoke).

   What it does:
   1. Reads proverbs from app/lessons/favorite-proverbs/data.json and builds one plain-text
      string per proverb from its arWords tokens (w + punct), skipping he/en glosses.
   2. Sends each proverb's text to OpenAI's TTS API and saves the returned audio as
      app/lessons/favorite-proverbs/audio/<id>.mp3.
   3. Runs scripts/align-voiceover-words.py (faster-whisper) against all clips in a single
      invocation, so the whisper model loads once for the whole batch rather than once per
      clip. Each clip is independent and starts its own timeline at 0, so local word indices
      (0..N-1 within a proverb) would collide across proverbs if sent as-is — this script
      relabels them with batch-unique indices before calling the aligner and maps the
      results back to each proverb's own local indices afterward.
   4. Writes each proverb's audio: {src, wordTimes} back into data.json, replacing null.
      Never fabricates a timestamp for a word faster-whisper didn't match — that word is
      simply absent from wordTimes and stays unhighlighted during playback.

   Requirements:
   - Node 18+ (uses global fetch)
   - Python 3 + faster-whisper installed (pip install faster-whisper)
   - OPENAI_API_KEY env var — export this in your own shell; do not paste it into a
     chat/agent session (see .claude/skills/lesson-voice-karaoke/SKILL.md)
   - No ffmpeg/ffprobe needed — no concatenation, no chunk-duration labels.

   Voice: proverbs are short, quotable sayings, not oratory — the instructions below ask
   for a measured, deliberate "reciting a known saying" delivery rather than the Reader
   voiceover's speech-reading pacing, so each word stays distinguishable for a learner.
   Swap OPENAI_VOICE below to compare options: alloy, ash, ballad, coral, echo, fable,
   onyx, nova, sage, shimmer, verse.

   Usage:
     OPENAI_API_KEY=xxx node scripts/generate-proverb-audio.js                 # all proverbs missing audio
     OPENAI_API_KEY=xxx node scripts/generate-proverb-audio.js --only=id1,id2  # just these ids
     OPENAI_API_KEY=xxx node scripts/generate-proverb-audio.js --force        # regenerate everything
*/

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const OPENAI_MODEL = 'gpt-4o-mini-tts';
const OPENAI_VOICE = process.env.OPENAI_VOICE || 'onyx';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const VOICE_INSTRUCTIONS = 'Speak as if reciting a well-known Arabic proverb or saying to a language learner — measured, deliberate, clear, with each word distinguishable, not the pacing of ordinary conversation or a speech.';

const ROOT = path.join(__dirname, '..');
const LESSON_DIR = path.join(ROOT, 'app', 'lessons', 'favorite-proverbs');
const DATA_FILE = path.join(LESSON_DIR, 'data.json');
const AUDIO_DIR = path.join(LESSON_DIR, 'audio');

function proverbText(proverb) {
  return proverb.arWords
    .map((tok) => (tok.sep !== undefined ? tok.sep : (tok.w || '') + (tok.punct || '')))
    .join(' ')
    .replace(/\s+([،؛؟.!:])/g, '$1'); // no space before Arabic/ASCII punctuation
}

async function synthesize(text, voice) {
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      voice,
      input: text,
      instructions: VOICE_INSTRUCTIONS,
      response_format: 'mp3',
    }),
  });
  if (!res.ok) {
    throw new Error(`OpenAI TTS request failed: ${res.status} ${await res.text()}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

function parseArgs(argv) {
  const opts = { force: false, only: null };
  for (const arg of argv) {
    if (arg === '--force') opts.force = true;
    else if (arg.startsWith('--only=')) opts.only = arg.slice('--only='.length).split(',').filter(Boolean);
    else if (arg === '--only') throw new Error('--only requires a value, e.g. --only=id1,id2');
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return opts;
}

async function main() {
  if (!OPENAI_API_KEY) {
    console.error('Set OPENAI_API_KEY env var first (in your own shell — do not paste it into a chat/agent session).');
    process.exit(1);
  }

  const opts = parseArgs(process.argv.slice(2));
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

  let targets = data.proverbs.filter((p) => opts.force || !p.audio || !p.audio.src);
  if (opts.only) {
    const wanted = new Set(opts.only);
    targets = targets.filter((p) => wanted.has(p.id));
    const missing = opts.only.filter((id) => !data.proverbs.some((p) => p.id === id));
    if (missing.length) console.warn(`Warning: unknown proverb id(s): ${missing.join(', ')}`);
  }

  if (!targets.length) {
    console.log('Nothing to do — every targeted proverb already has audio (use --force to regenerate).');
    return;
  }

  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  console.log(`Synthesizing ${targets.length} proverb clip(s)...`);
  const clipFiles = [];
  for (let i = 0; i < targets.length; i++) {
    const proverb = targets[i];
    const text = proverbText(proverb);
    console.log(`[${i + 1}/${targets.length}] ${proverb.id} (${text.length} chars)...`);
    const audio = await synthesize(text, OPENAI_VOICE);
    const file = path.join(AUDIO_DIR, `${proverb.id}.mp3`);
    fs.writeFileSync(file, audio);
    clipFiles.push(file);
  }

  console.log('Aligning words for karaoke sync (running faster-whisper, this can take a while)...');
  // Batch-unique idx -> (proverb index in `targets`, that proverb's own local word idx),
  // since every clip independently starts at t=0 and local 0..N-1 indices would otherwise
  // collide once flattened into one aligner call.
  const idxMap = [];
  let nextIdx = 0;
  const alignInput = targets.map((proverb, ti) => ({
    file: clipFiles[ti],
    offset: 0,
    words: proverb.arWords.map((tok, localIdx) => {
      const idx = nextIdx++;
      idxMap[idx] = { ti, localIdx };
      return { idx, w: tok.w };
    }),
  }));
  const alignInputFile = path.join(AUDIO_DIR, 'align-input.json');
  const alignOutputFile = path.join(AUDIO_DIR, 'align-output.json');
  fs.writeFileSync(alignInputFile, JSON.stringify(alignInput));
  execFileSync('python', [path.join(__dirname, 'align-voiceover-words.py'), alignInputFile, alignOutputFile], {
    stdio: 'inherit',
  });
  const alignedFlat = JSON.parse(fs.readFileSync(alignOutputFile, 'utf-8'));
  fs.unlinkSync(alignInputFile);
  fs.unlinkSync(alignOutputFile);

  const wordTimesByTarget = targets.map(() => []);
  for (const { idx, t } of alignedFlat) {
    const { ti, localIdx } = idxMap[idx];
    wordTimesByTarget[ti].push({ idx: localIdx, t });
  }

  targets.forEach((proverb, ti) => {
    const wordTimes = wordTimesByTarget[ti].sort((a, b) => a.t - b.t);
    const rate = proverb.arWords.length ? Math.round((wordTimes.length / proverb.arWords.length) * 1000) / 10 : 0;
    console.log(`  ${proverb.id}: aligned ${wordTimes.length}/${proverb.arWords.length} words (${rate}%)`);
    proverb.audio = { src: `audio/${proverb.id}.mp3`, wordTimes };
  });

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2) + '\n');
  console.log(`Done. Wrote ${targets.length} clip(s) to ${AUDIO_DIR} and updated ${DATA_FILE}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
