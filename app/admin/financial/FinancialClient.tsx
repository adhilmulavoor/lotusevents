'use client';

import { useState, useMemo } from 'react';
import { 
  DollarSign, TrendingUp, TrendingDown, ArrowDownRight, ArrowUpRight,
  Calendar, Filter, Search, ChevronDown, ChevronUp
} from 'lucide-react';

type FilterType = 'all' | 'income' | 'expense';
type DateFilter = 'all_time' | 'this_week' | 'this_month' | 'custom';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  source?: string;
  events?: { id: string; event_name: string };
}

interface Event {
  id: string;
  event_name: string;
}

interface FinancialClientProps {
  initialIncome: any[];
  initialExpenses: any[];
  events: Event[];
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

export default function FinancialClient({ initialIncome, initialExpenses, events }: FinancialClientProps) {
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all_time');
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const allTransactions = useMemo(() => {
    const incomeData = (initialIncome || []).map((item: any) => ({
      id: item.id,
      type: 'income' as const,
      description: item.event_name || item.description || 'Income',
      amount: item.total_income || item.amount || 0,
      date: item.date,
      source: item.source || 'event',
      eventName: item.events?.event_name || null,
    }));

    const expenseData = (initialExpenses || []).map((item: any) => ({
      id: item.id,
      type: 'expense' as const,
      description: item.description || 'Expense',
      amount: item.amount || 0,
      date: item.date,
      source: 'expense',
      eventName: item.events?.event_name || null,
    }));

    return [...incomeData, ...expenseData].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [initialIncome, initialExpenses]);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let fromDate: Date | null = null;

    if (dateFilter === 'this_week') {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      fromDate = new Date(now.setDate(diff));
      fromDate.setHours(0, 0, 0, 0);
    } else if (dateFilter === 'this_month') {
      fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return allTransactions.filter(t => {
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (fromDate && new Date(t.date) < fromDate) return false;
      if (eventFilter !== 'all' && t.eventName !== eventFilter) return false;
      if (searchQuery && !t.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [allTransactions, typeFilter, dateFilter, eventFilter, searchQuery]);

  const totals = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { totalIncome, totalExpense, net: totalIncome - totalExpense };
  }, [filteredTransactions]);

  const eventOptions = useMemo(() => {
    const eventNames = new Set<string>();
    allTransactions.forEach(t => {
      if (t.eventName) eventNames.add(t.eventName);
    });
    return Array.from(eventNames);
  }, [allTransactions]);

  return (
    <div className="min-h-screen text-white pb-10">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/90 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-xl font-black tracking-tight">Financial Overview</h1>
          <p className="text-xs text-gray-500 mt-0.5">Income & Expenses</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-emerald-400" />
              <p className="text-xs text-emerald-400 uppercase tracking-wider">Total Income</p>
            </div>
            <p className="text-2xl font-black text-emerald-400">{formatCurrency(totals.totalIncome)}</p>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={16} className="text-red-400" />
              <p className="text-xs text-red-400 uppercase tracking-wider">Total Expenses</p>
            </div>
            <p className="text-2xl font-black text-red-400">{formatCurrency(totals.totalExpense)}</p>
          </div>

          <div className={`${totals.net >= 0 ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-orange-500/10 border border-orange-500/20'} rounded-2xl p-5`}>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} className={totals.net >= 0 ? 'text-blue-400' : 'text-orange-400'} />
              <p className={`text-xs uppercase tracking-wider ${totals.net >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>Net Balance</p>
            </div>
            <p className={`text-2xl font-black ${totals.net >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
              {totals.net >= 0 ? '+' : ''}{formatCurrency(totals.net)}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={14} className="text-gray-400" />
            <p className="text-sm font-semibold text-gray-300">Filters</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Type Filter */}
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-2 block">Type</label>
              <div className="flex bg-black/30 rounded-xl overflow-hidden border border-white/10">
                {(['all', 'income', 'expense'] as FilterType[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setTypeFilter(f)}
                    className={`flex-1 py-2 text-xs font-medium capitalize transition-colors ${
                      typeFilter === f 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-2 block">Period</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all_time">All Time</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
              </select>
            </div>

            {/* Event Filter */}
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-2 block">Event</label>
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Events</option>
                {eventOptions.map((event) => (
                  <option key={event} value={event}>{event}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-2 block">Search</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-300">
              Transactions ({filteredTransactions.length})
            </p>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <DollarSign size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No transactions found</p>
              <p className="text-sm mt-1 text-gray-600">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredTransactions.map((transaction) => {
                const isExpanded = expandedId === transaction.id;
                const isIncome = transaction.type === 'income';

                return (
                  <div 
                    key={transaction.id}
                    className="p-4 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : transaction.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isIncome 
                            ? 'bg-emerald-500/10 border border-emerald-500/20' 
                            : 'bg-red-500/10 border border-red-500/20'
                        }`}>
                          {isIncome 
                            ? <ArrowUpRight size={18} className="text-emerald-400" />
                            : <ArrowDownRight size={18} className="text-red-400" />
                          }
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{transaction.description}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Calendar size={10} className="text-gray-500" />
                            <span className="text-xs text-gray-500">{formatDate(transaction.date)}</span>
                            {transaction.eventName && (
                              <>
                                <span className="text-gray-600">•</span>
                                <span className="text-xs text-gray-400">{transaction.eventName}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${isIncome ? 'text-emerald-400' : 'text-red-400'}`}>
                          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {isIncome ? 'Income' : 'Expense'}
                        </p>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase">Type</p>
                            <p className="text-white capitalize">{transaction.type}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase">Source</p>
                            <p className="text-white capitalize">{transaction.source || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase">Date</p>
                            <p className="text-white">{formatDate(transaction.date)}</p>
                          </div>
                          {transaction.eventName && (
                            <div>
                              <p className="text-[10px] text-gray-500 uppercase">Event</p>
                              <p className="text-white">{transaction.eventName}</p>
                            </div>
                          )}
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
    </div>
  );
}
