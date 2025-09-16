import { Layout } from '@/components/layout'
import { ProjectGrid } from '@/components/projects'
import { getPublishedProjects } from '@/lib/projects/api'
import { Metadata } from 'next'

// ISR configuration - revalidate every hour
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Projects | Portfolio',
  description: 'Explore my portfolio of web development projects, showcasing modern technologies and creative solutions.',
  openGraph: {
    title: 'Projects | Portfolio',
    description: 'Explore my portfolio of web development projects, showcasing modern technologies and creative solutions.',
    type: 'website',
  },
}

async function getProjects() {
  try {
    return await getPublishedProjects()
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <Layout.Root>
      {/* Header Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Projects
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              A collection of web applications, tools, and experiments showcasing 
              different technologies, design approaches, and problem-solving techniques.
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {projects.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Projects
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {new Set(projects.flatMap(p => p.metadata.tech_stack || [])).size}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Technologies
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {projects.filter(p => p.github_url).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Open Source
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ProjectGrid 
            projects={projects}
            showFilters={true}
          />
        </div>
      </section>

      {/* Technology Stack Section */}
      {projects.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Technologies Used
              </h2>
              
              <div className="flex flex-wrap justify-center gap-3">
                {Array.from(new Set(projects.flatMap(p => p.metadata.tech_stack || []))).map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout.Root>
  )
}