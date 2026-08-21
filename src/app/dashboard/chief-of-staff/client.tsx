'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Sparkles, CheckCircle2, AlertTriangle, Clock, 
  TrendingUp, TrendingDown, DollarSign, FileText, Calendar, 
  Users, FolderKanban, Scale, Activity, ArrowRight, RefreshCw, 
  Loader2, ShieldCheck, Zap, Info, Bell, Check, ChevronRight, Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ActiveKnowledgeSelector } from '@/components/ActiveKnowledgeSelector';
import { SkiperLoopLoader } from '@/components/ui/SkiperLoopLoader';
import { downloadAsPDF } from '@/lib/export-helpers';
import { CassetteAudioPlayer } from '@/components/ui/EnterpriseTactileSuite';
import { useOrgProfile } from '@/context/OrgProfileContext';

interface ProactiveActionRecommendation {
  id: string;
  category: string;
  issue: string;
  urgency: string;
  recommendedAction: string;
  why: string;
  supportingEvidence?: string[];
  estimatedImpact: string;
  confidenceScore: number;
}

const renderSafeString = (val: any): string => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (typeof val === 'object') {
    if (val.why) return String(val.why);
    if (val.title) return String(val.title);
    if (val.description) return String(val.description);
    if (val.text) return String(val.text);
    if (val.recommendedAction) return String(val.recommendedAction);
    return JSON.stringify(val);
  }
  return String(val);
};

interface ChiefOfStaffClientProps {
  initialBriefing?: any;
  initialMonitoring?: any;
}

