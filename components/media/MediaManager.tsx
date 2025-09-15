'use client'

import { useState, useEffect } from 'react'
import { MediaFile, getUserMedia, deleteMedia, updateMedia, searchMedia, getMediaUrl } from '@/lib/media'
import { MediaUploader } from './MediaUploader'
import { ImageOptimized } from './ImageOptimized'
import { formatFileSize, isImageFile } from '@/lib/media/utils'

interface MediaManagerProps {
  onSelectMedia?: (media: MediaFile) => void
  selectionMode?: boolean
  className?: string
}

export function MediaManager({ 
  onSelectMedia, 
  selectionMode = false, 
  className = '' 
}: MediaManagerProps) {
  const [media, setMedia] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null)
  const [showUploader, setShowUploader] = useState(false)
  const [editingAltText, setEditingAltText] = useState<string | null>(null)
  const [altTextValue, setAltTextValue] = useState('')

  useEffect(() => {
    loadMedia()
  }, [])

  const loadMedia = async () => {
    setLoading(true)
    try {
      const data = await getUserMedia()
      setMedia(data)
    } catch (error) {
      console.error('Error loading media:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const results = await searchMedia(query)
      setMedia(results)
    } else {
      loadMedia()
    }
  }

  const handleDelete = async (mediaItem: MediaFile) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    const result = await deleteMedia(mediaItem.id)
    if (result.success) {
      setMedia(prev => prev.filter(m => m.id !== mediaItem.id))
      if (selectedMedia?.id === mediaItem.id) {
        setSelectedMedia(null)
      }
    } else {
      alert(`Failed to delete file: ${result.error}`)
    }
  }

  const handleUpdateAltText = async (mediaItem: MediaFile) => {
    const result = await updateMedia(mediaItem.id, { alt_text: altTextValue })
    if (result.success) {
      setMedia(prev => prev.map(m => 
        m.id === mediaItem.id ? { ...m, alt_text: altTextValue } : m
      ))
      setEditingAltText(null)
      setAltTextValue('')
    } else {
      alert(`Failed to update alt text: ${result.error}`)
    }
  }

  const startEditingAltText = (mediaItem: MediaFile) => {
    setEditingAltText(mediaItem.id)
    setAltTextValue(mediaItem.alt_text || '')
  }

  const handleMediaSelect = (mediaItem: MediaFile) => {
    if (selectionMode && onSelectMedia) {
      onSelectMedia(mediaItem)
    } else {
      setSelectedMedia(mediaItem)
    }
  }

  const copyUrl = (mediaItem: MediaFile) => {
    const url = getMediaUrl(mediaItem.path)
    navigator.clipboard.writeText(url)
    alert('URL copied to clipboard!')
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Media Manager</h2>
        <button
          onClick={() => setShowUploader(!showUploader)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showUploader ? 'Hide Uploader' : 'Upload Files'}
        </button>
      </div>

      {/* Upload Section */}
      {showUploader && (
        <div className="border rounded-lg p-6 bg-gray-50">
          <MediaUploader
            onUploadComplete={() => {
              loadMedia()
              setShowUploader(false)
            }}
          />
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg 
          className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500">No media files found</p>
          {!showUploader && (
            <button
              onClick={() => setShowUploader(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upload Your First File
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((mediaItem) => (
            <div
              key={mediaItem.id}
              className={`
                group relative aspect-square border-2 rounded-lg overflow-hidden cursor-pointer transition-all
                ${selectedMedia?.id === mediaItem.id 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-gray-300'
                }
                ${selectionMode ? 'hover:ring-2 hover:ring-blue-200' : ''}
              `}
              onClick={() => handleMediaSelect(mediaItem)}
            >
              {isImageFile(mediaItem.mime_type) ? (
                <ImageOptimized
                  src={getMediaUrl(mediaItem.path)}
                  alt={mediaItem.alt_text || mediaItem.filename}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      copyUrl(mediaItem)
                    }}
                    className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                    title="Copy URL"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(mediaItem)
                    }}
                    className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* File info */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 text-xs">
                <p className="truncate font-medium">{mediaItem.filename}</p>
                <p className="text-gray-300">{formatFileSize(mediaItem.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Media Details Panel */}
      {selectedMedia && !selectionMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Media Details</h3>
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Preview */}
                <div>
                  {isImageFile(selectedMedia.mime_type) ? (
                    <ImageOptimized
                      src={getMediaUrl(selectedMedia.path)}
                      alt={selectedMedia.alt_text || selectedMedia.filename}
                      width={400}
                      height={300}
                      className="w-full rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filename</label>
                    <p className="text-gray-900">{selectedMedia.filename}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                    <p className="text-gray-900">{formatFileSize(selectedMedia.size)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <p className="text-gray-900">{selectedMedia.mime_type}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={getMediaUrl(selectedMedia.path)}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                      />
                      <button
                        onClick={() => copyUrl(selectedMedia)}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                    {editingAltText === selectedMedia.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={altTextValue}
                          onChange={(e) => setAltTextValue(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                          placeholder="Describe this image for accessibility..."
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateAltText(selectedMedia)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingAltText(null)}
                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-gray-900 flex-1">
                          {selectedMedia.alt_text || 'No alt text set'}
                        </p>
                        <button
                          onClick={() => startEditingAltText(selectedMedia)}
                          className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Uploaded</label>
                    <p className="text-gray-900">
                      {new Date(selectedMedia.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t">
                    <button
                      onClick={() => handleDelete(selectedMedia)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete File
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}