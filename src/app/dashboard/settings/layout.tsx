'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Bell, Shield, Users, MonitorSmartphone, Building, Key, Database, Activity, Lock, BrainCircuit, Settings } from 'lucide-react';
import React from 'react';

const workspaceLinks = [
  { name: 'Organization', href: '/dashboard/settings/organization', icon: Building },
  { name: 'Users', href: '/dashboard/settings/team', icon: Users },
  { name: 'Roles & Permissions', href: '/dashboard/settings/roles', icon: Shield },
  { name: 'API Keys', href: '/dashboard/settings/api-keys', icon: Key },
  { name: 'Storage', href: '/dashboard/settings/storage', icon: Database },
  { name: 'Audit Log', href: '/dashboard/audit', icon: Activity },
];

const securityLinks = [
  { name: 'Auth & Sessions', href: '/dashboard/settings/security', icon: Lock },
  { name: 'AI Settings', href: '/dashboard/settings/ai', icon: BrainCircuit },
];

const personalLinks = [
  { name: 'Preferences', href: '/dashboard/settings/preferences', icon: Settings },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const renderNavSection = (title: string, links: any[]) => (
    <div className="mb-8">
      <h3 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-base-content/50">
        {title}
      </h3>
      <nav className="space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive 
                  ? "bg-primary/10 text-primary font-semibold" 
                  : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="flex w-full flex-col md:flex-row bg-base-100 h-full rounded-xl border border-base-300 shadow-sm overflow-hidden text-base-content">
      {/* Settings Sub-Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 border-r border-base-300 p-4 overflow-y-auto bg-base-200/30">

        {renderNavSection('Workspace', workspaceLinks)}
        {renderNavSection('Security & AI', securityLinks)}
        {renderNavSection('Personal', personalLinks)}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="w-full max-w-4xl h-fit">
           {children}
        </div>
      </main>
    </div>
  );
}
