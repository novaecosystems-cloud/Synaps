"use client";

import { useEffect, useState, useRef } from "react";
import { Joyride, STATUS, Step, TooltipRenderProps, EVENTS } from "react-joyride";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";

// Extended step interface to pass custom props to our tooltip
interface CustomStep extends Step {
  spotlightClicks?: boolean;
  disableBeacon?: boolean;
}

function CustomTooltip({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
}: TooltipRenderProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const customStep = step as CustomStep;
  const isClickStep = customStep.spotlightClicks;
  
  useGSAP(() => {
    gsap.from(tooltipRef.current, { y: 20, opacity: 0, scale: 0.9, duration: 0.4, ease: 'back.out(1.5)' });
  }, [step]); // Re-trigger on step change

  return (
    <div {...tooltipProps} ref={tooltipRef} className="bg-white text-slate-900 border-2 border-indigo-500 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] p-5 max-w-[320px] font-sans relative z-[1001]">
      {step.title && <h3 className="font-bold text-lg mb-2 text-indigo-950">{step.title}</h3>}
      <div className="text-sm mb-6 leading-relaxed font-medium text-slate-700">{step.content}</div>
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <button {...closeProps} className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors">End Tour</button>
        </div>
        {!isClickStep && (
          <button {...primaryProps} className="bg-indigo-600 text-white px-5 py-2 rounded-full text-xs font-bold shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] transition-all">
            {continuous ? 'Next' : 'Done'}
          </button>
        )}
      </div>
    </div>
  );
}

const steps: CustomStep[] = [
  // 0: /dashboard
  {
    target: ".tour-dashboard",
    title: "Welcome to Synaps!",
    content: "Let's take a comprehensive tour of your new workspace and learn where everything is.",
    placement: "center",
    disableBeacon: true,
  },
  // 1: /dashboard
  {
    target: ".tour-group-projects",
    title: "Project Management",
    content: "Click on 'Projects' to expand the menu, then click 'All Projects' to continue the tour.",
    placement: "right",
    spotlightClicks: true,
  },
  // 2: /dashboard/projects (Auto-advanced by useEffect when pathname === '/dashboard/projects')
  {
    target: ".tour-projects-header",
    title: "Projects Overview",
    content: "Welcome to Projects! Here you can manage your RFPs and track pipeline progress.",
    placement: "bottom",
    disableBeacon: true,
  },
  // 3: /dashboard/projects
  {
    target: ".tour-group-documents",
    title: "Your Files",
    content: "Next, let's explore your files. Click 'Documents' then 'Library' to continue.",
    placement: "right",
    spotlightClicks: true,
  },
  // 4: /dashboard/documents (Auto-advanced by useEffect when pathname === '/dashboard/documents')
  {
    target: ".tour-documents-header",
    title: "Document Vault",
    content: "This is your Document Library. Upload RFPs, compliance matrices, and reference materials securely.",
    placement: "bottom",
    disableBeacon: true,
  },
  // 5: /dashboard/documents
  {
    target: ".tour-workspace",
    title: "The Magic",
    content: "Now for the magic. Click on 'AI Workspace' to see where the heavy lifting happens.",
    placement: "right",
    spotlightClicks: true,
  },
  // 6: /dashboard/workspace (Auto-advanced by useEffect when pathname === '/dashboard/workspace')
  {
    target: ".tour-workspace-container",
    title: "AI Workspace",
    content: "This is the AI Workspace! Select a project and document to instantly analyze gaps, draft proposals, and chat with your data.",
    placement: "center",
    disableBeacon: true,
  },
  // 7: /dashboard/workspace
  {
    target: ".tour-notifications",
    title: "Stay Updated",
    content: "Keep an eye on notifications here for when background AI tasks complete. That's the end of the tour!",
    placement: "bottom",
  }
];

export default function TourGuide() {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const pathname = usePathname();

  // Watch for route changes to advance the tour automatically
  useEffect(() => {
    if (!run) return;
    
    // Slight delay to allow DOM to render before Joyride targets it
    const timer = setTimeout(() => {
      if (pathname === '/dashboard/projects' && stepIndex < 2) {
        setStepIndex(2);
      } else if (pathname === '/dashboard/documents' && stepIndex < 4) {
        setStepIndex(4);
      } else if (pathname === '/dashboard/workspace' && stepIndex < 6) {
        setStepIndex(6);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [pathname, run, stepIndex]);

  useEffect(() => {
    // Disabled auto-start to prevent the faint overlay screen for old users
    /*
    const hasSeenTour = localStorage.getItem("synaps-tour-completed-v2");
    if (!hasSeenTour) {
      setTimeout(() => setRun(true), 1500); // Small delay to let the app load
    }
    */
  }, []);

  const handleJoyrideCallback = (data: any) => {
    const { status, type, action } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem("synaps-tour-completed-v2", "true");
    } else if (type === EVENTS.STEP_AFTER && action === 'next') {
      setStepIndex(prev => prev + 1);
    }
  };

  // Skip rendering if not running to avoid DOM pollution
  if (!run) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous={true}
      scrollToFirstStep={true}
      showSkipButton={true}
      callback={handleJoyrideCallback}
      tooltipComponent={CustomTooltip}
      disableOverlayClose={true}
      styles={{
        options: {
          overlayColor: "rgba(0, 0, 0, 0.75)",
          zIndex: 1000,
        }
      } as any}
    />
  );
}
