import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth-server';
import ContraLabsStyleSynapsLanding from '@/components/landing/ContraLabsStyleSynapsLanding';

export const metadata = {
  title: 'SYNAPS LABS — Enterprise Memory OS & 3D Knowledge Graph',
  description: "The frontier enterprise data and intelligence OS. 100% grounded decision-making, interactive 3D Knowledge Graph, and autonomous AI Boardroom.",
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

  return <ContraLabsStyleSynapsLanding />;
}
