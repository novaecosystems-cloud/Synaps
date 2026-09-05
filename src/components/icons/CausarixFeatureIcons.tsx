import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  variant?: 'monochrome' | 'vibrant' | 'glowing' | 'badge';
  accentColor?: string;
}

// Reusable SVG wrapper with enhanced visibility and Koboyo hand-crafted organic vector styling
const BaseIcon: React.FC<{
  size?: number | string;
  className?: string;
  children: React.ReactNode;
  viewBox?: string;
} & React.SVGProps<SVGSVGElement>> = ({
  size = 24,
  className = '',
  children,
  viewBox = '0 0 24 24',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox={viewBox}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block transition-transform duration-200 ease-out select-none ${className}`}
    {...props}
  >
    {children}
  </svg>
);

/* -------------------------------------------------------------------------- */
/*                           1. COMMAND CENTER & OVERVIEW                     */
/* -------------------------------------------------------------------------- */
export const ExecutiveOverviewIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-indigo-500 hover:text-indigo-400 ${className}`} {...props}>
    <rect x="3" y="3" width="8" height="8" rx="2.5" className="fill-indigo-500/15 stroke-indigo-500" strokeWidth="1.75" strokeLinecap="round" />
    <rect x="13" y="3" width="8" height="5" rx="2" className="fill-cyan-500/20 stroke-cyan-400" strokeWidth="1.75" strokeLinecap="round" />
    <rect x="13" y="11" width="8" height="10" rx="2.5" className="fill-indigo-500/15 stroke-indigo-500" strokeWidth="1.75" strokeLinecap="round" />
    <rect x="3" y="14" width="8" height="7" rx="2" className="fill-amber-500/20 stroke-amber-400" strokeWidth="1.75" strokeLinecap="round" />
    <circle cx="7" cy="7" r="1.5" className="fill-indigo-400" />
    <path d="M15 15l2 2 3-3" className="stroke-emerald-400" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </BaseIcon>
);

export const StrategicMattersIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-amber-500 hover:text-amber-400 ${className}`} {...props}>
    <path d="M4 7c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" className="fill-amber-500/15 stroke-amber-500" strokeWidth="1.75" />
    <path d="M9 5V3.5A1.5 1.5 0 0 1 10.5 2h3A1.5 1.5 0 0 1 15 3.5V5" className="stroke-amber-400" strokeWidth="1.75" strokeLinecap="round" />
    <path d="M4 11h16" className="stroke-amber-500/60" strokeWidth="1.5" strokeDasharray="2 2" />
    <rect x="9.5" y="9.5" width="5" height="3.5" rx="1" className="fill-amber-400 stroke-amber-300" strokeWidth="1.2" />
    <path d="M7 16h3M14 16h3" className="stroke-amber-300" strokeWidth="1.75" strokeLinecap="round" />
  </BaseIcon>
);

export const AiChatSearchIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-cyan-400 hover:text-cyan-300 ${className}`} {...props}>
    <circle cx="12" cy="12" r="9" className="fill-cyan-500/10 stroke-cyan-400" strokeWidth="1.75" />
    <path d="M3.6 9h16.8M3.6 15h16.8" className="stroke-cyan-500/40" strokeWidth="1.2" />
    <ellipse cx="12" cy="12" rx="4.5" ry="9" className="stroke-cyan-400/70" strokeWidth="1.5" />
    <path d="M16 6l1.2 2.5L20 9.7l-2 2 .5 2.8L16 13l-2.5 1.5.5-2.8-2-2 2.8-1.2L16 6z" className="fill-amber-400 stroke-amber-300" strokeWidth="1" />
  </BaseIcon>
);

export const MissionControlIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-rose-500 hover:text-rose-400 ${className}`} {...props}>
    <circle cx="12" cy="12" r="9" className="fill-rose-500/10 stroke-rose-500" strokeWidth="1.75" />
    <circle cx="12" cy="12" r="5" className="stroke-rose-400/50" strokeWidth="1.2" strokeDasharray="3 2" />
    <circle cx="12" cy="12" r="2" className="fill-rose-400" />
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" className="stroke-rose-400" strokeWidth="1.75" strokeLinecap="round" />
    <path d="M12 12l4.5-4.5" className="stroke-emerald-400" strokeWidth="2" strokeLinecap="round" />
    <circle cx="16.5" cy="7.5" r="1.5" className="fill-emerald-400" />
  </BaseIcon>
);

export const ChiefOfStaffIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-violet-500 hover:text-violet-400 ${className}`} {...props}>
    <path d="M12 2l2.8 6.2 6.7.7-5 4.5 1.4 6.6-5.9-3.4-5.9 3.4 1.4-6.6-5-4.5 6.7-.7L12 2z" className="fill-violet-500/20 stroke-violet-400" strokeWidth="1.75" strokeLinejoin="round" />
    <circle cx="12" cy="11" r="2.5" className="fill-violet-300 stroke-violet-200" strokeWidth="1" />
    <path d="M7 21h10" className="stroke-violet-400" strokeWidth="2" strokeLinecap="round" />
  </BaseIcon>
);

/* -------------------------------------------------------------------------- */
/*                           2. AI BOARDROOM & EXECUTIVE SUITE                */
/* -------------------------------------------------------------------------- */
export const AiBoardroomIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-emerald-500 hover:text-emerald-400 ${className}`} {...props}>
    <ellipse cx="12" cy="12" rx="6.5" ry="4" className="fill-emerald-500/25 stroke-emerald-400" strokeWidth="1.75" />
    <circle cx="12" cy="5" r="1.75" className="fill-cyan-400 stroke-cyan-300" strokeWidth="1" />
    <circle cx="17.5" cy="7.5" r="1.5" className="fill-emerald-400 stroke-emerald-300" strokeWidth="1" />
    <circle cx="19.5" cy="12" r="1.5" className="fill-amber-400 stroke-amber-300" strokeWidth="1" />
    <circle cx="17.5" cy="16.5" r="1.5" className="fill-violet-400 stroke-violet-300" strokeWidth="1" />
    <circle cx="12" cy="19" r="1.75" className="fill-rose-400 stroke-rose-300" strokeWidth="1" />
    <circle cx="6.5" cy="16.5" r="1.5" className="fill-violet-400 stroke-violet-300" strokeWidth="1" />
    <circle cx="4.5" cy="12" r="1.5" className="fill-amber-400 stroke-amber-300" strokeWidth="1" />
    <circle cx="6.5" cy="7.5" r="1.5" className="fill-emerald-400 stroke-emerald-300" strokeWidth="1" />
    <path d="M10 11l4 2M13.5 10l2 2" className="stroke-white" strokeWidth="1.5" strokeLinecap="round" />
  </BaseIcon>
);

export const AgiStudioIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-purple-500 hover:text-purple-400 ${className}`} {...props}>
    <circle cx="12" cy="4" r="2.5" className="fill-purple-400 stroke-purple-300" strokeWidth="1.5" />
    <path d="M12 6.5v4M12 10.5L6 14M12 10.5L18 14" className="stroke-purple-400" strokeWidth="1.75" strokeLinecap="round" />
    <circle cx="6" cy="15.5" r="2" className="fill-cyan-400 stroke-cyan-300" strokeWidth="1.2" />
    <circle cx="18" cy="15.5" r="2" className="fill-rose-400 stroke-rose-300" strokeWidth="1.2" />
    <path d="M6 17.5L3.5 20M6 17.5L8.5 20M18 17.5L15.5 20M18 17.5L20.5 20" className="stroke-purple-400/80" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="3.5" cy="20.5" r="1.2" className="fill-emerald-400" />
    <circle cx="8.5" cy="20.5" r="1.2" className="fill-emerald-400" />
    <circle cx="15.5" cy="20.5" r="1.2" className="fill-amber-400" />
    <circle cx="20.5" cy="20.5" r="1.2" className="fill-rose-500" />
  </BaseIcon>
);

