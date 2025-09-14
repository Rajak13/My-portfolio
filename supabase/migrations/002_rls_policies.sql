-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Profiles policies
-- Users can view all profiles (for author attribution)
CREATE POLICY "profiles_select_all" ON profiles
    FOR SELECT USING (true);

-- Users can only update their own profile
CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Only authenticated users can insert profiles (handled by trigger)
CREATE POLICY "profiles_insert_own" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Projects policies
-- Anyone can view published projects
CREATE POLICY "projects_select_published" ON projects
    FOR SELECT USING (published = true);

-- Authors can view their own projects (published or not)
CREATE POLICY "projects_select_own" ON projects
    FOR SELECT USING (auth.uid() = created_by);

-- Admins can view all projects
CREATE POLICY "projects_select_admin" ON projects
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Authors can insert their own projects
CREATE POLICY "projects_insert_own" ON projects
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Authors can update their own projects
CREATE POLICY "projects_update_own" ON projects
    FOR UPDATE USING (auth.uid() = created_by);

-- Admins can update any project
CREATE POLICY "projects_update_admin" ON projects
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Authors can delete their own projects
CREATE POLICY "projects_delete_own" ON projects
    FOR DELETE USING (auth.uid() = created_by);

-- Admins can delete any project
CREATE POLICY "projects_delete_admin" ON projects
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Posts policies
-- Anyone can view published posts
CREATE POLICY "posts_select_published" ON posts
    FOR SELECT USING (published = true);

-- Authors can view their own posts (published or not)
CREATE POLICY "posts_select_own" ON posts
    FOR SELECT USING (auth.uid() = created_by);

-- Admins can view all posts
CREATE POLICY "posts_select_admin" ON posts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Authors can insert their own posts
CREATE POLICY "posts_insert_own" ON posts
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Authors can update their own posts
CREATE POLICY "posts_update_own" ON posts
    FOR UPDATE USING (auth.uid() = created_by);

-- Admins can update any post
CREATE POLICY "posts_update_admin" ON posts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Authors can delete their own posts
CREATE POLICY "posts_delete_own" ON posts
    FOR DELETE USING (auth.uid() = created_by);

-- Admins can delete any post
CREATE POLICY "posts_delete_admin" ON posts
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Themes policies
-- Anyone can view public themes
CREATE POLICY "themes_select_public" ON themes
    FOR SELECT USING (is_public = true);

-- Authors can view their own themes
CREATE POLICY "themes_select_own" ON themes
    FOR SELECT USING (auth.uid() = created_by);

-- Admins can view all themes
CREATE POLICY "themes_select_admin" ON themes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Authors can insert their own themes
CREATE POLICY "themes_insert_own" ON themes
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Authors can update their own themes
CREATE POLICY "themes_update_own" ON themes
    FOR UPDATE USING (auth.uid() = created_by);

-- Admins can update any theme
CREATE POLICY "themes_update_admin" ON themes
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Authors can delete their own themes
CREATE POLICY "themes_delete_own" ON themes
    FOR DELETE USING (auth.uid() = created_by);

-- Admins can delete any theme
CREATE POLICY "themes_delete_admin" ON themes
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Translations policies
-- Anyone can view translations (needed for public site)
CREATE POLICY "translations_select_all" ON translations
    FOR SELECT USING (true);

-- Only admins can manage translations
CREATE POLICY "translations_insert_admin" ON translations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "translations_update_admin" ON translations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "translations_delete_admin" ON translations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Media policies
-- Anyone can view media (for public content)
CREATE POLICY "media_select_all" ON media
    FOR SELECT USING (true);

-- Authors can insert their own media
CREATE POLICY "media_insert_own" ON media
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Authors can update their own media
CREATE POLICY "media_update_own" ON media
    FOR UPDATE USING (auth.uid() = created_by);

-- Admins can update any media
CREATE POLICY "media_update_admin" ON media
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Authors can delete their own media
CREATE POLICY "media_delete_own" ON media
    FOR DELETE USING (auth.uid() = created_by);

-- Admins can delete any media
CREATE POLICY "media_delete_admin" ON media
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );