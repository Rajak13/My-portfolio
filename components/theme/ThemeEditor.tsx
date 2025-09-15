'use client'

import React, { useState, useEffect } from 'react'
// import { useTheme } from '@/lib/providers/ThemeProvider'
import { Theme, ThemeData, ThemeColors, ThemeFonts, ThemeSpacing, DEFAULT_THEME } from '@/lib/themes/types'
import { ThemeAPI } from '@/lib/themes/api'
// import { isValidHSLColor } from '@/lib/themes/utils' // TODO: Use for validation

interface ThemeEditorProps {
  themeId?: string
  onSave?: (theme: Theme) => void
  onCancel?: () => void
}

export function ThemeEditor({ themeId, onSave, onCancel }: ThemeEditorProps) {
  // const { previewTheme, resetPreview, refreshThemes } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  
  // Form state
  const [name, setName] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [themeData, setThemeData] = useState<ThemeData>(DEFAULT_THEME)
  
  const themeAPI = new ThemeAPI()

  // Load existing theme if editing
  useEffect(() => {
    if (themeId) {
      loadTheme()
    }
  }, [themeId]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadTheme = async () => {
    if (!themeId) return
    
    try {
      setIsLoading(true)
      const theme = await themeAPI.getTheme(themeId)
      
      if (theme) {
        setName(theme.name)
        setIsPublic(theme.is_public)
        setThemeData(theme.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load theme')
    } finally {
      setIsLoading(false)
    }
  }

  // Preview theme changes in real-time
  useEffect(() => {
    if (isDirty) {
      // previewTheme(themeData)
    }
  }, [themeData, isDirty])

  const handleColorChange = (colorKey: keyof ThemeColors, value: string) => {
    setThemeData(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value,
      },
    }))
    setIsDirty(true)
  }

  const handleFontChange = (fontKey: keyof ThemeFonts, value: string) => {
    setThemeData(prev => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [fontKey]: value,
      },
    }))
    setIsDirty(true)
  }

  const handleSpacingChange = (spacingKey: keyof ThemeSpacing, value: number) => {
    setThemeData(prev => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        [spacingKey]: value,
      },
    }))
    setIsDirty(true)
  }

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Theme name is required')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      let savedTheme
      if (themeId) {
        savedTheme = await themeAPI.updateTheme(themeId, {
          name: name.trim(),
          data: themeData,
          is_public: isPublic,
        })
      } else {
        savedTheme = await themeAPI.createTheme(name.trim(), themeData, isPublic)
      }

      // await refreshThemes()
      setIsDirty(false)
      onSave?.(savedTheme)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save theme')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    // resetPreview()
    setIsDirty(false)
    onCancel?.()
  }

  const handleReset = () => {
    setThemeData(DEFAULT_THEME)
    setIsDirty(true)
  }

  if (isLoading && themeId) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {themeId ? 'Edit Theme' : 'Create Theme'}
          </h2>
          <p className="text-muted">
            Customize colors, fonts, and spacing to create your perfect theme
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
          >
            Reset to Default
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <div className="space-y-6">
          {/* Basic Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Settings</h3>
            
            <div>
              <label htmlFor="theme-name" className="block text-sm font-medium mb-1">
                Theme Name
              </label>
              <input
                id="theme-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="My Custom Theme"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                id="theme-public"
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-border"
              />
              <label htmlFor="theme-public" className="text-sm">
                Make this theme public
              </label>
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Colors</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(themeData.colors).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={value.startsWith('hsl') ? '#000000' : value}
                      onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                      className="w-8 h-8 rounded border border-border"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="hsl(0, 0%, 100%)"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fonts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Typography</h3>
            
            {Object.entries(themeData.fonts).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1 capitalize">
                  {key} Font
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleFontChange(key as keyof ThemeFonts, e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Inter, system-ui, sans-serif"
                />
              </div>
            ))}
          </div>

          {/* Spacing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Spacing</h3>
            
            {Object.entries(themeData.spacing).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1 capitalize">
                  {key} ({value})
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={value}
                  onChange={(e) => handleSpacingChange(key as keyof ThemeSpacing, parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Live Preview</h3>
          
          <div className="border border-border rounded-lg p-6 space-y-4 bg-background">
            {/* Header Preview */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h1 className="text-2xl font-bold" style={{ fontFamily: themeData.fonts.heading }}>
                Portfolio
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary"></div>
                <span className="text-sm" style={{ fontFamily: themeData.fonts.body }}>
                  User
                </span>
              </div>
            </div>
            
            {/* Content Preview */}
            <div className="space-y-4">
              <div className="bg-surface border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-2" style={{ fontFamily: themeData.fonts.heading }}>
                  Project Card
                </h3>
                <p className="text-muted text-sm mb-3" style={{ fontFamily: themeData.fonts.body }}>
                  This is a sample project description to show how text looks with your theme.
                </p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded">
                    React
                  </span>
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                    TypeScript
                  </span>
                </div>
              </div>
              
              <div className="bg-surface border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-2" style={{ fontFamily: themeData.fonts.heading }}>
                  Code Example
                </h3>
                <pre className="text-sm bg-muted p-2 rounded" style={{ fontFamily: themeData.fonts.mono }}>
{`function hello() {
  return "Hello, World!"
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading || !name.trim()}
          className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : themeId ? 'Update Theme' : 'Create Theme'}
        </button>
      </div>
    </div>
  )
}