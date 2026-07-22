'use client';

import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, ShieldAlert, CheckCircle2, AlertTriangle, Activity, 
  HelpCircle, ChevronRight, FileText, Send, Sparkles, RefreshCw, 
  Layers, ArrowUpRight, Clock, Building2, ExternalLink, X, MessageSquare,
  TrendingUp, TrendingDown, Info, ShieldCheck, Flame, Scale
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Citation {
  documentId?: string;
  documentName: string;
  snippet: string;
}

interface ExecutiveAnswer {
  id: string;
  question: string;
  answer: string;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'INFO';
  citations: Citation[];
}

interface DepartmentHealth {
  department: string;
  healthScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'CRITICAL';
  summary: string;
  activeIssuesCount: number;
  citations: Citation[];
}

interface AIRecommendation {
  id: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  title: string;
  recommendation: string;
  rationale: string;
  citations: Citation[];
}

interface ExecutiveBriefData {
  executiveBrief: string;
  healthScore: number;
  knowledgeCoverage: number;
  riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'CRITICAL';
  decisionConfidence: number;
  executiveAnswers: ExecutiveAnswer[];
  departmentHealth: DepartmentHealth[];
  aiRecommendations: AIRecommendation[];
  recentEvents: { date: string; title: string; category: string; description: string; docName?: string }[];
  timelineHighlights: { date: string; milestone: string; impact: string }[];
}

