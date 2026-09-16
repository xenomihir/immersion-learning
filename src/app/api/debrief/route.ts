import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scenarioId = searchParams.get('scenarioId');
  const userId = searchParams.get('userId') || '00000000-0000-0000-0000-000000000001';

  if (!scenarioId) {
    return NextResponse.json({ error: 'scenarioId required' }, { status: 400 });
  }

  // Fetch the most recent response for this user and scenario
  const { data: response, error: responseError } = await supabase
    .from('responses')
    .select('*')
    .eq('user_id', userId)
    .eq('scenario_id', scenarioId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (responseError || !response) {
    return NextResponse.json({ error: 'No response found' }, { status: 404 });
  }

  // Fetch the scenario answer key
  const { data: scenario, error: scenarioError } = await supabase
    .from('scenarios')
    .select('answer_causal_chain, answer_dominant_forces, answer_common_mistake, answer_nonobvious_force, answer_probability_note')
    .eq('id', scenarioId)
    .single();

  if (scenarioError || !scenario) {
    return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
  }

  return NextResponse.json({
    debrief: {
      answerKey: {
        causal_chain: scenario.answer_causal_chain,
        dominant_forces: scenario.answer_dominant_forces,
        common_mistake: scenario.answer_common_mistake,
        nonobvious_force: scenario.answer_nonobvious_force,
        probability_note: scenario.answer_probability_note,
      },
      scores: {
        brierScore: response.brier_score,
        reasoningScore: response.reasoning_score,
        feedback: response.ai_feedback || 'AI feedback not available for this session.',
      }
    }
  });
}
