import { createClient } from '@supabase/supabase-js'
import { Database } from './types'
import { supabaseConfig, validateSupabaseConfig } from './config'

// Validate configuration on import
validateSupabaseConfig()

const supabaseUrl = supabaseConfig.url!
const supabasePublishableKey = supabaseConfig.publishableKey!

export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Export a function to create a new client instance
export function createSupabaseClient() {
  return createClient<Database>(supabaseUrl, supabasePublishableKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })
}