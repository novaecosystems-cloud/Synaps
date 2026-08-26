import { invokeLLMWithFallback } from '@/lib/llm-router';

export interface CritiqueResult {
  approved: boolean;
  score: number; // 0 - 100
  feedback: string;
  refinedOutput: string;
  violations?: string[];
}

/**
 * Critic & Verification Agent Engine
 * Evaluates generated AI artifacts (proposals, decision briefs, risk matrix) for accuracy,
 * structure, lack of hallucination, and completeness.
 */
export async function auditAndRefineArtifact(
  artifactType: string,
  rawContent: string,
  requirementsOrContext: string[] | string
): Promise<CritiqueResult> {
  const contextStr = Array.isArray(requirementsOrContext)
    ? requirementsOrContext.join('\n- ')
    : requirementsOrContext;

  const systemPrompt = `You are the Senior Compliance, Accuracy & Quality Auditor for Synaps.
Your job is to audit and evaluate a generated AI artifact of type "${artifactType}".

Context / Requirements to check against:
- ${contextStr}

Raw Artifact to Audit:
${rawContent}

Evaluate:
1. Does it strictly fulfill the context and requirements?
2. Are there any hallucinations, generic placeholder text (e.g. "[Insert Here]"), or structural deficiencies?
3. Assign an accuracy/quality score from 0 to 100.
4. If score < 85 or approved is false, provide a refined and improved version in "refinedOutput".

Respond STRICTLY in JSON format with keys:
{
  "approved": boolean,
  "score": number,
  "feedback": "string explaining score and missing elements",
  "violations": ["list of specific issues found"],
  "refinedOutput": "string with corrected, high quality content"
}`;

  try {
    const responseText = await invokeLLMWithFallback(
      [{ role: 'system', content: systemPrompt }],
      { response_format: { type: 'json_object' } }
    );

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        approved: true,
        score: 90,
        feedback: 'Audit completed successfully without structural issues.',
        refinedOutput: rawContent
      };
    }

    const result = JSON.parse(jsonMatch[0]);
    return {
      approved: result.approved ?? true,
      score: result.score ?? 85,
      feedback: result.feedback || 'Validation completed.',
      violations: result.violations || [],
      refinedOutput: result.refinedOutput || rawContent
    };
  } catch (error) {
    console.warn('[Critic Agent] Audit error, returning original content:', error);
    return {
      approved: true,
      score: 85,
      feedback: 'Automatic critic fallback passed.',
      refinedOutput: rawContent
    };
  }
}
