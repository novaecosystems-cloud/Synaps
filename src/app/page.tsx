import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth-server';
import ModernLanding from '@/components/landing/ModernLanding';

export const metadata = {
  title: 'Synaps AI — Enterprise Intelligence Operating System',
  description: 'AI Executive Dashboard, Grounded RAG, Digital Twin Risk Simulation & Multi-Agent Intelligence.',
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

  // Render original high-converting Synaps Landing Page
  return <ModernLanding />;
}
