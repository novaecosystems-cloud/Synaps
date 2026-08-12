import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth-server';
import TrionnStyleLanding from '@/components/landing/TrionnStyleLanding';

export const metadata = {
  title: 'SYNAPS — Trionn-Grade Enterprise Intelligence Engine & 4K Suite',
  description: "SYNAPS synthesizes enterprise documents, contract liabilities, boardroom decision simulations, and organizational memory into verifiable 4K intelligence.",
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

  return <TrionnStyleLanding />;
}
