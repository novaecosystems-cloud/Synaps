import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth-server';
import LandoNorrisSynapsLanding from '@/components/landing/LandoNorrisSynapsLanding';

export const metadata = {
  title: 'Synaps AI — Enterprise Decision Intelligence Operating System',
  description: 'Unify company data across CRM, Spreadsheets, Emails & Documents into a Grounded 3D Memory Graph and Executive Digital Twins.',
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

  // Render Ultra-Sleek Lando Norris-Inspired Landing Page with 45° Interactive Tilted Document
  return <LandoNorrisSynapsLanding />;
}
