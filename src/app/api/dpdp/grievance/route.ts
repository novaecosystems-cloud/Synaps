import { NextRequest, NextResponse } from 'next/server';
import { DPDP_GRIEVANCE_OFFICER, logDataInput } from '@/lib/dpdp-compliance';
import { createHash } from 'crypto';

// GET /api/dpdp/grievance
// Returns the public Grievance Officer details and statutory SLA
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      officer: DPDP_GRIEVANCE_OFFICER,
      statutoryBasis: 'DPDP Act 2023 Section 8 & Section 13 (Grievance Redressal Mechanism)',
      filingInstructions: 'Submit formal data grievances via this endpoint or direct email to the officer.',
    },
  });
}

// POST /api/dpdp/grievance
// File a formal DPDP data protection grievance
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { complainantName, complainantEmail, natureOfComplaint, userId } = body;

    if (!complainantName || !complainantEmail || !natureOfComplaint) {
      return NextResponse.json(
        { error: 'Missing required fields: complainantName, complainantEmail, natureOfComplaint' },
        { status: 400 }
      );
    }

    const timestamp = new Date();
    const resolutionDueDate = new Date();
    resolutionDueDate.setDate(timestamp.getDate() + 30); // 30-day statutory SLA

    const ticketId = `GRV-${createHash('md5').update(`${complainantEmail}_${timestamp.getTime()}`).digest('hex').slice(0, 8).toUpperCase()}`;

    // Log grievance submission in audit log
    await logDataInput({
      userId: userId || undefined,
      dataType: 'PERSONAL_IDENTIFIABLE_INFO',
      dataIdentifier: `grievance_${ticketId}`,
      purpose: 'DPDP Act 2023 Sec 13 Grievance Redressal Submission',
      metadata: {
        ticketId,
        complainantName,
        complainantEmail,
        natureOfComplaint,
        resolutionDueBy: resolutionDueDate.toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ticketId,
        status: 'RECEIVED',
        submittedAt: timestamp.toISOString(),
        acknowledgedBy: DPDP_GRIEVANCE_OFFICER.name,
        acknowledgmentSla: 'Within 24 hours',
        resolutionDueBy: resolutionDueDate.toISOString(),
        grievanceOfficerContact: DPDP_GRIEVANCE_OFFICER.email,
      },
      meta: {
        statutoryStandard: 'DPDP Act 2023 Section 13 (Grievance Redressal)',
      },
    }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
