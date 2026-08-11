import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth-server';
import CinematicSystemLanding from '@/components/landing/CinematicSystemLanding';

export const metadata = {
  title: 'SYNAPS — Enterprise Intelligence Workspace & Evidence Engine',
  description: 'Turns documents, knowledge, evidence and business information into something people can actually understand, search, review and act on.',
};

export default async function RootPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('synaps-session')?.value;

  if (session && !session.startsWith('TEST_TOKEN_')) {
    const decoded = await verifySessionCookie(session);
    if (decoded?.uid) {
      redirect('/dashboard');
    }
  }

  return <CinematicSystemLanding />;
}
