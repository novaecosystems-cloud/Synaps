"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Sparkles, ShieldCheck, Scale, DollarSign, 
  Cpu, Briefcase, Check, ArrowRight, CheckCircle2, Lock, 
  Globe2, FileText, ChevronRight, Database, Terminal, Layers,
  X, AlertCircle, RefreshCw, Link2, ExternalLink, ShieldAlert,
  UserCheck, CheckCheck, Users, Flame, LineChart, Target,
  Compass, Eye, Award, HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type ExecutiveRole = "CEO" | "CFO" | "CTO" | "LEGAL" | "CPO" | "CRO" | "HR";

interface RoleConfig {
  id: ExecutiveRole;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  color: string;
}

const EXECUTIVE_ROLES: RoleConfig[] = [
  { id: "CEO", title: "Founder & Chief Executive (CEO)", subtitle: "Strategic vision, M&A acquisitions, boardroom consensus & risk governance", icon: Building2, badge: "STRATEGY", color: "from-amber-400 to-rose-500" },
  { id: "CFO", title: "Chief Financial Officer (CFO)", subtitle: "Cash runway, balance sheet solvency, EBITDA margins & deterministic Python math", icon: DollarSign, badge: "FINANCE", color: "from-emerald-400 to-teal-600" },
  { id: "CTO", title: "Chief Technology Officer (CTO)", subtitle: "Cloud architecture, 99.99% SLAs, GPLv3 license scanning & KùzuDB graph traversal", icon: Cpu, badge: "INFRASTRUCTURE", color: "from-purple-400 to-indigo-600" },
  { id: "LEGAL", title: "General Counsel & Legal Advisor", subtitle: "Delaware DGCL § 141, statutory compliance, uncapped indemnity & clause redlines", icon: Scale, badge: "GOVERNANCE", color: "from-cyan-400 to-blue-600" },
  { id: "CPO", title: "Chief Product Officer (CPO)", subtitle: "RICE frameworks, net revenue retention, technical invariant roadmap & churn defense", icon: Compass, badge: "PRODUCT", color: "from-pink-400 to-rose-600" },
  { id: "CRO", title: "Chief Revenue Officer (CRO)", subtitle: "Enterprise sales velocity, non-standard SLA commits, pipeline attribution & deal defense", icon: LineChart, badge: "REVENUE", color: "from-orange-400 to-amber-600" },
  { id: "HR", title: "Chief People Officer / HR", subtitle: "Executive retention, Delaware DGCL equity governance & cross-team alignment", icon: Users, badge: "PEOPLE", color: "from-teal-400 to-cyan-600" }
];

interface DiagnosticQuestion {
  questionNumber: number;
  title: string;
  subtitle: string;
  options: {
    id: string;
    label: string;
    sublabel: string;
    highlight?: string;
  }[];
}

