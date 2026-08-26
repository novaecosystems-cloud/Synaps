'use client';

import React, { useState } from 'react';
import { 
  Sparkles, Plus, Check, X, Loader2, ShieldCheck, Layers 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { CorporateTactic, TacticDomain, TacticStatus } from '@/lib/corporate-tactics';

interface AddTacticModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newTactic: CorporateTactic) => void;
}

const DOMAINS: TacticDomain[] = ['LEGAL', 'FINANCE', 'STRATEGY', 'OPERATIONS', 'TECH', 'GOVERNANCE'];

export function AddTacticModal({ isOpen, onClose, onSuccess }: AddTacticModalProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState<TacticDomain>('STRATEGY');
  const [rule, setRule] = useState('');
  const [triggerCondition, setTriggerCondition] = useState('');
  const [policyDirective, setPolicyDirective] = useState('');
  const [confidenceScore, setConfidenceScore] = useState(92);
  const [status, setStatus] = useState<TacticStatus>('ACTIVE');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!title.trim() || !rule.trim()) {
      toast({
        title: "Missing Required Fields",
        description: "Please specify both a Tactic Name and an Invariant Rule statement.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/decisions/tactics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          domain,
          rule: rule.trim(),
          triggerCondition: triggerCondition.trim() || 'When evaluating related operational proposals',
          policyDirective: policyDirective.trim() || rule.trim(),
          confidenceScore,
          status,
          notes: notes.trim()
        })
      });

      const json = await res.json();
      if (json.success) {
        toast({
          title: "New Corporate Tactic Established",
          description: `"${title}" has been anchored to organizational decision memory with DGCL § 141 Merkle seal.`
        });
        onSuccess(json.data);
        onClose();
        // Reset form
        setTitle('');
        setRule('');
        setTriggerCondition('');
        setPolicyDirective('');
        setNotes('');
      } else {
        toast({
          title: "Creation Error",
          description: json.error || "Failed to add tactic.",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      toast({
        title: "Creation Error",
        description: err.message || "Failed to add tactic.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
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
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                Playbook Extension
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1.5 leading-tight">
              Add Custom Corporate Tactic
            </h2>
            <p className="text-xs text-slate-400">
              Establish a new explicit policy rule to govern autonomous AI boardroom recommendations.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4 text-xs">
          
          {/* Domain Category Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider">
              Governance Domain
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {DOMAINS.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDomain(d)}
                  className={cn(
                    "px-2 py-1.5 rounded-xl text-[11px] font-bold transition-all border text-center",
                    domain === d
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider">
              Tactic / Rule Name
            </label>
            <input
              type="text"
              placeholder="e.g. Capital Expenditure Threshold: Multi-Quote Requirement"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Rule Statement */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider">
              Invariant Policy Statement
            </label>
            <textarea
              placeholder="e.g. All unbudgeted capital expenditures exceeding $50,000 must obtain at least three competitive vendor quotes."
              value={rule}
              onChange={(e) => setRule(e.target.value)}
              rows={2}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Trigger Condition */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider">
              Trigger Condition
            </label>
            <input
              type="text"
              placeholder="e.g. Procurement requests or simulation proposals with CapEx > $50k"
              value={triggerCondition}
              onChange={(e) => setTriggerCondition(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Policy Directive */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider">
              Mandated Action Directive
            </label>
            <textarea
              placeholder="e.g. Halt autonomous approval and dispatch RFP tickets to Procurement Officer."
              value={policyDirective}
              onChange={(e) => setPolicyDirective(e.target.value)}
              rows={2}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Initial Confidence & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-300 uppercase tracking-wider">
                  Initial AI Confidence
                </span>
                <span className="font-mono font-bold text-indigo-400 text-sm">
                  {confidenceScore}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={confidenceScore}
                onChange={(e) => setConfidenceScore(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider block">
                Governance Notes
              </label>
              <input
                type="text"
                placeholder="Optional statutory notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>
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
            onClick={handleCreate}
            disabled={saving}
            className="rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-2.5 shadow-lg gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
            {saving ? 'Creating Tactic...' : 'Create & Anchor Tactic'}
          </Button>
        </div>

      </div>
    </div>
  );
}
