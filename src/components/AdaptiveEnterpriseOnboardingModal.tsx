"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Sparkles, ShieldCheck, Scale, DollarSign, 
  Cpu, Briefcase, Check, ArrowRight, CheckCircle2, Lock, 
  Globe2, FileText, ChevronRight, Database, Terminal, Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AnimatedOnboardingChecklist, ChecklistItemWithProgress } from "@/components/ui/animated-onboarding-checklist";

export type ExecutiveRole = "CEO" | "LEGAL" | "CFO" | "CTO" | "MNA";
export type Jurisdiction = "US_DELAWARE" | "EU_GDPR" | "INDIA_DPDP" | "UK_COMMON" | "SG_APAC";
export type DocScale = "CONTRACTS_PDF" | "FINANCIAL_EXCEL" | "GIT_CODEBASES" | "MEETING_TRANSCRIPTS";

interface RoleConfig {
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  priorities: { id: string; label: string; description: string }[];
  defaultChecklist: ChecklistItemWithProgress[];
  videoThumbnail: string;
  videoUrl: string;
  introTitle: string;
  introDescription: string;
}

const JURISDICTIONS: { id: Jurisdiction; label: string; sub: string; flag: string }[] = [
  { id: "US_DELAWARE", label: "US Delaware (DGCL § 141 & SEC)", sub: "Statutory fiduciary duty & Delaware liability caps", flag: "🇺🇸" },
  { id: "EU_GDPR", label: "EU GDPR & EU AI Act 2024", sub: "Article 28 data localization & high-risk AI governance", flag: "🇪🇺" },
  { id: "INDIA_DPDP", label: "India DPDP Act 2023", sub: "Data principal rights & fiduciary cross-border transfers", flag: "🇮🇳" },
  { id: "UK_COMMON", label: "UK Common Law & English Courts", sub: "Standard terms, indemnities & breach damages", flag: "🇬🇧" },
  { id: "SG_APAC", label: "Singapore & APAC Common Law (MAS)", sub: "Corporate governance & regional cross-border trades", flag: "🇸🇬" },
];

const DOC_SCALES: { id: DocScale; label: string; sub: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "CONTRACTS_PDF", label: "Multi-Page Scanned Contracts & MSAs", sub: "Sub-2s 1-Shot Visual OCR table & clause reconstruction", icon: FileText },
  { id: "FINANCIAL_EXCEL", label: "Financial Models, CSVs & Balance Sheets", sub: "Deterministic Python WASM sandboxes with 0 math drift", icon: DollarSign },
  { id: "GIT_CODEBASES", label: "Software Repositories & Dependencies", sub: "GPLv3 license discovery & KùzuDB causal dependency graph", icon: Terminal },
  { id: "MEETING_TRANSCRIPTS", label: "Board Minutes & Executive Transcripts", sub: "Dialectic quorum summarization & SHA-256 evidence logging", icon: Layers },
];

