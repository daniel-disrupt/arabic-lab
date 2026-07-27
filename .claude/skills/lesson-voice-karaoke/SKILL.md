---
name: lesson-voice-karaoke
description: Add TTS or real-recording voice audio + word-level karaoke highlighting to a lesson (or a new lesson's items). Use when a lesson needs a pronounce/play button with synced word highlighting, when generating or regenerating audio for an existing lesson (Proverbs, Reader, Watch, or a future one), or when the user asks for "voice", "audio", "karaoke", or "pronunciation" on lesson content.
---

# Voice audio + karaoke highlighting for a lesson

This project has three working, shipped-or-proven implementations of "play
audio, highlight the current word as it plays." Before writing anything new,
identify which shape a lesson needs — the UI/CSS/highlight machinery already
exists for all three and essentially never needs new JS or CSS; the only real
work is usually the audio/timing-generation script.

## The three architectures

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

**3. Real recording, direct alignment** (the Watch tab pattern, and now
generalized — first done ad hoc for `abed-jaffa-speech`'s Watch tab, later
turned into a reusable script for the Sami Abu Shehadeh Jaffa-story lesson).
No TTS involved at all: the lesson's audio *is* a real recording (a podcast
excerpt, an interview, a speech), and a literal-cleanup transcript of that same
recording is aligned directly against it. Driver script:
`scripts/align-real-audio-words.py <audio.wav> <transcript.txt> <output.json>`
— one whisper pass with `word_timestamps=True` over the whole file, then
per-segment-windowed fuzzy matching (same `best_partition` algorithm as
`align-voiceover-words.py`, see below) against the known transcript text.
Output is `[{idx, word, start?, end?}, ...]` with global word indices, same
convention as the lesson-wide TTS shape — feed it into the same
`wordEls[].globalIdx` / `data-gi` rendering pattern. Use this shape when the
lesson's own real audio (not a synthesized voiceover) should drive playback —
e.g. an interview/speech clip where hearing the actual person's voice matters,
as opposed to Reader-style lessons where a clean synthesized narration is
preferred.

