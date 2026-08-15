/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SYNAPS AUTOMATED ANTI-SLOP & EXECUTIVE POLISH ENGINE
 * ─────────────────────────────────────────────────────────────────────────────
 * Enforces Peter Yang's 20+ No-AI-Slop rules automatically across all
 * Executive Boardroom briefings, Chief of Staff memos, Legal Redlines,
 * and Proposal drafting engines.
 */

export const ANTI_SLOP_SYSTEM_DIRECTIVE = `
[STRICT WRITING & ANTI-SLOP DIRECTIVE - ZERO FLUFF]:
1. NEVER use throat-clearing intros (e.g., "In today's fast-paced environment...", "It is worth noting that...", "Let's dive into...", "In conclusion, only time will tell...").
2. BANNED AI BUZZWORDS: Never use words like "delve", "tapestry", "beacon", "transformative", "game-changer", "holistic", "seamless", "synergy", "crucial", "testament", "pivotal", "paramount", "foster", "embark", "multifaceted", "underpin", "revolutionize".
3. USE ACTIVE VOICE: Use human-directed actions (e.g., "The board approved $15M" NOT "Approval was granted for $15M").
4. PORTABILITY TEST: Do not output generic sentences that could describe any company. Include concrete numbers, dates, clause numbers, and statutory sections.
5. PUNCHY & DIRECT: Lead with the conclusion and bottom-line impact immediately.
`;

/**
 * List of banned AI slop patterns and regex replacements
 */
const SLOP_PATTERNS: Array<{ pattern: RegExp; replacement: string }> = [
  // Throat-clearing openings
  { pattern: /^(In today's (fast-paced|dynamic|ever-changing|rapidly evolving) (world|landscape|market|environment),?\s*)/gi, replacement: '' },
  { pattern: /^(It is (important|crucial|essential|worth noting) to (note|remember|mention|highlight) that\s*)/gi, replacement: '' },
  { pattern: /^(Let's (dive deep|delve|take a closer look) into\s*)/gi, replacement: '' },
  { pattern: /^(In the realm of\s*)/gi, replacement: 'In ' },
  { pattern: /^(When it comes to\s*)/gi, replacement: 'Regarding ' },

  // Generic filler & commentary
  { pattern: /\bstands as a testament to\b/gi, replacement: 'demonstrates' },
  { pattern: /\ba rich tapestry of\b/gi, replacement: 'a diverse range of' },
  { pattern: /\bdelve into\b/gi, replacement: 'examine' },
  { pattern: /\bdelving into\b/gi, replacement: 'examining' },
  { pattern: /\bdelves into\b/gi, replacement: 'examines' },
  { pattern: /\bgame-changing\b/gi, replacement: 'high-impact' },
  { pattern: /\btransformative journey\b/gi, replacement: 'strategic execution' },
  { pattern: /\bseamless integration\b/gi, replacement: 'direct integration' },
  { pattern: /\bholistic approach\b/gi, replacement: 'comprehensive approach' },
  { pattern: /\bfoster a culture of\b/gi, replacement: 'build' },
  { pattern: /\bnavigating the complexities of\b/gi, replacement: 'managing' },
  { pattern: /\bplay a pivotal role\b/gi, replacement: 'be decisive' },
  { pattern: /\bplays a crucial role\b/gi, replacement: 'is essential' },
  { pattern: /\bparamount importance\b/gi, replacement: 'high priority' },
  { pattern: /\bmultifaceted\b/gi, replacement: 'complex' },
  { pattern: /\bunderscores the importance of\b/gi, replacement: 'highlights' },
  { pattern: /\btestament to the fact that\b/gi, replacement: 'evidence that' },

  // Cliché conclusions
  { pattern: /\bIn conclusion, only time will tell\b/gi, replacement: 'In conclusion,' },
  { pattern: /\bAs we look to the future, it is clear that\b/gi, replacement: 'Going forward,' },
  { pattern: /\bAt the end of the day,?\s*/gi, replacement: 'Ultimately, ' },
  { pattern: /\bMoving forward into the future,?\s*/gi, replacement: 'Next, ' },
];

/**
 * Automatically scrubs AI slop from any generated text while preserving technical facts
 */
export function cleanAISlop(text: string): string {
  if (!text || typeof text !== 'string') return text;

  let cleaned = text;

  // Apply pattern replacements
  for (const { pattern, replacement } of SLOP_PATTERNS) {
    cleaned = cleaned.replace(pattern, replacement);
  }

  // Clean up double spaces and awkward punctuation caused by strippings
  cleaned = cleaned
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,;:])/g, '$1')
    .replace(/^\s*[,\-–]\s*/gm, '')
    .trim();

  return cleaned;
}

/**
 * Recursively cleans all string fields in an executive data object or JSON payload
 */
export function deepCleanObjectSlop<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') {
    if (typeof obj === 'string') {
      return cleanAISlop(obj) as unknown as T;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepCleanObjectSlop(item)) as unknown as T;
  }

  const cleanedObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    cleanedObj[key] = deepCleanObjectSlop(value);
  }

  return cleanedObj as T;
}
