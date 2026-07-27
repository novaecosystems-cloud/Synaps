"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Play, ArrowRight, X, ShieldCheck, Database, Zap, FileText, CheckCircle2, ArrowUpRight, Lock, Activity, Layers, Download, Terminal, Monitor, Laptop, Check, Copy } from 'lucide-react';

// Iconic Clean 'S' Logo for Synaps
const SynapsSLogo = () => (
  <div className="w-8 h-8 rounded-lg bg-amber-500 text-black flex items-center justify-center font-black text-lg tracking-tighter shadow-sm" style={{ fontFamily: "'Unbounded', sans-serif" }}>
    S
  </div>
);

export default function FrustratedDeveloperStoryLanding() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);

  // Initialize Desktop Auto-Skip Landing Page & Smooth Lenis Scrolling
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

  const copyCliCommand = () => {
    navigator.clipboard.writeText('npx synapse ask "summarize contract terms"');
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2500);
  };

  return (
    <div className="w-full min-h-screen bg-[#050608] text-white selection:bg-amber-500 selection:text-black relative overflow-x-hidden" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      
      {/* ── AMBIENT CLUELY GLOW ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-amber-500/10 via-indigo-500/5 to-transparent blur-[120px] pointer-events-none" />

      {/* ── CLUELY-STYLE FLOATING NAVBAR ── */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl px-6 py-3.5 bg-[#0a0c12]/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <SynapsSLogo />
          <span className="text-lg font-extrabold tracking-tight text-white uppercase" style={{ fontFamily: "'Unbounded', sans-serif" }}>
            SYNAPS
          </span>
          <span className="hidden md:inline-block text-[9px] font-mono uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">
            ENTERPRISE OS
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setVideoModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Walkthrough
          </button>
          
          <button
            onClick={() => setDownloadModalOpen(true)}
            className="text-xs font-bold text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" /> Downloads & CLI
          </button>

          <Link href="/login" className="text-xs font-bold text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
          
          <Link 
            href="/demo" 
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider rounded-full transition-all shadow-md flex items-center gap-1"
            style={{ fontFamily: "'Unbounded', sans-serif" }}
          >
            Try Demo <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* ── CLUELY HERO SECTION ── */}
      <section className="pt-44 pb-20 px-6 md:px-12 max-w-6xl mx-auto text-center relative z-10">
        
        {/* Subtitle Mono Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase font-bold text-amber-400 mb-8 bg-amber-500/10 border border-amber-500/20">
          [ ⚡ 60-SECOND CONTRACT REDLINING & 3D MEMORY GRAPH ]
        </div>

        {/* Cluely Punchy Uppercase Headline in UNBOUNDED */}
        <h1 
          className="text-4xl sm:text-6xl md:text-7xl font-black leading-[1.08] tracking-tight uppercase max-w-5xl mx-auto mb-8"
          style={{ fontFamily: "'Unbounded', sans-serif" }}
        >
          UPLOAD ANY DOCUMENT. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-100">GET RISKS & COUNTER-TERMS IN 60s.</span>
        </h1>

        <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
          Instantly surface predatory vendor terms, hidden fees, and liability traps with 100% line-level citations. Backed by a 3D Memory Graph and a 10-Agent AI Boardroom.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16">
          <Link 
            href="/demo"
            className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl"
            style={{ fontFamily: "'Unbounded', sans-serif" }}
          >
            Upload Document Now <ArrowRight className="w-4 h-4" />
          </Link>
          
          <button 
            onClick={() => setVideoModalOpen(true)}
            className="w-full sm:w-auto px-6 py-4 text-white hover:text-amber-400 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-amber-400 text-amber-400" /> Watch 1-Min Video
          </button>

          <button 
            onClick={() => setDownloadModalOpen(true)}
            className="w-full sm:w-auto px-6 py-4 text-slate-300 hover:text-amber-400 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-amber-400" /> Get macOS / Windows / CLI
          </button>
        </div>

        {/* ── CLUELY MINIMAL DOWNLOAD BARNER ── */}
        <div className="max-w-4xl mx-auto mb-16 py-8 px-6 text-left border-t border-b border-white/10 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                ● MULTI-USER SIMULTANEOUS CLOUD SYNC READY
              </span>
              <h3 className="text-xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                DESKTOP APPS (MAC/WINDOWS) & TERMINAL CLI
              </h3>
              <p className="text-xs text-slate-400 max-w-xl">
                Runs 24/7 on thousands of user computers simultaneously with isolated encrypted cloud synchronization.
              </p>
            </div>

            {/* Direct Instant Downloads */}
            <div className="flex flex-wrap items-center gap-3">
              <a 
                href="/api/downloads/mac" 
                download
                className="px-4 py-2.5 bg-white text-black hover:bg-slate-200 rounded-xl text-xs font-bold transition-all"
              >
                Download macOS App
              </a>
              <a 
                href="/api/downloads/win" 
                download
                className="px-4 py-2.5 bg-amber-500 text-black hover:bg-amber-400 rounded-xl text-xs font-bold transition-all"
              >
                Download Windows App
              </a>
            </div>
          </div>

          {/* Terminal Command Box */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-black font-mono text-xs text-slate-300 border border-white/10">
            <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto">
              <span className="text-amber-400 font-bold">$</span>
              <code>npx synapse ask "summarize contract terms"</code>
            </div>
            <button 
              onClick={copyCliCommand}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px] font-sans font-bold transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              {copiedCli ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCli ? 'Copied to Clipboard!' : 'Copy CLI Command'}
            </button>
          </div>
        </div>

        {/* Cluely Video Mockup Frame with macOS Dots */}
        <div className="relative group max-w-5xl mx-auto rounded-3xl p-2 bg-[#0c0e14] border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 bg-[#11141c] rounded-t-2xl border-b border-white/10 mb-2 font-mono text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              <span className="ml-2 font-bold text-white">synaps-intelligence-demo.mp4</span>
            </div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-md">
              Live Walkthrough
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

      {/* ── BENTO GRID CAPABILITIES ── */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto border-t border-white/10 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
            [ENTERPRISE CAPABILITIES]
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
            BUILT FOR ZERO RISK.
          </h2>
          <p className="text-slate-400 text-base">
            Every answer is mathematically cited with line-level source verification. No generic guesses.
          </p>
        </div>

        {/* Open Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Card 1: Auto Redliner */}
          <div className="space-y-4 text-left">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold uppercase text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
              1-Click Auto-Redliner
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Detects predatory vendor terms, auto-renewals, and liability traps with proposed safer counter-clauses.
            </p>
            <div className="pt-2 text-xs font-mono text-amber-400">
              ✅ Line-level cited counter-terms
            </div>
          </div>

          {/* Card 2: 3D Memory Graph */}
          <div className="space-y-4 text-left">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold uppercase text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
              3D Memory Graph
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Unifies contracts, board minutes, and financial forecasts into an interconnected 3D knowledge graph.
            </p>
            <div className="pt-2 text-xs font-mono text-amber-400">
              🧠 Zero hallucinations
            </div>
          </div>

          {/* Card 3: 10-Agent Boardroom */}
          <div className="space-y-4 text-left">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold uppercase text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
              10-Agent Boardroom
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Specialized AI agents (CEO, CFO, Legal, Risk Officer) inspect decisions from conflicting operational angles.
            </p>
            <div className="pt-2 text-xs font-mono text-amber-400">
              🏛️ Multi-agent consensus
            </div>
          </div>

        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-24 px-6 md:px-12 text-center border-t border-white/10 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl sm:text-7xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
            FROM CHAOS TO <span className="text-amber-400">CLARITY.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Upload your first business document and experience 60-second grounded AI document intelligence.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              href="/demo"
              className="px-10 py-5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-xl"
              style={{ fontFamily: "'Unbounded', sans-serif" }}
            >
              Start Free Demo Now <ArrowRight className="w-4 h-4" />
            </Link>

            <button 
              onClick={() => setDownloadModalOpen(true)}
              className="px-8 py-5 text-slate-300 hover:text-amber-400 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-amber-400" /> Download Desktop Apps & CLI
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER WITH LEGAL LINKS ── */}
      <footer className="py-12 px-6 md:px-12 border-t border-white/10 text-center font-mono text-xs text-slate-400 space-y-6 relative z-10">
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
          <SynapsSLogo />
          <span>SYNAPS ENTERPRISE OS — ALL RIGHTS RESERVED.</span>
        </div>
      </footer>

      {/* ── MINIMALIST DOWNLOAD MODAL ── */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090b10] border border-white/10 max-w-2xl w-full rounded-2xl p-8 relative shadow-2xl space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <SynapsSLogo />
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                    SYNAPS DESKTOP & TERMINAL SUITE
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white uppercase pt-2" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                  DOWNLOAD SYNAPS APPS & CLI
                </h2>
                <p className="text-xs text-slate-400">
                  Runs 24/7 on unlimited computers simultaneously with instant encrypted cloud synchronization.
                </p>
              </div>

              <button 
                onClick={() => setDownloadModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Platform Download Options List */}
            <div className="space-y-4 pt-2 font-sans">
              
              {/* Option 1: macOS */}
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Laptop className="w-4 h-4 text-amber-400" /> macOS Desktop App
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Universal binary for Apple Silicon (M1/M2/M3/M4) & Intel Macs.
                  </p>
                </div>
                <a 
                  href="/api/downloads/mac" 
                  download
                  className="px-5 py-2.5 bg-white text-black hover:bg-slate-200 font-bold text-xs rounded-xl transition-all"
                >
                  Download macOS
                </a>
              </div>

              {/* Option 2: Windows */}
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Monitor className="w-4 h-4 text-amber-400" /> Windows Desktop App
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Native Windows 10/11 x64 installer with system tray background watcher.
                  </p>
                </div>
                <a 
                  href="/api/downloads/win" 
                  download
                  className="px-5 py-2.5 bg-amber-500 text-black hover:bg-amber-400 font-bold text-xs rounded-xl transition-all"
                >
                  Download Windows
                </a>
              </div>

              {/* Option 3: Terminal CLI */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Terminal className="w-4 h-4 text-amber-400" /> Terminal CLI (`synapse`)
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Command-line interface for developer terminals, scripts, & server environments.
                  </p>
                </div>
                <button 
                  onClick={copyCliCommand}
                  className="px-5 py-2.5 bg-slate-800 text-white hover:bg-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                >
                  {copiedCli ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCli ? 'Copied!' : 'Copy CLI Command'}
                </button>
              </div>

            </div>

            {/* Terminal Quickstart Command */}
            <div className="p-4 bg-black rounded-xl space-y-2 font-mono text-xs text-slate-300 border border-white/10">
              <div className="text-slate-400 text-[11px] font-sans font-bold">Terminal Quickstart One-Liner:</div>
              <div className="flex items-center justify-between text-amber-400">
                <span>$ npx synapse ask "What are our high risk liability clauses?"</span>
                <button onClick={copyCliCommand} className="text-slate-400 hover:text-white text-[11px]">Copy</button>
              </div>
            </div>

            <div className="text-center text-[11px] text-slate-500 font-mono pt-2">
              🔒 Multi-User Encrypted Cloud Sync
            </div>

          </div>
        </div>
      )}

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
