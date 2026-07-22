export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateDownloadUrl } from '@/lib/storage';
import officeParser from 'officeparser';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { generateChunks } from '@/lib/chunking';

import { verifySessionCookie } from '@/lib/auth-server';
import { rawPrisma as prisma } from '@/lib/prisma';
import { extractGraphFromDocument } from '@/lib/memory-graph';

export async function GET(request: NextRequest) {
  // 1. Authenticate Request — allow CRON_SECRET or user session
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get('authorization');
  const sessionCookie = request.cookies.get('synaps-session')?.value;
  const isDev = process.env.NODE_ENV === 'development';
  
  const hasCronAuth = cronSecret && authHeader === `Bearer ${cronSecret}`;
  const hasUserAuth = !!sessionCookie;
  
  if (!isDev && !hasCronAuth && !hasUserAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Fetch an available job (PENDING or FAILED < 3 attempts)
    const { searchParams } = new URL(request.url);
    const forceDocumentId = searchParams.get('documentId');

    let job;

    let userOrgId: string | null = null;
    if (hasUserAuth && sessionCookie) {
      try {
        const decoded = await verifySessionCookie(sessionCookie);
        if (decoded) {
          const user = await prisma.user.findUnique({ where: { id: decoded.uid }, select: { organizationId: true } });
          userOrgId = user?.organizationId || null;
        }
      } catch (e) {}
    }

    if (forceDocumentId) {
      job = await prisma.processingJob.findFirst({
        where: { documentId: forceDocumentId },
        include: {
          document: {
            include: { versions: { orderBy: { versionNum: 'desc' }, take: 1 } }
          }
        }
      });
      
      if (job && !hasCronAuth) {
        if (!userOrgId || job.document.organizationId !== userOrgId) {
          return NextResponse.json({ error: 'Unauthorized: Tenant isolation violation' }, { status: 403 });
        }
      }

      // Reset status to pending so it can be re-run
      if (job) {
        await prisma.processingJob.update({
          where: { id: job.id },
          data: { status: 'PENDING', progress: 0, error: null }
        });
      }
    } else {
      job = await prisma.processingJob.findFirst({
        where: {
          OR: [
            { status: 'PENDING' },
            { status: 'FAILED', attempts: { lt: 3 } }
          ]
        },
        include: {
          document: {
            include: { versions: { orderBy: { versionNum: 'desc' }, take: 1 } }
          }
        },
        orderBy: { createdAt: 'asc' }
      });
    }

    if (!job) {
      return NextResponse.json({ message: 'No jobs available' }, { status: 200 });
    }

    // 3. Lock the job
    await prisma.processingJob.update({
      where: { id: job.id },
      data: {
        status: 'PROCESSING',
        attempts: { increment: 1 },
        startedAt: new Date(),
        progress: 10
      }
    });

    try {
      const doc = job.document;
      if (!doc || doc.versions.length === 0) throw new Error("Document or version not found");

      const latestVersion = doc.versions[0];
      const mimeType = latestVersion.mimeType;

      // Update progress
      await updateProgress(job.id, 20);

      // 4. Read or Download file
      let buffer: Buffer;
      if (fs.existsSync(latestVersion.storagePath)) {
        buffer = fs.readFileSync(latestVersion.storagePath);
      } else {
        const downloadUrl = await generateDownloadUrl(latestVersion.storagePath);
        const fileRes = await fetch(downloadUrl);
        if (!fileRes.ok) throw new Error("Failed to download file from storage");
        const arrayBuffer = await fileRes.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
      }

      // Update progress
      await updateProgress(job.id, 50);

      // 5. Extract Text & Metadata
      let extractedText = '';
      let pageCount = 0;
      let detectedType = 'Unknown';
      let metadata: Record<string, string> = {};

      if (mimeType === 'application/pdf') {
        detectedType = 'PDF';
        
        const tmpPath = path.join(os.tmpdir(), `pdf-${job.id}-${Date.now()}.pdf`);
        fs.writeFileSync(tmpPath, buffer);
        try {
          const workerPath = path.join(process.cwd(), 'src', 'lib', 'pdfWorker.js');
          const output = execSync(`node "${workerPath}" "${tmpPath}"`, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
          const pdfData = JSON.parse(output);
          
          extractedText = pdfData.text;
          pageCount = pdfData.numpages;
          metadata = {
            info: JSON.stringify(pdfData.info || {}),
            metadata: JSON.stringify(pdfData.metadata || {})
          };
        } finally {
          if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
        }
      } else if (
        mimeType.includes('wordprocessingml') || 
        mimeType.includes('spreadsheetml') || 
        mimeType.includes('presentationml')
      ) {
        // Use officeparser for DOCX, XLSX, PPTX
        let ext = '';
        if (mimeType.includes('wordprocessingml')) { detectedType = 'DOCX'; ext = '.docx'; }
        else if (mimeType.includes('spreadsheetml')) { detectedType = 'XLSX'; ext = '.xlsx'; }
        else if (mimeType.includes('presentationml')) { detectedType = 'PPTX'; ext = '.pptx'; }

        const tmpPath = path.join(os.tmpdir(), `doc-${job.id}-${Date.now()}${ext}`);
        fs.writeFileSync(tmpPath, buffer);
        try {
          const parsedDoc = await officeParser.parseOffice(tmpPath);
          extractedText = parsedDoc && parsedDoc.toText ? parsedDoc.toText() : '';
          pageCount = 1; // officeparser doesn't do page counts
        } finally {
          if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
        }
      } else {
        throw new Error(`Unsupported file type for extraction: ${mimeType}`);
      }

      await updateProgress(job.id, 90);

      // 6. Save results
      await prisma.$transaction(async (tx) => {
        // Create or update ProcessedDocument
        await tx.processedDocument.upsert({
          where: { documentId: doc.id },
          update: {
            textContent: extractedText,
            pageCount,
            detectedType
          },
          create: {
            documentId: doc.id,
            organizationId: doc.organizationId,
            textContent: extractedText,
            pageCount,
            detectedType
          } as any
        });

        // Save metadata keys
        for (const [key, value] of Object.entries(metadata)) {
          await tx.documentMetadata.upsert({
            where: { documentId_key: { documentId: doc.id, key } },
            update: { value: String(value) },
            create: { documentId: doc.id, organizationId: doc.organizationId, key, value: String(value) } as any
          });
        }

        // Generate and save chunks
        const chunks = generateChunks(extractedText);
        
        await tx.documentChunk.deleteMany({
          where: { documentId: doc.id }
        });
        
        if (chunks.length > 0) {
          await tx.documentChunk.createMany({
            data: chunks.map(c => ({
              documentId: doc.id,
              organizationId: doc.organizationId,
              text: c.text,
              pageNumber: c.pageNumber,
              section: c.section,
              tokenCount: c.tokenCount
            })) as any
          });
        }

        // Mark Job Complete
        await tx.processingJob.update({
          where: { id: job.id },
          data: {
            status: 'COMPLETED',
            progress: 100,
            completedAt: new Date()
          }
        });
      });

      // Extract Memory Graph Entities and Relationships (Async/Non-blocking error handling)
      if (doc.organizationId && extractedText.length > 50) {
        try {
          await extractGraphFromDocument(doc.id, extractedText, doc.organizationId);
        } catch (graphErr) {
          console.warn("Memory graph extraction non-fatal warning:", graphErr);
        }
      }

      return NextResponse.json({ success: true, message: `Processed job ${job.id}` }, { status: 200 });

    } catch (processError: any) {
      // Mark as Failed
      await prisma.processingJob.update({
        where: { id: job.id },
        data: {
          status: 'FAILED',
          error: processError.message || 'Unknown error',
          completedAt: new Date()
        }
      });
      return NextResponse.json({ success: false, error: processError.message }, { status: 500 });
    }
    
  } catch (err: any) {
    console.error('Job Queue Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function updateProgress(jobId: string, progress: number) {
  await prisma.processingJob.update({
    where: { id: jobId },
    data: { progress }
  });
}

