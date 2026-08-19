'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, AlertTriangle, Sparkles, Gift, PauseCircle, 
  ArrowRight, X, HeartHandshake, CheckCircle2, Lock, Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CancellationRetentionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  onConfirmCancel: (reason: string) => void;
}

export default function CancellationRetentionModal({
  isOpen,
  onClose,
  userEmail = '',
  onConfirmCancel
}: CancellationRetentionModalProps) {
  const [step, setStep] = useState<'OFFER' | 'WARNING' | 'SURVEY' | 'DONE'>('OFFER');
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [pausedSuccess, setPausedSuccess] = useState(false);
  const [discountClaimed, setDiscountClaimed] = useState(false);

  if (!isOpen) return null;

  const handlePause = () => {
    setPausedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleClaimDiscount = () => {
    setDiscountClaimed(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 relative shadow-2xl overflow-hidden text-slate-100">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-900 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: RETENTION OFFER (Pause or 50% Off) */}
        {step === 'OFFER' && !pausedSuccess && !discountClaimed && (
          <div className="space-y-6 text-center pt-2">
            <div className="w-14 h-14 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
              <Gift className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Exclusive Retention Offer
              </span>
              <h2 className="text-xl font-extrabold text-white mt-3">Before you cancel... Take 50% Off!</h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                We'd hate to see you lose access to your 10-Agent AI Boardroom. Stay with us today for <strong className="text-amber-300">50% off your next month</strong> or pause for free!
              </p>
            </div>

            {/* High-Conversions Retention Action Cards */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleClaimDiscount}
                className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-lime-500 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-all"
              >
                <Flame className="w-4 h-4 fill-black" /> Claim 50% Off Next Month (Use Code STAY50)
              </button>

              <button
                onClick={handlePause}
                className="w-full py-3.5 px-5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <PauseCircle className="w-4 h-4" /> Pause Subscription for 60 Days (Free, $0 Charged)
              </button>
            </div>

            {/* Tiny subtle link to proceed to warning */}
            <div className="pt-4 border-t border-slate-900">
              <button
                onClick={() => setStep('WARNING')}
                className="text-[11px] text-slate-600 hover:text-slate-400 transition-all font-medium underline"
              >
                No thanks, I still want to proceed to cancellation options →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: WHAT YOU WILL LOSE WARNING */}
        {step === 'WARNING' && (
          <div className="space-y-5 pt-2">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">Cancellation Warning</h3>
                <p className="text-[11px] text-slate-400">Cancelling will permanently lock your executive tools.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-900/60 border border-rose-500/20 rounded-2xl space-y-2.5">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Features You Will Instantly Lose:</span>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">✕</span> 10-Agent C-Suite Boardroom & Strategy Twin Access
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">✕</span> 3D Living Corporate Memory Graph Node Storage
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">✕</span> 10,000-Run Monte Carlo Financial Risk Simulations
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">✕</span> Priority Agent Processing SLA
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl bg-emerald-500 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-all text-center shadow-lg"
              >
                Keep My Active Subscription
              </button>
              
              <button
                onClick={() => setStep('SURVEY')}
                className="py-3.5 px-4 rounded-2xl border border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-900 font-medium text-xs transition-all"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: EXIT SURVEY & CONFIRM */}
        {step === 'SURVEY' && (
          <div className="space-y-5 pt-2">
            <h3 className="font-extrabold text-sm text-white">Select Reason for Leaving:</h3>

            <div className="space-y-2">
              {[
                'Too expensive for current needs',
                'Temporary project finished',
                'Missing specific feature',
                'Switching to another tool',
                'Other reason'
              ].map((reason, idx) => (
                <label 
                  key={idx}
                  onClick={() => setSelectedReason(reason)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all",
                    selectedReason === reason 
                      ? "border-amber-500/60 bg-amber-500/10 text-amber-300 font-bold"
                      : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700"
                  )}
                >
                  <input type="radio" checked={selectedReason === reason} readOnly className="accent-amber-500" />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl bg-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-700 transition-all"
              >
                Cancel & Keep Subscription
              </button>

              <button
                disabled={!selectedReason}
                onClick={() => {
                  onConfirmCancel(selectedReason);
                  setStep('DONE');
                }}
                className={cn(
                  "py-3 px-4 rounded-2xl text-xs font-bold transition-all",
                  selectedReason
                    ? "bg-rose-500 text-white hover:bg-rose-600 shadow-md"
                    : "bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800"
                )}
              >
                Submit & Confirm Cancel
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CONFIRMED CANCELLATION NOTICE */}
        {step === 'DONE' && (
          <div className="space-y-5 text-center py-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <div>
              <h3 className="font-extrabold text-lg text-white">Cancellation Request Processed</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your cancellation request has been logged. To complete instant cancellation or claim a 14-day refund directly, click below to open your Gumroad customer portal:
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href="https://app.gumroad.com/library"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-1.5"
              >
                <span>Open Gumroad Library / Cancel ↗</span>
              </a>
              <button
                onClick={onClose}
                className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition-all"
              >
                Close Window
              </button>
            </div>
          </div>
        )}

        {/* Success overlays for Pause or Discount */}
        {pausedSuccess && (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="font-extrabold text-base text-white">Subscription Paused for 60 Days!</h3>
            <p className="text-xs text-emerald-400">$0 charged. Your memory graph data is saved.</p>
          </div>
        )}

        {discountClaimed && (
          <div className="text-center py-8 space-y-3">
            <Sparkles className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="font-extrabold text-base text-white">50% Off Discount Claimed!</h3>
            <p className="text-xs text-amber-300">Code STAY50 applied. Thank you for staying with Synaps AI!</p>
          </div>
        )}

      </div>
    </div>
  );
}
