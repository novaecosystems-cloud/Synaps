/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CAUSARIX BOARDROOM CANONICAL SCHEMAS & RUNTIME VALIDATORS
 * ─────────────────────────────────────────────────────────────────────────────
 * Authoritative Zod schema definitions for 10-Agent Executive Boardroom deliberations,
 * executive analyses, consensus synthesis, and cryptographic DGCL § 141 verification.
 */

import { z } from 'zod';

// ─── 1. EXECUTIVE ROLES & BACKWARD COMPATIBILITY ALIASES ─────────────────────

export const CANONICAL_EXECUTIVE_ROLES = [
  'CEO',
  'CFO',
  'CTO',
  'LEGAL',
  'CMO',
  'CRO',
  'CPO',
  'CHRO',
  'CIO',
  'CISO',
] as const;

export const LEGACY_EXECUTIVE_ROLE_ALIASES = [
  'COO',         // Legacy alias for CPO
  'HR',          // Legacy alias for CHRO
  'SALES',       // Legacy alias for CRO
  'MARKETING',   // Legacy alias for CMO
  'OPS',         // Legacy alias for CIO
  'COMPLIANCE',  // Legacy alias for CISO
  'GC',          // Legacy alias for LEGAL
  'CPEO',        // Legacy alias for CHRO
] as const;

export const ALL_EXECUTIVE_ROLES = [
  ...CANONICAL_EXECUTIVE_ROLES,
  ...LEGACY_EXECUTIVE_ROLE_ALIASES,
] as const;

export const ExecutiveRoleSchema = z.enum(ALL_EXECUTIVE_ROLES);
export const CanonicalExecutiveRoleSchema = z.enum(CANONICAL_EXECUTIVE_ROLES);

export type ExecutiveRole = z.infer<typeof ExecutiveRoleSchema>;
export type CanonicalExecutiveRole = (typeof CANONICAL_EXECUTIVE_ROLES)[number];

export const ROLE_ALIAS_MAP: Record<string, CanonicalExecutiveRole> = {
  CEO: 'CEO',
  CFO: 'CFO',
  CTO: 'CTO',
  LEGAL: 'LEGAL',
  GC: 'LEGAL',
  CMO: 'CMO',
  MARKETING: 'CMO',
  CRO: 'CRO',
  SALES: 'CRO',
  CPO: 'CPO',
  COO: 'CPO',
  CHRO: 'CHRO',
  HR: 'CHRO',
  CPEO: 'CHRO',
  CIO: 'CIO',
  OPS: 'CIO',
  CISO: 'CISO',
  COMPLIANCE: 'CISO',
};

/**
 * Normalizes any role identifier or legacy alias into the canonical 10-role set.
 */
export function normalizeExecutiveRole(role: string): CanonicalExecutiveRole {
  const upper = (role || '').trim().toUpperCase();
  return (
    ROLE_ALIAS_MAP[upper] ||
    (CANONICAL_EXECUTIVE_ROLES.includes(upper as any)
      ? (upper as CanonicalExecutiveRole)
      : 'CEO')
  );
}

// ─── 2. EXECUTIVE VERDICT ───────────────────────────────────────────────────

export const ExecutiveVerdictSchema = z.enum(['SUPPORT', 'OPPOSE', 'CONDITIONAL']);
export type ExecutiveVerdict = z.infer<typeof ExecutiveVerdictSchema>;

// ─── 3. EXECUTIVE AGENT ANALYSIS SCHEMA ─────────────────────────────────────

export const ExecutiveAgentAnalysisSchema = z.object({
  roleId: ExecutiveRoleSchema,
  roleTitle: z.string().min(1, 'roleTitle is required'),
  name: z.string().min(1, 'name is required'),
  avatarColor: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Must be a valid hex color code')
    .default('#6366f1'),
  verdict: ExecutiveVerdictSchema.default('CONDITIONAL'),
  reasoning: z.string().min(1, 'reasoning is required'),
  keyConcerns: z.array(z.string()).default([]),
  confidenceScore: z.number().min(0).max(100).default(85),
  dataEvidence: z.array(z.string()).default([]),
  historicalPrecedentCited: z.string().optional(),
  jurisdictionCitation: z.string().optional(),
  strategicPriorities: z.array(z.string()).optional(),
  riskMitigations: z.array(z.string()).optional(),
});

