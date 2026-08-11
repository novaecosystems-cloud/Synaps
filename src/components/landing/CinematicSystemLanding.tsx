'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  FileText,
  Lock,
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  Search,
  Database,
  GitBranch,
  AlertTriangle,
  Scale,
  Zap,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import SignInModal from '@/components/SignInModal';
import Link from 'next/link';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// ─── TYPES & INTERFACES ───────────────────────────────────────────────────────
interface MemoryImprint {
  id: string;
  title: string;
  category: 'Legal' | 'Finance' | 'Compliance' | 'Strategy';
  date: string;
  confidence: number;
  snippet: string;
}

const MEMORY_IMPRINTS: MemoryImprint[] = [
  {
    id: 'mem-01',
    title: 'Master Services Agreement v4.2',
    category: 'Legal',
    date: '2026-02-14',
    confidence: 99.4,
    snippet: 'Indemnification cap capped at 2.5x ARR with 30-day cure period.',
  },
  {
    id: 'mem-02',
    title: 'Q3 Enterprise Risk Audit',
    category: 'Compliance',
    date: '2026-05-18',
    confidence: 98.7,
    snippet: 'DPDP Act 2023 data residency compliance verified across EU-Asia nodes.',
  },
  {
    id: 'mem-03',
    title: 'Vendor Procurement Framework',
    category: 'Finance',
    date: '2026-07-02',
    confidence: 97.9,
    snippet: 'Automatic termination clause triggers if SLA drops below 99.95%.',
  },
  {
    id: 'mem-04',
    title: 'Executive Boardroom Minutes',
    category: 'Strategy',
    date: '2026-08-01',
    confidence: 99.8,
    snippet: 'Approval of $12M multi-region infrastructure expansion.',
  },
];

