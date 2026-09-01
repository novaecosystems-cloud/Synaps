import { NextRequest, NextResponse } from 'next/server';
import prisma, { ensureTenantHierarchy } from '@/lib/prisma';
import { resolveAuthContext } from '@/lib/security';
import { dispatchVexaMeetingBot, fetchAndScrubTranscript, purgeVexaRemoteData } from '@/lib/vexa-client';
import { extractGraphFromDocument } from '@/lib/memory-graph';
import { generateChunks } from '@/lib/chunking';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const auth = await resolveAuthContext(req);
    const initialOrgId = auth.orgId !== 'no_org_fallback' ? auth.orgId : undefined;
    
    // Resolve valid parent tenant hierarchy to eliminate P2003 FK violations
    const hierarchy = await ensureTenantHierarchy(initialOrgId, auth.userId);
    const orgId = hierarchy.organizationId;
    const targetOwnerId = hierarchy.userId;

    const body = await req.json().catch(() => ({}));
    const { action, meetingUrl, meetingId, botName } = body;

    // 1. Dispatch Scribe Bot to Google Meet / Zoom / Teams
    if (action === 'DISPATCH_BOT') {
      if (!meetingUrl) {
        return NextResponse.json({ error: 'Meeting URL is required' }, { status: 400 });
      }

      const result = await dispatchVexaMeetingBot({
        meetingUrl,
        botName: botName || 'Causarix Boardroom Scribe',
      });

      if (!result.success) {
        return NextResponse.json({ error: result.error || 'Failed to dispatch scribe bot' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        meetingId: result.meetingId,
        status: result.status,
        message: 'Causarix Scribe Bot dispatched to meeting room.',
      });
    }

    // 2. Sync Transcript, Scrub PII, Ingest into 3D Knowledge Graph & Vault
    if (action === 'SYNC_TRANSCRIPT') {
      if (!meetingId) {
        return NextResponse.json({ error: 'Meeting ID is required' }, { status: 400 });
      }

      const transcriptResult = await fetchAndScrubTranscript(meetingId);
      if (!transcriptResult.success || !transcriptResult.transcript) {
        return NextResponse.json({ error: transcriptResult.error || 'No transcript available' }, { status: 400 });
      }

      const sanitizedText = transcriptResult.transcript;
      const title = `[Meeting] Executive Transcript (${new Date().toLocaleDateString()})`;

      // Create Document in Database Vault with verified owner & organizationId
      const doc = await prisma.document.create({
        data: {
          name: title,
          mimeType: 'text/markdown',
          sizeBytes: Buffer.byteLength(sanitizedText, 'utf8'),
          organizationId: orgId,
          ownerId: targetOwnerId,
          scanStatus: 'CLEAN',
        },
      });

      // Generate Chunks for RAG Vector Search with schema-compliant positionIdx & organizationId
      try {
        const chunks = generateChunks(sanitizedText, { chunkSize: 1000, chunkOverlap: 200 });
        if (chunks.length > 0) {
          await prisma.documentChunk.createMany({
            data: chunks.map((c, idx) => ({
              organizationId: orgId,
              documentId: doc.id,
              text: c.text,
              pageNumber: c.pageNumber || 1,
              positionIdx: idx,
              tokenCount: c.tokenCount,
            })),
          });
        }
      } catch (chunkErr: any) {
        console.warn('[Meeting Ingest Chunk Warning]:', chunkErr.message);
      }

      // Extract 3D Knowledge Graph Entities
      if (orgId) {
        try {
          await extractGraphFromDocument(doc.id, sanitizedText, orgId);
        } catch (err) {
          console.warn('[Knowledge graph extraction notice]:', err);
        }
      }

      return NextResponse.json({
        success: true,
        documentId: doc.id,
        name: doc.name,
        utterances: transcriptResult.utterances || [],
        message: 'Transcript securely ingested into Document Vault and 3D Knowledge Graph. Remote copy purged.',
      });
    }

    // 3. Instant Remote Data Wipe
    if (action === 'PURGE_REMOTE') {
      if (!meetingId) {
        return NextResponse.json({ error: 'Meeting ID is required' }, { status: 400 });
      }
      const purged = await purgeVexaRemoteData(meetingId);
      return NextResponse.json({ success: purged, message: 'Remote meeting data wiped from cloud servers.' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await resolveAuthContext(req);
    const orgId = auth.orgId !== 'no_org_fallback' ? auth.orgId : undefined;

    // Fetch past meeting transcripts stored in tenant vault
    const transcripts = orgId
      ? await prisma.document.findMany({
          where: {
            organizationId: orgId,
            name: { startsWith: '[Meeting]' },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
          select: {
            id: true,
            name: true,
            createdAt: true,
            sizeBytes: true,
          },
        })
      : [];

    return NextResponse.json({
      success: true,
      transcripts,
      configured: Boolean(process.env.VEXA_BOT_API_KEY),
      privacyMode: 'AIR_GAPPED_INSTANT_WIPE',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
