import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DocumentDetailLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Breadcrumb & Actions */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-800/60">
        <div className="space-y-2">
          <Skeleton className="h-4 w-40 bg-slate-800/50" />
          <Skeleton className="h-7 w-80 bg-slate-700/70" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-9 w-24 rounded-lg bg-slate-800/60" />
          <Skeleton className="h-9 w-32 rounded-lg bg-emerald-950/40" />
        </div>
      </div>

      {/* Main Document Preview & AI Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Content View */}
        <div className="lg:col-span-2 space-y-4 p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 min-h-[500px]">
          <Skeleton className="h-6 w-3/4 bg-slate-700/60" />
          <Skeleton className="h-4 w-full bg-slate-800/50" />
          <Skeleton className="h-4 w-full bg-slate-800/50" />
          <Skeleton className="h-4 w-5/6 bg-slate-800/50" />
          <div className="py-4 space-y-3">
            <Skeleton className="h-5 w-1/2 bg-slate-700/60" />
            <Skeleton className="h-4 w-full bg-slate-800/40" />
            <Skeleton className="h-4 w-4/5 bg-slate-800/40" />
          </div>
        </div>

        {/* AI Analysis Sidebar */}
        <div className="space-y-4 p-6 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <Skeleton className="h-6 w-40 bg-slate-700/70" />
          <Skeleton className="h-20 w-full rounded-lg bg-emerald-950/30 border border-emerald-800/30" />
          <div className="space-y-3 pt-2">
            <Skeleton className="h-4 w-32 bg-slate-800/60" />
            <Skeleton className="h-10 w-full rounded-md bg-slate-800/40" />
            <Skeleton className="h-10 w-full rounded-md bg-slate-800/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
