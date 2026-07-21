'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectStatus } from '@prisma/client';
import { createProject, updateProject } from '@/app/actions/project';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  editProject?: any; // If provided, acts as an edit modal
}

export function CreateProjectModal({ isOpen, onClose, editProject }: CreateProjectModalProps) {
  const router = useRouter();
  const [name, setName] = useState(editProject?.name || '');
  const [description, setDescription] = useState(editProject?.description || '');
  const [status, setStatus] = useState<ProjectStatus>(editProject?.status || 'DRAFT');
  const [budget, setBudget] = useState(editProject?.metadata?.budget || '');
  const [currency, setCurrency] = useState(editProject?.metadata?.currency || 'USD');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    const metadata = { 
      ...(editProject?.metadata || {}), 
      budget: budget ? parseFloat(budget) : 0, 
      currency 
    };

    let result;
    if (editProject) {
      result = await updateProject(editProject.id, { name, description, status, metadata });
    } else {
      result = await createProject({ name, description, status, metadata });
    }

    if (result.success) {
      toast({ 
        title: 'Success', 
        description: `Project ${editProject ? 'updated' : 'created'} successfully.` 
      });
      router.refresh();
      onClose();
    } else {
      toast({ title: 'Error', description: result.error, variant: 'destructive' });
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-card w-full max-w-md rounded-xl shadow-[0_0_40px_rgba(139,92,246,0.1)] border border-border overflow-hidden animate-in zoom-in-95 duration-200 glass-panel">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
          <h2 className="text-lg font-semibold text-foreground">{editProject ? 'Edit Project' : 'Create New Project'}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-muted text-muted-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name <span className="text-destructive">*</span></Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Downtown Highrise" 
              required
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Brief overview of the project..."
              className="resize-none h-20 bg-background"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-muted-foreground">Status</Label>
              <select 
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-foreground"
              >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-muted-foreground">Budget</Label>
              <div className="flex gap-2">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="flex h-9 w-20 rounded-md border border-input bg-background px-2 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-foreground"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
                <Input 
                  id="budget" 
                  type="number"
                  value={budget} 
                  onChange={(e) => setBudget(e.target.value)} 
                  placeholder="100000" 
                  className="bg-background flex-1"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading} className="hover:bg-muted">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editProject ? 'Save Changes' : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
