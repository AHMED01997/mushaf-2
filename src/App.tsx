import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MushafView } from './components/MushafView';
import { HighlightingTab } from './components/HighlightingTab';
import { MutashabihatQuiz } from './components/MutashabihatQuiz';
import { QuranSearchModal } from './components/QuranSearchModal';
import { SurahIndexDrawer } from './components/SurahIndexDrawer';
import { BookmarksModal } from './components/BookmarksModal';
import { OfflineManagerModal } from './components/OfflineManagerModal';
import { getAyahsForPage } from './data/quranText';
import { getSurahByPage, getJuzForPage } from './data/quranMetadata';
import { 
  loadLastPage, 
  saveLastPage, 
  loadBookmarks, 
  saveBookmarks, 
  loadHighlights, 
  saveHighlights 
} from './utils/storage';
import { getCachedPagesCount } from './utils/quranCache';
import { Bookmark, HighlightState, Ayah } from './types/quran';

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(() => loadLastPage());
  const [activeTab, setActiveTab] = useState<'mushaf' | 'highlight' | 'quiz' | 'search'>('mushaf');

  // Modals & Drawers
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isOfflineManagerOpen, setIsOfflineManagerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Highlighting State
  const [highlightState, setHighlightState] = useState<HighlightState>(() => loadHighlights());

  // Bookmarks State
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => loadBookmarks());

  // Offline Pages Cache Count
  const [offlineCount, setOfflineCount] = useState<number>(0);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Network status listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial cache count check
    getCachedPagesCount().then(setOfflineCount).catch(() => {});

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save state on change
  useEffect(() => {
    saveLastPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    saveHighlights(highlightState);
  }, [highlightState]);

  useEffect(() => {
    saveBookmarks(bookmarks);
  }, [bookmarks]);

  // Current page derived data
  const currentAyahs = getAyahsForPage(currentPage);
  const currentSurah = getSurahByPage(currentPage);
  const currentJuz = getJuzForPage(currentPage);

  // Page handlers
  const handlePageChange = (newPage: number) => {
    const clamped = Math.max(1, Math.min(604, newPage));
    setCurrentPage(clamped);
  };

  const handleNextPage = () => {
    if (currentPage < 604) handlePageChange(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) handlePageChange(currentPage - 1);
  };

  // Add bookmark
  const handleAddBookmark = (ayah: Ayah) => {
    const newBm: Bookmark = {
      id: `${ayah.surahNumber}:${ayah.numberInSurah}_${Date.now()}`,
      surahNumber: ayah.surahNumber,
      surahName: ayah.surahName,
      ayahNumber: ayah.numberInSurah,
      page: ayah.page,
      timestamp: Date.now(),
      type: 'memorizing'
    };

    setBookmarks(prev => [newBm, ...prev.filter(b => !(b.surahNumber === ayah.surahNumber && b.ayahNumber === ayah.numberInSurah))]);
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  // Highlight specific Ayah from search or reader
  const handleHighlightAyah = (ayah: Ayah) => {
    const ayahKey = `${ayah.surahNumber}:${ayah.numberInSurah}`;
    const willBeHighlighted = !highlightState.highlightedAyahs[ayahKey];

    setHighlightState(prev => {
      const nextAyahs = { ...prev.highlightedAyahs, [ayahKey]: willBeHighlighted };
      const nextWords = { ...prev.highlightedWords };

      ayah.words.forEach((_, idx) => {
        const wordKey = `${ayah.surahNumber}:${ayah.numberInSurah}:${idx}`;
        if (willBeHighlighted) {
          nextWords[wordKey] = true;
        } else {
          delete nextWords[wordKey];
        }
      });

      return {
        ...prev,
        highlightedAyahs: nextAyahs,
        highlightedWords: nextWords
      };
    });

    // Switch to highlight tab to see it
    setActiveTab('highlight');
    if (ayah.page !== currentPage) {
      setCurrentPage(ayah.page);
    }
  };

  const handleNavigateToVerse = (page: number, surahNumber?: number, ayahNumber?: number) => {
    setCurrentPage(page);
    setActiveTab('mushaf');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white pb-10">
      
      {/* Top App Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'search') {
            setIsSearchOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        openOfflineManager={() => setIsOfflineManagerOpen(true)}
        openIndexDrawer={() => setIsIndexOpen(true)}
        openBookmarks={() => setIsBookmarksOpen(true)}
        currentPage={currentPage}
        surahName={currentSurah.name}
        juzNumber={currentJuz}
        offlineCount={offlineCount}
        isOnline={isOnline}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full animate-fadeIn">
        {activeTab === 'mushaf' && (
          <MushafView
            currentPage={currentPage}
            onPageChange={handlePageChange}
            ayahs={currentAyahs}
            currentSurah={currentSurah}
            onHighlightAyah={handleHighlightAyah}
            onAddBookmark={handleAddBookmark}
            openOfflineManager={() => setIsOfflineManagerOpen(true)}
          />
        )}

        {activeTab === 'highlight' && (
          <HighlightingTab
            ayahs={currentAyahs}
            currentPage={currentPage}
            highlightState={highlightState}
            setHighlightState={setHighlightState}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            onAddBookmark={handleAddBookmark}
          />
        )}

        {activeTab === 'quiz' && (
          <MutashabihatQuiz
            onOpenVerseInMushaf={(page, surah, ayah) => {
              handleNavigateToVerse(page, surah, ayah);
            }}
          />
        )}
      </main>

      {/* Search Modal */}
      <QuranSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateToPage={handleNavigateToVerse}
        onHighlightAyah={handleHighlightAyah}
      />

      {/* Surah & Juz Index Drawer */}
      <SurahIndexDrawer
        isOpen={isIndexOpen}
        onClose={() => setIsIndexOpen(false)}
        onSelectPage={handlePageChange}
        currentPage={currentPage}
      />

      {/* Bookmarks Modal */}
      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onRemoveBookmark={handleRemoveBookmark}
        onNavigateToPage={(page) => {
          handlePageChange(page);
          setActiveTab('mushaf');
        }}
      />

      {/* Offline Download Manager Modal */}
      <OfflineManagerModal
        isOpen={isOfflineManagerOpen}
        onClose={() => setIsOfflineManagerOpen(false)}
        cachedCount={offlineCount}
        onCacheUpdated={() => {
          getCachedPagesCount().then(setOfflineCount).catch(() => {});
        }}
        isOnline={isOnline}
      />

    </div>
  );
}
