import React, { useState, useEffect } from 'react';
import { 
  DownloadCloud, 
  CheckCircle2, 
  X, 
  Pause, 
  Play, 
  Trash2, 
  Wifi, 
  WifiOff, 
  HardDrive, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';
import { 
  getCachedPagesCount, 
  downloadAllPages, 
  pauseAllDownloads, 
  DownloadProgress 
} from '../utils/quranCache';

interface OfflineManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  cachedCount: number;
  onCacheUpdated: () => void;
  isOnline: boolean;
}

export const OfflineManagerModal: React.FC<OfflineManagerModalProps> = ({
  isOpen,
  onClose,
  cachedCount,
  onCacheUpdated,
  isOnline
}) => {
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({
    status: 'idle',
    cachedCount,
    totalCount: 604,
    currentDownloadPage: 1
  });

  useEffect(() => {
    setDownloadProgress(prev => ({
      ...prev,
      cachedCount
    }));
  }, [cachedCount]);

  const handleStartDownload = async () => {
    downloadAllPages((progress) => {
      setDownloadProgress(progress);
      onCacheUpdated();
    });
  };

  const handlePause = () => {
    pauseAllDownloads();
    setDownloadProgress(prev => ({ ...prev, status: 'paused' }));
  };

  const handleClearCache = async () => {
    if (!('caches' in window)) return;
    try {
      await caches.delete('quran-mushaf-pages-v2');
      onCacheUpdated();
      setDownloadProgress(prev => ({
        ...prev,
        cachedCount: 0,
        status: 'idle'
      }));
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  const percentage = Math.round((downloadProgress.cachedCount / 604) * 100);
  const isComplete = downloadProgress.cachedCount >= 604;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-6 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">تحميل المصحف للعمل بدون إنترنت</h3>
              <p className="text-xs text-slate-400">
                حفظ صفحات المصحف النبوي كاملة لتعمل حتى عند انقطاع الإنترنت نهائياً
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

        {/* Network & Cache Status Card */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isOnline ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-medium">حالة الاتصال</div>
              <div className="text-xs font-bold text-slate-200">
                {isOnline ? 'متصل بالإنترنت' : 'غير متصل (يعمل أوفلاين)'}
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-medium">المخزن محلياً</div>
              <div className="text-xs font-bold text-slate-200 font-mono">
                {downloadProgress.cachedCount} / 604 صفحة
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-2 p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300">نسبة الجاهزية بدون إنترنت</span>
            <span className="text-emerald-400 font-mono text-sm">{percentage}%</span>
          </div>

          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>
              {isComplete 
                ? '✅ تم تحميل كامل المصحف بنجاح وهو متاح أوفلاين بالكامل'
                : downloadProgress.status === 'downloading'
                ? `جاري تحميل صفحة ${downloadProgress.currentDownloadPage}...`
                : 'اضغط على زر التحميل لحفظ كل الصفحات مرة واحدة'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-2">
          {!isComplete && (
            <>
              {downloadProgress.status === 'downloading' ? (
                <button
                  onClick={handlePause}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-2xl transition-all shadow-lg shadow-amber-950/40"
                >
                  <Pause className="w-4 h-4" />
                  <span>إيقاف التحميل مؤقتاً</span>
                </button>
              ) : (
                <button
                  onClick={handleStartDownload}
                  disabled={!isOnline}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 disabled:opacity-40 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-950/40 active:scale-98"
                >
                  <Play className="w-4 h-4" />
                  <span>
                    {downloadProgress.cachedCount > 0 ? 'متابعة تحميل باقي الصفحات' : 'بدء تحميل المصحف كاملاً (604 صفحة)'}
                  </span>
                </button>
              )}
            </>
          )}

          {isComplete && (
            <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl flex items-center gap-2.5 text-emerald-300 text-xs font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>المصحف مجهز 100% للتصفح بدون إنترنت وبأعلى سرعة ممكنة دون أي تأخير!</span>
            </div>
          )}

          {downloadProgress.cachedCount > 0 && (
            <button
              onClick={handleClearCache}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 border border-slate-800 rounded-xl transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>تفريغ الذاكرة المؤقتة للصفحات المحملة</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
