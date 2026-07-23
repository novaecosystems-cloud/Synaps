export const dynamic = 'force-dynamic';

import React from 'react';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import ExecutiveDashboardClient from './ExecutiveDashboardClient';

export const metadata: Metadata = {
  title: 'AI Executive Dashboard | Synaps',
  description: 'AI COO operational dashboard and executive intelligence.',
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('synaps-session')?.value;
  if (!session) redirect('/login');
  
  const decoded = await verifySessionCookie(session);
  if (!decoded || !decoded.uid) redirect('/login');

  let userName = decoded.name || decoded.email?.split('@')[0] || 'Executive';

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.uid },
      select: { name: true }
    });
    if (currentUser?.name) {
      userName = currentUser.name;
    }
  } catch (err) {
    console.warn('[DASHBOARD] Could not fetch user from DB:', err);
  }

  return <ExecutiveDashboardClient userName={userName} />;
}
