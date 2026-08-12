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
  ChevronDown,
  Globe,
  Sparkles,
  Plus,
  Minus
} from "lucide-react";
import SignInModal from "@/components/SignInModal";
import Link from "next/link";
import Lenis from "lenis";

import { FluidCanvas } from "@/components/ui/FluidCanvas";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { HoverExpand, HoverExpandItem } from "@/components/ui/HoverExpand";

gsap.registerPlugin(ScrollTrigger);

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

// ─── FAQ ITEMS ───────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    question: "How do you integrate into existing enterprise workflows?",
    answer: "SYNAPS connects seamlessly into your existing Google Drive, Notion, Slack, and PDF document workflows. You can invite your team and start running zero-hallucination RAG queries in under 5 minutes.",
  },
  {
    question: "What types of strategic compliance projects do you audit?",
    answer: "SYNAPS specializes in high-stakes operational audits including SaaS contract indemnification caps, DPDP data residency policies, M&A data room compliance, and vendor liability thresholds.",
  },
  {
    question: "How does the Boardroom Simulation Engine work?",
    answer: "The Boardroom Engine initializes 10 autonomous digital twin C-suite agents (CEO, CFO, CTO, Legal, COO). When given a strategic prompt, the agents debate, run financial scenario modeling, and generate a synthesized consensus proposal.",
  },
  {
    question: "Is enterprise data private and secure?",
    answer: "Yes. All enterprise data is encrypted in transit and at rest with AES-256 and TLS 1.3. Documents remain isolated in strictly partitioned tenant memory graphs with zero public model training.",
  },
  {
    question: "What is the difference between Single Project and Recurring engagement?",
    answer: "Single Project covers fixed-scope compliance audits or data room setups. Recurring engagement provides continuous C-suite AI monitoring, daily action plan generation, and unlimited RAG queries.",
  },
];

