'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Settings, 
  Search,
  LogOut,
  ChevronRight,
  ChevronDown,
  Files,
  BrainCircuit,
  Activity,
  TrendingUp,
  Menu,
  Network,
  Users,
  GitBranch,
  Scale,
  Building2,
  ShieldAlert,
  Compass,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { logoutAction } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationDropdown = dynamic(() => import('@/components/NotificationDropdown'), { ssr: false });
const GlobalSearch = dynamic(() => import('@/components/GlobalSearch').then(mod => mod.GlobalSearch), { ssr: false });
const OnboardingHints = dynamic(() => import('@/components/onboarding').then(mod => mod.OnboardingHints), { ssr: false });
const TourGuide = dynamic(() => import('@/components/TourGuide'), { ssr: false });
const ThemeToggle = dynamic(() => import('@/components/ThemeToggle').then(mod => mod.ThemeToggle), { ssr: false });

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

type MenuSection = {
  title: string;
  items: MenuItem[];
};

const sidebarSections: MenuSection[] = [
  {
    title: 'COMMAND CENTER',
    items: [
      { name: 'Executive Overview', href: '/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    title: 'AI & EXECUTIVE SUITE',
    items: [
      { 
        name: 'AI Intelligence', 
        icon: Sparkles,
        children: [
          { name: 'AI Boardroom', href: '/dashboard/boardroom' },
          { name: 'Digital Twin OS', href: '/dashboard/digital-twin' },
          { name: 'Strategy Studio', href: '/dashboard/strategy' },
          { name: 'Enterprise Assistant', href: '/dashboard/assistant' },
          { name: 'AI Workflows', href: '/dashboard/workspace' },
        ]
      },
    ]
  },
  {
    title: 'GOVERNANCE & RISK',
    items: [
      {
        name: 'Risk & Decisions',
        icon: ShieldAlert,
        children: [
          { name: 'Risk Center', href: '/dashboard/risk-center' },
          { name: 'Decision Memory', href: '/dashboard/decisions' },
          { name: 'Simulation Engine', href: '/dashboard/simulations' },
          { name: 'Memory Graph', href: '/dashboard/graph' },
        ]
      }
    ]
  },
  {
    title: 'OPERATIONS',
    items: [
      { 
        name: 'Projects & Tasks', 
        icon: FolderKanban,
        children: [
          { name: 'All Projects', href: '/dashboard/projects' },
          { name: 'Requirements Matrix', href: '/dashboard/requirements' },
          { name: 'Meetings', href: '/dashboard/meetings' },
          { name: 'Org Timeline', href: '/dashboard/timeline' },
        ]
      },
      { 
        name: 'Documents & Knowledge', 
        icon: Files,
        children: [
          { name: 'Library', href: '/dashboard/documents' },
          { name: 'Export History', href: '/dashboard/exports' },
        ]
      },
      { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
    ]
  },
  {
    title: 'ADMINISTRATION',
    items: [
      { 
        name: 'System Admin', 
        icon: Settings,
        children: [
          { name: 'Developer & API', href: '/dashboard/developer' },
          { name: 'Audit Logs', href: '/dashboard/audit' },
        ]
      },
    ]
  }
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
            className="overflow-hidden before:bg-base-300 pl-4 border-l border-base-300/40 my-1 space-y-1"
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
          <div className="flex items-center gap-3 mb-6 px-2 mt-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold aura-purple border border-primary/50">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight leading-none uppercase">Synaps</span>
              <span className="text-[10px] text-muted-foreground tracking-widest uppercase">Workspace</span>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="space-y-5">
            {sidebarSections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60">
                  {section.title}
                </h3>
                <ul className="menu w-full px-0 space-y-1">
                  {section.items.map((item) => (
                    <SidebarItem 
                      key={item.name} 
                      item={item} 
                      pathname={pathname} 
                      closeMobileMenu={() => setIsMobileMenuOpen(false)} 
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="space-y-4 mt-8 pt-4 border-t border-border/50">
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
        {/* Top Navigation Bar */}
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
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-muted-foreground bg-muted/50 border border-input rounded-lg hover:bg-muted transition-colors"
            >
              <span className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search anything...
              </span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <NotificationDropdown />
            
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-md">
              {user.id.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          {children}
        </div>
      </main>

      {/* Global Modals & Hints */}
      <GlobalSearch />
      <OnboardingHints />
      <TourGuide />
    </div>
  );
}
