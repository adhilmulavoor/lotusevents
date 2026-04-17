import { Sidebar } from '@/components/Sidebar';
import { LayoutDashboard, Receipt, DollarSign, Package, FileText } from 'lucide-react';

export default function AccountantLayout({ children }: { children: React.ReactNode }) {
  const links = [
    { label: 'Dashboard', href: '/accountant/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Expenses', href: '/accountant/expenses', icon: <Receipt size={20} /> },
    { label: 'Income', href: '/accountant/income', icon: <DollarSign size={20} /> },
    { label: 'Stock', href: '/accountant/stock', icon: <Package size={20} /> },
    { label: 'Reports', href: '/accountant/reports', icon: <FileText size={20} /> },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black">
      <Sidebar title="Lotus" subtitle="Accountant Portal" links={links} />
      <main className="flex-1 overflow-auto bg-gradient-to-br from-black to-zinc-900 border-l border-white/5 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
        {children}
      </main>
    </div>
  );
}
