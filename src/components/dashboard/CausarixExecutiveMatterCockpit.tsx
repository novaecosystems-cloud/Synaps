'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Bell, 
  FolderKanban, 
  Scale, 
  MessageSquare, 
  BarChart3, 
  FileText, 
  Users, 
  Settings, 
  Search, 
  Plus, 
  Clock, 
  CheckCircle2, 
  ChevronDown, 
  ArrowUpRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface CaseMatter {
  id: string;
  title: string;
  type: string;
  status: 'Active' | 'Review' | 'Closed';
  assignee: {
    name: string;
    avatar: string;
    role: string;
  };
  due: string;
}

const SAMPLE_CASES: CaseMatter[] = [
  {
    id: 'C-1042',
    title: 'Mercer v. Atlas Corp',
    type: 'Commercial Dispute',
    status: 'Active',
    assignee: {
      name: 'Sarah Miller',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'General Counsel'
    },
    due: 'Jun 12'
  },
  {
    id: 'C-1039',
    title: 'Holloway Estate Trust',
    type: 'Probate & Governance',
    status: 'Review',
    assignee: {
      name: 'Marcus Webb',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Associate'
    },
    due: 'Jun 15'
  },
  {
    id: 'C-1035',
    title: 'Delphi Tech IP Filing',
    type: 'Intellectual Property',
    status: 'Active',
    assignee: {
      name: 'Jordan Lee',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'Attorney'
    },
    due: 'Jun 20'
  },
  {
    id: 'C-1028',
    title: 'Vega Construction Ltd',
    type: 'Contract & Indemnity',
    status: 'Closed',
    assignee: {
      name: 'Priya Nair',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Paralegal'
    },
    due: 'May 30'
  },
  {
    id: 'C-1021',
    title: 'Northfield Data Breach',
    type: 'Regulatory & Privacy',
    status: 'Active',
    assignee: {
      name: 'Sarah Miller',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'General Counsel'
    },
    due: 'Jul 2'
  }
];

const ACTIVITIES = [
  {
    id: '1',
    title: 'New case opened: Delphi Tech IP Filing',
    time: '5 min ago',
    icon: FolderKanban,
    iconColor: 'text-blue-500 bg-blue-50'
  },
  {
    id: '2',
    title: 'Jordan Lee added to Mercer v. Atlas Corp',
    time: '22 min ago',
    icon: Users,
    iconColor: 'text-blue-600 bg-blue-50'
  },
  {
    id: '3',
    title: 'Report submitted for Vega Construction Ltd',
    time: '1 hr ago',
    icon: FileText,
    iconColor: 'text-emerald-500 bg-emerald-50'
  },
  {
    id: '4',
    title: 'AI Chat: research summary generated',
    time: '2 hr ago',
    icon: MessageSquare,
    iconColor: 'text-slate-500 bg-slate-50'
  },
  {
    id: '5',
    title: 'Hearing reminder: Holloway Estate, Jun 15',
    time: '3 hr ago',
    icon: Bell,
    iconColor: 'text-amber-500 bg-amber-50'
  }
];

const TEAM_MEMBERS = [
  {
    name: 'Sarah Miller',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    online: true
  },
  {
    name: 'Jordan Lee',
    role: 'Attorney',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    online: true
  },
  {
    name: 'Priya Nair',
    role: 'Paralegal',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    online: true
  },
  {
    name: 'Marcus Webb',
    role: 'Associate',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    online: true
  }
];

