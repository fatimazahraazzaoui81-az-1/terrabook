'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, History, Map } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string>('ADMIN');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserRole(localStorage.getItem('tb_role') || 'ADMIN');
    }
  }, []);

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Terrains', href: '/terrains', icon: Map },
    { name: 'Réservations', href: '/reservations', icon: Calendar },
    { name: 'Historique', href: '/historique', icon: History },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (userRole === 'CLIENT') {
      return item.name === 'Terrains' || item.name === 'Réservations';
    }
    return true;
  });

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
          {filteredNavItems.map((item) => {
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
                className={`flex items-center gap-[16px] px-lg py-sm font-sans text-label-md transition-all duration-200 group relative rounded-md ${isActive
                    ? 'text-primary font-bold bg-[#EAF8F0]'
                    : 'text-charcoal hover:bg-[#F7FAF8] hover:text-primary'
                  }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-[4px] bg-secondary rounded-full" />
                )}
                <Icon
                  size={20}
                  className={`transition-colors duration-200 ${isActive ? 'text-primary' : 'text-primary opacity-70 group-hover:opacity-100'
                    }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-lg border-t border-[#ebefed]">
        <div className="mb-sm">
          <label className="block text-[11px] font-bold text-outline uppercase tracking-widest mb-1">
            Mode Simulation
          </label>
          <select
            className="w-full bg-[#FDFDFD] border border-[#ebefed] rounded-md text-sm p-1.5 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'ADMIN') {
                localStorage.setItem('tb_role', 'ADMIN');
                localStorage.setItem('tb_user_id', 'admin_1');
              } else if (val === 'OWNER_1') {
                localStorage.setItem('tb_role', 'OWNER');
                localStorage.setItem('tb_user_id', 'owner_1');
              } else if (val === 'OWNER_2') {
                localStorage.setItem('tb_role', 'OWNER');
                localStorage.setItem('tb_user_id', 'owner_2');
              } else if (val === 'CLIENT_1') {
                localStorage.setItem('tb_role', 'CLIENT');
                localStorage.setItem('tb_user_id', 'client_1');
              } else if (val === 'CLIENT_2') {
                localStorage.setItem('tb_role', 'CLIENT');
                localStorage.setItem('tb_user_id', 'client_2');
              }
              window.location.reload();
            }}
            defaultValue={
              typeof window !== 'undefined'
                ? localStorage.getItem('tb_user_id') === 'owner_1' ? 'OWNER_1'
                : localStorage.getItem('tb_user_id') === 'owner_2' ? 'OWNER_2'
                : localStorage.getItem('tb_user_id') === 'client_1' ? 'CLIENT_1'
                : localStorage.getItem('tb_user_id') === 'client_2' ? 'CLIENT_2'
                : 'ADMIN'
                : 'ADMIN'
            }
          >
            <option value="ADMIN">Administrateur</option>
            <option value="OWNER_1">Propriétaire 1 (Padel, Foot)</option>
            <option value="OWNER_2">Propriétaire 2 (Tennis, Padel 2)</option>
            <option value="CLIENT_1">Client 1 (Marie)</option>
            <option value="CLIENT_2">Client 2 (Jean)</option>
          </select>
        </div>
        <p className="text-[12px] font-semibold text-outline text-center mt-3">TerraBook © 2026</p>
      </div>
    </aside>
  );
}
