package com.example.data.util

import android.content.Context
import com.example.data.model.MutashabihQuestion
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.io.InputStreamReader

object MutashabihatBank {

    private var cachedQuestions: List<MutashabihQuestion>? = null

    fun getQuestions(context: Context): List<MutashabihQuestion> {
        cachedQuestions?.let { return it }

        return try {
            context.assets.open("mutashabihat_bank.json").use { inputStream ->
                val reader = InputStreamReader(inputStream)
                val type = object : TypeToken<List<MutashabihQuestion>>() {}.type
                val questions: List<MutashabihQuestion> = Gson().fromJson(reader, type)
                cachedQuestions = questions
                questions
            }
        } catch (e: Exception) {
            e.printStackTrace()
            emptyList()
        }
    }

    fun getQuestionsBySurah(context: Context, surahNumber: Int): List<MutashabihQuestion> {
        return getQuestions(context).filter { it.surah_number == surahNumber }
    }

    fun getQuestionsByJuz(context: Context, juzNumber: Int): List<MutashabihQuestion> {
        return getQuestions(context).filter { it.juz_number == juzNumber }
    }

    fun getQuestionsByCategory(context: Context, category: String): List<MutashabihQuestion> {
        return getQuestions(context).filter { it.category == category }
    }
}
