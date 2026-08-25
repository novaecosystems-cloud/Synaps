export const dynamic = 'force-dynamic';

import React from 'react';
import { Metadata } from 'next';
import IntegrationsClient from './client';

export const metadata: Metadata = {
  title: 'Enterprise Connectors Suite | Causarix Synaps',
  description: 'Bi-directional Enterprise Connectors Hub: Google Drive, Oracle/Cloudbeds PMS, WhatsApp Business, and Jira Cloud integrations for Causarix AI COO.',
};

export default function IntegrationsPage() {
  return <IntegrationsClient />;
}
