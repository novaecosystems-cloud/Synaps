'use client';

import React, { useState } from 'react';
import { 
  Building2, Sparkles, Zap, ShieldAlert, ArrowRight, 
  FileText, UploadCloud, CheckCircle2, TrendingUp, Scale,
  Users, Activity, ChevronRight, Layers, Clock, Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  SAMPLE_SCENARIO_A, 
  SAMPLE_SCENARIO_B, 
  SampleScenarioDefinition 
} from '@/lib/sample-scenarios';

interface SampleScenarioTriggerProps {
  onSelectScenario?: (scenario: SampleScenarioDefinition) => void;
  className?: string;
  variant?: 'hero' | 'compact' | 'split';
  activeScenarioId?: string;
  onUploadClick?: () => void;
}

export function SampleScenarioTrigger({
  onSelectScenario,
  className,
  variant = 'hero',
  activeScenarioId,
  onUploadClick
}: SampleScenarioTriggerProps) {
  const [loadingScenarioId, setLoadingScenarioId] = useState<string | null>(null);

  const handleSelect = (scenario: SampleScenarioDefinition) => {
    setLoadingScenarioId(scenario.id);
    if (onSelectScenario) {
      onSelectScenario(scenario);
    }
    setTimeout(() => {
      setLoadingScenarioId(null);
    }, 400);
  };

  if (variant === 'compact') {
    return (
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        <span className="text-[11px] font-bold text-base-content/50 uppercase tracking-wider flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>1-Click Scenarios:</span>
        </span>
        
        <button
          onClick={() => handleSelect(SAMPLE_SCENARIO_A)}
          disabled={loadingScenarioId !== null}
          className={cn(
            "text-xs px-3 py-1.5 rounded-xl border font-medium flex items-center gap-1.5 transition-all cursor-pointer",
            activeScenarioId === 'scenario-a'
              ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400 font-bold shadow-sm"
              : "bg-base-200 hover:bg-cyan-500/10 border-base-300 hover:border-cyan-500/30 text-base-content/80 hover:text-cyan-400"
          )}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate max-w-[200px]">Scenario A: Supply Chain & M&A</span>
        </button>

        <button
          onClick={() => handleSelect(SAMPLE_SCENARIO_B)}
          disabled={loadingScenarioId !== null}
          className={cn(
            "text-xs px-3 py-1.5 rounded-xl border font-medium flex items-center gap-1.5 transition-all cursor-pointer",
            activeScenarioId === 'scenario-b'
              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 font-bold shadow-sm"
              : "bg-base-200 hover:bg-emerald-500/10 border-base-300 hover:border-emerald-500/30 text-base-content/80 hover:text-emerald-400"
          )}
        >
          <Scale className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate max-w-[220px]">Scenario B: Q3 Margin & DGCL § 141</span>
        </button>
      </div>
    );
  }

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* TWO HIGH-CLARITY PATHWAYS BANNER */}
      <div className="rounded-3xl border-2 border-indigo-500/30 bg-gradient-to-br from-slate-900 via-[#0a0d18] to-slate-950 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Specular Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 space-y-6">
          
          {/* Header Title Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-cyan-500/20 border border-amber-500/30 font-mono text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Instant Activation • &lt;3s Time-to-Value
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 font-mono text-[10px] font-bold text-emerald-300">
                  Zero Setup Required
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                Choose Your Executive Intelligence Pathway
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Experience Synaps instantly without waiting for multi-step setup wizards. Test-drive live 10-Agent Boardroom debates or upload your own corporate contracts.
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-slate-400 bg-black/40 border border-white/10 px-3 py-2 rounded-2xl">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Instant Deliberation: <strong className="text-emerald-400">10 Agents Ready</strong></span>
            </div>
          </div>

          {/* TWO CLEAR PATHWAY COLUMNS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 📁 OPTION 1: DROP YOUR OWN CONTRACT */}
            <div className="lg:col-span-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/40 p-6 flex flex-col justify-between space-y-5 transition-all group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg">
                    Option 1 • Production Ingestion
                  </span>
                  <UploadCloud className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                </div>
                
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  📁 Drop Your Own Contract
                </h3>
                
                <p className="text-xs text-slate-300 leading-relaxed">
                  Upload your organization's PDF, DOCX, or Excel agreements (vendor MSAs, M&A NDAs, financial models). Synaps automatically indexes clauses and extracts causal risk trees.
                </p>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>PDF, DOCX, XLSX, TXT supported</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Real documents override sample data dynamically</span>
                  </div>
                </div>
              </div>

              <div>
                <Link
                  href="/dashboard/documents"
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md group-hover:shadow-indigo-500/20 cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Corporate Document</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* ⚡ OPTION 2: 1-CLICK SAMPLE SCENARIOS (HIGH-VISIBILITY PRESETS) */}
            <div className="lg:col-span-8 rounded-2xl bg-white/[0.04] border-2 border-cyan-500/40 p-6 space-y-5 relative">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider text-black bg-cyan-400 px-3 py-1 rounded-lg flex items-center gap-1 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                    <Zap className="w-3 h-3 fill-black text-black" />
                    Option 2 • Recommended (1-Click)
                  </span>
                  <span className="text-xs font-bold text-cyan-300">
                    Load Pre-Configured Executive Scenarios
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Instant 10-Agent Deliberation State
                </span>
              </div>

              {/* Scenario Preset Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* PRESET A: Supplier Supply Chain Shock & M&A Due Diligence */}
                <div className={cn(
                  "p-5 rounded-2xl border transition-all space-y-4 flex flex-col justify-between relative overflow-hidden",
                  activeScenarioId === 'scenario-a'
                    ? "bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                    : "bg-black/50 border-cyan-500/30 hover:border-cyan-400/60"
                )}>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-start gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300">
                        ⚡ Scenario A
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        94% Quorum
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">
                      Supplier Supply Chain Shock & M&A Due Diligence
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      Audit a $200M enterprise acquisition under sudden Tier-1 silicon foundry export bans. Evaluates $15M working capital holdbacks and Delaware DGCL § 141 safe-harbor indemnity caps.
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['M&A Due Diligence', 'Delaware DGCL § 141', 'EAR/ITAR', '10-Agent Quorum'].map((tag, i) => (
                        <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSelect(SAMPLE_SCENARIO_A)}
                    disabled={loadingScenarioId !== null}
                    className="w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider py-2.5 gap-2 cursor-pointer shadow-md"
                  >
                    <Zap className="w-3.5 h-3.5 fill-black text-black" />
                    <span>{loadingScenarioId === 'scenario-a' ? 'Activating 10 Agents...' : '1-Click Launch Scenario A'}</span>
                  </Button>
                </div>

                {/* PRESET B: Q3 Margin Compression & Delaware DGCL § 141 Safe-Harbor Audit */}
                <div className={cn(
                  "p-5 rounded-2xl border transition-all space-y-4 flex flex-col justify-between relative overflow-hidden",
                  activeScenarioId === 'scenario-b'
                    ? "bg-emerald-950/40 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                    : "bg-black/50 border-emerald-500/30 hover:border-emerald-400/60"
                )}>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-start gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-300">
                        ⚡ Scenario B
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        96% Quorum
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">
                      Q3 Margin Compression & Delaware DGCL § 141 Audit
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      Restructure cloud infrastructure and consolidate 18 redundant SaaS subscriptions ($4.2M savings) while securing 100% board director immunity under DGCL § 141(e).
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['Operating Margin', 'DGCL § 141(e) Shield', '$4.2M SaaS Prune', 'Compute SCM'].map((tag, i) => (
                        <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSelect(SAMPLE_SCENARIO_B)}
                    disabled={loadingScenarioId !== null}
                    className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider py-2.5 gap-2 cursor-pointer shadow-md"
                  >
                    <Zap className="w-3.5 h-3.5 fill-black text-black" />
                    <span>{loadingScenarioId === 'scenario-b' ? 'Activating 10 Agents...' : '1-Click Launch Scenario B'}</span>
                  </Button>
                </div>

              </div>

              {/* Quick 10-Agent Quorum Pill Indicators */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-slate-300 font-bold">Simulates All 10 C-Suite AI Agents:</span>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  {['CEO', 'CFO', 'COO', 'CTO', 'LEGAL', 'HR', 'SALES', 'MARKETING', 'OPS', 'COMPLIANCE'].map((role, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold text-slate-200">
                      {role}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
