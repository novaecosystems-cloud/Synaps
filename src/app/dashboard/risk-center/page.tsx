'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, 
  Sparkles, RefreshCw, Loader2, ArrowUpRight, Search, Filter, 
  FileText, Info, Flame, ShieldCheck, DollarSign, Users, Clock, 
  FileSignature, Scale, Lock, Copy, Layers, ChevronRight, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RiskCenterPage() {
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPrediction, setSelectedPrediction] = useState<any | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<any | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/risks');
      const json = await res.json();
      if (json.success) {
        setDashboardData(json.data);
      } else {
        setError(json.error || 'Failed to load Risk Center');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching Risk Center data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleRunLiveScan = async () => {
    if (scanning) return;
    setScanning(true);
    try {
      const res = await fetch('/api/risks/scan', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setDashboardData(json.data);
      } else {
        alert(`Risk Scan Error: ${json.error}`);
      }
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setScanning(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/30 flex items-center gap-1"><Flame className="w-3 h-3" /> Critical</span>;
      case 'HIGH':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> High</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">Medium</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30">Low</span>;
    }
  };

  const getMetricTitle = (metric: string) => {
    switch (metric) {
      case 'CUSTOMER_CHURN': return 'Customer Churn Risk';
      case 'REVENUE_CHANGE': return 'Revenue Volatility';
      case 'PROJECT_DELAY': return 'Project Delay Probability';
      case 'BUDGET_OVERRUN': return 'Budget Overrun Exposure';
      case 'CONTRACT_EXPIRY': return 'Impending Contract Expiries';
      case 'EMPLOYEE_ATTRITION': return 'Employee Attrition Risk';
      case 'COMPLIANCE_FAILURE': return 'Compliance Failure Likelihood';
      case 'KNOWLEDGE_GAP': return 'Critical Knowledge Gaps';
      default: return metric;
    }
  };

  const categories = [
    { label: 'All Vulnerabilities', value: 'ALL' },
    { label: 'Missing Signatures', value: 'MISSING_SIGNATURE' },
    { label: 'Policy Conflicts', value: 'POLICY_CONFLICT' },
    { label: 'Financial Risks', value: 'FINANCIAL_RISK' },
    { label: 'Legal Risks', value: 'LEGAL_RISK' },
    { label: 'Security Issues', value: 'SECURITY_ISSUE' },
    { label: 'Compliance Violations', value: 'COMPLIANCE_VIOLATION' },
    { label: 'Incomplete SOPs', value: 'INCOMPLETE_SOP' },
    { label: 'Duplicate Processes', value: 'DUPLICATE_PROCESS' },
  ];

  const filteredRisks = dashboardData?.risks?.filter((r: any) => 
    selectedCategory === 'ALL' || r.category === selectedCategory
  ) || [];

  return (
    <div className="w-full space-y-8 font-sans pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-base-content">AI Prediction & Risk Center</h1>
            <p className="text-xs text-base-content/60">Predict churn, revenue & delays. Automatically detect missing signatures, policy conflicts & compliance gaps.</p>
          </div>
        </div>

        <Button onClick={handleRunLiveScan} disabled={scanning} className="rounded-2xl gap-2 bg-red-600 hover:bg-red-700 text-white font-bold">
          {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {scanning ? 'Running AI Risk Scanner...' : 'Run Live AI Risk Scan'}
        </Button>
      </div>

      {loading ? (
        <div className="w-full py-20 flex flex-col items-center justify-center text-base-content">
          <Loader2 className="w-8 h-8 animate-spin text-red-500 mb-3" />
          <p className="text-sm font-medium">Analyzing enterprise data & predictive models...</p>
        </div>
      ) : error ? (
        <div className="w-full p-8 text-center bg-base-200 border border-base-300 rounded-3xl">
          <ShieldAlert className="w-10 h-10 text-destructive mx-auto mb-3" />
          <h3 className="text-lg font-bold">Failed to load Risk Center</h3>
          <p className="text-xs text-base-content/60 max-w-md mx-auto mt-1 mb-4">{error}</p>
          <Button onClick={fetchDashboard} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" /> Retry
          </Button>
        </div>
      ) : dashboardData && (
        <div className="space-y-8">
          
          {/* EXECUTIVE RISK SCORE HERO BANNER */}
          <div className="p-8 bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 border border-red-500/30 text-white rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/20 border border-red-500/30 px-3 py-1 rounded-full">
                Real-Time Risk Health Monitor
              </span>
              <h2 className="text-2xl font-extrabold text-white">Enterprise Risk Status & Vulnerability Index</h2>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Continuous background scanner evaluates corporate documents, contracts, SOPs, and decisions for non-compliance, financial liabilities, and missing signatures.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
              <div className="text-center pr-4 border-r border-white/10">
                <span className="text-3xl font-extrabold text-red-400">{dashboardData.overallRiskScore}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Risk Score / 100</span>
              </div>
              <div className="text-center pr-4 border-r border-white/10">
                <span className="text-2xl font-bold text-amber-400">{dashboardData.criticalRiskCount}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Critical Risks</span>
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-white">{dashboardData.openRiskCount}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Open Vulnerabilities</span>
              </div>
            </div>
          </div>

          {/* 8 PREDICTIVE INTELLIGENCE MODELS GRID */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-red-500" /> AI Predictive Intelligence Models (8 Targets)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardData.predictions?.map((pred: any) => (
                <div 
                  key={pred.id} 
                  onClick={() => setSelectedPrediction(pred)}
                  className="bg-base-100 border border-base-300 hover:border-red-500/40 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50">
                        {getMetricTitle(pred.targetMetric)}
                      </span>
                      <span className={cn(
                        "font-bold text-[11px] px-2 py-0.5 rounded",
                        pred.trend === 'UP' ? "bg-red-500/10 text-red-400" : pred.trend === 'DOWN' ? "bg-emerald-500/10 text-emerald-400" : "bg-base-200 text-base-content/60"
                      )}>
                        {pred.trend}
                      </span>
                    </div>

                    <h4 className="text-xl font-extrabold text-base-content group-hover:text-red-500 transition-colors">
                      {pred.predictedValue}
                    </h4>

                    <p className="text-xs text-base-content/70 line-clamp-3 leading-relaxed">
                      "{pred.explanation}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-base-200 mt-4 flex items-center justify-between text-xs text-red-500 font-bold">
                    <span>Inspect Evidence ({Math.round(pred.confidenceScore * 100)}% Conf)</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AUTOMATED AI RISK SCANNER TABLE */}
          <div className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" /> Automated Vulnerability Scanner Matrix
              </h3>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto max-w-full custom-scrollbar pb-1">
                {categories.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setSelectedCategory(c.value)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border",
                      selectedCategory === c.value
                        ? "bg-red-500 text-white border-red-500"
                        : "bg-base-100 border-base-300 text-base-content/70 hover:text-base-content"
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Risk Items Grid */}
            {filteredRisks.length === 0 ? (
              <div className="w-full py-12 text-center bg-base-100 border border-base-300 border-dashed rounded-3xl space-y-2">
                <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-base-content">No Vulnerabilities Detected in Category</h4>
                <p className="text-xs text-base-content/60">Run Live AI Risk Scan to perform deep inspection of newly uploaded contracts & SOPs.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRisks.map((risk: any) => (
                  <div 
                    key={risk.id}
                    onClick={() => setSelectedRisk(risk)}
                    className="bg-base-100 border border-base-300 hover:border-red-500/40 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        {getSeverityBadge(risk.severity)}
                        <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50">
                          {risk.category.replace('_', ' ')}
                        </span>
                      </div>

                      <h4 className="font-bold text-base text-base-content group-hover:text-red-500 transition-colors leading-snug">
                        {risk.title}
                      </h4>

                      <p className="text-xs text-base-content/70 line-clamp-2 leading-relaxed">
                        {risk.description}
                      </p>
                    </div>

                    <div className="p-3 bg-base-200 border border-base-300 rounded-2xl text-xs space-y-1">
                      <span className="font-bold text-red-500 block text-[10px] uppercase tracking-wider">Supporting Evidence Quote</span>
                      <p className="text-base-content/80 italic line-clamp-2 font-mono">
                        "{risk.supportingEvidence}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* PREDICTION CITATION INSPECTOR MODAL */}
      {selectedPrediction && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative space-y-5">
            <button onClick={() => setSelectedPrediction(null)} className="absolute top-4 right-4 p-2 text-base-content/50 hover:text-base-content">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                Predictive Intelligence Model
              </span>
              <h2 className="text-xl font-bold text-base-content mt-2">{getMetricTitle(selectedPrediction.targetMetric)}</h2>
              <span className="text-2xl font-extrabold text-red-500 block mt-1">{selectedPrediction.predictedValue}</span>
            </div>

            <div className="p-4 bg-base-200 border border-base-300 rounded-2xl text-xs text-base-content/90 space-y-2">
              <h4 className="font-bold text-red-500 uppercase tracking-wider">Why Generated (AI Predictive Rationale)</h4>
              <p className="leading-relaxed">{selectedPrediction.explanation}</p>
            </div>

            {selectedPrediction.supportingEvidence?.length > 0 && (
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-base-content/60 mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-red-500" /> Grounded Evidence Citations
                </h4>
                <div className="space-y-1.5">
                  {selectedPrediction.supportingEvidence.map((ev: string, idx: number) => (
                    <div key={idx} className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl text-xs font-mono text-base-content/80">
                      📄 {ev}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-base-300 flex justify-between items-center">
              <Link href="/dashboard/graph" className="text-xs text-red-500 font-bold hover:underline flex items-center gap-1">
                Explore Metric Entities in Memory Graph →
              </Link>
              <Button onClick={() => setSelectedPrediction(null)} className="rounded-xl">Close Prediction</Button>
            </div>
          </div>
        </div>
      )}

      {/* RISK INSPECTOR MODAL */}
      {selectedRisk && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative space-y-5">
            <button onClick={() => setSelectedRisk(null)} className="absolute top-4 right-4 p-2 text-base-content/50 hover:text-base-content">
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {getSeverityBadge(selectedRisk.severity)}
                <span className="text-xs font-bold text-base-content/50">{selectedRisk.category}</span>
              </div>
              <h2 className="text-xl font-bold text-base-content">{selectedRisk.title}</h2>
              <p className="text-xs text-base-content/70">{selectedRisk.description}</p>
            </div>

            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs space-y-2">
              <h4 className="font-bold text-red-400 uppercase tracking-wider">Supporting Corporate Evidence</h4>
              <p className="text-base-content/90 font-mono italic">"{selectedRisk.supportingEvidence}"</p>
            </div>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs space-y-2">
              <h4 className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Recommended Mitigation Action
              </h4>
              <p className="text-base-content/90">{selectedRisk.mitigationRecommendation}</p>
            </div>

            <div className="pt-2 border-t border-base-300 flex justify-end">
              <Button onClick={() => setSelectedRisk(null)} className="rounded-xl">Close Vulnerability</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
