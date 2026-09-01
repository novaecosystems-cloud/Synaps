/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CAUSARIX 10-AGENT EXECUTIVE BOARDROOM DELIBERATION ENGINE
 * ─────────────────────────────────────────────────────────────────────────────
 * Autonomous multi-agent digital twin deliberation engine powered by 2-phase
 * parallel batched execution, structured Zod schemas, 4-stage JSON repair,
 * in-memory ring buffer session management, and Delaware DGCL § 141 Merkle sealing.
 */

import prisma from '@/lib/prisma';
import { invokeLLMWithFallback } from '@/lib/llm-router';
import { memPalaceEngine } from '@/lib/mempalace-engine';
import { enrichAgentWithPrimeRLM } from '@/lib/prime-rlm';
import { getRelevantDecisionMemory } from '@/lib/decision-memory-flywheel';
import { inspectPrompt, inspectResponse } from '@/lib/ai-firewall';
import {
  verifyBoardroomRecord,
  DGCLVerificationResult,
} from '@/lib/security/merkle-hash';
import {
  ExecutiveRole,
  CanonicalExecutiveRole,
  ExecutiveAgentAnalysis,
  BoardSynthesis,
  BoardMeetingResult,
  ExecutiveAgentAnalysisSchema,
  BoardSynthesisSchema,
  BoardMeetingResultSchema,
  normalizeExecutiveRole,
} from './schemas/boardroom-schema';
import {
  repairAndValidateJson,
  extractPartialExecutiveFields,
  extractPartialSynthesisFields,
} from './json-repair';

// Re-export canonical schemas and types
export * from './schemas/boardroom-schema';

// ─── 10 CANONICAL EXECUTIVE PROFILES CONFIGURATION ───────────────────────────

export interface ExecutiveProfileConfig {
  roleId: CanonicalExecutiveRole;
  roleTitle: string;
  name: string;
  avatarColor: string;
  phase: 1 | 2;
  focus: string;
  skillStandard: string;
  strictJurisdiction: string;
  forbiddenDomains: string;
  webSearchConstraint: string;
}

