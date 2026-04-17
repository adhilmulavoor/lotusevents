import { getCompletedEvents } from '@/app/actions/controller';
import { getSession } from '@/lib/auth';
import { CompletedClient } from './CompletedClient';

export default async function CompletedPage() {
  const session = await getSession();
  
  let events: any[] = [];
  let loadError: string | null = null;
  
  try {
    const eventsResult = await getCompletedEvents();
    events = eventsResult.data || [];
    
    if (eventsResult.error) {
      loadError = eventsResult.error;
    }
  } catch (e) {
    console.error('Error loading completed events:', e);
    loadError = e instanceof Error ? e.message : 'Failed to load events';
  }

  return (
    <CompletedClient
      session={session}
      events={events}
      loadError={loadError}
    />
  );
}
