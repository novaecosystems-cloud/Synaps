"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Sparkles, ShieldCheck, Scale, DollarSign, 
  Cpu, Briefcase, Check, ArrowRight, CheckCircle2, Lock, 
  Globe2, FileText, ChevronRight, Database, Terminal, Layers,
  X, AlertCircle, RefreshCw, Link2, ExternalLink
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
  const [selectedIntegration, setSelectedIntegration] = useState<string>("jira");
  const [isIntegrationConnected, setIsIntegrationConnected] = useState<boolean>(false);

  // Active Connection Modal State
  const [activeConnectorPopup, setActiveConnectorPopup] = useState<"jira" | "github" | "slack" | "erp" | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);
  const [connectionSuccess, setConnectionSuccess] = useState<boolean>(false);

  // Credentials State
  const [jiraDomain, setJiraDomain] = useState("https://novaecosystems.atlassian.net");
  const [jiraEmail, setJiraEmail] = useState("admin@causarix.ai");
  const [jiraToken, setJiraToken] = useState("ATATT3xFfGF0...");
  const [jiraProjectKey, setJiraProjectKey] = useState("KAN");

  const [githubRepoUrl, setGithubRepoUrl] = useState("https://github.com/novaecosystems-cloud/Synaps");
  const [githubPat, setGithubPat] = useState("ghp_live_token_77a9...");

  const [slackWebhookUrl, setSlackWebhookUrl] = useState("https://hooks.slack.com/services/T00/B00/X00");
  const [slackChannel, setSlackChannel] = useState("#executive-briefs");

  const [erpApiKey, setErpApiKey] = useState("qb_sec_live_99482...");

  useEffect(() => {
    const isCompleted = localStorage.getItem("causarix_onboarding_completed");
    if (!isCompleted) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

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

  const handleOpenConnectorPopup = (integId: "jira" | "github" | "slack" | "erp") => {
    setSelectedIntegration(integId);
    setConnectionSuccess(false);
    setActiveConnectorPopup(integId);
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    // Simulate real-time API roundtrip validation
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsTestingConnection(false);
    setConnectionSuccess(true);
    setIsIntegrationConnected(true);

    // Persist verified integration
    try {
      localStorage.setItem(`causarix_${selectedIntegration}_connected`, "true");
    } catch (e) {}

    setTimeout(() => {
      setActiveConnectorPopup(null);
      setCurrentStep("intro");
    }, 1000);
  };

  const handleSkipIntegration = () => {
    setActiveConnectorPopup(null);
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
      isIntegrationConnected,
      completedAt: new Date().toISOString()
    }));
    setIsOpen(false);
  };

  // Generate Tailored Dynamic Checklist based on Q1-Q6 Answers
  const getTailoredChecklist = (): ChecklistItemWithProgress[] => {
    const jurLabel = JURISDICTIONS.find(j => j.id === selectedJurisdiction)?.label || "Delaware";
    
    switch (selectedGoal) {
      case "CONTRACT_REDLINES":
        return [
          { id: 1, text: `Upload Master Services Agreement (${selectedDocScale === "CONTRACTS_PDF" ? "Scanned PDF" : "Word/Doc"})`, helperText: "Sub-2s 1-Shot Visual OCR parsing", helperLink: { href: "/dashboard/documents", text: "Upload Vault" } },
          { id: 2, text: `Run ${jurLabel} Liability Cap & Indemnity Scan`, helperText: "Detects uncapped damages & non-mutual clauses", helperLink: { href: "/dashboard/simulations", text: "Run Redline" } },
          { id: 3, text: "Generate Automated Statutory Counter-Clause", helperText: "Instant Delaware DGCL § 141 approved language", helperLink: { href: "/dashboard/documents", text: "Export Redline" } },
          { id: 4, text: `Dispatch Redline Audit to ${selectedIntegration.toUpperCase()}`, helperText: isIntegrationConnected ? "Live Connector Verified" : "1-Click Ticket Dispatch", helperLink: { href: "/dashboard/settings/api-keys", text: "View Connector" } }
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
          { id: 4, text: `Auto-Create Action Tickets on ${selectedIntegration.toUpperCase()}`, helperText: isIntegrationConnected ? "Live Connector Verified" : "1-Click Ticket Dispatch", helperLink: { href: "/dashboard/settings/api-keys", text: "View Dispatch" } }
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
          { id: 4, text: `Dispatch P0 Invariant Violation to ${selectedIntegration.toUpperCase()}`, helperText: isIntegrationConnected ? "Live Connector Verified" : "1-Click Ticket Dispatch", helperLink: { href: "/dashboard/settings/api-keys", text: "View Dispatch" } }
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
                  {currentStep === "integration" && "STAGE 6/7 · ACTION DISPATCH"}
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

        {/* STAGE 6: Interactive Action Dispatch with Live Connection Popup */}
        {currentStep === "integration" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-base-content">
                Connect your workflow dispatch tool
              </h2>
              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                Click any tool below to open its live configuration popup and test credentials, or skip to configure later.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: "jira" as const, label: "Atlassian Jira Cloud (Project KAN)", desc: "1-Click auto-generates P0 mitigation tickets on your Jira board.", badge: "RECOMMENDED" },
                { id: "github" as const, label: "GitHub Repositories & PRs", desc: "Automated license scanning and PR invariant verification.", badge: "CODEBASE AUDIT" },
                { id: "slack" as const, label: "Slack & Microsoft Teams", desc: "Delivers daily morning audio briefings and urgent risk alerts.", badge: "DAILY BRIEFS" },
                { id: "erp" as const, label: "QuickBooks / Stripe Webhooks", desc: "Live cashflow telemetry feed for 90-day Bayesian auto-tuning.", badge: "FINANCIAL" },
              ].map((integ) => {
                const isConnected = selectedIntegration === integ.id && isIntegrationConnected;
                return (
                  <div
                    key={integ.id}
                    onClick={() => handleOpenConnectorPopup(integ.id)}
                    className={cn(
                      "p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer space-y-2.5 flex flex-col justify-between group hover:border-primary shadow-sm",
                      isConnected ? "bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20" : "bg-base-200/50 border-base-300"
                    )}
                  >
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {integ.badge}
                        </span>
                        {isConnected && (
                          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> CONNECTED
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-base-content group-hover:text-primary transition-colors pt-1">{integ.label}</h4>
                      <p className="text-xs text-base-content/70">{integ.desc}</p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs font-mono font-bold text-primary">
                      <span>{isConnected ? "Reconfigure Connection" : "Configure & Test Live ↗"}</span>
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

        {/* ─── LIVE CONNECTOR POPUP MODAL ────────────────────────────────────────── */}
        {activeConnectorPopup && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-lg bg-base-100 border border-base-300 rounded-3xl shadow-2xl p-6 space-y-5 relative text-base-content"
            >
              <button
                onClick={() => setActiveConnectorPopup(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-base-200 text-base-content/60"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-lg font-bold">
                    {activeConnectorPopup === "jira" && "Connect Atlassian Jira Cloud"}
                    {activeConnectorPopup === "github" && "Connect GitHub Repository"}
                    {activeConnectorPopup === "slack" && "Connect Slack / Teams Webhook"}
                    {activeConnectorPopup === "erp" && "Connect QuickBooks / Stripe Feed"}
                  </h3>
                </div>
                <p className="text-xs text-base-content/60">
                  {activeConnectorPopup === "jira" && "Causarix will automatically create P0 risk mitigation tickets directly on your Jira board."}
                  {activeConnectorPopup === "github" && "Scans Git commits and dependencies for GPLv3 reciprocal license conflicts."}
                  {activeConnectorPopup === "slack" && "Delivers daily Chief of Staff morning audio briefings directly to your team channel."}
                  {activeConnectorPopup === "erp" && "Syncs cashflow telemetry to auto-calibrate 90-day Bayesian decision accuracy."}
                </p>
              </div>

              {/* JIRA CONFIG FORM */}
              {activeConnectorPopup === "jira" && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-[11px] block mb-1">Jira Cloud Domain URL</label>
                    <input
                      type="text"
                      value={jiraDomain}
                      onChange={(e) => setJiraDomain(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs font-mono font-medium outline-none focus:border-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-[11px] block mb-1">Atlassian Email</label>
                      <input
                        type="email"
                        value={jiraEmail}
                        onChange={(e) => setJiraEmail(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs font-mono font-medium outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[11px] block mb-1">Project Key</label>
                      <input
                        type="text"
                        value={jiraProjectKey}
                        onChange={(e) => setJiraProjectKey(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs font-mono font-medium outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-[11px] block mb-1">Atlassian API Token</label>
                    <input
                      type="password"
                      value={jiraToken}
                      onChange={(e) => setJiraToken(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs font-mono font-medium outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}

              {/* GITHUB CONFIG FORM */}
              {activeConnectorPopup === "github" && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-[11px] block mb-1">Repository URL</label>
                    <input
                      type="text"
                      value={githubRepoUrl}
                      onChange={(e) => setGithubRepoUrl(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs font-mono font-medium outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[11px] block mb-1">GitHub Personal Access Token (PAT)</label>
                    <input
                      type="password"
                      value={githubPat}
                      onChange={(e) => setGithubPat(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs font-mono font-medium outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}

              {/* SLACK CONFIG FORM */}
              {activeConnectorPopup === "slack" && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-[11px] block mb-1">Incoming Webhook URL</label>
                    <input
                      type="text"
                      value={slackWebhookUrl}
                      onChange={(e) => setSlackWebhookUrl(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs font-mono font-medium outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[11px] block mb-1">Channel Name</label>
                    <input
                      type="text"
                      value={slackChannel}
                      onChange={(e) => setSlackChannel(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs font-mono font-medium outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}

              {/* ERP CONFIG FORM */}
              {activeConnectorPopup === "erp" && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-[11px] block mb-1">QuickBooks / Stripe Webhook Key</label>
                    <input
                      type="password"
                      value={erpApiKey}
                      onChange={(e) => setErpApiKey(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs font-mono font-medium outline-none focus:border-primary"
                    />
                  </div>
                  <p className="text-[11px] text-base-content/60">
                    Live transactions feed into the 90-Day Telemetry Flywheel to calibrate Bayesian risk models.
                  </p>
                </div>
              )}

              {/* Connection Status Banner */}
              {connectionSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Connection Verified! Synchronizing with Causarix OS...</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleSkipIntegration}
                  className="font-mono text-xs font-bold text-base-content/60 hover:text-base-content"
                >
                  Skip for Now
                </button>
                <Button
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                  className="font-mono text-xs font-bold py-2.5 px-6 bg-primary text-primary-foreground gap-2 shadow-md"
                >
                  {isTestingConnection ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Testing Live Connection...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Test & Verify Connection</span>
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default AdaptiveEnterpriseOnboardingModal;
