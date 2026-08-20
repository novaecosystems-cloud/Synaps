'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, FileText, Lock, Sparkles, Plus, CheckCircle2, Globe, Cpu, Zap, Activity, Layers, Terminal, Command, Database, Share2, Code2 } from 'lucide-react';
import SignInModal from '@/components/SignInModal';
import SignInCardInline from '@/components/SignInCardInline';

// Contra Labs 3D Floating Scatter Card Items for Synaps AI
const FLOATING_CARDS = [
  { id: '1', title: '3D Knowledge Graph', desc: '48.2K nodes linked with sub-second vector RAG retrieval.', icon: Database, tag: 'VECTOR ENGINE', pos: 'top-[12%] left-[8%] md:left-[12%]', rot: 'rotate-[-3deg]' },
  { id: '2', title: '10-Agent AI Boardroom', desc: 'Autonomous consensus evaluation across Chief of Staff, CFO & Legal Counsel.', icon: Cpu, tag: 'CONSENSUS ENGINE', pos: 'top-[8%] right-[8%] md:right-[14%]', rot: 'rotate-[4deg]' },
  { id: '3', title: 'Line-Level Evidence', desc: '100% verifiable citations mapped directly to source PDF pages.', icon: ShieldCheck, tag: 'ZERO HALLUCINATION', pos: 'top-[52%] left-[4%] md:left-[8%]', rot: 'rotate-[2deg]' },
  { id: '4', title: 'DPDP & GDPR Compliance', desc: 'Multi-tenant database isolation & client-side encryption.', icon: Lock, tag: 'SECURITY SLA', pos: 'top-[58%] right-[4%] md:right-[10%]', rot: 'rotate-[-4deg]' },
  { id: '5', title: 'Pagebuddy Document Studio', desc: 'Interactive block editing, semantic formatting & real-time export.', icon: FileText, tag: 'DOC INTEL', pos: 'bottom-[12%] left-[20%]', rot: 'rotate-[1deg]' },
  { id: '6', title: 'Chief of Staff Briefings', desc: 'Automated executive briefings, risk alerts & milestone tracking.', icon: Zap, tag: 'EXECUTIVE INTELLIGENCE', pos: 'bottom-[10%] right-[22%]', rot: 'rotate-[-2deg]' },
];

