'use client';

import { useActionState, useEffect, useState } from 'react';
import { Plus, Search, Package, X, Loader2, Trash2, Hash, Info } from 'lucide-react';
import { addStockItem, deleteStockItem } from '@/app/actions/accountant';
import { useFormStatus } from 'react-dom';

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60">
      {pending ? <><Loader2 size={16} className="animate-spin" />Adding...</> : 'Add Stock Item'}
    </button>
  );
}

type StockItem = { id: string; item_name: string; total_quantity: number; available_quantity: number; price_per_unit: number; condition_status: string | null };

export default function StockClient({ initialItems }: { initialItems: StockItem[] }) {
  const [items, setItems] = useState<StockItem[]>(initialItems);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [state, formAction] = useActionState(addStockItem, null);

  useEffect(() => {
    if (state?.success) { setShowModal(false); window.location.reload(); }
  }, [state?.success]);

  const filtered = items.filter(i => i.item_name.toLowerCase().includes(search.toLowerCase()));

  async function handleDelete(id: string) {
    if (!confirm('Delete this stock item?')) return;
    const res = await deleteStockItem(id);
    if (!res?.error) setItems(prev => prev.filter(i => i.id !== id));
    else alert(res.error);
  }

  return (
    <div className="p-6 md:p-12 text-white font-sans max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Package className="text-amber-400" />Stock Inventory
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Manage rental items, quantities, and availability.</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-2.5 px-5 rounded-xl hover:opacity-90 transition-opacity">
          <Plus size={18} /><span>Add Stock Item</span>
        </button>
      </header>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="relative w-full md:w-96 mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input type="text" placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-light" />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <Package size={40} className="text-gray-700" />
            <p className="text-gray-500 text-sm">{search ? 'No items match.' : 'No stock items yet. Add your first!'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                  <th className="p-4 font-medium">Item Name</th>
                  <th className="p-4 font-medium text-center">Total</th>
                  <th className="p-4 font-medium text-center">In Use</th>
                  <th className="p-4 font-medium text-center">Available</th>
                  <th className="p-4 font-medium">Price/Unit</th>
                  <th className="p-4 font-medium">Condition</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filtered.map((item) => {
                  const inUse = item.total_quantity - item.available_quantity;
                  return (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-medium">{item.item_name}</td>
                      <td className="p-4 text-center font-bold">{item.total_quantity}</td>
                      <td className="p-4 text-center text-red-300">{inUse}</td>
                      <td className={`p-4 text-center font-bold ${item.available_quantity === 0 ? 'text-red-500' : 'text-emerald-400'}`}>
                        {item.available_quantity}
                      </td>
                      <td className="p-4 text-gray-400">₹{Number(item.price_per_unit).toLocaleString('en-IN')}</td>
                      <td className="p-4">
                        <span className="bg-white/10 text-gray-300 px-2.5 py-1 rounded-md text-xs">{item.condition_status ?? '—'}</span>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDelete(item.id)} className="text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors">
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
            <h2 className="text-2xl font-black mb-1">Add Stock Item</h2>
            <p className="text-gray-500 text-sm mb-7">Add a new rental item to inventory.</p>
            {state?.error && <div className="mb-5 p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-sm">{state.error}</div>}
            <form action={formAction} className="space-y-4">
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input type="text" name="item_name" required placeholder="Item name *"
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input type="number" name="total_quantity" required min="0" placeholder="Quantity *"
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all" />
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                  <input type="number" name="price_per_unit" min="0" step="0.01" placeholder="Price/unit"
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all" />
                </div>
              </div>
              <div className="relative">
                <Info className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input type="text" name="condition_status" placeholder="Condition (e.g. Good, Fair)"
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all" />
              </div>
              <SubmitBtn />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