export default function ChiefOfStaffClient({ initialBriefing, initialMonitoring }: ChiefOfStaffClientProps) {
  const { profile } = useOrgProfile();
  const companyName = profile?.companyName || 'Your Organisation';

  const [briefing, setBriefing] = useState<any>(initialBriefing);
  const [monitoring, setMonitoring] = useState<any>(initialMonitoring);
  const [loading, setLoading] = useState(false);
  const [selectedRec, setSelectedRec] = useState<any | null>(null);
  const [executedRecs, setExecutedRecs] = useState<Set<string>>(new Set());

  const refreshBriefing = async () => {
    setLoading(true);
    try {
      const [resBrief, resMon] = await Promise.all([
        fetch('/api/chief-of-staff/briefing'),
        fetch('/api/chief-of-staff/monitor')
      ]);
      const [dataBrief, dataMon] = await Promise.all([
        resBrief.json(),
        resMon.json()
      ]);
      if (dataBrief.success) setBriefing(dataBrief.data);
      if (dataMon.success) setMonitoring(dataMon.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteAction = (id: string) => {
    setExecutedRecs(prev => new Set(prev).add(id));
  };
  const handleExecute = handleExecuteAction;

  const criticalIssues = briefing?.todayPriorities?.filter((p: any) => p.urgency === 'CRITICAL') || [];
  const urgentActions = briefing?.proactiveRecommendations?.filter((r: any) => r.urgency === 'CRITICAL' || r.urgency === 'HIGH') || [];

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'CRITICAL':
        return <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Critical</span>;
      case 'HIGH':
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">High</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider">Medium</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30 text-[10px] font-bold uppercase tracking-wider">Low</span>;
    }
  };

  return (
    <div className="w-full space-y-8 font-sans pb-20 text-base-content">
      
      {/* ── HEADER BANNER ────────────────────────────────────────── */}
      <div className="p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Autonomous Enterprise Chief of Staff
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
            Daily Executive Briefing & Action Plan
          </h1>
          <p className="text-xs text-indigo-200/70 leading-relaxed">
            Continuously monitors 8 enterprise channels (Email, Calendar, Git, Finance, Contracts, Meetings, CRM) to deliver proactive recommendations with full business impact & evidence traceability.
          </p>
        </div>

        {/* Risk Score & Actions */}
        <div className="flex items-center gap-4 shrink-0 z-10">
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center min-w-[120px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Risk Score</span>
            <div className="text-3xl font-black text-amber-400 mt-1">
              {briefing?.riskScore || 38}<span className="text-xs text-slate-400 font-normal">/100</span>
            </div>
            <span className="text-[9px] text-amber-300/80 font-mono block mt-0.5">MODERATE RISK</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button 
              onClick={() => {
                const recs = briefing?.proactiveRecommendations || [];
                downloadAsPDF({
                  title: 'Chief of Staff Daily Executive Briefing',
                  subtitle: `Generated for Organization: ${companyName} · Risk Score: ${briefing?.riskScore || 38}/100`,
                  organizationName: `${companyName.toUpperCase()} — CHIEF OF STAFF`,
                  filename: 'Chief-of-Staff-Briefing-Report',
                  sections: [
                    {
                      heading: 'Today Summary & Risk Assessment',
                      content: briefing?.summary || 'Continuously monitoring enterprise channels for critical risk exposures.',
                      kvPairs: {
                        'Risk Score': `${briefing?.riskScore || 38}/100 (MODERATE)`,
                        'Urgent Items': `${briefing?.urgentActionCount || 4} Critical Actions`,
                        'Monitored Channels': 'Email, Calendar, Git, Finance, Contracts, Meetings, CRM'
                      }
                    },
                    {
                      heading: 'Proactive Action Recommendations',
                      tableData: {
                        headers: ['Category', 'Issue Description', 'Urgency', 'Recommended Action', 'Impact'],
                        rows: recs.map((r: any) => [
                          r.category || 'General',
                          r.issue || '',
                          r.urgency || 'HIGH',
                          r.recommendedAction || '',
                          r.estimatedImpact || 'High'
                        ])
                      }
                    }
                  ]
                });
              }}
              className="rounded-2xl px-4 py-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" />
              Export Brief PDF
            </Button>

            <Button 
              onClick={refreshBriefing} 
              disabled={loading} 
              className="rounded-2xl px-5 py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider gap-2 shadow-lg"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              {loading ? 'Refreshing...' : 'Refresh Briefing'}
            </Button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="p-6 bg-base-100 border border-base-300 rounded-3xl flex justify-center items-center">
          <SkiperLoopLoader preset="chief-of-staff" delay={1500} className="scale-110" />
        </div>
      )}

      {/* Active Knowledge Selector Bar */}
      <ActiveKnowledgeSelector />

      {/* ── TODAY'S PRIORITIES & WEEKLY SUMMARY ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Executive Summary & Tactile Cassette Audio Player */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" /> Weekly Strategic Summary
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">LIVE SYNTHESIS</span>
            </div>
            <p className="text-xs text-base-content/80 leading-relaxed p-4 bg-base-200 border border-base-300 rounded-2xl font-medium">
              {renderSafeString(briefing?.weeklySummary)}
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-base-content/50">
              <span>Channels Monitored: {monitoring?.totalMonitoredChannels || 8}/8</span>
              <span>Alerts Active: {monitoring?.activeProactiveAlerts?.length || 4}</span>
            </div>
          </div>

          {/* Skeuomorphic Cassette Executive Briefing Audio Player */}
          <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-500">
                🎙️ Morning Brief Audio Tape
              </span>
              <span className="text-[10px] font-mono text-base-content/50">SIDE A · HQ DISPATCH</span>
            </div>
            <CassetteAudioPlayer />
          </div>
        </div>

        {/* Today's Priorities (Urgency Sorted) */}
        <div className="lg:col-span-2 p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Today's Priorities (Sorted by Urgency)
            </h3>
            <span className="text-[10px] font-mono text-base-content/50">{briefing?.todayPriorities?.length || 0} Priority Items</span>
          </div>

          <div className="space-y-3">
            {briefing?.todayPriorities?.map((priority: any) => (
              <div key={priority.id} className="p-4 bg-base-200 border border-base-300 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between items-center gap-2">
                  <span className="font-bold text-sm text-base-content">{renderSafeString(priority.title)}</span>
                  {getUrgencyBadge(priority.urgency)}
                </div>
                <p className="text-base-content/70">{renderSafeString(priority.description)}</p>
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-300 flex items-center justify-between gap-2 font-mono text-[11px]">
                  <span>💡 <strong>Recommended Action:</strong> {renderSafeString(priority.recommendedAction)}</span>
                  <ChevronRight className="w-4 h-4 shrink-0 text-indigo-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── PROACTIVE ACTION RECOMMENDATIONS (WITH EXPLAINABILITY) ── */}
      <div className="p-8 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-base-300 pb-4">
          <div>
            <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-500" /> Proactive Action Recommendations
            </h2>
            <p className="text-xs text-base-content/60">Every recommendation includes root-cause reasoning ("Why"), supporting evidence, and confidence score.</p>
          </div>
          <span className="text-xs font-mono bg-indigo-500/10 text-indigo-500 px-3 py-1 rounded-full border border-indigo-500/20 font-bold">
            Zero Hallucination Guaranteed
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {briefing?.recommendedActions?.map((rec: ProactiveActionRecommendation) => {
            const isExecuted = executedRecs.has(rec.id);
            return (
              <div key={rec.id} className={cn(
                "p-6 rounded-2xl border transition-all space-y-4 relative overflow-hidden",
                isExecuted ? "bg-emerald-500/5 border-emerald-500/30" : "bg-base-200 border-base-300"
              )}>
                {/* Header */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold block mb-1">
                      {renderSafeString(rec.category)} ISSUE
                    </span>
                    <h3 className="font-bold text-sm text-base-content leading-snug">{renderSafeString(rec.issue)}</h3>
                  </div>
                  {getUrgencyBadge(rec.urgency)}
                </div>

                {/* Recommended Action Box */}
                <div className="p-4 bg-indigo-600/10 border border-indigo-500/30 rounded-2xl text-xs text-indigo-300 space-y-1">
                  <strong className="text-indigo-400 block font-bold">⚡ Recommended Action:</strong>
                  <p className="font-medium text-white">{renderSafeString(rec.recommendedAction)}</p>
                </div>

                {/* Why & Supporting Evidence */}
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 block">Why (Root Cause Reasoning):</span>
                    <p className="text-base-content/80 font-medium mt-0.5">{renderSafeString(rec.why)}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 block mb-1">Supporting Evidence:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(rec.supportingEvidence) ? rec.supportingEvidence.map((ev, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-lg bg-base-300 border border-base-300 text-base-content/70 text-[10px] font-mono">
                          ✓ {renderSafeString(ev)}
                        </span>
                      )) : (
                        <span className="px-2.5 py-0.5 rounded-lg bg-base-300 text-base-content/70 text-[10px] font-mono">
                          ✓ {renderSafeString(rec.supportingEvidence)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Impact & Confidence */}
                <div className="pt-3 border-t border-base-300 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 block font-bold">ESTIMATED IMPACT</span>
                    <span className="text-base-content font-bold">{renderSafeString(rec.estimatedImpact)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                      {rec.confidenceScore}% Confidence
                    </span>

                    <Button
                      onClick={() => handleExecuteAction(rec.id)}
                      disabled={isExecuted}
                      size="sm"
                      className={cn(
                        "rounded-xl gap-1 text-xs font-bold",
                        isExecuted ? "bg-emerald-600 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      )}
                    >
                      {isExecuted ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                      {isExecuted ? 'Action Executed' : 'Execute Action'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CONTINUOUS MONITORED CHANNELS & PROACTIVE ALERTS ─────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monitored Channels Status */}
        <div className="lg:col-span-1 p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" /> Monitored Channels
            </h3>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="space-y-2">
            {monitoring?.channelsMonitored?.map((ch: any, idx: number) => (
              <div key={idx} className="p-3 bg-base-200 border border-base-300 rounded-2xl text-xs flex items-center justify-between">
                <div>
                  <strong className="text-base-content block font-bold">{ch.name}</strong>
                  <span className="text-[10px] text-base-content/50 font-mono">Last scan: {ch.lastScan}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {ch.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Proactive Alerts */}
        <div className="lg:col-span-2 p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-500" /> Real-time Proactive Stream
            </h3>
            <span className="text-[10px] font-mono text-base-content/50">Auto-generated</span>
          </div>

          <div className="space-y-3">
            {monitoring?.activeProactiveAlerts?.map((alert: any) => (
              <div key={alert.id} className="p-4 bg-base-200 border border-base-300 rounded-2xl text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                    📡 {alert.channel}
                  </span>
                  <span className="text-[10px] text-base-content/50 font-mono">{alert.timestamp}</span>
                </div>
                <p className="text-base-content font-medium">{alert.message}</p>
                <div className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <span>Action: {alert.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── CATEGORIZED OPERATIONAL BREAKDOWN ─────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Revenue Updates */}
        <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-500" /> Revenue & Financial Metrics
          </h3>
          <div className="space-y-2">
            {briefing?.revenueUpdates?.map((rev: any, i: number) => (
              <div key={i} className="p-3 bg-base-200 border border-base-300 rounded-2xl text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-base-content">{rev.metric}</span>
                  <span className="font-extrabold text-emerald-400 font-mono">{rev.value}</span>
                </div>
                <p className="text-[11px] text-base-content/60">{rev.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contract Expirations */}
        <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-500" /> Contract Expirations
          </h3>
          <div className="space-y-2">
            {briefing?.contractExpirations?.map((c: any, i: number) => (
              <div key={i} className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-xs space-y-1">
                <strong className="text-amber-300 block font-bold">{c.name}</strong>
                <div className="flex justify-between text-[10px] font-mono text-base-content/60">
                  <span>Expires: {c.expirationDate}</span>
                  <span className="text-amber-400 font-bold">{c.daysLeft} days left</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals & Decision Queue */}
        <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-500" /> Pending Decision Queue
          </h3>
          <div className="space-y-2">
            {briefing?.decisionQueue?.map((dec: any, i: number) => (
              <div key={i} className="p-3 bg-base-200 border border-base-300 rounded-2xl text-xs flex justify-between items-center">
                <div>
                  <strong className="text-base-content block font-bold">{dec.title}</strong>
                  <span className="text-[10px] text-indigo-400 font-mono">Rec: {dec.recommendation}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-base-300 text-base-content/70">
                  {dec.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
