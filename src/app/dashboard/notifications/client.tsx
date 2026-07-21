"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Bell, CheckCircle, FileText, BrainCircuit, Activity, FolderKanban, Settings, Mail, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotificationsClient({ userId, organizationId }: { userId: string, organizationId: string }) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD' | 'SETTINGS'>('UNREAD');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [prefs, setPrefs] = useState<any>(null);
  
  const router = useRouter();

  useEffect(() => {
    if (activeTab === 'SETTINGS') {
      fetchPreferences();
    } else {
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
      
      // Optimistic update
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      
      if (link) {
        router.push(link);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const togglePreference = async (field: string, value: any) => {
    // Optimistic
    const newPrefs = { ...prefs, [field]: value };
    setPrefs(newPrefs);
    
    try {
      await fetch('/api/notifications/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, [field]: value })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDisabledType = async (type: string) => {
    const isCurrentlyDisabled = prefs.disabledTypes.includes(type);
    let newDisabledTypes = [...prefs.disabledTypes];
    
    if (isCurrentlyDisabled) {
      newDisabledTypes = newDisabledTypes.filter(t => t !== type);
    } else {
      newDisabledTypes.push(type);
    }
    
    togglePreference('disabledTypes', newDisabledTypes);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'DOCUMENT_PROCESSED': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'AI_COMPLETED': return <BrainCircuit className="w-5 h-5 text-purple-500" />;
      case 'APPROVAL_REQUIRED': return <Activity className="w-5 h-5 text-amber-500" />;
      case 'REVIEW_COMPLETED': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'PROJECT_UPDATE': return <FolderKanban className="w-5 h-5 text-slate-500" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="flex h-full flex-col md:flex-row p-6 gap-6">
      
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 flex flex-col space-y-1">
        <button 
          onClick={() => setActiveTab('UNREAD')}
          className={`px-4 py-2 text-left rounded-lg text-sm font-medium transition-colors ${activeTab === 'UNREAD' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Unread
        </button>
        <button 
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2 text-left rounded-lg text-sm font-medium transition-colors ${activeTab === 'ALL' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          All Notifications
        </button>
        <button 
          onClick={() => setActiveTab('SETTINGS')}
          className={`px-4 py-2 text-left rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${activeTab === 'SETTINGS' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Settings
          <Settings className="w-4 h-4 opacity-50" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-card border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
        
        {activeTab !== 'SETTINGS' && (
          <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
            <h2 className="font-semibold">{activeTab === 'UNREAD' ? 'Unread Notifications' : 'All Notifications'}</h2>
            {activeTab === 'UNREAD' && notifications.length > 0 && (
              <button onClick={markAllAsRead} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                Mark all as read
              </button>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-0">
          {loading ? (
             <div className="p-12 flex justify-center text-muted-foreground">
               <Loader2 className="w-8 h-8 animate-spin" />
             </div>
          ) : activeTab === 'SETTINGS' && prefs ? (
            <div className="p-8 max-w-2xl">
              <h2 className="text-xl font-bold mb-6">Notification Preferences</h2>
              
              <div className="space-y-8">
                {/* Channels */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4 border-b pb-2">Channels</h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-slate-500" />
                        <div>
                          <p className="font-medium text-slate-800">In-App Notifications</p>
                          <p className="text-xs text-slate-500">Receive alerts within the Sisyphus dashboard</p>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={prefs.inAppEnabled} 
                        onChange={(e) => togglePreference('inAppEnabled', e.target.checked)}
                        className="w-5 h-5 accent-indigo-600"
                      />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer opacity-70">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-slate-500" />
                        <div>
                          <p className="font-medium text-slate-800">Email Notifications</p>
                          <p className="text-xs text-slate-500">Receive daily digests (Coming soon)</p>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        disabled
                        checked={prefs.emailEnabled}
                        className="w-5 h-5 accent-indigo-600 cursor-not-allowed"
                      />
                    </label>
                  </div>
                </div>

                {/* Event Types */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4 border-b pb-2">Event Types</h3>
                  <div className="space-y-3">
                    {[
                      { type: 'DOCUMENT_PROCESSED', label: 'Document Processed', desc: 'When file extraction finishes' },
                      { type: 'AI_COMPLETED', label: 'AI Generation Completed', desc: 'When proposal generation finishes' },
                      { type: 'APPROVAL_REQUIRED', label: 'Approvals Required', desc: 'When you are assigned as a reviewer' },
                      { type: 'REVIEW_COMPLETED', label: 'Review Completed', desc: 'When a reviewer approves/rejects' },
                      { type: 'PROJECT_UPDATE', label: 'Project Updates', desc: 'General project status changes' },
                    ].map(event => (
                      <label key={event.type} className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors">
                        <div>
                          <p className="font-medium text-slate-800 text-sm">{event.label}</p>
                          <p className="text-xs text-slate-500">{event.desc}</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={!prefs.disabledTypes.includes(event.type)} 
                          onChange={() => toggleDisabledType(event.type)}
                          className="w-4 h-4 accent-indigo-600"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-muted-foreground">
              <Bell className="w-12 h-12 opacity-20 mb-4" />
              <h3 className="text-lg font-medium text-foreground">You're all caught up!</h3>
              <p className="text-sm mt-1">There are no {activeTab === 'UNREAD' ? 'unread' : ''} notifications to show.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  onClick={() => markAsRead(n.id, n.link)}
                  className={`p-4 flex gap-4 transition-colors cursor-pointer hover:bg-muted/50 ${!n.isRead ? 'bg-indigo-50/50' : 'bg-transparent'}`}
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
                  {!n.isRead && (
                    <div className="shrink-0 flex items-center">
                       <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
