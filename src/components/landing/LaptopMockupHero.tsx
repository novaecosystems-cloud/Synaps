'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Sparkles, ShieldCheck, Zap, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export interface LaptopMockupHeroProps {
  imageSrc?: string;
  imageAlt?: string;
  onCtaClick?: () => void;
}

export function LaptopMockupHero({
  imageSrc = '/mockups/causarix_laptop_dashboard_hero.png',
  imageAlt = 'Causarix Enterprise Causal Decision OS & Boardroom Console Interface',
  onCtaClick,
}: LaptopMockupHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Utomic-style subtle 3D tilt and scale physics
  const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [6, 0, -4]);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.96, 1, 0.98]);
  const y = useTransform(smoothProgress, [0, 0.5, 1], [30, 0, -20]);

  return (
    <div ref={containerRef} className="relative w-full max-w-6xl mx-auto pt-8 pb-16 px-4 sm:px-6 z-20">
      {/* ── AMBIENT RADIAL GLOW (UTOMIC AESTHETIC) ─────────────────────────── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-pink-600/15 to-cyan-500/20 blur-[100px] pointer-events-none rounded-full" />

      {/* ── 3D PERSPECTIVE LAPTOP CONTAINER ─────────────────────────────────── */}
      <motion.div
        style={{
          rotateX,
          scale,
          y,
          transformPerspective: 1200,
        }}
        className="relative mx-auto flex flex-col items-center select-none"
      >
        {/* LAPTOP SCREEN (LID) */}
        <div className="relative w-full aspect-[16/10] max-h-[620px] rounded-2xl sm:rounded-3xl bg-[#0d0d11] p-2.5 sm:p-4 border border-white/20 shadow-[0_25px_70px_rgba(0,0,0,0.6)] ring-1 ring-black/40 overflow-hidden group">
          {/* Top Bezel Notch & Camera */}
          <div className="absolute top-1.5 sm:top-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/80 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="w-1 h-1 rounded-full bg-zinc-600" />
          </div>

          {/* INNER DISPLAY SCREEN */}
          <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#0a0a0f] border border-white/10">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-full object-cover object-left-top transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              loading="eager"
            />

            {/* Subtle Screen Glare Glass Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none" />

            {/* Interactive Live Overlay Badges (Utomic Micro-Pills) */}
            <div className="absolute bottom-4 left-4 z-30 hidden sm:flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-[#0a0a0f]/90 backdrop-blur-md border border-indigo-500/30 text-indigo-300 font-mono text-[11px] font-bold flex items-center gap-1.5 shadow-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SHA-256 Verified · Delaware DGCL § 141</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-[#0a0a0f]/90 backdrop-blur-md border border-pink-500/30 text-pink-300 font-mono text-[11px] font-bold flex items-center gap-1.5 shadow-lg">
                <Zap className="w-3.5 h-3.5 text-pink-400" />
                <span>0.00% Math Drift (Pyodide WASM)</span>
              </div>
            </div>

            {/* 1-Click Interactive Demo CTA Button inside Mockup */}
            <div className="absolute bottom-4 right-4 z-30">
              <Link
                href="/demo"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xl hover:scale-105"
              >
                <span>Launch 60s Sandbox</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* LAPTOP BASE CHASSIS (KEYBOARD & TRACKPAD LIP) */}
        <div className="relative w-[104%] h-3.5 sm:h-5 rounded-b-2xl bg-gradient-to-b from-[#22222a] to-[#121217] border-t border-white/20 border-b border-black/80 shadow-2xl flex items-start justify-center">
          {/* Centered Thumb Notch Indent */}
          <div className="w-24 sm:w-32 h-1 sm:h-1.5 rounded-b-md bg-[#0a0a0e] border-t border-black/40" />
        </div>

        {/* Laptop Bottom Drop Shadow Glow */}
        <div className="w-[85%] h-6 sm:h-8 bg-black/60 blur-xl rounded-full -mt-2 pointer-events-none" />
      </motion.div>
    </div>
  );
}

export default LaptopMockupHero;
