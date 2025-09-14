export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string
          role: 'admin' | 'editor' | 'author'
          bio: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name: string
          role?: 'admin' | 'editor' | 'author'
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          role?: 'admin' | 'editor' | 'author'
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          cover_path: string | null
          github_url: string | null
          live_demo_url: string | null
          tags: string[]
          metadata: Json
          published: boolean
          published_at: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          cover_path?: string | null
          github_url?: string | null
          live_demo_url?: string | null
          tags?: string[]
          metadata?: Json
          published?: boolean
          published_at?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          cover_path?: string | null
          github_url?: string | null
          live_demo_url?: string | null
          tags?: string[]
          metadata?: Json
          published?: boolean
          published_at?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          body: string
          cover_path: string | null
          tags: string[]
          language: 'en' | 'ne'
          published: boolean
          published_at: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          body: string
          cover_path?: string | null
          tags?: string[]
          language: 'en' | 'ne'
          published?: boolean
          published_at?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          body?: string
          cover_path?: string | null
          tags?: string[]
          language?: 'en' | 'ne'
          published?: boolean
          published_at?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      themes: {
        Row: {
          id: string
          slug: string
          name: string
          data: Json
          is_public: boolean
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          data: Json
          is_public?: boolean
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          data?: Json
          is_public?: boolean
          created_by?: string
          created_at?: string
        }
      }
      translations: {
        Row: {
          id: string
          key: string
          language: 'en' | 'ne'
          value: string
        }
        Insert: {
          id?: string
          key: string
          language: 'en' | 'ne'
          value: string
        }
        Update: {
          id?: string
          key?: string
          language?: 'en' | 'ne'
          value?: string
        }
      }
      media: {
        Row: {
          id: string
          filename: string
          path: string
          size: number
          mime_type: string
          alt_text: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          filename: string
          path: string
          size: number
          mime_type: string
          alt_text?: string | null
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          filename?: string
          path?: string
          size?: number
          mime_type?: string
          alt_text?: string | null
          created_by?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}