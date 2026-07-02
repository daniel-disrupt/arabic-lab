/* ─────────────── VERB DATA — extracted from the Abu Shehadeh lesson ───────────────
   AI-generated (dialect-aware Palestinian conjugation).
*/
const SAVED_VERBS = [
  {
    id: 'sakat', ar: 'سَكَت', arDisplay: 'يِسكُت', root: 'س-ك-ت', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'שורש שלם', gloss_he: 'לשתוק, להיות שקט', gloss_en: 'to be silent, to stay quiet',
    participle: { m: 'ساكِت', f: 'ساكتة', pl: 'ساكتين', he: 'שותק / שקט' },
    masdar: { ar: 'سُكوت', he: 'שתיקה' },
    conj: {
      past: [
        {pronoun:'אני',he:'שתקתי',ar:'سَكَتّ'},{pronoun:'אתה',he:'שתקת',ar:'سَكَتّ'},{pronoun:'את',he:'שתקת',ar:'سَكَتّي'},
        {pronoun:'הוא',he:'שתק',ar:'سَكَت'},{pronoun:'היא',he:'שתקה',ar:'سَكَتِت'},{pronoun:'אנחנו',he:'שתקנו',ar:'سَكَتنا',context:'— בנאום: نِسكُت'},
        {pronoun:'אתם/ן',he:'שתקתם',ar:'سَكَتتوا'},{pronoun:'הם/ן',he:'שתקו',ar:'سَكَتوا'},
      ],
      present: [
        {pronoun:'אני',he:'שותק/ת',ar:'بِسكُت'},{pronoun:'אתה',he:'שותק',ar:'بِتسكُت'},{pronoun:'את',he:'שותקת',ar:'بِتسكُتي'},
        {pronoun:'הוא',he:'שותק',ar:'بِيسكُت'},{pronoun:'היא',he:'שותקת',ar:'بِتسكُت'},{pronoun:'אנחנו',he:'שותקים',ar:'بِنسكُت',context:'— בנאום'},
        {pronoun:'אתם/ן',he:'שותקים',ar:'بِتسكُتوا'},{pronoun:'הם/ן',he:'שותקים',ar:'بِيسكُتوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'שתוק',ar:'اسكُت'},{pronoun:'את',he:'שתקי',ar:'اسكُتي'},{pronoun:'אתם/ן',he:'שתקו',ar:'اسكُتوا'},
      ],
    },
  },
  {
    id: 'talab', ar: 'طَلَب', arDisplay: 'بِنطالِب', root: 'ط-ل-ب', binyan: 'פִּיעֵל', formNum: 3,
    dialectNote: 'שורש שלם — הדדי', gloss_he: 'לדרוש, לבקש (בתוקף)', gloss_en: 'to demand, to request firmly',
    participle: { m: 'مطالِب', f: 'مطالبة', pl: 'مطالبين', he: 'דורש / תובע' },
    masdar: { ar: 'مطالَبة', he: 'תביעה, דרישה' },
    conj: {
      past: [
        {pronoun:'אני',he:'דרשתי',ar:'طالَبّت'},{pronoun:'אתה',he:'דרשת',ar:'طالَبّت'},{pronoun:'את',he:'דרשת',ar:'طالَبّتي'},
        {pronoun:'הוא',he:'דרש',ar:'طالَب'},{pronoun:'היא',he:'דרשה',ar:'طالَبِت'},{pronoun:'אנחנו',he:'דרשנו',ar:'طالَبنا'},
        {pronoun:'אתם/ן',he:'דרשתם',ar:'طالَبتوا'},{pronoun:'הם/ן',he:'דרשו',ar:'طالَبوا'},
      ],
      present: [
        {pronoun:'אני',he:'דורש/ת',ar:'بطالِب'},{pronoun:'אתה',he:'דורש',ar:'بِتطالِب'},{pronoun:'את',he:'דורשת',ar:'بِتطالبي'},
        {pronoun:'הוא',he:'דורש',ar:'بِيطالِب'},{pronoun:'היא',he:'דורשת',ar:'بِتطالِب'},{pronoun:'אנחנו',he:'דורשים',ar:'بِنطالِب',context:'— בנאום'},
        {pronoun:'אתם/ן',he:'דורשים',ar:'بِتطالبوا'},{pronoun:'הם/ן',he:'דורשים',ar:'بِيطالبوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'דרוש',ar:'طالِب'},{pronoun:'את',he:'דרשי',ar:'طالبي'},{pronoun:'אתם/ן',he:'דרשו',ar:'طالبوا'},
      ],
    },
  },
  {
    id: 'mat', ar: 'مات', arDisplay: 'بِيموت', root: 'م-و-ت', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'גזרת ע״ו — חלול', gloss_he: 'למות', gloss_en: 'to die',
    participle: { m: 'مَيِّت', f: 'مَيِّتة', pl: 'مَيِّتين', he: 'מת / גוסס' },
    masdar: { ar: 'مَوت', he: 'מוות' },
    conj: {
      past: [
        {pronoun:'אני',he:'מתי',ar:'مِتّ'},{pronoun:'אתה',he:'מת',ar:'مِتّ'},{pronoun:'את',he:'מת',ar:'مِتّي'},
        {pronoun:'הוא',he:'מת',ar:'مات'},{pronoun:'היא',he:'מתה',ar:'ماتِت'},{pronoun:'אנחנו',he:'מתנו',ar:'مِتنا'},
        {pronoun:'אתם/ן',he:'מתתם',ar:'مِتتوا'},{pronoun:'הם/ן',he:'מתו',ar:'ماتوا'},
      ],
      present: [
        {pronoun:'אני',he:'מת/ה',ar:'بموت'},{pronoun:'אתה',he:'מת',ar:'بِتموت'},{pronoun:'את',he:'מתה',ar:'بِتموتي'},
        {pronoun:'הוא',he:'מת',ar:'بِيموت',context:'— בנאום'},{pronoun:'היא',he:'מתה',ar:'بِتموت'},{pronoun:'אנחנו',he:'מתים',ar:'بِنموت'},
        {pronoun:'אתם/ן',he:'מתים',ar:'بِتموتوا'},{pronoun:'הם/ן',he:'מתים',ar:'بِيموتوا'},
      ],
      imperative: [ {pronoun:'(נדיר)',he:'—',ar:'—'} ],
    },
  },
  {
    id: 'radd', ar: 'رَدّ', arDisplay: 'أَرُدّ', root: 'ر-د-د', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'פועל כפול — עיצור אחרון מוכפל', gloss_he: 'להשיב, לענות', gloss_en: 'to respond, to reply',
    participle: { m: 'رادّ', f: 'رادّة', pl: 'رادّين', he: 'משיב / עונה' },
    masdar: { ar: 'رَدّ', he: 'תשובה' },
    conj: {
      past: [
        {pronoun:'אני',he:'עניתי',ar:'رَدّيت'},{pronoun:'אתה',he:'עניתָ',ar:'رَدّيت'},{pronoun:'את',he:'עניתְ',ar:'رَدّيتي'},
        {pronoun:'הוא',he:'ענה',ar:'رَدّ'},{pronoun:'היא',he:'ענתה',ar:'رَدِّت'},{pronoun:'אנחנו',he:'עננו',ar:'رَدّينا'},
        {pronoun:'אתם/ן',he:'עניתם',ar:'رَدّيتوا'},{pronoun:'הם/ן',he:'ענו',ar:'رَدّوا'},
      ],
      present: [
        {pronoun:'אני',he:'עונה',ar:'بَرُدّ',context:'— בנאום: أَرُدّ'},{pronoun:'אתה',he:'עונה',ar:'بِتْرُدّ'},{pronoun:'את',he:'עונה',ar:'بِتْرُدّي'},
        {pronoun:'הוא',he:'עונה',ar:'بِيْرُدّ'},{pronoun:'היא',he:'עונה',ar:'بِتْرُدّ'},{pronoun:'אנחנו',he:'עונים',ar:'بِنْرُدّ'},
        {pronoun:'אתם/ן',he:'עונים',ar:'بِتْرُدّوا'},{pronoun:'הם/ן',he:'עונים',ar:'بِيْرُدّوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'ענה',ar:'رُدّ'},{pronoun:'את',he:'עני',ar:'رُدّي'},{pronoun:'אתם/ן',he:'ענו',ar:'رُدّوا'},
      ],
    },
  },
  {
    id: 'saal', ar: 'سَأَل', arDisplay: 'أَسْأَل', root: 'س-أ-ل', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'שורש שלם', gloss_he: 'לשאול', gloss_en: 'to ask',
    participle: { m: 'سائِل', f: 'سائِلة', pl: 'سائِلين', he: 'שואל' },
    masdar: { ar: 'سُؤال', he: 'שאלה' },
    conj: {
      past: [
        {pronoun:'אני',he:'שאלתי',ar:'سَأَلْت'},{pronoun:'אתה',he:'שאלת',ar:'سَأَلْت'},{pronoun:'את',he:'שאלת',ar:'سَأَلْتي'},
        {pronoun:'הוא',he:'שאל',ar:'سَأَل'},{pronoun:'היא',he:'שאלה',ar:'سَأَلِت'},{pronoun:'אנחנו',he:'שאלנו',ar:'سَأَلْنا'},
        {pronoun:'אתם/ן',he:'שאלתם',ar:'سَأَلْتوا'},{pronoun:'הם/ן',he:'שאלו',ar:'سَأَلوا'},
      ],
      present: [
        {pronoun:'אני',he:'שואל/ת',ar:'بَسْأَل',context:'— בנאום: أَسْأَل'},{pronoun:'אתה',he:'שואל',ar:'بِتِسْأَل'},{pronoun:'את',he:'שואלת',ar:'بِتِسْأَلي'},
        {pronoun:'הוא',he:'שואל',ar:'بِيِسْأَل'},{pronoun:'היא',he:'שואלת',ar:'بِتِسْأَل'},{pronoun:'אנחנו',he:'שואלים',ar:'بِنِسْأَل'},
        {pronoun:'אתם/ן',he:'שואלים',ar:'بِتِسْأَلوا'},{pronoun:'הם/ן',he:'שואלים',ar:'بِيِسْأَلوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'שאל',ar:'اِسْأَل'},{pronoun:'את',he:'שאלי',ar:'اِسْأَلي'},{pronoun:'אתם/ן',he:'שאלו',ar:'اِسْأَلوا'},
      ],
    },
  },
  {
    id: 'dall', ar: 'ضَلّ', arDisplay: 'نِضَلّ', root: 'ض-ل-ل', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'פועל כפול', gloss_he: 'להישאר, להמשיך', gloss_en: 'to remain, to keep on',
    participle: { m: 'ضالّ', f: 'ضالّة', pl: 'ضالّين', he: 'נשאר (פחות שכיח כשם פועל)' },
    masdar: { ar: 'ضَلّ', he: 'היוותרות' },
    conj: {
      past: [
        {pronoun:'אני',he:'נשארתי',ar:'ضَلّيت'},{pronoun:'אתה',he:'נשארת',ar:'ضَلّيت'},{pronoun:'את',he:'נשארת',ar:'ضَلّيتي'},
        {pronoun:'הוא',he:'נשאר',ar:'ضَلّ'},{pronoun:'היא',he:'נשארה',ar:'ضَلِّت'},{pronoun:'אנחנו',he:'נשארנו',ar:'ضَلّينا'},
        {pronoun:'אתם/ן',he:'נשארתם',ar:'ضَلّيتوا'},{pronoun:'הם/ן',he:'נשארו',ar:'ضَلّوا'},
      ],
      present: [
        {pronoun:'אני',he:'נשאר/ת',ar:'بَضَلّ'},{pronoun:'אתה',he:'נשאר',ar:'بِتْضَلّ'},{pronoun:'את',he:'נשארת',ar:'بِتْضَلّي'},
        {pronoun:'הוא',he:'נשאר',ar:'بِيْضَلّ'},{pronoun:'היא',he:'נשארת',ar:'بِتْضَلّ'},{pronoun:'אנחנו',he:'נשארים',ar:'بِنْضَلّ',context:'— בנאום: مِنْضَلّ / نْضَلّ'},
        {pronoun:'אתם/ן',he:'נשארים',ar:'بِتْضَلّوا'},{pronoun:'הם/ן',he:'נשארים',ar:'بِيْضَلّوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'הישאר',ar:'ضَلّ'},{pronoun:'את',he:'הישארי',ar:'ضَلّي'},{pronoun:'אתם/ן',he:'הישארו',ar:'ضَلّوا'},
      ],
    },
  },
  {
    id: 'hatt', ar: 'حَطّ', arDisplay: 'نْحُطّ', root: 'ح-ط-ط', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'פועל כפול', gloss_he: 'לשים', gloss_en: 'to put, to place',
    participle: { m: 'حاطّ', f: 'حاطّة', pl: 'حاطّين', he: 'שם (מניח)' },
    masdar: { ar: 'حَطّ', he: 'הנחה' },
    conj: {
      past: [
        {pronoun:'אני',he:'שמתי',ar:'حَطّيت'},{pronoun:'אתה',he:'שמת',ar:'حَطّيت'},{pronoun:'את',he:'שמת',ar:'حَطّيتي'},
        {pronoun:'הוא',he:'שם',ar:'حَطّ'},{pronoun:'היא',he:'שמה',ar:'حَطِّت'},{pronoun:'אנחנו',he:'שמנו',ar:'حَطّينا'},
        {pronoun:'אתם/ן',he:'שמתם',ar:'حَطّيتوا'},{pronoun:'הם/ן',he:'שמו',ar:'حَطّوا'},
      ],
      present: [
        {pronoun:'אני',he:'שם',ar:'بَحُطّ'},{pronoun:'אתה',he:'שם',ar:'بِتْحُطّ'},{pronoun:'את',he:'שמה',ar:'بِتْحُطّي'},
        {pronoun:'הוא',he:'שם',ar:'بِيْحُطّ'},{pronoun:'היא',he:'שמה',ar:'بِتْحُطّ'},{pronoun:'אנחנו',he:'שמים',ar:'بِنْحُطّ',context:'— בנאום'},
        {pronoun:'אתם/ן',he:'שמים',ar:'بِتْحُطّوا'},{pronoun:'הם/ן',he:'שמים',ar:'بِيْحُطّوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'שים',ar:'حُطّ'},{pronoun:'את',he:'שימי',ar:'حُطّي'},{pronoun:'אתם/ן',he:'שימו',ar:'حُطّوا'},
      ],
    },
  },
  {
    id: 'taamal', ar: 'تْعامَل', arDisplay: 'نِتْعامَل', root: 'ع-م-ل', binyan: 'הִתְפַּעֵל', formNum: 6,
    dialectNote: 'בניין תפאעל — הדדי', gloss_he: 'להתייחס, להתנהג (כלפי מצב)', gloss_en: 'to deal with, to treat (a situation)',
    participle: { m: 'مِتْعامِل', f: 'مِتْعامْلة', pl: 'مِتْعامْلين', he: 'מתייחס' },
    masdar: { ar: 'تْعامُل', he: 'התייחסות' },
    conj: {
      past: [
        {pronoun:'אני',he:'התייחסתי',ar:'تْعامَلْت'},{pronoun:'אתה',he:'התייחסת',ar:'تْعامَلْت'},{pronoun:'את',he:'התייחסת',ar:'تْعامَلْتي'},
        {pronoun:'הוא',he:'התייחס',ar:'تْعامَل'},{pronoun:'היא',he:'התייחסה',ar:'تْعامَلِت'},{pronoun:'אנחנו',he:'התייחסנו',ar:'تْعامَلْنا'},
        {pronoun:'אתם/ן',he:'התייחסתם',ar:'تْعامَلْتوا'},{pronoun:'הם/ן',he:'התייחסו',ar:'تْعامَلوا'},
      ],
      present: [
        {pronoun:'אני',he:'מתייחס/ת',ar:'بَتْعامَل'},{pronoun:'אתה',he:'מתייחס',ar:'بِتِتْعامَل'},{pronoun:'את',he:'מתייחסת',ar:'بِتِتْعامَلي'},
        {pronoun:'הוא',he:'מתייחס',ar:'بِيِتْعامَل'},{pronoun:'היא',he:'מתייחסת',ar:'بِتِتْعامَل'},{pronoun:'אנחנו',he:'מתייחסים',ar:'بِنِتْعامَل',context:'— בנאום: نِتْعامَل'},
        {pronoun:'אתם/ן',he:'מתייחסים',ar:'بِتِتْعامَلوا'},{pronoun:'הם/ן',he:'מתייחסים',ar:'بِيِتْعامَلوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'התייחס',ar:'اِتْعامَل'},{pronoun:'את',he:'התייחסי',ar:'اِتْعامَلي'},{pronoun:'אתם/ן',he:'התייחסו',ar:'اِتْعامَلوا'},
      ],
    },
  },
  {
    id: 'saar', ar: 'صار', arDisplay: 'بِصير', root: 'ص-و-ر', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'גזרת ע״ו — חלול', gloss_he: 'להפוך, לקרות', gloss_en: 'to become, to happen',
    participle: { m: 'صايِر', f: 'صايْرة', pl: 'صايْرين', he: 'קורה / הופך' },
    masdar: null,
    conj: {
      past: [
        {pronoun:'אני',he:'הפכתי',ar:'صِرْت'},{pronoun:'אתה',he:'הפכת',ar:'صِرْت'},{pronoun:'את',he:'הפכת',ar:'صِرْتي'},
        {pronoun:'הוא',he:'הפך / קרה',ar:'صار'},{pronoun:'היא',he:'הפכה',ar:'صارِت'},{pronoun:'אנחנו',he:'הפכנו',ar:'صِرْنا'},
        {pronoun:'אתם/ן',he:'הפכתם',ar:'صِرْتوا'},{pronoun:'הם/ן',he:'הפכו',ar:'صاروا'},
      ],
      present: [
        {pronoun:'אני',he:'הופך/ת',ar:'بَصير'},{pronoun:'אתה',he:'הופך',ar:'بِتْصير'},{pronoun:'את',he:'הופכת',ar:'بِتْصيري'},
        {pronoun:'הוא',he:'קורה',ar:'بِيصير',context:'— בנאום'},{pronoun:'היא',he:'קורה',ar:'بِتْصير'},{pronoun:'אנחנו',he:'הופכים',ar:'بِنْصير'},
        {pronoun:'אתם/ן',he:'הופכים',ar:'بِتْصيروا'},{pronoun:'הם/ן',he:'הופכים',ar:'بِيصيروا'},
      ],
      imperative: [ {pronoun:'(נדיר)',he:'—',ar:'—'} ],
    },
  },
  {
    id: 'sajjal', ar: 'سَجَّل', arDisplay: 'نْسَجِّل', root: 'س-ج-ل', binyan: 'פִּיעֵל', formNum: 2,
    dialectNote: 'שורש שלם', gloss_he: 'לרשום', gloss_en: 'to register, to record',
    participle: { m: 'مْسَجِّل', f: 'مْسَجِّلة', pl: 'مْسَجِّلين', he: 'רושם' },
    masdar: { ar: 'تَسْجيل', he: 'רישום' },
    conj: {
      past: [
        {pronoun:'אני',he:'רשמתי',ar:'سَجَّلْت'},{pronoun:'אתה',he:'רשמת',ar:'سَجَّلْت'},{pronoun:'את',he:'רשמת',ar:'سَجَّلْتي'},
        {pronoun:'הוא',he:'רשם',ar:'سَجَّل'},{pronoun:'היא',he:'רשמה',ar:'سَجَّلِت'},{pronoun:'אנחנו',he:'רשמנו',ar:'سَجَّلْنا'},
        {pronoun:'אתם/ן',he:'רשמתם',ar:'سَجَّلْتوا'},{pronoun:'הם/ן',he:'רשמו',ar:'سَجَّلوا'},
      ],
      present: [
        {pronoun:'אני',he:'רושם/ת',ar:'بَسَجِّل'},{pronoun:'אתה',he:'רושם',ar:'بِتْسَجِّل'},{pronoun:'את',he:'רושמת',ar:'بِتْسَجِّلي'},
        {pronoun:'הוא',he:'רושם',ar:'بِيْسَجِّل'},{pronoun:'היא',he:'רושמת',ar:'بِتْسَجِّل'},{pronoun:'אנחנו',he:'רושמים',ar:'بِنْسَجِّل',context:'— בנאום'},
        {pronoun:'אתם/ן',he:'רושמים',ar:'بِتْسَجِّلوا'},{pronoun:'הם/ן',he:'רושמים',ar:'بِيْسَجِّلوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'רשום',ar:'سَجِّل'},{pronoun:'את',he:'רשמי',ar:'سَجِّلي'},{pronoun:'אתם/ן',he:'רשמו',ar:'سَجِّلوا'},
      ],
    },
  },
  {
    id: 'khalla', ar: 'خَلّى', arDisplay: 'يْخَلّينا', root: 'خ-ل-ي', binyan: 'פִּיעֵל', formNum: 2,
    dialectNote: 'גזרת ל״י — נחה', gloss_he: 'לתת ל-, לאפשר', gloss_en: 'to let, to allow',
    participle: { m: 'مْخَلّي', f: 'مْخَلّية', pl: 'مْخَلّين', he: 'נותן ל-' },
    masdar: null,
    conj: {
      past: [
        {pronoun:'אני',he:'נתתי ל-',ar:'خَلّيت'},{pronoun:'אתה',he:'נתת ל-',ar:'خَلّيت'},{pronoun:'את',he:'נתת ל-',ar:'خَلّيتي'},
        {pronoun:'הוא',he:'נתן ל-',ar:'خَلّى'},{pronoun:'היא',he:'נתנה ל-',ar:'خَلِّت'},{pronoun:'אנחנו',he:'נתנו ל-',ar:'خَلّينا'},
        {pronoun:'אתם/ן',he:'נתתם ל-',ar:'خَلّيتوا'},{pronoun:'הם/ן',he:'נתנו ל-',ar:'خَلّوا'},
      ],
      present: [
        {pronoun:'אני',he:'נותן/ת ל-',ar:'بَخَلّي'},{pronoun:'אתה',he:'נותן ל-',ar:'بِتْخَلّي'},{pronoun:'את',he:'נותנת ל-',ar:'بِتْخَلّي'},
        {pronoun:'הוא',he:'נותן ל-',ar:'بِيْخَلّي'},{pronoun:'היא',he:'נותנת ל-',ar:'بِتْخَلّي'},{pronoun:'אנחנו',he:'נותנים ל-',ar:'بِنْخَلّي',context:'— בנאום: نْخَلّي'},
        {pronoun:'אתם/ן',he:'נותנים ל-',ar:'بِتْخَلّوا'},{pronoun:'הם/ן',he:'נותנים ל-',ar:'بِيْخَلّوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'תן ל-',ar:'خَلّي'},{pronoun:'את',he:'תני ל-',ar:'خَلّي'},{pronoun:'אתם/ן',he:'תנו ל-',ar:'خَلّوا'},
      ],
    },
  },
  {
    id: 'samah', ar: 'سِمِح', arDisplay: 'نِسْمَح', root: 'س-م-ح', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'שורש שלם', gloss_he: 'להרשות', gloss_en: 'to allow, to permit',
    participle: { m: 'سامِح', f: 'سامْحة', pl: 'سامْحين', he: 'מרשה / סולח' },
    masdar: { ar: 'سَماح', he: 'הרשאה' },
    conj: {
      past: [
        {pronoun:'אני',he:'הרשיתי',ar:'سِمِحْت'},{pronoun:'אתה',he:'הרשית',ar:'سِمِحْت'},{pronoun:'את',he:'הרשית',ar:'سِمِحْتي'},
        {pronoun:'הוא',he:'הרשה',ar:'سِمِح'},{pronoun:'היא',he:'הרשתה',ar:'سِمْحِت'},{pronoun:'אנחנו',he:'הרשינו',ar:'سِمِحْنا'},
        {pronoun:'אתם/ן',he:'הרשיתם',ar:'سِمِحْتوا'},{pronoun:'הם/ן',he:'הרשו',ar:'سِمْحوا'},
      ],
      present: [
        {pronoun:'אני',he:'מרשה',ar:'بَسْمَح'},{pronoun:'אתה',he:'מרשה',ar:'بِتِسْمَح'},{pronoun:'את',he:'מרשה',ar:'بِتِسْمَحي'},
        {pronoun:'הוא',he:'מרשה',ar:'بِيِسْمَح'},{pronoun:'היא',he:'מרשה',ar:'بِتِسْمَح'},{pronoun:'אנחנו',he:'מרשים',ar:'بِنِسْمَح',context:'— בנאום'},
        {pronoun:'אתם/ן',he:'מרשים',ar:'بِتِسْمَحوا'},{pronoun:'הם/ן',he:'מרשים',ar:'بِيِسْمَحوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'הרשה',ar:'اِسْمَح'},{pronoun:'את',he:'הרשי',ar:'اِسْمَحي'},{pronoun:'אתם/ן',he:'הרשו',ar:'اِسْمَحوا'},
      ],
    },
  },
  {
    id: 'hakam', ar: 'حَكَم', arDisplay: 'تِحْكُم', root: 'ح-ك-م', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'שורש שלם', gloss_he: 'לשלוט, לשפוט', gloss_en: 'to rule, to govern',
    participle: { m: 'حاكِم', f: 'حاكْمة', pl: 'حاكْمين', he: 'שולט' },
    masdar: { ar: 'حُكْم', he: 'שלטון' },
    conj: {
      past: [
        {pronoun:'אני',he:'שלטתי',ar:'حَكَمْت'},{pronoun:'אתה',he:'שלטת',ar:'حَكَمْت'},{pronoun:'את',he:'שלטת',ar:'حَكَمْتي'},
        {pronoun:'הוא',he:'שלט',ar:'حَكَم'},{pronoun:'היא',he:'שלטה',ar:'حَكَمِت'},{pronoun:'אנחנו',he:'שלטנו',ar:'حَكَمْنا'},
        {pronoun:'אתם/ן',he:'שלטתם',ar:'حَكَمْتوا'},{pronoun:'הם/ן',he:'שלטו',ar:'حَكَموا'},
      ],
      present: [
        {pronoun:'אני',he:'שולט/ת',ar:'بَحْكُم'},{pronoun:'אתה',he:'שולט',ar:'بِتِحْكُم'},{pronoun:'את',he:'שולטת',ar:'بِتِحْكُمي'},
        {pronoun:'הוא',he:'שולט',ar:'بِيِحْكُم'},{pronoun:'היא',he:'שולטת',ar:'بِتِحْكُم'},{pronoun:'אנחנו',he:'שולטים',ar:'بِنِحْكُم'},
        {pronoun:'אתם/ן',he:'שולטים',ar:'بِتِحْكُموا'},{pronoun:'הם/ן',he:'שולטים',ar:'بِيِحْكُموا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'שלוט',ar:'اُحْكُم'},{pronoun:'את',he:'שלטי',ar:'اُحْكُمي'},{pronoun:'אתם/ן',he:'שלטו',ar:'اُحْكُموا'},
      ],
    },
  },
  {
    id: 'saaed', ar: 'ساعَد', arDisplay: 'بْساعِدْنا', root: 'س-ع-د', binyan: 'פִּיעֵל', formNum: 3,
    dialectNote: 'בניין פאעל — הדדי', gloss_he: 'לעזור', gloss_en: 'to help',
    participle: { m: 'مْساعِد', f: 'مْساعْدة', pl: 'مْساعْدين', he: 'עוזר' },
    masdar: { ar: 'مُساعَدة', he: 'עזרה' },
    conj: {
      past: [
        {pronoun:'אני',he:'עזרתי',ar:'ساعَدْت'},{pronoun:'אתה',he:'עזרת',ar:'ساعَدْت'},{pronoun:'את',he:'עזרת',ar:'ساعَدْتي'},
        {pronoun:'הוא',he:'עזר',ar:'ساعَد'},{pronoun:'היא',he:'עזרה',ar:'ساعَدِت'},{pronoun:'אנחנו',he:'עזרנו',ar:'ساعَدْنا'},
        {pronoun:'אתם/ן',he:'עזרתם',ar:'ساعَدْتوا'},{pronoun:'הם/ן',he:'עזרו',ar:'ساعَدوا'},
      ],
      present: [
        {pronoun:'אני',he:'עוזר/ת',ar:'بَساعِد'},{pronoun:'אתה',he:'עוזר',ar:'بِتْساعِد'},{pronoun:'את',he:'עוזרת',ar:'بِتْساعْدي'},
        {pronoun:'הוא',he:'עוזר',ar:'بِيْساعِد'},{pronoun:'היא',he:'עוזרת',ar:'بِتْساعِد'},{pronoun:'אנחנו',he:'עוזרים',ar:'بِنْساعِد',context:'— בנאום: بْساعِدْنا'},
        {pronoun:'אתם/ן',he:'עוזרים',ar:'بِتْساعْدوا',context:'— בנאום: بِتْساعْدونا'},{pronoun:'הם/ן',he:'עוזרים',ar:'بِيْساعْدوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'עזור',ar:'ساعِد'},{pronoun:'את',he:'עזרי',ar:'ساعْدي'},{pronoun:'אתם/ן',he:'עזרו',ar:'ساعْدوا',context:'— בנאום: ساعْدونا'},
      ],
    },
  },
  {
    id: 'kaan', ar: 'كان', arDisplay: 'يْكون', root: 'ك-و-ن', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'גזרת ע״ו — חלול', gloss_he: 'להיות', gloss_en: 'to be',
    participle: null,
    masdar: null,
    conj: {
      past: [
        {pronoun:'אני',he:'הייתי',ar:'كُنْت',context:'— בנאום'},{pronoun:'אתה',he:'היית',ar:'كُنْت'},{pronoun:'את',he:'היית',ar:'كُنْتي'},
        {pronoun:'הוא',he:'היה',ar:'كان'},{pronoun:'היא',he:'הייתה',ar:'كانِت'},{pronoun:'אנחנו',he:'היינו',ar:'كُنّا'},
        {pronoun:'אתם/ן',he:'הייתם',ar:'كُنْتوا'},{pronoun:'הם/ן',he:'היו',ar:'كانوا'},
      ],
      present: [
        {pronoun:'אני',he:'אהיה',ar:'بَكون'},{pronoun:'אתה',he:'תהיה',ar:'بِتْكون'},{pronoun:'את',he:'תהיי',ar:'بِتْكوني'},
        {pronoun:'הוא',he:'יהיה',ar:'بِيْكون'},{pronoun:'היא',he:'תהיה',ar:'بِتْكون',context:'— בנאום: تْكون'},{pronoun:'אנחנו',he:'נהיה',ar:'بِنْكون',context:'— בנאום: نْكون'},
        {pronoun:'אתם/ן',he:'תהיו',ar:'بِتْكونوا'},{pronoun:'הם/ן',he:'יהיו',ar:'بِيْكونوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'היה',ar:'كون'},{pronoun:'את',he:'היי',ar:'كوني'},{pronoun:'אתם/ן',he:'היו',ar:'كونوا'},
      ],
    },
  },
  {
    id: 'bana', ar: 'بَنى', arDisplay: 'نِبْني', root: 'ب-ن-ي', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'גזרת ל״י — נחה', gloss_he: 'לבנות', gloss_en: 'to build',
    participle: { m: 'بانِي', f: 'بانْية', pl: 'بانْيين', he: 'בונה' },
    masdar: { ar: 'بِناء', he: 'בנייה' },
    conj: {
      past: [
        {pronoun:'אני',he:'בניתי',ar:'بَنيت'},{pronoun:'אתה',he:'בנית',ar:'بَنيت'},{pronoun:'את',he:'בנית',ar:'بَنيتي'},
        {pronoun:'הוא',he:'בנה',ar:'بَنى'},{pronoun:'היא',he:'בנתה',ar:'بَنِت'},{pronoun:'אנחנו',he:'בנינו',ar:'بَنينا'},
        {pronoun:'אתם/ן',he:'בניתם',ar:'بَنيتوا'},{pronoun:'הם/ן',he:'בנו',ar:'بَنوا'},
      ],
      present: [
        {pronoun:'אני',he:'בונה',ar:'بَبْني',context:'— בנאום: نِبْني'},{pronoun:'אתה',he:'בונה',ar:'بِتِبْني'},{pronoun:'את',he:'בונה',ar:'بِتِبْني'},
        {pronoun:'הוא',he:'בונה',ar:'بِيِبْني'},{pronoun:'היא',he:'בונה',ar:'بِتِبْني'},{pronoun:'אנחנו',he:'בונים',ar:'بِنِبْني'},
        {pronoun:'אתם/ן',he:'בונים',ar:'بِتِبْنوا'},{pronoun:'הם/ן',he:'בונים',ar:'بِيِبْنوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'בנה',ar:'اِبْني'},{pronoun:'את',he:'בני',ar:'اِبْني'},{pronoun:'אתם/ן',he:'בנו',ar:'اِبْنوا'},
      ],
    },
  },
  {
    id: 'sawwa', ar: 'سَوّى', arDisplay: 'نْسَوّي', root: 'س-و-ي', binyan: 'פִּיעֵל', formNum: 2,
    dialectNote: 'גזרת ל״י — נחה', gloss_he: 'לעשות', gloss_en: 'to do, to make',
    participle: { m: 'مْسَوّي', f: 'مْسَوّية', pl: 'مْسَوّين', he: 'עושה' },
    masdar: null,
    conj: {
      past: [
        {pronoun:'אני',he:'עשיתי',ar:'سَوّيت'},{pronoun:'אתה',he:'עשית',ar:'سَوّيت'},{pronoun:'את',he:'עשית',ar:'سَوّيتي'},
        {pronoun:'הוא',he:'עשה',ar:'سَوّى'},{pronoun:'היא',he:'עשתה',ar:'سَوِّت'},{pronoun:'אנחנו',he:'עשינו',ar:'سَوّينا'},
        {pronoun:'אתם/ן',he:'עשיתם',ar:'سَوّيتوا'},{pronoun:'הם/ן',he:'עשו',ar:'سَوّوا'},
      ],
      present: [
        {pronoun:'אני',he:'עושה',ar:'بَسَوّي'},{pronoun:'אתה',he:'עושה',ar:'بِتْسَوّي'},{pronoun:'את',he:'עושה',ar:'بِتْسَوّي'},
        {pronoun:'הוא',he:'עושה',ar:'بِيْسَوّي'},{pronoun:'היא',he:'עושה',ar:'بِتْسَوّي'},{pronoun:'אנחנו',he:'עושים',ar:'بِنْسَوّي',context:'— בנאום: نْسَوّي'},
        {pronoun:'אתם/ן',he:'עושים',ar:'بِتْسَوّوا'},{pronoun:'הם/ן',he:'עושים',ar:'بِيْسَوّوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'עשה',ar:'سَوّي'},{pronoun:'את',he:'עשי',ar:'سَوّي'},{pronoun:'אתם/ן',he:'עשו',ar:'سَوّوا'},
      ],
    },
  },
  {
    id: 'aash', ar: 'عاش', arDisplay: 'نْعيش', root: 'ع-ي-ش', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'גזרת ע״ו/ע״י — חלול', gloss_he: 'לחיות', gloss_en: 'to live',
    participle: { m: 'عايِش', f: 'عايْشة', pl: 'عايْشين', he: 'חי', context: '— בנאום: عايْشين' },
    masdar: { ar: 'عيشة', he: 'חיים' },
    conj: {
      past: [
        {pronoun:'אני',he:'חייתי',ar:'عِشْت'},{pronoun:'אתה',he:'חיית',ar:'عِشْت'},{pronoun:'את',he:'חיית',ar:'عِشْتي'},
        {pronoun:'הוא',he:'חי',ar:'عاش'},{pronoun:'היא',he:'חיה',ar:'عاشِت'},{pronoun:'אנחנו',he:'חיינו',ar:'عِشْنا'},
        {pronoun:'אתם/ן',he:'חייתם',ar:'عِشْتوا'},{pronoun:'הם/ן',he:'חיו',ar:'عاشوا'},
      ],
      present: [
        {pronoun:'אני',he:'חי/ה',ar:'بَعيش'},{pronoun:'אתה',he:'חי',ar:'بِتْعيش'},{pronoun:'את',he:'חיה',ar:'بِتْعيشي'},
        {pronoun:'הוא',he:'חי',ar:'بِيعيش'},{pronoun:'היא',he:'חיה',ar:'بِتْعيش'},{pronoun:'אנחנו',he:'חיים',ar:'بِنْعيش',context:'— בנאום: نْعيش'},
        {pronoun:'אתם/ן',he:'חיים',ar:'بِتْعيشوا'},{pronoun:'הם/ן',he:'חיים',ar:'بِيعيشوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'חיה',ar:'عيش'},{pronoun:'את',he:'חיי',ar:'عيشي'},{pronoun:'אתם/ן',he:'חיו',ar:'عيشوا'},
      ],
    },
  },
  {
    id: 'laahaq', ar: 'لاحَق', arDisplay: 'يْلاحْقوا', root: 'ل-ح-ق', binyan: 'פִּיעֵל', formNum: 3,
    dialectNote: 'בניין פאעל', gloss_he: 'לרדוף אחרי', gloss_en: 'to pursue, to chase',
    participle: { m: 'مْلاحِق', f: 'مْلاحْقة', pl: 'مْلاحْقين', he: 'רודף אחרי' },
    masdar: { ar: 'مُلاحَقة', he: 'רדיפה' },
    conj: {
      past: [
        {pronoun:'אני',he:'רדפתי',ar:'لاحَقْت'},{pronoun:'אתה',he:'רדפת',ar:'لاحَقْت'},{pronoun:'את',he:'רדפת',ar:'لاحَقْتي'},
        {pronoun:'הוא',he:'רדף',ar:'لاحَق'},{pronoun:'היא',he:'רדפה',ar:'لاحَقِت'},{pronoun:'אנחנו',he:'רדפנו',ar:'لاحَقْنا'},
        {pronoun:'אתם/ן',he:'רדפתם',ar:'لاحَقْتوا'},{pronoun:'הם/ן',he:'רדפו',ar:'لاحَقوا'},
      ],
      present: [
        {pronoun:'אני',he:'רודף/ת',ar:'بَلاحِق'},{pronoun:'אתה',he:'רודף',ar:'بِتْلاحِق'},{pronoun:'את',he:'רודפת',ar:'بِتْلاحْقي'},
        {pronoun:'הוא',he:'רודף',ar:'بِيْلاحِق'},{pronoun:'היא',he:'רודפת',ar:'بِتْلاحِق'},{pronoun:'אנחנו',he:'רודפים',ar:'بِنْلاحِق'},
        {pronoun:'אתם/ן',he:'רודפים',ar:'بِتْلاحْقوا'},{pronoun:'הם/ן',he:'רודפים',ar:'بِيْلاحْقوا',context:'— בנאום: يْلاحْقوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'רדוף',ar:'لاحِق'},{pronoun:'את',he:'רדפי',ar:'لاحْقي'},{pronoun:'אתם/ן',he:'רדפו',ar:'لاحْقوا'},
      ],
    },
  },
  {
    id: 'irif', ar: 'عِرِف', arDisplay: 'تَعْرْفوا', root: 'ع-ر-ف', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'שורש שלם', gloss_he: 'לדעת', gloss_en: 'to know',
    participle: { m: 'عارِف', f: 'عارْفة', pl: 'عارْفين', he: 'יודע' },
    masdar: { ar: 'مَعْرِفة', he: 'ידיעה' },
    conj: {
      past: [
        {pronoun:'אני',he:'ידעתי',ar:'عِرِفْت'},{pronoun:'אתה',he:'ידעת',ar:'عِرِفْت'},{pronoun:'את',he:'ידעת',ar:'عِرِفْتي'},
        {pronoun:'הוא',he:'ידע',ar:'عِرِف'},{pronoun:'היא',he:'ידעה',ar:'عِرْفِت'},{pronoun:'אנחנו',he:'ידענו',ar:'عِرِفْنا'},
        {pronoun:'אתם/ן',he:'ידעתם',ar:'عِرِفْتوا'},{pronoun:'הם/ן',he:'ידעו',ar:'عِرْفوا'},
      ],
      present: [
        {pronoun:'אני',he:'יודע/ת',ar:'بَعْرَف'},{pronoun:'אתה',he:'יודע',ar:'بِتِعْرَف'},{pronoun:'את',he:'יודעת',ar:'بِتِعْرَفي'},
        {pronoun:'הוא',he:'יודע',ar:'بِيِعْرَف'},{pronoun:'היא',he:'יודעת',ar:'بِتِعْرَف'},{pronoun:'אנחנו',he:'יודעים',ar:'بِنِعْرَف'},
        {pronoun:'אתם/ן',he:'יודעים',ar:'بِتِعْرَفوا',context:'— בנאום: تَعْرْفوا'},{pronoun:'הם/ן',he:'יודעים',ar:'بِيِعْرَفوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'דע',ar:'اِعْرَف'},{pronoun:'את',he:'דעי',ar:'اِعْرَفي'},{pronoun:'אתם/ן',he:'דעו',ar:'اِعْرَفوا'},
      ],
    },
  },
  {
    id: 'imil', ar: 'عِمِل', arDisplay: 'بْتِعْمَل', root: 'ع-م-ل', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'שורש שלם', gloss_he: 'לעשות, לעבוד', gloss_en: 'to do, to work',
    participle: { m: 'عامِل', f: 'عامْلة', pl: 'عامْلين', he: 'עושה' },
    masdar: { ar: 'عَمَل', he: 'עבודה, מעשה' },
    conj: {
      past: [
        {pronoun:'אני',he:'עשיתי',ar:'عِمِلْت'},{pronoun:'אתה',he:'עשית',ar:'عِمِلْت'},{pronoun:'את',he:'עשית',ar:'عِمِلْتي'},
        {pronoun:'הוא',he:'עשה',ar:'عِمِل'},{pronoun:'היא',he:'עשתה',ar:'عِمْلِت'},{pronoun:'אנחנו',he:'עשינו',ar:'عِمِلْنا'},
        {pronoun:'אתם/ן',he:'עשיתם',ar:'عِمِلْتوا'},{pronoun:'הם/ן',he:'עשו',ar:'عِمْلوا'},
      ],
      present: [
        {pronoun:'אני',he:'עושה',ar:'بَعْمَل'},{pronoun:'אתה',he:'עושה',ar:'بِتِعْمَل'},{pronoun:'את',he:'עושה',ar:'بِتِعْمَلي'},
        {pronoun:'הוא',he:'עושה',ar:'بِيِعْمَل'},{pronoun:'היא',he:'עושה',ar:'بِتِعْمَل',context:'— בנאום: بْتِعْمَل'},{pronoun:'אנחנו',he:'עושים',ar:'بِنِعْمَل'},
        {pronoun:'אתם/ן',he:'עושים',ar:'بِتِعْمَلوا'},{pronoun:'הם/ן',he:'עושים',ar:'بِيِعْمَلوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'עשה',ar:'اِعْمَل'},{pronoun:'את',he:'עשי',ar:'اِعْمَلي'},{pronoun:'אתם/ן',he:'עשו',ar:'اِعْمَلوا'},
      ],
    },
  },
  {
    id: 'tarazzaq', ar: 'تْرَزَّق', arDisplay: 'يِتْرَزْقوا', root: 'ر-ز-ق', binyan: 'הִתְפַּעֵל', formNum: 5,
    dialectNote: 'בניין תפעל — רפלקסיבי', gloss_he: 'להתפרנס', gloss_en: 'to earn a living',
    participle: { m: 'مِتْرَزِّق', f: 'مِتْرَزْقة', pl: 'مِتْرَزْقين', he: 'מתפרנס' },
    masdar: { ar: 'تَرَزُّق', he: 'פרנסה' },
    conj: {
      past: [
        {pronoun:'אני',he:'התפרנסתי',ar:'تْرَزَّقْت'},{pronoun:'אתה',he:'התפרנסת',ar:'تْرَزَّقْت'},{pronoun:'את',he:'התפרנסת',ar:'تْرَزَّقْتي'},
        {pronoun:'הוא',he:'התפרנס',ar:'تْرَزَّق'},{pronoun:'היא',he:'התפרנסה',ar:'تْرَزَّقِت'},{pronoun:'אנחנו',he:'התפרנסנו',ar:'تْرَزَّقْنا'},
        {pronoun:'אתם/ן',he:'התפרנסתם',ar:'تْرَزَّقْتوا'},{pronoun:'הם/ן',he:'התפרנסו',ar:'تْرَزَّقوا'},
      ],
      present: [
        {pronoun:'אני',he:'מתפרנס/ת',ar:'بَتْرَزَّق'},{pronoun:'אתה',he:'מתפרנס',ar:'بِتِتْرَزَّق'},{pronoun:'את',he:'מתפרנסת',ar:'بِتِتْرَزَّقي'},
        {pronoun:'הוא',he:'מתפרנס',ar:'بِيِتْرَزَّق'},{pronoun:'היא',he:'מתפרנסת',ar:'بِتِتْرَزَّق'},{pronoun:'אנחנו',he:'מתפרנסים',ar:'بِنِتْرَزَّق'},
        {pronoun:'אתם/ן',he:'מתפרנסים',ar:'بِتِتْرَزَّقوا'},{pronoun:'הם/ן',he:'מתפרנסים',ar:'بِيِتْرَزَّقوا',context:'— בנאום: يِتْرَزْقوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'התפרנס',ar:'اِتْرَزَّق'},{pronoun:'את',he:'התפרנסי',ar:'اِتْرَزَّقي'},{pronoun:'אתם/ן',he:'התפרנסו',ar:'اِتْرَزَّقوا'},
      ],
    },
  },
  {
    id: 'haka', ar: 'حَكى', arDisplay: 'بَحْكي', root: 'ح-ك-ي', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'גזרת ל״י — נחה', gloss_he: 'לדבר, לספר', gloss_en: 'to talk, to tell',
    participle: { m: 'حاكي', f: 'حاكْية', pl: 'حاكْيين', he: 'מדבר' },
    masdar: { ar: 'حَكي', he: 'דיבור' },
    conj: {
      past: [
        {pronoun:'אני',he:'דיברתי',ar:'حَكيت'},{pronoun:'אתה',he:'דיברת',ar:'حَكيت'},{pronoun:'את',he:'דיברת',ar:'حَكيتي'},
        {pronoun:'הוא',he:'דיבר',ar:'حَكى'},{pronoun:'היא',he:'דיברה',ar:'حَكِت'},{pronoun:'אנחנו',he:'דיברנו',ar:'حَكينا'},
        {pronoun:'אתם/ן',he:'דיברתם',ar:'حَكيتوا'},{pronoun:'הם/ן',he:'דיברו',ar:'حَكوا'},
      ],
      present: [
        {pronoun:'אני',he:'מדבר/ת',ar:'بَحْكي',context:'— בנאום'},{pronoun:'אתה',he:'מדבר',ar:'بِتِحْكي'},{pronoun:'את',he:'מדברת',ar:'بِتِحْكي'},
        {pronoun:'הוא',he:'מדבר',ar:'بِيِحْكي'},{pronoun:'היא',he:'מדברת',ar:'بِتِحْكي'},{pronoun:'אנחנו',he:'מדברים',ar:'بِنِحْكي'},
        {pronoun:'אתם/ן',he:'מדברים',ar:'بِتِحْكوا',context:'— בנאום: تِحْكوا'},{pronoun:'הם/ן',he:'מדברים',ar:'بِيِحْكوا',context:'— בנאום: يِحْكوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'דבר',ar:'اِحْكي'},{pronoun:'את',he:'דברי',ar:'اِحْكي'},{pronoun:'אתם/ן',he:'דברו',ar:'اِحْكوا'},
      ],
    },
  },
  {
    id: 'qaal', ar: 'قال', arDisplay: 'قُلْت', root: 'ق-و-ل', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'גזרת ע״ו — חלול', gloss_he: 'לומר', gloss_en: 'to say',
    participle: { m: 'قايِل', f: 'قايْلة', pl: 'قايْلين', he: 'אומר (פחות שכיח)' },
    masdar: { ar: 'قَول', he: 'אמירה' },
    conj: {
      past: [
        {pronoun:'אני',he:'אמרתי',ar:'قُلْت',context:'— בנאום'},{pronoun:'אתה',he:'אמרת',ar:'قُلْت'},{pronoun:'את',he:'אמרת',ar:'قُلْتي'},
        {pronoun:'הוא',he:'אמר',ar:'قال',context:'— בנאום'},{pronoun:'היא',he:'אמרה',ar:'قالِت'},{pronoun:'אנחנו',he:'אמרנו',ar:'قُلْنا'},
        {pronoun:'אתם/ן',he:'אמרתם',ar:'قُلْتوا'},{pronoun:'הם/ן',he:'אמרו',ar:'قالوا'},
      ],
      present: [
        {pronoun:'אני',he:'אומר/ת',ar:'بَقول'},{pronoun:'אתה',he:'אומר',ar:'بِتْقول'},{pronoun:'את',he:'אומרת',ar:'بِتْقولي'},
        {pronoun:'הוא',he:'אומר',ar:'بِيْقول',context:'— בנאום: ويْقول'},{pronoun:'היא',he:'אומרת',ar:'بِتْقول'},{pronoun:'אנחנו',he:'אומרים',ar:'بِنْقول'},
        {pronoun:'אתם/ן',he:'אומרים',ar:'بِتْقولوا',context:'— בנאום: تْقولوا'},{pronoun:'הם/ן',he:'אומרים',ar:'بِيْقولوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'אמור',ar:'قول'},{pronoun:'את',he:'אמרי',ar:'قولي'},{pronoun:'אתם/ן',he:'אמרו',ar:'قولوا'},
      ],
    },
  },
  {
    id: 'fishil', ar: 'فِشِل', arDisplay: 'فِشِل', root: 'ف-ش-ل', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'שורש שלם', gloss_he: 'להיכשל', gloss_en: 'to fail',
    participle: { m: 'فاشِل', f: 'فاشْلة', pl: 'فاشْلين', he: 'כישלון / נכשל' },
    masdar: { ar: 'فَشَل', he: 'כישלון' },
    conj: {
      past: [
        {pronoun:'אני',he:'נכשלתי',ar:'فِشِلْت',context:'— בנאום'},{pronoun:'אתה',he:'נכשלת',ar:'فِشِلْت'},{pronoun:'את',he:'נכשלת',ar:'فِشِلْتي'},
        {pronoun:'הוא',he:'נכשל',ar:'فِشِل',context:'— בנאום'},{pronoun:'היא',he:'נכשלה',ar:'فِشْلِت'},{pronoun:'אנחנו',he:'נכשלנו',ar:'فِشِلْنا'},
        {pronoun:'אתם/ן',he:'נכשלתם',ar:'فِشِلْتوا'},{pronoun:'הם/ן',he:'נכשלו',ar:'فِشْلوا'},
      ],
      present: [
        {pronoun:'אני',he:'נכשל/ת',ar:'بَفْشَل'},{pronoun:'אתה',he:'נכשל',ar:'بِتِفْشَل'},{pronoun:'את',he:'נכשלת',ar:'بِتِفْشَلي'},
        {pronoun:'הוא',he:'נכשל',ar:'بِيِفْشَل',context:'— בנאום: بِيفْشَل'},{pronoun:'היא',he:'נכשלת',ar:'بِتِفْشَل'},{pronoun:'אנחנו',he:'נכשלים',ar:'بِنِفْشَل'},
        {pronoun:'אתם/ן',he:'נכשלים',ar:'بِتِفْشَلوا'},{pronoun:'הם/ן',he:'נכשלים',ar:'بِيِفْشَلوا'},
      ],
      imperative: [ {pronoun:'(נדיר)',he:'—',ar:'—'} ],
    },
  },
  {
    id: 'istaha', ar: 'اِسْتَحى', arDisplay: 'يِسْتَحي', root: 'ح-ي-ي', binyan: 'הִתְפַּעֵל', formNum: 10,
    dialectNote: 'בניין הסתפעל — גזרת ל״י', gloss_he: 'להתבייש', gloss_en: 'to feel ashamed',
    participle: { m: 'مِسْتَحي', f: 'مِسْتَحْية', pl: 'مِسْتَحْيين', he: 'מתבייש' },
    masdar: { ar: 'اِسْتِحاء', he: 'בושה' },
    conj: {
      past: [
        {pronoun:'אני',he:'התביישתי',ar:'اِسْتَحيت'},{pronoun:'אתה',he:'התביישת',ar:'اِسْتَحيت'},{pronoun:'את',he:'התביישת',ar:'اِسْتَحيتي'},
        {pronoun:'הוא',he:'התבייש',ar:'اِسْتَحى'},{pronoun:'היא',he:'התביישה',ar:'اِسْتَحِت'},{pronoun:'אנחנו',he:'התביישנו',ar:'اِسْتَحينا'},
        {pronoun:'אתם/ן',he:'התביישתם',ar:'اِسْتَحيتوا'},{pronoun:'הם/ן',he:'התביישו',ar:'اِسْتَحوا'},
      ],
      present: [
        {pronoun:'אני',he:'מתבייש/ת',ar:'بَسْتَحي'},{pronoun:'אתה',he:'מתבייש',ar:'بِتِسْتَحي'},{pronoun:'את',he:'מתביישת',ar:'بِتِسْتَحي'},
        {pronoun:'הוא',he:'מתבייש',ar:'بِيِسْتَحي',context:'— בנאום'},{pronoun:'היא',he:'מתביישת',ar:'بِتِسْتَحي'},{pronoun:'אנחנו',he:'מתביישים',ar:'بِنِسْتَحي'},
        {pronoun:'אתם/ן',he:'מתביישים',ar:'بِتِسْتَحوا'},{pronoun:'הם/ן',he:'מתביישים',ar:'بِيِسْتَحوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'התבייש',ar:'اِسْتَحي'},{pronoun:'את',he:'התביישי',ar:'اِسْتَحي'},{pronoun:'אתם/ן',he:'התביישו',ar:'اِسْتَحوا'},
      ],
    },
  },
  {
    id: 'raah', ar: 'راح', arDisplay: 'بَروح', root: 'ر-و-ح', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'גזרת ע״ו — חלול; משמש גם כמילת עתיד', gloss_he: 'ללכת', gloss_en: 'to go',
    participle: { m: 'رايِح', f: 'رايْحة', pl: 'رايْحين', he: 'הולך', context: '— בנאום: رايِح / رايْحين' },
    masdar: { ar: 'رَواح', he: 'הליכה' },
    conj: {
      past: [
        {pronoun:'אני',he:'הלכתי',ar:'رِحْت'},{pronoun:'אתה',he:'הלכת',ar:'رِحْت'},{pronoun:'את',he:'הלכת',ar:'رِحْتي'},
        {pronoun:'הוא',he:'הלך',ar:'راح'},{pronoun:'היא',he:'הלכה',ar:'راحِت'},{pronoun:'אנחנו',he:'הלכנו',ar:'رِحْنا'},
        {pronoun:'אתם/ן',he:'הלכתם',ar:'رِحْتوا'},{pronoun:'הם/ן',he:'הלכו',ar:'راحوا',context:'— בנאום: راحوا'},
      ],
      present: [
        {pronoun:'אני',he:'הולך/ת',ar:'بَروح',context:'— בנאום'},{pronoun:'אתה',he:'הולך',ar:'بِتْروح'},{pronoun:'את',he:'הולכת',ar:'بِتْروحي'},
        {pronoun:'הוא',he:'הולך',ar:'بِيْروح'},{pronoun:'היא',he:'הולכת',ar:'بِتْروح'},{pronoun:'אנחנו',he:'הולכים',ar:'بِنْروح'},
        {pronoun:'אתם/ן',he:'הולכים',ar:'بِتْروحوا'},{pronoun:'הם/ן',he:'הולכים',ar:'بِيْروحوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'לך',ar:'روح'},{pronoun:'את',he:'לכי',ar:'روحي'},{pronoun:'אתם/ן',he:'לכו',ar:'روحوا'},
      ],
    },
  },
  {
    id: 'naqash', ar: 'نَقَش', arDisplay: 'نَقَشْناها', root: 'ن-ق-ش', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'שורש שלם — כאן במשמעות מושאלת: "לתכנן/לשרטט" (במקור: לחרוט)', gloss_he: 'לתכנן, לשרטט', gloss_en: 'to map out, to outline',
    participle: { m: 'ناقِش', f: 'ناقْشة', pl: 'ناقْشين', he: 'מתכנן' },
    masdar: { ar: 'نَقْش', he: 'תכנון / חריטה' },
    conj: {
      past: [
        {pronoun:'אני',he:'תכננתי',ar:'نَقَشْت'},{pronoun:'אתה',he:'תכננת',ar:'نَقَشْت'},{pronoun:'את',he:'תכננת',ar:'نَقَشْتي'},
        {pronoun:'הוא',he:'תכנן',ar:'نَقَش'},{pronoun:'היא',he:'תכננה',ar:'نَقَشِت'},{pronoun:'אנחנו',he:'תכננו',ar:'نَقَشْنا',context:'— בנאום: نَقَشْناها'},
        {pronoun:'אתם/ן',he:'תכננתם',ar:'نَقَشْتوا'},{pronoun:'הם/ן',he:'תכננו',ar:'نَقَشوا'},
      ],
      present: [
        {pronoun:'אני',he:'מתכנן/ת',ar:'بَنْقُش'},{pronoun:'אתה',he:'מתכנן',ar:'بِتِنْقُش'},{pronoun:'את',he:'מתכננת',ar:'بِتِنْقُشي'},
        {pronoun:'הוא',he:'מתכנן',ar:'بِيِنْقُش'},{pronoun:'היא',he:'מתכננת',ar:'بِتِنْقُش'},{pronoun:'אנחנו',he:'מתכננים',ar:'بِنِنْقُش'},
        {pronoun:'אתם/ן',he:'מתכננים',ar:'بِتِنْقُشوا'},{pronoun:'הם/ן',he:'מתכננים',ar:'بِيِنْقُشوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'תכנן',ar:'اُنْقُش'},{pronoun:'את',he:'תכנני',ar:'اُنْقُشي'},{pronoun:'אתם/ן',he:'תכננו',ar:'اُنْقُشوا'},
      ],
    },
  },
  {
    id: 'tili', ar: 'طِلِع', arDisplay: 'تِطْلَعوا', root: 'ط-ل-ع', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'שורש שלם', gloss_he: 'לצאת', gloss_en: 'to go out, to come out',
    participle: { m: 'طالِع', f: 'طالْعة', pl: 'طالْعين', he: 'יוצא' },
    masdar: { ar: 'طُلوع', he: 'יציאה' },
    conj: {
      past: [
        {pronoun:'אני',he:'יצאתי',ar:'طِلِعْت'},{pronoun:'אתה',he:'יצאת',ar:'طِلِعْت'},{pronoun:'את',he:'יצאת',ar:'طِلِعْتي'},
        {pronoun:'הוא',he:'יצא',ar:'طِلِع'},{pronoun:'היא',he:'יצאה',ar:'طِلْعِت'},{pronoun:'אנחנו',he:'יצאנו',ar:'طِلِعْنا'},
        {pronoun:'אתם/ן',he:'יצאתם',ar:'طِلِعْتوا'},{pronoun:'הם/ן',he:'יצאו',ar:'طِلْعوا'},
      ],
      present: [
        {pronoun:'אני',he:'יוצא/ת',ar:'بَطْلَع'},{pronoun:'אתה',he:'יוצא',ar:'بِتِطْلَع'},{pronoun:'את',he:'יוצאת',ar:'بِتِطْلَعي',context:'— בנאום: تِطْلَعوا'},
        {pronoun:'הוא',he:'יוצא',ar:'بِيِطْلَع'},{pronoun:'היא',he:'יוצאת',ar:'بِتِطْلَع'},{pronoun:'אנחנו',he:'יוצאים',ar:'بِنِطْلَع'},
        {pronoun:'אתם/ן',he:'יוצאים',ar:'بِتِطْلَعوا'},{pronoun:'הם/ן',he:'יוצאים',ar:'بِيِطْلَعوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'צא',ar:'اِطْلَع'},{pronoun:'את',he:'צאי',ar:'اِطْلَعي'},{pronoun:'אתם/ן',he:'צאו',ar:'اِطْلَعوا'},
      ],
    },
  },
  {
    id: 'tallaa', ar: 'طَلَّع', arDisplay: 'نْطَلِّع', root: 'ط-ل-ع', binyan: 'פִּיעֵל', formNum: 2,
    dialectNote: 'צורת גרימה (Form II) של طلع — "להוציא"', gloss_he: 'להוציא, לפרסם', gloss_en: 'to bring out, to put out (e.g. a petition)',
    participle: { m: 'مْطَلِّع', f: 'مْطَلِّعة', pl: 'مْطَلِّعين', he: 'מוציא' },
    masdar: { ar: 'تَطْليع', he: 'הוצאה' },
    conj: {
      past: [
        {pronoun:'אני',he:'הוצאתי',ar:'طَلَّعْت'},{pronoun:'אתה',he:'הוצאת',ar:'طَلَّعْت'},{pronoun:'את',he:'הוצאת',ar:'طَلَّعْتي'},
        {pronoun:'הוא',he:'הוציא',ar:'طَلَّع'},{pronoun:'היא',he:'הוציאה',ar:'طَلَّعِت'},{pronoun:'אנחנו',he:'הוצאנו',ar:'طَلَّعْنا'},
        {pronoun:'אתם/ן',he:'הוצאתם',ar:'طَلَّعْتوا'},{pronoun:'הם/ן',he:'הוציאו',ar:'طَلَّعوا'},
      ],
      present: [
        {pronoun:'אני',he:'מוציא/ה',ar:'بَطَلِّع'},{pronoun:'אתה',he:'מוציא',ar:'بِتْطَلِّع'},{pronoun:'את',he:'מוציאה',ar:'بِتْطَلِّعي'},
        {pronoun:'הוא',he:'מוציא',ar:'بِيْطَلِّع'},{pronoun:'היא',he:'מוציאה',ar:'بِتْطَلِّع'},{pronoun:'אנחנו',he:'מוציאים',ar:'بِنْطَلِّع',context:'— בנאום: نْطَلِّع'},
        {pronoun:'אתם/ן',he:'מוציאים',ar:'بِتْطَلِّعوا'},{pronoun:'הם/ן',he:'מוציאים',ar:'بِيْطَلِّعوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'הוצא',ar:'طَلِّع'},{pronoun:'את',he:'הוציאי',ar:'طَلِّعي'},{pronoun:'אתם/ן',he:'הוציאו',ar:'طَلِّعوا'},
      ],
    },
  },
  {
    id: 'wisil', ar: 'وِصِل', arDisplay: 'وِصِلْنا', root: 'و-ص-ل', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'גזרת פ״ו — עיצור ראשון נחלש בהווה', gloss_he: 'להגיע', gloss_en: 'to arrive',
    participle: { m: 'واصِل', f: 'واصْلة', pl: 'واصْلين', he: 'מגיע' },
    masdar: { ar: 'وُصول', he: 'הגעה' },
    conj: {
      past: [
        {pronoun:'אני',he:'הגעתי',ar:'وِصِلْت'},{pronoun:'אתה',he:'הגעת',ar:'وِصِلْت'},{pronoun:'את',he:'הגעת',ar:'وِصِلْتي'},
        {pronoun:'הוא',he:'הגיע',ar:'وِصِل'},{pronoun:'היא',he:'הגיעה',ar:'وِصْلِت'},{pronoun:'אנחנו',he:'הגענו',ar:'وِصِلْنا',context:'— בנאום'},
        {pronoun:'אתם/ן',he:'הגעתם',ar:'وِصِلْتوا'},{pronoun:'הם/ן',he:'הגיעו',ar:'وِصْلوا'},
      ],
      present: [
        {pronoun:'אני',he:'מגיע/ה',ar:'بَوْصَل'},{pronoun:'אתה',he:'מגיע',ar:'بِتوْصَل'},{pronoun:'את',he:'מגיעה',ar:'بِتوْصَلي'},
        {pronoun:'הוא',he:'מגיע',ar:'بِيوْصَل'},{pronoun:'היא',he:'מגיעה',ar:'بِتوْصَل',context:'— בנאום: توصَلْها'},{pronoun:'אנחנו',he:'מגיעים',ar:'بِنوْصَل'},
        {pronoun:'אתם/ן',he:'מגיעים',ar:'بِتوْصَلوا'},{pronoun:'הם/ן',he:'מגיעים',ar:'بِيوْصَلوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'הגע',ar:'اِوْصَل'},{pronoun:'את',he:'הגיעי',ar:'اِوْصَلي'},{pronoun:'אתם/ן',he:'הגיעו',ar:'اِوْصَلوا'},
      ],
    },
  },
  {
    id: 'wassal', ar: 'وَصَّل', arDisplay: 'نْوَصِّلْها', root: 'و-ص-ل', binyan: 'פִּיעֵל', formNum: 2,
    dialectNote: 'צורת גרימה (Form II) של وصل — "להעביר"', gloss_he: 'להעביר, למסור', gloss_en: 'to deliver, to convey',
    participle: { m: 'مْوَصِّل', f: 'مْوَصِّلة', pl: 'مْوَصِّلين', he: 'מעביר' },
    masdar: { ar: 'تَوْصيل', he: 'מסירה' },
    conj: {
      past: [
        {pronoun:'אני',he:'העברתי',ar:'وَصَّلْت'},{pronoun:'אתה',he:'העברת',ar:'وَصَّلْت'},{pronoun:'את',he:'העברת',ar:'وَصَّلْتي'},
        {pronoun:'הוא',he:'העביר',ar:'وَصَّل'},{pronoun:'היא',he:'העבירה',ar:'وَصَّلِت'},{pronoun:'אנחנו',he:'העברנו',ar:'وَصَّلْنا'},
        {pronoun:'אתם/ן',he:'העברתם',ar:'وَصَّلْتوا'},{pronoun:'הם/ן',he:'העבירו',ar:'وَصَّلوا'},
      ],
      present: [
        {pronoun:'אני',he:'מעביר/ה',ar:'بَوَصِّل'},{pronoun:'אתה',he:'מעביר',ar:'بِتْوَصِّل'},{pronoun:'את',he:'מעבירה',ar:'بِتْوَصِّلي'},
        {pronoun:'הוא',he:'מעביר',ar:'بِيْوَصِّل'},{pronoun:'היא',he:'מעבירה',ar:'بِتْوَصِّل'},{pronoun:'אנחנו',he:'מעבירים',ar:'بِنْوَصِّل',context:'— בנאום: نْوَصِّلْها'},
        {pronoun:'אתם/ן',he:'מעבירים',ar:'بِتْوَصِّلوا'},{pronoun:'הם/ן',he:'מעבירים',ar:'بِيْوَصِّلوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'העבר',ar:'وَصِّل'},{pronoun:'את',he:'העבירי',ar:'وَصِّلي'},{pronoun:'אתם/ן',he:'העבירו',ar:'وَصِّلوا'},
      ],
    },
  },
  {
    id: 'marr', ar: 'مَرّ', arDisplay: 'بِتْمُرّ', root: 'م-ر-ر', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'פועל כפול', gloss_he: 'לעבור (על זמן)', gloss_en: 'to pass (of time)',
    participle: { m: 'مارّ', f: 'مارّة', pl: 'مارّين', he: 'עובר' },
    masdar: { ar: 'مُرور', he: 'מעבר' },
    conj: {
      past: [
        {pronoun:'אני',he:'עברתי',ar:'مَرّيت'},{pronoun:'אתה',he:'עברת',ar:'مَرّيت'},{pronoun:'את',he:'עברת',ar:'مَرّيتي'},
        {pronoun:'הוא',he:'עבר',ar:'مَرّ'},{pronoun:'היא',he:'עברה',ar:'مَرِّت'},{pronoun:'אנחנו',he:'עברנו',ar:'مَرّينا'},
        {pronoun:'אתם/ן',he:'עברתם',ar:'مَرّيتوا'},{pronoun:'הם/ן',he:'עברו',ar:'مَرّوا'},
      ],
      present: [
        {pronoun:'אני',he:'עובר/ת',ar:'بَمُرّ'},{pronoun:'אתה',he:'עובר',ar:'بِتْمُرّ',context:'— בנאום'},{pronoun:'את',he:'עוברת',ar:'بِتْمُرّي'},
        {pronoun:'הוא',he:'עובר',ar:'بِيْمُرّ'},{pronoun:'היא',he:'עוברת',ar:'بِتْمُرّ'},{pronoun:'אנחנו',he:'עוברים',ar:'بِنْمُرّ'},
        {pronoun:'אתם/ן',he:'עוברים',ar:'بِتْمُرّوا'},{pronoun:'הם/ן',he:'עוברים',ar:'بِيْمُرّوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'עבור',ar:'مُرّ'},{pronoun:'את',he:'עברי',ar:'مُرّي'},{pronoun:'אתם/ן',he:'עברו',ar:'مُرّوا'},
      ],
    },
  },
  {
    id: 'maraq', ar: 'مَرَق', arDisplay: 'بِمْرُق', root: 'م-ر-ق', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'שורש שלם — ניב פלסטיני: "לעבור על / לקרות ל-"', gloss_he: 'לעבור על, לקרות ל-', gloss_en: 'to happen to, to go through (dialect-specific)',
    participle: { m: 'مارِق', f: 'مارْقة', pl: 'مارْقين', he: 'עובר על' },
    masdar: { ar: 'مُروق', he: null },
    conj: {
      past: [
        {pronoun:'אני',he:'עברתי על',ar:'مَرَقْت'},{pronoun:'אתה',he:'עברת על',ar:'مَرَقْت'},{pronoun:'את',he:'עברת על',ar:'مَرَقْتي'},
        {pronoun:'הוא',he:'עבר על',ar:'مَرَق'},{pronoun:'היא',he:'עברה על',ar:'مَرْقِت'},{pronoun:'אנחנו',he:'עברנו על',ar:'مَرَقْنا'},
        {pronoun:'אתם/ן',he:'עברתם על',ar:'مَرَقْتوا'},{pronoun:'הם/ן',he:'עברו על',ar:'مَرْقوا'},
      ],
      present: [
        {pronoun:'אני',he:'עובר על',ar:'بَمْرُق'},{pronoun:'אתה',he:'עובר על',ar:'بِتِمْرُق'},{pronoun:'את',he:'עוברת על',ar:'بِتِمْرُقي'},
        {pronoun:'הוא',he:'עובר על',ar:'بِيِمْرُق',context:'— בנאום'},{pronoun:'היא',he:'עוברת על',ar:'بِتِمْرُق'},{pronoun:'אנחנו',he:'עוברים על',ar:'بِنِمْرُق'},
        {pronoun:'אתם/ן',he:'עוברים על',ar:'بِتِمْرُقوا'},{pronoun:'הם/ן',he:'עוברים על',ar:'بِيِمْرُقوا'},
      ],
      imperative: [ {pronoun:'(נדיר)',he:'—',ar:'—'} ],
    },
  },
  {
    id: 'fiqid', ar: 'فِقِد', arDisplay: 'فَقَدوا', root: 'ف-ق-د', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'שורש שלם', gloss_he: 'לאבד', gloss_en: 'to lose (a person)',
    participle: { m: 'فاقِد', f: 'فاقْدة', pl: 'فاقْدين', he: 'מאבד / שכול' },
    masdar: { ar: 'فُقْدان', he: 'אובדן' },
    conj: {
      past: [
        {pronoun:'אני',he:'איבדתי',ar:'فِقِدْت'},{pronoun:'אתה',he:'איבדת',ar:'فِقِدْت'},{pronoun:'את',he:'איבדת',ar:'فِقِدْتي'},
        {pronoun:'הוא',he:'איבד',ar:'فِقِد'},{pronoun:'היא',he:'איבדה',ar:'فِقْدِت'},{pronoun:'אנחנו',he:'איבדנו',ar:'فِقِدْنا'},
        {pronoun:'אתם/ן',he:'איבדתם',ar:'فِقِدْتوا'},{pronoun:'הם/ן',he:'איבדו',ar:'فِقْدوا',context:'— בנאום: فَقَدوا'},
      ],
      present: [
        {pronoun:'אני',he:'מאבד/ת',ar:'بَفْقِد'},{pronoun:'אתה',he:'מאבד',ar:'بِتِفْقِد'},{pronoun:'את',he:'מאבדת',ar:'بِتِفْقِدي'},
        {pronoun:'הוא',he:'מאבד',ar:'بِيِفْقِد'},{pronoun:'היא',he:'מאבדת',ar:'بِتِفْقِد'},{pronoun:'אנחנו',he:'מאבדים',ar:'بِنِفْقِد'},
        {pronoun:'אתם/ן',he:'מאבדים',ar:'بِتِفْقِدوا'},{pronoun:'הם/ן',he:'מאבדים',ar:'بِيِفْقِدوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'אבד',ar:'اِفْقِد'},{pronoun:'את',he:'אבדי',ar:'اِفْقِدي'},{pronoun:'אתם/ן',he:'אבדו',ar:'اِفْقِدوا'},
      ],
    },
  },
  {
    id: 'qarrar', ar: 'قَرَّر', arDisplay: 'قَرَّرْنا', root: 'ق-ر-ر', binyan: 'פִּיעֵל', formNum: 2,
    dialectNote: 'שורש שלם', gloss_he: 'להחליט', gloss_en: 'to decide',
    participle: { m: 'مْقَرِّر', f: 'مْقَرِّرة', pl: 'مْقَرِّرين', he: 'מחליט' },
    masdar: { ar: 'قَرار', he: 'החלטה' },
    conj: {
      past: [
        {pronoun:'אני',he:'החלטתי',ar:'قَرَّرْت'},{pronoun:'אתה',he:'החלטת',ar:'قَرَّرْت'},{pronoun:'את',he:'החלטת',ar:'قَرَّرْتي'},
        {pronoun:'הוא',he:'החליט',ar:'قَرَّر'},{pronoun:'היא',he:'החליטה',ar:'قَرَّرِت'},{pronoun:'אנחנו',he:'החלטנו',ar:'قَرَّرْنا',context:'— בנאום'},
        {pronoun:'אתם/ן',he:'החלטתם',ar:'قَرَّرْتوا'},{pronoun:'הם/ן',he:'החליטו',ar:'قَرَّروا'},
      ],
      present: [
        {pronoun:'אני',he:'מחליט/ה',ar:'بَقَرِّر'},{pronoun:'אתה',he:'מחליט',ar:'بِتْقَرِّر'},{pronoun:'את',he:'מחליטה',ar:'بِتْقَرِّري'},
        {pronoun:'הוא',he:'מחליט',ar:'بِيْقَرِّر'},{pronoun:'היא',he:'מחליטה',ar:'بِتْقَرِّر'},{pronoun:'אנחנו',he:'מחליטים',ar:'بِنْقَرِّر'},
        {pronoun:'אתם/ן',he:'מחליטים',ar:'بِتْقَرِّروا'},{pronoun:'הם/ן',he:'מחליטים',ar:'بِيْقَرِّروا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'החלט',ar:'قَرِّر'},{pronoun:'את',he:'החליטי',ar:'قَرِّري'},{pronoun:'אתם/ן',he:'החליטו',ar:'قَرِّروا'},
      ],
    },
  },
  {
    id: 'nasab', ar: 'نَصَب', arDisplay: 'نْنُصُب', root: 'ن-ص-ب', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'שורש שלם', gloss_he: 'להקים', gloss_en: 'to set up, to erect',
    participle: { m: 'ناصِب', f: 'ناصْبة', pl: 'ناصْبين', he: 'מקים' },
    masdar: { ar: 'نَصْب', he: 'הקמה' },
    conj: {
      past: [
        {pronoun:'אני',he:'הקמתי',ar:'نَصَبْت'},{pronoun:'אתה',he:'הקמת',ar:'نَصَبْت'},{pronoun:'את',he:'הקמת',ar:'نَصَبْتي'},
        {pronoun:'הוא',he:'הקים',ar:'نَصَب'},{pronoun:'היא',he:'הקימה',ar:'نَصَبِت'},{pronoun:'אנחנו',he:'הקמנו',ar:'نَصَبْنا'},
        {pronoun:'אתם/ן',he:'הקמתם',ar:'نَصَبْتوا'},{pronoun:'הם/ן',he:'הקימו',ar:'نَصَبوا'},
      ],
      present: [
        {pronoun:'אני',he:'מקים/ה',ar:'بَنْصُب'},{pronoun:'אתה',he:'מקים',ar:'بِتِنْصُب'},{pronoun:'את',he:'מקימה',ar:'بِتِنْصُبي'},
        {pronoun:'הוא',he:'מקים',ar:'بِيِنْصُب'},{pronoun:'היא',he:'מקימה',ar:'بِتِنْصُب'},{pronoun:'אנחנו',he:'מקימים',ar:'بِنِنْصُب',context:'— בנאום: نْنُصُب'},
        {pronoun:'אתם/ן',he:'מקימים',ar:'بِتِنْصُبوا'},{pronoun:'הם/ן',he:'מקימים',ar:'بِيِنْصُبوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'הקם',ar:'اُنْصُب'},{pronoun:'את',he:'הקימי',ar:'اُنْصُبي'},{pronoun:'אתם/ן',he:'הקימו',ar:'اُنْصُبوا'},
      ],
    },
  },
  {
    id: 'shaaf', ar: 'شاف', arDisplay: 'يْشوفوا', root: 'ش-و-ف', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'גזרת ע״ו — חלול; ייחודי לניב, לא ב-MSA', gloss_he: 'לראות', gloss_en: 'to see',
    participle: { m: 'شايِف', f: 'شايْفة', pl: 'شايْفين', he: 'רואה', context: '— בנאום: شايْفين' },
    masdar: null,
    conj: {
      past: [
        {pronoun:'אני',he:'ראיתי',ar:'شِفْت'},{pronoun:'אתה',he:'ראית',ar:'شِفْت'},{pronoun:'את',he:'ראית',ar:'شِفْتي'},
        {pronoun:'הוא',he:'ראה',ar:'شاف'},{pronoun:'היא',he:'ראתה',ar:'شافِت'},{pronoun:'אנחנו',he:'ראינו',ar:'شِفْنا'},
        {pronoun:'אתם/ן',he:'ראיתם',ar:'شِفْتوا'},{pronoun:'הם/ן',he:'ראו',ar:'شافوا'},
      ],
      present: [
        {pronoun:'אני',he:'רואה',ar:'بَشوف'},{pronoun:'אתה',he:'רואה',ar:'بِتْشوف'},{pronoun:'את',he:'רואה',ar:'بِتْشوفي',context:'— בנאום: بِتْشوفوا'},
        {pronoun:'הוא',he:'רואה',ar:'بِيشوف'},{pronoun:'היא',he:'רואה',ar:'بِتْشوف'},{pronoun:'אנחנו',he:'רואים',ar:'بِنْشوف'},
        {pronoun:'אתם/ן',he:'רואים',ar:'بِتْشوفوا'},{pronoun:'הם/ן',he:'רואים',ar:'بِيشوفوا',context:'— בנאום: يْشوفوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'ראה',ar:'شوف'},{pronoun:'את',he:'ראי',ar:'شوفي'},{pronoun:'אתם/ן',he:'ראו',ar:'شوفوا'},
      ],
    },
  },
  {
    id: 'tawajjah', ar: 'تْوَجَّه', arDisplay: 'بَتْوَجَّه', root: 'و-ج-ه', binyan: 'הִתְפַּעֵל', formNum: 5,
    dialectNote: 'בניין תفعّل', gloss_he: 'לפנות אל', gloss_en: 'to address, to turn to',
    participle: { m: 'مِتْوَجِّه', f: 'مِتْوَجِّهة', pl: 'مِتْوَجِّهين', he: 'פונה' },
    masdar: { ar: 'تَوَجُّه', he: 'פנייה' },
    conj: {
      past: [
        {pronoun:'אני',he:'פניתי',ar:'تْوَجَّهْت'},{pronoun:'אתה',he:'פנית',ar:'تْوَجَّهْت'},{pronoun:'את',he:'פנית',ar:'تْوَجَّهْتي'},
        {pronoun:'הוא',he:'פנה',ar:'تْوَجَّه'},{pronoun:'היא',he:'פנתה',ar:'تْوَجَّهِت'},{pronoun:'אנחנו',he:'פנינו',ar:'تْوَجَّهْنا'},
        {pronoun:'אתם/ן',he:'פניתם',ar:'تْوَجَّهْتوا'},{pronoun:'הם/ן',he:'פנו',ar:'تْوَجَّهوا'},
      ],
      present: [
        {pronoun:'אני',he:'פונה',ar:'بَتْوَجَّه',context:'— בנאום'},{pronoun:'אתה',he:'פונה',ar:'بِتِتْوَجَّه'},{pronoun:'את',he:'פונה',ar:'بِتِتْوَجَّهي'},
        {pronoun:'הוא',he:'פונה',ar:'بِيِتْوَجَّه'},{pronoun:'היא',he:'פונה',ar:'بِتِتْوَجَّه'},{pronoun:'אנחנו',he:'פונים',ar:'بِنِتْوَجَّه'},
        {pronoun:'אתם/ן',he:'פונים',ar:'بِتِتْوَجَّهوا'},{pronoun:'הם/ן',he:'פונים',ar:'بِيِتْوَجَّهوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'פנה',ar:'اِتْوَجَّه'},{pronoun:'את',he:'פני',ar:'اِتْوَجَّهي'},{pronoun:'אתם/ן',he:'פנו',ar:'اِتْوَجَّهوا'},
      ],
    },
  },
  {
    id: 'laff', ar: 'لَفّ', arDisplay: 'نْلِفّ', root: 'ل-ف-ف', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'פועל כפול', gloss_he: 'להסתובב (ללא כיוון ברור)', gloss_en: 'to circle, to wander around',
    participle: { m: 'لافّ', f: 'لافّة', pl: 'لافّين', he: 'מסתובב' },
    masdar: { ar: 'لَفّ', he: 'הסתובבות' },
    conj: {
      past: [
        {pronoun:'אני',he:'הסתובבתי',ar:'لَفّيت'},{pronoun:'אתה',he:'הסתובבת',ar:'لَفّيت'},{pronoun:'את',he:'הסתובבת',ar:'لَفّيتي'},
        {pronoun:'הוא',he:'הסתובב',ar:'لَفّ'},{pronoun:'היא',he:'הסתובבה',ar:'لَفِّت'},{pronoun:'אנחנו',he:'הסתובבנו',ar:'لَفّينا'},
        {pronoun:'אתם/ן',he:'הסתובבתם',ar:'لَفّيتوا'},{pronoun:'הם/ן',he:'הסתובבו',ar:'لَفّوا'},
      ],
      present: [
        {pronoun:'אני',he:'מסתובב/ת',ar:'بَلِفّ'},{pronoun:'אתה',he:'מסתובב',ar:'بِتِلِفّ'},{pronoun:'את',he:'מסתובבת',ar:'بِتِلِفّي'},
        {pronoun:'הוא',he:'מסתובב',ar:'بِيِلِفّ'},{pronoun:'היא',he:'מסתובבת',ar:'بِتِلِفّ'},{pronoun:'אנחנו',he:'מסתובבים',ar:'بِنِلِفّ',context:'— בנאום: نْلِفّ'},
        {pronoun:'אתם/ן',he:'מסתובבים',ar:'بِتِلِفّوا'},{pronoun:'הם/ן',he:'מסתובבים',ar:'بِيِلِفّوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'הסתובב',ar:'لِفّ'},{pronoun:'את',he:'הסתובבי',ar:'لِفّي'},{pronoun:'אתם/ן',he:'הסתובבו',ar:'لِفّوا'},
      ],
    },
  },
  {
    id: 'daar', ar: 'دار', arDisplay: 'نْدور', root: 'د-و-ر', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'גזרת ע״ו — חלול', gloss_he: 'להסתובב, לחזור סחור-סחור', gloss_en: 'to turn, to go around',
    participle: { m: 'دايِر', f: 'دايْرة', pl: 'دايْرين', he: 'מסתובב' },
    masdar: { ar: 'دَوَران', he: 'סיבוב' },
    conj: {
      past: [
        {pronoun:'אני',he:'הסתובבתי',ar:'دِرْت'},{pronoun:'אתה',he:'הסתובבת',ar:'دِرْت'},{pronoun:'את',he:'הסתובבת',ar:'دِرْتي'},
        {pronoun:'הוא',he:'הסתובב',ar:'دار'},{pronoun:'היא',he:'הסתובבה',ar:'دارِت'},{pronoun:'אנחנו',he:'הסתובבנו',ar:'دِرْنا'},
        {pronoun:'אתם/ן',he:'הסתובבתם',ar:'دِرْتوا'},{pronoun:'הם/ן',he:'הסתובבו',ar:'داروا'},
      ],
      present: [
        {pronoun:'אני',he:'מסתובב/ת',ar:'بَدور'},{pronoun:'אתה',he:'מסתובב',ar:'بِتْدور'},{pronoun:'את',he:'מסתובבת',ar:'بِتْدوري'},
        {pronoun:'הוא',he:'מסתובב',ar:'بِيْدور'},{pronoun:'היא',he:'מסתובבת',ar:'بِتْدور'},{pronoun:'אנחנו',he:'מסתובבים',ar:'بِنْدور',context:'— בנאום: نْدور'},
        {pronoun:'אתם/ן',he:'מסתובבים',ar:'بِتْدوروا'},{pronoun:'הם/ן',he:'מסתובבים',ar:'بِيْدوروا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'הסתובב',ar:'دور'},{pronoun:'את',he:'הסתובבי',ar:'دوري'},{pronoun:'אתם/ן',he:'הסתובבו',ar:'دوروا'},
      ],
    },
  },
  {
    id: 'saaq', ar: 'ساق', arDisplay: 'يْسوقِ', root: 'س-و-ق', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'גזרת ע״ו — חלול', gloss_he: 'להוביל, לנהוג', gloss_en: 'to drive, to lead',
    participle: { m: 'سايِق', f: 'سايْقة', pl: 'سايْقين', he: 'מוביל / נוהג' },
    masdar: { ar: 'سَوْق', he: 'הובלה' },
    conj: {
      past: [
        {pronoun:'אני',he:'הובלתי',ar:'سُقْت'},{pronoun:'אתה',he:'הובלת',ar:'سُقْت'},{pronoun:'את',he:'הובלת',ar:'سُقْتي'},
        {pronoun:'הוא',he:'הוביל',ar:'ساق'},{pronoun:'היא',he:'הובילה',ar:'ساقِت'},{pronoun:'אנחנו',he:'הובלנו',ar:'سُقْنا'},
        {pronoun:'אתם/ן',he:'הובלתם',ar:'سُقْتوا'},{pronoun:'הם/ן',he:'הובילו',ar:'ساقوا'},
      ],
      present: [
        {pronoun:'אני',he:'מוביל/ה',ar:'بَسوق'},{pronoun:'אתה',he:'מוביל',ar:'بِتْسوق'},{pronoun:'את',he:'מובילה',ar:'بِتْسوقي'},
        {pronoun:'הוא',he:'מוביל',ar:'بِيْسوق',context:'— בנאום: يْسوق'},{pronoun:'היא',he:'מובילה',ar:'بِتْسوق'},{pronoun:'אנחנו',he:'מובילים',ar:'بِنْسوق'},
        {pronoun:'אתם/ן',he:'מובילים',ar:'بِتْسوقوا'},{pronoun:'הם/ן',he:'מובילים',ar:'بِيْسوقوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'הובל',ar:'سوق'},{pronoun:'את',he:'הובילי',ar:'سوقي'},{pronoun:'אתם/ן',he:'הובילו',ar:'سوقوا'},
      ],
    },
  },
  {
    id: 'jarr', ar: 'جَرّ', arDisplay: 'بِجُرّهُم', root: 'ج-ر-ر', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'פועל כפול', gloss_he: 'למשוך', gloss_en: 'to pull, to drag',
    participle: { m: 'جارّ', f: 'جارّة', pl: 'جارّين', he: 'מושך' },
    masdar: { ar: 'جَرّ', he: 'משיכה' },
    conj: {
      past: [
        {pronoun:'אני',he:'משכתי',ar:'جَرّيت'},{pronoun:'אתה',he:'משכת',ar:'جَرّيت'},{pronoun:'את',he:'משכת',ar:'جَرّيتي'},
        {pronoun:'הוא',he:'משך',ar:'جَرّ'},{pronoun:'היא',he:'משכה',ar:'جَرِّت'},{pronoun:'אנחנו',he:'משכנו',ar:'جَرّينا'},
        {pronoun:'אתם/ן',he:'משכתם',ar:'جَرّيتوا'},{pronoun:'הם/ן',he:'משכו',ar:'جَرّوا'},
      ],
      present: [
        {pronoun:'אני',he:'מושך/ת',ar:'بَجُرّ'},{pronoun:'אתה',he:'מושך',ar:'بِتْجُرّ'},{pronoun:'את',he:'מושכת',ar:'بِتْجُرّي'},
        {pronoun:'הוא',he:'מושך',ar:'بِيْجُرّ',context:'— בנאום: بِجُرّهُم'},{pronoun:'היא',he:'מושכת',ar:'بِتْجُرّ'},{pronoun:'אנחנו',he:'מושכים',ar:'بِنْجُرّ'},
        {pronoun:'אתם/ן',he:'מושכים',ar:'بِتْجُرّوا'},{pronoun:'הם/ן',he:'מושכים',ar:'بِيْجُرّوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'משוך',ar:'جُرّ'},{pronoun:'את',he:'משכי',ar:'جُرّي'},{pronoun:'אתם/ן',he:'משכו',ar:'جُرّوا'},
      ],
    },
  },
  {
    id: 'ikhtalaf', ar: 'اِخْتَلَف', arDisplay: 'اخْتَلَفْنا', root: 'خ-ل-ف', binyan: 'הִתְפַּעֵל', formNum: 8,
    dialectNote: 'בניין افتعל — הדדי', gloss_he: 'לחלוק דעה, להתווכח', gloss_en: 'to disagree, to differ',
    participle: { m: 'مِخْتَلِف', f: 'مِخْتَلْفة', pl: 'مِخْتَلْفين', he: 'חלוק / שונה' },
    masdar: { ar: 'اِخْتِلاف', he: 'מחלוקת' },
    conj: {
      past: [
        {pronoun:'אני',he:'התווכחתי',ar:'اِخْتَلَفْت'},{pronoun:'אתה',he:'התווכחת',ar:'اِخْتَلَفْت'},{pronoun:'את',he:'התווכחת',ar:'اِخْتَلَفْتي'},
        {pronoun:'הוא',he:'התווכח',ar:'اِخْتَلَف'},{pronoun:'היא',he:'התווכחה',ar:'اِخْتَلَفِت'},{pronoun:'אנחנו',he:'התווכחנו',ar:'اِخْتَلَفْنا',context:'— בנאום'},
        {pronoun:'אתם/ן',he:'התווכחתם',ar:'اِخْتَلَفْتوا'},{pronoun:'הם/ן',he:'התווכחו',ar:'اِخْتَلَفوا'},
      ],
      present: [
        {pronoun:'אני',he:'חולק/ת דעה',ar:'بَخْتَلِف'},{pronoun:'אתה',he:'חולק דעה',ar:'بِتِخْتَلِف'},{pronoun:'את',he:'חולקת דעה',ar:'بِتِخْتَلْفي'},
        {pronoun:'הוא',he:'חולק דעה',ar:'بِيِخْتَلِف'},{pronoun:'היא',he:'חולקת דעה',ar:'بِتِخْتَلِف'},{pronoun:'אנחנו',he:'חולקים דעה',ar:'بِنِخْتَلِف'},
        {pronoun:'אתם/ן',he:'חולקים דעה',ar:'بِتِخْتَلْفوا'},{pronoun:'הם/ן',he:'חולקים דעה',ar:'بِيِخْتَلْفوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'חלוק דעה',ar:'اِخْتَلِف'},{pronoun:'את',he:'חלקי דעה',ar:'اِخْتَلْفي'},{pronoun:'אתם/ן',he:'חלקו דעה',ar:'اِخْتَلْفوا'},
      ],
    },
  },
  {
    id: 'habb', ar: 'حَبّ', arDisplay: 'بْنِحِبّكُم', root: 'ح-ب-ب', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'פועל כפול', gloss_he: 'לאהוב', gloss_en: 'to love',
    participle: { m: 'حابّ', f: 'حابّة', pl: 'حابّين', he: 'אוהב' },
    masdar: { ar: 'حُبّ', he: 'אהבה' },
    conj: {
      past: [
        {pronoun:'אני',he:'אהבתי',ar:'حَبّيت'},{pronoun:'אתה',he:'אהבת',ar:'حَبّيت'},{pronoun:'את',he:'אהבת',ar:'حَبّيتي'},
        {pronoun:'הוא',he:'אהב',ar:'حَبّ'},{pronoun:'היא',he:'אהבה',ar:'حَبِّت'},{pronoun:'אנחנו',he:'אהבנו',ar:'حَبّينا'},
        {pronoun:'אתם/ן',he:'אהבתם',ar:'حَبّيتوا'},{pronoun:'הם/ן',he:'אהבו',ar:'حَبّوا'},
      ],
      present: [
        {pronoun:'אני',he:'אוהב/ת',ar:'بَحِبّ'},{pronoun:'אתה',he:'אוהב',ar:'بِتْحِبّ'},{pronoun:'את',he:'אוהבת',ar:'بِتْحِبّي'},
        {pronoun:'הוא',he:'אוהב',ar:'بِيْحِبّ'},{pronoun:'היא',he:'אוהבת',ar:'بِتْحِبّ'},{pronoun:'אנחנו',he:'אוהבים',ar:'بِنْحِبّ',context:'— בנאום: بْنِحِبّكُم'},
        {pronoun:'אתם/ן',he:'אוהבים',ar:'بِتْحِبّوا'},{pronoun:'הם/ן',he:'אוהבים',ar:'بِيْحِبّوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'אהב',ar:'حِبّ'},{pronoun:'את',he:'אהבי',ar:'حِبّي'},{pronoun:'אתם/ן',he:'אהבו',ar:'حِبّوا'},
      ],
    },
  },
  {
    id: 'tasarraf', ar: 'تْصَرَّف', arDisplay: 'تِتْصَرَّفوا', root: 'ص-ر-ف', binyan: 'הִתְפַּעֵל', formNum: 5,
    dialectNote: 'בניין תفعّل', gloss_he: 'להתנהג', gloss_en: 'to behave, to act',
    participle: { m: 'مِتْصَرِّف', f: 'مِتْصَرْفة', pl: 'مِتْصَرْفين', he: 'מתנהג' },
    masdar: { ar: 'تَصَرُّف', he: 'התנהגות' },
    conj: {
      past: [
        {pronoun:'אני',he:'התנהגתי',ar:'تْصَرَّفْت'},{pronoun:'אתה',he:'התנהגת',ar:'تْصَرَّفْت'},{pronoun:'את',he:'התנהגת',ar:'تْصَرَّفْتي'},
        {pronoun:'הוא',he:'התנהג',ar:'تْصَرَّف'},{pronoun:'היא',he:'התנהגה',ar:'تْصَرَّفِت'},{pronoun:'אנחנו',he:'התנהגנו',ar:'تْصَرَّفْنا'},
        {pronoun:'אתם/ן',he:'התנהגתם',ar:'تْصَرَّفْتوا'},{pronoun:'הם/ן',he:'התנהגו',ar:'تْصَرَّفوا'},
      ],
      present: [
        {pronoun:'אני',he:'מתנהג/ת',ar:'بَتْصَرَّف'},{pronoun:'אתה',he:'מתנהג',ar:'بِتِتْصَرَّف'},{pronoun:'את',he:'מתנהגת',ar:'بِتِتْصَرَّفي'},
        {pronoun:'הוא',he:'מתנהג',ar:'بِيِتْصَرَّف'},{pronoun:'היא',he:'מתנהגת',ar:'بِتِتْصَرَّف'},{pronoun:'אנחנו',he:'מתנהגים',ar:'بِنِتْصَرَّف'},
        {pronoun:'אתם/ן',he:'מתנהגים',ar:'بِتِتْصَرَّفوا',context:'— בנאום: تِتْصَرَّفوا'},{pronoun:'הם/ן',he:'מתנהגים',ar:'بِيِتْصَرَّفوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'התנהג',ar:'اِتْصَرَّف'},{pronoun:'את',he:'התנהגי',ar:'اِتْصَرَّفي'},{pronoun:'אתם/ן',he:'התנהגו',ar:'اِتْصَرَّفوا'},
      ],
    },
  },
  {
    id: 'mishi', ar: 'مِشي', arDisplay: 'تِمْشوا', root: 'م-ش-ي', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'גזרת ל״י — נחה', gloss_he: 'ללכת (ברגל), ללכת בעקבות', gloss_en: 'to walk, to follow (a path)',
    participle: { m: 'ماشي', f: 'ماشْية', pl: 'ماشْيين', he: 'הולך' },
    masdar: { ar: 'مَشي', he: 'הליכה' },
    conj: {
      past: [
        {pronoun:'אני',he:'הלכתי',ar:'مِشيت'},{pronoun:'אתה',he:'הלכת',ar:'مِشيت'},{pronoun:'את',he:'הלכת',ar:'مِشيتي'},
        {pronoun:'הוא',he:'הלך',ar:'مِشي'},{pronoun:'היא',he:'הלכה',ar:'مِشِت'},{pronoun:'אנחנו',he:'הלכנו',ar:'مِشينا'},
        {pronoun:'אתם/ן',he:'הלכתם',ar:'مِشيتوا'},{pronoun:'הם/ן',he:'הלכו',ar:'مِشوا'},
      ],
      present: [
        {pronoun:'אני',he:'הולך/ת',ar:'بَمْشي'},{pronoun:'אתה',he:'הולך',ar:'بِتِمْشي'},{pronoun:'את',he:'הולכת',ar:'بِتِمْشي'},
        {pronoun:'הוא',he:'הולך',ar:'بِيِمْشي'},{pronoun:'היא',he:'הולכת',ar:'بِتِمْشي'},{pronoun:'אנחנו',he:'הולכים',ar:'بِنِمْشي'},
        {pronoun:'אתם/ן',he:'הולכים',ar:'بِتِمْشوا',context:'— בנאום: تِمْشوا'},{pronoun:'הם/ן',he:'הולכים',ar:'بِيِمْشوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'לך',ar:'اِمْشي'},{pronoun:'את',he:'לכי',ar:'اِمْشي'},{pronoun:'אתם/ן',he:'לכו',ar:'اِمْشوا'},
      ],
    },
  },
  {
    id: 'rasam', ar: 'رَسَم', arDisplay: 'رَسَمْناه', root: 'ر-س-م', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'שורש שלם', gloss_he: 'לצייר, לתכנן', gloss_en: 'to draw, to plan out',
    participle: { m: 'راسِم', f: 'راسْمة', pl: 'راسْمين', he: 'מתכנן' },
    masdar: { ar: 'رَسْم', he: 'ציור / תכנון' },
    conj: {
      past: [
        {pronoun:'אני',he:'תכננתי',ar:'رَسَمْت'},{pronoun:'אתה',he:'תכננת',ar:'رَسَمْت'},{pronoun:'את',he:'תכננת',ar:'رَسَمْتي'},
        {pronoun:'הוא',he:'תכנן',ar:'رَسَم'},{pronoun:'היא',he:'תכננה',ar:'رَسَمِت'},{pronoun:'אנחנו',he:'תכננו',ar:'رَسَمْنا',context:'— בנאום: رَسَمْناه'},
        {pronoun:'אתם/ן',he:'תכננתם',ar:'رَسَمْتوا'},{pronoun:'הם/ן',he:'תכננו',ar:'رَسَموا'},
      ],
      present: [
        {pronoun:'אני',he:'מתכנן/ת',ar:'بَرْسُم'},{pronoun:'אתה',he:'מתכנן',ar:'بِتِرْسُم'},{pronoun:'את',he:'מתכננת',ar:'بِتِرْسُمي'},
        {pronoun:'הוא',he:'מתכנן',ar:'بِيِرْسُم'},{pronoun:'היא',he:'מתכננת',ar:'بِتِرْسُم'},{pronoun:'אנחנו',he:'מתכננים',ar:'بِنِرْسُم'},
        {pronoun:'אתם/ן',he:'מתכננים',ar:'بِتِرْسُموا'},{pronoun:'הם/ן',he:'מתכננים',ar:'بِيِرْسُموا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'תכנן',ar:'اُرْسُم'},{pronoun:'את',he:'תכנני',ar:'اُرْسُمي'},{pronoun:'אתם/ן',he:'תכננו',ar:'اُرْسُموا'},
      ],
    },
  },
  {
    id: 'idtarr', ar: 'اِضْطَرّ', arDisplay: 'اضْطَرَّيْتوا', root: 'ض-ر-ر', binyan: 'הִתְפַּעֵל', formNum: 8,
    dialectNote: 'בניין افتعل — פועל כפול', gloss_he: 'להיאלץ', gloss_en: 'to be forced, to be compelled',
    participle: { m: 'مِضْطَرّ', f: 'مِضْطَرّة', pl: 'مِضْطَرّين', he: 'נאלץ' },
    masdar: { ar: 'اِضْطِرار', he: 'הכרח' },
    conj: {
      past: [
        {pronoun:'אני',he:'נאלצתי',ar:'اِضْطَرّيت'},{pronoun:'אתה',he:'נאלצת',ar:'اِضْطَرّيت'},{pronoun:'את',he:'נאלצת',ar:'اِضْطَرّيتي'},
        {pronoun:'הוא',he:'נאלץ',ar:'اِضْطَرّ'},{pronoun:'היא',he:'נאלצה',ar:'اِضْطَرِّت'},{pronoun:'אנחנו',he:'נאלצנו',ar:'اِضْطَرّينا'},
        {pronoun:'אתם/ן',he:'נאלצתם',ar:'اِضْطَرّيتوا',context:'— בנאום'},{pronoun:'הם/ן',he:'נאלצו',ar:'اِضْطَرّوا'},
      ],
      present: [
        {pronoun:'אני',he:'נאלץ/ת',ar:'بَضْطَرّ'},{pronoun:'אתה',he:'נאלץ',ar:'بِتِضْطَرّ'},{pronoun:'את',he:'נאלצת',ar:'بِتِضْطَرّي'},
        {pronoun:'הוא',he:'נאלץ',ar:'بِيِضْطَرّ'},{pronoun:'היא',he:'נאלצת',ar:'بِتِضْطَرّ'},{pronoun:'אנחנו',he:'נאלצים',ar:'بِنِضْطَرّ'},
        {pronoun:'אתם/ן',he:'נאלצים',ar:'بِتِضْطَرّوا'},{pronoun:'הם/ן',he:'נאלצים',ar:'بِيِضْطَرّوا'},
      ],
      imperative: [ {pronoun:'(נדיר)',he:'—',ar:'—'} ],
    },
  },
  {
    id: 'difin', ar: 'دِفِن', arDisplay: 'تِدْفْنوهُم', root: 'د-ف-ن', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'שורש שלם', gloss_he: 'לקבור', gloss_en: 'to bury',
    participle: { m: 'دافِن', f: 'دافْنة', pl: 'دافْنين', he: 'קובר' },
    masdar: { ar: 'دَفن', he: 'קבורה' },
    conj: {
      past: [
        {pronoun:'אני',he:'קברתי',ar:'دِفِنْت'},{pronoun:'אתה',he:'קברת',ar:'دِفِنْت'},{pronoun:'את',he:'קברת',ar:'دِفِنْتي'},
        {pronoun:'הוא',he:'קבר',ar:'دِفِن'},{pronoun:'היא',he:'קברה',ar:'دِفْنِت'},{pronoun:'אנחנו',he:'קברנו',ar:'دِفِنّا'},
        {pronoun:'אתם/ן',he:'קברתם',ar:'دِفِنْتوا'},{pronoun:'הם/ן',he:'קברו',ar:'دِفْنوا'},
      ],
      present: [
        {pronoun:'אני',he:'קובר/ת',ar:'بَدْفِن'},{pronoun:'אתה',he:'קובר',ar:'بِتِدْفِن'},{pronoun:'את',he:'קוברת',ar:'بِتِدْفِني'},
        {pronoun:'הוא',he:'קובר',ar:'بِيِدْفِن'},{pronoun:'היא',he:'קוברת',ar:'بِتِدْفِن'},{pronoun:'אנחנו',he:'קוברים',ar:'بِنِدْفِن'},
        {pronoun:'אתם/ן',he:'קוברים',ar:'بِتِدْفِنوا',context:'— בנאום: تِدْفْنوهُم'},{pronoun:'הם/ן',he:'קוברים',ar:'بِيِدْفِنوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'קבור',ar:'اِدْفِن'},{pronoun:'את',he:'קברי',ar:'اِدْفِني'},{pronoun:'אתם/ן',he:'קברו',ar:'اِدْفِنوا'},
      ],
    },
  },
  {
    id: 'khattat', ar: 'خَطَّط', arDisplay: 'عَمبِيخَطّْطوا', root: 'خ-ط-ط', binyan: 'פִּיעֵל', formNum: 2,
    dialectNote: 'פועל כפול; כאן עם תחילית ההווה המתמשך "עם"', gloss_he: 'לתכנן', gloss_en: 'to plan',
    participle: { m: 'مْخَطِّط', f: 'مْخَطِّطة', pl: 'مْخَطِّطين', he: 'מתכנן' },
    masdar: { ar: 'تَخْطيط', he: 'תכנון' },
    conj: {
      past: [
        {pronoun:'אני',he:'תכננתי',ar:'خَطَّطْت'},{pronoun:'אתה',he:'תכננת',ar:'خَطَّطْت'},{pronoun:'את',he:'תכננת',ar:'خَطَّطْتي'},
        {pronoun:'הוא',he:'תכנן',ar:'خَطَّط'},{pronoun:'היא',he:'תכננה',ar:'خَطَّطِت'},{pronoun:'אנחנו',he:'תכננו',ar:'خَطَّطْنا'},
        {pronoun:'אתם/ן',he:'תכננתם',ar:'خَطَّطْتوا'},{pronoun:'הם/ן',he:'תכננו',ar:'خَطَّطوا'},
      ],
      present: [
        {pronoun:'אני',he:'מתכנן/ת',ar:'بَخَطِّط'},{pronoun:'אתה',he:'מתכנן',ar:'بِتْخَطِّط'},{pronoun:'את',he:'מתכננת',ar:'بِتْخَطِّطي'},
        {pronoun:'הוא',he:'מתכנן',ar:'بِيْخَطِّط',context:'— בנאום: عَمبِيخَطّْطوا (עם "עם" — הווה מתמשך)'},{pronoun:'היא',he:'מתכננת',ar:'بِتْخَطِّط'},{pronoun:'אנחנו',he:'מתכננים',ar:'بِنْخَطِّط'},
        {pronoun:'אתם/ן',he:'מתכננים',ar:'بِتْخَطِّطوا'},{pronoun:'הם/ן',he:'מתכננים',ar:'بِيْخَطِّطوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'תכנן',ar:'خَطِّط'},{pronoun:'את',he:'תכנני',ar:'خَطِّطي'},{pronoun:'אתם/ן',he:'תכננו',ar:'خَطِّطوا'},
      ],
    },
  },
  {
    id: 'istaghall', ar: 'اِسْتَغَلّ', arDisplay: 'عَمبِيسْتَغِلّوا', root: 'غ-ل-ل', binyan: 'הִתְפַּעֵל', formNum: 10,
    dialectNote: 'בניין استفعل — פועל כפול; כאן עם "עם" — הווה מתמשך', gloss_he: 'לנצל', gloss_en: 'to exploit, to take advantage of',
    participle: { m: 'مِسْتَغِلّ', f: 'مِسْتَغِلّة', pl: 'مِسْتَغِلّين', he: 'מנצל' },
    masdar: { ar: 'اِسْتِغْلال', he: 'ניצול' },
    conj: {
      past: [
        {pronoun:'אני',he:'ניצלתי',ar:'اِسْتَغْلَيْت'},{pronoun:'אתה',he:'ניצלת',ar:'اِسْتَغْلَيْت'},{pronoun:'את',he:'ניצלת',ar:'اِسْتَغْلَيْتي'},
        {pronoun:'הוא',he:'ניצל',ar:'اِسْتَغَلّ'},{pronoun:'היא',he:'ניצלה',ar:'اِسْتَغَلِّت'},{pronoun:'אנחנו',he:'ניצלנו',ar:'اِسْتَغْلَيْنا'},
        {pronoun:'אתם/ן',he:'ניצלתם',ar:'اِسْتَغْلَيْتوا'},{pronoun:'הם/ן',he:'ניצלו',ar:'اِسْتَغَلّوا'},
      ],
      present: [
        {pronoun:'אני',he:'מנצל/ת',ar:'بَسْتَغِلّ'},{pronoun:'אתה',he:'מנצל',ar:'بِتِسْتَغِلّ'},{pronoun:'את',he:'מנצלת',ar:'بِتِسْتَغِلّي'},
        {pronoun:'הוא',he:'מנצל',ar:'بِيِسْتَغِلّ',context:'— בנאום: عَمبِيسْتَغِلّوا'},{pronoun:'היא',he:'מנצלת',ar:'بِتِسْتَغِلّ'},{pronoun:'אנחנו',he:'מנצלים',ar:'بِنِسْتَغِلّ'},
        {pronoun:'אתם/ן',he:'מנצלים',ar:'بِتِسْتَغِلّوا'},{pronoun:'הם/ן',he:'מנצלים',ar:'بِيِسْتَغِلّوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'נצל',ar:'اِسْتَغِلّ'},{pronoun:'את',he:'נצלי',ar:'اِسْتَغِلّي'},{pronoun:'אתם/ן',he:'נצלו',ar:'اِسْتَغِلّوا'},
      ],
    },
  },
  {
    id: 'khaaf', ar: 'خاف', arDisplay: 'خافوا', root: 'خ-و-ف', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'גזרת ע״ו — חלול', gloss_he: 'לפחד', gloss_en: 'to fear, to be afraid',
    participle: { m: 'خايِف', f: 'خايْفة', pl: 'خايْفين', he: 'מפחד' },
    masdar: { ar: 'خَوف', he: 'פחד' },
    conj: {
      past: [
        {pronoun:'אני',he:'פחדתי',ar:'خِفْت'},{pronoun:'אתה',he:'פחדת',ar:'خِفْت'},{pronoun:'את',he:'פחדת',ar:'خِفْتي'},
        {pronoun:'הוא',he:'פחד',ar:'خاف'},{pronoun:'היא',he:'פחדה',ar:'خافِت'},{pronoun:'אנחנו',he:'פחדנו',ar:'خِفْنا'},
        {pronoun:'אתם/ן',he:'פחדתם',ar:'خِفْتوا',context:'— בנאום: خافوا (ציווי)'},{pronoun:'הם/ן',he:'פחדו',ar:'خافوا'},
      ],
      present: [
        {pronoun:'אני',he:'מפחד/ת',ar:'بَخاف'},{pronoun:'אתה',he:'מפחד',ar:'بِتْخاف'},{pronoun:'את',he:'מפחדת',ar:'بِتْخافي'},
        {pronoun:'הוא',he:'מפחד',ar:'بِيْخاف'},{pronoun:'היא',he:'מפחדת',ar:'بِتْخاف'},{pronoun:'אנחנו',he:'מפחדים',ar:'بِنْخاف'},
        {pronoun:'אתם/ן',he:'מפחדים',ar:'بِتْخافوا'},{pronoun:'הם/ן',he:'מפחדים',ar:'بِيْخافوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'פחד!',ar:'خاف'},{pronoun:'את',he:'פחדי!',ar:'خافي'},{pronoun:'אתם/ן',he:'פחדו!',ar:'خافوا',context:'— בנאום'},
      ],
    },
  },
  {
    id: 'tiyaas', ar: 'تِيْأَس', arDisplay: 'تِيْأَسوا', root: 'ي-أ-س', binyan: 'הִתְפַּעֵל', formNum: 5,
    dialectNote: 'בניין תفعّל — ניב מדובר ל"يأس" (ייאוש)', gloss_he: 'להתייאש', gloss_en: 'to despair, to lose hope',
    participle: { m: 'مِتْيَئِس', f: 'مِتْيَئْسة', pl: 'مِتْيَئْسين', he: 'מתייאש' },
    masdar: { ar: 'يَأس', he: 'ייאוש' },
    conj: {
      past: [
        {pronoun:'אני',he:'התייאשתי',ar:'تِيْأَسْت'},{pronoun:'אתה',he:'התייאשת',ar:'تِيْأَسْت'},{pronoun:'את',he:'התייאשת',ar:'تِيْأَسْتي'},
        {pronoun:'הוא',he:'התייאש',ar:'تِيْأَس'},{pronoun:'היא',he:'התייאשה',ar:'تِيْأَسِت'},{pronoun:'אנחנו',he:'התייאשנו',ar:'تِيْأَسْنا'},
        {pronoun:'אתם/ן',he:'התייאשתם',ar:'تِيْأَسْتوا'},{pronoun:'הם/ן',he:'התייאשו',ar:'تِيْأَسوا'},
      ],
      present: [
        {pronoun:'אני',he:'מתייאש/ת',ar:'بَتْيَأَس'},{pronoun:'אתה',he:'מתייאש',ar:'بِتِتْيَأَس'},{pronoun:'את',he:'מתייאשת',ar:'بِتِتْيَأَسي'},
        {pronoun:'הוא',he:'מתייאש',ar:'بِيِتْيَأَس'},{pronoun:'היא',he:'מתייאשת',ar:'بِتِتْيَأَس'},{pronoun:'אנחנו',he:'מתייאשים',ar:'بِنِتْيَأَس'},
        {pronoun:'אתם/ן',he:'מתייאשים',ar:'بِتِتْيَأَسوا',context:'— בנאום: לא תِيْأَسوا (ציווי שלילי)'},{pronoun:'הם/ן',he:'מתייאשים',ar:'بِيِتْيَأَسوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'אל תתייאש',ar:'לا تِيْأَس'},{pronoun:'את',he:'אל תתייאשי',ar:'لا تِيْأَسي'},{pronoun:'אתם/ן',he:'אל תתייאשו',ar:'لا تِيْأَسوا',context:'— בנאום'},
      ],
    },
  },
  {
    id: 'biqi', ar: 'بِقي', arDisplay: 'باقْيين', root: 'ب-ق-ي', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'גזרת ל״י — נחה', gloss_he: 'להישאר', gloss_en: 'to remain, to stay',
    participle: { m: 'باقي', f: 'باقْية', pl: 'باقْيين', he: 'נשאר', context: '— בנאום: باقْيين' },
    masdar: { ar: 'بَقاء', he: 'היוותרות' },
    conj: {
      past: [
        {pronoun:'אני',he:'נשארתי',ar:'بِقيت'},{pronoun:'אתה',he:'נשארת',ar:'بِقيت'},{pronoun:'את',he:'נשארת',ar:'بِقيتي'},
        {pronoun:'הוא',he:'נשאר',ar:'بِقي'},{pronoun:'היא',he:'נשארה',ar:'بِقِت'},{pronoun:'אנחנו',he:'נשארנו',ar:'بِقينا'},
        {pronoun:'אתם/ן',he:'נשארתם',ar:'بِقيتوا'},{pronoun:'הם/ן',he:'נשארו',ar:'بِقوا'},
      ],
      present: [
        {pronoun:'אני',he:'נשאר/ת',ar:'بَبْقى'},{pronoun:'אתה',he:'נשאר',ar:'بِتِبْقى'},{pronoun:'את',he:'נשארת',ar:'بِتِبْقي'},
        {pronoun:'הוא',he:'נשאר',ar:'بِيِبْقى'},{pronoun:'היא',he:'נשארת',ar:'بِتِبْقى'},{pronoun:'אנחנו',he:'נשארים',ar:'بِنِبْقى'},
        {pronoun:'אתם/ן',he:'נשארים',ar:'بِتِبْقوا'},{pronoun:'הם/ן',he:'נשארים',ar:'بِيِبْقوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'הישאר',ar:'اِبْقى'},{pronoun:'את',he:'הישארי',ar:'اِبْقي'},{pronoun:'אתם/ן',he:'הישארו',ar:'اِبْقوا'},
      ],
    },
  },
  {
    id: 'tahadda', ar: 'تْحَدّى', arDisplay: 'اتْحَدَّيْنا', root: 'ح-د-ي', binyan: 'הִתְפַּעֵל', formNum: 6,
    dialectNote: 'בניין تفاعل — גזרת ל״י', gloss_he: 'להתמודד עם, לאתגר', gloss_en: 'to challenge, to take on',
    participle: { m: 'مِتْحَدّي', f: 'مِتْحَدّية', pl: 'مِتْحَدّيين', he: 'מתמודד' },
    masdar: { ar: 'تَحَدّي', he: 'אתגר' },
    conj: {
      past: [
        {pronoun:'אני',he:'התמודדתי',ar:'تْحَدّيت'},{pronoun:'אתה',he:'התמודדת',ar:'تْحَدّيت'},{pronoun:'את',he:'התמודדת',ar:'تْحَدّيتي'},
        {pronoun:'הוא',he:'התמודד',ar:'تْحَدّى'},{pronoun:'היא',he:'התמודדה',ar:'تْحَدِّت'},{pronoun:'אנחנו',he:'התמודדנו',ar:'تْحَدّينا',context:'— בנאום: اتْحَدَّيْنا'},
        {pronoun:'אתם/ן',he:'התמודדתם',ar:'تْحَدّيتوا'},{pronoun:'הם/ן',he:'התמודדו',ar:'تْحَدّوا'},
      ],
      present: [
        {pronoun:'אני',he:'מתמודד/ת',ar:'بَتْحَدّى'},{pronoun:'אתה',he:'מתמודד',ar:'بِتِتْحَدّى'},{pronoun:'את',he:'מתמודדת',ar:'بِتِتْحَدّي'},
        {pronoun:'הוא',he:'מתמודד',ar:'بِيِتْحَدّى'},{pronoun:'היא',he:'מתמודדת',ar:'بِتِتْحَدّى'},{pronoun:'אנחנו',he:'מתמודדים',ar:'بِنِتْحَدّى',context:'— בנאום: نِتْحَدّى'},
        {pronoun:'אתם/ן',he:'מתמודדים',ar:'بِتِتْحَدّوا'},{pronoun:'הם/ן',he:'מתמודדים',ar:'بِيِتْحَدّوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'התמודד',ar:'اِتْحَدّى'},{pronoun:'את',he:'התמודדי',ar:'اِتْحَدّي'},{pronoun:'אתם/ן',he:'התמודדו',ar:'اِتْحَدّوا'},
      ],
    },
  },
  {
    id: 'ajab', ar: 'عِجِب', arDisplay: 'عَجَبُه', root: 'ع-ج-ب', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'פועל אישי, נצמד לכינוי מושא (له/ها וכד\')', gloss_he: 'למצוא חן ב-', gloss_en: 'to please (impersonal: "it pleases him")',
    participle: { m: 'عاجِب', f: 'عاجْبة', pl: 'عاجْبين', he: 'מוצא חן', context: '— בנאום: عاجْبُه' },
    masdar: null,
    conj: {
      past: [
        {pronoun:'אני',he:'מצאתי חן',ar:'عِجِبْت'},{pronoun:'אתה',he:'מצאת חן',ar:'عِجِبْت'},{pronoun:'את',he:'מצאת חן',ar:'عِجِبْتي'},
        {pronoun:'הוא',he:'מצא חן',ar:'عِجِب'},{pronoun:'היא',he:'מצאה חן',ar:'عِجْبِت'},{pronoun:'אנחנו',he:'מצאנו חן',ar:'عِجِبْنا'},
        {pronoun:'אתם/ן',he:'מצאתם חן',ar:'عِجِبْتوا'},{pronoun:'הם/ן',he:'מצאו חן',ar:'عِجْبوا'},
      ],
      present: [
        {pronoun:'אני',he:'מוצא/ת חן',ar:'بَعْجِب'},{pronoun:'אתה',he:'מוצא חן',ar:'بِتِعْجِب'},{pronoun:'את',he:'מוצאת חן',ar:'بِتِعْجِبي'},
        {pronoun:'הוא',he:'מוצא חן (בעיניו)',ar:'بِيِعْجِب',context:'— בנאום: عَجَبُه — "זה מוצא חן בעיניו"'},{pronoun:'היא',he:'מוצאת חן',ar:'بِتِعْجِب'},{pronoun:'אנחנו',he:'מוצאים חן',ar:'بِنِعْجِب'},
        {pronoun:'אתם/ן',he:'מוצאים חן',ar:'بِتِعْجِبوا'},{pronoun:'הם/ן',he:'מוצאים חן',ar:'بِيِعْجِبوا'},
      ],
      imperative: [ {pronoun:'(לא רלוונטי)',he:'—',ar:'—'} ],
    },
  },
  {
    id: 'shirib', ar: 'شِرِب', arDisplay: 'يِشْرَب', root: 'ش-ر-ب', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'שורש שלם', gloss_he: 'לשתות', gloss_en: 'to drink',
    participle: { m: 'شارِب', f: 'شارْبة', pl: 'شارْبين', he: 'שותה' },
    masdar: { ar: 'شُرْب', he: 'שתייה' },
    conj: {
      past: [
        {pronoun:'אני',he:'שתיתי',ar:'شِرِبْت'},{pronoun:'אתה',he:'שתית',ar:'شِرِبْت'},{pronoun:'את',he:'שתית',ar:'شِرِبْتي'},
        {pronoun:'הוא',he:'שתה',ar:'شِرِب'},{pronoun:'היא',he:'שתתה',ar:'شِرْبِت'},{pronoun:'אנחנו',he:'שתינו',ar:'شِرِبْنا'},
        {pronoun:'אתם/ן',he:'שתיתם',ar:'شِرِبْتوا'},{pronoun:'הם/ן',he:'שתו',ar:'شِرْبوا'},
      ],
      present: [
        {pronoun:'אני',he:'שותה',ar:'بَشْرَب'},{pronoun:'אתה',he:'שותה',ar:'بِتِشْرَب'},{pronoun:'את',he:'שותה',ar:'بِتِشْرَبي'},
        {pronoun:'הוא',he:'שותה',ar:'بِيِشْرَب',context:'— בנאום'},{pronoun:'היא',he:'שותה',ar:'بِتِشْرَب'},{pronoun:'אנחנו',he:'שותים',ar:'بِنِشْرَب'},
        {pronoun:'אתם/ן',he:'שותים',ar:'بِتِشْرَبوا'},{pronoun:'הם/ן',he:'שותים',ar:'بِيِشْرَبوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'שתה',ar:'اِشْرَب'},{pronoun:'את',he:'שתי',ar:'اِشْرَبي'},{pronoun:'אתם/ן',he:'שתו',ar:'اِشْرَبوا'},
      ],
    },
  },
  {
    id: 'baarak', ar: 'بارَك', arDisplay: 'بارَك', root: 'ب-ر-ك', binyan: 'פִּיעֵל', formNum: 3,
    dialectNote: 'בניין فاعل', gloss_he: 'לברך', gloss_en: 'to bless',
    participle: { m: 'مْبارِك', f: 'مْبارْكة', pl: 'مْبارْكين', he: 'מברך' },
    masdar: { ar: 'بَرَكة', he: 'ברכה' },
    conj: {
      past: [
        {pronoun:'אני',he:'ברכתי',ar:'بارَكْت'},{pronoun:'אתה',he:'ברכת',ar:'بارَكْت'},{pronoun:'את',he:'ברכת',ar:'بارَكْتي'},
        {pronoun:'הוא',he:'ברך',ar:'بارَك',context:'— בנאום'},{pronoun:'היא',he:'ברכה',ar:'بارَكِت'},{pronoun:'אנחנו',he:'ברכנו',ar:'بارَكْنا'},
        {pronoun:'אתם/ן',he:'ברכתם',ar:'بارَكْتوا'},{pronoun:'הם/ן',he:'ברכו',ar:'باركوا'},
      ],
      present: [
        {pronoun:'אני',he:'מברך/ת',ar:'بَبارِك'},{pronoun:'אתה',he:'מברך',ar:'بِتْبارِك'},{pronoun:'את',he:'מברכת',ar:'بِتْبارْكي'},
        {pronoun:'הוא',he:'מברך',ar:'بِيْبارِك'},{pronoun:'היא',he:'מברכת',ar:'بِتْبارِك'},{pronoun:'אנחנו',he:'מברכים',ar:'بِنْبارِك'},
        {pronoun:'אתם/ן',he:'מברכים',ar:'بِتْبارْكوا'},{pronoun:'הם/ן',he:'מברכים',ar:'بِيْبارْكوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'ברך',ar:'بارِك'},{pronoun:'את',he:'ברכי',ar:'بارْكي'},{pronoun:'אתם/ן',he:'ברכו',ar:'بارْكوا'},
      ],
    },
  },
  {
    id: 'jaab', ar: 'جاب', arDisplay: 'يْجيبوا', root: 'ج-ي-ب', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'גזרת ע״י — חלול', gloss_he: 'להביא', gloss_en: 'to bring',
    participle: { m: 'جايِب', f: 'جايْبة', pl: 'جايْبين', he: 'מביא' },
    masdar: null,
    conj: {
      past: [
        {pronoun:'אני',he:'הבאתי',ar:'جِبْت'},{pronoun:'אתה',he:'הבאת',ar:'جِبْت'},{pronoun:'את',he:'הבאת',ar:'جِبْتي'},
        {pronoun:'הוא',he:'הביא',ar:'جاب'},{pronoun:'היא',he:'הביאה',ar:'جابِت'},{pronoun:'אנחנו',he:'הבאנו',ar:'جِبْنا'},
        {pronoun:'אתם/ן',he:'הבאתם',ar:'جِبْتوا'},{pronoun:'הם/ן',he:'הביאו',ar:'جابوا'},
      ],
      present: [
        {pronoun:'אני',he:'מביא/ה',ar:'بَجيب'},{pronoun:'אתה',he:'מביא',ar:'بِتْجيب'},{pronoun:'את',he:'מביאה',ar:'بِتْجيبي'},
        {pronoun:'הוא',he:'מביא',ar:'بِيْجيب'},{pronoun:'היא',he:'מביאה',ar:'بِتْجيب'},{pronoun:'אנחנו',he:'מביאים',ar:'بِنْجيب'},
        {pronoun:'אתם/ן',he:'מביאים',ar:'بِتْجيبوا',context:'— בנאום: يْجيبوا'},{pronoun:'הם/ן',he:'מביאים',ar:'بِيْجيبوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'הבא',ar:'جيب'},{pronoun:'את',he:'הביאי',ar:'جيبي'},{pronoun:'אתם/ן',he:'הביאו',ar:'جيبوا'},
      ],
    },
  },
  {
    id: 'ata', ar: 'عَطى', arDisplay: 'نِعْطيهُن', root: 'ع-ط-ي', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'גזרת ל״י — בפصحى: أعطى (Form IV); בניב מבוסט לFormI', gloss_he: 'לתת', gloss_en: 'to give',
    participle: { m: 'عاطي', f: 'عاطْية', pl: 'عاطْيين', he: 'נותן' },
    masdar: { ar: 'عَطِيّة', he: 'נתינה' },
    conj: {
      past: [
        {pronoun:'אני',he:'נתתי',ar:'عَطيت'},{pronoun:'אתה',he:'נתת',ar:'عَطيت'},{pronoun:'את',he:'נתת',ar:'عَطيتي'},
        {pronoun:'הוא',he:'נתן',ar:'عَطى'},{pronoun:'היא',he:'נתנה',ar:'عَطِت'},{pronoun:'אנחנו',he:'נתנו',ar:'عَطينا'},
        {pronoun:'אתם/ן',he:'נתתם',ar:'عَطيتوا'},{pronoun:'הם/ן',he:'נתנו',ar:'عَطوا'},
      ],
      present: [
        {pronoun:'אני',he:'נותן/ת',ar:'بَعْطي'},{pronoun:'אתה',he:'נותן',ar:'بِتِعْطي'},{pronoun:'את',he:'נותנת',ar:'بِتِعْطي'},
        {pronoun:'הוא',he:'נותן',ar:'بِيِعْطي'},{pronoun:'היא',he:'נותנת',ar:'بِتِعْطي'},{pronoun:'אנחנו',he:'נותנים',ar:'بِنِعْطي',context:'— בנאום: نِعْطيهُن'},
        {pronoun:'אתם/ן',he:'נותנים',ar:'بِتِعْطوا'},{pronoun:'הם/ן',he:'נותנים',ar:'بِيِعْطوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'תן',ar:'اِعْطي'},{pronoun:'את',he:'תני',ar:'اِعْطي'},{pronoun:'אתם/ן',he:'תנו',ar:'اِعْطوا'},
      ],
    },
  },
  {
    id: 'ija', ar: 'إِجا', arDisplay: 'بِتيجي', root: 'ج-ي-ي', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'פועל בלתי-סדיר — גזרת ל״י מקוצרת', gloss_he: 'לבוא', gloss_en: 'to come',
    participle: { m: 'جاي', f: 'جايّة', pl: 'جايين', he: 'בא' },
    masdar: { ar: 'مَجيء', he: 'ביאה' },
    conj: {
      past: [
        {pronoun:'אני',he:'באתי',ar:'جيت'},{pronoun:'אתה',he:'באת',ar:'جيت'},{pronoun:'את',he:'באת',ar:'جيتي'},
        {pronoun:'הוא',he:'בא',ar:'إِجا'},{pronoun:'היא',he:'באה',ar:'إِجَت'},{pronoun:'אנחנו',he:'באנו',ar:'جينا'},
        {pronoun:'אתם/ן',he:'באתם',ar:'جيتوا'},{pronoun:'הם/ן',he:'באו',ar:'إِجوا'},
      ],
      present: [
        {pronoun:'אני',he:'בא/ה',ar:'بَجي'},{pronoun:'אתה',he:'בא',ar:'بِتِجي',context:'— בנאום: بِتيجي'},{pronoun:'את',he:'באה',ar:'بِتِجي'},
        {pronoun:'הוא',he:'בא',ar:'بِيِجي'},{pronoun:'היא',he:'באה',ar:'بِتِجي'},{pronoun:'אנחנו',he:'באים',ar:'بِنِجي'},
        {pronoun:'אתם/ן',he:'באים',ar:'بِتِجوا',context:'— בנאום: تيجوا'},{pronoun:'הם/ן',he:'באים',ar:'بِيِجوا',context:'— בנאום: يِجوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'בוא',ar:'تعال'},{pronoun:'את',he:'בואי',ar:'تعالي'},{pronoun:'אתם/ן',he:'בואו',ar:'تعالوا'},
      ],
    },
  },
  {
    id: 'simi', ar: 'سِمِع', arDisplay: 'يِسْمَعوا', root: 'س-م-ع', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'שורש שלם', gloss_he: 'לשמוע', gloss_en: 'to hear',
    participle: { m: 'سامِع', f: 'سامْعة', pl: 'سامْعين', he: 'שומע' },
    masdar: { ar: 'سَماع', he: 'שמיעה' },
    conj: {
      past: [
        {pronoun:'אני',he:'שמעתי',ar:'سِمِعْت'},{pronoun:'אתה',he:'שמעת',ar:'سِمِعْت'},{pronoun:'את',he:'שמעת',ar:'سِمِعْتي'},
        {pronoun:'הוא',he:'שמע',ar:'سِمِع'},{pronoun:'היא',he:'שמעה',ar:'سِمْعِت'},{pronoun:'אנחנו',he:'שמענו',ar:'سِمِعْنا'},
        {pronoun:'אתם/ן',he:'שמעתם',ar:'سِمِعْتوا'},{pronoun:'הם/ן',he:'שמעו',ar:'سِمْعوا',context:'— בנאום'},
      ],
      present: [
        {pronoun:'אני',he:'שומע/ת',ar:'بَسْمَع'},{pronoun:'אתה',he:'שומע',ar:'بِتِسْمَع'},{pronoun:'את',he:'שומעת',ar:'بِتِسْمَعي'},
        {pronoun:'הוא',he:'שומע',ar:'بِيِسْمَع'},{pronoun:'היא',he:'שומעת',ar:'بِتِسْمَع'},{pronoun:'אנחנו',he:'שומעים',ar:'بِنِسْمَع'},
        {pronoun:'אתם/ן',he:'שומעים',ar:'بِتِسْمَعوا',context:'— בנאום: يِسْمَعوا'},{pronoun:'הם/ן',he:'שומעים',ar:'بِيِسْمَعوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'שמע',ar:'اِسْمَع'},{pronoun:'את',he:'שמעי',ar:'اِسْمَعي'},{pronoun:'אתם/ן',he:'שמעו',ar:'اِسْمَعوا'},
      ],
    },
  },
  {
    id: 'fihim', ar: 'فِهِم', arDisplay: 'يِفْهَموا', root: 'ف-ه-م', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'שורש שלם', gloss_he: 'להבין', gloss_en: 'to understand',
    participle: { m: 'فاهِم', f: 'فاهْمة', pl: 'فاهْمين', he: 'מבין' },
    masdar: { ar: 'فَهم', he: 'הבנה' },
    conj: {
      past: [
        {pronoun:'אני',he:'הבנתי',ar:'فِهِمْت'},{pronoun:'אתה',he:'הבנת',ar:'فِهِمْت'},{pronoun:'את',he:'הבנת',ar:'فِهِمْتي'},
        {pronoun:'הוא',he:'הבין',ar:'فِهِم'},{pronoun:'היא',he:'הבינה',ar:'فِهْمِت'},{pronoun:'אנחנו',he:'הבנו',ar:'فِهِمْنا'},
        {pronoun:'אתם/ן',he:'הבנתם',ar:'فِهِمْتوا'},{pronoun:'הם/ן',he:'הבינו',ar:'فِهْموا'},
      ],
      present: [
        {pronoun:'אני',he:'מבין/ה',ar:'بَفْهَم'},{pronoun:'אתה',he:'מבין',ar:'بِتِفْهَم'},{pronoun:'את',he:'מבינה',ar:'بِتِفْهَمي'},
        {pronoun:'הוא',he:'מבין',ar:'بِيِفْهَم'},{pronoun:'היא',he:'מבינה',ar:'بِتِفْهَم'},{pronoun:'אנחנו',he:'מבינים',ar:'بِنِفْهَم'},
        {pronoun:'אתם/ן',he:'מבינים',ar:'بِتِفْهَموا',context:'— בנאום: يِفْهَموا'},{pronoun:'הם/ן',he:'מבינים',ar:'بِيِفْهَموا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'הבן',ar:'اِفْهَم'},{pronoun:'את',he:'הביני',ar:'اِفْهَمي'},{pronoun:'אתם/ן',he:'הבינו',ar:'اِفْهَموا'},
      ],
    },
  },
  {
    id: 'haraq', ar: 'حَرَق', arDisplay: 'بِتِحْرَق', root: 'ح-ر-ق', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'שורש שלם', gloss_he: 'לשרוף, להישרף', gloss_en: 'to burn',
    participle: { m: 'حارِق', f: 'حارْقة', pl: 'حارْقين', he: 'שורף' },
    masdar: { ar: 'حَرْق', he: 'שריפה' },
    conj: {
      past: [
        {pronoun:'אני',he:'שרפתי',ar:'حَرَقْت'},{pronoun:'אתה',he:'שרפת',ar:'حَرَقْت'},{pronoun:'את',he:'שרפת',ar:'حَرَقْتي'},
        {pronoun:'הוא',he:'שרף',ar:'حَرَق'},{pronoun:'היא',he:'שרפה',ar:'حَرْقِت'},{pronoun:'אנחנו',he:'שרפנו',ar:'حَرَقْنا'},
        {pronoun:'אתם/ן',he:'שרפתם',ar:'حَرَقْتوا'},{pronoun:'הם/ן',he:'שרפו',ar:'حَرْقوا'},
      ],
      present: [
        {pronoun:'אני',he:'נשרף/ת',ar:'بَحْرَق'},{pronoun:'אתה',he:'נשרף',ar:'بِتِحْرَق',context:'— בנאום'},{pronoun:'את',he:'נשרפת',ar:'بِتِحْرَقي'},
        {pronoun:'הוא',he:'נשרף',ar:'بِيِحْرَق'},{pronoun:'היא',he:'נשרפת',ar:'بِتِحْرَق'},{pronoun:'אנחנו',he:'נשרפים',ar:'بِنِحْرَق'},
        {pronoun:'אתם/ן',he:'נשרפים',ar:'بِتِحْرَقوا'},{pronoun:'הם/ן',he:'נשרפים',ar:'بِيِحْرَقوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'שרוף',ar:'اِحْرَق'},{pronoun:'את',he:'שרפי',ar:'اِحْرَقي'},{pronoun:'אתם/ן',he:'שרפו',ar:'اِحْرَقوا'},
      ],
    },
  },
  {
    id: 'khass', ar: 'خَصّ', arDisplay: 'يْخُصّ', root: 'خ-ص-ص', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'פועל כפול', gloss_he: 'לגעת ל-, להיות קשור ל-', gloss_en: 'to concern, to be related to',
    participle: { m: 'خاصّ', f: 'خاصّة', pl: 'خاصّين', he: 'נוגע ל-' },
    masdar: { ar: 'خُصوص', he: null },
    conj: {
      past: [
        {pronoun:'אני',he:'נגעתי ל-',ar:'خَصّيت'},{pronoun:'אתה',he:'נגעת ל-',ar:'خَصّيت'},{pronoun:'את',he:'נגעת ל-',ar:'خَصّيتي'},
        {pronoun:'הוא',he:'נגע ל-',ar:'خَصّ'},{pronoun:'היא',he:'נגעה ל-',ar:'خَصِّت'},{pronoun:'אנחנו',he:'נגענו ל-',ar:'خَصّينا'},
        {pronoun:'אתם/ן',he:'נגעתם ל-',ar:'خَصّيتوا'},{pronoun:'הם/ן',he:'נגעו ל-',ar:'خَصّوا'},
      ],
      present: [
        {pronoun:'אני',he:'נוגע/ת ל-',ar:'بَخُصّ'},{pronoun:'אתה',he:'נוגע ל-',ar:'بِتْخُصّ'},{pronoun:'את',he:'נוגעת ל-',ar:'بِتْخُصّي'},
        {pronoun:'הוא',he:'נוגע ל-',ar:'بِيْخُصّ',context:'— בנאום: يْخُصّ'},{pronoun:'היא',he:'נוגעת ל-',ar:'بِتْخُصّ'},{pronoun:'אנחנו',he:'נוגעים ל-',ar:'بِنْخُصّ'},
        {pronoun:'אתם/ן',he:'נוגעים ל-',ar:'بِتْخُصّوا'},{pronoun:'הם/ן',he:'נוגעים ל-',ar:'بِيْخُصّوا'},
      ],
      imperative: [ {pronoun:'(נדיר)',he:'—',ar:'—'} ],
    },
  },
  {
    id: 'qataa', ar: 'قَطَع', arDisplay: 'مَقْطوعين', root: 'ق-ط-ع', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'שורש שלם — בטקסט מופיע כבינוני סביל: مَقْطوعين', gloss_he: 'לחתוך, לנתק', gloss_en: 'to cut, to sever',
    participle: { m: 'مَقْطوع', f: 'مَقْطوعة', pl: 'مَقْطوعين', he: 'מנותק', context: '— בנאום: مَقْطوعين' },
    masdar: { ar: 'قَطع', he: 'חיתוך' },
    conj: {
      past: [
        {pronoun:'אני',he:'חתכתי',ar:'قَطَعْت'},{pronoun:'אתה',he:'חתכת',ar:'قَطَعْت'},{pronoun:'את',he:'חתכת',ar:'قَطَعْتي'},
        {pronoun:'הוא',he:'חתך',ar:'قَطَع'},{pronoun:'היא',he:'חתכה',ar:'قَطَعِت'},{pronoun:'אנחנו',he:'חתכנו',ar:'قَطَعْنا'},
        {pronoun:'אתם/ן',he:'חתכתם',ar:'قَطَعْتوا'},{pronoun:'הם/ן',he:'חתכו',ar:'قَطَعوا'},
      ],
      present: [
        {pronoun:'אני',he:'חותך/ת',ar:'بَقْطَع'},{pronoun:'אתה',he:'חותך',ar:'بِتِقْطَع'},{pronoun:'את',he:'חותכת',ar:'بِتِقْطَعي'},
        {pronoun:'הוא',he:'חותך',ar:'بِيِقْطَع'},{pronoun:'היא',he:'חותכת',ar:'بِتِقْطَع'},{pronoun:'אנחנו',he:'חותכים',ar:'بِنِقْطَع'},
        {pronoun:'אתם/ן',he:'חותכים',ar:'بِتِقْطَعوا'},{pronoun:'הם/ן',he:'חותכים',ar:'بِيِقْطَعوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'חתוך',ar:'اِقْطَع'},{pronoun:'את',he:'חתכי',ar:'اِقْطَعي'},{pronoun:'אתם/ן',he:'חתכו',ar:'اِقْطَعوا'},
      ],
    },
  },
  {
    id: 'inqatal', ar: 'اِنْقَتَل', arDisplay: 'بِنْقِتْلوا', root: 'ق-ت-ل', binyan: 'נִפְעַל', formNum: 7,
    dialectNote: 'בניין انفعل — צורת הסביל של قتل', gloss_he: 'להיהרג', gloss_en: 'to be killed',
    participle: { m: 'مِنْقَتِل', f: 'مِنْقَتْلة', pl: 'مِنْقَتْلين', he: 'נהרג' },
    masdar: null,
    conj: {
      past: [
        {pronoun:'אני',he:'נהרגתי',ar:'اِنْقَتَلْت'},{pronoun:'אתה',he:'נהרגת',ar:'اِنْقَتَلْت'},{pronoun:'את',he:'נהרגת',ar:'اِنْقَتَلْتي'},
        {pronoun:'הוא',he:'נהרג',ar:'اِنْقَتَل'},{pronoun:'היא',he:'נהרגה',ar:'اِنْقَتَلِت'},{pronoun:'אנחנו',he:'נהרגנו',ar:'اِنْقَتَلْنا'},
        {pronoun:'אתם/ן',he:'נהרגתם',ar:'اِنْقَتَلْتوا'},{pronoun:'הם/ן',he:'נהרגו',ar:'اِنْقَتَلوا'},
      ],
      present: [
        {pronoun:'אני',he:'נהרג/ת',ar:'بَنْقِتِل'},{pronoun:'אתה',he:'נהרג',ar:'بِتِنْقِتِل'},{pronoun:'את',he:'נהרגת',ar:'بِتِنْقِتْلي'},
        {pronoun:'הוא',he:'נהרג',ar:'بِيِنْقِتِل',context:'— בנאום: بِنْقِتِل'},{pronoun:'היא',he:'נהרגת',ar:'بِتِنْقِتِل'},{pronoun:'אנחנו',he:'נהרגים',ar:'بِنِنْقِتِل'},
        {pronoun:'אתם/ן',he:'נהרגים',ar:'بِتِنْقِتْلوا'},{pronoun:'הם/ן',he:'נהרגים',ar:'بِيِنْقِتْلوا',context:'— בנאום: بِنْقِتْلوا'},
      ],
      imperative: [ {pronoun:'(לא רלוונטי)',he:'—',ar:'—'} ],
    },
  },
  {
    id: 'shaghal', ar: 'شَغَل', arDisplay: 'مَشْغولين', root: 'ش-غ-ل', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'שורש שלם — בטקסט כבינוני סביל: مَشْغول', gloss_he: 'להעסיק', gloss_en: 'to occupy, to keep busy',
    participle: { m: 'مَشْغول', f: 'مَشْغولة', pl: 'مَشْغولين', he: 'עסוק', context: '— בנאום: مَشْغولين / مَشْغولِة' },
    masdar: { ar: 'شُغْل', he: 'עיסוק' },
    conj: {
      past: [
        {pronoun:'אני',he:'העסקתי',ar:'شَغَلْت'},{pronoun:'אתה',he:'העסקת',ar:'شَغَلْت'},{pronoun:'את',he:'העסקת',ar:'شَغَلْتي'},
        {pronoun:'הוא',he:'העסיק',ar:'شَغَل'},{pronoun:'היא',he:'העסיקה',ar:'شَغَلِت'},{pronoun:'אנחנו',he:'העסקנו',ar:'شَغَلْنا'},
        {pronoun:'אתם/ן',he:'העסקתם',ar:'شَغَلْتوا'},{pronoun:'הם/ן',he:'העסיקו',ar:'شَغَلوا'},
      ],
      present: [
        {pronoun:'אני',he:'מעסיק/ה',ar:'بَشْغَل'},{pronoun:'אתה',he:'מעסיק',ar:'بِتِشْغَل'},{pronoun:'את',he:'מעסיקה',ar:'بِتِشْغَلي'},
        {pronoun:'הוא',he:'מעסיק',ar:'بِيِشْغَل'},{pronoun:'היא',he:'מעסיקה',ar:'بِتِشْغَل'},{pronoun:'אנחנו',he:'מעסיקים',ar:'بِنِشْغَل'},
        {pronoun:'אתם/ן',he:'מעסיקים',ar:'بِتِشْغَلوا'},{pronoun:'הם/ן',he:'מעסיקים',ar:'بِيِشْغَلوا'},
      ],
      imperative: [
        {pronoun:'אתה',he:'העסק',ar:'اِشْغَل'},{pronoun:'את',he:'העסיקי',ar:'اِشْغَلي'},{pronoun:'אתם/ן',he:'העסיקו',ar:'اِشْغَلوا'},
      ],
    },
  },
  {
    id: 'wijid', ar: 'وِجِد', arDisplay: 'مَوْجودين', root: 'و-ج-د', binyan: 'פָּעַל', formNum: 1,
    dialectNote: 'שורש שלם — ניב משתמש בעיקר בבינוני: موجود', gloss_he: 'להימצא, להתקיים', gloss_en: 'to exist, to be present',
    participle: { m: 'مَوْجود', f: 'مَوْجودة', pl: 'مَوْجودين', he: 'נמצא', context: '— בנאום: مَوْجودين' },
    masdar: { ar: 'وُجود', he: 'קיום' },
    conj: {
      past: [
        {pronoun:'אני',he:'נמצאתי',ar:'وِجِدْت'},{pronoun:'אתה',he:'נמצאת',ar:'وِجِدْت'},{pronoun:'את',he:'נמצאת',ar:'وِجِدْتي'},
        {pronoun:'הוא',he:'נמצא',ar:'وِجِد'},{pronoun:'היא',he:'נמצאה',ar:'وِجْدِت'},{pronoun:'אנחנו',he:'נמצאנו',ar:'وِجِدْنا'},
        {pronoun:'אתם/ן',he:'נמצאתם',ar:'وِجِدْتوا'},{pronoun:'הם/ן',he:'נמצאו',ar:'وِجْدوا'},
      ],
      present: [
        {pronoun:'אני',he:'נמצא/ת',ar:'بَوْجَد'},{pronoun:'אתה',he:'נמצא',ar:'بِتوْجَد'},{pronoun:'את',he:'נמצאת',ar:'بِتوْجَدي'},
        {pronoun:'הוא',he:'נמצא',ar:'بِيوْجَد'},{pronoun:'היא',he:'נמצאת',ar:'بِتوْجَد'},{pronoun:'אנחנו',he:'נמצאים',ar:'بِنوْجَد'},
        {pronoun:'אתם/ן',he:'נמצאים',ar:'بِتوْجَدوا'},{pronoun:'הם/ן',he:'נמצאים',ar:'بِيوْجَدوا'},
      ],
      imperative: [ {pronoun:'(לא רלוונטי)',he:'—',ar:'—'} ],
    },
  },
];
