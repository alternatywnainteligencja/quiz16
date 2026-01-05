// src/quiz/types.ts

export type PathwayType =
  | 'beforeMarriage'
  | 'married'
  | 'crisis'
  | 'divorce';

export interface QuizState {
  answers: number[];
}
