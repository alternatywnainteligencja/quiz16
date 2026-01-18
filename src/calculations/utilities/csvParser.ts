// src/calculations/utils/csvParser.ts

import { CSVRow, QuizQuestion, AnswerWeight, QuizData } from '../types';

/**
 * Parsuje ryzyka poboczne (rozdzielone przecinkami)
 */
export function parseSideRisks(sideRisks: string): string[] {
  if (!sideRisks || sideRisks === '-' || sideRisks.trim() === '') {
    return [];
  }
  return sideRisks
    .split(',')
    .map(r => r.trim())
    .filter(r => r && r !== '-');
}

/**
 * Parsuje opcje odpowiedzi (rozdzielone |)
 */
export function parseOptions(optionsString: string): string[] {
  if (!optionsString || optionsString.trim() === '') {
    return [];
  }
  return optionsString
    .split('|')
    .map(o => o.trim())
    .filter(Boolean);
}

/**
 * Sprawdza czy wiersz to nagłówek pytania
 * (kolumna 2 i 3 zawierają to samo pytanie)
 */
function isQuestionHeader(row: any[]): boolean {
  const questionText = row[1]?.trim();
  const answerText = row[2]?.trim();
  
  // Jeśli kolumna 2 i 3 są takie same = nagłówek
  return questionText === answerText;
}

/**
 * Główna funkcja parsująca CSV
 */
export function parseCSVToQuizData(rows: any[]): QuizData {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔄 PARSING CSV TO QUIZ DATA');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Total rows:', rows.length);
  
  const questions: QuizQuestion[] = [];
  const weights: AnswerWeight[] = [];
  
  rows.forEach((row, index) => {
    // Konwertuj obiekt/tablicę na tablicę
    const rowArray = Array.isArray(row) ? row : Object.values(row);
    
    const questionId = parseInt(rowArray[0]);
    const questionText = rowArray[1]?.trim() || '';
    const answerOrQuestionRepeat = rowArray[2]?.trim() || '';
    const riskPointsStr = rowArray[3]?.trim() || '';
    const mainRisk = rowArray[4]?.trim() || '';
    const sideRisksStr = rowArray[5]?.trim() || '';
    const comment = rowArray[6]?.trim() || '';
    const optionsStr = rowArray[7]?.trim() || '';
    
    // Ignoruj całkowicie puste wiersze
    if (!questionId || !questionText) {
      return;
    }
    
    // CZY TO NAGŁÓWEK PYTANIA?
    if (isQuestionHeader(rowArray)) {
      console.log(`\n📌 Question ${questionId}: "${questionText}"`);
      
      // Parsuj opcje
      const options = parseOptions(optionsStr);
      console.log(`   Options (${options.length}):`, options);
      
      if (options.length === 0) {
        console.warn(`   ⚠️ No options found for question ${questionId}`);
      }
      
      questions.push({
        id: questionId,
        text: questionText,
        options: options
      });
      
    } else {
      // TO WIERSZ Z ODPOWIEDZIĄ I WAGĄ
      const answer = answerOrQuestionRepeat;
      
      if (!answer) {
        console.warn(`   ⚠️ Row ${index + 1}: Empty answer, skipping`);
        return;
      }
      
      const riskPoints = parseInt(riskPointsStr) || 0;
      const sideRisks = parseSideRisks(sideRisksStr);
      
      console.log(`   ✓ Answer: "${answer}" → ${riskPoints} pts`);
      console.log(`      Main: ${mainRisk}, Side: ${sideRisks.join(', ') || 'none'}`);
      
      weights.push({
        questionId: questionId,
        questionText: questionText,
        answer: answer,
        riskPoints: riskPoints,
        mainRisk: mainRisk || '-',
        sideRisks: sideRisks,
        comment: comment
      });
    }
  });
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ PARSING COMPLETE');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Questions:', questions.length);
  console.log('⚖️  Weights:', weights.length);
  console.log('📝 Sample question:', questions[0]);
  console.log('🎯 Sample weight:', weights[0]);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  return {
    questions,
    weights,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Walidacja struktury
 */
export function validateCSVStructure(data: any[]): boolean {
  if (!data || data.length === 0) {
    console.error('❌ CSV is empty');
    return false;
  }
  
  // Sprawdź czy pierwszy wiersz ma przynajmniej 8 kolumn
  const firstRow = Array.isArray(data[0]) ? data[0] : Object.values(data[0]);
  
  if (firstRow.length < 8) {
    console.error('❌ CSV has less than 8 columns:', firstRow.length);
    console.log('📋 First row:', firstRow);
    return false;
  }
  
  console.log('✅ CSV structure looks valid');
  console.log('   Columns:', firstRow.length);
  return true;
}
