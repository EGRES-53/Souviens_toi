/*
  # Add event media relationship

  1. New Tables
    - `event_media`
      - `event_id` (uuid, references events)
      - `media_id` (uuid, references media)
      
  2. Security
    - Enable RLS on event_media table
    - Add policy for authenticated users
*/

-- Create event_media junction table
CREATE TABLE public.event_media (
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
  media_id uuid REFERENCES public.media(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, media_id)
);

-- Enable Row Level Security
ALTER TABLE public.event_media ENABLE ROW LEVEL SECURITY;

-- Create policy for event_media
CREATE POLICY "Authenticated users can manage event_media" ON public.event_media
  FOR ALL USING (auth.role() = 'authenticated');