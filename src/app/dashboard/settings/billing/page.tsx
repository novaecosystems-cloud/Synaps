'use client';

import React, { useState, useEffect } from 'react';
import { 
  Zap, ShieldCheck, Check, Sparkles, Building2, Crown, 
  CreditCard, ArrowRight, CheckCircle2, HelpCircle, Layers, Globe, RefreshCw, HeartHandshake, Lock, Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import MultiStepPaywallModal from '@/components/MultiStepPaywallModal';
import CancellationRetentionModal from '@/components/CancellationRetentionModal';

type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR';

interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rates: {
    free: number;
    proWeekly: number;
    proMonthly: number;
    proYearly: number;
    enterpriseWeekly: number;
    enterpriseMonthly: number;
    enterpriseYearly: number;
  };
}

const CURRENCIES: CurrencyConfig[] = [
  {
    code: 'USD',
    symbol: '$',
    label: 'USD ($)',
    rates: { free: 0, proWeekly: 1.99, proMonthly: 7, proYearly: 5, enterpriseWeekly: 4.99, enterpriseMonthly: 20, enterpriseYearly: 16 }
  },
  {
    code: 'EUR',
    symbol: '€',
    label: 'EUR (€)',
    rates: { free: 0, proWeekly: 1.80, proMonthly: 6.5, proYearly: 4.5, enterpriseWeekly: 4.50, enterpriseMonthly: 18.5, enterpriseYearly: 15 }
  },
  {
    code: 'GBP',
    symbol: '£',
    label: 'GBP (£)',
    rates: { free: 0, proWeekly: 1.50, proMonthly: 5.5, proYearly: 4, enterpriseWeekly: 3.99, enterpriseMonthly: 16, enterpriseYearly: 13 }
  },
  {
    code: 'INR',
    symbol: '₹',
    label: 'INR (₹)',
    rates: { free: 0, proWeekly: 169, proMonthly: 599, proYearly: 449, enterpriseWeekly: 419, enterpriseMonthly: 1699, enterpriseYearly: 1399 }
  }
];

