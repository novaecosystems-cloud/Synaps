export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import {
  boardroomStore,
  streamExecutiveBoardMeeting,
} from '@/lib/executive-board';

const SSE_HEADERS = {
  'Content-Type': 'text/event-stream; charset=utf-8',
  'Cache-Control': 'no-cache, no-transform',
  'Connection': 'keep-alive',
  'X-Accel-Buffering': 'no',
};

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
            select: { organizationId: true, role: true },
          });
          if (dbUser) {
            organizationId = dbUser.organizationId || organizationId;
            role = dbUser.role || role;
          }
        } catch (e) {}
      }
    }

    // AI Credit Quota
    try {
      const { checkAndConsumeAiCredits, extractClientIp } = await import(
        '@/lib/ai-credit-limiter'
      );
      const clientIp = extractClientIp(req.headers);
      const creditCheck = await checkAndConsumeAiCredits(
        uid,
        role,
        1,
        'boardroom_streaming',
        clientIp
      );
      if (!creditCheck.success) {
        return new Response(JSON.stringify({ error: creditCheck.error }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch {}

    const body = await req.json().catch(() => ({}));
    const query =
      body.query || 'Evaluate quarterly strategic risks and safe-harbor compliance.';
    const sessionId = body.sessionId || crypto.randomUUID();

    const session = boardroomStore.getOrCreateSession(
      sessionId,
      query,
      organizationId
    );

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        let isClosed = false;

        const sendRaw = (text: string) => {
          if (isClosed) return;
          try {
            controller.enqueue(encoder.encode(text));
          } catch {
            isClosed = true;
          }
        };

        const sendEvent = (event: string, payload: any, eventId?: number) => {
          const idPrefix = eventId !== undefined ? `id: ${eventId}\n` : '';
          sendRaw(`${idPrefix}event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`);
        };

        // Replay any buffered events
        for (const ev of session.eventBuffer) {
          sendEvent(ev.event, ev.payload, ev.id);
        }

        // Subscribe to live events
        const unsubscribe = boardroomStore.subscribe(
          sessionId,
          (event, payload, eventId) => {
            sendEvent(event, payload, eventId);
          }
        );

        // 3000ms Heartbeat keepalive timer
        const heartbeatInterval = setInterval(() => {
          sendRaw(
            `: ping\n\nevent: heartbeat\ndata: ${JSON.stringify({
              timestamp: Date.now(),
            })}\n\n`
          );
        }, 3000);

        // Abort cleanup
        req.signal.addEventListener('abort', () => {
          isClosed = true;
          clearInterval(heartbeatInterval);
          unsubscribe();
          try {
            controller.close();
          } catch {}
        });

        // If session is already complete, close stream immediately after flush
        if (session.status === 'completed' || session.status === 'failed') {
          clearInterval(heartbeatInterval);
          unsubscribe();
          try {
            controller.close();
          } catch {}
          return;
        }

        // Trigger background execution if newly active
        if (session.status === 'active' && session.eventBuffer.length <= 1) {
          streamExecutiveBoardMeeting(query, organizationId, sessionId)
            .catch((err) => {
              boardroomStore.pushEvent(sessionId, 'error', {
                message: err.message || 'Deliberation failed',
              });
            })
            .finally(() => {
              clearInterval(heartbeatInterval);
              unsubscribe();
              setTimeout(() => {
                try {
                  controller.close();
                } catch {}
              }, 500);
            });
        }
      },
    });

    return new Response(stream, { headers: SSE_HEADERS });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('sessionId');
  const lastEventIdStr =
    req.headers.get('last-event-id') ||
    url.searchParams.get('lastEventId') ||
    '0';
  const lastEventId = parseInt(lastEventIdStr, 10) || 0;

  if (!sessionId) {
    return new Response(
      JSON.stringify({ error: 'sessionId parameter is required' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const session = boardroomStore.getSession(sessionId);
  if (!session) {
    return new Response(
      JSON.stringify({ error: 'Session not found or expired' }),
      {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      let isClosed = false;

      const sendRaw = (text: string) => {
        if (isClosed) return;
        try {
          controller.enqueue(encoder.encode(text));
        } catch {
          isClosed = true;
        }
      };

      const sendEvent = (event: string, payload: any, eventId?: number) => {
        const idPrefix = eventId !== undefined ? `id: ${eventId}\n` : '';
        sendRaw(`${idPrefix}event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`);
      };

      // Replay all events since lastEventId
      const unacknowledged = session.eventBuffer.filter((e) => e.id > lastEventId);
      for (const ev of unacknowledged) {
        sendEvent(ev.event, ev.payload, ev.id);
      }

      // If already complete, finish immediately
      if (session.status === 'completed' || session.status === 'failed') {
        try {
          controller.close();
        } catch {}
        return;
      }

      // Otherwise subscribe to live stream
      const unsubscribe = boardroomStore.subscribe(
        sessionId,
        (event, payload, eventId) => {
          sendEvent(event, payload, eventId);
        }
      );

      const heartbeatInterval = setInterval(() => {
        sendRaw(
          `: ping\n\nevent: heartbeat\ndata: ${JSON.stringify({
            timestamp: Date.now(),
          })}\n\n`
        );
      }, 3000);

      req.signal.addEventListener('abort', () => {
        isClosed = true;
        clearInterval(heartbeatInterval);
        unsubscribe();
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, { headers: SSE_HEADERS });
}
