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

  // Cookie Consent & Sign In Modal State
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'grounding' | 'boardroom' | 'security'>('grounding');
  const [promptText, setPromptText] = useState("What price escalation risks exist in our 2026 Master Services Agreement?");
  const [selectedModel, setSelectedModel] = useState("Gemini 1.5 Pro");

  useEffect(() => {
    // Check if user already acknowledged cookie consent
    const consent = localStorage.getItem('synaps_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setShowCookieBanner(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCookieAction = (choice: 'accept' | 'decline') => {
    localStorage.setItem('synaps_cookie_consent', choice);
    setShowCookieBanner(false);
  };

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
    <div ref={containerRef} className="min-h-screen bg-[#181715] text-[#ECE9E3] font-sans antialiased selection:bg-[#D96B27] selection:text-white">
      
      {/* ── GOOGLE FONTS INJECTION FOR ANTHROPIC TYPOGRAPHY ── */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        
        .font-serif-anthropic {
          font-family: 'Instrument Serif', Georgia, serif;
        }
        .font-sans-anthropic {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .font-mono-anthropic {
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>

      {/* ── ANTHROPIC MINIMALIST HEADER ── */}
      <header className="sticky top-0 z-40 bg-[#161513]/90 backdrop-blur-md border-b border-[#2B2925] transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-[#D96B27] text-2xl font-serif-anthropic font-bold">✦</span>
            <span className="font-serif-anthropic text-2xl font-bold tracking-tight text-[#ECE9E3]">
              SYNAPS
            </span>
            <span className="text-[10px] font-mono-anthropic px-2 py-0.5 rounded bg-[#262522] text-[#A39F95] border border-[#33312C] uppercase tracking-wider">
              OS v2.5
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono-anthropic text-[#A39F95] uppercase tracking-wider">
            <a href="#intelligence" className="hover:text-[#ECE9E3] transition-colors">Intelligence</a>
            <a href="#evidence" className="hover:text-[#ECE9E3] transition-colors">Evidence Grounding</a>
            <a href="#architecture" className="hover:text-[#ECE9E3] transition-colors">Architecture</a>
            <a href="#security" className="hover:text-[#ECE9E3] transition-colors">Zero-Trust</a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSignInModal(true)}
              className="text-xs font-mono-anthropic text-[#A39F95] hover:text-[#ECE9E3] transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => setShowSignInModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D96B27] hover:bg-[#C25918] text-white text-xs font-mono-anthropic uppercase tracking-wider transition-colors shadow-lg shadow-[#D96B27]/10"
            >
              Try SYNAPS
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION WITH ANTHROPIC CLAUDE CHAT INTERFACE ── */}
      <section className="pt-16 pb-16 px-6 max-w-5xl mx-auto text-center space-y-8">
        
        {/* Title Banner */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-mono-anthropic text-[#D96B27] uppercase tracking-widest block font-medium">
            ENTERPRISE DECISION INTELLIGENCE WORKSPACE
          </span>

          <h1 className="anthropic-hero-title font-serif-anthropic text-5xl md:text-7xl font-normal leading-[1.05] tracking-tight text-[#ECE9E3]">
            <span className="text-[#D96B27] font-serif-anthropic">✦</span> How can SYNAPS help your enterprise today?
          </h1>

          <p className="anthropic-hero-sub text-base md:text-lg text-[#A5A095] font-sans-anthropic max-w-2xl mx-auto leading-relaxed font-normal pt-1">
            Read, connect, and ground complex contracts, financial ledgers, and operational records with 100% line-level source citations.
          </p>

          <div className="anthropic-hero-cta flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setShowSignInModal(true)}
              className="px-6 py-3.5 rounded-xl bg-[#D96B27] hover:bg-[#C25918] text-white text-xs font-mono-anthropic uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[#D96B27]/20 font-bold"
            >
              ⚡ Enter Guest Workspace Demo
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#evidence"
              className="px-6 py-3.5 rounded-xl border border-[#3A3834] bg-[#22211E] hover:border-[#D96B27] text-[#ECE9E3] text-xs font-mono-anthropic uppercase tracking-wider transition-all flex items-center gap-2"
            >
              Read Technical Brief
            </a>
          </div>
        </div>

        {/* ── ANTHROPIC CLAUDE INTERFACE BOX (MATCHING SCREENSHOT EXPLICITLY) ── */}
        <div className="anthropic-stage mt-10 max-w-3xl mx-auto space-y-6">
          
          {/* Main Floating Input Box */}
          <div className="bg-[#242320] border border-[#383631] rounded-2xl p-5 shadow-2xl space-y-4 text-left transition-all hover:border-[#4A4741]">
            <div className="flex items-start gap-3">
              <span className="text-[#A5A095] text-sm pt-0.5 font-serif-anthropic">How can I help you today?</span>
            </div>

            <textarea
              rows={2}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full bg-transparent text-[#ECE9E3] font-serif-anthropic text-xl focus:outline-none resize-none border-none p-0"
              placeholder="Ask SYNAPS to analyze contracts, ledgers, or SOPs..."
            />

            <div className="flex items-center justify-between pt-2 border-t border-[#2F2D29] text-xs font-mono-anthropic text-[#8E8A80]">
              <div className="flex items-center gap-2">
                <button type="button" className="p-1.5 rounded-lg hover:bg-[#2F2E2B] text-[#A5A095] hover:text-[#ECE9E3] transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1D1C19] border border-[#36342F] text-[#ECE9E3] hover:border-[#D96B27] transition-all text-xs font-mono-anthropic">
                  <span>{selectedModel}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#A5A095]" />
                </button>
                <button type="button" className="p-1.5 rounded-lg hover:bg-[#2F2E2B] text-[#A5A095] hover:text-[#D96B27] transition-colors">
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
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#242320] border border-[#36342F] hover:border-[#D96B27] text-[#C4C0B5] hover:text-[#ECE9E3] text-sm font-serif-anthropic transition-all shadow-sm"
            >
              <PenTool className="w-3.5 h-3.5 text-[#D96B27]" />
              <span>Write</span>
            </button>

            <button
              type="button"
              onClick={() => setPromptText("Explain how the 10-Agent Boardroom reaches risk consensus.")}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#242320] border border-[#36342F] hover:border-[#D96B27] text-[#C4C0B5] hover:text-[#ECE9E3] text-sm font-serif-anthropic transition-all shadow-sm"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#D96B27]" />
              <span>Learn</span>
            </button>

            <button
              type="button"
              onClick={() => setPromptText("Show Monte Carlo 10,000 risk simulation Python script.")}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#242320] border border-[#36342F] hover:border-[#D96B27] text-[#C4C0B5] hover:text-[#ECE9E3] text-sm font-serif-anthropic transition-all shadow-sm"
            >
              <Code2 className="w-3.5 h-3.5 text-[#D96B27]" />
              <span>Code</span>
            </button>

            <button
              type="button"
              onClick={() => setPromptText("Connect MSA_2026.pdf and Financial_Audit_2026.xlsx from Google Drive.")}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#242320] border border-[#36342F] hover:border-[#D96B27] text-[#C4C0B5] hover:text-[#ECE9E3] text-sm font-serif-anthropic transition-all shadow-sm"
            >
              <FolderOpen className="w-3.5 h-3.5 text-[#D96B27]" />
              <span>From Drive</span>
            </button>

            <button
              type="button"
              onClick={() => setPromptText("Check key contract renewal deadlines for Q3 2026.")}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#242320] border border-[#36342F] hover:border-[#D96B27] text-[#C4C0B5] hover:text-[#ECE9E3] text-sm font-serif-anthropic transition-all shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5 text-[#D96B27]" />
              <span>From Calendar</span>
            </button>
          </div>

          {/* Interactive Evidence Result Preview */}
          <div className="p-6 rounded-2xl bg-[#201F1C] border border-[#33312B] text-left space-y-4 shadow-xl mt-6">
            <div className="flex items-center justify-between border-b border-[#2C2A26] pb-3 text-xs font-mono-anthropic">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D96B27]" />
                <span className="text-[#ECE9E3] font-medium uppercase tracking-wider">EVIDENTIARY TRACEABILITY OUTPUT</span>
              </div>
              <span className="text-[#A5A095]">CONFIDENCE: 99.8%</span>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-mono-anthropic text-[#D96B27] uppercase tracking-wider font-bold">SYNAPS GROUNDED SYNTHESIS</span>
              <p className="text-sm font-sans-anthropic text-[#D6D2C8] leading-relaxed">
                Section 8.4 contains an automatic 14% annual cost escalation clause triggering on Nov 1 unless written non-renewal notice is served by Oct 15.
              </p>

              <div className="p-4 rounded-xl bg-[#171614] border border-[#2B2925] space-y-2 text-xs font-mono-anthropic">
                <span className="text-[#D96B27] font-bold">VERIFIED SOURCE CITATION</span>
                <p className="text-[#B5B0A4] italic">
                  "In the event Customer does not issue written notice of non-renewal at least forty-five (45) days prior to the Renewal Date, rates shall automatically adjust upward by fourteen percent (14%)."
                </p>
                <div className="text-[10px] text-[#7A766D] flex items-center justify-between pt-1 border-t border-[#252421]">
                  <span>Document: MSA_2026.pdf</span>
                  <span>Page 8 · Section 8.4</span>
                </div>
              </div>
            </div>
          </div>
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
          <span className="text-xs font-mono-anthropic text-[#D96B27] uppercase tracking-widest">TECHNICAL SPECIFICATIONS</span>
          <h2 className="font-serif-anthropic text-4xl text-[#ECE9E3]">
            Enterprise intelligence stack
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-[#1E1D1A] border border-[#2B2925] space-y-6">
            <h3 className="font-serif-anthropic text-2xl text-[#ECE9E3]">Data Processing Pipeline</h3>
            <div className="space-y-4 text-xs font-mono-anthropic text-[#A5A095]">
              <div className="flex justify-between border-b border-[#2B2925] pb-2">
                <span>Ingestion Formats</span>
                <span className="text-[#ECE9E3] font-medium">PDF, DOCX, XLSX, CSV, SQL</span>
              </div>
              <div className="flex justify-between border-b border-[#2B2925] pb-2">
                <span>OCR & Table Extraction</span>
                <span className="text-[#ECE9E3] font-medium">Layout-Aware Neural OCR</span>
              </div>
              <div className="flex justify-between border-b border-[#2B2925] pb-2">
                <span>Indexing Speed</span>
                <span className="text-[#ECE9E3] font-medium">~50 Pages / Second</span>
              </div>
              <div className="flex justify-between pb-2">
                <span>Hallucination Guardrail</span>
                <span className="text-[#D96B27] font-bold">100% Citation Enforcement</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-[#1E1D1A] border border-[#2B2925] space-y-6">
            <h3 className="font-serif-anthropic text-2xl text-[#ECE9E3]">Security & Compliance</h3>
            <div className="space-y-4 text-xs font-mono-anthropic text-[#A5A095]">
              <div className="flex justify-between border-b border-[#2B2925] pb-2">
                <span>Encryption at Rest</span>
                <span className="text-[#ECE9E3] font-medium">AES-256 GCM</span>
              </div>
              <div className="flex justify-between border-b border-[#2B2925] pb-2">
                <span>Encryption in Transit</span>
                <span className="text-[#ECE9E3] font-medium">TLS 1.3 Strict</span>
              </div>
              <div className="flex justify-between border-b border-[#2B2925] pb-2">
                <span>Audit Trail</span>
                <span className="text-[#ECE9E3] font-medium">Immutable Audit Logs</span>
              </div>
              <div className="flex justify-between pb-2">
                <span>Compliance Standard</span>
                <span className="text-[#ECE9E3] font-bold">SOC 2 Type II & ISO 27001</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <footer className="py-20 bg-[#12110F] text-[#ECE9E3] text-left border-t border-[#252421]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-8 space-y-4">
            <span className="text-xs font-mono-anthropic text-[#D96B27] uppercase tracking-widest">GET STARTED WITH SYNAPS</span>
            <h2 className="font-serif-anthropic text-4xl md:text-5xl text-[#ECE9E3] leading-tight">
              Turn scattered information into decisions you can defend.
            </h2>
            <p className="text-sm font-sans-anthropic text-[#A5A095] max-w-xl">
              Deploys seamlessly across your existing document repositories and operational storage.
            </p>
          </div>

          <div className="md:col-span-4 flex flex-col items-start md:items-end gap-4">
            <Link
              href="/demo"
              className="px-8 py-4 rounded-xl bg-[#D96B27] hover:bg-[#C25918] text-white text-xs font-mono-anthropic uppercase tracking-wider transition-colors shadow-lg shadow-[#D96B27]/20 font-bold"
            >
              Launch Workspace Demo →
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-16 border-t border-[#252421] mt-16 flex flex-col md:flex-row justify-between text-xs font-mono-anthropic text-[#7A766D]">
          <span>© 2026 SYNAPS INC. ANTHROPIC-INSPIRED ENTERPRISE OS.</span>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#security" className="hover:text-white transition-colors">Privacy</a>
            <a href="#architecture" className="hover:text-white transition-colors">Terms</a>
            <a href="#intelligence" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </footer>

      {/* ── ANTHROPIC-STYLE FLOATING COOKIE CONSENT BANNER ── */}
      {showCookieBanner && (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-50 bg-[#1E1D1A] text-[#ECE9E3] border border-[#383631] rounded-xl p-5 shadow-2xl space-y-4 animate-fade-in text-left">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono-anthropic text-[#D96B27] uppercase font-bold">
              <Cookie className="w-4 h-4" />
              Cookie Preferences
            </div>
            <button
              onClick={() => setShowCookieBanner(false)}
              className="text-[#7A766D] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs font-sans-anthropic text-[#A5A095] leading-relaxed">
            We use essential cookies to maintain session security, verify Zero-Trust authorization tokens, and analyze system performance. Read our Privacy Policy for more details.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => handleCookieAction('accept')}
              className="flex-1 py-2 px-4 rounded-lg bg-[#D96B27] hover:bg-[#C25918] text-white text-xs font-mono-anthropic uppercase tracking-wider transition-colors font-medium text-center"
            >
              Accept All
            </button>
            <button
              onClick={() => handleCookieAction('decline')}
              className="flex-1 py-2 px-4 rounded-lg border border-[#383631] hover:border-white text-[#A5A095] hover:text-white text-xs font-mono-anthropic uppercase tracking-wider transition-colors text-center"
            >
              Decline Optional
            </button>
          </div>
        </div>
      )}

      {/* ── SIGN IN MODAL WITH UIVERSE.IO STYLING & INSTANT DEMO ── */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
      />

    </div>
  );
}
