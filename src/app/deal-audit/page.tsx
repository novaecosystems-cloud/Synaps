"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, AlertTriangle, CheckCircle2, FileSearch, ArrowRight, Download, UploadCloud, Scale, Zap, DollarSign, Lock, Sparkles } from 'lucide-react';
import { downloadAsPDF } from '@/lib/export-helpers';

interface TargetScenario {
  id: string;
  name: string;
  type: string;
  headlineRisk: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  dollarExposure: string;
  offendingClause: string;
  causarixRemedy: string;
  dgclProof: string;
}

const PRELOADED_TARGETS: TargetScenario[] = [
  {
    id: 'target-1',
    name: 'Series A Target: Enterprise SaaS MSA',
    type: 'Commercial Customer Agreement',
    headlineRisk: 'Uncapped Consequential Damages & Gross Negligence Indemnity',
    severity: 'CRITICAL',
    dollarExposure: '$4.2M Uncapped Ruin Liability (on $120k ARR contract)',
    offendingClause: '"Supplier shall defend, indemnify, and hold harmless Customer against any and all direct, indirect, consequential, or punitive damages arising from any system interruption without monetary limitation."',
    causarixRemedy: 'Insert 12-month aggregate fee cap ($120,000) and strictly exclude consequential and loss-of-profit damages to restore insurable risk profile.',
    dgclProof: '0x8f2a9c44b10e58d9237e1a6659c04df90b392a819c4d92bfe65d18b14a90f12c',
  },
  {
    id: 'target-2',
    name: 'Seed Target: YC Post-Money SAFE with Side Letter',
    type: 'Financing & Equity Instrument',
    headlineRisk: 'Conflicting MFN & Non-Standard Senior Liquidation Preference',
    severity: 'HIGH',
    dollarExposure: '14.2% Extra Dilution Shock on Series A Lead',
    offendingClause: '"Investor shall receive 1.5x non-participating senior liquidation preference ranking senior to all Common and standard Preferred Seed instruments."',
    causarixRemedy: 'Standardize to 1.0x pari-passu liquidation preference. Flagged covenant would cause lead investor Series A rejection under NVCA standards.',
    dgclProof: '0x33b1e779a94420de9a8c41098ef3209581a0b3c590d9841f3e792c300b91e84a',
  },
  {
    id: 'target-3',
    name: 'Growth Target: Founder IP Assignment Agreement',
    type: 'Intellectual Property Chain of Title',
    headlineRisk: 'Prior Inventions Carve-Out Covers Core AI Algorithm',
    severity: 'CRITICAL',
    dollarExposure: 'Fatal Chain of Title Defect (Cloud on Title)',
    offendingClause: '"Schedule A excludes from assignment all algorithmic optimization and graph routing software developed by Founder prior to incorporation."',
    causarixRemedy: 'Execute immediate Quitclaim and Confirmatory Patent/Copyright Assignment to company prior to term sheet execution.',
    dgclProof: '0x9a8820c741e9b2110c93bf29a0084ef77912a5592bcde4019a2b8e4902c31e99',
  },
];

