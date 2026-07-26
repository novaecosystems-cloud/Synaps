import { NextResponse } from 'next/server';
import { invokeLLMWithFallback } from '@/lib/llm-router';

// In-memory executive clone profile state
let founderCloneProfile = {
  founderName: 'Shourya Uday Shetty',
  role: 'Founder & CEO',
  riskTolerance: 'BALANCED', // AGGRESSIVE, BALANCED, CONSERVATIVE
  communicationStyle: 'DIRECT & DATA-DRIVEN',
  decisionPrinciples: [
    'Always ground contract disputes in line-level legal facts',
    'Prioritize long-term vendor partnerships over short-term savings',
    'Reject any multi-year auto-renewal trap without a 30-day exit clause',
    'Protect operational margins while maintaining 5-star service standards'
  ],
  customDirectives: 'Never compromise on quality. Ask tough questions about ROI.'
};

export async function GET() {
  return NextResponse.json({
    success: true,
    profile: founderCloneProfile
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.action === 'update_profile') {
      founderCloneProfile = {
        ...founderCloneProfile,
        ...body.profile
      };
      return NextResponse.json({
        success: true,
        message: 'Founder Digital Twin Clone profile updated & trained successfully!',
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
          content: `You are the AI Digital Twin clone of ${founderCloneProfile.founderName} (${founderCloneProfile.role}).
Your Risk Tolerance is ${founderCloneProfile.riskTolerance}.
Your Communication Style is ${founderCloneProfile.communicationStyle}.
Your core decision principles are:
${founderCloneProfile.decisionPrinciples.map((p, i) => `${i + 1}. ${p}`).join('\n')}
Custom Directives: ${founderCloneProfile.customDirectives}

Simulate how ${founderCloneProfile.founderName} would respond to and solve the given operational scenario. Speak in 1st person ("I would..."). Be crisp, authoritative, and strategic.`
        },
        {
          role: 'user',
          content: `Scenario to analyze: "${scenario}"`
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
    console.error('Digital Twin Clone API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
