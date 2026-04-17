import { getPendingEvents, getAvailableMembers, getEventWithWorkers } from '@/app/actions/controller';
import { getSession } from '@/lib/auth';
import { PendingClient } from './PendingClient';

export default async function PendingPage() {
  const session = await getSession();
  
  let events: any[] = [];
  let availableMembers: any[] = [];
  let loadError: string | null = null;
  
  try {
    const [eventsResult, membersResult] = await Promise.all([
      getPendingEvents(),
      getAvailableMembers(),
    ]);
    
    events = eventsResult.data || [];
    availableMembers = membersResult.data || [];
    
    if (eventsResult.error) {
      loadError = eventsResult.error;
    }
  } catch (e) {
    console.error('Error loading pending events:', e);
    loadError = e instanceof Error ? e.message : 'Failed to load events';
  }

  return (
    <PendingClient
      session={session}
      initialEvents={events}
      availableMembers={availableMembers}
      loadError={loadError}
    />
  );
}
