/*
  # Fix events table RLS permissions

  1. Security
    - Drop existing problematic RLS policies
    - Create new RLS policies that properly allow authenticated users to insert events
    - Ensure users can only modify their own events
    - Allow public read access to events

  2. Changes
    - Drop and recreate INSERT policy for events table
    - Ensure authenticated users can insert events with proper created_by validation
    - Maintain existing SELECT, UPDATE, and DELETE policies
*/

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "events_insert_authenticated" ON events;
DROP POLICY IF EXISTS "events_select_all_users" ON events;
DROP POLICY IF EXISTS "events_update_own" ON events;
DROP POLICY IF EXISTS "events_delete_own" ON events;

-- Allow public read access to events
CREATE POLICY "events_select_public"
  ON events
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert events
CREATE POLICY "events_insert_authenticated"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Allow users to update their own events
CREATE POLICY "events_update_own"
  ON events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Allow users to delete their own events
CREATE POLICY "events_delete_own"
  ON events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Grant necessary permissions to authenticated role
GRANT SELECT ON events TO authenticated;
GRANT INSERT ON events TO authenticated;
GRANT UPDATE ON events TO authenticated;
GRANT DELETE ON events TO authenticated;

-- Grant SELECT permission to public (anon) role for read access
GRANT SELECT ON events TO anon;