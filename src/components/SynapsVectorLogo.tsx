'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SynapsVectorLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'icon' | 'full';
  animated?: boolean;
}

export function SynapsVectorLogo({
  className = '',
  size = 'md',
  variant = 'full',
  animated = true,
}: SynapsVectorLogoProps) {
  const sizeMap = {
    sm: variant === 'icon' ? 'w-8 h-8' : 'w-36 h-9',
    md: variant === 'icon' ? 'w-10 h-10' : 'w-48 h-12',
    lg: variant === 'icon' ? 'w-14 h-14' : 'w-64 h-16',
    xl: variant === 'icon' ? 'w-20 h-20' : 'w-80 h-20',
  };

  if (variant === 'icon') {
    return (
      <div className={cn('relative inline-flex items-center justify-center', sizeMap[size], className)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 120 120"
          className="w-full h-full overflow-visible"
          fill="none"
        >
          <defs>
            <linearGradient id="reactSynapsPrimary" x1="10%" y1="10%" x2="90%" y2="90%">
              <stop offset="0%" stopColor="#00F2FE" />
              <stop offset="50%" stopColor="#0088FF" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            <linearGradient id="reactSynapsSecondary" x1="90%" y1="10%" x2="10%" y2="90%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="60%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            <filter id="reactSynapsGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <g id="synaps-icon-mark">
            {/* Lower Synapse Loop */}
            <path
              d="M 60,60 C 42,60 30,72 30,86 C 30,98 40,106 54,106 C 72,106 90,92 90,72 C 90,56 76,46 60,46"
              stroke="url(#reactSynapsSecondary)"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={animated ? 'transition-all duration-700 hover:opacity-80' : ''}
            />

            {/* Upper Synapse Loop */}
            <path
              d="M 60,60 C 78,60 90,48 90,34 C 90,22 80,14 66,14 C 48,14 30,28 30,48 C 30,64 44,74 60,74"
              stroke="url(#reactSynapsPrimary)"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#reactSynapsGlow)"
              className={animated ? 'transition-all duration-700 hover:brightness-125' : ''}
            />

            {/* Central Nexus Bridge */}
            <path
              d="M 46,68 Q 60,60 74,52"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* Anchor Neural Nodes */}
            <circle
              cx="66"
              cy="14"
              r="4.5"
              fill="#FFFFFF"
              stroke="#00F2FE"
              strokeWidth="2.5"
              className={animated ? 'animate-pulse' : ''}
            />
            <circle
              cx="60"
              cy="60"
              r="5"
              fill="#00F2FE"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              className={animated ? 'animate-ping opacity-75' : ''}
            />
            <circle
              cx="54"
              cy="106"
              r="4.5"
              fill="#10B981"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              className={animated ? 'animate-pulse' : ''}
            />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div className={cn('relative inline-flex items-center', sizeMap[size], className)}>
      <img
        src="/synaps-logo-full.svg"
        alt="Synaps AI"
        className="w-full h-full object-contain"
      />
    </div>
  );
}

export default SynapsVectorLogo;
