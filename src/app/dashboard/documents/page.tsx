export const dynamic = 'force-dynamic';
import { getDocuments } from '@/app/actions/document';
import { DocumentsClient } from './client';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/auth-server';
import { redirect } from 'next/navigation';

import prisma from '@/lib/prisma';

export default async function DocumentsPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('synaps-session')?.value;
  if (!session) redirect('/login');
  
  const decoded = await verifySessionCookie(session);
  if (!decoded) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: decoded.uid }
  });

  if (!user) redirect('/login');

  const orgId = user.organizationId || 'default-org';
  const res = await getDocuments(orgId);
  const documents = res.success ? res.documents : [];

  return (
    <DocumentsClient 
      organizationId={orgId} 
      initialDocuments={documents || []} 
    />
  );
}

