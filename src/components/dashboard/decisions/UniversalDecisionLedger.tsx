'use client';

import { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2, Flame, Edit3, Clock, Lock, ChevronRight, X, Scale, Sparkles, FileText, Table as TableIcon, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DecisionLedgerItem, DecisionAction } from '@/lib/corporate-tactics';
import { MerkleProofModal } from '@/components/dashboard/decisions/MerkleProofModal';

interface UniversalDecisionLedgerProps {
  decisions: DecisionLedgerItem[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedActionFilter: string;
  onActionFilterChange: (action: string) => void;
  onInspectDecision?: (decision: DecisionLedgerItem) => void;
}

export function UniversalDecisionLedger({
  decisions,
  searchQuery,
  onSearchChange,
  selectedActionFilter,
  onActionFilterChange,
  onInspectDecision
}: UniversalDecisionLedgerProps) {
  const [selectedMerkleDecision, setSelectedMerkleDecision] = useState<DecisionLedgerItem | null>(null);
  const [activeInspectorDecision, setActiveInspectorDecision] = useState<DecisionLedgerItem | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Filter decisions based on search query and action filter
  const filteredDecisions = decisions.filter(d => {
    // Action filter
    if (selectedActionFilter !== 'ALL' && d.action !== selectedActionFilter) {
      return false;
    }

    // Keyword search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = d.title.toLowerCase().includes(q);
      const matchProblem = d.problem.toLowerCase().includes(q);
      const matchRec = d.recommendation.toLowerCase().includes(q);
      const matchReason = (d.overrideReason || '').toLowerCase().includes(q);
      const matchTags = (d.quickTags || []).some(t => t.toLowerCase().includes(q));
      const matchActor = (d.actor || '').toLowerCase().includes(q);
      const matchDomain = (d.domain || '').toLowerCase().includes(q);
      if (!matchTitle && !matchProblem && !matchRec && !matchReason && !matchTags && !matchActor && !matchDomain) {
        return false;
      }
    }

    return true;
  });

  const getActionBadge = (action: DecisionAction) => {
    switch (action) {
      case 'ACCEPTED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Accepted (✅)
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/30 flex items-center gap-1">
            <Flame className="w-3 h-3" /> Rejected (❌)
          </span>
        );
      case 'MODIFIED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center gap-1">
            <Edit3 className="w-3 h-3" /> Modified (✏️)
          </span>
        );
      case 'IGNORED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Ignored (⏳)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ── FILTER PILLS & SEARCH CONTROLS ───────────────────────────── */}
      <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
        
