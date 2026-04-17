'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Wallet, Banknote, Car, Clock, CheckCircle2,
  AlertCircle, TrendingUp, Calendar, ChevronRight,
  ArrowUpRight, MapPin, CalendarDays
} from 'lucide-react';

type FilterType = 'this_week' | 'this_month' | 'all_time';

interface EventWorker {
  id: string;
  wage_amount: number;
  ta_amount: number;
  has_ta: boolean;
  paid_amount: number;
  pending_amount: number;
  attendance: string;
  created_at: string;
  events?: {
    id: string;
    event_name: string;
    date: string;
    location: string;
    status: string;
  };
}

interface DashboardData {
  member: any;
  eventWorkers: EventWorker[];
  totalEarned: number;
  totalPaid: number;
  pendingAmount: number;
  advanceTaken: number;
  filteredEarnings: number;
  filteredSalaryTotal: number;
  filteredTaTotal: number;
  filteredPaid: number;
  filteredPending: number;
}

interface Props {
  session: any;
  data: DashboardData | null;
  error: string | null;
  activeFilter: FilterType;
}

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'this_week', label: 'This Week' },
  { key: 'this_month', label: 'This Month' },
  { key: 'all_time', label: 'All Time' },
];

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

export function MemberDashboardClient({ session, data, error, activeFilter }: Props) {
  const router = useRouter();
  const [expandedWork, setExpandedWork] = useState(false);

  const handleFilterChange = (f: FilterType) => {
    router.push(`/worker/dashboard?filter=${f}`);
  };

  const name = session?.name as string || 'Member';
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  if (error && !data) {
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

  const d = data!;
  const activeJobs = d.eventWorkers.filter(ew => ew.events?.status === 'ongoing').length;
  const pendingPayments = d.eventWorkers.filter(ew => (ew.pending_amount || 0) > 0).length;

  return (
    <div className="min-h-screen text-white font-sans pb-10">
      
      {/* Header */}
      <div className="sticky top-0 md:top-0 z-30 bg-black/90 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black tracking-tight">My Earnings</h1>
            <p className="text-xs text-gray-500 mt-0.5">Welcome back, {name.split(' ')[0]}</p>
          </div>
          <div className="flex items-center gap-3">
            {activeJobs > 0 && (
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
                {activeJobs} active
              </span>
            )}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-900 to-cyan-900 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-400">
              {initials}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Period Filter */}
        <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => handleFilterChange(f.key)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeFilter === f.key
                  ? 'bg-white text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Main Earnings Card */}
        <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-900 to-black border border-white/10 rounded-3xl overflow-hidden p-6">
          {/* Glow effect */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} className="text-emerald-400" />
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {FILTERS.find(f => f.key === activeFilter)?.label} Earnings
              </p>
            </div>
            <div className="text-5xl font-black tracking-tighter mb-1">
              {formatCurrency(d.filteredEarnings)}
            </div>
            <p className="text-sm text-gray-500">
              {d.eventWorkers.length} program{d.eventWorkers.length !== 1 ? 's' : ''} in this period
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mt-5">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Salary</p>
                <p className="font-bold text-white">{formatCurrency(d.filteredSalaryTotal)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">TA</p>
                <p className="font-bold text-amber-400">{formatCurrency(d.filteredTaTotal)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Received</p>
                <p className="font-bold text-emerald-400">{formatCurrency(d.filteredPaid)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Salary Breakdown */}
        <div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Salary Overview</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            
            {/* Total Salary Row */}
            <div className="flex items-center gap-4 p-4 border-b border-white/5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Banknote size={18} className="text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Total Salary</p>
                <p className="text-xs text-gray-500">All programs combined</p>
              </div>
              <p className="text-lg font-black text-white">{formatCurrency(d.totalEarned)}</p>
            </div>

            {/* Paid Row */}
            <div className="flex items-center gap-4 p-4 border-b border-white/5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <CheckCircle2 size={18} className="text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Amount Received</p>
                <p className="text-xs text-gray-500">Payments credited to you</p>
              </div>
              <p className="text-lg font-black text-blue-400">{formatCurrency(d.totalPaid)}</p>
            </div>

            {/* Pending Row */}
            <div className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Clock size={18} className="text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Pending Payment</p>
                <p className="text-xs text-gray-500">Yet to be paid</p>
              </div>
              <p className="text-lg font-black text-amber-400">{formatCurrency(d.pendingAmount)}</p>
            </div>

            {/* Progress bar */}
            {d.totalEarned > 0 && (
              <div className="px-4 pb-4">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all"
                    style={{ width: `${Math.min((d.totalPaid / d.totalEarned) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <p className="text-[10px] text-gray-500">Received</p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {d.totalEarned > 0 ? Math.round((d.totalPaid / d.totalEarned) * 100) : 0}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TA Section */}
        <div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Travel Allowance (TA)</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Car size={18} className="text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Total TA Earned</p>
                  <p className="text-xs text-gray-500">All travel reimbursements</p>
                </div>
                <p className="text-xl font-black text-amber-400">
                  {formatCurrency(d.eventWorkers.reduce((s, ew) => s + (ew.ta_amount || 0), 0))}
                </p>
              </div>
            </div>

            {/* TA Breakdown by event */}
            {d.eventWorkers.filter(ew => (ew.ta_amount || 0) > 0).length > 0 ? (
              <div className="divide-y divide-white/5">
                {/* Received TA */}
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <div>
                      <p className="text-sm text-white">TA Received</p>
                      <p className="text-xs text-gray-500">Amount credited</p>
                    </div>
                  </div>
                  <p className="font-bold text-emerald-400">
                    {formatCurrency(d.eventWorkers.filter(ew => ew.has_ta).reduce((s, ew) => {
                      const ratio = (ew.wage_amount + ew.ta_amount) > 0 
                        ? ew.ta_amount / (ew.wage_amount + ew.ta_amount) 
                        : 0;
                      return s + (ew.paid_amount * ratio);
                    }, 0))}
                  </p>
                </div>

                {/* Pending TA */}
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <AlertCircle size={16} className="text-amber-400" />
                    <div>
                      <p className="text-sm text-white">TA Pending</p>
                      <p className="text-xs text-gray-500">Yet to be credited</p>
                    </div>
                  </div>
                  <p className="font-bold text-amber-400">
                    {formatCurrency(d.eventWorkers.filter(ew => ew.has_ta).reduce((s, ew) => {
                      const ratio = (ew.wage_amount + ew.ta_amount) > 0 
                        ? ew.ta_amount / (ew.wage_amount + ew.ta_amount) 
                        : 0;
                      return s + (ew.pending_amount * ratio);
                    }, 0))}
                  </p>
                </div>

                {/* TA entries */}
                {d.eventWorkers
                  .filter(ew => (ew.ta_amount || 0) > 0)
                  .slice(0, expandedWork ? undefined : 3)
                  .map((ew) => (
                    <div key={ew.id} className="flex items-center justify-between px-4 py-3 hover:bg-white/3 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                          <Car size={11} className="text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm text-white">{ew.events?.event_name || 'Event'}</p>
                          <p className="text-xs text-gray-500">{ew.events?.date ? formatDate(ew.events.date) : ''}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-amber-400">{formatCurrency(ew.ta_amount || 0)}</p>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center">
                <Car size={28} className="mx-auto mb-2 text-gray-600" />
                <p className="text-sm text-gray-500">No TA recorded yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Work Details / Recent Programs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Work Details</h2>
            <span className="text-xs text-gray-500">{d.eventWorkers.length} total</span>
          </div>

          <div className="space-y-3">
            {d.eventWorkers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CalendarDays size={36} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No work records</p>
                <p className="text-sm text-gray-600 mt-1">Programs you work on will appear here.</p>
              </div>
            ) : (
              <>
                {d.eventWorkers.slice(0, expandedWork ? undefined : 5).map((ew) => {
                  const total = (ew.wage_amount || 0) + (ew.ta_amount || 0);
                  const isPaid = (ew.paid_amount || 0) >= total && total > 0;
                  const isPartial = (ew.paid_amount || 0) > 0 && (ew.paid_amount || 0) < total;
                  
                  return (
                    <div key={ew.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/8 transition-colors">
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
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{ew.events?.event_name || 'Event'}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {ew.events?.date && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar size={9} />{formatDate(ew.events.date)}
                            </span>
                          )}
                          {ew.events?.location && (
                            <span className="text-xs text-gray-500 flex items-center gap-1 truncate">
                              <MapPin size={9} />{ew.events.location}
                            </span>
                          )}
                        </div>
                        {(ew.ta_amount || 0) > 0 && (
                          <p className="text-xs text-amber-400 mt-0.5 flex items-center gap-1">
                            <Car size={9} /> +₹{ew.ta_amount} TA
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-bold text-white">{formatCurrency(total)}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                          isPaid ? 'text-emerald-400' : isPartial ? 'text-amber-400' : 'text-gray-500'
                        }`}>
                          {isPaid ? 'Paid' : isPartial ? 'Partial' : 'Pending'}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {d.eventWorkers.length > 5 && (
                  <button
                    onClick={() => setExpandedWork(!expandedWork)}
                    className="w-full flex items-center justify-center gap-2 py-3 text-sm text-gray-400 hover:text-white bg-white/3 hover:bg-white/5 border border-white/10 rounded-2xl transition-all"
                  >
                    {expandedWork ? 'Show less' : `View all ${d.eventWorkers.length} records`}
                    <ChevronRight size={14} className={`transition-transform ${expandedWork ? 'rotate-90' : ''}`} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Quick Summary Bottom Card */}
        <div className="bg-gradient-to-r from-emerald-900/30 to-cyan-900/20 border border-emerald-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Wallet size={16} className="text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Overall Summary</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Total Earned (All Time)</p>
              <p className="text-xl font-black text-white">{formatCurrency(d.totalEarned)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Total Received</p>
              <p className="text-xl font-black text-emerald-400">{formatCurrency(d.totalPaid)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Pending Balance</p>
              <p className="text-xl font-black text-amber-400">{formatCurrency(d.pendingAmount)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Total TA Received</p>
              <p className="text-xl font-black text-cyan-400">
                {formatCurrency(d.eventWorkers.filter(ew => ew.has_ta).reduce((s, ew) => s + (ew.ta_amount || 0), 0))}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
