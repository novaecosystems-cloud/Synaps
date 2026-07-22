'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Loader2, RefreshCw, Network, Layers, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NetworkGraph = dynamic(() => import('@/components/dashboard/network-graph').then(m => m.NetworkGraph), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#020204] text-white">
      <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
      <p className="text-sm text-slate-400">Constructing Enterprise Memory Graph...</p>
    </div>
  )
});

export default function MemoryGraphPage() {
  const [graphData, setGraphData] = useState<{ nodes: any[]; links: any[] }>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGraphData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/graph');
      const data = await res.json();
      if (data.success) {
        setGraphData(data.data);
      } else {
        setError(data.error || 'Failed to load memory graph data');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching graph');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData();
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-[#020204] overflow-hidden -m-4 sm:-m-6">
      {loading ? (
        <div className="w-full h-full flex flex-col items-center justify-center text-white">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
          <p className="text-sm font-medium text-slate-300">Loading Enterprise Memory Graph...</p>
        </div>
      ) : error ? (
        <div className="w-full h-full flex flex-col items-center justify-center text-red-400 p-6 text-center">
          <Network className="w-12 h-12 mb-3 text-red-500 opacity-60" />
          <h3 className="text-lg font-bold">Failed to Load Graph</h3>
          <p className="text-xs text-slate-400 max-w-md mt-1 mb-4">{error}</p>
          <Button onClick={fetchGraphData} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" /> Retry
          </Button>
        </div>
      ) : (
        <NetworkGraph data={graphData} />
      )}
    </div>
  );
}
