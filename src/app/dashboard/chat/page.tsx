"use client";

import React, { useState } from "react";
import { 
  Send, BookOpen, Paperclip, ChevronDown, Menu, Plus, Search, User, Settings, Folder 
} from "lucide-react";

export default function ChatPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string; citations?: any[] }>>([
    { role: "assistant", content: "Hello! I am your Synaps AI Assistant, powered by Open WebUI patterns. How can I help you today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev, 
        {
          role: "assistant",
          content: "I have analyzed the uploaded document. The main takeaways align with the Q3 compliance audit requirements.",
          citations: [
            { document_id: "doc-99", page: 4, snippet: "Audit requirements for Q3..." }
          ]
        }
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden text-slate-800">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Open WebUI style) */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-[#f9f9f9] border-r transform transition-transform duration-300 ease-in-out flex flex-col
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:hidden"}
      `}>
        {/* New Chat Button */}
        <div className="p-4">
          <button className="w-full flex items-center justify-between bg-white border border-slate-200 hover:bg-slate-50 transition-colors px-3 py-2 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Plus className="w-4 h-4" /> New Chat
            </div>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          <div className="px-2 pt-2 pb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Today</div>
          <button className="w-full text-left px-3 py-2 text-sm rounded-md bg-slate-200/50 font-medium truncate">
            Compliance Audit Q3
          </button>
          <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-slate-200/50 truncate text-slate-600">
            Onboarding Doc Analysis
          </button>
          
          <div className="px-2 pt-4 pb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Workspace</div>
          <button className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm rounded-md hover:bg-slate-200/50 text-slate-600">
            <Folder className="w-4 h-4" /> Project Alpha Notes
          </button>
        </div>

        {/* User Profile / Settings */}
        <div className="p-4 border-t mt-auto">
          <button className="w-full flex items-center gap-3 px-2 py-2 hover:bg-slate-200/50 rounded-md transition-colors">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">Admin User</div>
              <div className="text-xs text-slate-500">Settings</div>
            </div>
            <Settings className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-4 shrink-0 border-b lg:border-none">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-md lg:hidden text-slate-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Model Selector (Open WebUI style) */}
            <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 rounded-lg transition-colors font-medium text-lg">
              GPT-4o <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-0">
          <div className="max-w-3xl mx-auto py-8 space-y-8">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 ${msg.role === "user" ? "justify-end" : ""}`}>
                
                {/* Assistant Avatar */}
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 shrink-0 rounded-full bg-emerald-600 flex items-center justify-center text-white mt-1">
                    <span className="text-xs font-bold">AI</span>
                  </div>
                )}

                {/* Message Content */}
                <div className={`max-w-[85%] ${msg.role === "user" ? "bg-[#f4f4f4] px-5 py-3 rounded-2xl rounded-tr-sm" : ""}`}>
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  
                  {/* Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {msg.citations.map((cit, cIdx) => (
                        <button key={cIdx} className="flex items-center gap-1.5 bg-white border shadow-sm px-2.5 py-1 rounded-full text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                          <BookOpen className="w-3 h-3 text-emerald-600" />
                          <span className="font-medium">Doc #{cit.document_id}</span>
                          <span className="opacity-50">· Pg {cit.page}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-4">
                <div className="w-8 h-8 shrink-0 rounded-full bg-emerald-600 flex items-center justify-center text-white mt-1">
                  <span className="text-xs font-bold">AI</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 mt-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="shrink-0 p-4 w-full max-w-4xl mx-auto">
          <div className="relative flex items-end gap-2 bg-[#f4f4f4] rounded-2xl p-2 border border-transparent focus-within:border-slate-300 focus-within:bg-white transition-colors shadow-sm">
            
            {/* Attachment Button */}
            <button className="p-2 shrink-0 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Expanding Textarea Simulation */}
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Message Synaps AI..."
              className="w-full max-h-48 min-h-[44px] bg-transparent resize-none py-3 px-2 outline-none text-[15px]"
              rows={1}
            />

            {/* Send Button */}
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-2 shrink-0 bg-slate-800 text-white rounded-xl hover:bg-slate-700 disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 transition-colors mb-0.5 mr-0.5"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center mt-2">
            <span className="text-[11px] text-slate-400">AI can make mistakes. Verify important information.</span>
          </div>
        </div>
      </main>
    </div>
  );
}
