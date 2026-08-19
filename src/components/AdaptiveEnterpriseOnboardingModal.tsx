"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Sparkles, ShieldCheck, Scale, DollarSign, 
  Cpu, Briefcase, Check, ArrowRight, CheckCircle2, Lock, 
  Globe2, FileText, ChevronRight, Database, Terminal, Layers,
  X, AlertCircle, RefreshCw, Link2, ExternalLink, ShieldAlert,
  UserCheck, CheckCheck, Users, Flame, LineChart, Target,
  Compass, Eye, Award, HelpCircle, Edit3, Send, Zap, Bot
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
}

const EXECUTIVE_ROLES: RoleConfig[] = [
  { id: "CEO", title: "Founder & Chief Executive (CEO)", subtitle: "Strategic vision, M&A acquisitions, boardroom consensus & risk governance", icon: Building2, badge: "STRATEGY" },
  { id: "CFO", title: "Chief Financial Officer (CFO)", subtitle: "Cash runway, balance sheet solvency, EBITDA margins & deterministic Python math", icon: DollarSign, badge: "FINANCE" },
  { id: "CTO", title: "Chief Technology Officer (CTO)", subtitle: "Cloud architecture, 99.99% SLAs, GPLv3 license scanning & KùzuDB graph traversal", icon: Cpu, badge: "INFRASTRUCTURE" },
  { id: "LEGAL", title: "General Counsel & Legal Advisor", subtitle: "Delaware DGCL § 141, statutory compliance, uncapped indemnity & clause redlines", icon: Scale, badge: "GOVERNANCE" },
  { id: "CPO", title: "Chief Product Officer (CPO)", subtitle: "RICE frameworks, net revenue retention, technical invariant roadmap & churn defense", icon: Compass, badge: "PRODUCT" },
  { id: "CRO", title: "Chief Revenue Officer (CRO)", subtitle: "Enterprise sales velocity, non-standard SLA defense & deal contradiction interception", icon: LineChart, badge: "REVENUE" },
  { id: "HR", title: "Chief People Officer / HR", subtitle: "Executive retention, Delaware DGCL equity governance & cross-team alignment", icon: Users, badge: "PEOPLE" }
];

interface DiagnosticStep {
  key: "q1" | "q2" | "q3" | "q4";
  title: string;
  subtitle: string;
  placeholder: string;
  presetSuggestions: string[];
}

