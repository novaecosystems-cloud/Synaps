"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  BrainCircuit,
  ArrowRight,
  Play,
  X,
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  ShieldCheck,
  Zap,
  ChevronDown,
} from 'lucide-react';

/* ─── Film grain & grid line animations (CSS injected) ─── */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap');

  .landing-container, .landing-container * { font-family: 'Caveat', cursive !important; }
  .landing-container code, .landing-container pre, .landing-container .font-mono { font-family: 'IBM Plex Mono', monospace !important; }

  @keyframes traceMove {
    0%   { transform: translateX(-50%) translateY(-10vh); opacity: 0; }
    8%   { opacity: 0.5; }
    85%  { opacity: 0.5; }
    100% { transform: translateX(-50%) translateY(110vh); opacity: 0; }
  }

  @keyframes float3d {
    0%   { transform: translateY(0px)   rotateY(0deg)   rotateX(2deg); }
    33%  { transform: translateY(-18px) rotateY(8deg)   rotateX(-3deg); }
    66%  { transform: translateY(-6px)  rotateY(-6deg)  rotateX(4deg); }
    100% { transform: translateY(0px)   rotateY(0deg)   rotateX(2deg); }
  }

  @keyframes laptopOpen {
    0%   { transform: perspective(900px) rotateX(90deg); }
    100% { transform: perspective(900px) rotateX(-8deg); }
  }

  @keyframes screenFadeIn {
    0%   { opacity: 0; }
    60%  { opacity: 0; }
    100% { opacity: 1; }
  }

  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .grain-overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.18;
    mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
    background-repeat: repeat;
  }

  .grid-line { position: absolute; top: 0; bottom: 0; width: 1px; background: rgba(255,255,255,0.04); overflow: hidden; }
  .line-trace {
    position: absolute;
    top: -10vh;
    left: 50%;
    width: 1px;
    height: 120px;
    background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.45), transparent);
    animation: traceMove linear infinite;
    will-change: transform, opacity;
  }

  .grid-line:nth-child(1) .line-trace { animation-duration: 8s;  animation-delay: 0s; }
  .grid-line:nth-child(2) .line-trace { animation-duration: 11s; animation-delay: 3s; }
  .grid-line:nth-child(3) .line-trace { animation-duration: 7s;  animation-delay: 6s; }
  .grid-line:nth-child(4) .line-trace { animation-duration: 10s; animation-delay: 2s; }
  .grid-line:nth-child(5) .line-trace { animation-duration: 9s;  animation-delay: 8s; }
  .grid-line:nth-child(6) .line-trace { animation-duration: 12s; animation-delay: 4s; }
  .grid-line:nth-child(7) .line-trace { animation-duration: 6.5s;animation-delay: 10s; }

  .object-3d { animation: float3d 6s ease-in-out infinite; transform-style: preserve-3d; }

  .laptop-open { animation: laptopOpen 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .screen-fade { animation: screenFadeIn 1.2s ease forwards; }

  .shimmer-text {
    background: linear-gradient(90deg, #ffffff 0%, #ffffff 40%, #a0c4ff 50%, #ffffff 60%, #ffffff 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }
`;

/* ─── Vertical grid lines background ─── */
function GridLines() {
  const positions = ['10%', '22%', '35%', '50%', '65%', '78%', '90%'];
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {positions.map((left, i) => (
        <div key={i} className="grid-line" style={{ left }}>
          <div className="line-trace" />
        </div>
      ))}
    </div>
  );
}

/* ─── Laptop Demo Modal ─── */
function DemoModal({ onClose }: { onClose: () => void }) {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOpened(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl mx-4"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm"
          >
            <X className="w-4 h-4" /> Close
          </button>

          {/* Laptop shell */}
          <div className="perspective-[1200px]">
            {/* Screen lid */}
            <div
              className={`relative transition-all duration-1000 origin-bottom`}
              style={{
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                transform: opened
                  ? 'perspective(1200px) rotateX(-8deg)'
                  : 'perspective(1200px) rotateX(90deg)',
              }}
            >
              {/* Screen bezel */}
              <div className="bg-[#1a1a1a] rounded-t-2xl border border-white/10 p-3 shadow-[0_-20px_80px_rgba(0,0,0,0.8)]">
                {/* Screen */}
                <div
                  className="relative rounded-lg overflow-hidden bg-[#0a0a0a] aspect-video"
                  style={{ opacity: opened ? 1 : 0, transition: 'opacity 0.6s ease 0.8s' }}
                >
                  {/* Mock app UI */}
                  <div className="absolute inset-0 bg-[#0d0d0d] flex flex-col">
                    {/* App toolbar */}
                    <div className="h-10 bg-[#161616] border-b border-white/5 flex items-center px-4 gap-3">
                      <BrainCircuit className="w-4 h-4 text-[#6366f1]" />
                      <span className="text-xs text-white/60 font-mono">synaps — rfp-gov-2026.pdf</span>
                      <div className="ml-auto flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#FF5F56]" />
                        <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                        <div className="w-2 h-2 rounded-full bg-[#27C93F]" />
                      </div>
                    </div>
                    {/* Content area */}
                    <div className="flex-1 grid grid-cols-[240px_1fr] overflow-hidden">
                      {/* Sidebar */}
                      <div className="bg-[#111] border-r border-white/5 p-4 space-y-3">
                        {['RFP Analysis', 'Gap Detection', 'Proposal Draft', 'Compliance Check', 'Export PDF'].map((item, i) => (
                          <div
                            key={i}
                            className={`flex items-center gap-2 text-xs px-3 py-2 rounded-md ${i === 2 ? 'bg-[#6366f1]/20 text-[#818cf8]' : 'text-white/40'}`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${i < 2 ? 'bg-[#27C93F]' : i === 2 ? 'bg-[#6366f1]' : 'bg-white/20'}`} />
                            {item}
                          </div>
                        ))}
                      </div>
                      {/* Main content */}
                      <div className="p-6 space-y-4 overflow-hidden">
                        <div className="space-y-2">
                          <div className="h-3 bg-white/10 rounded w-3/4 animate-pulse" />
                          <div className="h-3 bg-white/6 rounded w-full" />
                          <div className="h-3 bg-white/6 rounded w-5/6" />
                        </div>
                        <div className="bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-lg p-4">
                          <div className="text-xs text-[#818cf8] mb-2 font-mono">Generating proposal section 3/8...</div>
                          <div className="h-2 bg-[#6366f1]/30 rounded-full overflow-hidden">
                            <div className="h-full bg-[#6366f1] rounded-full" style={{ width: '62%' }} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-white/8 rounded w-full" />
                          <div className="h-3 bg-white/6 rounded w-4/5" />
                          <div className="h-3 bg-white/4 rounded w-2/3" />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <div className="flex items-center gap-1.5 text-[10px] text-[#27C93F]">
                            <CheckCircle2 className="w-3 h-3" />
                            47 requirements met
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-[#FF5F56]">
                            <XCircle className="w-3 h-3" />
                            3 gaps flagged
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Laptop base */}
            <div className="bg-[#222] h-5 rounded-b-2xl border border-t-0 border-white/10 flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
              <div className="w-16 h-1 bg-white/10 rounded-full" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── 3D Floating Object (like vanta.supply animations) ─── */
