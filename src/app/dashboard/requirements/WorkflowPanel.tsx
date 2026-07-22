"use client";

import React, { useState, useEffect } from 'react';
import { ProposalStatus } from '@prisma/client';

export default function WorkflowPanel({ proposalId, organizationId, userId }: { proposalId: string, organizationId: string, userId: string }) {
  const [status, setStatus] = useState<ProposalStatus>('DRAFT');
  const [requests, setRequests] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'APPROVALS' | 'AUDIT'>('APPROVALS');
  const [newComment, setNewComment] = useState("");
  const [reviewers, setReviewers] = useState<any[]>([]);
  const [selectedReviewer, setSelectedReviewer] = useState("");

  useEffect(() => {
    fetchWorkflowData();
    fetchAuditLogs();
    fetchReviewers();
  }, [proposalId, organizationId]);

  const fetchReviewers = async () => {
    const res = await fetch(`/api/users?organizationId=${organizationId}`);
    if (res.ok) {
      const data = await res.json();
      setReviewers(data);
      if (data.length > 0) setSelectedReviewer(data[0].id);
    }
  };

  const fetchWorkflowData = async () => {
    const res = await fetch(`/api/workflows?proposalId=${proposalId}`);
    if (res.ok) {
      const data = await res.json();
      setStatus(data.status);
      setRequests(data.approvalRequests || []);
    }
  };

  const fetchAuditLogs = async () => {
    const res = await fetch(`/api/audit?entityId=${proposalId}&organizationId=${organizationId}`);
    if (res.ok) {
      const data = await res.json();
      setAuditLogs(data.logs || []);
    }
  };

  const assignReviewer = async () => {
    const res = await fetch('/api/workflows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'ASSIGN_REVIEWER', proposalId, organizationId, userId, reviewerId: selectedReviewer })
    });
    if (res.ok) {
      fetchWorkflowData();
      fetchAuditLogs();
    }
  };

  const changeStatus = async (newStatus: string) => {
    const prevStatus = status;
    setStatus(newStatus as ProposalStatus);
    
    const res = await fetch('/api/workflows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'STATUS_CHANGE', proposalId, organizationId, userId, newStatus })
    });
    if (res.ok) {
      fetchWorkflowData();
      fetchAuditLogs();
    }
  };

  const postComment = async (requestId: string) => {
    if (!newComment.trim()) return;
    const res = await fetch('/api/workflows/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, proposalId, organizationId, userId, content: newComment })
    });
    if (res.ok) {
      setNewComment("");
      fetchWorkflowData();
      fetchAuditLogs();
    }
  };

  const updateApproval = async (requestId: string, approvalStatus: string) => {
    setRequests(reqs => reqs.map(r => r.id === requestId ? { ...r, status: approvalStatus } : r));
    
    const res = await fetch('/api/workflows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'UPDATE_APPROVAL', proposalId, organizationId, userId, requestId, status: approvalStatus })
    });
    if (res.ok) {
      fetchWorkflowData();
      fetchAuditLogs();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800">Workflow & Approvals</h2>
        <div className="mt-4 flex items-center space-x-2 text-sm font-medium">
          <span className={`px-2 py-1 rounded-full border ${status === 'DRAFT' ? 'bg-slate-100 border-slate-300' : 'bg-green-50 border-green-200 text-green-700'}`}>DRAFT</span>
          <span className="text-slate-400">→</span>
          <span className={`px-2 py-1 rounded-full border ${status === 'REVIEW' ? 'bg-blue-50 border-blue-200 text-blue-700' : (status === 'APPROVED' || status === 'PUBLISHED') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>REVIEW</span>
          <span className="text-slate-400">→</span>
          <span className={`px-2 py-1 rounded-full border ${status === 'APPROVED' ? 'bg-blue-50 border-blue-200 text-blue-700' : status === 'PUBLISHED' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>APPROVED</span>
          <span className="text-slate-400">→</span>
          <span className={`px-2 py-1 rounded-full border ${status === 'PUBLISHED' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>PUBLISHED</span>
        </div>
      </div>

      <div className="flex border-b border-slate-200">
        <button onClick={() => setActiveTab('APPROVALS')} className={`flex-1 py-2 text-sm font-medium text-center ${activeTab === 'APPROVALS' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>Approvals</button>
        <button onClick={() => setActiveTab('AUDIT')} className={`flex-1 py-2 text-sm font-medium text-center ${activeTab === 'AUDIT' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>Audit Trail</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'APPROVALS' && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Request Review</h3>
              <div className="flex space-x-2">
                <select className="flex-1 border-slate-300 rounded-md text-sm" value={selectedReviewer} onChange={(e) => setSelectedReviewer(e.target.value)}>
                  {reviewers.map(r => (
                    <option key={r.id} value={r.id}>{r.name || r.email} ({r.role})</option>
                  ))}
                  {reviewers.length === 0 && <option value="" disabled>Loading users...</option>}
                </select>
                <button onClick={assignReviewer} disabled={!selectedReviewer} className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">Assign</button>
              </div>
            </div>

            <div className="space-y-4">
              {requests.map(req => (
                <div key={req.id} className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-50 p-3 flex justify-between items-center border-b border-slate-200">
                    <div>
                      <span className="text-sm font-medium text-slate-800">Reviewer: {req.reviewerId}</span>
                      <div className="text-xs text-slate-500 mt-1">Status: <span className={`font-semibold ${req.status === 'APPROVED' ? 'text-green-600' : req.status === 'REJECTED' ? 'text-red-600' : 'text-amber-600'}`}>{req.status}</span></div>
                    </div>
                    {req.status === 'PENDING' && (
                      <div className="flex space-x-2">
                        <button onClick={() => updateApproval(req.id, 'APPROVED')} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold hover:bg-green-200">Approve</button>
                        <button onClick={() => updateApproval(req.id, 'REJECTED')} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold hover:bg-red-200">Reject</button>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-white">
                    <div className="space-y-3 mb-3">
                      {req.comments?.map((c: any) => (
                        <div key={c.id} className="bg-slate-100 p-2 rounded-md text-sm">
                          <span className="font-semibold text-slate-700">{c.userId}: </span>
                          <span className="text-slate-600">{c.content}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." className="flex-1 text-sm border border-slate-300 rounded px-2 py-1" />
                      <button onClick={() => postComment(req.id)} className="px-3 py-1 bg-slate-800 text-white rounded text-sm hover:bg-slate-700">Post</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Global Actions</h3>
              <div className="flex space-x-2">
                <button onClick={() => changeStatus('APPROVED')} className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700">Mark as Approved</button>
                <button onClick={() => changeStatus('PUBLISHED')} className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">Publish Proposal</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'AUDIT' && (
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {auditLogs.map((log) => (
              <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <svg className="fill-current w-4 h-4" viewBox="0 0 16 16"><path d="M8 0a8 8 0 100 16A8 8 0 008 0zM7 3h2v4H7V3zm1 8a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" /></svg>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-slate-900">{log.action}</div>
                    <time className="text-xs font-medium text-indigo-500">{new Date(log.createdAt).toLocaleTimeString()}</time>
                  </div>
                  <div className="text-sm text-slate-500">
                    User: {log.userId} <br/>
                    {log.before && <span>Before: {JSON.stringify(log.before)}<br/></span>}
                    {log.after && <span>After: {JSON.stringify(log.after)}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
