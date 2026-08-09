import React from 'react';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import ClientLayout from './client-layout';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('synaps-session')?.value;

  if (!session) {
    redirect('/login');
  }

  const decoded = await verifySessionCookie(session);
  if (!decoded || !decoded.uid) {
    redirect('/login');
  }

  let user: { id: string; organizationId: string | null; email: string; role?: string } | null = null;
  try {
    user = await prisma.user.findUnique({
      where: { id: decoded.uid },
      select: { id: true, organizationId: true, email: true, role: true }
    });
  } catch (e) {
    console.error('[DASHBOARD LAYOUT] Failed to fetch user from DB:', e);
  }

  let userId = decoded.uid;
  let organizationId = user?.organizationId || 'demo_apex_org_id';
  const userEmail = user?.email || decoded.email || 'admin@apex-global.com';
  const isPremium = user?.role === 'ADMIN' || user?.role === 'OWNER';

  return (
    <ClientLayout user={{ id: userId, organizationId, email: userEmail, isPremium }}>
      {children}
    </ClientLayout>
  );
}
