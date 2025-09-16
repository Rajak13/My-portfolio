import { supabase } from '@/lib/supabase/client'
import { createServerClient } from '@/lib/supabase/server'
import { Theme, ThemeData } from './types'
import { generateThemeSlug } from './utils'

export class ThemeAPI {
  private supabase

  constructor(isServer = false) {
    this.supabase = isServer ? createServerClient() : supabase
  }

  /**
   * Get all public themes
   */
  async getPublicThemes(): Promise<Theme[]> {
    const { data, error } = await (this.supabase as any)
      .from('themes')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch public themes: ${error.message}`)
    }

    return data || []
  }

  /**
   * Get themes created by the current user
   */
  async getUserThemes(): Promise<Theme[]> {
    const { data: { user } } = await this.supabase.auth.getUser()

    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await (this.supabase as any)
      .from('themes')
      .select('*')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch user themes: ${error.message}`)
    }

    return data || []
  }

  /**
   * Get a specific theme by ID
   */
  async getTheme(id: string): Promise<Theme | null> {
    const { data, error } = await (this.supabase as any)
      .from('themes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Theme not found
      }
      throw new Error(`Failed to fetch theme: ${error.message}`)
    }

    return data
  }

  /**
   * Create a new theme
   */
  async createTheme(
    name: string,
    themeData: ThemeData,
    isPublic = false
  ): Promise<Theme> {
    const { data: { user } } = await this.supabase.auth.getUser()

    if (!user) {
      throw new Error('User not authenticated')
    }

    const slug = generateThemeSlug(name)

    // Check if slug already exists for this user
    const { data: existing } = await (this.supabase as any)
      .from('themes')
      .select('id')
      .eq('slug', slug)
      .eq('created_by', user.id)
      .single()

    if (existing) {
      throw new Error(`Theme with name "${name}" already exists`)
    }

    const { data, error } = await (this.supabase as any)
      .from('themes')
      .insert({
        slug,
        name,
        data: themeData,
        is_public: isPublic,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create theme: ${error.message}`)
    }

    return data
  }

  /**
   * Update an existing theme
   */
  async updateTheme(
    id: string,
    updates: Partial<Pick<Theme, 'name' | 'data' | 'is_public'>>
  ): Promise<Theme> {
    const { data: { user } } = await this.supabase.auth.getUser()

    if (!user) {
      throw new Error('User not authenticated')
    }

    // Generate new slug if name is being updated
    const updateData: Record<string, unknown> = { ...updates }
    if (updates.name) {
      updateData.slug = generateThemeSlug(updates.name)
    }

    const { data, error } = await (this.supabase as any)
      .from('themes')
      .update(updateData)
      .eq('id', id)
      .eq('created_by', user.id) // Ensure user can only update their own themes
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update theme: ${error.message}`)
    }

    return data
  }

  /**
   * Delete a theme
   */
  async deleteTheme(id: string): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser()

    if (!user) {
      throw new Error('User not authenticated')
    }

    const { error } = await (this.supabase as any)
      .from('themes')
      .delete()
      .eq('id', id)
      .eq('created_by', user.id) // Ensure user can only delete their own themes

    if (error) {
      throw new Error(`Failed to delete theme: ${error.message}`)
    }
  }

  /**
   * Duplicate a theme
   */
  async duplicateTheme(id: string, newName: string): Promise<Theme> {
    const originalTheme = await this.getTheme(id)

    if (!originalTheme) {
      throw new Error('Theme not found')
    }

    return this.createTheme(newName, originalTheme.data, false)
  }

  /**
   * Get user's theme preference from profile
   */
  async getUserThemePreference(): Promise<string | null> {
    const { data: { user } } = await this.supabase.auth.getUser()

    if (!user) {
      return null
    }

    const { data, error } = await (this.supabase as any)
      .from('profiles')
      .select('theme_preference')
      .eq('id', user.id)
      .single()

    if (error || !data) {
      return null
    }

    return data.theme_preference
  }

  /**
   * Save user's theme preference to profile
   */
  async saveUserThemePreference(themeId: string): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser()

    if (!user) {
      throw new Error('User not authenticated')
    }

    const { error } = await (this.supabase as any)
      .from('profiles')
      .update({ theme_preference: themeId })
      .eq('id', user.id)

    if (error) {
      throw new Error(`Failed to save theme preference: ${error.message}`)
    }
  }
}

// Wrapper functions for easier usage
const themeAPI = new ThemeAPI()

export async function getThemes(): Promise<Theme[]> {
  const [publicThemes, userThemes] = await Promise.all([
    themeAPI.getPublicThemes(),
    themeAPI.getUserThemes().catch(() => []) // Ignore auth errors for public access
  ])

  // Combine and deduplicate themes
  const allThemes = [...publicThemes, ...userThemes]
  const uniqueThemes = allThemes.filter((theme, index, self) =>
    index === self.findIndex(t => t.id === theme.id)
  )

  return uniqueThemes
}

export async function getTheme(id: string): Promise<Theme | null> {
  return themeAPI.getTheme(id)
}

export async function createTheme(input: { name: string; data: ThemeData; is_public?: boolean }): Promise<Theme> {
  return themeAPI.createTheme(input.name, input.data, input.is_public || false)
}

export async function updateTheme(id: string, input: { name?: string; data?: ThemeData; is_public?: boolean }): Promise<Theme> {
  return themeAPI.updateTheme(id, input)
}

export async function deleteTheme(id: string): Promise<void> {
  return themeAPI.deleteTheme(id)
}