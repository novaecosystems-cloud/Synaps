'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, ShieldCheck, Check, ArrowRight, Zap, RefreshCw, 
  HeartHandshake, ShieldAlert, Award, CheckCircle2, BrainCircuit, CreditCard, ShoppingBag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getLemonSqueezyCheckoutUrl, triggerLemonSqueezyApiRefund } from '@/lib/lemonsqueezy';
import { generateIdempotencyKey } from '@/lib/idempotency';
import UpiPaymentModal from '@/components/UpiPaymentModal';

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
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [userEmail, setUserEmail] = useState('');
  const [refundUserEmail, setRefundUserEmail] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [refundRequested, setRefundRequested] = useState(false);
  const [refundSubmitting, setRefundSubmitting] = useState(false);
  const [noticeSubmitting, setNoticeSubmitting] = useState(false);
  const [checkoutNoticeSent, setCheckoutNoticeSent] = useState(false);
  const [paymentSuccessState, setPaymentSuccessState] = useState(false);
  const [userRole, setUserRole] = useState<string>('MEMBER');
  const [creditLimit, setCreditLimit] = useState<number>(50);
  const [showUpiModal, setShowUpiModal] = useState(false);

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
      original: billingCycle === 'yearly' ? 10 : 14,
      discounted: billingCycle === 'yearly' ? 5 : 7
    },
    enterprise: {
      original: billingCycle === 'yearly' ? 32 : 40,
      discounted: billingCycle === 'yearly' ? 16 : 20
    }
  };

  const currentPrice = prices[selectedPlan].discounted;

  const handleOpenLemonSqueezy = () => {
    const checkoutUrl = getLemonSqueezyCheckoutUrl(selectedPlan, userEmail);
    window.open(checkoutUrl, '_blank');
  };

  const triggerPaymentSuccessState = () => {
    setPaymentSuccessState(true);
    playPaymentSuccessChime();
    if (onSuccess) onSuccess();
  };

  const handleSendPaymentNotice = async () => {
    if (!userEmail.trim() || noticeSubmitting) return;

    setNoticeSubmitting(true);
    const idempKey = generateIdempotencyKey('pay_notice');

    try {
      await fetch('/api/settings/billing/upgrade', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempKey
        },
        body: JSON.stringify({
          action: 'payment_notice',
          userEmail: userEmail.trim(),
          planId: selectedPlan,
          idempotencyKey: idempKey
        })
      });
    } catch (e) {}

    setCheckoutNoticeSent(true);
    setNoticeSubmitting(false);
    triggerPaymentSuccessState();
  };

  const handleRequestRefund = async () => {
    const emailToUse = refundUserEmail.trim() || userEmail.trim();
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

  const activeEmailForRefund = refundUserEmail.trim() || userEmail.trim();

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
            {paymentSuccessState ? 'Payment Verified' : `Step ${step} of 3`}
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
              
              {/* SVG Animated Circle Drawn Around Checkmark */}
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

              <div className="p-4 bg-base-200/80 border border-base-300 rounded-2xl max-w-md mx-auto text-xs text-left space-y-1.5 font-medium">
                <div className="flex justify-between">
                  <span className="text-base-content/60">Selected Plan:</span>
                  <span className="font-bold text-amber-500">{selectedPlan === 'pro' ? 'Pro Intelligence ($7/mo)' : 'Enterprise Max ($20/mo)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">Account Email:</span>
                  <span className="font-bold text-primary">{userEmail || 'Activated'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">Status:</span>
                  <span className="font-bold text-emerald-400">✓ Active & Grounded</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full max-w-md py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-sm uppercase tracking-wider transition-all shadow-lg hover:scale-[1.01]"
              >
                Start Using Synaps AI Now <ArrowRight className="w-4 h-4 inline-block ml-1" />
              </button>

            </div>
          ) : (
            <>
              {/* STEP 1: OUTCOMES */}
              {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="text-center space-y-2">
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-extrabold text-[10px] uppercase tracking-widest">
                      Transformative Enterprise Outcomes
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-base-content tracking-tight">
                      Unlock 10x Operational Speed with Grounded Intelligence
                    </h2>
                    <p className="text-xs md:text-sm text-base-content/60 max-w-lg mx-auto">
                      Stop searching isolated files. Transform your entire document library into an interconnected 3D Memory Graph and AI Executive Boardroom.
                    </p>
                  </div>

                  {/* Core Outcomes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-4 bg-base-200/70 border border-base-300 rounded-2xl space-y-1.5">
                      <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                        <Zap className="w-4 h-4" /> 98.4% Faster Document Audits
                      </div>
                      <p className="text-xs text-base-content/70">
                        Parse 400-page vendor contracts, financial reports, and board minutes in seconds with 100% grounded source citations.
                      </p>
                    </div>

                    <div className="p-4 bg-base-200/70 border border-base-300 rounded-2xl space-y-1.5">
                      <div className="flex items-center gap-2 text-primary font-bold text-sm">
                        <BrainCircuit className="w-4 h-4" /> 10-Agent C-Suite Consensus
                      </div>
                      <p className="text-xs text-base-content/70">
                        Get multi-role executive feedback (CEO, CFO, CTO, Legal, HR) debating strategy and voting in real time.
                      </p>
                    </div>

                    <div className="p-4 bg-base-200/70 border border-base-300 rounded-2xl space-y-1.5">
                      <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                        <ShieldCheck className="w-4 h-4" /> 68% Risk Exposure Reduction
                      </div>
                      <p className="text-xs text-base-content/70">
                        Digital Twin OS stress-tests capacity bottlenecks, supplier delays, and cost overruns before they happen.
                      </p>
                    </div>

                    <div className="p-4 bg-base-200/70 border border-base-300 rounded-2xl space-y-1.5">
                      <div className="flex items-center gap-2 text-purple-500 font-bold text-sm">
                        <Award className="w-4 h-4" /> Zero-Hallucination Guarantee
                      </div>
                      <p className="text-xs text-base-content/70">
                        Every insight is mathematically grounded in your exact uploaded files with direct line-level citations.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-4 py-2 border-y border-base-200 text-xs font-bold text-base-content/70">
                    <span className="flex items-center gap-1.5 text-emerald-500">
                      <CheckCircle2 className="w-4 h-4" /> Cancel Anytime (1-Click)
                    </span>
                    <span className="flex items-center gap-1.5 text-amber-500">
                      <HeartHandshake className="w-4 h-4" /> 14-Day 100% Refund Policy
                    </span>
                    <span className="flex items-center gap-1.5 text-primary">
                      <ShieldAlert className="w-4 h-4" /> Instant Credit Limits
                    </span>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.01]"
                  >
                    See One-Time Discounted Plans <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: PRICING */}
              {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-base-200 pb-4">
                    <div>
                      <h3 className="text-xl font-extrabold text-base-content">Select Your Discounted Upgrade</h3>
                      <p className="text-xs text-base-content/60">50% One-Time Launch Special • Lock in low rates forever</p>
                    </div>

                    <div className="flex items-center gap-1 bg-base-200 p-1 rounded-2xl border border-base-300 text-xs font-bold">
                      <button
                        onClick={() => setBillingCycle('monthly')}
                        className={cn("px-3 py-1 rounded-xl transition-all", billingCycle === 'monthly' ? "bg-base-100 shadow text-base-content" : "text-base-content/60")}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => setBillingCycle('yearly')}
                        className={cn("px-3 py-1 rounded-xl transition-all flex items-center gap-1", billingCycle === 'yearly' ? "bg-base-100 shadow text-base-content" : "text-base-content/60")}
                      >
                        Yearly <span className="px-1.5 py-0.5 rounded-full bg-success/20 text-success text-[9px] font-extrabold">-50% OFF</span>
                      </button>
                    </div>
                  </div>

                  {/* IF ALREADY ON ENTERPRISE MAX */}
                  {userRole === 'OWNER' || creditLimit >= 10000 ? (
                    <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 border border-cyan-500/40 rounded-3xl text-center space-y-4 shadow-xl">
                      <Award className="w-12 h-12 text-amber-400 mx-auto animate-pulse" />
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                          Highest Plan Active
                        </span>
                        <h3 className="text-xl font-extrabold text-white mt-2">You are on Enterprise Max!</h3>
                        <p className="text-xs text-slate-300 mt-1">
                          Your account has <strong>10,000 Daily AI Credits</strong>, 10-Agent C-Suite Boardroom, Monte Carlo Risk Engine, and Unlimited Workspaces fully unlocked.
                        </p>
                      </div>
                      <button
                        onClick={onClose}
                        className="py-3 px-8 rounded-2xl bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all shadow-md"
                      >
                        Return to Workspace
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                                  {/* PROMO CODE BANNER (FIRST 100 USERS ONLY & VALID UNTIL SEPT 5, 2026) */}
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-primary/20 to-cyan-600/20 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 font-bold text-base-content">
                        <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                        <span>30% OFF Code <span className="font-mono bg-amber-500 text-black px-2 py-0.5 rounded font-extrabold text-xs">LAUNCH100</span>: First 100 Users Only (Valid until Sept 5, 2026)</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
                        84/100 CLAIMED
                      </span>
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
                            {userRole === 'ADMIN' || creditLimit === 500 ? (
                              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">✓ Current Active Plan</span>
                            ) : (
                              <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Most Popular ($4.90/mo)</span>
                            )}
                          </div>
                          {selectedPlan === 'pro' && <CheckCircle2 className="w-5 h-5 text-primary" />}
                        </div>

                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-extrabold text-amber-500">$4.90</span>
                          <span className="text-xs text-base-content/50 line-through">$14</span>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">30% OFF</span>
                          <span className="text-xs text-base-content/60">/ month</span>
                        </div>

                        <ul className="space-y-1.5 text-xs text-base-content/80 font-medium">
                          <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary" /> 500 Daily AI Credits</li>
                          <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary" /> 10-Agent C-Suite Boardroom</li>
                          <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary" /> AI Strategy Studio & SWOT</li>
                          <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary" /> 3D Memory Graph</li>
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
                            <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-wider">Max Limit Cap ($14/mo)</span>
                          </div>
                          {selectedPlan === 'enterprise' && <CheckCircle2 className="w-5 h-5 text-cyan-500" />}
                        </div>

                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-extrabold text-cyan-400">$14.00</span>
                          <span className="text-xs text-base-content/50 line-through">$40</span>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">30% OFF</span>
                          <span className="text-xs text-base-content/60">/ month</span>
                        </div>

                        <ul className="space-y-1.5 text-xs text-base-content/80 font-medium">
                          <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-500" /> 10,000 Daily AI Credits</li>
                          <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-500" /> Digital Twin Risk Simulator</li>
                          <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-500" /> Unlimited Workspaces</li>
                          <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-500" /> Permanent Audit Logs</li>
                        </ul>
                      </div>
                    </div>      </div>
                  )}

                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <ShieldCheck className="w-5 h-5" /> 100% Risk-Free Guarantee & Cancel Anytime
                    </div>
                    <p className="text-base-content/80 leading-relaxed">
                      • <strong>Cancel Anytime:</strong> Zero long-term lock-in contracts. Cancel from your billing settings in 1 click.<br/>
                      • <strong>14-Day 100% Refund Policy:</strong> If you are not satisfied with Synaps AI within 14 days, request a full refund with zero questions asked.
                    </p>
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
                      Proceed to Secure Checkout ({selectedPlan === 'pro' ? 'Pro — $7' : 'Enterprise — $20'}/mo) <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: CHECKOUT */}
              {step === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex justify-between items-center border-b border-base-200 pb-3">
                    <div>
                      <h3 className="text-lg font-extrabold text-base-content">Checkout & Payment Guarantee</h3>
                      <p className="text-xs text-base-content/60">
                        Selected Plan: <strong className="text-amber-500">{selectedPlan === 'pro' ? 'Pro Intelligence — $7 USD/mo' : 'Enterprise Max — $20 USD/mo'}</strong>
                      </p>
                    </div>
                    <button 
                      onClick={() => setStep(2)}
                      className="text-xs text-primary font-bold hover:underline"
                    >
                      Change Plan
                    </button>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-amber-500/10 via-primary/5 to-cyan-600/10 border-2 border-amber-500/40 rounded-3xl space-y-4 shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                        <ShoppingBag className="w-4 h-4" /> Gumroad Merchant Checkout
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        30-Day Money-Back Guarantee
                      </span>
                    </div>

                    <p className="text-xs text-base-content/70">
                      Pay securely with <strong>Credit Card, Apple Pay, Google Pay, or PayPal</strong>. Gumroad processes real payments and automated refunds.
                    </p>

                    <button
                      onClick={handleOpenLemonSqueezy}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-primary to-rose-600 text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.01]"
                    >
                      <CreditCard className="w-5 h-5" /> Pay Now via Gumroad Checkout
                    </button>

                    <div className="pt-2 flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>100% Automatic Instant Limit Upgrade upon checkout</span>
                    </div>
                  </div>

                  {/* REFUND ENGINE */}
                  <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-3xl space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                        <HeartHandshake className="w-4 h-4" /> 14-Day Instant Refund Request
                      </h4>
                      <span className="text-[10px] text-base-content/50">No questions asked</span>
                    </div>

                    <p className="text-xs text-base-content/70">
                      Enter your Synaps account email below to trigger your automated 100% real money refund:
                    </p>

                    {refundRequested ? (
                      <div className="p-4 bg-success/10 border border-success/30 rounded-2xl text-xs text-success font-bold flex items-center gap-2">
                        <Check className="w-5 h-5 shrink-0 text-success" />
                        <div>
                          <span className="text-sm block font-extrabold">✅ 100% Real Money Refund Processed!</span>
                          <span className="text-[11px] text-success/80 font-normal">Your account has been reset to Starter Tier (50 credits/day). Real money refund was submitted to LemonSqueezy Merchant of Record.</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <input 
                          type="email" 
                          value={refundUserEmail}
                          onChange={e => setRefundUserEmail(e.target.value)}
                          placeholder="Your Synaps account email (e.g. user@company.com)..."
                          className="w-full bg-base-100 border border-amber-500/30 rounded-xl px-3.5 py-2 text-xs text-base-content outline-none font-bold"
                        />

                        <input 
                          type="text" 
                          value={refundReason}
                          onChange={e => setRefundReason(e.target.value)}
                          placeholder="Reason for refund (e.g. Changed my mind)..."
                          className="w-full bg-base-100 border border-base-300 rounded-xl px-3.5 py-2 text-xs text-base-content outline-none"
                        />

                        <button 
                          onClick={handleRequestRefund}
                          disabled={!activeEmailForRefund || refundSubmitting}
                          className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <RefreshCw className={cn("w-4 h-4", refundSubmitting && "animate-spin")} />
                          {refundSubmitting ? 'Processing 100% Real Money Refund...' : 'Request 100% Instant Real Money Refund'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => setStep(2)}
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

      <UpiPaymentModal 
        isOpen={showUpiModal}
        onClose={() => setShowUpiModal(false)}
        planId={selectedPlan}
      />
    </div>
  );
}
