import React from 'react';
import { Bookmark, X, Trash2, BookOpen, ExternalLink, Calendar } from 'lucide-react';
import { Bookmark as BookmarkType } from '../types/quran';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkType[];
  onRemoveBookmark: (id: string) => void;
  onNavigateToPage: (page: number) => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onRemoveBookmark,
  onNavigateToPage
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-5 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">العلامات المرجعية المحفوظة</h3>
              <p className="text-xs text-slate-400">الآيات والصفحات التي قمت بحفظها للمراجعة</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {bookmarks.length === 0 ? (
          <div className="py-12 text-center space-y-2 text-slate-500">
            <Bookmark className="w-10 h-10 mx-auto opacity-30 text-amber-400" />
            <p className="text-sm">لا توجد علامات مرجعية محفوظة بعد</p>
            <p className="text-xs">اضغط على أيقونة الإشارة المرجعية بجانب أي آية لإضافتها هنا</p>
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto space-y-2 divide-y divide-slate-800/60">
            {bookmarks.map((bm) => (
              <div 
                key={bm.id}
                className="pt-3 pb-1 flex items-center justify-between gap-3 hover:bg-slate-850/40 p-3 rounded-2xl transition-colors"
              >
                <div>
                  <div className="text-sm font-bold text-slate-100 font-quran text-lg">
                    سورة {bm.surahName} (الآية {bm.ayahNumber})
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    صفحة {bm.page} • {new Date(bm.timestamp).toLocaleDateString('ar-EG')}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onNavigateToPage(bm.page);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/40 rounded-xl text-xs font-bold text-emerald-300"
                  >
                    <span>فتح</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onRemoveBookmark(bm.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-slate-800"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
