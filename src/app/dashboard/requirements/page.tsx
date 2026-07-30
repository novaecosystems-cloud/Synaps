export const dynamic = 'force-dynamic';
import { PrismaClient } from '@prisma/client';
import RequirementsClient from './client';

import prisma from '@/lib/prisma';

import { ActiveKnowledgeSelector } from '@/components/ActiveKnowledgeSelector';

export default async function RequirementsPage() {
  const documents = await prisma.document.findMany({
    where: { isDeleted: false },
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

