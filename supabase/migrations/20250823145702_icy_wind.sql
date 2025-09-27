/*
  # Fix profile avatar upload functionality

  1. Storage Setup
    - Create avatars bucket if it doesn't exist
    - Set up proper storage policies for avatar uploads
    - Allow authenticated users to upload and manage their avatars

  2. Security
    - Users can only upload to their own avatar folder
    - Public read access for avatars
    - Authenticated write/delete access
*/

-- Create avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing avatar policies if they exist
DROP POLICY IF EXISTS "Avatar bucket public read" ON storage.objects;
DROP POLICY IF EXISTS "Avatar bucket authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Avatar bucket authenticated delete" ON storage.objects;

-- Create storage policies for avatars
CREATE POLICY "Avatar bucket public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Avatar bucket authenticated upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Avatar bucket authenticated update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Avatar bucket authenticated delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);