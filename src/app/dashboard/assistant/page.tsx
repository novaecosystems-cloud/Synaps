'use client';

import React, { useState } from 'react';
import { 
  BrainCircuit, Sparkles, Send, FileText, Calendar, Scale, 
  FolderKanban, CheckCircle2, ShieldAlert, Loader2, Info, 
  Layers, ArrowRight, GitCommit, HelpCircle, ExternalLink, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AssistantPage() {
  const [query, setQuery] = useState('');
  const [asking, setAsking] = useState(false);
  const [assistantResult, setAssistantResult] = useState<any | null>(null);

  const presetQuestions = [
    "Explain our refund policy.",
    "Show projects involving customer X.",
    "When was this decision made?",
    "Find similar contracts.",
    "Summarize HR policies.",
    "Who approved this budget?",
    "How did we solve this issue previously?"
  ];

  const handleAskAssistant = async (qText?: string) => {
    const activeQuery = qText || query;
    if (!activeQuery.trim() || asking) return;
    setAsking(true);
    setAssistantResult(null);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: activeQuery })
      });
      const json = await res.json();
      if (json.success) {
        setAssistantResult(json.data);
      } else {
        alert(`Assistant Error: ${json.error}`);
      }
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="w-full space-y-8 font-sans pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-500 flex items-center justify-center">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-base-content">Enterprise Memory AI Assistant</h1>
            <p className="text-xs text-base-content/60">Ask natural language questions. Reasons across the Enterprise Memory Graph with zero hallucinations.</p>
          </div>
        </div>
        <Link href="/dashboard/graph" className="btn btn-outline btn-sm rounded-2xl gap-2">
          <Layers className="w-4 h-4 text-teal-500" /> Memory Graph
        </Link>
      </div>

      {/* QUESTION INPUT BAR */}
      <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
        <label className="text-xs font-bold uppercase tracking-wider text-base-content/60 block">Ask Organizational Memory</label>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskAssistant()}
            placeholder="e.g. Who approved the budget for the infrastructure migration project?"
            className="flex-1 bg-base-200 border border-base-300 rounded-2xl px-4 py-3 text-sm text-base-content outline-none focus:ring-2 focus:ring-teal-500/20"
          />
          <Button onClick={() => handleAskAssistant()} disabled={asking || !query.trim()} className="rounded-2xl gap-2 py-3 px-6 bg-teal-600 hover:bg-teal-700 text-white font-bold">
            {asking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {asking ? 'Querying Graph...' : 'Ask Assistant'}
          </Button>
        </div>

        {/* Preset Questions */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-bold text-base-content/40 uppercase">Try Asking:</span>
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => { setQuery(q); handleAskAssistant(q); }}
              className="text-xs px-3 py-1 rounded-full bg-base-200 hover:bg-teal-500/10 border border-base-300 hover:border-teal-500/30 text-base-content/70 hover:text-teal-400 transition-all text-left"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* ASSISTANT RESPONSE DISPLAY */}
      {asking ? (
        <div className="w-full py-20 bg-base-100 border border-base-300 rounded-3xl flex flex-col items-center justify-center space-y-4">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-teal-500/20 animate-ping"></div>
            <BrainCircuit className="w-10 h-10 text-teal-500 animate-pulse" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-base-content">Traversing Enterprise Memory Graph...</h3>
            <p className="text-xs text-base-content/60 max-w-sm mx-auto">
              Synthesizing factual evidence across connected documents, decisions, meetings, and timeline logs.
            </p>
          </div>
        </div>
      ) : assistantResult ? (
        <div className="space-y-8">
          
          {/* MAIN ANSWER BANNER */}
          <div className="p-8 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 border border-teal-500/30 text-white rounded-3xl shadow-2xl space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/20 border border-teal-500/30 px-3 py-1 rounded-full">
                  Graph RAG Grounded Answer
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-2 leading-snug">
                  "{assistantResult.query}"
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-teal-400">{assistantResult.confidenceScore}%</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Confidence</span>
              </div>
            </div>

            {/* Missing Knowledge Alert if applicable */}
            {assistantResult.isKnowledgeMissing ? (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3 text-amber-300 text-xs">
                <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400" />
                <div>
                  <strong className="block">Missing Organizational Knowledge Disclosed</strong>
                  Information for this exact query is currently missing from your uploaded enterprise documents and memory graph.
                </div>
              </div>
            ) : (
              <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {assistantResult.answer}
              </div>
            )}

            {/* TRAVERSED GRAPH NODES CHIPS */}
            {assistantResult.traversedGraphNodes?.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Traversed Enterprise Memory Graph Entities ({assistantResult.traversedGraphNodes.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {assistantResult.traversedGraphNodes.map((node: any, idx: number) => (
                    <div key={idx} className="px-3 py-1 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-mono">
                      🌐 {node.name} <span className="opacity-60 text-[10px]">[{node.type}]</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* METADATA GRID (SOURCE DOCS, TIMELINE, DECISIONS, EVIDENCE) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Source Documents */}
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-base-content uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-500" /> Grounded Source Documents
              </h3>
              
              <div className="space-y-2">
                {assistantResult.sourceDocuments?.map((doc: any, idx: number) => (
                  <div key={idx} className="p-3 bg-base-200 border border-base-300 rounded-2xl text-xs flex justify-between items-center">
                    <span className="font-bold text-base-content flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-500" /> {doc.name}
                    </span>
                    <Link href="/dashboard/documents" className="text-xs font-bold text-teal-500 hover:underline flex items-center gap-1">
                      View Doc <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Timeline Log */}
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-base-content uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-500" /> Event & Commit Timeline
              </h3>

              <div className="space-y-2">
                {assistantResult.timeline?.map((t: any, idx: number) => (
                  <div key={idx} className="p-3 bg-base-200 border border-base-300 rounded-2xl text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] font-bold text-teal-500 bg-teal-500/10 px-2 py-0.5 rounded">
                        {t.commitHash ? `commit ${t.commitHash}` : t.date}
                      </span>
                      <span className="text-[10px] text-base-content/50">{t.date}</span>
                    </div>
                    <p className="text-base-content font-medium">{t.event}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Connected Decisions & Projects */}
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-base-content uppercase tracking-wider flex items-center gap-2">
                <Scale className="w-4 h-4 text-teal-500" /> Connected Decisions & Projects
              </h3>

              <div className="space-y-2">
                {assistantResult.connectedDecisions?.map((dec: any, idx: number) => (
                  <div key={idx} className="p-3 bg-teal-500/5 border border-teal-500/20 rounded-2xl text-xs space-y-1">
                    <span className="font-bold text-teal-400 block">⚖️ {dec.title}</span>
                    <span className="text-[10px] text-base-content/60 block">Recommendation: {dec.recommendation || 'GO'} • Status: {dec.status || 'APPROVED'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Supporting Evidence Snippets */}
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-base-content uppercase tracking-wider flex items-center gap-2">
                <Info className="w-4 h-4 text-teal-500" /> Supporting Evidence Snippets
              </h3>

              <div className="space-y-2">
                {assistantResult.supportingEvidence?.map((ev: string, idx: number) => (
                  <div key={idx} className="p-3 bg-base-200 border border-base-300 rounded-2xl text-xs font-mono text-base-content/80 italic">
                    "{ev}"
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="w-full py-16 text-center bg-base-100 border border-base-300 border-dashed rounded-3xl space-y-4">
          <BrainCircuit className="w-12 h-12 text-base-content/30 mx-auto" />
          <div>
            <h3 className="text-lg font-bold text-base-content">Enterprise Assistant Standby</h3>
            <p className="text-xs text-base-content/60 max-w-md mx-auto mt-1">
              Ask any natural language question to reason across your Enterprise Memory Graph with zero hallucinations.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
