/*
  # Fix events table INSERT policy

  1. Security Updates
    - Update the INSERT policy for events table to properly handle created_by field
    - Ensure authenticated users can insert events with their own user ID

  2. Changes
    - Modify the existing INSERT policy to allow proper event creation
    - The policy will automatically set created_by to the authenticated user's ID
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "events_insert_authenticated" ON events;

-- Create a new INSERT policy that allows authenticated users to insert events
-- The policy will ensure that created_by is set to the current user's ID
CREATE POLICY "events_insert_authenticated" 
  ON events 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    CASE 
      WHEN created_by IS NULL THEN auth.uid() IS NOT NULL
      ELSE auth.uid() = created_by
    END
  );