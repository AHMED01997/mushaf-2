import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  BookOpen, 
  Highlighter, 
  Copy, 
  Check, 
  Sparkles, 
  Filter, 
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { SAMPLE_QURAN_DATABASE } from '../data/quranText';
import { 
  normalizeQuranText, 
  tokenizeWords, 
  isWordMatch, 
  highlightUthmaniText, 
  SearchMode 
} from '../utils/quranSearch';
import { SURAHS_META } from '../data/quranMetadata';
import { Ayah } from '../types/quran';

interface QuranSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPage: (page: number, surahNumber?: number, ayahNumber?: number) => void;
  onHighlightAyah: (ayah: Ayah) => void;
}

export const QuranSearchModal: React.FC<QuranSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateToPage,
  onHighlightAyah
}) => {
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('exact-word');
  const [selectedSurah, setSelectedSurah] = useState<number | 'all'>('all');
  const [selectedJuz, setSelectedJuz] = useState<number | 'all'>('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Quick testing badges for the user's specific verification
  const quickTestQueries = [
    { label: "المنافقين (لا يخلط مع المنفقين)", value: "المنافقين" },
    { label: "المنفقين (خاص بآل عمران)", value: "المنفقين" },
    { label: "الكفر (لا يخلط مع الكفار)", value: "الكفر" },
    { label: "الكفار", value: "الكفار" },
    { label: "لعلكم تشكرون", value: "لعلكم تشكرون" },
    { label: "لعلكم تتقون", value: "لعلكم تتقون" }
  ];

  // Perform search with zero-lag and clean rules
  const searchResults = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return [];

    const normQuery = normalizeQuranText(trimmed);
    const queryTokens = tokenizeWords(trimmed);

    const results: Array<{
      ayah: Ayah;
      highlightedText: string;
      matchedCount: number;
    }> = [];

    for (const ayah of SAMPLE_QURAN_DATABASE) {
      // Filter by Surah & Juz if selected
      if (selectedSurah !== 'all' && ayah.surahNumber !== selectedSurah) continue;
      if (selectedJuz !== 'all' && ayah.juz !== selectedJuz) continue;

      const normAyahText = normalizeQuranText(ayah.text);
      let isMatch = false;
      let matchedCount = 0;

      if (searchMode === 'exact-word') {
        // Strict token-level matching: protects "الكفر" vs "الكفار" and "المنافقين" vs "المنفقين"
        const ayahTokens = tokenizeWords(ayah.text);
        
        if (queryTokens.length === 1) {
          const qToken = queryTokens[0];
          for (const aToken of ayahTokens) {
            if (isWordMatch(aToken, qToken)) {
              isMatch = true;
              matchedCount++;
            }
          }
        } else {
          // Multiple words exact matching in sequence
          if (normAyahText.includes(normQuery)) {
            isMatch = true;
            matchedCount = 1;
          }
        }
      } else if (searchMode === 'exact-phrase') {
        if (normAyahText.includes(normQuery)) {
          isMatch = true;
          matchedCount = 1;
        }
      } else {
        // Contains / flexible
        isMatch = queryTokens.every(qToken => normAyahText.includes(qToken));
        matchedCount = 1;
      }

      if (isMatch) {
        results.push({
          ayah,
          highlightedText: highlightUthmaniText(ayah.text, trimmed),
          matchedCount
        });
      }
    }

    return results;
  }, [query, searchMode, selectedSurah, selectedJuz]);

  const handleCopy = (ayah: Ayah) => {
    navigator.clipboard.writeText(`${ayah.text} [سورة ${ayah.surahName}: ${ayah.numberInSurah}]`);
    setCopiedId(ayah.number);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-right"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header & Search Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-900/90 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">البحث القرآني الدقيق الخالي من اللبس</h3>
                <p className="text-xs text-slate-400">
                  قواعد نحوية ورسم عثماني نظيف للتفريق الدقيق بين الكلمات (مثل الكفر/الكفار والمنافقين/المنفقين)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input Box */}
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="اكتب كلمة أو جملة للبحث عنها في القرآن (مثال: المنافقين، الكفر، لعلكم تشكرون)..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-950/90 border border-slate-700 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm sm:text-base font-semibold shadow-inner"
              autoFocus
            />
            {query ? (
              <button
                onClick={() => setQuery('')}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
            )}
          </div>

          {/* Mode & Filters Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
            
            {/* Matching Modes */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
              <button
                onClick={() => setSearchMode('exact-word')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  searchMode === 'exact-word'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="مطابقة الكلمة بدقة دون خلط بين المشتقات (الكفر مقابل الكفار)"
              >
                مطابقة الكلمة التامة
              </button>
              <button
                onClick={() => setSearchMode('exact-phrase')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  searchMode === 'exact-phrase'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                مطابقة العبارة
              </button>
              <button
                onClick={() => setSearchMode('contains')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  searchMode === 'contains'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                بحث مرن
              </button>
            </div>

            {/* Surah Filter */}
            <div className="flex items-center gap-2">
              <select
                value={selectedSurah}
                onChange={(e) => setSelectedSurah(e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10))}
                className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="all">جميع السور</option>
                {SURAHS_META.map(s => (
                  <option key={s.number} value={s.number}>سورة {s.name}</option>
                ))}
              </select>

              <select
                value={selectedJuz}
                onChange={(e) => setSelectedJuz(e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10))}
                className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="all">جميع الأجزاء</option>
                {Array.from({ length: 30 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>الجزء {i + 1}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Quick Verification Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400 font-bold ml-1">تجربة دقة الكلمات:</span>
            {quickTestQueries.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(item.value);
                  setSearchMode('exact-word');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 text-[11px] text-slate-300 hover:text-amber-300 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 divide-y divide-slate-800/60">
          
          {query.trim().length > 0 && (
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2">
              <span className="font-bold text-purple-400">
                نتائج البحث: {searchResults.length} آية مطابقة
              </span>
              <span className="text-slate-500">
                الوضع: {searchMode === 'exact-word' ? 'مطابقة كلمة تامة ومحكمة' : searchMode === 'exact-phrase' ? 'عبارة تامة' : 'مرن'}
              </span>
            </div>
          )}

          {query.trim().length < 2 && (
            <div className="py-16 text-center space-y-2 text-slate-500">
              <Search className="w-10 h-10 mx-auto opacity-30 text-purple-400" />
              <p className="text-sm">اكتب كلمة البحث للبدء (حرفين على الأقل)</p>
            </div>
          )}

          {query.trim().length >= 2 && searchResults.length === 0 && (
            <div className="py-16 text-center space-y-2 text-slate-400">
              <p className="text-base font-bold text-slate-300">لم يتم العثور على نتائج تطابق: "{query}"</p>
              <p className="text-xs text-slate-500">جرب كتابة الكلمة بصيغة أخرى أو اختيار 'بحث مرن'</p>
            </div>
          )}

          {searchResults.map(({ ayah, highlightedText }) => (
            <div 
              key={ayah.number} 
              className="pt-4 pb-2 space-y-2.5 hover:bg-slate-850/40 p-3 rounded-2xl transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-950/70 border border-emerald-800/40 text-emerald-400 font-bold">
                  سورة {ayah.surahName} : الآية {ayah.numberInSurah}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-mono text-[11px]">
                    صفحة {ayah.page} • جزء {ayah.juz}
                  </span>

                  <button
                    onClick={() => handleCopy(ayah)}
                    className="p-1 rounded text-slate-400 hover:text-emerald-400 transition-colors"
                    title="نسخ الآية"
                  >
                    {copiedId === ayah.number ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => onHighlightAyah(ayah)}
                    className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded-lg"
                    title="تظليل الآية للحفظ"
                  >
                    <Highlighter className="w-3 h-3" />
                    <span>تظليل</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigateToPage(ayah.page, ayah.surahNumber, ayah.numberInSurah);
                      onClose();
                    }}
                    className="flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 bg-purple-950/40 border border-purple-800/40 px-2.5 py-0.5 rounded-lg font-bold"
                  >
                    <span>فتح بالمصحف</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Quranic Text with safe HTML highlighting */}
              <p 
                className="font-quran text-xl sm:text-2xl text-slate-100 leading-loose"
                dangerouslySetInnerHTML={{ __html: highlightedText }}
              />
            </div>
          ))}

        </div>

      </div>
    </div>
  );
};
