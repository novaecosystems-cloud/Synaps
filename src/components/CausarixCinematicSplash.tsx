"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import { ArrowRight } from 'lucide-react';

export function CausarixCinematicSplash({
  onComplete,
  minDuration = 2200
}: {
  onComplete?: () => void;
  minDuration?: number;
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState("INITIALIZING CAUSARIX SCM ENGINE...");

  useEffect(() => {
    const t1 = setTimeout(() => {
      setProgress(45);
      setStatusText("LOADING 10-AGENT BOARDROOM QUORUM...");
    }, 600);

    const t2 = setTimeout(() => {
      setProgress(80);
      setStatusText("VERIFYING CAUSAL GRAPH & SCM DO-CALCULUS...");
    }, 1300);

    const t3 = setTimeout(() => {
      setProgress(100);
      setStatusText("SOVEREIGN DECISION OS READY");
    }, 1900);

    const t4 = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, minDuration);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [minDuration, onComplete]);

  const handleSkip = () => {
    setIsVisible(false);
    onComplete?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden select-none font-sans"
        >
          {/* Background Three.js Shader Animation */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-85">
            <ShaderAnimation />
          </div>

          {/* Vignette Overlay */}
          <div className="absolute inset-0 z-10 bg-radial-vignette pointer-events-none bg-black/40" />

          {/* Central Logo & Branding Content */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-xl space-y-6">
            {/* 3D Logo Image with Cyan Glow */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1.5 bg-[#0D111A]/80 border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.4)] flex items-center justify-center backdrop-blur-md"
            >
              <img
                src="/synaps_logo.webp"
                alt="Causarix"
                width={112}
                height={112}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-contain rounded-2xl drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]"
              />
            </motion.div>

            {/* Typography */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="space-y-2"
            >
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase font-sans drop-shadow-[0_0_35px_rgba(6,182,212,0.5)]">
                CAUSARIX
              </h1>
              <p className="text-xs sm:text-sm font-mono tracking-[0.25em] text-cyan-300 font-bold uppercase drop-shadow-md">
                ADVANCED CAUSAL AI · TECHNOLOGIES
              </p>
            </motion.div>

            {/* Animated Loading Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="w-72 sm:w-80 space-y-2 pt-4"
            >
              <div className="w-full h-1.5 bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span className="text-cyan-400 font-bold animate-pulse">{statusText}</span>
                <span>{progress}%</span>
              </div>
            </motion.div>
          </div>

          {/* Skip Button in Bottom Right */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={handleSkip}
            className="absolute bottom-6 right-6 z-30 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md"
          >
            <span>Skip Intro</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CausarixCinematicSplash;
