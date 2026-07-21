'use client';

import React, { useState, useEffect } from 'react';

export default function GapDashboard({ documentId }: { documentId: string }) {
  const [gaps, setGaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGap, setSelectedGap] = useState<any | null>(null);

  useEffect(() => {
    if (documentId) {
      fetchGaps();
    }
  }, [documentId]);

  const fetchGaps = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/gaps?documentId=${documentId}`);
      const data = await res.json();
      if (data.success) {
        setGaps(data.gaps);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const analyzeGaps = async () => {
    setAnalyzing(true);
    setError(null);
    try {
      const res = await fetch(`/api/gaps/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId })
      });
      const data = await res.json();
      if (data.success) {
        fetchGaps();
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-500 border-red-500/50';
      case 'HIGH': return 'bg-orange-500/20 text-orange-500 border-orange-500/50';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
      case 'LOW': return 'bg-green-500/20 text-green-500 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  if (!documentId) return <div className="p-8 text-center text-gray-400">Please select a document first.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT PANEL: Gaps List */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium text-white">Identified Gaps</h2>
          <button 
            onClick={analyzeGaps}
            disabled={analyzing}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-md transition-colors font-medium flex items-center gap-2"
          >
            {analyzing ? 'Analyzing...' : 'Analyze Gaps'}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-800 rounded-md"></div>
            ))}
          </div>
        ) : gaps.length === 0 ? (
          <div className="text-center p-12 border border-gray-800 rounded-lg text-gray-400">
            No gaps identified. Run Gap Analysis to find missing requirements.
          </div>
        ) : (
          <div className="space-y-4">
            {gaps.map((gap) => (
              <div 
                key={gap.id}
                onClick={() => setSelectedGap(gap)}
                className={`p-5 rounded-lg border transition-colors cursor-pointer ${
                  selectedGap?.id === gap.id ? 'bg-gray-800/80 border-indigo-500/50' : 'bg-black border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-medium">{gap.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300 border border-gray-700">
                      {gap.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded border ${getSeverityColor(gap.severity)}`}>
                      {gap.severity}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">{gap.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT PANEL: Evidence & Recommendations */}
      <div className="border border-gray-800 bg-[#0a0a0a] rounded-lg p-6 min-h-[600px] flex flex-col">
        <h3 className="text-lg font-medium text-white mb-6 border-b border-gray-800 pb-4">
          Resolution Details
        </h3>
        
        {selectedGap ? (
          <div className="space-y-6 flex-1 overflow-y-auto pr-2">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">Gap Title</div>
              <div className="text-white text-lg font-medium">{selectedGap.title}</div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">Description</div>
              <div className="text-gray-300 text-sm leading-relaxed bg-black p-4 rounded-md border border-gray-800">
                {selectedGap.description}
              </div>
            </div>

            <div>
              <div className="text-xs text-indigo-400 uppercase tracking-wider mb-2 font-medium">Suggested Resolution</div>
              <div className="text-indigo-200 text-sm leading-relaxed bg-indigo-500/10 p-4 rounded-md border border-indigo-500/20">
                {selectedGap.suggestedResolution}
              </div>
            </div>

            {selectedGap.relatedRequirement && (
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">Related Requirement</div>
                <div className="text-gray-400 text-sm italic bg-black p-4 rounded-md border border-gray-800">
                  "{selectedGap.relatedRequirement.text}"
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 h-full">
            <svg className="w-12 h-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-center">Select a gap from the list to view resolution recommendations.</p>
          </div>
        )}
      </div>
    </div>
  );
}