export const EXECUTIVE_PROFILES: ExecutiveProfileConfig[] = [
  // ── PHASE 1: ANALYTICAL DOMAIN TWINS (Parallel Execution) ──
  {
    roleId: 'CFO',
    roleTitle: 'Chief Financial Officer',
    name: 'Marcus Sterling',
    avatarColor: '#10b981',
    phase: 1,
    focus: 'Financial ROI, capital allocation, budget constraints, and fiscal risk exposure.',
    skillStandard: 'Pro-Forma Valuation & Runway Modeling (FASB ASC 606 / CFA Valuation / IFRS 16)',
    strictJurisdiction: 'Cash runway modeling, GPU compute burn rates, EBITDA margins, working capital, gross margin sensitivity, and balance sheet solvency.',
    forbiddenDomains: 'Do NOT give legal advice, approve technical software architectures, design marketing ad copy, or draft HR hiring policies.',
    webSearchConstraint: 'Search exclusively for SEC 10-K filings, GAAP accounting standards, SaaS valuation multiples, treasury rates, and financial indices.',
  },
  {
    roleId: 'CTO',
    roleTitle: 'Chief Technology Officer',
    name: 'Dr. Aris Thorne',
    avatarColor: '#06b6d4',
    phase: 1,
    focus: 'Technical architecture, scalability, engineering velocity, and cybersecurity.',
    skillStandard: 'Google Cloud Well-Architected Framework (Security & Reliability) & NIST SP 800-207 Zero Trust',
    strictJurisdiction: 'Cloud architecture, vector database throughput, API latency, technical debt, GPU cluster provisioning, and software reliability.',
    forbiddenDomains: 'Do NOT give financial ROI guarantees, negotiate legal indemnities, draft HR hiring policies, or allocate marketing ad spend.',
    webSearchConstraint: 'Search exclusively for technical RFCs, GitHub repositories, cloud architecture whitepapers, CVE vulnerability databases, and latency benchmarks.',
  },
  {
    roleId: 'CISO',
    roleTitle: 'Chief Information Security Officer',
    name: 'Elena Rostova',
    avatarColor: '#14b8a6',
    phase: 1,
    focus: 'Cybersecurity posture, zero-trust enforcement, statutory regulatory compliance (DPDP/GDPR/SOC2/ISO27001), and audit trails.',
    skillStandard: 'DPDP Act 2023 & SecOps Incident Standards / ISO 27001 & SOC-2 Type II Controls',
    strictJurisdiction: 'Statutory compliance (India DPDP Act 2023, EU GDPR, SOC-2 Type II, ISO 27001, HIPAA), SecOps threat architecture, zero-trust network policies, data privacy impact assessments, and regulatory penalty exposure.',
    forbiddenDomains: 'Do NOT give sales forecasts, approve marketing spend, or architect software backend code.',
    webSearchConstraint: 'Search EXCLUSIVELY for Data Protection Board guidelines, statutory enforcement notices, DPA enforcement precedents, CVE alert advisories, and international compliance checklists.',
  },
  {
    roleId: 'CIO',
    roleTitle: 'Chief Information Officer',
    name: 'Kevin Durant',
    avatarColor: '#6366f1',
    phase: 1,
    focus: 'Enterprise IT infrastructure, vendor SLA enforcement, supply chain stability, and critical path delivery logistics.',
    skillStandard: 'Vendor SLA & Critical Path Management / ISO 9001 SOP Standards',
    strictJurisdiction: 'Enterprise IT infrastructure, internal data pipelines, vendor SLA enforcement, critical path delivery schedules, IT hardware/software procurement, and system uptime.',
    forbiddenDomains: 'Do NOT draft legal corporate charters, compute equity dilution, write marketing copy, or set sales quotas.',
    webSearchConstraint: 'Search exclusively for IT infrastructure benchmark reports, cloud vendor SLA guidelines, enterprise SaaS uptime indices, and hardware lead time telemetry.',
  },
  {
    roleId: 'CRO',
    roleTitle: 'Chief Revenue Officer',
    name: 'Rachel Ross',
    avatarColor: '#ef4444',
    phase: 1,
    focus: 'Revenue impact, enterprise GTM pipeline, sales cycle friction, and customer conversion.',
    skillStandard: 'Enterprise B2B Pipeline & Deal Velocity / MEDDPICC Qualification',
    strictJurisdiction: 'Sales quota attainment, ACV contract value, pipeline velocity, enterprise customer buying cycles, and contract closing friction.',
    forbiddenDomains: 'Do NOT approve uncapped legal indemnities, audit cloud infrastructure, calculate GAAP tax liabilities, or make HR policy changes.',
    webSearchConstraint: 'Search exclusively for B2B enterprise sales metrics, Win/Loss benchmarks, quota attainment data, and buyer journey surveys.',
  },

  // ── PHASE 2: STRATEGIC & COMPLIANCE DOMAIN TWINS (Parallel Execution with Phase 1 Context) ──
  {
    roleId: 'CEO',
    roleTitle: 'Chief Executive Officer',
    name: 'Eleanor Vance',
    avatarColor: '#fc4778',
    phase: 2,
    focus: 'Overall company growth, strategic alignment, market leadership, and vision.',
    skillStandard: 'Executive Strategy & Capital Governance (HBS Competitive Strategy / 7 Powers / Porter Value Chain)',
    strictJurisdiction: 'High-level corporate strategy, market expansion, capital allocation, shareholder value, and organizational vision.',
    forbiddenDomains: 'Do NOT audit line-level code syntax, draft detailed legal clauses, compute micro-level accounting entries, or tune low-level database indexes.',
    webSearchConstraint: 'Search exclusively for macro-economic trends, competitor market share, enterprise M&A valuations, and executive industry benchmarks.',
  },
  {
    roleId: 'LEGAL',
    roleTitle: 'General Counsel',
    name: 'Victoria Hayes',
    avatarColor: '#f59e0b',
    phase: 2,
    focus: 'Contractual liability, IP protection, litigation exposure, and statutory fiduciary shield under Delaware DGCL § 141(e).',
    skillStandard: 'ABA Model Commercial Agreements & Delaware DGCL Statutory Standards',
    strictJurisdiction: 'Contract law, asymmetric indemnification, liability caps, non-competes, IP ownership, arbitration clauses, litigation exposure, and Delaware General Corporation Law § 141 fiduciary standards.',
    forbiddenDomains: 'You can ONLY know legal. You are FORBIDDEN from answering non-legal business strategy, financial modeling, or engineering optimization questions unless they directly create legal/statutory liabilities.',
    webSearchConstraint: 'Search EXCLUSIVELY for statutory gazettes, Supreme Court / Appellate case law precedents, standard contract clauses (SCC), and statutory acts (Delaware Corp Law, DPDP Act 2023, GDPR, CCPA).',
  },
  {
    roleId: 'CPO',
    roleTitle: 'Chief Product Officer',
    name: 'Sarah Chen',
    avatarColor: '#3b82f6',
    phase: 2,
    focus: 'Product roadmap execution, user experience telemetry, product-market fit metrics, and feature prioritization.',
    skillStandard: 'Enterprise Product Lifecycle Management & Agile Roadmap Prioritization',
    strictJurisdiction: 'Product strategy, UX metrics, feature prioritization frameworks (RICE/Kano), user adoption telemetry, release roadmap feasibility, and product-led growth mechanics.',
    forbiddenDomains: 'Do NOT draft legal indemnity terms, audit corporate tax returns, or manage raw cloud infrastructure deployments.',
    webSearchConstraint: 'Search exclusively for product benchmarking reports, user engagement metrics, SaaS product-market fit surveys, and feature adoption indices.',
  },
  {
    roleId: 'CMO',
    roleTitle: 'Chief Marketing Officer',
    name: 'Julian Mercer',
    avatarColor: '#eab308',
    phase: 2,
    focus: 'Brand positioning, market sentiment, customer acquisition cost (CAC), and demand generation.',
    skillStandard: 'Google Analytics 4 & Attribution Telemetry / Brand Equity Frameworks',
    strictJurisdiction: 'Customer Acquisition Cost (CAC), LTV/CAC ratios, brand equity, market positioning, press sentiment, and demand generation.',
    forbiddenDomains: 'Do NOT evaluate legal liability caps, manage cloud server scaling, audit financial balance sheets, or configure firewalls.',
    webSearchConstraint: 'Search exclusively for market sentiment indices, ad platform benchmarks, brand reputation studies, and industry analyst reports (Gartner, Forrester).',
  },
  {
    roleId: 'CHRO',
    roleTitle: 'Chief Human Resources Officer',
    name: 'David Miller',
    avatarColor: '#ec4899',
    phase: 2,
    focus: 'Headcount capacity, talent retention, organizational culture, change management, and labor compliance.',
    skillStandard: 'Talent Architecture, Compensation Benchmarking & Retention Standards (Radford Surveys)',
    strictJurisdiction: 'Headcount bandwidth, executive compensation, employee attrition, labor law compliance, team capacity constraints, and talent acquisition.',
    forbiddenDomains: 'Do NOT audit financial models, evaluate cloud infrastructure, negotiate vendor SaaS contracts, or architect databases.',
    webSearchConstraint: 'Search exclusively for tech compensation benchmarks, Radford surveys, labor department regulations, and employee retention studies.',
  },
];

