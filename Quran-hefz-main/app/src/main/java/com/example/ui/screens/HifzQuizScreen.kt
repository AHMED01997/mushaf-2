package com.example.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.MutashabihQuestion
import com.example.data.util.MutashabihatBank

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HifzQuizScreen(
    onNavigateBack: () -> Unit = {},
    onOpenVerseInMushaf: (Int, Int) -> Unit = { _, _ -> }
) {
    val context = LocalContext.current
    val allQuestions = remember { MutashabihatBank.getQuestions(context) }
    var currentIndex by remember { mutableIntStateOf(0) }
    var streak by remember { mutableIntStateOf(0) }
    var correctCount by remember { mutableIntStateOf(0) }

    if (allQuestions.isEmpty()) {
        Box(
            modifier = Modifier.fillMaxSize().background(Color(0xFF0F172A)),
            contentAlignment = Alignment.Center
        ) {
            Text("لا توجد أسئلة متاحة في بنك المتشابهات", color = Color.White)
        }
        return
    }

    val currentQuestion = allQuestions[currentIndex]

    // Phase control: before answer vs after answer
    var selectedOption by remember(currentQuestion.id) { mutableStateOf<String?>(null) }
    val isAnswered = selectedOption != null

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        "اختبار المتشابهات القرآني",
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "رجوع", tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF0F172A)
                )
            )
        },
        containerColor = Color(0xFF0B132B)
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Stats Header
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .background(Color(0xFF1E293B))
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        "السؤال ${currentIndex + 1} من ${allQuestions.size}",
                        color = Color(0xFF38BDF8),
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        "🔥 التتابع: $streak",
                        color = Color(0xFFFBBF24),
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        "الصواب: $correctCount",
                        color = Color(0xFF34D399),
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            // Question Info Badge
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = "سورة ${currentQuestion.surah_name} : آية ${currentQuestion.ayah_number}",
                        color = Color(0xFF10B981),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .background(Color(0xFF064E3B))
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                    Text(
                        text = currentQuestion.category,
                        color = Color(0xFFE2E8F0),
                        fontSize = 12.sp,
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .background(Color(0xFF334155))
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }
            }

            // =========================================================================
            // PHASE 1: BEFORE ANSWER
            // يُعرض قبل الإجابة: stem_ar و display_verse_ar والخيارات فقط!
            // =========================================================================
            item {
                // 1. نص السؤال (stem_ar)
                Text(
                    text = currentQuestion.stem_ar,
                    style = MaterialTheme.typography.titleMedium,
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Right,
                    modifier = Modifier.fillMaxWidth()
                )
            }

            item {
                // 2. الآية موضع السؤال مع الفراغ (display_verse_ar)
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF13221C)),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = currentQuestion.display_verse_ar,
                        color = Color(0xFFA7F3D0),
                        fontSize = 22.sp,
                        textAlign = TextAlign.Center,
                        lineHeight = 36.sp,
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(20.dp)
                    )
                }
            }

            // 3. الخيارات (options)
            item {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    currentQuestion.options.forEach { option ->
                        val isSelected = option == selectedOption
                        val isCorrect = option == currentQuestion.correct_answer

                        val backgroundColor = when {
                            !isAnswered -> Color(0xFF1E293B)
                            isCorrect -> Color(0xFF065F46) // أخضر
                            isSelected && !isCorrect -> Color(0xFF9F1239) // أحمر
                            else -> Color(0xFF1E293B).copy(alpha = 0.4f)
                        }

                        val borderColor = when {
                            !isAnswered -> Color(0xFF334155)
                            isCorrect -> Color(0xFF10B981)
                            isSelected && !isCorrect -> Color(0xFFF43F5E)
                            else -> Color.Transparent
                        }

                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(14.dp))
                                .background(backgroundColor)
                                .border(1.5.dp, borderColor, RoundedCornerShape(14.dp))
                                .clickable(enabled = !isAnswered) {
                                    selectedOption = option
                                    if (isCorrect) {
                                        streak++
                                        correctCount++
                                    } else {
                                        streak = 0
                                    }
                                }
                                .padding(16.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = option,
                                    fontSize = 18.sp,
                                    color = Color.White,
                                    fontWeight = FontWeight.Medium
                                )
                                if (isAnswered && isCorrect) {
                                    Icon(Icons.Default.CheckCircle, contentDescription = null, tint = Color(0xFF10B981))
                                } else if (isAnswered && isSelected && !isCorrect) {
                                    Icon(Icons.Default.Close, contentDescription = null, tint = Color(0xFFF43F5E))
                                }
                            }
                        }
                    }
                }
            }

            // =========================================================================
            // PHASE 2: AFTER ANSWER
            // يُعرض بعد الإجابة حصراً: face_of_distinction_ar ثم feedback_on_error_ar ثم comparison_verses_ar
            // =========================================================================
            if (isAnswered) {
                // 1. وجه التفريق والضابط الحفظي المعتمد (face_of_distinction_ar)
                item {
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Color(0xFF261D0C)),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(
                                text = "💡 وجه التفريق والضابط الحفظي المعتمد:",
                                color = Color(0xFFFBBF24),
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp
                            )
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = currentQuestion.face_of_distinction_ar,
                                color = Color(0xFFFDE68A),
                                fontSize = 14.sp,
                                lineHeight = 22.sp
                            )
                        }
                    }
                }

                // 2. التوجيه عند الخطأ وضبط الموضع (feedback_on_error_ar)
                item {
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Color(0xFF0C2431)),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(
                                text = "⚠️ التوجيه الإرشادي وضبط الموضع:",
                                color = Color(0xFF38BDF8),
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp
                            )
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = currentQuestion.feedback_on_error_ar,
                                color = Color(0xFFBAE6FD),
                                fontSize = 14.sp,
                                lineHeight = 22.sp
                            )
                        }
                    }
                }

                // 3. الآيات المقارنة (comparison_verses_ar)
                if (currentQuestion.comparison_verses_ar.isNotEmpty()) {
                    item {
                        Text(
                            text = "📖 الآيات المقارنة في القرآن الكريم:",
                            color = Color(0xFF34D399),
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp,
                            modifier = Modifier.padding(top = 8.dp)
                        )
                    }

                    items(currentQuestion.comparison_verses_ar.size) { idx ->
                        val comp = currentQuestion.comparison_verses_ar[idx]
                        Card(
                            colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)),
                            shape = RoundedCornerShape(14.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(14.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        text = "سورة ${comp.surah_name} : آية ${comp.ayah_number}",
                                        color = Color(0xFF10B981),
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 12.sp
                                    )
                                    Text(
                                        text = "عرض بالمصحف",
                                        color = Color(0xFF38BDF8),
                                        fontSize = 11.sp,
                                        modifier = Modifier.clickable {
                                            onOpenVerseInMushaf(comp.surah_number, comp.ayah_number)
                                        }
                                    )
                                }
                                Spacer(modifier = Modifier.height(6.dp))
                                Text(
                                    text = comp.verse_text,
                                    color = Color.White,
                                    fontSize = 16.sp,
                                    lineHeight = 26.sp
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "📌 الفارق: ${comp.distinction_note}",
                                    color = Color(0xFFFCD34D),
                                    fontSize = 12.sp
                                )
                            }
                        }
                    }
                }

                // Next Button
                item {
                    Button(
                        onClick = {
                            if (currentIndex < allQuestions.size - 1) {
                                currentIndex++
                            } else {
                                currentIndex = 0
                            }
                            selectedOption = null
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF059669)),
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 12.dp)
                    ) {
                        Text("السؤال التالي ⬅️", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