const ROLE_CONFIGS: Record<ExecutiveRole, RoleConfig> = {
  CEO: {
    label: "Founder & Chief Executive (CEO)",
    sublabel: "Strategic Vision, Boardroom Quorum & Governance",
    icon: Building2,
    color: "from-amber-400 to-rose-500",
    priorities: [
      { id: "boardroom", label: "10-Agent AI Boardroom Deliberation", description: "Simulate C-suite quorum debates and strategic voting." },
      { id: "due_diligence", label: "Fast-Track M&A & Funding Diligence", description: "Surface hidden liabilities and contract risks in minutes." },
      { id: "chief_of_staff", label: "Morning Executive Briefings", description: "Daily triage of high-urgency business milestones & cash runway." },
    ],
    defaultChecklist: [
      { id: 1, text: "Initialize 10-Agent C-Suite Digital Twins", helperText: "CEO, CFO, CTO, Legal, and Risk Quorum", helperLink: { href: "/dashboard/boardroom", text: "Open Boardroom" } },
      { id: 2, text: "Simulate $200M M&A Cloud Acquisition Scenario", helperText: "Discovers GPLv3 license & clean-room rewrite costs", helperLink: { href: "/dashboard/simulations", text: "Run Simulation" } },
      { id: 3, text: "Dispatch Approved Quorum Action to Jira (KAN)", helperText: "1-Click automated Jira ticket creation", helperLink: { href: "/dashboard/settings/api-keys", text: "Verify Jira" } },
      { id: 4, text: "Review Daily Chief of Staff Morning Brief", helperText: "High-priority contract milestones", helperLink: { href: "/dashboard/chief-of-staff", text: "Listen Audio Brief" } },
    ],
    videoThumbnail: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    introTitle: "CEO Strategic Command Center Setup",
    introDescription: "Your personalized executive workspace is configured for 10-Agent dialectic boardroom consensus and automated Jira risk dispatch.",
  },
  LEGAL: {
    label: "General Counsel & Legal Advisor",
    sublabel: "Statutory Law, Delaware DGCL § 141 & Contract Redlines",
    icon: Scale,
    color: "from-cyan-400 to-blue-600",
    priorities: [
      { id: "delaware_redlines", label: "Delaware DGCL § 141 Contract Redlines", description: "Automated 60s clause counter-proposals with statutory citations." },
      { id: "cross_silo_invariants", label: "Cross-Silo Invariant Rules (Air-Traffic Controller)", description: "Prevent Sales from committing to SLAs Engineering cannot deliver." },
      { id: "regulatory_compliance", label: "DPDP Act 2023 & GDPR Compliance Audits", description: "PII redaction and cross-border transfer validations." },
    ],
    defaultChecklist: [
      { id: 1, text: "Upload Master Services Agreement (MSA)", helperText: "Sub-2s 1-Shot Visual OCR parsing", helperLink: { href: "/dashboard/documents", text: "Upload Vault" } },
      { id: 2, text: "Execute Delaware DGCL § 141 Liability Cap Scan", helperText: "Detects uncapped indemnity & liability traps", helperLink: { href: "/dashboard/documents", text: "Run Redline" } },
      { id: 3, text: "Verify Cross-Silo SLA Invariants", helperText: "Ensures Sales SLA matches Cloud Uptime", helperLink: { href: "/dashboard/simulations", text: "Check Invariants" } },
      { id: 4, text: "Generate SHA-256 Grounded Evidentiary Report", helperText: "100% line-level citations with zero hallucinations", helperLink: { href: "/dashboard/audit", text: "View Audit" } },
    ],
    videoThumbnail: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    introTitle: "Legal Counsel & Delaware Redline Studio",
    introDescription: "Your workspace is pre-trained on 6 global jurisdictions with sub-2s 1-Shot OCR and automated Delaware counter-clauses.",
  },
  CFO: {
    label: "Chief Financial Officer (CFO)",
    sublabel: "Balance Sheet Solvency, Cash Runway & Deterministic Math",
    icon: DollarSign,
    color: "from-emerald-400 to-teal-600",
    priorities: [
      { id: "runway_burn", label: "Cash Runway & Burn Multiple Modeling", description: "Deterministic Python WASM sandbox with zero arithmetic drift." },
      { id: "macro_tariffs", label: "Supply Chain Tariff & Rate Shock Testing", description: "Parametric macro sliders stress-testing gross margin compression." },
      { id: "telemetry_delta", label: "90-Day Telemetry Delta Calibration", description: "Reconciles ERP/Salesforce actuals against predicted cashflow." },
    ],
    defaultChecklist: [
      { id: 1, text: "Upload Q3 Financial Model / Balance Sheet CSV", helperText: "Tabular schema extraction with zero data drift", helperLink: { href: "/dashboard/documents", text: "Upload Financials" } },
      { id: 2, text: "Run Parametric Tariff Shock Simulation (+15%)", helperText: "Deterministic Python WASM sandbox execution", helperLink: { href: "/dashboard/simulations", text: "Open Studio" } },
      { id: 3, text: "Connect QuickBooks / Stripe Webhook Stream", helperText: "Auto-calibrates Bayesian risk weighting", helperLink: { href: "/dashboard/settings/api-keys", text: "Connect ERP" } },
      { id: 4, text: "Inspect 90-Day Telemetry Prediction Variance", helperText: "Proprietary compounding enterprise moat", helperLink: { href: "/dashboard/decisions", text: "View Telemetry" } },
    ],
    videoThumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    introTitle: "CFO Solvency & Deterministic Math Sandbox",
    introDescription: "Your workspace is equipped with Pyodide WebAssembly Python sandboxes for zero-hallucination financial modeling.",
  },
  CTO: {
    label: "Chief Technology Officer (CTO)",
    sublabel: "Cloud Architecture, License Audits & Multi-Hop Causal Graphs",
    icon: Cpu,
    color: "from-purple-400 to-indigo-600",
    priorities: [
      { id: "gpl_licensing", label: "Codebase GPLv3 Open-Source License Audits", description: "Detects reciprocal licenses that force open-sourcing closed IP." },
      { id: "sla_invariants", label: "99.9% Cloud SLA vs. Sales Commitments", description: "Enforces production architectural limits across commercial teams." },
      { id: "kuzu_graph", label: "KùzuDB Multi-Hop Causal Knowledge Graph", description: "Sub-millisecond Cypher queries over complex tech stack dependencies." },
    ],
    defaultChecklist: [
      { id: 1, text: "Connect GitHub Repository for License Audits", helperText: "Scans Git commit trees for GPLv3 conflicts", helperLink: { href: "/dashboard/settings/api-keys", text: "Connect GitHub" } },
      { id: 2, text: "Execute KùzuDB Multi-Hop Cypher Traversal", helperText: "Sub-1ms causal graph query resolution", helperLink: { href: "/dashboard/graph", text: "Open Graph" } },
      { id: 3, text: "Configure Jira Cloud REST API (Project KAN)", helperText: "Auto-generates engineering mitigation tickets", helperLink: { href: "/dashboard/settings/api-keys", text: "Configure Jira" } },
      { id: 4, text: "Set Cloud Infrastructure 99.9% Uptime Ceiling", helperText: "Air-Traffic Controller protects engineering roadmap", helperLink: { href: "/dashboard/simulations", text: "Set Invariants" } },
    ],
    videoThumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    introTitle: "CTO Infrastructure & License Audit Engine",
    introDescription: "Your workspace is wired to KùzuDB for sub-millisecond Cypher multi-hop graph queries and automated Git license audits.",
  },
  MNA: {
    label: "M&A & Corporate Development Lead",
    sublabel: "$200M Deal Diligence, Valuation Adjustments & Indemnity Escrow",
    icon: Briefcase,
    color: "from-rose-400 to-amber-500",
    priorities: [
      { id: "mna_stress_test", label: "$200M Acquisition Stress-Testing", description: "Clean-room re-engineering costing and valuation adjustments." },
      { id: "daam_benchmarks", label: "Data-As-A-Moat (DAAM) Market Risk Curves", description: "Benchmark deal terms against thousands of indexed contracts." },
      { id: "bi_directional_dispatch", label: "1-Click Redlined Term Sheet & Jira Dispatch", description: "Turn diligence findings into legal redlines and executive tasks." },
    ],
    defaultChecklist: [
      { id: 1, text: "Run $200M Cloud M&A Counterfactual Simulation", helperText: "Evaluates GPLv3 rewrite cost & cash runway impact", helperLink: { href: "/dashboard/simulations", text: "Launch M&A Test" } },
      { id: 2, text: "Review CFO $42.0M Clean-Room Rewrite Model", helperText: "Deterministic Python calculations for valuation drops", helperLink: { href: "/dashboard/simulations", text: "Inspect Math" } },
      { id: 3, text: "Generate $130M Counter-Offer Term Sheet", helperText: "Includes $25M seller-funded IP indemnity escrow", helperLink: { href: "/dashboard/documents", text: "Export Redline" } },
      { id: 4, text: "Dispatch Mitigation Tasks to Jira Board (KAN-6)", helperText: "Assign clean-room milestones to engineering leads", helperLink: { href: "/dashboard/settings/api-keys", text: "View Dispatch" } },
    ],
    videoThumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    introTitle: "M&A Due Diligence & Valuation Command Center",
    introDescription: "Your workspace is calibrated for high-stakes corporate acquisitions, contract contradiction discovery, and valuation stress-testing.",
  },
};

