/**
 * MarriageQuiz.tsx
 *
 * Główny komponent quizu „Analiza sytuacji małżeńskiej”.
 * 
 * Funkcje:
 * - Wyświetla ekran startowy z wyborem ścieżki życiowej użytkownika (przed ślubem, w małżeństwie, kryzys, rozwód)
 * - Steruje nawigacją między ekranem startowym, właściwym quizem (Pathway) i ekranem wyniku
 * - Przechowuje stany:
 *    - pathway – aktualnie wybrana ścieżka quizu
 *    - result – wynik quizu po zakończeniu
 * - Po zakończeniu quizu wyświetla komponent ResultDisplay z możliwością restartu
 * - Współpracuje z komponentami ścieżek: BeforePathway, MarriedPathway, CrisisPathway, DivorcePathway
 * - Odpowiada za wizualną spójność quizu oraz logikę przełączania między ekranami
 */
/**
 * MarriageQuiz.tsx - WERSJA DEBUG
 */
/**
 * MarriageQuiz.tsx - WERSJA DEBUG
 */




import React, { useState, useEffect } from 'react';
import { QuizState } from '../quiz/types';
import { Heart } from 'lucide-react';
import BeforePathway from '../pathways/BeforePathway';
import MarriedPathway from '../pathways/MarriedPathway';
import CrisisPathway from '../pathways/CrisisPathway';
import DivorcePathway from '../pathways/DivorcePathway';
import ResultDisplay from './ResultDisplay';

// TESTOWY ALERT
alert('🔥 MarriageQuiz się ładuje!');
console.log('🔥 MarriageQuiz file loaded');

const MarriageQuiz = () => {
  const [pathway, setPathway] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  // 🔥 DEBUG: Sprawdź czy komponent się montuje
  useEffect(() => {
    console.log('🔥 MarriageQuiz MOUNTED!');
    alert('🔥 MarriageQuiz załadowany!');
  }, []);

  // 🔥 DEBUG: Loguj zmiany pathway
  useEffect(() => {
    console.log('🎯 Pathway changed to:', pathway);
    if (pathway) {
      alert(`🎯 Wybrano pathway: ${pathway}`);
    }
  }, [pathway]);

  // 🔥 DEBUG: Loguj zmiany result
  useEffect(() => {
    console.log('📊 Result changed:', result);
    if (result) {
      alert(`📊 Otrzymano wynik!\nRyzyko: ${result.overallRiskPercentage}%\nPoziom: ${result.riskLevel}`);
    }
  }, [result]);

  // Handler dla wyniku - z dodatkowym logowaniem
  const handleResult = (res: any) => {
    console.log('✅ handleResult called with:', res);
    alert(`✅ handleResult wywołane!\n\nRyzyko: ${res?.overallRiskPercentage}%\nPoziom: ${res?.riskLevel}`);
    setResult(res);
  };

  // Jeśli wynik jest dostępny
  if (result) {
    console.log('📺 Rendering ResultDisplay');
    return (
      <ResultDisplay
        result={result} 
        onRestart={() => {
          console.log('🔄 Restart clicked');
          alert('🔄 Restart quizu');
          setResult(null);
          setPathway(null);
        }}
      />
    );
  }

  // Jeśli żadna ścieżka nie jest wybrana
  if (!pathway) {
    console.log('🏠 Rendering home screen');
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4">
        <div className="max-w-2xl mx-auto py-8">
          <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Heart className="text-red-500" size={32} />
              <h1 className="text-3xl font-bold">Analiza sytuacji małżeńskiej</h1>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  console.log('🎯 Clicked: before');
                  setPathway('before');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-left p-6 rounded-lg transition-colors border-2 border-blue-500"
              >
                <h3 className="text-xl font-bold mb-2">💍 Planuję wziąć ślub</h3>
                <p className="text-gray-300 text-sm">Przed ślubem - ocena sytuacji</p>
              </button>

              <button
                onClick={() => {
                  console.log('🎯 Clicked: married');
                  setPathway('married');
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-left p-6 rounded-lg transition-colors border-2 border-green-500"
              >
                <h3 className="text-xl font-bold mb-2">💚 Jestem w małżeństwie</h3>
                <p className="text-gray-300 text-sm">Po ślubie - ocena bieżącej sytuacji</p>
              </button>

              <button
                onClick={() => {
                  console.log('🎯 Clicked: crisis');
                  setPathway('crisis');
                }}
                className="w-full bg-orange-600 hover:bg-orange-700 text-left p-6 rounded-lg transition-colors border-2 border-orange-500"
              >
                <h3 className="text-xl font-bold mb-2">⚠️ Małżeństwo w kryzysie</h3>
                <p className="text-gray-300 text-sm">Poważne problemy, rozważasz rozwód</p>
              </button>

              <button
                onClick={() => {
                  console.log('🎯 Clicked: divorce');
                  setPathway('divorce');
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-left p-6 rounded-lg transition-colors border-2 border-red-500"
              >
                <h3 className="text-xl font-bold mb-2">⚖️ W trakcie rozwodu</h3>
                <p className="text-gray-300 text-sm">Proces rozwodowy już trwa</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderowanie pathway
  console.log(`🎬 Rendering pathway: ${pathway}`);
  
  if (pathway === 'before') {
    console.log('📱 Loading BeforePathway');
    return <BeforePathway onResult={handleResult} onBack={() => setPathway(null)} />;
  }
  
  if (pathway === 'married') {
    console.log('📱 Loading MarriedPathway');
    return <MarriedPathway onResult={handleResult} onBack={() => setPathway(null)} />;
  }
  
  if (pathway === 'crisis') {
    console.log('📱 Loading CrisisPathway');
    return <CrisisPathway onResult={handleResult} onBack={() => setPathway(null)} />;
  }
  
  if (pathway === 'divorce') {
    console.log('📱 Loading DivorcePathway');
    return <DivorcePathway onResult={handleResult} onBack={() => setPathway(null)} />;
  }

  console.log('❌ No pathway matched!');
  return null;
};

export default MarriageQuiz;
