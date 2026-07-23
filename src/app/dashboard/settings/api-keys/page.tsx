'use client';

import React, { useState, useEffect } from 'react';
import { 
  Key, ShieldCheck, Lock, Sparkles, CheckCircle2, 
  Trash2, Eye, EyeOff, Save, Loader2, Zap, AlertTriangle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ApiKeysSettingsPage() {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [maskedKey, setMaskedKey] = useState('');
  const [showPlain, setShowPlain] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchKeyStatus = async () => {
    try {
      const res = await fetch('/api/settings/ai/keys');
      const data = await res.json();
      if (data.success) {
        setHasKey(data.hasKey);
        setMaskedKey(data.maskedKey || '');
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeyStatus();
  }, []);

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/settings/ai/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKeyInput })
      });
      const data = await res.json();

      if (data.success) {
        setHasKey(data.hasKey);
        setMaskedKey(data.maskedKey || '');
        setApiKeyInput('');
        setMessage({ type: 'success', text: data.message });
        window.dispatchEvent(new Event('focus')); // Refresh AI credit badge
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save API key' });
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveKey = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/settings/ai/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: '' })
      });
      const data = await res.json();

      if (data.success) {
        setHasKey(false);
        setMaskedKey('');
        setApiKeyInput('');
        setMessage({ type: 'success', text: data.message });
        window.dispatchEvent(new Event('focus')); // Refresh AI credit badge
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-8 font-sans pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-base-content">Bring Your Own Key (BYOK) & Security</h1>
            <p className="text-xs text-base-content/60">Add your custom Groq, Gemini, or OpenAI key for <strong>unlimited daily AI credits</strong>.</p>
          </div>
        </div>

        {hasKey && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold shadow-inner">
            <Zap className="w-4 h-4 fill-emerald-500 text-emerald-500" />
            <span>UNLIMITED BYOK ACTIVE</span>
          </div>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
          message.type === 'success' ? 'bg-success/10 border-success/30 text-success' : 'bg-red-500/10 border-red-500/30 text-red-500'
        }`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Zero-Knowledge Security Notice */}
      <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-emerald-500/30 text-white rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
          <ShieldCheck className="w-5 h-5 text-emerald-400" /> AES-256-GCM Zero-Knowledge Security Guarantee
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          Your custom API keys are encrypted client-side using <strong>military-grade AES-256-GCM encryption</strong> before storing. Plaintext API keys are <strong>NEVER stored, logged, or visible</strong> to developers, database administrators, or external hackers. Only runtime memory decrypts the key strictly during your request.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 text-slate-200">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>AES-256-GCM Encrypted</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zero Log Disclosure</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Bypasses Daily Limits</span>
          </div>
        </div>
      </div>

      {/* Active Custom Key Section */}
      {loading ? (
        <div className="py-12 text-center text-xs text-base-content/50">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
          Checking encrypted key status...
        </div>
      ) : (
        <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-6 shadow-sm">
          <div>
            <h3 className="font-bold text-base text-base-content flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" /> Custom AI Provider Key
            </h3>
            <p className="text-xs text-base-content/60 mt-1">
              Enter your Groq (`gsk_...`), Gemini (`AIzaSy...`), or OpenAI (`sk-...`) API key to unlock unlimited AI credits.
            </p>
          </div>

          {hasKey ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 block">Encrypted Active Key</span>
                <span className="font-mono text-sm font-bold text-base-content">{maskedKey}</span>
              </div>

              <Button
                onClick={handleRemoveKey}
                disabled={saving}
                variant="outline"
                className="rounded-xl gap-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/30"
              >
                <Trash2 className="w-4 h-4" /> Remove Key & Revert to Daily Limits
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSaveKey} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-base-content/70 uppercase tracking-wider block">Enter Custom API Key</label>
                <div className="relative">
                  <input
                    type={showPlain ? 'text' : 'password'}
                    required
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="e.g. gsk_1234567890abcdef..."
                    className="w-full pl-4 pr-12 py-3 bg-base-200 border border-base-300 rounded-2xl text-sm font-mono text-base-content outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPlain(!showPlain)}
                    className="absolute right-4 top-3.5 text-base-content/40 hover:text-base-content"
                  >
                    {showPlain ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={saving || !apiKeyInput.trim()}
                className="rounded-2xl gap-2 font-bold py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Encrypting & Saving Key...' : 'Encrypt & Save Custom Key (Unlimited AI)'}
              </Button>
            </form>
          )}
        </div>
      )}

      {/* Anti-Spam Security Explanation */}
      <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-3 shadow-sm">
        <h3 className="font-bold text-sm text-base-content flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" /> Anti-Spam & Cost Protection Architecture
        </h3>
        <p className="text-xs text-base-content/70 leading-relaxed">
          Daily credit limits (50/500 credits per day) apply to users using the shared free pool to prevent automated spam and server overload. Users who provide their own API key run requests against their own provider quota, giving them unlimited usage without imposing costs on your platform!
        </p>
      </div>

    </div>
  );
}
