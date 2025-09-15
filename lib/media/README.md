# Media Management System

A comprehensive media management system for the multilingual portfolio, providing image upload, optimization, and management capabilities.

## Features

- **File Upload**: Drag-and-drop or click-to-browse file upload
- **Image Optimization**: Automatic image optimization with Next.js Image component
- **Responsive Images**: Automatic srcset generation for different screen sizes
- **Storage Integration**: Seamless integration with Supabase Storage
- **Media Library**: Dashboard interface for organizing and managing files
- **Search & Filter**: Search media files by filename or alt text
- **Alt Text Management**: Accessibility-focused alt text editing
- **File Validation**: Size and type validation before upload
- **Error Handling**: Graceful error handling with user feedback

## Components

### ImageOptimized
A wrapper around Next.js Image component with enhanced features:
- Loading states with skeleton animation
- Error fallback with retry capability
- Responsive sizing with automatic srcset generation
- Preset components for common use cases (ProjectImage, PostImage, AvatarImage)

```tsx
import { ImageOptimized, ProjectImage } from '@/components/media'

// Basic usage
<ImageOptimized
  src="/path/to/image.jpg"
  alt="Description"
  width={800}
  height={600}
/>

// Preset for project images
<ProjectImage
  src="/path/to/project.jpg"
  alt="Project screenshot"
/>
```

### MediaUploader
Drag-and-drop file uploader with progress tracking:
- Multiple file upload support
- File validation and preview
- Upload progress indication
- Success/error feedback

```tsx
import { MediaUploader } from '@/components/media'

<MediaUploader
  bucket="media"
  maxFiles={5}
  onUploadComplete={(results) => {
    console.log('Upload complete:', results)
  }}
/>
```

### MediaManager
Complete media library interface for dashboard:
- Grid view of all media files
- Search and filter capabilities
- File details and metadata editing
- Delete and organize files
- Alt text management for accessibility

```tsx
import { MediaManager } from '@/components/media'

// Full media manager
<MediaManager />

// Selection mode for forms
<MediaManager
  selectionMode={true}
  onSelectMedia={(media) => {
    console.log('Selected:', media)
  }}
/>
```

### MediaPicker
Form-friendly media selection component:
- Click to open media library
- Preview selected media
- Easy removal and replacement
- Integration with form libraries

```tsx
import { MediaPicker } from '@/components/media'

const [selectedMedia, setSelectedMedia] = useState(null)

<MediaPicker
  value={selectedMedia}
  onChange={setSelectedMedia}
  placeholder="Select a cover image..."
/>
```

## API Functions

### Upload Media
```tsx
import { uploadMedia } from '@/lib/media'

const result = await uploadMedia(file, {
  bucket: 'media',
  folder: 'projects',
  maxSize: 10 * 1024 * 1024 // 10MB
})

if (result.success) {
  console.log('Uploaded:', result.data.media)
  console.log('URL:', result.data.url)
}
```

### Fetch Media
```tsx
import { getUserMedia, getMediaById, searchMedia } from '@/lib/media'

// Get all user media
const allMedia = await getUserMedia()

// Get specific media file
const media = await getMediaById('media-id')

// Search media files
const results = await searchMedia('project')
```

### Update Media
```tsx
import { updateMedia, deleteMedia } from '@/lib/media'

// Update alt text
await updateMedia('media-id', {
  alt_text: 'New description'
})

// Delete media file
await deleteMedia('media-id')
```

## Storage Structure

Files are organized in Supabase Storage buckets:

- **avatars**: User profile pictures (5MB limit)
  - Path: `{user_id}/{timestamp}-{random}-{filename}`
  
- **media**: General media files (10MB limit)
  - Path: `{user_id}/{timestamp}-{random}-{filename}`

## Database Schema

Media files are tracked in the `media` table:

```sql
CREATE TABLE media (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    filename TEXT NOT NULL,
    path TEXT NOT NULL UNIQUE,
    size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    alt_text TEXT,
    created_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Security

- **Row Level Security**: Users can only access their own media files
- **File Validation**: Size and type restrictions enforced
- **Storage Policies**: Bucket-level access control
- **Authentication**: All operations require valid user session

## Performance

- **Image Optimization**: Automatic WebP conversion and compression
- **Responsive Images**: Multiple sizes generated for different viewports
- **Lazy Loading**: Images load only when needed
- **CDN Delivery**: Files served through Supabase CDN
- **Caching**: Proper cache headers for optimal performance

## Accessibility

- **Alt Text Management**: Built-in alt text editing for all images
- **Keyboard Navigation**: Full keyboard support in media manager
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Clear focus indicators and logical tab order

## Usage in Dashboard

The media system is integrated into the dashboard at `/dashboard/media`, providing:

1. **Upload Interface**: Drag-and-drop file upload
2. **Media Library**: Grid view of all uploaded files
3. **Search & Filter**: Find files by name or alt text
4. **File Management**: Edit metadata, copy URLs, delete files
5. **Accessibility Tools**: Alt text editing for better SEO and accessibility

## Integration with Content

Media files can be easily integrated with projects and blog posts:

```tsx
// In project forms
<MediaPicker
  value={project.cover_image}
  onChange={(media) => setProject({
    ...project,
    cover_path: media?.path || null
  })}
/>

// In blog post editor
<MediaManager
  selectionMode={true}
  onSelectMedia={(media) => {
    insertImageIntoEditor(media)
  }}
/>
```

This media management system provides a complete solution for handling images and files in the multilingual portfolio, with a focus on performance, accessibility, and user experience.