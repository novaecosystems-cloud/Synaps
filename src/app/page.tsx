import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth-server';
import IncrediblesStyleLanding from '@/components/landing/IncrediblesStyleLanding';

export const metadata = {
  title: 'SYNAPS — Creative AI Development Team & 4K Suite | incredibles',
  description: "Two senior AI systems engineers with 15+ years of experience, working seamlessly with enterprise teams and agencies worldwide on high-stakes web projects.",
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
