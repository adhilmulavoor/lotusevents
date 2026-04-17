import { Users, CalendarDays, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getDashboardStats, getRecentEvents } from '@/app/actions/admin';

export default async function AdminDashboard() {
  const [stats, recentEvents] = await Promise.all([
    getDashboardStats(),
    getRecentEvents(),
  ]);

  const statCards = [
    { label: "Today's Events", value: stats.todayEvents, icon: <CalendarDays className="text-blue-400" />, color: 'text-blue-400' },
    { label: 'Total Members', value: stats.totalMembers, icon: <Users className="text-emerald-400" />, color: 'text-emerald-400' },
    { label: 'Total Controllers', value: stats.totalControllers, icon: <Shield className="text-cyan-400" />, color: 'text-cyan-400' },
  ];

  const statusStyle: Record<string, string> = {
    planned: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    ongoing: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    completed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  return (
    <div className="p-6 md:p-12 text-white font-sans max-w-7xl mx-auto space-y-8">

      <header className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Overview of Lotus Events operations.</p>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <p className="text-sm text-gray-400 font-medium mb-1">{stat.label}</p>
              <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 relative z-10 group-hover:scale-110 transition-transform">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Recent Events */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Recent Events
            </h2>
            <Link href="/admin/events" className="text-xs text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {recentEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <CalendarDays className="text-gray-600" size={32} />
              <p className="text-gray-500 text-sm">No events yet</p>
              <Link href="/admin/events" className="text-xs text-emerald-400 hover:underline">Create your first event →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEvents.map((ev: any) => (
                <div key={ev.id} className="flex justify-between items-center p-4 bg-black/40 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-colors">
                  <div>
                    <h3 className="font-bold text-white text-sm">{ev.event_name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {ev.location ? ` · ${ev.location}` : ''}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border capitalize ${statusStyle[ev.status] ?? 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                    {ev.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/admin/events" className="flex items-center justify-between w-full text-left px-5 py-4 bg-black/40 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 rounded-xl transition-all border border-white/5 font-medium group">
              <span>+ Create New Event</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </Link>
            <Link href="/admin/members" className="flex items-center justify-between w-full text-left px-5 py-4 bg-black/40 hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-400 rounded-xl transition-all border border-white/5 font-medium group">
              <span>+ Add Member</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </Link>
            <Link href="/admin/controllers" className="flex items-center justify-between w-full text-left px-5 py-4 bg-black/40 hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-400 rounded-xl transition-all border border-white/5 font-medium group">
              <span>+ Add Controller</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </Link>
            <Link href="/admin/members" className="flex items-center justify-between w-full text-left px-5 py-4 bg-black/40 hover:bg-white/10 rounded-xl transition-all border border-white/5 font-medium group">
              <span>View Full Roster</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
