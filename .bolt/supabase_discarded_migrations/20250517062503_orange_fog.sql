/*
  # Add event media linking functionality

  1. New Tables
    - `event_media_links`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events)
      - `media_id` (uuid, references media)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamptz)
*/

CREATE TABLE public.event_media_links (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
    media_id uuid REFERENCES public.media(id) ON DELETE CASCADE,
    created_by uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now(),
    UNIQUE(event_id, media_id)
);

-- Enable RLS
ALTER TABLE public.event_media_links ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own links"
ON public.event_media_links
FOR ALL
USING (
    auth.uid() = created_by
)
WITH CHECK (
    auth.uid() = created_by
);