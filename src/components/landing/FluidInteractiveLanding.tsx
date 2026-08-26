'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, ArrowUpRight, Search, GitBranch, Scale, Cpu, ChevronDown, CheckCircle2, Sparkles, Volume2, VolumeX, Zap, Copy, Check } from 'lucide-react';
import SignInModal from '@/components/SignInModal';
import Link from 'next/link';
import Lenis from 'lenis';
import { useAuth } from '@/context/AuthContext';
import { saveGuestSimulationState } from '@/lib/guest-simulation-store';

import { HoverExpand, HoverExpandItem } from '@/components/ui/HoverExpand';
import { FluidCanvas } from '@/components/ui/FluidCanvas';
import { CustomCursor } from '@/components/ui/CustomCursor';

gsap.registerPlugin(ScrollTrigger);

// ─── SAMPLE INTERACTIVE SANDBOX PROMPTS ────────────────────────────────────────
const SAMPLE_PROMPTS = [
  'Audit indemnification caps across our 2026 enterprise SaaS vendor contracts.',
  'Find every reference to DPDP Act data residency compliance in Q3 reports.',
  'Compare liability thresholds in vendor agreements between 2025 and 2026.',
  'What key risks should executive management review before signing the Supply Agreement?',
  'Draft a 1-page executive summary of the M&A data room contracts.',
];

// ─── 4K DASHBOARD SCREENSHOT GALLERY ITEMS ────────────────────────────────────
const DASHBOARD_4K_ITEMS: HoverExpandItem[] = [
  {
    label: "Executive Operational Briefing",
    sublabel: "AI COO CONSOLE",
    image: "/upscaled/01_Executive_Operational_Briefing_4K.png",
    imageAlt: "Executive Operational Briefing 4K Dashboard",
    description: "Continuous C-suite operational monitoring, compliance audit & financial forecast synthesis.",
  },
  {
    label: "Boardroom Simulation Engine",
    sublabel: "DIGITAL TWINS",
    image: "/upscaled/03_Boardroom_Simulation_Engine_4K.png",
    imageAlt: "Boardroom Simulation Engine 4K Dashboard",
    description: "Simulate strategic enterprise decisions across CEO, CFO, CTO, and Legal C-suite digital twins.",
  },
  {
    label: "Chief of Staff Action Plan",
    sublabel: "EXECUTIVE BRIEFING",
    image: "/upscaled/04_Chief_Of_Staff_Briefing_4K.png",
    imageAlt: "Chief Of Staff Briefing 4K Dashboard",
    description: "Proactive priority action items, risk scores, and weekly strategic synthesis sorted by urgency.",
  },
  {
    label: "Launch Playbook & Strategy Studio",
    sublabel: "PLAYBOOK ENGINE",
    image: "/upscaled/05_Launch_Playbook_Framework_4K.png",
    imageAlt: "Launch Playbook Framework 4K Dashboard",
    description: "Find your perfect launch playbook based on budget, speed, and distribution strength.",
  },
  {
    label: "Enterprise Memory AI Assistant",
    sublabel: "MEMORY GRAPH",
    image: "/upscaled/06_Enterprise_Memory_AI_Assistant_4K.png",
    imageAlt: "Enterprise Memory AI Assistant 4K Dashboard",
    description: "Query organizational memory graphs to trace approval histories and historical precedent.",
  },
  {
    label: "AI Prediction & Risk Center",
    sublabel: "RISK SCANNER",
    image: "/upscaled/07_AI_Prediction_Risk_Center_4K.png",
    imageAlt: "AI Prediction Risk Center 4K Dashboard",
    description: "Automated vulnerability scanner indexing missing signatures, policy conflicts, and financial risks.",
  },
];

