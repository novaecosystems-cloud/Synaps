"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Filter, AlertTriangle, CheckCircle2, 
  Clock, Shield, ArrowRight, ArrowLeft, Trash2, User,
  Bot, Tag, Sparkles, RefreshCw, X, FileText, Check
} from "lucide-react";

interface ActionTask {
  id: string;
  title: string;
  description: string;
  status: "P0_BLOCKER" | "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  priority: "P0" | "P1" | "P2" | "P3";
  assigneeName: string;
  assigneeType: "AI" | "HUMAN";
  causalEvidence?: string;
  tags: string[];
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

const COLUMNS: { id: ActionTask["status"]; label: string; icon: any; color: string; bg: string; border: string }[] = [
  { id: "P0_BLOCKER", label: "P0 BLOCKERS", icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-950/20", border: "border-rose-900/40" },
  { id: "TODO", label: "TO DO / BACKLOG", icon: Clock, color: "text-blue-400", bg: "bg-blue-950/20", border: "border-blue-900/40" },
  { id: "IN_PROGRESS", label: "IN PROGRESS", icon: RefreshCw, color: "text-amber-400", bg: "bg-amber-950/20", border: "border-amber-900/40" },
  { id: "IN_REVIEW", label: "BOARD REVIEW", icon: Shield, color: "text-purple-400", bg: "bg-purple-950/20", border: "border-purple-900/40" },
  { id: "DONE", label: "RESOLVED", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-950/20", border: "border-emerald-900/40" },
];

export function ProjectListClient({ initialProjects }: { initialProjects?: any[] }) {
  const [tasks, setTasks] = useState<ActionTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  
  // New task form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<"P0" | "P1" | "P2" | "P3">("P1");
  const [newStatus, setNewStatus] = useState<ActionTask["status"]>("TODO");
  const [newAssigneeName, setNewAssigneeName] = useState("AI: CTO Twin");
  const [newAssigneeType, setNewAssigneeType] = useState<"AI" | "HUMAN">("AI");
  const [newTags, setNewTags] = useState("Infrastructure, Database");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/action-tasks");
      const data = await res.json();
      if (data.success && data.tasks) {
        setTasks(data.tasks);
      }
    } catch (err) {
      console.error("Failed to load action tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const payload = {
        title: newTitle,
        description: newDescription,
        priority: newPriority,
        status: newStatus,
        assigneeName: newAssigneeName,
        assigneeType: newAssigneeType,
        causalEvidence: "100% SHA-256 Grounded via Causarix OS",
        tags: newTags.split(",").map(t => t.trim()).filter(Boolean)
      };

      const res = await fetch("/api/action-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.task) {
        setTasks(prev => [data.task, ...prev]);
        setIsCreateModalOpen(false);
        setNewTitle("");
        setNewDescription("");
      }
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  const handleMoveStatus = async (taskId: string, direction: "next" | "prev") => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const statusOrder: ActionTask["status"][] = ["P0_BLOCKER", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
    const currentIndex = statusOrder.indexOf(task.status);
    let nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex < 0 || nextIndex >= statusOrder.length) return;
    const newStatusVal = statusOrder[nextIndex];

    // Optimistic UI Update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatusVal } : t));

    try {
      await fetch("/api/action-tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, status: newStatusVal })
      });
    } catch (err) {
      console.error("Failed to update status:", err);
      fetchTasks();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    try {
      await fetch(`/api/action-tasks?id=${taskId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete task:", err);
      fetchTasks();
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === "ALL" || t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "P0": return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-900/40 text-rose-300 border border-rose-700/50 animate-pulse">P0 BLOCKER</span>;
      case "P1": return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-900/40 text-amber-300 border border-amber-700/50">P1 HIGH</span>;
      case "P2": return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-900/40 text-blue-300 border border-blue-700/50">P2 NORMAL</span>;
      default: return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">P3 LOW</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#07080B] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      {/* ── HEADER TITLE & CONTROLS ────────────────────────────────────────── */}
      <div className="max-w-[1700px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-primary/20 text-primary border border-primary/40">
                AUTONOMOUS ACTION BOARD
              </span>
              <span className="text-xs text-slate-400 font-mono">SOVEREIGN JIRA REPLACEMENT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
              Mission Action & Incident Board
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Autonomous ticket triage and execution directly from 10-Agent Boardroom & SCM Simulations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(45,78,255,0.3)] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Action Ticket</span>
            </button>

            <button
              onClick={fetchTasks}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Refresh board"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* ── METRICS SUMMARY BAR ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-[#0D0F17] border border-slate-800/80 rounded-2xl p-4">
            <div className="text-[11px] font-mono text-slate-400">TOTAL TICKETS</div>
            <div className="text-2xl font-black text-white mt-1">{tasks.length}</div>
          </div>
          <div className="bg-[#0D0F17] border border-rose-900/30 rounded-2xl p-4">
            <div className="text-[11px] font-mono text-rose-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              P0 BLOCKERS
            </div>
            <div className="text-2xl font-black text-rose-400 mt-1">
              {tasks.filter(t => t.status === "P0_BLOCKER").length}
            </div>
          </div>
          <div className="bg-[#0D0F17] border border-amber-900/30 rounded-2xl p-4">
            <div className="text-[11px] font-mono text-amber-400">IN PROGRESS</div>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {tasks.filter(t => t.status === "IN_PROGRESS").length}
            </div>
          </div>
          <div className="bg-[#0D0F17] border border-purple-900/30 rounded-2xl p-4">
            <div className="text-[11px] font-mono text-purple-400">BOARD REVIEW</div>
            <div className="text-2xl font-black text-purple-400 mt-1">
              {tasks.filter(t => t.status === "IN_REVIEW").length}
            </div>
          </div>
          <div className="bg-[#0D0F17] border border-emerald-900/30 rounded-2xl p-4">
            <div className="text-[11px] font-mono text-emerald-400">RESOLVED & PROVEN</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {tasks.filter(t => t.status === "DONE").length}
            </div>
          </div>
        </div>

        {/* ── FILTER & SEARCH BAR ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0D0F17] border border-slate-800/80 rounded-2xl p-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search tickets by ID, title, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#12141F] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Filter className="w-3 h-3" /> Priority:
            </span>
            {["ALL", "P0", "P1", "P2", "P3"].map(p => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                  priorityFilter === p 
                    ? "bg-primary text-white" 
                    : "bg-[#12141F] text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* ── 5-COLUMN KANBAN BOARD ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {COLUMNS.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            const Icon = col.icon;

            return (
              <div
                key={col.id}
                className={`flex flex-col rounded-2xl bg-[#0D0F17] border ${col.border} p-3.5 min-h-[600px]`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${col.color}`} />
                    <h3 className={`text-xs font-mono font-bold tracking-wider ${col.color}`}>
                      {col.label}
                    </h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${col.bg} ${col.color} border ${col.border}`}>
                    {colTasks.length}
                  </span>
                </div>

                {/* Task Cards Feed */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {colTasks.length === 0 ? (
                    <div className="h-36 flex flex-col items-center justify-center text-center text-slate-600 border border-dashed border-slate-800/80 rounded-xl p-4">
                      <span className="text-xs">No active tickets</span>
                    </div>
                  ) : (
                    colTasks.map(task => (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#12141F] border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 space-y-3 shadow-md hover:shadow-lg transition-all group"
                      >
                        {/* Top ID & Priority Row */}
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-bold text-primary">
                            {task.id}
                          </span>
                          {getPriorityBadge(task.priority)}
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h4 className="text-xs font-bold text-white leading-snug group-hover:text-cyan-400 transition-colors">
                            {task.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                            {task.description}
                          </p>
                        </div>

                        {/* SCM Causal Evidence Snippet */}
                        {task.causalEvidence && (
                          <div className="p-2 rounded-lg bg-[#0A0B10] border border-slate-800/80 text-[10px] text-slate-400 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span className="truncate">{task.causalEvidence}</span>
                          </div>
                        )}

                        {/* Tags */}
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {task.tags.map((tag, idx) => (
                              <span key={idx} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Bottom Assignee & Quick Shift Controls */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                          {/* Assignee Badge */}
                          <div className="flex items-center gap-1.5">
                            {task.assigneeType === "AI" ? (
                              <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-700 flex items-center justify-center text-cyan-300">
                                <Bot className="w-3 h-3" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-blue-950 border border-blue-700 flex items-center justify-center text-blue-300">
                                <User className="w-3 h-3" />
                              </div>
                            )}
                            <span className="text-[10px] font-medium text-slate-300 truncate max-w-[80px]">
                              {task.assigneeName}
                            </span>
                          </div>

                          {/* Quick Shift Controls */}
                          <div className="flex items-center gap-1">
                            {col.id !== "P0_BLOCKER" && (
                              <button
                                onClick={() => handleMoveStatus(task.id, "prev")}
                                className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                                title="Move to previous column"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}
                            {col.id !== "DONE" && (
                              <button
                                onClick={() => handleMoveStatus(task.id, "next")}
                                className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                                title="Move to next column"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-1 rounded bg-slate-800/80 hover:bg-rose-950 text-slate-500 hover:text-rose-400 transition-colors"
                              title="Delete ticket"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CREATE NEW ACTION TICKET MODAL ─────────────────────────────────── */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#0D0F17] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Create Action Ticket</h3>
                  <p className="text-xs text-slate-400">Autonomous ticket creation with zero static fixation.</p>
                </div>
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="text-xs font-mono font-bold text-slate-400 block mb-1">
                    TICKET TITLE *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Scale database connection pool from 100 to 450"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-[#12141F] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-slate-400 block mb-1">
                    ACTION DESCRIPTION
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe the problem, evidence, and required engineering mitigation..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full bg-[#12141F] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-400 block mb-1">
                      PRIORITY LEVEL
                    </label>
                    <select
                      value={newPriority}
                      onChange={(e: any) => setNewPriority(e.target.value)}
                      className="w-full bg-[#12141F] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                    >
                      <option value="P0">P0 - EMERGENCY BLOCKER</option>
                      <option value="P1">P1 - HIGH PRIORITY</option>
                      <option value="P2">P2 - NORMAL</option>
                      <option value="P3">P3 - LOW</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-400 block mb-1">
                      INITIAL STATUS
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e: any) => setNewStatus(e.target.value)}
                      className="w-full bg-[#12141F] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                    >
                      <option value="P0_BLOCKER">🚨 P0 BLOCKER</option>
                      <option value="TODO">📋 TO DO</option>
                      <option value="IN_PROGRESS">⚡ IN PROGRESS</option>
                      <option value="IN_REVIEW">🏛️ BOARD REVIEW</option>
                      <option value="DONE">✅ DONE</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-400 block mb-1">
                      ASSIGNEE
                    </label>
                    <input
                      type="text"
                      value={newAssigneeName}
                      onChange={(e) => setNewAssigneeName(e.target.value)}
                      className="w-full bg-[#12141F] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-400 block mb-1">
                      ASSIGNEE TYPE
                    </label>
                    <select
                      value={newAssigneeType}
                      onChange={(e: any) => setNewAssigneeType(e.target.value)}
                      className="w-full bg-[#12141F] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                    >
                      <option value="AI">🤖 Autonomous AI Worker</option>
                      <option value="HUMAN">👤 Human Engineer / Lead</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-slate-400 block mb-1">
                    TAGS (COMMA-SEPARATED)
                  </label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full bg-[#12141F] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-lg"
                  >
                    Create Action Ticket
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
