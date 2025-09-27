import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { aiService } from '../services/aiService';
import LoaderSpinner from '../components/LoaderSpinner';

const QuizLoader: React.FC = () => {
  const { state, setQuestions, setLoading, setError } = useQuiz();
  const navigate = useNavigate();
  const [loadingTime, setLoadingTime] = useState(0);

  // Memoize the quiz generation function
  const generateQuiz = useCallback(async () => {
    if (!state.selectedTopic) {
      navigate('/');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Starting AI quiz generation for:', state.selectedTopic);
      const startTime = Date.now();
      
      const questions = await aiService.generateQuizQuestions(state.selectedTopic);
      
      const endTime = Date.now();
      console.log(`⚡ AI generation completed in ${endTime - startTime}ms`);
      
      setQuestions(questions);
      
      // Small delay for better UX
      setTimeout(() => {
        navigate('/quiz');
      }, 800);
      
    } catch (error: any) {
      console.error('❌ AI quiz generation failed:', error);
      setError(error.message || 'Failed to generate AI quiz. Please check your connection and try again.');
    }
  }, [state.selectedTopic, setLoading, setError, setQuestions, navigate]);

  // Effect for quiz generation
  useEffect(() => {
    let isMounted = true;
    let timer: NodeJS.Timeout;

    if (state.selectedTopic && !state.questions.length && !state.isLoading) {
      // Start timer
      timer = setInterval(() => {
        setLoadingTime(prev => prev + 1);
      }, 1000);

      // Generate AI quiz
      generateQuiz();
    }

    // Cleanup function
    return () => {
      isMounted = false;
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [state.selectedTopic, generateQuiz]);

  // Reset loading time when component mounts
  useEffect(() => {
    setLoadingTime(0);
  }, []);

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md mx-4">
          <div className="text-6xl mb-4">🤖❌</div>
          <div className="text-red-600 text-xl font-semibold mb-4">
            AI Quiz Generation Failed
          </div>
          <div className="text-gray-600 mb-6 text-sm">
            {state.error}
          </div>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              🔄 Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              🏠 Choose Different Topic
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <LoaderSpinner />
      
      {/* AI Progress indicator */}
      {loadingTime > 5 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500/90 to-purple-600/90 backdrop-blur-sm text-white rounded-2xl shadow-xl p-6 text-center">
          <div className="flex items-center space-x-3">
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
            <div>
              <div className="font-semibold">🤖 AI is crafting your quiz</div>
              <div className="text-sm opacity-90">
                Generating personalized questions... ({loadingTime}s)
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Extended loading message */}
      {loadingTime > 15 && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-yellow-100/95 border border-yellow-300 text-yellow-800 px-6 py-3 rounded-2xl shadow-lg text-center">
          <div className="font-medium">🧠 AI is working extra hard!</div>
          <div className="text-sm">Creating high-quality questions for {state.selectedTopic}</div>
        </div>
      )}
    </div>
  );
};

export default QuizLoader;
