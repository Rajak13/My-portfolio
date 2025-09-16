import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/lib/providers/Providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: {
    default: 'Portfolio | Creative Developer',
    template: '%s | Portfolio'
  },
  description: 'A modern, interactive portfolio showcasing web development projects, blog posts, and creative solutions. Built with Next.js, TypeScript, and modern web technologies.',
  keywords: ['web development', 'portfolio', 'React', 'Next.js', 'TypeScript', 'full-stack developer'],
  authors: [{ name: 'Portfolio Author' }],
  creator: 'Portfolio Author',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
    title: 'Portfolio | Creative Developer',
    description: 'A modern, interactive portfolio showcasing web development projects, blog posts, and creative solutions.',
    siteName: 'Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio | Creative Developer',
    description: 'A modern, interactive portfolio showcasing web development projects, blog posts, and creative solutions.',
    creator: '@username',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Portfolio Author',
    jobTitle: 'Full Stack Developer',
    description: 'Creative developer specializing in modern web applications',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
    sameAs: [
      'https://github.com/username',
      'https://linkedin.com/in/username',
      'https://twitter.com/username',
    ],
    knowsAbout: [
      'Web Development',
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'Full Stack Development'
    ],
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
