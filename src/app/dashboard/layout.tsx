import React from 'react';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import ClientLayout from './client-layout';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
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
    <ClientLayout user={{ id: user.id, organizationId: user.organizationId }}>
      {children}
    </ClientLayout>
  );
}
