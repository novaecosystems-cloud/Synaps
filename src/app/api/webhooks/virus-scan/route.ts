export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

import { rawPrisma as prisma } from '@/lib/prisma';

// This webhook is designed to be called by a Pub/Sub triggered Cloud Function
// after a file is uploaded to GCS and scanned by an antivirus engine (like ClamAV).
export async function POST(request: Request) {
  try {
    // 1. Authenticate the webhook — fail closed outside development
    const webhookSecret = process.env.WEBHOOK_SECRET;
    const authHeader = request.headers.get('authorization');
    const isDev = process.env.NODE_ENV === 'development';
    if (!isDev && (!webhookSecret || authHeader !== `Bearer ${webhookSecret}`)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (isDev && webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse the payload
    // Expected Payload: { gcsPath: string, status: 'CLEAN' | 'INFECTED' }
    const body = await request.json();
    const { storagePath, status } = body;

    if (!storagePath || !['CLEAN', 'INFECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // 3. Find the DocumentVersion associated with this GCS Path
    const version = await prisma.documentVersion.findFirst({
      where: {
        storagePath: storagePath
      }
    });

    if (!version) {
      return NextResponse.json({ error: 'Document version not found for this path' }, { status: 404 });
    }

    // 4. Update the Scan Status in both DocumentVersion and Document root
    await prisma.$transaction(async (tx) => {
      await tx.documentVersion.update({
        where: { id: version.id },
        data: { scanStatus: status as any }
      });

      // Find if this is the current version, update root document if so
      const doc = await tx.document.findUnique({ where: { id: version.documentId } });
      if (doc && doc.currentVersionId === version.id) {
        await tx.document.update({
          where: { id: doc.id },
          data: { scanStatus: status as any }
        });
      }
    });

    return NextResponse.json({ success: true, message: `Scan status updated to ${status}` });

  } catch (error: any) {
    console.error('Virus scan webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

