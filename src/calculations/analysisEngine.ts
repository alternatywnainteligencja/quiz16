/**
 * Silnik analizy odpowiedzi użytkownika
 * Oblicza punkty ryzyka i generuje szczegółową analizę
 */

export interface AnalysisResult {
  totalRiskPoints: number;
  maxPossiblePoints: number;
  overallRiskPercentage: number;
  riskScores: Record<string, number>;
  riskBreakdown: Record<string, number>;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  matchedWeights: Array<any>;
  
  // Szczegółowa analiza
  hasKids: boolean;
  kidsConflict: boolean;
  financialControl: boolean;
  sharedAssets: boolean;
  poorCommunication: boolean;
  manipulation: boolean;
  emotionalAbuse: boolean;
  fearLevel: boolean;
  hasSupport: boolean;
  isolatedFromFriends: boolean;
  topRisks: string[];
  
  // Poziomy ryzyka dla każdej kategorii
  divorceRisk: number;
  alienationRisk: number;
  falseAccusationRisk: number;
  financialRisk: number;
  manipulationRisk: number;
}

/**
 * Główna funkcja analizy
 */
export function analyzeAnswers(
  answers: Record<string, string>,
  weights: Array<any>
): AnalysisResult {
  
  console.log('🔍 === ANALIZA ROZPOCZĘTA ===');
  console.log('📝 Otrzymane odpowiedzi:', answers);
  console.log('⚖️ Liczba wag w bazie:', weights.length);
  
  // Debug: Pokaż pierwsze 3 wagi
  console.log('🔍 Przykładowe wagi:', weights.slice(0, 3));
  
  // 1. Oblicz punkty ryzyka
  let totalRiskPoints = 0;
  let maxPossiblePoints = 0;
  const riskScores: Record<string, number> = {};
  const matchedWeights: Array<any> = [];
  
  Object.entries(answers).forEach(([questionId, answerText]) => {
    console.log(`\n🔍 Szukam: questionId="${questionId}", answer="${answerText}"`);
    
    // Debug: Sprawdź czy istnieją wagi dla tego pytania
    const weightsForQuestion = weights.filter(w => w.questionId === questionId);
    console.log(`   Znalezione wagi dla pytania (${weightsForQuestion.length}):`, 
      weightsForQuestion.map(w => w.answer)
    );
    
    const weight = weights.find(
      w => w.questionId === questionId && w.answer === answerText
    );
    
    if (weight) {
      console.log(`   ✅ MATCH! → ${weight.riskPoints} punktów`);
      matchedWeights.push(weight);
      totalRiskPoints += weight.riskPoints;
      
      // Główne ryzyko
      if (weight.mainRisk && weight.mainRisk !== '-') {
        riskScores[weight.mainRisk] = (riskScores[weight.mainRisk] || 0) + weight.riskPoints;
      }
      
      // Ryzyka poboczne (50% wagi)
      weight.sideRisks?.forEach((sideRisk: string) => {
        if (sideRisk && sideRisk !== '-') {
          riskScores[sideRisk] = (riskScores[sideRisk] || 0) + (weight.riskPoints * 0.5);
        }
      });
    } else {
      console.warn(`   ❌ BRAK DOPASOWANIA!`);
      console.warn(`   Dostępne odpowiedzi:`, weightsForQuestion.map(w => `"${w.answer}"`));
    }
    
    maxPossiblePoints += 10;
  });
  
  console.log('\n📊 === PODSUMOWANIE ===');
  console.log('💯 Łącznie punktów:', totalRiskPoints);
  console.log('🎯 Max możliwych:', maxPossiblePoints);
  console.log('🎲 Dopasowane wagi:', matchedWeights.length);
  console.log('📈 Risk scores:', riskScores);
  
  // 2. Oblicz procenty
  const overallRiskPercentage = maxPossiblePoints > 0 
    ? Math.round((totalRiskPoints / maxPossiblePoints) * 100)
    : 0;
  
  const totalCategoryPoints = Object.values(riskScores).reduce((sum, val) => sum + val, 0);
  const riskBreakdown: Record<string, number> = {};
  
  Object.entries(riskScores).forEach(([category, points]) => {
    riskBreakdown[category] = totalCategoryPoints > 0
      ? Math.round((points / totalCategoryPoints) * 100)
      : 0;
  });
  
  // 3. Określ poziom ryzyka
  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  if (overallRiskPercentage < 25) riskLevel = 'low';
  else if (overallRiskPercentage < 50) riskLevel = 'medium';
  else if (overallRiskPercentage < 75) riskLevel = 'high';
  else riskLevel = 'critical';
  
  // 4. Szczegółowa analiza odpowiedzi
  const detailedAnalysis = analyzePatterns(answers, riskBreakdown);
  
  return {
    totalRiskPoints,
    maxPossiblePoints,
    overallRiskPercentage,
    riskScores,
    riskBreakdown,
    riskLevel,
    matchedWeights,
    ...detailedAnalysis
  };
}

