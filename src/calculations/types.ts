// src/calculations/types.ts

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
