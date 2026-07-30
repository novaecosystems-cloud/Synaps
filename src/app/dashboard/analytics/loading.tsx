import React from 'react';
import { PageHeaderSkeleton, MetricCardSkeleton, GraphSkeleton } from '@/components/ui/skeleton';

export default function AnalyticsLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <PageHeaderSkeleton />
      <MetricCardSkeleton count={4} />
      <GraphSkeleton />
    </div>
  );
}
