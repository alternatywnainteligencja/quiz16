import React, { useState, useEffect } from 'react';
import QuestionScreen from '../components/QuestionScreen';
import { calculateCrisis } from '../calculations';
import { fetchUnifiedDataWithCache, Question } from '../services/unifiedSheetsService';
// TUŻ PO IMPORTACH
console.log('🔥 CrisisPathway loaded!');

// W środku funkcji CrisisPathway, przed return:
useEffect(() => {
  console.log('🔥 CrisisPathway mounted!');
  alert('🔥 CrisisPathway załadowany!');
}, []);
interface CrisisPathwayProps {
  onResult: (result: any) => void;
  onBack: () => void;
}

const CrisisPathway: React.FC<CrisisPathwayProps> = ({ onResult, onBack }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calculating, setCalculating] = useState(false);

  // Fallback questions - na wypadek gdyby API nie działało
  const fallbackQuestions: Question[] = [
    {
      id: 'crisis_1',
      text: 'Jak często dochodzi do intensywnych kłótni w ostatnim czasie?',
      options: [
        { text: 'Rzadko - raz na kilka miesięcy', riskPoints: 1, mainRisk: '-', sideRisks: [] },
        { text: 'Kilka razy w miesiącu', riskPoints: 3, mainRisk: 'Rozstanie/Rozwód', sideRisks: [] },
        { text: 'Co tydzień', riskPoints: 6, mainRisk: 'Rozstanie/Rozwód', sideRisks: ['Manipulacja'] },
        { text: 'Prawie codziennie', riskPoints: 8, mainRisk: 'Rozstanie/Rozwód', sideRisks: ['Manipulacja'] },
        { text: 'Kilka razy dziennie - żyjemy w stałym konflikcie', riskPoints: 10, mainRisk: 'Rozstanie/Rozwód', sideRisks: ['Manipulacja', 'Fałszywe oskarżenia'] }
      ]
    },
    {
      id: 'crisis_2',
      text: 'Czy partnerka groziła Ci już rozstaniem/rozwodem?',
      options: [
        { text: 'Nigdy', riskPoints: 0, mainRisk: '-', sideRisks: [] },
        { text: 'Raz, w emocjach', riskPoints: 2, mainRisk: '-', sideRisks: [] },
        { text: 'Kilka razy', riskPoints: 5, mainRisk: 'Rozstanie/Rozwód', sideRisks: ['Manipulacja'] },
        { text: 'Często to robi', riskPoints: 7, mainRisk: 'Rozstanie/Rozwód', sideRisks: ['Manipulacja'] },
        { text: 'Używa tego jako narzędzia manipulacji', riskPoints: 10, mainRisk: 'Manipulacja', sideRisks: ['Rozstanie/Rozwód'] }
      ]
    },
    {
      id: 'crisis_3',
      text: 'Czy w kłótniach pojawia się agresja fizyczna?',
      options: [
        { text: 'Nigdy', riskPoints: 0, mainRisk: '-', sideRisks: [] },
        { text: 'Raz się zdarzyło', riskPoints: 3, mainRisk: '-', sideRisks: [] },
        { text: 'Kilka razy - z jej strony', riskPoints: 7, mainRisk: 'Fałszywe oskarżenia', sideRisks: ['Rozstanie/Rozwód'] },
        { text: 'Regularnie - sytuacja jest niebezpieczna', riskPoints: 10, mainRisk: 'Fałszywe oskarżenia', sideRisks: ['Rozstanie/Rozwód'] }
      ]
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching unified data for crisis...');
        
        const data = await fetchUnifiedDataWithCache('crisis');
        
        console.log(`✅ Loaded ${data.questions.length} questions`);
        console.log(`✅ Loaded ${data.weights.length} weights`);
        
        setQuestions(data.questions);
        setError(null);
        
      } catch (err) {
        console.error('❌ Failed to fetch data, using fallback:', err);
        setError('Używam lokalnych pytań (problem z połączeniem)');
        setQuestions(fallbackQuestions);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAnswer = async (value: string) => {
    const currentQuestion = questions[step];
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    console.log(`📝 Question ${currentQuestion.id}: "${value}"`);

    // Następne pytanie
    const nextStep = step + 1;

    if (nextStep < questions.length) {
      setStep(nextStep);
    } else {
      console.log('🏁 Quiz completed!');
      console.log('📊 Answers:', newAnswers);
      
      try {
        setCalculating(true);
        console.log('🧮 Calling calculateCrisis...');
        
        const res = await calculateCrisis(newAnswers);
        
        console.log('✅ Result:', res);
        onResult(res);
        
      } catch (err) {
        console.error('❌ Calculation error:', err);
        alert(`❌ Błąd obliczeń:\n\n${err.message || err}`);
        setError('Błąd podczas obliczania wyników');
        setCalculating(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      const currentQuestionId = questions[step].id;
      const newAnswers = { ...answers };
      delete newAnswers[currentQuestionId];
      setAnswers(newAnswers);
    } else {
      onBack();
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem' }}>⏳</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
          Ładowanie pytań...
        </div>
      </div>
    );
  }

  if (calculating) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem' }}>🧮</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
          Analizuję Twoje odpowiedzi...
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>❌ Brak pytań</h2>
        <p>Nie udało się załadować pytań. Sprawdź konfigurację.</p>
        <button onClick={onBack}>Powrót</button>
      </div>
    );
  }

  const q = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  return (
    <>
      {error && (
        <div style={{ 
          padding: '0.75rem 1rem', 
          backgroundColor: '#fff3cd', 
          color: '#856404',
          textAlign: 'center',
          fontSize: '0.875rem'
        }}>
          ⚠️ {error}
        </div>
      )}
      <QuestionScreen
        title="⚠️ W kryzysie"
        question={q.text}
        options={q.options.map(opt => opt.text)}
        onAnswer={handleAnswer}
        onBack={handleBack}
        progress={progress}
        step={step + 1}
        total={questions.length}
        color="orange"
      />
    </>
  );
};

export default CrisisPathway;
