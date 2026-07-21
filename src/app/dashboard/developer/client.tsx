'use client'

import { useState } from 'react';
import { Database, Search, Trash, Cpu, Loader2, ArrowRight, Zap, Sparkles, Layers } from 'lucide-react';

export default function DeveloperClient({ initialStats }: { initialStats: any }) {
  const [stats, setStats] = useState(initialStats);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchStats = async () => {
    window.location.reload();
  };

  const generateEmbeddings = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/embeddings', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(`Generated ${data.processed} embeddings!`);
        fetchStats();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Failed to generate embeddings');
    } finally {
      setIsGenerating(false);
    }
  };

  const clearEmbeddings = async () => {
    if (!confirm('Are you sure you want to clear all embeddings?')) return;
    setIsClearing(true);
    try {
      const res = await fetch('/api/embeddings', { method: 'DELETE' });
      if (res.ok) fetchStats();
    } catch (err) {
      alert('Failed to clear embeddings');
    } finally {
      setIsClearing(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const res = await fetch(`/api/embeddings?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.results);
      } else {
        alert('Search error: ' + data.error);
      }
    } catch (err) {
      alert('Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const progressPercentage = stats.totalChunks > 0 
    ? Math.round((stats.embeddedChunks / stats.totalChunks) * 100) 
    : 0;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative group rounded-2xl p-[1px] overflow-hidden bg-gradient-to-br from-blue-500/30 to-purple-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative h-full bg-black/60 backdrop-blur-xl rounded-2xl p-6 flex flex-col justify-between border border-white/5">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
                <Layers className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-white/30">Storage</span>
            </div>
            <div>
              <p className="text-5xl font-light text-white mb-1 tracking-tight">{stats.totalChunks}</p>
              <p className="text-white/40 text-sm font-medium">Total Document Chunks</p>
            </div>
          </div>
        </div>

        <div className="relative group rounded-2xl p-[1px] overflow-hidden bg-gradient-to-br from-emerald-500/30 to-teal-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative h-full bg-black/60 backdrop-blur-xl rounded-2xl p-6 flex flex-col justify-between border border-white/5">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-white/30">Vector DB</span>
            </div>
            <div>
              <p className="text-5xl font-light text-white mb-1 tracking-tight">{stats.embeddedChunks}</p>
              <p className="text-white/40 text-sm font-medium">Generated Embeddings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Actions */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-white/70">Vectorization Progress</h3>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          
          <div className="flex gap-4 shrink-0 w-full md:w-auto">
            <button 
              onClick={generateEmbeddings}
              disabled={isGenerating || stats.totalChunks === stats.embeddedChunks}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:grayscale"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              {isGenerating ? 'Processing...' : 'Run Pipeline'}
            </button>

            <button 
              onClick={clearEmbeddings}
              disabled={isClearing || stats.embeddedChunks === 0}
              className="flex items-center justify-center p-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-colors disabled:opacity-50 border border-red-500/20"
              title="Clear all embeddings"
            >
              {isClearing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Semantic Search */}
      <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
            <Search className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-light text-white">Semantic Search Matrix</h2>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSearch} className="relative group mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="relative flex gap-3">
              <div className="relative flex-1">
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask anything across all indexed documents..."
                  className="w-full bg-black/60 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-lg font-light"
                />
              </div>
              <button 
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] disabled:opacity-50 flex items-center gap-2"
              >
                {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                Retrieve
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {searchResults.map((result: any, i: number) => (
              <div 
                key={result.id || i} 
                className="group relative bg-black/40 border border-white/5 hover:border-indigo-500/30 rounded-xl p-5 transition-all hover:bg-indigo-500/5"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md">
                      <Zap className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-xs font-medium text-indigo-300">
                        Score: {(result.similarity * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-white/40 bg-white/5 px-2 py-1 rounded border border-white/10">
                    Pg: {result.pageNumber || '?'}
                  </span>
                </div>
                <p className="text-sm text-white/80 leading-relaxed font-light whitespace-pre-wrap pl-1 border-l-2 border-indigo-500/30 group-hover:border-indigo-500 transition-colors">
                  {result.text}
                </p>
              </div>
            ))}
            
            {searchResults.length === 0 && !isSearching && (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                <Database className="w-12 h-12 text-white/20 mb-4" />
                <h3 className="text-lg font-medium text-white/60 mb-2">Awaiting Query</h3>
                <p className="text-sm text-white/40 max-w-sm">
                  Enter a semantic search query above to instantly retrieve the most contextually relevant document chunks via vector distance.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
