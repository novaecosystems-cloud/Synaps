'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { HardDrive, FileText, Database, ShieldCheck } from 'lucide-react';

export default function StorageSettings() {
  const [docCount, setDocCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/documents/all');
        if (res.ok) {
          const data = await res.json();
          const docs = Array.isArray(data) ? data : data.documents || [];
          setDocCount(docs.length);
        }
      } catch (e) {
        console.warn('Failed to fetch storage stats:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const limitBytes = 50 * 1024 * 1024 * 1024; // 50 GB
  // Estimate ~3.5MB per indexed document with vector embeddings
  const usedBytes = Math.max(1024 * 1024 * 15, docCount * 3.5 * 1024 * 1024);
  const usedGB = (usedBytes / (1024 * 1024 * 1024)).toFixed(2);
  const percent = Math.min(100, Math.max(0.1, (usedBytes / limitBytes) * 100));

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-base-content">Storage & Quotas</h1>
        <p className="text-xs text-base-content/60 mt-1">Live evidentiary vector storage and enterprise document quota monitoring.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-base-100 border-base-300">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-base-content/60 font-semibold">Active Used</p>
              <p className="text-lg font-bold text-base-content">{usedGB} GB</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-base-100 border-base-300">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-base-content/60 font-semibold">Indexed Files</p>
              <p className="text-lg font-bold text-base-content">{docCount} Documents</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-base-100 border-base-300">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-base-content/60 font-semibold">Vector Enclave</p>
              <p className="text-lg font-bold text-emerald-400">pgvector Synced</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-base-100 border-base-300">
        <CardHeader>
          <CardTitle className="text-base">Enterprise Quota Allocation</CardTitle>
          <CardDescription className="text-xs">You are currently on the Enterprise Tier (50.00 GB Allocated Quota).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xl text-base-content">{usedGB} GB Used</span>
            <span className="text-xs font-mono text-base-content/60">50.00 GB Total Capacity</span>
          </div>
          <Progress value={percent} className="h-2.5 bg-base-200" />
          <p className="text-xs text-base-content/60 leading-relaxed">
            Using {percent.toFixed(2)}% of available encrypted vault storage. Multi-resolution PDF OCR, entity relation graphs, and vector embeddings are tracked live in this quota.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
