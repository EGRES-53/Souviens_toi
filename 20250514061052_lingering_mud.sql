/*
  # Fix media table RLS policies

  1. Changes
    - Drop existing media RLS policies
    - Create new comprehensive RLS policies for media table that properly handle file uploads
    
  2. Security
    - Ensure authenticated users can upload media files
    - Maintain security by checking auth.uid() matches created_by
*/

-- Drop existing media policies
DROP POLICY IF EXISTS "Authenticated users can create media" ON public.media;
DROP POLICY IF EXISTS "Authenticated users can view media" ON public.media;
DROP POLICY IF EXISTS "Users can update media they created" ON public.media;
DROP POLICY IF EXISTS "Users can delete media they created" ON public.media;

-- Create new comprehensive media policies
CREATE POLICY "Users can manage their own media"
ON public.media
USING (
  auth.role() = 'authenticated'
  AND (
    created_by = auth.uid()
    OR created_by IS NULL
  )
)
WITH CHECK (
  auth.role() = 'authenticated'
  AND (
    created_by = auth.uid()
    OR created_by IS NULL
  )
);