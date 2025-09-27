/*
  # Fix media table RLS permissions

  1. Security Updates
    - Drop existing problematic policies
    - Create new policies with proper authentication checks
    - Grant necessary permissions to authenticated users
    - Allow authenticated users to read all media
    - Allow users to manage their own media

  2. Changes
    - Fix SELECT policy to allow authenticated users to read media
    - Fix INSERT/UPDATE/DELETE policies to use proper auth checks
    - Use auth.uid() instead of uid() for consistency
*/

-- Drop existing policies that may be causing issues
DROP POLICY IF EXISTS "media_select_authenticated" ON media;
DROP POLICY IF EXISTS "media_insert_authenticated" ON media;
DROP POLICY IF EXISTS "media_update_own" ON media;
DROP POLICY IF EXISTS "media_delete_own" ON media;

-- Grant necessary permissions to authenticated role
GRANT SELECT, INSERT, UPDATE, DELETE ON media TO authenticated;

-- Create new policies with proper authentication checks
CREATE POLICY "media_select_all"
  ON media
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "media_insert_own"
  ON media
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "media_update_own"
  ON media
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "media_delete_own"
  ON media
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);