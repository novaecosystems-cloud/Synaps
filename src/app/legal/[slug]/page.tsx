'use client';

import React, { useState, use } from 'react';
import { LEGAL_DOCUMENTS, LegalDoc } from '@/lib/legal-docs';
import { 
  FileText, Search, Printer, ArrowLeft, ShieldCheck, 
  ChevronRight, Calendar, Info, Mail, Lock, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function LegalDocPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const doc: LegalDoc = LEGAL_DOCUMENTS[resolvedParams.slug];

  if (!doc) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <ShieldCheck className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold">Document Not Found</h1>
        <p className="text-sm text-slate-400 mt-2 mb-6">The legal policy or document you requested does not exist.</p>
        <Link href="/" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-xs text-white">
          Return to Synaps Home
        </Link>
      </div>
    );
  }

  const [searchTerm, setSearchTerm] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const docList = Object.values(LEGAL_DOCUMENTS);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex justify-between items-center print:hidden">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wider text-indigo-400 text-lg">SYNAPS</span>
            <span className="text-xs text-slate-500 uppercase font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Legal & Governance</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handlePrint} className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all">
            <Printer className="w-3.5 h-3.5" /> Print / Save PDF
          </button>
          <Link href="/login" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all">
            Sign In to Console
          </Link>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar: Document Directory */}
        <aside className="lg:col-span-3 space-y-6 print:hidden">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">All Governance Policies</h3>
            
            <div className="space-y-1 text-xs">
              {docList.map((item) => (
                <Link
                  key={item.slug}
                  href={`/legal/${item.slug}`}
                  className={`block px-3 py-2 rounded-xl transition-all ${
                    item.slug === doc.slug
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Center: Legal Document Content */}
        <main className="lg:col-span-6 space-y-6">
          <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-6 print:border-none print:p-0">
            
            {/* Header metadata */}
            <div className="space-y-2 border-b border-slate-800 pb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                {doc.category}
              </span>
              <h1 className="text-3xl font-extrabold text-white">{doc.title}</h1>
              <p className="text-xs text-slate-400 leading-relaxed">{doc.summary}</p>
              <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 pt-2">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Last Updated: {doc.lastUpdated}
              </div>
            </div>

            {/* Document Body */}
            <div className="prose prose-invert max-w-none text-sm text-slate-300 leading-relaxed space-y-4 font-normal">
              {doc.contentMd.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('# ')) {
                  return null; // Skip duplicate h1
                }
                if (paragraph.startsWith('## ')) {
                  const headingText = paragraph.replace('## ', '');
                  const idMatch = headingText.match(/\{#(.*?)\}/);
                  const cleanText = headingText.replace(/\{#(.*?)\}/, '').trim();
                  const id = idMatch ? idMatch[1] : cleanText.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <h2 key={idx} id={id} className="text-xl font-bold text-white pt-6 border-t border-slate-800/80 mt-6 scroll-mt-24">
                      {cleanText}
                    </h2>
                  );
                }
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-base font-bold text-indigo-300 pt-3">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
                  const items = paragraph.split('\n');
                  return (
                    <ul key={idx} className="list-disc pl-5 space-y-1 text-slate-300">
                      {items.map((it, i) => (
                        <li key={i}>{it.replace(/^[\*\-]\s*/, '')}</li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={idx} className="text-slate-300 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>

          </div>
        </main>

        {/* Right Sidebar: Table of Contents & Quick Contact */}
        <aside className="lg:col-span-3 space-y-6 print:hidden">
          
          {/* Table of Contents */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 sticky top-24">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">On This Page</h3>
            <nav className="space-y-1 text-xs">
              {doc.tableOfContents?.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all truncate"
                >
                  {item.title}
                </a>
              ))}
            </nav>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Need Compliance Help?</span>
              <a href="mailto:dpo@synaps.ai" className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-bold">
                <Mail className="w-3.5 h-3.5" /> Email Legal & DPO Team
              </a>
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
}
