'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, XCircle, AlertTriangle, Play, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

export default function DecisionDashboard({ documentId }: { documentId: string }) {
  const [decision, setDecision] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (documentId) {
      fetchDecision();
    }
  }, [documentId]);

  const fetchDecision = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/decisions?documentId=${documentId}`);
      const data = await res.json();
      if (data.success) {
        setDecision(data.decision);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateDecision = async () => {
    setAnalyzing(true);
    setError(null);
    try {
      const res = await fetch(`/api/decisions/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId })
      });
      const data = await res.json();
      if (data.success) {
        fetchDecision();
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      const res = await fetch(`/api/decisions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, status })
      });
      const data = await res.json();
      if (data.success) {
        setDecision(data.decision);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getRecommendationStyle = (rec: string) => {
    switch (rec) {
      case 'GO': return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: <CheckCircle className="w-12 h-12" /> };
      case 'NO_GO': return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: <XCircle className="w-12 h-12" /> };
      case 'CONDITIONAL_GO': return { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: <AlertTriangle className="w-12 h-12" /> };
      default: return { color: 'text-gray-500', bg: 'bg-gray-500/10', border: 'border-gray-500/30', icon: <CheckCircle className="w-12 h-12" /> };
    }
  };

  if (!documentId) return <div className="p-8 text-center text-muted-foreground">Please select a document first.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-card border border-border p-4 rounded-xl shadow-sm">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">Decision Workspace</h2>
          <p className="text-sm text-muted-foreground">AI-driven Go/No-Go recommendation based on your requirements and gaps.</p>
        </div>
        <button 
          onClick={generateDecision}
          disabled={analyzing}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-md transition-colors font-medium flex items-center gap-2"
        >
          {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {analyzing ? 'Generating...' : 'Generate Decision'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-md text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : !decision ? (
        <div className="text-center p-16 border border-border bg-card rounded-xl text-muted-foreground">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 opacity-50" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No Decision Generated</h3>
          <p>Click "Generate Decision" to evaluate this RFP.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Recommendation Card */}
            <div className={`p-8 rounded-xl border ${getRecommendationStyle(decision.recommendation).bg} ${getRecommendationStyle(decision.recommendation).border} flex items-center gap-6 shadow-sm`}>
              <div className={`${getRecommendationStyle(decision.recommendation).color}`}>
                {getRecommendationStyle(decision.recommendation).icon}
              </div>
              <div className="flex-1">
                <h1 className={`text-4xl font-display font-bold mb-2 ${getRecommendationStyle(decision.recommendation).color}`}>
                  {decision.recommendation.replace('_', ' ')}
                </h1>
                <p className="text-foreground/90 leading-relaxed font-medium">
                  {decision.executiveSummary}
                </p>
              </div>
            </div>

            {/* Evidence & Risks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Business Impact</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">{decision.businessImpact}</p>
              </div>
              <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Financial Risk</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">{decision.financialRisk}</p>
              </div>
              <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Technical Risk</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">{decision.technicalRisk}</p>
              </div>
              <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Compliance Risk</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">{decision.complianceRisk}</p>
              </div>
              <div className="bg-card border border-border p-5 rounded-xl shadow-sm md:col-span-2">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Timeline Risk</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">{decision.timelineRisk}</p>
              </div>
            </div>
            
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-bold text-indigo-500 uppercase tracking-wider mb-2">Supporting Evidence</h3>
                <div className="p-4 bg-[#050508] border border-white/5 rounded-lg text-sm text-white/80 leading-relaxed border-l-4 border-l-indigo-500">
                  {decision.supportingEvidence}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider mb-2">Counterarguments</h3>
                <div className="p-4 bg-[#050508] border border-white/5 rounded-lg text-sm text-white/80 leading-relaxed border-l-4 border-l-orange-500">
                  {decision.counterarguments}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-wider mb-2">Alternative Recommendation</h3>
                <div className="p-4 bg-[#050508] border border-white/5 rounded-lg text-sm text-white/80 leading-relaxed border-l-4 border-l-emerald-500">
                  {decision.alternativeRecommendation}
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Confidence Meter */}
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm text-center">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">AI Confidence</h3>
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" className="text-muted/20" strokeWidth="12" stroke="currentColor" fill="transparent" />
                  <circle 
                    cx="64" cy="64" r="56" 
                    className="text-indigo-500 transition-all duration-1000 ease-in-out" 
                    strokeWidth="12" 
                    strokeDasharray={351.858} 
                    strokeDashoffset={351.858 - (351.858 * decision.confidence) / 100}
                    strokeLinecap="round"
                    stroke="currentColor" 
                    fill="transparent" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-display font-bold text-foreground">{decision.confidence}%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">Confidence in this recommendation based on available data.</p>
            </div>

            {/* Workflow Actions */}
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Status Review</h3>
              
              <div className="flex items-center justify-between mb-6 bg-muted/30 p-3 rounded-lg border border-border">
                <span className="text-sm font-medium text-muted-foreground">Current Status:</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider
                  ${decision.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                    decision.status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                    decision.status === 'NEEDS_REVIEW' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                    'bg-gray-500/10 text-gray-500 border border-gray-500/20'}`}
                >
                  {decision.status.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => updateStatus('APPROVED')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 rounded-lg transition-colors text-sm font-medium"
                >
                  <ThumbsUp className="w-4 h-4" /> Approve Recommendation
                </button>
                <button 
                  onClick={() => updateStatus('REJECTED')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg transition-colors text-sm font-medium"
                >
                  <ThumbsDown className="w-4 h-4" /> Reject Recommendation
                </button>
                <button 
                  onClick={() => updateStatus('NEEDS_REVIEW')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded-lg transition-colors text-sm font-medium"
                >
                  <MessageSquare className="w-4 h-4" /> Request Review
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
