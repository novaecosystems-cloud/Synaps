import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth-server';
import CausarixEnterpriseLanding from '@/components/landing/CausarixEnterpriseLanding';

import { getOpenSEOMetadata } from '@/lib/openseo';

export const metadata = getOpenSEOMetadata({
  title: 'CAUSARIX™ — Autonomous Contract Redliner & Fiduciary Risk Auditor',
  description: 'Upload any vendor agreement, SaaS SLA, or NDA. Detect toxic indemnification traps, unilateral liabilities, and get attorney-grade redlines with Delaware DGCL § 141 safe-harbor compliance.',
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