function FloatingObject() {
  return (
    <div className="relative w-[320px] h-[320px] md:w-[450px] md:h-[450px] flex items-center justify-center select-none" style={{ perspective: 1000 }}>
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-[#6366f1]/20 blur-[80px] scale-110" />

      {/* Central Core - pulsing AI brain/cube */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotateX: [5, -5, 5], rotateY: [-5, 5, -5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br from-[#818cf8] to-[#4338ca] shadow-[0_0_60px_rgba(99,102,241,0.6)] flex items-center justify-center border border-white/20 backdrop-blur-md"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <BrainCircuit className="w-16 h-16 text-white drop-shadow-lg" />
      </motion.div>

      {/* Floating Document 1 */}
      <motion.div
        animate={{ y: [-20, 20, -20], x: [-10, 10, -10], rotate: [-10, 5, -10] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute -top-4 -left-12 md:-left-20 z-20 w-24 md:w-32 bg-white rounded-lg shadow-2xl border border-black/10 p-3"
      >
        <div className="w-full h-1 bg-gray-200 rounded mb-2 w-3/4" />
        <div className="w-full h-1 bg-gray-200 rounded mb-1.5" />
        <div className="w-full h-1 bg-gray-200 rounded mb-1.5" />
        <div className="w-full h-1 bg-[#6366f1]/50 rounded mb-1.5 w-5/6" />
        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#10b981] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          <CheckCircle2 className="w-3 h-3 text-white" />
        </div>
      </motion.div>

      {/* Floating Document 2 (RFP) */}
      <motion.div
        animate={{ y: [15, -25, 15], x: [15, -5, 15], rotate: [12, 2, 12] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-8 -right-8 md:-right-16 z-20 w-28 md:w-36 bg-[#111] rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 p-4"
      >
        <div className="text-[8px] md:text-[10px] text-[#818cf8] font-mono mb-2">Gov_RFP_2026.pdf</div>
        <div className="w-full h-1 bg-white/20 rounded mb-2 w-1/2" />
        <div className="w-full h-1 bg-white/10 rounded mb-1.5" />
        <div className="w-full h-1 bg-white/10 rounded mb-1.5" />
        <div className="w-full h-1 bg-white/10 rounded mb-1.5 w-4/5" />
      </motion.div>

      {/* Floating Checkmark / Shield Badge */}
      <motion.div
        animate={{ y: [-15, 15, -15], rotateZ: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute top-10 -right-4 md:-right-8 z-30 w-12 h-12 md:w-16 md:h-16 bg-[#10b981] rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center border border-white/20 backdrop-blur-md"
      >
        <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-white drop-shadow-md" />
      </motion.div>
      
      {/* Floating Database / Memory Badge */}
      <motion.div
        animate={{ y: [20, -10, 20], x: [-20, 0, -20], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-12 -left-8 md:-left-12 z-0 w-12 h-12 md:w-16 md:h-16 bg-[#000] rounded-full shadow-[0_0_30px_rgba(0,0,0,0.8)] flex items-center justify-center border border-white/10 backdrop-blur-md"
      >
        <Database className="w-5 h-5 md:w-7 md:h-7 text-[#6366f1]" />
      </motion.div>
    </div>
  );
}

/* ─── FEATURES (no box borders, clean editorial list style) ─── */
const features = [
  {
    icon: Clock,
    title: 'Weeks → Seconds',
    problem: 'Manual reading of 200-page compliance PDFs takes weeks of human effort.',
    solution: 'Multi-agent pipeline reads massive documents instantly, extracting every requirement before you pour your coffee.',
    color: '#f59e0b',
  },
  {
    icon: Database,
    title: 'Semantic Memory',
    problem: 'Sales reps constantly ask engineers the same technical questions for different RFPs.',
    solution: 'Pinecone vector databases remember every project. Synaps auto-drafts accurate responses from historical data.',
    color: '#6366f1',
  },
  {
    icon: ShieldCheck,
    title: 'Flawless Compliance',
    problem: 'Missing one hidden compliance clause means losing a $5M deal.',
    solution: 'AI acts as a ruthless auditor, explicitly flagging GO/NO-GO risks so you never commit to impossible terms.',
    color: '#10b981',
  },
  {
    icon: Zap,
    title: '15-Page Proposals in Seconds',
    problem: 'Proposal writing takes a whole team 2–3 weeks of back-and-forth.',
    solution: 'Synaps generates structured, technically accurate 15-page proposals on first run, ready for human review.',
    color: '#ec4899',
  },
];

const integrations = [
  { src: '/gmail-3d.png', name: 'Gmail' },
  { src: '/slack-3d.png', name: 'Slack' },
  { src: '/google-3d.png', name: 'Google API' },
  { src: '/office-3d.png', name: 'Microsoft 365' },
  { src: '/twilio-3d.png', name: 'Twilio' },
];

/* ─── MAIN COMPONENT ─── */
export default function ModernLanding() {
  const [demoOpen, setDemoOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -60]);

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div className="grain-overlay" />

      {demoOpen && <DemoModal onClose={() => setDemoOpen(false)} />}

      <div ref={containerRef} className="landing-container min-h-screen bg-[#080808] text-white overflow-x-hidden relative" style={{ fontFamily: "'Bricolage Grotesque', 'Inter', sans-serif" }}>
        <GridLines />

        {/* ── NAV ── */}
        <nav className="fixed top-0 w-full z-50 px-6 md:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrainCircuit className="w-6 h-6 text-[#6366f1]" />
            <span className="font-bold text-lg tracking-tight">Synaps</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#integrations" className="hover:text-white transition-colors">Integrations</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-white/50 hover:text-white transition-colors hidden md:block">Sign in</Link>
            <Link
              href="/register"
              className="text-sm font-semibold px-5 py-2.5 bg-white text-black rounded-full hover:bg-white/90 transition-all hover:scale-105"
            >
              Get early access
            </Link>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 z-10 text-center px-6">
          <motion.div style={{ opacity: heroOpacity, y: heroY }} className="w-full max-w-6xl mx-auto flex flex-col items-center">

            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-white/60 mb-10 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              Autonomous RFP engine — now in private beta
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.8rem,8vw,7rem)] font-extrabold leading-[0.92] tracking-[-0.03em] mb-8"
            >
              <span className="shimmer-text">Win more RFPs.</span>
              <br />
              <span className="text-white/20">Do it in seconds.</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="max-w-2xl text-lg md:text-xl text-white/45 leading-relaxed mb-12 font-light"
            >
              An autonomous AI engine that parses complex compliance documents, queries your company's knowledge base, and generates technically accurate 15-page proposals before your competitors even open the PDF.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform text-base shadow-[0_0_40px_rgba(255,255,255,0.1)]"
              >
                Start for free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => setDemoOpen(true)}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-all text-base bg-white/5 backdrop-blur-sm"
              >
                <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Play className="w-3 h-3 translate-x-[1px]" />
                </span>
                Play demo
              </button>
            </motion.div>
          </motion.div>

          {/* ── 3D FLOATING OBJECT ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 md:mt-24 relative"
          >
            <FloatingObject />
          </motion.div>

          {/* scroll cue */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </section>

        {/* ── INTEGRATIONS MARQUEE ── */}
        <section id="integrations" className="relative z-10 py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-xs font-semibold tracking-[0.25em] uppercase text-white/25 mb-16"
            >
              Natively integrates with your stack
            </motion.p>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              className="flex flex-wrap justify-center gap-12 md:gap-20 items-center"
            >
              {integrations.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                  className="group flex flex-col items-center gap-4"
                  style={{ animationDelay: `${idx * 0.6}s` }}
                >
                  <div
                    className="object-3d w-16 h-16 md:w-20 md:h-20 relative"
                    style={{ animationDelay: `${idx * 0.8}s`, animationDuration: `${5 + idx * 0.7}s` }}
                  >
                    <Image
                      src={item.src}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-[11px] font-medium tracking-widest uppercase text-white/30 group-hover:text-white/60 transition-colors">{item.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── FEATURES — editorial no-box style ── */}
        <section id="features" className="relative z-10 py-32 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-24"
            >
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-white/25 mb-6">Why teams choose Synaps</p>
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-3xl">
                The bottleneck<br />
                <span className="text-white/25">finally destroyed.</span>
              </h2>
            </motion.div>

            <div className="space-y-0">
              {features.map((f, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.7, delay: idx * 0.15, type: "spring", bounce: 0.2 }}
                  className="group grid md:grid-cols-[1fr_1fr_1fr] gap-0 py-10 border-t border-white/5 hover:border-white/10 transition-colors"
                >
                  {/* Index + icon */}
                  <div className="flex items-start gap-5 mb-4 md:mb-0">
                    <span className="text-xs text-white/20 font-mono pt-1 w-6 shrink-0">0{idx + 1}</span>
                    <div>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                        <f.icon className="w-4 h-4" style={{ color: f.color }} />
                      </div>
                      <h3 className="text-xl font-bold tracking-tight">{f.title}</h3>
                    </div>
                  </div>

                  {/* Problem */}
                  <div className="md:px-8 mb-4 md:mb-0">
                    <p className="text-xs font-semibold tracking-widest uppercase text-white/20 mb-3">The Problem</p>
                    <p className="text-white/60 text-lg md:text-xl leading-relaxed">{f.problem}</p>
                  </div>

                  {/* Solution */}
                  <div className="md:pl-8 md:border-l border-white/5">
                    <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: f.color }}>The Fix</p>
                    <p className="text-white text-lg md:text-xl leading-relaxed">{f.solution}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PLAY DEMO FULL CTA SECTION ── */}
        <section className="relative z-10 py-32 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                See it work<br />
                <span className="text-white/20">in real time.</span>
              </h2>
              <p className="text-white/40 text-lg max-w-xl mx-auto mb-12">
                Watch Synaps ingest a 200-page US government RFP and produce a complete, structured 15-page proposal in under 30 seconds.
              </p>
              <button
                onClick={() => setDemoOpen(true)}
                className="group inline-flex items-center gap-4 px-10 py-5 rounded-full border border-white/15 text-white hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all text-lg font-semibold backdrop-blur-sm hover:scale-105"
              >
                <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] group-hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] transition-shadow">
                  <Play className="w-4 h-4 text-black translate-x-[1px]" />
                </span>
                Play demo
              </button>
            </motion.div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="relative z-10 py-32 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-8">
                <div className="w-16 h-16 rounded-2xl bg-[#6366f1]/20 border border-[#6366f1]/30 flex items-center justify-center mx-auto mb-8">
                  <BrainCircuit className="w-8 h-8 text-[#818cf8]" />
                </div>
                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                  Your team wins more.<br />
                  <span className="text-white/20">Starting now.</span>
                </h2>
                <p className="text-white/40 text-lg mb-10">Join forward-thinking teams already automating their RFP workflows.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-2 px-10 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform text-base"
                >
                  Get started free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-10 py-4 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all text-base"
                >
                  Sign in
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="relative z-10 border-t border-white/5 py-10 px-6 md:px-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/20">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-[#6366f1]" />
              <span className="font-semibold">Synaps</span>
            </div>
            <p>&copy; 2026 Synaps. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white/50 transition-colors">Privacy</a>
              <a href="#" className="hover:text-white/50 transition-colors">Terms</a>
              <a href="#" className="hover:text-white/50 transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
