export const dynamic = 'force-dynamic';

import React from 'react';
import ClientLayout from '../dashboard/client-layout';
import ExecutiveOverviewPage from '../dashboard/page';

export default function DemoPage() {
  const demoUser = {
    id: 'demo-user-id',
    organizationId: 'demo-org-id',
    email: 'demo@synaps.ai'
  };

  return (
    <ClientLayout user={demoUser}>
      <ExecutiveOverviewPage />
    </ClientLayout>
  );
}