// ─── IN-MEMORY SESSION STORE & RING BUFFER ────────────────────────────────────

export interface BufferedEvent {
  id: number;
  event: string;
  payload: any;
  timestamp: number;
}

export interface BoardroomSession {
  sessionId: string;
  query: string;
  organizationId: string;
  createdAt: number;
  updatedAt: number;
  status: 'active' | 'completed' | 'failed' | 'aborted';
  eventBuffer: BufferedEvent[];
  eventCounter: number;
  subscribers: Set<(event: string, payload: any, eventId: number) => void>;
  result?: BoardMeetingResult;
  error?: string;
  abortController: AbortController;
}

export class BoardroomStore {
  private sessions = new Map<string, BoardroomSession>();
  private readonly MAX_EVENTS_PER_SESSION = 100;
  private readonly SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

  constructor() {
    // Periodic garbage collection every 5 minutes
    if (typeof setInterval !== 'undefined') {
      const timer = setInterval(() => this.purgeExpired(), 5 * 60 * 1000);
      if (timer && typeof timer === 'object' && 'unref' in timer) {
        (timer as any).unref();
      }
    }
  }

  public getOrCreateSession(
    sessionId: string,
    query: string,
    organizationId: string
  ): BoardroomSession {
    let session = this.sessions.get(sessionId);
    if (!session) {
      session = {
        sessionId,
        query,
        organizationId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'active',
        eventBuffer: [],
        eventCounter: 0,
        subscribers: new Set(),
        abortController: new AbortController(),
      };
      this.sessions.set(sessionId, session);
    }
    return session;
  }