// ─── 3D CYBERNETIC STRUCTURE CANVAS (Zero purple, pure performance) ──────────
function CinematicSystemCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 1000);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Assembly Nodes
    const numNodes = 64;
    const radius = Math.min(width, height) * 0.34;
    const nodes: { ox: number; oy: number; oz: number; size: number }[] = [];

    for (let i = 0; i < numNodes; i++) {
      const phi = Math.acos(-1 + (2 * i) / numNodes);
      const theta = Math.sqrt(numNodes * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      nodes.push({ ox: x, oy: y, oz: z, size: Math.random() * 2.2 + 1 });
    }

    let angleX = 0;
    let angleY = 0;
    let targetAngleX = 0;
    let targetAngleY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetAngleY = ((e.clientX - cx) / rect.width) * 0.6;
      targetAngleX = ((e.clientY - cy) / rect.height) * 0.6;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const render = () => {
      ctx.fillStyle = '#07080c';
      ctx.fillRect(0, 0, width, height);

      // System coordinate grid
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.03)';
      ctx.lineWidth = 1;
      const step = 44;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      angleX += (targetAngleX - angleX) * 0.04 + 0.002;
      angleY += (targetAngleY - angleY) * 0.04 + 0.004;

      const fov = 440;
      const cx = width / 2;
      const cy = height / 2;

      const projected: { x: number; y: number; scale: number; z: number }[] = [];

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const radX = angleX;
        const radY = angleY;

        let y1 = node.oy * Math.cos(radX) - node.oz * Math.sin(radX);
        let z1 = node.oy * Math.sin(radX) + node.oz * Math.cos(radX);

        let x2 = node.ox * Math.cos(radY) + z1 * Math.sin(radY);
        let z2 = -node.ox * Math.sin(radY) + z1 * Math.cos(radY);

        const scale = fov / (fov + z2 + 300);
        const px = x2 * scale + cx;
        const py = y1 * scale + cy;

        projected.push({ x: px, y: py, scale, z: z2 });
      }

      // Render wireframe relationships (Cobalt Blue & Cyan)
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 135) {
            const alpha = (1 - dist / 135) * 0.38 * projected[i].scale;
            ctx.strokeStyle = `rgba(0, 150, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.stroke();
          }
        }
      }

      // Render glowing structure joints
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const node = nodes[i];
        const size = node.size * p.scale;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, size), 0, Math.PI * 2);
        ctx.fillStyle = p.z > 0 ? '#00f0ff' : '#0055ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = p.z > 0 ? 10 : 3;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block rounded-2xl cursor-grab active:cursor-grabbing" />;
}

// ─── MAIN LANDING PAGE COMPONENT ───────────────────────────────────────────────
export default function CinematicSystemLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'clause' | 'question' | 'memory' | 'decision'>('clause');
  const [agentProgress, setAgentProgress] = useState(0);
  const [agentSearching, setAgentSearching] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const logoMarkRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);

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

  // GSAP ScrollTrigger Assembly Animations
  useGSAP(
    () => {
      if (!logoMarkRef.current) return;

      // Opening Logo Assembly Animation
      gsap.fromTo(
        logoMarkRef.current,
        { scale: 0.85, opacity: 0, filter: 'blur(10px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.6, ease: 'power3.out' }
      );

      // Reveal sections on scroll
      const slideElements = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      slideElements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
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

  const triggerAgentSearch = () => {
    setAgentSearching(true);
    setAgentProgress(0);

    const interval = setInterval(() => {
      setAgentProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setAgentSearching(false);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#07080c] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* ── FIXED HEADER ──────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 sm:px-12 py-5 flex items-center justify-between backdrop-blur-xl bg-[#07080c]/80 border-b border-white/10 transition-all">
        <div ref={logoMarkRef} className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 p-[1px] shadow-[0_0_24px_rgba(0,150,255,0.35)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-[11px] bg-[#07080c] flex items-center justify-center">
              <span className="font-mono text-xl font-bold text-cyan-400">S</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-lg font-bold text-white tracking-wider leading-none">SYNAPS</span>
            <span className="font-mono text-[9px] text-cyan-400/80 tracking-widest uppercase">EVIDENCE BRAIN</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-mono text-xs text-slate-400 tracking-wider">
          <a href="#transformation" className="hover:text-cyan-400 transition-colors uppercase">01 // THESIS</a>
          <a href="#intelligence" className="hover:text-cyan-400 transition-colors uppercase">02 // EVIDENCE</a>
          <a href="#memory" className="hover:text-cyan-400 transition-colors uppercase">03 // MEMORY</a>
          <a href="#decision" className="hover:text-cyan-400 transition-colors uppercase">04 // DECISION</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/chat"
            className="hidden sm:flex items-center gap-2 font-mono text-xs font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-lg border border-white/10 hover:border-cyan-500/40 bg-white/5 hover:bg-cyan-500/10 transition-all"
          >
            <span>OPEN APP</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
          </Link>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold uppercase tracking-wider shadow-[0_0_24px_rgba(0,85,255,0.4)] hover:shadow-[0_0_32px_rgba(0,150,255,0.6)] transition-all flex items-center gap-2"
          >
            <span>ENTER SYNAPS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ── 03 SCENE: OPENING & HERO TRANSFORMATION ───────────────────────────── */}
      <section ref={heroSectionRef} className="relative pt-36 sm:pt-44 pb-20 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-mono text-xs uppercase tracking-widest mb-6">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>SYNAPS 3.4 · DPDP ACT COMPLIANT</span>
        </div>

        <h1 className="font-mono text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-none mb-6">
          AN INTELLIGENCE SYSTEM <br />
          <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-sky-300 bg-clip-text text-transparent">
            REVEALING ITSELF.
          </span>
        </h1>

        <p className="max-w-2xl text-slate-400 text-base sm:text-lg leading-relaxed mb-10 font-sans">
          Synaps transforms complex unstructured contracts, financial models, and governance documents into an auditable, interconnected evidence engine — with line-level verification and 0% hallucinations.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_32px_rgba(0,85,255,0.45)] hover:scale-105 transition-all flex items-center gap-2.5"
          >
            <span>LAUNCH SYSTEM</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <Link
            href="/dashboard"
            className="px-7 py-3.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 font-mono text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2.5"
          >
            <span>EXPLORE WORKSPACE</span>
            <ArrowUpRight className="w-4 h-4 text-cyan-400" />
          </Link>
        </div>

        {/* 3D Cyber Core Canvas Container */}
        <div className="w-full h-[450px] sm:h-[580px] lg:h-[680px] relative rounded-2xl overflow-hidden border border-cyan-500/25 shadow-[0_0_60px_rgba(0,150,255,0.15)] bg-[#07080c]">
          <CinematicSystemCanvas />
          <div className="absolute top-4 right-4 pointer-events-none z-10 flex items-center gap-2 bg-[#07080c]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-cyan-500/30">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-mono text-[10px] text-cyan-300 uppercase tracking-widest font-bold">3D INTERACTIVE SYNAPS ENGINE</span>
          </div>
        </div>
      </section>

      {/* ── 04 SCENE: HERO TRANSFORMATION (Document -> Evidence) ──────────────── */}
      <section id="transformation" className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid lg:grid-cols-12 gap-12 items-center" data-reveal>
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="font-mono text-xs text-cyan-400 uppercase tracking-widest font-bold">// 01 TRANSFORMATION THESIS</div>
            <h2 className="font-mono text-3xl sm:text-4xl font-bold text-white leading-tight">
              FROM UNSTRUCTURED TEXT TO DECISION-READY EVIDENCE.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              When a document enters Synaps, it does not remain a static file. It gets scanned, parsed, cross-referenced, and linked to organizational memory.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-2 font-mono text-xs text-slate-300">
              <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>1. PDF / DOCX Scan</span>
              </div>
              <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>2. Concept Parse</span>
              </div>
              <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 flex items-center gap-2.5">
                <GitBranch className="w-4 h-4 text-amber-400" />
                <span>3. Relation Mapping</span>
              </div>
              <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>4. Evidence Verify</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#0d0f17] shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10 font-mono text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-slate-300">Global_Supply_Agreement_v3.pdf</span>
                </div>
                <span className="text-cyan-400 font-semibold">SYNAPS PARSER ACTIVE</span>
              </div>

              <div className="space-y-4 font-mono text-xs sm:text-sm leading-relaxed text-slate-300">
                <p className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <strong className="text-slate-100">Section 14.2 [Indemnification]:</strong> Supplier agrees to indemnify, defend, and hold harmless Customer against any losses exceeding <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40">$2,500,000 USD</span> arising out of data protection breaches.
                </p>
                <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-200 space-y-2">
                  <div className="flex items-center justify-between font-bold text-xs uppercase tracking-wider text-cyan-300">
                    <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-cyan-400" /> SYNAPS EVIDENCE INSIGHT</span>
                    <span>100% CONFIDENCE</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Cross-referenced with Q2 Compliance Framework: Liability cap is <strong className="text-cyan-300">$500k higher</strong> than standard guidelines. Requires Chief Legal Officer sign-off.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 06 SCENE: DOCUMENT INTELLIGENCE & "ONE QUESTION" MOMENT ──────────── */}
      <section id="intelligence" className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-16" data-reveal>
          <div className="font-mono text-xs text-cyan-400 uppercase tracking-widest font-bold mb-3">// 02 EVIDENTIARY REASONING</div>
          <h2 className="font-mono text-3xl sm:text-5xl font-bold text-white mb-4">
            ASK ONE QUESTION. REVEAL THE ENTIRE TRUTH.
          </h2>
          <p className="text-slate-400 text-base">
            Synaps does not return vague summaries. It points directly to exact clauses, sources, and line-level evidence across your entire repository.
          </p>
        </div>

        {/* Interactive Tabbed Intelligence Demonstrator */}
        <div className="rounded-2xl border border-white/10 bg-[#0d0f17] overflow-hidden shadow-2xl" data-reveal>
          <div className="flex flex-wrap border-b border-white/10 bg-black/40 p-2 gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveTab('clause')}
              className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'clause' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Cross-Document Clause Analysis</span>
            </button>
            <button
              onClick={() => setActiveTab('question')}
              className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'question' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>"What Changed?" Engine</span>
            </button>
            <button
              onClick={() => setActiveTab('memory')}
              className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'memory' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Spatial Memory Imprints</span>
            </button>
            <button
              onClick={() => setActiveTab('decision')}
              className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'decision' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Executive Decision Matrix</span>
            </button>
          </div>

          <div className="p-6 sm:p-10">
            <AnimatePresence mode="wait">
              {activeTab === 'clause' && (
                <motion.div key="clause" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <div className="flex items-center justify-between font-mono text-xs text-slate-400">
                    <span>DOCUMENT A: MSA_Acme_2026.pdf</span>
                    <span className="text-cyan-400">LINKED TO DOCUMENT B: Risk_Policy_v2.pdf</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 font-mono text-xs sm:text-sm">
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
                      <div className="text-slate-400 font-bold uppercase">Source Clause 19.4</div>
                      <p className="text-slate-200">"Notice of termination must be served strictly 60 days prior to annual renewal date."</p>
                    </div>
                    <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 space-y-2 text-cyan-200">
                      <div className="text-cyan-300 font-bold uppercase">Synaps Cross-Verification</div>
                      <p className="text-slate-300">Conflict detected with Standard Operational Playbook (30-day requirement). Alert flagged for Operations team.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'question' && (
                <motion.div key="question" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-200 font-mono text-sm flex items-center justify-between">
                    <span className="font-semibold text-white">QUERY: "What changed in liability limits between 2025 and 2026 vendor agreements?"</span>
                    <span className="text-xs text-cyan-400 bg-cyan-500/20 px-2.5 py-1 rounded">EXECUTION: 140ms</span>
                  </div>
                  <div className="p-5 rounded-xl border border-white/10 bg-black/40 space-y-3 font-mono text-xs text-slate-300">
                    <div className="text-emerald-400 font-bold">✓ 3 KEY DISCREPANCIES DETECTED:</div>
                    <ul className="space-y-2 list-disc list-inside text-slate-300">
                      <li>2025 Cap: $1,000,000 USD (Fixed) → 2026 Cap: 2.5x Contract Value</li>
                      <li>Data Breach Indemnity: Excluded in 2025 → Mandatory $5M cover in 2026</li>
                      <li>Governing Jurisdiction: Delaware → London International Arbitration</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeTab === 'memory' && (
                <motion.div key="memory" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="grid sm:grid-cols-2 gap-4">
                  {MEMORY_IMPRINTS.map((mem) => (
                    <div key={mem.id} className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-cyan-500/40 transition-all font-mono text-xs space-y-2">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-cyan-400 font-bold">{mem.category}</span>
                        <span>{mem.date}</span>
                      </div>
                      <div className="text-slate-100 font-bold text-sm">{mem.title}</div>
                      <p className="text-slate-400 text-xs">{mem.snippet}</p>
                      <div className="pt-2 border-t border-white/5 text-[10px] text-emerald-400 flex items-center justify-between">
                        <span>CONFIDENCE: {mem.confidence}%</span>
                        <span>AUDITED</span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'decision' && (
                <motion.div key="decision" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 font-mono text-xs sm:text-sm font-semibold flex items-center justify-between">
                    <span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-400" /> EXECUTIVE RECOMMENDATION: APPROVE WITH CONDITIONS</span>
                    <span className="text-xs bg-amber-500/20 px-2 py-0.5 rounded text-amber-300">MEDIUM RISK</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs text-center">
                    <div className="p-3 rounded-lg border border-white/10 bg-white/5"><div className="text-slate-400 text-[10px]">FACTS</div><div className="text-white font-bold mt-1">14 Clauses Verified</div></div>
                    <div className="p-3 rounded-lg border border-white/10 bg-white/5"><div className="text-amber-400 text-[10px]">RISKS</div><div className="text-amber-300 font-bold mt-1">1 Jurisdiction Conflict</div></div>
                    <div className="p-3 rounded-lg border border-white/10 bg-white/5"><div className="text-blue-400 text-[10px]">DEPENDENCIES</div><div className="text-blue-300 font-bold mt-1">DPDP Act Section 7</div></div>
                    <div className="p-3 rounded-lg border border-white/10 bg-white/5"><div className="text-emerald-400 text-[10px]">OPTIONS</div><div className="text-emerald-300 font-bold mt-1">Add Amendment Addendum</div></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── 10 SCENE: AUTONOMOUS AGENT WORKFLOW ───────────────────────────────── */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid lg:grid-cols-12 gap-12 items-center" data-reveal>
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="font-mono text-xs text-cyan-400 uppercase tracking-widest font-bold">// 03 AUTONOMOUS WORKFLOWS</div>
            <h2 className="font-mono text-3xl sm:text-4xl font-bold text-white leading-tight">
              SYNAPS AGENTS ACT. THEY DON'T JUST CHAT.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Delegate complex multi-document auditing, compliance reviews, and proposal drafting to autonomous Synaps agents. Watch them parse, verify, and output actionable results.
            </p>

            <button
              onClick={triggerAgentSearch}
              disabled={agentSearching}
              className="w-fit px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2.5 shadow-[0_0_24px_rgba(0,85,255,0.35)]"
            >
              <Cpu className="w-4 h-4 text-cyan-300" />
              <span>{agentSearching ? 'EXECUTING AGENT WORKFLOW...' : 'RUN LIVE AGENT DEMO'}</span>
            </button>
          </div>

          <div className="lg:col-span-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-[#0d0f17] font-mono text-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-slate-400">
                <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-cyan-400" /> AGENT TASK: AUDIT INDEMNIFICATION CLAUSES</span>
                <span className="text-cyan-400 font-bold">{agentProgress}%</span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 transition-all duration-150" style={{ width: `${agentProgress}%` }} />
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-black/40 space-y-2 text-slate-300">
                <div>[14:27:01] Scanning 142 repository files...</div>
                {agentProgress >= 30 && <div className="text-blue-400">[14:27:02] Identified 7 indemnification references across 4 agreements.</div>}
                {agentProgress >= 70 && <div className="text-amber-400">[14:27:03] Flagged 1 outdated liability cap in MSA_2024.pdf.</div>}
                {agentProgress >= 100 && <div className="text-emerald-400 font-bold">[14:27:04] WORKFLOW COMPLETE. Report generated & saved to Workspace.</div>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 15 SCENE: FINAL CONVERGENCE & ENTRY ──────────────────────────────── */}
      <section className="py-32 px-6 sm:px-12 max-w-5xl mx-auto text-center border-t border-white/10 relative" data-reveal>
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-400 to-sky-300 p-[1px] mx-auto mb-8 shadow-[0_0_50px_rgba(0,150,255,0.4)]">
          <div className="w-full h-full rounded-[15px] bg-[#07080c] flex items-center justify-center">
            <span className="font-mono text-2xl font-bold text-cyan-400">S</span>
          </div>
        </div>

        <h2 className="font-mono text-3xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">
          YOUR INFORMATION ALREADY KNOWS MORE THAN YOU THINK.
        </h2>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop searching blindly through endless folders. Unlock the hidden evidentiary relationships inside your organization.
        </p>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-9 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-sm font-bold uppercase tracking-widest shadow-[0_0_40px_rgba(0,85,255,0.5)] hover:scale-105 transition-all inline-flex items-center gap-3"
        >
          <span>ENTER SYNAPS SYSTEM</span>
          <ArrowRight className="w-4 h-4 text-cyan-300" />
        </button>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="py-12 px-6 sm:px-12 border-t border-white/10 font-mono text-xs text-slate-500 flex flex-wrap items-center justify-between gap-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-slate-300 font-bold">SYNAPS AI</span>
          <span>© 2026 SYNAPS ENTERPRISE INC.</span>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <Link href="/legal/terms" className="hover:text-cyan-400 transition-colors">TERMS</Link>
          <Link href="/legal/privacy" className="hover:text-cyan-400 transition-colors">PRIVACY</Link>
          <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">DASHBOARD</Link>
        </div>
      </footer>

      {/* Sign In Modal */}
      <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
