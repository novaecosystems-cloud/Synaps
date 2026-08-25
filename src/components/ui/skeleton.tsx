import * as React from "react"
import { cn } from "@/lib/utils"
import { Sparkles, Building2, Activity, Layers, Sliders, DollarSign, Users, ShieldAlert, Cpu } from "lucide-react"

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
        "relative overflow-hidden rounded-md bg-muted/60 dark:bg-slate-800/60 border border-border/40 dark:border-slate-700/30",
        shimmer
          ? "after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_1.8s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/15 dark:after:via-white/10 after:to-transparent"
          : "animate-pulse",
        className
      )}
      {...props}
    />
  )
}

function PageHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-border/40 dark:border-slate-800/60">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 bg-slate-700/60" />
        <Skeleton className="h-4 w-96 bg-slate-800/50" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-32 rounded-2xl" />
        <Skeleton className="h-10 w-36 rounded-2xl bg-cyan-950/40 border-cyan-800/30" />
      </div>
    </div>
  )
}

function MetricCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${count} gap-4 mb-8`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-5 rounded-3xl bg-card border border-border/50 dark:bg-slate-900/60 dark:border-slate-800/80 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28 bg-slate-800/70" />
            <Skeleton className="h-8 w-8 rounded-xl bg-slate-800/60" />
          </div>
          <Skeleton className="h-8 w-20 bg-slate-700/60" />
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-3.5 w-14 rounded-full bg-cyan-950/40" />
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
        <div key={i} className="p-5 rounded-3xl bg-card border border-border/50 dark:bg-slate-900/70 dark:border-slate-800/80 space-y-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-2xl bg-cyan-950/50 border-cyan-800/30" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-36 bg-slate-700/70" />
                <Skeleton className="h-3 w-20 bg-slate-800/50" />
              </div>
            </div>
            <Skeleton className="h-6 w-16 rounded-full bg-slate-800/60" />
          </div>
          <Skeleton className="h-12 w-full bg-slate-800/40 rounded-xl" />
          <div className="flex items-center justify-between pt-2 border-t border-border/40 dark:border-slate-800/50">
            <Skeleton className="h-3.5 w-24 bg-slate-800/50" />
            <Skeleton className="h-7 w-20 rounded-xl bg-slate-800/60" />
          </div>
        </div>
      ))}
    </div>
  )
}

function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full rounded-3xl bg-card border border-border/50 dark:bg-slate-900/70 dark:border-slate-800/80 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-border/40 dark:border-slate-800/80 flex items-center justify-between bg-muted/40 dark:bg-slate-900/90">
        <Skeleton className="h-5 w-40 bg-slate-800/70" />
        <Skeleton className="h-8 w-28 rounded-xl bg-slate-800/60" />
      </div>
      <div className="divide-y divide-border/40 dark:divide-slate-800/60">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="h-8 w-8 rounded-xl bg-slate-800/60" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-48 bg-slate-700/60" />
                <Skeleton className="h-3 w-32 bg-slate-800/40" />
              </div>
            </div>
            {Array.from({ length: cols - 1 }).map((_, c) => (
              <Skeleton key={c} className="h-4 w-24 bg-slate-800/50 hidden sm:block" />
            ))}
            <Skeleton className="h-7 w-16 rounded-xl bg-slate-800/60" />
          </div>
        ))}
      </div>
    </div>
  )
}

function GraphSkeleton() {
  return (
    <div className="w-full h-[500px] rounded-3xl bg-card border border-border/50 dark:bg-slate-900/70 dark:border-slate-800/80 p-6 flex flex-col justify-between relative overflow-hidden shadow-sm">
      <div className="flex items-center justify-between z-10">
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-52 bg-slate-700/70" />
          <Skeleton className="h-3.5 w-72 bg-slate-800/50" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-xl bg-slate-800/60" />
          <Skeleton className="h-8 w-24 rounded-xl bg-cyan-950/40" />
        </div>
      </div>
      
      {/* Node Graph Mock Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40">
        <div className="relative w-80 h-80">
          <Skeleton className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-cyan-500/20 border-2 border-cyan-500/40" />
          <Skeleton className="absolute top-8 left-12 h-10 w-10 rounded-full bg-indigo-500/20 border border-indigo-500/30" />
          <Skeleton className="absolute top-12 right-12 h-12 w-12 rounded-full bg-amber-500/20 border border-amber-500/30" />
          <Skeleton className="absolute bottom-12 left-16 h-12 w-12 rounded-full bg-blue-500/20 border border-blue-500/30" />
          <Skeleton className="absolute bottom-8 right-16 h-10 w-10 rounded-full bg-purple-500/20 border border-purple-500/30" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/40 dark:border-slate-800/60 z-10">
        <Skeleton className="h-4 w-40 bg-slate-800/50" />
        <Skeleton className="h-4 w-32 bg-slate-800/50" />
      </div>
    </div>
  )
}

function BoardroomSkeleton() {
  return (
    <div className="w-full space-y-8 font-sans pb-16">
      {/* Active Deliberation Status Indicator */}
      <div className="flex items-center justify-between p-4 rounded-3xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-400">
        <div className="flex items-center gap-3">
          <div className="relative w-7 h-7 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/40 animate-ping"></div>
            <Building2 className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <span className="text-xs font-bold font-mono uppercase tracking-wider">
            10-Agent Boardroom Quorum Deliberating Active Evidence Nodes...
          </span>
        </div>
        <Skeleton className="h-5 w-24 rounded-full bg-cyan-500/20" />
      </div>

      {/* Synthesis Hero Banner Skeleton */}
      <div className="p-8 bg-gradient-to-br from-purple-950/60 via-slate-900/80 to-indigo-950/60 border border-cyan-500/30 rounded-3xl shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-64 rounded-full bg-cyan-500/20" />
            <Skeleton className="h-7 w-4/5 rounded-xl bg-slate-700/80" />
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center shrink-0 space-y-1 min-w-[120px]">
            <Skeleton className="h-7 w-16 mx-auto rounded-lg bg-purple-500/30" />
            <Skeleton className="h-3 w-20 mx-auto rounded-md bg-white/20" />
          </div>
        </div>

        {/* Final Board Recommendation Skeleton */}
        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2.5">
          <Skeleton className="h-4 w-48 rounded-md bg-purple-400/30" />
          <Skeleton className="h-4 w-full rounded-md bg-slate-700/60" />
          <Skeleton className="h-4 w-3/4 rounded-md bg-slate-700/40" />
        </div>

        {/* Consensus vs Disagreements 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-3">
            <Skeleton className="h-4 w-40 rounded-md bg-emerald-500/30" />
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-full rounded-md bg-emerald-950/40" />
              <Skeleton className="h-3.5 w-5/6 rounded-md bg-emerald-950/40" />
              <Skeleton className="h-3.5 w-4/5 rounded-md bg-emerald-950/30" />
            </div>
          </div>

          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-3">
            <Skeleton className="h-4 w-48 rounded-md bg-amber-500/30" />
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-full rounded-md bg-amber-950/40" />
              <Skeleton className="h-3.5 w-4/5 rounded-md bg-amber-950/40" />
              <Skeleton className="h-3.5 w-3/4 rounded-md bg-amber-950/30" />
            </div>
          </div>
        </div>

        {/* Bottom Button Bar Skeleton */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Skeleton className="h-4 w-72 rounded-md bg-slate-700/40" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-36 rounded-2xl bg-white/10" />
            <Skeleton className="h-10 w-52 rounded-2xl bg-cyan-500/30" />
          </div>
        </div>
      </div>

      {/* 10 Executive Agent Perspective Cards (3-Column Grid) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-72 rounded-xl bg-slate-700/70" />
          <Skeleton className="h-4 w-48 rounded-md bg-slate-800/50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="p-6 bg-card border border-border/50 dark:bg-slate-900/70 dark:border-slate-800/80 rounded-3xl shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-2xl bg-slate-800/80 shrink-0" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-28 bg-slate-700/80" />
                    <Skeleton className="h-3 w-20 bg-slate-800/50" />
                  </div>
                </div>
                <Skeleton className="h-5 w-16 rounded-full bg-cyan-500/20" />
              </div>

              <div className="p-3 bg-muted/40 dark:bg-slate-800/40 rounded-2xl border border-border/30 dark:border-slate-700/30 space-y-2">
                <Skeleton className="h-3.5 w-full bg-slate-700/50" />
                <Skeleton className="h-3.5 w-4/5 bg-slate-700/40" />
                <Skeleton className="h-3.5 w-2/3 bg-slate-700/30" />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/40 dark:border-slate-800/60">
                <Skeleton className="h-3.5 w-24 bg-slate-800/50" />
                <Skeleton className="h-3.5 w-28 bg-cyan-500/20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SimulationStudioSkeleton() {
  return (
    <div className="w-full space-y-8 font-sans pb-16">
      {/* Active Simulation Status Indicator */}
      <div className="flex items-center justify-between p-4 rounded-3xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-400">
        <div className="flex items-center gap-3">
          <div className="relative w-7 h-7 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/40 animate-ping"></div>
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <span className="text-xs font-bold font-mono uppercase tracking-wider">
            Simulating 10,000 Monte Carlo Trajectories & Departmental Cascades...
          </span>
        </div>
        <Skeleton className="h-5 w-28 rounded-full bg-cyan-500/20" />
      </div>

      {/* 3 Scenario Switcher Tabs Skeleton */}
      <div className="grid grid-cols-3 gap-3">
        {['Expected Impact', 'Optimistic Upside', 'Worst-Case Downside'].map((label, i) => (
          <div
            key={i}
            className="p-4 rounded-3xl bg-card border border-border/50 dark:bg-slate-900/60 dark:border-slate-800/80 space-y-2"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="h-3.5 w-24 rounded-md bg-slate-700/70" />
              <Skeleton className="h-4 w-16 rounded-full bg-slate-800/60" />
            </div>
            <Skeleton className="h-6 w-32 rounded-lg bg-slate-700/80" />
          </div>
        ))}
      </div>

      {/* Hero Scenario Detail Card Skeleton */}
      <div className="p-8 bg-gradient-to-br from-slate-900/90 via-indigo-950/80 to-slate-900/90 border border-cyan-500/30 text-white rounded-3xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-48 rounded-full bg-cyan-500/20" />
            <Skeleton className="h-7 w-3/4 rounded-xl bg-slate-700/80" />
            <Skeleton className="h-3.5 w-1/2 rounded-md bg-slate-800/50" />
          </div>
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-center shrink-0 space-y-1 min-w-[130px]">
            <Skeleton className="h-7 w-20 mx-auto rounded-lg bg-emerald-500/30" />
            <Skeleton className="h-3 w-24 mx-auto rounded-md bg-white/20" />
          </div>
        </div>

        {/* Narrative Description Placeholder */}
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
          <Skeleton className="h-4 w-full bg-slate-700/60" />
          <Skeleton className="h-4 w-5/6 bg-slate-700/50" />
        </div>

        {/* 6 Department Impact Grid Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-60 rounded-md bg-cyan-400/30" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded-full bg-cyan-500/30" />
                    <Skeleton className="h-3.5 w-20 bg-slate-600/70" />
                  </div>
                  <Skeleton className="h-4 w-12 rounded bg-emerald-500/20" />
                </div>
                <Skeleton className="h-3 w-full bg-slate-700/40" />
              </div>
            ))}
          </div>
        </div>

        {/* Dispatch Action Bar */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Skeleton className="h-4 w-72 rounded-md bg-slate-700/40" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-36 rounded-2xl bg-white/10" />
            <Skeleton className="h-10 w-56 rounded-2xl bg-cyan-500/30" />
          </div>
        </div>
      </div>

      {/* 10,000 Monte Carlo Math Sandbox Skeleton */}
      <div className="p-8 bg-black/60 border border-cyan-500/30 rounded-3xl shadow-xl space-y-6">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-64 rounded-full bg-cyan-500/20" />
            <Skeleton className="h-6 w-96 rounded-xl bg-slate-700/70" />
          </div>
          <Skeleton className="h-4 w-32 rounded-md bg-slate-800/50" />
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center space-y-2">
              <Skeleton className="h-3 w-20 mx-auto bg-slate-700/60" />
              <Skeleton className="h-7 w-24 mx-auto bg-cyan-500/30" />
              <Skeleton className="h-2.5 w-24 mx-auto bg-slate-800/40" />
            </div>
          ))}
        </div>

        {/* Simulated Histogram Bins */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-64 bg-cyan-400/30" />
          <div className="grid grid-cols-15 gap-1 items-end h-28 pt-4 pb-2 border-b border-white/10" style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}>
            {[15, 28, 45, 62, 80, 95, 100, 90, 75, 58, 40, 25, 18, 10, 5].map((h, i) => (
              <div key={i} className="flex flex-col items-center h-full justify-end">
                <Skeleton
                  className="w-full rounded-t-sm bg-cyan-500/40"
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TimelineSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 rounded-3xl bg-card border border-border/50 dark:bg-slate-900/60 dark:border-slate-800/80 items-start shadow-sm">
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
  SimulationStudioSkeleton,
  TimelineSkeleton,
}
