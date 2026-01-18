// src/calculations/calculations.tsx

import { CalculationResult, Pathway } from './types';
import { calculateRisk } from './riskCalculator';

/**
 * 🔥 EKSPORTOWANE FUNKCJE
 */
export async function calculateBefore(answers: Record<string, string>): Promise<CalculationResult> {
  console.log('🎯 calculateBefore called with', Object.keys(answers).length, 'answers');
  return calculateRisk(answers, 'before');
}

export async function calculateCrisis(answers: Record<string, string>): Promise<CalculationResult> {
  console.log('🎯 calculateCrisis called with', Object.keys(answers).length, 'answers');
  return calculateRisk(answers, 'crisis');
}

export async function calculateDivorce(answers: Record<string, string>): Promise<CalculationResult> {
  console.log('🎯 calculateDivorce called with', Object.keys(answers).length, 'answers');
  return calculateRisk(answers, 'divorce');
}

export async function calculateMarried(answers: Record<string, string>): Promise<CalculationResult> {
  console.log('🎯 calculateMarried called with', Object.keys(answers).length, 'answers');
  return calculateRisk(answers, 'married');
}

/**
 * 🧪 FUNKCJA TESTOWA
 */
export async function testCalculation(): Promise<CalculationResult> {
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

// Re-export typów dla wygody
export type { CalculationResult, Pathway } from './types';
