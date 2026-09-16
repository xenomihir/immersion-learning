'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: 'dashboard' },
    { href: '/learn', label: 'Forces Framework', icon: 'school' },
    { href: '/profile', label: 'Learner Profile', icon: 'person_book' },
  ];

  return (
    <nav className="h-screen w-64 fixed left-0 top-0 bg-slate-deep border-r border-slate-700 flex flex-col py-stack-lg px-gutter z-50 shadow-2xl">
      <div className="mb-stack-lg flex flex-col gap-1">
        <h1 className="font-display-lg text-[24px] font-bold text-white tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined text-cobalt-accent">hourglass_bottom</span>
          Chronos
        </h1>
        <p className="font-ui-label-sm text-ui-label-sm text-slate-400 uppercase tracking-widest pl-8">Archive</p>
      </div>

      <ul className="flex flex-col gap-unit flex-1">
        {navItems.map(item => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-stack-sm py-3 px-4 rounded-lg transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? 'text-white font-bold bg-white/10 shadow-[inset_2px_0_0_0_#2B50AA]'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className={`material-symbols-outlined text-[22px] transition-transform duration-300 ${isActive ? 'scale-110 text-cobalt-accent' : 'group-hover:scale-110'}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
                <span className="font-ui-label-bold text-ui-label-bold tracking-wide">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto pt-stack-lg border-t border-slate-700/50">
        <p className="font-ui-label-sm text-[11px] text-slate-500 uppercase tracking-widest leading-relaxed">
          Intellectual clarity through historical gravity.
        </p>
      </div>
    </nav>
  );
}
