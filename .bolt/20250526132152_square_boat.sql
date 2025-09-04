/*
  # Fix profile creation and auth flow

  1. Changes
    - Add trigger to automatically create profile on user creation
    - Update profile policies to ensure proper access
    - Add missing profile columns
*/

-- Create trigger function to create profile on user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, created_at, updated_at)
  VALUES (NEW.id, '', NOW(), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure all required columns exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS full_name text DEFAULT '',
ADD COLUMN IF NOT EXISTS education_level text,
ADD COLUMN IF NOT EXISTS institution text,
ADD COLUMN IF NOT EXISTS biography text,
ADD COLUMN IF NOT EXISTS avatar_url text;

-- Update RLS policies
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

CREATE POLICY "Users can manage their own profile"
ON public.profiles FOR ALL
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles"
ON public.profiles FOR ALL
USING (auth.uid() IN (SELECT id FROM public.admin_users))
WITH CHECK (auth.uid() IN (SELECT id FROM public.admin_users));