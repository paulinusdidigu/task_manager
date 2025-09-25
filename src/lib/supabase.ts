import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      }
    }
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Task management functions
export interface Task {
  id: string
  title: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in-progress' | 'done'
  user_id: string
  created_at: string
  updated_at: string
}

export const getTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

export const createTask = async (title: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ title, priority, status: 'pending' }])
    .select()
  return { data, error }
}

export const updateTaskStatus = async (id: string, status: 'pending' | 'in-progress' | 'done') => {
  const { data, error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', id)
    .select()
  return { data, error }
}

export const updateTaskPriority = async (id: string, priority: 'low' | 'medium' | 'high') => {
  const { data, error } = await supabase
    .from('tasks')
    .update({ priority })
    .eq('id', id)
    .select()
  return { data, error }
}

export const deleteTask = async (id: string) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
  return { error }
}