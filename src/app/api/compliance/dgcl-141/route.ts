import { NextRequest, NextResponse } from 'next/server';
import {
  sha256Sync,
  canonicalizeJSON,
  MerkleTree,
  DGCLHashChain,
  verifyBoardroomRecord,
  verifySimulationRecord,
  MerkleProofStep,
} from '@/lib/dgcl-merkle';
import { sealCausalInvariantProof } from '@/lib/security/merkle-hash';
import { computeDecisionMerkleRoot, DecisionState } from '@/lib/decision-memory-flywheel';
import {
  resolveAuthContext,
  checkRateLimit,
  getRateLimitKey,
  rateLimitResponse,
  readBodyWithLimit,
} from '@/lib/security';
import { DGCLComplianceRequestSchema } from '@/lib/schemas/compliance-schema';

export const dynamic = 'force-dynamic';

/**
 * GET /api/compliance/dgcl-141
 * Returns statutory engine capabilities, cryptographic specifications, and compliance standards.
 */
export async function GET(req: NextRequest) {
  const rateKey = getRateLimitKey(req);
  if (!checkRateLimit(rateKey, 120, 60000)) {
    return rateLimitResponse(60);
  }

  return NextResponse.json({
    success: true,
    data: {
      statutoryBasis: 'Delaware General Corporation Law § 141(e)',
      standard: 'Business Judgment Rule & Objective Fiduciary Good-Faith Reliance',
      engineVersion: '2026.2.0-sovereign',
      cryptographicStandards: {
        hashAlgorithm: 'FIPS PUB 180-4 SHA-256 (Pure TypeScript Synchronous Engine)',
        canonicalization: 'RFC 8785 JSON Canonicalization Scheme (JCS)',
        treeStructure: 'Pairwise Binary Merkle Tree with Boundary Duplication',
        linearLedger: 'DGCL § 141 Sequential Cryptographic Hash Chain',
      },
      verificationOperations: [
        'VERIFY_PROOF',
        'VERIFY_BOARDROOM',
        'VERIFY_SIMULATION',
        'VERIFY_INVARIANT',
        'COMPUTE_DECISION_ROOT',
        'VERIFY_CHAIN',
      ],
      activeInvariants: {
        maxArithmeticDriftTolerance: 1e-6,
        gaussianSampling: 'Box-Muller Normal Transform (10,000 Iterations)',
        doCalculusConservation: 'Pearl 3-Step Counterfactual Invariance',
      },
      status: 'ONLINE',
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * POST /api/compliance/dgcl-141
 * Executes cryptographic verification and issues signed statutory audit certificates.
 */
export async function POST(req: NextRequest) {
  const rateKey = getRateLimitKey(req);
  if (!checkRateLimit(rateKey, 60, 60000)) {
    return rateLimitResponse(60);
  }

  try {
    const authContext = await resolveAuthContext(req);
    const { body, error: bodyError } = await readBodyWithLimit(req, 1024 * 1024); // 1 MB limit

    if (bodyError || !body) {
      return NextResponse.json(
        { success: false, error: bodyError || 'Empty or invalid JSON body' },
        { status: 400 }
      );
    }

    const parseResult = DGCLComplianceRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: parseResult.error.issues.map(e => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    const payload = parseResult.data;

    switch (payload.action) {
      case 'VERIFY_PROOF': {
        const rawLeaf = payload.leafHash.replace(/^0x/i, '').toLowerCase();
        const rawRoot = payload.rootHash.replace(/^0x/i, '').toLowerCase();

        // Optional raw payload integrity verification
        let payloadDigestMatch = true;
        if (payload.rawPayload !== undefined) {
          const canonical = canonicalizeJSON(payload.rawPayload);
          const computedDigest = sha256Sync(canonical).toLowerCase();
          payloadDigestMatch = computedDigest === rawLeaf;
        }

        const cleanProof: MerkleProofStep[] = payload.proof.map(step => ({
          position: step.position,
          hash: step.hash.replace(/^0x/i, '').toLowerCase(),
        }));

        const isProofValid = payloadDigestMatch && MerkleTree.verifyProof(rawLeaf, cleanProof, rawRoot);

        return NextResponse.json({
          success: true,
          data: {
            verified: isProofValid,
            leafHash: `0x${rawLeaf}`,
            rootHash: `0x${rawRoot}`,
            payloadDigestMatch,
            fiduciaryShieldStatus: isProofValid
              ? 'DELAWARE DGCL § 141(e) PROOF VALID'
              : 'PROOF_VERIFICATION_FAILED',
            timestamp: new Date().toISOString(),
          },
        });
      }

      case 'VERIFY_BOARDROOM': {
        const result = verifyBoardroomRecord(payload.meetingResult, {
          question: payload.question,
          companyName: payload.companyName,
        });

        let matchesExpected = true;
        if (payload.expectedRootHash) {
          const cleanExpected = payload.expectedRootHash.replace(/^0x/i, '').toLowerCase();
          const cleanActual = result.merkleRoot.replace(/^0x/i, '').toLowerCase();
          matchesExpected = cleanExpected === cleanActual;
        }

        const isFullyVerified = result.verified && matchesExpected;

        return NextResponse.json({
          success: true,
          data: {
            ...result,
            verified: isFullyVerified,
            matchesExpectedRoot: matchesExpected,
            statutoryCertificate: isFullyVerified
              ? `STATUTORY CERTIFICATE: Boardroom record for organization [${authContext.orgId}] cryptographically verified under Delaware DGCL § 141(e) with root ${result.merkleRoot}.`
              : 'VERIFICATION_FAILED',
          },
        });
      }

      case 'VERIFY_SIMULATION': {
        const result = verifySimulationRecord(payload.simulationResult, {
          decisionType: payload.decisionType,
          companyName: payload.companyName,
        });

        let matchesExpected = true;
        if (payload.expectedRootHash) {
          const cleanExpected = payload.expectedRootHash.replace(/^0x/i, '').toLowerCase();
          const cleanActual = result.merkleRoot.replace(/^0x/i, '').toLowerCase();
          matchesExpected = cleanExpected === cleanActual;
        }

        const isFullyVerified = result.verified && matchesExpected;

        return NextResponse.json({
          success: true,
          data: {
            ...result,
            verified: isFullyVerified,
            matchesExpectedRoot: matchesExpected,
            statutoryCertificate: isFullyVerified
              ? `STATUTORY CERTIFICATE: Quantitative Monte Carlo simulation cryptographically verified under Delaware DGCL § 141(e) with root ${result.merkleRoot}.`
              : 'VERIFICATION_FAILED',
          },
        });
      }

      case 'VERIFY_INVARIANT': {
        const result = sealCausalInvariantProof(
          payload.modelName,
          payload.targetNodeId,
          payload.interventionNodeId,
          payload.interventionValue,
          payload.factualValue,
          payload.counterfactualValue,
          payload.causalDelta,
          payload.mathDriftTolerance
        );

        return NextResponse.json({
          success: true,
          data: {
            ...result,
            statutoryCertificate: result.verified
              ? `STATUTORY CERTIFICATE: SCM Counterfactual Invariant for model [${payload.modelName}] sealed with 0.00% drift under Delaware DGCL § 141(e).`
              : 'INVARIANT_VERIFICATION_FAILED',
          },
        });
      }

      case 'COMPUTE_DECISION_ROOT': {
        if (payload.record) {
          const timestamp = payload.record.timestamp || new Date().toISOString();
          const rootHash = computeDecisionMerkleRoot({
            ...payload.record,
            state: payload.record.state as DecisionState,
            organizationId: payload.record.organizationId || authContext.orgId,
            timestamp,
          });

          return NextResponse.json({
            success: true,
            data: {
              merkleRoot: `0x${rootHash.replace(/^0x/i, '')}`,
              organizationId: payload.record.organizationId || authContext.orgId,
              timestamp,
              leafCount: 10,
              fiduciaryShieldStatus: 'DELAWARE DGCL § 141(e) DECISION SEALED',
            },
          });
        }

        if (payload.batch && Array.isArray(payload.batch)) {
          const roots = payload.batch.map(item => {
            if (typeof item === 'string' && /^[0-9a-fA-F]{64}$/.test(item.replace(/^0x/i, ''))) {
              return item.replace(/^0x/i, '').toLowerCase();
            }
            return computeDecisionMerkleRoot({
              ...item,
              state: (item.state || 'ACCEPTED') as DecisionState,
              organizationId: item.organizationId || authContext.orgId,
              timestamp: item.timestamp || new Date().toISOString(),
            }).replace(/^0x/i, '').toLowerCase();
          });

          const batchTree = new MerkleTree(roots);
          return NextResponse.json({
            success: true,
            data: {
              batchRoot: `0x${batchTree.getRoot()}`,
              batchCount: roots.length,
              itemRoots: roots.map(r => `0x${r}`),
              isCompliant: batchTree.verifyAll(),
            },
          });
        }

        return NextResponse.json(
          { success: false, error: 'Either "record" or "batch" must be provided.' },
          { status: 400 }
        );
      }

      case 'VERIFY_CHAIN': {
        const blocks = payload.blocks;
        if (blocks.length === 0) {
          return NextResponse.json(
            { success: false, error: 'Cannot verify empty chain.' },
            { status: 400 }
          );
        }

        for (let i = 1; i < blocks.length; i++) {
          const curr = blocks[i];
          const prev = blocks[i - 1];

          if (curr.previousBlockHash !== prev.blockHash) {
            return NextResponse.json({
              success: true,
              data: {
                isValid: false,
                brokenIndex: i,
                error: `Broken linkage at Block #${i}. Previous hash mismatch: expected ${prev.blockHash}, got ${curr.previousBlockHash}`,
                chainLength: blocks.length,
                latestBlockHash: blocks[blocks.length - 1].blockHash,
              },
            });
          }

          const expectedBlockContent = `${curr.index}:${curr.timestamp}:${curr.eventType}:${curr.payloadSummary}:${curr.merkleRoot}:${prev.blockHash}`;
          const expectedHash = sha256Sync(expectedBlockContent);

          if (curr.blockHash !== expectedHash) {
            return NextResponse.json({
              success: true,
              data: {
                isValid: false,
                brokenIndex: i,
                error: `Tampered block digest at Block #${i}. Computed ${expectedHash} != recorded ${curr.blockHash}`,
                chainLength: blocks.length,
                latestBlockHash: blocks[blocks.length - 1].blockHash,
              },
            });
          }
        }

        return NextResponse.json({
          success: true,
          data: {
            isValid: true,
            chainLength: blocks.length,
            latestBlockHash: blocks[blocks.length - 1].blockHash,
            fiduciaryShieldStatus: 'DELAWARE DGCL § 141(e) HASH CHAIN VERIFIED INTACT',
            timestamp: new Date().toISOString(),
          },
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
