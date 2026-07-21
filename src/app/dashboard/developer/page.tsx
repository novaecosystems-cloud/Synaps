import DeveloperClient from './client';
import { getVectorStats } from '@/app/actions/developer';

export default async function DeveloperPage() {
  const stats = await getVectorStats();
  
  return (
    <div className="p-8 max-w-5xl mx-auto text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-light mb-2">Developer Debug</h1>
        <p className="text-white/40">Manage and inspect RAG embeddings, vector storage, and chunking.</p>
      </div>
      <DeveloperClient initialStats={stats} />
    </div>
  );
}