        {/* Search Bar Row */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-base-content/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search past boardroom deliberations, dilemmas, recommendations, override rationales..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-base-200 border border-base-300 text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-base-content/40 hover:text-base-content"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* View Mode Toggle (Cards vs Table) */}
          <div className="flex items-center gap-1 p-1 bg-base-200 rounded-2xl border border-base-300 shrink-0">
            <button
              onClick={() => setViewMode('cards')}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                viewMode === 'cards' ? "bg-base-100 text-base-content shadow-sm" : "text-base-content/60 hover:text-base-content"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                viewMode === 'table' ? "bg-base-100 text-base-content shadow-sm" : "text-base-content/60 hover:text-base-content"
              )}
            >
              <TableIcon className="w-3.5 h-3.5" /> Cryptographic Table
            </button>
          </div>
        </div>

        {/* 5 Filter Pills Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-base-200">
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
            {[
              { id: 'ALL', label: 'All Decisions' },
              { id: 'ACCEPTED', label: 'Accepted (✅)' },
              { id: 'REJECTED', label: 'Rejected (❌)' },
              { id: 'MODIFIED', label: 'Modified (✏️)' },
              { id: 'IGNORED', label: 'Ignored (⏳)' }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => onActionFilterChange(filter.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border",
                  selectedActionFilter === filter.id
                    ? filter.id === 'ACCEPTED'
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/60 shadow-sm"
                      : filter.id === 'REJECTED'
                      ? "bg-red-500/20 text-red-400 border-red-500/60 shadow-sm"
                      : filter.id === 'MODIFIED'
                      ? "bg-amber-500/20 text-amber-400 border-amber-500/60 shadow-sm"
                      : filter.id === 'IGNORED'
                      ? "bg-slate-500/20 text-slate-300 border-slate-500/60 shadow-sm"
                      : "bg-cyan-500 text-black border-cyan-500 shadow-sm"
                    : "bg-base-100 border-base-300 text-base-content/70 hover:text-base-content hover:border-base-content/30"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-base-content/60 font-mono">
            <span className="flex items-center gap-1.5 text-cyan-500 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Delaware DGCL § 141 Sealed
            </span>
            <span>•</span>
            <span>{filteredDecisions.length} Records</span>
          </div>
        </div>

      </div>

      {/* ── EMPTY STATE ────────────────────────────────────────────── */}
      {filteredDecisions.length === 0 ? (
        <div className="w-full py-16 text-center bg-base-100 border border-base-300 border-dashed rounded-3xl space-y-3">
          <Scale className="w-12 h-12 text-base-content/30 mx-auto" />
          <h3 className="text-lg font-bold text-base-content">No Decision Records Match Filter</h3>
          <p className="text-xs text-base-content/60 max-w-md mx-auto">
            {searchQuery 
              ? `No deliberations found matching "${searchQuery}". Try clearing search or switching filter tabs.`
              : `No decisions recorded under the ${selectedActionFilter} status filter.`}
          </p>
          <Button
            onClick={() => { onSearchChange(''); onActionFilterChange('ALL'); }}
            variant="outline"
            className="rounded-2xl border-base-300 text-xs"
          >
            Reset Filters
          </Button>
        </div>
      ) : viewMode === 'cards' ? (
        /* ── VIEW 1: RICH CARDS GRID ────────────────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDecisions.map((dec) => (
            <div
              key={dec.id}
              onClick={() => setActiveInspectorDecision(dec)}
              className="p-6 bg-base-100 border border-base-300 hover:border-cyan-500/40 rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer space-y-4 group flex flex-col justify-between"
            >
              <div className="space-y-3">
                
                {/* Header: Action Badge & Domain */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getActionBadge(dec.action)}
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-base-200 text-base-content/70 border border-base-300">
                      {dec.domain}
                    </span>
                    <span className="text-[10px] font-mono text-base-content/40">
                      #{dec.id}
                    </span>
                  </div>

                  {/* Delaware DGCL § 141 Merkle Seal Badge */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMerkleDecision(dec);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-500 border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-500 transition-all shrink-0 cursor-pointer"
                    title="Inspect Delaware DGCL § 141 SHA-256 Merkle Proof"
                  >
                    <Lock className="w-3 h-3 text-cyan-500" />
                    <span>DGCL § 141 Seal</span>
                  </button>
                </div>

                {/* Title */}
                <h3 className="font-bold text-base text-base-content group-hover:text-cyan-500 transition-colors leading-snug">
                  {dec.title}
                </h3>

                {/* Problem Statement */}
                <p className="text-xs text-base-content/70 line-clamp-2 leading-relaxed">
                  <strong className="text-base-content/90 font-medium">Context:</strong> {dec.problem}
                </p>

                {/* Recommendation Summary */}
                <div className="p-3 rounded-2xl bg-base-200/80 border border-base-300/60 text-xs font-mono text-base-content/90">
                  <span className="text-[10px] font-bold text-cyan-500 block uppercase tracking-wider mb-1">
                    Directive / Recommendation
                  </span>
                  &ldquo;{dec.recommendation}&rdquo;
                </div>

                {/* Override Reason / Quick Tags */}
                {(dec.overrideReason || (dec.quickTags && dec.quickTags.length > 0)) && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5">
                    {dec.quickTags && dec.quickTags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {dec.quickTags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-300 text-[10px] font-bold">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {dec.overrideReason && (
                      <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium italic">
                        &ldquo;{dec.overrideReason}&rdquo;
                      </p>
                    )}
                  </div>
                )}

                {/* Extracted Tactic Pill */}
                {dec.learnedTacticExtracted && (
                  <div className="flex items-center gap-1.5 text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>Tactic Fed: <strong>{dec.learnedTacticExtracted}</strong></span>
                  </div>
                )}

              </div>

              {/* Bottom Footer: Timestamp & Actor */}
              <div className="pt-3 border-t border-base-300 flex items-center justify-between text-[11px] text-base-content/50">
                <span>{new Date(dec.timestamp).toLocaleDateString()} by {dec.actor}</span>
                <span className="text-cyan-500 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  Inspect Deliberation <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* ── VIEW 2: COMPACT CRYPTOGRAPHIC AUDIT TABLE ─────────────── */
        <div className="overflow-x-auto bg-base-100 border border-base-300 rounded-3xl shadow-sm">
          <table className="w-full text-left text-xs text-base-content">
            <thead className="bg-base-200 border-b border-base-300 text-[10px] uppercase font-bold text-base-content/60 tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Status & ID</th>
                <th className="py-3.5 px-4">Decision Title & Context</th>
                <th className="py-3.5 px-4">Domain</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4 text-right">DGCL Merkle Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200">
              {filteredDecisions.map((dec) => (
                <tr
                  key={dec.id}
                  onClick={() => setActiveInspectorDecision(dec)}
                  className="hover:bg-base-200/50 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {getActionBadge(dec.action)}
                      <span className="text-[10px] font-mono text-base-content/40 block">#{dec.id}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 max-w-md">
                    <div className="font-bold text-base-content line-clamp-1">{dec.title}</div>
                    <div className="text-[11px] text-base-content/60 line-clamp-1">{dec.recommendation}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-lg bg-base-200 text-base-content/70 border border-base-300 text-[10px] font-mono font-bold">
                      {dec.domain}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-base-content/80 font-medium">
                    {dec.actor}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-base-content/50 font-mono text-[11px]">
                    {new Date(dec.timestamp).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMerkleDecision(dec);
                      }}
                      className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-500 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Lock className="w-3 h-3 text-cyan-500" />
                      <span>{dec.merkleRoot.slice(0, 8)}…</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── DECISION INSPECTOR MODAL ────────────────────────────────── */}
      {activeInspectorDecision && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-950 border border-cyan-500/40 text-slate-100 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <button
              onClick={() => setActiveInspectorDecision(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3.5 pr-8">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  {getActionBadge(activeInspectorDecision.action)}
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    {activeInspectorDecision.domain}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">
                    Source: {activeInspectorDecision.source}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1.5 leading-tight">
                  {activeInspectorDecision.title}
                </h2>
              </div>
            </div>

            {/* Deliberation Details */}
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Context & Problem</span>
                <p className="text-slate-200 leading-relaxed">{activeInspectorDecision.problem}</p>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-1.5">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">Directive / Final Consensus</span>
                <p className="text-cyan-200 font-mono leading-relaxed">{activeInspectorDecision.recommendation}</p>
              </div>

              {activeInspectorDecision.overrideReason && (
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1.5">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Executive Override Reason</span>
                  <p className="text-amber-200 leading-relaxed">{activeInspectorDecision.overrideReason}</p>
                </div>
              )}

              {activeInspectorDecision.modifiedDirectives && (
                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-1.5">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Modified Levers & Adjustments</span>
                  <p className="text-indigo-200 font-mono leading-relaxed">{activeInspectorDecision.modifiedDirectives}</p>
                </div>
              )}

              {activeInspectorDecision.participants && activeInspectorDecision.participants.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Participating Executive Panel ({activeInspectorDecision.participants.length} Agents)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeInspectorDecision.participants.map((p, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-white text-xs">{p.name}</div>
                          <div className="text-[10px] text-slate-400">{p.role}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-300">
                          {p.verdict || 'SUPPORT'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <Button
                onClick={() => {
                  setSelectedMerkleDecision(activeInspectorDecision);
                }}
                variant="outline"
                className="rounded-2xl border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 font-bold text-xs uppercase tracking-wider gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" /> Inspect DGCL Seal
              </Button>

              <Button
                onClick={() => setActiveInspectorDecision(null)}
                className="rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider px-5"
              >
                Close
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* ── MERKLE PROOF MODAL ───────────────────────────────────────── */}
      {selectedMerkleDecision && (
        <MerkleProofModal
          decision={selectedMerkleDecision}
          onClose={() => setSelectedMerkleDecision(null)}
        />
      )}

    </div>
  );
}
