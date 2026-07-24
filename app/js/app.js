/* ─────────────── LESSON DATA (populated by initLesson() below, from the fetched lesson bundle) ─────────────── */
let CHUNKS = [], PHRASE_GLOSSES = [];
let SEED_VOCAB = [], SAVED_VOCAB = [];
let SAVED_VERBS = [];
let WATCH_CAPTIONS = [];
let VOICEOVER_SRC = '', VOICEOVER_CHUNKS = [], VOICEOVER_WORD_TIMES = [];
let PROVERBS = [];
let LESSON_BASE = ''; // 'lessons/<slug>/' -- needed to resolve each proverb's own audio file path
let HOME_CONTENT = { en: { title: '', subtitle: '', intro: [] }, he: { title: '', subtitle: '', intro: [] } };
let INTRO_CONTENT = { en: { title: '', text: '' }, he: { title: '', text: '' } };
let ABOUT_CONTENT = { en: { dir: 'ltr', sections: [] }, he: { dir: 'rtl', sections: [] } };
let HEADER_GLOSS = { title: null, location: null };

/* ─────────────── READER STATE ─────────────── */
const wordEls = [];
const chunkRanges = [];
const chunkEls = [];
const timedWords = [];
const sentenceEls = [];
let liveWordIdx = -1;
let activeSentenceEl = null;
let enVisible = false;
let dragActive = false, dragStartIdx = -1, dragEndIdx = -1;
let lastActionWasDrag = false;
let currentSelectionCtx = null;
let lastScrolledChunkCi = -1;

/* ─────────────── TEXT SIZE (Reader + Watch) ─────────────── */
// An in-app control instead of relying on the browser's pinch-zoom, which would scale the whole
// page — header tabs and the audio bar/tray included — forcing a zoom-out just to reach them.
// Only the reading text itself (the transcript paragraphs) grows; everything else in the frame
// stays put and reachable. Reader and Watch each get their own scale/localStorage key since users
// may want the two sized differently.
const FONT_SCALES = [0.85, 1, 1.15, 1.3, 1.45, 1.6, 1.8, 2];
function createFontScaler({ cssVar, storageKey, labelId, decId, incId, onAdjusted }) {
  let idx = FONT_SCALES.indexOf(parseFloat(localStorage.getItem(storageKey)));
  if (idx < 0) idx = FONT_SCALES.indexOf(1);
  function apply() {
    const scale = FONT_SCALES[idx];
    document.documentElement.style.setProperty(cssVar, scale);
    document.getElementById(labelId).textContent = Math.round(scale * 100) + '%';
    document.getElementById(decId).disabled = idx === 0;
    document.getElementById(incId).disabled = idx === FONT_SCALES.length - 1;
    localStorage.setItem(storageKey, String(scale));
  }
  function adjust(dir) {
    idx = Math.min(FONT_SCALES.length - 1, Math.max(0, idx + dir));
    apply();
    if (onAdjusted) onAdjusted();
  }
  return { apply, adjust };
}
const readerScaler = createFontScaler({
  cssVar: '--reader-scale', storageKey: 'arabicLabReaderScale',
  labelId: 'text-size-label', decId: 'text-size-dec', incId: 'text-size-inc',
});
function applyReaderScale() { readerScaler.apply(); }
function adjustReaderScale(dir) { readerScaler.adjust(dir); }

const watchScaler = createFontScaler({
  cssVar: '--watch-scale', storageKey: 'arabicLabWatchScale',
  labelId: 'watch-text-size-label', decId: 'watch-text-size-dec', incId: 'watch-text-size-inc',
  onAdjusted: () => {
    // .watch-cue-ar/.watch-cue-tr transition font-size over .15s -- wait for that to finish before
    // re-measuring natural heights, or the sync would lock in a mid-transition (wrong) height.
    setTimeout(() => {
      syncWatchCueHeights();
      // Every cue above the active one just changed height, so the old scroll position no longer
      // lines the two columns up the way it did a moment ago -- snap the active cue to the top of
      // both panels so they visibly reset back into alignment instead of drifting.
      if (activeWatchCueIdx >= 0) {
        watchArCueEls[activeWatchCueIdx].scrollIntoView({ behavior: 'auto', block: 'start' });
        watchTrCueEls[activeWatchCueIdx].scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }, 180);
  },
});
function applyWatchScale() { watchScaler.apply(); }
function adjustWatchScale(dir) { watchScaler.adjust(dir); }

/* ─────────────── LANGUAGE PREFERENCE (global, top-bar) ─────────────── */
// 'he' = Hebrew-primary with full grammatical scaffolding (בניין, שורש badges, Hebrew
// conjugation column) — English still reachable per word/phrase via the EN chip.
// 'en' = stripped English-only mode, no Hebrew script or Hebrew-specific framing anywhere,
// and every UI label/menu/button switches to English too (not just the learning content).
let appLang = localStorage.getItem('arabicLabLang') || 'he';
// Canonical Hebrew pronoun strings used throughout verbs-data.js conjugation rows.
const PRONOUN_EN = { 'אני':'I', 'אתה':'you (m.)', 'את':'you (f.)', 'הוא':'he', 'היא':'she', 'אנחנו':'we', 'אתם/ן':'you (pl.)', 'הם/ן':'they' };
// Every tab name that can ever exist across any lesson type -- lesson.html carries markup for
// all of them always; a given lesson's bundle.meta.tabs (see initLesson()) narrows which ones
// actually show. Keeping one master list (rather than a hardcoded array duplicated at each call
// site) is what lets switchTab()/applyAppLang() work generically for any lesson's tab subset.
const ALL_TAB_NAMES = ['watch','reader','vocab','verbs','proverbs','flashcards','fillblank','scramble','about'];
const TAB_LABELS = {
  en: { reader: 'Reader', vocab: 'Vocab', verbs: 'Verbs', watch: 'Home', about: 'About',
        proverbs: 'Proverbs', flashcards: 'Flashcards', fillblank: 'Fill in the Blank', scramble: 'Word Scramble' },
  // proverbs/flashcards/fillblank/scramble Hebrew labels are a first draft, not yet reviewed by
  // the user -- flag for their real wording before treating as final (project convention: all
  // Hebrew UI copy gets a human pass, see feedback_ui_wording_iteration).
  he: { reader: 'קורא', vocab: 'אוצר מילים', verbs: 'פעלים', watch: 'בית', about: 'אודות',
        proverbs: 'פתגמים', flashcards: 'כרטיסיות', fillblank: 'השלמת מילים', scramble: 'סידור מילים' },
};
// Homepage (the "watch" view/tab internally) frames the video as the emotional entry point:
// context on the moment, then the speech itself, then a bridge into the study tools in the
// other tabs -- all as intro paragraphs above the video, same trilingual-by-appLang pattern as
// ABOUT_CONTENT. HOME_CONTENT/INTRO_CONTENT/ABOUT_CONTENT/HEADER_GLOSS are lesson-specific
// narrative content, declared as empty placeholders above and populated by initLesson() from
// the fetched lesson bundle (see the bottom of this file).
// Every static UI label/menu/button in Vocab/Verbs/Reader chrome — keyed by appLang.
const STRINGS = {
  en: {
    vocabTitle: 'Saved Vocabulary',
    vocabSearchPlaceholder: 'Search Arabic, Hebrew, English…',
    filterAll: 'All', filterVerbs: 'Verbs', filterPhrases: 'Phrases', filterOtherWords: 'Other words',
    sortSpeech: 'Order in speech', sortAlpha: 'Alphabetical (Arabic)', sortRecent: 'Recently added',
    vocabEmpty: 'No words or phrases saved yet — tap a word or drag across a phrase in the Reader, then Save.',
    vocabNoResults: 'No vocab matches this search or filter.',
    vocabItemsCount: n => n + (n === 1 ? ' item' : ' items'),
    vocabCountOf: (shown, total) => (shown === 1 ? '1 item' : shown + ' items') + ' of ' + total,
    showSourceLine: 'Show source line',
    removeFromVocab: 'Remove from vocab',
    saveWord: 'Save word', savePhrase: 'Save phrase', alreadySaved: 'Already saved',
    savedToVocab: ar => '"' + ar + '" saved to Vocab',
    andVerbs: ' and Verbs',
    removedFromVocab: ar => '"' + ar + '" removed from Vocab',
    verbsTitle: 'Verbs in this lesson',
    verbsCount: n => n + (n === 1 ? ' verb' : ' verbs'),
    audioOn: 'Audio: On', audioOff: 'Audio: Off',
    audioToggleTitle: 'Turn off to read without the player driving audio',
    muteAudio: 'Mute audio', unmuteAudio: 'Unmute audio',
    jumpToAudio: 'Jump to this part of the audio',
    enterTheater: 'Expand', exitTheater: 'Exit expanded view',
    hideTranslation: 'Hide translation', showTranslation: 'Show translation',
    playPassage: 'Play this passage',
    siteLanguageLabel: 'Site language', learningAlphabetLabel: 'Learning alphabet',
  },
  he: {
    vocabTitle: 'אוצר מילים שמור',
    vocabSearchPlaceholder: 'חיפוש בערבית, עברית, אנגלית…',
    filterAll: 'הכול', filterVerbs: 'פעלים', filterPhrases: 'ביטויים', filterOtherWords: 'מילים אחרות',
    sortSpeech: 'לפי סדר בנאום', sortAlpha: 'אלפביתי (ערבית)', sortRecent: 'נוספו לאחרונה',
    vocabEmpty: 'עדיין לא נשמרו מילים או ביטויים — הקישו על מילה או גררו על פני ביטוי בלשונית הקורא, ואז שמרו.',
    vocabNoResults: 'אין פריטי אוצר מילים התואמים לחיפוש או לסינון.',
    vocabItemsCount: n => n + (n === 1 ? ' פריט' : ' פריטים'),
    vocabCountOf: (shown, total) => (shown === 1 ? 'פריט 1' : shown + ' פריטים') + ' מתוך ' + total,
    showSourceLine: 'הצג שורת מקור',
    removeFromVocab: 'הסר מאוצר המילים',
    saveWord: 'שמור מילה', savePhrase: 'שמור ביטוי', alreadySaved: 'כבר נשמר',
    savedToVocab: ar => '"' + ar + '" נשמר באוצר המילים',
    andVerbs: ' ובפעלים',
    removedFromVocab: ar => '"' + ar + '" הוסר מאוצר המילים',
    verbsTitle: 'פעלים בשיעור זה',
    verbsCount: n => n + (n === 1 ? ' פועל' : ' פעלים'),
    audioOn: 'שמע: פועל', audioOff: 'שמע: כבוי',
    audioToggleTitle: 'כבו כדי לקרוא בלי שהנגן ינהל את השמע',
    muteAudio: 'השתק שמע', unmuteAudio: 'בטל השתקה',
    jumpToAudio: 'קפצו לחלק הזה בהקלטה',
    enterTheater: 'הרחבה', exitTheater: 'יציאה מתצוגה מורחבת',
    hideTranslation: 'הסתר תרגום', showTranslation: 'הצג תרגום',
    playPassage: 'נגן את הקטע הזה',
    siteLanguageLabel: 'שפת האתר', learningAlphabetLabel: 'אלפבית הלימוד',
  },
};
function t(key) { return STRINGS[appLang][key]; }
function setAppLang(lang) {
  appLang = lang;
  localStorage.setItem('arabicLabLang', lang);
  // Someone choosing an English interface is very unlikely to want Arabic script or a Hebrew
  // transliteration as their default learning alphabet -- English transliteration is the
  // sensible default to switch them to. Only fires on selecting English, not the reverse: a
  // manual script choice while in Hebrew mode is left alone when switching back to Hebrew.
  if (lang === 'en' && scriptMode !== 'translit-en') setScriptMode('translit-en');
  applyAppLang();
}
function applyAppLang() {
  // Scoped to specific text elements via CSS (body.lang-en ...) — does not flip the app's overall RTL layout.
  document.body.classList.toggle('lang-en', appLang === 'en');
  document.querySelectorAll('.lang-switch-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === appLang));
  const intro = INTRO_CONTENT[appLang];
  document.getElementById('lesson-title').textContent = intro.title;
  document.getElementById('lesson-intro').textContent = intro.text;
  const tabLabels = TAB_LABELS[appLang];
  ALL_TAB_NAMES.forEach(name => {
    const label = tabLabels[name];
    if (label == null) return;
    const tabEl = document.getElementById('tab-' + name);
    if (tabEl) tabEl.textContent = label;
    const menuEl = document.getElementById('menu-tab-' + name);
    if (menuEl) menuEl.textContent = label;
  });
  document.getElementById('mobile-header-title').textContent = tabLabels[activeTabName];
  const home = HOME_CONTENT[appLang];
  document.getElementById('watch-title').textContent = home.title;
  document.getElementById('watch-subtitle').innerHTML = home.subtitle;
  document.getElementById('watch-intro').innerHTML = home.intro.map(p => '<p class="watch-p">' + p + '</p>').join('');
  document.getElementById('vocab-title').textContent = t('vocabTitle');
  document.getElementById('vocab-search').placeholder = t('vocabSearchPlaceholder');
  document.getElementById('chip-all').textContent = t('filterAll');
  document.getElementById('chip-verb').textContent = t('filterVerbs');
  document.getElementById('chip-phrase').textContent = t('filterPhrases');
  document.getElementById('chip-other').textContent = t('filterOtherWords');
  document.getElementById('sort-speech').textContent = t('sortSpeech');
  document.getElementById('sort-alpha').textContent = t('sortAlpha');
  document.getElementById('sort-recent').textContent = t('sortRecent');
  document.getElementById('vocab-empty').textContent = t('vocabEmpty');
  document.getElementById('verbs-title').textContent = t('verbsTitle');
  document.getElementById('audio-toggle-btn').textContent = audioModeOn ? t('audioOn') : t('audioOff');
  document.getElementById('audio-toggle-btn').title = t('audioToggleTitle');
  document.getElementById('mute-btn').title = audioEl.muted ? t('unmuteAudio') : t('muteAudio');
  updateWatchTheaterIcon();
  document.querySelectorAll('.chunk-time').forEach(el => el.title = t('jumpToAudio'));
  document.querySelectorAll('[data-label="site-lang"]').forEach(el => el.textContent = t('siteLanguageLabel'));
  document.querySelectorAll('[data-label="learning-alphabet"]').forEach(el => el.textContent = t('learningAlphabetLabel'));
  if (document.getElementById('tray').classList.contains('open')) closeTray(); // avoid a stale mixed-language tray after switching mid-selection (header-gloss trays have no currentSelectionCtx)
  applyWatchTranslationLang();
  renderVocabView();
  renderVerbsView();
  renderProverbsView();
  renderFlashcardsView();
  renderFillBlankView();
  renderScrambleView();
  if (document.getElementById('view-about').classList.contains('active')) renderAboutView();
}

/* ─────────────── TRANSLITERATION (ARABIC → HEBREW/LATIN LETTERS) ───────────────
   Locked conventions: files/TRANSLITERATION.md. Mechanical per-letter pass over the already-
   voweled Arabic text -- tashkeel already encodes real pronunciation (incl. shadda), so both
   engines walk it letter-by-letter rather than needing a separately-authored field per word.
   Hebrew dialect judgment calls (ق as ק, ج as ג׳, ث/ذ/ظ collapsed) and English style choices
   (digraphs, capitalized emphatics H/S/D/T, apostrophe shared by ع/ء) are flagged in that doc --
   tweak the maps below if real Jaffa audio says otherwise. */
let scriptMode = localStorage.getItem('arabicLabScript') || 'ar'; // 'ar' | 'translit-he' | 'translit-en'
const TRANSLIT_SUN_LETTERS = new Set(['ت','ث','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ل','ن']);
const TRANSLIT_SUKUN = 'ْ';
const TRANSLIT_SHADDA = 'ّ';

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
const TRANSLIT_VOWEL_MARKS = {
  'َ':'ַ', 'ُ':'ֻ', 'ِ':'ִ', // fatha/damma/kasra -> patach/qubuts/hiriq
  'ً':'ַ', 'ٌ':'ֻ', 'ٍ':'ִ', // tanwin -> same, case ending dropped (not pronounced in dialect)
};
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

function arText(s) {
  if (scriptMode === 'translit-he') return transliterateArabicHebrew(s);
  if (scriptMode === 'translit-en') return transliterateArabicEnglish(s);
  return s;
}
function scriptDir() { return scriptMode === 'translit-en' ? 'ltr' : 'rtl'; }
function setScriptMode(mode) {
  scriptMode = mode;
  localStorage.setItem('arabicLabScript', mode);
  applyScriptMode();
}
function applyScriptMode() {
  const dir = scriptDir();
  document.body.classList.toggle('translit-mode', scriptMode !== 'ar');
  document.body.classList.toggle('translit-en-mode', scriptMode === 'translit-en');
  document.querySelectorAll('.script-switch-btn').forEach(b => b.classList.toggle('active', b.dataset.script === scriptMode));
  wordEls.forEach(({ el, data }) => { el.textContent = arText(data.w); el.dir = dir; });
  chunkEls.forEach((div) => { const p = div.querySelector('p'); if (p) p.dir = dir; }); // paragraph-level dir so word order re-renders LTR/RTL as a whole, not just per-word
  watchWordEls.forEach((el, i) => { el.textContent = arText(watchWordData[i].w); el.dir = dir; });
  watchArCueEls.forEach((div) => { div.dir = dir; });
  if (document.getElementById('lesson-title-ar')) { const e = document.getElementById('lesson-title-ar'); e.textContent = arText(lessonTitleArOriginal); e.dir = dir; }
  if (document.getElementById('lesson-location-ar')) { const e = document.getElementById('lesson-location-ar'); e.textContent = arText(lessonLocationArOriginal); e.dir = dir; }
  renderMobileCueOverlay(activeWatchCueIdx);
  renderVocabView();
  renderVerbsView();
  renderProverbsView();
  renderFlashcardsView();
  renderFillBlankView();
  renderScrambleView();
  if (document.getElementById('tray').classList.contains('open')) closeTray(); // same "avoid stale mixed content" rule applyAppLang() uses
}

// #lesson-title-ar/#lesson-location-ar are hardcoded per-lesson markup in lesson.html, not
// populated by JS -- capture the pristine Arabic once so applyScriptMode() can re-derive
// (rather than re-fetch) their text on every toggle, same static-element pattern as audioEl above.
const lessonTitleArOriginal = document.getElementById('lesson-title-ar') ? document.getElementById('lesson-title-ar').textContent : '';
const lessonLocationArOriginal = document.getElementById('lesson-location-ar') ? document.getElementById('lesson-location-ar').textContent : '';

function rootMetaHtml(root, sharedRoot) {
  if (!root) return '';
  const rootHtml = '<span dir="' + scriptDir() + '">' + arText(root) + '</span>';
  if (appLang === 'en') {
    return sharedRoot
      ? '<div class="gloss-root"><span class="root-dot"></span>Shared root &middot; ' + rootHtml + '</div>'
      : '<div class="gloss-root" style="opacity:.4">Root &middot; ' + rootHtml + '</div>';
  }
  return sharedRoot
    ? '<div class="gloss-root"><span class="root-dot"></span>שורש משותף &middot; ' + rootHtml + '</div>'
    : '<div class="gloss-root" style="opacity:.4">שורש &middot; ' + rootHtml + '</div>';
}
function phraseTypeBadgeHtml(type) {
  if (!type) return '';
  const label = appLang === 'en'
    ? (type === 'proverb' ? 'Proverb' : 'Idiom')
    : (type === 'proverb' ? 'פתגם' : 'ביטוי');
  return '<span class="badge badge-' + type + '">' + label + '</span>';
}

/* ─────────────── AUDIO ─────────────── */
const audioEl = document.getElementById('audio-el');
// Cached here (not re-queried per call) since it's a static element present in the initial HTML,
// same as audioEl above -- shared by the Watch tab's video, toolbar, scrubber and captions code.
const watchVideoEl = document.getElementById('watch-video');
let audioModeOn = true;
function toggleAudioMode() {
  audioModeOn = !audioModeOn;
  document.getElementById('audio-bar').classList.toggle('audio-off', !audioModeOn);
  const btn = document.getElementById('audio-toggle-btn');
  btn.textContent = audioModeOn ? t('audioOn') : t('audioOff');
  btn.classList.toggle('on', audioModeOn);
  if (!audioModeOn) audioEl.pause();
}

/* ─────────────── VERBS STATE ─────────────── */
let activeVerbId = null; // set in initLesson() once SAVED_VERBS is populated
let activeConjTab = 'present';
let collapsedVerbGroups = new Set();
function toggleVerbGroup(key) {
  key = String(key);
  if (collapsedVerbGroups.has(key)) collapsedVerbGroups.delete(key);
  else collapsedVerbGroups.add(key);
  renderVerbsView();
}

/* ─────────────── TAB SWITCHING ─────────────── */
// Which tabs the CURRENT lesson shows, and in what order -- narrowed from ALL_TAB_NAMES by
// initLesson() based on the fetched bundle's meta.tabs (see LESSON BOOTSTRAP at the bottom of
// this file). Defaults to the full classic set so this stays correct even if a bundle omits
// meta.tabs entirely.
let ACTIVE_TABS = ['watch','reader','vocab','verbs','about'];
function applyActiveTabs() {
  ALL_TAB_NAMES.forEach(name => {
    const show = ACTIVE_TABS.includes(name);
    const tabEl = document.getElementById('tab-' + name);
    if (tabEl) tabEl.style.display = show ? '' : 'none';
    const menuEl = document.getElementById('menu-tab-' + name);
    if (menuEl) menuEl.style.display = show ? '' : 'none';
  });
}
// The Watch tab opens by default on Abed's lesson; other lesson types set their own first tab
// via initLesson() -> switchTab(ACTIVE_TABS[0]). On mobile, every tab besides the active one
// lives behind the hamburger drawer instead of a tab row, since there wasn't room for both that
// and the language switch.
let activeTabName = 'watch';
function switchTab(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.side-menu-item').forEach(t => t.classList.remove('active'));
  const viewEl = document.getElementById('view-' + name);
  if (viewEl) viewEl.classList.add('active');
  else { document.getElementById('view-reader').classList.add('active'); name = 'reader'; }
  if (activeTabName === 'watch' && name !== 'watch') {
    watchVideoEl.pause();
    exitWatchTheater();
  }
  activeTabName = name;
  const tabEl = document.getElementById('tab-' + name);
  if (tabEl) tabEl.classList.add('active');
  const menuItem = document.getElementById('menu-tab-' + name);
  if (menuItem) menuItem.classList.add('active');
  document.getElementById('mobile-header-title').textContent = TAB_LABELS[appLang][name];
  if (name === 'verbs') renderVerbsView();
  if (name === 'vocab') renderVocabView();
  if (name === 'about') renderAboutView();
  if (name === 'proverbs') renderProverbsView();
  // Reshuffle the deck order fresh on every entry into these tabs (not on incidental re-renders
  // from a language/script toggle, and not per Prev/Next step) so returning to the tab surfaces
  // a different run through the set instead of always starting at proverb #1.
  if (name === 'flashcards') { shuffleFlashcardDeck(); renderFlashcardsView(); }
  if (name === 'fillblank') { shuffleFillBlankDeck(); renderFillBlankView(); }
  if (name === 'scramble') { shuffleScrambleDeck(); renderScrambleView(); }
}

/* ─────────────── HAMBURGER MENU (mobile) ─────────────── */
function openMenu() {
  document.getElementById('menu-backdrop').classList.add('open');
  document.getElementById('side-menu').classList.add('open');
}
function closeMenu() {
  document.getElementById('menu-backdrop').classList.remove('open');
  document.getElementById('side-menu').classList.remove('open');
}
function selectMenuTab(name) {
  switchTab(name);
  closeMenu();
}

/* ─────────────── HEADER SETTINGS MENU (site language + learning alphabet) ─────────────── */
// Collapsed behind one icon so the tabs keep visual primacy in the header -- these are
// rarely-changed preferences, not something toggled every few seconds, so one extra tap/click
// to reach them is a good trade for not competing with the main nav for space.
function toggleSettingsMenu() {
  document.getElementById('settings-btn').classList.toggle('open');
  document.getElementById('settings-menu').classList.toggle('open');
}
function closeSettingsMenu() {
  document.getElementById('settings-btn').classList.remove('open');
  document.getElementById('settings-menu').classList.remove('open');
}
initOutsideTapClose(document.body, (target) => !target.closest('.settings-wrap'), closeSettingsMenu);

/* ─────────────── AI-PROCESS DOC MODAL ─────────────── */
// The iframe's src is only set on open (not eagerly in the HTML) so the doc page isn't fetched
// until someone actually asks to read it.
function openAiProcessDoc() {
  const iframe = document.getElementById('doc-modal-iframe');
  if (!iframe.src) iframe.src = 'ai-process.html';
  document.getElementById('doc-modal-backdrop').classList.add('open');
  document.getElementById('doc-modal').classList.add('open');
}
function closeAiProcessDoc() {
  document.getElementById('doc-modal-backdrop').classList.remove('open');
  document.getElementById('doc-modal').classList.remove('open');
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAiProcessDoc(); });

/* ─────────────── READER BUILD ─────────────── */
function buildReader() {
  const reader = document.getElementById('reader');
  let gi = 0;
  CHUNKS.forEach((chunk, ci) => {
    const div = document.createElement('div');
    div.className = 'chunk'; div.dataset.ci = ci;
    chunkEls.push(div);
    const timeEl = document.createElement('div');
    timeEl.className = 'chunk-time'; timeEl.textContent = VOICEOVER_CHUNKS[ci].label;
    timeEl.title = t('jumpToAudio');
    timeEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!audioModeOn) return;
      clearActivePronounceIndicator();
      audioEl.currentTime = VOICEOVER_CHUNKS[ci].start; audioEl.play();
    });
    div.appendChild(timeEl);
    div.addEventListener('click', () => {
      if (lastActionWasDrag) { lastActionWasDrag = false; return; }
      if (!audioModeOn) return;
      clearActivePronounceIndicator();
      const activeChunk = VOICEOVER_CHUNKS[ci];
      const inThisChunk = audioEl.currentTime >= activeChunk.start && audioEl.currentTime < activeChunk.end;
      if (inThisChunk) {
        // Audio is already positioned in this chunk — pause in place so the user can click
        // around freely (translate words, etc.) without losing their spot. Resumes exactly
        // where it paused via the play button, not from the chunk's start.
        audioEl.pause();
      } else {
        audioEl.currentTime = activeChunk.start; audioEl.play();
      }
    });
    const p = document.createElement('p');
    p.dir = scriptDir(); // word order in chunk.text already matches spoken order -- flipping dir alone re-renders it LTR/RTL correctly
    const startIdx = gi;
    let sentenceSpan = document.createElement('span');
    sentenceSpan.className = 'sentence';
    p.appendChild(sentenceSpan);
    chunk.text.forEach((word) => {
      if (word.sep !== undefined) { sentenceSpan.appendChild(document.createTextNode(word.sep + ' ')); return; }
      if (word.sentT !== undefined) sentenceEls.push({ el: sentenceSpan, t: word.sentT });
      const span = document.createElement('span');
      span.className = 'word'; span.textContent = arText(word.w); span.dir = scriptDir(); span.dataset.idx = gi;
      wordEls.push({ el: span, data: word, globalIdx: gi++ });
      sentenceSpan.appendChild(span);
      if (word.punct) sentenceSpan.appendChild(document.createTextNode(word.punct));
      sentenceSpan.appendChild(document.createTextNode(' '));
      if (word.punct === '.' || word.punct === '؟') {
        sentenceSpan = document.createElement('span');
        sentenceSpan.className = 'sentence';
        p.appendChild(sentenceSpan);
      }
    });
    chunkRanges.push({ ci, startIdx, endIdx: gi - 1 });
    div.appendChild(p); reader.appendChild(div);
  });
  wordEls.forEach(({ data, globalIdx }) => { if (data.t !== undefined) timedWords.push({ idx: globalIdx, t: data.t }); });
  timedWords.sort((a, b) => a.t - b.t);
  sentenceEls.sort((a, b) => a.t - b.t);
  reader.addEventListener('mousedown', onDragStart);
  document.addEventListener('mousemove', onDragMove);
  document.addEventListener('mouseup', onDragEnd);
  reader.addEventListener('touchstart', onTouchStart, { passive: false });
  reader.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('touchmove', onTouchMove, { passive: false });
  document.addEventListener('touchend', onTouchEnd);
  document.addEventListener('touchcancel', onTouchCancel);
  initOutsideTapClose(document.body, (target) => !target.closest('.word') && !target.closest('#tray'), () => { clearSelection(); closeTray(); });
}

