"use client";

import { useEffect, useRef, useState } from 'react';
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Play, X, ShieldCheck, ChevronDown } from "lucide-react";

/* ─── NOISE TEXTURE SVG ─────────────────────────────────────────── */
const NoiseOverlay = () => (
  <div
    className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      backgroundSize: "256px 256px",
    }}
  />
);

/* ─── ANIMATED GRAPH SVG (replaces sheep) ───────────────────────── */
const GraphAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;

    const nodes = Array.from({ length: 32 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: 2 + Math.random() * 3,
      pulse: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.25;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(134, 199, 160, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        n.pulse += 0.02;
        const glow = 3 + Math.sin(n.pulse) * 2;

        ctx.beginPath();
        ctx.arc(n.x, n.y, glow, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glow);
        grad.addColorStop(0, "rgba(134, 199, 160, 0.9)");
        grad.addColorStop(1, "rgba(134, 199, 160, 0)");
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fill();

        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.7 }}
    />
  );
};

/* ─── DOCUMENT CARD (replaces nature imagery) ───────────────────── */
const DocCard = ({ delay, x, y, title, tag, color }: any) => (
  <div
    className="absolute rounded-2xl border backdrop-blur-md px-4 py-3 text-[11px] font-mono shadow-2xl"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      background: "rgba(13, 40, 24, 0.7)",
      borderColor: color + "33",
      animation: `float ${3 + delay}s ease-in-out infinite alternate`,
      animationDelay: `${delay}s`,
      minWidth: "160px",
    }}
  >
    <div className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color }}>
      {tag}
    </div>
    <div className="text-white/80 text-[11px] leading-snug">{title}</div>
    <div className="mt-2 h-0.5 rounded-full" style={{ background: color + "40", width: "60%" }} />
  </div>
);

