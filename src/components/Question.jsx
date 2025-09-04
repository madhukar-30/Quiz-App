// src/components/Question.jsx
import React from 'react';

const Question = ({ question, options, selectedAnswer, onAnswer }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
      {/* Question Text - Responsive typography */}
      <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4 md:mb-6 text-gray-800 leading-relaxed">
        {question}
      </h2>
      
      {/* Options Grid - Responsive layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            className={`
              p-3 md:p-4 text-left border-2 rounded-lg transition-all duration-200
              text-sm md:text-base hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300
              ${selectedAnswer === option 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }
            `}
          >
            <span className="font-semibold text-blue-600 mr-2">
              {String.fromCharCode(65 + index)}.
            </span>
            <span className="break-words">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Question;