/* ─────────────── MOBILE BOTTOM-SHEET DRAWERS: shared gesture helpers ─────────────── */
// Backs both the reader's translation tray and the verbs page's conjugation drawer — a plain
// mousedown-only outside-tap listener never fires reliably from touch: any tiny finger jitter
// during a tap starts a scroll gesture, and once that happens the browser suppresses the
// synthetic mouse events it would otherwise dispatch after touchend. Tracking touch start/end
// directly and only treating it as a tap when movement stays under a small threshold fixes that
// without misfiring on scroll swipes.
function initOutsideTapClose(container, isOutside, onClose) {
  const el = typeof container === 'string' ? document.getElementById(container) : container;
  el.addEventListener('mousedown', (e) => { if (isOutside(e.target)) onClose(); });
  let startX = 0, startY = 0, startTarget = null, tracking = false;
  el.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    startX = t.clientX; startY = t.clientY; startTarget = e.target; tracking = true;
  }, { passive: true });
  el.addEventListener('touchend', (e) => {
    if (!tracking) return;
    tracking = false;
    const t = e.changedTouches[0];
    const dx = Math.abs(t.clientX - startX), dy = Math.abs(t.clientY - startY);
    if (dx > TOUCH_MOVE_THRESHOLD || dy > TOUCH_MOVE_THRESHOLD) return; // was a scroll, not a tap
    if (isOutside(startTarget)) onClose();
  });
}
// Swipe-down-to-close (or a plain tap) on a drawer's drag handle. Re-bindable, since the verb
// drawer's handle is recreated from scratch on every renderVerbsView() call.
function initSwipeToClose(handle, panel, onClose) {
  let startY = null, dragging = false;
  handle.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY; dragging = true;
    panel.style.transition = 'none';
  }, { passive: true });
  handle.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    const dy = e.touches[0].clientY - startY;
    if (dy > 0) { panel.style.transform = 'translateY(' + dy + 'px)'; e.preventDefault(); }
  }, { passive: false });
  handle.addEventListener('touchend', (e) => {
    if (!dragging) return;
    dragging = false;
    const dy = e.changedTouches[0].clientY - startY;
    panel.style.transition = ''; panel.style.transform = '';
    if (dy > 60) onClose();
  });
  handle.addEventListener('touchcancel', () => {
    dragging = false; panel.style.transition = ''; panel.style.transform = '';
  });
  // A plain tap on the handle (no drag) also closes the drawer — not everyone will think to swipe.
  handle.addEventListener('click', onClose);
}
function initTrayGestures() {
  initSwipeToClose(document.getElementById('tray-handle'), document.getElementById('tray'), closeTray);
}

