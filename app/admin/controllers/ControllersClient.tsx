'use client';

import { useActionState, useEffect, useState } from 'react';
import { Plus, Shield, X, Phone, Mail, Lock, Star, Loader2, Trash2, Edit3, CheckCircle, Wrench, AlertTriangle, BarChart3 } from 'lucide-react';
import { createController, deleteUser, updateController, fixControllerProfile, fixAllMissingControllerProfiles } from '@/app/actions/admin';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';

function SubmitBtn({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60">
      {pending ? <><Loader2 size={16} className="animate-spin" />Saving...</> : label}
    </button>
  );
}

type ControllerProfile = { id: string; experience_level: string | null; assigned_events_count: number | null };
type Controller = { id: string; name: string; phone: string; email: string | null; created_at: string; controllers: ControllerProfile[] | null };

function Field({ icon, name, type = 'text', placeholder, required, defaultValue }: any) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{icon}</span>
      <input type={type} name={name} placeholder={placeholder} required={required} defaultValue={defaultValue}
        className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all" />
    </div>
  );
}

function AddModal({ onClose }: { onClose: () => void }) {
  const [state, formAction] = useActionState(createController, null);
  useEffect(() => { if (state?.success) { onClose(); window.location.reload(); } }, [state?.success]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-white"><X size={20} /></button>
        <h2 className="text-2xl font-black mb-1">Add Controller</h2>
        <p className="text-gray-500 text-sm mb-6">Creates a controller account with login credentials.</p>
        {state?.error && <div className="mb-5 p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-sm">{state.error}</div>}
        <form action={formAction} className="space-y-4">
          <Field icon={<Shield size={16} />} name="name" placeholder="Full Name *" required />
          <Field icon={<Phone size={16} />} name="phone" type="tel" placeholder="Phone * (used for login)" required />
          <Field icon={<Mail size={16} />} name="email" type="email" placeholder="Email (optional)" />
          <Field icon={<Lock size={16} />} name="password" type="password" placeholder="Password / PIN *" required />
          <Field icon={<Star size={16} />} name="experience_level" placeholder="Experience Level (e.g. Senior)" />
          <SubmitBtn label="Create Controller" />
        </form>
      </div>
    </div>
  );
}

function EditModal({ ctrl, onClose }: { ctrl: Controller; onClose: () => void }) {
  const profile = ctrl.controllers?.[0];
  const [state, formAction] = useActionState(updateController, null);
  useEffect(() => { if (state?.success) { onClose(); window.location.reload(); } }, [state?.success]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-white"><X size={20} /></button>
        <h2 className="text-2xl font-black mb-1">Edit Controller</h2>
        <p className="text-gray-500 text-sm mb-6">Update <span className="text-white font-medium">{ctrl.name}</span>'s details.</p>
        {state?.error && <div className="mb-5 p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-sm">{state.error}</div>}
        {state?.success && <div className="mb-5 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center gap-2"><CheckCircle size={16} />{state.success}</div>}
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="user_id" value={ctrl.id} />
          <input type="hidden" name="controller_id" value={profile?.id ?? ''} />
          <Field icon={<Shield size={16} />} name="name" placeholder="Full Name *" required defaultValue={ctrl.name} />
          <Field icon={<Phone size={16} />} name="phone" type="tel" placeholder="Phone *" required defaultValue={ctrl.phone} />
          <Field icon={<Mail size={16} />} name="email" type="email" placeholder="Email" defaultValue={ctrl.email ?? ''} />
          <Field icon={<Lock size={16} />} name="password" type="password" placeholder="New Password (leave blank to keep)" />
          <Field icon={<Star size={16} />} name="experience_level" placeholder="Experience Level" defaultValue={profile?.experience_level ?? ''} />
          <SubmitBtn label="Save Changes" />
        </form>
      </div>
    </div>
  );
}

