'use client';

import { useState, useEffect } from 'react';
import { 
  X, Sparkles, ShieldCheck, Check, ArrowRight, Zap, RefreshCw, 
  HeartHandshake, ShieldAlert, Award, CheckCircle2, BrainCircuit, CreditCard, ShoppingBag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOrgProfile } from '@/context/OrgProfileContext';
import { Building2 } from 'lucide-react';
import { getLemonSqueezyCheckoutUrl, triggerLemonSqueezyApiRefund } from '@/lib/lemonsqueezy';
import { generateIdempotencyKey } from '@/lib/idempotency';

interface MultiStepPaywallProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialStep?: number;
  defaultPlan?: 'pro' | 'enterprise';
}

function playPaymentSuccessChime() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const playNote = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    // Play crisp ascending two-note chime (E5 -> A5)
    playNote(659.25, 0, 0.25);
    playNote(880.00, 0.15, 0.45);
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 700);
  } catch (e) {}
}

export default function MultiStepPaywallModal({
  isOpen,
  onClose,
  onSuccess,
  initialStep = 1,
  defaultPlan = 'pro'
}: MultiStepPaywallProps) {
  const [step, setStep] = useState<number>(initialStep);
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'enterprise'>(defaultPlan);
  const { profile } = useOrgProfile();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [refundUserEmail, setRefundUserEmail] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [refundRequested, setRefundRequested] = useState(false);
  const [refundSubmitting, setRefundSubmitting] = useState(false);
  const [paymentSuccessState, setPaymentSuccessState] = useState(false);
  const [userRole, setUserRole] = useState<string>('MEMBER');
  const [creditLimit, setCreditLimit] = useState<number>(50);

  useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
      setPaymentSuccessState(false);
      setRefundRequested(false);
    }
  }, [isOpen, initialStep]);

  useEffect(() => {
    const checkActivePlan = async () => {
      try {
        const res = await fetch('/api/settings/ai/credits');
        const data = await res.json();
        if (data.success && data.credits) {
          const role = (data.credits.role || 'MEMBER').toUpperCase();
          const limit = data.credits.creditLimit || 50;
          setUserRole(role);
          setCreditLimit(limit);

          // If user is already Pro, default selection to Enterprise
          if (role === 'ADMIN' || limit === 500) {
            setSelectedPlan('enterprise');
          }
        }
      } catch (e) {}
    };

    if (isOpen) {
      checkActivePlan();
    }
  }, [isOpen]);

  useEffect(() => {
    if (defaultPlan && userRole !== 'ADMIN' && creditLimit !== 500) {
      setSelectedPlan(defaultPlan);
    }
  }, [defaultPlan, userRole, creditLimit]);

  if (!isOpen) return null;

  const prices = {
    pro: {
      original: billingCycle === 'yearly' ? 39 : 49,
      discounted: billingCycle === 'yearly' ? 24 : 29
    },
    enterprise: {
      original: billingCycle === 'yearly' ? 89 : 100,
      discounted: billingCycle === 'yearly' ? 32 : 39
    }
  };

  const currentPrice = prices[selectedPlan].discounted;

  const handleOpenLemonSqueezy = () => {
    const checkoutUrl = getLemonSqueezyCheckoutUrl(selectedPlan);
    window.open(checkoutUrl, '_blank');
  };

  const triggerPaymentSuccessState = () => {
    setPaymentSuccessState(true);
    playPaymentSuccessChime();
    if (onSuccess) onSuccess();
  };

  const handleRequestRefund = async () => {
    const emailToUse = refundUserEmail.trim();
    if (!emailToUse || refundSubmitting) return;
    
    setRefundSubmitting(true);
    const idempKey = generateIdempotencyKey('refund_req');

    try {
      await fetch('/api/settings/billing/upgrade', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempKey
        },
        body: JSON.stringify({
          action: 'refund_request',
          userEmail: emailToUse,
          refundMethod: 'lemonsqueezy',
          refundPayoutDetails: emailToUse,
          reason: refundReason || '14-Day 100% Money-Back Guarantee',
          idempotencyKey: idempKey
        })
      });

      await triggerLemonSqueezyApiRefund(emailToUse, emailToUse);
      window.dispatchEvent(new Event('focus'));
    } catch (e) {}

    setRefundRequested(true);
    setRefundSubmitting(false);
  };

  const activeEmailForRefund = refundUserEmail.trim();

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-in fade-in duration-200">
      <style jsx global>{`
        @keyframes drawCircle {
          0% { stroke-dashoffset: 276; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
      
      <div className="bg-base-100 border border-base-300 rounded-3xl max-w-2xl w-full shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Progress Bar & Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-primary to-rose-600 p-3 text-white text-xs font-bold flex justify-between items-center px-6">
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
            <Sparkles className="w-3.5 h-3.5 fill-white" /> One-Time Discount & Money-Back Guarantee
          </span>
          <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold">
            {paymentSuccessState ? 'Payment Verified' : `Step ${step} of 4`}
          </span>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 z-20 p-2 text-base-content/50 hover:text-base-content rounded-full hover:bg-base-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scroll Container */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">

          {/* PAYMENT SUCCESS STATE WITH ANIMATED DRAWN CIRCLE & CHIME */}
          {paymentSuccessState ? (
            <div className="text-center py-6 space-y-5 animate-in zoom-in-90 duration-300">
              <div className="relative flex items-center justify-center w-28 h-28 mx-auto">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    className="text-emerald-500/20"
                    strokeWidth="6"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    className="text-emerald-400 stroke-current"
                    strokeWidth="6"
                    strokeDasharray="276"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    fill="transparent"
                    style={{
                      animation: 'drawCircle 0.9s cubic-bezier(0.65, 0, 0.45, 1) forwards'
                    }}
                  />
                </svg>
                <div className="bg-emerald-500/20 text-emerald-400 p-5 rounded-full shadow-lg shadow-emerald-500/30 animate-in zoom-in-50 duration-500">
                  <Check className="w-12 h-12 stroke-[3]" />
                </div>
              </div>

              <div className="space-y-2">
                <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-xs uppercase tracking-widest">
                  Payment Success Confirmed
                </span>
                <h3 className="text-2xl font-extrabold text-base-content">
                  {selectedPlan === 'pro' ? 'Pro Intelligence Activated! 🎉' : 'Enterprise Max Activated! 🚀'}
                </h3>
                <p className="text-xs text-base-content/70 max-w-md mx-auto">
                  Your payment was verified via LemonSqueezy Merchant API. Your daily AI limit has been upgraded to <strong>{selectedPlan === 'pro' ? '500 Credits/Day' : '10,000 Credits/Day'}</strong>.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full max-w-md py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-sm uppercase tracking-wider transition-all shadow-lg hover:scale-[1.01]"
              >
                Start Using Causarix Now <ArrowRight className="w-4 h-4 inline-block ml-1" />
              </button>
            </div>
          ) : (
            <>
              {/* STEP 1: THE EXECUTIVE CRISIS & BLINDSPOT AUDIT */}
              {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="text-center space-y-2">
                    <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-extrabold text-[10px] uppercase tracking-widest">
                      The Enterprise AI Crisis
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-base-content tracking-tight">
                      Why Generic AI Fails in the Boardroom
                    </h2>
                    <p className="text-xs md:text-sm text-base-content/60 max-w-lg mx-auto">
                      Generic chatbots hallucinate and drift mathematically by 9%–17% on balance sheets, exposing directors to personal liability under Delaware DGCL § 141.
                    </p>
                  </div>

                  {/* High Impact Threat Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-4 bg-rose-950/20 border border-rose-800/30 rounded-2xl space-y-1.5">
                      <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                        <ShieldAlert className="w-4 h-4" /> 9%–17% Math Drift
                      </div>
                      <p className="text-xs text-base-content/70">
                        Probabilistic LLMs guess numbers, corrupting EBITDA valuations and debt covenant modeling.
                      </p>
                    </div>

                    <div className="p-4 bg-amber-950/20 border border-amber-800/30 rounded-2xl space-y-1.5">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                        <Zap className="w-4 h-4" /> Cross-Silo Blindspots
                      </div>
                      <p className="text-xs text-base-content/70">
                        Sales commits to 99.99% SLAs while Engineering architecture only supports 99.9%.
                      </p>
                    </div>

                    <div className="p-4 bg-indigo-950/20 border border-indigo-800/30 rounded-2xl space-y-1.5">
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                        <Award className="w-4 h-4" /> Delaware § 141 Liability
                      </div>
                      <p className="text-xs text-base-content/70">
                        Directors face personal shareholder lawsuits without verifiable, court-admissible audit trails.
                      </p>
                    </div>

                    <div className="p-4 bg-cyan-950/20 border border-cyan-800/30 rounded-2xl space-y-1.5">
                      <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                        <Building2 className="w-4 h-4" /> $1.4M Average Exposure
                      </div>
                      <p className="text-xs text-base-content/70">
                        Typical mid-market enterprises harbor over $1.4M in unhedged contractual indemnifications.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-primary to-cyan-500 hover:opacity-95 text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.01]"
                  >
                    See How Causarix Solves This <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: THE 10-AGENT BOARDROOM & 0.00% MATH DRIFT */}
              {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="text-center space-y-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-[10px] uppercase tracking-widest">
                      The Causal Operating System
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-base-content tracking-tight">
                      10-Agent Boardroom & 0.00% Math Drift
                    </h2>
                    <p className="text-xs md:text-sm text-base-content/60 max-w-lg mx-auto">
                      Causarix replaces conversational guesswork with a quorum of autonomous executive twins and deterministic WebAssembly math.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-4 bg-base-200/80 border border-base-300 rounded-2xl space-y-1.5">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <BrainCircuit className="w-4 h-4" /> 10-Agent C-Suite Quorum
                      </div>
                      <p className="text-xs text-base-content/70">
                        CEO, CFO, CTO, Legal, and Risk Officer digital twins conduct dialectic debates in parallel.
                      </p>
                    </div>

                    <div className="p-4 bg-base-200/80 border border-base-300 rounded-2xl space-y-1.5">
                      <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                        <Award className="w-4 h-4" /> 0.00% Math Drift SCM
                      </div>
                      <p className="text-xs text-base-content/70">
                        Judea Pearl $do$-calculus running in WebAssembly with Box-Muller Gaussian normal conservation.
                      </p>
                    </div>

                    <div className="p-4 bg-base-200/80 border border-base-300 rounded-2xl space-y-1.5">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                        <ShieldCheck className="w-4 h-4" /> Delaware DGCL § 141 Seals
                      </div>
                      <p className="text-xs text-base-content/70">
                        Cryptographic SHA-256 Merkle proofs attached to every board minute for safe-harbor protection.
                      </p>
                    </div>

                    <div className="p-4 bg-base-200/80 border border-base-300 rounded-2xl space-y-1.5">
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                        <Zap className="w-4 h-4" /> Instant Remote Cloud Wipe
                      </div>
                      <p className="text-xs text-base-content/70">
                        Vexa meeting scribe scrubs PII in-flight and executes immediate DELETE on cloud audio.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="px-5 py-3.5 rounded-2xl border border-base-300 hover:bg-base-200 text-xs font-bold text-base-content"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      View ROI & Upgrade Plans <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PRICING & ROI ANCHORING */}
              {step === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/40 flex items-center gap-3 shadow-md">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="text-xs">
                      <span className="text-slate-400 font-mono text-[10px] uppercase tracking-wider block">Calibrated Intelligence Workspace</span>
                      <strong className="text-white text-sm">{profile?.companyName || 'Your Organization'}</strong>
                      {profile?.sector && profile.sector !== 'default' && (
                        <span className="text-cyan-400 font-mono text-xs ml-1.5">[{profile.sector.toUpperCase()} EDITION]</span>
                      )}
                      <p className="text-[11px] text-slate-300/80 mt-0.5">
                        10-Agent C-Suite quorum and SCM Monte Carlo engines calibrated for your exact operational risk profile.
                      </p>
                    </div>
                  </div>

                  {/* PRICE ANCHORING & ROI COMPARISON CARD */}
                  <div className="p-3.5 rounded-2xl bg-base-200/80 border border-base-300 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold text-base-content/60 uppercase">
                      <span>Human Advisory vs. Causarix OS</span>
                      <span className="text-emerald-500 font-extrabold">99.8% Cost Elimination</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-rose-950/10 border border-rose-900/30 space-y-0.5">
                        <div className="text-rose-400 font-bold text-xs">Human C-Suite Advisors</div>
                        <div className="text-base font-extrabold text-base-content/80">$25,000 / month</div>
                        <p className="text-[10px] text-base-content/60">Slow memos, human bias & meeting fatigue.</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-950/10 border border-emerald-800/30 space-y-0.5">
                        <div className="text-emerald-400 font-bold text-xs">10-Agent Causarix Intelligence</div>
                        <div className="text-base font-extrabold text-emerald-400">$39 / month</div>
                        <p className="text-[10px] text-emerald-500/90 font-medium">Instant debate, 0.00% math drift & 24/7 access.</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* PRO CARD */}
                    <div
                      onClick={() => setSelectedPlan('pro')}
                      className={cn(
                        "p-5 rounded-3xl border cursor-pointer transition-all space-y-3 relative",
                        selectedPlan === 'pro' 
                          ? "bg-primary/5 border-primary ring-2 ring-primary/30 shadow-md" 
                          : "bg-base-100 border-base-300 hover:border-base-400"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-extrabold text-base text-base-content block">Pro Intelligence</span>
                          <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Most Popular ($29/mo)</span>
                        </div>
                        {selectedPlan === 'pro' && <CheckCircle2 className="w-5 h-5 text-primary" />}
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-amber-500">$29</span>
                        <span className="text-xs text-base-content/50 line-through">$49</span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">40% OFF</span>
                        <span className="text-xs text-base-content/60">/ month</span>
                      </div>

                      <ul className="space-y-1.5 text-xs text-base-content/80 font-medium">
                        <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary" /> 500 Daily AI Credits</li>
                        <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary" /> 10-Agent C-Suite Boardroom</li>
                        <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary" /> SCM Counterfactual Studio</li>
                      </ul>
                    </div>

                    {/* ENTERPRISE CARD */}
                    <div
                      onClick={() => setSelectedPlan('enterprise')}
                      className={cn(
                        "p-5 rounded-3xl border cursor-pointer transition-all space-y-3 relative",
                        selectedPlan === 'enterprise' 
                          ? "bg-cyan-500/5 border-cyan-500 ring-2 ring-cyan-500/30 shadow-md" 
                          : "bg-base-100 border-base-300 hover:border-base-400"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-extrabold text-base text-base-content block">Enterprise Max</span>
                          <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-wider">Launch Special ($39/mo)</span>
                        </div>
                        {selectedPlan === 'enterprise' && <CheckCircle2 className="w-5 h-5 text-cyan-500" />}
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-cyan-400">$39</span>
                        <span className="text-xs text-base-content/50 line-through">$100</span>
                        <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-extrabold">LAUNCH100 (61% OFF)</span>
                        <span className="text-xs text-base-content/60">/ month</span>
                      </div>

                      <ul className="space-y-1.5 text-xs text-base-content/80 font-medium">
                        <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-500" /> 10,000 Daily AI Credits</li>
                        <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-500" /> Vexa Meeting Scribe Bot</li>
                        <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-500" /> Bi-Directional Jira & Drive Sync</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(2)}
                      className="px-5 py-3.5 rounded-2xl border border-base-300 hover:bg-base-200 text-xs font-bold text-base-content"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(4)}
                      className="flex-1 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      Continue to Risk-Free Trial ({selectedPlan === 'pro' ? '$29' : '$39'}/mo) <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: 3-DAY FREE TRIAL TIMELINE & CHECKOUT */}
              {step === 4 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex justify-between items-center border-b border-base-200 pb-3">
                    <div>
                      <h3 className="text-lg font-extrabold text-base-content">Risk-Free 3-Day Trial Timeline</h3>
                      <p className="text-xs text-base-content/60">
                        Selected Plan: <strong className="text-amber-500">{selectedPlan === 'pro' ? 'Pro Intelligence ($29/mo)' : 'Enterprise Max ($39/mo with LAUNCH100)'}</strong>
                      </p>
                    </div>
                    <button 
                      onClick={() => setStep(3)}
                      className="text-xs text-primary font-bold hover:underline"
                    >
                      Change Plan
                    </button>
                  </div>

                  {/* 3-DAY VISUAL TIMELINE */}
                  <div className="p-4 bg-base-200/90 border border-base-300 rounded-3xl space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                        <div className="text-[10px] font-mono uppercase text-emerald-400 font-extrabold">DAY 0 (TODAY)</div>
                        <div className="text-sm font-black text-white">$0.00</div>
                        <p className="text-[9px] text-emerald-300/80">Full instant access to 10-Agent Boardroom</p>
                      </div>

                      <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                        <div className="text-[10px] font-mono uppercase text-amber-400 font-extrabold">DAY 2</div>
                        <div className="text-sm font-black text-white">REMINDER</div>
                        <p className="text-[9px] text-amber-300/80">Reminder notice sent. Cancel in 1 click.</p>
                      </div>

                      <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-1">
                        <div className="text-[10px] font-mono uppercase text-cyan-400 font-extrabold">DAY 3</div>
                        <div className="text-sm font-black text-white">{selectedPlan === 'pro' ? '$29' : '$39'}</div>
                        <p className="text-[9px] text-cyan-300/80">Billed only if you love it. 14-day refund.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-gradient-to-br from-amber-500/10 via-primary/5 to-cyan-600/10 border-2 border-amber-500/40 rounded-3xl space-y-4 shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                        <ShoppingBag className="w-4 h-4" /> Secure Merchant Checkout
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        14-Day Money-Back Guarantee
                      </span>
                    </div>

                    <button
                      onClick={handleOpenLemonSqueezy}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-primary to-rose-600 text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.01]"
                    >
                      <CreditCard className="w-5 h-5" /> Start 3-Day Free Trial & Checkout
                    </button>

                    <div className="flex items-center justify-center gap-4 text-[11px] font-bold text-emerald-400">
                      <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Instant Upgrade</span>
                      <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Cancel in 1-Click</span>
                      <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Zero Risk</span>
                    </div>
                  </div>

                  {/* REFUND ENGINE */}
                  <div className="p-4 bg-base-200/60 border border-base-300 rounded-2xl space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                        <HeartHandshake className="w-4 h-4" /> 14-Day Instant Refund Request
                      </h4>
                      <span className="text-[10px] text-base-content/50">Zero questions asked</span>
                    </div>

                    {refundRequested ? (
                      <div className="p-3 bg-success/10 border border-success/30 rounded-xl text-xs text-success font-bold flex items-center gap-2">
                        <Check className="w-4 h-4 shrink-0" />
                        <span>100% Real Money Refund Submitted via Merchant API.</span>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input 
                          type="email" 
                          value={refundUserEmail}
                          onChange={e => setRefundUserEmail(e.target.value)}
                          placeholder="Your account email for instant refund..."
                          className="flex-1 bg-base-100 border border-base-300 rounded-xl px-3 py-1.5 text-xs text-base-content outline-none"
                        />
                        <button 
                          onClick={handleRequestRefund}
                          disabled={!activeEmailForRefund || refundSubmitting}
                          className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs uppercase disabled:opacity-40"
                        >
                          {refundSubmitting ? 'Refunding...' : 'Refund'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <button
                      onClick={() => setStep(3)}
                      className="px-5 py-2.5 rounded-xl border border-base-300 text-xs font-bold text-base-content hover:bg-base-200"
                    >
                      Back
                    </button>
                    <button
                      onClick={onClose}
                      className="btn btn-ghost btn-xs text-base-content/50"
                    >
                      Close Paywall
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer Guarantee Badge */}
        <div className="bg-base-200/80 px-6 py-3 border-t border-base-300 text-[11px] text-base-content/60 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-success" /> 256-Bit SSL Encrypted & Secured
          </span>
          <span>Cancel Anytime • 14-Day Real Money Refund Guarantee</span>
        </div>
      </div>
    </div>
  );
}
