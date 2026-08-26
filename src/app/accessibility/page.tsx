import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Mail, CheckCircle2 } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accessibility Statement — Causarix',
  description: 'Causarix commitment to digital accessibility in accordance with ADA Title III and WCAG 2.1 Level AA standards.',
};

export default function AccessibilityStatementPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Navigation */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md px-2 py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Causarix
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            WCAG 2.1 Level AA Conformance
          </span>
        </div>

        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Accessibility Statement
          </h1>
          <p className="text-sm font-mono text-slate-400">
            Last Updated: August 2026 • Effective Date: January 1, 2026
          </p>
          <p className="text-base text-slate-300 leading-relaxed">
            Causarix is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to guarantee universal access to our institutional decision operating system.
          </p>
        </div>

        {/* Conformance Status */}
        <section className="space-y-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Conformance Status & Technical Standards
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for individuals with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-white">Causarix web platforms, APIs, and client dashboards are designed and engineered in substantial conformance with WCAG 2.1 Level AA</strong> and the Americans with Disabilities Act (ADA) Title III regulations.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <h3 className="text-xs font-mono uppercase text-slate-400">Keyboard Navigation</h3>
              <p className="text-sm text-slate-200 mt-1">Full interactive keyboard accessibility without mouse traps, including visible focus rings and skip-to-content bypass links.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <h3 className="text-xs font-mono uppercase text-slate-400">Screen Reader Compatibility</h3>
              <p className="text-sm text-slate-200 mt-1">Semantic HTML5 landmarks, explicit ARIA labels on all forms, and live status regions (<code className="text-xs font-mono">aria-live="polite"</code>) for streaming AI deliberation.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <h3 className="text-xs font-mono uppercase text-slate-400">Color Contrast & Typography</h3>
              <p className="text-sm text-slate-200 mt-1">Text contrast ratios exceeding 4.5:1 across both Dark and Light modes, with scalable typography supporting 200%+ zoom without layout breakage.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <h3 className="text-xs font-mono uppercase text-slate-400">Motion Sensitivity</h3>
              <p className="text-sm text-slate-200 mt-1">Respects <code className="text-xs font-mono">prefers-reduced-motion</code> operating system settings to disable flashing, looping, or sudden transitions.</p>
            </div>
          </div>
        </section>

        {/* Feedback & Grievance Mechanism */}
        <section className="space-y-4 bg-blue-950/20 border border-blue-500/20 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white">
            Feedback, Assistance & Safe Harbor Contact
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            We welcome your feedback on the accessibility of Causarix. If you encounter accessibility barriers on any part of our website or application, please let us know so we can remediate it promptly:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <a
              href="mailto:accessibility@causarix.com"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors focus:ring-2 focus:ring-white focus:outline-none"
            >
              <Mail className="w-4 h-4" />
              accessibility@causarix.com
            </a>
            <a
              href="mailto:legal@causarix.com"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-sm transition-colors focus:ring-2 focus:ring-white focus:outline-none"
            >
              <ShieldCheck className="w-4 h-4" />
              legal@causarix.com
            </a>
          </div>
          <p className="text-xs text-slate-400 pt-2">
            We strive to respond to accessibility inquiries within 2 business days and provide alternative access formats whenever requested.
          </p>
        </section>

        {/* Formal Assessment */}
        <section className="space-y-3 text-sm text-slate-400 border-t border-slate-800 pt-8">
          <h3 className="text-base font-semibold text-slate-200">Assessment Approach</h3>
          <p>
            Causarix assesses the accessibility of its software and online services through regular automated linting (axe-core, Lighthouse 100/100 accessibility checks), manual keyboard traversal audits, and screen reader evaluations with NVDA, JAWS, and VoiceOver.
          </p>
        </section>
      </div>
    </main>
  );
}
