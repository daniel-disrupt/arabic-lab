#!/usr/bin/env node
/* ─────────────── VOICEOVER GENERATOR ───────────────
   Offline dev tool — NOT shipped to the site (GitHub Pages only deploys app/, see
   .github/workflows/pages.yml). Run this locally whenever CHUNKS in lesson-data.js
   changes, and commit the resulting audio + voiceover-data.js.

   What it does:
   1. Reads CHUNKS from app/js/lesson-data.js and builds one plain-text string per
      chunk from the reading-edition tokens (w + punct), skipping he/en glosses.
   2. Sends each chunk's text to Azure AI Speech (text-to-speech) and saves the
      returned audio as app/audio/voiceover/chunk-<i>.mp3.
   3. Concatenates the per-chunk files (via ffmpeg) into one lesson-length file,
      app/audio/voiceover/reading-edition.mp3 — so the reader can swap it in for
      audio-el.src exactly like the original recording.
   4. Measures each chunk's duration (via ffprobe) to compute new start/end
      timestamps against the voiceover's own pacing, and writes them to
      app/js/voiceover-data.js.

   Requirements:
   - Node 18+ (uses global fetch)
   - ffmpeg + ffprobe on PATH (brew install ffmpeg / apt install ffmpeg)
   - AZURE_SPEECH_KEY and AZURE_SPEECH_REGION env vars (Azure AI Speech resource)

   Voice: the lesson text is spoken Palestinian Arabic, not MSA. No commercial TTS
   voice is trained specifically on Palestinian dialect, but Azure's Levantine-area
   neural voices (Jordanian/Syrian/Lebanese) read voweled dialectal text far more
   naturally than Gulf/Egyptian/MSA voices — that's why Azure was picked over
   Google/Amazon/ElevenLabs/OpenAI here. Swap AZURE_VOICE below to compare options:
     ar-JO-TaimNeural   (Jordanian, male)   — closest dialect match, default here
     ar-SY-AmanyNeural   (Syrian, female)
     ar-LB-LaylaNeural   (Lebanese, female)

   Usage:
     AZURE_SPEECH_KEY=xxx AZURE_SPEECH_REGION=xxx node scripts/generate-voiceover.js
*/

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const AZURE_VOICE = process.env.AZURE_VOICE || 'ar-JO-TaimNeural';
const AZURE_KEY = process.env.AZURE_SPEECH_KEY;
const AZURE_REGION = process.env.AZURE_SPEECH_REGION;

const ROOT = path.join(__dirname, '..');
const AUDIO_DIR = path.join(ROOT, 'app', 'audio', 'voiceover');
const OUT_DATA_FILE = path.join(ROOT, 'app', 'js', 'voiceover-data.js');
const FINAL_MP3 = path.join(AUDIO_DIR, 'reading-edition.mp3');

function chunkText(chunk) {
  return chunk.text
    .map((tok) => (tok.sep !== undefined ? tok.sep : (tok.w || '') + (tok.punct || '')))
    .join(' ')
    .replace(/\s+([،؛؟.!:])/g, '$1'); // no space before Arabic/ASCII punctuation
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function synthesize(text, voice) {
  const ssml = `<speak version="1.0" xml:lang="ar-JO"><voice name="${voice}">${escapeXml(text)}</voice></speak>`;
  const res = await fetch(
    `https://${AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
    {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_KEY,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      },
      body: ssml,
    }
  );
  if (!res.ok) {
    throw new Error(`Azure TTS request failed: ${res.status} ${await res.text()}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

function ffprobeDuration(file) {
  const out = execFileSync('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    file,
  ]);
  return parseFloat(out.toString().trim());
}

function concatMp3s(files, outFile) {
  const listFile = path.join(AUDIO_DIR, 'concat-list.txt');
  fs.writeFileSync(listFile, files.map((f) => `file '${path.basename(f)}'`).join('\n'));
  execFileSync('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', listFile, '-c', 'copy', outFile], {
    cwd: AUDIO_DIR,
  });
  fs.unlinkSync(listFile);
}

async function main() {
  if (!AZURE_KEY || !AZURE_REGION) {
    console.error('Set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION env vars first.');
    process.exit(1);
  }

  const { CHUNKS } = require(path.join(ROOT, 'app', 'js', 'lesson-data.js'));
  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  const chunkFiles = [];
  for (let i = 0; i < CHUNKS.length; i++) {
    const text = chunkText(CHUNKS[i]);
    console.log(`[${i + 1}/${CHUNKS.length}] synthesizing (${text.length} chars)...`);
    const audio = await synthesize(text, AZURE_VOICE);
    const file = path.join(AUDIO_DIR, `chunk-${i}.mp3`);
    fs.writeFileSync(file, audio);
    chunkFiles.push(file);
  }

  console.log('Concatenating chunks into reading-edition.mp3...');
  concatMp3s(chunkFiles, FINAL_MP3);

  console.log('Measuring durations for chunk-level sync...');
  let cursor = 0;
  const voiceoverChunks = chunkFiles.map((file, i) => {
    const dur = ffprobeDuration(file);
    const entry = { start: cursor, end: cursor + dur, label: CHUNKS[i].label };
    cursor += dur;
    return entry;
  });

  chunkFiles.forEach((f) => fs.unlinkSync(f)); // keep only the merged file

  const out = `/* ─────────────── VOICEOVER DATA ───────────────
   Generated by scripts/generate-voiceover.js — do not hand-edit.
   Re-run that script after any change to CHUNKS in lesson-data.js to regenerate
   both the audio file and this file together, so text and audio stay in sync.
*/
const VOICEOVER_SRC = "audio/voiceover/reading-edition.mp3";
const VOICEOVER_CHUNKS = ${JSON.stringify(voiceoverChunks, null, 2)};
`;
  fs.writeFileSync(OUT_DATA_FILE, out);
  console.log(`Done. Wrote ${FINAL_MP3} and ${OUT_DATA_FILE}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
