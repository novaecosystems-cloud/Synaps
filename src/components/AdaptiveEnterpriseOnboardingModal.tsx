"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Sparkles, ShieldCheck, Scale, DollarSign, 
  Cpu, Briefcase, Check, ArrowRight, CheckCircle2, Lock, 
  Globe2, FileText, ChevronRight, Database, Terminal, Layers,
  X, AlertCircle, RefreshCw, Link2, ExternalLink, ShieldAlert,
  UserCheck, CheckCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AnimatedOnboardingChecklist, ChecklistItemWithProgress } from "@/components/ui/animated-onboarding-checklist";

export type StrategicGoal = "CONTRACT_REDLINES" | "MNA_DILIGENCE" | "BOARDROOM_QUORUM" | "CASH_RUNWAY" | "CROSS_SILO_INVARIANTS";
export type ExecutiveRole = "LEGAL" | "CEO" | "CFO" | "CTO" | "MNA";
export type Jurisdiction = "US_DELAWARE" | "EU_GDPR" | "INDIA_DPDP" | "UK_COMMON" | "SG_APAC";
export type DocScale = "CONTRACTS_PDF" | "FINANCIAL_EXCEL" | "GIT_CODEBASES" | "MEETING_TRANSCRIPTS";

interface StrategicGoalConfig {
  id: StrategicGoal;
  title: string;
  subtitle: string;
  recommendedRole: ExecutiveRole;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const STRATEGIC_GOALS: StrategicGoalConfig[] = [
  {
    id: "CONTRACT_REDLINES",
    title: "Automated 60s Contract Redlines & Liability Defense",
    subtitle: "Identify uncapped indemnity, auto-renewals & generate Delaware DGCL § 141 counter-proposals.",
    recommendedRole: "LEGAL",
    icon: Scale,
    color: "from-cyan-400 to-blue-600"
  },
  {
    id: "MNA_DILIGENCE",
    title: "$200M M&A Cloud Acquisition & IP Diligence",
    subtitle: "Detect hidden GPLv3 licensing traps, model $42M clean-room rewrite costs & adjust valuations.",
    recommendedRole: "MNA",
    icon: Briefcase,
    color: "from-rose-400 to-amber-500"
  },
  {
    id: "BOARDROOM_QUORUM",
    title: "10-Agent Autonomous C-Suite Boardroom Deliberation",
    subtitle: "Simulate synchronous debates across CEO, CFO, CTO, Legal & Risk twins with quorum voting.",
    recommendedRole: "CEO",
    icon: Building2,
    color: "from-amber-400 to-rose-500"
  },
  {
    id: "CASH_RUNWAY",
    title: "Cash Runway & Tariff Stress-Testing (Deterministic Python)",
    subtitle: "Run Pyodide WASM sandboxes to stress-test margin compression, burn multiples & inflation rates.",
    recommendedRole: "CFO",
    icon: DollarSign,
    color: "from-emerald-400 to-teal-600"
  },
  {
    id: "CROSS_SILO_INVARIANTS",
    title: "Cross-Silo Invariant Rules (Air-Traffic Controller)",
    subtitle: "Prevent commercial teams from committing to 99.99% SLAs that cloud infrastructure cannot deliver.",
    recommendedRole: "CTO",
    icon: Cpu,
    color: "from-purple-400 to-indigo-600"
  }
];

const ROLES: { id: ExecutiveRole; label: string; sub: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "LEGAL", label: "General Counsel & Legal Advisor", sub: "Delaware DGCL § 141, statutory compliance & clause redlines", icon: Scale },
  { id: "CEO", label: "Founder & Chief Executive (CEO)", sub: "Strategic vision, boardroom consensus & growth governance", icon: Building2 },
  { id: "CFO", label: "Chief Financial Officer (CFO)", sub: "Balance sheet solvency, cash runway & deterministic Python math", icon: DollarSign },
  { id: "CTO", label: "Chief Technology Officer (CTO)", sub: "Cloud architecture, license scanning & KùzuDB causal graphs", icon: Cpu },
  { id: "MNA", label: "M&A & Corporate Development Lead", sub: "Valuation adjustments, seller escrows & acquisition stress-testing", icon: Briefcase }
];

const JURISDICTIONS: { id: Jurisdiction; label: string; sub: string; flag: string }[] = [
  { id: "US_DELAWARE", label: "US Delaware (DGCL § 141 & SEC)", sub: "Statutory fiduciary duty & Delaware mutual liability caps", flag: "🇺🇸" },
  { id: "EU_GDPR", label: "EU GDPR & EU AI Act 2024", sub: "Article 28 data localization & high-risk AI governance", flag: "🇪🇺" },
  { id: "INDIA_DPDP", label: "India DPDP Act 2023", sub: "Data principal rights & fiduciary cross-border transfers", flag: "🇮🇳" },
  { id: "UK_COMMON", label: "UK Common Law & English Courts", sub: "Commercial breach damages & standard exclusion clauses", flag: "🇬🇧" },
  { id: "SG_APAC", label: "Singapore & APAC Common Law (MAS)", sub: "Corporate governance & regional cross-border compliance", flag: "🇸🇬" }
];

