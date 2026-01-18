// src/calculations/types.ts

// Surowy wiersz z CSV (indeksowany od 0)
export interface CSVRow {
  0: string;  // Id pytania
  1: string;  // Pytanie
  2: string;  // Odpowiedź (lub pytanie w wierszu nagłówkowym)
  3: string;  // Punkty ryzyka
  4: string;  // Ryzyko główne
  5: string;  // Ryzyka poboczne
  6: string;  // Komentarz
  7: string;  // Opcje odpowiedzi (rozdzielone |)
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: string[];
}

export interface AnswerWeight {
  questionId: number;
  questionText: string;
  answer: string;
  riskPoints: number;
  mainRisk: string;
  sideRisks: string[];
  comment?: string;
}

export interface QuizData {
  questions: QuizQuestion[];
  weights: AnswerWeight[];
  lastUpdated: string;
}

// ... (pozostałe typy: CalculationResult, AnswerAnalysis, etc.)
export interface CalculationResult {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  mainTitle: string;
  mainDescription: string;
  overallRiskPercentage: number;
  riskBreakdown: Record<string, number>;
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
  meta: {
    source: string;
    score: number;
    generatedAt: string;
    totalQuestions: number;
    answeredQuestions: number;
  };
}

export interface AnswerAnalysis {
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
  divorceRisk: number;
  alienationRisk: number;
  falseAccusationRisk: number;
  financialRisk: number;
  manipulationRisk: number;
}

export type Pathway = 'before' | 'crisis' | 'divorce' | 'married';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
