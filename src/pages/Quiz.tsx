import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Quiz: React.FC = () => {
  const {
    state,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    completeQuiz
  } = useQuiz();
  const navigate = useNavigate();
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    answerQuestion(answerIndex);
  };

  const handleNext = () => {
    if (state.currentQuestionIndex < state.questions.length - 1) {
      nextQuestion();
    } else {
      // Show completion popup instead of directly completing
      setShowCompletionPopup(true);
    }
  };

  const handlePrevious = () => {
    previousQuestion();
  };

  const handleCompleteQuiz = () => {
    setShowCompletionPopup(true);
  };

  const confirmSubmitQuiz = () => {
    completeQuiz();
    navigate('/results');
  };

  // If no questions, show error instead of redirecting
  if (!state.questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤔</div>
          <div className="text-xl text-gray-600 mb-4">No quiz questions available</div>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = state.questions[state.currentQuestionIndex];
  const currentAnswer = state.answers[state.currentQuestionIndex];
  const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1;
  
  // Calculate attempted and not attempted counts
  const attemptedCount = state.answers.filter(answer => answer !== -1).length;
  const notAttemptedCount = state.questions.length - attemptedCount;
  const attemptedQuestions = state.answers.map((answer, index) => ({ index: index + 1, attempted: answer !== -1 }));

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-3xl mx-auto">
          {/* Fixed Header - Prevent Overlapping */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            {/* Topic Title */}
            <h1 className="text-2xl font-bold text-gray-800 mb-4 break-words">
              {state.selectedTopic}
            </h1>
            
            {/* Progress Bar */}
            <ProgressBar 
              current={state.currentQuestionIndex} 
              total={state.questions.length} 
            />
            
            {/* Attempt Status */}
            <div className="flex items-center justify-between mt-3 text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Attempted: {attemptedCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span className="text-gray-600">Not Attempted: {notAttemptedCount}</span>
                </div>
              </div>
              <div className="text-gray-500">
                Question {state.currentQuestionIndex + 1} of {state.questions.length}
              </div>
            </div>
          </motion.div>

          {/* Question Review Panel */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border p-4 mb-6"
          >
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Question Overview</h3>
            <div className="flex flex-wrap gap-2">
              {state.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    // Allow direct navigation to any question
                    const diff = index - state.currentQuestionIndex;
                    if (diff > 0) {
                      for (let i = 0; i < diff; i++) {
                        nextQuestion();
                      }
                    } else if (diff < 0) {
                      for (let i = 0; i < Math.abs(diff); i++) {
                        previousQuestion();
                      }
                    }
                  }}
                  className={`
                    w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-200
                    ${index === state.currentQuestionIndex
                      ? 'bg-blue-600 text-white ring-2 ring-blue-200'
                      : state.answers[index] !== -1
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }
                  `}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentQuestionIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionCard
                question={currentQuestion}
                selectedAnswer={currentAnswer}
                onAnswerSelect={handleAnswerSelect}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-between mt-6"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrevious}
              disabled={state.currentQuestionIndex === 0}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Previous
            </motion.button>

            {/* Skip/Navigation Info */}
            <div className="flex flex-col items-center justify-center space-y-1">
              {currentAnswer === -1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200"
                >
                  You can skip and come back later
                </motion.div>
              )}
              <div className="text-xs text-gray-500">
                {currentAnswer !== -1 ? '✓ Answered' : '○ Not Answered'}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200"
            >
              {isLastQuestion ? 'Complete Quiz' : 'Next Question'}
            </motion.button>
          </motion.div>

          {/* Summary Panel at Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800">Quiz Progress</h4>
                <p className="text-sm text-gray-600">
                  You can navigate freely between questions and submit when ready
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  {Math.round((attemptedCount / state.questions.length) * 100)}%
                </div>
                <div className="text-xs text-gray-500">Complete</div>
              </div>
            </div>
            
            {/* Complete Quiz Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCompleteQuiz}
              className="mt-3 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              🎯 Complete Quiz
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Completion Confirmation Popup */}
      <AnimatePresence>
        {showCompletionPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCompletionPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Submit Quiz?</h3>
                      <p className="text-sm text-gray-600">Review your answers before submitting</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCompletionPopup(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Stats Summary */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-700">{attemptedCount}</div>
                    <div className="text-sm text-green-600 font-medium">Attempted</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-orange-700">{notAttemptedCount}</div>
                    <div className="text-sm text-orange-600 font-medium">Not Attempted</div>
                  </div>
                </div>

                {/* Question Status Grid */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Question Status</h4>
                  <div className="grid grid-cols-5 gap-3">
                    {attemptedQuestions.map((q) => (
                      <div
                        key={q.index}
                        className={`
                          w-full h-12 rounded-lg flex items-center justify-center text-sm font-semibold transition-all
                          ${q.attempted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-600'
                          }
                        `}
                      >
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            {q.attempted ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <AlertCircle className="w-3 h-3" />
                            )}
                          </div>
                          <div className="text-xs">{q.index}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Warning for unattempted questions */}
                {notAttemptedCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6"
                  >
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h5 className="font-medium text-amber-800">Incomplete Quiz</h5>
                        <p className="text-sm text-amber-700 mt-1">
                          You have {notAttemptedCount} unanswered question{notAttemptedCount > 1 ? 's' : ''}. 
                          You can still submit, but consider reviewing them first.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Completion message for all answered */}
                {notAttemptedCount === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6"
                  >
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h5 className="font-medium text-green-800">All Questions Answered!</h5>
                        <p className="text-sm text-green-700 mt-1">
                          Great job! You've answered all questions. Ready to submit?
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Completion Progress</span>
                    <span className="text-sm text-gray-600">
                      {Math.round((attemptedCount / state.questions.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(attemptedCount / state.questions.length) * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCompletionPopup(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Review More
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmSubmitQuiz}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 transition-all shadow-lg"
                  >
                    Submit Quiz 🚀
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Quiz;
