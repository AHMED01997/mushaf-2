/**
 * Quran Search Engine - Ultra Clean Uthmani & Imla'i Normalization
 * 
 * Rules ensuring:
 * 1. "المنافقين" matches only "الْمُنَٰفِقِينَ" and NEVER "الْمُنفِقِينَ".
 * 2. "المنفقين" matches only "الْمُنفِقِينَ" and NEVER "الْمُنَٰفِقِينَ".
 * 3. "الكفر" matches only "الْكُفْرَ" / "كفر" and NEVER "الْكُفَّارَ" / "كفار".
 * 4. Sub-millisecond execution with zero UI lag or freezing.
 */

export interface SearchMatch {
  ayahNumber: number;
  numberInSurah: number;
  surahNumber: number;
  surahName: string;
  juz: number;
  page: number;
  textUthmani: string;
  highlightedText: string;
  matchedWords: string[];
}

export type SearchMode = 'exact-word' | 'exact-phrase' | 'contains';

/**
 * Converts Quranic Uthmani text to a clean searchable representation:
 * - Converts dagger alif (U+0670) to standard alif ('ا') so "الْمُنَٰفِقِينَ" becomes "المنافقين".
 * - Words without dagger alif like "الْمُنفِقِينَ" remain "المنفقين".
 * - Strips all harakat / tashkeel (fatha, damma, kasra, sukun, shadda, tanween).
 * - Strips Quranic annotation signs (sajda, waqf, hizb rub', etc.).
 * - Normalizes alif wasla (ٱ -> ا) and hamzated alif (أ, إ, آ -> ا) if requested.
 */
export function normalizeQuranText(text: string, options: { normalizeHamza?: boolean; normalizeYaa?: boolean } = {}): string {
  if (!text) return '';

  const { normalizeHamza = true, normalizeYaa = false } = options;

  let result = text;

  // 1. Convert Dagger Alif (U+0670) to normal Alif 'ا' BEFORE stripping harakat!
  // This is the crucial fix for المنافقين vs المنفقين.
  // In Uthmani, المنافقين is written with dagger alif: الْمُنَٰفِقِينَ
  // While المنفقين has no dagger alif: الْمُنفِقِينَ
  result = result.replace(/\u0670/g, 'ا');

  // 2. Normalize Alif Wasla (ٱ) to regular Alif (ا)
  result = result.replace(/\u0671/g, 'ا');

  // 3. Remove all Quranic punctuation marks and annotation signs (U+06D6 to U+06ED)
  result = result.replace(/[\u06D6-\u06ED]/g, '');

  // 4. Remove small letters and marks
  result = result.replace(/[\u06DF-\u06E8]/g, '');

  // 5. Remove standard Arabic Tashkeel / Harakat:
  // Tanween (Fathatan, Dammatan, Kasratan: 064B - 064D)
  // Harakat (Fatha, Damma, Kasra, Shadda, Sukun: 064E - 0652)
  // Maddah, hamza above/below marks (0653 - 065F)
  result = result.replace(/[\u064B-\u065F]/g, '');

  // 6. Tatweel (kashida)
  result = result.replace(/\u0640/g, '');

  // 7. Hamza Normalization (optional, standardizes search)
  if (normalizeHamza) {
    result = result.replace(/[أإآء]/g, 'ا');
    result = result.replace(/ؤ/g, 'و');
    result = result.replace(/ئ/g, 'ي');
  }

  // 8. Normalize Yaa / Alif Maqsura if requested
  if (normalizeYaa) {
    result = result.replace(/ى/g, 'ي');
  }

  // 9. Standardize spaces
  result = result.replace(/\s+/g, ' ').trim();

  return result;
}

/**
 * Tokenizes text into individual clean words
 */
export function tokenizeWords(text: string): string[] {
  return normalizeQuranText(text)
    .split(/\s+/)
    .map(w => w.trim())
    .filter(Boolean);
}

/**
 * Checks if a word in the text matches the query word accurately.
 * Allows common Arabic prefixes (و, ف, ب, ك, ل, ال) but strictly protects
 * word stems so "الكفر" will NEVER match "الكفار", and "المنافقين" will NEVER match "المنفقين".
 */
export function isWordMatch(textWord: string, queryWord: string): boolean {
  if (textWord === queryWord) return true;

  // Exact without 'ال'
  const textWithoutAl = textWord.startsWith('ال') ? textWord.slice(2) : textWord;
  const queryWithoutAl = queryWord.startsWith('ال') ? queryWord.slice(2) : queryWord;
  if (textWithoutAl === queryWithoutAl && textWithoutAl.length > 2) return true;

  // Single letter conjunctions: و, ف, ب, ك, ل
  const prefixes = ['و', 'ف', 'ب', 'ك', 'ل', 'وال', 'فال', 'بال', 'كال', 'لل'];
  for (const prefix of prefixes) {
    if (textWord.startsWith(prefix) && textWord.slice(prefix.length) === queryWithoutAl) {
      return true;
    }
    if (queryWord.startsWith(prefix) && queryWord.slice(prefix.length) === textWithoutAl) {
      return true;
    }
  }

  return false;
}

/**
 * Highlights matches within the original Uthmani text safely
 */
export function highlightUthmaniText(uthmaniText: string, query: string): string {
  if (!query || !uthmaniText) return uthmaniText;

  const normalizedQuery = normalizeQuranText(query);
  const words = uthmaniText.split(' ');

  const highlightedWords = words.map(word => {
    const normWord = normalizeQuranText(word);
    
    // Check if whole word matches or contains query
    if (normWord === normalizedQuery || isWordMatch(normWord, normalizedQuery)) {
      return `<mark class="bg-amber-400/30 text-amber-200 px-1 py-0.5 rounded font-bold border-b border-amber-400">${word}</mark>`;
    }
    if (normalizedQuery.length >= 3 && normWord.includes(normalizedQuery)) {
      return `<mark class="bg-amber-400/20 text-amber-100 px-0.5 rounded">${word}</mark>`;
    }
    return word;
  });

  return highlightedWords.join(' ');
}