function wordAtPoint(x, y) {
  const el = document.elementFromPoint(x, y);
  return (el && el.classList.contains('word')) ? parseInt(el.dataset.idx, 10) : -1;
}
function onDragStart(e) { const i = wordAtPoint(e.clientX, e.clientY); if (i<0) return; e.preventDefault(); dragActive=true; dragStartIdx=i; dragEndIdx=i; renderRange(i,i); }
function onDragMove(e) { if (!dragActive) return; const i = wordAtPoint(e.clientX, e.clientY); if (i>=0 && i!==dragEndIdx) { dragEndIdx=i; renderRange(Math.min(dragStartIdx,dragEndIdx), Math.max(dragStartIdx,dragEndIdx)); } }
function onDragEnd() { if (!dragActive) return; dragActive=false; const lo=Math.min(dragStartIdx,dragEndIdx), hi=Math.max(dragStartIdx,dragEndIdx); lastActionWasDrag = lo!==hi; lo===hi ? commitWord(lo) : commitPhrase(lo,hi); }
// Touch is also how mobile scrolls, and nearly all reading text is a `.word` span — so a plain
// swipe-to-scroll that starts on a word must never be mistaken for a phrase drag-select. A
// ~350ms hold arms drag mode (mirrors the long-press-to-select gesture mobile OSes already use);
// anything that moves past a small threshold before that timer fires is treated as a scroll and
// left completely alone (no preventDefault, so native scrolling is untouched).
const TOUCH_LONG_PRESS_MS = 350;
const TOUCH_MOVE_THRESHOLD = 10;
let touchTimer = null, touchStartX = 0, touchStartY = 0, touchStartIdx = -1, touchArmed = false;
function clearTouchTimer() { if (touchTimer) { clearTimeout(touchTimer); touchTimer = null; } }
function onTouchStart(e) {
  const t = e.touches[0], i = wordAtPoint(t.clientX, t.clientY);
  if (i < 0) return;
  e.preventDefault(); // suppresses the synthetic mouse-event sequence, not scrolling
  touchStartX = t.clientX; touchStartY = t.clientY; touchStartIdx = i; touchArmed = false;
  clearTouchTimer();
  touchTimer = setTimeout(() => {
    touchArmed = true; dragActive = true; dragStartIdx = i; dragEndIdx = i;
    renderRange(i, i);
  }, TOUCH_LONG_PRESS_MS);
}
function onTouchMove(e) {
  const t = e.touches[0];
  if (!touchArmed) {
    if (touchStartIdx < 0) return;
    const dx = Math.abs(t.clientX - touchStartX), dy = Math.abs(t.clientY - touchStartY);
    if (dx > TOUCH_MOVE_THRESHOLD || dy > TOUCH_MOVE_THRESHOLD) { clearTouchTimer(); touchStartIdx = -1; }
    return;
  }
  e.preventDefault(); // actively drag-selecting now — block scroll while extending the range
  const i = wordAtPoint(t.clientX, t.clientY);
  if (i >= 0 && i !== dragEndIdx) { dragEndIdx = i; renderRange(Math.min(dragStartIdx, dragEndIdx), Math.max(dragStartIdx, dragEndIdx)); }
}
function onTouchEnd() {
  clearTouchTimer();
  if (touchArmed) {
    touchArmed = false;
    if (dragActive) {
      dragActive = false;
      const lo = Math.min(dragStartIdx, dragEndIdx), hi = Math.max(dragStartIdx, dragEndIdx);
      lastActionWasDrag = lo !== hi;
      lo === hi ? commitWord(lo) : commitPhrase(lo, hi);
    }
  } else if (touchStartIdx >= 0) {
    commitWord(touchStartIdx); // released before the long-press armed — same instant tap as before
  }
  touchStartIdx = -1;
}
function onTouchCancel() {
  clearTouchTimer();
  touchArmed = false; touchStartIdx = -1;
  if (dragActive) { dragActive = false; clearSelection(); }
}
function renderRange(lo, hi) { wordEls.forEach(({el,globalIdx:gi}) => { const inR=gi>=lo&&gi<=hi; el.classList.toggle('in-range',inR); el.classList.toggle('range-start',gi===lo); el.classList.toggle('range-end',gi===hi); el.classList.remove('selected'); }); }
function clearSelection() { wordEls.forEach(({el}) => el.classList.remove('in-range','range-start','range-end','selected')); dragStartIdx=-1; dragEndIdx=-1; }
function ciForIdx(idx) { const r = chunkRanges.find(r => idx>=r.startIdx && idx<=r.endIdx); return r ? r.ci : 0; }
function commitWord(idx) {
  clearSelection();
  const {el,data} = wordEls[idx]; el.classList.add('selected');
  document.getElementById('tray-ar').textContent = arText(data.w);
  document.getElementById('tray-ar').dir = scriptDir();
  document.getElementById('tray-ar').className = 'tray-arabic';
  document.getElementById('tray-he').textContent = appLang === 'en' ? (data.en||'') : data.he;
  document.getElementById('tray-en').textContent = data.en||'';
  document.getElementById('tray-meta').innerHTML = rootMetaHtml(data.root, !!data.sharedRoot);
  currentSelectionCtx = { type:'word', ar:data.w, he:data.he, en:data.en||'', root:data.root||null, sharedRoot:!!data.sharedRoot, isVerb:data.pos==='verb', ci:ciForIdx(idx) };
  refreshSaveButton();
  resetEnChip(); openTray();
}
function commitPhrase(lo, hi) {
  wordEls.forEach(({el,globalIdx:gi}) => { el.classList.toggle('in-range',gi>=lo&&gi<=hi); el.classList.remove('range-start','range-end','selected'); });
  const phrase = wordEls.slice(lo,hi+1).map(w=>w.data.w).join(' ');
  const pws = wordEls.slice(lo,hi+1).map(w=>w.data.w); // raw Arabic, unaffected by scriptMode -- used for PHRASE_GLOSSES key matching
  document.getElementById('tray-ar').textContent = arText(phrase);
  document.getElementById('tray-ar').dir = scriptDir();
  document.getElementById('tray-ar').className = 'tray-arabic phrase';
  let gloss = null;
  for (const pg of PHRASE_GLOSSES) { if (pg.keys.filter(k=>pws.includes(k)).length >= Math.min(2,pg.keys.length)) { gloss=pg; break; } }
  const fallbackHe = wordEls.slice(lo,hi+1).map(w=>w.data.he).filter(Boolean).join(' ');
  const fallbackEn = wordEls.slice(lo,hi+1).map(w=>w.data.en).filter(Boolean).join(' ');
  const heText = gloss ? gloss.he : (fallbackHe || '—');
  const enText = gloss ? gloss.en : fallbackEn;
  document.getElementById('tray-he').textContent = appLang === 'en' ? (enText || '—') : heText;
  document.getElementById('tray-en').textContent = enText;
  document.getElementById('tray-meta').innerHTML = phraseTypeBadgeHtml(gloss ? gloss.type : null);
  currentSelectionCtx = { type:'phrase', ar:phrase, he:heText, en:enText, phraseType:gloss?gloss.type:null, ci:ciForIdx(lo) };
  refreshSaveButton();
  resetEnChip(); openTray();
}
function refreshSaveButton() {
  const btn = document.getElementById('save-btn');
  if (!currentSelectionCtx) { btn.style.display = 'none'; return; }
  btn.style.display = '';
  const label = currentSelectionCtx.type === 'phrase' ? t('savePhrase') : t('saveWord');
  const already = SAVED_VOCAB.some(v => v.ar === currentSelectionCtx.ar);
  btn.textContent = already ? t('alreadySaved') : label;
  btn.disabled = already;
  btn.classList.toggle('saved', already);
}
// Lesson header text (title / location) isn't saveable vocab — tapping it just shows a translation
// in the same tray UI, with currentSelectionCtx left null so refreshSaveButton hides the Save button.
// HEADER_GLOSS itself is lesson content, populated by initLesson() (see LESSON DATA above).
function showHeaderGloss(key) {
  const g = HEADER_GLOSS[key];
  if (!g) return;
  clearSelection();
  document.getElementById('tray-ar').textContent = arText(g.ar);
  document.getElementById('tray-ar').dir = scriptDir();
  document.getElementById('tray-ar').className = key === 'location' ? 'tray-arabic phrase' : 'tray-arabic';
  document.getElementById('tray-he').textContent = appLang === 'en' ? g.en : g.he;
  document.getElementById('tray-en').textContent = g.en;
  document.getElementById('tray-meta').innerHTML = '';
  currentSelectionCtx = null;
  refreshSaveButton();
  resetEnChip(); openTray();
}
function openTray() { document.getElementById('tray').classList.add('open'); }
function closeTray() { document.getElementById('tray').classList.remove('open'); clearSelection(); }
function resetEnChip() {
  const wrap = document.getElementById('gloss-en-wrap');
  if (appLang === 'en') { wrap.style.display = 'none'; enVisible = false; return; }
  wrap.style.display = '';
  enVisible = false;
  document.getElementById('tray-en').classList.add('hidden');
  const c = document.getElementById('en-chip');
  c.classList.remove('showing');
  c.textContent = 'EN ›';
}
function toggleEn(e) { e.stopPropagation(); enVisible=!enVisible; document.getElementById('tray-en').classList.toggle('hidden',!enVisible); const c=document.getElementById('en-chip'); c.classList.toggle('showing',enVisible); c.textContent=enVisible?'EN ×':'EN ›'; }

/* ─────────────── REAL AUDIO PLAYBACK ─────────────── */
// The Reader plays only the AI voiceover (the lesson bundle's voiceover.src, set as audio-el's
// src by initLesson()) — it's synthesized directly from these exact reading-edition tokens, so
// word-level alignment is reliable enough for karaoke-mode highlighting. The real recording
// lives in the Watch tab instead, alongside the video.
let voiceoverTimedWords = []; // (re)computed in initLesson() from VOICEOVER_WORD_TIMES
function togglePlay() { clearActivePronounceIndicator(); audioEl.paused ? audioEl.play() : audioEl.pause(); }
function fmtTime(s) { if (!isFinite(s)) return '0:00'; const m=Math.floor(s/60), sec=Math.floor(s%60).toString().padStart(2,'0'); return m+':'+sec; }
// Shared by every "scan a sorted {idx,t} array for the last entry at/before `time`" live-word
// lookup (Reader, Vocab preview, Watch) -- same karaoke-highlight logic, different word arrays.
function findActiveTimedIndex(sortedTimedWords, time) {
  let idx = -1;
  for (let i = 0; i < sortedTimedWords.length; i++) {
    if (sortedTimedWords[i].t <= time) idx = sortedTimedWords[i].idx; else break;
  }
  return idx;
}
const MUTE_ICON_MUTED_SVG = '<path d="M1 5H3.5L7 2V12L3.5 9H1V5Z" fill="currentColor"/><path d="M9.5 4.5L13 8M13 4.5L9.5 8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>';
const MUTE_ICON_UNMUTED_SVG = '<path d="M1 5H3.5L7 2V12L3.5 9H1V5Z" fill="currentColor"/><path d="M10 4.5C11 5.5 11 8.5 10 9.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>';
// Mute/speed/time-label chrome shared by the Reader's audio bar and the Watch tab's video
// toolbar -- same controls, different <audio>/<video> element underneath.
function createMediaChrome({ mediaEl, muteBtnId, muteIconId, speedBtnSelector, timeLabelId }) {
  const speeds = [0.75, 1, 1.25], speedLabels = ['0.75×', '1×', '1.25×'];
  let speedIdx = speeds.indexOf(1);
  const muteBtn = document.getElementById(muteBtnId);
  const muteIcon = document.getElementById(muteIconId);
  const timeLabelEl = document.getElementById(timeLabelId);
  function cycleSpeed() {
    speedIdx = (speedIdx + 1) % speeds.length;
    mediaEl.playbackRate = speeds[speedIdx];
    document.querySelector(speedBtnSelector).textContent = speedLabels[speedIdx];
  }
  function toggleMute() { mediaEl.muted = !mediaEl.muted; }
  function updateMuteIcon() {
    muteBtn.classList.toggle('muted', mediaEl.muted);
    muteBtn.title = mediaEl.muted ? t('unmuteAudio') : t('muteAudio');
    muteIcon.innerHTML = mediaEl.muted ? MUTE_ICON_MUTED_SVG : MUTE_ICON_UNMUTED_SVG;
  }
  function updateTimeLabel() {
    timeLabelEl.textContent = fmtTime(mediaEl.currentTime) + ' / ' + fmtTime(mediaEl.duration);
  }
  return { cycleSpeed, toggleMute, updateMuteIcon, updateTimeLabel };
}
const audioChrome = createMediaChrome({
  mediaEl: audioEl, muteBtnId: 'mute-btn', muteIconId: 'mute-icon',
  speedBtnSelector: '.speed-btn', timeLabelId: 'time-label',
});
function updateTimeLabel() { audioChrome.updateTimeLabel(); }
function cycleSpeed() { audioChrome.cycleSpeed(); }
function toggleMute() { audioChrome.toggleMute(); }
function updateMuteIcon() { audioChrome.updateMuteIcon(); }

const scrubberFillEl = document.getElementById('scrubber-fill');
function updateProgress() {
  const total = audioEl.duration || 1;
  scrubberFillEl.style.width = (audioEl.currentTime/total*100) + '%';
  updateTimeLabel();
  let active = -1;
  VOICEOVER_CHUNKS.forEach((c,i) => { if (audioEl.currentTime >= c.start && audioEl.currentTime < c.end) active = i; });
  // Only touch the DOM (highlight + auto-scroll) when the active chunk actually changes, not on
  // every timeupdate tick — otherwise it also fights any manual scrolling the user does while
  // audio keeps playing.
  if (active !== lastScrolledChunkCi) {
    if (lastScrolledChunkCi >= 0) chunkEls[lastScrolledChunkCi]?.classList.remove('active');
    if (active >= 0) {
      chunkEls[active].classList.add('active');
      chunkEls[active].scrollIntoView({behavior:'smooth',block:'center'});
    }
    lastScrolledChunkCi = active;
  }
  // Per-word live highlighting (karaoke mode) -- reliable here since the AI voiceover is
  // synthesized directly from these tokens (see voiceoverTimedWords above).
  updateLiveWord();
  // Sentence-level highlighting disabled too — a second highlight layer nested inside the
  // already-highlighted active chunk read as visual noise rather than useful signal. Chunk-level
  // highlighting alone (above) is the sync UI for now. sentT data and updateActiveSentence() are
  // kept in case a different presentation of sentence-level sync is worth trying later.
  // updateActiveSentence();
}
function updateActiveSentence() {
  const time = audioEl.currentTime;
  let el = null;
  for (let i = 0; i < sentenceEls.length; i++) {
    if (sentenceEls[i].t <= time) el = sentenceEls[i].el; else break;
  }
  if (el === activeSentenceEl) return;
  if (activeSentenceEl) activeSentenceEl.classList.remove('active');
  activeSentenceEl = el;
  if (activeSentenceEl) activeSentenceEl.classList.add('active');
}
function updateLiveWord() {
  const idx = findActiveTimedIndex(voiceoverTimedWords, audioEl.currentTime);
  if (idx === liveWordIdx) return;
  if (liveWordIdx >= 0 && wordEls[liveWordIdx]) wordEls[liveWordIdx].el.classList.remove('live');
  liveWordIdx = idx;
  if (liveWordIdx >= 0) wordEls[liveWordIdx].el.classList.add('live');
}
function scrub(e) { clearActivePronounceIndicator(); const r=e.currentTarget.getBoundingClientRect(); const pct=(e.clientX-r.left)/r.width; audioEl.currentTime = pct * (audioEl.duration||0); updateProgress(); }
audioEl.addEventListener('volumechange', updateMuteIcon);

audioEl.addEventListener('loadedmetadata', updateTimeLabel);
audioEl.addEventListener('timeupdate', updateProgress);
audioEl.addEventListener('play', () => { document.getElementById('play-icon').innerHTML = '<rect x="3" y="2" width="3" height="10"/><rect x="8" y="2" width="3" height="10"/>'; });
audioEl.addEventListener('pause', () => { document.getElementById('play-icon').innerHTML = '<polygon points="3,1 13,7 3,13"/>'; });
audioEl.addEventListener('ended', () => { audioEl.currentTime = 0; });

/* ─────────────── PRONUNCIATION AUDIO (Vocab) ───────────────
   Reuses the AI voiceover (reading-edition.mp3) instead of synthesizing anything new: the
   expanded source-context panel gets a speaker icon that plays the whole chunk a saved
   word/phrase came from, using that chunk's own start/end from VOICEOVER_CHUNKS. Per-word
   playback (on the vocab row header, and on the Verbs card) was tried and then removed by
   request in favor of just this passage-level button.
*/
let audioSliceStopHandler = null;
function stopAudioSliceWatch() {
  if (audioSliceStopHandler) { audioEl.removeEventListener('timeupdate', audioSliceStopHandler); audioSliceStopHandler = null; }
}
const PRONOUNCE_ICON_SVG = '<svg width="13" height="12" viewBox="0 0 15 14" fill="none"><path d="M1 5H3.5L7 2V12L3.5 9H1V5Z" fill="currentColor"/><path d="M10 4.5C11 5.5 11 8.5 10 9.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>';
// fill="currentColor" on the rects matters here -- without it an SVG shape defaults to black
// fill regardless of the button's CSS color, so the icon would stay invisible-on-black once the
// "playing" state turns the circle black and the button's color white.
const PRONOUNCE_STOP_ICON_SVG = '<svg width="13" height="12" viewBox="0 0 14 14"><rect x="3" y="2" width="3" height="10" fill="currentColor"/><rect x="8" y="2" width="3" height="10" fill="currentColor"/></svg>';
// The one button currently "armed" -- tracks the specific DOM button, not just "something is
// playing", so clicking it again toggles off instead of restarting.
let activePronounceBtn = null;
function setPronounceBtnPlaying(btn, playing) {
  if (!btn) return;
  btn.classList.toggle('playing', playing);
  btn.innerHTML = playing ? PRONOUNCE_STOP_ICON_SVG : PRONOUNCE_ICON_SVG;
}
// Karaoke-mode word highlighting during passage playback, mirroring the Reader's own
// updateLiveWord() -- reuses the same voiceoverTimedWords data (word-level timestamps, reliable
// here since the AI voiceover was synthesized directly from these tokens) and the same data-gi
// scheme (global word index) that renderChunkPreview() now stamps onto each word span.
let activeVocabPreviewEl = null;
let vocabPreviewLiveGi = -1;
let vocabPreviewLiveEl = null;
function clearVocabPreviewLiveWord() {
  if (vocabPreviewLiveEl) vocabPreviewLiveEl.classList.remove('live');
  vocabPreviewLiveEl = null;
  vocabPreviewLiveGi = -1;
  activeVocabPreviewEl = null;
}
function updateVocabPreviewLiveWord() {
  if (!activeVocabPreviewEl) return;
  const gi = findActiveTimedIndex(voiceoverTimedWords, audioEl.currentTime);
  if (gi === vocabPreviewLiveGi) return;
  vocabPreviewLiveGi = gi;
  if (vocabPreviewLiveEl) vocabPreviewLiveEl.classList.remove('live');
  vocabPreviewLiveEl = gi >= 0 ? activeVocabPreviewEl.querySelector('[data-gi="' + gi + '"]') : null;
  if (vocabPreviewLiveEl) vocabPreviewLiveEl.classList.add('live');
}
audioEl.addEventListener('timeupdate', updateVocabPreviewLiveWord);
function stopPronunciation() {
  stopAudioSliceWatch();
  audioEl.pause();
  setPronounceBtnPlaying(activePronounceBtn, false);
  activePronounceBtn = null;
  clearVocabPreviewLiveWord();
  clearProverbLiveWord();
}
// For other code paths that take over audioEl directly (Reader chunk clicks, the main play
// button, scrubbing) -- clears the stale "playing" indicator without re-pausing audio that's
// already moved on to something else.
function clearActivePronounceIndicator() {
  stopAudioSliceWatch();
  setPronounceBtnPlaying(activePronounceBtn, false);
  activePronounceBtn = null;
  clearVocabPreviewLiveWord();
  clearProverbLiveWord();
}

