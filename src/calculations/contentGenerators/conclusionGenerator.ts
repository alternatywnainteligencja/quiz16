// src/calculations/contentGenerators/conclusionGenerator.ts

import { RiskLevel, AnswerAnalysis } from '../types';

export function generateConclusion(
  riskLevel: RiskLevel,
  percentage: number,
  analysis: AnswerAnalysis
) {
  let summary = "";
  let cta = "";
  
  if (riskLevel === 'critical') {
    summary = `Twoja sytuacja wymaga NATYCHMIASTOWEJ interwencji (${percentage}% ryzyka). Nie działaj sam - skontaktuj się z prawnikiem i terapeutą DZIŚ.`;
    cta = "🚨 Działaj TERAZ - każda godzina ma znaczenie";
  } else if (riskLevel === 'high') {
    summary = `Znajdujesz się w sytuacji wysokiego ryzyka (${percentage}%). Potrzebujesz profesjonalnej pomocy i konkretnego planu działania.`;
    cta = "⚠️ Zacznij działać w ciągu 48 godzin";
  } else if (riskLevel === 'medium') {
    summary = `Widzę niepokojące sygnały (${percentage}% ryzyka). To moment na zwiększoną czujność i potencjalne działania prewencyjne.`;
    cta = "📋 Rozpocznij dokumentację i obserwację";
  } else {
    summary = `Sytuacja wydaje się stabilna (${percentage}% ryzyka), ale nie zapominaj o ciągłej pracy nad sobą i relacją.`;
    cta = "✅ Kontynuuj dobre praktyki";
  }
  
  // Dodaj akcent na najważniejsze ryzyko
  if (analysis.alienationRisk > 40) {
    summary += " KRYTYCZNE: Wysokie ryzyko alienacji rodzicielskiej!";
  } else if (analysis.falseAccusationRisk > 40) {
    summary += " KRYTYCZNE: Wysokie ryzyko fałszywych oskarżeń!";
  }
  
  return { summary, cta };
}
