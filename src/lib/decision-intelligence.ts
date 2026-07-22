import prisma from '@/lib/prisma';
import { invokeLLMWithFallback } from '@/lib/llm-router';
import crypto from 'crypto';

function parseSafeJson(content: string) {
  try {
    const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse JSON in decision-intelligence:", content);
    return {};
  }
}

export interface DecisionInputData {
  title: string;
  problem: string;
  context: string;
  peopleInvolved?: { name: string; role?: string }[];
  alternativesConsidered?: { alternative: string; pros?: string; cons?: string }[];
  risks?: { risk: string; severity?: string; mitigation?: string }[];
  expectedOutcome?: string;
  documentId?: string;
  projectId?: string;
}

export interface DecisionReviewResult {
  id: string;
  title: string;
  problem: string;
  context: string;
  recommendation: 'GO' | 'NO_GO' | 'CONDITIONAL_GO';
  confidence: number;
  logicEvaluation: string;
  missingInformation: string[];
  biasFlags: { bias: string; description: string }[];
  financialImpact: string;
  operationalImpact: string;
  complianceIssues: string[];
  historicalReferences: { title: string; outcome?: string; lessonsLearned?: string }[];
  createdAt: string;
}

export async function evaluateAndStoreDecision(
  input: DecisionInputData,
  organizationId: string
): Promise<DecisionReviewResult> {

  // 1. Fetch historical decisions from Decision Memory database
  const pastDecisions = await prisma.decision.findMany({
    where: { organizationId },
    take: 10,
    orderBy: { createdAt: 'desc' }
  });

  const historicalContext = pastDecisions.map(d => 
    `• Past Decision: "${d.title}" (Recommendation: ${d.recommendation}, Status: ${d.status})
      Expected: ${d.expectedOutcome || 'N/A'} | Actual Outcome: ${d.actualOutcome || 'Pending'}
      Lessons Learned: ${d.lessonsLearned || 'None recorded'}`
  ).join('\n\n');

  const systemInstruction = `You are the Decision Review AI for Synaps.
Your task is to analyze proposed corporate decisions for logic, bias, missing information, risks, financial impact, operational impact, and compliance issues, while referencing past historical decisions.

Evaluate the decision and return ONLY valid JSON with the following EXACT keys:
1. "recommendation": "GO", "NO_GO", or "CONDITIONAL_GO".
2. "confidence": Integer 0-100 score.
3. "logicEvaluation": Executive evaluation of the logic, assumptions, and reasoning.
4. "missingInformation": Array of key missing data points or unverified assumptions (e.g. ["Unverified market size data", "No SLA agreement from vendor"]).
5. "biasFlags": Array of detected cognitive biases [{ "bias": "Optimism Bias", "description": "Underestimating implementation timeline by 40%." }].
6. "financialImpact": Detailed financial cost/ROI analysis.
7. "operationalImpact": Impact on teams, workflows, and dependencies.
8. "complianceIssues": Array of regulatory/policy compliance risks.
9. "historicalReferences": Array of historical decision cross-references [{ "title": "Past Decision Name", "outcome": "Past Outcome", "lessonsLearned": "Past Lesson" }].

HISTORICAL DECISION MEMORY DATABASE:
${historicalContext || 'No past decisions stored yet.'}`;

  const prompt = `DECISION TITLE: ${input.title}
PROBLEM STATEMENT: ${input.problem}
CONTEXT: ${input.context}
PEOPLE INVOLVED: ${JSON.stringify(input.peopleInvolved || [])}
ALTERNATIVES CONSIDERED: ${JSON.stringify(input.alternativesConsidered || [])}
RISKS: ${JSON.stringify(input.risks || [])}
EXPECTED OUTCOME: ${input.expectedOutcome || 'N/A'}`;

  try {
    const rawResponse = await invokeLLMWithFallback([
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt }
    ], { response_format: { type: 'json_object' } });

    const review = parseSafeJson(rawResponse);

    const recommendation = (review.recommendation || 'CONDITIONAL_GO') as any;
    const confidence = typeof review.confidence === 'number' ? review.confidence : 85;
    const logicEvaluation = review.logicEvaluation || `Logic evaluation for ${input.title}.`;
    const missingInformation = Array.isArray(review.missingInformation) ? review.missingInformation : [];
    const biasFlags = Array.isArray(review.biasFlags) ? review.biasFlags : [];
    const financialImpact = review.financialImpact || 'Standard financial impact.';
    const operationalImpact = review.operationalImpact || 'Standard operational impact.';
    const complianceIssues = Array.isArray(review.complianceIssues) ? review.complianceIssues : [];
    const historicalReferences = Array.isArray(review.historicalReferences) ? review.historicalReferences : [];

    // Save decision permanently in Prisma
    const decision = await prisma.decision.create({
      data: {
        organizationId,
        projectId: input.projectId || null,
        documentId: input.documentId || null,
        title: input.title,
        problem: input.problem,
        context: input.context,
        peopleInvolved: input.peopleInvolved || [],
        alternativesConsidered: input.alternativesConsidered || [],
        risks: input.risks || [],
        expectedOutcome: input.expectedOutcome || '',
        recommendation,
        confidence,
        logicEvaluation,
        missingInformation,
        biasFlags,
        financialImpact,
        operationalImpact,
        complianceIssues,
        status: 'UNDER_REVIEW'
      }
    });

    // Create Git commit event in Organization Timeline
    const shortHash = crypto.createHash('md5').update(`dec-${decision.id}`).digest('hex').substring(0, 7);
    await prisma.timelineEvent.create({
      data: {
        organizationId,
        commitHash: shortHash,
        title: `Decision Evaluated: ${input.title}`,
        description: `Decision AI Review completed with recommendation ${recommendation} (${confidence}% confidence).`,
        category: 'DECISION',
        eventDate: new Date(),
        documentId: input.documentId || null,
        metadata: {
          decisionId: decision.id,
          recommendation,
          confidence
        }
      }
    });

    // Insert into Enterprise Memory Graph
    try {
      const decEntity = await prisma.graphEntity.create({
        data: {
          organizationId,
          documentId: input.documentId || null,
          name: `Decision: ${input.title}`,
          type: 'DECISION',
          description: `${input.problem} — Recommendation: ${recommendation}`,
          metadata: {
            summary: logicEvaluation,
            biasFlags,
            financialImpact,
            operationalImpact
          },
          confidenceScore: confidence / 100
        }
      });

      // Link to past decision entities if present
      for (const past of pastDecisions.slice(0, 3)) {
        const pastEntity = await prisma.graphEntity.findFirst({
          where: { organizationId, name: { contains: past.title.slice(0, 20) } }
        });
        if (pastEntity) {
          await prisma.graphRelationship.create({
            data: {
              organizationId,
              sourceEntityId: decEntity.id,
              targetEntityId: pastEntity.id,
              relationType: 'REFERENCES_HISTORICAL',
              description: `Decision cross-references historical lesson from "${past.title}"`,
              evidence: past.lessonsLearned || past.actualOutcome || 'Historical pattern match'
            }
          });
        }
      }
    } catch (graphErr) {
      console.warn("Memory graph integration warning in decision intelligence:", graphErr);
    }

    return {
      id: decision.id,
      title: decision.title,
      problem: decision.problem || '',
      context: decision.context || '',
      recommendation: decision.recommendation as any,
      confidence: decision.confidence,
      logicEvaluation: decision.logicEvaluation || '',
      missingInformation: decision.missingInformation as any,
      biasFlags: decision.biasFlags as any,
      financialImpact: decision.financialImpact || '',
      operationalImpact: decision.operationalImpact || '',
      complianceIssues: decision.complianceIssues as any,
      historicalReferences,
      createdAt: decision.createdAt.toISOString()
    };

  } catch (error) {
    console.error("Error in evaluateAndStoreDecision:", error);
    throw error;
  }
}
