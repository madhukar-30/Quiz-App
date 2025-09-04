// src/components/ResultsPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResultsPage = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Get results from localStorage 
    const quizResults = JSON.parse(localStorage.getItem('quizResults') || '{}');
    if (!quizResults.answers) {
      navigate('/quiz');
      return;
    }
    setResults(quizResults);
  }, [navigate]);

  const restartQuiz = () => {
    // Clear results and go back to quiz
    localStorage.removeItem('quizResults');
    navigate('/quiz');
  };

  if (!results) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const { score, totalQuestions, answers } = results;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Final Score - As Required */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Quiz Complete!</h1>
          <div className="text-4xl font-bold text-blue-600 mb-2">
            You scored {score}/{totalQuestions}
          </div>
          <p className="text-gray-600">
            {Math.round((score / totalQuestions) * 100)}% correct
          </p>
        </div>

        {/* Summary of Answers - As Required */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Answer Summary</h2>
          
          <div className="space-y-4">
            {answers.map((answer, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  answer.isCorrect 
                    ? 'border-green-500 bg-green-50' 
                    : answer.isSkipped
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-red-500 bg-red-50'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Question {index + 1}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    answer.isCorrect 
                      ? 'bg-green-200 text-green-800' 
                      : answer.isSkipped
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-red-200 text-red-800'
                  }`}>
                    {answer.isCorrect ? 'Correct' : answer.isSkipped ? 'Skipped' : 'Incorrect'}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-3">{answer.question}</p>
                
                {/* User's Selected Option vs Correct Option - As Required */}
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Your Answer: </span>
                    <span className={
                      answer.isSkipped 
                        ? 'text-yellow-600' 
                        : answer.isCorrect 
                          ? 'text-green-600' 
                          : 'text-red-600'
                    }>
                      {answer.isSkipped ? 'No answer selected' : answer.selected}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Correct Answer: </span>
                    <span className="text-green-600">{answer.correct}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Restart Quiz Action - As Required */}
        <div className="text-center">
          <button
            onClick={restartQuiz}
            className="px-8 py-3 bg-blue-500 text-white text-lg font-medium rounded-lg 
                     hover:bg-blue-600 transition-all duration-200"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
