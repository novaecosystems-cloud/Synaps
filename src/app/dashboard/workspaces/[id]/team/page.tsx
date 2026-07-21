"use client";

import React, { useState } from "react";
import { Users, Shield, Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WorkspaceTeamPage() {
  const [members] = useState([
    { id: "u1", name: "Alice Security", email: "alice@company.com", role: "ADMIN" },
    { id: "u2", name: "Bob Manager", email: "bob@company.com", role: "MANAGER" },
    { id: "u3", name: "Charlie Staff", email: "charlie@company.com", role: "MEMBER" },
  ]);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Workspace Team</h1>
          <p className="text-slate-500 mt-1">Manage who has access to this workspace and its knowledge base.</p>
        </div>
        <Button className="bg-indigo-600">
          <UserPlus className="w-4 h-4 mr-2" /> Invite Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border rounded-xl p-5 shadow-sm col-span-2">
          <div className="flex items-center gap-2 text-indigo-600 mb-3 border-b pb-3">
            <Shield className="w-5 h-5" />
            <span className="font-semibold text-slate-800">Role Permissions (AnythingLLM Pattern)</span>
          </div>
          <ul className="space-y-3 text-sm text-slate-600">
            <li><strong>ADMIN:</strong> Can manage workspace settings, invite users, and delete the workspace.</li>
            <li><strong>MANAGER:</strong> Can upload and remove documents from the Knowledge Base.</li>
            <li><strong>MEMBER (Default):</strong> Can only view documents and chat with the AI in this workspace.</li>
          </ul>
        </div>
        <div className="bg-white border rounded-xl p-5 shadow-sm flex flex-col justify-center items-center text-center">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-2">
            <Users className="w-6 h-6" />
          </div>
          <div className="text-3xl font-bold text-slate-800">3</div>
          <div className="text-sm font-medium text-slate-500">Active Members</div>
        </div>
      </div>

      {/* Team Table */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-slate-50">
          <h3 className="font-semibold text-slate-800">Members</h3>
        </div>
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{member.name}</td>
                <td className="px-6 py-4">{member.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    member.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                    member.role === 'MANAGER' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-indigo-600 hover:underline text-xs font-medium">Edit Role</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
