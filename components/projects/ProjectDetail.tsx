'use client';

/**
 * ProjectDetail Component
 * 
 * Detailed view of a single project with full information and interactive elements
 */

import { useState } from 'react';
import { Project } from '@/lib/projects';
import { ImageOptimized } from '@/components/media';

interface ProjectDetailProps {
  project: Project;
  className?: string;
  showEditButton?: boolean;
  onEdit?: (project: Project) => void;
}

export function ProjectDetail({
  project,
  className = '',
  showEditButton = false,
  onEdit,
}: ProjectDetailProps) {
  const [imageError, setImageError] = useState(false);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(project);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <article className={`max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {project.title}
            </h1>
            
            {/* Status and Date */}
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span className={`
                  inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                  ${project.published 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }
                `}>
                  {project.published ? 'Published' : 'Draft'}
                </span>
                {project.published_at && (
                  <span>Published {formatDate(project.published_at)}</span>
                )}
              </div>
              
              {project.metadata.duration && (
                <span>Duration: {project.metadata.duration}</span>
              )}
              
              {project.metadata.role && (
                <span>Role: {project.metadata.role}</span>
              )}
            </div>
          </div>

          {/* Edit Button */}
          {showEditButton && onEdit && (
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Project
            </button>
          )}
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-4">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View Code
            </a>
          )}
          
          {project.live_demo_url && (
            <a
              href={project.live_demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Live Demo
            </a>
          )}
        </div>
      </header>

      {/* Cover Image */}
      {project.cover_path && !imageError && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 mb-8">
          <ImageOptimized
            src={project.cover_path}
            alt={project.title}
            fill
            className="object-cover"
            priority
            onError={() => setImageError(true)}
          />
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          {project.description && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                About This Project
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {project.description}
                </p>
              </div>
            </section>
          )}

          {/* Tech Stack */}
          {project.metadata.tech_stack && project.metadata.tech_stack.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Technologies Used
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {project.metadata.tech_stack.map((tech) => (
                  <div
                    key={tech}
                    className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    {tech}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Additional Metadata */}
          {Object.keys(project.metadata).some(key => !['tech_stack', 'duration', 'role'].includes(key)) && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Additional Details
              </h2>
              <div className="space-y-3">
                {Object.entries(project.metadata)
                  .filter(([key]) => !['tech_stack', 'duration', 'role'].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="flex items-start gap-3">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize min-w-0 flex-shrink-0">
                        {key.replace(/_/g, ' ')}:
                      </dt>
                      <dd className="text-sm text-gray-900 dark:text-white">
                        {typeof value === 'string' ? value : JSON.stringify(value)}
                      </dd>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Project Info
            </h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</dt>
                <dd className="text-sm text-gray-900 dark:text-white">
                  {formatDate(project.created_at)}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
                <dd className="text-sm text-gray-900 dark:text-white">
                  {formatDate(project.updated_at)}
                </dd>
              </div>

              {project.metadata.duration && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">
                    {project.metadata.duration}
                  </dd>
                </div>
              )}

              {project.metadata.role && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">My Role</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">
                    {project.metadata.role}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View Source Code
                </a>
              )}
              
              {project.live_demo_url && (
                <a
                  href={project.live_demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Visit Live Site
                </a>
              )}
              
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: project.title,
                      text: project.description,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Share Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}