  public getSession(sessionId: string): BoardroomSession | undefined {
    return this.sessions.get(sessionId);
  }

  public pushEvent(sessionId: string, event: string, payload: any): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.eventCounter++;
    session.updatedAt = Date.now();

    const bufferedEvent: BufferedEvent = {
      id: session.eventCounter,
      event,
      payload,
      timestamp: Date.now(),
    };

    session.eventBuffer.push(bufferedEvent);
    if (session.eventBuffer.length > this.MAX_EVENTS_PER_SESSION) {
      session.eventBuffer.shift();
    }

    for (const sub of session.subscribers) {
      try {
        sub(event, payload, session.eventCounter);
      } catch (err) {
        console.error('Error notifying boardroom subscriber:', err);
      }
    }
  }

  public subscribe(
    sessionId: string,
    callback: (event: string, payload: any, eventId: number) => void
  ): () => void {
    const session = this.sessions.get(sessionId);
    if (!session) return () => {};

    session.subscribers.add(callback);
    return () => {
      session.subscribers.delete(callback);
    };
  }

  public purgeExpired(): void {
    const now = Date.now();
    for (const [id, s] of this.sessions.entries()) {
      if (now - s.updatedAt > this.SESSION_TTL_MS) {
        this.sessions.delete(id);
      }
    }
  }
}

export const boardroomStore = new BoardroomStore();

// ─── EXECUTIVE TWIN EXECUTION HELPER ──────────────────────────────────────────

