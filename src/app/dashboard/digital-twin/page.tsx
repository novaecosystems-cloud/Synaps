'use client';

import React, { useState, useEffect } from 'react';
import { 
  Cpu, Sparkles, Activity, ShieldAlert, Layers, Building2, 
  Users, FolderKanban, Truck, Mic, FileText, Scale, Lock, 
  DollarSign, AlertTriangle, Zap, Compass, CheckCircle2, 
  Loader2, ArrowRight, RefreshCw, ChevronRight, Flame, ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DigitalTwinPage() {
  const [twinState, setTwinState] = useState<any | null>(null);
  const [loadingState, setLoadingState] = useState(true);
  const [disruptionQuery, setDisruptionQuery] = useState('');
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<any | null>(null);

  const presetShocks = [
    "What happens if our largest customer leaves?",
    "What breaks if this supplier fails?",
    "What if we hire 50 engineers?",
    "What if we merge departments?",
    "What if revenue drops by 30%?"
  ];

  const fetchTwinState = async () => {
    setLoadingState(true);
    try {
      const res = await fetch('/api/digital-twin/state');
      const json = await res.json();
      if (json.success) {
        setTwinState(json.data);
      }
    } catch (e: any) {
      console.error("Error fetching twin state:", e);
    } finally {
      setLoadingState(false);
    }
  };

  useEffect(() => {
    fetchTwinState();
  }, []);

  const handleSimulateShock = async (queryText?: string) => {
    const activeQuery = queryText || disruptionQuery;
    if (!activeQuery.trim() || simulating) return;
    setSimulating(true);

    try {
      const res = await fetch('/api/digital-twin/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disruptionQuery: activeQuery })
      });
      const json = await res.json();
      if (json.success) {
        setSimResult(json.data);
      } else {
        alert(`Digital Twin Simulation Error: ${json.error}`);
      }
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setSimulating(false);
    }
  };

  const getNodeIcon = (category: string) => {
    switch (category) {
      case 'DEPARTMENTS': return <Building2 className="w-5 h-5 text-indigo-400" />;
      case 'EMPLOYEES': return <Users className="w-5 h-5 text-blue-400" />;
      case 'PROJECTS': return <FolderKanban className="w-5 h-5 text-teal-400" />;
      case 'CUSTOMERS': return <Building2 className="w-5 h-5 text-emerald-400" />;
      case 'SUPPLIERS': return <Truck className="w-5 h-5 text-amber-400" />;
      case 'MEETINGS': return <Mic className="w-5 h-5 text-purple-400" />;
      case 'POLICIES': return <FileText className="w-5 h-5 text-cyan-400" />;
      case 'CONTRACTS': return <FileText className="w-5 h-5 text-yellow-400" />;
      case 'ASSETS': return <Cpu className="w-5 h-5 text-sky-400" />;
      case 'KNOWLEDGE': return <Layers className="w-5 h-5 text-indigo-400" />;
      case 'FINANCE': return <DollarSign className="w-5 h-5 text-emerald-400" />;
      case 'RISKS': return <ShieldAlert className="w-5 h-5 text-red-400" />;
      case 'PROCESSES': return <Zap className="w-5 h-5 text-orange-400" />;
      case 'STRATEGIES': return <Compass className="w-5 h-5 text-amber-400" />;
      case 'DECISIONS': return <Scale className="w-5 h-5 text-rose-400" />;
      default: return <Cpu className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="w-full space-y-8 font-sans pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-base-content">Enterprise Digital Twin OS</h1>
            <p className="text-xs text-base-content/60">Interconnected company operating system uniting 15 system nodes & multi-agent intelligence.</p>
          </div>
        </div>

        <Link href="/dashboard/graph" className="btn btn-outline btn-sm rounded-2xl gap-2 border-indigo-500/30 text-indigo-500 hover:bg-indigo-500/10">
          <Layers className="w-4 h-4" /> 3D Memory Graph
        </Link>
      </div>

      {/* TELEMETRY HERO BANNER */}
      {loadingState ? (
        <div className="w-full py-16 flex flex-col items-center justify-center text-base-content">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
          <p className="text-sm font-medium">Synchronizing 15 Enterprise Digital Twin Nodes...</p>
        </div>
      ) : twinState && (
        <div className="p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white rounded-3xl shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 rounded-full">
                Real-Time Company Operating System
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-2">Unified Enterprise Intelligence Layer</h2>
            </div>

            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-3 rounded-2xl">
              <div className="text-center pr-4 border-r border-white/10">
                <span className="text-3xl font-extrabold text-indigo-400">{twinState.resiliencyScore}%</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Resiliency Index</span>
              </div>
              <div className="text-center pr-4 border-r border-white/10">
                <span className="text-2xl font-bold text-emerald-400">15 / 15</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Active System Nodes</span>
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-white">{twinState.activeEntitiesCount}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Graph Entities</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            Synaps Digital Twin models organizational dependencies between Departments, Employees, Projects, Customers, Suppliers, Meetings, Policies, Contracts, Assets, Knowledge, Finance, Risks, Processes, Strategies, and Decisions.
          </p>
        </div>
      )}

      {/* DISRUPTION & SHOCK SIMULATOR BAR */}
      <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
        <label className="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-500" /> Digital Twin Company Disruption Simulator
        </label>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={disruptionQuery}
            onChange={(e) => setDisruptionQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSimulateShock()}
            placeholder="e.g. What happens if our largest customer leaves?"
            className="flex-1 bg-base-200 border border-base-300 rounded-2xl px-4 py-3 text-sm text-base-content outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <Button onClick={() => handleSimulateShock()} disabled={simulating || !disruptionQuery.trim()} className="rounded-2xl gap-2 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
            {simulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {simulating ? 'Simulating Shockwave...' : 'Simulate Disruption'}
          </Button>
        </div>

        {/* Preset Shocks */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-bold text-base-content/40 uppercase">Try Company Shocks:</span>
          {presetShocks.map((shock, idx) => (
            <button
              key={idx}
              onClick={() => { setDisruptionQuery(shock); handleSimulateShock(shock); }}
              className="text-xs px-3 py-1 rounded-full bg-base-200 hover:bg-indigo-500/10 border border-base-300 hover:border-indigo-500/30 text-base-content/70 hover:text-indigo-400 transition-all text-left"
            >
              "{shock}"
            </button>
          ))}
        </div>
      </div>

      {/* DISRUPTION SIMULATION RESULTS */}
      {simulating ? (
        <div className="w-full py-20 bg-base-100 border border-base-300 rounded-3xl flex flex-col items-center justify-center space-y-4">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping"></div>
            <Cpu className="w-10 h-10 text-indigo-500 animate-pulse" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-base-content">Simulating Cascading Organizational Domino Shockwave...</h3>
            <p className="text-xs text-base-content/60 max-w-sm mx-auto">
              Evaluating financial delta, departmental domino chains, risk escalation, and executive board verdict.
            </p>
          </div>
        </div>
      ) : simResult && (
        <div className="space-y-6">
          
          {/* SIMULATION SUMMARY HERO */}
          <div className="p-8 bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 border border-rose-500/30 text-white rounded-3xl shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/20 border border-rose-500/30 px-3 py-1 rounded-full">
                  Digital Twin Shock Simulation
                </span>
                <h2 className="text-2xl font-bold text-white mt-2">"{simResult.disruptionQuery}"</h2>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-rose-400 block">{simResult.financialShock}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Financial Shock Delta</span>
              </div>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-medium bg-white/5 p-4 rounded-2xl border border-white/10">
              {simResult.immediateImpact}
            </p>

            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-300 space-y-1">
              <span className="font-bold uppercase tracking-wider block text-[10px]">Executive Board Verdict</span>
              <p className="font-medium text-white">{simResult.executiveVerdict}</p>
            </div>
          </div>

          {/* CASCADING DOMINO IMPACT & PLAYBOOK GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Departmental Cascades */}
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-4 shadow-sm">
              <h3 className="font-bold text-base text-base-content flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-500" /> Departmental Domino Cascade Chain
              </h3>

              <div className="space-y-3">
                {simResult.departmentCascades?.map((step: any, idx: number) => (
                  <div key={idx} className="p-4 bg-base-200 border border-base-300 rounded-2xl text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-indigo-500">Step {step.step}: {step.departmentNode}</span>
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                        step.severity === 'CRITICAL' ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                      )}>
                        {step.severity}
                      </span>
                    </div>
                    <p className="text-base-content/80 font-medium">{step.dominoEffect}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Executable Mitigation Playbook */}
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-4 shadow-sm">
              <h3 className="font-bold text-base text-base-content flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> Executable Mitigation Playbook
              </h3>

              <div className="space-y-3">
                {simResult.mitigationPlaybook?.map((step: any, idx: number) => (
                  <div key={idx} className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-emerald-400">Step {step.actionStep}: {step.title}</span>
                      <span className="text-[10px] font-bold text-base-content/50 uppercase">{step.timeline}</span>
                    </div>
                    <p className="text-base-content/90">{step.description}</p>
                    <span className="text-[10px] font-bold text-emerald-500 block pt-1">Owner: {step.ownerRole}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 15 SYSTEM NODES MATRIX GRID */}
      {twinState && (
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-500" /> 15 Interconnected System Nodes
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {twinState.nodes?.map((node: any) => (
              <div 
                key={node.id}
                className="bg-base-100 border border-base-300 hover:border-indigo-500/40 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="p-2 rounded-xl bg-base-200 border border-base-300">
                      {getNodeIcon(node.category)}
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {node.healthStatus}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-base-content">{node.name}</h4>
                    <span className="text-xl font-extrabold text-indigo-500 block">{node.count}</span>
                  </div>

                  <p className="text-[11px] text-base-content/60 line-clamp-2 leading-relaxed">
                    {node.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-base-200 text-[10px] font-bold text-indigo-500 flex items-center justify-between">
                  <span>System Telemetry</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
