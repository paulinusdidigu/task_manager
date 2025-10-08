/*
  # Fix duplicate policy errors

  1. Changes
    - Drop and recreate policies with IF NOT EXISTS checks
    - Ensure policies are created only once

  2. Security
    - Maintains existing RLS policies
    - No changes to security model
*/

-- Drop existing policies if they exist to recreate them properly
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view their own subtasks" ON subtasks;
  DROP POLICY IF EXISTS "Users can insert their own subtasks" ON subtasks;
  DROP POLICY IF EXISTS "Users can update their own subtasks" ON subtasks;
  DROP POLICY IF EXISTS "Users can delete their own subtasks" ON subtasks;
END $$;

-- Recreate policies
CREATE POLICY "Users can view their own subtasks"
  ON subtasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subtasks"
  ON subtasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subtasks"
  ON subtasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subtasks"
  ON subtasks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
