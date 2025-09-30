/*
# Add vector embeddings support for tasks

1. Extensions
  - Enable pgvector extension for vector similarity search

2. Table Updates
  - Add `embedding` column to tasks table (vector type)
  - Add index for efficient vector similarity search

3. Functions
  - Create function to generate embeddings for task titles
  - Create function to search tasks by similarity
*/

-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to tasks table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'embedding'
  ) THEN
    ALTER TABLE tasks ADD COLUMN embedding vector(384);
  END IF;
END $$;

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS idx_tasks_embedding ON tasks USING ivfflat (embedding vector_cosine_ops);

-- Function to search tasks by embedding similarity
CREATE OR REPLACE FUNCTION search_tasks_by_similarity(
  query_embedding vector(384),
  similarity_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  title text,
  priority text,
  status text,
  user_id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  similarity float
)
LANGUAGE sql
AS $$
  SELECT 
    t.id,
    t.title,
    t.priority,
    t.status,
    t.user_id,
    t.created_at,
    t.updated_at,
    1 - (t.embedding <=> query_embedding) as similarity
  FROM tasks t
  WHERE t.embedding IS NOT NULL
    AND t.user_id = auth.uid()
    AND 1 - (t.embedding <=> query_embedding) > similarity_threshold
  ORDER BY t.embedding <=> query_embedding
  LIMIT match_count;
$$;