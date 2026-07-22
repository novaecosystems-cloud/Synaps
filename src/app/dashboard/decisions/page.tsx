'use client';

import React, { useState, useEffect } from 'react';
import { 
  Scale, BrainCircuit, ShieldAlert, AlertTriangle, CheckCircle2, 
  Sparkles, Search, Plus, FileText, Layers, History, RefreshCw, 
  ChevronRight, ArrowUpRight, X, Loader2, Info, Flame, DollarSign,
  Briefcase, CheckSquare, Edit3, Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DecisionsPage() {
  const [decisions, setDecisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

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

  const fetchDecisions = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (selectedStatus && selectedStatus !== 'ALL') params.set('status', selectedStatus);

      const res = await fetch(`/api/decisions/memory?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setDecisions(json.data);
      } else {
        setError(json.error || 'Failed to load decision memory');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching decision memory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecisions();
  }, [selectedStatus]);

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
    <div className="w-full space-y-8 font-sans pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-base-content">Decision Intelligence & Memory Hub</h1>
            <p className="text-xs text-base-content/60">Evaluate logic, bias, risks & impact. Search permanent Decision Memory & historical cross-references.</p>
          </div>
        </div>
        <Button onClick={() => setShowSubmitModal(true)} className="gap-2 rounded-2xl">
          <Sparkles className="w-4 h-4" /> Submit Decision for AI Review
        </Button>
      </div>

      {/* SEARCH & STATUS FILTER */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-base-content/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchDecisions()}
            placeholder="Search Decision Memory..."
            className="w-full pl-9 pr-4 py-2 bg-base-100 border border-base-300 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto custom-scrollbar pb-1">
          {['ALL', 'UNDER_REVIEW', 'APPROVED', 'EXECUTED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border",
                selectedStatus === st
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-base-100 border-base-300 text-base-content/70 hover:text-base-content"
              )}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* AI REVIEW RESULT HERO BANNER (If newly created) */}
      {aiReviewResult && (
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white rounded-3xl shadow-2xl relative space-y-4">
          <button onClick={() => setAiReviewResult(null)} className="absolute top-4 right-4 p-1 text-white/50 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm text-indigo-300 uppercase tracking-wider">Decision AI Review Generated & Stored in Decision Memory</h3>
          </div>

          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold text-white">{aiReviewResult.title}</h2>
            {getRecBadge(aiReviewResult.recommendation)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1">
              <span className="font-bold text-indigo-300 uppercase block">Logic & Reasoning Evaluation</span>
              <p className="text-slate-300 leading-relaxed">{aiReviewResult.logicEvaluation}</p>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1">
              <span className="font-bold text-amber-300 uppercase block">Detected Cognitive Bias Flags</span>
              {aiReviewResult.biasFlags?.length > 0 ? (
                aiReviewResult.biasFlags.map((b: any, i: number) => (
                  <p key={i} className="text-amber-200 font-medium">⚠️ {b.bias}: {b.description}</p>
                ))
              ) : (
                <p className="text-slate-400">No bias flags detected.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SEARCHABLE DECISION MEMORY GRID */}
      {loading ? (
        <div className="w-full py-16 flex flex-col items-center justify-center text-base-content">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          <p className="text-sm font-medium">Querying Decision Memory Database...</p>
        </div>
      ) : error ? (
        <div className="w-full p-8 text-center bg-base-200 border border-base-300 rounded-3xl">
          <ShieldAlert className="w-10 h-10 text-destructive mx-auto mb-3" />
          <h3 className="text-lg font-bold">Failed to query Decision Memory</h3>
          <p className="text-xs text-base-content/60 max-w-md mx-auto mt-1 mb-4">{error}</p>
          <Button onClick={fetchDecisions} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" /> Retry
          </Button>
        </div>
      ) : decisions.length === 0 ? (
        <div className="w-full py-16 text-center bg-base-100 border border-base-300 border-dashed rounded-3xl space-y-3">
          <Scale className="w-12 h-12 text-base-content/30 mx-auto" />
          <h3 className="text-lg font-bold text-base-content">No Decisions Stored Yet</h3>
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
              className="bg-base-100 border border-base-300 hover:border-primary/40 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  {getRecBadge(dec.recommendation)}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50">
                    {dec.confidence}% Conf.
                  </span>
                </div>

                <h3 className="font-bold text-lg text-base-content group-hover:text-primary transition-colors leading-snug line-clamp-1">
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
                    <CheckCircle2 className="w-3.5 h-3.5" /> Post-Mortem Outcome Recorded
                  </div>
                ) : (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setPostMortemTarget(dec); }}
                    className="text-[11px] text-primary font-bold hover:underline flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Log Actual Outcome & Lessons
                  </button>
                )}

                <div className="flex items-center justify-between text-xs text-primary font-bold pt-1">
                  <span>Inspect Decision Memory</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
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
              <Sparkles className="w-5 h-5 text-primary" />
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
                  className="w-full bg-base-200 border border-base-300 rounded-2xl p-3 text-sm text-base-content outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-base-content/60 uppercase tracking-wider block mb-1">Problem Statement</label>
                <textarea 
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  rows={3}
                  placeholder="What core operational or business problem does this decision resolve?"
                  className="w-full bg-base-200 border border-base-300 rounded-2xl p-3 text-sm text-base-content outline-none focus:ring-2 focus:ring-primary/20 custom-scrollbar resize-none"
                ></textarea>
              </div>

              <div>
                <label className="text-xs font-bold text-base-content/60 uppercase tracking-wider block mb-1">Background Context</label>
                <textarea 
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  rows={3}
                  placeholder="Supporting background, data points, or project constraints..."
                  className="w-full bg-base-200 border border-base-300 rounded-2xl p-3 text-sm text-base-content outline-none focus:ring-2 focus:ring-primary/20 custom-scrollbar resize-none"
                ></textarea>
              </div>

              <div>
                <label className="text-xs font-bold text-base-content/60 uppercase tracking-wider block mb-1">Expected Outcome</label>
                <input 
                  type="text" 
                  value={expectedOutcome}
                  onChange={(e) => setExpectedOutcome(e.target.value)}
                  placeholder="e.g. 99.99% Uptime, 30% reduction in latency"
                  className="w-full bg-base-200 border border-base-300 rounded-2xl p-3 text-sm text-base-content outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button onClick={() => setShowSubmitModal(false)} variant="ghost" className="rounded-xl">Cancel</Button>
              <Button onClick={handleReviewDecision} disabled={submitting} className="rounded-xl gap-2">
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
                  className="w-full bg-base-200 border border-base-300 rounded-2xl p-3 text-sm text-base-content outline-none focus:ring-2 focus:ring-primary/20 custom-scrollbar resize-none"
                ></textarea>
              </div>

              <div>
                <label className="text-xs font-bold text-base-content/60 uppercase tracking-wider block mb-1">Lessons Learned</label>
                <textarea 
                  value={lessonsLearned}
                  onChange={(e) => setLessonsLearned(e.target.value)}
                  rows={3}
                  placeholder="What lessons should future decisions reference?"
                  className="w-full bg-base-200 border border-base-300 rounded-2xl p-3 text-sm text-base-content outline-none focus:ring-2 focus:ring-primary/20 custom-scrollbar resize-none"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button onClick={() => setPostMortemTarget(null)} variant="ghost" className="rounded-xl">Cancel</Button>
              <Button onClick={handleSavePostMortem} disabled={savingOutcome} className="rounded-xl gap-2">
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

            {/* Missing Info */}
            {selectedDecision.missingInformation?.length > 0 && (
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-red-500 mb-2 flex items-center gap-1.5">
                  <Flame className="w-4 h-4" /> Missing Information & Blind Spots
                </h4>
                <div className="space-y-1">
                  {selectedDecision.missingInformation.map((info: string, idx: number) => (
                    <div key={idx} className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-medium text-red-400">
                      • {info}
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
              <Link href="/dashboard/graph" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
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
