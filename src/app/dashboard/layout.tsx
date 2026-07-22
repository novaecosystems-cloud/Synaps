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

  let user = await prisma.user.findUnique({
    where: { id: decoded.uid }
  });
  
  if (!user || !user.organizationId) {
    console.log(`[AUTH] DashboardLayout auto-creating missing user/org for UID: ${decoded.uid}`);
    const email = decoded.email || `${decoded.uid}@synaps.ai`;
    const name = decoded.name || 'Enterprise Admin';
    const orgName = `${name}'s Organization`;

    const newOrg = await prisma.organization.create({
      data: {
        name: orgName,
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

    user = newOrg.users[0];
  }

  return (
    <ClientLayout user={{ id: user.id, organizationId: user.organizationId }}>
      {children}
    </ClientLayout>
  );
}
