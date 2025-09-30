@@ .. @@
 CREATE TABLE IF NOT EXISTS subtasks (
   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
   title text NOT NULL,
   parent_task_id uuid NOT NULL,
   status text DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'done')),
   user_id uuid NOT NULL,
   created_at timestamptz DEFAULT now(),
   updated_at timestamptz DEFAULT now()
 );
 
-ALTER TABLE subtasks 
-  ADD CONSTRAINT subtasks_parent_task_id_fkey 
-  FOREIGN KEY (parent_task_id) REFERENCES tasks(id) ON DELETE CASCADE;
-
-ALTER TABLE subtasks 
-  ADD CONSTRAINT subtasks_user_id_fkey 
-  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
+-- Add foreign key constraints only if they don't exist
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM information_schema.table_constraints 
+    WHERE constraint_name = 'subtasks_parent_task_id_fkey' 
+    AND table_name = 'subtasks'
+  ) THEN
+    ALTER TABLE subtasks 
+      ADD CONSTRAINT subtasks_parent_task_id_fkey 
+      FOREIGN KEY (parent_task_id) REFERENCES tasks(id) ON DELETE CASCADE;
+  END IF;
+  
+  IF NOT EXISTS (
+    SELECT 1 FROM information_schema.table_constraints 
+    WHERE constraint_name = 'subtasks_user_id_fkey' 
+    AND table_name = 'subtasks'
+  ) THEN
+    ALTER TABLE subtasks 
+      ADD CONSTRAINT subtasks_user_id_fkey 
+      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
+  END IF;
+END $$;