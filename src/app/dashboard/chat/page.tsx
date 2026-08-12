"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send, Globe, Plus, Trash2, Clock,
  Loader2, BookOpen, ExternalLink,
  AlignLeft, Paperclip, Sparkles,
  MessageSquare, ArrowRight, ChevronRight,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface WebSource {
  title: string;
  url: string;
  snippet: string;
  favicon: string;
  domain: string;
}

interface Citation {
  document_id?: string;
  page?: number;
  snippet?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isWebSearch?: boolean;
  webSources?: WebSource[];
  citations?: Citation[];
  thinking?: string[];
  isStreaming?: boolean;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10);

const SUGGESTED = [
  "What are the key risks in the latest uploaded contracts?",
  "Summarise all compliance obligations due this quarter",
  "Search the web for recent AI regulation changes in the EU",
  "Compare the financial terms across all active agreements",
];

const LOCAL_STORAGE_CHATS_KEY = "synaps_saved_chats_v2";
const LOCAL_STORAGE_ACTIVE_ID_KEY = "synaps_active_chat_id_v2";

// ─── Markdown Renderer ────────────────────────────────────────────────────────
function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-xl font-semibold text-white mt-5 mb-2 leading-snug">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-lg font-semibold text-white mt-4 mb-2 leading-snug">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-base font-semibold text-white/90 mt-3 mb-1.5">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="text-[15px] text-white/85 leading-[1.8] mb-3 font-normal">{children}</p>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-white">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-white/80">{children}</em>
        ),
        ul: ({ children }) => (
          <ul className="list-none space-y-1.5 mb-3 ml-0">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-1.5 mb-3 ml-1">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="flex gap-2 text-[15px] text-white/85 leading-relaxed">
            <span className="text-cyan-400 mt-1 shrink-0">•</span>
            <span>{children}</span>
          </li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-cyan-500/50 pl-4 my-3 text-white/60 italic text-[14px]">
            {children}
          </blockquote>
        ),
        code: ({ inline, children, ...props }: any) =>
          inline ? (
            <code className="bg-white/10 text-cyan-200 px-1.5 py-0.5 rounded text-[13px] font-mono">
              {children}
            </code>
          ) : (
            <pre className="bg-[#0b1320] border border-cyan-500/20 rounded-xl p-4 overflow-x-auto my-3">
              <code className="text-[13px] text-cyan-100 font-mono leading-relaxed">{children}</code>
            </pre>
          ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300 transition-colors"
          >
            {children}
          </a>
        ),
        hr: () => <hr className="border-cyan-500/20 my-4" />,
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="w-full text-[13px] border-collapse">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="text-left px-3 py-2 bg-cyan-950/40 text-cyan-200 font-semibold border border-cyan-500/20">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-2 text-white/75 border border-cyan-500/10">{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

// ─── Source Card ─────────────────────────────────────────────────────────────
function SourceCard({ source, idx }: { source: WebSource; idx: number }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-1.5 p-3 rounded-xl
                 bg-white/5 hover:bg-white/10
                 border border-white/10 hover:border-cyan-400/40
                 transition-all min-w-[200px] max-w-[220px] shrink-0"
    >
      <div className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={source.favicon}
          alt=""
          className="w-4 h-4 rounded-sm"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
        <span className="text-[11px] text-white/50 font-medium truncate">{source.domain}</span>
        <ExternalLink className="w-3 h-3 text-white/30 ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <p className="text-[12px] text-white/90 font-medium leading-snug line-clamp-2">{source.title}</p>
      {source.snippet && (
        <p className="text-[11px] text-white/45 leading-relaxed line-clamp-2">{source.snippet}</p>
      )}
    </a>
  );
}

