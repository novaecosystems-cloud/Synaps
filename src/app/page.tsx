export const dynamic = 'force-static';

import React from 'react';
import ClientLayout from './dashboard/client-layout';
import ExecutiveDashboardClient from './dashboard/ExecutiveDashboardClient';

export const metadata = {
  title: 'Synaps AI — Enterprise Intelligence Operating System',
  description: 'AI Executive Dashboard and Enterprise OS.',
};

export default function RootPage() {
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
