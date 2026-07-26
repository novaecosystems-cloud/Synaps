"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Play, ArrowRight, X, BrainCircuit, ShieldCheck, Database, Zap } from 'lucide-react';

const FLOATING_ITEMS = [
  { tag: '[DOC]', num: '01', title: 'Contract Redliner', img: '/assets/founder_frustrated_night_1784625923426.png' },
  { tag: '[GRPH]', num: '02', title: '3D Memory Graph', img: '/assets/founder_realization_connected_1784626303930.png' },
  { tag: '[BOARD]', num: '03', title: '10-Agent Boardroom', img: '/assets/founder_overwhelmed_monitors_1784626003009.png' },
  { tag: '[TWIN]', num: '04', title: 'Digital Twin OS', img: '/assets/founder_realization_connected_1784626303930.png' },
  { tag: '[RISK]', num: '05', title: 'Line-Level Citations', img: '/assets/founder_frustrated_night_1784625923426.png' }
];

export default function FrustratedDeveloperStoryLanding() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Initialize Smooth Lenis Scrolling
  useEffect(() => {
    let lenisInstance: any;
    import('lenis').then(({ default: Lenis }) => {
      lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      });

      function raf(time: number) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    });

    return () => {
      if (lenisInstance) lenisInstance.destroy();
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#6586b0] text-black font-sans selection:bg-black selection:text-white relative overflow-x-hidden">
      
      {/* ── BACKGROUND VERTICAL GUIDELINES ── */}
      <div className="absolute inset-0 pointer-events-none grid grid-cols-6 max-w-7xl mx-auto opacity-20">
        <div className="border-r border-black/20 h-full" />
        <div className="border-r border-black/20 h-full" />
        <div className="border-r border-black/20 h-full" />
        <div className="border-r border-black/20 h-full" />
        <div className="border-r border-black/20 h-full" />
        <div className="h-full" />
      </div>

      {/* ── TOP EDITORIAL HEADER (NO BOXES) ── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between font-mono text-xs tracking-wider uppercase font-bold text-black bg-[#6586b0]/90 backdrop-blur-md border-b border-black/10">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-base tracking-tighter" style={{ fontFamily: "'Unbounded', sans-serif" }}>(S)</span>
          <span className="text-[11px] tracking-widest ml-2 hidden sm:inline">SYNAPS ENTERPRISE OS</span>
        </div>

        {/* Center Equal Sign Menu Icon == */}
        <div className="flex flex-col gap-1 cursor-pointer hover:opacity-75 transition-opacity">
          <div className="w-6 h-0.5 bg-black" />
          <div className="w-6 h-0.5 bg-black" />
        </div>

        <div className="flex items-center gap-6">
          <Link href="/login" className="hover:underline text-black font-mono">
            SIGN IN
          </Link>
          <Link href="/demo" className="text-black font-mono font-bold uppercase underline tracking-widest hover:text-white transition-colors">
            TRY DEMO
          </Link>
          <span className="text-black/70 hidden sm:inline">EN / AI</span>
        </div>
      </header>

      {/* ── HERO FRAME (NO BOXES) ── */}
      <section className="min-h-screen pt-36 pb-12 px-6 md:px-12 max-w-7xl mx-auto flex flex-col justify-between relative z-10">
        
        {/* Top Centered Editorial Headline */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xl md:text-3xl font-extrabold tracking-tight uppercase leading-tight text-black" style={{ fontFamily: "'Unbounded', sans-serif" }}>
            TYPEFACE & MEMORY GRAPH OF THE ENTERPRISE IDENTITY
          </h2>
          <p className="text-xs md:text-sm font-medium tracking-wide text-black/80 max-w-xl mx-auto font-mono">
            The History of Business Decision Making from A to Z — Grounded in Document Intelligence & 60-Second AI Redlining.
          </p>
        </div>

        {/* ── FLOATING PORTRAIT IMAGES (NO BOXED CONTAINERS) ── */}
        <div className="my-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-end max-w-6xl mx-auto w-full">
          {FLOATING_ITEMS.map((item, index) => (
            <div 
              key={index}
              className="flex flex-col items-center transition-transform hover:-translate-y-3 cursor-pointer group"
              style={{ transform: `rotate(${(index - 2) * 2.5}deg)` }}
              onClick={() => setVideoModalOpen(true)}
            >
              <div className="w-full flex justify-between items-center font-mono text-[10px] font-extrabold text-black mb-1 px-1">
                <span>{item.tag}</span>
                <span>{item.num}</span>
              </div>
              <div className="w-full aspect-[4/5] overflow-hidden relative shadow-2xl">
                <img 
                  src={item.img} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
              </div>
              <div className="pt-2 font-mono text-[10px] font-bold text-black uppercase tracking-wider truncate">
                {item.title}
              </div>
            </div>
          ))}
        </div>

        {/* ── ACTION CTA BAR (NO BOXES) ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4 z-20">
          <Link 
            href="/demo"
            className="text-black font-extrabold text-xs uppercase tracking-widest hover:underline flex items-center gap-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Upload Document Now <ArrowRight className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => setVideoModalOpen(true)}
            className="text-black font-extrabold text-xs uppercase tracking-widest hover:underline flex items-center gap-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <Play className="w-4 h-4 fill-black text-black" /> Watch 1-Min Video
          </button>
        </div>

        {/* ── GIANT WATERMARK TYPOGRAPHY "SYNAPS 53" (EXACT SCREENSHOT MATCH) ── */}
        <div className="w-full text-center pt-6 overflow-hidden select-none">
          <h1 
            className="text-[16vw] sm:text-[19vw] font-black leading-none tracking-tighter text-black uppercase"
            style={{ fontFamily: "'Unbounded', sans-serif", letterSpacing: "-0.06em" }}
          >
            SYNAPS<span className="text-2xl sm:text-6xl font-mono align-super ml-1">53</span>
          </h1>
        </div>

      </section>

      {/* ── FRAME 2: EDITORIAL CAPABILITIES (NO BOXES) ── */}
      <section className="py-28 px-6 md:px-12 bg-black text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold block">
              [SYSTEM SPECIFICATIONS]
            </span>
            <h2 className="text-3xl md:text-6xl font-black uppercase leading-tight" style={{ fontFamily: "'Unbounded', sans-serif" }}>
              BEYOND DOCUMENT REVIEW.
            </h2>
            <p className="text-base md:text-lg text-slate-400 font-light leading-relaxed">
              Synaps automatically unifies your contracts, board minutes, and financial logs into an interactive 3D Knowledge Graph and a 10-Agent AI Boardroom.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-4 font-mono">
              <div>
                <span className="text-4xl font-black text-amber-400 block" style={{ fontFamily: "'Unbounded', sans-serif" }}>&lt; 60 SEC</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Contract Risk Analysis</span>
              </div>
              <div>
                <span className="text-4xl font-black text-indigo-400 block" style={{ fontFamily: "'Unbounded', sans-serif" }}>10 AGENTS</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">C-Suite Cross-Verification</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-square bg-slate-900 overflow-hidden shadow-2xl">
            <img 
              src="/assets/founder_overwhelmed_monitors_1784626003009.png" 
              alt="Monitors Showcase"
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </section>

      {/* ── VIDEO MODAL ── */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <button 
            onClick={() => setVideoModalOpen(false)}
            className="absolute top-6 right-6 text-white font-mono font-bold text-xs uppercase hover:underline"
          >
            [CLOSE X]
          </button>
          <div className="w-full max-w-4xl aspect-video bg-black">
            <video 
              src="/synaps-landing-video.mp4" 
              controls 
              autoPlay 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      )}
    </div>
  );
}
