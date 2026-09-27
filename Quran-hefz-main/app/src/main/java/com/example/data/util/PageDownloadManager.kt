package com.example.data.util

import android.content.Context
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream
import java.net.HttpURLConnection
import java.net.URL

class PageDownloadManager(private val context: Context) {

    private val pagesDir = File(context.filesDir, "mushaf_pages").apply {
        if (!exists()) mkdirs()
    }

    /**
     * المسار المحلي لصفحة المصحف المخزنة على ذاكرة الهاتف
     */
    fun getLocalPageFile(pageNumber: Int): File {
        val padded = String.format("%03d", pageNumber)
        return File(pagesDir, "page_$padded.png")
    }

    /**
     * فحص هل الصفحة محملة مسبقاً وتعمل بدون إنترنت
     */
    fun isPageDownloaded(pageNumber: Int): Boolean {
        val file = getLocalPageFile(pageNumber)
        return file.exists() && file.length() > 0
    }

    /**
     * عدد الصفحات المحملة حالياً من أصل 604
     */
    fun getDownloadedPagesCount(): Int {
        val files = pagesDir.listFiles() ?: return 0
        return files.count { it.name.startsWith("page_") && it.length() > 0 }
    }

    /**
     * تحميل صفحة وحيدة وتخزينها في ذاكرة الهاتف الداخلية للأبد
     */
    suspend fun downloadPage(pageNumber: Int): Boolean = withContext(Dispatchers.IO) {
        val targetFile = getLocalPageFile(pageNumber)
        if (targetFile.exists() && targetFile.length() > 1024) return@withContext true

        val padded = String.format("%03d", pageNumber)
        // رابط خادم صفحات مصحف المدينة عالي الدقة والموثوق
        val primaryUrl = "https://everyayah.com/data/quranpngs/$padded.png"
        val fallbackUrl = "https://cdn.islamic.network/quran/images/page/$pageNumber"

        var success = downloadFromUrl(primaryUrl, targetFile)
        if (!success) {
            success = downloadFromUrl(fallbackUrl, targetFile)
        }
        success
    }

    private fun downloadFromUrl(urlString: String, destination: File): Boolean {
        return try {
            val url = URL(urlString)
            val connection = url.openConnection() as HttpURLConnection
            connection.connectTimeout = 10000
            connection.readTimeout = 10000
            connection.instanceFollowRedirects = true

            if (connection.responseCode == HttpURLConnection.HTTP_OK) {
                connection.inputStream.use { input ->
                    FileOutputStream(destination).use { output ->
                        input.copyTo(output)
                    }
                }
                destination.exists() && destination.length() > 0
            } else {
                false
            }
        } catch (e: Exception) {
            destination.delete()
            false
        }
    }

    /**
     * تحميل جميع صفحات المصحف الـ 604 في الخلفية مرة واحدة
     */
    suspend fun downloadAllPages(onProgress: (downloaded: Int, total: Int) -> Unit) = withContext(Dispatchers.IO) {
        val total = 604
        for (page in 1..total) {
            downloadPage(page)
            val currentCount = getDownloadedPagesCount()
            onProgress(currentCount, total)
        }
    }
}
