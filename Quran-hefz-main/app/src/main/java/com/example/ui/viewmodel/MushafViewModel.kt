package com.example.ui.viewmodel

import android.app.Application
import androidx.compose.runtime.mutableStateMapOf
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.model.Ayah
import com.example.data.util.PageDownloadManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class MushafViewModel(application: Application) : AndroidViewModel(application) {

    private val pageDownloadManager = PageDownloadManager(application)

    // حالة تظليل الآيات والكلمات
    val highlightedAyahs = mutableStateMapOf<String, Boolean>()
    val highlightedWords = mutableStateMapOf<String, Boolean>()

    // حالة تحميل صفحات المصحف أوفلاين
    private val _downloadedPagesCount = MutableStateFlow(0)
    val downloadedPagesCount = _downloadedPagesCount.asStateFlow()

    init {
        refreshDownloadedPagesCount()
    }

    fun refreshDownloadedPagesCount() {
        _downloadedPagesCount.value = pageDownloadManager.getDownloadedPagesCount()
    }

    /**
     * حل مشكلة التظليل: عند تظليل آية كاملة، يتم تظليل جميع مربعات الكلمات التابعة لها فوراً
     */
    fun toggleFullAyah(ayah: Ayah) {
        val ayahKey = "${ayah.surahNumber}:${ayah.numberInSurah}"
        val currentState = highlightedAyahs[ayahKey] ?: false
        val newState = !currentState

        highlightedAyahs[ayahKey] = newState

        val words = ayah.text.split(" ").filter { it.isNotBlank() }
        for (i in words.indices) {
            val wordKey = "${ayah.surahNumber}:${ayah.numberInSurah}:$i"
            if (newState) {
                highlightedWords[wordKey] = true
            } else {
                highlightedWords.remove(wordKey)
            }
        }
    }

    /**
     * عند النقر على مربع كلمة فردي
     */
    fun toggleWord(ayah: Ayah, wordIndex: Int) {
        val wordKey = "${ayah.surahNumber}:${ayah.numberInSurah}:$wordIndex"
        val isHighlighted = highlightedWords[wordKey] == true

        if (isHighlighted) {
            highlightedWords.remove(wordKey)
        } else {
            highlightedWords[wordKey] = true
        }

        // فحص هل جميع كلمات الآية أصبحت مظللة
        val words = ayah.text.split(" ").filter { it.isNotBlank() }
        val allHighlighted = words.indices.all { idx ->
            highlightedWords["${ayah.surahNumber}:${ayah.numberInSurah}:$idx"] == true
        }

        val ayahKey = "${ayah.surahNumber}:${ayah.numberInSurah}"
        highlightedAyahs[ayahKey] = allHighlighted
    }

    /**
     * بدء تحميل صفحات المصحف الـ 604 في الخلفية للعمل بدون إنترنت
     */
    fun downloadAllPagesForOffline(onProgress: (Int, Int) -> Unit) {
        viewModelScope.launch {
            pageDownloadManager.downloadAllPages { downloaded, total ->
                _downloadedPagesCount.value = downloaded
                onProgress(downloaded, total)
            }
        }
    }
}
