import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Cpu, HardDrive, Users, ScanLine, FileText, Globe, Layers, Code2, Boxes, ArrowRight, Terminal } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Shourya — Founder & AI Systems Architect',
  description: 'Personal portfolio and technical vision of Shourya (Age 17), creator of Synaps Sovereign Enterprise AI OS.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#070709] text-white font-sans selection:bg-[#fc4778] selection:text-white antialiased relative overflow-x-hidden">
      
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-[#fc4778]/10 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-[#00f0ff]/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-[#10b981]/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 py-16 space-y-20">
        
        {/* Navigation Bar */}
        <header className="flex items-center justify-between border-b border-neutral-800/80 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-black font-mono font-extrabold text-base flex items-center justify-center shadow-lg">
              S
            </div>
            <div>
              <span className="font-mono font-bold text-sm text-white tracking-wider">SHOURYA</span>
              <span className="text-[11px] text-neutral-400 block font-mono">Founder & AI Product Architect · Age 17</span>
            </div>
          </div>

          <nav className="flex items-center gap-4 sm:gap-6 text-xs font-mono">
            <a href="#work" className="text-neutral-400 hover:text-white transition-colors">WORK</a>
            <a href="#hardware" className="text-neutral-400 hover:text-[#00f0ff] transition-colors">FUTURE HARDWARE</a>
            <a href="#stack" className="text-neutral-400 hover:text-white transition-colors hidden sm:inline">STACK</a>
            <Link 
              href="/" 
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white hover:text-black text-white font-bold transition-all border border-white/20 flex items-center gap-1"
            >
              <span>Synaps OS</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="space-y-6 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fc4778]/10 border border-[#fc4778]/30 text-[#fc4778] font-mono text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#fc4778] animate-pulse" />
            <span>AI-NATIVE BUILDER & SYSTEMS ARCHITECT</span>
          </div>

          <h1 className="text-4xl sm:text-7xl font-bold tracking-tight text-white leading-[1.08] max-w-4xl">
            Architecting sovereign intelligence for high-stakes enterprise decisions.
          </h1>

          <p className="text-neutral-300 text-lg sm:text-xl font-normal leading-relaxed max-w-3xl">
            I am a 17-year-old product builder focused on transforming ungrounded LLMs into verifiable corporate truth through multi-agent dialectics, strict mathematical citations, and air-gapped hardware architecture.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a 
              href="#work" 
              className="px-6 py-3.5 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#fc4778] hover:text-white transition-all shadow-lg flex items-center gap-2"
            >
              <span>Explore Flagship Work</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link 
              href="/" 
              className="px-6 py-3.5 rounded-full bg-neutral-900 border border-neutral-800 text-white font-mono text-xs font-bold uppercase tracking-wider hover:border-[#fc4778] transition-all flex items-center gap-2"
            >
              <span>Launch Synaps Live Platform</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Empirical Metrics Scorecard */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-[#fc4778]">99.29%</div>
            <div className="text-xs text-neutral-400 uppercase">HELM Benchmark Accuracy</div>
          </div>
          <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-[#00f0ff]">1,500</div>
            <div className="text-xs text-neutral-400 uppercase">Stanford HELM Trials</div>
          </div>
          <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-[#10b981]">10 Twins</div>
            <div className="text-xs text-neutral-400 uppercase">C-Suite Boardroom OS</div>
          </div>
          <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-amber-400">2.00 GB</div>
            <div className="text-xs text-neutral-400 uppercase">Air-Gapped Desktop OS</div>
          </div>
        </section>

        {/* Flagship Project: SYNAPS */}
        <section id="work" className="space-y-8">
          <div className="flex items-end justify-between border-b border-neutral-800 pb-4">
            <div>
              <span className="font-mono text-xs text-[#fc4778] uppercase font-bold tracking-widest">// FLAGSHIP SYSTEM</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">SYNAPS Sovereign OS</h2>
            </div>
            <span className="text-xs font-mono text-neutral-500">v2.5.0 Production</span>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-neutral-900/70 border border-neutral-800 space-y-8 shadow-2xl">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#fc4778]/10 border border-[#fc4778]/30 text-[#fc4778] font-mono text-xs font-bold">Enterprise Decision Intelligence</span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">Zero-Hallucination RAG</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Transforming generic AI wrappers into verified evidentiary decisions.
              </h3>
              <p className="text-neutral-300 text-base leading-relaxed">
                Standard AI chatbots hallucinate on contract liabilities and financial projections. Synaps is engineered as an evidentiary operating system with mathematical process-outcome verification, 10-agent consensus debates, and line-level cryptographic audit trails.
              </p>
            </div>

            {/* 4 Breakthrough Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-black/50 border border-neutral-800/80 space-y-2">
                <div className="flex items-center gap-2 text-[#fc4778] font-bold text-sm font-mono">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Evidentiary Grounding</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Every summary returns structural coordinates: <code className="text-neutral-200">[Page X, Line Y, SHA-256 Checksum]</code>. Triggers a confidence deficit instead of fabricating facts.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/50 border border-neutral-800/80 space-y-2">
                <div className="flex items-center gap-2 text-[#00f0ff] font-bold text-sm font-mono">
                  <Users className="w-4 h-4" />
                  <span>10-Agent AI Boardroom</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Autonomous C-suite digital twins (CEO, CFO, CTO, Legal Counsel, CRO, CISO) debate and vote on liabilities with 5ms in-memory hot weight-swapping.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/50 border border-neutral-800/80 space-y-2">
                <div className="flex items-center gap-2 text-[#10b981] font-bold text-sm font-mono">
                  <ScanLine className="w-4 h-4" />
                  <span>Dual-Core 1-Shot Lightning OCR</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Sub-2s visual OCR (PP-OCRv4 & Vision VLM) with automated scanned-PDF augmentation, reconstructing markdown tables without manual intervention.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/50 border border-neutral-800/80 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm font-mono">
                  <HardDrive className="w-4 h-4" />
                  <span>Sovereign Desktop & MCP Server</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Compiled into a 155MB Electron installer with local offline failover, plus native Model Context Protocol (MCP) JSON-RPC 2.0 bridge for Claude Desktop & Cursor.
                </p>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-neutral-800">
              <Link 
                href="/" 
                className="text-xs font-mono font-bold text-white hover:text-[#fc4778] flex items-center gap-1.5 transition-colors"
              >
                <span>Visit Live Platform</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-neutral-600">·</span>
              <a 
                href="/api/benchmark-report" 
                target="_blank" 
                className="text-xs font-mono font-bold text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <span>View Stanford HELM PDF Report</span>
                <FileText className="w-3.5 h-3.5" />
              </a>
              <span className="text-neutral-600">·</span>
              <a 
                href="https://github.com/novaecosystems-cloud/Synaps" 
                target="_blank" 
                className="text-xs font-mono font-bold text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <span>GitHub Repository</span>
                <Terminal className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* FUTURE VISION: THE HARDWARE APPLIANCE */}
        <section id="hardware" className="space-y-8">
          <div className="flex items-end justify-between border-b border-neutral-800 pb-4">
            <div>
              <span className="font-mono text-xs text-[#00f0ff] uppercase font-bold tracking-widest">// FUTURE HARDWARE ROADMAP</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">The Synaps Sovereign Node</h2>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] font-bold">
              Appliance in Design
            </span>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#0d1522] to-neutral-900 border border-neutral-800 space-y-8 shadow-2xl">
            <div className="p-8 rounded-2xl bg-black/80 border border-[#00f0ff]/30 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-md">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-ping" />
                  <span className="font-mono text-xs text-[#00f0ff] font-bold uppercase tracking-wider">HARDWARE APPLIANCE CONCEPT</span>
                </div>
                <h3 className="text-3xl font-bold text-white tracking-tight">Synaps BlackBox-1</h3>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  A plug-and-play, physical on-premise micro-server box designed for defense contractors, investment funds, and healthcare systems. Plugs directly into local office LAN with 100% air-gapped physical isolation from the public internet.
                </p>
                <ul className="space-y-1.5 font-mono text-xs text-neutral-400">
                  <li className="flex items-center gap-2">✓ <span className="text-neutral-200">On-Device NPU / Local AI Tensor Accelerator</span></li>
                  <li className="flex items-center gap-2">✓ <span className="text-neutral-200">Encrypted NVMe Hardware RAID Array</span></li>
                  <li className="flex items-center gap-2">✓ <span className="text-neutral-200">Zero Inbound/Outbound Cloud Telemetry</span></li>
                </ul>
              </div>

              {/* Hardware Box Conceptual Visual */}
              <div className="w-56 h-56 rounded-3xl bg-neutral-900 border-2 border-[#00f0ff]/40 flex flex-col items-center justify-center p-6 text-center space-y-3 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff]">
                  <Cpu className="w-8 h-8" />
                </div>
                <div className="font-mono text-xs font-bold text-white">SYNAPS NODE-1</div>
                <div className="text-[10px] font-mono text-[#00f0ff] px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800">
                  AIR-GAPPED COLD VAULT
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1">
                <span className="text-neutral-400 uppercase">Target Sectors:</span>
                <p className="text-neutral-200 font-semibold">Defense, M&A Law, Private Banking</p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1">
                <span className="text-neutral-400 uppercase">Compute Architecture:</span>
                <p className="text-neutral-200 font-semibold">Local INT4 8B Layer-Streaming Engine</p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1">
                <span className="text-neutral-400 uppercase">Security Posture:</span>
                <p className="text-neutral-200 font-semibold">Hardware Kill-Switch & Tamper LED</p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Stack */}
        <section id="stack" className="space-y-8">
          <div className="border-b border-neutral-800 pb-4">
            <span className="font-mono text-xs text-[#10b981] uppercase font-bold tracking-widest">// DISCIPLINES & TOOLING</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">Technical Stack</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#fc4778]/10 text-[#fc4778] flex items-center justify-center font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Full-Stack Architecture</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Next.js 15 App Router, React Server Components, TypeScript, Tailwind CSS, Prisma ORM, Neon PostgreSQL.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 text-[#00f0ff] flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">AI & Systems Design</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                RAG coordinate indexing, Stanford HELM benchmark suites, Model Context Protocol (MCP), multi-agent debate loops.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 text-[#10b981] flex items-center justify-center font-bold">
                <Boxes className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Product & Distribution</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Electron desktop packaging, NSIS Windows installer compilation, Gumroad merchant integration, responsive UX.
              </p>
            </div>
          </div>
        </section>

        {/* Footer & Contact */}
        <footer className="pt-8 border-t border-neutral-800 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-xl font-bold text-white">Shourya</h4>
              <p className="text-xs text-neutral-400 font-mono mt-1">Founder & AI Product Architect · Synaps Intelligence</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a 
                href="https://github.com/novaecosystems-cloud" 
                target="_blank" 
                className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white font-mono text-xs font-bold flex items-center gap-2 transition-all"
              >
                <Terminal className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <Link 
                href="/" 
                className="px-4 py-2.5 rounded-xl bg-white text-black font-mono text-xs font-bold flex items-center gap-2 hover:bg-[#fc4778] hover:text-white transition-all shadow-md"
              >
                <Globe className="w-4 h-4" />
                <span>Synaps Platform</span>
              </Link>
            </div>
          </div>

          <div className="text-xs font-mono text-neutral-500 flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-neutral-900 gap-2">
            <span>© 2026 SHOURYA. ALL RIGHTS RESERVED.</span>
            <span>LIVE ON SYNAPS SOVEREIGN CLOUD</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
