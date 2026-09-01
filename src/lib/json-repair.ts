/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CAUSARIX 4-STAGE DETERMINISTIC JSON REPAIR & VALIDATION ENGINE
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides fault-tolerant, deterministic parsing, syntax repair, heuristic recovery,
 * and Zod validation for LLM outputs. Guaranteed zero unhandled exceptions.
 */

import { z } from 'zod';
import {
  ExecutiveAgentAnalysis,
  ExecutiveVerdict,
  BoardSynthesis,
} from './schemas/boardroom-schema';

export interface RepairResult<T> {
  success: boolean;
  data: T;
  stage: 'DIRECT' | 'CLEANED' | 'HEURISTIC_RECOVERED' | 'FALLBACK_INFILLED';
  rawCleaned?: string;
  error?: string;
}

/**
 * Strips markdown codeblocks, XML wrappers, comments, normalizes non-standard
 * literals, fixes unquoted and single-quoted keys, removes trailing commas,
 * trims postambles/preambles, and balances unclosed brackets/braces.
 */
export function cleanRawJsonString(raw: string): string {
  if (!raw || typeof raw !== 'string') return '{}';

  let text = raw.trim();

  // 1. Remove Markdown code blocks (```json ... ``` or ``` ...) and XML wrappers
  text = text.replace(/^```(?:json|JSON|javascript|js)?\s*/i, '');
  text = text.replace(/\s*```$/g, '');
  text = text.replace(/<\/?(?:json|output|response)>/gi, '');

  // If enclosed inside markdown fences somewhere in the middle:
  const fenceMatch = text.match(/```(?:json|JSON)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch && fenceMatch[1]) {
    text = fenceMatch[1].trim();
  }

  // 2. Locate outermost JSON boundaries
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  const firstBracket = text.indexOf('[');
  const lastBracket = text.lastIndexOf(']');

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    if (lastBrace !== -1 && lastBrace >= firstBrace) {
      text = text.substring(firstBrace, lastBrace + 1);
    } else {
      text = text.substring(firstBrace);
    }
  } else if (firstBracket !== -1) {
    if (lastBracket !== -1 && lastBracket >= firstBracket) {
      text = text.substring(firstBracket, lastBracket + 1);
    } else {
      text = text.substring(firstBracket);
    }
  }

  // 3. Remove single-line and multi-line comments
  text = text.replace(/\/\*[\s\S]*?\*\//g, '');
  text = text.replace(/(^|[^:])\/\/[^\n]*/g, '$1');

  // 4. Normalize Python & non-standard literals
  text = text.replace(/:\s*True\b/g, ': true');
  text = text.replace(/:\s*False\b/g, ': false');
  text = text.replace(/:\s*None\b/g, ': null');
  text = text.replace(/:\s*NaN\b/g, ': null');
  text = text.replace(/:\s*Infinity\b/g, ': 999999');

  // 5. Replace single-quoted keys and string values with double quotes:
  // e.g. {'verdict': 'SUPPORT'} -> {"verdict": "SUPPORT"}
  text = text.replace(/(\s*['])([^'\n\r]+)([']\s*:)/g, '"$2":');
  text = text.replace(/:\s*'([^'\n\r]*)'/g, ': "$1"');

  // 6. Fix unquoted keys: { verdict: "SUPPORT" } -> { "verdict": "SUPPORT" }
  text = text.replace(/([{,]\s*)([a-zA-Z0-9_$]+)\s*:/g, '$1"$2":');

  // 7. Remove trailing commas before } or ]
  text = text.replace(/,\s*([}\]])/g, '$1');

  // 8. Balance braces and brackets if truncated
  text = balanceBracesAndBrackets(text);

  return text;
}

/**
 * Tracks string literals and brace/bracket hierarchy, auto-closing unclosed
 * tokens in LIFO order if output was truncated.
 */
export function balanceBracesAndBrackets(input: string): string {
  let str = input;
  const stack: string[] = [];
  let inString = false;
  let isEscaped = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (inString) {
      if (char === '\\' && !isEscaped) {
        isEscaped = true;
        continue;
      }
      if (char === '"' && !isEscaped) {
        inString = false;
      }
      isEscaped = false;
      continue;
    }

    if (char === '"') {
      inString = true;
      isEscaped = false;
    } else if (char === '{') {
      stack.push('}');
    } else if (char === '[') {
      stack.push(']');
    } else if (char === '}' || char === ']') {
      if (stack.length > 0 && stack[stack.length - 1] === char) {
        stack.pop();
      }
    }
  }

  // If ended while still inside a string literal, close the string
  if (inString) {
    str += '"';
  }

  // Remove any trailing comma at the end of the incomplete structure
  str = str.replace(/,\s*$/, '');

  // Close all open braces / brackets in reverse order
  while (stack.length > 0) {
    const closingToken = stack.pop();
    str += closingToken;
  }

  return str;
}

/**
 * Coerces schema fields guided by expected defaults (e.g. string numbers to numbers,
 * single strings to arrays, uppercase verdicts).
 */
export function reconcileWithSchemaDefaults<T>(parsed: any, defaults: T): any {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ...defaults };
  }

  const result: any = { ...defaults, ...parsed };

  // Coerce confidenceScore
  if ('confidenceScore' in result) {
    if (typeof result.confidenceScore === 'string') {
      const matched = result.confidenceScore.match(/\d+/);
      result.confidenceScore = matched
        ? Math.min(100, Math.max(0, parseInt(matched[0], 10)))
        : 88;
    } else if (typeof result.confidenceScore === 'number') {
      result.confidenceScore = Math.min(100, Math.max(0, Math.round(result.confidenceScore)));
    }
  }

  // Coerce verdict
  if ('verdict' in result && typeof result.verdict === 'string') {
    const v = result.verdict.toUpperCase().trim();
    if (v.includes('SUPPORT') || v.includes('APPROV') || v.includes('YES')) {
      result.verdict = 'SUPPORT';
    } else if (v.includes('OPPOSE') || v.includes('REJECT') || v.includes('NO')) {
      result.verdict = 'OPPOSE';
    } else {
      result.verdict = 'CONDITIONAL';
    }
  }

  // Coerce arrays
  const arrayKeys = [
    'keyConcerns',
    'dataEvidence',
    'consensus',
    'disagreements',
    'risks',
    'opportunities',
    'governanceTacticsEnforced',
    'actionItems',
    'strategicPriorities',
    'riskMitigations',
  ];

  for (const k of arrayKeys) {
    if (k in result) {
      if (!Array.isArray(result[k])) {
        result[k] = typeof result[k] === 'string' && result[k].trim()
          ? [result[k].trim()]
          : [];
      } else {
        result[k] = result[k].map(String).filter(Boolean);
      }
    }
  }

  // Coerce overallConfidence
  if ('overallConfidence' in result) {
    if (typeof result.overallConfidence === 'string') {
      const matched = result.overallConfidence.match(/\d+/);
      result.overallConfidence = matched
        ? Math.min(100, Math.max(0, parseInt(matched[0], 10)))
        : 90;
    } else if (typeof result.overallConfidence === 'number') {
      result.overallConfidence = Math.min(100, Math.max(0, Math.round(result.overallConfidence)));
    }
  }

  return result;
}

/**
 * Heuristically extracts executive analysis fields when JSON.parse fails completely.
 */
export function extractPartialExecutiveFields(
  raw: string,
  fallback: Partial<ExecutiveAgentAnalysis>
): Partial<ExecutiveAgentAnalysis> {
  const result: Partial<ExecutiveAgentAnalysis> = { ...fallback };

  if (!raw || typeof raw !== 'string') return result;

  // 1. Verdict extraction
  const verdictMatch = raw.match(/["']?verdict["']?\s*:\s*["']?([A-Za-z]+)["']?/i);
  if (verdictMatch && verdictMatch[1]) {
    const v = verdictMatch[1].toUpperCase();
    if (v.includes('SUPPORT') || v.includes('APPROV')) result.verdict = 'SUPPORT' as ExecutiveVerdict;
    else if (v.includes('OPPOSE') || v.includes('REJECT')) result.verdict = 'OPPOSE' as ExecutiveVerdict;
    else result.verdict = 'CONDITIONAL' as ExecutiveVerdict;
  }

  // 2. Reasoning extraction
  const reasoningMatch =
    raw.match(/["']?reasoning["']?\s*:\s*"((?:[^"\\]|\\.)*)"/i) ||
    raw.match(/["']?reasoning["']?\s*:\s*"([\s\S]*?)(?:"\s*,\s*"[a-zA-Z]+|\}\s*$)/i);
  if (reasoningMatch && reasoningMatch[1]) {
    result.reasoning = reasoningMatch[1].replace(/\\"/g, '"').replace(/\\n/g, ' ').trim();
  }

  // 3. Confidence score extraction
  const confMatch = raw.match(/["']?confidenceScore["']?\s*:\s*([0-9]{1,3})/i);
  if (confMatch && confMatch[1]) {
    const parsed = parseInt(confMatch[1], 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
      result.confidenceScore = parsed;
    }
  }

  // 4. Key concerns extraction
  const concernsMatch = raw.match(/["']?keyConcerns["']?\s*:\s*\[([\s\S]*?)\]/i);
  if (concernsMatch && concernsMatch[1]) {
    const items = concernsMatch[1].match(/"([^"]+)"|'([^']+)'/g);
    if (items && items.length > 0) {
      result.keyConcerns = items.map((s) => s.replace(/^["']|["']$/g, '').trim()).filter(Boolean);
    }
  }

  // 5. Data evidence extraction
  const evidenceMatch = raw.match(/["']?dataEvidence["']?\s*:\s*\[([\s\S]*?)\]/i);
  if (evidenceMatch && evidenceMatch[1]) {
    const items = evidenceMatch[1].match(/"([^"]+)"|'([^']+)'/g);
    if (items && items.length > 0) {
      result.dataEvidence = items.map((s) => s.replace(/^["']|["']$/g, '').trim()).filter(Boolean);
    }
  }

  return result;
}

/**
 * Heuristically extracts boardroom synthesis fields when JSON.parse fails completely.
 */
export function extractPartialSynthesisFields(
  raw: string,
  fallback: BoardSynthesis
): BoardSynthesis {
  const result: BoardSynthesis = { ...fallback };

  if (!raw || typeof raw !== 'string') return result;

  const recMatch =
    raw.match(/["']?finalRecommendation["']?\s*:\s*"((?:[^"\\]|\\.)*)"/i) ||
    raw.match(/["']?finalRecommendation["']?\s*:\s*"([\s\S]*?)(?:"\s*,\s*"[a-zA-Z]+|\}\s*$)/i);
  if (recMatch && recMatch[1]) {
    result.finalRecommendation = recMatch[1].replace(/\\"/g, '"').replace(/\\n/g, ' ').trim();
  }

  const confMatch = raw.match(/["']?overallConfidence["']?\s*:\s*([0-9]{1,3})/i);
  if (confMatch && confMatch[1]) {
    const parsed = parseInt(confMatch[1], 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
      result.overallConfidence = parsed;
    }
  }

  const extractArray = (key: string): string[] | null => {
    const match = raw.match(new RegExp(`["']?${key}["']?\\s*:\\s*\\[([\\s\\S]*?)\\]`, 'i'));
    if (match && match[1]) {
      const items = match[1].match(/"([^"]+)"|'([^']+)'/g);
      if (items && items.length > 0) {
        return items.map((s) => s.replace(/^["']|["']$/g, '').trim()).filter(Boolean);
      }
    }
    return null;
  };

  const consensus = extractArray('consensus');
  if (consensus && consensus.length > 0) result.consensus = consensus;

  const disagreements = extractArray('disagreements');
  if (disagreements) result.disagreements = disagreements;

  const risks = extractArray('risks');
  if (risks) result.risks = risks;

  const opportunities = extractArray('opportunities');
  if (opportunities) result.opportunities = opportunities;

  return result;
}

/**
 * Universal deterministic 4-stage JSON repair and validation function.
 * Guaranteed to NEVER throw an unhandled error and ALWAYS return a valid type T.
 */
export function repairAndValidateJson<T>(
  raw: string,
  schema: z.ZodType<T>,
  fallbackDefaults: T,
  options: {
    contextName?: string;
    customHeuristicExtractor?: (raw: string, fallback: T) => T;
  } = {}
): RepairResult<T> {
  const { contextName = 'JSON Repair', customHeuristicExtractor } = options;

  if (!raw || typeof raw !== 'string' || raw.trim().length === 0) {
    return {
      success: false,
      data: fallbackDefaults,
      stage: 'FALLBACK_INFILLED',
      error: 'Empty or non-string input provided',
    };
  }

  // STAGE 1: Direct parse check
  try {
    const directParsed = JSON.parse(raw);
    const directZod = schema.safeParse(directParsed);
    if (directZod.success) {
      return {
        success: true,
        data: directZod.data,
        stage: 'DIRECT',
      };
    }
  } catch {}

  // STAGE 2: Multi-pass cleaning & structural normalization
  const cleaned = cleanRawJsonString(raw);
  try {
    const parsed = JSON.parse(cleaned);
    const zodResult = schema.safeParse(parsed);
    if (zodResult.success) {
      return {
        success: true,
        data: zodResult.data,
        stage: 'CLEANED',
        rawCleaned: cleaned,
      };
    }

    // Attempt schema-guided property coercion
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const reconciled = reconcileWithSchemaDefaults(parsed, fallbackDefaults);
      const reconciledZod = schema.safeParse(reconciled);
      if (reconciledZod.success) {
        return {
          success: true,
          data: reconciledZod.data,
          stage: 'CLEANED',
          rawCleaned: cleaned,
        };
      }
    }
  } catch (cleanError: any) {
    // Proceed to Stage 3 if JSON.parse(cleaned) fails
  }

  // STAGE 3: Partial JSON recovery & heuristic extraction
  if (customHeuristicExtractor) {
    try {
      const recovered = customHeuristicExtractor(raw, fallbackDefaults);
      const recoveredZod = schema.safeParse(recovered);
      if (recoveredZod.success) {
        return {
          success: true,
          data: recoveredZod.data,
          stage: 'HEURISTIC_RECOVERED',
          rawCleaned: cleaned,
        };
      }
    } catch (heuristicErr: any) {}
  }

  // STAGE 4: Deterministic fallback infilling (Zero Exception Guarantee)
  return {
    success: false,
    data: fallbackDefaults,
    stage: 'FALLBACK_INFILLED',
    rawCleaned: cleaned,
    error: `[${contextName}] Failed to parse or heuristically recover valid JSON structure`,
  };
}

/**
 * Convenience helper to clean and repair JSON in one step.
 */
export function cleanAndRepairJson<T>(
  rawText: string,
  schema: z.ZodType<T>,
  fallbackDefault: T
): T {
  const result = repairAndValidateJson(rawText, schema, fallbackDefault);
  return result.data;
}
