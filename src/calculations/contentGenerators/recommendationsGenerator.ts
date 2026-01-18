// src/calculations/contentGenerators/recommendationsGenerator.ts

import { Pathway, AnswerAnalysis } from '../types';

export function generateRecommendations(
  pathway: Pathway,
  riskBreakdown: Record<string, number>,
  analysis: AnswerAnalysis
): Array<any> {
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
  if (riskBreakdown['Fałszywe oskarżenia'] > 20 || riskBreakdown['Straty finansowe'] > 30) {
    recs.push({
      type: "prawne",
      text: "Przygotuj teczką obronną: dokumenty, nagrania, świadkowie, timeline zdarzeń"
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



