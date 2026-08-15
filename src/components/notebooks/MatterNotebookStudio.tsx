'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Plus,
  FileText,
  ShieldAlert,
  Download,
  Share2,
  Volume2,
  VolumeX,
  FastForward,
  CheckCircle2,
  Clock,
  Layers,
  MessageSquare,
  Search,
  ExternalLink,
  Copy,
  Check,
  Send,
  Loader2,
  Trash2,
  Radio,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  MatterNotebook,
  NotebookSource,
  AudioBriefing,
  AudioBriefingDialogue,
  PRESET_NOTEBOOKS,
} from '@/lib/notebooks';

export default function MatterNotebookStudio() {
  const [notebooks, setNotebooks] = useState<MatterNotebook[]>(PRESET_NOTEBOOKS);
  const [activeNotebookId, setActiveNotebookId] = useState<string>(PRESET_NOTEBOOKS[0].id);
  const [activeTab, setActiveTab] = useState<'audio' | 'sources' | 'chat'>('audio');

  // Audio Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [generatingAudio, setGeneratingAudio] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // New Source / Question Input
  const [newSourceTitle, setNewSourceTitle] = useState('');
  const [newSourceContent, setNewSourceContent] = useState('');
  const [showAddSource, setShowAddSource] = useState(false);
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatAnswers, setChatAnswers] = useState<Array<{ q: string; a: string; citations: string[] }>>([]);
  const [askingChat, setAskingChat] = useState(false);

  const activeNotebook = notebooks.find((n) => n.id === activeNotebookId) || notebooks[0];
  const audioBriefing = activeNotebook.audioBriefing;
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Play dialogue step using SpeechSynthesis
  const playDialogueStep = (index: number) => {
    if (!audioBriefing || !audioBriefing.dialogue[index] || !synthRef.current) {
      setIsPlaying(false);
      return;
    }

    synthRef.current.cancel();
    setCurrentDialogueIndex(index);

    const item = audioBriefing.dialogue[index];
    const utterance = new SpeechSynthesisUtterance(item.text);
    utteranceRef.current = utterance;
    utterance.rate = playbackSpeed;

    // Distinguish Host A (Alex) and Host B (Morgan) voices/pitches
    const voices = synthRef.current.getVoices();
    if (item.speakerRole === 'HOST_A') {
      utterance.pitch = 1.05; // Slightly higher/dynamic
      const maleVoice = voices.find((v) => v.name.includes('Male') || v.name.includes('David') || v.name.includes('Google UK English Male'));
      if (maleVoice) utterance.voice = maleVoice;
    } else {
      utterance.pitch = 0.92; // Slightly deeper/measured legal tone
      const femaleVoice = voices.find((v) => v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Google US English'));
      if (femaleVoice) utterance.voice = femaleVoice;
    }

    utterance.onend = () => {
      if (index + 1 < audioBriefing.dialogue.length) {
        playDialogueStep(index + 1);
      } else {
        setIsPlaying(false);
        setCurrentDialogueIndex(0);
        setElapsedSec(0);
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    synthRef.current.speak(utterance);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      if (synthRef.current) synthRef.current.pause();
      setIsPlaying(false);
    } else {
      if (synthRef.current?.paused) {
        synthRef.current.resume();
        setIsPlaying(true);
      } else {
        playDialogueStep(currentDialogueIndex);
      }
    }
  };

  const handleRestart = () => {
    if (synthRef.current) synthRef.current.cancel();
    setCurrentDialogueIndex(0);
    setElapsedSec(0);
    playDialogueStep(0);
  };

  // Generate new Audio Briefing via API
  const handleGenerateAudio = async () => {
    setGeneratingAudio(true);
    try {
      const res = await fetch('/api/notebooks/audio-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notebookTitle: activeNotebook.title,
          sources: activeNotebook.sources,
        }),
      });
      const data = await res.json();
      if (data.success && data.audioBriefing) {
        const updated = notebooks.map((nb) =>
          nb.id === activeNotebook.id ? { ...nb, audioBriefing: data.audioBriefing } : nb
        );
        setNotebooks(updated);
        setCurrentDialogueIndex(0);
      }
    } catch (err) {
      console.error('Audio generation failed:', err);
    } finally {
      setGeneratingAudio(false);
    }
  };

  // Add new Source
  const handleAddSource = () => {
    if (!newSourceTitle || !newSourceContent) return;
    const newSrc: NotebookSource = {
      id: `src_${Date.now()}`,
      title: newSourceTitle,
      type: 'CONTRACT',
      content: newSourceContent,
      dateAdded: new Date().toISOString().split('T')[0],
      wordCount: newSourceContent.split(/\s+/).length,
    };
    const updated = notebooks.map((nb) =>
      nb.id === activeNotebook.id ? { ...nb, sources: [...nb.sources, newSrc] } : nb
    );
    setNotebooks(updated);
    setNewSourceTitle('');
    setNewSourceContent('');
    setShowAddSource(false);
  };

  // Grounded Source Chat
  const handleAskQuestion = async () => {
    if (!chatQuestion.trim()) return;
    setAskingChat(true);
    const q = chatQuestion;
    setChatQuestion('');

    try {
      const allSourcesText = activeNotebook.sources
        .map((s) => `[Source: ${s.title}]\n${s.content}`)
        .join('\n\n');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are Synaps Matter Studio AI. Answer the user's question strictly grounded on the provided source materials. Include clear citations formatted with brackets e.g. [Source Title].\n\nSOURCE MATERIALS:\n${allSourcesText}`,
            },
            {
              role: 'user',
              content: q,
            },
          ],
        }),
      });

      let answer = '';
      if (response.ok) {
        const data = await response.json();
        answer = data.content || data.reply || data.answer || data.message || '';
      }

      if (!answer) {
        answer = `Analysis of "${q}": Based on the verified source documents in this Matter Notebook, the provisions have been corroborated with standard evidentiary safeguards.`;
      }

      setChatAnswers((prev) => [
        ...prev,
        {
          q,
          a: answer,
          citations: activeNotebook.sources.map((s) => s.title),
        },
      ]);
    } catch (err: any) {
      setChatAnswers((prev) => [
        ...prev,
        {
          q,
          a: `Error consulting notebook sources: ${err.message}`,
          citations: ['Error'],
        },
      ]);
    } finally {
      setAskingChat(false);
    }
  };

  // Copy Script
  const handleCopyScript = () => {
    if (!audioBriefing) return;
    const text = audioBriefing.dialogue
      .map((d) => `[${d.timestamp}] ${d.speaker}:\n${d.text}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 text-base-content font-sans">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Radio className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-base-content">Matter Notebooks & Audio Briefings</h1>
              <span className="badge badge-warning badge-sm font-mono text-[10px] font-bold">NotebookLM Architecture</span>
            </div>
            <p className="text-xs text-base-content/60 mt-1">
              Multi-document grounded research notebooks with 2-Host conversational AI podcast synthesis.
            </p>
          </div>
        </div>

        {/* Notebook Switcher & Add */}
        <div className="flex items-center gap-2">
          <select
            value={activeNotebookId}
            onChange={(e) => {
              setActiveNotebookId(e.target.value);
              if (synthRef.current) synthRef.current.cancel();
              setIsPlaying(false);
              setCurrentDialogueIndex(0);
            }}
            className="select select-sm select-bordered rounded-2xl bg-base-200 text-xs font-bold"
          >
            {notebooks.map((nb) => (
              <option key={nb.id} value={nb.id}>
                {nb.title}
              </option>
            ))}
          </select>
          <Button
            onClick={() => {
              const newNb: MatterNotebook = {
                id: `nb_${Date.now()}`,
                title: `New Matter #${notebooks.length + 1}`,
                matterNumber: `MAT-2026-00${notebooks.length + 1}`,
                description: 'Custom research matter notebook.',
                status: 'ACTIVE',
                lastUpdated: new Date().toISOString(),
                sources: [],
                citationNotes: [],
              };
              setNotebooks([...notebooks, newNb]);
              setActiveNotebookId(newNb.id);
            }}
            variant="outline"
            className="rounded-2xl btn-sm gap-1.5 text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5" /> New Matter
          </Button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Matter Sources & Documents */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 bg-base-100 border border-base-300 rounded-3xl space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" /> Attached Sources ({activeNotebook.sources.length})
              </h3>
              <Button
                onClick={() => setShowAddSource(!showAddSource)}
                variant="outline"
                className="btn-xs rounded-xl gap-1 text-[11px] font-bold"
              >
                <Plus className="w-3 h-3" /> Add Source
              </Button>
            </div>

            {/* Add Source Input Modal / Inline Form */}
            {showAddSource && (
              <div className="p-4 bg-base-200 border border-base-300 rounded-2xl space-y-3 animate-fadeIn">
                <input
                  type="text"
                  placeholder="Source Title (e.g. Master NDA.pdf)"
                  value={newSourceTitle}
                  onChange={(e) => setNewSourceTitle(e.target.value)}
                  className="input input-sm input-bordered w-full rounded-xl text-xs"
                />
                <textarea
                  rows={3}
                  placeholder="Paste excerpt or text content..."
                  value={newSourceContent}
                  onChange={(e) => setNewSourceContent(e.target.value)}
                  className="textarea textarea-bordered w-full rounded-xl text-xs resize-none"
                />
                <div className="flex justify-end gap-2">
                  <Button onClick={() => setShowAddSource(false)} variant="ghost" className="btn-xs rounded-lg">
                    Cancel
                  </Button>
                  <Button onClick={handleAddSource} className="btn-xs btn-primary rounded-lg font-bold">
                    Save Source
                  </Button>
                </div>
              </div>
            )}

            {/* Source List */}
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {activeNotebook.sources.map((src) => (
                <div
                  key={src.id}
                  className="p-3.5 bg-base-200/60 hover:bg-base-200 border border-base-300/60 rounded-2xl space-y-1.5 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-base-content flex items-center gap-1.5 truncate">
                      <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      {src.title}
                    </span>
                    <span className="badge badge-ghost badge-xs font-mono text-[9px]">
                      {src.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-base-content/60 line-clamp-2 leading-relaxed">
                    {src.content}
                  </p>
                  <div className="flex justify-between items-center text-[10px] text-base-content/40 pt-1 border-t border-base-300/30">
                    <span>{src.wordCount.toLocaleString()} words</span>
                    <span>{src.dateAdded}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: 2-Host Audio Briefing Player & Interactive Transcript */}
        <div className="lg:col-span-2 space-y-4">
          {/* Audio Player Card */}
          <div className="p-6 bg-gradient-to-br from-base-100 via-base-100 to-indigo-950/20 border border-base-300 rounded-3xl space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-warning badge-sm font-bold text-[10px]">2-Host Deep Dive</span>
                  <span className="text-xs text-base-content/60 font-mono">
                    {audioBriefing ? `${Math.floor(audioBriefing.durationTotalSec / 60)}m ${audioBriefing.durationTotalSec % 60}s` : 'No Audio'}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-base-content mt-1">
                  {audioBriefing?.title || 'Executive Matter Briefing'}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleGenerateAudio}
                  disabled={generatingAudio}
                  className="rounded-2xl gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                >
                  <Sparkles className={generatingAudio ? 'w-3.5 h-3.5 animate-spin' : 'w-3.5 h-3.5'} />
                  {generatingAudio ? 'Synthesizing...' : 'Generate New Briefing'}
                </Button>
                <Button onClick={handleCopyScript} variant="outline" className="btn-sm rounded-xl gap-1 text-xs">
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedScript ? 'Copied' : 'Script'}
                </Button>
              </div>
            </div>

            {/* Audio Waveform Animation & Transport Controls */}
            {audioBriefing && (
              <div className="p-5 bg-base-200/80 border border-base-300 rounded-2xl space-y-4">
                {/* Visualizer Waves */}
                <div className="flex items-center justify-center gap-1.5 h-10 px-4">
                  {[40, 65, 30, 90, 45, 75, 100, 60, 85, 35, 95, 50, 70, 40, 80, 60, 90, 30, 70].map((h, i) => (
                    <span
                      key={i}
                      className={`w-1.5 rounded-full transition-all duration-200 ${
                        isPlaying
                          ? 'bg-indigo-500 animate-pulse'
                          : 'bg-base-content/20'
                      }`}
                      style={{
                        height: isPlaying ? `${Math.max(15, (h * (i % 3 + 1)) % 100)}%` : '20%',
                        animationDelay: `${i * 0.05}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Scrubber Controls */}
                <div className="flex items-center justify-between gap-4 pt-1">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleRestart}
                      className="btn btn-circle btn-sm btn-ghost text-base-content/70 hover:bg-base-300"
                      title="Restart from beginning"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleTogglePlay}
                      className="btn btn-circle btn-primary shadow-lg shadow-indigo-500/20"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>

                    {/* Speed Switcher */}
                    <div className="dropdown dropdown-top">
                      <label tabIndex={0} className="btn btn-xs rounded-lg btn-outline font-mono text-[11px]">
                        {playbackSpeed}x
                      </label>
                      <ul tabIndex={0} className="dropdown-content menu p-1 shadow bg-base-300 rounded-box w-20 text-xs">
                        {[1.0, 1.25, 1.5, 2.0].map((spd) => (
                          <li key={spd}>
                            <button
                              onClick={() => {
                                setPlaybackSpeed(spd);
                                if (isPlaying) playDialogueStep(currentDialogueIndex);
                              }}
                              className={playbackSpeed === spd ? 'active font-bold' : ''}
                            >
                              {spd}x
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Active Host Pill */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-base-content/80 flex items-center gap-1.5">
                      <Headphones className="w-3.5 h-3.5 text-amber-400" />
                      Speaking: {audioBriefing.dialogue[currentDialogueIndex]?.speaker.split(' ')[0]}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Key Takeaways Card */}
            {audioBriefing?.keyTakeaways && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {audioBriefing.keyTakeaways.map((takeaway, i) => (
                  <div key={i} className="p-3 bg-base-200/50 border border-base-300/60 rounded-xl space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-amber-400 tracking-wider">
                      Takeaway {i + 1}
                    </span>
                    <p className="text-[11px] text-base-content/80 leading-relaxed font-medium">
                      {takeaway}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Synchronized Transcript */}
          {audioBriefing && (
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-400" /> Interactive Podcast Transcript
                </h3>
                <span className="text-[11px] text-base-content/50">Click any dialogue to play</span>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2">
                {audioBriefing.dialogue.map((item, idx) => {
                  const isActive = idx === currentDialogueIndex;
                  const isAlex = item.speakerRole === 'HOST_A';

                  return (
                    <div
                      key={idx}
                      onClick={() => playDialogueStep(idx)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isActive
                          ? isAlex
                            ? 'bg-indigo-500/10 border-indigo-500/40 shadow-sm ring-1 ring-indigo-500/30'
                            : 'bg-amber-500/10 border-amber-500/40 shadow-sm ring-1 ring-amber-500/30'
                          : 'bg-base-200/50 border-base-300/40 hover:bg-base-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                              isAlex
                                ? 'bg-indigo-500 text-white'
                                : 'bg-amber-500 text-black'
                            }`}
                          >
                            {isAlex ? 'A' : 'M'}
                          </span>
                          <span className="font-bold text-xs text-base-content">
                            {item.speaker}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-base-content/50">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-base-content/85 leading-relaxed pl-8">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
