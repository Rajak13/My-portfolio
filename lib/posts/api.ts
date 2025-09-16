/**
 * Post API Functions
 * 
 * CRUD operations for blog posts using Supabase client
 */

import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/server';
import { Database } from '@/lib/supabase/types';
import { 
  Post, 
  PostRow, 
  CreatePostInput, 
  UpdatePostInput, 
  PostFilters,
  LanguageCode
} from './types';
import { validateCreatePost, validateUpdatePost, sanitizePostInput } from './validation';

/**
 * Transforms database row to Post interface
 */
function transformPostRow(row: PostRow): Post {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || undefined,
    body: row.body,
    cover_path: row.cover_path || undefined,
    tags: row.tags || [],
    language: row.language,
    published: row.published,
    published_at: row.published_at || undefined,
    created_by: row.created_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/**
 * Get all posts with optional filtering
 */
export async function getPosts(filters?: PostFilters): Promise<Post[]> {
  
  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  // Apply filters
  if (filters?.published !== undefined) {
    query = query.eq('published', filters.published);
  }

  if (filters?.language) {
    query = query.eq('language', filters.language);
  }

  if (filters?.created_by) {
    query = query.eq('created_by', filters.created_by);
  }

  if (filters?.tags && filters.tags.length > 0) {
    query = query.overlaps('tags', filters.tags);
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%,body.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }

  return data.map(transformPostRow);
}

/**
 * Get published posts (public API)
 */
export async function getPublishedPosts(language?: LanguageCode): Promise<Post[]> {
  const filters: PostFilters = { published: true };
  if (language) {
    filters.language = language;
  }
  return getPosts(filters);
}

/**
 * Get post by ID
 */
export async function getPostById(id: string): Promise<Post | null> {
  
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to fetch post: ${error.message}`);
  }

  return transformPostRow(data);
}

/**
 * Get post by slug and language
 */
export async function getPostBySlug(slug: string, language: LanguageCode): Promise<Post | null> {
  
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('language', language)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to fetch post: ${error.message}`);
  }

  return transformPostRow(data);
}

/**
 * Create a new post
 */
export async function createPost(input: CreatePostInput): Promise<Post> {
  
  // Validate input
  const sanitizedInput = sanitizePostInput(input);
  const validation = validateCreatePost(sanitizedInput);
  
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
  }

  // Set default language if not provided
  const language = sanitizedInput.language || 'en';

  // Check if slug already exists for this language
  const existingPost = await getPostBySlug(sanitizedInput.slug, language);
  if (existingPost) {
    throw new Error(`A post with this slug already exists in ${language}`);
  }

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('Authentication required');
  }

  // Prepare data for insertion
  const postData: Database['public']['Tables']['posts']['Insert'] = {
    title: sanitizedInput.title,
    slug: sanitizedInput.slug,
    excerpt: sanitizedInput.excerpt || null,
    body: sanitizedInput.body,
    cover_path: sanitizedInput.cover_path || null,
    tags: sanitizedInput.tags || [],
    language: language,
    published: sanitizedInput.published || false,
    published_at: sanitizedInput.published ? new Date().toISOString() : null,
    created_by: user.id,
  };

  const { data, error } = await (supabase as any)
    .from('posts')
    .insert(postData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create post: ${error.message}`);
  }

  return transformPostRow(data);
}

/**
 * Update an existing post
 */
export async function updatePost(id: string, input: UpdatePostInput): Promise<Post> {
  
  // Validate input
  const sanitizedInput = sanitizePostInput(input);
  const validation = validateUpdatePost(sanitizedInput);
  
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
  }

  // Check if slug already exists (if slug or language is being updated)
  if (sanitizedInput.slug || sanitizedInput.language) {
    const currentPost = await getPostById(id);
    if (!currentPost) {
      throw new Error('Post not found');
    }

    const newSlug = sanitizedInput.slug || currentPost.slug;
    const newLanguage = sanitizedInput.language || currentPost.language;

    const existingPost = await getPostBySlug(newSlug, newLanguage);
    if (existingPost && existingPost.id !== id) {
      throw new Error(`A post with this slug already exists in ${newLanguage}`);
    }
  }

  // Prepare update data
  const updateData: Database['public']['Tables']['posts']['Update'] = {};
  
  if (sanitizedInput.title !== undefined) updateData.title = sanitizedInput.title;
  if (sanitizedInput.slug !== undefined) updateData.slug = sanitizedInput.slug;
  if (sanitizedInput.excerpt !== undefined) updateData.excerpt = sanitizedInput.excerpt || null;
  if (sanitizedInput.body !== undefined) updateData.body = sanitizedInput.body;
  if (sanitizedInput.cover_path !== undefined) updateData.cover_path = sanitizedInput.cover_path || null;
  if (sanitizedInput.tags !== undefined) updateData.tags = sanitizedInput.tags;
  if (sanitizedInput.language !== undefined) updateData.language = sanitizedInput.language;
  
  // Handle publishing
  if (sanitizedInput.published !== undefined) {
    updateData.published = sanitizedInput.published;
    if (sanitizedInput.published) {
      // Set published_at if publishing for the first time
      const currentPost = await getPostById(id);
      if (currentPost && !currentPost.published_at) {
        updateData.published_at = new Date().toISOString();
      }
    }
  }

  const { data, error } = await (supabase as any)
    .from('posts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update post: ${error.message}`);
  }

  return transformPostRow(data);
}

/**
 * Delete a post
 */
export async function deletePost(id: string): Promise<void> {
  
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete post: ${error.message}`);
  }
}

/**
 * Get posts for the current user
 */
export async function getUserPosts(): Promise<Post[]> {
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('Authentication required');
  }

  return getPosts({ created_by: user.id });
}

/**
 * Publish a post (convenience function)
 */
export async function publishPost(id: string): Promise<Post> {
  return updatePost(id, { published: true });
}

/**
 * Unpublish a post (convenience function)
 */
export async function unpublishPost(id: string): Promise<Post> {
  return updatePost(id, { published: false });
}

/**
 * Server-side functions for static generation
 */

/**
 * Get all published post slugs for static generation
 */
export async function getPublishedPostSlugs(): Promise<Array<{ slug: string; language: LanguageCode }>> {
  const { data, error } = await (supabaseAdmin as any)
    .from('posts')
    .select('slug, language')
    .eq('published', true);

  if (error) {
    throw new Error(`Failed to fetch post slugs: ${error.message}`);
  }

  return data.map((row: any) => ({ slug: row.slug, language: row.language }));
}

/**
 * Server-side function to get post by slug and language
 */
export async function getPublishedPostBySlug(slug: string, language: LanguageCode): Promise<Post | null> {
  const { data, error } = await (supabaseAdmin as any)
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('language', language)
    .eq('published', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to fetch post: ${error.message}`);
  }

  return transformPostRow(data);
}

/**
 * Server-side function to get all published posts
 */
export async function getAllPublishedPosts(language?: LanguageCode): Promise<Post[]> {
  let query = (supabaseAdmin as any)
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (language) {
    query = query.eq('language', language);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch published posts: ${error.message}`);
  }

  return data.map(transformPostRow);
}