export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  startPage: number;
  endPage: number;
  juzStart: number;
}

export interface Ayah {
  number: number; // Global ayah number (1 to 6236)
  numberInSurah: number;
  surahNumber: number;
  surahName: string;
  text: string; // Uthmani text with tashkeel
  textSimple: string; // Normalized clean text without tashkeel
  page: number; // 1 to 604
  juz: number; // 1 to 30
  rub: number; // 1 to 240
  hizbQuarter: number; // 1 to 240
  words: AyahWord[];
}

export interface AyahWord {
  id: string; // e.g., "2:255:1"
  text: string; // Word with tashkeel
  simpleText: string; // Clean word
  position: number;
  isEndSymbol?: boolean;
}

export interface RubBoundary {
  rubNumber: number;
  juzNumber: number;
  hizbNumber: number;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  verseTextSnippet: string;
  page: number;
}

export type HighlightMode = 'all' | 'custom' | 'endings' | 'beginnings' | 'mutashabihat';

export interface HighlightState {
  highlightedAyahs: Record<string, boolean>; // key: `${surah}:${ayah}`
  highlightedWords: Record<string, boolean>; // key: `${surah}:${ayah}:${wordIndex}`
  concealMode: boolean; // whether highlighted items are masked/hidden for memorization testing
  activeMode: HighlightMode;
}

export interface Bookmark {
  id: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  page: number;
  timestamp: number;
  note?: string;
  type: 'reading' | 'memorizing' | 'review';
}