async function executeExecutiveTwin(
  profile: ExecutiveProfileConfig,
  sanitizedQuery: string,
  organizationId: string,
  contextText: string,
  decisionMemory: any,
  priorFindingsSummary?: string,
  onDelta?: (delta: string) => void
): Promise<ExecutiveAgentAnalysis> {
  const rlmEnrichment = enrichAgentWithPrimeRLM(profile.roleId, sanitizedQuery);

  const systemPrompt = `You are ${profile.name}, the ${profile.roleTitle} (${profile.roleId}) at Causarix.
Your functional focus is: ${profile.focus}
Domain Skill Standard: ${profile.skillStandard}

=== STRICT DOMAIN JURISDICTION & BOUNDARY INSTRUCTIONS ===
1. JURISDICTION: ${profile.strictJurisdiction}
2. DOMAIN EXCLUSIONS: ${profile.forbiddenDomains}
3. EXTERNAL SEARCH CONSTRAINT: When consulting external benchmarks or precedents: ${profile.webSearchConstraint}

${rlmEnrichment.systemPromptAddon}
${decisionMemory.tacticsSummaryPrompt}

${priorFindingsSummary ? `\n${priorFindingsSummary}\n` : ''}

=== CRITICAL REASONING & OUTPUT DIRECTIVES ===
1. ZERO FIXATION: Reason dynamically and specifically over the user's exact question and corporate context. Never recite static scripts.
2. CLEAN C-SUITE PROSE: Deliver articulate, professional executive analysis. NEVER output raw markdown code blocks, bracket artifacts, or unparsed JSON in your reasoning string.
3. CONCISE & ACTIONABLE: Deliver unambiguous, grounded conclusions referencing golden industry precedents.

=== STRUCTURED OUTPUT JSON CONTRACT ===
You MUST respond with a single, perfectly valid JSON object conforming exactly to this structure:
{
  "verdict": "SUPPORT" | "OPPOSE" | "CONDITIONAL",
  "reasoning": "2-3 sentences of articulate domain analysis strictly grounded in your jurisdiction, citing precedents and corporate memory where applicable.",
  "keyConcerns": ["Specific domain concern 1", "Specific domain concern 2"],
  "confidenceScore": 88,
  "dataEvidence": ["Metric or precedent reference 1", "Metric reference 2"]
}`;

  const memPalaceContext = memPalaceEngine.buildMemPalacePromptContext(
    organizationId,
    sanitizedQuery
  );
  const prompt = `${contextText}\n\n${memPalaceContext}\n\nSTRATEGIC BOARD QUESTION: ${sanitizedQuery}`;

  const fallbackDefaults: ExecutiveAgentAnalysis = {
    roleId: profile.roleId,
    roleTitle: profile.roleTitle,
    name: profile.name,
    avatarColor: profile.avatarColor,
    verdict: 'CONDITIONAL',
    reasoning: `${profile.roleTitle} recommends phased implementation subject to corporate review gates and milestone risk thresholds.`,
    keyConcerns: [`Operational alignment with ${profile.roleTitle} objectives`],
    confidenceScore: 88,
    dataEvidence: ['Corporate Policy Framework', 'Delaware DGCL § 141 Fiduciary Standard'],
    historicalPrecedentCited: decisionMemory.relevantDecisions?.[0]?.dilemma,
    jurisdictionCitation: profile.strictJurisdiction,
  };

  try {
    const rawContent = await invokeLLMWithFallback(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      { response_format: { type: 'json_object' } }
    );

    if (onDelta && typeof rawContent === 'string') {
      onDelta(rawContent.slice(0, 100));
    }

    const repairResult = repairAndValidateJson(
      rawContent,
      ExecutiveAgentAnalysisSchema,
      fallbackDefaults,
      {
        contextName: `Executive Twin: ${profile.roleId}`,
        customHeuristicExtractor: (raw, fb) =>
          extractPartialExecutiveFields(raw, fb) as ExecutiveAgentAnalysis,
      }
    );

    const egressCheck = inspectResponse(repairResult.data.reasoning || '');
    return {
      ...repairResult.data,
      roleId: profile.roleId,
      roleTitle: profile.roleTitle,
      name: profile.name,
      avatarColor: profile.avatarColor,
      reasoning: egressCheck.sanitizedOutput || repairResult.data.reasoning,
      historicalPrecedentCited:
        repairResult.data.historicalPrecedentCited ||
        decisionMemory.relevantDecisions?.[0]?.dilemma,
      jurisdictionCitation: profile.strictJurisdiction,
    };
  } catch {
    return fallbackDefaults;
  }
}

// ─── BOARDROOM SECRETARY SYNTHESIS HELPER ────────────────────────────────────

