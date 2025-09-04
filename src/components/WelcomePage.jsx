// src/components/WelcomePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('');
  const [userName, setUserName] = useState('');

  const difficulties = [
    { value: 'easy', label: 'Easy', description: 'Simple questions for beginners' },
    { value: 'medium', label: 'Medium', description: 'Moderate difficulty questions' },
    { value: 'hard', label: 'Hard', description: 'Challenging questions for experts' }
  ];

  const startQuiz = () => {
    if (!difficulty) {
      alert('Please select a difficulty level');
      return;
    }
    
    localStorage.setItem('selectedDifficulty', difficulty);
    if (userName.trim()) {
      localStorage.setItem('userName', userName.trim());
    }
    
    navigate('/quiz');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 md:p-8 border border-green-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Quiz Challenge
          </h1>
          <p className="text-gray-600">
            Test your knowledge with our interactive quiz
          </p>
        </div>

     

        {/* Difficulty Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Select Difficulty Level
          </h2>
          
          <div className="space-y-3">
            {difficulties.map((diff) => (
              <button
                key={diff.value}
                onClick={() => setDifficulty(diff.value)}
                className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200
                  ${difficulty === diff.value 
                    ? 'border-teal-400 bg-green-50' 
                    : 'border-green-200 hover:border-green-300 hover:bg-green-25'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-semibold ${
                      difficulty === diff.value ? 'text-teal-700' : 'text-gray-800'
                    }`}>
                      {diff.label}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {diff.description}
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ${
                    difficulty === diff.value 
                      ? 'border-teal-400 bg-teal-400' 
                      : 'border-green-300'
                  }`}>
                    {difficulty === diff.value && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={startQuiz}
          disabled={!difficulty}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-200
            ${difficulty 
              ? 'bg-teal-500 hover:bg-teal-600 text-white shadow-md hover:shadow-lg' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          {difficulty ? `Start ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Quiz` : 'Select Difficulty to Start'}
        </button>

        {/* Quiz Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>10 Questions • 30 seconds per question</p>
          <p>Track your score and see detailed results</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
