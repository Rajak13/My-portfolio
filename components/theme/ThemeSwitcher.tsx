'use client'

import React, { useState } from 'react'
// import { useTheme } from '@/lib/providers/ThemeProvider'
import { Theme } from '@/lib/themes/types'

interface ThemeSwitcherProps {
  className?: string
  showPreview?: boolean
}

export function ThemeSwitcher({ className = '', showPreview = true }: ThemeSwitcherProps) {
  // const { 
  //   currentTheme, 
  //   availableThemes, 
  //   isLoading, 
  //   error, 
  //   switchTheme, 
  //   previewTheme, 
  //   resetPreview 
  // } = useTheme()
  
  // Temporary mock data for build
  const currentTheme: any = null
  const availableThemes: any[] = []
  const isLoading = false
  const error = null
  const switchTheme = async (_themeId: string) => {}
  const previewTheme = (_theme: any) => {}
  const resetPreview = () => {}
  
  const [isOpen, setIsOpen] = useState(false)
  const [previewingTheme, setPreviewingTheme] = useState<string | null>(null)

  const handleThemeSelect = async (themeId: string) => {
    await switchTheme(themeId)
    setIsOpen(false)
    setPreviewingTheme(null)
    resetPreview()
  }

  const handleThemePreview = (theme: Theme) => {
    if (!showPreview) return
    
    setPreviewingTheme(theme.id)
    previewTheme(theme.data)
  }

  const handlePreviewEnd = () => {
    if (!showPreview) return
    
    setPreviewingTheme(null)
    resetPreview()
  }

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-10 w-32 bg-muted rounded-md"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-sm text-red-500 ${className}`}>
        Theme error: {error}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border border-border bg-surface hover:bg-muted transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full border border-border"
            style={{ 
              backgroundColor: currentTheme?.data.colors.primary || 'var(--primary)' 
            }}
          />
          <span>{currentTheme?.name || 'Default'}</span>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsOpen(false)
              handlePreviewEnd()
            }}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-64 bg-surface border border-border rounded-md shadow-lg z-50">
            <div className="p-2">
              <div className="text-xs font-medium text-muted mb-2 px-2">
                Available Themes
              </div>
              
              <div className="space-y-1" role="listbox">
                {availableThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme.id)}
                    onMouseEnter={() => handleThemePreview(theme)}
                    onMouseLeave={handlePreviewEnd}
                    className={`w-full flex items-center gap-3 px-2 py-2 text-sm rounded-md transition-colors text-left ${
                      currentTheme?.id === theme.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    } ${
                      previewingTheme === theme.id ? 'ring-2 ring-accent' : ''
                    }`}
                    role="option"
                    aria-selected={currentTheme?.id === theme.id}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div 
                        className="w-4 h-4 rounded-full border border-border flex-shrink-0"
                        style={{ backgroundColor: theme.data.colors.primary }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{theme.name}</div>
                        <div className="text-xs opacity-70 truncate">
                          {theme.data.fonts.heading.split(',')[0]}
                        </div>
                      </div>
                    </div>
                    
                    {/* Color palette preview */}
                    <div className="flex gap-1">
                      {Object.entries(theme.data.colors).slice(0, 4).map(([key, color]) => (
                        <div
                          key={key}
                          className="w-2 h-2 rounded-full border border-border"
                          style={{ backgroundColor: color as string }}
                          title={key}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
              
              {showPreview && previewingTheme && (
                <div className="mt-2 pt-2 border-t border-border">
                  <div className="text-xs text-muted px-2">
                    Hover to preview • Click to apply
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}