export const DigitalTwinOsIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-sky-400 hover:text-sky-300 ${className}`} {...props}>
    <path d="M12 3a8 8 0 0 0-8 8c0 4 3 7.3 7 7.9V21h2v-2.1c4-.6 7-3.9 7-7.9a8 8 0 0 0-8-8z" className="fill-sky-500/15 stroke-sky-400" strokeWidth="1.75" />
    <circle cx="9" cy="11" r="1.5" className="fill-sky-300" />
    <circle cx="15" cy="11" r="1.5" className="fill-sky-300" />
    <path d="M9 15h6" className="stroke-sky-300" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 3v4M6 11H2M22 11h-4" className="stroke-cyan-400" strokeWidth="1.5" strokeLinecap="round" />
  </BaseIcon>
);

export const StrategyStudioIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-amber-500 hover:text-amber-400 ${className}`} {...props}>
    <path d="M4 18h16l-1.5-10-4 4-2.5-7-2.5 7-4-4L4 18z" className="fill-amber-500/20 stroke-amber-400" strokeWidth="1.75" strokeLinejoin="round" />
    <circle cx="4" cy="7" r="1.25" className="fill-amber-300" />
    <circle cx="8.5" cy="11" r="1.25" className="fill-amber-300" />
    <circle cx="12" cy="4" r="1.5" className="fill-amber-300" />
    <circle cx="15.5" cy="11" r="1.25" className="fill-amber-300" />
    <circle cx="20" cy="7" r="1.25" className="fill-amber-300" />
    <rect x="4" y="19" width="16" height="2.5" rx="1" className="fill-amber-400 stroke-amber-300" strokeWidth="1" />
  </BaseIcon>
);

export const ChartStudioIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-emerald-400 hover:text-emerald-300 ${className}`} {...props}>
    <path d="M3 20h18" className="stroke-emerald-600" strokeWidth="2" strokeLinecap="round" />
    <path d="M6 18v-4M6 11V8" className="stroke-emerald-400" strokeWidth="1.5" />
    <rect x="4.5" y="11" width="3" height="4" rx="0.5" className="fill-emerald-400 stroke-emerald-300" strokeWidth="1" />
    <path d="M12 18v-2M12 9V5" className="stroke-rose-400" strokeWidth="1.5" />
    <rect x="10.5" y="9" width="3" height="7" rx="0.5" className="fill-rose-500/40 stroke-rose-400" strokeWidth="1" />
    <path d="M18 18v-3M18 8V6" className="stroke-emerald-400" strokeWidth="1.5" />
    <rect x="16.5" y="8" width="3" height="7" rx="0.5" className="fill-emerald-400 stroke-emerald-300" strokeWidth="1" />
    <path d="M3 13c4-6 7 2 11-4s4-1 7-5" className="stroke-cyan-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </BaseIcon>
);

export const MatterNotebooksIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-teal-400 hover:text-teal-300 ${className}`} {...props}>
    <rect x="4" y="3" width="16" height="18" rx="2.5" className="fill-teal-500/15 stroke-teal-400" strokeWidth="1.75" />
    <path d="M8 3v18" className="stroke-teal-500/60" strokeWidth="1.5" />
    <circle cx="6" cy="7" r="1" className="fill-teal-300" />
    <circle cx="6" cy="12" r="1" className="fill-teal-300" />
    <circle cx="6" cy="17" r="1" className="fill-teal-300" />
    <path d="M11 12v-2M13 14V8M15 13v-4M17 12v-1" className="stroke-amber-400" strokeWidth="1.75" strokeLinecap="round" />
  </BaseIcon>
);

export const PlaybookSkillsIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-indigo-400 hover:text-indigo-300 ${className}`} {...props}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" className="stroke-indigo-400" strokeWidth="1.75" strokeLinecap="round" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" className="fill-indigo-500/15 stroke-indigo-400" strokeWidth="1.75" />
    <path d="M13 6l-3 5h4l-2 5 5-6h-4l2-4h-2z" className="fill-amber-400 stroke-amber-300" strokeWidth="1" strokeLinejoin="round" />
  </BaseIcon>
);

export const CoworkMcpIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-blue-500 hover:text-blue-400 ${className}`} {...props}>
    <rect x="3" y="4" width="8" height="6" rx="1.5" className="fill-blue-500/20 stroke-blue-400" strokeWidth="1.5" />
    <rect x="13" y="14" width="8" height="6" rx="1.5" className="fill-blue-500/20 stroke-blue-400" strokeWidth="1.5" />
    <path d="M7 10v4a2 2 0 0 0 2 2h4M17 14v-4a2 2 0 0 0-2-2h-4" className="stroke-cyan-400" strokeWidth="1.75" strokeLinecap="round" />
    <circle cx="12" cy="12" r="2.5" className="fill-emerald-400 stroke-emerald-300" strokeWidth="1" />
  </BaseIcon>
);

