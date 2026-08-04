'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText, Search, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle,
  GitCompare, Sparkles, Layers, Eye, Check, ExternalLink, ChevronRight,
  Database, RefreshCw, Lock, Zap, FileSpreadsheet, Building2, HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SYNAPS SCROLL-CINEMA LANDING PAGE
 * ─────────────────────────────────────────────────────────────────────────────
 * 6-Act Scroll-Scrubbed Canvas Product Film & Editorial Investigation
 * Metaphor: CHAOS → UNDERSTANDING → EVIDENCE → CONTEXT → DECISION → SYNAPS
 */

interface DocumentCardData {
  title: string;
  category: string;
  date: string;
  pages: number;
  highlightClause?: string;
  risk?: string;
}

const DEMO_DOCUMENTS: DocumentCardData[] = [
  {
    title: "Master_Services_Agreement_2026.pdf",
    category: "Commercial Contracts",
    date: "Jan 14, 2026",
    pages: 42,
    highlightClause: "Section 8.4: Vendor guarantees fixed pricing unless written notice is served 45 days prior to Oct 15 renewal.",
    risk: "14% Escalation Risk"
  },
  {
    title: "Apex_Hotels_India_Q3_Operations_SOP.pdf",
    category: "Hotel Operations & SOPs",
    date: "Aug 02, 2026",
    pages: 28,
    highlightClause: "SOP #104: Monthly HVAC maintenance required at Jaipur & Delhi properties.",
    risk: "Clean"
  },
  {
    title: "ISO_27001_Guest_Data_Security_Audit.pdf",
    category: "Compliance & Security",
    date: "May 19, 2026",
    pages: 18,
    highlightClause: "Section 9.3: Zero-Trust AI policy strictly prohibits unvetted public LLM uploads.",
    risk: "SOC 2 Type II Verified"
  },
  {
    title: "Financial_Audit_Report_3_Hotels_Q2.xlsx",
    category: "Financial Audits",
    date: "Jul 11, 2026",
    pages: 12,
    highlightClause: "F&B COGS increased from 28.2% to 34.6% resulting in ₹38.4L quarterly margin leakage.",
    risk: "Margin Leakage"
  },
  {
    title: "APAC_Expansion_Strategic_Risk_Matrix.pdf",
    category: "Executive Strategy",
    date: "Jun 30, 2026",
    pages: 35,
    highlightClause: "Capital reallocation of ₹18.5L recommended for Jaipur property infrastructure.",
    risk: "Action Needed"
  }
];

const INTERACTIVE_QUESTIONS = [
  {
    id: 'q1',
    question: "What risks are hidden in this contract?",
    answer: "Section 8.4 contains an automatic 14% annual cost escalation clause triggering on Nov 1 unless written notice is served 45 days prior (Oct 15).",
    docName: "Master_Services_Agreement_2026.pdf",
    page: "Page 8",
    section: "Section 8.4 — Price Adjustments",
    clauseText: "In the event Customer does not issue written notice of non-renewal at least forty-five (45) days prior to the Renewal Date, rates shall automatically adjust upward by fourteen percent (14%).",
    riskLevel: "HIGH",
    recommendation: "Serve written non-renewal notice before Oct 15, 2026 to renegotiate capped escalation at 4%."
  },
  {
    id: 'q2',
    question: "How does this compare with last year's agreement?",
    answer: "Compared to 2025 MSA: 15-day notice window removed, 14% uncapped price increase added, and Zero-Trust DPA obligations introduced.",
    docName: "Master_Services_Agreement_2026.pdf vs 2025_MSA.pdf",
    page: "Pages 8 & 14",
    section: "Delta Comparison Matrix",
    clauseText: "+ Section 14.1 Zero-Trust DPA Clause Added | - Section 9.3 15-day Renewal Notice Removed | Base Fee +4.2%",
    riskLevel: "MODERATE",
    recommendation: "Align Section 14.1 with internal CISO Zero-Trust directives before final signature."
  },
  {
    id: 'q3',
    question: "Where is financial leakage occurring across properties?",
    answer: "F&B cost of goods sold (COGS) increased from 28.2% to 34.6% across Mumbai & Delhi properties, causing ₹38.4L quarterly leakage.",
    docName: "Financial_Audit_Report_3_Hotels_Q2.xlsx",
    page: "Sheet 3, Cell F14",
    section: "F&B COGS Variance Schedule",
    clauseText: "Raw produce price spikes from Royal Agri Supplies contributed 78% of the total cost overrun.",
    riskLevel: "HIGH",
    recommendation: "Enforce bulk purchasing caps under F&B Procurement Contract #APX-FB-2026."
  },
  {
    id: 'q4',
    question: "Should management approve this vendor?",
    answer: "Approve with conditions. Vendor passes SOC 2 Type II audit but requires strict price-cap amendment before execution.",
    docName: "Vendor_Security_&_Legal_Deduction_Brief.pdf",
    page: "Page 2",
    section: "Executive Recommendation",
    clauseText: "Security score 99.4% (Passed). Commercial terms require mandatory 4% escalation ceiling.",
    riskLevel: "LOW",
    recommendation: "Approve vendor subject to execution of Addendum B (Price Cap Agreement)."
  }
];

