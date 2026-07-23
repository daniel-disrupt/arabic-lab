# Transliteration Feature — Implementation Plan (in progress, nothing coded yet)

Status: **planning/design done, zero code written**. This is the exact plan to resume from
next session. Scope: standalone `app/` (GitHub Pages) version only, not `cms/`.
Letter conventions are locked separately in [files/TRANSLITERATION.md](TRANSLITERATION.md) —
read that first.

## Architecture

Mirror the existing `appLang` pattern (`app/js/app.js:84` area) with a second, independent
global mode. Now **three-way** (`ar` / `translit-he` / `translit-en`), not two — English
added alongside the Hebrew תעתיק mode as its own script option, same axis:

```js
let scriptMode = localStorage.getItem('arabicLabScript') || 'ar'; // 'ar' | 'translit-he' | 'translit-en'
function arText(s) {
  if (scriptMode === 'translit-he') return transliterateArabicHebrew(s);
  if (scriptMode === 'translit-en') return transliterateArabicEnglish(s);
  return s;
}
function setScriptMode(mode) {
  scriptMode = mode;
  localStorage.setItem('arabicLabScript', mode);
  applyScriptMode();
}
function applyScriptMode() {
  const isTranslit = scriptMode !== 'ar';
  const dir = scriptMode === 'translit-en' ? 'ltr' : null; // English is LTR; ar/translit-he stay RTL — see note below
  document.body.classList.toggle('translit-mode', isTranslit); // shared: escape the Arabic font stack
  document.body.classList.toggle('translit-en-mode', scriptMode === 'translit-en'); // LTR-specific tweaks if any turn out to be needed beyond dir
  document.querySelectorAll('.script-switch-btn').forEach(b => b.classList.toggle('active', b.dataset.script === scriptMode));
  wordEls.forEach(({ el, data }) => { el.textContent = arText(data.w); el.dir = dir; }); // Reader words — data.w always pristine Arabic
  watchWordEls.forEach((el, i) => { el.textContent = arText(watchWordData[i].w); el.dir = dir; }); // needs new parallel `watchWordData` array, see below
  if (document.getElementById('lesson-title-ar')) { const e = document.getElementById('lesson-title-ar'); e.textContent = arText(lessonTitleArOriginal); e.dir = dir; }
  if (document.getElementById('lesson-location-ar')) { const e = document.getElementById('lesson-location-ar'); e.textContent = arText(lessonLocationArOriginal); e.dir = dir; }
  renderMobileCueOverlay(activeWatchCueIdx);
  renderVocabView();
  renderVerbsView();
  if (document.getElementById('tray').classList.contains('open')) closeTray(); // same "avoid stale mixed content" rule applyAppLang() already uses
}
```

**Why `dir` needs setting per-element, not just on `<body>`:** Hebrew is RTL like Arabic,
so `translit-he` doesn't disturb layout — a body-level class is enough. English is LTR, so
individual transliterated words/spans need `dir="ltr"` set directly wherever `arText()`
output lands, otherwise Latin text renders visually reversed inside the page's RTL flow.
`renderVocabView()`/`renderVerbsView()`/template-built HTML strings will need an inline
`dir="${dir==='ltr'?'ltr':'rtl'}"` (or similar) added to the relevant wrapper markup, not
just the `wordEls`/`watchWordEls` loops shown above — flag each site below.

Key rule decided (unchanged, applies to all translit modes): **punctuation glyphs
(word.punct, word.sep — ، ؟ etc.) are never transliterated** — only actual lexical Arabic
content (word.w, vocab `.ar`, verb `.ar`/`.arDisplay`/`.root`, conjugation `.ar` rows,
participle/masdar, WAZN_PATTERNS, HEADER_GLOSS `.ar`) goes through `arText()`. This avoids
a live-update bug where punctuation text nodes built once by `buildReader()` can't easily
be refreshed on toggle.

## The transliteration engine(s) (drafted, ready to paste into app.js)

