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
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }
  
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ title, priority, status: 'pending', user_id: user.id }])
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

// Subtask management functions
export interface Subtask {
  id: string
  title: string
  parent_task_id: string
  status: 'pending' | 'in-progress' | 'done'
  user_id: string
  created_at: string
  updated_at: string
}

export const getSubtasks = async (parentTaskId: string) => {
  const { data, error } = await supabase
    .from('subtasks')
    .select('*')
    .eq('parent_task_id', parentTaskId)
    .order('created_at', { ascending: true })
  return { data, error }
}

export const createSubtask = async (title: string, parentTaskId: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }
  
  const { data, error } = await supabase
    .from('subtasks')
    .insert([{ title, parent_task_id: parentTaskId, user_id: user.id }])
    .select()
  return { data, error }
}

export const updateSubtaskStatus = async (id: string, status: 'pending' | 'in-progress' | 'done') => {
  const { data, error } = await supabase
    .from('subtasks')
    .update({ status })
    .eq('id', id)
    .select()
  return { data, error }
}

export const deleteSubtask = async (id: string) => {
  const { error } = await supabase
    .from('subtasks')
    .delete()
    .eq('id', id)
  return { error }
}

// Profile management functions
export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export const getProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  return { data, error }
}

export const updateProfile = async (updates: Partial<Profile>) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, ...updates })
    .select()
  return { data, error }
}

export const uploadProfilePicture = async (file: File) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}/avatar.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('profile-pictures')
    .upload(fileName, file, { upsert: true })
  
  if (error) {
    return { data: null, error }
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from('profile-pictures')
    .getPublicUrl(fileName)
  
  return { data: { ...data, publicUrl }, error: null }
}

// AI subtask generation
export const generateSubtasks = async (taskTitle: string) => {
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-subtasks`;
  
  const headers = {
    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ taskTitle }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate subtasks');
    }

    const data = await response.json();
    return { data: data.subtasks, error: null };
  } catch (error) {
    return { data: null, error: { message: error.message } };
  }
}