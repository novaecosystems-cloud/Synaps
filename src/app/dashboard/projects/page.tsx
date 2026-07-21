import { getProjects } from '@/app/actions/project';
import { ProjectListClient } from './client';
import { redirect } from 'next/navigation';

export default async function ProjectsPage() {
  const result = await getProjects();

  if (!result.success) {
    // If not authenticated or error, redirect or show error
    if (result.error === 'Unauthorized') {
      redirect('/login');
    }
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading Projects</h2>
          <p className="text-muted-foreground">{result.error}</p>
        </div>
      </div>
    );
  }

  return <ProjectListClient initialProjects={result.projects || []} />;
}