Insert this new section right after `applyAppLang()` (app.js:200) and before `rootMetaHtml`
(app.js:201) — both are "global preference" logic. Two engines now, sharing tokenization
constants (`TRANSLIT_SUN_LETTERS`, `TRANSLIT_SUKUN`, `TRANSLIT_SHADDA`) but each with its
own consonant/vowel maps and — for English — extra logic Hebrew didn't need (see
[TRANSLITERATION.md](TRANSLITERATION.md)'s "English-specific complications" section).

### Hebrew engine

```js
/* ─────────────── TRANSLITERATION (ARABIC → HEBREW LETTERS, תעתיק) ───────────────
   Locked convention: files/TRANSLITERATION.md. Mechanical per-letter pass over the already-
   voweled Arabic text -- tashkeel already encodes real pronunciation (incl. shadda), so this
   walks it letter-by-letter rather than needing a separately-authored field. Three dialect
   judgment calls (ق as ק, ج as ג׳, ث/ذ/ظ collapsed) are flagged in that doc -- tweak
   TRANSLIT_CONSONANTS below if real Jaffa audio says otherwise. */
const TRANSLIT_CONSONANTS = {
  'ا':{letter:'א'}, 'ب':{letter:'ב'}, 'ت':{letter:'ת'}, 'ث':{letter:'ת'},
  'ج':{letter:'ג',mod:'׳'}, 'ح':{letter:'ח'}, 'خ':{letter:'ח',mod:'׳'},
  'د':{letter:'ד'}, 'ذ':{letter:'ד'}, 'ر':{letter:'ר'}, 'ز':{letter:'ז'},
  'س':{letter:'ס'}, 'ش':{letter:'ש'}, 'ص':{letter:'צ'}, 'ض':{letter:'צ',mod:'׳'},
  'ط':{letter:'ט'}, 'ظ':{letter:'צ',mod:'׳'}, 'ع':{letter:'ע'}, 'غ':{letter:'ע',mod:'׳'},
  'ف':{letter:'פ'}, 'ق':{letter:'ק'}, 'ك':{letter:'כ'}, 'ل':{letter:'ל'},
  'م':{letter:'מ'}, 'ن':{letter:'נ'}, 'ه':{letter:'ה'}, 'و':{letter:'ו'},
  'ي':{letter:'י'}, 'ء':{letter:'א'}, 'آ':{letter:'א'}, 'أ':{letter:'א'},
  'ؤ':{letter:'א'}, 'إ':{letter:'א'}, 'ئ':{letter:'א'},
  'ة':{letter:'ה'}, // ة ta marbuta -- overridden to ת in construct state below
  'ى':{letter:'י'}, // ى alif maksura
};
const TRANSLIT_SUN_LETTERS = new Set(['ت','ث','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ل','ن']);
const TRANSLIT_VOWEL_MARKS = {
  'َ':'ַ', 'ُ':'ֻ', 'ِ':'ִ', // fatha/damma/kasra -> patach/qubuts/hiriq
  'ً':'ַ', 'ٌ':'ֻ', 'ٍ':'ִ', // tanwin -> same, case ending dropped (not pronounced in dialect)
};
const TRANSLIT_SUKUN = 'ْ';
const TRANSLIT_SHADDA = 'ّ';
const TRANSLIT_PUNCT = { '،':',', '؟':'?', '؛':';' };

function transliterateArabicHebrew(str) {
  if (!str) return str;
  const units = [];
  for (const ch of str) {
    if (ch === TRANSLIT_SUKUN || ch === TRANSLIT_SHADDA || TRANSLIT_VOWEL_MARKS[ch]) {
      if (units.length) units[units.length - 1].marks.push(ch);
      continue;
    }
    units.push({ base: ch, marks: [] });
  }
  let out = '';
  for (let i = 0; i < units.length; i++) {
    const u = units[i];
    // Silent lam of the definite article: لْ immediately before an assimilating sun letter
    // that itself carries shadda (e.g. اَلشَّمْس "ash-shams") -- written but not pronounced.
    if (u.base === 'ل' && u.marks.includes(TRANSLIT_SUKUN)) {
      const next = units[i + 1];
      if (next && TRANSLIT_SUN_LETTERS.has(next.base) && next.marks.includes(TRANSLIT_SHADDA)) continue;
    }
    if (TRANSLIT_PUNCT[u.base]) { out += TRANSLIT_PUNCT[u.base]; continue; }
    const entry = TRANSLIT_CONSONANTS[u.base];
    if (!entry) { out += u.base; continue; } // space/Latin/digits/other punctuation -- passthrough
    const vowelMark = u.marks.find(m => TRANSLIT_VOWEL_MARKS[m]);
    const niqqud = vowelMark ? TRANSLIT_VOWEL_MARKS[vowelMark] : '';
    const mod = entry.mod || '';
    const letter = (u.base === 'ة' && vowelMark) ? 'ת' : entry.letter;
    out += u.marks.includes(TRANSLIT_SHADDA) ? (letter + mod + letter + niqqud + mod) : (letter + niqqud + mod);
  }
  return out;
}
```

