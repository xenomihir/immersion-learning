-- Add ai_feedback column to responses table for persistence
ALTER TABLE responses ADD COLUMN IF NOT EXISTS ai_feedback text;
