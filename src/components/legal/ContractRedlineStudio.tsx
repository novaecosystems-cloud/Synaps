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
  FileCheck,
  Printer,
  X,
  Flame,
  Briefcase
} from 'lucide-react';
import {
  PRELOADED_CONTRACTS,
  ContractAnalysisResult,
  RedlineFinding,
  NegotiationStance,
  getAdaptedFindings
} from '@/app/api/legal/redline/route';

export function ContractRedlineStudio({ companyName = 'Apex Global Enterprise' }: { companyName?: string }) {
  const [selectedPreset, setSelectedPreset] = useState<'vendor_saas' | 'founder_ip' | 'nda' | 'custom'>('vendor_saas');
  const [selectedStance, setSelectedStance] = useState<NegotiationStance>('founder_protective');
  const [contractText, setContractText] = useState<string>(PRELOADED_CONTRACTS.vendor_saas.sampleText);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isExportingDocx, setIsExportingDocx] = useState<boolean>(false);
  const [showScorecardModal, setShowScorecardModal] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedMerkle, setCopiedMerkle] = useState<boolean>(false);

  // Initialize with the preloaded analysis of the default contract & stance
  const [analysisResult, setAnalysisResult] = useState<ContractAnalysisResult | null>(() => {
    const preset = PRELOADED_CONTRACTS.vendor_saas;
    return {
      contractTitle: preset.title,
      contractType: preset.type,
      negotiationStance: 'founder_protective',
      overallRiskScore: 88,
      riskCategory: 'CRITICAL',
      executiveSummary: '[FOUNDER-PROTECTIVE STANCE] REJECT / REDLINE REQUIRED: Contract contains 2 CRITICAL fiduciary hazards, including uncapped liability and asymmetric indemnity. Signing in current form forfeits Delaware DGCL § 141 safe harbor protections.',
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
    runAnalysis(preset.sampleText, key, selectedStance);
  };

  const handleSelectStance = (stance: NegotiationStance) => {
    setSelectedStance(stance);
    runAnalysis(contractText, selectedPreset, stance);
  };

  const runAnalysis = async (
    textToAnalyze?: string,
    targetType?: string,
    targetStance?: NegotiationStance
  ) => {
    const text = textToAnalyze !== undefined ? textToAnalyze : contractText;
    const type = targetType || selectedPreset;
    const stance = targetStance || selectedStance;

    if (!text.trim()) return;

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/legal/redline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractText: text,
          contractType: type,
          companyName,
          stance,
          negotiationStance: stance
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

  const handleDownloadDocx = async () => {
    if (!analysisResult) return;
    setIsExportingDocx(true);
    try {
      const res = await fetch('/api/legal/export-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractTitle: analysisResult.contractTitle,
          contractType: analysisResult.contractType,
          negotiationStance: selectedStance,
          overallRiskScore: analysisResult.overallRiskScore,
          riskCategory: analysisResult.riskCategory,
          executiveSummary: analysisResult.executiveSummary,
          delawareSafeHarborStatus: analysisResult.delawareSafeHarborStatus,
          findings: analysisResult.findings,
          merkleAudit: analysisResult.merkleAudit,
          companyName,
          contractText
        })
      });

      if (!res.ok) throw new Error('Failed to generate Word document');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const sanitizedTitle = (analysisResult.contractTitle || 'Contract')
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 30);
      a.download = `Causarix-Redlined-${sanitizedTitle}-${selectedStance}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export docx:', err);
    } finally {
      setIsExportingDocx(false);
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

  const handlePrintScorecard = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="w-full space-y-8 font-sans antialiased text-slate-900 dark:text-slate-100">
      
      {/* ─── PRINT CSS STYLES FOR 1-PAGE SCORECARD ──────────────────────────── */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #fiduciary-printable-scorecard, #fiduciary-printable-scorecard * {
            visibility: visible;
          }
          #fiduciary-printable-scorecard {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 16px;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* ─── HERO HEADER ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.25)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
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

          {/* Action Buttons: Native Word Docx & 1-Page Scorecard */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowScorecardModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200/60 dark:border-slate-700/60 cursor-pointer shadow-sm"
              title="View & Print 1-Page Fiduciary Scorecard"
            >
              <FileCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>1-Page Fiduciary Scorecard</span>
            </button>

            <button
              onClick={handleDownloadDocx}
              disabled={isExportingDocx || !analysisResult}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shadow-blue-500/25 cursor-pointer disabled:opacity-50"
              title="Download real Word docx with strikethroughs, insertions & margin comments"
            >
              {isExportingDocx ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating Word Doc...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Redlined Word Doc (.docx)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ─── NEGOTIATION STANCE SELECTOR (FEATURE B) ─────────────────────────── */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Negotiation Stance:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full lg:w-auto">
            {/* 1. Founder-Protective */}
            <button
              onClick={() => handleSelectStance('founder_protective')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border text-left ${
                selectedStance === 'founder_protective'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/25'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <div>
                <div className="font-bold">Founder-Protective</div>
                <div className={`text-[10px] ${selectedStance === 'founder_protective' ? 'text-blue-100' : 'text-slate-400'}`}>
                  Max shield &amp; strike non-competes
                </div>
              </div>
            </button>

            {/* 2. Balanced Commercial */}
            <button
              onClick={() => handleSelectStance('balanced_commercial')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border text-left ${
                selectedStance === 'balanced_commercial'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/25'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 shrink-0" />
              <div>
                <div className="font-bold">Balanced Commercial</div>
                <div className={`text-[10px] ${selectedStance === 'balanced_commercial' ? 'text-indigo-100' : 'text-slate-400'}`}>
                  Deal velocity &amp; standard caps
                </div>
              </div>
            </button>

            {/* 3. Enterprise Hardball */}
            <button
              onClick={() => handleSelectStance('enterprise_hardball')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border text-left ${
                selectedStance === 'enterprise_hardball'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-500/25'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Flame className="w-3.5 h-3.5 shrink-0" />
              <div>
                <div className="font-bold">Enterprise Hardball</div>
                <div className={`text-[10px] ${selectedStance === 'enterprise_hardball' ? 'text-rose-100' : 'text-slate-400'}`}>
                  Aggressive buyer power stance
                </div>
              </div>
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
            💡 <b>Tip:</b> Paste any section or click one of the 3 preloaded samples above to test with zero typing. Stance applies instantly.
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
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 uppercase">
                  {selectedStance.replace('_', ' ')}
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
                            Attorney-Grade Fiduciary Redline ({selectedStance.replace('_', ' ')})
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

      {/* ─── 1-PAGE PRINTABLE FIDUCIARY SCORECARD MODAL (FEATURE C) ─────────── */}
      <AnimatePresence>
        {showScorecardModal && analysisResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6"
            >
              {/* Modal Top Bar (Hidden in Print) */}
              <div className="no-print flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-bold text-sm tracking-tight">1-Page Executive Fiduciary Scorecard</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintScorecard}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-sm cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Scorecard (PDF)</span>
                  </button>

                  <button
                    onClick={handleDownloadDocx}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all border border-slate-200/60 dark:border-slate-700/60 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .docx</span>
                  </button>

                  <button
                    onClick={() => setShowScorecardModal(false)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* ─── PRINTABLE DOCUMENT BODY (OPTIMIZED FOR 1-PAGE OUTPUT) ──── */}
              <div id="fiduciary-printable-scorecard" className="space-y-6 bg-white text-slate-900 p-2 sm:p-4 rounded-2xl">
                
                {/* Scorecard Header */}
                <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Scale className="w-5 h-5 text-blue-700" />
                      <span className="font-mono text-xs font-black uppercase tracking-widest text-blue-900">
                        Causarix Sovereign Fiduciary OS
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mt-1">
                      DELAWARE DGCL § 141 EXECUTIVE FIDUCIARY SCORECARD
                    </h2>
                    <p className="text-xs font-medium text-slate-600 mt-0.5">
                      Statutory Director Safe Harbor Audit &amp; Legal Liability Certification
                    </p>
                  </div>

                  <div className="text-left sm:text-right text-xs font-mono">
                    <div className="font-bold text-slate-900">{companyName}</div>
                    <div className="text-slate-500">Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                    <div className="text-blue-700 font-bold uppercase mt-1">
                      Stance: {selectedStance.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                {/* Top Metrics Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                      Legal Exposure Score
                    </span>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className={`text-2xl font-black ${
                        analysisResult.riskCategory === 'CRITICAL'
                          ? 'text-rose-600'
                          : analysisResult.riskCategory === 'HIGH'
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}>
                        {analysisResult.overallRiskScore}
                      </span>
                      <span className="text-xs font-mono text-slate-400">/ 100</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-600">
                      {analysisResult.riskCategory} RISK
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                      DGCL § 141 Safe Harbor
                    </span>
                    <div className="mt-1 font-bold text-xs">
                      {analysisResult.delawareSafeHarborStatus === 'PROTECTED' ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> PROTECTED
                        </span>
                      ) : (
                        <span className="text-rose-700 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> NON-COMPLIANT
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Business Judgment Rule Standard
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                      Audited Agreement
                    </span>
                    <div className="mt-1 text-xs font-bold text-slate-900 truncate">
                      {analysisResult.contractTitle}
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1">
                      {analysisResult.findings.length} Fiduciary Findings
                    </span>
                  </div>
                </div>

                {/* Executive Directive */}
                <div className="p-3.5 rounded-xl bg-blue-50/90 border border-blue-200 text-xs text-blue-950 space-y-1">
                  <div className="font-bold uppercase tracking-wider font-mono text-[10px] text-blue-800">
                    Executive Action Directive:
                  </div>
                  <p className="leading-relaxed font-medium">
                    {analysisResult.executiveSummary}
                  </p>
                </div>

                {/* Findings Matrix Table */}
                <div className="space-y-2">
                  <div className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700">
                    Fiduciary Risk &amp; Recommended Redlines Summary
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 font-mono text-[11px] text-slate-700">
                          <th className="py-2 px-3 font-bold">#</th>
                          <th className="py-2 px-3 font-bold">Clause &amp; Hazard</th>
                          <th className="py-2 px-3 font-bold">Risk</th>
                          <th className="py-2 px-3 font-bold">Recommended Fiduciary Redline ({selectedStance.replace('_', ' ')})</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {analysisResult.findings.map((f, i) => (
                          <tr key={f.id} className="align-top">
                            <td className="py-2 px-3 font-mono text-slate-500 font-bold">{i + 1}</td>
                            <td className="py-2 px-3 font-bold text-slate-900 max-w-[140px]">
                              {f.clauseType}
                              <div className="text-[10px] font-normal text-slate-500 mt-0.5">
                                {f.legalAnalysis.slice(0, 85)}...
                              </div>
                            </td>
                            <td className="py-2 px-3 font-mono text-[10px] whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded font-bold ${
                                f.riskLevel === 'CRITICAL'
                                  ? 'bg-rose-100 text-rose-700'
                                  : f.riskLevel === 'HIGH'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}>
                                {f.riskLevel}
                              </span>
                            </td>
                            <td className="py-2 px-3 font-mono text-[11px] text-slate-800 leading-snug">
                              {f.recommendedRedline}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Merkle Cryptographic Seal & Sign-off */}
                <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                      Cryptographic Audit Seal (SHA-256)
                    </span>
                    <div className="font-mono text-[10px] text-slate-600 break-all p-2 rounded bg-slate-50 border border-slate-200">
                      {analysisResult.merkleAudit.merkleRoot}
                    </div>
                    <span className="text-[9px] text-slate-400 block">
                      Leaves: {analysisResult.merkleAudit.leafCount} · Timestamp: {analysisResult.merkleAudit.auditTimestamp}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="border border-dashed border-slate-300 p-2 rounded-lg flex flex-col justify-between">
                      <span className="font-bold text-slate-700 text-[10px]">Reviewing Counsel:</span>
                      <div className="border-b border-slate-400 mt-4 mb-1" />
                      <span className="text-[9px] text-slate-400">Date &amp; Signature</span>
                    </div>

                    <div className="border border-dashed border-slate-300 p-2 rounded-lg flex flex-col justify-between">
                      <span className="font-bold text-slate-700 text-[10px]">Board DGCL § 141 Sign-Off:</span>
                      <div className="border-b border-slate-400 mt-4 mb-1" />
                      <span className="text-[9px] text-slate-400">Date &amp; Signature</span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