export default function SynapsScrollCinemaLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Scroll Progress (0.0 to 1.0)
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentActIndex, setCurrentActIndex] = useState(0);

  // Interactive Question Explorer State
  const [selectedQuestion, setSelectedQuestion] = useState(INTERACTIVE_QUESTIONS[0]);

  // Source Viewer State
  const [activeTab, setActiveTab] = useState<'understand' | 'find' | 'connect' | 'verify' | 'decide'>('understand');

  // Smooth scroll lerp setup
  const targetScrollRef = useRef(0);
  const currentScrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.clientHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const progress = Math.min(Math.max(-rect.top / totalScrollable, 0), 1);
      targetScrollRef.current = progress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // requestAnimationFrame Canvas Render Loop (60 FPS)
  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      // Lerp smoothing
      currentScrollRef.current += (targetScrollRef.current - currentScrollRef.current) * 0.08;
      const p = currentScrollRef.current;
      setScrollProgress(p);

      // Determine current Act (0 to 5)
      const actIdx = Math.min(Math.floor(p * 6), 5);
      setCurrentActIndex(actIdx);

      // Render Canvas Document Motion Stage
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const width = (canvas.width = window.innerWidth);
          const height = (canvas.height = window.innerHeight);

          // Clear Stage (Graphite dark background)
          ctx.fillStyle = '#070708';
          ctx.fillRect(0, 0, width, height);

          // Draw subtle edge vignette
          const gradient = ctx.createRadialGradient(width / 2, height / 2, width * 0.2, width / 2, height / 2, width * 0.7);
          gradient.addColorStop(0, 'rgba(18, 18, 24, 0.4)');
          gradient.addColorStop(1, 'rgba(7, 7, 8, 0.95)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, width, height);

          // Draw subtle accent floor glow
          const floorGlow = ctx.createRadialGradient(width / 2, height * 0.6, 10, width / 2, height * 0.6, width * 0.4);
          floorGlow.addColorStop(0, 'rgba(198, 255, 46, 0.06)');
          floorGlow.addColorStop(1, 'rgba(7, 7, 8, 0)');
          ctx.fillStyle = floorGlow;
          ctx.fillRect(0, 0, width, height);

          // Draw Physical Animated Document Stack / Pages based on Scroll Progress (p)
          drawDocumentStage(ctx, width, height, p);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // ── CANVAS DOCUMENT STAGE ENGINE ───────────────────────────────────────────
  const drawDocumentStage = (ctx: CanvasRenderingContext2D, w: number, h: number, p: number) => {
    const centerX = w / 2;
    const centerY = h / 2;

    // Document styling parameters
    const cardWidth = Math.min(w * 0.38, 420);
    const cardHeight = cardWidth * 1.35;

    // ACT 01: Information Overload (0.00 - 0.16)
    if (p <= 0.16) {
      const actP = p / 0.16; // 0 to 1
      const stackCount = Math.floor(actP * 5) + 1;

      for (let i = 0; i < stackCount; i++) {
        const offsetY = (i - 2) * 14 + (1 - actP) * 40;
        const offsetX = (i - 2) * 8;
        const rotation = (i - 2) * 0.04;

        drawDocumentCard(ctx, centerX + offsetX, centerY + offsetY, cardWidth, cardHeight, rotation, {
          title: DEMO_DOCUMENTS[i % DEMO_DOCUMENTS.length].title,
          category: DEMO_DOCUMENTS[i % DEMO_DOCUMENTS.length].category,
          opacity: Math.min(actP * 2, 1),
          isActive: i === 0
        });
      }
    }
    // ACT 02: Search & Discovery (0.16 - 0.33)
    else if (p <= 0.33) {
      const actP = (p - 0.16) / 0.17; // 0 to 1

      DEMO_DOCUMENTS.slice(0, 4).forEach((doc, i) => {
        const spreadX = (i - 1.5) * (cardWidth * 0.65) * actP;
        const spreadY = Math.sin(i + actP * 2) * 20;
        const rotation = (i - 1.5) * 0.08 * (1 - actP);

        drawDocumentCard(ctx, centerX + spreadX, centerY + spreadY, cardWidth * 0.85, cardHeight * 0.85, rotation, {
          title: doc.title,
          category: doc.category,
          opacity: 1,
          isSearchHighlighted: i === 0 && actP > 0.5,
          searchQuery: actP > 0.4 ? "renewal deadline" : undefined
        });
      });
    }
    // ACT 03: Evidence Layer (0.33 - 0.50)
    else if (p <= 0.50) {
      const actP = (p - 0.33) / 0.17; // 0 to 1

      // Background document stack moves backward
      drawDocumentCard(ctx, centerX - 120, centerY - 20, cardWidth * 0.8, cardHeight * 0.8, -0.05, {
        title: "Master_Services_Agreement_2026.pdf",
        category: "Source Document",
        opacity: 0.4
      });

      // Front Evidence Card emerges center
      const evidenceScale = 0.9 + actP * 0.1;
      drawEvidenceCard(ctx, centerX, centerY + (1 - actP) * 30, cardWidth * 1.1 * evidenceScale, cardHeight * 0.9 * evidenceScale, {
        question: "What risks are hidden in this contract?",
        answer: "Section 8.4 contains an automatic 14% annual cost escalation clause triggering on Nov 1 unless notice is served 45 days prior (Oct 15).",
        source: "Master_Services_Agreement_2026.pdf · Page 8, Section 8.4",
        opacity: Math.min(actP * 1.5, 1)
      });
    }
    // ACT 04: Context & Comparison (0.50 - 0.67)
    else if (p <= 0.67) {
      const actP = (p - 0.50) / 0.17; // 0 to 1

      // Side by Side Comparison Cards
      const leftX = centerX - (cardWidth * 0.55);
      const rightX = centerX + (cardWidth * 0.55);

      drawComparisonCard(ctx, leftX, centerY, cardWidth * 0.9, cardHeight * 0.9, {
        title: "2025 Master Agreement (Previous)",
        clauses: [
          { text: "Notice Window: 15 Days", type: "removed" },
          { text: "Price Increase: Capped at 3%", type: "removed" }
        ],
        opacity: Math.min(actP * 2, 1)
      });

      drawComparisonCard(ctx, rightX, centerY, cardWidth * 0.9, cardHeight * 0.9, {
        title: "2026 Master Agreement (Current)",
        clauses: [
          { text: "Notice Window: 45 Days (Oct 15)", type: "added" },
          { text: "Price Increase: 14% Uncapped", type: "added" },
          { text: "Section 14.1 Zero-Trust DPA Clause", type: "added" }
        ],
        opacity: Math.min(actP * 2, 1)
      });
    }
    // ACT 05: Decision Brief (0.67 - 0.84)
    else if (p <= 0.84) {
      const actP = (p - 0.67) / 0.17; // 0 to 1

      drawDecisionBriefCard(ctx, centerX, centerY, cardWidth * 1.2, cardHeight * 0.95, {
        title: "CONTRACT REVIEW & RECOMMENDATION BRIEF",
        riskLevel: "HIGH RISK",
        renewalWindow: "30 DAYS REMAINING",
        liability: "EXPANDED",
        recommendedAction: "Renegotiate Clause 7 & Serve Non-Renewal Notice before Oct 15.",
        opacity: Math.min(actP * 2, 1)
      });
    }
    // ACT 06: SYNAPS Resolution (0.84 - 1.00)
    else {
      const actP = (p - 0.84) / 0.16; // 0 to 1

      // Documents resolve cleanly into an organized enterprise layout
      DEMO_DOCUMENTS.forEach((doc, idx) => {
        const angle = (idx / DEMO_DOCUMENTS.length) * Math.PI * 2 + actP;
        const radius = (1 - actP) * 180 + 120;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.4;
        const scale = 0.5 + (1 - actP) * 0.3;

        drawDocumentCard(ctx, x, y, cardWidth * scale, cardHeight * scale, 0, {
          title: doc.title,
          category: doc.category,
          opacity: 0.3 + (1 - actP) * 0.4
        });
      });

      // Center SYNAPS Emblem
      ctx.save();
      ctx.globalAlpha = Math.min(actP * 1.5, 1);
      ctx.strokeStyle = '#C6FF2E';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 48 * actP, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#C6FF2E';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SYNAPS', centerX, centerY);
      ctx.restore();
    }
  };

  // Helper Canvas Drawing Procedures
  const drawDocumentCard = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    rotation: number,
    options: {
      title: string;
      category: string;
      opacity: number;
      isActive?: boolean;
      isSearchHighlighted?: boolean;
      searchQuery?: string;
    }
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = options.opacity;

    // Card shadow
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 10;

    // Card background (Realistic paper material)
    ctx.fillStyle = '#12121a';
    ctx.strokeStyle = options.isSearchHighlighted ? '#C6FF2E' : 'rgba(255,255,255,0.12)';
    ctx.lineWidth = options.isSearchHighlighted ? 2 : 1;

    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, 12);
    ctx.fill();
    ctx.stroke();

    // Document header bar
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, 36, [12, 12, 0, 0]);
    ctx.fill();

    // Document Title & Category
    ctx.fillStyle = '#C6FF2E';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(options.category.toUpperCase(), -w / 2 + 14, -h / 2 + 22);

    ctx.fillStyle = '#F3F3F5';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(options.title.substring(0, 28), -w / 2 + 14, -h / 2 + 54);

    // Realistic text lines
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    for (let l = 0; l < 6; l++) {
      const lineWidth = (w - 28) * (0.6 + (l % 3) * 0.15);
      ctx.fillRect(-w / 2 + 14, -h / 2 + 76 + l * 14, lineWidth, 4);
    }

    // Search Query Highlight Overlay
    if (options.isSearchHighlighted && options.searchQuery) {
      ctx.fillStyle = 'rgba(198, 255, 46, 0.2)';
      ctx.strokeStyle = '#C6FF2E';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(-w / 2 + 14, -h / 2 + 120, w - 28, 30, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#C6FF2E';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(`MATCH: "${options.searchQuery}" [p.8]`, -w / 2 + 20, -h / 2 + 138);
    }

    ctx.restore();
  };

  const drawEvidenceCard = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    options: { question: string; answer: string; source: string; opacity: number }
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = options.opacity;

    ctx.fillStyle = '#161622';
    ctx.strokeStyle = '#C6FF2E';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, 16);
    ctx.fill();
    ctx.stroke();

    // Question header
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText("BUSINESS QUESTION", -w / 2 + 20, -h / 2 + 28);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(options.question, -w / 2 + 20, -h / 2 + 50);

    // Answer box
    ctx.fillStyle = 'rgba(198, 255, 46, 0.08)';
    ctx.beginPath();
    ctx.roundRect(-w / 2 + 20, -h / 2 + 70, w - 40, 80, 8);
    ctx.fill();

    ctx.fillStyle = '#C6FF2E';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText("SYNAPS EVIDENCED ANSWER", -w / 2 + 30, -h / 2 + 88);

    ctx.fillStyle = '#F3F3F5';
    ctx.font = '12px sans-serif';
    // Wrap answer text
    ctx.fillText(options.answer.substring(0, 65) + "...", -w / 2 + 30, -h / 2 + 110);
    ctx.fillText(options.answer.substring(65, 130), -w / 2 + 30, -h / 2 + 130);

    // Source Citation
    ctx.fillStyle = '#C6FF2E';
    ctx.font = 'bold 10px monospace';
    ctx.fillText(`SOURCE CITATION: ${options.source}`, -w / 2 + 20, -h / 2 + 175);

    ctx.restore();
  };

  const drawComparisonCard = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    options: { title: string; clauses: { text: string; type: 'added' | 'removed' }[]; opacity: number }
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = options.opacity;

    ctx.fillStyle = '#14141f';
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, 14);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(options.title, -w / 2 + 16, -h / 2 + 30);

    options.clauses.forEach((c, idx) => {
      const isAdded = c.type === 'added';
      ctx.fillStyle = isAdded ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)';
      ctx.strokeStyle = isAdded ? '#22c55e' : '#ef4444';

      ctx.beginPath();
      ctx.roundRect(-w / 2 + 16, -h / 2 + 50 + idx * 45, w - 32, 36, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isAdded ? '#4ade80' : '#f87171';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(`${isAdded ? '+' : '-'} ${c.text}`, -w / 2 + 24, -h / 2 + 72 + idx * 45);
    });

    ctx.restore();
  };

  const drawDecisionBriefCard = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    options: { title: string; riskLevel: string; renewalWindow: string; liability: string; recommendedAction: string; opacity: number }
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = options.opacity;

    ctx.fillStyle = '#12121a';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(options.riskLevel, -w / 2 + 20, -h / 2 + 28);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(options.title, -w / 2 + 20, -h / 2 + 50);

    // Metrics grid
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.fillRect(-w / 2 + 20, -h / 2 + 65, w / 2 - 25, 45);
    ctx.fillRect(5, -h / 2 + 65, w / 2 - 25, 45);

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '9px sans-serif';
    ctx.fillText("RENEWAL DEADLINE", -w / 2 + 28, -h / 2 + 80);
    ctx.fillText("LIABILITY STATUS", 13, -h / 2 + 80);

    ctx.fillStyle = '#C6FF2E';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(options.renewalWindow, -w / 2 + 28, -h / 2 + 98);
    ctx.fillText(options.liability, 13, -h / 2 + 98);

    // Recommended action box
    ctx.fillStyle = 'rgba(198, 255, 46, 0.1)';
    ctx.strokeStyle = '#C6FF2E';
    ctx.beginPath();
    ctx.roundRect(-w / 2 + 20, -h / 2 + 125, w - 40, 50, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#C6FF2E';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText("RECOMMENDED EXECUTIVE ACTION", -w / 2 + 30, -h / 2 + 142);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '11px sans-serif';
    ctx.fillText(options.recommendedAction, -w / 2 + 30, -h / 2 + 160);

    ctx.restore();
  };

  return (
    <div className="min-h-screen bg-[#070708] text-[#F3F3F5] font-sans selection:bg-[#C6FF2E] selection:text-black">
      {/* ── TOP EDITORIAL NAVIGATION ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#070708]/80 backdrop-blur-md border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-[#C6FF2E]/10 border border-[#C6FF2E]/30 flex items-center justify-center text-[#C6FF2E] font-bold text-sm">
              S
            </div>
            <span className="font-bold text-lg tracking-wider text-white group-hover:text-[#C6FF2E] transition-colors">
              SYNAPS
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-white/50">
            <a href="#hero-story" className="hover:text-white transition-colors">Product Film</a>
            <a href="#ask-the-work" className="hover:text-white transition-colors">Ask the Work</a>
            <a href="#source-is-answer" className="hover:text-white transition-colors">Source Evidence</a>
            <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-white/60 hover:text-white px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/demo"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C6FF2E] hover:bg-[#b5f020] text-black text-xs font-bold transition-all shadow-lg shadow-[#C6FF2E]/10"
            >
              Enter SYNAPS
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── 6-ACT SCROLL-CINEMA HERO CONTAINER ── */}
      <div ref={containerRef} id="hero-story" className="relative h-[600vh]">
        {/* Sticky Background Canvas Stage */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden z-10">
          <canvas ref={canvasRef} className="w-full h-full block" />

          {/* Overlaid Editorial Text Sequence per Act */}
          <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-8 md:p-16 max-w-7xl mx-auto">
            {/* Top Act Indicator Badge */}
            <div className="flex items-center gap-3 pt-12">
              <span className="w-2 h-2 rounded-full bg-[#C6FF2E] animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest text-[#C6FF2E] uppercase font-bold">
                {currentActIndex === 0 && "SCENE 01 — THE INFORMATION PROBLEM"}
                {currentActIndex === 1 && "SCENE 02 — SEARCH & DISCOVERY"}
                {currentActIndex === 2 && "SCENE 03 — EVIDENCE TRACING"}
                {currentActIndex === 3 && "SCENE 04 — CONTEXT & COMPARISON"}
                {currentActIndex === 4 && "SCENE 05 — DECISION BRIEF"}
                {currentActIndex === 5 && "SCENE 06 — SYNAPS REVEAL"}
              </span>
            </div>

            {/* Act Copy Center Overlay */}
            <div className="my-auto max-w-xl space-y-4">
              {currentActIndex === 0 && (
                <div className="space-y-3 animate-fade-in">
                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    Your company already knows the answer.
                  </h1>
                  <p className="text-base text-white/50 font-medium">
                    It's just buried everywhere inside contracts, SOPs, financial audits, and reports.
                  </p>
                </div>
              )}

              {currentActIndex === 1 && (
                <div className="space-y-3 animate-fade-in">
                  <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    Finding something should not be this hard.
                  </h2>
                  <p className="text-base text-white/50 font-medium">
                    SYNAPS doesn't just read documents. It understands where information lives down to exact line coordinates.
                  </p>
                </div>
              )}

              {currentActIndex === 2 && (
                <div className="space-y-3 animate-fade-in">
                  <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    Don't trust the answer.<br />
                    <span className="text-[#C6FF2E]">Trace it.</span>
                  </h2>
                  <p className="text-base text-white/50 font-medium">
                    Every important answer has an audit trail back to verifiable source evidence.
                  </p>
                </div>
              )}

              {currentActIndex === 3 && (
                <div className="space-y-3 animate-fade-in">
                  <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    Context changes the answer.
                  </h2>
                  <p className="text-base text-white/50 font-medium">
                    Compare agreements side-by-side. Spot modified clauses, removed protections, and hidden price escalations.
                  </p>
                </div>
              )}

              {currentActIndex === 4 && (
                <div className="space-y-3 animate-fade-in">
                  <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    Information becomes a decision.
                  </h2>
                  <p className="text-base text-white/50 font-medium">
                    Turn scattered facts into clear executive recommendations with concrete risk ratings and deadlines.
                  </p>
                </div>
              )}

              {currentActIndex === 5 && (
                <div className="space-y-4 pointer-events-auto animate-fade-in">
                  <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-none">
                    Make your information usable.
                  </h2>
                  <p className="text-base text-white/60 font-medium leading-relaxed">
                    SYNAPS connects the documents, evidence and decisions your organization already has — so people can find what matters, understand why it matters, and act on it.
                  </p>
                  <div className="flex items-center gap-4 pt-4">
                    <Link
                      href="/demo"
                      className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C6FF2E] hover:bg-[#b5f020] text-black text-sm font-bold transition-all shadow-xl shadow-[#C6FF2E]/20"
                    >
                      Enter SYNAPS
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <a
                      href="#ask-the-work"
                      className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold transition-all"
                    >
                      See how it works
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Scroll Cue */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs font-mono text-white/40">
              <span>PROGRESS: {Math.round(scrollProgress * 100)}%</span>
              <span className="animate-bounce">SCROLL TO INVESTIGATE ↓</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 12: "ASK THE WORK" INTERACTIVE EXPLORER ── */}
      <section id="ask-the-work" className="py-24 border-t border-white/5 bg-[#0a0a0f] relative z-30">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="space-y-3">
            <div className="text-xs font-mono text-[#C6FF2E] tracking-widest uppercase font-bold">
              01 / INTERACTIVE REASONING
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Ask the work.
            </h2>
            <p className="text-sm text-white/50 max-w-xl">
              Select a real-world business question below to see how SYNAPS traces evidence across company records and formats executive answers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Question Selector List */}
            <div className="lg:col-span-5 space-y-3">
              {INTERACTIVE_QUESTIONS.map(q => (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuestion(q)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group",
                    selectedQuestion.id === q.id
                      ? "bg-[#C6FF2E]/10 border-[#C6FF2E]/40 text-white"
                      : "bg-white/3 border-white/5 text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className={cn("w-4 h-4 shrink-0", selectedQuestion.id === q.id ? "text-[#C6FF2E]" : "text-white/30")} />
                    <span className="text-sm font-semibold">{q.question}</span>
                  </div>
                  <ChevronRight className={cn("w-4 h-4 shrink-0 transition-transform", selectedQuestion.id === q.id ? "text-[#C6FF2E] translate-x-1" : "text-white/20")} />
                </button>
              ))}
            </div>

            {/* Right Live Evidenced Result */}
            <div className="lg:col-span-7 bg-[#111118] border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl">
              {/* Answer Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-xs font-mono text-[#C6FF2E] font-bold uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C6FF2E]" />
                  SYNAPS Evidenced Synthesis
                </span>
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  selectedQuestion.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  selectedQuestion.riskLevel === 'MODERATE' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-green-500/20 text-green-400 border border-green-500/30'
                )}>
                  {selectedQuestion.riskLevel} RISK
                </span>
              </div>

              {/* Direct Answer */}
              <p className="text-sm text-white/90 font-medium leading-relaxed">
                {selectedQuestion.answer}
              </p>

              {/* Source Evidence Box */}
              <div className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs text-white/40 font-mono">
                  <span className="flex items-center gap-1.5 text-[#C6FF2E] font-semibold">
                    <FileText className="w-3.5 h-3.5" />
                    {selectedQuestion.docName}
                  </span>
                  <span>{selectedQuestion.page} · {selectedQuestion.section}</span>
                </div>
                <p className="text-xs font-mono text-white/70 bg-black/40 p-3 rounded-lg border border-white/5 leading-relaxed">
                  "{selectedQuestion.clauseText}"
                </p>
              </div>

              {/* Recommendation */}
              <div className="p-4 rounded-xl bg-[#C6FF2E]/10 border border-[#C6FF2E]/20 space-y-1">
                <div className="text-xs font-bold text-[#C6FF2E] uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Recommended Action
                </div>
                <p className="text-xs text-white/80 font-medium leading-relaxed">
                  {selectedQuestion.recommendation}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 13: "THE SOURCE IS THE ANSWER" EVIDENCE VIEWER ── */}
      <section id="source-is-answer" className="py-24 border-t border-white/5 bg-[#070708] relative z-30">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="space-y-3">
            <div className="text-xs font-mono text-[#C6FF2E] tracking-widest uppercase font-bold">
              02 / VERIFIABLE EVIDENCE
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              The source is the answer.
            </h2>
            <p className="text-sm text-white/50 max-w-xl">
              Never accept an unverified summary. SYNAPS grounds every claim directly into the original document page, section, and line coordinates.
            </p>
          </div>

          {/* Interactive Document Page Viewer */}
          <div className="bg-[#111118] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Viewer Toolbar */}
            <div className="bg-white/3 border-b border-white/5 px-6 py-3 flex items-center justify-between text-xs text-white/60">
              <div className="flex items-center gap-3 font-mono">
                <FileText className="w-4 h-4 text-[#C6FF2E]" />
                <span className="font-bold text-white">Master_Services_Agreement_2026.pdf</span>
                <span className="text-white/30">|</span>
                <span>Page 8 of 42</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-[10px] font-bold uppercase">Source Verified</span>
                <Link href="/demo" className="flex items-center gap-1 text-[#C6FF2E] hover:underline font-semibold ml-4">
                  Open Source <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Document Content Viewport */}
            <div className="p-8 font-mono text-xs text-white/70 space-y-6 max-h-[420px] overflow-y-auto leading-relaxed bg-[#0d0d14]">
              <div className="border-b border-white/5 pb-4 text-white/30">
                MASTER SERVICES AGREEMENT · SECTION 8 — COMMERCIAL TERMS & PRICE ESCALATIONS
              </div>

              <p>
                8.1 <span className="text-white">Base Service Fees.</span> Customer agrees to pay the annual recurring subscription fees set forth in Schedule A. Invoices shall be remitted net-30 days from date of issuance.
              </p>

              <p>
                8.2 <span className="text-white">Taxes & Expenses.</span> All fees are exclusive of applicable state, federal, or value-added taxes, which shall be billed separately to Customer.
              </p>

              {/* Highlighted Evidence Passage */}
              <div className="p-4 rounded-xl bg-[#C6FF2E]/15 border-l-4 border-[#C6FF2E] text-white space-y-2 my-4">
                <div className="flex items-center justify-between text-[10px] text-[#C6FF2E] font-bold uppercase tracking-wider">
                  <span>SECTION 8.4 — PRICE ADJUSTMENTS & AUTOMATIC RENEWAL (EVIDENCE MATCH)</span>
                  <span>CONFIDENCE: 99.8%</span>
                </div>
                <p className="font-semibold leading-relaxed">
                  "In the event Customer does not issue written notice of non-renewal at least forty-five (45) days prior to the Renewal Date (Oct 15), rates shall automatically adjust upward by fourteen percent (14%) for the subsequent twelve (12) month term."
                </p>
              </div>

              <p>
                8.5 <span className="text-white">Limitation of Liability.</span> Except for gross negligence or willful misconduct, neither party shall be liable for indirect, consequential, or punitive damages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 14: PRODUCT CAPABILITIES ── */}
      <section id="capabilities" className="py-24 border-t border-white/5 bg-[#0a0a0f] relative z-30">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="space-y-3">
            <div className="text-xs font-mono text-[#C6FF2E] tracking-widest uppercase font-bold">
              03 / CORE CAPABILITIES
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Built for serious work.
            </h2>
          </div>

          {/* 5 Core Capabilities Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              { id: 'understand', label: 'UNDERSTAND', icon: Layers, desc: 'Read and structure complex information across PDFs, DOCX, and spreadsheets.' },
              { id: 'find', label: 'FIND', icon: Search, desc: 'Locate exact words, clauses, and facts across large document collections.' },
              { id: 'connect', label: 'CONNECT', icon: GitCompare, desc: 'Compare agreements side-by-side and highlight delta changes.' },
              { id: 'verify', label: 'VERIFY', icon: ShieldCheck, desc: 'Trace every answer back to verifiable source page & line coordinates.' },
              { id: 'decide', label: 'DECIDE', icon: CheckCircle2, desc: 'Turn evidence into executive recommendations and actionable decisions.' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "p-5 rounded-xl border text-left transition-all space-y-3",
                  activeTab === tab.id
                    ? "bg-[#C6FF2E]/10 border-[#C6FF2E]/40 text-white"
                    : "bg-white/3 border-white/5 text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-[#C6FF2E]" : "text-white/40")} />
                <div>
                  <h3 className="font-extrabold text-sm tracking-wider">{tab.label}</h3>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">{tab.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <footer className="py-20 border-t border-white/5 bg-[#070708] relative z-30">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-[#C6FF2E]/10 border border-[#C6FF2E]/30 flex items-center justify-center text-[#C6FF2E] font-bold text-xl mx-auto">
            S
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Make your information usable.
          </h2>
          <p className="text-sm md:text-base text-white/50 max-w-xl mx-auto leading-relaxed">
            SYNAPS connects the documents, evidence and decisions your organization already has — so people can find what matters, understand why it matters, and act on it.
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <Link
              href="/demo"
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-[#C6FF2E] hover:bg-[#b5f020] text-black text-sm font-bold transition-all shadow-xl shadow-[#C6FF2E]/20"
            >
              Enter SYNAPS
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="pt-12 text-xs font-mono text-white/25">
            © 2026 SYNAPS INC. ENTERPRISE DECISION INTELLIGENCE OPERATING SYSTEM.
          </div>
        </div>
      </footer>
    </div>
  );
}
