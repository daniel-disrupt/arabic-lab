#!/usr/bin/env node
/* ─────────────── VOICEOVER GENERATOR (per-lesson data.json) ───────────────
   Updated for the current per-lesson data.json architecture (app/lessons/<slug>/data.json)
   -- the original scripts/generate-voiceover.js reads/writes the old hardcoded
   app/js/lesson-data.js / voiceover-data.js files, which nothing loads anymore
   (see madrasa-translit skill: those are dead/legacy files). Same underlying pipeline,
   just reading CHUNKS from and writing the `voiceover` key back into a lesson's own
   data.json instead.

   What it does:
   1. Reads `chunks` from app/lessons/<slug>/data.json and builds one plain-text string
      per chunk from the reading-edition tokens (w + punct), skipping he/en glosses.
   2. Sends each chunk's text to OpenAI's TTS API, saves each as a temp mp3.
   3. Concatenates the per-chunk files (via ffmpeg) into one lesson-length file,
      app/lessons/<slug>/audio/reading-edition.mp3.
   4. Measures each chunk's duration (via ffprobe) to compute start/end timestamps
      and mm:ss labels against the voiceover's own pacing.
   5. Runs scripts/align-voiceover-words.py (faster-whisper) against each chunk's audio
      to get per-word timestamps for karaoke-mode highlighting, aligned back to the known
      tokens -- reliable here (unlike ASR against a real recording) because the audio was
      synthesized directly from that same text.
   6. Writes voiceover.src/chunks/wordTimes directly back into the lesson's data.json
      (overwriting the {src:'', chunks:[placeholders], wordTimes:[]} stub).

   Requirements:
   - Node 18+ (uses global fetch)
   - ffmpeg + ffprobe on PATH
   - Python 3 + faster-whisper installed (pip install faster-whisper)
   - OPENAI_API_KEY env var -- set this in your own terminal and run this script there.
     Never paste a real API key into a Claude Code (or any agent) session.

   Usage:
     OPENAI_API_KEY=xxx node scripts/generate-voiceover-for-lesson.js <slug>
   e.g.
     OPENAI_API_KEY=xxx node scripts/generate-voiceover-for-lesson.js sami-jaffa-story
*/

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const OPENAI_MODEL = 'gpt-4o-mini-tts';
const OPENAI_VOICE = process.env.OPENAI_VOICE || 'onyx';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
// Sami's essay is reflective narrative/historical prose (not oratory like Abed's speech) --
// distinct register worth its own instruction rather than reusing generate-voiceover.js's
// "political speech" wording verbatim.
const VOICE_INSTRUCTIONS = 'Speak in a calm, reflective, measured tone with the pacing of someone narrating a personal historical account aloud -- warm and clear, not a public speech.';

const ROOT = path.join(__dirname, '..');

function chunkText(chunk) {
  return chunk.text
    .map((tok) => (tok.sep !== undefined ? tok.sep : (tok.w || '') + (tok.punct || '')))
    .join(' ')
    .replace(/\s+([،؛؟.!:])/g, '$1');
}

function buildAlignmentWords(chunks) {
  let gi = 0;
  return chunks.map((chunk) => {
    const words = [];
    chunk.text.forEach((tok) => {
      if (tok.sep !== undefined) return;
      words.push({ idx: gi++, w: tok.w });
    });
    return words;
  });
}

async function synthesize(text, voice) {
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: OPENAI_MODEL, voice, input: text, instructions: VOICE_INSTRUCTIONS, response_format: 'mp3' }),
  });
  if (!res.ok) throw new Error(`OpenAI TTS request failed: ${res.status} ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

function fmtTime(s) {
  const m = Math.floor(s / 60), sec = Math.floor(s % 60).toString().padStart(2, '0');
  return m + ':' + sec;
}

function ffprobeDuration(file) {
  const out = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file]);
  return parseFloat(out.toString().trim());
}

function concatMp3s(files, outFile, cwd) {
  const listFile = path.join(cwd, 'concat-list.txt');
  fs.writeFileSync(listFile, files.map((f) => `file '${path.basename(f)}'`).join('\n'));
  execFileSync('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', listFile, '-c:a', 'libmp3lame', '-q:a', '2', outFile], { cwd });
  fs.unlinkSync(listFile);
}

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Usage: node scripts/generate-voiceover-for-lesson.js <slug>');
    process.exit(1);
  }
  if (!OPENAI_API_KEY) {
    console.error('Set OPENAI_API_KEY env var first.');
    process.exit(1);
  }

  const lessonDir = path.join(ROOT, 'app', 'lessons', slug);
  const dataPath = path.join(lessonDir, 'data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const CHUNKS = data.chunks;
  if (!CHUNKS || !CHUNKS.length) {
    console.error(`No chunks found in ${dataPath}`);
    process.exit(1);
  }

  const audioDir = path.join(lessonDir, 'audio');
  fs.mkdirSync(audioDir, { recursive: true });
  const finalMp3 = path.join(audioDir, 'reading-edition.mp3');

  const chunkFiles = [];
  for (let i = 0; i < CHUNKS.length; i++) {
    const text = chunkText(CHUNKS[i]);
    console.log(`[${i + 1}/${CHUNKS.length}] synthesizing (${text.length} chars)...`);
    const audio = await synthesize(text, OPENAI_VOICE);
    const file = path.join(audioDir, `chunk-${i}.mp3`);
    fs.writeFileSync(file, audio);
    chunkFiles.push(file);
  }

  console.log('Concatenating chunks into reading-edition.mp3...');
  concatMp3s(chunkFiles, finalMp3, audioDir);

  console.log('Measuring durations for chunk-level sync...');
  let cursor = 0;
  const voiceoverChunks = chunkFiles.map((file) => {
    const dur = ffprobeDuration(file);
    const entry = { start: cursor, end: cursor + dur, label: fmtTime(cursor) + ' – ' + fmtTime(cursor + dur) };
    cursor += dur;
    return entry;
  });

  console.log('Aligning words for karaoke sync (running faster-whisper, this can take a while)...');
  const alignmentWords = buildAlignmentWords(CHUNKS);
  const alignInput = chunkFiles.map((file, i) => ({ file, offset: voiceoverChunks[i].start, words: alignmentWords[i] }));
  const alignInputFile = path.join(audioDir, 'align-input.json');
  const alignOutputFile = path.join(audioDir, 'align-output.json');
  fs.writeFileSync(alignInputFile, JSON.stringify(alignInput));
  execFileSync('python', [path.join(__dirname, 'align-voiceover-words.py'), alignInputFile, alignOutputFile], { stdio: 'inherit' });
  const wordTimes = JSON.parse(fs.readFileSync(alignOutputFile, 'utf-8'));
  fs.unlinkSync(alignInputFile);
  fs.unlinkSync(alignOutputFile);
  chunkFiles.forEach((f) => fs.unlinkSync(f));

  data.voiceover = {
    src: 'audio/reading-edition.mp3',
    chunks: voiceoverChunks,
    wordTimes,
  };
  fs.writeFileSync(dataPath, JSON.stringify(data));
  console.log(`Done. Wrote ${finalMp3} and updated ${dataPath}'s voiceover key.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
