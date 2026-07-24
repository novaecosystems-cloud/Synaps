"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Play, ArrowRight, X, Sparkles, BrainCircuit, ShieldCheck, Database, Zap } from 'lucide-react';
import gsap from 'gsap';

const EXACT_PROBLEMS = [
  { icon: '⚠️', text: 'Siloed Knowledge Base', style: 'border-amber-500/50 bg-amber-950/90 text-amber-300 shadow-[0_10px_30px_rgba(245,158,11,0.4)]' },
  { icon: '⚡', text: 'Manual Context Switching', style: 'border-orange-500/50 bg-orange-950/90 text-orange-300 shadow-[0_10px_30px_rgba(249,115,22,0.4)]' },
  { icon: '❌', text: 'Unstructured Spreadsheets', style: 'border-rose-500/50 bg-rose-950/90 text-rose-300 shadow-[0_10px_30px_rgba(244,63,94,0.4)]' },
  { icon: '⚠️', text: 'Vendor Contract Misalignment', style: 'border-yellow-500/50 bg-amber-950/90 text-yellow-300 shadow-[0_10px_30px_rgba(234,179,8,0.4)]' },
  { icon: '🚨', text: 'CRM Disconnected', style: 'border-red-500/50 bg-red-950/90 text-red-300 shadow-[0_10px_30px_rgba(239,68,68,0.4)]' },
  { icon: '💥', text: 'Data Mishandling', style: 'border-rose-600/50 bg-rose-950/90 text-rose-300 shadow-[0_10px_30px_rgba(225,29,72,0.4)]' },
  { icon: '⚡', text: 'Duplicate Work & Bottlenecks', style: 'border-amber-600/50 bg-amber-950/90 text-amber-300 shadow-[0_10px_30px_rgba(217,119,6,0.4)]' }
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
        wheelMultiplier: 1,
        touchMultiplier: 2,
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

  // GSAP Click-Anywhere Floating Pill Popups
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('button, a, video, input, iframe, .no-popup')) return;

      const randomProblem = EXACT_PROBLEMS[Math.floor(Math.random() * EXACT_PROBLEMS.length)];

      const wrapper = document.createElement("div");
      wrapper.style.position = "fixed";
      wrapper.style.left = `${event.clientX}px`;
      wrapper.style.top = `${event.clientY}px`;
      wrapper.style.pointerEvents = "none";
      wrapper.style.zIndex = "9999";
      
      const pill = document.createElement("div");
      pill.className = `flex items-center gap-2 px-5 py-2.5 rounded-full border backdrop-blur-xl text-xs sm:text-sm font-bold tracking-wide font-sans ${randomProblem.style}`;
      pill.innerHTML = `<span>${randomProblem.icon}</span> <span>${randomProblem.text}</span>`;
      
      wrapper.appendChild(pill);
      document.body.appendChild(wrapper);

      const randomRotation = Math.random() * 20 - 10;
      const randomScale = Math.random() * 0.3 + 0.9;

      gsap.set(wrapper, {
        scale: 0,
        rotation: randomRotation,
        xPercent: -50,
        yPercent: -50,
        transformOrigin: "center center",
      });

      const tl = gsap.timeline();

      // Bounce Pop-in
      tl.to(wrapper, {
        scale: randomScale,
        duration: 0.4,
        ease: "back.out(1.8)"
      });

      // Float Up & Fade out smoothly
      tl.to(wrapper, {
        y: () => `-=${Math.random() * 150 + 150}`,
        x: () => `+=${Math.random() * 80 - 40}`,
        opacity: 0,
        duration: 3.2,
        ease: "power1.out",
        onComplete: () => {
          if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
        }
      }, "-=0.1");
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#07080c] text-white font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden relative cursor-crosshair">
      
      {/* Click Anywhere Interactive Indicator Banner */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-black/80 border border-amber-500/40 backdrop-blur-md px-4 py-1.5 rounded-full text-[11px] font-bold text-amber-400 shadow-xl pointer-events-none flex items-center gap-2 animate-bounce">
        <Sparkles className="w-3.5 h-3.5" /> Click anywhere on screen to spawn enterprise problem pills!
      </div>

      {/* ── PERSISTENT HEADER NAVIGATION ── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[#07080c]/80 border-b border-white/10 backdrop-blur-xl flex items-center justify-between no-popup">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-wider text-white">SYNAPS</span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
            ENTERPRISE OS
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setVideoModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Watch Video
          </button>
          <Link 
            href="/login" 
            className="px-4 py-2 rounded-full border border-white/20 text-xs font-bold text-white/80 hover:text-white hover:border-white/40 transition-all"
          >
            Sign In
          </Link>
          <Link 
            href="/demo" 
            className="px-5 py-2 rounded-full bg-white text-black text-xs font-extrabold uppercase tracking-wider hover:bg-amber-400 hover:scale-105 transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          >
            Request Early Access
          </Link>
        </div>
      </header>

      {/* ── FRAME 1: FRUSTRATED DEVELOPER NIGHT AT DESK ── */}
      <section className="min-h-screen pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 justify-between">
        <div className="flex-1 space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            The Enterprise Data Problem
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white">
            EVERY COMPANY HAS <span className="text-amber-400">DATA.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-xl font-light">
            But it's everywhere. Disconnected across CRM, Spreadsheets, Emails, and Documents. Teams work in silos, and leaders are left guessing.
          </p>
          <div className="pt-4 flex flex-wrap gap-4 no-popup">
            <Link 
              href="/demo"
              className="px-8 py-4 bg-white text-black font-extrabold text-sm uppercase tracking-wider rounded-full hover:bg-amber-400 hover:scale-105 transition-all shadow-xl flex items-center gap-2"
            >
              Explore Synaps OS <ArrowRight className="w-4 h-4" />
            </Link>
            <button 
              onClick={() => setVideoModalOpen(true)}
              className="px-6 py-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm font-bold flex items-center gap-2"
            >
              <Play className="w-4 h-4 text-amber-400 fill-amber-400" /> Watch Product Video
            </button>
          </div>
        </div>

        <div className="flex-1 relative w-full aspect-video md:aspect-square max-w-xl rounded-3xl overflow-hidden border border-white/15 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
          <img 
            src="/assets/founder_frustrated_night_1784625923426.png" 
            alt="Frustrated Developer at Night"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-xs text-white/90 shadow-2xl">
            <p className="font-semibold text-amber-400 mb-1">💭 Developer Thought Bubble:</p>
            <p className="italic">"There has to be a better way... searching across 10 folders for one proposal section is taking hours."</p>
          </div>
        </div>
      </section>

      {/* ── FRAME 2: OVERWHELMED WITH MONITORS ── */}
      <section className="py-24 px-6 md:px-12 bg-[#0a0b12] border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">
              INFORMATION OVERLOAD & SILOED KNOWLEDGE.
            </h2>
            <p className="text-base md:text-lg text-white/60 leading-relaxed font-light">
              Engineering, Legal, Finance, and Operations operate on different systems. Without a unified memory graph, crucial strategic risks slip through the cracks.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <span className="text-2xl font-bold text-red-400 block">78%</span>
                <span className="text-xs text-white/50">Time lost searching files</span>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <span className="text-2xl font-bold text-amber-400 block">4.2 Hrs</span>
                <span className="text-xs text-white/50">Daily context switching</span>
              </div>
            </div>
          </div>

          <div className="flex-1 relative w-full aspect-video rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
            <img 
              src="/assets/founder_overwhelmed_monitors_1784626003009.png" 
              alt="Overwhelmed with Monitors"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── FRAME 3: EMBEDDED RECORDED LANDING VIDEO SHOWCASE ── */}
      <section className="py-28 px-6 md:px-12 bg-gradient-to-b from-[#0a0b12] via-[#0d0e1a] to-[#07080c] border-t border-white/5 no-popup">
        <div className="max-w-6xl mx-auto space-y-8 text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3.5 py-1 rounded-full border border-indigo-500/20">
            Interactive Product Showcase
          </span>
          <h2 className="text-3xl md:text-6xl font-extrabold text-white tracking-tight">
            INTRODUCING <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-indigo-400 to-cyan-400">SYNAPS AI OS.</span>
          </h2>
          <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto font-light">
            Watch how Synaps unifies document intelligence, 3D memory graphs, multi-agent boardroom consensus, and digital twin simulations into a single platform.
          </p>

          {/* Cluely-style Glowing Video Frame */}
          <div className="relative group max-w-4xl mx-auto text-left pt-4">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500 via-purple-500 to-indigo-500 opacity-30 blur-2xl group-hover:opacity-60 transition duration-1000" />
            
            <div className="relative bg-[#0b0b12] border border-white/20 rounded-3xl p-2 md:p-3 shadow-[0_0_90px_rgba(99,102,241,0.25)]">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#14141e] rounded-t-2xl border-b border-white/10 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  <span className="text-xs text-white/50 font-mono ml-2">synaps-landing-video.mp4</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Official Walkthrough
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
        </div>
      </section>

      {/* ── FRAME 4: REALIZATION & CONNECTED MEMORY GRAPH ── */}
      <section className="py-24 px-6 md:px-12 bg-[#07080c] border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">
              IT CONNECTS & UNIFIES.
            </h2>
            <p className="text-base md:text-lg text-white/60 leading-relaxed font-light">
              Synaps automatically parses contracts, board minutes, financial forecasts, and PDFs into an interconnected 3D Memory Graph. Zero hallucinations. 100% grounded citations.
            </p>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Grounded Vector Retrieval across all files</li>
              <li className="flex items-center gap-2"><Database className="w-4 h-4 text-indigo-400" /> Automated 3D Knowledge Graph construction</li>
              <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" /> Multi-Agent C-Suite Executive Boardroom</li>
            </ul>
          </div>

          <div className="flex-1 relative w-full aspect-video rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
            <img 
              src="/assets/founder_realization_connected_1784626303930.png" 
              alt="Realization & Connected Intelligence"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── FRAME 5: CONFIDENT FOCUS & CTA FULFILLMENT ── */}
      <section className="py-28 px-6 md:px-12 bg-gradient-to-t from-black via-[#0a0b12] to-[#07080c] border-t border-white/5 text-center no-popup">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight">
            FROM CHAOS TO <span className="text-amber-400">CLARITY.</span>
          </h2>
          <p className="text-lg md:text-xl text-white/60 font-light max-w-2xl mx-auto">
            Empower your entire enterprise with real-time AI intelligence, risk simulation, and automated strategic decision making.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link 
              href="/demo"
              className="px-10 py-5 bg-amber-500 text-black font-extrabold text-base uppercase tracking-wider rounded-full hover:bg-amber-400 hover:scale-105 transition-all shadow-[0_0_50px_rgba(234,179,8,0.5)]"
            >
              Enter Synaps OS (Instant Demo)
            </Link>
            <Link 
              href="/login"
              className="px-8 py-5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-base font-bold transition-all"
            >
              Sign In to Account
            </Link>
          </div>
        </div>
      </section>

      {/* ── VIDEO MODAL ── */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300 no-popup">
          <button 
            onClick={() => setVideoModalOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 p-3 rounded-full border border-white/20 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="w-full max-w-5xl bg-[#0b0b10] border border-white/20 rounded-3xl p-3 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#14141e] rounded-t-2xl border-b border-white/10 mb-2">
              <span className="text-xs text-white/60 font-mono">synaps-landing-video.mp4 — Product Walkthrough</span>
              <span className="text-[10px] font-bold text-amber-400 uppercase">SYNAPS DEMO</span>
            </div>
            <video
              src="/synaps-landing-video.mp4"
              autoPlay
              controls
              className="w-full h-auto max-h-[75vh] rounded-2xl border border-white/10 object-contain bg-black"
            />
          </div>
        </div>
      )}

    </div>
  );
}