export const EnterpriseAssistantIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-fuchsia-400 hover:text-fuchsia-300 ${className}`} {...props}>
    <rect x="4" y="6" width="16" height="12" rx="3" className="fill-fuchsia-500/15 stroke-fuchsia-400" strokeWidth="1.75" />
    <circle cx="9" cy="11" r="1.5" className="fill-fuchsia-300" />
    <circle cx="15" cy="11" r="1.5" className="fill-fuchsia-300" />
    <path d="M10 14.5c.6.6 1.3 1 2 1s1.4-.4 2-1" className="stroke-fuchsia-300" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 2v4M2 12h2M20 12h2" className="stroke-cyan-400" strokeWidth="1.75" strokeLinecap="round" />
  </BaseIcon>
);

export const AiWorkflowsIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-orange-400 hover:text-orange-300 ${className}`} {...props}>
    <circle cx="5" cy="6" r="2.5" className="fill-orange-400 stroke-orange-300" strokeWidth="1.2" />
    <circle cx="19" cy="6" r="2.5" className="fill-cyan-400 stroke-cyan-300" strokeWidth="1.2" />
    <circle cx="12" cy="18" r="3" className="fill-emerald-400 stroke-emerald-300" strokeWidth="1.5" />
    <path d="M7.5 6h9M6.5 8.2l4 7.3M17.5 8.2l-4 7.3" className="stroke-orange-400/80" strokeWidth="1.75" strokeLinecap="round" />
    <path d="M11 18l1 1 2-2" className="stroke-white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </BaseIcon>
);

export const AgentComputerSandboxIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-lime-400 hover:text-lime-300 ${className}`} {...props}>
    <rect x="3" y="4" width="18" height="12" rx="2" className="fill-lime-500/15 stroke-lime-400" strokeWidth="1.75" />
    <path d="M7 20h10M12 16v4" className="stroke-lime-400" strokeWidth="1.75" strokeLinecap="round" />
    <path d="M7 8l3 2-3 2M12 12h4" className="stroke-cyan-400" strokeWidth="1.75" strokeLinecap="round" />
  </BaseIcon>
);

/* -------------------------------------------------------------------------- */
/*                           3. GOVERNANCE & RISK                             */
/* -------------------------------------------------------------------------- */
export const RiskCenterIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-rose-500 hover:text-rose-400 ${className}`} {...props}>
    <path d="M12 2l8 4v6c0 5.5-3.8 10.7-8 12-4.2-1.3-8-6.5-8-12V6l8-4z" className="fill-rose-500/20 stroke-rose-500" strokeWidth="1.75" strokeLinejoin="round" />
    <path d="M12 8v5" className="stroke-amber-400" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="16" r="1.25" className="fill-amber-400" />
  </BaseIcon>
);

export const DecisionMemoryIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-cyan-400 hover:text-cyan-300 ${className}`} {...props}>
    <circle cx="12" cy="12" r="8.5" className="fill-cyan-500/15 stroke-cyan-400" strokeWidth="1.75" />
    <path d="M12 6a6 6 0 0 1 6 6h-2a4 4 0 0 0-4-4V6z" className="fill-cyan-300" />
    <path d="M12 18a6 6 0 0 1-6-6h2a4 4 0 0 0 4 4v2z" className="fill-cyan-300" />
    <circle cx="12" cy="12" r="2.5" className="fill-amber-400 stroke-amber-300" strokeWidth="1" />
  </BaseIcon>
);

export const ScmSimulationIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-emerald-400 hover:text-emerald-300 ${className}`} {...props}>
    <circle cx="6" cy="7" r="2.5" className="fill-cyan-400 stroke-cyan-300" strokeWidth="1.2" />
    <circle cx="18" cy="7" r="2.5" className="fill-violet-400 stroke-violet-300" strokeWidth="1.2" />
    <circle cx="12" cy="17" r="3" className="fill-emerald-400 stroke-emerald-300" strokeWidth="1.5" />
    <path d="M8 8l3 6M16 8l-3 6" className="stroke-emerald-400" strokeWidth="1.75" strokeLinecap="round" />
    <path d="M6 10c0 4 3 7 6 7" className="stroke-cyan-400/60" strokeWidth="1.5" strokeDasharray="2 2" />
  </BaseIcon>
);

