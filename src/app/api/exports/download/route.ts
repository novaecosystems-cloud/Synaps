export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Missing ID', { status: 400 });
    }

    const job = await prisma.exportJob.findUnique({
      where: { id }
    });

    if (!job || !job.fileUrl) {
      return new NextResponse('File not found', { status: 404 });
    }

    // Since we are mocking storage, fileUrl currently holds the raw data (JSON/CSV) 
    // or a dummy link. If it's data URI or raw JSON, we can serve it directly.
    const content = job.fileUrl;
    let contentType = 'application/octet-stream';
    const filename = `export_${job.type}_${job.id}.${job.format.toLowerCase()}`;

    if (job.format === 'JSON') {
      contentType = 'application/json';
    } else if (job.format === 'CSV') {
      contentType = 'text/csv';
    } else if (job.format === 'MARKDOWN') {
      contentType = 'text/markdown';
    } else if (job.format === 'PDF') {
      contentType = 'application/pdf';
    } else if (job.format === 'DOCX') {
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }

    // In a real app with Firebase Storage, fileUrl would be a signed URL, 
    // and we could just redirect to it: return NextResponse.redirect(job.fileUrl);
    // For this demonstration, we'll assume fileUrl contains raw string data for text formats
    // and base64 for binary formats.
    
    let buffer: Buffer;
    if (job.fileUrl.startsWith('data:')) {
      const parts = job.fileUrl.split(',');
      buffer = Buffer.from(parts[1], 'base64');
    } else {
      buffer = Buffer.from(job.fileUrl, 'utf-8');
    }

    return new NextResponse(buffer as any, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}

