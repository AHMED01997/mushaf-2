import { Bookmark, HighlightState } from '../types/quran';
import { QuizProgress } from '../types/mutashabihat';

const STORAGE_KEYS = {
  LAST_PAGE: 'quran_last_page',
  BOOKMARKS: 'quran_bookmarks',
  HIGHLIGHTS: 'quran_highlights_v2',
  QUIZ_PROGRESS: 'quran_quiz_progress_v2',
  VIEW_MODE: 'quran_view_mode', // 'mushaf' | 'text'
  DARK_MODE: 'quran_dark_mode',
  FONT_SIZE: 'quran_font_size'
};

export function loadLastPage(): number {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.LAST_PAGE);
    const parsed = val ? parseInt(val, 10) : 1;
    return parsed >= 1 && parsed <= 604 ? parsed : 1;
  } catch {
    return 1;
  }
}

export function saveLastPage(page: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_PAGE, String(page));
  } catch (e) {
    console.error(e);
  }
}

export function loadBookmarks(): Bookmark[] {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}

export function saveBookmarks(bookmarks: Bookmark[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  } catch (e) {
    console.error(e);
  }
}

export function loadHighlights(): HighlightState {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.HIGHLIGHTS);
    if (val) {
      return JSON.parse(val);
    }
  } catch {
    // fallback
  }
  return {
    highlightedAyahs: {},
    highlightedWords: {},
    concealMode: false,
    activeMode: 'custom'
  };
}

export function saveHighlights(state: HighlightState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(state));
  } catch (e) {
    console.error(e);
  }
}

export function loadQuizProgress(): QuizProgress {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.QUIZ_PROGRESS);
    if (val) {
      return JSON.parse(val);
    }
  } catch {
    // fallback
  }
  return {
    totalAnswered: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    streak: 0,
    bestStreak: 0,
    answeredQuestionIds: {},
    flaggedQuestionIds: []
  };
}

export function saveQuizProgress(progress: QuizProgress): void {
  try {
    localStorage.setItem(STORAGE_KEYS.QUIZ_PROGRESS, JSON.stringify(progress));
  } catch (e) {
    console.error(e);
  }
}
