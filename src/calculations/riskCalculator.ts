// src/calculations/riskCalculator.ts

import { CalculationResult, Pathway, RiskLevel } from './types';
import { getWeightsData } from './weightsManager';
import { analyzeAnswers } from './analysisEngine';
import { generateDynamicContent } from './contentGenerators';

export async function calculateRisk(
  answers: Record<string, string>,
  pathway: Pathway
): Promise<CalculationResult> {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎯 RISK CALCULATION STARTED');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📍 Pathway:', pathway);
  console.log('📝 Answers received:', Object.keys(answers).length);
  
  Object.entries(answers).forEach(([qId, ans]) => {
    console.log(`   Q${qId}: "${ans}"`);
  });
  
  const weightsData = await getWeightsData();
  
  console.log('\n⚖️  Weights available:', weightsData.weights.length);
  
  const uniqueQuestionIds = [...new Set(weightsData.weights.map(w => w.questionId))];
  console.log('📌 Question IDs in weights:', uniqueQuestionIds);
  
  // Zbierz punkty
  let totalRiskPoints = 0;
  let maxPossiblePoints = 0;
  const riskScores: Record<string, number> = {};
  const matchedWeights: Array<any> = [];
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 MATCHING ANSWERS TO WEIGHTS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  Object.entries(answers).forEach(([questionIdStr, userAnswer]) => {
    const questionId = parseInt(questionIdStr);
    
    console.log(`🔎 Question ${questionId}:`);
    console.log(`   User answer: "${userAnswer}"`);
    
    // Znajdź wagę
    const weight = weightsData.weights.find(
      w => w.questionId === questionId && w.answer === userAnswer
    );
    
    if (weight) {
      console.log(`   ✅ MATCH FOUND!`);
      console.log(`      Risk points: ${weight.riskPoints}`);
      console.log(`      Main risk: ${weight.mainRisk}`);
      console.log(`      Side risks: ${weight.sideRisks.join(', ') || 'none'}`);
      
      matchedWeights.push(weight);
      totalRiskPoints += weight.riskPoints;
      
      // Dodaj do głównego ryzyka
      if (weight.mainRisk && weight.mainRisk !== '-') {
        riskScores[weight.mainRisk] = (riskScores[weight.mainRisk] || 0) + weight.riskPoints;
      }
      
      // Dodaj do pobocznych (50% wagi)
      weight.sideRisks.forEach(sideRisk => {
        if (sideRisk && sideRisk !== '-') {
          riskScores[sideRisk] = (riskScores[sideRisk] || 0) + (weight.riskPoints * 0.5);
        }
      });
      
    } else {
      console.log(`   ❌ NO MATCH`);
      
      // Debug: pokaż dostępne odpowiedzi
      const availableAnswers = weightsData.weights
        .filter(w => w.questionId === questionId)
        .map(w => w.answer);
      
      if (availableAnswers.length > 0) {
        console.log(`   💡 Available answers for Q${questionId}:`);
        availableAnswers.forEach(ans => {
          console.log(`      - "${ans}"`);
        });
      } else {
        console.log(`   ⚠️ No weights found for question ID ${questionId}`);
      }
    }
    
    maxPossiblePoints += 10;
  });
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 CALCULATION SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Matched:', matchedWeights.length, '/', Object.keys(answers).length);
  console.log('💯 Total points:', totalRiskPoints, '/', maxPossiblePoints);
  console.log('📈 Risk breakdown:', riskScores);
  
  // Oblicz procenty
  const overallRiskPercentage = maxPossiblePoints > 0 
    ? Math.round((totalRiskPoints / maxPossiblePoints) * 100)
    : 0;
  
  const totalCategoryPoints = Object.values(riskScores).reduce((sum, val) => sum + val, 0);
  const riskBreakdown: Record<string, number> = {};
  
  Object.entries(riskScores).forEach(([category, points]) => {
    riskBreakdown[category] = totalCategoryPoints > 0
      ? Math.round((points / totalCategoryPoints) * 100)
      : 0;
  });
  
  // Poziom ryzyka
  let riskLevel: RiskLevel;
  if (overallRiskPercentage < 25) riskLevel = 'low';
  else if (overallRiskPercentage < 50) riskLevel = 'medium';
  else if (overallRiskPercentage < 75) riskLevel = 'high';
  else riskLevel = 'critical';
  
  console.log('🎚️  Risk level:', riskLevel, `(${overallRiskPercentage}%)`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Analiza i generowanie contentu
  const analysis = analyzeAnswers(answers, riskBreakdown);
  const dynamicContent = generateDynamicContent(
    pathway,
    riskLevel,
    answers,
    riskBreakdown,
    overallRiskPercentage,
    matchedWeights,
    analysis
  );
  
  return {
    ...dynamicContent,
    riskLevel,
    overallRiskPercentage,
    riskBreakdown,
    confidence: Math.min(95, 70 + (matchedWeights.length * 3)),
    meta: {
      source: pathway,
      score: overallRiskPercentage,
      generatedAt: new Date().toISOString(),
      totalQuestions: 50,
      answeredQuestions: Object.keys(answers).length
    }
  };
}