/* ─────────────── PROVERB AUDIO (Proverbs/Flashcards) ───────────────
   Unlike the Reader/Vocab, which all share one lesson-length voiceover track and a single
   lesson-wide word-index space, proverbs are independent standalone units -- each gets its own
   short TTS clip and its own local {idx,t} word-timing array (idx 0..N-1 within that proverb,
   not a global index). Deliberately a separate small mechanism rather than bending the
   shared-track assumptions baked into voiceoverTimedWords/playLessonAudioSlice. */
let activeProverbId = null;
let activeProverbContainerEl = null;
let proverbLiveGi = -1;
let proverbLiveEl = null;
function clearProverbLiveWord() {
  if (proverbLiveEl) proverbLiveEl.classList.remove('live');
  proverbLiveEl = null;
  proverbLiveGi = -1;
  activeProverbContainerEl = null;
  activeProverbId = null;
}
function updateProverbLiveWord() {
  if (!activeProverbContainerEl || activeProverbId == null) return;
  const proverb = PROVERBS.find(p => p.id === activeProverbId);
  const wordTimes = (proverb && proverb.audio && proverb.audio.wordTimes) || [];
  const gi = findActiveTimedIndex(wordTimes, audioEl.currentTime);
  if (gi === proverbLiveGi) return;
  proverbLiveGi = gi;
  if (proverbLiveEl) proverbLiveEl.classList.remove('live');
  proverbLiveEl = gi >= 0 ? activeProverbContainerEl.querySelector('[data-gi="' + gi + '"]') : null;
  if (proverbLiveEl) proverbLiveEl.classList.add('live');
}
audioEl.addEventListener('timeupdate', updateProverbLiveWord);
// Natural end-of-clip isn't covered by stopAudioSliceWatch (that's only for stopping mid-track
// at a slice boundary) -- reset the playing indicator here so the button doesn't stay stuck
// showing "playing" after a proverb clip finishes on its own.
audioEl.addEventListener('ended', () => {
  if (activeProverbId != null) { setPronounceBtnPlaying(activePronounceBtn, false); activePronounceBtn = null; clearProverbLiveWord(); }
});
function playProverbAudio(proverbId, containerEl, btnEl) {
  if (btnEl && btnEl === activePronounceBtn && activeProverbId === proverbId) { stopPronunciation(); return; }
  const proverb = PROVERBS.find(p => p.id === proverbId);
  if (!proverb || !proverb.audio || !proverb.audio.src) return; // no audio generated yet -- nothing to play, don't fabricate a sound
  stopAudioSliceWatch();
  setPronounceBtnPlaying(activePronounceBtn, false);
  clearVocabPreviewLiveWord();
  clearProverbLiveWord();
  activeProverbId = proverbId;
  activeProverbContainerEl = containerEl;
  audioEl.src = LESSON_BASE + proverb.audio.src;
  audioEl.currentTime = 0;
  audioEl.play();
  activePronounceBtn = btnEl || null;
  setPronounceBtnPlaying(activePronounceBtn, true);
}
function playLessonAudioSlice(startT, endT, btnEl) {
  if (btnEl && btnEl === activePronounceBtn) { stopPronunciation(); return; }
  stopAudioSliceWatch();
  setPronounceBtnPlaying(activePronounceBtn, false);
  audioEl.currentTime = startT;
  audioEl.play();
  activePronounceBtn = btnEl || null;
  setPronounceBtnPlaying(activePronounceBtn, true);
  audioSliceStopHandler = () => { if (audioEl.currentTime >= endT) stopPronunciation(); };
  audioEl.addEventListener('timeupdate', audioSliceStopHandler);
}
// Every pronounce button's click handler calls stopPropagation(), so this only ever sees clicks
// that landed somewhere else on the page -- i.e. "anywhere out of the frame" cancels playback.
document.addEventListener('click', () => { if (activePronounceBtn) stopPronunciation(); });
// Embedded speaker icon inside the expanded source-context panel -- plays the whole chunk shown
// in that gray box (the full passage the word came from), not just the isolated word/phrase.
function playVocabPassage(e, i) {
  e.stopPropagation();
  const chunk = VOICEOVER_CHUNKS[SAVED_VOCAB[i].ci];
  activeVocabPreviewEl = e.currentTarget.closest('.vocab-expand-inner')?.querySelector('.vocab-expand-text') || null;
  playLessonAudioSlice(chunk.start, chunk.end, e.currentTarget);
}

/* ─────────────── SAVE (Vocab + auto Verbs) ─────────────── */
function handleSave(e) {
  e.stopPropagation();
  if (!currentSelectionCtx) return;
  if (SAVED_VOCAB.some(v => v.ar === currentSelectionCtx.ar)) { refreshSaveButton(); return; }
  SAVED_VOCAB.unshift({ ...currentSelectionCtx });
  renderVocabView();
  const ar = document.getElementById('tray-ar').textContent;
  let msg = t('savedToVocab')(ar);
  if (currentSelectionCtx.type === 'word' && currentSelectionCtx.isVerb) {
    if (addVerbToVerbsTab(currentSelectionCtx)) msg += t('andVerbs');
  }
  showToast(msg);
  refreshSaveButton();
}
let verbIdCounter = 0; // set in initLesson() once SAVED_VERBS is populated
function addVerbToVerbsTab(ctx) {
  if (SAVED_VERBS.some(v => v.arDisplay === ctx.ar)) return false;
  SAVED_VERBS.unshift({
    id: 'v' + (verbIdCounter++),
    ar: ctx.ar,
    arDisplay: ctx.ar,
    root: ctx.root || null,
    binyan: null,
    formNum: null,
    dialectNote: null,
    gloss_he: ctx.he,
    gloss_en: ctx.en || '',
    participle: null,
    masdar: null,
    conj: null,
  });
  activeVerbId = SAVED_VERBS[0].id;
  activeConjTab = 'present';
  renderVerbsView();
  return true;
}

/* ─────────────── VERBS VIEW ─────────────── */
// Wazn (مِيزان صَرْفي) templates for Forms I–X, built on the classical placeholder
// root ف-ع-ل: everything beyond the three root letters (tashkeel, a prefixed
// hamza/ت/ن/سـت, an infixed ت, or a doubled final radical) is what that form adds.
const WAZN_PATTERNS = {
  1: 'فَعَلَ',
  2: 'فَعَّلَ',
  3: 'فَاعَلَ',
  4: 'أَفْعَلَ',
  5: 'تَفَعَّلَ',
  6: 'تَفَاعَلَ',
  7: 'اِنْفَعَلَ',
  8: 'اِفْتَعَلَ',
  9: 'اِفْعَلَّ',
  10: 'اِسْتَفْعَلَ',
};
function renderVerbsView() {
  document.getElementById('verbs-count').textContent = t('verbsCount')(SAVED_VERBS.length);
  const UNSORTED = 'unsorted';
  const groups = {};
  SAVED_VERBS.forEach(v => { const key = v.formNum || UNSORTED; (groups[key] = groups[key]||[]).push(v); });

  const pillsEl = document.getElementById('verb-pills');
  pillsEl.innerHTML = '';

  const orderedForms = [1,2,3,4,5,6,7,8,9,10].filter(n => groups[n]);
  if (groups[UNSORTED]) orderedForms.push(UNSORTED);
  orderedForms.forEach(formNum => {
    const groupKey = String(formNum);
    const isCollapsed = collapsedVerbGroups.has(groupKey);

    const groupWrap = document.createElement('div');
    groupWrap.style.cssText = 'width:100%;display:flex;flex-direction:column;gap:8px;margin-bottom:16px';

    const label = document.createElement('div');
    label.className = 'verb-group-header' + (isCollapsed ? ' collapsed' : '');
    let titleHtml;
    const waznPattern = formNum !== UNSORTED ? WAZN_PATTERNS[formNum] : null;
    const waznHtml = waznPattern ? '<span class="verb-group-wazn" dir="' + scriptDir() + '">&nbsp;·&nbsp;' + arText(waznPattern) + '</span>' : '';
    if (formNum === UNSORTED) {
      titleHtml = appLang === 'en' ? 'Unclassified' : 'טרם סווג';
    } else if (appLang === 'en') {
      titleHtml = 'Form ' + formNum + waznHtml;
    } else {
      const binyanName = groups[formNum][0].binyan;
      titleHtml = 'בניין ' + formNum + (binyanName ? '<span class="verb-group-sub">&nbsp;·&nbsp;' + binyanName + '</span>' : '') + waznHtml;
    }
    label.innerHTML = '<span class="verb-group-chevron">▾</span><span class="verb-group-title">'+titleHtml+'</span><span class="verb-group-count">'+groups[formNum].length+'</span>';
    label.onclick = () => toggleVerbGroup(groupKey);
    groupWrap.appendChild(label);

    const row = document.createElement('div');
    row.className = 'verb-pill-row' + (isCollapsed ? ' collapsed' : '');
    const sorted = groups[formNum].slice().sort((a, b) => (a.root || '￿').localeCompare(b.root || '￿', 'ar'));
    sorted.forEach(v => {
      const btn = document.createElement('button');
      btn.className = 'verb-pill' + (v.id===activeVerbId?' active':'');
      btn.innerHTML = '<span class="verb-pill-ar" dir="'+scriptDir()+'">'+arText(v.arDisplay)+'</span><span class="verb-pill-root" dir="'+scriptDir()+'">'+arText(v.root||'')+'</span>';
      btn.onclick = () => {
        activeVerbId=v.id; activeConjTab='present'; renderVerbsView();
        if (window.matchMedia('(max-width:720px)').matches) openVerbDrawer();
      };
      row.appendChild(btn);
    });
    groupWrap.appendChild(row);
    pillsEl.appendChild(groupWrap);
  });

  if (!activeVerbId && SAVED_VERBS.length) activeVerbId = SAVED_VERBS[0].id;
  const verb = SAVED_VERBS.find(v=>v.id===activeVerbId);
  const card = document.getElementById('verb-card');
  if (!verb) { card.innerHTML = ''; return; }

  const isEn = appLang === 'en';
  const conjTabs = ['past','present','imperative'];
  const conjLabels = isEn
    ? { past:'Past', present:'Present', imperative:'Imperative' }
    : { past:'עָבָר', present:'הוֹוֶה', imperative:'צִיווּי' };

  const binyanHtml = verb.formNum
    ? '<span class="binyan-badge-ar" dir="' + scriptDir() + '">' + arText(WAZN_PATTERNS[verb.formNum]) + '</span>'
      + '<span style="font-weight:700;margin-right:6px;font-size:13px">&nbsp;·&nbsp;'+verb.formNum+'</span>'
    : '<span style="opacity:.5">' + (isEn ? 'Unclassified' : 'טרם סווג') + '</span>';
  const rootSpan = verb.root ? '<span dir="' + scriptDir() + '">' + arText(verb.root) + '</span>' : '';
  const rootTagHtml = isEn
    ? (verb.root ? 'Root ' + rootSpan : 'Root — not yet identified')
    : (verb.root ? 'שורש '+rootSpan : 'שורש — טרם זוהה');
  // English mode is a deliberately thinner card: dialect notes, participle, and masdar only
  // exist as Hebrew data today (verbs-data.js has no English fields for them), so rather than
  // show a half-Hebrew "English" card, those sections are omitted entirely until backfilled.
  const arSubHtml = arText(verb.arDisplay) + (!isEn && verb.dialectNote ? ' &mdash; <span style="color:var(--mid)">'+verb.dialectNote+'</span>' : '');
  const glossHtml = isEn
    ? `<div class="verb-gloss-he" style="margin-top:12px">${verb.gloss_en || ''}</div>`
    : `<div class="verb-gloss-he" style="margin-top:12px">${verb.gloss_he}</div>
        <div class="verb-gloss-en-wrap" style="margin-top:4px">
          <button class="en-chip" onclick="this.nextElementSibling.classList.toggle('hidden'); this.textContent=this.textContent==='EN ›'?'EN ×':'EN ›'">EN ›</button>
          <span class="verb-gloss-en hidden" style="font-size:13px;color:var(--mid)">${verb.gloss_en}</span>
        </div>`;
  const derivedHtml = isEn ? '' : `
    <div class="verb-derived">
      <div class="derived-label">צורות נגזרות</div>
      ${(verb.participle || verb.masdar) ? `
      <div class="derived-row">
        ${verb.participle ? `
        <div class="derived-item">
          <div style="font-size:10px;font-weight:700;letter-spacing:.07em;color:var(--mid);margin-bottom:6px;text-transform:uppercase">בינוני הפועל</div>
          <div style="display:flex;gap:16px;flex-wrap:wrap">
            <div class="derived-item">
              <div class="derived-ar" dir="${scriptDir()}">${arText(verb.participle.m)}</div>
              <div class="derived-sub">זכר</div>
            </div>
            <div class="derived-item">
              <div class="derived-ar" dir="${scriptDir()}">${arText(verb.participle.f)}</div>
              <div class="derived-sub">נקבה</div>
            </div>
            <div class="derived-item">
              <div class="derived-ar" dir="${scriptDir()}">${arText(verb.participle.pl)}</div>
              <div class="derived-sub">רבים</div>
            </div>
          </div>
          <div style="font-size:13px;color:var(--mid);margin-top:6px;direction:rtl">${verb.participle.he}</div>
        </div>
        ` : ''}
        ${(verb.participle && verb.masdar) ? '<div style="width:1px;background:var(--rule);margin:0 8px;align-self:stretch"></div>' : ''}
        ${verb.masdar ? `
        <div class="derived-item">
          <div style="font-size:10px;font-weight:700;letter-spacing:.07em;color:var(--mid);margin-bottom:6px;text-transform:uppercase">שם פעולה</div>
          <div class="derived-ar" dir="${scriptDir()}">${arText(verb.masdar.ar)}</div>
          <div class="derived-sub">${verb.masdar.he}</div>
        </div>
        ` : ''}
      </div>
      ` : `<div style="font-size:13px;color:var(--mid);direction:rtl">טרם הוזנו צורות נגזרות לפועל זה</div>`}
    </div>`;
  const conjHtml = verb.conj ? `
      <div class="conj-tabs">
        ${conjTabs.map(t=>`<div class="conj-tab${t===activeConjTab?' active':''}" onclick="setConjTab('${t}')">${conjLabels[t]}</div>`).join('')}
      </div>
      <div class="conj-table-wrap">
      <table class="conj-table">
        ${verb.conj[activeConjTab].map(row => isEn ? `
          <tr>
            <td class="conj-ar" dir="${scriptDir()}">${arText(row.ar)}</td>
            <td class="conj-pronoun">${PRONOUN_EN[row.pronoun] || row.pronoun}</td>
          </tr>
        ` : `
          <tr>
            <td class="conj-ar" dir="${scriptDir()}">${arText(row.ar)}</td>
            <td class="conj-he">${row.he}</td>
            <td class="conj-pronoun">${row.pronoun}</td>
            ${row.context ? `<td class="conj-context">${row.context}</td>` : '<td></td>'}
          </tr>
        `).join('')}
      </table>
      </div>
    ` : `<div style="font-size:13px;color:var(--mid);${isEn?'':'direction:rtl'}">${isEn ? 'No conjugations saved yet for this verb — pending edit' : 'אין עדיין נטיות שמורות לפועל זה — ממתין לעריכה'}</div>`;

  card.innerHTML = `
    <div class="tray-handle-row" id="verb-card-handle">
      <div class="tray-handle-bar"></div>
    </div>
    <div class="verb-card-head">
      <div class="verb-card-ar">
        <div class="verb-ar-main" dir="${scriptDir()}">${arText(verb.ar)}</div>
        <div class="verb-ar-sub" dir="${scriptDir()}">${arSubHtml}</div>
        ${glossHtml}
      </div>
      <div class="verb-card-meta">
        <div class="binyan-badge">${binyanHtml}</div>
        <div class="verb-root-tag">${rootTagHtml}</div>
      </div>
    </div>
    ${derivedHtml}
    <div class="verb-conj">${conjHtml}</div>
  `;
  // The handle above is rebuilt from scratch on every render, so its swipe/tap-to-close
  // listeners need rebinding each time too.
  initSwipeToClose(document.getElementById('verb-card-handle'), card, closeVerbDrawer);
}
function openVerbDrawer() { document.getElementById('verb-card').classList.add('open'); }
function closeVerbDrawer() { document.getElementById('verb-card').classList.remove('open'); }

function setConjTab(tab) { activeConjTab=tab; renderVerbsView(); }

