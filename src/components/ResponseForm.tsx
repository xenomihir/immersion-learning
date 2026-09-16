'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Force = { key: string; name: string; category: string; description: string };

export default function ResponseForm({
  scenarioId,
  forces
}: {
  scenarioId: string;
  forces: Force[];
}) {
  const router = useRouter();
  const [selectedForces, setSelectedForces] = useState<string[]>([]);
  const [probA, setProbA] = useState(50);
  const [rationale, setRationale] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleForce = (forceKey: string) => {
    setSelectedForces(prev =>
      prev.includes(forceKey) ? prev.filter(f => f !== forceKey) : [...prev, forceKey]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const outcomeDistribution = {
        'Actual Outcome': probA / 100,
        'Alternative Outcome': (100 - probA) / 100
      };

      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId,
          forcesIdentified: selectedForces,
          outcomeDistribution,
          rationale
        })
      });

      if (!res.ok) throw new Error('Failed to score response');

      const data = await res.json();
      
      // Store debrief data in sessionStorage to pass to next page (simplest for MVP)
      sessionStorage.setItem(`debrief_${scenarioId}`, JSON.stringify(data.debrief));

      router.push(`/scenario/${scenarioId}/debrief`);
    } catch (err) {
      console.error(err);
      alert('An error occurred submitting your response.');
      setLoading(false);
    }
  };

  const getSliderColor = (val: number) => {
    if (val > 75) return 'text-crimson-accent';
    if (val > 40) return 'text-gold-accent';
    return 'text-cobalt-accent';
  };

  const getSliderFillColor = (val: number) => {
    if (val > 75) return 'bg-crimson-accent';
    if (val > 40) return 'bg-gold-accent';
    return 'bg-cobalt-accent';
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-stack-lg">
      
      {/* Force Selection */}
      <div className="flex flex-col gap-stack-sm">
        <label className="font-ui-label-bold text-ui-label-bold text-primary">Identify Primary Historical Forces at Play</label>
        <div className="flex flex-wrap gap-2">
          {forces.map(f => {
            const isSelected = selectedForces.includes(f.key);
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => toggleForce(f.key)}
                title={f.description}
                className={`px-4 py-2 rounded-full font-ui-label-md text-ui-label-md transition-colors ${
                  isSelected 
                    ? 'bg-primary text-on-primary border border-primary' 
                    : 'bg-parchment-surface text-primary border border-subtle hover:bg-surface-variant'
                }`}
              >
                {f.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Probability Slider */}
      <div className="flex flex-col gap-stack-md pt-stack-sm">
        <div className="flex justify-between items-end">
          <label className="font-ui-label-bold text-ui-label-bold text-primary">Probability of Historical Outcome</label>
          <span className={`font-headline-sm text-headline-sm ${getSliderColor(probA)}`} id="prob-value">{probA}%</span>
        </div>
        <div className="relative pt-4 pb-2">
          <div className={`slider-fill ${getSliderFillColor(probA)}`} id="slider-fill" style={{ width: `${probA}%` }}></div>
          <input 
            className="w-full relative z-10" 
            id="prob-slider" 
            max="100" 
            min="0" 
            type="range" 
            value={probA}
            onChange={e => setProbA(Number(e.target.value))}
          />
          <div className="flex justify-between mt-2 font-ui-label-sm text-ui-label-sm text-on-surface-variant">
            <span>0% (Alternative)</span>
            <span>100% (Historical)</span>
          </div>
        </div>
      </div>

      {/* Rationale Input */}
      <div className="flex flex-col gap-stack-sm pt-stack-sm">
        <label className="font-ui-label-bold text-ui-label-bold text-primary" htmlFor="rationale">Strategic Rationale</label>
        <p className="font-ui-label-sm text-ui-label-sm text-on-surface-variant">Justify your assessment based on the historical context and selected forces.</p>
        <textarea
          id="rationale"
          required
          rows={5}
          value={rationale}
          onChange={e => setRationale(e.target.value)}
          className="w-full bg-parchment-surface border-0 border-l-2 border-secondary focus:ring-0 focus:outline-none p-4 font-body-md text-body-md text-on-surface resize-y rounded-r-DEFAULT"
          placeholder="Begin drafting your analysis..."
        />
      </div>

      {/* Action Button */}
      <div className="mt-stack-sm flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-on-primary font-ui-label-bold text-ui-label-bold py-3 px-8 rounded hover:bg-slate-deep transition-colors shadow-[0_12px_24px_rgba(0,0,0,0.04)] hover:shadow-none transform hover:translate-y-px disabled:opacity-50"
        >
          {loading ? 'Scoring Analysis...' : 'Submit & See Answer Key'}
        </button>
      </div>

    </form>
  );
}
