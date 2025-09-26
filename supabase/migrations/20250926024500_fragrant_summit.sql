/*
  # Fix tasks table structure

  1. New Tables
    - Ensure `tasks` table has proper structure with all required columns
    - `id` (uuid, primary key)
    - `title` (text, required)
    - `priority` (text with constraint, default 'medium')
    - `status` (text with constraint, default 'pending')
    - `user_id` (uuid, foreign key to auth.users)
    - `created_at` (timestamp with timezone, default now())
    - `updated_at` (timestamp with timezone, default now())

  2. Security
    - Enable RLS on `tasks` table
    - Add policies for authenticated users to manage their own tasks

  3. Constraints
    - Add check constraints for priority and status values
    - Add foreign key constraint to auth.users table

  4. Triggers
    - Add trigger to automatically update updated_at column
*/

-- Drop existing table if it exists to recreate with proper structure
DROP TABLE IF EXISTS public.tasks CASCADE;

-- Create the tasks table with proper structure
CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  priority text DEFAULT 'medium'::text NOT NULL,
  status text DEFAULT 'pending'::text NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add check constraints for priority and status
ALTER TABLE public.tasks 
ADD CONSTRAINT tasks_priority_check 
CHECK (priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text]));

ALTER TABLE public.tasks 
ADD CONSTRAINT tasks_status_check 
CHECK (status = ANY (ARRAY['pending'::text, 'in-progress'::text, 'done'::text]));

-- Add foreign key constraint to auth.users
ALTER TABLE public.tasks 
ADD CONSTRAINT tasks_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own tasks"
  ON public.tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
  ON public.tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON public.tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON public.tasks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_priority ON public.tasks(priority);
CREATE INDEX idx_tasks_created_at ON public.tasks(created_at DESC);