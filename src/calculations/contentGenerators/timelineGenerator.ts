// src/calculations/contentGenerators/timelineGenerator.ts

import { Pathway, RiskLevel, AnswerAnalysis } from '../types';

export function generateTimeline(
  pathway: Pathway, 
  riskLevel: RiskLevel, 
  analysis: AnswerAnalysis
) {
  const baseTimeline = getBaseTimeline(pathway);
  
  // Dodaj dynamiczne elementy dla high/critical
  if (riskLevel === 'critical' || riskLevel === 'high') {
    if (analysis.hasKids && analysis.alienationRisk > 30) {
      baseTimeline.days30.unshift("⚠️ Skontaktuj się z prawnikiem nt. zabezpieczenia kontaktów z dziećmi");
    }
    
    if (analysis.falseAccusationRisk > 30) {
      baseTimeline.days30.unshift("🚨 Zainstaluj aplikację do nagrywania rozmów (jeśli legalne w PL)");
    }
  }
  
  return baseTimeline;
}

function getBaseTimeline(pathway: Pathway) {
  const timelines: Record<Pathway, any> = {
    before: {
      days30: [
        "Zacznij prowadzić dziennik obserwacji",
        "Wzmocnij swoją niezależność",
        "Nie konfrontuj się emocjonalnie"
      ],
      days90: [
        "Oceń czy sytuacja się poprawia",
        "Rozważ rozmowę z terapeutą",
        "Ustanów granice"
      ],
      days365: [
        "Podejmij decyzję: kontynuacja czy rozstanie",
        "Jeśli kontynuacja - wspólne cele",
        "Jeśli rozstanie - przygotuj się prawnie"
      ]
    },
    crisis: {
      days30: [
        "Skonsultuj się z prawnikiem",
        "Zabezpiecz dokumenty",
        "Ogranicz kontakt do minimum",
        "NIE podpisuj niczego bez prawnika"
      ],
      days90: [
        "Jeśli są dzieci: ustal harmonogram",
        "Oddziel finanse",
        "Zbuduj sieć wsparcia",
        "Przygotuj plan awaryjny"
      ],
      days365: [
        "Doprowadź sprawę do końca",
        "Odbuduj stabilność",
        "Pracuj z terapeutą",
        "Buduj relację z dziećmi"
      ]
    },
    divorce: {
      days30: [
        "ZABEZPIECZ dokumenty finansowe",
        "KRYTYCZNE: żadnych ruchów bez prawnika",
        "Zmień hasła do wszystkiego",
        "Dokumentuj WSZYSTKO",
        "Jeśli dzieci: plan kontaktów"
      ],
      days90: [
        "Sfinalizuj podział majątku",
        "Ustabilizuj finanse",
        "Walcz o sprawiedliwy harmonogram",
        "Praca z terapeutą",
        "Odciąć toksyczne kontakty"
      ],
      days365: [
        "Zamknij sprawy prawne",
        "Odbuduj życie",
        "Utrzymuj relację z dziećmi",
        "Trening i rozwój",
        "Wyciągnij wnioski"
      ]
    },
    married: {
      days30: [
        "Oceń stan relacji",
        "Wspólna aktywność",
        "Zadbaj o swoją przestrzeń"
      ],
      days90: [
        "Wprowadź zmiany",
        "Oceń czy partnerka się rozwija",
        "Finanse przejrzyste"
      ],
      days365: [
        "Podsumuj rok",
        "Wspólne cele",
        "Balans relacja/rozwój osobisty"
      ]
    }
  };
  
  return timelines[pathway] || timelines.before;
}
