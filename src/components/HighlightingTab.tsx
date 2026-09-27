import React, { useState } from 'react';
import { 
  Highlighter, 
  Eye, 
  EyeOff, 
  Sparkles, 
  RotateCcw, 
  CheckCheck, 
  Layers, 
  Bookmark, 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Volume2
} from 'lucide-react';
import { Ayah, HighlightState } from '../types/quran';

interface HighlightingTabProps {
  ayahs: Ayah[];
  currentPage: number;
  highlightState: HighlightState;
  setHighlightState: React.Dispatch<React.SetStateAction<HighlightState>>;
  onNextPage: () => void;
  onPrevPage: () => void;
  onAddBookmark: (ayah: Ayah) => void;
}

export const HighlightingTab: React.FC<HighlightingTabProps> = ({
  ayahs,
  currentPage,
  highlightState,
  setHighlightState,
  onNextPage,
  onPrevPage,
  onAddBookmark
}) => {
  const [copiedAyah, setCopiedAyah] = useState<string | null>(null);
  const [selectedAyahId, setSelectedAyahId] = useState<string | null>(null);

  // Toggle FULL Ayah highlight - synchronously highlights the ayah AND all its word chips!
  const toggleFullAyahHighlight = (ayah: Ayah) => {
    const ayahKey = `${ayah.surahNumber}:${ayah.numberInSurah}`;
    const isCurrentlyHighlighted = !!highlightState.highlightedAyahs[ayahKey];
    const willBeHighlighted = !isCurrentlyHighlighted;

    setHighlightState(prev => {
      const nextAyahs = { ...prev.highlightedAyahs, [ayahKey]: willBeHighlighted };
      const nextWords = { ...prev.highlightedWords };

      // Synchronize all word chips of this ayah
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
  };

  // Toggle single word chip
  const toggleWordHighlight = (ayah: Ayah, wordIndex: number) => {
    const ayahKey = `${ayah.surahNumber}:${ayah.numberInSurah}`;
    const wordKey = `${ayah.surahNumber}:${ayah.numberInSurah}:${wordIndex}`;

    setHighlightState(prev => {
      const nextWords = { ...prev.highlightedWords };
      if (nextWords[wordKey]) {
        delete nextWords[wordKey];
      } else {
        nextWords[wordKey] = true;
      }

      // Check if all words of this ayah are now highlighted
      const allWordsHighlighted = ayah.words.every((_, idx) => {
        const k = `${ayah.surahNumber}:${ayah.numberInSurah}:${idx}`;
        return !!nextWords[k];
      });

      const nextAyahs = {
        ...prev.highlightedAyahs,
        [ayahKey]: allWordsHighlighted
      };

      return {
        ...prev,
        highlightedAyahs: nextAyahs,
        highlightedWords: nextWords
      };
    });
  };

  // Preset: Highlight all ayahs and all their words on the current page
  const highlightAllOnPage = () => {
    setHighlightState(prev => {
      const nextAyahs = { ...prev.highlightedAyahs };
      const nextWords = { ...prev.highlightedWords };

      ayahs.forEach(ayah => {
        const ayahKey = `${ayah.surahNumber}:${ayah.numberInSurah}`;
        nextAyahs[ayahKey] = true;
        ayah.words.forEach((_, idx) => {
          const wordKey = `${ayah.surahNumber}:${ayah.numberInSurah}:${idx}`;
          nextWords[wordKey] = true;
        });
      });

      return {
        ...prev,
        highlightedAyahs: nextAyahs,
        highlightedWords: nextWords
      };
    });
  };

  // Preset: Highlight end words (فواصل الآيات) for rhyme & mutashabihat drill
  const highlightAyahEndings = () => {
    setHighlightState(prev => {
      const nextWords = { ...prev.highlightedWords };
      const nextAyahs = { ...prev.highlightedAyahs };

      ayahs.forEach(ayah => {
        const ayahKey = `${ayah.surahNumber}:${ayah.numberInSurah}`;
        nextAyahs[ayahKey] = false;
        const totalWords = ayah.words.length;
        // Highlight last 2 words
        for (let i = Math.max(0, totalWords - 2); i < totalWords; i++) {
          const wordKey = `${ayah.surahNumber}:${ayah.numberInSurah}:${i}`;
          nextWords[wordKey] = true;
        }
      });

      return {
        ...prev,
        highlightedAyahs: nextAyahs,
        highlightedWords: nextWords
      };
    });
  };

  // Preset: Highlight first 2 words of each ayah
  const highlightAyahBeginnings = () => {
    setHighlightState(prev => {
      const nextWords = { ...prev.highlightedWords };
      const nextAyahs = { ...prev.highlightedAyahs };

      ayahs.forEach(ayah => {
        const ayahKey = `${ayah.surahNumber}:${ayah.numberInSurah}`;
        nextAyahs[ayahKey] = false;
        for (let i = 0; i < Math.min(2, ayah.words.length); i++) {
          const wordKey = `${ayah.surahNumber}:${ayah.numberInSurah}:${i}`;
          nextWords[wordKey] = true;
        }
      });

      return {
        ...prev,
        highlightedAyahs: nextAyahs,
        highlightedWords: nextWords
      };
    });
  };

  // Clear highlights on page
  const clearPageHighlights = () => {
    setHighlightState(prev => {
      const nextAyahs = { ...prev.highlightedAyahs };
      const nextWords = { ...prev.highlightedWords };

      ayahs.forEach(ayah => {
        const ayahKey = `${ayah.surahNumber}:${ayah.numberInSurah}`;
        delete nextAyahs[ayahKey];
        ayah.words.forEach((_, idx) => {
          const wordKey = `${ayah.surahNumber}:${ayah.numberInSurah}:${idx}`;
          delete nextWords[wordKey];
        });
      });

      return {
        ...prev,
        highlightedAyahs: nextAyahs,
        highlightedWords: nextWords
      };
    });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAyah(id);
    setTimeout(() => setCopiedAyah(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      
      {/* Header & Controls Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Highlighter className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
                <span>تظليل الحفظ والتسميع التفاعلي</span>
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-sans">
                  مربعات الكلمات المتزامنة
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                تظليل الآية يظلل جميع مربعات كلماتها فوراً، وانقر على أي كلمة لتظليلها أو كشفها فردياً
              </p>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            
            {/* Conceal / Test Mode Toggle */}
            <button
              onClick={() => setHighlightState(prev => ({ ...prev, concealMode: !prev.concealMode }))}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                highlightState.concealMode
                  ? 'bg-rose-950/80 border-rose-500/50 text-rose-300 shadow-lg shadow-rose-950/50'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
              title="إخفاء المظلل لاختبار الحفظ والتسميع"
            >
              {highlightState.concealMode ? <EyeOff className="w-4 h-4 text-rose-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
              <span>{highlightState.concealMode ? 'وضع التسميع (مفعل)' : 'إخفاء وتسميع'}</span>
            </button>

            {/* Endings */}
            <button
              onClick={highlightAyahEndings}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all active:scale-95"
              title="تظليل أواخر الآيات لضبط المتشابهات ورؤوس الآي"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>فواصل الآيات</span>
            </button>

            {/* Beginnings */}
            <button
              onClick={highlightAyahBeginnings}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all active:scale-95"
              title="تظليل أوائل الآيات"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>فواتح الآيات</span>
            </button>

            {/* All on Page */}
            <button
              onClick={highlightAllOnPage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 transition-all active:scale-95"
              title="تظليل كل الآيات والكلمات بالصفحة"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>تظليل الصفحة</span>
            </button>

            {/* Reset */}
            <button
              onClick={clearPageHighlights}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 border border-slate-700 transition-colors active:scale-95"
              title="مسح تظليل هذه الصفحة"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>

      {/* Ayahs List with Synchronized Word Chips */}
      <div className="space-y-4">
        {ayahs.map((ayah) => {
          const ayahKey = `${ayah.surahNumber}:${ayah.numberInSurah}`;
          const isAyahFullyHighlighted = !!highlightState.highlightedAyahs[ayahKey];
          
          // Check how many words of this ayah are highlighted
          const highlightedWordsCount = ayah.words.filter((_, idx) => {
            const wordKey = `${ayah.surahNumber}:${ayah.numberInSurah}:${idx}`;
            return !!highlightState.highlightedWords[wordKey];
          }).length;

          const isPartiallyHighlighted = highlightedWordsCount > 0 && !isAyahFullyHighlighted;

          return (
            <div 
              key={ayah.number}
              className={`rounded-3xl border transition-all duration-300 p-4 sm:p-6 backdrop-blur-sm ${
                isAyahFullyHighlighted
                  ? 'bg-amber-950/20 border-amber-500/50 shadow-xl shadow-amber-950/20 ring-1 ring-amber-500/30'
                  : isPartiallyHighlighted
                  ? 'bg-amber-950/10 border-amber-700/40 shadow-md'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Ayah Header & Action Toolbar */}
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/80 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 font-bold">
                    سورة {ayah.surahName} : الآية {ayah.numberInSurah}
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    صفحة {ayah.page} • جزء {ayah.juz}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Highlight Full Ayah Button */}
                  <button
                    onClick={() => toggleFullAyahHighlight(ayah)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${
                      isAyahFullyHighlighted
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                        : isPartiallyHighlighted
                        ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                        : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300'
                    }`}
                  >
                    <Highlighter className="w-3.5 h-3.5" />
                    <span>{isAyahFullyHighlighted ? 'إلغاء تظليل الآية' : 'تظليل الآية كاملة'}</span>
                    <span className="text-[10px] opacity-80 font-mono">
                      ({highlightedWordsCount}/{ayah.words.length})
                    </span>
                  </button>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => onAddBookmark(ayah)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 border border-slate-800"
                    title="حفظ علامة مرجعية"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(ayah.text, ayahKey)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 border border-slate-800"
                    title="نسخ الآية"
                  >
                    {copiedAyah === ayahKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Full Ayah Text Display with Integrated Word Highlighting & Concealment */}
              <div className="py-2 text-right">
                <p 
                  className={`font-quran leading-loose text-2xl sm:text-3xl transition-all ${
                    highlightState.concealMode && isAyahFullyHighlighted
                      ? 'filter blur-sm select-none opacity-40 hover:opacity-80 hover:filter-none cursor-pointer'
                      : 'text-slate-100'
                  }`}
                  onClick={() => highlightState.concealMode && toggleFullAyahHighlight(ayah)}
                >
                  {ayah.words.map((word, wIdx) => {
                    const wordKey = `${ayah.surahNumber}:${ayah.numberInSurah}:${wIdx}`;
                    const isWordHighlighted = !!highlightState.highlightedWords[wordKey];
                    const isWordConcealed = highlightState.concealMode && isWordHighlighted;

                    return (
                      <span
                        key={word.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWordHighlight(ayah, wIdx);
                        }}
                        className={`inline-block mx-1 my-0.5 px-1 rounded-lg cursor-pointer transition-colors duration-150 ${
                          isWordConcealed
                            ? 'bg-slate-800 text-transparent select-none rounded border border-dashed border-amber-500/40'
                            : isWordHighlighted
                            ? 'bg-amber-400/25 text-amber-200 border-b-2 border-amber-400 font-bold'
                            : 'hover:bg-slate-800/80'
                        }`}
                        title="انقر لتظليل أو كشف الكلمة"
                      >
                        {word.text}
                      </span>
                    );
                  })}
                  <span className="text-amber-400 text-lg mx-1 inline-block font-sans select-none">
                    ﴿{ayah.numberInSurah}﴾
                  </span>
                </p>
              </div>

              {/* Word Chips Grid ("مربعات الكلمات") - Synchronized 100% with the full Ayah */}
              <div className="mt-4 pt-3 border-t border-slate-800/60">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>مربعات الكلمات التفاعلية:</span>
                  </span>
                  <span className="text-[10px] text-slate-500">
                    انقر على أي مربع لتظليل الكلمة أو كشفها فردياً
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 justify-start">
                  {ayah.words.map((word, wIdx) => {
                    const wordKey = `${ayah.surahNumber}:${ayah.numberInSurah}:${wIdx}`;
                    const isHighlighted = !!highlightState.highlightedWords[wordKey];
                    const isConcealed = highlightState.concealMode && isHighlighted;

                    return (
                      <button
                        key={word.id}
                        onClick={() => toggleWordHighlight(ayah, wIdx)}
                        className={`group px-3 py-1.5 rounded-xl border text-sm transition-all duration-200 active:scale-95 flex items-center gap-1.5 ${
                          isConcealed
                            ? 'bg-slate-800/90 border-amber-500/40 text-amber-300/40 hover:text-amber-200 shadow-inner'
                            : isHighlighted
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-600 border-amber-400 text-slate-950 font-black shadow-md shadow-amber-500/20'
                            : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:bg-slate-750'
                        }`}
                        title={`الكلمة رقم ${wIdx + 1}: ${word.text}`}
                      >
                        <span className="font-quran text-base sm:text-lg">
                          {isConcealed ? '••••' : word.text}
                        </span>
                        <span className={`text-[10px] font-mono px-1 rounded ${
                          isHighlighted ? 'bg-amber-900/30 text-slate-900' : 'text-slate-500'
                        }`}>
                          {wIdx + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Page Navigation Footer */}
      <div className="flex items-center justify-between gap-3 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <button
          onClick={onPrevPage}
          disabled={currentPage <= 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-200 font-bold text-sm transition-all"
        >
          <ChevronRight className="w-4 h-4" />
          <span>الصفحة السابقة</span>
        </button>

        <div className="text-sm font-bold text-amber-300">
          صفحة {currentPage} من 604
        </div>

        <button
          onClick={onNextPage}
          disabled={currentPage >= 604}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-200 font-bold text-sm transition-all"
        >
          <span>الصفحة التالية</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
