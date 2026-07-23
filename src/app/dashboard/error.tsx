'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard Error:', error);
  }, [error]);

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center space-y-6 px-4 font-sans">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-500/10 border border-purple-500/20 ring-8 ring-purple-500/5">
        <ShieldAlert className="h-10 w-10 text-purple-500" />
      </div>
      <div className="text-center space-y-2 max-w-md">
        <h2 className="text-2xl font-bold tracking-tight text-base-content">Refreshing Session Data...</h2>
        <p className="text-xs text-base-content/60 leading-relaxed font-medium">
          Synaps is auto-synchronizing your organization workspace and secure connection.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={() => window.location.href = '/dashboard'} variant="outline" className="rounded-2xl gap-2 text-xs">
          <Home className="w-4 h-4 text-purple-500" /> Return to Dashboard
        </Button>
        <Button onClick={() => reset()} className="rounded-2xl gap-2 text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold">
          <RefreshCw className="w-4 h-4" /> Try again
        </Button>
      </div>
    </div>
  );
}
