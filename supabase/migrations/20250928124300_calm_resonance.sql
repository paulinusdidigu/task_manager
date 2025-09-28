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