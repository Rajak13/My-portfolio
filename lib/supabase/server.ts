import { createClient } from '@supabase/supabase-js'
import { Database } from './types'
import { supabaseConfig, validateServerConfig } from './config'

// Validate configuration on import
validateServerConfig()

const supabaseUrl = supabaseConfig.url!
const supabaseServiceKey = supabaseConfig.serviceRoleKey!

// Server-side client with service role key for admin operations
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Server-side client for authenticated requests
export const createServerClient = () => {
  return createClient<Database>(
    supabaseUrl,
    supabaseConfig.publishableKey!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}