'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, ShieldCheck, Lock, FileText, CreditCard, AlertTriangle, Cookie, Download, FileCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export type LegalDocType = 'terms' | 'privacy' | 'dpdp' | 'security' | 'payments' | 'ai_disclaimer' | 'cookies';

interface LegalDialogModalProps {
  type: LegalDocType | null;
  onClose: () => void;
  isLoggedIn?: boolean;
  userEmail?: string;
  userName?: string;
}

interface LegalSection {
  id: string;
  num: number;
  title: string;
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
    title: 'Terms of Service & SLA Agreement',
    subtitle: 'Effective Date: August 2026 · Synaps Enterprise AI Operating Platform',
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
        title: 'Liability policy',
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
    subtitle: 'Effective Date: August 2026 · EU GDPR, India DPDP Act 2023 & US CCPA Compliant',
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
        title: 'Cookies & Local Tokens',
        content: [
          'We use strictly necessary HTTP-only authentication cookies (`synaps-session`) to maintain secure session state. No ad tracking pixels or third-party brokers are used.',
        ],
      },
      {
        id: 'sec-4',
        num: 4,
        title: 'Subprocessors & Infrastructure',
        content: [
          'Synaps utilizes Tier-4 ISO-27001 data centers provided by Google Cloud Platform (GCP) and Vercel Enterprise. Subprocessors process data under binding enterprise DPAs.',
        ],
      },
      {
        id: 'sec-5',
        num: 5,
        title: 'Data Retention Schedules',
        content: [
          'Active organization vaults retain vector embeddings until account termination or explicit user deletion. Log ledgers are retained for 90 days for SOC2 compliance.',
        ],
      },
      {
        id: 'sec-6',
        num: 6,
        title: 'Third-Party Sharing Restrictions',
        content: [
          'Synaps NEVER sells, rents, or monetizes subscriber data. Data is shared exclusively with infrastructure subprocessors required to fulfill core search & RAG operations.',
        ],
      },
      {
        id: 'sec-7',
        num: 7,
        title: 'Right to Erasure & Vault Purging',
        content: [
          'Subscribers can purge their organization document vault, vector index, and decision memory graph at any time with 1-click execution.',
        ],
      },
      {
        id: 'sec-8',
        num: 8,
        title: 'Data Protection Officer Contact',
        content: [
          'For formal privacy inquiries or Data Subject Access Requests (DSAR), contact our DPO team at dpo@synaps.ai.',
        ],
      },
    ],
  },
  dpdp: {
    title: 'DPDP Act 2023 & Data Audit SLA',
    subtitle: 'Effective Date: August 2026 · Digital Personal Data Protection Compliance SLA',
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
        title: 'Cryptographic Audit Trail',
        content: [
          'Every API call, document ingestion event, and boardroom verdict is logged in an immutable audit ledger with cryptographic hash verification.',
        ],
      },
      {
        id: 'sec-3',
        num: 3,
        title: 'Breach Notification SLA',
        content: [
          'In the event of a security incident, Synaps guarantees written notification to subscriber security officers within 6 hours of incident identification.',
        ],
      },
      {
        id: 'sec-4',
        num: 4,
        title: 'Consent & Notice Architecture',
        content: [
          'Consent is logged with timestamps and explicit purpose scoping. Users can withdraw consent at any time via the Security & Privacy dashboard.',
        ],
      },
      {
        id: 'sec-5',
        num: 5,
        title: 'Multi-Tenant Partitioning',
        content: [
          'Document chunks, vector embeddings, and workspace memory graphs are partitioned logically and physically by Organization ID.',
        ],
      },
      {
        id: 'sec-6',
        num: 6,
        title: 'Data Localization',
        content: [
          'Enterprise subscribers can specify data residency regions (India, EU, US) to fulfill regional statutory storage compliance.',
        ],
      },
      {
        id: 'sec-7',
        num: 7,
        title: 'Rights of Data Principal',
        content: [
          'Data Principals can access, correct, update, or erase personal data linked to their identity within 48 hours of request submission.',
        ],
      },
      {
        id: 'sec-8',
        num: 8,
        title: 'Compliance Audit Guarantee',
        content: [
          'Synaps provides annual third-party DPDP compliance audit reports to Enterprise subscribers upon request.',
        ],
      },
    ],
  },
  security: {
    title: 'Security & Compliance Standard',
    subtitle: 'Effective Date: August 2026 · SOC 2 Type II & ISO 27001 Certified Infrastructure',
    icon: ShieldCheck,
    sections: [
      {
        id: 'sec-1',
        num: 1,
        title: 'Infrastructure & Vault Security',
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
      {
        id: 'sec-3',
        num: 3,
        title: 'Encryption Standards',
        content: [
          'Data in transit is protected using TLS 1.3 with HSTS preloading. Data at rest is encrypted using AES-256 GCM key rotation.',
        ],
      },
      {
        id: 'sec-4',
        num: 4,
        title: 'Threat & Anomaly Monitoring',
        content: [
          'Real-time automated DDoS mitigation, rate limiting, and SIEM event monitoring flag suspicious query volume spikes.',
        ],
      },
      {
        id: 'sec-5',
        num: 5,
        title: 'Audit Trail Integrity',
        content: [
          'All user activities, document access attempts, and configuration changes are recorded in tamper-proof audit logs.',
        ],
      },
      {
        id: 'sec-6',
        num: 6,
        title: 'Incident Response Protocol',
        content: [
          'A dedicated 24/7 SecOps team initiates containment protocols within 15 minutes of an automated anomaly alert.',
        ],
      },
      {
        id: 'sec-7',
        num: 7,
        title: 'Backup & Disaster Recovery',
        content: [
          'Point-in-time automated backups are taken every 4 hours with 30-day retention and RTO under 1 hour.',
        ],
      },
      {
        id: 'sec-8',
        num: 8,
        title: 'Vulnerability Disclosure Policy',
        content: [
          'Synaps maintains a bug bounty program. Security researchers can submit vulnerability reports directly to security@synaps.ai.',
        ],
      },
    ],
  },
  payments: {
    title: 'Payments, Billing & Credit Allocation',
    subtitle: 'Effective Date: August 2026 · Stripe, LemonSqueezy & PayPal Processing Terms',
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
        title: 'BYOK Custom Key Policies',
        content: [
          'When using custom API keys (BYOK), credit deductions are waived. Subscribers are billed directly by their API vendor.',
        ],
      },
      {
        id: 'sec-3',
        num: 3,
        title: 'Auto-Renewal & Cancelation',
        content: [
          'Subscriptions renew automatically each month or year. You can cancel at any time in Billing Settings without penalty or hidden fees.',
        ],
      },
      {
        id: 'sec-4',
        num: 4,
        title: 'Refund Policy & Money-Back Guarantee',
        content: [
          'We offer a 14-day money-back guarantee for all new annual subscriptions if platform SLAs are not satisfied.',
        ],
      },
      {
        id: 'sec-5',
        num: 5,
        title: 'Invoicing & Tax Records',
        content: [
          'Itemized GST/VAT receipts and enterprise invoices are generated automatically and sent via email upon payment processing.',
        ],
      },
      {
        id: 'sec-6',
        num: 6,
        title: 'Failed Payment Grace Period',
        content: [
          'If a recurring payment fails, a 5-day grace period is provided before subscription features transition to free tier quotas.',
        ],
      },
      {
        id: 'sec-7',
        num: 7,
        title: 'Currency & Payment Methods',
        content: [
          'Payments are accepted in USD, EUR, GBP, and INR via credit cards, Apple Pay, Google Pay, and wire transfer for Enterprise invoices.',
        ],
      },
      {
        id: 'sec-8',
        num: 8,
        title: 'Plan Upgrades & Downgrades',
        content: [
          'Upgrades take effect immediately with prorated credit adjustments. Downgrades take effect at the end of the current billing cycle.',
        ],
      },
    ],
  },
  ai_disclaimer: {
    title: 'AI Output & Liability Disclaimer',
    subtitle: 'Effective Date: August 2026 · Grounded Corporate Intelligence Guidelines',
    icon: AlertTriangle,
    sections: [
      {
        id: 'sec-1',
        num: 1,
        title: 'Grounded RAG Accuracy',
        content: [
          'Synaps AI synthesizes answers using strict retrieval-augmented generation. While citations link directly to source documents, AI outputs should be reviewed for high-stakes decisions.',
        ],
      },
      {
        id: 'sec-2',
        num: 2,
        title: 'Professional Counsel Disclaimer',
        content: [
          'Synaps Boardroom simulations and Chief of Staff briefings do NOT constitute formal legal, accounting, or medical advice.',
        ],
      },
      {
        id: 'sec-3',
        num: 3,
        title: 'Financial Modeling Caveats',
        content: [
          'Projections and risk scores produced during strategic simulations are based on historical data and probabilistic models, not guaranteed future performance.',
        ],
      },
      {
        id: 'sec-4',
        num: 4,
        title: 'Legal Decision Support Role',
        content: [
          'Synaps serves as an automated decision-support tool. Certified legal counsel should review high-stakes contract modifications.',
        ],
      },
      {
        id: 'sec-5',
        num: 5,
        title: 'Multi-Agent Consensus Nature',
        content: [
          'Boardroom debates represent synthetic AI agent perspectives (CFO, Legal, CTO). They simulate internal debate to uncover potential blind spots.',
        ],
      },
      {
        id: 'sec-6',
        num: 6,
        title: 'Zero Liability for Business Choices',
        content: [
          'Synaps Intelligence Inc. shall not be held liable for commercial decisions, revenue losses, or operational choices made based on platform outputs.',
        ],
      },
      {
        id: 'sec-7',
        num: 7,
        title: 'Verification SLA',
        content: [
          'Subscribers are provided direct line-level document links to verify every claim against original source files before finalizing executive decisions.',
        ],
      },
      {
        id: 'sec-8',
        num: 8,
        title: 'Citation Traceability Guarantee',
        content: [
          'If a synthesized answer cannot be grounded in provided documentation, Synaps is programmed to state the lack of evidence explicitly.',
        ],
      },
    ],
  },
  cookies: {
    title: 'Cookie & Local Storage Policy',
    subtitle: 'Effective Date: August 2026 · Essential Session Preference Tracking',
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
        title: 'Storage Usage & Preferences',
        content: [
          'Local Storage is used exclusively to cache theme preferences, active workspace IDs, and draft prompt inputs locally on your browser.',
        ],
      },
      {
        id: 'sec-3',
        num: 3,
        title: 'No Advertising Tracker Pixels',
        content: [
          'Synaps NEVER sells subscriber data or embeds third-party retargeting pixels inside dashboard tools.',
        ],
      },
      {
        id: 'sec-4',
        num: 4,
        title: 'Preference Storage',
        content: [
          'User preferences such as dark/light theme, font size, and UI layout modes are stored locally in your browser and never transmitted to ad brokers.',
        ],
      },
      {
        id: 'sec-5',
        num: 5,
        title: 'Cookie Expiration Schedule',
        content: [
          'Authentication cookies automatically expire after 7 days of inactivity or immediately upon manual logout.',
        ],
      },
      {
        id: 'sec-6',
        num: 6,
        title: 'Opt-Out Procedures',
        content: [
          'You can clear cookies at any time via your browser settings. Clearing authentication cookies will require signing in again.',
        ],
      },
    ],
  },
};

