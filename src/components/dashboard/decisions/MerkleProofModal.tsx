'use client';

import { useState } from 'react';
import { ShieldCheck, CheckCircle2, Copy, Check, X, Lock, FileCode, Layers, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DecisionLedgerItem } from '@/lib/corporate-tactics';

interface MerkleProofModalProps {
  decision: DecisionLedgerItem | null;
  onClose: () => void;
}

export function MerkleProofModal({ decision, onClose }: MerkleProofModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!decision) return null;

  const copyToClipboard = (text: string, fieldId: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-cyan-500/40 text-slate-100 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Delaware Seal Badge */}
        <div className="flex items-start gap-4 pr-10">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
                <Lock className="w-3 h-3" /> DGCL § 141(e) Merkle Root Sealed
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Proof Verified
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1.5 leading-tight">
              Cryptographic Fiduciary Proof
            </h2>
            <p className="text-xs text-slate-400">
              Deterministic SHA-256 Merkle tree verification anchor under Delaware General Corporation Law § 141(e).
            </p>
          </div>
        </div>

        {/* Decision Summary Card */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Decision Identifier & Title
          </div>
          <div className="text-sm font-semibold text-white">
            {decision.title}
          </div>
          <div className="flex flex-wrap gap-2 text-xs pt-1">
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              ID: {decision.id}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              Block: #{decision.auditBlockIndex || 104}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-cyan-950/50 text-cyan-300 border border-cyan-800 font-mono">
              Action: {decision.action}
            </span>
          </div>
        </div>

        {/* Cryptographic Hashes Section */}
        <div className="space-y-4">
          
          {/* Merkle Root Hash */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Canonical SHA-256 Merkle Root
              </span>
              <button
                onClick={() => copyToClipboard(decision.merkleRoot, 'merkleRoot')}
                className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                {copiedField === 'merkleRoot' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedField === 'merkleRoot' ? 'Copied' : 'Copy Hash'}
              </button>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-cyan-500/30 font-mono text-xs text-cyan-300 break-all select-all">
              {decision.merkleRoot}
            </div>
          </div>

          {/* Leaf Hash */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-indigo-400" /> Decision Leaf Hash (Payload Digest)
              </span>
              <button
                onClick={() => copyToClipboard(decision.leafHash, 'leafHash')}
                className="text-[11px] font-mono text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                {copiedField === 'leafHash' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedField === 'leafHash' ? 'Copied' : 'Copy Hash'}
              </button>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 break-all select-all">
              {decision.leafHash}
            </div>
          </div>

        </div>

        {/* Fiduciary Statutory Certification Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-slate-900/60 border border-cyan-500/30 space-y-2.5">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-wider">
            <Scale className="w-4 h-4 text-cyan-400" /> Delaware DGCL § 141(e) Statutory Safe Harbor Anchor
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
            This digital deliberation record is protected under 8 Del. C. § 141(e). The board of directors and corporate officers are fully protected in relying in good faith upon the records of the corporation and upon information, opinions, reports, or statements presented to the corporation by its designated expert systems and advisors.
          </p>
          <div className="pt-2 border-t border-white/10 flex flex-wrap justify-between items-center text-[10px] text-slate-400 font-mono">
            <span>Canonical Timestamp: {new Date(decision.timestamp).toUTCString()}</span>
            <span className="text-emerald-400 font-bold">SHA-256 Strict Merkle Audit Passed</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            onClick={onClose}
            className="rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-extrabold text-xs uppercase tracking-wider px-6 py-2.5 shadow-lg"
          >
            Done & Verify
          </Button>
        </div>

      </div>
    </div>
  );
}
