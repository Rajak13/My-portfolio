/**
 * Project Validation Utilities
 * 
 * Validation functions and schemas for project data
 */

import { CreateProjectInput, UpdateProjectInput, ProjectMetadata } from './types';

// URL validation regex
const URL_REGEX = /^https?:\/\/.+/;

// Slug validation regex (lowercase letters, numbers, hyphens)
const SLUG_REGEX = /^[a-z0-9-]+$/;

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validates project creation input
 */
export function validateCreateProject(input: CreateProjectInput): ValidationResult {
  const errors: ValidationError[] = [];

  // Required fields
  if (!input.title?.trim()) {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (input.title.length > 200) {
    errors.push({ field: 'title', message: 'Title must be 200 characters or less' });
  }

  if (!input.slug?.trim()) {
    errors.push({ field: 'slug', message: 'Slug is required' });
  } else if (!SLUG_REGEX.test(input.slug)) {
    errors.push({ 
      field: 'slug', 
      message: 'Slug must contain only lowercase letters, numbers, and hyphens' 
    });
  } else if (input.slug.length > 100) {
    errors.push({ field: 'slug', message: 'Slug must be 100 characters or less' });
  }

  // Optional field validation
  if (input.description && input.description.length > 1000) {
    errors.push({ field: 'description', message: 'Description must be 1000 characters or less' });
  }

  if (input.github_url && !URL_REGEX.test(input.github_url)) {
    errors.push({ field: 'github_url', message: 'GitHub URL must be a valid URL' });
  }

  if (input.live_demo_url && !URL_REGEX.test(input.live_demo_url)) {
    errors.push({ field: 'live_demo_url', message: 'Live demo URL must be a valid URL' });
  }

  // Tags validation
  if (input.tags) {
    if (input.tags.length > 10) {
      errors.push({ field: 'tags', message: 'Maximum 10 tags allowed' });
    }
    
    for (const tag of input.tags) {
      if (!tag.trim()) {
        errors.push({ field: 'tags', message: 'Tags cannot be empty' });
        break;
      }
      if (tag.length > 50) {
        errors.push({ field: 'tags', message: 'Each tag must be 50 characters or less' });
        break;
      }
    }
  }

  // Metadata validation
  if (input.metadata) {
    const metadataErrors = validateProjectMetadata(input.metadata);
    errors.push(...metadataErrors);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates project update input
 */
export function validateUpdateProject(input: UpdateProjectInput): ValidationResult {
  const errors: ValidationError[] = [];

  // Only validate provided fields
  if (input.title !== undefined) {
    if (!input.title?.trim()) {
      errors.push({ field: 'title', message: 'Title cannot be empty' });
    } else if (input.title.length > 200) {
      errors.push({ field: 'title', message: 'Title must be 200 characters or less' });
    }
  }

  if (input.slug !== undefined) {
    if (!input.slug?.trim()) {
      errors.push({ field: 'slug', message: 'Slug cannot be empty' });
    } else if (!SLUG_REGEX.test(input.slug)) {
      errors.push({ 
        field: 'slug', 
        message: 'Slug must contain only lowercase letters, numbers, and hyphens' 
      });
    } else if (input.slug.length > 100) {
      errors.push({ field: 'slug', message: 'Slug must be 100 characters or less' });
    }
  }

  if (input.description !== undefined && input.description && input.description.length > 1000) {
    errors.push({ field: 'description', message: 'Description must be 1000 characters or less' });
  }

  if (input.github_url !== undefined && input.github_url && !URL_REGEX.test(input.github_url)) {
    errors.push({ field: 'github_url', message: 'GitHub URL must be a valid URL' });
  }

  if (input.live_demo_url !== undefined && input.live_demo_url && !URL_REGEX.test(input.live_demo_url)) {
    errors.push({ field: 'live_demo_url', message: 'Live demo URL must be a valid URL' });
  }

  if (input.tags !== undefined) {
    if (input.tags.length > 10) {
      errors.push({ field: 'tags', message: 'Maximum 10 tags allowed' });
    }
    
    for (const tag of input.tags) {
      if (!tag.trim()) {
        errors.push({ field: 'tags', message: 'Tags cannot be empty' });
        break;
      }
      if (tag.length > 50) {
        errors.push({ field: 'tags', message: 'Each tag must be 50 characters or less' });
        break;
      }
    }
  }

  if (input.metadata !== undefined) {
    const metadataErrors = validateProjectMetadata(input.metadata);
    errors.push(...metadataErrors);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates project metadata
 */
function validateProjectMetadata(metadata: ProjectMetadata): ValidationError[] {
  const errors: ValidationError[] = [];

  if (metadata.tech_stack) {
    if (!Array.isArray(metadata.tech_stack)) {
      errors.push({ field: 'metadata.tech_stack', message: 'Tech stack must be an array' });
    } else if (metadata.tech_stack.length > 20) {
      errors.push({ field: 'metadata.tech_stack', message: 'Maximum 20 tech stack items allowed' });
    } else {
      for (const tech of metadata.tech_stack) {
        if (typeof tech !== 'string' || !tech.trim()) {
          errors.push({ field: 'metadata.tech_stack', message: 'Tech stack items must be non-empty strings' });
          break;
        }
        if (tech.length > 50) {
          errors.push({ field: 'metadata.tech_stack', message: 'Each tech stack item must be 50 characters or less' });
          break;
        }
      }
    }
  }

  if (metadata.duration !== undefined && metadata.duration) {
    if (typeof metadata.duration !== 'string') {
      errors.push({ field: 'metadata.duration', message: 'Duration must be a string' });
    } else if (metadata.duration.length > 100) {
      errors.push({ field: 'metadata.duration', message: 'Duration must be 100 characters or less' });
    }
  }

  if (metadata.role !== undefined && metadata.role) {
    if (typeof metadata.role !== 'string') {
      errors.push({ field: 'metadata.role', message: 'Role must be a string' });
    } else if (metadata.role.length > 100) {
      errors.push({ field: 'metadata.role', message: 'Role must be 100 characters or less' });
    }
  }

  return errors;
}

/**
 * Generates a slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Sanitizes project input data
 */
export function sanitizeProjectInput<T extends CreateProjectInput | UpdateProjectInput>(input: T): T {
  const sanitized = { ...input };

  // Trim string fields
  if (sanitized.title) {
    sanitized.title = sanitized.title.trim();
  }
  if (sanitized.slug) {
    sanitized.slug = sanitized.slug.trim().toLowerCase();
  }
  if (sanitized.description) {
    sanitized.description = sanitized.description.trim();
  }
  if (sanitized.github_url) {
    sanitized.github_url = sanitized.github_url.trim();
  }
  if (sanitized.live_demo_url) {
    sanitized.live_demo_url = sanitized.live_demo_url.trim();
  }

  // Clean tags
  if (sanitized.tags) {
    sanitized.tags = sanitized.tags
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .filter((tag, index, arr) => arr.indexOf(tag) === index); // Remove duplicates
  }

  return sanitized;
}