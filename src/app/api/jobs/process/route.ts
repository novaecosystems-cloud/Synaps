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
import pdfParse from 'pdf-parse';
import { performOneShotOcr, augmentScannedPdfIfRequired } from '@/lib/ocr-engine';

const renderPdfPage = async (pageData: any) => {
  const renderOptions = { normalizeWhitespace: false, disableCombineTextItems: false };
  const textContent = await pageData.getTextContent(renderOptions);
  let lastY, text = '';
  for (const item of textContent.items) {
    if (lastY == item.transform[5] || !lastY) text += item.str;
    else text += '\n' + item.str;
    lastY = item.transform[5];
  }
  return `\n\n[[PAGE_${pageData.pageIndex + 1}]]\n\n${text}`;
};

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
        
        try {
          // Attempt 1: Try child process worker (preferred in local dev)
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
        } catch (workerErr) {
          console.warn('[PDF Processor] Worker child process failed (e.g. serverless environment), using in-memory pdf-parse fallback:', workerErr);
          // Fallback: Direct in-memory pdf-parse (reliable in Vercel serverless functions)
          const parsed = await pdfParse(buffer, { pagerender: renderPdfPage });
          extractedText = parsed.text || '';
          pageCount = parsed.numpages || 1;
          metadata = {
            info: JSON.stringify(parsed.info || {}),
            metadata: JSON.stringify(parsed.metadata || {})
          };
        }

        // Auto-Detect & Augment Scanned/Image-Only PDFs via 1-Shot OCR Engine
        if (!extractedText || extractedText.trim().length < 50) {
          const augmented = await augmentScannedPdfIfRequired(buffer, extractedText);
          extractedText = augmented.text;
          metadata.ocrEngine = augmented.engine;
          metadata.isScannedPdf = 'true';
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
      } else if (
        mimeType.startsWith('image/') ||
        mimeType === 'image/png' ||
        mimeType === 'image/jpeg' ||
        mimeType === 'image/webp' ||
        mimeType === 'image/tiff'
      ) {
        // 1-Shot Lightning OCR for uploaded images / scanned contracts
        detectedType = 'IMAGE_OCR';
        pageCount = 1;
        const ocrResult = await performOneShotOcr(buffer, mimeType, { mode: 'contract_redline' });
        extractedText = ocrResult.text;
        metadata = {
          ocrEngine: ocrResult.engine,
          confidence: String(ocrResult.confidence),
          latencyMs: String(ocrResult.latencyMs),
        };
      } else if (
        mimeType.includes('markdown') ||
        mimeType.includes('text/plain') ||
        mimeType.includes('text/csv') ||
        mimeType.includes('application/csv') ||
        mimeType.includes('application/json') ||
        mimeType.includes('text/json') ||
        mimeType.includes('yaml') ||
        mimeType.includes('tab-separated-values') ||
        doc.name.endsWith('.md') ||
        doc.name.endsWith('.markdown') ||
        doc.name.endsWith('.txt') ||
        doc.name.endsWith('.csv') ||
        doc.name.endsWith('.json') ||
        doc.name.endsWith('.yaml') ||
        doc.name.endsWith('.yml') ||
        doc.name.endsWith('.tsv')
      ) {
        // Native Text & Markdown Parsing (.md, .txt, .csv, .json, .yaml)
        const rawContent = buffer.toString('utf-8');
        extractedText = rawContent;
        
        if (doc.name.endsWith('.md') || mimeType.includes('markdown')) {
          detectedType = 'MARKDOWN';
        } else if (doc.name.endsWith('.csv') || mimeType.includes('csv')) {
          detectedType = 'CSV';
        } else if (doc.name.endsWith('.json') || mimeType.includes('json')) {
          detectedType = 'JSON';
        } else if (doc.name.endsWith('.yaml') || doc.name.endsWith('.yml') || mimeType.includes('yaml')) {
          detectedType = 'YAML';
        } else {
          detectedType = 'TXT';
        }

        const lines = rawContent.split('\n').length;
        pageCount = Math.max(1, Math.ceil(lines / 45)); // ~45 lines per standard document page
        metadata = {
          lineCount: String(lines),
          charCount: String(rawContent.length),
          encoding: 'utf-8',
        };
      } else {
        // Fallback for generic text files
        try {
          const rawContent = buffer.toString('utf-8');
          if (rawContent && rawContent.length > 0) {
            extractedText = rawContent;
            detectedType = 'TEXT_FALLBACK';
            pageCount = Math.max(1, Math.ceil(rawContent.split('\n').length / 45));
          } else {
            throw new Error(`Unsupported or empty file type for extraction: ${mimeType}`);
          }
        } catch {
          throw new Error(`Unsupported file type for extraction: ${mimeType}`);
        }
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
          error: 'An internal processing error occurred',
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

