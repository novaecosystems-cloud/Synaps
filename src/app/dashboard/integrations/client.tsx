'use client';

import React, { useState, useEffect } from 'react';
import { 
  Globe, Search, ExternalLink, ShieldCheck, Zap, Sparkles, Filter, 
  CheckCircle2, Lock, Key, RefreshCw, Cpu, Database, Plus, ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PublicApiItem } from '@/lib/public-apis';
import Link from 'next/link';

const CATEGORIES = [
  'ALL',
  'Business & Finance',
  'Hospitality & Tourism',
  'Security & Compliance',
  'News & Intelligence',
  'Open Data & Gov',
  'AI & Analytics'
];

export default function IntegrationsClient() {
  const [apis, setApis] = useState<PublicApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [connectedIds, setConnectedIds] = useState<string[]>(['api-currencylayer', 'api-open-weather']);

  const loadApis = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'ALL') params.append('category', selectedCategory);
      if (searchQuery) params.append('query', searchQuery);

      const res = await fetch(`/api/public-apis?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.apis)) {
        setApis(data.apis);
      }
    } catch (err) {
      console.error('Error fetching APIs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApis();
  }, [selectedCategory, searchQuery]);

  const toggleConnection = (id: string, name: string) => {
    if (connectedIds.includes(id)) {
      setConnectedIds(prev => prev.filter(item => item !== id));
    } else {
      setConnectedIds(prev => [...prev, id]);
    }
  };

  return (
    <div className="w-full space-y-8 font-sans pb-16">
      
      {/* 1. HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 text-white p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                <Globe className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">Powered by GitHub public-apis/public-apis</span>
                <h1 className="text-2xl font-bold tracking-tight text-white">Public APIs & Data Connectors Hub</h1>
              </div>
            </div>
            
            <a 
              href="https://github.com/public-apis/public-apis" 
              target="_blank" 
              rel="noreferrer"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              github.com/public-apis/public-apis
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed max-w-4xl bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
            Connect live public datasets, market tickers, hospitality metrics, and security intelligence directly into the Synaps 3D Memory Lattice. Ground your AI COO and 10-Agent Boardroom with real-time public data streams.
          </p>
        </div>
      </div>

      {/* 2. SEARCH & CATEGORY FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-base-100 border border-base-300 rounded-2xl p-4 shadow-sm">
        
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-base-content/40" />
          <input 
            type="text" 
            placeholder="Search 1,400+ public APIs (e.g. Currency, Weather, TripAdvisor, Stripe)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-base-200 border border-base-300 rounded-xl pl-10 pr-4 py-2 text-xs text-base-content outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-base-content/40 shrink-0 ml-1" />
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? 'bg-primary text-primary-content shadow-md' 
                  : 'bg-base-200 hover:bg-base-300 text-base-content/70'
              }`}
            >
              {cat === 'ALL' ? '🌐 All Categories' : cat}
            </button>
          ))}
        </div>

      </div>

      {/* 3. API GRID */}
      {loading ? (
        <div className="w-full min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs text-base-content/60 font-medium">Fetching public-apis catalog...</p>
        </div>
      ) : apis.length === 0 ? (
        <div className="w-full p-8 text-center bg-base-200 border border-base-300 rounded-3xl">
          <Globe className="w-10 h-10 text-base-content/30 mx-auto mb-3" />
          <h3 className="text-base font-bold">No public APIs matched your query</h3>
          <p className="text-xs text-base-content/60 max-w-md mx-auto mt-1 mb-4">Try adjusting your search filter or category selection.</p>
          <Button onClick={() => { setSelectedCategory('ALL'); setSearchQuery(''); }} variant="outline" size="sm">
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apis.map((api) => {
            const isConnected = connectedIds.includes(api.id);
            return (
              <div 
                key={api.id}
                className="bg-base-100 border border-base-300 hover:border-primary/40 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                        {api.category}
                      </span>
                      <h3 className="font-bold text-base text-base-content group-hover:text-primary transition-colors mt-2">
                        {api.name}
                      </h3>
                    </div>

                    <a 
                      href={api.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      title="Open API Documentation"
                      className="p-2 rounded-xl bg-base-200 hover:bg-base-300 text-base-content/60 hover:text-base-content transition-colors shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <p className="text-xs text-base-content/70 line-clamp-3 leading-relaxed">
                    {api.description}
                  </p>
                </div>

                {/* Metadata Badges & Connect Button */}
                <div className="space-y-3 pt-3 border-t border-base-200">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-base-content/60">
                    <span className="px-2 py-0.5 rounded bg-base-200 border border-base-300 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5 text-emerald-500" /> HTTPS
                    </span>
                    <span className="px-2 py-0.5 rounded bg-base-200 border border-base-300 flex items-center gap-1">
                      <Key className="w-2.5 h-2.5 text-amber-500" /> Auth: {api.auth}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-base-200 border border-base-300">
                      CORS: {api.cors}
                    </span>
                  </div>

                  <Button 
                    onClick={() => toggleConnection(api.id, api.name)}
                    variant={isConnected ? "outline" : "default"}
                    className={`w-full rounded-2xl gap-2 text-xs font-bold transition-all ${
                      isConnected 
                        ? 'border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10' 
                        : 'bg-primary hover:bg-primary-focus text-primary-content shadow-md'
                    }`}
                  >
                    {isConnected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Connected to Synaps AI
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" /> Connect Data Feed to AI COO
                      </>
                    )}
                  </Button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
