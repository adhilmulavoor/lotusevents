'use client';

import { useState } from 'react';
import { 
  Activity, Users, Calendar, DollarSign, Search, 
  TrendingUp, ArrowUpRight, ArrowDownRight, ChevronRight, X, Clock
} from 'lucide-react';
import Link from 'next/link';

interface MemberPayment {
  memberId: string;
  name: string;
  wage: number;
  paid: number;
  pending: number;
  events: string[];
}

interface EventData {
  id: string;
  event_name: string;
  date: string;
  location: string;
  status: string;
}

interface ControllerData {
  id: string;
  name: string;
  phone: string;
  totalPrograms: number;
  totalWage: number;
  totalPaid: number;
  totalPending: number;
  totalTa: number;
  events: EventData[];
  memberPayments: MemberPayment[];
}

interface Props {
  data: ControllerData | null;
  error: string | null;
}

function formatCurrency(val: number) {
  return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function ControllerPerformanceClient({ data, error }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<MemberPayment | null>(null);

  if (error || !data) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center p-6">
        <div className="text-center">
          <Activity size={40} className="mx-auto mb-3 text-red-400 opacity-70" />
          <p className="text-gray-400">{error || 'No data found'}</p>
          <Link href="/admin/controllers" className="mt-4 inline-block text-cyan-400 hover:underline">
            Back to Controllers
          </Link>
        </div>
      </div>
    );
  }

  const filteredMembers = data.memberPayments.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paymentRatio = data.totalWage > 0 
    ? Math.round((data.totalPaid / data.totalWage) * 100) 
    : 0;

  return (
    <div className="min-h-screen text-white pb-10">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/90 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/controllers" className="text-gray-500 hover:text-white transition-colors">
              <ChevronRight size={18} className="rotate-180" />
            </Link>
            <h1 className="text-xl font-black tracking-tight">{data.name}'s Performance</h1>
          </div>
          <p className="text-xs text-gray-500 ml-7">{data.phone}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={14} className="text-blue-400" />
              <p className="text-[10px] text-gray-400 uppercase">Programs</p>
            </div>
            <p className="text-xl font-black text-white">{data.totalPrograms}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={14} className="text-gray-400" />
              <p className="text-[10px] text-gray-400 uppercase">Total Wage</p>
            </div>
            <p className="text-xl font-black text-white">{formatCurrency(data.totalWage)}</p>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <ArrowUpRight size={14} className="text-emerald-400" />
              <p className="text-[10px] text-emerald-400 uppercase">Total Paid</p>
            </div>
            <p className="text-xl font-black text-emerald-400">{formatCurrency(data.totalPaid)}</p>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <ArrowDownRight size={14} className="text-red-400" />
              <p className="text-[10px] text-red-400 uppercase">Pending</p>
            </div>
            <p className="text-xl font-black text-red-400">{formatCurrency(data.totalPending)}</p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} className="text-amber-400" />
              <p className="text-[10px] text-amber-400 uppercase">Progress</p>
            </div>
            <p className="text-xl font-black text-amber-400">{paymentRatio}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Payment Progress</span>
            <span className="text-white font-medium">{paymentRatio}% Complete</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all"
              style={{ width: `${paymentRatio}%` }}
            />
          </div>
        </div>

        {/* Member Payments */}
        <div className="bg-white/5 border border-white/10 rounded-2xl">
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <Users size={16} className="text-cyan-400" />
                Member Payments
              </h2>
              <span className="text-xs text-gray-500">{filteredMembers.length} Members</span>
            </div>
          </div>

          <div className="p-4">
            <div className="relative mb-4">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {filteredMembers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No members found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredMembers.map((member) => (
                  <div 
                    key={member.memberId}
                    className="bg-black/30 border border-white/5 rounded-xl p-4 cursor-pointer hover:border-cyan-500/30 transition-colors"
                    onClick={() => setSelectedMember(member)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.events.length} Events</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">{formatCurrency(member.paid)}</p>
                        <p className="text-[10px] text-gray-500">paid of {formatCurrency(member.wage)}</p>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                        style={{ width: `${member.wage > 0 ? Math.round((member.paid / member.wage) * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Events Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl">
          <div className="p-4 border-b border-white/5">
            <h2 className="font-semibold flex items-center gap-2">
              <Calendar size={16} className="text-blue-400" />
              Assigned Events
            </h2>
          </div>
          <div className="p-4">
            {data.events.length === 0 ? (
              <p className="text-center py-8 text-gray-500 text-sm">No events assigned</p>
            ) : (
              <div className="space-y-2">
                {data.events.slice(0, 10).map((event) => (
                  <div key={event.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-white">{event.event_name}</p>
                      <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full ${
                      event.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                      event.status === 'ongoing' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                ))}
                {data.events.length > 10 && (
                  <p className="text-center text-xs text-gray-500 pt-2">+{data.events.length - 10} more events</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setSelectedMember(null)}>
          <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{selectedMember.name}</h2>
              <button onClick={() => setSelectedMember(null)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Wage</span>
                <span className="text-white font-medium">{formatCurrency(selectedMember.wage)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Paid</span>
                <span className="text-emerald-400 font-medium">{formatCurrency(selectedMember.paid)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Pending</span>
                <span className="text-red-400 font-medium">{formatCurrency(selectedMember.pending)}</span>
              </div>
              <div className="pt-3 border-t border-white/10">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                    style={{ width: `${selectedMember.wage > 0 ? Math.round((selectedMember.paid / selectedMember.wage) * 100) : 0}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {selectedMember.wage > 0 ? Math.round((selectedMember.paid / selectedMember.wage) * 100) : 0}% Paid
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}