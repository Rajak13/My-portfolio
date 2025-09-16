'use client'

import { useState, useEffect, useCallback } from 'react'

import { getAllTranslations, updateTranslation, createTranslation } from '@/lib/i18n/api'
import { Translation } from '@/lib/i18n/types'

export default function TranslationsSettingsPage() {
  const [translations, setTranslations] = useState<Translation[]>([])
  const [filteredTranslations, setFilteredTranslations] = useState<Translation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'en' | 'ne'>('all')
  const [editingTranslation, setEditingTranslation] = useState<Translation | null>(null)
  const [showNewTranslation, setShowNewTranslation] = useState(false)

  useEffect(() => {
    loadTranslations()
  }, [])

  const filterTranslations = useCallback(() => {
    let filtered = translations

    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(t => t.language === selectedLanguage)
    }

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredTranslations(filtered)
  }, [translations, selectedLanguage, searchTerm])

  useEffect(() => {
    filterTranslations()
  }, [filterTranslations])

  const loadTranslations = async () => {
    try {
      setLoading(true)
      const data = await getAllTranslations()
      setTranslations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load translations')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTranslation = async (data: Omit<Translation, 'id'>) => {
    try {
      if (editingTranslation) {
        const updated = await updateTranslation(editingTranslation.id, data)
        setTranslations(translations.map(t => t.id === editingTranslation.id ? updated : t))
      } else {
        const created = await createTranslation(data)
        setTranslations([...translations, created])
      }
      setEditingTranslation(null)
      setShowNewTranslation(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save translation')
    }
  }

  const groupedTranslations = filteredTranslations.reduce((acc, translation) => {
    const key = translation.key
    if (!acc[key]) {
      acc[key] = {}
    }
    acc[key][translation.language] = translation
    return acc
  }, {} as Record<string, Record<string, Translation>>)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
          <h2 className="text-2xl font-bold text-gray-900">Translation Management</h2>
          <p className="text-gray-600 mt-1">
            Manage translations for English and Nepali languages.
          </p>
        </div>
        <button
          onClick={() => setShowNewTranslation(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Translation
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

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div>
              <label htmlFor="search" className="sr-only">Search translations</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search translations..."
                />
              </div>
            </div>
            
            <div>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as 'all' | 'en' | 'ne')}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Languages</option>
                <option value="en">English</option>
                <option value="ne">Nepali</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            {filteredTranslations.length} of {translations.length} translations
          </div>
        </div>
      </div>

      {/* Translations List */}
      {Object.keys(groupedTranslations).length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No translations found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedLanguage !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first translation.'
            }
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {Object.entries(groupedTranslations).map(([key, languages]) => (
              <li key={key} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {key}
                      </p>
                      <div className="flex space-x-1">
                        {languages.en && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            EN
                          </span>
                        )}
                        {languages.ne && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            NE
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      {languages.en && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">EN:</span> {languages.en.value}
                        </div>
                      )}
                      {languages.ne && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">NE:</span> {languages.ne.value}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!languages.en && (
                      <button
                        onClick={() => setEditingTranslation({ 
                          id: '', 
                          key, 
                          language: 'en', 
                          value: '' 
                        })}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Add EN
                      </button>
                    )}
                    {!languages.ne && (
                      <button
                        onClick={() => setEditingTranslation({ 
                          id: '', 
                          key, 
                          language: 'ne', 
                          value: '' 
                        })}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Add NE
                      </button>
                    )}
                    <button
                      onClick={() => setEditingTranslation(languages.en || languages.ne)}
                      className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Translation Editor Modal */}
      {(editingTranslation || showNewTranslation) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingTranslation?.id ? 'Edit Translation' : 'New Translation'}
              </h3>
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleSaveTranslation({
                  key: formData.get('key') as string,
                  language: formData.get('language') as 'en' | 'ne',
                  value: formData.get('value') as string
                })
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Key</label>
                    <input
                      name="key"
                      type="text"
                      defaultValue={editingTranslation?.key || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Language</label>
                    <select
                      name="language"
                      defaultValue={editingTranslation?.language || 'en'}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="en">English</option>
                      <option value="ne">Nepali</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Value</label>
                    <textarea
                      name="value"
                      defaultValue={editingTranslation?.value || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      rows={3}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTranslation(null)
                      setShowNewTranslation(false)
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}