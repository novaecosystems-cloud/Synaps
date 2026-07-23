'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Building2, Plus, Search, ShieldCheck, Check, X, UserPlus, 
  Users, Crown, ShieldAlert, Sparkles, Clock, LogOut, ChevronRight, 
  Copy, CheckCircle2, UserCheck, UserX, AlertCircle, RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Member {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  role: 'OWNER' | 'LEADER' | 'ADMIN' | 'MANAGER' | 'MEMBER' | 'GUEST';
  createdAt: string;
}

interface JoinRequestItem {
  id: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
  };
  createdAt: string;
}

interface OrgData {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  slug: string;
  inviteCode: string;
  isVerified: boolean;
  ownerId: string | null;
  members: Member[];
  pendingJoinRequests: JoinRequestItem[];
}

interface SearchOrgItem {
  id: string;
  name: string;
  description: string;
  logoUrl: string | null;
  slug: string;
  isVerified: boolean;
  memberCount: number;
}

export default function OrganizationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'INFO' | 'CREATE' | 'SEARCH' | 'REQUESTS' | 'MEMBERS'>('INFO');
  const [loading, setLoading] = useState(false);
  const [orgData, setOrgData] = useState<OrgData | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const { toast } = useToast();

  // Create Form State
  const [createName, setCreateName] = useState('');
  const [createDesc, setCreateDesc] = useState('');
  const [createLogo, setCreateLogo] = useState('');
  const [creating, setCreating] = useState(false);

  // Instant Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchOrgItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [joiningOrgId, setJoiningOrgId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const fetchOrgDetails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/organizations');
      const data = await res.json();
      if (data.success) {
        setOrgData(data.organization);
        setCurrentUser(data.currentUser);
      }
    } catch (err) {
      console.error('Fetch organization error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchOrgDetails();
    }
  }, [isOpen, fetchOrgDetails]);

  // Instant Debounced Search (YouTube-style matching as user types)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const handler = setTimeout(async () => {
      try {
        const res = await fetch(`/api/organizations/search?q=${encodeURIComponent(searchQuery.trim())}`);
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.organizations);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) return;
    setCreating(true);

    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: createName,
          description: createDesc,
          logoUrl: createLogo
        })
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Organization Created! 🎉', description: `${data.organization.name} is now active.` });
        setCreateName('');
        setCreateDesc('');
        setCreateLogo('');
        setActiveTab('INFO');
        fetchOrgDetails();
        window.location.reload();
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const handleRequestJoin = async (orgId: string, orgName: string) => {
    setJoiningOrgId(orgId);
    try {
      const res = await fetch('/api/organizations/join-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: orgId })
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Join Request Submitted! 📩', description: data.message });
      } else {
        toast({ title: 'Notice', description: data.error, variant: 'default' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setJoiningOrgId(null);
    }
  };

  const handleRespondRequest = async (requestId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      const res = await fetch('/api/organizations/join-requests/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action })
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: action === 'APPROVE' ? 'Member Approved! ✅' : 'Request Declined', description: data.message });
        fetchOrgDetails();
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleUpdateRole = async (memberId: string, role: string) => {
    try {
      const res = await fetch('/api/organizations/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, role })
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Role Updated 👑', description: data.message });
        fetchOrgDetails();
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleRemoveMember = async (memberId: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from this organization?`)) return;
    try {
      const res = await fetch(`/api/organizations/members?memberId=${memberId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Member Removed', description: data.message });
        fetchOrgDetails();
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const copyInviteCode = () => {
    if (!orgData?.inviteCode) return;
    navigator.clipboard.writeText(orgData.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    toast({ title: 'Copied!', description: 'Invite code copied to clipboard.' });
  };

  if (!isOpen) return null;

  const isLeader = currentUser && ['OWNER', 'LEADER', 'ADMIN'].includes(currentUser.role);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="card w-full max-w-4xl bg-base-100 shadow-2xl border border-base-300 rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-300 bg-base-200/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold shadow-inner border border-primary/20">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
                {orgData?.name || 'Organization Workspace'}
                {orgData?.isVerified && <ShieldCheck className="h-4 w-4 text-primary fill-primary/10" />}
              </h2>
              <p className="text-xs text-base-content/60">Multi-Tenant Isolation & Role Management</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-base-300 bg-base-100 px-6 gap-2 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('INFO')}
            className={cn("py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2", activeTab === 'INFO' ? "border-primary text-primary" : "border-transparent text-base-content/60 hover:text-base-content")}
          >
            <Building2 className="h-4 w-4" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('SEARCH')}
            className={cn("py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2", activeTab === 'SEARCH' ? "border-primary text-primary" : "border-transparent text-base-content/60 hover:text-base-content")}
          >
            <Search className="h-4 w-4" /> Search & Join
          </button>
          <button 
            onClick={() => setActiveTab('CREATE')}
            className={cn("py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2", activeTab === 'CREATE' ? "border-primary text-primary" : "border-transparent text-base-content/60 hover:text-base-content")}
          >
            <Plus className="h-4 w-4" /> Create Org
          </button>
          <button 
            onClick={() => setActiveTab('MEMBERS')}
            className={cn("py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 relative", activeTab === 'MEMBERS' ? "border-primary text-primary" : "border-transparent text-base-content/60 hover:text-base-content")}
          >
            <Users className="h-4 w-4" /> Members ({orgData?.members?.length || 0})
          </button>
          {isLeader && (
            <button 
              onClick={() => setActiveTab('REQUESTS')}
              className={cn("py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 relative", activeTab === 'REQUESTS' ? "border-primary text-primary" : "border-transparent text-base-content/60 hover:text-base-content")}
            >
              <UserPlus className="h-4 w-4" /> Join Requests 
              {orgData?.pendingJoinRequests && orgData.pendingJoinRequests.length > 0 && (
                <span className="badge badge-error badge-xs font-bold text-[10px]">{orgData.pendingJoinRequests.length}</span>
              )}
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="text-xs text-base-content/60 mt-3 font-medium">Syncing organization workspace...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'INFO' && orgData && (
                <div className="space-y-6">
                  <div className="card bg-base-200/50 border border-base-300 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {orgData.logoUrl ? (
                        <img src={orgData.logoUrl} alt={orgData.name} className="h-16 w-16 rounded-2xl object-cover border border-base-300 shadow-md" />
                      ) : (
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-content font-extrabold text-2xl shadow-md">
                          {orgData.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-base-content">{orgData.name}</h3>
                          <span className="badge badge-primary badge-outline text-xs font-semibold">{currentUser?.role || 'MEMBER'}</span>
                        </div>
                        <p className="text-xs text-base-content/60 mt-1">{orgData.description || 'Enterprise Workspace & Knowledge Network'}</p>
                        <p className="text-[11px] text-base-content/40 mt-1 font-mono">ID: {orgData.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <button onClick={copyInviteCode} className="btn btn-outline btn-sm rounded-xl gap-2 w-full md:w-auto">
                        {copiedCode ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                        {copiedCode ? 'Copied' : `Invite Code: ${orgData.inviteCode}`}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="stat bg-base-200/30 rounded-2xl border border-base-300/60 p-4">
                      <div className="stat-title text-xs">Total Members</div>
                      <div className="stat-value text-2xl text-primary">{orgData.members?.length || 0}</div>
                      <div className="stat-desc text-[11px]">Active in workspace</div>
                    </div>

                    <div className="stat bg-base-200/30 rounded-2xl border border-base-300/60 p-4">
                      <div className="stat-title text-xs">Tenant Isolation</div>
                      <div className="stat-value text-2xl text-success flex items-center gap-1">
                        <ShieldCheck className="h-6 w-6" /> 100%
                      </div>
                      <div className="stat-desc text-[11px]">Encrypted & RLS Enforced</div>
                    </div>

                    <div className="stat bg-base-200/30 rounded-2xl border border-base-300/60 p-4">
                      <div className="stat-title text-xs">Pending Requests</div>
                      <div className="stat-value text-2xl text-warning">{orgData.pendingJoinRequests?.length || 0}</div>
                      <div className="stat-desc text-[11px]">Awaiting approval</div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: INSTANT YOUTUBE-STYLE SEARCH */}
              {activeTab === 'SEARCH' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-base-content mb-1">Instant Organization Search</h3>
                    <p className="text-xs text-base-content/60">Type an organization name to match instantly (autocomplete, logo preview, member count).</p>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 h-4 w-4 text-base-content/40" />
                    <input 
                      type="text"
                      placeholder="Type name (e.g. Microsoft, Nova Systems, Microverse)..."
                      className="input input-bordered w-full pl-11 rounded-2xl bg-base-100 focus:input-primary transition-colors text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searching && (
                      <span className="loading loading-spinner loading-xs absolute right-4 top-4 text-primary"></span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {searchResults.map((org) => (
                      <div key={org.id} className="card bg-base-200/40 border border-base-300 p-4 rounded-2xl flex flex-row items-center justify-between hover:bg-base-200 transition-colors">
                        <div className="flex items-center gap-3">
                          {org.logoUrl ? (
                            <img src={org.logoUrl} alt={org.name} className="h-12 w-12 rounded-xl object-cover border border-base-300" />
                          ) : (
                            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                              {org.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-sm text-base-content flex items-center gap-1.5">
                              {org.name}
                              {org.isVerified && <ShieldCheck className="h-3.5 w-3.5 text-primary fill-primary/10" />}
                            </h4>
                            <p className="text-xs text-base-content/60">{org.description || 'Enterprise Workspace'}</p>
                            <span className="text-[11px] text-base-content/50 font-medium mt-0.5 inline-block">
                              👥 {org.memberCount} members
                            </span>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleRequestJoin(org.id, org.name)}
                          disabled={joiningOrgId === org.id}
                          className="btn btn-primary btn-sm rounded-xl shadow-md shadow-primary/20"
                        >
                          {joiningOrgId === org.id ? <span className="loading loading-spinner loading-xs"></span> : "Request to Join"}
                        </button>
                      </div>
                    ))}

                    {searchQuery.trim() && !searching && searchResults.length === 0 && (
                      <div className="text-center py-10 text-base-content/50">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-40" />
                        <p className="text-sm font-medium">No organizations found matching &quot;{searchQuery}&quot;</p>
                        <p className="text-xs mt-1">Try creating a new organization below.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: CREATE ORGANIZATION */}
              {activeTab === 'CREATE' && (
                <form onSubmit={handleCreateOrg} className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-base-content mb-1">Create a New Organization</h3>
                    <p className="text-xs text-base-content/60">You will automatically become the Organization Owner, Leader, and Admin.</p>
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium text-xs">Organization Name</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Nova Systems" 
                      className="input input-bordered rounded-xl text-sm"
                      required
                      value={createName}
                      onChange={(e) => setCreateName(e.target.value)}
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium text-xs">Description</span>
                    </label>
                    <textarea 
                      placeholder="Briefly describe your company or department..."
                      className="textarea textarea-bordered rounded-xl text-sm h-20"
                      value={createDesc}
                      onChange={(e) => setCreateDesc(e.target.value)}
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium text-xs">Logo Image URL (Optional)</span>
                    </label>
                    <input 
                      type="url" 
                      placeholder="https://example.com/logo.png" 
                      className="input input-bordered rounded-xl text-sm"
                      value={createLogo}
                      onChange={(e) => setCreateLogo(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-full rounded-xl shadow-lg shadow-primary/20 mt-4" disabled={creating}>
                    {creating ? <span className="loading loading-spinner loading-sm"></span> : "Create Organization Workspace"}
                  </button>
                </form>
              )}

              {/* TAB 4: MEMBER DIRECTORY */}
              {activeTab === 'MEMBERS' && orgData && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-base-content">Organization Members ({orgData.members?.length || 0})</h3>
                    <span className="text-xs text-base-content/60 font-medium">Tenant Isolated</span>
                  </div>

                  <div className="space-y-2">
                    {orgData.members?.map((m) => (
                      <div key={m.id} className="card bg-base-200/40 border border-base-300 p-3.5 rounded-2xl flex flex-row items-center justify-between">
                        <div className="flex items-center gap-3">
                          {m.avatarUrl ? (
                            <img src={m.avatarUrl} alt={m.name || m.email} className="h-10 w-10 rounded-full object-cover border border-base-300" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                              {(m.name || m.email).substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-base-content">{m.name || m.email.split('@')[0]}</span>
                              <span className={cn(
                                "badge badge-xs font-semibold",
                                m.role === 'OWNER' ? "badge-error text-white" :
                                m.role === 'LEADER' ? "badge-warning" :
                                m.role === 'ADMIN' ? "badge-primary" : "badge-ghost"
                              )}>
                                {m.role}
                              </span>
                            </div>
                            <p className="text-xs text-base-content/60">{m.email}</p>
                          </div>
                        </div>

                        {isLeader && m.id !== currentUser?.id && (
                          <div className="flex items-center gap-2">
                            <select 
                              className="select select-bordered select-xs rounded-lg bg-base-100"
                              value={m.role}
                              onChange={(e) => handleUpdateRole(m.id, e.target.value)}
                            >
                              <option value="MEMBER">MEMBER</option>
                              <option value="ADMIN">ADMIN</option>
                              <option value="LEADER">LEADER</option>
                              <option value="MANAGER">MANAGER</option>
                              <option value="GUEST">GUEST</option>
                              <option value="OWNER">TRANSFER OWNER</option>
                            </select>

                            <button 
                              onClick={() => handleRemoveMember(m.id, m.name || m.email)}
                              className="btn btn-ghost btn-xs text-error hover:bg-error/10 rounded-lg"
                              title="Remove Member"
                            >
                              <UserX className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: JOIN REQUESTS (Leader Dashboard) */}
              {activeTab === 'REQUESTS' && isLeader && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-base-content">Pending Join Requests</h3>
                    <span className="badge badge-warning text-xs font-bold">{orgData?.pendingJoinRequests?.length || 0} Pending</span>
                  </div>

                  {orgData?.pendingJoinRequests && orgData.pendingJoinRequests.length > 0 ? (
                    <div className="space-y-3">
                      {orgData.pendingJoinRequests.map((reqItem) => (
                        <div key={reqItem.id} className="card bg-base-200/50 border border-base-300 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {reqItem.user.avatarUrl ? (
                              <img src={reqItem.user.avatarUrl} alt={reqItem.user.name || reqItem.user.email} className="h-10 w-10 rounded-full object-cover" />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-warning/20 text-warning flex items-center justify-center font-bold text-sm">
                                {(reqItem.user.name || reqItem.user.email).substring(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-sm text-base-content">{reqItem.user.name || 'Anonymous User'}</p>
                              <p className="text-xs text-base-content/60">{reqItem.user.email}</p>
                              <span className="text-[10px] text-base-content/40 mt-0.5 block">Requested: {new Date(reqItem.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <button 
                              onClick={() => handleRespondRequest(reqItem.id, 'APPROVE')}
                              className="btn btn-success btn-sm rounded-xl text-white gap-1.5 shadow-md shadow-success/20"
                            >
                              <UserCheck className="h-4 w-4" /> Approve
                            </button>
                            <button 
                              onClick={() => handleRespondRequest(reqItem.id, 'REJECT')}
                              className="btn btn-outline btn-error btn-sm rounded-xl gap-1.5"
                            >
                              <UserX className="h-4 w-4" /> Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-base-content/50">
                      <UserCheck className="h-8 w-8 mx-auto mb-2 opacity-40 text-success" />
                      <p className="text-sm font-medium">No pending join requests.</p>
                      <p className="text-xs mt-1">When users search and request to join {orgData?.name}, they will appear here.</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
