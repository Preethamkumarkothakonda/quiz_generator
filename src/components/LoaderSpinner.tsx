import React from 'react';
import { motion } from 'framer-motion';
import { useQuiz } from '../context/QuizContext';

const LoaderSpinner: React.FC = () => {
  const { state } = useQuiz();

  // Brain icon SVG component
  const BrainIcon = () => (
    <svg 
      width="48" 
      height="48" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="text-white"
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
      <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
      <path d="M6 18a4 4 0 0 1-1.967-.516"/>
      <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
    </svg>
  );

  // Star decoration
  const StarDecoration = () => (
    <motion.div
      animate={{ 
        rotate: [0, 360],
        scale: [1, 1.2, 1]
      }}
      transition={{ 
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute top-20 right-20 text-yellow-400 text-3xl"
    >
      ⭐
    </motion.div>
  );

  // Animated dots
  const LoadingDots = () => (
    <div className="flex space-x-1 justify-center mb-6">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut"
          }}
          className="w-3 h-3 bg-blue-600 rounded-full"
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background decorations */}
      <StarDecoration />
      
      {/* Floating background elements */}
      <motion.div
        animate={{ 
          y: [-10, 10, -10],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-40 left-20 w-16 h-16 bg-purple-200 rounded-full opacity-30"
      />
      
      <motion.div
        animate={{ 
          y: [10, -10, 10],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-40 right-32 w-12 h-12 bg-blue-200 rounded-full opacity-20"
      />

      {/* Main content - Centered */}
      <div className="flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center z-10"
        >
          {/* Brain icon with circular background and shadow - PERFECTLY CENTERED */}
          <div className="relative mx-auto mb-8 flex items-center justify-center w-24 h-24">
            {/* Pulsing ring shadow - positioned to match brain icon exactly */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.2, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute w-24 h-24 bg-blue-500 rounded-full opacity-30"
            />
            
            {/* Brain icon with rotation animation */}
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10"
            >
              {/* Circular background */}
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                <BrainIcon />
              </div>
            </motion.div>
          </div>

          {/* Main title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          >
            Generating Your Quiz
          </motion.h1>

          {/* Subtitle with topic */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <p className="text-lg text-gray-600 mb-1">
              Our AI is crafting personalized questions about{' '}
              <span className="font-semibold text-blue-600">
                {state.selectedTopic || 'your topic'}
              </span>
            </p>
          </motion.div>

          {/* Animated loading dots */}
          <LoadingDots />

          {/* Bottom message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-500 text-sm"
          >
            This may take a few moments...
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom floating elements */}
      <motion.div
        animate={{ 
          rotate: [0, 180, 360],
          scale: [1, 0.8, 1]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-10 left-10 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20"
      />
      
      <motion.div
        animate={{ 
          x: [0, 20, 0],
          y: [0, -20, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-32 right-40 w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-25"
      />
    </div>
  );
};

export default LoaderSpinner;
