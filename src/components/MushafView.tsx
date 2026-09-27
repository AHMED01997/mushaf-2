import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Sliders, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  BookOpen, 
  Type, 
  Sparkles,
  Bookmark,
  Copy,
  Check,
  Highlighter,
  DownloadCloud
} from 'lucide-react';
import { Ayah, SurahMeta } from '../types/quran';
import { getMushafPageUrl, preloadNeighborPages, isPageCached } from '../utils/quranCache';

interface MushafViewProps {
  currentPage: number;
  onPageChange: (newPage: number) => void;
  ayahs: Ayah[];
  currentSurah: SurahMeta;
  onHighlightAyah: (ayah: Ayah) => void;
  onAddBookmark: (ayah: Ayah) => void;
  openOfflineManager: () => void;
}

export const MushafView: React.FC<MushafViewProps> = ({
  currentPage,
  onPageChange,
  ayahs,
  currentSurah,
  onHighlightAyah,
  onAddBookmark,
  openOfflineManager
}) => {
  const [renderMode, setRenderMode] = useState<'image' | 'text'>('image');
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [isCached, setIsCached] = useState(false);

  // Preload neighboring pages for instant flipping
  useEffect(() => {
    preloadNeighborPages(currentPage, 3);
    setImageError(false);
    setImageLoaded(false);

    isPageCached(currentPage).then(setIsCached).catch(() => {});
  }, [currentPage]);

  const handleNext = () => {
    if (currentPage < 604) onPageChange(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleCopy = (ayah: Ayah) => {
    navigator.clipboard.writeText(`${ayah.text} [سورة ${ayah.surahName}: ${ayah.numberInSurah}]`);
    setCopiedAyah(ayah.number);
    setTimeout(() => setCopiedAyah(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 space-y-4">
      
      {/* View Options & Page Header */}
      <div className="flex items-center justify-between gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md">
        
        {/* Page & Surah Info */}
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="font-bold text-emerald-400">
            سورة {currentSurah.name}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">
            الجزء {ayahs[0]?.juz || 1}
          </span>
          <span className="text-slate-500">•</span>
          <span className="font-mono font-bold text-amber-400">
            صفحة {currentPage}
          </span>
          {isCached && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700/40 text-[10px] text-emerald-300">
              محفوظة أوفلاين
            </span>
          )}
        </div>

        {/* View Mode & Zoom Controls */}
        <div className="flex items-center gap-2">
          {renderMode === 'image' && (
            <div className="hidden sm:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-slate-400">
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.6))}
                className="p-1 hover:text-slate-200"
                title="تكبير"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="px-1 text-[11px] font-mono text-slate-300"
                title="إعادة ضبط الحجم"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.8))}
                className="p-1 hover:text-slate-200"
                title="تصغير"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Toggle Image vs Interactive Text Mode */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setRenderMode('image')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-all ${
                renderMode === 'image'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>مصحف المدينة</span>
            </button>

            <button
              onClick={() => setRenderMode('text')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-all ${
                renderMode === 'text'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>رسم عثماني تفاعلي</span>
            </button>
          </div>

        </div>

      </div>

      {/* MAIN MUSHAF DISPLAY FRAME */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-900/40 bg-[#fdfbf7] dark:bg-[#131d2a] transition-all">
        
        {/* MODE A: HIGH RES MEDINA SCANNED PAGE WITH INSTANT CACHE */}
        {renderMode === 'image' && !imageError && (
          <div className="w-full flex items-center justify-center p-2 sm:p-6 overflow-auto min-h-[680px]">
            {!imageLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/20 backdrop-blur-sm z-10 text-slate-400">
                <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-semibold">جاري فتح صفحة {currentPage}...</span>
              </div>
            )}
            <img
              src={getMushafPageUrl(currentPage)}
              alt={`مصحف المدينة صفحة ${currentPage}`}
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setRenderMode('text');
              }}
              className="max-h-[82vh] w-auto object-contain rounded-xl shadow-md transition-transform duration-200 select-none"
              loading="eager"
            />
          </div>
        )}

        {/* MODE B: INTERACTIVE UTHMANIC VECTOR TYPOGRAPHY */}
        {(renderMode === 'text' || imageError) && (
          <div className="p-6 sm:p-10 space-y-6 text-right min-h-[680px] bg-[#fbf9f4] dark:bg-[#101a26]">
            
            {/* Surah Header Banner if it starts on this page */}
            {ayahs.some(a => a.numberInSurah === 1) && (
              <div className="my-4 p-4 text-center border-y-2 border-amber-600/40 bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 rounded-2xl">
                <h3 className="font-quran text-2xl sm:text-3xl font-bold text-amber-500 dark:text-amber-300">
                  سُورَةُ {currentSurah.name}
                </h3>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                  {currentSurah.revelationType === 'Meccan' ? 'مَكِّيَّةٌ' : 'مَدَنِيَّةٌ'} • آيَاتُهَا {currentSurah.numberOfAyahs}
                </p>
                {currentSurah.number !== 9 && currentSurah.number !== 1 && (
                  <p className="font-quran text-xl sm:text-2xl text-slate-800 dark:text-slate-200 mt-3">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                )}
              </div>
            )}

            {/* Verses Layout with Uthmanic Verse Enders */}
            <div className="font-quran text-2xl sm:text-3xl text-slate-900 dark:text-slate-100 leading-[2.6] sm:leading-[2.8] text-justify selection:bg-amber-400/30">
              {ayahs.map((ayah) => (
                <span 
                  key={ayah.number}
                  className="group hover:bg-amber-400/20 rounded px-1 transition-colors cursor-pointer inline"
                  title={`انقر لخيارات الآية ${ayah.numberInSurah}`}
                  onClick={() => onHighlightAyah(ayah)}
                >
                  <span>{ayah.text}</span>
                  <span className="inline-flex items-center justify-center text-amber-600 dark:text-amber-400 text-lg mx-1.5 font-sans font-bold select-none">
                    ﴿{ayah.numberInSurah}﴾
                  </span>
                </span>
              ))}
            </div>

            {/* Quick Actions for text verses on page */}
            <div className="pt-6 border-t border-slate-300 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <span>انقر على أي آية لتظليلها فوراً في تبويب الحفظ</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onHighlightAyah(ayahs[0])}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 font-bold"
                >
                  <Highlighter className="w-3.5 h-3.5" />
                  <span>تظليل هذه الصفحة</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* BOTTOM CONTROLS & PAGE SLIDER */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        
        {/* Next / Previous Page Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={handlePrev}
            disabled={currentPage <= 1}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none rounded-xl text-slate-200 text-xs sm:text-sm font-bold transition-all active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
            <span>السابقة</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentPage >= 604}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none rounded-xl text-slate-200 text-xs sm:text-sm font-bold transition-all active:scale-95"
          >
            <span>التالية</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Page Slider with Direct Value Input */}
        <div className="flex items-center gap-3 w-full sm:w-1/2">
          <input
            type="range"
            min={1}
            max={604}
            value={currentPage}
            onChange={(e) => onPageChange(parseInt(e.target.value, 10))}
            className="flex-1 accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="flex items-center gap-1 font-mono font-bold text-xs bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-amber-400">
            <span>{currentPage}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-500">604</span>
          </div>
        </div>

      </div>

    </div>
  );
};
