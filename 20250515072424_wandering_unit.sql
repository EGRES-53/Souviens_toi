/*
  # Fix media table foreign key constraint

  1. Changes
    - Add created_by column to media table with proper foreign key constraint
    - Update existing policies to handle the created_by column
*/

-- Add created_by column with proper foreign key constraint
ALTER TABLE public.media
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);

-- Update policies to handle created_by
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.media;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.media;
DROP POLICY IF EXISTS "Enable update for users based on created_by" ON public.media;
DROP POLICY IF EXISTS "Enable delete for users based on created_by" ON public.media;

-- Create new policies
CREATE POLICY "Enable insert for authenticated users" ON public.media
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND auth.uid() = created_by
  );

CREATE POLICY "Enable read access for all users" ON public.media
  FOR SELECT
  USING (true);

CREATE POLICY "Enable update for users based on created_by" ON public.media
  FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Enable delete for users based on created_by" ON public.media
  FOR DELETE
  USING (auth.uid() = created_by);