All three shapes share the same core UI primitives in `app/js/app.js`:
`findActiveTimedIndex(sortedTimedWords, time)` (the generic "which word is
active at time t" lookup, given a `{idx,t}[]` sorted by `t`), and per-word
`data-gi="<idx>"` stamps on rendered word spans that the highlight targets via
`querySelector('[data-gi="' + idx + '"]')`. `app/css/style.css` already has
the `.live` highlight style and `.pronounce`/`.playing` button states — a new
lesson using either shape typically needs **zero new CSS or JS**, only a
render helper that stamps `data-gi` the same way `proverbWordsHtml()` (per-item
shape) or `buildReader()` (lesson-wide shape) already do.

## The core reliability principle

Word-level alignment reliability runs on a spectrum, from most to least
trustworthy, depending on how far the "known" text is from what's literally
in the audio:

1. **TTS-synthesized directly from the same text being aligned back to**
   (architectures 1 and 2 above) — closest to forced alignment, since there's
   no rephrasing/reordering between what was said and what's written.
2. **A real recording aligned against its own literal-cleanup transcript**
   (architecture 3) — the transcript is a lightly-corrected version of what
   was actually said (obvious ASR misfires fixed, but not smoothed into essay
   prose), so it stays very close to forced-alignment quality. Measured at
   **~87-93%** across two real cases: the original Watch tab (`abed-jaffa-speech`,
   ~87%) and the Sami Abu Shehadeh Jaffa-story lesson (92.7%, 1020/1100 words,
   using `align-real-audio-words.py`'s segment-windowed fuzzy matching).
3. **A real recording aligned against a heavily *rewritten* reading-edition
   essay** — the least reliable case, only ~65% (see
   `files/CONTENT_PROJECT_BRIEF.md`'s pilot notes), because the essay's
   smoothed spoken syntax and reconstructed phrasing genuinely diverges from
   what was said. Avoid this combination if avoidable — prefer case 2's
   literal-cleanup transcript for anything that needs to stay audio-synced,
   and reserve the fully-rewritten essay for a separate Reader-style text
   (optionally with its own TTS voiceover, architecture 1) rather than trying
   to sync it to the real recording directly.

Regardless of which case applies:

- **Always print/inspect the per-item match rate** (words aligned / total
  words). All three driver scripts do this already — don't skip it.
- **Never fabricate a timestamp** for a word the aligner didn't match. Leave
  it out of `wordTimes` entirely; the UI already handles a word with no
  matching `idx` by simply never highlighting it, rather than guessing.
- **A low match rate is often a tokenization mismatch, not a mishearing —
  check before accepting it as a hard limit.** On the Proverbs batch,
  `align-voiceover-words.py`'s exact-string matching initially missed words
  where faster-whisper heard the audio correctly but split one written word
  into two adjacent ASR tokens (منصلي heard as "من"+"صلي", عالكتاب heard as
  "على"+"الكتاب") or misheard a single letter of an unusual dialectal word
  (بِحُكّك heard as بحقك). The script now resolves this generally: for any
  `replace` span where the raw side has *at least as many* tokens as the known
  side, it finds the best way to group consecutive raw tokens (one or more per
  known word) and accepts a group if its concatenation is a close match —
  still using only an already-measured token's start time, never an
  interpolated one. The one direction it still won't touch, correctly: a
  `replace` span where raw has *fewer* tokens than known (some known words
  genuinely got absorbed/elided into a neighboring word with no distinct
  ASR-detectable boundary) — splitting that would mean guessing where inside
  a single measured span an unmeasured word boundary falls, which is
  fabrication. Confirmed by directly re-transcribing a stuck clip and reading
  the raw word list before concluding a gap was a real limitation rather than
  a fixable mismatch — do this before writing off a low rate as "just how
  good ASR gets."

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

If a new lesson is instead one continuous passage (lesson-wide shape), use
`scripts/generate-voiceover-for-lesson.js <slug>` (reads/writes that lesson's
own `app/lessons/<slug>/data.json` directly — the current architecture) rather
than the older `scripts/generate-voiceover.js`, which still targets the
retired hardcoded `app/js/lesson-data.js`/`voiceover-data.js` files nothing
loads anymore (kept only as historical reference for regenerating Abed's
original lesson if that ever comes up). Same underlying pipeline
(`align-voiceover-words.py`, ffmpeg concat) either way.

## Adding this to a new real-recording-style lesson

1. Prerequisites: the lesson's actual audio file (real recording, not
   synthesized) and a literal-cleanup transcript of it — segment-level
   `[start -> end] text` lines, obvious ASR misfires already fixed but *not*
   smoothed into essay prose (see the reliability principle above for why
   that distinction matters). Producing that transcript in the first place —
   sourcing the raw audio, scouting-pass transcription to find the relevant
   clip, high-quality re-transcription — is a separate, earlier pipeline step.
2. Run `python scripts/align-real-audio-words.py <audio.wav> <transcript.txt>
   <output.json>`. Inspect the printed match rate and any fuzzy-match lines
   before trusting the output — same standard as the TTS scripts.
3. Wire `output.json`'s `{idx, word, start}` entries into the lesson-wide
   `wordEls[].globalIdx` / `data-gi` rendering pattern (same as
   `voiceover-data.js` in architecture 1) — a word with no `start` key simply
   never highlights, by design.
4. Verify by ear + eye before committing, same as the other two shapes.

## Requirements

- Node 18+ (architectures 1 and 2's driver scripts use global `fetch` for the
  TTS API call) — **not needed** for architecture 3, which is pure Python.
- ffmpeg + ffprobe on PATH — for the lesson-wide TTS shape (concatenation +
  chunk-duration labels) and for preparing architecture 3's source audio
  (extracting/splicing the real recording); the per-item TTS shape needs
  neither.
- Python 3 + `faster-whisper` (`pip install faster-whisper`) — shared by all
  three shapes' alignment step, unmodified regardless of which driver script
  calls it. Architecture 3 needs *only* this (no API key at all).
- `OPENAI_API_KEY` env var for whichever driver script does the TTS
  synthesizing (architectures 1 and 2 only).
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
