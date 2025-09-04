/*
  # Fix media table and policies

  1. Changes
    - Drop existing policies
    - Drop and recreate created_by column with proper constraints
    - Create new policies for media management
    
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.media;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.media;
DROP POLICY IF EXISTS "Enable update for users based on created_by" ON public.media;
DROP POLICY IF EXISTS "Enable delete for users based on created_by" ON public.media;

-- Drop and recreate created_by column
ALTER TABLE public.media 
DROP COLUMN IF EXISTS created_by CASCADE;

ALTER TABLE public.media
ADD COLUMN created_by uuid REFERENCES auth.users(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_media_created_by 
ON public.media(created_by);

-- Create new policies
CREATE POLICY "Enable all access for authenticated users" ON public.media
  FOR ALL USING (
    auth.role() = 'authenticated'
  ) WITH CHECK (
    auth.role() = 'authenticated'
  );

-- Update storage policies
DROP POLICY IF EXISTS "Enable storage for authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Media bucket public access" ON storage.objects;

CREATE POLICY "Media bucket access"
ON storage.objects FOR ALL
USING (bucket_id = 'media')
WITH CHECK (bucket_id = 'media');