'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Bot, Sparkles } from 'lucide-react';

export type PresenceStatus = 'online' | 'busy' | 'away' | 'offline' | 'ai_twin';

export interface UserPresenceAvatarProps {
  name: string;
  role?: string;
  avatarUrl?: string;
  status?: PresenceStatus;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  isAi?: boolean;
  activeContext?: string;
}

export function UserPresenceAvatar({
  name,
  role,
  avatarUrl,
  status = 'online',
  size = 'md',
  className,
  isAi = false,
  activeContext,
}: UserPresenceAvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const sizeClasses = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-7 w-7 text-xs',
    md: 'h-8 w-8 text-xs',
    lg: 'h-10 w-10 text-sm font-bold',
  }[size];

  const dotSizeClasses = {
    xs: 'h-1.5 w-1.5 ring-1',
    sm: 'h-2 w-2 ring-1.5',
    md: 'h-2.5 w-2.5 ring-2',
    lg: 'h-3 w-3 ring-2',
  }[size];

  const statusColors = {
    online: 'bg-emerald-400',
    busy: 'bg-rose-500',
    away: 'bg-amber-400',
    offline: 'bg-zinc-500',
    ai_twin: 'bg-indigo-400',
  }[status];

  return (
    <div className={cn('relative inline-flex shrink-0 group select-none', className)}>
      {/* Avatar Box */}
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-bold font-mono transition-transform duration-200 group-hover:scale-110 shadow-md ring-2 ring-zinc-900 overflow-hidden',
          isAi
            ? 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white'
            : 'bg-gradient-to-tr from-zinc-800 to-zinc-700 text-zinc-200 border border-zinc-700/50',
          sizeClasses
        )}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} width={40} height={40} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        ) : isAi ? (
          <Bot className="w-3.5 h-3.5" />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {/* Presence Status Dot */}
      <span
        className={cn(
          'absolute bottom-0 right-0 rounded-full ring-zinc-950',
          statusColors,
          dotSizeClasses,
          status === 'online' || status === 'ai_twin' ? 'animate-pulse' : ''
        )}
      />

      {/* Hover Tooltip Details */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-50 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-zinc-950 border border-zinc-800 text-white text-[11px] rounded-lg px-2.5 py-1.5 shadow-2xl whitespace-nowrap flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 font-bold">
            {isAi && <Sparkles className="w-3 h-3 text-indigo-400" />}
            <span>{name}</span>
          </div>
          {role && <span className="text-[10px] text-zinc-400 font-mono">{role}</span>}
          {activeContext && (
            <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              {activeContext}
            </span>
          )}
        </div>
        <div className="w-2 h-2 bg-zinc-950 border-r border-b border-zinc-800 rotate-45 -mt-1" />
      </div>
    </div>
  );
}

export default UserPresenceAvatar;
