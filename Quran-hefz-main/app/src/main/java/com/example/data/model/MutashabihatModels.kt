package com.example.data.model

import com.google.gson.annotations.SerializedName

data class ComparisonVerse(
    @SerializedName("surah_name") val surah_name: String = "",
    @SerializedName("surah_number") val surah_number: Int = 1,
    @SerializedName("ayah_number") val ayah_number: Int = 1,
    @SerializedName("verse_text") val verse_text: String = "",
    @SerializedName("distinction_note") val distinction_note: String = ""
)

data class MutashabihQuestion(
    @SerializedName("id") val id: String = "",
    @SerializedName("surah_number") val surah_number: Int = 1,
    @SerializedName("surah_name") val surah_name: String = "",
    @SerializedName("ayah_number") val ayah_number: Int = 1,
    @SerializedName("juz_number") val juz_number: Int = 1,
    @SerializedName("category") val category: String = "",
    @SerializedName("difficulty") val difficulty: String = "",
    
    // المرحلة الأولى: تُعرض قبل الإجابة فقط
    @SerializedName("stem_ar") val stem_ar: String = "",
    @SerializedName("display_verse_ar") val display_verse_ar: String = "",
    @SerializedName("options") val options: List<String> = emptyList(),
    @SerializedName("correct_answer") val correct_answer: String = "",
    
    // المرحلة الثانية: تُعرض حصراً بعد الإجابة بالترتيب
    @SerializedName("face_of_distinction_ar") val face_of_distinction_ar: String = "",
    @SerializedName("feedback_on_error_ar") val feedback_on_error_ar: String = "",
    @SerializedName("comparison_verses_ar") val comparison_verses_ar: List<ComparisonVerse> = emptyList()
)
