'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2, Building2, Users, Target, FileText, Sparkles } from 'lucide-react';
import {
  ALL_SECTORS, ORG_SIZES, PRIORITY_OPTIONS,
  getSectorContent, Sector, OrgSize, OrgPriority
} from '@/lib/org-adaptive-content';

const ROLES = [
  { value: 'ceo', label: 'Chief Executive Officer (CEO)' },
  { value: 'cfo', label: 'Chief Financial Officer (CFO)' },
  { value: 'coo', label: 'Chief Operating Officer (COO)' },
  { value: 'cto', label: 'Chief Technology Officer (CTO)' },
  { value: 'general-counsel', label: 'General Counsel / CLO' },
  { value: 'managing-partner', label: 'Managing Partner / Principal' },
  { value: 'vp-finance', label: 'VP Finance / Head of Finance' },
  { value: 'board-director', label: 'Board Director / Trustee' },
  { value: 'founder', label: 'Founder / Co-Founder' },
  { value: 'other', label: 'Other Executive Role' },
];

const DOCUMENT_TYPES = [
  { value: 'contracts', label: 'Vendor & Client Contracts' },
  { value: 'board-minutes', label: 'Board Minutes & Resolutions' },
  { value: 'financial-models', label: 'Financial Models & Projections' },
  { value: 'vendor-slas', label: 'Vendor & Cloud SLA Agreements' },
  { value: 'patents', label: 'Patents & IP Documents' },
  { value: 'compliance', label: 'Regulatory & Compliance Files' },
  { value: 'employment', label: 'Employment & HR Agreements' },
  { value: 'fundraising', label: 'Investment & Fundraising Documents' },
];

type Step = 1 | 2 | 3 | 4 | 5;

interface OnboardingState {
  sector: Sector | '';
  primaryRole: string;
  priorities: OrgPriority[];
  documentTypes: string[];
  companyName: string;
  size: OrgSize | '';
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [state, setState] = useState<OnboardingState>({
    sector: '',
    primaryRole: '',
    priorities: [],
    documentTypes: [],
    companyName: '',
    size: '',
  });

  const sectorContent = state.sector ? getSectorContent(state.sector) : null;

  const canProceed = (): boolean => {
    if (step === 1) return state.sector !== '';
    if (step === 2) return state.primaryRole !== '' && state.size !== '';
    if (step === 3) return state.priorities.length > 0;
    if (step === 4) return state.documentTypes.length > 0;
    if (step === 5) return state.companyName.trim().length >= 2;
    return false;
  };

  const togglePriority = (p: OrgPriority) => {
    setState((prev) => ({
      ...prev,
      priorities: prev.priorities.includes(p)
        ? prev.priorities.filter((x) => x !== p)
        : prev.priorities.length < 4
        ? [...prev.priorities, p]
        : prev.priorities,
    }));
  };

  const toggleDocType = (d: string) => {
    setState((prev) => ({
      ...prev,
      documentTypes: prev.documentTypes.includes(d)
        ? prev.documentTypes.filter((x) => x !== d)
        : [...prev.documentTypes, d],
    }));
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const sectorData = getSectorContent(state.sector);
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sector: state.sector,
          orgType: state.sector === 'legal' ? 'professional-services' : state.sector === 'biotech' ? 'biotech' : 'enterprise',
          companyName: state.companyName.trim(),
          size: state.size,
          primaryRole: state.primaryRole,
          priorities: state.priorities,
          customAgents: sectorData.agents,
          customMetrics: sectorData.metrics,
          documentTypes: state.documentTypes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save onboarding data');
      }

