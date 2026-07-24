---
name: madrasa-translit
description: Apply and audit this project's Madrasa-sourced Hebrew transliteration (תעתיק) conventions for any lesson's Arabic content. Use whenever adding/editing a lesson's data.json, touching the Hebrew transliteration engine in app/js/app.js, or when the user asks to check/fix missing tashkeel, "clean up" transliteration, or reference the Madrasa style.
---

# Madrasa-style Hebrew transliteration (תעתיק)

This project's Hebrew-letter script mode is a mechanical per-letter pass over
already-voweled Arabic (`transliterateArabicHebrew()` in `app/js/app.js`), not
an LLM guessing at pronunciation. Its letter/niqqud conventions were reverse-
engineered from a real published source rather than invented from scratch —
use this skill to stay consistent with that source when touching the engine,
and to audit any lesson's content for the tashkeel gaps that make the feature
look "too dense" or "missing niqqud" in some spots.

## The source

**Madrasa** (מדרסה) — [milon.madrasafree.com](https://milon.madrasafree.com), a
spoken-Arabic dictionary built for Hebrew speakers. Its public
[transliteration guide](https://milon.madrasafree.com/guide.asp) documents the
consonant table and niqqud conventions. **Do not trust the guide's own
illustrative examples at face value** — verify against *live dictionary
entries* (e.g. the "דוגמאות חיות מהמילון" section, or any `/word.asp?id=`
page) by inspecting actual Unicode codepoints, not by eyeballing a screenshot.
The guide table and the live data have been caught disagreeing before (see
below) — the live data wins.

**How to inspect codepoints instead of guessing from a screenshot** (a
screenshot at normal zoom will not reliably distinguish a combining mark from
a dagesh — this project got it wrong once doing exactly that):

```js
// javascript_tool, in the page context
const html = document.documentElement.outerHTML;
const idx = html.indexOf('<some known substring>');
const snippet = html.slice(idx, idx + 40);
JSON.stringify([...snippet].map(c => 'U+' + c.codePointAt(0).toString(16).toUpperCase() + ' (' + c + ')'));
```

**Sweep the whole guide before concluding "that's everything."** The guide has
several sections beyond the main consonant/vowel tables — a short "עוד סימנים
שכדאי להכיר" (more signs worth knowing) table near the bottom is easy to skip
past and is where the ى and آ conventions below came from, found only on a
second, more careful pass. Fetch the full page (`document.documentElement.outerHTML`)
once and read all of it rather than stopping at the first table that looks
complete.

## Confirmed conventions (verified against live entries, codepoint by codepoint)

- **Consonants** — ج→ג׳, ح→ח, خ→ח׳, ص→צ, ض→צ׳, ط→ט, ع→ע, غ→ע׳, ق→ק. Full table
  in `app/js/app.js` (`TRANSLIT_CONSONANTS`) and `files/TRANSLITERATION.md`.
- **ى (alif maksura) → א, not י.** It's a spelling variant of long *a* (e.g.
  عَلَى "on"), not an "i"/"y" sound — confirmed directly from the guide's own
  table (على → עַלַא, ending in bare א). Easy to get wrong by pattern-matching
  on the *letter shape* (it looks like a dotless ي) instead of what it
  actually represents.
- **آ (alif-madda) → אַא, not a single א.** Hamza + inherent long *a* — render
  as patach+bare-alef (two characters) to visually distinguish it from a
  plain short/long a. Confirmed from the guide's own table (آخر → אַאחֵ׳ר).
- **Short vowels** — fatha/damma/kasra → patach/kubutz/hiriq (standard).
- **ב and כ always take a dagesh** (בּ/כּ) — Arabic ب/ك are *always* the hard
  b/k sound, never Hebrew's own soft v/kh alternation, so the dagesh is
  unconditional (not the Hebrew grammar rule of "only after a sukun or
  word-initially") — every ب and every ك, regardless of position or vowel.
- **Gemination (shadda)** — a single letter + niqqud + **the literal Arabic
  shadda character (U+0651) reused on top of the Hebrew letter**, e.g. דّ —
  ***not*** a doubled letter, and ***not*** a Hebrew dagesh (U+05BC). Order in
  the string is `letter + niqqud + shadda`. Confirmed from two independent
  live dictionary examples (בַדّי for بِدِّي, and עַ(אל)נַّאר for النار) both
  using U+0651; the guide page's own static illustrative table used a dagesh
  instead — that's the outlier, not the rule, and should not be copied.
- **Definite article's silent lam** — ال before a doubled sun letter: keep the
  lam visible in parentheses, `(ל)`, rather than dropping it silently. E.g.
  `אֵ(ל)שַّמֵס` for الشمس.
- **Long vowels involving a mater vav move the mark onto the vav itself, not
  the preceding consonant** — real Hebrew orthography distinguishes "no
  mater" (קוּבּוץ dot-under-consonant, חוֹלם-חסר dot-on-consonant) from "mater
  present" (שׁוּרוּק dot-in-the-vav, חוֹלם-מלא dot-on-the-vav), and Arabic's own
  mater spelling (damma/fatha + a following bare و) is exactly the
  "mater present" case. So: damma + bare mater-و → **shuruk** (dot *inside*
  the ו, e.g. أَبُو → אַבּוּ, not אַבֻו); fatha + a silent glide-و (dialectal
  *aw→o*) → **cholam on the ו** (e.g. يَوْم → יוֹם-shape, not cholam on the
  preceding letter). **Yod does not behave this way** — hiriq/tsere before a
  mater-י stay on the preceding consonant either way (fatha + silent glide-ي,
  dialectal *ay→e* → tsere stays on the consonant, e.g. بَيْت → בֵּית "beit").
  This vav/yod asymmetry is real, standard Hebrew spelling behavior, not a
  simplification — don't "fix" it into symmetry.
- **Word-final מ/נ/צ/פ/כ → sofit forms** (ם/ן/ץ/ף/ך), including when the
  letter carries trailing niqqud, a gemination mark, or a geresh mod (e.g.
  أَرْض → אַרץ׳, sofit tsadi *with* its geresh intact). Word boundary = end of
  string or the next character isn't a Hebrew letter/mark — not just
  whitespace, since a lesson string can end in Arabic punctuation.

## Auditing a lesson's data.json for missing tashkeel

The philosophy for lesson content is "fully voweled to reflect real dialect
pronunciation" — a word with **zero** tashkeel marks anywhere is very likely a
gap, not a style choice (exception: see false positives below). Run this scan
against a lesson's `data.json` (adjust field names if a lesson's schema
differs from `app/lessons/*/data.json`):

```js
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const TASHKEEL = /[ً-ْٰ]/;
const HAS_ARABIC = /[ء-يٮ-ۓ]/;
const bare = [];
function walk(node, path) {
  if (node == null) return;
  if (Array.isArray(node)) { node.forEach((v, i) => walk(v, path + '[' + i + ']')); return; }
  if (typeof node === 'object') {
    for (const k of Object.keys(node)) {
      // root: intentionally vowelless (a root is a consonant skeleton, not a word).
      // he/en: not Arabic. punct: not Arabic. dialectNote/context: inline citations
      // that are never run through arText(), so they're always shown as raw Arabic
      // regardless of script mode -- not a transliteration gap.
      if (['root', 'he', 'en', 'punct', 'dialectNote', 'context'].includes(k)) continue;
      // watchCaptions: raw ASR transcript, deliberately NOT the voweled reading
      // edition -- exclude unless the user explicitly asks to cover Watch captions too.
      if (k === 'watchCaptions') continue;
      walk(node[k], path + '.' + k);
    }
    return;
  }
  if (typeof node === 'string' && HAS_ARABIC.test(node) && !TASHKEEL.test(node)) {
    bare.push({ path, value: node });
  }
}
walk(data, 'data');
console.log('Bare Arabic strings:', bare.length);
const seen = new Set();
for (const b of bare) { if (!seen.has(b.value)) { seen.add(b.value); console.log(b.path, JSON.stringify(b.value)); } }
```

## Fixing what the audit finds

1. **Check for an already-voweled sibling first.** Search the same file for
   the bare string with tashkeel stripped (`value.replace(/[ً-ْٰ]/g, '')`)
   matching an already-voweled string elsewhere — reuse that exact form
   rather than inventing a new vowel choice. This project's data is
   internally inconsistent in places (e.g. one verb's plural participle uses
   a syncopated sukun where the singular uses a full kasra) — when a sibling
   form exists, prefer matching the established in-file pattern over "textbook
   correct" grammar, since the data's own house style is the more relevant
   ground truth for consistency.
2. **Don't fabricate vowels you're not confident about.** For genuinely novel
   words with no sibling precedent, apply real Palestinian/Levantine dialect
   knowledge, but flag anything nontrivial (this project already has a
   "draft, not teacher-reviewed" convention for exactly this — see
   `AI-PROCESS.md`).
3. **Watch for false positives** — some "bare" hits are correct as-is and
   should NOT be touched: a hollow-verb imperative or a ل"י-root participle
   that's pure consonant+long-vowel-mater+consonant (e.g. كون, عيش, جاي, تعال)
   genuinely has no short vowel to mark — Madrasa's own dictionary and this
   project's own already-voweled present-tense rows both leave these bare.
   Check whether a *word* has zero marks anywhere in its own well-established
   paradigm (e.g. compare against the verb's other, already-voweled
   conjugation rows) before assuming it needs a fix.
4. **Static HTML mirrors data.json.** At least one lesson keeps a duplicate of
   a header string as static markup (`lesson-title-ar`/`lesson-location-ar` in
   `lesson.html`) that is read once into a JS variable and never re-synced
   from `data.json`. If you fix a string in `data.json`, grep the
   corresponding `lesson.html` for the same Arabic text and fix it there too,
   or the fix won't actually render.

## What NOT to do

- Don't add a generic shva/sukun marker to every vowelless consonant "for
  completeness" — this project tested that idea and rejected it; real
  Palestinian dialect often elides short vowels entirely in ways a generic
  shva-insertion rule would get wrong (see the case-study note in
  `AI-PROCESS.md`'s Transliteration section).
- Don't touch `app/js/lesson-data.js`, `verbs-data.js`, or
  `watch-captions-data.js` — these are dead/legacy files superseded by
  `app/lessons/*/data.json`; nothing loads them anymore.
- Don't assume a browser reload picked up a data.json/lesson.html edit —
  Python's `http.server` doesn't set cache-control headers and Chrome will
  happily serve a stale cached copy of both the JSON and the HTML on a normal
  navigation. Hard-reload (`ctrl+shift+r`) after any edit before trusting what
  you see, and prefer `get_page_text`/direct Unicode inspection over reading
  niqqud off a screenshot — small combining marks are easy to misread at
  normal zoom (this project got the shadda-vs-dagesh question wrong once
  exactly this way).
