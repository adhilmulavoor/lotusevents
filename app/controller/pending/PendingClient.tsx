'use client';

import { useState, useTransition, useEffect } from 'react';
import { 
  Clock, Plus, X, Banknote, Car, 
  CheckCircle, AlertCircle, Loader2, User,
  IndianRupee, Trash2, CheckCircle2, Search
} from 'lucide-react';
import { 
  addMemberToEvent, 
  removeMemberFromEvent, 
  updateMemberPayment, 
  markEventCompleted,
  markEventPending,
  getEventWithWorkers
} from '@/app/actions/controller';

interface Event {
  id: string;
  event_name: string;
  date: string;
  location: string | null;
  status: string;
  controller_id: string | null;
}

interface Member {
  id: string;
  daily_rate: number;
  role_type: string;
  users?: { id: string; name: string; phone: string };
}

interface EventWorker {
  id: string;
  member_id: string;
  wage_amount: number;
  ta_amount: number;
  paid_amount: number;
  pending_amount: number;
  has_ta?: boolean;
  attendance: string;
  members?: any;
}

interface Props {
  session: any;
  initialEvents: Event[];
  availableMembers: Member[];
  loadError?: string | null;
}

// ─── ADD MEMBER MODAL ───────────────────────────────────────────────────────
function AddMemberModal({ 
  event, 
  availableMembers, 
  existingWorkerIds,
  onClose, 
  onSuccess 
}: { 
  event: Event; 
  availableMembers: Member[]; 
  existingWorkerIds: string[];
  onClose: () => void; 
  onSuccess: () => void;
}) {
  const [addingId, setAddingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [wageInput, setWageInput] = useState<string>('');
  const [taInput, setTaInput] = useState<string>('0');

  const filteredMembers = availableMembers
    .filter(m => !existingWorkerIds.includes(m.id))
    .filter(m => {
      const searchLower = search.toLowerCase();
      const name = m.users?.name?.toLowerCase() || '';
      const phone = m.users?.phone || '';
      const role = m.role_type?.toLowerCase() || '';
      return name.includes(searchLower) || phone.includes(searchLower) || role.includes(searchLower);
    });

  const handleSelectMember = (member: Member) => {
    setSelectedMember(member);
    setWageInput(member.daily_rate?.toString() || '0');
    setTaInput('0');
    setError(null);
  };

  const handleCancelSelection = () => {
    setSelectedMember(null);
    setWageInput('');
    setTaInput('0');
    setError(null);
  };

  const handleAddMember = async () => {
    if (!selectedMember) return;
    
    const wageAmount = parseFloat(wageInput) || 0;
    if (wageAmount <= 0) {
      setError('Please enter a valid wage amount');
      return;
    }

    const taAmount = parseFloat(taInput) || 0;

    console.log('[HANDLE_ADD] Adding member:', selectedMember.users?.name, 'wage:', wageAmount, 'ta:', taAmount);

    setAddingId(selectedMember.id);
    setError(null);
    const formData = new FormData();
    formData.append('event_id', event.id);
    formData.append('member_id', selectedMember.id);
    formData.append('wage_amount', wageAmount.toString());
    formData.append('ta_amount', taAmount.toString());
    formData.append('has_ta', taAmount > 0 ? 'true' : 'false');
    
    try {
      const result = await addMemberToEvent(null, formData);
      console.log('[HANDLE_ADD] Server result:', result);
      if (result?.error) {
        setError(result.error);
      } else {
        console.log('[HANDLE_ADD] Calling onSuccess');
        onSuccess();
      }
    } catch (e) {
      console.error('[HANDLE_ADD] Error:', e);
      setError('Failed to add member');
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-white">Add Member</h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[220px]">{event.event_name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={16} />{error}
          </div>
        )}

        {selectedMember ? (
          <div className="space-y-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-900 to-blue-500/20 border border-blue-500/30 flex items-center justify-center text-lg font-bold text-blue-300">
                  {(selectedMember.users?.name || 'M').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-white">{selectedMember.users?.name || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">{selectedMember.role_type} · {selectedMember.users?.phone}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                    Wage Amount
                  </label>
                  <div className="relative">
                    <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="number"
                      value={wageInput}
                      onChange={(e) => setWageInput(e.target.value)}
                      className="w-full bg-black/60 border border-emerald-500/20 rounded-xl pl-8 pr-4 py-3 text-white text-lg font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      placeholder="Enter wage"
                      min="0"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Daily rate: ₹{selectedMember.daily_rate}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancelSelection}
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={addingId !== null}
                onClick={handleAddMember}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {addingId === selectedMember.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCircle size={16} />
                )}
                Add Member
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search by name, phone, or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Select Member ({filteredMembers.length} available)
              </label>
              {filteredMembers.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  {search ? 'No members found matching your search.' : 'All available members have been added.'}
                </p>
              ) : (
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {filteredMembers.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelectMember(m)}
                      className="w-full text-left px-4 py-3 rounded-xl border transition-all bg-white/5 border-white/10 text-white hover:bg-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{m.users?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{m.role_type} · {m.users?.phone}</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-400">₹{m.daily_rate}/day</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MEMBER PAYMENT CARD ────────────────────────────────────────────────────
function MemberPaymentCard({ 
  worker, 
  onUpdate, 
  onRemove 
}: { 
  worker: EventWorker; 
  onUpdate: (paid: number, pending: number, ta: number) => void;
  onRemove: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [paid, setPaid] = useState<number | ''>(worker.paid_amount || '');
  const [ta, setTa] = useState<number | ''>(worker.ta_amount || '');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!isEditing) {
      setPaid(worker.paid_amount || 0);
      setTa(worker.ta_amount || 0);
    }
  }, [worker, isEditing]);

  const member = worker.members;
  const user = member?.users;
  const wageAmount = Number(worker.wage_amount) || 0;
  const taAmount = ta === '' ? 0 : Number(ta);
  const totalAmount = wageAmount + taAmount;
  const paidNum = paid === '' ? 0 : Number(paid);
  const calculatedPending = Math.max(0, totalAmount - paidNum);

  const handleSave = () => {
    startTransition(async () => {
      await onUpdate(paidNum, calculatedPending, taAmount);
      setIsEditing(false);
    });
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
          <button
            onClick={onRemove}
            className="text-red-400 hover:text-red-300 p-1"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3 pt-2 border-t border-white/5">
          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1 block">Total</label>
              <div className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-1.5 text-white text-sm font-bold">
                ₹{wageAmount + taAmount}
              </div>
            </div>
            <div>
              <label className="text-[10px] text-emerald-400 uppercase mb-1 block">Paid</label>
              <input
                type="number"
                value={paid}
                onChange={e => setPaid(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-black/60 border border-emerald-500/20 rounded-lg px-2 py-1.5 text-white text-sm"
                min="0"
                max={wageAmount + taAmount}
              />
            </div>
            <div>
              <label className="text-[10px] text-red-400 uppercase mb-1 block">Pending</label>
              <div className="w-full bg-black/30 border border-red-500/10 rounded-lg px-2 py-1.5 text-red-400 text-sm font-bold">
                ₹{calculatedPending}
              </div>
            </div>
            <div>
              <label className="text-[10px] text-amber-400 uppercase mb-1 block">TA</label>
              <input
                type="number"
                value={ta}
                onChange={e => setTa(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-black/60 border border-amber-500/20 rounded-lg px-2 py-1.5 text-white text-sm"
                min="0"
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-1"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
            Done
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/5">
          <div className="text-center">
            <p className="text-[10px] text-gray-500 uppercase">Total</p>
            <p className="font-bold text-white">₹{wageAmount + taAmount}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-emerald-400 uppercase">Paid</p>
            <p className="font-bold text-emerald-400">₹{worker.paid_amount || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-red-400 uppercase">Pending</p>
            <p className="font-bold text-red-400">₹{calculatedPending}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-amber-400 uppercase">TA</p>
            <p className="font-bold text-amber-400">₹{taAmount}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EVENT CARD ─────────────────────────────────────────────────────────────
function EventCard({ 
  event, 
  availableMembers, 
  session 
}: { 
  event: Event; 
  availableMembers: Member[];
  session: any;
}) {
  const [isPending, startTransition] = useTransition();
  const [showAddModal, setShowAddModal] = useState(false);
  const [workers, setWorkers] = useState<EventWorker[]>([]);
  const [loadingWorkers, setLoadingWorkers] = useState(true);
  const [expanded, setExpanded] = useState(false);

  // Load workers when expanded
  const loadWorkers = async () => {
    setLoadingWorkers(true);
    try {
      const result = await getEventWithWorkers(event.id);
      console.log('[LOAD_WORKERS] Result:', JSON.stringify(result, null, 2));
      if (result.data) {
        console.log('[LOAD_WORKERS] Workers:', result.data.workers);
        setWorkers(result.data.workers as any);
      } else if (result.error) {
        console.error('[LOAD_WORKERS] Error:', result.error);
      }
    } finally {
      setLoadingWorkers(false);
    }
  };

  // Load workers when expanded
  useEffect(() => {
    if (expanded && loadingWorkers && workers.length === 0) {
      loadWorkers();
    }
  }, [expanded]);

  const existingWorkerIds = workers.map(w => w.member_id);

  const totalWage = workers.reduce((sum, w) => sum + (w.wage_amount || 0), 0);
  const totalTa = workers.reduce((sum, w) => sum + (w.ta_amount || 0), 0);
  const totalPaid = workers.reduce((sum, w) => sum + (w.paid_amount || 0), 0);
  const totalPending = Math.max(0, totalWage + totalTa - totalPaid);

  const handleUpdatePayment = async (workerId: string, paid: number, pending: number, ta: number) => {
    await updateMemberPayment(workerId, paid, pending, ta);
    await loadWorkers();
  };

  const handleRemoveMember = async (workerId: string) => {
    if (!confirm('Remove this member from the event?')) return;
    await removeMemberFromEvent(workerId);
    await loadWorkers();
  };

  const handleMarkCompleted = () => {
    if (!confirm('Mark this event as completed?')) return;
    startTransition(async () => {
      await markEventCompleted(event.id);
      window.location.reload();
    });
  };

  const statusColors: Record<string, string> = {
    planned: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    ongoing: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <>
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${statusColors[event.status] || statusColors.planned}`}>
                  {event.status}
                </span>
              </div>
              <h3 className="font-bold text-white text-lg leading-tight truncate">{event.event_name}</h3>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                {event.location && ` · ${event.location}`}
              </p>
            </div>
            <button
              onClick={() => { setExpanded(!expanded); }}
              className="shrink-0 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-400"
            >
              {expanded ? 'Hide' : 'View'}
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="border-t border-white/5">
            {/* Action Buttons */}
            <div className="p-4 flex gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 font-bold py-2.5 rounded-xl transition-colors"
              >
                <Plus size={16} />Add Member
              </button>
              <button
                onClick={handleMarkCompleted}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-bold py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {isPending ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                Completed
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
                <p className="text-sm">No members added yet</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                <p className="text-xs text-gray-500 font-medium uppercase">Members ({workers.length})</p>
                {workers.map((worker) => (
                  <MemberPaymentCard
                    key={worker.id}
                    worker={worker}
                    onUpdate={(paid: number, pending: number, ta: number) => { handleUpdatePayment(worker.id, paid, pending, ta); }}
                    onRemove={() => handleRemoveMember(worker.id)}
                  />
                ))}
              </div>
            )}

            {/* Summary */}
            {workers.length > 0 && (
              <div className="p-4 border-t border-white/5 bg-black/20">
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Total Amount</p>
                    <p className="font-bold text-white">₹{totalWage + totalTa}</p>
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
                    <p className="text-[10px] text-amber-400 uppercase">Total TA</p>
                    <p className="font-bold text-amber-400">₹{totalTa}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <AddMemberModal
          event={event}
          availableMembers={availableMembers}
          existingWorkerIds={existingWorkerIds}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            loadWorkers();
            setShowAddModal(false);
          }}
        />
      )}
    </>
  );
}

// ─── MAIN PENDING CLIENT ────────────────────────────────────────────────────
export function PendingClient({ session, initialEvents, availableMembers, loadError }: Props) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
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
              <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider rounded-md">
                Pending
              </span>
            </div>
            <h1 className="text-xl font-black text-white tracking-tight mt-1">
              {session?.name || 'Controller'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">{today}</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-900 to-orange-900 border border-amber-500/30 flex items-center justify-center text-sm font-bold text-amber-400">
            {(session?.name as string || 'C').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Pending Events</p>
            <p className="text-3xl font-black text-white">{events.length}</p>
          </div>
        </div>

        {/* Events List */}
        {events.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Clock size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No pending events</p>
            <p className="text-sm mt-1 text-gray-600">All caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                availableMembers={availableMembers}
                session={session}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
