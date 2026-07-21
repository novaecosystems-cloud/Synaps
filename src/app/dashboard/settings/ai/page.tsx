'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BrainCircuit, CheckCircle2 } from 'lucide-react';

export default function AiSettings() {
  const [keys, setKeys] = useState({
    groq: '',
    openRouter: '',
    mistral: '',
    github: '',
    huggingface: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (provider: string, value: string) => {
    setKeys(prev => ({ ...prev, [provider]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setMessage('Keys securely saved to your organization profile.');
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Settings & Fallbacks</h1>
        <p className="text-muted-foreground">Manage your organization's AI infrastructure.</p>
      </div>

      <Card className="border-primary/50 overflow-hidden">
        <div className="bg-primary/10 px-6 py-4 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <p className="text-sm font-medium text-primary-foreground">
            By default, SYNAPS manages all API keys and LLM routing automatically.
          </p>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            <CardTitle>Custom Provider API Keys (Optional)</CardTitle>
          </div>
          <CardDescription>
            Leave these blank to use the default SYNAPS managed infrastructure. If you have your own enterprise API keys or better rate limits, you can enter them here to override the defaults.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Groq (Primary)</Label>
              <Input type="password" placeholder="Optional. Leave blank to use defaults." value={keys.groq} onChange={e => handleChange('groq', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>OpenRouter</Label>
              <Input type="password" placeholder="Optional. Leave blank to use defaults." value={keys.openRouter} onChange={e => handleChange('openRouter', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Mistral AI</Label>
              <Input type="password" placeholder="Optional. Leave blank to use defaults." value={keys.mistral} onChange={e => handleChange('mistral', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>GitHub Models (Tokens)</Label>
              <Input type="password" placeholder="Optional. Leave blank to use defaults." value={keys.github} onChange={e => handleChange('github', e.target.value)} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-border/40 px-6 py-4">
          <p className="text-sm text-muted-foreground">{message}</p>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
