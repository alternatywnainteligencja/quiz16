// src/calculations/contentGenerators/scenariosGenerator.ts

import { Pathway, AnswerAnalysis } from '../types';

export function generateScenarios(
  pathway: Pathway,
  riskBreakdown: Record<string, number>,
  analysis: AnswerAnalysis,
  matchedWeights: Array<any>
): Array<any> {
  const scenarios: Array<any> = [];
  
  // Rozwód/rozstanie
  if (riskBreakdown['Rozstanie/Rozwód'] > 30) {
    scenarios.push({
      scenario: "Rozwód lub trwałe rozstanie",
      probability: Math.min(95, riskBreakdown['Rozstanie/Rozwód']),
      why: analysis.poorCommunication 
        ? "Brak komunikacji i narastające konflikty wskazują na nieuchronność"
        : "Zauważalne wzorce dystansowania się i zmiany w relacji",
      impactScore: 9
    });
  }
  
  // Alienacja
  if (analysis.hasKids && riskBreakdown['Alienacja rodzicielska'] > 25) {
    scenarios.push({
      scenario: "Alienacja rodzicielska",
      probability: Math.min(90, riskBreakdown['Alienacja rodzicielska']),
      why: analysis.kidsConflict
        ? "Konflikt dotyczący dzieci i próby ich izolowania"
        : "Wzorce zachowań mogące prowadzić do alienacji",
      impactScore: 10
    });
  }
  
  // Fałszywe oskarżenia
  if (riskBreakdown['Fałszywe oskarżenia'] > 20) {
    scenarios.push({
      scenario: "Fałszywe oskarżenia (przemoc, zaniedbanie)",
      probability: Math.min(85, riskBreakdown['Fałszywe oskarżenia']),
      why: analysis.manipulation
        ? "Zauważone wzorce manipulacji mogą eskalować do fałszywych oskarżeń"
        : "Sytuacja konfliktowa stwarza ryzyko wykorzystania oskarżeń jako broni",
      impactScore: 10
    });
  }
  
  // Straty finansowe
  if (riskBreakdown['Straty finansowe'] > 30) {
    scenarios.push({
      scenario: "Znaczne straty finansowe",
      probability: Math.min(88, riskBreakdown['Straty finansowe']),
      why: analysis.financialControl
        ? "Brak kontroli nad finansami zwiększa ryzyko manipulacji majątkiem"
        : "Wspólne aktywa i brak przejrzystości finansowej",
      impactScore: 8
    });
  }
  
  // Manipulacja emocjonalna
  if (riskBreakdown['Manipulacja'] > 25) {
    scenarios.push({
      scenario: "Eskalacja manipulacji emocjonalnej",
      probability: Math.min(80, riskBreakdown['Manipulacja']),
why: "Wykryte wzorce manipulacji często nasilają się w czasie",
impactScore: 7
});
}
// Jeśli brak scenariuszy, dodaj ogólny
if (scenarios.length === 0) {
scenarios.push({
scenario: "Stopniowe oddalanie się",
probability: 30,
why: "Naturalna ewolucja związków bez aktywnej pracy nad relacją",
impactScore: 5
});
}
return scenarios.sort((a, b) => b.probability - a.probability).slice(0, 5);
}
