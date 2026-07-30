import * as React from "react"
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean
}

function Skeleton({
  className,
  shimmer = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-slate-800/60 border border-slate-700/30",
        shimmer ? "after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_2s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent" : "animate-pulse",
        className
      )}
      {...props}
    />
  )
}

function PageHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-slate-800/60">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 bg-slate-800/80" />
        <Skeleton className="h-4 w-96 bg-slate-800/50" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-10 w-36 rounded-lg bg-emerald-950/40 border-emerald-800/30" />
      </div>
    </div>
  )
}

function MetricCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${count} gap-4 mb-8`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28 bg-slate-800/70" />
            <Skeleton className="h-8 w-8 rounded-lg bg-slate-800/60" />
          </div>
          <Skeleton className="h-8 w-20 bg-slate-700/60" />
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-3.5 w-14 rounded-full bg-emerald-950/40" />
            <Skeleton className="h-3.5 w-32 bg-slate-800/40" />
          </div>
        </div>
      ))}
    </div>
  )
}

function DocumentGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg bg-emerald-950/50 border-emerald-800/30" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-36 bg-slate-700/70" />
                <Skeleton className="h-3 w-20 bg-slate-800/50" />
              </div>
            </div>
            <Skeleton className="h-6 w-16 rounded-full bg-slate-800/60" />
          </div>
          <Skeleton className="h-12 w-full bg-slate-800/40 rounded-lg" />
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
            <Skeleton className="h-3.5 w-24 bg-slate-800/50" />
            <Skeleton className="h-7 w-20 rounded-md bg-slate-800/60" />
          </div>
        </div>
      ))}
    </div>
  )
}

function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full rounded-xl bg-slate-900/70 border border-slate-800/80 overflow-hidden">
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/90">
        <Skeleton className="h-5 w-40 bg-slate-800/70" />
        <Skeleton className="h-8 w-28 rounded-lg bg-slate-800/60" />
      </div>
      <div className="divide-y divide-slate-800/60">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="h-8 w-8 rounded-lg bg-slate-800/60" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-48 bg-slate-700/60" />
                <Skeleton className="h-3 w-32 bg-slate-800/40" />
              </div>
            </div>
            {Array.from({ length: cols - 1 }).map((_, c) => (
              <Skeleton key={c} className="h-4 w-24 bg-slate-800/50 hidden sm:block" />
            ))}
            <Skeleton className="h-7 w-16 rounded-md bg-slate-800/60" />
          </div>
        ))}
      </div>
    </div>
  )
}

function GraphSkeleton() {
  return (
    <div className="w-full h-[500px] rounded-xl bg-slate-900/70 border border-slate-800/80 p-6 flex flex-col justify-between relative overflow-hidden">
      <div className="flex items-center justify-between z-10">
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-52 bg-slate-700/70" />
          <Skeleton className="h-3.5 w-72 bg-slate-800/50" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-lg bg-slate-800/60" />
          <Skeleton className="h-8 w-24 rounded-lg bg-emerald-950/40" />
        </div>
      </div>
      
      {/* Node Graph Mock Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40">
        <div className="relative w-80 h-80">
          <Skeleton className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40" />
          <Skeleton className="absolute top-8 left-12 h-10 w-10 rounded-full bg-indigo-500/20 border border-indigo-500/30" />
          <Skeleton className="absolute top-12 right-12 h-12 w-12 rounded-full bg-amber-500/20 border border-amber-500/30" />
          <Skeleton className="absolute bottom-12 left-16 h-12 w-12 rounded-full bg-blue-500/20 border border-blue-500/30" />
          <Skeleton className="absolute bottom-8 right-16 h-10 w-10 rounded-full bg-purple-500/20 border border-purple-500/30" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 z-10">
        <Skeleton className="h-4 w-40 bg-slate-800/50" />
        <Skeleton className="h-4 w-32 bg-slate-800/50" />
      </div>
    </div>
  )
}

function BoardroomSkeleton() {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-64 bg-slate-700/70" />
          <Skeleton className="h-8 w-32 rounded-lg bg-emerald-950/40" />
        </div>
        <Skeleton className="h-4 w-full bg-slate-800/50" />
        <Skeleton className="h-4 w-3/4 bg-slate-800/40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full bg-slate-800/70" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-28 bg-slate-700/70" />
                <Skeleton className="h-3 w-20 bg-slate-800/50" />
              </div>
            </div>
            <Skeleton className="h-16 w-full rounded-lg bg-slate-800/30" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-4 w-16 bg-slate-800/50" />
              <Skeleton className="h-5 w-20 rounded-full bg-emerald-950/40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TimelineSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 items-start">
          <Skeleton className="h-10 w-10 rounded-full bg-slate-800/70 shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-44 bg-slate-700/70" />
              <Skeleton className="h-3.5 w-24 bg-slate-800/50" />
            </div>
            <Skeleton className="h-3.5 w-full bg-slate-800/40" />
            <Skeleton className="h-3.5 w-2/3 bg-slate-800/30" />
          </div>
        </div>
      ))}
    </div>
  )
}

export {
  Skeleton,
  PageHeaderSkeleton,
  MetricCardSkeleton,
  DocumentGridSkeleton,
  TableSkeleton,
  GraphSkeleton,
  BoardroomSkeleton,
  TimelineSkeleton,
}
