"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  Sparkles,
  Sliders,
  ChevronRight,
  Cpu,
  Layers,
  Database,
  Scale,
  Activity,
  Globe,
  Lock
} from "lucide-react";
import SignInModal from "@/components/SignInModal";
import Link from "next/link";
import Lenis from "lenis";

import { HoverExpand, HoverExpandItem } from "@/components/ui/HoverExpand";
import { FluidCanvas } from "@/components/ui/FluidCanvas";
import { CustomCursor } from "@/components/ui/CustomCursor";

gsap.registerPlugin(ScrollTrigger);

// ─── SAMPLE INTERACTIVE SANDBOX PROMPTS ────────────────────────────────────────
const SAMPLE_PROMPTS = [
  "Audit indemnification caps across our 2026 enterprise SaaS vendor contracts.",
  "Find every reference to DPDP Act data residency compliance in Q3 reports.",
  "Compare liability thresholds in vendor agreements between 2025 and 2026.",
  "What key risks should executive management review before signing the Supply Agreement?",
  "Draft a 1-page executive summary of the M&A data room contracts.",
];

// ─── CLEAN 4K DASHBOARD SCREENSHOT GALLERY ITEMS (TRIONN STYLE) ───────────────
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

// ─── TRIONN 3D TILT CARD COMPONENT ─────────────────────────────────────────────
function TrionnTiltCard({
  title,
  category,
  description,
  icon: Icon,
  metric,
}: {
  title: string;
  category: string;
  description: string;
  icon: any;
  metric: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: "transform 0.15s ease-out" }}
      className="group relative p-8 rounded-3xl bg-[#111116] border border-white/10 hover:border-amber-500/50 shadow-2xl flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all" />

      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-amber-400 tracking-widest uppercase">// {category}</span>
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-all">
            <Icon className="w-5 h-5" />
          </div>
        </div>

        <h3 className="font-mono text-2xl font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
          {title}
        </h3>

        <p className="text-neutral-400 text-sm leading-relaxed font-sans">
          {description}
        </p>
      </div>

      <div className="pt-6 border-t border-white/10 flex items-center justify-between relative z-10 mt-6">
        <span className="font-mono text-xs text-neutral-400">PERFORMANCE METRIC</span>
        <span className="font-mono text-sm font-bold text-amber-400">{metric}</span>
      </div>
    </div>
  );
}

