/*
  # Fix events table SELECT policy for authenticated users

  1. Security Changes
    - Update the events SELECT policy to allow both public and authenticated users to read events
    - This ensures that authenticated users can view the timeline page without permission errors

  The current policy only allows "public" role to read events, but authenticated users have 
  the "authenticated" role, causing permission denied errors.
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "events_select_public" ON events;

-- Create a new policy that allows both public and authenticated users to read events
CREATE POLICY "events_select_all_users" 
  ON events 
  FOR SELECT 
  TO public, authenticated
  USING (true);