// ─── MAIN INCREDIBLES.DEV STYLE LANDING PAGE ──────────────────────────────────
export default function IncrediblesStyleLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pricingTab, setPricingTab] = useState<"single" | "recurring">("single");
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Calculator State
  const [projectType, setProjectType] = useState("landing");
  const [projectCreativity, setProjectCreativity] = useState("enhanced");
  const [projectTimeline, setProjectTimeline] = useState("asap");

  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Lenis Smooth Scroll (incredibles.dev style)
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

  // GSAP ScrollTrigger Animations (Line Reveals & Stacking Cards)
  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Reveal section elements
      const reveals = gsap.utils.toArray<HTMLElement>("[data-incredibles-reveal]");
      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
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

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#f1f1f1] text-[#2b2b2b] font-sans selection:bg-[#fc4778] selection:text-white antialiased overflow-x-hidden"
    >
      {/* ── WEBGEL FLUID CANVAS & CUSTOM FOLLOW CURSOR ──────────────────────── */}
      <FluidCanvas />
      <CustomCursor />

      {/* ── INCREDIBLES.DEV SITE HEAD NAVIGATION ────────────────────────────── */}
      <header className="fixed top-6 left-0 z-50 w-full px-6 sm:px-12 flex items-center justify-between pointer-events-none">
        {/* Brand Logo */}
        <div className="pointer-events-auto">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#2b2b2b] flex items-center justify-center text-[#fafafa] font-mono font-bold text-sm shadow-md group-hover:bg-[#fc4778] transition-colors">
              S
            </div>
            <span className="font-mono font-extrabold text-sm tracking-wider text-[#2b2b2b]">
              SYNAPS
            </span>
          </Link>
        </div>

        {/* Menu Actions */}
        <nav className="flex items-center gap-3 pointer-events-auto">
          <a
            href="#pricing"
            className="px-5 py-2.5 rounded-full border border-[#2b2b2b]/20 bg-[#fafafa]/90 hover:bg-[#2b2b2b] hover:text-white text-[#2b2b2b] font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
          >
            Pricing
          </a>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 rounded-full bg-[#2b2b2b] hover:bg-[#fc4778] text-[#fafafa] font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5"
          >
            <span>Start a conversation</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </nav>
      </header>

      {/* ── HERO SECTION ────────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-28 px-6 sm:px-12 max-w-6xl mx-auto text-center space-y-8 z-10">
        {/* Award Badges Ticker */}
        <ul className="flex items-center justify-center flex-wrap gap-4 font-mono text-xs font-semibold uppercase tracking-wider text-[#656565]">
          <li className="flex items-center gap-2"><span>1X WEBBY AWARD</span><span className="w-1 h-1 rounded-full bg-[#fc4778]" /></li>
          <li className="flex items-center gap-2"><span>5X FWA</span><span className="w-1 h-1 rounded-full bg-[#fc4778]" /></li>
          <li className="flex items-center gap-2"><span>18X AWWWARDS</span><span className="w-1 h-1 rounded-full bg-[#fc4778]" /></li>
          <li><span>21X CSSDA</span></li>
        </ul>

        {/* Hero Title */}
        <h1 className="font-serif text-4xl sm:text-7xl font-normal text-[#2b2b2b] tracking-tight leading-[1.08] max-w-5xl mx-auto">
          Creative development team for agencies that can't afford to miss
        </h1>

        <p className="text-[#656565] font-sans text-lg sm:text-2xl max-w-3xl mx-auto font-normal leading-relaxed">
          Two senior AI systems engineers with 15+ years of experience, collaborating with enterprise teams and agencies across the globe.
        </p>

        {/* Trusted By Logos */}
        <div className="pt-8 space-y-4">
          <p className="font-mono text-xs text-[#a2a2a2] uppercase tracking-widest">
            TRUSTED BY TEAMS BEHIND PROJECTS FOR
          </p>
          <div className="flex items-center justify-center flex-wrap gap-8 opacity-75 grayscale hover:grayscale-0 transition-all font-mono font-bold text-sm text-[#2b2b2b]">
            <span>CHANEL</span>
            <span>NESPRESSO</span>
            <span>VANGUART</span>
            <span>TISSOT</span>
          </div>
        </div>
      </section>

      {/* ── USP CARDS SECTION (b-usp-card) ──────────────────────────────────── */}
      <section className="py-24 px-6 sm:px-12 max-w-6xl mx-auto space-y-12 z-10" data-incredibles-reveal>
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="font-serif text-3xl sm:text-6xl font-normal text-[#2b2b2b] tracking-tight">
            Incredible devs you can count on.
          </h2>
          <p className="text-[#656565] font-sans text-lg">
            We step in on high-stakes projects where execution can’t fail, from rebrands and marketing campaigns to product launches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* USP Card 1 */}
          <div className="p-8 rounded-3xl bg-[#fafafa] border border-[#dedede] shadow-lg space-y-4 hover:border-[#fc4778] transition-all group">
            <h3 className="font-serif text-3xl text-[#2b2b2b] group-hover:text-[#fc4778] transition-colors">Start to Finish</h3>
            <p className="text-[#656565] text-base leading-relaxed">
              We work as one unit, ensuring your entire project is completed without delays.
            </p>
          </div>

          {/* USP Card 2 */}
          <div className="p-8 rounded-3xl bg-[#fafafa] border border-[#dedede] shadow-lg space-y-4 hover:border-[#fc4778] transition-all group">
            <h3 className="font-serif text-3xl text-[#2b2b2b] group-hover:text-[#fc4778] transition-colors">Higher Potential</h3>
            <p className="text-[#656565] text-base leading-relaxed">
              Together we accomplish more. Even the most complex builds move with relentless quality.
            </p>
          </div>

          {/* USP Card 3 */}
          <div className="p-8 rounded-3xl bg-[#fafafa] border border-[#dedede] shadow-lg space-y-4 hover:border-[#fc4778] transition-all group">
            <h3 className="font-serif text-3xl text-[#2b2b2b] group-hover:text-[#fc4778] transition-colors">Experienced Pros</h3>
            <p className="text-[#656565] text-base leading-relaxed">
              We understand project briefs, working quickly and skillfully without constant supervision.
            </p>
          </div>

          {/* USP Card 4 */}
          <div className="p-8 rounded-3xl bg-[#fafafa] border border-[#dedede] shadow-lg space-y-4 hover:border-[#fc4778] transition-all group">
            <h3 className="font-serif text-3xl text-[#2b2b2b] group-hover:text-[#fc4778] transition-colors">Top Quality</h3>
            <p className="text-[#656565] text-base leading-relaxed">
              We’re proven on high-end projects, delivering excellence for agencies who care about quality.
            </p>
          </div>
        </div>
      </section>

      {/* ── 4K INTERACTIVE DASHBOARD SHOWCASE ACCORDION ───────────────────────── */}
      <section className="py-20 px-6 sm:px-12 max-w-6xl mx-auto space-y-12 z-10" data-incredibles-reveal>
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="font-mono text-xs text-[#fc4778] uppercase tracking-widest">// 4K PLATFORM SUITE</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#2b2b2b] tracking-tight">
            See for yourself
          </h2>
          <p className="text-[#656565] font-sans text-base sm:text-lg">
            Hover over any platform module below to inspect full 4K ultra-resolution interface screenshots.
          </p>
        </div>

        <div className="w-full rounded-3xl border border-[#dedede] bg-[#fafafa] p-4 sm:p-6 shadow-xl">
          <HoverExpand items={DASHBOARD_4K_ITEMS} collapsedHeight={72} expandedHeight={540} />
        </div>
      </section>

      {/* ── EXECUTIVE QUOTE CARD (b-quote) ───────────────────────────────────── */}
      <section className="py-16 px-6 sm:px-12 max-w-5xl mx-auto z-10" data-incredibles-reveal>
        <div className="p-12 rounded-3xl bg-[#2b2b2b] text-[#fafafa] shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#fc4778]/10 rounded-full blur-3xl" />
          <blockquote className="font-serif text-2xl sm:text-4xl leading-snug font-normal relative z-10">
            “Clean, well-finished work with a true creative eye, always flexible and quick to respond.”
          </blockquote>
          <p className="font-mono text-xs text-[#fc4778] uppercase tracking-widest relative z-10">
            — Adrien Pin, founding partner @Merci-Michel
          </p>
        </div>
      </section>

      {/* ── CATCHPHRASE FULL-SCREEN PINNING SECTION (s-catchphrase) ────────────── */}
      <section className="py-28 px-6 text-center space-y-4 z-10" data-incredibles-reveal>
        <h2 className="font-serif text-4xl sm:text-8xl font-normal text-[#2b2b2b] tracking-tight leading-none">
          Let’s talk<br />
          about your<br />
          project.
        </h2>
      </section>

      {/* ── INTERACTIVE PRICING & ENGAGEMENT CALCULATOR (s-pricing) ──────────── */}
      <section id="pricing" className="py-24 px-6 sm:px-12 max-w-6xl mx-auto space-y-12 z-10" data-incredibles-reveal>
        <div className="flex flex-col md:flex-row items-start justify-between gap-12">
          {/* Left Column */}
          <div className="w-full md:w-1/3 space-y-4">
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#2b2b2b]">Simple pricing</h2>
            <p className="text-[#656565] text-base leading-relaxed">
              Most projects will be priced according to your needs, but we can still give a clear idea of timelines and budget.
            </p>
            <p className="text-[#656565] text-base leading-relaxed">
              For ongoing demands, we can also offer monthly engagements.
            </p>
          </div>

          {/* Right Column: Pricing Switcher & Cards */}
          <div className="w-full md:w-2/3 space-y-8">
            {/* Tab Toggle */}
            <div className="inline-flex items-center p-1.5 rounded-full bg-[#fafafa] border border-[#dedede] shadow-sm font-mono text-xs">
              <button
                onClick={() => setPricingTab("single")}
                className={`px-6 py-2.5 rounded-full transition-all ${
                  pricingTab === "single"
                    ? "bg-[#2b2b2b] text-white font-bold shadow-md"
                    : "text-[#656565] hover:text-[#2b2b2b]"
                }`}
              >
                Single project
              </button>
              <button
                onClick={() => setPricingTab("recurring")}
                className={`px-6 py-2.5 rounded-full transition-all ${
                  pricingTab === "recurring"
                    ? "bg-[#2b2b2b] text-white font-bold shadow-md"
                    : "text-[#656565] hover:text-[#2b2b2b]"
                }`}
              >
                Recurring
              </button>
            </div>

            {/* Single Project Form Calculator */}
            {pricingTab === "single" ? (
              <div className="p-8 rounded-3xl bg-[#fafafa] border border-[#dedede] shadow-lg space-y-6">
                <h3 className="font-serif text-2xl font-normal text-[#2b2b2b]">Single Project</h3>
                <p className="text-[#656565] text-xs font-mono">
                  For clearly defined projects, with a fixed scope, timeline, and budget.
                </p>

                <div className="space-y-4">
                  {/* Select 1 */}
                  <div className="space-y-2">
                    <label className="font-mono text-xs text-[#a2a2a2] uppercase">1 // Project Type</label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-[#dedede] bg-white font-sans text-sm text-[#2b2b2b] focus:outline-none focus:border-[#fc4778]"
                    >
                      <option value="landing">Landing page</option>
                      <option value="website">Enterprise Website</option>
                      <option value="portfolio">Creative Portfolio</option>
                    </select>
                  </div>

                  {/* Select 2 */}
                  <div className="space-y-2">
                    <label className="font-mono text-xs text-[#a2a2a2] uppercase">2 // Creativity Level</label>
                    <select
                      value={projectCreativity}
                      onChange={(e) => setProjectCreativity(e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-[#dedede] bg-white font-sans text-sm text-[#2b2b2b] focus:outline-none focus:border-[#fc4778]"
                    >
                      <option value="standard">Standard — clean and functional</option>
                      <option value="enhanced">Enhanced — refined motion and details</option>
                      <option value="creative">Creative — bold and expressive</option>
                    </select>
                  </div>

                  {/* Select 3 */}
                  <div className="space-y-2">
                    <label className="font-mono text-xs text-[#a2a2a2] uppercase">3 // Timeline</label>
                    <select
                      value={projectTimeline}
                      onChange={(e) => setProjectTimeline(e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-[#dedede] bg-white font-sans text-sm text-[#2b2b2b] focus:outline-none focus:border-[#fc4778]"
                    >
                      <option value="asap">ASAP — short deadline</option>
                      <option value="flexible">Flexible — long deadline</option>
                    </select>
                  </div>
                </div>

                {/* Estimate Result Box */}
                <div className="p-5 rounded-2xl bg-[#2b2b2b] text-white space-y-2">
                  <span className="font-mono text-xs text-[#fc4778] uppercase">ESTIMATED INVESTMENT</span>
                  <div className="font-serif text-3xl">
                    {projectType === "landing" ? "€4,500 — €7,500" : projectType === "website" ? "€8,500 — €14,000" : "€6,000 — €10,000"}
                  </div>
                  <p className="font-mono text-xs text-[#a2a2a2]">
                    Estimated Delivery: {projectTimeline === "asap" ? "3-4 weeks" : "6-8 weeks"}
                  </p>
                </div>
              </div>
            ) : (
              /* Recurring Cards */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Standard Card */}
                <div className="p-8 rounded-3xl bg-[#fafafa] border border-[#dedede] shadow-lg space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="font-mono text-xs text-[#fc4778] uppercase">STANDARD</span>
                    <div className="font-serif text-4xl text-[#2b2b2b]">€4,999<span className="text-sm font-sans text-[#656565]">/month</span></div>
                    <p className="text-[#656565] text-xs">Great for small agencies with a lighter flow of projects.</p>
                    <ul className="space-y-2 font-mono text-xs text-[#2b2b2b]">
                      <li>✓ Shared capacity</li>
                      <li>✓ One project at a time</li>
                      <li>✓ One expert-level developer</li>
                      <li>✓ Unlimited requests</li>
                      <li>✓ Dedicated communication channel</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-3 rounded-full bg-[#2b2b2b] hover:bg-[#fc4778] text-white font-mono text-xs font-bold uppercase transition-all"
                  >
                    Start a conversation
                  </button>
                </div>

                {/* Extended Card */}
                <div className="p-8 rounded-3xl bg-[#2b2b2b] text-white shadow-xl space-y-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="space-y-4 relative z-10">
                    <span className="font-mono text-xs text-[#fc4778] uppercase">EXTENDED</span>
                    <div className="font-serif text-4xl text-white">€9,999<span className="text-sm font-sans text-[#a2a2a2]">/month</span></div>
                    <p className="text-[#a2a2a2] text-xs">Great for agencies handling multiple projects at once.</p>
                    <ul className="space-y-2 font-mono text-xs text-white">
                      <li>✓ Dedicated capacity</li>
                      <li>✓ Up to two concurrent projects</li>
                      <li>✓ Two expert-level developers</li>
                      <li>✓ Unlimited requests</li>
                      <li>✓ Dedicated communication channel</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-3 rounded-full bg-[#fc4778] hover:bg-white hover:text-black text-white font-mono text-xs font-bold uppercase transition-all relative z-10"
                  >
                    Start a conversation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION SECTION (s-faq) ───────────────────────────────────── */}
      <section className="py-24 px-6 sm:px-12 max-w-4xl mx-auto space-y-12 z-10" data-incredibles-reveal>
        <div className="text-center space-y-3">
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#2b2b2b]">
            Answers to your questions
          </h2>
          <p className="text-[#656565] text-base">
            Need more information? Feel free to <button onClick={() => setIsModalOpen(true)} className="underline hover:text-[#fc4778]">reach out.</button>
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#dedede] bg-[#fafafa] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left font-serif text-xl sm:text-2xl text-[#2b2b2b] flex items-center justify-between gap-4 hover:text-[#fc4778] transition-colors"
                >
                  <span>{faq.question}</span>
                  {isOpen ? <Minus className="w-5 h-5 shrink-0 text-[#fc4778]" /> : <Plus className="w-5 h-5 shrink-0 text-[#656565]" />}
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-6 pb-6 text-[#656565] text-sm leading-relaxed font-sans"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── SITE FOOTER (site-foot) ─────────────────────────────────────────── */}
      <footer className="py-12 border-t border-[#dedede] text-center font-mono text-xs text-[#656565] z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 SYNAPS INTELLIGENCE INC. ALL RIGHTS RESERVED.</span>
          <div className="flex items-center gap-6 text-[#2b2b2b]">
            <a href="#pricing" className="hover:text-[#fc4778] transition-colors">PRICING</a>
            <button onClick={() => setIsModalOpen(true)} className="hover:text-[#fc4778] transition-colors">CONTACT</button>
          </div>
        </div>
      </footer>

      {/* Sign-in Modal */}
      <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
