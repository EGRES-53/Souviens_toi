/*
  # Initial schema setup for SOUVIENS_TOI

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `full_name` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
    
    - `persons`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `birth_date` (date)
      - `birth_place` (text)
      - `death_date` (date)
      - `death_place` (text)
      - `bio` (text)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
      - `created_by` (uuid, references profiles)
    
    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `date` (date)
      - `location` (text)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
      - `created_by` (uuid, references profiles)
    
    - `media`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `url` (text)
      - `type` (text)
      - `date` (date)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
      - `created_by` (uuid, references profiles)

    - `person_events`
      - `person_id` (uuid, references persons)
      - `event_id` (uuid, references events)
      - `role` (text)
    
    - `person_media`
      - `person_id` (uuid, references persons)
      - `media_id` (uuid, references media)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create persons table
CREATE TABLE public.persons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  birth_date date,
  birth_place text,
  death_date date,
  death_place text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES public.profiles(id)
);

-- Create events table
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date date NOT NULL,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES public.profiles(id)
);

-- Create media table
CREATE TABLE public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  url text NOT NULL,
  type text NOT NULL,
  date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES public.profiles(id)
);

-- Create person_events junction table
CREATE TABLE public.person_events (
  person_id uuid REFERENCES public.persons(id) ON DELETE CASCADE,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
  role text,
  PRIMARY KEY (person_id, event_id)
);

-- Create person_media junction table
CREATE TABLE public.person_media (
  person_id uuid REFERENCES public.persons(id) ON DELETE CASCADE,
  media_id uuid REFERENCES public.media(id) ON DELETE CASCADE,
  PRIMARY KEY (person_id, media_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.person_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.person_media ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Authenticated users can create persons" ON public.persons
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view persons" ON public.persons
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update persons they created" ON public.persons
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete persons they created" ON public.persons
  FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can create events" ON public.events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view events" ON public.events
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update events they created" ON public.events
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete events they created" ON public.events
  FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can create media" ON public.media
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view media" ON public.media
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update media they created" ON public.media
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete media they created" ON public.media
  FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can manage person_events" ON public.person_events
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage person_media" ON public.person_media
  FOR ALL USING (auth.role() = 'authenticated');

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_persons_updated_at
  BEFORE UPDATE ON public.persons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at
  BEFORE UPDATE ON public.media
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();