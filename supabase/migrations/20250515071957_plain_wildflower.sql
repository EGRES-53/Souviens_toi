/*
  # Fix media table schema

  1. Changes
    - Drop existing event_id column if it exists
    - Add event_id column with correct constraints
    - Update storage policies
*/

-- Drop existing column if it exists
ALTER TABLE public.media 
DROP COLUMN IF EXISTS event_id;

-- Add event_id column with correct constraints
ALTER TABLE public.media
ADD COLUMN event_id uuid REFERENCES public.events(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_media_event_id 
ON public.media(event_id);

-- Update storage policies
CREATE POLICY "Enable storage for authenticated users"
ON storage.objects FOR ALL USING (
  auth.role() = 'authenticated'
) WITH CHECK (
  auth.role() = 'authenticated'
);