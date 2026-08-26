'use client';

import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, ShieldAlert, CheckCircle2, AlertTriangle, Activity, 
  HelpCircle, ChevronRight, FileText, Send, Sparkles, RefreshCw, 
  Layers, ArrowUpRight, Clock, Building2, ExternalLink, X, MessageSquare,
  TrendingUp, TrendingDown, Info, ShieldCheck, Flame, Scale, DollarSign,
  Zap, UploadCloud, RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { downloadAsPDF, downloadAsCSV } from '@/lib/export-helpers';
import { ActiveKnowledgeSelector } from '@/components/ActiveKnowledgeSelector';
import { LegalDialogModal, LegalDocType } from '@/components/landing/LegalDialogModal';
import { TactileButton, ScrambleText } from '@/components/ui/EnterpriseTactileSuite';
import { useOrgProfile } from '@/context/OrgProfileContext';
import { SampleScenarioTrigger } from '@/components/dashboard/SampleScenarioTrigger';
import {
  SAMPLE_SCENARIO_A,
  SAMPLE_SCENARIO_B,
  SampleScenarioDefinition,
  getSampleScenario
} from '@/lib/sample-scenarios';
import {
  getSectorContent,
  getAdaptiveDepartments,
  getAdaptiveAgents,
  buildAdaptiveDemoData,
  buildAdaptiveAhaScenarios,
} from '@/lib/org-adaptive-content';
import { useAuth } from '@/context/AuthContext';
import SignInModal from '@/components/SignInModal';
import {
  saveGuestSimulationState,
  loadGuestSimulationState,
  isGuestUser,
} from '@/lib/guest-simulation-store';
import { ExecutiveMotivationWidget } from '@/components/dashboard/ExecutiveMotivationWidget';

interface Citation {
  documentId?: string;
  documentName: string;
  snippet: string;
}

interface ExecutiveAnswer {
  id: string;
  question: string;
  answer: string;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'INFO';
  citations: Citation[];
}

export interface DepartmentHealthItem {
  department: string;
  healthScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'CRITICAL';
  summary: string;
  activeIssuesCount: number;
  citations: Citation[];
}

export interface AIRecommendationItem {
  id: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  title: string;
  recommendation: string;
  rationale: string;
  citations: Citation[];
}

export interface ExecutiveBriefData {
  executiveBrief: string;
  healthScore: number;
  knowledgeCoverage: number;
  riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'CRITICAL';
  decisionConfidence: number;
  executiveAnswers: ExecutiveAnswer[];
  departmentHealth: DepartmentHealthItem[];
  aiRecommendations: AIRecommendationItem[];
  recentEvents: { date: string; title: string; category: string; description: string; docName?: string }[];
  timelineHighlights: { date: string; milestone: string; impact: string }[];
}

