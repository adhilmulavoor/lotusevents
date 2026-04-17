'use client';

import { useActionState, useEffect, useState } from 'react';
import { Plus, Search, Trash2, Users, X, Phone, Mail, Lock, Briefcase, DollarSign, Loader2, Edit3, CheckCircle } from 'lucide-react';
import { createMember, deleteUser, updateMember } from '@/app/actions/admin';
import { useFormStatus } from 'react-dom';

function SubmitBtn({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60">
      {pending ? <><Loader2 size={16} className="animate-spin" />Saving...</> : label}
    </button>
  );
}

type Worker = { job_type: string | null; daily_rate: number | null; status: string | null; id?: string };
type Member = {
  id: string; name: string; phone: string; email: string | null; created_at: string;
  workers: Worker[] | null;
};

function AddModal({ onClose }: { onClose: () => void }) {
  const [state, formAction] = useActionState(createMember, null);
  useEffect(() => { if (state?.success) { onClose(); window.location.reload(); } }, [state?.success]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-white"><X size={20} /></button>
        <h2 className="text-2xl font-black mb-1">Add New Member</h2>
        <p className="text-gray-500 text-sm mb-6">Creates a worker account with login credentials.</p>
        {state?.error && <div className="mb-5 p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-sm">{state.error}</div>}
        <form action={formAction} className="space-y-4">
          <Field icon={<Users size={16} />} name="name" placeholder="Full Name *" required />
          <Field icon={<Phone size={16} />} name="phone" type="tel" placeholder="Phone * (used for login)" required />
          <Field icon={<Mail size={16} />} name="email" type="email" placeholder="Email (optional)" />
          <Field icon={<Lock size={16} />} name="password" type="password" placeholder="Password / PIN *" required />
          <div className="grid grid-cols-2 gap-3">
            <Field icon={<Briefcase size={16} />} name="job_type" placeholder="Job Type" />
            <Field icon={<DollarSign size={16} />} name="daily_rate" type="number" placeholder="Daily Rate (₹)" min="0" step="0.01" />
          </div>
          <SubmitBtn label="Create Member" />
        </form>
      </div>
    </div>
  );
}

function EditModal({ member, onClose }: { member: Member; onClose: () => void }) {
  const worker = member.workers?.[0];
  const [state, formAction] = useActionState(updateMember, null);
  useEffect(() => { if (state?.success) { onClose(); window.location.reload(); } }, [state?.success]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-white"><X size={20} /></button>
        <h2 className="text-2xl font-black mb-1">Edit Member</h2>
        <p className="text-gray-500 text-sm mb-6">Update <span className="text-white font-medium">{member.name}</span>'s details.</p>
        {state?.error && <div className="mb-5 p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-sm">{state.error}</div>}
        {state?.success && <div className="mb-5 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center gap-2"><CheckCircle size={16} />{state.success}</div>}
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="user_id" value={member.id} />
          <input type="hidden" name="worker_id" value={worker?.id ?? ''} />
          <Field icon={<Users size={16} />} name="name" placeholder="Full Name *" required defaultValue={member.name} />
          <Field icon={<Phone size={16} />} name="phone" type="tel" placeholder="Phone *" required defaultValue={member.phone} />
          <Field icon={<Mail size={16} />} name="email" type="email" placeholder="Email" defaultValue={member.email ?? ''} />
          <Field icon={<Lock size={16} />} name="password" type="password" placeholder="New Password (leave blank to keep)" />
          <div className="grid grid-cols-2 gap-3">
            <Field icon={<Briefcase size={16} />} name="job_type" placeholder="Job Type" defaultValue={worker?.job_type ?? ''} />
            <Field icon={<DollarSign size={16} />} name="daily_rate" type="number" placeholder="Daily Rate (₹)" min="0" step="0.01" defaultValue={String(worker?.daily_rate ?? '')} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 ml-1">Status</label>
            <select name="status" defaultValue={worker?.status ?? 'active'}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none cursor-pointer">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <SubmitBtn label="Save Changes" />
        </form>
      </div>
    </div>
  );
}

function Field({ icon, name, type = 'text', placeholder, required, defaultValue, min, step }: any) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{icon}</span>
      <input type={type} name={name} placeholder={placeholder} required={required} defaultValue={defaultValue}
        min={min} step={step}
        className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
    </div>
  );
}

export default function AdminMembersClient({ initialMembers }: { initialMembers: Member[] }) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.phone.includes(search) ||
    (m.email ?? '').toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string) {
    if (!confirm('Delete this member? This cannot be undone.')) return;
    const res = await deleteUser(id, '/admin/members');
    if (!res?.error) setMembers(prev => prev.filter(m => m.id !== id));
    else alert(res.error);
  }

  return (
    <div className="p-6 md:p-12 text-white font-sans max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3"><Users className="text-emerald-400" />Members</h1>
          <p className="text-gray-400 mt-2 text-sm">Manage workers, roles, and login credentials.</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-2.5 px-5 rounded-xl hover:opacity-90 transition-opacity">
          <Plus size={18} /><span>Add Member</span>
        </button>
      </header>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="relative w-full md:w-96 mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input type="text" placeholder="Search by name, phone or email..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-light" />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Users size={40} className="text-gray-700" />
            <p className="text-gray-500 text-sm">{search ? 'No members match.' : 'No members yet. Add your first!'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Phone</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Job Type</th>
                  <th className="p-4 font-medium">Daily Rate</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filtered.map((member) => {
                  const worker = member.workers?.[0];
                  return (
                    <tr key={member.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          {member.name}
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{member.phone}</td>
                      <td className="p-4 text-gray-400">{member.email ?? '—'}</td>
                      <td className="p-4 text-gray-300 capitalize">{worker?.job_type ?? '—'}</td>
                      <td className="p-4 text-emerald-400 font-medium">{worker?.daily_rate != null ? `₹${worker.daily_rate}/day` : '—'}</td>
                      <td className="p-4">
                        <span className={`text-xs font-bold px-3 py-1 rounded-lg border capitalize ${worker?.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                          {worker?.status ?? 'active'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setEditing(member)} className="text-gray-400 hover:text-cyan-400 p-2 rounded-lg hover:bg-cyan-500/10 transition-colors">
                            <Edit3 size={15} />
                          </button>
                          <button onClick={() => handleDelete(member.id)} className="text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAdd && <AddModal onClose={() => setShowAdd(false)} />}
      {editing && <EditModal member={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
