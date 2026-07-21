"use client";

import React, { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

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

      {/* SCENE 6: Global Intelligence */}
      <div className="scene6-text absolute flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm w-full h-full pointer-events-auto">
        <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-['Playfair_Display',_serif] leading-tight text-center max-w-5xl font-light text-white scene6-chars perspective-1000">
          {splitText("Global Enterprise Intelligence.")}
        </h1>
        <div 
          className="cta-btn mt-16 opacity-0 translate-y-10"
        >
          <Link 
            href="/register" 
            className="px-12 py-6 bg-white text-black font-bold text-xl uppercase tracking-[0.2em] rounded-full hover:bg-[#EAB308] hover:scale-110 hover:shadow-[0_0_50px_rgba(234,179,8,0.6)] transition-all duration-500 inline-block"
          >
            Enter Synaps
          </Link>
        </div>
      </div>

    </div>
  );
}
