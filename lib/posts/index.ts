/**
 * Posts Module Exports
 * 
 * Central export file for the posts management system
 */

// Types
export type {
  Post,
  PostRow,
  CreatePostInput,
  UpdatePostInput,
  PostFilters,
  PostCardProps,
  PostGridProps,
  PostDetailProps,
  PostFormProps,
  MarkdownEditorProps,
  LanguageCode,
} from './types';

// API functions
export {
  getPosts,
  getPublishedPosts,
  getPostById,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
  publishPost,
  unpublishPost,
  getPublishedPostSlugs,
  getPublishedPostBySlug,
  getAllPublishedPosts,
} from './api';

// Validation functions
export {
  validateCreatePost,
  validateUpdatePost,
  generateSlug,
  generateExcerpt,
  sanitizePostInput,
} from './validation';

export type { ValidationError, ValidationResult } from './validation';