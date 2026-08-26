'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Lock, Sparkles, Zap, ArrowRight } from 'lucide-react';
import MultiStepPaywallModal from '@/components/MultiStepPaywallModal';

interface PlanRequirement {
  requiredPlan: 'PRO' | 'ENTERPRISE';
  featureName: string;
  description: string;
  minCredits: number;
}

const LOCKED_ROUTES: Record<string, PlanRequirement> = {
  '/dashboard/boardroom': {
    requiredPlan: 'PRO',
    featureName: '10-Agent C-Suite AI Boardroom',
    description: 'Simulate multi-executive deliberations (CEO, CFO, CTO, Legal, HR) debating strategy and voting in real time.',
    minCredits: 500
  },
  '/dashboard/strategy': {
    requiredPlan: 'PRO',
    featureName: 'AI Strategy Studio & SWOT Matrix',
    description: 'Generate automated corporate SWOT analysis, strategic growth roadmaps, and competitive intelligence.',
    minCredits: 500
  },
  '/dashboard/graph': {
    requiredPlan: 'PRO',
    featureName: '3D Memory Graph & Knowledge Lattice',
    description: 'Visualize connected organization knowledge, decision nodes, and executive memory in 3D spatial space.',
    minCredits: 500
  },
  '/dashboard/analytics': {
    requiredPlan: 'PRO',
    featureName: 'Executive Analytics & Performance Audit',
    description: 'Track team velocity, AI credit consumption trends, and organization decision velocity metrics.',
    minCredits: 500
  },
  '/dashboard/digital-twin': {
    requiredPlan: 'ENTERPRISE',
    featureName: 'Digital Twin Risk Simulator OS',
    description: 'Run real-time capacity stress testing, supply chain bottleneck simulations, and operational risk models.',
    minCredits: 10000
  },
  '/dashboard/simulations': {
    requiredPlan: 'ENTERPRISE',
    featureName: 'Monte Carlo Decision Simulation Engine',
    description: 'Execute 1,000+ probabilistic scenario runs with risk exposure curves and financial variance predictions.',
    minCredits: 10000
  },
  '/dashboard/risk-center': {
    requiredPlan: 'ENTERPRISE',
    featureName: 'Enterprise Risk Center & Audit Vault',
    description: 'Continuous risk compliance auditing, automated regulatory scanners, and permanent audit logs.',
    minCredits: 10000
  }
};

export default function PlanAccessGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('MEMBER');
  const [creditLimit, setCreditLimit] = useState<number>(50);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const res = await fetch('/api/settings/ai/credits');
        const data = await res.json();
        if (data.success && data.credits) {
          setUserRole((data.credits.role || 'MEMBER').toUpperCase());
          setCreditLimit(data.credits.creditLimit || 50);
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlan();
  }, [pathname]);

  // Find if current route has plan restrictions
  const gateRequirement = Object.entries(LOCKED_ROUTES).find(([route]) => 
    pathname === route || pathname.startsWith(`${route}/`)
  )?.[1];

  if (loading || !gateRequirement) {
    return <>{children}</>;
  }

  // Check access eligibility
  const isEligible = creditLimit >= gateRequirement.minCredits || 
    (gateRequirement.requiredPlan === 'PRO' && (userRole === 'ADMIN' || userRole === 'OWNER' || userRole === 'LEADER')) ||
    (gateRequirement.requiredPlan === 'ENTERPRISE' && (userRole === 'OWNER' || userRole === 'LEADER'));

  if (isEligible) {
    return <>{children}</>;
  }

  // Render Gate Wall Popup / Screen if plan level is insufficient
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="max-w-xl w-full bg-gradient-to-b from-base-100 via-base-100 to-base-200 border border-primary/20 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Glow Aura */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4 text-primary shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <span className="px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 font-extrabold text-[10px] uppercase tracking-widest inline-flex items-center gap-1.5 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {gateRequirement.requiredPlan} Plan Feature Locked
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
            {gateRequirement.featureName}
          </h2>

          <p className="text-sm text-base-content/70 mt-3 leading-relaxed">
            {gateRequirement.description}
          </p>
        </div>

        {/* Feature Comparison Box */}
        <div className="p-4 bg-base-200/80 border border-base-300 rounded-2xl text-left space-y-2 text-xs">
          <div className="flex items-center justify-between text-base-content font-bold">
            <span>Your Current Plan Limit:</span>
            <span className="text-base-content/60">{creditLimit} Daily AI Credits</span>
          </div>
          <div className="flex items-center justify-between text-primary font-extrabold">
            <span>Required for {gateRequirement.featureName}:</span>
            <span>{gateRequirement.minCredits} Daily AI Credits ({gateRequirement.requiredPlan})</span>
          </div>
        </div>

        {/* Upgrade Call to Action */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => setIsPaywallOpen(true)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-primary to-cyan-600 hover:from-amber-600 hover:to-cyan-700 text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-all"
          >
            <Zap className="w-4 h-4 fill-white animate-pulse" />
            Upgrade to {gateRequirement.requiredPlan} to Unlock
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => router.push('/dashboard/settings/billing')}
            className="text-xs font-semibold text-base-content/60 hover:text-base-content underline underline-offset-4 transition-colors"
          >
            View All Compare Plans & Billing Settings
          </button>
        </div>
      </div>

      <MultiStepPaywallModal 
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        defaultPlan={gateRequirement.requiredPlan === 'ENTERPRISE' ? 'enterprise' : 'pro'}
      />
    </div>
  );
}
