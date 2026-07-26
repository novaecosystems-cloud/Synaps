'use client';

import React, { useState, useEffect } from 'react';
import { 
  Cpu, Sparkles, Activity, ShieldAlert, Layers, Building2, 
  Users, FolderKanban, Truck, Mic, FileText, Scale, Lock, 
  DollarSign, AlertTriangle, Zap, Compass, CheckCircle2, 
  Loader2, ArrowRight, RefreshCw, ChevronRight, Flame, ShieldCheck, UserCheck, FileCheck, Send, Check
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

  // Digital Twin Clone State
  const [cloneProfile, setCloneProfile] = useState<any | null>(null);
  const [cloneScenario, setCloneScenario] = useState('');
  const [simulatingClone, setSimulatingClone] = useState(false);
  const [cloneResponse, setCloneResponse] = useState('');

  // Contract Redlining State
  const [contractText, setContractText] = useState('');
  const [redlining, setRedlining] = useState(false);
  const [redlineResult, setRedlineResult] = useState<any | null>(null);

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

      const cloneRes = await fetch('/api/digital-twin/clone');
      const cloneJson = await cloneRes.json();
      if (cloneJson.success) {
        setCloneProfile(cloneJson.profile);
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

  const handleSimulateClone = async () => {
    if (!cloneScenario.trim() || simulatingClone) return;
    setSimulatingClone(true);
    setCloneResponse('');

    try {
      const res = await fetch('/api/digital-twin/clone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'simulate_decision', scenario: cloneScenario })
      });
      const json = await res.json();
      if (json.success) {
        setCloneResponse(json.decisionResponse);
      } else {
        alert(`Clone Simulation Error: ${json.error}`);
      }
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setSimulatingClone(false);
    }
  };

  const handleRunRedline = async () => {
    if (!contractText.trim() || redlining) return;
    setRedlining(true);
    setRedlineResult(null);

    try {
      const res = await fetch('/api/documents/redline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Uploaded Contract', content: contractText })
      });
      const json = await res.json();
      if (json.success) {
        setRedlineResult(json.data);
      } else {
        alert(`Redline Error: ${json.error}`);
      }
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setRedlining(false);
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
            <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
              Digital Twin OS & Policy Memory Engine
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                Enterprise Ready
              </span>
            </h1>
            <p className="text-xs text-base-content/60 max-w-2xl">
              An AI system that learns from your organization's historical decisions and provides recommendations consistent with your documented policies and past actions.
            </p>
          </div>
        </div>

        <button
          onClick={fetchTwinState}
          className="px-4 py-2 bg-base-200 hover:bg-base-300 rounded-xl text-xs font-bold text-base-content/70 flex items-center gap-2 transition-all"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loadingState && "animate-spin")} /> Refresh Memory
        </button>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ORGANIZATIONAL DECISION & POLICY MEMORY ENGINE */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="p-6 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-base-100 border-2 border-indigo-500/30 rounded-3xl space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-black text-sm">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-base-content">
                Historical Decision & Policy Alignment Engine ({cloneProfile?.founderName || 'Executive Lead'})
              </h2>
              <p className="text-xs text-base-content/60">
                Learns from documented policies, historical decisions, and risk management guidelines to ensure consistent executive recommendations.
              </p>
            </div>
          </div>

          <span className="text-[10px] font-extrabold uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Policy Memory Active
          </span>
        </div>

        {/* Policy Memory Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-base-100/60 rounded-2xl border border-base-300">
          <div>
            <span className="text-[10px] uppercase font-bold text-base-content/40">Risk Alignment</span>
            <p className="text-xs font-extrabold text-indigo-400 mt-0.5">{cloneProfile?.riskTolerance || 'BALANCED'}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-base-content/40">Policy Tone</span>
            <p className="text-xs font-extrabold text-purple-400 mt-0.5">{cloneProfile?.communicationStyle || 'DIRECT & DATA-DRIVEN'}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-base-content/40">Core Governance Constraint</span>
            <p className="text-xs font-bold text-emerald-400 mt-0.5 truncate">{cloneProfile?.customDirectives || 'Zero compromise on legal safety & line-level citations.'}</p>
          </div>
        </div>

        {/* Policy Query Simulator */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-extrabold text-base-content flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Query organizational memory for policy-aligned recommendations:
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={cloneScenario}
              onChange={e => setCloneScenario(e.target.value)}
              placeholder="e.g. A key vendor demands a 20% price hike or threatens to terminate next week. What is our documented policy recommendation?"
              className="flex-1 bg-base-100 border border-base-300 rounded-2xl px-4 py-3 text-xs text-base-content outline-none focus:ring-2 focus:ring-indigo-500/30"
              onKeyDown={e => e.key === 'Enter' && handleSimulateClone()}
            />
            <button
              onClick={handleSimulateClone}
              disabled={!cloneScenario.trim() || simulatingClone}
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl flex items-center gap-2 transition-all shadow-md disabled:opacity-40"
            >
              {simulatingClone ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {simulatingClone ? 'Analyzing Policy...' : 'Evaluate Policy'}
            </button>
          </div>

          {cloneResponse && (
            <div className="p-5 bg-base-100 border border-indigo-500/30 rounded-2xl space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-extrabold text-indigo-400 border-b border-base-200 pb-2">
                <span>Documented Policy & Historical Decision Analysis</span>
                <span className="text-[10px] text-base-content/40 font-mono">MEMORY-ENGINE-v2</span>
              </div>
              <p className="text-xs text-base-content/80 leading-relaxed white-space-pre-wrap font-sans">
                {cloneResponse}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 1-CLICK CONTRACT REDLINER */}
      <div className="p-6 bg-gradient-to-br from-amber-500/10 via-red-500/5 to-base-100 border-2 border-amber-500/30 rounded-3xl space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-sm">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-base-content">
                1-Click Instant Contract Redliner & Risk Fixer
              </h2>
              <p className="text-xs text-base-content/60">Paste any vendor contract or clause to auto-detect predatory terms and generate safer redlined counter-clauses.</p>
            </div>
          </div>

          <span className="text-[10px] font-extrabold uppercase text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            Legal AI Active
          </span>
        </div>

        <div className="space-y-3">
          <textarea
            rows={3}
            value={contractText}
            onChange={e => setContractText(e.target.value)}
            placeholder="Paste contract text or vendor terms here to auto-redline... (or leave blank to test demo vendor contract)"
            className="w-full bg-base-100 border border-base-300 rounded-2xl p-4 text-xs text-base-content outline-none focus:ring-2 focus:ring-amber-500/30 font-mono"
          />

          <button
            onClick={handleRunRedline}
            disabled={redlining}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-40"
          >
            {redlining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-black" />}
            {redlining ? 'Analyzing & Redlining Contract...' : '⚡ Auto-Redline & Fix Contract Risks'}
          </button>
        </div>

        {redlineResult && (
          <div className="p-5 bg-base-100 border border-amber-500/30 rounded-2xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-base-200 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-base-content">{redlineResult.contractTitle}</h3>
                <p className="text-xs text-base-content/60 mt-0.5">{redlineResult.riskSummary}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${redlineResult.overallRiskRating === 'HIGH' ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'}`}>
                Risk: {redlineResult.overallRiskRating}
              </span>
            </div>

            <div className="space-y-3">
              {redlineResult.redlines?.map((item: any, i: number) => (
                <div key={i} className="p-4 bg-base-200/50 rounded-xl space-y-2 border border-base-300">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-500">{item.clauseNumber} — {item.clauseType}</span>
                    <span className="text-[10px] font-extrabold text-red-400 uppercase bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">{item.severity}</span>
                  </div>

                  <div className="text-xs font-mono p-2.5 bg-red-500/10 border-l-4 border-red-500 text-red-400 rounded-r">
                    ❌ <strong>Original:</strong> "{item.originalText}"
                  </div>

                  <div className="text-xs font-mono p-2.5 bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-400 rounded-r">
                    ✅ <strong>Proposed Redline:</strong> "{item.redlinedRevision}"
                  </div>

                  <p className="text-[11px] text-base-content/60 italic">
                    💡 Legal Rationale: {item.legalRationale}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* DISRUPTION SHOCK ENGINE SECTION */}
      <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-4">
        <h2 className="text-base font-extrabold text-base-content flex items-center gap-2">
          <Flame className="w-5 h-5 text-red-500" />
          Organizational Disruption Shock Engine
        </h2>

        <div className="flex gap-2 flex-wrap">
          {presetShocks.map((preset, i) => (
            <button
              key={i}
              onClick={() => { setDisruptionQuery(preset); handleSimulateShock(preset); }}
              className="text-xs bg-base-200 hover:bg-indigo-500/10 border border-base-300 hover:border-indigo-500/30 text-base-content/70 hover:text-indigo-400 px-3 py-1.5 rounded-xl transition-all font-medium"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
