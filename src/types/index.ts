export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface QuizState {
  selectedTopic: string;
  questions: Question[];
  currentQuestionIndex: number;
  answers: number[];
  score: number;
  isLoading: boolean;
  error: string | null;
  quizCompleted: boolean;
  showReview: boolean;
}

export interface QuizContextType {
  state: QuizState;
  setTopic: (topic: string) => void;
  setQuestions: (questions: Question[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  answerQuestion: (answerIndex: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
  retakeQuiz: () => void; // ← MUST BE HERE
  toggleReview: () => void;
}


export interface AIQuizResponse {
  questions: Array<{
    question: string;
    options: string[];
    correctIndex: number;
  }>;
}
