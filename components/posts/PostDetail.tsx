'use client';

import { Post } from '@/lib/posts/types';
import { ImageOptimized } from '@/components/media';
import { formatDistanceToNow, format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

interface PostDetailProps {
  post: Post;
  className?: string;
}

export function PostDetail({ post, className = '' }: PostDetailProps) {
  return (
    <article className={`max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <header className="mb-8">
        {/* Cover Image */}
        {post.cover_path && (
          <div className="aspect-video mb-8 overflow-hidden rounded-lg">
            <ImageOptimized
              src={post.cover_path}
              alt={post.title}
              width={800}
              height={450}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
          {/* Publication Status */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${post.published ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span>{post.published ? 'Published' : 'Draft'}</span>
          </div>

          {/* Language */}
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span>{post.language === 'en' ? 'English' : 'Nepali'}</span>
          </div>

          {/* Published Date */}
          {post.published_at && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time dateTime={post.published_at}>
                {format(new Date(post.published_at), 'MMMM d, yyyy')}
              </time>
              <span>({formatDistanceToNow(new Date(post.published_at), { addSuffix: true })})</span>
            </div>
          )}

          {/* Reading Time Estimate */}
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{Math.max(1, Math.ceil(post.body.split(' ').length / 200))} min read</span>
          </div>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
          components={{
            // Custom heading renderer with anchor links
            h1: ({ children, ...props }) => (
              <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white" {...props}>
                {children}
              </h1>
            ),
            h2: ({ children, ...props }) => (
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white" {...props}>
                {children}
              </h2>
            ),
            h3: ({ children, ...props }) => (
              <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white" {...props}>
                {children}
              </h3>
            ),
            // Custom paragraph styling
            p: ({ children, ...props }) => (
              <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300" {...props}>
                {children}
              </p>
            ),
            // Custom link styling
            a: ({ children, href, ...props }) => (
              <a
                href={href}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-blue-300 dark:decoration-blue-600 underline-offset-2 hover:decoration-blue-600 dark:hover:decoration-blue-400 transition-colors"
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                {...props}
              >
                {children}
              </a>
            ),
            // Custom blockquote styling
            blockquote: ({ children, ...props }) => (
              <blockquote
                className="border-l-4 border-blue-500 pl-4 py-2 my-6 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg"
                {...props}
              >
                <div className="text-gray-700 dark:text-gray-300 italic">
                  {children}
                </div>
              </blockquote>
            ),
            // Custom code block styling
            pre: ({ children, ...props }) => (
              <pre
                className="bg-gray-900 dark:bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto my-6 text-sm"
                {...props}
              >
                {children}
              </pre>
            ),
            // Custom inline code styling
            code: ({ children, className, ...props }) => {
              // Check if it's a code block (has className) or inline code
              const isCodeBlock = className?.includes('language-');
              
              if (isCodeBlock) {
                return <code className={className} {...props}>{children}</code>;
              }
              
              return (
                <code
                  className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            // Custom list styling
            ul: ({ children, ...props }) => (
              <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props}>
                {children}
              </ul>
            ),
            ol: ({ children, ...props }) => (
              <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props}>
                {children}
              </ol>
            ),
            // Custom table styling
            table: ({ children, ...props }) => (
              <div className="overflow-x-auto my-6">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props}>
                  {children}
                </table>
              </div>
            ),
            thead: ({ children, ...props }) => (
              <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
                {children}
              </thead>
            ),
            th: ({ children, ...props }) => (
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                {...props}
              >
                {children}
              </th>
            ),
            td: ({ children, ...props }) => (
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100" {...props}>
                {children}
              </td>
            ),
            // Custom image styling
            img: ({ src, alt, width, height }) => (
              <div className="my-8">
                <ImageOptimized
                  src={src || ''}
                  alt={alt || ''}
                  width={typeof width === 'string' ? parseInt(width) : width || 800}
                  height={typeof height === 'string' ? parseInt(height) : height || 400}
                  className="rounded-lg shadow-lg"
                />
                {alt && (
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                    {alt}
                  </p>
                )}
              </div>
            ),
          }}
        >
          {post.body}
        </ReactMarkdown>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div>
            Last updated: {format(new Date(post.updated_at), 'MMMM d, yyyy')}
          </div>
          
          {/* Share buttons could go here */}
          <div className="flex items-center gap-4">
            <span>Share this post:</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: post.title,
                      text: post.excerpt,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Share post"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
}