---
name: lesson-dialect-tashkeel
description: Apply full Palestinian/Levantine dialect diacritics (tashkeel) to a lesson's literal-cleanup transcript. Use after a lesson's literal-cleanup pass is done and before word-level karaoke alignment or Hebrew transliteration — whenever a new lesson's Arabic text needs voweling, or the user asks to "add tashkeel" / "vowel this" / "diacritize" a transcript.
---

# Dialect tashkeel for a new lesson

Colloquial Palestinian Arabic has no fixed, standardized orthography — two
competent writers spell the same spoken word differently. Full diacritics
aren't a nicety here, they're the only way to pin down *which* dialect
pronunciation is intended at all (بِدّنا vs بدنا, مِش vs مش, هلّق) — see
`files/CONTENT_PROJECT_BRIEF.md`'s "Why tashkīl matters here specifically."
This skill is about doing that voweling pass consistently across lessons, not
about the Hebrew transliteration that gets mechanically derived from it
afterward — see `madrasa-translit` for that separate, downstream step.

## Where this fits in the pipeline

The project's established 3-stage editing sequence (see
`files/CONTENT_PROJECT_BRIEF.md`'s "Editing" pipeline stage) is:
1. **Literal clean-up** — fix obvious ASR misfires, keep the spoken register.
2. **Tashkeel** — full diacritics for actual dialect pronunciation (this skill).
3. **Readability edition** — smooth spoken syntax into clean essay prose.

Tashkeel is applied to stage 1's output (the literal-cleanup transcript,
still in the speaker's own spoken register), **not** to stage 3's smoothed
essay. The essay is different text (reconstructed syntax, clarified
references, regularized pronouns) and needs its own separate tashkeel pass
when it's written — don't assume voweling the literal transcript covers it.
This distinction also matters for `lesson-voice-karaoke`: a tashkeel'd
literal-cleanup transcript is what stays reliably alignable to real audio
(architecture 3, ~87-93% match); the tashkeel'd *essay* is what pairs with a
TTS voiceover instead (architecture 1), not with the real recording.

## The single most important rule: check for precedent first

**Before voweling any common/recurring word from scratch, search existing
lessons' `data.json` files (and this project's `files/TRANSLITERATION.md` /
prior lesson transcripts) for how that word was already voweled.** Function
words and high-frequency dialect words (يعني, هيك, هلأ, مش, بِدّي/بِدُّه, كمان,
إحنا/احنا, بَس, كِتير/كْتير, شو, وين, لِيش) recur constantly across lessons —
inventing a fresh vowel choice per lesson risks silent inconsistency across
the app (e.g. كْتير in one lesson, كَتير in another, for the exact same word).
This mirrors `madrasa-translit`'s own established rule for the Hebrew side
("check for an already-voweled sibling first... this project's data is
internally inconsistent in places... prefer matching the established in-file
pattern over 'textbook correct' grammar") — the same discipline applies one
layer earlier, to the Arabic tashkeel itself, and hasn't been formalized
until now. **Known gap:** the first full tashkeel pass done under this skill
(Sami Abu Shehadeh's Jaffa-story lesson) was voweled from dialect knowledge
alone, without this cross-check — treat its common-word choices as a
starting draft to reconcile against Abed's/Proverbs' existing data, not as
the established precedent to copy forward uncritically.

## Applying tashkeel

- Full diacritics on every word — not just "hard" cases. A word with zero
  tashkeel marks is a gap (same detection logic as `madrasa-translit`'s audit
  script applies here too, one stage earlier).
- Dialect forms, never MSA — see the project's blanket "no MSA anywhere"
  rule. Present tense takes the dialectal بِـ/عَم prefix pattern, not MSA's
  bare indicative; negation is مِش/ما...ش, not MSA's لا/لم.
- **Don't fabricate a vowel you're not confident about.** For a genuinely
  ambiguous or unclear ASR word/phrase, mark it inline as `[؟best-guess]`
  rather than silently picking one reading and presenting it as settled —
  same convention already used for uncertain literal-cleanup reconstructions.
  These flagged spots need a human check against the actual audio before
  being finalized (a teacher/reviewer, or the user re-listening themselves).
- Numbers, standalone digits/percentages, and proper nouns already spelled in
  Latin script are left as-is — tashkeel applies to Arabic words, not to
  transliterated figures.
- Match an established paradigm's pattern when one exists in-file before
  applying "textbook" dialect grammar — e.g. if a verb's other conjugated
  forms in the same transcript already settled on a particular
  sukun/kasra choice for a shared root, stay consistent with that rather than
  re-deriving from first principles each time it recurs.

## Verifying the result

- Render as RTL `.docx` (or view directly in the app once wired in) and
  visually check — small diacritics are easy to misplace or drop silently in
  plain-text editing, and this project has been burned before by trusting
  raw text/markup over an actual rendered check (see `madrasa-translit`'s
  shadda-vs-dagesh case study for the same category of mistake one layer
  downstream).
- Flag the whole pass as a draft, not teacher-reviewed, consistent with this
  project's established human-in-the-loop convention (see the verb-card
  "טיוטה · טרם נבדק" badge precedent) — don't present AI-drafted tashkeel as
  settled fact.
