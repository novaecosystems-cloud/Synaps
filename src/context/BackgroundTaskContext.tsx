'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { downloadAsPDF, downloadAsCSV } from '@/lib/export-helpers';

export interface BackgroundTask {
  id: string;
  name: string;
  category: string;
  progress: number;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED';
  resultData?: any;
  error?: string;
  startedAt: Date;
}

interface BackgroundTaskContextType {
  tasks: BackgroundTask[];
  runningCount: number;
  startTask: <T>(name: string, category: string, taskFn: () => Promise<T>) => Promise<T>;
  downloadTaskPDF: (task: BackgroundTask) => void;
  downloadTaskCSV: (task: BackgroundTask) => void;
  clearCompletedTasks: () => void;
}

const BackgroundTaskContext = createContext<BackgroundTaskContextType | undefined>(undefined);

export function BackgroundTaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<BackgroundTask[]>([]);
  const { toast } = useToast();

  const startTask = useCallback(async <T,>(name: string, category: string, taskFn: () => Promise<T>): Promise<T> => {
    const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newTask: BackgroundTask = {
      id: taskId,
      name,
      category,
      progress: 10,
      status: 'RUNNING',
      startedAt: new Date()
    };

    setTasks(prev => [newTask, ...prev]);

    toast({
      title: `⚡ Task Started: ${name}`,
      description: `Running in background. You can switch pages freely; you will be notified when complete.`
    });

    try {
      const result = await taskFn();

      setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
          return { ...t, status: 'COMPLETED', progress: 100, resultData: result };
        }
        return t;
      }));

      // Play subtle completion chime / toast
      toast({
        title: `🎉 Task Completed: ${name}`,
        description: `Analysis completed successfully. Use the export options to download PDF or CSV.`,
        action: (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                downloadAsPDF({
                  title: `${name} — AI Output Report`,
                  subtitle: `Category: ${category}`,
                  sections: [
                    {
                      heading: 'AI Output Summary',
                      content: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
                      kvPairs: (typeof result === 'object' && result !== null && !Array.isArray(result)) ? (result as Record<string, any>) : undefined
                    }
                  ]
                });
              }}
              className="px-2.5 py-1 text-xs font-bold bg-emerald-500 text-black rounded hover:bg-emerald-400"
            >
              PDF ↓
            </button>
            <button
              onClick={() => {
                downloadAsCSV(name.toLowerCase().replace(/\s+/g, '-'), result as any);
              }}
              className="px-2.5 py-1 text-xs font-bold bg-slate-700 text-white rounded hover:bg-slate-600"
            >
              CSV ↓
            </button>
          </div>
        )
      });

      return result;
    } catch (err: any) {
      setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
          return { ...t, status: 'FAILED', progress: 0, error: err.message };
        }
        return t;
      }));

      toast({
        title: `❌ Task Failed: ${name}`,
        description: err.message || 'An error occurred during background execution.',
        variant: 'destructive'
      });

      throw err;
    }
  }, [toast]);

  const downloadTaskPDF = useCallback((task: BackgroundTask) => {
    if (!task.resultData) return;
    downloadAsPDF({
      title: `${task.name} — AI Output Report`,
      subtitle: `Category: ${task.category} | Completed: ${new Date(task.startedAt).toLocaleString()}`,
      sections: [
        {
          heading: 'Task Result Details',
          content: typeof task.resultData === 'string' ? task.resultData : JSON.stringify(task.resultData, null, 2),
          kvPairs: typeof task.resultData === 'object' && !Array.isArray(task.resultData) ? task.resultData : undefined
        }
      ]
    });
  }, []);

  const downloadTaskCSV = useCallback((task: BackgroundTask) => {
    if (!task.resultData) return;
    downloadAsCSV(task.name.toLowerCase().replace(/\s+/g, '-'), task.resultData);
  }, []);

  const clearCompletedTasks = useCallback(() => {
    setTasks(prev => prev.filter(t => t.status === 'RUNNING'));
  }, []);

  const runningCount = tasks.filter(t => t.status === 'RUNNING').length;

  return (
    <BackgroundTaskContext.Provider value={{ tasks, runningCount, startTask, downloadTaskPDF, downloadTaskCSV, clearCompletedTasks }}>
      {children}
    </BackgroundTaskContext.Provider>
  );
}

export function useBackgroundTasks() {
  const context = useContext(BackgroundTaskContext);
  if (!context) {
    throw new Error('useBackgroundTasks must be used within a BackgroundTaskProvider');
  }
  return context;
}