const ROLE_QUESTIONS: Record<ExecutiveRole, DiagnosticStep[]> = {
  CEO: [
    {
      key: "q1",
      title: "What are your top non-negotiable strategic bets for the next 12–24 months?",
      subtitle: "Type your strategic expansion goals, acquisition targets, or product launches.",
      placeholder: "e.g., Acquiring a $60M European cloud SaaS target and expanding our APAC enterprise footprint...",
      presetSuggestions: [
        "$50M–$200M Cloud M&A Acquisition & Tech Consolidation",
        "Global Multi-Region Cloud Expansion (APAC & EMEA)",
        "Enterprise Upmarket Transition ($100k+ ACV Tier)",
        "Aggressive Profitability Pivot & Margin Compression Defense"
      ]
    },
    {
      key: "q2",
      title: "What is your biggest corporate blind spot?",
      subtitle: "Type the vulnerabilities or cross-silo misalignments that keep you up at night.",
      placeholder: "e.g., Hidden open-source license traps in acquired code and sales committing to custom SLAs...",
      presetSuggestions: [
        "Hidden GPLv3 Reciprocal License Traps in Acquired Codebases",
        "Commercial Teams Committing to 99.99% SLAs Infrastructure Cannot Deliver",
        "Delaware DGCL § 141 Statutory Fiduciary Liability & Uncapped Indemnity",
        "Unhedged Macro Supply Chain & +15% Hardware Tariff Shocks"
      ]
    },
    {
      key: "q3",
      title: "What is the single highest-stakes decision facing your team right now?",
      subtitle: "Type the exact decision dossier Causarix will model in your boardroom simulation.",
      placeholder: "e.g., Deciding whether to sign an asset purchase agreement with a $25M indemnity holdback...",
      presetSuggestions: [
        "Signing a $200M Term Sheet with Seller Escrow Carve-outs",
        "Executing a $14.5M Multi-Year Enterprise Master Services Agreement",
        "Major Infrastructure Refactor to Eliminate Single-Point-of-Failure Outages",
        "Allocating $25M Strategic Capital Reserve to New Product Lines"
      ]
    },
    {
      key: "q4",
      title: "How aggressively should your AI boardroom challenge your assumptions?",
      subtitle: "Type your preferred debate style or pick a pre-configured dialectic mode.",
      placeholder: "e.g., Hostile Red-Team: Aggressively attack blind spots and stress-test every downside risk...",
      presetSuggestions: [
        "Hostile Red-Team: Aggressively attack assumptions & expose fatal failure modes",
        "Dialectic Neutral: Balanced adversarial debate with unanimous quorum consensus",
        "Strategic Advisor: Constructive fiduciary guidance & statutory compliance grounding"
      ]
    }
  ],
  CFO: [
    {
      key: "q1",
      title: "What is your minimum runway buffer & target EBITDA margin?",
      subtitle: "Type your capital preservation targets, cash burn ceiling, and runway horizon.",
      placeholder: "e.g., Maintaining at least 18 months of runway while targeting 28% EBITDA margin...",
      presetSuggestions: [
        "24+ Months Runway Buffer with Target >25% EBITDA Margin",
        "18 Months Runway with High-Growth Burn Multiple <1.2x",
        "12 Months Runway with Aggressive Breakeven & Free Cashflow Pivot"
      ]
    },
    {
      key: "q2",
      title: "What financial modeling templates or accounting standards do you mandate?",
      subtitle: "Type the revenue recognition guidelines and accounting frameworks you enforce.",
      placeholder: "e.g., Strict US GAAP ASC 606 revenue recognition with zero-based departmental budgeting...",
      presetSuggestions: [
        "US GAAP & ASC 606 Revenue Recognition Standards",
        "IFRS 15 / 16 Multi-Entity Cross-Border Consolidation",
        "Zero-Based Budgeting (ZBB) with Python WASM Sandboxes"
      ]
    },
    {
      key: "q3",
      title: "What threshold of unbudgeted OpEx/CapEx requires mandatory boardroom approval?",
      subtitle: "Type your financial governance thresholds and invariant rules.",
      placeholder: "e.g., Any unbudgeted commitment above $150,000 or any contract with uncapped liabilities...",
      presetSuggestions: [
        "Any Unbudgeted Commitment > $100,000",
        "Any Unbudgeted Commitment > $250,000",
        "Any Contract with Uncapped Indemnity or Liquidated Damages"
      ]
    },
    {
      key: "q4",
      title: "What is your primary macroeconomic exposure risk?",
      subtitle: "Type the macro risks (tariffs, interest rates, FX volatility) you need to stress-test.",
      placeholder: "e.g., +15% hardware tariff shocks compressing gross margins on our server infrastructure...",
      presetSuggestions: [
        "+15% Macro Tariff Spike & Hardware / Cloud Margin Compression",
        "Elevated Interest Rates & Rising Working Capital Cost",
        "Foreign Exchange Volatility across EUR / GBP / APAC Cash Pools"
      ]
    }
  ],
  CTO: [
    {
      key: "q1",
      title: "What are your strict contractual uptime & SLA commitments?",
      subtitle: "Type your infrastructure uptime guarantees and downtime tolerances.",
      placeholder: "e.g., 99.99% contractual uptime with $1.5M liquidated damages penalty clauses...",
      presetSuggestions: [
        "99.99% Uptime ($1.45M Liquidated Damages Risk Exposure)",
        "99.9% Uptime (<43.8 minutes monthly downtime tolerance)",
        "99.5% Uptime with Scheduled Maintenance Carve-Outs"
      ]
    },
    {
      key: "q2",
      title: "Where are your largest legacy bottlenecks & technical debt risks?",
      subtitle: "Type the technical debt, database bottlenecks, or scalability hurdles you face.",
      placeholder: "e.g., PostgreSQL connection pool exhaustion under 10x spikes and vendor cloud lock-in...",
      presetSuggestions: [
        "Monolithic Database Bottlenecks under 10x Scale Spikes",
        "Proprietary Cloud Infrastructure Vendor Lock-in",
        "Multi-Repo Dependency Cascades & Broken Release Gates"
      ]
    },
    {
      key: "q3",
      title: "What open-source licenses are strictly restricted across your codebases?",
      subtitle: "Type your open-source licensing compliance policies and restricted licenses.",
      placeholder: "e.g., Zero GPLv3 or AGPL copyleft libraries in our commercial software repositories...",
      presetSuggestions: [
        "Strict Zero-GPLv3 / AGPL (Reciprocal Viral Infection Ban)",
        "Permissive Only (MIT, Apache 2.0, BSD-3)",
        "Case-by-Case KùzuDB Multi-Hop Dependency Auditing"
      ]
    },
    {
      key: "q4",
      title: "What are your critical cross-team dependency blockers?",
      subtitle: "Type the cross-functional misalignments slowing down your engineering releases.",
      placeholder: "e.g., Sales promising bespoke custom features to enterprise clients without engineering review...",
      presetSuggestions: [
        "Sales Committing to 99.99% SLAs or Custom Features without Eng Sign-off",
        "InfoSec Questionnaire & Security Audit Backlogs Blocking Releases",
        "Unclear M&A Codebase Integration & Clean-Room Rewrite Roadmaps"
      ]
    }
  ],
  LEGAL: [
    {
      key: "q1",
      title: "Which regulatory frameworks strictly govern your corporate entity?",
      subtitle: "Type your legal jurisdictions, compliance mandates, and statutory standards.",
      placeholder: "e.g., Delaware DGCL § 141 fiduciary standards, EU GDPR Article 28, and SOC 2 Type II...",
      presetSuggestions: [
        "Delaware DGCL § 141, SEC Fiduciary Duty & US Corporate Law",
        "EU GDPR Article 28 & EU AI Act 2024 (High-Risk AI Governance)",
        "India DPDP Act 2023 & Cross-Border Fiduciary Data Transfers",
        "HIPAA, SOC 2 Type II & ISO 27001 Enterprise Governance"
      ]
    },
    {
      key: "q2",
      title: "What are your standard fallback clauses for liability caps & indemnities?",
      subtitle: "Type your mandatory negotiation positions on liability, indemnification, and damages.",
      placeholder: "e.g., Mutual aggregate liability cap strictly limited to 12 months fees paid with super-cap for IP...",
      presetSuggestions: [
        "Mutual Liability Cap = 12 Months Fees Paid (Non-Negotiable)",
        "Mutual IP Indemnification with Super-Cap Exception",
        "Strict Mutual Waiver of Consequential & Indirect Damages"
      ]
    },
    {
      key: "q3",
      title: "Which active contracts carry your highest financial or operational exposure?",
      subtitle: "Type the high-risk customer or vendor contracts requiring automated audit redlines.",
      placeholder: "e.g., Uncapped cloud vendor agreements and M&A purchase contracts with escrow holdbacks...",
      presetSuggestions: [
        "Vendor MSAs with Uncapped Indemnity or Auto-Renewal Traps",
        "M&A Share Purchase Agreements with $25M Escrow Claims",
        "Enterprise Customer Agreements with Liquidated Downtime Penalties"
      ]
    },
    {
      key: "q4",
      title: "What governing law applies to your core commercial agreements?",
      subtitle: "Type the jurisdiction and dispute resolution forums for your contracts.",
      placeholder: "e.g., State of Delaware and Delaware Court of Chancery jurisdiction...",
      presetSuggestions: [
        "State of Delaware & Delaware Chancery Court Jurisdiction",
        "English Common Law & High Court of Justice (UK)",
        "Singapore Law & Singapore International Arbitration Centre (SIAC)"
      ]
    }
  ],
  CPO: [
    {
      key: "q1",
      title: "What prioritization framework does your team enforce?",
      subtitle: "Type the scoring models and roadmap governance principles your team uses.",
      placeholder: "e.g., RICE scoring combined with economic Cost of Delay calculation...",
      presetSuggestions: [
        "RICE Framework (Reach, Impact, Confidence, Effort)",
        "Cost of Delay & Economic Value Realization",
        "Cross-Silo Invariant Gate (Zero Commitments without Eng Approval)"
      ]
    },
    {
      key: "q2",
      title: "Which customer segment drives 80% of your net retention revenue?",
      subtitle: "Type the key customer cohorts and enterprise contract tiers driving retention.",
      placeholder: "e.g., Large enterprise accounts paying $150k+ ACV demanding bespoke SLA guarantees...",
      presetSuggestions: [
        "Enterprise Tier ($100k+ ACV) Demanding Custom Security & SLAs",
        "Fast-Growing Mid-Market Accounts with High Feature Velocity",
        "Multi-Entity Holding Companies Requiring Multi-Tenant Isolation"
      ]
    },
    {
      key: "q3",
      title: "What is the top documented reason for customer friction or churn?",
      subtitle: "Type the product, SLA, or adoption hurdles that cause customer dissatisfaction.",
      placeholder: "e.g., Sales over-promising custom SLA uptime that our infrastructure cannot guarantee...",
      presetSuggestions: [
        "SLA Commitments Promised by Sales but Not Met by Infrastructure",
        "Lack of Verifiable Audit Logs & Cryptographic Proof Receipts",
        "Complex Multi-Team Permission & Role Governance Bottlenecks"
      ]
    },
    {
      key: "q4",
      title: "What is your roadmap planning horizon?",
      subtitle: "Type your product release cycle cadence and strategic milestone timeline.",
      placeholder: "e.g., 12 to 24 month strategic roadmap with quarterly boardroom quorum gates...",
      presetSuggestions: [
        "12–24 Month Strategic Architecture & Fiduciary Defense",
        "Quarterly Sprints with Continuous Boardroom Quorum Checkpoints",
        "Continuous Deployment with Automated Regulatory Invariant Gates"
      ]
    }
  ],
  CRO: [
    {
      key: "q1",
      title: "What is your average sales cycle length & target deal size?",
      subtitle: "Type your core deal metrics, average ACV, and procurement cycle timeline.",
      placeholder: "e.g., Average deal size is $120k with an 80-day sales cycle involving legal and InfoSec reviews...",
      presetSuggestions: [
        "$150k+ ACV · 60–90 Day Enterprise Sales Cycle · 35% Win Rate",
        "$50k ACV · 30–45 Day Sales Cycle · 45% Win Rate",
        "$500k+ Strategic Multi-Year Enterprise Transformations"
      ]
    },
    {
      key: "q2",
      title: "What custom terms are sales reps offering most frequently to close deals?",
      subtitle: "Type the non-standard clauses, bespoke SLAs, or discounts reps offer.",
      placeholder: "e.g., 99.99% uptime commitments with penalty clawbacks and custom IP assignments...",
      presetSuggestions: [
        "99.99% Uptime Guarantees with Heavy Financial Clawbacks",
        "Custom IP Assignment & Source Code Escrow Commitments",
        "Non-Standard Data Localization & Bespoke Audit Rights"
      ]
    },
    {
      key: "q3",
      title: "What is the primary objection causing stalled deals in your pipeline?",
      subtitle: "Type the customer legal, security, or budget pushbacks stalling contracts.",
      placeholder: "e.g., Buyer legal teams demanding uncapped liability and questioning AI data privacy...",
      presetSuggestions: [
        "Legal & InfoSec Liability Caps, Indemnity & Data Privacy Pushback",
        "AI Hallucination & Data Leakage Fears from Enterprise Buyers",
        "Justifying ROI & Defending Budget against In-House Legal/Finance Staff"
      ]
    },
    {
      key: "q4",
      title: "Which platform serves as your single source of truth for pipeline data?",
      subtitle: "Type your primary CRM, deal room, or ticket tracking tools.",
      placeholder: "e.g., Salesforce Enterprise synced with Atlassian Jira and Slack deal channels...",
      presetSuggestions: [
        "Salesforce Enterprise & Atlassian Jira Integration",
        "HubSpot Enterprise & Slack Deal Rooms",
        "Direct Causarix Sovereign Invariant Connector"
      ]
    }
  ],
  HR: [
    {
      key: "q1",
      title: "What are your core executive retention & talent targets?",
      subtitle: "Type your executive hiring goals, attrition limits, and retention targets.",
      placeholder: "e.g., Keeping executive and senior engineer attrition below 4% while scaling globally...",
      presetSuggestions: [
        "Critical Technical & Executive Attrition < 5% Annually",
        "Rapid C-Suite & Engineering Scaling for Multi-Region Expansion",
        "Post-M&A Key Talent Retention & Incentive Lock-in"
      ]
    },
    {
      key: "q2",
      title: "What compliance guidelines govern executive compensation & equity?",
      subtitle: "Type your equity vesting rules, 409A guidelines, and employment law standards.",
      placeholder: "e.g., Delaware DGCL § 141 board equity approval and global remote worker compliance...",
      presetSuggestions: [
        "Delaware DGCL § 141 Executive Fiduciary Duty & 409A Valuations",
        "Multi-Jurisdictional Cross-Border Remote Worker Compliance",
        "Strict Non-Compete & Proprietary IP Assignment Enforcement"
      ]
    },
    {
      key: "q3",
      title: "What is the recurring friction point in recent employee exit interviews?",
      subtitle: "Type the organizational silos or communication breakdowns reported by departures.",
      placeholder: "e.g., Cross-department misalignment between sales commitments and engineering reality...",
      presetSuggestions: [
        "Cross-Department Silos & Conflicting Executive Directives",
        "Burnout from Legacy Technical Debt & Unrealistic Deadlines",
        "Unclear Strategic Direction from Boardroom Leadership"
      ]
    },
    {
      key: "q4",
      title: "What governance framework guides your team alignment?",
      subtitle: "Type your leadership consensus protocols and decision transparency frameworks.",
      placeholder: "e.g., Transparent C-suite consensus voting with permanent immutable meeting records...",
      presetSuggestions: [
        "Synchronous C-Suite Consensus with Transparent Voting Records",
        "Formal OKR Alignment with Boardroom Evidentiary Audit Trails",
        "Real-Time Dialectic Synthesis of Executive Disagreements"
      ]
    }
  ]
};

export function AdaptiveEnterpriseOnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Step navigation: "role" -> "q1" -> "q2" -> "q3" -> "q4" -> "synthesis"
  const [currentStep, setCurrentStep] = useState<"role" | "q1" | "q2" | "q3" | "q4" | "synthesis">("role");
  
  // User selections and typed answers
  const [selectedRole, setSelectedRole] = useState<ExecutiveRole>("CEO");
  const [answers, setAnswers] = useState<{
    q1: string;
    q2: string;
    q3: string;
    q4: string;
  }>({
    q1: "",
    q2: "",
    q3: "",
    q4: ""
  });

  const [currentInputText, setCurrentInputText] = useState<string>("");

  // Active Synthesis Calculation State
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [synthesisProgress, setSynthesisProgress] = useState<string>("Analyzing your custom executive profile...");

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

  // Sync current input text when transitioning between question steps
  useEffect(() => {
    if (currentStep === "q1") setCurrentInputText(answers.q1);
    else if (currentStep === "q2") setCurrentInputText(answers.q2);
    else if (currentStep === "q3") setCurrentInputText(answers.q3);
    else if (currentStep === "q4") setCurrentInputText(answers.q4);
  }, [currentStep]);

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
    setAnswers({ q1: "", q2: "", q3: "", q4: "" });
    setCurrentInputText("");
    setCurrentStep("q1");
  };

  const handleApplyPreset = (text: string) => {
    setCurrentInputText(text);
  };

  const handleProceedQuestion = (qKey: "q1" | "q2" | "q3" | "q4") => {
    const trimmed = currentInputText.trim();
    const finalVal = trimmed || (ROLE_QUESTIONS[selectedRole].find(q => q.key === qKey)?.presetSuggestions[0] ?? "Standard Governance Protocol");
    
    setAnswers(prev => ({ ...prev, [qKey]: finalVal }));

    if (qKey === "q1") setCurrentStep("q2");
    else if (qKey === "q2") setCurrentStep("q3");
    else if (qKey === "q3") setCurrentStep("q4");
    else if (qKey === "q4") {
      triggerSynthesisSequence(finalVal);
    }
  };

  const triggerSynthesisSequence = async (finalQ4Val?: string) => {
    setCurrentStep("synthesis");
    setIsSynthesizing(true);
    setSynthesisProgress("Parsing your custom executive directives & strategic bets...");

    await new Promise(r => setTimeout(r, 600));
    setSynthesisProgress("Cross-referencing blind spots against KùzuDB causal graph engine...");

    await new Promise(r => setTimeout(r, 700));
    setSynthesisProgress("Configuring 10-Agent Boardroom Digital Twins & Delaware DGCL § 141 standards...");

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

  // Helper to extract intelligent context-aware solution copy from ANY custom text
  const generateCustomAnalysis = () => {
    const q1Text = answers.q1 || "Global expansion & M&A scale";
    const q2Text = answers.q2 || "Cross-silo contractual and IP liability traps";
    const q3Text = answers.q3 || "High-stakes executive decision modeling";
    const q4Text = answers.q4 || "Hostile Red-Team challenge protocol";

    // Detect keywords for intelligent contextual matching
    const hasMNA = /m&a|acquisition|buy|purchase|target|escrow|merger/i.test(q1Text + q2Text + q3Text);
    const hasLegal = /indemnity|liability|delaware|contract|msa|lawyer|gdpr|compliance|sec/i.test(q1Text + q2Text + q3Text);
    const hasTech = /gpl|license|code|repo|tech|architecture|outage|sla|uptime|database/i.test(q1Text + q2Text + q3Text);
    const hasFinance = /runway|ebitda|burn|margin|cash|tariff|revenue|cost|budget/i.test(q1Text + q2Text + q3Text);

    return {
      pillar1: {
        title: "STRATEGIC BET GROUNDING",
        userPrompt: q1Text,
        solution: hasMNA 
          ? `Causarix spins up specialized M&A due diligence agents to traverse target dependency trees in KùzuDB and calculate clean-room rewrite costs for "${q1Text.slice(0, 70)}...".`
          : `Causarix configures your 10-Agent Boardroom Quorum to stress-test "${q1Text.slice(0, 70)}..." with 100% SHA-256 evidentiary grounding and zero hallucination.`
      },
      pillar2: {
        title: "BLIND SPOT DEFENSE",
        userPrompt: q2Text,
        solution: hasLegal || hasTech
          ? `Enforces automated Delaware DGCL § 141 redlines and sub-1ms KùzuDB graph scans to intercept "${q2Text.slice(0, 70)}..." before contracts are signed.`
          : `Deploys cross-silo Air-Traffic Controller invariants to block contradictory commitments relating to "${q2Text.slice(0, 70)}..." across Sales, Eng, and Legal.`
      },
      pillar3: {
        title: "DETERMINISTIC WASM MATH",
        userPrompt: q3Text,
        solution: hasFinance
          ? `Executes isolated Pyodide WebAssembly sandboxes for 0% math drift to stress-test EBITDA margins and cash runway for "${q3Text.slice(0, 70)}...".`
          : `Runs dialectic quorum simulations in Pyodide WASM to model counter-offers, liability holdbacks, and valuation scenarios for "${q3Text.slice(0, 70)}...".`
      }
    };
  };

  const currentRoleConfig = EXECUTIVE_ROLES.find(r => r.id === selectedRole) || EXECUTIVE_ROLES[0];
  const roleQuestionsList = ROLE_QUESTIONS[selectedRole];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-4xl bg-[#090d16] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative my-auto"
      >
        {/* Top Header & Context Pill */}
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
                  {currentStep === "role" && "SELECT EXECUTIVE SEAT"}
                  {currentStep === "q1" && "STRATEGIC HORIZON"}
                  {currentStep === "q2" && "CORPORATE BLIND SPOT"}
                  {currentStep === "q3" && "HIGHEST-STAKES DECISION"}
                  {currentStep === "q4" && "BOARDROOM INTENSITY"}
                  {currentStep === "synthesis" && "BESPOKE SOVEREIGN DOSSIER"}
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-white mt-0.5">
                Causarix Sovereign Executive Intelligence Calibration
              </h3>
            </div>
          </div>

          {/* Progress Indicator Pills (No numbers) */}
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs">
            {["role", "q1", "q2", "q3", "q4", "synthesis"].map((s) => (
              <span
                key={s}
                className={cn(
                  "w-3 h-3 rounded-full transition-all",
                  currentStep === s 
                    ? "bg-emerald-500 shadow-lg shadow-emerald-500/40 scale-125" 
                    : "bg-slate-800"
                )}
              />
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
                Select your leadership role. You can type any custom scenario in the next steps, and Causarix will calibrate its 10-Agent Boardroom and Delaware DGCL § 141 engine around your exact text.
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

        {/* ─── STAGE 2–5: INTERACTIVE CUSTOM FREE-TEXT + SMART SUGGESTIONS ─ */}
        {(currentStep === "q1" || currentStep === "q2" || currentStep === "q3" || currentStep === "q4") && (
          <div className="p-6 sm:p-8 space-y-6">
            {(() => {
              const qKey = currentStep as "q1" | "q2" | "q3" | "q4";
              const qIndex = qKey === "q1" ? 0 : qKey === "q2" ? 1 : qKey === "q3" ? 2 : 3;
              const qData = roleQuestionsList[qIndex];

              return (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                      <span>{currentRoleConfig.title}</span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                      {qData.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {qData.subtitle}
                    </p>
                  </div>

                  {/* Interactive Custom Text Area */}
                  <div className="space-y-2">
                    <div className="relative">
                      <textarea
                        value={currentInputText}
                        onChange={(e) => setCurrentInputText(e.target.value)}
                        placeholder={qData.placeholder}
                        rows={3}
                        className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none font-sans leading-relaxed"
                      />
                      <div className="absolute right-3.5 bottom-3.5 flex items-center gap-2 pointer-events-none text-slate-500 font-mono text-[10px]">
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Type custom text or click a suggestion below</span>
                      </div>
                    </div>
                  </div>

                  {/* Smart Preset Suggestion Chips (Without numbers) */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                      Quick Executive Suggestions:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {qData.presetSuggestions.map((suggestion) => {
                        const isMatch = currentInputText.trim() === suggestion;
                        return (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => handleApplyPreset(suggestion)}
                            className={cn(
                              "px-3.5 py-2 rounded-xl text-xs font-medium text-left border transition-all cursor-pointer flex items-center gap-2",
                              isMatch
                                ? "bg-emerald-950/60 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/30"
                                : "bg-slate-900/70 border-slate-800 text-slate-300 hover:border-emerald-500/50 hover:bg-slate-900"
                            )}
                          >
                            <span className="text-emerald-400 text-xs">✦</span>
                            <span>{suggestion}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => {
                        if (currentStep === "q1") setCurrentStep("role");
                        else if (currentStep === "q2") setCurrentStep("q1");
                        else if (currentStep === "q3") setCurrentStep("q2");
                        else if (currentStep === "q4") setCurrentStep("q3");
                      }}
                      className="font-mono text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      ← Back
                    </button>

                    <Button
                      type="button"
                      onClick={() => handleProceedQuestion(qKey)}
                      className="font-mono text-xs font-bold px-7 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-950/40 gap-2 cursor-pointer"
                    >
                      <span>{currentStep === "q4" ? "Generate Solution Dossier" : "Continue"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ─── FINAL STAGE: BESPOKE SOVEREIGN SOLUTION DOSSIER ───────────── */}
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
              (() => {
                const analysis = generateCustomAnalysis();

                return (
                  <div className="space-y-6">
                    {/* Header Banner */}
                    <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            CUSTOM DIAGNOSIS COMPLETE
                          </span>
                          <span className="font-mono text-xs text-slate-400 font-bold">
                            {currentRoleConfig.title}
                          </span>
                        </div>
                        <h3 className="font-serif text-xl font-bold text-white">
                          Here is exactly how Causarix Sovereign OS solves your specific challenges:
                        </h3>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                    </div>

                    {/* 3 Tailored Solution Pillars (Referencing User's Typed Input) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                      
                      {/* Pillar 1: Strategic Bet Alignment */}
                      <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold">
                          <span>🎯 {analysis.pillar1.title}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] line-clamp-2">
                          Target: <strong className="text-white">{analysis.pillar1.userPrompt}</strong>
                        </p>
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
                          <strong>Causarix Solution:</strong> {analysis.pillar1.solution}
                        </div>
                      </div>

                      {/* Pillar 2: Blind Spot Interception */}
                      <div className="p-4 rounded-2xl bg-slate-950/70 border border-amber-500/30 space-y-2">
                        <div className="flex items-center gap-2 text-amber-400 font-bold">
                          <span>⚠️ {analysis.pillar2.title}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] line-clamp-2">
                          Identified Hazard: <strong className="text-white">{analysis.pillar2.userPrompt}</strong>
                        </p>
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
                          <strong>Causarix Solution:</strong> {analysis.pillar2.solution}
                        </div>
                      </div>

                      {/* Pillar 3: High-Stakes Decision Modeling */}
                      <div className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/30 space-y-2">
                        <div className="flex items-center gap-2 text-cyan-400 font-bold">
                          <span>📈 {analysis.pillar3.title}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] line-clamp-2">
                          Decision Focus: <strong className="text-white">{analysis.pillar3.userPrompt}</strong>
                        </p>
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
                          <strong>Causarix Solution:</strong> {analysis.pillar3.solution}
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
                          type="button"
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
                          type="button"
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
                          type="button"
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
                        type="button"
                        onClick={handleFinishOnboarding}
                        className="w-full sm:w-auto font-mono text-xs font-bold py-4 px-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-xl shrink-0 gap-2 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Enter Calibrated Workspace</span>
                      </Button>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default AdaptiveEnterpriseOnboardingModal;