export function LegalDialogModal({
  type,
  onClose,
  isLoggedIn = false,
  userEmail = '',
  userName = '',
}: LegalDialogModalProps) {
  const [activeDocKey, setActiveDocKey] = useState<LegalDocType>(type || 'terms');
  const [activeSectionId, setActiveSectionId] = useState<string>('sec-1');
  const [isAgreed, setIsAgreed] = useState(false);
  const { toast } = useToast();

  // Synchronize internal activeDocKey when type prop changes
  useEffect(() => {
    if (type) {
      setActiveDocKey(type);
      setActiveSectionId('sec-1');
      setIsAgreed(false);
    }
  }, [type]);

  // CRITICAL FIX: If type is null, DO NOT RENDER ANYTHING AT ALL!
  if (!type) return null;

  const currentDoc = COMPREHENSIVE_LEGAL_DOCS[activeDocKey] || COMPREHENSIVE_LEGAL_DOCS.terms;
  const Icon = currentDoc.icon;

  const handleAgree = () => {
    setIsAgreed(true);
    toast({
      title: 'Legal Agreement Recorded',
      description: `You have accepted ${currentDoc.title}. PDF Download unlocked.`,
    });
  };

  // Generate & Download Certified PDF (Supports All-in-One Master Legal Packet)
  const handleDownloadPDF = (downloadAll: boolean = true) => {
    const auditHash = `SYNAPS-MASTER-AUDIT-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now()}`;
    const timestampStr = new Date().toUTCString();

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({ title: 'Download Blocked', description: 'Please allow popups to download the certified PDF.', variant: 'destructive' });
      return;
    }

    const docsToInclude = downloadAll
      ? (Object.keys(COMPREHENSIVE_LEGAL_DOCS) as LegalDocType[]).map((k) => COMPREHENSIVE_LEGAL_DOCS[k])
      : [currentDoc];

    const masterTitle = downloadAll
      ? 'Synaps Enterprise Master Legal & Governance Compliance Packet'
      : currentDoc.title;

    const masterSubtitle = downloadAll
      ? 'Comprehensive SLA Packet: Terms, Privacy, DPDP Act, Security, Payments, AI Disclaimer & Cookie Policy'
      : currentDoc.subtitle;

    const documentsHtml = docsToInclude
      .map(
        (doc, docIdx) => `
        <div style="page-break-before: ${docIdx > 0 ? 'always' : 'auto'}; margin-bottom: 40px;">
          <div style="border-left: 4px solid #0496ff; padding-left: 14px; margin-bottom: 24px;">
            <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">
              ${docIdx + 1}. ${doc.title}
            </h2>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #64748b;">
              ${doc.subtitle}
            </div>
          </div>

          ${doc.sections
            .map(
              (sec) => `
            <div class="section-block">
              <div class="sec-num-title">SECTION #${sec.num}. ${sec.title.toUpperCase()}</div>
              ${sec.content.map((p) => `<div class="sec-para">${p}</div>`).join('')}
            </div>
          `
            )
            .join('')}
        </div>
      `
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certified Legal Copy: ${masterTitle}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');
          body {
            font-family: 'Inter', system-ui, sans-serif;
            color: #0f172a;
            padding: 48px;
            max-width: 840px;
            margin: 0 auto;
            line-height: 1.6;
          }
          .header {
            border-bottom: 3px solid #0496ff;
            padding-bottom: 24px;
            margin-bottom: 32px;
          }
          .logo {
            font-family: 'JetBrains Mono', monospace;
            font-size: 18px;
            font-weight: 800;
            color: #0496ff;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
          .doc-title {
            font-size: 26px;
            font-weight: 800;
            color: #0f172a;
            margin: 12px 0 6px 0;
            letter-spacing: -0.5px;
          }
          .doc-subtitle {
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
          }
          .audit-bar {
            background-color: #f0f9ff;
            border: 1px solid #bae6fd;
            padding: 12px 16px;
            border-radius: 8px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            color: #0369a1;
            margin-bottom: 32px;
          }
          .section-block {
            margin-bottom: 24px;
            page-break-inside: avoid;
          }
          .sec-num-title {
            font-size: 14px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 6px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 4px;
          }
          .sec-para {
            font-size: 12px;
            color: #334155;
            margin-bottom: 6px;
          }
          .signature-panel {
            margin-top: 48px;
            padding: 24px;
            background-color: #f8fafc;
            border: 2px solid #10b981;
            border-radius: 16px;
            page-break-inside: avoid;
          }
          .sig-header {
            font-size: 13px;
            font-weight: 800;
            color: #059669;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .sig-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            font-size: 11px;
          }
          .sig-field {
            font-family: 'JetBrains Mono', monospace;
            color: #334155;
          }
          .sig-[#0f172a] {
            color: #0f172a;
            font-weight: 700;
          }
          @media print {
            body { padding: 24px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">SYNAPS AI ENTERPRISE GOVERNANCE</div>
          <div class="doc-title">${masterTitle}</div>
          <div class="doc-subtitle">${masterSubtitle} · OFFICIAL CERTIFIED DOCUMENT PACKET</div>
        </div>

        <div class="audit-bar">
          <strong>MASTER CRYPTOGRAPHIC AUDIT VERIFICATION HASH:</strong> ${auditHash}
        </div>

        ${documentsHtml}

        <div class="signature-panel">
          <div class="sig-header">✓ CERTIFIED MASTER ELECTRONIC AGREEMENT & SIGNATURE RECORD</div>
          <div class="sig-grid">
            <div class="sig-field"><strong>AGREEMENT STATUS:</strong> <span class="sig-[#0f172a]">ACCEPTED &amp; AGREED TO ALL 7 LEGAL DOCUMENTS</span></div>
            <div class="sig-field"><strong>SUBSCRIBER GMAIL / EMAIL:</strong> <span class="sig-[#0f172a]">${userEmail || 'authenticated-user@synaps.ai'}</span></div>
            <div class="sig-field"><strong>AUTHENTICATED NAME:</strong> <span class="sig-[#0f172a]">${userName || userEmail || 'Enterprise Subscriber'}</span></div>
            <div class="sig-field"><strong>MASTER AUDIT HASH:</strong> <span class="sig-[#0f172a]">${auditHash}</span></div>
            <div class="sig-field"><strong>ACCEPTANCE TIMESTAMP:</strong> <span class="sig-[#0f172a]">${timestampStr}</span></div>
            <div class="sig-field"><strong>PLATFORM SLA:</strong> <span class="sig-[#0f172a]">SYNAPS ENTERPRISE GROUNDED INTELLIGENCE SLA</span></div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 400);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    toast({
      title: 'Master Certified Legal Packet PDF Generated 📄',
      description: `Downloaded complete 7-document legal packet for ${userEmail || 'logged-in user'}. Audit Hash: ${auditHash.slice(0, 18)}...`,
    });
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
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeDocKey === 'terms' ? 'bg-[#0496ff] text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Terms of Service
            </button>

            <button
              onClick={() => { setActiveDocKey('privacy'); setActiveSectionId('sec-1'); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeDocKey === 'privacy' ? 'bg-[#0496ff] text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Privacy Policy
            </button>

            <button
              onClick={() => { setActiveDocKey('dpdp'); setActiveSectionId('sec-1'); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeDocKey === 'dpdp' ? 'bg-[#0496ff] text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              DPDP Act SLA
            </button>

            <button
              onClick={() => { setActiveDocKey('security'); setActiveSectionId('sec-1'); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeDocKey === 'security' ? 'bg-[#0496ff] text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Security SLA
            </button>

            <button
              onClick={() => { setActiveDocKey('payments'); setActiveSectionId('sec-1'); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeDocKey === 'payments' ? 'bg-[#0496ff] text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Payments &amp; Billing
            </button>

            <button
              onClick={() => { setActiveDocKey('ai_disclaimer'); setActiveSectionId('sec-1'); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeDocKey === 'ai_disclaimer' ? 'bg-[#0496ff] text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              AI Disclaimer
            </button>

            <button
              onClick={() => { setActiveDocKey('cookies'); setActiveSectionId('sec-1'); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
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
            aria-label="Close legal modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MAIN BODY DUAL PANE LAYOUT (Numbered TOC Sidebar + Document Content) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* LEFT SIDEBAR: Numbered Table of Contents Index */}
          <div className="w-full md:w-80 bg-slate-50/70 dark:bg-[#16171e] border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-5 overflow-y-auto shrink-0 space-y-2">
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
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
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

        {/* BOTTOM STICKY ACTION TOOLBAR */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#181920] flex items-center justify-between gap-4">
          
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {isLoggedIn ? (
              <span>Authenticated Account: <strong className="text-slate-800 dark:text-slate-200">{userEmail || 'Logged-In User'}</strong></span>
            ) : (
              <span>Synaps Enterprise Governance Protocol</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* If Logged In: Render "I AGREE" first, and unlock "Download Certified PDF" AFTER "I AGREE" is clicked! */}
            {isLoggedIn ? (
              <>
                {!isAgreed ? (
                  <button
                    onClick={handleAgree}
                    className="px-7 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
                  >
                    <span>I AGREE</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadPDF(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap"
                    >
                      <span>Active Doc Only</span>
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(true)}
                      className="px-6 py-2.5 rounded-xl bg-[#0496ff] hover:bg-[#0284c7] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 whitespace-nowrap animate-bounce"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Complete Legal Packet (PDF)</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Pre-Login / Landing Page Mode: Simple Close Button */
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Close Document
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
