import { DollarSign, ArrowUpRight, ArrowDownRight, Receipt, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getFinancialStats, getRecentExpenses } from '@/app/actions/accountant';

export default async function AccountantDashboard() {
  const [stats, recent] = await Promise.all([
    getFinancialStats(),
    getRecentExpenses(5),
  ]);

  const fmt = (n: number) =>
    '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });

  const statCards = [
    { label: 'Total Income', value: fmt(stats.totalIncome), icon: <ArrowUpRight className="text-emerald-400" />, color: 'text-emerald-400' },
    { label: 'Total Expenses', value: fmt(stats.totalExpense), icon: <ArrowDownRight className="text-red-400" />, color: 'text-red-400' },
    { label: 'Net Profit', value: fmt(stats.netProfit), icon: <DollarSign className="text-cyan-400" />, color: stats.netProfit >= 0 ? 'text-cyan-400' : 'text-red-400' },
  ];

  return (
    <div className="p-6 md:p-12 text-white font-sans max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Financial Dashboard
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Overview of expenses, income, and overall balance.</p>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex justify-between items-start w-full">
              <div>
                <p className="text-sm text-gray-400 font-medium mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Expenses */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Expenses</h2>
            <Link href="/accountant/expenses" className="text-xs text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Receipt className="text-gray-700" size={32} />
              <p className="text-gray-500 text-sm">No expenses recorded yet</p>
              <Link href="/accountant/expenses" className="text-xs text-red-400 hover:underline">Add first expense →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((ex: any) => (
                <div key={ex.id} className="flex justify-between items-center p-4 bg-black/40 rounded-xl border border-white/5 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                      <ArrowDownRight size={16} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">{ex.description}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {ex.events?.event_name ?? 'General'} · {new Date(ex.date).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-red-400">₹{Number(ex.amount).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/accountant/expenses" className="flex items-center justify-between w-full text-left px-5 py-4 bg-black/40 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 rounded-xl transition-all border border-white/5 font-medium group">
              <span>+ Add Expense</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </Link>
            <Link href="/accountant/income" className="flex items-center justify-between w-full text-left px-5 py-4 bg-black/40 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 rounded-xl transition-all border border-white/5 font-medium group">
              <span>+ Record Income</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </Link>
            <Link href="/accountant/stock" className="flex items-center justify-between w-full text-left px-5 py-4 bg-black/40 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400 rounded-xl transition-all border border-white/5 font-medium group">
              <span>+ Add Stock Item</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </Link>
            <Link href="/accountant/reports" className="flex items-center justify-between w-full text-left px-5 py-4 bg-black/40 hover:bg-white/10 rounded-xl transition-all border border-white/5 font-medium group">
              <span>View Reports</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