### English engine

Same tokenization shape as the Hebrew engine, but with two additions Hebrew didn't need:
a matres-lectionis detector (و/ي as long vowel vs. consonant require different output
letters in Latin, unlike Hebrew where ו/י serve both roles unchanged — see
[TRANSLITERATION.md](TRANSLITERATION.md)), and a `ta marbuta` pause form that's dropped
rather than mapped to a silent letter.

```js
/* ─────────────── TRANSLITERATION (ARABIC → LATIN/ENGLISH LETTERS) ───────────────
   Locked convention: files/TRANSLITERATION.md. Simplified/ASCII style: digraphs (kh, gh, sh),
   capitalized emphatics (H/S/D/T) instead of dot-under diacritics, apostrophe for ع/ء shared.
   Unlike the Hebrew engine, و/ي need explicit consonant-vs-long-vowel detection since Latin
   doesn't reuse one glyph for both roles the way Hebrew ו/י do. */
const TRANSLIT_EN_CONSONANTS = {
  'ا':{letter:'a'}, 'ب':{letter:'b'}, 'ت':{letter:'t'}, 'ث':{letter:'t'},
  'ج':{letter:'j'}, 'ح':{letter:'H'}, 'خ':{letter:'kh'},
  'د':{letter:'d'}, 'ذ':{letter:'d'}, 'ر':{letter:'r'}, 'ز':{letter:'z'},
  'س':{letter:'s'}, 'ش':{letter:'sh'}, 'ص':{letter:'S'}, 'ض':{letter:'D'},
  'ط':{letter:'T'}, 'ظ':{letter:'D'}, 'ع':{letter:"'"}, 'غ':{letter:'gh'},
  'ف':{letter:'f'}, 'ق':{letter:'q'}, 'ك':{letter:'k'}, 'ل':{letter:'l'},
  'م':{letter:'m'}, 'ن':{letter:'n'}, 'ه':{letter:'h'}, 'و':{letter:'w'},
  'ي':{letter:'y'}, 'ء':{letter:"'"}, 'آ':{letter:"'"}, 'أ':{letter:"'"},
  'ؤ':{letter:"'"}, 'إ':{letter:"'"}, 'ئ':{letter:"'"},
  'ة':{letter:''}, // ta marbuta pause -- dropped; overridden to 't' in construct state below
  'ى':{letter:'y'},
};
const TRANSLIT_EN_VOWEL_MARKS = {
  'َ':'a', 'ُ':'u', 'ِ':'i', // fatha/damma/kasra
  'ً':'a', 'ٌ':'u', 'ٍ':'i', // tanwin -> same, case ending dropped (not pronounced in dialect)
};
const TRANSLIT_EN_LONG = { 'ُ':{ch:'و',long:'oo'}, 'ِ':{ch:'ي',long:'ee'} }; // damma+و / kasra+ي -> long vowel, not consonant
const TRANSLIT_EN_PUNCT = { '،':',', '؟':'?', '؛':';' };

function transliterateArabicEnglish(str) {
  if (!str) return str;
  const units = [];
  for (const ch of str) {
    if (ch === TRANSLIT_SUKUN || ch === TRANSLIT_SHADDA || TRANSLIT_EN_VOWEL_MARKS[ch]) {
      if (units.length) units[units.length - 1].marks.push(ch);
      continue;
    }
    units.push({ base: ch, marks: [] });
  }
  let out = '';
  for (let i = 0; i < units.length; i++) {
    const u = units[i];
    if (u.base === 'ل' && u.marks.includes(TRANSLIT_SUKUN)) {
      const next = units[i + 1];
      if (next && TRANSLIT_SUN_LETTERS.has(next.base) && next.marks.includes(TRANSLIT_SHADDA)) continue;
    }
    // Matres lectionis: damma+و or kasra+ي with no vowel of its own on the و/ي itself
    // is a long vowel, not the consonant w/y -- replace the short vowel just emitted
    // with its long form and skip emitting "w"/"y".
    const prev = units[i - 1];
    const longInfo = prev && TRANSLIT_EN_LONG[prev.marks.find(m => TRANSLIT_EN_VOWEL_MARKS[m])];
    if (longInfo && longInfo.ch === u.base && !u.marks.find(m => TRANSLIT_EN_VOWEL_MARKS[m])) {
      out = out.slice(0, -1) + longInfo.long; // drop the short vowel char just appended for prev, replace with long form
      continue;
    }
    if (TRANSLIT_EN_PUNCT[u.base]) { out += TRANSLIT_EN_PUNCT[u.base]; continue; }
    const entry = TRANSLIT_EN_CONSONANTS[u.base];
    if (!entry) { out += u.base; continue; }
    const vowelMark = u.marks.find(m => TRANSLIT_EN_VOWEL_MARKS[m]);
    const vowel = vowelMark ? TRANSLIT_EN_VOWEL_MARKS[vowelMark] : '';
    const letter = (u.base === 'ة' && vowelMark) ? 't' : entry.letter;
    out += u.marks.includes(TRANSLIT_SHADDA) ? (letter + letter + vowel) : (letter + vowel);
  }
  return out;
}
```

