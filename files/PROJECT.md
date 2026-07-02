# Arabic Speech → Readable Learning Text

A language-learning app that turns videos of spoken (colloquial) Arabic into
study material: a cleaned, fully-voweled reading text synced with audio, plus
vocab lists, verb/conjugation references, and flashcards.

The end user is an intermediate learner of **spoken** Arabic (Palestinian /
Levantine dialect), not Modern Standard Arabic (fuṣḥā). Workflow validated with
a teacher: listen to the audio first, then read the text.

---

## Origin

This started as a one-off: a WhatsApp video of a ~7-minute live speech in
Palestinian/Jaffa colloquial Arabic (Abed Abu Shehadeh, Jaffa protest). We
produced a fully-voweled, cleaned-up reading edition as an RTL Word document.
It worked well enough in a real lesson that it's now the seed for this app.

The manual pipeline below is what the app should productize.

---

## Pipeline

### 1. Audio extraction
Input: `.mp4` (H.264 video, AAC audio). Extract to the format Whisper wants —
16kHz mono PCM WAV:

```bash
ffmpeg -y -i input.mp4 -ar 16000 -ac 1 -c:a pcm_s16le speech.wav
```

A 7-min clip → ~13 MB WAV. Prefer extracting audio over shipping full video
where only transcription is needed.

### 2. Transcription (local)
`faster-whisper`, model `large-v3`, **language forced to `ar`**. Auto-detect
wanders on noisy crowd audio; `large-v3` handles colloquial far better than
smaller models. VAD filter on.

```python
from faster_whisper import WhisperModel
model = WhisperModel("large-v3", device="cpu", compute_type="int8")  # cuda/float16 if GPU
segments, info = model.transcribe(
    "speech.wav", language="ar", beam_size=5, vad_filter=True
)
# KEEP segment-level timestamps (seg.start, seg.end, seg.text) end-to-end.
```

Raw Whisper output is a **draft**, never final: dialectal words get mis-heard,
run-ons happen, and some spans come out genuinely garbled.

### 3. Editing — the core value-add (iterative, human-in-the-loop)

Three passes, each further from the raw audio:

1. **Literal clean-up** — fix obvious ASR misfires, preserve the spoken
   register. (e.g. `الياقس/بيقس` → `اليأس`; `جنات الغزاز` → `حديقة الغزازوة`;
   `بيوت الأجر` → `بيوت العزا`.)
2. **Tashkīl (vocalization)** — add full diacritics reflecting **actual dialect
   pronunciation** (بِدّنا، إحنا، مِش، فِيش، هيك، هلّق), NOT MSA voweling.
   Colloquial has no fixed orthography → some choices are interpretive; flag them.
3. **Readability edition** — smooth spoken syntax into clean essay prose while
   keeping the dialect. Reconstruct garbled spots, clarify vague references,
   regularize tense markers/pronouns, make live repetitions read as deliberate.

**Critical principle:** every pass moves the text further from what was actually
said. For reconstructed/garbled spots, **the video is the only source of truth.**
Surface these as *uncertain* — don't silently smooth them. A learner needs to
know which words are the speaker's and which are inferred. Build editing as
review/accept, not full automation.

### 4. Document / render output
RTL `.docx` via `docx` (docx-js). Key settings:
- `bidirectional: true` on every paragraph
- `rightToLeft: true` on every TextRun
- `AlignmentType.JUSTIFIED` for clean Arabic line breaks
- Arabic font (Arial worked); ~26 half-pts body, ~36 title; line spacing ~360
- Centered title + dateline

Verify visually (convert to PDF headless, render pages to image) so RTL and
tashkīl don't silently break. Keep an equivalent visual check in the app.

---

## Target app (multi-tab, one video = one "lesson")

- **Reader** — cleaned voweled text with audio overlaid/synced on the same
  screen. Segment timestamps from step 2 enable line/word highlighting on
  playback and replay-this-line.
- **Vocab** — auto-extracted vocabulary from the text.
- **Verbs** — important verbs + conjugations (colloquial forms; dialect
  conjugation differs from MSA).
- **Flashcards** — spaced-repetition cards from vocab/verbs.

### Trilingual translations (Arabic → Hebrew AND English)
Every learner-facing gloss/translation should carry **both Hebrew and English**,
not one or the other. This applies across the UX — vocab entries, verb glosses,
and especially flashcards (a card front in Arabic should be able to show Hebrew
and English on the back). The user works across all three languages, so:
- Store Hebrew and English as separate fields, not a single "translation" blob.
- Let the UI toggle which target language(s) are shown (Hebrew only / English
  only / both), so cards can drill in either direction.
- Both target languages need their own dialect-aware review — a good Hebrew
  gloss for a colloquial Palestinian word isn't a mechanical translation of the
  English one.

---

## Design principles to carry in

- **Preserve segment-level timestamps end-to-end** — the hook for audio-text
  sync and per-line replay. Don't discard them after transcription.
- **Keep both the literal transcript and the reading edition.** The diff between
  them is itself a learning artifact (what was said vs. the clean version).
- **Dialect-awareness is the whole point.** Anything defaulting to MSA (voweling,
  conjugation tables, dictionary lookups) will be subtly wrong. Flag interpretive
  dialect choices rather than presenting them as fixed.
- **Standard Arabic NLP tools are trained on MSA** and stumble on colloquial.
  Plan to lean on an LLM with dialect-specific prompting for vocab/verb
  extraction, and let the user correct.
- **Human/teacher in the loop** for the editing stages — LLM-assisted, not
  fully automated.

---

## Stack notes
- `ffmpeg` for audio extraction
- `faster-whisper` (large-v3) for ASR — runs locally; needs model weights
  downloaded (not available in restricted sandboxes)
- `docx` (docx-js) for RTL Word export; headless `soffice` + `pdftoppm` for
  visual verification
- LLM (dialect-aware prompting) for the editing passes and vocab/verb extraction