export function CausarixExecutiveMatterCockpit() {
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Cases' | 'Research' | 'Chat'>('Dashboard');
  const [filterType, setFilterType] = useState('All types');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-screen w-full bg-[#0C101A] text-slate-900 font-sans overflow-hidden select-none">
      
      {/* ─── LEFT SIDEBAR (DARK THEME #0C101A) ───────────────────────────── */}
      <aside className="w-60 flex-shrink-0 bg-[#0C101A] text-slate-300 flex flex-col justify-between p-4 border-r border-slate-800/60">
        <div className="space-y-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Scale className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Causarix</span>
          </div>

          {/* Section: CORE */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Core</p>
            <button 
              onClick={() => setActiveTab('Dashboard')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                activeTab === 'Dashboard' 
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40"
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <Link 
              href="/dashboard/notifications"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all"
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </Link>
          </div>

          {/* Section: WORK */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Work</p>
            <button 
              onClick={() => setActiveTab('Cases')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                activeTab === 'Cases' 
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40"
              )}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Cases & Matters</span>
            </button>
            <button 
              onClick={() => setActiveTab('Research')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                activeTab === 'Research' 
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40"
              )}
            >
              <Scale className="w-4 h-4" />
              <span>Legal Research</span>
            </button>
            <button 
              onClick={() => setActiveTab('Chat')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                activeTab === 'Chat' 
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40"
              )}
            >
              <MessageSquare className="w-4 h-4" />
              <span>AI Chat</span>
            </button>
          </div>

          {/* Section: INSIGHTS */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Insights</p>
            <Link 
              href="/dashboard/analytics"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </Link>
            <Link 
              href="/dashboard/documents"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Reports</span>
            </Link>
          </div>

          {/* Section: WORKSPACE */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Workspace</p>
            <Link 
              href="/dashboard/workspace"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Team</span>
            </Link>
            <Link 
              href="/dashboard/settings"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </div>
        </div>

        {/* User Profile */}
        <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" 
              alt="Sarah" 
              className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/30"
            />
            <div>
              <p className="text-sm font-semibold text-white leading-tight">Sarah</p>
              <p className="text-[11px] text-slate-400">Admin</p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </div>
      </aside>

      {/* ─── MAIN CONTENT CANVAS (#FAFAFA / #F8FAFC) ────────────────────── */}
      <main className="flex-1 bg-[#F8FAFC] flex flex-col overflow-y-auto">
        <div className="p-8 max-w-[1240px] w-full mx-auto space-y-6">
          
          {/* Top Header Bar */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">Monday, 9 June 2025</p>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, Sarah</h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cases, people"
                  className="pl-9 pr-4 py-2 bg-white border border-slate-200/80 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64 shadow-sm"
                />
              </div>

              {/* + New Case Button */}
              <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition-all">
                <Plus className="w-3.5 h-3.5" />
                <span>New Case</span>
              </button>

              {/* Notification Bell */}
              <button className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200/80 rounded-xl text-slate-600 hover:text-slate-900 shadow-sm transition-all">
                <Bell className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 4 KPI Top Cards */}
          <div className="grid grid-cols-4 gap-4">
            {/* 1. Open Cases */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Open Cases</p>
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <FolderKanban className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">24</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">3 due this week</p>
            </div>

            {/* 2. In Review */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">In Review</p>
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">7</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">2 need attention</p>
            </div>

            {/* 3. Team Members */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Team Members</p>
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">11</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">2 added recently</p>
            </div>

            {/* 4. Resolved (30D) */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Resolved (30D)</p>
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <BarChart3 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">18</p>
              <p className="text-xs text-emerald-600 mt-1 font-medium">+4 vs last month</p>
            </div>
          </div>

          {/* Main Workspace Grid (Table + Analytics) */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-4">
            
            {/* Table Header Controls */}
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-base font-bold text-slate-900">Recent Cases</h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-600 cursor-pointer">
                  <span>{filterType}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">View all</button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 px-3">ID</th>
                    <th className="pb-3 px-3">Case Title</th>
                    <th className="pb-3 px-3">Type</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3">Assignee</th>
                    <th className="pb-3 px-3 text-right">Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {SAMPLE_CASES.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-medium text-slate-500">{item.id}</td>
                      <td className="py-3.5 px-3 font-bold text-slate-900">{item.title}</td>
                      <td className="py-3.5 px-3 text-slate-500 font-medium">{item.type}</td>
                      <td className="py-3.5 px-3">
                        <span className={cn(
                          "px-2.5 py-1 rounded-md text-[11px] font-semibold border",
                          item.status === 'Active' && "bg-emerald-50 text-emerald-700 border-emerald-200",
                          item.status === 'Review' && "bg-amber-50 text-amber-700 border-amber-200",
                          item.status === 'Closed' && "bg-slate-100 text-slate-600 border-slate-200"
                        )}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <img 
                          src={item.assignee.avatar} 
                          alt={item.assignee.name} 
                          title={`${item.assignee.name} (${item.assignee.role})`}
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                        />
                      </td>
                      <td className="py-3.5 px-3 text-right font-medium text-slate-500">{item.due}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Row: 2 Analytics Widgets */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Resolution Rate */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Resolution Rate</p>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200/60 rounded-md text-[11px] font-semibold">
                    +12% vs last month
                  </span>
                </div>
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">91%</p>
              </div>

              {/* Bar Indicators */}
              <div className="flex items-end gap-2 h-10 mt-4">
                <div className="w-12 h-4 bg-slate-100 rounded-md" />
                <div className="w-12 h-6 bg-slate-100 rounded-md" />
                <div className="w-12 h-8 bg-slate-100 rounded-md" />
                <div className="w-12 h-6 bg-slate-100 rounded-md" />
                <div className="w-12 h-10 bg-blue-600 rounded-md" />
                <div className="w-12 h-7 bg-slate-100 rounded-md" />
              </div>
            </div>

            {/* Avg. Case Duration */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Avg. Case Duration</p>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200/60 rounded-md text-[11px] font-semibold">
                    -2d vs target
                  </span>
                </div>
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">18 days</p>
              </div>

              {/* Bar Indicators */}
              <div className="flex items-end gap-2 h-10 mt-4">
                <div className="w-12 h-5 bg-slate-100 rounded-md" />
                <div className="w-12 h-7 bg-slate-100 rounded-md" />
                <div className="w-12 h-5 bg-slate-100 rounded-md" />
                <div className="w-12 h-6 bg-slate-100 rounded-md" />
                <div className="w-12 h-10 bg-amber-500 rounded-md" />
                <div className="w-12 h-8 bg-slate-100 rounded-md" />
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ─── RIGHT PANEL: ACTIVITY & TEAM MEMBERS (#FFFFFF) ─────────────── */}
      <aside className="w-80 flex-shrink-0 bg-white border-l border-slate-200/80 flex flex-col justify-between p-6 overflow-y-auto">
        <div className="space-y-8">
          
          {/* Activity Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Activity</h3>
            <div className="space-y-4">
              {ACTIVITIES.map((act) => {
                const IconComponent = act.icon;
                return (
                  <div key={act.id} className="flex items-start gap-3">
                    <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", act.iconColor)}>
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800 leading-snug">{act.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{act.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team Members Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Team Members</h3>
              <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">Manage</button>
            </div>
            
            <div className="space-y-3">
              {TEAM_MEMBERS.map((member) => (
                <div key={member.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-100"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{member.name}</p>
                      <p className="text-[11px] text-slate-400">{member.role}</p>
                    </div>
                  </div>
                  {member.online && (
                    <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </aside>

    </div>
  );
}

export default CausarixExecutiveMatterCockpit;
