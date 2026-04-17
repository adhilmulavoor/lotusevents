import { getAllEvents, getControllersForSelect } from '@/app/actions/admin';
import EventsClient from './EventsClient';

export default async function AdminEventsPage() {
  const [events, controllers] = await Promise.all([
    getAllEvents(),
    getControllersForSelect(),
  ]);
  return <EventsClient initialEvents={events as any} controllers={controllers as any} />;
}
