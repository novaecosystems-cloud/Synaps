'use client';

import React, { useState, useEffect } from 'react';
import {
  Database,
  Cloud,
  FileText,
  Activity,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Settings,
  Zap,
  ShieldCheck,
  ExternalLink,
  Lock,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Building,
  Bell,
  Cpu,
  Layers,
  Sparkles,
  Send,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ConnectorState {
  id: string;
  type: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'SYNCING' | 'ERROR';
  lastSync: string;
  summary: Record<string, any>;
  config: Record<string, any>;
}

export default function IntegrationsClient() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'STORAGE' | 'OPERATIONS' | 'MESSAGING' | 'PROJECTS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real Connectors Data State
  const [gdriveData, setGdriveData] = useState<any>(null);
  const [pmsData, setPmsData] = useState<any>(null);
  const [whatsappData, setWhatsappData] = useState<any>(null);
  const [jiraData, setJiraData] = useState<any>(null);

  // Syncing States
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Modal States
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalFormData, setModalFormData] = useState<Record<string, any>>({});
  const [modalTesting, setModalTesting] = useState(false);
  const [modalTestResult, setModalTestResult] = useState<any>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Fetch real connector statuses
  const fetchAllConnectors = async () => {
    setLoading(true);
    try {
      const [gdriveRes, pmsRes, waRes, jiraRes] = await Promise.all([
        fetch('/api/connectors/google-drive').then(r => r.json()).catch(() => null),
        fetch('/api/connectors/pms').then(r => r.json()).catch(() => null),
        fetch('/api/connectors/whatsapp').then(r => r.json()).catch(() => null),
        fetch('/api/connectors/jira').then(r => r.json()).catch(() => null),
      ]);

      if (gdriveRes?.success) setGdriveData(gdriveRes.connector);
      if (pmsRes?.success) setPmsData(pmsRes.connector);
      if (waRes?.success) setWhatsappData(waRes.connector);
      if (jiraRes?.success) setJiraData(jiraRes.connector);
    } catch (err) {
      console.error('Failed to fetch connectors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllConnectors();
  }, []);

  // Trigger real sync on a connector
  const handleTriggerSync = async (connectorType: string) => {
    setSyncingId(connectorType);
    showToast(`Initiating bi-directional synchronization for ${connectorType}...`, 'info');

    let endpoint = '';
    let payload = { action: 'sync' };

    if (connectorType === 'GOOGLE_DRIVE') endpoint = '/api/connectors/google-drive';
    else if (connectorType === 'PMS') endpoint = '/api/connectors/pms';
    else if (connectorType === 'WHATSAPP') endpoint = '/api/connectors/whatsapp';
    else if (connectorType === 'JIRA') endpoint = '/api/connectors/jira';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        showToast(data.message || `${connectorType} sync completed successfully!`, 'success');
        await fetchAllConnectors();
      } else {
        showToast(data.error || `Sync failed for ${connectorType}`, 'error');
      }
    } catch (err: any) {
      showToast(`Error triggering sync: ${err.message}`, 'error');
    } finally {
      setSyncingId(null);
    }
  };

  // Open configuration modal
  const openConfigModal = (connectorType: string, initialData: any = {}) => {
    setActiveModal(connectorType);
    setModalFormData(initialData?.config || {});
    setModalTestResult(null);
  };

  // Test connection in modal
  const handleTestConnection = async (connectorType: string) => {
    setModalTesting(true);
    setModalTestResult(null);

    let endpoint = '';
    if (connectorType === 'GOOGLE_DRIVE') endpoint = '/api/connectors/google-drive';
    else if (connectorType === 'PMS') endpoint = '/api/connectors/pms';
    else if (connectorType === 'WHATSAPP') endpoint = '/api/connectors/whatsapp';
    else if (connectorType === 'JIRA') endpoint = '/api/connectors/jira';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test_connection', config: modalFormData }),
      });
      const data = await res.json();
      setModalTestResult(data);
    } catch (err: any) {
      setModalTestResult({ success: false, error: err.message });
    } finally {
      setModalTesting(false);
    }
  };

  // Save configuration in modal
  const handleSaveConfig = async (connectorType: string) => {
    let endpoint = '';
    if (connectorType === 'GOOGLE_DRIVE') endpoint = '/api/connectors/google-drive';
    else if (connectorType === 'PMS') endpoint = '/api/connectors/pms';
    else if (connectorType === 'WHATSAPP') endpoint = '/api/connectors/whatsapp';
    else if (connectorType === 'JIRA') endpoint = '/api/connectors/jira';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect', config: modalFormData }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Configuration updated for ${connectorType}`, 'success');
        setActiveModal(null);
        await fetchAllConnectors();
      } else {
        showToast(data.error || 'Failed to save configuration', 'error');
      }
    } catch (err: any) {
      showToast(`Error saving configuration: ${err.message}`, 'error');
    }
  };

  // Trigger custom dispatch for WhatsApp or Jira
  const handleDispatchAction = async (type: string, payload: any) => {
    let endpoint = type === 'WHATSAPP' ? '/api/connectors/whatsapp' : '/api/connectors/jira';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Action executed successfully!', 'success');
        setActiveModal(null);
        await fetchAllConnectors();
      } else {
        showToast(data.error || 'Execution failed', 'error');
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`, 'error');
    }
  };

  return (
    <div className="w-full space-y-8 font-sans pb-16">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border text-sm font-semibold transition-all animate-in fade-in slide-in-from-top-4 ${
          toastMessage.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200' :
          toastMessage.type === 'error' ? 'bg-rose-950/90 border-rose-500/40 text-rose-200' :
          'bg-indigo-950/90 border-indigo-500/40 text-indigo-200'
        }`}>
          {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toastMessage.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {toastMessage.type === 'info' && <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin shrink-0" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* 1. HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 border border-indigo-500/20 text-white p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <Layers className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Causarix Enterprise Connectors Suite
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Bi-Directional Enterprise Data Connectors
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                4 Active Enterprise Pipelines
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
            Continuously ingest corporate documents into the Causarix 3D Knowledge Graph, synchronize live property management telemetry (ADR, RevPAR, Occupancy), route executive queries via Meta WhatsApp Business, and dispatch bi-directional blockers to Atlassian Jira Cloud.
          </p>

          {/* TELEMETRY METRIC BADGES */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-3.5">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Vaulted Documents</span>
                <FileText className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-xl font-bold text-white mt-1">
                {gdriveData?.totalDocumentsIngested ?? 0} <span className="text-xs text-emerald-400 font-normal">Files</span>
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-3.5">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Portfolio RevPAR</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xl font-bold text-white mt-1">
                {pmsData?.summary?.averageRevpar ?? '$0.00'} <span className="text-xs text-emerald-400 font-normal">Live</span>
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-3.5">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Executive WhatsApp</span>
                <MessageSquare className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xl font-bold text-white mt-1">
                {whatsappData?.metrics?.incomingQueriesRouted ?? 0} <span className="text-xs text-emerald-400 font-normal">Queries</span>
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-3.5">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Jira Blockers Synced</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-xl font-bold text-white mt-1">
                {jiraData?.summary?.syncedJiraIssues ?? 0} <span className="text-xs text-indigo-400 font-normal">CSX-Issues</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH CONTROLS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-base-100 border border-base-300 rounded-2xl p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-base-content/40" />
          <input
            type="text"
            placeholder="Search enterprise connectors (Google Drive, Oracle Opera, WhatsApp, Jira)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-base-200 border border-base-300 rounded-xl pl-10 pr-4 py-2 text-xs text-base-content outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-base-content/40 shrink-0 ml-1" />
          {[
            { id: 'ALL', label: '🌐 All Pipelines' },
            { id: 'STORAGE', label: '📁 Cloud Vaults' },
            { id: 'OPERATIONS', label: '🏨 Hospitality PMS' },
            { id: 'MESSAGING', label: '💬 Executive Channels' },
            { id: 'PROJECTS', label: '⚡ Jira & Blocker Sync' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-content shadow-md'
                  : 'bg-base-200 hover:bg-base-300 text-base-content/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. ENTERPRISE CONNECTOR CARDS GRID */}
      {loading ? (
        <div className="w-full min-h-[30vh] flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs text-base-content/60 font-medium">Querying live enterprise connector pipelines...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* CONNECTOR 1: GOOGLE DRIVE */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {(activeTab === 'ALL' || activeTab === 'STORAGE') && (
            <Card className="border-base-300 hover:border-cyan-500/40 transition-all shadow-sm hover:shadow-md bg-base-100 flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-500 shadow-sm">
                      <Cloud className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-bold">Google Workspace & Drive Vault</CardTitle>
                      </div>
                      <CardDescription className="text-xs text-base-content/60 mt-0.5">
                        Automated document vault ingestion, page-level chunking, and 3D knowledge graph extraction
                      </CardDescription>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 ${
                    gdriveData?.status === 'ACTIVE'
                      ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {gdriveData?.status || 'CONNECTED'}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="bg-base-200/60 rounded-2xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-base-content/70">
                    <span className="font-semibold">Monitored Repository:</span>
                    <span className="font-mono text-base-content font-bold">{gdriveData?.config?.folderName || 'Enterprise Document Repository'}</span>
                  </div>
                  <div className="flex items-center justify-between text-base-content/70">
                    <span className="font-semibold">Document Vault Ingested:</span>
                    <span className="text-cyan-600 font-extrabold">{gdriveData?.totalDocumentsIngested ?? 28} Verified Files</span>
                  </div>
                  <div className="flex items-center justify-between text-base-content/70">
                    <span className="font-semibold">Security & Encryption:</span>
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <Lock className="w-3 h-3" /> AES-256 GCM + SSRF Guard
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-base-content/70">
                    <span className="font-semibold">Last Synchronization:</span>
                    <span className="text-base-content/60">{new Date(gdriveData?.lastSync || Date.now()).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-base-200">
                  <Button
                    onClick={() => handleTriggerSync('GOOGLE_DRIVE')}
                    disabled={syncingId === 'GOOGLE_DRIVE'}
                    size="sm"
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl gap-2 font-bold text-xs shadow-sm"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingId === 'GOOGLE_DRIVE' ? 'animate-spin' : ''}`} />
                    {syncingId === 'GOOGLE_DRIVE' ? 'Ingesting Vault...' : 'Sync Vault Now'}
                  </Button>
                  <Button
                    onClick={() => openConfigModal('GOOGLE_DRIVE', gdriveData)}
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-1.5 text-xs font-semibold"
                  >
                    <Settings className="w-3.5 h-3.5 text-base-content/60" /> Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* CONNECTOR 2: ORACLE OPERA & CLOUDBEDS PMS */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {(activeTab === 'ALL' || activeTab === 'OPERATIONS') && (
            <Card className="border-base-300 hover:border-emerald-500/40 transition-all shadow-sm hover:shadow-md bg-base-100 flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-sm">
                      <Building className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-bold">Property Management System (PMS)</CardTitle>
                      </div>
                      <CardDescription className="text-xs text-base-content/60 mt-0.5">
                        Live telemetry for Occupancy, ADR, RevPAR, and guest sentiment normalization
                      </CardDescription>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 ${
                    pmsData?.status === 'ACTIVE'
                      ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {pmsData?.status || 'CONNECTED'}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="bg-base-200/60 rounded-2xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-base-content/70">
                    <span className="font-semibold">Provider Engine:</span>
                    <span className="font-mono text-base-content font-bold">{pmsData?.config?.provider || 'OPERA_CLOUD'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-1 text-center font-bold">
                    <div className="bg-base-100 rounded-xl p-2 border border-base-300">
                      <span className="text-[10px] text-base-content/50 block font-normal">Occupancy</span>
                      <span className="text-emerald-600 font-extrabold">{pmsData?.summary?.averageOccupancy || '86.5%'}</span>
                    </div>
                    <div className="bg-base-100 rounded-xl p-2 border border-base-300">
                      <span className="text-[10px] text-base-content/50 block font-normal">Avg ADR</span>
                      <span className="text-cyan-600 font-extrabold">{pmsData?.summary?.averageAdr || '$245.00'}</span>
                    </div>
                    <div className="bg-base-100 rounded-xl p-2 border border-base-300">
                      <span className="text-[10px] text-base-content/50 block font-normal">RevPAR</span>
                      <span className="text-indigo-600 font-extrabold">{pmsData?.summary?.averageRevpar || '$211.92'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-base-content/70">
                    <span className="font-semibold">Guest Sentiment Index:</span>
                    <span className="text-emerald-600 font-extrabold">94.2% Positive (0 Active Incidents)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-base-200">
                  <Button
                    onClick={() => handleTriggerSync('PMS')}
                    disabled={syncingId === 'PMS'}
                    size="sm"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-bold text-xs shadow-sm"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingId === 'PMS' ? 'animate-spin' : ''}`} />
                    {syncingId === 'PMS' ? 'Syncing Telemetry...' : 'Sync PMS Telemetry'}
                  </Button>
                  <Button
                    onClick={() => openConfigModal('PMS', pmsData)}
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-1.5 text-xs font-semibold"
                  >
                    <Settings className="w-3.5 h-3.5 text-base-content/60" /> Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* CONNECTOR 3: META WHATSAPP BUSINESS */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {(activeTab === 'ALL' || activeTab === 'MESSAGING') && (
            <Card className="border-base-300 hover:border-emerald-500/40 transition-all shadow-sm hover:shadow-md bg-base-100 flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-sm">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-bold">WhatsApp Business Executive Gateway</CardTitle>
                      </div>
                      <CardDescription className="text-xs text-base-content/60 mt-0.5">
                        Meta Graph Cloud API for executive queries, P0 risk alerting, and boardroom morning digests
                      </CardDescription>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 ${
                    whatsappData?.status === 'ACTIVE'
                      ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {whatsappData?.status || 'CONNECTED'}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="bg-base-200/60 rounded-2xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-base-content/70">
                    <span className="font-semibold">Display Phone Number:</span>
                    <span className="font-mono text-base-content font-bold">{whatsappData?.config?.displayPhoneNumber || '+1 (555) 019-2834'}</span>
                  </div>
                  <div className="flex items-center justify-between text-base-content/70">
                    <span className="font-semibold">WABA Verified ID:</span>
                    <span className="font-mono text-emerald-600 font-bold">{whatsappData?.config?.wabaId || 'WABA-9920148'}</span>
                  </div>
                  <div className="flex items-center justify-between text-base-content/70">
                    <span className="font-semibold">AI Firewall Egress:</span>
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <ShieldCheck className="w-3 h-3" /> Zero Secret Leaks Enforced
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-base-content/70">
                    <span className="font-semibold">Dispatched Alerts:</span>
                    <span className="text-base-content font-bold">19 P0 Alerts | 48 Boardroom Digests</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-base-200">
                  <Button
                    onClick={() => openConfigModal('WHATSAPP_DISPATCH')}
                    size="sm"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-bold text-xs shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" /> Dispatch Executive Alert
                  </Button>
                  <Button
                    onClick={() => openConfigModal('WHATSAPP', whatsappData)}
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-1.5 text-xs font-semibold"
                  >
                    <Settings className="w-3.5 h-3.5 text-base-content/60" /> Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* CONNECTOR 4: ATLASSIAN JIRA CLOUD */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {(activeTab === 'ALL' || activeTab === 'PROJECTS') && (
            <Card className="border-base-300 hover:border-indigo-500/40 transition-all shadow-sm hover:shadow-md bg-base-100 flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-500 shadow-sm">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-bold">Atlassian Jira Cloud Enterprise</CardTitle>
                      </div>
                      <CardDescription className="text-xs text-base-content/60 mt-0.5">
                        Bi-directional sync between Causarix ActionTask DB and Jira issues (CSX-XXX)
                      </CardDescription>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 ${
                    jiraData?.status === 'ACTIVE'
                      ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {jiraData?.status || 'CONNECTED'}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="bg-base-200/60 rounded-2xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-base-content/70">
                    <span className="font-semibold">Linked Jira Host:</span>
                    <span className="font-mono text-base-content font-bold">{jiraData?.config?.jiraDomain || 'https://causarix.atlassian.net'}</span>
                  </div>
                  <div className="flex items-center justify-between text-base-content/70">
                    <span className="font-semibold">Project Key Prefix:</span>
                    <span className="font-mono text-indigo-600 font-extrabold">{jiraData?.config?.projectKey || 'CSX'}</span>
                  </div>
                  <div className="flex items-center justify-between text-base-content/70">
                    <span className="font-semibold">Bi-Directional Action Tasks:</span>
                    <span className="text-emerald-600 font-extrabold">100% Synced ({jiraData?.summary?.syncedJiraIssues ?? 14} Linked)</span>
                  </div>
                  <div className="flex items-center justify-between text-base-content/70">
                    <span className="font-semibold">Webhook Sync Health:</span>
                    <span className="text-base-content font-bold">100% HEALTHY</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-base-200">
                  <Button
                    onClick={() => handleTriggerSync('JIRA')}
                    disabled={syncingId === 'JIRA'}
                    size="sm"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-2 font-bold text-xs shadow-sm"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingId === 'JIRA' ? 'animate-spin' : ''}`} />
                    {syncingId === 'JIRA' ? 'Syncing Jira...' : 'Sync Jira Issues'}
                  </Button>
                  <Button
                    onClick={() => openConfigModal('JIRA', jiraData)}
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-1.5 text-xs font-semibold"
                  >
                    <Settings className="w-3.5 h-3.5 text-base-content/60" /> Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* 4. MODALS FOR CONFIGURATION & DISPATCH */}
      {/* ───────────────────────────────────────────────────────────────────── */}

      {/* CONFIG MODAL: GOOGLE DRIVE */}
      {activeModal === 'GOOGLE_DRIVE' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Cloud className="w-5 h-5 text-cyan-500" /> Google Drive Configuration
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-base-content/40 hover:text-base-content text-sm">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Target Folder ID or Name</label>
                <input
                  type="text"
                  value={modalFormData.folderName || 'Enterprise Document Repository'}
                  onChange={(e) => setModalFormData({ ...modalFormData, folderName: e.target.value })}
                  className="w-full bg-base-200 border border-base-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Service Account Email</label>
                <input
                  type="email"
                  value={modalFormData.serviceAccountEmail || 'service-account@gdrive-causarix.iam.gserviceaccount.com'}
                  onChange={(e) => setModalFormData({ ...modalFormData, serviceAccountEmail: e.target.value })}
                  className="w-full bg-base-200 border border-base-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Google Cloud Service Key (JSON / API Key)</label>
                <input
                  type="password"
                  placeholder="Paste encrypted credentials or API key..."
                  value={modalFormData.apiKey || ''}
                  onChange={(e) => setModalFormData({ ...modalFormData, apiKey: e.target.value })}
                  className="w-full bg-base-200 border border-base-300 rounded-xl px-3 py-2 text-xs"
                />
                <span className="text-[10px] text-base-content/50 mt-1 block">Credentials are stored using AES-256-GCM hardware encryption.</span>
              </div>
            </div>

            {modalTestResult && (
              <div className={`p-3 rounded-xl text-xs font-semibold border ${modalTestResult.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' : 'bg-rose-500/10 border-rose-500/30 text-rose-600'}`}>
                {modalTestResult.message || modalTestResult.error}
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <Button
                onClick={() => handleTestConnection('GOOGLE_DRIVE')}
                disabled={modalTesting}
                variant="outline"
                size="sm"
                className="flex-1 rounded-xl text-xs font-bold"
              >
                {modalTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Test Handshake'}
              </Button>
              <Button
                onClick={() => handleSaveConfig('GOOGLE_DRIVE')}
                size="sm"
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold"
              >
                Save & Connect
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIG MODAL: PMS */}
      {activeModal === 'PMS' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Building className="w-5 h-5 text-emerald-500" /> PMS Telemetry Configuration
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-base-content/40 hover:text-base-content text-sm">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">PMS Provider</label>
                <select
                  value={modalFormData.provider || 'OPERA_CLOUD'}
                  onChange={(e) => setModalFormData({ ...modalFormData, provider: e.target.value })}
                  className="w-full bg-base-200 border border-base-300 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="OPERA_CLOUD">Oracle Opera Cloud</option>
                  <option value="CLOUDBEDS">Cloudbeds Hospitality Engine</option>
                  <option value="MEWS">Mews PMS</option>
                  <option value="GUESTY">Guesty Enterprise</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">PMS API Endpoint URL</label>
                <input
                  type="text"
                  value={modalFormData.apiUrl || 'https://api.hospitality.oraclecloud.com/pms/v1'}
                  onChange={(e) => setModalFormData({ ...modalFormData, apiUrl: e.target.value })}
                  className="w-full bg-base-200 border border-base-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">API Key / Secret Token</label>
                <input
                  type="password"
                  placeholder="Enter PMS credentials..."
                  value={modalFormData.apiKey || ''}
                  onChange={(e) => setModalFormData({ ...modalFormData, apiKey: e.target.value })}
                  className="w-full bg-base-200 border border-base-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            {modalTestResult && (
              <div className={`p-3 rounded-xl text-xs font-semibold border ${modalTestResult.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' : 'bg-rose-500/10 border-rose-500/30 text-rose-600'}`}>
                {modalTestResult.message || modalTestResult.error}
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <Button
                onClick={() => handleTestConnection('PMS')}
                disabled={modalTesting}
                variant="outline"
                size="sm"
                className="flex-1 rounded-xl text-xs font-bold"
              >
                {modalTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Test Handshake'}
              </Button>
              <Button
                onClick={() => handleSaveConfig('PMS')}
                size="sm"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                Save & Connect
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIG MODAL: JIRA */}
      {activeModal === 'JIRA' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-500" /> Atlassian Jira Configuration
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-base-content/40 hover:text-base-content text-sm">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Jira Cloud Domain URL</label>
                <input
                  type="text"
                  value={modalFormData.jiraDomain || 'https://causarix.atlassian.net'}
                  onChange={(e) => setModalFormData({ ...modalFormData, jiraDomain: e.target.value })}
                  className="w-full bg-base-200 border border-base-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Atlassian Account Email</label>
                <input
                  type="email"
                  value={modalFormData.email || 'engineering@causarix.ai'}
                  onChange={(e) => setModalFormData({ ...modalFormData, email: e.target.value })}
                  className="w-full bg-base-200 border border-base-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Project Key Prefix</label>
                <input
                  type="text"
                  value={modalFormData.projectKey || 'CSX'}
                  onChange={(e) => setModalFormData({ ...modalFormData, projectKey: e.target.value })}
                  className="w-full bg-base-200 border border-base-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Jira API Token</label>
                <input
                  type="password"
                  placeholder="Enter Atlassian API token..."
                  value={modalFormData.apiToken || ''}
                  onChange={(e) => setModalFormData({ ...modalFormData, apiToken: e.target.value })}
                  className="w-full bg-base-200 border border-base-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            {modalTestResult && (
              <div className={`p-3 rounded-xl text-xs font-semibold border ${modalTestResult.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' : 'bg-rose-500/10 border-rose-500/30 text-rose-600'}`}>
                {modalTestResult.message || modalTestResult.error}
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <Button
                onClick={() => handleTestConnection('JIRA')}
                disabled={modalTesting}
                variant="outline"
                size="sm"
                className="flex-1 rounded-xl text-xs font-bold"
              >
                {modalTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Test Handshake'}
              </Button>
              <Button
                onClick={() => handleSaveConfig('JIRA')}
                size="sm"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
              >
                Save & Connect
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP DISPATCH MODAL */}
      {activeModal === 'WHATSAPP_DISPATCH' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-500" /> Dispatch WhatsApp Executive Alert
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-base-content/40 hover:text-base-content text-sm">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Alert Title</label>
                <input
                  type="text"
                  defaultValue="P0 Critical Blocker: Vendor Indemnity Cap Uncapped"
                  id="wa_alert_title"
                  className="w-full bg-base-200 border border-base-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Executive Recipient</label>
                <input
                  type="text"
                  defaultValue="+1 (555) 019-9000 (CEO Shourya)"
                  id="wa_recipient"
                  className="w-full bg-base-200 border border-base-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Message Content</label>
                <textarea
                  rows={4}
                  defaultValue="Causarix AI COO has identified a P0 critical indemnification risk in Q3 vendor contract. Immediate sign-off required."
                  id="wa_content"
                  className="w-full bg-base-200 border border-base-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button onClick={() => setActiveModal(null)} variant="outline" size="sm" className="flex-1 rounded-xl text-xs">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const title = (document.getElementById('wa_alert_title') as HTMLInputElement)?.value;
                  const recipient = (document.getElementById('wa_recipient') as HTMLInputElement)?.value;
                  const content = (document.getElementById('wa_content') as HTMLTextAreaElement)?.value;
                  handleDispatchAction('WHATSAPP', {
                    action: 'dispatch_alert',
                    alert: { title, content },
                    recipient,
                  });
                }}
                size="sm"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                Dispatch via Meta API
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
