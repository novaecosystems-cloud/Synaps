"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Bell, CheckCircle, FileText, BrainCircuit, Activity, FolderKanban, Settings, Mail, Smartphone, Send, Slack, MessageSquare, Zap, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotificationsClient({ userId, organizationId }: { userId: string, organizationId: string }) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD' | 'DIGEST' | 'SETTINGS'>('UNREAD');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [prefs, setPrefs] = useState<any>(null);

  // Executive Digest Dispatch State
  const [digestRole, setDigestRole] = useState<'CEO' | 'CFO' | 'LEGAL' | 'PROCUREMENT'>('CEO');
  const [digestFrequency, setDigestFrequency] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('DAILY');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [emailOverride, setEmailOverride] = useState('');
  const [dispatching, setDispatching] = useState(false);
  const [dispatchResult, setDispatchResult] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    if (activeTab === 'SETTINGS') {
      fetchPreferences();
    } else if (activeTab !== 'DIGEST') {
      fetchNotifications();
    }
  }, [activeTab]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const url = activeTab === 'UNREAD' 
        ? `/api/notifications?userId=${userId}&organizationId=${organizationId}&unreadOnly=true`
        : `/api/notifications?userId=${userId}&organizationId=${organizationId}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notifications/preferences?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setPrefs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendDigest = async () => {
    setDispatching(true);
    setDispatchResult('');
    try {
      const res = await fetch('/api/digest/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: digestRole,
          digestType: digestFrequency,
          webhookUrl: webhookUrl.trim(),
          emailOverride: emailOverride.trim()
        })
      });
      const json = await res.json();
      if (json.success) {
        setDispatchResult(`✅ ${json.message} (Delivered to ${json.targetEmail} ${json.webhookStatus !== 'NOT_CONFIGURED' ? `& Webhook: ${json.webhookStatus}` : ''})`);
      } else {
        setDispatchResult(`❌ ${json.error}`);
      }
    } catch (err: any) {
      setDispatchResult(`❌ ${err.message}`);
    } finally {
      setDispatching(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, markAllAsRead: true })
      });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id: string, link: string | null) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, notificationId: id })
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      if (link) router.push(link);
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'DOCUMENT_PROCESSED': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'AI_COMPLETED': return <BrainCircuit className="w-5 h-5 text-purple-500" />;
      case 'APPROVAL_REQUIRED': return <Activity className="w-5 h-5 text-amber-500" />;
      case 'REVIEW_COMPLETED': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'PROJECT_UPDATE': return <FolderKanban className="w-5 h-5 text-indigo-500" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      {/* Subheader & Tabs */}
      <div className="px-6 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('UNREAD')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'UNREAD' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'ALL' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            All Alerts
          </button>
          <button
            onClick={() => setActiveTab('DIGEST')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'DIGEST' ? 'bg-amber-500 text-black shadow-sm' : 'text-amber-500 hover:bg-amber-500/10'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" /> Executive Digest
          </button>
          <button
            onClick={() => setActiveTab('SETTINGS')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'SETTINGS' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Settings className="w-3.5 h-3.5" /> Preferences
          </button>
        </div>

        {activeTab !== 'SETTINGS' && activeTab !== 'DIGEST' && notifications.some(n => !n.isRead) && (
          <button
            onClick={markAllAsRead}
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <CheckCircle className="w-3.5 h-3.5" /> Mark all as read
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'DIGEST' ? (
            /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
            /* EXECUTIVE DIGEST DISPATCHER & WEBHOOKS (FREE TIER) */
            /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
            <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-6 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                  Multi-Channel Executive Digest & Webhook Dispatcher
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Deliver role-tailored summaries (CEO, CFO, Legal, Procurement) directly to Email, Slack, Teams, or SMS with 1-click deep links to active documents & projects.
                </p>
              </div>

              {dispatchResult && (
                <div className={`p-4 rounded-2xl text-xs font-bold ${dispatchResult.startsWith('✅') ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-500 border border-red-500/30'}`}>
                  {dispatchResult}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Role Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">Target Executive Role</label>
                  <select
                    value={digestRole}
                    onChange={e => setDigestRole(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-bold text-slate-900 dark:text-white outline-none"
                  >
                    <option value="CEO">👑 CEO — Strategic Overview & Risk Alerts</option>
                    <option value="CFO">💰 CFO — Financial Commitments & Cost Risks</option>
                    <option value="LEGAL">⚖️ Legal Counsel — Contract Liability & Redlines</option>
                    <option value="PROCUREMENT">📦 Procurement Officer — Vendor SLA & Renewals</option>
                  </select>
                </div>

                {/* Frequency Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">Digest Frequency</label>
                  <select
                    value={digestFrequency}
                    onChange={e => setDigestFrequency(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-bold text-slate-900 dark:text-white outline-none"
                  >
                    <option value="DAILY">☀️ Daily Morning Brief (8:00 AM)</option>
                    <option value="WEEKLY">📅 Weekly Strategic Summary</option>
                    <option value="MONTHLY">📊 Monthly Executive Retrospective</option>
                  </select>
                </div>
              </div>

              {/* Delivery Channels */}
              <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Delivery Channels</h3>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Recipient Email (Gmail SMTP)</label>
                  <input
                    type="email"
                    value={emailOverride}
                    onChange={e => setEmailOverride(e.target.value)}
                    placeholder="e.g. novaecosystems@gmail.com"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Slack / Microsoft Teams / SMS Webhook URL (Optional)</label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={e => setWebhookUrl(e.target.value)}
                    placeholder="https://hooks.slack.com/services/..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white outline-none font-mono"
                  />
                </div>
              </div>

              <button
                onClick={handleSendDigest}
                disabled={dispatching}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-40"
              >
                {dispatching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {dispatching ? 'Generating & Dispatching Digest...' : `Dispatch ${digestFrequency} ${digestRole} Executive Digest Now`}
              </button>
            </div>
          ) : activeTab === 'SETTINGS' && prefs ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Notification Preferences</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure how and when you receive updates.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
                  <div>
                    <p className="font-semibold text-xs text-slate-900 dark:text-white">In-App Notifications</p>
                    <p className="text-[11px] text-slate-500">Show real-time badges & toasts</p>
                  </div>
                  <input type="checkbox" checked={prefs.inAppEnabled} disabled className="w-4 h-4 accent-indigo-600" />
                </div>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-muted-foreground">
              <Bell className="w-12 h-12 opacity-20 mb-4" />
              <h3 className="text-lg font-medium text-foreground">You're all caught up!</h3>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  onClick={() => markAsRead(n.id, n.link)}
                  className={`p-4 flex gap-4 transition-colors cursor-pointer hover:bg-muted/50 ${!n.isRead ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : 'bg-transparent'}`}
                >
                  <div className="shrink-0 mt-1">
                    <div className="bg-white border border-slate-200 p-2 rounded-full shadow-sm">
                      {getIcon(n.type)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className={`text-base ${!n.isRead ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                        {n.title}
                      </h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                        {new Date(n.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-sm mt-1 ${!n.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500'}`}>
                      {n.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
