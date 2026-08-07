'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, ShieldCheck, CheckCircle2, FileText, Lock, Volume2, VolumeX, Sparkles, ChevronRight, Plus } from 'lucide-react';
import SignInModal from '@/components/SignInModal';

gsap.registerPlugin(ScrollTrigger);

// ─── DATA ─────────────────────────────────────────────────────────────────────
const ACCORDION_TOGGLES = [
  {
    id: '01',
    title: 'DOCUMENT REASONING & PARSING',
    subtitle: 'INGEST PDF, EXCEL, DOCX, CSV IN SECONDS',
    content: 'Synaps parses multi-hundred-page PDFs, complex financial spreadsheets, and legal agreements with zero data loss. Line-level vector embeddings ground every answer directly in your source documents.',
  },
  {
    id: '02',
    title: '10-AGENT BOARDROOM CONSENSUS',
    subtitle: 'MULTI-AGENT RISK & OBLIGATION DEBATE',
    content: 'Ten specialized AI agents (Legal, Financial, Compliance, Risk, Security) analyze your input simultaneously. They debate vulnerabilities, flag hidden liabilities, and produce an auditable consensus brief.',
  },
  {
    id: '03',
    title: '3D ENTERPRISE MEMORY GRAPH',
    subtitle: 'NEURAL RELATIONSHIP VISUALISATION',
    content: 'Connect entity relationships across your entire company database. Synaps maps contracts to projects, requirements to regulations, and personnel to risk exposure in an interactive 3D graph.',
  },
  {
    id: '04',
    title: 'ZERO-TRUST VAULT & DPDP COMPLIANCE',
    subtitle: 'AES-256 ENCRYPTION & MULTI-TENANT ISOLATION',
    content: 'Built from day one to comply with India\'s DPDP Act 2023 and global SOC2 standards. Your tenant data is physically isolated, session cookies are HTTP-Only, and zero user data is ever trained on.',
  },
];

const MARQUEE_ITEMS = [
  'HASHGRAPH REASONING ENGINE',
  '10-AGENT BOARDROOM DEBATE',
  'EVIDENCE-GROUNDED RAG',
  'ZERO-HALLUCINATION GUARANTEE',
  'DPDP ACT 2023 COMPLIANT',
  '3D KNOWLEDGE GRAPH',
  'LINE-LEVEL SOURCE CITATIONS',
  'AES-256 ZERO-TRUST VAULT',
];