export default function MinimalistProductLanding() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth mouse tilt parallax for 3D scatter grid
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const openModal = useCallback(() => setShowSignIn(true), []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FBFAF6] text-[#2B2B29] font-sans selection:bg-[#C8E1DD] selection:text-[#2B2B29] relative overflow-x-hidden">
      
      {/* ── CONTRA LABS STYLING & ANIMATION TOKENS ────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

        .font-serif-editorial {
          font-family: 'Source Serif 4', Georgia, serif;
          letter-spacing: -0.035em;
        }

        .font-mono-code {
          font-family: 'JetBrains Mono', monospace;
        }

        /* Contra Labs 3D Scatter Card Tilt */
        .contra-scatter-card {
          transform-style: preserve-3d;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease, background-color 0.4s ease;
          will-change: transform;
        }
        .contra-scatter-card:hover {
          transform: perspective(1000px) rotateX(6deg) rotateY(-6deg) translateY(-10px) scale(1.04) !important;
          border-color: #2B2B29 !important;
          box-shadow: 0 24px 60px -12px rgba(43, 43, 41, 0.25);
          background-color: #FFFFFF !important;
        }

        /* Contra Corner Crosshair Accents */
        .contra-grid-tile {
          position: relative;
        }
        .contra-grid-tile::before {
          content: '+';
          position: absolute;
          top: -8px;
          left: -6px;
          font-family: monospace;
          font-size: 14px;
          color: #2B2B29;
          opacity: 0.4;
        }
        .contra-grid-tile::after {
          content: '+';
          position: absolute;
          top: -8px;
          right: -6px;
          font-family: monospace;
          font-size: 14px;
          color: #2B2B29;
          opacity: 0.4;
        }

        @keyframes subtleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .contra-float-anim {
          animation: subtleFloat 6s ease-in-out infinite;
        }
      `}</style>

      {/* ── TOP HEADER / NAVBAR ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-[#FBFAF6]/80 backdrop-blur-md border-b border-[#2B2B29]/10 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-[#2B2B29] text-[#FBFAF6] flex items-center justify-center font-serif-editorial font-bold text-xl group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-serif-editorial font-bold text-lg leading-none text-[#2B2B29]">
                SYNAPS <span className="font-sans font-medium text-xs text-[#387478]">LABS</span>
              </span>
              <span className="font-mono-code text-[10px] text-[#2B2B29]/60 tracking-wider">ENTERPRISE MEMORY OS</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#2B2B29]/80">
            <a href="#features" className="hover:text-[#2B2B29] transition-colors">Architecture</a>
            <a href="#boardroom" className="hover:text-[#2B2B29] transition-colors">AI Boardroom</a>
            <a href="#graph" className="hover:text-[#2B2B29] transition-colors">3D Graph</a>
            <a href="#security" className="hover:text-[#2B2B29] transition-colors">Security SLA</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={openModal}
              className="px-5 py-2.5 rounded-lg border border-[#2B2B29] bg-transparent text-[#2B2B29] text-xs font-mono-code font-bold uppercase tracking-wider hover:bg-[#2B2B29] hover:text-[#FBFAF6] transition-all"
            >
              Sign In
            </button>
            
            <button
              onClick={openModal}
              className="px-5 py-2.5 rounded-lg bg-[#2B2B29] text-[#FBFAF6] text-xs font-mono-code font-bold uppercase tracking-wider hover:bg-[#387478] transition-all flex items-center gap-2 shadow-sm"
            >
              <span>Launch OS</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION (Contra Labs Style Serif & 3D Parallax Scatter) ─── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden">
        
        {/* Subtle Background Accent Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(#2B2B29_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04] pointer-events-none" />

        {/* Floating 3D Cards in Mouse Parallax Space */}
        <div 
          className="absolute inset-0 pointer-events-none hidden lg:block"
          style={{
            transform: `perspective(1000px) rotateX(${mousePos.y * 0.2}deg) rotateY(${mousePos.x * 0.2}deg)`,
            transition: 'transform 0.2s ease-out',
          }}
        >
          {FLOATING_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={openModal}
                className={`absolute ${card.pos} ${card.rot} pointer-events-auto cursor-pointer contra-scatter-card w-72 p-5 rounded-2xl border border-[#2B2B29]/15 bg-[#FBFAF6]/90 backdrop-blur-md shadow-lg text-left`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono-code text-[10px] font-bold text-[#387478] bg-[#C8E1DD] px-2 py-0.5 rounded border border-[#387478]/20">
                    {card.tag}
                  </span>
                  <Icon className="w-4 h-4 text-[#2B2B29]" />
                </div>
                <h4 className="font-serif-editorial font-bold text-base text-[#2B2B29] mb-1">
                  {card.title}
                </h4>
                <p className="text-xs text-[#2B2B29]/70 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Hero Title & Main Headline */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#2B2B29]/20 bg-[#C8E1DD]/40 text-xs font-mono-code text-[#2B2B29] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#387478] animate-ping" />
            <span>SYNAPS 4.0 · CONTRA LABS EDITION</span>
          </div>

          <h1 className="font-serif-editorial text-5xl sm:text-7xl md:text-8xl font-normal text-[#2B2B29] leading-[0.98] tracking-tight">
            The frontier <span className="italic font-normal text-[#387478]">enterprise data</span> &amp; intelligence OS.
          </h1>

          <p className="text-base sm:text-xl text-[#2B2B29]/80 max-w-2xl mx-auto font-sans leading-relaxed">
            Transform unstructured PDFs, contracts, and financial libraries into a 100% grounded 3D Knowledge Graph with an autonomous 10-agent executive boardroom.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={openModal}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#2B2B29] text-[#FBFAF6] font-mono-code font-bold text-xs uppercase tracking-widest hover:bg-[#387478] transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
            >
              <span>Explore Synaps Workspace</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={openModal}
              className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-[#2B2B29] bg-transparent text-[#2B2B29] font-mono-code font-bold text-xs uppercase tracking-widest hover:bg-[#C8E1DD] transition-all flex items-center justify-center gap-2"
            >
              <span>View 3D Demo Graph</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── CONTRA LABS GRID FEATURES SECTION ────────────────────────────── */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto border-t border-[#2B2B29]/10">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <span className="font-mono-code text-xs text-[#387478] font-bold uppercase tracking-widest block mb-2">// CORE PLATFORM ARCHITECTURE</span>
          <h2 className="font-serif-editorial text-4xl sm:text-6xl text-[#2B2B29]">
            Engineered for <span className="italic">zero hallucination.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#2B2B29]/70 mt-3 font-sans">
            Standard AI guesses when uncertain. Synaps forces strict line-level page citations across every response or refuses to output.
          </p>
        </div>

        {/* 4-Grid Feature Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <div className="contra-grid-tile p-8 rounded-2xl border border-[#2B2B29]/15 bg-[#FBFAF6] hover:bg-white transition-all space-y-4 shadow-sm hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-[#C8E1DD] text-[#2B2B29] flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="font-serif-editorial text-2xl font-semibold text-[#2B2B29]">
              3D Vector RAG Graph
            </h3>
            <p className="text-sm text-[#2B2B29]/70 leading-relaxed font-sans">
              Parses PDFs, Word files, and raw data into 3D semantic nodes with relationship edge mapping.
            </p>
          </div>

          <div className="contra-grid-tile p-8 rounded-2xl border border-[#2B2B29]/15 bg-[#FBFAF6] hover:bg-white transition-all space-y-4 shadow-sm hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-[#C8E1DD] text-[#2B2B29] flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-serif-editorial text-2xl font-semibold text-[#2B2B29]">
              10-Agent AI Boardroom
            </h3>
            <p className="text-sm text-[#2B2B29]/70 leading-relaxed font-sans">
              Simulates multi-perspective executive debate between CFO, Legal Counsel, CTO, and Chief of Staff personas.
            </p>
          </div>

          <div className="contra-grid-tile p-8 rounded-2xl border border-[#2B2B29]/15 bg-[#FBFAF6] hover:bg-white transition-all space-y-4 shadow-sm hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-[#C8E1DD] text-[#2B2B29] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif-editorial text-2xl font-semibold text-[#2B2B29]">
              DPDP &amp; GDPR Compliance
            </h3>
            <p className="text-sm text-[#2B2B29]/70 leading-relaxed font-sans">
              Tenant database isolation and HttpOnly session cookie hardening keep your corporate documents confidential.
            </p>
          </div>

        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="py-12 px-6 border-t border-[#2B2B29]/10 bg-[#2B2B29] text-[#FBFAF6]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-serif-editorial font-bold text-lg">SYNAPS AI</span>
            <span className="text-xs font-mono-code text-[#C8E1DD]">© 2026 SYNAPS LABS INC. ALL RIGHTS RESERVED.</span>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono-code text-[#FBFAF6]/70">
            <button onClick={openModal} className="hover:text-white transition-colors">TERMS OF SERVICE</button>
            <button onClick={openModal} className="hover:text-white transition-colors">PRIVACY POLICY</button>
            <button onClick={openModal} className="hover:text-white transition-colors">SECURITY SLA</button>
          </div>
        </div>
      </footer>

      {/* Sign In Modal */}
      <SignInModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
    </div>
  );
}
