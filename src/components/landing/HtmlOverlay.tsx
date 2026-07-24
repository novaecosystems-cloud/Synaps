"use client";

import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { Play, X, Sparkles, BrainCircuit } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Utility to wrap words/characters for kinetic typography without Premium SplitText
const splitText = (text: string) => {
  return text.split('').map((char, i) => (
    <span key={i} className="inline-block split-char" style={{ opacity: 0, transform: 'translateY(50px) rotateX(-90deg)' }}>
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));
};

export default function HtmlOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      }
    });

    // We calculate percentages for our 6 scenes
    // Scene 1: Chaos (0 to 16%)
    tl.to('.scene1-chars .split-char', { opacity: 1, y: 0, rotateX: 0, stagger: 0.05, duration: 1, ease: 'back.out(1.5)' }, 0.5)
      .to('.scene1-text', { opacity: 0, scale: 1.5, filter: 'blur(20px)', duration: 1 }, 1.5);
      
    // Scene 2: Data (16% to 33%)
    tl.to('.scene2-chars .split-char', { opacity: 1, y: 0, rotateX: 0, stagger: 0.02, duration: 1, ease: 'power4.out' }, 1.8)
      .to('.scene2-text', { opacity: 0, y: -50, duration: 1 }, 3.0);
      
    // Scene 3: Intelligence (33% to 50%)
    tl.to('.scene3-text', { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1 }, 3.5)
      .to('.scene3-text', { opacity: 0, scale: 2, duration: 1 }, 4.8);

    // Scene 4: Simulation (50% to 66%)
    tl.to('.scene4-chars .split-char', { opacity: 1, y: 0, rotateX: 0, stagger: 0.05, duration: 1, ease: 'power3.out' }, 5.2)
      .to('.scene4-text', { opacity: 0, x: -100, filter: 'blur(10px)', duration: 1 }, 6.4);

    // Scene 5: Decisions (66% to 83%)
    tl.to('.scene5-chars .split-char', { opacity: 1, y: 0, rotateX: 0, stagger: 0.05, duration: 1, ease: 'elastic.out(1, 0.3)' }, 6.8)
      .to('.scene5-text', { opacity: 0, duration: 1 }, 8.0);

    // Scene 6: Global Earth (83% to 100%)
    tl.to('.scene6-chars .split-char', { opacity: 1, y: 0, rotateX: 0, stagger: 0.03, duration: 1.5, ease: 'power4.out' }, 8.5)
      .to('.cta-btn', { opacity: 1, y: 0, duration: 1, ease: 'back.out(1.5)' }, 9.5);

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full h-full relative pointer-events-none flex flex-col items-center justify-center text-center">
      
      {/* Persistent Floating Header Navigation */}
      <div className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between pointer-events-auto px-6 py-3 rounded-full bg-black/60 border border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <BrainCircuit className="w-6 h-6 text-amber-400" />
          <span className="font-bold tracking-wider text-sm text-white">SYNAPS AI</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setVideoModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Watch Demo Video
          </button>
          <Link 
            href="/demo" 
            className="px-5 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(234,179,8,0.4)]"
          >
            Launch Demo
          </Link>
        </div>
      </div>

      {/* SCENE 1: Chaos */}
      <div className="scene1-text absolute flex flex-col items-center justify-center font-['Playfair_Display',_serif]">
        <h1 className="text-6xl md:text-[8rem] tracking-[0.3em] uppercase font-black text-white/50 scene1-chars perspective-1000">
          {splitText("CHAOS")}
        </h1>
      </div>

      {/* SCENE 2: Data */}
      <div className="scene2-text absolute flex flex-col items-center justify-center font-sans">
        <h2 className="text-4xl md:text-7xl font-bold tracking-[0.5em] text-[#EAB308] uppercase scene2-chars perspective-1000">
          {splitText("STRUCTURED DATA")}
        </h2>
      </div>

      {/* SCENE 3: Intelligence (The Core) */}
      <div className="scene3-text absolute flex flex-col items-center justify-center opacity-0 scale-50 blur-xl font-['Playfair_Display',_serif]">
        <h2 className="text-5xl md:text-9xl font-thin tracking-widest text-white uppercase drop-shadow-[0_0_50px_rgba(255,255,255,0.8)]">
          Intelligence
        </h2>
        <div className="w-[1px] h-24 bg-white mx-auto mt-8 opacity-50" />
      </div>

      {/* SCENE 4: Simulation */}
      <div className="scene4-text absolute flex flex-col items-center justify-center font-['Playfair_Display',_serif]">
        <h2 className="text-5xl md:text-8xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#6D67B2] to-[#EAB308] uppercase scene4-chars perspective-1000">
          {splitText("SIMULATION")}
        </h2>
        <p className="mt-6 text-xl tracking-widest text-white/70 uppercase">Every outcome calculated instantly.</p>
      </div>

      {/* SCENE 5: Decisions */}
      <div className="scene5-text absolute flex flex-col items-center justify-center font-sans">
        <h2 className="text-6xl md:text-9xl font-black tracking-[0.4em] text-white uppercase scene5-chars perspective-1000 drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
          {splitText("DECISIONS")}
        </h2>
      </div>

      {/* SCENE 6: Global Intelligence & Cluely-style Video Showcase */}
      <div className="scene6-text absolute flex flex-col items-center justify-center bg-black/60 backdrop-blur-md w-full h-full pointer-events-auto px-4 overflow-y-auto py-20">
        <h1 className="text-4xl md:text-6xl font-['Playfair_Display',_serif] leading-tight text-center max-w-4xl font-light text-white scene6-chars perspective-1000">
          {splitText("Global Enterprise Intelligence.")}
        </h1>

        {/* Embedded Landing Video Showcase Frame */}
        <div className="w-full max-w-4xl mx-auto mt-8 relative group">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500 via-purple-500 to-indigo-500 opacity-40 blur-xl group-hover:opacity-70 transition duration-1000" />
          
          <div className="relative bg-[#0d0d12] border border-white/20 rounded-3xl p-2 md:p-3 shadow-[0_0_80px_rgba(234,179,8,0.3)]">
            <div className="flex items-center justify-between px-4 py-2 bg-[#161622] rounded-t-2xl border-b border-white/10 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs text-white/50 font-mono ml-2">synaps-landing-video.mp4</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-0.5 rounded-full border border-amber-500/20">
                Official Product Demo
              </span>
            </div>

            <video
              src="/synaps-landing-video.mp4"
              autoPlay
              muted
              loop
              playsInline
              controls
              className="w-full h-auto max-h-[50vh] rounded-2xl border border-white/10 shadow-2xl object-contain bg-black"
            />
          </div>
        </div>

        <div className="cta-btn mt-10 opacity-0 translate-y-10 flex flex-wrap items-center justify-center gap-4">
          <Link 
            href="/demo" 
            className="px-10 py-5 bg-amber-500 text-black font-extrabold text-lg uppercase tracking-[0.2em] rounded-full hover:bg-amber-400 hover:scale-105 hover:shadow-[0_0_50px_rgba(234,179,8,0.6)] transition-all duration-300 inline-block"
          >
            Enter Synaps OS
          </Link>
        </div>
      </div>

      {/* Video Modal Triggered via Header Button */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10 pointer-events-auto animate-in fade-in duration-300">
          <button 
            onClick={() => setVideoModalOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 p-3 rounded-full border border-white/20 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="w-full max-w-5xl bg-[#0b0b10] border border-white/20 rounded-3xl p-3 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#14141e] rounded-t-2xl border-b border-white/10 mb-2">
              <span className="text-xs text-white/60 font-mono">synaps-landing-video.mp4 — Full Resolution</span>
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