type OnboardingStep = "agreement" | "role" | "jurisdiction" | "priority" | "doc_scale" | "integration" | "intro";

export function AdaptiveEnterpriseOnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("agreement");
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [selectedRole, setSelectedRole] = useState<ExecutiveRole>("CEO");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<Jurisdiction>("US_DELAWARE");
  const [selectedPriority, setSelectedPriority] = useState<string>("boardroom");
  const [selectedDocScale, setSelectedDocScale] = useState<DocScale>("CONTRACTS_PDF");
  const [selectedIntegration, setSelectedIntegration] = useState<string>("jira");

  useEffect(() => {
    // Check if user has already completed onboarding
    const isCompleted = localStorage.getItem("causarix_onboarding_completed");
    if (!isCompleted) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAgreement = () => {
    if (!agreementChecked) return;
    setCurrentStep("role");
  };

  const handleSelectRole = (role: ExecutiveRole) => {
    setSelectedRole(role);
    setSelectedPriority(ROLE_CONFIGS[role].priorities[0].id);
    setCurrentStep("jurisdiction");
  };

  const handleSelectJurisdiction = (jur: Jurisdiction) => {
    setSelectedJurisdiction(jur);
    setCurrentStep("priority");
  };

  const handleSelectPriority = (priorityId: string) => {
    setSelectedPriority(priorityId);
    setCurrentStep("doc_scale");
  };

  const handleSelectDocScale = (scaleId: DocScale) => {
    setSelectedDocScale(scaleId);
    setCurrentStep("integration");
  };

  const handleSelectIntegration = (integId: string) => {
    setSelectedIntegration(integId);
    setCurrentStep("intro");
  };

  const handleFinishOnboarding = () => {
    // Persist completion so it is NEVER asked again
    localStorage.setItem("causarix_onboarding_completed", "true");
    localStorage.setItem("causarix_user_persona", JSON.stringify({
      role: selectedRole,
      jurisdiction: selectedJurisdiction,
      priority: selectedPriority,
      docScale: selectedDocScale,
      integration: selectedIntegration,
      completedAt: new Date().toISOString()
    }));
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const currentRoleConfig = ROLE_CONFIGS[selectedRole];

  return (
    // Compulsory Overlay - Cannot close by clicking background
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-4xl bg-base-100 border border-base-300 rounded-3xl shadow-2xl overflow-hidden relative my-auto"
      >
        {/* Top Compulsory Progress Header */}
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
                  {currentStep === "agreement" && "STEP 1/7"}
                  {currentStep === "role" && "STEP 2/7"}
                  {currentStep === "jurisdiction" && "STEP 3/7"}
                  {currentStep === "priority" && "STEP 4/7"}
                  {currentStep === "doc_scale" && "STEP 5/7"}
                  {currentStep === "integration" && "STEP 6/7"}
                  {currentStep === "intro" && "FINAL STEP 7/7"}
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-base-content mt-0.5">
                Causarix Enterprise Sovereign Intelligence Setup
              </h3>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1 font-mono text-xs">
            {["agreement", "role", "jurisdiction", "priority", "doc_scale", "integration", "intro"].map((s, idx) => (
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

        {/* STEP 1: Enterprise Legal Agreement (Compulsory) */}
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
                onClick={handleAcceptAgreement}
                disabled={!agreementChecked}
                className="font-mono text-xs font-bold gap-2 py-3 px-8 bg-primary text-primary-foreground shadow-md"
              >
                <span>Accept & Begin Role Profiling</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Executive Role Selection */}
        {currentStep === "role" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-base-content">
                What is your primary executive role?
              </h2>
              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                Causarix will automatically tailor its 10-Agent AI boardroom, invariant rules, and guided tutorial to your exact responsibilities.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(Object.keys(ROLE_CONFIGS) as ExecutiveRole[]).map((roleKey) => {
                const conf = ROLE_CONFIGS[roleKey];
                const Icon = conf.icon;
                const isSelected = selectedRole === roleKey;

                return (
                  <div
                    key={roleKey}
                    onClick={() => handleSelectRole(roleKey)}
                    className={cn(
                      "p-5 rounded-2xl border transition-all cursor-pointer space-y-3 hover:border-primary group backdrop-blur-sm flex flex-col justify-between",
                      isSelected ? "bg-primary/10 border-primary shadow-md" : "bg-base-200/50 border-base-300"
                    )}
                  >
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-sm text-base-content group-hover:text-primary transition-colors">
                        {conf.label}
                      </h4>
                      <p className="text-[11px] text-base-content/70 leading-relaxed">
                        {conf.sublabel}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] font-mono font-bold text-primary">
                      <span>Select Role</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Compliance Jurisdiction Selection */}
        {currentStep === "jurisdiction" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-primary font-bold">
                <span>ROLE: {currentRoleConfig.label}</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-base-content">
                What is your primary compliance jurisdiction?
              </h2>
              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                Calibrates automated contract redlining, liability cap standards, and statutory citations.
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
                      isSelected ? "bg-primary/10 border-primary shadow-sm" : "bg-base-200/50 border-base-300 hover:border-base-content/40"
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
                ← Back to Roles
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Strategic Bottleneck (Dynamic Branching based on Role) */}
        {currentStep === "priority" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-primary font-bold">
                <span>ROLE: {currentRoleConfig.label}</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-base-content">
                What is your biggest operational bottleneck right now?
              </h2>
              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                Choose what you want Causarix to calibrate and prioritize first in your workspace.
              </p>
            </div>

            <div className="space-y-3">
              {currentRoleConfig.priorities.map((p) => {
                const isSelected = selectedPriority === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPriority(p.id)}
                    className={cn(
                      "p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4",
                      isSelected ? "bg-primary/10 border-primary shadow-sm" : "bg-base-200/50 border-base-300 hover:border-base-content/40"
                    )}
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-base-content">{p.label}</h4>
                      <p className="text-xs text-base-content/70">{p.description}</p>
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
                onClick={() => setCurrentStep("jurisdiction")}
                className="font-mono text-xs font-bold text-base-content/70 hover:text-base-content"
              >
                ← Back to Jurisdiction
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Primary Document Library & File Formats */}
        {currentStep === "doc_scale" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-base-content">
                What is your primary document library type?
              </h2>
              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                Configures our dual-core OCR parser, Python sandbox, or KùzuDB graph engine for maximum throughput.
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
                      "p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 flex flex-col justify-between",
                      isSelected ? "bg-primary/10 border-primary shadow-sm" : "bg-base-200/50 border-base-300 hover:border-base-content/40"
                    )}
                  >
                    <div className="space-y-1.5">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-sm text-base-content">{doc.label}</h4>
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
                onClick={() => setCurrentStep("priority")}
                className="font-mono text-xs font-bold text-base-content/70 hover:text-base-content"
              >
                ← Back to Priorities
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Action Dispatch Integration Target */}
        {currentStep === "integration" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-base-content">
                Select your default action dispatch destination
              </h2>
              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                When the 10-Agent Boardroom reaches quorum, where should Causarix automatically dispatch mitigation tasks?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: "jira", label: "Atlassian Jira Cloud (Project KAN)", desc: "Creates P0 risk mitigation tickets directly on your Jira board." },
                { id: "github", label: "GitHub Repositories & PRs", desc: "Automated license scanning and pull request invariant audits." },
                { id: "slack", label: "Slack & Microsoft Teams", desc: "Delivers daily Chief of Staff audio briefs and urgent alerts." },
                { id: "erp", label: "QuickBooks / Stripe Webhooks", desc: "Connects real-time cashflow feeds for 90-day telemetry tuning." },
              ].map((integ) => {
                const isSelected = selectedIntegration === integ.id;
                return (
                  <div
                    key={integ.id}
                    onClick={() => handleSelectIntegration(integ.id)}
                    className={cn(
                      "p-4 rounded-2xl border transition-all cursor-pointer space-y-2 flex flex-col justify-between",
                      isSelected ? "bg-primary/10 border-primary shadow-sm" : "bg-base-200/50 border-base-300 hover:border-base-content/40"
                    )}
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-base-content">{integ.label}</h4>
                      <p className="text-xs text-base-content/70">{integ.desc}</p>
                    </div>
                    <div className="pt-2 flex items-center justify-between text-[11px] font-mono font-bold text-primary">
                      <span>Connect Integration</span>
                      <ChevronRight className="w-3.5 h-3.5" />
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
                ← Back to Document Types
              </button>
            </div>
          </div>
        )}

        {/* FINAL STEP 7: Customized Guided App Intro & Dynamic Interactive Checklist */}
        {currentStep === "intro" && (
          <div className="p-6 sm:p-8 space-y-6">
            <AnimatedOnboardingChecklist
              title={currentRoleConfig.introTitle}
              description={currentRoleConfig.introDescription}
              items={currentRoleConfig.defaultChecklist}
              videoThumbnailUrl={currentRoleConfig.videoThumbnail}
              videoUrl={currentRoleConfig.videoUrl}
              stepDuration={3000}
              autoAdvance={true}
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-base-200 border border-base-300">
              <div className="text-xs text-base-content/70">
                <span>🛡️ Calibration complete for <strong>{currentRoleConfig.label}</strong> ({selectedJurisdiction}). You will never be prompted again.</span>
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
      </motion.div>
    </div>
  );
}

export default AdaptiveEnterpriseOnboardingModal;
