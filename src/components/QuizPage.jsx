// src/components/QuizPage.jsx - COMPLETE UPDATED PAGE WITH BEST SKIP BUTTON COLOR
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuiz';
import Question from './Question';
import ProgressBar from './ProgressBar';
import Timer from './Timer';

const QuizPage = () => {
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const {
    questions,
    currentQuestion,
    answers,
    isLoading,
    timeLeft,
    isLastQuestion,
    difficulty,
    handleAnswer,
    nextQuestion,
    previousQuestion,
    skipQuestion,
    submitQuiz
  } = useQuiz();

  const handleOptionSelect = (option) => {
    setSelectedAnswer(option);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      handleAnswer(selectedAnswer);
    }
    setSelectedAnswer('');
    
    if (isLastQuestion) {
      submitQuiz();
      navigate('/results');
    } else {
      nextQuestion();
    }
  };

  const handlePrevious = () => {
    setSelectedAnswer('');
    previousQuestion();
  };

  const handleSkip = () => {
    handleAnswer(null);
    setSelectedAnswer('');
    
    if (isLastQuestion) {
      submitQuiz();
      navigate('/results');
    } else {
      nextQuestion();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading {difficulty} questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      <div className="max-w-4xl mx-auto px-4 py-4 md:py-8">
        
        {/* Difficulty Display */}
        <div className="mb-4 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-lg shadow-sm border border-green-200">
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

        {/* Progress Section */}
        <div className="mb-6 space-y-4">
          <ProgressBar current={currentQuestion} total={questions.length} />
          <div className="flex justify-center">
            <Timer timeLeft={timeLeft} />
          </div>
        </div>

        {/* Question Component */}
        <Question 
          question={questions[currentQuestion]?.question}
          options={questions[currentQuestion]?.options}
          selectedAnswer={selectedAnswer}
          onAnswer={handleOptionSelect}
        />

        {/* Navigation Buttons */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-green-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            
            {/* Left side buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className={`px-4 py-2 md:px-6 md:py-2 rounded-lg font-medium transition-all text-sm md:text-base w-full sm:w-auto ${
                  currentQuestion === 0 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                <span className="hidden sm:inline">← Previous</span>
                <span className="sm:hidden">Previous</span>
              </button>

              {/* Updated Skip Button - Dark Teal (Best Option) */}
              <button
                onClick={handleSkip}
                className="px-4 py-2 md:px-6 md:py-2 bg-teal-700 text-white rounded-lg 
                         font-medium hover:bg-teal-800 transition-all text-sm md:text-base
                         w-full sm:w-auto"
              >
                Skip
              </button>
            </div>

            {/* Right side button */}
            <div className="w-full sm:w-auto">
              <button
                onClick={handleNext}
                disabled={!selectedAnswer && !isLastQuestion}
                className={`px-4 py-2 md:px-6 md:py-2 rounded-lg font-medium transition-all text-sm md:text-base w-full sm:w-auto ${
                  !selectedAnswer && !isLastQuestion
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : isLastQuestion
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-teal-500 text-white hover:bg-teal-600'
                }`}
              >
                <span className="hidden sm:inline">
                  {isLastQuestion ? 'Submit Quiz' : 'Next →'}
                </span>
                <span className="sm:hidden">
                  {isLastQuestion ? 'Submit' : 'Next'}
                </span>
              </button>
            </div>
          </div>

          {/* Answer Status */}
          <div className="mt-3 text-center text-xs md:text-sm text-gray-600">
            {selectedAnswer 
              ? `Selected: ${selectedAnswer.length > 30 ? selectedAnswer.substring(0, 30) + '...' : selectedAnswer}` 
              : 'Please select an answer or skip to continue'
            }
          </div>
        </div>

        {/* Optional: Category Display if available */}
        {questions[currentQuestion]?.category && (
          <div className="mt-4 text-center">
            <span className="text-xs text-gray-500 bg-green-100 px-3 py-1 rounded-full border border-green-200">
              {questions[currentQuestion].category}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
