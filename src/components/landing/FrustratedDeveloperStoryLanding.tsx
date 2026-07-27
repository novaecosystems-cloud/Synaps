"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Play, ArrowRight, X, ShieldCheck, Database, Zap, FileText, 
  CheckCircle2, ArrowUpRight, Lock, Activity, Layers, Download, 
  Laptop, Monitor, Terminal, Sparkles, ChevronDown, Plus, Globe, 
  Cpu, Award, Star, Compass, Command
} from 'lucide-react';

// Iconic Trionn-Style Synaps Brand Emblem
const SynapsEmblem = () => (
  <div className="relative group cursor-pointer">
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-black flex items-center justify-center font-black text-xl tracking-tighter shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform" style={{ fontFamily: "'Unbounded', sans-serif" }}>
      S
    </div>
    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping opacity-75" />
    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black" />
  </div>
);

export default function FrustratedDeveloperStoryLanding() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [copiedCli, setCopiedCli] = useState(false);

  // Initialize Desktop Auto-Skip & Smooth Scrolling
  useEffect(() => {
    if (typeof window !== 'undefined' && ((window as any).electron?.isDesktop || (window as any).__TAURI__)) {
      window.location.href = '/dashboard';
      return;
    }

    let lenisInstance: any;
    import('lenis').then(({ default: Lenis }) => {
      lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
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

  const handleCopyCli = () => {
    navigator.clipboard.writeText('npx synapse ask "summarize contract terms"');
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const faqs = [
    {
      q: "What makes Synaps AI different from standard ChatGPT or general LLM tools?",
      a: "General AI tools hallucinate legal clauses and lack enterprise context. Synaps AI creates an interconnected 3D Memory Graph of your contracts, board minutes, and financial reports with 100% line-level citations. Every redline is grounded in verified legal facts."
    },
    {
      q: "How does 60-Second Contract Redlining work?",
      a: "Upload any PDF, DOCX, or scan. Synaps AI runs a 10-Agent Legal Boardroom to auto-detect predatory vendor terms, auto-renewals, and liability traps—providing safe counter-clauses ready for signature in under 60 seconds."
    },
    {
      q: "Is our sensitive data safe and compliant with DPDP Act & GDPR?",
      a: "Yes. Synaps supports local offline LLM execution (Ollama & LM Studio) so your sensitive documents never leave your local machine or private cloud. All audit logs comply with DPDP Act 2023 millisecond integrity."
    },
    {
      q: "Can I use Synaps on Desktop and Terminal CLI?",
      a: "Yes. Synaps operates natively on macOS, Windows Desktop, and Terminal CLI (`npx synapse`). All platforms automatically sync with your organization's cloud memory."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#040507] text-slate-100 selection:bg-amber-400 selection:text-black relative overflow-x-hidden" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      
      {/* ── TRIONN + FRAMER AMBIENT GLOW BACKDROP ── */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-gradient-to-b from-amber-500/15 via-purple-600/5 to-transparent blur-[160px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-amber-500/5 blur-[180px] pointer-events-none z-0" />

      {/* ── FRAMER FLOATING GLASS NAVBAR ── */}
      <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl px-6 py-3.5 bg-[#090b10]/85 backdrop-blur-2xl border border-white/10 rounded-full flex items-center justify-between shadow-2xl transition-all">
        <div className="flex items-center gap-3">
          <SynapsEmblem />
          <span className="text-xl font-black tracking-tight text-white uppercase" style={{ fontFamily: "'Unbounded', sans-serif" }}>
            SYNAPS
          </span>
          <span className="hidden lg:inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            <Sparkles className="w-2.5 h-2.5" /> ENTERPRISE OS v2.0
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-300">
          <a href="#capabilities" className="hover:text-amber-400 transition-colors uppercase tracking-wider">Capabilities</a>
          <a href="#boardroom" className="hover:text-amber-400 transition-colors uppercase tracking-wider">10-Agent Boardroom</a>
          <a href="#faq" className="hover:text-amber-400 transition-colors uppercase tracking-wider">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setVideoModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/5"
          >
            <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Walkthrough
          </button>

          <a 
            href="/api/downloads/win"
            download
            className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-amber-400 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" /> Desktop Apps
          </a>

          <Link href="/login" className="text-xs font-bold text-slate-300 hover:text-white transition-colors px-3 py-1.5">
            Sign In
          </Link>
          
          <Link 
            href="/demo" 
            className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-black uppercase tracking-wider rounded-full transition-all shadow-lg shadow-amber-500/20 flex items-center gap-1.5 hover:scale-105"
            style={{ fontFamily: "'Unbounded', sans-serif" }}
          >
            Try Demo <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* ── TRIONN + FRAMER HERO SECTION ── */}
      <section className="pt-44 pb-20 px-6 md:px-12 max-w-6xl mx-auto text-center relative z-10">
        
        {/* Monospaced Pill Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-widest uppercase font-bold text-amber-400 mb-8 bg-amber-500/10 border border-amber-500/20 shadow-lg shadow-amber-500/5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          [ ✦ TRIONN x FRAMER DESIGN SYSTEM — 60s CONTRACT REDLINING ]
        </div>

        {/* Trionn Bold Uppercase Headline in UNBOUNDED */}
        <h1 
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight uppercase max-w-5xl mx-auto mb-8 text-white"
          style={{ fontFamily: "'Unbounded', sans-serif" }}
        >
          UPLOAD ANY DOCUMENT. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
            GET RISKS & COUNTER-TERMS IN 60s.
          </span>
        </h1>

        <p className="text-base md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 font-normal leading-relaxed">
          Instantly surface predatory vendor terms, hidden auto-renewals, and liability traps with 100% line-level citations. Backed by a 3D Memory Graph and a 10-Agent AI Boardroom.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link 
            href="/demo"
            className="w-full sm:w-auto px-9 py-4.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2.5 shadow-2xl shadow-amber-500/25 hover:scale-105"
            style={{ fontFamily: "'Unbounded', sans-serif" }}
          >
            Upload Document Now <ArrowRight className="w-4.5 h-4.5" />
          </Link>
          
          <button 
            onClick={() => setVideoModalOpen(true)}
            className="w-full sm:w-auto px-7 py-4.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all border border-white/15 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-amber-400 text-amber-400" /> Watch 1-Min Video
          </button>

          <a 
            href="/api/downloads/mac"
            download
            className="w-full sm:w-auto px-6 py-4.5 text-slate-300 hover:text-amber-400 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <Laptop className="w-4 h-4 text-amber-400" /> macOS App
          </a>

          <a 
            href="/api/downloads/win"
            download
            className="w-full sm:w-auto px-6 py-4.5 text-slate-300 hover:text-amber-400 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <Monitor className="w-4 h-4 text-amber-400" /> Windows App
          </a>
        </div>

        {/* ── TRIONN MARQUEE RUNNER ── */}
        <div className="w-full overflow-hidden py-4 border-y border-white/10 my-12 bg-white/[0.02] flex">
          <div className="flex items-center gap-12 whitespace-nowrap animate-marquee font-mono text-xs text-slate-400 uppercase font-bold tracking-widest shrink-0">
            <span className="flex items-center gap-2 text-amber-400"><Sparkles className="w-3.5 h-3.5" /> 60-SECOND CONTRACT REDLINING</span>
            <span>•</span>
            <span>3D ORGANIZATIONAL MEMORY GRAPH</span>
            <span>•</span>
            <span className="text-amber-400">10-AGENT EXECUTIVE BOARDROOM</span>
            <span>•</span>
            <span>100% LINE-LEVEL CITATIONS</span>
            <span>•</span>
            <span className="text-amber-400">DPDP ACT 2023 COMPLIANT AUDIT LOGGING</span>
            <span>•</span>
            <span>LOCAL LLM PRIVACY SUPPORT (OLLAMA / LM STUDIO)</span>
            <span>•</span>
            <span className="flex items-center gap-2 text-amber-400"><Sparkles className="w-3.5 h-3.5" /> 60-SECOND CONTRACT REDLINING</span>
            <span>•</span>
            <span>3D ORGANIZATIONAL MEMORY GRAPH</span>
            <span>•</span>
            <span className="text-amber-400">10-AGENT EXECUTIVE BOARDROOM</span>
            <span>•</span>
            <span>100% LINE-LEVEL CITATIONS</span>
            <span>•</span>
            <span className="text-amber-400">DPDP ACT 2023 COMPLIANT AUDIT LOGGING</span>
            <span>•</span>
            <span>LOCAL LLM PRIVACY SUPPORT (OLLAMA / LM STUDIO)</span>
          </div>
        </div>

        {/* Framer Video Frame with macOS Windows Controls */}
        <div className="relative group max-w-5xl mx-auto rounded-3xl p-2 bg-[#0a0c12] border border-white/15 shadow-2xl shadow-amber-500/10">
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#11141e] rounded-t-2xl border-b border-white/10 mb-2 font-mono text-xs text-slate-400">
            <div className="flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F]" />
              <span className="ml-3 font-bold text-white tracking-tight">synaps-intelligence-demo.mp4</span>
            </div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-md border border-amber-500/20">
              ● Live Studio Demo
            </span>
          </div>

          <video
            src="/synaps-landing-video.mp4"
            autoPlay
            muted
            loop
            playsInline
            controls
            className="w-full h-auto rounded-2xl shadow-2xl object-cover bg-black"
          />
        </div>
      </section>

      {/* ── BENTO GRID CAPABILITIES (TRIONN STYLE) ── */}
      <section id="capabilities" className="py-28 px-6 md:px-12 max-w-6xl mx-auto border-t border-white/10 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
            [ ⚡ ENTERPRISE CAPABILITIES ]
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
            ZERO HALLUCINATIONS. <br />
            <span className="text-amber-400">PURE MATHEMATICAL CITATIONS.</span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg">
            Every answer, redline, and risk score is backed by exact line-level source quotes across your company documents.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: 1-Click Auto-Redliner */}
          <div className="p-8 rounded-3xl bg-[#090b10] border border-white/10 hover:border-amber-500/40 transition-all space-y-5 text-left group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black uppercase text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
              1-Click Auto-Redliner
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Detects predatory vendor terms, auto-renewals, and liability traps with proposed safer counter-clauses in 60 seconds.
            </p>
            <div className="pt-4 border-t border-white/10 text-xs font-mono text-amber-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Line-level cited counter-terms
            </div>
          </div>

          {/* Card 2: 3D Memory Graph */}
          <div className="p-8 rounded-3xl bg-[#090b10] border border-white/10 hover:border-amber-500/40 transition-all space-y-5 text-left group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black uppercase text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
              3D Memory Graph
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Unifies contracts, board minutes, and financial forecasts into an interconnected 3D knowledge graph with zero hallucinations.
            </p>
            <div className="pt-4 border-t border-white/10 text-xs font-mono text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Grounded graph reasoning
            </div>
          </div>

          {/* Card 3: 10-Agent Boardroom */}
          <div className="p-8 rounded-3xl bg-[#090b10] border border-white/10 hover:border-amber-500/40 transition-all space-y-5 text-left group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black uppercase text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
              10-Agent Boardroom
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Specialized AI agents (CEO, CFO, Legal Counsel, Risk Officer) inspect decisions from conflicting operational perspectives.
            </p>
            <div className="pt-4 border-t border-white/10 text-xs font-mono text-amber-400 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" /> Multi-agent consensus
            </div>
          </div>

        </div>
      </section>

      {/* ── TERMINAL CLI SIMULATOR (TRIONN STYLE) ── */}
      <section className="py-20 px-6 md:px-12 max-w-5xl mx-auto relative z-10">
        <div className="p-8 rounded-3xl bg-[#06080c] border border-white/15 shadow-2xl text-left space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 font-mono text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white">NATIVE TERMINAL CLI (`synaps`)</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded">
              v2.0.0 Stable
            </span>
          </div>

          <div className="p-4 rounded-xl bg-black font-mono text-xs text-amber-400 flex items-center justify-between border border-white/10">
            <code>npx synapse ask "summarize contract terms"</code>
            <button 
              onClick={handleCopyCli}
              className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold rounded-lg transition-colors border border-amber-500/30"
            >
              {copiedCli ? 'Copied! ✅' : 'Copy Code'}
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Developers and executives can run `synaps` directly inside any terminal shell (macOS, Windows, Linux) to query company documents and redline contracts without leaving their workflow.
          </p>
        </div>
      </section>

      {/* ── FAQ SECTION (FRAMER ACCORDION) ── */}
      <section id="faq" className="py-28 px-6 md:px-12 max-w-4xl mx-auto border-t border-white/10 relative z-10">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
            [ FREQUENTLY ASKED QUESTIONS ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
            EVERYTHING YOU NEED TO KNOW.
          </h2>
        </div>

        <div className="space-y-4 text-left">
          {faqs.map((faq, i) => (
            <div 
              key={i}
              className="rounded-2xl bg-[#090b10] border border-white/10 overflow-hidden transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full p-6 text-left font-bold text-base text-white flex items-center justify-between gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-amber-400 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === i && (
                <div className="px-6 pb-6 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-28 px-6 md:px-12 text-center border-t border-white/10 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl sm:text-7xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
            FROM CHAOS TO <span className="text-amber-400">CLARITY.</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Upload your first business document and experience 60-second grounded AI document intelligence.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              href="/demo"
              className="px-10 py-5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center gap-2.5 shadow-2xl shadow-amber-500/20 hover:scale-105"
              style={{ fontFamily: "'Unbounded', sans-serif" }}
            >
              Start Free Demo Now <ArrowRight className="w-4.5 h-4.5" />
            </Link>

            <a 
              href="/api/downloads/win"
              download
              className="px-8 py-5 text-slate-300 hover:text-amber-400 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-amber-400" /> Download Windows App
            </a>

            <a 
              href="/api/downloads/mac"
              download
              className="px-8 py-5 text-slate-300 hover:text-amber-400 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Laptop className="w-4 h-4 text-amber-400" /> Download macOS App
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER WITH LEGAL LINKS ── */}
      <footer className="py-14 px-6 md:px-12 border-t border-white/10 text-center font-mono text-xs text-slate-400 space-y-6 relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-6 font-sans text-xs">
          <Link href="/legal/privacy" className="hover:text-amber-400 transition-colors flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Privacy Policy (GDPR / CCPA / DPDP)
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/legal/terms" className="hover:text-amber-400 transition-colors">
            Terms of Service
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/legal/disclaimer" className="hover:text-amber-400 transition-colors text-amber-400 font-bold">
            AI Legal Disclaimer
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/legal/refund" className="hover:text-amber-400 transition-colors">
            14-Day Refund & Cancellation
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/legal/acceptable-use" className="hover:text-amber-400 transition-colors">
            Acceptable Use Policy
          </Link>
        </div>

        <div className="p-4 max-w-3xl mx-auto text-[11px] text-slate-400 font-sans leading-relaxed">
          <strong className="text-amber-400 font-bold">Regulatory Disclaimer:</strong> Synaps AI provides automated document redlining and clause risk analysis for informational and workflow efficiency purposes only. Synaps is an artificial intelligence software service and does not provide formal legal representation or legal advice. All redlines and counter-terms should be reviewed by a licensed attorney prior to signing binding agreements.
        </div>

        <div className="flex items-center justify-center gap-3 text-slate-500 text-[11px] pt-2">
          <SynapsEmblem />
          <span>SYNAPS ENTERPRISE OS — ALL RIGHTS RESERVED.</span>
        </div>
      </footer>

      {/* ── VIDEO MODAL ── */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button 
            onClick={() => setVideoModalOpen(false)}
            className="absolute top-6 right-6 p-3 bg-white text-black font-mono font-bold text-xs uppercase rounded-xl"
          >
            [CLOSE X]
          </button>
          <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10">
            <video 
              src="/synaps-landing-video.mp4" 
              controls 
              autoPlay 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      )}
    </div>
  );
}
