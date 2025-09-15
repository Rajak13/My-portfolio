import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZES, MediaUploadOptions } from './types'

/**
 * Validates a file for upload
 */
export function validateFile(
  file: File,
  options: MediaUploadOptions
): { valid: boolean; error?: string } {
  // Check file size
  const maxSize = options.maxSize || MAX_FILE_SIZES[options.bucket]
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${formatFileSize(maxSize)} limit`
    }
  }

  // Check file type
  const allowedTypes = options.allowedTypes || ALLOWED_IMAGE_TYPES
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`
    }
  }

  return { valid: true }
}

/**
 * Generates a unique filename with timestamp and random string
 */
export function generateUniqueFilename(originalFilename: string, userId: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  const extension = originalFilename.split('.').pop()
  const nameWithoutExt = originalFilename.replace(/\.[^/.]+$/, '')
  const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, '-')
  
  return `${userId}/${timestamp}-${randomString}-${sanitizedName}.${extension}`
}

/**
 * Formats file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Gets the public URL for a storage file
 */
export function getStorageUrl(path: string, bucket: string = 'media'): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}

/**
 * Extracts file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

/**
 * Checks if file is an image
 */
export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/')
}

/**
 * Generates responsive image sizes string for next/image
 */
export function generateImageSizes(breakpoints?: { [key: string]: number }): string {
  const defaultBreakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280
  }
  
  const bp = breakpoints || defaultBreakpoints
  
  return [
    `(max-width: ${bp.sm}px) 100vw`,
    `(max-width: ${bp.md}px) 50vw`,
    `(max-width: ${bp.lg}px) 33vw`,
    '25vw'
  ].join(', ')
}

/**
 * Compresses an image file (basic client-side compression)
 */
export function compressImage(
  file: File,
  maxWidth: number = 1920,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      canvas.width = width
      canvas.height = height
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            resolve(file)
          }
        },
        file.type,
        quality
      )
    }
    
    img.src = URL.createObjectURL(file)
  })
}