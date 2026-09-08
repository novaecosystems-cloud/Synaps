'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FolderKanban, Settings, Search, Globe, LogOut, ChevronRight, ChevronDown, Files, TrendingUp, Menu, ShieldAlert, Sparkles, ShieldCheck, Zap, Laptop } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { logoutAction } from '@/app/actions/auth';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import DashboardSkeleton from '@/components/DashboardSkeleton';
import { BackgroundTaskProvider } from '@/context/BackgroundTaskContext';
import { SynapsVectorLogo } from '@/components/SynapsVectorLogo';

const DownloadDesktopModal = dynamic(() => import('@/components/DownloadDesktopModal'), { ssr: false });
const CausarixGuidedTourModal = dynamic(() => import('@/components/CausarixGuidedTourModal'), { ssr: false });
const CausarixCinematicSplash = dynamic(() => import('@/components/CausarixCinematicSplash'), { ssr: false });
const GuestDemoRequestBanner = dynamic(() => import('@/components/GuestDemoRequestBanner'), { ssr: false });

const MasterExportButton = dynamic(() => import('@/components/MasterExportButton'), { ssr: false });
const BackgroundTaskWidget = dynamic(() => import('@/components/BackgroundTaskWidget'), { ssr: false });

const NotificationDropdown = dynamic(() => import('@/components/NotificationDropdown'), { ssr: false });
const GlobalSearch = dynamic(() => import('@/components/GlobalSearch').then(mod => mod.GlobalSearch), { ssr: false });
const OrganizationModal = dynamic(() => import('@/components/OrganizationModal'), { ssr: false });
const DailyWorkdayBriefModal = dynamic(() => import('@/components/DailyWorkdayBriefModal'), { ssr: false });

const PlanAccessGate = dynamic(() => import('@/components/PlanAccessGate'), { ssr: false });
const SovereignOfflineModeToggle = dynamic(() => import('@/components/SovereignOfflineModeToggle'), { ssr: false });

type SubMenuItem = {
  name: string;
  href: string;
  badge?: 'PRO' | 'MAX';
};

