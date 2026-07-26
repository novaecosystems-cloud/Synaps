"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Play, ArrowRight, X, BrainCircuit, ShieldCheck, Database, Zap, FileText, CheckCircle2, ArrowUpRight, Lock, Activity, Layers } from 'lucide-react';

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
    <div className="w-full min-h-screen bg-[#07090e] text-white selection:bg-amber-500 selection:text-black relative overflow-x-hidden" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      
      {/* ── BACKGROUND AMBIENT GLOW & GRID ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-600/15 via-amber-500/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* ── HEADER NAVIGATION (CLUELY STYLE) ── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 bg-[#07090e]/80 border-b border-white/10 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-[1px]">
            <div className="w-full h-full bg-[#07090e] rounded-[11px] flex items-center justify-center text-amber-400 font-extrabold">
              <BrainCircuit className="w-5 h-5" />
            </div>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
            SYNAPS
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
            ENTERPRISE OS
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setVideoModalOpen(true)}
            className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Watch Walkthrough
          </button>
          <Link href="/login" className="text-xs font-bold text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link 
            href="/demo" 
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-[0_0_25px_rgba(245,158,11,0.35)] flex items-center gap-1.5"
            style={{ fontFamily: "'Unbounded', sans-serif" }}
          >
            Try Free Demo <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* ── HERO SECTION (CLUELY LAYOUT + UNBOUNDED FONT) ── */}
      <section className="pt-40 pb-20 px-6 md:px-12 max-w-6xl mx-auto text-center relative z-10">
        
        {/* Subtitle Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-amber-400 mb-8 backdrop-blur-md">
          <Zap className="w-3.5 h-3.5 fill-amber-400" /> Grounded Instant Document Intelligence & Redlining
        </div>

        {/* Cluely-style Punchy Headline in UNBOUNDED Font */}
        <h1 
          className="text-4xl sm:text-6xl md:text-7xl font-black leading-[1.1] tracking-tight uppercase max-w-5xl mx-auto mb-8"
          style={{ fontFamily: "'Unbounded', sans-serif" }}
        >
          UPLOAD ANY DOCUMENT. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-indigo-400">GET RISKS & COUNTER-TERMS IN 60s.</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 font-normal leading-relaxed">
          Instantly surface predatory vendor terms, hidden fees, and liability traps with 100% line-level citations. Backed by a 3D Memory Graph and a 10-Agent AI Boardroom.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link 
            href="/demo"
            className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_35px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2"
            style={{ fontFamily: "'Unbounded', sans-serif" }}
          >
            Upload Document Now <ArrowRight className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => setVideoModalOpen(true)}
            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-amber-400 text-amber-400" /> Watch 1-Min Video
          </button>
        </div>

        {/* Interactive Showcase Frame (Cluely Video Mockup) */}
        <div className="relative group max-w-5xl mx-auto">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/30 via-indigo-500/30 to-cyan-500/30 blur-2xl group-hover:opacity-100 transition duration-1000 opacity-60" />
          
          <div className="relative bg-[#0d1017] border border-white/15 rounded-3xl p-3 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[#131822] rounded-t-2xl border-b border-white/10 mb-2 font-mono text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                <span className="ml-2 font-bold text-white">synaps-intelligence-demo.mp4</span>
              </div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-md border border-amber-500/20">
                Live Walkthrough
              </span>
            </div>

            <video
              src="/synaps-landing-video.mp4"
              autoPlay
              muted
              loop
              playsInline
              controls
              className="w-full h-auto rounded-2xl border border-white/10 shadow-2xl object-cover bg-black"
            />
          </div>
        </div>
      </section>

      {/* ── BENTO GRID FEATURES (CLUELY STYLE + UNBOUNDED FONT) ── */}
      <section className="py-28 px-6 md:px-12 max-w-6xl mx-auto border-t border-white/10 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">
            [ENTERPRISE CAPABILITIES]
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
            BUILT FOR ZERO RISK.
          </h2>
          <p className="text-slate-400 text-base">
            Every answer is mathematically cited with line-level source verification. No generic guesses.
          </p>
        </div>

        {/* Feature Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Auto Redliner */}
          <div className="p-8 bg-[#0d1017] border border-white/10 rounded-3xl space-y-4 hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold uppercase text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
              1-Click Auto-Redliner
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Detects predatory vendor terms, auto-renewals, and liability traps with proposed safer counter-clauses.
            </p>
            <div className="pt-2 text-xs font-mono text-emerald-400">
              ✅ Line-level cited counter-terms
            </div>
          </div>

          {/* Card 2: 3D Memory Graph */}
          <div className="p-8 bg-[#0d1017] border border-white/10 rounded-3xl space-y-4 hover:border-indigo-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold uppercase text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
              3D Memory Graph
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Unifies contracts, board minutes, and financial forecasts into an interconnected 3D knowledge graph.
            </p>
            <div className="pt-2 text-xs font-mono text-indigo-400">
              🧠 Zero hallucinations
            </div>
          </div>

          {/* Card 3: 10-Agent Boardroom */}
          <div className="p-8 bg-[#0d1017] border border-white/10 rounded-3xl space-y-4 hover:border-cyan-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold uppercase text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
              10-Agent Boardroom
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Specialized AI agents (CEO, CFO, Legal, Risk Officer) inspect decisions from conflicting operational angles.
            </p>
            <div className="pt-2 text-xs font-mono text-cyan-400">
              🏛️ Multi-agent consensus
            </div>
          </div>

        </div>
      </section>

      {/* ── BOTTOM CTA BANNER (CLUELY STYLE + UNBOUNDED FONT) ── */}
      <section className="py-28 px-6 md:px-12 text-center border-t border-white/10 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl sm:text-7xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
            FROM CHAOS TO <span className="text-amber-400">CLARITY.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Upload your first business document and experience 60-second grounded AI document intelligence.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              href="/demo"
              className="px-10 py-5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_40px_rgba(245,158,11,0.5)] flex items-center gap-2"
              style={{ fontFamily: "'Unbounded', sans-serif" }}
            >
              Start Free Demo Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-6 md:px-12 border-t border-white/10 text-center font-mono text-xs text-slate-500">
        SYNAPS ENTERPRISE OS — ALL RIGHTS RESERVED.
      </footer>

      {/* ── VIDEO MODAL ── */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <button 
            onClick={() => setVideoModalOpen(false)}
            className="absolute top-6 right-6 p-3 bg-white text-black font-mono font-bold text-xs uppercase rounded-xl"
          >
            [CLOSE X]
          </button>
          <div className="w-full max-w-4xl aspect-video rounded-3xl overflow-hidden border border-white/20 bg-black shadow-2xl">
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
