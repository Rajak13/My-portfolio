import { supabase } from '@/lib/supabase/client'
import { AuthError } from '@supabase/supabase-js'

export interface SignInCredentials {
  email: string
  password: string
}

export interface SignUpCredentials extends SignInCredentials {
  displayName: string
}

export interface AuthResult {
  error?: AuthError | Error | null
  data?: unknown
}

export const authUtils = {
  /**
   * Sign in with email and password
   */
  async signInWithEmail({ email, password }: SignInCredentials): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error }
      }

      return { data }
    } catch (error) {
      return { error: error as Error }
    }
  },

  /**
   * Sign up with email and password
   */
  async signUpWithEmail({ email, password, displayName }: SignUpCredentials): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      })

      if (error) {
        return { error }
      }

      // If user is created, create profile
      if (data.user && !data.user.email_confirmed_at) {
        // User needs to confirm email
        return { 
          data, 
          error: new Error('Please check your email to confirm your account') 
        }
      }

      return { data }
    } catch (error) {
      return { error: error as Error }
    }
  },

  /**
   * Sign in with GitHub OAuth
   */
  async signInWithGitHub(redirectTo?: string): Promise<AuthResult> {
    try {
      const callbackUrl = new URL('/auth/callback', window.location.origin)
      if (redirectTo) {
        callbackUrl.searchParams.set('next', redirectTo)
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: callbackUrl.toString(),
        },
      })

      if (error) {
        return { error }
      }

      return { data }
    } catch (error) {
      return { error: error as Error }
    }
  },

  /**
   * Sign out current user
   */
  async signOut(): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { error }
      }

      return {}
    } catch (error) {
      return { error: error as Error }
    }
  },

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        return { error }
      }

      return { data }
    } catch (error) {
      return { error: error as Error }
    }
  },

  /**
   * Update password
   */
  async updatePassword(password: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        return { error }
      }

      return { data }
    } catch (error) {
      return { error: error as Error }
    }
  },

  /**
   * Get current session
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession()
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  /**
   * Get current user
   */
  async getUser() {
    try {
      const { data, error } = await supabase.auth.getUser()
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  /**
   * Refresh session
   */
  async refreshSession() {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },
}