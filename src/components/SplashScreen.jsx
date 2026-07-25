import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onFinish(), 400);
          return 100;
        }
        return prev + 5;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-cyan-950 text-white select-none overflow-hidden"
    >
      {/* Decorative backdrop glow circles */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-blue-600/15 blur-[90px] pointer-events-none" />

      {/* Animated Tooth Logo Icon */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mb-6"
      >
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-cyan-400 p-[3px] shadow-2xl shadow-cyan-500/30 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center relative overflow-hidden">
            <svg className="w-16 h-16 text-cyan-400 drop-shadow-[0_0_15px_rgba(0,194,203,0.6)]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C9.5 2 7.5 3.5 6.5 5.5C5.5 7.5 5 10 5.5 12.5C6 15 7 17.5 8 19.5C8.5 20.5 9.5 22 10.5 22C11.5 22 11.8 20.5 12 19C12.2 20.5 12.5 22 13.5 22C14.5 22 15.5 20.5 16 19.5C17 17.5 18 15 18.5 12.5C19 10 18.5 7.5 17.5 5.5C16.5 3.5 14.5 2 12 2Z" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Brand Title & Subtitle */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-extrabold tracking-wider bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent mb-2">
          АКАК ТИШ
        </h1>
        <p className="text-sm font-medium text-cyan-200/80 tracking-widest uppercase mb-8">
          Современная стоматология
        </p>
      </motion.div>

      {/* Progress Bar */}
      <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden relative shadow-inner">
        <motion.div 
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Apple-style footer badge */}
      <span className="absolute bottom-8 text-[11px] text-slate-500 font-medium tracking-wide">
        Premium Dental Experience • 2026
      </span>
    </motion.div>
  );
}
