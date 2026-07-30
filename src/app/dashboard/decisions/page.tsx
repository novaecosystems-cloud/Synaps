'use client';

import React, { useState, useEffect } from 'react';
import { 
  Scale, BrainCircuit, ShieldAlert, AlertTriangle, CheckCircle2, 
  Sparkles, Search, Plus, FileText, Layers, History, RefreshCw, 
  ChevronRight, ArrowUpRight, X, Loader2, Info, Flame, DollarSign,
  Briefcase, CheckSquare, Edit3, Award, Users, TrendingUp, HelpCircle,
  Clock, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ActiveKnowledgeSelector } from '@/components/ActiveKnowledgeSelector';

export default function DecisionsPage() {
  const [decisions, setDecisions] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Natural Language Search & Q&A
  const [nlQuery, setNlQuery] = useState('');
  const [queryingMemory, setQueryingMemory] = useState(false);
  const [queryMemoryResult, setQueryMemoryResult] = useState<any | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [activeView, setActiveView] = useState<'cards' | 'timeline' | 'analytics'>('cards');

  // Submit Decision Form State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [title, setTitle] = useState('');
  const [problem, setProblem] = useState('');
  const [context, setContext] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Review Result State (After submission)
  const [aiReviewResult, setAiReviewResult] = useState<any | null>(null);

  // Post Mortem Modal State
  const [postMortemTarget, setPostMortemTarget] = useState<any | null>(null);
  const [actualOutcome, setActualOutcome] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');
  const [savingOutcome, setSavingOutcome] = useState(false);

  // Inspector Modal
  const [selectedDecision, setSelectedDecision] = useState<any | null>(null);

  const presetQuestions = [
    "Have we done this before?",
    "What happened last time?",
    "Why was this rejected?",
    "What assumptions were wrong?",
    "What changed in our cloud policy?"
  ];

  const fetchDecisions = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (selectedStatus && selectedStatus !== 'ALL') params.set('status', selectedStatus);

      const [resDec, resAnalytics] = await Promise.all([
        fetch(`/api/decisions/memory?${params.toString()}`),
        fetch('/api/decisions/analytics')
      ]);

      const jsonDec = await resDec.json();
      const jsonAnalytics = await resAnalytics.json();

      if (jsonDec.success) setDecisions(jsonDec.data);
      if (jsonAnalytics.success) setAnalytics(jsonAnalytics.data);

    } catch (err: any) {
      setError(err.message || 'Error fetching decision memory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecisions();
  }, [selectedStatus]);

  const handleQueryDecisionMemory = async (qText?: string) => {
    const activeQ = qText || nlQuery;
    if (!activeQ.trim() || queryingMemory) return;
    setQueryingMemory(true);
    setQueryMemoryResult(null);

    try {
      const res = await fetch('/api/decisions/query-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: activeQ })
      });
      const json = await res.json();
      if (json.success) {
        setQueryMemoryResult(json.data);
      } else {
        alert(`Memory Query Error: ${json.error}`);
      }
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setQueryingMemory(false);
    }
  };

  const handleReviewDecision = async () => {
    if (!title.trim() || !problem.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/decisions/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, problem, context, expectedOutcome })
      });
      const json = await res.json();
      if (json.success) {
        setShowSubmitModal(false);
        setAiReviewResult(json.data);
        setTitle('');
        setProblem('');
        setContext('');
        setExpectedOutcome('');
        await fetchDecisions();
      } else {
        alert(`Decision AI Review Error: ${json.error}`);
      }
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSavePostMortem = async () => {
    if (!postMortemTarget || savingOutcome) return;
    setSavingOutcome(true);
    try {
      const res = await fetch(`/api/decisions/${postMortemTarget.id}/outcome`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actualOutcome, lessonsLearned, status: 'EXECUTED' })
      });
      const json = await res.json();
      if (json.success) {
        setPostMortemTarget(null);
        setActualOutcome('');
        setLessonsLearned('');
        await fetchDecisions();
      } else {
        alert(`Failed to save post-mortem: ${json.error}`);
      }
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setSavingOutcome(false);
    }
  };

  const getRecBadge = (rec: string) => {
    switch (rec) {
      case 'GO':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Approved GO</span>;
      case 'NO_GO':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/30 flex items-center gap-1"><Flame className="w-3 h-3" /> NO-GO Rejected</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Conditional GO</span>;
    }
  };

  return (
    <div className="w-full space-y-8 font-sans pb-16 text-base-content">
      
      {/* ── HEADER BANNER ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-base-content">Enterprise Decision Memory Engine</h1>
            <p className="text-xs text-base-content/60">Remembers every historical corporate decision. Evaluates precedents, similarity, wrong assumptions, and lessons learned.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => setShowSubmitModal(true)} className="gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
            <Sparkles className="w-4 h-4" /> Submit Proposed Decision
          </Button>
        </div>
      </div>

      {/* Active Knowledge Selector Bar */}
      <ActiveKnowledgeSelector />

      {/* ── NATURAL LANGUAGE DECISION MEMORY SEARCH BAR ────────────── */}
      <div className="p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-sm text-indigo-300 uppercase tracking-wider">Search Enterprise Decision Precedents</h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={nlQuery}
            onChange={(e) => setNlQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleQueryDecisionMemory()}
            placeholder="Ask anything (e.g. 'Have we done this before?' or 'What happened last time?')..." 
            className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
          <Button 
            onClick={() => handleQueryDecisionMemory()} 
            disabled={queryingMemory || !nlQuery.trim()} 
            className="rounded-2xl px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider gap-2 shadow-lg shrink-0"
          >
            {queryingMemory ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {queryingMemory ? 'Querying Memory...' : 'Search Precedents'}
          </Button>
        </div>

        {/* Preset Questions */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-bold text-indigo-300/60 uppercase">Preset Queries:</span>
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => { setNlQuery(q); handleQueryDecisionMemory(q); }}
              className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-indigo-500/30 border border-white/10 text-slate-200 hover:text-white transition-all"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* ── NATURAL LANGUAGE QUERY RESULT MODAL ───────────────────── */}
      {queryMemoryResult && (
        <div className="p-6 bg-base-100 border border-indigo-500/40 rounded-3xl shadow-xl space-y-6 animate-in fade-in duration-200 relative">
          <button onClick={() => setQueryMemoryResult(null)} className="absolute top-4 right-4 p-2 text-base-content/50 hover:text-base-content">
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 border-b border-base-300 pb-3">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-base text-base-content">Decision Memory Result for "{queryMemoryResult.query}"</h3>
            {queryMemoryResult.hasPrecedent && (
              <span className="ml-auto text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                ✓ Precedent Detected ({queryMemoryResult.confidenceScore}% Match)
              </span>
            )}
          </div>

          <div className="p-4 bg-base-200 border border-base-300 rounded-2xl text-xs text-base-content leading-relaxed whitespace-pre-wrap font-medium">
            {queryMemoryResult.answer}
          </div>

          {/* Matching Past Decision Cards */}
          {queryMemoryResult.matchingDecisions?.length > 0 && (
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/60 block">Matching Historical Decisions</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {queryMemoryResult.matchingDecisions.map((match: any, idx: number) => (
                  <div key={idx} className="p-4 bg-base-200 border border-base-300 rounded-2xl space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <strong className="text-base-content font-bold text-sm">{match.title}</strong>
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold border border-indigo-500/20">
                        {match.similarityScore}% Similarity
                      </span>
                    </div>
                    <p className="text-base-content/70">{match.problem}</p>
                    <div className="p-2.5 bg-base-100 rounded-xl border border-base-300 space-y-1 font-mono text-[11px]">
                      <span className="text-emerald-400 block">✓ Outcome: {match.actualOutcome || match.expectedOutcome}</span>
                      {match.lessonsLearned && <span className="text-amber-400 block">💡 Lesson: {match.lessonsLearned}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── VIEW SELECTOR & SEARCH BAR ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-base-300 pb-4">
        
        {/* View Switcher */}
        <div className="flex items-center gap-2 p-1 bg-base-200 rounded-2xl border border-base-300">
          {[
            { id: 'cards', label: 'Decision Cards', icon: Layers },
            { id: 'timeline', label: 'Decision Timeline', icon: Clock },
            { id: 'analytics', label: 'Decision Analytics', icon: TrendingUp }
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                activeView === view.id ? "bg-indigo-600 text-white shadow-md" : "text-base-content/60 hover:text-base-content"
              )}
            >
              <view.icon className="w-3.5 h-3.5" />
              {view.label}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar">
          {['ALL', 'UNDER_REVIEW', 'APPROVED', 'EXECUTED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border",
                selectedStatus === st
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-base-100 border-base-300 text-base-content/70 hover:text-base-content"
              )}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

      </div>

      {/* ── VIEW 1: DECISION CARDS GRID ────────────────────────────── */}
      {activeView === 'cards' && (
        <>
          {loading ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-base-content">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
              <p className="text-sm font-medium">Querying Decision Memory Database...</p>
            </div>
          ) : decisions.length === 0 ? (
            <div className="w-full py-16 text-center bg-base-100 border border-base-300 border-dashed rounded-3xl space-y-3">
              <Scale className="w-12 h-12 text-base-content/30 mx-auto" />
              <h3 className="text-lg font-bold text-base-content">No Stored Decisions Found</h3>
              <p className="text-xs text-base-content/60 max-w-md mx-auto">
                Submit a proposed decision for AI Review to evaluate logic, bias & risks, and store it permanently in Decision Memory.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {decisions.map((dec) => (
                <div 
                  key={dec.id} 
                  onClick={() => setSelectedDecision(dec)}
                  className="bg-base-100 border border-base-300 hover:border-indigo-500/40 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      {getRecBadge(dec.recommendation)}
                      <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50">
                        {dec.confidence}% Conf.
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-base-content group-hover:text-indigo-400 transition-colors leading-snug line-clamp-1">
                      {dec.title}
                    </h3>

                    <p className="text-xs text-base-content/70 line-clamp-2 leading-relaxed">
                      Problem: {dec.problem}
                    </p>

                    {dec.logicEvaluation && (
                      <p className="text-[11px] text-base-content/60 line-clamp-2 bg-base-200 p-2.5 rounded-xl border border-base-300 italic">
                        "{dec.logicEvaluation}"
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-base-200 mt-4 space-y-2">
                    {dec.actualOutcome ? (
                      <div className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Post-Mortem Recorded
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setPostMortemTarget(dec); }}
                        className="text-[11px] text-indigo-400 font-bold hover:underline flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Log Actual Outcome & Lessons
                      </button>
                    )}

                    <div className="flex items-center justify-between text-xs text-indigo-400 font-bold pt-1">
                      <span>Inspect Decision Memory</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── VIEW 2: DECISION TIMELINE ──────────────────────────────── */}
      {activeView === 'timeline' && (
        <div className="p-8 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-6">
          <h3 className="font-bold text-base text-base-content flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" /> Enterprise Decision Timeline
          </h3>

          <div className="relative border-l-2 border-indigo-500/30 ml-4 pl-6 space-y-8">
            {decisions.map((dec, idx) => (
              <div key={dec.id} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-indigo-600 border-4 border-base-100 group-hover:scale-125 transition-transform" />
                
                <div className="p-5 bg-base-200 border border-base-300 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-indigo-400 font-bold">{new Date(dec.createdAt).toLocaleDateString()}</span>
                    {getRecBadge(dec.recommendation)}
                  </div>
                  <h4 className="font-bold text-base text-base-content">{dec.title}</h4>
                  <p className="text-xs text-base-content/70">{dec.problem}</p>
                  {dec.actualOutcome && (
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-mono">
                      ✓ Actual Outcome: {dec.actualOutcome}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── VIEW 3: DECISION ANALYTICS ─────────────────────────────── */}
      {activeView === 'analytics' && analytics && (
        <div className="space-y-8">
          
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50">Total Decision Memory</span>
              <div className="text-3xl font-black text-indigo-500">{analytics.totalDecisions}</div>
              <span className="text-[11px] text-base-content/60">Stored in company graph</span>
            </div>

            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50">Decision Success Rate</span>
              <div className="text-3xl font-black text-emerald-500">{analytics.successRate}%</div>
              <span className="text-[11px] text-emerald-500 font-semibold">Post-mortem verified</span>
            </div>

            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50">Repeated Approval Patterns</span>
              <div className="text-3xl font-black text-purple-500">{analytics.repeatedApprovals?.length || 1}</div>
              <span className="text-[11px] text-base-content/60">Standard playbooks</span>
            </div>

            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50">Repeated Warning Patterns</span>
              <div className="text-3xl font-black text-amber-500">{analytics.repeatedFailures?.length || 1}</div>
              <span className="text-[11px] text-amber-400 font-semibold">Flagged for prevention</span>
            </div>
          </div>

          {/* Breakdown Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Most Successful Decisions */}
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-base-content uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-500" /> Most Successful Decisions
              </h3>
              <div className="space-y-3">
                {analytics.mostSuccessfulDecisions?.map((dec: any, i: number) => (
                  <div key={i} className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl space-y-1 text-xs">
                    <strong className="text-emerald-400 block font-bold text-sm">{dec.title}</strong>
                    <p className="text-base-content/80 font-medium">Outcome: {dec.outcome}</p>
                    <span className="text-[10px] font-mono text-emerald-400 block">Impact: {dec.businessImpact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Expensive Mistakes */}
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-base-content uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-500" /> Most Expensive Mistakes & Lessons
              </h3>
              <div className="space-y-3">
                {analytics.mostExpensiveMistakes?.map((dec: any, i: number) => (
                  <div key={i} className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl space-y-1 text-xs">
                    <strong className="text-red-400 block font-bold text-sm">{dec.title}</strong>
                    <p className="text-base-content/80 font-medium">Cost: {dec.cost}</p>
                    <span className="text-[10px] font-mono text-amber-400 block">Lesson: {dec.lessonsLearned}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Repeated Failures */}
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-base-content uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Repeated Failure Warnings
              </h3>
              <div className="space-y-3">
                {analytics.repeatedFailures?.map((fail: any, i: number) => (
                  <div key={i} className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-1 text-xs">
                    <strong className="text-amber-400 block font-bold">{fail.pattern} (Occurred {fail.count}x)</strong>
                    <p className="text-base-content/80">Recommendation: {fail.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Influential Employees */}
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-base-content uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" /> Most Influential Decision Makers
              </h3>
              <div className="space-y-3">
                {analytics.influentialEmployees?.map((emp: any, i: number) => (
                  <div key={i} className="p-4 bg-base-200 border border-base-300 rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-base-content block font-bold">{emp.name}</strong>
                      <span className="text-[10px] text-base-content/50 font-mono">{emp.decisionCount} decisions stored</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold font-mono">
                      {emp.successRate} Success
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUBMIT DECISION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative space-y-4">
            <button onClick={() => setShowSubmitModal(false)} className="absolute top-4 right-4 p-2 text-base-content/50 hover:text-base-content">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-lg text-base-content">Submit Decision for AI Review</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-base-content/60 uppercase tracking-wider block mb-1">Decision Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Migrate Core Database to Multi-Region Cluster"
                  className="w-full bg-base-200 border border-base-300 rounded-2xl p-3 text-sm text-base-content outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-base-content/60 uppercase tracking-wider block mb-1">Problem Statement</label>
                <textarea 
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  rows={3}
                  placeholder="What core operational or business problem does this decision resolve?"
                  className="w-full bg-base-200 border border-base-300 rounded-2xl p-3 text-sm text-base-content outline-none focus:ring-2 focus:ring-indigo-500/20 custom-scrollbar resize-none"
                ></textarea>
              </div>

              <div>
                <label className="text-xs font-bold text-base-content/60 uppercase tracking-wider block mb-1">Background Context</label>
                <textarea 
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  rows={3}
                  placeholder="Supporting background, data points, or project constraints..."
                  className="w-full bg-base-200 border border-base-300 rounded-2xl p-3 text-sm text-base-content outline-none focus:ring-2 focus:ring-indigo-500/20 custom-scrollbar resize-none"
                ></textarea>
              </div>

              <div>
                <label className="text-xs font-bold text-base-content/60 uppercase tracking-wider block mb-1">Expected Outcome</label>
                <input 
                  type="text" 
                  value={expectedOutcome}
                  onChange={(e) => setExpectedOutcome(e.target.value)}
                  placeholder="e.g. 99.99% Uptime, 30% reduction in latency"
                  className="w-full bg-base-200 border border-base-300 rounded-2xl p-3 text-sm text-base-content outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button onClick={() => setShowSubmitModal(false)} variant="ghost" className="rounded-xl">Cancel</Button>
              <Button onClick={handleReviewDecision} disabled={submitting} className="rounded-xl gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {submitting ? 'Running Decision Review AI...' : 'Run Decision AI Review'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* POST MORTEM MODAL */}
      {postMortemTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <button onClick={() => setPostMortemTarget(null)} className="absolute top-4 right-4 p-2 text-base-content/50 hover:text-base-content">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-lg text-base-content">Record Decision Post-Mortem</h3>
            </div>

            <p className="text-xs text-base-content/60">Decision: <strong>{postMortemTarget.title}</strong></p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-base-content/60 uppercase tracking-wider block mb-1">Actual Outcome</label>
                <textarea 
                  value={actualOutcome}
                  onChange={(e) => setActualOutcome(e.target.value)}
                  rows={3}
                  placeholder="What actually happened after executing this decision?"
                  className="w-full bg-base-200 border border-base-300 rounded-2xl p-3 text-sm text-base-content outline-none focus:ring-2 focus:ring-indigo-500/20 custom-scrollbar resize-none"
                ></textarea>
              </div>

              <div>
                <label className="text-xs font-bold text-base-content/60 uppercase tracking-wider block mb-1">Lessons Learned & Wrong Assumptions</label>
                <textarea 
                  value={lessonsLearned}
                  onChange={(e) => setLessonsLearned(e.target.value)}
                  rows={3}
                  placeholder="What lessons & wrong assumptions should future decisions reference?"
                  className="w-full bg-base-200 border border-base-300 rounded-2xl p-3 text-sm text-base-content outline-none focus:ring-2 focus:ring-indigo-500/20 custom-scrollbar resize-none"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button onClick={() => setPostMortemTarget(null)} variant="ghost" className="rounded-xl">Cancel</Button>
              <Button onClick={handleSavePostMortem} disabled={savingOutcome} className="rounded-xl gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                {savingOutcome ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {savingOutcome ? 'Saving...' : 'Save Post-Mortem'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SELECTED DECISION INSPECTOR MODAL */}
      {selectedDecision && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl max-w-3xl w-full p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setSelectedDecision(null)} className="absolute top-4 right-4 p-2 text-base-content/50 hover:text-base-content">
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                {getRecBadge(selectedDecision.recommendation)}
                <span className="text-xs font-bold text-base-content/50">{selectedDecision.confidence}% AI Confidence</span>
              </div>
              <h2 className="text-2xl font-bold text-base-content">{selectedDecision.title}</h2>
              <p className="text-xs text-base-content/60">Problem Statement: {selectedDecision.problem}</p>
            </div>

            {/* AI Review Evaluation */}
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-xs space-y-2">
              <h4 className="font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4" /> AI Logic & Reasoning Evaluation
              </h4>
              <p className="text-base-content/90 leading-relaxed">{selectedDecision.logicEvaluation}</p>
            </div>

            {/* Bias Flags */}
            {selectedDecision.biasFlags?.length > 0 && (
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-500 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Detected Cognitive Bias Flags
                </h4>
                <div className="space-y-2">
                  {selectedDecision.biasFlags.map((b: any, idx: number) => (
                    <div key={idx} className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs">
                      <span className="font-bold text-amber-400 block">⚠️ {b.bias}</span>
                      <p className="text-base-content/70 mt-0.5">{b.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Outcomes & Post Mortem */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-base-200 border border-base-300 rounded-xl">
                <span className="font-bold text-base-content/60 uppercase block mb-1">Expected Outcome</span>
                <p className="text-base-content/90">{selectedDecision.expectedOutcome || 'N/A'}</p>
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <span className="font-bold text-emerald-500 uppercase block mb-1">Actual Outcome & Lessons</span>
                <p className="text-base-content/90">{selectedDecision.actualOutcome || 'Post-mortem pending.'}</p>
                {selectedDecision.lessonsLearned && (
                  <p className="text-emerald-400 font-semibold mt-1">Lessons: {selectedDecision.lessonsLearned}</p>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-base-300 flex justify-between items-center">
              <Link href="/dashboard/graph" className="text-xs text-indigo-400 font-bold hover:underline flex items-center gap-1">
                View in Enterprise Memory Graph →
              </Link>
              <Button onClick={() => setSelectedDecision(null)} className="rounded-xl">Close Inspector</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
