'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, 
  Sparkles, RefreshCw, Loader2, ArrowUpRight, Search, Filter, 
  FileText, Info, Flame, ShieldCheck, DollarSign, Users, Clock, 
  FileSignature, Scale, Lock, Copy, Layers, ChevronRight, X, Zap, Check, CheckSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ActiveKnowledgeSelector } from '@/components/ActiveKnowledgeSelector';

export default function RiskCenterPage() {
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPrediction, setSelectedPrediction] = useState<any | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<any | null>(null);

  // Incident Remediation State
  const [remediating, setRemediating] = useState(false);
  const [remediatedSuccess, setRemediatedSuccess] = useState(false);

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

  // ── 1-CLICK DISPATCH INCIDENT TO ACTION BOARD & STREAM ─────────────────────
  const handleRemediateRiskToActionBoard = async (risk: any) => {
    if (!risk || remediating) return;
    setRemediating(true);
    setRemediatedSuccess(false);

    try {
      // 1. Create P0 Incident Task in Action Board
      await fetch('/api/action-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `[P0 Risk Incident] ${risk.title}`,
          description: `Vulnerability: ${risk.description}\n\nRecommended Mitigation: ${risk.mitigationRecommendation || 'Remediate immediately under SCM invariant protocols.'}\n\nEvidence: ${risk.supportingEvidence || 'N/A'}`,
          priority: risk.severity === 'CRITICAL' ? 'P0' : 'P1',
          status: 'P0_BLOCKER',
          assigneeName: risk.category?.includes('LEGAL') ? 'AI: General Counsel' : risk.category?.includes('SECURITY') ? 'AI: Red Team' : 'AI: Chief Risk Officer',
          assigneeType: 'AI',
          causalEvidence: `Risk Center Scan (${risk.severity} Severity) · SHA-256 Invariant Guard`,
          tags: ['Incident', 'RiskRemediation', risk.severity || 'P0']
        })
      });

      // 2. Broadcast Urgent Alert to Team Stream (#p0-incidents)
      await fetch('/api/stream-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: 'p0-incidents',
          content: `🚨 **P0 INCIDENT ESCALATION**\n\n**Vulnerability:** ${risk.title}\n**Severity:** ${risk.severity}\n**Mitigation Required:** ${risk.mitigationRecommendation || 'Immediate patch required.'}\n\n👉 **P0 Blocker Ticket created on Action Board.**`,
          senderRole: 'AI: Risk Sentinel',
          senderType: 'AI',
          citation: `Risk_Sentinel_Node · Severity: ${risk.severity}`
        })
      });

      setRemediatedSuccess(true);
    } catch (err) {
      console.error('Error dispatching risk remediation:', err);
    } finally {
      setRemediating(false);
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
  ];

  const filteredRisks = dashboardData?.vulnerabilities?.filter((r: any) => 
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
            <h1 className="text-2xl font-bold tracking-tight text-base-content">AI Risk Center & Predictive Intelligence</h1>
            <p className="text-xs text-base-content/60">Grounded early-warning system scanning documents for risks, missing signatures, policy conflicts & forecasting metric volatility.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleRunLiveScan}
            disabled={scanning}
            className="rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider gap-2 py-2 px-4 shadow-sm"
          >
            {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {scanning ? 'Analyzing Graph...' : 'Trigger Full Audit Scan'}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="w-full py-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          <p className="text-xs text-base-content/60 font-medium">Scanning organizational risk matrix & forecasting metric trajectories...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-500 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* TOP SUMMARY STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-2">
              <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider flex items-center justify-between">
                Total Vulnerabilities <Flame className="w-4 h-4 text-red-500" />
              </span>
              <span className="text-3xl font-extrabold text-base-content block">
                {dashboardData?.summary?.totalVulnerabilities || 0}
              </span>
              <span className="text-[11px] text-red-500 font-semibold flex items-center gap-1">
                {dashboardData?.summary?.criticalCount || 0} Critical • {dashboardData?.summary?.highCount || 0} High Severity
              </span>
            </div>

            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-2">
              <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider flex items-center justify-between">
                Active Predictions <TrendingUp className="w-4 h-4 text-cyan-500" />
              </span>
              <span className="text-3xl font-extrabold text-base-content block">
                {dashboardData?.summary?.totalPredictions || 0}
              </span>
              <span className="text-[11px] text-cyan-500 font-semibold">
                Forecasted over next 30-90 days
              </span>
            </div>

            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-2">
              <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider flex items-center justify-between">
                Policy Conflicts <Scale className="w-4 h-4 text-amber-500" />
              </span>
              <span className="text-3xl font-extrabold text-base-content block">
                {dashboardData?.summary?.policyConflictsCount || 0}
              </span>
              <span className="text-[11px] text-amber-500 font-semibold">
                Cross-document contract discrepancies
              </span>
            </div>

            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-2">
              <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider flex items-center justify-between">
                Missing Signatures <FileSignature className="w-4 h-4 text-purple-500" />
              </span>
              <span className="text-3xl font-extrabold text-base-content block">
                {dashboardData?.summary?.missingSignaturesCount || 0}
              </span>
              <span className="text-[11px] text-purple-500 font-semibold">
                Unexecuted execution agreements
              </span>
            </div>
          </div>

          {/* PREDICTIVE INTELLIGENCE SECTION */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-500" /> Predictive Metric Forecasts (30-90 Day Trajectories)
                </h3>
                <p className="text-xs text-base-content/60">Grounded probabilistic predictions derived from current operational velocity & corporate memory.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {dashboardData?.predictions?.map((pred: any) => (
                <div 
                  key={pred.id} 
                  onClick={() => setSelectedPrediction(pred)}
                  className="p-5 bg-base-100 border border-base-300 hover:border-cyan-500/40 rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 group"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-base-content/70">{getMetricTitle(pred.targetMetric)}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-base-200 border border-base-300 text-cyan-500">
                      {Math.round(pred.confidenceScore * 100)}% Conf
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-2xl font-black text-base-content group-hover:text-cyan-500 transition-colors">
                      {pred.predictedValue}
                    </span>
                    <p className="text-xs text-base-content/60 line-clamp-2 leading-relaxed">
                      {pred.explanation}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-base-300 flex justify-between items-center text-[11px] text-cyan-500 font-semibold">
                    <span>Inspect AI Rationale</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VULNERABILITIES & RISKS BREAKDOWN TABLE */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-500" /> Active Corporate Vulnerabilities & Document Risks
                </h3>
                <p className="text-xs text-base-content/60">Grounded clause-level issues extracted from indexed documents with strict citations.</p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-base-200 rounded-2xl border border-base-300 text-xs">
                {categories.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setSelectedCategory(c.value)}
                    className={cn(
                      "px-3 py-1 rounded-xl font-medium transition-all text-[11px]",
                      selectedCategory === c.value
                        ? "bg-red-500 text-white font-bold shadow-sm"
                        : "text-base-content/70 hover:text-base-content"
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredRisks.length === 0 ? (
              <div className="p-12 text-center bg-base-100 border border-base-300 rounded-3xl space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-base-content">No Active Vulnerabilities Found</h4>
                <p className="text-xs text-base-content/60">No risks matching this category were identified across current indexed documents.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRisks.map((risk: any) => (
                  <div
                    key={risk.id}
                    onClick={() => { setSelectedRisk(risk); setRemediatedSuccess(false); }}
                    className="p-5 bg-base-100 border border-base-300 hover:border-red-500/40 rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 group flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        {getSeverityBadge(risk.severity)}
                        <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider">{risk.category}</span>
                      </div>

                      <h4 className="text-sm font-bold text-base-content group-hover:text-red-500 transition-colors leading-snug">
                        {risk.title}
                      </h4>

                      <p className="text-xs text-base-content/70 line-clamp-3 leading-relaxed">
                        {risk.description}
                      </p>
                    </div>

                    <div className="p-3 bg-base-200 border border-base-300 rounded-2xl text-xs space-y-1">
                      <span className="font-bold text-red-500 block text-[10px] uppercase tracking-wider">Supporting Evidence Quote</span>
                      <p className="text-base-content/80 italic line-clamp-2 font-mono">
                        &ldquo;{risk.supportingEvidence}&rdquo;
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

      {/* RISK INSPECTOR & 1-CLICK REMEDIATION MODAL */}
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
              <p className="text-base-content/90 font-mono italic">&ldquo;{selectedRisk.supportingEvidence}&rdquo;</p>
            </div>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs space-y-2">
              <h4 className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Recommended Mitigation Action
              </h4>
              <p className="text-base-content/90">{selectedRisk.mitigationRecommendation || 'Remediate immediately under SCM invariant protocols.'}</p>
            </div>

            {/* 1-Click Remediate Bar */}
            <div className="pt-2 border-t border-base-300 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {remediatedSuccess ? (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold w-full">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="flex-1">P0 Incident Dispatched to Action Board & Alerted on Team Stream!</span>
                  <Link href="/dashboard/projects" className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase">
                    View Task →
                  </Link>
                </div>
              ) : (
                <>
                  <Button
                    onClick={() => handleRemediateRiskToActionBoard(selectedRisk)}
                    disabled={remediating}
                    className="rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider py-2.5 px-4 shadow-md gap-1.5 cursor-pointer"
                  >
                    {remediating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                    ⚡ Create P0 Incident & Alert Team
                  </Button>
                  <Button onClick={() => setSelectedRisk(null)} variant="outline" className="rounded-xl">Close</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
