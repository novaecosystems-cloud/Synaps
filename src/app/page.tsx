import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth-server';
import IncrediblesStyleLanding from '@/components/landing/IncrediblesStyleLanding';

export const metadata = {
  title: 'CAUSARIX™ (formerly Synaps) — Causal Decision OS & Enterprise Intelligence Suite',
  description: "CAUSARIX transforms complex corporate document libraries and contracts into an interactive 3D Knowledge Graph, 10-Agent Boardroom Quorum, and automated Delaware redlines.",
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

  return <IncrediblesStyleLanding />;
}
