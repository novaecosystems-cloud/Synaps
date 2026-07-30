import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppLoading() {
  return (
    <div className="flex h-screen w-full flex-col bg-slate-950 p-6 space-y-6 overflow-hidden">
      {/* App Header Skeleton */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-xl bg-emerald-950/60" />
          <Skeleton className="h-6 w-32 bg-slate-800/80" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-48 rounded-lg bg-slate-800/50" />
          <Skeleton className="h-9 w-9 rounded-full bg-slate-800/70" />
        </div>
      </div>

      {/* App Body Grid Skeleton */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Skeleton */}
        <div className="hidden md:flex flex-col gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800/60">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg bg-slate-800/50" />
          ))}
        </div>

        {/* Main Content Area Skeleton */}
        <div className="md:col-span-3 space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-64 bg-slate-800/80" />
            <Skeleton className="h-9 w-32 rounded-lg bg-emerald-950/50" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-28 rounded-xl bg-slate-900/60 border border-slate-800/60" />
            <Skeleton className="h-28 rounded-xl bg-slate-900/60 border border-slate-800/60" />
            <Skeleton className="h-28 rounded-xl bg-slate-900/60 border border-slate-800/60" />
          </div>
          <Skeleton className="h-80 w-full rounded-xl bg-slate-900/60 border border-slate-800/60" />
        </div>
      </div>
    </div>
  );
}
