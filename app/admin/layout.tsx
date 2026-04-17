import { Sidebar } from '@/components/Sidebar';
import { LayoutDashboard, CalendarDays, KeyRound, Users, DollarSign } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const links = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Events', href: '/admin/events', icon: <CalendarDays size={20} /> },
    { label: 'Controllers', href: '/admin/controllers', icon: <KeyRound size={20} /> },
    { label: 'Members', href: '/admin/members', icon: <Users size={20} /> },
    { label: 'Financial', href: '/admin/financial', icon: <DollarSign size={20} /> },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black">
      <Sidebar title="Lotus" subtitle="Admin Portal" links={links} />
      <main className="flex-1 overflow-auto bg-gradient-to-br from-black to-zinc-900 border-l border-white/5 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
        {children}
      </main>
    </div>
  );
}
