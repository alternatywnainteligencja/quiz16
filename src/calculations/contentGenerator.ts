/**
 * Generator dynamicznej treści na podstawie analizy
 * Tworzy tytuły, opisy, scenariusze, rekomendacje etc.
 */

import type { AnalysisResult } from './analysisEngine';
import { getTimelines } from './timelineData';
import { getReadingLists } from './readingListData';

interface ContentResult {
  mainTitle: string;
  mainDescription: string;
  probabilities: {
    divorce: number;
    falseAccusation: number;
    alienation: number;
    financialLoss: number;
  };
  scenarios: Array<{
    scenario: string;
    probability: number;
    why: string;
    impactScore: number;
  }>;
  actionItems: Array<{
    priority: string;
    action: string;
  }>;
  recommendations: Array<{
    type: string;
    text: string;
  }>;
  timeline: {
    days30: string[];
    days90: string[];
    days365: string[];
  };
  readingList: Array<{
    title: string;
    author: string;
    description: string;
  }>;
  psychologicalProfiles: {
    user: Array<{ label: string; value: string }>;
    partner: Array<{ label: string; value: string }>;
  };
  conclusion: {
    summary: string;
    cta: string;
  };
}

/**
 * Główna funkcja generująca cały content
 */
export function generateContent(
  pathway: string,
  riskLevel: string,
  answers: Record<string, string>,
  riskBreakdown: Record<string, number>,
  overallRiskPercentage: number,
  matchedWeights: Array<any>,
  analysis: AnalysisResult
): ContentResult {
  
  return {
    mainTitle: generateTitle(pathway, riskLevel, overallRiskPercentage),
    mainDescription: generateDescription(riskLevel, analysis, riskBreakdown),
    probabilities: generateProbabilities(riskBreakdown),
    scenarios: generateScenarios(pathway, riskBreakdown, analysis),
    actionItems: generateActionItems(riskLevel, analysis),
    recommendations: generateRecommendations(analysis),
    timeline: getTimelines(pathway, riskLevel, analysis),
    readingList: getReadingLists(pathway, riskBreakdown),
    psychologicalProfiles: generateProfiles(riskLevel, analysis),
    conclusion: generateConclusion(riskLevel, overallRiskPercentage, analysis)
  };
}

/**
 * 🎯 Dynamiczny tytuł
 */
