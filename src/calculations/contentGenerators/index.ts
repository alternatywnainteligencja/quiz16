// src/calculations/contentGenerators/index.ts

import { CalculationResult, Pathway, RiskLevel, AnswerAnalysis } from '../types';
import { generateTitle } from './titleGenerator';
import { generateDescription } from './descriptionGenerator';
import { generateProbabilities } from './probabilitiesGenerator';
import { generateScenarios } from './scenariosGenerator';
import { generateActionItems } from './actionsGenerator';
import { generateRecommendations } from './recommendationsGenerator';
import { generateTimeline } from './timelineGenerator';
import { generateReadingList } from './readingListGenerator';
import { generateProfiles } from './profilesGenerator';
import { generateConclusion } from './conclusionGenerator';

export function generateDynamicContent(
  pathway: Pathway,
  riskLevel: RiskLevel,
  answers: Record<string, string>,
  riskBreakdown: Record<string, number>,
  overallRiskPercentage: number,
  matchedWeights: Array<any>,
  analysis: AnswerAnalysis
): Partial<CalculationResult> {
  
  return {
    mainTitle: generateTitle(pathway, riskLevel, overallRiskPercentage, analysis),
    mainDescription: generateDescription(pathway, riskLevel, analysis, riskBreakdown),
    probabilities: generateProbabilities(riskBreakdown, analysis),
    scenarios: generateScenarios(pathway, riskBreakdown, analysis, matchedWeights),
    actionItems: generateActionItems(riskLevel, riskBreakdown, analysis),
    recommendations: generateRecommendations(pathway, riskBreakdown, analysis),
    timeline: generateTimeline(pathway, riskLevel, analysis),
    readingList: generateReadingList(pathway, riskBreakdown),
    psychologicalProfiles: generateProfiles(pathway, riskLevel, analysis),
    conclusion: generateConclusion(riskLevel, overallRiskPercentage, analysis)
  };
}

// Re-export wszystkich generatorów
export * from './titleGenerator';
export * from './descriptionGenerator';
export * from './probabilitiesGenerator';
export * from './scenariosGenerator';
export * from './actionsGenerator';
export * from './recommendationsGenerator';
export * from './timelineGenerator';
export * from './readingListGenerator';
export * from './profilesGenerator';
export * from './conclusionGenerator';
