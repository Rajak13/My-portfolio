export interface MediaFile {
  id: string
  filename: string
  path: string
  size: number
  mime_type: string
  alt_text?: string | null
  created_by: string
  created_at: string
}

export interface MediaUploadOptions {
  bucket: 'avatars' | 'media'
  folder?: string
  filename?: string
  maxSize?: number
  allowedTypes?: string[]
}

export interface MediaUploadResult {
  success: boolean
  data?: {
    path: string
    url: string
    media: MediaFile
  }
  error?: string
}

export interface ImageDimensions {
  width: number
  height: number
}

export interface ResponsiveImageSizes {
  sm: number
  md: number
  lg: number
  xl: number
}

export const DEFAULT_IMAGE_SIZES: ResponsiveImageSizes = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280
}

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml'
]

export const MAX_FILE_SIZES = {
  avatars: 5 * 1024 * 1024, // 5MB
  media: 10 * 1024 * 1024   // 10MB
}