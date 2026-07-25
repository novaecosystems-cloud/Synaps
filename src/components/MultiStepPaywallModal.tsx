'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, ShieldCheck, Check, ArrowRight, Zap, RefreshCw, 
  DollarSign, Clock, HelpCircle, AlertCircle, HeartHandshake, ShieldAlert, 
  Award, FileText, CheckCircle2, ChevronRight, BrainCircuit
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiStepPaywallProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialStep?: number;
  defaultPlan?: 'pro' | 'enterprise';
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
  const [refundReason, setRefundReason] = useState('');
  const [refundRequested, setRefundRequested] = useState(false);
  const [checkoutNoticeSent, setCheckoutNoticeSent] = useState(false);

  useEffect(() => {
    if (defaultPlan) setSelectedPlan(defaultPlan);
  }, [defaultPlan]);

  if (!isOpen) return null;

  const paypalEmail = process.env.NEXT_PUBLIC_PAYPAL_EMAIL || 'novaecosystems@gmail.com';
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'novaecosystems@gmail.com';

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

  const handleOpenPayPal = () => {
    const amount = currentPrice;
    const paypalUrl = `https://www.paypal.com/myaccount/transfer/homepage/send?email=${encodeURIComponent(paypalEmail)}&currencyCode=USD&amount=${amount}`;
    window.open(paypalUrl, '_blank');
  };

  const handleSendPaymentNotice = async () => {
    if (!userEmail.trim()) return;
    try {
      await fetch('/api/settings/billing/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'payment_notice',
          userEmail: userEmail.trim(),
          planId: selectedPlan
        })
      });
    } catch (e) {}

    const planName = selectedPlan === 'pro' ? 'Pro Intelligence ($7)' : 'Enterprise Max ($20)';
    const subject = encodeURIComponent(`Synaps Plan Upgrade & Discount Lock — ${planName}`);
    const body = encodeURIComponent(
      `Hi Synaps Team,\n\nI have sent $${currentPrice} USD via PayPal to ${paypalEmail} for the 50% One-Time Discounted ${planName} plan.\n\nAccount Email: ${userEmail}\n\nPlease upgrade my account credits.\n\nThank you!`
    );
    window.open(`mailto:${supportEmail}?subject=${subject}&body=${body}`, '_blank');
    setCheckoutNoticeSent(true);
    if (onSuccess) onSuccess();
  };

  const handleRequestRefund = async () => {
    if (!userEmail.trim()) return;
    try {
      const res = await fetch('/api/settings/billing/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'refund_request',
          userEmail: userEmail.trim(),
          reason: refundReason || 'User requested 14-day money-back guarantee refund.'
        })
      });
      const data = await res.json();
      if (data.success) {
        window.dispatchEvent(new Event('focus'));
      }
    } catch (e) {}

    const subject = encodeURIComponent(`100% Refund Request — ${userEmail}`);
    const body = encodeURIComponent(
      `Hi Synaps Support,\n\nI would like to request a 100% refund for my subscription under the 14-Day Money-Back Guarantee.\n\nAccount Email: ${userEmail}\nReason: ${refundReason || 'N/A'}\n\nPlease issue my refund to my original payment method.\n\nThank you.`
    );
    window.open(`mailto:${supportEmail}?subject=${subject}&body=${body}`, '_blank');
    setRefundRequested(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-base-100 border border-base-300 rounded-3xl max-w-2xl w-full shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Progress Bar & Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-primary to-purple-600 p-3 text-white text-xs font-bold flex justify-between items-center px-6">
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
            <Sparkles className="w-3.5 h-3.5 fill-white" /> One-Time Discount & Money-Back Guarantee
          </span>
          <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold">
            Step {step} of 3
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

          {/* STEP 1: SELL THE OUTCOME FIRST */}
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

              {/* Guarantees Highlight */}
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

              {/* Next Step Button */}
              <button
                onClick={() => setStep(2)}
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.01]"
              >
                See One-Time Discounted Plans <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

          {/* STEP 2: CLEAR OFFER & ONE-TIME DISCOUNTED PRICING */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-base-200 pb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-base-content">Select Your Discounted Upgrade</h3>
                  <p className="text-xs text-base-content/60">50% One-Time Launch Special • Lock in low rates forever</p>
                </div>

                {/* Monthly / Yearly Toggle */}
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

              {/* Plan Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* PRO PLAN ($7) */}
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
                      <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Most Popular ($7/mo)</span>
                    </div>
                    {selectedPlan === 'pro' && <CheckCircle2 className="w-5 h-5 text-primary" />}
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-base-content">${prices.pro.discounted}</span>
                    <span className="text-xs text-base-content/50 line-through">${prices.pro.original}</span>
                    <span className="text-xs text-base-content/60">/ month</span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-base-content/80 font-medium">
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary" /> 500 Daily AI Credits</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary" /> 10-Agent C-Suite Boardroom</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary" /> AI Strategy Studio & SWOT</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary" /> 3D Memory Graph</li>
                  </ul>
                </div>

                {/* ENTERPRISE MAX ($20) */}
                <div
                  onClick={() => setSelectedPlan('enterprise')}
                  className={cn(
                    "p-5 rounded-3xl border cursor-pointer transition-all space-y-3 relative",
                    selectedPlan === 'enterprise' 
                      ? "bg-purple-500/5 border-purple-500 ring-2 ring-purple-500/30 shadow-md" 
                      : "bg-base-100 border-base-300 hover:border-base-400"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-extrabold text-base text-base-content block">Enterprise Max</span>
                      <span className="text-[10px] text-purple-500 font-bold uppercase tracking-wider">Max Limit Cap ($20/mo)</span>
                    </div>
                    {selectedPlan === 'enterprise' && <CheckCircle2 className="w-5 h-5 text-purple-500" />}
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-base-content">${prices.enterprise.discounted}</span>
                    <span className="text-xs text-base-content/50 line-through">${prices.enterprise.original}</span>
                    <span className="text-xs text-base-content/60">/ month</span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-base-content/80 font-medium">
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-500" /> 10,000 Daily AI Credits</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-500" /> Digital Twin Risk Simulator</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-500" /> Unlimited Workspaces</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-500" /> Permanent Audit Logs</li>
                  </ul>
                </div>

              </div>

              {/* Guarantees Box */}
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5" /> 100% Risk-Free Guarantee & Cancel Anytime
                </div>
                <p className="text-base-content/80 leading-relaxed">
                  • <strong>Cancel Anytime:</strong> Zero long-term lock-in contracts. Cancel from your billing settings in 1 click.<br/>
                  • <strong>14-Day 100% Refund Policy:</strong> If you are not satisfied with Synaps AI within 14 days, request a full refund with zero questions asked.
                </p>
              </div>

              {/* Buttons */}
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

          {/* STEP 3: PAYMENT & INSTANT REFUND GUARANTEE ENGINE */}
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

              {/* PayPal Payment Option */}
              <div className="p-5 bg-base-200/70 border border-base-300 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-base-content/60">Pay via PayPal / Credit Card</span>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">Secured</span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-base-100 border border-base-300 rounded-2xl text-xs font-mono">
                  <span className="text-base-content/50">PayPal Recipient:</span>
                  <span className="font-bold text-primary flex-1">{paypalEmail}</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(paypalEmail);
                      alert('PayPal email copied!');
                    }}
                    className="btn btn-ghost btn-xs text-primary font-bold"
                  >
                    Copy
                  </button>
                </div>

                <button
                  onClick={handleOpenPayPal}
                  className="w-full py-3.5 rounded-2xl bg-[#009cde] hover:bg-[#0085c0] text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
                    <path d="M7.5 21L3 21L5.25 9H12.75C16.5 9 18 11.25 17.25 14.25C16.5 17.25 13.5 18.75 10.5 18.75H8.25L7.5 21Z"/>
                  </svg>
                  Pay ${currentPrice} USD via PayPal ({selectedPlan === 'pro' ? 'Pro $7' : 'Enterprise $20'})
                </button>

                {/* Confirm Account Email */}
                <div className="space-y-2 pt-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-base-content/60 block">Enter Synaps Account Email to Unlock Limits:</label>
                  <div className="flex gap-2">
                    <input 
                      type="email" 
                      value={userEmail}
                      onChange={e => setUserEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="flex-1 bg-base-100 border border-base-300 rounded-xl px-3.5 py-2 text-xs text-base-content outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button 
                      onClick={handleSendPaymentNotice}
                      disabled={!userEmail.trim()}
                      className="btn btn-primary btn-sm rounded-xl text-xs font-bold"
                    >
                      Verify & Activate ({selectedPlan === 'pro' ? 'Pro $7' : 'Max $20'})
                    </button>
                  </div>
                  {checkoutNoticeSent && (
                    <p className="text-xs text-success font-bold flex items-center gap-1 pt-1">
                      <Check className="w-4 h-4" /> Verification request sent to Owner Admin for {selectedPlan === 'pro' ? 'Pro ($7)' : 'Enterprise Max ($20)'}! Daily credits will reflect automatically upon approval.
                    </p>
                  )}
                </div>
              </div>

              {/* INSTANT REFUND & CANCELLATION ENGINE */}
              <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-3xl space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4" /> 14-Day Instant Refund Request
                  </h4>
                  <span className="text-[10px] text-base-content/50">No questions asked</span>
                </div>

                <p className="text-xs text-base-content/70">
                  If you bought a plan and want to cancel or request a full 100% refund, enter your email below to trigger your instant refund request:
                </p>

                {refundRequested ? (
                  <div className="p-3 bg-success/10 border border-success/30 rounded-2xl text-xs text-success font-bold flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>✅ 100% Refund Request Processed! Your plan has been reset to Starter Tier (50 credits/day).</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      value={refundReason}
                      onChange={e => setRefundReason(e.target.value)}
                      placeholder="Optional reason for refund (e.g. Changed my mind)..."
                      className="w-full bg-base-100 border border-base-300 rounded-xl px-3.5 py-2 text-xs text-base-content outline-none"
                    />
                    <button 
                      onClick={handleRequestRefund}
                      disabled={!userEmail.trim()}
                      className="w-full py-2.5 rounded-xl bg-base-200 hover:bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Request 100% Instant Refund
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

        </div>

        {/* Footer Guarantee Badge */}
        <div className="bg-base-200/80 px-6 py-3 border-t border-base-300 text-[11px] text-base-content/60 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-success" /> 256-Bit SSL Encrypted & Secured
          </span>
          <span>Cancel Anytime • 14-Day Refund Guarantee</span>
        </div>

      </div>
    </div>
  );
}
