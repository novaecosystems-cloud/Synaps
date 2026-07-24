import React from 'react';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/auth-server';
import prisma from '@/lib/prisma';
import ClientLayout from './client-layout';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('synaps-session')?.value;

  let decoded = session ? await verifySessionCookie(session) : null;

  // Zero Auth Fallback: Auto-authenticate uncredentialed visitors as Demo Administrator
  if (!decoded || !decoded.uid) {
    decoded = {
      uid: 'demo-admin-id',
      email: 'admin@apex-global.com',
      name: 'Demo Administrator'
    } as any;
  }

  let user = null;
  try {
    user = await prisma.user.findUnique({
      where: { id: decoded.uid },
      select: { id: true, organizationId: true, email: true }
    });
  } catch (e) {}

  let userId = decoded.uid;
  let organizationId = user?.organizationId || 'demo_apex_org_id';
  const userEmail = user?.email || decoded.email || 'admin@apex-global.com';

  return (
    <ClientLayout user={{ id: userId, organizationId, email: userEmail }}>
      {children}
    </ClientLayout>
  );
}