**This matres-lectionis block is the one part of the English engine that's a sketch, not
a finished draft** — it assumes the short vowel for `prev` was emitted as exactly one
character (true for a/i/u but worth double-checking once real voweled strings are run
through it), and hasn't been tested against real lesson text yet. Treat it as the starting
point to debug against actual `.ar` fields, not a trusted-correct implementation like the
Hebrew engine (which mirrors a pattern already sanity-checked against the two real Hebrew
precedents).

Not yet handled (acceptable v1 gaps, flag if they matter): mixed Hebrew+Arabic `context`
fields on some conjugation rows (e.g. `"— בנאום: نِسكُت"`) are left untouched — only the pure
`.ar` fields are transliterated, not annotation strings with embedded Arabic.

## Exact hook sites in app/js/app.js (line numbers as of this session — re-check, file will have shifted)

Every site below needs the `dir` treatment described in Architecture, not just `arText(...)` —
wherever these functions build HTML via string templates (`renderVocabView()`,
`renderVerbsView()`, `rootMetaHtml()`, tray functions), add `dir="${scriptMode==='translit-en'?'ltr':'rtl'}"`
(or read the computed `dir` local at call time) to the wrapping element, not just the two
loops (`wordEls`/`watchWordEls`) shown in the `applyScriptMode()` sketch above.

- `rootMetaHtml(root, sharedRoot)` (app.js:201) — wrap `root` → `arText(root)` (root strings like
  `س-ك-ت` are Arabic script shown in Reader tray / Vocab / Verbs meta badges).
- `buildReader()` (app.js:303): `span.textContent = word.w` → `arText(word.w)`. Leave
  `word.punct`/`word.sep` text nodes unconverted (see rule above).
