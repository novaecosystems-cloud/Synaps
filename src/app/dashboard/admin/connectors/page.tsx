"use client";

import React, { useState } from "react";
import { Database, Globe, Github, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminConnectorsPage() {
  const [connectors, setConnectors] = useState([
    { id: "1", type: "WEB_SCRAPER", name: "Corporate Website Scraper", status: "ACTIVE", lastSync: "10 mins ago" },
    { id: "2", type: "GITHUB", name: "Backend Repository Docs", status: "PAUSED", lastSync: "2 days ago" }
  ]);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Data Connectors</h1>
          <p className="text-slate-500 mt-1">Manage external data sources for the Synaps Knowledge Base.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add Connector
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {connectors.map(connector => (
          <Card key={connector.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {connector.type === "WEB_SCRAPER" ? <Globe className="w-5 h-5 text-blue-500" /> : <Github className="w-5 h-5 text-slate-700" />}
                  {connector.name}
                </CardTitle>
                <div className={`px-2 py-1 rounded text-xs font-semibold ${connector.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  {connector.status}
                </div>
              </div>
              <CardDescription>{connector.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-slate-500">Last synced: {connector.lastSync}</span>
                <Button variant="outline" size="sm" className="h-8">
                  <RefreshCw className="w-3 h-3 mr-2" /> Sync Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Placeholder for new connectors */}
        <Card className="border-dashed border-2 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer flex flex-col items-center justify-center p-6 min-h-[160px]">
          <Database className="w-8 h-8 text-slate-400 mb-2" />
          <p className="text-sm font-medium text-slate-600">Configure New Source</p>
        </Card>
      </div>
    </div>
  );
}
