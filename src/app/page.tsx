import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  DIFFICULTY_LABELS,
  TIME_PERIODS,
  cleanTitle,
  normalizeMode,
  modeLabel,
  getDomainDisplay,
  getScenarioCover,
  getPreview,
  getTimePeriodKey,
} from '@/lib/scenario';

export const revalidate = 0;

type SP = {
  mode?: string;
  difficulty?: string;
  country?: string;
  period?: string;
};

export default async function Home({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const activeMode = (sp.mode || 'all').toLowerCase();
  const activeDifficulty = sp.difficulty || 'all';
  const activeCountry = sp.country || 'all';
  const activePeriod = sp.period || 'all';

  // Pull everything once (small dataset) and filter in-memory so we can
  // also derive the available filter options from the full library.
  const { data: allScenarios, error } = await supabase
    .from('scenarios')
    .select('*')
    .order('difficulty', { ascending: true });

  // User stats
  const userId = '00000000-0000-0000-0000-000000000001';
  const { data: responses } = await supabase
    .from('responses')
    .select('brier_score, reasoning_score, scenario_id')
    .eq('user_id', userId);

  const completedCount = responses?.length || 0;
  let avgBrier = 0;
  let avgReasoning = 0;
  if (responses && responses.length > 0) {
    const validBrier = responses.filter(r => r.brier_score !== null).map(r => Number(r.brier_score));
    const validReasoning = responses.filter(r => r.reasoning_score !== null).map(r => Number(r.reasoning_score));
    if (validBrier.length > 0) avgBrier = validBrier.reduce((a, b) => a + b, 0) / validBrier.length;
    if (validReasoning.length > 0) avgReasoning = validReasoning.reduce((a, b) => a + b, 0) / validReasoning.length;
  }
  const completedIds = new Set(responses?.map(r => r.scenario_id) || []);

  if (error) {
    return <div className="p-8 text-error">Failed to load scenarios.</div>;
  }

  const library = allScenarios || [];

  // Derive filter option lists from the full library.
  const countries = Array.from(new Set(library.map(s => s.geography).filter(Boolean))).sort();
  const availablePeriods = TIME_PERIODS.filter(p =>
    library.some(s => getTimePeriodKey(s.date) === p.key)
  );

  // Apply all active filters.
  const scenarios = library.filter(s => {
    if (activeMode !== 'all' && normalizeMode(s.mode) !== activeMode) return false;
    if (activeDifficulty !== 'all' && String(s.difficulty) !== activeDifficulty) return false;
    if (activeCountry !== 'all' && s.geography !== activeCountry) return false;
    if (activePeriod !== 'all' && getTimePeriodKey(s.date) !== activePeriod) return false;
    return true;
  });

  // Helper to build a URL that preserves the other active filters.
  const buildHref = (patch: Partial<SP>) => {
    const next = {
      mode: activeMode,
      difficulty: activeDifficulty,
      country: activeCountry,
      period: activePeriod,
      ...patch,
    };
    const qs = Object.entries(next)
      .filter(([, v]) => v && v !== 'all')
      .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
      .join('&');
    return qs ? `/?${qs}` : '/';
  };

  const pill = (active: boolean) =>
    `px-3 py-1 rounded font-ui-label-sm text-ui-label-sm transition-colors border ${
      active
        ? 'bg-primary text-on-primary border-primary'
        : 'bg-parchment-surface text-on-surface border-subtle hover:bg-surface-variant'
    }`;

  const immersiveCount = library.filter(s => normalizeMode(s.mode) === 'immersive').length;

  return (
    <>
      {/* Analyst Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-stack-md mb-stack-lg">
        <div className="lg:col-span-1 bg-parchment-surface border border-subtle rounded-lg p-5 card-hover">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-cobalt-accent text-[20px]">analytics</span>
            <span className="font-ui-label-sm text-ui-label-sm text-on-surface-variant uppercase tracking-widest">Brier Score</span>
          </div>
          <span className="font-display-lg text-[36px] text-primary block">{completedCount > 0 ? avgBrier.toFixed(3) : '---'}</span>
          <span className="font-ui-label-sm text-ui-label-sm text-on-surface-variant">Closer to 0 is better</span>
        </div>
        <div className="lg:col-span-1 bg-parchment-surface border border-subtle rounded-lg p-5 card-hover">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-gold-accent text-[20px]">military_tech</span>
            <span className="font-ui-label-sm text-ui-label-sm text-on-surface-variant uppercase tracking-widest">Avg. Score</span>
          </div>
          <span className="font-display-lg text-[36px] text-primary block">{completedCount > 0 ? avgReasoning.toFixed(0) : '---'}</span>
          <span className="font-ui-label-sm text-ui-label-sm text-on-surface-variant">Reasoning Quality</span>
        </div>
        <div className="lg:col-span-1 bg-parchment-surface border border-subtle rounded-lg p-5 card-hover">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-crimson-accent text-[20px]">explore</span>
            <span className="font-ui-label-sm text-ui-label-sm text-on-surface-variant uppercase tracking-widest">Cleared</span>
          </div>
          <span className="font-display-lg text-[36px] text-primary block">{completedCount}</span>
          <span className="font-ui-label-sm text-ui-label-sm text-on-surface-variant">Scenarios Completed</span>
        </div>
        <div className="lg:col-span-1 bg-parchment-surface border border-subtle rounded-lg p-5 card-hover">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-secondary text-[20px]">trending_up</span>
            <span className="font-ui-label-sm text-ui-label-sm text-on-surface-variant uppercase tracking-widest">Level</span>
          </div>
          <span className="font-display-lg text-[36px] text-primary block">{completedCount >= 10 ? 'Expert' : completedCount >= 5 ? 'Advanced' : completedCount >= 2 ? 'Developing' : 'Foundation'}</span>
          <span className="font-ui-label-sm text-ui-label-sm text-on-surface-variant">Analyst Rank</span>
        </div>
      </div>

      {/* Header & Mode Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-stack-md border-b border-subtle pb-stack-sm">
        <div>
          <h2 className="font-display-lg text-display-lg text-primary tracking-tight">Active Junctions</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Select a historical pivot point to begin your analysis.
          </p>
        </div>

        {/* Mode Toggle Buttons */}
        <div className="flex gap-3 mt-4 md:mt-0">
          <Link
            href={buildHref({ mode: 'all' })}
            className={`px-5 py-2.5 rounded font-ui-label-bold text-ui-label-bold transition-all duration-200 border ${
              activeMode === 'all' ? 'bg-primary text-on-primary border-primary shadow-md' : 'bg-parchment-surface text-primary border-subtle hover:bg-surface-variant'
            }`}
          >
            <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">view_list</span>All</span>
          </Link>
          <Link
            href={buildHref({ mode: 'focused' })}
            className={`px-5 py-2.5 rounded font-ui-label-bold text-ui-label-bold transition-all duration-200 border ${
              activeMode === 'focused' ? 'mode-focused border-cobalt-accent shadow-md' : 'bg-parchment-surface text-cobalt-accent border-subtle hover:bg-surface-variant'
            }`}
          >
            <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">target</span>Focused</span>
          </Link>
          <Link
            href={buildHref({ mode: 'immersive' })}
            className={`px-5 py-2.5 rounded font-ui-label-bold text-ui-label-bold transition-all duration-200 border ${
              activeMode === 'immersive' ? 'mode-immersive border-crimson-accent shadow-md' : 'bg-parchment-surface text-crimson-accent border-subtle hover:bg-surface-variant'
            }`}
          >
            <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">landscape</span>Immersive</span>
          </Link>
        </div>
      </div>

      {/* ── Filters ───────────────────────────────────────── */}
      <div className="flex flex-col gap-3 mb-stack-md bg-parchment-surface/60 border border-subtle rounded-lg p-4">
        {/* Difficulty */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-ui-label-sm text-ui-label-sm text-on-surface-variant w-24 shrink-0 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">signal_cellular_alt</span>Difficulty
          </span>
          <Link href={buildHref({ difficulty: 'all' })} className={pill(activeDifficulty === 'all')}>All</Link>
          {Object.entries(DIFFICULTY_LABELS).map(([lvl, info]) => (
            <Link key={lvl} href={buildHref({ difficulty: lvl })} className={pill(activeDifficulty === lvl)}>
              {info.label}
            </Link>
          ))}
        </div>

        {/* Country */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-ui-label-sm text-ui-label-sm text-on-surface-variant w-24 shrink-0 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">public</span>Country
          </span>
          <Link href={buildHref({ country: 'all' })} className={pill(activeCountry === 'all')}>All</Link>
          {countries.map(c => (
            <Link key={c} href={buildHref({ country: c })} className={pill(activeCountry === c)}>{c}</Link>
          ))}
        </div>

        {/* Time Period */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-ui-label-sm text-ui-label-sm text-on-surface-variant w-24 shrink-0 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">schedule</span>Time Period
          </span>
          <Link href={buildHref({ period: 'all' })} className={pill(activePeriod === 'all')}>All</Link>
          {availablePeriods.map(p => (
            <Link key={p.key} href={buildHref({ period: p.key })} className={pill(activePeriod === p.key)}>{p.label}</Link>
          ))}
        </div>
      </div>

      {/* Scenario Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-md">
        {scenarios.map((scenario) => {
          const isCompleted = completedIds.has(scenario.id);
          const diffInfo = DIFFICULTY_LABELS[scenario.difficulty] || { label: '?', description: '' };
          const mode = normalizeMode(scenario.mode);
          return (
            <Link href={`/scenario/${scenario.id}`} key={scenario.id}>
              <article className="group bg-parchment-surface border border-subtle rounded-lg overflow-hidden card-hover flex flex-col h-full cursor-pointer relative">
                {isCompleted && (
                  <div className="absolute top-3 right-3 z-20 bg-green-600 text-white px-2 py-0.5 rounded font-ui-label-sm text-ui-label-sm flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Completed
                  </div>
                )}

                {/* Cover (local, always renders) */}
                <div className="h-40 w-full overflow-hidden relative border-b border-subtle">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getScenarioCover(scenario)}
                    alt={cleanTitle(scenario.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <span className={`difficulty-${scenario.difficulty} font-ui-label-sm text-ui-label-sm px-2 py-0.5 rounded shadow-sm`}>
                      {diffInfo.label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-headline-sm text-[20px] font-semibold text-primary mb-2 group-hover:text-cobalt-accent transition-colors leading-tight">
                    {cleanTitle(scenario.title)}
                  </h3>

                  <p className="font-body-md text-[14px] leading-relaxed text-on-surface-variant line-clamp-2 mb-3 flex-1">
                    {getPreview(scenario.setup, 120)}
                  </p>

                  {/* Badges: mode · country · domain */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className={`px-2 py-0.5 ${mode === 'focused' ? 'mode-focused' : 'mode-immersive'} font-ui-label-sm text-ui-label-sm rounded flex items-center gap-1`}>
                      <span className="material-symbols-outlined text-[12px]">{mode === 'focused' ? 'target' : 'landscape'}</span>
                      {modeLabel(scenario.mode)}
                    </span>
                    <span className="px-2 py-0.5 bg-parchment-base border border-subtle text-secondary font-ui-label-sm text-ui-label-sm rounded flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">public</span>
                      {scenario.geography}
                    </span>
                    <span className="px-2 py-0.5 bg-cobalt-accent/10 border border-cobalt-accent/20 text-cobalt-accent font-ui-label-sm text-ui-label-sm rounded flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">category</span>
                      {getDomainDisplay(scenario.domain_tags)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-t border-subtle pt-3 mt-auto">
                    <div className="flex items-center gap-1 text-on-tertiary-container font-ui-label-sm text-ui-label-sm">
                      <span className="material-symbols-outlined text-[16px]">event</span> {scenario.date}
                    </div>
                    <span className="text-primary font-ui-label-bold text-ui-label-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Enter <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>

      {/* Empty state */}
      {scenarios.length === 0 && (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-[64px] text-outline-variant mb-4">
            {activeMode === 'immersive' && immersiveCount === 0 ? 'hourglass_empty' : 'filter_alt_off'}
          </span>
          <h3 className="font-headline-sm text-headline-sm text-primary mb-2">No scenarios match these filters</h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-4">
            Try widening your selection or clearing the filters.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-primary text-on-primary font-ui-label-bold text-ui-label-bold py-2.5 px-5 rounded hover:bg-slate-deep transition-colors">
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            Reset filters
          </Link>
        </div>
      )}
    </>
  );
}
