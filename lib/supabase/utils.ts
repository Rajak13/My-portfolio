import { supabase } from './client'
import { supabaseAdmin } from './server'
import type { Database } from './types'

// Storage utilities
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File,
  options?: { upsert?: boolean }
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, options)
  
  if (error) throw error
  return data
}

export const deleteFile = async (bucket: string, path: string) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])
  
  if (error) throw error
}

export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}

// Database utilities
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

// Admin utilities (server-side only)
export const createUserProfile = async (
  userId: string,
  displayName: string,
  role: 'admin' | 'editor' | 'author' = 'author'
) => {
  const profileData: Database['public']['Tables']['profiles']['Insert'] = {
    id: userId,
    display_name: displayName,
    role
  }
  
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .insert(profileData as any)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Content utilities
export const getPublishedProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      profiles:created_by (
        display_name,
        avatar_url
      )
    `)
    .eq('published', true)
    .order('published_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const getPublishedPosts = async (language?: 'en' | 'ne') => {
  let query = supabase
    .from('posts')
    .select(`
      *,
      profiles:created_by (
        display_name,
        avatar_url
      )
    `)
    .eq('published', true)
  
  if (language) {
    query = query.eq('language', language)
  }
  
  const { data, error } = await query.order('published_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const getPublicThemes = async () => {
  const { data, error } = await supabase
    .from('themes')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const getTranslations = async (language: 'en' | 'ne') => {
  const { data, error } = await supabase
    .from('translations')
    .select('key, value')
    .eq('language', language)
  
  if (error) throw error
  
  // Convert to key-value object
  return data.reduce((acc, { key, value }) => {
    acc[key] = value
    return acc
  }, {} as Record<string, string>)
}