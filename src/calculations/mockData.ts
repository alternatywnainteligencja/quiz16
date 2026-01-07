/**
 * Mock data do testowania - używane gdy API nie działa
 * WAŻNE: questionId musi pasować do id pytań w fallback questions!
 */

export function createMockWeights() {
  return [
    // Crisis pathway - dopasowane do fallback questions
    { questionId: '1', answer: 'Rzadko - raz na kilka miesięcy', riskPoints: 1, mainRisk: '-', sideRisks: [] },
    { questionId: '1', answer: 'Kilka razy w miesiącu', riskPoints: 3, mainRisk: 'Rozstanie/Rozwód', sideRisks: [] },
    { questionId: '1', answer: 'Co tydzień', riskPoints: 6, mainRisk: 'Rozstanie/Rozwód', sideRisks: ['Manipulacja'] },
    { questionId: '1', answer: 'Prawie codziennie', riskPoints: 8, mainRisk: 'Rozstanie/Rozwód', sideRisks: ['Manipulacja', 'Fałszywe oskarżenia'] },
    { questionId: '1', answer: 'Kilka razy dziennie - żyjemy w stałym konflikcie', riskPoints: 10, mainRisk: 'Rozstanie/Rozwód', sideRisks: ['Manipulacja', 'Fałszywe oskarżenia'] },
    
    { questionId: '2', answer: 'Nigdy', riskPoints: 0, mainRisk: '-', sideRisks: [] },
    { questionId: '2', answer: 'Raz, w emocjach', riskPoints: 2, mainRisk: '-', sideRisks: [] },
    { questionId: '2', answer: 'Kilka razy', riskPoints: 5, mainRisk: 'Rozstanie/Rozwód', sideRisks: ['Manipulacja'] },
    { questionId: '2', answer: 'Często to robi', riskPoints: 7, mainRisk: 'Rozstanie/Rozwód', sideRisks: ['Manipulacja'] },
    { questionId: '2', answer: 'Używa tego jako narzędzia manipulacji', riskPoints: 10, mainRisk: 'Manipulacja', sideRisks: ['Rozstanie/Rozwód', 'Fałszywe oskarżenia'] },
    
    { questionId: '3', answer: 'Nigdy', riskPoints: 0, mainRisk: '-', sideRisks: [] },
    { questionId: '3', answer: 'Raz się zdarzyło', riskPoints: 3, mainRisk: '-', sideRisks: [] },
    { questionId: '3', answer: 'Kilka razy - z jej strony', riskPoints: 7, mainRisk: 'Fałszywe oskarżenia', sideRisks: ['Rozstanie/Rozwód'] },
    { questionId: '3', answer: 'Kilka razy - z obu stron', riskPoints: 6, mainRisk: 'Rozstanie/Rozwód', sideRisks: [] },
    { questionId: '3', answer: 'Regularnie - sytuacja jest niebezpieczna', riskPoints: 10, mainRisk: 'Fałszywe oskarżenia', sideRisks: ['Rozstanie/Rozwód'] },
    
    { questionId: '4', answer: 'Nie, mam pełną swobodę', riskPoints: 0, mainRisk: '-', sideRisks: [] },
    { questionId: '4', answer: 'Czasami pyta o szczegóły', riskPoints: 2, mainRisk: '-', sideRisks: [] },
    { questionId: '4', answer: 'Sprawdza mój telefon/konta bez pytania', riskPoints: 6, mainRisk: 'Manipulacja', sideRisks: ['Straty finansowe'] },
    { questionId: '4', answer: 'Wymaga dostępu do wszystkiego', riskPoints: 8, mainRisk: 'Manipulacja', sideRisks: ['Straty finansowe'] },
    { questionId: '4', answer: 'Kontroluje każdy aspekt mojego życia', riskPoints: 10, mainRisk: 'Manipulacja', sideRisks: ['Straty finansowe', 'Fałszywe oskarżenia'] },
    
    { questionId: '5', answer: 'Nie, nie widzę potrzeby', riskPoints: 0, mainRisk: '-', sideRisks: [] },
    { questionId: '5', answer: 'Myślałem, ale jeszcze nie działałem', riskPoints: 3, mainRisk: 'Rozstanie/Rozwód', sideRisks: [] },
    { questionId: '5', answer: 'Już poszukuję informacji', riskPoints: 5, mainRisk: 'Rozstanie/Rozwód', sideRisks: [] },
    { questionId: '5', answer: 'Umówiłem się na konsultację', riskPoints: 6, mainRisk: 'Rozstanie/Rozwód', sideRisks: [] },
    { questionId: '5', answer: 'Jestem w trakcie procesu prawnego/terapii', riskPoints: 8, mainRisk: 'Rozstanie/Rozwód', sideRisks: ['Straty finansowe'] },
    
    { questionId: '6', answer: 'Nie', riskPoints: 0, mainRisk: '-', sideRisks: [] },
    { questionId: '6', answer: 'Tak, jedno dziecko', riskPoints: 0, mainRisk: '-', sideRisks: [] },
    { questionId: '6', answer: 'Tak, dwoje lub więcej dzieci', riskPoints: 0, mainRisk: '-', sideRisks: [] },
    { questionId: '6', answer: 'Partnerka jest w ciąży', riskPoints: 0, mainRisk: '-', sideRisks: [] },
    
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
