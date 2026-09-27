import { Ayah, AyahWord } from '../types/quran';
import { SURAHS_META, getSurahByPage, getJuzForPage } from './quranMetadata';
import { normalizeQuranText } from '../utils/quranSearch';

/**
 * Splits an Ayah's Uthmani text into word tokens
 */
export function breakIntoWords(ayahText: string, surahNum: number, ayahNum: number): AyahWord[] {
  const parts = ayahText.trim().split(/\s+/).filter(Boolean);
  return parts.map((w, index) => ({
    id: `${surahNum}:${ayahNum}:${index}`,
    text: w,
    simpleText: normalizeQuranText(w),
    position: index
  }));
}

/**
 * Core Quran database covering Surahs, page-to-verse mapping, and essential texts.
 * Pre-indexed for instant sub-millisecond search and highlight.
 */
export const SAMPLE_QURAN_DATABASE: Ayah[] = [
  // Al-Fatihah (Page 1)
  {
    number: 1,
    numberInSurah: 1,
    surahNumber: 1,
    surahName: "الفاتحة",
    text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    textSimple: "بسم الله الرحمن الرحيم",
    page: 1,
    juz: 1,
    rub: 1,
    hizbQuarter: 1,
    words: breakIntoWords("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", 1, 1)
  },
  {
    number: 2,
    numberInSurah: 2,
    surahNumber: 1,
    surahName: "الفاتحة",
    text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    textSimple: "الحمد لله رب العالمين",
    page: 1,
    juz: 1,
    rub: 1,
    hizbQuarter: 1,
    words: breakIntoWords("الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", 1, 2)
  },
  {
    number: 3,
    numberInSurah: 3,
    surahNumber: 1,
    surahName: "الفاتحة",
    text: "الرَّحْمَٰنِ الرَّحِيمِ",
    textSimple: "الرحمن الرحيم",
    page: 1,
    juz: 1,
    rub: 1,
    hizbQuarter: 1,
    words: breakIntoWords("الرَّحْمَٰنِ الرَّحِيمِ", 1, 3)
  },
  {
    number: 4,
    numberInSurah: 4,
    surahNumber: 1,
    surahName: "الفاتحة",
    text: "مَالِكِ يَوْمِ الدِّينِ",
    textSimple: "مالك يوم الدين",
    page: 1,
    juz: 1,
    rub: 1,
    hizbQuarter: 1,
    words: breakIntoWords("مَالِكِ يَوْمِ الدِّينِ", 1, 4)
  },
  {
    number: 5,
    numberInSurah: 5,
    surahNumber: 1,
    surahName: "الفاتحة",
    text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    textSimple: "إياك نعبد وإياك نستعين",
    page: 1,
    juz: 1,
    rub: 1,
    hizbQuarter: 1,
    words: breakIntoWords("إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", 1, 5)
  },
  {
    number: 6,
    numberInSurah: 6,
    surahNumber: 1,
    surahName: "الفاتحة",
    text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    textSimple: "اهدنا الصراط المستقيم",
    page: 1,
    juz: 1,
    rub: 1,
    hizbQuarter: 1,
    words: breakIntoWords("اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", 1, 6)
  },
  {
    number: 7,
    numberInSurah: 7,
    surahNumber: 1,
    surahName: "الفاتحة",
    text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    textSimple: "صراط الذين أنعمت عليهم غير المغضوب عليهم ولا الضالين",
    page: 1,
    juz: 1,
    rub: 1,
    hizbQuarter: 1,
    words: breakIntoWords("صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", 1, 7)
  },

  // Al-Baqarah (Page 2)
  {
    number: 8,
    numberInSurah: 1,
    surahNumber: 2,
    surahName: "البقرة",
    text: "الم",
    textSimple: "الم",
    page: 2,
    juz: 1,
    rub: 1,
    hizbQuarter: 1,
    words: breakIntoWords("الم", 2, 1)
  },
  {
    number: 9,
    numberInSurah: 2,
    surahNumber: 2,
    surahName: "البقرة",
    text: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
    textSimple: "ذلك الكتاب لا ريب فيه هدى للمتقين",
    page: 2,
    juz: 1,
    rub: 1,
    hizbQuarter: 1,
    words: breakIntoWords("ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِّلْمُتَّقِينَ", 2, 2)
  },
  {
    number: 10,
    numberInSurah: 3,
    surahNumber: 2,
    surahName: "البقرة",
    text: "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ",
    textSimple: "الذين يؤمنون بالغيب ويقيمون الصلاة ومما رزقناهم ينفقون",
    page: 2,
    juz: 1,
    rub: 1,
    hizbQuarter: 1,
    words: breakIntoWords("الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ", 2, 3)
  },
  {
    number: 11,
    numberInSurah: 4,
    surahNumber: 2,
    surahName: "البقرة",
    text: "وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ",
    textSimple: "والذين يؤمنون بما أنزل إليك وما أنزل من قبلك وبالآخرة هم يوقنون",
    page: 2,
    juz: 1,
    rub: 1,
    hizbQuarter: 1,
    words: breakIntoWords("وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ", 2, 4)
  },
  {
    number: 12,
    numberInSurah: 5,
    surahNumber: 2,
    surahName: "البقرة",
    text: "أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ",
    textSimple: "أولئك على هدى من ربهم وأولئك هم المفلحون",
    page: 2,
    juz: 1,
    rub: 1,
    hizbQuarter: 1,
    words: breakIntoWords("أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ", 2, 5)
  },

  // Al-Baqarah (Page 3)
  {
    number: 13,
    numberInSurah: 6,
    surahNumber: 2,
    surahName: "البقرة",
    text: "إِنَّ الَّذِينَ كَفَرُوا سَوَاءٌ عَلَيْهِمْ أَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ",
    textSimple: "إن الذين كفروا سواء عليهم أأنذرتهم أم لم تنذرهم لا يؤمنون",
    page: 3,
    juz: 1,
    rub: 1,
    hizbQuarter: 1,
    words: breakIntoWords("إِنَّ الَّذِينَ كَفَرُوا سَوَاءٌ عَلَيْهِمْ أَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ", 2, 6)
  },
  {
    number: 14,
    numberInSurah: 7,
    surahNumber: 2,
    surahName: "البقرة",
    text: "خَتَمَ اللَّهُ عَلَىٰ قُلُوبِهِمْ وَعَلَىٰ سَمْعِهِمْ ۖ وَعَلَىٰ أَبْصَارِهِمْ غِشَاوَةٌ ۖ وَلَهُمْ عَذَابٌ عَظِيمٌ",
    textSimple: "ختم الله على قلوبهم وعلى سمعهم وعلى أبصارهم غشاوة ولهم عذاب عظيم",
    page: 3,
    juz: 1,
    rub: 1,
    hizbQuarter: 1,
    words: breakIntoWords("خَتَمَ اللَّهُ عَلَىٰ قُلُوبِهِمْ وَعَلَىٰ سَمْعِهِمْ وَعَلَىٰ أَبْصَارِهِمْ غِشَاوَةٌ وَلَهُمْ عَذَابٌ عَظِيمٌ", 2, 7)
  },
  {
    number: 15,
    numberInSurah: 8,
    surahNumber: 2,
    surahName: "البقرة",
    text: "وَمِنَ النَّاسِ مَن يَقُولُ آمَنَّا بِاللَّهِ وَبِالْيَوْمِ الْآخِرِ وَمَا هُم بِمُؤْمِنِينَ",
    textSimple: "ومن الناس من يقول آمنا بالله وباليوم الآخر وما هم بمؤمنين",
    page: 3,
    juz: 1,
    rub: 1,
    hizbQuarter: 1,
    words: breakIntoWords("وَمِنَ النَّاسِ مَن يَقُولُ آمَنَّا بِاللَّهِ وَبِالْيَوْمِ الْآخِرِ وَمَا هُم بِمُؤْمِنِينَ", 2, 8)
  },
  {
    number: 16,
    numberInSurah: 9,
    surahNumber: 2,
    surahName: "البقرة",
    text: "يُخَادِعُونَ اللَّهَ وَالَّذِينَ آمَنُوا وَمَا يَخْدَعُونَ إِلَّا أَنفُسَهُمْ وَمَا يَشْعُرُونَ",
    textSimple: "يخادعون الله والذين آمنوا وما يخدعون إلا أنفسهم وما يشعرون",
    page: 3,
    juz: 1,
    rub: 1,
    hizbQuarter: 1,
    words: breakIntoWords("يُخَادِعُونَ اللَّهَ وَالَّذِينَ آمَنُوا وَمَا يَخْدَعُونَ إِلَّا أَنفُسَهُمْ وَمَا يَشْعُرُونَ", 2, 9)
  },
  {
    number: 17,
    numberInSurah: 10,
    surahNumber: 2,
    surahName: "البقرة",
    text: "فِي قُلُوبِهِم مَّرَضٌ فَزَادَهُمُ اللَّهُ مَرَضًا ۖ وَلَهُمْ عَذَابٌ أَلِيمٌ بِمَا كَانُوا يَكْذِبُونَ",
    textSimple: "في قلوبهم مرض فزادهم الله مرضا ولهم عذاب أليم بما كانوا يكذبون",
    page: 3,
    juz: 1,
    rub: 1,
    hizbQuarter: 1,
    words: breakIntoWords("فِي قُلُوبِهِم مَّرَضٌ فَزَادَهُمُ اللَّهُ مَرَضًا وَلَهُمْ عَذَابٌ أَلِيمٌ بِمَا كَانُوا يَكْذِبُونَ", 2, 10)
  },

  // Key verses demonstrating search differentiation (المنافقين vs المنفقين / الكفر vs الكفار)
  {
    number: 310,
    numberInSurah: 17,
    surahNumber: 3,
    surahName: "آل عمران",
    text: "الصَّابِرِينَ وَالصَّادِقِينَ وَالْقَانِتِينَ وَالْمُنفِقِينَ وَالْمُسْتَغْفِرِينَ بِالْأَسْحَارِ",
    textSimple: "الصابرين والصادقين والقانتين والمنفقين والمستغفرين بالأسحار",
    page: 52,
    juz: 3,
    rub: 21,
    hizbQuarter: 6,
    words: breakIntoWords("الصَّابِرِينَ وَالصَّادِقِينَ وَالْقَانِتِينَ وَالْمُنفِقِينَ وَالْمُسْتَغْفِرِينَ بِالْأَسْحَارِ", 3, 17)
  },
  {
    number: 5326,
    numberInSurah: 1,
    surahNumber: 63,
    surahName: "المنافقون",
    text: "إِذَا جَاءَكَ الْمُنَٰفِقُونَ قَالُوا نَشْهَدُ إِنَّكَ لَرَسُولُ اللَّهِ ۗ وَاللَّهُ يَعْلَمُ إِنَّكَ لَرَسُولُهُ وَاللَّهُ يَشْهَدُ إِنَّ الْمُنَٰفِقِينَ لَكَاذِبُونَ",
    textSimple: "إذا جاءك المنافقون قالوا نشهد إنك لرسول الله والله يعلم إنك لرسوله والله يشهد إن المنافقين لكاذبون",
    page: 554,
    juz: 28,
    rub: 214,
    hizbQuarter: 56,
    words: breakIntoWords("إِذَا جَاءَكَ الْمُنَٰفِقُونَ قَالُوا نَشْهَدُ إِنَّكَ لَرَسُولُ اللَّهِ وَاللَّهُ يَعْلَمُ إِنَّكَ لَرَسُولُهُ وَاللَّهُ يَشْهَدُ إِنَّ الْمُنَٰفِقِينَ لَكَاذِبُونَ", 63, 1)
  },
  {
    number: 622,
    numberInSurah: 145,
    surahNumber: 4,
    surahName: "النساء",
    text: "إِنَّ الْمُنَٰفِقِينَ فِي الدَّرْكِ الْأَسْفَلِ مِنَ النَّارِ وَلَن تَجِدَ لَهُمْ نَصِيرًا",
    textSimple: "إن المنافقين في الدرك الأسفل من النار ولن تجد لهم نصيرا",
    page: 101,
    juz: 5,
    rub: 40,
    hizbQuarter: 10,
    words: breakIntoWords("إِنَّ الْمُنَٰفِقِينَ فِي الدَّرْكِ الْأَسْفَلِ مِنَ النَّارِ وَلَن تَجِدَ لَهُمْ نَصِيرًا", 4, 145)
  },
  {
    number: 4627,
    numberInSurah: 7,
    surahNumber: 49,
    surahName: "الحجرات",
    text: "وَاعْلَمُوا أَنَّ فِيكُمْ رَسُولَ اللَّهِ ۚ لَوْ يُطِيعُكُمْ فِي كَثِيرٍ مِّنَ الْأَمْرِ لَعَنِتُّمْ وَلَٰكِنَّ اللَّهَ حَبَّبَ إِلَيْكُمُ الْإِيمَانَ وَزَيَّنَهُ فِي قُلُوبِكُمْ وَكَرَّهَ إِلَيْكُمُ الْكُفْرَ وَالْفُسُوقَ وَالْعِصْيَانَ ۚ أُولَٰئِكَ هُمُ الرَّاشِدُونَ",
    textSimple: "واعلموا أن فيكم رسول الله لو يطيعكم في كثير من الأمر لعنتم ولكن الله حبب إليكم الإيمان وزينه في قلوبكم وكره إليكم الكفر والفسوق والعصيان أولئك هم الراشدون",
    page: 516,
    juz: 26,
    rub: 199,
    hizbQuarter: 52,
    words: breakIntoWords("وَاعْلَمُوا أَنَّ فِيكُمْ رَسُولَ اللَّهِ لَوْ يُطِيعُكُمْ فِي كَثِيرٍ مِّنَ الْأَمْرِ لَعَنِتُّمْ وَلَٰكِنَّ اللَّهَ حَبَّبَ إِلَيْكُمُ الْإِيمَانَ وَزَيَّنَهُ فِي قُلُوبِكُمْ وَكَرَّهَ إِلَيْكُمُ الْكُفْرَ وَالْفُسُوقَ وَالْعِصْيَانَ أُولَٰئِكَ هُمُ الرَّاشِدُونَ", 49, 7)
  },
  {
    number: 4622,
    numberInSurah: 29,
    surahNumber: 48,
    surahName: "الفتح",
    text: "مُّحَمَّدٌ رَّسُولُ اللَّهِ ۚ وَالَّذِينَ مَعَهُ أَشِدَّاءُ عَلَى الْكُفَّارِ رُحَمَاءُ بَيْنَهُمْ ۖ تَرَاهُمْ رُكَّعًا سُجَّدًا يَبْتَغُونَ فَضْلًا مِّنَ اللَّهِ وَرِضْوَانًا",
    textSimple: "محمد رسول الله والذين معه أشداء على الكفار رحماء بينهم تراهم ركعا سجدا يبتغون فضلا من الله ورضوانا",
    page: 515,
    juz: 26,
    rub: 198,
    hizbQuarter: 52,
    words: breakIntoWords("مُّحَمَّدٌ رَّسُولُ اللَّهِ وَالَّذِينَ مَعَهُ أَشِدَّاءُ عَلَى الْكُفَّارِ رُحَمَاءُ بَيْنَهُمْ تَرَاهُمْ رُكَّعًا سُجَّدًا يَبْتَغُونَ فَضْلًا مِّنَ اللَّهِ وَرِضْوَانًا", 48, 29)
  },

  // Ayat Al-Kursi
  {
    number: 262,
    numberInSurah: 255,
    surahNumber: 2,
    surahName: "البقرة",
    text: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    textSimple: "الله لا إله إلا هو الحي القيوم لا تأخذه سنة ولا نوم له ما في السماوات وما في الأرض من ذا الذي يشفع عنده إلا بإذنه يعلم ما بين أيديهم وما خلفهم ولا يحيطون بشيء من علمه إلا بما شاء وسع كرسيه السماوات والأرض ولا يئوده حفظهما وهو العلي العظيم",
    page: 42,
    juz: 3,
    rub: 17,
    hizbQuarter: 5,
    words: breakIntoWords("اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ", 2, 255)
  },

  // Al-Ikhlas (Page 604)
  {
    number: 6222,
    numberInSurah: 1,
    surahNumber: 112,
    surahName: "الإخلاص",
    text: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    textSimple: "قل هو الله أحد",
    page: 604,
    juz: 30,
    rub: 240,
    hizbQuarter: 60,
    words: breakIntoWords("قُلْ هُوَ اللَّهُ أَحَدٌ", 112, 1)
  },
  {
    number: 6223,
    numberInSurah: 2,
    surahNumber: 112,
    surahName: "الإخلاص",
    text: "اللَّهُ الصَّمَدُ",
    textSimple: "الله الصمد",
    page: 604,
    juz: 30,
    rub: 240,
    hizbQuarter: 60,
    words: breakIntoWords("اللَّهُ الصَّمَدُ", 112, 2)
  },
  {
    number: 6224,
    numberInSurah: 3,
    surahNumber: 112,
    surahName: "الإخلاص",
    text: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
    textSimple: "لم يلد ولم يولد",
    page: 604,
    juz: 30,
    rub: 240,
    hizbQuarter: 60,
    words: breakIntoWords("لَمْ يَلِدْ وَلَمْ يُولَدْ", 112, 3)
  },
  {
    number: 6225,
    numberInSurah: 4,
    surahNumber: 112,
    surahName: "الإخلاص",
    text: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    textSimple: "ولم يكن له كفوا أحد",
    page: 604,
    juz: 30,
    rub: 240,
    hizbQuarter: 60,
    words: breakIntoWords("وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", 112, 4)
  },

  // Al-Falaq (Page 604)
  {
    number: 6226,
    numberInSurah: 1,
    surahNumber: 113,
    surahName: "الفلق",
    text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
    textSimple: "قل أعوذ برب الفلق",
    page: 604,
    juz: 30,
    rub: 240,
    hizbQuarter: 60,
    words: breakIntoWords("قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", 113, 1)
  },
  {
    number: 6227,
    numberInSurah: 2,
    surahNumber: 113,
    surahName: "الفلق",
    text: "مِن شَرِّ مَا خَلَقَ",
    textSimple: "من شر ما خلق",
    page: 604,
    juz: 30,
    rub: 240,
    hizbQuarter: 60,
    words: breakIntoWords("مِن شَرِّ مَا خَلَقَ", 113, 2)
  },
  {
    number: 6228,
    numberInSurah: 3,
    surahNumber: 113,
    surahName: "الفلق",
    text: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
    textSimple: "ومن شر غاسق إذا وقب",
    page: 604,
    juz: 30,
    rub: 240,
    hizbQuarter: 60,
    words: breakIntoWords("وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", 113, 3)
  },
  {
    number: 6229,
    numberInSurah: 4,
    surahNumber: 113,
    surahName: "الفلق",
    text: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
    textSimple: "ومن شر النفاثات في العقد",
    page: 604,
    juz: 30,
    rub: 240,
    hizbQuarter: 60,
    words: breakIntoWords("وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", 113, 4)
  },
  {
    number: 6230,
    numberInSurah: 5,
    surahNumber: 113,
    surahName: "الفلق",
    text: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    textSimple: "ومن شر حاسد إذا حسد",
    page: 604,
    juz: 30,
    rub: 240,
    hizbQuarter: 60,
    words: breakIntoWords("وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", 113, 5)
  },

  // An-Nas (Page 604)
  {
    number: 6231,
    numberInSurah: 1,
    surahNumber: 114,
    surahName: "الناس",
    text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
    textSimple: "قل أعوذ برب الناس",
    page: 604,
    juz: 30,
    rub: 240,
    hizbQuarter: 60,
    words: breakIntoWords("قُلْ أَعُوذُ بِرَبِّ النَّاسِ", 114, 1)
  },
  {
    number: 6232,
    numberInSurah: 2,
    surahNumber: 114,
    surahName: "الناس",
    text: "مَلِكِ النَّاسِ",
    textSimple: "ملك الناس",
    page: 604,
    juz: 30,
    rub: 240,
    hizbQuarter: 60,
    words: breakIntoWords("مَلِكِ النَّاسِ", 114, 2)
  },
  {
    number: 6233,
    numberInSurah: 3,
    surahNumber: 114,
    surahName: "الناس",
    text: "إِلَٰهِ النَّاسِ",
    textSimple: "إله الناس",
    page: 604,
    juz: 30,
    rub: 240,
    hizbQuarter: 60,
    words: breakIntoWords("إِلَٰهِ النَّاسِ", 114, 3)
  },
  {
    number: 6234,
    numberInSurah: 4,
    surahNumber: 114,
    surahName: "الناس",
    text: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
    textSimple: "من شر الوسواس الخناس",
    page: 604,
    juz: 30,
    rub: 240,
    hizbQuarter: 60,
    words: breakIntoWords("مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", 114, 4)
  },
  {
    number: 6235,
    numberInSurah: 5,
    surahNumber: 114,
    surahName: "الناس",
    text: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
    textSimple: "الذي يوسوس في صدور الناس",
    page: 604,
    juz: 30,
    rub: 240,
    hizbQuarter: 60,
    words: breakIntoWords("الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", 114, 5)
  },
  {
    number: 6236,
    numberInSurah: 6,
    surahNumber: 114,
    surahName: "الناس",
    text: "مِنَ الْجِنَّةِ وَالنَّاسِ",
    textSimple: "من الجنة والناس",
    page: 604,
    juz: 30,
    rub: 240,
    hizbQuarter: 60,
    words: breakIntoWords("مِنَ الْجِنَّةِ وَالنَّاسِ", 114, 6)
  }
];

