'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FORCE_CATEGORIES } from '@/lib/forces-content';

export default function DebriefPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [debrief, setDebrief] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    
    async function loadDebrief() {
      // First, check sessionStorage for freshly submitted data
      const sessionData = sessionStorage.getItem(`debrief_${id}`);
      if (sessionData) {
        setDebrief(JSON.parse(sessionData));
        setLoading(false);
        return;
      }

      // Otherwise, fetch from Supabase via API (for persistent access)
      try {
        const res = await fetch(`/api/debrief?scenarioId=${id}`);
        if (res.ok) {
          const data = await res.json();
          setDebrief(data.debrief);
        } else {
          // No debrief data found; redirect to scenario
          router.push(`/scenario/${id}`);
          return;
        }
      } catch {
        router.push(`/scenario/${id}`);
        return;
      }
      setLoading(false);
    }

    loadDebrief();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <span className="material-symbols-outlined text-[48px] text-cobalt-accent animate-spin">progress_activity</span>
        <p className="font-ui-label-md text-ui-label-md text-on-surface-variant">Compiling your analysis results...</p>
      </div>
    );
  }

  if (!debrief) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <span className="material-symbols-outlined text-[48px] text-on-surface-variant">info</span>
        <p className="font-ui-label-md text-ui-label-md text-on-surface-variant">No debrief data found. Complete the scenario first.</p>
      </div>
    );
  }

  const { answerKey, scores } = debrief;

  return (
    <div className="flex flex-col gap-stack-lg max-w-[720px] mx-auto w-full">
      <div className="mb-stack-sm">
        <h2 className="font-display-lg text-display-lg text-primary mb-unit tracking-tight">Scenario Debrief</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">How well did you calibrate and reason?</p>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
        <div className="bg-parchment-surface border border-subtle p-6 rounded-lg card-hover flex flex-col justify-center items-center text-center">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-cobalt-accent text-[20px]">analytics</span>
            <span className="font-ui-label-sm text-ui-label-sm text-on-surface-variant uppercase tracking-wider">Brier Score</span>
          </div>
          <span className="font-display-lg text-[48px] text-primary">{Number(scores.brierScore).toFixed(3)}</span>
          <span className="font-ui-label-bold text-ui-label-bold text-on-surface-variant mt-1">Closer to 0 is better</span>
        </div>
        <div className="bg-parchment-surface border border-subtle p-6 rounded-lg card-hover flex flex-col justify-center items-center text-center">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-gold-accent text-[20px]">military_tech</span>
            <span className="font-ui-label-sm text-ui-label-sm text-on-surface-variant uppercase tracking-wider">Reasoning Grade</span>
          </div>
          <span className="font-display-lg text-[48px] text-primary">{scores.reasoningScore}<span className="text-body-lg text-secondary">/5</span></span>
          <span className="font-ui-label-bold text-ui-label-bold text-on-surface-variant mt-1">Evaluated by Curator AI</span>
        </div>
      </div>

      {/* AI Feedback */}
      <div className="bg-parchment-surface border-l-4 border-cobalt-accent p-6 rounded-r-lg">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-cobalt-accent">psychology</span>
          <h3 className="font-ui-label-bold text-ui-label-bold text-primary">AI Feedback on Your Rationale</h3>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed italic">
          &ldquo;{scores.feedback}&rdquo;
        </p>
      </div>

      {/* Answer Key */}
      <div className="mt-stack-md pt-stack-lg border-t border-subtle">
        <h2 className="font-headline-md text-headline-md text-primary mb-stack-md">The Historical Record</h2>
        
        <div className="space-y-4">
          <div className="bg-parchment-surface p-5 border border-subtle rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[18px] text-secondary">timeline</span>
              <h3 className="font-ui-label-sm text-ui-label-sm uppercase tracking-widest text-on-surface-variant">Causal Chain</h3>
            </div>
            <p className="font-body-md text-body-md text-on-surface leading-relaxed">{answerKey.causal_chain}</p>
          </div>
          
          <div className="bg-parchment-surface p-5 border border-subtle rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[18px] text-cobalt-accent">hub</span>
              <h3 className="font-ui-label-sm text-ui-label-sm uppercase tracking-widest text-on-surface-variant">Dominant Forces</h3>
            </div>
            <p className="font-body-md text-body-md text-on-surface leading-relaxed">
              {answerKey.dominant_forces.split(',').map((s: string) => s.trim()).map((key: string) => {
                const allForces = FORCE_CATEGORIES.flatMap(c => c.forces);
                const f = allForces.find(f => f.name.toLowerCase().replace(/[\s-]/g, '_') === key.toLowerCase() || f.name === key);
                return f ? f.name : key;
              }).join(', ')}
            </p>
          </div>

          <div className="bg-error-container/20 border border-error-container p-5 rounded-lg flex gap-3">
            <span className="material-symbols-outlined text-crimson-accent mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            <div>
              <h3 className="font-ui-label-bold text-ui-label-bold text-primary mb-1">What Most People Get Wrong</h3>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed">{answerKey.common_mistake}</p>
            </div>
          </div>

          <div className="bg-secondary-container/20 border border-secondary-container p-5 rounded-lg flex gap-3">
            <span className="material-symbols-outlined text-secondary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            <div>
              <h3 className="font-ui-label-bold text-ui-label-bold text-primary mb-1">The Non-Obvious Force</h3>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed">{answerKey.nonobvious_force}</p>
            </div>
          </div>
          
          {answerKey.probability_note && (
            <div className="border-l-2 border-subtle pl-4 py-2 opacity-80 mt-stack-sm">
              <h3 className="font-ui-label-sm text-ui-label-sm uppercase tracking-widest text-on-surface-variant mb-1">Probability Note</h3>
              <p className="font-body-md text-[14px] text-on-surface-variant italic leading-relaxed">{answerKey.probability_note}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <div className="mt-stack-lg flex justify-center gap-4">
        <button
          onClick={() => router.push('/')}
          className="bg-parchment-surface text-primary font-ui-label-bold text-ui-label-bold py-3 px-6 rounded border border-subtle hover:bg-surface-variant transition-colors"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => router.push('/profile')}
          className="bg-primary text-on-primary font-ui-label-bold text-ui-label-bold py-3 px-6 rounded hover:bg-slate-deep transition-colors"
        >
          View Updated Profile
        </button>
      </div>
    </div>
  );
}
