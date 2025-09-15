/**
 * Project Management System Types
 * 
 * TypeScript interfaces and types for the project management functionality
 */

export interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string;
  cover_path?: string;
  github_url?: string;
  live_demo_url?: string;
  tags: string[];
  metadata: ProjectMetadata;
  published: boolean;
  published_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectMetadata {
  tech_stack?: string[];
  duration?: string;
  role?: string;
  [key: string]: any;
}

export interface CreateProjectInput {
  title: string;
  slug: string;
  description?: string;
  cover_path?: string;
  github_url?: string;
  live_demo_url?: string;
  tags?: string[];
  metadata?: ProjectMetadata;
  published?: boolean;
}

export interface UpdateProjectInput {
  title?: string;
  slug?: string;
  description?: string;
  cover_path?: string;
  github_url?: string;
  live_demo_url?: string;
  tags?: string[];
  metadata?: ProjectMetadata;
  published?: boolean;
}

export interface ProjectFilters {
  published?: boolean;
  tags?: string[];
  created_by?: string;
  search?: string;
}

export interface ProjectCardProps {
  project: Project;
  className?: string;
  onClick?: (project: Project) => void;
}

export interface ProjectGridProps {
  projects: Project[];
  className?: string;
  onProjectClick?: (project: Project) => void;
}

export interface ProjectDetailProps {
  project: Project;
  className?: string;
}

export interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: CreateProjectInput | UpdateProjectInput) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

// Database types (matching Supabase schema)
export interface ProjectRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_path: string | null;
  github_url: string | null;
  live_demo_url: string | null;
  tags: string[];
  metadata: Record<string, any>;
  published: boolean;
  published_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}