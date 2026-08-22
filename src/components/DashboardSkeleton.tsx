"use client";

import React from "react";

export function DashboardSkeleton() {
  return (
    <div className="w-full space-y-8 font-sans animate-pulse pb-16">
      {/* Top Banner Skeleton */}
      <div className="p-8 rounded-3xl bg-base-100 border border-base-300 space-y-4">
        <div className="h-4 w-36 bg-base-300/80 rounded-full" />
        <div className="h-8 w-2/3 bg-base-300 rounded-2xl" />
        <div className="h-4 w-1/2 bg-base-300/60 rounded-xl" />
        <div className="flex gap-3 pt-2">
          <div className="h-10 w-36 bg-base-300 rounded-2xl" />
          <div className="h-10 w-36 bg-base-300/60 rounded-2xl" />
        </div>
      </div>

      {/* 4 Metric Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-3xl bg-base-100 border border-base-300 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-base-300/70 rounded-md" />
              <div className="w-8 h-8 rounded-xl bg-base-300" />
            </div>
            <div className="h-8 w-28 bg-base-300 rounded-xl" />
            <div className="h-3 w-32 bg-base-300/50 rounded-md" />
          </div>
        ))}
      </div>

      {/* 2-Column Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-base-100 border border-base-300 space-y-4">
          <div className="h-6 w-48 bg-base-300 rounded-xl" />
          <div className="h-48 bg-base-200 rounded-2xl" />
        </div>
        <div className="p-6 rounded-3xl bg-base-100 border border-base-300 space-y-4">
          <div className="h-6 w-36 bg-base-300 rounded-xl" />
          <div className="space-y-3">
            <div className="h-14 bg-base-200 rounded-2xl" />
            <div className="h-14 bg-base-200 rounded-2xl" />
            <div className="h-14 bg-base-200 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardSkeleton;
