import { Home, History, Car } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const links = [
    { label: 'My Earnings', href: '/worker/dashboard', icon: <Home size={20} /> },
    { label: 'Work History', href: '/worker/history', icon: <History size={20} /> },
    { label: 'Travel (TA)', href: '/worker/ta', icon: <Car size={20} /> },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black">
      <Sidebar title="Lotus" subtitle="My Portal" links={links} />
      <main className="flex-1 overflow-auto bg-gradient-to-br from-black via-zinc-950 to-black border-l border-white/5">
        {children}
      </main>
    </div>
  );
}
