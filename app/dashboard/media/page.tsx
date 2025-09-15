import { MediaManager } from '@/components/media'

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
        <p className="text-gray-600 mt-2">
          Manage your images and files. Upload new media or organize existing files.
        </p>
      </div>
      
      <MediaManager />
    </div>
  )
}

export const metadata = {
  title: 'Media Library - Dashboard',
  description: 'Manage your media files and images'
}