import React from 'react';
import { PageHeaderSkeleton, GraphSkeleton } from '@/components/ui/skeleton';

export default function GraphLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <PageHeaderSkeleton />
      <GraphSkeleton />
    </div>
  );
}
