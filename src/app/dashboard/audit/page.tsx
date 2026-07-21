import React from 'react';
import AuditExplorerClient from './client';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export default async function AuditExplorerPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('synaps-session')?.value;
  if (!session) redirect('/login');
  
  const decoded = await verifySessionCookie(session);
  if (!decoded) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: decoded.uid }
  });
  
  if (!user || !user.organizationId) redirect('/login');

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-6 border-b border-border bg-card">
        <h1 className="text-2xl font-bold font-display flex items-center gap-2">
          Enterprise Audit Logs
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor and export activity across the entire organization.
        </p>
      </div>
      <div className="flex-1 overflow-hidden">
        <AuditExplorerClient organizationId={user.organizationId} />
      </div>
    </div>
  );
}
