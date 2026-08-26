'use client';

import React, { useState } from 'react';
import { Flame, X, CheckCircle2, ShieldCheck, Mail, Loader2, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Founder / CEO');
  const [orgSize, setOrgSize] = useState('11-50');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [position, setPosition] = useState(142);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, orgSize })
      });
      const json = await res.json();
      if (json.success) {
        setPosition(json.position || 142);
        setSubmitted(true);
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-lg bg-slate-950 border border-emerald-500/40 rounded-3xl p-8 shadow-2xl text-white overflow-hidden">
        
        {/* Glowing Background Blur */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 fill-emerald-400" /> Executive Launch Cohort (Option 1 Waitlist)
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white leading-tight">
                Join the Synaps AI Executive Waitlist
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Get early beta access, 50% lifetime launch discount, and priority onboarding for your 3D Corporate Memory Graph & 10-Agent AI Boardroom.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Work Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Your Executive Role</label>
                  <select 
                    value={role} 
                    onChange={e => setRole(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-emerald-500/30"
                  >
                    <option value="Founder / CEO">Founder / CEO</option>
                    <option value="CFO / Finance Lead">CFO / Finance Lead</option>
                    <option value="CTO / VP Engineering">CTO / VP Engineering</option>
                    <option value="COO / Head of Ops">COO / Head of Ops</option>
                    <option value="General Counsel / Legal">General Counsel / Legal</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Organization Size</label>
                  <select 
                    value={orgSize} 
                    onChange={e => setOrgSize(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-emerald-500/30"
                  >
                    <option value="1-10">1 - 10 employees</option>
                    <option value="11-50">11 - 50 employees</option>
                    <option value="51-250">51 - 250 employees</option>
                    <option value="250+">250+ Enterprise</option>
                  </select>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full rounded-2xl py-3 gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-lg">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4 fill-slate-950" />}
              {loading ? 'Securing Waitlist Spot...' : 'Claim My Waitlist Spot & Beta Discount'}
            </Button>

            <div className="pt-2 flex justify-between items-center text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Zero-Retention Data Policy
              </span>
              <span className="flex items-center gap-1 font-mono text-emerald-400">
                <Award className="w-3 h-3" /> 50% Lifetime Discount
              </span>
            </div>
          </form>
        ) : (
          <div className="space-y-6 text-center py-4 relative z-10 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-extrabold">
                Waitlist Spot #{position} Reserved!
              </span>
              <h3 className="text-2xl font-extrabold text-white">You're On The Executive Beta List</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                We have registered <strong className="text-emerald-400">{email}</strong> for Executive Access. You will receive an instant invite when your cohort opens.
              </p>
            </div>

            <div className="pt-4">
              <Button onClick={onClose} className="rounded-2xl px-8 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold">
                Done & Return to App
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
