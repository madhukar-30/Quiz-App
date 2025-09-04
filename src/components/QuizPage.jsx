// src/components/QuizPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuiz';
import Question from './Question';
import ProgressBar from './ProgressBar';
import Timer from './Timer';

const QuizPage = () => {
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState('');

  // Use the custom hook - destructure all returned values
  const {
    questions,
    currentQuestion,
    answers,
    isLoading,
    timeLeft,
    isLastQuestion,
    handleAnswer,
    nextQuestion,
    previousQuestion,
    skipQuestion,
    submitQuiz
  } = useQuiz();

  // Handle option selection
  const handleOptionSelect = (option) => {
    setSelectedAnswer(option);
  };

  // Handle next button click
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

  // Handle previous button click
  const handlePrevious = () => {
    setSelectedAnswer('');
    previousQuestion();
  };

  // Handle skip button click
  const handleSkip = () => {
    handleAnswer(null); // Record as skipped
    setSelectedAnswer('');
    
    if (isLastQuestion) {
      submitQuiz();
      navigate('/results');
    } else {
      nextQuestion();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 md:bg-gray-100">
      {/* Responsive Container */}
      <div className="max-w-4xl mx-auto px-4 py-4 md:py-8">
        
        {/* Progress Section - Responsive */}
        <div className="mb-4 md:mb-6">
          <ProgressBar current={currentQuestion} total={questions.length} />
          <Timer timeLeft={timeLeft} />
        </div>

        {/* Question Component */}
        <Question 
          question={questions[currentQuestion]?.question}
          options={questions[currentQuestion]?.options}
          selectedAnswer={selectedAnswer}
          onAnswer={handleOptionSelect}
        />

        {/* Navigation Buttons - Responsive */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            
            {/* Left side buttons - Stack on mobile */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className={`
                  px-4 py-2 md:px-6 md:py-2 rounded-lg font-medium transition-all
                  text-sm md:text-base w-full sm:w-auto
                  ${currentQuestion === 0 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                  }
                `}
              >
                <span className="hidden sm:inline">← Previous</span>
                <span className="sm:hidden">Previous</span>
              </button>

              <button
                onClick={handleSkip}
                className="px-4 py-2 md:px-6 md:py-2 bg-yellow-500 text-white rounded-lg 
                         font-medium hover:bg-yellow-600 transition-all text-sm md:text-base
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
                className={`
                  px-4 py-2 md:px-6 md:py-2 rounded-lg font-medium transition-all
                  text-sm md:text-base w-full sm:w-auto
                  ${!selectedAnswer && !isLastQuestion
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : isLastQuestion
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }
                `}
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

          {/* Answer Status - Responsive text */}
          <div className="mt-3 text-center text-xs md:text-sm text-gray-600">
            {selectedAnswer 
              ? `Selected: ${selectedAnswer.length > 30 ? selectedAnswer.substring(0, 30) + '...' : selectedAnswer}` 
              : 'Please select an answer or skip to continue'
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
