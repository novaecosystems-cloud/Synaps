export const dynamic = 'force-dynamic';
import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Dashboard | Synaps',
  description: 'Synaps dashboard overview and activity.',
};
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { 
  CheckSquare, Inbox, FolderKanban, Settings, 
  Search, Plus, LayoutDashboard, FileText, HardDrive, 
  ChevronRight, MoreHorizontal, FileIcon
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import prisma from '@/lib/prisma';

import { verifySessionCookie } from '@/lib/auth-server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('synaps-session')?.value;
  if (!session) redirect('/login');
  
  const decoded = await verifySessionCookie(session);
  if (!decoded) redirect('/login');

  const currentUser = await prisma.user.findUnique({
    where: { id: decoded.uid }
  });
  
  if (!currentUser) redirect('/login');
  const recentProjects = await prisma.project.findMany({ take: 2, orderBy: { createdAt: 'desc' } });
  const recentDocs = await prisma.document.findMany({ take: 4, orderBy: { updatedAt: 'desc' }, include: { owner: true, processingJob: true } });
  
  // Storage calculation
  const totalStorage = recentDocs.reduce((acc, doc) => acc + doc.sizeBytes, 0);
  const maxStorage = 5 * 1024 * 1024 * 1024; // 5GB limit
  const storagePercentage = Math.min(100, (totalStorage / maxStorage) * 100);

  return (
    <div className="flex w-full gap-6 text-base-content font-sans min-h-[calc(100vh-10rem)]">
      
      {/* MAIN CONTENT (CENTER) */}
      <main className="flex-1 overflow-y-auto px-8 py-8 relative bg-base-100 rounded-3xl border border-base-300 shadow-sm tour-dashboard">
        {/* Subtle glow (adjusted for theme) */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Header */}
        <div className="flex justify-between items-end mb-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-base-content mb-1">Welcome back, {currentUser?.name?.split(' ')[0] || 'User'}</h1>
            <p className="text-sm text-base-content/60">Here's an overview of your organization's activity.</p>
          </div>
          <div className="hidden sm:flex items-center gap-3 bg-base-200 border border-base-300 px-4 py-2 rounded-2xl">
            <span className="text-xs font-bold text-base-content/60">Storage Used</span>
            <progress className="progress progress-primary w-24 bg-base-300" value={storagePercentage} max="100"></progress>
          </div>
        </div>

        {/* Recent Projects Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
          {recentProjects.map((project, idx) => (
            <Link href={`/dashboard/projects/${project.id}`} key={project.id} className="card bg-base-200 border border-base-300 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group h-48">
              <div className="card-body justify-between">
                <div className="flex justify-between items-start">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${idx === 0 ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-secondary/10 border-secondary/20 text-secondary'}`}>
                    <FolderKanban className="w-6 h-6" />
                  </div>
                  <button className="btn btn-sm btn-circle btn-ghost text-base-content/50 group-hover:text-base-content">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <h2 className="card-title text-xl font-bold leading-tight line-clamp-2 text-base-content">{project.name}</h2>
                  <p className="text-xs text-base-content/60 mt-1">Updated {formatDistanceToNow(project.updatedAt)} ago</p>
                </div>
              </div>
            </Link>
          ))}
          {recentProjects.length === 0 && (
            <div className="col-span-1 md:col-span-2 h-48 rounded-3xl bg-base-200 border border-base-300 border-dashed flex items-center justify-center text-base-content/40 font-medium">
              No projects found. Create one from the right menu!
            </div>
          )}
        </div>

        {/* Recent Documents Section */}
        <div className="flex justify-between items-center mb-6 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
          <h2 className="text-xl font-bold tracking-tight text-base-content">Recent Documents</h2>
          <Link href="/dashboard/documents" className="btn btn-sm btn-ghost text-base-content/60 hover:text-base-content">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Task/Doc List */}
        <div className="space-y-3 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
          {recentDocs.map((doc) => (
            <Link href={`/dashboard/documents`} key={doc.id} className="flex items-center justify-between group bg-base-100 hover:bg-base-200 border border-base-300 hover:border-base-content/20 transition-all p-4 rounded-2xl cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-info/10 border border-info/20 text-info flex items-center justify-center">
                  <FileIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[15px] font-semibold text-base-content group-hover:text-primary transition-colors">{doc.name}</h4>
                  <p className="text-[12px] font-medium text-base-content/50 mt-0.5">
                    {doc.mimeType} • Modified {formatDistanceToNow(doc.updatedAt)} ago
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-base-content/80">{(doc.sizeBytes / 1024 / 1024).toFixed(2)} MB</p>
                <div className="badge badge-ghost badge-sm mt-1 uppercase text-[10px] font-bold tracking-wider opacity-70">
                  {doc.processingJob?.status || doc.scanStatus}
                </div>
              </div>
            </Link>
          ))}
          {recentDocs.length === 0 && (
             <div className="text-center py-12 bg-base-200 border border-base-300 border-dashed rounded-2xl">
               <div className="w-16 h-16 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-4 text-base-content/40">
                 <FileText className="w-8 h-8" />
               </div>
               <p className="text-sm font-medium text-base-content/60">No documents found.</p>
             </div>
          )}
        </div>
      </main>

      {/* 3. RIGHT SIDEBAR (Functional Widgets) */}
      <aside className="w-[320px] bg-base-100 rounded-3xl shrink-0 border border-base-300 shadow-sm flex flex-col overflow-hidden relative animate-in fade-in slide-in-from-right-8 duration-700 delay-200 fill-mode-both">
        <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="p-6 pb-4 flex-1 overflow-y-auto custom-scrollbar">
          
          {/* Storage Stats */}
          <div className="mb-8">
            <h3 className="font-bold text-[15px] tracking-tight text-base-content mb-4 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-primary" /> Storage Metrics
            </h3>
            <div className="bg-base-200 rounded-2xl p-5 border border-base-300 shadow-sm">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-[10px] font-bold text-base-content/50 mb-1 uppercase tracking-wider">Used Space</p>
                  <p className="text-2xl font-black text-base-content">
                    {(totalStorage / 1024 / 1024).toFixed(1)}<span className="text-primary text-sm font-bold ml-1">MB</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-base-content/50 mb-1 uppercase tracking-wider">Limit</p>
                  <p className="text-sm font-bold text-base-content/80">5 GB</p>
                </div>
              </div>
              <progress className="progress progress-primary w-full bg-base-300" value={Math.max(1, storagePercentage)} max="100"></progress>
            </div>
          </div>

          <div className="divider text-base-content/20 my-2"></div>

          {/* Quick Actions */}
          <div>
            <h3 className="font-bold text-[15px] tracking-tight text-base-content mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/dashboard/projects" className="btn btn-ghost border border-base-300 w-full h-auto p-4 rounded-2xl justify-between group bg-base-200 hover:bg-base-300 hover:border-primary/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                    <FolderKanban className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-base-content group-hover:text-primary transition-colors">New Project</span>
                </div>
                <Plus className="w-5 h-5 text-base-content/40 group-hover:text-primary transition-colors" />
              </Link>
              
              <Link href="/dashboard/documents" className="btn btn-ghost border border-base-300 w-full h-auto p-4 rounded-2xl justify-between group bg-base-200 hover:bg-base-300 hover:border-primary/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-base-content group-hover:text-primary transition-colors">Upload Document</span>
                </div>
                <Plus className="w-5 h-5 text-base-content/40 group-hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
