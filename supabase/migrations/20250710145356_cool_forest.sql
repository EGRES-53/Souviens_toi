/*
  # Fix events table permissions

  1. Security Updates
    - Update RLS policies for events table to ensure proper access
    - Allow authenticated users to read all events
    - Allow authenticated users to create, update, and delete events they created
    - Enable public read access for events

  2. Changes
    - Drop existing policies that may be conflicting
    - Create new comprehensive policies for all CRUD operations
    - Ensure RLS is properly enabled
*/

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Public access policy" ON events;

-- Enable RLS on events table (should already be enabled but ensuring it)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read events (public access)
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

-- Allow users to update events they created
CREATE POLICY "events_update_own"
  ON events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Allow users to delete events they created
CREATE POLICY "events_delete_own"
  ON events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);