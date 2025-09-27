import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import QuestionCard from '../components/QuestionCard';
import { aiService } from '../services/aiService';

const Results: React.FC = () => {
  const { state, resetQuiz, retakeQuiz, toggleReview } = useQuiz();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    if (!state.quizCompleted) {
      navigate('/');
      return;
    }

    const generateFeedback = async () => {
      const feedbackText = await aiService.generateFeedback(
        state.score,
        state.questions.length,
        state.selectedTopic
      );
      setFeedback(feedbackText);
    };

    generateFeedback();
  }, [state.quizCompleted, state.score, state.questions.length, state.selectedTopic, navigate]);

  const handleNewQuiz = () => {
    console.log('🆕 Starting completely new quiz');
    aiService.clearCache();
    resetQuiz();
    navigate('/');
  };

  const handleRetakeQuiz = () => {
    console.log('🔄 RETAKE BUTTON CLICKED');
    console.log('📊 Current state before retake:', {
      selectedTopic: state.selectedTopic,
      questionsCount: state.questions.length,
      quizCompleted: state.quizCompleted
    });

    // Call retake quiz function
    retakeQuiz();

    // Navigate with a small delay to ensure state is updated
    setTimeout(() => {
      console.log('🚀 Navigating to /quiz after retake');
      navigate('/quiz');
    }, 50);
  };

  const percentage = Math.round((state.score / state.questions.length) * 100);
  
  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = () => {
    if (percentage >= 80) return 'from-green-50 to-green-100';
    if (percentage >= 60) return 'from-yellow-50 to-yellow-100';
    return 'from-red-50 to-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`bg-gradient-to-br ${getScoreBgColor()} p-8 rounded-lg shadow-lg text-center mb-6`}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Quiz Completed! 🎉
            </h1>
            <div className={`text-6xl font-bold ${getScoreColor()} mb-4`}>
              {state.score}/{state.questions.length}
            </div>
            <div className={`text-2xl font-semibold ${getScoreColor()} mb-4`}>
              {percentage}%
            </div>
            <h2 className="text-xl text-gray-700 mb-4">
              Topic: {state.selectedTopic}
            </h2>
            {feedback && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 text-lg max-w-2xl mx-auto"
              >
                {feedback}
              </motion.p>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleReview}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            {state.showReview ? '🙈 Hide Review' : '👁️ Review Answers'}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRetakeQuiz}
            className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors duration-200"
          >
            🔄 Retake Quiz
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNewQuiz}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
          >
            ✨ New Quiz
          </motion.button>
        </motion.div>

        {state.showReview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Answer Review
            </h2>
            {state.questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="mb-2">
                  <span className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    Question {index + 1}
                  </span>
                  {state.answers[index] === question.correctIndex ? (
                    <span className="ml-2 text-green-600 font-semibold">✓ Correct</span>
                  ) : (
                    <span className="ml-2 text-red-600 font-semibold">✗ Incorrect</span>
                  )}
                </div>
                <QuestionCard
                  question={question}
                  selectedAnswer={state.answers[index]}
                  onAnswerSelect={() => {}}
                  showCorrectAnswer={true}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Results;
