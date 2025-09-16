import { Layout } from '@/components/layout'
import { ProjectDetail } from '@/components/projects'
import { getPublishedProjectSlugs, getPublishedProjectBySlug } from '@/lib/projects/api'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

// Static generation configuration
export const dynamicParams = false // Only generate for known slugs

// Generate static params for all published projects
export async function generateStaticParams() {
  try {
    const slugs = await getPublishedProjectSlugs()
    return slugs.map((slug) => ({
      slug: slug,
    }))
  } catch (error) {
    console.error('Error generating static params for projects:', error)
    return []
  }
}

// Generate metadata for each project page
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  try {
    const project = await getPublishedProjectBySlug(params.slug)
    
    if (!project) {
      return {
        title: 'Project Not Found',
      }
    }

    return {
      title: `${project.title} | Projects`,
      description: project.description || `Learn more about ${project.title}, a project showcasing modern web development techniques.`,
      openGraph: {
        title: project.title,
        description: project.description || `Learn more about ${project.title}`,
        type: 'article',
        images: project.cover_path ? [
          {
            url: project.cover_path,
            width: 1200,
            height: 630,
            alt: project.title,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: project.title,
        description: project.description || `Learn more about ${project.title}`,
        images: project.cover_path ? [project.cover_path] : [],
      },
    }
  } catch (error) {
    console.error('Error generating metadata for project:', error)
    return {
      title: 'Project Not Found',
    }
  }
}

interface ProjectPageProps {
  params: {
    slug: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  let project
  
  try {
    project = await getPublishedProjectBySlug(params.slug)
  } catch (error) {
    console.error('Error fetching project:', error)
    notFound()
  }

  if (!project) {
    notFound()
  }

  return (
    <Layout.Root>
      <ProjectDetail project={project} />
    </Layout.Root>
  )
}