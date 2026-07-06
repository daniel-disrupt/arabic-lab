/* ─────────────── VOCAB DATA — curated starter list, Abu Shehadeh lesson ───────────────
   Hand-curated (not auto-extracted): skips vocabulary a learner with a decent command of
   basic spoken Palestinian/Jaffa Arabic already knows, and surfaces the more advanced,
   sophisticated terms — with an eye toward two registers: daily life in Jaffa (civic/
   municipal vocabulary, local idiom) and community organizing / activism on behalf of
   disadvantaged and oppressed communities (demanding, mobilizing, institutions, state
   repression). Verbs are included here too, in addition to living in the Verbs tab.
   Starting point only — meant to be edited (added to / trimmed) from here, item by item.
   `ci` = index into CHUNKS (lesson-data.js), enabling jump-to-source-line in the Reader.
*/
const SEED_VOCAB = [
  // 0:02 – 0:26
  { type:'word', ar:'الادِّعاءات', he:'הטענות', en:'the accusations', root:null, isVerb:false, ci:0 },
  { type:'word', ar:'بِنْقِتْلوا', he:'נרצחים', en:'are killed', root:'قتل', isVerb:true, ci:0 },
  { type:'word', ar:'هالوَقْفِة', he:'העצרת הזאת', en:'this rally, this vigil', root:'وقف', isVerb:false, ci:0 },
  { type:'word', ar:'ساكْتين', he:'שותקים', en:'silent, staying silent', root:'سكت', isVerb:true, ci:0 },

  // 0:26 – 0:54
  { type:'word', ar:'مَوْقِف', he:'עמדה', en:'a stance', root:'وقف', isVerb:false, ci:1 },
  { type:'word', ar:'نْسَجِّل', he:'נרשום', en:'we register', root:'سجل', isVerb:true, ci:1 },
  { type:'word', ar:'المُظاهَرة', he:'ההפגנה', en:'the demonstration', root:null, isVerb:false, ci:1 },
  { type:'word', ar:'تْخَيَّلوا', he:'תארו לעצמכם', en:'imagine!', root:'خيل', isVerb:true, ci:1 },
  { type:'word', ar:'قيمِة', he:'הערך של', en:'the value of', root:null, isVerb:false, ci:1 },

  // 0:54 – 1:21
  { type:'phrase', ar:'يا جَماعة', he:'יא ג’מאעה — פנייה לקהל', en:'hey everyone / folks', phraseType:null, ci:2 },
  { type:'phrase', ar:'مِش طَبيعي', he:'לא נורמלי', en:'not normal', phraseType:'idiom', ci:2 },
  { type:'phrase', ar:'عِصاباتِ الجَريمِة', he:'לכנופיות הפשע', en:'the gangs of crime', phraseType:null, ci:2 },
  { type:'word', ar:'تِحْكُم', he:'לשלוט ב', en:'to rule', root:'حكم', isVerb:true, ci:2 },
  { type:'word', ar:'اليَأْس', he:'הייאוש', en:'despair', root:'يأس', sharedRoot:true, isVerb:false, ci:2 },
  { type:'phrase', ar:'مَشْروع سِياسي', he:'פרויקט פוליטי', en:'a political project', phraseType:null, ci:2 },

  // 1:21 – 1:38
  { type:'word', ar:'المُسْتَقْبَل', he:'העתיד', en:'the future', root:null, isVerb:false, ci:3 },
  { type:'word', ar:'رَدّنا', he:'התגובה שלנו', en:'our response', root:'رد', isVerb:false, ci:3 },
  { type:'word', ar:'نِبْني', he:'לבנות', en:'we build', root:'بني', isVerb:true, ci:3 },

  // 1:38 – 2:13
  { type:'word', ar:'ومُؤَسَّسِة', he:'ומוסד', en:'and institution', root:null, isVerb:false, ci:4 },
  { type:'word', ar:'عُنْصُرِيِّة', he:'גזעני', en:'racist', root:null, isVerb:false, ci:4 },
  { type:'phrase', ar:'عَ فِكْرة', he:'דרך אגב', en:'by the way', phraseType:null, ci:4 },
  { type:'word', ar:'يْلاحْقوا', he:'לרדוף אחרי', en:'chasing, pursuing', root:'لحق', isVerb:true, ci:4 },
  { type:'word', ar:'الضِّفِّة', he:'הגדה', en:'the West Bank', root:null, isVerb:false, ci:4 },
  { type:'word', ar:'يْخُصّ', he:'נוגע ל', en:'concerns, relates to', root:'خص', isVerb:true, ci:4 },
  { type:'word', ar:'العُنِف', he:'האלימות', en:'the violence', root:null, isVerb:false, ci:4 },
  { type:'word', ar:'الواقِع', he:'המציאות', en:'the reality', root:'وقع', isVerb:false, ci:4 },
  { type:'word', ar:'نَصيبْنا', he:'הגורל שלנו', en:'our fate', root:'نصب', isVerb:false, ci:4 },
  { type:'word', ar:'الشَّعِب', he:'העם', en:'the people, the nation', root:null, isVerb:false, ci:4 },

  // 2:13 – 3:00
  { type:'word', ar:'نْطالِب', he:'אנחנו דורשים', en:'we demand', root:'طلب', isVerb:true, ci:5 },
  { type:'word', ar:'بِإِقالِة', he:'בפיטורים של', en:'the dismissal of', root:'قال', isVerb:false, ci:5 },
  { type:'word', ar:'قائِد', he:'מפקד', en:'commander', root:'قود', isVerb:false, ci:5 },
  { type:'word', ar:'مَحَطِّة', he:'תחנת', en:'station of', root:null, isVerb:false, ci:5 },
  { type:'word', ar:'يِسْتَحي', he:'מתבייש', en:'feels ashamed', root:'حيي', isVerb:true, ci:5 },
  { type:'word', ar:'فاشِل', he:'כישלון', en:'a failure', root:'فشل', isVerb:false, ci:5 },
  { type:'word', ar:'الزَّلَمِة', he:'הבן-אדם', en:'the guy, the fellow', root:null, isVerb:false, ci:5 },
  { type:'word', ar:'شايْفين', he:'רואים', en:'you see? (rhetorical)', root:'شوف', isVerb:true, ci:5 },
  { type:'word', ar:'أَصْلاً', he:'בכלל', en:'to begin with, originally', root:null, isVerb:false, ci:5 },

  // 3:00 – 3:13
  { type:'word', ar:'خَطْوة', he:'צעד', en:'step', root:null, isVerb:false, ci:6 },
  { type:'phrase', ar:'بِالهَيْئة الإِسْلامِيِّة', he:'בוועדה האסלאמית', en:'with the Islamic committee', phraseType:null, ci:6 },
  { type:'word', ar:'نَقَشْناها', he:'תכננו אותה', en:'we mapped it out', root:'نقش', isVerb:true, ci:6 },
  { type:'word', ar:'نْطَلِّع', he:'נוציא', en:'bring out, issue', root:'طلع', isVerb:true, ci:6 },
  { type:'word', ar:'عَريضة', he:'עצומה', en:'a petition', root:null, isVerb:false, ci:6 },
  { type:'word', ar:'نْوَصِّلْها', he:'נעביר אותה', en:'we’ll deliver it', root:'وصل', isVerb:true, ci:6 },
  { type:'word', ar:'الجِهات', he:'הגורמים', en:'the parties, the authorities', root:null, isVerb:false, ci:6 },

  // 3:13 – 4:05
  { type:'word', ar:'نْنُصُب', he:'נקים', en:'we’ll erect, set up', root:'نصب', isVerb:true, ci:7 },
  { type:'phrase', ar:'خِيمِة اعْتِصام', he:'אוהל ישיבת מחאה', en:'sit-in protest tent', phraseType:null, ci:7 },
  { type:'word', ar:'قَرَّرْنا', he:'החלטנו', en:'we decided', root:'قرر', isVerb:true, ci:7 },
  { type:'word', ar:'الأُمَّهات', he:'האמהות', en:'the mothers', root:null, isVerb:false, ci:7 },
  { type:'word', ar:'قِصَصْهُن', he:'הסיפורים שלהן', en:'their stories', root:'قصص', isVerb:false, ci:7 },
  { type:'phrase', ar:'طَلَب خاصّ', he:'בקשה מיוחדת', en:'a special request', phraseType:null, ci:7 },
  { type:'word', ar:'راحوا', he:'הלכו', en:'passed away (euphemism)', root:'روح', isVerb:true, ci:7 },

  // 4:05 – 5:00
  { type:'word', ar:'بَتْوَجَّه', he:'פונה', en:'I turn to, address', root:'وجه', isVerb:true, ci:8 },
  { type:'word', ar:'والمِنَصّة', he:'והבמה', en:'and the platform', root:null, isVerb:false, ci:8 },
  { type:'word', ar:'صُوَر', he:'תמונות', en:'pictures of', root:null, isVerb:false, ci:8 },

  // 5:00 – 5:26
  { type:'phrase', ar:'شو هالجُنون', he:'מה השיגעון הזה', en:'what is this madness', phraseType:'idiom', ci:9 },
  { type:'word', ar:'يَمين', he:'ימין', en:'right (political)', root:null, isVerb:false, ci:9 },
  { type:'word', ar:'يَسار', he:'שמאל', en:'left (political)', root:null, isVerb:false, ci:9 },

  // 5:26 – 6:04
  { type:'word', ar:'رِسالة', he:'מסר', en:'a message', root:null, isVerb:false, ci:10 },
  { type:'phrase', ar:'قَدّ ما', he:'כמה ש', en:'as much as', phraseType:null, ci:10 },
  { type:'word', ar:'اخْتَلَفْنا', he:'התווכחנו', en:'we disagreed', root:'اختلف', isVerb:true, ci:10 },
  { type:'word', ar:'بْنِحِبّكُم', he:'אנחנו אוהבים אתכם', en:'we love you', root:'حب', isVerb:true, ci:10 },
  { type:'word', ar:'تِتْصَرَّفوا', he:'תתנהגו', en:'behave', root:'تصرف', isVerb:true, ci:10 },
  { type:'word', ar:'اضْطَرَّيْتوا', he:'נאלצתם', en:'you were forced', root:'اضطر', isVerb:true, ci:10 },
  { type:'word', ar:'المُحْرِج', he:'המביך', en:'embarrassing', root:null, isVerb:false, ci:10 },
  { type:'word', ar:'مَسْؤولِيِّة', he:'אחריות', en:'responsibility', root:null, isVerb:false, ci:10 },

  // 6:04 – 6:25
  { type:'word', ar:'مُعْطى', he:'נתון', en:'a piece of information', root:null, isVerb:false, ci:11 },
  { type:'word', ar:'البَلَدِيِّة', he:'העירייה', en:'the municipality', root:null, isVerb:false, ci:11 },
  { type:'phrase', ar:'الإدارة العُلْيا', he:'ההנהלה העליונה', en:'the senior administration', phraseType:null, ci:11 },
  { type:'word', ar:'عَمبِيخَطّْطوا', he:'מתכננים', en:'planning', root:'خطط', isVerb:true, ci:11 },
  { type:'word', ar:'المُجْرِمين', he:'הפושעים', en:'the criminals', root:'جرم', isVerb:false, ci:11 },
  { type:'word', ar:'عَمبِيسْتَغِلّوا', he:'מנצלים', en:'exploiting', root:'استغل', isVerb:true, ci:11 },

  // 6:04 – 6:25
  { type:'phrase', ar:'خافوا اللَّه', he:'יראו שמיים, תיזהרו', en:'fear God', phraseType:'idiom', ci:11 },
  { type:'phrase', ar:'لَوين رايْحين', he:'לאן הולכים', en:'where are we headed', phraseType:'idiom', ci:11 },

  // 6:25 – 6:50
  { type:'word', ar:'باقْيين', he:'נשארים', en:'remaining, steadfast', root:'بقي', isVerb:true, ci:12 },
  { type:'phrase', ar:'فيكُم العافْية', he:'תודה רבה, בריאות לכם', en:'thank you / bless you', phraseType:'idiom', ci:12 },
  { type:'phrase', ar:'لا تِيْأَسوا', he:'אל תתייאשו', en:'don’t despair', phraseType:'idiom', ci:12 },
  { type:'word', ar:'نِتْحَدّى', he:'נתמודד', en:'we’ll challenge, take on', root:'تحدى', isVerb:true, ci:12 },
  { type:'word', ar:'قَدّها', he:'עומדים בזה', en:'up to it, equal to the task', root:null, isVerb:false, ci:12 },
  { type:'word', ar:'مَوْجودين', he:'נמצאים', en:'present, here', root:'وجد', isVerb:true, ci:12 },
  { type:'phrase', ar:'بَحِر يافا', he:'ים יפו', en:'the sea of Jaffa', phraseType:'proverb', ci:12 },
];
