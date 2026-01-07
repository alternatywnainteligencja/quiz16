/**
 * Główny moduł kalkulacji ryzyka
 * ZAKTUALIZOWANY: używa unified data (pytania + wagi w jednym)
 */

import { fetchUnifiedDataWithCache } from '../services/unifiedSheetsService';
import { analyzeAnswers, type AnalysisResult } from './analysisEngine';
import { generateContent } from './contentGenerator';
import { createMockWeights } from './mockData';

export interface CalculationResult {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  mainTitle: string;
  mainDescription: string;
  
  overallRiskPercentage: number;
  riskBreakdown: Record<string, number>;
  
  probabilities: {
    divorce: number;
    falseAccusation: number;
    alienation: number;
    financialLoss: number;
  };
  scenarios: Array<{
    scenario: string;
    probability: number;
    why: string;
    impactScore: number;
  }>;
  actionItems: Array<{
    priority: string;
    action: string;
  }>;
  recommendations: Array<{
    type: string;
    text: string;
  }>;
  timeline: {
    days30: string[];
    days90: string[];
    days365: string[];
  };
  readingList: Array<{
    title: string;
    author: string;
    description: string;
  }>;
  psychologicalProfiles: {
    user: Array<{ label: string; value: string }>;
    partner: Array<{ label: string; value: string }>;
  };
  conclusion: {
    summary: string;
    cta: string;
  };
  meta: {
    source: string;
    score: number;
    generatedAt: string;
    totalQuestions: number;
    answeredQuestions: number;
  };
}

// Cache dla wag
let weightsCache: any = null;
let currentPathway: string | null = null;

async function getWeights(pathway: string) {
  // Jeśli zmienił się pathway, wyczyść cache
  if (currentPathway !== pathway) {
    weightsCache = null;
    currentPathway = pathway;
  }

  if (!weightsCache) {
    try {
      console.log(`📥 Fetching weights for pathway: ${pathway}`);
      const data = await fetchUnifiedDataWithCache(pathway as any);
      weightsCache = data.weights;
      console.log('✅ Loaded weights:', weightsCache.length);
    } catch (error) {
      console.error('❌ Failed to load weights:', error);
      weightsCache = [];
    }
  }
  return weightsCache;
}

/**
 * 🔥 GŁÓWNA FUNKCJA KALKULACJI
 */
async function calculateRisk(
  answers: Record<string, string>,
  pathway: string
): Promise<CalculationResult> {
  console.log('🎯 Starting calculation for pathway:', pathway);
  console.log('📝 User answers:', answers);
  
  let weights = await getWeights(pathway);
  
  // Fallback do mock data jeśli brak wag
  if (!weights || weights.length === 0) {
    console.warn('⚠️ NO WEIGHTS - using MOCK data');
    alert('⚠️ UWAGA: Używam danych testowych (MOCK)!');
    weights = createMockWeights();
  } else {
    console.log(`✅ Using ${weights.length} weights from unified sheet`);
  }
  
  // 1. Analiza odpowiedzi i punktów ryzyka
  const analysis = analyzeAnswers(answers, weights);
  
  console.log('💯 Total risk points:', analysis.totalRiskPoints, '/', analysis.maxPossiblePoints);
  console.log('📊 Risk breakdown:', analysis.riskBreakdown);
  console.log('🎚️ Risk level:', analysis.riskLevel, `(${analysis.overallRiskPercentage}%)`);
  
  // 2. Generowanie dynamicznego contentu
  const content = generateContent(
    pathway,
    analysis.riskLevel,
    answers,
    analysis.riskBreakdown,
    analysis.overallRiskPercentage,
    analysis.matchedWeights,
    analysis
  );
  
  // 3. Zwrócenie kompletnego wyniku
  return {
    ...content,
    riskLevel: analysis.riskLevel,
    overallRiskPercentage: analysis.overallRiskPercentage,
    riskBreakdown: analysis.riskBreakdown,
    confidence: Math.min(95, 70 + (Object.keys(answers).length * 0.5)),
    meta: {
      source: pathway,
      score: analysis.overallRiskPercentage,
      generatedAt: new Date().toISOString(),
      totalQuestions: 50,
      answeredQuestions: Object.keys(answers).length
    }
  };
}

/**
 * 🔥 EKSPORTOWANE FUNKCJE DLA POSZCZEGÓLNYCH ŚCIEŻEK
 */
export async function calculateBefore(answers: Record<string, string>) {
  console.log('🎯 calculateBefore called with', Object.keys(answers).length, 'answers');
  return calculateRisk(answers, 'before');
}

export async function calculateCrisis(answers: Record<string, string>) {
  console.log('🎯 calculateCrisis called with', Object.keys(answers).length, 'answers');
  return calculateRisk(answers, 'crisis');
}

export async function calculateDivorce(answers: Record<string, string>) {
  console.log('🎯 calculateDivorce called with', Object.keys(answers).length, 'answers');
  return calculateRisk(answers, 'divorce');
}

export async function calculateMarried(answers: Record<string, string>) {
  console.log('🎯 calculateMarried called with', Object.keys(answers).length, 'answers');
  return calculateRisk(answers, 'married');
}

/**
 * 🧪 FUNKCJA TESTOWA
 */
export async function testCalculation() {
  console.log('🧪 Running test calculation...');
  
  const testAnswers = {
    'communication_quality': 'Bardzo zła, ciągłe konflikty',
    'financial_control': 'Partnerka kontroluje wszystkie finanse',
    'has_kids': 'Tak',
    'kids_relationship': 'Bardzo konfliktowe, utrudnia kontakt',
    'emotional_abuse': 'Tak, często',
    'support_network': 'Nie, jestem odcięty od znajomych'
  };
  
  const result = await calculateRisk(testAnswers, 'crisis');
  
  console.log('📊 Test Result:');
  console.log('- Risk Level:', result.riskLevel);
  console.log('- Overall %:', result.overallRiskPercentage);
  console.log('- Breakdown:', result.riskBreakdown);
  console.log('- Title:', result.mainTitle);
  console.log('- Scenarios:', result.scenarios?.length);
  
  return result;
}
