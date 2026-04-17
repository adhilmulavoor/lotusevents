'use client';

import { useState } from 'react';
import { 
  CheckCircle, Clock, AlertCircle, Loader2, User,
  IndianRupee, Trash2, CheckCircle2, RotateCcw
} from 'lucide-react';
import { 
  getEventWithWorkers,
  updateMemberPayment, 
  removeMemberFromEvent,
  markEventPending
} from '@/app/actions/controller';

interface Event {
  id: string;
  event_name: string;
  date: string;
  location: string | null;
  status: string;
  controller_id: string | null;
}

interface EventWorker {
  id: string;
  member_id: string;
  wage_amount: number;
  ta_amount: number;
  paid_amount: number;
  pending_amount: number;
  has_ta: boolean;
  attendance: string;
  members?: any;
}

interface Props {
  session: any;
  events: Event[];
  loadError?: string | null;
}

// ─── MEMBER PAYMENT CARD ────────────────────────────────────────────────────
function MemberPaymentCard({ worker, onUpdate, onRemove }: { worker: EventWorker; onUpdate: () => void; onRemove: () => void; }) {
  const [isEditing, setIsEditing] = useState(false);
  const [paid, setPaid] = useState(worker.paid_amount || 0);
  const [pending, setPending] = useState(worker.pending_amount || 0);
  const [ta, setTa] = useState(worker.ta_amount || 0);

  const member = worker.members;
  const user = member?.users;
  const totalAmount = (worker.wage_amount || 0) + (worker.ta_amount || 0);

  const handleSave = async () => {
    await updateMemberPayment(worker.id, paid, pending, ta);
    setIsEditing(false);
    onUpdate();
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-900 to-purple-500/20 border border-purple-500/30 flex items-center justify-center text-sm font-bold text-purple-300">
            {(user?.name || 'M').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-white">{user?.name || 'Unknown'}</p>
            <p className="text-xs text-gray-500">{member?.role_type || 'Staff'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-blue-400 hover:text-blue-300 text-xs font-medium"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3 pt-2 border-t border-white/5">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] text-emerald-400 uppercase mb-1 block">Paid</label>
              <input
                type="number"
                value={paid}
                onChange={e => setPaid(Number(e.target.value))}
                className="w-full bg-black/60 border border-emerald-500/20 rounded-lg px-2 py-1.5 text-white text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] text-red-400 uppercase mb-1 block">Pending</label>
              <input
                type="number"
                value={pending}
                onChange={e => setPending(Number(e.target.value))}
                className="w-full bg-black/60 border border-red-500/20 rounded-lg px-2 py-1.5 text-white text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] text-amber-400 uppercase mb-1 block">TA</label>
              <input
                type="number"
                value={ta}
                onChange={e => setTa(Number(e.target.value))}
                className="w-full bg-black/60 border border-amber-500/20 rounded-lg px-2 py-1.5 text-white text-sm"
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-1"
          >
            <CheckCircle size={14} />Done
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/5">
          <div className="text-center">
            <p className="text-[10px] text-gray-500 uppercase">Total</p>
            <p className="font-bold text-white">₹{totalAmount}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-emerald-400 uppercase">Paid</p>
            <p className="font-bold text-emerald-400">₹{worker.paid_amount || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-red-400 uppercase">Pending</p>
            <p className="font-bold text-red-400">₹{worker.pending_amount || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-amber-400 uppercase">TA</p>
            <p className="font-bold text-amber-400">₹{worker.ta_amount || 0}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EVENT CARD ─────────────────────────────────────────────────────────────
function EventCard({ event, session }: { event: Event; session: any }) {
  const [workers, setWorkers] = useState<EventWorker[]>([]);
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const loadWorkers = async () => {
    setLoadingWorkers(true);
    const result = await getEventWithWorkers(event.id);
    if (result.data) {
      setWorkers(result.data.workers as any);
    }
    setLoadingWorkers(false);
  };

  const handleExpand = async () => {
    if (!expanded && workers.length === 0) {
      await loadWorkers();
    }
    setExpanded(!expanded);
  };

  const handleMarkPending = async () => {
    if (!confirm('Move this event back to Pending?')) return;
    await markEventPending(event.id);
    window.location.reload();
  };

  const handleUpdate = async () => {
    await loadWorkers();
  };

  const totalWage = workers.reduce((sum, w) => sum + (w.wage_amount || 0), 0);
  const totalPaid = workers.reduce((sum, w) => sum + (w.paid_amount || 0), 0);
  const totalPending = workers.reduce((sum, w) => sum + (w.pending_amount || 0), 0);
  const totalTa = workers.reduce((sum, w) => sum + (w.ta_amount || 0), 0);

  return (
    <div className="bg-white/5 border border-emerald-500/20 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md">
                completed
              </span>
            </div>
            <h3 className="font-bold text-white text-lg leading-tight truncate">{event.event_name}</h3>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              {event.location && ` · ${event.location}`}
            </p>
          </div>
          <button
            onClick={handleExpand}
            className="shrink-0 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-400"
          >
            {expanded ? 'Hide' : 'View'}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-white/5">
          {/* Action Button */}
          <div className="p-4">
            <button
              onClick={handleMarkPending}
              className="w-full flex items-center justify-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 font-bold py-2.5 rounded-xl transition-colors"
            >
              <RotateCcw size={16} />Move to Pending
            </button>
          </div>

          {/* Members List */}
          {loadingWorkers ? (
            <div className="p-4 text-center text-gray-500">
              <Loader2 size={20} className="animate-spin mx-auto mb-2" />
              Loading members...
            </div>
          ) : workers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <User size={24} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No members</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              <p className="text-xs text-gray-500 font-medium uppercase">Members ({workers.length})</p>
              {workers.map((worker) => (
                <MemberPaymentCard
                  key={worker.id}
                  worker={worker}
                  onUpdate={handleUpdate}
                  onRemove={() => {}}
                />
              ))}
            </div>
          )}

          {/* Summary */}
          {workers.length > 0 && (
            <div className="p-4 border-t border-white/5 bg-black/20">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Total Wage</p>
                  <p className="font-bold text-white">₹{totalWage}</p>
                </div>
                <div>
                  <p className="text-[10px] text-emerald-400 uppercase">Paid</p>
                  <p className="font-bold text-emerald-400">₹{totalPaid}</p>
                </div>
                <div>
                  <p className="text-[10px] text-red-400 uppercase">Pending</p>
                  <p className="font-bold text-red-400">₹{totalPending}</p>
                </div>
                <div>
                  <p className="text-[10px] text-amber-400 uppercase">TA</p>
                  <p className="font-bold text-amber-400">₹{totalTa}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MAIN COMPLETED CLIENT ───────────────────────────────────────────────────
export function CompletedClient({ session, events, loadError }: Props) {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center p-8">
          <AlertCircle size={40} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Events</h2>
          <p className="text-gray-400">{loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white font-sans">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/90 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-md">
                Completed
              </span>
            </div>
            <h1 className="text-xl font-black text-white tracking-tight mt-1">
              {session?.name || 'Controller'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">{today}</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-900 to-cyan-900 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-400">
            {(session?.name as string || 'C').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 border border-emerald-500/20 rounded-2xl p-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Completed Events</p>
            <p className="text-3xl font-black text-emerald-400">{events.length}</p>
          </div>
        </div>

        {/* Events List */}
        {events.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Clock size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No completed events yet</p>
            <p className="text-sm mt-1 text-gray-600">Completed events will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
