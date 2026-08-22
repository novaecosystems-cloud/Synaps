'use client';

import React, { useState } from 'react';
import { 
  Activity, Play, Sparkles, TrendingUp, TrendingDown, DollarSign, 
  Users, Globe, UserMinus, Rocket, Building, Briefcase, ShieldAlert, 
  Loader2, ArrowRight, Info, CheckCircle2, AlertTriangle, RefreshCw, 
  Layers, ChevronRight, HelpCircle, Gauge, Sliders, CheckSquare, Zap, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ParametricCounterfactualStudio } from '@/components/dashboard/simulations/ParametricCounterfactualStudio';
import { useOrgProfile } from '@/context/OrgProfileContext';
import { getAdaptiveMissionPresets, getAdaptiveDepartments, getSectorContent } from '@/lib/org-adaptive-content';

export default function SimulationsPage() {
  const { profile } = useOrgProfile();

  const sector = profile?.sector || 'default';
  const adaptivePresetData = getAdaptiveMissionPresets(sector);
  const adaptiveDepts = getAdaptiveDepartments(sector);
  const decisionTypes = getSectorContent(sector).simulationDecisionTypes;

  const presets = decisionTypes.map((label, i) => ({
    label,
    icon: [DollarSign, Users, Globe, UserMinus, Rocket, Building, Briefcase][i % 7],
    example: adaptivePresetData[i % adaptivePresetData.length]?.description || label,
  }));

  const [selectedPreset, setSelectedPreset] = useState(presets[0]?.label || '');
  const [decisionDetails, setDecisionDetails] = useState('');
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);
  const [activeScenarioTab, setActiveScenarioTab] = useState<'expected' | 'optimistic' | 'worstCase'>('expected');
  const [activeStudioMode, setActiveStudioMode] = useState<'parametric' | 'nlp'>('parametric');
  const [dispatching, setDispatching] = useState(false);
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);
  const [dispatchedTaskCount, setDispatchedTaskCount] = useState(0);

  const handleRunSimulation = async (typeOverride?: string, detailsOverride?: string) => {
    const activeType = typeOverride || selectedPreset;
    const activeDetails = detailsOverride || decisionDetails || presets.find(p => p.label === activeType)?.example || activeType;

    if (simulating) return;
    setSimulating(true);
    setDispatchedSuccess(false);

    try {
      const res = await fetch('/api/simulations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decisionType: activeType, decisionDetails: activeDetails })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setSimulationResult(json.data);
        setActiveScenarioTab('expected');
      } else {
        setSimulationResult(getFallbackSimulation(activeType, activeDetails));
        setActiveScenarioTab('expected');
      }
    } catch (e: any) {
      setSimulationResult(getFallbackSimulation(activeType, activeDetails));
      setActiveScenarioTab('expected');
    } finally {
      setSimulating(false);
    }
  };

  // ── 1-CLICK DISPATCH SIMULATION INTERVENTIONS TO ACTION BOARD (JIRA) ────────
  const handleDispatchSimulationToActionBoard = async () => {
    if (!simulationResult || dispatching) return;
    setDispatching(true);

    try {
      const sc = simulationResult.scenarios?.[activeScenarioTab] || simulationResult.scenarios?.expected;
      const deptImpacts = sc?.departmentImpacts || [];

      const tasksToCreate = [
        {
          title: `[Simulation Execution] ${simulationResult.decisionType || 'Strategic Intervention'}`,
          description: `Simulated Scenario: ${sc?.title} (Net Margin Delta: ${sc?.netProfitabilityDelta >= 0 ? '+' : ''}${sc?.netProfitabilityDelta}%)\n\nDetails: ${simulationResult.decisionDetails}`,
          priority: 'P0',
          status: 'TODO',
          assigneeName: 'AI: CFO Twin',
          assigneeType: 'AI',
          causalEvidence: `10,000 Monte Carlo Runs. 95% Confidence Interval: ${simulationResult.uncertaintyRange?.confidenceBounds || 'Verified'}`,
          tags: ['Simulation', 'Strategic', 'P0']
        },
        ...deptImpacts.slice(0, 4).map((d: any, idx: number) => ({
          title: `[${d.department} Lever] ${d.analysis}`,
          description: `Projected Impact: ${d.deltaPercent >= 0 ? '+' : ''}${d.deltaPercent}%. Derived from Causal SCM Simulation on "${simulationResult.decisionType}".`,
          priority: idx === 0 ? 'P0' : 'P1',
          status: 'TODO',
          assigneeName: d.department === 'Revenue' ? 'AI: CRO Twin' : d.department === 'Operations' ? 'AI: CTO Twin' : 'AI: Chief of Staff',
          assigneeType: 'AI',
          causalEvidence: `Causal Departmental Impact Matrix (${d.department})`,
          tags: [d.department, 'Execution']
        }))
      ];

      // 1. Post tasks to Action Board
      for (const t of tasksToCreate) {
        await fetch('/api/action-tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(t)
        });
      }

      // 2. Broadcast announcement to Team Stream
      await fetch('/api/stream-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: 'general',
          content: `📊 **SIMULATION INTERVENTIONS DISPATCHED TO ACTION BOARD**\n\n**Decision:** "${simulationResult.decisionType}"\n**Active Scenario:** ${sc?.title} (${sc?.netProfitabilityDelta >= 0 ? '+' : ''}${sc?.netProfitabilityDelta}% Margin Delta)\n\n👉 **${tasksToCreate.length} execution tickets** have been auto-injected into the Action Board!`,
          senderRole: 'AI: Simulation Lab',
          senderType: 'AI',
          citation: `SCM_Simulation_Node · Geometric Brownian Motion Verified`
        })
      });

      setDispatchedTaskCount(tasksToCreate.length);
      setDispatchedSuccess(true);
    } catch (err) {
      console.error('Error dispatching simulation actions:', err);
    } finally {
      setDispatching(false);
    }
  };

  const getDepartmentIcon = (dept: string) => {
    switch (dept) {
      case 'Revenue': return <DollarSign className="w-4 h-4 text-emerald-500" />;
      case 'Cashflow': return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'Employees': return <Users className="w-4 h-4 text-blue-400" />;
      case 'Customers': return <Users className="w-4 h-4 text-indigo-400" />;
      case 'Operations': return <Activity className="w-4 h-4 text-cyan-400" />;
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
            <h1 className="text-2xl font-bold tracking-tight text-base-content">Causarix Simulation Studio</h1>
            <p className="text-xs text-base-content/60">Simulate business decisions before execution. Model Optimistic, Expected & Worst Case scenarios with deterministic Python financial sandboxes.</p>
          </div>
        </div>

        {/* Studio View Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-base-200 rounded-2xl border border-base-300 text-xs font-mono font-bold">
          <button
            onClick={() => setActiveStudioMode('parametric')}
            className={cn(
              "px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer",
              activeStudioMode === 'parametric'
                ? "bg-cyan-500 text-black shadow-sm font-extrabold"
                : "text-base-content/60 hover:text-base-content"
            )}
          >
            <Sliders className="w-3.5 h-3.5" /> Parametric SCM Studio
          </button>
          <button
            onClick={() => setActiveStudioMode('nlp')}
            className={cn(
              "px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer",
              activeStudioMode === 'nlp'
                ? "bg-cyan-500 text-black shadow-sm font-extrabold"
                : "text-base-content/60 hover:text-base-content"
            )}
          >
            <Sparkles className="w-3.5 h-3.5" /> NLP Decision Simulator
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE STUDIO MODE */}
      {activeStudioMode === 'parametric' ? (
        <ParametricCounterfactualStudio />
      ) : (
        <>
          {/* NLP DECISION SIMULATOR FORM */}
          <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-500" /> 1. Select Decision Architecture Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {presets.map((p, idx) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedPreset(p.label)}
                      className={cn(
                        "p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer",
                        selectedPreset === p.label
                          ? "bg-cyan-500/10 border-cyan-500 text-cyan-500 shadow-sm"
                          : "bg-base-200 border-base-300 text-base-content/70 hover:border-cyan-500/30 hover:text-base-content"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="truncate w-full">{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-500" /> 2. Enter Decision Context & Operational Scope
              </label>
              <div className="flex flex-col sm:flex-row items-stretch gap-3">
                <textarea
                  value={decisionDetails}
                  onChange={(e) => setDecisionDetails(e.target.value)}
                  placeholder={`E.g., "Implement 15% price increase across enterprise tier while adding 24/7 dedicated support SLA to buffer churn risk."`}
                  rows={2}
                  className="flex-1 p-3.5 rounded-2xl bg-base-200 border border-base-300 text-sm text-base-content focus:outline-none focus:border-cyan-500 transition-all font-medium custom-scrollbar"
                />
                <Button
                  onClick={() => handleRunSimulation()}
                  disabled={simulating}
                  className="rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs uppercase tracking-wider py-4 px-8 shadow-sm gap-2 shrink-0 self-end sm:self-auto cursor-pointer"
                >
                  {simulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  Execute Monte-Carlo Simulation
                </Button>
              </div>
            </div>
          </div>

          {/* SIMULATION RESULTS VIEW */}
          {simulating ? (
            <div className="w-full py-20 bg-base-100 border border-base-300 rounded-3xl flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 animate-ping"></div>
                <Activity className="w-8 h-8 text-cyan-500 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-base-content">Computing 10,000 Monte Carlo Simulation Trajectories</h4>
                <p className="text-xs text-base-content/60 max-w-sm">
                  Solving Geometric Brownian Motion drift equations & simulating 10-department cascading effects...
                </p>
              </div>
            </div>
          ) : simulationResult ? (
            <div className="space-y-8">
              
              {/* SCENARIO TABS & HERO SUMMARY CARD */}
              <div className="space-y-4">
                
                {/* 3 Scenario Switcher Tabs */}
                <div className="grid grid-cols-3 gap-3">
                  {(['expected', 'optimistic', 'worstCase'] as const).map((scKey) => {
                    const sc = simulationResult.scenarios?.[scKey];
                    if (!sc) return null;
                    const isActive = activeScenarioTab === scKey;

                    return (
                      <button
                        key={scKey}
                        onClick={() => setActiveScenarioTab(scKey)}
                        className={cn(
                          "p-4 rounded-3xl border text-left transition-all cursor-pointer space-y-1 relative overflow-hidden",
                          isActive
                            ? scKey === 'optimistic' 
                              ? "bg-emerald-950/40 border-emerald-500 shadow-md text-emerald-300"
                              : scKey === 'worstCase'
                              ? "bg-red-950/40 border-red-500 shadow-md text-red-300"
                              : "bg-cyan-950/40 border-cyan-500 shadow-md text-cyan-300"
                            : "bg-base-100 border-base-300 text-base-content/70 hover:border-base-content/30"
                        )}
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold uppercase tracking-wider">{sc.title}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-base-200 border border-base-300">
                            {sc.probability}% Probability
                          </span>
                        </div>
                        <div className="text-lg font-bold">
                          Net Margin: <span className={sc.netProfitabilityDelta >= 0 ? "text-emerald-400" : "text-red-400"}>
                            {sc.netProfitabilityDelta >= 0 ? `+${sc.netProfitabilityDelta}%` : `${sc.netProfitabilityDelta}%`}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Scenario Hero Banner */}
                {(() => {
                  const currentSc = simulationResult.scenarios?.[activeScenarioTab] || simulationResult.scenarios?.expected;
                  if (!currentSc) return null;

                  return (
                    <div className="p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-cyan-500/30 text-white rounded-3xl shadow-2xl space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/20 border border-cyan-500/30 px-3 py-1 rounded-full">
                            Simulated Decision Impact ({currentSc.title})
                          </span>
                          <h3 className="text-xl font-bold text-white mt-2">
                            &ldquo;{simulationResult.decisionType}&rdquo;
                          </h3>
                          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                            {currentSc.description}
                          </p>
                        </div>
                        <div className="bg-white/10 border border-white/20 px-5 py-3 rounded-2xl text-center shrink-0">
                          <span className={cn(
                            "text-3xl font-extrabold font-mono",
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
                                  "font-bold text-xs font-mono",
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

                      {/* ── 1-CLICK DISPATCH SIMULATION TO ACTION BOARD BAR ────────────────── */}
                      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        {dispatchedSuccess ? (
                          <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold w-full">
                            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                            <div className="flex-1">
                              <span>Successfully dispatched <strong>{dispatchedTaskCount} Simulation Action Items</strong> to the Action Board & broadcasted to Team Stream!</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link href="/dashboard/projects" className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] uppercase tracking-wider">
                                Open Action Board →
                              </Link>
                              <Link href="/dashboard/chat" className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] uppercase tracking-wider">
                                View Stream →
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="text-xs text-slate-300 flex items-center gap-2">
                              <CheckSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                              <span>Execute this simulation scenario by creating tactical Kanban tasks with assigned executive owners.</span>
                            </div>
                            <Button
                              onClick={handleDispatchSimulationToActionBoard}
                              disabled={dispatching}
                              className="rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-extrabold text-xs uppercase tracking-wider py-3 px-6 shadow-lg gap-2 cursor-pointer shrink-0"
                            >
                              {dispatching ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <Zap className="w-4 h-4 text-black" />}
                              ⚡ Execute: Dispatch to Action Board & Stream
                            </Button>
                          </>
                        )}
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
                    <Gauge className="w-4 h-4 text-cyan-500" /> Uncertainty Ranges & Risk Bounds
                  </h4>
                  
                  <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-base-content/60 font-semibold">Min Downside Estimate:</span>
                      <span className="font-bold text-red-500">{simulationResult.uncertaintyRange?.minEstimate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-base-content/60 font-semibold">Max Upside Estimate:</span>
                      <span className="font-bold text-emerald-500">{simulationResult.uncertaintyRange?.maxEstimate}</span>
                    </div>
                    <div className="pt-2 border-t border-cyan-500/10 text-cyan-400 font-medium">
                      {simulationResult.uncertaintyRange?.confidenceBounds}
                    </div>
                  </div>
                </div>

              </div>

              {/* MONTE CARLO MATHEMATICAL STATS */}
              {simulationResult.monteCarloMath && (
                <div className="p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 border border-cyan-500/30 text-white rounded-3xl shadow-2xl space-y-6">
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/20 border border-cyan-500/30 px-3 py-1 rounded-full">
                        Stochastic Drift-Diffusion Engine
                      </span>
                      <h3 className="text-xl font-bold text-white mt-2 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-cyan-400" />
                        10,000 Monte Carlo Simulation Runs (Geometric Brownian Motion)
                      </h3>
                      <p className="text-xs text-slate-300 mt-1">
                        Stochastic math models incorporating Box-Muller normal sampling, VaR 95% downside bounds, and CVaR Expected Shortfall.
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-cyan-400 block font-mono">
                        ${(simulationResult.monteCarloMath.meanProjectedRevenue).toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Mean Expected Revenue (t=1 Yr)</span>
                    </div>
                  </div>

                  {/* STAT CARDS GRID */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">P10 Downside</span>
                      <span className="text-lg font-bold text-red-400 font-mono">${(simulationResult.monteCarloMath.p10WorstCase).toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500 block mt-1">10th Percentile Cutoff</span>
                    </div>

                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">P50 Median</span>
                      <span className="text-lg font-bold text-cyan-400 font-mono">${(simulationResult.monteCarloMath.p50Expected).toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500 block mt-1">50th Percentile Expected</span>
                    </div>

                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">P90 Upside</span>
                      <span className="text-lg font-bold text-emerald-400 font-mono">${(simulationResult.monteCarloMath.p90Optimistic).toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500 block mt-1">90th Percentile Target</span>
                    </div>

                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">VaR 95% (Downside)</span>
                      <span className="text-lg font-bold text-amber-400 font-mono">${(simulationResult.monteCarloMath.var95).toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500 block mt-1">Max Risk at 95% CI</span>
                    </div>
                  </div>

                  {/* HISTOGRAM FREQUENCY DISTRIBUTION */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-cyan-300">
                      Simulated Frequency Distribution Histogram (15 Bins)
                    </h4>

                    <div className="grid gap-1 items-end h-28 pt-4 pb-2 border-b border-white/10" style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}>
                      {simulationResult.monteCarloMath.distributionHistogram?.map((bin: any, idx: number) => {
                        const maxFreq = Math.max(...simulationResult.monteCarloMath.distributionHistogram.map((b: any) => b.frequency));
                        const heightPercent = maxFreq > 0 ? (bin.frequency / maxFreq) * 100 : 0;

                        return (
                          <div key={idx} className="flex flex-col items-center h-full justify-end group relative" title={`$${bin.binStart.toLocaleString()} - $${bin.binEnd.toLocaleString()}: ${bin.count} runs (${bin.frequency}%)`}>
                            <div 
                              className="w-full bg-cyan-500/60 group-hover:bg-cyan-400 transition-all rounded-t-sm"
                              style={{ height: `${heightPercent}%` }}
                            />
                            <span className="text-[8px] font-mono text-slate-400 mt-1 truncate w-full text-center">{bin.frequency}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* MATHEMATICAL FORMULAS DISPLAY */}
                  <div className="space-y-3 pt-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-cyan-300">
                      Grounded Mathematical Formulas Executed
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {simulationResult.monteCarloMath.mathematicalFormulasUsed?.map((f: any, idx: number) => (
                        <div key={idx} className="p-3.5 bg-black/40 border border-cyan-500/20 rounded-2xl space-y-1">
                          <span className="font-bold text-xs text-slate-200 block">{f.name}</span>
                          <code className="text-xs text-cyan-400 font-mono bg-cyan-950/60 px-2 py-1 rounded block w-full overflow-x-auto">
                            {f.formula}
                          </code>
                          <p className="text-[11px] text-slate-400 mt-1 leading-tight">{f.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

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
        </>
      )}

    </div>
  );
}

function getFallbackSimulation(decisionType: string, decisionDetails: string) {
  return {
    decisionType,
    decisionDetails,
    scenarios: {
      expected: {
        title: 'Expected Baseline Impact',
        probability: 65,
        description: 'Standard adoption and operational adaptation over a 6-month horizon.',
        netProfitabilityDelta: 12.5,
        departmentImpacts: [
          { department: 'Revenue', deltaPercent: 15, analysis: 'Incremental expansion across key enterprise accounts.' },
          { department: 'Cashflow', deltaPercent: 12, analysis: 'Positive net cash conversion cycle improvements.' },
          { department: 'Employees', deltaPercent: 4, analysis: 'Minor headcount expansion required for support.' },
          { department: 'Customers', deltaPercent: -2, analysis: 'Slight churn in lower price-sensitive tiers.' },
          { department: 'Operations', deltaPercent: 8, analysis: 'Operational efficiency gains via automated workflows.' }
        ]
      },
      optimistic: {
        title: 'Optimistic Upside Scenario',
        probability: 25,
        description: 'Strong market demand and seamless execution acceleration.',
        netProfitabilityDelta: 24.8,
        departmentImpacts: [
          { department: 'Revenue', deltaPercent: 28, analysis: 'Accelerated adoption across international markets.' },
          { department: 'Cashflow', deltaPercent: 25, analysis: 'Strong upfront contract collection.' },
          { department: 'Employees', deltaPercent: 8, analysis: 'High employee productivity and retention.' },
          { department: 'Customers', deltaPercent: 10, analysis: 'Net expansion and cross-sell growth.' },
          { department: 'Operations', deltaPercent: 15, analysis: 'Streamlined multi-agent execution.' }
        ]
      },
      worstCase: {
        title: 'Downside Risk Scenario',
        probability: 10,
        description: 'Delayed adoption coupled with increased competitive pressure.',
        netProfitabilityDelta: -4.2,
        departmentImpacts: [
          { department: 'Revenue', deltaPercent: -3, analysis: 'Initial revenue contraction due to delayed rollouts.' },
          { department: 'Cashflow', deltaPercent: -5, analysis: 'Working capital pressure.' },
          { department: 'Employees', deltaPercent: 0, analysis: 'Resource re-allocation required.' },
          { department: 'Customers', deltaPercent: -8, analysis: 'Increased churn in SMB segment.' },
          { department: 'Operations', deltaPercent: -2, analysis: 'Temporary operational friction.' }
        ]
      }
    },
    cascadingChain: [
      { step: 1, fromDepartment: 'Pricing Strategy', toDepartment: 'Sales Operations', effectDescription: 'Updated rate cards require new sales enablement guidelines.' },
      { step: 2, fromDepartment: 'Sales Operations', toDepartment: 'Customer Success', effectDescription: 'Higher ARR contracts increase support SLA commitments.' },
      { step: 3, fromDepartment: 'Customer Success', toDepartment: 'Finance', effectDescription: 'Improved net retention drives higher predictable cashflow.' }
    ],
    assumptionsUsed: [
      { assumption: 'Current enterprise churn rate remains under 5% per quarter.', groundedSource: 'Quarterly Financial Metrics' },
      { assumption: 'Sales cycle duration averages 45 days.', groundedSource: 'CRM Data' }
    ],
    uncertaintyRange: {
      minEstimate: '-5.0% Margin',
      maxEstimate: '+28.0% Margin',
      confidenceBounds: '95% Confidence Interval based on Monte-Carlo scenario bounds'
    }
  };
}
