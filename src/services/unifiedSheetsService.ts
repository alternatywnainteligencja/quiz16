/**
 * NOWY SERWIS - Pobiera pytania + wagi z JEDNEGO arkusza
 * Format: ID | Question | Answer | Points | MainRisk | SideRisks
 */

import axios from 'axios';

const CSV_URLS = {
  crisis: import.meta.env.VITE_SHEET_UNIFIED_CRISIS || '',
  before: import.meta.env.VITE_SHEET_UNIFIED_BEFORE || '',
  divorce: import.meta.env.VITE_SHEET_UNIFIED_DIVORCE || '',
  married: import.meta.env.VITE_SHEET_UNIFIED_MARRIED || '',
};

export type PathwayType = 'before' | 'crisis' | 'divorce' | 'married';

export interface QuestionOption {
  text: string;
  riskPoints: number;
  mainRisk: string;
  sideRisks: string[];
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
}

export interface PathwayData {
  questions: Question[];
  weights: WeightEntry[];
}

export interface WeightEntry {
  questionId: string;
  answer: string;
  riskPoints: number;
  mainRisk: string;
  sideRisks: string[];
}

/**
 * Pobiera i parsuje zunifikowany arkusz (pytania + wagi razem)
 */
export async function fetchUnifiedData(pathway: PathwayType): Promise<PathwayData> {
  const csvUrl = CSV_URLS[pathway];
  
  console.log(`🔄 Fetching unified data for: ${pathway}`);
  
  if (!csvUrl) {
    const errorMsg = `❌ Brak URL dla ${pathway}!\n\nDodaj do .env:\nVITE_SHEET_UNIFIED_${pathway.toUpperCase()}`;
    console.error(errorMsg);
    alert(errorMsg);
    throw new Error(`No CSV URL configured for pathway: ${pathway}`);
  }

  console.log(`📡 Request URL: ${csvUrl.substring(0, 50)}...`);

  try {
    const response = await axios.get(csvUrl, {
      responseType: 'arraybuffer',
      headers: {
        'Accept': 'text/csv; charset=utf-8'
      },
      timeout: 10000
    });
    
    console.log(`✅ Response received (${response.status})`);
    
    const decoder = new TextDecoder('utf-8');
    const csvData = decoder.decode(response.data);
    const lines = csvData.trim().split('\n');
    
    console.log(`📊 Total lines: ${lines.length}`);
    console.log(`📋 Header: ${lines[0]}`);
    
    const dataLines = lines.slice(1); // Skip header
    
    // Grupuj odpowiedzi po pytaniach
    const questionsMap = new Map<string, QuestionOption[]>();
    const weights: WeightEntry[] = [];
    let questionTexts = new Map<string, string>();

    dataLines.forEach((line, index) => {
      if (!line.trim()) return;
      
      const columns = parseCSVLine(line);
      
      // Sprawdź czy mamy wszystkie kolumny
      if (columns.length < 6) {
        console.warn(`⚠️ Row ${index + 2} has only ${columns.length} columns:`, line);
        return;
      }

      const [
        rawId,
        questionText,
        answer,
        riskPointsStr,
        mainRisk,
        sideRisksStr
      ] = columns;

      // Wyczyść ID (usuń prefix jak "crisis_" jeśli jest)
      const questionId = rawId.trim();
      
      // Zapisz tekst pytania
      if (questionText && questionText.trim()) {
        questionTexts.set(questionId, questionText.trim());
      }

      // Parse risk points
      const riskPoints = parseInt(riskPointsStr.trim()) || 0;

      // Parse side risks (oddzielone przecinkami lub kropkami)
      const sideRisks = sideRisksStr
        .split(/[,.]/)
        .map(r => r.trim())
        .filter(r => r.length > 0 && r !== '-');

      // Dodaj opcję do pytania
      const option: QuestionOption = {
        text: answer.trim(),
        riskPoints,
        mainRisk: mainRisk.trim(),
        sideRisks
      };

      if (!questionsMap.has(questionId)) {
        questionsMap.set(questionId, []);
      }
      questionsMap.get(questionId)!.push(option);

      // Dodaj do wag
      weights.push({
        questionId,
        answer: answer.trim(),
        riskPoints,
        mainRisk: mainRisk.trim(),
        sideRisks
      });
    });

    // Buduj questions array
    const questions: Question[] = Array.from(questionsMap.entries()).map(([id, options]) => ({
      id,
      text: questionTexts.get(id) || `Pytanie ${id}`,
      options
    }));

    console.log(`✅ Parsed ${questions.length} questions with ${weights.length} total options`);
    
    // Debug: pokaż pierwsze pytanie
    if (questions.length > 0) {
      console.log('📝 First question:', {
        id: questions[0].id,
        text: questions[0].text.substring(0, 50),
        optionsCount: questions[0].options.length
      });
    }

    return { questions, weights };

  } catch (error: any) {
    console.error('❌ Error fetching unified data:', error);
    
    let errorMsg = `❌ BŁĄD POBIERANIA DANYCH (${pathway}):\n\n`;
    
    if (error.code === 'ECONNABORTED') {
      errorMsg += 'Timeout - brak odpowiedzi\n';
    } else if (error.response) {
      errorMsg += `Status: ${error.response.status}\n`;
      errorMsg += `Info: ${error.response.statusText}\n`;
    } else if (error.request) {
      errorMsg += 'Brak odpowiedzi od serwera\n';
    } else {
      errorMsg += error.message + '\n';
    }
    
    errorMsg += `\nURL: ${csvUrl.substring(0, 100)}`;
    
    alert(errorMsg);
    throw error;
  }
}

/**
 * Parse CSV line z obsługą cudzysłowów
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

/**
 * Cache
 */
const cache: Record<PathwayType, { data: PathwayData; timestamp: number } | null> = {
  before: null,
  crisis: null,
  divorce: null,
  married: null,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchUnifiedDataWithCache(pathway: PathwayType): Promise<PathwayData> {
  const now = Date.now();
  const cached = cache[pathway];
  
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    console.log(`✅ Using cached data for ${pathway}`);
    return cached.data;
  }
  
  console.log(`🔄 Fetching fresh data for ${pathway}`);
  const data = await fetchUnifiedData(pathway);
  cache[pathway] = { data, timestamp: now };
  
  return data;
}

export function clearCache(pathway?: PathwayType): void {
  if (pathway) {
    cache[pathway] = null;
  } else {
    Object.keys(cache).forEach(key => {
      cache[key as PathwayType] = null;
    });
  }
}