/* ─────────────── VOCAB VIEW ─────────────── */
const expandedVocab = new Set();
let vocabSearch = '';
let vocabTypeFilter = 'all'; // all | verb | phrase | other (mutually exclusive: a saved verb only matches 'verb', not 'other')
let vocabSort = 'speech'; // speech | alpha | recent

function setVocabSearch(q) { vocabSearch = q; renderVocabView(); }
function setVocabTypeFilter(f) {
  vocabTypeFilter = f;
  document.querySelectorAll('#vocab-type-chips .vocab-chip').forEach(c => c.classList.toggle('active', c.dataset.filter === f));
  renderVocabView();
}
function setVocabSort(s) { vocabSort = s; renderVocabView(); }

function vocabMatchesFilter(v) {
  if (vocabTypeFilter === 'other' && (v.type !== 'word' || v.isVerb)) return false;
  if (vocabTypeFilter === 'phrase' && v.type !== 'phrase') return false;
  if (vocabTypeFilter === 'verb' && !v.isVerb) return false;
  if (vocabSearch.trim()) {
    const q = vocabSearch.trim().toLowerCase();
    const hay = (v.ar + ' ' + v.he + ' ' + (v.en||'')).toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function renderVocabView() {
  document.getElementById('vocab-toolbar').style.display = SAVED_VOCAB.length ? 'flex' : 'none';
  document.getElementById('vocab-empty').style.display = SAVED_VOCAB.length ? 'none' : 'block';

  const visible = SAVED_VOCAB
    .map((v, i) => ({ v, i }))
    .filter(({ v }) => vocabMatchesFilter(v));
  visible.sort((a, b) => {
    if (vocabSort === 'alpha') return a.v.ar.localeCompare(b.v.ar, 'ar');
    if (vocabSort === 'recent') return a.i - b.i;
    return (a.v.ci - b.v.ci) || (a.i - b.i); // order in speech
  });

  document.getElementById('vocab-count').textContent = visible.length === SAVED_VOCAB.length ? t('vocabItemsCount')(visible.length) : t('vocabCountOf')(visible.length, SAVED_VOCAB.length);

  const list = document.getElementById('vocab-list');
  if (SAVED_VOCAB.length && !visible.length) {
    list.innerHTML = '<div class="vocab-no-results">' + t('vocabNoResults') + '</div>';
    return;
  }
  list.innerHTML = visible.map(({ v, i }) => {
    const meta = v.type === 'phrase' ? phraseTypeBadgeHtml(v.phraseType) : rootMetaHtml(v.root, !!v.sharedRoot);
    const isOpen = expandedVocab.has(i);
    const primary = appLang === 'en' ? (v.en||'') : v.he;
    const enWrapHtml = appLang === 'en' ? '' : `
          <div class="vocab-row-en-wrap">
            <button class="en-chip" onclick="toggleVocabEn(event, ${i})">EN &rsaquo;</button>
            <span class="vocab-row-en hidden" id="vocab-en-${i}">${v.en||''}</span>
          </div>`;
    return `
      <div class="vocab-item">
        <div class="vocab-card-head">
          <div class="vocab-row-ar${v.type==='phrase'?' phrase':''}" dir="${scriptDir()}">${arText(v.ar)}</div>
          <div class="vocab-card-actions">
            <button class="vocab-row-toggle${isOpen?' open':''}" title="${t('showSourceLine')}" onclick="toggleVocabExpand(${i})"><span class="chev">&#9662;</span></button>
            <button class="vocab-row-delete" title="${t('removeFromVocab')}" onclick="removeVocabItem(event, ${i})">&times;</button>
          </div>
        </div>
        <div class="vocab-card-divider"></div>
        <div class="vocab-row-gloss">
          <div class="vocab-row-he">${primary}</div>
          <div class="vocab-row-meta">${meta}</div>${enWrapHtml}
        </div>
        <div class="vocab-expand${isOpen?' open':''}">
          <div class="vocab-expand-inner">
            <div class="vocab-expand-head">
              <div class="vocab-expand-time">${VOICEOVER_CHUNKS[v.ci].label}</div>
              <button class="vocab-row-pronounce" title="${t('playPassage')}" onclick="playVocabPassage(event, ${i})">${PRONOUNCE_ICON_SVG}</button>
            </div>
            <p class="vocab-expand-text" dir="${scriptDir()}">${renderChunkPreview(v.ci, v.ar)}</p>
          </div>
        </div>
      </div>
    `;
  }).join('');
}
function toggleVocabEn(e, i) {
  e.stopPropagation();
  const span = document.getElementById('vocab-en-'+i);
  const showing = !span.classList.contains('hidden');
  span.classList.toggle('hidden', showing);
  e.currentTarget.textContent = showing ? 'EN ×' : 'EN ›';
  e.currentTarget.classList.toggle('showing', !showing);
}
function toggleVocabExpand(i) {
  expandedVocab.has(i) ? expandedVocab.delete(i) : expandedVocab.add(i);
  renderVocabView();
}
function removeVocabItem(e, i) {
  e.stopPropagation();
  const removed = SAVED_VOCAB[i];
  SAVED_VOCAB.splice(i, 1);
  const shifted = new Set();
  expandedVocab.forEach(idx => { if (idx < i) shifted.add(idx); else if (idx > i) shifted.add(idx - 1); });
  expandedVocab.clear();
  shifted.forEach(idx => expandedVocab.add(idx));
  renderVocabView();
  showToast(t('removedFromVocab')(removed.ar));
  if (currentSelectionCtx && currentSelectionCtx.ar === removed.ar) refreshSaveButton();
}
function renderChunkPreview(ci, targetAr) {
  const allTokens = CHUNKS[ci].text;
  const wordTokens = allTokens.filter(t => t.sep === undefined);
  const targetWords = targetAr.split(' ').filter(Boolean);
  let matchStart = -1;
  for (let i = 0; i <= wordTokens.length - targetWords.length; i++) {
    let ok = true;
    for (let j = 0; j < targetWords.length; j++) { if (wordTokens[i+j].w !== targetWords[j]) { ok = false; break; } }
    if (ok) { matchStart = i; break; }
  }
  // Global word index (matches VOICEOVER_WORD_TIMES' idx / wordEls[].globalIdx in the Reader) --
  // lets karaoke-mode live-word highlighting during passage playback find the right span here.
  const chunkStartGi = chunkRanges[ci].startIdx;
  let wi = -1;
  return allTokens.map(t => {
    if (t.sep !== undefined) return t.sep;
    wi++;
    const isMatch = matchStart >= 0 && wi >= matchStart && wi < matchStart + targetWords.length;
    const text = arText(t.w) + (t.punct || ''); // punct never transliterated, matching logic above stays on raw t.w
    const span = '<span class="chunk-preview-word" data-gi="' + (chunkStartGi + wi) + '">' + text + '</span>';
    return isMatch ? '<mark class="chunk-preview-hl">'+span+'</mark>' : span;
  }).join(' ');
}
function showToast(msg) { const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2200); }

/* ─────────────── ABOUT VIEW (follows the global HE/EN language preference) ───────────────
   ABOUT_CONTENT is lesson content, populated by initLesson() (see LESSON DATA at the top). */
function renderAboutView() {
  const data = ABOUT_CONTENT[appLang];
  const inner = document.getElementById('about-inner');
  inner.style.direction = data.dir;
  inner.style.textAlign = data.dir === 'rtl' ? 'right' : 'left';
  inner.innerHTML = data.sections.map(s => `
    <div class="about-section">
      <div class="about-eyebrow">${s.eyebrow}</div>
      <h2 class="about-heading">${s.heading}</h2>
      ${s.paragraphs.map(p => `<p class="about-text">${p}</p>`).join('')}
      ${s.source ? `<div class="about-source">${s.source}</div>` : ''}
    </div>
  `).join('');
}

/* ─────────────── WATCH TAB ─────────────── */
// Native <track> stays on the <video> for accessibility (CC toggle, screen readers), but the
// primary caption UX is this external synced transcript panel. Each cue pairs its Arabic line
// with a running he/en translation right below it (not tap-to-translate like the Reader) --
// the goal here is watching the speech straight through; anyone who wants word-level study can
// open the Reader instead.
// Karaoke (per-word) highlighting on the Arabic line is layered on top of the cue-level
// highlight, same pairing as the AI voiceover -- reliable here (86.7%, see
// watch-captions-data.js) because both the segment text and the word timestamps come from
// transcribing the same raw speech, unlike the Reader's cleaned-text alignment attempt.
// The translation panel does NOT get word-level karaoke -- it's a full-sentence AI translation
// with no real per-word correspondence to the Arabic, and an interpolated/estimated per-word
// timing there read as distracting rather than helpful. Instead, clicking a word (or dragging
// across a phrase) in the Arabic panel just seeks the video and lets the existing cue-level sync
// highlight the matching line in the translation panel next to it.
let watchArCueEls = [];
let watchTrCueEls = [];
let watchTrWordsByCue = []; // per cue index: array of translation word spans
let activeWatchCueIdx = -1;
let watchWordEls = [];
let watchWordData = []; // parallel to watchWordEls: pristine source word object, so applyScriptMode() can re-derive text on toggle
let watchCueOfWordIdx = []; // parallel to watchWordEls: which cue index each word belongs to
let watchCueWordRanges = []; // per cue: {startIdx, endIdx} into watchWordEls/watchCueOfWordIdx
let watchTimedWords = [];
let liveWatchWordIdx = -1;

function buildWatchTranscript() {
  const arPanel = document.getElementById('watch-transcript-ar');
  const trPanel = document.getElementById('watch-transcript-tr');
  const video = watchVideoEl;
  arPanel.innerHTML = '';
  trPanel.innerHTML = '';
  watchWordEls = [];
  watchWordData = [];
  watchCueOfWordIdx = [];
  watchCueWordRanges = [];
  watchTimedWords = [];

  const seekToCue = (cue) => {
    const inThisCue = video.currentTime >= cue.start && video.currentTime < cue.end;
    if (inThisCue) video.pause();
    else { video.currentTime = cue.start; video.play(); }
  };

  watchArCueEls = WATCH_CAPTIONS.map((cue, ci) => {
    const div = document.createElement('div');
    div.className = 'watch-cue watch-cue-ar';
    div.dir = scriptDir(); // word order in cue.words already matches spoken order -- flipping dir alone re-renders it LTR/RTL correctly
    const startIdx = watchWordEls.length;
    cue.words.forEach((wd) => {
      const span = document.createElement('span');
      span.className = 'watch-word';
      span.textContent = arText(wd.w);
      span.dir = scriptDir();
      span.dataset.widx = watchWordEls.length;
      div.appendChild(span);
      div.appendChild(document.createTextNode(' '));
      const wi = watchWordEls.length;
      watchWordEls.push(span);
      watchWordData.push(wd);
      watchCueOfWordIdx.push(ci);
      if (wd.t !== undefined) watchTimedWords.push({ idx: wi, t: wd.t });
    });
    watchCueWordRanges.push({ startIdx, endIdx: watchWordEls.length - 1 });
    div.addEventListener('click', (e) => {
      if (watchLastActionWasDrag) { watchLastActionWasDrag = false; return; }
      const wordEl = e.target.closest('.watch-word');
      if (wordEl) {
        clearWatchSelection();
        wordEl.classList.add('selected');
        const gi = parseInt(wordEl.dataset.widx, 10);
        linkWatchSelectionToTranslation(gi, gi);
      }
      seekToCue(cue);
    });
    arPanel.appendChild(div);
    return div;
  });

  watchTrWordsByCue = [];
  watchTrCueEls = WATCH_CAPTIONS.map((cue) => {
    const div = document.createElement('div');
    div.className = 'watch-cue watch-cue-tr';
    const text = appLang === 'en' ? cue.en : cue.he;
    const words = text.split(/\s+/).filter(Boolean);
    const spans = words.map((w) => {
      const span = document.createElement('span');
      span.className = 'watch-word';
      span.textContent = w;
      div.appendChild(span);
      div.appendChild(document.createTextNode(' '));
      return span;
    });
    watchTrWordsByCue.push(spans);
    div.addEventListener('click', () => seekToCue(cue));
    trPanel.appendChild(div);
    return div;
  });

  watchTimedWords.sort((a, b) => a.t - b.t);
  video.addEventListener('timeupdate', () => { updateWatchActiveCue(); updateWatchLiveWord(); });
  initWatchDragSelect();
  applyWatchTranslationVisibility();
  syncWatchCueHeights();
}
// The Arabic and translation columns lay out independently (separate scrollable panels), so the
// same cue can wrap to a different number of lines in each -- distractingly so once the user
// bumps the text size, since Arabic and its English/Hebrew translation are rarely the same
// length. Force each cue's pair of boxes to share the taller of their two natural heights,
// re-run whenever text size or language changes since both affect wrapping.
function syncWatchCueHeights() {
  for (let i = 0; i < watchArCueEls.length; i++) {
    watchArCueEls[i].style.minHeight = '';
    watchTrCueEls[i].style.minHeight = '';
  }
  for (let i = 0; i < watchArCueEls.length; i++) {
    const h = Math.max(watchArCueEls[i].offsetHeight, watchTrCueEls[i].offsetHeight);
    watchArCueEls[i].style.minHeight = h + 'px';
    watchTrCueEls[i].style.minHeight = h + 'px';
  }
}
function applyWatchTranslationLang() {
  watchTrHighlighted = []; // the old spans are about to be discarded
  watchTrCueEls.forEach((el, ci) => {
    el.innerHTML = '';
    const text = appLang === 'en' ? WATCH_CAPTIONS[ci].en : WATCH_CAPTIONS[ci].he;
    watchTrWordsByCue[ci] = text.split(/\s+/).filter(Boolean).map((w) => {
      const span = document.createElement('span');
      span.className = 'watch-word';
      span.textContent = w;
      el.appendChild(span);
      el.appendChild(document.createTextNode(' '));
      return span;
    });
  });
  syncWatchCueHeights();
  renderMobileCueOverlay(activeWatchCueIdx);
}

/* ─────────────── WATCH TAB: mobile fullscreen overlay captions ───────────────
   Mobile theater mode (see CSS) hides the two scrolling transcript columns and shows the video
   near-fullscreen instead, with the active cue's Arabic (karaoke-highlighted, same word timing
   as the desktop column) and translation burned in as an overlay ribbon -- a real subtitle-player
   feel on a small screen, where three side-by-side columns wouldn't fit. */
let overlayWordEls = {}; // global word idx -> overlay span, only for the currently-shown cue
let watchTranslationVisible = true;
function renderMobileCueOverlay(cueIdx) {
  const arEl = document.getElementById('watch-mobile-cap-ar');
  const trEl = document.getElementById('watch-mobile-cap-tr');
  arEl.innerHTML = '';
  overlayWordEls = {};
  if (cueIdx < 0) { trEl.textContent = ''; return; }
  const cue = WATCH_CAPTIONS[cueIdx];
  const range = watchCueWordRanges[cueIdx];
  for (let gi = range.startIdx; gi <= range.endIdx; gi++) {
    const span = document.createElement('span');
    span.className = 'watch-word';
    span.textContent = watchWordEls[gi].textContent;
    if (liveWatchWordIdx === gi) span.classList.add('live');
    arEl.appendChild(span);
    arEl.appendChild(document.createTextNode(' '));
    overlayWordEls[gi] = span;
  }
  trEl.textContent = appLang === 'en' ? cue.en : cue.he;
}
function toggleWatchTranslationVisible() {
  watchTranslationVisible = !watchTranslationVisible;
  applyWatchTranslationVisibility();
}
function applyWatchTranslationVisibility() {
  document.getElementById('watch-transcript-tr').classList.toggle('watch-tr-hidden', !watchTranslationVisible);
  document.getElementById('watch-mobile-cap-tr').classList.toggle('watch-tr-hidden', !watchTranslationVisible);
  const btn = document.getElementById('watch-tr-toggle-btn');
  btn.classList.toggle('active', watchTranslationVisible);
  btn.title = watchTranslationVisible ? t('hideTranslation') : t('showTranslation');
}

/* ─────────────── WATCH TAB: word click / phrase drag-select ───────────────
   Visual-only (no translation tray, no vocab save -- that workflow lives in the Reader). A tap
   seeks the video via the cue click handler above (word clicks bubble to it). A drag across
   multiple words shows a phrase selection and seeks to the first word's cue on release. */
let watchDragActive = false, watchDragStartIdx = -1, watchDragEndIdx = -1;
let watchLastActionWasDrag = false;
function watchWordAtPoint(x, y) {
  const el = document.elementFromPoint(x, y);
  return (el && el.classList.contains('watch-word')) ? parseInt(el.dataset.widx, 10) : -1;
}
function renderWatchRange(lo, hi) { watchWordEls.forEach((el, gi) => { el.classList.remove('selected'); el.classList.toggle('in-range', gi >= lo && gi <= hi); el.classList.toggle('range-start', gi === lo); el.classList.toggle('range-end', gi === hi); }); }
function clearWatchSelection() { watchWordEls.forEach((el) => el.classList.remove('in-range', 'range-start', 'range-end', 'selected')); watchDragStartIdx = -1; watchDragEndIdx = -1; }
// Highlights the SPECIFIC words in the translation that correspond to the selected Arabic
// range -- not the whole cue block. There's no real word-level alignment between the Arabic and
// the AI-translated sentence (different word order/count), so this maps by PROPORTIONAL
// POSITION within the sentence (e.g. a selection starting a third of the way through the Arabic
// cue highlights words starting a third of the way through its translation) -- an estimate, not
// a measured correspondence, same honesty rule as the karaoke timing elsewhere in this tab.
let watchTrHighlighted = [];
function linkWatchSelectionToTranslation(loGlobal, hiGlobal) {
  watchTrHighlighted.forEach((el) => el.classList.remove('tr-phrase-highlight'));
  watchTrHighlighted = [];
  const ci = watchCueOfWordIdx[loGlobal];
  const range = watchCueWordRanges[ci];
  const totalWords = range.endIdx - range.startIdx + 1;
  const loLocal = loGlobal - range.startIdx;
  const hiLocal = Math.min(hiGlobal, range.endIdx) - range.startIdx;
  const trWords = watchTrWordsByCue[ci];
  const n = trWords.length;
  const trLo = Math.floor(loLocal / totalWords * n);
  const trHi = Math.max(trLo, Math.ceil((hiLocal + 1) / totalWords * n) - 1);
  for (let i = trLo; i <= Math.min(trHi, n - 1); i++) {
    trWords[i].classList.add('tr-phrase-highlight');
    watchTrHighlighted.push(trWords[i]);
  }
  watchTrCueEls[ci].scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function commitWatchDrag(lo, hi) {
  const video = watchVideoEl;
  const ci = watchCueOfWordIdx[lo];
  const cue = WATCH_CAPTIONS[ci];
  linkWatchSelectionToTranslation(lo, hi);
  video.currentTime = cue.start; video.play();
}
function onWatchDragStart(e) { const i = watchWordAtPoint(e.clientX, e.clientY); if (i < 0) return; e.preventDefault(); watchDragActive = true; watchDragStartIdx = i; watchDragEndIdx = i; renderWatchRange(i, i); }
function onWatchDragMove(e) { if (!watchDragActive) return; const i = watchWordAtPoint(e.clientX, e.clientY); if (i >= 0 && i !== watchDragEndIdx) { watchDragEndIdx = i; renderWatchRange(Math.min(watchDragStartIdx, watchDragEndIdx), Math.max(watchDragStartIdx, watchDragEndIdx)); } }
function onWatchDragEnd() {
  if (!watchDragActive) return;
  watchDragActive = false;
  const lo = Math.min(watchDragStartIdx, watchDragEndIdx), hi = Math.max(watchDragStartIdx, watchDragEndIdx);
  watchLastActionWasDrag = lo !== hi;
  if (lo !== hi) commitWatchDrag(lo, hi);
  else clearWatchSelection();
}
const WATCH_TOUCH_LONG_PRESS_MS = 350;
const WATCH_TOUCH_MOVE_THRESHOLD = 10;
let watchTouchTimer = null, watchTouchStartX = 0, watchTouchStartY = 0, watchTouchStartIdx = -1, watchTouchArmed = false;
function clearWatchTouchTimer() { if (watchTouchTimer) { clearTimeout(watchTouchTimer); watchTouchTimer = null; } }
function onWatchTouchStart(e) {
  const t = e.touches[0], i = watchWordAtPoint(t.clientX, t.clientY);
  if (i < 0) return;
  watchTouchStartX = t.clientX; watchTouchStartY = t.clientY; watchTouchStartIdx = i; watchTouchArmed = false;
  clearWatchTouchTimer();
  watchTouchTimer = setTimeout(() => {
    watchTouchArmed = true; watchDragActive = true; watchDragStartIdx = i; watchDragEndIdx = i;
    renderWatchRange(i, i);
  }, WATCH_TOUCH_LONG_PRESS_MS);
}
function onWatchTouchMove(e) {
  const t = e.touches[0];
  if (!watchTouchArmed) {
    if (watchTouchStartIdx < 0) return;
    const dx = Math.abs(t.clientX - watchTouchStartX), dy = Math.abs(t.clientY - watchTouchStartY);
    if (dx > WATCH_TOUCH_MOVE_THRESHOLD || dy > WATCH_TOUCH_MOVE_THRESHOLD) { clearWatchTouchTimer(); watchTouchStartIdx = -1; }
    return;
  }
  e.preventDefault();
  const i = watchWordAtPoint(t.clientX, t.clientY);
  if (i >= 0 && i !== watchDragEndIdx) { watchDragEndIdx = i; renderWatchRange(Math.min(watchDragStartIdx, watchDragEndIdx), Math.max(watchDragStartIdx, watchDragEndIdx)); }
}
function onWatchTouchEnd() {
  clearWatchTouchTimer();
  if (watchTouchArmed) {
    watchTouchArmed = false;
    if (watchDragActive) {
      watchDragActive = false;
      const lo = Math.min(watchDragStartIdx, watchDragEndIdx), hi = Math.max(watchDragStartIdx, watchDragEndIdx);
      watchLastActionWasDrag = lo !== hi;
      if (lo !== hi) commitWatchDrag(lo, hi);
      else clearWatchSelection();
    }
  }
  watchTouchStartIdx = -1;
}
function onWatchTouchCancel() {
  clearWatchTouchTimer();
  watchTouchArmed = false; watchTouchStartIdx = -1;
  if (watchDragActive) { watchDragActive = false; clearWatchSelection(); }
}
function initWatchDragSelect() {
  const panel = document.getElementById('watch-transcript-ar');
  panel.addEventListener('mousedown', onWatchDragStart);
  document.addEventListener('mousemove', onWatchDragMove);
  document.addEventListener('mouseup', onWatchDragEnd);
  panel.addEventListener('touchstart', onWatchTouchStart, { passive: true });
  panel.addEventListener('touchmove', onWatchTouchMove, { passive: false });
  document.addEventListener('touchend', onWatchTouchEnd);
  document.addEventListener('touchcancel', onWatchTouchCancel);
  panel.addEventListener('contextmenu', (e) => e.preventDefault());
}


/* ─────────────── WATCH TAB: bottom toolbar (mirrors Reader's audio-bar) ─────────────── */
const watchChrome = createMediaChrome({
  mediaEl: watchVideoEl, muteBtnId: 'watch-mute-btn', muteIconId: 'watch-mute-icon',
  speedBtnSelector: '#watch-speed-btn', timeLabelId: 'watch-time-label',
});
function cycleWatchSpeed() { watchChrome.cycleSpeed(); }
function toggleWatchMute() { watchChrome.toggleMute(); }
function updateWatchMuteIcon() { watchChrome.updateMuteIcon(); }
function updateWatchTimeLabel() { watchChrome.updateTimeLabel(); }
function toggleWatchPlay() { const v = watchVideoEl; v.paused ? v.play() : v.pause(); }
function skipWatch(delta) {
  const v = watchVideoEl;
  v.currentTime = Math.min(Math.max(0, v.currentTime + delta), v.duration || Infinity);
  updateWatchProgress();
}
const watchScrubberFillEl = document.getElementById('watch-scrubber-fill');
const watchVideoScrubberFillEl = document.getElementById('watch-video-scrubber-fill');
function updateWatchProgress() {
  const total = watchVideoEl.duration || 1;
  const pct = (watchVideoEl.currentTime / total * 100) + '%';
  watchScrubberFillEl.style.width = pct;
  watchVideoScrubberFillEl.style.width = pct;
  updateWatchTimeLabel();
}
// Draggable scrub bar, shared by the overlay on the video itself and the toolbar's scrubber
// below -- mirrors the Reader's word drag-select gesture handling: pointerdown seeks
// immediately and arms dragging, pointermove re-seeks continuously, pointerup disarms.
function makeScrubberDraggable(hit) {
  const v = watchVideoEl;
  let dragging = false;
  function seekFromClientX(clientX) {
    const r = hit.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    v.currentTime = pct * (v.duration || 0);
    updateWatchProgress();
  }
  hit.addEventListener('mousedown', (e) => { dragging = true; hit.classList.add('dragging'); seekFromClientX(e.clientX); e.preventDefault(); });
  document.addEventListener('mousemove', (e) => { if (dragging) seekFromClientX(e.clientX); });
  document.addEventListener('mouseup', () => { if (dragging) { dragging = false; hit.classList.remove('dragging'); } });
  hit.addEventListener('touchstart', (e) => { dragging = true; hit.classList.add('dragging'); seekFromClientX(e.touches[0].clientX); }, { passive: true });
  hit.addEventListener('touchmove', (e) => { if (dragging) { seekFromClientX(e.touches[0].clientX); e.preventDefault(); } }, { passive: false });
  hit.addEventListener('touchend', () => { dragging = false; hit.classList.remove('dragging'); });
  hit.addEventListener('touchcancel', () => { dragging = false; hit.classList.remove('dragging'); });
}
function initVideoScrubberDrag() {
  makeScrubberDraggable(document.getElementById('watch-video-scrubber-hit'));
  makeScrubberDraggable(document.getElementById('watch-scrubber'));
}
function initWatchToolbar() {
  const v = watchVideoEl;
  v.addEventListener('volumechange', updateWatchMuteIcon);
  v.addEventListener('loadedmetadata', updateWatchTimeLabel);
  v.addEventListener('timeupdate', updateWatchProgress);
  v.addEventListener('play', () => { document.getElementById('watch-play-icon').innerHTML = '<rect x="3" y="2" width="3" height="10"/><rect x="8" y="2" width="3" height="10"/>'; document.querySelector('.watch-video-wrap').classList.add('playing'); enterWatchTheater(); });
  v.addEventListener('pause', () => { document.getElementById('watch-play-icon').innerHTML = '<polygon points="3,1 13,7 3,13"/>'; document.querySelector('.watch-video-wrap').classList.remove('playing'); });
  v.addEventListener('ended', () => { v.currentTime = 0; document.querySelector('.watch-video-wrap').classList.remove('playing'); });
  updateWatchTheaterIcon();
  initVideoScrubberDrag();
}

/* ─────────────── WATCH TAB: theater/expanded mode ─────────────── */
// Fills the whole view with video + transcript (no scrolling) instead of the normal
// head/intro + capped-height layout. Entered automatically on play (so hitting play jumps
// straight into it), and toggleable independently via the toolbar button.
let watchTheaterOn = false;
const WATCH_THEATER_ICON = { enter: '<path d="M1 5V1H5"/><path d="M13 5V1H9"/><path d="M1 9V13H5"/><path d="M13 9V13H9"/>', exit: '<path d="M1 1L5 5"/><path d="M1 5H5V1"/><path d="M13 1L9 5"/><path d="M13 5H9V1"/><path d="M1 13L5 9"/><path d="M1 9H5V13"/><path d="M13 13L9 9"/><path d="M13 9H9V13"/>' };
function enterWatchTheater() {
  if (watchTheaterOn) return;
  watchTheaterOn = true;
  document.getElementById('view-watch').classList.add('theater');
  // Body-level class since the app's global header sits outside #view-watch -- on mobile
  // (see CSS) this hides it too, so the player reads as truly full-screen instead of boxed
  // in below the nav bar.
  document.body.classList.add('watch-theater-active');
  updateWatchTheaterIcon();
  // Push a history entry so the phone's back button (which browsers/PWAs treat as
  // history.back()) closes this full-screen view instead of leaving the app entirely.
  history.pushState({ watchTheater: true }, '');
}
function exitWatchTheater() {
  if (!watchTheaterOn) return;
  watchTheaterOn = false;
  document.getElementById('view-watch').classList.remove('theater');
  document.body.classList.remove('watch-theater-active');
  updateWatchTheaterIcon();
  // Consume the history entry pushed on enter (unless we're already here BECAUSE the back
  // button just popped it -- the popstate handler below checks watchTheaterOn before calling
  // this, so by the time we get here in that path, history has already moved past it).
  if (history.state && history.state.watchTheater) history.back();
}
function toggleWatchTheater() { watchTheaterOn ? exitWatchTheater() : enterWatchTheater(); }
window.addEventListener('popstate', () => { if (watchTheaterOn) exitWatchTheater(); });
function updateWatchTheaterIcon() {
  const btn = document.getElementById('watch-theater-btn');
  document.getElementById('watch-theater-icon').innerHTML = watchTheaterOn ? WATCH_THEATER_ICON.exit : WATCH_THEATER_ICON.enter;
  btn.title = watchTheaterOn ? t('exitTheater') : t('enterTheater');
}
function updateWatchLiveWord() {
  const idx = findActiveTimedIndex(watchTimedWords, watchVideoEl.currentTime);
  if (idx === liveWatchWordIdx) return;
  if (liveWatchWordIdx >= 0) {
    watchWordEls[liveWatchWordIdx]?.classList.remove('live');
    overlayWordEls[liveWatchWordIdx]?.classList.remove('live');
  }
  liveWatchWordIdx = idx;
  if (idx >= 0) {
    watchWordEls[idx].classList.add('live');
    overlayWordEls[idx]?.classList.add('live');
  }
}
function updateWatchActiveCue() {
  const time = watchVideoEl.currentTime;
  let idx = -1;
  for (let i = 0; i < WATCH_CAPTIONS.length; i++) {
    if (WATCH_CAPTIONS[i].start <= time) idx = i; else break;
  }
  if (idx === activeWatchCueIdx) return;
  if (activeWatchCueIdx >= 0) {
    watchArCueEls[activeWatchCueIdx]?.classList.remove('active');
    watchTrCueEls[activeWatchCueIdx]?.classList.remove('active');
  }
  activeWatchCueIdx = idx;
  renderMobileCueOverlay(idx);
  if (idx >= 0) {
    watchArCueEls[idx].classList.add('active');
    watchTrCueEls[idx].classList.add('active');
    watchArCueEls[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
    watchTrCueEls[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
// Left/right arrow seeking on the Home tab, same 5s step as the skip buttons -- skipped
// while typing in a field (e.g. Vocab search) so arrow keys there behave normally.
document.addEventListener('keydown', (e) => {
  if (activeTabName !== 'watch') return;
  if (e.target.closest('input, textarea, [contenteditable]')) return;
  if (e.key === 'ArrowLeft') { skipWatch(-5); e.preventDefault(); }
  else if (e.key === 'ArrowRight') { skipWatch(5); e.preventDefault(); }
});
// Left/right arrow paging for Flashcards/Fill-in-the-Blank/Word-Scramble. The app is RTL-mirrored
// throughout (see the Overall design note at the top of style.css), so Prev always renders on the
// physical RIGHT and Next on the physical LEFT regardless of appLang -- mapping ArrowRight->Prev
// and ArrowLeft->Next points each key toward the button actually sitting on that side of the screen.
const CARD_TAB_NAV = { flashcards: goToFlashcard, fillblank: goToFillBlank, scramble: goToScramble };
document.addEventListener('keydown', (e) => {
  const goTo = CARD_TAB_NAV[activeTabName];
  if (!goTo) return;
  if (e.target.closest('input, textarea, [contenteditable]')) return;
  if (e.key === 'ArrowLeft') { goTo(1); e.preventDefault(); }
  else if (e.key === 'ArrowRight') { goTo(-1); e.preventDefault(); }
});

/* ─────────────── PROVERBS TAB (browsable list, standalone units) ───────────────
   Each proverb is its own self-contained card -- unlike the Reader's one continuous chunked
   text, proverbs are unrelated sayings, so there's no shared "essay" to flow through. Tapping a
   card expands the shared "explain it" block (literal meaning / idiomatic meaning / usage
   scenario) -- the same renderer is reused verbatim by the Flashcards tab's back face.

   The list is grouped under theme headers (each proverb tagged "theme" in data.json) rather than
   left as one long undifferentiated scroll of 46 cards -- order within a theme still follows the
   source collection's own sequence. PROVERB_THEME_ORDER is the display order of the groups; a
   proverb whose theme key isn't in this list (or has none) falls into a trailing "Other" group
   instead of silently disappearing. */
const PROVERB_THEME_ORDER = [
  { key: 'self',      en: 'Self-Reliance & Practical Wisdom', he: 'עצמאות וחוכמת חיים' },
  { key: 'company',   en: 'Company & Generosity',             he: 'חברה ונדיבות' },
  { key: 'seeing',     en: 'Reading Between the Lines',        he: 'לקרוא בין השורות' },
  { key: 'fortune',    en: 'Fortune’s Wheel',                  he: 'גלגל המזל' },
  { key: 'timing',     en: 'Patience & Timing',                he: 'סבלנות ותזמון' },
  { key: 'risk',       en: 'Risk & Consequence',               he: 'סיכון ותוצאה' },
];
let expandedProverbIds = new Set();
function toggleProverbExpand(id) {
  if (expandedProverbIds.has(id)) expandedProverbIds.delete(id); else expandedProverbIds.add(id);
  renderProverbsView();
}
// data-gi is LOCAL to this proverb (0..N-1), not a lesson-global index like the Reader's --
// matches the per-proverb audio/wordTimes model (see PROVERB AUDIO above).
// forceArabic bypasses the global scriptMode toggle and always renders raw Arabic -- used by
// Flashcards, whose front face is deliberately always the Arabic-script recall challenge
// regardless of the site's current learning-alphabet setting. clickableWords wires each word up
// to handleFlashcardWordTap (also Flashcards-only -- the Proverbs list's own card-tap-to-expand
// would otherwise conflict with a per-word click).
function proverbWordsHtml(p, forceArabic, clickableWords) {
  let gi = 0;
  return p.arWords.map((tok) => {
    if (tok.sep !== undefined) return '<span class="proverb-sep">' + tok.sep + '</span>';
    const idx = gi++;
    const text = forceArabic ? tok.w : arText(tok.w);
    const cls = 'proverb-word' + (clickableWords ? ' proverb-word-clickable' : '') + (clickableWords && flashcardWordTrayGi === idx ? ' tapped' : '');
    const onclick = clickableWords ? ' onclick="handleFlashcardWordTap(event, ' + idx + ')"' : '';
    const html = '<span class="' + cls + '" data-gi="' + idx + '"' + onclick + '>' + text + '</span>' + (tok.punct || '');
    return html;
  }).join(' ');
}
function proverbExplainHtml(p) {
  const en = appLang === 'en';
  const literal = en ? p.literalEn : p.literalHe;
  const meaning = en ? p.enGloss : p.heGloss;
  const usage = en ? p.usageEn : p.usageHe;
  const labels = en
    ? { literal: 'Literally', meaning: 'Meaning', usage: 'When to use it' }
    : { literal: 'פירוש מילולי', meaning: 'משמעות', usage: 'מתי אומרים את זה' };
  const row = (label, text) => text
    ? '<div class="proverb-explain-row"><span class="proverb-explain-label">' + label + '</span><span class="proverb-explain-text" dir="' + (en ? 'ltr' : 'rtl') + '">' + text + '</span></div>'
    : '';
  return '<div class="proverb-explain">' +
    row(labels.literal, literal) +
    row(labels.meaning, meaning) +
    row(labels.usage, usage) +
    '</div>';
}
function proverbCardHtml(p) {
    const expanded = expandedProverbIds.has(p.id);
    const hasAudio = !!(p.audio && p.audio.src);
    return '<div class="proverb-card' + (expanded ? ' expanded' : '') + '">' +
      '<div class="proverb-card-head" onclick="toggleProverbExpand(\'' + p.id + '\')">' +
        (hasAudio
          ? '<button class="proverb-pronounce" onclick="event.stopPropagation(); playProverbAudio(\'' + p.id + '\', document.getElementById(\'proverb-words-' + p.id + '\'), this)" aria-label="' + (appLang === 'en' ? 'Listen' : 'השמע') + '">' + PRONOUNCE_ICON_SVG + '</button>'
          : '') +
        '<div class="proverb-words" id="proverb-words-' + p.id + '" dir="' + scriptDir() + '">' + proverbWordsHtml(p) + '</div>' +
        '<span class="proverb-chev">›</span>' +
      '</div>' +
      (expanded ? proverbExplainHtml(p) : '') +
    '</div>';
}
function renderProverbsView() {
  const list = document.getElementById('proverbs-list');
  if (!list) return;
  const en = appLang === 'en';
  const groups = PROVERB_THEME_ORDER.map(t => ({ theme: t, proverbs: [] }));
  const groupByKey = new Map(groups.map(g => [g.theme.key, g]));
  const other = { theme: { key: 'other', en: 'Other', he: 'שונות' }, proverbs: [] };
  PROVERBS.forEach(p => {
    const g = groupByKey.get(p.theme);
    (g || other).proverbs.push(p);
  });
  if (other.proverbs.length) groups.push(other);

  list.innerHTML = groups.filter(g => g.proverbs.length).map(g => {
    const heading = '<div class="proverb-theme-head">' +
      '<span class="proverb-theme-name" dir="' + (en ? 'ltr' : 'rtl') + '">' + (en ? g.theme.en : g.theme.he) + '</span>' +
      '<span class="proverb-theme-count">' + g.proverbs.length + '</span>' +
    '</div>';
    return heading + g.proverbs.map(proverbCardHtml).join('');
  }).join('');
}

/* ─────────────── FLASHCARDS / FILL-IN-THE-BLANK / WORD-SCRAMBLE ───────────────
   Stub views -- built out in later phases once the Proverbs tab pattern above is confirmed.
   Kept as real (if minimal) functions rather than leaving switchTab() calling something
   undefined, so the tab-gating mechanism is fully wired end-to-end today. */
function stubViewHtml() {
  return '<div class="stub-view">' + (appLang === 'en' ? 'Coming soon.' : 'בקרוב.') + '</div>';
}

/* ─────────────── FLASHCARDS TAB ───────────────
   One card per proverb, sequential deck. Arabic (with tashkeel) is always shown, large, with the
   learner's preferred transliteration automatically right underneath -- no toggle needed. Below
   that, three small icon buttons (listen / literal meaning / explanation) sit close together
   rather than full-width text pills, keeping the default (nothing revealed) view compact instead
   of padded out with dead space.

   Reveal panels and the word-gloss tray are ALWAYS present in the DOM (built once per card by
   renderFlashcardsView) and animate open/closed via a CSS max-height transition -- same pattern
   as the Vocab tab's .vocab-expand/.open. Toggling them only flips a class on the existing
   element (toggleFlashcardReveal / handleFlashcardWordTap), it does NOT re-render the card --
   that's what made the earlier version feel like it was jumping: a full innerHTML rebuild on
   every click has no starting height to transition from, so the layout just snaps. */
// Shared by Flashcards and Fill-in-the-Blank -- both browse PROVERBS through a shuffled index
// order rather than the source docx order, and reshuffle fresh every time the tab is (re)entered
// (see switchTab()), not on every render or every Prev/Next step.
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
let flashcardOrder = [];
let flashcardIdx = 0;
let flashcardShowLiteral = false;
let flashcardShowMeaning = false;
let flashcardWordTrayGi = null;
function shuffleFlashcardDeck() {
  flashcardOrder = shuffleArray(PROVERBS.map((_, i) => i));
  flashcardIdx = 0;
  flashcardShowLiteral = false;
  flashcardShowMeaning = false;
  flashcardWordTrayGi = null;
}
function goToFlashcard(delta) {
  const next = flashcardIdx + delta;
  if (next < 0 || next >= flashcardOrder.length) return;
  flashcardIdx = next;
  flashcardShowLiteral = false;
  flashcardShowMeaning = false;
  flashcardWordTrayGi = null;
  stopPronunciation();
  renderFlashcardsView();
}
function toggleFlashcardReveal(which) {
  const show = which === 'literal' ? (flashcardShowLiteral = !flashcardShowLiteral) : (flashcardShowMeaning = !flashcardShowMeaning);
  document.getElementById('flashcard-reveal-' + which).classList.toggle('open', show);
  document.querySelector('.flashcard-icon-btn[data-fc-btn="' + which + '"]').classList.toggle('active', show);
}
function handleFlashcardWordTap(e, gi) {
  e.stopPropagation();
  const p = PROVERBS[flashcardOrder[flashcardIdx]];
  const trayEl = document.getElementById('flashcard-word-tray');
  document.querySelectorAll('#flashcard-words .proverb-word-clickable.tapped').forEach(w => w.classList.remove('tapped'));
  if (flashcardWordTrayGi === gi) { flashcardWordTrayGi = null; trayEl.classList.remove('open'); return; }
  flashcardWordTrayGi = gi;
  const wordEl = document.querySelector('#flashcard-words [data-gi="' + gi + '"]');
  if (wordEl) wordEl.classList.add('tapped');
  const en = appLang === 'en';
  const gloss = p.wordGlosses && p.wordGlosses[gi];
  trayEl.textContent = gloss ? (en ? gloss.en : gloss.he) : (en ? 'Not glossed yet' : 'טרם תורגם');
  trayEl.dir = en ? 'ltr' : 'rtl';
  trayEl.classList.add('open');
}
// Always the Hebrew transliteration unless the site's learning-alphabet toggle is specifically
// set to English transliteration -- Hebrew is the default "preferred" hint per this app's
// Hebrew-primary principle, matching every other trilingual surface in the app.
function preferredTranslit(text) {
  return scriptMode === 'translit-en' ? transliterateArabicEnglish(text) : transliterateArabicHebrew(text);
}
const FC_BOOK_ICON_SVG = '<svg width="17" height="15" viewBox="0 0 20 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3.2C8 1.6 5 1.1 1.5 1.5V13.3c3.5-.4 6.5.1 8.5 1.7"/><path d="M10 3.2c2-1.6 5-2.1 8.5-1.7V13.3c-3.5-.4-6.5.1-8.5 1.7"/><path d="M10 3.2v11.8"/></svg>';
const FC_BULB_ICON_SVG = '<svg width="14" height="17" viewBox="0 0 16 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 1a5 5 0 00-3 9c.7.6 1 1.3 1 2.2v.6h4v-.6c0-.9.3-1.6 1-2.2A5 5 0 008 1z"/><path d="M6 15.5h4M6.5 17.5h3"/></svg>';
function renderFlashcardsView() {
  const el = document.getElementById('flashcards-inner');
  if (!el) return;
  if (!PROVERBS.length) { el.innerHTML = stubViewHtml(); return; }
  if (!flashcardOrder.length) shuffleFlashcardDeck();
  if (flashcardIdx >= flashcardOrder.length) flashcardIdx = 0;
  const p = PROVERBS[flashcardOrder[flashcardIdx]];
  const en = appLang === 'en';
  const hasAudio = !!(p.audio && p.audio.src);
  const plainText = p.arWords.map(t => t.w).join(' ');
  const translitDir = scriptMode === 'translit-en' ? 'ltr' : 'rtl';
  const proseDir = en ? 'ltr' : 'rtl';

  const literalText = en ? p.literalEn : (p.literalHe || p.literalEn);
  const meaningText = en ? p.enGloss : p.heGloss;
  const reveal = (which, open, label, text) =>
    '<div class="flashcard-reveal' + (open ? ' open' : '') + '" id="flashcard-reveal-' + which + '">' +
      '<div class="flashcard-reveal-inner"><div class="flashcard-reveal-label">' + label + '</div><div class="flashcard-reveal-text" dir="' + proseDir + '">' + (text || '') + '</div></div>' +
    '</div>';

  el.innerHTML =
    '<div class="flashcard-progress">' + (flashcardIdx + 1) + ' / ' + PROVERBS.length + '</div>' +
    '<div class="flashcard">' +
      '<div class="flashcard-text-group">' +
        '<div class="proverb-words flashcard-words" id="flashcard-words" dir="rtl">' + proverbWordsHtml(p, true, true) + '</div>' +
        '<div class="flashcard-translit-line" dir="' + translitDir + '">' + preferredTranslit(plainText) + '</div>' +
      '</div>' +
      '<div class="flashcard-word-tray" id="flashcard-word-tray"></div>' +
      '<div class="flashcard-icon-row">' +
        (hasAudio
          ? '<button class="flashcard-icon-btn" onclick="playProverbAudio(\'' + p.id + '\', document.getElementById(\'flashcard-words\'), this)" aria-label="' + (en ? 'Listen' : 'השמע') + '" title="' + (en ? 'Listen' : 'השמע') + '">' + PRONOUNCE_ICON_SVG + '</button>'
          : '') +
        '<button class="flashcard-icon-btn' + (flashcardShowLiteral ? ' active' : '') + '" data-fc-btn="literal" onclick="toggleFlashcardReveal(\'literal\')" aria-label="' + (en ? 'Literal meaning' : 'פירוש מילולי') + '" title="' + (en ? 'Literal meaning' : 'פירוש מילולי') + '">' + FC_BOOK_ICON_SVG + '</button>' +
        '<button class="flashcard-icon-btn' + (flashcardShowMeaning ? ' active' : '') + '" data-fc-btn="meaning" onclick="toggleFlashcardReveal(\'meaning\')" aria-label="' + (en ? 'Explanation' : 'הסבר') + '" title="' + (en ? 'Explanation' : 'הסבר') + '">' + FC_BULB_ICON_SVG + '</button>' +
      '</div>' +
      reveal('literal', flashcardShowLiteral, en ? 'Literally' : 'פירוש מילולי', literalText) +
      reveal('meaning', flashcardShowMeaning, en ? 'Meaning' : 'משמעות', meaningText) +
    '</div>' +
    '<div class="flashcard-nav">' +
      '<button class="flashcard-nav-btn"' + (flashcardIdx === 0 ? ' disabled' : '') + ' onclick="goToFlashcard(-1)">' + (en ? '‹ Prev' : '‹ הקודם') + '</button>' +
      '<button class="flashcard-nav-btn"' + (flashcardIdx === flashcardOrder.length - 1 ? ' disabled' : '') + ' onclick="goToFlashcard(1)">' + (en ? 'Next ›' : 'הבא ›') + '</button>' +
    '</div>';
}
/* ─────────────── FILL-IN-THE-BLANK TAB ───────────────
   One masked word per proverb, multiple choice from blankChoices (hand-authored per proverb --
   see word_glosses-style caveat: AI-drafted, not yet reviewed by a native speaker). Choice order
   is shuffled once per card (not on every render) so re-renders from a language/script switch
   mid-attempt don't reshuffle the buttons out from under the learner. Follows the global
   scriptMode toggle like the Proverbs list (unlike Flashcards' front, which deliberately doesn't)
   -- this is a reading/recall exercise, not specifically an Arabic-script drill. */
let fillblankOrder = [];
let fillblankIdx = 0;
let fillblankChoiceOrder = [];
let fillblankSelectedIdx = null;
let fillblankShowLiteral = false;
let fillblankShowMeaning = false;
// Reshuffles the whole deck order and jumps back to its first card -- see shuffleFlashcardDeck's
// sibling comment above; called from switchTab() on every fresh entry into this tab, not on
// every render or Prev/Next step.
function shuffleFillBlankDeck() {
  fillblankOrder = shuffleArray(PROVERBS.map((_, i) => i));
  fillblankIdx = 0;
  setupFillBlankCard();
}
function setupFillBlankCard() {
  const p = PROVERBS[fillblankOrder[fillblankIdx]];
  fillblankChoiceOrder = shuffleArray(p.blankChoices);
  fillblankSelectedIdx = null;
  fillblankShowLiteral = false;
  fillblankShowMeaning = false;
}
function goToFillBlank(delta) {
  const next = fillblankIdx + delta;
  if (next < 0 || next >= fillblankOrder.length) return;
  fillblankIdx = next;
  stopPronunciation();
  setupFillBlankCard();
  renderFillBlankView();
}
function selectFillBlankChoice(orderIdx) {
  if (fillblankSelectedIdx != null) return; // already answered -- ignore further picks
  fillblankSelectedIdx = orderIdx;
  renderFillBlankView();
}
// Same non-destructive class-toggle approach as toggleFlashcardReveal -- these fire AFTER the
// answer-lock render already happened, so the icon row/reveal panels are already in the DOM;
// toggling them must not re-render the whole card or the reveal loses its animation again.
function toggleFillBlankReveal(which) {
  const show = which === 'literal' ? (fillblankShowLiteral = !fillblankShowLiteral) : (fillblankShowMeaning = !fillblankShowMeaning);
  document.getElementById('fillblank-reveal-' + which).classList.toggle('open', show);
  document.querySelector('.fillblank-icon-row [data-fb-btn="' + which + '"]').classList.toggle('active', show);
}
function renderFillBlankView() {
  const el = document.getElementById('fillblank-inner');
  if (!el) return;
  if (!PROVERBS.length) { el.innerHTML = stubViewHtml(); return; }
  if (!fillblankOrder.length) shuffleFillBlankDeck();
  if (fillblankIdx >= fillblankOrder.length) fillblankIdx = 0;
  if (!fillblankChoiceOrder.length) setupFillBlankCard();
  const p = PROVERBS[fillblankOrder[fillblankIdx]];
  const en = appLang === 'en';
  const hasAudio = !!(p.audio && p.audio.src);
  const answered = fillblankSelectedIdx != null;
  const correctWord = p.blankChoices[0];
  const dir = scriptDir();
  const translitDir = scriptMode === 'translit-en' ? 'ltr' : 'rtl';
  const proseDir = en ? 'ltr' : 'rtl';

  const sentenceHtml = p.arWords.map((tok, i) => {
    if (tok.sep !== undefined) return '<span class="proverb-sep">' + tok.sep + '</span>';
    if (i === p.blankIdx) {
      const shown = answered ? arText(correctWord) : '____';
      return '<span class="fillblank-blank' + (answered ? ' filled' : '') + '">' + shown + '</span>' + (tok.punct || '');
    }
    return '<span class="proverb-word">' + arText(tok.w) + '</span>' + (tok.punct || '');
  }).join(' ');
  // Mirrors the sentence's own blanking -- the transliteration must not give away the answer
  // before it's picked, so it masks the same word rather than transliterating the full phrase.
  const translitLine = p.arWords.map((tok, i) => {
    if (tok.sep !== undefined) return tok.sep;
    if (i === p.blankIdx) return (answered ? preferredTranslit(correctWord) : '____') + (tok.punct || '');
    return preferredTranslit(tok.w) + (tok.punct || '');
  }).join(' ');

  const choicesHtml = fillblankChoiceOrder.map((choice, i) => {
    let cls = 'fillblank-choice-btn';
    if (answered) {
      if (choice === correctWord) cls += ' correct';
      else if (i === fillblankSelectedIdx) cls += ' incorrect';
    }
    return '<button class="' + cls + '"' + (answered ? ' disabled' : '') + ' onclick="selectFillBlankChoice(' + i + ')">' + arText(choice) + '</button>';
  }).join('');

  const feedback = answered
    ? '<div class="fillblank-feedback">' + (fillblankChoiceOrder[fillblankSelectedIdx] === correctWord ? (en ? 'Correct!' : 'נכון!') : (en ? 'Not quite.' : 'לא בדיוק.')) + '</div>'
    : '';

  // Payoff after answering: icon buttons (same book/lightbulb pattern as Flashcards) rather than
  // dumping both the literal breakdown and the full explanation at once -- a learner who just
  // wants to confirm they got it right isn't forced past a wall of text to reach Next.
  let payoffHtml = '';
  if (answered) {
    const literalText = en ? p.literalEn : (p.literalHe || p.literalEn);
    const meaningText = en ? p.enGloss : p.heGloss;
    const revealPanel = (which, show, label, text) =>
      '<div class="flashcard-reveal' + (show ? ' open' : '') + '" id="fillblank-reveal-' + which + '">' +
        '<div class="flashcard-reveal-inner"><div class="flashcard-reveal-label">' + label + '</div><div class="flashcard-reveal-text" dir="' + proseDir + '">' + (text || '') + '</div></div>' +
      '</div>';
    payoffHtml =
      '<div class="flashcard-icon-row fillblank-icon-row">' +
        '<button class="flashcard-icon-btn' + (fillblankShowLiteral ? ' active' : '') + '" data-fb-btn="literal" onclick="toggleFillBlankReveal(\'literal\')" aria-label="' + (en ? 'Literal meaning' : 'פירוש מילולי') + '" title="' + (en ? 'Literal meaning' : 'פירוש מילולי') + '">' + FC_BOOK_ICON_SVG + '</button>' +
        '<button class="flashcard-icon-btn' + (fillblankShowMeaning ? ' active' : '') + '" data-fb-btn="meaning" onclick="toggleFillBlankReveal(\'meaning\')" aria-label="' + (en ? 'Explanation' : 'הסבר') + '" title="' + (en ? 'Explanation' : 'הסבר') + '">' + FC_BULB_ICON_SVG + '</button>' +
      '</div>' +
      revealPanel('literal', fillblankShowLiteral, en ? 'Literally' : 'פירוש מילולי', literalText) +
      revealPanel('meaning', fillblankShowMeaning, en ? 'Meaning' : 'משמעות', meaningText);
  }

  el.innerHTML =
    '<div class="flashcard-progress">' + (fillblankIdx + 1) + ' / ' + PROVERBS.length + '</div>' +
    '<div class="flashcard">' +
      (hasAudio
        ? '<div class="flashcard-icon-row"><button class="flashcard-icon-btn" onclick="playProverbAudio(\'' + p.id + '\', document.getElementById(\'fillblank-sentence\'), this)" aria-label="' + (en ? 'Listen' : 'השמע') + '">' + PRONOUNCE_ICON_SVG + '</button></div>'
        : '') +
      '<div class="flashcard-text-group">' +
        '<div class="proverb-words fillblank-sentence" id="fillblank-sentence" dir="' + dir + '">' + sentenceHtml + '</div>' +
        '<div class="flashcard-translit-line" dir="' + translitDir + '">' + translitLine + '</div>' +
      '</div>' +
      '<div class="fillblank-choices">' + choicesHtml + '</div>' +
      feedback +
      payoffHtml +
    '</div>' +
    '<div class="flashcard-nav">' +
      '<button class="flashcard-nav-btn"' + (fillblankIdx === 0 ? ' disabled' : '') + ' onclick="goToFillBlank(-1)">' + (en ? '‹ Prev' : '‹ הקודם') + '</button>' +
      '<button class="flashcard-nav-btn"' + (fillblankIdx === fillblankOrder.length - 1 ? ' disabled' : '') + ' onclick="goToFillBlank(1)">' + (en ? 'Next ›' : 'הבא ›') + '</button>' +
    '</div>';
}
/* ─────────────── WORD-SCRAMBLE TAB ───────────────
   The proverb is grouped into a few multi-word CHUNKS (scrambleChunks: an array of chunk sizes
   authored per proverb, e.g. [2,3,2] -- natural phrase/clause groupings, not one tile per word;
   reconstructing word-by-word turned out to be a much harder puzzle than intended). Chunks
   shuffle into a tile pool; tap them in the correct order to rebuild the sentence. Checked
   per-tap, not per-attempt: the correct next chunk locks into the "built so far" area (a real
   state change, worth a full re-render); a wrong tap just flashes that tile red and stays in the
   pool -- no re-render, no lockout, so a wrong guess never costs progress or forces a restart.
   Chunks are tracked by their 0-based position (0..chunkCount-1), which is already their correct
   order by construction, so "the next expected chunk" is simply scramblePlaced.length -- no
   separate lookup array needed the way word-level indices required.
   Same shuffled-deck-per-entry + arrow-key paging as Flashcards/Fill-in-the-Blank, and the same
   book/lightbulb icon reveal for the payoff once solved. */
let scrambleOrder = [];
let scrambleIdx = 0;
let scrambleTileOrder = [];
let scramblePlaced = [];
let scrambleShowLiteral = false;
let scrambleShowMeaning = false;
// [startIdx, endIdx] (inclusive) into arWords for each chunk -- falls back to one word per chunk
// if a proverb somehow lacks scrambleChunks, rather than crashing.
function scrambleChunkRanges(p) {
  const sizes = p.scrambleChunks || p.arWords.map(() => 1);
  const ranges = [];
  let start = 0;
  sizes.forEach((size) => { ranges.push([start, start + size - 1]); start += size; });
  return ranges;
}
function scrambleChunkText(p, ci, useTranslit) {
  const [s, e] = scrambleChunkRanges(p)[ci];
  const parts = [];
  for (let i = s; i <= e; i++) {
    const tok = p.arWords[i];
    parts.push((useTranslit ? preferredTranslit(tok.w) : arText(tok.w)) + (tok.punct || ''));
  }
  return parts.join(' ');
}
function setupScrambleCard() {
  const p = PROVERBS[scrambleOrder[scrambleIdx]];
  const chunkIndices = scrambleChunkRanges(p).map((_, i) => i);
  scrambleTileOrder = shuffleArray(chunkIndices);
  // For proverbs with only 2-3 chunks, a random shuffle has a real chance of landing back on the
  // original order, which reads as "not scrambled at all" -- reshuffle once more if so.
  if (scrambleTileOrder.length > 1 && scrambleTileOrder.every((v, i) => v === chunkIndices[i])) {
    scrambleTileOrder = shuffleArray(chunkIndices);
  }
  scramblePlaced = [];
  scrambleShowLiteral = false;
  scrambleShowMeaning = false;
}
function shuffleScrambleDeck() {
  scrambleOrder = shuffleArray(PROVERBS.map((_, i) => i));
  scrambleIdx = 0;
  setupScrambleCard();
}
function goToScramble(delta) {
  const next = scrambleIdx + delta;
  if (next < 0 || next >= scrambleOrder.length) return;
  scrambleIdx = next;
  stopPronunciation();
  setupScrambleCard();
  renderScrambleView();
}
function resetScrambleCard() {
  setupScrambleCard();
  renderScrambleView();
}
function toggleScrambleReveal(which) {
  const show = which === 'literal' ? (scrambleShowLiteral = !scrambleShowLiteral) : (scrambleShowMeaning = !scrambleShowMeaning);
  document.getElementById('scramble-reveal-' + which).classList.toggle('open', show);
  document.querySelector('.scramble-icon-row [data-sc-btn="' + which + '"]').classList.toggle('active', show);
}
function handleScrambleTap(ci, btnEl) {
  if (ci === scramblePlaced.length) {
    scramblePlaced.push(ci);
    renderScrambleView();
  } else {
    btnEl.classList.add('wrong');
    setTimeout(() => btnEl.classList.remove('wrong'), 400);
  }
}
function renderScrambleView() {
  const el = document.getElementById('scramble-inner');
  if (!el) return;
  if (!PROVERBS.length) { el.innerHTML = stubViewHtml(); return; }
  if (!scrambleOrder.length) shuffleScrambleDeck();
  if (scrambleIdx >= scrambleOrder.length) scrambleIdx = 0;
  const p = PROVERBS[scrambleOrder[scrambleIdx]];
  const en = appLang === 'en';
  const hasAudio = !!(p.audio && p.audio.src);
  const proseDir = en ? 'ltr' : 'rtl';
  const dir = scriptDir();
  const translitDir = scriptMode === 'translit-en' ? 'ltr' : 'rtl';

  const chunkCount = scrambleChunkRanges(p).length;
  const solved = scramblePlaced.length === chunkCount;

  const builtHtml = scramblePlaced.length
    ? scramblePlaced.map((ci) => '<span class="proverb-word">' + scrambleChunkText(p, ci, false) + '</span>').join(' ')
    : '<span class="scramble-built-empty">' + (en ? 'Tap the pieces in order' : 'הקישו על החלקים לפי הסדר') + '</span>';
  const builtTranslit = scramblePlaced.length
    ? scramblePlaced.map((ci) => scrambleChunkText(p, ci, true)).join(' ')
    : '';

  const poolHtml = scrambleTileOrder
    .filter((ci) => !scramblePlaced.includes(ci))
    .map((ci) => '<button class="scramble-tile" onclick="handleScrambleTap(' + ci + ', this)">' + scrambleChunkText(p, ci, false) + '</button>')
    .join('');

  let payoffHtml = '';
  if (solved) {
    const literalText = en ? p.literalEn : (p.literalHe || p.literalEn);
    const meaningText = en ? p.enGloss : p.heGloss;
    const revealPanel = (which, show, label, text) =>
      '<div class="flashcard-reveal' + (show ? ' open' : '') + '" id="scramble-reveal-' + which + '">' +
        '<div class="flashcard-reveal-inner"><div class="flashcard-reveal-label">' + label + '</div><div class="flashcard-reveal-text" dir="' + proseDir + '">' + (text || '') + '</div></div>' +
      '</div>';
    payoffHtml =
      '<div class="fillblank-feedback">' + (en ? 'Solved!' : 'פתרת!') + '</div>' +
      '<div class="flashcard-icon-row scramble-icon-row">' +
        '<button class="flashcard-icon-btn' + (scrambleShowLiteral ? ' active' : '') + '" data-sc-btn="literal" onclick="toggleScrambleReveal(\'literal\')" aria-label="' + (en ? 'Literal meaning' : 'פירוש מילולי') + '" title="' + (en ? 'Literal meaning' : 'פירוש מילולי') + '">' + FC_BOOK_ICON_SVG + '</button>' +
        '<button class="flashcard-icon-btn' + (scrambleShowMeaning ? ' active' : '') + '" data-sc-btn="meaning" onclick="toggleScrambleReveal(\'meaning\')" aria-label="' + (en ? 'Explanation' : 'הסבר') + '" title="' + (en ? 'Explanation' : 'הסבר') + '">' + FC_BULB_ICON_SVG + '</button>' +
      '</div>' +
      revealPanel('literal', scrambleShowLiteral, en ? 'Literally' : 'פירוש מילולי', literalText) +
      revealPanel('meaning', scrambleShowMeaning, en ? 'Meaning' : 'משמעות', meaningText);
  }

  el.innerHTML =
    '<div class="flashcard-progress">' + (scrambleIdx + 1) + ' / ' + PROVERBS.length + '</div>' +
    '<div class="flashcard">' +
      (hasAudio
        ? '<div class="flashcard-icon-row"><button class="flashcard-icon-btn" onclick="playProverbAudio(\'' + p.id + '\', document.getElementById(\'scramble-built\'), this)" aria-label="' + (en ? 'Listen' : 'השמע') + '">' + PRONOUNCE_ICON_SVG + '</button></div>'
        : '') +
      '<div class="scramble-built proverb-words" id="scramble-built" dir="' + dir + '">' + builtHtml + '</div>' +
      (builtTranslit ? '<div class="flashcard-translit-line" dir="' + translitDir + '">' + builtTranslit + '</div>' : '') +
      (!solved
        ? '<div class="scramble-tiles">' + poolHtml + '</div>' +
          '<button class="scramble-reset-btn" onclick="resetScrambleCard()">' + (en ? 'Reset' : 'איפוס') + '</button>'
        : '') +
      payoffHtml +
    '</div>' +
    '<div class="flashcard-nav">' +
      '<button class="flashcard-nav-btn"' + (scrambleIdx === 0 ? ' disabled' : '') + ' onclick="goToScramble(-1)">' + (en ? '‹ Prev' : '‹ הקודם') + '</button>' +
      '<button class="flashcard-nav-btn"' + (scrambleIdx === scrambleOrder.length - 1 ? ' disabled' : '') + ' onclick="goToScramble(1)">' + (en ? 'Next ›' : 'הבא ›') + '</button>' +
    '</div>';
}

/* ─────────────── LESSON BOOTSTRAP ───────────────
   Multi-lesson site: lesson.html?slug=<slug> fetches that lesson's data.json bundle (produced
   by the CMS's Publish step, or by scripts/migrate-lesson-to-json.js for the original Abed
   lesson) and initializes everything that used to run unconditionally at script-parse time
   against hardcoded lesson-data.js/vocab-data.js/verbs-data.js/watch-captions-data.js/
   voiceover-data.js. Each lesson view is a fresh page load, so this only ever runs once. */
function initLesson(bundle) {
  CHUNKS = bundle.chunks || [];
  PHRASE_GLOSSES = bundle.phraseGlosses || [];
  SEED_VOCAB = bundle.vocabSeed || [];
  SAVED_VOCAB = SEED_VOCAB.slice();
  SAVED_VERBS = bundle.verbs || [];
  verbIdCounter = SAVED_VERBS.length;
  activeVerbId = SAVED_VERBS[0] ? SAVED_VERBS[0].id : null;
  WATCH_CAPTIONS = bundle.watchCaptions || [];
  VOICEOVER_SRC = (bundle.voiceover && bundle.voiceover.src) || '';
  VOICEOVER_CHUNKS = (bundle.voiceover && bundle.voiceover.chunks) || [];
  VOICEOVER_WORD_TIMES = (bundle.voiceover && bundle.voiceover.wordTimes) || [];
  voiceoverTimedWords = VOICEOVER_WORD_TIMES.slice().sort((a, b) => a.t - b.t);
  // Fall back to the empty-shape defaults declared at the top of this file rather than requiring
  // every lesson to author narrative content for tabs it doesn't even show (e.g. a proverbs
  // lesson with no Watch/Reader tab has nothing to put in homeContent/introContent).
  HOME_CONTENT = bundle.homeContent || HOME_CONTENT;
  INTRO_CONTENT = bundle.introContent || INTRO_CONTENT;
  ABOUT_CONTENT = bundle.aboutContent || ABOUT_CONTENT;
  HEADER_GLOSS = bundle.headerGloss || HEADER_GLOSS;
  PROVERBS = bundle.proverbs || [];

  const base = 'lessons/' + bundle.meta.slug + '/';
  LESSON_BASE = base;
  if (VOICEOVER_SRC) audioEl.src = base + VOICEOVER_SRC; // only the Reader's shared-track model needs this set up front
  if (bundle.meta.videoPath) {
    document.getElementById('watch-video-source').src = base + bundle.meta.videoPath;
    document.getElementById('watch-captions').src = base + bundle.meta.captionsPath;
    watchVideoEl.load();
  }
  document.title = bundle.meta.title;

  buildReader();
  buildWatchTranscript();
  initWatchToolbar();
  initTrayGestures();
  applyReaderScale();
  applyWatchScale();
  initOutsideTapClose('verbs-scroll', (target) => !target.closest('.verb-pill') && !target.closest('.verb-card'), closeVerbDrawer);
  renderVerbsView();
  renderProverbsView();

  // Narrow the nav/side-menu to this lesson's declared tabs and open its first one -- falls back
  // to the classic 5-tab set if a bundle doesn't declare meta.tabs at all.
  ACTIVE_TABS = (bundle.meta.tabs && bundle.meta.tabs.length) ? bundle.meta.tabs : ACTIVE_TABS;
  applyActiveTabs();
  switchTab(ACTIVE_TABS[0]);

  applyAppLang();
  applyScriptMode();
}

const lessonSlug = new URLSearchParams(location.search).get('slug');
if (!lessonSlug) {
  location.href = 'index.html';
} else {
  fetch('lessons/' + lessonSlug + '/data.json')
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(initLesson)
    .catch(err => {
      console.error('Failed to load lesson "' + lessonSlug + '"', err);
      document.body.textContent = 'Could not load this lesson.';
    });
}
