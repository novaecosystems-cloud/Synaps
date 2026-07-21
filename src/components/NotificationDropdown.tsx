"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bell, FileText, CheckCircle, BrainCircuit, Activity, FolderKanban, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function NotificationDropdown({ userId, organizationId }: { userId: string, organizationId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isOpen) {
      gsap.fromTo(contentRef.current, 
        { y: -10, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.5)', display: 'block' }
      );
    } else {
      gsap.to(contentRef.current, { 
        y: -10, opacity: 0, scale: 0.95, duration: 0.2, ease: 'power2.in', display: 'none' 
      });
    }
  }, [isOpen]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`/api/notifications?userId=${userId}&organizationId=${organizationId}&limit=5`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
      try {
        await fetch('/api/notifications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, notificationId: notification.id })
        });
        fetchNotifications();
      } catch (err) {
        console.error(err);
      }
    }
    setIsOpen(false);
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'DOCUMENT_PROCESSED': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'AI_COMPLETED': return <BrainCircuit className="w-4 h-4 text-purple-500" />;
      case 'APPROVAL_REQUIRED': return <Activity className="w-4 h-4 text-amber-500" />;
      case 'REVIEW_COMPLETED': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'PROJECT_UPDATE': return <FolderKanban className="w-4 h-4 text-slate-500" />;
      default: return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative cursor-pointer p-2.5 bg-card text-foreground hover:bg-muted active:brightness-90 shadow-sm border border-border rounded-full transition-all ease-linear"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          ></path>
        </svg>
        {unreadCount > 0 && (
          <div className="bg-red-500 border-2 border-background rounded-full w-3.5 h-3.5 absolute top-0 right-0 flex items-center justify-center">
            <div className="bg-red-500 rounded-full animate-ping w-full h-full absolute"></div>
            <span className="text-[8px] font-bold text-white relative z-10 leading-none">{unreadCount > 9 ? '9+' : unreadCount}</span>
          </div>
        )}
      </button>

        <div 
          ref={contentRef}
          style={{ display: 'none' }}
          className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1a1a2e] border-2 border-primary/20 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
        >
          <div className="flex justify-between items-center p-3 border-b border-border/50 bg-slate-50 dark:bg-[#11111f]">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-indigo-500 hover:text-indigo-600 font-medium">
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center">
                <Bell className="w-8 h-8 opacity-20 mb-2" />
                No new notifications
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    onClick={() => handleNotificationClick(n)}
                    className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors flex gap-3 ${!n.isRead ? 'bg-indigo-500/5' : ''}`}
                  >
                    <div className="mt-1 shrink-0 bg-background border border-border rounded-full p-1.5 shadow-sm">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium truncate ${!n.isRead ? 'text-foreground font-semibold' : 'text-slate-700 dark:text-slate-300'}`}>
                        {n.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1 font-medium">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!n.isRead && (
                      <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-2"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-2 border-t border-border bg-muted/20 text-center">
            <Link 
              href="/dashboard/notifications" 
              onClick={() => setIsOpen(false)}
              className="text-xs font-medium text-indigo-500 hover:text-indigo-600 w-full inline-block py-1"
            >
              View all notifications
            </Link>
          </div>
        </div>
    </div>
  );
}
