'use client'

import Image from 'next/image'
import { useState } from 'react'
import { generateImageSizes } from '@/lib/media/utils'

interface ImageOptimizedProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
}

export function ImageOptimized({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes,
  quality = 80,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError
}: ImageOptimizedProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  // Generate responsive sizes if not provided
  const responsiveSizes = sizes || generateImageSizes()

  // Error fallback
  if (hasError) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={fill ? undefined : { width, height }}
      >
        <div className="text-gray-400 text-center p-4">
          <svg 
            className="w-8 h-8 mx-auto mb-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <p className="text-sm">Failed to load image</p>
        </div>
      </div>
    )
  }

  const imageProps = {
    src,
    alt,
    quality,
    priority,
    placeholder,
    blurDataURL,
    onLoad: handleLoad,
    onError: handleError,
    className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    ...(fill ? { fill: true, sizes: responsiveSizes } : { width, height, sizes: responsiveSizes })
  }

  return (
    <div className="relative">
      <Image {...imageProps} />
      
      {/* Loading skeleton */}
      {isLoading && (
        <div 
          className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`}
          style={fill ? undefined : { width, height }}
        >
          <div className="flex items-center justify-center h-full">
            <svg 
              className="w-8 h-8 text-gray-400 animate-spin" 
              fill="none" 
              viewBox="0 0 24 24"
              aria-label="Loading"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

// Preset components for common use cases
export function ProjectImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <ImageOptimized
      src={src}
      alt={alt}
      width={800}
      height={600}
      className={className}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}

export function PostImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <ImageOptimized
      src={src}
      alt={alt}
      width={1200}
      height={630}
      className={className}
      sizes="(max-width: 768px) 100vw, 80vw"
    />
  )
}

export function AvatarImage({ 
  src, 
  alt, 
  size = 40, 
  className 
}: { 
  src: string; 
  alt: string; 
  size?: number; 
  className?: string 
}) {
  return (
    <ImageOptimized
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      priority
    />
  )
}