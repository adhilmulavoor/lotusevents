'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, X } from 'lucide-react';

export type SidebarLink = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

interface SidebarProps {
  title: string;
  subtitle: string;
  links: SidebarLink[];
}

export function Sidebar({ title, subtitle, links }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden w-full bg-black/90 backdrop-blur-xl border-b border-white/10 p-4 flex items-center justify-between z-40 sticky top-0">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            {title}
          </h1>
          <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-1">
            {subtitle}
          </span>
        </div>
        <button 
          ref={buttonRef}
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          className="text-white p-2 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/20 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center z-50 relative"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      <div 
        className={`md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40 ${isOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* The Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen z-50
        bg-black/95 md:bg-black/80 backdrop-blur-xl border-r border-white/10 
        flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        w-64 
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 hidden md:block">
          <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent tracking-tighter">
            {title}
          </h1>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">
            {subtitle}
          </p>
        </div>

        <div className="p-6 md:hidden flex justify-between items-center border-b border-white/10">
          <div>
             <h1 className="text-xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent tracking-tighter">
               Menu
             </h1>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {links.map((link) => {
            const trulyActive = pathname === link.href || pathname.startsWith(link.href + '/');

            return (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
                  trulyActive 
                    ? 'bg-emerald-500/10 text-emerald-400 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className={trulyActive ? 'text-emerald-400' : 'text-gray-500'}>
                  {link.icon}
                </div>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link 
            href="/login" 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm text-red-400 hover:bg-red-500/10 group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </Link>
        </div>
      </aside>
    </>
  );
}
