export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';

const AGENTS = [
  { id: 'doc_analyst', name: 'Document Analyst', action: 'Analyzing raw document structure...' },
  { id: 'req_analyst', name: 'Requirement Analyst', action: 'Extracting and categorizing requirements...' },
  { id: 'comp_analyst', name: 'Compliance Analyst', action: 'Checking requirements against Knowledge Base...' },
  { id: 'risk_analyst', name: 'Risk Analyst', action: 'Identifying gaps and formulating mitigations...' },
  { id: 'exec_reviewer', name: 'Executive Reviewer', action: 'Evaluating risks for Go/No-Go decision...' },
  { id: 'prop_writer', name: 'Proposal Writer', action: 'Drafting multi-section business proposal...' }
];

export async function POST(req: NextRequest) {
  const { documentId, mode = 'detailed' } = await req.json();
  if (!documentId) return NextResponse.json({ error: 'Missing documentId' }, { status: 400 });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (type: string, agentId: string, message: string, data?: any) => {
        try {
          const payload = JSON.stringify({ type, agentId, message, data, timestamp: new Date().toISOString() });
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        } catch (e) {
          // Ignore errors if the client disconnects, allow background processing to continue
        }
      };

      try {
        const origin = req.nextUrl.origin;
        const baseUrl = origin.includes('localhost') ? `http://127.0.0.1:${process.env.PORT || 3000}` : origin;

        sendEvent('info', 'orchestrator', 'Orchestration started for document ' + documentId);

        // 1. Document Analyst (Validation)
        sendEvent('status', 'doc_analyst', 'active');
        sendEvent('log', 'doc_analyst', 'Verifying document processing status...');
        
        try {
          await fetch(`${baseUrl}/api/jobs/process?documentId=${documentId}`, {
            headers: {
              'Authorization': `Bearer ${process.env.CRON_SECRET || ''}`,
              'Cookie': req.headers.get('cookie') || ''
            }
          });
          await new Promise(r => setTimeout(r, 1000));
        } catch (e) {
          console.error('Failed to trigger job processor:', e);
        }
        
        sendEvent('status', 'doc_analyst', 'completed');

        // 2. Requirement Analyst
        sendEvent('status', 'req_analyst', 'active');
        sendEvent('log', 'req_analyst', 'Initiating AI extraction pipeline...');
        const reqRes = await fetch(`${baseUrl}/api/requirements/extract`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Cookie': req.headers.get('cookie') || '' 
          },
          body: JSON.stringify({ documentId })
        }).then(r => r.json());
        if (!reqRes.success) throw new Error(typeof reqRes.error === 'object' ? JSON.stringify(reqRes.error) : reqRes.error);
        sendEvent('log', 'req_analyst', `Extracted ${reqRes.count} requirements successfully.`);
        sendEvent('status', 'req_analyst', 'completed');

        // 3. Compliance Analyst
        sendEvent('status', 'comp_analyst', 'active');
        sendEvent('log', 'comp_analyst', 'Querying vector database for coverage...');
        const covRes = await fetch(`${baseUrl}/api/requirements/coverage`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Cookie': req.headers.get('cookie') || ''
          },
          body: JSON.stringify({ documentId })
        }).then(r => r.json());
        if (!covRes.success) throw new Error(typeof covRes.error === 'object' ? JSON.stringify(covRes.error) : covRes.error);
        sendEvent('log', 'comp_analyst', `Completed coverage analysis across all requirements.`);
        sendEvent('status', 'comp_analyst', 'completed');

        // 4. Risk Analyst
        sendEvent('status', 'risk_analyst', 'active');
        sendEvent('log', 'risk_analyst', 'Analyzing compliance gaps...');
        const gapRes = await fetch(`${baseUrl}/api/gaps/analyze`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Cookie': req.headers.get('cookie') || ''
          },
          body: JSON.stringify({ documentId })
        }).then(r => r.json());
        if (!gapRes.success) throw new Error(typeof gapRes.error === 'object' ? JSON.stringify(gapRes.error) : gapRes.error);
        sendEvent('log', 'risk_analyst', `Identified ${gapRes.gaps?.length || 0} critical/moderate gaps.`);
        sendEvent('status', 'risk_analyst', 'completed');

        // 5. Executive Reviewer
        sendEvent('status', 'exec_reviewer', 'active');
        sendEvent('log', 'exec_reviewer', 'Formulating Go/No-Go Decision based on Risk matrix...');
        const decRes = await fetch(`${baseUrl}/api/decisions/analyze`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Cookie': req.headers.get('cookie') || ''
          },
          body: JSON.stringify({ documentId })
        }).then(r => r.json());
        if (!decRes.success) throw new Error(typeof decRes.error === 'object' ? JSON.stringify(decRes.error) : decRes.error);
        sendEvent('log', 'exec_reviewer', `Decision Reached: ${decRes.decision?.recommendation}`);
        
        sendEvent('log', 'exec_reviewer', 'Generating Executive Summary Report...');
        const sumRes = await fetch(`${baseUrl}/api/summary/analyze`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Cookie': req.headers.get('cookie') || ''
          },
          body: JSON.stringify({ documentId })
        }).then(r => r.json());
        if (!sumRes.success) throw new Error(typeof sumRes.error === 'object' ? JSON.stringify(sumRes.error) : sumRes.error);
        sendEvent('status', 'exec_reviewer', 'completed');

        // 6. Proposal Writer
        sendEvent('status', 'prop_writer', 'active');
        sendEvent('log', 'prop_writer', 'Drafting comprehensive 13-section business proposal...');
        const propRes = await fetch(`${baseUrl}/api/proposals/generate`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Cookie': req.headers.get('cookie') || ''
          },
          body: JSON.stringify({ documentId, mode })
        }).then(r => r.json());
        if (!propRes.success) throw new Error(typeof propRes.error === 'object' ? JSON.stringify(propRes.error) : propRes.error);
        sendEvent('log', 'prop_writer', `Proposal drafted successfully with ${propRes.proposal?.sections?.length || 0} sections.`);
        sendEvent('status', 'prop_writer', 'completed');

        sendEvent('complete', 'orchestrator', 'Multi-Agent Orchestration Completed Successfully!');
      } catch (err: any) {
        console.error('Orchestration Error:', err);
        const errMsg = err.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
        sendEvent('error', 'orchestrator', errMsg);
      } finally {
        controller.close();
      }
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

