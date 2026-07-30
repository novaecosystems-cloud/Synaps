import React from 'react';
import { PageHeaderSkeleton, MetricCardSkeleton, TableSkeleton } from '@/components/ui/skeleton';

export default function RiskCenterLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <PageHeaderSkeleton />
      <MetricCardSkeleton count={4} />
      <TableSkeleton rows={5} cols={5} />
    </div>
  );
}
