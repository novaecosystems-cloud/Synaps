'use client';

import React, { useState } from 'react';
import { 
  Compass, Sparkles, Sliders, ShieldCheck, CheckCircle2, 
  Lock, Unlock, AlertTriangle, ArrowUpRight, Plus, Download, 
  Layers, Filter, Scale, ExternalLink, Flame, Check, RefreshCw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CorporateTactic, TacticDomain, TacticStatus } from '@/lib/corporate-tactics';
import { AlignTacticModal } from '@/components/dashboard/decisions/AlignTacticModal';
import { AddTacticModal } from '@/components/dashboard/decisions/AddTacticModal';
import { useToast } from '@/hooks/use-toast';

interface CorporateTacticsRadarProps {
  tactics: CorporateTactic[];
  onTacticUpdated: (updated: CorporateTactic) => void;
  onTacticAdded: (newTactic: CorporateTactic) => void;
  onSelectPrecedent?: (decisionId: string) => void;
}

const DOMAIN_COLORS: Record<TacticDomain, { badge: string; border: string; glow: string; text: string; bg: string }> = {
  LEGAL: { badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30', border: 'border-purple-500/30', glow: 'shadow-purple-500/10', text: 'text-purple-400', bg: 'bg-purple-950/20' },
  FINANCE: { badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/10', text: 'text-emerald-400', bg: 'bg-emerald-950/20' },
  STRATEGY: { badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30', border: 'border-cyan-500/30', glow: 'shadow-cyan-500/10', text: 'text-cyan-400', bg: 'bg-cyan-950/20' },
  OPERATIONS: { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30', border: 'border-amber-500/30', glow: 'shadow-amber-500/10', text: 'text-amber-400', bg: 'bg-amber-950/20' },
  TECH: { badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30', border: 'border-blue-500/30', glow: 'shadow-blue-500/10', text: 'text-blue-400', bg: 'bg-blue-950/20' },
  GOVERNANCE: { badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', border: 'border-indigo-500/30', glow: 'shadow-indigo-500/10', text: 'text-indigo-400', bg: 'bg-indigo-950/20' }
};

export function CorporateTacticsRadar({
  tactics,
  onTacticUpdated,
  onTacticAdded,
  onSelectPrecedent
}: CorporateTacticsRadarProps) {
  const { toast } = useToast();
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [editingTactic, setEditingTactic] = useState<CorporateTactic | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredTactics = tactics.filter(t => {
    if (selectedDomain === 'ALL') return true;
    return t.domain === selectedDomain;
  });

  // Calculate domain metrics for radar panel
  const domainStats = (['LEGAL', 'FINANCE', 'STRATEGY', 'OPERATIONS', 'TECH', 'GOVERNANCE'] as TacticDomain[]).map(d => {
    const matching = tactics.filter(t => t.domain === d);
    const count = matching.length;
    const avgConfidence = count > 0 
      ? Math.round(matching.reduce((acc, cur) => acc + cur.confidenceScore, 0) / count)
      : 85;
    const totalDecisions = matching.reduce((acc, cur) => acc + cur.supportingDecisionsCount, 0);
    return { domain: d, count, avgConfidence, totalDecisions };
  });

  const exportPlaybook = () => {
    const playbookData = {
      title: "Causarix Corporate Tactics & Leadership Playbook",
      exportedAt: new Date().toISOString(),
      statutoryFiduciaryAnchor: "Delaware DGCL § 141(e) Compliant",
      tacticsCount: tactics.length,
      tactics: tactics.map(t => ({
        id: t.id,
        title: t.title,
        domain: t.domain,
        rule: t.rule,
        triggerCondition: t.triggerCondition,
        policyDirective: t.policyDirective,
        confidenceScore: `${t.confidenceScore}%`,
        supportingDecisions: t.supportingDecisionsCount,
        status: t.status,
        lastAlignedAt: t.lastAlignedAt,
        alignedBy: t.alignedBy,
        merkleProofHash: t.merkleProofHash
      }))
    };

    const blob = new Blob([JSON.stringify(playbookData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Corporate-Tactics-Playbook-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Playbook Exported",
      description: "Downloaded synthesized Corporate Tactics Playbook with SHA-256 Merkle proofs."
    });
  };

  return (
    <div className="space-y-6">
      
      {/* ── HEADER BANNER & RADAR INSIGHTS ────────────────────────── */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border border-cyan-500/30 text-white rounded-3xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">Corporate Tactics & Leadership Playbook Radar</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                  {tactics.length} Active Rules
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Dynamic organizational rules synthesized from accepted, rejected, and modified decisions. Guides future boardroom & simulation agents.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={exportPlaybook}
              variant="outline"
              className="rounded-2xl border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider gap-1.5 py-2 px-3.5"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" /> Export Playbook (JSON)
            </Button>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-extrabold text-xs uppercase tracking-wider gap-1.5 py-2 px-4 shadow-lg"
            >
              <Plus className="w-4 h-4 text-black" /> Add Corporate Tactic
            </Button>
          </div>
        </div>

        {/* 6-Domain Radar Health Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {domainStats.map(stat => (
            <div 
              key={stat.domain}
              onClick={() => setSelectedDomain(selectedDomain === stat.domain ? 'ALL' : stat.domain)}
              className={cn(
                "p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5",
                selectedDomain === stat.domain
                  ? "bg-cyan-500/20 border-cyan-400 shadow-md ring-1 ring-cyan-400/40"
                  : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
              )}
            >
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>{stat.domain}</span>
                <span className="font-mono text-cyan-400 font-bold">{stat.avgConfidence}%</span>
              </div>
              <div className="text-lg font-black text-white">
                {stat.count} <span className="text-xs font-normal text-slate-400">Rules</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${stat.avgConfidence}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 block pt-0.5">
                {stat.totalDecisions} Supporting Decisions
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FILTER PILLS BAR ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar w-full sm:w-auto pb-1">
          {['ALL', 'LEGAL', 'FINANCE', 'STRATEGY', 'OPERATIONS', 'TECH', 'GOVERNANCE'].map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={cn(
                "px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border",
                selectedDomain === dom
                  ? "bg-cyan-500 text-black border-cyan-500 shadow-sm"
                  : "bg-base-100 border-base-300 text-base-content/70 hover:text-base-content hover:border-base-content/30"
              )}
            >
              {dom === 'ALL' ? 'All Tactics' : dom}
            </button>
          ))}
        </div>

        <span className="text-xs text-base-content/60 font-mono">
          Showing {filteredTactics.length} of {tactics.length} tactics
        </span>
      </div>

      {/* ── TACTICS CARDS GRID ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTactics.map((tactic) => {
          const colors = DOMAIN_COLORS[tactic.domain] || DOMAIN_COLORS.STRATEGY;

          return (
            <div
              key={tactic.id}
              className={cn(
                "p-6 rounded-3xl border bg-base-100 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md space-y-4 relative overflow-hidden",
                colors.border
              )}
            >
              {/* Top Row: Domain Badge & Status */}
              <div className="flex justify-between items-start gap-2">
                <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border", colors.badge)}>
                  {tactic.domain}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border",
                    tactic.status === 'LOCKED'
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                      : tactic.status === 'ACTIVE'
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                      : "bg-slate-500/10 text-slate-400 border-slate-500/30"
                  )}>
                    {tactic.status === 'LOCKED' ? '🔒 Locked' : tactic.status === 'ACTIVE' ? '⚡ Active' : '⏳ Review'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-500 border border-cyan-500/30">
                    {tactic.confidenceScore}% Conf.
                  </span>
                </div>
              </div>

              {/* Title & Core Rule */}
              <div className="space-y-2">
                <h3 className="font-bold text-base text-base-content group-hover:text-cyan-500 transition-colors leading-snug">
                  {tactic.title}
                </h3>
                
                <p className="text-xs text-base-content/80 font-medium leading-relaxed bg-base-200/80 p-3 rounded-2xl border border-base-300/60 font-sans">
                  &ldquo;{tactic.rule}&rdquo;
                </p>
              </div>

              {/* Trigger & Directive Box */}
              <div className="space-y-2 text-[11px] p-3 rounded-2xl bg-base-200/40 border border-base-300/40">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 block">Trigger Condition</span>
                  <span className="text-base-content/80 font-mono text-[11px]">{tactic.triggerCondition}</span>
                </div>
                <div className="pt-1.5 border-t border-base-300/40">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 block">Policy Directive</span>
                  <span className="text-base-content/90 font-medium">{tactic.policyDirective}</span>
                </div>
              </div>

              {/* Precedent Decision Pill References */}
              {tactic.precedents?.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 block">
                    Precedent Decisions ({tactic.supportingDecisionsCount})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {tactic.precedents.slice(0, 3).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => onSelectPrecedent && onSelectPrecedent(p.id)}
                        className={cn(
                          "px-2 py-0.5 rounded-lg text-[10px] font-medium border text-left truncate max-w-[170px]",
                          p.action === 'ACCEPTED'
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:border-emerald-500"
                            : p.action === 'REJECTED'
                            ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 hover:border-red-500"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:border-amber-500"
                        )}
                        title={p.title}
                      >
                        {p.action === 'ACCEPTED' ? '✓ ' : p.action === 'REJECTED' ? '✕ ' : '✏️ '}
                        {p.title}
                      </button>
                    ))}
                    {tactic.precedents.length > 3 && (
                      <span className="text-[10px] text-base-content/50 self-center font-mono pl-1">
                        +{tactic.precedents.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Bottom Alignment Control Bar */}
              <div className="pt-3 border-t border-base-300 flex items-center justify-between">
                <span className="text-[10px] text-base-content/50 font-mono">
                  Aligned by {tactic.alignedBy.split('&')[0]}
                </span>

                <Button
                  onClick={() => setEditingTactic(tactic)}
                  variant="outline"
                  className="rounded-2xl border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-500 font-bold text-xs uppercase tracking-wider py-1.5 px-3 gap-1.5 h-auto"
                >
                  <Sliders className="w-3.5 h-3.5" /> Align Tactic
                </Button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Align Tactic Modal */}
      {editingTactic && (
        <AlignTacticModal
          tactic={editingTactic}
          onClose={() => setEditingTactic(null)}
          onSuccess={(updated) => {
            onTacticUpdated(updated);
            setEditingTactic(null);
          }}
        />
      )}

      {/* Add Custom Tactic Modal */}
      <AddTacticModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(newTactic) => {
          onTacticAdded(newTactic);
          setIsAddModalOpen(false);
        }}
      />

    </div>
  );
}