export const MemoryGraphIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-indigo-400 hover:text-indigo-300 ${className}`} {...props}>
    <circle cx="5" cy="6" r="2.5" className="fill-indigo-400 stroke-indigo-300" strokeWidth="1.2" />
    <circle cx="19" cy="6" r="2.5" className="fill-cyan-400 stroke-cyan-300" strokeWidth="1.2" />
    <circle cx="12" cy="12" r="3" className="fill-violet-500 stroke-violet-300" strokeWidth="1.5" />
    <circle cx="7" cy="19" r="2" className="fill-emerald-400 stroke-emerald-300" strokeWidth="1.2" />
    <circle cx="17" cy="19" r="2" className="fill-amber-400 stroke-amber-300" strokeWidth="1.2" />
    <path d="M7 7.5L10 10.5M17 7.5L14 10.5M10.5 13.5L8 17.5M13.5 13.5L16 17.5M7.5 6h9" className="stroke-indigo-400/80" strokeWidth="1.5" strokeLinecap="round" />
  </BaseIcon>
);

/* -------------------------------------------------------------------------- */
/*                           4. OPERATIONS & PROJECTS                         */
/* -------------------------------------------------------------------------- */
export const ProjectsKanbanIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-amber-500 hover:text-amber-400 ${className}`} {...props}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" className="fill-amber-500/15 stroke-amber-400" strokeWidth="1.75" />
    <path d="M9 4v16M15 4v16" className="stroke-amber-400/60" strokeWidth="1.5" />
    <rect x="4.5" y="7" width="3" height="4" rx="1" className="fill-cyan-400" />
    <rect x="10.5" y="7" width="3" height="6" rx="1" className="fill-amber-400" />
    <rect x="16.5" y="7" width="3" height="3" rx="1" className="fill-emerald-400" />
  </BaseIcon>
);

export const RequirementsMatrixIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-sky-400 hover:text-sky-300 ${className}`} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" className="fill-sky-500/15 stroke-sky-400" strokeWidth="1.75" />
    <path d="M3 9h18M3 15h18M9 3v18M15 3v18" className="stroke-sky-400/40" strokeWidth="1.2" />
    <circle cx="6" cy="6" r="1.5" className="fill-emerald-400" />
    <circle cx="12" cy="12" r="1.5" className="fill-cyan-400" />
    <circle cx="18" cy="18" r="1.5" className="fill-emerald-400" />
  </BaseIcon>
);

export const MeetingsVexaIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-rose-400 hover:text-rose-300 ${className}`} {...props}>
    <rect x="8" y="3" width="8" height="12" rx="4" className="fill-rose-500/20 stroke-rose-400" strokeWidth="1.75" />
    <path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8" className="stroke-rose-400" strokeWidth="1.75" strokeLinecap="round" />
    <circle cx="12" cy="7" r="1.5" className="fill-rose-300" />
    <path d="M10 11h4" className="stroke-rose-300" strokeWidth="1.5" strokeLinecap="round" />
  </BaseIcon>
);

