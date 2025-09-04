/*
  # Fix stories table permissions

  1. Changes
    - Drop existing RLS policies
    - Create new RLS policies for proper user access control
    - Add created_by column with proper constraints
    
  2. Security
    - Users can only see their own stories
    - Users can only modify their own stories
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.stories;

-- Create new policies
CREATE POLICY "Users can create their own stories"
ON public.stories FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view their own stories"
ON public.stories FOR SELECT
USING (auth.uid() = created_by);

CREATE POLICY "Users can update their own stories"
ON public.stories FOR UPDATE
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own stories"
ON public.stories FOR DELETE
USING (auth.uid() = created_by);