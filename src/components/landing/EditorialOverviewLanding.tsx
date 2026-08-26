'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight, ArrowRight, ShieldCheck, FileText, Lock, Sparkles, Plus, CheckCircle2, Globe, Cpu, Zap, Activity } from 'lucide-react';
import SignInModal from '@/components/SignInModal';
import SignInCardInline from '@/components/SignInCardInline';
import { LegalDialogModal, LegalDocType } from '@/components/landing/LegalDialogModal';
import Link from 'next/link';
import Lenis from 'lenis';

function Synaps3DCyberCoreCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 1000);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const nodes: { x: number; y: number; z: number; ox: number; oy: number; oz: number; size: number }[] = [];
    const numNodes = 72;
    const radius = Math.min(width, height) * 0.32;

    for (let i = 0; i < numNodes; i++) {
      const phi = Math.acos(-1 + (2 * i) / numNodes);
      const theta = Math.sqrt(numNodes * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      nodes.push({ x, y, z, ox: x, oy: y, oz: z, size: Math.random() * 2.2 + 1 });
    }

    let angleX = 0;
    let angleY = 0;
    let targetAngleX = 0;
    let targetAngleY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetAngleY = ((e.clientX - cx) / rect.width) * 0.8;
      targetAngleX = ((e.clientY - cy) / rect.height) * 0.8;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const render = () => {
      ctx.fillStyle = '#08090e';
      ctx.fillRect(0, 0, width, height);

      // Subtle cyber grid floor
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      angleX += (targetAngleX - angleX) * 0.05 + 0.003;
      angleY += (targetAngleY - angleY) * 0.05 + 0.005;

      const fov = 420;
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

      // Draw 3D wireframe connections in electric cobalt blue & neon cyan
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.35 * projected[i].scale;
            ctx.strokeStyle = `rgba(0, 180, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw glowing 3D core nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const node = nodes[i];
        const size = node.size * p.scale;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, size), 0, Math.PI * 2);
        ctx.fillStyle = p.z > 0 ? '#00f0ff' : '#0055ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = p.z > 0 ? 12 : 4;
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

gsap.registerPlugin(ScrollTrigger);

// ─── TEXT SPLITTER: Word-preserving Hashgraph + Huge Inc `anim-fade` per-char ─
function SplitText({ text, className = '' }: { text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((word, wIdx) => (
        <span
          key={wIdx}
          style={{ display: 'inline-block', whiteSpace: 'nowrap', marginRight: '0.22em' }}
        >
          {word.split('').map((char, cIdx) => (
            <span
              key={cIdx}
              className="anim-char"
              aria-hidden="true"
              style={{ transitionDelay: `${(Math.random() * 0.35 + wIdx * 0.05).toFixed(2)}s` }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

// ─── MARQUEE DATA ─────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  'EVIDENCE-GROUNDED RAG',
  '10-AGENT BOARDROOM DEBATE',
  'ZERO HALLUCINATION GUARANTEE',
  'LINE-LEVEL CITATIONS',
  'DPDP ACT 2023 COMPLIANT',
  '3D KNOWLEDGE GRAPH',
  'AES-256 ZERO-TRUST VAULT',
  'PDF · EXCEL · DOCX · CSV',
];

// ─── OPENGL 3D MATRIX ANIMATION CANVAS (inspired by 3D-animation.cpp & Zero University) ────────
function OpenGL3DAnimationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    window.addEventListener('resize', handleResize);

    // 3D Nodes based on 3D-animation.cpp joints & matrix math
    const nodes: { x: number; y: number; z: number; ox: number; oy: number; oz: number }[] = [];
    const numNodes = 48;
    const radius = Math.min(width, height) * 0.28;

    for (let i = 0; i < numNodes; i++) {
      const phi = Math.acos(-1 + (2 * i) / numNodes);
      const theta = Math.sqrt(numNodes * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      nodes.push({ x, y, z, ox: x, oy: y, oz: z });
    }

    let angleX = 0;
    let angleY = 0;
    let targetAngleX = 0;
    let targetAngleY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetAngleY = ((e.clientX - cx) / cx) * 0.4;
      targetAngleX = ((e.clientY - cy) / cy) * 0.4;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Smooth lerp towards target mouse tilt
      angleX += (targetAngleX - angleX) * 0.05 + 0.005;
      angleY += (targetAngleY - angleY) * 0.05 + 0.005;

      const fov = 350;
      const cx = width / 2;
      const cy = height / 2;

      const projected: { x: number; y: number; scale: number }[] = [];

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const radX = angleX;
        const radY = angleY;

        let y1 = node.oy * Math.cos(radX) - node.oz * Math.sin(radX);
        let z1 = node.oy * Math.sin(radX) + node.oz * Math.cos(radX);

        let x2 = node.ox * Math.cos(radY) + z1 * Math.sin(radY);
        let z2 = -node.ox * Math.sin(radY) + z1 * Math.cos(radY);

        const scale = fov / (fov + z2 + 275); // eye_z = 275 from 3D-animation.cpp
        const px = x2 * scale + cx;
        const py = y1 * scale + cy;

        projected.push({ x: px, y: py, scale });
      }

      // Draw 3D wireframe connecting edges
      ctx.strokeStyle = 'rgba(4, 150, 255, 0.28)';
      ctx.lineWidth = 1;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw 3D glowing joint nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const r = Math.max(1.5, 3.8 * p.scale);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 0 ? '#ff0090' : '#0496ff';
        ctx.shadowBlur = 12;
        ctx.shadowColor = i % 3 === 0 ? '#ff0090' : '#0496ff';
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-70"
    />
  );
}

// ─── ACCORDION DATA (Huge Inc + Iberian) ──────────────────────────────────────
const FEATURES = [
  {
    id: '01',
    title: 'DOCUMENT REASONING & PARSING',
    sub: 'PDF · EXCEL · DOCX · CSV INGESTION IN SECONDS',
    body: 'Synaps parses multi-hundred-page PDFs, complex financial spreadsheets, and legal agreements with zero data loss. Line-level vector embeddings ground every answer directly in your source documents — zero hallucination possible.',
    icon: FileText,
  },
  {
    id: '02',
    title: '10-AGENT BOARDROOM CONSENSUS',
    sub: 'PARALLEL MULTI-AGENT RISK & OBLIGATION DEBATE',
    body: 'Ten specialized AI agents — Legal, Financial, Compliance, Risk, Security — analyze your input simultaneously. They debate vulnerabilities, flag hidden liabilities, and produce an auditable consensus brief before responding.',
    icon: Sparkles,
  },
  {
    id: '03',
    title: '3D ENTERPRISE MEMORY GRAPH',
    sub: 'NEURAL RELATIONSHIP VISUALIZATION ACROSS YOUR ORG',
    body: 'Connect entity relationships across your entire company database. Synaps maps contracts to projects, requirements to regulations, and personnel to risk exposure in an interactive 3D knowledge graph.',
    icon: Globe,
  },
  {
    id: '04',
    title: 'ZERO-TRUST VAULT & DPDP COMPLIANCE',
    sub: 'AES-256 ENCRYPTION & MULTI-TENANT ISOLATION',
    body: 'Built from day one to comply with India\'s DPDP Act 2023. AES-256 encryption at rest and in transit. Multi-tenant physical isolation. HTTP-Only session tokens. Zero user data ever trained on.',
    icon: Lock,
  },
];

// ─── AGENT CARDS (Huge Inc Grid) ──────────────────────────────────────────────
const AGENTS = [
  { title: 'CHIEF OF STAFF', role: 'Strategic Alignment', icon: ShieldCheck },
  { title: 'LEGAL COUNSEL', role: 'Liability & Clause Analysis', icon: FileText },
  { title: 'CFO', role: 'Capital & ROI Exposure', icon: CheckCircle2 },
  { title: 'RISK AUDITOR', role: 'Vulnerability Detection', icon: Lock },
  { title: 'COMPLIANCE', role: 'DPDP & Regulatory Match', icon: Sparkles },
  { title: 'ENGINEERING', role: 'Technical Feasibility', icon: Cpu },
  { title: 'MARKETING', role: 'Market Position Impact', icon: Globe },
  { title: 'OPERATIONS', role: 'Workflow Bottlenecks', icon: Activity },
  { title: 'SECURITY', role: 'Zero-Trust Isolation', icon: Zap },
  { title: 'DIGITAL TWIN', role: 'Executive Consensus', icon: Sparkles },
];

// ─── MEASURED SITE 3D LEADERBOARD ITEMS ──────────────────────────────────────
const MEASURED_3D_ITEMS = [
  { rank: '1st', label: 'SYNAPS Evidence Engine', stat: '12,763 Queries' },
  { rank: '2nd', label: '10-Agent Boardroom Consensus', stat: '7,707 Consensus Runs' },
  { rank: '3rd', label: '3D Enterprise Memory Graph', stat: '4,786 Neural Nodes' },
  { rank: '4th', label: 'Zero-Trust Encryption Vault', stat: '4,755 AES-256 Keys' },
  { rank: '5th', label: 'PDF & Financial Spreadsheet Parser', stat: '3,895 Documents' },
  { rank: '6th', label: 'DPDP Act 2023 Compliance Auditor', stat: '2,844 Audits' },
  { rank: '7th', label: 'Scenario Stress Simulator', stat: '2,179 Simulations' },
  { rank: '8th', label: 'Line-Level Grounded Vector Search', stat: '2,162 Embeddings' },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function SynapsLanding() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [openFeature, setOpenFeature] = useState<string | null>('01');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [hoveredAgent, setHoveredAgent] = useState<number | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  // ── Poly Floating Search Bar Live Typing Simulation ────────────────────────
  const [typedText, setTypedText] = useState('');
  const polyQueries = [
    'Find liability clauses in Q3 Vendor Contracts...',
    'Run 10-Agent Boardroom consensus on regulatory risk...',
    'Search natural language across 500+ financial PDFs...',
    'Map 3D memory graph connections between personnel & projects...',
  ];

  useEffect(() => {
    let queryIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const type = () => {
      const currentQuery = polyQueries[queryIdx];
      if (isDeleting) {
        setTypedText(currentQuery.substring(0, charIdx - 1));
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          queryIdx = (queryIdx + 1) % polyQueries.length;
          timeoutId = setTimeout(type, 400);
          return;
        }
      } else {
        setTypedText(currentQuery.substring(0, charIdx + 1));
        charIdx++;
        if (charIdx === currentQuery.length) {
          isDeleting = true;
          timeoutId = setTimeout(type, 2200);
          return;
        }
      }
      timeoutId = setTimeout(type, isDeleting ? 25 : 55);
    };

    timeoutId = setTimeout(type, 800);
    return () => clearTimeout(timeoutId);
  }, []);

  // ── Ultra-Smooth Inertial Scroll via Lenis (GSAP Integration) ────────────────
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  // ── Poly 3D Card Tilt Physics Handlers ─────────────────────────────────────
  const handleCard3DTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  };

  const handleCard3DReset = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  };

  // ── Curtain Loader State ──────────────────────────────────────────────────
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [loaderComplete, setLoaderComplete] = useState(false);
  const [legalModalDoc, setLegalModalDoc] = useState<LegalDocType | null>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const curtainWaveRef = useRef<SVGPathElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  // ── Curtain Loader Progress Ticker (Hashgraph & Iberian style) ────────────
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 12) + 4;
      if (current >= 100) {
        current = 100;
        setLoaderProgress(100);
        clearInterval(interval);
        
        // Trigger Curtain Lift Animation with GSAP
        setTimeout(() => {
          if (curtainRef.current) {
            gsap.to(curtainRef.current, {
              y: '-100%',
              duration: 1.2,
              ease: 'cubic-bezier(0.14, 1, 0.34, 1)',
              onComplete: () => setLoaderComplete(true),
            });
          }
        }, 300);
      } else {
        setLoaderProgress(current);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  // Re-trigger Curtain Lift Wipe (for logo click or section change)
  const triggerCurtainWipe = useCallback(() => {
    if (!curtainRef.current) return;
    setLoaderComplete(false);
    setLoaderProgress(0);

    gsap.fromTo(
      curtainRef.current,
      { y: '100%' },
      {
        y: '0%',
        duration: 0.7,
        ease: 'cubic-bezier(0.14, 1, 0.34, 1)',
        onComplete: () => {
          gsap.to(curtainRef.current, {
            y: '-100%',
            duration: 0.9,
            delay: 0.2,
            ease: 'cubic-bezier(0.14, 1, 0.34, 1)',
            onComplete: () => setLoaderComplete(true),
          });
        },
      }
    );
  }, []);

  // ── High-Performance 60fps Cursor Tracking & Zero University Spotlight ──────
  const ringRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      const target = e.target as HTMLElement;
      const isHovered = Boolean(target?.closest('a, button, .huge-link, .measured-3d-item, .btn-inc, .poly-scatter-card'));
      if (ringRef.current) {
        if (isHovered) {
          ringRef.current.classList.add('hovered');
        } else {
          ringRef.current.classList.remove('hovered');
        }
      }

      // Zero University cursor spotlight calculations
      const cards = document.querySelectorAll('.zero-card-glow, .poly-scatter-card, .agent-card');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
      });
    };

    let animId: number;
    const loop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      animId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // ── Scroll progress + header reveal ─────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) setScrollProgress((window.scrollY / total) * 100);
      setHeaderVisible(window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Marquee animation ───────────────────────────────────────────────────
  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;
    gsap.to(el, {
      x: '-50%',
      duration: 28,
      ease: 'none',
      repeat: -1,
    });
  }, []);

  // ── GSAP: animations ────────────────────────────────────────────────────
  useGSAP(() => {
    const sections = document.querySelectorAll('[data-anim-section]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15 }
    );
    sections.forEach((s) => io.observe(s));

    // ── GSAP 60fps Smooth Animations (GSAP + Ponytail Principles) ────────────
    const appleSpringEase = 'cubic-bezier(0.16, 1, 0.3, 1)';

    ScrollTrigger.batch('[data-slide-up]', {
      onEnter: (batch) =>
        gsap.from(batch, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.06,
          ease: appleSpringEase,
          force3D: true,
        }),
      once: true,
    });

    ScrollTrigger.batch('[data-agent-card]', {
      onEnter: (batch) =>
        gsap.from(batch, {
          scale: 0.92,
          opacity: 0,
          duration: 0.6,
          stagger: 0.04,
          ease: 'back.out(1.2)',
          force3D: true,
        }),
      once: true,
    });

    gsap.from('[data-logo-mark]', {
      scale: 0.9,
      rotate: -20,
      opacity: 0,
      duration: 1.2,
      ease: appleSpringEase,
      force3D: true,
    });

    return () => io.disconnect();
  }, { scope: containerRef });

  const openModal = useCallback(() => setShowSignIn(true), []);

  return (
    <>
      {/* ── GLOBAL STYLES (Hashgraph + Iberian + Huge Inc Fusion) ───────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,600;1,700&family=Space+Grotesk:wght@400;500;600;700&family=Teko:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

        /* ── Base ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
        body { background-color: #000209; color: #eee; font-family: 'Space Grotesk', system-ui, sans-serif; overflow-x: hidden; }

        /* ── PAGEBUDDY APP ANIMATION SYSTEM (pagebuddy.app) ── */
        .pagebuddy-caret {
          width: 2px;
          height: 1.15em;
          background: #0496ff;
          display: inline-block;
          margin-left: 2px;
          vertical-align: middle;
          animation: blink-caret 1500ms linear infinite;
        }
        @keyframes blink-caret {
          0%, 100% { opacity: 1; background-color: #0496ff; }
          50% { opacity: 0; background-color: transparent; }
        }

        .pagebuddy-drag-label-add {
          animation: drag-label-add-anm 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .pagebuddy-drag-label-remove {
          animation: drag-label-remove-anm 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes drag-label-add-anm {
          0% { opacity: 0; transform: scale(0.85) translateY(10px); filter: blur(8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        @keyframes drag-label-remove-anm {
          0% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
          100% { opacity: 0; transform: scale(0.85) translateY(-10px); filter: blur(8px); }
        }

        .pagebuddy-inline-controls {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(18, 22, 34, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.2);
          border-radius: 999px;
          transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* ── MEASURED SITE 3D PERSPECTIVE SYSTEM (measured.site) ── */
        .measured-perspective-container {
          perspective: 700vw;
          perspective-origin: center;
        }
        .measured-3d-item {
          will-change: transform;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .measured-3d-item:hover {
          color: #153bca;
          border-color: rgba(21, 59, 202, 0.6);
          box-shadow: 0 12px 30px rgba(21, 59, 202, 0.25);
          transform: translateZ(40px) scale(1.04) !important;
        }

        .measured-giant-watermark {
          line-height: 0.69;
          font-size: 24vw;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.04);
          letter-spacing: -0.05em;
          user-select: none;
          pointer-events: none;
        }

        .measured-electric-blue-box {
          background-color: #153bca;
          box-shadow: 0 20px 50px rgba(21, 59, 202, 0.35);
        }

        /* ── INCREDIBLES.DEV LIQUID CLIP-PATH BUTTONS & MEDIA REVEAL (incredibles.dev) ── */
        .btn-inc {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.8rem 1.8rem;
          border-radius: 999px;
          background: #fc4778;
          color: #ffffff;
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-weight: 600;
          font-size: 0.875rem;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid rgba(252, 71, 120, 0.4);
          transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1), box-shadow 0.4s ease;
        }
        .btn-inc:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(252, 71, 120, 0.4);
        }
        .btn-inc__hover {
          position: absolute;
          inset: 0;
          background: #ffffff;
          color: #2b2b2b;
          border-radius: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          clip-path: ellipse(80% 50% at 50% 152%);
          transition: clip-path 0.6s cubic-bezier(0.19, 1, 0.22, 1);
          will-change: clip-path;
        }
        .btn-inc:hover .btn-inc__hover {
          clip-path: ellipse(100% 70% at 50% 50%);
        }

        /* Incredibles.dev 3D Card Stack */
        .inc-usp-wrapper {
          perspective: 25rem;
        }
        .inc-usp-card {
          transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.6s ease;
          transform-origin: 50% -20%;
          will-change: transform, opacity;
        }
        .inc-usp-card:hover {
          transform: translateZ(30px) scale(1.03) !important;
        }

        /* ── SANTIONI SPIRITS HIGH-FASHION EDITORIAL TYPOGRAPHY (santionispirits.com) ── */
        .santioni-heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 400;
          letter-spacing: 0.005em;
          text-transform: uppercase;
          line-height: 1.1;
        }
        .santioni-gold-gradient {
          background: linear-gradient(135deg, #d4af37 0%, #f3e5ab 50%, #aa7c11 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Santioni Radial Progress Loader Ring */
        .santioni-progress-ring {
          stroke-dasharray: 283;
          stroke-dashoffset: calc(283 - (283 * var(--loader-per, 0)) / 100);
          transition: stroke-dashoffset 0.6s cubic-bezier(0.19, 1, 0.22, 1);
        }

        /* ── INCREDIBLES.DEV CUSTOM FLOATING SCROLLBAR (incredibles.dev) ── */
        .inc-scrollbar-track {
          position: fixed;
          top: 0;
          right: 4px;
          z-index: 9999;
          width: 6px;
          height: 100vh;
          pointer-events: none;
        }
        .inc-scrollbar-thumb {
          width: 6px;
          background: rgba(252, 71, 120, 0.7);
          border-radius: 999px;
          box-shadow: 0 0 10px rgba(252, 71, 120, 0.5);
          transition: transform 0.1s ease-out, height 0.2s ease, background-color 0.2s ease;
        }

        /* Incredibles Executive Quote Showcase Card */
        .inc-quote-card {
          position: relative;
          background: #060913;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          overflow: hidden;
          transition: border-color 0.4s ease, box-shadow 0.4s ease;
        }
        .inc-quote-card:hover {
          border-color: rgba(252, 71, 120, 0.6);
          box-shadow: 0 20px 50px rgba(252, 71, 120, 0.15);
        }
        .inc-quote-mark {
          position: absolute;
          top: -0.2em;
          left: 0.8rem;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 8rem;
          line-height: 1;
          color: rgba(252, 71, 120, 0.15);
          user-select: none;
          pointer-events: none;
        }

        /* ── MEASURED.SITE FLOATING WALKTHROUGH BADGE (measured.site) ── */
        .measured-video-badge {
          position: fixed;
          bottom: 24px;
          left: 24px;
          z-index: 90;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          background: rgba(12, 18, 32, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 16px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
          transition: transform 0.3s cubic-bezier(0.19, 1, 0.22, 1), border-color 0.3s ease;
        }
        .measured-video-badge:hover {
          transform: translateY(-4px) scale(1.02);
          border-color: rgba(4, 150, 255, 0.6);
        }

        /* ── SHADER.SE SPRING MOUSE FOLLOWER (shader.se) ── */
        .spring-cursor-ring {
          position: fixed;
          top: 0;
          left: 0;
          width: 36px;
          height: 36px;
          border: 1px solid rgba(4, 150, 255, 0.5);
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          transform: translate(-50%, -50%);
          transition: width 0.3s ease, height 0.3s ease, border-color 0.3s ease, background-color 0.3s ease;
          will-change: transform;
        }
        .spring-cursor-ring.hovered {
          width: 56px;
          height: 56px;
          border-color: rgba(255, 0, 144, 0.8);
          background-color: rgba(255, 0, 144, 0.08);
        }

        /* ── Poly App Font Utilities ── */
        .title-main-poly {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-weight: 600;
          letter-spacing: -0.02em;
        }
        .title-sub-poly {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          letter-spacing: -0.03em;
          font-weight: 400;
        }

        /* ── Poly Pill Button Variants ── */
        .poly-btn-orange {
          background: linear-gradient(134.77deg, #f4824d 25.1%, #f42919 74.9%);
          box-shadow: 2px 2px 5px rgba(0,0,0,0.3), inset -2px -2px 4px rgba(0,0,0,0.15), inset 2px 2px 4px rgba(255,255,255,0.25);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          color: #ffffff;
          border: 1px solid rgba(244, 130, 77, 0.4);
          border-radius: 10px;
          transition: box-shadow 0.3s ease, transform 0.2s ease;
        }
        .poly-btn-orange:hover {
          box-shadow: 4px 4px 12px rgba(244, 41, 25, 0.4), inset -2px -2px 4px rgba(0,0,0,0.2), inset 2px 2px 4px rgba(255,255,255,0.35);
          transform: translateY(-1px);
        }
        .poly-btn-orange:active {
          box-shadow: inset 2px 2px 3px rgba(0,0,0,0.25), inset -2px -2px 2px rgba(255,255,255,0.25);
          transform: scale(0.97);
        }

        .poly-btn-white {
          background: linear-gradient(100.81deg, #f4f4f4 7.89%, #eaeaea 91.16%);
          box-shadow: 2px 2px 5px rgba(0,0,0,0.2), inset -2px -2px 4px rgba(0,0,0,0.15), inset 2px 2px 4px #ffffff;
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          color: #111115;
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 10px;
          transition: box-shadow 0.3s ease, transform 0.2s ease;
        }
        .poly-btn-white:hover {
          box-shadow: 4px 4px 12px rgba(255,255,255,0.3), inset -2px -2px 4px rgba(0,0,0,0.2), inset 2px 2px 4px #ffffff;
          transform: translateY(-1px);
        }
        .poly-btn-white:active {
          box-shadow: inset 2px 2px 3px rgba(0,0,0,0.2), inset -2px -2px 2px rgba(255,255,255,0.3);
          transform: scale(0.97);
        }

        /* ── 9:16 PORTRAIT MOBILE ASPECT RATIO ENGINE ── */
        @media (max-aspect-ratio: 1/1), (max-width: 768px) {
          .title-main-poly {
            font-size: clamp(32px, 8vw, 48px) !important;
            line-height: 1.08em !important;
          }
          .title-sub-poly {
            font-size: clamp(28px, 7vw, 42px) !important;
          }
          .poly-scatter-card {
            width: 100% !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          .hero-canvas-wrapper {
            height: 60vh !important;
            min-height: 380px !important;
          }
          .measured-3d-item {
            transform: none !important;
          }
        }

        .poly-btn-black {
          background: linear-gradient(100.81deg, #292930 7.89%, #19191d 91.16%);
          box-shadow: 2px 2px 5px rgba(0,0,0,0.3), inset -2px -2px 4px rgba(0,0,0,0.15), inset 2px 2px 4px rgba(255,255,255,0.25);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          transition: box-shadow 0.3s ease, transform 0.2s ease;
        }
        .poly-btn-black:hover {
          box-shadow: 4px 4px 12px rgba(0,0,0,0.5), inset -2px -2px 4px rgba(0,0,0,0.2), inset 2px 2px 4px rgba(255,255,255,0.35);
          transform: translateY(-1px);
        }
        .poly-btn-black:active {
          box-shadow: inset 2px 2px 3px rgba(0,0,0,0.3), inset -2px -2px 2px rgba(255,255,255,0.2);
          transform: scale(0.97);
        }

        /* Poly Search Bar & Cursor Simulation */
        .poly-search-bar {
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          background: linear-gradient(100.81deg, rgba(244, 244, 244, 0.15) 7.89%, rgba(244, 244, 244, 0.05) 91.16%);
          box-shadow: 4px 5px 20px rgba(0,0,0,0.4), inset -1px -1px 4px rgba(0,0,0,0.15), inset 1px 1px 4px rgba(255,255,255,0.2);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 12px;
        }

        .poly-cursor {
          background: #0496ff;
          height: 1.1em;
          width: 2px;
          display: inline-block;
          margin-left: 2px;
          vertical-align: middle;
          animation: poly-blink 1s steps(2, start) infinite;
        }
        @keyframes poly-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        /* Poly Floating Scatter Card Array */
        .poly-scatter-card {
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          background: linear-gradient(100.81deg, rgba(41, 41, 48, 0.6) 7.89%, rgba(25, 25, 29, 0.6) 91.16%);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 16px 36px rgba(0,0,0,0.4), inset 1px 1px 2px rgba(255,255,255,0.15);
          border-radius: 16px;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .poly-scatter-card:hover {
          transform: translateY(-6px) scale(1.03) !important;
          border-color: rgba(244, 130, 77, 0.6);
          box-shadow: 0 20px 48px rgba(244, 41, 25, 0.25), inset 1px 1px 2px rgba(255,255,255,0.3);
        }

        /* ── Huge Inc Color Palette Tokens ── */
        :root {
          --huge-black: #000000;
          --huge-magenta: #ff0090;
          --huge-cyan: #9bb8e1;
          --huge-cobalt: #0055ff;
          --huge-gray-text: #73767d;
          --huge-dark-bg: #000209;
        }

        /* ── Font utilities ── */
        .ff-teko { font-family: 'Teko', sans-serif; text-transform: uppercase; line-height: 0.88em; letter-spacing: 0.01em; }
        .ff-mono { font-family: 'JetBrains Mono', monospace; }
        .ff-sans { font-family: 'Space Grotesk', system-ui, sans-serif; }

        /* ── Hashgraph character animation ── */
        .anim-char {
          position: relative;
          display: inline-block;
          opacity: 0;
          transform: translateY(75%);
          transition: transform 0.8s cubic-bezier(0.14, 1, 0.34, 1), opacity 0.8s linear;
        }
        .is-visible .anim-char { opacity: 1; transform: translateY(0); }

        /* ── Hashgraph line animation ── */
        .anim-line-oh { overflow: hidden; display: block; }
        .anim-line {
          transform: translateY(100%);
          transition: transform 0.8s cubic-bezier(0.14, 1, 0.34, 1);
        }
        .is-visible .anim-line { transform: translateY(0); }

        /* ── Body copy staggered fade ── */
        .anim-body-line {
          position: relative;
          display: block;
          opacity: 0;
          transition: opacity 0.6s linear;
        }
        .is-visible .anim-body-line { opacity: 1; }

        /* ── Huge Inc Signature Underline Slide ── */
        .huge-link {
          position: relative;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .huge-link::after {
          content: "";
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--huge-magenta);
          transform: scaleX(0);
          transform-origin: bottom right;
          transition: transform 0.3s cubic-bezier(0.14, 1, 0.34, 1);
        }
        .huge-link:hover::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }
        .huge-link:hover .huge-arrow {
          transform: rotate(-45deg);
          color: var(--huge-magenta);
        }
        .huge-arrow {
          transition: transform 0.3s cubic-bezier(0.14, 1, 0.34, 1), color 0.3s ease;
        }

        /* ── Hashgraph shimmer button ── */
        .synaps-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          height: 46px;
          padding: 0 24px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          color: #eee;
          background: transparent;
          border: none;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          overflow: hidden;
          border-radius: 6px;
          text-decoration: none;
          transition: color 0.3s ease, border-color 0.3s ease;
        }
        .synaps-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          border: 2px solid #9bb8e1;
          border-radius: 6px;
          filter: blur(5px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.6s cubic-bezier(0.14, 1, 0.34, 1);
        }
        .synaps-btn:hover::before { opacity: 1; }

        .synaps-btn__border {
          position: absolute;
          inset: 0;
          border-radius: 6px;
          overflow: visible;
          pointer-events: none;
          z-index: 1;
        }
        .synaps-btn__border rect {
          stroke: url(#btnBorderGrad);
          stroke-width: 1;
          fill: none;
          stroke-dasharray: 0, 9999;
          transition: stroke-dasharray 0.6s cubic-bezier(0.9, 0, 0.1, 1);
        }
        .synaps-btn:hover .synaps-btn__border rect {
          stroke-dasharray: 9999, 0;
        }

        .synaps-btn__shimmer {
          position: absolute;
          inset: 0;
          border-radius: 6px;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
          transition: opacity 0.6s cubic-bezier(0.14, 1, 0.34, 1);
        }
        .synaps-btn__shimmer-inner {
          animation: btn-shimmer 5s cubic-bezier(0.14, 1, 0.34, 1) infinite forwards;
          display: flex;
          height: 100%;
          position: relative;
          width: 100%;
        }
        .synaps-btn__shimmer-inner::before {
          background-color: #9bb8e1;
          bottom: -4rem;
          content: "";
          filter: blur(24px);
          left: calc(50% - 20px);
          position: absolute;
          top: -4rem;
          transform: rotate(19.92deg);
          width: 40px;
        }
        @keyframes btn-shimmer {
          0%   { opacity: 1; transform: translateX(-100%); }
          10%  { opacity: 1; }
          70%  { opacity: 0; }
          100% { transform: translateX(100%); }
        }

        .synaps-btn__label { position: relative; z-index: 2; display: flex; align-items: center; gap: 8px; }
        .synaps-btn__label--base { transition: transform 0.6s cubic-bezier(0.9, 0, 0.1, 1), opacity 0.5s linear 0.1s; }
        .synaps-btn:hover .synaps-btn__label--base { opacity: 0; transform: translateY(-100%); }

        .synaps-btn__label--hover {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateY(100%);
          opacity: 0;
          transition: transform 0.6s cubic-bezier(0.9, 0, 0.1, 1), opacity 0.5s linear 0.1s;
        }
        .synaps-btn:hover .synaps-btn__label--hover { opacity: 1; transform: translateY(0); }

        /* ── Rotating Badge ── */
        .badge-rotate { animation: badge-spin 22s linear infinite; }
        @keyframes badge-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* ── Gradient text ── */
        .text-gradient-blue {
          background: linear-gradient(135deg, #9bb8e1, #0055ff, #ff0090);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Section title tag ── */
        .section-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #b7c6d4;
        }
        .section-tag__id {
          background: linear-gradient(90deg, #9bb8e1, #ff0090);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Body copy color ── */
        .body-copy { color: #b7c6d4; line-height: 1.7; }

        /* ── Huge Inc Hover Focus / Dim Effect ── */
        .huge-hover-list:hover > .huge-hover-item:not(:hover) {
          opacity: 0.3;
          filter: grayscale(40%);
          transition: opacity 0.4s ease, filter 0.4s ease;
        }
        .huge-hover-item {
          transition: opacity 0.4s ease, filter 0.4s ease, transform 0.3s ease, border-color 0.3s ease;
        }

        /* ── APPLE DESIGN SYSTEM (Emil Kowalski Apple Design Skill) ── */
        /* 1. Instant Physical Response — kill latency on pointer-down */
        .apple-press, button, .synaps-btn, .huge-link, .agent-card {
          touch-action: manipulation;
          will-change: transform;
        }
        .apple-press:active, button:active, .synaps-btn:active {
          transform: scale(0.97) !important;
          transition: transform 90ms cubic-bezier(0, 0, 0.2, 1) !important;
        }

        /* 2. Apple Material Glassmorphism & Translucency */
        .apple-glass-card {
          background: rgba(12, 18, 32, 0.65);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        /* 3. Accordion Fluid Spring (Response: 0.35s, Critically Damped) */
        .accordion-body {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
          opacity: 0;
        }
        .accordion-body.open {
          max-height: 380px;
          opacity: 1;
        }
        .accordion-icon {
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
          transform: rotate(0deg) scale(1);
          will-change: transform;
        }
        .accordion-icon:hover {
          transform: scale(1.1);
          box-shadow: 0 0 14px rgba(155, 184, 225, 0.3);
        }
        .accordion-icon.open {
          transform: rotate(135deg) scale(1.08);
          box-shadow: 0 0 18px rgba(255, 0, 144, 0.4);
        }

        /* 4. Apple Agent Card Spring Hover with Momentum Scale */
        .agent-card {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, background 0.3s ease, box-shadow 0.35s ease;
          cursor: default;
          transform-origin: center center;
        }
        .agent-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(255, 0, 144, 0.6);
          background: rgba(255, 0, 144, 0.08);
          box-shadow: 0 16px 36px rgba(255, 0, 144, 0.25);
        }

        /* 5. Reduced Motion Accessibility (Apple Design Guidelines) */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

        /* ── Scrollbar ── */
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #000209; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(#9bb8e1, #0055ff, #ff0090); border-radius: 99px; }
      `}</style>

      {/* ── CURTAIN LOADER (Hashgraph + Iberian Curtain Wave loader) ────────── */}
      {!loaderComplete && (
        <div
          ref={curtainRef}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: '#000209',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Ambient Glow behind loader */}
          <div style={{
            position: 'absolute', width: 600, height: 600,
            background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, rgba(255,0,144,0.15) 50%, transparent 75%)',
            filter: 'blur(80px)', pointerEvents: 'none',
          }} />

          {/* Loader Content */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            {/* Spinning Emblem */}
            <div style={{
              position: 'relative', width: 100, height: 100,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg className="badge-rotate" viewBox="0 0 100 100" style={{ width: '100%', height: '100%', position: 'absolute' }}>
                <path id="loader-circle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" fill="none" />
                <text fill="#9bb8e1" style={{ fontFamily: 'JetBrains Mono', fontSize: 7, letterSpacing: '0.24em' }}>
                  <textPath href="#loader-circle">SYNAPS AI · INITIALIZING SYSTEM · REASONING ·</textPath>
                </text>
              </svg>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'linear-gradient(135deg, #0055ff, #ff0090)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 30px rgba(255,0,144,0.5)',
              }}>
                <span className="ff-teko" style={{ fontSize: 28, color: '#fff', lineHeight: 1 }}>S</span>
              </div>
            </div>

            {/* Progress Counter Ticker */}
            <div style={{ textAlign: 'center' }}>
              <div className="ff-teko" style={{ fontSize: 64, color: '#fff', lineHeight: 1, letterSpacing: '0.04em' }}>
                {loaderProgress.toString().padStart(2, '0')}<span style={{ fontSize: 32, color: '#ff0090' }}>%</span>
              </div>
              <div className="ff-mono" style={{ fontSize: 10, color: '#9bb8e1', letterSpacing: '0.2em', marginTop: 4 }}>
                INITIALIZING ENTERPRISE BRAIN...
              </div>
            </div>

            {/* Progress Bar Track */}
            <div style={{
              width: 240, height: 3, background: 'rgba(155,184,225,0.15)',
              borderRadius: 99, overflow: 'hidden', marginTop: 8,
            }}>
              <div style={{
                height: '100%', width: `${loaderProgress}%`,
                background: 'linear-gradient(90deg, #9bb8e1, #0055ff, #ff0090)',
                transition: 'width 0.05s linear',
              }} />
            </div>
          </div>

          {/* Bottom Liquid Wave Curtain Edge (Iberian Style) */}
          <div style={{
            position: 'absolute', bottom: -60, left: 0, width: '100%',
            height: 120, pointerEvents: 'none',
          }}>
            <svg viewBox="0 0 1440 120" style={{ width: '100%', height: '100%', fill: '#000209' }}>
              <path ref={curtainWaveRef} d="M0,32L48,42.7C96,53,192,75,288,80C384,85,480,75,576,64C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
            </svg>
          </div>
        </div>
      )}

      {/* ── PROGRESS BAR ──────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 9999,
          height: 2, background: 'linear-gradient(90deg, #9bb8e1, #0055ff, #ff0090)',
          width: `${scrollProgress}%`, transition: 'width 0.1s linear',
        }}
      />

      {/* ── SVG GRADIENT DEFS ────────────────────────────────────────────── */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <linearGradient id="btnBorderGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#9bb8e1" />
            <stop offset="50%" stopColor="#0055ff" />
            <stop offset="100%" stopColor="#ff0090" />
          </linearGradient>
        </defs>
      </svg>

      {/* ── SHADER.SE INERTIA SPRING CURSOR RING ────────────────────────────── */}
      <div
        ref={ringRef}
        className="spring-cursor-ring hidden md:block"
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
        }}
      />

      {/* ── INCREDIBLES.DEV FLOATING CUSTOM SCROLLBAR TRACK ──────────────────── */}
      <div className="inc-scrollbar-track hidden md:block">
        <div
          className="inc-scrollbar-thumb"
          style={{
            transform: `translateY(${(scrollProgress * (typeof window !== 'undefined' ? window.innerHeight - 100 : 800)) / 100}px)`,
            height: '80px',
          }}
        />
      </div>



      <div ref={containerRef}>
        {/* ── POLY CUSTOM POINTER CURSOR FOLLOWER ────────────────────────────── */}
        <div
          ref={cursorDotRef}
          className="pointer-events-none fixed z-[99999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
          style={{
            left: 0,
            top: 0,
            transform: 'translate3d(-100px, -100px, 0)',
          }}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-[#0496ff] shadow-[0_0_12px_#0496ff]" />
        </div>

        {/* ── FIXED HEADER (Hashgraph + Huge Inc) ─────────────────────────── */}
        <header style={{
          position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100,
          padding: '20px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: headerVisible ? 'rgba(0, 2, 9, 0.9)' : 'transparent',
          backdropFilter: headerVisible ? 'blur(14px)' : 'none',
          borderBottom: headerVisible ? '1px solid rgba(155, 184, 225, 0.1)' : 'none',
          transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease',
        }}>
          {/* Logo - click triggers curtain wipe */}
          <div
            data-logo-mark
            onClick={triggerCurtainWipe}
            style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
            title="Click to replay Curtain Loader"
          >
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg, #0055ff, #ff0090)',
              padding: 1, boxShadow: '0 0 20px rgba(255,0,144,0.35)',
            }}>
              <div style={{
                width: '100%', height: '100%', borderRadius: 9,
                background: '#000209', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="ff-teko" style={{ fontSize: 22, color: '#9bb8e1', lineHeight: 1 }}>S</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="ff-teko" style={{ fontSize: 22, color: '#fff', letterSpacing: '0.08em', lineHeight: 1 }}>SYNAPS AI</span>
              <span className="ff-mono" style={{ fontSize: 9, color: '#9bb8e1', letterSpacing: '0.2em', opacity: 0.7 }}>ENTERPRISE BRAIN</span>
            </div>
          </div>

          {/* Nav links (Huge Inc Underline Slide Style) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {[
              { label: 'FEATURES', href: '#features' },
              { label: 'BOARDROOM', href: '#boardroom' },
              { label: 'SECURITY', href: '#security' },
            ].map(({ label, href }) => (
              <a key={label} href={href} className="ff-mono huge-link" style={{
                fontSize: 11, color: 'rgba(238,238,238,0.7)', letterSpacing: '0.1em',
              }}>
                <span>{label}</span>
              </a>
            ))}

            <Link href="/dashboard/chat" className="ff-mono huge-link" style={{
              fontSize: 11, color: '#9bb8e1', letterSpacing: '0.1em', fontWeight: 700,
            }}>
              <span>APP</span>
              <ArrowUpRight className="w-3.5 h-3.5 huge-arrow" />
            </Link>

            <button onClick={openModal} className="synaps-btn">
              <svg className="synaps-btn__border" aria-hidden="true">
                <rect x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="5" ry="5" />
              </svg>
              <span className="synaps-btn__shimmer"><span className="synaps-btn__shimmer-inner" /></span>
              <span className="synaps-btn__label">
                <span className="synaps-btn__label--base">LAUNCH SYSTEM</span>
                <span className="synaps-btn__label--hover">SIGN IN →</span>
              </span>
            </button>
          </div>
        </header>

        {/* ── SPLIT LAYOUT: LEFT SIDE CONTENT & SCROLL ANIMATIONS | RIGHT SIDE STICKY SIGN UP POPUP ── */}
        <div style={{ display: 'flex', width: '100%', minHeight: '100vh', position: 'relative' }}>
          
          {/* ── LEFT COLUMN: ALL SCROLL SECTIONS & ANIMATIONS ───────────────── */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* ── HERO SECTION ───────────────────────────────────────────────── */}
            <section ref={heroRef} style={{
              minHeight: '100svh', position: 'relative',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '140px 40px 80px', overflow: 'hidden',
            }}>
              {/* OpenGL 3D Matrix Mesh Canvas (inspired by 3D-animation.cpp) */}
              <OpenGL3DAnimationCanvas />

              {/* Background glow orbs */}
              <div style={{
                position: 'absolute', top: '50%', left: '35%', width: 750, height: 500,
                background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.24) 0%, rgba(255,0,144,0.1) 50%, transparent 75%)',
                filter: 'blur(50px)', pointerEvents: 'none', transform: 'translate(-50%,-50%)',
              }} />

              {/* Rotating badge (Iberian) */}
              <div style={{
                position: 'absolute', top: 110, right: 40, width: 130, height: 130,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg className="badge-rotate" viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                  <path id="badge-circle" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                  <text fill="#9bb8e1" style={{ fontFamily: 'JetBrains Mono', fontSize: 7.5, letterSpacing: '0.22em' }}>
                    <textPath href="#badge-circle">SYNAPS AI · 10-AGENT BOARDROOM · EVIDENCE GROUNDED ·</textPath>
                  </text>
                </svg>
                <Sparkles style={{ position: 'absolute', width: 20, height: 20, color: '#ff0090' }} />
              </div>

              {/* Headline with word-preserving character split */}
              <div style={{ maxWidth: 1000, position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <span className="dash-line" />
                  <span className="section-tag" data-slide-up>
                    <span className="section-tag__id">// SYSTEM 3.4</span> · DPDP ACT 2023 COMPLIANT
                  </span>
                </div>

                <h1
                  className="ff-teko"
                  data-anim-section
                  style={{ fontSize: 'clamp(54px, 8.5vw, 130px)', color: '#fff', marginBottom: 16, lineHeight: 0.88 }}
                >
                  <SplitText text="EVIDENCE GROUNDED" className="block" />
                  <SplitText text="ENTERPRISE BRAIN" className="block text-gradient-blue" />
                </h1>

                {/* Poly Floating Search Bar Simulation */}
                <div className="poly-search-bar my-6 p-4 sm:p-5 w-full max-w-[46rem] flex items-center justify-between gap-3 text-white text-sm sm:text-base" data-slide-up>
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Sparkles className="w-5 h-5 text-[#f4824d] shrink-0 animate-pulse" />
                    <div className="font-mono text-xs sm:text-sm text-white/90 truncate">
                      <span>{typedText}</span>
                      <span className="poly-cursor" />
                    </div>
                  </div>
                  <button
                    onClick={openModal}
                    className="poly-btn-orange px-4 py-2 text-xs font-semibold uppercase tracking-wider shrink-0 flex items-center gap-1.5"
                  >
                    <span>SEARCH ENGINE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Sub-grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px 40px', marginTop: 24, alignItems: 'end' }}>
                  <p className="body-copy" data-slide-up style={{ fontSize: 16, maxWidth: 480, lineHeight: 1.65 }}>
                    Synaps transforms complex organizational documents, contracts, and datasets into an
                    interactive, auditable knowledge graph. Powered by a{' '}
                    <strong style={{ color: '#9bb8e1' }}>10-agent boardroom</strong> debate engine — grounded in your sources with line-level evidence.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="ff-mono" style={{
                      fontSize: 11, color: 'rgba(155,184,225,0.7)', letterSpacing: '0.12em',
                      paddingLeft: 12, borderLeft: '2px solid #ff0090', lineHeight: 1.8,
                    }}>
                      PDF · EXCEL · DOCX · CSV<br />
                      ZERO HALLUCINATIONS GUARANTEED
                    </div>

                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      <button onClick={openModal} className="poly-btn-orange px-5 py-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                        <span>LAUNCH SYSTEM</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <Link href="/dashboard/chat" className="poly-btn-black px-5 py-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                        <span>OPEN APP</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* 3D Cyber Core Interactive Engine (Zero Purple, High FPS WebGL) */}
                <div className="mt-12 w-full h-[450px] sm:h-[550px] lg:h-[650px] relative rounded-2xl overflow-hidden border border-cyan-500/25 shadow-[0_0_50px_rgba(0,150,255,0.15)] bg-gradient-to-b from-[#090b14] to-[#04060b]" data-slide-up>
                  <Synaps3DCyberCoreCanvas />
                  <div className="absolute top-4 right-4 pointer-events-none z-10 flex items-center gap-2 bg-black/65 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-cyan-500/30">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="font-mono text-[10px] text-cyan-300 uppercase tracking-widest font-bold">3D INTERACTIVE SYNAPS ENGINE</span>
                  </div>
                </div>
              </div>

              {/* Scroll indicator (Hashgraph style dash-wipe) */}
              <div style={{
                position: 'absolute', bottom: 36, right: 30,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              }}>
                <span className="ff-mono" style={{ fontSize: 9, color: '#576676', letterSpacing: '0.2em', writingMode: 'vertical-rl' }}>SCROLL</span>
                <div style={{
                  width: 1, height: 40,
                  background: 'linear-gradient(180deg, #9bb8e1, #ff0090)',
                  margin: '0 auto',
                }} data-dash-vertical />
              </div>
            </section>

            {/* ── MARQUEE STRIP ───────────────────────────────────────────────── */}
            <div style={{
              width: '100%', overflow: 'hidden', whiteSpace: 'nowrap',
              borderTop: '1px solid rgba(155,184,225,0.1)',
              borderBottom: '1px solid rgba(155,184,225,0.1)',
              background: 'rgba(5,9,20,0.85)', padding: '14px 0',
            }}>
              <div ref={marqueeRef} className="marquee-track">
                {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                  <span key={i} className="ff-mono" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 16, padding: '0 28px',
                    fontSize: 11, color: 'rgba(155,184,225,0.75)', letterSpacing: '0.12em',
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#ff0090', display: 'inline-block' }} />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* ── POLY 3D SCATTER ASSETS GRID (poly.app style) ────────────────────────── */}
            <section className="relative py-20 px-6 max-w-[1000px] mx-auto overflow-hidden">
              <div className="text-center mb-14">
                <div className="section-tag mb-3" data-slide-up>
                  <span className="section-tag__id">// PLATFORM INTELLIGENCE</span> · POLY 3D ENGINE
                </div>
                <h2 className="title-main-poly text-4xl sm:text-6xl text-white">
                  Understand your data <span className="title-sub-poly text-[#f4824d]">naturally.</span>
                </h2>
                <p className="body-copy max-w-xl mx-auto mt-4 text-sm sm:text-base">
                  Synaps reads down to the paragraph, clause, page, or line number. To help you summarize, extract risk, calculate capital exposure, and collaborate seamlessly.
                </p>
              </div>

              {/* Poly Scatter Cards Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Scatter Card 1: Document Reasoning */}
                <div
                  className="poly-scatter-card p-6 flex flex-col justify-between h-[23rem]"
                  data-slide-up
                  onMouseMove={handleCard3DTilt}
                  onMouseLeave={handleCard3DReset}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#f4824d] bg-[#f4824d]/10 px-2 py-1 rounded border border-[#f4824d]/30">PDF · EXCEL · DOCX</span>
                    <FileText className="w-5 h-5 text-white/70" />
                  </div>
                  <div>
                    <h3 className="title-main-poly text-xl sm:text-2xl text-white mb-2">Document Reasoning</h3>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Deep vector embeddings ground every answer directly in source files with zero hallucination.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#9bb8e1]">
                    <span>contract_q3_risk.pdf</span>
                    <span>p.14 §4.2</span>
                  </div>
                </div>

                {/* Scatter Card 2: 10-Agent Boardroom */}
                <div
                  className="poly-scatter-card p-6 flex flex-col justify-between h-[23rem] lg:mt-6"
                  data-slide-up
                  onMouseMove={handleCard3DTilt}
                  onMouseLeave={handleCard3DReset}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/30">10-AGENT DEBATE</span>
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="title-main-poly text-xl sm:text-2xl text-white mb-2">Boardroom Consensus</h3>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Parallel multi-agent debate across Legal, CFO, Risk, Compliance, and Operations.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-cyan-300">
                    <span>Consensus Brief</span>
                    <span>AUDITABLE</span>
                  </div>
                </div>

                {/* Scatter Card 3: 3D Memory Graph */}
                <div
                  className="poly-scatter-card p-6 flex flex-col justify-between h-[23rem]"
                  data-slide-up
                  onMouseMove={handleCard3DTilt}
                  onMouseLeave={handleCard3DReset}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/30">3D GRAPH ENGINE</span>
                    <Globe className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="title-main-poly text-xl sm:text-2xl text-white mb-2">3D Memory Graph</h3>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Map entity connections, vendor liabilities, and regulatory dependencies across your org.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-cyan-300">
                    <span>Entity Links</span>
                    <span>NEURAL GRAPH</span>
                  </div>
                </div>

                {/* Scatter Card 4: Zero-Trust Vault */}
                <div
                  className="poly-scatter-card p-6 flex flex-col justify-between h-[23rem] lg:mt-6"
                  data-slide-up
                  onMouseMove={handleCard3DTilt}
                  onMouseLeave={handleCard3DReset}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/30">DPDP COMPLIANT</span>
                    <Lock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="title-main-poly text-xl sm:text-2xl text-white mb-2">Zero-Trust Vault</h3>
                    <p className="text-xs text-white/70 leading-relaxed">
                      AES-256 encryption, HTTP-Only sessions, multi-tenant isolation, 100% DPDP Act compliant.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-emerald-300">
                    <span>AES-256</span>
                    <span>ISOLATED</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ── PAGEBUDDY APP INTERACTIVE DOCUMENT STUDIO SECTION ──────────────────── */}
            <section className="relative py-16 px-6 max-w-[1000px] mx-auto overflow-hidden">
              <div className="text-center mb-10">
                <div className="section-tag mb-3" data-slide-up>
                  <span className="section-tag__id">// NEXT-GEN DOCS</span> · PAGEBUDDY ENGINE
                </div>
                <h2 className="title-main-poly text-4xl sm:text-6xl text-white">
                  Document intelligence <span className="title-sub-poly text-[#0496ff]">reimagined.</span>
                </h2>
                <p className="body-copy max-w-xl mx-auto mt-4 text-sm sm:text-base">
                  No more static, rigid PDFs or plain text. Synaps lets you edit, ground evidence, format semantic blocks, and generate reports on the fly.
                </p>
              </div>

              {/* Pagebuddy Interactive Document Canvas Card */}
              <div className="relative rounded-2xl border border-white/20 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl framer-spring-tilt" data-slide-up>
                
                {/* Pagebuddy Inline Text Formatting Controls Bar */}
                <div className="pagebuddy-inline-controls pagebuddy-drag-label-add mb-6 mx-auto w-fit px-4 py-2 flex items-center gap-4 text-xs text-white/90">
                  <div className="flex items-center gap-2 font-mono font-bold text-white bg-white/10 px-2.5 py-1 rounded-full cursor-pointer hover:bg-white/20 transition-colors">
                    <span>B</span>
                    <span className="text-[10px] text-white/60">Bold</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono italic text-white/80 px-2.5 py-1 rounded-full cursor-pointer hover:bg-white/10 transition-colors">
                    <span>I</span>
                    <span className="text-[10px] text-white/60">Italic</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono underline text-white/80 px-2.5 py-1 rounded-full cursor-pointer hover:bg-white/10 transition-colors">
                    <span>U</span>
                    <span className="text-[10px] text-white/60">Underline</span>
                  </div>
                  <div className="w-px h-4 bg-white/20" />
                  <span className="font-mono text-[10px] text-[#0496ff]">SYNAPS PARSER v3.4</span>
                </div>

                {/* Document Content View with Caret */}
                <div className="font-mono text-sm sm:text-base text-white/90 leading-relaxed max-w-2xl mx-auto p-5 rounded-xl border border-white/10 bg-black/50 relative overflow-hidden">
                  <div className="text-xs text-[#0496ff] mb-2 font-mono">// SECTION 4.2 · LIABILITY EXPOSURE AUDIT</div>
                  <p className="text-white/90">
                    &quot;The vendor warrants multi-tenant physical data isolation under DPDP Act 2023 compliance guidelines...&quot;
                    <span className="pagebuddy-caret" />
                  </p>
                </div>

                {/* Block Drag & Drop Toolbar */}
                <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 text-xs font-mono text-white/80 flex items-center gap-2 hover:border-[#0496ff]/60 transition-colors cursor-pointer">
                      <FileText className="w-3.5 h-3.5 text-[#0496ff]" />
                      <span>Paragraph</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 text-xs font-mono text-white/80 flex items-center gap-2 hover:border-[#0496ff]/60 transition-colors cursor-pointer">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Heading 1</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 text-xs font-mono text-white/80 flex items-center gap-2 hover:border-[#0496ff]/60 transition-colors cursor-pointer">
                      <Globe className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Columns</span>
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-white/50 italic flex items-center gap-1.5">
                    <span>Interactive block formatting ready</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#0496ff]" />
                  </div>
                </div>
              </div>
            </section>

            {/* ── MEASURED.SITE 3D PERSPECTIVE TUNNEL & LEADERBOARD SECTION ──────────── */}
            <section className="relative py-24 px-6 max-w-[1000px] mx-auto overflow-hidden">
              <div className="text-center mb-16">
                <div className="section-tag mb-3" data-slide-up>
                  <span className="section-tag__id">// REAL-TIME METRICS</span> · MEASURED 3D TUNNEL
                </div>
                <h2 className="title-main-poly text-4xl sm:text-7xl text-white">
                  Global enterprise <span className="title-sub-poly text-[#153bca]">performance.</span>
                </h2>
                <p className="body-copy max-w-xl mx-auto mt-4 text-sm sm:text-base">
                  Real-time throughput ranks every agent, memory node, and grounded search execution in 3D perspective space.
                </p>
              </div>

              {/* Measured 3D Perspective Tunnel Container */}
              <div className="measured-perspective-container my-10 max-w-3xl mx-auto space-y-4" data-slide-up>
                {MEASURED_3D_ITEMS.map((item, idx) => (
                  <div
                    key={idx}
                    className="measured-3d-item group p-4 sm:p-5 rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md flex items-center justify-between cursor-pointer"
                    style={{
                      transform: `perspective(700vw) rotateX(${(idx - 3.5) * 3}deg) translateZ(${-idx * 12}px)`,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs sm:text-sm font-bold text-[#153bca] bg-[#153bca]/15 px-2.5 py-1 rounded border border-[#153bca]/30">
                        {item.rank}
                      </span>
                      <span className="font-sans font-semibold text-white text-base sm:text-lg group-hover:text-[#153bca] transition-colors">
                        {item.label}
                      </span>
                    </div>
                    <span className="font-mono text-xs sm:text-sm text-white/60 group-hover:text-white transition-colors">
                      {item.stat}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── FEATURES ACCORDION (Huge Inc Hover Focus + Iberian Expand) ────── */}
            <section id="features" style={{ padding: '100px 40px', maxWidth: 1000 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 54, flexWrap: 'wrap', gap: 24 }}>
                <div>
                  <div className="section-tag" data-slide-up style={{ marginBottom: 14 }}>
                    <span className="section-tag__id">// 01</span> SYSTEM ARCHITECTURE
                  </div>
                  <h2 className="ff-teko" data-slide-up style={{ fontSize: 'clamp(48px, 6vw, 84px)', color: '#fff' }}>
                    BUILT FOR<br />ZERO RISK
                  </h2>
                </div>
                <p className="body-copy" data-slide-up style={{ maxWidth: 380, fontSize: 15, paddingTop: 20 }}>
                  Standard LLMs guess when they don&apos;t know. Synaps requires line-level evidence for every claim — or refuses to answer entirely.
                </p>
              </div>

              {/* Accordion list with Huge Inc hover-focus dimming */}
              <div className="huge-hover-list" style={{ borderTop: '1px solid rgba(155,184,225,0.15)' }}>
                {FEATURES.map((f) => {
                  const isOpen = openFeature === f.id;
                  const isHovered = hoveredFeature === f.id;

                  return (
                    <div
                      key={f.id}
                      className="huge-hover-item"
                      onMouseEnter={() => setHoveredFeature(f.id)}
                      onMouseLeave={() => setHoveredFeature(null)}
                      style={{ borderBottom: '1px solid rgba(155,184,225,0.15)' }}
                    >
                      <button
                        onClick={() => setOpenFeature(isOpen ? null : f.id)}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center',
                          justifyContent: 'space-between', padding: '24px 0',
                          background: 'none', border: 'none', cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'padding-left 0.4s cubic-bezier(0.14, 1, 0.34, 1)',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.paddingLeft = '10px')}
                        onMouseLeave={e => (e.currentTarget.style.paddingLeft = '0')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                          <span className="ff-mono" style={{
                            fontSize: 15,
                            color: isOpen ? '#ff0090' : isHovered ? '#9bb8e1' : 'rgba(155,184,225,0.35)',
                            transition: 'color 0.3s ease', minWidth: 38,
                          }}>
                            [{f.id}]
                          </span>
                          <div>
                            <h3 className="ff-teko" style={{
                              fontSize: 'clamp(24px, 3vw, 42px)',
                              color: isOpen ? '#ff0090' : isHovered ? '#ffffff' : '#eee',
                              transition: 'color 0.3s ease', lineHeight: 1,
                            }}>
                              {f.title}
                            </h3>
                            <span className="ff-mono" style={{ fontSize: 10, color: '#73767d', letterSpacing: '0.1em' }}>{f.sub}</span>
                          </div>
                        </div>

                        <div className={`accordion-icon ${isOpen ? 'open' : ''}`} style={{
                          width: 40, height: 40, borderRadius: '50%',
                          border: `1px solid ${isOpen ? '#ff0090' : isHovered ? '#9bb8e1' : 'rgba(155,184,225,0.2)'}`,
                          background: isOpen ? 'rgba(255,0,144,0.15)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: isOpen ? '#ff0090' : '#9bb8e1', flexShrink: 0,
                          transition: 'transform 0.8s cubic-bezier(0.14,1,0.34,1), border-color 0.3s, background 0.3s',
                        }}>
                          <Plus style={{ width: 16, height: 16 }} />
                        </div>
                      </button>

                      <div className={`accordion-body ${isOpen ? 'open' : ''}`}>
                        <div style={{
                          paddingLeft: 62, paddingBottom: 28, paddingRight: 40,
                          maxWidth: 700,
                        }}>
                          <p className="body-copy" style={{ fontSize: 14.5, lineHeight: 1.7 }}>
                            {f.body}
                          </p>

                          <div style={{ display: 'flex', gap: 14, marginTop: 20 }}>
                            <button onClick={openModal} className="synaps-btn" style={{ height: 40, fontSize: 11 }}>
                              <svg className="synaps-btn__border" aria-hidden="true">
                                <rect x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="5" ry="5" />
                              </svg>
                              <span className="synaps-btn__shimmer"><span className="synaps-btn__shimmer-inner" /></span>
                              <span className="synaps-btn__label">
                                <span className="synaps-btn__label--base">TRY THIS FEATURE →</span>
                                <span className="synaps-btn__label--hover">SIGN IN →</span>
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ── 10-AGENT BOARDROOM (Huge Inc Grid + Dim Hover) ────────────────── */}
            <section id="boardroom" style={{
              background: 'rgba(5,9,20,0.95)',
              borderTop: '1px solid rgba(155,184,225,0.08)',
              borderBottom: '1px solid rgba(155,184,225,0.08)',
              padding: '100px 40px',
            }}>
              <div style={{ maxWidth: 1000 }}>
                <div style={{ textAlign: 'left', marginBottom: 54 }}>
                  <div className="section-tag" data-slide-up style={{ marginBottom: 14 }}>
                    <span className="section-tag__id">// 02</span> PARALLEL REASONING ENGINE
                  </div>
                  <h2 className="ff-teko" data-slide-up style={{ fontSize: 'clamp(48px, 6vw, 84px)', color: '#fff' }}>
                    THE 10-AGENT<br />
                    <span className="text-gradient-blue">BOARDROOM</span>
                  </h2>
                  <p className="body-copy" data-slide-up style={{ maxWidth: 500, margin: '14px 0 0', fontSize: 15 }}>
                    Ten specialized AI personas analyze your documents simultaneously and debate before responding.
                  </p>
                </div>

                {/* Grid of Agents with Huge Inc hover list dimming */}
                <div className="huge-hover-list" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: 14,
                }}>
                  {AGENTS.map((agent, i) => (
                    <div
                      key={i}
                      className="agent-card huge-hover-item"
                      data-agent-card
                      onMouseEnter={() => setHoveredAgent(i)}
                      onMouseLeave={() => setHoveredAgent(null)}
                      style={{
                        padding: '22px 18px',
                        borderRadius: 12,
                        background: 'rgba(0, 2, 9, 0.85)',
                        border: hoveredAgent === i ? '1px solid #ff0090' : '1px solid rgba(155,184,225,0.12)',
                      }}
                    >
                      <div style={{
                        width: 34, height: 34, borderRadius: 8,
                        background: hoveredAgent === i ? 'rgba(255,0,144,0.15)' : 'rgba(124,58,237,0.12)',
                        border: hoveredAgent === i ? '1px solid #ff0090' : '1px solid rgba(124,58,237,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: hoveredAgent === i ? '#ff0090' : '#9bb8e1', marginBottom: 14,
                        transition: 'transform 0.4s cubic-bezier(0.14,1,0.34,1), background 0.3s, border-color 0.3s',
                      }}>
                        <agent.icon style={{ width: 16, height: 16 }} />
                      </div>
                      <h4 className="ff-teko" style={{
                        fontSize: 20, color: hoveredAgent === i ? '#ffffff' : '#eee', marginBottom: 4, letterSpacing: '0.05em',
                      }}>
                        {agent.title}
                      </h4>
                      <p className="ff-mono" style={{ fontSize: 9.5, color: '#73767d', letterSpacing: '0.06em' }}>
                        {agent.role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── SECURITY ─────────────────────────────────────────────────────── */}
            <section id="security" style={{ padding: '100px 40px' }}>
              <div style={{ maxWidth: 1000, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px 60px', alignItems: 'start' }}>
                <div>
                  <div className="section-tag" data-slide-up style={{ marginBottom: 14 }}>
                    <span className="section-tag__id">// 03</span> SECURITY & TRUST
                  </div>
                  <h2 className="ff-teko" data-slide-up style={{ fontSize: 'clamp(40px, 4.5vw, 68px)', color: '#fff', marginBottom: 20 }}>
                    ENTERPRISE-GRADE<br />SECURITY.<br />
                    <span style={{ color: '#ff0090' }}>BUILT-IN.</span>
                  </h2>
                  <p className="body-copy" data-slide-up style={{ fontSize: 15, lineHeight: 1.7 }}>
                    Your documents, your organisation, your data. Synaps never mixes data across tenants. Every request is authenticated. Every session is isolated. DPDP Act 2023 compliant from day one.
                  </p>

                  <button onClick={openModal} className="synaps-btn" style={{ marginTop: 32, height: 48, fontSize: 12 }}>
                    <svg className="synaps-btn__border" aria-hidden="true">
                      <rect x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="5" ry="5" />
                    </svg>
                    <span className="synaps-btn__shimmer"><span className="synaps-btn__shimmer-inner" /></span>
                    <span className="synaps-btn__label">
                      <span className="synaps-btn__label--base">START FREE TRIAL →</span>
                      <span className="synaps-btn__label--hover">GET SECURE ACCESS →</span>
                    </span>
                  </button>
                </div>

                <div data-anim-section style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    'AES-256 encryption at rest & in transit',
                    'Multi-tenant physical data isolation',
                    'HTTP-Only session tokens (no XSS)',
                    'DPDP Act 2023 compliant audit logs',
                    '2FA / MFA authentication support',
                    'Zero user data trained on models — ever',
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="anim-body-line"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '16px 0',
                        borderBottom: '1px solid rgba(155,184,225,0.1)',
                        transitionDelay: `${i * 0.1}s`,
                      }}
                    >
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%',
                        background: 'rgba(255,0,144,0.1)', border: '1px solid rgba(255,0,144,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="#ff0090" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span className="ff-mono" style={{ fontSize: 12.5, color: '#b7c6d4', letterSpacing: '0.03em' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── PRICING SECTION (Neo-Brutalist 3-Tier Breakdown) ────────────────── */}
            <section id="pricing" className="relative py-24 px-6 max-w-[1000px] mx-auto overflow-hidden">
              <div className="text-center mb-16">
                <div className="section-tag mb-3" data-slide-up>
                  <span className="section-tag__id">// 04</span> TRANSPARENT PRICING
                </div>
                <h2 className="title-main-poly text-4xl sm:text-7xl text-white">
                  Built for creators, <span className="title-sub-poly text-[#0496ff]">scaled for enterprise.</span>
                </h2>
                <p className="body-copy max-w-xl mx-auto mt-4 text-sm sm:text-base">
                  Choose the plan that fits your organizational scale. No hidden fees, instant activation.
                </p>
              </div>

              {/* 3-Tier Pricing Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10" data-slide-up>
                {/* Free Tier */}
                <div className="p-8 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl flex flex-col justify-between hover:border-white/30 transition-all">
                  <div>
                    <div className="font-mono text-xs text-white/50 uppercase tracking-widest mb-2">// STARTER</div>
                    <h3 className="title-main-poly text-2xl text-white font-bold mb-1">Free</h3>
                    <div className="text-3xl font-mono font-bold text-white my-4">$0 <span className="text-xs text-white/40 font-normal">/ mo</span></div>
                    <p className="text-xs text-white/60 mb-6 leading-relaxed">Perfect for exploring line-level document intelligence and basic vector search.</p>
                    <ul className="space-y-3 text-xs font-mono text-white/80">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#0496ff]" /> 1 Active Workspace</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#0496ff]" /> 50 Document Parsing Runs / mo</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#0496ff]" /> Basic Semantic Search</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#0496ff]" /> Community Support</li>
                    </ul>
                  </div>
                  <button onClick={openModal} className="mt-8 w-full py-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white font-mono text-xs transition-all">
                    START FREE →
                  </button>
                </div>

                {/* Pro Tier (Featured / Popular) */}
                <div className="zero-card-glow p-8 rounded-2xl border-2 border-[#0496ff] bg-gradient-to-b from-[#0496ff]/15 to-slate-900/80 backdrop-blur-xl flex flex-col justify-between shadow-2xl relative">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#0496ff] text-white font-mono text-[10px] font-bold uppercase tracking-widest shadow-lg">
                    MOST POPULAR
                  </div>
                  <div>
                    <div className="font-mono text-xs text-[#0496ff] uppercase tracking-widest mb-2">// PRO INTELLIGENCE</div>
                    <h3 className="title-main-poly text-2xl text-white font-bold mb-1">Pro</h3>
                    <div className="flex items-baseline gap-2 my-4">
                      <div className="text-4xl font-mono font-bold text-white">$7 <span className="text-xs text-white/50 font-normal">/ mo</span></div>
                      <div className="text-xs font-mono text-[#0496ff] bg-[#0496ff]/15 px-2 py-0.5 rounded border border-[#0496ff]/30">Or $1.99 / wk</div>
                    </div>
                    <p className="text-xs text-white/70 mb-6 leading-relaxed">Full 500 daily AI credits, 10-Agent Boardroom, and 3D Corporate Memory Graph.</p>
                    <ul className="space-y-3 text-xs font-mono text-white/90">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#0496ff]" /> 500 AI Credits / Day (Immediate Upgrade)</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#0496ff]" /> Collaborative 10-Agent AI Boardroom</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#0496ff]" /> 3D Corporate Memory Graph</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#0496ff]" /> Line-Level Grounded Citations</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#0496ff]" /> 14-Day 100% Money-Back Guarantee</li>
                    </ul>
                  </div>
                  <button onClick={openModal} className="mt-8 w-full py-3 rounded-lg bg-[#0496ff] hover:bg-[#0496ff]/90 text-white font-mono text-xs font-bold transition-all shadow-lg">
                    GET STARTED PRO ($7/MO) →
                  </button>
                </div>

                {/* Studio / Enterprise Tier */}
                <div className="zero-card-glow p-8 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl flex flex-col justify-between hover:border-white/30 transition-all">
                  <div>
                    <div className="font-mono text-xs text-cyan-400 uppercase tracking-widest mb-2">// ENTERPRISE MAX</div>
                    <h3 className="title-main-poly text-2xl text-white font-bold mb-1">Enterprise Max</h3>
                    <div className="flex items-baseline gap-2 my-4">
                      <div className="text-4xl font-mono font-bold text-white">$20 <span className="text-xs text-white/50 font-normal">/ mo</span></div>
                      <div className="text-xs font-mono text-cyan-400 bg-cyan-500/15 px-2 py-0.5 rounded border border-cyan-500/30">Or $4.99 / wk</div>
                    </div>
                    <p className="text-xs text-white/60 mb-6 leading-relaxed">Unlimited AI capabilities, custom LLM keys, and zero-trust data isolation.</p>
                    <ul className="space-y-3 text-xs font-mono text-white/80">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Unlimited Daily AI Credits &amp; Workspaces</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Custom LLM Provider API Keys</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Zero-Trust Multi-Tenant Isolation</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> 100% DPDP Act 2023 Compliance Audits</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> 24/7 Dedicated Account Manager</li>
                    </ul>
                  </div>
                  <button onClick={openModal} className="mt-8 w-full py-3 rounded-lg border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-mono text-xs transition-all">
                    UPGRADE TO ENTERPRISE ($20/MO) →
                  </button>
                </div>
              </div>
            </section>

            {/* ── CTA ──────────────────────────────────────────────────────────── */}
            <section style={{
              padding: '120px 40px', textAlign: 'center',
              background: 'linear-gradient(180deg, #000209 0%, #060112 50%, #000209 100%)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                width: 700, height: 700,
                background: 'radial-gradient(ellipse at center, rgba(255,0,144,0.15) 0%, transparent 75%)',
                filter: 'blur(60px)', pointerEvents: 'none',
              }} />

              <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <div className="section-tag" data-slide-up style={{ marginBottom: 20, display: 'block' }}>
                  <span className="section-tag__id">// READY TO START</span>
                </div>

                <h2 className="ff-teko" data-anim-section style={{
                  fontSize: 'clamp(40px, 7vw, 96px)', color: '#fff', lineHeight: 0.9, marginBottom: 24,
                }}>
                  <SplitText text="YOUR ENTERPRISE" className="block" />
                  <SplitText text="BRAIN STARTS" className="block text-gradient-blue" />
                  <SplitText text="HERE" className="block" />
                </h2>

                <p className="body-copy" data-slide-up style={{ fontSize: 15, marginBottom: 40, lineHeight: 1.75, maxWidth: 520, margin: '0 auto 40px' }}>
                  Join teams already using Synaps to move faster, decide better, and eliminate document chaos.
                </p>

                <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button onClick={openModal} className="synaps-btn" style={{ height: 50, fontSize: 13 }}>
                    <svg className="synaps-btn__border" aria-hidden="true">
                      <rect x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="5" ry="5" />
                    </svg>
                    <span className="synaps-btn__shimmer"><span className="synaps-btn__shimmer-inner" /></span>
                    <span className="synaps-btn__label">
                      <span className="synaps-btn__label--base">GET STARTED FREE <ArrowRight style={{ width: 15, height: 15 }} /></span>
                      <span className="synaps-btn__label--hover">SIGN UP NOW →</span>
                    </span>
                  </button>

                  <button onClick={openModal} className="btn-inc h-[50px]">
                    <span>INCREDIBLES DEPLOYMENT</span>
                    <span className="btn-inc__hover">LAUNCH NOW →</span>
                  </button>

                  <Link href="/dashboard/chat" className="synaps-btn" style={{
                    height: 50, fontSize: 13,
                    border: '1px solid rgba(155,184,225,0.25)',
                    borderRadius: 6,
                  }}>
                    <span className="synaps-btn__label" style={{ position: 'relative', zIndex: 2 }}>
                      OPEN LIVE APP <ArrowUpRight className="w-3.5 h-3.5 huge-arrow" />
                    </span>
                  </Link>
                </div>

                <p className="ff-mono" style={{ marginTop: 20, fontSize: 10.5, color: '#73767d', letterSpacing: '0.1em' }}>
                  NO CREDIT CARD · SETUP IN 2 MINUTES
                </p>
              </div>
            </section>

            {/* ── SHADER.SE INTERACTIVE CONTACT STUDIO SECTION ─────────────────────── */}
            <section id="contact" className="relative py-24 px-6 max-w-[1000px] mx-auto border-t border-white/10 overflow-hidden">
              <div className="text-center mb-16">
                <div className="section-tag mb-3" data-slide-up>
                  <span className="section-tag__id">// SHADER STUDIO</span> · GET IN TOUCH
                </div>
                <h2 className="title-main-poly text-4xl sm:text-7xl text-white">
                  Let&apos;s build the <span className="title-sub-poly text-[#ff0090]">future.</span>
                </h2>
                <p className="body-copy max-w-xl mx-auto mt-4 text-sm sm:text-base">
                  Contact our executive team for custom enterprise deployments, DPDP audit consultations, or technical integration inquiries.
                </p>
              </div>

              {/* Shader.se Editorial Contact Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10" data-slide-up>
                {/* Fieldset 1: General Enquiries */}
                <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl hover:border-[#ff0090]/50 transition-all group">
                  <div className="font-mono text-[10px] text-[#ff0090] tracking-widest uppercase mb-3">// GENERAL ENQUIRIES</div>
                  <a href="mailto:hello@synaps.ai" className="block text-white font-semibold text-base mb-2 group-hover:text-[#ff0090] transition-colors">
                    hello@synaps.ai
                  </a>
                  <button onClick={openModal} className="text-xs font-mono text-white/60 hover:text-white flex items-center gap-1 transition-colors mt-4">
                    <span>Book Executive Call</span>
                    <ArrowUpRight className="w-3 h-3 text-[#ff0090]" />
                  </button>
                </div>

                {/* Fieldset 2: Enterprise Hub */}
                <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl hover:border-[#0496ff]/50 transition-all group">
                  <div className="font-mono text-[10px] text-[#0496ff] tracking-widest uppercase mb-3">// ENTERPRISE HUB</div>
                  <div className="text-white font-semibold text-sm leading-relaxed">
                    Synaps Citadel<br />
                    Cyber City, Gurugram<br />
                    <span className="text-white/60 text-xs">India &amp; Global Remote</span>
                  </div>
                </div>

                {/* Fieldset 3: Social Networks */}
                <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl hover:border-cyan-500/50 transition-all group">
                  <div className="font-mono text-[10px] text-cyan-400 tracking-widest uppercase mb-3">// SOCIAL NETWORKS</div>
                  <div className="flex flex-col gap-2 font-mono text-xs text-white/80">
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center justify-between">
                      <span>LinkedIn</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                    <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center justify-between">
                      <span>X (Twitter)</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                    <a href="https://github.com/novaecosystems-cloud/Synaps" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center justify-between">
                      <span>GitHub Repo</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Fieldset 4: New Business */}
                <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl hover:border-emerald-400/50 transition-all group">
                  <div className="font-mono text-[10px] text-emerald-400 tracking-widest uppercase mb-3">// NEW BUSINESS</div>
                  <a href="mailto:ceo@synaps.ai" className="block text-white font-semibold text-base mb-2 group-hover:text-emerald-400 transition-colors">
                    ceo@synaps.ai
                  </a>
                  <p className="text-[11px] font-mono text-white/50 leading-normal">
                    Reach out directly for DPDP Act compliance auditing and custom SLA agreements.
                  </p>
                </div>
              </div>
            </section>

            {/* ── FOOTER ───────────────────────────────────────────────────────── */}
            <footer style={{
              padding: '36px 40px',
              borderTop: '1px solid rgba(155,184,225,0.08)',
              background: '#000209',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="ff-teko" style={{ fontSize: 20, color: '#fff', letterSpacing: '0.08em' }}>SYNAPS AI</span>
                <span className="ff-mono" style={{ fontSize: 10, color: '#73767d', marginLeft: 8 }}>
                  © {new Date().getFullYear()}
                </span>
              </div>

              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <a href="/dashboard/chat" className="ff-mono huge-link" style={{ fontSize: 10, color: '#73767d', letterSpacing: '0.12em' }}>APP</a>
                <a href="/dashboard/documents" className="ff-mono huge-link" style={{ fontSize: 10, color: '#73767d', letterSpacing: '0.12em' }}>DOCUMENTS</a>
                <button onClick={() => setLegalModalDoc('terms')} className="ff-mono cursor-pointer hover:text-white" style={{ fontSize: 10, color: '#73767d', letterSpacing: '0.12em' }}>TERMS OF SERVICE</button>
                <button onClick={() => setLegalModalDoc('privacy')} className="ff-mono cursor-pointer hover:text-white" style={{ fontSize: 10, color: '#73767d', letterSpacing: '0.12em' }}>PRIVACY POLICY</button>
                <button onClick={() => setLegalModalDoc('security')} className="ff-mono cursor-pointer hover:text-white" style={{ fontSize: 10, color: '#73767d', letterSpacing: '0.12em' }}>SECURITY & SOC2</button>
                <button onClick={() => setLegalModalDoc('cookies')} className="ff-mono cursor-pointer hover:text-white" style={{ fontSize: 10, color: '#73767d', letterSpacing: '0.12em' }}>COOKIE POLICY</button>
              </div>
            </footer>
          </div>

          {/* ── RIGHT COLUMN: PERSISTENT STICKY SIGN UP POPUP CARD ──────────── */}
          <div className="hidden lg:block" style={{ width: 440, paddingRight: 40, paddingTop: 100, flexShrink: 0 }}>
            <div style={{ position: 'sticky', top: 100, zIndex: 90 }}>
              <SignInCardInline />
            </div>
          </div>

        </div>

        {/* ── SIGN IN & LEGAL MODALS ─────────────────────────── */}
        <SignInModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
        <LegalDialogModal type={legalModalDoc} onClose={() => setLegalModalDoc(null)} />
      </div>
    </>
  );
}
