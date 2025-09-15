import { 
  validateFile, 
  generateUniqueFilename, 
  formatFileSize, 
  getFileExtension,
  isImageFile,
  generateImageSizes
} from '../utils'
import { MAX_FILE_SIZES } from '../types'

describe('Media Utils', () => {
  describe('validateFile', () => {
    it('should validate a valid image file', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const options = { bucket: 'media' as const }
      
      const result = validateFile(file, options)
      expect(result.valid).toBe(true)
    })

    it('should reject oversized files', () => {
      // Create a mock file that's too large
      const largeFile = new File(['x'.repeat(MAX_FILE_SIZES.media + 1)], 'large.jpg', { 
        type: 'image/jpeg' 
      })
      const options = { bucket: 'media' as const }
      
      const result = validateFile(largeFile, options)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('File size exceeds')
    })

    it('should reject invalid file types', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' })
      const options = { bucket: 'media' as const }
      
      const result = validateFile(file, options)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('File type text/plain is not allowed')
    })
  })

  describe('generateUniqueFilename', () => {
    it('should generate a unique filename with user ID', () => {
      const userId = 'user123'
      const filename = 'test.jpg'
      
      const result = generateUniqueFilename(filename, userId)
      
      expect(result).toMatch(/^user123\/\d+-[a-z0-9]+-test\.jpg$/)
    })

    it('should sanitize filename', () => {
      const userId = 'user123'
      const filename = 'test file with spaces!@#.jpg'
      
      const result = generateUniqueFilename(filename, userId)
      
      expect(result).toMatch(/^user123\/\d+-[a-z0-9]+-test-file-with-spaces---\.jpg$/)
    })
  })

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1048576)).toBe('1 MB')
      expect(formatFileSize(1073741824)).toBe('1 GB')
    })
  })

  describe('getFileExtension', () => {
    it('should extract file extension', () => {
      expect(getFileExtension('test.jpg')).toBe('jpg')
      expect(getFileExtension('test.file.png')).toBe('png')
      expect(getFileExtension('noextension')).toBe('')
    })
  })

  describe('isImageFile', () => {
    it('should identify image files', () => {
      expect(isImageFile('image/jpeg')).toBe(true)
      expect(isImageFile('image/png')).toBe(true)
      expect(isImageFile('text/plain')).toBe(false)
    })
  })

  describe('generateImageSizes', () => {
    it('should generate responsive image sizes string', () => {
      const result = generateImageSizes()
      expect(result).toContain('(max-width: 640px) 100vw')
      expect(result).toContain('(max-width: 768px) 50vw')
    })
  })
})