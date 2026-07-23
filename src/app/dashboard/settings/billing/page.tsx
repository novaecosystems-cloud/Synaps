'use client';

import React, { useState } from 'react';
import { 
  Zap, ShieldCheck, Check, Sparkles, Building2, Crown, 
  CreditCard, ArrowRight, CheckCircle2, HelpCircle, Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import PayPalCheckoutModal from '@/components/PayPalCheckoutModal';

export default function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string>('free');
  const [activeModalPlan, setActiveModalPlan] = useState<{ name: string; price: number } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Starter',
      priceMonthly: 0,
      priceYearly: 0,
      badge: 'Current Plan',
      description: 'Ideal for small teams exploring AI document intelligence.',
      icon: Zap,
      color: 'border-base-300',
      buttonVariant: 'outline' as const,
      buttonText: 'Current Tier',
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
      priceMonthly: 29,
      priceYearly: 24,
      popular: true,
      badge: 'Most Popular',
      description: 'Full multi-agent suite for growing businesses & decision makers.',
      icon: Sparkles,
      color: 'border-primary ring-2 ring-primary/30',
      buttonVariant: 'default' as const,
      buttonText: 'Upgrade with PayPal',
      features: [
        '500 AI Credits / Day',
        'Collaborative 10-Agent AI Boardroom',
        'AI Strategy Studio & SWOT Matrix',
        'Digital Twin OS (15 System Nodes)',
        '3D Corporate Memory Graph',
        'Priority LLM Processing'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise Unlimited',
      priceMonthly: 99,
      priceYearly: 79,
      badge: 'Unlimited Power',
      description: 'Dedicated multi-tenant infrastructure for large organizations.',
      icon: Crown,
      color: 'border-purple-500/40',
      buttonVariant: 'outline' as const,
      buttonText: 'Upgrade with PayPal',
      features: [
        'Unlimited Daily AI Credits',
        'Custom Fine-Tuned AI Models',
        'Unlimited Organization Workspaces',
        'Audit Log Retention (Permanent)',
        'Dedicated 24/7 Success Manager',
        'Custom SLA & On-Prem Options'
      ]
    }
  ];

  const handleOpenPayPal = (plan: typeof plans[0]) => {
    if (plan.id === 'free') return;
    const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
    setActiveModalPlan({ name: plan.name, price });
  };

  const handlePaymentSuccess = () => {
    if (activeModalPlan) {
      setSelectedPlan(activeModalPlan.name.toLowerCase());
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  return (
    <div className="w-full space-y-8 font-sans pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-base-content">Plans & Billing Management</h1>
            <p className="text-xs text-base-content/60">Upgrade your organization's AI credit limits via PayPal Digital Wallet, Cards, or Crypto.</p>
          </div>
        </div>

        {/* Monthly / Yearly Toggle */}
        <div className="flex items-center gap-2 bg-base-200 p-1.5 rounded-2xl border border-base-300 text-xs font-bold">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={cn("px-4 py-1.5 rounded-xl transition-all", billingCycle === 'monthly' ? "bg-base-100 shadow text-base-content" : "text-base-content/60")}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={cn("px-4 py-1.5 rounded-xl transition-all flex items-center gap-1", billingCycle === 'yearly' ? "bg-base-100 shadow text-base-content" : "text-base-content/60")}
          >
            Yearly <span className="px-1.5 py-0.5 rounded-full bg-success/20 text-success text-[9px] font-extrabold">Save 20%</span>
          </button>
        </div>
      </div>

      {showSuccess && (
        <div className="p-4 bg-success/10 border border-success/30 rounded-2xl text-success font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Payment Verified via PayPal! Your subscription has been updated. AI credits unlocked instantly.</span>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;

          return (
            <div
              key={plan.id}
              className={cn(
                "bg-base-100 border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative",
                plan.color
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-content text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                  ⭐ {plan.badge}
                </div>
              )}

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
                    <span className="text-3xl font-extrabold text-base-content">${price}</span>
                    <span className="text-xs font-medium text-base-content/60">/ month</span>
                  </div>
                  {billingCycle === 'yearly' && price > 0 && (
                    <span className="text-[10px] text-success font-bold">Billed annually (${price * 12}/yr)</span>
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

              <div className="pt-6 mt-6 border-t border-base-200">
                <Button
                  onClick={() => handleOpenPayPal(plan)}
                  disabled={plan.id === 'free'}
                  variant={plan.buttonVariant}
                  className="w-full rounded-2xl gap-2 font-bold py-3"
                >
                  {plan.id === 'free' ? 'Current Tier' : plan.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Options Banner */}
      <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-3">
        <h3 className="font-bold text-sm text-base-content flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-success" /> Integrated PayPal & Card Gateway
        </h3>
        <p className="text-xs text-base-content/70">
          All payments process via PayPal Checkout and deposit directly into your PayPal Digital Balance. No physical bank account is needed to accept payments.
        </p>
      </div>

      {/* PayPal Modal */}
      {activeModalPlan && (
        <PayPalCheckoutModal
          isOpen={!!activeModalPlan}
          onClose={() => setActiveModalPlan(null)}
          planName={activeModalPlan.name}
          amount={activeModalPlan.price}
          onSuccess={handlePaymentSuccess}
        />
      )}

    </div>
  );
}
