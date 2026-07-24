---
name: lesson-voice-karaoke
description: Add TTS voice audio + word-level karaoke highlighting to a lesson (or a new lesson's items). Use when a lesson needs a pronounce/play button with synced word highlighting, when generating or regenerating audio for an existing lesson (Proverbs, Reader, or a future one), or when the user asks for "voice", "audio", "karaoke", or "pronunciation" on lesson content.
---

# Voice audio + karaoke highlighting for a lesson

This project has two working, shipped implementations of "play audio, highlight
the current word as it plays." Before writing anything new, identify which
shape a lesson needs — the UI/CSS/highlight machinery already exists for both
and essentially never needs new JS or CSS; the only real work is usually the
audio-generation script.

## The two architectures

**1. Lesson-wide single track, global word index** (the Reader/Watch pattern —
`abed-jaffa-speech`). One long recording covering the whole lesson;
`wordEls[].globalIdx` increments once per word across every chunk in reading
order; sync data lives in `app/js/voiceover-data.js`
(`VOICEOVER_SRC`/`VOICEOVER_CHUNKS`/`VOICEOVER_WORD_TIMES`). Driver script:
`scripts/generate-voiceover.js` (reads `CHUNKS` from `app/js/lesson-data.js`,
synthesizes one clip per chunk, concatenates with ffmpeg into one file,
aligns with `align-voiceover-words.py`). Use this shape for a lesson that's
fundamentally one continuous passage.

**2. Per-item independent clips, local word index** (the Proverbs/Flashcards
pattern — `favorite-proverbs`). Each item (a proverb) is its own standalone
unit with its own short clip and its own `{idx, t}` word-timing array, where
`idx` is 0-based *within that item* (`proverb.arWords[idx]`), not a lesson-wide
counter. Storage: `item.audio = {src, wordTimes}` directly in the lesson's
`data.json`, next to the item. Driver script:
`scripts/generate-proverb-audio.js` — copy this as the template for a new
per-item lesson (see "Adding this to a new lesson" below). Use this shape for
a lesson made of many small, discrete, independently-playable units: proverbs,
vocab items, single example sentences, etc.

Both shapes share the same core UI primitives in `app/js/app.js`:
`findActiveTimedIndex(sortedTimedWords, time)` (the generic "which word is
active at time t" lookup, given a `{idx,t}[]` sorted by `t`), and per-word
`data-gi="<idx>"` stamps on rendered word spans that the highlight targets via
`querySelector('[data-gi="' + idx + '"]')`. `app/css/style.css` already has
the `.live` highlight style and `.pronounce`/`.playing` button states — a new
lesson using either shape typically needs **zero new CSS or JS**, only a
render helper that stamps `data-gi` the same way `proverbWordsHtml()` (per-item
shape) or `buildReader()` (lesson-wide shape) already do.

## The core reliability principle

Word-level alignment is only trustworthy when the audio is **TTS-synthesized
directly from the same text being aligned back to** — that makes
faster-whisper's pass closer to forced alignment than free transcription,
since there's no rephrasing/reordering between what was said and what's
written. Alignment against a *real recording* of independently spoken content
is inherently lossy: the Reader's Watch-tab-vs-Reader-tab comparison found
~87% word match when aligning a raw recording to its own ASR transcript, but
only ~65% when aligning that same recording to a separately *edited* reading
text (see `files/CONTENT_PROJECT_BRIEF.md`'s pilot notes). For any new
TTS-synthesized-audio case, expect the reliable end of that range, but still:

- **Always print/inspect the per-item match rate** (words aligned / total
  words). Both driver scripts do this already — don't skip it.
- **Never fabricate a timestamp** for a word the aligner didn't match. Leave
  it out of `wordTimes` entirely; the UI already handles a word with no
  matching `idx` by simply never highlighting it, rather than guessing.

## Adding this to a new per-item-style lesson

1. Copy `scripts/generate-proverb-audio.js` to a new script named for the
   lesson (e.g. `scripts/generate-<slug>-audio.js`), and adjust:
   - `LESSON_DIR`/`DATA_FILE` to point at the new lesson's `app/lessons/<slug>/`.
   - The item-list field name (`data.proverbs` → whatever the new lesson's
     `data.json` calls its array of items) and the word-token field
     (`arWords` → whatever field holds that item's `{w, punct, sep}` tokens).
   - `proverbText()`'s join logic only if the new lesson's tokens differ from
     the standard `{w, punct, sep}` shape used project-wide (they almost
     certainly won't — this tokenization is already the norm for
     transliteration and tap-to-translate too).
   - `VOICE_INSTRUCTIONS` for the new content's actual register (a proverb
     reads differently from a vocab example sentence or a dialogue line —
     don't reuse "reciting a saying" wording for content that isn't sayings).
2. Make sure the new lesson's render helper stamps `data-gi="<idx>"` on each
   word span, and that its play button is gated on `!!(item.audio &&
   item.audio.src)` — copy the pattern from `proverbCardHtml()` /
   `playProverbAudio()` in `app.js` rather than writing new highlight logic.
3. Run the script (see Requirements below for what needs to be installed, and
   the API-key note — **never** paste a real key into a chat/agent session;
   export it in your own terminal and run the script there).
4. Verify a handful of items by ear + eye before committing: play button
   appears, audio plays, the correct word highlights in sync, and the printed
   match rate looks reasonable (investigate a suspiciously low rate before
   trusting the rest of the batch).
5. Commit the new audio files and the updated `data.json` together.

If a new lesson is instead one continuous passage (lesson-wide shape), follow
`scripts/generate-voiceover.js` and `scripts/align-voiceover-words.py`
directly — same alignment tool, different chunking/output wiring (ffmpeg
concat, `voiceover-data.js` output file instead of writing into `data.json`).

## Requirements

- Node 18+ (both driver scripts use global `fetch`)
- ffmpeg + ffprobe on PATH — **only** for the lesson-wide shape (concatenation
  + chunk-duration labels); the per-item shape needs neither.
- Python 3 + `faster-whisper` (`pip install faster-whisper`) — shared by both
  shapes via `align-voiceover-words.py`, unmodified regardless of which
  driver script calls it.
- `OPENAI_API_KEY` env var for whichever driver script does the synthesizing.
  **Export this in your own terminal and run the script there — never paste
  a real key into a Claude Code (or any agent) session.** If you're working
  with an agent on this, it should hand you the exact command to run
  yourself rather than asking for the key.

## What NOT to do

- Don't bend the lesson-wide shared-track mechanism to fit independent items
  (or vice versa) — `app.js`'s own comment on the Proverbs audio code block
  explains why these are deliberately separate mechanisms, not one
  generalized one forced to cover both cases.
- Don't skip the match-rate check "because the TTS case is usually reliable" —
  usually isn't always, and a silent gap just looks like a UI bug later.
- Don't have an agent run the synthesis step with a key typed into chat. Get
  the code ready, then hand the run to the user's own terminal.
