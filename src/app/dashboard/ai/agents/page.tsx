'use client';

import { useState } from 'react';
import { Globe, Search, ExternalLink, Bot, Workflow, BookText, Sparkles, CheckCircle2, Mail, Phone, Building2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function AgentManagementPage() {
  const [activeTab, setActiveTab] = useState<'agents' | 'reach' | 'prime'>('prime');
  
  // Prime Agent RLM Console State
  const [primeTaskInput, setPrimeTaskInput] = useState('Audit all Q3 hotel supply contracts, calculate financial exposure in Python, and output board verdict');
  const [primeLoading, setPrimeLoading] = useState(false);
  const [primeResult, setPrimeResult] = useState<any | null>(null);

  // AgentReach Console State
  const [searchQuery, setSearchQuery] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [targetDomain, setTargetDomain] = useState('');

  const [reachAction, setReachAction] = useState<'search' | 'read' | 'contacts'>('search');
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState<any | null>(null);

  const handleExecutePrimeAgent = async () => {
    setPrimeLoading(true);
    setPrimeResult(null);

    try {
      const res = await fetch('/api/agents/prime-orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: primeTaskInput, model: 'gemini-1.5-pro' }),
      });
      const json = await res.json();
      setPrimeResult(json);
    } catch (e: any) {
      setPrimeResult({ error: e.message || 'Failed to execute Prime Agent RLM Orchestrator' });
    } finally {
      setPrimeLoading(false);
    }
  };

  const handleExecuteReach = async () => {
    setLoading(true);
    setResultData(null);

    try {
      let payload: any = { action: reachAction };
      if (reachAction === 'search') payload.query = searchQuery;
      if (reachAction === 'read') payload.url = targetUrl;
      if (reachAction === 'contacts') payload.domain = targetDomain;

      const res = await fetch('/api/agents/reach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        setResultData(json);
      } else {
        setResultData({ error: json.error || 'Failed to execute web reach.' });
      }
    } catch (e: any) {
      setResultData({ error: e.message || 'Network error executing AgentReach' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 font-sans pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center">
            <Globe className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-base-content">Agent Suite &amp; RLM Orchestrator</h1>
              <span className="badge badge-primary badge-sm font-mono text-[10px]">Prime Agent RLM Engine</span>
            </div>
            <p className="text-xs text-base-content/60 mt-0.5">Equip your 10 AI Agents with Prime Agent persistent Python RLM loops and AgentReach web search.</p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 bg-base-200 p-1 rounded-2xl border border-base-300 text-xs font-bold">
          <button
            onClick={() => setActiveTab('prime')}
            className={cn("px-4 py-2 rounded-xl transition-all flex items-center gap-1.5", activeTab === 'prime' ? "bg-base-100 shadow text-base-content" : "text-base-content/60")}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0496ff]" /> Prime Agent RLM
          </button>
          <button
            onClick={() => setActiveTab('reach')}
            className={cn("px-4 py-2 rounded-xl transition-all flex items-center gap-1.5", activeTab === 'reach' ? "bg-base-100 shadow text-base-content" : "text-base-content/60")}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-500" /> AgentReach Console
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={cn("px-4 py-2 rounded-xl transition-all flex items-center gap-1.5", activeTab === 'agents' ? "bg-base-100 shadow text-base-content" : "text-base-content/60")}
          >
            <Bot className="w-3.5 h-3.5 text-indigo-500" /> Deployed Fleet
          </button>
        </div>
      </div>

      {activeTab === 'prime' ? (
        <div className="space-y-6">
          <div className="bg-base-100 p-6 rounded-3xl border border-base-300 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-500" />
              <h2 className="font-bold text-lg text-base-content">Prime Agent Recursive RLM Task Runner</h2>
            </div>
            <p className="text-xs text-base-content/60">
              Run autonomous multi-step tasks powered by Prime Agent&apos;s Recursive Language Model architecture &amp; persistent IPython environment.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-base-content/70">Task Objective / Prompt:</label>
              <textarea
                rows={3}
                value={primeTaskInput}
                onChange={(e) => setPrimeTaskInput(e.target.value)}
                placeholder="Enter complex multi-step objective..."
                className="textarea textarea-bordered w-full text-xs font-mono"
              />
            </div>

            <Button
              onClick={handleExecutePrimeAgent}
              disabled={primeLoading}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-wider"
            >
              {primeLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              {primeLoading ? 'Spawning RLM Sub-Agents...' : 'Launch Prime Agent RLM Orchestration'}
            </Button>
          </div>

          {primeResult && (
            <div className="bg-base-100 p-6 rounded-3xl border border-base-300 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-sky-500">{primeResult.sessionId}</span>
                <span className="badge badge-success text-[10px] font-mono">{primeResult.auditHash}</span>
              </div>

              {primeResult.subAgents && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold font-mono text-base-content/70 uppercase">Spawned RLM Sub-Agents:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {primeResult.subAgents.map((sa: any) => (
                      <div key={sa.id} className="p-4 bg-base-200 rounded-2xl border border-base-300 space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold text-base-content">
                          <span>{sa.role}</span>
                          <span className="badge badge-sm badge-info text-[9px]">{sa.iterations} Loops</span>
                        </div>
                        <p className="text-[11px] text-base-content/70">{sa.findings}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 bg-sky-500/10 border border-sky-500/30 rounded-2xl">
                <pre className="text-xs font-mono text-base-content whitespace-pre-wrap">{primeResult.masterVerdict || JSON.stringify(primeResult, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === 'reach' ? (
        <div className="space-y-6">
          
          {/* Action Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => setReachAction('search')}
              className={cn(
                "p-5 rounded-3xl border cursor-pointer transition-all space-y-2 relative",
                reachAction === 'search' ? "bg-indigo-500/10 border-indigo-500 ring-2 ring-indigo-500/30" : "bg-base-100 border-base-300 hover:border-base-400"
              )}
            >
              <div className="flex justify-between items-start">
                <Search className="w-5 h-5 text-indigo-500" />
                {reachAction === 'search' && <CheckCircle2 className="w-4 h-4 text-indigo-500" />}
              </div>
              <h3 className="font-bold text-sm text-base-content">1. Live Web Search</h3>
              <p className="text-xs text-base-content/60">Search live internet data, market benchmarking, and vendor updates in real time.</p>
            </div>

            <div
              onClick={() => setReachAction('read')}
              className={cn(
                "p-5 rounded-3xl border cursor-pointer transition-all space-y-2 relative",
                reachAction === 'read' ? "bg-indigo-500/10 border-indigo-500 ring-2 ring-indigo-500/30" : "bg-base-100 border-base-300 hover:border-base-400"
              )}
            >
              <div className="flex justify-between items-start">
                <ExternalLink className="w-5 h-5 text-cyan-500" />
                {reachAction === 'read' && <CheckCircle2 className="w-4 h-4 text-cyan-500" />}
              </div>
              <h3 className="font-bold text-sm text-base-content">2. Webpage Scraper & Reader</h3>
              <p className="text-xs text-base-content/60">Fetch and convert any target URL webpage into clean structured markdown.</p>
            </div>

            <div
              onClick={() => setReachAction('contacts')}
              className={cn(
                "p-5 rounded-3xl border cursor-pointer transition-all space-y-2 relative",
                reachAction === 'contacts' ? "bg-indigo-500/10 border-indigo-500 ring-2 ring-indigo-500/30" : "bg-base-100 border-base-300 hover:border-base-400"
              )}
            >
              <div className="flex justify-between items-start">
                <Building2 className="w-5 h-5 text-emerald-500" />
                {reachAction === 'contacts' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              </div>
              <h3 className="font-bold text-sm text-base-content">3. B2B Company Contact Reach</h3>
              <p className="text-xs text-base-content/60">Scrape target domain to discover business emails, phone numbers, and LinkedIn links.</p>
            </div>
          </div>

          {/* Interactive Input Form */}
          <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-base-content/60 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" /> 
              {reachAction === 'search' && 'Execute Live Web Search Query'}
              {reachAction === 'read' && 'Fetch & Scrape Target URL'}
              {reachAction === 'contacts' && 'Discover B2B Company Contacts'}
            </h3>

            {reachAction === 'search' && (
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleExecuteReach()}
                  placeholder="e.g. Enterprise AI decision intelligence market growth 2026..."
                  className="flex-1 bg-base-200 border border-base-300 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <Button onClick={handleExecuteReach} disabled={loading || !searchQuery.trim()} className="rounded-2xl gap-2 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  {loading ? 'Searching Web...' : 'Run Agent Web Search'}
                </Button>
              </div>
            )}

            {reachAction === 'read' && (
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  value={targetUrl}
                  onChange={e => setTargetUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleExecuteReach()}
                  placeholder="e.g. https://github.com/Panniantong/agent-reach..."
                  className="flex-1 bg-base-200 border border-base-300 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <Button onClick={handleExecuteReach} disabled={loading || !targetUrl.trim()} className="rounded-2xl gap-2 py-3 px-6 bg-cyan-600 hover:bg-cyan-700 text-white font-bold">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                  {loading ? 'Scraping URL...' : 'Scrape Webpage'}
                </Button>
              </div>
            )}

            {reachAction === 'contacts' && (
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  value={targetDomain}
                  onChange={e => setTargetDomain(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleExecuteReach()}
                  placeholder="e.g. microsoft.com or stripe.com..."
                  className="flex-1 bg-base-200 border border-base-300 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <Button onClick={handleExecuteReach} disabled={loading || !targetDomain.trim()} className="rounded-2xl gap-2 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Building2 className="w-4 h-4" />}
                  {loading ? 'Discovering...' : 'Discover B2B Contacts'}
                </Button>
              </div>
            )}
          </div>

          {/* Results Output Console */}
          {resultData && (
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-md space-y-4 animate-in fade-in duration-300">
              <div className="flex justify-between items-center border-b border-base-200 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> AgentReach Connectivity Output
                </span>
                <span className="text-[10px] text-base-content/50 font-mono">Status: HTTP 200 OK</span>
              </div>

              {resultData.error ? (
                <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl text-xs font-bold">
                  {resultData.error}
                </div>
              ) : resultData.action === 'search' ? (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-base-content/70">Found {resultData.count} Live Results:</span>
                  {resultData.results?.map((res: any, idx: number) => (
                    <div key={idx} className="p-4 bg-base-200/60 border border-base-300 rounded-2xl space-y-1">
                      <a href={res.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                        {res.title} <ExternalLink className="w-3.5 h-3.5 inline-block" />
                      </a>
                      <span className="text-[11px] text-emerald-500 font-mono block">{res.url}</span>
                      <p className="text-xs text-base-content/80 pt-1 leading-relaxed">{res.snippet}</p>
                    </div>
                  ))}
                </div>
              ) : resultData.action === 'read_page' ? (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-base-content/70 block">Webpage Title: {resultData.data?.title}</span>
                  <pre className="p-4 bg-base-200 border border-base-300 rounded-2xl text-xs font-mono text-base-content/90 max-h-80 overflow-y-auto whitespace-pre-wrap">
                    {resultData.data?.content}
                  </pre>
                </div>
              ) : resultData.action === 'discover_contacts' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-base-200/70 border border-base-300 rounded-2xl space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                        <Mail className="w-4 h-4" /> Discovered B2B Emails:
                      </span>
                      <ul className="space-y-1 text-xs font-mono text-base-content/90">
                        {resultData.data?.emails?.map((em: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {em}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-base-200/70 border border-base-300 rounded-2xl space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-500 flex items-center gap-1.5">
                        <Phone className="w-4 h-4" /> Discovered Phone & Socials:
                      </span>
                      <ul className="space-y-1 text-xs font-mono text-base-content/90">
                        {resultData.data?.phoneNumbers?.map((ph: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Phone: {ph}
                          </li>
                        ))}
                        {resultData.data?.socialLinks?.map((soc: any, idx: number) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-cyan-500" /> {soc.platform}: <a href={soc.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">{soc.url}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

        </div>
      ) : (
        /* Deployed Fleet Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-base-100 border border-base-300 rounded-3xl p-6 shadow-sm flex flex-col space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base-content text-base">AgentReach Compliance & Web Intelligence</h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active & Web-Connected
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-base-content/70 leading-relaxed">
              Equipped with Panniantong/agent-reach live web search, webpage scraping, and domain contact discovery capabilities.
            </p>

            <div className="space-y-2 border-t border-base-200 pt-4 text-xs font-medium">
              <div className="flex items-center text-base-content/70 gap-2">
                <Globe className="w-4 h-4 text-indigo-500" />
                <span>Web Connectivity: <strong>Enabled (AgentReach v2.0)</strong></span>
              </div>
              <div className="flex items-center text-base-content/70 gap-2">
                <BookText className="w-4 h-4 text-indigo-500" />
                <span>Knowledge: <strong>100% Grounded + Web Real-Time Data</strong></span>
              </div>
              <div className="flex items-center text-base-content/70 gap-2">
                <Workflow className="w-4 h-4 text-indigo-500" />
                <span>ReAct Loop: <strong>Think ➔ Act (Web Search) ➔ Observe</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
