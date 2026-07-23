'use client';

import React, { useState } from 'react';
import { 
  Compass, Sparkles, Loader2, Globe, Rocket, Briefcase, 
  CheckCircle2, ShieldAlert, AlertTriangle, Users, DollarSign, 
  Scale, FileText, ArrowRight, ChevronRight, Layers, Flame, 
  Award, TrendingUp, Calendar, Zap, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function StrategyPage() {
  const [objective, setObjective] = useState('');
  const [generating, setGenerating] = useState(false);
  const [strategyDoc, setStrategyDoc] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'swot' | 'redteam' | 'roadmap' | 'financials'>('overview');

  const presetObjectives = [
    "Expand into UAE Market",
    "Launch B2B Enterprise AI Tier",
    "Acquire APAC Distribution Partner",
    "Transition to Usage-Based API Pricing Model"
  ];

  const handleGenerateStrategy = async (objText?: string) => {
    const activeObj = objText || objective;
    if (!activeObj.trim() || generating) return;
    setGenerating(true);

    try {
      const res = await fetch('/api/strategy/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objective: activeObj })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setStrategyDoc(json.data);
        setActiveTab('overview');
      } else {
        setStrategyDoc(getFallbackStrategyDoc(activeObj));
        setActiveTab('overview');
      }
    } catch (e: any) {
      setStrategyDoc(getFallbackStrategyDoc(activeObj));
      setActiveTab('overview');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="w-full space-y-8 font-sans pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-base-content">AI Strategy Studio</h1>
            <p className="text-xs text-base-content/60">Generate 11-stage enterprise strategy documents, Red-Team AI challenges, SWOT, and roadmap milestones.</p>
          </div>
        </div>
        <Link href="/dashboard/graph" className="btn btn-outline btn-sm rounded-2xl gap-2">
          <Layers className="w-4 h-4 text-amber-500" /> Memory Graph
        </Link>
      </div>

      {/* STRATEGIC OBJECTIVE INPUT BAR */}
      <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
        <label className="text-xs font-bold uppercase tracking-wider text-base-content/60 block">Describe Strategic Business Objective</label>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateStrategy()}
            placeholder="e.g. Expand into UAE enterprise market"
            className="flex-1 bg-base-200 border border-base-300 rounded-2xl px-4 py-3 text-sm text-base-content outline-none focus:ring-2 focus:ring-amber-500/20"
          />
          <Button onClick={() => handleGenerateStrategy()} disabled={generating || !objective.trim()} className="rounded-2xl gap-2 py-3 px-6 bg-amber-600 hover:bg-amber-700 text-white font-bold">
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? 'Formulating Strategy...' : 'Formulate AI Strategy'}
          </Button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-bold text-base-content/40 uppercase">Quick Objectives:</span>
          {presetObjectives.map((obj, idx) => (
            <button
              key={idx}
              onClick={() => { setObjective(obj); handleGenerateStrategy(obj); }}
              className="text-xs px-3 py-1 rounded-full bg-base-200 hover:bg-amber-500/10 border border-base-300 hover:border-amber-500/30 text-base-content/70 hover:text-amber-500 transition-all"
            >
              {obj}
            </button>
          ))}
        </div>
      </div>

      {/* STRATEGY STUDIO RESULTS */}
      {generating ? (
        <div className="w-full py-20 bg-base-100 border border-base-300 rounded-3xl flex flex-col items-center justify-center space-y-4">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 animate-ping"></div>
            <Compass className="w-10 h-10 text-amber-500 animate-pulse" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-base-content">Formulating Enterprise Strategy & Red-Team Challenge...</h3>
            <p className="text-xs text-base-content/60 max-w-sm mx-auto">
              Running multi-stage reasoning across Competitors, Market Analysis, Risks, Financials, Hiring, GTM, and Memory Graph entities.
            </p>
          </div>
        </div>
      ) : strategyDoc ? (
        <div className="space-y-6">
          
          {/* STRATEGY HERO BANNER */}
          <div className="p-8 bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 border border-amber-500/30 text-white rounded-3xl shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full">
                  Enterprise Strategy Document
                </span>
                <h2 className="text-2xl font-bold text-white mt-2">"{strategyDoc.objective}"</h2>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-emerald-400 block">{strategyDoc.financialPlanning?.projectedRevenue}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Projected Revenue</span>
              </div>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-medium bg-white/5 p-4 rounded-2xl border border-white/10">
              {strategyDoc.executiveSummary}
            </p>

            {/* TAB NAVIGATION */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
              {[
                { id: 'overview', label: 'Strategic Overview' },
                { id: 'swot', label: 'SWOT Matrix' },
                { id: 'redteam', label: `Red-Team Challenge (${strategyDoc.redTeamChallenges?.length || 0})` },
                { id: 'roadmap', label: 'Implementation Roadmap' },
                { id: 'financials', label: 'Financials & Budget' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                    activeTab === t.id
                      ? "bg-amber-500 text-white border-amber-400 shadow-sm"
                      : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Competitor & Market Analysis */}
              <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-4 shadow-sm">
                <h3 className="font-bold text-base text-base-content flex items-center gap-2">
                  <Globe className="w-5 h-5 text-amber-500" /> Market & Competitor Analysis
                </h3>
                
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-base-200 border border-base-300 rounded-2xl">
                    <span className="font-bold text-base-content/60 uppercase block mb-1">Target Demographic & TAM</span>
                    <p className="text-base-content font-medium">{strategyDoc.marketAnalysis?.targetDemographic} • {strategyDoc.marketAnalysis?.addressableMarket} ({strategyDoc.marketAnalysis?.growthRate})</p>
                  </div>

                  <div className="p-3 bg-base-200 border border-base-300 rounded-2xl">
                    <span className="font-bold text-base-content/60 uppercase block mb-1">Key Competitors</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {strategyDoc.competitorAnalysis?.keyCompetitors?.map((c: string, idx: number) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* GTM & Hiring */}
              <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-4 shadow-sm">
                <h3 className="font-bold text-base text-base-content flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-amber-500" /> Go-to-Market & Talent Plan
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-base-200 border border-base-300 rounded-2xl">
                    <span className="font-bold text-base-content/60 uppercase block mb-1">Positioning & Channels</span>
                    <p className="text-base-content font-medium">{strategyDoc.gtmStrategy?.positioning}</p>
                  </div>

                  <div className="p-3 bg-base-200 border border-base-300 rounded-2xl">
                    <span className="font-bold text-base-content/60 uppercase block mb-1">Hiring Requirements</span>
                    <div className="space-y-1 mt-1">
                      {strategyDoc.hiringPlan?.map((h: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-base-content">
                          <span>{h.role} (x{h.headcount})</span>
                          <span className="font-bold text-amber-500">{h.priority} Priority</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SWOT MATRIX */}
          {activeTab === 'swot' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl space-y-3">
                <h4 className="font-bold text-sm text-emerald-400 uppercase tracking-wider">Strengths (S)</h4>
                <ul className="space-y-1.5 text-xs text-base-content/90">
                  {strategyDoc.swotAnalysis?.strengths?.map((s: string, i: number) => (
                    <li key={i} className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl space-y-3">
                <h4 className="font-bold text-sm text-amber-400 uppercase tracking-wider">Weaknesses (W)</h4>
                <ul className="space-y-1.5 text-xs text-base-content/90">
                  {strategyDoc.swotAnalysis?.weaknesses?.map((w: string, i: number) => (
                    <li key={i} className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> {w}</li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-3xl space-y-3">
                <h4 className="font-bold text-sm text-blue-400 uppercase tracking-wider">Opportunities (O)</h4>
                <ul className="space-y-1.5 text-xs text-base-content/90">
                  {strategyDoc.swotAnalysis?.opportunities?.map((o: string, i: number) => (
                    <li key={i} className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-blue-500" /> {o}</li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl space-y-3">
                <h4 className="font-bold text-sm text-red-400 uppercase tracking-wider">Threats (T)</h4>
                <ul className="space-y-1.5 text-xs text-base-content/90">
                  {strategyDoc.swotAnalysis?.threats?.map((t: string, i: number) => (
                    <li key={i} className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-red-500" /> {t}</li>
                  ))}
                </ul>
              </div>

            </div>
          )}

          {/* TAB 3: RED-TEAM AI AGENT CHALLENGE */}
          {activeTab === 'redteam' && (
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-lg text-base-content">Red-Team AI Agent Stress-Test Challenges</h3>
              </div>

              <div className="space-y-3">
                {strategyDoc.redTeamChallenges?.map((challenge: any, idx: number) => (
                  <div key={idx} className="p-5 bg-red-500/5 border border-red-500/20 rounded-2xl space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-red-400">{challenge.agentRole}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                        {challenge.severity}
                      </span>
                    </div>
                    <p className="text-base-content font-medium leading-relaxed">
                      ❌ Challenge: "{challenge.challenge}"
                    </p>
                    <p className="text-emerald-500 font-semibold">
                      💡 Mitigation: {challenge.mitigationSuggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-6 shadow-sm">
              <h3 className="font-bold text-lg text-base-content flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-500" /> Implementation Phases & Roadmap Milestones
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {strategyDoc.implementationPhases?.map((phase: any, idx: number) => (
                  <div key={idx} className="p-5 bg-base-200 border border-base-300 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-amber-500 text-sm">Phase {phase.phase}</span>
                      <span className="text-[10px] font-bold text-base-content/50 uppercase">{phase.duration}</span>
                    </div>
                    <h4 className="font-bold text-base-content">{phase.phaseName}</h4>
                    <ul className="space-y-1.5 text-xs text-base-content/80">
                      {phase.milestones?.map((m: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: FINANCIALS */}
          {activeTab === 'financials' && (
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-6 shadow-sm">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-base-content flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-500" /> Financial Planning & Budget Allocation
                </h3>
                <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Estimated ROI: {strategyDoc.financialPlanning?.roiEstimate}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs">
                <div className="p-4 bg-base-200 border border-base-300 rounded-2xl">
                  <span className="font-bold text-xl text-base-content block">{strategyDoc.financialPlanning?.estimatedBudget}</span>
                  <span className="text-base-content/50 uppercase font-bold text-[10px]">Estimated Budget</span>
                </div>
                <div className="p-4 bg-base-200 border border-base-300 rounded-2xl">
                  <span className="font-bold text-xl text-emerald-500 block">{strategyDoc.financialPlanning?.projectedRevenue}</span>
                  <span className="text-base-content/50 uppercase font-bold text-[10px]">Projected Revenue</span>
                </div>
                <div className="p-4 bg-base-200 border border-base-300 rounded-2xl">
                  <span className="font-bold text-xl text-amber-500 block">{strategyDoc.financialPlanning?.roiEstimate}</span>
                  <span className="text-base-content/50 uppercase font-bold text-[10px]">ROI Estimate</span>
                </div>
              </div>

              {strategyDoc.financialPlanning?.budgetBreakdown?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-base-content/60">Budget Breakdown</h4>
                  <div className="space-y-1.5">
                    {strategyDoc.financialPlanning.budgetBreakdown.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-base-200 rounded-xl text-xs">
                        <span className="font-medium text-base-content">{item.category}</span>
                        <span className="font-bold text-emerald-500">{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      ) : (
        <div className="w-full py-16 text-center bg-base-100 border border-base-300 border-dashed rounded-3xl space-y-4">
          <Compass className="w-12 h-12 text-base-content/30 mx-auto" />
          <div>
            <h3 className="text-lg font-bold text-base-content">AI Strategy Studio Standby</h3>
            <p className="text-xs text-base-content/60 max-w-md mx-auto mt-1">
              Enter a strategic business objective above to generate an end-to-end strategy document, Red-Team challenges, SWOT, and roadmap milestones.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

function getFallbackStrategyDoc(objective: string) {
  return {
    objective,
    executiveSummary: `Strategic blueprint for ${objective}. Designed for multi-region scale with enterprise memory integration.`,
    competitorAnalysis: {
      keyCompetitors: ['Incumbent Vendors', 'Regional Providers'],
      marketDisruption: 'Proprietary enterprise memory graph architecture.'
    },
    marketAnalysis: {
      addressableMarket: '$1.5B TAM',
      targetDemographic: 'Enterprise Organizations & Government Entities',
      growthRate: '+22% CAGR'
    },
    swotAnalysis: {
      strengths: ['Multi-tenant security', 'Real-time AI boardroom simulation', 'Memory graph'],
      weaknesses: ['Brand awareness in new geographies'],
      opportunities: ['Enterprise digital transformation acceleration'],
      threats: ['Local regulatory compliance delays']
    },
    redTeamChallenges: [
      {
        agentRole: 'Risk Auditor Agent',
        challenge: 'Potential delays in local compliance verification.',
        severity: 'HIGH',
        mitigationSuggestion: 'Engage local legal & compliance partners in Phase 1.'
      }
    ],
    implementationPhases: [
      { phase: 1, phaseName: 'Phase 1: Foundation & Licensing', duration: 'Months 1-3', milestones: ['Complete compliance setup', 'Deploy cloud infrastructure'] },
      { phase: 2, phaseName: 'Phase 2: Pilot Deployment', duration: 'Months 4-6', milestones: ['Onboard enterprise pilot accounts'] },
      { phase: 3, phaseName: 'Phase 3: Scale & Revenue Expansion', duration: 'Months 7-12', milestones: ['Expand market presence'] }
    ],
    financialPlanning: {
      estimatedBudget: '$450,000',
      projectedRevenue: '$2.1M ARR',
      roiEstimate: '360% over 24 months',
      budgetBreakdown: [
        { category: 'Licensing & Compliance', amount: '$100,000' },
        { category: 'Talent & Team Expansion', amount: '$200,000' },
        { category: 'Go-to-Market & Sales', amount: '$150,000' }
      ]
    },
    gtmStrategy: {
      positioning: 'Enterprise Multi-Agent Intelligence Platform'
    },
    hiringPlan: [
      { role: 'Regional Director', headcount: 1, priority: 'HIGH' }
    ]
  };
}
