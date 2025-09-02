/*
  # Update profiles table and authentication rules

  1. Changes
    - Add new profile fields (education_level, institution, biography)
    - Add admin role and policies
    - Update existing profile policies
    
  2. Security
    - Admin users can access all data
    - Regular users can only access their own data
*/

-- Add new columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS education_level text,
ADD COLUMN IF NOT EXISTS institution text,
ADD COLUMN IF NOT EXISTS biography text;

-- Create admin role
CREATE ROLE admin;

-- Create admin users table
CREATE TABLE public.admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS for admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Update profiles policies
DROP POLICY IF EXISTS "Enable read access to own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert access to own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable update access to own profile" ON public.profiles;

-- New policies for profiles
CREATE POLICY "Admins can access all profiles"
ON public.profiles
FOR ALL
USING (
  auth.uid() IN (SELECT id FROM public.admin_users)
)
WITH CHECK (
  auth.uid() IN (SELECT id FROM public.admin_users)
);

CREATE POLICY "Users can access own profile"
ON public.profiles
FOR ALL
USING (
  auth.uid() = id
)
WITH CHECK (
  auth.uid() = id
);

-- Update policies for other tables
CREATE POLICY "Admins can access all persons"
ON public.persons
FOR ALL
USING (
  auth.uid() IN (SELECT id FROM public.admin_users)
)
WITH CHECK (
  auth.uid() IN (SELECT id FROM public.admin_users)
);

CREATE POLICY "Users can access own persons"
ON public.persons
FOR ALL
USING (
  created_by = auth.uid()
)
WITH CHECK (
  created_by = auth.uid()
);

-- Similar policies for events
CREATE POLICY "Admins can access all events"
ON public.events
FOR ALL
USING (
  auth.uid() IN (SELECT id FROM public.admin_users)
)
WITH CHECK (
  auth.uid() IN (SELECT id FROM public.admin_users)
);

CREATE POLICY "Users can access own events"
ON public.events
FOR ALL
USING (
  created_by = auth.uid()
)
WITH CHECK (
  created_by = auth.uid()
);

-- Similar policies for media
CREATE POLICY "Admins can access all media"
ON public.media
FOR ALL
USING (
  auth.uid() IN (SELECT id FROM public.admin_users)
)
WITH CHECK (
  auth.uid() IN (SELECT id FROM public.admin_users)
);

CREATE POLICY "Users can access own media"
ON public.media
FOR ALL
USING (
  created_by = auth.uid()
)
WITH CHECK (
  created_by = auth.uid()
);