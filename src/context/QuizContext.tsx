import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { QuizState, QuizContextType, Question } from '../types';

const initialState: QuizState = {
  selectedTopic: '',
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  score: 0,
  isLoading: false,
  error: null,
  quizCompleted: false,
  showReview: false,
};

type QuizAction =
  | { type: 'SET_TOPIC'; payload: string }
  | { type: 'SET_QUESTIONS'; payload: Question[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ANSWER_QUESTION'; payload: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'COMPLETE_QUIZ' }
  | { type: 'RESET_QUIZ' }
  | { type: 'RETAKE_QUIZ' } 
  | { type: 'TOGGLE_REVIEW' };

// Function to shuffle array options and update correct index
const shuffleOptions = (question: Question): Question => {
  const correctAnswer = question.options[question.correctIndex];
  const shuffledOptions = [...question.options];
  
  // Fisher-Yates shuffle
  for (let i = shuffledOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
  }
  
  // Find new index of correct answer
  const newCorrectIndex = shuffledOptions.findIndex(option => option === correctAnswer);
  
  return {
    ...question,
    options: shuffledOptions,
    correctIndex: newCorrectIndex
  };
};

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'SET_TOPIC':
      return { ...state, selectedTopic: action.payload };
    
    case 'SET_QUESTIONS':
      return { 
        ...state, 
        questions: action.payload,
        answers: new Array(action.payload.length).fill(-1),
        currentQuestionIndex: 0,
        isLoading: false,
        error: null 
      };

    case 'RETAKE_QUIZ':
      console.log('🔄 RETAKE_QUIZ reducer called - Current state:', {
        selectedTopic: state.selectedTopic,
        questionsLength: state.questions.length
      });
      
      // Shuffle options for each question and reset user progress
      const shuffledQuestions = state.questions.map(question => shuffleOptions(question));
      
      const newState = {
        ...state,
        questions: shuffledQuestions,
        currentQuestionIndex: 0,
        answers: new Array(state.questions.length).fill(-1),
        score: 0,
        quizCompleted: false,
        showReview: false,
        isLoading: false,
        error: null
      };
      
      console.log('✅ RETAKE_QUIZ reducer complete - New state:', {
        selectedTopic: newState.selectedTopic,
        questionsLength: newState.questions.length
      });
      
      return newState;
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'ANSWER_QUESTION':
      const newAnswers = [...state.answers];
      newAnswers[state.currentQuestionIndex] = action.payload;
      return { ...state, answers: newAnswers };
    
    case 'NEXT_QUESTION':
      return { 
        ...state, 
        currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.questions.length - 1) 
      };
    
    case 'PREVIOUS_QUESTION':
      return { 
        ...state, 
        currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0) 
      };
    
    case 'COMPLETE_QUIZ':
      const score = state.answers.reduce((acc, answer, index) => {
        return acc + (answer === state.questions[index].correctIndex ? 1 : 0);
      }, 0);
      
      try {
        const scores = JSON.parse(localStorage.getItem('quizScores') || '[]');
        const newScore = {
          topic: state.selectedTopic,
          score,
          total: state.questions.length,
          date: new Date().toISOString(),
        };
        scores.push(newScore);
        localStorage.setItem('quizScores', JSON.stringify(scores));
      } catch (error) {
        console.warn('Failed to save score to localStorage:', error);
      }
      
      return { ...state, score, quizCompleted: true };
    
    case 'RESET_QUIZ':
      return { ...initialState };
    
    case 'TOGGLE_REVIEW':
      return { ...state, showReview: !state.showReview };
    
    default:
      return state;
  }
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const setTopic = useCallback((topic: string) => {
    dispatch({ type: 'SET_TOPIC', payload: topic });
  }, []);

  const setQuestions = useCallback((questions: Question[]) => {
    dispatch({ type: 'SET_QUESTIONS', payload: questions });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const answerQuestion = useCallback((answerIndex: number) => {
    dispatch({ type: 'ANSWER_QUESTION', payload: answerIndex });
  }, []);

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' });
  }, []);

  const previousQuestion = useCallback(() => {
    dispatch({ type: 'PREVIOUS_QUESTION' });
  }, []);

  const completeQuiz = useCallback(() => {
    dispatch({ type: 'COMPLETE_QUIZ' });
  }, []);

  const resetQuiz = useCallback(() => {
    dispatch({ type: 'RESET_QUIZ' });
  }, []);

  const retakeQuiz = useCallback(() => {
    console.log('🔄 retakeQuiz function called');
    dispatch({ type: 'RETAKE_QUIZ' });
  }, []);

  const toggleReview = useCallback(() => {
    dispatch({ type: 'TOGGLE_REVIEW' });
  }, []);

  // IMPORTANT: Make sure retakeQuiz is included in the context value
  const contextValue: QuizContextType = React.useMemo(() => ({
    state,
    setTopic,
    setQuestions,
    setLoading,
    setError,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    completeQuiz,
    resetQuiz,
    retakeQuiz, // ← THIS MUST BE HERE
    toggleReview,
  }), [state, setTopic, setQuestions, setLoading, setError, answerQuestion, nextQuestion, previousQuestion, completeQuiz, resetQuiz, retakeQuiz, toggleReview]);

  return (
    <QuizContext.Provider value={contextValue}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = (): QuizContextType => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
