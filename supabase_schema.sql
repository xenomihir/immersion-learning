-- Scenarios: the library
CREATE TABLE scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  mode text NOT NULL,                      -- focused | immersive | fork
  domain_tags text[] NOT NULL DEFAULT '{}',
  forces text[] NOT NULL DEFAULT '{}',                  -- from the taxonomy
  difficulty int NOT NULL,                 -- 1-5
  obscurity int NOT NULL,                  -- 1-5
  date text NOT NULL, 
  geography text NOT NULL,
  setup text NOT NULL,                     -- learner-facing, no spoilers
  answer_causal_chain text NOT NULL,
  answer_dominant_forces text NOT NULL,
  answer_common_mistake text NOT NULL,
  answer_nonobvious_force text NOT NULL,
  answer_probability_note text NOT NULL,
  consensus_prob jsonb,           -- optional: expert/crowd probs at the time (from Metaculus/GJOpen)
  status text NOT NULL DEFAULT 'live'                    -- draft | validated | live
);

-- Forces: the taxonomy
CREATE TABLE forces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL
);

-- Responses: every attempt
CREATE TABLE responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid, -- Optional for now, since we may not implement strict auth in step 1 MVP
  scenario_id uuid REFERENCES scenarios(id),
  forces_identified text[] NOT NULL DEFAULT '{}',
  outcome_distribution jsonb NOT NULL,     -- learner's probabilities over outcomes
  rationale text NOT NULL,
  brier_score numeric,
  force_recall numeric,           -- fraction of dominant forces they caught
  reasoning_score numeric,        -- Gemini's 1-5 judgment of rationale quality
  missed_nonobvious_force boolean,
  created_at timestamptz DEFAULT now()
);

-- Profile: the personalization layer
CREATE TABLE user_profile (
  user_id uuid PRIMARY KEY,
  calibration_curve jsonb,        -- over/underconfidence by probability bucket
  force_blindspots jsonb,         -- forces they rarely invoke or consistently miss
  domain_strength jsonb,          -- accuracy by domain
  recurring_biases text[] DEFAULT '{}',        -- e.g. "underweights regulatory risk", "overweights network effects"
  session_notes text[] DEFAULT '{}',           -- rolling 3-sentence summaries
  updated_at timestamptz DEFAULT now()
);

-- RLS Policies for MVP (Allow full access for Anon key to make development easy)
-- Warning: In a real production app, you should lock this down with Auth.
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for anon" ON scenarios FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE forces ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for anon" ON forces FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for anon" ON responses FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for anon" ON user_profile FOR ALL USING (true) WITH CHECK (true);
