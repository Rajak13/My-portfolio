import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    // Verify the revalidation secret
    const secret = request.nextUrl.searchParams.get('secret')
    
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      )
    }

    // Get the path or tag to revalidate from the request body
    const body = await request.json()
    const { path, tag, type } = body

    if (path) {
      // Revalidate specific path
      revalidatePath(path)
      console.log(`Revalidated path: ${path}`)
    } else if (tag) {
      // Revalidate by tag
      revalidateTag(tag)
      console.log(`Revalidated tag: ${tag}`)
    } else if (type) {
      // Revalidate common paths based on content type
      switch (type) {
        case 'project':
          revalidatePath('/')
          revalidatePath('/projects')
          console.log('Revalidated project pages')
          break
        case 'post':
          revalidatePath('/')
          revalidatePath('/blog')
          console.log('Revalidated blog pages')
          break
        default:
          // Revalidate all main pages
          revalidatePath('/')
          revalidatePath('/projects')
          revalidatePath('/blog')
          console.log('Revalidated all main pages')
      }
    } else {
      return NextResponse.json(
        { message: 'Missing path, tag, or type parameter' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Revalidation successful',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { message: 'Error revalidating', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Example usage:
// POST /api/revalidate?secret=your-secret
// Body: { "path": "/projects" }
// Body: { "tag": "projects" }
// Body: { "type": "project" }