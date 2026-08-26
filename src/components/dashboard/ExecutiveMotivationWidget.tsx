'use client';

import { useState, useEffect } from 'react';
import { Award, Flame, ShieldCheck, Zap, Scale, Lock, Users, Cpu, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExecutiveMotivationStatus, DepartmentKey, GovernanceActivityType, DepartmentMultiplierDetail } from '@/lib/gamification/motivation-engine';

interface ExecutiveMotivationWidgetProps {
  variant?: 'full' | 'compact' | 'boardroom';
  className?: string;
  onDepartmentSelect?: (dept: DepartmentKey) => void;
}

export function ExecutiveMotivationWidget({
  variant = 'full',
  className = '',
  onDepartmentSelect,
}: ExecutiveMotivationWidgetProps) {
  const [status, setStatus] = useState<ExecutiveMotivationStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    message: string;
    xp: number;
    badge?: string;
  } | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/gamification/status');
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          setStatus(json.data);
        }
      }
    } catch (e) {
      console.warn('Could not fetch gamification status, fallback active:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    // Listen for custom Causarix governance event triggers from boardroom or dashboard
    const handleGovernanceAction = (e: CustomEvent) => {
      if (e.detail?.actionType) {
        recordQuickAction(e.detail.actionType, e.detail.department, e.detail.description);
      }
    };

    window.addEventListener('causarix-governance-action' as any, handleGovernanceAction as any);
    return () => {
      window.removeEventListener('causarix-governance-action' as any, handleGovernanceAction as any);
    };
  }, []);

  const recordQuickAction = async (
    actionType: GovernanceActivityType = 'INVARIANT_RESOLVED',
    department?: DepartmentKey,
    description?: string
  ) => {
    if (isRecording) return;
    try {
      setIsRecording(true);
      const targetDept = department || status?.adaptiveBalancer.priorityDepartment || 'Legal';
      const res = await fetch('/api/gamification/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType,
          department: targetDept,
          description: description || `Executive oversight action recorded: ${actionType.replace(/_/g, ' ')} (${targetDept})`,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json?.data?.status) {
          setStatus(json.data.status);
          const earned = json.data.actionRecord?.totalXpEarned || 100;
          const newlyBadge = json.data.newlyUnlockedBadges?.[0]?.name;
          setNotification({
            message: `Action recorded: +${earned} XP earned with ${json.data.actionRecord?.multiplierApplied}x blindspot boost!`,
            xp: earned,
            badge: newlyBadge,
          });
          setTimeout(() => setNotification(null), 4500);
        }
      }
    } catch (err) {
      console.error('Error recording governance action:', err);
    } finally {
      setIsRecording(false);
    }
  };

  // Fallback defaults while loading or offline
  const level = status?.governanceLevel || {
    level: 4,
    title: 'Level 4: Chief Governance Architect',
    description: 'Institutional invariant alignment & zero-drift fiduciary oversight',
    currentXp: 1840,
    minXp: 1500,
    nextLevelXp: 3000,
    progressPct: 23,
  };

  const streak = status?.fiduciaryStreak || {
    currentStreakDays: 8,
    longestStreakDays: 14,
    lastActiveDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
    multiplierBonus: 1.25,
    isActiveToday: true,
  };

  const balancer = status?.adaptiveBalancer || {
    activeMultiplier: 2.8,
    priorityDepartment: 'Cyber Risk' as DepartmentKey,
    priorityFocusReason: 'Cyber Risk and Legal have received minimal audits. 2.8x incentive multiplier active to neutralize executive blind spots.',
    departmentMultipliers: {
      'Cyber Risk': { department: 'Cyber Risk', multiplier: 2.8, actionCount: 1, status: 'CRITICAL_BLINDSPOT', sharePercentage: 3 },
      Legal: { department: 'Legal', multiplier: 2.2, actionCount: 2, status: 'NEGLECTED', sharePercentage: 5 },
      Compliance: { department: 'Compliance', multiplier: 1.5, actionCount: 5, status: 'NEGLECTED', sharePercentage: 11 },
      Finance: { department: 'Finance', multiplier: 1.0, actionCount: 14, status: 'BALANCED', sharePercentage: 32 },
      Operations: { department: 'Operations', multiplier: 1.0, actionCount: 9, status: 'BALANCED', sharePercentage: 20 },
      Engineering: { department: 'Engineering', multiplier: 1.0, actionCount: 11, status: 'BALANCED', sharePercentage: 24 },
      Sales: { department: 'Sales', multiplier: 1.0, actionCount: 12, status: 'BALANCED', sharePercentage: 26 },
      HR: { department: 'HR', multiplier: 1.2, actionCount: 6, status: 'BALANCED', sharePercentage: 13 },
    } as any,
    giniInequalityIndex: 0.28,
  };

  const badges = status?.badges || [
    {
      id: 'MATH_DRIFT_INVARIANT_ZERO',
      name: '0.00% Math Drift Invariant',
      description: 'Zero drift cross-silo math invariant validation',
      icon: 'Scale',
      unlocked: true,
      rarity: 'LEGENDARY',
      criteria: 'Resolve invariants with 0.00% math drift',
    },
    {
      id: 'ZERO_BLINDSPOT_SENTINEL',
      name: 'Zero Blindspot Sentinel',
      description: 'Audited all 8 enterprise departments',
      icon: 'ShieldCheck',
      unlocked: false,
      rarity: 'EPIC',
      criteria: 'Audit all 8 corporate departments',
    },
    {
      id: 'BOARDROOM_QUORUM_VIRTUOSO',
      name: 'Boardroom Quorum Virtuoso',
      description: '5+ Multi-Agent Boardroom Quorum deliberations',
      icon: 'Users',
      unlocked: true,
      rarity: 'RARE',
      criteria: 'Convene 5 boardroom meetings',
    },
    {
      id: 'IMMUTABLE_LEDGER_GUARDIAN',
      name: 'Immutable DGCL Ledger Guardian',
      description: 'Chained 10+ DGCL audit ledger entries',
      icon: 'Lock',
      unlocked: true,
      rarity: 'EPIC',
      criteria: 'Log 10 audit ledger entries',
    },
  ];

  // Helper for badge icons
  const renderBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Scale':
        return <Scale className="w-3.5 h-3.5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'Users':
        return <Users className="w-3.5 h-3.5" />;
      case 'Lock':
        return <Lock className="w-3.5 h-3.5" />;
      case 'Cpu':
        return <Cpu className="w-3.5 h-3.5" />;
      default:
        return <Award className="w-3.5 h-3.5" />;
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // VARIANT: BOARDROOM HUD (Ultra-sleek top telemetry bar)
  // ─────────────────────────────────────────────────────────────────────────────
  if (variant === 'boardroom') {
    return (
      <div className={cn('relative rounded-xl border border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md p-3.5 text-zinc-100 shadow-2xl transition-all', className)}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Level & XP */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Award className="w-5 h-5" />
              <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-black">
                {level.level}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wide text-zinc-100">
                  {level.title}
                </span>
                <span className="rounded bg-zinc-800/90 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
                  {level.currentXp.toLocaleString()} XP
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-1.5 w-28 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${level.progressPct}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-zinc-400">
                  {level.progressPct}% to L{level.level + 1}
                </span>
              </div>
            </div>
          </div>

          {/* Fiduciary Defense Streak */}
          <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-1.5">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-amber-300 font-mono">
                  {streak.currentStreakDays}d Streak
                </span>
                <span className="rounded bg-amber-500/20 px-1 text-[9px] font-bold text-amber-300 font-mono">
                  +{Math.round((streak.multiplierBonus - 1) * 100)}% XP
                </span>
              </div>
              <span className="text-[10px] text-zinc-400">Fiduciary Defense</span>
            </div>
          </div>

          {/* GAME Adaptive Incentive Balancer */}
          <div className="flex items-center gap-2.5 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5">
            <Zap className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-cyan-300 font-mono">
                  {balancer.activeMultiplier.toFixed(1)}x Priority Multiplier
                </span>
                <span className="rounded bg-cyan-500/20 px-1.5 py-0.2 text-[9px] font-mono text-cyan-200">
                  {balancer.priorityDepartment}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400">Blindspot Incentive</span>
            </div>
          </div>

          {/* Math Drift Invariant Pill */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-2.5 py-1.5">
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
            <div className="text-right">
              <div className="text-[10px] font-mono font-bold text-emerald-300">0.00% Drift</div>
              <div className="text-[9px] text-zinc-500">DGCL Invariant</div>
            </div>
          </div>
        </div>

        {/* Floating Notification */}
        {notification && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-emerald-500/50 bg-emerald-950/90 px-3 py-1 text-xs text-emerald-200 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{notification.message}</span>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // VARIANT: FULL EXECUTIVE TELEMETRY WIDGET (For Executive Dashboard)
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900/90 to-zinc-950 p-5 sm:p-6 text-zinc-100 shadow-2xl transition-all',
        className
      )}
    >
      {/* Background Subtle Radial Glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-inner">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-semibold tracking-tight text-zinc-100">
                Executive Governance & Motivation Engine
              </h3>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
                GAME Protocol v2.0
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Adaptive behavioral scoring framework & cross-department blindspot mitigation
            </p>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchStatus()}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
            title="Refresh Motivation Telemetry"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} />
            <span className="hidden sm:inline">Sync</span>
          </button>

          <button
            onClick={() => recordQuickAction('INVARIANT_RESOLVED')}
            disabled={isRecording}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition-all hover:bg-emerald-500/20 active:scale-95 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Audit Blindspot</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 3 Pillars (Governance Level, Fiduciary Streak, Adaptive Balancer) */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* PILLAR 1: Governance Level */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 transition-all hover:border-zinc-700/80">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-mono uppercase tracking-wider text-[11px] text-zinc-500">
              Governance Level
            </span>
            <span className="font-mono text-emerald-400 font-semibold">
              {level.currentXp.toLocaleString()} XP
            </span>
          </div>

          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-zinc-100">
              {level.title}
            </span>
          </div>

          <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
            {level.description}
          </p>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1.5">
              <span>Progress to Level {level.level + 1}</span>
              <span className="text-emerald-400 font-bold">{level.progressPct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800/90">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-700"
                style={{ width: `${level.progressPct}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] font-mono text-zinc-500">
              <span>{level.minXp} XP</span>
              <span>{level.nextLevelXp} XP</span>
            </div>
          </div>
        </div>

        {/* PILLAR 2: Fiduciary Defense Streak */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.03] p-4 transition-all hover:border-amber-500/30">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono uppercase tracking-wider text-[11px] text-amber-400/80">
              Fiduciary Defense Streak
            </span>
            <span className="flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-400">
              <Flame className="w-3 h-3 animate-pulse" />
              {streak.status}
            </span>
          </div>

          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
              {streak.currentStreakDays}
            </span>
            <span className="text-sm text-zinc-400">Consecutive Days</span>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-mono font-bold text-amber-300">
              +{Math.round((streak.multiplierBonus - 1) * 100)}% Fiduciary Bonus
            </span>
            <span className="text-[11px] text-zinc-400">
              Record: {streak.longestStreakDays}d
            </span>
          </div>

          <p className="mt-3 text-xs text-zinc-400">
            Daily active risk audit & cross-silo validation preserves fiduciary defense immunity and boosts all XP rewards.
          </p>
        </div>

        {/* PILLAR 3: GAME Adaptive Incentive Balancer */}
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/[0.03] p-4 transition-all hover:border-cyan-500/30">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono uppercase tracking-wider text-[11px] text-cyan-400/80">
              GAME Adaptive Balancer
            </span>
            <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-cyan-300">
              {balancer.activeMultiplier.toFixed(1)}x ACTIVE
            </span>
          </div>

          <div className="mt-2.5">
            <div className="text-xs font-mono text-zinc-400">Department Priority Focus:</div>
            <div className="text-base sm:text-lg font-bold text-cyan-300">
              {balancer.priorityDepartment}
            </div>
          </div>

          <p className="mt-2 text-xs text-zinc-400 leading-relaxed line-clamp-3">
            {balancer.priorityFocusReason}
          </p>

          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-zinc-800/80 pt-2">
            <span>Participation Gini Index:</span>
            <span className="text-cyan-300 font-bold">{balancer.giniInequalityIndex}</span>
          </div>
        </div>
      </div>

      {/* Department Multiplier Matrix (The GAME Principle Visualization) */}
      <div className="mt-5 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-zinc-400" />
            <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              Departmental Review Multipliers & Blindspot Radar
            </span>
          </div>
          <span className="text-[11px] text-zinc-400">
            Click any department to focus review
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
          {(Object.values(balancer.departmentMultipliers) as DepartmentMultiplierDetail[]).map((d) => {
            const isPriority = d.department === balancer.priorityDepartment;
            const isNeglected = d.status === 'CRITICAL_BLINDSPOT' || d.status === 'NEGLECTED';

            return (
              <button
                key={d.department}
                onClick={() => onDepartmentSelect?.(d.department)}
                className={cn(
                  'flex flex-col items-start justify-between rounded-lg p-2.5 text-left transition-all',
                  isPriority
                    ? 'border border-cyan-500/40 bg-cyan-500/10 shadow-lg'
                    : isNeglected
                    ? 'border border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50'
                    : 'border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                )}
              >
                <div className="w-full flex items-center justify-between">
                  <span className="text-[11px] font-medium text-zinc-200 truncate">
                    {d.department}
                  </span>
                  {isPriority && (
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </div>

                <div className="mt-2 flex w-full items-baseline justify-between">
                  <span
                    className={cn(
                      'text-xs font-bold font-mono',
                      d.multiplier > 1.0 ? 'text-cyan-300' : 'text-zinc-400'
                    )}
                  >
                    {d.multiplier.toFixed(1)}x
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {d.actionCount} reviews
                  </span>
                </div>

                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      isPriority ? 'bg-cyan-400' : isNeglected ? 'bg-amber-400' : 'bg-emerald-500'
                    )}
                    style={{ width: `${Math.min(100, d.sharePercentage * 2.5)}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Badges & Invariant Milestones */}
      <div className="mt-5 border-t border-zinc-800/80 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              Governance Badges & Invariant Defense Credentials
            </span>
          </div>
          <span className="text-xs font-mono text-emerald-400">
            {badges.filter((b) => b.unlocked).length}/{badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {badges.map((b) => (
            <div
              key={b.id}
              className={cn(
                'group relative flex items-center gap-2.5 rounded-xl p-2.5 transition-all',
                b.unlocked
                  ? 'border border-emerald-500/30 bg-emerald-500/[0.04] text-zinc-100'
                  : 'border border-zinc-800/60 bg-zinc-900/20 text-zinc-500 opacity-60'
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border',
                  b.unlocked
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-sm'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-600'
                )}
              >
                {renderBadgeIcon(b.icon)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold truncate">{b.name}</span>
                  {b.unlocked && (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-zinc-400 truncate" title={b.description}>
                  {b.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Notification Toast */}
      {notification && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-emerald-500/50 bg-zinc-950/95 px-4 py-2 text-xs font-medium text-emerald-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 z-50">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
}
