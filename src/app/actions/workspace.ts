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

export async function getWorkspaceDocuments() {
  const user = await authenticate();
  if (!user) throw new Error('Unauthorized');

  return prisma.document.findMany({
    where: { organizationId: user.organizationId, isDeleted: false },
    orderBy: { createdAt: 'desc' }
  });
}
