export const dynamic = 'force-dynamic';

import React from 'react';
import MissionControlClient from './client';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function MissionControlPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('synaps-session')?.value;
  if (!sessionCookie) redirect('/login');

  const decoded = await verifySessionCookie(sessionCookie);
  if (!decoded || !decoded.uid) redirect('/login');

  return <MissionControlClient />;
}
