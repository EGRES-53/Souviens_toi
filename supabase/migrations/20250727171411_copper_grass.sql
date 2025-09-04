/*
  # Complete schema setup for existing Supabase project

  1. Missing Tables
    - `relations` table for family relationships
    - Add missing columns to existing tables if needed

  2. Missing Columns
    - Add `precise_date` to events table if missing
    - Add `event_id` to media table if missing
    - Ensure all required columns exist

  3. Storage Setup
    - Create media bucket for file uploads
    - Set up storage policies

  4. Security Policies
    - Comprehensive RLS policies for all tables
    - Proper authentication and authorization

  5. Functions and Triggers
    - Update timestamp functions
    - Automatic profile creation on user signup
*/

-- Create relations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.relations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person1_id uuid REFERENCES public.persons(id) ON DELETE CASCADE,
  person2_id uuid REFERENCES public.persons(id) ON DELETE CASCADE,
  relation_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add missing columns to existing tables
DO $$
BEGIN
  -- Add precise_date to events if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'precise_date'
  ) THEN
    ALTER TABLE public.events ADD COLUMN precise_date boolean NOT NULL DEFAULT true;
  END IF;

  -- Add event_id to media if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'media' AND column_name = 'event_id'
  ) THEN
    ALTER TABLE public.media ADD COLUMN event_id uuid REFERENCES public.events(id) ON DELETE CASCADE;
  END IF;

  -- Add created_by to tables if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE public.events ADD COLUMN created_by uuid REFERENCES auth.users(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'media' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE public.media ADD COLUMN created_by uuid REFERENCES auth.users(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'persons' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE public.persons ADD COLUMN created_by uuid REFERENCES auth.users(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stories' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE public.stories ADD COLUMN created_by uuid REFERENCES auth.users(id);
  END IF;

  -- Add updated_at columns if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.events ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'media' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.media ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'persons' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.persons ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stories' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.stories ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_media_event_id ON public.media(event_id);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON public.events(created_by);
CREATE INDEX IF NOT EXISTS idx_media_created_by ON public.media(created_by);
CREATE INDEX IF NOT EXISTS idx_persons_created_by ON public.persons(created_by);
CREATE INDEX IF NOT EXISTS idx_stories_created_by ON public.stories(created_by);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Profiles policies
CREATE POLICY "profiles_select_public" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Events policies
DROP POLICY IF EXISTS "events_select_public" ON public.events;
DROP POLICY IF EXISTS "events_insert_authenticated" ON public.events;
DROP POLICY IF EXISTS "events_update_own" ON public.events;
DROP POLICY IF EXISTS "events_delete_own" ON public.events;

CREATE POLICY "events_select_all" ON public.events
  FOR SELECT TO public, authenticated USING (true);

CREATE POLICY "events_insert_authenticated" ON public.events
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "events_update_own" ON public.events
  FOR UPDATE TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "events_delete_own" ON public.events
  FOR DELETE TO authenticated
  USING (auth.uid() = created_by);

-- Media policies
DROP POLICY IF EXISTS "media_select_all" ON public.media;
DROP POLICY IF EXISTS "media_insert_own" ON public.media;
DROP POLICY IF EXISTS "media_update_own" ON public.media;
DROP POLICY IF EXISTS "media_delete_own" ON public.media;

CREATE POLICY "media_select_all" ON public.media
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "media_insert_own" ON public.media
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "media_update_own" ON public.media
  FOR UPDATE TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "media_delete_own" ON public.media
  FOR DELETE TO authenticated
  USING (auth.uid() = created_by);

-- Persons policies
DROP POLICY IF EXISTS "persons_select_authenticated" ON public.persons;
DROP POLICY IF EXISTS "persons_insert_authenticated" ON public.persons;
DROP POLICY IF EXISTS "persons_update_own" ON public.persons;
DROP POLICY IF EXISTS "persons_delete_own" ON public.persons;

CREATE POLICY "persons_select_authenticated" ON public.persons
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "persons_insert_authenticated" ON public.persons
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "persons_update_own" ON public.persons
  FOR UPDATE TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "persons_delete_own" ON public.persons
  FOR DELETE TO authenticated
  USING (auth.uid() = created_by);

-- Stories policies
DROP POLICY IF EXISTS "stories_select_own" ON public.stories;
DROP POLICY IF EXISTS "stories_insert_own" ON public.stories;
DROP POLICY IF EXISTS "stories_update_own" ON public.stories;
DROP POLICY IF EXISTS "stories_delete_own" ON public.stories;

CREATE POLICY "stories_select_own" ON public.stories
  FOR SELECT TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "stories_insert_own" ON public.stories
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "stories_update_own" ON public.stories
  FOR UPDATE TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "stories_delete_own" ON public.stories
  FOR DELETE TO authenticated
  USING (auth.uid() = created_by);

-- Relations policies
CREATE POLICY "relations_select_authenticated" ON public.relations
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "relations_insert_authenticated" ON public.relations
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "relations_update_authenticated" ON public.relations
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "relations_delete_authenticated" ON public.relations
  FOR DELETE TO authenticated USING (true);

-- Create or replace update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
DROP TRIGGER IF EXISTS update_media_updated_at ON public.media;
DROP TRIGGER IF EXISTS update_persons_updated_at ON public.persons;
DROP TRIGGER IF EXISTS update_stories_updated_at ON public.stories;
DROP TRIGGER IF EXISTS update_relations_updated_at ON public.relations;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at
  BEFORE UPDATE ON public.media
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_persons_updated_at
  BEFORE UPDATE ON public.persons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stories_updated_at
  BEFORE UPDATE ON public.stories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_relations_updated_at
  BEFORE UPDATE ON public.relations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.persons TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.relations TO authenticated;

GRANT SELECT ON public.events TO anon;

-- Create storage bucket for media if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Media bucket public access" ON storage.objects;
DROP POLICY IF EXISTS "Media bucket authenticated access" ON storage.objects;
DROP POLICY IF EXISTS "Media bucket authenticated delete" ON storage.objects;

CREATE POLICY "Media bucket public access"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

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

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, updated_at)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();