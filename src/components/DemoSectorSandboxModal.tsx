'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ShieldAlert, CheckCircle2, ArrowRight, FileText, 
  Layers, Play, X, ExternalLink, Zap, RefreshCw, Scale, DollarSign, Cloud, HeartPulse, Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FireworksBackground } from '@/components/ui/FireworksBackground';

interface SectorScenario {
  id: string;
  name: string;
  sector: string;
  icon: any;
  fileName: string;
  description: string;
  contradictionSummary: string;
  financialExposure: string;
  originalClause: string;
  remediatedClause: string;
  evidenceCoords: string;
  invariantRule: string;
}

const SECTOR_SCENARIOS: SectorScenario[] = [
  {
    id: 'legal_mna',
    name: 'Corporate M&A & Delaware Redlines',
    sector: 'LEGAL & GOVERNANCE',
    icon: Scale,
    fileName: 'Master_Services_Agreement_Vendor_v4.pdf',
    description: 'Scans target vendor agreement for uncapped liability and non-standard director indemnification.',
    contradictionSummary: 'Section 14.2 imposes unlimited indemnification without Delaware DGCL § 141 standard liability caps.',
    financialExposure: '$2,500,000 Uncapped Exposure',
    originalClause: '"Vendor shall fully indemnify, defend and hold harmless Client from any and all claims, without limitation of liability."',
    remediatedClause: '"Vendor liability under this Section shall be strictly capped at 1.0x total fees paid in the preceding 12 months, excluding Delaware statutory gross negligence."',
    evidenceCoords: '[Doc: MSA_Vendor_v4.pdf, Page 14, Line 88, SHA-256: 4f8b2a...]',
    invariantRule: 'INVARIANT_DELAWARE_DGCL_141_INDEMNITY_CAP'
  },
  {
    id: 'cloud_saas',
    name: 'Cloud Infrastructure & SLA Risk',
    sector: 'ENTERPRISE SAAS',
    icon: Cloud,
    fileName: 'Enterprise_Sales_Master_Order_Form_2026.pdf',
    description: 'Cross-checks Sales team 99.99% uptime commitment against Engineering multi-region cloud topology.',
    contradictionSummary: 'Sales promised 99.99% SLA (<4.3 mins downtime/mo) while Cloud Roadmap only delivers 99.9% (<43.2 mins).',
    financialExposure: '$1,450,000 Liquidated Damages Exposure',
    originalClause: '"Service Provider guarantees 99.99% monthly availability with 100% refund of all fees upon any breach."',
    remediatedClause: '"Service Provider guarantees 99.9% availability, excluding scheduled maintenance windows and third-party upstream cloud outages."',
    evidenceCoords: '[Doc: Sales_Order_2026.pdf, Page 6, Line 32, SHA-256: 9e1c4d...]',
    invariantRule: 'INVARIANT_CROSS_SILO_SLA_ARCHITECTURE_MATCH'
  },
  {
    id: 'fintech_banking',
    name: 'Fintech Debt Covenants & Rates',
    sector: 'FINANCE & BANKING',
    icon: DollarSign,
    fileName: 'Credit_Facility_Agreement_Tranche_B.pdf',
    description: 'Evaluates counterfactual +200 bps Fed interest rate hike against debt service coverage ratio (DSCR).',
    contradictionSummary: 'DSCR drops to 1.04x under +200 bps rate shock, violating the 1.25x mandatory bank covenant.',
    financialExposure: '$4,200,000 Accelerated Debt Liquidity Call',
    originalClause: '"Borrower must maintain minimum DSCR of 1.25x at all times; failure triggers immediate principal acceleration."',
    remediatedClause: '"In the event of macro benchmark rate shifts exceeding +150 bps, DSCR covenant calculation adjusts to 1.00x for a 90-day grace period."',
    evidenceCoords: '[Doc: Credit_Facility_B.pdf, Page 22, Line 110, SHA-256: 3a7c8f...]',
    invariantRule: 'INVARIANT_MACRO_DSCR_COVENANT_BUFFER'
  },
  {
    id: 'healthcare_bio',
    name: 'Healthcare Data Sovereignty',
    sector: 'HEALTHCARE & PHARMA',
    icon: HeartPulse,
    fileName: 'Clinical_Trial_Data_Protocol_EU_US.pdf',
    description: 'Cross-audits patient EHR transfer protocol against HIPAA Safe Harbor and EU GDPR cross-border transfer rules.',
    contradictionSummary: 'Clause 8 allows unencrypted telemetry export to US servers without standard EU SCC data shields.',
    financialExposure: '€20,000,000 GDPR Regulatory Fine Risk',
    originalClause: '"Patient trial telemetry may be processed across any international corporate server for analytical indexing."',
    remediatedClause: '"Patient EHR data must remain in designated sovereign EU enclaves with zero cross-border transfer without explicit IRB consent."',
    evidenceCoords: '[Doc: Clinical_Protocol.pdf, Page 9, Line 45, SHA-256: b2f901...]',
    invariantRule: 'INVARIANT_HIPAA_GDPR_SOVEREIGNTY_SHIELD'
  },
  {
    id: 'supply_chain',
    name: 'Semiconductor Supply Chain Shock',
    sector: 'HARDWARE & MANUFACTURING',
    icon: Cpu,
    fileName: 'Silicon_Wafer_Supply_Framework_2026.pdf',
    description: 'Models supply disruption from 35% tariff hike on raw substrate materials across 50 international tier-2 suppliers.',
    contradictionSummary: 'Fixed-price clause leaves manufacturer absorbing 100% of tariff spikes above 10%.',
    financialExposure: '$8,100,000 Gross Margin Erosion',
    originalClause: '"Supplier prices are locked for 36 months regardless of international trade duty adjustments or transport inflation."',
    remediatedClause: '"Raw material tariff increases exceeding 15% shall be shared equally (50/50) between Supplier and Manufacturer."',
    evidenceCoords: '[Doc: Silicon_Wafer_Supply.pdf, Page 18, Line 72, SHA-256: 8d1e5a...]',
    invariantRule: 'INVARIANT_SUPPLY_CHAIN_TARIFF_INDEXING'
  }
];

