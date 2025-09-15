/**
 * Project API Functions
 * 
 * CRUD operations for projects using Supabase client
 */

import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/server';
import { Database } from '@/lib/supabase/types';
import { 
  Project, 
  ProjectRow, 
  CreateProjectInput, 
  UpdateProjectInput, 
  ProjectFilters 
} from './types';
import { validateCreateProject, validateUpdateProject, sanitizeProjectInput } from './validation';

/**
 * Transforms database row to Project interface
 */
function transformProjectRow(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description || undefined,
    cover_path: row.cover_path || undefined,
    github_url: row.github_url || undefined,
    live_demo_url: row.live_demo_url || undefined,
    tags: row.tags || [],
    metadata: row.metadata || {},
    published: row.published,
    published_at: row.published_at || undefined,
    created_by: row.created_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/**
 * Get all projects with optional filtering
 */
export async function getProjects(filters?: ProjectFilters): Promise<Project[]> {
  
  let query = supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  // Apply filters
  if (filters?.published !== undefined) {
    query = query.eq('published', filters.published);
  }

  if (filters?.created_by) {
    query = query.eq('created_by', filters.created_by);
  }

  if (filters?.tags && filters.tags.length > 0) {
    query = query.overlaps('tags', filters.tags);
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return data.map(transformProjectRow);
}

/**
 * Get published projects (public API)
 */
export async function getPublishedProjects(): Promise<Project[]> {
  return getProjects({ published: true });
}

/**
 * Get project by ID
 */
export async function getProjectById(id: string): Promise<Project | null> {
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to fetch project: ${error.message}`);
  }

  return transformProjectRow(data);
}

/**
 * Get project by slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to fetch project: ${error.message}`);
  }

  return transformProjectRow(data);
}

/**
 * Create a new project
 */
export async function createProject(input: CreateProjectInput): Promise<Project> {
  
  // Validate input
  const sanitizedInput = sanitizeProjectInput(input);
  const validation = validateCreateProject(sanitizedInput);
  
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
  }

  // Check if slug already exists
  const existingProject = await getProjectBySlug(sanitizedInput.slug);
  if (existingProject) {
    throw new Error('A project with this slug already exists');
  }

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('Authentication required');
  }

  // Prepare data for insertion
  const projectData: Database['public']['Tables']['projects']['Insert'] = {
    title: sanitizedInput.title,
    slug: sanitizedInput.slug,
    description: sanitizedInput.description || null,
    cover_path: sanitizedInput.cover_path || null,
    github_url: sanitizedInput.github_url || null,
    live_demo_url: sanitizedInput.live_demo_url || null,
    tags: sanitizedInput.tags || [],
    metadata: sanitizedInput.metadata || {},
    published: sanitizedInput.published || false,
    published_at: sanitizedInput.published ? new Date().toISOString() : null,
    created_by: user.id,
  };

  const { data, error } = await (supabase as any)
    .from('projects')
    .insert(projectData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create project: ${error.message}`);
  }

  return transformProjectRow(data);
}

/**
 * Update an existing project
 */
export async function updateProject(id: string, input: UpdateProjectInput): Promise<Project> {
  
  // Validate input
  const sanitizedInput = sanitizeProjectInput(input);
  const validation = validateUpdateProject(sanitizedInput);
  
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
  }

  // Check if slug already exists (if slug is being updated)
  if (sanitizedInput.slug) {
    const existingProject = await getProjectBySlug(sanitizedInput.slug);
    if (existingProject && existingProject.id !== id) {
      throw new Error('A project with this slug already exists');
    }
  }

  // Prepare update data
  const updateData: Database['public']['Tables']['projects']['Update'] = {};
  
  if (sanitizedInput.title !== undefined) updateData.title = sanitizedInput.title;
  if (sanitizedInput.slug !== undefined) updateData.slug = sanitizedInput.slug;
  if (sanitizedInput.description !== undefined) updateData.description = sanitizedInput.description || null;
  if (sanitizedInput.cover_path !== undefined) updateData.cover_path = sanitizedInput.cover_path || null;
  if (sanitizedInput.github_url !== undefined) updateData.github_url = sanitizedInput.github_url || null;
  if (sanitizedInput.live_demo_url !== undefined) updateData.live_demo_url = sanitizedInput.live_demo_url || null;
  if (sanitizedInput.tags !== undefined) updateData.tags = sanitizedInput.tags;
  if (sanitizedInput.metadata !== undefined) updateData.metadata = sanitizedInput.metadata;
  
  // Handle publishing
  if (sanitizedInput.published !== undefined) {
    updateData.published = sanitizedInput.published;
    if (sanitizedInput.published) {
      // Set published_at if publishing for the first time
      const currentProject = await getProjectById(id);
      if (currentProject && !currentProject.published_at) {
        updateData.published_at = new Date().toISOString();
      }
    }
  }

  const { data, error } = await (supabase as any)
    .from('projects')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update project: ${error.message}`);
  }

  return transformProjectRow(data);
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<void> {
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete project: ${error.message}`);
  }
}

/**
 * Get projects for the current user
 */
export async function getUserProjects(): Promise<Project[]> {
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('Authentication required');
  }

  return getProjects({ created_by: user.id });
}

/**
 * Server-side functions for static generation
 */

/**
 * Get all published project slugs for static generation
 */
export async function getPublishedProjectSlugs(): Promise<string[]> {
  const { data, error } = await (supabaseAdmin as any)
    .from('projects')
    .select('slug')
    .eq('published', true);

  if (error) {
    throw new Error(`Failed to fetch project slugs: ${error.message}`);
  }

  return data.map((row: any) => row.slug);
}

/**
 * Server-side function to get project by slug
 */
export async function getPublishedProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await (supabaseAdmin as any)
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to fetch project: ${error.message}`);
  }

  return transformProjectRow(data);
}