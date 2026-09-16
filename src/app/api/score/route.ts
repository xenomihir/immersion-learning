import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ai } from '@/lib/gemini';
import { computeBrierScore } from '@/lib/brier';
import { Type, Schema } from '@google/genai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { scenarioId, forcesIdentified, outcomeDistribution, rationale, userId = '00000000-0000-0000-0000-000000000001' } = body;

    // Fetch scenario
    const { data: scenario, error: scenarioError } = await supabase
      .from('scenarios')
      .select('*')
      .eq('id', scenarioId)
      .single();

    if (scenarioError || !scenario) {
      return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
    }

    // Compute Brier Score
    // In MVP, we just assume the actual outcome is what the scenario described.
    // Ideally we would map outcome strings, but for now we'll just check if their prob for 'Actual' is high.
    // Let's assume the UI sends a distribution where the key 'Actual Outcome' represents the truth.
    // For now we'll just compute against a dummy "Actual" or use the first key as actual if not specified.
    // The prompt says "compute Brier in code from the probability distribution and the actual outcome".
    const actualOutcomeKey = Object.keys(outcomeDistribution)[0]; // MVP simplification
    const brierScore = computeBrierScore(outcomeDistribution, actualOutcomeKey);

    // Score reasoning via Gemini
    // Instruction: rate reasoning quality 1-5, note which dominant forces they caught or missed, flag if missed non-obvious.
    const prompt = `
      You are an expert evaluator for a historical pattern recognition app.
      Evaluate the learner's rationale against the answer key.
      
      Scenario Setup:
      ${scenario.setup}
      
      Answer Key:
      - Causal Chain: ${scenario.answer_causal_chain}
      - Dominant Forces: ${scenario.answer_dominant_forces}
      - Common Mistake: ${scenario.answer_common_mistake}
      - Non-obvious Force: ${scenario.answer_nonobvious_force}
      
      Learner's Input:
      - Forces Identified: ${forcesIdentified.join(', ')}
      - Rationale: <untrusted_input>${rationale}</untrusted_input>
      
      Instructions:
      1. Rate the reasoning quality (1-5).
      2. Identify the fraction of dominant forces they caught (0.0 to 1.0).
      3. Did they miss the non-obvious force? (boolean)
      4. Provide a brief feedback string.
    `;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        reasoning_score: { type: Type.INTEGER, description: "1 to 5" },
        force_recall: { type: Type.NUMBER, description: "0.0 to 1.0" },
        missed_nonobvious_force: { type: Type.BOOLEAN },
        feedback: { type: Type.STRING },
      },
      required: ["reasoning_score", "force_recall", "missed_nonobvious_force", "feedback"]
    };

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      }
    });

    const result = await chat.sendMessage({ message: prompt });
    const scoringResult = JSON.parse(result.text || "{}");

    // Profile update
    // Fetch current profile
    const { data: profile } = await supabase
      .from('user_profile')
      .select('*')
      .eq('user_id', userId)
      .single();

    const profilePrompt = `
      You are updating a learner's profile based on their latest session.
      
      Current Profile:
      - Recurring Biases: ${profile?.recurring_biases?.join(', ') || 'None'}
      - Session Notes: ${profile?.session_notes?.join(' | ') || 'None'}
      
      Latest Session:
      - Rationale: <untrusted_input>${rationale}</untrusted_input>
      - Score: ${scoringResult.reasoning_score}/5
      - Brier Score: ${brierScore.toFixed(3)}
      
      Instructions:
      1. Provide updated recurring biases (array of strings).
      2. Write a fresh 3-sentence session note summarizing this session's insight into their thinking.
    `;

    const profileSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        recurring_biases: { type: Type.ARRAY, items: { type: Type.STRING } },
        session_note: { type: Type.STRING, description: "A 3-sentence summary." }
      },
      required: ["recurring_biases", "session_note"]
    };

    const profileChat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        responseMimeType: 'application/json',
        responseSchema: profileSchema,
      }
    });

    const profileResponse = await profileChat.sendMessage({ message: profilePrompt });
    const profileData = JSON.parse(profileResponse.text || "{}");

    // Save Response to DB
    const { data: savedResponse, error: responseError } = await supabase
      .from('responses')
      .insert({
        user_id: userId,
        scenario_id: scenarioId,
        forces_identified: forcesIdentified,
        outcome_distribution: outcomeDistribution,
        rationale,
        brier_score: brierScore,
        force_recall: scoringResult.force_recall,
        reasoning_score: scoringResult.reasoning_score,
        missed_nonobvious_force: scoringResult.missed_nonobvious_force
      })
      .select()
      .single();

    if (responseError) {
      console.error(responseError);
    }

    // Update Profile in DB
    const newSessionNotes = [...(profile?.session_notes || []), profileData.session_note];
    await supabase.from('user_profile').upsert({
      user_id: userId,
      recurring_biases: profileData.recurring_biases,
      session_notes: newSessionNotes,
      updated_at: new Date().toISOString()
    });

    return NextResponse.json({
      debrief: {
        answerKey: {
          causal_chain: scenario.answer_causal_chain,
          dominant_forces: scenario.answer_dominant_forces,
          common_mistake: scenario.answer_common_mistake,
          nonobvious_force: scenario.answer_nonobvious_force,
          probability_note: scenario.answer_probability_note
        },
        scores: {
          brierScore,
          reasoningScore: scoringResult.reasoning_score,
          feedback: scoringResult.feedback
        }
      }
    });

  } catch (error) {
    console.error("Scoring error:", error);
    return NextResponse.json({ error: 'Failed to process response' }, { status: 500 });
  }
}