/* ─── MARQUEE ────────────────────────────────────────────────────── */
const Marquee = ({ items, reverse = false, speed = 40 }: { items: string[]; reverse?: boolean; speed?: number }) => {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden whitespace-nowrap py-5 border-y border-white/10">
      <div
        className="inline-flex gap-12"
        style={{
          animation: `marquee ${speed}s linear infinite ${reverse ? "reverse" : ""}`,
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="text-xs font-mono uppercase tracking-[0.3em] text-white/40 flex items-center gap-12">
            {item}
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500/60 mx-6" />
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────────── */
export default function NarrativeProductLanding() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [preloaderProgress, setPreloaderProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  /* Redirect desktop app */
  useEffect(() => {
    if (typeof window !== "undefined" && ((window as any).electron?.isDesktop || (window as any).__TAURI__)) {
      window.location.href = "/dashboard";
    }
  }, []);

  /* Preloader progress */
  useEffect(() => {
    let v = 0;
    const t = setInterval(() => {
      v += Math.random() * 18;
      if (v >= 100) {
        v = 100;
        setPreloaderProgress(100);
        clearInterval(t);
        setTimeout(() => setPreloaderDone(true), 800);
      } else {
        setPreloaderProgress(Math.floor(v));
      }
    }, 120);
    return () => clearInterval(t);
  }, []);

  /* Nav scroll */
  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Scroll-triggered text reveal */
  useEffect(() => {
    if (!preloaderDone) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal-on-scroll").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [preloaderDone]);

  const features = [
    {
      num: "01",
      title: "Knowledge Graph",
      desc: "Transform document libraries into a living 3D memory graph. Every entity, relationship, and insight — indexed, linked, and queryable in real time.",
      icon: "◈",
    },
    {
      num: "02",
      title: "10-Agent AI Boardroom",
      desc: "Ten specialized C-Suite AI agents debate your strategy. CEO, CFO, General Counsel, Risk Officer — each with distinct reasoning models.",
      icon: "◉",
    },
    {
      num: "03",
      title: "Digital Twin OS",
      desc: "Simulate your organization's future. Run scenario models, stress-test decisions, and forecast outcomes before committing resources.",
      icon: "⬡",
    },
    {
      num: "04",
      title: "Document Intelligence",
      desc: "Automated redlining, gap analysis, compliance extraction, and clause risk scoring across all your enterprise documents.",
      icon: "◫",
    },
    {
      num: "05",
      title: "Zero Hallucination RAG",
      desc: "Graph-grounded retrieval ensures every AI answer cites your actual documents. If the data isn't there, the system says so.",
      icon: "◎",
    },
    {
      num: "06",
      title: "Enterprise Security",
      desc: "SOC2-ready. AES-256 at rest, TLS 1.3 in transit. Multi-tenant isolation. GDPR, CCPA, DPDP Act 2023 compliant by design.",
      icon: "◬",
    },
  ];

  const stats = [
    { val: "10", unit: "AI Agents", desc: "in every boardroom" },
    { val: "< 60s", unit: "Indexing", desc: "per enterprise document" },
    { val: "100%", unit: "Ownership", desc: "of your data, always" },
    { val: "0", unit: "Training", desc: "on your private data" },
  ];

  const faqs = [
    {
      q: "How is Synaps different from ChatGPT or Gemini?",
      a: "Synaps is not a general-purpose chatbot. It's an enterprise OS that builds a graph of your specific organizational knowledge. Every answer is grounded in your documents — not trained on internet data.",
    },
    {
      q: "Does Synaps train on our data?",
      a: "Never. Synaps maintains a strict Zero Model Training Promise. Your documents, knowledge graphs, and strategic data are never used to train any public or private model.",
    },
    {
      q: "What does the 10-agent boardroom do?",
      a: "It simulates a full C-Suite debate over any business decision. Each AI agent has a distinct persona, reasoning style, and domain expertise — delivering multi-perspective analysis before you commit.",
    },
    {
      q: "How long does it take to set up?",
      a: "Upload your first document and your knowledge graph starts building within 60 seconds. Full organizational memory typically takes one business day to fully index.",
    },
    {
      q: "Is there a free trial?",
      a: "Yes. Try the full interactive demo without a credit card at synaps.ai/demo — all core features, live graph, and AI boardroom included.",
    },
  ];

  const marqueeItems = [
    "Knowledge Graph", "Digital Twin", "AI Boardroom", "Document Intelligence",
    "Zero Hallucination RAG", "Enterprise Memory", "Strategy Studio", "Risk Prediction",
  ];

  return (
    <>
      {/* ── GLOBAL STYLES ───────────────────────────────────────── */}
      <style>{`
        :root {
          --c-bg: #08140e;
          --c-bg-2: #0d2118;
          --c-accent: #86c7a0;
          --c-accent-2: #4a9d6f;
          --c-text: #e8f0eb;
          --c-muted: rgba(232, 240, 235, 0.45);
        }

        body { background: var(--c-bg); }

        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes float {
          0%   { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-16px) rotate(1.5deg); }
        }

        @keyframes preloaderReveal {
          0%   { transform: translateY(0%); }
          100% { transform: translateY(-100%); }
        }

        @keyframes fadeUp {
          0%   { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes heroTextIn {
          0%   { opacity: 0; transform: translateY(60px) skewY(3deg); }
          100% { opacity: 1; transform: translateY(0) skewY(0deg); }
        }

        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.6); opacity: 0.5; }
        }

        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(50px);
          transition: opacity 0.9s cubic-bezier(0.25,1,0.5,1), transform 0.9s cubic-bezier(0.25,1,0.5,1);
        }
        .reveal-on-scroll.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-word {
          display: inline-block;
          overflow: hidden;
        }
        .hero-word span {
          display: inline-block;
          animation: heroTextIn 1.1s cubic-bezier(0.25,1,0.5,1) both;
        }

        .feature-card {
          transition: all 0.5s cubic-bezier(0.25,1,0.5,1);
          border-color: rgba(134, 199, 160, 0.08);
        }
        .feature-card:hover {
          border-color: rgba(134, 199, 160, 0.35);
          background: rgba(13, 33, 24, 0.8);
          transform: translateY(-4px);
        }

        .stat-item {
          transition: all 0.4s ease;
        }
        .stat-item:hover .stat-val {
          color: var(--c-accent);
        }

        .faq-item {
          border-color: rgba(134, 199, 160, 0.12);
          transition: border-color 0.3s ease;
        }
        .faq-item:hover {
          border-color: rgba(134, 199, 160, 0.3);
        }

        .nav-link::after {
          content: '';
          display: block;
          height: 1px;
          background: var(--c-accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.25,1,0.5,1);
        }
        .nav-link:hover::after { transform: scaleX(1); }

        .btn-primary {
          position: relative;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.25,1,0.5,1);
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: white;
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.4s cubic-bezier(0.25,1,0.5,1);
        }
        .btn-primary:hover::before { transform: scaleY(1); }
        .btn-primary:hover { color: var(--c-bg); }
        .btn-primary span { position: relative; z-index: 1; }

        .section-label {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: var(--c-bg); }
        ::-webkit-scrollbar-thumb { background: var(--c-accent-2); border-radius: 2px; }
      `}</style>

      <NoiseOverlay />

      {/* ── PRELOADER ────────────────────────────────────────────── */}
      {!preloaderDone && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col"
          style={{
            background: "var(--c-bg)",
            animation: preloaderProgress === 100 ? "preloaderReveal 0.8s 0.3s cubic-bezier(0.76,0,0.24,1) forwards" : "none",
          }}
        >
          {/* Animated graph canvas */}
          <div className="absolute inset-0">
            <GraphAnimation />
          </div>

          {/* Floating doc cards */}
          <DocCard delay={0} x={10} y={20} title="Q3 Strategy Memo" tag="Strategic" color="#86c7a0" />
          <DocCard delay={0.5} x={65} y={15} title="Compliance Gap Report" tag="Risk" color="#7ba8f5" />
          <DocCard delay={1} x={75} y={65} title="Board Decision Log" tag="Governance" color="#c7a086" />
          <DocCard delay={1.5} x={8} y={68} title="Contract Analysis" tag="Legal" color="#c786b0" />

          {/* Center logo */}
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-6">
            <div
              className="text-5xl font-black tracking-[0.3em] text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              SYNAPS
            </div>
            <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-emerald-400/70">
              Enterprise Intelligence OS
            </div>
          </div>

          {/* Bottom progress bar */}
          <div className="absolute bottom-0 left-0 right-0 px-8 pb-10">
            <div className="flex items-end justify-between mb-4 font-mono text-[11px] text-white/40">
              <span>SYNAPS AI</span>
              <span>{preloaderProgress}% loaded</span>
            </div>
            <div className="h-px bg-white/10 w-full relative overflow-hidden rounded-full">
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-300"
                style={{ width: `${preloaderProgress}%`, background: "var(--c-accent)" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── NAVBAR ───────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 transition-all duration-500"
        style={{
          paddingTop: navScrolled ? "16px" : "24px",
          paddingBottom: navScrolled ? "16px" : "24px",
          background: navScrolled
            ? "rgba(8, 20, 14, 0.92)"
            : "transparent",
          backdropFilter: navScrolled ? "blur(20px)" : "none",
          borderBottom: navScrolled ? "1px solid rgba(134,199,160,0.1)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--c-accent)" }}>
              <span className="text-black font-black text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>S</span>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-300"
                style={{ animation: "pulseDot 2s ease-in-out infinite" }} />
            </div>
            <span className="font-black tracking-[0.15em] text-white text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              SYNAPS
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {[
              { href: "/#features", label: "Platform" },
              { href: "/#how", label: "How It Works" },
              { href: "/demo", label: "Live Demo" },
              { href: "/legal/privacy", label: "Security" },
            ].map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className="nav-link text-[11px] font-mono uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden md:block text-[11px] font-mono uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="btn-primary px-5 py-2.5 border border-emerald-500/40 text-emerald-400 text-[11px] font-mono uppercase tracking-[0.2em] rounded-xl"
            >
              <span>Start Free →</span>
            </Link>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden w-8 h-8 flex flex-col justify-center gap-1.5"
            >
              <span className="block h-px bg-white/70 w-full" />
              <span className="block h-px bg-white/70 w-2/3" />
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE MENU ──────────────────────────────────────────── */}
      {menuOpen && (
        <div className="fixed inset-0 z-[200]" style={{ background: "var(--c-bg)" }}>
          <div className="p-8">
            <div className="flex justify-between items-center mb-16">
              <span className="font-black tracking-[0.15em] text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>SYNAPS</span>
              <button onClick={() => setMenuOpen(false)}><X className="w-6 h-6 text-white/60" /></button>
            </div>
            <nav className="flex flex-col gap-8">
              {["Platform", "How It Works", "Live Demo", "Pricing", "Security"].map((label) => (
                <a key={label} onClick={() => setMenuOpen(false)} href={`/#${label.toLowerCase().replace(" ", "-")}`}
                  className="text-3xl font-black text-white/80 hover:text-white transition-colors tracking-tight">
                  {label}
                </a>
              ))}
            </nav>
            <div className="mt-auto pt-16 flex flex-col gap-4">
              <Link href="/register" onClick={() => setMenuOpen(false)}
                className="w-full py-4 text-center border border-emerald-500/40 text-emerald-400 font-mono text-sm uppercase tracking-widest rounded-2xl">
                Start Free
              </Link>
              <Link href="/login" onClick={() => setMenuOpen(false)}
                className="w-full py-4 text-center text-white/40 font-mono text-sm uppercase tracking-widest">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}

      <main style={{ background: "var(--c-bg)", color: "var(--c-text)" }}>

        {/* ══ HERO ══════════════════════════════════════════════════ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
          {/* Radial glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #4a9d6f 0%, transparent 70%)" }} />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-5"
              style={{ background: "radial-gradient(circle, #7ba8f5 0%, transparent 70%)" }} />
          </div>

          {/* Graph canvas background */}
          <div className="absolute inset-0 opacity-30">
            <GraphAnimation />
          </div>

          {/* Floating UI cards */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <DocCard delay={0} x={4} y={25} title="Board Resolution: Q4 Expansion" tag="Strategic" color="#86c7a0" />
            <DocCard delay={0.8} x={70} y={18} title="Risk Matrix — Supply Chain" tag="Risk Analysis" color="#7ba8f5" />
            <DocCard delay={1.4} x={75} y={70} title="NDA v3.2 — Redlined" tag="Legal" color="#c7a086" />
            <DocCard delay={2} x={2} y={70} title="Compliance Gap: GDPR §24" tag="Compliance" color="#c786b0" />
          </div>

          {/* Hero Text */}
          <div className="relative z-10 text-center max-w-5xl mx-auto" style={{ paddingTop: "10vh" }}>
            <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-400/80"
              style={{ animation: "fadeIn 1s 1.5s both" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: "pulseDot 2s infinite" }} />
              Enterprise Intelligence OS
            </div>

            <h1 className="font-black text-white leading-[0.92] mb-8 tracking-tight overflow-hidden"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(3rem, 9vw, 9rem)" }}>
              {["YOUR", "COMPANY", "THINKS."].map((word, wi) => (
                <div key={wi} className="hero-word block">
                  <span style={{ animationDelay: `${1.2 + wi * 0.15}s` }}>{word}</span>
                </div>
              ))}
            </h1>

            <p className="text-base md:text-xl max-w-2xl mx-auto leading-relaxed mb-12"
              style={{ color: "var(--c-muted)", animation: "fadeUp 1s 2s both" }}>
              Synaps transforms your document library into a living 3D Knowledge Graph,
              then puts a 10-agent AI C-Suite to work on your hardest decisions — grounded in your actual data.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4"
              style={{ animation: "fadeUp 1s 2.2s both" }}>
              <Link href="/register"
                className="group relative px-8 py-4 overflow-hidden rounded-2xl border border-emerald-400/50 text-sm font-mono uppercase tracking-[0.2em] transition-all duration-500 hover:scale-[1.02]"
                style={{ background: "rgba(134, 199, 160, 0.08)" }}>
                <span className="relative z-10 text-emerald-300 group-hover:text-black transition-colors duration-500 flex items-center gap-2">
                  Start Free — No Card <ArrowRight className="w-4 h-4" />
                </span>
                <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 rounded-2xl"
                  style={{ background: "var(--c-accent)" }} />
              </Link>

              <button
                onClick={() => setVideoOpen(true)}
                className="flex items-center gap-3 px-6 py-4 text-sm font-mono uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors group">
                <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/50 transition-colors">
                  <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                </div>
                Watch 2-Min Demo
              </button>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            style={{ animation: "fadeIn 1s 3s both" }}>
            <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-white/25">Scroll</span>
            <div className="w-px h-12 relative overflow-hidden">
              <div className="absolute top-0 w-full bg-emerald-500/60 rounded-full"
                style={{ height: "100%", animation: "float 1.5s ease-in-out infinite alternate" }} />
            </div>
            <ChevronDown className="w-4 h-4 text-white/20" style={{ animation: "float 2s ease-in-out infinite" }} />
          </div>
        </section>

        {/* ══ MARQUEE 1 ════════════════════════════════════════════ */}
        <Marquee items={marqueeItems} speed={35} />

        {/* ══ STATS ════════════════════════════════════════════════ */}
        <section className="py-28 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: "rgba(134,199,160,0.1)" }}>
              {stats.map((s, i) => (
                <div key={i} className="stat-item p-10 text-center" style={{ background: "var(--c-bg)" }}>
                  <div className="stat-val text-5xl md:text-6xl font-black text-white mb-2 tracking-tight transition-colors duration-300"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {s.val}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-400/70 mb-1">{s.unit}</div>
                  <div className="text-xs text-white/30 font-mono">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FEATURES ═════════════════════════════════════════════ */}
        <section id="features" className="py-28 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <div className="flex items-end justify-between mb-20 reveal-on-scroll">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-emerald-400/60 mb-4">Platform</div>
                <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  The full stack<br />of enterprise intelligence.
                </h2>
              </div>
              <Link href="/register"
                className="hidden lg:flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">
                Explore all features <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "rgba(134,199,160,0.08)" }}>
              {features.map((f, i) => (
                <div
                  key={i}
                  className="feature-card group p-10 border reveal-on-scroll cursor-pointer"
                  style={{ background: "var(--c-bg-2)", transitionDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="text-4xl" style={{ color: "var(--c-accent)", lineHeight: 1 }}>{f.icon}</div>
                    <span className="text-[10px] font-mono text-white/20">{f.num}</span>
                  </div>
                  <h3 className="text-xl font-black text-white mb-4 tracking-tight"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--c-muted)" }}>{f.desc}</p>
                  <div className="mt-8 h-px w-0 group-hover:w-full transition-all duration-700 rounded-full"
                    style={{ background: "var(--c-accent)" }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ MARQUEE 2 ════════════════════════════════════════════ */}
        <Marquee items={["GDPR Compliant", "CCPA Ready", "DPDP Act 2023", "SOC2 Architecture", "AES-256 Encryption", "Zero Data Training", "Multi-Tenant Isolation", "Audit Trail"]} speed={28} reverse />

        {/* ══ HOW IT WORKS ═════════════════════════════════════════ */}
        <section id="how" className="py-28 px-6 md:px-10 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <GraphAnimation />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="reveal-on-scroll mb-20">
              <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-emerald-400/60 mb-4">How It Works</div>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                From upload<br />to intelligence.
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px" style={{ background: "rgba(134,199,160,0.08)" }}>
              {[
                {
                  step: "01",
                  title: "Upload Your Documents",
                  desc: "PDFs, DOCX, CSVs, meeting transcripts, contracts — drop anything into Synaps. Automatic extraction, classification, and entity recognition begins instantly.",
                  visual: (
                    <div className="h-36 relative flex items-center justify-center">
                      {["Contract.pdf", "Q4-Report.xlsx", "Board-Minutes.docx"].map((f, i) => (
                        <div key={i}
                          className="absolute px-3 py-1.5 rounded-lg border border-emerald-500/20 text-[10px] font-mono text-emerald-400/70"
                          style={{
                            background: "rgba(13, 40, 24, 0.8)",
                            transform: `rotate(${(i - 1) * 8}deg) translateY(${(i - 1) * -8}px)`,
                            left: `${15 + i * 22}%`,
                            top: "30%",
                            animation: `float ${2 + i * 0.5}s ease-in-out infinite alternate`,
                            animationDelay: `${i * 0.4}s`,
                          }}>
                          {f}
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  step: "02",
                  title: "Graph Builds Itself",
                  desc: "Synaps extracts entities, relationships, risks, and decisions — then links everything into a 3D knowledge graph you can explore, query, and reason over.",
                  visual: (
                    <div className="h-36 relative flex items-center justify-center overflow-hidden">
                      <div className="relative w-28 h-28">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <div key={i}
                            className="absolute w-3 h-3 rounded-full"
                            style={{
                              background: "var(--c-accent)",
                              left: `${50 + Math.cos((i / 5) * Math.PI * 2) * 40}%`,
                              top: `${50 + Math.sin((i / 5) * Math.PI * 2) * 40}%`,
                              transform: "translate(-50%, -50%)",
                              animation: `pulseDot ${2 + i * 0.3}s ease-in-out infinite`,
                              animationDelay: `${i * 0.2}s`,
                            }} />
                        ))}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-emerald-300"
                            style={{ animation: "pulseDot 1.5s ease-in-out infinite" }} />
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  step: "03",
                  title: "AI Boardroom Advises",
                  desc: "Ask any strategic question. Ten specialized AI agents — CEO, CFO, General Counsel, Risk Officer — each provides grounded, cited analysis from your actual data.",
                  visual: (
                    <div className="h-36 relative flex items-center justify-center">
                      <div className="flex flex-col gap-2 w-full max-w-[220px]">
                        {[
                          { role: "CFO Agent", text: "Revenue risk: 12%↑" },
                          { role: "Risk Officer", text: "Compliance gap found" },
                          { role: "CEO Agent", text: "Recommend: Proceed" },
                        ].map((msg, i) => (
                          <div key={i}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-500/15 text-[10px] font-mono"
                            style={{
                              background: "rgba(13, 40, 24, 0.8)",
                              animation: `fadeUp 0.5s ${i * 0.3}s ease-out both`,
                            }}>
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--c-accent)" }} />
                            <span className="text-emerald-400/60">{msg.role}:</span>
                            <span className="text-white/70">{msg.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                },
              ].map((step, i) => (
                <div key={i} className="p-10 reveal-on-scroll" style={{ background: "var(--c-bg-2)", transitionDelay: `${i * 100}ms` }}>
                  {step.visual}
                  <div className="mt-8">
                    <div className="text-[10px] font-mono text-white/20 mb-3">{step.step}</div>
                    <h3 className="text-xl font-black text-white mb-4 tracking-tight"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--c-muted)" }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ BIG PULL QUOTE ═══════════════════════════════════════ */}
        <section className="py-36 px-6 md:px-10 border-y reveal-on-scroll" style={{ borderColor: "rgba(134,199,160,0.1)" }}>
          <div className="max-w-5xl mx-auto text-center">
            <p className="font-black text-white leading-tight tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem, 5vw, 5rem)" }}>
              "Stop asking the internet.<br />
              <span style={{ color: "var(--c-accent)" }}>Start asking your company."</span>
            </p>
            <div className="mt-12 text-[10px] font-mono uppercase tracking-[0.5em] text-white/25">
              — Synaps AI Mission
            </div>
          </div>
        </section>

        {/* ══ SECURITY BADGES ══════════════════════════════════════ */}
        <section className="py-24 px-6 md:px-10 reveal-on-scroll">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-emerald-400/60 mb-4">Security & Compliance</div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Built for enterprises<br />that can't afford to get it wrong.
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: "rgba(134,199,160,0.08)" }}>
              {[
                { icon: "🇪🇺", label: "GDPR", desc: "Full compliance" },
                { icon: "🇮🇳", label: "DPDP Act 2023", desc: "India compliant" },
                { icon: "🇺🇸", label: "CCPA / CPRA", desc: "California ready" },
                { icon: "🔒", label: "AES-256", desc: "Encryption at rest" },
              ].map((b, i) => (
                <div key={i} className="p-8 text-center group hover:bg-emerald-900/20 transition-colors duration-300"
                  style={{ background: "var(--c-bg-2)" }}>
                  <div className="text-3xl mb-3">{b.icon}</div>
                  <div className="text-sm font-black text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{b.label}</div>
                  <div className="text-[11px] font-mono text-white/30">{b.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FAQ ══════════════════════════════════════════════════ */}
        <section className="py-28 px-6 md:px-10">
          <div className="max-w-4xl mx-auto">
            <div className="reveal-on-scroll mb-20">
              <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-emerald-400/60 mb-4">FAQ</div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Common questions.
              </h2>
            </div>

            <div className="space-y-px" style={{ background: "rgba(134,199,160,0.08)" }}>
              {faqs.map((faq, i) => (
                <div key={i} className="faq-item border-b" style={{ borderColor: "rgba(134,199,160,0.12)", background: "var(--c-bg-2)" }}>
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full p-8 text-left flex items-start justify-between gap-6 group"
                  >
                    <span className="font-bold text-white text-base leading-snug group-hover:text-emerald-300 transition-colors"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {faq.q}
                    </span>
                    <div className="shrink-0 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:border-emerald-500/40 group-hover:text-emerald-400 transition-all">
                      {activeFaq === i ? "−" : "+"}
                    </div>
                  </button>
                  {activeFaq === i && (
                    <div className="px-8 pb-8 text-sm leading-relaxed" style={{ color: "var(--c-muted)" }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FINAL CTA ════════════════════════════════════════════ */}
        <section className="py-40 px-6 md:px-10 relative overflow-hidden reveal-on-scroll border-t"
          style={{ borderColor: "rgba(134,199,160,0.1)" }}>
          <div className="absolute inset-0 pointer-events-none opacity-15">
            <GraphAnimation />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-emerald-400/60 mb-8">Get Started</div>
            <h2 className="font-black text-white leading-tight tracking-tight mb-8"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(3rem, 8vw, 8rem)" }}>
              YOUR COMPANY,
              <br />
              <span style={{ color: "var(--c-accent)" }}>AMPLIFIED.</span>
            </h2>
            <p className="text-lg max-w-xl mx-auto mb-12" style={{ color: "var(--c-muted)" }}>
              Upload your first document and experience the future of enterprise intelligence. Free to start. No credit card.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register"
                className="group relative px-10 py-5 overflow-hidden rounded-2xl text-sm font-mono uppercase tracking-[0.2em] transition-all duration-500 hover:scale-[1.02] border border-emerald-400/50"
                style={{ background: "rgba(134, 199, 160, 0.08)" }}>
                <span className="relative z-10 text-emerald-300 group-hover:text-black transition-colors duration-500 flex items-center gap-2">
                  Start Building <ArrowRight className="w-4 h-4" />
                </span>
                <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 rounded-2xl"
                  style={{ background: "var(--c-accent)" }} />
              </Link>

              <Link href="/demo"
                className="px-10 py-5 text-sm font-mono uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">
                Try Live Demo →
              </Link>
            </div>
          </div>
        </section>

        {/* ══ FOOTER ═══════════════════════════════════════════════ */}
        <footer className="border-t py-14 px-6 md:px-10" style={{ borderColor: "rgba(134,199,160,0.1)", background: "var(--c-bg)" }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--c-accent)" }}>
                  <span className="text-black font-black text-base">S</span>
                </div>
                <span className="font-black tracking-[0.15em] text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>SYNAPS</span>
              </div>

              <nav className="flex flex-wrap gap-x-8 gap-y-3">
                {[
                  { href: "/legal/privacy", label: "Privacy Policy" },
                  { href: "/legal/cookies", label: "Cookie Policy" },
                  { href: "/legal/terms", label: "Terms" },
                  { href: "/legal/data-processing", label: "DPA" },
                  { href: "/legal/security", label: "Security" },
                  { href: "/legal/contact", label: "Contact" },
                ].map(({ href, label }) => (
                  <Link key={label} href={href}
                    className="text-[11px] font-mono text-white/30 hover:text-white/70 transition-colors uppercase tracking-[0.15em]">
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* CCPA */}
            <div className="flex flex-wrap items-center gap-3 mb-8 pb-8 border-b text-[10px] font-mono"
              style={{ borderColor: "rgba(134,199,160,0.1)", color: "rgba(134,199,160,0.4)" }}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>🇺🇸 California Residents:</span>
              <button
                onClick={() => {
                  localStorage.setItem("synaps-cookie-consent", JSON.stringify({ essential: true, analytics: false, marketing: false, decided: true, timestamp: Date.now() }));
                  alert("Preference saved. We do not sell your personal data.");
                }}
                className="underline hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Do Not Sell or Share My Personal Information (CCPA)
              </button>
              <span className="text-white/10">·</span>
              <Link href="/legal/privacy#regional-compliance" className="hover:text-emerald-400 transition-colors">
                GDPR · DPDP · PIPEDA · PDPA Rights
              </Link>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <p className="text-[11px] font-mono text-white/20 uppercase tracking-[0.2em]">
                © 2026 Synaps AI — All Rights Reserved
              </p>
              <p className="text-[11px] font-mono text-white/20 max-w-sm leading-relaxed">
                Synaps does not provide legal, financial, or tax advice. All AI outputs are for informational purposes only.
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* ── VIDEO MODAL ──────────────────────────────────────────── */}
      {videoOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6"
          style={{ background: "rgba(8,20,14,0.95)", backdropFilter: "blur(20px)" }}>
          <button onClick={() => setVideoOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all">
            <X className="w-5 h-5" />
          </button>
          <div className="w-full max-w-4xl aspect-video rounded-3xl overflow-hidden border border-emerald-500/20 shadow-2xl">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
