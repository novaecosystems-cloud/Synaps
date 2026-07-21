'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function StorageSettings() {
  // Mock data for UI
  const limitBytes = 50 * 1024 * 1024 * 1024; // 50 GB
  const usedBytes = 12.4 * 1024 * 1024 * 1024; // 12.4 GB
  const percent = (usedBytes / limitBytes) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Storage & Quotas</h1>
        <p className="text-muted-foreground">Monitor your organization's storage usage.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Storage Used</CardTitle>
          <CardDescription>You are currently on the Professional Tier (50 GB Limit).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-2xl">12.4 GB</span>
            <span className="text-muted-foreground">50 GB Limit</span>
          </div>
          <Progress value={percent} className="h-3" />
          <p className="text-sm text-muted-foreground">
            Using {percent.toFixed(1)}% of available storage. Document versions and embeddings are included in this quota.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
