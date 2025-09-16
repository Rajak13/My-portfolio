import { Layout } from '@/components/layout'
import { PostGrid } from '@/components/posts'
import { getAllPublishedPosts } from '@/lib/posts/api'
import { Metadata } from 'next'

// ISR configuration - revalidate every hour
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Blog | Portfolio',
  description: 'Read my thoughts on web development, technology trends, and creative problem-solving. Available in English and Nepali.',
  openGraph: {
    title: 'Blog | Portfolio',
    description: 'Read my thoughts on web development, technology trends, and creative problem-solving. Available in English and Nepali.',
    type: 'website',
  },
}

async function getPosts() {
  try {
    return await getAllPublishedPosts()
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export default async function BlogPage() {
  const posts = await getPosts()
  
  // Get language statistics
  const englishPosts = posts.filter(post => post.language === 'en')
  const nepaliPosts = posts.filter(post => post.language === 'ne')
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)))

  return (
    <Layout.Root>
      {/* Header Section */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Blog
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Insights on web development, technology trends, and creative problem-solving. 
              Written in both English and Nepali to reach a broader audience.
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {posts.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Posts
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {englishPosts.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  English
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {nepaliPosts.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  नेपाली
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {allTags.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Topics
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <PostGrid 
            posts={posts}
            showLanguageFilter={true}
          />
        </div>
      </section>

      {/* Topics Section */}
      {allTags.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Topics Covered
              </h2>
              
              <div className="flex flex-wrap justify-center gap-3">
                {allTags.map((tag) => {
                  const tagCount = posts.filter(post => post.tags.includes(tag)).length
                  return (
                    <span
                      key={tag}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
                    >
                      {tag} ({tagCount})
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter/Subscribe Section */}
      <section className="py-16 bg-purple-600 dark:bg-purple-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
            Get notified when I publish new posts about web development, 
            technology insights, and creative solutions.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-md border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600"
              />
              <button className="px-6 py-3 bg-white text-purple-600 font-medium rounded-md hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-purple-200 mt-3">
              No spam, unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </Layout.Root>
  )
}