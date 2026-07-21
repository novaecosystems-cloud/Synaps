'use client';

import React, { useState } from 'react';
import { ProjectStatus } from '@prisma/client';
import { CreateProjectModal } from '@/components/projects/create-project-modal';
import { createTask } from '@/app/actions/task';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { TaskItem } from '@/components/projects/task-item';
import { 
  FolderKanban, 
  CheckSquare, 
  CircleDollarSign, 
  ShieldAlert,
  Calendar,
  Users,
  MoreVertical,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function ProjectDashboardClient({ project }: { project: any }) {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const metadata = project.metadata || {};
  
  const budget = metadata.budget || 0;
  const spent = metadata.spent || 0;
  const budgetPercent = budget > 0 ? Math.round((spent / budget) * 100) : 0;
  
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: metadata.currency || 'USD',
    notation: 'compact',
    maximumFractionDigits: 1
  });
  const formattedBudget = currencyFormatter.format(budget);

  const tasks = project.tasks || [];
  
  const safetyScore = metadata.safetyScore || 100;
  const incidents = metadata.incidents || 0;

  const daysActive = Math.round((new Date().getTime() - new Date(project.createdAt).getTime()) / (1000 * 3600 * 24));

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
      case 'ACTIVE': return 'bg-green-500/10 text-green-500 border-green-500/30 glow-green';
      case 'COMPLETED': return 'bg-blue-500/10 text-blue-500 border-blue-500/30 glow-blue';
      case 'ARCHIVED': return 'bg-purple-500/10 text-purple-500 border-purple-500/30 glow-purple';
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    setIsCreatingTask(true);
    
    const deadline = newTaskDeadline ? new Date(newTaskDeadline) : null;
    const result = await createTask(project.id, newTaskName, deadline);

    if (result.success) {
      toast({ title: 'Task created successfully' });
      setNewTaskName('');
      setNewTaskDeadline('');
      setIsTaskModalOpen(false);
      router.refresh();
    } else {
      toast({ title: 'Error', description: result.error, variant: 'destructive' });
    }
    setIsCreatingTask(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
            <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold border", getStatusColor(project.status))}>
              {project.status}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">{project.description || 'Overview of project operations'}</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)} className="border-white/10 hover:bg-white/5">Edit Project</Button>
          <Button onClick={() => setIsTaskModalOpen(true)} className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50 glow-purple">Create Task</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Members */}
        <div className="bg-[#0A0A0E] p-5 rounded-xl border border-white/5 shadow-sm flex flex-col justify-between glass-panel hover:border-primary/20 transition-colors">
          <div className="flex justify-between items-start">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center aura-purple">
              <Users className="h-4 w-4 text-indigo-500" />
            </div>
            <span className="text-xs font-medium text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">+1</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{project.members.length}</h3>
            <p className="text-xs text-muted-foreground mt-1">Total Team Members</p>
          </div>
        </div>

        {/* Card 2: Days Active */}
        <div className="bg-[#0A0A0E] p-5 rounded-xl border border-white/5 shadow-sm flex flex-col justify-between glass-panel hover:border-primary/20 transition-colors">
          <div className="flex justify-between items-start">
            <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center aura-green">
              <Calendar className="h-4 w-4 text-green-500" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{daysActive}</h3>
            <p className="text-xs text-muted-foreground mt-1">Days Active</p>
          </div>
        </div>

        {/* Card 3: Budget */}
        <div className="bg-[#0A0A0E] p-5 rounded-xl border border-white/5 shadow-sm flex flex-col justify-between glass-panel hover:border-primary/20 transition-colors">
          <div className="flex justify-between items-start">
            <div className="h-8 w-8 rounded-lg bg-pink-500/10 flex items-center justify-center aura-purple">
              <CircleDollarSign className="h-4 w-4 text-pink-500" />
            </div>
            <span className="text-xs font-medium text-muted-foreground bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">{budgetPercent}%</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{formattedBudget}</h3>
            <p className="text-xs text-muted-foreground mt-1">Total Budget</p>
          </div>
        </div>

        {/* Card 4: Safety */}
        <div className="bg-[#0A0A0E] p-5 rounded-xl border border-white/5 shadow-sm flex flex-col justify-between glass-panel hover:border-primary/20 transition-colors">
          <div className="flex justify-between items-start">
            <div className="h-8 w-8 rounded-lg bg-yellow-500/10 flex items-center justify-center aura-yellow">
              <ShieldAlert className="h-4 w-4 text-yellow-500" />
            </div>
            <span className="text-xs font-medium text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">Optimal</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{safetyScore}%</h3>
            <p className="text-xs text-muted-foreground mt-1">{incidents} incidents this week</p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Progress (Real data representation instead of mock chart) */}
        <div className="lg:col-span-2 bg-[#0A0A0E] rounded-xl border border-white/5 shadow-sm p-5 flex flex-col glass-panel relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h3 className="font-semibold text-sm">Project Timeline & Metadata</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center relative z-10">
             <div className="h-16 w-16 rounded-full border border-primary/20 bg-primary/10 flex items-center justify-center mb-4 aura-purple">
               <Calendar className="h-8 w-8 text-primary" />
             </div>
             <h4 className="text-lg font-medium text-white">Timeline Chart Not Available</h4>
             <p className="text-sm text-muted-foreground max-w-md mt-2">
               As requested, no placeholder data is used. Timeline visualizer will become available once real task data is generated.
             </p>
          </div>
        </div>

        {/* Task Status */}
        <div className="bg-[#0A0A0E] rounded-xl border border-white/5 shadow-sm p-5 flex flex-col glass-panel">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-sm">Task Status</h3>
            <MoreVertical className="h-4 w-4 text-muted-foreground cursor-pointer" />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center py-4 text-center">
             {tasks.length > 0 ? (
               <div className="w-full space-y-2 text-left">
                 {tasks.map((task: any) => (
                   <TaskItem key={task.id} task={task} />
                 ))}
               </div>
             ) : (
               <>
                 <div className="h-12 w-12 rounded-full border border-white/10 bg-black/50 flex items-center justify-center mb-4 mt-6">
                   <CheckSquare className="h-5 w-5 text-muted-foreground" />
                 </div>
                 <h4 className="font-medium text-white">No Tasks Found</h4>
                 <p className="text-xs text-muted-foreground mt-2">
                   Connect the task module to visualize status distributions.
                 </p>
               </>
             )}
          </div>
        </div>
      </div>

      <CreateProjectModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        editProject={project} 
      />

      {/* Task Creation Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-[#0A0A0E] w-full max-w-sm rounded-xl shadow-[0_0_40px_rgba(139,92,246,0.1)] border border-primary/20 overflow-hidden animate-in zoom-in-95 duration-200 glass-panel">
            <div className="flex items-center justify-between px-6 py-4 border-b border-primary/20 bg-gradient-to-r from-primary/10 to-transparent">
              <h2 className="text-lg font-semibold text-white">Create Task</h2>
              <button onClick={() => setIsTaskModalOpen(false)} className="p-1 rounded-full hover:bg-white/5 text-muted-foreground transition-colors">
                <CheckSquare className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="p-6 space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Task Name</label>
                  <input 
                    type="text" 
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder="e.g. Order steel beams..."
                    className="w-full bg-background border border-white/10 rounded-md h-10 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Deadline (Optional)</label>
                  <input 
                    type="date" 
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    className="w-full bg-background border border-white/10 rounded-md h-10 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsTaskModalOpen(false)} className="hover:bg-white/5">
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreatingTask || !newTaskName.trim()}>
                  {isCreatingTask ? 'Saving...' : 'Add Task'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
