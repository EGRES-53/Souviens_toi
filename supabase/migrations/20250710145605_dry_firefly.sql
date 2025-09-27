/*
  # Fix events table RLS policy for authenticated users

  1. Changes
    - Drop existing policy if it exists
    - Create new policy that allows both public and authenticated users to read events
    
  2. Security
    - Allow SELECT access for all users (public and authenticated)
    - Maintain existing INSERT/UPDATE/DELETE policies
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "events_select_public" ON events;

-- Drop the new policy if it already exists (to handle re-runs)
DROP POLICY IF EXISTS "events_select_all_users" ON events;

-- Create a new policy that allows both public and authenticated users to read events
CREATE POLICY "events_select_all_users"
  ON events
  FOR SELECT
  TO public, authenticated
  USING (true);