// ─── MAIN FLUID INTERACTIVE LANDING PAGE COMPONENT ───────────────────────────
export default function FluidInteractiveLanding() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const signInPrompt = {
    title: 'Save Simulation Results',
    subtitle: 'Sign in to save your simulation results and unlock 50 daily boardroom runs',
  };
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedPromptIdx, setSelectedPromptIdx] = useState(0);
  const [typedPrompt, setTypedPrompt] = useState(SAMPLE_PROMPTS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Auto-typing animation for prompt sandbox
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const targetText = SAMPLE_PROMPTS[selectedPromptIdx];
    let charIndex = 0;
    setTypedPrompt('');

    const typeChar = () => {
      if (charIndex <= targetText.length) {
        setTypedPrompt(targetText.slice(0, charIndex));
        charIndex++;
        timeout = setTimeout(typeChar, 30);
      }
    };

    typeChar();

    return () => clearTimeout(timeout);
  }, [selectedPromptIdx]);

  // GSAP ScrollTrigger Animations (HeyParker smooth float & reveal)
  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Reveal elements on scroll
      const reveals = gsap.utils.toArray<HTMLElement>('[data-parker-reveal]');
      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 35, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(typedPrompt);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleRunPrompt = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      saveGuestSimulationState('simulation', {
        decisionType: 'Enterprise Contract Audit',
        decisionDetails: typedPrompt,
        simulationResult: {
          decisionType: 'Enterprise Contract Audit',
          decisionDetails: typedPrompt,
          output: 'Found 3 key contract discrepancies across 142 enterprise PDFs. Indemnification liability cap is $2,500,000 USD (Section 14.2).'
        }
      });
    }, 1800);
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#0c0c0e] text-[#f4f4f6] font-sans selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden antialiased">
      {/* ── WEBGEL FLUID CANVAS & CUSTOM FOLLOW CURSOR (incredibles.dev style) ── */}
      <FluidCanvas />
      <CustomCursor />

      {/* ── HEYPARKER STYLE FLOATING HEADER ──────────────────────────────────── */}
      <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl px-6 py-3.5 rounded-full backdrop-blur-xl bg-[#141418]/80 border border-white/10 shadow-2xl flex items-center justify-between transition-all">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 p-[1px] shadow-[0_0_20px_rgba(255,122,0,0.4)]">
            <div className="w-full h-full rounded-full bg-[#0c0c0e] flex items-center justify-center font-mono font-bold text-amber-400 text-sm">
              S
            </div>
          </div>
          <span className="font-mono text-sm font-extrabold tracking-wider text-white">SYNAPS</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-mono text-xs text-neutral-400 tracking-wider">
          <a href="#features" className="hover:text-white transition-colors">CAPABILITIES</a>
          <a href="#demo" className="hover:text-white transition-colors">DEMO SANDBOX</a>
          <a href="#intelligence" className="hover:text-white transition-colors">EVIDENCE ENGINE</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/chat"
            className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs text-neutral-300 hover:text-white px-3.5 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-all"
          >
            <span>Open App</span>
            <ArrowUpRight className="w-3 h-3 text-amber-400" />
          </Link>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,122,0,0.35)] transition-all flex items-center gap-1.5"
          >
            <span>Try Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ── HEYPARKER HERO SECTION — CINEMATIC PILL & PROMPT SANDBOX ─────────── */}
      <section ref={heroRef} className="pt-40 pb-24 px-6 sm:px-12 max-w-6xl mx-auto text-center flex flex-col items-center relative">
        {/* Floating Live Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 font-mono text-xs uppercase tracking-widest mb-8 shadow-[0_0_30px_rgba(255,122,0,0.15)]">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>MEET SYNAPS 3.4 — YOUR ENTERPRISE EVIDENCE BRAIN</span>
        </div>

        {/* Oversized Headline */}
        <h1 className="font-mono text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.05] max-w-4xl mb-6">
          Document Intelligence <br />
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">
            On Autopilot.
          </span>
        </h1>

        <p className="max-w-2xl text-neutral-400 text-base sm:text-lg leading-relaxed mb-10 font-sans">
          Synaps parses complex contracts, audits liability caps, and extracts line-level evidence across your entire organizational knowledge base in seconds.
        </p>

        {/* Hero CTA & Interactive Audio Player Pill */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_30px_rgba(255,122,0,0.4)] hover:scale-105 transition-all flex items-center gap-2.5"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className="px-6 py-4 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-neutral-200 font-mono text-xs font-semibold tracking-wider transition-all flex items-center gap-2.5"
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            <span>{isPlayingAudio ? 'Mute Audio Demo' : '🔊 Listen to Audio Overview'}</span>
          </button>
        </div>

        {/* ── HEYPARKER INTERACTIVE PROMPT SANDBOX CARD ─────────────────────── */}
        <div id="demo" className="w-full max-w-4xl p-6 sm:p-8 rounded-3xl border border-white/15 bg-[#141418] shadow-[0_20px_80px_rgba(0,0,0,0.6)] relative overflow-hidden text-left" data-parker-reveal>
          <div className="flex items-center justify-between pb-4 border-b border-white/10 font-mono text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-white font-bold">SYNAPS PROMPT SANDBOX</span>
            </div>
            <span className="text-amber-400 font-semibold">100% EVIDENCE-BACKED</span>
          </div>

          {/* Sample Prompt Selector Pills */}
          <div className="flex flex-wrap gap-2 my-4 font-mono text-xs">
            {SAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPromptIdx(idx)}
                className={`px-3 py-1.5 rounded-full transition-all text-left ${
                  selectedPromptIdx === idx
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                Query #{idx + 1}
              </button>
            ))}
          </div>

          {/* Interactive Input Box */}
          <div className="relative mb-6">
            <div className="w-full p-4 rounded-2xl border border-white/15 bg-black/50 font-mono text-sm sm:text-base text-white flex items-center justify-between gap-3">
              <span className="truncate">{typedPrompt}<span className="animate-pulse text-amber-400">|</span></span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyPrompt}
                  className="p-2 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                  title="Copy Prompt"
                >
                  {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleRunPrompt}
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(255,122,0,0.4)]"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isGenerating ? 'Analyzing...' : 'Run'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Output Demonstration Box */}
          <div className="p-5 rounded-2xl border border-white/10 bg-white/5 font-mono text-xs sm:text-sm space-y-3">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="text-amber-400 font-bold">✓ SYNAPS PARSER RESULT</span>
              <span>140ms Execution</span>
            </div>
            <p className="text-neutral-200 leading-relaxed font-sans">
              Found <strong className="text-white">3 key contract discrepancies</strong> across 142 enterprise PDFs. Indemnification liability cap is <strong className="text-amber-300 font-mono">$2,500,000 USD</strong> (Section 14.2), which exceeds standard internal limits by <strong className="text-emerald-400 font-mono">+$1.5M</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* ── 4K INTERACTIVE DASHBOARD SCREENSHOT SHOWCASE ───────────────────── */}
      <section className="py-20 px-6 sm:px-12 max-w-6xl mx-auto space-y-12" data-parker-reveal>
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="font-mono text-xs text-amber-400 uppercase tracking-widest">// 4K INTERACTIVE DASHBOARD SUITE</span>
          <h2 className="font-mono text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Explore The SYNAPS C-Suite Engine
          </h2>
          <p className="text-neutral-400 font-sans text-base sm:text-lg">
            Hover over any platform module below to inspect full 4K ultra-resolution interface screenshots and live operational capabilities.
          </p>
        </div>

        <div className="w-full rounded-3xl border border-white/10 bg-[#141418] p-4 sm:p-6 shadow-2xl">
          <HoverExpand items={DASHBOARD_4K_ITEMS} collapsedHeight={72} expandedHeight={380} />
        </div>
      </section>

      {/* ── HEYPARKER STYLE FEATURE GRID — 4 INTERACTIVE BENTO CARDS ─────────── */}
      <section id="features" className="py-24 px-6 sm:px-12 max-w-6xl mx-auto space-y-16" data-parker-reveal>
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-mono text-xs text-amber-400 uppercase tracking-widest">// AUTOMATED CAPABILITIES</span>
          <h2 className="font-mono text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Built For Speed. Grounded In Truth.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1: Instant Radar Scanner */}
          <div className="p-8 rounded-3xl border border-white/10 bg-[#141418] hover:border-amber-500/40 transition-all space-y-6 shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-mono text-xl font-bold text-white">01 // Instant Document Radar</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Scan 100+ multi-page enterprise PDFs in under 1 second. Extract tables, signatures, and unindexed clause addendums automatically.
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-white/10 bg-black/40 font-mono text-xs text-neutral-300 space-y-2">
              <div className="flex justify-between text-neutral-500"><span>SCANNING SPEED</span><span className="text-emerald-400 font-bold">142 FILES / SEC</span></div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 w-4/5" />
              </div>
            </div>
          </div>

          {/* Card 2: "What Changed?" Diff Engine */}
          <div className="p-8 rounded-3xl border border-white/10 bg-[#141418] hover:border-amber-500/40 transition-all space-y-6 shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <GitBranch className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-mono text-xl font-bold text-white">02 // "What Changed?" Diff Engine</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Compare contract drafts across counterparty revisions. Instantly highlight modified liability limits, termination periods, and governing laws.
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-white/10 bg-black/40 font-mono text-xs space-y-2">
              <div className="text-red-400">OLD: "30 days termination notice"</div>
              <div className="text-emerald-400 font-bold">NEW: "90 days termination notice + cure period"</div>
            </div>
          </div>

          {/* Card 3: Executive Decision Matrix */}
          <div className="p-8 rounded-3xl border border-white/10 bg-[#141418] hover:border-amber-500/40 transition-all space-y-6 shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Scale className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-mono text-xl font-bold text-white">03 // Executive Decision Surface</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Compress complex information into actionable risk reviews with explicit facts, risks, dependencies, and recommended CLO sign-offs.
              </p>
            </div>
            <div className="flex gap-2 font-mono text-[11px]">
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">RISK: MEDIUM</span>
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">EVIDENCE: 100%</span>
            </div>
          </div>

          {/* Card 4: Autonomous Agent Layer */}
          <div className="p-8 rounded-3xl border border-white/10 bg-[#141418] hover:border-amber-500/40 transition-all space-y-6 shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-mono text-xl font-bold text-white">04 // Autonomous Agent Layer</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Deploy 10 specialized AI agents (Research, Review, Document, Decision, Knowledge) to audit repositories and generate executive briefs.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>10 Agents Active & Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── HEYPARKER STYLE FAQ SECTION ──────────────────────────────────────── */}
      <section id="faq" className="py-24 px-6 sm:px-12 max-w-4xl mx-auto space-y-12" data-parker-reveal>
        <div className="text-center space-y-3">
          <span className="font-mono text-xs text-amber-400 uppercase tracking-widest">// GOT QUESTIONS?</span>
          <h2 className="font-mono text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4 font-mono">
          {[
            { q: 'What makes SYNAPS different from traditional document AI?', a: 'SYNAPS provides line-level evidentiary citations, multi-document cross-referencing, zero hallucinations, and 10 autonomous C-suite agents built for enterprise legal and risk operations.' },
            { q: 'Can SYNAPS parse scanned contracts and image PDFs?', a: 'Yes. SYNAPS features spatial OCR layout parsing that extracts text, table rows, and marginal annotations with 99.8% precision.' },
            { q: 'How does SYNAPS handle data privacy and enterprise security?', a: 'SYNAPS is SOC 2 Type II compliant and enforces strict DPDP Act standards. Your organization’s data is encrypted at rest and in transit, and is never used to train public AI models.' },
            { q: 'How fast can our team get started?', a: 'Instant onboarding. Connect your cloud storage (Google Drive, SharePoint, Appwrite) or upload files directly to begin querying in under 60 seconds.' },
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-white/10 bg-[#141418] space-y-3">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left font-bold text-base text-white flex items-center justify-between hover:text-amber-400 transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-amber-400' : 'text-neutral-500'}`} />
              </button>
              {openFaq === idx && (
                <p className="text-sm text-neutral-400 font-sans leading-relaxed pt-2 border-t border-white/5">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── HEYPARKER STYLE FINAL CTA BANNER ─────────────────────────────────── */}
      <section className="py-28 px-6 sm:px-12 max-w-5xl mx-auto text-center relative" data-parker-reveal>
        <div className="p-10 sm:p-16 rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#1c140d] to-[#141418] shadow-[0_0_100px_rgba(255,122,0,0.2)] space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto font-mono text-2xl font-bold">
            S
          </div>

          <h2 className="font-mono text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight uppercase">
            Turn Your Information <br />
            Into Intelligence Today.
          </h2>

          <p className="text-neutral-400 text-base sm:text-lg max-w-xl mx-auto font-sans leading-relaxed">
            Join enterprise legal operations, compliance leads, and risk officers already using SYNAPS to automate document auditing.
          </p>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-10 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_30px_rgba(255,122,0,0.5)] hover:scale-105 transition-all inline-flex items-center gap-2.5"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="py-12 px-6 sm:px-12 border-t border-white/10 font-mono text-xs text-neutral-500 flex flex-wrap items-center justify-between gap-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold">SYNAPS</span>
          <span>© 2026 SYNAPS ENTERPRISE INC.</span>
        </div>

        <div className="flex items-center gap-6 text-neutral-400">
          <Link href="/legal/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        </div>
      </footer>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={signInPrompt.title}
        subtitle={signInPrompt.subtitle}
      />
    </div>
  );
}
