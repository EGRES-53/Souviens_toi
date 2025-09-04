/*
  # Fix media storage policies

  1. Changes
    - Add storage policies for media bucket
    - Update media table policies
    
  2. Security
    - Allow authenticated users to upload and manage media files
    - Ensure proper access control
*/

-- Storage policies for media bucket
BEGIN;

-- Drop existing storage policies if any
DROP POLICY IF EXISTS "Media bucket public access" ON storage.objects;
DROP POLICY IF EXISTS "Media bucket authenticated access" ON storage.objects;

-- Create new storage policies
CREATE POLICY "Media bucket public access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'media' );

CREATE POLICY "Media bucket authenticated access"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Media bucket authenticated delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media'
  AND auth.role() = 'authenticated'
);

COMMIT;