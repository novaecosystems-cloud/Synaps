'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, Radio, Sparkles, ShieldCheck, FileText, Database, 
  TrendingUp, Scale, Cpu, Zap, RefreshCw, CheckCircle2, ChevronRight, X, Loader2, Info, Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ActiveKnowledgeSelector } from '@/components/ActiveKnowledgeSelector';

export default function DigitalTwinClient() {
  const [twins, setTwins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulation State
  const [scenarioPrompt, setScenarioPrompt] = useState('');
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);
  const [selectedTwin, setSelectedTwin] = useState<any | null>(null);

  const presetScenarios = [
    "Should we acquire competitor X for $12M to expand market share?",
    "Should we launch an enterprise sales office in London for Q4?",
    "Should we transition pricing from seat-based to usage-based AI consumption?"
  ];

  useEffect(() => {
    async function fetchTwins() {
      try {
        const res = await fetch('/api/digital-twin/list');
        const json = await res.json();
        if (json.success) {
          setTwins(json.data);
        }
      } catch (e) {
        console.error("Failed to load Digital Twins:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchTwins();
  }, []);

  const handleRunSimulation = async (customPrompt?: string) => {
    const p = customPrompt || scenarioPrompt;
    if (!p.trim() || simulating) return;

    setSimulating(true);
    try {
      const res = await fetch('/api/digital-twin/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioPrompt: p })
      });
      const json = await res.json();
      if (json.success) {
        setSimulationResult(json.data);
      }
    } catch (e) {
      console.error("Simulation error:", e);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="w-full space-y-8 font-sans pb-20 text-base-content">
      
      {/* ── HEADER BANNER ────────────────────────────────────────── */}
      <div className="p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/30 text-white rounded-3xl shadow-2xl space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
          <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Executive Digital Twin Platform
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
          Executive Digital Twins & Boardroom Simulation Engine
        </h1>
        <p className="text-xs text-indigo-200/70 max-w-3xl leading-relaxed">
          Simulate strategic decisions across your C-suite (CEO, CFO, CTO, COO, Legal, Sales, Marketing, HR). Every twin grounds recommendations in historical company memory, documents, and risk tolerances without hallucination.
        </p>
      </div>

      {/* Active Knowledge Selector Bar */}
      <ActiveKnowledgeSelector />

      {/* ── MULTI-TWIN BOARDROOM SIMULATION STAGE ────────────────────── */}
      <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
        <h3 className="font-bold text-sm uppercase tracking-wider text-base-content/60 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" /> Run Executive Boardroom Simulation
        </h3>

        <div className="space-y-3">
          <textarea
            value={scenarioPrompt}
            onChange={(e) => setScenarioPrompt(e.target.value)}
            rows={3}
            placeholder="Enter Strategic Enterprise Scenario (e.g. Should we launch an enterprise sales office in London for Q4?)..."
            className="w-full bg-base-200 border border-base-300 rounded-2xl p-4 text-sm text-base-content outline-none focus:ring-2 focus:ring-indigo-500/20 custom-scrollbar resize-none font-medium"
          />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-base-content/40 uppercase">Scenario Presets:</span>
              {presetScenarios.map((sc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setScenarioPrompt(sc);
                    handleRunSimulation(sc);
                  }}
                  className="text-xs px-3 py-1 rounded-full bg-base-200 hover:bg-indigo-500/10 border border-base-300 hover:border-indigo-500/30 text-base-content/70 hover:text-indigo-400 transition-all text-left"
                >
                  "{sc.slice(0, 35)}..."
                </button>
              ))}
            </div>

            <Button onClick={() => handleRunSimulation()} disabled={simulating} className="rounded-2xl px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider gap-2 shadow-lg shrink-0">
              {simulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Radio className="w-4 h-4" />}
              {simulating ? 'Simulating C-Suite Consensus...' : 'Run Boardroom Simulation'}
            </Button>
          </div>
        </div>
      </div>

      {/* ── SIMULATION VERDICT & SIDE-BY-SIDE PANEL ────────────────── */}
      {simulationResult && (
        <div className="space-y-6">
          {/* Executive Verdict Banner */}
          <div className="p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/40 text-white rounded-3xl shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-sm text-indigo-300 uppercase tracking-wider">Executive Boardroom Consensus Verdict</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {simulationResult.consensusScore}% Panel Alignment
              </span>
            </div>

            <div className="text-sm leading-relaxed text-slate-200 whitespace-pre-wrap font-sans">
              {simulationResult.synthesizedRecommendation}
            </div>
          </div>

          {/* Side-by-Side Twin Opinions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {simulationResult.executiveOpinions?.map((opinion: any, idx: number) => (
              <div key={idx} className="p-5 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                      {opinion.role} TWIN
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">{opinion.confidenceScore}% Conf.</span>
                  </div>

                  <h4 className="font-bold text-sm text-base-content">{opinion.name}</h4>
                  <p className="text-xs text-base-content/80 leading-relaxed font-sans">{opinion.recommendation}</p>
                </div>

                <div className="pt-2 border-t border-base-200 space-y-1.5 text-xs">
                  <div className="bg-base-200/50 p-2 rounded-xl border border-base-300/50 text-[11px] text-base-content/70">
                    <strong>Evidence:</strong> {opinion.supportingEvidence}
                  </div>
                  <div className="text-[11px] font-mono text-indigo-400">
                    ⚡ {opinion.suggestedActions?.[0] || 'Schedule review'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 8 EXECUTIVE DIGITAL TWINS FLEET GRID ─────────────────────── */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" /> Active Executive Digital Twins Fleet ({twins.length} Personas)
          </h3>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">GROUNDED MEMORY ACTIVE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {twins.map((twin) => (
            <div 
              key={twin.id}
              onClick={() => setSelectedTwin(twin)}
              className="p-5 bg-base-100 border border-base-300 hover:border-indigo-500/40 rounded-3xl shadow-sm transition-all cursor-pointer space-y-3 flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                    {twin.role}
                  </span>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border font-mono",
                    twin.riskTolerance === 'AGGRESSIVE' && "bg-rose-500/10 text-rose-300 border-rose-500/20",
                    twin.riskTolerance === 'MODERATE' && "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
                    twin.riskTolerance === 'CONSERVATIVE' && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  )}>
                    {twin.riskTolerance} RISK
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-base-content group-hover:text-indigo-400 transition-colors">{twin.title}</h4>
                  <span className="text-[11px] text-base-content/50 block line-clamp-1">{twin.leadershipStyle}</span>
                </div>

                <div className="text-[11px] text-base-content/70 space-y-1 pt-1">
                  <span className="font-bold text-indigo-400 uppercase text-[9px] block">Top Priorities</span>
                  <p className="line-clamp-2">{twin.priorities?.join(' • ')}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-base-200 flex justify-between items-center text-[10px] font-mono text-base-content/50">
                <span className="text-emerald-400 font-bold">{twin.knowledgeCoveragePercent}% Coverage</span>
                <span>{twin.documentsLearnedCount} Docs</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TWIN KNOWLEDGE & MEMORY DRAWER ───────────────────────────── */}
      {selectedTwin && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative space-y-4 text-base-content">
            <button onClick={() => setSelectedTwin(null)} className="absolute top-4 right-4 p-2 text-base-content/50 hover:text-base-content">
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                EXECUTIVE TWIN MEMORY INSPECTOR
              </span>
              <h2 className="text-xl font-bold text-base-content">{selectedTwin.title}</h2>
              <p className="text-xs text-base-content/60">Risk Tolerance: <strong>{selectedTwin.riskTolerance}</strong> | Style: <strong>{selectedTwin.communicationStyle}</strong></p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-base-200/50 border border-base-300 rounded-xl space-y-1">
                <span className="font-bold text-indigo-400 uppercase text-[10px] block">Decision Patterns</span>
                <p className="text-base-content/90 font-medium">{selectedTwin.decisionPatterns}</p>
              </div>

              <div>
                <span className="font-bold text-base-content/60 uppercase block mb-1">Core Expertise Domains</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTwin.expertise?.map((exp: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded-xl bg-base-200 border border-base-300 text-base-content/80 font-mono">
                      ✓ {exp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-base-300 flex justify-between items-center text-xs font-mono">
                <span className="text-base-content/60">Knowledge Coverage: <strong>{selectedTwin.knowledgeCoveragePercent}%</strong></span>
                <span className="text-emerald-400 font-bold">{selectedTwin.memoryFreshnessDate}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
