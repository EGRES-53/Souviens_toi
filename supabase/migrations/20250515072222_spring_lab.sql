-- Drop existing policies
DROP POLICY IF EXISTS "Enable storage for authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Suppression pour utilisateurs authentifiés" ON storage.objects;

-- Drop existing column if it exists
ALTER TABLE public.media 
DROP COLUMN IF EXISTS event_id;

-- Add event_id column with correct constraints
ALTER TABLE public.media
ADD COLUMN event_id uuid REFERENCES public.events(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_media_event_id 
ON public.media(event_id);

-- Create new storage policies
CREATE POLICY "Enable storage for authenticated users"
ON storage.objects FOR ALL USING (
  auth.role() = 'authenticated'
) WITH CHECK (
  auth.role() = 'authenticated'
);

CREATE POLICY "Suppression pour utilisateurs authentifiés"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media'
  AND auth.role() = 'authenticated'
);