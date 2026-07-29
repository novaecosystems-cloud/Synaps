'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/* ─── App Showcase slides ────────────────────────────────────────── */
const SLIDES = [
  {
    id: 1,
    src: '/showcase/executive_overview.png',
    label: 'Executive Briefing',
    tag: 'AI COO Engine',
  },
  {
    id: 2,
    src: '/showcase/mission_control.png',
    label: 'Mission Control',
    tag: 'Multi-Agent',
  },
  {
    id: 3,
    src: '/showcase/digital_twins.png',
    label: 'Executive Twins',
    tag: 'Boardroom Sim',
  },
  {
    id: 4,
    src: '/showcase/ai_strategy.png',
    label: 'AI Strategy Studio',
    tag: '11-Stage Roadmap',
  },
  {
    id: 5,
    src: '/showcase/decision_memory.png',
    label: 'Decision Memory',
    tag: 'Precedent Graph',
  },
];

/* ─── Testimonials ───────────────────────────────────────────────── */
const TESTIS = [
  {
    text: 'SYNAPS is a total gem. The memory graph is stunning, the AI briefings are crystal clear, and the grounded confidence scores are beautifully structured. It gets a big thumbs-up from our entire executive team.',
    name: 'Priya Sharma',
    role: 'Chief Operating Officer\nNovaEco Systems',
    img: null,
  },
  {
    text: 'The SYNAPS resources are so well-crafted that the AI Digital Twins often become the centrepiece of every boardroom session. The precedent memory engine is thoughtfully explained and made easy to act on immediately.',
    name: 'Jordan Gilroy',
    role: 'Head of Strategy\nEnterprise Analytics',
    img: null,
  },
  {
    text: 'A beautiful resource for making data-driven decisions. The Multi-Agent Flight Control pushes creative limits with zero hallucination. You\'ll be running boardroom simulations in minutes.',
    name: 'Lucas Bigot',
    role: 'CTO\nCreative Studio',
    img: null,
  },
  {
    text: 'As a decision-maker, I\'ve used many AI tools, and SYNAPS taught me new ways to approach enterprise challenges. I wish a tool like this had existed when I was starting out.',
    name: 'Henri Heymans',
    role: 'Managing Director\nConsulting Group',
    img: null,
  },
  {
    text: 'SYNAPS\'s decision memory has been an enormous ally in crafting memorable business outcomes. It\'s a tool that was missing from our enterprise community, and I\'m glad we now have it.',
    name: 'Victor Work',
    role: 'Chief Strategy Officer',
    img: null,
  },
  {
    text: 'Using SYNAPS is a plug-and-play experience. No bloated prompts, no overengineering, just efficient grounded intelligence. I can say it\'s the best resource for enterprise AI decision-making!',
    name: 'Reksa Andhika',
    role: 'Operations Lead\nScale-up Ventures',
    img: null,
  },
];

