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

  let user = await prisma.user.findUnique({
    where: { id: decoded.uid },
    select: { id: true, organizationId: true, email: true }
  });

  let userId = decoded.uid;
  let organizationId = user?.organizationId || 'demo_org_synaps';

  if (!user || !user.organizationId) {
    try {
      const email = decoded.email || `${decoded.uid}@synaps.ai`;
      const name = decoded.name || 'Enterprise User';
      const newOrg = await prisma.organization.create({
        data: {
          name: `${name}'s Organization`,
          users: {
            create: {
              id: decoded.uid,
              email: email,
              name: name,
              avatarUrl: decoded.picture || null,
              role: 'OWNER'
            }
          }
        },
        include: { users: true }
      });
      organizationId = newOrg.id;
    } catch (createErr) {
      console.warn('[AUTH] Could not sync user to Prisma DB, using session org:', createErr);
    }
  }

  const userEmail = user?.email || decoded.email || '';

  return (
    <ClientLayout user={{ id: userId, organizationId, email: userEmail }}>
      {children}
    </ClientLayout>
  );
}
