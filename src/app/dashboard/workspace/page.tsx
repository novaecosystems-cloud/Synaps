import { getWorkspaceDocuments } from '@/app/actions/workspace';
import WorkspaceClient from './client';

export default async function WorkspacePage() {
  const documents = await getWorkspaceDocuments();
  
  return (
    <div className="h-full flex flex-col p-4 bg-gradient-to-br from-[#0a0a0f] to-[#12121a]">
      <div className="mb-4 shrink-0 flex items-center justify-between tour-workspace-container">
        <div>
          <h1 className="text-2xl font-light text-white mb-1 tracking-tight">AI Workspace</h1>
          <p className="text-white/40 text-xs">Retrieval-Augmented Generation (RAG) Environment</p>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono">
          MODEL: SYNAPS-v1 (Retrieval Mode)
        </div>
      </div>
      
      <div className="flex-1 min-h-0">
        <WorkspaceClient initialDocuments={documents} />
      </div>
    </div>
  );
}
