export const dynamic = 'force-dynamic';

import React from 'react';
import { Metadata } from 'next';
import IntegrationsClient from './client';

export const metadata: Metadata = {
  title: 'Public APIs & Data Connectors | Synaps',
  description: 'Integrate live public APIs from public-apis/public-apis repository into Synaps AI COO OS.',
};

export default function IntegrationsPage() {
  return <IntegrationsClient />;
}
