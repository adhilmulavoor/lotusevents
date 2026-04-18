'use client';

import { useState, useMemo } from 'react';
import { 
  DollarSign, ArrowUpRight, ArrowDownRight, Receipt, 
  ArrowRight, Filter, Calendar, Search
} from 'lucide-react';
import Link from 'next/link';

type DateFilter = 'all_time' | 'today' | 'this_week' | 'this_month' | 'this_year' | 'specific_date';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
  eventName?: string;
}

interface AccountantDashboardClientProps {
  initialIncome: any[];
  initialExpenses: any[];
}

export default function AccountantDashboardClient({ initialIncome, initialExpenses }: AccountantDashboardClientProps) {
  const [dateFilter, setDateFilter] = useState<DateFilter>('all_time');
  const [specificDate, setSpecificDate] = useState<string>('');

  const allTransactions = useMemo(() => {
    const incomeData = (initialIncome || []).map((item: any) => ({
      id: item.id,
      type: 'income' as const,
      description: item.event_name || 'Income',
      amount: item.total_income || 0,
      date: item.date,
      eventName: item.event_name || null,
    }));

    const expenseData = (initialExpenses || []).map((item: any) => ({
      id: item.id,
      type: 'expense' as const,
      description: item.description || 'Expense',
      amount: item.amount || 0,
      date: item.date,
      eventName: item.events?.event_name || null,
    }));

    return [...incomeData, ...expenseData].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [initialIncome, initialExpenses]);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let fromDate: Date | null = null;
    let toDate: Date | null = null;

    if (dateFilter === 'today') {
      fromDate = new Date();
      fromDate.setHours(0, 0, 0, 0);
      toDate = new Date();
      toDate.setHours(23, 59, 59, 999);
    } else if (dateFilter === 'this_week') {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      fromDate = new Date(now.setDate(diff));
      fromDate.setHours(0, 0, 0, 0);
    } else if (dateFilter === 'this_month') {
      fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (dateFilter === 'this_year') {
      fromDate = new Date(now.getFullYear(), 0, 1);
    } else if (dateFilter === 'specific_date' && specificDate) {
      fromDate = new Date(specificDate);
      fromDate.setHours(0, 0, 0, 0);
      toDate = new Date(specificDate);
      toDate.setHours(23, 59, 59, 999);
    }

    return allTransactions.filter(t => {
      const tDate = new Date(t.date);
      if (fromDate && tDate < fromDate) return false;
      if (toDate && tDate > toDate) return false;
      return true;
    });
  }, [allTransactions, dateFilter, specificDate]);

  const stats = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense
    };
  }, [filteredTransactions]);

  const fmt = (n: number) =>
    '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  const recentExpenses = filteredTransactions.filter(t => t.type === 'expense').slice(0, 5);

  return (
    <div className="p-6 md:p-12 text-white font-sans max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Financial Dashboard
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Overview of expenses, income, and overall balance.</p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#111] border border-white/10 rounded-xl hover:border-emerald-500/30 transition-colors group/filter">
            <Filter size={14} className="text-gray-500 group-hover/filter:text-emerald-400 transition-colors" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as DateFilter)}
              className="bg-transparent text-sm text-gray-300 focus:outline-none appearance-none cursor-pointer pr-4 outline-none"
            >
              <option value="all_time" className="bg-[#0a0a0a] text-white">All Time</option>
              <option value="today" className="bg-[#0a0a0a] text-white">Today</option>
              <option value="this_week" className="bg-[#0a0a0a] text-white">This Week</option>
              <option value="this_month" className="bg-[#0a0a0a] text-white">This Month</option>
              <option value="this_year" className="bg-[#0a0a0a] text-white">This Year</option>
              <option value="specific_date" className="bg-[#0a0a0a] text-white">Specific Date</option>
            </select>
          </div>
          {dateFilter === 'specific_date' && (
            <input
              type="date"
              value={specificDate}
              onChange={(e) => setSpecificDate(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
            />
          )}
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col backdrop-blur-sm relative overflow-hidden group">
          <div className="relative z-10 flex justify-between items-start w-full">
            <div>
              <p className="text-sm text-gray-400 font-medium mb-1">Total Income</p>
              <p className="text-3xl font-bold text-emerald-400">{fmt(stats.totalIncome)}</p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/10 group-hover:scale-110 transition-transform">
              <ArrowUpRight className="text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col backdrop-blur-sm relative overflow-hidden group">
          <div className="relative z-10 flex justify-between items-start w-full">
            <div>
              <p className="text-sm text-gray-400 font-medium mb-1">Total Expenses</p>
              <p className="text-3xl font-bold text-red-400">{fmt(stats.totalExpense)}</p>
            </div>
            <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/10 group-hover:scale-110 transition-transform">
              <ArrowDownRight className="text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col backdrop-blur-sm relative overflow-hidden group">
          <div className="relative z-10 flex justify-between items-start w-full">
            <div>
              <p className="text-sm text-gray-400 font-medium mb-1">Net Profit</p>
              <p className={`text-3xl font-bold ${stats.netProfit >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>{fmt(stats.netProfit)}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:scale-110 transition-transform">
              <DollarSign className="text-cyan-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Expenses List */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Expenses</h2>
            <Link href="/accountant/expenses" className="text-xs text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {recentExpenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 opacity-50">
              <Receipt size={32} />
              <p className="text-sm font-medium">No expenses for this period</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentExpenses.map((ex: any) => (
                <div key={ex.id} className="flex justify-between items-center p-4 bg-black/40 rounded-xl border border-white/5 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                      <ArrowDownRight size={16} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">{ex.description}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {ex.eventName ?? 'General'} · {new Date(ex.date).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-red-400">{fmt(ex.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/accountant/expenses" className="flex items-center justify-between w-full text-left px-5 py-4 bg-black/40 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 rounded-xl transition-all border border-white/5 font-medium group text-sm">
              <span>+ Add Expense</span>
              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </Link>
            <Link href="/accountant/income" className="flex items-center justify-between w-full text-left px-5 py-4 bg-black/40 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 rounded-xl transition-all border border-white/5 font-medium group text-sm">
              <span>+ Record Income</span>
              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </Link>
            <Link href="/accountant/stock" className="flex items-center justify-between w-full text-left px-5 py-4 bg-black/40 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400 rounded-xl transition-all border border-white/5 font-medium group text-sm">
              <span>+ Add Stock Item</span>
              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </Link>
            <Link href="/accountant/reports" className="flex items-center justify-between w-full text-left px-5 py-4 bg-black/40 hover:bg-white/10 rounded-xl transition-all border border-white/5 font-medium group text-sm">
              <span>View Reports</span>
              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
