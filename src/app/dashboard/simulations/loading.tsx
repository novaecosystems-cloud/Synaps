import React from 'react';
import { PageHeaderSkeleton, SimulationStudioSkeleton } from '@/components/ui/skeleton';

export default function SimulationsLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <PageHeaderSkeleton />
      <SimulationStudioSkeleton />
    </div>
  );
}
