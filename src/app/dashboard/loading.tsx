import React from 'react';

export default function DashboardLoading() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Welcome Banner Skeleton */}
      <div className="h-32 bg-white/5 rounded-xl border border-white/5 w-full"></div>
      
      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-28 bg-white/5 rounded-xl border border-white/5"></div>
        <div className="h-28 bg-white/5 rounded-xl border border-white/5"></div>
        <div className="h-28 bg-white/5 rounded-xl border border-white/5"></div>
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[400px] bg-white/5 rounded-xl border border-white/5"></div>
        <div className="h-[400px] bg-white/5 rounded-xl border border-white/5"></div>
      </div>
    </div>
  );
}
