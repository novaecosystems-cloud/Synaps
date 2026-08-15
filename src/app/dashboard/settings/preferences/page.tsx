'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Zap, Sparkles, Check, Clock, Brain } from 'lucide-react';

export default function PreferencesSettings() {
  const [focusMode, setFocusMode] = useState(true);
  const [antiSlop, setAntiSlop] = useState(true);
  const [timeEstimates, setTimeEstimates] = useState(true);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Preferences & Focus Settings</h1>
        <p className="text-muted-foreground">Customize your personal executive workspace and AI communication style.</p>
      </div>

      {/* Executive Focus & Action-First Framework */}
      <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 via-base-100 to-base-100">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Executive High-Velocity & Focus Mode</CardTitle>
              <CardDescription>
                Inspired by the ADHD & Executive Action-First Framework. Shapes all AI outputs for instant decision-making.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-bold flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-indigo-400" /> Action-First Framing
              </Label>
              <p className="text-xs text-muted-foreground">
                Forces AI to lead with the next actionable command or decision first. Never buries the answer behind narrative context.
              </p>
            </div>
            <Switch checked={focusMode} onCheckedChange={setFocusMode} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Automated Anti-Slop & Fluff Elimination
              </Label>
              <p className="text-xs text-muted-foreground">
                Bans 30+ generic AI buzzwords ("delve", "tapestry", "beacon") and cuts throat-clearing openings.
              </p>
            </div>
            <Switch checked={antiSlop} onCheckedChange={setAntiSlop} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" /> Micro-Time Bounds
              </Label>
              <p className="text-xs text-muted-foreground">
                Displays exact execution duration tags (e.g., "[Takes ~45 sec]") on all recommended tasks and approvals.
              </p>
            </div>
            <Switch checked={timeEstimates} onCheckedChange={setTimeEstimates} />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Choose what alerts you receive in your inbox.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Project Approvals</Label>
              <p className="text-sm text-muted-foreground">Receive an email when a proposal needs your review.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Document Processing</Label>
              <p className="text-sm text-muted-foreground">Receive an email when AI finishes extracting a large document.</p>
            </div>
            <Switch defaultChecked={false} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly Digest</Label>
              <p className="text-sm text-muted-foreground">A weekly summary of your organization's activity.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