/* ─── Cookie Banner ───────────────────────────────────────────────── */
function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const c = localStorage.getItem('synaps_cookie');
    if (!c) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem('synaps_cookie', 'accepted');
    setShow(false);
  };
  const decline = () => {
    localStorage.setItem('synaps_cookie', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        background: '#fff',
        border: '1px solid #e5e5e5',
        borderRadius: 16,
        padding: '20px 28px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
        maxWidth: 520,
        width: 'calc(100% - 48px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 6 }}>
          🍪 We value your privacy
        </p>
        <p style={{ fontSize: 12, color: '#555', lineHeight: 1.6 }}>
          We use cookies to enhance your browsing experience, serve personalized
          content, and analyze our traffic. By clicking &quot;Accept all&quot;, you consent
          to our use of cookies.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={accept}
          style={{
            flex: 1,
            padding: '10px 20px',
            background: '#111',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.03em',
          }}
        >
          Accept all
        </button>
        <button
          onClick={decline}
          style={{
            padding: '10px 20px',
            background: 'transparent',
            color: '#111',
            border: '1px solid #ccc',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Decline
        </button>
      </div>
    </div>
  );
}

/* ─── Auto-sliding showcase carousel ─────────────────────────────── */
function ShowcaseCarousel() {
  const [current, setCurrent] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const n = SLIDES.length;

  const startAutoplay = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % n);
    }, 3500);
  }, [n]);

  useEffect(() => {
    startAutoplay();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startAutoplay]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setStartX(e.clientX);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setOffsetX(e.clientX - startX);
  };

  const handleMouseUp = () => {
    if (Math.abs(offsetX) > 60) {
      if (offsetX < 0) setCurrent(prev => (prev + 1) % n);
      else setCurrent(prev => (prev - 1 + n) % n);
    }
    setDragging(false);
    setOffsetX(0);
    startAutoplay();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) setCurrent(prev => (prev + 1) % n);
      else setCurrent(prev => (prev - 1 + n) % n);
    }
    startAutoplay();
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', userSelect: 'none' }}>
      {/* Slides */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          transition: dragging ? 'none' : 'transform 0.65s cubic-bezier(0.4,0,0.2,1)',
          transform: `translateX(calc(-${current * 100}% + ${offsetX}px))`,
          cursor: dragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            style={{
              minWidth: '100%',
              position: 'relative',
              aspectRatio: '16/9',
              background: '#f0f0f0',
              borderRadius: 20,
              overflow: 'hidden',
            }}
          >
            <Image
              src={slide.src}
              alt={slide.label}
              fill
              quality={100}
              priority={i === 0}
              style={{ objectFit: 'cover', objectPosition: 'top' }}
            />
          </div>
        ))}
      </div>

      {/* Bottom info bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 16,
          padding: '0 4px',
        }}
      >
        {/* Slide counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#111', fontFamily: 'monospace' }}>
            {String(current + 1).padStart(3, '0')}
          </span>
          <span style={{ fontSize: 12, color: '#888' }}>{SLIDES[current].tag}</span>
        </div>

        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: 6 }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === current ? '#111' : '#ddd',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Current label */}
        <span style={{ fontSize: 12, color: '#888', fontStyle: 'italic' }}>
          {SLIDES[current].label}
        </span>
      </div>

      {/* "Drag to explore" label */}
      <p
        style={{
          textAlign: 'center',
          fontSize: 11,
          color: '#aaa',
          marginTop: 8,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        Drag to explore the collection
      </p>
    </div>
  );
}