- `commitWord()` (app.js:488ish): `tray-ar.textContent = data.w` → `arText(data.w)`.
- `commitPhrase()` (app.js:500ish): `phrase = ...join(' ')`; set `tray-ar.textContent = arText(phrase)`. Keep `pws` (used for `PHRASE_GLOSSES` matching) on raw Arabic — unaffected.
- `showHeaderGloss()` (app.js:532ish): `tray-ar.textContent = g.ar` → `arText(g.ar)`.
- `renderChunkPreview(ci, targetAr)` (app.js:1078): output `t.w + (t.punct||'')` → `arText(t.w) + (t.punct||'')`. Matching logic (`wordTokens[i+j].w !== targetWords[j]`) stays on raw Arabic — do not touch.
- `renderVocabView()` (app.js:998): `.vocab-row-ar` interpolation of `v.ar` → `arText(v.ar)`.
- `renderVerbsView()` (app.js:805): several sites —
  - pill `v.arDisplay` (~846) → `arText(v.arDisplay)`
  - `waznHtml`/`WAZN_PATTERNS[formNum]` (~827, ~869) → `arText(...)`
  - `rootTagHtml` / `verb.root` (~872) → `arText(verb.root)`
  - `arSubHtml` / `verb.arDisplay` (~878) → `arText(verb.arDisplay)`
  - card head `verb.ar` (~951, `.verb-ar-main`) → `arText(verb.ar)`
  - `derivedHtml`: `verb.participle.m/f/pl` and `verb.masdar.ar` (~896-916) → `arText(...)`
  - `conjHtml`: `row.ar` (~930, ~935) → `arText(row.ar)`
- `buildWatchTranscript()` (app.js:1145): `span.textContent = wd.w` → `arText(wd.w)`. **Also add
  a new parallel array** `let watchWordData = [];` (reset + pushed alongside `watchWordEls` in
  the same forEach, ~line 1166-1177) so `applyScriptMode()` can re-derive text on toggle (spans
  currently only store the element, not the source word object).
- `renderMobileCueOverlay()` (app.js:1261): no change needed — it already copies
  `watchWordEls[gi].textContent`, so it inherits whatever the desktop panel currently shows.
- Static header markup: `#lesson-title-ar` / `#lesson-location-ar` in `app/lesson.html:62-63`
  are hardcoded per-lesson HTML (not populated by JS). Capture their original textContent once
  at script top (`const lessonTitleArOriginal = document.getElementById('lesson-title-ar').textContent;` etc.) so `applyScriptMode()` can restore/convert them.

## UI toggle placement

Per earlier discussion: do **not** make this a third button inside `.lang-switch` (that group
is EN/HE UI-chrome + gloss language — a different axis). Add a visually separate control next
to it in the header (`app/lesson.html`, inside `.header-side`, near `#lang-switch`). Now
**three** buttons instead of two — script (`ar`) plus both transliteration targets sit
together since they're the same axis (how the Arabic content is rendered), not two separate
toggles:

```html
<div class="script-switch" id="script-switch" title="Show the Arabic learning content in transliteration instead of Arabic script">
  <button class="script-switch-btn active" data-script="ar" onclick="setScriptMode('ar')">ערבית</button>
  <button class="script-switch-btn" data-script="translit-he" onclick="setScriptMode('translit-he')">תעתיק</button>
  <button class="script-switch-btn" data-script="translit-en" onclick="setScriptMode('translit-en')">EN</button>
</div>
```

Label bikeshed for the third button: plain `EN` keeps it terse and matches the `ערבית`/`תעתיק`
pair's terseness, but consider `abc`/`ABC` or a small flag-free label if `EN` reads as an
interface-language switch and gets confused with the separate `#lang-switch` control next to
it — worth a quick look once it's actually on the page next to `#lang-switch`.

