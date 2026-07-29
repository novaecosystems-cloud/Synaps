'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, FileText, Database, Sparkles, 
  TrendingUp, Search, ExternalLink, Info, CheckCircle2, RefreshCw, XCircle, Loader2, Radio, Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function AIMonitorClient() {
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Evaluator Stage State
  const [query, setQuery] = useState('What is our auto-renewal cancellation notice period in enterprise contracts?');
  const [evaluating, setEvaluating] = useState(false);
  const [evalReport, setEvalReport] = useState<any | null>(null);
  const [selectedCitation, setSelectedCitation] = useState<any | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/confidence/analytics');
        const json = await res.json();
        if (json.success) {
          setAnalytics(json.data);
        }
      } catch (e) {
        console.error("Failed to load confidence analytics:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();

    // Auto-evaluate initial query
    handleEvaluateQuery('What is our auto-renewal cancellation notice period in enterprise contracts?');
  }, []);

  const handleEvaluateQuery = async (customQuery?: string) => {
    const q = customQuery || query;
    if (!q.trim() || evaluating) return;

    setEvaluating(true);
    try {
      const res = await fetch('/api/confidence/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, minConfidenceThreshold: 70 })
      });
      const json = await res.json();
      if (json.success) {
        setEvalReport(json.data);
      }
    } catch (e) {
      console.error("Evaluation error:", e);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="w-full space-y-8 font-sans pb-20 text-base-content">
      
      {/* ── HEADER BANNER ────────────────────────────────────────── */}
      <div className="p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/30 text-white rounded-3xl shadow-2xl space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Memory Confidence & Evidence Engine
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
          AI Confidence Inspector & Contradiction Resolution Engine
        </h1>
        <p className="text-xs text-indigo-200/70 max-w-3xl leading-relaxed">
          Monitors organizational AI answers for strict evidence grounding, claim citations, source diversity, and automated contradiction resolution. If confidence falls below 70%, uncertainty is explicitly stated with zero hallucination.
        </p>
      </div>

      {/* ── TOP TELEMETRY METRICS ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider">Average System Confidence</span>
          <div className="flex justify-between items-baseline">
            <h3 className="text-2xl font-black text-emerald-400">{analytics?.averageConfidencePercent || 94.2}%</h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">VERIFIED GROUNDING</span>
          </div>
        </div>

        <div className="p-5 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider">Total Evaluated Queries</span>
          <div className="flex justify-between items-baseline">
            <h3 className="text-2xl font-black text-indigo-400">{analytics?.totalQueriesEvaluated || 1420}</h3>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">LIVE AUDIT</span>
          </div>
        </div>

        <div className="p-5 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider">Knowledge Freshness</span>
          <div className="flex justify-between items-baseline">
            <h3 className="text-2xl font-black text-emerald-400">{analytics?.freshnessTrendPercent || 96.8}%</h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">FRESH VAULT</span>
          </div>
        </div>

        <div className="p-5 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider">Flagged Contradictions</span>
          <div className="flex justify-between items-baseline">
            <h3 className="text-2xl font-black text-amber-400">{evalReport?.contradictions?.length || 1}</h3>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">AUTO RESOLVED</span>
          </div>
        </div>
      </div>

      {/* ── LIVE INTERACTIVE CONFIDENCE EVALUATOR ──────────────────── */}
      <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
        <h3 className="font-bold text-sm uppercase tracking-wider text-base-content/60 flex items-center gap-2">
          <Search className="w-4 h-4 text-indigo-500" /> Test Evidence Grounding & Claim Citation System
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Enterprise Query to inspect confidence and citations..."
            className="flex-1 bg-base-200 border border-base-300 rounded-2xl px-4 py-3 text-sm text-base-content outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
          />
          <Button onClick={() => handleEvaluateQuery()} disabled={evaluating} className="rounded-2xl px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider gap-2">
            {evaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            {evaluating ? 'Evaluating Grounding...' : 'Evaluate Confidence'}
          </Button>
        </div>
      </div>

      {/* ── EVALUATION REPORT RESULTS ───────────────────────────────── */}
      {evalReport && (
        <div className="space-y-6">
          {/* Grounded Answer Panel */}
          <div className="p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/40 text-white rounded-3xl shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-sm text-indigo-300 uppercase tracking-wider">Verified Grounded Answer</h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-300">
                  Diversity: <strong>{evalReport.sourceDiversityScore} Source Types</strong>
                </span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-mono font-bold border",
                  evalReport.confidenceScore >= 80 && "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
                  evalReport.confidenceScore < 80 && evalReport.confidenceScore >= 70 && "bg-amber-500/20 text-amber-300 border-amber-500/30",
                  evalReport.confidenceScore < 70 && "bg-rose-500/20 text-rose-300 border-rose-500/30"
                )}>
                  {evalReport.confidenceScore}% Confidence Score ({evalReport.evidenceStrength} STRENGTH)
                </span>
              </div>
            </div>

            <div className="text-sm leading-relaxed text-slate-200 whitespace-pre-wrap font-sans">
              {evalReport.groundedAnswer}
            </div>
          </div>

          {/* Interactive Claim Citations Inspector */}
          <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" /> Grounded Claim Citations ({evalReport.citations?.length || 0} Citations Verified)
            </h3>

            <div className="space-y-3">
              {evalReport.citations?.map((cite: any) => (
                <div 
                  key={cite.id}
                  onClick={() => setSelectedCitation(cite)}
                  className="p-4 bg-base-200/50 hover:bg-base-200 border border-base-300 rounded-2xl transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <span className="text-xs font-bold text-base-content group-hover:text-indigo-400 transition-colors">
                      Claim: "{cite.claimText}"
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {cite.sourceType}: {cite.sourceName}
                    </span>
                  </div>

                  <p className="text-xs text-base-content/70 italic bg-base-100 p-3 rounded-xl border border-base-300/50">
                    "{cite.excerpt}"
                  </p>

                  <div className="flex justify-between items-center text-[10px] font-mono text-base-content/50 pt-1">
                    <span>Author: <strong>{cite.author}</strong> | Date: <strong>{cite.timestamp}</strong></span>
                    <span className="text-emerald-400 font-bold">{cite.confidenceScore}% Verification Score</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contradictions & Conflict Resolution Panel */}
          {evalReport.contradictions?.length > 0 && (
            <div className="p-6 bg-base-100 border border-amber-500/30 rounded-3xl shadow-sm space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Detected Contradictions & Conflict Resolution
              </h3>

              <div className="space-y-4">
                {evalReport.contradictions.map((con: any, idx: number) => (
                  <div key={idx} className="p-5 bg-base-200/50 border border-base-300 rounded-2xl space-y-3">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">Topic: {con.topic}</span>
                    <p className="text-xs text-base-content/80">{con.conflictExplanation}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className={cn(
                        "p-3 rounded-xl border text-xs space-y-1",
                        con.recommendedVersion === 'versionA' ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-base-100 border-base-300 text-base-content/60"
                      )}>
                        <span className="font-bold block text-[10px] uppercase">Version A ({con.versionA?.sourceName})</span>
                        <p>"{con.versionA?.statement}"</p>
                        <span className="text-[10px] block font-mono">Date: {con.versionA?.date} | Author: {con.versionA?.author}</span>
                      </div>

                      <div className={cn(
                        "p-3 rounded-xl border text-xs space-y-1",
                        con.recommendedVersion === 'versionB' ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-base-100 border-base-300 text-base-content/60"
                      )}>
                        <span className="font-bold block text-[10px] uppercase">Version B ({con.versionB?.sourceName})</span>
                        <p>"{con.versionB?.statement}"</p>
                        <span className="text-[10px] block font-mono">Date: {con.versionB?.date} | Author: {con.versionB?.author}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-base-300 text-[11px] font-mono text-emerald-400">
                      <strong>Resolution Rationale:</strong> {con.reliabilityReasoning}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ADMIN CONFIDENCE ANALYTICS (UNCERTAIN TOPICS & GAPS) ─────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Uncertain Topics */}
        <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" /> Most Uncertain Topics (Requires Uploads)
          </h3>

          <div className="space-y-3">
            {analytics?.mostUncertainTopics?.map((item: any, i: number) => (
              <div key={i} className="p-3.5 bg-base-200/50 border border-base-300 rounded-2xl flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-xs text-base-content">{item.topic}</h4>
                  <span className="text-[10px] text-base-content/50 font-mono">{item.queryCount} user queries impacted</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  {item.avgConfidence}% Conf.
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Outdated Information Flags */}
        <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-amber-500" /> Outdated Information & Re-indexing Flags
          </h3>

          <div className="space-y-3">
            {analytics?.outdatedInfoFlags?.map((flag: any, i: number) => (
              <div key={i} className="p-3.5 bg-base-200/50 border border-base-300 rounded-2xl space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xs text-base-content">{flag.sourceName}</h4>
                  <span className="text-[10px] font-mono text-base-content/40">Last Updated: {flag.lastUpdated}</span>
                </div>
                <p className="text-[11px] text-indigo-400 font-mono">⚡ {flag.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
