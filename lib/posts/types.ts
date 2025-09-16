/**
 * Post Management System Types
 * 
 * TypeScript interfaces and types for the blog post management functionality
 */

export type LanguageCode = 'en' | 'ne';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  body: string;
  cover_path?: string;
  tags: string[];
  language: LanguageCode;
  published: boolean;
  published_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePostInput {
  title: string;
  slug: string;
  excerpt?: string;
  body: string;
  cover_path?: string;
  tags?: string[];
  language?: LanguageCode;
  published?: boolean;
}

export interface UpdatePostInput {
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  cover_path?: string;
  tags?: string[];
  language?: LanguageCode;
  published?: boolean;
}

export interface PostFilters {
  published?: boolean;
  language?: LanguageCode;
  tags?: string[];
  created_by?: string;
  search?: string;
}

export interface PostCardProps {
  post: Post;
  className?: string;
  onClick?: (post: Post) => void;
}

export interface PostGridProps {
  posts: Post[];
  className?: string;
  onPostClick?: (post: Post) => void;
  showLanguageFilter?: boolean;
}

export interface PostDetailProps {
  post: Post;
  className?: string;
}

export interface PostFormProps {
  post?: Post;
  onSubmit: (data: CreatePostInput | UpdatePostInput) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Database types (matching Supabase schema)
export interface PostRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  cover_path: string | null;
  tags: string[];
  language: LanguageCode;
  published: boolean;
  published_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}