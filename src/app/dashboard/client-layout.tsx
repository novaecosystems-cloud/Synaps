'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Settings, 
  Search,
  Globe,
  LogOut,
  ChevronRight,
  ChevronDown,
  Files,
  Activity,
  TrendingUp,
  Menu,
  ShieldAlert,
  Sparkles,
  ShieldCheck,
  Zap,
  Trophy,
  Laptop
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { logoutAction } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import MultiStepPaywallModal from '@/components/MultiStepPaywallModal';
import LaunchPromoModal from '@/components/LaunchPromoModal';
import SynapsWrappedModal from '@/components/SynapsWrappedModal';
import DownloadDesktopModal from '@/components/DownloadDesktopModal';
import { BackgroundTaskProvider } from '@/context/BackgroundTaskContext';
import { SynapsVectorLogo } from '@/components/SynapsVectorLogo';

const MasterExportButton = dynamic(() => import('@/components/MasterExportButton'), { ssr: false });
const BackgroundTaskWidget = dynamic(() => import('@/components/BackgroundTaskWidget'), { ssr: false });

const NotificationDropdown = dynamic(() => import('@/components/NotificationDropdown'), { ssr: false });
const GlobalSearch = dynamic(() => import('@/components/GlobalSearch').then(mod => mod.GlobalSearch), { ssr: false });
const OnboardingHints = dynamic(() => import('@/components/onboarding').then(mod => mod.OnboardingHints), { ssr: false });
const TourGuide = dynamic(() => import('@/components/TourGuide'), { ssr: false });
const OrganizationModal = dynamic(() => import('@/components/OrganizationModal'), { ssr: false });
const FirstTimeOnboarding = dynamic(() => import('@/components/FirstTimeOnboarding'), { ssr: false });
const AiCreditBadge = dynamic(() => import('@/components/AiCreditBadge'), { ssr: false });
const AiCreditExhaustedModal = dynamic(() => import('@/components/AiCreditExhaustedModal'), { ssr: false });
const DemoHeaderBadge = dynamic(() => import('@/components/DemoHeaderBadge'), { ssr: false });

