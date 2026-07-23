# Arabic → Latin-script Transliteration Conventions (תעתיק / English)

Locked-in starting convention for rendering learning content (Watch/Read/Vocab/Verbs)
in a non-Arabic script, for learners who want it — now covering **two** target
scripts: Hebrew letters (תעתיק) and English/Latin letters. Not gospel — tweak the
tables below as real Jaffa-dialect audio gives reason to.

Both scripts are driven by the same source: fully-voweled Arabic text. The mechanical
per-character walk (see [TRANSLITERATION_IMPLEMENTATION.md](TRANSLITERATION_IMPLEMENTATION.md))
is shared in spirit, but the Hebrew and English engines are NOT identical — see
"English-specific complications" below for the ways Latin script needs more logic than
Hebrew did.

## Hebrew (תעתיק) consonant table

Based on two real precedents, chosen over the Academy of the Hebrew Language's formal
media/place-name standard because this app is pedagogical and dialect-specific, closer
to Madrasa's use case:
- **Madrasa** (מדרסה) — spoken-Arabic dictionary/app for Hebrew speakers (closest match
  to this app's use case)
- **Academy of the Hebrew Language** — formal standard, used mainly to sanity-check the
  "plain vs geresh" calls on emphatics

| Arabic | Hebrew | Notes |
|---|---|---|
| ا | א | |
| ب | ב | |
| ت | ת | |
| ث | ת | Locked to plain ת (not ת׳) — urban Levantine dialects (Jaffa included) mostly collapse ث into /t/ in actual speech. Revisit only if the source audio clearly keeps the interdental. |
| ج | ג׳ | Assumes /dʒ/ (like ג'ינס "jeans"). Hebrew also has ז׳ for /ʒ/ (like ז'קט "jacket") — if Jaffa speakers in the source audio sound more like the French/ʒ/ version, swap to ז׳. |
| ح | ח | |
| خ | ח׳ | |
| د | ד | |
| ذ | ד | Same logic as ث — collapses to /d/ in this dialect. |
| ر | ר | |
| ز | ז | |
| س | ס | |
| ش | ש | |
| ص | צ | |
| ض | צ׳ | |
| ط | ט | Plain ט, not ט׳ — Hebrew ט is already the historical reflex of ط, so no geresh needed for a learner-facing table. |
| ظ | צ׳ | Treated same as ض — colloquial Palestinian generally merges ظ into the ض pronunciation. |
| ع | ע | |
| غ | ע׳ | |
| ف | פ | |
| ق | ק | Locked to etymological ק even though Jaffa urban speech usually realizes ق as a glottal stop (قال ≈ "aal", not "qaal"). Kept as ק to preserve root/spelling consistency across Reader/Vocab/Verbs — the Arabic script + audio alongside it is what teaches the actual sound. Revisit if that turns out confusing in practice. |
| ك | כ | |
| ل | ל | |
| م | מ | |
| ن | נ | |
| ه | ה | |
| و | ו | consonant /w/; also long vowel /u,o/ — see vowels below |
| ي | י | consonant /y/; also long vowel /i,e/ — see vowels below |
| ء (hamza) | א | |

## Hebrew vowels

Use full Hebrew niqqud on the transliteration, matching the app's existing tashkīl-first
philosophy (this is not a bare consonant skeleton):
- Short vowels → niqqud points on the preceding consonant (patach/a, chirik/i, kubutz/u)
- Long vowels → matres lectionis (א for ā, ו for ū/ō, י for ī/ē)

Because the source Arabic is already fully voweled to reflect real dialect pronunciation
(including shadda and ال-assimilation), transliteration can mostly be a **mechanical
per-character pass over the voweled Arabic string** using the table above, rather than a
separately-authored field per word.

## English (Latin) consonant table

Style chosen: **simplified/ASCII-friendly** — no diacritics, digraphs for the sounds
English doesn't have a single letter for, closer to informal "Arabizi" conventions than
to academic (IJMES/ALA-LC) romanization. Emphatics/pharyngeals that would normally need a
dot-under diacritic (ḥ/ṣ/ḍ/ṭ) are instead marked by **capitalizing** the plain letter —
a real no-diacritic convention (seen in some Peace Corps-style materials) instead of
inventing digraphs for them or falling back to Arabizi digits (7/3/9) which read as noise
mid-sentence in prose.

| Arabic | Latin | Notes |
|---|---|---|
| ا | a | Long vowel matres (see vowels); also the bare hamza-carrier with no sound of its own. |
| ب | b | |
| ت | t | |
| ث | t | Same dialect merger as Hebrew ث→ת — collapses to /t/. |
| ج | j | /dʒ/ like English "jeans" — matches the Hebrew ג׳ assumption. |
| ح | H | Capitalized to distinguish the pharyngeal from ه (h) without a diacritic. |
| خ | kh | Standard digraph (as in "sheikh", "khalas"). |
| د | d | |
| ذ | d | Same merger as Hebrew ذ→ד. |
| ر | r | |
| ز | z | |
| س | s | |
| ش | sh | |
| ص | S | Capitalized emphatic, same logic as ح→H. |
| ض | D | Capitalized; collapsed with ظ, same colloquial merger as Hebrew ض/ظ→צ׳. |
| ط | T | Capitalized emphatic. |
| ظ | D | Treated same as ض — see above. |
| ع | ' | Apostrophe. Same shared slot as ء (hamza) below — mirrors Hebrew mapping both to א. |
| غ | gh | Standard digraph (as in "Baghdad", "Ghassan"). |
| ف | f | |
| ق | q | Kept etymological (not a glottal-stop spelling) — same reasoning as Hebrew ق→ק: preserves root/spelling consistency; the Arabic script + audio alongside it teach the real sound. |
| ك | k | |
| ل | l | |
| م | m | |
| ن | n | |
| ه | h | |
| و | w | consonant /w/; also long vowel /u,o/ — see English-specific complications below. |
| ي | y | consonant /y/; also long vowel /i,e/ — see English-specific complications below. |
| ء (hamza) | ' | Same apostrophe slot as ع. |

## English vowels

- Short vowels → a, i, u (plain letters, no marking needed since Latin has no niqqud
  equivalent to piggyback on).
- Long vowels → doubled letter: ā→**aa**, ī→**ee**, ū→**oo**.

## English-specific complications (no Hebrew equivalent)

Hebrew got two things for free that Latin script doesn't:

1. **Consonant/long-vowel ambiguity for و and ي.** In Hebrew, ו and י are used
   identically whether they're acting as the consonant (/w/, /y/) or as a long-vowel
   mater lectionis (/u,o/ or /i,e/) — same letter either way, so the Hebrew engine needs
   no special-casing. In Latin, "w"/"y" (consonant) and "oo"/"ee" (long vowel) are
   **different letters**, so the English engine must actually detect which role و/ي is
   playing: if a damma precedes و (and و itself is unvowelled/sukun) → render as **oo**
   and suppress the "w"; if a kasra precedes ي the same way → render as **ee** and
   suppress the "y". This is new logic, not a straight port of the Hebrew per-character
   loop — see the implementation doc.
2. **Reading direction.** Hebrew is RTL, same as Arabic, so swapping Arabic→Hebrew text
   in place doesn't disturb layout. English is LTR — transliterated spans/words need
   `dir="ltr"` (or equivalent) wherever they render, or Latin words will visually
   reverse inside an RTL flow. Flagged in the implementation doc's architecture section.

## Rules shared by both scripts

- **ال (definite article)**: reflect actual pronunciation, not the written ل — i.e. if the
  voweled Arabic already shows sun-letter assimilation (e.g. النهار pronounced "in-nhar"),
  transliterate the assimilated form (doubled consonant), not a literal ל/l.
- **ة (ta marbuta)**: construct state (followed by a vowel/suffix in the voweled text) →
  ת / **t**. Pause form (word-final, no following vowel) → ה in Hebrew; in English there's
  no equally clean silent-letter equivalent, so it's **dropped** (just the preceding vowel,
  no trailing consonant) — flagged as an open item below.