export type ExecutiveAgentAnalysis = z.infer<typeof ExecutiveAgentAnalysisSchema>;

// ─── 4. BOARD SYNTHESIS SCHEMA ──────────────────────────────────────────────

export const BoardSynthesisSchema = z.object({
  consensus: z
    .array(z.string())
    .min(1, 'At least one consensus point is required')
    .default(['Align strategic objectives with core operational capacity and corporate risk policy.']),
  disagreements: z.array(z.string()).default([]),
  risks: z.array(z.string()).default([]),
  opportunities: z.array(z.string()).default([]),
  overallConfidence: z.number().min(0).max(100).default(90),
  finalRecommendation: z.string().min(1, 'finalRecommendation is required'),
  governanceTacticsEnforced: z.array(z.string()).default([]),
  actionItems: z.array(z.string()).optional().default([]),
});

export type BoardSynthesis = z.infer<typeof BoardSynthesisSchema>;

// ─── 5. DELAWARE DGCL VERIFICATION SCHEMA ───────────────────────────────────

export const DGCLVerificationResultSchema = z.object({
  verified: z.boolean(),
  merkleRoot: z.string(),
  leafCount: z.number(),
  leafHashes: z.array(z.string()).optional(),
  canonicalDigest: z.string().optional(),
  fiduciaryShieldStatus: z.string(),
  statutoryBasis: z.string(),
  timestamp: z.string(),
  auditEvidenceSummary: z.string(),
  quorumConsensusScore: z.string().optional(),
  arithmeticDriftVerified: z.boolean().optional(),
});

export type DGCLVerificationResult = z.infer<typeof DGCLVerificationResultSchema>;

// ─── 6. BOARD MEETING RESULT SCHEMA ─────────────────────────────────────────

export const BoardMeetingResultSchema = z.object({
  query: z.string().min(1, 'query is required'),
  executives: z.array(ExecutiveAgentAnalysisSchema),
  synthesis: BoardSynthesisSchema,
  timestamp: z.string(),
  merkleProvenanceHash: z.string().optional(),
  dgclVerification: z.any().optional(),
});

export type BoardMeetingResult = z.infer<typeof BoardMeetingResultSchema>;

// ─── 7. REAL-TIME SERVER-SENT EVENTS (SSE) STREAMING SCHEMAS ────────────────

export const BoardroomSSEEventTypes = [
  'session_init',
  'heartbeat',
  'agent_start',
  'agent_delta',
  'agent_complete',
  'synthesis_start',
  'synthesis_complete',
  'dgcl_seal',
  'done',
  'error',
] as const;

export const SSEHeartbeatPayloadSchema = z.object({
  timestamp: z.number(),
});

export const SSESessionInitPayloadSchema = z.object({
  sessionId: z.string(),
  query: z.string(),
  agentCount: z.number().default(10),
  timestamp: z.string(),
});

export const SSEAgentStartPayloadSchema = z.object({
  roleId: ExecutiveRoleSchema,
  roleTitle: z.string(),
  name: z.string(),
  phase: z.number().optional(),
  index: z.number().optional(),
  total: z.number().default(10).optional(),
});

export const SSEAgentDeltaPayloadSchema = z.object({
  roleId: ExecutiveRoleSchema,
  delta: z.string(),
});

export const SSEAgentCompletePayloadSchema = z.object({
  roleId: ExecutiveRoleSchema,
  analysis: ExecutiveAgentAnalysisSchema,
  completedCount: z.number().optional(),
  totalCount: z.number().default(10).optional(),
});

export const SSESynthesisStartPayloadSchema = z.object({
  message: z.string(),
});

export const SSESynthesisCompletePayloadSchema = z.object({
  synthesis: BoardSynthesisSchema,
});

export const SSEDgclSealPayloadSchema = z.object({
  merkleRoot: z.string(),
  dgclVerification: DGCLVerificationResultSchema.optional(),
});

export const SSEDonePayloadSchema = z.object({
  result: BoardMeetingResultSchema,
});

export const SSEErrorPayloadSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
});