CSS: base it on `.lang-switch`/`.lang-switch-btn` (style.css:75-82) but give it a visual tell
that it's a different kind of control — e.g. a thin divider before it, smaller/lighter type, or
an outline-only style (vs `.lang-switch-btn.active`'s solid black fill) — exact treatment still
open, pick when implementing. With three buttons instead of two, double-check it still fits
comfortably in the header at mobile widths next to `#lang-switch` — may need to wrap or
collapse into a dropdown/menu if space is tight (unverified, check against the real header
layout when implementing).

## CSS: font-family swap for translit mode

These selectors currently hardcode the Arabic font stack
(`'Traditional Arabic','Arabic Typesetting','Scheherazade New',(sometimes 'Arial Unicode MS'),serif`)
and need a `body.translit-mode` override to a Hebrew-capable stack (reuse the body default:
`-apple-system, 'Segoe UI', system-ui, sans-serif`, style.css:9) — full list, all in
`app/css/style.css`:

`.lesson-title-ar` (98), `.lesson-location-ar` (105), `.chunk p` (116), `.tray-arabic` (152),
`.verb-group-wazn` (216), `.verb-pill-ar` (235), `.verb-ar-main` (252), `.verb-ar-sub` (256),
`.binyan-badge-ar` (266), `.derived-ar` (285), `.conj-ar` (316), `.vocab-row-ar` (359),
`.vocab-expand-text` (403).

Simplest approach: one rule block —
```css
body.translit-mode .lesson-title-ar, body.translit-mode .lesson-location-ar, body.translit-mode .chunk p,
body.translit-mode .tray-arabic, body.translit-mode .verb-group-wazn, body.translit-mode .verb-pill-ar,
body.translit-mode .verb-ar-main, body.translit-mode .verb-ar-sub, body.translit-mode .binyan-badge-ar,
body.translit-mode .derived-ar, body.translit-mode .conj-ar, body.translit-mode .vocab-row-ar,
body.translit-mode .vocab-expand-text {
  font-family: -apple-system, 'Segoe UI', system-ui, sans-serif;
}
```

**Watch tab needs no font change** — `.watch-cue-ar`/`.watch-word`/`.watch-mobile-cap-ar`
(style.css:481-501) don't set an Arabic-specific font-family at all (they inherit the body
default sans-serif already), confirmed via grep — this was a pre-existing inconsistency in the
app, not something to fix now.

**English mode reuses the same `translit-mode` class/rule above** — same font stack works for
both Hebrew and Latin letters, no separate `translit-en-mode` font rule needed. What English
*does* need on top is the LTR handling from Architecture: since CSS alone can't flip `dir` per
transliterated word (that has to be the `el.dir = ...` / template `dir="..."` attribute work
done in JS at hook sites), the only CSS-only addition here is cosmetic — e.g. if `text-align`
on any of the selectors above is currently hardcoded `right` for the Arabic-script look, add a
`body.translit-en-mode` override to `left` so English words don't render right-aligned inside
an otherwise-RTL layout. Check each selector's existing `text-align` when implementing; not
enumerated here since it depends on current style.css values not yet audited for this.

## Checklist for next session

- [ ] Paste both transliteration engines into app.js (after line ~200): `transliterateArabicHebrew` + `transliterateArabicEnglish`
- [ ] Debug the English engine's matres-lectionis block (و/ي long-vowel detection) against real `.ar` strings — it's a sketch, not verified yet, unlike the Hebrew engine
- [ ] Add `scriptMode` (3-way: `ar`/`translit-he`/`translit-en`), `arText`, `setScriptMode`, `applyScriptMode`
- [ ] Add `watchWordData` parallel array + push site in `buildWatchTranscript()`
- [ ] Capture `lessonTitleArOriginal`/`lessonLocationArOriginal` at top of app.js
- [ ] Wrap all hook sites listed above with `arText(...)` — AND add the `dir`/RTL-LTR handling at each site (not just the two element loops), including template-built HTML in `renderVocabView()`/`renderVerbsView()`/tray functions
- [ ] Call `applyScriptMode()` once from `initLesson()` (mirrors the existing `applyAppLang()` call at app.js:1582) so page load respects the persisted `localStorage` mode
- [ ] Add 3-button header toggle markup in lesson.html (ערבית / תעתיק / EN), finalize the English button's label
- [ ] Add CSS font-family override block + toggle button styling + check header fits 3 buttons at mobile widths
- [ ] Add `body.translit-en-mode` text-align/LTR CSS overrides if any of the Arabic-script selectors hardcode `text-align: right`
- [ ] Manual test: toggle across all three modes in Watch/Read/Vocab/Verbs, confirm EN/HE UI-language switch still works independently of script mode, confirm English transliteration actually reads left-to-right (not just correct characters in reversed order), confirm reload persists the choice