async function executeBoardSynthesis(
  sanitizedQuery: string,
  executives: ExecutiveAgentAnalysis[],
  decisionMemory: any
): Promise<BoardSynthesis> {
  const synthesisSystemPrompt = `You are the Executive Boardroom Secretary at Causarix.
Synthesize the independent verdicts of the 10 domain executive twins for the strategic board question.
Enforce company governance rules, fiduciary standards under Delaware General Corporation Law (DGCL) § 141, and institutional precedent from Corporate Memory.

${decisionMemory.tacticsSummaryPrompt}

=== CRITICAL SYNTHESIS DIRECTIVES ===
1. REAL TRADE-OFFS: Synthesize actual arguments and frictions between executives.
2. POLISHED EXECUTIVE ENGLISH: Deliver C-suite grade strategic directives. NEVER output raw code snippets, unescaped brackets, or raw JSON inside the recommendation.
3. ACTIONABLE DIRECTIVE: State unambiguous next steps, risk mitigations, and capital gating conditions.

=== STRUCTURED OUTPUT JSON CONTRACT ===
You MUST respond with a single, perfectly valid JSON object conforming exactly to this structure:
{
  "consensus": ["Consensus point 1 referencing strategic alignment", "Consensus point 2"],
  "disagreements": ["Friction point 1 between specific executive domains", "Friction point 2"],
  "risks": ["Primary execution/legal/financial risk 1", "Primary risk 2"],
  "opportunities": ["Growth or moat opportunity 1", "Opportunity 2"],
  "overallConfidence": 92,
  "finalRecommendation": "Clear 2-3 sentence executive summary directive integrating board consensus and historical precedents."
}`;

  const execSummaryPrompt = `QUERY: ${sanitizedQuery}\n\nEXECUTIVE VERDICTS:\n${executives
    .map((e) => `${e.roleId} (${e.name}): ${e.verdict} - ${e.reasoning}`)
    .join('\n')}`;

  const fallbackSynthesis: BoardSynthesis = {
    consensus: [
      'Align strategic initiatives with core operational bandwidth, liability caps, and cash runway buffers.',
    ],
    disagreements: [
      'Pacing of resource deployment between immediate market expansion and risk mitigation.',
    ],
    risks: [
      'Execution timeline friction, liability exposure, and operational SLA adherence.',
    ],
    opportunities: [
      'Defensive moat expansion, margin enhancement, and automated process efficiency.',
    ],
    overallConfidence: 91,
    finalRecommendation:
      'The Executive Board recommends proceeding with phased milestones, 20% cash runway buffer, and mandatory 60-day review gates.',
    governanceTacticsEnforced: (decisionMemory.corporateTactics || [])
      .map((t: any) => t.rule)
      .slice(0, 3),
    actionItems: [
      'Establish weekly milestone reviews',
      'Verify statutory compliance with General Counsel',
    ],
  };

  try {
    const rawSynth = await invokeLLMWithFallback(
      [
        { role: 'system', content: synthesisSystemPrompt },
        { role: 'user', content: execSummaryPrompt },
      ],
      { response_format: { type: 'json_object' } }
    );

    const synthRepair = repairAndValidateJson(
      rawSynth,
      BoardSynthesisSchema,
      fallbackSynthesis,
      {
        contextName: 'Boardroom Synthesis',
        customHeuristicExtractor: (raw, fb) => extractPartialSynthesisFields(raw, fb),
      }
    );

    const recEgress = inspectResponse(synthRepair.data.finalRecommendation || '');
    return {
      ...synthRepair.data,
      finalRecommendation:
        recEgress.sanitizedOutput || synthRepair.data.finalRecommendation,
      governanceTacticsEnforced: (decisionMemory.corporateTactics || [])
        .map((t: any) => t.rule)
        .slice(0, 3),
    };
  } catch {
    return fallbackSynthesis;
  }
}

// ─── 2-PHASE BATCHED RUNNER (SINGLE PROMISE RESOLUTION) ───────────────────────

