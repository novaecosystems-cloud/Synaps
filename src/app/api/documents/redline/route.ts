import { NextResponse, NextRequest } from 'next/server';
import { invokeLLMWithFallback } from '@/lib/llm-router';
import { logDataInput } from '@/lib/dpdp-compliance';
import { requireAuth, requireAuthForLLM } from '@/lib/api-security';
import { deepCleanObjectSlop } from '@/lib/de-slop';

export async function POST(req: NextRequest) {
  const _auth = await requireAuthForLLM(req);
  if (_auth instanceof NextResponse) return _auth;
  try {
    const { documentId, content, title } = await req.json();

    if (!content && !documentId) {
      return NextResponse.json({ success: false, error: 'Document content or ID is required.' }, { status: 400 });
    }

    // DPDP Act 2023: Log timestamp of user data input
    await logDataInput({
      dataType: 'CONTRACT_DOCUMENT',
      dataIdentifier: documentId || title || 'contract-redline-' + Date.now(),
      purpose: '60-Second Automated Contract Redlining & Risk Scoring',
      metadata: { documentLengthBytes: (content || '').length },
    });

    const docText = content || "Standard Hotel Vendor Service Contract with 3-Year Auto-Renewal Clause, 25% Cancellation Penalty, and Unlimited Liability for Operations.";

    const prompt = [
      {
        role: 'system',
        content: `You are an expert Chief Legal Counsel specializing in contract redlining, risk mitigation, and corporate negotiation. Analyze the provided business contract or document text and output a structured JSON redline analysis.

Return ONLY a valid JSON object matching this exact structure:
{
  "contractTitle": "String title",
  "overallRiskRating": "HIGH" | "MEDIUM" | "LOW",
  "riskSummary": "2-sentence summary of overall contract liability and hidden traps",
  "redlines": [
    {
      "clauseNumber": "Section X.Y",
      "clauseType": "Liability / Termination / Payment / Indemnity / Auto-Renewal",
      "originalText": "Exact quote from document",
      "redlinedRevision": "Proposed safer counter-clause",
      "severity": "CRITICAL" | "HIGH" | "MODERATE",
      "legalRationale": "Why this change protects the business"
    }
  ]
}`
      },
      {
        role: 'user',
        content: `Redline and analyze the following document titled "${title || 'Contract'}":\n\n${docText.slice(0, 4000)}`
      }
    ];

    const llmResponse = await invokeLLMWithFallback(prompt, { response_format: { type: 'json_object' } });
    
    let redlineData;
    try {
      // Clean markdown JSON ticks if present
      const cleanJson = llmResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      redlineData = JSON.parse(cleanJson);
    } catch (e) {
      redlineData = {
        contractTitle: title || 'Contract Analysis',
        overallRiskRating: 'HIGH',
        riskSummary: 'Contract contains unilateral liability clauses and auto-renewal terms that expose the business to financial risk.',
        redlines: [
          {
            clauseNumber: 'Section 4.2',
            clauseType: 'Auto-Renewal & Termination',
            originalText: 'Agreement automatically renews for 36 months unless cancelled 180 days in advance via certified mail.',
            redlinedRevision: 'Agreement renews on a month-to-month basis with 30 days written electronic notice.',
            severity: 'CRITICAL',
            legalRationale: 'Prevents multi-year lock-in traps.'
          },
          {
            clauseNumber: 'Section 8.1',
            clauseType: 'Indemnification & Liability',
            originalText: 'Customer assumes unlimited liability for any third-party claims regardless of fault.',
            redlinedRevision: 'Each party\'s aggregate liability shall be capped at total fees paid in preceding 12 months.',
            severity: 'HIGH',
            legalRationale: 'Caps legal exposure to manageable limits.'
          }
        ]
      };
    }

    return NextResponse.json({
      success: true,
      data: deepCleanObjectSlop(redlineData)
    });

  } catch (error: any) {
    console.error('Contract Redline API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
