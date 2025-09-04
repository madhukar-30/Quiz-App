// src/hooks/useQuiz.js - FIXED VERSION
import { useState, useEffect, useRef } from 'react';

export const useQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(true);
  const [difficulty, setDifficulty] = useState('medium');
  
  // Add this ref to prevent multiple loads
  const questionsLoadedRef = useRef(false);
  const loadingRef = useRef(false);

  const isLastQuestion = currentQuestion === questions.length - 1;

  // Your existing getFallbackQuestions function (unchanged)
  const getFallbackQuestions = (difficulty) => {
    const fallbackQuestions = {
      easy: [
        {
          id: 0,
          question: "What is the capital of France?",
          options: ["London", "Berlin", "Paris", "Madrid"],
          correct: "Paris",
          difficulty: "easy",
          category: "Geography"
        },
        {
          id: 1,
          question: "What is 2 + 2?",
          options: ["3", "4", "5", "6"],
          correct: "4",
          difficulty: "easy",
          category: "Mathematics"
        },
        {
          id: 2,
          question: "What color do you get when you mix red and white?",
          options: ["Purple", "Orange", "Pink", "Yellow"],
          correct: "Pink",
          difficulty: "easy",
          category: "General Knowledge"
        },
        {
          id: 3,
          question: "How many days are there in a week?",
          options: ["5", "6", "7", "8"],
          correct: "7",
          difficulty: "easy",
          category: "General Knowledge"
        },
        {
          id: 4,
          question: "What do bees make?",
          options: ["Milk", "Honey", "Butter", "Cheese"],
          correct: "Honey",
          difficulty: "easy",
          category: "Nature"
        }
      ],
      medium: [
        {
          id: 0,
          question: "What is the largest planet in our solar system?",
          options: ["Earth", "Jupiter", "Saturn", "Neptune"],
          correct: "Jupiter",
          difficulty: "medium",
          category: "Science"
        },
        {
          id: 1,
          question: "Who wrote 'Romeo and Juliet'?",
          options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
          correct: "William Shakespeare",
          difficulty: "medium",
          category: "Literature"
        },
        {
          id: 2,
          question: "What is the chemical symbol for water?",
          options: ["H2O", "CO2", "NaCl", "O2"],
          correct: "H2O",
          difficulty: "medium",
          category: "Science"
        },
        {
          id: 3,
          question: "Which continent is known as the 'Dark Continent'?",
          options: ["Asia", "Africa", "South America", "Australia"],
          correct: "Africa",
          difficulty: "medium",
          category: "Geography"
        },
        {
          id: 4,
          question: "What is the square root of 64?",
          options: ["6", "7", "8", "9"],
          correct: "8",
          difficulty: "medium",
          category: "Mathematics"
        }
      ],
      hard: [
        {
          id: 0,
          question: "What is the chemical symbol for Gold?",
          options: ["Go", "Au", "Ag", "Gd"],
          correct: "Au",
          difficulty: "hard",
          category: "Science"
        },
        {
          id: 1,
          question: "In which year did World War II end?",
          options: ["1944", "1945", "1946", "1947"],
          correct: "1945",
          difficulty: "hard",
          category: "History"
        },
        {
          id: 2,
          question: "What is the capital of Kazakhstan?",
          options: ["Almaty", "Nur-Sultan", "Shymkent", "Aktobe"],
          correct: "Nur-Sultan",
          difficulty: "hard",
          category: "Geography"
        },
        {
          id: 3,
          question: "Who composed 'The Four Seasons'?",
          options: ["Bach", "Mozart", "Vivaldi", "Beethoven"],
          correct: "Vivaldi",
          difficulty: "hard",
          category: "Music"
        },
        {
          id: 4,
          question: "What is the smallest prime number?",
          options: ["0", "1", "2", "3"],
          correct: "2",
          difficulty: "hard",
          category: "Mathematics"
        }
      ]
    };

    return fallbackQuestions[difficulty] || fallbackQuestions.medium;
  };

  // Helper function to decode HTML entities
  const decodeHTMLEntities = (text) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  };

  // FIXED: Load questions only once - prevents overwrites
  useEffect(() => {
    const loadQuestions = async () => {
      // Prevent multiple simultaneous loads
      if (questionsLoadedRef.current || loadingRef.current) {
        console.log('⏭️ Questions already loaded or loading, skipping...');
        return;
      }

      try {
        loadingRef.current = true;
        setIsLoading(true);
        
        // Get selected difficulty from localStorage
        const selectedDifficulty = localStorage.getItem('selectedDifficulty') || 'medium';
        setDifficulty(selectedDifficulty);
        
        console.log(`🎯 Loading ${selectedDifficulty} questions from API...`);
        
        // Build API URL with difficulty parameter
        const apiUrl = `https://opentdb.com/api.php?amount=10&type=multiple&difficulty=${selectedDifficulty}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        // Check if API returned valid data
        if (data.response_code === 0 && data.results && data.results.length > 0) {
          const formattedQuestions = data.results.map((q, index) => ({
            id: index,
            question: decodeHTMLEntities(q.question),
            options: [...q.incorrect_answers, q.correct_answer]
              .map(option => decodeHTMLEntities(option))
              .sort(() => Math.random() - 0.5),
            correct: decodeHTMLEntities(q.correct_answer),
            difficulty: q.difficulty,
            category: q.category
          }));
          
          setQuestions(formattedQuestions);
          setAnswers(new Array(formattedQuestions.length).fill(null));
          questionsLoadedRef.current = true; // Mark as successfully loaded
          console.log(`✅ Successfully loaded ${formattedQuestions.length} ${selectedDifficulty} questions from API`);
        } else {
          // API didn't return proper data, use fallback
          console.warn(`⚠️ API Response Code: ${data.response_code}, using fallback questions`);
          const fallbackQuestions = getFallbackQuestions(selectedDifficulty);
          setQuestions(fallbackQuestions);
          setAnswers(new Array(fallbackQuestions.length).fill(null));
          questionsLoadedRef.current = true; // Mark as loaded with fallback
        }
      } catch (error) {
        // Network error or API failure - use fallback questions
        console.error('📡 API Error, using fallback questions:', error.message);
        const selectedDifficulty = localStorage.getItem('selectedDifficulty') || 'medium';
        const fallbackQuestions = getFallbackQuestions(selectedDifficulty);
        setQuestions(fallbackQuestions);
        setAnswers(new Array(fallbackQuestions.length).fill(null));
        questionsLoadedRef.current = true; // Mark as loaded with fallback
      } finally {
        loadingRef.current = false;
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []); // Empty dependency array - only run once

  // Rest of your existing functions (timer, navigation, etc.) remain unchanged
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
  }, [timeLeft, timerActive, isLastQuestion]);

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

  const submitQuiz = () => {
    setTimerActive(false);
    
    const userName = localStorage.getItem('userName') || 'Anonymous';
    
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
      answers: finalAnswers,
      difficulty: difficulty,
      userName: userName,
      completedAt: new Date().toISOString()
    };
    
    localStorage.setItem('quizResults', JSON.stringify(results));
    setScore(finalScore);
  };

  return {
    questions,
    currentQuestion,
    answers,
    score,
    isLoading,
    timeLeft,
    isLastQuestion,
    difficulty,
    timerActive,
    nextQuestion,
    previousQuestion,
    handleAnswer,
    skipQuestion,
    submitQuiz
  };
};
