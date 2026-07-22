'use client';

import React, { useState } from 'react';
import { 
  Activity, Play, Sparkles, TrendingUp, TrendingDown, DollarSign, 
  Users, Globe, UserMinus, Rocket, Building, Briefcase, ShieldAlert, 
  Loader2, ArrowRight, Info, CheckCircle2, AlertTriangle, RefreshCw, 
  Layers, ChevronRight, HelpCircle, Gauge, Sliders, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SimulationsPage() {
  const [selectedPreset, setSelectedPreset] = useState('Increase Prices');
  const [decisionDetails, setDecisionDetails] = useState('');
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);
  const [activeScenarioTab, setActiveScenarioTab] = useState<'expected' | 'optimistic' | 'worstCase'>('expected');

  const presets = [
    { label: 'Increase Prices', icon: DollarSign, example: 'Increase enterprise tier prices by 15% across all global regions.' },
    { label: 'Hire Employees', icon: Users, example: 'Hire 25 senior engineers & 10 account executives to accelerate product roadmap.' },
    { label: 'Expand Internationally', icon: Globe, example: 'Open sales & customer support operations in Tokyo & Frankfurt.' },
    { label: 'Reduce Staff', icon: UserMinus, example: 'Reduce operating overhead by 12% across non-core business units.' },
    { label: 'Launch Products', icon: Rocket, example: 'Launch new AI Workflow Automation module as an add-on product.' },
    { label: 'Open Offices', icon: Building, example: 'Establish a new regional headquarters in London.' },
    { label: 'Acquire Companies', icon: Briefcase, example: 'Acquire a 30-person analytics startup to expand machine learning IP.' },
  ];

  const handleRunSimulation = async (typeOverride?: string, detailsOverride?: string) => {
    const activeType = typeOverride || selectedPreset;
    const activeDetails = detailsOverride || decisionDetails || presets.find(p => p.label === activeType)?.example || activeType;

    if (simulating) return;
    setSimulating(true);

    try {
      const res = await fetch('/api/simulations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decisionType: activeType, decisionDetails: activeDetails })
      });
      const json = await res.json();
      if (json.success) {
        setSimulationResult(json.data);
        setActiveScenarioTab('expected');
      } else {
        alert(`Simulation Error: ${json.error}`);
      }
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setSimulating(false);
    }
  };

  const getDepartmentIcon = (dept: string) => {
    switch (dept) {
      case 'Revenue': return <DollarSign className="w-4 h-4 text-emerald-500" />;
      case 'Cashflow': return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'Employees': return <Users className="w-4 h-4 text-blue-400" />;
      case 'Customers': return <Users className="w-4 h-4 text-indigo-400" />;
      case 'Operations': return <Activity className="w-4 h-4 text-purple-400" />;
      case 'Support': return <HelpCircle className="w-4 h-4 text-amber-400" />;
      case 'Inventory': return <Layers className="w-4 h-4 text-cyan-400" />;
      case 'Marketing': return <Rocket className="w-4 h-4 text-pink-400" />;
      case 'Compliance': return <ShieldAlert className="w-4 h-4 text-teal-400" />;
      default: return <Gauge className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="w-full space-y-8 font-sans pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-base-content">Synaps Simulation Engine</h1>
            <p className="text-xs text-base-content/60">Simulate business decisions before execution. Model Optimistic, Expected & Worst Case scenarios across 10 department vectors.</p>
          </div>
        </div>
        <a href="https://apivault.dev/" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm rounded-2xl gap-2 text-xs">
          <ExternalLink className="w-3.5 h-3.5 text-cyan-500" /> Powered by API Vault
        </a>
      </div>

      {/* SIMULATION SCENARIO BUILDER */}
      <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-5">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-base-content/60 block mb-2">Select Decision Type</label>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.label}
                  onClick={() => {
                    setSelectedPreset(p.label);
                    setDecisionDetails(p.example);
                  }}
                  className={cn(
                    "px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all border",
                    selectedPreset === p.label
                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/40 shadow-sm"
                      : "bg-base-200 hover:bg-base-300 border-base-300 text-base-content/70"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-base-content/60 block">Specific Decision Parameters & Details</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <textarea 
              value={decisionDetails}
              onChange={(e) => setDecisionDetails(e.target.value)}
              rows={2}
              placeholder="Describe the exact decision parameters, percentages, budget, or timelines..."
              className="flex-1 bg-base-200 border border-base-300 rounded-2xl p-3 text-sm text-base-content outline-none focus:ring-2 focus:ring-cyan-500/20 custom-scrollbar resize-none"
            ></textarea>
            <Button 
              onClick={() => handleRunSimulation()} 
              disabled={simulating} 
              className="rounded-2xl gap-2 py-4 px-6 bg-cyan-600 hover:bg-cyan-700 text-white font-bold h-auto"
            >
              {simulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              {simulating ? 'Simulating Engine...' : 'Run Business Simulation'}
            </Button>
          </div>
        </div>
      </div>

      {/* SIMULATION RESULTS VIEW */}
      {simulating ? (
        <div className="w-full py-20 bg-base-100 border border-base-300 rounded-3xl flex flex-col items-center justify-center space-y-4">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 animate-ping"></div>
            <Gauge className="w-10 h-10 text-cyan-500 animate-pulse" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-base-content">Simulating Decision Impact via apivault.dev...</h3>
            <p className="text-xs text-base-content/60 max-w-sm mx-auto">
              Generating Monte-Carlo scenario bounds (Expected, Optimistic, Worst Case) across Revenue, Cashflow, Operations, Support, and Profitability.
            </p>
          </div>
        </div>
      ) : simulationResult ? (
        <div className="space-y-8">
          
          {/* SCENARIO COMPARISON TABS & METRICS */}
          <div className="p-8 bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 border border-cyan-500/30 text-white rounded-3xl shadow-2xl space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/20 border border-cyan-500/30 px-3 py-1 rounded-full">
                  Simulation Outcome Model
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
                  Simulation: {simulationResult.decisionType}
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">{simulationResult.decisionDetails}</p>
              </div>

              {/* Scenario Selector Pills */}
              <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
                {(['expected', 'optimistic', 'worstCase'] as const).map((scKey) => {
                  const sc = simulationResult.scenarios[scKey];
                  return (
                    <button
                      key={scKey}
                      onClick={() => setActiveScenarioTab(scKey)}
                      className={cn(
                        "px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all",
                        activeScenarioTab === scKey
                          ? scKey === 'optimistic' ? "bg-emerald-500 text-white shadow-sm"
                            : scKey === 'worstCase' ? "bg-red-500 text-white shadow-sm"
                            : "bg-cyan-500 text-white shadow-sm"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      )}
                    >
                      {scKey === 'worstCase' ? 'Worst Case' : scKey} ({sc?.probability}%)
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Scenario Hero Summary */}
            {(() => {
              const currentSc = simulationResult.scenarios[activeScenarioTab];
              if (!currentSc) return null;

              return (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl">
                    <div>
                      <h3 className="font-bold text-lg text-white">{currentSc.title}</h3>
                      <p className="text-xs text-slate-300 mt-1">{currentSc.description}</p>
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <span className={cn(
                        "text-3xl font-extrabold block",
                        currentSc.netProfitabilityDelta >= 0 ? "text-emerald-400" : "text-red-400"
                      )}>
                        {currentSc.netProfitabilityDelta >= 0 ? `+${currentSc.netProfitabilityDelta}%` : `${currentSc.netProfitabilityDelta}%`}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Net Margin Impact</span>
                    </div>
                  </div>

                  {/* 10-DEPARTMENT IMPACT MATRIX */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-cyan-300">
                      10 Departmental Impact Projections ({currentSc.title})
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                      {currentSc.departmentImpacts?.map((d: any, idx: number) => (
                        <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-2xl space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-200 flex items-center gap-1.5">
                              {getDepartmentIcon(d.department)} {d.department}
                            </span>
                            <span className={cn(
                              "font-bold text-xs",
                              d.deltaPercent > 0 ? "text-emerald-400" : d.deltaPercent < 0 ? "text-red-400" : "text-slate-400"
                            )}>
                              {d.deltaPercent > 0 ? `+${d.deltaPercent}%` : `${d.deltaPercent}%`}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                            {d.analysis}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>

          {/* CASCADING INTER-DEPARTMENTAL IMPACT CHAIN */}
          {simulationResult.cascadingChain?.length > 0 && (
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-500" /> Cascading Inter-Departmental Domino Chain
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {simulationResult.cascadingChain.map((chain: any, idx: number) => (
                  <div key={idx} className="p-4 bg-base-200 border border-base-300 rounded-2xl relative space-y-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 font-bold text-xs flex items-center justify-center">
                      {chain.step || idx + 1}
                    </span>
                    <div className="font-bold text-xs text-base-content flex items-center gap-1">
                      <span>{chain.fromDepartment}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-500" />
                      <span>{chain.toDepartment}</span>
                    </div>
                    <p className="text-xs text-base-content/70 leading-relaxed">
                      {chain.effectDescription}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GROUNDED ASSUMPTIONS & UNCERTAINTY BOUNDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Grounded Assumptions */}
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-3">
              <h4 className="font-bold text-sm text-base-content uppercase tracking-wider flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-500" /> Grounded Corporate Assumptions Used
              </h4>
              <div className="space-y-2">
                {simulationResult.assumptionsUsed?.map((a: any, idx: number) => (
                  <div key={idx} className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-base-content block">• {a.assumption}</span>
                    <span className="text-[10px] text-cyan-500 font-semibold block">Source: {a.groundedSource}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Uncertainty Bounds */}
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-3">
              <h4 className="font-bold text-sm text-base-content uppercase tracking-wider flex items-center gap-2">
                <Gauge className="w-4 h-4 text-purple-500" /> Uncertainty Ranges & Risk Bounds
              </h4>
              
              <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-2xl space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-base-content/60 font-semibold">Min Downside Estimate:</span>
                  <span className="font-bold text-red-500">{simulationResult.uncertaintyRange?.minEstimate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base-content/60 font-semibold">Max Upside Estimate:</span>
                  <span className="font-bold text-emerald-500">{simulationResult.uncertaintyRange?.maxEstimate}</span>
                </div>
                <div className="pt-2 border-t border-purple-500/10 text-purple-400 font-medium">
                  {simulationResult.uncertaintyRange?.confidenceBounds}
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="w-full py-16 text-center bg-base-100 border border-base-300 border-dashed rounded-3xl space-y-4">
          <Activity className="w-12 h-12 text-base-content/30 mx-auto" />
          <div>
            <h3 className="text-lg font-bold text-base-content">Simulation Engine Standby</h3>
            <p className="text-xs text-base-content/60 max-w-md mx-auto mt-1">
              Select a decision type above or enter custom parameters to simulate 10-department impact & Monte-Carlo scenario bounds.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
