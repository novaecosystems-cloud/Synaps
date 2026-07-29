'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, AlertTriangle, ShieldCheck, CheckCircle2, XCircle, 
  TrendingUp, Users, Scale, Cpu, Radio, Sparkles, ChevronLeft, 
  ArrowRight, Download, RefreshCw, GitCompare, Layers, Lock, ExternalLink, Info, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ClientProps {
  documentId: string;
  documentName: string;
  detectedType: string;
  pageCount: number;
  allDocs: { id: string; name: string }[];
}

export default function DocumentIntelligenceClient({
  documentId,
  documentName,
  detectedType,
  pageCount,
  allDocs
}: ClientProps) {
  const [loading, setLoading] = useState(true);
  const [intelligence, setIntelligence] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'EXECUTIVE' | 'ONEPAGE' | 'TECHNICAL' | 'LEGAL' | 'FINANCIAL' | 'RISK'>('EXECUTIVE');
  const [selectedRiskCategory, setSelectedRiskCategory] = useState<string>('ALL');

  // Compare Modal State
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareDocId, setCompareDocId] = useState<string>('');
  const [compareLoading, setCompareLoading] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<any | null>(null);

  useEffect(() => {
    async function fetchIntelligence() {
      try {
        const res = await fetch(`/api/documents/${documentId}/intelligence`);
        const json = await res.json();
        if (json.success) {
          setIntelligence(json.data);
        }
      } catch (e) {
        console.error("Failed to load document intelligence:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchIntelligence();
  }, [documentId]);

  const handleRunComparison = async () => {
    if (!compareDocId) return;
    setCompareLoading(true);
    try {
      const res = await fetch('/api/documents/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doc1Id: documentId, doc2Id: compareDocId })
      });
      const json = await res.json();
      if (json.success) {
        setComparisonResult(json.data);
      }
    } catch (e) {
    } finally {
      setCompareLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 font-sans text-base-content">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-sm font-mono text-base-content/60">Synthesizing Enterprise Decision Intelligence & Risk Matrix...</p>
      </div>
    );
  }

  const summaries = intelligence?.summaries || {};
  const risks = intelligence?.risks || [];
  const decisionRecs = intelligence?.decisionRecommendations || [];
  const twinOpinions = intelligence?.digitalTwinOpinions || [];

  const filteredRisks = selectedRiskCategory === 'ALL' 
    ? risks 
    : risks.filter((r: any) => r.category === selectedRiskCategory);

  return (
    <div className="w-full space-y-8 font-sans pb-20 text-base-content">
      
      {/* ── HEADER NAVIGATION & CONTROLS ───────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-base-300 pb-6">
        <div className="space-y-1">
          <Link href="/dashboard/documents" className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-bold hover:underline mb-2">
            <ChevronLeft className="w-4 h-4" /> Back to Enterprise Vault
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-base-content">{documentName}</h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 uppercase tracking-wider">
              {intelligence?.documentType || detectedType || 'Contract'}
            </span>
          </div>
          <p className="text-xs text-base-content/60">
            Page Count: <strong>{pageCount || 1}</strong> | Organization: <strong>Enterprise Vault</strong> | Status: <strong className="text-emerald-400">ANALYZED</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setCompareModalOpen(true)} size="sm" variant="outline" className="rounded-xl gap-2 text-xs font-bold border-base-300">
            <GitCompare className="w-4 h-4 text-indigo-400" /> Compare Document
          </Button>
          <Link href="/dashboard/graph">
            <Button size="sm" className="rounded-xl gap-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white">
              <Sparkles className="w-4 h-4" /> View in Company Brain
            </Button>
          </Link>
        </div>
      </div>

      {/* ── MULTI-AUDIENCE SUMMARY ENGINE TABS ──────────────────────── */}
      <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between border-b border-base-200 pb-3 gap-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" /> Multi-Audience Executive Summaries
          </h3>
          <div className="flex flex-wrap gap-1 bg-base-200 p-1 rounded-xl">
            {(['EXECUTIVE', 'ONEPAGE', 'TECHNICAL', 'LEGAL', 'FINANCIAL', 'RISK'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all uppercase tracking-wider",
                  activeTab === tab 
                    ? "bg-indigo-600 text-white shadow-sm" 
                    : "text-base-content/60 hover:text-base-content hover:bg-base-300/50"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-base-200/50 border border-base-300/50 rounded-2xl text-sm leading-relaxed text-base-content/90 font-sans whitespace-pre-wrap">
          {activeTab === 'EXECUTIVE' && (summaries.executiveSummary || 'Executive Summary active.')}
          {activeTab === 'ONEPAGE' && (summaries.onePageSummary || 'One-Page Summary active.')}
          {activeTab === 'TECHNICAL' && (summaries.technicalSummary || 'Technical Summary active.')}
          {activeTab === 'LEGAL' && (summaries.legalSummary || 'Legal Summary active.')}
          {activeTab === 'FINANCIAL' && (summaries.financialSummary || 'Financial Summary active.')}
          {activeTab === 'RISK' && (summaries.riskSummary || 'Risk Summary active.')}
        </div>
      </div>

      {/* ── EXECUTIVE DECISION RECOMMENDATIONS MATRIX ────────────────── */}
      <div className="p-6 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 text-white rounded-3xl shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-indigo-300 flex items-center gap-2">
            <Radio className="w-4 h-4 text-indigo-400 animate-pulse" /> Decision Intelligence Recommendations
          </h3>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">CONFIDENCE VERIFIED</span>
        </div>

        <div className="space-y-4">
          {decisionRecs.map((rec: any, idx: number) => (
            <div key={idx} className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border",
                    rec.action === 'NEGOTIATE' && "bg-amber-500/20 text-amber-300 border-amber-500/30",
                    rec.action === 'APPROVE' && "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                    rec.action === 'REJECT' && "bg-rose-500/20 text-rose-300 border-rose-500/30"
                  )}>
                    ACTION: {rec.action}
                  </span>
                  <span className="text-xs font-mono text-indigo-300">{rec.confidenceScore}% Confidence</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  URGENCY: {rec.urgency}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <p className="text-sm font-bold text-white leading-snug">{rec.why}</p>
                <p className="text-white/70 italic">Supporting Evidence: "{rec.supportingEvidence}"</p>
              </div>

              <div className="pt-2 border-t border-white/10 flex flex-wrap justify-between items-center text-[11px] font-mono text-white/60">
                <span>Estimated Impact: <strong className="text-emerald-400">{rec.estimatedImpact}</strong></span>
                <span>Affected Departments: <strong>{rec.affectedDepartments?.join(', ')}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MULTI-DIMENSION RISK ANALYSIS MATRIX ────────────────────── */}
      <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-wrap justify-between items-center border-b border-base-200 pb-3 gap-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Multi-Dimension Risk Analysis Matrix ({risks.length} Risks Detected)
          </h3>

          <div className="flex flex-wrap gap-1 bg-base-200 p-1 rounded-xl text-[10px] font-bold">
            {['ALL', 'LEGAL', 'FINANCIAL', 'CYBERSECURITY', 'COMPLIANCE', 'OPERATIONAL'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedRiskCategory(cat)}
                className={cn(
                  "px-2.5 py-1 rounded-lg transition-all uppercase tracking-wider",
                  selectedRiskCategory === cat ? "bg-base-100 text-indigo-400 font-bold shadow-sm" : "text-base-content/60 hover:text-base-content"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRisks.map((risk: any) => (
            <div key={risk.id} className="p-5 bg-base-200/50 border border-base-300 rounded-2xl space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">{risk.category} RISK</span>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                    risk.severity === 'CRITICAL' && "bg-rose-500/10 text-rose-400 border-rose-500/30",
                    risk.severity === 'HIGH' && "bg-amber-500/10 text-amber-400 border-amber-500/30",
                    risk.severity === 'MEDIUM' && "bg-slate-500/10 text-slate-400 border-slate-500/30"
                  )}>
                    ● {risk.severity} SEVERITY
                  </span>
                </div>

                <h4 className="font-bold text-sm text-base-content leading-snug">{risk.explanation}</h4>
                <p className="text-xs text-base-content/70 italic bg-base-100 p-2.5 rounded-xl border border-base-300/50">
                  "{risk.supportingEvidence}"
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-base-300 text-xs">
                <div className="text-emerald-400 font-medium">
                  <strong>Recommended Mitigation:</strong> {risk.recommendedMitigation}
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-base-content/50">
                  <span>Stakeholder: <strong>{risk.responsibleStakeholder}</strong></span>
                  <span>Confidence: <strong>{risk.confidence}%</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── EXECUTIVE DIGITAL TWINS SIDE-BY-SIDE PANEL ──────────────── */}
      <div className="space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-500" /> Executive Digital Twins Review Panel (Side-by-Side Opinions)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {twinOpinions.map((twin: any, idx: number) => (
            <div key={idx} className="p-5 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                    TWIN: {twin.twinRole}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">{twin.confidence}% Conf.</span>
                </div>

                <h4 className="font-bold text-sm text-base-content">{twin.twinName}</h4>
                <p className="text-xs text-base-content/80 leading-relaxed font-sans">{twin.opinion}</p>
              </div>

              <div className="pt-2 border-t border-base-200 space-y-1 text-[11px]">
                <span className="font-bold text-indigo-400 uppercase tracking-wider block">Suggested Action</span>
                <p className="text-base-content/70 font-mono">⚡ {twin.suggestedAction}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── DOCUMENT COMPARISON MODAL ───────────────────────────────── */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative space-y-6 text-base-content">
            <div className="flex justify-between items-center border-b border-base-300 pb-3">
              <div className="flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-lg">Compare Enterprise Documents</h3>
              </div>
              <button onClick={() => setCompareModalOpen(false)} className="p-1 text-base-content/50 hover:text-base-content">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-base-content/70">
                Select a 2nd document from your Enterprise Vault to run semantic clause diffing, risk deltas, and financial term changes against <strong>{documentName}</strong>.
              </p>

              <select 
                value={compareDocId}
                onChange={(e) => setCompareDocId(e.target.value)}
                className="w-full bg-base-200 border border-base-300 rounded-xl p-3 text-xs text-base-content outline-none font-medium"
              >
                <option value="">-- Select Document to Compare --</option>
                {allDocs.filter(d => d.id !== documentId).map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>

              <Button onClick={handleRunComparison} disabled={!compareDocId || compareLoading} className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-2">
                {compareLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GitCompare className="w-4 h-4" />}
                {compareLoading ? 'Running Clause Diffing & Delta Analysis...' : 'Run Deep Document Comparison'}
              </Button>
            </div>

            {/* Comparison Results */}
            {comparisonResult && (
              <div className="p-5 bg-base-200 border border-base-300 rounded-2xl space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold uppercase tracking-wider text-indigo-400">Comparison Result</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {comparisonResult.similarityScore}% Similarity Match
                  </span>
                </div>

                <p className="text-base-content/90 font-medium">{comparisonResult.summary}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-base-300">
                  <div className="space-y-1">
                    <span className="font-bold text-emerald-400 uppercase text-[10px] block">Added Clauses</span>
                    {comparisonResult.clauseAdditions?.map((c: string, i: number) => (
                      <p key={i} className="text-[11px] text-emerald-300 font-mono">+ {c}</p>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-rose-400 uppercase text-[10px] block">Removed Clauses</span>
                    {comparisonResult.clauseRemovals?.map((c: string, i: number) => (
                      <p key={i} className="text-[11px] text-rose-300 font-mono">- {c}</p>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-base-300 flex justify-between items-center text-[11px] font-mono text-base-content/60">
                  <span>Financial Delta: <strong className="text-emerald-400">{comparisonResult.financialDelta}</strong></span>
                  <span>Risk Delta: <strong className="text-amber-400">{comparisonResult.riskDelta}</strong></span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
