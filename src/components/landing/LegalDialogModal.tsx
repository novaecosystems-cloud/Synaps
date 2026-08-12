"use client";

import React from 'react';
import { X, ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type LegalDocType = 'terms' | 'privacy' | 'security' | 'cookies';

interface LegalDialogModalProps {
  type: LegalDocType | null;
  onClose: () => void;
}

const LEGAL_DOCS: Record<LegalDocType, { title: string; subtitle: string; icon: any; content: React.ReactNode }> = {
  terms: {
    title: "Terms of Service & SLA Agreement",
    subtitle: "Effective Date: August 2026 · Synaps Enterprise AI Operating Platform",
    icon: FileText,
    content: (
      <div className="space-y-4 text-xs leading-relaxed text-slate-300">
        <h4 className="text-sm font-bold text-white">1. Service Scope & Zero-Hallucination SLA</h4>
        <p>
          Synaps provides an Autonomous AI Executive Boardroom & RAG Document Intelligence Engine. 
          Subscribers are granted a non-exclusive, enterprise-wide license to process documents, execute multi-agent boardroom simulations, and query corporate knowledge graphs.
        </p>

        <h4 className="text-sm font-bold text-white">2. AI Credit Allocation & Usage Quotas</h4>
        <p>
          - <strong>Free / Member Tier:</strong> 50 AI Credits per day (~10-15 standard prompts).<br />
          - <strong>Pro / Admin Tier:</strong> 500 AI Credits per day (~60-80 document RAG queries).<br />
          - <strong>Enterprise Max Tier:</strong> 10,000 AI Credits per day (~250-400 multi-agent simulations).<br />
          - <strong>BYOK (Bring Your Own Key):</strong> Unlimited credit quotas apply when using custom API keys.
        </p>

        <h4 className="text-sm font-bold text-white">3. Data Ownership & Intellectual Property</h4>
        <p>
          You retain 100% ownership of all uploaded corporate documents, vector embeddings, meeting transcripts, and synthesized outputs. 
          Synaps does NOT use subscriber data to train public foundation models.
        </p>
      </div>
    )
  },
  privacy: {
    title: "Privacy & Data Protection Policy",
    subtitle: "Compliance: EU GDPR · India DPDP Act 2023 · US CCPA/CPRA",
    icon: Lock,
    content: (
      <div className="space-y-4 text-xs leading-relaxed text-slate-300">
        <h4 className="text-sm font-bold text-white">1. Data Encryption & Isolation</h4>
        <p>
          All subscriber data is encrypted in transit via TLS 1.3 and at rest via AES-256 GCM. 
          Document vector chunks are isolated using PostgreSQL Row-Level Security (RLS) scoped strictly by Organization ID.
        </p>

        <h4 className="text-sm font-bold text-white">2. Zero Public Model Training Guarantee</h4>
        <p>
          Synaps operates strict API boundaries. Document chunks processed through LLM routers (Groq, Google Gemini) are executed under zero-retention Enterprise API terms and are never stored or repurposed for LLM training.
        </p>

        <h4 className="text-sm font-bold text-white">3. Data Deletion & Right to be Forgotten</h4>
        <p>
          Subscribers can purge their organization document vault, vector index, and decision memory graph at any time with 1-click execution.
        </p>
      </div>
    )
  },
  security: {
    title: "Security, Auditing & Compliance Standard",
    subtitle: "Certifications: SOC 2 Type II · ISO 27001 · HIPAA Compliant Vault",
    icon: ShieldCheck,
    content: (
      <div className="space-y-4 text-xs leading-relaxed text-slate-300">
        <h4 className="text-sm font-bold text-white">1. Real-Time Immutable Audit Logging</h4>
        <p>
          Every API call, document upload, credit consumption event, and boardroom verdict is recorded in an immutable audit ledger with user ID, IP address, timestamp, and cryptographic hash verification.
        </p>

        <h4 className="text-sm font-bold text-white">2. Role-Based Access Control (RBAC)</h4>
        <p>
          - <strong>Owner / Leader:</strong> Full access to financial billing, security logs, and executive team overrides.<br />
          - <strong>Admin / Manager:</strong> Document vault ingestion and workspace management.<br />
          - <strong>Member / Guest:</strong> Read-only query access to authorized document collections.
        </p>
      </div>
    )
  },
  cookies: {
    title: "Cookie & Preference Policy",
    subtitle: "Essential Session Cookies & Preference Tracking",
    icon: CheckCircle2,
    content: (
      <div className="space-y-4 text-xs leading-relaxed text-slate-300">
        <h4 className="text-sm font-bold text-white">1. Essential Authentication Cookies</h4>
        <p>
          We use strictly necessary HTTP-only authentication cookies (<code>synaps-session</code>) to maintain secure session state. These cookies expire upon logout or session termination.
        </p>

        <h4 className="text-sm font-bold text-white">2. No Third-Party Tracking Pixels</h4>
        <p>
          Synaps does NOT run invasive third-party ad tracking scripts or data broker pixels on dashboard interfaces.
        </p>
      </div>
    )
  }
};

export function LegalDialogModal({ type, onClose }: LegalDialogModalProps) {
  if (!type) return null;
  const doc = LEGAL_DOCS[type];
  const Icon = doc.icon;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-6 text-white overflow-hidden">
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{doc.title}</h3>
              <p className="text-[11px] font-mono text-cyan-400/80">{doc.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-2 prompt-scrollbar space-y-4">
          {doc.content}
        </div>

        <div className="border-t border-white/10 pt-4 flex justify-between items-center text-[11px] font-mono text-white/50">
          <span>Synaps Enterprise Governance Framework</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold uppercase tracking-wider hover:bg-white transition-colors"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
}
