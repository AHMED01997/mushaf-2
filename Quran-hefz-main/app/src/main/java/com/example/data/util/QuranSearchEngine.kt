package com.example.data.util

object QuranSearchEngine {

    /**
     * معالجة نص القرآن بالرسم العثماني لتحويله لصيغة بحث نظيفة:
     * - تحويل الألف الخنجرية (U+0670) إلى ألف عادية 'ا' قبل تجريد الحركات
     *   وهذا هو السر في عدم الخلط بين "الْمُنَٰفِقِينَ" (المنافقين) و "الْمُنفِقِينَ" (المنفقين)!
     * - إزالة علامات الوقف والضبط المصحفي وحركات التشكيل والتنوين والشدة
     * - توحيد الهمزات وهمزة الوصل
     */
    fun normalizeQuranText(text: String): String {
        if (text.isBlank()) return ""
        var result = text

        // 1. استبدال الألف الخنجرية العثمانية بالألف الأصلية قبل حذف الحركات
        result = result.replace("\u0670", "ا")

        // 2. همزة الوصل
        result = result.replace("\u0671", "ا")

        // 3. علامات الوقف والتجزئة في المصحف
        result = result.replace(Regex("[\u06D6-\u06ED]"), "")
        result = result.replace(Regex("[\u06DF-\u06E8]"), "")

        // 4. حذف التشكيل والتنوين والشدة
        result = result.replace(Regex("[\u064B-\u065F]"), "")

        // 5. الكشيدة
        result = result.replace("\u0640", "")

        // 6. توحيد الهمزات للبحث فقط
        result = result.replace(Regex("[أإآء]"), "ا")

        return result.replace(Regex("\\s+"), " ").trim()
    }

    /**
     * فحص مطابقة كلمة تامة مع السماح بالسوابق الإعرابية الشائعة
     * يضمن عدم الخلط بين:
     * - "الكفر" و "الكفار"
     * - "المنافقين" و "المنفقين"
     */
    fun isExactWordMatch(targetWord: String, queryWord: String): Boolean {
        if (targetWord == queryWord) return true

        val targetClean = if (targetWord.startsWith("ال")) targetWord.removePrefix("ال") else targetWord
        val queryClean = if (queryWord.startsWith("ال")) queryWord.removePrefix("ال") else queryWord

        if (targetClean == queryClean && targetClean.length > 2) return true

        val prefixes = listOf("و", "ف", "ب", "ك", "ل", "وال", "فال", "بال", "كال", "لل")
        for (prefix in prefixes) {
            if (targetWord.startsWith(prefix) && targetWord.removePrefix(prefix) == queryClean) return true
            if (queryWord.startsWith(prefix) && queryWord.removePrefix(prefix) == targetClean) return true
        }

        return false
    }

    /**
     * مطابقة آية كاملة بناءً على نوع البحث
     */
    fun matchAyah(verseText: String, query: String, exactWordOnly: Boolean = true): Boolean {
        if (query.isBlank()) return false
        val normVerse = normalizeQuranText(verseText)
        val normQuery = normalizeQuranText(query)

        if (!exactWordOnly) {
            return normVerse.contains(normQuery)
        }

        val verseTokens = normVerse.split(" ").filter { it.isNotBlank() }
        val queryTokens = normQuery.split(" ").filter { it.isNotBlank() }

        if (queryTokens.size == 1) {
            val q = queryTokens[0]
            return verseTokens.any { isExactWordMatch(it, q) }
        }

        // عبارة متعددة الكلمات
        return normVerse.contains(normQuery)
    }
}
