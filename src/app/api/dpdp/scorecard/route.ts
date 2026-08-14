import { NextResponse } from 'next/server';
import { calculateDPDPComplianceScore, SUB_PROCESSOR_INVENTORY, DPDP_GRIEVANCE_OFFICER } from '@/lib/dpdp-compliance';

// GET /api/dpdp/scorecard
// Returns the live DPDP 0–90 Compliance Score and breakdown matching Appendix B
export async function GET() {
  const scorecard = calculateDPDPComplianceScore();

  return NextResponse.json({
    success: true,
    data: {
      scorecard,
      officer: DPDP_GRIEVANCE_OFFICER,
      subProcessorsCount: SUB_PROCESSOR_INVENTORY.length,
      statutoryComplianceRating: scorecard.rating,
      auditTimestamp: new Date().toISOString(),
    },
    meta: {
      checklistSource: 'DPDP Act 2023 Technical Compliance Checklist (MeitY)',
      totalModules: 9,
      maxStatutoryPoints: 90,
    },
  });
}
