-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('media', 'media', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']);

-- Storage policies for avatars bucket
CREATE POLICY "avatars_select_all" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "avatars_insert_authenticated" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "avatars_update_own" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "avatars_delete_own" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Storage policies for media bucket
CREATE POLICY "media_select_all" ON storage.objects
    FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "media_insert_authenticated" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'media' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "media_update_own" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'media' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "media_delete_own" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'media' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Allow admins to manage all media
CREATE POLICY "media_admin_all" ON storage.objects
    FOR ALL USING (
        bucket_id = 'media' 
        AND EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );