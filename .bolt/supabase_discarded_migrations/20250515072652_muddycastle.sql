-- Drop existing policies that depend on created_by
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.media;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.media;
DROP POLICY IF EXISTS "Enable update for users based on created_by" ON public.media;
DROP POLICY IF EXISTS "Enable delete for users based on created_by" ON public.media;

-- Drop and recreate created_by column
ALTER TABLE public.media 
DROP COLUMN IF EXISTS created_by CASCADE;

ALTER TABLE public.media
ADD COLUMN created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_media_created_by 
ON public.media(created_by);

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
