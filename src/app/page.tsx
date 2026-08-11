import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth-server';
import FramerSynapsLanding from '@/components/landing/FramerSynapsLanding';

export const metadata = {
  title: 'SYNAPS — Enterprise Intelligence Layer',
  description: "SYNAPS turns your company's scattered information into usable intelligence. Evidence-grounded answers, risk detection, and organizational memory.",
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

  return <FramerSynapsLanding />;
}
