'use client';

import { useActionState, useEffect, useState } from 'react';
import { Plus, Search, Receipt, X, Loader2, Trash2, FileText, Tag } from 'lucide-react';
import { addExpense, deleteExpense } from '@/app/actions/accountant';
import { useFormStatus } from 'react-dom';

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60">
      {pending ? <><Loader2 size={16} className="animate-spin" />Adding...</> : 'Add Expense'}
    </button>
  );
}

type Expense = { id: string; description: string; amount: number; date: string; events?: { id: string; event_name: string } | null };
type EventOption = { id: string; event_name: string };

export default function ExpensesClient({ initialExpenses, events }: { initialExpenses: Expense[]; events: EventOption[] }) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [state, formAction] = useActionState(addExpense, null);

  useEffect(() => {
    if (state?.success) { setShowModal(false); window.location.reload(); }
  }, [state?.success]);

  const filtered = expenses.filter(e =>
    e.description.toLowerCase().includes(search.toLowerCase()) ||
    (e.events?.event_name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string) {
    if (!confirm('Delete this expense?')) return;
    const res = await deleteExpense(id);
    if (!res?.error) setExpenses(prev => prev.filter(e => e.id !== id));
    else alert(res.error);
  }

  const total = filtered.reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div className="p-6 md:p-12 text-white font-sans max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-red-400 flex items-center gap-3"><Receipt />Expenses</h1>
          <p className="text-gray-400 mt-2 text-sm">Track and manage event-related costs.</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-2.5 px-5 rounded-xl hover:opacity-90 transition-opacity">
          <Plus size={18} /><span>Add Expense</span>
        </button>
      </header>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input type="text" placeholder="Search expenses..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-light" />
          </div>
          {filtered.length > 0 && (
            <p className="text-sm text-gray-400 shrink-0">Total: <span className="text-red-400 font-bold">₹{total.toLocaleString('en-IN')}</span></p>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <Receipt size={40} className="text-gray-700" />
            <p className="text-gray-500 text-sm">{search ? 'No matching expenses.' : 'No expenses yet. Add your first!'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                  <th className="p-4 font-medium">Description</th>
                  <th className="p-4 font-medium">Event</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium text-right">Amount</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filtered.map((ex) => (
                  <tr key={ex.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium">{ex.description}</td>
                    <td className="p-4">
                      <span className="bg-white/10 text-gray-300 px-2.5 py-1 rounded-md text-xs">{ex.events?.event_name ?? 'General'}</span>
                    </td>
                    <td className="p-4 text-gray-400">{new Date(ex.date).toLocaleDateString('en-IN')}</td>
                    <td className="p-4 text-red-400 font-bold text-right">₹{Number(ex.amount).toLocaleString('en-IN')}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(ex.id)} className="text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </td>
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
            <h2 className="text-2xl font-black mb-1">Add Expense</h2>
            <p className="text-gray-500 text-sm mb-7">Record a new cost against an event or general.</p>
            {state?.error && <div className="mb-5 p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-sm">{state.error}</div>}
            <form action={formAction} className="space-y-4">
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input type="text" name="description" required placeholder="Expense description *"
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all" />
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                <input type="number" name="amount" required min="0.01" step="0.01" placeholder="Amount *"
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all" />
              </div>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <select name="event_id"
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all appearance-none cursor-pointer">
                  <option value="">— General (no event) —</option>
                  {events.map(ev => <option key={ev.id} value={ev.id}>{ev.event_name}</option>)}
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