export const OrgTimelineIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-teal-400 hover:text-teal-300 ${className}`} {...props}>
    <path d="M3 12h18" className="stroke-teal-400" strokeWidth="2" strokeLinecap="round" />
    <circle cx="6" cy="12" r="3" className="fill-teal-400 stroke-teal-300" strokeWidth="1.2" />
    <path d="M6 9V5M6 4h3" className="stroke-teal-300" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="12" r="3" className="fill-cyan-400 stroke-cyan-300" strokeWidth="1.2" />
    <path d="M12 15v4M12 20h3" className="stroke-cyan-300" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="18" cy="12" r="3" className="fill-emerald-400 stroke-emerald-300" strokeWidth="1.2" />
    <path d="M18 9V5M18 4h3" className="stroke-emerald-300" strokeWidth="1.5" strokeLinecap="round" />
  </BaseIcon>
);

export const DocumentsLibraryIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-blue-400 hover:text-blue-300 ${className}`} {...props}>
    <path d="M6 3h8l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" className="fill-blue-500/15 stroke-blue-400" strokeWidth="1.75" />
    <path d="M14 3v5h5" className="stroke-blue-400" strokeWidth="1.5" strokeLinejoin="round" />
    <rect x="8" y="11" width="8" height="6" rx="1" className="fill-cyan-500/20 stroke-cyan-300" strokeWidth="1.2" strokeDasharray="2 1" />
    <path d="M8 19h5" className="stroke-blue-300" strokeWidth="1.5" strokeLinecap="round" />
  </BaseIcon>
);

export const ExportHistoryIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-violet-400 hover:text-violet-300 ${className}`} {...props}>
    <path d="M12 3v11M8 10l4 4 4-4" className="stroke-violet-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" className="stroke-violet-400" strokeWidth="1.75" strokeLinecap="round" />
    <circle cx="12" cy="18" r="1.5" className="fill-emerald-400" />
  </BaseIcon>
);

export const AnalyticsBiIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-emerald-400 hover:text-emerald-300 ${className}`} {...props}>
    <path d="M3 3v18h18" className="stroke-emerald-500" strokeWidth="2" strokeLinecap="round" />
    <path d="M7 16l4-5 4 3 6-8" className="stroke-cyan-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="7" cy="16" r="1.5" className="fill-cyan-400" />
    <circle cx="11" cy="11" r="1.5" className="fill-cyan-400" />
    <circle cx="15" cy="14" r="1.5" className="fill-cyan-400" />
    <circle cx="21" cy="6" r="2" className="fill-emerald-400" />
  </BaseIcon>
);

/* -------------------------------------------------------------------------- */
/*                           5. ADMINISTRATION & SECURITY                     */
/* -------------------------------------------------------------------------- */
export const PlansBillingIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-amber-400 hover:text-amber-300 ${className}`} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" className="fill-amber-500/15 stroke-amber-400" strokeWidth="1.75" />
    <path d="M3 10h18" className="stroke-amber-400" strokeWidth="1.5" />
    <circle cx="7" cy="14" r="1.5" className="fill-amber-300" />
    <path d="M12 14h5" className="stroke-emerald-400" strokeWidth="2" strokeLinecap="round" />
  </BaseIcon>
);

export const DgclAuditMerkleIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-emerald-500 hover:text-emerald-400 ${className}`} {...props}>
    <path d="M12 2l7 3.5v5.5c0 5-3.5 9.5-7 11-3.5-1.5-7-6-7-11V5.5L12 2z" className="fill-emerald-500/20 stroke-emerald-400" strokeWidth="1.75" strokeLinejoin="round" />
    <circle cx="12" cy="8" r="1.75" className="fill-cyan-300" />
    <path d="M12 9.75v2.5M12 12.25L9 15M12 12.25l3 2.75" className="stroke-emerald-300" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8.5" cy="15.5" r="1.25" className="fill-emerald-400" />
    <circle cx="15.5" cy="15.5" r="1.25" className="fill-emerald-400" />
  </BaseIcon>
);

export const AiFirewallWafIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-rose-500 hover:text-rose-400 ${className}`} {...props}>
    <path d="M12 2L4 5.5v6c0 5.2 3.4 10.1 8 11.5 4.6-1.4 8-6.3 8-11.5v-6L12 2z" className="fill-rose-500/15 stroke-rose-500" strokeWidth="1.75" />
    <path d="M8 11l3 3 5-5" className="stroke-emerald-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 6v1M12 17v1M6 12h1M17 12h1" className="stroke-rose-400" strokeWidth="1.5" strokeLinecap="round" />
  </BaseIcon>
);

export const AirGappedDesktopIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-cyan-400 hover:text-cyan-300 ${className}`} {...props}>
    <rect x="3" y="4" width="18" height="12" rx="2" className="fill-cyan-500/15 stroke-cyan-400" strokeWidth="1.75" />
    <path d="M8 20h8M12 16v4" className="stroke-cyan-400" strokeWidth="1.75" strokeLinecap="round" />
    <rect x="9.5" y="7.5" width="5" height="4" rx="1" className="fill-emerald-400 stroke-emerald-300" strokeWidth="1" />
    <path d="M10.5" y="7.5V6a1.5 1.5 0 0 1 3 0v1.5" className="stroke-emerald-300" strokeWidth="1.2" strokeLinecap="round" />
  </BaseIcon>
);

