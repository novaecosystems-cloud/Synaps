import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth-server';
import FrustratedDeveloperStoryLanding from '@/components/landing/FrustratedDeveloperStoryLanding';

export const metadata = {
  title: 'Synaps AI — Enterprise Intelligence Operating System',
  description: 'Unify company data across CRM, Spreadsheets, Emails & Documents into a Grounded 3D Memory Graph.',
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

  // Render Frustrated Developer Story Mode Landing Page with Embedded Recorded Video
  return <FrustratedDeveloperStoryLanding />;
}
