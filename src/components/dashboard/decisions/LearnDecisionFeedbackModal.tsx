'use client';

import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, Flame, Edit3, X, 
  Tag, Loader2, ShieldCheck, Scale, AlertTriangle, ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { DecisionAction, TacticDomain } from '@/lib/corporate-tactics';

export interface LearnDecisionFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAction?: DecisionAction;
  decisionTitle: string;
  recommendation: string;
  source: 'BOARDROOM' | 'SCM_SIMULATION' | 'DOCUMENT_REVIEW' | 'EXECUTIVE_PROPOSAL';
  domain?: TacticDomain;
  problem?: string;
  confidence?: number;
  participants?: { name: string; role: string; verdict?: string }[];
  onSuccess?: (result: any) => void;
}

const QUICK_TAGS = [
  'Too Risky',
  'Violates Margin Goal',
  'Legal Conflict',
  'High Capital Expenditure',
  'SLA Breach Risk',
  'Breaches Compliance',
  'Strategic Misalignment',
  'Working Capital Constraint',
  'Vendor Single-Source Risk',
  'Custom Note'
];

export function LearnDecisionFeedbackModal({
  isOpen,
  onClose,
  initialAction = 'ACCEPTED',
  decisionTitle,
  recommendation,
  source,
  domain = 'STRATEGY',
  problem,
  confidence = 95,
  participants,
  onSuccess
}: LearnDecisionFeedbackModalProps) {
  const { toast } = useToast();
  const [action, setAction] = useState<DecisionAction>(initialAction);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [overrideReason, setOverrideReason] = useState('');
  const [modifiedDirectives, setModifiedDirectives] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Sync initial action when opened
  React.useEffect(() => {
    setAction(initialAction);
  }, [initialAction, isOpen]);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/decisions/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: decisionTitle,
          source,
          domain,
          action,
          recommendation,
          problem,
          overrideReason: overrideReason.trim() || undefined,
          quickTags: selectedTags.length > 0 ? selectedTags : undefined,
          modifiedDirectives: action === 'MODIFIED' ? (modifiedDirectives.trim() || undefined) : undefined,
          confidence,
          participants
        })
      });

      const json = await res.json();

      if (json.success) {
        // Display exact toast notification required by Task 16
        toast({
          title: "Decision recorded to organizational memory.",
          description: "Causarix has updated its corporate tactics playbook with Delaware DGCL § 141 cryptographic seal."
        });

        if (onSuccess) {
          onSuccess(json);
        }
        onClose();
      } else {
        toast({
          title: "Failed to record decision feedback",
          description: json.error || "An error occurred while communicating with the decision memory engine.",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      toast({
        title: "Submission Error",
        description: err.message || "Failed to submit decision feedback.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-indigo-500/40 text-slate-100 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                Cognitive Feedback Loop
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold">
                {source}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1.5 leading-tight">
              Learn From This Decision
            </h2>
            <p className="text-xs text-slate-400">
              Your feedback trains Causarix&apos;s organizational memory and tunes learned corporate tactics.
            </p>
          </div>
        </div>

        {/* Decision Context Snippet */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Decision Under Review
          </div>
          <h4 className="text-sm font-semibold text-white">
            {decisionTitle}
          </h4>
          <p className="text-xs text-slate-300 line-clamp-2">
            &ldquo;{recommendation}&rdquo;
          </p>
        </div>

        {/* 3 Executive Feedback Action Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Select Executive Verdict Action
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            
            {/* Accept Button */}
            <button
              type="button"
              onClick={() => setAction('ACCEPTED')}
              className={cn(
                "p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5",
                action === 'ACCEPTED'
                  ? "bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-md ring-1 ring-emerald-500/50"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              )}
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold">Accept Decision</span>
              <span className="text-[10px] text-slate-400">Adopt rule as-is</span>
            </button>

            {/* Reject Button */}
            <button
              type="button"
              onClick={() => setAction('REJECTED')}
              className={cn(
                "p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5",
                action === 'REJECTED'
                  ? "bg-red-950/60 border-red-500 text-red-300 shadow-md ring-1 ring-red-500/50"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              )}
            >
              <Flame className="w-5 h-5 text-red-400" />
              <span className="text-xs font-bold">Reject with Reason</span>
              <span className="text-[10px] text-slate-400">Block & train AI</span>
            </button>

            {/* Modify Button */}
            <button
              type="button"
              onClick={() => setAction('MODIFIED')}
              className={cn(
                "p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5",
                action === 'MODIFIED'
                  ? "bg-amber-950/60 border-amber-500 text-amber-300 shadow-md ring-1 ring-amber-500/50"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              )}
            >
              <Edit3 className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold">Modify Levers</span>
              <span className="text-[10px] text-slate-400">Refine & accept</span>
            </button>

          </div>
        </div>

        {/* Quick-Select Tags (Shown when REJECTED or MODIFIED) */}
        {(action === 'REJECTED' || action === 'MODIFIED') && (
          <div className="space-y-2 animate-in fade-in duration-150">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" /> Quick-Select Rationale Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      "px-3 py-1 rounded-xl text-xs font-medium transition-all border",
                      isSelected
                        ? action === 'REJECTED'
                          ? "bg-red-500/20 border-red-500/60 text-red-300"
                          : "bg-amber-500/20 border-amber-500/60 text-amber-300"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    )}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Override Note / Reason Input */}
        {(action === 'REJECTED' || action === 'MODIFIED') && (
          <div className="space-y-1.5 animate-in fade-in duration-150">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {action === 'REJECTED' ? 'Executive Rejection Rationale' : 'Executive Reason for Override'}
            </label>
            <textarea
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              rows={2}
              placeholder={
                action === 'REJECTED'
                  ? "Explain why this decision is rejected to prevent similar future AI proposals (e.g. Uncapped liability violates our 1x ACV mandate)..."
                  : "Explain the adjustment rationale..."
              }
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        )}

        {/* Modified Levers / Directives Input (Shown only when MODIFIED) */}
        {action === 'MODIFIED' && (
          <div className="space-y-1.5 animate-in fade-in duration-150">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5" /> Adjusted Levers & Directives
            </label>
            <textarea
              value={modifiedDirectives}
              onChange={(e) => setModifiedDirectives(e.target.value)}
              rows={2}
              placeholder="Specify modified terms or levers (e.g. Phase CapEx into two 6-month tranches, increase required uptime SLA to 99.99%)..."
              className="w-full bg-slate-900 border border-amber-500/40 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
        )}

        {/* Fiduciary Assurance Footnote */}
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Delaware DGCL § 141(e) SHA-256 Merkle root will be automatically computed and chained upon submission.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={submitting}
            className="rounded-2xl border-slate-800 text-slate-300 hover:bg-slate-900"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className={cn(
              "rounded-2xl font-extrabold text-xs uppercase tracking-wider px-6 py-2.5 shadow-lg gap-2",
              action === 'ACCEPTED'
                ? "bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white"
                : action === 'REJECTED'
                ? "bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white"
                : "bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white"
            )}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Recording to Memory...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Submit Feedback & Update Playbook
              </>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}
