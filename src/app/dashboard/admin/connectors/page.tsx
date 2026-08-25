"use client";

import React, { useState, useEffect } from "react";
import {
  Database,
  Cloud,
  Globe,
  GitBranch,
  Plus,
  RefreshCw,
  ShieldCheck,
  Lock,
  Building,
  MessageSquare,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminConnectorsPage() {
  const [connectors, setConnectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const fetchAdminConnectors = async () => {
    setLoading(true);
    try {
      const [gdrive, pms, wa, jira] = await Promise.all([
        fetch("/api/connectors/google-drive").then((r) => r.json()).catch(() => null),
        fetch("/api/connectors/pms").then((r) => r.json()).catch(() => null),
        fetch("/api/connectors/whatsapp").then((r) => r.json()).catch(() => null),
        fetch("/api/connectors/jira").then((r) => r.json()).catch(() => null),
      ]);

      const list = [
        {
          id: "conn-gdrive",
          type: "GOOGLE_DRIVE",
          name: "Google Workspace & Drive Vault",
          status: gdrive?.connector?.status || "ACTIVE",
          lastSync: gdrive?.connector?.lastSync || "Just now",
          icon: Cloud,
          color: "text-cyan-500",
          stats: `${gdrive?.connector?.totalDocumentsIngested ?? 0} Vaulted Documents`,
          security: "AES-256-GCM + SSRF Guard",
        },
        {
          id: "conn-pms",
          type: "PMS",
          name: "Oracle Opera & Cloudbeds PMS Stream",
          status: pms?.connector?.status || "ACTIVE",
          lastSync: pms?.connector?.lastSync || "Just now",
          icon: Building,
          color: "text-emerald-500",
          stats: `ADR ${pms?.connector?.summary?.averageAdr || "$0.00"} | RevPAR ${pms?.connector?.summary?.averageRevpar || "$0.00"}`,
          security: "Normalized Telemetry Isolation",
        },
        {
          id: "conn-whatsapp",
          type: "WHATSAPP",
          name: "Meta WhatsApp Business Executive Gateway",
          status: wa?.connector?.status || "ACTIVE",
          lastSync: wa?.connector?.lastSync || "Just now",
          icon: MessageSquare,
          color: "text-emerald-500",
          stats: `${wa?.connector?.metrics?.incomingQueriesRouted ?? 0} Queries Routed`,
          security: "Zero-Leak Egress Sanitization",
        },
        {
          id: "conn-jira",
          type: "JIRA",
          name: "Atlassian Jira Cloud Enterprise",
          status: jira?.connector?.status || "ACTIVE",
          lastSync: jira?.connector?.lastSync || "Just now",
          icon: Zap,
          color: "text-indigo-500",
          stats: `${jira?.connector?.summary?.syncedJiraIssues ?? 0} Linked CSX Blockers`,
          security: "Bi-Directional Key Mapping",
        },
      ];

      setConnectors(list);
    } catch (err) {
      console.error("Admin connectors fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminConnectors();
  }, []);

  const triggerSync = async (type: string) => {
    setSyncingId(type);
    let endpoint = "";
    if (type === "GOOGLE_DRIVE") endpoint = "/api/connectors/google-drive";
    else if (type === "PMS") endpoint = "/api/connectors/pms";
    else if (type === "WHATSAPP") endpoint = "/api/connectors/whatsapp";
    else if (type === "JIRA") endpoint = "/api/connectors/jira";

    try {
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync" }),
      });
      await fetchAdminConnectors();
    } catch (e) {
      console.error(e);
    } finally {
      setSyncingId(null);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-primary mb-1">
            <ShieldCheck className="w-4 h-4" /> Enterprise Administration
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Enterprise Connectors & Telemetry Ingestion
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Configure, monitor, and enforce multi-tenant isolation across all external data feeds and executive channels.
          </p>
        </div>

        <Button onClick={fetchAdminConnectors} variant="outline" size="sm" className="rounded-xl gap-2 font-bold text-xs">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Pipeline Health
        </Button>
      </div>

      {/* SECURITY CONTROLS CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200">AES-256-GCM Hardware Encryption</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">All API keys, tokens, and service credentials encrypted at rest.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200">SSRF & Private Subnet Blocking</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Strict egress firewall blocking 127.0.0.1, RFC 1918, and AWS metadata.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200">AI-WAF Zero Secret Redaction</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Outbound token scrubber prevents confidential leakages across WhatsApp & Jira.</p>
          </div>
        </div>
      </div>

      {/* CONNECTORS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {connectors.map((connector) => {
          const Icon = connector.icon || Database;
          return (
            <Card key={connector.id} className="border-slate-200 shadow-sm hover:shadow-md transition-all rounded-3xl overflow-hidden flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center ${connector.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900">{connector.name}</CardTitle>
                      <CardDescription className="text-xs text-slate-500">{connector.type}</CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="w-3 h-3" />
                    {connector.status}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span className="font-semibold">Live Telemetry:</span>
                    <span className="font-bold text-slate-800">{connector.stats}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="font-semibold">Security Guard:</span>
                    <span className="text-emerald-700 font-bold">{connector.security}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Last Synced:</span>
                    <span>{new Date(connector.lastSync).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <Button
                    onClick={() => triggerSync(connector.type)}
                    disabled={syncingId === connector.type}
                    size="sm"
                    variant="outline"
                    className="flex-1 rounded-xl text-xs font-bold gap-2"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingId === connector.type ? "animate-spin" : ""}`} />
                    {syncingId === connector.type ? "Syncing..." : "Sync Pipeline"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
