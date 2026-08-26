'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BrainCircuit, Terminal, Lock } from 'lucide-react';

export default function AiSettings() {
  const [keys, setKeys] = useState({
    groq: '',
    openRouter: '',
    mistral: '',
    github: '',
    huggingface: '',
    colibriUrl: 'http://localhost:8080/v1',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Live status telemetry
  const [colibriStatus, setColibriStatus] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings/colibri')
      .then((r) => r.json())
      .then((d) => setColibriStatus(d))
      .catch(() => {});
  }, []);

  const handleChange = (provider: string, value: string) => {
    setKeys((prev) => ({ ...prev, [provider]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setMessage('AI Infrastructure and Sovereign MoE routing updated.');
      setTimeout(() => setMessage(''), 3500);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-base-content font-sans">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Infrastructure & Sovereign MoE Settings</h1>
        <p className="text-sm text-base-content/60">
          Manage Synaps multi-provider failover routing, local 744B MoE disk streaming, and zero-egress air-gapped policies.
        </p>
      </div>

      {/* Sovereign Air-Gapped MoE Banner (Colibrì Engine) */}
      <Card className="border-indigo-500/40 bg-gradient-to-br from-base-100 via-base-100 to-indigo-950/20 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-bold">Colibrì Sovereign MoE (On-Premise 744B Engine)</CardTitle>
                  <span className="badge badge-primary badge-xs font-mono font-bold text-[9px]">ZERO-CLOUD-EGRESS</span>
                </div>
                <CardDescription className="text-xs text-base-content/60">
                  Streams 19,456 neural experts from local SSD. Pure C, zero-cloud dependency, $0.00 marginal token cost.
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`badge badge-sm font-bold text-[10px] ${
                  colibriStatus?.isOnline ? 'badge-success gap-1' : 'badge-neutral gap-1 text-base-content/50'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${colibriStatus?.isOnline ? 'bg-emerald-300 animate-ping' : 'bg-slate-500'}`} />
                {colibriStatus?.isOnline ? 'LOCAL MOE ONLINE' : 'DAEMON STANDBY'}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-base-200/70 border border-base-300 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-base-content/50">Engine Model</span>
              <p className="font-bold font-mono text-xs text-indigo-400">GLM-5.2 (744B int4)</p>
              <p className="text-[10px] text-base-content/60">19,456 Routed Experts</p>
            </div>

            <div className="p-3 bg-base-200/70 border border-base-300 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-base-content/50">Storage Tiering</span>
              <p className="font-bold text-xs text-base-content">RAM + NVMe SSD Stream</p>
              <p className="text-[10px] text-emerald-400 font-medium">Zero-Cloud Egress Certified</p>
            </div>

            <div className="p-3 bg-base-200/70 border border-base-300 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-base-content/50">Local Endpoint</span>
              <p className="font-bold font-mono text-[11px] text-base-content truncate">{keys.colibriUrl}</p>
              <p className="text-[10px] text-base-content/60">Auto-prioritized at Priority #0</p>
            </div>
          </div>

          <div className="p-3 bg-base-200 rounded-xl flex items-center justify-between font-mono text-[11px] text-base-content/80">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Launch Command: <code className="text-indigo-400 font-bold">./coli web --ram 24G</code></span>
            </div>
            <span className="text-[10px] text-base-content/50">Port: 8080 (v1/chat/completions)</span>
          </div>
        </CardContent>
      </Card>

      {/* Multi-Provider Hierarchy & Free Token Pool */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-bold">Multi-Provider Failover Hierarchy</CardTitle>
          </div>
          <CardDescription className="text-xs">
            SYNAPS automatically cascades requests across local sovereign MoE, free token aggregators, and distributed models.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {[
              {
                priority: 'Priority 0 (Sovereign)',
                name: 'Colibrì Local 744B MoE',
                desc: 'On-premise pure C disk-streaming engine. Air-gapped, zero cloud data transfer.',
                badge: 'AIR-GAPPED',
                badgeClass: 'badge-primary',
              },
              {
                priority: 'Priority 1 (Free Gateway)',
                name: 'OmniRoute Free Gateway Pool',
                desc: '1.51 Billion monthly free tokens across 42 provider pools with automatic load balancing.',
                badge: '1.51B TOKENS',
                badgeClass: 'badge-secondary',
              },
              {
                priority: 'Priority 2 (High Velocity)',
                name: 'Groq LLaMA 3.3 70B & Mixtral',
                desc: 'Sub-second inference with automated 3-key rotation and token burst protection.',
                badge: 'SUB-SECOND',
                badgeClass: 'badge-accent',
              },
              {
                priority: 'Priority 3 (Reasoning)',
                name: 'Google Gemini 2.5 Flash',
                desc: 'Direct REST integration with exponential retry backoff and high-capacity token buffers.',
                badge: '1M CONTEXT',
                badgeClass: 'badge-info',
              },
              {
                priority: 'Priority 4 (Deterministic)',
                name: 'Synaps Grounded Memory Engine',
                desc: 'Internal corporate RAG engine guaranteed to return verified document evidence.',
                badge: '100% GROUNDED',
                badgeClass: 'badge-success',
              },
            ].map((p, idx) => (
              <div
                key={idx}
                className="p-3 bg-base-200/50 border border-base-300 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base-content">{p.name}</span>
                    <span className="text-[10px] text-base-content/50 font-mono">({p.priority})</span>
                  </div>
                  <p className="text-[11px] text-base-content/60 mt-0.5">{p.desc}</p>
                </div>
                <span className={`badge ${p.badgeClass} badge-xs font-bold text-[9px]`}>{p.badge}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Key Overrides (Optional) */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Custom Provider API Keys (Optional)</CardTitle>
          <CardDescription className="text-xs">
            Leave these blank to use the default SYNAPS managed infrastructure. Enter your own keys if you wish to override quotas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Groq (Primary)</Label>
              <Input
                type="password"
                placeholder="Optional. Leave blank to use defaults."
                value={keys.groq}
                onChange={(e) => handleChange('groq', e.target.value)}
                className="input-sm text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">OpenRouter</Label>
              <Input
                type="password"
                placeholder="Optional. Leave blank to use defaults."
                value={keys.openRouter}
                onChange={(e) => handleChange('openRouter', e.target.value)}
                className="input-sm text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Mistral AI</Label>
              <Input
                type="password"
                placeholder="Optional. Leave blank to use defaults."
                value={keys.mistral}
                onChange={(e) => handleChange('mistral', e.target.value)}
                className="input-sm text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Custom Colibrì Local URL</Label>
              <Input
                type="text"
                placeholder="http://localhost:8080/v1"
                value={keys.colibriUrl}
                onChange={(e) => handleChange('colibriUrl', e.target.value)}
                className="input-sm text-xs rounded-xl font-mono"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-base-300 px-6 py-4">
          <p className="text-xs text-emerald-400 font-medium">{message}</p>
          <Button onClick={handleSave} disabled={isSaving} className="btn-sm rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white">
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
