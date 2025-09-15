'use client';

/**
 * ProjectGrid Component
 * 
 * Masonry-style grid layout for displaying multiple projects using CSS Grid
 */

import { useState, useMemo } from 'react';
import { Project } from '@/lib/projects';
import { ProjectCard } from './ProjectCard';

interface ProjectGridProps {
  projects: Project[];
  className?: string;
  onProjectClick?: (project: Project) => void;
  showActions?: boolean;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  searchQuery?: string;
  selectedTags?: string[];
  showFilters?: boolean;
}

export function ProjectGrid({
  projects,
  className = '',
  onProjectClick,
  showActions = false,
  onEdit,
  onDelete,
  searchQuery = '',
  selectedTags = [],
  showFilters = false,
}: ProjectGridProps) {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  // Get all unique tags from projects
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    projects.forEach(project => {
      project.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [projects]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.tags.some(tag => tag.toLowerCase().includes(query)) ||
        project.metadata.tech_stack?.some(tech => tech.toLowerCase().includes(query))
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(project =>
        selectedTags.some(tag => project.tags.includes(tag))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'oldest':
        return filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'title':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return filtered;
    }
  }, [projects, searchQuery, selectedTags, sortBy]);

  if (projects.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500 mb-4">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No projects yet</h3>
        <p className="text-gray-600 dark:text-gray-400">
          {showActions ? 'Create your first project to get started.' : 'Check back later for new projects.'}
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Filters */}
      {showFilters && (
        <div className="mb-8 space-y-4">
          {/* Sort Options */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by tags:
              </label>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      // This would need to be handled by parent component
                      // For now, it's just visual
                    }}
                    className={`
                      inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors
                      ${selectedTags.includes(tag)
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }
                    `}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      {(searchQuery || selectedTags.length > 0) && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filteredProjects.length} of {projects.length} projects
            {searchQuery && ` matching "${searchQuery}"`}
            {selectedTags.length > 0 && ` tagged with ${selectedTags.join(', ')}`}
          </p>
        </div>
      )}

      {/* No Results */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No projects found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        /* Masonry Grid */
        <div 
          className="grid gap-6 auto-rows-max"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          }}
        >
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="break-inside-avoid"
              style={{
                // Stagger animation delays for a more organic feel
                animationDelay: `${index * 50}ms`,
              }}
            >
              <ProjectCard
                project={project}
                onClick={onProjectClick}
                showActions={showActions}
                onEdit={onEdit}
                onDelete={onDelete}
                className="animate-fade-in-up"
              />
            </div>
          ))}
        </div>
      )}

      {/* Load More (placeholder for future pagination) */}
      {filteredProjects.length >= 12 && (
        <div className="mt-12 text-center">
          <button className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-800">
            Load more projects
          </button>
        </div>
      )}
    </div>
  );
}

// CSS for animations (to be added to globals.css)
export const projectGridStyles = `
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

/* Masonry layout fallback for older browsers */
@supports not (grid-template-rows: masonry) {
  .masonry-grid {
    column-count: auto;
    column-width: 320px;
    column-gap: 1.5rem;
  }
  
  .masonry-grid > * {
    break-inside: avoid;
    margin-bottom: 1.5rem;
  }
}
`;