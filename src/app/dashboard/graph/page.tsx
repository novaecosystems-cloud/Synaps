'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Loader2, RefreshCw, Network, Compass, Sparkles, Layers } from 'lucide-react';
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

const WorldClawSpatialCampusPreview = dynamic(
  () => import('@/components/dashboard/WorldClawSpatialCampusPreview').then(m => m.WorldClawSpatialCampusPreview),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#020204] text-white">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500 mb-4" />
        <p className="text-sm text-slate-400">Synthesizing WorldClaw 3D Spatial Campus...</p>
      </div>
    )
  }
);

export default function MemoryGraphPage() {
  const [graphData, setGraphData] = useState<{ nodes: any[]; links: any[] }>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'lattice' | 'spatial'>('spatial');

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
      {/* ── TOP FLOATING MODE SWITCHER HUD ────────────────────────────────────── */}
      <div className="absolute top-6 left-6 z-30 flex items-center p-1.5 rounded-2xl bg-[#09090d]/90 border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] font-mono text-xs gap-1.5">
        <button
          onClick={() => setViewMode('spatial')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all font-bold ${
            viewMode === 'spatial'
              ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]'
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>3D WorldClaw Campus</span>
        </button>

        <button
          onClick={() => setViewMode('lattice')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all font-bold ${
            viewMode === 'lattice'
              ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]'
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          <span>Node Lattice Graph</span>
        </button>
      </div>

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
      ) : viewMode === 'spatial' ? (
        <WorldClawSpatialCampusPreview />
      ) : (
        <NetworkGraph data={graphData} />
      )}
    </div>
  );
}
