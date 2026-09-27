import React from 'react';
import { 
  BookOpen, 
  Highlighter, 
  HelpCircle, 
  Search, 
  DownloadCloud, 
  ListOrdered, 
  BookmarkCheck,
  CheckCircle2,
  Wifi,
  WifiOff
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'mushaf' | 'highlight' | 'quiz' | 'search';
  setActiveTab: (tab: 'mushaf' | 'highlight' | 'quiz' | 'search') => void;
  openOfflineManager: () => void;
  openIndexDrawer: () => void;
  openBookmarks: () => void;
  currentPage: number;
  surahName: string;
  juzNumber: number;
  offlineCount: number;
  isOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openOfflineManager,
  openIndexDrawer,
  openBookmarks,
  currentPage,
  surahName,
  juzNumber,
  offlineCount,
  isOnline
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-emerald-900/40 text-slate-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Current Position */}
          <div className="flex items-center gap-3">
            <button 
              onClick={openIndexDrawer}
              className="flex items-center gap-2.5 p-1.5 sm:p-2 rounded-xl hover:bg-emerald-950/60 border border-emerald-800/40 text-right transition-all group active:scale-95"
              title="فتح فهرس السور والأجزاء"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-amber-200 shadow-md shadow-emerald-900/30 group-hover:scale-105 transition-transform">
                <span className="font-quran text-xl font-bold leading-none">📖</span>
              </div>
              <div className="hidden xs:block text-right">
                <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                  <span>سورة {surahName}</span>
                  <span className="text-slate-500">•</span>
                  <span>الجزء {juzNumber}</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-200">
                  صفحة <span className="text-amber-400 font-mono font-black">{currentPage}</span>
                </div>
              </div>
            </button>
          </div>

          {/* Core Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 p-1 bg-slate-950/70 rounded-2xl border border-slate-800/80 shadow-inner">
            <button
              onClick={() => setActiveTab('mushaf')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'mushaf'
                  ? 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-md shadow-emerald-900/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>المصحف</span>
            </button>

            <button
              onClick={() => setActiveTab('highlight')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'highlight'
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-700 text-white shadow-md shadow-amber-900/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Highlighter className="w-4 h-4 text-amber-400" />
              <span>التظليل للحفظ</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'quiz'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-md shadow-cyan-900/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>اختبار المتشابهات</span>
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'search'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-md shadow-purple-900/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Search className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">البحث الدقيق</span>
              <span className="sm:hidden">بحث</span>
            </button>
          </nav>

          {/* Quick Actions (Offline, Bookmarks, Index) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Offline Cache Badge / Modal Trigger */}
            <button
              onClick={openOfflineManager}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                offlineCount >= 604
                  ? 'bg-emerald-950/80 border-emerald-600/50 text-emerald-300'
                  : offlineCount > 0
                  ? 'bg-amber-950/80 border-amber-600/50 text-amber-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
              title="تحميل صفحات المصحف أوفلاين"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              <span className="hidden md:inline font-mono">{offlineCount}/604</span>
              {offlineCount >= 604 && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
            </button>

            {/* Bookmarks */}
            <button
              onClick={openBookmarks}
              className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 border border-slate-800 transition-colors"
              title="العلامات المرجعية"
            >
              <BookmarkCheck className="w-4 h-4" />
            </button>

            {/* Index Drawer Button */}
            <button
              onClick={openIndexDrawer}
              className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800 border border-slate-800 transition-colors"
              title="الفهرس"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