- **Shadda (gemination)**: double the corresponding letter, driven directly by the shadda
  already marked in the voweled Arabic. In English this can double a digraph (e.g. ش
  geminated → "shsh"), which is intentional, not a bug.

## Open items to revisit against real audio

Hebrew judgment calls (dialect, not settled linguistics):
1. ق as ק (etymological) vs. glottal-stop-honest alternative — see note above.
2. ج as ג׳ vs ז׳ depending on how this speaker actually pronounces it.
3. ث/ذ/ظ collapsed to ת/ד/צ׳ — correct for urban colloquial merger, but check if the
   authored Arabic text ever spells these with the "wrong" letter for effect/formality.

English-specific:
4. Capitalization-for-emphatics (H/S/D/T) — readable enough for a casual learner, or too
   subtle/easy to miss compared to Hebrew's geresh mark? Revisit once there's real content
   to eyeball.
5. ta marbuta pause form dropped entirely vs. writing a trailing "h" (e.g. "madrase" vs
   "madraseh") — Hebrew's ה has no equally clean English analogue; pick whichever reads
   better once there's real lesson text to test against.
6. ع and ء sharing one apostrophe glyph may be harder to parse in English than in Hebrew
   (apostrophes already carry meaning in English for contractions/elision) — consider
   distinguishing them if real content shows the ambiguity actually causing confusion.
