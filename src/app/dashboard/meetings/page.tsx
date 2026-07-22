'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, AlertTriangle, Clock, Calendar, Plus, 
  FileText, Sparkles, Loader2, RefreshCw, ShieldAlert, ArrowUpRight,
  MessageSquare, UserCheck, CheckSquare, Target, ChevronRight, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New meeting form state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [title, setTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [processing, setProcessing] = useState(false);

  // Selected meeting detail modal
  const [selectedMeeting, setSelectedMeeting] = useState<any | null>(null);

  const fetchMeetings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/meetings');
      const json = await res.json();
      if (json.success) {
        setMeetings(json.data);
      } else {
        setError(json.error || 'Failed to load meetings');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching meetings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleProcessMeeting = async () => {
    if (!title.trim() || !textContent.trim() || processing) return;
    setProcessing(true);
    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, textContent })
      });
      const json = await res.json();
      if (json.success) {
        setShowUploadModal(false);
        setTitle('');
        setTextContent('');
        await fetchMeetings();
        setSelectedMeeting(json.data);
      } else {
        alert(`Failed to analyze meeting: ${json.error}`);
      }
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="w-full space-y-8 font-sans pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-base-content">AI Meeting Intelligence</h1>
            <p className="text-xs text-base-content/60">Extract transcripts, speakers, decisions, action items, deadlines & risks into corporate memory.</p>
          </div>
        </div>
        <Button onClick={() => setShowUploadModal(true)} className="gap-2 rounded-2xl">
          <Plus className="w-4 h-4" /> Analyze Meeting
        </Button>
      </div>

      {/* Meetings List */}
      {loading ? (
        <div className="w-full py-16 flex flex-col items-center justify-center text-base-content">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          <p className="text-sm font-medium">Extracting meeting intelligence...</p>
        </div>
      ) : error ? (
        <div className="w-full p-8 text-center bg-base-200 border border-base-300 rounded-3xl">
          <ShieldAlert className="w-10 h-10 text-destructive mx-auto mb-3" />
          <h3 className="text-lg font-bold">Failed to load meetings</h3>
          <p className="text-xs text-base-content/60 max-w-md mx-auto mt-1 mb-4">{error}</p>
          <Button onClick={fetchMeetings} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" /> Retry
          </Button>
        </div>
      ) : meetings.length === 0 ? (
        <div className="w-full py-16 text-center bg-base-100 border border-base-300 border-dashed rounded-3xl space-y-4">
          <Users className="w-12 h-12 text-base-content/30 mx-auto" />
          <div>
            <h3 className="text-lg font-bold text-base-content">No Meetings Analyzed Yet</h3>
            <p className="text-xs text-base-content/60 max-w-md mx-auto mt-1">
              Upload notes or transcripts from your team calls to generate transcripts, action items, and link decisions into the Memory Graph.
            </p>
          </div>
          <Button onClick={() => setShowUploadModal(true)} className="gap-2 rounded-2xl">
            <Sparkles className="w-4 h-4" /> Analyze First Meeting
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((m) => (
            <div 
              key={m.id} 
              onClick={() => setSelectedMeeting(m)}
              className="bg-base-100 border border-base-300 hover:border-primary/40 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                    Meeting Intelligence
                  </span>
                  <span className="text-[11px] text-base-content/50 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(m.date).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-base-content group-hover:text-primary transition-colors leading-snug line-clamp-1">
                  {m.title}
                </h3>
                <p className="text-xs text-base-content/70 line-clamp-3 leading-relaxed">
                  {m.summary}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-base-200 mt-4">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-base-200 p-2 rounded-xl">
                    <span className="font-bold block text-base-content">{m.speakers?.length || 0}</span>
                    <span className="text-[10px] text-base-content/50">Speakers</span>
                  </div>
                  <div className="bg-base-200 p-2 rounded-xl">
                    <span className="font-bold block text-emerald-500">{m.decisions?.length || 0}</span>
                    <span className="text-[10px] text-base-content/50">Decisions</span>
                  </div>
                  <div className="bg-base-200 p-2 rounded-xl">
                    <span className="font-bold block text-amber-500">{m.actionItems?.length || 0}</span>
                    <span className="text-[10px] text-base-content/50">Tasks</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-primary font-bold pt-1">
                  <span>Explore Intelligence</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PROCESS MEETING MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative space-y-4">
            <button onClick={() => setShowUploadModal(false)} className="absolute top-4 right-4 p-2 text-base-content/50 hover:text-base-content">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg text-base-content">Analyze Meeting Recording / Transcript</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-base-content/60 uppercase tracking-wider block mb-1">Meeting Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q3 Strategic Planning & Roadmap Review"
                  className="w-full bg-base-200 border border-base-300 rounded-2xl p-3 text-sm text-base-content outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-base-content/60 uppercase tracking-wider block mb-1">Meeting Notes / Raw Dialogue Transcript</label>
                <textarea 
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  rows={8}
                  placeholder="Paste raw transcript, Zoom/Teams notes, or meeting dialogue text..."
                  className="w-full bg-base-200 border border-base-300 rounded-2xl p-3 text-sm text-base-content outline-none focus:ring-2 focus:ring-primary/20 custom-scrollbar resize-none"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button onClick={() => setShowUploadModal(false)} variant="ghost" className="rounded-xl">Cancel</Button>
              <Button onClick={handleProcessMeeting} disabled={processing} className="rounded-xl gap-2">
                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {processing ? 'Analyzing Intelligence...' : 'Process Intelligence'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SELECTED MEETING INTELLIGENCE DETAIL MODAL */}
      {selectedMeeting && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl max-w-3xl w-full p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setSelectedMeeting(null)} className="absolute top-4 right-4 p-2 text-base-content/50 hover:text-base-content">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                Meeting Intelligence Report
              </span>
              <h2 className="text-2xl font-bold text-base-content mt-2">{selectedMeeting.title}</h2>
              <p className="text-xs text-base-content/60 mt-1 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> Date: {new Date(selectedMeeting.date).toLocaleDateString()}
              </p>
            </div>

            {/* Executive Summary */}
            <div className="p-4 bg-base-200 border border-base-300 rounded-2xl text-sm leading-relaxed text-base-content">
              <h4 className="font-bold text-xs uppercase tracking-wider text-primary mb-1">Executive Summary</h4>
              {selectedMeeting.summary}
            </div>

            {/* Speakers */}
            {selectedMeeting.speakers?.length > 0 && (
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-base-content/60 mb-2 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-500" /> Speakers & Roles
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMeeting.speakers.map((s: any, idx: number) => (
                    <div key={idx} className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-medium">
                      {s.name} {s.role && <span className="opacity-70">({s.role})</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Decisions */}
            {selectedMeeting.decisions?.length > 0 && (
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-base-content/60 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Formulated Decisions
                </h4>
                <div className="space-y-2">
                  {selectedMeeting.decisions.map((d: any, idx: number) => (
                    <div key={idx} className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-emerald-500 block">✓ {d.decision}</span>
                      <p className="text-base-content/70">Rationale: {d.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Items */}
            {selectedMeeting.actionItems?.length > 0 && (
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-base-content/60 mb-2 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-amber-500" /> Action Items & Deadlines
                </h4>
                <div className="space-y-2">
                  {selectedMeeting.actionItems.map((a: any, idx: number) => (
                    <div key={idx} className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold text-base-content">{a.item}</span>
                        <p className="text-[11px] text-base-content/60 mt-0.5">Assigned Owner: <span className="font-semibold text-amber-500">{a.owner}</span></p>
                      </div>
                      {a.deadline && (
                        <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 font-bold text-[10px]">
                          Due: {a.deadline}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Identified Risks */}
            {selectedMeeting.risks?.length > 0 && (
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-base-content/60 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-500" /> Identified Operational Risks
                </h4>
                <div className="space-y-2">
                  {selectedMeeting.risks.map((r: any, idx: number) => (
                    <div key={idx} className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-red-400">⚠️ {r.risk}</span>
                      <p className="text-base-content/70">Impact: {r.impact} | Mitigation: {r.mitigation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formatted Transcript */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-base-content/60 mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-500" /> Structured Meeting Transcript
              </h4>
              <div className="p-4 bg-base-200 border border-base-300 rounded-2xl text-xs font-mono text-base-content/80 whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar">
                {selectedMeeting.transcript}
              </div>
            </div>

            <div className="pt-2 border-t border-base-300 flex justify-between items-center">
              <Link href="/dashboard/graph" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                View in Enterprise Memory Graph →
              </Link>
              <Button onClick={() => setSelectedMeeting(null)} className="rounded-xl">Close Report</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
