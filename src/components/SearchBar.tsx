'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { cleanTitle } from '@/lib/scenario';

interface ScenarioResult {
  id: string;
  title: string;
  mode: 'focused' | 'immersive' | 'fork';
  difficulty: number;
  domain_tags: string[];
  date: string;
}

const MODE_ICONS: Record<string, string> = {
  focused: 'center_focus_strong',
  immersive: 'public',
  fork: 'fork_right',
};

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ScenarioResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Debounced fetch ─────────────────────────────── */
  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data: ScenarioResult[] = await res.json();
      setResults(data);
      setIsOpen(true);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchResults(value);
    }, 300);
  };

  /* ── Close on outside click ──────────────────────── */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ── Cleanup debounce on unmount ─────────────────── */
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* ── Input ─────────────────────────────────────── */}
      <div className="relative flex items-center">
        <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px] pointer-events-none">
          search
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => {
            if (results.length > 0 || (query.trim() && !isLoading)) {
              setIsOpen(true);
            }
          }}
          placeholder="Search epochs, figures, or junction points..."
          className="w-full bg-parchment-surface border border-subtle rounded-lg py-2 pl-10 pr-4 font-ui-label-md text-ui-label-md text-primary placeholder:text-outline focus:ring-2 focus:ring-cobalt-accent/40 focus:border-cobalt-accent focus:bg-white transition-all outline-none"
        />
        {isLoading && (
          <span className="material-symbols-outlined absolute right-3 text-on-surface-variant text-[18px] animate-spin">
            progress_activity
          </span>
        )}
      </div>

      {/* ── Dropdown ──────────────────────────────────── */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-parchment-surface border border-subtle rounded-lg shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <span className="material-symbols-outlined text-on-surface-variant text-3xl mb-1 block">
                search_off
              </span>
              <p className="font-ui-label-md text-ui-label-md text-on-surface-variant">
                No results found
              </p>
            </div>
          ) : (
            <ul>
              {results.map((scenario) => (
                <li key={scenario.id}>
                  <Link
                    href={`/scenario/${scenario.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-parchment-base transition-colors group border-b border-subtle last:border-b-0"
                  >
                    {/* Mode icon */}
                    <span className="material-symbols-outlined text-cobalt-accent text-[20px] mt-0.5 shrink-0">
                      {MODE_ICONS[scenario.mode] ?? 'article'}
                    </span>

                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <p className="font-headline-sm text-headline-sm text-primary truncate group-hover:text-cobalt-accent transition-colors">
                        {cleanTitle(scenario.title)}
                      </p>

                      {/* Meta row */}
                      <div className="flex items-center gap-2 mt-1">
                        {scenario.date && (
                          <span className="font-ui-label-sm text-ui-label-sm text-on-surface-variant">
                            {scenario.date}
                          </span>
                        )}
                        <span className="font-ui-label-sm text-ui-label-sm text-on-surface-variant capitalize">
                          {scenario.mode}
                        </span>
                        {scenario.difficulty && (
                          <span className="font-ui-label-sm text-ui-label-sm text-on-surface-variant">
                            {'★'.repeat(scenario.difficulty)}
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      {scenario.domain_tags && scenario.domain_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {scenario.domain_tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="font-ui-label-sm text-[11px] px-1.5 py-0.5 rounded bg-cobalt-accent/10 text-cobalt-accent"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
