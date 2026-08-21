export const dynamic = 'force-dynamic';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/auth-server';
import RequirementsClient from './client';
import prisma from '@/lib/prisma';
import { ActiveKnowledgeSelector } from '@/components/ActiveKnowledgeSelector';

export default async function RequirementsPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('synaps-session')?.value;
  let organizationId = 'no_org_fallback';

  if (session) {
    const decoded = await verifySessionCookie(session);
    if (decoded?.uid) {
      const user = await prisma.user.findUnique({
        where: { id: decoded.uid },
        select: { organizationId: true }
      });
      if (user?.organizationId) {
        organizationId = user.organizationId;
      }
    }
  }

  const documents = await prisma.document.findMany({
    where: { isDeleted: false, organizationId },
    select: { id: true, name: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto w-full">
      <div className="mb-8 print:hidden">
        <h1 className="text-3xl font-display font-bold tracking-tight mb-2">Requirement Explorer</h1>
        <p className="text-muted-foreground">Automatically extract and analyze requirements from your RFPs.</p>
      </div>
      <ActiveKnowledgeSelector />
      <RequirementsClient documents={documents} />
    </div>
  );
}


