import { getTeamMembers } from '@/app/actions/controller';
import { getSession } from '@/lib/auth';
import { TeamClient } from './TeamClient';

export default async function TeamPage() {
  const session = await getSession();
  
  let teamMembers: any[] = [];
  let loadError: string | null = null;
  
  try {
    const teamResult = await getTeamMembers();
    teamMembers = teamResult.data || [];
    
    if (teamResult.error) {
      loadError = teamResult.error;
    }
  } catch (e) {
    console.error('Error loading team:', e);
    loadError = e instanceof Error ? e.message : 'Failed to load team';
  }

  return (
    <TeamClient
      session={session}
      teamMembers={teamMembers}
      loadError={loadError}
    />
  );
}
