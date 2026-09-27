package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.Ayah

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun AyahHighlightingCard(
    ayah: Ayah,
    isAyahHighlighted: Boolean,
    highlightedWords: Map<String, Boolean>,
    onToggleFullAyah: () -> Unit,
    onToggleWord: (Int) -> Unit
) {
    val words = ayah.text.split(" ").filter { it.isNotBlank() }

    Card(
        colors = CardDefaults.cardColors(
            containerColor = if (isAyahHighlighted) Color(0xFF2E2412) else Color(0xFF1E293B)
        ),
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier
            .fillMaxWidth()
            .border(
                1.5.dp,
                if (isAyahHighlighted) Color(0xFFFBBF24) else Color(0xFF334155),
                RoundedCornerShape(16.dp)
            )
            .padding(vertical = 4.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            
            // Header with Full Ayah Toggle Button
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "سورة ${ayah.surahName} : آية ${ayah.numberInSurah}",
                    color = Color(0xFF34D399),
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp
                )

                // زر تظليل الآية كاملة (يظلل الآية ومربعات كلماتها فوراً)
                Button(
                    onClick = onToggleFullAyah,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isAyahHighlighted) Color(0xFFF59E0B) else Color(0xFF334155)
                    ),
                    shape = RoundedCornerShape(10.dp),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Text(
                        text = if (isAyahHighlighted) "إلغاء تظليل الآية" else "تظليل الآية كاملة",
                        color = if (isAyahHighlighted) Color.Black else Color.White,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // نص الآية الكامل
            Text(
                text = ayah.text,
                fontSize = 20.sp,
                color = Color.White,
                lineHeight = 32.sp,
                textAlign = TextAlign.Right,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(14.dp))
            HorizontalDivider(color = Color(0xFF334155), thickness = 1.dp)
            Spacer(modifier = Modifier.height(10.dp))

            // مربعات الكلمات التفاعلية (تتظلل فوراً عند تظليل الآية وتتفاعل فردياً)
            Text(
                text = "مربعات الكلمات (انقر للتظليل أو الكشف):",
                color = Color(0xFF94A3B8),
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(8.dp))

            FlowRow(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp),
                verticalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                words.forEachIndexed { index, word ->
                    val wordKey = "${ayah.surahNumber}:${ayah.numberInSurah}:$index"
                    val isWordHighlighted = isAyahHighlighted || (highlightedWords[wordKey] == true)

                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(10.dp))
                            .background(
                                if (isWordHighlighted) Color(0xFFF59E0B) else Color(0xFF0F172A)
                            )
                            .border(
                                1.dp,
                                if (isWordHighlighted) Color(0xFFFBBF24) else Color(0xFF475569),
                                RoundedCornerShape(10.dp)
                            )
                            .clickable { onToggleWord(index) }
                            .padding(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = word,
                            fontSize = 15.sp,
                            fontWeight = if (isWordHighlighted) FontWeight.Bold else FontWeight.Normal,
                            color = if (isWordHighlighted) Color.Black else Color.White
                        )
                    }
                }
            }
        }
    }
}
