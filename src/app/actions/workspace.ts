'use server'

import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { NOVA_DEMO_DOCUMENTS } from '@/lib/demo-data';

async function authenticate() {
  const cookieStore = await cookies();
  const session = cookieStore.get('synaps-session')?.value;
  if (!session) return null;
  const decodedToken = await verifySessionCookie(session);
  return decodedToken ? prisma.user.findUnique({ where: { id: decodedToken.uid } }) : null;
}

export async function getWorkspaceDocuments() {
  let docs: any[] = [];
  try {
    const user = await authenticate();
    if (user?.organizationId) {
      docs = await prisma.document.findMany({
        where: { organizationId: user.organizationId, isDeleted: false },
        orderBy: { createdAt: 'desc' }
      });
    }
  } catch (e) {
    console.warn('[WORKSPACE] Could not fetch DB documents, using default demo set:', e);
  }

  // Fallback to Nova Industries Enterprise Demo documents if DB docs are empty
  if (!docs || docs.length === 0) {
    docs = NOVA_DEMO_DOCUMENTS.map((d, i) => ({
      id: `nova-demo-doc-${i}`,
      name: d.name,
      createdAt: new Date(Date.now() - (i + 1) * 60 * 1000).toISOString(),
      mimeType: 'application/pdf',
      sizeBytes: 3500
    }));
  }

  return docs;
}