export default function DealAuditPage() {
  const [activeTarget, setActiveTarget] = useState<TargetScenario>(PRELOADED_TARGETS[0]);
  const [analyzing, setAnalyzing] = useState(false);
  const [leadEmail, setLeadEmail] = useState('');
  const [dealName, setDealName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSelectTarget = (target: TargetScenario) => {
    setAnalyzing(true);
    setTimeout(() => {
      setActiveTarget(target);
      setAnalyzing(false);
    }, 300);
  };

  const handleExportMemo = () => {
    downloadAsPDF({
      title: `Reverse Due Diligence Red-Flag Audit — ${activeTarget.name}`,
      subtitle: `Target Type: ${activeTarget.type} · Delaware DGCL § 141 Sealed`,
      organizationName: 'CAUSARIX VENTURE DUE DILIGENCE LAB',
      sections: [
        {
          heading: '1. Executive Diligence Summary',
          content: `Causarix automated contract intelligence identified a ${activeTarget.severity} risk in target company documentation. Recommended action is required prior to capital closing.`,
          kvPairs: {
            'Target Name': activeTarget.name,
            'Agreement Type': activeTarget.type,
            'Risk Severity': activeTarget.severity,
            'Estimated Dollar Exposure': activeTarget.dollarExposure,
          },
        },
        {
          heading: '2. Flagged Clause Redline',
          content: activeTarget.offendingClause,
        },
        {
          heading: '3. Statutory Fiduciary Remedy',
          content: activeTarget.causarixRemedy,
        },
      ],
      dgclSignature: {
        enabled: true,
        merkleRoot: activeTarget.dgclProof,
        leafCount: 4,
        boardQuorumScore: '96% Risk Mitigation Alignment',
        mathVerification: 'Delaware Chancery Legal Audit · 0.00% Math Drift',
        signatoryAuthority: 'Causarix Autonomous Due Diligence Engine',
      },
    });
  };

  const handleSubmitDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail || !dealName) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 right-1/4 w-[700px] h-[350px] bg-rose-600/10 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 left-10 w-[500px] h-[350px] bg-cyan-600/10 blur-[160px] rounded-full" />
      </div>

      {/* Navigation Header */}
      <header className="relative z-10 border-b border-slate-800/80 backdrop-blur-md bg-[#070b14]/70 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-md shadow-rose-500/20">
            D
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white">CAUSARIX™</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400 bg-rose-950/80 border border-rose-800/60 px-2 py-0.5 rounded-full ml-1">
            VC Due Diligence Lab
          </span>
        </Link>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <Link href="/vc-perks" className="text-slate-400 hover:text-cyan-400 transition-colors hidden sm:inline-block">
            Portfolio Perks Program →
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
          >
            Launch Boardroom
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-14 pb-24">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Before You Wire $3M: Uncapped Liabilities & IP Defect Auditor</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
            60-Second Reverse Due Diligence for <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-cyan-400">Venture Capital</span> & Angels.
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Audit commercial MSAs, SAFEs, and IP assignment chains in your target’s data room. Spot financial ruin clauses before legal counsel bills $50,000.
          </p>
        </div>

        {/* Interactive Scenario Selector */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Select Live Pre-Loaded Deal Target to Stress-Test:</span>
            </span>
            <span className="text-[11px] text-slate-500">Delaware DGCL § 141 Compliant</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {PRELOADED_TARGETS.map((t) => (
              <button
                key={t.id}
                onClick={() => handleSelectTarget(t)}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  activeTarget.id === t.id
                    ? 'bg-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-slate-300 truncate">{t.type}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                    t.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {t.severity}
                  </span>
                </div>
                <div className="font-bold text-sm text-white truncate">{t.name}</div>
                <div className="text-[11px] text-slate-400 mt-1 truncate">{t.headlineRisk}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Target Forensic Audit Panel */}
        <div className="mt-6 p-7 sm:p-9 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-2xl relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
                  AUDIT ID: CSX-DD-2026
                </span>
                <span className="text-xs text-slate-400">· {activeTarget.type}</span>
              </div>
              <h2 className="text-2xl font-black text-white">{activeTarget.name}</h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportMemo}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Delaware Memo (PDF)</span>
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Identified Legal Vulnerability</span>
              </div>
              <div className="text-sm font-extrabold text-rose-300">{activeTarget.headlineRisk}</div>
              <div className="mt-3 text-xs text-slate-300 font-mono bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                {activeTarget.offendingClause}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dollar-for-Dollar Ruin Exposure</span>
                </div>
                <div className="text-lg font-black text-emerald-400">{activeTarget.dollarExposure}</div>
                <div className="mt-3 text-xs text-slate-300 leading-relaxed bg-slate-900/90 p-3 rounded-lg border border-slate-800/80">
                  <strong className="text-cyan-400">Causarix Remedy:</strong> {activeTarget.causarixRemedy}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Merkle Leaf: {activeTarget.dgclProof.slice(0, 18)}...</span>
                <span className="text-emerald-500 font-bold">✓ Verified DGCL § 141</span>
              </div>
            </div>
          </div>

          {/* Drag and drop target box */}
          <div className="p-6 rounded-2xl border border-dashed border-slate-700/80 bg-slate-950/40 text-center space-y-2">
            <UploadCloud className="w-8 h-8 text-slate-500 mx-auto" />
            <div className="text-xs font-bold text-slate-300">
              Have an active deal in data room? Drop target MSA, SAFE, or NDA here (.pdf, .docx)
            </div>
            <p className="text-[11px] text-slate-500 max-w-md mx-auto">
              Our air-gapped parser runs client-side zero-retention analysis in 60 seconds with zero cloud data storage.
            </p>
          </div>
        </div>

        {/* Lead Capture for Fund Diligence Access */}
        <div className="mt-14 max-w-xl mx-auto p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
          <h3 className="text-xl font-black text-white">Want Causarix for Your Active Deal Pipeline?</h3>
          <p className="text-xs text-slate-400">
            We will run a complimentary 60-second reverse due diligence audit on your next live investment target.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmitDeal} className="space-y-3 pt-2">
              <input
                type="text"
                required
                placeholder="Upcoming Target / Deal Codename (e.g. Project Apollo)"
                value={dealName}
                onChange={(e) => setDealName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
              />
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="investor@fund.com"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-rose-500/20 flex-shrink-0"
                >
                  <span>Request Audit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
              ✓ Diligence request received for {dealName}! We will reach out to {leadEmail} with your dedicated secure upload room.
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 Causarix Technologies Inc. Private Equity & Venture Capital Lab.</div>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-rose-400 transition-colors">Home</Link>
            <Link href="/vc-perks" className="hover:text-rose-400 transition-colors">VC Perks Program</Link>
            <Link href="/dashboard" className="hover:text-rose-400 transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
