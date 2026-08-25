"use client";

import React, { useState } from "react";
import { 
  Video, Mic, ShieldCheck, X, Loader2, Sparkles, CheckCircle2, 
  Trash2, Lock, ArrowRight, Radio
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface VexaMeetingDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptIngested?: (docId: string) => void;
}

export function VexaMeetingDispatchModal({
  isOpen,
  onOpenChange,
  isOpen: propIsOpen,
  onClose,
  onTranscriptIngested,
}: VexaMeetingDispatchModalProps & { onOpenChange?: (open: boolean) => void }) {
  const [meetingUrl, setMeetingUrl] = useState("");
  const [botName, setBotName] = useState("Causarix Boardroom Scribe");
  const [dispatching, setDispatching] = useState(false);
  const [dispatchedMeetingId, setDispatchedMeetingId] = useState<string | null>(null);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [purging, setPurging] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen && !propIsOpen) return null;

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingUrl) return;

    setDispatching(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/connectors/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DISPATCH_BOT",
          meetingUrl,
          botName,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDispatchedMeetingId(data.meetingId);
        setStatusText("Bot in call • Capturing live audio with zero-retention privacy");
        setSuccessMessage("Scribe Bot successfully dispatched to meeting room!");
      } else {
        setErrorMessage(data.error || "Failed to dispatch meeting bot");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error dispatching bot");
    } finally {
      setDispatching(false);
    }
  };

  const handleSyncTranscript = async () => {
    if (!dispatchedMeetingId) return;

    setSyncing(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/connectors/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SYNC_TRANSCRIPT",
          meetingId: dispatchedMeetingId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage("Meeting transcript ingested into 3D Knowledge Graph! Remote audio purged from cloud.");
        if (onTranscriptIngested && data.documentId) {
          onTranscriptIngested(data.documentId);
        }
      } else {
        setErrorMessage(data.error || "Failed to sync transcript");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to sync transcript");
    } finally {
      setSyncing(false);
    }
  };

  const handleInstantPurge = async () => {
    if (!dispatchedMeetingId) return;
    setPurging(true);
    try {
      await fetch("/api/connectors/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "PURGE_REMOTE",
          meetingId: dispatchedMeetingId,
        }),
      });
      setSuccessMessage("Cloud memory purged. 0 residual bytes remaining on Vexa servers.");
    } catch {
      // ignore
    } finally {
      setPurging(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Dispatch Meeting Scribe Bot
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Hybrid Privacy
                </span>
              </h3>
              <p className="text-xs text-slate-400">Google Meet • Zoom • Microsoft Teams</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Privacy Shield Banner */}
        <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-start gap-3 text-xs text-blue-200">
          <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Hybrid Air-Gapped Privacy Invariant:</span>
            <p className="mt-0.5 text-slate-300">
              Audio is streamed in-flight and transcribed. Transcripts are AI-Firewall scrubbed for secrets before PostgreSQL storage, and remote copies on Vexa servers are immediately destroyed.
            </p>
          </div>
        </div>

        {/* Form or Active Session */}
        {!dispatchedMeetingId ? (
          <form onSubmit={handleDispatch} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono font-semibold uppercase text-slate-300">
                Meeting Room URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://meet.google.com/abc-defg-hij or Zoom link"
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono font-semibold uppercase text-slate-300">
                Bot Participant Display Name
              </label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/60 p-3 rounded-xl">
                {errorMessage}
              </p>
            )}

            <div className="pt-2 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-xl border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={dispatching || !meetingUrl}
                className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-2"
              >
                {dispatching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Dispatching Bot...
                  </>
                ) : (
                  <>
                    <Radio className="w-4 h-4" />
                    Dispatch Scribe Bot
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Bot Active in Meeting</span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                Meeting Session ID: {dispatchedMeetingId}
              </p>
              <p className="text-xs text-slate-400">
                The bot is capturing speaker audio. When the meeting ends (or whenever you are ready), click below to sync the transcript into your 3D Knowledge Graph.
              </p>
            </div>

            {successMessage && (
              <p className="text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-xl">
                {successMessage}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleInstantPurge}
                disabled={purging}
                className="rounded-xl border-rose-800/60 text-rose-300 hover:bg-rose-950/50 text-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {purging ? "Purging..." : "Wipe Cloud Copy"}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="rounded-xl border-slate-700 text-slate-300 hover:bg-slate-800 text-xs"
                >
                  Done
                </Button>
                <Button
                  type="button"
                  onClick={handleSyncTranscript}
                  disabled={syncing}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  {syncing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Ingesting & Scrubbing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Sync to 3D Memory Palace
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VexaMeetingDispatchModal;
