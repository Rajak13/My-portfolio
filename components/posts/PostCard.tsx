'use client';

import { Post } from '@/lib/posts/types';
import { ImageOptimized } from '@/components/media';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
  className?: string;
  onClick?: (post: Post) => void;
}

export function PostCard({ post, className = '', onClick }: PostCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(post);
    } else {
      // Default navigation to post detail page
      window.location.href = `/blog/${post.language}/${post.slug}`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <article
      className={`group cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Read post: ${post.title}`}
    >
      {/* Cover Image */}
      {post.cover_path && (
        <div className="aspect-video overflow-hidden">
          <ImageOptimized
            src={post.cover_path}
            alt={post.title}
            width={400}
            height={225}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {post.title}
            </h3>
          </div>
          
          {/* Language Badge */}
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shrink-0">
            {post.language.toUpperCase()}
          </span>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            {/* Publication Status */}
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${post.published ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span>{post.published ? 'Published' : 'Draft'}</span>
            </div>

            {/* Published Date */}
            {post.published_at && (
              <time dateTime={post.published_at}>
                {formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
              </time>
            )}
          </div>

          {/* Read More Indicator */}
          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
            <span>Read more</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </article>
  );
}