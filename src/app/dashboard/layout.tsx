import React from 'react';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import ClientLayout from './client-layout';
import { OrgProfileProvider } from '@/context/OrgProfileContext';

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

  let user: {
    id: string;
    organizationId: string | null;
    email: string;
    role?: string;
    organization?: { settings?: any; name?: string } | null;
  } | null = null;

  try {
    user = await prisma.user.findUnique({
      where: { id: decoded.uid },
      select: {
        id: true,
        organizationId: true,
        email: true,
        role: true,
        organization: { select: { settings: true, name: true } },
      },
    });
  } catch (e) {
    console.error('[DASHBOARD LAYOUT] Failed to fetch user from DB:', e);
  }

  const userId = decoded.uid;
  const organizationId = user?.organizationId || null;
  const userEmail = user?.email || decoded.email || 'user@causarix.ai';
  const isSuperAdmin = userEmail.toLowerCase() === 'novaecosystems@gmail.com';
  const isPremium = isSuperAdmin || user?.role === 'ADMIN' || user?.role === 'OWNER';

  // ── ONBOARDING GUARD ─────────────────────────────────────────────────────
  // If the user has an org but hasn't completed onboarding, send them to /onboarding
  if (organizationId && user?.organization) {
    const settings = (user.organization.settings as Record<string, unknown>) ?? {};
    const onboardingCompleted = settings.onboardingCompleted === true;
    if (!onboardingCompleted) {
      redirect('/onboarding');
    }
  }
  // If the user has no org at all, still allow access (they can create one from settings)

  return (
    <OrgProfileProvider>
      <ClientLayout user={{ id: userId, organizationId: organizationId || 'none', email: userEmail, isPremium }}>
        {children}
      </ClientLayout>
    </OrgProfileProvider>
  );
}