export async function runExecutiveBoardMeeting(
  query: string,
  organizationId: string
): Promise<BoardMeetingResult> {
  const ingressCheck = inspectPrompt(query);
  const sanitizedQuery = ingressCheck.sanitizedPrompt || query;

  const decisionMemory = await getRelevantDecisionMemory(
    organizationId,
    sanitizedQuery,
    5
  );

  let docs: any[] = [];
  try {
    docs = await prisma.document.findMany({
      where: { organizationId, isDeleted: false },
      take: 10,
      orderBy: { updatedAt: 'desc' },
      select: { id: true, name: true, mimeType: true },
    });
  } catch {}

  const contextText = `COMPANY CONTEXT:\nUploaded Documents: ${
    docs.map((d) => d.name).join(', ') || 'Corporate Knowledge Base'
  }`;

  // ── PHASE 1: 5 Analytical Twins (Concurrent execution) ──
  const phase1Profiles = EXECUTIVE_PROFILES.filter((p) => p.phase === 1);
  const phase1Results = await Promise.all(
    phase1Profiles.map((p) =>
      executeExecutiveTwin(p, sanitizedQuery, organizationId, contextText, decisionMemory)
    )
  );

  // Summarize Phase 1 for Phase 2 context injection
  const phase1Summary =
    `=== PHASE 1 QUANTITATIVE ANALYTICAL TWIN FINDINGS ===\n` +
    phase1Results
      .map(
        (r) =>
          `• ${r.roleId} (${r.name}): ${r.verdict} — "${r.reasoning}" (Key concerns: ${r.keyConcerns.join(
            ', '
          )})`
      )
      .join('\n');

  // ── PHASE 2: 5 Strategic & Compliance Twins (Concurrent execution with Phase 1 Context) ──
  const phase2Profiles = EXECUTIVE_PROFILES.filter((p) => p.phase === 2);
  const phase2Results = await Promise.all(
    phase2Profiles.map((p) =>
      executeExecutiveTwin(
        p,
        sanitizedQuery,
        organizationId,
        contextText,
        decisionMemory,
        phase1Summary
      )
    )
  );

  const executives = [...phase1Results, ...phase2Results];

  // ── BOARDROOM SECRETARY SYNTHESIS ──
  const synthesis = await executeBoardSynthesis(
    sanitizedQuery,
    executives,
    decisionMemory
  );

  // ── DELAWARE DGCL § 141 MERKLE VERIFICATION ──
  const dgclVerification = verifyBoardroomRecord({
    executives,
    synthesis,
    question: sanitizedQuery,
  });

  return {
    query: sanitizedQuery,
    executives,
    synthesis,
    timestamp: new Date().toISOString(),
    merkleProvenanceHash: decisionMemory.merkleProvenanceHash,
    dgclVerification,
  };
}

// ─── STREAMING RUNNER WITH SSE EVENT DISPATCH & RING BUFFER ──────────────────

