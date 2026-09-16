import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import AIPopupCard from '@/components/AIPopupCard';

export const revalidate = 0;

export default async function ProfilePage() {
  const userId = '00000000-0000-0000-0000-000000000001'; // MVP static user id
  
  // Fetch profile
  const { data: profile } = await supabase
    .from('user_profile')
    .select('*')
    .eq('user_id', userId)
    .single();

  // Fetch responses to compute running calibration (average Brier score)
  const { data: responses } = await supabase
    .from('responses')
    .select('*, scenario:scenarios(title, mode, date, difficulty, geography)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  let avgBrierScore = 0;
  if (responses && responses.length > 0) {
    const validScores = responses.filter(r => r.brier_score !== null).map(r => r.brier_score);
    if (validScores.length > 0) {
      avgBrierScore = validScores.reduce((a, b) => a + b, 0) / validScores.length;
    }
  }

  return (
    <>
      <div className="mb-stack-lg">
        <h2 className="font-display-lg text-display-lg text-primary mb-unit tracking-tight">Analytical Profile</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Reviewing your historical reasoning and probabilistic calibration.</p>
      </div>

      {/* Global Metrics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md mb-stack-lg">
        <div className="col-span-1 md:col-span-2 bg-parchment-surface border border-subtle p-stack-md rounded-lg flex flex-col justify-center">
          <p className="font-ui-label-sm text-ui-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Calibration Metric</p>
          <div className="flex items-end gap-4">
            <span className="font-display-lg text-display-lg text-primary">{responses && responses.length > 0 ? avgBrierScore.toFixed(3) : '---'}</span>
            <span className="font-ui-label-bold text-ui-label-bold text-on-surface-variant mb-2">Avg. Brier Score</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-md">Your probabilistic forecasts are highly calibrated compared to historical outcomes. A score closer to 0 indicates perfect accuracy.</p>
        </div>
        <div className="col-span-1 bg-parchment-surface border border-subtle p-stack-md rounded-lg flex flex-col justify-center items-center text-center">
          <p className="font-ui-label-sm text-ui-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Immersion Depth</p>
          <span className="font-display-lg text-display-lg text-primary">{responses?.length || 0}</span>
          <span className="font-ui-label-bold text-ui-label-bold text-on-surface-variant mt-1">Scenarios Completed</span>
        </div>
      </div>

      {/* Detected Biases Layout */}
      <div className="mb-stack-lg">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-sm border-b border-subtle pb-2">Detected Analytical Biases</h3>
          <p className="font-ui-label-md text-ui-label-md text-on-surface-variant mb-4">Patterns identified by the archival AI across your rationale entries.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {profile?.recurring_biases && profile.recurring_biases.length > 0 ? (
              profile.recurring_biases.map((bias: string, idx: number) => (
                <div key={idx} className="bg-error-container/20 border border-error-container p-3 rounded flex gap-3">
                  <span className="material-symbols-outlined text-crimson-accent mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                  <div>
                    <h4 className="font-ui-label-bold text-ui-label-bold text-primary">Potential Bias Detected</h4>
                    <p className="font-ui-label-md text-ui-label-md text-on-surface-variant mt-1">{bias}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-on-surface-variant italic">No strong biases identified yet. Complete more scenarios!</p>
            )}
          </div>
        </div>
      </div>

      {/* Previously Attempted Cases */}
      <div>
        <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-sm border-b border-subtle pb-2">Archival Record</h3>
        <div className="overflow-hidden border border-subtle rounded-lg bg-parchment-surface">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-subtle bg-surface-container-low">
                <th className="p-4 font-ui-label-sm text-ui-label-sm text-on-surface-variant uppercase tracking-wider">Scenario Designation</th>
                <th className="p-4 font-ui-label-sm text-ui-label-sm text-on-surface-variant uppercase tracking-wider w-40">Date Engaged</th>
                <th className="p-4 font-ui-label-sm text-ui-label-sm text-on-surface-variant uppercase tracking-wider w-36">AI Synthesis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-subtle font-body-md text-body-md">
              {responses && responses.length > 0 ? (
                responses.map((response: any, idx: number) => {
                  const reverseSessionNotes = profile?.session_notes ? [...profile.session_notes].reverse() : [];
                  const sessionNote = reverseSessionNotes[idx] || "No session notes available for this analysis.";
                  
                  return (
                    <tr key={response.id} className="hover:bg-parchment-base transition-colors">
                      <td className="p-4 align-top">
                        <span className="font-ui-label-bold text-ui-label-bold text-lg block mb-2 text-primary">{response.scenario.title}</span>
                        <div className="flex gap-2 items-center flex-wrap">
                          <span className="inline-block px-3 py-1 border border-subtle text-on-surface font-ui-label-sm text-[11px] uppercase tracking-wider rounded-full">{response.scenario.mode}</span>
                          <span className="inline-block px-3 py-1 border border-subtle text-on-surface font-ui-label-sm text-[11px] uppercase tracking-wider rounded-full">{response.scenario.difficulty}</span>
                          <span className="inline-block px-3 py-1 border border-subtle text-on-surface font-ui-label-sm text-[11px] uppercase tracking-wider rounded-full">{response.scenario.geography}</span>
                          <span className="inline-block px-3 py-1 border border-subtle text-on-surface font-ui-label-sm text-[11px] uppercase tracking-wider rounded-full">{response.scenario.date}</span>
                        </div>
                      </td>
                      <td className="p-4 align-top font-ui-label-md text-ui-label-md text-on-surface-variant">
                        {new Date(response.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 align-top">
                        <AIPopupCard score={response.reasoning_score} brier={response.brier_score} feedback={sessionNote} />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-on-surface-variant">No completed scenarios found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
