'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { Theme, ThemeData, DEFAULT_THEME, BUILT_IN_THEMES } from '@/lib/themes/types'
import { applyThemeToDocument } from '@/lib/themes/utils'
import { supabase } from '@/lib/supabase/client'

interface ThemeContextType {
  currentTheme: Theme | null
  themeData: ThemeData
  availableThemes: Theme[]
  isLoading: boolean
  error: string | null
  switchTheme: (themeId: string) => Promise<void>
  refreshThemes: () => Promise<void>
  previewTheme: (themeData: ThemeData) => void
  resetPreview: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = 'portfolio-theme'

interface ThemeProviderProps {
  children: React.ReactNode
  initialThemeId?: string
}

export function ThemeProvider({ children, initialThemeId }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null)
  const [themeData, setThemeData] = useState<ThemeData>(DEFAULT_THEME)
  const [availableThemes, setAvailableThemes] = useState<Theme[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [previewData, setPreviewData] = useState<ThemeData | null>(null)

  // Load themes from Supabase and built-in themes
  const loadThemes = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get public themes from database
      const { data: dbThemes, error: dbError } = await supabase
        .from('themes')
        .select('*')
        .eq('is_public', true)

      if (dbError) {
        console.error('Error loading themes:', dbError)
        setError('Failed to load themes')
      }

      // Combine built-in themes with database themes
      const builtInWithDefaults = BUILT_IN_THEMES.map(theme => ({
        ...theme,
        created_by: 'system',
        created_at: new Date().toISOString(),
      }))

      const allThemes = [...builtInWithDefaults, ...(dbThemes || [])]
      setAvailableThemes(allThemes)

      // Set initial theme
      const savedThemeId = initialThemeId || localStorage.getItem(THEME_STORAGE_KEY)
      const targetTheme = savedThemeId 
        ? allThemes.find(t => t.id === savedThemeId) || allThemes[0]
        : allThemes[0]

      if (targetTheme) {
        setCurrentTheme(targetTheme)
        setThemeData(targetTheme.data)
      }
    } catch (err) {
      console.error('Error in loadThemes:', err)
      setError('Failed to initialize themes')
    } finally {
      setIsLoading(false)
    }
  }, [initialThemeId])

  // Switch to a different theme
  const switchTheme = useCallback(async (themeId: string) => {
    const theme = availableThemes.find(t => t.id === themeId)
    if (!theme) {
      setError(`Theme with id "${themeId}" not found`)
      return
    }

    try {
      setCurrentTheme(theme)
      setThemeData(theme.data)
      setPreviewData(null) // Clear any preview
      
      // Persist theme choice
      localStorage.setItem(THEME_STORAGE_KEY, themeId)
    } catch (err) {
      console.error('Error switching theme:', err)
      setError('Failed to switch theme')
    }
  }, [availableThemes])

  // Refresh themes from database
  const refreshThemes = useCallback(async () => {
    await loadThemes()
  }, [loadThemes])

  // Preview theme without persisting
  const previewTheme = useCallback((newThemeData: ThemeData) => {
    setPreviewData(newThemeData)
  }, [])

  // Reset preview to current theme
  const resetPreview = useCallback(() => {
    setPreviewData(null)
  }, [])

  // Apply theme to document when theme data changes
  useEffect(() => {
    const activeThemeData = previewData || themeData
    applyThemeToDocument(activeThemeData)
  }, [themeData, previewData])

  // Load themes on mount
  useEffect(() => {
    loadThemes()
  }, [loadThemes])

  const contextValue: ThemeContextType = {
    currentTheme,
    themeData: previewData || themeData,
    availableThemes,
    isLoading,
    error,
    switchTheme,
    refreshThemes,
    previewTheme,
    resetPreview,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}