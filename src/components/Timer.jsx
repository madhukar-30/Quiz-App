// src/components/Timer.jsx
import React, { useEffect } from 'react';

const Timer = ({ timeLeft, onTimeUp }) => {
  useEffect(() => {
    if (timeLeft === 0 && onTimeUp) {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  return (
    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm md:text-base font-bold transition-all ${
      timeLeft <= 10 
        ? 'bg-red-100 text-red-600 animate-pulse' 
        : timeLeft <= 20
          ? 'bg-yellow-100 text-yellow-600'
          : 'bg-green-100 text-green-600'
    }`}>
      <span className="font-mono">{timeLeft}s</span>
    </div>
  );
};

export default Timer;
