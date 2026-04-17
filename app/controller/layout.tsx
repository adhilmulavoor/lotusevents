import { Sidebar } from '@/components/Sidebar';
import { Clock, CheckCircle, Users } from 'lucide-react';

export default function ControllerLayout({ children }: { children: React.ReactNode }) {
  const links = [
    { label: 'Pending', href: '/controller/pending', icon: <Clock size={20} /> },
    { label: 'Completed', href: '/controller/completed', icon: <CheckCircle size={20} /> },
    { label: 'My Team', href: '/controller/team', icon: <Users size={20} /> },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black">
      <Sidebar title="Lotus" subtitle="Controller" links={links} />
      <main className="flex-1 overflow-auto bg-gradient-to-br from-black via-zinc-900 to-black border-l border-white/5">
        {children}
      </main>
    </div>
  );
}
