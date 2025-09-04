// src/components/Question.jsx
import React from 'react';

const Question = ({ question, options, selectedAnswer, onAnswer }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 border border-green-200">
      <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4 md:mb-6 text-gray-800 leading-relaxed">
        {question}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {options?.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            className={`p-3 md:p-4 text-left border-2 rounded-lg transition-all duration-200 text-sm md:text-base hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-300 ${
              selectedAnswer === option 
                ? 'border-teal-400 bg-green-50 text-teal-700' 
                : 'border-green-300 hover:border-teal-300 hover:bg-green-25'
            }`}
          >
            <span className="font-semibold text-teal-600 mr-2">
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
