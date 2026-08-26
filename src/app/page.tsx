import React from 'react';
import CausarixEnterpriseLanding from '@/components/landing/CausarixEnterpriseLanding';

import { getOpenSEOMetadata } from '@/lib/openseo';

export const metadata = getOpenSEOMetadata({
  title: 'CAUSARIX™ — Causal Decision OS & 10-Agent Boardroom',
  description: 'CAUSARIX transforms complex corporate document libraries and contracts into Delaware DGCL § 141 redlines, 10-Agent Boardroom Quorum, and stochastic SCM simulations with 0.00% math drift.',
});

export default async function RootPage() {
  // Always render the Landing Page first when visiting root URL /
  return <CausarixEnterpriseLanding />;
}