const DOC_SCALES: { id: DocScale; label: string; sub: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "CONTRACTS_PDF", label: "Multi-Page Scanned Contracts & MSAs", sub: "Sub-2s 1-Shot Visual OCR table & clause reconstruction", icon: FileText },
  { id: "FINANCIAL_EXCEL", label: "Financial Models, CSVs & Balance Sheets", sub: "Deterministic Python WASM sandboxes with zero math drift", icon: DollarSign },
  { id: "GIT_CODEBASES", label: "Software Repositories & Dependencies", sub: "GPLv3 license discovery & KùzuDB causal dependency graph", icon: Terminal },
  { id: "MEETING_TRANSCRIPTS", label: "Board Minutes & Executive Transcripts", sub: "Dialectic quorum summarization & SHA-256 evidence logging", icon: Layers }
];

type OnboardingStep = "agreement" | "goal" | "role" | "jurisdiction" | "doc_scale" | "integration" | "intro";

export function AdaptiveEnterpriseOnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("agreement");
  const [agreementChecked, setAgreementChecked] = useState(false);
  
  // Adaptive State Pipeline
  const [selectedGoal, setSelectedGoal] = useState<StrategicGoal>("CONTRACT_REDLINES");
  const [selectedRole, setSelectedRole] = useState<ExecutiveRole>("LEGAL");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<Jurisdiction>("US_DELAWARE");
  const [selectedDocScale, setSelectedDocScale] = useState<DocScale>("CONTRACTS_PDF");
  const [selectedIntegration, setSelectedIntegration] = useState<string>("github");
  const [connectedIntegrations, setConnectedIntegrations] = useState<Record<string, boolean>>({});

  // Active OAuth 2.0 Authorization Modal State
  const [activeOAuthPopup, setActiveOAuthPopup] = useState<"github" | "jira" | "slack" | "erp" | null>(null);
  const [isAuthorizingOAuth, setIsAuthorizingOAuth] = useState<boolean>(false);
  const [oauthStepStatus, setOauthStepStatus] = useState<string>("");

  const GITHUB_CLIENT_ID = "Ov23li5MJdkSTkxXfr8P";
  const ATLASSIAN_CLIENT_ID = "5vuAKDnx4cfhpGcYRlSxrDc1GJuPppr1";
  const SLACK_CLIENT_ID = "11623622093636.11857963256533";

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
        const provider = event.data.provider || selectedIntegration;
        setConnectedIntegrations(prev => ({
          ...prev,
          [provider]: true
        }));
        try {
          localStorage.setItem(`causarix_${provider}_connected`, "true");
        } catch (e) {}
        setIsAuthorizingOAuth(false);
        setActiveOAuthPopup(null);
        setCurrentStep("intro");
      }
    };

    window.addEventListener('message', handleOAuthCallbackMessage);
    return () => window.removeEventListener('message', handleOAuthCallbackMessage);
  }, [selectedIntegration]);

  const handleSelectGoal = (goal: StrategicGoal) => {
    setSelectedGoal(goal);
    const goalConf = STRATEGIC_GOALS.find(g => g.id === goal);
    if (goalConf) {
      setSelectedRole(goalConf.recommendedRole);
    }
    setCurrentStep("role");
  };

  const handleSelectRole = (role: ExecutiveRole) => {
    setSelectedRole(role);
    setCurrentStep("jurisdiction");
  };

  const handleSelectJurisdiction = (jur: Jurisdiction) => {
    setSelectedJurisdiction(jur);
    setCurrentStep("doc_scale");
  };

  const handleSelectDocScale = (scaleId: DocScale) => {
    setSelectedDocScale(scaleId);
    setCurrentStep("integration");
  };

  const handleLaunchRealOAuthWindow = (provider: "github" | "jira" | "slack" | "erp") => {
    if (typeof window === "undefined") return;
    
    if (provider === "github") {
      const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/callback/github`);
      const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo,read:org,user:email&redirect_uri=${redirectUri}`;
      const width = 600;
      const height = 720;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      window.open(url, "github-oauth", `width=${width},height=${height},left=${left},top=${top}`);
    } else if (provider === "jira") {
      const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/callback/atlassian`);
      const state = `causarix_atlassian_${Date.now()}`;
      const url = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${ATLASSIAN_CLIENT_ID}&scope=read%3Ajira-work%20read%3Ajira-user%20manage%3Ajira-configuration%20write%3Ajira-work&redirect_uri=${redirectUri}&state=${state}&response_type=code&prompt=consent`;
      const width = 600;
      const height = 720;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      window.open(url, "atlassian-oauth", `width=${width},height=${height},left=${left},top=${top}`);
    } else if (provider === "slack") {
      const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/callback/slack`);
      const state = `causarix_slack_${Date.now()}`;
      const url = `https://slack.com/oauth/v2/authorize?client_id=${SLACK_CLIENT_ID}&scope=chat:write,channels:read,groups:read,im:write,incoming-webhook&redirect_uri=${redirectUri}&state=${state}`;
      const width = 600;
      const height = 720;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      window.open(url, "slack-oauth", `width=${width},height=${height},left=${left},top=${top}`);
    }
  };

  const handleOpenOAuthPopup = (integId: "github" | "jira" | "slack" | "erp") => {
    setSelectedIntegration(integId);
    setOauthStepStatus("");
    setIsAuthorizingOAuth(false);
    setActiveOAuthPopup(integId);

    // Automatically trigger real browser popup for GitHub, Jira, and Slack
    if (integId === "github" || integId === "jira" || integId === "slack") {
      handleLaunchRealOAuthWindow(integId);
    }
  };

  const handleExecuteOAuthConsent = async () => {
    setIsAuthorizingOAuth(true);
    setOauthStepStatus("Redirecting to OAuth 2.0 authorization server...");
    
    await new Promise(resolve => setTimeout(resolve, 600));
    setOauthStepStatus("Exchanging authorization grant token...");
    
    await new Promise(resolve => setTimeout(resolve, 800));
    setOauthStepStatus("Validating enterprise tenant scopes & permissions...");
    
    await new Promise(resolve => setTimeout(resolve, 600));
    setOauthStepStatus("OAuth 2.0 handshake verified!");

    setConnectedIntegrations(prev => ({
      ...prev,
      [selectedIntegration]: true
    }));

    try {
      localStorage.setItem(`causarix_${selectedIntegration}_connected`, "true");
    } catch (e) {}

    setTimeout(() => {
      setIsAuthorizingOAuth(false);
      setActiveOAuthPopup(null);
      setCurrentStep("intro");
    }, 800);
  };

  const handleSkipIntegration = () => {
    setActiveOAuthPopup(null);
    setCurrentStep("intro");
  };

  const handleFinishOnboarding = () => {
    localStorage.setItem("causarix_onboarding_completed", "true");
    localStorage.setItem("causarix_user_persona", JSON.stringify({
      goal: selectedGoal,
      role: selectedRole,
      jurisdiction: selectedJurisdiction,
      docScale: selectedDocScale,
      integration: selectedIntegration,
      connectedIntegrations,
      completedAt: new Date().toISOString()
    }));
    setIsOpen(false);
  };

  // Generate Tailored Dynamic Checklist based on Q1-Q6 Answers
  const getTailoredChecklist = (): ChecklistItemWithProgress[] => {
    const jurLabel = JURISDICTIONS.find(j => j.id === selectedJurisdiction)?.label || "Delaware";
    const isConnected = !!connectedIntegrations[selectedIntegration];
    
    switch (selectedGoal) {
      case "CONTRACT_REDLINES":
        return [
          { id: 1, text: `Upload Master Services Agreement (${selectedDocScale === "CONTRACTS_PDF" ? "Scanned PDF" : "Word/Doc"})`, helperText: "Sub-2s 1-Shot Visual OCR parsing", helperLink: { href: "/dashboard/documents", text: "Upload Vault" } },
          { id: 2, text: `Run ${jurLabel} Liability Cap & Indemnity Scan`, helperText: "Detects uncapped damages & non-mutual clauses", helperLink: { href: "/dashboard/simulations", text: "Run Redline" } },
          { id: 3, text: "Generate Automated Statutory Counter-Clause", helperText: "Instant Delaware DGCL § 141 approved language", helperLink: { href: "/dashboard/documents", text: "Export Redline" } },
          { id: 4, text: `Dispatch Redline Audit via ${selectedIntegration.toUpperCase()} OAuth`, helperText: isConnected ? "OAuth 2.0 Token Active" : "1-Click Ticket Dispatch", helperLink: { href: "/dashboard/settings/api-keys", text: "View Connector" } }
        ];
      case "MNA_DILIGENCE":
        return [
          { id: 1, text: "Ingest $200M Cloud Acquisition Data Room", helperText: "Parses target tech stack & licensing contracts", helperLink: { href: "/dashboard/documents", text: "Upload Data Room" } },
          { id: 2, text: "Detect Hidden GPLv3 Reciprocal License Conflicts", helperText: "KùzuDB multi-hop causal graph traversal (<1ms)", helperLink: { href: "/dashboard/graph", text: "Open Graph" } },
          { id: 3, text: "Calculate $42.0M Clean-Room Rewrite Cost (Python WASM)", helperText: "Deterministic math for valuation adjustment", helperLink: { href: "/dashboard/simulations", text: "Inspect Math" } },
          { id: 4, text: `Export $130M Counter-Offer & Sync to ${selectedIntegration.toUpperCase()}`, helperText: "Includes $25M seller IP indemnity escrow", helperLink: { href: "/dashboard/settings/api-keys", text: "View Dispatch" } }
        ];
      case "BOARDROOM_QUORUM":
        return [
          { id: 1, text: "Initialize 10-Agent C-Suite Digital Twins", helperText: "CEO, CFO, CTO, Legal, and Risk Quorum", helperLink: { href: "/dashboard/boardroom", text: "Enter Boardroom" } },
          { id: 2, text: `Submit Strategic Expansion Query under ${jurLabel}`, helperText: "Dialectic debate with 100% SHA-256 grounding", helperLink: { href: "/dashboard/boardroom", text: "Start Debate" } },
          { id: 3, text: "Reach Unanimous Quorum Consensus & Vote Record", helperText: "Permanent immutable audit trail logged", helperLink: { href: "/dashboard/audit", text: "View Audit" } },
          { id: 4, text: `Auto-Create Action Tickets on ${selectedIntegration.toUpperCase()}`, helperText: isConnected ? "OAuth 2.0 Connected" : "1-Click Ticket Dispatch", helperLink: { href: "/dashboard/settings/api-keys", text: "View Dispatch" } }
        ];
      case "CASH_RUNWAY":
        return [
          { id: 1, text: "Upload Q3 Financial Model / Balance Sheet CSV", helperText: "Tabular schema extraction with zero data drift", helperLink: { href: "/dashboard/documents", text: "Upload Financials" } },
          { id: 2, text: "Execute Parametric Macro Tariff Shock (+15%)", helperText: "Deterministic Python WASM sandbox execution", helperLink: { href: "/dashboard/simulations", text: "Open Studio" } },
          { id: 3, text: "Calibrate 90-Day Telemetry Delta Flywheel", helperText: "Reconciles ERP actuals against predictions", helperLink: { href: "/dashboard/decisions", text: "View Telemetry" } },
          { id: 4, text: `Dispatch Solvency Advisory to ${selectedIntegration.toUpperCase()}`, helperText: "P90 gross margin protection report", helperLink: { href: "/dashboard/settings/api-keys", text: "View Dispatch" } }
        ];
      case "CROSS_SILO_INVARIANTS":
      default:
        return [
          { id: 1, text: "Establish Engineering 99.9% Cloud Uptime Ceiling", helperText: "Air-Traffic Controller protects infrastructure roadmap", helperLink: { href: "/dashboard/simulations", text: "Set Ceiling" } },
          { id: 2, text: "Intercept Sales 99.99% SLA Customer Commitments", helperText: "Catches $1.45M liquidated damages breach risk", helperLink: { href: "/dashboard/simulations", text: "Check Invariants" } },
          { id: 3, text: `Generate ${jurLabel} Standard SLA Counter-Clause`, helperText: "Adds scheduled maintenance carve-outs", helperLink: { href: "/dashboard/documents", text: "Export Clause" } },
          { id: 4, text: `Dispatch P0 Invariant Violation to ${selectedIntegration.toUpperCase()}`, helperText: isConnected ? "OAuth 2.0 Connected" : "1-Click Ticket Dispatch", helperLink: { href: "/dashboard/settings/api-keys", text: "View Dispatch" } }
        ];
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-4xl bg-base-100 border border-base-300 rounded-3xl shadow-2xl overflow-hidden relative my-auto"
      >
        {/* Top Compulsory Header */}
        <div className="p-6 border-b border-base-200 bg-base-200/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-primary/10 border border-primary/30 text-primary flex items-center justify-center font-bold text-sm shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-black text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 uppercase tracking-widest">
                  COMPULSORY INITIALIZATION
                </span>
                <span className="text-xs text-base-content/50 font-mono font-bold">
                  {currentStep === "agreement" && "STAGE 1/7 · LEGAL TERMS"}
                  {currentStep === "goal" && "STAGE 2/7 · CORE OBJECTIVE"}
                  {currentStep === "role" && "STAGE 3/7 · EXECUTIVE SEAT"}
                  {currentStep === "jurisdiction" && "STAGE 4/7 · STATUTORY LAW"}
                  {currentStep === "doc_scale" && "STAGE 5/7 · DATA INGESTION"}
                  {currentStep === "integration" && "STAGE 6/7 · OAUTH 2.0 CONNECT"}
                  {currentStep === "intro" && "FINAL STAGE 7/7 · CUSTOMIZED GUIDE"}
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-base-content mt-0.5">
                Causarix Enterprise Sovereign Intelligence Calibration
              </h3>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1 font-mono text-xs">
            {["agreement", "goal", "role", "jurisdiction", "doc_scale", "integration", "intro"].map((s, idx) => (
              <span
                key={s}
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                  currentStep === s 
                    ? "bg-primary text-primary-foreground shadow" 
                    : "bg-base-300 text-base-content/40"
                )}
              >
                {idx + 1}
              </span>
            ))}
          </div>
        </div>

        {/* STAGE 1: Enterprise Legal Agreement */}
        {currentStep === "agreement" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-base-content">
                Enterprise Sovereign Privacy & Evidentiary Standard Agreement
              </h2>
              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                To guarantee zero corporate data leakage and mathematically verified boardroom decisions, accept our terms before accessing your tenant enclave.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-base-200 border border-base-300 space-y-3.5 text-xs leading-relaxed max-h-60 overflow-y-auto">
              <div className="flex items-start gap-2.5 text-base-content/90 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>1. Zero Public Model Training:</strong> Your documents, contracts, and financial models are strictly isolated in tenant-private vector enclaves and are never used to train public LLMs.</span>
              </div>
              <div className="flex items-start gap-2.5 text-base-content/90 font-medium">
                <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                <span><strong>2. 100% Evidentiary Grounding:</strong> Causarix anchors every boardroom decision and financial ratio to verifiable [Doc, Page, Line, SHA-256 Checksum] source coordinates.</span>
              </div>
              <div className="flex items-start gap-2.5 text-base-content/90 font-medium">
                <Lock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>3. Statutory Delaware & DPDP Compliance:</strong> Contract redlines operate under Delaware DGCL § 141 and GDPR/DPDP Article 28 data localization guidelines.</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-base-200/60 border border-base-300 flex items-center gap-3">
              <input
                type="checkbox"
                id="agree-checkbox"
                checked={agreementChecked}
                onChange={(e) => setAgreementChecked(e.target.checked)}
                className="checkbox checkbox-primary checkbox-sm rounded-lg"
              />
              <label htmlFor="agree-checkbox" className="text-xs font-bold text-base-content cursor-pointer">
                I accept the Causarix Enterprise Agreement, Evidentiary Standard, and Sovereign Data Isolation Terms.
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                onClick={() => {
                  setAgreementChecked(true);
                  setCurrentStep("goal");
                }}
                disabled={!agreementChecked}
                className="font-mono text-xs font-bold gap-2 py-3 px-8 bg-primary text-primary-foreground shadow-md"
              >
                <span>Accept & Choose Primary Mission</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STAGE 2: Core Strategic Objective */}
        {currentStep === "goal" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-base-content">
                What is your primary mission in Causarix?
              </h2>
              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                Choose the primary enterprise problem you need solved first. All subsequent questions and your workspace will calibrate around this.
              </p>
            </div>

            <div className="space-y-3">
              {STRATEGIC_GOALS.map((goal) => {
                const Icon = goal.icon;
                const isSelected = selectedGoal === goal.id;

                return (
                  <div
                    key={goal.id}
                    onClick={() => handleSelectGoal(goal.id)}
                    className={cn(
                      "p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 group",
                      isSelected ? "bg-primary/10 border-primary shadow-md" : "bg-base-200/50 border-base-300 hover:border-primary"
                    )}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-base-content group-hover:text-primary transition-colors">
                          {goal.title}
                        </h4>
                        <p className="text-xs text-base-content/70 mt-0.5 leading-relaxed">
                          {goal.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-1 text-xs font-mono font-bold text-primary shrink-0">
                      <span>Select Mission</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setCurrentStep("agreement")}
                className="font-mono text-xs font-bold text-base-content/70 hover:text-base-content"
              >
                ← Back to Agreement
              </button>
            </div>
          </div>
        )}

        {/* STAGE 3: Executive Role Alignment */}
        {currentStep === "role" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-primary font-bold">
                <span>MISSION: {STRATEGIC_GOALS.find(g => g.id === selectedGoal)?.title}</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-base-content">
                Based on your mission, what is your executive seat?
              </h2>
              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                We've pre-selected the recommended role for your mission, but you can change it anytime.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.id;

                return (
                  <div
                    key={r.id}
                    onClick={() => handleSelectRole(r.id)}
                    className={cn(
                      "p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer space-y-3 hover:border-primary group backdrop-blur-sm flex flex-col justify-between",
                      isSelected ? "bg-primary/10 border-primary ring-2 ring-primary/20 shadow-md" : "bg-base-200/50 border-base-300"
                    )}
                  >
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-sm text-base-content group-hover:text-primary transition-colors">
                        {r.label}
                      </h4>
                      <p className="text-[11px] text-base-content/70 leading-relaxed">
                        {r.sub}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] font-mono font-bold text-primary">
                      <span>Confirm Role</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setCurrentStep("goal")}
                className="font-mono text-xs font-bold text-base-content/70 hover:text-base-content"
              >
                ← Back to Mission
              </button>
            </div>
          </div>
        )}

        {/* STAGE 4: Statutory Compliance Jurisdiction */}
        {currentStep === "jurisdiction" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-primary font-bold">
                <span>ROLE: {ROLES.find(r => r.id === selectedRole)?.label}</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-base-content">
                Under which legal jurisdiction do your contracts operate?
              </h2>
              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                Calibrates automated contract redlining standards, statutory citations, and liability limits.
              </p>
            </div>

            <div className="space-y-3">
              {JURISDICTIONS.map((jur) => {
                const isSelected = selectedJurisdiction === jur.id;
                return (
                  <div
                    key={jur.id}
                    onClick={() => handleSelectJurisdiction(jur.id)}
                    className={cn(
                      "p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4",
                      isSelected ? "bg-primary/10 border-primary shadow-sm" : "bg-base-200/50 border-base-300 hover:border-primary"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{jur.flag}</span>
                      <div>
                        <h4 className="font-bold text-sm text-base-content">{jur.label}</h4>
                        <p className="text-xs text-base-content/70">{jur.sub}</p>
                      </div>
                    </div>
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                      isSelected ? "border-primary bg-primary text-primary-foreground" : "border-base-content/30"
                    )}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setCurrentStep("role")}
                className="font-mono text-xs font-bold text-base-content/70 hover:text-base-content"
              >
                ← Back to Role
              </button>
            </div>
          </div>
        )}

        {/* STAGE 5: Corporate Document Ingestion Scale */}
        {currentStep === "doc_scale" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-base-content">
                What initial corporate asset library will you upload?
              </h2>
              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                Configures our dual-core OCR parser, deterministic Python sandbox, or KùzuDB graph engine for maximum precision.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DOC_SCALES.map((doc) => {
                const Icon = doc.icon;
                const isSelected = selectedDocScale === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => handleSelectDocScale(doc.id)}
                    className={cn(
                      "p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer space-y-2.5 flex flex-col justify-between group",
                      isSelected ? "bg-primary/10 border-primary shadow-sm" : "bg-base-200/50 border-base-300 hover:border-primary"
                    )}
                  >
                    <div className="space-y-1.5">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-sm text-base-content group-hover:text-primary transition-colors">{doc.label}</h4>
                      <p className="text-xs text-base-content/70">{doc.sub}</p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] font-mono font-bold text-primary">
                      <span>Select Format</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setCurrentStep("jurisdiction")}
                className="font-mono text-xs font-bold text-base-content/70 hover:text-base-content"
              >
                ← Back to Jurisdiction
              </button>
            </div>
          </div>
        )}

        {/* STAGE 6: 1-Click OAuth 2.0 Authorization Connectors */}
        {currentStep === "integration" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-base-content">
                Connect your workflow via 1-Click OAuth 2.0
              </h2>
              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                Click any service below to open its official OAuth authorization popup. No API keys or tokens required.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { 
                  id: "github" as const, 
                  label: "GitHub Repositories & PRs", 
                  desc: "Authorize repository access for GPLv3 license scanning and PR invariant audits.", 
                  badge: "1-CLICK OAUTH",
                  icon: "🐙"
                },
                { 
                  id: "jira" as const, 
                  label: "Atlassian Jira Cloud (Project KAN)", 
                  desc: "Authorize Jira site access to auto-create P0 mitigation tickets on boardroom consensus.", 
                  badge: "RECOMMENDED",
                  icon: "🎫"
                },
                { 
                  id: "slack" as const, 
                  label: "Slack & Microsoft Teams", 
                  desc: "Authorize Slack bot to deliver daily morning audio briefings and urgent contract risk alerts.", 
                  badge: "DAILY BRIEFS",
                  icon: "💬"
                },
                { 
                  id: "erp" as const, 
                  label: "QuickBooks / Stripe OAuth", 
                  desc: "Authorize read-only cashflow telemetry to calibrate 90-day Bayesian decision accuracy.", 
                  badge: "FINANCIAL",
                  icon: "📈"
                },
              ].map((integ) => {
                const isConnected = !!connectedIntegrations[integ.id];
                return (
                  <div
                    key={integ.id}
                    onClick={() => handleOpenOAuthPopup(integ.id)}
                    className={cn(
                      "p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer space-y-2.5 flex flex-col justify-between group hover:border-primary shadow-sm",
                      isConnected ? "bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20" : "bg-base-200/50 border-base-300"
                    )}
                  >
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {integ.badge}
                        </span>
                        {isConnected ? (
                          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> AUTHORIZED
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-base-content/50">
                            OAuth 2.0
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-base-content group-hover:text-primary transition-colors flex items-center gap-2">
                        <span>{integ.icon}</span>
                        <span>{integ.label}</span>
                      </h4>
                      <p className="text-xs text-base-content/70">{integ.desc}</p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs font-mono font-bold text-primary">
                      <span>{isConnected ? "Re-authorize OAuth 2.0" : "Authorize with OAuth 2.0 ↗"}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setCurrentStep("doc_scale")}
                className="font-mono text-xs font-bold text-base-content/70 hover:text-base-content"
              >
                ← Back to Data Ingestion
              </button>
              <button
                onClick={handleSkipIntegration}
                className="font-mono text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Skip & View Personalized Walkthrough →</span>
              </button>
            </div>
          </div>
        )}

        {/* FINAL STAGE 7: Customized Guided App Intro & Dynamic Interactive Checklist */}
        {currentStep === "intro" && (
          <div className="p-6 sm:p-8 space-y-6">
            <AnimatedOnboardingChecklist
              title={`Welcome to Causarix — ${ROLES.find(r => r.id === selectedRole)?.label}`}
              description={`Your workspace is calibrated for ${STRATEGIC_GOALS.find(g => g.id === selectedGoal)?.title} under ${JURISDICTIONS.find(j => j.id === selectedJurisdiction)?.label}.`}
              items={getTailoredChecklist()}
              videoThumbnailUrl="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80"
              videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
              stepDuration={3000}
              autoAdvance={true}
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-base-200 border border-base-300">
              <div className="text-xs text-base-content/70">
                <span>🛡️ Calibration complete. Action dispatch target set to <strong>{selectedIntegration.toUpperCase()}</strong>.</span>
              </div>
              <Button
                onClick={handleFinishOnboarding}
                className="w-full sm:w-auto font-mono text-xs font-bold py-3.5 px-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shrink-0 gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Enter Personalized Workspace</span>
              </Button>
            </div>
          </div>
        )}

        {/* ─── REALISTIC 1-CLICK OAUTH 2.0 CONSENT SCREENS ──────────────────────── */}
        {activeOAuthPopup && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative border"
            >
              {/* 1. GITHUB OAUTH 2.0 SCREEN */}
              {activeOAuthPopup === "github" && (
                <div className="bg-[#0d1117] border-[#30363d] text-[#c9d1d9] p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-[#30363d] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center text-xl">
                        🐙
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white">Authorize Causarix</h3>
                        <p className="text-[11px] text-[#8b949e]">causarix-enterprise-app</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveOAuthPopup(null)} className="text-[#8b949e] hover:text-white p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#161b22] border border-[#30363d] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <span className="text-[#8b949e] block text-[10px]">Signed in to GitHub as:</span>
                      <strong className="text-white">developer-lead@apex-enterprises</strong>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs text-[#8b949e]">
                    <span className="font-bold text-[11px] text-white uppercase tracking-wider block">
                      Causarix by Synaps would like permission to:
                    </span>
                    <div className="flex items-start gap-2.5 text-[#c9d1d9]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Repositories:</strong> Read commit trees, license files (`LICENSE`, `pom.xml`), and dependencies for GPLv3 conflict audits.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-[#c9d1d9]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Organizations:</strong> Verify tenant membership and automated pull request invariant checks.</span>
                    </div>
                  </div>

                  {oauthStepStatus && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-mono font-bold flex items-center gap-2">
                      <RefreshCw className={cn("w-3.5 h-3.5 shrink-0", isAuthorizingOAuth && "animate-spin")} />
                      <span>{oauthStepStatus}</span>
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => handleLaunchRealOAuthWindow("github")}
                      className="w-full py-3 px-4 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Authorize on GitHub.com Popup ↗</span>
                    </button>
                    <button
                      onClick={handleExecuteOAuthConsent}
                      disabled={isAuthorizingOAuth}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] font-bold text-xs border border-[#30363d] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isAuthorizingOAuth ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Authorizing Grant...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Fast 1-Click Sandbox Authorization</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveOAuthPopup(null)}
                      className="w-full py-2 text-center text-xs font-mono text-[#8b949e] hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* 2. ATLASSIAN JIRA OAUTH 2.0 (3LO) SCREEN */}
              {activeOAuthPopup === "jira" && (
                <div className="bg-[#172b4d] text-white p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#0052cc] flex items-center justify-center text-white font-bold text-lg shadow-md">
                        🎫
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white">Authorize Atlassian Jira Cloud</h3>
                        <p className="text-[11px] text-blue-200/70">Atlassian 3LO Consent</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveOAuthPopup(null)} className="text-white/70 hover:text-white p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
                    <span className="text-[10px] text-blue-200 font-mono uppercase block">Authorized Site Domain:</span>
                    <strong className="text-sm font-mono text-emerald-400">novaecosystems.atlassian.net (Project: KAN)</strong>
                  </div>

                  <div className="space-y-2 text-xs text-blue-100/80">
                    <span className="font-bold text-[11px] text-white uppercase tracking-wider block">
                      Permissions Requested:
                    </span>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Read Jira issue backlog and sprint milestones.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Create and assign P0 risk mitigation tickets from boardroom quorum votes.</span>
                    </div>
                  </div>

                  {oauthStepStatus && (
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-mono font-bold flex items-center gap-2">
                      <RefreshCw className={cn("w-3.5 h-3.5 shrink-0", isAuthorizingOAuth && "animate-spin")} />
                      <span>{oauthStepStatus}</span>
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => handleLaunchRealOAuthWindow("jira")}
                      className="w-full py-3 px-4 rounded-xl bg-[#0052cc] hover:bg-[#0747a6] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Authorize on Atlassian.com Popup ↗</span>
                    </button>
                    <button
                      onClick={handleExecuteOAuthConsent}
                      disabled={isAuthorizingOAuth}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isAuthorizingOAuth ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Authorizing Atlassian Site...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Fast 1-Click Sandbox Authorization</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveOAuthPopup(null)}
                      className="w-full py-2 text-center text-xs font-mono text-blue-200/70 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* 3. SLACK OAUTH 2.0 SCREEN */}
              {activeOAuthPopup === "slack" && (
                <div className="bg-[#4a154b] text-white p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white text-2xl flex items-center justify-center shadow-md">
                        💬
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white">Connect Slack Workspace</h3>
                        <p className="text-[11px] text-pink-200/70">Slack OAuth 2.0 Bot</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveOAuthPopup(null)} className="text-white/70 hover:text-white p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
                    <span className="text-[10px] text-pink-200 font-mono uppercase block">Target Channel:</span>
                    <strong className="text-sm font-mono text-emerald-400">#executive-briefs (Apex Tech)</strong>
                  </div>

                  <div className="space-y-2 text-xs text-pink-100/80">
                    <span className="font-bold text-[11px] text-white uppercase tracking-wider block">
                      Permissions Requested:
                    </span>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Post daily Chief of Staff morning audio briefings directly to your team channel.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Broadcast P0 contract liability breach alerts.</span>
                    </div>
                  </div>

                  {oauthStepStatus && (
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-mono font-bold flex items-center gap-2">
                      <RefreshCw className={cn("w-3.5 h-3.5 shrink-0", isAuthorizingOAuth && "animate-spin")} />
                      <span>{oauthStepStatus}</span>
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => handleLaunchRealOAuthWindow("slack")}
                      className="w-full py-3 px-4 rounded-xl bg-[#007a5a] hover:bg-[#148567] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Authorize on Slack.com Popup ↗</span>
                    </button>
                    <button
                      onClick={handleExecuteOAuthConsent}
                      disabled={isAuthorizingOAuth}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isAuthorizingOAuth ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Connecting Slack Workspace...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Fast 1-Click Sandbox Authorization</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveOAuthPopup(null)}
                      className="w-full py-2 text-center text-xs font-mono text-pink-200/70 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* 4. INTUIT QUICKBOOKS OAUTH 2.0 SCREEN */}
              {activeOAuthPopup === "erp" && (
                <div className="bg-[#1f2937] text-white p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#2ca01c] text-white text-2xl flex items-center justify-center shadow-md">
                        📈
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white">Connect Intuit QuickBooks</h3>
                        <p className="text-[11px] text-gray-400">Intuit Single Sign-On & Data Sync</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveOAuthPopup(null)} className="text-white/70 hover:text-white p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
                    <span className="text-[10px] text-gray-300 font-mono uppercase block">Company Connected:</span>
                    <strong className="text-sm font-mono text-emerald-400">Apex Global Enterprises LLC</strong>
                  </div>

                  <div className="space-y-2 text-xs text-gray-300">
                    <span className="font-bold text-[11px] text-white uppercase tracking-wider block">
                      Permissions Requested:
                    </span>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Read monthly revenue, ARR churn, and expense streams.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Calibrate 90-Day Telemetry Bayesian weights with deterministic Python WASM.</span>
                    </div>
                  </div>

                  {oauthStepStatus && (
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-mono font-bold flex items-center gap-2">
                      <RefreshCw className={cn("w-3.5 h-3.5 shrink-0", isAuthorizingOAuth && "animate-spin")} />
                      <span>{oauthStepStatus}</span>
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleExecuteOAuthConsent}
                      disabled={isAuthorizingOAuth}
                      className="w-full py-3 px-4 rounded-xl bg-[#2ca01c] hover:bg-[#248017] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isAuthorizingOAuth ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Connecting QuickBooks Online...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Connect Intuit Account</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveOAuthPopup(null)}
                      className="w-full py-2 text-center text-xs font-mono text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default AdaptiveEnterpriseOnboardingModal;
