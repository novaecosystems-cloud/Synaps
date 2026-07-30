import React from 'react';
import { PageHeaderSkeleton, TimelineSkeleton } from '@/components/ui/skeleton';

export default function TimelineLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <PageHeaderSkeleton />
      <TimelineSkeleton count={6} />
    </div>
  );
}