export default function ExecutiveDashboardClient({ userName }: { userName: string }) {
  const [data, setData] = useState<ExecutiveBriefData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active modal inspection states
  const [activeAnswer, setActiveAnswer] = useState<ExecutiveAnswer | null>(null);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);

  // Custom AI COO question
  const [customQuestion, setCustomQuestion] = useState('');
  const [askingCustom, setAskingCustom] = useState(false);
  const [customResponse, setCustomResponse] = useState<any | null>(null);

  const fetchBriefData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/executive/brief');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.error || 'Failed to load executive brief');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching brief');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBriefData();
  }, []);

  const handleCustomQuestion = async () => {
    if (!customQuestion.trim() || askingCustom) return;
    setAskingCustom(true);
    try {
      const res = await fetch('/api/executive/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: customQuestion })
      });
      const json = await res.json();
      if (json.success) {
        setCustomResponse(json.data);
      } else {
        setCustomResponse({ answer: `Error: ${json.error}`, citations: [] });
      }
    } catch (e: any) {
      setCustomResponse({ answer: `Error: ${e.message}`, citations: [] });
    } finally {
      setAskingCustom(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Healthy</span>;
      case 'WARNING':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Attention</span>;
      case 'CRITICAL':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1"><Flame className="w-3 h-3" /> High Risk</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1"><Info className="w-3 h-3" /> Info</span>;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'LOW':
        return <span className="text-emerald-400 font-bold text-sm">Low Risk</span>;
      case 'MODERATE':
        return <span className="text-amber-400 font-bold text-sm">Moderate Risk</span>;
      case 'ELEVATED':
      case 'CRITICAL':
        return <span className="text-red-400 font-bold text-sm">Elevated Risk</span>;
      default:
        return <span className="text-slate-400 font-bold text-sm">Normal</span>;
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center text-base-content">
        <BrainCircuit className="w-12 h-12 text-primary animate-pulse mb-4" />
        <h3 className="text-lg font-bold">Initializing AI COO Briefing...</h3>
        <p className="text-xs text-base-content/60 mt-1">Synthesizing company documents, projects, decisions, and memory graph.</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full p-8 text-center bg-base-200 border border-base-300 rounded-3xl">
        <ShieldAlert className="w-10 h-10 text-destructive mx-auto mb-3" />
        <h3 className="text-lg font-bold">Failed to load AI COO Briefing</h3>
        <p className="text-xs text-base-content/60 max-w-md mx-auto mt-1 mb-4">{error || 'Unknown error'}</p>
        <Button onClick={fetchBriefData} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" /> Retry Briefing
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 font-sans pb-16">
      
      {/* 1. HERO AI COO BRIEFING BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 text-white p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                <BrainCircuit className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">AI COO Command Console</span>
                <h1 className="text-2xl font-bold tracking-tight text-white">Executive Operational Briefing</h1>
              </div>
            </div>
            <button onClick={fetchBriefData} className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-medium flex items-center gap-2 transition-all">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Intelligence
            </button>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed max-w-4xl bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
            {data.executiveBrief}
          </p>
        </div>
      </div>

      {/* 2. EXECUTIVE SCORECARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-base-100 border border-base-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] uppercase font-bold text-base-content/60 tracking-wider">Org Health Score</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight">{data.healthScore}</span>
            <span className="text-xs font-bold text-emerald-500">/ 100</span>
          </div>
          <div className="w-full bg-base-200 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${data.healthScore}%` }}></div>
          </div>
        </div>

        <div className="bg-base-100 border border-base-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] uppercase font-bold text-base-content/60 tracking-wider">Knowledge Coverage</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight">{data.knowledgeCoverage}%</span>
            <span className="text-xs font-bold text-indigo-500">Ingested</span>
          </div>
          <div className="w-full bg-base-200 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${data.knowledgeCoverage}%` }}></div>
          </div>
        </div>

        <div className="bg-base-100 border border-base-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] uppercase font-bold text-base-content/60 tracking-wider">Overall Risk Level</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            {getRiskBadge(data.riskLevel)}
          </div>
          <p className="text-[11px] text-base-content/50 mt-3">Evaluated across Gaps & Compliance</p>
        </div>

        <div className="bg-base-100 border border-base-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] uppercase font-bold text-base-content/60 tracking-wider">Decision Confidence</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight">{data.decisionConfidence}%</span>
            <span className="text-xs font-bold text-blue-500">Confidence</span>
          </div>
          <div className="w-full bg-base-200 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${data.decisionConfidence}%` }}></div>
          </div>
        </div>
      </div>

      {/* 3. EXECUTIVE QUESTIONS MATRIX */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-base-content flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" /> Key Executive Questions
            </h2>
            <p className="text-xs text-base-content/60">Click any card to inspect full AI analysis and document citations.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.executiveAnswers.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setActiveAnswer(item)}
              className="bg-base-100 border border-base-300 hover:border-primary/40 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-base text-base-content group-hover:text-primary transition-colors leading-snug">
                    {item.question}
                  </h3>
                  {getStatusBadge(item.status)}
                </div>
                <p className="text-xs text-base-content/70 line-clamp-3 leading-relaxed mb-4">
                  {item.answer}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-base-200 text-xs text-base-content/50">
                <span className="flex items-center gap-1.5 font-medium text-primary text-[11px]">
                  <FileText className="w-3.5 h-3.5" /> {item.citations.length} Document Citations
                </span>
                <span className="group-hover:translate-x-1 transition-transform text-primary font-bold">Inspect →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. DEPARTMENT HEALTH MATRIX & AI RECOMMENDATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Department Health */}
        <div className="bg-base-100 border border-base-300 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold tracking-tight text-base-content flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-500" /> Department Health Matrix
            </h2>
            <span className="text-xs font-semibold text-base-content/50">5 Departments Active</span>
          </div>

          <div className="space-y-4">
            {data.departmentHealth.map((dept, i) => (
              <div key={i} className="bg-base-200/50 border border-base-300 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-base-content">{dept.department}</span>
                    <span className="text-xs font-medium text-base-content/50">Score: {dept.healthScore}</span>
                  </div>
                  {getRiskBadge(dept.riskLevel)}
                </div>
                <p className="text-xs text-base-content/70">{dept.summary}</p>
                {dept.citations.length > 0 && (
                  <button 
                    onClick={() => setActiveCitation(dept.citations[0])}
                    className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" /> Citation: {dept.citations[0].documentName}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI COO Recommendations */}
        <div className="bg-base-100 border border-base-300 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold tracking-tight text-base-content flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> AI COO Priority Recommendations
            </h2>
            <span className="text-xs font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">Actionable</span>
          </div>

          <div className="space-y-4">
            {data.aiRecommendations.map((rec) => (
              <div key={rec.id} className="bg-base-200/50 border border-base-300 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-base-content">{rec.title}</h4>
                  <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", 
                    rec.priority === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border border-red-500/30' :
                    rec.priority === 'HIGH' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' :
                    'bg-blue-500/10 text-blue-500 border border-blue-500/30'
                  )}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-xs text-base-content/80 font-medium">{rec.recommendation}</p>
                <p className="text-[11px] text-base-content/60">Rationale: {rec.rationale}</p>
                {rec.citations.length > 0 && (
                  <button 
                    onClick={() => setActiveCitation(rec.citations[0])}
                    className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" /> Cited Document: {rec.citations[0].documentName}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 5. CUSTOM AI COO QUESTION INPUT */}
      <div className="bg-base-100 border border-base-300 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold tracking-tight text-base-content">Ask your AI COO anything</h2>
        </div>
        
        <div className="flex gap-3">
          <input 
            type="text" 
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomQuestion()}
            placeholder="Ask an operational question (e.g. Which vendor agreements have auto-renewal clauses?)..."
            className="flex-1 bg-base-200 border border-base-300 rounded-2xl px-4 py-3 text-sm text-base-content outline-none focus:ring-2 focus:ring-primary/20"
          />
          <Button onClick={handleCustomQuestion} disabled={askingCustom} className="rounded-2xl px-6 gap-2">
            {askingCustom ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {askingCustom ? 'Analyzing...' : 'Ask AI COO'}
          </Button>
        </div>

        {customResponse && (
          <div className="mt-4 p-5 bg-base-200 border border-primary/30 rounded-2xl text-sm space-y-3">
            <h4 className="font-bold text-primary flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" /> AI COO Response
            </h4>
            <div className="text-base-content/90 leading-relaxed">
              {customResponse.answer}
            </div>
            {customResponse.citations && customResponse.citations.length > 0 && (
              <div className="pt-2 border-t border-base-300 text-xs space-y-1">
                <span className="font-bold text-base-content/60">Citations:</span>
                {customResponse.citations.map((c: any, i: number) => (
                  <div key={i} className="text-primary font-medium flex items-center gap-1">
                    <FileText className="w-3 h-3" /> {c.documentName}: "{c.snippet}"
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 6. INSPECTION MODAL FOR QUESTION DETAILS */}
      {activeAnswer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative space-y-4 max-h-[85vh] overflow-y-auto">
            <button onClick={() => setActiveAnswer(null)} className="absolute top-4 right-4 p-2 text-base-content/50 hover:text-base-content">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              {getStatusBadge(activeAnswer.status)}
              <h3 className="font-bold text-lg text-base-content">{activeAnswer.question}</h3>
            </div>

            <div className="p-4 bg-base-200 border border-base-300 rounded-2xl text-sm text-base-content/90 leading-relaxed">
              {activeAnswer.answer}
            </div>

            {activeAnswer.citations.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase text-base-content/50 tracking-wider">Document Citations & Evidence</h4>
                {activeAnswer.citations.map((c, i) => (
                  <div key={i} className="p-3 bg-primary/5 border border-primary/20 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-primary flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> {c.documentName}
                    </div>
                    <p className="text-base-content/70 italic">"{c.snippet}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. INSPECTION MODAL FOR SINGLE CITATION */}
      {activeCitation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-3">
            <button onClick={() => setActiveCitation(null)} className="absolute top-4 right-4 p-2 text-base-content/50 hover:text-base-content">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-base text-primary flex items-center gap-2">
              <FileText className="w-4 h-4" /> {activeCitation.documentName}
            </h3>
            <div className="p-3 bg-base-200 border border-base-300 rounded-xl text-xs italic text-base-content/80 leading-relaxed">
              "{activeCitation.snippet}"
            </div>
            <Link href="/dashboard/documents" className="btn btn-sm btn-primary w-full gap-2">
              Open Document Library <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
