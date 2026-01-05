// src/quiz/engine.ts
import { QuizState } from './types';

export function calculateScore(state: QuizState): number {
  return state.answers.reduce((sum, value) => sum + value, 0);
}