const PlanAccessGate = dynamic(() => import('@/components/PlanAccessGate'), { ssr: false });

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
    title: 'COMMAND CENTER',
    items: [
      { name: 'Executive Overview', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Web Search & AI Chat', href: '/dashboard/chat', icon: Globe },
    ]
  },
  {
    title: 'AI & EXECUTIVE SUITE',
    items: [
      { 
        name: 'AI Intelligence', 
        icon: Sparkles,
        children: [
          { name: 'AI Chat & Web Search', href: '/dashboard/chat' },
          { name: 'Mission Control', href: '/dashboard/mission-control' },
          { name: 'Chief of Staff', href: '/dashboard/chief-of-staff' },
          { name: 'AI Boardroom', href: '/dashboard/boardroom', badge: 'PRO' },
          { name: 'Digital Twin OS', href: '/dashboard/digital-twin', badge: 'MAX' },
          { name: 'Strategy Studio', href: '/dashboard/strategy', badge: 'PRO' },
          { name: 'Chart Studio (ARLM)', href: '/dashboard/charts', badge: 'PRO' },
          { name: 'Matter Notebooks & Audio', href: '/dashboard/notebooks', badge: 'PRO' },
          { name: 'Playbook to Skill (24x RAG)', href: '/dashboard/skills', badge: 'PRO' },
          { name: 'Cowork & MCP Den', href: '/dashboard/cowork', badge: 'PRO' },
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
          { name: 'Risk Center', href: '/dashboard/risk-center', badge: 'MAX' },
          { name: 'Decision Memory', href: '/dashboard/decisions' },
          { name: 'Simulation Engine', href: '/dashboard/simulations', badge: 'MAX' },
          { name: 'Memory Graph', href: '/dashboard/graph', badge: 'PRO' },
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
      { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp, badge: 'PRO' },
    ]
  },
  {
    title: 'ADMINISTRATION',
    items: [
      { 
        name: 'System Admin', 
        icon: Settings,
        children: [
          { name: 'Plans & Billing', href: '/dashboard/settings/billing' },
          { name: 'Developer & API', href: '/dashboard/developer' },
          { name: 'Public APIs Hub', href: '/dashboard/integrations' },
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
  const [isPaywallModalOpen, setIsPaywallModalOpen] = useState(false);
  const [isWrappedModalOpen, setIsWrappedModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAction();
    router.push('/login');
  };

  // PRO & MAX Feature Access Gate — server-side isPremium flag (NOT localStorage)
  // SECURITY FIX: localStorage is trivially clearable in DevTools/Incognito.
  // We now rely on the server-verified user.isPremium flag and user.role from the DB session.
  useEffect(() => {
    const PRO_MAX_ROUTES = [
      '/dashboard/boardroom',
      '/dashboard/digital-twin',
      '/dashboard/simulations',
      '/dashboard/strategy',
      '/dashboard/graph',
      '/dashboard/risk-center'
    ];

    const isGuest = user?.email?.includes('guest') || user?.email?.includes('demo') || user?.email?.includes('apex');
    const isProMaxRoute = PRO_MAX_ROUTES.some(r => pathname.startsWith(r));

    // Only block guests on PRO/MAX routes. Paying users (isPremium) always pass.
    if (isGuest && isProMaxRoute && !user?.isPremium) {
      // Server-validated: isPremium comes from DB session, not localStorage
      setIsPaywallModalOpen(true);
    }
  }, [pathname, user?.email, user?.isPremium]);

  return (
    <BackgroundTaskProvider>
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

            {/* Search Button (Adapts to Mobile 9:16) */}
            <div className="relative flex-1 md:w-80 lg:w-96 tour-search">
              <button 
                onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
                className="w-full flex items-center justify-between px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-muted-foreground bg-muted/50 border border-input rounded-lg hover:bg-muted transition-colors"
              >
                <span className="flex items-center gap-1.5 sm:gap-2 truncate">
                  <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">Search...</span>
                </span>
                <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </button>
            </div>
          </div>

          {/* Top Actions (Responsive 9:16 Action Bar) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 max-w-full overflow-x-auto scrollbar-none">
            
            {/* Background Task Indicator Widget */}
            <BackgroundTaskWidget />

            {/* Master Export Reports Dropdown */}
            <MasterExportButton />

            {/* Desktop App Download Button */}
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 font-bold text-[11px] sm:text-xs flex items-center gap-1.5 transition-all hover:scale-[1.03]"
              title="Download Native Desktop App for Windows, macOS & Linux"
            >
              <Laptop className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="hidden sm:inline">Desktop App</span>
            </button>
            
            {/* Spotify-Wrapped Style Executive Progress Card Button */}
            <button
              onClick={() => setIsWrappedModalOpen(true)}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 font-extrabold text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-1 transition-all hover:scale-[1.03]"
              title="View & Share Spotify-Wrapped Executive Progress Card"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden xs:inline">Wrapped</span>
            </button>

            <DemoHeaderBadge />
            <AiCreditBadge onOpenPaywall={() => setIsPaywallModalOpen(true)} />
            <ThemeToggle />
            <NotificationDropdown userId={user?.id} organizationId={user?.organizationId} />
            
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-xs sm:text-sm shadow-md shrink-0">
              {(user?.id || 'US').slice(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content (Scrollable for 9:16 Vertical Mobile Screens) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 custom-scrollbar">
          <PlanAccessGate>{children}</PlanAccessGate>
        </div>
      </main>

      {/* Global Modals & Hints */}
      <GlobalSearch />
      <LaunchPromoModal userPlan={user?.isPremium ? 'max' : 'free'} />
      <MultiStepPaywallModal 
        isOpen={isPaywallModalOpen} 
        onClose={() => setIsPaywallModalOpen(false)} 
        initialStep={2}
      />
      <SynapsWrappedModal
        isOpen={isWrappedModalOpen}
        onClose={() => setIsWrappedModalOpen(false)}
      />
      <DownloadDesktopModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
      {pathname !== '/demo' && (
        <>
          <OnboardingHints />
          <TourGuide />
          <OrganizationModal isOpen={isOrgModalOpen} onClose={() => setIsOrgModalOpen(false)} />
          <FirstTimeOnboarding />
          <AiCreditExhaustedModal />
        </>
      )}
    </div>
    </BackgroundTaskProvider>
  );
}
