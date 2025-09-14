# Supabase Database Setup

This directory contains the database schema, migrations, and setup files for the multilingual portfolio project.

## Files Overview

- `migrations/001_initial_schema.sql` - Creates all tables, indexes, and triggers
- `migrations/002_rls_policies.sql` - Sets up Row Level Security policies
- `migrations/003_storage_setup.sql` - Creates storage buckets and policies
- `seed.sql` - Initial data for translations and themes

## Database Schema

### Tables

1. **profiles** - User profiles linked to auth.users
2. **projects** - Portfolio projects with metadata
3. **posts** - Blog posts with language support
4. **themes** - Visual themes with JSON configuration
5. **translations** - UI translations for internationalization
6. **media** - File metadata for uploaded media

### Storage Buckets

1. **avatars** - User profile pictures (5MB limit)
2. **media** - General media files (10MB limit)

## Setup Instructions

1. Create a new Supabase project
2. Run the migrations in order:
   ```sql
   -- Run in Supabase SQL Editor
   \i migrations/001_initial_schema.sql
   \i migrations/002_rls_policies.sql
   \i migrations/003_storage_setup.sql
   ```
3. Optionally run the seed data:
   ```sql
   \i seed.sql
   ```

## Environment Variables

Make sure to set these in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Row Level Security

All tables have RLS enabled with the following access patterns:

- **Public content** (published projects/posts) - readable by anyone
- **User content** - users can manage their own content
- **Admin content** - admins can manage all content
- **Translations** - readable by all, manageable by admins only

## Storage Policies

- **Avatars** - users can upload to their own folder
- **Media** - authenticated users can upload, organized by user ID
- **Public access** - all uploaded files are publicly readable

## Authentication

The system uses Supabase Auth with:
- Email/password authentication
- GitHub OAuth (configurable)
- Automatic profile creation on signup
- Role-based access control (admin, editor, author)