import { validateSupabaseConfig, validateServerConfig, STORAGE_BUCKETS, FILE_SIZE_LIMITS } from '../config'

// Mock environment variables
const originalEnv = process.env

beforeEach(() => {
  jest.resetModules()
  process.env = { ...originalEnv }
})

afterAll(() => {
  process.env = originalEnv
})

describe('Supabase Configuration', () => {
  describe('validateSupabaseConfig', () => {
    it('should pass with valid configuration', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
      
      expect(() => validateSupabaseConfig()).not.toThrow()
    })

    it('should throw error when URL is missing', () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
      
      expect(() => validateSupabaseConfig()).toThrow('NEXT_PUBLIC_SUPABASE_URL is required')
    })

    it('should throw error when anon key is missing', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      expect(() => validateSupabaseConfig()).toThrow('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
    })
  })

  describe('validateServerConfig', () => {
    it('should pass with valid server configuration', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'
      
      expect(() => validateServerConfig()).not.toThrow()
    })

    it('should throw error when service role key is missing', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
      delete process.env.SUPABASE_SERVICE_ROLE_KEY
      
      expect(() => validateServerConfig()).toThrow('SUPABASE_SERVICE_ROLE_KEY is required')
    })
  })

  describe('Constants', () => {
    it('should have correct storage bucket names', () => {
      expect(STORAGE_BUCKETS.AVATARS).toBe('avatars')
      expect(STORAGE_BUCKETS.MEDIA).toBe('media')
    })

    it('should have correct file size limits', () => {
      expect(FILE_SIZE_LIMITS.AVATAR).toBe(5 * 1024 * 1024) // 5MB
      expect(FILE_SIZE_LIMITS.MEDIA).toBe(10 * 1024 * 1024) // 10MB
    })
  })
})