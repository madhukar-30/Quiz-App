// src/components/ProgressBar.jsx
import React from 'react';

const ProgressBar = ({ current, total }) => {
  const percentage = ((current + 1) / total) * 100;
  
  return (
    <div>
      <div className="flex justify-between text-xs md:text-sm text-gray-600 mb-2">
        <span>Question {current + 1} of {total}</span>
        <span className="hidden sm:inline">Progress: {Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-green-200 rounded-full h-2 md:h-3">
        <div 
          className="bg-teal-500 h-2 md:h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
