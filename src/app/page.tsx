import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth-server';
import HeyParkerStyleLanding from '@/components/landing/HeyParkerStyleLanding';

export const metadata = {
  title: 'SYNAPS — Document Intelligence On Autopilot | Enterprise Evidence Engine',
  description: 'Meet SYNAPS — the AI that thinks like your best enterprise legal strategist and risk operations manager.',
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

  return <HeyParkerStyleLanding />;
}
