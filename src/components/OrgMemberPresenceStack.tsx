'use client';

import { useState } from 'react';
import { UserPresenceAvatar, PresenceStatus } from '@/components/ui/UserPresenceAvatar';
import { Users, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface OrgMember {
  id: string;
  name: string;
  role: string;
  status: PresenceStatus;
  isAi?: boolean;
  avatarUrl?: string;
  activeContext?: string;
}

const DEFAULT_ORG_MEMBERS: OrgMember[] = [
  {
    id: 'mem_1',
    name: 'Shourya (Owner)',
    role: 'Founder & CEO',
    status: 'online',
    activeContext: 'Viewing Causal Studio'
  },
  {
    id: 'ai_gc',
    name: 'General Counsel Twin',
    role: 'Autonomous Legal AI',
    status: 'ai_twin',
    isAi: true,
    activeContext: 'Auditing Delaware Redlines'
  },
  {
    id: 'ai_cfo',
    name: 'CFO Digital Twin',
    role: 'Autonomous Finance AI',
    status: 'ai_twin',
    isAi: true,
    activeContext: 'Cash Runway Modeling'
  },
  {
    id: 'mem_2',
    name: 'Elena Rostova',
    role: 'VP Legal Operations',
    status: 'busy',
    activeContext: 'Contract Review Room'
  },
  {
    id: 'mem_3',
    name: 'Marcus Vance',
    role: 'Head of Infrastructure',
    status: 'away',
    activeContext: 'Cloud Topology Sync'
  }
];

export interface OrgMemberPresenceStackProps {
  members?: OrgMember[];
  maxVisible?: number;
  className?: string;
}

export function OrgMemberPresenceStack({
  members = DEFAULT_ORG_MEMBERS,
  maxVisible = 4,
  className,
}: OrgMemberPresenceStackProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const visibleMembers = members.slice(0, maxVisible);
  const hiddenCount = Math.max(0, members.length - maxVisible);

  return (
    <>
      {/* ── AVATAR STACK TRIGGER ────────────────────────────────────────────── */}
      <div 
        onClick={() => setIsDetailOpen(true)}
        className={cn("flex items-center -space-x-2 cursor-pointer hover:opacity-95 transition-all p-1 rounded-full hover:bg-white/5", className)}
        title="View Active Organization Members & AI Twins"
      >
        {visibleMembers.map((member) => (
          <UserPresenceAvatar
            key={member.id}
            name={member.name}
            role={member.role}
            status={member.status}
            isAi={member.isAi}
            avatarUrl={member.avatarUrl}
            activeContext={member.activeContext}
            size="sm"
            className="hover:z-30"
          />
        ))}

        {hiddenCount > 0 && (
          <div className="h-7 w-7 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-[10px] font-mono font-bold text-zinc-300 shadow-md hover:bg-zinc-700 transition-colors z-10">
            +{hiddenCount}
          </div>
        )}
      </div>

      {/* ── EXPANDED ORG PRESENCE MODAL ────────────────────────────────────── */}
      <AnimatePresence>
        {isDetailOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0f0f11] border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-white font-sans"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Active Organization Presence ({members.length})
                  </h3>
                </div>
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Members List */}
              <div className="p-4 divide-y divide-zinc-800/60 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {members.map((m) => (
                  <div key={m.id} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <UserPresenceAvatar
                        name={m.name}
                        role={m.role}
                        status={m.status}
                        isAi={m.isAi}
                        avatarUrl={m.avatarUrl}
                        size="md"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                          <span>{m.name}</span>
                          {m.isAi && (
                            <span className="badge badge-primary badge-xs font-mono text-[9px]">
                              AI TWIN
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-400 block mt-0.5">
                          {m.role}
                        </span>
                      </div>
                    </div>

                    {m.activeContext && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {m.activeContext}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default OrgMemberPresenceStack;
