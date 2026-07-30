import React from 'react';
import { PageHeaderSkeleton, MetricCardSkeleton, BoardroomSkeleton } from '@/components/ui/skeleton';

export default function ChiefOfStaffLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <PageHeaderSkeleton />
      <MetricCardSkeleton count={3} />
      <BoardroomSkeleton />
    </div>
  );
}
