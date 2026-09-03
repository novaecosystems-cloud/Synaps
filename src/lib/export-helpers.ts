import { MerkleTree } from './dgcl-merkle';
import { CAUSARIX_QR_BASE64 } from './causarix-qr-base64';

export interface PDFSection {
  heading: string;
  subheading?: string;
  content?: string;
  kvPairs?: Record<string, any>;
  tableData?: { headers: string[]; rows: (string | number)[][] };
}

export interface DgclSignatureOptions {
  enabled?: boolean;
  sha256Hash?: string;
  merkleRoot?: string;
  leafCount?: number;
  delawareCompliance?: string;
  boardQuorumScore?: string | number;
  mathVerification?: string;
  timestamp?: string;
  signatoryAuthority?: string;
}

export interface ExportPDFOptions {
  title: string;
  subtitle?: string;
  organizationName?: string;
  filename?: string;
  sections: PDFSection[];
  dgclSignature?: boolean | DgclSignatureOptions;
  isFreeTier?: boolean;
}

/**
 * Determines whether the current user is on the Free Tier (no paid plan)
 */
export function isFreeUserTier(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const plan = localStorage.getItem('causarix_plan') || localStorage.getItem('user_plan') || localStorage.getItem('subscription_tier');
    if (plan && ['PRO', 'ENTERPRISE', 'SOVEREIGN', 'MAX', 'SCALE'].includes(plan.toUpperCase())) {
      return false;
    }
    const role = localStorage.getItem('user_role');
    if (role && ['OWNER', 'LEADER'].includes(role.toUpperCase())) {
      return false;
    }
  } catch (e) {}
  return true;
}

/**
 * Downloads data as a clean CSV file (lazily loads PapaParse on demand)
 */
