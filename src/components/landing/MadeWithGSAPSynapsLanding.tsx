'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Lenis from 'lenis';
import CommandMenuModal from '../CommandMenuModal';
import SpotlightTiltCard from './SpotlightTiltCard';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

// ─── 3D WEBGL BACKGROUND & SCENE RIG (FOLIO-2026 R3F ENGINE) ──────────────────
function MemoryGraphPoints({ scrollProgress }: { scrollProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, colors, linePositions } = useMemo(() => {
    const count = 1800;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const radius = 3.5 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Lime green & cyan enterprise memory palette
      if (i % 3 === 0) {
        color.set('#CAFF00');
      } else if (i % 3 === 1) {
        color.set('#38bdf8');
      } else {
        color.set('#a855f7');
      }

      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    // Connect random pairs for 3D memory graph web
    const lineIndices: number[] = [];
    for (let i = 0; i < count; i += 12) {
      for (let j = i + 1; j < i + 4; j++) {
        if (j < count) {
          lineIndices.push(
            pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
            pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
          );
        }
      }
    }

    return {
      positions: pos,
      colors: col,
      linePositions: new Float32Array(lineIndices),
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.08 + scrollProgress * Math.PI * 0.5;
      pointsRef.current.rotation.x = Math.sin(t * 0.05) * 0.2 + scrollProgress * 0.3;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = t * 0.08 + scrollProgress * Math.PI * 0.5;
      linesRef.current.rotation.x = Math.sin(t * 0.05) * 0.2 + scrollProgress * 0.3;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          vertexColors
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#CAFF00"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

function OrbitingAgentNodes({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const nodes = useMemo(() => [
    { label: 'Research', color: '#CAFF00', r: 4.2, speed: 0.4 },
    { label: 'Finance', color: '#38bdf8', r: 4.8, speed: -0.3 },
    { label: 'Legal', color: '#a855f7', r: 5.2, speed: 0.5 },
    { label: 'Infosec', color: '#f43f5e', r: 4.5, speed: -0.4 },
    { label: 'CFO Twin', color: '#CAFF00', r: 5.8, speed: 0.2 },
    { label: 'CEO Twin', color: '#e0e7ff', r: 6.2, speed: -0.25 },
  ], []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1;
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, -scrollProgress * 4, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => {
        const angle = (i / nodes.length) * Math.PI * 2;
        const x = Math.cos(angle) * node.r;
        const y = Math.sin(angle * 1.5) * 1.2;
        const z = Math.sin(angle) * node.r;
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={1.5}
              roughness={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function WebGLScene({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.z = 7 - scrollProgress * 2;
    camera.position.y = -scrollProgress * 1.2;
  }, [scrollProgress, camera]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 10]} intensity={1.2} color="#CAFF00" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#38bdf8" />
      <MemoryGraphPoints scrollProgress={scrollProgress} />
      <OrbitingAgentNodes scrollProgress={scrollProgress} />
    </>
  );
}

// ─── TEXT SCRAMBLER ───────────────────────────────────────────────────────────
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
      const start = Math.floor(Math.random() * 16);
      const end = start + Math.floor(Math.random() * 16);
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
        output += `<span style="color:#CAFF00;opacity:0.6">${this.queue[i].char}</span>`;
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

// ─── MARQUEE ──────────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  'ENTERPRISE INTELLIGENCE', 'DECISION MEMORY', '10 AI AGENTS', 'CORPORATE GRAPH',
  'BOARDROOM SIMULATION', 'KNOWLEDGE INGESTION', 'RISK ANALYSIS', 'STRATEGY STUDIO',
];

function Marquee({ reverse = false }: { reverse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const w = ref.current.scrollWidth / 2;
    gsap.fromTo(ref.current, { x: reverse ? -w : 0 }, {
      x: reverse ? 0 : -w, duration: 30, ease: 'none', repeat: -1,
    });
  }, [reverse]);
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <div ref={ref} style={{ display: 'flex', gap: 56, whiteSpace: 'nowrap', width: 'max-content' }}>
        {items.map((item, i) => (
          <span key={i} style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '4px',
            color: i % 3 === 0 ? '#CAFF00' : 'rgba(255,255,255,0.22)',
            fontFamily: "'JetBrains Mono', monospace",
            textTransform: 'uppercase'
          }}>
            {item} <span style={{ color: 'rgba(255,255,255,0.12)', marginLeft: 8 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const SUITES = [
  { id: '01', tag: 'COMMAND CONSOLE', label: 'AI COO Command Console', sub: 'Briefing & Operational Intelligence', color: '#CAFF00',
    desc: 'Transforms all your documents, emails, CRMs, and contracts into a real-time operational briefing — grounded in your actual organizational memory, never hallucinated.',
    specs: ['Org Health Score & Coverage', 'Decision Confidence Meter', 'Zero-Retention Memory SLA', '24/7 Real-Time Anomaly Audit'],
    stat: '99.4%', statLabel: 'Synthesis Accuracy' },
  { id: '02', tag: 'FLIGHT CONTROL', label: 'Multi-Agent Flight Control', sub: '10 Parallel AI Agent Orchestration', color: '#FFFFFF',
    desc: 'Orchestrates 10 specialized AI agents (Research, Finance, Legal, Engineering, Infosec, HR) simultaneously — each grounded in your company knowledge graph.',
    specs: ['10 Specialized Agent Personas', 'Shared Memory Graph Pipeline', 'Parallel Task Execution', 'Full Audit Log & Provenance'],
    stat: '10×', statLabel: 'Parallel Throughput' },
  { id: '03', tag: 'DIGITAL TWINS', label: 'Executive Boardroom Twins', sub: '8 C-Suite Personas, Zero Hallucination', color: '#CAFF00',
    desc: 'Simulates how your CEO, CFO, CTO, Legal, HR would respond to any strategic scenario — grounded in historical company memory and risk tolerances.',
    specs: ['8 C-Suite Persona Twins', 'Stress-Testing Strategic Options', 'Consensus & Divergence Heatmaps', 'Debate Record Generation'],
    stat: '8', statLabel: 'C-Suite Personas' },
  { id: '04', tag: 'STRATEGY STUDIO', label: 'AI Strategy Studio', sub: '11-Stage Enterprise Roadmap Generator', color: '#FFFFFF',
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
    tag: '01 / MEMORY GRAPH',
    title: 'Permanent\nOrganizational\nMemory',
    desc: 'Every document, email, contract, and decision your organization has ever made — indexed, linked into a 4D WebGL graph, and retrievable in under 2 seconds.',
    accent: '#CAFF00',
  },
  {
    tag: '02 / AGENT FLIGHT CONTROL',
    title: '10 Parallel AI Agents\nWorking in Sync',
    desc: 'Research, Finance, Legal, Engineering, Infosec, and HR agents run simultaneously — each grounded in your actual company memory graph.',
    accent: '#38bdf8',
  },
  {
    tag: '03 / C-SUITE TWINS',
    title: '8 Executive Digital Twins\nat Your Command',
    desc: 'Simulate how your CEO, CFO, and CTO would respond to any high-stakes scenario before it reaches the real boardroom.',
    accent: '#CAFF00',
  },
  {
    tag: '04 / STRATEGY STUDIO',
    title: 'Enterprise Roadmaps\nin Minutes Not Months',
    desc: '11-stage transformation roadmaps, competitive threat analysis, and Red-Team AI challenges generated at machine speed.',
    accent: '#a855f7',
  },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function MadeWithGSAPSynapsLanding() {
  const [billingCycle, setBillingCycle] = useState<'weekly' | 'monthly' | 'annual'>('weekly');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCard, setActiveCard] = useState(0);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorActive, setCursorActive] = useState(false);
  const heroWordRef = useRef<HTMLSpanElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  // Initialize Lenis Smooth Scroll (folio-2026 spec)
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

    lenis.on('scroll', (e: any) => {
      ScrollTrigger.update();
      if (document.documentElement.scrollHeight > window.innerHeight) {
        setScrollProgress(e.scroll / (document.documentElement.scrollHeight - window.innerHeight));
      }
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  // Custom Cursor (Folio 2026 style)
  useEffect(() => {
    const move = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setCursorActive(true);
    };
    const leave = () => setCursorActive(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseleave', leave);
    };
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-badge', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 });
      gsap.fromTo('.hero-line-1', { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, ease: 'power4.out', delay: 0.4 });
      gsap.fromTo('.hero-line-2', { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, ease: 'power4.out', delay: 0.6 });
      gsap.fromTo('.hero-line-3', { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, ease: 'power4.out', delay: 0.8 });
      gsap.fromTo('.hero-sub', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 1.1 });
      gsap.fromTo('.hero-cta', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.3 });
      gsap.fromTo('.hero-stats', { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out', delay: 1.6 });

      // ScrollTrigger reveal sections
      document.querySelectorAll('.reveal-section').forEach((el) => {
        gsap.fromTo(
          el.querySelectorAll('.reveal-child'),
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none none' }
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  // Text Scramble Loop
  useEffect(() => {
    const words = ['DECISION MEMORY', '10 AI AGENTS', 'C-SUITE TWINS', 'STRATEGY OS', 'ORGANIZATIONAL GRAPH'];
    let idx = 0;
    const el = heroWordRef.current;
    if (!el) return;
    const scrambler = new TextScrambler(el);
    const cycle = () => {
      scrambler.setText(words[idx]).then(() => { setTimeout(cycle, 2400); });
      idx = (idx + 1) % words.length;
    };
    const timer = setTimeout(cycle, 1600);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcut (⌘K)
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
    const t = setInterval(() => setActiveCard(p => (p + 1) % SUITES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const filteredSuites = searchQuery ? SUITES.filter(s =>
    s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tag.toLowerCase().includes(searchQuery.toLowerCase())
  ) : SUITES;

  return (
    <div ref={mainRef} style={{ background: '#050505', color: '#fff', fontFamily: "'Space Grotesk', sans-serif", minHeight: '100vh', overflowX: 'hidden' }} className="relative">

      {/* ── GLOBAL STYLES ─────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        *{margin:0;padding:0;box-sizing:border-box;}
        html{scroll-behavior:smooth;}
        body{background:#050505;overflow-x:hidden;}
        ::selection{background:#CAFF00;color:#000;}

        /* Custom Cursor */
        .custom-cursor {
          position: fixed; width: 10px; height: 10px; background: #CAFF00;
          border-radius: 50%; pointer-events: none; z-index: 9999;
          transition: transform 0.15s cubic-bezier(0.23,1,0.32,1);
          mix-blend-mode: difference;
        }

        /* Buttons */
        .btn-lime {
          display: inline-flex; align-items: center; gap: 8px;
          background: #CAFF00; color: #000;
          border: none; font-family: 'Space Grotesk', sans-serif;
          font-size: 13.5px; font-weight: 800; letter-spacing: 0.01em;
          padding: 13px 26px; border-radius: 999px; cursor: pointer;
          text-decoration: none; transition: all 0.3s cubic-bezier(0.23,1,0.32,1);
        }
        .btn-lime:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(202,255,0,0.35); }

        .btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: rgba(255,255,255,0.75);
          border: 1px solid rgba(255,255,255,0.15);
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13.5px; font-weight: 600; letter-spacing: 0.01em;
          padding: 13px 26px; border-radius: 999px; cursor: pointer;
          text-decoration: none; transition: all 0.25s;
        }
        .btn-outline:hover { border-color: rgba(255,255,255,0.5); color: #fff; }

        /* Typography */
        .display-xl {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(60px, 9vw, 140px);
          font-weight: 900; line-height: 0.9;
          letter-spacing: -0.045em; color: #fff;
        }
        .display-md {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(34px, 4.5vw, 68px);
          font-weight: 900; line-height: 0.96;
          letter-spacing: -0.035em; color: #fff;
        }
        .display-lime { color: #CAFF00; }
        .display-dim { color: rgba(255,255,255,0.25); }

        .label-mono {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px; font-weight: 600;
          color: rgba(255,255,255,0.32); letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        /* Glass Cards */
        .glass-card {
          background: rgba(15,15,15,0.85);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
          border-radius: 20px; transition: all 0.35s cubic-bezier(0.23,1,0.32,1);
        }
        .glass-card:hover {
          border-color: rgba(202,255,0,0.3); transform: translateY(-4px);
        }

        /* Pricing Card */
        .pricing-card {
          background: #0d0d0d; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px; padding: 36px 32px;
          display: flex; flex-direction: column; transition: transform 0.35s cubic-bezier(0.23,1,0.32,1);
        }
        .pricing-card:hover { transform: translateY(-5px); }
        .pricing-card.featured {
          background: linear-gradient(145deg, #0e1b00, #0c0c0c);
          border-color: rgba(202,255,0,0.35);
          box-shadow: 0 0 60px rgba(202,255,0,0.08);
        }

        /* Marquee Wrapper */
        .marquee-wrap { padding: 22px 0; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); }

        /* Pulse Dot */
        @keyframes pulse-dot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.8);opacity:0.3} }
        .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }

        .overflow-clip { overflow: hidden; }
      `}</style>

      {/* ── CUSTOM CURSOR ──────────────────────────────────────────────────── */}
      <div
        className="custom-cursor"
        style={{
          transform: `translate(${cursorPos.x - 5}px, ${cursorPos.y - 5}px)`,
          opacity: cursorActive ? 1 : 0,
        }}
      />

      {/* ── 3D WEBGL CANVAS (R3F BACKGROUND ENGINE) ────────────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-60">
        <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
          <WebGLScene scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      {/* ── HEADER HUD ──────────────────────────────────────────────────────── */}
      <header style={{
        position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
        width: 'calc(100% - 48px)', maxWidth: 1280, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 34, height: 34, background: '#CAFF00', borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 900, color: '#000',
          }}>S</div>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>SYNAPS.AI</span>
        </Link>

        {/* Floating Nav Pill */}
        <nav style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
          backdropFilter: 'blur(16px)', borderRadius: 999, padding: '6px 18px',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {['Console', 'Agents', 'Boardroom', 'Strategy', 'Pricing'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{
              color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: 12.5,
              fontWeight: 500, padding: '5px 12px', borderRadius: 999, transition: 'all 0.2s',
            }}>{item}</a>
          ))}
          <Link href="/demo" style={{ color: '#CAFF00', fontWeight: 700, padding: '5px 12px', textDecoration: 'none', fontSize: 12.5 }}>⚡ Demo</Link>
        </nav>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
              color: 'rgba(255,255,255,0.4)', padding: '7px 13px', borderRadius: 999,
              fontSize: 11.5, fontWeight: 600, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            ⌘ K
          </button>
          <Link href="/demo" className="btn-lime" style={{ padding: '9px 20px', fontSize: 12.5, textDecoration: 'none' }}>
            ⚡ Try Instant Demo
          </Link>
          <Link href="/login" className="btn-outline" style={{ padding: '9px 18px', fontSize: 12.5, textDecoration: 'none' }}>
            Launch App ↗
          </Link>
        </div>
      </header>

      {/* ── HERO SECTION ────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        justify: 'center', padding: '140px 56px 80px',
        position: 'relative', zIndex: 1, maxWidth: 1400, margin: '0 auto',
      }}>
        {/* Top Status Badge */}
        <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 48, opacity: 0 }}>
          <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#CAFF00' }} className="pulse-dot" />
          <span className="label-mono">FOLIO-2026 WEBGL ENGINE — SYNAPS.AI</span>
        </div>

        {/* Main Headline */}
        <h1 style={{ marginBottom: 0 }}>
          <div className="overflow-clip">
            <div className="display-xl hero-line-1" style={{ opacity: 0 }}>Enterprise</div>
          </div>
          <div className="overflow-clip">
            <div className="display-xl hero-line-2 display-lime" style={{ opacity: 0 }}>
              <span ref={heroWordRef} style={{ display: 'inline-block', minWidth: '6ch' }}>DECISION MEMORY</span>
            </div>
          </div>
          <div className="overflow-clip">
            <div className="display-xl hero-line-3 display-dim" style={{ opacity: 0 }}>for every org.</div>
          </div>
        </h1>

        {/* Subtitle & Action Row */}
        <div className="hero-sub" style={{ marginTop: 64, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap', opacity: 0 }}>
          <div style={{ maxWidth: 440 }}>
            <p style={{ fontSize: 16.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Synaps ingests every document, email, contract, and decision your organization has ever made — into an interactive 3D WebGL knowledge graph.
            </p>
          </div>
          <div className="hero-cta" style={{ display: 'flex', gap: 12, alignItems: 'center', opacity: 0 }}>
            <Link href="/demo" className="btn-lime" style={{ textDecoration: 'none' }}>
              ⚡ Try Instant Demo
            </Link>
            <Link href="/login" className="btn-outline" style={{ textDecoration: 'none' }}>
              Launch Console →
            </Link>
          </div>
        </div>

        {/* Hero Stats */}
        <div className="hero-stats" style={{ marginTop: 80, display: 'flex', gap: 56, borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 32, opacity: 0 }}>
          {STATS.map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 30, fontWeight: 900, color: i % 2 === 0 ? '#CAFF00' : '#fff', letterSpacing: '-0.04em' }}>{s.v}</div>
              <div className="label-mono" style={{ marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MARQUEE 1 ────────────────────────────────────────────────────────── */}
      <div className="marquee-wrap relative z-1">
        <Marquee />
      </div>

      {/* ── USP STICKY SECTION (FOLIO-2026 CANVAS TRANSITION) ──────────────── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '120px 56px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'flex-start' }}>
          {/* Left Sticky Header */}
          <div className="reveal-section" style={{ position: 'sticky', top: 160, alignSelf: 'flex-start' }}>
            <div className="label-mono reveal-child" style={{ marginBottom: 20 }}>01 / ARCHITECTURE</div>
            <h2 className="display-md reveal-child" style={{ marginBottom: 24 }}>
              Shift from DOM<br />
              <span className="display-dim">to 3D WebGL Canvas.</span>
            </h2>
            <p className="reveal-child" style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', lineHeight: 1.75, fontFamily: "'Plus Jakarta Sans', sans-serif", maxWidth: 360 }}>
              Just like Folio-2026, Synaps renders your company memory graph in full 3D space — bringing organizational intelligence to life.
            </p>
            <Link href="/login" className="btn-lime reveal-child" style={{ marginTop: 36, display: 'inline-flex' }}>
              Explore platform →
            </Link>
          </div>

          {/* Right Scrolling USP Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {USP_ITEMS.map((usp, i) => (
              <div key={i} className="glass-card" style={{ padding: 40 }}>
                <div className="label-mono" style={{ marginBottom: 20 }}>{usp.tag}</div>
                <h3 style={{
                  fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 900,
                  lineHeight: 1.05, letterSpacing: '-0.03em', color: '#fff',
                  marginBottom: 20, whiteSpace: 'pre-line',
                }}>
                  {usp.title.split('\n').map((line, li) => (
                    <span key={li} style={{ display: 'block' }}>
                      {li === 0 ? line : <span style={{ color: usp.accent }}>{line}</span>}
                    </span>
                  ))}
                </h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {usp.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE 2 ─────────────────────────────────────────────────────────── */}
      <div className="marquee-wrap relative z-1">
        <Marquee reverse />
      </div>

      {/* ── MODULE CARDS ────────────────────────────────────────────────────── */}
      <section id="console" style={{ position: 'relative', zIndex: 1, padding: '120px 56px', maxWidth: 1400, margin: '0 auto' }} className="reveal-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64, flexWrap: 'wrap', gap: 24 }}>
          <div className="reveal-child">
            <div className="label-mono" style={{ marginBottom: 14 }}>#002 — Modules</div>
            <h2 className="display-md">
              Four 3D intelligence<br />
              <span className="display-dim">modules.</span>
            </h2>
          </div>
          <Link href="/login" className="btn-outline reveal-child">Explore all modules →</Link>
        </div>

        {/* Card Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {SUITES.map((suite, idx) => (
            <SpotlightTiltCard key={idx} glowColor="rgba(202, 255, 0, 0.2)" className="p-8 cursor-pointer">
              <div onClick={() => setActiveCard(idx)} className="h-full flex flex-col justify-between">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
                    <span className="label-mono">#{suite.id}</span>
                    <span className="label-mono" style={{ color: activeCard === idx ? '#CAFF00' : 'rgba(255,255,255,0.3)' }}>{suite.tag}</span>
                  </div>
                  <h3 style={{ fontSize: 24, fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 8, letterSpacing: '-0.025em' }}>{suite.label}</h3>
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
                  <span style={{ fontSize: 36, fontWeight: 900, color: '#CAFF00', letterSpacing: '-0.04em' }}>{suite.stat}</span>
                  <span className="label-mono">{suite.statLabel}</span>
                </div>
              </div>
            </SpotlightTiltCard>
          ))}
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────────────────── */}
      <section id="pricing" style={{ position: 'relative', zIndex: 1, padding: '120px 56px', maxWidth: 1400, margin: '0 auto' }} className="reveal-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div className="label-mono reveal-child" style={{ marginBottom: 14 }}>#003 — PRICING</div>
            <h2 className="display-md reveal-child">
              Transparent pricing,<br />
              <span className="display-lime">built for enterprise.</span>
            </h2>
          </div>

          {/* 3-Way Toggle */}
          <div className="reveal-child" style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'rgba(255,255,255,0.05)', padding: '4px 5px',
            borderRadius: 999, border: '1px solid rgba(255,255,255,0.09)',
          }}>
            {(['weekly', 'monthly', 'annual'] as const).map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                style={{
                  background: billingCycle === cycle ? '#CAFF00' : 'transparent',
                  color: billingCycle === cycle ? '#000' : 'rgba(255,255,255,0.45)',
                  padding: '6px 14px', borderRadius: 999, fontSize: 12,
                  fontWeight: 800, border: 'none', cursor: 'pointer',
                  transition: 'all 0.25s', fontFamily: "'Space Grotesk', sans-serif",
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                {cycle === 'weekly' && <span style={{ background: billingCycle === 'weekly' ? '#000' : 'rgba(202,255,0,0.15)', color: '#CAFF00', padding: '1px 6px', borderRadius: 999, fontSize: 9, fontWeight: 900 }}>$1.99</span>}
                {cycle === 'annual' && <span style={{ background: billingCycle === 'annual' ? '#000' : 'rgba(202,255,0,0.15)', color: '#CAFF00', padding: '1px 6px', borderRadius: 999, fontSize: 9, fontWeight: 900 }}>−50%</span>}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, alignItems: 'start' }} className="reveal-child">
          {/* Starter */}
          <div className="pricing-card">
            <div className="label-mono" style={{ marginBottom: 28 }}>STARTER TRIAL</div>
            <div style={{ fontSize: 50, fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: 8, letterSpacing: '-0.04em' }}>$0</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 32, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>14-day free trial, no card needed</div>
            <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 28 }} />
            {['100 AI Credits', 'Single User Workspace', 'Basic Document Ingestion (10 MB)', 'Standard AI Chat', 'PDF & CSV Export'].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 13, fontSize: 13, color: 'rgba(255,255,255,0.6)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <span style={{ color: '#CAFF00', fontWeight: 900, flexShrink: 0, fontSize: 9 }}>✦</span>{f}
              </div>
            ))}
            <Link href="/login" className="btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: 32, borderRadius: 14 }}>
              Start free trial
            </Link>
          </div>

          {/* Pro */}
          <div className="pricing-card featured">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <div className="label-mono" style={{ color: '#CAFF00' }}>PRO MEMBER</div>
              <span style={{ background: '#CAFF00', color: '#000', fontSize: 9.5, fontWeight: 900, padding: '3px 10px', borderRadius: 999, letterSpacing: '0.06em' }}>MOST POPULAR</span>
            </div>
            <div style={{ fontSize: 50, fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: 8, letterSpacing: '-0.04em' }}>
              {billingCycle === 'weekly' ? '$1.99' : billingCycle === 'annual' ? '$5' : '$7.99'}
            </div>
            <div style={{ fontSize: 13, color: '#CAFF00', fontWeight: 700, marginBottom: 32, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {billingCycle === 'weekly' ? 'per week — cancel anytime' : billingCycle === 'annual' ? 'per month, billed annually' : 'per month'}
            </div>
            <div style={{ width: '100%', height: 1, background: 'rgba(202,255,0,0.15)', marginBottom: 28 }} />
            {['500 AI Reasoning Credits / day', '10 Parallel AI Agents', 'Full 3D Corporate Memory Graph', 'Universal PDF & CSV Export', 'Multi-Tenant Org Isolation', 'Team Invites & Roles'].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 13, fontSize: 13, color: 'rgba(255,255,255,0.85)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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
            <div style={{ fontSize: 50, fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: 8, letterSpacing: '-0.04em' }}>
              {billingCycle === 'weekly' ? '$2.75' : billingCycle === 'annual' ? '$8' : '$10.99'}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', marginBottom: 32, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {billingCycle === 'weekly' ? 'per week — cancel anytime' : billingCycle === 'annual' ? 'per month, billed annually' : 'per month'}
            </div>
            <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 28 }} />
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
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────────── */}
      <footer style={{ position: 'relative', zIndex: 1, background: '#030303', padding: '80px 56px 40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 40, marginBottom: 80 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 30, height: 30, background: '#CAFF00', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#000' }}>S</div>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>SYNAPS.AI</span>
              </div>
              <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.25)', lineHeight: 1.75, fontFamily: "'Plus Jakarta Sans', sans-serif", maxWidth: 260 }}>
                3D WebGL Decision Intelligence Operating System.
              </p>
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
                    <a href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)', textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{l}</a>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div className="label-mono">© 2026 SYNAPS Technologies Inc. All rights reserved.</div>
            <div className="label-mono">Folio-2026 WebGL Engine Architecture</div>
          </div>
        </div>
      </footer>

      {/* ── SPOTLIGHT SEARCH MODAL ──────────────────────────────────────────── */}
      {searchOpen && (
        <div onClick={() => setSearchOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.94)',
          backdropFilter: 'blur(24px)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '18vh 20px',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#0f0f0f', borderRadius: 22, padding: 24,
            width: '100%', maxWidth: 600, border: '1px solid rgba(255,255,255,0.09)',
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search 3D modules, agents, digital twins..."
                autoFocus
                style={{
                  flex: 1, padding: '12px 16px', background: '#000',
                  border: '1px solid rgba(255,255,255,0.09)', borderRadius: 12,
                  color: '#fff', fontSize: 14.5, outline: 'none',
                }}
              />
              <button onClick={() => setSearchOpen(false)} style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)',
                color: '#fff', width: 42, height: 42, borderRadius: 12, cursor: 'pointer',
              }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredSuites.map(s => (
                <div key={s.id} style={{
                  padding: '13px 16px', background: '#000', borderRadius: 12, cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{s.label}</div>
                    <div className="label-mono">{s.tag}</div>
                  </div>
                  <span style={{ background: 'rgba(202,255,0,0.1)', color: '#CAFF00', fontSize: 9.5, fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>#{s.id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
