'use client';

import { useState, useEffect } from 'react';
import { FORCE_CATEGORIES, type Force, type ForceCategory } from '@/lib/forces-content';

type Config = {
  accent: string;
  dot: string;
  badge: string;
  iconBg: string;
  border: string;
  bg: string;
};

const CATEGORY_CONFIG: Record<string, Config> = {
  'Structural / Economic': {
    accent: 'text-cobalt-accent', dot: 'bg-cobalt-accent', badge: 'bg-cobalt-accent/10 text-cobalt-accent',
    iconBg: 'bg-cobalt-accent/10', border: 'border-cobalt-accent/20', bg: 'bg-cobalt-accent/[0.04]',
  },
  'Game-theoretic / Systemic': {
    accent: 'text-crimson-accent', dot: 'bg-crimson-accent', badge: 'bg-crimson-accent/10 text-crimson-accent',
    iconBg: 'bg-crimson-accent/10', border: 'border-crimson-accent/20', bg: 'bg-crimson-accent/[0.04]',
  },
  'Behavioral / Market': {
    accent: 'text-secondary', dot: 'bg-secondary', badge: 'bg-secondary/10 text-secondary',
    iconBg: 'bg-secondary/10', border: 'border-secondary/20', bg: 'bg-secondary/[0.04]',
  },
  'Marketing / Strategy': {
    accent: 'text-gold-accent', dot: 'bg-gold-accent', badge: 'bg-gold-accent/10 text-gold-accent',
    iconBg: 'bg-gold-accent/10', border: 'border-gold-accent/25', bg: 'bg-gold-accent/[0.06]',
  },
};

export default function ForcesExplorer() {
  const [active, setActive] = useState<{ force: Force; category: ForceCategory } | null>(null);

  // Close on Escape; lock body scroll while the modal is open.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActive(null); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active]);

  const activeConfig = active ? CATEGORY_CONFIG[active.category.name] : null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {FORCE_CATEGORIES.map((category) => {
          const config = CATEGORY_CONFIG[category.name];
          return (
            <div key={category.key} className={`rounded-xl border ${config.border} ${config.bg} overflow-hidden flex flex-col`}>
              {/* Category header */}
              <div className="px-6 py-5 border-b border-subtle/40">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${config.iconBg} flex items-center justify-center`}>
                    <span className={`material-symbols-outlined ${config.accent} text-[22px]`}>{category.icon}</span>
                  </div>
                  <div>
                    <h3 className={`font-ui-label-bold text-[20px] leading-[28px] ${config.accent}`}>{category.name}</h3>
                    <span className="font-ui-label-sm text-ui-label-sm text-on-surface-variant">{category.forces.length} forces</span>
                  </div>
                </div>
              </div>

              {/* Clickable force cards */}
              <div className="p-4 flex flex-col gap-3 flex-1">
                {category.forces.map((force) => (
                  <button
                    key={force.name}
                    type="button"
                    onClick={() => setActive({ force, category })}
                    className="text-left w-full bg-parchment-surface/80 backdrop-blur-sm border border-subtle/60 rounded-lg p-4 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-subtle hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${config.dot} mt-2.5 shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-ui-label-bold text-ui-label-bold text-primary">{force.name}</h4>
                          <span className={`material-symbols-outlined text-[18px] ${config.accent} opacity-0 group-hover:opacity-100 transition-opacity shrink-0`}>open_in_full</span>
                        </div>
                        <p className="font-ui-label-md text-ui-label-md text-on-surface-variant leading-relaxed mt-1">{force.summary}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Detail modal ─────────────────────────────────── */}
      {active && activeConfig && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-deep/50 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div
            className="relative bg-parchment-base border border-subtle rounded-2xl shadow-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className={`px-7 pt-7 pb-6 border-b border-subtle ${activeConfig.bg}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${activeConfig.iconBg} flex items-center justify-center shrink-0`}>
                    <span className={`material-symbols-outlined ${activeConfig.accent} text-[26px]`}>{active.category.icon}</span>
                  </div>
                  <div>
                    <span className={`inline-block font-ui-label-sm text-ui-label-sm px-2 py-0.5 rounded ${activeConfig.badge} mb-1.5`}>
                      {active.category.name}
                    </span>
                    <h3 className="font-ui-label-bold text-[26px] leading-[32px] text-primary">{active.force.name}</h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  aria-label="Close"
                  className="text-on-surface-variant hover:text-primary hover:bg-parchment-surface rounded-lg p-1.5 transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="px-7 py-6 flex flex-col gap-6">
              <div>
                <h4 className="font-ui-label-sm text-ui-label-sm uppercase tracking-widest text-on-surface-variant mb-2 flex items-center gap-2">
                  <span className={`material-symbols-outlined text-[18px] ${activeConfig.accent}`}>description</span>
                  What it is
                </h4>
                <p className="font-body-md text-body-md text-on-surface leading-relaxed">{active.force.description}</p>
              </div>

              <div className={`rounded-xl border ${activeConfig.border} ${activeConfig.bg} p-5`}>
                <h4 className="font-ui-label-sm text-ui-label-sm uppercase tracking-widest text-on-surface-variant mb-2 flex items-center gap-2">
                  <span className={`material-symbols-outlined text-[18px] ${activeConfig.accent}`}>lightbulb</span>
                  The pattern, in miniature
                </h4>
                <p className="font-body-md text-body-md text-on-surface leading-relaxed">{active.force.metaphor}</p>
              </div>

              <p className="font-ui-label-sm text-ui-label-sm text-on-surface-variant italic">
                Spot this same shape inside a scenario — under a totally different costume — and you are doing the core work of the app.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
