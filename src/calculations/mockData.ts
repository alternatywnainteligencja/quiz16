/**
 * Mock data do testowania - używane gdy API nie działa
 */

export function createMockWeights() {
  return [
    // Before pathway
    { questionId: 'communication_quality', answer: 'Bardzo dobra', riskPoints: 1, mainRisk: '-', sideRisks: [] },
    { questionId: 'communication_quality', answer: 'Dobra', riskPoints: 2, mainRisk: '-', sideRisks: [] },
    { questionId: 'communication_quality', answer: 'Średnia', riskPoints: 4, mainRisk: 'Rozstanie/Rozwód', sideRisks: [] },
    { questionId: 'communication_quality', answer: 'Zła', riskPoints: 7, mainRisk: 'Rozstanie/Rozwód', sideRisks: ['Manipulacja'] },
    { questionId: 'communication_quality', answer: 'Bardzo zła', riskPoints: 9, mainRisk: 'Rozstanie/Rozwód', sideRisks: ['Manipulacja'] },
    
    { questionId: 'financial_control', answer: 'Wspólna kontrola', riskPoints: 1, mainRisk: '-', sideRisks: [] },
    { questionId: 'financial_control', answer: 'Głównie ja', riskPoints: 2, mainRisk: '-', sideRisks: [] },
    { questionId: 'financial_control', answer: 'Głównie partnerka', riskPoints: 5, mainRisk: 'Straty finansowe', sideRisks: ['Manipulacja'] },
    { questionId: 'financial_control', answer: 'Tylko partnerka', riskPoints: 9, mainRisk: 'Straty finansowe', sideRisks: ['Manipulacja'] },
    
    { questionId: 'has_kids', answer: 'Tak', riskPoints: 0, mainRisk: '-', sideRisks: [] },
    { questionId: 'has_kids', answer: 'Nie', riskPoints: 0, mainRisk: '-', sideRisks: [] },
    
    { questionId: 'kids_relationship', answer: 'Dobra', riskPoints: 1, mainRisk: '-', sideRisks: [] },
    { questionId: 'kids_relationship', answer: 'Średnia', riskPoints: 4, mainRisk: 'Alienacja rodzicielska', sideRisks: [] },
    { questionId: 'kids_relationship', answer: 'Konfliktowa', riskPoints: 7, mainRisk: 'Alienacja rodzicielska', sideRisks: ['Fałszywe oskarżenia'] },
    { questionId: 'kids_relationship', answer: 'Bardzo konfliktowa', riskPoints: 10, mainRisk: 'Alienacja rodzicielska', sideRisks: ['Fałszywe oskarżenia'] },
    
    { questionId: 'emotional_abuse', answer: 'Nie', riskPoints: 0, mainRisk: '-', sideRisks: [] },
    { questionId: 'emotional_abuse', answer: 'Czasami', riskPoints: 5, mainRisk: 'Manipulacja', sideRisks: ['Rozstanie/Rozwód'] },
    { questionId: 'emotional_abuse', answer: 'Często', riskPoints: 8, mainRisk: 'Manipulacja', sideRisks: ['Rozstanie/Rozwód', 'Fałszywe oskarżenia'] },
    { questionId: 'emotional_abuse', answer: 'Bardzo często', riskPoints: 10, mainRisk: 'Manipulacja', sideRisks: ['Rozstanie/Rozwód', 'Fałszywe oskarżenia'] },
    
    { questionId: 'support_network', answer: 'Tak, mam wsparcie', riskPoints: 0, mainRisk: '-', sideRisks: [] },
    { questionId: 'support_network', answer: 'Niewielkie', riskPoints: 3, mainRisk: 'Manipulacja', sideRisks: [] },
    { questionId: 'support_network', answer: 'Nie, jestem odcięty', riskPoints: 8, mainRisk: 'Manipulacja', sideRisks: ['Straty finansowe'] },
    
    // Crisis pathway
    { questionId: 'conflict_level', answer: 'Niski', riskPoints: 2, mainRisk: '-', sideRisks: [] },
    { questionId: 'conflict_level', answer: 'Średni', riskPoints: 5, mainRisk: 'Rozstanie/Rozwód', sideRisks: [] },
    { questionId: 'conflict_level', answer: 'Wysoki', riskPoints: 8, mainRisk: 'Rozstanie/Rozwód', sideRisks: ['Fałszywe oskarżenia'] },
    { questionId: 'conflict_level', answer: 'Ekstremalny', riskPoints: 10, mainRisk: 'Rozstanie/Rozwód', sideRisks: ['Fałszywe oskarżenia', 'Alienacja rodzicielska'] },
    
    // Divorce pathway
    { questionId: 'legal_representation', answer: 'Tak, mam prawnika', riskPoints: 0, mainRisk: '-', sideRisks: [] },
    { questionId: 'legal_representation', answer: 'Nie', riskPoints: 7, mainRisk: 'Straty finansowe', sideRisks: ['Fałszywe oskarżenia'] },
    
    // Married pathway
    { questionId: 'relationship_satisfaction', answer: 'Bardzo zadowolony', riskPoints: 0, mainRisk: '-', sideRisks: [] },
    { questionId: 'relationship_satisfaction', answer: 'Zadowolony', riskPoints: 2, mainRisk: '-', sideRisks: [] },
    { questionId: 'relationship_satisfaction', answer: 'Średnio', riskPoints: 5, mainRisk: 'Rozstanie/Rozwód', sideRisks: [] },
    { questionId: 'relationship_satisfaction', answer: 'Niezadowolony', riskPoints: 8, mainRisk: 'Rozstanie/Rozwód', sideRisks: ['Manipulacja'] },
  ];
}
