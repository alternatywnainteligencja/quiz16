// src/calculations/contentGenerators/probabilitiesGenerator.ts

import { AnswerAnalysis } from '../types';

export function generateProbabilities(
  riskBreakdown: Record<string, number>,
  analysis: AnswerAnalysis
) {
  return {
    divorce: Math.min(95, riskBreakdown['Rozstanie/Rozwód'] || 15),
    falseAccusation: Math.min(90, riskBreakdown['Fałszywe oskarżenia'] || 5),
    alienation: Math.min(95, riskBreakdown['Alienacja rodzicielska'] || 10),
    financialLoss: Math.min(90, riskBreakdown['Straty finansowe'] || 10)
  };
}