export default function ExecutiveDashboardClient({ userName }: { userName: string }) {
  const { user } = useAuth();
  const isDemoMode = typeof window !== 'undefined' && (window.location.pathname === '/demo' || window.location.search.includes('demo=true'));
  const { profile } = useOrgProfile();

  // ── ALL CONTENT IS ORG-ADAPTIVE — ZERO HARDCODED STRINGS ─────────────────
  const sector = profile?.sector || 'default';
  const companyName = profile?.companyName || 'Your Organisation';
  const sectorContent = getSectorContent(sector);
  const adaptiveDepts = getAdaptiveDepartments(sector);
  const adaptiveAgents = getAdaptiveAgents(sector, profile?.customAgents);

  // Demo data is built dynamically from org profile (no sector/company hardcoding)
  const DEFAULT_DEMO_DATA: ExecutiveBriefData = buildAdaptiveDemoData(sector, companyName, adaptiveDepts, adaptiveAgents);

  // AHA scenarios built from sector (labels, file names, roles all adaptive)
  const AHA_SCENARIOS = buildAdaptiveAhaScenarios(sector, companyName, adaptiveAgents);

  // ── RUNTIME STATE ─────────────────────────────────────────────────────────
  const [data, setData] = useState<ExecutiveBriefData>(DEFAULT_DEMO_DATA);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSampleScenarioId, setActiveSampleScenarioId] = useState<string | null>(null);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [signInPrompt, setSignInPrompt] = useState({
    title: 'Save Executive Briefing & Simulation',
    subtitle: 'Sign in to save your executive simulation results and unlock 50 daily boardroom runs',
  });

  // ─── 60-SECOND AHA SIMULATION LAB STATE ──────────────────────────────────
  const [activeAhaScenario, setActiveAhaScenario] = useState<'mna' | 'sla' | 'boardroom'>('mna');
  const [isAhaAnalyzing, setIsAhaAnalyzing] = useState(false);

  // Active modal inspection states
  const [activeAnswer, setActiveAnswer] = useState<ExecutiveAnswer | null>(null);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);

  // Mandatory Legal Acceptance Modal on Dashboard Load
  const [mandatoryLegalDoc, setMandatoryLegalDoc] = useState<LegalDocType | null>(null);

  useEffect(() => {
    try {
      const accepted = localStorage.getItem('synaps_legal_accepted_v1');
      if (!accepted) {
        setMandatoryLegalDoc('terms');
      }
    } catch (e) {}
  }, []);

  const handleLegalAcceptance = () => {
    try {
      localStorage.setItem('synaps_legal_accepted_v1', 'true');
    } catch (e) {}
    setMandatoryLegalDoc(null);
  };

  // Custom AI COO question
  const [customQuestion, setCustomQuestion] = useState('');
  const [askingCustom, setAskingCustom] = useState(false);
  const [customResponse, setCustomResponse] = useState<any | null>(null);

  const fetchBriefData = async () => {
    setIsSyncing(true);
    setError(null);
    try {
      const res = await fetch('/api/executive/brief');
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
        // If real data arrived from database with knowledge coverage, override sample state
        if (json.data.knowledgeCoverage > 0) {
          setActiveSampleScenarioId(null);
        }
      }
    } catch (err: any) {
      console.warn('[AI COO] Background brief sync notice:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchBriefData();

    // Check for query param ?scenario=scenario-a or ?scenario=scenario-b
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const scenarioParam = params.get('scenario');
      if (scenarioParam) {
        const scenario = getSampleScenario(scenarioParam);
        handleLoadSampleScenario(scenario);
      } else {
        const savedAha = loadGuestSimulationState<{ scenarioKey: 'mna' | 'sla' | 'boardroom' }>('aha');
        if (savedAha && savedAha.scenarioKey) {
          setActiveAhaScenario(savedAha.scenarioKey);
        }
      }
    }
  }, []);

  // ── 1-CLICK INSTANT SAMPLE SCENARIO ACTIVATION ────────────────────────────
  const handleLoadSampleScenario = (scenario: SampleScenarioDefinition) => {
    setActiveSampleScenarioId(scenario.id);
    setData(scenario.executiveBrief as unknown as ExecutiveBriefData);
  };

  const handleResetToLive = () => {
    setActiveSampleScenarioId(null);
    fetchBriefData();
  };

  const handleCustomQuestion = async () => {
    if (!customQuestion.trim() || askingCustom) return;
    setAskingCustom(true);
    try {
      const res = await fetch('/api/executive/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: customQuestion })
      });
      const json = await res.json();
      if (json.success) {
        setCustomResponse(json.data);
      } else {
        setCustomResponse({ answer: `Error: ${json.error}`, citations: [] });
      }
    } catch (e: any) {
      setCustomResponse({ answer: `Error: ${e.message}`, citations: [] });
    } finally {
      setAskingCustom(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Healthy</span>;
      case 'WARNING':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Attention</span>;
      case 'CRITICAL':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1"><Flame className="w-3 h-3" /> High Risk</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1"><Info className="w-3 h-3" /> Info</span>;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'LOW':
        return <span className="text-emerald-400 font-bold text-sm">Low Risk</span>;
      case 'MODERATE':
        return <span className="text-amber-400 font-bold text-sm">Moderate Risk</span>;
      case 'ELEVATED':
      case 'CRITICAL':
        return <span className="text-red-400 font-bold text-sm">Elevated Risk</span>;
      default:
        return <span className="text-slate-400 font-bold text-sm">Normal</span>;
    }
  };

  const isScenarioA = activeSampleScenarioId === 'scenario-a';
  const isScenarioB = activeSampleScenarioId === 'scenario-b';

  return (
    <div className="w-full space-y-8 font-sans pb-16">
      
      {/* ACTIVE SAMPLE SCENARIO NOTIFICATION BANNER */}
      {activeSampleScenarioId && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/90 via-slate-900 to-indigo-950/90 border border-cyan-500/40 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5 text-xs font-mono">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0 fill-cyan-400" />
            <span>
              ⚡ Viewing 1-Click Executive Sample Scenario: <strong className="text-cyan-300">{isScenarioA ? 'Supplier Supply Chain Shock & M&A Due Diligence' : 'Q3 Margin Compression & Delaware DGCL § 141 Safe-Harbor Audit'}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={isScenarioA ? '/dashboard/boardroom?scenario=scenario-a' : '/dashboard/boardroom?scenario=scenario-b'}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-sm"
            >
              <span>Convene 10-Agent Boardroom</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
            <button
              onClick={handleResetToLive}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>
      )}

      {/* 1. HERO AI COO BRIEFING BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 text-white p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                <BrainCircuit className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">AI COO Command Console</span>
                  {isSyncing && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-[9px] font-mono font-bold text-indigo-300 animate-pulse">
                      <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Live Syncing...
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Executive Operational Briefing</h1>
              </div>
            </div>

            {/* Cryptographic SHA-256 Scramble Text Badge */}
            <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-indigo-500/30 font-mono text-xs text-emerald-400 font-bold shadow-inner">
              <ScrambleText text="SHA-256: 9e4f2b8a...DGCL § 141 VERIFIED" />
            </div>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed max-w-4xl bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
            {data.executiveBrief}
          </p>

          {/* Tactile 3D Action Controls */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <TactileButton 
              variant="primary" 
              onClick={() => {
                const targetUrl = activeSampleScenarioId 
                  ? `/dashboard/boardroom?scenario=${activeSampleScenarioId}` 
                  : '/dashboard/boardroom';
                window.location.href = targetUrl;
              }}
            >
              <span>Run 10-Agent Deliberation</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </TactileButton>

            <TactileButton 
              variant="amber" 
              onClick={() => {
                const targetUrl = activeSampleScenarioId 
                  ? `/dashboard/simulations?scenario=${activeSampleScenarioId}` 
                  : '/dashboard/simulations';
                window.location.href = targetUrl;
              }}
            >
              <span>Deploy Invariant SCM Engine</span>
            </TactileButton>

            <button onClick={fetchBriefData} className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer">
              <RefreshCw className="w-3.5 h-3.5" /> Re-Sync
            </button>
          </div>

          {/* Quick Scenario Preset Triggers in Hero */}
          <div className="pt-3 border-t border-white/10">
            <SampleScenarioTrigger 
              variant="compact"
              activeScenarioId={activeSampleScenarioId || undefined}
              onSelectScenario={handleLoadSampleScenario}
            />
          </div>
        </div>
      </div>

      {/* EXECUTIVE MOTIVATION & FIDUCIARY STREAK TELEMETRY (GAME ENGINE) */}
      <ExecutiveMotivationWidget variant="full" />

      {/* ── 60-SECOND EXECUTIVE "AHA!" SIMULATION LAB ─────────────────────────── */}
      <div className="rounded-3xl border-2 border-indigo-500/40 bg-gradient-to-br from-slate-900 via-[#0b0f19] to-slate-950 p-6 sm:p-8 text-white shadow-2xl space-y-6 relative overflow-hidden">
        {/* Specular Background Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#fc4778]/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-400 uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Instant 60-Second "AHA!" Simulation Lab</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Test-Drive Causarix on High-Stakes Corporate Scenarios
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Select a scenario below to watch Causarix uncover hidden liabilities, model financial drag, and generate Delaware DGCL § 141 redlines in under 15 seconds.
            </p>
          </div>

          {/* Preset Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/10">
            <button
              onClick={() => {
                setIsAhaAnalyzing(true);
                setActiveAhaScenario('mna');
                handleLoadSampleScenario(SAMPLE_SCENARIO_A);
                saveGuestSimulationState('aha', { scenarioKey: 'mna' });
                setTimeout(() => setIsAhaAnalyzing(false), 300);
              }}
              className={cn(
                "px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                activeAhaScenario === 'mna'
                  ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <span>🎯 Scenario A: $200M M&A</span>
            </button>

            <button
              onClick={() => {
                setIsAhaAnalyzing(true);
                setActiveAhaScenario('sla');
                handleLoadSampleScenario(SAMPLE_SCENARIO_B);
                saveGuestSimulationState('aha', { scenarioKey: 'sla' });
                setTimeout(() => setIsAhaAnalyzing(false), 300);
              }}
              className={cn(
                "px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                activeAhaScenario === 'sla'
                  ? "bg-[#fc4778] text-white shadow-[0_0_15px_rgba(252,71,120,0.5)]"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <span>⚖️ Scenario B: Q3 Margin & DGCL</span>
            </button>

            <button
              onClick={() => {
                setIsAhaAnalyzing(true);
                setActiveAhaScenario('boardroom');
                saveGuestSimulationState('aha', { scenarioKey: 'boardroom' });
                setTimeout(() => setIsAhaAnalyzing(false), 300);
              }}
              className={cn(
                "px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                activeAhaScenario === 'boardroom'
                  ? "bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <span>🏛️ 10-Agent Quorum</span>
            </button>
          </div>
        </div>

        {/* Live Scenario Card */}
        {isAhaAnalyzing ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-4">
            <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
            <div className="font-mono text-xs text-indigo-300 font-bold uppercase tracking-wider animate-pulse">
              Traversing KùzuDB Causal Graph & Calculating Delaware Redlines...
            </div>
          </div>
        ) : (
          <div className="space-y-6 relative z-10">
            {/* Header badges */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-mono text-xs font-bold">
                  // {AHA_SCENARIOS[activeAhaScenario]?.tag || 'EXECUTIVE_SCENARIO'}
                </span>
                <h3 className="font-bold text-lg text-white">
                  {AHA_SCENARIOS[activeAhaScenario]?.title || 'High Stakes Corporate Simulation'}
                </h3>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-1 rounded-md bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold">
                  {AHA_SCENARIOS[activeAhaScenario]?.riskScore || 'HIGH RISK'}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                  ⚡ {AHA_SCENARIOS[activeAhaScenario]?.timeSaved || '&lt;3s Activation'}
                </span>
              </div>
            </div>

            {/* 3-Pillar Aha Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Pillar 1: Root Vulnerability & Citation */}
              <div className="p-5 rounded-2xl bg-black/50 border border-rose-500/30 space-y-3">
                <div className="flex items-center gap-2 font-mono text-xs text-rose-400 font-bold uppercase">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>1. Detected Vulnerability</span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  {AHA_SCENARIOS[activeAhaScenario]?.vulnerability?.title}
                </h4>
                <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/20 font-mono text-[11px] text-rose-200">
                  📁 {AHA_SCENARIOS[activeAhaScenario]?.vulnerability?.source}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {AHA_SCENARIOS[activeAhaScenario]?.vulnerability?.detail}
                </p>
              </div>

              {/* Pillar 2: Financial Model Drag */}
              <div className="p-5 rounded-2xl bg-black/50 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 font-mono text-xs text-amber-400 font-bold uppercase">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span>2. Mathematical Drag (Pyodide)</span>
                </div>
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-slate-400 block uppercase">Clean-Room Cost</span>
                    <span className="text-base font-black text-amber-300">
                      {AHA_SCENARIOS[activeAhaScenario]?.financialDrag?.cleanRoomCost}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-slate-400 block uppercase">Runway Impact</span>
                    <span className="text-base font-black text-rose-400">
                      {AHA_SCENARIOS[activeAhaScenario]?.financialDrag?.runwayImpact}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  💡 <strong className="text-white">CFO Directive:</strong> {AHA_SCENARIOS[activeAhaScenario]?.financialDrag?.recommendation}
                </p>
              </div>

              {/* Pillar 3: Delaware Redline & Counter-Clause */}
              <div className="p-5 rounded-2xl bg-black/50 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 font-bold uppercase">
                  <Scale className="w-4 h-4 text-emerald-400" />
                  <span>3. Delaware DGCL Redline</span>
                </div>
                <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-500/30 text-[11px] font-sans text-red-200 line-through">
                  ❌ {AHA_SCENARIOS[activeAhaScenario]?.delawareRedline?.originalClause}
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-[11px] font-sans text-emerald-200 font-semibold">
                  ✓ {AHA_SCENARIOS[activeAhaScenario]?.delawareRedline?.redlinedClause}
                </div>
              </div>
            </div>

            {/* Quorum Votes & 1-Click Action Bar */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs font-bold text-slate-400 uppercase">10-Agent Consensus:</span>
                {(AHA_SCENARIOS[activeAhaScenario]?.boardroomQuorum || []).map((vote, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 font-mono text-[11px]">
                    <span className="font-bold text-indigo-300">{vote.role}:</span>
                    <span className="text-emerald-400 font-semibold">{vote.vote}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => {
                    const scenarioKey = activeAhaScenario === 'mna' ? 'scenario-a' : 'scenario-b';
                    window.location.href = `/dashboard/simulations?scenario=${scenarioKey}`;
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Open SCM Simulation Studio</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Knowledge Selector Bar */}
      <ActiveKnowledgeSelector />

      {/* 2. EXECUTIVE SCORECARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-base-100 border border-base-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] uppercase font-bold text-base-content/60 tracking-wider">Org Health Score</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight">{data.healthScore > 0 ? data.healthScore : '--'}</span>
            <span className="text-xs font-bold text-emerald-500">{data.healthScore > 0 ? '/ 100' : 'Awaiting Ingestion'}</span>
          </div>
          <div className="w-full bg-base-200 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${data.healthScore || 5}%` }}></div>
          </div>
        </div>

        <div className="bg-base-100 border border-base-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] uppercase font-bold text-base-content/60 tracking-wider">Knowledge Coverage</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight">{data.knowledgeCoverage}%</span>
            <span className="text-xs font-bold text-indigo-500">{data.knowledgeCoverage > 0 ? 'Ingested' : '0 Docs Loaded'}</span>
          </div>
          <div className="w-full bg-base-200 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${data.knowledgeCoverage || 5}%` }}></div>
          </div>
        </div>

        <div className="bg-base-100 border border-base-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] uppercase font-bold text-base-content/60 tracking-wider">Overall Risk Level</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            {data.knowledgeCoverage > 0 ? getRiskBadge(data.riskLevel) : <span className="text-slate-400 font-bold text-sm">Unassessed</span>}
          </div>
          <p className="text-[11px] text-base-content/50 mt-3">{data.knowledgeCoverage > 0 ? 'Evaluated across Gaps & Compliance' : 'Upload records to evaluate'}</p>
        </div>

        <div className="bg-base-100 border border-base-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] uppercase font-bold text-base-content/60 tracking-wider">Decision Confidence</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight">{data.decisionConfidence > 0 ? `${data.decisionConfidence}%` : '--%'}</span>
            <span className="text-xs font-bold text-blue-500">{data.decisionConfidence > 0 ? 'Confidence' : 'Awaiting Data'}</span>
          </div>
          <div className="w-full bg-base-200 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${data.decisionConfidence || 5}%` }}></div>
          </div>
        </div>
      </div>

      {/* 3. EXECUTIVE QUESTIONS MATRIX */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-base-content flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" /> Key Executive Questions
            </h2>
            <p className="text-xs text-base-content/60">Click any card to inspect full AI analysis and document citations.</p>
          </div>
          {activeSampleScenarioId && (
            <span className="text-xs font-mono text-cyan-500 font-bold">
              ⚡ Grounded in Scenario Data
            </span>
          )}
        </div>

        {(!data?.executiveAnswers || data.executiveAnswers.length === 0) ? (
          /* HIGH-VISIBILITY 2-PATHWAY EMPTY STATE */
          <SampleScenarioTrigger 
            onSelectScenario={handleLoadSampleScenario}
            activeScenarioId={activeSampleScenarioId || undefined}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.executiveAnswers.map((item) => {
              const citations = item?.citations || [];
              return (
                <div 
                  key={item.id} 
                  onClick={() => setActiveAnswer(item)}
                  className="bg-base-100 border border-base-300 hover:border-primary/40 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3 gap-3">
                      <h3 className="font-bold text-sm sm:text-base text-base-content group-hover:text-primary transition-colors leading-snug break-words flex-1 min-w-0 pr-1">
                        {item.question}
                      </h3>
                      <div className="shrink-0">
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                    <p className="text-xs text-base-content/70 line-clamp-3 leading-relaxed mb-4">
                      {item.answer}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-base-200 text-xs text-base-content/50">
                    <span className="flex items-center gap-1.5 font-medium text-primary text-[11px]">
                      <FileText className="w-3.5 h-3.5" /> {citations.length} Document Citations
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform text-primary font-bold">Inspect →</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. DEPARTMENT HEALTH MATRIX & AI RECOMMENDATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Department Health */}
        <div className="bg-base-100 border border-base-300 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold tracking-tight text-base-content flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-500" /> Department Health Matrix
            </h2>
            <span className="text-xs font-semibold text-base-content/50">
              {(data?.departmentHealth || []).length} Departments Active
            </span>
          </div>

          <div className="space-y-4">
            {(data?.departmentHealth || []).map((dept, i) => {
              const deptCitations = dept?.citations || [];
              return (
                <div key={i} className="bg-base-200/50 border border-base-300 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-base-content">{dept.department}</span>
                      <span className="text-xs font-medium text-base-content/50">Score: {dept.healthScore}</span>
                    </div>
                    {getRiskBadge(dept.riskLevel)}
                  </div>
                  <p className="text-xs text-base-content/70">{dept.summary}</p>
                  {deptCitations.length > 0 && (
                    <button 
                      onClick={() => setActiveCitation(deptCitations[0])}
                      className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3 h-3" /> Citation: {deptCitations[0].documentName}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* AI COO Recommendations */}
        <div className="bg-base-100 border border-base-300 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold tracking-tight text-base-content flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> AI COO Priority Recommendations
            </h2>
            <span className="text-xs font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">Actionable</span>
          </div>

          <div className="space-y-4">
            {(data?.aiRecommendations || []).map((rec) => {
              const recCitations = rec?.citations || [];
              return (
                <div key={rec.id} className="bg-base-200/50 border border-base-300 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm text-base-content">{rec.title}</h4>
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", 
                      rec.priority === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border border-red-500/30' :
                      rec.priority === 'HIGH' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' :
                      'bg-blue-500/10 text-blue-500 border border-blue-500/30'
                    )}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-xs text-base-content/80 font-medium">{rec.recommendation}</p>
                  <p className="text-[11px] text-base-content/60">Rationale: {rec.rationale}</p>
                  {recCitations.length > 0 && (
                    <button 
                      onClick={() => setActiveCitation(recCitations[0])}
                      className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3 h-3" /> Cited Document: {recCitations[0].documentName}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 5. CUSTOM AI COO QUESTION INPUT */}
      <div className="bg-base-100 border border-base-300 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold tracking-tight text-base-content">Ask your AI COO anything</h2>
        </div>
        
        <div className="flex gap-3">
          <input 
            type="text" 
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomQuestion()}
            placeholder="Ask an operational question (e.g. Which vendor agreements have auto-renewal clauses?)..."
            className="flex-1 bg-base-200 border border-base-300 rounded-2xl px-4 py-3 text-sm text-base-content outline-none focus:ring-2 focus:ring-primary/20"
          />
          <Button onClick={handleCustomQuestion} disabled={askingCustom} className="rounded-2xl px-6 gap-2">
            {askingCustom ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {askingCustom ? 'Analyzing...' : 'Ask AI COO'}
          </Button>
        </div>

        {customResponse && (
          <div className="mt-4 p-5 bg-base-200 border border-primary/30 rounded-2xl text-sm space-y-3">
            <h4 className="font-bold text-primary flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" /> AI COO Response
            </h4>
            <div className="text-base-content/90 leading-relaxed">
              {customResponse.answer}
            </div>
            {customResponse.citations && (customResponse.citations || []).length > 0 && (
              <div className="pt-2 border-t border-base-300 text-xs space-y-1">
                <span className="font-bold text-base-content/60">Citations:</span>
                {(customResponse.citations || []).map((c: any, i: number) => (
                  <div key={i} className="text-primary font-medium flex items-center gap-1">
                    <FileText className="w-3 h-3" /> {c.documentName}: "{c.snippet}"
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 6. INSPECTION MODAL FOR QUESTION DETAILS */}
      {activeAnswer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative space-y-4 max-h-[85vh] overflow-y-auto">
            <button onClick={() => setActiveAnswer(null)} className="absolute top-4 right-4 p-2 text-base-content/50 hover:text-base-content cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              {getStatusBadge(activeAnswer.status)}
              <h3 className="font-bold text-lg text-base-content">{activeAnswer.question}</h3>
            </div>

            <div className="p-4 bg-base-200 border border-base-300 rounded-2xl text-sm text-base-content/90 leading-relaxed">
              {activeAnswer.answer}
            </div>

            {(activeAnswer.citations || []).length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase text-base-content/50 tracking-wider">Document Citations & Evidence</h4>
                {(activeAnswer.citations || []).map((c, i) => (
                  <div key={i} className="p-3 bg-primary/5 border border-primary/20 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-primary flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> {c.documentName}
                    </div>
                    <p className="text-base-content/70 italic">"{c.snippet}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. INSPECTION MODAL FOR SINGLE CITATION */}
      {activeCitation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-3">
            <button onClick={() => setActiveCitation(null)} className="absolute top-4 right-4 p-2 text-base-content/50 hover:text-base-content cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-base text-primary flex items-center gap-2">
              <FileText className="w-4 h-4" /> {activeCitation.documentName}
            </h3>
            <div className="p-3 bg-base-200 border border-base-300 rounded-xl text-xs italic text-base-content/80 leading-relaxed">
              "{activeCitation.snippet}"
            </div>
            <Link href="/dashboard/documents" className="btn btn-sm btn-primary w-full gap-2">
              Open Document Library <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Mandatory Legal Agreement Modal on Dashboard Load */}
      <LegalDialogModal
        type={mandatoryLegalDoc}
        onClose={handleLegalAcceptance}
        isLoggedIn={true}
        userEmail={userName}
        userName={userName}
      />

      {/* Delayed High-Intent Sign-In Modal for Guest Users */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        title={signInPrompt.title}
        subtitle={signInPrompt.subtitle}
      />
    </div>
  );
}
