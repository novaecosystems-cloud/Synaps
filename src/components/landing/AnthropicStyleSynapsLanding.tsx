'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle,
  FileText, Sparkles, Eye, Check, ExternalLink, ChevronRight,
  Lock, FileSpreadsheet, Building2, Search, X, Cookie,
  PenTool, GraduationCap, Code2, FolderOpen, Calendar, AudioWaveform, ChevronDown, Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import SignInModal from '@/components/SignInModal';

gsap.registerPlugin(ScrollTrigger);

export default function AnthropicStyleSynapsLanding() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Sign In Modal & Navattic Interactive Demo State
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showNavatticModal, setShowNavatticModal] = useState(false);
  const [demoView, setDemoView] = useState<'navattic' | 'ai'>('navattic');
  const [activeTab, setActiveTab] = useState<'grounding' | 'boardroom' | 'security'>('grounding');
  const [promptText, setPromptText] = useState("What price escalation risks exist in our 2026 Master Services Agreement?");
  const [selectedModel, setSelectedModel] = useState("Gemini 1.5 Pro");

  useEffect(() => {
    // Dynamically load Navattic embed script
    const scriptUrl = "https://js.navattic.com/embeds.js";
    if (!document.querySelector(`script[src="${scriptUrl}"]`)) {
      const script = document.createElement("script");
      script.src = scriptUrl;
      script.async = true;
      script.onload = () => {
        if ((window as any).NavatticEmbed) {
          (window as any).NavatticEmbed.loadEmbeds();
        }
      };
      document.body.appendChild(script);
    }
  }, []);

  // GSAP Editorial Staggered Reveals
  useGSAP(() => {
    // Word/heading reveal animation matching Anthropic's style
    gsap.from('.anthropic-hero-title', {
      opacity: 0,
      y: 28,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.anthropic-hero-sub', {
      opacity: 0,
      y: 20,
      duration: 0.9,
      delay: 0.2,
      ease: 'power3.out'
    });

    gsap.from('.anthropic-hero-cta', {
      opacity: 0,
      y: 15,
      duration: 0.8,
      delay: 0.4,
      ease: 'power3.out'
    });

    gsap.from('.anthropic-stage', {
      opacity: 0,
      y: 35,
      duration: 1.1,
      delay: 0.5,
      ease: 'power3.out'
    });

    // Scroll triggered card reveals
    gsap.utils.toArray<HTMLElement>('.anthropic-reveal').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: 'power3.out'
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0B0A12] text-[#EDEBF5] font-sans antialiased selection:bg-[#7C3AED] selection:text-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(124,58,237,0.25),rgba(255,255,255,0))]">
      
      {/* ── CLUELY TYPOGRAPHY & ANIMATION STYLES ── */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        
        .font-serif-garamond {
          font-family: 'EB Garamond', Georgia, serif;
        }
        .font-sans-cluely {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .font-mono-cluely {
          font-family: 'JetBrains Mono', monospace;
        }

        @keyframes hero-word-rise {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0%);
            opacity: 1;
          }
        }

        @keyframes hero-fade-up {
          0% {
            transform: translateY(16px);
            opacity: 0;
          }
          100% {
            transform: translateY(0%);
            opacity: 1;
          }
        }

        .hero-word-rise {
          display: inline-block;
          animation: hero-word-rise 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .hero-fade-up {
          animation: hero-fade-up 0.5s ease-out both;
        }

        .cluely-purple-btn {
          background: linear-gradient(180deg, #7C3AED 0%, #5B21B6 100%);
          box-shadow: 0 0 25px rgba(124, 58, 237, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cluely-purple-btn:hover {
          background: linear-gradient(180deg, #8B5CF6 0%, #6D28D9 100%);
          box-shadow: 0 0 35px rgba(139, 92, 246, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.4);
          transform: translateY(-1px) scale(1.02);
        }
      `}</style>

      {/* ── CLUELY SLEEK HEADER ── */}
      <header className="sticky top-0 z-40 bg-[#0E0C1A]/85 backdrop-blur-xl border-b border-purple-500/20 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-[#A855F7] text-2xl font-serif-garamond font-bold">✦</span>
            <span className="font-serif-garamond text-3xl font-bold tracking-tight text-white">
              SYNAPS
            </span>
            <span className="text-[10px] font-mono-cluely px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
              AI OS v2.5
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono-cluely text-purple-200/70 uppercase tracking-wider">
            <a href="#intelligence" className="hover:text-white transition-colors">Intelligence</a>
            <a href="#evidence" className="hover:text-white transition-colors">Evidence Grounding</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#security" className="hover:text-white transition-colors">Zero-Trust</a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSignInModal(true)}
              className="text-xs font-mono-cluely text-purple-200/80 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => setShowSignInModal(true)}
              className="cluely-purple-btn flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-mono-cluely uppercase tracking-wider font-bold"
            >
              Try SYNAPS
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── CLUELY HERO SECTION WITH WORD-RISE TYPOGRAPHY ── */}
      <section className="pt-16 pb-16 px-6 max-w-5xl mx-auto text-center space-y-8">
        
        {/* Title Banner */}
        <div className="space-y-5 max-w-3xl mx-auto">
          <span className="text-xs font-mono-cluely text-purple-400 uppercase tracking-widest block font-medium hero-fade-up">
            #1 UNDETECTABLE ENTERPRISE DECISION OS
          </span>

          <h1 className="font-serif-garamond text-4xl sm:text-6xl md:text-[76px] font-medium leading-[1.02] tracking-[-1px] text-white">
            <span className="-mb-[0.2em] inline-block overflow-hidden pb-[0.2em] align-bottom">
              <span className="hero-word-rise text-purple-400" style={{ animationDelay: '0s' }}>✦</span>
            </span>{" "}
            <span className="-mb-[0.2em] inline-block overflow-hidden pb-[0.2em] align-bottom">
              <span className="hero-word-rise" style={{ animationDelay: '0.1s' }}>Undetectable</span>
            </span>{" "}
            <span className="-mb-[0.2em] inline-block overflow-hidden pb-[0.2em] align-bottom">
              <span className="hero-word-rise" style={{ animationDelay: '0.2s' }}>AI</span>
            </span>{" "}
            <span className="-mb-[0.2em] inline-block overflow-hidden pb-[0.2em] align-bottom">
              <span className="hero-word-rise" style={{ animationDelay: '0.3s' }}>for</span>
            </span>{" "}
            <span className="-mb-[0.2em] inline-block overflow-hidden pb-[0.2em] align-bottom">
              <span className="hero-word-rise font-serif-garamond italic text-purple-300" style={{ animationDelay: '0.4s' }}>Enterprise Decisions</span>
            </span>
          </h1>

          <hr className="hero-fade-up hidden h-px w-96 border-none mx-auto lg:block" style={{ animationDelay: '0.6s', background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(168,85,247,0.4) 50%, rgba(255,255,255,0) 100%)' }} />

          <p className="hero-fade-up text-base md:text-xl text-purple-200/80 font-sans-cluely max-w-2xl mx-auto leading-relaxed font-normal pt-1" style={{ animationDelay: '0.8s' }}>
            Read, connect, and ground complex contracts, ledgers, and operational records with 100% line-level source citations and zero hallucination.
          </p>

          <div className="hero-fade-up flex flex-wrap items-center justify-center gap-4 pt-3" style={{ animationDelay: '1.0s' }}>
            <button
              onClick={() => setShowSignInModal(true)}
              className="cluely-purple-btn px-7 py-3.5 rounded-xl text-white text-xs font-mono-cluely uppercase tracking-wider flex items-center gap-2 font-bold shadow-xl"
            >
              ⚡ Enter Guest Workspace Demo
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setDemoView('navattic')}
              className={cn(
                "px-6 py-3.5 rounded-xl border text-xs font-mono-cluely uppercase tracking-wider transition-all flex items-center gap-2 font-bold shadow-md",
                demoView === 'navattic' 
                  ? "border-purple-400 bg-purple-950/60 text-white shadow-purple-900/40" 
                  : "border-purple-500/30 bg-[#141022] hover:border-purple-400 text-purple-200"
              )}
            >
              🎮 Interactive Navattic Demo
            </button>

            <a
              href="#evidence"
              className="px-6 py-3.5 rounded-xl border border-purple-500/30 bg-[#141022] hover:border-purple-400 text-purple-200 text-xs font-mono-cluely uppercase tracking-wider transition-all flex items-center gap-2"
            >
              Read Technical Brief
            </a>
          </div>
        </div>

        {/* ── CLUELY STAGE VIEW TOGGLE BAR ── */}
        <div className="flex items-center justify-center gap-3 mt-10">
          <button
            onClick={() => setDemoView('navattic')}
            className={cn(
              "px-5 py-2.5 rounded-xl text-xs font-mono-cluely uppercase tracking-wider transition-all flex items-center gap-2 font-bold border",
              demoView === 'navattic'
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-lg shadow-purple-900/40"
                : "bg-[#141022] text-purple-300 border-purple-500/30 hover:text-white hover:border-purple-400"
            )}
          >
            <span>🎮 Navattic Interactive Tour</span>
          </button>

          <button
            onClick={() => setDemoView('ai')}
            className={cn(
              "px-5 py-2.5 rounded-xl text-xs font-mono-cluely uppercase tracking-wider transition-all flex items-center gap-2 font-bold border",
              demoView === 'ai'
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-lg shadow-purple-900/40"
                : "bg-[#141022] text-purple-300 border-purple-500/30 hover:text-white hover:border-purple-400"
            )}
          >
            <span>⚡ Live AI Workspace Command</span>
          </button>
        </div>

        {/* ── INTERACTIVE DEMO STAGE ── */}
        <div className="anthropic-stage mt-6 max-w-4xl mx-auto space-y-6">
          {demoView === 'navattic' ? (
            /* NAVATTIC INTERACTIVE EMBED FRAME */
            <div className="w-full rounded-2xl overflow-hidden border-2 border-purple-500/40 shadow-[0_10px_50px_rgba(124,58,237,0.3)] bg-[#120E21] text-left transition-all">
              <div className="flex items-center justify-between px-5 py-3 bg-[#19142E] border-b border-purple-500/20 text-xs font-mono-cluely">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-white font-bold uppercase tracking-wider">NAVATTIC INTERACTIVE PRODUCT TOUR</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline text-purple-200/70 text-[11px]">Click hotspots to explore platform features</span>
                  <button
                    onClick={() => setShowNavatticModal(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-purple-950/80 border border-purple-400/50 text-purple-300 hover:bg-purple-600 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>Fullscreen</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <iframe
                data-navattic-src="https://capture.navattic.com/cmshd2htw000g04jp4r211hjd"
                src="https://capture.navattic.com/cmshd2htw000g04jp4r211hjd"
                data-navattic-placeholder-src="https://app.navattic.com/api/poster/cmshd2htw000g04jp4r211hjd"
                data-navattic-demo-id="cmshd2htw000g04jp4r211hjd"
                className="w-full h-[520px] sm:h-[600px] border-none"
                allow="fullscreen; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-downloads"
                title="Synaps AI Navattic Interactive Demo"
              />

              <div className="p-4 bg-[#19142E] border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-cluely">
                <span className="text-purple-200/70">Having trouble loading the interactive player?</span>
                <a
                  href="https://capture.navattic.com/cmshd2htw000g04jp4r211hjd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cluely-purple-btn px-4 py-2 rounded-xl text-white font-bold transition-all flex items-center gap-2"
                >
                  <span>Launch Interactive Tour in New Tab ↗</span>
                </a>
              </div>
            </div>
          ) : (
            /* AI INTERFACE BOX */
            <div className="space-y-6">
              {/* Main Floating Input Box */}
              <div className="bg-[#131022] border border-purple-500/30 rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] space-y-4 text-left transition-all hover:border-purple-400/50">
                <div className="flex items-start gap-3">
                  <span className="text-purple-300/70 text-sm pt-0.5 font-serif-garamond">How can I help you today?</span>
                </div>

                <textarea
                  rows={2}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  className="w-full bg-transparent text-white font-serif-garamond text-2xl focus:outline-none resize-none border-none p-0 placeholder:text-purple-300/30"
                  placeholder="Ask SYNAPS to analyze contracts, ledgers, or SOPs..."
                />

                <div className="flex items-center justify-between pt-2 border-t border-purple-500/20 text-xs font-mono-cluely text-purple-300/70">
                  <div className="flex items-center gap-2">
                    <button type="button" className="p-1.5 rounded-lg hover:bg-purple-900/30 text-purple-300 hover:text-white transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0C0917] border border-purple-500/30 text-white hover:border-purple-400 transition-all text-xs font-mono-cluely">
                      <span>{selectedModel}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-purple-300" />
                    </button>
                    <button type="button" className="p-1.5 rounded-lg hover:bg-purple-900/30 text-purple-300 hover:text-purple-400 transition-colors">
                      <AudioWaveform className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

          {/* Quick Action Chips (Matching Screenshot exact pills) */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setPromptText("Draft a non-renewal notice for Section 8.4 rate escalation clause.")}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#19142E] border border-purple-500/30 hover:border-purple-400 text-purple-200 hover:text-white text-sm font-serif-garamond transition-all shadow-md"
            >
              <PenTool className="w-3.5 h-3.5 text-purple-400" />
              <span>Write</span>
            </button>

            <button
              type="button"
              onClick={() => setPromptText("Explain how the 10-Agent Boardroom reaches risk consensus.")}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#19142E] border border-purple-500/30 hover:border-purple-400 text-purple-200 hover:text-white text-sm font-serif-garamond transition-all shadow-md"
            >
              <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
              <span>Learn</span>
            </button>

            <button
              type="button"
              onClick={() => setPromptText("Show Monte Carlo 10,000 risk simulation Python script.")}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#19142E] border border-purple-500/30 hover:border-purple-400 text-purple-200 hover:text-white text-sm font-serif-garamond transition-all shadow-md"
            >
              <Code2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Code</span>
            </button>

            <button
              type="button"
              onClick={() => setPromptText("Connect MSA_2026.pdf and Financial_Audit_2026.xlsx from Google Drive.")}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#19142E] border border-purple-500/30 hover:border-purple-400 text-purple-200 hover:text-white text-sm font-serif-garamond transition-all shadow-md"
            >
              <FolderOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>From Drive</span>
            </button>

            <button
              type="button"
              onClick={() => setPromptText("Check key contract renewal deadlines for Q3 2026.")}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#19142E] border border-purple-500/30 hover:border-purple-400 text-purple-200 hover:text-white text-sm font-serif-garamond transition-all shadow-md"
            >
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              <span>From Calendar</span>
            </button>
          </div>

          {/* Interactive Evidence Result Preview */}
          <div className="p-6 rounded-2xl bg-[#131022] border border-purple-500/30 text-left space-y-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] mt-6">
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-3 text-xs font-mono-cluely">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-white font-medium uppercase tracking-wider">EVIDENTIARY TRACEABILITY OUTPUT</span>
              </div>
              <span className="text-purple-300">CONFIDENCE: 99.8%</span>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-mono-cluely text-purple-400 uppercase tracking-wider font-bold">SYNAPS GROUNDED SYNTHESIS</span>
              <p className="text-sm font-sans-cluely text-purple-100/90 leading-relaxed">
                Section 8.4 contains an automatic 14% annual cost escalation clause triggering on Nov 1 unless written non-renewal notice is served by Oct 15.
              </p>

              <div className="p-4 rounded-xl bg-[#0C0A17] border border-purple-500/20 space-y-2 text-xs font-mono-cluely">
                <span className="text-purple-400 font-bold">VERIFIED SOURCE CITATION</span>
                <p className="text-purple-200/80 italic">
                  "In the event Customer does not issue written notice of non-renewal at least forty-five (45) days prior to the Renewal Date, rates shall automatically adjust upward by fourteen percent (14%)."
                </p>
                <div className="text-[10px] text-purple-300/60 flex items-center justify-between pt-1 border-t border-purple-500/20">
                  <span>Document: MSA_2026.pdf</span>
                  <span>Page 8 · Section 8.4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      </section>

      {/* ── EDITORIAL THREE-COLUMN PILLARS (ANTHROPIC RESEARCH STYLE) ── */}
      <section id="intelligence" className="py-20 bg-[#141311] border-y border-[#2B2925]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="max-w-2xl text-left space-y-3">
            <span className="text-xs font-mono-anthropic text-[#D96B27] uppercase tracking-widest">SYSTEM CAPABILITIES</span>
            <h2 className="font-serif-anthropic text-4xl text-[#ECE9E3]">
              Engineered for absolute credibility.
            </h2>
            <p className="text-sm font-sans-anthropic text-[#A5A095] leading-relaxed">
              SYNAPS is designed to eliminate AI guesswork. Every inference is grounded in primary evidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              {
                num: "01",
                title: "Evidentiary Grounding",
                desc: "Zero hallucination tolerance. Every summary, decision recommendation, and delta report links directly back to exact page and line coordinates in your primary files."
              },
              {
                num: "02",
                title: "Multi-Agent Boardroom",
                desc: "Ten specialized AI agents audit risks, obligations, deadlines, and financial exposures concurrently, debating edge cases before outputting a consensus brief."
              },
              {
                num: "03",
                title: "Zero-Trust Architecture",
                desc: "Multi-tenant database isolation ensures your sensitive organizational records remain strictly private and are never used to train public LLM models."
              }
            ].map((pillar) => (
              <div key={pillar.num} className="anthropic-reveal p-8 rounded-2xl bg-[#1E1D1A] border border-[#2B2925] space-y-4 hover:border-[#D96B27]/50 transition-all">
                <span className="text-xs font-mono-anthropic text-[#D96B27] font-bold">{pillar.num}</span>
                <h3 className="font-serif-anthropic text-2xl text-[#ECE9E3]">{pillar.title}</h3>
                <p className="text-xs md:text-sm font-sans-anthropic text-[#A5A095] leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURE & TECHNICAL SPECIFICATIONS ── */}
      <section id="architecture" className="py-20 max-w-7xl mx-auto px-6 space-y-12 text-left">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-mono-cluely text-purple-400 uppercase tracking-widest">TECHNICAL SPECIFICATIONS</span>
          <h2 className="font-serif-garamond text-4xl text-white">
            Enterprise intelligence stack
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-[#131022] border border-purple-500/20 space-y-6 shadow-xl">
            <h3 className="font-serif-garamond text-2xl text-white">Data Processing Pipeline</h3>
            <ul className="space-y-3 text-xs font-mono-cluely text-purple-200/70">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Deterministic vector chunking with 512-token overlap</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Hybrid BM25 + Dense vector embedding retrieval</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Cross-encoder re-ranking with 0.95 relevance threshold</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-2xl bg-[#131022] border border-purple-500/20 space-y-6 shadow-xl">
            <h3 className="font-serif-garamond text-2xl text-white">Security & Governance</h3>
            <ul className="space-y-3 text-xs font-mono-cluely text-purple-200/70">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>AES-256 GCM encryption at rest & TLS 1.3 in transit</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>HTTP-Only backend session security & 2FA OTP</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Strict multi-tenant DB row-level security isolation</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 bg-[#08070E] border-t border-purple-500/20 text-xs font-mono-cluely text-purple-300/60">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-purple-400 font-serif-garamond font-bold text-xl">✦</span>
            <span className="font-serif-garamond font-bold text-white text-lg">SYNAPS OS</span>
            <span>© 2026 SYNAPS Technologies, Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/legal/eula" className="hover:text-white transition-colors">EULA License</Link>
            <Link href="/legal/dmca" className="hover:text-white transition-colors">DMCA Takedowns</Link>
            <Link href="/legal/security" className="hover:text-white transition-colors">Security</Link>
          </div>
        </div>
      </footer>

      {/* ── SIGN IN MODAL WITH UIVERSE.IO STYLING & INSTANT DEMO ── */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
      />

      {/* ── FULLSCREEN NAVATTIC INTERACTIVE DEMO MODAL ── */}
      {showNavatticModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-6xl h-[92vh] bg-[#120E21] border-2 border-purple-500/50 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(124,58,237,0.4)] flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 bg-[#19142E] border-b border-purple-500/20 text-xs font-mono-cluely">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-white font-bold uppercase tracking-wider">NAVATTIC INTERACTIVE DEMO — FULLSCREEN</span>
              </div>
              <button
                onClick={() => setShowNavatticModal(false)}
                className="p-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-800 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <iframe
              src="https://capture.navattic.com/cmshd2htw000g04jp4r211hjd"
              data-navattic-src="https://capture.navattic.com/cmshd2htw000g04jp4r211hjd"
              className="w-full flex-1 border-none"
              allow="fullscreen"
              title="Navattic Fullscreen Interactive Demo"
            />
          </div>
        </div>
      )}

    </div>
  );
}
