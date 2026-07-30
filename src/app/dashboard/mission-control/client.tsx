'use client';

import React, { useState, useEffect } from 'react';
import { 
  Radio, Play, Pause, Square, RefreshCw, Sparkles, CheckCircle2, 
  AlertTriangle, Clock, Layers, ArrowRight, ShieldCheck, FileText, 
  Lock, Cpu, Users, Zap, ExternalLink, ChevronRight, X, Loader2, Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { downloadAsPDF, downloadAsCSV } from '@/lib/export-helpers';

const AGENT_TYPE_ICONS: Record<string, any> = {
  RESEARCH: Sparkles,
  FINANCE: TrendingUpIcon,
  LEGAL: ScaleIcon,
  ENGINEERING: Cpu,
  MARKETING: Zap,
  OPERATIONS: FolderKanbanIcon,
  SECURITY: ShieldCheck,
  HR: Users,
  DOCUMENT: FileText,
  DIGITAL_TWIN: Radio
};

function TrendingUpIcon(props: any) { return <span {...props}>📈</span>; }
function ScaleIcon(props: any) { return <span {...props}>⚖️</span>; }
function FolderKanbanIcon(props: any) { return <span {...props}>📋</span>; }

export default function MissionControlClient() {
  const [missionTitle, setMissionTitle] = useState('');
  const [missionObjective, setMissionObjective] = useState('');
  const [digitalTwinPersona, setDigitalTwinPersona] = useState('Enterprise CEO');
  
  const [activeMission, setActiveMission] = useState<any | null>(null);
  const [launching, setLaunching] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);

  // Preset Mission Examples
  const presetMissions = [
    { title: "Prepare Enterprise Acquisition Report", objective: "Synthesize financial valuation, legal liability, technical debt, and team capacity for target company acquisition." },
    { title: "Conduct Q4 Regulatory & Infosec Audit", objective: "Verify GDPR/CCPA data privacy compliance, Zero Data Training policies, and vendor MSA risk clauses." },
    { title: "Formulate GTM & Revenue Scaling Plan", objective: "Evaluate pricing strategy, market segmentation, sales channel performance, and ROI targets." }
  ];

  // Poll active mission flight status every 1 second when RUNNING
  useEffect(() => {
    if (!activeMission || activeMission.status !== 'RUNNING') return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/mission-control/status?missionId=${activeMission.missionId}`);
        const json = await res.json();
        if (json.success) {
          setActiveMission(json.data);
        }
      } catch (e) {}
    }, 1000);

    return () => clearInterval(interval);
  }, [activeMission?.missionId, activeMission?.status]);

  const handleLaunchMission = async (customTitle?: string, customObj?: string) => {
    const t = customTitle || missionTitle;
    const obj = customObj || missionObjective;
    if (!t.trim() || !obj.trim() || launching) return;

    setLaunching(true);
    try {
      const res = await fetch('/api/mission-control/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: t, objective: obj, digitalTwinPersona })
      });
      const json = await res.json();
      if (json.success) {
        setActiveMission(json.data);
      } else {
        alert(`Mission Control Error: ${json.error}`);
      }
    } catch (e: any) {
      alert(`Error launching mission: ${e.message}`);
    } finally {
      setLaunching(false);
    }
  };

  const handleControlAction = async (action: 'PAUSE' | 'RESUME' | 'CANCEL', payload?: any) => {
    if (!activeMission) return;
    try {
      const res = await fetch('/api/mission-control/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId: activeMission.missionId, action, payload })
      });
      const json = await res.json();
      if (json.success) {
        setActiveMission(json.data);
      }
    } catch (e) {}
  };

  return (
    <div className="w-full space-y-8 font-sans pb-20 text-base-content">
      
      {/* ── HEADER BANNER ────────────────────────────────────────── */}
      <div className="p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/30 text-white rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Mission Control Air Traffic Center
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
            Multi-Agent Flight Control System
          </h1>
          <p className="text-xs text-indigo-200/70 leading-relaxed">
            Watch 10 specialized AI agents (Research, Finance, Legal, Engineering, Marketing, Ops, Security, HR, Document & Digital Twin) collaborate in parallel through structured shared memory.
          </p>
        </div>

        {activeMission && (
          <div className="flex items-center gap-2 shrink-0 z-10 bg-black/50 p-2.5 rounded-2xl border border-white/10">
            {activeMission.status === 'RUNNING' && (
              <Button onClick={() => handleControlAction('PAUSE')} size="sm" variant="outline" className="rounded-xl gap-1 text-xs font-bold border-amber-500/40 text-amber-300">
                <Pause className="w-3.5 h-3.5" /> Pause Flight
              </Button>
            )}
            {activeMission.status === 'PAUSED' && (
              <Button onClick={() => handleControlAction('RESUME')} size="sm" className="rounded-xl gap-1 text-xs font-bold bg-emerald-600 text-white">
                <Play className="w-3.5 h-3.5" /> Resume Flight
              </Button>
            )}
            <Button onClick={() => handleControlAction('CANCEL')} size="sm" variant="destructive" className="rounded-xl gap-1 text-xs font-bold">
              <Square className="w-3.5 h-3.5" /> Abort Mission
            </Button>
          </div>
        )}
      </div>

      {/* ── MISSION LAUNCH BAR ────────────────────────────────────── */}
      {!activeMission && (
        <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-base-content/60 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" /> Launch New Multi-Agent Mission
          </h3>

          <div className="space-y-3">
            <input 
              type="text" 
              value={missionTitle}
              onChange={(e) => setMissionTitle(e.target.value)}
              placeholder="Mission Title (e.g. Prepare Enterprise Acquisition Report)..." 
              className="w-full bg-base-200 border border-base-300 rounded-2xl px-4 py-3 text-sm text-base-content outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <textarea 
              value={missionObjective}
              onChange={(e) => setMissionObjective(e.target.value)}
              rows={3}
              placeholder="Detailed Mission Objective & Scope..." 
              className="w-full bg-base-200 border border-base-300 rounded-2xl p-4 text-sm text-base-content outline-none focus:ring-2 focus:ring-indigo-500/20 custom-scrollbar resize-none"
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-base-content/60">
                <span className="font-bold">Digital Twin Persona:</span>
                <select 
                  value={digitalTwinPersona} 
                  onChange={(e) => setDigitalTwinPersona(e.target.value)}
                  className="bg-base-200 border border-base-300 rounded-xl px-3 py-1.5 text-xs text-base-content outline-none font-medium"
                >
                  <option value="Enterprise CEO">Enterprise CEO</option>
                  <option value="General Counsel">General Counsel</option>
                  <option value="Chief Risk Officer">Chief Risk Officer</option>
                  <option value="VP Finance">VP Finance</option>
                </select>
              </div>

              <Button onClick={() => handleLaunchMission()} disabled={launching} className="rounded-2xl px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider gap-2 shadow-lg">
                {launching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Radio className="w-4 h-4" />}
                {launching ? 'Initializing Fleet...' : 'Launch Mission Flight'}
              </Button>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-base-200">
              <span className="text-[11px] font-bold text-base-content/40 uppercase">Mission Templates:</span>
              {presetMissions.map((pm, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setMissionTitle(pm.title);
                    setMissionObjective(pm.objective);
                    handleLaunchMission(pm.title, pm.objective);
                  }}
                  className="text-xs px-3 py-1 rounded-full bg-base-200 hover:bg-indigo-500/10 border border-base-300 hover:border-indigo-500/30 text-base-content/70 hover:text-indigo-400 transition-all text-left"
                >
                  "{pm.title}"
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ACTIVE MISSION FLIGHT CONTROL DASHBOARD ──────────────── */}
      {activeMission && (
        <div className="space-y-8">
          
          {/* Mission Progress Flight Indicator */}
          <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-indigo-400 font-bold uppercase tracking-wider">{activeMission.missionId}</span>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                  activeMission.status === 'RUNNING' && "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                  activeMission.status === 'PAUSED' && "bg-amber-500/10 text-amber-400 border-amber-500/30",
                  activeMission.status === 'COMPLETED' && "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                )}>
                  ● FLIGHT {activeMission.status}
                </span>
              </div>
              <span className="font-mono text-base-content/60 font-bold">{activeMission.progressPercentage}% Completed</span>
            </div>

            {/* Flight Progress Bar */}
            <div className="w-full bg-base-300 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${activeMission.progressPercentage}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-xs text-base-content/60 pt-1">
              <span>Digital Twin Simulation: <strong>{activeMission.digitalTwinPersona}</strong></span>
              <span>Est. Latency: {activeMission.estimatedCompletionMs}ms</span>
            </div>
          </div>

          {/* 10 SPECIALIZED AGENT FLEET RADAR GRID */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" /> 10 Specialized AI Agent Fleet (Active Radar)
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">PARALLEL ORCHESTRATION</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.values(activeMission.agents || {}).map((agent: any) => {
                const IconComp = AGENT_TYPE_ICONS[agent.id] || Sparkles;
                return (
                  <div 
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={cn(
                      "p-4 rounded-2xl border transition-all cursor-pointer space-y-2 flex flex-col justify-between relative overflow-hidden",
                      agent.status === 'WORKING' && "bg-indigo-500/10 border-indigo-500/40 shadow-md ring-1 ring-indigo-500/30",
                      agent.status === 'COMPLETED' && "bg-emerald-500/5 border-emerald-500/20",
                      agent.status === 'IDLE' && "bg-base-100 border-base-300 opacity-60 hover:opacity-100"
                    )}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="w-8 h-8 rounded-xl bg-base-200 border border-base-300 flex items-center justify-center text-indigo-400">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border font-mono",
                          agent.status === 'WORKING' && "bg-indigo-500/20 text-indigo-300 border-indigo-500/30 animate-pulse",
                          agent.status === 'COMPLETED' && "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                          agent.status === 'IDLE' && "bg-slate-500/10 text-slate-400 border-slate-500/20"
                        )}>
                          {agent.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-xs text-base-content leading-tight">{agent.name}</h4>
                        <span className="text-[10px] text-base-content/50 line-clamp-1">{agent.role}</span>
                      </div>

                      {agent.currentTask && (
                        <p className="text-[10px] text-indigo-300 bg-indigo-500/10 p-1.5 rounded-lg border border-indigo-500/20 line-clamp-1 font-mono">
                          ⚡ {agent.currentTask}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-base-200 flex justify-between items-center text-[10px] font-mono">
                      <span className="text-emerald-400 font-bold">{agent.confidenceScore}% Conf.</span>
                      <span className="text-base-content/40">{agent.permissions?.length || 0} Perms</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TASKS DEPENDENCY & PARALLEL EXECUTION FLOW */}
          <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" /> Parallel Tasks & Dependency Flow
            </h3>

            <div className="space-y-3">
              {activeMission.tasks?.map((task: any) => (
                <div 
                  key={task.id} 
                  onClick={() => setSelectedTask(task)}
                  className="p-4 bg-base-200 border border-base-300 hover:border-indigo-500/30 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer group transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-400">{task.id}</span>
                      <strong className="text-sm font-bold text-base-content group-hover:text-indigo-400 transition-colors">{task.title}</strong>
                      {task.canExecuteInParallel && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          PARALLEL
                        </span>
                      )}
                    </div>
                    {task.reasoningSummary && (
                      <p className="text-xs text-base-content/70 italic font-mono">"{task.reasoningSummary}"</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono text-base-content/50">{task.executionTimeMs}ms</span>
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      task.status === 'COMPLETED' && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                      task.status === 'RUNNING' && "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 animate-pulse",
                      task.status === 'PENDING' && "bg-slate-500/10 text-slate-400 border-slate-500/20"
                    )}>
                      {task.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-base-content/40 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FINAL MISSION EXECUTIVE REPORT (IF COMPLETED) */}
          {activeMission.finalReport && (
            <div className="p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/40 text-white rounded-3xl shadow-2xl space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-sm text-indigo-300 uppercase tracking-wider">Final Synthesized Mission Executive Report</h3>
              </div>
              <div className="text-sm leading-relaxed text-slate-200 whitespace-pre-wrap font-sans">
                {activeMission.finalReport}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TASK EXPLAINABILITY INSPECTOR DRAWER */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative space-y-4 text-base-content">
            <button onClick={() => setSelectedTask(null)} className="absolute top-4 right-4 p-2 text-base-content/50 hover:text-base-content">
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-indigo-400">{selectedTask.id}</span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {selectedTask.status}
                </span>
              </div>
              <h2 className="text-xl font-bold text-base-content">{selectedTask.title}</h2>
              <p className="text-xs text-base-content/60">Assigned Agent: <strong>{selectedTask.assignedAgent} Agent</strong></p>
            </div>

            {/* Reasoning Summary (No Raw Chain of Thought) */}
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-xs space-y-1">
              <span className="font-bold text-indigo-400 uppercase tracking-wider block">Concise Reasoning Summary</span>
              <p className="text-base-content/90 font-medium">{selectedTask.reasoningSummary || 'Executing reasoning steps...'}</p>
            </div>

            {/* Inputs & Outputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-base-200 border border-base-300 rounded-xl space-y-1">
                <span className="font-bold text-base-content/60 uppercase block">Task Inputs</span>
                <pre className="font-mono text-[11px] text-base-content/80 overflow-x-auto">{JSON.stringify(selectedTask.inputs, null, 2)}</pre>
              </div>

              <div className="p-3 bg-base-200 border border-base-300 rounded-xl space-y-1">
                <span className="font-bold text-base-content/60 uppercase block">Structured Outputs</span>
                <pre className="font-mono text-[11px] text-emerald-400 overflow-x-auto">{JSON.stringify(selectedTask.outputs || {}, null, 2)}</pre>
              </div>
            </div>

            {/* Sources & Execution Telemetry + Export Actions */}
            <div className="pt-3 border-t border-base-300 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="text-base-content/60">Execution Time: {selectedTask.executionTimeMs}ms</span>
                <span className="text-emerald-400 font-bold">{selectedTask.confidenceScore}% Confidence</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    downloadAsPDF({
                      title: `${selectedTask.title} — AI Mission Task Report`,
                      subtitle: `Assigned Agent: ${selectedTask.assignedAgent} | Status: ${selectedTask.status}`,
                      sections: [
                        {
                          heading: 'Concise Reasoning Summary',
                          content: selectedTask.reasoningSummary
                        },
                        {
                          heading: 'Structured Task Outputs',
                          kvPairs: selectedTask.outputs || {}
                        },
                        {
                          heading: 'Task Inputs',
                          content: JSON.stringify(selectedTask.inputs, null, 2)
                        }
                      ]
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all shadow-md flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" /> Download PDF
                </button>
                <button
                  onClick={() => {
                    downloadAsCSV(selectedTask.title.toLowerCase().replace(/\s+/g, '-'), selectedTask.outputs || selectedTask);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-all shadow-md flex items-center gap-1 cursor-pointer"
                >
                  Download CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AGENT FLEET DETAIL DRAWER */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative space-y-4 text-base-content">
            <button onClick={() => setSelectedAgent(null)} className="absolute top-4 right-4 p-2 text-base-content/50 hover:text-base-content">
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {selectedAgent.id} FLEET AGENT
              </span>
              <h2 className="text-xl font-bold text-base-content">{selectedAgent.name}</h2>
              <p className="text-xs text-base-content/60">{selectedAgent.role}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-base-content/60 uppercase block mb-1">Capabilities</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAgent.capabilities?.map((cap: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded-xl bg-base-200 border border-base-300 text-base-content/80 font-mono">
                      ✓ {cap}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-base-content/60 uppercase block mb-1">Active Permissions</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAgent.permissions?.map((perm: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-[10px]">
                      🔒 {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
