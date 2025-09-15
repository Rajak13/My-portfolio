'use client'

import { useState, useRef, useCallback } from 'react'
import { uploadMedia, MediaUploadOptions, MediaUploadResult } from '@/lib/media'
import { formatFileSize } from '@/lib/media/utils'

interface MediaUploaderProps {
  bucket?: 'avatars' | 'media'
  folder?: string
  maxFiles?: number
  allowedTypes?: string[]
  maxSize?: number
  onUploadComplete?: (results: MediaUploadResult[]) => void
  onUploadProgress?: (progress: number) => void
  className?: string
  children?: React.ReactNode
}

export function MediaUploader({
  bucket = 'media',
  folder,
  maxFiles = 5,
  allowedTypes,
  maxSize,
  onUploadComplete,
  onUploadProgress,
  className = '',
  children
}: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadResults, setUploadResults] = useState<MediaUploadResult[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files).slice(0, maxFiles)
    setSelectedFiles(files)
  }, [maxFiles])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, maxFiles)
    setSelectedFiles(files)
  }, [maxFiles])

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)
    setUploadResults([])

    const options: MediaUploadOptions = {
      bucket,
      folder,
      allowedTypes,
      maxSize
    }

    const results: MediaUploadResult[] = []

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      const result = await uploadMedia(file, options)
      results.push(result)
      
      const progress = ((i + 1) / selectedFiles.length) * 100
      setUploadProgress(progress)
      onUploadProgress?.(progress)
    }

    setUploadResults(results)
    setIsUploading(false)
    setSelectedFiles([])
    onUploadComplete?.(results)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index))
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        {children || (
          <div>
            <svg 
              className="w-12 h-12 mx-auto mb-4 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
              />
            </svg>
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-gray-500">
              {allowedTypes ? `Supported: ${allowedTypes.join(', ')}` : 'Images only'}
              {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
              {maxFiles > 1 && ` • Up to ${maxFiles} files`}
            </p>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={maxFiles > 1}
        accept={allowedTypes?.join(',') || 'image/*'}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Selected Files:</h4>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 p-1"
                disabled={isUploading}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          
          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={isUploading || selectedFiles.length === 0}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? `Uploading... ${Math.round(uploadProgress)}%` : 'Upload Files'}
          </button>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Upload Results */}
      {uploadResults.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Upload Results:</h4>
          {uploadResults.map((result, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg ${
                result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              {result.success ? (
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-green-700">
                    {result.data?.media.filename} uploaded successfully
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-sm text-red-700">{result.error}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}