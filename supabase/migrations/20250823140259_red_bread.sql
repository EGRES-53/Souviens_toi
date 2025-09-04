/*
  # Add upload date tracking to media table

  1. Changes
    - Add `uploaded_at` column to media table to track when files were uploaded
    - Update existing records to use created_at as uploaded_at
    - Add index for better performance on date queries

  2. Benefits
    - Track exact upload timestamp
    - Better sorting and filtering by upload date
    - Separate upload date from creation date
*/

-- Add uploaded_at column to media table
ALTER TABLE public.media 
ADD COLUMN IF NOT EXISTS uploaded_at timestamptz DEFAULT now();

-- Update existing records to set uploaded_at to created_at
UPDATE public.media 
SET uploaded_at = created_at 
WHERE uploaded_at IS NULL;

-- Make uploaded_at NOT NULL after updating existing records
ALTER TABLE public.media 
ALTER COLUMN uploaded_at SET NOT NULL;

-- Add index for better performance on upload date queries
CREATE INDEX IF NOT EXISTS idx_media_uploaded_at 
ON public.media(uploaded_at DESC);

-- Add index for filtering by upload date and event
CREATE INDEX IF NOT EXISTS idx_media_event_uploaded 
ON public.media(event_id, uploaded_at DESC);