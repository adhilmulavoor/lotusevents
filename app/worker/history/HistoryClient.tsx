'use client';

import { useState } from 'react';
import { 
  History, AlertCircle, IndianRupee, Calendar, 
  MapPin, CheckCircle2, Clock, Car, ChevronDown, ChevronUp
} from 'lucide-react';

interface WorkHistoryItem {
  id: string;
  wage_amount: number;
  ta_amount: number;
  paid_amount: number;
  pending_amount: number;
  attendance: string;
  total: number;
  pending: number;
  controller_name: string;
  events?: {
    id: string;
    event_name: string;
    date: string;
    location: string;
    status: string;
  };
}

interface Props {
  session: any;
  workHistory: WorkHistoryItem[];
  error: string | null;
}

function formatCurrency(val: number) {
  return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'completed':
      return <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Completed</span>;
    case 'ongoing':
      return <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">Ongoing</span>;
    case 'planned':
      return <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Planned</span>;
    default:
      return <span className="text-[10px] bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded-full">{status}</span>;
  }
}

function getAttendanceBadge(attendance: string) {
  switch (attendance?.toLowerCase()) {
    case 'present':
      return <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Present</span>;
    case 'absent':
      return <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Absent</span>;
    case 'leave':
      return <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">Leave</span>;
    default:
      return <span className="text-[10px] bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded-full">{attendance || 'N/A'}</span>;
  }
}

export function HistoryClient({ session, workHistory, error }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const name = session?.name as string || 'Worker';
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  const filteredHistory = workHistory.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'completed') return (item.paid_amount || 0) >= (item.total || 0);
    if (filter === 'pending') return (item.pending || 0) > 0;
    return true;
  });

  const totalEarnings = workHistory.reduce((sum, item) => sum + (item.total || 0), 0);
  const totalPaid = workHistory.reduce((sum, item) => sum + (item.paid_amount || 0), 0);
  const totalPending = workHistory.reduce((sum, item) => sum + (item.pending || 0), 0);
  const totalTA = workHistory.reduce((sum, item) => sum + (item.ta_amount || 0), 0);

  if (error) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle size={40} className="mx-auto mb-3 text-red-400 opacity-70" />
          <p className="text-gray-400">{error}</p>
          <p className="text-sm text-gray-600 mt-1">Please contact your administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white font-sans pb-10">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/90 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black tracking-tight">Work History</h1>
            <p className="text-xs text-gray-500 mt-0.5">{workHistory.length} events</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-900 to-cyan-900 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-400">
            {initials}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Total Earned</p>
            <p className="text-lg font-black text-white">{formatCurrency(totalEarnings)}</p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4">
            <p className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1">Paid</p>
            <p className="text-lg font-black text-emerald-400">{formatCurrency(totalPaid)}</p>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4">
            <p className="text-[10px] text-amber-400 uppercase tracking-wider mb-1">Pending</p>
            <p className="text-lg font-black text-amber-400">{formatCurrency(totalPending)}</p>
          </div>
          <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-4">
            <p className="text-[10px] text-cyan-400 uppercase tracking-wider mb-1">Total TA</p>
            <p className="text-lg font-black text-cyan-400">{formatCurrency(totalTA)}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10">
          {(['all', 'completed', 'pending'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${
                filter === f
                  ? 'bg-white text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All' : f === 'completed' ? 'Completed' : 'Pending'}
            </button>
          ))}
        </div>

        {/* Work History List */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <History size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No work history found</p>
            <p className="text-sm mt-1 text-gray-600">Events you work on will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => {
              const isExpanded = expandedId === item.id;
              const isPaid = (item.paid_amount || 0) >= (item.total || 0);
              const isPartial = (item.paid_amount || 0) > 0 && (item.paid_amount || 0) < (item.total || 0);

              return (
                <div 
                  key={item.id} 
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                >
                  {/* Main Row */}
                  <div 
                    className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border ${
                          isPaid 
                            ? 'bg-emerald-500/10 border-emerald-500/20' 
                            : isPartial 
                              ? 'bg-amber-500/10 border-amber-500/20' 
                              : 'bg-gray-500/10 border-gray-500/20'
                        }`}>
                          {isPaid 
                            ? <CheckCircle2 size={18} className="text-emerald-400" />
                            : isPartial
                              ? <Clock size={18} className="text-amber-400" />
                              : <AlertCircle size={18} className="text-gray-400" />
                          }
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-white truncate">{item.events?.event_name || 'Event'}</p>
                            {getStatusBadge(item.events?.status || '')}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            {item.events?.date && (
                              <span className="flex items-center gap-1">
                                <Calendar size={10} />{formatDate(item.events.date)}
                              </span>
                            )}
                            {item.events?.location && (
                              <span className="flex items-center gap-1 truncate">
                                <MapPin size={10} />{item.events.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-white">{formatCurrency(item.total || 0)}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                          isPaid ? 'text-emerald-400' : isPartial ? 'text-amber-400' : 'text-gray-500'
                        }`}>
                          {isPaid ? 'Paid' : isPartial ? 'Partial' : 'Pending'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-white/5 p-4 bg-black/20">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase mb-1">Wage</p>
                          <p className="font-bold text-white">{formatCurrency(item.wage_amount || 0)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-cyan-400 uppercase mb-1">TA</p>
                          <p className="font-bold text-cyan-400">{formatCurrency(item.ta_amount || 0)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-emerald-400 uppercase mb-1">Paid</p>
                          <p className="font-bold text-emerald-400">{formatCurrency(item.paid_amount || 0)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-amber-400 uppercase mb-1">Pending</p>
                          <p className="font-bold text-amber-400">{formatCurrency(item.pending || 0)}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500">Attendance:</span>
                            {getAttendanceBadge(item.attendance)}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500">Controller:</span>
                            <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                              {item.controller_name || 'Unknown'}
                            </span>
                          </div>
                        </div>
                        <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                          View Details
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
