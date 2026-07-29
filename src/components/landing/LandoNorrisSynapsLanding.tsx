'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Radio, Sparkles, ShieldCheck, ArrowRight, Layers, Users, Zap, 
  Cpu, FileText, ChevronRight, CheckCircle2, Lock, Eye, Activity,
  Volume2, VolumeX, Shield, Crosshair, Award, Terminal, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandoNorrisSynapsLanding() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [activeSection, setActiveSection] = useState('01');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth lerp physics for cursor tracking (like landonorris.com inertia)
  useEffect(() => {
    let animationFrameId: number;

    const updatePhysics = () => {
      setMousePos(prev => ({
        x: prev.x + (targetPos.x - prev.x) * 0.1,
        y: prev.y + (targetPos.y - prev.y) * 0.1
      }));
      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetPos]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTargetPos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Calculate 3D tilt angles & translation with spring inertia
  const rotateX = isHovered ? mousePos.y * -22 : 30 + mousePos.y * 18;
  const rotateY = isHovered ? mousePos.x * 22 : -40 + mousePos.x * 18;
  const rotateZ = isHovered ? -2 : 15;
  const translateZ = isHovered ? 80 : 0;
  const scale = isHovered ? 1.12 : 1.0;

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#06100b] text-slate-100 font-sans selection:bg-emerald-400 selection:text-black overflow-x-hidden relative"
    >
      {/* ── LANDO NORRIS STYLE CURSOR SPOTLIGHT ────────────────────── */}
      <div 
        className="fixed w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none transition-transform duration-75 z-0"
        style={{
          left: `calc(50% + ${mousePos.x * 800}px - 300px)`,
          top: `calc(50% + ${mousePos.y * 600}px - 300px)`,
        }}
      />

      {/* Background Cyber Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#10b9810a_1px,transparent_1px),linear-gradient(to_bottom,#10b9810a_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* ── NAVIGATION BAR ────────────────────────────────────────── */}
      <header className="relative z-50 flex justify-between items-center px-8 py-6 border-b border-emerald-500/15 backdrop-blur-xl bg-[#06100b]/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-700 flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.5)]">
            <Radio className="w-6 h-6 text-slate-950 animate-pulse" />
          </div>
          <div>
            <span className="font-black text-2xl tracking-tighter text-white font-mono block leading-none">
              SYNAPS<span className="text-emerald-400">.AI</span>
            </span>
            <span className="text-[9px] font-mono text-emerald-400/70 tracking-widest uppercase block">
              OS v2026.4 // GROUNDED
            </span>
          </div>
        </div>

        {/* Section Links */}
        <nav className="hidden md:flex items-center gap-10 text-xs font-mono tracking-widest uppercase text-slate-400">
          <a href="#mission" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
            <span className="text-emerald-500 font-bold">01</span> MISSION CONTROL
          </a>
          <a href="#decision" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
            <span className="text-emerald-500 font-bold">02</span> DECISION MEMORY
          </a>
          <a href="#twins" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
            <span className="text-emerald-500 font-bold">03</span> EXECUTIVE TWINS
          </a>
          <a href="#confidence" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
            <span className="text-emerald-500 font-bold">04</span> MATH CONFIDENCE
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-full border border-emerald-500/20 text-slate-400 hover:text-emerald-300 hover:border-emerald-500/40 transition-all"
            title="Toggle Sound Effects"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <Link 
            href="/login"
            className="text-xs font-mono font-bold uppercase tracking-widest px-6 py-3 rounded-full border border-emerald-400/40 hover:border-emerald-400 text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:scale-105"
          >
            LAUNCH OS →
          </Link>
        </div>
      </header>

      {/* ── HERO SECTION: GIANT TYPOGRAPHY & 3D HELMET DOCUMENT MORPH ────── */}
      <section className="relative z-10 min-h-[92vh] flex flex-col justify-between px-8 pt-8 pb-12 max-w-7xl mx-auto">
        
        {/* LANDO NORRIS STYLE HUGE BACKGROUND OUTLINE TEXT */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black text-emerald-500/[0.03] select-none pointer-events-none tracking-tighter whitespace-nowrap font-mono">
          SYNAPS.AI
        </div>

        {/* Top Meta Bar */}
        <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-emerald-400/80 border-b border-emerald-500/10 pb-4 z-20">
          <span className="flex items-center gap-2">
            <Crosshair className="w-3 h-3 text-emerald-400 animate-spin" />
            TARGET ACQUIRED: ENTERPRISE DECISION INTELLIGENCE
          </span>
          <span className="hidden sm:inline font-bold">ORGANIZATION VAULT: GROUNDED</span>
          <span>LATENCY: 12ms // 0.0% HALLUCINATION</span>
        </div>

        {/* Hero Central Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto z-20">
          
          {/* Left Column: Bold Editorial Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5 text-emerald-400" /> NOT A CHATBOT // THE DECISION ENGINE
            </div>

            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-white leading-[0.92] uppercase font-sans">
              REASON.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-500">
                COMPARE.
              </span><br />
              REMEMBER.
            </h1>

            <p className="text-sm text-slate-400 max-w-md leading-relaxed font-sans font-medium">
              Hover over the 3D Document to engage the <strong className="text-emerald-300 font-mono">SYNAPS Neural Visor Helmet</strong>. Runs multi-twin boardroom simulations, extracts multi-risk matrices, and enforces mathematical confidence formulas.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/login"
                className="px-8 py-4 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-[0_0_35px_rgba(16,185,129,0.4)] transition-all hover:scale-105"
              >
                Enter Decision Hub <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/dashboard/digital-twin"
                className="px-8 py-4 rounded-full border border-emerald-500/30 hover:border-emerald-400 text-slate-300 hover:text-white font-mono font-bold text-xs uppercase tracking-widest transition-all bg-emerald-950/30"
              >
                03 // Twin Simulator
              </Link>
            </div>
          </div>

          {/* Right Column: 3D HELMET DOCUMENT MORPH EXPERIENCE */}
          <div className="lg:col-span-6 flex justify-center items-center relative perspective-[1200px] py-8">
            
            {/* Holographic Glowing Aura */}
            <div className={cn(
              "absolute w-96 h-96 rounded-full bg-emerald-500/25 blur-[120px] transition-all duration-500 pointer-events-none",
              isHovered ? "scale-150 opacity-100 bg-emerald-400/40" : "scale-100 opacity-40"
            )} />

            {/* 3D TILT DOCUMENT / HELMET MORPH CARD */}
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) translateZ(${translateZ}px) scale(${scale})`,
                transition: isHovered ? 'transform 0.12s cubic-bezier(0.1, 1, 0.1, 1)' : 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className={cn(
                "w-full max-w-md border rounded-3xl p-8 shadow-[0_40px_90px_rgba(0,0,0,0.9)] cursor-pointer relative overflow-hidden select-none transition-all duration-500",
                isHovered 
                  ? "bg-gradient-to-br from-slate-950 via-[#071d13] to-slate-900 border-emerald-400 shadow-[0_0_60px_rgba(16,185,129,0.4)]" 
                  : "bg-gradient-to-br from-slate-900 via-[#0a1811] to-slate-950 border-emerald-500/30"
              )}
            >
              {/* LASER SCANNER BEAM ON HOVER */}
              {isHovered && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-laser-scan z-30 shadow-[0_0_15px_#10b981]" />
              )}

              {/* Top Document Header */}
              <div className="flex justify-between items-center border-b border-emerald-500/20 pb-4 mb-6 relative z-20">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "w-2.5 h-2.5 rounded-full transition-colors",
                    isHovered ? "bg-emerald-400 animate-ping" : "bg-emerald-600"
                  )} />
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                    {isHovered ? '⚡ VISOR DOWN // HELMET ACTIVE' : 'DOCUMENT RECORD #842'}
                  </span>
                </div>
                <span className="font-mono text-[9px] text-slate-500">SYNAPS OS ENGINE</span>
              </div>

              {/* CENTRAL MORPH: HELMET VISOR & SYNAPS LOGO REVEAL */}
              <div className="relative my-6 py-4 text-center z-20">
                
                {/* Synaps Neural Crest Shield Logo */}
                <div className={cn(
                  "w-20 h-20 mx-auto rounded-2xl flex items-center justify-center transition-all duration-500 shadow-2xl relative",
                  isHovered 
                    ? "bg-gradient-to-br from-emerald-300 via-emerald-400 to-teal-600 rotate-0 scale-110 shadow-[0_0_40px_rgba(16,185,129,0.7)]" 
                    : "bg-slate-800/80 border border-emerald-500/30 rotate-6 scale-100"
                )}>
                  <Shield className={cn(
                    "w-10 h-10 transition-colors duration-500",
                    isHovered ? "text-slate-950" : "text-emerald-400"
                  )} />

                  {/* Helmet Visor HUD Glare lines */}
                  {isHovered && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none animate-pulse" />
                  )}
                </div>

                {/* SYNAPS Metallic Typography */}
                <div className="mt-4 space-y-1">
                  <h2 className={cn(
                    "text-4xl font-black tracking-tighter font-sans transition-all duration-300",
                    isHovered ? "text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-emerald-400 scale-105" : "text-white"
                  )}>
                    SYNAPS<span className="text-emerald-400">.AI</span>
                  </h2>
                  <p className="text-[10px] font-mono text-emerald-400/90 uppercase tracking-widest">
                    {isHovered ? '🔒 GROUNDED DECISION MEMORY ACTIVE' : 'HOVER TO ENGAGE VISOR'}
                  </p>
                </div>
              </div>

              {/* DYNAMIC HUD DATA METRICS */}
              <div className="space-y-2.5 pt-4 border-t border-emerald-500/20 relative z-20">
                <div className="p-3 bg-emerald-950/50 border border-emerald-500/25 rounded-2xl flex justify-between items-center text-xs">
                  <span className="font-mono text-slate-400 text-[11px]">Math Confidence</span>
                  <span className="font-mono font-bold text-emerald-400">99.4% ($S_{sim}$ Verified)</span>
                </div>

                <div className="p-3 bg-emerald-950/50 border border-emerald-500/25 rounded-2xl flex justify-between items-center text-xs">
                  <span className="font-mono text-slate-400 text-[11px]">Boardroom Consensus</span>
                  <span className="font-mono font-bold text-teal-300">8/8 Twins Agreed</span>
                </div>

                <div className="p-3 bg-emerald-950/50 border border-emerald-500/25 rounded-2xl flex justify-between items-center text-xs">
                  <span className="font-mono text-slate-400 text-[11px]">Contradiction Status</span>
                  <span className="font-mono font-bold text-emerald-400">0 Conflicts Flagged</span>
                </div>
              </div>

              {/* Bottom Instruction Footer */}
              <div className="mt-6 pt-4 border-t border-emerald-500/10 text-center relative z-20">
                <span className={cn(
                  "text-[10px] font-mono uppercase tracking-widest transition-colors",
                  isHovered ? "text-emerald-300 font-bold" : "text-slate-500"
                )}>
                  {isHovered ? '⚡ VISOR DOWN // MOUSE TRACKING ENGAGED' : 'Hover mouse over document for helmet morph'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* LANDO NORRIS STYLE VERTICAL NUMERIC SECTIONS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-emerald-500/15 z-20">
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/10 rounded-2xl space-y-1">
            <span className="text-xs font-mono font-bold text-emerald-400">01 // FLIGHT RADAR</span>
            <h4 className="text-sm font-bold text-white">Mission Control</h4>
            <p className="text-[11px] text-slate-400">10 AI Agents flying in structured memory.</p>
          </div>

          <div className="p-4 bg-emerald-950/20 border border-emerald-500/10 rounded-2xl space-y-1">
            <span className="text-xs font-mono font-bold text-emerald-400">02 // PRECEDENTS</span>
            <h4 className="text-sm font-bold text-white">Decision Memory</h4>
            <p className="text-[11px] text-slate-400">Natural language precedent search.</p>
          </div>

          <div className="p-4 bg-emerald-950/20 border border-emerald-500/10 rounded-2xl space-y-1">
            <span className="text-xs font-mono font-bold text-emerald-400">03 // SIMULATOR</span>
            <h4 className="text-sm font-bold text-white">Executive Twins</h4>
            <p className="text-[11px] text-slate-400">8 C-suite personas running boardroom consensus.</p>
          </div>

          <div className="p-4 bg-emerald-950/20 border border-emerald-500/10 rounded-2xl space-y-1">
            <span className="text-xs font-mono font-bold text-emerald-400">04 // FORMULA</span>
            <h4 className="text-sm font-bold text-white">Math Confidence</h4>
            <p className="text-[11px] text-slate-400">Weighted score equation with zero hallucination.</p>
          </div>
        </div>

      </section>

      {/* ── CORE CAPABILITIES MARQUEE TICKER ─────────────────────── */}
      <div className="bg-emerald-950/60 border-y border-emerald-500/20 py-4 overflow-hidden select-none relative z-20">
        <div className="flex whitespace-nowrap gap-12 animate-marquee text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
          <span>⚡ MISSION CONTROL FLIGHT SYSTEM</span>
          <span>•</span>
          <span>🧠 DECISION MEMORY PRECEDENT SEARCH</span>
          <span>•</span>
          <span>👥 MULTI-TWIN BOARDROOM SIMULATION</span>
          <span>•</span>
          <span>📐 MATHEMATICAL CONFIDENCE FORMULA</span>
          <span>•</span>
          <span>📊 MULTI-AUDIENCE EXECUTIVE SUMMARIES</span>
          <span>•</span>
          <span>⚡ MISSION CONTROL FLIGHT SYSTEM</span>
        </div>
      </div>
    </div>
  );
}
