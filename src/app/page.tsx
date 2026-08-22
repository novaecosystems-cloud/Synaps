import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth-server';
import CausarixEnterpriseLanding from '@/components/landing/CausarixEnterpriseLanding';

export const metadata = {
  title: 'CAUSARIX™ (formerly Synaps) — Causal Decision OS & Enterprise Intelligence Suite',
  description: "CAUSARIX transforms complex corporate document libraries and contracts into an interactive 3D Knowledge Graph, 10-Agent Boardroom Quorum, and automated Delaware redlines.",
};

export default async function RootPage() {
  // Always render the Landing Page first when visiting root URL /
  return <CausarixEnterpriseLanding />;
}
