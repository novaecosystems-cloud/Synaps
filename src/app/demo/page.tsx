export const dynamic = 'force-static';

import React from 'react';
import ClientLayout from '../dashboard/client-layout';
import ExecutiveDashboardClient from '../dashboard/ExecutiveDashboardClient';

export const metadata = {
  title: 'Synaps AI — Enterprise Demo Administrator Mode',
  description: 'Interactive zero-login Enterprise Demo Mode for Synaps AI Platform.',
};

export default function DemoPage() {
  const demoUser = {
    id: 'demo-admin-id',
    organizationId: 'demo-apex-org-id',
    email: 'admin@apex-global.com'
  };

  return (
    <ClientLayout user={demoUser}>
      <ExecutiveDashboardClient userName="Demo Administrator" />
    </ClientLayout>
  );
}
