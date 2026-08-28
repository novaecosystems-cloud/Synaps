"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Hash, Plus, Users, Sparkles, RefreshCw, X, AtSign } from 'lucide-react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Channel {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  memberCount: number;
  unreadCount: number;
}

interface StreamMessage {
  id: string;
  channelId: string;
  authorName: string;
  authorRole: string;
  authorType: "AI" | "HUMAN";
  avatar: string;
  content: string;
  citation?: string;
  timestamp: string;
}

const AI_AGENTS = [
  { tag: "@CFO", name: "CFO Twin", role: "Financial Modeling & EBITDA", icon: "💰" },
  { tag: "@GeneralCounsel", name: "General Counsel", role: "Delaware DGCL § 141", icon: "⚖️" },
  { tag: "@CTO", name: "CTO Twin", role: "SCM Microservice DAG Surgery", icon: "⚡" },
  { tag: "@RedTeam", name: "Red Team", role: "Adversarial Stress-Testing", icon: "🛡️" },
  { tag: "@CEO", name: "CEO Twin", role: "Executive Strategy Quorum", icon: "🏛️" }
];

export default function TeamStreamChatPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string>("general");
  const [messages, setMessages] = useState<StreamMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isNewChannelModalOpen, setIsNewChannelModalOpen] = useState<boolean>(false);
  const [newChannelName, setNewChannelName] = useState<string>("");
  const [newChannelDesc, setNewChannelDesc] = useState<string>("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchChannels = async () => {
    try {
      const res = await fetch("/api/stream-channels");
      const data = await res.json();
      if (data.success && data.channels) {
        setChannels(data.channels);
      }
    } catch (err) {
      console.error("Failed to load channels:", err);
    }
  };

  const fetchMessages = async (channelId: string) => {
    try {
      const res = await fetch(`/api/stream-messages?channelId=${channelId}`);
      const data = await res.json();
      if (data.success && data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  useEffect(() => {
    fetchChannels();
    fetchMessages(activeChannelId);
  }, []);

  useEffect(() => {
    fetchMessages(activeChannelId);
  }, [activeChannelId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    const messageText = inputValue.trim();
    setInputValue("");
    setIsSending(true);

    // Optimistic user message update
    const optimisticMsg: StreamMessage = {
      id: `msg-${Date.now()}`,
      channelId: activeChannelId,
      authorName: "Executive",
      authorRole: "Team Member",
      authorType: "HUMAN",
      avatar: "👤",
      content: messageText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const res = await fetch("/api/stream-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId: activeChannelId,
          authorName: "Executive",
          authorRole: "Team Member",
          authorType: "HUMAN",
          content: messageText
        })
      });
      const data = await res.json();
      if (data.success && data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    try {
      const res = await fetch("/api/stream-channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newChannelName,
          description: newChannelDesc,
          isPrivate: false
        })
      });
      const data = await res.json();
      if (data.success && data.channel) {
        setChannels(prev => [...prev, data.channel]);
        setActiveChannelId(data.channel.id);
        setIsNewChannelModalOpen(false);
        setNewChannelName("");
        setNewChannelDesc("");
      }
    } catch (err) {
      console.error("Failed to create channel:", err);
    }
  };

  const insertMention = (tag: string) => {
    setInputValue(prev => prev ? `${prev} ${tag} ` : `${tag} `);
  };

  const activeChannel = channels.find(c => c.id === activeChannelId) || {
    id: activeChannelId,
    name: activeChannelId,
    description: "Sovereign Executive & AI Stream",
    memberCount: 0
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#07080B] text-slate-100 font-sans overflow-hidden">
      {/* ── LEFT SIDEBAR (SLACK-STYLE CHANNELS & DMS) ────────────────────── */}
      <div className="w-64 sm:w-72 bg-[#0D0F17] border-r border-slate-800/80 flex flex-col shrink-0">
        {/* Workspace Title */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-sm font-extrabold text-white tracking-tight">
                Causarix Stream
              </h2>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">100% AIR-GAPPED OFFLINE</span>
          </div>
          <button
            onClick={() => setIsNewChannelModalOpen(true)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Create Channel"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Channel & DMs List Feed */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {/* CHANNELS SECTION */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono font-bold text-slate-400 px-2 uppercase tracking-wider flex items-center justify-between mb-2">
              <span># Channels ({channels.length})</span>
            </div>
            {channels.map(channel => (
              <button
                key={channel.id}
                onClick={() => setActiveChannelId(channel.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeChannelId === channel.id
                    ? "bg-primary text-white font-bold shadow-[0_0_15px_rgba(45,78,255,0.25)]"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Hash className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  <span className="truncate">{channel.name}</span>
                </div>
                {channel.unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-rose-500 text-white">
                    {channel.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* AI EXECUTIVES (DIRECT ASSISTANTS) */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono font-bold text-slate-400 px-2 uppercase tracking-wider mb-2">
              <span>🤖 AI C-Suite Twins</span>
            </div>
            {AI_AGENTS.map(agent => (
              <button
                key={agent.tag}
                onClick={() => insertMention(agent.tag)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-cyan-300 hover:bg-slate-800/40 transition-colors group"
                title={`Click to @mention ${agent.name} in chat`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-sm">{agent.icon}</span>
                  <span className="text-xs font-medium text-slate-300 group-hover:text-white truncate">
                    {agent.name}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-cyan-400/80 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                  {agent.tag}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN STREAM CHAT AREA ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-[#07080B] overflow-hidden">
        {/* Channel Header */}
        <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between bg-[#0A0C13] shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-primary" />
              <h2 className="text-base font-extrabold text-white tracking-tight">
                {activeChannel.name}
              </h2>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-xl">
              {activeChannel.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>{activeChannel.memberCount || 10} Active</span>
            </div>
          </div>
        </div>

        {/* Messages Stream Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 opacity-60">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl">
                <Hash className="w-6 h-6 text-slate-500" />
              </div>
              <h4 className="text-sm font-bold text-white">#{activeChannel.name} is blank</h4>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                No messages in this channel yet. Type a message below or @mention an AI C-Suite agent (@CFO, @GeneralCounsel, @CTO, @RedTeam, @CEO) to begin.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isAi = msg.authorType === "AI";

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3.5 p-4 rounded-2xl border transition-all ${
                    isAi
                      ? "bg-[#0D101E] border-cyan-900/40 shadow-[0_4px_20px_rgba(6,182,212,0.06)]"
                      : "bg-[#0D0F17] border-slate-800/80"
                  }`}
                >
                  {/* Avatar Icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${
                    isAi ? "bg-cyan-950/80 border border-cyan-700/60 text-cyan-300" : "bg-slate-800 text-white"
                  }`}>
                    {msg.avatar || (isAi ? "🤖" : "👤")}
                  </div>

                  {/* Message Body */}
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isAi ? "text-cyan-300" : "text-white"}`}>
                        {msg.authorName}
                      </span>
                      {msg.authorRole && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                          isAi ? "bg-cyan-950 text-cyan-400 border border-cyan-800/40" : "bg-slate-800 text-slate-400"
                        }`}>
                          {msg.authorRole}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Message Content with Markdown & Elegant Executive Typography */}
                    <div className="text-xs sm:text-[13.5px] text-slate-200 font-sans tracking-normal leading-relaxed prose prose-invert prose-p:my-2 prose-p:leading-relaxed prose-headings:text-white prose-headings:font-bold prose-h2:text-sm sm:prose-h2:text-base prose-h2:mt-3 prose-h2:mb-1.5 prose-h3:text-xs sm:prose-h3:text-sm prose-h3:mt-2 prose-h3:mb-1 prose-ul:my-2 prose-ul:pl-4 prose-li:my-0.5 prose-strong:text-cyan-300 prose-strong:font-semibold prose-code:text-cyan-300 prose-code:bg-slate-900/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:border prose-code:border-slate-800 prose-pre:my-2 prose-pre:bg-slate-950/90 prose-pre:border prose-pre:border-slate-800/80 max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>

                    {/* Causal Citation / Proof Badge */}
                    {msg.citation && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#07090F] border border-cyan-900/50 text-[10px] font-mono text-cyan-400">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>{msg.citation}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Mention Action Bar & Input */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0A0C13] space-y-2 shrink-0">
          {/* AI Quick Mentions Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono text-slate-400">
            <span className="text-slate-500 flex items-center gap-1 shrink-0">
              <AtSign className="w-3 h-3" /> Summon AI:
            </span>
            {AI_AGENTS.map(agent => (
              <button
                key={agent.tag}
                onClick={() => insertMention(agent.tag)}
                className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-800 hover:border-cyan-700/50 transition-colors shrink-0"
              >
                {agent.tag} ({agent.name})
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-[#12141F] border border-slate-800 rounded-2xl p-2 focus-within:border-primary transition-all">
            <input
              type="text"
              placeholder={`Message #${activeChannel.name} or type @CFO, @GeneralCounsel to summon executive AI...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isSending}
              className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
            />

            <button
              type="submit"
              disabled={!inputValue.trim() || isSending}
              className="p-2.5 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold transition-all shadow-[0_0_15px_rgba(45,78,255,0.3)]"
            >
              {isSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>

      {/* ── CREATE CHANNEL MODAL ─────────────────────────────────────────── */}
      <AnimatePresence>
        {isNewChannelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0D0F17] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Create New Channel</h3>
                  <p className="text-xs text-slate-400">Zero-fixation sovereign team stream channel.</p>
                </div>
                <button 
                  onClick={() => setIsNewChannelModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateChannel} className="space-y-4">
                <div>
                  <label className="text-xs font-mono font-bold text-slate-400 block mb-1">
                    CHANNEL NAME *
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. security-quarantine"
                      value={newChannelName}
                      onChange={(e) => setNewChannelName(e.target.value)}
                      className="w-full bg-[#12141F] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-slate-400 block mb-1">
                    CHANNEL PURPOSE & DESCRIPTION
                  </label>
                  <textarea
                    rows={2}
                    placeholder="What is this channel for? e.g. Cross-silo database leak investigation"
                    value={newChannelDesc}
                    onChange={(e) => setNewChannelDesc(e.target.value)}
                    className="w-full bg-[#12141F] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsNewChannelModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-lg"
                  >
                    Create Channel
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
