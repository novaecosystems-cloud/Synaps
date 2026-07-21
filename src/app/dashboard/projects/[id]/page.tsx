import { getProjectDetails } from '@/app/actions/project';
import { ProjectDashboardClient } from './client';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';

export default async function ProjectDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getProjectDetails(id);

  if (!result.success) {
    if (result.error === 'Unauthorized') {
      redirect('/login');
    }
    if (result.error === 'Project not found') {
      notFound();
    }
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="text-center bg-destructive/10 p-8 rounded-xl border border-destructive/20">
          <h2 className="text-xl font-semibold text-destructive mb-2">Failed to load project</h2>
          <p className="text-destructive/80">{result.error}</p>
        </div>
      </div>
    );
  }

  return <ProjectDashboardClient project={result.project} />;
}
