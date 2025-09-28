/*
  # Create subtasks table with task relationship

  1. New Tables
    - `subtasks`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `parent_task_id` (uuid, foreign key to tasks.id)
      - `status` (text, default 'pending')
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `subtasks` table
    - Add policies for authenticated users to manage their own subtasks

  3. Relationships
    - Foreign key to tasks table (CASCADE delete)
    - Foreign key to users table (CASCADE delete)

  4. Indexes
    - Performance indexes on commonly queried columns
*/

CREATE TABLE IF NOT EXISTS subtasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  parent_task_id uuid NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'done')),
  user_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE subtasks 
ADD CONSTRAINT subtasks_parent_task_id_fkey 
FOREIGN KEY (parent_task_id) REFERENCES tasks(id) ON DELETE CASCADE;

ALTER TABLE subtasks 
ADD CONSTRAINT subtasks_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subtasks_parent_task_id ON subtasks(parent_task_id);
CREATE INDEX IF NOT EXISTS idx_subtasks_user_id ON subtasks(user_id);
CREATE INDEX IF NOT EXISTS idx_subtasks_status ON subtasks(status);
CREATE INDEX IF NOT EXISTS idx_subtasks_created_at ON subtasks(created_at DESC);

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subtasks_updated_at
    BEFORE UPDATE ON subtasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();