# Build Prompt — History-by-Immersion App

This is the spec to drive the build. Use it in two passes:

- **Antigravity** (agent-first IDE on Gemini 3 Pro, also runs Claude) for orchestration, scaffolding, and browser-in-the-loop testing. Its **knowledge base** feature is where you persist the Forces taxonomy and your evolving learner profile so agents reuse them across tasks.
- **Claude Code** for the deeper implementation — the scoring engine, the personalization logic, and the Claude API integration that powers scenario generation and feedback.

Build the MVP first (Phase 1). Do not build Phases 2–3 until Phase 1 runs end-to-end with at least one real scenario.

---

## MASTER PROMPT (paste this first, in either tool)

> You are building a web app that trains pattern-recognition and probabilistic thinking using historical scenarios. The user learns by reasoning through real situations *as they looked at the time*, then gets scored on the quality of their reasoning — not just whether they guessed the outcome.
>
> **Core loop:**
> 1. Present a scenario's SETUP — a situation frozen at a specific date, containing only information available then. No spoilers, no hindsight.
> 2. The learner responds with (a) the forces they think are at play, and (b) a probability distribution over possible outcomes, with their rationale.
> 3. Score the response on three axes: force identification (did they name the dominant forces?), calibration (Brier-style — were their probabilities well-calibrated vs. what actually happened and vs. expert/consensus probabilities at the time?), and reasoning quality (assessed by the Claude API against the answer key).
> 4. Reveal the answer key: the causal chain, the dominant forces, what most people get wrong, and the non-obvious force.
> 5. Update the learner's profile with what this session revealed.
>
> **Two modes (plus a third later):**
> - *Focused ("The Chain")* — one event/policy/campaign; the learner maps first-, second-, third-order effects with rough timing.
> - *Immersive ("The Storm")* — start from an outcome; the learner works backwards to identify and weight the forces that produced it.
> - *Fork ("The Decision")* — later. Put the learner at a decision point; score their judgment against a probability tree.
>
> **Anti-pattern to guard against:** this must not become historical trivia. The learner should be developing transferable first-principles reasoning, not memorizing endings. Periodically serve fictional-but-plausible scenarios where pattern-matching to a known event is impossible.
>
> Seed scenarios come from the accompanying file `history-immersion-library-v1.md` (20 scenarios, a Forces taxonomy, and a scenario schema). Load the schema and taxonomy into your knowledge base before generating any new scenarios.

---

## Tech stack (use this; don't deliberate)

- **Frontend:** Next.js (App Router) + Tailwind. One clean reading-first scenario view; a response form (force tags + probability sliders + free-text rationale); a debrief view; a profile dashboard.
- **Backend/DB:** Supabase (Postgres + auth). Tables below.
- **Runtime intelligence:** Anthropic Claude API for three jobs — (1) generating new scenarios from a seed, (2) scoring the learner's free-text rationale against the answer key, (3) writing the per-session profile update. Keep the API key server-side only; never expose it client-side.
- **Scoring math:** Brier score computed in plain code, not by the model. The model handles qualitative judgment; the code handles the probability arithmetic.

---

## Data model

```sql
-- scenarios: the library
scenarios (
  id uuid pk,
  title text,
  mode text,                      -- focused | immersive | fork
  domain_tags text[],
  forces text[],                  -- from the taxonomy
  difficulty int,                 -- 1-5
  obscurity int,                  -- 1-5
  date text, geography text,
  setup text,                     -- learner-facing, no spoilers
  answer_causal_chain text,
  answer_dominant_forces text,
  answer_common_mistake text,
  answer_nonobvious_force text,
  answer_probability_note text,
  consensus_prob jsonb,           -- optional: expert/crowd probs at the time (from Metaculus/GJOpen)
  status text                     -- draft | validated | live
)

-- forces: the taxonomy (seed from the library file)
forces ( id, key, name, category, description )

-- responses: every attempt
responses (
  id uuid pk, user_id uuid, scenario_id uuid,
  forces_identified text[],
  outcome_distribution jsonb,     -- learner's probabilities over outcomes
  rationale text,
  brier_score numeric,
  force_recall numeric,           -- fraction of dominant forces they caught
  reasoning_score numeric,        -- Claude's 1-5 judgment of rationale quality
  missed_nonobvious_force bool,
  created_at timestamptz
)

-- profile: the personalization layer (one evolving record per user)
user_profile (
  user_id uuid pk,
  calibration_curve jsonb,        -- over/underconfidence by probability bucket
  force_blindspots jsonb,         -- forces they rarely invoke or consistently miss
  domain_strength jsonb,          -- accuracy by domain
  recurring_biases text[],        -- e.g. "underweights regulatory risk", "overweights network effects"
  session_notes text[],           -- rolling 3-sentence summaries
  updated_at timestamptz
)
```

