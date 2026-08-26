'use client';

import { useState } from 'react';
import { useBackgroundTasks } from '@/context/BackgroundTaskContext';
import { Activity, CheckCircle2, AlertCircle, FileText, Table } from 'lucide-react';

export default function BackgroundTaskWidget() {
  const { tasks, runningCount, downloadTaskPDF, downloadTaskCSV, clearCompletedTasks } = useBackgroundTasks();
  const [open, setOpen] = useState(false);

  if (tasks.length === 0) return null;

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
          runningCount > 0
            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400 animate-pulse'
            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
        }`}
      >
        <Activity className={`w-3.5 h-3.5 ${runningCount > 0 ? 'animate-spin' : ''}`} />
        <span>
          {runningCount > 0 ? `${runningCount} Task${runningCount > 1 ? 's' : ''} Running...` : `${tasks.length} Task${tasks.length > 1 ? 's' : ''} Active`}
        </span>
      </button>

      {open && (
        <div onClick={() => setOpen(false)} className="fixed inset-0 z-40" />
      )}

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase">
              BACKGROUND AI TASKS ({tasks.length})
            </span>
            {tasks.some(t => t.status !== 'RUNNING') && (
              <button
                onClick={clearCompletedTasks}
                className="text-[10px] text-slate-500 hover:text-slate-300 underline"
              >
                Clear Finished
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {task.status === 'RUNNING' && (
                      <Activity className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    )}
                    {task.status === 'COMPLETED' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    {task.status === 'FAILED' && (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    <span className="text-xs font-bold text-slate-200 truncate max-w-[170px]">
                      {task.name}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {task.category}
                  </span>
                </div>

                {task.status === 'RUNNING' && (
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 animate-pulse w-3/4" />
                  </div>
                )}

                {task.status === 'COMPLETED' && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                    <span className="text-[10px] text-emerald-400 font-semibold">✓ Completed</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => downloadTaskPDF(task)}
                        className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded hover:bg-emerald-500/30 flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" /> PDF
                      </button>
                      <button
                        onClick={() => downloadTaskCSV(task)}
                        className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 rounded hover:bg-indigo-500/30 flex items-center gap-1"
                      >
                        <Table className="w-3 h-3" /> CSV
                      </button>
                    </div>
                  </div>
                )}

                {task.status === 'FAILED' && (
                  <span className="text-[10px] text-rose-400 font-semibold">❌ {task.error || 'Failed'}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
