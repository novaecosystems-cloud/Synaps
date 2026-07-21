'use client';

import React, { useState } from 'react';
import { TaskStatus } from '@prisma/client';
import { updateTaskStatus, addTaskNote, deleteTask } from '@/app/actions/task';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { 
  CheckSquare, 
  MoreVertical, 
  MessageSquare, 
  Calendar as CalendarIcon,
  Trash2,
  Send,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

export function TaskItem({ task }: { task: any }) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);

  const handleStatusChange = async (status: TaskStatus) => {
    setIsUpdating(true);
    const res = await updateTaskStatus(task.id, status);
    if (res.success) {
      toast({ title: 'Task updated' });
      router.refresh();
    } else {
      toast({ title: 'Error', description: res.error, variant: 'destructive' });
    }
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    setIsUpdating(true);
    const res = await deleteTask(task.id);
    if (res.success) {
      toast({ title: 'Task deleted' });
      router.refresh();
    } else {
      toast({ title: 'Error', description: res.error, variant: 'destructive' });
    }
    setIsUpdating(false);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsAddingNote(true);
    const res = await addTaskNote(task.id, newNote);
    if (res.success) {
      setNewNote('');
      router.refresh();
    } else {
      toast({ title: 'Error', description: res.error, variant: 'destructive' });
    }
    setIsAddingNote(false);
  };

  const getStatusColor = (status: TaskStatus) => {
    switch(status) {
      case 'INCOMPLETE': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'ACTIVE': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'DONE': return 'text-green-500 bg-green-500/10 border-green-500/20';
    }
  };

  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'DONE';

  return (
    <div className={cn(
      "rounded-lg border bg-[#0A0A0E] overflow-hidden transition-all",
      isExpanded ? "border-primary/40 shadow-[0_0_15px_rgba(139,92,246,0.1)]" : "border-white/5 hover:border-white/10"
    )}>
      <div className="p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button 
            onClick={() => handleStatusChange(task.status === 'DONE' ? 'INCOMPLETE' : 'DONE')}
            className={cn(
              "flex-shrink-0 h-5 w-5 rounded-md border flex items-center justify-center transition-colors",
              task.status === 'DONE' ? "bg-green-500/20 border-green-500/50 text-green-500" : "border-white/20 hover:border-white/40 text-transparent hover:text-white/20"
            )}
          >
            <CheckSquare className="h-3.5 w-3.5" />
          </button>
          
          <div className="flex flex-col min-w-0 flex-1 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <span className={cn(
              "text-sm font-medium truncate transition-colors",
              task.status === 'DONE' ? "text-muted-foreground line-through" : "text-foreground"
            )}>
              {task.title}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn("text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wider font-semibold", getStatusColor(task.status))}>
                {task.status}
              </span>
              {task.deadline && (
                <div className={cn("flex items-center gap-1 text-xs", isOverdue ? "text-red-400" : "text-muted-foreground")}>
                  {isOverdue ? <AlertCircle className="h-3 w-3" /> : <CalendarIcon className="h-3 w-3" />}
                  {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              )}
              {task.notes?.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                  <MessageSquare className="h-3 w-3" />
                  {task.notes.length}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center">
          {isUpdating ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-[#0A0A0E] border-white/10">
                <DropdownMenuItem onClick={() => handleStatusChange('INCOMPLETE')} className="cursor-pointer text-white hover:bg-white/10">Mark Incomplete</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('ACTIVE')} className="cursor-pointer text-white hover:bg-white/10">Mark Active</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('DONE')} className="cursor-pointer text-white hover:bg-white/10">Mark Done</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={handleDelete} className="text-destructive cursor-pointer focus:bg-destructive/10">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-3 pt-0 border-t border-white/5 bg-black/40">
          <div className="space-y-3 mt-3">
            {task.notes?.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                {task.notes.map((note: any) => (
                  <div key={note.id} className="bg-white/5 p-2 rounded-md border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary">
                        {note.user.name?.charAt(0) || 'U'}
                      </div>
                      <span className="text-xs font-medium text-white/80">{note.user.name}</span>
                      <span className="text-[10px] text-muted-foreground ml-auto">
                        {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground pl-7">{note.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-2">No notes yet.</p>
            )}
            
            <form onSubmit={handleAddNote} className="flex gap-2">
              <Input 
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                className="h-8 text-xs bg-black/50 border-white/10 focus-visible:ring-1 focus-visible:ring-primary"
              />
              <Button type="submit" size="icon" className="h-8 w-8 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30" disabled={!newNote.trim() || isAddingNote}>
                {isAddingNote ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
