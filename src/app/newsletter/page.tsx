import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, Building2, Cpu, ArrowUpRight } from 'lucide-react';
import { getNewsletterMetadata } from '@/lib/openseo';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';

export const metadata: Metadata = getNewsletterMetadata();

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black antialiased relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[25%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px]" />
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 py-16 space-y-16">
        
        {/* Navigation Bar */}
        <header className="flex items-center justify-between border-b border-slate-800/80 pb-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 font-mono font-extrabold text-base flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              ◈
            </div>
            <div>
              <span className="font-mono font-bold text-sm text-white tracking-wider">CAUSARIX™</span>
              <span className="text-[11px] text-cyan-400 block font-mono">Executive Research Dispatch</span>
            </div>
          </Link>

          <nav className="flex items-center gap-4 text-xs font-mono">
            <Link href="/dashboard/boardroom" className="text-slate-400 hover:text-white transition-colors hidden sm:inline">
              BOARDROOM QUORUM
            </Link>
            <Link href="/dashboard/simulations" className="text-slate-400 hover:text-cyan-400 transition-colors hidden sm:inline">
              SCM SIMULATIONS
            </Link>
            <Link
              href="/"
              className="px-4 py-2 rounded-full bg-cyan-500/10 hover:bg-cyan-500 hover:text-black text-cyan-400 font-bold transition-all border border-cyan-500/30 flex items-center gap-1"
            >
              <span>Platform</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="space-y-6 pt-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>INSTITUTIONAL CAUSAL RESEARCH DISPATCH</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            Executive Briefings on Causal AI, Delaware DGCL § 141 & SCM Governance.
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            10-Agent Boardroom Quorum • Delaware DGCL § 141 Safe-Harbor Records • 0.00% Math Drift.
            Receive bi-weekly technical memos on structural causal modeling and corporate fiduciary defense.
          </p>

          {/* Subscription Box */}
          <div className="pt-4 max-w-lg mx-auto">
            <NewsletterForm />
            <p className="text-[11px] font-mono text-slate-500 mt-2 flex items-center justify-center gap-2">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Zero-Telemetry Guarantee • Strictly Institutional Distribution • One-Click Unsubscribe</span>
            </p>
          </div>
        </section>

        {/* 3 Core Editorial Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-cyan-500/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Delaware Safe-Harbor Precedents</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deep dives into Delaware DGCL § 141(e) fiduciary reliance defenses, SHA-256 Merkle tree verification, and board room audit logs.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/70 border border-emerald-500/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Structural Causal Modeling (SCM)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mathematical derivations of Pearl&apos;s do-calculus, Box-Muller Gaussian normal sampling, and 0.00% math drift verification across 10,000 runs.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/70 border border-indigo-500/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Autonomous Boardroom Dialectics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empirical case studies simulating 10-Agent AI boardroom debates on enterprise M&A due diligence, liquidity stress, and supplier shocks.
            </p>
          </div>
        </section>

        {/* Featured Research Dispatches */}
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="font-mono text-xs text-cyan-400 uppercase font-bold tracking-widest">// RECENT PAPERS</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">Archived Research Dispatches</h2>
            </div>
            <span className="text-xs font-mono text-slate-500">Peer-Reviewed Memos</span>
          </div>

          <div className="space-y-4">
            {/* Paper 1 */}
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 group">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold">MEMO #084 — DGCL JURISPRUDENCE</span>
                <span className="text-slate-500">AUGUST 2026</span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                Establishing Cryptographic Reliance Under Delaware General Corporation Law § 141(e)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                An analysis of board director liability protections when relying on autonomous multi-agent consensus protocols backed by line-level SHA-256 Merkle root verification.
              </p>
              <div className="flex items-center gap-3 pt-2 text-xs font-mono text-cyan-400">
                <span>Read Research Paper →</span>
              </div>
            </div>

            {/* Paper 2 */}
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3 group">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold">MEMO #083 — QUANTITATIVE SCM</span>
                <span className="text-slate-500">JULY 2026</span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                Eliminating Arithmetic Drift in High-Dimensional Monte Carlo Drift-Diffusion Sandboxes
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Benchmark evaluation of Box-Muller Gaussian normal transformation across 10,000 counterfactual iterations with 0.00% precision drift in multi-department enterprise systems.
              </p>
              <div className="flex items-center gap-3 pt-2 text-xs font-mono text-emerald-400">
                <span>Read Research Paper →</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <span>© 2026 CAUSARIX INC. (A SYNAPS INTELLIGENCE COMPANY).</span>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/" className="hover:text-white">Platform</Link>
            <Link href="/dashboard/boardroom" className="hover:text-white">Boardroom</Link>
            <Link href="/dashboard/simulations" className="hover:text-white">Simulations</Link>
          </div>
        </footer>

      </div>
    </div>
  );
}
