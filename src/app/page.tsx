import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth-server';
import AnthropicStyleSynapsLanding from '@/components/landing/AnthropicStyleSynapsLanding';

export const metadata = {
  title: "Synaps AI — Enterprise Intelligence Layer & Evidence Engine",
  description: "Synaps AI transforms complex document libraries into an interactive 3D Knowledge Graph and a 10-Agent AI Boardroom.",
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

  return <AnthropicStyleSynapsLanding />;
}
