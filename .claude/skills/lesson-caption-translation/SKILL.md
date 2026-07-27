---
name: lesson-caption-translation
description: Produce segment-level Hebrew (primary) + English (secondary) captions for a lesson's tashkeel'd transcript — the Watch/real-audio-caption experience. Use after a lesson's tashkeel pass is done, whenever a new lesson needs sentence-level translated captions (not word-by-word tap-to-translate glosses, which is a separate Reader-tab task).
---

# Segment-level Hebrew + English captions for a lesson

This is specifically the **sentence/segment-level** translation layer that
runs alongside real-audio captions and karaoke (`lesson-voice-karaoke`
architecture 3) — matching the Watch tab's existing pattern (see
`app/js/watch-captions-data.js`): one Hebrew line and one English line per
timed segment, not a word-by-word gloss. Don't confuse this with the Reader
tab's tap-to-translate feature, which glosses individual words/phrases on
demand and is a separate, later, per-word task with its own data shape.

## The translation hierarchy (already established project-wide)

- **Hebrew is always the primary gloss** — prominent, shown by default.
- **English is secondary** — present, but tucked behind a tap/toggle, never
  co-equal with Hebrew in the default view.
- This mirrors the project's core audience assumption: the learner thinks in
  Hebrew first (see `files/CONTENT_PROJECT_BRIEF.md`'s "The Hebrew-speaker
  lens"). Every new lesson's captions follow this, not just the Reader tab's
  word glosses.

## Translate the meaning, not the English

**Write the Hebrew gloss as its own dialect-aware translation of the Arabic,
not a mechanical retranslation of the English line.** Colloquial Arabic and
Hebrew don't map onto each other the same way MSA dictionaries would suggest
— translate each language directly from the source dialect text so idioms and
register come through naturally in both, rather than compounding translation
loss by relaying through English.

## Carry uncertainty flags forward, don't quietly resolve them

If the underlying `lesson-dialect-tashkeel` pass left a word or phrase flagged
as `[؟...]` (a genuine ASR/reconstruction uncertainty, not yet confirmed),
the translation for that segment should carry an analogous `[؟...]` flag on
the corresponding word/phrase in **both** Hebrew and English, rather than
translating confidently past it. A confidently-worded translation of an
uncertain source reads as more settled than it is — the flag needs to survive
the whole pipeline until a human resolves it, not just the first stage.

## Check for established terminology first

Recurring historical/political terms will keep coming up across lessons —
"النكبة"/הנכבה/the Nakba, "مناطق الـ48"/אזורי ה-48/the '48 areas, party names
(الجبهة الديمقراطية للسلام والمساواة, التجمع/Balad), place names (يافا/יפו/Jaffa,
اللد/לוד/Lod). **Check how an existing lesson already rendered a recurring
term before coining a fresh translation for it** — same precedent-first
discipline as `lesson-dialect-tashkeel`'s rule for common dialect words, one
layer downstream. Inconsistent translation of the same term across lessons
(e.g. "the Nakba" in one, "the 1948 catastrophe" in another) reads as
carelessness to a learner tracking vocabulary across the whole app.

## What this produces, and what's still separate

Output is one JSON record per segment: `{start, end, ar, he, en}` (`ar` being
the tashkeel'd source, not the raw ASR text). This is caption/subtitle data
for the real-audio playback experience — it is **not** the same text as a
lesson's separate Reader-style simplified essay (a different, rewritten
document with its own translation needs) and **not** a source for word-level
Vocab/root glosses (a separate extraction pass with its own per-word Hebrew +
English + root data, still to be formalized as its own skill).

## Verifying the result

Draft only, same "not teacher-reviewed" convention as every other AI-drafted
layer in this pipeline — flag it as such rather than presenting translations
as final. Spot-check a sample against the tashkeel'd Arabic side by side
before treating a batch as done; a translation that reads fluently in
isolation can still silently drift from what the source segment actually
says, especially on idiomatic or rhetorically dense passages.
