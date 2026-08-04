export const dynamic = 'force-dynamic';

import React from 'react';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import DocumentReaderClient from './client';

export default async function DocumentReaderPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get('synaps-session')?.value;
  if (!session) redirect('/login');

  const decoded = await verifySessionCookie(session);
  if (!decoded || !decoded.uid) redirect('/login');

  const { id } = await params;
  const sp = await searchParams;

  let dbUser: any = null;
  try {
    dbUser = await prisma.user.findUnique({
      where: { id: decoded.uid },
      select: { organizationId: true }
    });
  } catch (e) {}

  const organizationId = dbUser?.organizationId || 'demo_apex_org_id';

  const [document, allDocs] = await Promise.all([
    prisma.document.findUnique({
      where: { id, organizationId },
      include: { processedDoc: true }
    }),
    prisma.document.findMany({
      where: { organizationId, isDeleted: false },
      select: { id: true, name: true }
    })
  ]);

  if (!document) return notFound();

  return (
    <DocumentReaderClient
      documentId={document.id}
      documentName={document.name}
      detectedType={document.processedDoc?.detectedType || 'Document'}
      pageCount={document.processedDoc?.pageCount || 1}
      allDocs={allDocs}
      initialPage={sp.page ? parseInt(sp.page, 10) : 1}
      initialQuery={sp.q || ''}
    />
  );
}
