"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, TrendingUp, FileText, CheckCircle2, ArrowRight, Building, Sparkles, Copy, Check, Users, Scale, Zap } from 'lucide-react';
import FreeTierPrintWatermark from '@/components/FreeTierPrintWatermark';

export default function VCPerksPage() {
  const [fundName, setFundName] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [portfolioCount, setPortfolioCount] = useState('25-50');
  const [claimed, setClaimed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('US');

  const customPerkUrl = fundName 
    ? `https://causarix.vercel.app/register?partner=${encodeURIComponent(fundName.toLowerCase().replace(/[^a-z0-9]/g, ''))}`
    : 'https://causarix.vercel.app/register?partner=yourfund';

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fundName || !partnerEmail) return;
    setClaimed(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(customPerkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-600/10 blur-[140px] rounded-full" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[350px] bg-indigo-600/10 blur-[160px] rounded-full" />
      </div>

      {/* Navigation Header */}
      <header className="relative z-10 border-b border-slate-800/80 backdrop-blur-md bg-[#070b14]/70 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-black text-black text-sm shadow-md shadow-cyan-500/20">
            C
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white">CAUSARIX™</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 rounded-full ml-1">
            VC Platform Partner
          </span>
        </Link>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <Link href="/deal-audit" className="text-slate-400 hover:text-cyan-400 transition-colors hidden sm:inline-block">
            Reverse Deal Diligence →
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
          >
            Launch Boardroom
          </Link>
        </div>
      </header>

      {/* Main Hero */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zero Cost to Your Fund · Institutional Founder Perk</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Protect Your Portfolio From <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">Boardroom Blindspots</span> & Runway Ruin.
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Equip your portfolio founders with Delaware DGCL § 141 safe-harbor protection, 10-Agent C-suite stress-testing, and contract liability redlining before their next board meeting.
          </p>
        </div>

        {/* 3 Core Value Pillars for VC Platform Teams */}
        <div className="grid sm:grid-cols-3 gap-5 mt-14">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-sm relative overflow-hidden group hover:border-cyan-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 mb-4">
              <Scale className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white mb-2">Delaware § 141 Safe Harbor</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Provides directors and founders with statutory fiduciary defense by anchoring strategic votes to cryptographic SHA-256 Merkle proofs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-sm relative overflow-hidden group hover:border-sky-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-sky-950/80 border border-sky-800/60 flex items-center justify-center text-sky-400 mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white mb-2">0.00% Math Drift SCM Kernel</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Box-Muller C++ kernel runs 10,000 Monte Carlo draws on cash runway, simulating supplier defaults, capex blowouts, and churn shocks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-sm relative overflow-hidden group hover:border-blue-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400 mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white mb-2">Uncapped Liability Audits</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scans enterprise sales MSAs and vendor contracts to flag catastrophic uncapped indemnification clauses before founders sign them.
            </p>
          </div>
        </div>

        {/* Claim Perk Activation Card */}
        <div className="mt-12 p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          {!claimed ? (
            <form onSubmit={handleClaim} className="space-y-6 max-w-xl mx-auto">
              <div className="text-center space-y-1 mb-6">
                <h3 className="text-2xl font-black text-white">Generate Your Fund's Portfolio Perk Link</h3>
                <p className="text-xs text-slate-400">
                  Instantly provides 6 months of complimentary Causarix Enterprise access to all your active portfolio companies.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  VC Fund / Accelerator Name
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sequoia Capital, Y Combinator, Techstars"
                    value={fundName}
                    onChange={(e) => setFundName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Partner / Platform Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="platform@yourfund.com"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Portfolio Size
                  </label>
                  <select
                    value={portfolioCount}
                    onChange={(e) => setPortfolioCount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="1-20">1 - 20 Companies</option>
                    <option value="25-50">25 - 50 Companies</option>
                    <option value="50-150">50 - 150 Companies</option>
                    <option value="150+">150+ Companies</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Primary Jurisdiction Focus
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['US', 'UK', 'EU', 'India'].map((jur) => (
                    <button
                      key={jur}
                      type="button"
                      onClick={() => setSelectedJurisdiction(jur)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        selectedJurisdiction === jur
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {jur}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
              >
                <span>Activate Portfolio Perk Access</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-slate-500 text-center">
                Strict Zero Data Retention SLA · No credit card required · Instant rollout.
              </p>
            </form>
          ) : (
            <div className="text-center space-y-6 max-w-xl mx-auto py-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">Portfolio Perks Live for {fundName}!</h3>
                <p className="text-xs text-slate-400">
                  Share this private onboarding link with your portfolio founders or add it directly to your Notion/Airtable portfolio perks catalog.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-left">
                <code className="text-xs font-mono text-cyan-400 truncate">{customPerkUrl}</code>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all flex-shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <div className="text-xs text-slate-400 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-left space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>What your founders receive automatically:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>6 months complimentary access to the 10-Agent Boardroom Quorum.</li>
                  <li>Unlimited automated contract audits (MSAs, NDAs, SAFEs).</li>
                  <li>Delaware DGCL § 141 cryptographic Merkle certification exports.</li>
                </ul>
              </div>

              <button
                onClick={() => setClaimed(false)}
                className="text-xs text-slate-500 hover:text-slate-300 underline"
              >
                Configure another fund or update details
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Free Tier Watermark at footer for non-paid views */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 Causarix Technologies Inc. Delaware Chancery Venue.</div>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <Link href="/deal-audit" className="hover:text-cyan-400 transition-colors">Reverse Due Diligence</Link>
            <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
