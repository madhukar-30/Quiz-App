// src/hooks/useQuiz.js
import { useState, useEffect } from 'react';

export const useQuiz = () => {
  // All state variables
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(true);

  const isLastQuestion = currentQuestion === questions.length - 1;

  // Load questions from API
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
        const data = await response.json();
        
        const formattedQuestions = data.results.map((q, index) => ({
          id: index,
          question: decodeHTMLEntities(q.question),
          options: [...q.incorrect_answers, q.correct_answer]
            .map(option => decodeHTMLEntities(option))
            .sort(() => Math.random() - 0.5),
          correct: decodeHTMLEntities(q.correct_answer),
          difficulty: q.difficulty
        }));
        
        setQuestions(formattedQuestions);
        setAnswers(new Array(formattedQuestions.length).fill(null));
      } catch (error) {
        console.error('Failed to load questions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // Timer logic
  useEffect(() => {
    if (!timerActive || timeLeft === 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          skipQuestion();
          if (!isLastQuestion) {
            nextQuestion();
          }
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, timerActive]);

  // Navigation functions
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTimeLeft(30);
      setTimerActive(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setTimeLeft(30);
      setTimerActive(true);
    }
  };

  const handleAnswer = (selectedAnswer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      questionId: currentQuestion,
      selected: selectedAnswer,
      correct: questions[currentQuestion].correct,
      isCorrect: selectedAnswer === questions[currentQuestion].correct,
      isSkipped: selectedAnswer === null
    };
    setAnswers(newAnswers);

    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(prev => prev + 1);
    }

    setTimerActive(false);
  };

  const skipQuestion = () => {
    handleAnswer(null);
  };

  // Submit quiz function - THIS is inside the useQuiz hook
  const submitQuiz = () => {
    setTimerActive(false);
    
    const finalAnswers = answers.map((answer, index) => ({
      question: questions[index]?.question,
      selected: answer?.selected || null,
      correct: questions[index]?.correct,
      isCorrect: answer?.isCorrect || false,
      isSkipped: answer?.selected === null
    }));
    
    const finalScore = finalAnswers.filter(answer => answer.isCorrect).length;
    
    const results = {
      score: finalScore,
      totalQuestions: questions.length,
      answers: finalAnswers
    };
    
    localStorage.setItem('quizResults', JSON.stringify(results));
    setScore(finalScore);
  };

  // Helper function
  const decodeHTMLEntities = (text) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  };

  // Return all state and functions
  return {
    questions,
    currentQuestion,
    answers,
    score,
    isLoading,
    timeLeft,
    isLastQuestion,
    nextQuestion,
    previousQuestion,
    handleAnswer,
    skipQuestion,
    submitQuiz  // ← This function is returned by the hook
  };
};
