/*
  # Fix media table RLS policies

  1. Changes
    - Drop existing media table RLS policies
    - Create new comprehensive RLS policies for media table
    - Allow authenticated users to manage media files
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own media" ON public.media;

-- Create new policies
CREATE POLICY "Enable insert for authenticated users" ON public.media
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON public.media
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on created_by" ON public.media
  FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Enable delete for users based on created_by" ON public.media
  FOR DELETE
  USING (auth.uid() = created_by);