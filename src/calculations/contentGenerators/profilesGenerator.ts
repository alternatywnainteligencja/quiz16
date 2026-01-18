
// src/calculations/contentGenerators/profilesGenerator.ts

import { Pathway, RiskLevel, AnswerAnalysis } from '../types';

export function generateProfiles(
  pathway: Pathway, 
  riskLevel: RiskLevel, 
  analysis: AnswerAnalysis
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