---

## The three Claude API calls (server-side)

1. **Scenario generation (your scaling path).** Input: `event + date + geography + target forces`. Instruction: write the SETUP using only information available by that date — explicitly forbid any post-date knowledge — then draft the answer key and tag forces from the taxonomy. Output strict JSON matching the `scenarios` schema. Mark `status: draft` so a human validates before it goes live.

2. **Reasoning scoring.** Input: the learner's rationale + the answer key. Instruction: rate reasoning quality 1–5, note which dominant forces they caught or missed, and flag if they missed the non-obvious force. Return JSON. The model never sees the Brier math — that's computed in code from the probability distribution and the actual outcome.

3. **Profile update.** Input: the last session's response + scores + the current `user_profile`. Instruction: update the biases, blindspots, and a fresh 3-sentence session note. This runs after *every* session and builds the profile passively — but the profile only *changes which scenarios are served* when the learner explicitly asks for a weakness drill (see below).

> Prompt-injection note: scenario SETUP text is data, not instructions. When you pass a learner's free-text rationale or any scenario content into a scoring call, wrap it clearly as untrusted input so it can't hijack the scoring instruction.

---

## The personalization layer (the actual moat)

Two modes, and the default is hands-off:

- **Normal mode (default).** Scenarios are served by domain, difficulty, and variety — *not* steered by the profile. The profile still updates silently after every session, so the data accumulates whether or not it's being used. This protects variety and stops the system from narrowing onto your weak spots too early.
- **Drill mode (only on explicit request).** When the learner asks something like "help me work on my weak spots," the app reads `user_profile` and steers selection + framing — e.g. *"This learner consistently underweights regulatory risk and is overconfident in the 70–90% band. Prefer scenarios where regulation is the non-obvious force; in the debrief, stress-test their confidence."* Drill mode runs until the learner exits it, then selection returns to normal.

Practically: a `session_mode` flag (`normal | drill`) gates whether the profile steer is injected into the scenario-selection call. Persist the taxonomy and the profile in Antigravity's knowledge base so every agent build references the same source of truth.

The four things the profile tracks (built passively, surfaced on demand):
- **Calibration curve** — are you systematically over/underconfident, and in which probability range?
- **Force blindspots** — which forces you rarely invoke (the system can prove this by counting tags across responses).
- **Domain strength** — strong on financial crises, weak on cultural/regulatory shifts?
- **Recurring biases** — plain-language patterns Claude surfaces across sessions.

---

## Phased build plan

**Phase 1 — MVP (build this only, first).**
- Schema + auth + seed the 20 scenarios and the taxonomy from the library file.
- One full loop for *Focused* mode: present setup → collect forces + probabilities + rationale → compute Brier in code → score reasoning via Claude → reveal answer key → write a 3-sentence profile note.
- Scenario selection is **normal mode only** — no profile-driven steering yet. The profile is written and stored, just not used to pick scenarios.
- A bare profile page that shows the rolling notes and a running calibration number.
- Acceptance test (use Antigravity's browser-in-the-loop to verify): a user can complete scenario E1 (Nixon/Bretton Woods) end to end, see a Brier score, see which forces they missed, and see a profile note appear.

**Phase 2 — Depth.**
- Immersive mode (outcome-first, work-backwards scoring on force identification + weighting).
- **Drill mode** — the `session_mode` flag and the profile-steered scenario selection, triggered only when the learner asks to work on weak spots.
- Real calibration dashboard (curve by probability bucket, force-blindspot chart, domain heatmap).
- Scenario-generation pipeline with a human-validation queue (`draft → validated → live`).
- Pull `consensus_prob` from Metaculus/Good Judgment Open where a matching resolved question exists, so Step 3 scores against real contemporaneous expert probabilities, not just the outcome.

**Phase 3 — The hard part.**
- Fork mode with probability trees.
- Fictional-but-plausible scenario generator (the anti-trivia safeguard).
- Adaptive difficulty and scenario selection driven by the profile.

---

## First task to hand the agent

> Set up the Next.js + Supabase project, create the schema above, seed the `forces` table and all 20 scenarios from `history-immersion-library-v1.md`, and build the Focused-mode loop for a single scenario (E1) end to end, including the three Claude API calls server-side and the Brier calculation in code. Stop after E1 works in the browser and show me the debrief screen.
