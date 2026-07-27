"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Play, ArrowRight, X, ShieldCheck, Database, Zap, FileText, CheckCircle2, ArrowUpRight, Lock, Activity, Layers, Download, Terminal, Monitor, Laptop, Check, Copy } from 'lucide-react';

// Iconic 'S' Logo for Synaps
const SynapsSLogo = () => (
  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-500 to-cyan-400 p-[1.5px] shadow-[0_0_20px_rgba(245,158,11,0.35)]">
    <div className="w-full h-full bg-[#07090e] rounded-[10px] flex items-center justify-center text-amber-400 font-black text-xl tracking-tighter" style={{ fontFamily: "'Unbounded', sans-serif" }}>
      S
    </div>
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
    <div className="w-full min-h-screen bg-[#07090e] text-white selection:bg-amber-500 selection:text-black relative overflow-x-hidden" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      
      {/* ── BACKGROUND AMBIENT GLOW & GRID ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-600/15 via-amber-500/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* ── HEADER NAVIGATION ── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 bg-[#07090e]/80 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SynapsSLogo />
          <span className="text-xl font-extrabold tracking-tight text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
            SYNAPS
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold bg-indigo-500/10 px-2.5 py-1 rounded-md">
            ENTERPRISE OS
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setVideoModalOpen(true)}
            className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Watch Walkthrough
          </button>
          
          <button
            onClick={() => setDownloadModalOpen(true)}
            className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Download Apps & CLI
          </button>

          <Link href="/login" className="text-xs font-bold text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link 
            href="/demo" 
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-[0_0_25px_rgba(245,158,11,0.35)] flex items-center gap-1.5"
            style={{ fontFamily: "'Unbounded', sans-serif" }}
          >
            Try Free Demo <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="pt-40 pb-20 px-6 md:px-12 max-w-6xl mx-auto text-center relative z-10">
        
        {/* Subtitle Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-xs font-bold text-amber-400 mb-8 backdrop-blur-md">
          <Zap className="w-3.5 h-3.5 fill-amber-400" /> Grounded Instant Document Intelligence & Redlining
        </div>

        {/* Punchy Headline in UNBOUNDED Font */}
        <h1 
          className="text-4xl sm:text-6xl md:text-7xl font-black leading-[1.1] tracking-tight uppercase max-w-5xl mx-auto mb-8"
          style={{ fontFamily: "'Unbounded', sans-serif" }}
        >
          UPLOAD ANY DOCUMENT. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-indigo-400">GET RISKS & COUNTER-TERMS IN 60s.</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 font-normal leading-relaxed">
          Instantly surface predatory vendor terms, hidden fees, and liability traps with 100% line-level citations. Backed by a 3D Memory Graph and a 10-Agent AI Boardroom.
        </p>

        {/* CTA Buttons - CLEAN & BORDERLESS (NO BOX BORDERS) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-12">
          <Link 
            href="/demo"
            className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_35px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2"
            style={{ fontFamily: "'Unbounded', sans-serif" }}
          >
            Upload Document Now <ArrowRight className="w-4 h-4" />
          </Link>
          
          <button 
            onClick={() => setVideoModalOpen(true)}
            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-amber-400 text-amber-400" /> Watch 1-Min Video
          </button>

          <button 
            onClick={() => setDownloadModalOpen(true)}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-cyan-400" /> Download macOS / Windows / CLI
          </button>
        </div>

        {/* ── MULTI-USER CLOUD SYNC & DOWNLOAD BANNER ── */}
        <div className="max-w-4xl mx-auto mb-16 p-6 rounded-2xl bg-slate-900/80 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6 pb-6 border-b border-white/10">
            <div className="text-left space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-md">
                ● MULTI-USER SIMULTANEOUS CLOUD SYNC READY
              </span>
              <h3 className="text-lg font-black text-white uppercase tracking-tight" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                DESKTOP APPS (MAC/WINDOWS) & TERMINAL CLI
              </h3>
              <p className="text-xs text-slate-400">
                Runs 24/7 on thousands of user computers simultaneously with isolated encrypted cloud sync.
              </p>
            </div>

            {/* Download Popup Trigger Button */}
            <button 
              onClick={() => setDownloadModalOpen(true)}
              className="px-5 py-3 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-lg"
              style={{ fontFamily: "'Unbounded', sans-serif" }}
            >
              <Download className="w-4 h-4 text-black" /> Get Downloads & CLI <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Terminal CLI Command Snippet */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-black/70 font-mono text-xs">
            <div className="flex items-center gap-3 text-slate-300 overflow-x-auto w-full sm:w-auto">
              <span className="text-amber-400 font-bold">$</span>
              <code className="text-emerald-400">npx synapse ask "summarize contract terms"</code>
            </div>
            <button 
              onClick={copyCliCommand}
              className="px-3.5 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 rounded-lg text-[11px] font-sans font-bold transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCli ? 'Copied to Clipboard!' : 'Copy CLI Command'}
            </button>
          </div>
        </div>

        {/* Interactive Showcase Frame (Cluely Video Mockup) */}
        <div className="relative group max-w-5xl mx-auto">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/30 via-indigo-500/30 to-cyan-500/30 blur-2xl group-hover:opacity-100 transition duration-1000 opacity-60" />
          
          <div className="relative bg-[#0d1017] rounded-3xl p-3 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[#131822] rounded-t-2xl border-b border-white/10 mb-2 font-mono text-xs text-slate-400">
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
        </div>
      </section>

      {/* ── BENTO GRID FEATURES ── */}
      <section className="py-28 px-6 md:px-12 max-w-6xl mx-auto border-t border-white/10 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">
            [ENTERPRISE CAPABILITIES]
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
            BUILT FOR ZERO RISK.
          </h2>
          <p className="text-slate-400 text-base">
            Every answer is mathematically cited with line-level source verification. No generic guesses.
          </p>
        </div>

        {/* Feature Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Auto Redliner */}
          <div className="p-8 bg-[#0d1017] rounded-3xl space-y-4 hover:bg-[#121622] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold uppercase text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
              1-Click Auto-Redliner
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Detects predatory vendor terms, auto-renewals, and liability traps with proposed safer counter-clauses.
            </p>
            <div className="pt-2 text-xs font-mono text-emerald-400">
              ✅ Line-level cited counter-terms
            </div>
          </div>

          {/* Card 2: 3D Memory Graph */}
          <div className="p-8 bg-[#0d1017] rounded-3xl space-y-4 hover:bg-[#121622] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold uppercase text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
              3D Memory Graph
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Unifies contracts, board minutes, and financial forecasts into an interconnected 3D knowledge graph.
            </p>
            <div className="pt-2 text-xs font-mono text-indigo-400">
              🧠 Zero hallucinations
            </div>
          </div>

          {/* Card 3: 10-Agent Boardroom */}
          <div className="p-8 bg-[#0d1017] rounded-3xl space-y-4 hover:bg-[#121622] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold uppercase text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
              10-Agent Boardroom
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Specialized AI agents (CEO, CFO, Legal, Risk Officer) inspect decisions from conflicting operational angles.
            </p>
            <div className="pt-2 text-xs font-mono text-cyan-400">
              🏛️ Multi-agent consensus
            </div>
          </div>

        </div>
      </section>

      {/* ── BOTTOM CTA BANNER ── */}
      <section className="py-28 px-6 md:px-12 text-center border-t border-white/10 relative z-10">
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
              className="px-10 py-5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_40px_rgba(245,158,11,0.5)] flex items-center gap-2"
              style={{ fontFamily: "'Unbounded', sans-serif" }}
            >
              Start Free Demo Now <ArrowRight className="w-4 h-4" />
            </Link>

            <button 
              onClick={() => setDownloadModalOpen(true)}
              className="px-8 py-5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-cyan-400" /> Download Desktop Apps & CLI
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER WITH FULL LEGAL & REGULATORY COMPLIANCE LINKS ── */}
      <footer className="py-12 px-6 md:px-12 border-t border-white/10 text-center font-mono text-xs text-slate-400 space-y-6 relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-6 font-sans text-xs">
          <Link href="/legal/privacy" className="hover:text-amber-400 transition-colors flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Privacy Policy (GDPR / CCPA / DPDP)
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

        <div className="p-4 max-w-3xl mx-auto rounded-xl bg-black/60 text-[11px] text-slate-400 font-sans leading-relaxed">
          <strong className="text-amber-400 font-bold">Regulatory Disclaimer:</strong> Synaps AI provides automated document redlining and clause risk analysis for informational and workflow efficiency purposes only. Synaps is an artificial intelligence software service and does not provide formal legal representation or legal advice. All redlines and counter-terms should be reviewed by a licensed attorney prior to signing binding agreements.
        </div>

        <div className="flex items-center justify-center gap-3 text-slate-500 text-[11px] pt-2">
          <SynapsSLogo />
          <span>SYNAPS ENTERPRISE OS — ALL RIGHTS RESERVED.</span>
        </div>
      </footer>

      {/* ── INTERACTIVE DOWNLOAD MODAL / POPUP ── */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="bg-[#0b0e17] max-w-3xl w-full rounded-3xl p-8 relative shadow-2xl space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <SynapsSLogo />
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-md">
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
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Platform Download Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              
              {/* Option 1: macOS */}
              <div className="p-5 bg-[#121622] rounded-2xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
                    <Laptop className="w-4 h-4 text-cyan-400" /> macOS Desktop App
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Universal binary for Apple Silicon (M1/M2/M3/M4) and Intel Macs. Includes top Menu Bar access.
                  </p>
                </div>
                <a 
                  href="/downloads/Synapse-macOS.dmg" 
                  download
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl text-center transition-all flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Unbounded', sans-serif" }}
                >
                  <Download className="w-3.5 h-3.5" /> Download .dmg
                </a>
              </div>

              {/* Option 2: Windows */}
              <div className="p-5 bg-[#121622] rounded-2xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
                    <Monitor className="w-4 h-4 text-indigo-400" /> Windows Desktop App
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Native Windows 10/11 x64 installer. Includes system tray background watcher and auto-redlining.
                  </p>
                </div>
                <a 
                  href="/downloads/Synapse-Windows.exe" 
                  download
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl text-center transition-all flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Unbounded', sans-serif" }}
                >
                  <Download className="w-3.5 h-3.5" /> Download .exe
                </a>
              </div>

              {/* Option 3: Terminal CLI */}
              <div className="p-5 bg-[#121622] rounded-2xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
                    <Terminal className="w-4 h-4 text-emerald-400" /> Terminal CLI (`synapse`)
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Command-line interface for developer terminals, scripts, and server environments.
                  </p>
                </div>
                <button 
                  onClick={copyCliCommand}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl text-center transition-all flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Unbounded', sans-serif" }}
                >
                  {copiedCli ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCli ? 'Copied!' : 'Copy CLI Command'}
                </button>
              </div>

            </div>

            {/* Terminal Quickstart Snippet */}
            <div className="p-4 bg-black/80 rounded-2xl space-y-2 font-mono text-xs">
              <div className="text-slate-400 font-sans text-[11px] font-bold">Terminal One-Liner Quickstart:</div>
              <div className="flex items-center justify-between text-emerald-400 bg-[#090c14] p-3 rounded-xl">
                <span>$ npx synapse ask "What are our high risk liability clauses?"</span>
                <button onClick={copyCliCommand} className="text-indigo-400 hover:text-white text-[11px]">Copy</button>
              </div>
            </div>

            <div className="text-center text-[11px] text-slate-500 font-mono pt-2">
              🔒 100% Encrypted & Multi-User Synchronized Architecture
            </div>

          </div>
        </div>
      )}

      {/* ── VIDEO MODAL ── */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <button 
            onClick={() => setVideoModalOpen(false)}
            className="absolute top-6 right-6 p-3 bg-white text-black font-mono font-bold text-xs uppercase rounded-xl"
          >
            [CLOSE X]
          </button>
          <div className="w-full max-w-4xl aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl">
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
