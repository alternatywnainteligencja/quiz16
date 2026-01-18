// src/calculations/riskCalculator.ts
// riskCalculator.ts - Główna logika obliczeń
import { CalculationResult, Pathway, RiskLevel } from './types';
import { getWeightsData } from './weightsManager';
import { createMockWeights } from './utils/mockData';
import { analyzeAnswers } from './analysisEngine';
import { generateDynamicContent } from './contentGenerators';

export async function calculateRisk(
  answers: Record<string, string>,
  pathway: Pathway
): Promise<CalculationResult> {
  console.log('🎯 Starting calculation for pathway:', pathway);
  console.log('📝 User answers:', answers);
  
  const weightsData = await getWeightsData();
  
  // Jeśli brak wag, użyj mock data
  if (!weightsData.weights || weightsData.weights.length === 0) {
    console.warn('⚠️ NO WEIGHTS - using MOCK data');
    weightsData.weights = createMockWeights();
  }
  
  // 1. Zbierz punkty ryzyka
  let totalRiskPoints = 0;
  let maxPossiblePoints = 0;
  const riskScores: Record<string, number> = {};
  const matchedWeights: Array<any> = [];
  
  Object.entries(answers).forEach(([questionId, answerText]) => {
    const weight = weightsData.weights.find(
      w => w.questionId === questionId && w.answer === answerText
    );
    
    if (weight) {
      console.log(`✓ Match: ${questionId} = "${answerText}" → ${weight.riskPoints} pts`);
      matchedWeights.push(weight);
      totalRiskPoints += weight.riskPoints;
      
      if (weight.mainRisk && weight.mainRisk !== '-') {
        riskScores[weight.mainRisk] = (riskScores[weight.mainRisk] || 0) + weight.riskPoints;
      }
      
      weight.sideRisks?.forEach(sideRisk => {
        if (sideRisk && sideRisk !== '-') {
          riskScores[sideRisk] = (riskScores[sideRisk] || 0) + (weight.riskPoints * 0.5);
        }
      });
    } else {
      console.warn(`✗ No match: ${questionId} = "${answerText}"`);
    }
    
    maxPossiblePoints += 10;
  });
  
  console.log('💯 Total risk points:', totalRiskPoints, '/', maxPossiblePoints);
  console.log('📊 Risk breakdown:', riskScores);
  
  // 2. Oblicz procentowe ryzyko
  const overallRiskPercentage = maxPossiblePoints > 0 
    ? Math.round((totalRiskPoints / maxPossiblePoints) * 100)
    : 0;
  
  // 3. Breakdown dla kategorii
  const totalCategoryPoints = Object.values(riskScores).reduce((sum, val) => sum + val, 0);
  const riskBreakdown: Record<string, number> = {};
  
  Object.entries(riskScores).forEach(([category, points]) => {
    riskBreakdown[category] = totalCategoryPoints > 0
      ? Math.round((points / totalCategoryPoints) * 100)
      : 0;
  });
  
  // 4. Określ poziom ryzyka
  let riskLevel: RiskLevel;
  if (overallRiskPercentage < 25) riskLevel = 'low';
  else if (overallRiskPercentage < 50) riskLevel = 'medium';
  else if (overallRiskPercentage < 75) riskLevel = 'high';
  else riskLevel = 'critical';
  
  console.log('🎚️ Risk level:', riskLevel, `(${overallRiskPercentage}%)`);
  
  // 5. Analiza odpowiedzi
  const analysis = analyzeAnswers(answers, riskBreakdown);
  
  // 6. Generuj dynamiczny content
  const dynamicContent = generateDynamicContent(
    pathway,
    riskLevel,
    answers,
    riskBreakdown,
    overallRiskPercentage,
    matchedWeights,
    analysis
  );
  
  // 7. Zwróć wynik
  return {
    ...dynamicContent,
    riskLevel,
    overallRiskPercentage,
    riskBreakdown,
    confidence: Math.min(95, 70 + (Object.keys(answers).length * 0.5)),
    meta: {
      source: pathway,
      score: overallRiskPercentage,
      generatedAt: new Date().toISOString(),
      totalQuestions: 50,
      answeredQuestions: Object.keys(answers).length
    }
  };
}
