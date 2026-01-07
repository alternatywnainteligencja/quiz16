// FREE VERSION - No API key needed!

import axios from 'axios';

// Your published CSV URLs for each pathway
const CSV_URLS = {
  before: import.meta.env.VITE_SHEET_CSV_URL_BEFORE || '',
  crisis: import.meta.env.VITE_SHEET_CSV_URL_CRISIS || '',
  divorce: import.meta.env.VITE_SHEET_CSV_URL_DIVORCE || '',
  married: import.meta.env.VITE_SHEET_CSV_URL_MARRIED || '',
  weights: import.meta.env.VITE_SHEET_CSV_URL_WEIGHTS || '',
};

// 🔥 DEBUG: Sprawdź czy URL-e są skonfigurowane
console.log('📋 CSV URLs configured:');
Object.entries(CSV_URLS).forEach(([key, url]) => {
  if (url) {
    console.log(`  ✅ ${key}: ${url.substring(0, 50)}...`);
  } else {
    console.warn(`  ❌ ${key}: BRAK URL!`);
  }
});

export type PathwayType = 'before' | 'crisis' | 'divorce' | 'married';

export interface QuestionOption {
  text: string;
  next?: string;
}

export interface Question {
  id: string;
  q: string;
  opts: (string | QuestionOption)[];
}

export interface RiskWeight {
  questionId: string;
  questionText: string;
  answer: string;
  riskPoints: number;
  mainRisk: string;
  sideRisks: string[];
  comment?: string;
}

export interface WeightsData {
  weights: RiskWeight[];
  riskCategories: string[];
  lastUpdated: string;
}

/**
 * Fetches questions from published Google Sheets CSV
 */
export async function fetchQuestionsFromSheets(pathway: PathwayType): Promise<Question[]> {
  const csvUrl = CSV_URLS[pathway];
  
  console.log(`🔄 Fetching questions for pathway: ${pathway}`);
  
  if (!csvUrl) {
    const errorMsg = `❌ Brak URL dla pathway: ${pathway}\n\nSprawdź plik .env:\nVITE_SHEET_CSV_URL_${pathway.toUpperCase()}`;
    console.error(errorMsg);
    alert(errorMsg);
    throw new Error(`No CSV URL configured for pathway: ${pathway}`);
  }

  console.log(`📡 Wysyłam request do: ${csvUrl.substring(0, 50)}...`);

  try {
    const response = await axios.get(csvUrl, {
      responseType: 'arraybuffer',
      headers: {
        'Accept': 'text/csv; charset=utf-8'
      },
      timeout: 10000 // 10 sekund timeout
    });
    
    console.log(`✅ Otrzymano odpowiedź (${response.status})`);
    
    const decoder = new TextDecoder('utf-8');
    const csvData = decoder.decode(response.data);
    const lines = csvData.trim().split('\n');
    const dataLines = lines.slice(1);
    
    console.log(`📊 Liczba linii w CSV: ${dataLines.length}`);
    
    const questions: Question[] = dataLines
      .filter((line: string) => line.trim())
      .map((line: string) => {
        const columns = parseCSVLine(line);
        
        if (columns.length < 3) {
          console.warn('Invalid row:', line);
          return null;
        }
        
        const [id, question, optionsStr, nextConditionsStr = ''] = columns;
        
        const optionsArray = optionsStr
          .split('|')
          .map(opt => opt.trim())
          .filter(opt => opt.length > 0);

        let opts: QuestionOption[] = [];
        
        if (nextConditionsStr && nextConditionsStr.trim()) {
          const conditions = nextConditionsStr.split(';').map(c => c.trim());
          const nextMap: Record<string, string> = {};
          
          conditions.forEach(condition => {
            const [option, nextId] = condition.split('->').map(s => s.trim());
            if (option && nextId) {
              nextMap[option] = nextId;
            }
          });

          opts = optionsArray.map(opt => {
            if (nextMap[opt]) {
              return { text: opt, next: nextMap[opt] };
            }
            return { text: opt };
          });
        } else {
          opts = optionsArray.map(opt => ({ text: opt }));
        }

        return {
          id: id.trim(),
          q: question.trim(),
          opts
        };
      })
      .filter((q): q is Question => q !== null);

    if (questions.length === 0) {
      const errorMsg = `❌ Brak pytań w arkuszu dla ${pathway}!`;
      console.error(errorMsg);
      alert(errorMsg);
      throw new Error('No valid questions found in sheet');
    }

    console.log(`✅ Załadowano ${questions.length} pytań dla ${pathway}`);
    return questions;

  } catch (error: any) {
    console.error('❌ Error fetching questions:', error);
    
    let errorMsg = `❌ BŁĄD POBIERANIA PYTAŃ (${pathway}):\n\n`;
    
    if (error.code === 'ECONNABORTED') {
      errorMsg += 'Timeout - brak odpowiedzi z serwera\n';
    } else if (error.response) {
      errorMsg += `Status: ${error.response.status}\n`;
      errorMsg += `Dane: ${error.response.statusText}\n`;
    } else if (error.request) {
      errorMsg += 'Brak odpowiedzi od serwera\n';
      errorMsg += 'Sprawdź połączenie internetowe\n';
    } else {
      errorMsg += error.message + '\n';
    }
    
    errorMsg += `\nURL: ${csvUrl.substring(0, 100)}...`;
    
    alert(errorMsg);
    throw error;
  }
}

