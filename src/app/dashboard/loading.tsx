import React from 'react';
import { PageHeaderSkeleton, MetricCardSkeleton, DocumentGridSkeleton, TableSkeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-6">
      <PageHeaderSkeleton />
      <MetricCardSkeleton count={4} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DocumentGridSkeleton count={4} />
        </div>
        <div className="lg:col-span-1">
          <TableSkeleton rows={4} cols={3} />
        </div>
      </div>
    </div>
  );
}