export default function ControllersClient({ initialControllers }: { initialControllers: Controller[] }) {
  const [controllers, setControllers] = useState<Controller[]>(initialControllers);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Controller | null>(null);
  const [fixingProfile, setFixingProfile] = useState<string | null>(null);
  const [fixMessage, setFixMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleDelete(id: string) {
    if (!confirm('Delete this controller?')) return;
    const res = await deleteUser(id, '/admin/controllers');
    if (!res?.error) setControllers(prev => prev.filter(c => c.id !== id));
    else alert(res.error);
  }

  async function handleFixProfile(userId: string) {
    setFixingProfile(userId);
    const res = await fixControllerProfile(userId);
    setFixingProfile(null);
    if (res.error) {
      setFixMessage({ type: 'error', text: res.error });
    } else {
      setFixMessage({ type: 'success', text: res.success || 'Profile fixed!' });
      window.location.reload();
    }
    setTimeout(() => setFixMessage(null), 3000);
  }

  async function handleFixAll() {
    if (!confirm('Fix all missing controller profiles?')) return;
    setFixingProfile('all');
    const res = await fixAllMissingControllerProfiles();
    setFixingProfile(null);
    if (res.error) {
      setFixMessage({ type: 'error', text: res.error });
    } else {
      setFixMessage({ type: 'success', text: res.success || 'All profiles fixed!' });
      window.location.reload();
    }
    setTimeout(() => setFixMessage(null), 3000);
  }

  const controllersWithoutProfile = controllers.filter(c => !c.controllers || c.controllers.length === 0);

  return (
    <div className="p-6 md:p-12 text-white font-sans max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3"><Shield className="text-cyan-400" />Controllers</h1>
          <p className="text-gray-400 mt-2 text-sm">Manage operational leaders and their login credentials.</p>
        </div>
        <div className="flex items-center gap-3">
          {controllersWithoutProfile.length > 0 && (
            <button onClick={handleFixAll} disabled={fixingProfile === 'all'}
              className="flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-400 font-bold py-2.5 px-4 rounded-xl transition-all">
              <Wrench size={16} />
              {fixingProfile === 'all' ? 'Fixing...' : `Fix ${controllersWithoutProfile.length} Profile(s)`}
            </button>
          )}
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2.5 px-5 rounded-xl hover:opacity-90 transition-opacity">
            <Plus size={18} /><span>Add Controller</span>
          </button>
        </div>
      </header>

      {fixMessage && (
        <div className={`p-4 rounded-xl border ${fixMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
          {fixMessage.text}
        </div>
      )}

      {controllers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Shield size={48} className="text-gray-700" />
          <p className="text-gray-500 text-sm">No controllers yet. Add your first!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {controllers.map((ctrl) => {
            const profile = ctrl.controllers?.[0];
            const hasProfile = profile && profile.id;
            return (
              <div key={ctrl.id} className={`bg-white/5 border transition-colors rounded-2xl p-6 backdrop-blur-sm flex flex-col gap-4 ${hasProfile ? 'border-white/10 hover:border-cyan-500/30' : 'border-amber-500/30 hover:border-amber-500/50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full border flex items-center justify-center text-xl font-bold ${hasProfile ? 'bg-gradient-to-tr from-cyan-900 to-cyan-500/20 border-cyan-500/30 text-cyan-400' : 'bg-gradient-to-tr from-amber-900 to-amber-500/20 border-amber-500/30 text-amber-400'}`}>
                      {ctrl.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{ctrl.name}</h3>
                        {!hasProfile && (
                          <span className="px-1.5 py-0.5 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-bold rounded">
                            NO PROFILE
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{ctrl.phone}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {hasProfile && (
                      <Link href={`/admin/controller-performance/${profile?.id}`} className="text-gray-400 hover:text-cyan-400 p-2 rounded-lg hover:bg-cyan-500/10 transition-colors">
                        <BarChart3 size={15} />
                      </Link>
                    )}
                    <button onClick={() => setEditing(ctrl)} className="text-gray-400 hover:text-cyan-400 p-2 rounded-lg hover:bg-cyan-500/10 transition-colors">
                      <Edit3 size={15} />
                    </button>
                    <button onClick={() => handleDelete(ctrl.id)} className="text-gray-600 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {ctrl.email && <p className="text-xs text-gray-500">{ctrl.email}</p>}

                {!hasProfile && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle size={14} className="text-amber-400" />
                      <p className="text-amber-400 text-xs font-bold">Missing Controller Profile</p>
                    </div>
                    <p className="text-amber-300/70 text-xs mb-2">This controller cannot see assigned events until their profile is fixed.</p>
                    <button onClick={() => handleFixProfile(ctrl.id)} disabled={fixingProfile === ctrl.id}
                      className="w-full flex items-center justify-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-400 text-xs font-bold py-2 rounded-lg transition-all disabled:opacity-50">
                      <Wrench size={12} />
                      {fixingProfile === ctrl.id ? 'Fixing...' : 'Fix Profile Now'}
                    </button>
                  </div>
                )}

                {hasProfile && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                      <p className="text-xs text-gray-500 mb-1">Assigned Events</p>
                      <p className="font-bold text-cyan-400">{profile?.assigned_events_count ?? 0}</p>
                    </div>
                    <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                      <p className="text-xs text-gray-500 mb-1">Experience</p>
                      <p className="font-bold capitalize text-sm">{profile?.experience_level ?? '—'}</p>
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-600">
                  Joined {new Date(ctrl.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {showAdd && <AddModal onClose={() => setShowAdd(false)} />}
      {editing && <EditModal ctrl={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