export async function streamExecutiveBoardMeeting(
  query: string,
  organizationId: string,
  sessionIdOrOnEvent?: string | ((event: string, payload: any) => void),
  onEventCallback?: (event: string, payload: any) => void
): Promise<BoardMeetingResult> {
  let activeSessionId: string;
  let onEvent: ((event: string, payload: any) => void) | undefined;

  if (typeof sessionIdOrOnEvent === 'function') {
    activeSessionId = crypto.randomUUID();
    onEvent = sessionIdOrOnEvent;
  } else if (typeof sessionIdOrOnEvent === 'string') {
    activeSessionId = sessionIdOrOnEvent;
    onEvent = onEventCallback;
  } else {
    activeSessionId = crypto.randomUUID();
    onEvent = onEventCallback;
  }

  const session = boardroomStore.getOrCreateSession(
    activeSessionId,
    query,
    organizationId
  );

  const dispatch = (event: string, payload: any) => {
    boardroomStore.pushEvent(activeSessionId, event, payload);
    if (onEvent) {
      try {
        onEvent(event, payload);
      } catch (err) {
        console.error('Error invoking onEvent callback:', err);
      }
    }
  };

  const ingressCheck = inspectPrompt(query);
  const sanitizedQuery = ingressCheck.sanitizedPrompt || query;

  dispatch('session_init', {
    sessionId: activeSessionId,
    query: sanitizedQuery,
    agentCount: 10,
    timestamp: new Date().toISOString(),
  });

  const decisionMemory = await getRelevantDecisionMemory(
    organizationId,
    sanitizedQuery,
    5
  );

  let docs: any[] = [];
  try {
    docs = await prisma.document.findMany({
      where: { organizationId, isDeleted: false },
      take: 10,
      orderBy: { updatedAt: 'desc' },
      select: { id: true, name: true, mimeType: true },
    });
  } catch {}

  const contextText = `COMPANY CONTEXT:\nUploaded Documents: ${
    docs.map((d) => d.name).join(', ') || 'Corporate Knowledge Base'
  }`;

  let completedAgentCount = 0;

  const runTwinWithEvents = async (
    profile: ExecutiveProfileConfig,
    priorSummary?: string
  ): Promise<ExecutiveAgentAnalysis> => {
    dispatch('agent_start', {
      roleId: profile.roleId,
      roleTitle: profile.roleTitle,
      name: profile.name,
      phase: profile.phase,
    });

    const analysis = await executeExecutiveTwin(
      profile,
      sanitizedQuery,
      organizationId,
      contextText,
      decisionMemory,
      priorSummary,
      (delta) => {
        dispatch('agent_delta', {
          roleId: profile.roleId,
          delta,
        });
      }
    );

    completedAgentCount++;
    dispatch('agent_complete', {
      roleId: profile.roleId,
      analysis,
      completedCount: completedAgentCount,
      totalCount: EXECUTIVE_PROFILES.length,
    });

    return analysis;
  };

  // ── PHASE 1: Run 5 Analytical Twins in Parallel ──
  const phase1Profiles = EXECUTIVE_PROFILES.filter((p) => p.phase === 1);
  const phase1Results = await Promise.all(
    phase1Profiles.map((p) => runTwinWithEvents(p))
  );

  const phase1Summary =
    `=== PHASE 1 QUANTITATIVE ANALYTICAL TWIN FINDINGS ===\n` +
    phase1Results
      .map(
        (r) =>
          `• ${r.roleId} (${r.name}): ${r.verdict} — "${r.reasoning}" (Key concerns: ${r.keyConcerns.join(
            ', '
          )})`
      )
      .join('\n');

  // ── PHASE 2: Run 5 Strategic / Compliance Twins in Parallel with Phase 1 Context ──
  const phase2Profiles = EXECUTIVE_PROFILES.filter((p) => p.phase === 2);
  const phase2Results = await Promise.all(
    phase2Profiles.map((p) => runTwinWithEvents(p, phase1Summary))
  );

  const allExecutives: ExecutiveAgentAnalysis[] = [
    ...phase1Results,
    ...phase2Results,
  ];

  // ── BOARD SECRETARY SYNTHESIS ──
  dispatch('synthesis_start', {
    message: 'Synthesizing 10-Agent Boardroom quorum consensus...',
  });

  const synthesis = await executeBoardSynthesis(
    sanitizedQuery,
    allExecutives,
    decisionMemory
  );

  dispatch('synthesis_complete', { synthesis });

  // ── DELAWARE DGCL § 141 CRYPTOGRAPHIC MERKLE SEAL ──
  const dgclVerification = verifyBoardroomRecord({
    executives: allExecutives,
    synthesis,
    question: sanitizedQuery,
  });

  dispatch('dgcl_seal', {
    merkleRoot: dgclVerification.merkleRoot,
    dgclVerification,
  });

  const finalResult: BoardMeetingResult = {
    query: sanitizedQuery,
    executives: allExecutives,
    synthesis,
    timestamp: new Date().toISOString(),
    merkleProvenanceHash: decisionMemory.merkleProvenanceHash,
    dgclVerification,
  };

  dispatch('done', { result: finalResult });

  session.status = 'completed';
  session.result = finalResult;

  return finalResult;
}
