export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { logger } from '@/lib/logger';

import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Ping the database to ensure it's healthy
    await prisma.$queryRaw`SELECT 1`;
    const buildVersion = process.env.VERCEL_GIT_COMMIT_SHA || process.env.NEXT_PUBLIC_BUILD_ID || 'v4.2.0-latest';
    return NextResponse.json({ 
      status: 'healthy', 
      version: buildVersion,
      timestamp: new Date().toISOString() 
    });
  } catch (error: any) {
    logger.error({ err: error }, 'Health check failed');
    return NextResponse.json({ status: 'unhealthy', error: 'Database connection failed' }, { status: 503 });
  }
}

