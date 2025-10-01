/*
  # Fix existing constraint conflicts

  1. Changes
    - Add conditional checks for existing constraints before creating them
    - Ensure foreign key constraints are only created if they don't exist
    - Handle any duplicate constraint issues

  2. Security
    - Maintains existing RLS policies
    - No changes to security model
*/

-- Check and add foreign key constraint for subtasks -> tasks if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'subtasks_parent_task_id_fkey' 
    AND table_name = 'subtasks'
  ) THEN
    ALTER TABLE subtasks 
    ADD CONSTRAINT subtasks_parent_task_id_fkey 
    FOREIGN KEY (parent_task_id) REFERENCES tasks(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Check and add foreign key constraint for subtasks -> users if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'subtasks_user_id_fkey' 
    AND table_name = 'subtasks'
  ) THEN
    ALTER TABLE subtasks 
    ADD CONSTRAINT subtasks_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Check and add foreign key constraint for tasks -> users if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'tasks_user_id_fkey' 
    AND table_name = 'tasks'
  ) THEN
    ALTER TABLE tasks 
    ADD CONSTRAINT tasks_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Check and add foreign key constraint for profiles -> users if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_id_fkey' 
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles 
    ADD CONSTRAINT profiles_id_fkey 
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;