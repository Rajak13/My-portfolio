/**
 * Post Validation Utilities
 * 
 * Validation functions and schemas for blog post data
 */

import { CreatePostInput, UpdatePostInput } from './types';

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
 * Validates post creation input
 */
export function validateCreatePost(input: CreatePostInput): ValidationResult {
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

  if (!input.body?.trim()) {
    errors.push({ field: 'body', message: 'Post content is required' });
  } else if (input.body.length > 50000) {
    errors.push({ field: 'body', message: 'Post content must be 50,000 characters or less' });
  }

  // Optional field validation
  if (input.excerpt && input.excerpt.length > 500) {
    errors.push({ field: 'excerpt', message: 'Excerpt must be 500 characters or less' });
  }

  // Language validation
  if (input.language && !['en', 'ne'].includes(input.language)) {
    errors.push({ field: 'language', message: 'Language must be either "en" or "ne"' });
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

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates post update input
 */
export function validateUpdatePost(input: UpdatePostInput): ValidationResult {
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

  if (input.body !== undefined) {
    if (!input.body?.trim()) {
      errors.push({ field: 'body', message: 'Post content cannot be empty' });
    } else if (input.body.length > 50000) {
      errors.push({ field: 'body', message: 'Post content must be 50,000 characters or less' });
    }
  }

  if (input.excerpt !== undefined && input.excerpt && input.excerpt.length > 500) {
    errors.push({ field: 'excerpt', message: 'Excerpt must be 500 characters or less' });
  }

  if (input.language !== undefined && !['en', 'ne'].includes(input.language)) {
    errors.push({ field: 'language', message: 'Language must be either "en" or "ne"' });
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

  return {
    isValid: errors.length === 0,
    errors
  };
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
 * Generates an excerpt from post body
 */
export function generateExcerpt(body: string, maxLength: number = 200): string {
  // Remove markdown formatting for excerpt
  const plainText = body
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Find the last complete word within the limit
  const truncated = plainText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
}

/**
 * Sanitizes post input data
 */
export function sanitizePostInput<T extends CreatePostInput | UpdatePostInput>(input: T): T {
  const sanitized = { ...input };

  // Trim string fields
  if (sanitized.title) {
    sanitized.title = sanitized.title.trim();
  }
  if (sanitized.slug) {
    sanitized.slug = sanitized.slug.trim().toLowerCase();
  }
  if (sanitized.excerpt) {
    sanitized.excerpt = sanitized.excerpt.trim();
  }
  if (sanitized.body) {
    sanitized.body = sanitized.body.trim();
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