// ─── MAIN TRIONN STYLE LANDING PAGE ───────────────────────────────────────────
export default function TrionnStyleLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromptIdx, setSelectedPromptIdx] = useState(0);
  const [typedPrompt, setTypedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // Typewriter effect for prompt sandbox
  useEffect(() => {
    const currentText = SAMPLE_PROMPTS[selectedPromptIdx];
    let i = 0;
    setTypedPrompt("");

    const typeChar = () => {
      if (i <= currentText.length) {
        setTypedPrompt(currentText.slice(0, i));
        i++;
        setTimeout(typeChar, 18);
      }
    };

    typeChar();
  }, [selectedPromptIdx]);

  // GSAP Kinetic Animations (Trionn Text & Card Reveals)
  useGSAP(
    () => {
      if (!containerRef.current) return;

      const reveals = gsap.utils.toArray<HTMLElement>("[data-trionn-reveal]");
      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.0,
            ease: "power4.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
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
    setTimeout(() => setIsGenerating(false), 1800);
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#070709] text-[#f4f4f6] font-sans selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden antialiased"
    >
      {/* ── WEBGEL FLUID CANVAS & CUSTOM FOLLOW CURSOR ──────────────────────── */}
      <FluidCanvas />
      <CustomCursor />

      {/* ── TRIONN FLOATING NAVIGATION BAR ────────────────────────────────────── */}
      <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl px-6 py-3.5 rounded-full backdrop-blur-2xl bg-[#0f0f13]/80 border border-white/10 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 p-[1px] shadow-[0_0_20px_rgba(255,122,0,0.4)]">
            <div className="w-full h-full rounded-full bg-[#070709] flex items-center justify-center font-mono font-bold text-amber-400 text-sm">
              S
            </div>
          </div>
          <span className="font-mono text-sm font-extrabold tracking-wider text-white">SYNAPS</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-mono text-xs text-neutral-400 tracking-wider">
          <a href="#features" className="hover:text-amber-400 transition-colors">CAPABILITIES</a>
          <a href="#showcase" className="hover:text-amber-400 transition-colors">4K SUITE</a>
          <a href="#sandbox" className="hover:text-amber-400 transition-colors">SANDBOX</a>
          <a href="#metrics" className="hover:text-amber-400 transition-colors">METRICS</a>
        </nav>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(255,122,0,0.4)] flex items-center gap-1.5"
        >
          <span>ENTER ENGINE</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* ── TRIONN HERO SECTION — BOLD KINETIC TYPOGRAPHY ────────────────────── */}
      <section className="relative pt-44 pb-24 px-6 sm:px-12 max-w-6xl mx-auto text-center space-y-8 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 font-mono text-xs text-amber-400 tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>// SYNAPS ENTERPRISE INTELLIGENCE LAYER</span>
        </div>

        <h1
          ref={heroTextRef}
          className="font-mono text-4xl sm:text-7xl font-extrabold text-white tracking-tight leading-[1.08] max-w-5xl mx-auto"
        >
          Built For Speed.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
            Grounded In Truth.
          </span>
        </h1>

        <p className="text-neutral-400 font-sans text-lg sm:text-2xl max-w-3xl mx-auto font-light leading-relaxed">
          SYNAPS synthesizes scattered enterprise documents, contract liabilities, boardroom decision simulations, and organizational memory into verifiable 4K intelligence.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(255,122,0,0.5)]"
          >
            <span>Launch C-Suite Console</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <a
            href="#showcase"
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <span>Explore 4K Suite</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ── TRIONN 3D TILT CAPABILITY GRID ───────────────────────────────────── */}
      <section id="features" className="py-24 px-6 sm:px-12 max-w-6xl mx-auto space-y-16 relative z-10" data-trionn-reveal>
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-mono text-xs text-amber-400 uppercase tracking-widest">// C-SUITE CAPABILITIES</span>
          <h2 className="font-mono text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Enterprise Motion Engine
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TrionnTiltCard
            title="AI COO Console"
            category="OPERATIONAL AUDIT"
            description="Continuous risk detection, indemnification cap monitoring, and compliance audit synthesis across enterprise SaaS agreements."
            icon={ShieldCheck}
            metric="140ms Execution"
          />
          <TrionnTiltCard
            title="Digital Twin Boardroom"
            category="DECISION SIMULATOR"
            description="Simulate strategic corporate decisions across autonomous digital twin agents representing CEO, CFO, CTO, and Legal leadership."
            icon={Cpu}
            metric="10 Digital Twins"
          />
          <TrionnTiltCard
            title="Chief of Staff Action Plan"
            category="PRIORITY MATRIX"
            description="Proactive risk scoring, daily operational action items, and weekly strategic synthesis sorted by enterprise urgency."
            icon={Activity}
            metric="Real-Time Ticker"
          />
          <TrionnTiltCard
            title="Enterprise Memory Graph"
            category="KNOWLEDGE GRAPH"
            description="Query organizational memory graphs to trace approval histories, precedent decisions, and structural compliance rules."
            icon={Database}
            metric="Zero Hallucinations"
          />
        </div>
      </section>

      {/* ── 4K INTERACTIVE DASHBOARD SHOWCASE (TRIONN STYLE ACCORDION) ────────── */}
      <section id="showcase" className="py-24 px-6 sm:px-12 max-w-6xl mx-auto space-y-12 relative z-10" data-trionn-reveal>
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="font-mono text-xs text-amber-400 uppercase tracking-widest">// 4K ULTRA-RESOLUTION SUITE</span>
          <h2 className="font-mono text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Inspect The SYNAPS Platform
          </h2>
          <p className="text-neutral-400 font-sans text-base sm:text-lg">
            Hover over any platform module below to expand full 4K ultra-resolution interface screenshots without cropping or cutoff.
          </p>
        </div>

        <div className="w-full rounded-3xl border border-white/10 bg-[#0f0f13] p-4 sm:p-6 shadow-2xl">
          <HoverExpand items={DASHBOARD_4K_ITEMS} collapsedHeight={72} expandedHeight={540} />
        </div>
      </section>

      {/* ── INTERACTIVE PROMPT SANDBOX ───────────────────────────────────────── */}
      <section id="sandbox" className="py-24 px-6 sm:px-12 max-w-5xl mx-auto space-y-12 relative z-10" data-trionn-reveal>
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-mono text-xs text-amber-400 uppercase tracking-widest">// INTERACTIVE PROMPT DEMO</span>
          <h2 className="font-mono text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Test The SYNAPS Parser
          </h2>
        </div>

        <div className="p-8 rounded-3xl border border-white/10 bg-[#0f0f13] shadow-2xl space-y-6">
          {/* Prompt Selector Pills */}
          <div className="flex flex-wrap gap-2.5">
            {SAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPromptIdx(idx)}
                className={`px-4 py-2 rounded-full font-mono text-xs transition-all ${
                  selectedPromptIdx === idx
                    ? "bg-amber-500 text-black font-bold shadow-[0_0_15px_rgba(255,122,0,0.4)]"
                    : "bg-white/5 border border-white/10 text-neutral-400 hover:text-white"
                }`}
              >
                Query #{idx + 1}
              </button>
            ))}
          </div>

          {/* Interactive Input Box */}
          <div className="relative">
            <div className="w-full p-4 rounded-2xl border border-white/15 bg-black/60 font-mono text-sm sm:text-base text-white flex items-center justify-between gap-3">
              <span className="truncate">
                {typedPrompt}
                <span className="animate-pulse text-amber-400">|</span>
              </span>
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
                  <span>{isGenerating ? "Analyzing..." : "Run"}</span>
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

      {/* ── TRIONN STATS & METRICS GRID ──────────────────────────────────────── */}
      <section id="metrics" className="py-24 px-6 sm:px-12 max-w-6xl mx-auto border-t border-white/10 relative z-10" data-trionn-reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <span className="font-mono text-4xl sm:text-6xl font-extrabold text-amber-400 tracking-tight">140ms</span>
            <p className="font-mono text-xs text-neutral-400 uppercase tracking-widest">Query Execution</p>
          </div>
          <div className="space-y-2">
            <span className="font-mono text-4xl sm:text-6xl font-extrabold text-white tracking-tight">99.8%</span>
            <p className="font-mono text-xs text-neutral-400 uppercase tracking-widest">Grounded Precision</p>
          </div>
          <div className="space-y-2">
            <span className="font-mono text-4xl sm:text-6xl font-extrabold text-amber-400 tracking-tight">100+</span>
            <p className="font-mono text-xs text-neutral-400 uppercase tracking-widest">Formats Parsed</p>
          </div>
          <div className="space-y-2">
            <span className="font-mono text-4xl sm:text-6xl font-extrabold text-white tracking-tight">$2.5M</span>
            <p className="font-mono text-xs text-neutral-400 uppercase tracking-widest">Cap Audited</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="py-12 border-t border-white/10 text-center font-mono text-xs text-neutral-500 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 SYNAPS INTELLIGENCE INC. ALL RIGHTS RESERVED.</span>
          <div className="flex items-center gap-6 text-neutral-400">
            <a href="#features" className="hover:text-white transition-colors">CAPABILITIES</a>
            <a href="#showcase" className="hover:text-white transition-colors">SHOWCASE</a>
            <button onClick={() => setIsModalOpen(true)} className="hover:text-amber-400 transition-colors">LOGIN</button>
          </div>
        </div>
      </footer>

      {/* Sign-in Modal */}
      <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
