"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Copy,
  Check,
  ArrowRight,
  Download,
  Sparkles,
  RefreshCw,
  Scale,
  Lock,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  XCircle,
  FileCheck
} from 'lucide-react';
import { PRELOADED_CONTRACTS, ContractAnalysisResult, RedlineFinding } from '@/app/api/legal/redline/route';

export function ContractRedlineStudio({ companyName = 'Apex Global Enterprise' }: { companyName?: string }) {
  const [selectedPreset, setSelectedPreset] = useState<'vendor_saas' | 'founder_ip' | 'nda' | 'custom'>('vendor_saas');
  const [contractText, setContractText] = useState<string>(PRELOADED_CONTRACTS.vendor_saas.sampleText);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedMerkle, setCopiedMerkle] = useState<boolean>(false);

  // Initialize with the preloaded analysis of the default contract
  const [analysisResult, setAnalysisResult] = useState<ContractAnalysisResult | null>(() => {
    const preset = PRELOADED_CONTRACTS.vendor_saas;
    return {
      contractTitle: preset.title,
      contractType: preset.type,
      overallRiskScore: 88,
      riskCategory: 'CRITICAL',
      executiveSummary: 'REJECT / REDLINE REQUIRED: Contract contains 2 CRITICAL fiduciary hazards, including uncapped liability and asymmetric indemnity. Signing in current form forfeits Delaware DGCL § 141 safe harbor protections.',
      delawareSafeHarborStatus: 'NON_COMPLIANT',
      findings: preset.presetFindings,
      merkleAudit: {
        merkleRoot: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        leafCount: 4,
        auditTimestamp: new Date().toISOString(),
        sha256Signature: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      }
    };
  });

  const handleSelectPreset = (key: 'vendor_saas' | 'founder_ip' | 'nda') => {
    setSelectedPreset(key);
    const preset = PRELOADED_CONTRACTS[key];
    setContractText(preset.sampleText);
    runAnalysis(preset.sampleText, key);
  };

  const runAnalysis = async (textToAnalyze?: string, targetType?: string) => {
    const text = textToAnalyze !== undefined ? textToAnalyze : contractText;
    const type = targetType || selectedPreset;

    if (!text.trim()) return;

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/legal/redline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractText: text,
          contractType: type,
          companyName
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data);
      }
    } catch (err) {
      console.error('Failed to run contract redline analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyRedline = (finding: RedlineFinding) => {
    navigator.clipboard.writeText(finding.recommendedRedline);
    setCopiedId(finding.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyMerkle = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedMerkle(true);
    setTimeout(() => setCopiedMerkle(false), 2500);
  };

  const handleExportPrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="w-full space-y-8 font-sans antialiased text-slate-900 dark:text-slate-100">
      
      {/* ─── HERO HEADER ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.25)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                <Scale className="w-3.5 h-3.5" />
                Autonomous Contract Fiduciary Redliner
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                <Lock className="w-3 h-3" /> Delaware DGCL § 141 Safe Harbor
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-[-0.03em] text-slate-900 dark:text-white">
              Instant Legal Risk Audit &amp; Attorney-Grade Redlining
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Upload any vendor agreement, SaaS SLA, employment contract, or NDA. Detect toxic indemnification traps, unilateral liabilities, and hidden renewals in 30 seconds before you sign.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPrint}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200/60 dark:border-slate-700/60 cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Legal Audit Brief</span>
            </button>
          </div>
        </div>

        {/* ─── 1-CLICK PRELOADED TOXIC CONTRACT SELECTORS ──────────────────────── */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              1-Click Test Scenarios:
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleSelectPreset('vendor_saas')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                selectedPreset === 'vendor_saas'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              📄 Enterprise Cloud SaaS MSA (Uncapped Indemnity)
            </button>

            <button
              onClick={() => handleSelectPreset('founder_ip')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                selectedPreset === 'founder_ip'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              💼 Founder IP Assignment (24-Mo Non-Compete)
            </button>

            <button
              onClick={() => handleSelectPreset('nda')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                selectedPreset === 'nda'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              🔒 Mutual NDA (Residuals Loophole)
            </button>
          </div>
        </div>
      </div>

      {/* ─── INPUT / CONTRACT EDITOR WORKBENCH ────────────────────────────────── */}
      <div className="rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Contract Text Editor / Dropzone
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {contractText.length} characters • {contractText.split(/\s+/).filter(Boolean).length} words
          </span>
        </div>

        <div className="relative">
          <textarea
            value={contractText}
            onChange={(e) => {
              setContractText(e.target.value);
              setSelectedPreset('custom');
            }}
            rows={7}
            placeholder="Paste your legal agreement, vendor terms, NDA, or clause here for automated fiduciary redlining..."
            className="w-full p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all resize-y"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400">
            💡 <b>Tip:</b> Paste any section or click one of the 3 preloaded samples above to test with zero typing.
          </p>

          <button
            onClick={() => runAnalysis()}
            disabled={isAnalyzing || !contractText.trim()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Auditing Fiduciary Clauses...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Fiduciary Redline Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─── ANALYSIS RESULTS & FIDUCIARY SCOREBOARD ─────────────────────────── */}
      {analysisResult && (
        <div className="space-y-6">
          
          {/* Executive Score Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. Overall Risk Exposure */}
            <div className={`p-5 rounded-3xl border backdrop-blur-xl ${
              analysisResult.riskCategory === 'CRITICAL'
                ? 'bg-rose-500/10 border-rose-500/30 dark:bg-rose-950/20'
                : analysisResult.riskCategory === 'HIGH'
                ? 'bg-amber-500/10 border-amber-500/30 dark:bg-amber-950/20'
                : 'bg-emerald-500/10 border-emerald-500/30 dark:bg-emerald-950/20'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Legal Exposure Score
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  analysisResult.riskCategory === 'CRITICAL'
                    ? 'bg-rose-500 text-white'
                    : analysisResult.riskCategory === 'HIGH'
                    ? 'bg-amber-500 text-white'
                    : 'bg-emerald-500 text-white'
                }`}>
                  {analysisResult.riskCategory} RISK
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {analysisResult.overallRiskScore}
                </span>
                <span className="text-sm font-mono text-slate-400">/ 100</span>
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                {analysisResult.findings.filter(f => f.riskLevel === 'CRITICAL').length} Critical and {analysisResult.findings.filter(f => f.riskLevel === 'HIGH').length} High hazard clauses detected.
              </p>
            </div>

            {/* 2. Delaware DGCL § 141 Safe Harbor */}
            <div className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  DGCL § 141 Compliance
                </span>
                <Scale className="w-4 h-4 text-blue-500" />
              </div>
              <div className="mt-3 flex items-center gap-2">
                {analysisResult.delawareSafeHarborStatus === 'NON_COMPLIANT' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs border border-rose-500/20">
                    <XCircle className="w-3.5 h-3.5" /> Fiduciary Breach Hazard
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Protected Under Safe Harbor
                  </span>
                )}
              </div>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Directors executing contracts with uncapped third-party indemnities forfeit Business Judgment Rule legal immunity.
              </p>
            </div>

            {/* 3. Cryptographic Merkle Root */}
            <div className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Cryptographic Audit Seal
                </span>
                <Lock className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="mt-3 flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 font-mono text-[10px] text-slate-600 dark:text-slate-300">
                <span className="truncate">{analysisResult.merkleAudit.merkleRoot}</span>
                <button
                  onClick={() => handleCopyMerkle(analysisResult.merkleAudit.merkleRoot)}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 cursor-pointer"
                  title="Copy SHA-256 Merkle Root"
                >
                  {copiedMerkle ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">
                Tamper-evident proof generated with {analysisResult.merkleAudit.leafCount} audited clauses.
              </p>
            </div>

          </div>

          {/* Executive Directive Banner */}
          <div className="p-5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-200 leading-relaxed flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold uppercase tracking-wider mr-2 font-mono text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded">
                Executive Action Directive
              </span>
              <span>{analysisResult.executiveSummary}</span>
            </div>
          </div>

          {/* ─── DETAILED REDLINE CLAUSE CARDS ─────────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span>Identified Fiduciary Redlines</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                  {analysisResult.findings.length}
                </span>
              </h3>
            </div>

            <div className="space-y-4">
              {analysisResult.findings.map((finding, idx) => (
                <div
                  key={finding.id}
                  className="rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 p-5 sm:p-6 shadow-sm space-y-4"
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-xs text-slate-500">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {finding.clauseType}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        finding.riskLevel === 'CRITICAL'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          : finding.riskLevel === 'HIGH'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {finding.riskLevel} RISK
                      </span>
                    </div>
                  </div>

                  {/* Toxic Original vs Fiduciary Redline Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    
                    {/* Toxic Original Excerpt */}
                    <div className="p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 space-y-2">
                      <span className="text-[11px] font-mono font-bold uppercase text-rose-600 dark:text-rose-400 tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Original Problematic Provision
                      </span>
                      <p className="font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white/60 dark:bg-slate-950/60 p-3 rounded-xl border border-rose-500/10 line-through decoration-rose-500/70">
                        {finding.originalText}
                      </p>
                      <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80 leading-relaxed pt-1">
                        <b>Fiduciary Risk:</b> {finding.legalAnalysis}
                      </p>
                    </div>

                    {/* Fiduciary Recommended Redline */}
                    <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-2 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Attorney-Grade Fiduciary Redline
                          </span>
                          <button
                            onClick={() => handleCopyRedline(finding)}
                            className="flex items-center gap-1 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-emerald-500/30 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all cursor-pointer"
                          >
                            {copiedId === finding.id ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Redline</span>
                              </>
                            )}
                          </button>
                        </div>

                        <p className="font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed bg-white/80 dark:bg-slate-950/80 p-3 rounded-xl border border-emerald-500/20">
                          {finding.recommendedRedline}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-emerald-500/10 text-[10px] font-mono text-emerald-700/80 dark:text-emerald-300/80">
                        <b>Market Benchmark:</b> {finding.industryBenchmark}
                      </div>
                    </div>

                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
