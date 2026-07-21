export const dynamic = 'force-dynamic';
import AnalyticsClient from './client';
import { PrismaClient } from '@prisma/client';

import prisma from '@/lib/prisma';

import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/auth-server';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Executive Analytics | Synaps',
  description: 'Executive dashboard and workspace metrics',
};

export default async function AnalyticsPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('synaps-session')?.value;
  if (!session) redirect('/login');
  
  const decoded = await verifySessionCookie(session);
  if (!decoded) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: decoded.uid }
  });
  
  if (!user || !user.organizationId) redirect('/login');

  return <AnalyticsClient organizationId={user.organizationId} />;
}

