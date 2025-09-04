// src/components/ResultsPage.jsx - SIMPLIFIED SCORE DISPLAY
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResultsPage = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);

  useEffect(() => {
    const quizResults = JSON.parse(localStorage.getItem('quizResults') || '{}');
    if (!quizResults.answers) {
      navigate('/');
      return;
    }
    setResults(quizResults);
  }, [navigate]);

  const restartQuiz = () => {
    localStorage.removeItem('quizResults');
    localStorage.removeItem('selectedDifficulty');
    localStorage.removeItem('userName');
    navigate('/');
  };

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const { score, totalQuestions, answers, difficulty, userName } = results;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Quiz Complete!
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Great job, <span className="font-semibold">{userName || 'Anonymous'}</span>!
          </p>
        </div>

        {/* Score Card - Simplified */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6 border border-green-200">
          <div className="text-center mb-6">
            {/* Only Main Score Count */}
            <div className="text-5xl md:text-6xl font-bold text-teal-600 mb-4">
              You scored {score}/{totalQuestions}
            </div>

            {/* Difficulty Display */}
            <div className="inline-flex items-center px-4 py-2 rounded-lg border border-green-200">
              <span className="text-sm text-gray-600 mr-2">Difficulty:</span>
              <span className={`font-semibold capitalize px-3 py-1 rounded text-sm ${
                difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                difficulty === 'medium' ? 'bg-teal-100 text-teal-700' : 
                'bg-blue-100 text-blue-700'
              }`}>
                {difficulty}
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {answers.filter(a => a.isCorrect).length}
              </div>
              <div className="text-sm text-green-700">Correct</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">
                {answers.filter(a => !a.isCorrect && !a.isSkipped).length}
              </div>
              <div className="text-sm text-red-700">Incorrect</div>
            </div>
            <div className="text-center p-3 bg-teal-50 rounded-lg border border-teal-200">
              <div className="text-2xl font-bold text-teal-600">
                {answers.filter(a => a.isSkipped).length}
              </div>
              <div className="text-sm text-teal-700">Skipped</div>
            </div>
            <div className="text-center p-3 bg-green-100 rounded-lg border border-green-300">
              <div className="text-2xl font-bold text-green-700">
                {totalQuestions}
              </div>
              <div className="text-sm text-green-800">Total</div>
            </div>
          </div>
        </div>

        {/* Answer Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6 border border-green-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Answer Summary</h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {answers.map((answer, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  answer.isCorrect 
                    ? 'border-green-400 bg-green-50' 
                    : answer.isSkipped
                      ? 'border-teal-400 bg-teal-50'
                      : 'border-red-400 bg-red-50'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-800">Question {index + 1}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    answer.isCorrect 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : answer.isSkipped
                        ? 'bg-teal-100 text-teal-700 border border-teal-200'
                        : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {answer.isCorrect ? 'Correct' : answer.isSkipped ? 'Skipped' : 'Incorrect'}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-3 text-sm md:text-base">{answer.question}</p>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Your Answer: </span>
                    <span className={
                      answer.isSkipped 
                        ? 'text-teal-600 italic' 
                        : answer.isCorrect 
                          ? 'text-green-600' 
                          : 'text-red-600'
                    }>
                      {answer.isSkipped ? 'No answer selected' : answer.selected}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Correct Answer: </span>
                    <span className="text-green-600 font-medium">{answer.correct}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Restart Button */}
        <div className="text-center">
          <button
            onClick={restartQuiz}
            className="px-8 py-3 bg-teal-500 text-white text-lg font-semibold rounded-lg 
                     hover:bg-teal-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Take Another Quiz
          </button>
          <p className="mt-3 text-sm text-gray-500">
            Choose a different difficulty level or try again!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
