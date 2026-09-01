export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { streamExecutiveBoardMeeting } from '@/lib/executive-board';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    
    let uid = 'guest_user';
    let role = 'MEMBER';
    let organizationId = 'default-org';

    if (sessionCookie) {
      const decoded = await verifySessionCookie(sessionCookie);
      if (decoded && decoded.uid) {
        uid = decoded.uid;
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: decoded.uid },
            select: { organizationId: true, role: true }
          });
          if (dbUser) {
            organizationId = dbUser.organizationId || organizationId;
            role = dbUser.role || role;
          }
        } catch (e) {}
      }
    }

    // Enforce Credit Limits
    const { checkAndConsumeAiCredits, extractClientIp } = await import('@/lib/ai-credit-limiter');
    const clientIp = extractClientIp(req.headers);
    const creditCheck = await checkAndConsumeAiCredits(uid, role, 1, 'boardroom_streaming', clientIp);
    if (!creditCheck.success) {
      return new Response(JSON.stringify({ error: creditCheck.error }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await req.json().catch(() => ({}));
    const query = body.query || 'Evaluate quarterly strategic risks and safe-harbor compliance.';

    // Setup Server-Sent Events (SSE) Stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: string, payload: any) => {
          const data = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
          controller.enqueue(encoder.encode(data));
        };

        try {
          await streamExecutiveBoardMeeting(query, organizationId, (event, payload) => {
            sendEvent(event, payload);
          });
        } catch (err: any) {
          sendEvent('error', { message: err.message || 'Stream processing failed' });
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
