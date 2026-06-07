'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, History, Map } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Terrains', href: '/terrains', icon: Map },
    { name: 'Réservations', href: '/reservations', icon: Calendar },
    { name: 'Historique', href: '/historique', icon: History },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-surface z-30 flex flex-col justify-between shadow-[0px_4px_20px_rgba(26,71,49,0.05)]">
      <div>
        {/* Brand */}
        <div className="p-lg flex items-center gap-sm mt-xs">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white font-extrabold text-sm">TB</span>
          </div>
          <span className="font-sans text-[20px] font-bold text-primary tracking-tight">TerraBook</span>
        </div>

        {/* Navigation */}
        <nav className="mt-[32px] space-y-[4px] px-xs">
          {navItems.map((item) => {
            let isActive = false;
            if (item.href === '/') {
              isActive = pathname === '/';
            } else {
              isActive = pathname.startsWith(item.href);
            }

            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-[16px] px-lg py-sm font-sans text-label-md transition-all duration-200 group relative rounded-md ${
                  isActive
                    ? 'text-primary font-bold bg-[#EAF8F0]'
                    : 'text-charcoal hover:bg-[#F7FAF8] hover:text-primary'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-[4px] bg-secondary rounded-full" />
                )}
                <Icon
                  size={20}
                  className={`transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-primary opacity-70 group-hover:opacity-100'
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-lg border-t border-[#ebefed] text-center">
        <p className="text-[12px] font-semibold text-outline">TerraBook © 2026</p>
      </div>
    </aside>
  );
}