export function DemoSectorSandboxModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<SectorScenario>(SECTOR_SCENARIOS[0]);
  const [auditStep, setAuditStep] = useState<number>(0); // 0: ready, 1: running, 2: aha completed
  const [isDemoUser, setIsDemoUser] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDemo = window.location.pathname.includes('/demo') || 
                     document.cookie.includes('DEMO_SESSION') || 
                     document.cookie.includes('demo-user');
      setIsDemoUser(isDemo);
    }
  }, []);

  if (!isDemoUser) return null;

  const handleRunAudit = () => {
    setAuditStep(1);
    
    // Simulate real-time 4-stage graph reasoning
    setTimeout(() => {
      setAuditStep(2); // Triggers the AHA MOMENT!
    }, 1800);
  };

  const handleReset = (scenario: SectorScenario) => {
    setSelectedScenario(scenario);
    setAuditStep(0);
  };

  return (
    <>
      {/* ── TOP DEMO INFO BANNER ────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-500/30 px-4 py-2 text-xs font-mono flex flex-wrap items-center justify-between gap-2 shadow-md">
        <div className="flex items-center gap-2 text-indigo-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="font-bold uppercase tracking-wider text-white">Interactive Sandbox Demo</span>
          <span className="hidden sm:inline text-indigo-400/80">— Pre-loaded cross-sector enterprise intelligence</span>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="px-3 py-1 rounded bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm hover:scale-[1.02]"
        >
          <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
          <span>Test Multi-Sector Invariant Audits</span>
        </button>
      </div>

      {/* ── INTERACTIVE SECTOR SANDBOX & AHA MODAL ───────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0f0f11] border border-indigo-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-white font-sans"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      Causarix Sector Invariant Test-Drive
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Select an enterprise sector file to test 60-second invariant redlines and causal verification.
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
                {/* Sector Selector Tabs */}
                <div>
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                    1. Choose an Industry Sector File:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {SECTOR_SCENARIOS.map((s) => {
                      const Icon = s.icon;
                      const isSelected = selectedScenario.id === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => handleReset(s)}
                          className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
                            isSelected 
                              ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg' 
                              : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-zinc-500'}`} />
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                          </div>
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase block text-indigo-400/80">
                              {s.sector.split('&')[0]}
                            </span>
                            <span className="text-xs font-semibold leading-tight block text-white mt-0.5">
                              {s.name}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected File Details */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-white/[0.05] border border-white/10 text-indigo-400 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-white block">
                        {selectedScenario.fileName}
                      </span>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {selectedScenario.description}
                      </p>
                    </div>
                  </div>

                  {auditStep === 0 && (
                    <Button
                      onClick={handleRunAudit}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-wider px-5 shrink-0 shadow-lg"
                    >
                      <Play className="w-3.5 h-3.5 mr-1.5 fill-white" />
                      Run Invariant Audit
                    </Button>
                  )}
                </div>

                {/* Audit Running State */}
                {auditStep === 1 && (
                  <div className="p-8 rounded-xl bg-indigo-950/30 border border-indigo-500/40 text-center space-y-4 animate-in fade-in">
                    <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                    <div>
                      <h4 className="text-sm font-bold text-white font-mono">
                        Executing Neuro-Symbolic Invariant Audit...
                      </h4>
                      <p className="text-xs text-indigo-300/80 font-mono mt-1">
                        Traversing KùzuDB Graph · Computing Pearl Do-Calculus Surgery · Verifying SHA-256 Coords
                      </p>
                    </div>
                  </div>
                )}

                {/* ── AHA MOMENT DISCOVERY RESULT ────────────────────────────── */}
                {auditStep === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 relative"
                  >
                    {/* Celebratory Fireworks Canvas */}
                    <FireworksBackground population={4} autoFadeAfterMs={4500} />

                    {/* Aha Header Alert */}
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
                      <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-sm font-bold text-rose-300 font-mono">
                            ⚡ CONTRADICTION CAUGHT IN 1.1s — {selectedScenario.financialExposure}
                          </h4>
                          <span className="badge badge-error badge-xs font-mono font-bold">
                            {selectedScenario.invariantRule}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-300 mt-1">
                          {selectedScenario.contradictionSummary}
                        </p>
                        <span className="text-[11px] font-mono text-zinc-500 block mt-1">
                          Source Coordinates: {selectedScenario.evidenceCoords}
                        </span>
                      </div>
                    </div>

                    {/* Before & After Redline Diff */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Before */}
                      <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 block">
                          ❌ Original Predatory Clause:
                        </span>
                        <p className="text-xs font-mono text-rose-200/90 leading-relaxed bg-rose-950/40 p-3 rounded-lg border border-rose-500/20">
                          {selectedScenario.originalClause}
                        </p>
                      </div>

                      {/* After */}
                      <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                          ✅ Delaware DGCL § 141 Redline Counter-Clause:
                        </span>
                        <p className="text-xs font-mono text-emerald-200/90 leading-relaxed bg-emerald-950/40 p-3 rounded-lg border border-emerald-500/20">
                          {selectedScenario.remediatedClause}
                        </p>
                      </div>
                    </div>

                    {/* Action Footprint */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <button
                        onClick={() => handleReset(selectedScenario)}
                        className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Test Another Sector File</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <Link
                          href="/dashboard/documents"
                          onClick={() => setIsOpen(false)}
                          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs flex items-center gap-1.5 transition-all"
                        >
                          <span>Open in Document Redline Studio</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
export default DemoSectorSandboxModal;
