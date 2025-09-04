/*
  # Fix persons table policies

  1. Changes
    - Drop existing policies
    - Create new comprehensive policies for persons table
    - Ensure proper access control for authenticated users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "enable_read_access_for_all" ON public.persons;
DROP POLICY IF EXISTS "enable_write_access_for_authenticated" ON public.persons;

-- Create new policies
CREATE POLICY "Enable read access for all users" ON public.persons
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.persons
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.persons
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON public.persons
  FOR DELETE USING (auth.role() = 'authenticated');

-- Ensure RLS is enabled
ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;