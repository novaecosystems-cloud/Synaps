'use client';

import React, { useState } from 'react';
import { 
  FolderKanban, 
  Scale, 
  BarChart3, 
  FileText, 
  Users, 
  Search, 
  Plus, 
  Clock, 
  CheckCircle2, 
  ChevronDown, 
  ShieldCheck,
  Sparkles,
  Zap,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface StrategicMatter {
  id: string;
  title: string;
  type: string;
  status: 'Active' | 'Review' | 'Closed';
  assignee: {
    name: string;
    role: string;
    avatar: string;
  };
  due: string;
}

const CAUSARIX_MATTERS: StrategicMatter[] = [
  {
    id: 'CSX-1042',
    title: 'Cloud Infrastructure Vendor Liability & SLA Indemnity',
    type: 'Commercial Contract',
    status: 'Active',
    assignee: {
      name: 'General Counsel',
      role: 'Legal & DGCL § 141',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    due: 'Jun 12'
  },
  {
    id: 'CSX-1039',
    title: 'Series-B Capital Allocation & Cash Runway Counterfactual',
    type: 'SCM Monte Carlo',
    status: 'Review',
    assignee: {
      name: 'Chief Financial Officer',
      role: 'EBITDA & Runway',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    due: 'Jun 15'
  },
  {
    id: 'CSX-1035',
    title: 'Cross-Border IP Licensing & DPDP Act Compliance',
    type: 'Regulatory & IP',
    status: 'Active',
    assignee: {
      name: 'Chief Compliance Officer',
      role: 'Regulatory & Privacy',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    due: 'Jun 20'
  },
  {
    id: 'CSX-1028',
    title: 'Supplier Supply Chain Shock & M&A Due Diligence',
    type: 'M&A / Supply Chain',
    status: 'Closed',
    assignee: {
      name: 'Chief Operating Officer',
      role: 'Operations & SLAs',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    due: 'May 30'
  },
  {
    id: 'CSX-1021',
    title: 'Zero-Leak AI Firewall & Cryptographic Merkle Audit',
    type: 'Cybersecurity',
    status: 'Active',
    assignee: {
      name: 'Chief Technology Officer',
      role: 'Architecture & WAF',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    due: 'Jul 2'
  }
];

const CAUSARIX_ACTIVITIES = [
  {
    id: '1',
    title: '10-Agent Boardroom: Quorum consensus reached on Vendor SLA Liability',
    time: '5 min ago',
    icon: Users,
    iconColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/50'
  },
  {
    id: '2',
    title: 'SCM Simulation: Counterfactual P(EBITDA | do(Price=-15%)) completed',
    time: '22 min ago',
    icon: Sparkles,
    iconColor: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/50'
  },
  {
    id: '3',
    title: 'Delaware DGCL § 141 SHA-256 Merkle Proof generated & signed',
    time: '1 hr ago',
    icon: ShieldCheck,
    iconColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50'
  },
  {
    id: '4',
    title: 'AI Application Firewall: Egress secret scrubbing verified 0 leaks',
    time: '2 hr ago',
    icon: Lock,
    iconColor: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50'
  },
  {
    id: '5',
    title: 'Vexa Meeting Scribe: Boardroom audio ingested & remote cloud copy purged',
    time: '3 hr ago',
    icon: Clock,
    iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
  }
];

const EXECUTIVE_DIGITAL_TWINS = [
  {
    name: 'General Counsel',
    role: 'Legal & Delaware DGCL § 141',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    online: true
  },
  {
    name: 'Chief Financial Officer (CFO)',
    role: 'EBITDA & SCM Runway',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    online: true
  },
  {
    name: 'Chief Technology Officer (CTO)',
    role: 'Architecture & AI-WAF',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    online: true
  },
  {
    name: 'Chief Operating Officer (COO)',
    role: 'Operations & Vendor SLAs',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    online: true
  }
];

export function CausarixExecutiveMatterCockpit({ userName = 'Shourya Shetty' }: { userName?: string }) {
  const [filterType, setFilterType] = useState('All types');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMatters = CAUSARIX_MATTERS.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col xl:flex-row gap-6 font-sans text-slate-900 dark:text-slate-100 select-none">
      
      {/* ─── MAIN WORKSPACE COLUMN ────────────────────────────────────────── */}
      <div className="flex-1 space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0D111A] border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-400 tracking-wider uppercase">
                MONDAY, 31 AUGUST 2026
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                DGCL § 141 Safe Harbor Active
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              Welcome back, {userName}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search strategic matters, decisions..."
                className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-56 sm:w-64 transition-all"
              />
            </div>

            {/* + New Matter Button */}
            <Link 
              href="/dashboard/boardroom"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Strategic Matter</span>
            </Link>
          </div>
        </div>

        {/* 4 KPI Top Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Open Strategic Matters */}
          <div className="bg-white dark:bg-[#0D111A] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Strategic Matters</p>
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <FolderKanban className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">24</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">3 due this week</p>
          </div>

          {/* 2. Boardroom Quorum */}
          <div className="bg-white dark:bg-[#0D111A] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Boardroom Quorum</p>
              <div className="w-7 h-7 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">7</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">2 need quorum attention</p>
          </div>

          {/* 3. C-Suite Digital Twins */}
          <div className="bg-white dark:bg-[#0D111A] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">C-Suite Twins</p>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">10</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">10 active domain twins</p>
          </div>

          {/* 4. Resolved & Signed (30D) */}
          <div className="bg-white dark:bg-[#0D111A] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">DGCL § 141 Seals</p>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">18</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">+4 vs last month</p>
          </div>
        </div>

        {/* Recent Strategic Matters Table */}
        <div className="bg-white dark:bg-[#0D111A] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4">
          
          {/* Table Header Controls */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Strategic Matters & Evidentiary Vaults</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Verified under Delaware Chancery Court statutory fiduciary standard</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300">
                <span>{filterType}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <Link href="/dashboard/documents" className="text-xs font-semibold text-blue-600 hover:text-blue-700">View all</Link>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">Matter ID</th>
                  <th className="pb-3 px-3">Matter / Agreement Title</th>
                  <th className="pb-3 px-3">Domain Type</th>
                  <th className="pb-3 px-3">Quorum Status</th>
                  <th className="pb-3 px-3">Assignee Twin</th>
                  <th className="pb-3 px-3 text-right">Target Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {filteredMatters.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-500 dark:text-slate-400">{item.id}</td>
                    <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">
                      <Link href="/dashboard/boardroom" className="hover:text-blue-600 transition-colors">
                        {item.title}
                      </Link>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 font-medium">{item.type}</td>
                    <td className="py-3.5 px-3">
                      <span className={cn(
                        "px-2.5 py-1 rounded-md text-[11px] font-semibold border",
                        item.status === 'Active' && "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60",
                        item.status === 'Review' && "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60",
                        item.status === 'Closed' && "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                      )}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <img 
                          src={item.assignee.avatar} 
                          alt={item.assignee.name} 
                          title={`${item.assignee.name} (${item.assignee.role})`}
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <span className="text-slate-700 dark:text-slate-300 font-medium text-[11px]">{item.assignee.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right font-medium text-slate-500 dark:text-slate-400">{item.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Row: 2 Analytics Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Resolution Rate */}
          <div className="bg-white dark:bg-[#0D111A] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Quorum Consensus Rate</p>
                <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 rounded-md text-[11px] font-semibold">
                  +12% vs last quarter
                </span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">94%</p>
            </div>

            {/* Bar Indicators */}
            <div className="flex items-end gap-2 h-10 mt-4">
              <div className="w-12 h-4 bg-slate-100 dark:bg-slate-800 rounded-md" />
              <div className="w-12 h-6 bg-slate-100 dark:bg-slate-800 rounded-md" />
              <div className="w-12 h-8 bg-slate-100 dark:bg-slate-800 rounded-md" />
              <div className="w-12 h-6 bg-slate-100 dark:bg-slate-800 rounded-md" />
              <div className="w-12 h-10 bg-blue-600 rounded-md" />
              <div className="w-12 h-7 bg-slate-100 dark:bg-slate-800 rounded-md" />
            </div>
          </div>

          {/* SCM Math Drift */}
          <div className="bg-white dark:bg-[#0D111A] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">SCM Arithmetic Drift</p>
                <span className="px-2 py-0.5 bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-400 border border-cyan-200/60 dark:border-cyan-800/60 rounded-md text-[11px] font-semibold">
                  Box-Muller 10,000 Verified
                </span>
              </div>
              <p className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 tracking-tight">0.00% Drift</p>
            </div>

            {/* Bar Indicators */}
            <div className="flex items-end gap-2 h-10 mt-4">
              <div className="w-12 h-5 bg-slate-100 dark:bg-slate-800 rounded-md" />
              <div className="w-12 h-7 bg-slate-100 dark:bg-slate-800 rounded-md" />
              <div className="w-12 h-5 bg-slate-100 dark:bg-slate-800 rounded-md" />
              <div className="w-12 h-6 bg-slate-100 dark:bg-slate-800 rounded-md" />
              <div className="w-12 h-10 bg-cyan-500 rounded-md" />
              <div className="w-12 h-8 bg-slate-100 dark:bg-slate-800 rounded-md" />
            </div>
          </div>
        </div>

      </div>

      {/* ─── RIGHT PANEL: ACTIVITY & C-SUITE TWINS ───────────────────────── */}
      <aside className="w-full xl:w-80 flex-shrink-0 bg-white dark:bg-[#0D111A] border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between space-y-8 shadow-sm">
        <div className="space-y-8">
          
          {/* Activity Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Executive Activity Stream</h3>
            <div className="space-y-4">
              {CAUSARIX_ACTIVITIES.map((act) => {
                const IconComponent = act.icon;
                return (
                  <div key={act.id} className="flex items-start gap-3">
                    <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", act.iconColor)}>
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">{act.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{act.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* C-Suite Digital Twins Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">C-Suite Digital Twins</h3>
              <Link href="/dashboard/boardroom" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Boardroom</Link>
            </div>
            
            <div className="space-y-3">
              {EXECUTIVE_DIGITAL_TWINS.map((member) => (
                <div key={member.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{member.name}</p>
                      <p className="text-[11px] text-slate-400">{member.role}</p>
                    </div>
                  </div>
                  {member.online && (
                    <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50 dark:ring-emerald-950" />
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