/* ─── Main Page Component ─────────────────────────────────────────── */
export default function MadeWithSynapsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emailDone, setEmailDone] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailDone(true);
  };

  return (
    <>
      {/* ── GLOBAL STYLES ─────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        
        body { font-family: 'Inter', -apple-system, sans-serif; background: #f1f1f1; color: #111; overflow-x: hidden; }
        
        .sec-white { background: #f1f1f1; }
        .sec-black { background: #111; color: #fff; }
        
        .diode::before {
          content: '';
          display: inline-block;
          width: 6px; height: 6px;
          background: #111;
          border-radius: 50%;
          margin-right: 8px;
          vertical-align: middle;
        }
        .sec-black .diode::before { background: #fff; }
        
        .cta-main {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 24px;
          background: #111; color: #fff;
          border-radius: 100px;
          font-size: 13px; font-weight: 700;
          text-decoration: none; border: none; cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
          letter-spacing: 0.01em;
        }
        .cta-main:hover { opacity: 0.85; transform: translateY(-1px); }
        .cta-main-outline {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 24px;
          background: transparent; color: #111;
          border-radius: 100px;
          font-size: 13px; font-weight: 700;
          text-decoration: none; border: 1.5px solid #111; cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
        }
        .cta-main-outline:hover { opacity: 0.7; }
        
        .cta-rounded {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: transparent;
          border: 1.5px solid #ccc;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: border-color 0.2s;
        }
        .cta-rounded:hover { border-color: #111; }
        
        .cta-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 20px;
          background: transparent; color: #111;
          border-radius: 100px;
          font-size: 12px; font-weight: 600;
          text-decoration: none; border: 1.5px solid #ccc; cursor: pointer;
          transition: border-color 0.2s;
        }
        .cta-secondary:hover { border-color: #111; }
        
        .wrapper { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
        
        .title-xl { font-size: clamp(60px, 8vw, 130px); font-weight: 900; line-height: 0.9; letter-spacing: -0.04em; }
        .title-l  { font-size: clamp(44px, 6vw, 90px);  font-weight: 900; line-height: 0.95; letter-spacing: -0.03em; }
        .title-m  { font-size: clamp(28px, 4vw, 52px);  font-weight: 900; line-height: 1.05; letter-spacing: -0.02em; }
        .title-s  { font-size: clamp(22px, 3vw, 38px);  font-weight: 800; line-height: 1.1;  letter-spacing: -0.02em; }
        .title-xs { font-size: clamp(16px, 2vw, 24px);  font-weight: 700; line-height: 1.2;  letter-spacing: -0.01em; }
        .title-xxs { font-size: 15px; font-weight: 600; line-height: 1.5; }
        .body-s   { font-size: 14px; line-height: 1.65; color: #444; }
        .body-xs  { font-size: 12px; line-height: 1.6;  color: #888; }
        .label    { font-size: 12px; font-weight: 600; letter-spacing: 0.02em; text-transform: uppercase; }
        .label-s  { font-size: 11px; font-weight: 500; letter-spacing: 0.02em; text-transform: uppercase; color: #888; }
        
        .text-g { color: #aaa; }
        
        .f { display: flex; }
        .f-space { justify-content: space-between; }
        .f-center { align-items: center; }
        
        .pr { position: relative; }
        .pa { position: absolute; }
        .pf { position: fixed; }
        
        .sec-border { border-top: 1px solid #e0e0e0; }
        
        /* Marquee */
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track { display: flex; animation: marquee 30s linear infinite; width: max-content; }
        .marquee-track:hover { animation-play-state: paused; }
        
        /* Testi scroll */
        .testis-scroll {
          display: flex; gap: 20px; overflow-x: auto; padding: 0 40px 20px;
          scrollbar-width: none;
        }
        .testis-scroll::-webkit-scrollbar { display: none; }
        .testi-card {
          min-width: 320px; max-width: 320px;
          background: #fff; border-radius: 16px;
          padding: 28px; border: 1px solid #e5e5e5;
          display: flex; flex-direction: column; justify-content: space-between;
          gap: 20px;
        }
        
        /* Nav */
        .nav-link {
          font-size: 13px; font-weight: 500; color: #111; text-decoration: none;
          transition: opacity 0.2s;
        }
        .nav-link:hover { opacity: 0.5; }
        
        /* Feature cards */
        .feature-card { background: #fff; border-radius: 20px; overflow: hidden; }
        .feature-card-inner { padding: 24px; }
        
        /* Circle cards */
        .circle-card {
          background: #fff; border-radius: 50%;
          width: 260px; height: 260px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 32px;
          border: 1px solid #e5e5e5;
          flex-shrink: 0;
        }
        
        /* Pill label */
        .pill { display: inline-block; padding: 5px 14px; background: #e8e8e8; border-radius: 100px; font-size: 11px; font-weight: 600; color: #555; letter-spacing: 0.05em; text-transform: uppercase; }
        
        /* Showcase grid */
        .showcase-pin-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .showcase-pin-grid img {
          width: 100%; border-radius: 12px; aspect-ratio: 16/10; object-fit: cover; object-position: top;
          border: 1px solid #e0e0e0;
        }
        
        /* Progress bar */
        @keyframes progress { from { width: 0; } to { width: 100%; } }
        
        /* Scroll animations (CSS only) */
        @media (prefers-reduced-motion: no-preference) {
          .fade-in { opacity: 0; transform: translateY(24px); animation: fadeUp 0.7s ease forwards; }
          @keyframes fadeUp { to { opacity: 1; transform: none; } }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .wrapper { padding: 0 20px; }
          .showcase-pin-grid { grid-template-columns: repeat(2,1fr); }
          .hide-mob { display: none; }
          .title-xl { font-size: 48px; }
          .title-l  { font-size: 38px; }
        }
      `}</style>

      {/* ── NAVIGATION ─────────────────────────────────────────────── */}
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: 'rgba(241,241,241,0.92)', backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 40px', height: 64,
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32, height: 32, background: '#111', borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 900 }}>S</span>
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>
            Made With Synaps
          </span>
        </Link>

        {/* Nav links (desktop) */}
        <nav className="hide-mob" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#collection" className="nav-link">Collection <span style={{ background: '#e5e5e5', borderRadius: 100, padding: '2px 8px', fontSize: 10 }}>5</span></a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="#faq" className="nav-link">FAQ</a>
          <a href="#showcase" className="nav-link">Showcase</a>
        </nav>

        {/* CTA buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/register" className="cta-main" style={{ padding: '10px 20px', fontSize: 12 }}>
            Join →
          </Link>
          <Link href="/login" className="cta-rounded" aria-label="Sign in" style={{ background: '#fff', border: '1px solid #ccc' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </Link>
        </div>
      </header>

      <main style={{ paddingTop: 64 }}>

        {/* ── HERO ──────────────────────────────────────────────────── */}
        <section
          id="hero"
          className="sec-white"
          style={{ padding: '80px 0 60px' }}
        >
          <div className="wrapper">
            {/* Hero headline */}
            <div style={{ marginBottom: 40 }}>
              <h1 className="title-l" style={{ maxWidth: 700 }}>
                Unique enterprise<br />
                <span className="text-g">AI modules</span><br />
                made with care.
              </h1>
              <p className="body-s" style={{ marginTop: 24, maxWidth: 420 }}>
                Start building smarter decisions with an ever-growing suite of
                grounded, well-crafted AI intelligence modules.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
                <a href="#collection" className="cta-main">
                  Explore collection
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>
                <a href="#showcase" className="cta-main-outline">
                  View showcase
                </a>
              </div>
            </div>

            {/* Draggable showcase carousel */}
            <ShowcaseCarousel />
          </div>
        </section>

        {/* ── WHAT IT'S ALL ABOUT ──────────────────────────────────── */}
        <section
          id="about"
          className="sec-black"
          style={{ padding: '100px 0' }}
        >
          <div className="wrapper">
            <p className="label diode" style={{ marginBottom: 32, color: '#fff' }}>
              What it&apos;s all about
            </p>
            <p className="title-s" style={{ maxWidth: 760, color: '#fff' }}>
              An enterprise AI suite that makes you understand essential{' '}
              <span style={{ color: '#aaa' }}>decision intelligence techniques</span> and
              use them{' '}
              <span style={{ color: '#aaa' }}>instantly</span> in your organization.
            </p>
            <p className="body-s" style={{ marginTop: 28, maxWidth: 560, color: '#aaa' }}>
              Grounded decisions are a must-have these days. Executive briefings,
              multi-agent collaboration, digital twin boardrooms, AI strategy — we&apos;ve
              got it all covered.
            </p>

            {/* Screenshot of platform */}
            <div style={{ marginTop: 60, borderRadius: 20, overflow: 'hidden', border: '1px solid #333' }}>
              <Image
                src="/showcase/executive_overview.png"
                alt="SYNAPS Platform"
                width={1200}
                height={675}
                quality={100}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        </section>

        {/* ── TRUST BAR ────────────────────────────────────────────── */}
        <section style={{ padding: '60px 0', borderBottom: '1px solid #e0e0e0', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 28, flexWrap: 'wrap', padding: '0 40px' }}>
            {['AI COO', 'Mission Control', 'Digital Twins', 'Strategy Studio', 'Decision Memory', 'Risk Radar'].map(tag => (
              <span key={tag} className="pill">{tag}</span>
            ))}
          </div>
          <p className="label" style={{ textAlign: 'center', marginBottom: 36 }}>
            Trusted by forward-thinking enterprises &amp; decision-makers
          </p>
          {/* Marquee logos (text-based) */}
          <div style={{ overflow: 'hidden', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
            <div className="marquee-track">
              {['SYNAPS OS', 'AI Briefing', 'Boardroom Sim', 'Flight Control', 'Twin Engine', 'Strategy AI', 'Risk Matrix', 'Memory Graph', 'SYNAPS OS', 'AI Briefing', 'Boardroom Sim', 'Flight Control', 'Twin Engine', 'Strategy AI', 'Risk Matrix', 'Memory Graph'].map((item, i) => (
                <span key={i} style={{ padding: '0 48px', fontSize: 14, fontWeight: 700, color: '#bbb', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── BIG SCROLL TEXT ──────────────────────────────────────── */}
        <section
          style={{
            padding: '120px 40px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div className="title-l" style={{ textAlign: 'center', lineHeight: 1 }}>
            5 modules today.
            <br />
            <span className="text-g">New features every sprint.</span>
          </div>
        </section>

        {/* ── CIRCLE FEATURE CARDS ─────────────────────────────────── */}
        <section style={{ padding: '0 0 100px', overflow: 'hidden' }}>
          <div
            style={{
              display: 'flex', gap: 24, paddingLeft: 40, overflowX: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            {[
              { n: '1', text: 'Jump right in! Our modules cater to all org sizes, ensuring a smooth onboarding curve for new teams.' },
              { n: '2', text: 'Get started effortlessly — ingest your documents and your AI command center is ready in minutes.' },
              { n: '3', text: 'Our modules are built with performance in mind: grounded memory with zero hallucination rate.' },
              { n: '4', text: 'Executive briefings, multi-agent, boardroom sim, strategy... we\'ve got your decision stack covered.' },
            ].map((c) => (
              <div key={c.n} className="circle-card" style={{ flexShrink: 0 }}>
                <span style={{ fontSize: 40, fontWeight: 900, color: '#e0e0e0', lineHeight: 1 }}>{c.n}</span>
                <p className="body-s" style={{ marginTop: 16, fontSize: 13 }}>{c.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES / MODULES ─────────────────────────────────────── */}
        <section
          id="collection"
          className="sec-white"
          style={{ padding: '100px 0', borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}
        >
          <div className="wrapper">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 60, flexWrap: 'wrap', gap: 20 }}>
              <div>
                <p className="label diode" style={{ marginBottom: 16 }}>Meet our smart modules</p>
                <h2 className="title-s">
                  Built to{' '}
                  <span className="text-g">speed up</span> your
                  <br />enterprise decision-making
                </h2>
              </div>
              <Link href="/register" className="cta-main">Join SYNAPS →</Link>
            </div>

            {/* 5 module cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {SLIDES.map((slide, i) => (
                <div key={slide.id} className="feature-card" style={{ border: '1px solid #e5e5e5' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                    {/* Screenshot */}
                    <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '20px 0 0 20px' }}>
                      <Image
                        src={slide.src}
                        alt={slide.label}
                        fill
                        quality={100}
                        style={{ objectFit: 'cover', objectPosition: 'top' }}
                      />
                    </div>
                    {/* Info */}
                    <div className="feature-card-inner" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 40 }}>
                      <div>
                        <p className="label diode" style={{ marginBottom: 20 }}>{slide.tag}</p>
                        <h3 className="title-xs" style={{ marginBottom: 16 }}>{slide.label}</h3>
                        <p className="body-s">
                          {i === 0 && 'Provides top-level executive briefings, real-time org health scoring, and compliance tracking across all your corporate documents and contracts.'}
                          {i === 1 && 'Air traffic control for 10 specialized AI agents — Research, Finance, Legal, Engineering, Marketing, Security, HR, Digital Twin — collaborating in parallel via structured memory.'}
                          {i === 2 && 'Simulate strategic boardroom decisions across 8 C-suite personas (CEO, CFO, CTO, COO, Legal, Sales, Security, HR) with zero hallucination, grounded in company memory.'}
                          {i === 3 && 'Generates 11-stage enterprise strategy blueprints, AI Red-Teaming challenges, SWOT matrices, and execution timelines from your ingested knowledge base.'}
                          {i === 4 && 'Remembers every past corporate decision, wrong assumption, and lesson learned. Natural language search across your historical precedent graph with cosine similarity scoring.'}
                        </p>
                      </div>
                      <div style={{ marginTop: 32 }}>
                        <Link href="/register" className="cta-main" style={{ fontSize: 12, padding: '10px 20px' }}>
                          Try this module →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LATEST ADDITIONS ─────────────────────────────────────── */}
        <section style={{ padding: '100px 0', background: '#f1f1f1' }}>
          <div className="wrapper">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 16 }}>
              <span className="label" style={{ color: '#888' }}>5</span>
              <p className="label diode">New module every sprint</p>
              <span className="label" style={{ color: '#888' }}>5</span>
            </div>
            <h2 className="title-l" style={{ marginBottom: 48 }}>
              Latest modules,{' '}
              <span className="text-g">freshly built</span>
            </h2>
            {/* Horizontal scroll strip */}
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 16 }}>
              {SLIDES.map((slide) => (
                <div
                  key={slide.id}
                  style={{
                    minWidth: 320, borderRadius: 16, overflow: 'hidden',
                    border: '1px solid #e0e0e0', background: '#fff', flexShrink: 0,
                  }}
                >
                  <div style={{ position: 'relative', aspectRatio: '16/10' }}>
                    <Image
                      src={slide.src}
                      alt={slide.label}
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'top' }}
                    />
                  </div>
                  <div style={{ padding: '16px 20px' }}>
                    <p className="label-s">{slide.tag}</p>
                    <p style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{slide.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA / PRICING ─────────────────────────────────────────── */}
        <section
          id="pricing"
          className="sec-black"
          style={{ padding: '100px 0', textAlign: 'center' }}
        >
          <div className="wrapper">
            <p className="label diode" style={{ marginBottom: 24, color: '#fff', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
              Level up your decision intelligence
            </p>
            <h2 className="title-l" style={{ marginBottom: 20, color: '#fff' }}>
              Unlock the full<br />
              <span className="text-g">module collection</span>
            </h2>
            <p className="body-s" style={{ marginBottom: 48, color: '#aaa', maxWidth: 440, margin: '0 auto 48px' }}>
              Start making grounded enterprise decisions in minutes with the full SYNAPS OS.
            </p>

            {/* Pricing card */}
            <div
              style={{
                background: '#fff', borderRadius: 24, padding: 48,
                maxWidth: 520, margin: '0 auto',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                  <p className="label-s">Monthly</p>
                  <p className="title-l" style={{ lineHeight: 1, marginTop: 4 }}>Free</p>
                  <p className="label-s" style={{ marginTop: 8 }}>during early access</p>
                </div>
                <Link href="/register" className="cta-main">
                  Get Started →
                </Link>
              </div>

              <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  '5 enterprise modules',
                  'Executive Operational Briefings',
                  'Multi-Agent Flight Control (10 agents)',
                  '8 Executive Digital Twins',
                  'AI Strategy Studio',
                  'Decision Memory & Precedent Graph',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 18, height: 18, background: '#111', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                    </span>
                    <span className="body-s" style={{ fontSize: 13 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
        <section style={{ padding: '100px 0', borderBottom: '1px solid #e0e0e0' }}>
          <div className="wrapper" style={{ marginBottom: 48 }}>
            <p className="label diode" style={{ marginBottom: 16 }}>Already used by leading enterprises</p>
            <h2 className="title-m">Approved by the community</h2>
          </div>

          <div className="testis-scroll">
            {TESTIS.map((t, i) => (
              <div key={i} className="testi-card">
                <p className="title-xxs">{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: `hsl(${i * 60}, 30%, 70%)`,
                      flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, fontWeight: 700, color: '#fff',
                    }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{t.name}</p>
                    <p className="label-s" style={{ whiteSpace: 'pre-line' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── ABOUT ─────────────────────────────────────────────────── */}
        <section style={{ padding: '100px 0', borderBottom: '1px solid #e0e0e0' }}>
          <div className="wrapper" style={{ display: 'flex', gap: 80, flexWrap: 'wrap' }}>
            <div>
              <p className="label diode" style={{ marginBottom: 0 }}>Behind the project</p>
            </div>
            <div style={{ flex: 1, minWidth: 280 }}>
              <p className="title-xs" style={{ maxWidth: 560, lineHeight: 1.6 }}>
                SYNAPS is crafted by a team of enterprise AI researchers and decision
                scientists with a combined track record of deploying intelligence systems
                at Fortune 500 scale. Two friends building the future of{' '}
                <span style={{ color: '#aaa' }}>grounded AI decision-making.</span>
              </p>
            </div>
          </div>
        </section>

        {/* ── SHOWCASE SECTION ─────────────────────────────────────── */}
        <section id="showcase" style={{ padding: '100px 0', background: '#f1f1f1' }}>
          <div className="wrapper" style={{ marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <p className="label diode" style={{ marginBottom: 16 }}>An inspiring enterprise suite</p>
              <h2 className="title-m" style={{ maxWidth: 500 }}>
                Explore powerful AI modules built to transform how enterprises decide.
              </h2>
            </div>
            <Link href="/register" className="cta-main">
              Explore collection →
            </Link>
          </div>

          <div className="wrapper">
            <div className="showcase-pin-grid">
              {[...SLIDES, ...SLIDES].slice(0, 6).map((slide, i) => (
                <div key={i} style={{ borderRadius: 12, overflow: 'hidden', position: 'relative', aspectRatio: '16/10', border: '1px solid #e0e0e0' }}>
                  <Image
                    src={slide.src}
                    alt={slide.label}
                    fill
                    quality={100}
                    style={{ objectFit: 'cover', objectPosition: 'top' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────── */}
        <section id="faq" className="sec-white" style={{ padding: '100px 0', borderTop: '1px solid #e0e0e0' }}>
          <div className="wrapper">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
              <p className="label">You may have some questions.</p>
              <Link href="/register" className="cta-main-outline">
                Read our FAQ
              </Link>
            </div>
          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────────────── */}
        <footer
          className="sec-white sec-border"
          style={{ padding: '80px 0 40px', borderTop: '1px solid #e0e0e0' }}
        >
          <div className="wrapper">
            {/* Big CTA text */}
            <div style={{ marginBottom: 80 }}>
              <p className="label" style={{ marginBottom: 16 }}>
                Join our ever-growing suite of grounded enterprise AI modules.
              </p>
              <p className="title-xl" style={{ lineHeight: 0.9, marginBottom: 40 }}>
                Get ready<br />
                <span className="text-g">to decide.</span>
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/register" className="cta-main">
                  Join SYNAPS →
                </Link>
                <a href="#collection" className="cta-main-outline">
                  Explore collection
                </a>
              </div>
            </div>

            {/* Footer columns */}
            <div
              style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
                gap: 40, borderTop: '1px solid #e0e0e0', paddingTop: 48,
              }}
            >
              {/* Newsletter */}
              <div>
                <h3 className="title-xs" style={{ marginBottom: 20 }}>Never miss what&apos;s next</h3>
                {emailDone ? (
                  <p className="body-s" style={{ color: '#111', fontWeight: 600 }}>✓ You&apos;re subscribed!</p>
                ) : (
                  <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <input
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      style={{
                        flex: 1, padding: '10px 14px', borderRadius: 8,
                        border: '1.5px solid #ccc', fontSize: 13, outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                    <button type="submit" className="cta-main" style={{ padding: '10px 16px', fontSize: 12 }}>→</button>
                  </form>
                )}
                <p className="body-xs">By submitting, you&apos;ll be the first to know about upcoming SYNAPS updates.</p>
              </div>

              {/* Social */}
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Social</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {['X (Twitter)', 'LinkedIn', 'Instagram', 'YouTube'].map(s => (
                    <li key={s}><a href="#" className="nav-link" style={{ fontSize: 12 }}>{s}</a></li>
                  ))}
                </ul>
              </div>

              {/* Pages */}
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Pages</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {['Collection', 'Pricing', 'Showcase', 'FAQ', 'Free modules'].map(p => (
                    <li key={p}><a href={`#${p.toLowerCase()}`} className="nav-link" style={{ fontSize: 12 }}>{p}</a></li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Contact</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <li><a href="mailto:hello@synaps.ai" className="nav-link" style={{ fontSize: 12 }}>Reach us</a></li>
                </ul>
              </div>
            </div>

            {/* Footer bottom */}
            <div
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderTop: '1px solid #e0e0e0', paddingTop: 24, marginTop: 48, flexWrap: 'wrap', gap: 12,
              }}
            >
              <p style={{ fontSize: 12, color: '#888' }}>©2026 Made With Synaps</p>
              <div style={{ display: 'flex', gap: 20 }}>
                <a href="/legal/privacy-policy" className="nav-link" style={{ fontSize: 12, color: '#888' }}>Privacy policy</a>
                <a href="/legal/terms" className="nav-link" style={{ fontSize: 12, color: '#888' }}>Terms</a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* ── COOKIE BANNER ─────────────────────────────────────────── */}
      <CookieBanner />
    </>
  );
}
