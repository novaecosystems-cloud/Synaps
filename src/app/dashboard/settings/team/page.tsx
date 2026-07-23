import { getOrganizationMembers } from '@/app/actions/organization';
import TeamClient from './client';
import { redirect } from 'next/navigation';

export default async function TeamSettingsPage() {
  let result: any = null;
  try {
    result = await getOrganizationMembers();
  } catch (e: any) {
    result = { success: false, error: e?.message || 'Database error' };
  }
  
  if (!result || !result.success) {
    if (result?.error === 'Unauthorized') redirect('/login');
    return (
      <TeamClient 
        initialMembers={[]} 
        initialInvitations={[]} 
        currentUserRole="MEMBER" 
        currentUserId="" 
      />
    );
  }
  
  return (
    <TeamClient 
      initialMembers={result.members || []} 
      initialInvitations={result.invitations || []} 
      currentUserRole={result.currentUserRole || 'MEMBER'} 
      currentUserId={result.currentUserId || ''} 
    />
  );
}
