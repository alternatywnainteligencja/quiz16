import React, { useEffect, useState } from 'react';
import { getQuizData } from '../calculations/weightsManager';
import { QuizQuestion } from '../calculations/types';

export default function Quiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadQuiz();
  }, []);

  async function loadQuiz() {
    try {
      const data = await getQuizData();
      console.log('Quiz loaded:', data.questions.length, 'questions');
      setQuestions(data.questions);
      setLoading(false);
    } catch (error) {
      console.error('Error loading quiz:', error);
      alert('Błąd ładowania quizu - sprawdź URL w .env');
    }
  }

  function handleAnswer(questionId: number, answer: string) {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }

  if (loading) return <div>Ładowanie...</div>;
  if (questions.length === 0) return <div>Brak pytań</div>;

  const q = questions[currentIndex];

  return (
    <div className="p-8">
      <div className="mb-4">Pytanie {currentIndex + 1}/{questions.length}</div>
      <h2 className="text-xl mb-4">{q.text}</h2>
      
      <div className="space-y-2">
        {q.options.map(option => (
          <button
            key={option}
            onClick={() => handleAnswer(q.id, option)}
            className="block w-full p-3 border rounded hover:bg-blue-50"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
