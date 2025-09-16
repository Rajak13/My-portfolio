'use client';

/**
 * ProjectCard Component
 * 
 * Interactive card component for displaying project information with hover animations
 */

import { useState } from 'react';
import { Project } from '@/lib/projects';
import { ImageOptimized } from '@/components/media';

interface ProjectCardProps {
  project: Project;
  className?: string;
  onClick?: (project: Project) => void;
  showActions?: boolean;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

export function ProjectCard({ 
  project, 
  className = '', 
  onClick,
  showActions = false,
  onEdit,
  onDelete
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    if (onClick) {
      onClick(project);
    } else {
      // Default navigation to project detail page
      window.location.href = `/projects/${project.slug}`;
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(project);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(project);
    }
  };

  return (
    <article
      className={`
        group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700
        transition-all duration-300 ease-out cursor-pointer
        hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50
        hover:-translate-y-1 hover:border-gray-300 dark:hover:border-gray-600
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Cover Image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-700">
        {project.cover_path && !imageError ? (
          <ImageOptimized
            src={project.cover_path}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No image</p>
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        {!project.published && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              Draft
            </span>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className={`
            absolute top-3 right-3 flex gap-2 transition-opacity duration-200
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}>
            {onEdit && (
              <button
                onClick={handleEdit}
                className="rounded-full bg-white/90 p-2 text-gray-600 shadow-sm transition-colors hover:bg-white hover:text-blue-600 dark:bg-gray-800/90 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                title="Edit project"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="rounded-full bg-white/90 p-2 text-gray-600 shadow-sm transition-colors hover:bg-white hover:text-red-600 dark:bg-gray-800/90 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-red-400"
                title="Delete project"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        {project.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
            {project.description}
          </p>
        )}

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                +{project.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Tech Stack */}
        {project.metadata.tech_stack && project.metadata.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {project.metadata.tech_stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              >
                {tech}
              </span>
            ))}
            {project.metadata.tech_stack.length > 4 && (
              <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                +{project.metadata.tech_stack.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-4 pt-2 border-t border-gray-100 dark:border-gray-700">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Code
            </a>
          )}
          {project.live_demo_url && (
            <a
              href={project.live_demo_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Demo
            </a>
          )}
          {project.metadata.duration && (
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
              {project.metadata.duration}
            </span>
          )}
        </div>
      </div>

      {/* Hover Overlay Effect */}
      <div className={`
        absolute inset-0 rounded-lg bg-gradient-to-t from-blue-600/5 to-transparent pointer-events-none
        transition-opacity duration-300
        ${isHovered ? 'opacity-100' : 'opacity-0'}
      `} />
    </article>
  );
}