'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Play, Download, Printer, FileText, CheckCircle, AlertTriangle, TrendingUp, ShieldCheck } from 'lucide-react';

export default function SummaryDashboard({ documentId }: { documentId: string }) {
  const [summary, setSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (documentId) {
      fetchSummary();
    }
  }, [documentId]);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/summary?documentId=${documentId}`);
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async () => {
    setAnalyzing(true);
    setError(null);
    try {
      const res = await fetch(`/api/summary/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId })
      });
      const data = await res.json();
      if (data.success) {
        fetchSummary();
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadMarkdown = () => {
    if (!summary) return;
    const md = `
# Executive Summary

## Overview
${summary.projectOverview}

## Summary
${summary.executiveSummary}

## Recommendation
${summary.businessRecommendation}

## Key Requirements
${summary.keyRequirements}

## Top Risks
${summary.topRisks}

## Top Opportunities
${summary.topOpportunities}

## Estimated Effort
${summary.estimatedEffort}

## Compliance Status
${summary.complianceStatus}

## Evidence References
${(summary.evidenceReferences || []).map((e: string, i: number) => `\n${i + 1}. "${e}"`).join('')}
    `;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Executive_Summary.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!documentId) return <div className="p-8 text-center text-muted-foreground">Please select a document first.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="flex justify-between items-center bg-card border border-border p-4 rounded-xl shadow-sm print:hidden">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">Executive Summary</h2>
          <p className="text-sm text-muted-foreground">Final synthesized report combining requirements, gaps, and decision.</p>
        </div>
        <div className="flex gap-2">
          {summary && (
            <>
              <button 
                onClick={downloadMarkdown}
                className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-md transition-colors font-medium flex items-center gap-2 border border-border"
              >
                <Download className="w-4 h-4" /> Markdown
              </button>
              <button 
                onClick={handlePrint}
                className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-md transition-colors font-medium flex items-center gap-2 border border-border"
              >
                <Printer className="w-4 h-4" /> Print / PDF
              </button>
            </>
          )}
          <button 
            onClick={generateSummary}
            disabled={analyzing}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-md transition-colors font-medium flex items-center gap-2"
          >
            {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {analyzing ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-md text-sm print:hidden">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12 print:hidden">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : !summary ? (
        <div className="text-center p-16 border border-border bg-card rounded-xl text-muted-foreground print:hidden">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 opacity-50" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No Report Generated</h3>
          <p>Click "Generate Report" to synthesize the final executive summary.</p>
        </div>
      ) : (
        <div className="bg-white text-slate-900 rounded-xl shadow-sm p-12 print:p-0 print:shadow-none print:border-none border border-slate-200">
          
          <div className="mb-12 pb-6 border-b-2 border-slate-200">
            <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4 tracking-tight">Executive Summary Report</h1>
            <p className="text-lg text-slate-600 font-medium">Prepared automatically via AI Document Analysis</p>
          </div>

          <div className="space-y-10 font-serif">
            
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-indigo-600" /> Project Overview
              </h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{summary.projectOverview}</p>
            </section>

            <section className="bg-slate-50 p-6 rounded-lg border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Executive Summary</h2>
              <p className="text-slate-700 leading-relaxed font-medium text-lg whitespace-pre-wrap">{summary.executiveSummary}</p>
            </section>
            
            <section className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-r-lg">
              <h2 className="text-xl font-bold text-indigo-900 mb-3">Business Recommendation</h2>
              <p className="text-indigo-950 font-bold text-lg leading-relaxed whitespace-pre-wrap">{summary.businessRecommendation}</p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2">
              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" /> Key Requirements
                </h2>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">{summary.keyRequirements}</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" /> Top Risks
                </h2>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">{summary.topRisks}</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" /> Top Opportunities
                </h2>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">{summary.topOpportunities}</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-600" /> Compliance Status
                </h2>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">{summary.complianceStatus}</p>
              </section>
            </div>

            <section className="pt-8 border-t border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Estimated Effort</h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{summary.estimatedEffort}</p>
            </section>

            {summary.evidenceReferences && summary.evidenceReferences.length > 0 && (
              <section className="pt-8 border-t border-slate-200">
                <h2 className="text-lg font-bold text-slate-500 uppercase tracking-wider mb-4">Supporting Evidence References</h2>
                <ul className="list-decimal pl-5 space-y-3">
                  {summary.evidenceReferences.map((evidence: string, idx: number) => (
                    <li key={idx} className="text-xs text-slate-500 italic leading-relaxed">"{evidence}"</li>
                  ))}
                </ul>
              </section>
            )}

          </div>

        </div>
      )}
    </div>
  );
}
