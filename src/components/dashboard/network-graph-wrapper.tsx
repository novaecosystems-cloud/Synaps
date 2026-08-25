'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { IsolatedErrorBoundary } from '@/components/ui/error-boundary';

const NetworkGraph = dynamic(() => import('./network-graph').then(m => m.NetworkGraph), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#050508]">
      <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
    </div>
  )
});

export function GraphWrapper({ data }: { data: any }) {
  return (
    <IsolatedErrorBoundary
      name="3D Force Graph Canvas"
      fallbackTitle="WebGL Graph Isolated"
      fallbackDescription="The 3D WebGL renderer encountered an error. Click retry to re-initialize."
      resetKeys={[data]}
    >
      <NetworkGraph data={data} />
    </IsolatedErrorBoundary>
  );
}
