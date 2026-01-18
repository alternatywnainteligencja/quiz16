// src/services/googleSheetsService.ts

import Papa from 'papaparse';
import { QuizData } from '../calculations/types';
import { parseCSVToQuizData, validateCSVStructure } from '../calculations/utils/csvParser';

let cachedQuizData: QuizData | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minut
let lastFetchTime = 0;

/**
 * Pobiera i parsuje CSV
 */
export async function fetchQuizData(): Promise<QuizData> {
  const now = Date.now();
  
  if (cachedQuizData && (now - lastFetchTime) < CACHE_DURATION) {
    console.log('♻️ Using cached quiz data');
    return cachedQuizData;
  }
  
  console.log('📡 Fetching quiz data from CSV...');
  
  try {
    // URL do opublikowanego CSV z Google Sheets
    const CSV_URL = process.env.REACT_APP_CSV_URL || '';
    
    if (!CSV_URL) {
      throw new Error('CSV_URL not configured. Set REACT_APP_CSV_URL in .env file');
    }
    
    console.log('🔗 Fetching from:', CSV_URL);
    
    const response = await fetch(CSV_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    
    console.log('📥 CSV downloaded:');
    console.log('   Size:', csvText.length, 'chars');
    console.log('   First 300 chars:', csvText.substring(0, 300));
    
    // Parsuj CSV BEZ nagłówka (header: false)
    const parsed = Papa.parse(csvText, {
      header: false,           // WAŻNE: brak nagłówka
      dynamicTyping: false,
      skipEmptyLines: true,
      transform: (value: string) => value.trim()
    });
    
    if (parsed.errors.length > 0) {
      console.warn('⚠️ CSV parsing warnings:', parsed.errors);
    }
    
    console.log('📊 CSV parsed:');
    console.log('   Rows:', parsed.data.length);
    console.log('   First row:', parsed.data[0]);
    console.log('   Second row:', parsed.data[1]);
    
    // Waliduj
    if (!validateCSVStructure(parsed.data)) {
      throw new Error('Invalid CSV structure');
    }
    
    // Konwertuj na QuizData
    const quizData = parseCSVToQuizData(parsed.data);
    
    if (quizData.questions.length === 0) {
      throw new Error('No questions found in CSV');
    }
    
    if (quizData.weights.length === 0) {
      throw new Error('No weights found in CSV');
    }
    
    // Cache
    cachedQuizData = quizData;
    lastFetchTime = now;
    
    return quizData;
    
  } catch (error) {
    console.error('❌ Error fetching quiz data:', error);
    throw error;
  }
}

export function clearQuizDataCache(): void {
  console.log('🗑️ Clearing quiz data cache');
  cachedQuizData = null;
  lastFetchTime = 0;
}

// Kompatybilność wsteczna
export async function fetchWeightsWithCache() {
  const quizData = await fetchQuizData();
  return {
    weights: quizData.weights,
    lastUpdated: quizData.lastUpdated
  };
}

export type { QuizData };
