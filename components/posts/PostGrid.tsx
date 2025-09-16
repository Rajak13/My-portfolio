'use client';

import { useState, useMemo } from 'react';
import { Post, LanguageCode } from '@/lib/posts/types';
import { PostCard } from './PostCard';

interface PostGridProps {
  posts: Post[];
  className?: string;
  onPostClick?: (post: Post) => void;
  showLanguageFilter?: boolean;
}

export function PostGrid({ 
  posts, 
  className = '', 
  onPostClick,
  showLanguageFilter = true 
}: PostGridProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get available languages from posts
  const availableLanguages = useMemo(() => {
    const languages = new Set(posts.map(post => post.language));
    return Array.from(languages).sort();
  }, [posts]);

  // Filter posts based on language and search
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by language
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(post => post.language === selectedLanguage);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [posts, selectedLanguage, searchQuery]);

  const handlePostClick = (post: Post) => {
    onPostClick?.(post);
  };

  if (posts.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No posts found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            There are no blog posts to display at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Filters */}
      {(showLanguageFilter || availableLanguages.length > 1) && (
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Language Filter */}
          {showLanguageFilter && availableLanguages.length > 1 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedLanguage('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedLanguage === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All Languages ({posts.length})
              </button>
              {availableLanguages.map((language) => {
                const count = posts.filter(post => post.language === language).length;
                return (
                  <button
                    key={language}
                    onClick={() => setSelectedLanguage(language)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedLanguage === language
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {language.toUpperCase()} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      {(searchQuery || selectedLanguage !== 'all') && (
        <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          {filteredPosts.length === 0 ? (
            'No posts match your filters'
          ) : (
            `Showing ${filteredPosts.length} of ${posts.length} posts`
          )}
        </div>
      )}

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid gap-6 md:gap-8">
          {/* Featured post (first post gets larger treatment) */}
          {filteredPosts.length > 0 && (
            <PostCard
              post={filteredPosts[0]}
              onClick={handlePostClick}
              className="md:col-span-2 lg:col-span-3"
            />
          )}

          {/* Regular posts grid */}
          {filteredPosts.length > 1 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.slice(1).map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onClick={handlePostClick}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No matching posts
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Try adjusting your search or filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedLanguage('all');
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}