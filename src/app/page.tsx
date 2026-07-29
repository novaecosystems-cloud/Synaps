import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth-server';
import MadeWithGSAPSynapsLanding from '@/components/landing/MadeWithGSAPSynapsLanding';

export const metadata = {
  title: 'Made With SYNAPS — Enterprise Decision Intelligence Operating System Showcase',
  description: 'Explore the high-resolution showcase of SYNAPS: Executive Operational Briefings, Multi-Agent Flight Control, Executive Digital Twins, AI Strategy Studio, and Decision Memory.',
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

  // Render MadeWithGSAP Replica Landing Page with Automatic High-Res Application Slideshow & Cookie Consent
  return <MadeWithGSAPSynapsLanding />;
}
