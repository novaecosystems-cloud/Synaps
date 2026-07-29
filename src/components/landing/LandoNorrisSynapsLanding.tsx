'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Radio, Sparkles, ShieldCheck, ArrowRight, Layers, Users, Zap, 
  Cpu, FileText, ChevronRight, CheckCircle2, Lock, Eye, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandoNorrisSynapsLanding() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Calculate 3D tilt angles based on mouse offset
  const rotateX = isHovered ? mousePos.y * -15 : 25 + mousePos.y * 15;
  const rotateY = isHovered ? mousePos.x * 15 : -35 + mousePos.x * 15;
  const rotateZ = isHovered ? 0 : 12;
  const scale = isHovered ? 1.08 : 1.0;

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#08140e] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black overflow-x-hidden relative"
    >
      {/* ── BACKGROUND GRID & GLOW EFFECT ────────────────────────── */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* ── NAVIGATION BAR ────────────────────────────────────────── */}
      <header className="relative z-50 flex justify-between items-center px-8 py-6 border-b border-emerald-500/10 backdrop-blur-md bg-[#08140e]/80">
        <div className="flex items-center gap-3">
          {/* Synaps Neural Logo Icon */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <Radio className="w-5 h-5 text-slate-950 animate-pulse" />
          </div>
          <span className="font-extrabold text-xl tracking-tighter text-white font-mono">
            SYNAPS<span className="text-emerald-400">.AI</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs uppercase font-mono tracking-widest text-slate-400">
          <a href="#mission" className="hover:text-emerald-400 transition-colors">01 // Mission Control</a>
          <a href="#decision" className="hover:text-emerald-400 transition-colors">02 // Decision Memory</a>
          <a href="#twins" className="hover:text-emerald-400 transition-colors">03 // Executive Twins</a>
          <a href="#grounding" className="hover:text-emerald-400 transition-colors">04 // Evidence Engine</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link 
            href="/login"
            className="text-xs font-mono font-bold uppercase tracking-widest px-5 py-2.5 rounded-full border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 hover:text-white bg-emerald-950/40 hover:bg-emerald-600 transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)]"
          >
            Enter SYNAPS OS →
          </Link>
        </div>
      </header>

      {/* ── HERO SECTION WITH 45° INTERACTIVE TILTED DOCUMENT ────── */}
      <section className="relative z-10 min-h-[90vh] flex flex-col justify-between px-8 pt-12 pb-16 max-w-7xl mx-auto">
        
        {/* Top Header Marquee */}
        <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-emerald-400/70 border-b border-emerald-500/10 pb-4">
          <span>LATITUDE: 37.7749° N, 122.4194° W</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            LIVE SYSTEM STATUS: GROUNDED & VERIFIED
          </span>
          <span>BUILD: 2026.07.29</span>
        </div>

        {/* Hero Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-12">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 z-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Enterprise Decision Intelligence Layer
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-white leading-[0.95] font-sans">
              NOT A CHATBOT.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-200">
                THE INTELLIGENCE LAYER
              </span><br />
              ABOVE EVERY DOC.
            </h1>

            <p className="text-sm text-slate-400 max-w-lg leading-relaxed font-sans">
              SYNAPS transforms company documents into an active, reasoning decision network. Inspect multi-audience summaries, run multi-twin boardroom simulations, and verify mathematical confidence scores.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/login"
                className="px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all hover:scale-105"
              >
                Launch Decision Hub <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/dashboard/digital-twin"
                className="px-8 py-4 rounded-full border border-emerald-500/30 hover:border-emerald-400 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-widest transition-all bg-emerald-950/20"
              >
                Run Twin Simulation
              </Link>
            </div>
          </div>

          {/* Right Column: 45° TILTED INTERACTIVE DOCUMENT CARD */}
          <div className="lg:col-span-6 flex justify-center items-center relative perspective-[1200px] py-12">
            
            {/* Ambient Background Aura */}
            <div className={cn(
              "absolute w-96 h-96 rounded-full bg-emerald-500/20 blur-[100px] transition-all duration-700 pointer-events-none",
              isHovered ? "scale-125 opacity-100 bg-emerald-400/30" : "scale-100 opacity-50"
            )} />

            {/* 3D TILT DOCUMENT CONTAINER */}
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
                transition: isHovered ? 'transform 0.15s ease-out' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className="w-full max-w-md bg-gradient-to-br from-slate-900 via-[#0b1f16] to-slate-950 border border-emerald-500/40 rounded-3xl p-8 shadow-[0_30px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(16,185,129,0.2)] cursor-pointer relative overflow-hidden select-none group"
            >
              {/* Document Top Corner Stamp */}
              <div className="flex justify-between items-center border-b border-emerald-500/20 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-mono text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    VERIFIED DOCUMENT RECORD
                  </span>
                </div>
                <span className="font-mono text-[9px] text-slate-500 uppercase">CONFIDENTIAL // ORG-SECURED</span>
              </div>

              {/* REVEAL ON HOVER HEADER: SYNAPS LOGO & METALLIC TYPOGRAPHY */}
              <div className="space-y-4 my-4 text-center">
                <div className={cn(
                  "w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-300 to-emerald-600 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-transform duration-500",
                  isHovered ? "scale-110 rotate-6" : "scale-100 rotate-0"
                )}>
                  <Radio className="w-9 h-9 text-slate-950" />
                </div>

                <div className="space-y-1">
                  <h2 className="text-4xl font-extrabold tracking-tighter text-white font-sans group-hover:text-emerald-300 transition-colors">
                    SYNAPS<span className="text-emerald-400">.AI</span>
                  </h2>
                  <p className="text-[11px] font-mono text-emerald-400/80 uppercase tracking-widest">
                    ENTERPRISE DECISION INTELLIGENCE
                  </p>
                </div>
              </div>

              {/* Live Document Data Highlights */}
              <div className="space-y-3 pt-4 border-t border-emerald-500/20">
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl flex justify-between items-center text-xs">
                  <span className="font-mono text-slate-400">Grounded Confidence</span>
                  <span className="font-mono font-bold text-emerald-400">99.4% (Math Verified)</span>
                </div>

                <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl flex justify-between items-center text-xs">
                  <span className="font-mono text-slate-400">Executive Twin Consensus</span>
                  <span className="font-mono font-bold text-teal-300">8/8 Personas Approved</span>
                </div>

                <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl flex justify-between items-center text-xs">
                  <span className="font-mono text-slate-400">Decision Precedent</span>
                  <span className="font-mono font-bold text-emerald-400">Linked to Brain #842</span>
                </div>
              </div>

              {/* Bottom Hover Instruction */}
              <div className="mt-6 pt-4 border-t border-emerald-500/10 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest group-hover:text-emerald-300 transition-colors">
                  {isHovered ? '⚡ HOVER ACTIVE // EXPLORE SYSTEM' : 'Hover cursor to level & reveal SYNAPS'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Ticker Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-emerald-500/10">
          <div>
            <span className="text-2xl font-black font-mono text-white">20+</span>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Doc Classifications</span>
          </div>
          <div>
            <span className="text-2xl font-black font-mono text-emerald-400">8 Personas</span>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Executive Digital Twins</span>
          </div>
          <div>
            <span className="text-2xl font-black font-mono text-white">0.0%</span>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Hallucination Tolerance</span>
          </div>
          <div>
            <span className="text-2xl font-black font-mono text-emerald-400">100%</span>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Local Inference Ready</span>
          </div>
        </div>
      </section>

      {/* ── CORE CAPABILITIES MARQUEE TICKER ─────────────────────── */}
      <div className="bg-emerald-950/40 border-y border-emerald-500/20 py-4 overflow-hidden select-none">
        <div className="flex whitespace-nowrap gap-12 animate-marquee text-xs font-mono uppercase tracking-widest text-emerald-400">
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
