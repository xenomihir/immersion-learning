'use client';

import Link from 'next/link';
import SearchBar from '@/components/SearchBar';

export default function TopAppBar() {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-parchment-base/90 backdrop-blur-md border-b border-subtle flex justify-between items-center h-16 px-gutter transition-all duration-300" id="top-nav">
      <div className="flex items-center flex-1 hidden md:flex">
        <SearchBar />
      </div>
      <div className="flex items-center gap-3">
        <button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded hover:bg-parchment-surface focus:outline-none focus:ring-1 focus:ring-primary">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded hover:bg-parchment-surface focus:outline-none focus:ring-1 focus:ring-primary">
          <span className="material-symbols-outlined">settings</span>
        </button>

        {/* User profile — moved here from the left sidebar */}
        <Link
          href="/profile"
          className="flex items-center gap-3 pl-3 ml-1 border-l border-subtle group"
        >
          <div className="flex flex-col items-end text-right leading-tight">
            <span className="font-ui-label-md text-ui-label-md text-primary font-semibold group-hover:text-cobalt-accent transition-colors">Mihir</span>
            <span className="font-ui-label-sm text-ui-label-sm text-on-surface-variant">Analyst</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cobalt-accent to-slate-deep flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:ring-2 group-hover:ring-cobalt-accent/30 transition-all">
            M
          </div>
        </Link>
      </div>
    </header>
  );
}
