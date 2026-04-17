'use client';

import { useState } from 'react';
import { Users, AlertCircle, IndianRupee, Wallet, Car } from 'lucide-react';

interface TeamMember {
  memberId: string;
  name: string;
  phone: string;
  jobType: string;
  totalWage: number;
  totalPaid: number;
  totalPending: number;
  totalTa: number;
  eventsWorked: number;
}

interface Props {
  session: any;
  teamMembers: TeamMember[];
  loadError?: string | null;
}

export function TeamClient({ session, teamMembers, loadError }: Props) {
  const [search, setSearch] = useState('');
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  const filtered = teamMembers.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.phone.includes(search) ||
    m.jobType.toLowerCase().includes(search.toLowerCase())
  );

  const grandTotalWage = teamMembers.reduce((s, m) => s + m.totalWage, 0);
  const grandTotalPaid = teamMembers.reduce((s, m) => s + m.totalPaid, 0);
  const grandTotalPending = teamMembers.reduce((s, m) => s + m.totalPending, 0);
  const grandTotalTa = teamMembers.reduce((s, m) => s + m.totalTa, 0);

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Team</h2>
          <p className="text-gray-400 mb-4">{loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white font-sans">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-black/90 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[10px] font-bold uppercase tracking-wider rounded-md">
                My Team
              </span>
            </div>
            <h1 className="text-xl font-black text-white tracking-tight mt-1">
              {session?.name || 'Controller'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">{today}</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-900 to-cyan-900 border border-purple-500/30 flex items-center justify-center text-sm font-bold text-purple-400">
            {(session?.name as string || 'C').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Grand Total */}
        {teamMembers.length > 0 && (
          <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/5 border border-purple-500/20 rounded-2xl p-5">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-3">Grand Total</p>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center">
                <p className="text-[10px] text-gray-500 uppercase mb-1">Total</p>
                <p className="text-lg font-black text-white">₹{grandTotalWage.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-emerald-400 uppercase mb-1">Paid</p>
                <p className="text-lg font-black text-emerald-400">₹{grandTotalPaid.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-red-400 uppercase mb-1">Pending</p>
                <p className="text-lg font-black text-red-400">₹{grandTotalPending.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-amber-400 uppercase mb-1">TA</p>
                <p className="text-lg font-black text-amber-400">₹{grandTotalTa.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Total Paid Out</p>
            <p className="text-xl font-black text-emerald-400">₹{grandTotalPaid.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-2xl p-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Total Pending</p>
            <p className="text-xl font-black text-red-400">₹{grandTotalPending.toLocaleString()}</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3">
          <Users size={16} className="text-gray-500 shrink-0" />
          <input type="text" placeholder="Search team members..." value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent flex-1 text-sm text-white placeholder:text-gray-600 focus:outline-none" />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">{search ? 'No matching members.' : 'No team members yet.'}</p>
            <p className="text-sm mt-1 text-gray-600">Members added to your events will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((m) => (
              <div key={m.memberId} className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-5 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-900 to-purple-500/20 border border-purple-500/30 flex items-center justify-center text-sm font-bold text-purple-300">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-white">{m.name}</p>
                      <p className="text-xs text-gray-500">{m.jobType} · {m.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{m.eventsWorked} event{m.eventsWorked !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="bg-black/40 border border-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <IndianRupee size={10} className="text-gray-500" />
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Total Wage</p>
                    </div>
                    <p className="font-bold text-white">₹{m.totalWage.toLocaleString()}</p>
                  </div>
                  <div className="bg-black/40 border border-emerald-500/10 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Wallet size={10} className="text-emerald-500" />
                      <p className="text-[10px] text-emerald-500 uppercase tracking-wider">Paid</p>
                    </div>
                    <p className="font-bold text-emerald-400">₹{m.totalPaid.toLocaleString()}</p>
                  </div>
                  <div className="bg-black/40 border border-red-500/10 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <AlertCircle size={10} className="text-red-500" />
                      <p className="text-[10px] text-red-500 uppercase tracking-wider">Pending</p>
                    </div>
                    <p className="font-bold text-red-400">₹{m.totalPending.toLocaleString()}</p>
                  </div>
                  <div className="bg-black/40 border border-amber-500/10 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Car size={10} className="text-amber-500" />
                      <p className="text-[10px] text-amber-500 uppercase tracking-wider">TA</p>
                    </div>
                    <p className="font-bold text-amber-400">₹{m.totalTa.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
