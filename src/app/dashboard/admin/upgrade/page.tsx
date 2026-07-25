'use client';

import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, Loader2, Users, Zap, ShieldCheck, Crown, Bell, Check, Clock, X, RefreshCw, ExternalLink, Copy, Landmark, CreditCard } from 'lucide-react';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationId: string | null;
}

interface PendingRequest {
  id: string;
  userEmail: string;
  planId: string;
  amount: number;
  createdAt: string;
  status: string;
}

interface PendingRefund {
  id: string;
  userEmail: string;
  refundMethod: string;
  refundPayoutDetails: string;
  reason: string;
  createdAt: string;
  status: string;
}

export default function AdminUpgradePage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [pendingRefunds, setPendingRefunds] = useState<PendingRefund[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [upgraded, setUpgraded] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
        setPendingRequests(data.pendingRequests || []);
        setPendingRefunds(data.pendingRefunds || []);
      }
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    // Live Polling every 5 seconds for instant activation & refunds!
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpgrade = async (userId: string | null, userEmail: string | null, planId: string, requestId?: string) => {
    const key = (userId || userEmail) + planId;
    setUpgrading(key);
    setMessage('');
    try {
      const res = await fetch('/api/admin/upgrade-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, userEmail, planId, requestId })
      });
      const data = await res.json();
      if (data.success) {
        setUpgraded(key);
        setMessage(`✅ ${data.message}`);
        fetchUsers();
        setTimeout(() => setUpgraded(null), 3000);
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (e: any) {
      setMessage(`❌ ${e.message}`);
    }
    setUpgrading(null);
  };

  const handleResolveRefund = async (requestId: string, userEmail: string) => {
    try {
      await fetch('/api/settings/billing/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resolve_refund', requestId, userEmail })
      });
    } catch (e) {}
    setPendingRefunds(prev => prev.filter(r => r.id !== requestId));
    setMessage(`✅ Refund for ${userEmail} marked as complete & resolved.`);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleReject = async (requestId: string) => {
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const roleColor = (role: string) => {
    if (role === 'LEADER' || role === 'OWNER') return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
    if (role === 'ADMIN') return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
    return 'text-base-content/50 bg-base-200 border-base-300';
  };

  const planLabel = (role: string) => {
    if (role === 'LEADER' || role === 'OWNER') return 'Enterprise Max';
    if (role === 'ADMIN') return 'Pro';
    return 'Free';
  };

  const filtered = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl space-y-6 pb-16 font-sans">

      {/* Header */}
      <div className="p-6 bg-base-100 rounded-3xl border border-base-300 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-base-content">Owner Admin — Live User Upgrades & Refunds</h1>
            <p className="text-xs text-base-content/50">Requests & refunds appear in real time. Process refunds via UPI, Bank, Stripe, or PayPal.</p>
          </div>
        </div>

        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Live Polling Active
        </span>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-sm font-bold ${message.startsWith('✅') ? 'bg-success/10 border border-success/30 text-success' : 'bg-red-500/10 border border-red-500/30 text-red-500'}`}>
          {message}
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* LIVE PENDING REFUND REQUESTS SECTION */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {pendingRefunds.length > 0 && (
        <div className="p-6 bg-red-500/10 border-2 border-red-500/40 rounded-3xl space-y-4 shadow-xl animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-red-500 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-red-500 animate-spin" /> 
              Pending 100% Refund Requests ({pendingRefunds.length})
            </h2>
            <span className="text-xs font-bold text-red-400">14-Day Money Back Guarantee</span>
          </div>

          <div className="space-y-3">
            {pendingRefunds.map((req) => (
              <div key={req.id} className="p-5 bg-base-100 border border-red-500/30 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-base-200 pb-3">
                  <div>
                    <span className="font-extrabold text-base text-base-content">{req.userEmail}</span>
                    <span className="ml-2 text-xs font-bold uppercase tracking-wider text-red-500 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
                      Method: {req.refundMethod.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-base-content/50">Requested {new Date(req.createdAt).toLocaleTimeString()}</span>
                </div>

                {/* Payout Details */}
                <div className="p-3 bg-base-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-base-content/60">Payout ID / Account Details:</span>
                    <button
                      onClick={() => handleCopy(req.refundPayoutDetails, req.id)}
                      className="text-primary font-bold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      {copiedKey === req.id ? <><Check className="w-3.5 h-3.5 text-success" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Details</>}
                    </button>
                  </div>
                  <p className="font-mono text-sm font-extrabold text-primary break-all">{req.refundPayoutDetails}</p>
                </div>

                <p className="text-xs text-base-content/60">
                  Reason: <em>"{req.reason}"</em>
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {req.refundMethod === 'paypal' && (
                    <button
                      onClick={() => window.open('https://www.paypal.com/myaccount/transactions', '_blank')}
                      className="px-4 py-2 rounded-xl bg-[#009cde] hover:bg-[#0085c0] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Open PayPal Activity
                    </button>
                  )}

                  <button
                    onClick={() => handleResolveRefund(req.id, req.userEmail)}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                  >
                    <Check className="w-4 h-4 stroke-[3]" /> Mark Refund Sent & Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* LIVE PENDING UPGRADE REQUESTS SECTION */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {pendingRequests.length > 0 && (
        <div className="p-6 bg-amber-500/10 border-2 border-amber-500/40 rounded-3xl space-y-4 shadow-xl animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-amber-500 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500 animate-bounce" /> 
              Pending Payment Verification Requests ({pendingRequests.length})
            </h2>
            <span className="text-xs font-bold text-amber-400">Owner Action Required</span>
          </div>

          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div key={req.id} className="p-4 bg-base-100 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm text-base-content">{req.userEmail}</span>
                    <span className="text-xs font-bold text-amber-500">
                      wants the <strong>{req.planId === 'enterprise' ? 'Enterprise Max ($20)' : 'Pro ($7)'}</strong> plan
                    </span>
                  </div>
                  <p className="text-xs text-base-content/50 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Sent verification request {new Date(req.createdAt).toLocaleTimeString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleUpgrade(null, req.userEmail, req.planId, req.id)}
                    disabled={!!upgrading}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md"
                  >
                    {upgrading === req.userEmail + req.planId ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-black" /> Accept & Upgrade Immediately
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    className="px-3 py-2.5 rounded-xl bg-base-200 hover:bg-red-500/10 border border-base-300 hover:border-red-500/30 text-base-content/60 hover:text-red-500 text-xs font-bold transition-all"
                    title="Dismiss Request"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-4 h-4 text-base-content/40" />
        <input
          type="text"
          placeholder="Search by email or name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-base-100 border border-base-300 rounded-2xl text-sm text-base-content outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Users table */}
      <div className="bg-base-100 border border-base-300 rounded-3xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-xs text-base-content/40 mt-3">Loading users...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-10 h-10 mx-auto text-base-content/20 mb-3" />
            <p className="text-sm text-base-content/40">No users found</p>
          </div>
        ) : (
          <div className="divide-y divide-base-300">
            {filtered.map(user => (
              <div key={user.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-base-content truncate">{user.name || 'No name'}</p>
                  <p className="text-xs text-base-content/50 truncate">{user.email}</p>
                  <span className={`mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${roleColor(user.role)}`}>
                    {planLabel(user.role)} — {user.role}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Upgrade to Pro */}
                  <button
                    onClick={() => handleUpgrade(user.id, user.email, 'pro')}
                    disabled={!!upgrading || user.role === 'ADMIN' || user.role === 'OWNER'}
                    className="px-3 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-500 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {upgrading === user.id + 'pro' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                     upgraded === user.id + 'pro' ? <CheckCircle2 className="w-3.5 h-3.5 text-success" /> :
                     <Zap className="w-3.5 h-3.5" />}
                    Pro ($7)
                  </button>

                  {/* Upgrade to Enterprise */}
                  <button
                    onClick={() => handleUpgrade(user.id, user.email, 'enterprise')}
                    disabled={!!upgrading || user.role === 'OWNER'}
                    className="px-3 py-2 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {upgrading === user.id + 'enterprise' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                     upgraded === user.id + 'enterprise' ? <CheckCircle2 className="w-3.5 h-3.5 text-success" /> :
                     <Crown className="w-3.5 h-3.5" />}
                    Max ($20)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
