export const dynamic = 'force-dynamic';
import { PrismaClient } from '@prisma/client';
import { DocumentPreviewModal } from '@/components/documents/document-preview-modal';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/auth-server';
import Link from 'next/link';
import { ChevronLeft, FileText, Database, Settings } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import prisma from '@/lib/prisma';

export default async function DocumentDebugPage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('synaps-session')?.value;
  if (!session) redirect('/login');
  
  const decoded = await verifySessionCookie(session);
  if (!decoded) redirect('/login');

  const { id } = await params;

  const document = await prisma.document.findUnique({
    where: { id, organizationId: decoded.organizationId },
    include: {
      chunks: { orderBy: { createdAt: 'asc' } },
      processedDoc: true,
      metadata: true,
      processingJob: true
    }
  });

  if (!document) return notFound();

  return (
    <div className="flex h-[calc(100vh-2rem)] w-full text-white font-sans overflow-hidden rounded-xl border border-white/10 bg-black/40">
      
      {/* 1. LEFT SIDEBAR (Simple) */}
      <aside className="w-[80px] md:w-[240px] bg-white/5 backdrop-blur-xl h-full flex flex-col shrink-0 border-r border-white/10 z-10">
        <div className="p-6">
          <Link href="/dashboard/documents" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8">
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden md:inline font-bold text-sm">Back</span>
          </Link>
          <div className="hidden md:block">
            <h3 className="font-bold text-[15px] text-white mb-4">Doc Debugger</h3>
            <nav className="space-y-2">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 text-primary border border-primary/20">
                <Database className="w-4 h-4" /> <span className="text-sm font-bold">Chunks</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/50 hover:bg-white/5 hover:text-white transition-colors cursor-pointer">
                <FileText className="w-4 h-4" /> <span className="text-sm font-bold">Raw Text</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/50 hover:bg-white/5 hover:text-white transition-colors cursor-pointer">
                <Settings className="w-4 h-4" /> <span className="text-sm font-bold">Metadata</span>
              </div>
            </nav>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-10 relative">
        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">{document.name}</h1>
          <div className="flex flex-wrap gap-4 text-xs font-bold text-white/50">
            <span className="bg-white/5 border border-white/10 px-2 py-1 rounded">Type: {document.processedDoc?.detectedType || 'Unknown'}</span>
            <span className="bg-white/5 border border-white/10 px-2 py-1 rounded">Pages: {document.processedDoc?.pageCount || 0}</span>
            <span className="bg-white/5 border border-white/10 px-2 py-1 rounded">Total Chunks: {document.chunks.length}</span>
            <span className="bg-white/5 border border-white/10 px-2 py-1 rounded">Status: {document.processingJob?.status || 'UNKNOWN'}</span>
            <span className="bg-white/5 border border-white/10 px-2 py-1 rounded">Updated {formatDistanceToNow(document.updatedAt)} ago</span>
          </div>
        </div>

        {/* Chunks Grid */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white mb-4">Extracted Semantic Chunks</h2>
          
          {document.chunks.length === 0 ? (
            <div className="bg-white/5 border border-white/10 border-dashed rounded-2xl p-10 text-center">
              <Database className="w-8 h-8 text-white/30 mx-auto mb-3" />
              <p className="text-white/50 font-medium">No chunks generated. Processing might be pending or failed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {document.chunks.map((chunk, idx) => (
                <div key={chunk.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col group hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-4 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-black text-xs">
                        #{idx + 1}
                      </div>
                      <div>
                        <p className="text-[11px] text-white/40 uppercase tracking-widest font-bold">Chunk ID</p>
                        <p className="text-xs text-white/70 font-mono">{chunk.id.split('-')[0]}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                       {chunk.pageNumber && (
                         <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                           Page {chunk.pageNumber}
                         </span>
                       )}
                       {chunk.section && chunk.section !== 'General' && (
                         <span className="text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
                           {chunk.section}
                         </span>
                       )}
                       <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-bold">
                         ~{chunk.tokenCount} Tokens
                       </span>
                    </div>
                  </div>
                  <div className="flex-1 bg-black/20 rounded-xl p-4 border border-white/5 font-mono text-xs text-white/80 leading-relaxed overflow-y-auto max-h-64 custom-scrollbar whitespace-pre-wrap">
                    {chunk.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
