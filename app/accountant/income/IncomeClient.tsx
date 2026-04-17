'use client';

import { useActionState, useEffect, useState } from 'react';
import { Plus, DollarSign, X, Loader2, Search, Tag, FileText, Sparkles } from 'lucide-react';
import { addIncome } from '@/app/actions/accountant';
import { useFormStatus } from 'react-dom';

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60">
      {pending ? <><Loader2 size={16} className="animate-spin" />Recording...</> : 'Record Income'}
    </button>
  );
}

type Income = { id: string; event_name: string; date: string; total_income: number; location?: string | null; source?: 'event' | 'general' };
type EventOption = { id: string; event_name: string };

export default function IncomeClient({ initialIncome, events }: { initialIncome: Income[]; events: EventOption[] }) {
  const [income, setIncome] = useState<Income[]>(initialIncome);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [state, formAction] = useActionState(addIncome, null);
  const isGeneral = !selectedEvent || selectedEvent === 'general';

  useEffect(() => {
    if (state?.success) { setShowModal(false); setSelectedEvent(''); window.location.reload(); }
  }, [state?.success]);

  const filtered = income.filter(i =>
    i.event_name.toLowerCase().includes(search.toLowerCase()) ||
    (i.location ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const total = filtered.reduce((s, i) => s + Number(i.total_income), 0);

  return (
    <div className="p-6 md:p-12 text-white font-sans max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-emerald-400 flex items-center gap-3"><DollarSign />Income</h1>
          <p className="text-gray-400 mt-2 text-sm">Track revenue from events.</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold py-2.5 px-5 rounded-xl hover:opacity-90 transition-opacity">
          <Plus size={18} /><span>Record Income</span>
        </button>
      </header>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input type="text" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-light" />
          </div>
          {filtered.length > 0 && (
            <p className="text-sm text-gray-400 shrink-0">Total: <span className="text-emerald-400 font-bold">₹{total.toLocaleString('en-IN')}</span></p>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <DollarSign size={40} className="text-gray-700" />
            <p className="text-gray-500 text-sm">{search ? 'No matching records.' : 'No income recorded yet.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                  <th className="p-4 font-medium">Description / Event</th>
                  <th className="p-4 font-medium">Source</th>
                  <th className="p-4 font-medium">Location / Note</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium text-right">Total Income</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filtered.map((inc) => (
                  <tr key={inc.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium">{inc.event_name}</td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                        inc.source === 'general'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {inc.source === 'general' ? 'General' : 'Event'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">{inc.location ?? '—'}</td>
                    <td className="p-4 text-gray-400">{new Date(inc.date).toLocaleDateString('en-IN')}</td>
                    <td className="p-4 text-emerald-400 font-bold text-right">₹{Number(inc.total_income).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-5 right-5 text-gray-400 hover:text-white"><X size={20} /></button>
            <h2 className="text-2xl font-black mb-1">Record Income</h2>
            <p className="text-gray-500 text-sm mb-7">Add revenue for an event or record general income.</p>
            {state?.error && <div className="mb-5 p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-sm">{state.error}</div>}
            <form action={formAction} className="space-y-4">
              {/* Event selector */}
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <select
                  name="event_id"
                  value={selectedEvent}
                  onChange={e => setSelectedEvent(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none cursor-pointer">
                  <option value="general">— General (no event) —</option>
                  {events.map(ev => <option key={ev.id} value={ev.id}>{ev.event_name}</option>)}
                </select>
              </div>

              {/* Description — shown when General is selected */}
              {isGeneral && (
                <div className="relative">
                  <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500" size={16} />
                  <input type="text" name="description" required={isGeneral} placeholder="Description * (e.g. Advance payment)"
                    className="w-full bg-black/50 border border-purple-500/30 rounded-xl pl-9 pr-4 py-3 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
                </div>
              )}

              {/* Amount */}
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                <input type="number" name="amount" required min="0.01" step="0.01" placeholder="Amount *"
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
              </div>

              {/* Note */}
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input type="text" name="note" placeholder="Note (optional)"
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
              </div>
              <SubmitBtn />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
