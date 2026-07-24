export const dynamic = 'force-static';

import React from 'react';
import ClientLayout from '../dashboard/client-layout';
import ExecutiveDashboardClient from '../dashboard/ExecutiveDashboardClient';

export default function DemoPage() {
  const demoUser = {
    id: 'demo-user-id',
    organizationId: 'demo-org-id',
    email: 'demo@synaps.ai'
  };

  return (
    <ClientLayout user={demoUser}>
      <ExecutiveDashboardClient userName="Enterprise Executive" />
    </ClientLayout>
  );
}
