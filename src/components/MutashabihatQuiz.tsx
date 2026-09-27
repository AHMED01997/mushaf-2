import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  RotateCcw, 
  Bookmark, 
  BookOpen, 
  Compass, 
  AlertCircle, 
  GitCompare, 
  ExternalLink,
  Flame,
  Award,
  Filter,
  Layers,
  ChevronLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MutashabihQuestion, QuizProgress } from '../types/mutashabihat';
import { MUTASHABIHAT_QUESTIONS } from '../data/mutashabihatBank';
import { loadQuizProgress, saveQuizProgress } from '../utils/storage';

interface MutashabihatQuizProps {
  onOpenVerseInMushaf: (page: number, surahNumber: number, ayahNumber: number) => void;
}

export const MutashabihatQuiz: React.FC<MutashabihatQuizProps> = ({
  onOpenVerseInMushaf
}) => {
  // Questions list and filtering
  const [selectedSurah, setSelectedSurah] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | 'all'>('all');
  const [onlyMistakes, setOnlyMistakes] = useState(false);
  const [onlyFlagged, setOnlyFlagged] = useState(false);

  // Active question index
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  // Phase 1 (قبل الإجابة) vs Phase 2 (بعد الإجابة)
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  // User progress state
  const [progress, setProgress] = useState<QuizProgress>(() => loadQuizProgress());

  // Filtered questions
  const filteredQuestions = MUTASHABIHAT_QUESTIONS.filter(q => {
    if (selectedSurah !== 'all' && q.surah_number !== selectedSurah) return false;
    if (selectedCategory !== 'all' && q.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    if (onlyMistakes) {
      const record = progress.answeredQuestionIds[q.id];
      if (!record || record.isCorrect) return false;
    }
    if (onlyFlagged && !progress.flaggedQuestionIds.includes(q.id)) return false;
    return true;
  });

  const currentQuestion: MutashabihQuestion | undefined = filteredQuestions[currentIndex] || filteredQuestions[0];

  // Reset answer when moving to next question
  const resetQuestionState = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
  };

  // Answer handler
  const handleSelectOption = (option: string) => {
    if (isAnswerSubmitted || !currentQuestion) return;

    setSelectedOption(option);
    setIsAnswerSubmitted(true);

    const isCorrect = option === currentQuestion.correct_answer;

    if (isCorrect) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setProgress(prev => {
      const nextTotal = prev.totalAnswered + 1;
      const nextCorrect = isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers;
      const nextWrong = !isCorrect ? prev.wrongAnswers + 1 : prev.wrongAnswers;
      const nextStreak = isCorrect ? prev.streak + 1 : 0;
      const nextBestStreak = Math.max(prev.bestStreak, nextStreak);

      const nextAnswers = {
        ...prev.answeredQuestionIds,
        [currentQuestion.id]: {
          selectedAnswer: option,
          isCorrect,
          timestamp: Date.now()
        }
      };

      const updated = {
        ...prev,
        totalAnswered: nextTotal,
        correctAnswers: nextCorrect,
        wrongAnswers: nextWrong,
        streak: nextStreak,
        bestStreak: nextBestStreak,
        answeredQuestionIds: nextAnswers
      };

      saveQuizProgress(updated);
      return updated;
    });
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      resetQuestionState();
    } else {
      // Loop or finish
      setCurrentIndex(0);
      resetQuestionState();
    }
  };

  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    setProgress(prev => {
      const isFlagged = prev.flaggedQuestionIds.includes(currentQuestion.id);
      const nextFlagged = isFlagged
        ? prev.flaggedQuestionIds.filter(id => id !== currentQuestion.id)
        : [...prev.flaggedQuestionIds, currentQuestion.id];

      const updated = { ...prev, flaggedQuestionIds: nextFlagged };
      saveQuizProgress(updated);
      return updated;
    });
  };

  const isCurrentFlagged = currentQuestion ? progress.flaggedQuestionIds.includes(currentQuestion.id) : false;

  // Categories list
  const categories = ['فواصل الآيات', 'أوائل الآيات', 'تبديل ألفاظ', 'زيادة ونقصان', 'تقديم وتأخير'];

  if (filteredQuestions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-200">لا توجد أسئلة تطابق الفلتر الحالي</h3>
        <p className="text-sm text-slate-400">جرب إزالة بعض الفلاتر لعرض أسئلة المتشابهات</p>
        <button
          onClick={() => {
            setSelectedSurah('all');
            setSelectedCategory('all');
            setSelectedDifficulty('all');
            setOnlyMistakes(false);
            setOnlyFlagged(false);
          }}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-sm text-white transition-all"
        >
          عرض جميع أسئلة المتشابهات
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      
      {/* Quiz Progress & Stats Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
                <span>اختبار متشابهات القرآن الكريم</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-sans">
                  البنك الجديد الموثق
                </span>
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span>السؤال {currentIndex + 1} من {filteredQuestions.length}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  <span>تتابع الصواب: {progress.streak}</span>
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">
                  الصواب: {progress.correctAnswers} / {progress.totalAnswered}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Filters Toolbar */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentIndex(0);
                resetQuestionState();
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 font-semibold focus:outline-none focus:border-cyan-500"
            >
              <option value="all">جميع التصنيفات</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value);
                setCurrentIndex(0);
                resetQuestionState();
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 font-semibold focus:outline-none focus:border-cyan-500"
            >
              <option value="all">كل المستويات</option>
              <option value="سهل">سهل</option>
              <option value="متوسط">متوسط</option>
              <option value="متقدم / إتقان">متقدم / إتقان</option>
            </select>

            {/* Toggle Mistakes */}
            <button
              onClick={() => {
                setOnlyMistakes(!onlyMistakes);
                setCurrentIndex(0);
                resetQuestionState();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                onlyMistakes
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              الأخطاء السابقة
            </button>
          </div>

        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-4">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* QUESTION CARD */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
        
        {/* Question Header & Category */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-cyan-950/70 border border-cyan-800/50 text-cyan-300 font-bold">
              سورة {currentQuestion.surah_name} : الآية {currentQuestion.ayah_number}
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
              {currentQuestion.category}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-amber-950/60 text-amber-300 text-[11px] font-mono">
              الجزء {currentQuestion.juz_number}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFlag}
              className={`p-2 rounded-xl border transition-colors ${
                isCurrentFlagged 
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-amber-400'
              }`}
              title="تثبيت السؤال للمراجعة لاحقاً"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PHASE 1: BEFORE ANSWER (عرض حصري قبل الإجابة: stem_ar + display_verse_ar + options) */}
        {/* ========================================================================= */}
        
        <div className="space-y-4 text-right">
          {/* Stem AR (السؤال التوجيهي) */}
          <h3 className="text-base sm:text-lg font-bold text-slate-200 leading-relaxed">
            {currentQuestion.stem_ar}
          </h3>

          {/* Display Verse AR (الآية مع الفراغ) */}
          <div className="p-5 sm:p-6 bg-slate-950/80 border border-emerald-900/40 rounded-2xl shadow-inner">
            <p className="font-quran text-2xl sm:text-3xl text-emerald-200/90 leading-loose text-center">
              {currentQuestion.display_verse_ar}
            </p>
          </div>
        </div>

        {/* Options (الخيارات المتاحة) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === currentQuestion.correct_answer;

            let buttonStyles = "bg-slate-800/80 hover:bg-slate-750 border-slate-700/80 text-slate-100 hover:border-cyan-500/50";

            if (isAnswerSubmitted) {
              if (isCorrect) {
                // Correct answer always shines in green
                buttonStyles = "bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold ring-2 ring-emerald-500/40";
              } else if (isSelected && !isCorrect) {
                // Wrong selected answer
                buttonStyles = "bg-rose-600/30 border-rose-500 text-rose-200 line-through opacity-80 ring-2 ring-rose-500/40";
              } else {
                // Other options disabled
                buttonStyles = "bg-slate-900/50 border-slate-800 text-slate-500 opacity-50";
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswerSubmitted}
                onClick={() => handleSelectOption(option)}
                className={`p-4 rounded-2xl border text-right font-quran text-xl sm:text-2xl transition-all duration-200 flex items-center justify-between gap-3 active:scale-98 ${buttonStyles}`}
              >
                <span>{option}</span>
                {isAnswerSubmitted && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {isAnswerSubmitted && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* PHASE 2: AFTER ANSWER (يُعرض حصراً بعد الإجابة: face_of_distinction_ar ثم feedback_on_error_ar ثم comparison_verses_ar) */}
        {/* ========================================================================= */}
        {isAnswerSubmitted && (
          <div className="space-y-5 pt-6 border-t border-slate-800 animate-fadeIn">
            
            {/* 1. وجه التفريق والضابط الحفظي (face_of_distinction_ar) */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/40 rounded-2xl shadow-lg space-y-2 text-right">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm sm:text-base">
                <Compass className="w-5 h-5" />
                <span>وجه التفريق والضابط الحفظي المعتمد:</span>
              </div>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed pr-7 font-sans">
                {currentQuestion.face_of_distinction_ar}
              </p>
            </div>

            {/* 2. التوجيه الإرشادي وتصحيح الخطأ (feedback_on_error_ar) */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/40 rounded-2xl shadow-lg space-y-2 text-right">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm sm:text-base">
                <AlertCircle className="w-5 h-5" />
                <span>التوجيه الإرشادي وضبط الموضع:</span>
              </div>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed pr-7 font-sans">
                {currentQuestion.feedback_on_error_ar}
              </p>
            </div>

            {/* 3. الآيات المقارنة في القرآن (comparison_verses_ar) */}
            {currentQuestion.comparison_verses_ar && currentQuestion.comparison_verses_ar.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-slate-300 font-bold text-sm text-right">
                  <GitCompare className="w-4 h-4 text-emerald-400" />
                  <span>الآيات المقارنة في القرآن الكريم:</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.comparison_verses_ar.map((comp, cIdx) => (
                    <div 
                      key={cIdx}
                      className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2 text-right hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-bold text-emerald-400">
                          سورة {comp.surah_name} : الآية {comp.ayah_number}
                        </span>
                        <button
                          onClick={() => onOpenVerseInMushaf(1, comp.surah_number, comp.ayah_number)}
                          className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline"
                        >
                          <span>عرض في المصحف</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>

                      <p className="font-quran text-lg sm:text-xl text-slate-100 leading-loose">
                        {comp.verse_text}
                      </p>

                      <p className="text-xs sm:text-sm text-amber-300/90 pt-1 border-t border-slate-900">
                        💡 {comp.distinction_note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation to Next Question */}
            <div className="flex items-center justify-between gap-3 pt-4">
              <button
                onClick={resetQuestionState}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs sm:text-sm transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة المحاولة</span>
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-900/40 transition-all active:scale-95"
              >
                <span>السؤال التالي</span>
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