type MenuItem = {
  name: string;
  icon: React.ElementType;
  href?: string;
  badge?: 'PRO' | 'MAX';
  children?: SubMenuItem[];
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

const sidebarSections: MenuSection[] = [
  {
    title: 'COMMAND',
    items: [
      { name: 'Executive Overview', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Strategic Matters', href: '/dashboard/matters', icon: FolderKanban, badge: 'PRO' },
    ]
  },
  {
    title: 'DELIBERATION & AGI',
    items: [
      { name: 'AGI Executive Studio', href: '/dashboard/agi-studio', icon: Sparkles, badge: 'PRO' },
      { name: '10-Agent Boardroom', href: '/dashboard/boardroom', icon: ShieldCheck, badge: 'PRO' },
      { name: 'Digital Twin OS', href: '/dashboard/digital-twin', icon: Laptop, badge: 'MAX' },
      { name: 'Web Search & AI Chat', href: '/dashboard/chat', icon: Globe },
    ]
  },
  {
    title: 'SIMULATION & GOVERNANCE',
    items: [
      { name: 'Counterfactual SCM', href: '/dashboard/simulations', icon: TrendingUp, badge: 'MAX' },
      { name: 'DGCL § 141 Safe Harbor', href: '/dashboard/decisions', icon: ShieldAlert },
      { name: 'Decision Memory Graph', href: '/dashboard/graph', icon: Zap, badge: 'PRO' },
    ]
  },
  {
    title: 'OPERATIONS & SYNC',
    items: [
      { name: 'Projects & Tasks', href: '/dashboard/projects', icon: FolderKanban },
      { name: 'Document Library', href: '/dashboard/documents', icon: Files },
      { name: 'Integrations & Sync', href: '/dashboard/integrations', icon: Settings },
      { name: 'Plans & Billing', href: '/dashboard/settings/billing', icon: Settings },
    ]
  }
];

function SidebarItem({ item, pathname, closeMobileMenu }: { item: MenuItem, pathname: string, closeMobileMenu: () => void }) {
  const isDirectActive = item.href && (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)));
  const isChildActive = item.children?.some(child => pathname === child.href || pathname.startsWith(child.href));
  
  const [isOpen, setIsOpen] = useState(isChildActive);
  const Icon = item.icon as any;

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
            isDirectActive ? "active text-primary font-medium bg-primary/10" : "text-base-content/70 hover:text-base-content",
            "flex items-center justify-between"
          )}
        >
          <span className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {item.name}
          </span>
          {item.badge && (
            <span className={cn(
              "px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider",
              item.badge === 'PRO' ? "bg-amber-500/15 text-amber-500 border border-amber-500/30" : "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
            )}>
              {item.badge}
            </span>
          )}
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
                      childActive ? "active text-primary font-medium bg-primary/10" : "text-base-content/70 hover:text-base-content",
                      "flex items-center justify-between"
                    )}
                  >
                    <span>{child.name}</span>
                    {child.badge && (
                      <span className={cn(
                        "px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider shrink-0",
                        child.badge === 'PRO' ? "bg-amber-500/15 text-amber-500 border border-amber-500/30" : "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                      )}>
                        {child.badge}
                      </span>
                    )}
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

const ADMIN_EMAIL = 'novaecosystems@gmail.com';

export default function ClientLayout({ children, user }: { children: React.ReactNode, user: { id: string, organizationId: string, email: string, isPremium?: boolean } }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isDailyBriefOpen, setIsDailyBriefOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  // Splash screen: guard with sessionStorage to prevent repeatedly delaying web dashboard reloads
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const splashShown = sessionStorage.getItem('causarix_splash_shown');
        const isBypassed = localStorage.getItem('causarix_onboarding_completed') === 'true' ||
          window.location.search.includes('nosplash');

        if (!splashShown && !isBypassed) {
          sessionStorage.setItem('causarix_splash_shown', 'true');
          setShowSplash(true);
        } else {
          sessionStorage.setItem('causarix_splash_shown', 'true');
        }
      }
    } catch {
      // Ignore in restricted storage environments
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setShowSkeleton(true);
    setTimeout(() => {
      setShowSkeleton(false);
    }, 700);
  };

  const handleLogout = async () => {
    await logoutAction();
    router.push('/login');
  };

  // Global ESC / causarix-close-modals listener
  useEffect(() => {
    const handleCloseAll = () => {
      setIsMobileMenuOpen(false);
      setIsOrgModalOpen(false);
      setIsDownloadModalOpen(false);
      setIsDailyBriefOpen(false);
      setIsTourOpen(false);
    };

    window.addEventListener('causarix-close-modals', handleCloseAll);
    return () => window.removeEventListener('causarix-close-modals', handleCloseAll);
  }, []);

  return (
    <BackgroundTaskProvider>
      {showSplash && <CausarixCinematicSplash onComplete={handleSplashComplete} />}
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
        "tour-sidebar w-64 flex-shrink-0 border-r border-border bg-card flex-col justify-between p-4 print:hidden transition-transform duration-200 ease-in-out overflow-y-auto max-h-screen",
        "fixed inset-y-0 left-0 z-50 md:relative md:z-auto flex custom-scrollbar",
        isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
      )}>
        <div>
          {/* Logo & Org Switcher */}
          <button 
            onClick={() => setIsOrgModalOpen(true)}
            className="flex items-center gap-3 mb-6 px-2 mt-2 w-full hover:bg-base-200/60 p-2 rounded-2xl transition-all text-left border border-transparent hover:border-base-300 group"
            title="Open Organization Switcher & Member Management"
          >
            <SynapsVectorLogo variant="icon" size="sm" className="shrink-0" />
            <div className="flex flex-col flex-1">
              <span className="font-bold text-sm tracking-tight leading-none uppercase flex items-center justify-between">
                Synaps
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </span>
              <span className="text-[10px] text-muted-foreground tracking-widest uppercase mt-0.5">Org Workspace</span>
            </div>
          </button>

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

          {/* OWNER-ONLY: Admin Panel */}
          {user.email === ADMIN_EMAIL && (
            <div>
              <h3 className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-red-500/70">
                ⚡ OWNER ADMIN
              </h3>
              <ul className="menu w-full px-0 space-y-1">
                <li>
                  <Link
                    href="/dashboard/admin/upgrade"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      pathname === '/dashboard/admin/upgrade'
                        ? "active text-red-500 font-medium bg-red-500/10"
                        : "text-red-400/70 hover:text-red-400"
                    )}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Upgrade Users
                  </Link>
                </li>
              </ul>
            </div>
          )}
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
                  ? "bg-primary/5 text-primary glow-cyan font-semibold" 
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

      {/* Main Content Area (Responsive 9:16 Support) */}
      <main className="flex-1 flex flex-col overflow-hidden bg-muted/20 relative print:overflow-visible print:bg-white print:text-black">
        {/* Guest Demo 2-Request Limiter Banner */}
        <GuestDemoRequestBanner isGuest={user?.email?.includes('guest') || user?.email?.includes('demo') || user?.email?.includes('apex')} />

        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-base-300 bg-base-100 flex items-center justify-between px-3 sm:px-6 shrink-0 print:hidden gap-2 sm:gap-4 shadow-sm z-30">
          
          {/* Mobile Menu Toggle & Search */}
          <div className="flex items-center gap-2 flex-1 md:flex-none">
            <button 
              className="md:hidden btn btn-ghost btn-circle btn-sm p-1.5"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Mobile Menu"
            >
              <Menu className="h-5 w-5 text-base-content/70" />
            </button>

            {/* Search Button (Ultra-responsive for Mobile & Laptop) */}
            <div className="relative w-28 xs:w-36 sm:w-48 md:w-56 lg:w-64 shrink-0 tour-search">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('causarix-open-command-palette'))}
                className="w-full flex items-center justify-between px-2.5 sm:px-3 py-1.5 text-xs text-muted-foreground bg-muted/50 border border-input rounded-xl hover:bg-muted transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <Search className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Search...</span>
                </span>
                <kbd className="pointer-events-none hidden md:inline-flex h-4 select-none items-center gap-0.5 rounded border bg-background px-1 font-mono text-[9px] font-medium text-muted-foreground">
                  ⌘K
                </kbd>
              </button>
            </div>
          </div>

          {/* Top Actions (Clean, Non-Overflowing Header Bar) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 max-w-full">
            
            {/* 60-Second Interactive Guided Tour Button */}
            <button
              onClick={() => setIsTourOpen(true)}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 text-cyan-300 hover:text-white font-extrabold text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)] hover:scale-[1.03] cursor-pointer"
              title="60-Second Interactive Tour of Causarix OS"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="hidden md:inline">60s Tour</span>
            </button>

            {/* Sovereign Offline Mode / Cloud Gateway Toggle */}
            <SovereignOfflineModeToggle />

            {/* Background Task Indicator Widget */}
            <BackgroundTaskWidget />

            {/* Master Export Reports Dropdown */}
            <div className="hidden lg:block">
              <MasterExportButton />
            </div>

            {/* Daily Morning Workday Briefing Button */}
            <button
              onClick={() => setIsDailyBriefOpen(true)}
              className="px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 font-bold text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-1 transition-all hover:scale-[1.03] cursor-pointer"
              title="Open Today's Daily Workday Executive Brief"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-pulse" />
              <span className="hidden xl:inline">Daily Brief</span>
            </button>

            {/* Desktop App Download Button */}
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="hidden xl:flex px-2.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 font-bold text-xs items-center gap-1.5 transition-all hover:scale-[1.03] cursor-pointer"
              title="Download Native Desktop App for Windows, macOS & Linux"
            >
              <Laptop className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Desktop App</span>
            </button>

            <ThemeToggle />
            <NotificationDropdown userId={user?.id} organizationId={user?.organizationId} />
            
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-xs sm:text-sm shadow-md shrink-0">
              {(user?.id || 'US').slice(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content with Smooth Skeleton Transition */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 custom-scrollbar">
          {showSkeleton ? (
            <DashboardSkeleton />
          ) : (
            <PlanAccessGate>{children}</PlanAccessGate>
          )}
        </div>
      </main>

      {/* Modals triggered exclusively on explicit user interaction */}
      <GlobalSearch />
      <CausarixGuidedTourModal isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
      <DailyWorkdayBriefModal 
        isOpenOverride={isDailyBriefOpen} 
        onCloseOverride={() => setIsDailyBriefOpen(false)} 
      />
      <DownloadDesktopModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
      <OrganizationModal isOpen={isOrgModalOpen} onClose={() => setIsOrgModalOpen(false)} />
    </div>
    </BackgroundTaskProvider>
  );
}
