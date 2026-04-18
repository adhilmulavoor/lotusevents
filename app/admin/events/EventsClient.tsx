'use client';

import { useActionState, useEffect, useState } from 'react';
import { Plus, Search, CalendarDays, X, Loader2, Trash2, MapPin, Clock, User } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { createEvent, deleteEvent } from '@/app/actions/admin';

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60">
      {pending ? <><Loader2 size={16} className="animate-spin" />Creating...</> : 'Create Event'}
    </button>
  );
}

type Event = { 
  id: string; 
  event_name: string; 
  date: string; 
  location: string | null; 
  status: string; 
  event_controllers?: { controllers?: { users?: { name: string } } }[] 
};
type Controller = { id: string; name: string; controllers: { id: string }[] | null };

export default function EventsClient({ initialEvents, controllers }: { initialEvents: Event[]; controllers: Controller[] }) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedControllers, setSelectedControllers] = useState<string[]>([]);
  const [state, formAction] = useActionState(createEvent, null);

  useEffect(() => {
    if (state?.success) { setShowModal(false); window.location.reload(); }
  }, [state?.success]);

  const filtered = events.filter(e =>
    e.event_name.toLowerCase().includes(search.toLowerCase()) ||
    (e.location ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const toggleController = (id: string) => {
    setSelectedControllers(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  async function handleDelete(id: string) {
    if (!confirm('Delete this event and all associated data?')) return;
    const res = await deleteEvent(id);
    if (!res?.error) setEvents(prev => prev.filter(e => e.id !== id));
    else alert(res.error);
  }

  const statusStyle: Record<string, string> = {
    planned: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    ongoing: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    completed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  return (
    <div className="p-6 md:p-12 text-white font-sans max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <CalendarDays className="text-emerald-400" />Event Management
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Create events, assign controllers, and track progress.</p>
        </div>
        <button onClick={() => { setSelectedControllers([]); setShowModal(true); }}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-2.5 px-5 rounded-xl hover:opacity-90 transition-opacity">
          <Plus size={18} /><span>New Event</span>
        </button>
      </header>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="relative w-full md:w-96 mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input type="text" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-light" />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <CalendarDays size={40} className="text-gray-700" />
            <p className="text-gray-500 text-sm">{search ? 'No matching events.' : 'No events yet. Create your first!'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                  <th className="p-4 font-medium">Event Name</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Location</th>
                  <th className="p-4 font-medium">Controllers</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filtered.map((ev) => {
                  const ctrlNames = ev.event_controllers
                    ?.map(ec => ec.controllers?.users?.name)
                    .filter(Boolean) || [];

                  return (
                    <tr key={ev.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-medium">{ev.event_name}</td>
                      <td className="p-4 text-gray-400">{new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="p-4 text-gray-400">{ev.location ?? '—'}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {ctrlNames.length > 0 ? (
                            ctrlNames.map((name, i) => (
                              <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 text-[10px] rounded text-gray-300">
                                {name}
                              </span>
                            ))
                          ) : (
                            <span className="bg-red-500/10 text-red-400 border-red-500/20 px-2 py-0.5 rounded text-[10px] border">Unassigned</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-bold px-3 py-1 rounded-lg border capitalize ${statusStyle[ev.status] ?? 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                          {ev.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDelete(ev.id)} className="text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-5 right-5 text-gray-400 hover:text-white"><X size={20} /></button>
            <h2 className="text-2xl font-black mb-1">Create Event</h2>
            <p className="text-gray-500 text-sm mb-7">Add a new event with multiple controllers.</p>
            {state?.error && <div className="mb-5 p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-sm">{state.error}</div>}
            <form action={formAction} className="space-y-4">
              <input type="hidden" name="controller_ids" value={JSON.stringify(selectedControllers)} />
              
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input type="text" name="event_name" required placeholder="Event name *"
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
              </div>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input type="datetime-local" name="date" required
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input type="text" name="location" placeholder="Location"
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Assign Controllers</label>
                <div className="max-h-32 overflow-y-auto bg-black/50 border border-white/10 rounded-xl p-2 custom-scrollbar">
                  {controllers.length === 0 ? (
                    <p className="p-2 text-xs text-gray-600">No controllers found.</p>
                  ) : (
                    controllers.map(c => {
                      const cid = c.controllers?.[0]?.id;
                      if (!cid) return null;
                      const isSelected = selectedControllers.includes(cid);
                      return (
                        <div 
                          key={cid} 
                          onClick={() => toggleController(cid)}
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors mb-1 ${isSelected ? 'bg-emerald-500/10' : 'hover:bg-white/5'}`}
                        >
                          <span className={`text-sm ${isSelected ? 'text-emerald-400 font-bold' : 'text-gray-400'}`}>{c.name}</span>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'}`}>
                            {isSelected && <Plus size={10} className="text-white rotate-45" />}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="relative">
                <select name="status" defaultValue="planned"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none cursor-pointer">
                  <option value="planned">Planned</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <SubmitBtn />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
