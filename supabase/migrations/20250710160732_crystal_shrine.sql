/*
  # Fix media table RLS policies

  1. Security Changes
    - Drop existing problematic policies on media table
    - Create new policies with correct authentication checks
    - Ensure proper access control for media operations

  2. Policy Updates
    - SELECT: Allow authenticated users to read all media
    - INSERT: Allow authenticated users to create media (with proper created_by assignment)
    - UPDATE: Allow users to update their own media
    - DELETE: Allow users to delete their own media
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON media;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON media;
DROP POLICY IF EXISTS "Enable update for users based on created_by" ON media;
DROP POLICY IF EXISTS "Enable delete for users based on created_by" ON media;

-- Create new policies with correct authentication checks
CREATE POLICY "media_select_authenticated"
  ON media
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "media_insert_authenticated"
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