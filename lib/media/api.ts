import { supabase } from '../supabase/client'
import { MediaFile, MediaUploadOptions, MediaUploadResult } from './types'
import { validateFile, generateUniqueFilename, getStorageUrl } from './utils'

/**
 * Uploads a file to Supabase Storage and creates a media record
 */
export async function uploadMedia(
  file: File,
  options: MediaUploadOptions
): Promise<MediaUploadResult> {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Authentication required' }
    }

    // Validate file
    const validation = validateFile(file, options)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Generate unique filename
    const filename = options.filename || generateUniqueFilename(file.name, user.id)
    const path = options.folder ? `${options.folder}/${filename}` : filename

    // Upload to storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from(options.bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (storageError) {
      return { success: false, error: storageError.message }
    }

    // Create media record in database
    const { data: mediaData, error: mediaError } = await (supabase as any)
      .from('media')
      .insert([{
        filename: file.name,
        path: storageData.path,
        size: file.size,
        mime_type: file.type,
        created_by: user.id
      }])
      .select()
      .single()

    if (mediaError) {
      // Clean up storage if database insert fails
      await supabase.storage.from(options.bucket).remove([storageData.path])
      return { success: false, error: mediaError.message }
    }

    // Get public URL
    const url = getStorageUrl(storageData.path, options.bucket)

    return {
      success: true,
      data: {
        path: storageData.path,
        url,
        media: mediaData
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

/**
 * Gets all media files for the current user
 */
export async function getUserMedia(): Promise<MediaFile[]> {
  const { data, error } = await (supabase as any)
    .from('media')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching media:', error)
    return []
  }

  return data || []
}

/**
 * Gets a specific media file by ID
 */
export async function getMediaById(id: string): Promise<MediaFile | null> {
  const { data, error } = await (supabase as any)
    .from('media')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching media:', error)
    return null
  }

  return data
}

/**
 * Updates media metadata (alt text, etc.)
 */
export async function updateMedia(
  id: string,
  updates: Partial<Pick<MediaFile, 'alt_text'>>
): Promise<{ success: boolean; error?: string }> {
  const { error } = await (supabase as any)
    .from('media')
    .update(updates)
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Deletes a media file and its storage object
 */
export async function deleteMedia(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Get media record first
    const media = await getMediaById(id)
    if (!media) {
      return { success: false, error: 'Media not found' }
    }

    // Determine bucket from path (avatars paths start with user ID, media paths vary)
    const bucket = media.path.includes('/') && media.path.split('/')[0].length === 36 
      ? 'avatars' 
      : 'media'

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(bucket)
      .remove([media.path])

    if (storageError) {
      console.error('Storage deletion error:', storageError)
      // Continue with database deletion even if storage fails
    }

    // Delete from database
    const { error: dbError } = await (supabase as any)
      .from('media')
      .delete()
      .eq('id', id)

    if (dbError) {
      return { success: false, error: dbError.message }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed'
    }
  }
}

/**
 * Gets the public URL for a media file
 */
export function getMediaUrl(path: string, bucket: string = 'media'): string {
  return getStorageUrl(path, bucket)
}

/**
 * Searches media files by filename or alt text
 */
export async function searchMedia(query: string): Promise<MediaFile[]> {
  const { data, error } = await (supabase as any)
    .from('media')
    .select('*')
    .or(`filename.ilike.%${query}%,alt_text.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching media:', error)
    return []
  }

  return data || []
}