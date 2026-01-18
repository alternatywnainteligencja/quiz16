
// src/calculations/contentGenerators/actionsGenerator.ts

import { RiskLevel, AnswerAnalysis } from '../types';

export function generateActionItems(
  riskLevel: RiskLevel,
  riskBreakdown: Record<string, number>,
  analysis: AnswerAnalysis
): Array<any> {
  const actions: Array<any> = [];
  
  // Krytyczne akcje
  if (riskLevel === 'critical' || riskLevel === 'high') {
    actions.push({
      priority: "🚨 NATYCHMIASTOWE",
      action: "Skonsultuj się z prawnikiem specjalizującym się w prawie rodzinnym"
    });
    
    if (analysis.hasKids && analysis.alienationRisk > 30) {
      actions.push({
        priority: "🚨 KRYTYCZNE",
        action: "Dokumentuj WSZYSTKIE interakcje z dziećmi - nagrania audio (jeśli legalne), SMS, email"
      });
    }
    
    if (analysis.financialRisk > 40) {
      actions.push({
        priority: "🚨 PILNE",
        action: "Zabezpiecz finanse: osobne konto, zmień hasła, skopiuj wszystkie dokumenty"
      });
    }
    
    if (analysis.falseAccusationRisk > 30) {
      actions.push({
        priority: "🚨 KRYTYCZNE",
        action: "NIE spotykaj się sam na sam bez świadków - każda interakcja musi być udokumentowana"
      });
    }
  }
  
  // Średnie ryzyko
  if (riskLevel === 'medium' || riskLevel === 'high') {
    actions.push({
      priority: "⚠️ WAŻNE",
      action: "Rozpocznij prowadzenie dziennika zdarzeń - daty, fakty, kontekst (bez emocji)"
    });
    
    if (!analysis.hasSupport) {
      actions.push({
        priority: "⚠️ WAŻNE",
        action: "Odbuduj sieć wsparcia - zaufani przyjaciele, rodzina, grupa wsparcia"
      });
    }
    
    actions.push({
      priority: "⚠️ ZALECANE",
      action: "Rozważ konsultację z terapeutą specjalizującym się w sytuacjach kryzysowych"
    });
  }
  
  // Niskie ryzyko
  if (riskLevel === 'low') {
    actions.push({
      priority: "✓ ZALECANE",
      action: "Kontynuuj obserwację - zwracaj uwagę na zmiany w zachowaniu"
    });
    
    actions.push({
      priority: "✓ ROZWÓJ",
      action: "Pracuj nad sobą: trening, hobby, rozwój osobisty - utrzymuj niezależność"
    });
  }
  
  // Zawsze dodaj
  actions.push({
    priority: "💪 FUNDAMENTALNE",
    action: "Zachowaj spokój i kontrolę emocjonalną - nie reaguj impulsywnie"
  });
  
  return actions.slice(0, 6);
}
```