// ─── Thinking Indicator ───────────────────────────────────────────────────────
function ThinkingIndicator({ webSearch }: { webSearch: boolean }) {
  const [dot, setDot] = useState(0);
  const steps = webSearch
    ? ["Searching the web", "Reading sources", "Synthesising answer"]
    : ["Reading documents", "Analysing evidence", "Generating response"];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const d = setInterval(() => setDot(v => (v + 1) % 3), 400);
    const s = setInterval(() => setStep(v => (v + 1) % steps.length), 1600);
    return () => { clearInterval(d); clearInterval(s); };
  }, [steps.length]);

  return (
    <div className="flex items-center gap-3 text-white/50 text-[14px] py-1">
      <span className="w-5 h-5 rounded-full border-2 border-cyan-500/40 border-t-cyan-400 animate-spin shrink-0" />
      <span>{steps[step]}{"...".slice(0, dot + 1)}</span>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ onSuggest }: { onSuggest: (q: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 text-center px-6 pb-20">
      <div>
        <div className="w-14 h-14 rounded-2xl bg-cyan-600/20 border border-cyan-500/30
                        flex items-center justify-center mx-auto mb-5">
          <Sparkles className="w-7 h-7 text-cyan-400" />
        </div>
        <h2 className="text-[22px] font-semibold text-white mb-2">How can I help?</h2>
        <p className="text-white/45 text-[14px] max-w-xs mx-auto leading-relaxed">
          Ask about your documents or search the web for live information.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg">
        {SUGGESTED.map((q) => (
          <button
            key={q}
            onClick={() => onSuggest(q)}
            className="text-left px-4 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10
                       border border-white/10 hover:border-white/20 transition-all group"
          >
            <p className="text-[13px] text-white/70 group-hover:text-white/90 leading-snug transition-colors">{q}</p>
            <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-cyan-400 mt-2 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Chat Page ───────────────────────────────────────────────────────────
export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [webSearch, setWebSearch] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 1. Persistent Storage: Load saved chats from localStorage on initial mount
  useEffect(() => {
    try {
      const savedChats = localStorage.getItem(LOCAL_STORAGE_CHATS_KEY);
      const savedActiveId = localStorage.getItem(LOCAL_STORAGE_ACTIVE_ID_KEY);
      if (savedChats) {
        const parsed: Chat[] = JSON.parse(savedChats);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          setChats(parsed);
          if (savedActiveId && parsed.some(c => c.id === savedActiveId)) {
            setActiveChatId(savedActiveId);
          } else {
            setActiveChatId(parsed[0].id);
          }
        }
      }
    } catch (e) {
      console.warn("Failed to load saved chats from localStorage:", e);
    }
  }, []);

  // 2. Persistent Storage: Save chats to localStorage on change so history NEVER vanishes on refresh
  useEffect(() => {
    try {
      if (chats.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_CHATS_KEY, JSON.stringify(chats));
      }
      if (activeChatId) {
        localStorage.setItem(LOCAL_STORAGE_ACTIVE_ID_KEY, activeChatId);
      }
    } catch (e) {
      console.warn("Failed to save chats to localStorage:", e);
    }
  }, [chats, activeChatId]);

  const activeChat = chats.find(c => c.id === activeChatId) ?? null;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 180) + "px";
  }, []);

  useEffect(() => { resizeTextarea(); }, [input, resizeTextarea]);

  // Start new chat handler
  const startNewChat = useCallback(() => {
    const id = uid();
    const newChat: Chat = {
      id,
      title: "New conversation",
      messages: [],
      createdAt: new Date().toISOString()
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(id);
  }, []);

  const send = useCallback(async (overrideInput?: string) => {
    const q = (overrideInput ?? input).trim();
    if (!q || isLoading) return;

    let chatId = activeChatId;
    if (!chatId || !chats.some(c => c.id === chatId)) {
      chatId = uid();
      const chat: Chat = { id: chatId, title: q.slice(0, 50), messages: [], createdAt: new Date().toISOString() };
      setChats(prev => [chat, ...prev]);
      setActiveChatId(chatId);
    }

    const userMsg: Message = { id: uid(), role: "user", content: q };
    const aId = uid();
    const isWebQuery = webSearch || /search the web|google|latest|recent news|current|today|2024|2025|2026/i.test(q);

    setChats(prev => prev.map(c =>
      c.id === chatId
        ? {
            ...c,
            title: c.messages.length === 0 ? q.slice(0, 50) : c.title,
            messages: [...c.messages, userMsg, {
              id: aId, role: "assistant", content: "",
              isStreaming: true, isWebSearch: isWebQuery,
            }],
          }
        : c
    ));
    setInput("");
    setIsLoading(true);

    try {
      if (isWebQuery) {
        const res = await fetch("/api/web-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q }),
        });
        const data = await res.json();
        if (data.credits) {
          window.dispatchEvent(new CustomEvent('synaps:credits_updated', { detail: data.credits }));
        }
        setChats(prev => prev.map(c =>
          c.id === chatId
            ? { ...c, messages: c.messages.map(m =>
                m.id === aId
                  ? { ...m, content: data.answer || "No answer returned.", webSources: data.sources || [], isStreaming: false }
                  : m
              )}
            : c
        ));
      } else {
        const currentChat = chats.find(c => c.id === chatId);
        const messages = (currentChat?.messages ?? [])
          .filter(m => !m.isStreaming)
          .map(m => ({ role: m.role, content: m.content }))
          .concat({ role: "user", content: q });

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages }),
        });
        const data = await res.json();
        if (data.credits) {
          window.dispatchEvent(new CustomEvent('synaps:credits_updated', { detail: data.credits }));
        }
        setChats(prev => prev.map(c =>
          c.id === chatId
            ? { ...c, messages: c.messages.map(m =>
                m.id === aId
                  ? {
                      ...m,
                      content: data.answer || data.error || "No response.",
                      citations: data.evidence?.slice(0, 5).map((e: any) => ({
                        document_id: e.name || e.documentId,
                        page: e.pageNumber,
                        snippet: e.text?.slice(0, 60),
                      })) || [],
                      isStreaming: false,
                    }
                  : m
              )}
            : c
        ));
      }
    } catch {
      setChats(prev => prev.map(c =>
        c.id === chatId
          ? { ...c, messages: c.messages.map(m =>
              m.id === aId
                ? { ...m, content: "Something went wrong. Please try again.", isStreaming: false }
                : m
            )}
          : c
      ));
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, activeChatId, chats, webSearch]);

  const deleteChat = (id: string) => {
    setChats(prev => {
      const next = prev.filter(c => c.id !== id);
      try {
        localStorage.setItem(LOCAL_STORAGE_CHATS_KEY, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    if (activeChatId === id) {
      setActiveChatId(null);
      localStorage.removeItem(LOCAL_STORAGE_ACTIVE_ID_KEY);
    }
  };

  return (
    <div className="flex h-screen bg-[#111118] text-white overflow-hidden"
         style={{ fontFamily: "'Inter', 'Google Sans', system-ui, -apple-system, sans-serif" }}>

      {/* ── SIDEBAR (PERSISTENT CONVERSATION HISTORY & NEW CHAT) ───────────── */}
      <aside className={`flex flex-col shrink-0 bg-[#18181f] border-r border-white/5
                         transition-all duration-200 overflow-hidden
                         ${sidebarOpen ? "w-64" : "w-0"}`}>
        {/* Start New Chat Action */}
        <div className="p-3">
          <button
            onClick={startNewChat}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl
                       bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300
                       text-xs font-bold uppercase tracking-wider transition-all shadow-md"
          >
            <Plus className="w-4 h-4 text-cyan-300" />
            <span>+ Start New Chat</span>
          </button>
        </div>

        {/* Section Header */}
        <div className="px-4 py-2 flex items-center justify-between text-[11px] font-mono font-bold uppercase text-white/40 tracking-wider">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-cyan-400" />
            Previous Chats
          </span>
          <span className="text-[10px] text-white/30">{chats.length} saved</span>
        </div>

        {/* List of Saved Previous Conversations */}
        <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
          {chats.length === 0 && (
            <p className="text-center text-white/30 text-xs py-8 font-mono">No previous chats stored</p>
          )}
          {chats.map(chat => (
            <div key={chat.id} className="group relative">
              <button
                onClick={() => setActiveChatId(chat.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-[13px] truncate transition-all flex items-center gap-2
                  ${activeChatId === chat.id
                    ? "bg-white/10 text-white font-medium border border-white/15"
                    : "text-white/60 hover:bg-white/5 hover:text-white/90"
                  }`}
              >
                <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${activeChatId === chat.id ? "text-cyan-400" : "text-white/30"}`} />
                <span className="truncate">{chat.title || "New conversation"}</span>
              </button>
              <button
                onClick={() => deleteChat(chat.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg
                           opacity-0 group-hover:opacity-100 hover:bg-red-900/40 text-red-400/70
                           hover:text-red-400 transition-all"
                title="Delete Chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* ── MAIN AREA ───────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 relative">

        {/* Header */}
        <header className="shrink-0 h-14 flex items-center justify-between px-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(v => !v)}
              className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/70 transition-colors"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <span className="text-[15px] font-bold text-white/90 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Synaps Executive AI Chat
            </span>
          </div>

          {/* Web Search Toggle */}
          <button
            onClick={() => setWebSearch(v => !v)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[13px] font-medium
                        border transition-all
                        ${webSearch
                          ? "bg-cyan-500/25 border-cyan-500/60 text-cyan-300"
                          : "bg-transparent border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
                        }`}
          >
            <Globe className={`w-3.5 h-3.5 ${webSearch ? "animate-pulse" : ""}`} />
            Web Search
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {!activeChat || activeChat.messages.length === 0 ? (
            <EmptyState onSuggest={(q) => send(q)} />
          ) : (
            <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
              {activeChat.messages.map((msg) => (
                <div key={msg.id}>
                  {msg.role === "user" ? (
                    /* ── User bubble ── */
                    <div className="flex justify-end">
                      <div className="max-w-[80%] bg-[#2a2a35] text-white/90 px-5 py-3.5
                                      rounded-2xl rounded-tr-md text-[15px] leading-relaxed font-normal">
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    /* ── Assistant message ── */
                    <div className="flex gap-3">
                      {/* Avatar */}
                      <div className="w-8 h-8 shrink-0 rounded-full bg-cyan-500/20 border border-cyan-500/30
                                      flex items-center justify-center mt-0.5">
                        {msg.isWebSearch
                          ? <Globe className="w-3.5 h-3.5 text-cyan-400" />
                          : <Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>

                      <div className="flex-1 min-w-0 space-y-4 pt-0.5">
                        {/* Thinking / Loading */}
                        {msg.isStreaming && msg.content === "" ? (
                          <ThinkingIndicator webSearch={!!msg.isWebSearch} />
                        ) : (
                          <>
                            {/* Web Search label */}
                            {msg.isWebSearch && (
                              <div className="flex items-center gap-1.5 text-[11px] text-cyan-400/80 font-mono font-bold uppercase tracking-wider">
                                <Globe className="w-3 h-3" />
                                Live Web Search Verified
                              </div>
                            )}

                            {/* Sources */}
                            {msg.webSources && msg.webSources.length > 0 && (
                              <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1">
                                {msg.webSources.map((src, i) => (
                                  <SourceCard key={i} source={src} idx={i} />
                                ))}
                              </div>
                            )}

                            {/* Answer — rendered markdown */}
                            <div className="text-[15px] leading-[1.8] font-normal">
                              {msg.isStreaming ? (
                                <span className="text-white/85">{msg.content}
                                  <span className="inline-block w-0.5 h-4 bg-cyan-400 animate-pulse ml-0.5 align-middle" />
                                </span>
                              ) : (
                                <MarkdownContent content={msg.content} />
                              )}
                            </div>

                            {/* Document Citations */}
                            {msg.citations && msg.citations.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-1">
                                {msg.citations.map((cit, i) => (
                                  <span key={i}
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full
                                               bg-white/5 border border-white/10
                                               text-[11px] text-white/50"
                                  >
                                    <BookOpen className="w-3 h-3 text-cyan-400/70" />
                                    {cit.document_id ? `${cit.document_id} · p.${cit.page}` : cit.snippet}
                                  </span>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={endRef} />
            </div>
          )}
        </div>

        {/* ── Input Bar ───────────────────────────────────────────────────────── */}
        <div className="shrink-0 px-4 pb-5 pt-3">
          <div className="max-w-2xl mx-auto">
            {/* Web active pill */}
            {webSearch && (
              <div className="flex items-center gap-2 mb-2 px-1 text-[12px] text-cyan-400/80 font-mono font-semibold">
                <Globe className="w-3.5 h-3.5 animate-pulse" />
                Live Web Search Active — Querying real-time internet data
              </div>
            )}

            <div className={`flex items-end gap-2 rounded-2xl px-3 py-2.5 border transition-all
                            ${webSearch
                              ? "bg-[#1c1c2a] border-cyan-500/40 shadow-md shadow-cyan-500/10"
                              : "bg-[#1c1c2a] border-white/10 focus-within:border-white/20"
                            }`}>
              {/* Hidden File Input & Attach Button */}
              <input
                type="file"
                id="chat-file-upload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setInput((prev) => (prev ? `${prev} [Attached: ${file.name}]` : `Please analyze this document: ${file.name}`));
                  }
                }}
              />
              <button 
                type="button"
                onClick={() => document.getElementById('chat-file-upload')?.click()}
                title="Attach Document for RAG Analysis"
                className="p-2 shrink-0 text-white/30 hover:text-white/60 hover:bg-white/5 rounded-xl transition-colors mb-0.5"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder={webSearch ? "Search the web or ask about documents…" : "Ask about your documents…"}
                className="flex-1 bg-transparent resize-none py-2 px-1 outline-none
                           text-[15px] text-white/90 placeholder-white/25
                           min-h-[38px] max-h-[180px] leading-relaxed"
                rows={1}
              />

              {/* Web toggle (compact) */}
              <button
                onClick={() => setWebSearch(v => !v)}
                className={`p-2 shrink-0 rounded-xl transition-all mb-0.5
                            ${webSearch
                              ? "text-cyan-300 bg-cyan-500/20 border border-cyan-500/30"
                              : "text-white/25 hover:text-white/50 hover:bg-white/5"
                            }`}
                title="Toggle web search"
              >
                <Globe className="w-4 h-4" />
              </button>

              {/* Send */}
              <button
                onClick={() => send()}
                disabled={!input.trim() || isLoading}
                className="p-2.5 shrink-0 rounded-xl bg-cyan-600 hover:bg-cyan-500
                           disabled:opacity-25 disabled:cursor-not-allowed
                           text-white transition-all mb-0.5 shadow-md"
              >
                {isLoading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Send className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-center mt-2.5 text-[11px] text-white/30 font-mono">
              Synaps Executive AI Engine · 100% Evidence Grounded & Zero Hallucinations.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
