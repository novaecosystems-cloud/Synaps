'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Settings, 
  Search, 
  Bell, 
  LogOut,
  ChevronRight,
  ChevronDown,
  Files,
  Code,
  BrainCircuit,
  ClipboardList,
  Activity,
  TrendingUp,
  Download,
  Menu,
  X,
  Network,
  Users,
  GitBranch,
  Scale
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { logoutAction } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationDropdown = dynamic(() => import('@/components/NotificationDropdown'), { ssr: false });
const GlobalSearch = dynamic(() => import('@/components/GlobalSearch').then(mod => mod.GlobalSearch), { ssr: false });
const OnboardingHints = dynamic(() => import('@/components/onboarding').then(mod => mod.OnboardingHints), { ssr: false });
const TourGuide = dynamic(() => import('@/components/TourGuide'), { ssr: false });

type SubMenuItem = {
  name: string;
  href: string;
};

type MenuItem = {
  name: string;
  icon: React.ElementType;
  href?: string;
  children?: SubMenuItem[];
};

const sidebarLinks: MenuItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Memory Graph', href: '/dashboard/graph', icon: Network },
  { name: 'Decision Memory', href: '/dashboard/decisions', icon: Scale },
  { name: 'Meetings', href: '/dashboard/meetings', icon: Users },
  { name: 'Org Timeline', href: '/dashboard/timeline', icon: GitBranch },
  { name: 'AI Workspace', href: '/dashboard/workspace', icon: BrainCircuit },
  { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
  { 
    name: 'Projects', 
    icon: FolderKanban,
    children: [
      { name: 'All Projects', href: '/dashboard/projects' },
      { name: 'Requirements', href: '/dashboard/requirements' },
    ]
  },
  { 
    name: 'Documents', 
    icon: Files,
    children: [
      { name: 'Library', href: '/dashboard/documents' },
      { name: 'Export History', href: '/dashboard/exports' },
    ]
  },
  { 
    name: 'System', 
    icon: Settings,
    children: [
      { name: 'Developer', href: '/dashboard/developer' },
      { name: 'Audit Logs', href: '/dashboard/audit' },
    ]
  },
];

function SidebarItem({ item, pathname, closeMobileMenu }: { item: MenuItem, pathname: string, closeMobileMenu: () => void }) {
  const isDirectActive = item.href && (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)));
  const isChildActive = item.children?.some(child => pathname === child.href || pathname.startsWith(child.href));
  
  const [isOpen, setIsOpen] = useState(isChildActive);
  const Icon = item.icon;

  useEffect(() => {
    if (isChildActive) setIsOpen(true);
  }, [isChildActive]);

  if (!item.children) {
    return (
      <li>
        <Link
          href={item.href!}
          onClick={closeMobileMenu}
          className={cn(
            `tour-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
            item.href === '/dashboard/workspace' ? "tour-workspace" : "",
            isDirectActive ? "active text-primary font-medium bg-primary/10" : "text-base-content/70 hover:text-base-content"
          )}
        >
          <Icon className="h-4 w-4" />
          {item.name}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          `tour-group-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
          isChildActive && !isOpen ? "text-base-content font-medium" : "text-base-content/70 hover:text-base-content"
        )}
      >
        <Icon className={cn("h-4 w-4", isChildActive ? "text-primary" : "")} />
        {item.name}
        <span className="ml-auto">
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden before:bg-base-300"
          >
            {item.children.map(child => {
              const childActive = pathname === child.href || pathname.startsWith(child.href);
              return (
                <li key={child.name}>
                  <Link
                    href={child.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      `tour-item-${child.name.toLowerCase().replace(/\s+/g, '-')}`,
                      childActive ? "active text-primary font-medium bg-primary/10" : "text-base-content/70 hover:text-base-content"
                    )}
                  >
                    {child.name}
                  </Link>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}

export default function ClientLayout({ children, user }: { children: React.ReactNode, user: { id: string, organizationId: string } }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAction();
    router.push('/login');
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative tour-dashboard">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "tour-sidebar w-64 flex-shrink-0 border-r border-border bg-card flex-col justify-between p-4 print:hidden transition-transform duration-200 ease-in-out overflow-y-auto",
        "fixed inset-y-0 left-0 z-50 md:relative md:z-auto flex custom-scrollbar",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 px-2 mt-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold aura-purple border border-primary/50">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight leading-none uppercase">Synaps</span>
              <span className="text-[10px] text-muted-foreground tracking-widest uppercase">Workspace</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
                Main
              </h3>
              <ul className="menu w-full px-0 space-y-1">
                {sidebarLinks.map((item) => (
                  <SidebarItem 
                    key={item.name} 
                    item={item} 
                    pathname={pathname} 
                    closeMobileMenu={() => setIsMobileMenuOpen(false)} 
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="space-y-4 mt-8">
          {/* Team Plan Widget Removed */}

          <div className="space-y-1">
            <Link
              href="/dashboard/settings"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith('/dashboard/settings')
                  ? "bg-primary/5 text-primary glow-purple font-semibold" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-muted/20 relative print:overflow-visible print:bg-white print:text-black">
        {/* Top Navigation Bar - hidden on root dashboard */}
        <header className="h-16 border-b border-base-300 bg-base-100 flex items-center justify-between px-4 sm:px-6 shrink-0 print:hidden gap-4 shadow-sm z-30">
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden btn btn-ghost btn-circle"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5 text-base-content/70" />
          </button>

          {/* Search */}
          <div className="relative flex-1 md:w-96 md:flex-none tour-search">
            <button 
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
              className="w-full flex items-center pl-4 pr-3 py-2 bg-base-200 border border-base-300 rounded-xl text-sm text-base-content/60 hover:bg-base-200 hover:border-primary/40 hover:text-base-content transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
            >
              <Search className="h-4 w-4 mr-3 shrink-0" />
              <span className="truncate font-medium">Search anything...</span>
              <span className="ml-auto hidden sm:flex items-center"><kbd className="kbd kbd-sm shadow-none border-base-300 bg-base-100">⌘</kbd><kbd className="kbd kbd-sm shadow-none border-base-300 bg-base-100 ml-1">K</kbd></span>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <ThemeToggle />
            <div className="tour-notifications"><NotificationDropdown userId={user.id} organizationId={user.organizationId} /></div>
            <div className="avatar">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-secondary cursor-pointer shadow-sm border border-base-300"></div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 print:overflow-visible print:p-0">
          <div className="max-w-7xl mx-auto w-full print:max-w-none">
            {children}
          </div>
        </div>
      </main>
      
      <GlobalSearch />
      <OnboardingHints />
      <TourGuide />
    </div>
  );
}
