import { MetadataRoute } from 'next'
import { getPublishedProjectSlugs } from '@/lib/projects/api'
import { getPublishedPostSlugs } from '@/lib/posts/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ]

  try {
    // Dynamic project pages
    const projectSlugs = await getPublishedProjectSlugs()
    const projectPages = projectSlugs.map((slug) => ({
      url: `${baseUrl}/projects/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    // Dynamic blog post pages
    const postSlugs = await getPublishedPostSlugs()
    const postPages = postSlugs.map(({ slug, language }) => ({
      url: `${baseUrl}/blog/${language}/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [...staticPages, ...projectPages, ...postPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages only if dynamic content fails
    return staticPages
  }
}