const ROLE_DIAGNOSTICS: Record<ExecutiveRole, DiagnosticQuestion[]> = {
  CEO: [
    {
      questionNumber: 1,
      title: "What are your top non-negotiable strategic bets for the next 12–24 months?",
      subtitle: "Calibrates the 10-Agent Boardroom core thesis and long-horizon risk tolerance.",
      options: [
        { id: "MNA_SCALE", label: "$50M–$200M Cloud M&A Acquisition & Tech Consolidation", sublabel: "Requires rigorous KùzuDB IP diligence and clean-room valuation modeling.", highlight: "HIGH CONVICTION" },
        { id: "GLOBAL_EXPANSION", label: "Global Multi-Region Cloud Expansion (APAC & EMEA)", sublabel: "Requires cross-border statutory compliance and localized sovereign data enclaves.", highlight: "SCALE" },
        { id: "UPMARKET_ENTERPRISE", label: "Enterprise Upmarket Transition ($100k+ ACV Tier)", sublabel: "Demands strict SOC-2 Type II and Delaware DGCL § 141 evidentiary contract defense.", highlight: "REVENUE" },
        { id: "EBITDA_PROFIT", label: "Aggressive Profitability Pivot & Margin Compression Defense", sublabel: "Requires deterministic Python WASM sandboxes to stress-test burn multiples.", highlight: "EFFICIENCY" }
      ]
    },
    {
      questionNumber: 2,
      title: "What is your biggest corporate blind spot?",
      subtitle: "The primary risk scenario your AI boardroom will actively monitor and red-team.",
      options: [
        { id: "IP_LICENSE_TRAP", label: "Hidden GPLv3 Reciprocal License Traps in Acquired Codebases", sublabel: "Viral license contamination forcing expensive $42M clean-room rewrites." },
        { id: "SLA_COMMERCIAL_DRIFT", label: "Commercial Teams Committing to 99.99% SLAs Infrastructure Cannot Deliver", sublabel: "Creating $1.45M liquidated damages breach exposure." },
        { id: "FIDUCIARY_LIABILITY", label: "Delaware DGCL § 141 Statutory Fiduciary Liability & Uncapped Vendor Indemnity", sublabel: "Signing non-mutual liability agreements without board quorum approval." },
        { id: "MACRO_TARIFF", label: "Unhedged Macro Supply Chain & +15% Hardware Tariff Shocks", sublabel: "Compressing gross margins with zero early-warning telemetry." }
      ]
    },
    {
      questionNumber: 3,
      title: "What is the single highest-stakes decision facing your team right now?",
      subtitle: "The initial decision dossier Causarix will model in your boardroom simulation.",
      options: [
        { id: "DEC_TERM_SHEET", label: "Signing a $200M Term Sheet with Seller Escrow Carve-outs", sublabel: "Calibrating buyer leverage and indemnity holdbacks." },
        { id: "DEC_ENTERPRISE_MSA", label: "Executing a $14.5M Multi-Year Enterprise Master Services Agreement", sublabel: "Negotiating mutual liability caps and SLA downtime penalties." },
        { id: "DEC_INFRA_PIVOT", label: "Major Infrastructure Refactor to Eliminate Single-Point-of-Failure Outages", sublabel: "Balancing engineering roadmap against sales quarterly commitments." },
        { id: "DEC_CAPITAL_ALLOC", label: "Allocating $25M Strategic Capital Reserve to New Product Lines", sublabel: "Stress-testing 90-day Bayesian decision probabilities." }
      ]
    },
    {
      questionNumber: 4,
      title: "How aggressively should your AI boardroom challenge your assumptions?",
      subtitle: "Sets the dialectic debate tension and red-team intensity across all 10 digital twins.",
      options: [
        { id: "CHALLENGE_RED_TEAM", label: "Hostile Red-Team: Aggressively attack assumptions & expose fatal failure modes", sublabel: "High-friction dialectic tension designed for maximum stress-testing.", highlight: "RECOMMENDED" },
        { id: "CHALLENGE_DIALECTIC", label: "Dialectic Neutral: Balanced adversarial debate with unanimous quorum consensus", sublabel: "Structured counter-arguments with SHA-256 evidentiary citations." },
        { id: "CHALLENGE_ADVISOR", label: "Strategic Advisor: Constructive fiduciary guidance & statutory compliance grounding", sublabel: "Focused on regulatory alignment and standard corporate law best practices." }
      ]
    }
  ],
  CFO: [
    {
      questionNumber: 1,
      title: "What is your minimum runway buffer & target EBITDA margin?",
      subtitle: "Calibrates deterministic Python WASM solvency models.",
      options: [
        { id: "RUNWAY_24M", label: "24+ Months Runway Buffer · Target >25% EBITDA Margin", sublabel: "Conservative capital preservation with macro shock buffers.", highlight: "TIER 1" },
        { id: "RUNWAY_18M", label: "18 Months Runway · High-Growth Burn Multiple <1.2x", sublabel: "Balanced expansion with quarterly stress-testing." },
        { id: "RUNWAY_12M", label: "12 Months Runway · Aggressive Breakeven & Free Cashflow Pivot", sublabel: "Requires real-time OpEx telemetry and invariant caps." }
      ]
    },
    {
      questionNumber: 2,
      title: "What financial modeling templates or accounting standards do you mandate?",
      subtitle: "Ensures zero data drift across all balance sheet simulations.",
      options: [
        { id: "GAAP_ASC606", label: "US GAAP & ASC 606 Revenue Recognition Standards", sublabel: "Strict deferred revenue and milestone-based amortization." },
        { id: "IFRS_CONSOLIDATION", label: "IFRS 15 / 16 Multi-Entity Cross-Border Consolidation", sublabel: "Lease accounting and multi-currency foreign exchange reconciliation." },
        { id: "ZERO_BASED_BUDGET", label: "Zero-Based Budgeting (ZBB) with Python WASM Sandboxes", sublabel: "Every department budget justified with mathematical proof." }
      ]
    },
    {
      questionNumber: 3,
      title: "What threshold of unbudgeted OpEx/CapEx requires mandatory boardroom approval?",
      subtitle: "Establishes automated invariant rules for financial governance.",
      options: [
        { id: "OPEX_100K", label: "Any Unbudgeted Commitment > $100,000", sublabel: "Triggers instant automated CFO Digital Twin review." },
        { id: "OPEX_250K", label: "Any Unbudgeted Commitment > $250,000", sublabel: "Requires 10-Agent Boardroom Quorum consensus vote." },
        { id: "OPEX_UNCAPPED", label: "Any Contract with Uncapped Indemnity or Liquidated Damages", sublabel: "Zero-tolerance invariant interceptor." }
      ]
    },
    {
      questionNumber: 4,
      title: "What is your primary macroeconomic exposure risk?",
      subtitle: "Configures stress-testing parameters in the Simulation Engine.",
      options: [
        { id: "MACRO_TARIFF", label: "+15% Macro Tariff Spike & Hardware / Cloud Margin Compression", sublabel: "Evaluates margin resilience under supply chain disruption." },
        { id: "MACRO_INTEREST", label: "Elevated Interest Rates & Rising Working Capital Cost", sublabel: "Simulates debt refinancing and debt-service coverage ratios." },
        { id: "MACRO_FX", label: "Foreign Exchange Volatility across EUR / GBP / APAC Cash Pools", sublabel: "Monitors currency hedging and localized purchasing power." }
      ]
    }
  ],
  CTO: [
    {
      questionNumber: 1,
      title: "What are your strict contractual uptime & SLA commitments?",
      subtitle: "Defines engineering infrastructure invariant ceilings.",
      options: [
        { id: "SLA_9999", label: "99.99% Uptime ($1.45M Liquidated Damages Risk Exposure)", sublabel: "Tolerates only 4.3 minutes of downtime per month.", highlight: "CRITICAL" },
        { id: "SLA_999", label: "99.9% Uptime (<43.8 minutes monthly downtime tolerance)", sublabel: "Standard high-assurance enterprise SaaS tier." },
        { id: "SLA_995", label: "99.5% Uptime with Scheduled Maintenance Carve-Outs", sublabel: "Permits planned maintenance windows without financial penalty." }
      ]
    },
    {
      questionNumber: 2,
      title: "Where are your largest legacy bottlenecks & technical debt risks?",
      subtitle: "Focuses KùzuDB graph traversal on architectural vulnerabilities.",
      options: [
        { id: "TECH_MONOLITH", label: "Monolithic Database Bottlenecks under 10x Scale Spikes", sublabel: "Risk of cascading connection pool exhaustion during peak load." },
        { id: "TECH_LOCKIN", label: "Proprietary Cloud Infrastructure Vendor Lock-in", sublabel: "High migration friction and escalating egress cost exposure." },
        { id: "TECH_DEPENDENCY", label: "Multi-Repo Dependency Cascades & Broken Release Gates", sublabel: "Unsynchronized microservices creating deployment blockers." }
      ]
    },
    {
      questionNumber: 3,
      title: "What open-source licenses are strictly restricted across your codebases?",
      subtitle: "Sets automatic invariant triggers for repository pull request scans.",
      options: [
        { id: "LIC_ZERO_GPL", label: "Strict Zero-GPLv3 / AGPL (Reciprocal Viral Infection Ban)", sublabel: "Prevents proprietary source code disclosure obligations." },
        { id: "LIC_PERMISSIVE", label: "Permissive Only (MIT, Apache 2.0, BSD-3)", sublabel: "Zero commercial re-distribution restrictions." },
        { id: "LIC_AUDIT_ALL", label: "Case-by-Case KùzuDB Multi-Hop Dependency Auditing", sublabel: "Deep scanning for dual-licensed and copyleft dependencies." }
      ]
    },
    {
      questionNumber: 4,
      title: "What are your critical cross-team dependency blockers?",
      subtitle: "Enables the Air-Traffic Controller to intercept conflicting commitments.",
      options: [
        { id: "BLOCKER_SALES", label: "Sales Committing to 99.99% SLAs or Custom Features without Eng Sign-off", sublabel: "The #1 cause of unbudgeted infrastructure scrambles." },
        { id: "BLOCKER_SECURITY", label: "InfoSec Questionnaire & Security Audit Backlogs Blocking Releases", sublabel: "Manual compliance reviews delaying enterprise rollouts." },
        { id: "BLOCKER_MNA", label: "Unclear M&A Codebase Integration & Clean-Room Rewrite Roadmaps", sublabel: "Stalled post-merger technical debt rationalization." }
      ]
    }
  ],
  LEGAL: [
    {
      questionNumber: 1,
      title: "Which regulatory frameworks strictly govern your corporate entity?",
      subtitle: "Calibrates statutory legal citations and Delaware case law standards.",
      options: [
        { id: "REG_DELAWARE", label: "Delaware DGCL § 141, SEC Fiduciary Duty & US Corporate Law", sublabel: "Board business judgment rule and fiduciary defensibility.", highlight: "CORE JURISDICTION" },
        { id: "REG_GDPR", label: "EU GDPR Article 28 & EU AI Act 2024 (High-Risk AI Governance)", sublabel: "Strict data localization and automated decision logging." },
        { id: "REG_DPDP", label: "India DPDP Act 2023 & Cross-Border Fiduciary Data Transfers", sublabel: "Data principal consent management and fiduciary compliance." },
        { id: "REG_HIPAA_SOC2", label: "HIPAA, SOC 2 Type II & ISO 27001 Enterprise Governance", sublabel: "High-assurance sensitive data protection standards." }
      ]
    },
    {
      questionNumber: 2,
      title: "What are your standard fallback clauses for liability caps & indemnities?",
      subtitle: "Configures automated 60s contract redline counter-proposals.",
      options: [
        { id: "CAP_12M_FEES", label: "Mutual Liability Cap = 12 Months Fees Paid (Non-Negotiable)", sublabel: "Standard market mutual protection for enterprise SaaS." },
        { id: "CAP_MUTUAL_IP", label: "Mutual IP Indemnification with Super-Cap Exception", sublabel: "Caps general breach while protecting core intellectual property." },
        { id: "CAP_NO_CONSEQUENTIAL", label: "Strict Mutual Waiver of Consequential & Indirect Damages", sublabel: "Shields company from lost profit or punitive damage claims." }
      ]
    },
    {
      questionNumber: 3,
      title: "Which active contracts carry your highest financial or operational exposure?",
      subtitle: "Targets automated risk scanning on your most dangerous agreements.",
      options: [
        { id: "EXP_UNCAPPED_MSA", label: "Vendor MSAs with Uncapped Indemnity or Auto-Renewal Traps", sublabel: "Silent liabilities that compound on annual anniversaries." },
        { id: "EXP_MNA_SPA", label: "M&A Share Purchase Agreements with $25M Escrow Claims", sublabel: "Representations, warranties, and post-closing indemnity holdbacks." },
        { id: "EXP_ENTERPRISE_SLA", label: "Enterprise Customer Agreements with Liquidated Downtime Penalties", sublabel: "Direct financial clawbacks for infrastructure hiccups." }
      ]
    },
    {
      questionNumber: 4,
      title: "What governing law applies to your core commercial agreements?",
      subtitle: "Ensures counter-clauses cite binding statutory precedents.",
      options: [
        { id: "LAW_DELAWARE", label: "State of Delaware & Delaware Chancery Court Jurisdiction", sublabel: "The gold standard for corporate fiduciary dispute resolution." },
        { id: "LAW_UK", label: "English Common Law & High Court of Justice (UK)", sublabel: "Standard for cross-border EMEA and maritime transactions." },
        { id: "LAW_SINGAPORE", label: "Singapore Law & Singapore International Arbitration Centre (SIAC)", sublabel: "Primary governing standard for APAC cross-border contracts." }
      ]
    }
  ],
  CPO: [
    {
      questionNumber: 1,
      title: "What prioritization framework does your team enforce?",
      subtitle: "Calibrates product roadmap invariants in the deliberation engine.",
      options: [
        { id: "FRAME_RICE", label: "RICE Framework (Reach, Impact, Confidence, Effort)", sublabel: "Quantitative scoring for sprint and milestone planning." },
        { id: "FRAME_COST_DELAY", label: "Cost of Delay & Economic Value Realization", sublabel: "Focuses engineering bandwidth on high-urgency revenue unlocks." },
        { id: "FRAME_INVARIANTS", label: "Cross-Silo Invariant Gate (Zero Commitments without Eng Approval)", sublabel: "Prevents technical debt accumulation from sales promises." }
      ]
    },
    {
      questionNumber: 2,
      title: "Which customer segment drives 80% of your net retention revenue?",
      subtitle: "Aligns product twin advocacy during boardroom trade-off debates.",
      options: [
        { id: "SEG_ENTERPRISE", label: "Enterprise Tier ($100k+ ACV) Demanding Custom Security & SLAs", sublabel: "High contract value with rigorous compliance expectations." },
        { id: "SEG_MIDMARKET", label: "Fast-Growing Mid-Market Accounts with High Feature Velocity", sublabel: "Volume expansion driven by product-led onboarding." },
        { id: "SEG_HOLDINGS", label: "Multi-Entity Holding Companies Requiring Multi-Tenant Isolation", sublabel: "Complex organizational hierarchies and consolidated billing." }
      ]
    },
    {
      questionNumber: 3,
      title: "What is the top documented reason for customer friction or churn?",
      subtitle: "Targets automated invariant defenses against recurring failure modes.",
      options: [
        { id: "CHURN_SLA", label: "SLA Commitments Promised by Sales but Not Met by Infrastructure", sublabel: "Creates executive friction and contractual breach claims." },
        { id: "CHURN_COMPLIANCE", label: "Lack of Verifiable Audit Logs & Cryptographic Proof Receipts", sublabel: "Fails buyer enterprise security and compliance audits." },
        { id: "CHURN_USABILITY", label: "Complex Multi-Team Permission & Role Governance Bottlenecks", sublabel: "Slows team adoption across executive departments." }
      ]
    },
    {
      questionNumber: 4,
      title: "What is your roadmap planning horizon?",
      subtitle: "Configures long-term simulation forecasting in Causarix.",
      options: [
        { id: "HORIZON_12M", label: "12–24 Month Strategic Architecture & Fiduciary Defense", sublabel: "Aligned with multi-year M&A and enterprise contract milestones." },
        { id: "HORIZON_QUARTERLY", label: "Quarterly Sprints with Continuous Boardroom Quorum Checkpoints", sublabel: "Iterative adaptation to market shifts and customer signals." },
        { id: "HORIZON_CONTINUOUS", label: "Continuous Deployment with Automated Regulatory Invariant Gates", sublabel: "Real-time compliance checks on every release." }
      ]
    }
  ],
  CRO: [
    {
      questionNumber: 1,
      title: "What is your average sales cycle length & target deal size?",
      subtitle: "Calibrates revenue velocity and pipeline forecasting models.",
      options: [
        { id: "DEAL_150K", label: "$150k+ ACV · 60–90 Day Enterprise Sales Cycle · 35% Win Rate", sublabel: "Complex multi-stakeholder legal and InfoSec procurement." },
        { id: "DEAL_50K", label: "$50k ACV · 30–45 Day Sales Cycle · 45% Win Rate", sublabel: "High velocity mid-market enterprise expansion." },
        { id: "DEAL_500K", label: "$500k+ Strategic Multi-Year Enterprise Transformations", sublabel: "Requires custom boardroom-level executive sponsorship." }
      ]
    },
    {
      questionNumber: 2,
      title: "What custom terms are sales reps offering most frequently to close deals?",
      subtitle: "The primary cross-silo risk scenario Causarix will monitor.",
      options: [
        { id: "TERM_9999_SLA", label: "99.99% Uptime Guarantees with Heavy Financial Clawbacks", sublabel: "Creates unbudgeted liability when engineering operates at 99.9%." },
        { id: "TERM_CUSTOM_IP", label: "Custom IP Assignment & Source Code Escrow Commitments", sublabel: "Threatens core company valuation and proprietary trade secrets." },
        { id: "TERM_DATA_LOCAL", label: "Non-Standard Data Localization & Bespoke Audit Rights", sublabel: "Imposes heavy operational overhead on technical infrastructure." }
      ]
    },
    {
      questionNumber: 3,
      title: "What is the primary objection causing stalled deals in your pipeline?",
      subtitle: "Enables instant generation of statutory counter-evidence packages.",
      options: [
        { id: "OBJ_LEGAL_INFOSEC", label: "Legal & InfoSec Liability Caps, Indemnity & Data Privacy Pushback", sublabel: "Stuck in 4-week legal redline ping-pong cycles." },
        { id: "OBJ_AI_TRUST", label: "AI Hallucination & Data Leakage Fears from Enterprise Buyers", sublabel: "Buyers demanding proof of zero public model training." },
        { id: "OBJ_ROI_PROOF", label: "Justifying ROI & Defending Budget against In-House Legal/Finance Staff", sublabel: "Needs clear cost-saving benchmarks and efficiency metrics." }
      ]
    },
    {
      questionNumber: 4,
      title: "Which platform serves as your single source of truth for pipeline data?",
      subtitle: "Enables 1-click OAuth sync for automated deal risk auditing.",
      options: [
        { id: "CRM_SALESFORCE", label: "Salesforce Enterprise & Atlassian Jira Integration", sublabel: "Full enterprise pipeline and contract stage tracking." },
        { id: "CRM_HUBSPOT", label: "HubSpot Enterprise & Slack Deal Rooms", sublabel: "Fast-moving collaborative deal execution." },
        { id: "CRM_CAUSARIX", label: "Direct Causarix Sovereign Invariant Connector", sublabel: "Real-time contract redlining directly from deal repositories." }
      ]
    }
  ],
  HR: [
    {
      questionNumber: 1,
      title: "What are your core executive retention & talent targets?",
      subtitle: "Calibrates human capital stability metrics in the Boardroom Quorum.",
      options: [
        { id: "HR_ATTRITION_5", label: "Critical Technical & Executive Attrition < 5% Annually", sublabel: "Protecting institutional knowledge and core IP." },
        { id: "HR_SCALING", label: "Rapid C-Suite & Engineering Scaling for Multi-Region Expansion", sublabel: "Maintaining culture and statutory compliance during fast growth." },
        { id: "HR_POST_MNA", label: "Post-M&A Key Talent Retention & Incentive Lock-in", sublabel: "Structuring golden handcuffs and clean-room transition teams." }
      ]
    },
    {
      questionNumber: 2,
      title: "What compliance guidelines govern executive compensation & equity?",
      subtitle: "Ensures adherence to corporate governance standards.",
      options: [
        { id: "COMP_DELAWARE", label: "Delaware DGCL § 141 Executive Fiduciary Duty & 409A Valuations", sublabel: "Board-approved equity incentive plans and vesting acceleration." },
        { id: "COMP_CROSSBORDER", label: "Multi-Jurisdictional Cross-Border Remote Worker Compliance", sublabel: "Localized tax withholding and permanent establishment risks." },
        { id: "COMP_IP_ASSIGN", label: "Strict Non-Compete & Proprietary IP Assignment Enforcement", sublabel: "Securing company ownership over all employee inventions." }
      ]
    },
    {
      questionNumber: 3,
      title: "What is the recurring friction point in recent employee exit interviews?",
      subtitle: "Identifies organizational bottlenecks before they impact performance.",
      options: [
        { id: "EXIT_SILOS", label: "Cross-Department Silos & Conflicting Executive Directives", sublabel: "Teams receiving contradictory instructions from Sales vs Engineering." },
        { id: "EXIT_TECHDEBT", label: "Burnout from Legacy Technical Debt & Unrealistic Deadlines", sublabel: "Engineering overburdened by unreviewed customer commitments." },
        { id: "EXIT_GOVERNANCE", label: "Unclear Strategic Direction from Boardroom Leadership", sublabel: "Lack of transparent quorum rationale behind major company pivots." }
      ]
    },
    {
      questionNumber: 4,
      title: "What governance framework guides your team alignment?",
      subtitle: "Configures transparent decision logging across all departments.",
      options: [
        { id: "GOV_CONSENSUS", label: "Synchronous C-Suite Consensus with Transparent Voting Records", sublabel: "100% immutable decision history accessible to leadership." },
        { id: "GOV_OKRS", label: "Formal OKR Alignment with Boardroom Evidentiary Audit Trails", sublabel: "Quarterly objectives anchored to measurable metrics." },
        { id: "GOV_DIALECTIC", label: "Real-Time Dialectic Synthesis of Executive Disagreements", sublabel: "Constructively resolving leadership friction through structured debate." }
      ]
    }
  ]
};

export function AdaptiveEnterpriseOnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Step navigation: "role" -> "q1" -> "q2" -> "q3" -> "q4" -> "synthesis"
  const [currentStep, setCurrentStep] = useState<"role" | "q1" | "q2" | "q3" | "q4" | "synthesis">("role");
  
  // User answers
  const [selectedRole, setSelectedRole] = useState<ExecutiveRole>("CEO");
  const [answers, setAnswers] = useState<{
    q1?: string;
    q2?: string;
    q3?: string;
    q4?: string;
  }>({});

  // Active Synthesis Calculation State
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [synthesisProgress, setSynthesisProgress] = useState<string>("Analyzing executive diagnostic profile...");

  // 1-Click OAuth Connectors
  const GITHUB_CLIENT_ID = "Ov23li5MJdkSTkxXfr8P";
  const ATLASSIAN_CLIENT_ID = "5vuAKDnx4cfhpGcYRlSxrDc1GJuPppr1";
  const SLACK_CLIENT_ID = "11623622093636.11857963256533";

  const [connectedIntegrations, setConnectedIntegrations] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const isCompleted = localStorage.getItem("causarix_onboarding_completed");
    if (!isCompleted) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for real OAuth popup callback window message
  useEffect(() => {
    const handleOAuthCallbackMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const provider = event.data.provider || "github";
        setConnectedIntegrations(prev => ({
          ...prev,
          [provider]: true
        }));
        try {
          localStorage.setItem(`causarix_${provider}_connected`, "true");
        } catch (e) {}
      }
    };

    window.addEventListener('message', handleOAuthCallbackMessage);
    return () => window.removeEventListener('message', handleOAuthCallbackMessage);
  }, []);

  const handleSelectRole = (role: ExecutiveRole) => {
    setSelectedRole(role);
    setAnswers({});
    setCurrentStep("q1");
  };

  const handleSelectAnswer = (qKey: "q1" | "q2" | "q3" | "q4", answerId: string) => {
    setAnswers(prev => ({ ...prev, [qKey]: answerId }));

    if (qKey === "q1") setCurrentStep("q2");
    else if (qKey === "q2") setCurrentStep("q3");
    else if (qKey === "q3") setCurrentStep("q4");
    else if (qKey === "q4") {
      // Trigger AI Synthesis Calculation Sequence
      triggerSynthesisSequence();
    }
  };

  const triggerSynthesisSequence = async () => {
    setCurrentStep("synthesis");
    setIsSynthesizing(true);
    setSynthesisProgress("Analyzing your executive diagnostic profile...");

    await new Promise(r => setTimeout(r, 600));
    setSynthesisProgress("Cross-referencing blind spots against KùzuDB causal graph engine...");

    await new Promise(r => setTimeout(r, 700));
    setSynthesisProgress("Calibrating 10-Agent Boardroom Digital Twins & Delaware DGCL § 141 standards...");

    await new Promise(r => setTimeout(r, 600));
    setSynthesisProgress("Synthesizing Bespoke Sovereign Solution Dossier...");

    await new Promise(r => setTimeout(r, 500));
    setIsSynthesizing(false);
  };

  const handleLaunchRealOAuthWindow = (provider: "github" | "jira" | "slack") => {
    if (typeof window === "undefined") return;
    
    if (provider === "github") {
      const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/callback/github`);
      const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo,read:org,user:email&redirect_uri=${redirectUri}`;
      window.open(url, "github-oauth", "width=600,height=720");
    } else if (provider === "jira") {
      const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/callback/atlassian`);
      const state = `causarix_atlassian_${Date.now()}`;
      const url = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${ATLASSIAN_CLIENT_ID}&scope=read%3Ajira-work%20read%3Ajira-user%20manage%3Ajira-configuration%20write%3Ajira-work&redirect_uri=${redirectUri}&state=${state}&response_type=code&prompt=consent`;
      window.open(url, "atlassian-oauth", "width=600,height=720");
    } else if (provider === "slack") {
      const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/callback/slack`);
      const state = `causarix_slack_${Date.now()}`;
      const url = `https://slack.com/oauth/v2/authorize?client_id=${SLACK_CLIENT_ID}&scope=chat:write,channels:read,groups:read,im:write,incoming-webhook&redirect_uri=${redirectUri}&state=${state}`;
      window.open(url, "slack-oauth", "width=600,height=720");
    }
  };

  const handleFinishOnboarding = () => {
    localStorage.setItem("causarix_onboarding_completed", "true");
    localStorage.setItem("causarix_user_persona", JSON.stringify({
      role: selectedRole,
      answers,
      connectedIntegrations,
      completedAt: new Date().toISOString()
    }));
    setIsOpen(false);
  };

  // Helper to get questions for current role
  const currentQuestions = ROLE_DIAGNOSTICS[selectedRole];
  const roleConfig = EXECUTIVE_ROLES.find(r => r.id === selectedRole) || EXECUTIVE_ROLES[0];

  // Helper to extract chosen answer labels for synthesis display
  const getAnswerText = (qIndex: number, answerId?: string) => {
    if (!answerId) return "Standard Corporate Governance Protocol";
    const q = currentQuestions[qIndex];
    const option = q?.options.find(o => o.id === answerId);
    return option ? option.label : answerId;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-4xl bg-[#090d16] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative my-auto"
      >
        {/* Top Progress Bar & Header */}
        <div className="p-6 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-sm shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-widest">
                  EXECUTIVE CALIBRATION
                </span>
                <span className="text-xs text-slate-400 font-mono font-bold">
                  {currentStep === "role" && "STAGE 1/6 · SELECT EXECUTIVE SEAT"}
                  {currentStep === "q1" && "STAGE 2/6 · STRATEGIC HORIZON"}
                  {currentStep === "q2" && "STAGE 3/6 · CORPORATE BLIND SPOT"}
                  {currentStep === "q3" && "STAGE 4/6 · HIGHEST-STAKES DECISION"}
                  {currentStep === "q4" && "STAGE 5/6 · BOARDROOM INTENSITY"}
                  {currentStep === "synthesis" && "FINAL STAGE · BESPOKE SOVEREIGN DOSSIER"}
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-white mt-0.5">
                Causarix Sovereign Executive Intelligence Calibration
              </h3>
            </div>
          </div>

          {/* Progress Indicator Pills */}
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs">
            {["role", "q1", "q2", "q3", "q4", "synthesis"].map((s, idx) => (
              <span
                key={s}
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                  currentStep === s 
                    ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/30 font-black scale-105" 
                    : "bg-slate-900 text-slate-500 border border-slate-800"
                )}
              >
                {idx + 1}
              </span>
            ))}
          </div>
        </div>

        {/* ─── STAGE 1: EXECUTIVE ROLE SELECTION ─────────────────────────── */}
        {currentStep === "role" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                What is your executive seat?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
                Causarix calibrates its 10-Agent Boardroom Quorum, deterministic Python WASM sandboxes, and Delaware DGCL contract redlining around your specific corporate responsibilities.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {EXECUTIVE_ROLES.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;

                return (
                  <div
                    key={role.id}
                    onClick={() => handleSelectRole(role.id)}
                    className={cn(
                      "p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 group hover:border-emerald-500/60 hover:bg-slate-900/80 bg-slate-950/40 border-slate-800/80 shadow-sm",
                      isSelected && "border-emerald-500 bg-emerald-950/20 ring-2 ring-emerald-500/20 shadow-emerald-900/20 shadow-lg"
                    )}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                          {role.badge}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                        {role.title}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {role.subtitle}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs font-mono font-bold text-emerald-400">
                      <span>Calibrate Role</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── STAGE 2–5: DEEP DIAGNOSTIC QUESTIONS (Q1–Q4) ──────────────── */}
        {(currentStep === "q1" || currentStep === "q2" || currentStep === "q3" || currentStep === "q4") && (
          <div className="p-6 sm:p-8 space-y-6">
            {(() => {
              const qIndex = currentStep === "q1" ? 0 : currentStep === "q2" ? 1 : currentStep === "q3" ? 2 : 3;
              const qData = currentQuestions[qIndex];
              const qKey = currentStep as "q1" | "q2" | "q3" | "q4";
              const selectedVal = answers[qKey];

              return (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                      <span>{roleConfig.title} · QUESTION {qData.questionNumber}/4</span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                      {qData.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {qData.subtitle}
                    </p>
                  </div>

                  <div className="space-y-3 pt-1">
                    {qData.options.map((opt) => {
                      const isChosen = selectedVal === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleSelectAnswer(qKey, opt.id)}
                          className={cn(
                            "p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 group hover:border-emerald-500/80 bg-slate-950/50 border-slate-800",
                            isChosen && "bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20"
                          )}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                                {opt.label}
                              </h4>
                              {opt.highlight && (
                                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                  {opt.highlight}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              {opt.sublabel}
                            </p>
                          </div>

                          <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                            isChosen 
                              ? "border-emerald-500 bg-emerald-500 text-black" 
                              : "border-slate-700 group-hover:border-emerald-500/50"
                          )}>
                            {isChosen && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-800/80">
                    <button
                      onClick={() => {
                        if (currentStep === "q1") setCurrentStep("role");
                        else if (currentStep === "q2") setCurrentStep("q1");
                        else if (currentStep === "q3") setCurrentStep("q2");
                        else if (currentStep === "q4") setCurrentStep("q3");
                      }}
                      className="font-mono text-xs font-bold text-slate-400 hover:text-white transition-colors"
                    >
                      ← Back
                    </button>
                    <span className="text-[11px] font-mono text-slate-500">
                      Step {qIndex + 2} of 6
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* ─── FINAL STAGE: BESPOKE CAUSARIX SOLUTION DOSSIER ───────────── */}
        {currentStep === "synthesis" && (
          <div className="p-6 sm:p-8 space-y-6">
            {isSynthesizing ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto animate-spin">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white">
                  Synthesizing Fiduciary Solution Dossier
                </h3>
                <p className="font-mono text-xs text-emerald-400 animate-pulse">
                  {synthesisProgress}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header Banner */}
                <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        DIAGNOSIS COMPLETE
                      </span>
                      <span className="font-mono text-xs text-slate-400 font-bold">
                        {roleConfig.title}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-white">
                      Here is exactly how Causarix Sovereign OS solves your executive challenges:
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                </div>

                {/* 3 Tailored Solution Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                  
                  {/* Pillar 1: Strategic Bet Alignment */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <span>🎯 1. STRATEGIC MISSION</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Your selected priority: <strong className="text-white block mt-0.5">{getAnswerText(0, answers.q1)}</strong>
                    </p>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-slate-300">
                      <strong>Causarix Solution:</strong> Configures your 10-Agent Boardroom Quorum to stress-test this exact thesis with 100% SHA-256 evidentiary grounding.
                    </div>
                  </div>

                  {/* Pillar 2: Blind Spot Interception */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-amber-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                      <span>⚠️ 2. BLIND SPOT DEFENSE</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Your identified risk: <strong className="text-white block mt-0.5">{getAnswerText(1, answers.q2)}</strong>
                    </p>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-slate-300">
                      <strong>Causarix Solution:</strong> Enforces KùzuDB sub-1ms causal graph traversals and Delaware DGCL § 141 redlines to intercept contract traps in 60 seconds.
                    </div>
                  </div>

                  {/* Pillar 3: High-Stakes Decision Modeling */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold">
                      <span>📈 3. DETERMINISTIC WASM MATH</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Your target decision: <strong className="text-white block mt-0.5">{getAnswerText(2, answers.q3)}</strong>
                    </p>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-slate-300">
                      <strong>Causarix Solution:</strong> Executes isolated Pyodide WebAssembly sandboxes for 0% math drift and $42M clean-room rewrite valuation modeling.
                    </div>
                  </div>
                </div>

                {/* 1-Click OAuth Connectors Section */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-white flex items-center gap-2">
                      <span>🔗 Connect Your Toolchain (1-Click OAuth 2.0):</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">NO API KEYS REQUIRED</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => handleLaunchRealOAuthWindow("github")}
                      className={cn(
                        "p-3 rounded-xl border font-mono text-xs font-bold flex items-center justify-between transition-all cursor-pointer",
                        connectedIntegrations.github 
                          ? "bg-emerald-950/40 border-emerald-500 text-emerald-400" 
                          : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span>🐙</span>
                        <span>GitHub Repo</span>
                      </span>
                      <span>{connectedIntegrations.github ? "✓ Connected" : "Connect ↗"}</span>
                    </button>

                    <button
                      onClick={() => handleLaunchRealOAuthWindow("jira")}
                      className={cn(
                        "p-3 rounded-xl border font-mono text-xs font-bold flex items-center justify-between transition-all cursor-pointer",
                        connectedIntegrations.jira 
                          ? "bg-emerald-950/40 border-emerald-500 text-emerald-400" 
                          : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span>🎫</span>
                        <span>Jira Cloud</span>
                      </span>
                      <span>{connectedIntegrations.jira ? "✓ Connected" : "Connect ↗"}</span>
                    </button>

                    <button
                      onClick={() => handleLaunchRealOAuthWindow("slack")}
                      className={cn(
                        "p-3 rounded-xl border font-mono text-xs font-bold flex items-center justify-between transition-all cursor-pointer",
                        connectedIntegrations.slack 
                          ? "bg-emerald-950/40 border-emerald-500 text-emerald-400" 
                          : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span>💬</span>
                        <span>Slack Bot</span>
                      </span>
                      <span>{connectedIntegrations.slack ? "✓ Connected" : "Connect ↗"}</span>
                    </button>
                  </div>
                </div>

                {/* Final Action Unlock Button */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <span className="text-xs font-mono text-slate-400">
                    🛡️ Fiduciary calibration active. Zero public model training guaranteed.
                  </span>
                  <Button
                    onClick={handleFinishOnboarding}
                    className="w-full sm:w-auto font-mono text-xs font-bold py-4 px-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-xl shrink-0 gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Enter Calibrated Workspace</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default AdaptiveEnterpriseOnboardingModal;
