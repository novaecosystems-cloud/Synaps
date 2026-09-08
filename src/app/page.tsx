import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth-server';
import CausarixEnterpriseLanding from '@/components/landing/CausarixEnterpriseLanding';

import { getOpenSEOMetadata } from '@/lib/openseo';

export const metadata = getOpenSEOMetadata({
  title: 'CAUSARIX™ — Causal Decision OS & 10-Agent Boardroom',
  description: 'CAUSARIX transforms complex corporate document libraries and contracts into Delaware DGCL § 141 redlines, 10-Agent Boardroom Quorum, and stochastic SCM simulations with 0.00% math drift.',
});

export default async function RootPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}) {
  const resolvedParams = searchParams ? await Promise.resolve(searchParams) : {};
  const isExplicitLanding = resolvedParams?.landing === 'true' || resolvedParams?.preview === 'true';

  if (!isExplicitLanding) {
    const cookieStore = await cookies();
    const session = cookieStore.get('synaps-session')?.value;
    if (session) {
      const decoded = await verifySessionCookie(session);
      if (decoded && decoded.uid) {
        redirect('/dashboard');
      }
    }
  }

  return <CausarixEnterpriseLanding />;
}
