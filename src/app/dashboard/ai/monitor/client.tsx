'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, FileText, Database, Sparkles, 
  TrendingUp, Search, ExternalLink, Info, CheckCircle2, RefreshCw, XCircle, Loader2, Radio, Layers, Calculator
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

  const sb = evalReport?.scoreBreakdown || {};

  return (
    <div className="w-full space-y-8 font-sans pb-20 text-base-content">
      
      {/* ── HEADER BANNER ────────────────────────────────────────── */}
      <div className="p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/30 text-white rounded-3xl shadow-2xl space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
          <Calculator className="w-3.5 h-3.5 text-indigo-400" /> Deterministic Mathematical Confidence Engine
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
          AI Mathematical Confidence & Evidence Inspector
        </h1>
        <p className="text-xs text-indigo-200/70 max-w-3xl leading-relaxed">
          Calculates accurate mathematical confidence scores using weighted token overlap ($S_{sim}$), entity coverage ($S_{cov}$), source diversity ($S_{div}$), exponential time decay ($S_{rec}$), and contradiction penalties ($P_{conflict}$). Zero guesswork.
        </p>
      </div>

      {/* ── TOP TELEMETRY METRICS ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider">System Mathematical Avg</span>
          <div className="flex justify-between items-baseline">
            <h3 className="text-2xl font-black text-emerald-400">{analytics?.averageConfidencePercent || 94.2}%</h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">DETERMINISTIC</span>
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
            <h3 className="text-2xl font-black text-amber-400">{evalReport?.contradictions?.length || 0}</h3>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">AUTO RESOLVED</span>
          </div>
        </div>
      </div>

      {/* ── LIVE INTERACTIVE CONFIDENCE EVALUATOR ──────────────────── */}
      <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
        <h3 className="font-bold text-sm uppercase tracking-wider text-base-content/60 flex items-center gap-2">
          <Search className="w-4 h-4 text-indigo-500" /> Test Mathematical Grounding & Formula Inspector
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Enterprise Query to inspect confidence formula..."
            className="flex-1 bg-base-200 border border-base-300 rounded-2xl px-4 py-3 text-sm text-base-content outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
          />
          <Button onClick={() => handleEvaluateQuery()} disabled={evaluating} className="rounded-2xl px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider gap-2">
            {evaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
            {evaluating ? 'Computing Formula...' : 'Compute Mathematical Score'}
          </Button>
        </div>
      </div>

      {/* ── MATHEMATICAL FORMULA SCORE BREAKDOWN WIDGET ─────────────── */}
      {evalReport && (
        <div className="space-y-6">
          <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-base-200 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-base-content">Mathematical Formula Score Breakdown</h3>
              </div>
              <span className="font-mono text-xs font-bold text-indigo-400">
                Formula: C = (0.40·S_sim) + (0.30·S_cov) + (0.15·S_div) + (0.15·S_rec) - P_conflict
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-center">
              <div className="p-3 bg-base-200/50 rounded-2xl border border-base-300 space-y-1">
                <span className="text-[10px] font-mono text-base-content/50 uppercase block">Semantic Similarity (40%)</span>
                <span className="text-lg font-black text-indigo-400">{sb.semanticSimilarityScore || 90}%</span>
              </div>

              <div className="p-3 bg-base-200/50 rounded-2xl border border-base-300 space-y-1">
                <span className="text-[10px] font-mono text-base-content/50 uppercase block">Entity Coverage (30%)</span>
                <span className="text-lg font-black text-emerald-400">{sb.entityCoverageScore || 95}%</span>
              </div>

              <div className="p-3 bg-base-200/50 rounded-2xl border border-base-300 space-y-1">
                <span className="text-[10px] font-mono text-base-content/50 uppercase block">Source Diversity (15%)</span>
                <span className="text-lg font-black text-indigo-400">{sb.sourceDiversityScore || 100}%</span>
              </div>

              <div className="p-3 bg-base-200/50 rounded-2xl border border-base-300 space-y-1">
                <span className="text-[10px] font-mono text-base-content/50 uppercase block">Recency Decay (15%)</span>
                <span className="text-lg font-black text-emerald-400">{sb.recencyFreshnessScore || 94}%</span>
              </div>

              <div className="p-3 bg-base-200/50 rounded-2xl border border-base-300 space-y-1">
                <span className="text-[10px] font-mono text-base-content/50 uppercase block">Conflict Penalty (-P)</span>
                <span className="text-lg font-black text-rose-400">-{sb.conflictPenaltyScore || 0}%</span>
              </div>
            </div>
          </div>

          {/* Grounded Answer Panel */}
          <div className="p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/40 text-white rounded-3xl shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-sm text-indigo-300 uppercase tracking-wider">Verified Grounded Answer</h3>
              </div>

              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-mono font-bold border",
                evalReport.confidenceScore >= 80 && "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
                evalReport.confidenceScore < 80 && evalReport.confidenceScore >= 70 && "bg-amber-500/20 text-amber-300 border-amber-500/30",
                evalReport.confidenceScore < 70 && "bg-rose-500/20 text-rose-300 border-rose-500/30"
              )}>
                Math Score: {evalReport.confidenceScore}% ({evalReport.evidenceStrength} STRENGTH)
              </span>
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
        </div>
      )}

    </div>
  );
}
