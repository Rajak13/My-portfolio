// Supabase configuration and validation
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
} as const

// Validate required environment variables
export function validateSupabaseConfig() {
  const errors: string[] = []

  if (!supabaseConfig.url) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is required')
  }

  if (!supabaseConfig.publishableKey) {
    errors.push('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY is required')
  }

  if (errors.length > 0) {
    throw new Error(`Supabase configuration error:\n${errors.join('\n')}`)
  }
}

// Validate server-side configuration
export function validateServerConfig() {
  validateSupabaseConfig()
  
  if (!supabaseConfig.serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for server-side operations')
  }
}

// Storage bucket names
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  MEDIA: 'media',
} as const

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  AVATAR: 5 * 1024 * 1024, // 5MB
  MEDIA: 10 * 1024 * 1024, // 10MB
} as const

// Allowed MIME types
export const ALLOWED_MIME_TYPES = {
  IMAGES: [
    'image/jpeg',
    'image/png', 
    'image/webp',
    'image/gif',
    'image/svg+xml'
  ],
  AVATARS: [
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
} as const