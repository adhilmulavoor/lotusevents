-- ============================================================
-- MIGRATION: Add TA Support & Member ID to event_workers
-- Run this in Supabase Dashboard -> SQL Editor
-- ============================================================

-- 1. Add TA (Travel Allowance) columns to event_workers
ALTER TABLE event_workers 
ADD COLUMN IF NOT EXISTS ta_amount DECIMAL(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS has_ta BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Handle member_id column (old schema uses worker_id)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'event_workers' AND column_name = 'member_id'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'event_workers' AND column_name = 'worker_id'
    ) THEN
      ALTER TABLE event_workers RENAME COLUMN worker_id TO member_id;
    ELSE
      ALTER TABLE event_workers ADD COLUMN member_id UUID REFERENCES members(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- 3. Add attendance column to event_workers if not exists
ALTER TABLE event_workers
ADD COLUMN IF NOT EXISTS attendance TEXT DEFAULT 'present';

-- 4. Add member_id to payments table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'payments' AND column_name = 'member_id'
  ) THEN
    ALTER TABLE payments ADD COLUMN member_id UUID REFERENCES members(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ============================================================
-- Verify changes:
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'event_workers' ORDER BY ordinal_position;
-- ============================================================
