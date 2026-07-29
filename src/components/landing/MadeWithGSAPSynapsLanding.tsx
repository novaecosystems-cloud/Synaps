'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

// ─── 4D HYPERCUBE (Tesseract) Canvas ─────────────────────────────────────────
const TESSERACT_VERTICES_4D: number[][] = [];
for (let i = 0; i < 16; i++) {
  TESSERACT_VERTICES_4D.push([
    ((i >> 0) & 1) * 2 - 1,
    ((i >> 1) & 1) * 2 - 1,
    ((i >> 2) & 1) * 2 - 1,
    ((i >> 3) & 1) * 2 - 1,
  ]);
}
const TESSERACT_EDGES: [number, number][] = [];
for (let i = 0; i < 16; i++) {
  for (let j = i + 1; j < 16; j++) {
    let diff = 0;
    for (let k = 0; k < 4; k++) if (TESSERACT_VERTICES_4D[i][k] !== TESSERACT_VERTICES_4D[j][k]) diff++;
    if (diff === 1) TESSERACT_EDGES.push([i, j]);
  }
}

function rotate4D(v: number[], angle: number, plane: [number, number]): number[] {
  const result = [...v];
  const [a, b] = plane;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  result[a] = v[a] * cos - v[b] * sin;
  result[b] = v[a] * sin + v[b] * cos;
  return result;
}

function project4Dto3D(v: number[], w: number = 2): number[] {
  const denom = w - v[3];
  return [v[0] / denom, v[1] / denom, v[2] / denom];
}

function project3Dto2D(v: number[], fov: number = 3): [number, number] {
  const denom = fov - v[2];
  return [v[0] / denom, v[1] / denom];
}

function TesseractCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const t = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      t.current += 0.004;

      const projected2D: [number, number][] = TESSERACT_VERTICES_4D.map(v => {
        let r = [...v];
        r = rotate4D(r, t.current * 0.7, [0, 1]);
        r = rotate4D(r, t.current * 0.5, [2, 3]);
        r = rotate4D(r, t.current * 0.3, [0, 3]);
        r = rotate4D(r, t.current * 0.4, [1, 2]);
        const p3 = project4Dto3D(r, 2);
        const p2 = project3Dto2D(p3, 3);
        return [p2[0] * W * 0.22 + W / 2, p2[1] * H * 0.22 + H / 2];
      });

      TESSERACT_EDGES.forEach(([a, b]) => {
        const [x1, y1] = projected2D[a];
        const [x2, y2] = projected2D[b];

        const distA = Math.hypot(x1 - W / 2, y1 - H / 2);
        const distB = Math.hypot(x2 - W / 2, y2 - H / 2);
        const brightness = 1 - Math.min((distA + distB) / (W * 0.9), 0.8);

        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, `rgba(16, 185, 129, ${brightness * 0.8})`);
        grad.addColorStop(0.5, `rgba(99, 102, 241, ${brightness * 0.9})`);
        grad.addColorStop(1, `rgba(16, 185, 129, ${brightness * 0.7})`);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#10B981';
        ctx.stroke();
      });

      // Draw vertices
      projected2D.forEach(([x, y], idx) => {
        const inner = TESSERACT_VERTICES_4D[idx][3] > 0;
        ctx.beginPath();
        ctx.arc(x, y, inner ? 2.5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = inner ? '#6366F1' : '#10B981';
        ctx.shadowBlur = 12;
        ctx.shadowColor = inner ? '#6366F1' : '#10B981';
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}

// ─── PARTICLE FIELD CANVAS ───────────────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    interface Particle {
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string; life: number;
    }

    const colors = ['#10B981', '#6366F1', '#F59E0B', '#3B82F6'];
    let particles: Particle[] = [];
    let frame = 0;

    const spawn = () => {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: Math.random() * 300 + 100
      });
    };

    for (let i = 0; i < 80; i++) spawn();

    const draw = () => {
      frame++;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (frame % 3 === 0 && particles.length < 120) spawn();

      particles = particles.filter(p => p.life > 0);
      particles.forEach(p => {
        const mx = mouseRef.current.x - p.x;
        const my = mouseRef.current.y - p.y;
        const dist = Math.hypot(mx, my);
        if (dist < 150) {
          p.vx += mx * 0.00005;
          p.vy += my * 0.00005;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Wrap
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(16,185,129,${(1 - d / 100) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener('mousemove', onMouse);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  );
}

// ─── MORPHING MESH CANVAS ────────────────────────────────────────────────────
function MorphingMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let t = 0;

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;
    const COLS = 12, ROWS = 8;

    const draw = () => {
      canvas.width = W();
      canvas.height = H();
      t += 0.012;

      ctx.clearRect(0, 0, W(), H());

      const cW = W() / COLS;
      const cH = H() / ROWS;

      for (let i = 0; i <= ROWS; i++) {
        for (let j = 0; j <= COLS; j++) {
          const bx = j * cW;
          const by = i * cH;
          const wave = Math.sin(j * 0.5 + t) * Math.cos(i * 0.4 + t * 0.7) * 12;
          const px = bx + wave;
          const py = by + wave * 0.6;

          if (j < COLS && i < ROWS) {
            const bx2 = (j + 1) * cW;
            const by2 = (i + 1) * cH;
            const w2 = Math.sin((j + 1) * 0.5 + t) * Math.cos(i * 0.4 + t * 0.7) * 12;
            const w3 = Math.sin(j * 0.5 + t) * Math.cos((i + 1) * 0.4 + t * 0.7) * 12;
            const w4 = Math.sin((j + 1) * 0.5 + t) * Math.cos((i + 1) * 0.4 + t * 0.7) * 12;

            const alpha = (Math.sin(j * 0.3 + i * 0.2 + t * 0.5) + 1) / 2 * 0.08 + 0.02;

            ctx.beginPath();
            ctx.moveTo(bx + w2, by);
            ctx.lineTo(bx2 + w2, by);
            ctx.lineTo(bx2 + w4, by2);
            ctx.lineTo(bx + w3, by2);
            ctx.closePath();
            ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }

          // Nodes at grid intersections
          if (Math.random() < 0.003) {
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(16,185,129,0.5)';
            ctx.fill();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.6 }}
    />
  );
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const SUITES = [
  {
    id: 1, tag: 'COMMAND CONSOLE', label: 'AI COO Command Console & Briefing',
    icon: '⚡', color: '#10B981', glow: 'rgba(16,185,129,0.3)',
    desc: 'Evaluates compliance gaps, FSSAI licenses, tender agreements, and operational risk metrics across your knowledge graph.',
    specs: ['Org Health Score (60/100) & Coverage (40%)', 'Decision Confidence Meter (20% to 100%)', 'Zero-Retention Grounded Memory SLA', '24/7 Real-Time Anomaly Audit'],
    stat: '99.4%', statLabel: 'Synthesis Accuracy'
  },
  {
    id: 2, tag: 'FLIGHT CONTROL', label: 'Multi-Agent Flight Control System',
    icon: '🚀', color: '#6366F1', glow: 'rgba(99,102,241,0.3)',
    desc: 'Orchestrates 10 specialized AI agents (Research, Finance, Legal, Engineering, Ops, Infosec, HR) in parallel mission flights.',
    specs: ['10 Specialized Agent Personas', 'Shared Memory Graph Pipeline', 'Parallel Task Execution Engine', 'Full Audit Log & Provenance Tracing'],
    stat: '10x', statLabel: 'Parallel Throughput'
  },
  {
    id: 3, tag: 'DIGITAL TWINS', label: 'Executive Boardroom Digital Twins',
    icon: '👥', color: '#F59E0B', glow: 'rgba(245,158,11,0.3)',
    desc: 'Simulates strategic enterprise decisions across 8 C-suite personas (CEO, CFO, CTO, Legal, HR) grounded in company memory.',
    specs: ['8 C-Suite Persona Twins', 'Stress-testing Strategic Options', 'Consensus & Divergence Heatmaps', 'Instant Debate Record Generation'],
    stat: '8', statLabel: 'C-Suite Personas'
  },
  {
    id: 4, tag: 'STRATEGY STUDIO', label: 'AI Strategy Studio & Blueprint Engine',
    icon: '🎯', color: '#3B82F6', glow: 'rgba(59,130,246,0.3)',
    desc: 'Formulates 11-stage enterprise strategy documents, Red-Team AI challenges, SWOT analysis, and execution roadmap milestones.',
    specs: ['11-Stage Transformation Roadmap', 'Automated Competitive Threat Scanning', 'Resource & Budget Allocation Plan', 'Risk Mitigation Playbook'],
    stat: '110', statLabel: 'Decision Models'
  },
];

const STATS = [
  { value: '110', label: 'Decision Models', icon: '🧠' },
  { value: '99.4%', label: 'Confidence Score', icon: '📊' },
  { value: '10', label: 'Parallel Agents', icon: '🤖' },
  { value: '<2s', label: 'Reasoning Latency', icon: '⚡' },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function MadeWithGSAPSynapsLanding() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnnual, setIsAnnual] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [specModalData, setSpecModalData] = useState<any>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroBadgeRef = useRef<HTMLSpanElement>(null);
  const heroDescRef = useRef<HTMLParagraphElement>(null);
  const heroCTARef = useRef<HTMLDivElement>(null);
  const heroStatsRef = useRef<HTMLDivElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const statsRowRef = useRef<HTMLDivElement>(null);
  const suiteSectionRef = useRef<HTMLDivElement>(null);

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => setActiveSlide(prev => (prev + 1) % SUITES.length), 4200);
    return () => clearInterval(timer);
  }, []);

  // GSAP: Hero entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(heroBadgeRef.current, { opacity: 0, y: -20, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' })
        .fromTo(heroTitleRef.current, { opacity: 0, y: 40, clipPath: 'inset(100% 0% 0% 0%)' },
          { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power3.out' }, '-=0.2')
        .fromTo(heroDescRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
        .fromTo(heroCTARef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
        .fromTo(heroStatsRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
        .fromTo(heroCardRef.current,
          { opacity: 0, rotateY: -40, rotateX: 20, x: 80, scale: 0.85 },
          { opacity: 1, rotateY: -18, rotateX: 10, x: 0, scale: 1, duration: 1.1, ease: 'power3.out' }, '-=0.8');

      // Floating card animation
      gsap.to(heroCardRef.current, {
        rotateY: -14, rotateX: 7, y: -12,
        duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.5
      });

    }, heroRef);
    return () => ctx.revert();
  }, []);

  // GSAP: ScrollTrigger for stats row
  useEffect(() => {
    if (!statsRowRef.current) return;
    const items = statsRowRef.current.querySelectorAll('.stat-item');
    gsap.fromTo(items,
      { opacity: 0, y: 40, scale: 0.8 },
      {
        opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.7, ease: 'back.out(1.5)',
        scrollTrigger: { trigger: statsRowRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }
      }
    );
  }, []);

  // GSAP: ScrollTrigger for suite cards
  useEffect(() => {
    if (!suiteSectionRef.current) return;
    const cards = suiteSectionRef.current.querySelectorAll('.suite-card');
    gsap.fromTo(cards,
      { opacity: 0, y: 60, rotateX: 15 },
      {
        opacity: 1, y: 0, rotateX: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: suiteSectionRef.current, start: 'top 75%', toggleActions: 'play none none reverse' }
      }
    );
  }, []);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
      if (e.key === 'Escape') { setSearchOpen(false); setSpecModalData(null); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const filteredSuites = searchQuery.trim() === '' ? SUITES
    : SUITES.filter(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()) || s.tag.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ background: '#060810', color: '#F3EDE3', fontFamily: "'Inter', sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── GLOBAL CSS ───────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #060810; }
        ::selection { background: rgba(16,185,129,0.3); }

        .nav-link { color: #94A3B8; text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s; position: relative; }
        .nav-link:hover { color: #FFF; }
        .nav-link::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 1px; background: #10B981; transition: width 0.3s ease; }
        .nav-link:hover::after { width: 100%; }

        .cta-primary { background: linear-gradient(135deg, #10B981, #059669); color: #0B0D12; padding: 14px 28px; border-radius: 12px; font-size: 14px; font-weight: 800; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: all 0.3s ease; box-shadow: 0 10px 30px rgba(16,185,129,0.3); position: relative; overflow: hidden; }
        .cta-primary::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, #34D399, #10B981); opacity: 0; transition: opacity 0.3s; }
        .cta-primary:hover::before { opacity: 1; }
        .cta-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(16,185,129,0.5); }
        .cta-primary > * { position: relative; z-index: 1; }

        .cta-secondary { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); color: #E2E8F0; padding: 14px 28px; border-radius: 12px; font-size: 14px; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: all 0.3s ease; backdrop-filter: blur(8px); }
        .cta-secondary:hover { background: rgba(255,255,255,0.08); border-color: rgba(16,185,129,0.3); color: #FFF; transform: translateY(-2px); }

        .suite-card { background: #0E1118; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.07); cursor: pointer; transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1); transform-style: preserve-3d; }
        .suite-card:hover { transform: translateY(-8px) rotateX(2deg); border-color: rgba(16,185,129,0.3); box-shadow: 0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(16,185,129,0.1); }

        .stat-item { background: rgba(14,17,24,0.8); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 24px; backdrop-filter: blur(20px); transition: all 0.3s ease; }
        .stat-item:hover { border-color: rgba(16,185,129,0.3); background: rgba(16,185,129,0.04); transform: translateY(-4px); }

        .feature-row { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; margin-bottom: 100px; }
        @media (max-width: 768px) { .feature-row { grid-template-columns: 1fr; gap: 40px; } }

        .feature-mockup { background: #0E1118; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); position: relative; transition: all 0.4s ease; }
        .feature-mockup:hover { border-color: rgba(99,102,241,0.4); box-shadow: 0 0 60px rgba(99,102,241,0.1); }

        .scroll-indicator { display: flex; flex-direction: column; align-items: center; gap: 8px; animation: bounce 2s ease-in-out infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); opacity: 0.6; } 50% { transform: translateY(8px); opacity: 1; } }

        .glitch { position: relative; }
        .glitch::before, .glitch::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
        .glitch::before { color: #10B981; animation: glitch1 4s infinite; clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%); transform: translateX(-2px); opacity: 0; }
        .glitch::after { color: #6366F1; animation: glitch2 4s infinite; clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%); transform: translateX(2px); opacity: 0; }
        .glitch:hover::before, .glitch:hover::after { opacity: 0.3; }
        @keyframes glitch1 { 0%, 90%, 100% { transform: translateX(0); } 92% { transform: translateX(-4px); } 94% { transform: translateX(4px); } 96% { transform: translateX(-2px); } }
        @keyframes glitch2 { 0%, 90%, 100% { transform: translateX(0); } 92% { transform: translateX(4px); } 94% { transform: translateX(-4px); } 96% { transform: translateX(2px); } }

        .pulse-ring { width: 10px; height: 10px; border-radius: 50%; background: #10B981; position: relative; }
        .pulse-ring::before { content: ''; position: absolute; inset: -4px; border-radius: 50%; border: 2px solid #10B981; animation: pulseRing 1.5s ease-out infinite; }
        @keyframes pulseRing { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }

        .tag-pill { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25); color: #10B981; font-size: 11px; font-weight: 800; padding: 5px 12px; border-radius: 20px; letter-spacing: 1px; display: inline-block; }

        .pricing-card { background: linear-gradient(145deg, #0E1118, #111620); border: 1px solid rgba(255,255,255,0.1); border-radius: 28px; padding: 50px 44px; text-align: center; position: relative; overflow: hidden; }
        .pricing-card::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, rgba(16,185,129,0.08) 0%, transparent 60%); pointer-events: none; }

        .hide-mob { }
        @media (max-width: 640px) { .hide-mob { display: none !important; } }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header style={{ position: 'fixed', top: 16, left: '3%', width: '94%', zIndex: 100, background: 'rgba(6,8,16,0.85)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 44, height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(16,185,129,0.05)' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #10B981, #6366F1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#fff' }}>S</div>
          <span style={{ fontSize: 18, fontWeight: 900, color: '#FFF', letterSpacing: '-0.02em', fontFamily: "'Space Grotesk', sans-serif" }}>
            SYNAPS<span style={{ color: '#10B981' }}>.AI</span>
          </span>
        </Link>

        <nav className="hide-mob" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {['Console', 'Agents', 'Boardroom', 'Strategy', 'Pricing'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link">{item}</a>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setSearchOpen(true)}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748B', padding: '7px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}
          >
            <span>⌘K</span>
          </button>
          <Link href="/login" className="cta-secondary" style={{ padding: '8px 18px', borderRadius: 20, fontSize: 13 }}>Sign In</Link>
          <Link href="/login" className="cta-primary" style={{ padding: '9px 20px', borderRadius: 20, fontSize: 13 }}>
            <span>Launch Console</span><span>→</span>
          </Link>
        </div>
      </header>

      {/* ── HERO SECTION ──────────────────────────────────────────────────── */}
      <section ref={heroRef} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: 100 }}>
        <ParticleField />

        {/* Ambient glows */}
        <div style={{ position: 'absolute', top: '10%', left: '-10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1260, margin: '0 auto', padding: '0 30px', width: '100%', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 60, alignItems: 'center', position: 'relative', zIndex: 2 }}>

          {/* LEFT CONTENT */}
          <div>
            <span ref={heroBadgeRef} className="tag-pill" style={{ marginBottom: 22, display: 'inline-block' }}>
              ● ENTERPRISE DECISION INTELLIGENCE LAYER
            </span>

            <h1
              ref={heroTitleRef}
              className="glitch"
              data-text="NOT A CHATBOT."
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(40px, 5.5vw, 72px)',
                fontWeight: 900, lineHeight: 1.06, letterSpacing: '-2px',
                color: '#FFF', marginBottom: 24
              }}
            >
              NOT A CHATBOT.<br />
              <span style={{ background: 'linear-gradient(135deg, #10B981 0%, #34D399 50%, #6EE7B7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 0 20px rgba(16,185,129,0.4))' }}>
                THE INTELLIGENCE
              </span><br />
              LAYER ABOVE EVERY DOC.
            </h1>

            <p ref={heroDescRef} style={{ fontSize: 17, color: '#94A3B8', lineHeight: 1.7, marginBottom: 36, maxWidth: 540 }}>
              SYNAPS transforms company documents into an active, reasoning decision network. Inspect multi-evidence summaries, run multi-twin boardroom simulations, and verify mathematical confidence scores across <strong style={{ color: '#CBD5E1' }}>110+ decision models</strong>.
            </p>

            <div ref={heroCTARef} style={{ display: 'flex', gap: 14, marginBottom: 44, flexWrap: 'wrap' }}>
              <Link href="/login" className="cta-primary">
                <span>LAUNCH DECISION HUB</span><span>→</span>
              </Link>
              <Link href="/login" className="cta-secondary">
                <span>🧬</span><span>RUN TWIN SIMULATION</span>
              </Link>
            </div>

            <div ref={heroStatsRef} style={{ display: 'flex', gap: 32, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              {[['99.4%', 'Confidence'], ['10', 'AI Agents'], ['110', 'Decision Models']].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 30, fontWeight: 900, color: '#FFF', lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 4, fontWeight: 600, letterSpacing: '0.5px' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: 4D TESSERACT + FLOATING CARD */}
          <div style={{ perspective: 1200 }}>
            <div
              ref={heroCardRef}
              style={{
                width: '100%', maxWidth: 480, background: '#0E1118', borderRadius: 24,
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.9), 0 0 60px rgba(16,185,129,0.12)',
                overflow: 'hidden', transformStyle: 'preserve-3d',
                transform: 'rotateY(-18deg) rotateX(10deg)'
              }}
            >
              {/* Window chrome */}
              <div style={{ background: '#060810', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['#EF4444', '#F59E0B', '#10B981'].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'block' }} />)}
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}>SYNAPS.AI // 4D KNOWLEDGE GRAPH</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div className="pulse-ring" />
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#10B981' }}>LIVE</span>
                </div>
              </div>

              {/* Tesseract visualization */}
              <div style={{ height: 240, background: 'radial-gradient(ellipse at center, #0B0F1A 0%, #060810 100%)', position: 'relative' }}>
                <TesseractCanvas />
                <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#475569', fontFamily: 'monospace' }}>4D TESSERACT // REASONING NODE #001</span>
                  <span style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 6 }}>{SUITES[activeSlide].tag}</span>
                </div>
              </div>

              {/* Suite info */}
              <div style={{ padding: '16px 20px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#FFF', marginBottom: 8 }}>{SUITES[activeSlide].label}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {SUITES[activeSlide].specs.slice(0, 2).map((s, i) => (
                    <span key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748B', fontSize: 10, padding: '3px 8px', borderRadius: 6 }}>✓ {s}</span>
                  ))}
                </div>

                {/* Slide indicators */}
                <div style={{ display: 'flex', gap: 6, marginTop: 16 }}>
                  {SUITES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSlide(i)}
                      style={{
                        height: 3, borderRadius: 2, border: 'none', cursor: 'pointer', transition: 'all 0.3s ease',
                        width: i === activeSlide ? 24 : 8,
                        background: i === activeSlide ? '#10B981' : 'rgba(255,255,255,0.1)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
          <div className="scroll-indicator">
            <span style={{ fontSize: 10, color: '#334155', fontWeight: 600, letterSpacing: '2px' }}>SCROLL TO EXPLORE</span>
            <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(16,185,129,0.5), transparent)' }} />
          </div>
        </div>
      </section>

      {/* ── STATS ROW ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#060810', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '60px 30px' }}>
        <div ref={statsRowRef} style={{ maxWidth: 1260, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {STATS.map(s => (
            <div key={s.label} className="stat-item" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 900, color: '#FFF', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 6, fontWeight: 600, letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SUITE SHOWCASE ────────────────────────────────────────────────── */}
      <section id="console" style={{ padding: '100px 30px', background: '#060810', position: 'relative', overflow: 'hidden' }}>
        <MorphingMesh />
        <div style={{ maxWidth: 1260, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="tag-pill">ENTERPRISE INTELLIGENCE SUITE</span>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 900, color: '#FFF', marginTop: 16, lineHeight: 1.1 }}>
              Four tools that power<br />
              <span style={{ background: 'linear-gradient(135deg, #10B981, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>enterprise decisions</span>
            </h2>
          </div>

          <div ref={suiteSectionRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {SUITES.map((suite, idx) => (
              <div
                key={suite.id}
                className="suite-card"
                onClick={() => setSpecModalData(suite)}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  border: hoveredCard === idx ? `1px solid ${suite.color}44` : '1px solid rgba(255,255,255,0.07)',
                  boxShadow: hoveredCard === idx ? `0 20px 50px rgba(0,0,0,0.8), 0 0 30px ${suite.glow}` : 'none'
                }}
              >
                {/* Header */}
                <div style={{ padding: '24px 24px 0 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ width: 48, height: 48, background: `${suite.color}15`, border: `1px solid ${suite.color}30`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                      {suite.icon}
                    </div>
                    <span style={{ background: `${suite.color}15`, border: `1px solid ${suite.color}25`, color: suite.color, fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 20 }}>
                      MODULE 0{suite.id}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 800, color: suite.color, letterSpacing: '1px', marginBottom: 8 }}>{suite.tag}</div>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 800, color: '#FFF', lineHeight: 1.3, marginBottom: 12 }}>{suite.label}</h3>
                  <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, marginBottom: 20 }}>{suite.desc}</p>
                </div>

                {/* Stat bar */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 900, color: suite.color }}>{suite.stat}</div>
                    <div style={{ fontSize: 10, color: '#475569', fontWeight: 600 }}>{suite.statLabel}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, marginLeft: 20 }}>
                    {suite.specs.slice(0, 2).map((s, i) => (
                      <div key={i} style={{ fontSize: 11, color: '#334155', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: suite.color, fontSize: 9 }}>✓</span> {s}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA hover */}
                <div style={{ padding: '0 24px 20px 24px', opacity: hoveredCard === idx ? 1 : 0, transform: hoveredCard === idx ? 'translateY(0)' : 'translateY(8px)', transition: 'all 0.3s ease' }}>
                  <div style={{ background: `${suite.color}12`, border: `1px solid ${suite.color}25`, borderRadius: 10, padding: '10px 16px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: suite.color, cursor: 'pointer' }}>
                    Explore Module 0{suite.id} →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEEP DIVE FEATURE SECTIONS ────────────────────────────────────── */}
      {SUITES.map((suite, idx) => (
        <section
          key={suite.id}
          id={suite.tag.toLowerCase().replace(/\s+/g, '-')}
          style={{ padding: '100px 30px', background: idx % 2 === 0 ? '#060810' : '#070A12', borderTop: '1px solid rgba(255,255,255,0.03)' }}
        >
          <div style={{ maxWidth: 1260, margin: '0 auto' }}>
            <div className="feature-row" style={{ direction: idx % 2 === 1 ? 'rtl' : 'ltr' }}>
              <div style={{ direction: 'ltr' }}>
                <span style={{ background: `${suite.color}15`, border: `1px solid ${suite.color}30`, color: suite.color, fontSize: 11, fontWeight: 800, padding: '5px 14px', borderRadius: 20, display: 'inline-block', marginBottom: 18, letterSpacing: '1px' }}>
                  MODULE 0{suite.id} • {suite.tag}
                </span>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(28px, 3.5vw, 46px)', fontWeight: 900, color: '#FFF', marginBottom: 18, lineHeight: 1.1 }}>
                  {suite.label}
                </h2>
                <p style={{ fontSize: 16, color: '#64748B', lineHeight: 1.7, marginBottom: 28 }}>{suite.desc}</p>
                <ul style={{ listStyle: 'none', fontSize: 14, color: '#94A3B8', lineHeight: 2.4 }}>
                  {suite.specs.map((spec, sIdx) => (
                    <li key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 18, height: 18, background: `${suite.color}20`, border: `1px solid ${suite.color}40`, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: suite.color, flexShrink: 0 }}>✓</span>
                      {spec}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="cta-primary" style={{ marginTop: 32, display: 'inline-flex', background: `linear-gradient(135deg, ${suite.color}, ${suite.color}cc)`, boxShadow: `0 10px 30px ${suite.glow}` }}>
                  <span>Launch {suite.tag.split(' ')[0]}</span><span>→</span>
                </Link>
              </div>

              <div style={{ direction: 'ltr' }}>
                <div className="feature-mockup">
                  {/* Mock UI panel */}
                  <div style={{ background: '#060810', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['#EF4444', '#F59E0B', '#10B981'].map(c => <span key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'block' }} />)}
                    <span style={{ fontSize: 11, color: '#334155', fontFamily: 'monospace', marginLeft: 8 }}>synaps.ai/{suite.tag.toLowerCase().replace(/\s+/g, '-')}</span>
                  </div>
                  <div style={{ padding: 24, minHeight: 280 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 800, color: '#FFF' }}>{suite.tag}</span>
                      <span style={{ background: `${suite.color}15`, color: suite.color, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6 }}>ACTIVE</span>
                    </div>
                    {/* Animated bars */}
                    {[85, 72, 91, 68].map((val, i) => (
                      <div key={i} style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>{suite.specs[i] || `Metric ${i + 1}`}</span>
                          <span style={{ fontSize: 11, color: suite.color, fontWeight: 700 }}>{val}%</span>
                        </div>
                        <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${val}%`, background: `linear-gradient(90deg, ${suite.color}, ${suite.color}80)`, borderRadius: 3, transition: 'width 1s ease' }} />
                        </div>
                      </div>
                    ))}
                    <div style={{ marginTop: 20, padding: 14, background: `${suite.color}08`, border: `1px solid ${suite.color}20`, borderRadius: 12 }}>
                      <div style={{ fontSize: 22, marginBottom: 4 }}>{suite.icon}</div>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 900, color: suite.color }}>{suite.stat}</div>
                      <div style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>{suite.statLabel}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── PRICING SECTION ──────────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: '100px 30px', background: '#060810', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, background: 'radial-gradient(ellipse, rgba(16,185,129,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="tag-pill">MEMBERSHIP & ENTERPRISE ACCESS</span>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 900, color: '#FFF', marginTop: 16, lineHeight: 1.1 }}>
              Unlock the full<br />
              <span style={{ background: 'linear-gradient(135deg, #10B981, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>intelligence suite</span>
            </h2>
          </div>

          <div className="pricing-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 36 }}>
              <button onClick={() => setIsAnnual(false)} style={{ background: 'none', border: 'none', fontSize: 15, fontWeight: 700, color: !isAnnual ? '#FFF' : '#475569', cursor: 'pointer', transition: 'color 0.2s' }}>Quarterly</button>
              <div onClick={() => setIsAnnual(!isAnnual)} style={{ width: 52, height: 28, background: isAnnual ? '#10B981' : '#1E293B', borderRadius: 20, padding: 3, cursor: 'pointer', transition: 'background 0.3s' }}>
                <div style={{ width: 22, height: 22, background: '#FFF', borderRadius: '50%', transform: isAnnual ? 'translateX(24px)' : 'translateX(0)', transition: 'transform 0.3s', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }} />
              </div>
              <button onClick={() => setIsAnnual(true)} style={{ background: 'none', border: 'none', fontSize: 15, fontWeight: 700, color: isAnnual ? '#FFF' : '#475569', cursor: 'pointer', transition: 'color 0.2s' }}>
                Annual <sup style={{ background: 'rgba(16,185,129,0.2)', color: '#10B981', padding: '2px 6px', borderRadius: 10, fontSize: 10 }}>-20%</sup>
              </button>
            </div>

            <div style={{ fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>
              <span style={{ fontSize: 64, fontWeight: 900, color: '#FFF' }}>${isAnnual ? '39' : '49'}</span>
              <span style={{ fontSize: 16, color: '#475569', fontWeight: 600 }}>/month</span>
            </div>
            <div style={{ fontSize: 13, color: '#334155', marginTop: 6, marginBottom: 36 }}>{isAnnual ? 'billed annually · save $120/yr' : 'billed quarterly'}</div>

            <ul style={{ listStyle: 'none', textAlign: 'left', fontSize: 14, lineHeight: 2.2, color: '#94A3B8', marginBottom: 36 }}>
              {[
                'Unlimited Executive Operational Briefing Console',
                'Multi-Agent Flight Control System (10 Parallel Personas)',
                'Executive Digital Twins & Boardroom Simulation Engine',
                'AI Strategy Studio & 11-Stage Roadmap Generator',
                'REST API, TypeScript & Python SDK access',
                '24/7 Enterprise Priority Support & 99.9% Uptime SLA',
              ].map((f, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 20, height: 20, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#10B981', flexShrink: 0 }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <Link href="/login" className="cta-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '16px 0', borderRadius: 14 }}>
              <span>Get Started with Synaps Pro</span><span>→</span>
            </Link>
            <p style={{ fontSize: 12, color: '#334155', marginTop: 16 }}>No credit card required · 14-day free trial</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer style={{ background: '#03040A', padding: '80px 30px 40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1260, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60, marginBottom: 60 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #10B981, #6366F1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: '#fff' }}>S</div>
                <span style={{ fontSize: 20, fontWeight: 900, color: '#FFF', fontFamily: "'Space Grotesk', sans-serif" }}>SYNAPS<span style={{ color: '#10B981' }}>.AI</span></span>
              </div>
              <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, maxWidth: 220 }}>The intelligence layer above every enterprise document.</p>
            </div>

            <div>
              <h4 style={{ fontSize: 12, fontWeight: 800, color: '#10B981', marginBottom: 16, letterSpacing: '1px' }}>🔒 GLOBAL LEGAL & GOVERNANCE CENTER</h4>
              <p style={{ fontSize: 12, color: '#334155', marginBottom: 20 }}>SYNAPS operates as a registered Data Fiduciary enforcing multi-jurisdictional compliance.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
                {[
                  ['📄', '/legal/privacy', 'Privacy Policy (DPDP / GDPR)'],
                  ['📋', '/legal/terms', 'Terms & Acceptable Use Policy'],
                  ['🤝', '/legal/data-processing', 'Data Processing Addendum (DPA)'],
                  ['🛡️', '/legal/security', 'Security Architecture (72h SLA)'],
                  ['🤖', '/legal/ai-policy', 'AI Responsible Usage Statement'],
                  ['🍪', '/legal/cookies', 'Cookie & Tracking Policy'],
                ].map(([icon, href, label]) => (
                  <Link key={label} href={href} style={{ background: '#0E1118', padding: '10px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600, color: '#94A3B8', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}>
                    {icon} {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#334155' }}>
            <div>© 2026 SYNAPS Technologies Inc. All rights reserved.</div>
            <div>Registered Data Fiduciary · ISO/IEC 27001 & SOC 2 Aligned</div>
          </div>
        </div>
      </footer>

      {/* SPOTLIGHT SEARCH */}
      {searchOpen && (
        <div onClick={() => setSearchOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '15vh 20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#0E1118', borderRadius: 24, padding: 28, width: '100%', maxWidth: 600, border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 40px 100px rgba(0,0,0,0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ color: '#10B981', fontSize: 11, fontWeight: 800, letterSpacing: '1px' }}>⌘ SPOTLIGHT MODULE SEARCH</span>
              <button onClick={() => setSearchOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', width: 28, height: 28, borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>✕</button>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search modules, agents, digital twins..."
              autoFocus
              style={{ width: '100%', padding: '13px 16px', background: '#060810', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#FFF', fontSize: 15, outline: 'none', fontFamily: 'inherit', marginBottom: 16 }}
            />
            <div style={{ maxHeight: 340, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredSuites.length === 0 && (
                <div style={{ textAlign: 'center', padding: 24, color: '#475569', fontSize: 13 }}>No modules found. Try "agents" or "boardroom".</div>
              )}
              {filteredSuites.map(s => (
                <div key={s.id} onClick={() => { setSearchOpen(false); setSpecModalData(s); }} style={{ padding: '14px 16px', background: '#060810', borderRadius: 12, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#FFF', marginBottom: 3 }}>
                      <span style={{ color: s.color, marginRight: 8 }}>{s.icon}</span>{s.label}
                    </div>
                    <div style={{ fontSize: 12, color: '#475569' }}>{s.desc.slice(0, 80)}...</div>
                  </div>
                  <span style={{ background: `${s.color}15`, color: s.color, fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 6, whiteSpace: 'nowrap', marginLeft: 12 }}>{s.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SPEC DETAIL MODAL */}
      {specModalData && (
        <div onClick={() => setSpecModalData(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#0E1118', borderRadius: 24, padding: 36, width: '100%', maxWidth: 640, border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 40px 100px rgba(0,0,0,0.8)', position: 'relative' }}>
            <button onClick={() => setSpecModalData(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', width: 32, height: 32, borderRadius: 10, cursor: 'pointer', fontSize: 16 }}>✕</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, background: `${specModalData.color}15`, border: `1px solid ${specModalData.color}30`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{specModalData.icon}</div>
              <div>
                <span style={{ background: `${specModalData.color}15`, color: specModalData.color, fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 20 }}>SUITE #{specModalData.id} • {specModalData.tag}</span>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 900, color: '#FFF', marginTop: 4 }}>{specModalData.label}</h2>
              </div>
            </div>
            <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.65, marginBottom: 24 }}>{specModalData.desc}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
              {specModalData.specs.map((sp: string, idx: number) => (
                <div key={idx} style={{ background: '#060810', padding: '12px 14px', borderRadius: 10, fontSize: 12, color: '#94A3B8', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: specModalData.color, fontSize: 10 }}>✓</span>{sp}
                </div>
              ))}
            </div>
            <Link
              href="/login"
              className="cta-primary"
              style={{ width: '100%', justifyContent: 'center', background: `linear-gradient(135deg, ${specModalData.color}, ${specModalData.color}cc)`, boxShadow: `0 10px 30px ${specModalData.glow}` }}
            >
              <span>Launch Suite #{specModalData.id} into Workspace</span><span>→</span>
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
