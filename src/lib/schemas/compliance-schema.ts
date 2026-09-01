import { z } from 'zod';

export const MerkleProofStepSchema = z.object({
  position: z.enum(['left', 'right']),
  hash: z.string().regex(/^(0x)?[0-9a-fA-F]{64}$/, 'Must be a 64-char hex hash'),
});

export const DGCLHashBlockSchema = z.object({
  index: z.number().int().nonnegative(),
  timestamp: z.string(),
  eventType: z.enum([
    'BOARDROOM_DELIBERATION',
    'MONTE_CARLO_SIMULATION',
    'EXECUTIVE_VERDICT',
    'INVARIANT_CHECK',
    'STRATEGY_DECISION',
  ]),
  payloadSummary: z.string(),
  leafCount: z.number().int().positive(),
  merkleRoot: z.string(),
  previousBlockHash: z.string(),
  blockHash: z.string(),
});

export const DGCLComplianceRequestSchema = z.discriminatedUnion('action', [
  // 1. VERIFY_PROOF
  z.object({
    action: z.literal('VERIFY_PROOF'),
    leafHash: z.string().regex(/^(0x)?[0-9a-fA-F]{64}$/, 'Must be a 64-char hex hash'),
    proof: z.array(MerkleProofStepSchema),
    rootHash: z.string().regex(/^(0x)?[0-9a-fA-F]{64}$/, 'Must be a 64-char hex root hash'),
    rawPayload: z.any().optional(),
  }),

  // 2. VERIFY_BOARDROOM
  z.object({
    action: z.literal('VERIFY_BOARDROOM'),
    meetingResult: z.object({
      executives: z.array(z.any()),
      synthesis: z.any(),
      question: z.string().optional(),
    }),
    question: z.string().optional(),
    companyName: z.string().optional(),
    expectedRootHash: z.string().regex(/^(0x)?[0-9a-fA-F]{64}$/).optional(),
  }),

  // 3. VERIFY_SIMULATION
  z.object({
    action: z.literal('VERIFY_SIMULATION'),
    simulationResult: z.object({
      decisionType: z.string().optional(),
      decisionDetails: z.string().optional(),
      scenarios: z.record(z.string(), z.any()),
      uncertaintyRange: z.any().optional(),
    }),
    decisionType: z.string().optional(),
    companyName: z.string().optional(),
    expectedRootHash: z.string().regex(/^(0x)?[0-9a-fA-F]{64}$/).optional(),
  }),

  // 4. VERIFY_INVARIANT
  z.object({
    action: z.literal('VERIFY_INVARIANT'),
    modelName: z.string().min(1),
    targetNodeId: z.string().min(1),
    interventionNodeId: z.string().min(1),
    interventionValue: z.number(),
    factualValue: z.number(),
    counterfactualValue: z.number(),
    causalDelta: z.number(),
    mathDriftTolerance: z.number().optional().default(1e-6),
  }),

  // 5. COMPUTE_DECISION_ROOT
  z.object({
    action: z.literal('COMPUTE_DECISION_ROOT'),
    record: z.object({
      organizationId: z.string().optional(),
      actorType: z.string().optional(),
      state: z.string(),
      dilemma: z.string(),
      chosenOption: z.any(),
      rejectedOptions: z.array(z.any()).optional(),
      rejectionRationale: z.string().optional(),
      tacticsLearned: z.array(z.string()).optional(),
      riskToleranceScore: z.number().optional(),
      timestamp: z.string().optional(),
    }).optional(),
    batch: z.array(z.any()).optional(),
  }),

  // 6. VERIFY_CHAIN
  z.object({
    action: z.literal('VERIFY_CHAIN'),
    blocks: z.array(DGCLHashBlockSchema).min(1),
  }),
]);

export type DGCLComplianceRequest = z.infer<typeof DGCLComplianceRequestSchema>;