export default function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [activePlanId, setActivePlanId] = useState<string>('free');
  const [selectedPaywallPlan, setSelectedPaywallPlan] = useState<'pro' | 'enterprise'>('pro');
  const [userRole, setUserRole] = useState<string>('MEMBER');
  const [userCredits, setUserCredits] = useState<{ remaining: number; limit: number } | null>(null);
  const [showMultiStepPaywall, setShowMultiStepPaywall] = useState(false);
  const [showRetentionModal, setShowRetentionModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const activeCurrency = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  const fetchUserCredits = async () => {
    try {
      const res = await fetch('/api/settings/ai/credits');
      const data = await res.json();
      if (data.success && data.credits) {
        const role = (data.credits.role || 'MEMBER').toUpperCase();
        setUserRole(role);
        setUserCredits({ remaining: data.credits.remaining, limit: data.credits.creditLimit });
        
        if (role === 'ADMIN') setActivePlanId('pro');
        else if (role === 'OWNER' || role === 'LEADER') setActivePlanId('enterprise');
        else setActivePlanId('free');
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchUserCredits();
    window.addEventListener('focus', fetchUserCredits);
    return () => window.removeEventListener('focus', fetchUserCredits);
  }, []);

  const plans = [
    {
      id: 'free',
      name: 'Starter',
      priceWeekly: activeCurrency.rates.free,
      priceMonthly: activeCurrency.rates.free,
      priceYearly: activeCurrency.rates.free,
      badge: 'Free Tier',
      description: 'Ideal for testing AI document search and baseline queries.',
      icon: Zap,
      color: 'border-base-300',
      features: [
        '50 AI Credits / Day',
        '1 Organization Workspace',
        'AI Chat Assistant & RAG Search',
        'Basic Risk Scanner',
        'Standard Support'
      ]
    },
    {
      id: 'pro',
      name: 'Pro Intelligence',
      priceWeekly: activeCurrency.rates.proWeekly,
      priceMonthly: activeCurrency.rates.proMonthly,
      priceYearly: activeCurrency.rates.proYearly,
      popular: true,
      badge: 'Lowest Weekly Entry',
      description: 'Full multi-agent suite & 10-Agent AI Boardroom.',
      icon: Sparkles,
      color: 'border-primary ring-2 ring-primary/30 shadow-md',
      features: [
        '500 AI Credits / Day (Immediate Upgrade)',
        'Collaborative 10-Agent AI Boardroom',
        'AI Strategy Studio & SWOT Blueprint',
        'Digital Twin OS (15 System Nodes)',
        '3D Corporate Memory Graph',
        '14-Day 100% Refund Guarantee'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise Max',
      priceWeekly: activeCurrency.rates.enterpriseWeekly,
      priceMonthly: activeCurrency.rates.enterpriseMonthly,
      priceYearly: activeCurrency.rates.enterpriseYearly,
      badge: 'Max Limit Cap',
      description: 'Unlimited AI capabilities for power users & large teams.',
      icon: Crown,
      color: 'border-purple-500/50 ring-2 ring-purple-500/20 shadow-md',
      features: [
        '10,000 AI Credits / Day (Unlimited)',
        'Custom Fine-Tuned AI Models',
        'Unlimited Organization Workspaces',
        'Audit Log Retention (Permanent)',
        'Dedicated 24/7 Priority Support',
        '99.9% Uptime SLA Guarantee'
      ]
    }
  ];

  const handleOpenPaywall = (planId: string) => {
    if (planId === activePlanId || planId === 'free') return;
    setSelectedPaywallPlan(planId === 'enterprise' ? 'enterprise' : 'pro');
    setShowMultiStepPaywall(true);
  };

  const handlePaymentSuccess = () => {
    fetchUserCredits();
    setShowSuccess(true);
    setShowMultiStepPaywall(false);
    setTimeout(() => setShowSuccess(false), 6000);
  };

  const getPlanDisplayName = () => {
    if (activePlanId === 'enterprise') return 'Enterprise Max ($4.99/wk or $20/mo — 10,000 Credits)';
    if (activePlanId === 'pro') return 'Pro Intelligence ($1.99/wk or $7/mo — 500 Credits)';
    return 'Starter (Free Tier — 50 Credits)';
  };

  return (
    <div className="w-full space-y-8 font-sans pb-16">
      
      {/* Header & Active Plan Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-base-content">Plans & Subscription Management</h1>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-extrabold text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active: {getPlanDisplayName()}
              </span>
            </div>
            <p className="text-xs text-base-content/60 mt-0.5">
              Daily AI Limit: <strong>{userCredits?.limit || 50} Credits/Day</strong> ({userCredits?.remaining ?? 50} remaining today). 14-day 100% refund guarantee.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {activePlanId !== 'enterprise' && (
            <Button 
              onClick={() => {
                setSelectedPaywallPlan(activePlanId === 'pro' ? 'enterprise' : 'pro');
                setShowMultiStepPaywall(true);
              }}
              className="rounded-2xl gap-2 font-bold py-2.5 bg-amber-500 hover:bg-amber-600 text-black shadow-md"
            >
              <Sparkles className="w-4 h-4 fill-black" /> Launch Multi-Step Paywall
            </Button>
          )}

          {/* Currency Selector */}
          <div className="flex items-center gap-1.5 bg-base-200 px-3 py-1.5 rounded-2xl border border-base-300 text-xs font-bold">
            <Globe className="w-3.5 h-3.5 text-primary" />
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="bg-transparent outline-none cursor-pointer font-bold text-base-content"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code} className="bg-base-100">{c.label}</option>
              ))}
            </select>
          </div>

          {/* Weekly / Monthly / Yearly Toggle */}
          <div className="flex items-center gap-1 bg-base-200 p-1 rounded-2xl border border-base-300 text-xs font-bold">
            <button
              onClick={() => setBillingCycle('weekly')}
              className={cn("px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1", billingCycle === 'weekly' ? "bg-primary text-primary-content shadow font-bold" : "text-base-content/60")}
            >
              Weekly <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-extrabold">$1.99</span>
            </button>
            <button
              onClick={() => setBillingCycle('monthly')}
              className={cn("px-3.5 py-1.5 rounded-xl transition-all", billingCycle === 'monthly' ? "bg-base-100 shadow text-base-content" : "text-base-content/60")}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={cn("px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1", billingCycle === 'yearly' ? "bg-base-100 shadow text-base-content" : "text-base-content/60")}
            >
              Yearly <span className="px-1.5 py-0.5 rounded-full bg-success/20 text-success text-[9px] font-extrabold">-50% OFF</span>
            </button>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="p-5 bg-success/10 border border-success/30 rounded-2xl text-success font-bold text-xs flex items-center gap-3 shadow-md animate-bounce">
          <CheckCircle2 className="w-6 h-6 shrink-0" />
          <div>
            <span className="text-sm block">Payment Verified & Limits Upgraded Immediately!</span>
            <span className="text-[11px] font-normal text-success/80">Your daily AI credit limit is now active across your workspace.</span>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const price = billingCycle === 'weekly' ? plan.priceWeekly : billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
          const periodLabel = billingCycle === 'weekly' ? 'per week' : billingCycle === 'yearly' ? 'per month, billed annually' : 'per month';
          const isCurrent = activePlanId === plan.id;

          return (
            <div
              key={plan.id}
              className={cn(
                "bg-base-100 border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative",
                isCurrent ? "ring-2 ring-emerald-500 bg-emerald-500/5 border-emerald-500/50" : plan.color
              )}
            >
              {isCurrent ? (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Current Active Plan
                </div>
              ) : plan.popular ? (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                  🔥 {plan.badge}
                </div>
              ) : null}

              <div className="space-y-4">
                <div className="flex justify-between items-start pt-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-base-200 border border-base-300 flex items-center justify-center text-primary">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-base-content">{plan.name}</h3>
                      <span className="text-[11px] text-base-content/50 font-medium block">{plan.badge}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-base-content/70 leading-relaxed font-medium">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="py-2 border-y border-base-200">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-base-content">{activeCurrency.symbol}{price}</span>
                    <span className="text-xs font-medium text-base-content/60">{periodLabel} ({activeCurrency.code})</span>
                  </div>
                  {billingCycle === 'yearly' && price > 0 && (
                    <span className="text-[10px] text-success font-bold">Billed annually ({activeCurrency.symbol}{price * 12}/yr)</span>
                  )}
                  {billingCycle === 'weekly' && price > 0 && (
                    <span className="text-[10px] text-emerald-500 font-bold">Billed weekly ({activeCurrency.symbol}{price}/week — cancel anytime)</span>
                  )}
                </div>

                {/* Feature List */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 block">Included Features:</span>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-base-content/90 font-medium">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-base-200 space-y-2">
                {plan.id === 'free' ? (
                  <button
                    disabled
                    className={cn(
                      "w-full rounded-2xl py-3.5 px-4 font-extrabold text-xs uppercase tracking-wider text-center border transition-all",
                      isCurrent 
                        ? "border-emerald-500 text-emerald-400 bg-emerald-500/10 cursor-default"
                        : "border-base-300 text-base-content/50 bg-base-200/50 cursor-not-allowed"
                    )}
                  >
                    {isCurrent ? '✓ Current Active Plan' : 'Free Starter Tier'}
                  </button>
                ) : plan.id === 'pro' ? (
                  <button
                    onClick={() => handleOpenPaywall('pro')}
                    disabled={isCurrent || activePlanId === 'enterprise'}
                    className={cn(
                      "w-full rounded-2xl py-3.5 px-4 font-extrabold text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 shadow-md",
                      isCurrent || activePlanId === 'enterprise'
                        ? "border border-emerald-500/60 text-emerald-400 bg-emerald-500/10 cursor-not-allowed opacity-90"
                        : "bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-[1.02]"
                    )}
                  >
                    {isCurrent 
                      ? '✓ Current Active Plan (Pro)' 
                      : activePlanId === 'enterprise' 
                        ? '✓ Included in Enterprise Tier' 
                        : `Upgrade to Pro (${activeCurrency.symbol}${price})`}
                    {!isCurrent && activePlanId !== 'enterprise' && <ArrowRight className="w-4 h-4 shrink-0" />}
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenPaywall('enterprise')}
                    disabled={isCurrent}
                    className={cn(
                      "w-full rounded-2xl py-3.5 px-4 font-extrabold text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 shadow-lg",
                      isCurrent
                        ? "border border-emerald-500/60 text-emerald-400 bg-emerald-500/10 cursor-not-allowed opacity-90"
                        : "bg-gradient-to-r from-purple-600 via-primary to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white hover:scale-[1.02]"
                    )}
                  >
                    {isCurrent ? '✓ Current Active Plan (Enterprise Max)' : `Upgrade to Enterprise (${activeCurrency.symbol}${price})`}
                    {!isCurrent && <ArrowRight className="w-4 h-4 shrink-0" />}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Refund & Cancel Guarantee Banner */}
      <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-base-content">30-Day Risk-Free Money Back Guarantee</h3>
              <p className="text-xs text-base-content/60">If Synaps AI does not deliver value for your executive team within 30 days, claim a 100% refund or pause your plan anytime.</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowRetentionModal(true)}
            className="text-[11px] text-base-content/40 hover:text-base-content/70 transition-all underline font-medium shrink-0 pt-1 sm:pt-0"
          >
            Manage / Cancel Subscription
          </button>
        </div>
      </div>

      {/* Multi-Step Paywall Modal */}
      {showMultiStepPaywall && (
        <MultiStepPaywallModal
          isOpen={showMultiStepPaywall}
          defaultPlan={selectedPaywallPlan}
          onClose={() => setShowMultiStepPaywall(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Retention & Cancellation Modal */}
      {showRetentionModal && (
        <CancellationRetentionModal
          isOpen={showRetentionModal}
          onClose={() => setShowRetentionModal(false)}
          onConfirmCancel={async (reason) => {
            console.log('Cancellation logged:', reason);
          }}
        />
      )}

    </div>
  );
}
