'use client'

import { useState } from 'react'
import { MediaFile, getMediaUrl } from '@/lib/media'
import { MediaManager } from './MediaManager'
import { ImageOptimized } from './ImageOptimized'
import { isImageFile } from '@/lib/media/utils'

interface MediaPickerProps {
  value?: MediaFile | null
  onChange: (media: MediaFile | null) => void
  placeholder?: string
  className?: string
}

export function MediaPicker({ 
  value, 
  onChange, 
  placeholder = "Select an image...",
  className = '' 
}: MediaPickerProps) {
  const [showPicker, setShowPicker] = useState(false)

  const handleSelect = (media: MediaFile) => {
    onChange(media)
    setShowPicker(false)
  }

  const handleRemove = () => {
    onChange(null)
  }

  return (
    <div className={className}>
      {value ? (
        <div className="space-y-3">
          {/* Selected Media Preview */}
          <div className="relative group">
            {isImageFile(value.mime_type) ? (
              <ImageOptimized
                src={getMediaUrl(value.path)}
                alt={value.alt_text || value.filename}
                width={300}
                height={200}
                className="w-full max-w-sm rounded-lg border"
              />
            ) : (
              <div className="w-full max-w-sm h-32 bg-gray-100 rounded-lg border flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm text-gray-600">{value.filename}</p>
                </div>
              </div>
            )}
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-lg">
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowPicker(true)}
                  className="px-3 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-sm"
                >
                  Change
                </button>
                <button
                  onClick={handleRemove}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          {/* File Info */}
          <div className="text-sm text-gray-600">
            <p className="font-medium">{value.filename}</p>
            {value.alt_text && (
              <p className="text-gray-500">Alt: {value.alt_text}</p>
            )}
          </div>
        </div>
      ) : (
        /* Empty State */
        <button
          onClick={() => setShowPicker(true)}
          className="w-full max-w-sm h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center justify-center text-gray-500 hover:text-gray-600"
        >
          <div className="text-center">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">{placeholder}</p>
          </div>
        </button>
      )}

      {/* Media Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Select Media</h3>
                <button
                  onClick={() => setShowPicker(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <MediaManager
                onSelectMedia={handleSelect}
                selectionMode={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}