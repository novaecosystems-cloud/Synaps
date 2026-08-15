/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SYNAPS EXECUTIVE FOCUS & ACTION-FIRST ENGINE (INSPIRED BY I-HAVE-ADHD)
 * ─────────────────────────────────────────────────────────────────────────────
 * Formats all AI output for high-velocity executives and founders:
 * 1. Leads with the immediate next action first (no burying the answer).
 * 2. Numbers multi-step workflows into small, bounded 1-action steps.
 * 3. Adds concrete micro-time estimates (e.g. "[Takes ~90 seconds]").
 * 4. Anchors state & surfaces visible wins.
 * 5. Suppresses tangents to preserve cognitive bandwidth.
 */

export const EXECUTIVE_FOCUS_DIRECTIVE = `
[EXECUTIVE FOCUS & ACTION-FIRST DIRECTIVE]:
1. LEAD WITH THE NEXT ACTION: The very first line must be the exact decision, command, or action the reader can take right now. Do NOT start with background narrative or pleasantries.
2. NUMBER MULTI-STEP WORK: If an action takes more than 1 step, format it as a clean numbered list (1, 2, 3) where each step is one bounded action.
3. CONCRETE TIME ESTIMATES: Include exact time-to-execute estimates for key decisions (e.g., "[Takes 2 mins]", "[Takes 45 seconds]").
4. SUPPRESS TANGENTS: Solve the primary objective first. Park secondary topics into a separate "Secondary Note" at the very end.
5. RESTATE STATE & VISIBLE WINS: Clearly state progress (e.g., "Status: 3 of 4 regulatory requirements satisfied").
`;

export interface ActionItem {
  id: string;
  action: string;
  timeEstimate: string; // e.g. "90 sec"
  urgency: 'IMMEDIATE' | 'TODAY' | 'THIS_WEEK';
  impact: string;
  stepNumber?: number;
}

/**
 * Extracts a high-velocity 1-action headline from any executive text
 */
export function extractTopExecutiveAction(text: string): ActionItem {
  if (!text) {
    return {
      id: 'act_default',
      action: 'Review pending executive queue in Chief of Staff',
      timeEstimate: '60 sec',
      urgency: 'TODAY',
      impact: 'Keeps organizational milestone progress on track',
    };
  }

  // Regex lookups for action verbs
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const actionLine = lines.find((l) =>
    /^(Approve|Sign|Execute|Review|Authorize|Deploy|Verify|Send|Schedule|Update)\b/i.test(l)
  ) || lines[0] || 'Approve pending matter';

  return {
    id: `act_${Date.now()}`,
    action: actionLine.replace(/^[-*•\d.]+\s*/, '').slice(0, 140),
    timeEstimate: '90 sec',
    urgency: 'IMMEDIATE',
    impact: 'Resolves primary blocking dependency',
  };
}
