import React, { useState, useEffect } from 'react';
import QuestionScreen from '../components/QuestionScreen';
import { calculateCrisis } from '../calculations';
import { fetchQuestionsWithCache, Question } from '../services/googleSheetsService';

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

  const fallbackQuestions: Question[] = [
    {
      id: 'crisis_1',
      q: 'Jak często dochodzi do intensywnych kłótni w ostatnim czasie?',
      opts: [
        { text: 'Rzadko - raz na kilka miesięcy' },
        { text: 'Kilka razy w miesiącu' },
        { text: 'Co tydzień' },
        { text: 'Prawie codziennie' },
        { text: 'Kilka razy dziennie - żyjemy w stałym konflikcie' }
      ]
    },
    {
      id: 'crisis_2',
      q: 'Czy partnerka groziła Ci już rozstaniem/rozwodem?',
      opts: [
        { text: 'Nigdy' },
        { text: 'Raz, w emocjach' },
        { text: 'Kilka razy' },
        { text: 'Często to robi' },
        { text: 'Używa tego jako narzędzia manipulacji' }
      ]
    },
    {
      id: 'crisis_3',
      q: 'Czy w kłótniach pojawia się agresja fizyczna?',
      opts: [
        { text: 'Nigdy' },
        { text: 'Raz się zdarzyło' },
        { text: 'Kilka razy - z jej strony' },
        { text: 'Kilka razy - z obu stron' },
        { text: 'Regularnie - sytuacja jest niebezpieczna' }
      ]
    },
    {
      id: 'crisis_4',
      q: 'Czy partnerka kontroluje Twoje finanse, telefon, kontakty?',
      opts: [
        { text: 'Nie, mam pełną swobodę' },
        { text: 'Czasami pyta o szczegóły' },
        { text: 'Sprawdza mój telefon/konta bez pytania' },
        { text: 'Wymaga dostępu do wszystkiego' },
        { text: 'Kontroluje każdy aspekt mojego życia' }
      ]
    },
    {
      id: 'crisis_5',
      q: 'Czy myślałeś o pomocy prawnika lub terapeuty?',
      opts: [
        { text: 'Nie, nie widzę potrzeby' },
        { text: 'Myślałem, ale jeszcze nie działałem' },
        { text: 'Już poszukuję informacji' },
        { text: 'Umówiłem się na konsultację' },
        { text: 'Jestem w trakcie procesu' }
      ]
    },
    {
      id: 'crisis_6',
      q: 'Czy są dzieci w związku?',
      opts: [
        { text: 'Nie' },
        { text: 'Tak, jedno dziecko' },
        { text: 'Tak, dwoje lub więcej dzieci' },
        { text: 'Partnerka jest w ciąży' }
      ]
    }
  ];

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        console.log('Fetching questions for crisis...');
        const fetchedQuestions = await fetchQuestionsWithCache('crisis');
        console.log(`Loaded ${fetchedQuestions.length} questions`);
        setQuestions(fetchedQuestions);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch questions:', err);
        setError('Używam lokalnych pytań');
        setQuestions(fallbackQuestions);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleAnswer = async (value: string) => {
    const currentQuestion = questions[step];
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    console.log(`Question ${currentQuestion.id}: "${value}"`);

    const chosenOpt = currentQuestion.opts.find(opt =>
      typeof opt === 'string' ? opt === value : opt.text === value
    );

    let nextStep = step + 1;

    if (chosenOpt && typeof chosenOpt === 'object' && chosenOpt.next) {
      const nextIndex = questions.findIndex(q => q.id === chosenOpt.next);
      if (nextIndex !== -1) {
        nextStep = nextIndex;
      }
    }

    if (nextStep < questions.length) {
      setStep(nextStep);
    } else {
      console.log('Quiz completed!');
      
      try {
        setCalculating(true);
        const res = await calculateCrisis(newAnswers);
        console.log('Result:', res);
        onResult(res);
      } catch (err) {
        console.error('Error:', err);
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
        gap: '1rem'
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
        gap: '1rem'
      }}>
        <div style={{ fontSize: '3rem' }}>🧮</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
          Analizuję odpowiedzi...
        </div>
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
        question={q.q}
        options={q.opts.map(opt => typeof opt === 'string' ? opt : opt.text)}
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
