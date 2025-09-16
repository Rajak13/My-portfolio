'use client'

import { useState, useEffect } from 'react'
import { ThemeEditor, ThemeSwitcher } from '@/components/theme'
import { getThemes, createTheme, updateTheme, deleteTheme } from '@/lib/themes/api'
import { Theme, ThemeInput } from '@/lib/themes/types'

export default function ThemesSettingsPage() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadThemes()
  }, [])

  const loadThemes = async () => {
    try {
      setLoading(true)
      const data = await getThemes()
      setThemes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load themes')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTheme = async (data: ThemeInput) => {
    try {
      const newTheme = await createTheme(data)
      setThemes([...themes, newTheme])
      setSelectedTheme(newTheme)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create theme')
    }
  }

  const handleUpdateTheme = async (id: string, data: ThemeInput) => {
    try {
      const updatedTheme = await updateTheme(id, data)
      setThemes(themes.map(t => t.id === id ? updatedTheme : t))
      setSelectedTheme(updatedTheme)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update theme')
    }
  }

  const handleDeleteTheme = async (id: string) => {
    if (!confirm('Are you sure you want to delete this theme?')) return

    try {
      await deleteTheme(id)
      setThemes(themes.filter(t => t.id !== id))
      if (selectedTheme?.id === id) {
        setSelectedTheme(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete theme')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Theme Management</h2>
          <p className="text-gray-600 mt-1">
            Create and manage visual themes for your portfolio.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedTheme(null)
            setIsEditing(true)
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Theme
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Theme List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Available Themes</h3>
          
          {/* Current Theme Switcher */}
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Current Theme</h4>
            <ThemeSwitcher />
          </div>

          {/* Theme List */}
          <div className="space-y-3">
            {themes.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No themes</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first theme.</p>
              </div>
            ) : (
              themes.map((theme) => (
                <div
                  key={theme.id}
                  className={`bg-white p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedTheme?.id === theme.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTheme(theme)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{theme.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {theme.is_public ? 'Public' : 'Private'} • 
                        Created {new Date(theme.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* Color preview */}
                      <div className="flex space-x-1">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: theme.data.colors.primary }}
                        />
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: theme.data.colors.secondary }}
                        />
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: theme.data.colors.accent }}
                        />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteTheme(theme.id)
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Theme Editor */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? (selectedTheme ? 'Edit Theme' : 'Create Theme') : 'Theme Preview'}
            </h3>
            {selectedTheme && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
              >
                Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="bg-white p-6 rounded-lg border">
              <ThemeEditor
                themeId={selectedTheme?.id}
                onSave={selectedTheme ? 
                  (theme) => {
                    setThemes(themes.map(t => t.id === theme.id ? theme : t))
                    setSelectedTheme(theme)
                    setIsEditing(false)
                  } :
                  (theme) => {
                    setThemes([...themes, theme])
                    setSelectedTheme(theme)
                    setIsEditing(false)
                  }
                }
                onCancel={() => setIsEditing(false)}
              />
            </div>
          ) : selectedTheme ? (
            <div className="bg-white p-6 rounded-lg border">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Colors</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(selectedTheme.data.colors).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div
                          className="w-full h-12 rounded border mb-1"
                          style={{ backgroundColor: value }}
                        />
                        <p className="text-xs text-gray-600 capitalize">{key}</p>
                        <p className="text-xs text-gray-400">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Typography</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedTheme.data.fonts).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-sm text-gray-600 capitalize">{key}:</span>
                        <span className="text-sm text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Spacing</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedTheme.data.spacing).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-sm text-gray-600 capitalize">{key}:</span>
                        <span className="text-sm text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                Select a theme to preview or create a new one
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}