"use client";

import React, { useState } from "react";
import { Database, FileText, UploadCloud, Search, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WorkspaceKnowledgePage() {
  const [documents] = useState([
    { id: "doc-1", name: "Corporate_Security_Policy_v3.pdf", size: "2.4 MB", status: "embedded" },
    { id: "doc-2", name: "Q3_Financial_Audit.docx", size: "1.1 MB", status: "embedded" },
    { id: "doc-3", name: "Employee_Handbook_2026.pdf", size: "5.7 MB", status: "processing" },
  ]);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Knowledge Base</h1>
          <p className="text-slate-500 mt-1">Manage the documents securely siloed inside this Workspace's Vector Database.</p>
        </div>
        <Button className="bg-indigo-600">
          <UploadCloud className="w-4 h-4 mr-2" /> Upload Document
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">Total Documents</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">3</div>
        </div>
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Database className="w-4 h-4" />
            <span className="text-sm font-medium">Vector Storage Used</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">12.5 MB</div>
        </div>
      </div>

      {/* Document List */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-slate-50 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Workspace Documents</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name..." 
              className="pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none"
            />
          </div>
        </div>
        
        <div className="divide-y">
          {documents.map((doc) => (
            <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-800">{doc.name}</h4>
                  <p className="text-xs text-slate-500">{doc.size}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {doc.status === "embedded" ? (
                  <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Embedded
                  </span>
                ) : (
                  <span className="flex items-center text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse mr-1.5" /> Processing...
                  </span>
                )}
                
                <button className="text-slate-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
