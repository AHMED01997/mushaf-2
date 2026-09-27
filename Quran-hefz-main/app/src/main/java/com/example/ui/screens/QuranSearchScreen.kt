package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.Ayah
import com.example.data.util.QuranSearchEngine
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun QuranSearchScreen(
    allAyahs: List<Ayah>,
    onNavigateBack: () -> Unit = {},
    onSelectAyah: (Int, Int) -> Unit = { _, _ -> }
) {
    var searchQuery by remember { mutableStateOf("") }
    var exactWordMode by remember { mutableStateOf(true) }
    var searchResults by remember { mutableStateOf<List<Ayah>>(emptyList()) }
    var isSearching by remember { mutableStateOf(false) }

    // بحث خفيف وغير معطل للواجهة في خيط منفصل (Dispatchers.Default)
    LaunchedEffect(searchQuery, exactWordMode) {
        val query = searchQuery.trim()
        if (query.length < 2) {
            searchResults = emptyList()
            isSearching = false
            return@LaunchedEffect
        }

        isSearching = true
        val results = withContext(Dispatchers.Default) {
            allAyahs.filter { ayah ->
                QuranSearchEngine.matchAyah(ayah.text, query, exactWordMode)
            }
        }
        searchResults = results
        isSearching = false
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("البحث القرآني الدقيق", fontWeight = FontWeight.Bold, color = Color.White) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "رجوع", tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFF0F172A))
            )
        },
        containerColor = Color(0xFF0B132B)
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Search Input Box
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("اكتب كلمة البحث (مثال: المنافقين، الكفر)...", color = Color(0xFF94A3B8)) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = Color(0xFF38BDF8)) },
                trailingIcon = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(onClick = { searchQuery = "" }) {
                            Icon(Icons.Default.Clear, contentDescription = "مسح", tint = Color.White)
                        }
                    }
                },
                shape = RoundedCornerShape(16.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color(0xFF38BDF8),
                    unfocusedBorderColor = Color(0xFF334155),
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White
                ),
                modifier = Modifier.fillMaxWidth()
            )

            // Mode Selector
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                FilterChip(
                    selected = exactWordMode,
                    onClick = { exactWordMode = true },
                    label = { Text("مطابقة كلمة تامة (لمنع الخلط)", fontSize = 12.sp) }
                )
                FilterChip(
                    selected = !exactWordMode,
                    onClick = { exactWordMode = false },
                    label = { Text("بحث شامل / مرن", fontSize = 12.sp) }
                )
            }

            // Results count
            if (searchQuery.length >= 2) {
                Text(
                    text = if (isSearching) "جاري البحث..." else "تم العثور على ${searchResults.size} آية",
                    color = Color(0xFF38BDF8),
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            // Results List
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(searchResults) { ayah ->
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onSelectAyah(ayah.page, ayah.numberInSurah) }
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    text = "سورة ${ayah.surahName} (الآية ${ayah.numberInSurah})",
                                    color = Color(0xFF10B981),
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 13.sp
                                )
                                Text(
                                    text = "صفحة ${ayah.page}",
                                    color = Color(0xFFFBBF24),
                                    fontSize = 12.sp
                                )
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = ayah.text,
                                color = Color.White,
                                fontSize = 17.sp,
                                lineHeight = 28.sp,
                                textAlign = TextAlign.Right,
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                    }
                }
            }
        }
    }
}
