'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle,
  FileText, Sparkles, Eye, Check, ExternalLink, ChevronRight,
  Lock, FileSpreadsheet, Building2, Search, X, Cookie
} from 'lucide-react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

export default function AnthropicStyleSynapsLanding() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Cookie Consent Banner State
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [activeTab, setActiveTab] = useState<'grounding' | 'boardroom' | 'security'>('grounding');

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
    <div ref={containerRef} className="min-h-screen bg-[#FBF9F5] text-[#191919] font-sans antialiased selection:bg-[#CC5A00] selection:text-white">
      
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
      <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#E8E5DE] transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="font-serif-anthropic text-2xl font-bold tracking-tight text-[#191919]">
              SYNAPS
            </span>
            <span className="text-[10px] font-mono-anthropic px-2 py-0.5 rounded bg-[#EDE9E0] text-[#66635B] uppercase tracking-wider">
              OS v2.4
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono-anthropic text-[#66635B] uppercase tracking-wider">
            <a href="#intelligence" className="hover:text-[#191919] transition-colors">Intelligence</a>
            <a href="#evidence" className="hover:text-[#191919] transition-colors">Evidence Grounding</a>
            <a href="#architecture" className="hover:text-[#191919] transition-colors">Architecture</a>
            <a href="#security" className="hover:text-[#191919] transition-colors">Zero-Trust</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs font-mono-anthropic text-[#66635B] hover:text-[#191919] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/demo"
              className="flex items-center gap-2 px-4 py-2 rounded bg-[#191919] hover:bg-[#CC5A00] text-[#FBF9F5] text-xs font-mono-anthropic uppercase tracking-wider transition-colors shadow-sm"
            >
              Try SYNAPS
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="pt-20 pb-16 px-6 max-w-5xl mx-auto text-left space-y-8">
        <div className="space-y-4 max-w-4xl">
          <span className="text-xs font-mono-anthropic text-[#CC5A00] uppercase tracking-widest block font-medium">
            ENTERPRISE DECISION INTELLIGENCE WORKSPACE
          </span>

          <h1 className="anthropic-hero-title font-serif-anthropic text-5xl md:text-7xl font-normal leading-[1.05] tracking-tight text-[#191919]">
            AI system for high-stakes decision intelligence.
          </h1>

          <p className="anthropic-hero-sub text-base md:text-lg text-[#55524A] font-sans-anthropic max-w-2xl leading-relaxed font-normal pt-2">
            SYNAPS is an enterprise operating system built to read, connect, and ground complex contracts, financial ledgers, and operational records with 100% source traceability.
          </p>

          <div className="anthropic-hero-cta flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/demo"
              className="px-6 py-3.5 rounded bg-[#191919] hover:bg-[#CC5A00] text-[#FBF9F5] text-xs font-mono-anthropic uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
            >
              Enter Workspace
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#evidence"
              className="px-6 py-3.5 rounded border border-[#DCD8CE] hover:border-[#191919] text-[#191919] text-xs font-mono-anthropic uppercase tracking-wider transition-all flex items-center gap-2"
            >
              Read Technical Brief
            </a>
          </div>
        </div>

        {/* Anthropic Editorial Interactive Stage */}
        <div className="anthropic-stage mt-12 bg-[#F3EFE6] border border-[#E3E0D8] rounded-xl overflow-hidden shadow-sm">
          {/* Top Bar */}
          <div className="bg-[#EAE6DD] px-6 py-3 border-b border-[#DCD8CE] flex items-center justify-between text-xs font-mono-anthropic text-[#66635B]">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#CC5A00]" />
              <span className="text-[#191919] font-medium">EVIDENTIARY TRACEABILITY ENGINE</span>
            </div>
            <span>CONFIDENCE: 99.8%</span>
          </div>

          <div className="p-8 md:p-10 space-y-6 text-left">
            <div className="space-y-2 border-b border-[#DCD8CE] pb-6">
              <span className="text-[10px] font-mono-anthropic text-[#88847C] uppercase tracking-wider">QUERY INPUT</span>
              <p className="font-serif-anthropic text-2xl text-[#191919]">
                "What price escalation risks exist in our 2026 Master Services Agreement?"
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-[10px] font-mono-anthropic text-[#CC5A00] uppercase tracking-wider font-bold">SYNAPS EVIDENCED SYNTHESIS</span>
                <p className="text-sm font-sans-anthropic text-[#2C2A26] leading-relaxed">
                  Section 8.4 contains an automatic 14% annual cost escalation clause triggering on Nov 1 unless written non-renewal notice is served by Oct 15.
                </p>

                <div className="p-4 rounded bg-[#FBF9F5] border border-[#E3E0D8] space-y-2 text-xs font-mono-anthropic">
                  <span className="text-[#CC5A00] font-bold">VERIFIED SOURCE CITATION</span>
                  <p className="text-[#383632] italic">
                    "In the event Customer does not issue written notice of non-renewal at least forty-five (45) days prior to the Renewal Date, rates shall automatically adjust upward by fourteen percent (14%)."
                  </p>
                  <div className="text-[10px] text-[#77736A] flex items-center justify-between pt-1 border-t border-[#EAE6DD]">
                    <span>Document: MSA_2026.pdf</span>
                    <span>Page 8 · Section 8.4</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 p-5 rounded bg-[#EAE6DD] border border-[#DCD8CE] space-y-3">
                <span className="text-[10px] font-mono-anthropic text-[#191919] uppercase tracking-wider font-bold">RECOMMENDED REMEDIATION</span>
                <p className="text-xs font-sans-anthropic text-[#383632] leading-relaxed">
                  Serve non-renewal notice prior to Oct 15 to request capped annual rate adjustments at 4% CPI.
                </p>
                <div className="pt-2 border-t border-[#D3CFB0] flex items-center justify-between text-[10px] font-mono-anthropic text-[#66635B]">
                  <span>Status: Action Required</span>
                  <span className="text-[#CC5A00] font-bold">High Exposure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EDITORIAL THREE-COLUMN PILLARS (ANTHROPIC RESEARCH STYLE) ── */}
      <section id="intelligence" className="py-20 bg-[#F3EFE6] border-y border-[#E3E0D8]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="max-w-2xl text-left space-y-3">
            <span className="text-xs font-mono-anthropic text-[#CC5A00] uppercase tracking-widest">SYSTEM CAPABILITIES</span>
            <h2 className="font-serif-anthropic text-4xl text-[#191919]">
              Engineered for absolute credibility.
            </h2>
            <p className="text-sm font-sans-anthropic text-[#55524A] leading-relaxed">
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
              <div key={pillar.num} className="anthropic-reveal p-8 rounded bg-[#FBF9F5] border border-[#E3E0D8] space-y-4">
                <span className="text-xs font-mono-anthropic text-[#CC5A00] font-bold">{pillar.num}</span>
                <h3 className="font-serif-anthropic text-2xl text-[#191919]">{pillar.title}</h3>
                <p className="text-xs md:text-sm font-sans-anthropic text-[#55524A] leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURE & TECHNICAL SPECIFICATIONS ── */}
      <section id="architecture" className="py-20 max-w-7xl mx-auto px-6 space-y-12 text-left">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-mono-anthropic text-[#CC5A00] uppercase tracking-widest">TECHNICAL SPECIFICATIONS</span>
          <h2 className="font-serif-anthropic text-4xl text-[#191919]">
            Enterprise intelligence stack
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded bg-[#F3EFE6] border border-[#E3E0D8] space-y-6">
            <h3 className="font-serif-anthropic text-2xl text-[#191919]">Data Processing Pipeline</h3>
            <div className="space-y-4 text-xs font-mono-anthropic text-[#44423C]">
              <div className="flex justify-between border-b border-[#E3E0D8] pb-2">
                <span>Ingestion Formats</span>
                <span className="text-[#191919] font-medium">PDF, DOCX, XLSX, CSV, SQL</span>
              </div>
              <div className="flex justify-between border-b border-[#E3E0D8] pb-2">
                <span>OCR & Table Extraction</span>
                <span className="text-[#191919] font-medium">Layout-Aware Neural OCR</span>
              </div>
              <div className="flex justify-between border-b border-[#E3E0D8] pb-2">
                <span>Indexing Speed</span>
                <span className="text-[#191919] font-medium">~50 Pages / Second</span>
              </div>
              <div className="flex justify-between pb-2">
                <span>Hallucination Guardrail</span>
                <span className="text-[#CC5A00] font-bold">100% Citation Enforcement</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded bg-[#F3EFE6] border border-[#E3E0D8] space-y-6">
            <h3 className="font-serif-anthropic text-2xl text-[#191919]">Security & Compliance</h3>
            <div className="space-y-4 text-xs font-mono-anthropic text-[#44423C]">
              <div className="flex justify-between border-b border-[#E3E0D8] pb-2">
                <span>Encryption at Rest</span>
                <span className="text-[#191919] font-medium">AES-256 GCM</span>
              </div>
              <div className="flex justify-between border-b border-[#E3E0D8] pb-2">
                <span>Encryption in Transit</span>
                <span className="text-[#191919] font-medium">TLS 1.3 Strict</span>
              </div>
              <div className="flex justify-between border-b border-[#E3E0D8] pb-2">
                <span>Audit Trail</span>
                <span className="text-[#191919] font-medium">Immutable Audit Logs</span>
              </div>
              <div className="flex justify-between pb-2">
                <span>Compliance Standard</span>
                <span className="text-[#191919] font-bold">SOC 2 Type II & ISO 27001</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <footer className="py-20 bg-[#191919] text-[#FBF9F5] text-left">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-8 space-y-4">
            <span className="text-xs font-mono-anthropic text-[#CC5A00] uppercase tracking-widest">GET STARTED WITH SYNAPS</span>
            <h2 className="font-serif-anthropic text-4xl md:text-5xl text-[#FBF9F5] leading-tight">
              Turn scattered information into decisions you can defend.
            </h2>
            <p className="text-sm font-sans-anthropic text-[#A5A29A] max-w-xl">
              Deploys seamlessly across your existing document repositories and operational storage.
            </p>
          </div>

          <div className="md:col-span-4 flex flex-col items-start md:items-end gap-4">
            <Link
              href="/demo"
              className="px-8 py-4 rounded bg-[#CC5A00] hover:bg-[#b85100] text-white text-xs font-mono-anthropic uppercase tracking-wider transition-colors shadow-sm"
            >
              Launch Workspace Demo →
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-16 border-t border-[#33312C] mt-16 flex flex-col md:flex-row justify-between text-xs font-mono-anthropic text-[#77746D]">
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
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-50 bg-[#191919] text-[#FBF9F5] border border-[#33312C] rounded-lg p-5 shadow-2xl space-y-4 animate-fade-in text-left">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono-anthropic text-[#CC5A00] uppercase font-bold">
              <Cookie className="w-4 h-4" />
              Cookie Preferences
            </div>
            <button
              onClick={() => setShowCookieBanner(false)}
              className="text-[#77746D] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs font-sans-anthropic text-[#B5B2AA] leading-relaxed">
            We use essential cookies to maintain session security, verify Zero-Trust authorization tokens, and analyze system performance. Read our Privacy Policy for more details.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => handleCookieAction('accept')}
              className="flex-1 py-2 px-4 rounded bg-[#CC5A00] hover:bg-[#b85100] text-white text-xs font-mono-anthropic uppercase tracking-wider transition-colors font-medium text-center"
            >
              Accept All
            </button>
            <button
              onClick={() => handleCookieAction('decline')}
              className="flex-1 py-2 px-4 rounded border border-[#44423C] hover:border-white text-[#B5B2AA] hover:text-white text-xs font-mono-anthropic uppercase tracking-wider transition-colors text-center"
            >
              Decline Optional
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