export const TriadLoRaModelsIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <BaseIcon size={size} className={`text-purple-400 hover:text-purple-300 ${className}`} {...props}>
    <circle cx="12" cy="5" r="2.5" className="fill-purple-400 stroke-purple-300" strokeWidth="1.2" />
    <circle cx="6" cy="16" r="2.5" className="fill-cyan-400 stroke-cyan-300" strokeWidth="1.2" />
    <circle cx="18" cy="16" r="2.5" className="fill-amber-400 stroke-amber-300" strokeWidth="1.2" />
    <path d="M10 7L7.5 14M14 7l2.5 7M8.5 16h7" className="stroke-purple-400/70" strokeWidth="1.75" strokeLinecap="round" />
    <circle cx="12" cy="12" r="1.5" className="fill-white" />
  </BaseIcon>
);

/* -------------------------------------------------------------------------- */
/*                         DYNAMIC ICON REGISTRY DISPATCHER                   */
/* -------------------------------------------------------------------------- */
export type FeatureIconKey =
  | 'overview'
  | 'matters'
  | 'chat'
  | 'mission-control'
  | 'chief-of-staff'
  | 'boardroom'
  | 'agi-studio'
  | 'digital-twin'
  | 'strategy'
  | 'charts'
  | 'notebooks'
  | 'skills'
  | 'cowork'
  | 'assistant'
  | 'workspace'
  | 'computer'
  | 'risk-center'
  | 'decisions'
  | 'simulations'
  | 'graph'
  | 'projects'
  | 'requirements'
  | 'meetings'
  | 'timeline'
  | 'documents'
  | 'exports'
  | 'analytics'
  | 'billing'
  | 'audit'
  | 'firewall'
  | 'desktop'
  | 'triad';

export const CausarixFeatureIconMap: Record<FeatureIconKey, React.FC<IconProps>> = {
  'overview': ExecutiveOverviewIcon,
  'matters': StrategicMattersIcon,
  'chat': AiChatSearchIcon,
  'mission-control': MissionControlIcon,
  'chief-of-staff': ChiefOfStaffIcon,
  'boardroom': AiBoardroomIcon,
  'agi-studio': AgiStudioIcon,
  'digital-twin': DigitalTwinOsIcon,
  'strategy': StrategyStudioIcon,
  'charts': ChartStudioIcon,
  'notebooks': MatterNotebooksIcon,
  'skills': PlaybookSkillsIcon,
  'cowork': CoworkMcpIcon,
  'assistant': EnterpriseAssistantIcon,
  'workspace': AiWorkflowsIcon,
  'computer': AgentComputerSandboxIcon,
  'risk-center': RiskCenterIcon,
  'decisions': DecisionMemoryIcon,
  'simulations': ScmSimulationIcon,
  'graph': MemoryGraphIcon,
  'projects': ProjectsKanbanIcon,
  'requirements': RequirementsMatrixIcon,
  'meetings': MeetingsVexaIcon,
  'timeline': OrgTimelineIcon,
  'documents': DocumentsLibraryIcon,
  'exports': ExportHistoryIcon,
  'analytics': AnalyticsBiIcon,
  'billing': PlansBillingIcon,
  'audit': DgclAuditMerkleIcon,
  'firewall': AiFirewallWafIcon,
  'desktop': AirGappedDesktopIcon,
  'triad': TriadLoRaModelsIcon,
};

export const CausarixFeatureIcon: React.FC<{
  name: FeatureIconKey;
  size?: number | string;
  className?: string;
} & React.SVGProps<SVGSVGElement>> = ({ name, size = 20, className = '', ...props }) => {
  const Component = CausarixFeatureIconMap[name] || ExecutiveOverviewIcon;
  return <Component size={size} className={className} {...props} />;
};
