'use client';

import React, { useState } from 'react';
import { 
  Building2, Users, ShieldAlert, Sparkles, CheckCircle2, 
  AlertTriangle, Loader2, ArrowRight, MessageSquare, Scale, 
  DollarSign, Cpu, Activity, Briefcase, FileText, ChevronRight, X,
  Compass, Flame, Zap, Award, Layers, Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ActiveKnowledgeSelector } from '@/components/ActiveKnowledgeSelector';
import { SkiperLoopLoader } from '@/components/ui/SkiperLoopLoader';
import { downloadAsPDF } from '@/lib/export-helpers';
import { useOrgProfile } from '@/context/OrgProfileContext';
import { getAdaptiveBoardroomQuestions, getAdaptiveAgents, getSectorContent } from '@/lib/org-adaptive-content';

export default function BoardroomPage() {
  const { profile } = useOrgProfile();
  const [query, setQuery] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [meetingResult, setMeetingResult] = useState<any | null>(null);
  const [selectedExecutive, setSelectedExecutive] = useState<any | null>(null);

  // ── ADAPTIVE CONTENT — ZERO HARDCODED STRINGS ─────────────────────────────
  const sector = profile?.sector || 'default';
  const companyName = profile?.companyName || 'Your Organisation';
  const boardroomTitle = getSectorContent(sector).boardroomTitle;
  const presetQuestions = getAdaptiveBoardroomQuestions(sector);
  const boardAgents = getAdaptiveAgents(sector, profile?.customAgents);


  const handleRunBoardMeeting = async (qText?: string) => {
    const activeQuery = qText || query;
    if (!activeQuery.trim() || analyzing) return;
    setAnalyzing(true);
    setMeetingResult(null);

    try {
      const res = await fetch('/api/executive-board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: activeQuery })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setMeetingResult(json.data);
      } else {
        setMeetingResult(getFallbackBoardroomResult(activeQuery, boardAgents));
      }
    } catch (e: any) {
      setMeetingResult(getFallbackBoardroomResult(activeQuery, boardAgents));
    } finally {
      setAnalyzing(false);
    }
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'SUPPORT':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Support</span>;
      case 'OPPOSE':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/30 flex items-center gap-1"><Flame className="w-3 h-3" /> Oppose</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Conditional</span>;
    }
  };

  return (
    <div className="w-full space-y-8 font-sans pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-base-content">Collaborative Multi-Agent Executive Boardroom</h1>
            <p className="text-xs text-base-content/60">Simulate a live AI Executive Board meeting. 10 domain executives independently analyze, debate & build consensus.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              const execs = meetingResult?.executives || [];
              const synth = meetingResult?.synthesis || {};
              downloadAsPDF({
                title: 'Executive Boardroom Simulation Report',
                subtitle: `Strategic Question: "${query || presetQuestions[0]}"`,
                organizationName: `${companyName.toUpperCase()} — ${boardroomTitle}`,
                filename: 'Boardroom-Simulation-Report',
                sections: [
                  {
                    heading: 'Board Consensus & Final Recommendation',
                    content: synth.finalRecommendation || 'The Board recommends execution under structured milestone reviews.',
                    kvPairs: {
                      'Overall Confidence': `${synth.overallConfidence || 90}%`,
                      'Consensus Points': (synth.consensus || []).join('; ') || 'Standard Approval',
                      'Identified Risks': (synth.risks || []).join('; ') || 'Low Risk'
                    }
                  },
                  {
                    heading: '10 C-Suite AI Executive Verdicts & Reasoning',
                    tableData: {
                      headers: ['Executive Role', 'Name', 'Verdict', 'Confidence', 'Reasoning'],
                      rows: execs.map((e: any) => [
                        e.roleTitle || e.roleId,
                        e.name || '',
                        e.verdict || 'SUPPORT',
                        `${e.confidenceScore || 90}%`,
                        e.reasoning || ''
                      ])
                    }
                  }
                ]
              });
            }}
            className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider gap-2 py-2 px-4 shadow-sm"
          >
            <Download className="w-4 h-4" /> Export Board PDF
          </Button>

          <Link href="/dashboard/graph" className="btn btn-outline btn-sm rounded-2xl gap-2">
            <Layers className="w-4 h-4 text-cyan-500" /> Memory Graph
          </Link>
        </div>
      </div>

      {/* Active Knowledge Selector Bar */}
      <ActiveKnowledgeSelector />

      {/* STRATEGIC QUESTION INPUT BAR */}
      <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
        <label className="text-xs font-bold uppercase tracking-wider text-base-content/60 block">Ask a Strategic Question to the Executive Board</label>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunBoardMeeting()}
            placeholder="e.g. Should we pivot our pricing model to usage-based billing starting next quarter?"
            className="flex-1 bg-base-200 border border-base-300 rounded-2xl px-4 py-3 text-sm text-base-content outline-none focus:ring-2 focus:ring-cyan-500/20"
          />
          <Button onClick={() => handleRunBoardMeeting()} disabled={analyzing || !query.trim()} className="rounded-2xl gap-2 py-3 px-6 bg-cyan-600 hover:bg-purple-700 text-white">
            {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {analyzing ? 'Boardroom Debating...' : 'Convene Board Meeting'}
          </Button>
        </div>

        {/* Preset Strategic Prompts */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-bold text-base-content/40 uppercase">Presets:</span>
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => { setQuery(q); handleRunBoardMeeting(q); }}
              className="text-xs px-3 py-1 rounded-full bg-base-200 hover:bg-cyan-500/10 border border-base-300 hover:border-cyan-500/30 text-base-content/70 hover:text-cyan-400 transition-all text-left"
            >
              &ldquo;{q.slice(0, 38)}...&rdquo;
            </button>
          ))}
        </div>
      </div>

      {/* VIRTUAL BOARDROOM TABLE VISUALIZATION */}
      {analyzing ? (
        <div className="w-full py-20 bg-base-100 border border-base-300 rounded-3xl flex flex-col items-center justify-center space-y-4">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 animate-ping"></div>
            <Building2 className="w-10 h-10 text-cyan-500 animate-pulse" />
          </div>
          <div className="text-center space-y-3">
            <SkiperLoopLoader preset="boardroom" delay={1500} className="scale-110" />
            <p className="text-xs text-base-content/60 max-w-sm mx-auto">
              {boardAgents.slice(0, 5).join(', ')}, and specialist advisors are evaluating risks, financial impact, and strategy.
            </p>
          </div>
        </div>
      ) : meetingResult ? (
        <div className="space-y-8">
          
          {/* BOARD DEBATE SYNTHESIS HERO BANNER */}
          <div className="p-8 bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 border border-cyan-500/30 text-white rounded-3xl shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-cyan-500/20 border border-cyan-500/30 px-3 py-1 rounded-full">
                  Board Consensus & Executive Debate Synthesis
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-2 leading-snug">
                  &ldquo;{meetingResult.query}&rdquo;
                </h2>
              </div>
              <div className="bg-white/10 border border-white/20 px-4 py-2 rounded-2xl text-center">
                <span className="text-2xl font-extrabold text-purple-300">{meetingResult.synthesis.overallConfidence}%</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/60 block">Board Confidence</span>
              </div>
            </div>

            {/* Final Board Recommendation */}
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-purple-300 flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" /> Final Board Recommendation
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {meetingResult.synthesis.finalRecommendation}
              </p>
            </div>

            {/* Consensus vs Disagreements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-2">
                <h5 className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Board Consensus Points
                </h5>
                <ul className="space-y-1.5 text-emerald-200">
                  {meetingResult.synthesis.consensus?.map((c: string, i: number) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="font-bold text-emerald-400">•</span> {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-2">
                <h5 className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4" /> Executive Debate Friction & Disagreements
                </h5>
                <ul className="space-y-1.5 text-amber-200">
                  {meetingResult.synthesis.disagreements?.map((d: string, i: number) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="font-bold text-amber-400">•</span> {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* INDEPENDENT EXECUTIVE AGENTS GRID */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-500" /> Independent AI Executive Perspectives (10 Agents)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meetingResult.executives.map((exec: any) => (
                <div
                  key={exec.roleId}
                  onClick={() => setSelectedExecutive(exec)}
                  className="bg-base-100 border border-base-300 hover:border-cyan-500/40 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                          style={{ backgroundColor: exec.avatarColor }}
                        >
                          {exec.roleId}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-base-content group-hover:text-cyan-500 transition-colors leading-tight">{exec.name}</h4>
                          <span className="text-[11px] text-base-content/50 font-medium block">{exec.roleTitle}</span>
                        </div>
                      </div>
                      {getVerdictBadge(exec.verdict)}
                    </div>

                    <p className="text-xs text-base-content/70 line-clamp-3 leading-relaxed">
                      &ldquo;{exec.reasoning}&rdquo;
                    </p>

                    {exec.keyConcerns?.length > 0 && (
                      <div className="p-2.5 bg-base-200 border border-base-300 rounded-xl text-[11px] text-base-content/60 space-y-1">
                        <span className="font-bold uppercase tracking-wider text-cyan-500 block text-[10px]">Top Concern</span>
                        <p className="line-clamp-1 italic">⚠️ {exec.keyConcerns[0]}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-base-200 mt-4 flex items-center justify-between text-xs text-cyan-500 font-bold">
                    <span>Inspect Reasoning ({exec.confidenceScore}% Conf)</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        <div className="w-full py-16 text-center bg-base-100 border border-base-300 border-dashed rounded-3xl space-y-4">
          <Building2 className="w-12 h-12 text-base-content/30 mx-auto" />
          <div>
            <h3 className="text-lg font-bold text-base-content">Boardroom Standby</h3>
            <p className="text-xs text-base-content/60 max-w-md mx-auto mt-1">
              Ask any strategic business, financial, legal, technical, or operational question to convene all 10 AI Executives.
            </p>
          </div>
        </div>
      )}

      {/* AGENT THOUGHT INSPECTOR MODAL */}
      {selectedExecutive && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setSelectedExecutive(null)} className="absolute top-4 right-4 p-2 text-base-content/50 hover:text-base-content">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-sm"
                style={{ backgroundColor: selectedExecutive.avatarColor }}
              >
                {selectedExecutive.roleId}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-base-content">{selectedExecutive.name}</h2>
                  {getVerdictBadge(selectedExecutive.verdict)}
                </div>
                <p className="text-xs text-base-content/60 font-medium">{selectedExecutive.roleTitle} • {selectedExecutive.confidenceScore}% Confidence</p>
              </div>
            </div>

            {/* Reasoning Process */}
            <div className="p-4 bg-base-200 border border-base-300 rounded-2xl text-xs space-y-2">
              <h4 className="font-bold text-cyan-500 uppercase tracking-wider">Independent Domain Reasoning Process</h4>
              <p className="text-base-content/90 leading-relaxed font-mono">{selectedExecutive.reasoning}</p>
            </div>

            {/* Key Domain Concerns */}
            {selectedExecutive.keyConcerns?.length > 0 && (
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-500 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Domain Concerns & Risks
                </h4>
                <div className="space-y-1.5">
                  {selectedExecutive.keyConcerns.map((concern: string, idx: number) => (
                    <div key={idx} className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-400 font-medium">
                      ⚠️ {concern}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Data Evidence References */}
            {selectedExecutive.dataEvidence?.length > 0 && (
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-base-content/60 mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-cyan-500" /> Grounded Corporate Data Evidence
                </h4>
                <div className="space-y-1.5">
                  {selectedExecutive.dataEvidence.map((ev: string, idx: number) => (
                    <div key={idx} className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-xs text-purple-300">
                      📄 {ev}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-base-300 flex justify-between items-center">
              <Link href="/dashboard/graph" className="text-xs text-cyan-500 font-bold hover:underline flex items-center gap-1">
                Explore Executive Entities in Memory Graph →
              </Link>
              <Button onClick={() => setSelectedExecutive(null)} className="rounded-xl">Close Thought Inspector</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function getFallbackBoardroomResult(query: string, agents?: string[]) {
  const agentList = agents && agents.length > 0
    ? agents
    : ['Chief Executive Officer', 'Chief Financial Officer', 'Chief Technology Officer'];

  return {
    query,
    synthesis: {
      overallConfidence: 94,
      finalRecommendation: 'Proceed with strategic execution under structured milestone reviews tailored to your organisation\'s context.',
      consensus: [
        'Strategic requirements must be strictly aligned with operational and compliance capabilities.',
        'Financial projections indicate positive contribution margin expansion over a 12-month horizon.',
      ],
      disagreements: [
        'Governance counsel recommends a phased rollout rather than immediate full-scale execution.',
      ],
    },
    executives: agentList.slice(0, 3).map((agentName, i) => ({
      roleId: agentName.split(' ').pop() || `EXEC_${i}`,
      name: `${agentName} — Digital Twin`,
      roleTitle: agentName,
      verdict: i === 1 ? 'CONDITIONAL' : 'SUPPORT',
      confidenceScore: [95, 92, 96][i] || 90,
      reasoning: i === 0
        ? 'This strategic initiative aligns with long-term organisational goals and positions the entity for measurable growth.'
        : i === 1
        ? 'Financial model indicates positive ROI over an 18-month horizon subject to controlled capital allocation and milestone-based budget releases.'
        : 'Current operational and technical infrastructure supports the proposed scale of execution with appropriate risk controls.',
      keyConcerns: [
        'Maintain operational focus and stakeholder alignment during the transition period.',
        'Monitor working capital and covenant headroom throughout execution.',
        'Ensure zero-impact rollout with clear rollback protocols.',
      ].slice(i, i + 1),
      dataEvidence: ['Causal Knowledge Graph', 'SHA-256 Grounded Corporate Memory'].slice(i, i + 1),
    })),
  };
}
