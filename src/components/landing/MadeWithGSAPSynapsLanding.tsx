'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import WaitlistModal from '../WaitlistModal';
import SpotlightTiltCard from './SpotlightTiltCard';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

// ─── TEXT SCRAMBLE ────────────────────────────────────────────────────────────
class TextScrambler {
  private el: HTMLElement;
  private chars = '!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ01234';
  private queue: { from: string; to: string; start: number; end: number; char?: string }[] = [];
  private frame = 0;
  private frameReq = 0;
  private resolve!: () => void;

  constructor(el: HTMLElement) {
    this.el = el;
    this.update = this.update.bind(this);
  }

  setText(newText: string): Promise<void> {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise<void>((resolve) => { this.resolve = resolve; });
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 18);
      const end = start + Math.floor(Math.random() * 18);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameReq);
    this.frame = 0;
    this.update();
    return promise;
  }

  private update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      const { from, to, start, end } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!this.queue[i].char || Math.random() < 0.28) {
          this.queue[i].char = this.chars[Math.floor(Math.random() * this.chars.length)];
        }
        output += `<span style="color:#CAFF00;opacity:0.5">${this.queue[i].char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameReq = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

// ─── HORIZONTAL MARQUEE ───────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  'ENTERPRISE INTELLIGENCE', 'DECISION MEMORY', 'AI AGENTS', 'CORPORATE GRAPH',
  'BOARDROOM SIMULATION', 'KNOWLEDGE INGESTION', 'RISK ANALYSIS', 'STRATEGY STUDIO',
];

function Marquee({ reverse = false }: { reverse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const w = ref.current.scrollWidth / 2;
    gsap.fromTo(ref.current, { x: reverse ? -w : 0 }, {
      x: reverse ? 0 : -w, duration: 32, ease: 'none', repeat: -1,
    });
  }, [reverse]);
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <div ref={ref} style={{ display: 'flex', gap: 56, whiteSpace: 'nowrap', width: 'max-content' }}>
        {items.map((item, i) => (
          <span key={i} style={{
            fontSize: 11, fontWeight: 500, letterSpacing: '4px',
            color: i % 3 === 0 ? '#CAFF00' : 'rgba(255,255,255,0.18)',
            fontFamily: "'Supply Mono', 'JetBrains Mono', monospace",
            textTransform: 'uppercase'
          }}>
            {item} <span style={{ color: 'rgba(255,255,255,0.1)', marginLeft: 8 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const SUITES = [
  { id: '01', tag: 'COMMAND CONSOLE', label: 'AI COO Command Console', sub: 'Briefing & Operational Intelligence', color: '#CAFF00', dark: '#0A0A0A',
    desc: 'Transforms all your documents, emails, CRMs, and contracts into a real-time operational briefing — grounded in your actual organizational memory, never hallucinated.',
    specs: ['Org Health Score & Coverage', 'Decision Confidence Meter', 'Zero-Retention Memory SLA', '24/7 Real-Time Anomaly Audit'],
    stat: '99.4%', statLabel: 'Synthesis Accuracy' },
  { id: '02', tag: 'FLIGHT CONTROL', label: 'Multi-Agent Flight Control', sub: '10 Parallel AI Agent Orchestration', color: '#FFFFFF', dark: '#0A0A0A',
    desc: 'Orchestrates 10 specialized AI agents (Research, Finance, Legal, Engineering, Infosec, HR) simultaneously — each grounded in your company knowledge graph.',
    specs: ['10 Specialized Agent Personas', 'Shared Memory Graph Pipeline', 'Parallel Task Execution', 'Full Audit Log & Provenance'],
    stat: '10×', statLabel: 'Parallel Throughput' },
  { id: '03', tag: 'DIGITAL TWINS', label: 'Executive Boardroom Twins', sub: '8 C-Suite Personas, Zero Hallucination', color: '#CAFF00', dark: '#0A0A0A',
    desc: 'Simulates how your CEO, CFO, CTO, Legal, HR would respond to any strategic scenario — grounded in historical company memory and risk tolerances.',
    specs: ['8 C-Suite Persona Twins', 'Stress-Testing Strategic Options', 'Consensus & Divergence Heatmaps', 'Debate Record Generation'],
    stat: '8', statLabel: 'C-Suite Personas' },
  { id: '04', tag: 'STRATEGY STUDIO', label: 'AI Strategy Studio', sub: '11-Stage Enterprise Roadmap Generator', color: '#FFFFFF', dark: '#0A0A0A',
    desc: 'Formulates end-to-end enterprise strategy documents, competitive threat analysis, Red-Team AI challenges, and 11-stage execution roadmaps in minutes.',
    specs: ['11-Stage Transformation Roadmap', 'Competitive Threat Scanning', 'Resource & Budget Allocation', 'Risk Mitigation Playbook'],
    stat: '110', statLabel: 'Decision Models' },
];

const STATS = [
  { v: '110', l: 'Decision Models', n: '01' },
  { v: '99.4%', l: 'Confidence Score', n: '02' },
  { v: '10', l: 'Parallel Agents', n: '03' },
  { v: '<2s', l: 'Reasoning Latency', n: '04' },
];

const USP_ITEMS = [
  {
    tag: '01 / MEMORY',
    title: 'Permanent\nOrganizational\nMemory',
    desc: 'Every document, email, contract, and decision your organization has ever made — indexed, linked, and retrievable in under 2 seconds.',
    accent: '#CAFF00',
  },
  {
    tag: '02 / AGENTS',
    title: '10 Specialized\nAI Agents\nWorking in Parallel',
    desc: 'Research, Finance, Legal, Engineering, Infosec, and HR agents run simultaneously — each grounded in your actual company knowledge graph.',
    accent: '#a8ff78',
  },
  {
    tag: '03 / BOARDROOM',
    title: '8 C-Suite\nDigital Twins\nat Your Command',
    desc: 'Simulate how your CEO, CFO, and CTO would respond to any scenario before it reaches the real boardroom.',
    accent: '#CAFF00',
  },
  {
    tag: '04 / STRATEGY',
    title: 'Enterprise\nRoadmaps in\nMinutes Not Months',
    desc: '11-stage transformation roadmaps, competitive threat analysis, and Red-Team AI challenges generated at machine speed.',
    accent: '#d4ff4d',
  },
];

// ─── FLUID BLOB BACKGROUND ────────────────────────────────────────────────────
function FluidBlob({ color = '#CAFF00', size = 600, x = 0, y = 0, delay = 0 }: {
  color?: string; size?: number; x?: number; y?: number; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: x + (Math.random() - 0.5) * 80,
      y: y + (Math.random() - 0.5) * 80,
      scale: 0.85 + Math.random() * 0.3,
      duration: 6 + Math.random() * 4,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay,
    });
  }, []);
  return (
    <div ref={ref} style={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      filter: 'blur(120px)',
      opacity: 0.07,
      pointerEvents: 'none',
      left: `calc(50% + ${x}px - ${size / 2}px)`,
      top: `calc(50% + ${y}px - ${size / 2}px)`,
    }} />
  );
}

// ─── ANIMATED WORD REVEAL ─────────────────────────────────────────────────────
function WordReveal({ children, delay = 0, className = '' }: { children: string; delay?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay }
    );
  }, [delay]);
  return (
    <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
      <span ref={ref} className={className} style={{ display: 'inline-block', opacity: 0 }}>{children}</span>
    </span>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function MadeWithGSAPSynapsLanding() {
  const [billingCycle, setBillingCycle] = useState<'weekly' | 'monthly' | 'annual'>('weekly');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCard, setActiveCard] = useState(0);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorActive, setCursorActive] = useState(false);
  const heroWordRef = useRef<HTMLSpanElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Custom cursor
  useEffect(() => {
    const move = (e: MouseEvent) => { setCursorPos({ x: e.clientX, y: e.clientY }); setCursorActive(true); };
    const leave = () => setCursorActive(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseleave', leave);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseleave', leave); };
  }, []);

  // GSAP: Hero entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-badge', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 });
      gsap.fromTo('.hero-sub', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 1.2 });
      gsap.fromTo('.hero-cta', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.5 });
      gsap.fromTo('.hero-stats', { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out', delay: 1.8 });
    });
    return () => ctx.revert();
  }, []);

  // GSAP: ScrollTrigger reveals — clip-path style like incredibles.dev
  useEffect(() => {
    const sections = document.querySelectorAll('.reveal-section');
    sections.forEach(el => {
      gsap.fromTo(el.querySelectorAll('.reveal-child'),
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none none' }
        }
      );
    });

    // Media clip-path reveal (incredibles.dev style)
    document.querySelectorAll('.media-reveal').forEach(el => {
      gsap.fromTo(el,
        { clipPath: 'inset(6% 6% 6% 6% round 1.5rem)', scale: 1.08, opacity: 0 },
        {
          clipPath: 'inset(0% 0% 0% 0% round 1.5rem)', scale: 1, opacity: 1,
          duration: 1.0, ease: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
          scrollTrigger: { trigger: el, start: 'top 80%' }
        }
      );
    });

    // Stat counters
    document.querySelectorAll('.stat-num').forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });

    // Sticky USP section
    ScrollTrigger.create({
      trigger: '.usp-sticky-section',
      start: 'top top',
      end: 'bottom bottom',
      pin: '.usp-sticky-header',
      pinSpacing: false,
    });
  }, []);

  // Scramble rotating word
  useEffect(() => {
    const words = ['INTELLIGENCE', 'MEMORY', 'DECISIONS', 'INSIGHT', 'STRATEGY'];
    let idx = 0;
    const el = heroWordRef.current;
    if (!el) return;
    const scrambler = new TextScrambler(el);
    const cycle = () => {
      scrambler.setText(words[idx]).then(() => { setTimeout(cycle, 2400); });
      idx = (idx + 1) % words.length;
    };
    const timer = setTimeout(cycle, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
      if (e.key === 'Escape') { setSearchOpen(false); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // Auto rotate suite cards
  useEffect(() => {
    const t = setInterval(() => setActiveCard(p => (p + 1) % SUITES.length), 3800);
    return () => clearInterval(t);
  }, []);

  const filteredSuites = searchQuery ? SUITES.filter(s =>
    s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tag.toLowerCase().includes(searchQuery.toLowerCase())
  ) : SUITES;

  return (
    <div style={{ background: '#000', color: '#fff', fontFamily: "'Neue Montreal', 'Plus Jakarta Sans', sans-serif", minHeight: '100vh', overflowX: 'hidden' }} className="relative">

      {/* ── GLOBAL CSS ─────────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        @font-face {
          font-family: 'Neue Montreal';
          font-style: normal;
          font-weight: 300;
          src: local('Plus Jakarta Sans');
        }

        *{margin:0;padding:0;box-sizing:border-box;}
        html{scroll-behavior:smooth;}
        body{background:#000;overflow-x:hidden;}
        ::selection{background:#CAFF00;color:#000;}

        /* ── CUSTOM CURSOR ── */
        .custom-cursor {
          position: fixed; width: 8px; height: 8px; background: #CAFF00;
          border-radius: 50%; pointer-events: none; z-index: 9999;
          transition: transform 0.15s cubic-bezier(0.23,1,0.32,1);
          mix-blend-mode: difference;
        }

        /* ── FONTS ── */
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        /* ── NAV ── */
        .nav-pill {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          backdrop-filter: blur(16px);
          border-radius: 999px;
          padding: 6px 18px;
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .nav-link {
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          font-size: 12.5px;
          font-weight: 500;
          letter-spacing: 0.03em;
          padding: 5px 12px;
          border-radius: 999px;
          transition: all 0.22s;
          white-space: nowrap;
        }
        .nav-link:hover { color: #fff; background: rgba(255,255,255,0.07); }

        /* ── BUTTONS ── */
        .btn-lime {
          display: inline-flex; align-items: center; gap: 8px;
          background: #CAFF00; color: #000;
          border: none; font-family: 'Space Grotesk', sans-serif;
          font-size: 13.5px; font-weight: 700; letter-spacing: 0.01em;
          padding: 13px 26px; border-radius: 999px; cursor: pointer;
          text-decoration: none; transition: all 0.3s cubic-bezier(0.23,1,0.32,1);
          position: relative; overflow: hidden;
        }
        .btn-lime::after {
          content: ''; position: absolute; inset: 0;
          background: rgba(0,0,0,0); transition: background 0.25s;
        }
        .btn-lime:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(202,255,0,0.3); }

        .btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.14);
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13.5px; font-weight: 500; letter-spacing: 0.01em;
          padding: 13px 26px; border-radius: 999px; cursor: pointer;
          text-decoration: none; transition: all 0.25s;
        }
        .btn-outline:hover { border-color: rgba(255,255,255,0.45); color: #fff; }

        /* ── DISPLAY TYPOGRAPHY ── */
        .display-xl {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(62px, 9.5vw, 144px);
          font-weight: 900;
          line-height: 0.9;
          letter-spacing: -0.045em;
          color: #fff;
        }
        .display-lg {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(44px, 6.5vw, 96px);
          font-weight: 900;
          line-height: 0.92;
          letter-spacing: -0.04em;
          color: #fff;
        }
        .display-md {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(34px, 4.5vw, 68px);
          font-weight: 900;
          line-height: 0.96;
          letter-spacing: -0.035em;
          color: #fff;
        }
        .display-lime { color: #CAFF00; }
        .display-dim { color: rgba(255,255,255,0.2); }
        .display-muted { color: rgba(255,255,255,0.5); }

        /* ── SECTION LABEL (supply mono style) ── */
        .label-mono {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px;
          font-weight: 600;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .label-mono-lime { color: #CAFF00; }

        /* ── SEPARATORS ── */
        .sep { width: 100%; height: 1px; background: rgba(255,255,255,0.07); }

        /* ── GLASS CARD (haoqi.design flat grid style) ── */
        .glass-card {
          background: #0d0d0d;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          overflow: hidden;
          transition: border-color 0.35s, transform 0.35s cubic-bezier(0.23,1,0.32,1);
        }
        .glass-card:hover {
          border-color: rgba(202,255,0,0.2);
          transform: translateY(-4px);
        }

        /* ── USP CARDS (incredibles.dev style) ── */
        .usp-card {
          background: #0c0c0c;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 36px;
          display: flex; flex-direction: column;
          transition: all 0.5s cubic-bezier(0.23,1,0.32,1);
          position: relative; overflow: hidden;
        }
        .usp-card::before {
          content: '';
          position: absolute;
          top: -60%; left: -20%;
          width: 70%; height: 70%;
          background: radial-gradient(circle, rgba(202,255,0,0.06) 0%, transparent 70%);
          pointer-events: none;
          transition: opacity 0.5s;
          opacity: 0;
        }
        .usp-card:hover::before { opacity: 1; }

        /* ── PRICING ── */
        .pricing-card {
          background: #0c0c0c;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 36px 32px;
          display: flex; flex-direction: column;
          transition: transform 0.35s cubic-bezier(0.23,1,0.32,1);
        }
        .pricing-card:hover { transform: translateY(-5px); }
        .pricing-card.featured {
          background: linear-gradient(145deg, #0f1a00, #0d0d0d);
          border-color: rgba(202,255,0,0.3);
          box-shadow: 0 0 60px rgba(202,255,0,0.08), inset 0 0 40px rgba(202,255,0,0.03);
        }

        /* ── T-LINK (incredibles.dev underline animation) ── */
        .t-link {
          position: relative;
          display: inline-block;
          text-decoration: none;
          color: inherit;
        }
        .t-link::before {
          content: '';
          position: absolute;
          bottom: -1px; left: 0;
          width: 100%; height: 1px;
          background: currentColor;
          transform: scaleX(0);
          transform-origin: 100% 50%;
          transition: transform 0.3s cubic-bezier(0.645,0.045,0.355,1);
        }
        .t-link:hover::before {
          transform: scaleX(1);
          transform-origin: 0 50%;
        }

        /* ── MARQUEE ── */
        .marquee-wrap { padding: 20px 0; border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); }

        /* ── SCROLLBAR ── */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 4px; }

        /* ── GRID HELPERS ── */
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .hide-mob { display: none !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .grid-3 { grid-template-columns: 1fr 1fr !important; }
          .grid-4 { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .grid-3, .grid-4 { grid-template-columns: 1fr !important; }
        }

        /* ── KEYFRAMES ── */
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .blink { animation: blink 1s step-start infinite; }

        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .float { animation: float 5s ease-in-out infinite; }

        @keyframes pulse-dot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.8);opacity:0.3} }
        .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }

        @keyframes spin-slow { to{transform:rotate(360deg)} }
        .spin-slow { animation: spin-slow 20s linear infinite; }

        /* ── OVERFLOW CLIP ── */
        .overflow-clip { overflow: hidden; }

        /* ── DOTTED BORDER HOVER (haoqi.design style) ── */
        .dotted-hover {
          position: relative;
        }
        .dotted-hover::before {
          content: '';
          position: absolute;
          inset: -2px;
          border: 2px dotted transparent;
          border-radius: inherit;
          pointer-events: none;
          transition: border-color 0.22s;
        }
        .dotted-hover:hover::before {
          border-color: rgba(202,255,0,0.5);
        }

        /* ── STEP LINES (how it works) ── */
        .step-line {
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .step-line + .step-line {
          border-left: 1px solid rgba(255,255,255,0.07);
        }

        /* ── CTA SECTION ── */
        .cta-section {
          background: #CAFF00;
          position: relative;
          overflow: hidden;
        }
        .cta-section::before {
          content: '';
          position: absolute;
          top: -40%; right: -10%;
          width: 600px; height: 600px;
          background: rgba(0,0,0,0.06);
          border-radius: 50%;
          pointer-events: none;
        }

        /* ── HERO GRID OVERLAY ── */
        .hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
        }

        /* ── WORD REVEAL LINES ── */
        .word-line {
          display: block;
          overflow: hidden;
        }
      `}</style>

      {/* ── CUSTOM CURSOR ──────────────────────────────────────────────────── */}
      <div
        className="custom-cursor"
        style={{
          transform: `translate(${cursorPos.x - 4}px, ${cursorPos.y - 4}px)`,
          opacity: cursorActive ? 1 : 0,
        }}
      />

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <header style={{
        position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
        width: 'calc(100% - 48px)', maxWidth: 1280, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }} className="dotted-hover">
          <div style={{
            width: 34, height: 34, background: '#CAFF00', borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 900, color: '#000', fontFamily: "'Space Grotesk', sans-serif",
          }}>S</div>
          <span style={{ fontSize: 15.5, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', fontFamily: "'Space Grotesk', sans-serif" }}>SYNAPS.AI</span>
        </Link>

        {/* Nav pill */}
        <nav className="nav-pill hide-mob">
          {['Console', 'Agents', 'Boardroom', 'Strategy', 'Pricing'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link">{item}</a>
          ))}
          <Link href="/demo" className="nav-link" style={{ color: '#CAFF00', fontWeight: 700 }}>⚡ Demo</Link>
        </nav>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.09)',
              color: 'rgba(255,255,255,0.35)',
              padding: '7px 13px', borderRadius: 999, fontSize: 11.5,
              fontWeight: 600, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.06em',
            }}
            className="hide-mob"
          >
            ⌘ K
          </button>
          <Link href="/demo" style={{
            color: '#CAFF00', border: '1px solid rgba(202,255,0,0.25)',
            textDecoration: 'none', fontSize: 12.5, fontWeight: 700,
            padding: '7px 15px', borderRadius: 999, fontFamily: "'Space Grotesk', sans-serif",
            transition: 'all 0.2s',
          }}>
            ⚡ Try Demo
          </Link>
          <button onClick={() => setWaitlistOpen(true)} className="btn-lime" style={{ padding: '9px 20px', fontSize: 12.5 }}>
            Join Waitlist ↗
          </button>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '140px 56px 80px',
        position: 'relative', overflow: 'hidden',
        maxWidth: 1400, margin: '0 auto',
      }}>
        {/* Grid overlay */}
        <div className="hero-grid" />

        {/* Fluid blobs */}
        <FluidBlob color="#CAFF00" size={700} x={200} y={-100} delay={0} />
        <FluidBlob color="#78c5ff" size={500} x={-300} y={200} delay={2} />
        <FluidBlob color="#a8ff78" size={400} x={100} y={300} delay={1} />

        {/* Top badge */}
        <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 52, opacity: 0 }}>
          <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#CAFF00' }} className="pulse-dot" />
          <span className="label-mono">Enterprise Decision Intelligence — Synaps.AI v2.0</span>
        </div>

        {/* Massive headline — haoqi.design uppercase treatment */}
        <h1 style={{ marginBottom: 0, position: 'relative', zIndex: 1 }}>
          <span className="word-line">
            <WordReveal delay={0.35} className="display-xl">Enterprise</WordReveal>
          </span>
          <span className="word-line">
            <WordReveal delay={0.55} className="display-xl display-lime">
              <span ref={heroWordRef} style={{ display: 'inline-block', minWidth: '6ch' }}>MEMORY</span>
            </WordReveal>
          </span>
          <span className="word-line">
            <WordReveal delay={0.72} className="display-xl display-dim">for every org.</WordReveal>
          </span>
        </h1>

        {/* Sub + CTA row */}
        <div className="hero-sub" style={{ marginTop: 64, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap', opacity: 0 }}>
          <div style={{ maxWidth: 420 }}>
            <p style={{ fontSize: 16.5, color: 'rgba(255,255,255,0.42)', lineHeight: 1.7, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400 }}>
              Synaps ingests every document, email, contract, and decision your organization has ever made — and lets any executive ask anything, with complete confidence.
            </p>
          </div>
          <div className="hero-cta" style={{ display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0, opacity: 0 }}>
            <Link href="/login" className="btn-lime">
              Launch Console →
            </Link>
            <Link href="#suite" className="btn-outline">
              See how it works
            </Link>
          </div>
        </div>

        {/* Hero stats strip */}
        <div className="hero-stats" style={{ marginTop: 80, display: 'flex', gap: 56, borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 32, opacity: 0 }}>
          {STATS.map((s, i) => (
            <div key={i} className="stat-num">
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 30, fontWeight: 900, color: i % 2 === 0 ? '#CAFF00' : '#fff', letterSpacing: '-0.04em' }}>{s.v}</div>
              <div className="label-mono" style={{ marginTop: 5 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────────────────── */}
      <div className="marquee-wrap">
        <Marquee />
      </div>

      {/* ── USP STICKY SECTION (incredibles.dev scroll-pin style) ──────────── */}
      <section className="usp-sticky-section" style={{ position: 'relative', padding: '120px 0' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 56px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'flex-start' }}>
            {/* Sticky left header */}
            <div className="reveal-section" style={{ position: 'sticky', top: 160, alignSelf: 'flex-start' }}>
              <div className="label-mono reveal-child" style={{ marginBottom: 20 }}>How it works</div>
              <h2 className="display-md reveal-child" style={{ marginBottom: 24 }}>
                Four modules.<br />
                <span className="display-dim">One intelligence layer.</span>
              </h2>
              <p className="reveal-child" style={{ fontSize: 15, color: 'rgba(255,255,255,0.38)', lineHeight: 1.75, fontFamily: "'Plus Jakarta Sans', sans-serif", maxWidth: 360 }}>
                From raw organizational data to board-ready strategic decisions — Synaps sits above every system your company already runs.
              </p>
              <Link href="/login" className="btn-lime reveal-child" style={{ marginTop: 36, display: 'inline-flex' }}>
                Explore platform →
              </Link>
            </div>

            {/* Right: scrolling USP cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {USP_ITEMS.map((usp, i) => (
                <div key={i} className="usp-card media-reveal">
                  <div className="label-mono" style={{ marginBottom: 20, color: 'rgba(255,255,255,0.25)' }}>{usp.tag}</div>
                  <h3 style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 'clamp(26px, 3vw, 38px)',
                    fontWeight: 900,
                    lineHeight: 1.05,
                    letterSpacing: '-0.03em',
                    color: '#fff',
                    marginBottom: 20,
                    whiteSpace: 'pre-line',
                  }}>
                    {usp.title.split('\n').map((line, li) => (
                      <span key={li} style={{ display: 'block' }}>
                        {li === 0 ? line : <span style={{ color: usp.accent }}>{line}</span>}
                      </span>
                    ))}
                  </h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.42)', lineHeight: 1.7, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {usp.desc}
                  </p>
                  <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="label-mono">Featured module</span>
                    <span style={{ fontSize: 18, color: usp.accent }}>→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE 2 ─────────────────────────────────────────────────────────── */}
      <div className="marquee-wrap">
        <Marquee reverse />
      </div>

      {/* ── SUITE CARDS ──────────────────────────────────────────────────────── */}
      <section id="console" style={{ padding: '120px 56px', maxWidth: 1400, margin: '0 auto' }} className="reveal-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64, flexWrap: 'wrap', gap: 24 }}>
          <div className="reveal-child">
            <div className="label-mono" style={{ marginBottom: 14 }}>#001 — Modules</div>
            <h2 className="display-md">
              Four intelligence<br />
              <span className="display-dim">modules.</span>
            </h2>
          </div>
          <Link href="/login" className="btn-outline reveal-child">Explore all modules →</Link>
        </div>

        {/* Card grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }} className="grid-2">
          {SUITES.map((suite, idx) => (
            <SpotlightTiltCard
              key={idx}
              glowColor="rgba(202, 255, 0, 0.15)"
              className="p-8 cursor-pointer"
            >
              <div onClick={() => setActiveCard(idx)} className="h-full flex flex-col justify-between">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
                    <span className="label-mono">#{suite.id}</span>
                    <span className="label-mono" style={{ color: activeCard === idx ? '#CAFF00' : 'rgba(255,255,255,0.25)' }}>{suite.tag}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 8, letterSpacing: '-0.025em' }}>{suite.label}</h3>
                  <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.35)', marginBottom: 0, fontWeight: 500, fontFamily: "'JetBrains Mono', monospace" }}>{suite.sub}</p>

                  <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 18, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{suite.desc}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {suite.specs.map((spec, si) => (
                        <div key={si} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
                          <span style={{ color: '#CAFF00', fontSize: 9, fontWeight: 900, flexShrink: 0 }}>✦</span> {spec}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 24, display: 'flex', alignItems: 'baseline', gap: 8, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 900, color: '#CAFF00', letterSpacing: '-0.04em' }}>{suite.stat}</span>
                  <span className="label-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>{suite.statLabel}</span>
                </div>
              </div>
            </SpotlightTiltCard>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────────── */}
      <section id="agents" style={{ padding: '120px 56px', maxWidth: 1400, margin: '0 auto' }} className="reveal-section">
        <div style={{ marginBottom: 64 }}>
          <div className="label-mono reveal-child" style={{ marginBottom: 14 }}>#002 — Process</div>
          <h2 className="display-md reveal-child">
            From raw data<br />
            <span className="display-dim">to board-ready decisions.</span>
          </h2>
        </div>

        {/* Three steps — haoqi.design flat grid style */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }} className="reveal-child">
          {[
            { n: '01', t: 'Ingest', d: 'Upload every document, email, CRM export, and database dump into your secure Synaps vault.', c: '#CAFF00' },
            { n: '02', t: 'Connect', d: 'Synaps builds a 4D graph — linking people, decisions, risks, and knowledge across time.', c: 'rgba(255,255,255,0.7)' },
            { n: '03', t: 'Decide', d: 'Ask any question. 10 specialized agents reason across your entire knowledge graph and return grounded answers.', c: 'rgba(255,255,255,0.35)' },
          ].map((step, i) => (
            <div key={i} style={{
              padding: '48px 40px',
              borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              background: '#0a0a0a',
              transition: 'background 0.3s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#111')}
              onMouseLeave={e => (e.currentTarget.style.background = '#0a0a0a')}
            >
              <div className="label-mono" style={{ marginBottom: 36 }}>{step.n}</div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(40px, 4.5vw, 60px)', fontWeight: 900, color: step.c, marginBottom: 18, letterSpacing: '-0.04em', lineHeight: 0.9 }}>{step.t}</h3>
              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.32)', lineHeight: 1.7, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATCHPHRASE SECTION (haoqi.design "Innovate with purpose" sticky) ── */}
      <section style={{ padding: '0 56px 120px', maxWidth: 1400, margin: '0 auto', textAlign: 'center' }}>
        <div className="media-reveal" style={{
          background: 'linear-gradient(145deg, #0d0d0d, #111)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 28,
          padding: '100px 60px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <FluidBlob color="#CAFF00" size={500} x={0} y={0} delay={0} />
          <div className="label-mono" style={{ marginBottom: 24, position: 'relative', zIndex: 1 }}>The Synaps Promise</div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(52px, 7vw, 112px)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.05em', color: '#fff', position: 'relative', zIndex: 1 }}>
            Decide with<br />
            <span style={{ color: '#CAFF00' }}>confidence.</span>
          </h2>
          <p style={{ marginTop: 32, fontSize: 16, color: 'rgba(255,255,255,0.4)', fontFamily: "'Plus Jakarta Sans', sans-serif", maxWidth: 480, margin: '32px auto 0', lineHeight: 1.7, position: 'relative', zIndex: 1 }}>
            When your AI knows everything your organization has ever done, every decision becomes faster, smarter, and more defensible.
          </p>
          <div style={{ marginTop: 48, display: 'flex', gap: 14, justifyContent: 'center', position: 'relative', zIndex: 1 }}>
            <Link href="/login" className="btn-lime">Get started free →</Link>
            <Link href="#pricing" className="btn-outline">View pricing</Link>
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: '120px 56px', maxWidth: 1400, margin: '0 auto' }} className="reveal-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div className="label-mono reveal-child" style={{ marginBottom: 14 }}>#003 — Pricing</div>
            <h2 className="display-md reveal-child">
              Transparent pricing,<br />
              <span className="display-lime">built for teams.</span>
            </h2>
          </div>

          {/* 3-Way Toggle — incredibles.dev toggle style */}
          <div className="reveal-child" style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'rgba(255,255,255,0.05)',
            padding: '4px 5px', borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.09)',
          }}>
            {(['weekly', 'monthly', 'annual'] as const).map(cycle => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                style={{
                  background: billingCycle === cycle ? '#CAFF00' : 'transparent',
                  color: billingCycle === cycle ? '#000' : 'rgba(255,255,255,0.45)',
                  padding: '6px 14px', borderRadius: 999, fontSize: 12,
                  fontWeight: 700, border: 'none', cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.23,1,0.32,1)',
                  fontFamily: "'Space Grotesk', sans-serif",
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                {cycle === 'weekly' && <span style={{ background: billingCycle === 'weekly' ? '#000' : 'rgba(202,255,0,0.15)', color: billingCycle === 'weekly' ? '#CAFF00' : '#CAFF00', padding: '1px 6px', borderRadius: 999, fontSize: 9, fontWeight: 900 }}>$1.99</span>}
                {cycle === 'annual' && <span style={{ background: billingCycle === 'annual' ? '#000' : 'rgba(202,255,0,0.15)', color: billingCycle === 'annual' ? '#CAFF00' : '#CAFF00', padding: '1px 6px', borderRadius: 999, fontSize: 9, fontWeight: 900 }}>−50%</span>}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, alignItems: 'start' }} className="reveal-child grid-3">
          {/* Starter */}
          <div className="pricing-card">
            <div className="label-mono" style={{ marginBottom: 28 }}>STARTER TRIAL</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 50, fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: 8, letterSpacing: '-0.04em' }}>$0</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 32, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>14-day free trial, no card needed</div>
            <div className="sep" style={{ marginBottom: 28 }} />
            {['100 AI Credits', 'Single User Workspace', 'Basic Document Ingestion (10 MB)', 'Standard AI Chat', 'PDF & CSV Export'].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 13, fontSize: 13, color: 'rgba(255,255,255,0.6)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <span style={{ color: '#CAFF00', fontWeight: 900, flexShrink: 0, fontSize: 9 }}>✦</span>{f}
              </div>
            ))}
            <Link href="/login" className="btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: 32, borderRadius: 14 }}>
              Start free trial
            </Link>
          </div>

          {/* Pro — featured */}
          <div className="pricing-card featured">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <div className="label-mono label-mono-lime">PRO MEMBER</div>
              <span style={{ background: '#CAFF00', color: '#000', fontSize: 9.5, fontWeight: 900, padding: '3px 10px', borderRadius: 999, letterSpacing: '0.06em' }}>MOST POPULAR</span>
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 50, fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: 8, letterSpacing: '-0.04em' }}>
              {billingCycle === 'weekly' ? '$1.99' : billingCycle === 'annual' ? '$5' : '$7.99'}
            </div>
            <div style={{ fontSize: 13, color: '#CAFF00', fontWeight: 700, marginBottom: 32, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {billingCycle === 'weekly' ? 'per week — cancel anytime' : billingCycle === 'annual' ? 'per month, billed annually' : 'per month'}
            </div>
            <div className="sep" style={{ background: 'rgba(202,255,0,0.15)', marginBottom: 28 }} />
            {['500 AI Reasoning Credits / day', '10 Parallel AI Agents', 'Full 3D Corporate Memory Graph', 'Universal PDF & CSV Export', 'Multi-Tenant Org Isolation', 'Team Invites & Roles'].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 13, fontSize: 13, color: 'rgba(255,255,255,0.82)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <span style={{ color: '#CAFF00', fontWeight: 900, flexShrink: 0, fontSize: 9 }}>✦</span>{f}
              </div>
            ))}
            <a
              href="https://novaverse33.gumroad.com/l/synaps"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-lime"
              style={{ width: '100%', justifyContent: 'center', marginTop: 32, borderRadius: 14, textDecoration: 'none', display: 'flex' }}
            >
              Get Pro — {billingCycle === 'weekly' ? '$1.99/wk' : billingCycle === 'annual' ? '$5/mo' : '$7.99/mo'} →
            </a>
          </div>

          {/* Enterprise */}
          <div className="pricing-card">
            <div className="label-mono" style={{ marginBottom: 28 }}>ENTERPRISE MAX</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 50, fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: 8, letterSpacing: '-0.04em' }}>
              {billingCycle === 'weekly' ? '$2.75' : billingCycle === 'annual' ? '$8' : '$10.99'}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', marginBottom: 32, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {billingCycle === 'weekly' ? 'per week — cancel anytime' : billingCycle === 'annual' ? 'per month, billed annually' : 'per month'}
            </div>
            <div className="sep" style={{ marginBottom: 28 }} />
            {['Unlimited 10,000 AI Credits / day', '110 Enterprise Decision Models', '8 C-Suite Digital Twins', 'Boardroom Simulation Engine', 'AI Strategy Studio & Roadmap', 'Dedicated Account Manager & 99.9% SLA'].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 13, fontSize: 13, color: 'rgba(255,255,255,0.6)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <span style={{ color: '#CAFF00', fontWeight: 900, flexShrink: 0, fontSize: 9 }}>✦</span>{f}
              </div>
            ))}
            <a
              href="https://novaverse33.gumroad.com/l/synaps"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-lime"
              style={{ width: '100%', justifyContent: 'center', marginTop: 32, borderRadius: 14, textDecoration: 'none', display: 'flex' }}
            >
              Unlock Enterprise — {billingCycle === 'weekly' ? '$2.75/wk' : billingCycle === 'annual' ? '$8/mo' : '$10.99/mo'} →
            </a>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11.5, color: 'rgba(255,255,255,0.18)', marginTop: 24, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>
          No credit card required · 14-day free trial · Cancel anytime
        </p>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────────────── */}
      <section className="cta-section" style={{ padding: '110px 56px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <div>
            {/* haoqi.design "Let's Create Something Extraordinary" style */}
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(42px, 6.5vw, 100px)', fontWeight: 900, color: '#000', lineHeight: 0.9, letterSpacing: '-0.05em' }}>
              Start building<br />
              <span style={{ color: 'rgba(0,0,0,0.35)' }}>your memory graph.</span>
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(0,0,0,0.45)', marginTop: 24, fontFamily: "'Plus Jakarta Sans', sans-serif", maxWidth: 440, lineHeight: 1.65 }}>
              Join 200+ enterprise teams that rely on Synaps to make faster, grounded decisions.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: '#000', color: '#CAFF00',
              padding: '16px 32px', borderRadius: 999, fontWeight: 800,
              fontSize: 14.5, textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif",
              transition: 'all 0.3s cubic-bezier(0.23,1,0.32,1)',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
            >
              Join Now →
            </Link>
            <Link href="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'transparent', color: 'rgba(0,0,0,0.6)',
              border: '1.5px solid rgba(0,0,0,0.2)',
              padding: '16px 32px', borderRadius: 999, fontWeight: 600,
              fontSize: 14.5, textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif",
              transition: 'all 0.25s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.5)'; (e.currentTarget as HTMLElement).style.color = '#000'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.2)'; (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.6)'; }}
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────────── */}
      <footer style={{ background: '#000', padding: '80px 56px 40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 40, marginBottom: 80 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 30, height: 30, background: '#CAFF00', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#000' }}>S</div>
                <span style={{ fontSize: 14.5, fontWeight: 800, color: '#fff', fontFamily: "'Space Grotesk', sans-serif" }}>SYNAPS.AI</span>
              </div>
              <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.22)', lineHeight: 1.75, fontFamily: "'Plus Jakarta Sans', sans-serif", maxWidth: 260 }}>
                The intelligence layer above every enterprise document.
              </p>
              <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                {['Twitter', 'LinkedIn', 'GitHub'].map(s => (
                  <a key={s} href="#" className="t-link" style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em' }}>{s}</a>
                ))}
              </div>
            </div>
            {[
              { h: 'PRODUCT', links: ['Console', 'Agents', 'Boardroom', 'Strategy Studio', 'Pricing'] },
              { h: 'COMPANY', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { h: 'LEGAL', links: ['Privacy Policy', 'Terms of Service', 'Data Processing', 'Security'] },
            ].map((col, i) => (
              <div key={i}>
                <div className="label-mono" style={{ marginBottom: 20 }}>{col.h}</div>
                {col.links.map((l, li) => (
                  <div key={li} style={{ marginBottom: 11 }}>
                    <a href="#" className="t-link" style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{l}</a>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div className="label-mono">© 2026 SYNAPS Technologies Inc. All rights reserved.</div>
            <div className="label-mono">Registered Data Fiduciary · ISO/IEC 27001 · SOC 2 Aligned</div>
          </div>
        </div>
      </footer>

      {/* ── SPOTLIGHT SEARCH ────────────────────────────────────────────────── */}
      {searchOpen && (
        <div onClick={() => setSearchOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.94)',
          backdropFilter: 'blur(24px)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '18vh 20px',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#0f0f0f', borderRadius: 22, padding: 24,
            width: '100%', maxWidth: 600, border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search modules, agents, digital twins..."
                autoFocus
                style={{
                  flex: 1, padding: '12px 16px', background: '#000',
                  border: '1px solid rgba(255,255,255,0.09)', borderRadius: 12,
                  color: '#fff', fontSize: 14.5, outline: 'none',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              />
              <button onClick={() => setSearchOpen(false)} style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)',
                color: '#fff', width: 42, height: 42, borderRadius: 12, cursor: 'pointer', fontSize: 14,
              }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredSuites.map(s => (
                <div key={s.id} style={{
                  padding: '13px 16px', background: '#000', borderRadius: 12, cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(202,255,0,0.2)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{s.label}</div>
                    <div className="label-mono">{s.tag}</div>
                  </div>
                  <span style={{ background: 'rgba(202,255,0,0.1)', color: '#CAFF00', fontSize: 9.5, fontWeight: 700, padding: '3px 10px', borderRadius: 999, whiteSpace: 'nowrap', marginLeft: 12, fontFamily: "'JetBrains Mono', monospace" }}>#{s.id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* WAITLIST MODAL */}
      <WaitlistModal isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </div>
  );
}
