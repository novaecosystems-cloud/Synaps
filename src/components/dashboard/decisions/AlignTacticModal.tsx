'use client';

import React, { useState } from 'react';
import { 
  Sparkles, Sliders, Lock, Unlock, Check, X, 
  Loader2, Scale, AlertTriangle, ShieldCheck, HelpCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { CorporateTactic, TacticDomain, TacticStatus } from '@/lib/corporate-tactics';

interface AlignTacticModalProps {
  tactic: CorporateTactic | null;
  onClose: () => void;
  onSuccess: (updated: CorporateTactic) => void;
}

export function AlignTacticModal({ tactic, onClose, onSuccess }: AlignTacticModalProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState(tactic?.title || '');
  const [rule, setRule] = useState(tactic?.rule || '');
  const [triggerCondition, setTriggerCondition] = useState(tactic?.triggerCondition || '');
  const [policyDirective, setPolicyDirective] = useState(tactic?.policyDirective || '');
  const [confidenceScore, setConfidenceScore] = useState(tactic?.confidenceScore || 90);
  const [status, setStatus] = useState<TacticStatus>(tactic?.status || 'ACTIVE');
  const [notes, setNotes] = useState(tactic?.notes || '');
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (tactic) {
      setTitle(tactic.title);
      setRule(tactic.rule);
      setTriggerCondition(tactic.triggerCondition);
      setPolicyDirective(tactic.policyDirective);
      setConfidenceScore(tactic.confidenceScore);
      setStatus(tactic.status);
      setNotes(tactic.notes || '');
    }
  }, [tactic]);

  if (!tactic) return null;

  const handleSave = async () => {
    if (!title.trim() || !rule.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and Rule statement cannot be empty.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/decisions/tactics', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tacticId: tactic.id,
          updates: {
            title: title.trim(),
            rule: rule.trim(),
            triggerCondition: triggerCondition.trim(),
            policyDirective: policyDirective.trim(),
            confidenceScore,
            status,
            notes: notes.trim()
          }
        })
      });

      const json = await res.json();
      if (json.success) {
        toast({
          title: "Corporate Tactic Aligned & Updated",
          description: `Updated "${title}" across organizational decision memory with Merkle hash recalculation.`
        });
        onSuccess(json.data);
        onClose();
      } else {
        toast({
          title: "Failed to update tactic",
          description: json.error || "An error occurred.",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      toast({
        title: "Save Error",
        description: err.message || "Failed to update corporate tactic.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-cyan-500/40 text-slate-100 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                1-Click Alignment Control
              </span>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
                {tactic.domain}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1.5 leading-tight">
              Align & Refine Corporate Tactic
            </h2>
            <p className="text-xs text-slate-400">
              Tune organizational policy rules and AI model weighting synthesized from historical decisions.
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 text-xs">
          
          {/* Tactic Title */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider">
              Tactic / Rule Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          {/* Primary Rule Statement */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider">
              Learned Invariant Rule
            </label>
            <textarea
              value={rule}
              onChange={(e) => setRule(e.target.value)}
              rows={2}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          {/* Trigger Condition */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider">
              Trigger Condition
            </label>
            <input
              type="text"
              value={triggerCondition}
              onChange={(e) => setTriggerCondition(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          {/* Policy Directive */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider">
              Mandated Policy Directive
            </label>
            <textarea
              value={policyDirective}
              onChange={(e) => setPolicyDirective(e.target.value)}
              rows={2}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          {/* Confidence Slider & Status Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
            
            {/* Confidence Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-300 uppercase tracking-wider">
                  AI Confidence Weight
                </span>
                <span className="font-mono font-bold text-cyan-400 text-sm">
                  {confidenceScore}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={confidenceScore}
                onChange={(e) => setConfidenceScore(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="text-[10px] text-slate-400 block">
                Derived from {tactic.supportingDecisionsCount} supporting precedent decisions.
              </span>
            </div>

            {/* Status Selector */}
            <div className="space-y-2">
              <span className="font-bold text-slate-300 uppercase tracking-wider block">
                Governance Status
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {(['ACTIVE', 'LOCKED', 'UNDER_REVIEW', 'ARCHIVED'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={cn(
                      "px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all border",
                      status === st
                        ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                    )}
                  >
                    {st === 'LOCKED' ? '🔒 Locked' : st === 'ACTIVE' ? '⚡ Active' : st === 'UNDER_REVIEW' ? '⏳ Review' : '📦 Archive'}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Executive Rationale Note */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider">
              Alignment Notes / Executive Rationale
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Approved during Q3 Board Quorum under DGCL § 141 Safe Harbor."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={saving}
            className="rounded-2xl border-slate-800 text-slate-300 hover:bg-slate-900"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-extrabold text-xs uppercase tracking-wider px-6 py-2.5 shadow-lg gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <Check className="w-4 h-4 text-black" />}
            {saving ? 'Aligning Memory...' : 'Save & Align Tactic'}
          </Button>
        </div>

      </div>
    </div>
  );
}
