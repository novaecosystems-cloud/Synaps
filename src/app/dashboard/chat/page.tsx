"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Globe, FileText, Plus, Trash2,
  ChevronRight, Loader2, BookOpen, ExternalLink,
  AlignLeft, Search, Paperclip, X, Clock,
  Sparkles, Lightbulb
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
  createdAt: Date;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10);

const SUGGESTED = [
  "What are the key risks in the latest uploaded contracts?",
  "Summarise all compliance obligations due this quarter",
  "Search the web for recent AI regulation changes in the EU",
  "Compare the financial terms across all active agreements",
];

// ─── Source Card ─────────────────────────────────────────────────────────────
function SourceCard({ source, idx }: { source: WebSource; idx: number }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-1.5 p-3 rounded-xl bg-[#1A1630] border border-purple-500/20
                 hover:border-purple-400/50 hover:bg-[#1E1A3A] transition-all min-w-[200px] max-w-[240px] shrink-0"
    >
      <div className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={source.favicon}
          alt=""
          className="w-4 h-4 rounded-sm"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
        <span className="text-[11px] text-purple-400 font-medium truncate">{source.domain}</span>
        <ExternalLink className="w-3 h-3 text-purple-500/50 ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <p className="text-[12px] text-white/90 font-medium leading-snug line-clamp-2">{source.title}</p>
      {source.snippet && (
        <p className="text-[11px] text-purple-300/50 leading-relaxed line-clamp-2">{source.snippet}</p>
      )}
      <span className="text-[10px] text-purple-500/40 mt-0.5">Source {idx + 1}</span>
    </a>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg }: { msg: Message }) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] bg-[#7C3AED] text-white px-5 py-3 rounded-2xl rounded-tr-sm text-[15px] leading-relaxed">
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-3xl">
      {/* Web Search Label */}
      {msg.isWebSearch && (
        <div className="flex items-center gap-2 text-xs text-purple-400">
          <Globe className="w-3.5 h-3.5" />
          <span className="font-medium uppercase tracking-wider">Web Search</span>
        </div>
      )}

      {/* Thinking Steps */}
      {msg.thinking && msg.thinking.length > 0 && (
        <div className="flex flex-col gap-1">
          {msg.thinking.map((step, i) => (
            <div key={i} className="flex items-center gap-2 text-[12px] text-purple-400/70">
              <ChevronRight className="w-3 h-3 shrink-0" />
              <span>{step}</span>
            </div>
          ))}
        </div>
      )}

      {/* Web Sources Carousel */}
      {msg.webSources && msg.webSources.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {msg.webSources.map((src, i) => (
            <SourceCard key={i} source={src} idx={i} />
          ))}
        </div>
      )}

      {/* Answer */}
      <div className="text-[15px] leading-[1.75] text-white/90 whitespace-pre-wrap">
        {msg.isStreaming ? (
          <>
            {msg.content}
            <span className="inline-block w-0.5 h-4 bg-purple-400 animate-pulse ml-0.5 align-middle" />
          </>
        ) : (
          msg.content
        )}
      </div>

      {/* Document Citations */}
      {msg.citations && msg.citations.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {msg.citations.map((cit, i) => (
            <button
              key={i}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/50
                         border border-purple-500/30 text-[11px] text-purple-300
                         hover:bg-purple-900/50 transition-colors"
            >
              <BookOpen className="w-3 h-3" />
              <span>{cit.document_id ? `Doc · Pg ${cit.page}` : cit.snippet?.slice(0, 30)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Thinking Animation ───────────────────────────────────────────────────────
function ThinkingIndicator({ webSearch }: { webSearch: boolean }) {
  const [step, setStep] = useState(0);
  const webSteps = ["Searching the web…", "Reading sources…", "Synthesising answer…"];
  const docSteps = ["Reading documents…", "Cross-referencing evidence…", "Generating response…"];
  const steps = webSearch ? webSteps : docSteps;

  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % steps.length), 1400);
    return () => clearInterval(t);
  }, [steps.length]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-[12px] text-purple-400">
        {webSearch ? (
          <Globe className="w-3.5 h-3.5 animate-pulse" />
        ) : (
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        )}
        <span className="font-medium uppercase tracking-wider">
          {webSearch ? "Web Search" : "Document AI"}
        </span>
      </div>
      <div className="flex items-center gap-3 text-sm text-purple-300/70">
        <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
        <span className="transition-all">{steps[step]}</span>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({
  webSearch, onSuggest
}: { webSearch: boolean; onSuggest: (q: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-10 text-center px-4">
      <div>
        <div className="w-16 h-16 rounded-2xl bg-[#7C3AED]/20 border border-purple-500/30
                        flex items-center justify-center mx-auto mb-5">
          {webSearch
            ? <Globe className="w-8 h-8 text-purple-400" />
            : <Sparkles className="w-8 h-8 text-purple-400" />}
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {webSearch ? "Web + Document AI" : "Document AI"}
        </h2>
        <p className="text-purple-300/60 text-sm max-w-sm mx-auto">
          {webSearch
            ? "Ask anything. Synaps searches the web and your documents simultaneously."
            : "Ask about your uploaded documents. Every answer cites the exact page and line."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
        {SUGGESTED.map((q) => (
          <button
            key={q}
            onClick={() => onSuggest(q)}
            className="text-left p-4 rounded-xl bg-[#1A1630] border border-purple-500/20
                       hover:border-purple-400/40 hover:bg-[#1E1A3A] transition-all group"
          >
            <Lightbulb className="w-4 h-4 text-purple-400 mb-2 group-hover:text-purple-300 transition-colors" />
            <p className="text-[13px] text-purple-200/80 leading-snug">{q}</p>
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

  const activeChat = chats.find(c => c.id === activeChatId) ?? null;

  // Auto scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  // Auto resize textarea
  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, []);

  useEffect(() => { resizeTextarea(); }, [input, resizeTextarea]);

  // ── New chat ────────────────────────────────────────────────────────────────
  const newChat = () => {
    const chat: Chat = { id: uid(), title: "New conversation", messages: [], createdAt: new Date() };
    setChats(prev => [chat, ...prev]);
    setActiveChatId(chat.id);
  };

  // ── Send message ────────────────────────────────────────────────────────────
  const send = useCallback(async (overrideInput?: string) => {
    const q = (overrideInput ?? input).trim();
    if (!q || isLoading) return;

    // Ensure a chat exists
    let chatId = activeChatId;
    if (!chatId) {
      const chat: Chat = { id: uid(), title: q.slice(0, 50), messages: [], createdAt: new Date() };
      setChats(prev => [chat, ...prev]);
      setActiveChatId(chat.id);
      chatId = chat.id;
    }

    const userMsg: Message = { id: uid(), role: "user", content: q };
    const assistantMsgId = uid();

    // Detect web search: explicit keyword or toggle enabled
    const isWebQuery = webSearch ||
      /search the web|google|latest news|recent|current|today|2024|2025|2026/i.test(q);

    setChats(prev => prev.map(c => c.id === chatId
      ? {
        ...c,
        title: c.messages.length === 0 ? q.slice(0, 50) : c.title,
        messages: [...c.messages, userMsg, {
          id: assistantMsgId,
          role: "assistant",
          content: "",
          isStreaming: true,
          isWebSearch: isWebQuery,
        }]
      }
      : c
    ));

    setInput("");
    setIsLoading(true);

    try {
      if (isWebQuery) {
        // ── Web Search path ──────────────────────────────────────────────────
        const res = await fetch("/api/web-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q }),
        });
        const data = await res.json();

        setChats(prev => prev.map(c => c.id === chatId
          ? {
            ...c,
            messages: c.messages.map(m => m.id === assistantMsgId
              ? {
                ...m,
                content: data.answer || "No answer returned.",
                webSources: data.sources || [],
                isStreaming: false,
                thinking: ["Searched Google", `Found ${(data.sources || []).length} sources`, "Synthesised answer"],
              }
              : m
            )
          }
          : c
        ));

      } else {
        // ── Document AI path ─────────────────────────────────────────────────
        const messages = (activeChat?.messages ?? [])
          .filter(m => !m.isStreaming)
          .map(m => ({ role: m.role, content: m.content }))
          .concat({ role: "user", content: q });

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages }),
        });
        const data = await res.json();

        setChats(prev => prev.map(c => c.id === chatId
          ? {
            ...c,
            messages: c.messages.map(m => m.id === assistantMsgId
              ? {
                ...m,
                content: data.answer || data.error || "No response.",
                citations: data.evidence?.slice(0, 5).map((e: any) => ({
                  document_id: e.name || e.documentId,
                  page: e.pageNumber,
                  snippet: e.text?.slice(0, 60),
                })) || [],
                isStreaming: false,
                thinking: ["Searched documents", "Cross-referenced evidence", "Generated grounded answer"],
              }
              : m
            )
          }
          : c
        ));
      }
    } catch (err: any) {
      setChats(prev => prev.map(c => c.id === chatId
        ? {
          ...c,
          messages: c.messages.map(m => m.id === assistantMsgId
            ? { ...m, content: "Something went wrong. Please try again.", isStreaming: false }
            : m
          )
        }
        : c
      ));
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, activeChatId, activeChat, webSearch]);

  // ── Delete chat ─────────────────────────────────────────────────────────────
  const deleteChat = (id: string) => {
    setChats(prev => prev.filter(c => c.id !== id));
    if (activeChatId === id) setActiveChatId(null);
  };

  return (
    <div className="flex h-screen bg-[#0B0A12] text-white overflow-hidden">

      {/* ── SIDEBAR ─────────────────────────────────────────────────────────── */}
      <aside className={`
        flex flex-col shrink-0 bg-[#100E1E] border-r border-purple-500/10
        transition-all duration-300 overflow-hidden
        ${sidebarOpen ? "w-64" : "w-0"}
      `}>
        {/* New chat */}
        <div className="p-3 border-b border-purple-500/10">
          <button
            onClick={newChat}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl
                       bg-[#7C3AED]/20 hover:bg-[#7C3AED]/30 text-purple-200
                       text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New conversation
          </button>
        </div>

        {/* History */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {chats.length === 0 ? (
            <p className="text-center text-purple-500/40 text-xs py-8">No conversations yet</p>
          ) : (
            chats.map(chat => (
              <div key={chat.id} className="group relative">
                <button
                  onClick={() => setActiveChatId(chat.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm truncate transition-colors
                    ${activeChatId === chat.id
                      ? "bg-[#7C3AED]/25 text-white"
                      : "text-purple-300/70 hover:bg-purple-900/20 hover:text-white"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 shrink-0 opacity-50" />
                    <span className="truncate">{chat.title}</span>
                  </div>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md
                             opacity-0 group-hover:opacity-100 hover:bg-red-900/40 text-red-400 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* ── MAIN AREA ───────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="shrink-0 h-14 flex items-center justify-between px-4
                           border-b border-purple-500/10 bg-[#0D0B1A]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(v => !v)}
              className="p-2 rounded-lg hover:bg-purple-900/30 text-purple-400 transition-colors"
            >
              <AlignLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Synaps</span>
              <span className="text-purple-400/60 text-sm">AI</span>
            </div>
          </div>

          {/* Web search toggle */}
          <button
            onClick={() => setWebSearch(v => !v)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                        border transition-all
                        ${webSearch
                          ? "bg-[#7C3AED]/30 border-purple-400 text-purple-200"
                          : "bg-transparent border-purple-500/20 text-purple-400/60 hover:border-purple-500/50 hover:text-purple-300"
                        }`}
          >
            <Globe className={`w-4 h-4 ${webSearch ? "animate-pulse" : ""}`} />
            <span>Web Search {webSearch ? "ON" : "OFF"}</span>
          </button>
        </header>

        {/* Messages or Empty State */}
        <div className="flex-1 overflow-y-auto">
          {!activeChat || activeChat.messages.length === 0 ? (
            <EmptyState webSearch={webSearch} onSuggest={(q) => send(q)} />
          ) : (
            <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
              {activeChat.messages.map((msg) => (
                <div key={msg.id}>
                  {msg.role === "user" ? (
                    <div className="flex justify-end">
                      <div className="max-w-[75%] bg-[#7C3AED] text-white px-5 py-3
                                      rounded-2xl rounded-tr-sm text-[15px] leading-relaxed">
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      {/* Avatar */}
                      <div className="w-8 h-8 shrink-0 rounded-xl bg-[#7C3AED]/30 border border-purple-500/30
                                      flex items-center justify-center mt-0.5">
                        {msg.isWebSearch
                          ? <Globe className="w-4 h-4 text-purple-400" />
                          : <Sparkles className="w-4 h-4 text-purple-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        {msg.isStreaming && msg.content === "" ? (
                          <ThinkingIndicator webSearch={!!msg.isWebSearch} />
                        ) : (
                          <MessageBubble msg={msg} />
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

        {/* Input Area */}
        <div className="shrink-0 p-4 bg-[#0D0B1A] border-t border-purple-500/10">
          <div className="max-w-3xl mx-auto">
            {/* Web search active indicator */}
            {webSearch && (
              <div className="flex items-center gap-2 mb-2 text-xs text-purple-400">
                <Globe className="w-3.5 h-3.5 animate-pulse" />
                <span>Web Search active — Synaps will search Google and your documents</span>
              </div>
            )}

            <div className={`relative flex items-end gap-2 rounded-2xl p-2 border
                            transition-all
                            ${webSearch
                              ? "bg-[#1A1630] border-purple-500/40"
                              : "bg-[#1A1630] border-purple-500/20 focus-within:border-purple-500/50"
                            }`}>
              {/* File attach */}
              <button className="p-2 shrink-0 text-purple-500 hover:text-purple-300
                                 hover:bg-purple-900/30 rounded-xl transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!activeChatId) newChat();
                    send();
                  }
                }}
                placeholder={webSearch
                  ? "Ask anything — I'll search the web and your documents…"
                  : "Ask about your documents…"}
                className="flex-1 bg-transparent resize-none py-2.5 px-2 outline-none
                           text-[15px] text-white placeholder-purple-400/40 min-h-[44px] max-h-[200px]"
                rows={1}
              />

              {/* Send */}
              <button
                onClick={() => {
                  if (!activeChatId) newChat();
                  send();
                }}
                disabled={!input.trim() || isLoading}
                className="p-2.5 shrink-0 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9]
                           disabled:opacity-30 disabled:cursor-not-allowed
                           text-white transition-all mb-0.5"
              >
                {isLoading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Send className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-center mt-2 text-[11px] text-purple-500/40">
              Every document answer cites its exact source. Web answers are grounded in live results.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
