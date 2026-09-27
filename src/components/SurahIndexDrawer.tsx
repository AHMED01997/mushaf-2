import React, { useState } from 'react';
import { X, Search, BookOpen, Layers, Hash } from 'lucide-react';
import { SURAHS_META } from '../data/quranMetadata';
import { RUB_BOUNDARIES } from '../data/rubBoundaries';

interface SurahIndexDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPage: (page: number) => void;
  currentPage: number;
}

export const SurahIndexDrawer: React.FC<SurahIndexDrawerProps> = ({
  isOpen,
  onClose,
  onSelectPage,
  currentPage
}) => {
  const [activeTab, setActiveTab] = useState<'surahs' | 'juzs' | 'rubs'>('surahs');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredSurahs = SURAHS_META.filter(s => 
    s.name.includes(searchTerm) || 
    s.number.toString().includes(searchTerm) ||
    s.englishName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRubs = RUB_BOUNDARIES.filter(r =>
    r.surahName.includes(searchTerm) ||
    r.verseTextSnippet.includes(searchTerm) ||
    r.rubNumber.toString().includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-start bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col text-right"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <span>فهرس القرآن الكريم</span>
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن اسم السورة، الجزء، أو الربع..."
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sub-tabs: Surahs / Juzs / Rubs */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('surahs')}
              className={`flex-1 py-1.5 font-bold rounded-lg transition-all ${
                activeTab === 'surahs' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              السور (١١٤)
            </button>
            <button
              onClick={() => setActiveTab('juzs')}
              className={`flex-1 py-1.5 font-bold rounded-lg transition-all ${
                activeTab === 'juzs' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              الأجزاء (٣٠)
            </button>
            <button
              onClick={() => setActiveTab('rubs')}
              className={`flex-1 py-1.5 font-bold rounded-lg transition-all ${
                activeTab === 'rubs' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              الأرباع والأحزاب
            </button>
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1.5">
          
          {/* TAB 1: SURAHS */}
          {activeTab === 'surahs' && (
            <div className="space-y-1.5">
              {filteredSurahs.map((surah) => {
                const isCurrent = currentPage >= surah.startPage && currentPage <= surah.endPage;
                return (
                  <button
                    key={surah.number}
                    onClick={() => {
                      onSelectPage(surah.startPage);
                      onClose();
                    }}
                    className={`w-full p-3 rounded-2xl border text-right transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200 font-bold ring-1 ring-emerald-500/30'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-200 hover:bg-slate-800/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-xs font-bold text-amber-400">
                        {surah.number}
                      </div>
                      <div>
                        <div className="font-quran text-lg font-bold">
                          سورة {surah.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • {surah.numberOfAyahs} آية
                        </div>
                      </div>
                    </div>

                    <div className="text-left text-xs font-mono text-slate-400">
                      ص {surah.startPage}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* TAB 2: JUZS */}
          {activeTab === 'juzs' && (
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 30 }, (_, i) => {
                const juzNum = i + 1;
                // Approximate starting page for each juz
                const approxPage = (juzNum - 1) * 20 + (juzNum <= 2 ? 1 : 2);
                const actualPage = Math.min(604, Math.max(1, approxPage));
                return (
                  <button
                    key={juzNum}
                    onClick={() => {
                      onSelectPage(actualPage);
                      onClose();
                    }}
                    className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800 text-right hover:border-emerald-500/40 hover:bg-slate-800/70 transition-all flex flex-col justify-between"
                  >
                    <span className="text-xs font-bold text-emerald-400">
                      الجزء {juzNum}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 mt-1">
                      يبدأ صفحة {actualPage}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* TAB 3: RUBS (240 QUARTERS) */}
          {activeTab === 'rubs' && (
            <div className="space-y-1.5">
              {filteredRubs.map((rub) => (
                <button
                  key={rub.rubNumber}
                  onClick={() => {
                    onSelectPage(rub.page);
                    onClose();
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-right hover:border-emerald-500/40 hover:bg-slate-800/70 transition-all flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-800/40 flex items-center justify-center font-mono text-[11px] font-bold text-emerald-300 shrink-0">
                      {rub.rubNumber}
                    </span>
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-200">
                        سورة {rub.surahName} (الآية {rub.ayahNumber})
                      </div>
                      <div className="text-[11px] font-quran text-slate-400 truncate">
                        {rub.verseTextSnippet}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-slate-500 shrink-0">
                    ص {rub.page}
                  </span>
                </button>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
