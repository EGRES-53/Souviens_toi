-- Drop existing persons policies
DROP POLICY IF EXISTS "persons_public_select" ON public.persons;
DROP POLICY IF EXISTS "persons_authenticated_all" ON public.persons;

-- Create new policies for persons table
CREATE POLICY "enable_read_access_for_all" ON public.persons
  FOR SELECT USING (true);

CREATE POLICY "enable_write_access_for_authenticated" ON public.persons
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Ensure RLS is enabled
ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;