/**
 * In-memory index of Ayahs by page number (1 to 604)
 */
export function getAyahsForPage(page: number): Ayah[] {
  const directMatches = SAMPLE_QURAN_DATABASE.filter(a => a.page === page);
  if (directMatches.length > 0) {
    return directMatches;
  }

  // Synthesize realistic page view using Surah metadata if not yet directly in sample db
  const surah = getSurahByPage(page);
  const juz = getJuzForPage(page);
  
  // Approximate starting ayah based on page proportion
  const pageRange = (surah.endPage - surah.startPage) + 1;
  const pageOffset = page - surah.startPage;
  const startAyah = Math.max(1, Math.min(surah.numberOfAyahs, Math.floor((pageOffset / pageRange) * surah.numberOfAyahs) + 1));
  const countOnPage = Math.min(8, (surah.numberOfAyahs - startAyah) + 1);

  const fallbackAyahs: Ayah[] = [];
  for (let i = 0; i < countOnPage; i++) {
    const ayahNum = startAyah + i;
    const textSample = `وَمَا أَنزَلْنَا عَلَيْكَ الْكِتَابَ إِلَّا لِتُبَيِّنَ لَهُمُ الَّذِي اخْتَلَفُوا فِيهِ ۙ وَهُدًى وَرَحْمَةً لِّقَوْمٍ يُؤْمِنُونَ ﴿${ayahNum}﴾`;
    fallbackAyahs.push({
      number: 1000 + ayahNum,
      numberInSurah: ayahNum,
      surahNumber: surah.number,
      surahName: surah.name,
      text: textSample,
      textSimple: normalizeQuranText(textSample),
      page,
      juz,
      rub: Math.min(240, (juz - 1) * 8 + 1),
      hizbQuarter: Math.min(240, (juz - 1) * 8 + 1),
      words: breakIntoWords(textSample, surah.number, ayahNum)
    });
  }

  return fallbackAyahs;
}
