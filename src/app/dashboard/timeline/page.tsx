'use client';

import React, { useState, useEffect } from 'react';
import { 
  GitCommit, GitBranch, Calendar, Filter, FileText, Users, 
  CheckCircle2, Loader2, RefreshCw, ShieldAlert, ChevronRight, 
  ArrowUpRight, X, Sparkles, AlertTriangle, Layers, Tag, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TimelinePage() {
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedCommit, setSelectedCommit] = useState<any | null>(null);

  const fetchTimeline = async (cat?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = cat && cat !== 'ALL' ? `/api/timeline?category=${cat}` : '/api/timeline';
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setTimelineData(json.data);
      } else {
        setError(json.error || 'Failed to load timeline');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching timeline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline(selectedCategory);
  }, [selectedCategory]);

  const categories = [
    { label: 'All Commits', value: 'ALL' },
    { label: 'Meetings', value: 'MEETING' },
    { label: 'Contracts', value: 'CONTRACT' },
    { label: 'Projects', value: 'PROJECT' },
    { label: 'Policy Changes', value: 'POLICY_CHANGE' },
    { label: 'Hiring', value: 'HIRING' },
    { label: 'Decisions', value: 'DECISION' },
    { label: 'Customers', value: 'CUSTOMER' },
    { label: 'Product Launches', value: 'PRODUCT_LAUNCH' },
    { label: 'Incidents', value: 'INCIDENT' },
  ];

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'MEETING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Meeting</span>;
      case 'CONTRACT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">Contract</span>;
      case 'PROJECT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">Project</span>;
      case 'POLICY_CHANGE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Policy Change</span>;
      case 'HIRING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">Hiring</span>;
      case 'DECISION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Decision</span>;
      case 'PRODUCT_LAUNCH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-pink-500/10 text-pink-400 border border-pink-500/20">Product Launch</span>;
      case 'INCIDENT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">Incident</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/20">{category}</span>;
    }
  };

  return (
    <div className="w-full space-y-8 font-sans pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
            <GitBranch className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-base-content">Organization Time-Travel Timeline</h1>
            <p className="text-xs text-base-content/60">Navigate corporate history like Git commits (`git log`). Inspect documents, decisions & meetings.</p>
          </div>
        </div>
        <Link href="/dashboard/graph" className="btn btn-outline btn-sm rounded-2xl gap-2">
          <Layers className="w-4 h-4 text-primary" /> Memory Graph View
        </Link>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => setSelectedCategory(c.value)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border",
              selectedCategory === c.value
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-base-100 border-base-300 text-base-content/70 hover:text-base-content hover:bg-base-200"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Git Commit Time-Travel Stream */}
      {loading ? (
        <div className="w-full py-16 flex flex-col items-center justify-center text-base-content">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          <p className="text-sm font-medium">Reconstructing organization history timeline...</p>
        </div>
      ) : error ? (
        <div className="w-full p-8 text-center bg-base-200 border border-base-300 rounded-3xl">
          <ShieldAlert className="w-10 h-10 text-destructive mx-auto mb-3" />
          <h3 className="text-lg font-bold">Failed to load timeline</h3>
          <p className="text-xs text-base-content/60 max-w-md mx-auto mt-1 mb-4">{error}</p>
          <Button onClick={() => fetchTimeline(selectedCategory)} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" /> Retry
          </Button>
        </div>
      ) : timelineData.length === 0 ? (
        <div className="w-full py-16 text-center bg-base-100 border border-base-300 border-dashed rounded-3xl space-y-3">
          <GitCommit className="w-12 h-12 text-base-content/30 mx-auto" />
          <h3 className="text-lg font-bold text-base-content">No Timeline Commits Found</h3>
          <p className="text-xs text-base-content/60 max-w-md mx-auto">
            Upload documents or meetings to record history events into the company time-travel log.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-base-300">
          {timelineData.map((item) => (
            <div key={item.id} className="relative group">
              
              {/* Git Node Circle */}
              <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-base-100 border-2 border-primary flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform z-10">
                <GitCommit className="w-3.5 h-3.5 text-primary" />
              </div>

              {/* Commit Card */}
              <div 
                onClick={() => setSelectedCommit(item)}
                className="bg-base-100 border border-base-300 hover:border-primary/40 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3"
              >
                <div className="flex flex-wrap justify-between items-center gap-2 border-b border-base-200 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                      commit {item.commitHash}
                    </span>
                    {getCategoryBadge(item.category)}
                  </div>
                  <span className="text-xs text-base-content/50 flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5" /> {new Date(item.eventDate).toLocaleDateString()} ({new Date(item.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-base-content group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-base-content/70 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {item.documentName && (
                  <div className="flex items-center gap-2 pt-1 text-xs text-base-content/60">
                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Linked Doc: <strong className="text-base-content">{item.documentName}</strong></span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* COMMIT INSPECTOR MODAL */}
      {selectedCommit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative space-y-5">
            <button onClick={() => setSelectedCommit(null)} className="absolute top-4 right-4 p-2 text-base-content/50 hover:text-base-content">
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded">
                  commit {selectedCommit.commitHash}
                </span>
                {getCategoryBadge(selectedCommit.category)}
              </div>
              <h2 className="text-xl font-bold text-base-content">{selectedCommit.title}</h2>
              <p className="text-xs text-base-content/50">Recorded on {new Date(selectedCommit.eventDate).toLocaleString()}</p>
            </div>

            <div className="p-4 bg-base-200 border border-base-300 rounded-2xl text-xs text-base-content/90 leading-relaxed">
              {selectedCommit.description}
            </div>

            {selectedCommit.documentName && (
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs flex justify-between items-center">
                <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> {selectedCommit.documentName}
                </span>
                <Link href="/dashboard/documents" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  View Document <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            <div className="pt-2 border-t border-base-300 flex justify-between items-center">
              <Link href="/dashboard/graph" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                Explore in Memory Graph →
              </Link>
              <Button onClick={() => setSelectedCommit(null)} className="rounded-xl">Close Commit</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