export default function HybridVentureLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [soundActive, setSoundActive] = useState(false);
  const [openToggle, setOpenToggle] = useState<string | null>('01');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── GSAP ANIMATIONS ──────────────────────────────────────────────────────────
  useGSAP(() => {
    // 1. Text splitter reveal animation (Hashgraph style cubic-bezier)
    gsap.utils.toArray<HTMLElement>('[data-anim-word]').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
        y: '75%',
        opacity: 0,
        duration: 0.8,
        ease: 'cubic-bezier(0.14, 1, 0.34, 1)',
      });
    });

    // 2. Dash reveal vertical lines
    gsap.utils.toArray<HTMLElement>('[data-dash-reveal]').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%' },
        scaleY: 0,
        transformOrigin: 'top center',
        duration: 1.2,
        ease: 'cubic-bezier(0.14, 1, 0.34, 1)',
      });
    });

    // 3. Staggered fade in
    gsap.utils.toArray<HTMLElement>('[data-anim-fade]').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%' },
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
      });
    });
  }, { scope: containerRef });

  return (
    <>
      {/* ── Google & Theme Fonts Preload ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Teko:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

        :root {
          --bg-hashgraph: #000209;
          --bg-iberian: #fe3e29;
          --color-cream: #f4f2ea;
          --color-offwhite: #ebe9e0;
          --color-cyan-glow: #9bb8e1;
          --color-blue-dark: #2c4e73;
          --color-[#7c3aed]: #7c3aed;
        }

        body {
          background-color: var(--bg-hashgraph);
          color: #eee;
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          overflow-x: hidden;
        }

        /* Typography Classes */
        .ff-teko {
          font-family: 'Teko', sans-serif;
          text-transform: uppercase;
          line-height: 0.85em;
          letter-spacing: 0.02em;
        }

        .ff-vulf-mono {
          font-family: 'JetBrains Mono', monospace;
          text-transform: uppercase;
          letter-spacing: -0.03em;
        }

        .ff-sans {
          font-family: 'Space Grotesk', sans-serif;
        }

        /* Gradient text identifier */
        .text-gradient-cyan {
          background: linear-gradient(90deg, #9bb8e1, #7c3aed, #2c4e73);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Shimmer Button (Hashgraph style) */
        .btn-hashgraph {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 3.4rem;
          padding: 0 2.4rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-weight: 700;
          color: #eee;
          background: transparent;
          border: none;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          overflow: hidden;
          border-radius: 6px;
        }

        .btn-hashgraph:before {
          content: "";
          position: absolute;
          inset: 0;
          border: 2px solid #9bb8e1;
          border-radius: 6px;
          filter: blur(4px);
          opacity: 0;
          transition: opacity 0.6s cubic-bezier(0.14, 1, 0.34, 1);
        }

        .btn-hashgraph:hover:before {
          opacity: 1;
        }

        .btn-hashgraph-bg {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(155, 184, 225, 0.3);
          border-radius: 6px;
          background: rgba(155, 184, 225, 0.05);
          transition: background 0.3s ease, border-color 0.3s ease;
        }

        .btn-hashgraph:hover .btn-hashgraph-bg {
          background: rgba(155, 184, 225, 0.15);
          border-color: #9bb8e1;
        }

        /* Iberian Wave */
        .wave-svg {
          width: 300%;
          height: 80px;
          fill: var(--bg-hashgraph);
        }

        /* Rotating Badge */
        @keyframes rotateBadge {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .badge-rotate {
          animation: rotateBadge 35s linear infinite;
        }

        /* Custom Scrollbar Progress */
        .scrollbar-progress-bar {
          position: fixed;
          top: 0;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, #9bb8e1, #7c3aed, #fe3e29);
          z-index: 9999;
          transition: width 0.1s linear;
        }
      `}</style>

      {/* ── Top Progress Line ── */}
      <div className="scrollbar-progress-bar" style={{ width: `${scrollProgress}%` }} />

      <div ref={containerRef} className="relative min-h-screen bg-[#000209] text-[#eee]">

        {/* ── FIXED HEADER (Hashgraph + Iberian Hybrid) ───────────────────── */}
        <header className="fixed top-0 left-0 w-full z-50 px-6 lg:px-16 py-6 flex items-center justify-between pointer-events-none">
          {/* Logo */}
          <div className="flex items-center gap-3 pointer-events-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c3aed] via-[#2c4e73] to-[#9bb8e1] p-[1px] shadow-[0_0_20px_rgba(155,184,225,0.3)]">
              <div className="w-full h-full bg-[#000209] rounded-xl flex items-center justify-center">
                <span className="ff-teko text-2xl text-[#9bb8e1] font-bold">S</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="ff-teko text-2xl tracking-wider text-white font-bold leading-none">SYNAPS AI</span>
              <span className="ff-vulf-mono text-[9px] text-[#9bb8e1] tracking-widest opacity-80">ENTERPRISE BRAIN</span>
            </div>
          </div>

          {/* Sound / Mode Toggle */}
          <div className="flex items-center gap-4 pointer-events-auto">
            <button
              onClick={() => setSoundActive(!soundActive)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-[#9bb8e1]/20 bg-[#000209]/80 backdrop-blur-md text-xs text-[#9bb8e1] hover:border-[#9bb8e1]/60 transition-all"
            >
              {soundActive ? <Volume2 className="w-3.5 h-3.5 text-[#7c3aed] animate-pulse" /> : <VolumeX className="w-3.5 h-3.5 opacity-50" />}
              <span className="ff-vulf-mono text-[10px] tracking-wider">
                GROUNDING: <span className={soundActive ? 'text-[#9bb8e1]' : 'text-slate-500'}>{soundActive ? 'LIVE WEB ON' : 'DOCUMENTS ONLY'}</span>
              </span>
            </button>

            <button
              onClick={() => setShowSignInModal(true)}
              className="btn-hashgraph pointer-events-auto"
            >
              <span className="btn-hashgraph-bg" />
              <span className="relative z-10 flex items-center gap-2">
                LAUNCH SYSTEM <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        </header>

        {/* ── HERO SECTION (Hashgraph Cyber-Dark + Massive Teko Headlines) ────── */}
        <section className="relative min-h-screen flex flex-col justify-end pb-16 px-6 lg:px-16 pt-32 overflow-hidden">
          {/* Background Ambient Glow Orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-[#7c3aed]/20 via-[#2c4e73]/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#9bb8e1]/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Rotating Radial Text Badge (Iberian Style) */}
          <div className="absolute top-36 right-10 lg:right-24 hidden md:flex items-center justify-center w-36 h-36 pointer-events-none">
            <svg className="w-full h-full badge-rotate" viewBox="0 0 100 100">
              <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
              <text fill="#9bb8e1" className="ff-vulf-mono text-[8px] tracking-[0.25em]">
                <textPath href="#circlePath">SYNAPS AI · 10-AGENT BOARDROOM · EVIDENCE GROUNDED ·</textPath>
              </text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#7c3aed]" />
            </div>
          </div>

          <div className="max-w-6xl z-10">
            {/* Section Tag */}
            <div className="flex items-center gap-3 mb-6" data-anim-fade>
              <span className="w-8 h-[2px] bg-gradient-to-r from-[#9bb8e1] to-transparent" />
              <span className="ff-vulf-mono text-xs text-[#9bb8e1] tracking-widest uppercase">
                SYSTEM VERSION 3.4 · DPDP ACT COMPLIANT
              </span>
            </div>

            {/* Massive Display Title (Teko + Vulf Mono) */}
            <h1 className="ff-teko text-[clamp(4.5rem,11vw,13rem)] leading-[0.82] text-white tracking-wide uppercase mb-6">
              <span className="block overflow-hidden">
                <span className="block" data-anim-word>EVIDENCE GROUNDED</span>
              </span>
              <span className="block overflow-hidden text-gradient-cyan">
                <span className="block" data-anim-word>ENTERPRISE BRAIN</span>
              </span>
            </h1>

            {/* Secondary Copy (Parabole / Space Grotesk) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mt-8">
              <p className="md:col-span-7 text-lg lg:text-xl text-[#b7c6d4] leading-relaxed font-light" data-anim-fade>
                Synaps transforms complex organizational documents, contracts, and datasets into an interactive, 
                auditable knowledge graph. Powered by a 10-agent boardroom debate engine.
              </p>

              <div className="md:col-span-5 flex flex-col gap-4" data-anim-fade>
                <div className="flex items-center gap-4 text-xs font-mono text-[#9bb8e1]/70 border-l-2 border-[#9bb8e1] pl-4 py-1">
                  <span>PDF · EXCEL · DOCX · CSV</span>
                  <span>|</span>
                  <span>ZERO HALLUCINATIONS</span>
                </div>
                <button
                  onClick={() => setShowSignInModal(true)}
                  className="btn-hashgraph w-full sm:w-auto self-start"
                >
                  <span className="btn-hashgraph-bg" />
                  <span className="relative z-10 flex items-center justify-center gap-3 py-1">
                    START ENTERPRISE FREE TRIAL <ArrowRight className="w-4 h-4 text-[#9bb8e1]" />
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Vertical Dash Reveal Line (Hashgraph Style) */}
          <div className="absolute bottom-0 right-16 w-[1px] h-32 bg-gradient-to-b from-transparent to-[#9bb8e1]/40 hidden lg:block" data-dash-reveal />
        </section>

        {/* ── TICKER STRIP ─────────────────────────────────────────────────── */}
        <div className="w-full bg-[#050914] border-y border-[#9bb8e1]/10 py-4 overflow-hidden whitespace-nowrap">
          <div className="inline-flex gap-12 animate-[marquee_30s_linear_infinite]">
            {MARQUEE_ITEMS.concat(MARQUEE_ITEMS).map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs font-mono text-[#9bb8e1]/80 tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 01: SYSTEM FEATURES (Iberian Accordion + Hashgraph Cards) ────── */}
        <section className="py-24 px-6 lg:px-16 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start mb-16 gap-6">
            <div>
              <span className="ff-vulf-mono text-xs text-[#9bb8e1] tracking-widest uppercase block mb-2">
                // SYSTEM ARCHITECTURE
              </span>
              <h2 className="ff-teko text-6xl lg:text-8xl text-white font-bold leading-none tracking-wide">
                BUILT FOR ZERO RISK
              </h2>
            </div>
            <p className="text-[#b7c6d4] max-w-md text-sm lg:text-base leading-relaxed">
              Standard LLMs guess when they don&apos;t know. Synaps requires line-level evidence for every claim 
              or refuses to answer.
            </p>
          </div>

          {/* Accordion Toggles List (Iberian Style) */}
          <div className="flex flex-col border-t border-[#9bb8e1]/20">
            {ACCORDION_TOGGLES.map((item) => {
              const isOpen = openToggle === item.id;
              return (
                <div
                  key={item.id}
                  className="border-b border-[#9bb8e1]/20 transition-colors duration-300"
                >
                  <button
                    onClick={() => setOpenToggle(isOpen ? null : item.id)}
                    className="w-full py-8 flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center gap-6 lg:gap-12">
                      <span className="ff-vulf-mono text-lg lg:text-2xl text-[#9bb8e1]/50 group-hover:text-[#9bb8e1] transition-colors">
                        [{item.id}]
                      </span>
                      <div>
                        <h3 className="ff-teko text-3xl lg:text-5xl text-white tracking-wider group-hover:text-[#9bb8e1] transition-colors leading-none">
                          {item.title}
                        </h3>
                        <span className="ff-vulf-mono text-[10px] lg:text-xs text-slate-400 tracking-widest block mt-1">
                          {item.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className={`w-10 h-10 rounded-full border border-[#9bb8e1]/30 flex items-center justify-center text-[#9bb8e1] transition-transform duration-300 ${isOpen ? 'rotate-[135deg] bg-[#7c3aed]/20 border-[#7c3aed]' : 'group-hover:border-[#9bb8e1]'}`}>
                      <Plus className="w-5 h-5" />
                    </div>
                  </button>

                  {/* Expandable Content */}
                  {isOpen && (
                    <div className="pb-8 pl-16 lg:pl-28 pr-6 max-w-4xl text-[#b7c6d4] text-base leading-relaxed animate-fadeIn">
                      <p className="bg-[#050914] p-6 rounded-xl border border-[#9bb8e1]/10 text-slate-300 font-light">
                        {item.content}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SECTION 02: 10-AGENT BOARDROOM VISUALIZER (Dark Cyberpunk) ── */}
        <section className="py-24 px-6 lg:px-16 bg-[#050914] border-y border-[#9bb8e1]/10 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="ff-vulf-mono text-xs text-[#7c3aed] tracking-widest uppercase block mb-3">
                // PARALLEL REASONING ENGINE
              </span>
              <h2 className="ff-teko text-6xl lg:text-8xl text-white font-bold tracking-wide">
                THE 10-AGENT BOARDROOM
              </h2>
              <p className="text-[#b7c6d4] text-base mt-2">
                Watch specialized AI personas analyze your documents in real-time before finalizing decisions.
              </p>
            </div>

            {/* Grid of Agents */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { title: 'CHIEF OF STAFF', role: 'Strategic Alignment', icon: ShieldCheck },
                { title: 'LEGAL COUNSEL', role: 'Liability & Contract Clause', icon: FileText },
                { title: 'CHIEF FINANCIAL OFFICER', role: 'Capital & ROI Exposure', icon: CheckCircle2 },
                { title: 'RISK AUDITOR', role: 'Vulnerability Detection', icon: Lock },
                { title: 'COMPLIANCE OFFICER', role: 'DPDP & Regulatory Match', icon: Sparkles },
                { title: 'ENGINEERING LEAD', role: 'Technical Feasibility', icon: ShieldCheck },
                { title: 'MARKETING STRATEGIST', role: 'Market Position Impact', icon: FileText },
                { title: 'OPERATIONS HEAD', role: 'Workflow Bottlenecks', icon: CheckCircle2 },
                { title: 'SECURITY ARCHITECT', role: 'Zero-Trust Isolation', icon: Lock },
                { title: 'DIGITAL TWIN OS', role: 'Executive Consensus', icon: Sparkles },
              ].map((agent, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#000209] border border-[#9bb8e1]/15 hover:border-[#7c3aed]/50 transition-all group hover:-translate-y-1"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/30 flex items-center justify-center text-[#9bb8e1] mb-4 group-hover:scale-110 transition-transform">
                    <agent.icon className="w-4 h-4" />
                  </div>
                  <h4 className="ff-teko text-xl text-white tracking-wider leading-none mb-1 group-hover:text-[#9bb8e1]">
                    {agent.title}
                  </h4>
                  <p className="ff-vulf-mono text-[10px] text-slate-400 tracking-tight">
                    {agent.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CALL TO ACTION SECTION (High Contrast Iberian Vermilion Accent) ────── */}
        <section className="py-32 px-6 lg:px-16 bg-gradient-to-b from-[#000209] via-[#0b0410] to-[#000209] text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <span className="ff-vulf-mono text-xs text-[#fe3e29] tracking-widest uppercase block mb-4">
              // READY TO TRANSFORM YOUR ENTERPRISE WORKFLOW?
            </span>
            <h2 className="ff-teko text-7xl lg:text-9xl text-white font-bold leading-none tracking-wide mb-8">
              START REASONING WITH SYNAPS
            </h2>
            <p className="text-[#b7c6d4] text-lg lg:text-xl font-light max-w-2xl mx-auto mb-10">
              No credit card required. Upload your first document set and experience evidence-grounded AI 
              in less than 2 minutes.
            </p>

            <button
              onClick={() => setShowSignInModal(true)}
              className="btn-hashgraph text-lg py-6 px-10"
            >
              <span className="btn-hashgraph-bg bg-[#fe3e29]/15 border-[#fe3e29]" />
              <span className="relative z-10 flex items-center gap-3">
                ACCESS SYSTEM NOW <ChevronRight className="w-5 h-5 text-[#fe3e29]" />
              </span>
            </button>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
        <footer className="py-12 px-6 lg:px-16 border-t border-[#9bb8e1]/10 bg-[#000209] text-slate-500 text-xs font-mono flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="ff-teko text-2xl text-white font-bold tracking-wider">SYNAPS AI</span>
            <span>·</span>
            <span>© {new Date().getFullYear()} SYNAPS SYSTEMS</span>
          </div>

          <div className="flex items-center gap-6 text-[#9bb8e1]/70">
            <a href="/dashboard/chat" className="hover:text-white transition-colors">AI CHAT</a>
            <a href="/dashboard/documents" className="hover:text-white transition-colors">DOCUMENTS</a>
            <a href="/dashboard/graph" className="hover:text-white transition-colors">MEMORY GRAPH</a>
            <a href="#" className="hover:text-white transition-colors">PRIVACY & DPDP</a>
          </div>
        </footer>

        {/* Auth Modal */}
        {showSignInModal && (
          <SignInModal onClose={() => setShowSignInModal(false)} />
        )}
      </div>
    </>
  );
}
