import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ResponseForm from '@/components/ResponseForm';
import Markdown from '@/components/Markdown';
import Link from 'next/link';
import {
  DIFFICULTY_LABELS,
  cleanTitle,
  normalizeMode,
  modeLabel,
  getDomainDisplayAll,
} from '@/lib/scenario';

export const revalidate = 0;

export default async function ScenarioPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  const [
    { data: scenario, error: scenarioError },
    { data: forces }
  ] = await Promise.all([
    supabase.from('scenarios').select('*').eq('id', resolvedParams.id).single(),
    supabase.from('forces').select('key, name, category, description').order('name', { ascending: true })
  ]);

  if (scenarioError || !scenario) {
    return notFound();
  }

  const userId = '00000000-0000-0000-0000-000000000001';
  const { data: existingResponse } = await supabase
    .from('responses')
    .select('id')
    .eq('user_id', userId)
    .eq('scenario_id', resolvedParams.id)
    .limit(1);

  const hasCompleted = existingResponse && existingResponse.length > 0;
  const mode = normalizeMode(scenario.mode);
  const diff = DIFFICULTY_LABELS[scenario.difficulty];

  return (
    <div className="flex flex-col gap-stack-lg max-w-[760px] mx-auto w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-ui-label-sm text-ui-label-sm text-on-surface-variant">
        <Link href="/" className="hover:text-primary transition-colors">Dashboard</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-primary">{cleanTitle(scenario.title)}</span>
      </div>

      {/* Header */}
      <section className="flex flex-col gap-stack-md">
        <header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-ui-label-sm text-ui-label-sm text-crimson-accent uppercase tracking-widest font-semibold">
              {scenario.date} · {scenario.geography}
            </span>
            <span className={`difficulty-${scenario.difficulty} px-2 py-0.5 rounded font-ui-label-sm text-ui-label-sm`}>
              {diff?.label || `Lvl ${scenario.difficulty}`}
            </span>
            <span className={`${mode === 'focused' ? 'mode-focused' : 'mode-immersive'} px-2 py-0.5 rounded font-ui-label-sm text-ui-label-sm flex items-center gap-1`}>
              <span className="material-symbols-outlined text-[12px]">{mode === 'focused' ? 'target' : 'landscape'}</span>
              {modeLabel(scenario.mode)}
            </span>
            {scenario.domain_tags?.length > 0 && (
              <span className="px-2 py-0.5 bg-parchment-surface border border-cobalt-accent/30 text-cobalt-accent font-ui-label-sm text-ui-label-sm rounded flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">category</span>
                {getDomainDisplayAll(scenario.domain_tags)}
              </span>
            )}
          </div>
          <h2 className="font-display-lg text-display-lg text-primary leading-tight">{cleanTitle(scenario.title)}</h2>
        </header>

        {/* Briefing — comprehensive, structured read */}
        <article className="bg-parchment-surface/50 border border-subtle rounded-xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-subtle">
            <span className="material-symbols-outlined text-secondary text-[20px]">menu_book</span>
            <p className="font-ui-label-sm text-ui-label-sm uppercase tracking-widest text-on-surface-variant">The Briefing</p>
          </div>
          <Markdown content={scenario.setup} />
        </article>

        <div className="bg-slate-deep p-6 rounded-lg mt-2 text-on-primary">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-gold-accent text-[20px]">emoji_objects</span>
            <p className="font-ui-label-bold text-ui-label-bold">The Imperative</p>
          </div>
          <p className="font-body-md text-body-md text-inverse-on-surface leading-relaxed">
            Reason it forward across <strong className="text-on-primary">three horizons — roughly 6 months, 2 years, and 10 years</strong>.
            Trace the causal chain step by step, name the forces driving each turn, decide which is the
            non-obvious one most analysts miss, and commit to a probability for the historical outcome before you see the record.
          </p>
        </div>
      </section>

      {/* Completed notice */}
      {hasCompleted && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-center gap-3">
          <span className="material-symbols-outlined text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <div>
            <p className="font-ui-label-bold text-ui-label-bold text-green-800">You&apos;ve already completed this scenario.</p>
            <p className="font-ui-label-md text-ui-label-md text-green-700">You can submit again to improve your score, or <Link href={`/scenario/${resolvedParams.id}/debrief`} className="underline font-bold">view your previous debrief</Link>.</p>
          </div>
        </div>
      )}

      {/* Interaction Area */}
      <section className="flex flex-col gap-stack-lg bg-surface p-6 border border-subtle rounded-lg">
        <ResponseForm scenarioId={scenario.id} forces={forces || []} />
      </section>
    </div>
  );
}