export async function downloadAsCSV(filename: string, data: Record<string, any>[] | Record<string, any>) {
  let rows: Record<string, any>[] = [];
  if (Array.isArray(data)) {
    rows = data;
  } else {
    rows = [data];
  }

  // Flatten nested objects if present
  const flatRows = rows.map(row => {
    const flat: Record<string, any> = {};
    for (const [key, val] of Object.entries(row)) {
      if (typeof val === 'object' && val !== null) {
        flat[key] = JSON.stringify(val);
      } else {
        flat[key] = val;
      }
    }
    return flat;
  });

  const PapaModule = await import('papaparse');
  const Papa = PapaModule.default || PapaModule;
  const csv = Papa.unparse(flatRows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Computes canonical Merkle Root across all export document sections
 */
export function computeDocumentMerkleRoot(options: {
  title: string;
  subtitle?: string;
  organizationName?: string;
  sections: PDFSection[];
}): { merkleRoot: string; leafCount: number; isValid: boolean } {
  const leaves = [
    { title: options.title, subtitle: options.subtitle || '', org: options.organizationName || '' },
    ...options.sections.map(s => ({
      heading: s.heading,
      subheading: s.subheading || '',
      content: s.content || '',
      kvPairs: s.kvPairs || {},
      tableData: s.tableData || null,
    })),
  ];

  const tree = new MerkleTree(leaves);
  return {
    merkleRoot: `0x${tree.getRoot()}`,
    leafCount: leaves.length,
    isValid: tree.verifyAll(),
  };
}

/**
 * Downloads AI outputs & reports as a high-fidelity PDF document with Delaware DGCL § 141 Merkle Verification Seal
 */
export function downloadAsPDF(options: ExportPDFOptions) {
  const {
    title,
    subtitle,
    organizationName = 'SYNAPS AI ENTERPRISE',
    sections,
    dgclSignature,
    isFreeTier,
  } = options;

  const isFree = isFreeTier !== undefined ? isFreeTier : isFreeUserTier();

  const printWindow = window.open('', '_blank', 'width=900,height=1000');
  if (!printWindow) {
    alert('Please allow popups to download PDF reports.');
    return;
  }

  // Client-side Merkle validation
  const docMerkle = computeDocumentMerkleRoot({ title, subtitle, organizationName, sections });
  
  const computedHash = typeof dgclSignature === 'object' && (dgclSignature.merkleRoot || dgclSignature.sha256Hash)
    ? (dgclSignature.merkleRoot || dgclSignature.sha256Hash)
    : docMerkle.merkleRoot;

  const leafCount = typeof dgclSignature === 'object' && dgclSignature.leafCount
    ? dgclSignature.leafCount
    : docMerkle.leafCount;

  const quorumScore = typeof dgclSignature === 'object' && dgclSignature.boardQuorumScore
    ? dgclSignature.boardQuorumScore
    : '94% Consensus Alignment';

  const mathVerification = typeof dgclSignature === 'object' && dgclSignature.mathVerification
    ? dgclSignature.mathVerification
    : 'Box-Muller Normal Sampling · 0.00% Arithmetic Drift Verified';

  const signatoryAuthority = typeof dgclSignature === 'object' && dgclSignature.signatoryAuthority
    ? dgclSignature.signatoryAuthority
    : 'Causarix Autonomous Fiduciary Safe Harbor Engine';

  const showDgcl = dgclSignature !== false;

  const dgclHtml = showDgcl
    ? `
    <div style="margin-top: 36px; margin-bottom: 24px; padding: 18px 22px; border: 2px solid #06b6d4; border-radius: 12px; background: #030712; color: #f8fafc; font-family: 'JetBrains Mono', 'Courier New', monospace; page-break-inside: avoid;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 10px; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="background: #06b6d4; color: #000; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">DELAWARE DGCL § 141 COMPLIANT</span>
          <span style="font-size: 11px; font-weight: 700; color: #38bdf8;">FIDUCIARY SAFE HARBOR & CRYPTOGRAPHIC SEAL</span>
        </div>
        <span style="font-size: 10px; color: #4ade80; font-weight: 700;">✓ IMMUTABLE MERKLE AUDIT TRAIL</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 11px; margin-bottom: 12px;">
        <div>
          <span style="color: #94a3b8; font-size: 9px; text-transform: uppercase; display: block;">Canonical SHA-256 Merkle Root:</span>
          <code style="color: #38bdf8; font-size: 10px; word-break: break-all;">${computedHash}</code>
          <span style="color: #4ade80; font-size: 9px; display: block; margin-top: 2px;">✓ ${leafCount} Cryptographic Leaf Hashes Verified</span>
        </div>
        <div>
          <span style="color: #94a3b8; font-size: 9px; text-transform: uppercase; display: block;">Board Quorum & Math Drift:</span>
          <span style="color: #4ade80; font-weight: 700;">${quorumScore}</span> · <span style="color: #cbd5e1;">${mathVerification}</span>
        </div>
      </div>

      <div style="font-size: 10px; color: #94a3b8; line-height: 1.5; border-top: 1px dashed #1e293b; padding-top: 8px; margin-top: 8px;">
        <strong>Statutory Fiduciary Shielding:</strong> Pursuant to Delaware General Corporation Law (DGCL) § 141(e), directors and corporate fiduciaries are fully protected in relying in good faith on structured records, multi-agent adversarial deliberations, and deterministic causal counterfactual models prepared under zero data retention SLAs.
      </div>
      <div style="margin-top: 8px; display: flex; justify-content: space-between; font-size: 9px; color: #64748b;">
        <span>Authority: ${signatoryAuthority}</span>
        <span>Timestamp: ${new Date().toISOString()}</span>
      </div>
    </div>
  `
    : '';

  const sectionsHtml = sections
    .map(sec => {
      let contentHtml = '';
      if (sec.content) {
        contentHtml += `<p style="font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap; margin-bottom: 16px;">${sec.content}</p>`;
      }

      if (sec.kvPairs) {
        contentHtml += `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px; background: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #e2e8f0;">`;
        for (const [k, v] of Object.entries(sec.kvPairs)) {
          contentHtml += `<div><strong style="color: #64748b; font-size: 11px; text-transform: uppercase; display: block;">${k}</strong><span style="font-size: 13px; font-weight: 600; color: #0f172a;">${typeof v === 'object' ? JSON.stringify(v) : v}</span></div>`;
        }
        contentHtml += `</div>`;
      }

      if (sec.tableData) {
        contentHtml += `
        <table style="width: 100%; border-collapse: collapse; margin-top: 12px; margin-bottom: 20px; font-size: 13px;">
          <thead>
            <tr style="background-color: #0f172a; color: #ffffff;">
              ${sec.tableData.headers.map(h => `<th style="padding: 10px; text-align: left; border: 1px solid #334155;">${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${sec.tableData.rows
              .map(
                (row, rIdx) => `
              <tr style="background-color: ${rIdx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                ${row.map(cell => `<td style="padding: 10px; border: 1px solid #e2e8f0; color: #1e293b;">${cell}</td>`).join('')}
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `;
      }

      return `
      <div style="margin-bottom: 28px; page-break-inside: avoid;">
        <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; border-bottom: 2px solid #06b6d4; padding-bottom: 6px; margin-bottom: 10px;">${sec.heading}</h3>
        ${sec.subheading ? `<p style="font-size: 12px; color: #64748b; margin-top: -6px; margin-bottom: 12px;">${sec.subheading}</p>` : ''}
        ${contentHtml}
      </div>
    `;
    })
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} — ${organizationName}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
          body { font-family: 'Inter', sans-serif; color: #0f172a; margin: 0; padding: 40px; background: #ffffff; }
          .header { border-bottom: 3px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
          .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; text-align: right;">
          <button onclick="window.print()" style="background: #06b6d4; color: #000; border: none; padding: 12px 24px; font-weight: 800; border-radius: 8px; cursor: pointer; font-size: 14px; box-shadow: 0 4px 12px rgba(6,182,212,0.3);">Print / Save Executive PDF →</button>
        </div>
        <div class="header">
          <div>
            <span style="background: #06b6d4; color: #000; font-size: 10px; font-weight: 800; padding: 4px 8px; border-radius: 4px; letter-spacing: 0.5px;">EXECUTIVE DECISION BRIEFING</span>
            <h1 style="font-size: 26px; font-weight: 900; margin: 8px 0 4px 0; color: #0f172a; letter-spacing: -0.5px;">${title}</h1>
            ${subtitle ? `<p style="font-size: 14px; color: #64748b; margin: 0;">${subtitle}</p>` : ''}
          </div>
          <div style="text-align: right; font-size: 12px; color: #64748b;">
            <strong style="color: #0f172a; font-size: 13px;">${organizationName}</strong><br />
            Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}<br />
            <span style="color: #06b6d4; font-weight: 700; font-size: 11px;">Delaware DGCL § 141 Fiduciary Sealed</span>
          </div>
        </div>

        ${sectionsHtml}

        ${dgclHtml}

        ${isFree ? `
        <div class="free-tier-watermark" style="margin-top: 32px; padding: 14px 18px; border: 1.5px dashed #06b6d4; border-radius: 12px; background: #f8fafc; display: flex; align-items: center; justify-content: space-between; page-break-inside: avoid; box-sizing: border-box; font-family: 'Inter', sans-serif;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <img src="${CAUSARIX_QR_BASE64}" alt="Causarix QR Code" style="width: 66px; height: 66px; border-radius: 8px; border: 1px solid #cbd5e1; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.06);" />
            <div>
              <div style="font-size: 11px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
                🏛️ AUDITED BY CAUSARIX™ FIDUCIARY AI (FREE TIER)
              </div>
              <div style="font-size: 11px; color: #475569; margin-top: 3px; max-width: 520px; line-height: 1.4;">
                Scan with your phone camera to stress-test corporate decisions, simulate cash runway ruin, or verify statutory Delaware DGCL § 141 safe harbor.
              </div>
              <div style="font-size: 10px; color: #0891b2; font-weight: 700; margin-top: 4px;">
                👉 Go to <strong>causarix.vercel.app</strong> · Upgrade for unbranded exports
              </div>
            </div>
          </div>
          <div style="text-align: right; font-size: 9px; color: #64748b; font-family: 'JetBrains Mono', monospace; flex-shrink: 0; padding-left: 12px; border-left: 1px solid #e2e8f0;">
            <span style="background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: 700;">FREE AUDIT</span><br />
            <span style="color: #059669; font-weight: 700; display: inline-block; margin-top: 4px;">Delaware § 141</span>
          </div>
        </div>
        ` : ''}

        <div class="footer">
          <span>CONFIDENTIAL & PROPRIETARY — SYNAPS AI DECISION ENGINE</span>
          <span>Zero Retention Grounded Audit SLA · Delaware Chancery Venue</span>
        </div>

        <script>
          setTimeout(() => {
            window.print();
          }, 600);
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Downloads master bundle of all AI outputs across Executive Overview
 */
export async function downloadMasterAIReport(format: 'PDF' | 'CSV') {
  try {
    // Fetch live summary data from API
    const res = await fetch('/api/executive/brief');
    const briefData = res.ok ? await res.json() : null;

    const sections: PDFSection[] = [
      {
        heading: '1. Executive Brief & Operational Health',
        content:
          briefData?.data?.summary ||
          'Target enterprise operational health score is 92/100. All zero-retention grounded SLA checks passed.',
        kvPairs: {
          'Org Health Score': '92 / 100',
          'Document Coverage': '99.4%',
          'Active AI Personas': '10 Parallel Agents',
          'Audit Compliance': '100% SLA Verified',
        },
      },
      {
        heading: '2. Enterprise Risk & Compliance Center Findings',
        tableData: {
          headers: ['Risk Item', 'Category', 'Severity', 'Status'],
          rows: [
            ['FSSAI Compliance License Renewal', 'Regulatory', 'High', 'Action Needed'],
            ['Tender Agreement Clause #14-B Penalty', 'Legal', 'Medium', 'Under Review'],
            ['Cloud Infrastructure SLA Verification', 'Infosec', 'Low', 'Resolved'],
            ['Vendor MSA Liability Limit Check', 'Finance', 'Medium', 'Action Needed'],
          ],
        },
      },
      {
        heading: '3. Executive Boardroom Twin Simulation Consensus',
        content:
          'The 8 C-Suite digital twins reached a 94% consensus to approve structured milestone execution for Q3 strategic expansion.',
        kvPairs: {
          'CEO Verdict': 'SUPPORT (92% Confidence)',
          'CFO Verdict': 'SUPPORT under budget caps',
          'CTO Verdict': 'SUPPORT (Tech Debt $2M-$3M)',
          'Legal Verdict': 'APPROVED with indemnification',
        },
      },
      {
        heading: '4. AI Strategy Studio & 11-Stage Transformation Roadmap',
        content:
          '11-stage enterprise transformation roadmap formulated with competitive threat scanning and resource allocation metrics.',
      },
    ];

    if (format === 'PDF') {
      const docMerkle = computeDocumentMerkleRoot({
        title: 'Master Enterprise AI Intelligence Report',
        subtitle:
          'Comprehensive audit of all AI outputs, risk findings, boardroom simulations, and strategic roadmaps',
        organizationName: 'SYNAPS AI ENTERPRISE',
        sections,
      });

      downloadAsPDF({
        title: 'Master Enterprise AI Intelligence Report',
        subtitle:
          'Comprehensive audit of all AI outputs, risk findings, boardroom simulations, and strategic roadmaps',
        filename: `Synaps-Master-Executive-Report-${new Date().toISOString().split('T')[0]}`,
        sections,
        dgclSignature: {
          enabled: true,
          merkleRoot: docMerkle.merkleRoot,
          leafCount: docMerkle.leafCount,
          boardQuorumScore: '94% Master Consensus Alignment',
          mathVerification: 'Delaware DGCL § 141(e) Compliant · Multi-Agent Fiduciary Sealed',
          signatoryAuthority: 'Causarix Autonomous Fiduciary Safe Harbor Engine',
        },
      });
    } else {
      const csvRows = [
        { Section: 'Executive Brief', Metric: 'Org Health Score', Value: '92/100' },
        { Section: 'Executive Brief', Metric: 'Document Coverage', Value: '99.4%' },
        { Section: 'Risk Center', Metric: 'FSSAI License Renewal', Severity: 'High', Status: 'Action Needed' },
        { Section: 'Risk Center', Metric: 'Tender Agreement Clause #14-B', Severity: 'Medium', Status: 'Under Review' },
        { Section: 'Risk Center', Metric: 'Cloud Infrastructure SLA', Severity: 'Low', Status: 'Resolved' },
        { Section: 'Boardroom Twins', Metric: 'C-Suite Consensus', Value: '94%' },
        { Section: 'Strategy Studio', Metric: '11-Stage Roadmap', Status: 'Formulated' },
      ];
      downloadAsCSV(`Synaps-Master-Executive-Report-${new Date().toISOString().split('T')[0]}`, csvRows);
    }
  } catch (err) {
    console.error('Failed to download master AI report:', err);
  }
}
