export type Difficulty = "easy" | "medium" | "hard";

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string; // must match one of options exactly
  explanation: string;
}

export interface Quiz {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  questions: QuizQuestion[];
}

// ── Stored result shape ──
export interface QuizAttempt {
  slug: string;
  title: string;
  difficulty: Difficulty;
  score: number; // number of correct answers
  total: number; // total questions
  completedAt: string; // ISO string
  answers: {
    question: string;
    chosen: string;
    correct: string;
    isCorrect: boolean;
  }[];
}
