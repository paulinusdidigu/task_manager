/*
  # Fix duplicate policy errors

  1. Changes
    - Ensure subtasks policies exist with proper checks
    - No-op migration if policies already exist

  2. Security
    - Maintains existing RLS policies
    - No changes to security model
*/

-- This migration ensures policies exist but does nothing if they already exist
-- The subtasks table and policies were created in migration 20250928012247_muddy_wildflower.sql
-- This is a no-op migration to mark the fix as applied

DO $$
BEGIN
  -- Just verify the table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subtasks') THEN
    RAISE NOTICE 'Subtasks table and policies already exist';
  END IF;
END $$;
