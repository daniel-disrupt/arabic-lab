#!/usr/bin/env node
/* ─────────────── ONE-OFF MIGRATION: Abed lesson → app/lessons/<slug>/data.json ───────────────
   Converts the original single-lesson hardcoded data files (app/js/lesson-data.js,
   vocab-data.js, verbs-data.js, watch-captions-data.js, voiceover-data.js) plus the
   lesson-specific content objects that used to live inline in app.js (HOME_CONTENT,
   INTRO_CONTENT, ABOUT_CONTENT, HEADER_GLOSS) into the multi-lesson bundle shape that
   app.js now fetches at runtime (see initLesson() in app/js/app.js).

   Run once: `node scripts/migrate-lesson-to-json.js`. Kept around as a reference for the
   bundle shape / a template for hand-assembling a future lesson's data.json the same way.
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const JS_DIR = path.join(ROOT, 'app', 'js');
const SLUG = 'abed-jaffa-speech';
const OUT_DIR = path.join(ROOT, 'app', 'lessons', SLUG);

function loadConsts(file, names) {
  const src = fs.readFileSync(path.join(JS_DIR, file), 'utf8');
  const fn = new Function(src + '; return {' + names.join(',') + '};');
  return fn();
}

const { CHUNKS, PHRASE_GLOSSES } = loadConsts('lesson-data.js', ['CHUNKS', 'PHRASE_GLOSSES']);
const { SEED_VOCAB } = loadConsts('vocab-data.js', ['SEED_VOCAB']);
const { SAVED_VERBS } = loadConsts('verbs-data.js', ['SAVED_VERBS']);
const { WATCH_CAPTIONS } = loadConsts('watch-captions-data.js', ['WATCH_CAPTIONS']);
const { VOICEOVER_SRC, VOICEOVER_CHUNKS, VOICEOVER_WORD_TIMES } = loadConsts('voiceover-data.js', ['VOICEOVER_SRC', 'VOICEOVER_CHUNKS', 'VOICEOVER_WORD_TIMES']);

// Transcribed verbatim from the pre-refactor app/js/app.js (HOME_CONTENT, INTRO_CONTENT,
// ABOUT_CONTENT, HEADER_GLOSS consts) -- these were the Abed-lesson-specific narrative
// content mixed into otherwise-generic app chrome. Now lesson data.

const HOME_CONTENT = {
  en: {
    title: 'Abed Abu Shehadeh, in his own words',
    subtitle: 'Ghazaza Park, Jaffa &middot; June 28, 2026',
    intro: [
      "In June 2026, three young men were killed in Jaffa within the span of three days — the latest in a wave of organized-crime violence that a shaken, furious community felt the police had done nothing to stop. On the evening of June 28, hundreds gathered at Ghazaza Park to demand accountability. Abed Abu Shehadeh, chairman of Jaffa's Islamic Council, addressed the crowd.",
      "To understand what a community is going through — the grief, the exhaustion, the anger underneath it — it's important to listen closely to the words people reach for and the cry underneath the argument. Below is Abed in his own words. In addition to the speech with subtitles, in the <a href=\"#\" onclick=\"switchTab('reader'); return false;\">Reader</a> tab is a simplified, cleaned-up version of the text, fully translated, fully voweled with tashkeel, and read aloud by an AI voice, so Arabic learners can work through it slowly. From there, interactive <a href=\"#\" onclick=\"switchTab('vocab'); return false;\">Vocab</a> and <a href=\"#\" onclick=\"switchTab('verbs'); return false;\">Verbs</a> tabs enable further review and practice. The processing, transcription, and translation of the speech were all done with AI tools, so please forgive areas where it didn't get things exactly right. The full story behind the protest, the speaker, and this project is in <a href=\"#\" onclick=\"switchTab('about'); return false;\">About</a>.",
    ],
  },
  he: {
    title: 'עבד אבו שחאדה, במילים שלו',
    subtitle: 'גן אל-ע׳זאזווה, יפו &middot; 28 ביוני 2026',
    intro: [
      'ביוני 2026 נרצחו שלושה צעירים ביפו בתוך פרק זמן של שלושה ימים — האחרונה בשורת אלימות של פשיעה מאורגנת שקהילה מזועזעת וזועמת חשה שהמשטרה לא עשתה כלום כדי לעצור. בערב ה-28 ביוני התאספו מאות בגן אל-ע׳זאזווה כדי לדרוש אחריותיות. עבד אבו שחאדה, יו״ר המועצה האסלאמית ביפו, פנה לקהל.',
      'כדי להבין באמת מה עוברת קהילה — האבל, התשישות, הזעם שמתחתיו — חשוב להקשיב מקרוב למילים שאנשים בוחרים ולזעקה שמתחת לטיעון. למטה מופיע עבד במילים שלו. בנוסף לנאום עם כתוביות, הכנתי גם גרסה מפושטת ומסודרת של הטקסט, מתורגמת במלואה, מנוקדת במלואה בתשכיל, ומוקראת בקול בינה מלאכותית, כך שלומדי ערבית כמוני יוכלו לעבוד עליה לאט בלשונית <a href="#" onclick="switchTab(\'reader\'); return false;">הקורא</a>. משם, אני מרכז את לשוניות <a href="#" onclick="switchTab(\'vocab\'); return false;">אוצר המילים</a> ו<a href="#" onclick="switchTab(\'verbs\'); return false;">פעלים</a> המרכזיות לתרגול וחזרה. העיבוד, התמלול והתרגום של הנאום נעשו כולם בעזרת כלי בינה מלאכותית, אז נא לסלוח על מקומות שבהם זה לא דויק בול. הסיפור המלא על ההפגנה, הדובר, והפרויקט הזה נמצא בלשונית <a href="#" onclick="switchTab(\'about\'); return false;">אודות</a>.',
    ],
  },
};

const INTRO_CONTENT = {
  en: {
    title: "Abed Abu Shehadeh's Speech",
    text: "This is a simplified version of the speech — the spoken Palestinian dialect of Jaffa, preserved, but cleaned up so it reads like an essay. It's fully voweled with tashkeel and accompanied by an AI voice in sync, to support pronunciation if you need it. Tap any word, or drag across a phrase, for its meaning, and save what you want to keep studying to Vocab.",
  },
  he: {
    title: 'נאומו של עבד אבו שחאדה',
    text: 'זו גרסה מפושטת של הנאום — הניב המדובר הפלסטיני של יפו נשמר, אבל מסודר ומצוחצח כך שהוא נקרא כמו חיבור. הטקסט מנוקד במלואו בתשכיל ומלווה בקול בינה מלאכותית מסונכרן, כדי לתמוך בהגייה אם צריך. הקישו על כל מילה, או גררו על פני ביטוי, לקבלת פירושו, ושמרו את מה שתרצו להמשיך ולתרגל באוצר המילים.',
  },
};

const HEADER_GLOSS = {
  title: {
    ar: 'كَلِمَة عَبْد أَبُو شَحَادَة',
    en: "Abed Abu Shehadeh's Speech",
    he: 'נאומו של עבד אבו שחאדה',
  },
  location: {
    ar: 'وقفة يافا — حديقة الغزازوة، ٢٨ حزيران ٢٠٢٦',
    en: 'Ghazaza Park, Jaffa · June 28, 2026',
    he: 'גן אל-ע׳זאזווה, יפו · 28 ביוני 2026',
  },
};

const ABOUT_CONTENT = {
  en: {
    dir: 'ltr',
    sections: [
      { eyebrow: 'The Protest', heading: 'Jaffa, June 28, 2026', paragraphs: [
        'Three young men were killed in Jaffa within a three-day span in June 2026, the last — Mustafa Abu Lasan — by a car bomb as he was driving his 6-year-old son to school. Frustration at organized crime, and at a police response residents saw as negligent at best, boiled over into a demonstration at Ghazaza Park in Jaffa on Sunday evening, June 28. Protesters demanded the removal of the local police station commander and immediate, concrete steps to stop the killing.',
        'Organizers announced several follow-up actions: a sit-in tent at Ghazaza Park the following Thursday, where bereaved mothers and sisters could tell their own stories, and a Friday march through Jaffa with black flags.',
      ], source: 'Source: <a href="https://www.mawteni48.com/archives/337152" target="_blank" rel="noopener noreferrer">mawteni48.com &middot; coverage of the June 28, 2026 protest</a> (Arabic)' },
      { eyebrow: 'About the Speaker', heading: 'Abed Abu Shehadeh', paragraphs: [
        "Abed Abu Shehadeh was born in 1988 and grew up in Jaffa's Ajami neighborhood. He holds a BA and MA in political science from the Academic College of Tel Aviv-Jaffa, and has long been active in the Jaffa Youth movement and the Islamic Council, which he now chairs. He also served on the Tel Aviv-Jaffa city council, and today hosts <a href=\"https://www.arab48.com/%D8%A8%D9%88%D8%AF%D9%83%D8%A7%D8%B3%D8%AA/%D8%A7%D9%84%D9%85%D9%8A%D8%AF%D8%A7%D9%86\" target=\"_blank\" rel=\"noopener noreferrer\">Al-Maydan</a>, a podcast where he speaks and writes about violence, occupation, and Palestinian equality.",
      ]},
      { eyebrow: 'Why I Built This', heading: 'A personal study tool', paragraphs: [
        "I have a decent command of everyday spoken Palestinian Arabic, but seek to push further into the register used in grassroots community organizing and activism — the vocabulary for demanding accountability, mobilizing a community, and speaking publicly about grief and injustice. This speech, given by a community leader who I admire, about an urgent crisis in Jaffa, the city I love and where my daughter was born and lives, became the seed for a personal study tool: real audio, a cleaned-up readable text focused on spoken dialect, and vocabulary/verbs pulled from it, curated to my personal needs and learning style.",
      ]},
      { eyebrow: 'How I Built This', heading: 'The process, and where AI came in', paragraphs: [
        'AI did a lot of the heavy lifting in the development of this tool: transcribing Abed\'s raw audio, translating it into Hebrew and English, producing a simplified written piece, adding the tashkeel that makes spoken Arabic legible to a learner, and generating the AI voiceover you hear in the Reader. I also used an AI coding assistant (Claude Code) to build the site itself — the tap-to-translate reader, the vocab and verb tools, all of it came together through that back-and-forth. My part was choosing the speech, shaping the pedagogy, checking translations, and deciding what a learner at my level actually needs.',
        'For a detailed technical write-up of that process — including what went wrong along the way and what I learned about working with agentic AI — see <a href="#" onclick="openAiProcessDoc(); return false;">AI-PROCESS.md</a> (<a href="AI-PROCESS.md" download="AI-PROCESS.md">download</a>).',
      ]},
    ],
  },
  he: {
    dir: 'rtl',
    sections: [
      { eyebrow: 'ההפגנה', heading: 'יפו, 28 ביוני 2026', paragraphs: [
        'שלושה צעירים נרצחו ביפו בתוך פרק זמן של שלושה ימים ביוני 2026, האחרון שבהם — מוסטפא אבו לסאן — בפיצוץ מטען חבלה ברכבו, בעודו נוהג את בנו בן השש לבית הספר. תסכול מהפשיעה המאורגנת, ומתגובת המשטרה שתושבים תפסו כרשלנית בלשון המעטה, התפרץ להפגנה בגן אל-ע׳זאזווה ביפו בערב יום ראשון, 28 ביוני. המפגינים דרשו את הדחתו של מפקד תחנת המשטרה המקומית ונקיטת צעדים מיידיים וממשיים לעצירת ההרג.',
        'המארגנים הכריזו מאותה הבמה על צעדי המשך: אוהל מחאה בגן אל-ע׳זאזווה ביום חמישי הקרוב, שבו אמהות ואחיות שכולות יוכלו לספר את סיפוריהן, וצעדה ביום שישי ברחבי יפו עם דגלים שחורים.',
      ], source: 'מקור: <a href="https://www.mawteni48.com/archives/337152" target="_blank" rel="noopener noreferrer">mawteni48.com &middot; סיקור ההפגנה מ-28 ביוני 2026</a> (בערבית)' },
      { eyebrow: 'אודות הדובר', heading: 'עבד אבו שחאדה', paragraphs: [
        'עבד אבו שחאדה נולד ב-1988 וגדל בשכונת עג\'מי ביפו. הוא בעל תואר ראשון ותואר שני במדעי המדינה מהמכללה האקדמית תל אביב-יפו, ופעיל ותיק בתנועת נוער יפו ובמועצה האסלאמית, שבה הוא מכהן כיו״ר כיום. הוא גם כיהן כחבר מועצת עיריית תל אביב-יפו, וכיום מנחה את <a href="https://www.arab48.com/%D8%A8%D9%88%D8%AF%D9%83%D8%A7%D8%B3%D8%AA/%D8%A7%D9%84%D9%85%D9%8A%D8%AF%D8%A7%D9%86" target="_blank" rel="noopener noreferrer">אלמידאן</a>, פודקאסט שבו הוא מדבר וכותב על אלימות, כיבוש ושוויון פלסטיני.',
      ]},
      { eyebrow: 'למה בניתי את זה', heading: 'כלי לימוד אישי', paragraphs: [
        'יש לי שליטה סבירה בערבית פלסטינית מדוברת יומיומית, אך אני מבקש להעמיק אל תוך הרובד הלשוני שבו משתמשים בארגון קהילתי ובאקטיביזם בשטח — אוצר המילים לדרישת אחריותיות, לגיוס קהילה, ולדיבור פומבי על אבל ועל אי-צדק. הנאום הזה, שנשא אותו מנהיג קהילתי שאני מעריך, על משבר דוחק ביפו — העיר שאני אוהב ושבה נולדה וחיה בתי — הפך לזרע של כלי לימוד אישי: הקלטת שמע אמיתית, טקסט קריא ומסודר שמתמקד בניב המדובר, ואוצר מילים ופעלים שנשלפו ממנו, שנאספו בהתאמה לצרכים האישיים ולסגנון הלמידה שלי.',
      ]},
      { eyebrow: 'איך בניתי את זה', heading: 'התהליך, והיכן נכנסה בינה מלאכותית', paragraphs: [
        'בינה מלאכותית עשתה חלק גדול מהעבודה הקשה בפיתוח הכלי הזה: תמלול ההקלטה הגולמית של עבד, תרגומה לעברית ולאנגלית, הפקת נוסח כתוב מפושט, הוספת התשכיל שהופך ערבית מדוברת לקריאה עבור לומד, והפקת הקראת הבינה המלאכותית שנשמעת בלשונית הקורא. השתמשתי גם בעוזר תכנות מבוסס בינה מלאכותית (Claude Code) לבניית האתר עצמו — הקורא המבוסס על הקשה-לתרגום, כלי אוצר המילים והפעלים, הכול נבנה דרך אותו דיאלוג. החלק שלי היה לבחור את הנאום, לעצב את הגישה הפדגוגית, לבדוק תרגומים, ולהחליט מה לומד בשלב שלי צריך בפועל.',
        'לכתיבה טכנית מפורטת יותר על התהליך הזה — כולל מה שהשתבש בדרך ומה שלמדתי על עבודה עם בינה מלאכותית אגנטית — ראו <a href="#" onclick="openAiProcessDoc(); return false;">AI-PROCESS.md</a> (<a href="AI-PROCESS.md" download="AI-PROCESS.md">הורדה</a>).',
      ]},
    ],
  },
};

const bundle = {
  meta: {
    slug: SLUG,
    title: HOME_CONTENT.en.title,
    subtitle: HOME_CONTENT.en.subtitle,
    videoPath: 'video/abed-speech.mp4',
    captionsPath: 'video/captions-ar.vtt',
  },
  chunks: CHUNKS,
  phraseGlosses: PHRASE_GLOSSES,
  vocabSeed: SEED_VOCAB,
  verbs: SAVED_VERBS,
  watchCaptions: WATCH_CAPTIONS,
  voiceover: { src: VOICEOVER_SRC.replace(/^audio\//, 'audio/'), chunks: VOICEOVER_CHUNKS, wordTimes: VOICEOVER_WORD_TIMES },
  homeContent: HOME_CONTENT,
  introContent: INTRO_CONTENT,
  aboutContent: ABOUT_CONTENT,
  headerGloss: HEADER_GLOSS,
};

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'data.json'), JSON.stringify(bundle), 'utf8');
console.log('Wrote', path.join(OUT_DIR, 'data.json'), '(' + JSON.stringify(bundle).length + ' bytes)');
