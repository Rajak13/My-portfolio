/**
 * Project Management System
 * 
 * Main exports for the project management functionality
 */

// Types
export type {
  Project,
  ProjectMetadata,
  CreateProjectInput,
  UpdateProjectInput,
  ProjectFilters,
  ProjectCardProps,
  ProjectGridProps,
  ProjectDetailProps,
  ProjectFormProps,
  ProjectRow,
} from './types';

// API functions
export {
  getProjects,
  getPublishedProjects,
  getProjectById,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  getUserProjects,
  getPublishedProjectSlugs,
  getPublishedProjectBySlug,
} from './api';

// Validation utilities
export {
  validateCreateProject,
  validateUpdateProject,
  generateSlug,
  sanitizeProjectInput,
} from './validation';

export type { ValidationError, ValidationResult } from './validation';