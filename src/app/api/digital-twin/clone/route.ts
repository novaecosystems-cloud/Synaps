import { NextResponse, NextRequest } from 'next/server';
import { invokeLLMWithFallback } from '@/lib/llm-router';
import { requireAuthForLLM } from '@/lib/api-security';

// Organizational policy & decision memory profile state
let founderCloneProfile = {
  founderName: 'Shourya Uday Shetty',
  role: 'Executive Lead',
  riskTolerance: 'BALANCED',
  communicationStyle: 'DIRECT & DATA-DRIVEN',
  decisionPrinciples: [
    'Always ground contract disputes in line-level legal facts',
    'Prioritize long-term vendor partnerships over short-term savings',
    'Reject any multi-year auto-renewal trap without a 30-day exit clause',
    'Protect operational margins while maintaining 5-star service standards'
  ],
  customDirectives: 'Provide recommendations strictly consistent with documented policies, historical decisions, and risk management guidelines.'
};

export async function GET(req: NextRequest) {
  const _auth = await requireAuthForLLM(req);
  if (_auth instanceof NextResponse) return _auth;
  return NextResponse.json({
    success: true,
    profile: founderCloneProfile
  });
}

export async function POST(req: NextRequest) {
  const _auth = await requireAuthForLLM(req);
  if (_auth instanceof NextResponse) return _auth;
  try {
    const body = await req.json();

    if (body.action === 'update_profile') {
      founderCloneProfile = {
        ...founderCloneProfile,
        ...body.profile
      };
      return NextResponse.json({
        success: true,
        message: 'Policy memory profile updated successfully!',
        profile: founderCloneProfile
      });
    }

    if (body.action === 'simulate_decision') {
      const { scenario } = body;
      if (!scenario) {
        return NextResponse.json({ success: false, error: 'Scenario description is required.' }, { status: 400 });
      }

      const prompt = [
        {
          role: 'system',
          content: `You are the Organizational Policy & Decision Memory Engine for ${founderCloneProfile.founderName}'s organization.

Your objective is to provide executive recommendations consistent with the organization's documented policies, historical decisions, and past actions.

Risk Alignment: ${founderCloneProfile.riskTolerance}.
Communication Style: ${founderCloneProfile.communicationStyle}.
Core Decision Principles:
${founderCloneProfile.decisionPrinciples.map((p, i) => `${i + 1}. ${p}`).join('\n')}
Governance Directive: ${founderCloneProfile.customDirectives}

Format your output into distinct, well-spaced sections:
**Risk Assessment & Strategic Impact**
(Clear analysis of the risk)

**Policy Alignment**
(How this aligns with core principles)

**Executive Action Plan**
1. Action step one
2. Action step two
3. Action step three

**Citations:**
* Core Decision Principle X: ...`
        },
        {
          role: 'user',
          content: `Operational scenario to evaluate against policy memory: "${scenario}"`
        }
      ];

      const twinResponse = await invokeLLMWithFallback(prompt);

      return NextResponse.json({
        success: true,
        scenario: scenario,
        founderName: founderCloneProfile.founderName,
        decisionResponse: twinResponse
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action.' }, { status: 400 });

  } catch (error: any) {
    console.error('Policy Memory API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
