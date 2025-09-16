import { Layout } from '@/components/layout'
import { ProjectGrid } from '@/components/projects'
import { PostGrid } from '@/components/posts'
import { getPublishedProjects } from '@/lib/projects/api'
import { getAllPublishedPosts } from '@/lib/posts/api'
import Link from 'next/link'

// Static generation for homepage
export const revalidate = 3600 // Revalidate every hour

async function getFeaturedContent() {
  try {
    const [projects, posts] = await Promise.all([
      getPublishedProjects(),
      getAllPublishedPosts()
    ])
    
    return {
      featuredProjects: projects.slice(0, 3), // Show 3 featured projects
      featuredPosts: posts.slice(0, 2), // Show 2 featured posts
    }
  } catch (error) {
    console.error('Error fetching featured content:', error)
    return {
      featuredProjects: [],
      featuredPosts: [],
    }
  }
}

export default async function Home() {
  const { featuredProjects, featuredPosts } = await getFeaturedContent()

  return (
    <Layout.Root>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <Layout.Asymmetric className="container mx-auto px-4 py-16 lg:py-24">
          {/* Main hero content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Creative
              <span className="block text-blue-600 dark:text-blue-400">
                Developer
              </span>
              <span className="block text-lg lg:text-xl font-normal text-gray-600 dark:text-gray-300 mt-4">
                Building digital experiences with modern technologies
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
              Welcome to my portfolio where I showcase projects, share insights through blog posts, 
              and demonstrate expertise in full-stack development, design, and user experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                View Projects
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Read Blog
              </Link>
            </div>
          </div>

          {/* Hero visual element */}
          <div className="lg:col-span-5 flex items-center justify-center mt-12 lg:mt-0">
            <div className="relative">
              <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 opacity-20 animate-pulse" />
              <div className="absolute inset-0 w-64 h-64 lg:w-80 lg:h-80 rounded-full border-4 border-blue-200 dark:border-blue-800 animate-spin" style={{ animationDuration: '20s' }} />
              <div className="absolute inset-8 bg-white dark:bg-gray-800 rounded-full shadow-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {featuredProjects.length}+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Projects
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Layout.Asymmetric>
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Projects
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                A selection of recent work showcasing different technologies and approaches
              </p>
            </div>
            
            <ProjectGrid 
              projects={featuredProjects}
              className="mb-8"
            />
            
            <div className="text-center">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                View all projects
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Blog Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Latest Insights
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Thoughts on development, design, and technology trends
              </p>
            </div>
            
            <PostGrid 
              posts={featuredPosts}
              showLanguageFilter={false}
              className="mb-8"
            />
            
            <div className="text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Read all posts
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action Section */}
      <section className="py-16 bg-blue-600 dark:bg-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Let&apos;s Work Together
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Interested in collaborating on a project or have questions about my work? 
            I&apos;d love to hear from you.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </Layout.Root>
  )
}
