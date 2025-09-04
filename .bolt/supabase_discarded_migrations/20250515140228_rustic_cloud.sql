-- Drop existing policies
DROP POLICY IF EXISTS "Media bucket authenticated access" ON storage.objects;
DROP POLICY IF EXISTS "Media bucket public access" ON storage.objects;

-- Create new storage policies with unique names
CREATE POLICY "storage_objects_public_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "storage_objects_authenticated_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'media'
    AND auth.role() = 'authenticated'
  );

-- Add CORS headers to storage responses
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Update persons table policies
DROP POLICY IF EXISTS "Public read access for persons" ON public.persons;
DROP POLICY IF EXISTS "Authenticated users can manage persons" ON public.persons;

CREATE POLICY "persons_public_select" ON public.persons
  FOR SELECT USING (true);

CREATE POLICY "persons_authenticated_all" ON public.persons
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');