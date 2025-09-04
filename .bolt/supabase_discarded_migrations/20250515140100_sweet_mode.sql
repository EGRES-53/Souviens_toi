/*
  # Fix CORS policies

  1. Changes
    - Add proper CORS policies for all tables
    - Enable public access with proper security checks
*/

-- Update storage policies to allow CORS
DROP POLICY IF EXISTS "Media bucket access" ON storage.objects;

CREATE POLICY "Media bucket public access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'media' );

CREATE POLICY "Media bucket authenticated access"
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'media'
  AND auth.role() = 'authenticated'
);

-- Update RLS policies for persons table
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.persons;

CREATE POLICY "Public read access for persons"
ON public.persons FOR SELECT
USING ( true );

CREATE POLICY "Authenticated users can manage persons"
ON public.persons FOR ALL
USING ( auth.role() = 'authenticated' )
WITH CHECK ( auth.role() = 'authenticated' );