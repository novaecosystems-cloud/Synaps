/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SYNAPS MATTER NOTEBOOKS & EXECUTIVE AUDIO BRIEFING ENGINE
 * ─────────────────────────────────────────────────────────────────────────────
 * Open-Notebook / NotebookLM-grade multi-document research environment
 * with 2-host conversational audio podcast synthesis.
 */

export interface NotebookSource {
  id: string;
  title: string;
  type: 'CONTRACT' | 'REGULATORY' | 'TRANSCRIPT' | 'FINANCIAL' | 'NOTE';
  content: string;
  dateAdded: string;
  pageCount?: number;
  wordCount: number;
}

export interface AudioBriefingDialogue {
  speaker: 'Alex (Strategy Lead)' | 'Morgan (Legal & Risk Counsel)';
  speakerRole: 'HOST_A' | 'HOST_B';
  timestamp: string;
  text: string;
  durationSec: number;
}

export interface AudioBriefing {
  id: string;
  title: string;
  durationTotalSec: number;
  generatedAt: string;
  overview: string;
  keyTakeaways: string[];
  dialogue: AudioBriefingDialogue[];
}

export interface MatterNotebook {
  id: string;
  title: string;
  matterNumber: string;
  description: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'UNDER_REVIEW';
  lastUpdated: string;
  sources: NotebookSource[];
  audioBriefing?: AudioBriefing;
  citationNotes: Array<{
    id: string;
    sourceId: string;
    sourceTitle: string;
    snippet: string;
    annotation: string;
  }>;
}

export const PRESET_NOTEBOOKS: MatterNotebook[] = [
  {
    id: 'nb_project_titan',
    title: 'Project Titan — $120M Cross-Border Acquisition',
    matterNumber: 'MAT-2026-TITAN-01',
    description: 'Comprehensive diligence covering MSA agreements, IP assignments, regulatory exposure, and indemnification caps.',
    status: 'ACTIVE',
    lastUpdated: new Date().toISOString(),
    sources: [
      {
        id: 'src_1',
        title: 'Master Merger Agreement (Executed Copy).pdf',
        type: 'CONTRACT',
        content: 'Section 8.2: Indemnification liability cap is established at $15,000,000 or 12.5% of total transaction equity consideration. Representations and warranties survival period shall extend for 18 calendar months post-closing.',
        dateAdded: '2026-08-10',
        pageCount: 64,
        wordCount: 18450,
      },
      {
        id: 'src_2',
        title: 'IP Assignment & Proprietary Software Transfer.pdf',
        type: 'CONTRACT',
        content: 'Target company warrants unencumbered title to core ML pipelines, subject to open-source MIT/Apache-2.0 dependencies. No copyleft GPL code is incorporated into the proprietary inference runtime.',
        dateAdded: '2026-08-11',
        pageCount: 28,
        wordCount: 8200,
      },
      {
        id: 'src_3',
        title: 'Antitrust & Foreign Investment Regulatory Filing.pdf',
        type: 'REGULATORY',
        content: 'Statutory waiting period under HSR Act expires in 30 business days. EU Commission preliminary assessment indicates low market concentration risk in enterprise AI infrastructure.',
        dateAdded: '2026-08-12',
        pageCount: 42,
        wordCount: 12300,
      },
    ],
    audioBriefing: {
      id: 'ab_titan_01',
      title: 'Project Titan M&A Diligence — 2-Host Executive Deep Dive',
      durationTotalSec: 145,
      generatedAt: new Date().toISOString(),
      overview: 'Strategic breakdown of the $120M acquisition agreement, indemnification caps, IP warranty integrity, and regulatory clearance timeline.',
      keyTakeaways: [
        'Liability is capped cleanly at $15M (12.5% of equity consideration).',
        '18-month warranty survival period provides adequate post-close buffer.',
        'Zero GPL copyleft contamination found in core AI codebases.',
      ],
      dialogue: [
        {
          speaker: 'Alex (Strategy Lead)',
          speakerRole: 'HOST_A',
          timestamp: '0:00',
          text: "Welcome to this Executive Deep Dive on Project Titan. Today we are unpacking the one hundred and twenty million dollar acquisition agreement. Morgan, you’ve audited the entire sixty-four page merger deed—what’s the headline on legal exposure?",
          durationSec: 14,
        },
        {
          speaker: 'Morgan (Legal & Risk Counsel)',
          speakerRole: 'HOST_B',
          timestamp: '0:14',
          text: "Thanks Alex. The big win here is Section 8.2. Indemnification liability is capped at fifteen million dollars—exactly twelve point five percent of the purchase price. That gives our board a rock-solid liability ceiling.",
          durationSec: 13,
        },
        {
          speaker: 'Alex (Strategy Lead)',
          speakerRole: 'HOST_A',
          timestamp: '0:27',
          text: "And what about the survival period for representations and warranties? Are we protected if hidden liabilities surface next year?",
          durationSec: 8,
        },
        {
          speaker: 'Morgan (Legal & Risk Counsel)',
          speakerRole: 'HOST_B',
          timestamp: '0:35',
          text: "Yes, we secured an eighteen-month survival window. In addition, our forensic code audit verified that the core proprietary AI algorithms are completely free of copyleft GPL contamination. It's clean MIT and Apache licensing across the board.",
          durationSec: 15,
        },
        {
          speaker: 'Alex (Strategy Lead)',
          speakerRole: 'HOST_A',
          timestamp: '0:50',
          text: "What about regulatory clearance? Any antitrust or foreign investment hurdles we should flag for the board?",
          durationSec: 8,
        },
        {
          speaker: 'Morgan (Legal & Risk Counsel)',
          speakerRole: 'HOST_B',
          timestamp: '0:58',
          text: "The statutory waiting period is thirty business days, and the European Commission preliminary review shows minimal market overlap. We anticipate full regulatory green lights by next quarter.",
          durationSec: 12,
        },
        {
          speaker: 'Alex (Strategy Lead)',
          speakerRole: 'HOST_A',
          timestamp: '1:10',
          text: "Outstanding summary. Clean IP, manageable liability caps, and clear regulatory runway. That concludes our executive overview on Project Titan.",
          durationSec: 9,
        },
      ],
    },
    citationNotes: [
      {
        id: 'cit_1',
        sourceId: 'src_1',
        sourceTitle: 'Master Merger Agreement',
        snippet: 'Section 8.2: Indemnification liability cap is established at $15,000,000...',
        annotation: 'Crucial protective clause capping buyer liability.',
      },
    ],
  },
  {
    id: 'nb_dpdp_audit',
    title: 'DPDP Act 2023 Enterprise Compliance Matter',
    matterNumber: 'MAT-2026-DPDP-09',
    description: 'Data Fiduciary compliance verification, Consent architecture, and Section 12 Right to Erasure workflows.',
    status: 'ACTIVE',
    lastUpdated: new Date().toISOString(),
    sources: [
      {
        id: 'src_dpdp_1',
        title: 'MeitY DPDP Statutory Rules & Directives.pdf',
        type: 'REGULATORY',
        content: 'Section 6 requires unambiguous, granular consent notices with multilingual support. Section 13 mandates a designated Data Protection Officer with 30-day grievance resolution SLA.',
        dateAdded: '2026-08-09',
        pageCount: 36,
        wordCount: 11200,
      },
    ],
    citationNotes: [],
  },
];
