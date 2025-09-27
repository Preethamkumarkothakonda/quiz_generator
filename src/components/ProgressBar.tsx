import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      
      {/* Progress Text */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>Progress</span>
        <span className="font-medium">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
