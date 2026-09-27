export interface ComparisonVerse {
  surah_name: string;
  surah_number: number;
  ayah_number: number;
  verse_text: string;
  distinction_note: string; // الوجه البياني أو الضابط في هذا الموضع
}

export interface MutashabihQuestion {
  id: string;
  surah_number: number;
  surah_name: string;
  ayah_number: number;
  juz_number: number;
  category: 'فواصل الآيات' | 'أوائل الآيات' | 'تبديل ألفاظ' | 'زيادة ونقصان' | 'تقديم وتأخير' | 'حروف العطف والجر';
  difficulty: 'سهل' | 'متوسط' | 'متقدم / إتقان';
  
  // Phase 1 (عرض قبل الإجابة):
  stem_ar: string; // نص السؤال التوجيهي الدقيق
  display_verse_ar: string; // نص الآية موضع السؤال مع الفراغ أو موضع الاختبار [ ... ]
  options: string[]; // الخيارات الأربعة أو الثلاثة
  
  // Solution:
  correct_answer: string; // الإجابة الصحيحة
  
  // Phase 2 (عرض بعد الإجابة):
  face_of_distinction_ar: string; // وجه التفريق والضابط الحفظي العلمي الرصين
  feedback_on_error_ar: string; // التوجيه والتنبيه التعليمي الإرشادي في حال الخطأ
  comparison_verses_ar: ComparisonVerse[]; // الآيات المقارنة ومواضعها الدقيقة في القرآن
}

export interface QuizProgress {
  totalAnswered: number;
  correctAnswers: number;
  wrongAnswers: number;
  streak: number;
  bestStreak: number;
  answeredQuestionIds: Record<string, { selectedAnswer: string; isCorrect: boolean; timestamp: number }>;
  flaggedQuestionIds: string[];
}
