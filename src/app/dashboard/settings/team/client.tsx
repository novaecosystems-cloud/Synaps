'use client';

import React, { useState } from 'react';
import { Role } from '@prisma/client';
import { auth } from '@/lib/firebase';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { updateMemberRole, removeMember, inviteMember, removeInvitation } from '@/app/actions/organization';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link2, Copy, MoreHorizontal, Check, Loader2, X, Plus, Crown, ChevronDown, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface TeamClientProps {
  initialMembers: any[];
  initialInvitations: any[];
  currentUserRole: string;
  currentUserId: string;
}

export default function TeamClient({ initialMembers, initialInvitations, currentUserRole, currentUserId }: TeamClientProps) {
  const [members, setMembers] = useState(initialMembers);
  const [invitations, setInvitations] = useState(initialInvitations);
  const [copied, setCopied] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('MEMBER');
  const [isInviting, setIsInviting] = useState(false);
  
  const totalCount = members.length + invitations.length;
  const canManageRoles = currentUserRole === 'OWNER';
  const canInvite = currentUserRole === 'OWNER' || currentUserRole === 'ADMIN';

  // For testing, we just generate a random link to show the UI
  const mockLink = 'synaps.app/team/invite/SisyphusVentures-x8F2k';

  const copyLink = () => {
    navigator.clipboard.writeText(mockLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setIsInviting(true);
    const result = await inviteMember(inviteEmail, inviteRole);
    
    if (result.success) {
      const actionCodeSettings = {
        url: window.location.origin + '/login',
        handleCodeInApp: true,
      };
      
      try {
        await sendSignInLinkToEmail(auth, inviteEmail, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', inviteEmail);
        setIsInviteModalOpen(false);
        setInviteEmail('');
        setInviteRole('MEMBER');
        toast({ title: 'Success', description: 'Invitation email sent!' });
        window.location.reload();
      } catch (error: any) {
        toast({ title: 'Error', description: error.message || 'Failed to send email link', variant: 'destructive' });
      }
    } else {
      toast({ title: 'Error', description: result.error, variant: 'destructive' });
    }
    setIsInviting(false);
  };

  const handleChangeRole = async (userId: string, newRole: Role) => {
    if (!canManageRoles) return;
    setMembers(members.map(m => m.id === userId ? { ...m, role: newRole } : m));
    const result = await updateMemberRole(userId, newRole);
    if (!result.success) {
      alert(result.error);
      window.location.reload();
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    setMembers(members.filter(m => m.id !== userId));
    const result = await removeMember(userId);
    if (!result.success) {
      alert(result.error);
      window.location.reload();
    }
  };

  const handleRevokeInvite = async (invitationId: string) => {
    setInvitations(invitations.filter(i => i.id !== invitationId));
    const result = await removeInvitation(invitationId);
    if (!result.success) {
      alert(result.error);
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col h-full bg-base-100 rounded-xl text-base-content">
      <div className="p-6 md:p-8 border-b border-base-300 flex justify-between items-start">
        <div>
          <h1 className="text-xl font-semibold">Team members</h1>
          <p className="text-sm text-base-content/60 mt-1">Manage team members and access to this team.</p>
        </div>
        {canInvite && (
          <button onClick={() => setIsInviteModalOpen(true)} className="btn btn-primary gap-2">
            <Plus className="h-4 w-4" />
            Invite Member
          </button>
        )}
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* Invite via link block */}
        {canInvite && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold">Invite via link</h2>
            <p className="text-xs text-base-content/60">Share this link to invite people to this space.</p>
            <div className="relative rounded-xl border border-primary/20 bg-primary/5 p-6 overflow-hidden">
              <div className="relative z-10 max-w-lg space-y-4">
                <div className="flex items-center gap-3 p-1.5 rounded-lg border border-primary/30 bg-base-100/50 backdrop-blur-md">
                  <div className="flex-1 flex items-center gap-3 px-3">
                    <Link2 className="h-4 w-4 text-primary" />
                    <div className="flex flex-col justify-center py-2">
                      <span className="text-sm font-medium text-primary leading-none mb-1">{mockLink}</span>
                    </div>
                  </div>
                  <button onClick={copyLink} className="btn btn-sm btn-ghost h-9 gap-2 mr-1">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied' : 'Copy Link'}
                  </button>
                </div>
              </div>
              {/* Decorative Illustration Element */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none hidden md:block">
                <div className="h-32 w-32 rounded-2xl bg-primary/20 rotate-12 flex items-center justify-center border border-primary/50">
                  <div className="h-16 w-16 rounded-full bg-primary/40 border-2 border-primary"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-base-300"></div>

        {/* Team Members List */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold">Team members ({totalCount})</h2>
          
          <div className="flex flex-col space-y-1">
            {/* Active Members */}
            {members.map((member) => {
              const isCurrentUser = member.id === currentUserId;
              
              let badgeClass = 'badge-primary badge-outline';
              if (member.role === 'OWNER') {
                badgeClass = 'badge-success badge-outline';
              } else if (member.role === 'MANAGER') {
                badgeClass = 'badge-info badge-outline';
              }

              return (
                <div key={member.id} className="flex items-center justify-between p-4 rounded-xl bg-base-100 border border-base-300 transition-all group mb-3 hover:border-primary/30">
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-full flex items-center justify-center font-bold uppercase overflow-hidden border border-base-300 bg-base-200">
                      {member.avatarUrl ? (
                        <img src={member.avatarUrl} alt={member.name || 'Avatar'} className="w-full h-full object-cover" />
                      ) : (
                        (member.name?.[0] || member.email[0]).toUpperCase()
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3">
                        <span className="text-base font-bold">
                          {member.name || member.email.split('@')[0]}
                        </span>
                        {isCurrentUser && (
                          <span className="badge badge-primary badge-sm uppercase font-bold">You</span>
                        )}
                      </div>
                      <span className="text-sm text-base-content/60">{member.email}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    {/* Role Display */}
                    <div className="relative flex items-center justify-center min-w-[100px]">
                      {member.role === 'OWNER' ? (
                        <div className="badge badge-success badge-outline px-3 py-3 rounded-lg flex items-center gap-1.5 text-xs font-semibold">
                          Owner <Crown className="h-3.5 w-3.5" />
                        </div>
                      ) : (
                        <div className={cn(
                          "relative rounded-lg border px-3 py-1.5 flex items-center gap-2 text-xs font-semibold transition-colors",
                          member.role === 'MANAGER' ? "border-info text-info" : "border-base-300 text-base-content/70",
                          canManageRoles && !isCurrentUser ? "hover:border-base-content/30 cursor-pointer" : ""
                        )}>
                          <select 
                            disabled={!canManageRoles || isCurrentUser}
                            value={member.role}
                            onChange={(e) => handleChangeRole(member.id, e.target.value as Role)}
                            className="appearance-none bg-transparent outline-none cursor-pointer disabled:cursor-default w-full h-full absolute inset-0 opacity-0"
                          >
                            <option value="ADMIN">Admin</option>
                            <option value="MANAGER">Manager</option>
                            <option value="MEMBER">Edit access</option>
                          </select>
                          <span className="capitalize">{member.role.toLowerCase()}</span>
                          {canManageRoles && !isCurrentUser && <ChevronDown className="h-3.5 w-3.5 opacity-70" />}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end min-w-[100px]">
                      <span className="text-[10px] text-base-content/50 uppercase">Joined</span>
                      <span className="text-xs font-medium">12 May 2024</span>
                    </div>
                    
                    <div className="flex items-center justify-center w-8">
                      {canInvite && !isCurrentUser ? (
                        <button onClick={() => handleRemoveMember(member.id)} className="btn btn-sm btn-ghost text-base-content/50 hover:text-error hover:bg-error/10" title="Remove member">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      ) : (
                        <div className="btn btn-sm btn-ghost text-transparent hover:bg-transparent cursor-default"><MoreHorizontal className="h-4 w-4" /></div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pending Invitations */}
            {invitations.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-4 rounded-xl bg-base-100 border border-base-300 border-dashed transition-all group mb-3 opacity-60 hover:opacity-100">
                <div className="flex items-center gap-5">
                  <div className="h-12 w-12 rounded-full border border-dashed border-base-300 flex items-center justify-center text-base-content/60 font-bold uppercase bg-base-200">
                    {inv.email[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold">
                        {inv.email}
                      </span>
                      <span className="badge badge-warning badge-sm badge-outline uppercase font-bold">Pending</span>
                    </div>
                    <span className="text-sm text-base-content/60">Invited to be {inv.role.toLowerCase()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-end min-w-[100px]">
                    <span className="text-[10px] text-base-content/50 uppercase">Status</span>
                    <span className="text-xs font-medium">Invited</span>
                  </div>
                  <div className="flex items-center justify-center w-8">
                    {canInvite && (
                      <button onClick={() => handleRevokeInvite(inv.id)} className="btn btn-sm btn-ghost text-base-content/50 hover:text-error hover:bg-error/10" title="Revoke invite">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Decorative Footer Banner */}
          <div className="mt-8 rounded-xl border border-primary/20 p-8 space-bg relative overflow-hidden flex flex-col justify-center items-center text-center glass-panel">
             <div className="h-12 w-12 rounded-full border border-primary/30 bg-background/50 flex items-center justify-center mb-4 aura-purple z-10">
               <Lock className="h-5 w-5 text-primary" />
             </div>
             <h3 className="text-xl font-bold text-white mb-2 z-10">Secure. Collaborative. Limitless.</h3>
             <p className="text-sm text-muted-foreground z-10">You're building something great with your team.</p>
             
             {/* Decorative lines */}
             <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0,100 Q150,50 300,100 T600,100" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary"/>
                  <circle cx="150" cy="75" r="2" fill="currentColor" className="text-white"/>
                  <circle cx="450" cy="125" r="1.5" fill="currentColor" className="text-white"/>
                </svg>
             </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Invite a new member</h3>
            <p className="py-2 text-sm text-base-content/60">An invitation email will be sent to this address.</p>
            <form onSubmit={handleInvite} className="space-y-4 mt-4">
              <div className="form-control w-full">
                <label className="label"><span className="label-text">Email Address</span></label>
                <input 
                  type="email" 
                  required 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control w-full">
                <label className="label"><span className="label-text">Role</span></label>
                <select 
                  className="select select-bordered w-full"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as Role)}
                >
                  <option value="MEMBER">Member (Edit access)</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="modal-action">
                <button type="button" className="btn" onClick={() => setIsInviteModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isInviting}>
                  {isInviting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Invite
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={() => setIsInviteModalOpen(false)}>
            <button>close</button>
          </div>
        </div>
      )}
    </div>
  );
}
