'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playCountdownSound } from '@/lib/sounds';

export function QuizCountdown({ onCountdownFinish }: { onCountdownFinish: () => void }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    playCountdownSound();
  }, []);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (count === 0) {
      const finishTimer = setTimeout(onCountdownFinish, 400); // give exit anim time
      return () => clearTimeout(finishTimer);
    }
  }, [count, onCountdownFinish]);

  return (
    <div 
      className="relative w-48 h-48 flex items-center justify-center cursor-pointer group"
      onClick={onCountdownFinish}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">Saltar</p>
      </div>
      <motion.svg
        className="absolute w-full h-full"
        viewBox="0 0 100 100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          className="stroke-current text-border"
          strokeWidth="10"
          fill="transparent"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          className="stroke-current text-primary"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray="283"
          strokeDashoffset={283}
          animate={{ strokeDashoffset: count > 0 ? (283 / 3) * (3 - count) : 283 }}
          transition={{ duration: 1, ease: 'linear' }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
        />
      </motion.svg>
      <AnimatePresence mode="wait">
        {count > 0 ? (
          <motion.div
            key={count}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="absolute font-title text-7xl font-extrabold text-on-surface"
          >
            {count}
          </motion.div>
        ) : (
          <motion.div
            key="go"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.2 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="absolute font-title text-5xl font-extrabold text-primary"
          >
            ¡Go!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
