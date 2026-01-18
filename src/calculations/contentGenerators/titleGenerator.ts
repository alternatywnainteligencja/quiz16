// src/calculations/contentGenerators/titleGenerator.ts

import { Pathway, RiskLevel, AnswerAnalysis } from '../types';

export function generateTitle(
  pathway: Pathway,
  riskLevel: RiskLevel,
  percentage: number,
  analysis: AnswerAnalysis
): string {
  const titles: Record<Pathway, Record<RiskLevel, string>> = {
    before: {
      low: `Stabilny początek (${percentage}% ryzyka)`,
      medium: `Sygnały ostrzegawcze (${percentage}% ryzyka) - obserwuj`,
      high: `Poważne sygnały alarmowe (${percentage}% ryzyka) - działaj`,
      critical: `KRYTYCZNE ryzyko (${percentage}%) - natychmiastowa interwencja`
    },
    crisis: {
      low: `Kryzys pod kontrolą (${percentage}% ryzyka)`,
      medium: `Relacja na ostrzu noża (${percentage}% ryzyka)`,
      high: `Głęboki kryzys (${percentage}% ryzyka) - pilna interwencja`,
      critical: `KRYZYS KRYTYCZNY (${percentage}%) - zabezpiecz się TERAZ`
    },
    divorce: {
      low: `Rozstanie pod kontrolą (${percentage}% ryzyka)`,
      medium: `Rozwód - maksymalne zabezpieczenie (${percentage}% ryzyka)`,
      high: `Rozwód wysokiego konfliktu (${percentage}%) - OCHRONA priorytetem`,
      critical: `EKSTREMALNIE trudna sytuacja (${percentage}%) - NIE działaj sam`
    },
    married: {
      low: `Zdrowy związek (${percentage}% ryzyka) - utrzymaj balans`,
      medium: `Stabilny związek (${percentage}%) - obserwuj równowagę`,
      high: `Rutyna szkodzi (${percentage}%) - potrzeba zmian`,
      critical: `Stagnacja zaawansowana (${percentage}%) - radykalne zmiany TERAZ`
    }
  };
  
  return titles[pathway]?.[riskLevel] || `Analiza: ${percentage}% ryzyka`;
}
