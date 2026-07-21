'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Key } from 'lucide-react';

export default function ApiKeysSettings() {
  const [keys] = useState([
    { id: '1', name: 'Production Server', createdAt: '2023-10-15' },
    { id: '2', name: 'Development Script', createdAt: '2024-02-10' },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">API Keys</h1>
        <p className="text-muted-foreground">Manage keys for programmatic access to Synaps.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <CardTitle>Active Tokens</CardTitle>
          </div>
          <CardDescription>Keep these tokens secure. Full keys are never displayed after creation.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {keys.map(k => (
              <div key={k.id} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
                <div>
                  <p className="font-medium">{k.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Created on {k.createdAt}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-500/10">Revoke</Button>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="pt-4 border-t border-border/40">
          <Button>Generate New Key</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
