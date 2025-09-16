import { Layout } from '@/components/layout'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About | Portfolio',
  description: 'Learn more about my background, skills, experience, and approach to web development and design.',
  openGraph: {
    title: 'About | Portfolio',
    description: 'Learn more about my background, skills, experience, and approach to web development and design.',
    type: 'website',
  },
}

// This could be moved to a CMS or database in the future
const skills = [
  {
    category: 'Frontend',
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue.js', 'Svelte']
  },
  {
    category: 'Backend',
    technologies: ['Node.js', 'Python', 'PostgreSQL', 'Supabase', 'Express', 'FastAPI']
  },
  {
    category: 'Tools & Platforms',
    technologies: ['Git', 'Docker', 'Vercel', 'AWS', 'Figma', 'VS Code']
  },
  {
    category: 'Languages',
    technologies: ['JavaScript', 'TypeScript', 'Python', 'HTML/CSS', 'SQL', 'Bash']
  }
]

const experience = [
  {
    title: 'Senior Full Stack Developer',
    company: 'Tech Company',
    period: '2022 - Present',
    description: 'Leading development of modern web applications using React, Next.js, and cloud technologies. Mentoring junior developers and architecting scalable solutions.',
    achievements: [
      'Built and deployed 15+ production applications',
      'Improved application performance by 40% through optimization',
      'Led a team of 4 developers on major product launches'
    ]
  },
  {
    title: 'Frontend Developer',
    company: 'Digital Agency',
    period: '2020 - 2022',
    description: 'Developed responsive web applications and collaborated with design teams to create engaging user experiences.',
    achievements: [
      'Delivered 25+ client projects on time and within budget',
      'Implemented modern frontend architectures and best practices',
      'Reduced development time by 30% through component libraries'
    ]
  },
  {
    title: 'Web Developer',
    company: 'Startup',
    period: '2018 - 2020',
    description: 'Full-stack development of web applications, from concept to deployment, working in a fast-paced startup environment.',
    achievements: [
      'Built the company&apos;s main product from scratch',
      'Implemented CI/CD pipelines and automated testing',
      'Contributed to product strategy and technical decisions'
    ]
  }
]

const education = [
  {
    degree: 'Bachelor of Computer Science',
    institution: 'University Name',
    period: '2014 - 2018',
    description: 'Focused on software engineering, algorithms, and web technologies. Graduated with honors.'
  }
]

export default function AboutPage() {
  return (
    <Layout.Root>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-16">
        <div className="container mx-auto px-4">
          <Layout.Asymmetric>
            {/* Profile Image */}
            <div className="lg:col-span-4 flex justify-center lg:justify-start">
              <div className="relative">
                <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {/* Placeholder for profile image */}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600">
                    <div className="text-white text-6xl font-bold">
                      P
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* About Content */}
            <div className="lg:col-span-8 mt-8 lg:mt-0">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                About Me
              </h1>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  I&apos;m a passionate full-stack developer with over 5 years of experience creating 
                  modern web applications. I specialize in React, Next.js, and TypeScript, 
                  with a strong focus on user experience and performance optimization.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  My journey in web development started with a curiosity about how websites work, 
                  which led me to dive deep into both frontend and backend technologies. 
                  I believe in writing clean, maintainable code and creating solutions that 
                  not only work well but also provide exceptional user experiences.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  When I&apos;m not coding, you can find me exploring new technologies, contributing 
                  to open source projects, or sharing knowledge through blog posts and mentoring.
                </p>
              </div>

              {/* Contact Links */}
              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:contact@example.com"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Get in Touch
                </a>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Resume
                </a>
              </div>
            </div>
          </Layout.Asymmetric>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Skills & Technologies
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map((skillGroup) => (
              <div key={skillGroup.category} className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {skillGroup.category}
                </h3>
                <div className="space-y-2">
                  {skillGroup.technologies.map((tech) => (
                    <div
                      key={tech}
                      className="inline-block mx-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {tech}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Experience
          </h2>
          
          <div className="max-w-4xl mx-auto">
            {experience.map((job, index) => (
              <div key={index} className="relative pl-8 pb-12 last:pb-0">
                {/* Timeline line */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-600" />
                
                {/* Timeline dot */}
                <div className="absolute left-0 top-2 w-3 h-3 bg-blue-600 rounded-full transform -translate-x-1/2" />
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {job.title}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">
                        {job.company}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-2 lg:mt-0">
                      {job.period}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {job.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {job.achievements.map((achievement, achievementIndex) => (
                      <li key={achievementIndex} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Education
          </h2>
          
          <div className="max-w-2xl mx-auto">
            {education.map((edu, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {edu.degree}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                      {edu.institution}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mt-2 lg:mt-0">
                    {edu.period}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {edu.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 dark:bg-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Let&apos;s Build Something Amazing
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            I&apos;m always interested in new opportunities and exciting projects. 
            Whether you have a specific idea or just want to chat about technology, 
            I&apos;d love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-colors"
            >
              View My Work
            </Link>
            <a
              href="mailto:contact@example.com"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 text-base font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Contact Me
            </a>
          </div>
        </div>
      </section>
    </Layout.Root>
  )
}