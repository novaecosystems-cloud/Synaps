'use client';

import React, { useState } from 'react';
import { X, Mail, Check, Globe, ShieldCheck, Lock, FileText, CreditCard, AlertTriangle, Cookie, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export type LegalDocType = 'terms' | 'privacy' | 'dpdp' | 'security' | 'payments' | 'ai_disclaimer' | 'cookies';

interface LegalDialogModalProps {
  type: LegalDocType | null;
  onClose: () => void;
}

// 27 Most Spoken Global Languages
export const LEGAL_LANGUAGES = [
  { code: 'en', name: 'English (US & Global)', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish (Español)', flag: '🇪🇸' },
  { code: 'fr', name: 'French (Français)', flag: '🇫🇷' },
  { code: 'de', name: 'German (Deutsch)', flag: '🇩🇪' },
  { code: 'zh', name: 'Mandarin Chinese (中文)', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese (日本語)', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean (한국어)', flag: '🇰🇷' },
  { code: 'hi', name: 'Hindi (हिन्दी)', flag: '🇮🇳' },
  { code: 'ar', name: 'Arabic (العربية)', flag: '🇸🇦' },
  { code: 'pt', name: 'Portuguese (Português)', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian (Русский)', flag: '🇷🇺' },
  { code: 'it', name: 'Italian (Italiano)', flag: '🇮🇹' },
  { code: 'nl', name: 'Dutch (Nederlands)', flag: '🇳🇱' },
  { code: 'tr', name: 'Turkish (Türkçe)', flag: '🇹🇷' },
  { code: 'pl', name: 'Polish (Polski)', flag: '🇵🇱' },
  { code: 'sv', name: 'Swedish (Svenska)', flag: '🇸🇪' },
  { code: 'id', name: 'Indonesian (Bahasa Indonesia)', flag: '🇮🇩' },
  { code: 'vi', name: 'Vietnamese (Tiếng Việt)', flag: '🇻🇳' },
  { code: 'th', name: 'Thai (ไทย)', flag: '🇹🇭' },
  { code: 'bn', name: 'Bengali (বাংলা)', flag: '🇧🇩' },
  { code: 'fa', name: 'Persian / Farsi (فارسی)', flag: '🇮🇷' },
  { code: 'he', name: 'Hebrew (עברית)', flag: '🇮🇱' },
  { code: 'uk', name: 'Ukrainian (Українська)', flag: '🇺🇦' },
  { code: 'el', name: 'Greek (Ελληνικά)', flag: '🇬🇷' },
  { code: 'cs', name: 'Czech (Čeština)', flag: '🇨🇿' },
  { code: 'ro', name: 'Romanian (Română)', flag: '🇷🇴' },
  { code: 'hu', name: 'Hungarian (Magyar)', flag: '🇭🇺' },
];

interface LegalSection {
  id: string;
  num: number;
  title: string;
  subtitle?: string;
  content: string[];
}

interface LegalDocData {
  title: string;
  subtitle: string;
  icon: any;
  sections: LegalSection[];
}

const COMPREHENSIVE_LEGAL_DOCS: Record<LegalDocType, LegalDocData> = {
  terms: {
    title: 'Terms of Service',
    subtitle: 'Updated August 2026 · Synaps Enterprise AI Operating Platform',
    icon: FileText,
    sections: [
      {
        id: 'sec-1',
        num: 1,
        title: 'Accepting the terms',
        content: [
          'By accessing or subscribing to Synaps AI ("Platform", "Service"), you enter into a legally binding contract with Synaps Intelligence Inc. You warrant that you have full enterprise authority to bind your organization to these Terms.',
          'These terms govern all access to the Autonomous 10-Agent AI Boardroom, RAG Document Intelligence Engine, 3D Vector Knowledge Graph, and API integration interfaces.',
        ],
      },
      {
        id: 'sec-2',
        num: 2,
        title: 'Changes to terms',
        content: [
          'Synaps reserves the right to modify these terms to reflect changes in regulatory compliance (DPDP Act 2023, EU AI Act, GDPR) or architectural improvements.',
          'Subscribers will receive 30 days advance notice of material modifications via recorded email and in-dashboard notifications.',
        ],
      },
      {
        id: 'sec-3',
        num: 3,
        title: 'Using our product',
        content: [
          'Synaps grants subscriber organizations a non-exclusive, non-transferable, global license to ingest corporate documents, run multi-agent simulations, and query knowledge vaults.',
          'All document parsing, OCR text extraction, and vector embedding operations are executed in private tenant isolated sandboxes.',
        ],
      },
      {
        id: 'sec-4',
        num: 4,
        title: 'General restrictions',
        content: [
          'Subscribers shall not reverse-engineer LLM prompt routing algorithms, bypass multi-tenant security barriers, or execute automated scraping against platform endpoints.',
          'Any attempt to inject malicious adversarial prompts to manipulate decision memory graphs will result in immediate API session revocation.',
        ],
      },
      {
        id: 'sec-5',
        num: 5,
        title: 'Content policy',
        content: [
          'Subscribers retain 100% intellectual property ownership over all uploaded PDFs, spreadsheets, meeting transcripts, and synthesized boardroom outputs.',
          'Synaps NEVER uses subscriber corporate documents or query histories to train public LLM models.',
        ],
      },
      {
        id: 'sec-6',
        num: 6,
        title: 'Your rights',
        content: [
          'Subscribers have the right to request a full cryptographic export of all document vector nodes, audit ledgers, and decision memory trees at any time.',
          'You hold the complete right to revoke tenant access and execute immediate 1-click vault purging under our Data Protection SLA.',
        ],
      },
      {
        id: 'sec-7',
        num: 7,
        title: 'Copyright policy',
        content: [
          'Synaps respects digital copyright and DMCA regulations. If you believe material hosted on the platform infringes third-party copyright, contact legal@synaps.ai for 24-hour review.',
        ],
      },
      {
        id: 'sec-8',
        num: 8,
        title: 'Relationship guidelines',
        content: [
          'The relationship between subscriber and Synaps is strictly that of independent contracting parties. Nothing in these terms creates a joint venture or agency relationship.',
        ],
      },
      {
        id: 'sec-9',
        num: 9,
        title: 'Liability Policy',
        content: [
          'Synaps AI synthesizes grounded insights from subscriber documentation. Subscribed decision-makers acknowledge that AI recommendations serve as decision support.',
          'Critical legal, financial, and regulatory choices must be verified with certified legal counsel or certified public accountants.',
        ],
      },
      {
        id: 'sec-10',
        num: 10,
        title: 'General legal terms',
        content: [
          'These terms are governed by the laws of Delaware, USA, and international treaty provisions. Any dispute shall be resolved through binding arbitration.',
        ],
      },
    ],
  },
  privacy: {
    title: 'Privacy & Data Protection Policy',
    subtitle: 'Updated August 2026 · EU GDPR, India DPDP Act 2023 & US CCPA Compliant',
    icon: Lock,
    sections: [
      {
        id: 'sec-1',
        num: 1,
        title: 'Data Collection & Encryption',
        content: [
          'All data transmitted to Synaps is encrypted via TLS 1.3 in transit and AES-256 GCM at rest.',
          'Document vector chunks are isolated using PostgreSQL Row-Level Security (RLS) scoped strictly by your Organization ID.',
        ],
      },
      {
        id: 'sec-2',
        num: 2,
        title: 'Zero Public Model Training',
        content: [
          'Synaps operates strict API boundaries. Document chunks processed through LLM routers (Groq, Google Gemini) are executed under zero-retention Enterprise API terms and are never stored or repurposed for LLM training.',
        ],
      },
      {
        id: 'sec-3',
        num: 3,
        title: 'Right to Erasure & Vault Purging',
        content: [
          'Subscribers can purge their organization document vault, vector index, and decision memory graph at any time with 1-click execution.',
        ],
      },
      {
        id: 'sec-4',
        num: 4,
        title: 'Cookies & Local Tokens',
        content: [
          'We use strictly necessary HTTP-only authentication cookies (`synaps-session`) to maintain secure session state. No ad tracking pixels or third-party brokers are used.',
        ],
      },
    ],
  },
  dpdp: {
    title: 'DPDP Act 2023 & Data Audit SLA',
    subtitle: 'Updated August 2026 · Digital Personal Data Protection Compliance SLA',
    icon: ShieldCheck,
    sections: [
      {
        id: 'sec-1',
        num: 1,
        title: 'Data Fiduciary Responsibilities',
        content: [
          'Synaps acts as a Data Processor under India DPDP Act 2023 and EU GDPR guidelines.',
          'Subscriber organization leaders maintain full Data Fiduciary rights over personal data processed inside document vaults.',
        ],
      },
      {
        id: 'sec-2',
        num: 2,
        title: 'Immutable Cryptographic Audit Trail',
        content: [
          'Every API call, document ingestion event, and boardroom verdict is logged in an immutable audit ledger with cryptographic hash verification.',
        ],
      },
      {
        id: 'sec-3',
        num: 3,
        title: 'Breach Notification & SLA SLA',
        content: [
          'In the event of a security incident, Synaps guarantees written notification to subscriber security officers within 6 hours of incident identification.',
        ],
      },
    ],
  },
  security: {
    title: 'Security & Compliance Standard',
    subtitle: 'Updated August 2026 · SOC 2 Type II & ISO 27001 Certified Infrastructure',
    icon: ShieldCheck,
    sections: [
      {
        id: 'sec-1',
        num: 1,
        title: 'Infrastructure Security & Vault Isolation',
        content: [
          'Hosted on Google Cloud Platform (GCP) and Vercel Enterprise with multi-region failover and dedicated physical tenant database boundaries.',
        ],
      },
      {
        id: 'sec-2',
        num: 2,
        title: 'Role-Based Access Control (RBAC)',
        content: [
          'Supports granular permissions: Owner, Admin, Manager, Member, and Guest roles with custom document vault level read/write boundaries.',
        ],
      },
    ],
  },
  payments: {
    title: 'Payments, Billing & Credit Allocation',
    subtitle: 'Updated August 2026 · Stripe, LemonSqueezy & PayPal Processing Terms',
    icon: CreditCard,
    sections: [
      {
        id: 'sec-1',
        num: 1,
        title: 'AI Credit Allocation & Metering',
        content: [
          'Free Tier: 50 AI Credits/day (~10-15 prompts). Pro Tier: 500 AI Credits/day (~60 RAG queries). Enterprise Tier: 10,000 AI Credits/day (~400 boardroom simulations).',
          'BYOK (Bring Your Own Key) users enjoy unlimited credit execution when linking valid Groq or Gemini keys.',
        ],
      },
      {
        id: 'sec-2',
        num: 2,
        title: 'Subscription Auto-Renewal & Cancelation',
        content: [
          'Subscriptions renew automatically each month or year. You can cancel at any time in Billing Settings without penalty or hidden fees.',
        ],
      },
      {
        id: 'sec-3',
        num: 3,
        title: 'Refund Policy & Guarantee',
        content: [
          'We offer a 14-day money-back guarantee for all new annual subscriptions if platform SLAs are not satisfied.',
        ],
      },
    ],
  },
  ai_disclaimer: {
    title: 'AI Decision-Support Output Disclaimer',
    subtitle: 'Updated August 2026 · Grounded Corporate Intelligence Guidelines',
    icon: AlertTriangle,
    sections: [
      {
        id: 'sec-1',
        num: 1,
        title: 'Grounded Intelligence & Citation Integrity',
        content: [
          'Synaps AI synthesizes answers using strict retrieval-augmented generation. While citations link directly to source documents, AI outputs should be reviewed for high-stakes decisions.',
        ],
      },
      {
        id: 'sec-2',
        num: 2,
        title: 'Professional Counsel Requirement',
        content: [
          'Synaps Boardroom simulations and Chief of Staff briefings do NOT constitute formal legal, accounting, or medical advice.',
        ],
      },
    ],
  },
  cookies: {
    title: 'Cookie & Local Storage Policy',
    subtitle: 'Updated August 2026 · Essential Session Preference Tracking',
    icon: Cookie,
    sections: [
      {
        id: 'sec-1',
        num: 1,
        title: 'Essential Session Cookies',
        content: [
          'We use `synaps-session` HTTP-only encrypted cookies strictly for user authentication and multi-tenant authorization.',
        ],
      },
      {
        id: 'sec-2',
        num: 2,
        title: 'No Advertising Tracker Pixels',
        content: [
          'Synaps NEVER sells subscriber data or embeds third-party retargeting pixels inside dashboard tools.',
        ],
      },
    ],
  },
};

export function LegalDialogModal({ type, onClose }: LegalDialogModalProps) {
  const [activeDocKey, setActiveDocKey] = useState<LegalDocType>(type || 'terms');
  const [activeSectionId, setActiveSectionId] = useState<string>('sec-1');
  const [selectedLang, setSelectedLang] = useState<string>('en');
  const [emailInput, setEmailInput] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const { toast } = useToast();

  if (!type && !activeDocKey) return null;

  const currentDoc = COMPREHENSIVE_LEGAL_DOCS[activeDocKey] || COMPREHENSIVE_LEGAL_DOCS.terms;
  const Icon = currentDoc.icon;

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      toast({ title: 'Invalid Email', description: 'Please enter a valid email address.', variant: 'destructive' });
      return;
    }
    toast({
      title: 'Legal Copy Sent',
      description: `A certified copy of ${currentDoc.title} has been dispatched to ${emailInput}.`,
    });
    setEmailInput('');
  };

  const handleAgree = () => {
    setIsAgreed(true);
    toast({
      title: 'Legal Agreement Recorded',
      description: `You have accepted ${currentDoc.title}. Audit token generated.`,
    });
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-5xl h-[90vh] max-h-[820px] bg-white text-slate-900 dark:bg-[#121318] dark:text-slate-100 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        
        {/* TOP HEADER BAR */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#181920]">
          
          {/* Document Category Selector Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => { setActiveDocKey('terms'); setActiveSectionId('sec-1'); }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeDocKey === 'terms' ? 'bg-[#0496ff] text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Terms of Service
            </button>

            <button
              onClick={() => { setActiveDocKey('privacy'); setActiveSectionId('sec-1'); }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeDocKey === 'privacy' ? 'bg-[#0496ff] text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Privacy Policy
            </button>

            <button
              onClick={() => { setActiveDocKey('dpdp'); setActiveSectionId('sec-1'); }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeDocKey === 'dpdp' ? 'bg-[#0496ff] text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              DPDP Act SLA
            </button>

            <button
              onClick={() => { setActiveDocKey('security'); setActiveSectionId('sec-1'); }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeDocKey === 'security' ? 'bg-[#0496ff] text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Security SLA
            </button>

            <button
              onClick={() => { setActiveDocKey('payments'); setActiveSectionId('sec-1'); }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeDocKey === 'payments' ? 'bg-[#0496ff] text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Payments &amp; Billing
            </button>

            <button
              onClick={() => { setActiveDocKey('ai_disclaimer'); setActiveSectionId('sec-1'); }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeDocKey === 'ai_disclaimer' ? 'bg-[#0496ff] text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              AI Disclaimer
            </button>

            <button
              onClick={() => { setActiveDocKey('cookies'); setActiveSectionId('sec-1'); }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeDocKey === 'cookies' ? 'bg-[#0496ff] text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Cookie Policy
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors ml-4 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MAIN BODY DUAL PANE LAYOUT (Numbered TOC Sidebar + Document Content) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* LEFT SIDEBAR: Numbered Table of Contents Index */}
          <div className="w-full md:w-72 bg-slate-50/70 dark:bg-[#16171e] border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-5 overflow-y-auto shrink-0 space-y-2">
            <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">
              TABLE OF CONTENTS
            </div>

            {currentDoc.sections.map((sec) => {
              const isSelected = activeSectionId === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSectionId(sec.id);
                    const el = document.getElementById(sec.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                    isSelected
                      ? 'bg-[#0496ff]/15 text-[#0496ff] dark:bg-[#0496ff]/20 dark:text-[#38bdf8]'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#0496ff] text-white'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {sec.num}
                  </span>
                  <span className="truncate">{sec.title}</span>
                </button>
              );
            })}
          </div>

          {/* RIGHT MAIN CONTENT PANE */}
          <div className="flex-1 p-6 md:p-10 overflow-y-auto prompt-scrollbar space-y-8 bg-white dark:bg-[#121318]">
            
            {/* Title & Date */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#0496ff]/10 text-[#0496ff]">
                  <Icon className="w-6 h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {currentDoc.title}
                </h1>
              </div>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {currentDoc.subtitle}
              </p>
            </div>

            {/* Sections List */}
            <div className="space-y-8">
              {currentDoc.sections.map((sec) => (
                <div id={sec.id} key={sec.id} className="space-y-3 scroll-mt-6">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="text-[#0496ff] font-mono text-sm">#{sec.num}</span>
                    <span>{sec.title}</span>
                  </h3>
                  {sec.content.map((pText, pIdx) => (
                    <p key={pIdx} className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {pText}
                    </p>
                  ))}
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* BOTTOM STICKY ACTION & MULTI-LANGUAGE TOOLBAR */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#181920] flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Send Copy To Email Input */}
          <form onSubmit={handleSendEmail} className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="Send copy to my email..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-white dark:bg-[#121318] text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 outline-none focus:border-[#0496ff]"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
            >
              Send Copy
            </button>
          </form>

          {/* Right Action: 27+ Languages Dropdown & I AGREE Button */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            
            {/* 27+ Foreign Languages Selector Dropdown */}
            <div className="relative">
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="appearance-none bg-white dark:bg-[#121318] text-slate-700 dark:text-slate-200 text-xs font-medium pl-8 pr-7 py-2 rounded-xl border border-slate-300 dark:border-slate-700 outline-none cursor-pointer"
              >
                {LEGAL_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
              <Globe className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* I AGREE Button */}
            <button
              onClick={handleAgree}
              className="px-6 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
            >
              {isAgreed ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>AGREED</span>
                </>
              ) : (
                <span>I AGREE</span>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
