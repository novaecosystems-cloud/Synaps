import React from 'react';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/auth-server';
import prisma from '@/lib/prisma';
import ClientLayout from './client-layout';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let userId = 'demo_user_synaps';
  let organizationId = 'demo_org_synaps';

  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('synaps-session')?.value;

    if (session) {
      const decoded = await verifySessionCookie(session);
      if (decoded && decoded.uid) {
        userId = decoded.uid;

        const user = await prisma.user.findUnique({
          where: { id: decoded.uid },
          select: { id: true, organizationId: true }
        });

        if (user && user.organizationId) {
          organizationId = user.organizationId;
        } else {
          // Auto-create user & organization in DB
          try {
            const email = decoded.email || `${decoded.uid}@synaps.ai`;
            const name = decoded.name || 'Enterprise Admin';
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
            console.warn('[AUTH] Could not insert user to Prisma, using default org:', createErr);
          }
        }
      }
    }
  } catch (err) {
    console.warn('[AUTH] DashboardLayout session error, providing fallback admin session:', err);
  }

  return (
    <ClientLayout user={{ id: userId, organizationId }}>
      {children}
    </ClientLayout>
  );
}
