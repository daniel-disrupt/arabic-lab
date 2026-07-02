# Data Schema Sketch

A starting point, not gospel — adjust as the app takes shape. Modeled around
one video = one **lesson**, with segments as the backbone (they carry the audio
sync and tie everything together).

```
Lesson
  id
  title                     # e.g. "Abu Shehadeh — Jaffa protest"
  source_note               # provenance: where the video came from
  dialect                   # e.g. "palestinian" — drives voweling/conjugation logic
  created_at
  audio_path                # extracted 16kHz mono WAV
  video_path                # optional, kept for source-of-truth reference
  duration_s

Segment                     # one Whisper segment; the sync backbone
  id
  lesson_id -> Lesson
  index                     # order within lesson
  start_s                   # KEEP these — audio-text sync depends on them
  end_s
  text_raw                  # literal ASR output (draft)
  text_clean                # after literal clean-up pass
  text_voweled              # after tashkīl pass
  text_reading              # after readability pass (final display text)
  confidence                # "certain" | "uncertain" | "reconstructed"
                            # -> uncertain/reconstructed flagged in UI;
                            #    video is source of truth for these

VocabItem
  id
  lesson_id -> Lesson
  segment_id -> Segment     # where it first appears (enables jump-to-context)
  surface                   # word as it appears in text (voweled)
  lemma                     # dictionary/base form (dialect-aware)
  gloss_he                  # Hebrew meaning (dialect-aware, not derived from EN)
  gloss_en                  # English meaning
  part_of_speech
  note                      # dialect-specific usage note, optional

Verb                        # verbs get richer treatment than plain vocab
  id
  lesson_id -> Lesson
  segment_id -> Segment
  lemma                     # base form
  root                      # triliteral/quadriliteral root, if applicable
  gloss_he                  # Hebrew meaning
  gloss_en                  # English meaning
  conjugations              # JSON: dialect forms (NOT MSA defaults)
                            #   e.g. { "past": {...}, "present": {...},
                            #          "imperative": {...} }
  note

Flashcard
  id
  lesson_id -> Lesson
  front                     # prompt (word / verb / phrase, in Arabic)
  back_he                   # Hebrew answer (gloss / conjugation)
  back_en                   # English answer
                            # UI toggles which target(s) show: HE / EN / both;
                            # cards can also drill in reverse (HE or EN -> AR)
  source_type               # "vocab" | "verb"
  source_id                 # -> VocabItem or Verb
  # spaced-repetition state
  ease
  interval_days
  due_at
  reps
```

## Relationships at a glance
- A **Lesson** has many **Segments** (ordered by `index`, timed by `start_s`).
- **VocabItem** / **Verb** each point back to the **Segment** they came from,
  so the UI can jump to (and replay) the line where a word appears.
- **Flashcard** references its origin vocab/verb so edits propagate and cards
  stay linked to context.

## Notes
- The four `text_*` fields on Segment mirror the editing pipeline stages. Storing
  all of them (not just the final) preserves the raw-vs-clean diff, which is a
  learning artifact in its own right.
- `confidence` is what powers the "don't silently smooth garbled spots" rule —
  reconstructed segments render differently and point the user back to the video.
- Conjugations and lemmas are **dialect-aware**; don't populate them from MSA
  tooling without review.
- **Glosses are trilingual by design:** Hebrew and English are stored as
  separate fields (`gloss_he`/`gloss_en`, `back_he`/`back_en`) across vocab,
  verbs, and flashcards. Both need dialect-aware review — the Hebrew gloss for a
  colloquial word is not a mechanical translation of the English. The UI toggles
  which target language(s) show and supports reverse drilling (HE or EN → AR).
- Spaced-repetition fields on Flashcard are a minimal SM-2-style set; swap for
  whatever SRS algorithm you land on.
```
