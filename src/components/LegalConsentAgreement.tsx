'use client';

import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LegalConsentAgreementProps {
  onConsentChange?: (isAccepted: boolean, details: { terms: boolean; privacy: boolean; aiGovernance: boolean }) => void;
  required?: boolean;
  variant?: 'compact' | 'detailed';
  className?: string;
  defaultChecked?: boolean;
}

export function LegalConsentAgreement({
  onConsentChange,
  required = true,
  variant = 'compact',
  className,
  defaultChecked = false,
}: LegalConsentAgreementProps) {
  const [termsAccepted, setTermsAccepted] = useState(defaultChecked);
  const [privacyAccepted, setPrivacyAccepted] = useState(defaultChecked);
  const [aiGovernanceAccepted, setAiGovernanceAccepted] = useState(defaultChecked);

  // For compact mode, single state controls all
  const [allAccepted, setAllAccepted] = useState(defaultChecked);

  useEffect(() => {
    if (variant === 'compact') {
      onConsentChange?.(allAccepted, {
        terms: allAccepted,
        privacy: allAccepted,
        aiGovernance: allAccepted,
      });
    } else {
      const isValid = termsAccepted && privacyAccepted && aiGovernanceAccepted;
      onConsentChange?.(isValid, {
        terms: termsAccepted,
        privacy: privacyAccepted,
        aiGovernance: aiGovernanceAccepted,
      });
    }
  }, [allAccepted, termsAccepted, privacyAccepted, aiGovernanceAccepted, variant, onConsentChange]);

  if (variant === 'compact') {
    return (
      <div className={cn("space-y-2 select-none", className)}>
        <Label className="flex items-start gap-3 cursor-pointer text-xs font-medium text-zinc-300 hover:text-white leading-relaxed">
          <Checkbox
            checked={allAccepted}
            onCheckedChange={(checked) => setAllAccepted(checked)}
            variant="indigo"
            size="md"
            className="mt-0.5"
          />
          <span className="text-zinc-400">
            I agree to the{' '}
            <Link
              href="/legal/terms"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 inline-flex items-center gap-0.5"
            >
              Terms of Service
              <ExternalLink className="w-2.5 h-2.5 inline" />
            </Link>
            ,{' '}
            <Link
              href="/legal/privacy"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 inline-flex items-center gap-0.5"
            >
              Privacy Policy
              <ExternalLink className="w-2.5 h-2.5 inline" />
            </Link>
            , and{' '}
            <Link
              href="/legal/dpa"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 inline-flex items-center gap-0.5"
            >
              Sovereign AI Governance Protocols
              <ExternalLink className="w-2.5 h-2.5 inline" />
            </Link>
            .
          </span>
        </Label>
      </div>
    );
  }

  // Detailed multi-clause mode
  return (
    <div className={cn("p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-3.5 select-none", className)}>
      <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Enterprise Legal & Governance Consent</span>
      </div>

      {/* Terms of Service */}
      <Label className="flex items-start gap-3 cursor-pointer text-xs font-medium leading-relaxed">
        <Checkbox
          checked={termsAccepted}
          onCheckedChange={(c) => setTermsAccepted(c)}
          variant="indigo"
          size="sm"
          className="mt-0.5"
        />
        <span className="text-zinc-400">
          I accept the{' '}
          <Link
            href="/legal/terms"
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2"
          >
            Terms of Service
          </Link>{' '}
          and Delaware DGCL § 141 governance framework.
        </span>
      </Label>

      {/* Privacy Policy */}
      <Label className="flex items-start gap-3 cursor-pointer text-xs font-medium leading-relaxed">
        <Checkbox
          checked={privacyAccepted}
          onCheckedChange={(c) => setPrivacyAccepted(c)}
          variant="indigo"
          size="sm"
          className="mt-0.5"
        />
        <span className="text-zinc-400">
          I accept the{' '}
          <Link
            href="/legal/privacy"
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2"
          >
            Privacy Policy
          </Link>{' '}
          and zero-log data retention policy.
        </span>
      </Label>

      {/* AI Governance & DPA */}
      <Label className="flex items-start gap-3 cursor-pointer text-xs font-medium leading-relaxed">
        <Checkbox
          checked={aiGovernanceAccepted}
          onCheckedChange={(c) => setAiGovernanceAccepted(c)}
          variant="indigo"
          size="sm"
          className="mt-0.5"
        />
        <span className="text-zinc-400">
          I acknowledge the{' '}
          <Link
            href="/legal/dpa"
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2"
          >
            Data Processing Agreement (DPA)
          </Link>{' '}
          and client-side WebAssembly computation isolation.
        </span>
      </Label>
    </div>
  );
}

export default LegalConsentAgreement;
