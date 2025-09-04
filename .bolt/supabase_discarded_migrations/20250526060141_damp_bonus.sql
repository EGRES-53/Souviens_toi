-- Enable RLS for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remove any existing policies for profiles table
DROP POLICY IF EXISTS "Enable all access for all users" ON public.profiles;

-- Create policies for profiles table
CREATE POLICY "Enable read access to own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Enable insert access to own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update access to own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Keep existing policies for other tables
CREATE POLICY "Enable all access for all users" ON public.persons
  FOR ALL USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all access for all users" ON public.events
  FOR ALL USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all access for all users" ON public.media
  FOR ALL USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all access for all users" ON public.relations
  FOR ALL USING (true)
  WITH CHECK (true);

-- Keep RLS enabled for other tables
ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relations ENABLE ROW LEVEL SECURITY;