function generateTitle(
  pathway: string,
  riskLevel: string,
  percentage: number
): string {
  const titles: Record<string, Record<string, string>> = {
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

/**
 * 📝 Dynamiczny opis
 */
function generateDescription(
  riskLevel: string,
  analysis: AnalysisResult,
  riskBreakdown: Record<string, number>
): string {
  const parts: string[] = [];
  
  // Wstęp
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

/**
 * 📊 Prawdopodobieństwa
 */
function generateProbabilities(riskBreakdown: Record<string, number>) {
  return {
    divorce: Math.min(95, riskBreakdown['Rozstanie/Rozwód'] || 15),
    falseAccusation: Math.min(90, riskBreakdown['Fałszywe oskarżenia'] || 5),
    alienation: Math.min(95, riskBreakdown['Alienacja rodzicielska'] || 10),
    financialLoss: Math.min(90, riskBreakdown['Straty finansowe'] || 10)
  };
}

/**
 * 🎬 Scenariusze
 */
function generateScenarios(
  pathway: string,
  riskBreakdown: Record<string, number>,
  analysis: AnalysisResult
): Array<any> {
  const scenarios: Array<any> = [];
  
  // Rozwód
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
  
  // Manipulacja
  if (riskBreakdown['Manipulacja'] > 25) {
    scenarios.push({
      scenario: "Eskalacja manipulacji emocjonalnej",
      probability: Math.min(80, riskBreakdown['Manipulacja']),
      why: "Wykryte wzorce manipulacji często nasilają się w czasie",
      impactScore: 7
    });
  }
  
  // Fallback
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

/**
 * ✅ Akcje do podjęcia
 */
function generateActionItems(
  riskLevel: string,
  analysis: AnalysisResult
): Array<any> {
  const actions: Array<any> = [];
  
  // Krytyczne/wysokie ryzyko
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
  
  // Zawsze
  actions.push({
    priority: "💪 FUNDAMENTALNE",
    action: "Zachowaj spokój i kontrolę emocjonalną - nie reaguj impulsywnie"
  });
  
  return actions.slice(0, 6);
}

/**
 * 💡 Rekomendacje
 */
function generateRecommendations(analysis: AnalysisResult): Array<any> {
  const recs: Array<any> = [];
  
  // Komunikacja
  if (analysis.poorCommunication || analysis.manipulation) {
    recs.push({
      type: "komunikacja",
      text: "TYLKO pisemna komunikacja (SMS, email) - nic ustnie, wszystko udokumentowane"
    });
    
    recs.push({
      type: "komunikacja",
      text: "Bądź konkretny, rzeczowy, bez emocji - nie daj się sprowokować"
    });
  }
  
  // Mentalne
  recs.push({
    type: "mentalne",
    text: "Techniki oddychania i mindfulness - kontroluj reakcje w stresie"
  });
  
  if (analysis.emotionalAbuse) {
    recs.push({
      type: "mentalne",
      text: "Praca z terapeutą nad trauma bond i manipulacją emocjonalną"
    });
  }
  
  // Prawne
  if (analysis.falseAccusationRisk > 20 || analysis.financialRisk > 30) {
    recs.push({
      type: "prawne",
      text: "Przygotuj teczkę obronną: dokumenty, nagrania, świadkowie, timeline zdarzeń"
    });
  }
  
  // Fizyczne
  recs.push({
    type: "fizyczne",
    text: "Regularny trening - redukuje stres i buduje odporność psychiczną"
  });
  
  // Społeczne
  if (!analysis.hasSupport) {
    recs.push({
      type: "społeczne",
      text: "Odbuduj relacje społeczne - izolacja jest bronią manipulatora"
    });
  }
  
  return recs.slice(0, 6);
}

/**
 * 🧠 Profile psychologiczne
 */
function generateProfiles(
  riskLevel: string,
  analysis: AnalysisResult
) {
  const userProfile: Array<any> = [];
  const partnerProfile: Array<any> = [];
  
  // Profil użytkownika
  if (riskLevel === 'critical' || riskLevel === 'high') {
    userProfile.push({
      label: "Stan emocjonalny",
      value: "Wysoki stres - ryzyko impulsywnych decyzji ⚠️"
    });
    userProfile.push({
      label: "Priorytet",
      value: "Zachowanie kontroli i spokoju - NIE reaguj emocjonalnie"
    });
  } else if (riskLevel === 'medium') {
    userProfile.push({
      label: "Stan emocjonalny",
      value: "Niepewność, wyczulenie na sygnały"
    });
    userProfile.push({
      label: "Wyzwanie",
      value: "Balans między troską a niepotrzebnym stresem"
    });
  } else {
    userProfile.push({
      label: "Stan emocjonalny",
      value: "Względnie stabilny, świadomy"
    });
    userProfile.push({
      label: "Zalecenie",
      value: "Utrzymuj czujność bez paranoi"
    });
  }
  
  if (analysis.fearLevel) {
    userProfile.push({
      label: "Wykryty wzorzec",
      value: "Wysoki poziom lęku - może wpływać na postrzeganie sytuacji"
    });
  }
  
  if (!analysis.hasSupport) {
    userProfile.push({
      label: "Izolacja społeczna",
      value: "⚠️ Brak sieci wsparcia - krytyczne zagrożenie"
    });
  }
  
  // Profil partnerki
  if (analysis.manipulation || analysis.manipulationRisk > 30) {
    partnerProfile.push({
      label: "Wykryte wzorce",
      value: "🚨 Manipulacja emocjonalna - gaslighting, kontrola"
    });
  }
  
  if (analysis.poorCommunication) {
    partnerProfile.push({
      label: "Komunikacja",
      value: "Dystans, unikanie, emocjonalny chłód"
    });
  }
  
  if (analysis.financialControl) {
    partnerProfile.push({
      label: "Kontrola finansowa",
      value: "⚠️ Próby kontroli majątku i dostępu do pieniędzy"
    });
  }
  
  if (analysis.kidsConflict && analysis.hasKids) {
    partnerProfile.push({
      label: "Strategia",
      value: "🚨 Wykorzystywanie dzieci jako broni w konflikcie"
    });
  }
  
  if (analysis.alienationRisk > 30) {
    partnerProfile.push({
      label: "Sygnały alarmowe",
      value: "🔴 Wzorce alienacyjne - izolowanie od dzieci"
    });
  }
  
  if (partnerProfile.length === 0) {
    partnerProfile.push({
      label: "Obserwowane zachowanie",
      value: "Brak wyraźnych sygnałów alarmowych"
    });
  }
  
  return {
    user: userProfile.slice(0, 5),
    partner: partnerProfile.slice(0, 5)
  };
}

/**
 * ✅ Podsumowanie
 */
function generateConclusion(
  riskLevel: string,
  percentage: number,
  analysis: AnalysisResult
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
  
  // Akcent na najważniejsze ryzyko
  if (analysis.alienationRisk > 40) {
    summary += " KRYTYCZNE: Wysokie ryzyko alienacji rodzicielskiej!";
  } else if (analysis.falseAccusationRisk > 40) {
    summary += " KRYTYCZNE: Wysokie ryzyko fałszywych oskarżeń!";
  }
  
  return { summary, cta };
}
