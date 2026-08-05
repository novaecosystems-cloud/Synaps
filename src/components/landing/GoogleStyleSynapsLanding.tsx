'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  Search, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle,
  FileText, Sparkles, Layers, Eye, Check, ExternalLink, ChevronRight,
  ChevronDown, HelpCircle, Lock, Zap, FileSpreadsheet, Building2,
  TrendingUp, Users, Clock, Award, Play, Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

export default function GoogleStyleSynapsLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Interactive Step State
  const [activeStep, setActiveStep] = useState(1);

  // ROI Estimator State
  const [teamSize, setTeamSize] = useState(15);
  const [hoursPerWeek, setHoursPerWeek] = useState(8);

  // FAQ Accordion Open State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Computed ROI savings
  const annualHoursSaved = Math.round(teamSize * hoursPerWeek * 48 * 0.75);
  const annualDollarsSaved = (annualHoursSaved * 65).toLocaleString('en-US');

  // GSAP Entrance Animations
  useGSAP(() => {
    gsap.from('.gsap-hero-badge', { opacity: 0, y: -20, duration: 0.6, ease: 'power2.out' });
    gsap.from('.gsap-hero-title', { opacity: 0, y: 30, duration: 0.8, delay: 0.2, ease: 'power3.out' });
    gsap.from('.gsap-hero-sub', { opacity: 0, y: 20, duration: 0.8, delay: 0.4, ease: 'power3.out' });
    gsap.from('.gsap-hero-cta', { opacity: 0, scale: 0.95, duration: 0.6, delay: 0.6, ease: 'back.out(1.7)' });
    gsap.from('.gsap-hero-card', { opacity: 0, y: 40, duration: 1, delay: 0.7, ease: 'power3.out' });

    // Scroll triggered card reveals
    gsap.utils.toArray<HTMLElement>('.gsap-fade-up').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out'
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F8F9FA] text-[#202124] font-sans antialiased selection:bg-[#1A73E8] selection:text-white">
      
      {/* ── GOOGLE-STYLE FLOATING NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#DADCE0]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1A73E8] flex items-center justify-center text-white font-bold text-base shadow-sm">
                S
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[#202124]">
                SYNAPS <span className="text-[#1A73E8] text-sm font-semibold">for Enterprise</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#5F6368]">
              <a href="#overview" className="hover:text-[#1A73E8] transition-colors">Overview</a>
              <a href="#how-it-works" className="hover:text-[#1A73E8] transition-colors">How it works</a>
              <a href="#calculator" className="hover:text-[#1A73E8] transition-colors">ROI Calculator</a>
              <a href="#features" className="hover:text-[#1A73E8] transition-colors">Capabilities</a>
              <a href="#faq" className="hover:text-[#1A73E8] transition-colors">FAQ</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-[#1A73E8] hover:bg-[#E8F0FE] px-4 py-2 rounded-full transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/demo"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white text-sm font-bold transition-all shadow-md shadow-[#1A73E8]/20"
            >
              Start Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section id="overview" className="pt-16 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="gsap-hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8F0FE] border border-[#D2E3FC] text-[#1A73E8] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google-Grade Enterprise Intelligence Operating System</span>
          </div>

          <h1 className="gsap-hero-title text-4xl md:text-6xl font-extrabold text-[#202124] tracking-tight leading-[1.15]">
            Grow your business with decisions <span className="text-[#1A73E8]">you can defend.</span>
          </h1>

          <p className="gsap-hero-sub text-base md:text-lg text-[#5F6368] font-normal leading-relaxed max-w-2xl mx-auto">
            SYNAPS transforms scattered contracts, SOPs, financial ledgers, and strategic reports into clear, verifiable answers backed by 100% source citations.
          </p>

          <div className="gsap-hero-cta flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/demo"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white text-sm font-bold transition-all shadow-lg shadow-[#1A73E8]/25 flex items-center justify-center gap-2"
            >
              Start Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-[#F1F3F4] border border-[#DADCE0] text-[#202124] text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-[#1A73E8] fill-current" />
              See how it works
            </a>
          </div>
        </div>

        {/* Hero Interactive App Mockup Preview */}
        <div className="gsap-hero-card mt-14 max-w-5xl mx-auto bg-white rounded-3xl border border-[#DADCE0] shadow-2xl overflow-hidden p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#F1F3F4] pb-4">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs font-mono text-[#5F6368] font-medium">synaps.enterprise.workspace</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#E6F4EA] text-[#137333] text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Zero-Trust Verified
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E8EAED] flex items-center gap-3">
            <Search className="w-5 h-5 text-[#1A73E8]" />
            <span className="text-sm font-medium text-[#202124]">
              "What risks are hidden in our 2026 Master Services Agreement?"
            </span>
            <span className="ml-auto px-3 py-1 rounded-full bg-[#1A73E8] text-white text-xs font-bold">
              SEARCH
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7 bg-[#E8F0FE]/40 border border-[#D2E3FC] rounded-2xl p-5 space-y-3 text-left">
              <div className="flex items-center justify-between text-xs text-[#1A73E8] font-bold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  EVIDENCED DECISION BRIEF
                </span>
                <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold uppercase text-[10px]">HIGH RISK DETECTED</span>
              </div>
              <p className="text-xs md:text-sm text-[#202124] leading-relaxed font-medium">
                Section 8.4 contains an automatic 14% annual cost escalation clause triggering on Nov 1 unless written non-renewal notice is served by Oct 15.
              </p>
              <div className="p-3 rounded-xl bg-white border border-[#D2E3FC] text-xs text-[#5F6368] space-y-1 font-mono">
                <span className="text-[10px] text-[#1A73E8] font-bold uppercase">Source Grounding</span>
                <p className="text-[#202124]">"In the event Customer does not issue written notice... rates automatically adjust upward by 14%."</p>
                <div className="text-[10px] text-[#5F6368] flex justify-between pt-1">
                  <span>File: MSA_2026.pdf</span>
                  <span>Page 8 · Section 8.4</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 bg-white border border-[#E8EAED] rounded-2xl p-5 space-y-3 text-left">
              <span className="text-xs font-bold text-[#5F6368] uppercase tracking-wider">RECOMMENDED EXECUTIVE ACTION</span>
              <div className="p-3 rounded-xl bg-[#FEF7E0] border border-[#FCE8E6] text-xs text-[#B06000] space-y-1 font-medium">
                <p className="font-bold text-[#202124]">Renegotiate Price Cap</p>
                <p className="text-[#5F6368]">Issue formal non-renewal notice prior to Oct 15 to request capped annual rate adjustments at CPI (max 4%).</p>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs text-[#5F6368]">
                <span>Confidence Score: 99.8%</span>
                <span className="text-[#1A73E8] font-bold flex items-center gap-1 cursor-pointer">
                  Trace Citation <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUE PILLARS / BENEFIT CARDS ── */}
      <section className="py-16 bg-white border-y border-[#DADCE0]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Search,
              title: "Find answers in seconds",
              desc: "Stop hunting through 50-page PDFs. SYNAPS instantly locates exact clauses, financial figures, and operational terms."
            },
            {
              icon: ShieldCheck,
              title: "100% Grounded Evidence",
              desc: "Zero AI hallucinations. Every summary includes direct line citations back to your original source documents."
            },
            {
              icon: Lock,
              title: "Zero-Trust Data Security",
              desc: "Enterprise SOC 2 Type II compliance with multi-tenant data isolation. Your data stays private and is never used for LLM training."
            }
          ].map((item, idx) => (
            <div key={idx} className="gsap-fade-up p-8 rounded-2xl bg-[#F8F9FA] border border-[#E8EAED] space-y-3 text-left hover:border-[#1A73E8] transition-colors group">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F0FE] flex items-center justify-center text-[#1A73E8] group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#202124]">{item.title}</h3>
              <p className="text-sm text-[#5F6368] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STEP-BY-STEP HOW IT WORKS (GOOGLE STEP TABS) ── */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#1A73E8] uppercase tracking-widest">SIMPLE 3-STEP WORKFLOW</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#202124]">
            How SYNAPS works for your team
          </h2>
          <p className="text-sm text-[#5F6368]">
            Get set up in minutes and turn complex organizational records into actionable decisions.
          </p>
        </div>

        {/* Step Selector Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: 1, title: "1. Connect Your Data", desc: "Upload PDFs, XLSX ledgers, SOPs, or connect cloud storage." },
            { step: 2, title: "2. Query & Compare", desc: "Ask questions in plain English & run side-by-side contract deltas." },
            { step: 3, title: "3. Act with Confidence", desc: "Receive formatted decision briefs with verified line-level sources." }
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={cn(
                "p-6 rounded-2xl border text-left transition-all space-y-2",
                activeStep === s.step
                  ? "bg-white border-[#1A73E8] shadow-lg shadow-[#1A73E8]/10"
                  : "bg-[#F8F9FA] border-[#DADCE0] text-[#5F6368] hover:bg-white"
              )}
            >
              <span className={cn(
                "text-xs font-bold px-3 py-1 rounded-full inline-block",
                activeStep === s.step ? "bg-[#1A73E8] text-white" : "bg-[#E8EAED] text-[#5F6368]"
              )}>
                STEP {s.step}
              </span>
              <h3 className="text-base font-bold text-[#202124]">{s.title}</h3>
              <p className="text-xs text-[#5F6368]">{s.desc}</p>
            </button>
          ))}
        </div>

        {/* Step Content Preview Box */}
        <div className="bg-white rounded-3xl border border-[#DADCE0] p-8 shadow-xl text-left">
          {activeStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#202124]">Seamless Data Ingestion</h3>
              <p className="text-sm text-[#5F6368]">Drag and drop your company files or connect Google Drive, SharePoint, and AWS S3. SYNAPS automatically parses tables, text, signatures, and legal definitions.</p>
              <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E8EAED] flex items-center justify-between text-xs text-[#5F6368] font-mono">
                <span className="flex items-center gap-2 text-[#202124] font-semibold">
                  <FileText className="w-4 h-4 text-[#1A73E8]" /> Master_Services_Agreement_2026.pdf
                </span>
                <span className="text-[#34A853] font-bold">● Indexed & Vectorized</span>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#202124]">Natural Language Search & Delta Matrix</h3>
              <p className="text-sm text-[#5F6368]">Query complex terms like "Compare 2025 vs 2026 renewal notice windows". SYNAPS cross-references documents side-by-side and highlights exact changes.</p>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800">
                  <span className="block font-bold">2025 AGREEMENT</span>
                  12-Month Notice Window
                </div>
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800">
                  <span className="block font-bold">2026 AGREEMENT</span>
                  24-Month Notice Window (Uncapped)
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#202124]">Defensible Decision Briefs</h3>
              <p className="text-sm text-[#5F6368]">Export structured executive briefs formatted with risk ratings, clear action items, and audit-ready source citations.</p>
              <div className="p-4 rounded-2xl bg-[#E8F0FE] border border-[#D2E3FC] text-xs text-[#1A73E8] font-bold flex items-center justify-between">
                <span>Executive Decision Brief Ready</span>
                <Link href="/demo" className="px-4 py-1.5 rounded-full bg-[#1A73E8] text-white text-xs">
                  Export PDF Report
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── INTERACTIVE ROI & SAVINGS CALCULATOR ── */}
      <section id="calculator" className="py-20 bg-white border-y border-[#DADCE0]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="text-xs font-bold text-[#1A73E8] uppercase tracking-widest">ENTERPRISE ROI CALCULATOR</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#202124]">
              Calculate your time and cost savings with SYNAPS
            </h2>
            <p className="text-sm text-[#5F6368] leading-relaxed">
              See how much time your team saves by eliminating manual contract reading, document searches, and audit cross-referencing.
            </p>

            <div className="space-y-6 bg-[#F8F9FA] p-6 rounded-2xl border border-[#E8EAED]">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#202124]">
                  <span>Team Size (Knowledge Workers)</span>
                  <span className="text-[#1A73E8] font-mono">{teamSize} People</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full accent-[#1A73E8]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#202124]">
                  <span>Hours Spent Reading Documents / Week</span>
                  <span className="text-[#1A73E8] font-mono">{hoursPerWeek} Hours / Person</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="20"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="w-full accent-[#1A73E8]"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-[#E8F0FE] border border-[#D2E3FC] rounded-3xl p-8 space-y-6 text-left shadow-xl">
            <span className="text-xs font-bold text-[#1A73E8] uppercase tracking-wider">PROJECTED ANNUAL IMPACT</span>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <span className="block text-3xl md:text-4xl font-extrabold text-[#1A73E8]">
                  {annualHoursSaved.toLocaleString()} hrs
                </span>
                <span className="text-xs text-[#5F6368] font-medium">Time Saved Per Year</span>
              </div>
              <div>
                <span className="block text-3xl md:text-4xl font-extrabold text-[#34A853]">
                  ${annualDollarsSaved}
                </span>
                <span className="text-xs text-[#5F6368] font-medium">Estimated Productivity Value</span>
              </div>
            </div>

            <div className="border-t border-[#D2E3FC] pt-4 flex items-center justify-between text-xs text-[#202124] font-medium">
              <span>Risk Prevention Accuracy</span>
              <span className="text-[#1A73E8] font-bold">99.8% Grounded</span>
            </div>

            <Link
              href="/demo"
              className="w-full py-3.5 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-bold text-center block shadow-md"
            >
              Get Custom Enterprise Quote
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION ── */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-6 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-[#202124]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#5F6368]">Everything you need to know about SYNAPS enterprise deployment.</p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "How does SYNAPS prevent AI hallucinations?",
              a: "SYNAPS uses a proprietary Evidentiary Grounding Engine. Every generated answer is paired with a direct line-level citation to the source document. If a statement cannot be proven by your documents, SYNAPS explicitly flags it."
            },
            {
              q: "Is our enterprise data safe and private?",
              a: "Yes. SYNAPS operates under SOC 2 Type II and ISO 27001 guidelines with complete multi-tenant database isolation. Your documents and data are never used to train public LLM models."
            },
            {
              q: "What file formats does SYNAPS support?",
              a: "SYNAPS natively ingests PDFs, DOCX, XLSX spreadsheets, CSVs, plain text, and connects directly with Google Drive, SharePoint, and AWS S3 buckets."
            },
            {
              q: "Can we integrate SYNAPS with our existing API infrastructure?",
              a: "Yes. SYNAPS exposes full REST APIs, Webhooks, and SDKs for custom backend integrations."
            }
          ].map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-[#DADCE0] overflow-hidden text-left">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-6 flex items-center justify-between font-bold text-sm text-[#202124] hover:bg-[#F8F9FA] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={cn("w-4 h-4 text-[#5F6368] transition-transform", openFaq === idx && "rotate-180")} />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-6 text-xs md:text-sm text-[#5F6368] leading-relaxed border-t border-[#F1F3F4] pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER HIGH-CONVERSION CTA ── */}
      <footer className="py-16 bg-[#1A73E8] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Ready to make decisions you can defend?
          </h2>
          <p className="text-sm md:text-base text-white/80 max-w-xl mx-auto leading-relaxed">
            Join enterprise legal, risk, finance, and operations teams using SYNAPS to turn scattered documents into verifiable clarity.
          </p>
          <div className="pt-2">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-[#1A73E8] text-sm font-extrabold shadow-xl hover:bg-gray-100 transition-all"
            >
              Start Free Enterprise Demo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="pt-8 text-xs font-mono text-white/50">
            © 2026 SYNAPS INC. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

    </div>
  );
}
