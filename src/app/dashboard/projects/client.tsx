'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ProjectStatus } from '@prisma/client';
import { CreateProjectModal } from '@/components/projects/create-project-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, MoreVertical, FolderKanban, Calendar, Users, Archive, Trash2 } from 'lucide-react';
import { deleteProject } from '@/app/actions/project';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ActionMenu } from '@/components/ui/action-menu';

export function ProjectListClient({ initialProjects }: { initialProjects: any[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editProject, setEditProject] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const filteredProjects = useMemo(() => {
    return initialProjects.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [initialProjects, search, statusFilter]);

  const handleDelete = async () => {
    if (!deletingId) return;
    const result = await deleteProject(deletingId);
    if (result.success) {
      toast({ title: 'Project deleted', description: 'The project was successfully removed.' });
      router.refresh();
    } else {
      toast({ title: 'Error', description: result.error, variant: 'destructive' });
    }
    setDeletingId(null);
    setIsDeleteDialogOpen(false);
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'DRAFT': return 'badge-ghost';
      case 'ACTIVE': return 'badge-success badge-outline';
      case 'COMPLETED': return 'badge-info badge-outline';
      case 'ARCHIVED': return 'badge-secondary badge-outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 tour-projects-header">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-base-content">Projects</h1>
          <p className="text-base-content/60 text-sm">Manage all your construction operations</p>
        </div>
        
        <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary w-full sm:w-auto shadow-sm">
          <Plus className="h-4 w-4" /> New Project
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/40" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-full pl-9 bg-base-100 focus:bg-base-100 transition-colors"
          />
        </div>
        
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="select select-bordered w-full sm:w-[180px] bg-base-100"
        >
          <option value="ALL">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <EmptyState 
          icon={FolderKanban}
          title="No projects found"
          description={search ? "Try adjusting your search or filters." : "Get started by creating your first project."}
          actionLabel={!search ? "Create Project" : undefined}
          onAction={!search ? () => setIsCreateModalOpen(true) : undefined}
        />
      )}

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Link 
            href={`/dashboard/projects/${project.id}`} 
            key={project.id}
            className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md hover:border-primary/40 transition-all group overflow-hidden"
          >
            <div className="card-body p-5">
              <div className="flex justify-between items-start mb-2">
                <div className={`badge ${getStatusColor(project.status)} text-xs font-semibold uppercase tracking-wider py-2.5`}>
                  {project.status}
                </div>
                
                <div className="flex gap-1" onClick={(e) => e.preventDefault()}>
                  <ActionMenu 
                    onEdit={() => { setEditProject(project); setIsCreateModalOpen(true); }}
                    onDelete={() => { setDeletingId(project.id); setIsDeleteDialogOpen(true); }}
                    onMembers={() => { setEditProject(project); setIsCreateModalOpen(true); }}
                    onSettings={() => { setEditProject(project); setIsCreateModalOpen(true); }}
                  />
                </div>
              </div>
              
              <h3 className="card-title text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1 text-base-content">{project.name}</h3>
              <p className="text-sm text-base-content/60 line-clamp-2 min-h-[2.5rem]">
                {project.description || 'No description provided.'}
              </p>
            </div>
            <div className="px-5 py-3 border-t border-base-300 bg-base-200/50 flex items-center justify-between text-xs text-base-content/60 font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(project.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {project.members.length} member{project.members.length !== 1 && 's'}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <CreateProjectModal 
        isOpen={isCreateModalOpen} 
        onClose={() => { setIsCreateModalOpen(false); setEditProject(null); }}
        editProject={editProject}
      />
      
      <ConfirmDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => { setIsDeleteDialogOpen(false); setDeletingId(null); }}
        onConfirm={handleDelete}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone and will remove all associated documents, requirements, and workflows."
        confirmText="Delete Project"
        variant="destructive"
      />
    </div>
  );
}
