-- Migration: Allow general (non-event) income and expenses

-- 1. Make expenses.event_id nullable so expenses can exist without an event
ALTER TABLE expenses ALTER COLUMN event_id DROP NOT NULL;

-- 2. Create a table for general income not tied to any event
CREATE TABLE IF NOT EXISTS general_income (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  note TEXT
);
