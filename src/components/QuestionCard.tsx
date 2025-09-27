import React from 'react';
import { motion } from 'framer-motion';
import { Question } from '../types';
import { CheckCircle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number;
  onAnswerSelect: (answerIndex: number) => void;
  showCorrectAnswer?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  showCorrectAnswer = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
    >
      {/* Question */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = showCorrectAnswer && index === question.correctIndex;
          const isWrong = showCorrectAnswer && isSelected && index !== question.correctIndex;

          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onAnswerSelect(index)}
              disabled={showCorrectAnswer}
              className={`
                w-full p-4 rounded-xl text-left transition-all duration-200 border-2
                ${isSelected && !showCorrectAnswer
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : isCorrect
                  ? 'border-green-500 bg-green-50 text-green-900'
                  : isWrong
                  ? 'border-red-500 bg-red-50 text-red-900'
                  : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                }
                ${showCorrectAnswer ? 'cursor-default' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  ${isSelected && !showCorrectAnswer
                    ? 'bg-blue-500 text-white'
                    : isCorrect
                    ? 'bg-green-500 text-white'
                    : isWrong
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {showCorrectAnswer && isCorrect ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </div>
                <span className="text-base md:text-lg">{option}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default QuestionCard;
