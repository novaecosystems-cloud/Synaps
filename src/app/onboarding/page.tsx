'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles, Scale, TrendingUp, Users, Check, Zap } from 'lucide-react';
import {
  ALL_SECTORS,
  getSectorContent,
  Sector,
} from '@/lib/org-adaptive-content';

const springTransition = {
  type: 'spring',
  stiffness: 360,
  damping: 32,
} as const;

const ROLES = [
  { value: 'ceo', label: 'Chief Executive Officer (CEO)' },
  { value: 'general-counsel', label: 'General Counsel / Legal' },
  { value: 'cfo', label: 'Chief Financial Officer (CFO)' },
  { value: 'founder', label: 'Founder / Managing Partner' },
  { value: 'coo', label: 'Chief Operating Officer (COO)' },
  { value: 'other', label: 'Executive Leader' },
];

const FAST_START_SCENARIOS = [
  {
    id: 'contract',
    icon: Scale,
    title: 'Contract Liability & Breach Risk',
    tag: 'Delaware DGCL § 141 Safe Harbor',
    description: 'Stress-test indemnities, uncapped liabilities, and statutory safe harbors before signing.',
    badgeClass: 'border-amber-500/30 text-amber-500 bg-amber-500/10 dark:bg-amber-500/20',
  },
  {
    id: 'runway',
    icon: TrendingUp,
    title: 'Runway Shock & Customer Churn',
    tag: 'SCM Monte Carlo Simulation',
    description: 'Simulate financial ruin probabilities, cash runway burn, and EBITDA drag with 0.00% math drift.',
    badgeClass: 'border-cyan-500/30 text-cyan-500 bg-cyan-500/10 dark:bg-cyan-500/20',
  },
  {
    id: 'boardroom',
    icon: Users,
    title: 'Boardroom Quorum & M&A Diligence',
    tag: '10-Agent Dialectic Deliberation',
    description: 'Red-team acquisitions and capital pivots with an autonomous adversarial executive bench.',
    badgeClass: 'border-indigo-500/30 text-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/20',
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState<Sector>('legal');
  const [primaryRole, setPrimaryRole] = useState('general-counsel');
  const [selectedScenario, setSelectedScenario] = useState('contract');
  const [customDilemma, setCustomDilemma] = useState('');

  const handleSkipToDemo = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('causarix_onboarding_completed', 'true');
      localStorage.setItem('causarix_user_onboarded_permanently', 'true');
      localStorage.setItem('causarix_dashboard_intro_completed_v2', 'true');
      localStorage.setItem('causarix_mobile_card_onboarding_v3', 'true');
      if (typeof document !== 'undefined' && !document.cookie.includes('synaps-session=')) {
        document.cookie = 'synaps-session=DEMO_SESSION_demo-user; path=/; max-age=2592000; SameSite=Lax';
      }
      // Direct browser navigation to /demo which provisions the session cookie and redirects to /dashboard in <2s
      window.location.href = '/demo?redirect=/dashboard';
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const sectorData = getSectorContent(sector);
      const cleanName = companyName.trim() || 'Apex Global Enterprise';

      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sector,
          orgType: sector === 'legal' ? 'professional-services' : sector === 'biotech' ? 'biotech' : 'enterprise',
          companyName: cleanName,
          size: '51-200',
          primaryRole,
          priorities: ['contract-risk', 'board-governance'],
          customAgents: sectorData.agents,
          customMetrics: sectorData.metrics,
          documentTypes: ['contracts', 'board-minutes'],
          initialScenario: selectedScenario,
          customDilemma: customDilemma.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to initialize organization workspace');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('causarix_onboarding_completed', 'true');
        localStorage.setItem('causarix_user_onboarded_permanently', 'true');
        localStorage.setItem('causarix_dashboard_intro_completed_v2', 'true');
        localStorage.setItem('causarix_mobile_card_onboarding_v3', 'true');
        localStorage.setItem('causarix_company_name', cleanName);
        localStorage.setItem('causarix_primary_role', primaryRole);
        localStorage.setItem('causarix_sector', sector);
        localStorage.setItem('causarix_initial_scenario', selectedScenario);
        if (customDilemma.trim()) {
          localStorage.setItem('causarix_custom_dilemma', customDilemma.trim());
        }
        if (typeof document !== 'undefined' && !document.cookie.includes('synaps-session=')) {
          document.cookie = 'synaps-session=DEMO_SESSION_sovereign-user; path=/; max-age=2592000; SameSite=Lax';
        }
      }

      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Unable to complete setup. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 dark:bg-[#07090E] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-4 sm:p-8 selection:bg-blue-500 selection:text-white relative">
      
      {/* Specular Ambient Radial Lighting (Emil Kowalski Apple aesthetic) */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* Header & Brand Navigation */}
      <div className="w-full max-w-xl flex items-center justify-between mb-6 z-10 px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-black text-sm shadow-md">
            C
          </div>
          <span className="font-semibold text-base sm:text-lg tracking-[-0.02em]">Causarix</span>
        </div>

        {/* 1-Click "Skip to Live Demo" Unmistakable Bypass */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={springTransition}
          onClick={handleSkipToDemo}
          className="group px-3 py-1.5 rounded-full bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-md text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 text-blue-500 group-hover:animate-pulse" />
          <span>Skip to Live Demo</span>
          <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </motion.button>
      </div>

      {/* Main Glassmorphic Setup Card */}
      <div className="w-full max-w-xl backdrop-blur-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 sm:p-10 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.4)] relative z-10">
        
        {/* Step Indicator */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 flex flex-col gap-1.5">
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-blue-600 dark:bg-blue-500' : 'bg-slate-200/80 dark:bg-slate-800/80'}`} />
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${step === 1 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
              1. Organization
            </span>
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-blue-600 dark:bg-blue-500' : 'bg-slate-200/80 dark:bg-slate-800/80'}`} />
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${step === 2 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
              2. Strategic Focus
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={springTransition}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-slate-900 dark:text-white">
                  Welcome to Causarix
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Set up your executive decision operating system in two quick steps.
                </p>
              </div>

              {/* Organization Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Technologies Inc."
                  autoFocus
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/80 transition-all"
                />
              </div>

              {/* Primary Domain (Sector) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide">
                  Primary Domain
                </label>
                <div className="relative">
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value as Sector)}
                    className="w-full appearance-none px-4 py-3 bg-white/60 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/80 transition-all cursor-pointer pr-10"
                  >
                    {ALL_SECTORS.map((s) => (
                      <option key={s.value} value={s.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    ▼
                  </div>
                </div>
              </div>

              {/* Leadership Role */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide">
                  Leadership Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((r) => {
                    const isSelected = primaryRole === r.value;
                    return (
                      <motion.button
                        key={r.value}
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        transition={springTransition}
                        onClick={() => setPrimaryRole(r.value)}
                        className={`p-3 rounded-2xl border text-left text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50/90 dark:bg-blue-950/50 border-blue-500 text-blue-700 dark:text-blue-300 shadow-sm ring-1 ring-blue-500/20'
                            : 'bg-white/40 dark:bg-slate-950/30 border-slate-200/70 dark:border-slate-800/70 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <span className="truncate pr-1">{r.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springTransition}
                  onClick={() => setStep(2)}
                  className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <span>Continue to Strategic Focus</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={springTransition}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-slate-900 dark:text-white">
                  Instant Strategic Focus
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Select an immediate strategic dilemma to pre-load into your cockpit, or formulate your own.
                </p>
              </div>

              {/* Fast-Start Scenario Cards */}
              <div className="space-y-2.5">
                {FAST_START_SCENARIOS.map((sc) => {
                  const Icon = sc.icon;
                  const isSelected = selectedScenario === sc.id && !customDilemma;
                  return (
                    <motion.button
                      key={sc.id}
                      type="button"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      transition={springTransition}
                      onClick={() => {
                        setSelectedScenario(sc.id);
                        setCustomDilemma('');
                      }}
                      className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500/80 shadow-sm ring-1 ring-blue-500/30'
                          : 'bg-white/50 dark:bg-slate-950/30 border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl border shrink-0 ${sc.badgeClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                            {sc.title}
                          </h4>
                          <span className="text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 shrink-0">
                            {sc.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {sc.description}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Custom Problem Option */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide">
                  Or formulate your custom strategic dilemma (optional)
                </label>
                <textarea
                  rows={2}
                  value={customDilemma}
                  onChange={(e) => setCustomDilemma(e.target.value)}
                  placeholder="e.g. Enterprise customer demanding SLA renegotiation and penalty waiver under threat of contract termination..."
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/80 transition-all resize-none"
                />
              </div>

              {error && (
                <div className="p-3.5 rounded-2xl bg-red-50/90 dark:bg-red-950/40 border border-red-200/80 dark:border-red-800/80 text-xs font-medium text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  transition={springTransition}
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  className="py-3.5 px-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springTransition}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Provisioning Operating System...</span>
                    </>
                  ) : (
                    <>
                      <span>Enter Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Trust & Statutory Signals */}
      <div className="mt-8 text-center text-[11px] font-medium text-slate-400 dark:text-slate-600 tracking-wide">
        Delaware DGCL § 141 Safe Harbor · 0.00% Math Drift Engine · Enterprise RLS Protected
      </div>
    </div>
  );
}