/**
 * Analiza wzorców w odpowiedziach
 */
function analyzePatterns(
  answers: Record<string, string>,
  riskBreakdown: Record<string, number>
) {
  return {
    // Dzieci
    hasKids: checkAnswer(answers, ['has_kids', 'kids', 'children'], ['Tak', 'yes']),
    kidsConflict: checkAnswer(answers, ['kids_relationship', 'contact_kids'], ['konflikt', 'trudny', 'niemożliwy']),
    
    // Finanse
    financialControl: checkAnswer(answers, ['financial', 'money', 'control'], ['kontroluje', 'brak dostępu', 'całkowita']),
    sharedAssets: checkAnswer(answers, ['assets', 'property', 'majątek'], ['wspólny', 'shared']),
    
    // Komunikacja
    poorCommunication: checkAnswer(answers, ['communication', 'talk', 'rozmowy'], ['zła', 'brak', 'trudna', 'niemożliwa']),
    manipulation: checkAnswer(answers, ['manipulation', 'control', 'gaslighting'], ['tak', 'często', 'czasami']),
    
    // Emocje
    emotionalAbuse: checkAnswer(answers, ['abuse', 'emotional', 'verbal'], ['tak', 'często']),
    fearLevel: checkAnswer(answers, ['fear', 'afraid', 'strach'], ['wysoki', 'bardzo', 'tak']),
    
    // Wsparcie
    hasSupport: checkAnswer(answers, ['support', 'friends', 'family', 'wsparcie'], ['tak', 'mam']),
    isolatedFromFriends: checkAnswer(answers, ['friends', 'isolated', 'izolacja'], ['nie', 'brak', 'odcięty']),
    
    // Top ryzyka
    topRisks: Object.entries(riskBreakdown)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([risk]) => risk),
    
    // Poziomy ryzyka
    divorceRisk: riskBreakdown['Rozstanie/Rozwód'] || 0,
    alienationRisk: riskBreakdown['Alienacja rodzicielska'] || 0,
    falseAccusationRisk: riskBreakdown['Fałszywe oskarżenia'] || 0,
    financialRisk: riskBreakdown['Straty finansowe'] || 0,
    manipulationRisk: riskBreakdown['Manipulacja'] || 0
  };
}

/**
 * Helper: sprawdza czy odpowiedź zawiera określone słowa kluczowe
 */
function checkAnswer(
  answers: Record<string, string>,
  questionKeys: string[],
  valueKeys: string[]
): boolean {
  for (const qKey of questionKeys) {
    for (const [question, answer] of Object.entries(answers)) {
      if (question.toLowerCase().includes(qKey.toLowerCase())) {
        const answerLower = answer.toLowerCase();
        if (valueKeys.some(vKey => answerLower.includes(vKey.toLowerCase()))) {
          return true;
        }
      }
    }
  }
  return false;
}
