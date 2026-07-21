import { getOrganizationMembers } from '@/app/actions/organization';
import TeamClient from './client';
import { redirect } from 'next/navigation';

export default async function TeamSettingsPage() {
  const result = await getOrganizationMembers();
  
  if (!result.success) {
    if (result.error === 'Unauthorized') redirect('/login');
    return <div className="p-8 text-red-500">Failed to load team members: {result.error}</div>;
  }
  
  return (
    <TeamClient 
      initialMembers={result.members || []} 
      initialInvitations={result.invitations || []} 
      currentUserRole={result.currentUserRole || ''} 
      currentUserId={result.currentUserId || ''} 
    />
  );
}