/**
 * FUNKCJA: Pobiera wagi/ryzyko z arkusza
 */
export async function fetchWeightsFromSheets(): Promise<WeightsData> {
  const csvUrl = CSV_URLS.weights;
  
  console.log('🔄 Fetching weights from Google Sheets...');
  
  if (!csvUrl) {
    const errorMsg = '❌ Brak URL dla WEIGHTS!\n\nSprawdź plik .env:\nVITE_SHEET_CSV_URL_WEIGHTS';
    console.error(errorMsg);
    alert(errorMsg);
    throw new Error('No weights CSV URL configured');
  }

  console.log(`📡 Wysyłam request do weights: ${csvUrl.substring(0, 50)}...`);

  try {
    const response = await axios.get(csvUrl, {
      responseType: 'arraybuffer',
      headers: {
        'Accept': 'text/csv; charset=utf-8'
      },
      timeout: 10000
    });
    
    console.log(`✅ Otrzymano odpowiedź weights (${response.status})`);
    
    const decoder = new TextDecoder('utf-8');
    const csvData = decoder.decode(response.data);
    const lines = csvData.trim().split('\n');
    
    console.log(`📊 Header weights: ${lines[0]}`);
    
    const dataLines = lines.slice(1);
    
    console.log(`📊 Liczba linii weights: ${dataLines.length}`);
    
    const weights: RiskWeight[] = [];
    const riskCategoriesSet = new Set<string>();

    dataLines.forEach((line: string, index: number) => {
      if (!line.trim()) return;
      
      const columns = parseCSVLine(line);
      
      if (columns.length < 5) {
        console.warn(`Invalid weight row ${index}:`, line);
        return;
      }

      const [
        questionId,
        questionText,
        answer,
        riskPointsStr,
        mainRisk,
        sideRisksStr = '',
        comment = ''
      ] = columns;

      const riskPoints = parseInt(riskPointsStr.trim()) || 0;

      const sideRisks = sideRisksStr
        .split(',')
        .map(r => r.trim())
        .filter(r => r.length > 0 && r !== '-');

      if (mainRisk && mainRisk.trim() !== '-') {
        riskCategoriesSet.add(mainRisk.trim());
      }
      sideRisks.forEach(r => riskCategoriesSet.add(r));

      weights.push({
        questionId: questionId.trim(),
        questionText: questionText.trim(),
        answer: answer.trim(),
        riskPoints,
        mainRisk: mainRisk.trim(),
        sideRisks,
        comment: comment.trim()
      });
    });

    console.log(`✅ Załadowano ${weights.length} wag`);
    console.log(`📋 Kategorie ryzyk:`, Array.from(riskCategoriesSet));

    return {
      weights,
      riskCategories: Array.from(riskCategoriesSet).filter(c => c !== '-'),
      lastUpdated: new Date().toISOString()
    };

  } catch (error: any) {
    console.error('❌ Error fetching weights:', error);
    
    let errorMsg = '❌ BŁĄD POBIERANIA WAG:\n\n';
    
    if (error.code === 'ECONNABORTED') {
      errorMsg += 'Timeout - brak odpowiedzi z serwera\n';
    } else if (error.response) {
      errorMsg += `Status: ${error.response.status}\n`;
      errorMsg += `Dane: ${error.response.statusText}\n`;
    } else if (error.request) {
      errorMsg += 'Brak odpowiedzi od serwera\n';
      errorMsg += 'Sprawdź połączenie internetowe\n';
    } else {
      errorMsg += error.message + '\n';
    }
    
    errorMsg += `\nURL: ${csvUrl.substring(0, 100)}...`;
    
    alert(errorMsg);
    throw error;
  }
}

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
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result.map(col => col.trim());
}

const questionCache: Record<PathwayType, { questions: Question[]; timestamp: number } | null> = {
  before: null,
  crisis: null,
  divorce: null,
  married: null,
};

let weightsCache: { data: WeightsData; timestamp: number } | null = null;

const CACHE_DURATION = 5 * 60 * 1000;

export async function fetchQuestionsWithCache(pathway: PathwayType): Promise<Question[]> {
  const now = Date.now();
  const cached = questionCache[pathway];
  
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    console.log(`✅ Using cached questions for ${pathway}`);
    return cached.questions;
  }
  
  console.log(`🔄 Fetching fresh questions for ${pathway}`);
  const questions = await fetchQuestionsFromSheets(pathway);
  questionCache[pathway] = { questions, timestamp: now };
  
  return questions;
}

export async function fetchWeightsWithCache(): Promise<WeightsData> {
  const now = Date.now();
  
  if (weightsCache && (now - weightsCache.timestamp) < CACHE_DURATION) {
    console.log('✅ Using cached weights');
    return weightsCache.data;
  }
  
  console.log('🔄 Fetching fresh weights');
  const data = await fetchWeightsFromSheets();
  weightsCache = { data, timestamp: now };
  
  return data;
}

export function clearQuestionsCache(pathway?: PathwayType): void {
  if (pathway) {
    questionCache[pathway] = null;
  } else {
    Object.keys(questionCache).forEach(key => {
      questionCache[key as PathwayType] = null;
    });
  }
}

export function clearWeightsCache(): void {
  weightsCache = null;
}

export function clearAllCaches(): void {
  clearQuestionsCache();
  clearWeightsCache();
}
