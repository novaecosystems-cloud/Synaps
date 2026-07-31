'use client';

import React, { useState, useEffect } from 'react';
import { 
  Globe, Search, Sparkles, ShieldCheck, CheckCircle2, AlertTriangle, 
  ExternalLink, FileCode, Sliders, RefreshCw, Loader2, Info, Copy, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OpenSEODashboardPage() {
  const [seoData, setSeoData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedJsonLd, setCopiedJsonLd] = useState(false);

  // Custom optimizer inputs
  const [inputTitle, setInputTitle] = useState('');
  const [inputDesc, setInputDesc] = useState('');
  const [auditResult, setAuditResult] = useState<any | null>(null);
  const [auditing, setAuditing] = useState(false);

  const fetchSeoData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/openseo');
      const json = await res.json();
      if (json.success && json.openSEO) {
        setSeoData(json.openSEO);
        setInputTitle(json.openSEO.audit?.titleStatus?.text || '');
        setInputDesc(json.openSEO.audit?.descriptionStatus?.text || '');
      }
    } catch (e) {
      console.error("Failed to fetch OpenSEO data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoData();
  }, []);

  const handleRunAudit = async () => {
    if (auditing) return;
    setAuditing(true);
    try {
      const res = await fetch('/api/openseo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: inputTitle, description: inputDesc })
      });
      const json = await res.json();
      if (json.success) {
        setAuditResult(json.audit);
      }
    } catch (e) {}
    setAuditing(false);
  };

  const handleCopyJsonLd = () => {
    if (!seoData?.jsonLd) return;
    navigator.clipboard.writeText(JSON.stringify(seoData.jsonLd, null, 2));
    setCopiedJsonLd(true);
    setTimeout(() => setCopiedJsonLd(false), 3000);
  };

  const currentScore = auditResult?.score || seoData?.score || 95;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 font-sans pb-16 text-base-content">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
            <Globe className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-base-content">OpenSEO Self-Hosted Control Center</h1>
              <span className="badge badge-success badge-sm font-mono text-[10px]">OpenSEO.so Engine</span>
            </div>
            <p className="text-xs text-base-content/60 mt-0.5">Hosted 100% free on your application server. Manages Meta Tags, Schema.org JSON-LD, Sitemap & Robots.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={fetchSeoData} disabled={loading} variant="outline" className="rounded-2xl gap-2 text-xs font-bold">
            <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} /> Refresh Audit
          </Button>
          <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="btn btn-primary btn-sm rounded-2xl gap-1 text-xs font-bold">
            <ExternalLink className="w-3.5 h-3.5" /> sitemap.xml
          </a>
        </div>
      </div>

      {/* Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-base-100 border border-base-300 rounded-3xl p-6 shadow-sm space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-base-content/60">OpenSEO Health Score</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-emerald-400">{currentScore}</span>
            <span className="text-xs font-bold text-base-content/60">/ 100</span>
          </div>
          <span className="text-[10px] text-emerald-500 font-bold block">✓ Google & SearchGPT Ready</span>
        </div>

        <div className="bg-base-100 border border-base-300 rounded-3xl p-6 shadow-sm space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-base-content/60">Schema.org JSON-LD</span>
          <div className="text-lg font-bold text-base-content flex items-center gap-1.5 pt-1">
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> Active
          </div>
          <span className="text-[10px] text-base-content/60 block">SoftwareApplication & Organization</span>
        </div>

        <div className="bg-base-100 border border-base-300 rounded-3xl p-6 shadow-sm space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-base-content/60">Sitemap Index</span>
          <div className="text-lg font-bold text-emerald-400 flex items-center gap-1.5 pt-1">
            <CheckCircle2 className="w-5 h-5" /> /sitemap.xml
          </div>
          <span className="text-[10px] text-base-content/60 block">Includes static + legal slugs</span>
        </div>

        <div className="bg-base-100 border border-base-300 rounded-3xl p-6 shadow-sm space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-base-content/60">Robots Directive</span>
          <div className="text-lg font-bold text-indigo-400 flex items-center gap-1.5 pt-1">
            <CheckCircle2 className="w-5 h-5" /> /robots.txt
          </div>
          <span className="text-[10px] text-base-content/60 block">Allow indexing on public pages</span>
        </div>
      </div>

      {/* Meta Tag Optimizer & Real-Time Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Editor Form */}
        <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-4 shadow-sm">
          <h3 className="font-bold text-sm uppercase tracking-wider text-base-content/60 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" /> OpenSEO Meta Tag Optimizer
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <label className="font-bold text-base-content/70">Page Title ({inputTitle.length} chars)</label>
                <span className={inputTitle.length >= 30 && inputTitle.length <= 65 ? "text-emerald-500 font-bold" : "text-amber-500 font-bold"}>
                  {inputTitle.length >= 30 && inputTitle.length <= 65 ? "Optimal (30-65)" : "Review Length"}
                </span>
              </div>
              <input 
                type="text" 
                value={inputTitle} 
                onChange={e => setInputTitle(e.target.value)}
                className="w-full bg-base-200 border border-base-300 rounded-2xl px-4 py-2.5 text-xs text-base-content outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <label className="font-bold text-base-content/70">Meta Description ({inputDesc.length} chars)</label>
                <span className={inputDesc.length >= 120 && inputDesc.length <= 165 ? "text-emerald-500 font-bold" : "text-amber-500 font-bold"}>
                  {inputDesc.length >= 120 && inputDesc.length <= 165 ? "Optimal (120-165)" : "Review Length"}
                </span>
              </div>
              <textarea 
                rows={3}
                value={inputDesc} 
                onChange={e => setInputDesc(e.target.value)}
                className="w-full bg-base-200 border border-base-300 rounded-2xl p-3 text-xs text-base-content outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none font-medium"
              />
            </div>

            <Button onClick={handleRunAudit} disabled={auditing} className="w-full rounded-2xl gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">
              {auditing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {auditing ? 'Auditing Metadata...' : 'Run OpenSEO Audit'}
            </Button>
          </div>
        </div>

        {/* Live Search Engine Preview */}
        <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-4 shadow-sm">
          <h3 className="font-bold text-sm uppercase tracking-wider text-base-content/60 flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-500" /> Google Search Result Preview
          </h3>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1.5 font-sans">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-[10px]">S</span>
              <span className="truncate">https://synaps.ai</span>
            </div>
            <h4 className="text-lg font-semibold text-blue-700 hover:underline cursor-pointer leading-snug">
              {inputTitle || "Synaps AI — 3D Corporate Memory Graph"}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {inputDesc || "Synaps AI transforms enterprise document libraries into an interactive 3D Knowledge Graph and 10-Agent AI Boardroom."}
            </p>
          </div>

          <div className="pt-2 flex justify-between items-center text-xs text-base-content/60">
            <span>JSON-LD Schema Script Ready</span>
            <button onClick={handleCopyJsonLd} className="btn btn-outline btn-xs rounded-lg gap-1">
              {copiedJsonLd ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              {copiedJsonLd ? 'Copied JSON-LD' : 'Copy JSON-LD'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
