// src/calculations/contentGenerators/descriptionGenerator.ts

import { Pathway, RiskLevel, AnswerAnalysis } from '../types';

export function generateDescription(
  pathway: Pathway,
  riskLevel: RiskLevel,
  analysis: AnswerAnalysis,
  riskBreakdown: Record<string, number>
): string {
  const parts: string[] = [];
  
  // Wstęp zależny od poziomu
  if (riskLevel === 'critical') {
    parts.push('⚠️ UWAGA: Znajdujesz się w sytuacji wysokiego ryzyka.');
  } else if (riskLevel === 'high') {
    parts.push('Twoja sytuacja wymaga pilnej uwagi i działania.');
  } else if (riskLevel === 'medium') {
    parts.push('Widzę niepokojące sygnały, które wymagają monitorowania.');
  } else {
    parts.push('Ogólnie sytuacja wygląda stabilnie, ale czujność zawsze się opłaca.');
  }
  
  // Najwyższe ryzyka
  if (analysis.topRisks.length > 0) {
    parts.push(`Główne obszary ryzyka: ${analysis.topRisks.join(', ')}.`);
  }
  
  // Dzieci
  if (analysis.hasKids && analysis.alienationRisk > 30) {
    parts.push('🚨 Wykryto ryzyko alienacji rodzicielskiej - wymaga natychmiastowej uwagi.');
  } else if (analysis.hasKids && analysis.kidsConflict) {
    parts.push('Konflikt dotyczący dzieci może eskalować - dokumentuj wszystko.');
  }
  
  // Finanse
  if (analysis.financialRisk > 40) {
    parts.push('💰 Wysokie ryzyko strat finansowych - zabezpiecz majątek i konta.');
  } else if (analysis.financialControl) {
    parts.push('Brak kontroli nad finansami to poważny sygnał ostrzegawczy.');
  }
  
  // Manipulacja
  if (analysis.manipulationRisk > 35 || analysis.manipulation) {
    parts.push('🎭 Zauważam wzorce manipulacji - nie daj się kontrolować emocjonalnie.');
  }
  
  // Fałszywe oskarżenia
  if (analysis.falseAccusationRisk > 30) {
    parts.push('⚖️ Ryzyko fałszywych oskarżeń - DOKUMENTUJ każdą interakcję.');
  }
  
  // Wsparcie
  if (!analysis.hasSupport || analysis.isolatedFromFriends) {
    parts.push('Brak sieci wsparcia zwiększa ryzyko - odbuduj kontakty ze znajomymi.');
  }
  
  return parts.join(' ');
}