      // Full client redirect to ensure server layout recognizes updated organization settings
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  const steps = [
    { icon: Building2, label: 'Your Sector' },
    { icon: Users, label: 'Your Role' },
    { icon: Target, label: 'Priorities' },
    { icon: FileText, label: 'Documents' },
    { icon: Sparkles, label: 'Your Brand' },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Logo */}
      <div className="mb-8 text-center">
        <span className="font-mono font-black text-xl tracking-widest text-white uppercase">CAUSARIX™</span>
        <p className="text-zinc-500 text-sm mt-1 font-mono">Causal Decision OS Setup</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-10">
        {steps.map((s, i) => {
          const stepNum = (i + 1) as Step;
          const isActive = step === stepNum;
          const isDone = step > stepNum;
          return (
            <React.Fragment key={i}>
              <div className={`flex items-center gap-1.5 transition-all ${isActive ? 'opacity-100' : isDone ? 'opacity-70' : 'opacity-30'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all
                  ${isActive ? 'bg-indigo-500 border-indigo-400 text-white' : isDone ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-zinc-700 text-zinc-500'}`}>
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                </div>
                <span className={`text-xs font-mono hidden sm:block ${isActive ? 'text-white' : 'text-zinc-500'}`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-6 h-px ${step > stepNum ? 'bg-emerald-500' : 'bg-zinc-800'} transition-all`} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Cards */}
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {/* Step 1: Sector */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold">What sector is your organisation in?</h1>
                <p className="text-zinc-400 text-sm">Causarix will customise every dashboard, agent, and metric for your industry.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ALL_SECTORS.filter(s => s.value !== 'default').map((s) => (
                  <button key={s.value} onClick={() => setState(p => ({ ...p, sector: s.value }))}
                    className={`p-4 rounded-xl border text-left text-sm font-mono transition-all
                      ${state.sector === s.value
                        ? 'bg-indigo-500/20 border-indigo-500 text-white'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-600'}`}>
                    {s.label}
                  </button>
                ))}
                <button onClick={() => setState(p => ({ ...p, sector: 'default' }))}
                  className={`p-4 rounded-xl border text-left text-sm font-mono transition-all
                    ${state.sector === 'default'
                      ? 'bg-indigo-500/20 border-indigo-500 text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-600'}`}>
                  Other / General Enterprise
                </button>
              </div>
              {sectorContent && (
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 font-mono">
                  <span className="text-indigo-400 font-bold">Preview: </span>
                  Your boardroom agents will be: <span className="text-white">{sectorContent.agents.slice(0, 3).join(' · ')}</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Role & Size */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold">What is your primary role?</h1>
                <p className="text-zinc-400 text-sm">This personalises your mission control and executive briefing view.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ROLES.map((r) => (
                  <button key={r.value} onClick={() => setState(p => ({ ...p, primaryRole: r.value }))}
                    className={`p-3 rounded-xl border text-left text-sm font-mono transition-all
                      ${state.primaryRole === r.value
                        ? 'bg-indigo-500/20 border-indigo-500 text-white'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-600'}`}>
                    {r.label}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-sm text-zinc-400 font-mono">Organisation size:</p>
                <div className="flex flex-wrap gap-2">
                  {ORG_SIZES.map((s) => (
                    <button key={s.value} onClick={() => setState(p => ({ ...p, size: s.value }))}
                      className={`px-4 py-2 rounded-full border text-xs font-mono transition-all
                        ${state.size === s.value
                          ? 'bg-indigo-500/20 border-indigo-500 text-white'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Priorities */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold">What are your top priorities?</h1>
                <p className="text-zinc-400 text-sm">Select up to 4 — your simulations, alerts, and boardroom quorum will focus here.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRIORITY_OPTIONS.map((p) => {
                  const isSelected = state.priorities.includes(p.value);
                  const isDisabled = !isSelected && state.priorities.length >= 4;
                  return (
                    <button key={p.value} onClick={() => togglePriority(p.value)} disabled={isDisabled}
                      className={`p-3 rounded-xl border text-left text-sm font-mono transition-all
                        ${isSelected ? 'bg-indigo-500/20 border-indigo-500 text-white'
                          : isDisabled ? 'opacity-40 bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-600'}`}>
                      {isSelected && <span className="text-indigo-400 mr-2">✓</span>}
                      {p.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-center text-xs text-zinc-600 font-mono">{state.priorities.length}/4 selected</p>
            </motion.div>
          )}

          {/* Step 4: Document Types */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold">What documents will you audit?</h1>
                <p className="text-zinc-400 text-sm">Causarix will pre-configure your document analysis models and extraction schemas.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DOCUMENT_TYPES.map((d) => {
                  const isSelected = state.documentTypes.includes(d.value);
                  return (
                    <button key={d.value} onClick={() => toggleDocType(d.value)}
                      className={`p-3 rounded-xl border text-left text-sm font-mono transition-all
                        ${isSelected ? 'bg-emerald-500/20 border-emerald-500 text-white'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-600'}`}>
                      {isSelected && <span className="text-emerald-400 mr-2">✓</span>}
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 5: Company Name */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold">What should we call your organisation?</h1>
                <p className="text-zinc-400 text-sm">This name will appear in all boardroom PDFs, briefings, and reports.</p>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  value={state.companyName}
                  onChange={(e) => setState(p => ({ ...p, companyName: e.target.value }))}
                  placeholder="e.g. Helix Labs Inc. · Meridian Capital · Clarke & Partners LLP"
                  className="w-full px-5 py-4 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-mono text-sm placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-all"
                  onKeyDown={(e) => { if (e.key === 'Enter' && canProceed()) handleSubmit(); }}
                  autoFocus
                />
                {/* Summary preview */}
                {state.companyName.trim().length >= 2 && sectorContent && (
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs font-mono">
                    <p className="text-zinc-500 uppercase tracking-wider font-bold">Your Causarix Setup Preview</p>
                    <div className="grid grid-cols-2 gap-2 text-zinc-300">
                      <span>🏢 Org Name: <span className="text-white">{state.companyName}</span></span>
                      <span>🏷️ Sector: <span className="text-indigo-400">{sectorContent.label}</span></span>
                      <span>📊 Primary Metric: <span className="text-emerald-400">{sectorContent.metrics[0]}</span></span>
                      <span>🤖 Top Agent: <span className="text-white">{sectorContent.agents[0]}</span></span>
                    </div>
                  </div>
                )}
              </div>
              {error && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-400 text-sm font-mono">
                  {error}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1) as Step)}
            disabled={step === 1}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 font-mono text-sm hover:border-zinc-600 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {step < 5 ? (
            <button
              onClick={() => setStep((s) => Math.min(5, s + 1) as Step)}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <><span className="animate-spin">⚙</span> Setting up your OS...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Launch My Causarix OS</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
