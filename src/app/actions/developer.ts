'use server'

import { PrismaClient } from '@prisma/client';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';

import prisma from '@/lib/prisma';

async function authenticate() {
  const cookieStore = await cookies();
  const session = cookieStore.get('synaps-session')?.value;
  if (!session) return null;
  const decodedToken = await verifySessionCookie(session);
  return decodedToken ? prisma.user.findUnique({ where: { id: decodedToken.uid } }) : null;
}

export async function getVectorStats() {
  const user = await authenticate();
  if (!user) throw new Error('Unauthorized');

  const totalChunks = await prisma.documentChunk.count();
  
  const embeddedChunksQuery = await prisma.$queryRaw<any[]>`
    SELECT COUNT(*) as count FROM "DocumentChunk" WHERE "organizationId" = ${user.organizationId} AND embedding IS NOT NULL;
  `;
  
  return {
    totalChunks,
    embeddedChunks: Number(embeddedChunksQuery[0]?.count || 0)
  };
}
