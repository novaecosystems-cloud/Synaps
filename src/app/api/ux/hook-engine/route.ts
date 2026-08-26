import { NextRequest, NextResponse } from 'next/server';
import { resolveAuthContext, safeErrorResponse } from '@/lib/security';
import {
  hookModelEngine,
  generateDailyHookTriggers,
  EXECUTIVE_ACTION_SHORTCUTS,
  ExecuteHabitLoopInput,
} from '@/lib/ux/hook-model-engine';

export const dynamic = 'force-dynamic';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * HOOK MODEL HABIT LOOP ENGINE API (/api/ux/hook-engine)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * GET:
 * - Returns active External Triggers, Internal Trigger states, 1-Click shortcuts,
 *   and real-time habit telemetry.
 *
 * POST:
 * - Executes a full 4-Phase Hook Habit Loop:
 *   Trigger ➔ Frictionless Action ➔ Variable Reward ➔ Compounding Investment
 */

export async function GET(req: NextRequest) {
  try {
    const auth = await resolveAuthContext(req);
    const orgId = auth.orgId || 'org_default';

    const [triggerContext, telemetry] = await Promise.all([
      generateDailyHookTriggers(orgId, auth.userId || undefined),
      hookModelEngine.getHabitLoopTelemetry(orgId, auth.userId || undefined),
    ]);

    return NextResponse.json({
      success: true,
      organizationId: orgId,
      triggerContext,
      availableShortcuts: Object.values(EXECUTIVE_ACTION_SHORTCUTS),
      telemetry,
    });
  } catch (error: any) {
    return safeErrorResponse(error, 'Failed to fetch hook engine state');
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await resolveAuthContext(req);
    const orgId = auth.orgId || 'org_default';
    const body = await req.json();

    if (!body || !body.actionKey) {
      return NextResponse.json(
        { success: false, error: 'actionKey is required (e.g. CONVENE_BOARDROOM, RUN_SCM_COUNTERFACTUAL, INVARIANT_AUTO_RESOLVE)' },
        { status: 400 }
      );
    }

    const loopInput: ExecuteHabitLoopInput = {
      organizationId: orgId,
      userId: auth.userId || undefined,
      triggerId: body.triggerId,
      actionKey: body.actionKey,
      dilemma: body.dilemma,
      actionParams: body.actionParams || {},
      decisionFeedback: body.decisionFeedback || { state: 'ACCEPTED' },
    };

    const outcome = await hookModelEngine.executeHabitLoop(loopInput);

    return NextResponse.json({
      success: true,
      loopResult: outcome,
    });
  } catch (error: any) {
    return safeErrorResponse(error, 'Failed to execute habit loop');
  }
}
