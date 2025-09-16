import { Layout } from '@/components/layout'
import { PostDetail } from '@/components/posts'
import { getPublishedPostSlugs, getPublishedPostBySlug } from '@/lib/posts/api'
import { LanguageCode } from '@/lib/posts/types'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

// Static generation configuration
export const dynamicParams = false // Only generate for known slugs

// Generate static params for all published posts
export async function generateStaticParams() {
  try {
    const postSlugs = await getPublishedPostSlugs()
    return postSlugs.map(({ slug, language }) => ({
      language: language,
      slug: slug,
    }))
  } catch (error) {
    console.error('Error generating static params for posts:', error)
    return []
  }
}

// Generate metadata for each post page
export async function generateMetadata({ 
  params 
}: { 
  params: { language: string; slug: string } 
}): Promise<Metadata> {
  try {
    const language = params.language as LanguageCode
    const post = await getPublishedPostBySlug(params.slug, language)
    
    if (!post) {
      return {
        title: 'Post Not Found',
      }
    }

    return {
      title: `${post.title} | Blog`,
      description: post.excerpt || `Read "${post.title}" - insights on web development and technology.`,
      openGraph: {
        title: post.title,
        description: post.excerpt || `Read "${post.title}"`,
        type: 'article',
        publishedTime: post.published_at || post.created_at,
        authors: ['Portfolio Author'],
        tags: post.tags,
        images: post.cover_path ? [
          {
            url: post.cover_path,
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || `Read "${post.title}"`,
        images: post.cover_path ? [post.cover_path] : [],
      },
      alternates: {
        languages: {
          [language]: `/blog/${language}/${params.slug}`,
        },
      },
    }
  } catch (error) {
    console.error('Error generating metadata for post:', error)
    return {
      title: 'Post Not Found',
    }
  }
}

interface PostPageProps {
  params: {
    language: string
    slug: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  // Validate language parameter
  if (!['en', 'ne'].includes(params.language)) {
    notFound()
  }

  const language = params.language as LanguageCode
  let post
  
  try {
    post = await getPublishedPostBySlug(params.slug, language)
  } catch (error) {
    console.error('Error fetching post:', error)
    notFound()
  }

  if (!post) {
    notFound()
  }

  return (
    <Layout.Root>
      <PostDetail post={post} />
    </Layout.Root>
  )
}