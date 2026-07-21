import React from 'react';
import NotificationsClient from './client';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export default async function NotificationsPage() {
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
        <h1 className="text-2xl font-bold font-display">Notification Center</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your alerts and notification preferences.
        </p>
      </div>
      <div className="flex-1 overflow-hidden">
        <NotificationsClient userId={user.id} organizationId={user.organizationId} />
      </div>
    </div>
  );
}
